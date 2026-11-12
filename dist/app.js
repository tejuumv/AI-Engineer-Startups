const nav = [
  ["index","Overview","⌂"], ["roadmap","Roadmap","≋"], ["projects","Projects","◇"],
  ["applications","Applications","↗"], ["interview","Interview prep","◫"],
  ["system-design","System design","▦"]
];
const page = location.pathname.split("/").pop().replace(".html", "") || "index";
const activePage = nav.find(([id]) => id === page) || nav[0];
const [pageId, pageName] = activePage;
const key = "startup-ai-field-guide-v1";
const statuses = ["To research","Ready to apply","Applied","Interviewing","Offer","Closed"];

function readState() {
  try {
    const saved = JSON.parse(localStorage.getItem(key)) || {};
    return {
      done: Array.isArray(saved.done) ? saved.done.filter(id => Number.isInteger(id) && lessons[id]) : [],
      jobs: Array.isArray(saved.jobs) ? saved.jobs : [],
      proof: Array.isArray(saved.proof) ? saved.proof : []
    };
  } catch {
    return {done: [], jobs: [], proof: []};
  }
}

const state = readState();
const app = document.querySelector("#app");
const escapeHTML = value => String(value).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[c]);

function save(message) {
  const live = document.querySelector("#feedback");
  try {
    localStorage.setItem(key, JSON.stringify(state));
    live.textContent = message;
  } catch {
    live.textContent = "Browser storage is unavailable. Changes last until you leave this page.";
  }
}

const link = (url, name) => `<a class="resource" href="${url}" target="_blank" rel="noopener noreferrer">${name} <span aria-hidden="true">↗</span></a>`;
const badge = label => `<span class="badge">${label}</span>`;
const head = (eyebrow, title, desc) => `<header class="page-head"><p class="eyebrow">${eyebrow}</p><h1>${title}</h1><p>${desc}</p></header>`;
const progress = () => `<div class="progress-line"><span>Roadmap progress</span><strong data-count>${state.done.length} / ${lessons.length}</strong></div><progress max="${lessons.length}" value="${state.done.length}" aria-label="Roadmap progress"></progress>`;
const evidence = [
  "Live demo with public or synthetic data",
  "Repository with setup, architecture, tests, and CI",
  "Evaluation report with raw counts and failed examples",
  "Trace or screenshot of a real failure and the fix",
  "90-second walkthrough with a clear user problem",
  "One resume bullet grounded in measured results"
];
const message = "Hi [Name], I saw [specific product workflow or role requirement] at [Company]. I built [project] for [user problem] and measured [one real result]. Here’s a short demo: [link]. I’m interested in [role] and would like to discuss how I could help with [relevant problem].";

function overview() {
  const next = lessons.findIndex((_, i) => !state.done.includes(i));
  const nextTitle = next < 0 ? "Ship your flagship project" : lessons[next][1];
  const nextURL = next < 0 ? "projects.html" : `roadmap.html#lesson-${next + 1}`;
  return `
  <section class="hero">
    <div class="hero-copy">
      <p class="eyebrow"><span class="dot"></span> Your startup career plan</p>
      <h1>Become a startup<br><em>AI engineer.</em></h1>
      <p>Learn the fundamentals, ship an AI product people can try, and use your results to apply for startup roles.</p>
      <div class="actions"><a class="button dark" href="${nextURL}">${next < 0 ? "Build your portfolio" : state.done.length ? "Continue roadmap" : "Start the roadmap"} <span aria-hidden="true">↗</span></a><a class="button light" href="projects.html">Explore projects <span aria-hidden="true">→</span></a></div>
    </div>
    <div class="hero-board">
      <p class="eyebrow"><span class="dot"></span> The build path</p>
      <div class="path-step"><span>01</span><div><strong>Learn the stack</strong><small>Python → RAG → production</small></div><b aria-hidden="true">↗</b></div>
      <div class="path-step"><span>02</span><div><strong>Ship one real product</strong><small>Demo · evals · user feedback</small></div><b aria-hidden="true">↗</b></div>
      <div class="path-step"><span>03</span><div><strong>Apply with evidence</strong><small>Portfolio · outreach · interviews</small></div><b aria-hidden="true">↗</b></div>
    </div>
  </section>
  <div class="metrics">
    <div class="metric"><strong>19</strong><div>Roadmap steps<small>Across 5 learning stages</small></div></div>
    <div class="metric"><strong>8</strong><div>Weeks to plan<small>At a pace you can adjust</small></div></div>
    <div class="metric"><strong>3</strong><div>Project briefs<small>Choose one to ship first</small></div></div>
    <div class="metric metric-progress">${progress()}</div>
  </div>
  <section class="section">
    <div class="section-head"><div><p class="eyebrow">Learning path</p><h2>Your roadmap</h2></div><a class="text-link" href="roadmap.html">View all 19 steps <span aria-hidden="true">↗</span></a></div>
    <div class="overview-grid">
      <div class="stage-list">${stages.map((stage, i) => {
        const ids = lessons.map((lesson, index) => lesson[0] === i ? index : -1).filter(id => id >= 0);
        const complete = ids.filter(id => state.done.includes(id)).length;
        return `<a href="roadmap.html#stage-${i + 1}" class="stage-row"><span class="stage-number">0${i + 1}</span><div><strong>${stage.name}</strong><small>${stage.summary}</small></div><span class="row-meta">${complete} / ${ids.length} steps</span><b aria-hidden="true">↗</b></a>`;
      }).join("")}</div>
      <aside class="next-card"><p class="eyebrow">Up next</p><h3>${nextTitle}</h3><p>${next < 0 ? "Package a live demo and a short write-up with your evaluation results." : lessons[next][3]}</p><a class="text-link" href="${nextURL}">Open ${next < 0 ? "project brief" : "lesson"} <span aria-hidden="true">↗</span></a><div class="next-note">Already comfortable with a topic? Try its exercise and mark it complete when you can do it independently.</div></aside>
    </div>
  </section>
  <section class="section" id="weekly-plan"><div class="section-head"><div><p class="eyebrow">Suggested schedule</p><h2>Eight weeks of work</h2></div></div>
    <p class="section-intro">Use this as a starting point at roughly 8–12 hours per week. Give yourself more time for foundations if you’re new to programming. Start talking to users and exploring roles while you build.</p>
    <div class="week-grid">${weeks.map(([title, task, proof], i) => `<article class="card"><p class="eyebrow">Week ${i + 1}</p><h3>${title}</h3><p>${task}</p><p class="deliverable"><strong>Deliverable</strong> ${proof}</p></article>`).join("")}</div>
  </section>`;
}

function roadmap() {
  return head("Learn", "The 19-step roadmap", "Work through the five stages. Each lesson gives you a resource and a practical check you can use to judge your progress.") + `
  <div class="toolbar"><nav aria-label="Roadmap stages" class="pills">${stages.map((s, i) => `<a href="#stage-${i+1}">${s.name}</a>`).join("")}</nav><div class="inline-progress">${progress()}</div></div>
  <p class="section-intro">For a first applied AI role, prioritize a working API, retrieval, evaluation, and deployment. Explore agents and fine-tuning when a project or target role gives you a reason to use them.</p>
  ${stages.map((s, stage) => `<section class="section" id="stage-${stage+1}"><div class="section-head"><div><p class="eyebrow">Stage 0${stage+1} · ${s.weeks}</p><h2>${s.name}</h2></div></div>
  <div class="lesson-list">${lessons.map(([group,title,desc,exercise,video,label,url,more,moreLabel], id) => group !== stage ? "" : `
    <article class="lesson card" id="lesson-${id+1}">
      <label class="check" title="Mark ${title} complete"><input type="checkbox" data-lesson="${id}" ${state.done.includes(id) ? "checked" : ""}><span class="sr-only">Mark ${title} complete</span></label>
      <div><p class="eyebrow">Step ${String(id+1).padStart(2,"0")}</p><h3>${title}</h3><p>${desc}</p><p class="deliverable"><strong>Practice</strong> ${exercise}</p>
      <div class="resources">${video ? link("https://www.youtube.com/watch?v="+video,"Watch video") : ""}${link(url,label)}${more ? link(more,moreLabel) : ""}</div></div>
    </article>`).join("")}</div></section>`).join("")}
  <section class="section"><h2>Glossary</h2><dl class="glossary">${[
    ["LLM","A language model trained to predict tokens from context."],["Token","A unit of text a model reads or generates."],["Context window","The token capacity available for a model call."],
    ["Embedding","A numeric representation used to compare inputs."],["RAG","Retrieval-augmented generation, which supplies relevant sources to a model before it answers."],
    ["Tool","A function the application may execute at the model’s request."],["MCP","Model Context Protocol, a standard for connecting applications with tools and data."],
    ["Agent","A workflow where the model can choose actions over multiple steps."],["LangGraph","A framework for stateful workflows and agents."],["Eval","A repeatable test set and scoring method."],
    ["Trace","A record of what happened during a request."],["Fine-tuning","Additional model training on task-specific examples."]
  ].map(([term, definition]) => `<div><dt>${term}</dt><dd>${definition}</dd></div>`).join("")}</dl></section>
  <p class="source-note">Learning sequence adapted from Mohit Sood’s <cite>The AI engineer roadmap</cite>. Practice exercises and scheduling have been adapted for this guide.</p>`;
}

function projectPage() {
  return head("Build", "Projects worth showing", "Choose one workflow, ship it for a real user, and collect the evidence you’ll use in applications and interviews.") + `
  ${projects.map((p, i) => `<section class="section project-card ${i === 0 ? "featured" : ""}">
    ${badge(p.label)}<h2>${p.title}</h2><p>${p.intro}</p><p class="stack">${p.stack}</p>
    <div class="project-phases">${p.phases.map(([title, body], j) => `<article><span class="stage-number">0${j+1}</span><h3>${title}</h3><p>${body}</p></article>`).join("")}</div>
    <p class="gate">${p.target}</p></section>`).join("")}
  <section class="section overview-grid"><div class="card"><h2>Portfolio checklist</h2><div class="checklist">${evidence.map((item, i) => `<label><input type="checkbox" data-proof="${i}" ${state.proof.includes(i) ? "checked" : ""}>${item}</label>`).join("")}</div></div>
  <div class="card"><h2>Write your project bullet</h2><p class="quote">Built [workflow] for [user], measured [result] across [sample size] cases, and improved [metric] from [baseline] to [new result] by [change].</p><p>Use the results you actually measured. If you have a small pilot, report the raw count and explain how you scored it.</p><a class="text-link" href="applications.html">Use it in your applications ↗</a></div></section>`;
}

function jobRows() {
  if (!state.jobs.length) return '<p class="empty">No applications tracked yet. Add a role you want to research or apply for.</p>';
  return state.jobs.map(job => `
    <article class="job-row">
      <div class="job-title"><strong>${escapeHTML(job.company)}</strong><span>${escapeHTML(job.role)}</span>
      ${job.url ? link(escapeHTML(job.url), "Job posting") : ""}</div>
      <label class="field"><span>Status</span><select data-job-status="${job.id}" aria-label="Status for ${escapeHTML(job.company)}">${statuses.map(s => `<option ${s === job.status ? "selected" : ""}>${s}</option>`).join("")}</select></label>
      <label class="field"><span>Follow-up</span><input type="date" data-job-date="${job.id}" value="${escapeHTML(job.date)}" aria-label="Follow-up date for ${escapeHTML(job.company)}"></label>
      <button type="button" class="button light small" data-delete="${job.id}" aria-label="Remove ${escapeHTML(job.company)} application">Remove</button>
    </article>`).join("");
}

function applications() {
  return head("Apply", "Find and track startup roles", "Match your demo to a team’s real product needs, write a specific message, and keep track of the next step.") + `
  <div class="overview-grid"><section class="card"><h2>Find your targets</h2>
  <p>Search for Applied AI Engineer, LLM Engineer, AI Product Engineer, or Python Backend Engineer with AI features. If you’re early in your career, include junior, associate, and internship listings.</p>
  <div class="resources">${link("https://wellfound.com/role/l/ai-engineer/india","Wellfound · India")}${link("https://www.ycombinator.com/jobs","YC startup jobs")}</div>
  <p>Verify the role on the company’s own careers page. Check location, experience requirements, and whether the team ships the kind of product you’ve built.</p></section>
  <section class="card"><h2>Weekly application routine</h2><ol class="routine"><li>Shortlist 10 roles and note one product problem per team.</li><li>Pick 5 strong matches. Tailor your project bullet and demo to each role.</li><li>Follow up after about a week when appropriate. Track replies and adjust your pitch each Friday.</li></ol></section></div>
  <section class="section card"><div class="section-head"><div><h2>Founder outreach template</h2><p>Replace the placeholders with details you can verify.</p></div><button class="button light small" data-copy>Copy message</button></div><p class="quote" id="outreach">${message}</p></section>
  <section class="section card"><div class="section-head"><div><h2>Application tracker</h2><p>Entries and progress are saved in this browser.</p></div></div>
  <form id="job-form"><div class="form-grid">
    <label class="field"><span>Company</span><input name="company" required maxlength="100" placeholder="e.g. Acme AI"></label>
    <label class="field"><span>Role</span><input name="role" required maxlength="120" placeholder="e.g. Applied AI Engineer"></label>
    <label class="field"><span>Posting URL (optional)</span><input name="url" type="url" placeholder="https://…" maxlength="1000"></label>
    <button class="button dark" type="submit">Add role <span aria-hidden="true">＋</span></button>
  </div></form><div id="jobs">${jobRows()}</div></section>`;
}

function interview() {
  return head("Practice", "Interview preparation", "Rehearse the work you’ll do on a small team. Time each exercise, then compare your answer with the scoring notes.") + `
  <aside class="design-callout">
    <div><h2>Prepare for the design round</h2><p>Study 26 concepts and walk through a multi-tenant support copilot.</p></div>
    <a class="button dark" href="system-design.html">Open system design guide <span aria-hidden="true">↗</span></a>
  </aside>
  <div class="week-grid drill-grid">${drills.map(([topic,time,prompt,hint]) => `<article class="card">
    <div class="section-head"><h3>${topic}</h3>${badge(time)}</div><p>${prompt}</p><details><summary>What a strong answer covers</summary><p>${hint}</p></details></article>`).join("")}</div>
  <section class="section overview-grid"><div class="card"><h2>90-second project walkthrough</h2><ol class="routine">
    <li><strong>15 seconds.</strong> Name the user and the problem you observed.</li><li><strong>30 seconds.</strong> Demo the core flow and one failure case.</li>
    <li><strong>25 seconds.</strong> Explain how you measured quality and a trade-off you made.</li><li><strong>20 seconds.</strong> Show one improvement from feedback and what you’d build next.</li></ol></div>
  <div class="card"><h2>Questions for the team</h2><ul class="routine"><li>Which AI workflow is already in production, and who uses it?</li><li>How do you evaluate model changes before release?</li><li>What would I own in my first 30 days?</li><li>What trade-off is most pressing today: quality, latency, cost, or adoption?</li></ul></div></section>`;
}

function systemDesign() {
  let number = 0;
  return head("Interview prep", "AI system design", "Study how production AI systems handle traffic, retrieval, failures, and cost. Then practice explaining your choices in a 45-minute design round.") + `
  <div class="design-callout">
    <div><h2>Design a support copilot</h2><p>Work through a complete example with requirements, traffic estimates, and failure handling.</p></div>
    <a class="button dark" href="#worked-example">Start the mock interview <span aria-hidden="true">↓</span></a>
  </div>
  <section class="section" aria-labelledby="concepts">
    <div class="section-head"><h2 id="concepts">The 26 concepts</h2></div>
    <nav class="pills" aria-label="Concept groups">${designGroups.map(({name}, index) => `<a href="#design-group-${index + 1}">${name}</a>`).join("")}</nav>
    <label class="field design-search"><span>Find a concept</span><input type="search" id="design-search" placeholder="Try retries, tenant isolation, or HNSW" aria-controls="design-concepts"></label>
    <p id="design-count" class="design-count" role="status"></p>
    <div id="design-concepts">
    ${designGroups.map(({name, summary, topics}, index) => `<section class="design-group" id="design-group-${index + 1}">
      <div class="design-group-head"><h3>${name}</h3><p>${summary}</p></div>
      <div class="design-list">${topics.map(({title, flow, theory, example, answer}) => `
        <details class="design-topic" id="design-topic-${++number}" ${number === 1 ? "open" : ""}>
          <summary><span class="stage-number" aria-hidden="true">${String(number).padStart(2, "0")}</span><span>${title}</span><span class="design-chevron" aria-hidden="true"></span></summary>
          <div class="design-body"><p class="design-flow">${flow}</p>
            <dl><div><dt>Theory</dt><dd>${theory}</dd></div><div><dt>Real-world example</dt><dd>${example}</dd></div><div><dt>How to answer in an interview</dt><dd>${answer}</dd></div></dl>
          </div>
        </details>`).join("")}</div>
    </section>`).join("")}</div>
  </section>
  <section class="section project-card featured" id="worked-example">
    <p class="eyebrow">45-minute mock interview</p><h2>Design a multi-tenant support copilot</h2>
    <p>A B2B SaaS startup wants support reps to ask policy questions and get cited answers. Each company uploads its own documents. The service should show progress during uploads and abstain when there’s insufficient evidence.</p>
    <div class="design-timeline">
      <article><h3>0–7 minutes · Clarify the requirements</h3><p>Ask who can upload and read documents, how soon updates must appear, and what to do when the model is unavailable. For practice, assume 100 tenants, 50,000 documents, 20 questions per second at peak, and a target p95 time to first token below two seconds for successful answers.</p></article>
      <article><h3>7–12 minutes · Estimate capacity</h3><p>At 3,000 input tokens and 300 output tokens per request, 20 requests per second implies about 3.6 million input and 360,000 output tokens per minute if the peak is sustained. At a four-second mean request duration, expect roughly 80 concurrent requests in steady state. Check provider quotas and leave room for spikes and retries.</p></article>
      <article><h3>12–25 minutes · Draw both paths</h3><p class="design-flow">Upload → object storage → queue → extract, chunk, embed → versioned index</p><p class="design-flow">Question → identity and quota → tenant-scoped retrieval → model → cited stream</p><p>Use a relational store for document ownership and job state. Start with lexical and vector retrieval on a small labeled set. Fetch passages from a published corpus version. Return source IDs the server can resolve and verify for the tenant.</p></article>
      <article><h3>25–37 minutes · Walk through failures</h3><p>Use an idempotent document-version job so duplicate delivery is safe. Limit queue age and worker concurrency when embeddings are throttled. During a model outage, use an approved fallback within the deadline or return relevant passages with a clear status. Enforce tenant scope before retrieval and again when resolving citations.</p></article>
      <article><h3>37–45 minutes · Measure and release</h3><p>Measure recall@k, citation correctness, and abstention on representative questions. Track p95 first-token latency, completion rate, oldest-job age, and cost per answer. Shadow a retrieval change on eligible traffic, compare both versions, then canary with a rollback to the previous version.</p></article>
    </div>
    <div class="design-followups"><h3>Practice the follow-up questions</h3>
      <details><summary>What changes when a tenant deletes a document?</summary><p>Mark it unavailable in the source of truth immediately, enforce that status during retrieval and citation resolution, then remove its chunks and invalidate affected caches. Measure how long physical cleanup takes.</p></details>
      <details><summary>How do you debug a plausible answer with a wrong citation?</summary><p>Use the trace to check corpus version, retrieved candidates, ranking, and citation IDs. Determine whether the right passage was missing or the model cited the wrong one. Add the request to the regression set with an expected source.</p></details>
      <details><summary>What would you build first with two engineers?</summary><p>Start with one API, one database, a background ingestion worker, and a single provider. Validate search and citations with target users. Add replicas, a shared gateway, or sharding when measurements show a specific constraint.</p></details>
    </div>
  </section>
  <section class="section card design-resources"><h2>Technical references</h2>
    <div class="resources">
      ${link("https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/", "AWS · Retry behavior")}
      ${link("https://github.com/pgvector/pgvector", "pgvector · HNSW and filtering")}
      ${link("https://www.postgresql.org/docs/current/ddl-rowsecurity.html", "PostgreSQL · Row security")}
      ${link("https://opentelemetry.io/docs/concepts/signals/traces/", "OpenTelemetry · Traces")}
      ${link("https://docs.temporal.io/workflows", "Temporal · Workflows")}
    </div>
    <p class="source-note">Concept list adapted from Mohit Sood’s <cite>26 System Design Concepts Every AI Engineer Should Know</cite>. The scenarios, estimates, and mock interview are illustrative.</p>
  </section>`;
}

const views = {index: overview, roadmap, projects: projectPage, applications, interview, "system-design": systemDesign};
document.title = `${pageName} | Startup AI Engineer Field Guide`;
app.innerHTML = `
  <aside class="sidebar"><a class="brand" href="index.html"><span class="brand-icon" aria-hidden="true">✦</span><span>Startup AI Engineer<small>Field Guide</small></span></a>
  <nav aria-label="Main navigation">${nav.map(([id,label,icon]) => `<a href="${id}.html" ${id === pageId ? 'aria-current="page"' : ''}><span class="nav-icon" aria-hidden="true">${icon}</span>${label}</a>`).join("")}</nav>
  <div class="side-bottom">${progress()}<small>Saved on this browser</small></div></aside>
  <div class="shell"><div class="topbar"><span>Workspace <span class="slash" aria-hidden="true">/</span> <strong>${pageName}</strong></span><a href="index.html#weekly-plan" class="top-link">8-week plan <span aria-hidden="true">↗</span></a></div>
  <main id="main" tabindex="-1">${views[pageId]()}</main>
  <footer><span>Startup AI Engineer Field Guide</span><a href="roadmap.html">Roadmap by Mohit Sood ↗</a></footer></div>
  <div class="feedback" id="feedback" role="status" aria-live="polite"></div>`;

const designSearch = document.querySelector("#design-search");
if (designSearch) {
  const groups = document.querySelectorAll(".design-group");
  const count = document.querySelector("#design-count");
  designSearch.addEventListener("input", () => {
    const words = designSearch.value.toLowerCase().trim().split(/\s+/).filter(Boolean);
    let matches = 0;
    groups.forEach(group => {
      let groupMatches = 0;
      group.querySelectorAll(".design-topic").forEach(topic => {
        const text = topic.textContent.toLowerCase();
        const found = words.every(word => text.includes(word));
        topic.hidden = !found;
        groupMatches += Number(found);
      });
      group.hidden = groupMatches === 0;
      matches += groupMatches;
    });
    count.textContent = words.length ? `${matches} of 26 concepts match your search.` : "";
  });
}

function refreshProgress() {
  document.querySelectorAll("[data-count]").forEach(node => {
    node.textContent = `${state.done.length} / ${lessons.length}`;
  });
  document.querySelectorAll("progress").forEach(node => { node.value = state.done.length; });
}

app.addEventListener("change", event => {
  const {dataset, checked, value} = event.target;
  if (dataset.lesson !== undefined || dataset.proof !== undefined) {
    const isLesson = dataset.lesson !== undefined;
    const bucket = isLesson ? "done" : "proof";
    const id = Number(isLesson ? dataset.lesson : dataset.proof);
    state[bucket] = checked ? [...new Set([...state[bucket], id])] : state[bucket].filter(n => n !== id);
    refreshProgress();
    save("Progress saved.");
  }
  const jobId = dataset.jobStatus || dataset.jobDate;
  if (jobId) {
    const job = state.jobs.find(entry => entry.id === jobId);
    if (!job) return;
    job[dataset.jobStatus ? "status" : "date"] = value;
    save("Application updated.");
  }
});

app.addEventListener("submit", event => {
  if (event.target.id !== "job-form") return;
  event.preventDefault();
  const form = event.target;
  const data = new FormData(form);
  const company = data.get("company").trim();
  const role = data.get("role").trim();
  const url = data.get("url").trim();
  const feedback = document.querySelector("#feedback");
  if (!company || !role || (url && !/^https?:\/\//i.test(url))) {
    feedback.textContent = "Enter a company and role, and use an HTTP or HTTPS posting link.";
    return;
  }
  state.jobs.unshift({id: Date.now().toString(36) + Math.random().toString(36).slice(2), company, role, url, status: statuses[0], date:""});
  save("Role added.");
  document.querySelector("#jobs").innerHTML = jobRows();
  form.reset();
  form.elements.company.focus();
});

app.addEventListener("click", async event => {
  const remove = event.target.closest("[data-delete]");
  if (remove) {
    const job = state.jobs.find(entry => entry.id === remove.dataset.delete);
    if (job) {
      state.jobs = state.jobs.filter(entry => entry.id !== job.id);
      save("Role removed.");
      document.querySelector("#jobs").innerHTML = jobRows();
      document.querySelector("#job-form input").focus();
    }
  }
  if (event.target.closest("[data-copy]")) {
    const feedback = document.querySelector("#feedback");
    try {
      await navigator.clipboard.writeText(message);
      feedback.textContent = "Outreach template copied.";
    } catch {
      const range = document.createRange();
      range.selectNodeContents(document.querySelector("#outreach"));
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      feedback.textContent = "Template selected. Use your browser’s copy command.";
    }
  }
});

if (location.hash) {
  requestAnimationFrame(() => document.getElementById(location.hash.slice(1))?.scrollIntoView());
}
