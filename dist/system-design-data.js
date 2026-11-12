const designGroups = [
  {name:"Beginner", summary:"Traffic, fast reads, and basic reliability", topics:[
    {
      title:"Load balancer", flow:"Client → load balancer → healthy API replicas",
      theory:"A load balancer distributes requests across replicas and removes unhealthy instances from rotation. With stateless API replicas, any instance can serve the next request. Store durable session state outside the replicas.",
      example:"A support copilot runs three API replicas. One fails its readiness check during a rollout. New requests go to the other two while the deployment drains existing streams from the old instance.",
      answer:"I’d start with a managed balancer and readiness checks. Streaming calls vary in duration, so I’d compare least-outstanding-request routing with round robin. I’d monitor active streams and p95 latency per replica."
    },
    {
      title:"Caching", flow:"Request → exact cache lookup → source on a miss",
      theory:"Cache-aside means the application checks a cache before reading the source of truth. On a miss it fetches and stores the value. A TTL bounds staleness when invalidation is missed, and a versioned key can invalidate old results after an update.",
      example:"A help desk caches the current help-center index metadata by tenant and corpus version. Publishing new policy documents changes the version. Requests for the new corpus read fresh metadata automatically.",
      answer:"I’d decide how stale the data can be, scope the key by tenant and version, and coalesce concurrent misses for popular keys. I’d measure hit rate, origin latency, and stale results."
    },
    {
      title:"Retries with backoff", flow:"Transient failure → bounded wait with jitter → retry",
      theory:"Retry transient failures when a second attempt is safe. Exponential backoff increases the wait and jitter spreads clients across time. The full sequence must fit the caller’s deadline. Honor Retry-After when it fits that budget.",
      example:"A document embedding worker sees temporary throttling. It delays its next attempt and reuses a stable chunk ID, so duplicate delivery updates the same record.",
      answer:"I’d retry at one layer, cap attempts, and distinguish throttling from permanent validation failures. For a write that may have succeeded before a timeout, I’d require idempotency or reconcile the outcome before retrying."
    },
    {
      title:"Database index", flow:"SQL query → index range → matching rows",
      theory:"A B-tree can narrow equality or range queries and sometimes supply the requested sort order. Composite index column order should follow the actual query. Every additional index takes space and adds write work.",
      example:"The support dashboard lists a tenant’s newest open tickets. Test an index on (tenant_id, status, created_at DESC) for a query that filters by tenant and status and orders by newest first.",
      answer:"I’d compare query plans and timings on representative data. If most rows match, a sequential scan can be appropriate. I’d report read p95 alongside index size and the effect on writes."
    },
    {
      title:"Rate limiting", flow:"Authenticated request → per-tenant quota → allow or 429",
      theory:"A token bucket refills over time and allows short bursts up to its capacity. Request quotas control admission and fairness. A concurrency cap separately limits how many long-lived requests are in flight.",
      example:"A transcription API lets each customer start short bursts of jobs. A separate in-flight limit keeps one team’s long uploads from occupying every worker.",
      answer:"I’d enforce tenant limits before expensive work, use a shared or coordinated limiter across replicas, and return 429 with retry guidance when appropriate. I’d track rejection rates by tenant and distinguish quota breaches from service saturation."
    }
  ]},
  {name:"Junior", summary:"Background work, data scale, and overload", topics:[
    {
      title:"Message queue", flow:"Upload API → job queue → worker → job status",
      theory:"A queue decouples arrival from processing. The API can acknowledge a job quickly while workers process at a sustainable pace. At-least-once delivery requires idempotent consumers and handling for jobs that repeatedly fail.",
      example:"A user uploads a handbook. The API returns a job ID. A worker extracts, chunks, and embeds the PDF. If a worker crashes before acknowledgement, a replacement upserts the same document-version chunks.",
      answer:"I’d make progress visible with a job-status endpoint, acknowledge after durable writes, and route persistent failures to a dead-letter queue. I’d monitor oldest-job age and duplicate-processing outcomes."
    },
    {
      title:"Sharding", flow:"Tenant ID → shard map → shard holding that tenant’s data",
      theory:"Sharding partitions records across independently managed stores. A shard key determines data locality and how traffic spreads. Moving data between shards and running cross-shard joins add operational work.",
      example:"A help-desk platform assigns each tenant’s documents and queries to the same shard. A large enterprise tenant creates a hot shard, so the team can move it to dedicated capacity or split its internal workload.",
      answer:"I’d establish that one tuned primary cannot sustain storage or write demand, choose a key that localizes common queries, and plan rebalancing. I’d monitor peak per-shard load as well as fleet averages."
    },
    {
      title:"Replication", flow:"Write → primary → replication log → replicas",
      theory:"Replicas keep copies of data for reads or failover. With asynchronous replication, a replica can lag and failover can lose recent acknowledged writes. A failover plan needs explicit recovery time and recovery point targets.",
      example:"An admin publishes a new support policy. The confirmation screen reads from the primary to show the saved version immediately, while an analytics dashboard can read from a lagging replica.",
      answer:"I’d route freshness-sensitive reads to the primary or wait for the replica to catch up. I’d monitor lag, rehearse failover, and keep independent backups because replication can also copy a bad write."
    },
    {
      title:"Circuit breaker", flow:"Closed → repeated failures → open → half-open probe",
      theory:"A breaker temporarily stops calls to a dependency that is timing out or failing. After a cooldown, a limited probe tests recovery. Timeouts bound one call while the breaker changes whether future calls are attempted.",
      example:"The model provider times out. The breaker opens for that provider and region. Requests either use an approved backup or return a clear degraded response while a small number of probes test recovery.",
      answer:"I’d choose a minimum sample size and error window, keep breakers scoped to the failing dependency, and avoid letting retries bypass the breaker. I’d measure transitions, upstream errors, and fallback success."
    },
    {
      title:"Backpressure", flow:"Producer → bounded queue → capacity-limited workers",
      theory:"Backpressure makes producers slow down, wait, or receive an explicit rejection when consumers cannot keep up. Buffers absorb brief spikes. Sustained arrival above service capacity increases the backlog until admission is reduced or throughput increases.",
      example:"During a 300-document-per-minute upload burst, workers process 180 per minute. Pending jobs grow by 120 per minute. A bounded queue throttles new bulk imports and keeps capacity available for single uploads.",
      answer:"I’d cap queue size and worker concurrency, choose a maximum acceptable job age, and prioritize interactive work. Autoscaling helps only if the embedding provider and storage can absorb the extra throughput."
    }
  ]},
  {name:"Mid-level", summary:"Streaming, model quotas, and search quality", topics:[
    {
      title:"Streaming responses", flow:"Model chunks → backend stream → browser",
      theory:"A streamed response sends partial output as it becomes available, often using server-sent events. Measure time to first token and total completion separately. Propagate disconnects upstream where supported so abandoned requests stop consuming capacity.",
      example:"A customer asks a policy question. The interface receives status, answer chunks, and a final citation event. If the stream breaks halfway, the UI marks the answer incomplete and offers a retry.",
      answer:"I’d test buffering through every proxy and define a stream protocol with an explicit completion or error event. I’d hold back content that requires validation and track first-token p95, completion p95, and cancellation."
    },
    {
      title:"Token rate limits", flow:"Estimate tokens → reserve capacity → send → reconcile",
      theory:"A tokens-per-minute limit controls aggregate throughput over time. A context window caps what fits into an individual request. Provider quota accounting varies, so local admission estimates should account for both the input and output ceiling.",
      example:"Twenty concurrent requests reserve 2,500 tokens each, for 50,000 reserved tokens. A local 60,000-token window leaves 10,000 for more work. If actual usage is available, release unused local reservations under the limiter’s rules.",
      answer:"I’d track requests and tokens separately, use model-specific estimation, and limit by tenant and provider. I’d confirm the provider’s accounting rules and watch 429s, reservation error, and queue delay."
    },
    {
      title:"Vector index", flow:"Query embedding → approximate nearest-neighbor index → candidates",
      theory:"An approximate index such as HNSW searches a graph of embeddings to find nearby items without scoring every vector. More search effort can improve recall at the cost of latency. Index memory, filter selectivity, and update patterns matter.",
      example:"The support copilot grows to one million chunks. The team compares HNSW against exact cosine search on a sample of tenant-filtered queries and checks whether the relevant policy passage is still retrieved.",
      answer:"I’d use exact search as the benchmark and tune for recall@k, p95, and memory under realistic filters. I’d check filter-heavy tenant queries separately and keep exact search for small subsets when it performs well."
    },
    {
      title:"Hybrid search", flow:"Keyword results + vector results → rank fusion → optional reranker",
      theory:"Lexical retrieval captures exact terms while vector retrieval captures paraphrases. Reciprocal rank fusion combines rank positions so raw relevance scores from different systems need no shared scale. A reranker can improve candidate order at extra latency.",
      example:"In a SaaS knowledge base, keyword search finds the exact error code E-482. Semantic search finds the same troubleshooting guide when users describe the symptom without the code.",
      answer:"I’d compare keyword-only, vector-only, and hybrid retrieval on a labeled query set. I’d separate exact identifiers from paraphrases and add reranking only if the gain in relevant citations fits the latency budget."
    },
    {
      title:"Semantic caching", flow:"Query embedding → scoped similarity lookup → cached answer or model",
      theory:"Semantic caches reuse responses for queries with similar meanings. Similarity is an imperfect proxy for equivalence. Scope entries by permission, model or prompt version, and corpus version, with a staleness policy.",
      example:"A public FAQ can reuse an answer for “When are you open?” and “What are your hours?” Similar questions about different locations should produce separate results.",
      answer:"I’d start with low-risk, stable questions, test near-miss pairs, and tune the threshold on real examples. I’d monitor incorrect cache hits and skip personalized or time-sensitive requests where reuse is unsafe."
    }
  ]},
  {name:"Senior", summary:"Model selection, workflow recovery, and safeguards", topics:[
    {
      title:"Model routing", flow:"Request → task classifier or rules → suitable model",
      theory:"Routing chooses a model before execution using task type, budget, context size, or measured difficulty. Compare end-to-end quality, cost, and latency, including the routing step and any escalation.",
      example:"A support system sends short ticket tagging to a smaller model. It routes multi-document policy questions to a model that meets citation-quality targets on complex cases.",
      answer:"I’d start with transparent task rules and validate each route with offline evals. I’d track quality by slice and measure how often simple-looking cases needed escalation."
    },
    {
      title:"Fallback models", flow:"Primary unavailable → compatible backup → output validation",
      theory:"Fallback is a recovery path after an execution failure or unavailable dependency. It needs a remaining time budget, compatible output, and approval to process the same data. A correlated outage can take down both choices.",
      example:"A ticket summarizer switches to an approved second provider during an outage. The backup must still return the same summary fields and meet data residency requirements.",
      answer:"I’d test backups under failure before launch, validate outputs, and define when to return a degraded response. Once tokens have been shown, I’d mark an interrupted stream explicitly instead of appending output from a different model."
    },
    {
      title:"LLM gateway", flow:"Application → gateway → approved model providers",
      theory:"A gateway centralizes provider credentials, quotas, routing, and telemetry. It can offer a consistent interface across models. Because requests depend on it, it needs its own availability and latency targets.",
      example:"Support, onboarding, and analytics teams use one gateway. It attributes token usage to each team, protects provider keys, and enforces a shared allowlist for sensitive workloads.",
      answer:"I’d start with a thin wrapper for one application and add a shared gateway when multiple teams need common policies. I’d make it highly available and track gateway overhead and per-provider saturation."
    },
    {
      title:"Durable execution", flow:"Workflow → persisted step history → resume after interruption",
      theory:"Durable execution stores workflow history or checkpoints so multi-step work can resume after a crash. Replaying workflow decisions can require deterministic code. External side effects still need idempotency or reconciliation.",
      example:"An onboarding workflow verifies a document, pauses for a reviewer, and creates a welcome task. A worker dies after the task API accepts the request. A stable operation ID lets the next worker recover the existing task.",
      answer:"I’d persist each completed step, use idempotency keys for writes, and set retry and expiry policies per step. I’d version workflow changes and test a crash between an external side effect and local acknowledgement."
    },
    {
      title:"Guardrails", flow:"Request checks → constrained model output → policy enforcement",
      theory:"Guardrails enforce constraints around model inputs, outputs, and actions. Schema validation checks shape. Authorization, data policy, and business rules belong in the application or data layer. Detection can help flag suspicious inputs.",
      example:"A support assistant suggests a refund as structured JSON. The server checks account access and refund eligibility. An authorized staff member approves the action before the application performs it.",
      answer:"I’d define which actions need approval, validate every tool argument, and fail closed on access checks. I’d measure blocked legitimate actions and missed policy violations, with tests for untrusted retrieved content."
    }
  ]},
  {name:"Staff", summary:"Observability, isolation, and safe migrations", topics:[
    {
      title:"Agent tracing", flow:"Trace ID → retrieval, model, and tool spans → diagnosis",
      theory:"A trace links the work done for one request or run. Spans capture operation timings and selected metadata. They let engineers attribute slowdowns and failures to particular calls while avoiding unnecessary sensitive payloads.",
      example:"A support agent cites last year’s policy. A redacted trace shows retrieval selected an older document version before generation started. The team fixes version filtering and adds a regression eval.",
      answer:"I’d instrument retrieval, generation, and tools with a shared trace ID. I’d record document version, latency, tokens, and error class, then use redaction, sampling, and retention rules to manage cost and privacy."
    },
    {
      title:"Token budgets", flow:"Start run → reserve per step → reconcile → stop at budget",
      theory:"A run budget limits cumulative token use or spend across a workflow. Track time and tool calls separately. Reserve budget before parallel work to keep concurrent steps from overspending the same allowance.",
      example:"A research assistant has a 12,000-token allowance and a 45-second deadline. After using most of the allowance it summarizes the evidence collected so far and labels unanswered questions.",
      answer:"I’d set limits per run and across a tenant’s usage, track actual consumption, and define a clear stop response. I’d review budget exhaustion by task to see which workflows need simpler plans or larger caps."
    },
    {
      title:"Tenant isolation", flow:"Verified identity → scoped data access → tenant-owned results",
      theory:"Tenant isolation prevents one customer’s data from appearing in another customer’s results. Derive tenant scope from verified identity and enforce it wherever data is stored or retrieved, including caches, indexes, object storage, and traces.",
      example:"Two companies upload different parental-leave policies. Each search request is scoped before retrieval and the cache is keyed by tenant and permission scope. Both tenants can ask the same question and get their own citations.",
      answer:"I’d enforce scope in the data layer, validate access before returning citations, and test cross-tenant reads and writes. Shared infrastructure can be appropriate if every boundary is enforceable and observable."
    },
    {
      title:"Embedding migration", flow:"Old index → backfill new index → compare → switch with rollback",
      theory:"Embeddings from different models generally occupy incompatible spaces. Version the corpus and query encoder together. Backfill a separate index and account for creates, updates, and deletes that arrive during migration.",
      example:"A help desk with two million 400-token chunks needs to re-embed about 800 million input tokens. It keeps the old index live, mirrors changes, checks migration coverage, and switches reads once evaluation and lag gates pass.",
      answer:"I’d estimate cost and time from measured throughput, compare citation and retrieval quality by language and tenant, and keep both indexes current during the rollback window."
    },
    {
      title:"Sandboxed execution", flow:"Code job → isolated runtime → limited results",
      theory:"A sandbox runs untrusted code with explicitly limited filesystem, network, CPU, memory, and time. It uses short-lived execution and grants only the data and operations needed for the task.",
      example:"A data assistant generates Python to summarize an uploaded CSV. The job gets that file, a read-only runtime, and a temporary output folder. The runtime has no production secrets or default outbound network access.",
      answer:"I’d choose an isolation boundary for the threat model, enforce resource limits, and validate returned artifacts. Any privileged operation would go through a separate authorized application interface."
    }
  ]},
  {name:"Release testing", summary:"Evaluate a change before exposing it to users", topics:[
    {
      title:"Shadow evals", flow:"Eligible request → live answer to user + candidate answer for scoring",
      theory:"Shadow evaluation runs a candidate on a sample of eligible traffic while users still receive the current version’s answer. It reveals realistic quality, latency, and cost differences. A later canary measures user impact on a small live rollout.",
      example:"A startup shadows a new retrieval prompt on 5% of approved support queries. The candidate can generate a draft but has no write tools. Reviewers compare citation accuracy and abstention on matched requests.",
      answer:"I’d sample permitted traffic, control extra spend, and compare both versions using the same rubric. I’d inspect disagreements by query type, agree on release gates, and follow with a monitored canary."
    }
  ]}
];
