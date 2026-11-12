const stages = [
  {name:"Foundations", summary:"Get comfortable shipping small Python services.", weeks:"Week 1"},
  {name:"How AI works", summary:"Understand what models read, learn, and retrieve.", weeks:"Week 2"},
  {name:"Build", summary:"Turn model calls into a working product.", weeks:"Weeks 3–4"},
  {name:"Production", summary:"Measure quality, diagnose failures, and manage cost.", weeks:"Weeks 5–6"},
  {name:"Ship it", summary:"Deploy, collect feedback, and show your work.", weeks:"Weeks 7–8"}
];
const lessons = [
 [0,"Python","Write small, tested data transformations you can reuse in ingestion.", "Clean a CSV with missing fields and print a summary. Add a test for a malformed row.","rfscVS0vtbw","Harvard CS50P","https://harvardonline.harvard.edu/course/cs50s-introduction-programming-python"],
 [0,"APIs","Use HTTP and JSON to make your model-backed service callable.", "Build a FastAPI endpoint that validates a JSON question and returns a typed JSON response.","0sOvCWFmrtA","FastAPI tutorial","https://fastapi.tiangolo.com/tutorial"],
 [0,"SQL","Retrieve and aggregate product data in a relational database.", "Answer a product question with a JOIN, WHERE, and GROUP BY. Explain the row counts.","HXV3zeQKqGY","SQLBolt","https://sqlbolt.com/"],
 [1,"ML basics","Learn how training, loss, overfitting, and held-out data relate.", "Explain why you need a held-out test set. Give an example of leakage in a support-ticket dataset.","Gv9_4yMHFhI","Google ML Crash Course","https://developers.google.com/machine-learning/crash-course"],
 [1,"Neural networks","Understand the role of weights, layers, loss, and backpropagation.", "Describe what one training step changes and how a prediction differs from a training update.","aircAruvnKk","3Blue1Brown series","https://www.3blue1brown.com/topics/neural-networks"],
 [1,"Tokens and context","Reason about how input size affects cost, latency, and the context limit.", "Estimate the token budget for a long PDF and explain what you would retrieve, trim, or summarize.","7xTGNNLPyMI","Hugging Face LLM Course","https://huggingface.co/learn/llm-course/chapter2/4"],
 [1,"Embeddings","Represent text numerically so a search can find similar passages.", "Embed 50 short texts and rank the three closest to a query by cosine similarity. Inspect misses.","gQddtTdmG_8","Google embeddings guide","https://developers.google.com/machine-learning/crash-course/embeddings"],
 [2,"Prompt engineering","Define success criteria, use examples, and compare prompt variants.", "Collect five hard examples. Change the prompt and score both versions against the same criteria.","","Claude prompting guide","https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview"],
 [2,"Structured outputs","Constrain and validate model output with a schema.", "Extract a name, date, and request from messy emails. Handle missing fields and provider failures explicitly.","yj-wSRJwrrc","DeepLearning.AI course","https://www.deeplearning.ai/short-courses/getting-structured-llm-output"],
 [2,"Retrieval-augmented generation","Retrieve relevant excerpts, generate a grounded answer, and show sources.", "Answer questions across 20 sample documents with document and page citations. Abstain when sources are insufficient.","sVcwVQRHIc8","Full Stack LLM Bootcamp","https://fullstackdeeplearning.com/llm-bootcamp/spring-2023/"],
 [2,"Tool calling and MCP","Connect model requests to scoped, typed functions and data.", "Add a read-only mock order lookup. Validate the ID and handle missing records before returning a result.","N3vHJcHBS-w","Hugging Face MCP Course","https://huggingface.co/learn/mcp-course/unit0/introduction", "https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview","Claude tool-use docs"],
 [2,"Agents with LangGraph","Model multi-step workflows with explicit state and termination.", "Run two read-only tools in sequence. Set a step limit and record why the workflow stopped.","jGg_1h0qzaM","Hugging Face Agents Course","https://huggingface.co/learn/agents-course","https://academy.langchain.com","LangChain Academy"],
 [3,"Evals","Use representative examples and a repeatable scoring rubric.", "Score 30 cases before and after a change. Break out retrieval hits, citation correctness, and abstention accuracy.","BsWxPI9UM4c","Hamel Husain’s eval guide","https://hamel.dev/blog/posts/evals/"],
 [3,"Tracing","Follow requests through retrieval, model calls, and tool calls.", "Use a redacted trace to explain one wrong answer. Record stage latency and token usage.","","DeepLearning.AI course","https://www.deeplearning.ai/short-courses/evaluating-ai-agents"],
 [3,"Cost and caching","Control spending through token budgets, caching, and model selection.", "Measure cost and p95 latency on a fixed set. Try caching repeated instructions and compare the same metrics.","","Claude prompt caching","https://platform.claude.com/docs/en/build-with-claude/prompt-caching","https://claude.com/blog/lessons-from-building-claude-code-prompt-caching-is-everything","Claude engineering write-up"],
 [3,"Fine-tuning","Adapt a small model for a narrow task when baseline results justify it.", "Compare a fine-tuned model with the base model on a held-out set. Report quality and inference cost.","iOdFUJiB0Zc","Hugging Face fine-tuning","https://huggingface.co/learn/llm-course/en/chapter3/1"],
 [4,"Guardrails","Treat retrieved text as untrusted data. Scope tools, validate outputs, and protect private data.", "Write regression tests for unauthorized reads, missing evidence, and invalid outputs. Check that logs omit sensitive fields.","","OWASP GenAI Top 10","https://genai.owasp.org/resource/owasp-genai-llm-top-10-2026/"],
 [4,"Deploying it","Package the app and make it reproducible in a hosted environment.", "Run the app from a documented Docker command. Add a health check, managed secrets, and a short rollback procedure.","fqMOX6JJhGo","Docker getting started","https://docs.docker.com/get-started/"],
 [4,"One project real people use","Collect evidence from actual users and improve the workflow.", "Invite 10 target users to try a defined task. Log feedback with consent, fix a recurring issue, and document the result.","","Full Stack LLM Bootcamp","https://fullstackdeeplearning.com/llm-bootcamp/spring-2023/"]
];
const weeks = [
 ["Service foundation","Write a tested CSV cleaner, a typed API endpoint, and three SQL queries. Learn Git branches and pull requests.","Repository with setup instructions and passing tests"],
 ["Retrieval baseline","Index a small public or synthetic corpus. Compare keyword search and embedding search on 10 labeled queries.","Table of recall@3 and three misses"],
 ["First usable workflow","Add citations, an abstain response, and a small UI for a support agent. Ask two target users to try it.","Runnable demo and feedback notes"],
 ["Structured results","Return a typed answer and citations. Add read-only order lookup only if users need it.","Schema tests and a walkthrough of a tool failure"],
 ["Evaluation and tracing","Create 30 held-out examples covering ordinary, ambiguous, and unanswerable questions. Trace failed requests.","Repeatable eval script and before/after report"],
 ["Reliability and cost","Add timeouts, bounded retries, request limits, redacted logs, and an automated test run. Measure p95 latency and cost per answer.","CI run, measured trade-offs, and runbook"],
 ["Deploy and iterate","Deploy with Docker and a health endpoint. Ask target users to complete a task and record one fix from their feedback.","Hosted demo, issue log, and tagged release"],
 ["Apply and rehearse","Polish the repo and record a 90-second demo. Tailor applications and rehearse a design walkthrough.","Resume bullet, demo link, and first batch of applications"]
];
const projects = [
 {title:"Support Knowledge Copilot", label:"Flagship project", intro:"Help a support agent answer policy questions with cited evidence and a clear handoff when the docs fall short.", phases:[
 ["Define the task","Use public or synthetic support docs. Write the top 10 questions and define a correct answer, acceptable citation, and when to abstain."],
 ["Ship the smallest workflow","Ingest documents with stable IDs and page metadata. Start with keyword search, compare embeddings, and serve a typed answer with citations through FastAPI."],
 ["Measure and improve","Use a 30-case held-out set covering clear, ambiguous, and unanswerable requests. Report recall@3, citation correctness, abstention accuracy, p95 latency, and cost per answer."],
 ["Deploy and show your work","Add tests, CI, Docker, a health check, and redacted logs. Publish a demo using safe sample data. Document one user-reported issue and the fix."]
 ], target:"Suggested first gate: ≥80% citation correctness on answerable cases and ≥90% correct abstention on unanswerable cases. Publish the raw counts and failed cases with any score.", stack:"Python · FastAPI · SQLite or Postgres · Docker"},
 {title:"Support Ticket Triage", label:"Alternative project", intro:"Turn an inbound ticket into a typed category, urgency, and routing suggestion for human review.", phases:[
 ["Build a baseline","Define 4–6 categories. Use synthetic tickets and write deterministic keyword rules."],
 ["Add typed output","Validate category, urgency, and missing fields. Show a reviewer queue for low-confidence or invalid results."],
 ["Compare performance","Measure per-category precision and recall on a held-out set. Examine false urgent and missed urgent tickets."],
 ["Ship a reviewable workflow","Create a demo with approved or synthetic data. Log overrides and show how an override informs the next iteration."]
 ], target:"Acceptance gate: every invalid response reaches manual review. Show the confusion matrix and cost per classified ticket.", stack:"Python · Pydantic · FastAPI · SQL"},
 {title:"Order Status Assistant", label:"Alternative project", intro:"Answer customer questions using a read-only tool connected to mock orders.", phases:[
 ["Start with an endpoint","Create a synthetic order dataset. Build a typed order lookup with missing and invalid ID handling."],
 ["Add controlled tool calls","Map questions to an allowlisted read-only lookup. Enforce ownership checks in the server."],
 ["Test failure paths","Cover missing orders, unauthorized records, slow dependencies, and ambiguous requests. Confirm safe responses and bounded execution."],
 ["Package the result","Deploy a demo with sample accounts, a sequence diagram, and a trace showing a failed lookup and recovery."]
 ], target:"Acceptance gate: all unauthorized lookups are denied and all timeout tests return a clear fallback. Report success rate on valid lookups.", stack:"Python · FastAPI · SQL · Typed tools"}
];
const drills = [
 ["Python","45 min","Build a JSON ingestion endpoint and write three tests.","Validate the schema, handle duplicate records, and explain how you would observe failures in production."],
 ["SQL","25 min","Find each team’s top three ticket categories this month.","Join tickets to teams, group by category, rank with a window function, and explain your choice of tie handling."],
 ["System design","40 min","Design RAG for frequently changing documents.","Cover ingestion and versioning, retrieval and citations, access control, latency, and what you’d monitor after launch."],
 ["Evals","25 min","A new prompt raised answer ratings but increased hallucinated citations. Decide whether to ship.","Separate citation and answer quality. Inspect representative failures, define a release gate, and compare the same held-out set."],
 ["Debugging","25 min","A previously good support answer now uses an outdated policy.","Walk through version metadata, cache invalidation, retrieval ranking, and trace evidence. Add a regression case."],
 ["Ownership","20 min","Tell a story about a change you shipped after user feedback.","Explain the user problem, your contribution, evidence before and after, and the next improvement you would prioritize."]
];
