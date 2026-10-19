(function () {
  "use strict";

  const DATA = window.CKA_DATA;
  const SIM = window.CKA_SIM;
  const STORAGE_KEY = "clustercraft-progress-v1";
  const SIMULATOR_KEY = "clustercraft-simulator-v1";
  const VIEWS = {
    overview: "Overview", learn: "Learning path", terminal: "Practice terminal",
    labs: "Labs & troubleshooting", exams: "Mock exams", reference: "Reference library",
    progress: "Progress & planner"
  };
  const defaultProgress = () => ({ completed: [], quizScores: {}, labRuns: {}, missed: [], mocks: [], planner: null, theme: "dark" });
  let progress = loadProgress();
  let view = "overview";
  let selectedLesson = DATA.lessons[0].id;
  let selectedLab = null;
  let terminalOutput = "ClusterCraft simulated shell · type `help` to see the supported command list.\nThis is a teaching model, not a real Kubernetes cluster.\n";
  let terminalHistoryIndex = 0;
  try {
    const savedSimulator = localStorage.getItem(SIMULATOR_KEY);
    if (savedSimulator) SIM.restore(JSON.parse(savedSimulator));
  } catch (error) {
    console.error("Could not restore the saved simulator state.", error);
  }
  let exam = progress.activeExam && !progress.activeExam.finished ? progress.activeExam : null;
  let examTaskIndex = Number(progress.activeExamTaskIndex || 0);
  let toastTimer = 0;
  let quizState = {};
  let faultAnswers = {};

  function loadProgress() {
    try {
      const value = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
      return value && typeof value === "object" ? { ...defaultProgress(), ...value } : defaultProgress();
    } catch (error) {
      console.error("Could not read saved study progress.", error);
      return defaultProgress();
    }
  }
  function saveProgress() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(progress)); }
    catch (error) {
      console.error("Could not save study progress.", error);
      toast("Progress could not be saved. Export a backup and check browser storage settings.");
    }
  }
  function escapeHtml(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
  }
  function toast(message) {
    const node = document.getElementById("toast");
    node.textContent = message;
    node.classList.add("show");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => node.classList.remove("show"), 2600);
  }
  function pct(n, total) { return total ? Math.round(n / total * 100) : 0; }
  function lessonById(id) { return DATA.lessons.find((item) => item.id === id) || DATA.lessons[0]; }
  function moduleById(id) { return DATA.modules.find((item) => item.id === Number(id)); }
  function completedCount(module) { return module.lessonIds.filter((id) => progress.completed.includes(id)).length; }
  function weightedReadiness() {
    const domains = DATA.modules.filter((item) => item.weight > 0);
    const total = domains.reduce((sum, item) => sum + item.weight, 0);
    return Math.round(domains.reduce((sum, item) => sum + item.weight * pct(completedCount(item), item.lessonIds.length), 0) / total);
  }
  function getLab(id) { return SIM.checks().find((item) => item.id === id); }
  function fmtDate(value) {
    if (!value) return "Not set";
    return new Date(value + "T12:00:00").toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
  }
  function quizFor(lesson) {
    const result = lesson.questions.slice();
    const templates = [
      (concept) => `Which concept is a direct fit for "${lesson.title}"?`,
      (concept) => `A task mentions ${concept}. Which home lesson should you revisit?`,
      (concept) => `Which term should you recognize when working through this lesson?`,
      (concept) => `Which item is most closely connected to this lesson's core skill?`
    ];
    let index = 0;
    while (result.length < 4) {
      const concept = lesson.concepts[(index + result.length) % lesson.concepts.length] || lesson.title;
      const distractors = DATA.lessons.filter((item) => item.id !== lesson.id).flatMap((item) => item.concepts).filter((item) => item !== concept);
      const wrong = distractors.slice(result.length, result.length + 3);
      const choices = [concept, ...wrong];
      const shift = result.length % choices.length;
      const shuffled = choices.slice(shift).concat(choices.slice(0, shift));
      result.push({
        question: templates[index % templates.length](concept),
        choices: shuffled,
        answer: shuffled.indexOf(concept),
        why: `${concept} is owned by this lesson. Use the concept map to find the single home lesson for any term.`
      });
      index++;
    }
    return result.slice(0, 6);
  }
  function quizScoreFor(id) {
    return progress.quizScores[id] ? progress.quizScores[id].best : null;
  }

  function renderOverview() {
    const totalLessons = DATA.lessons.length;
    const passedLabs = Object.values(progress.labRuns).filter((item) => item && item.passed).length;
    const recentMock = progress.mocks[progress.mocks.length - 1];
    const domains = DATA.modules.filter((item) => item.weight > 0);
    const score = weightedReadiness();
    const next = DATA.lessons.find((item) => !progress.completed.includes(item.id)) || DATA.lessons[0];
    const totalWeight = domains.reduce((sum, item) => sum + item.weight, 0);
    return `<div class="hero-row"><div class="hero-copy"><div class="eyebrow">Your CKA practice workspace</div><h1>Learn Kubernetes by doing.</h1><p>Move from command-line basics to cluster operations with focused lessons, a browser-based simulator, and state-checked tasks. Your work stays in this browser.</p></div><button class="button primary" data-action="open-lesson" data-id="${next.id}">Continue learning <span>→</span></button></div>
      <div class="callout warning"><strong>Exam facts:</strong> Official CKA curriculum v1.37 (Kubernetes 1.37 curriculum version), revised competencies effective February 18, 2025. The exam is 2 hours with a 66% passing score; the task count can vary. Exam environments and allowed resources can change—confirm the current candidate handbook before test day. In the real exam, only handbook-approved documentation access is permitted.</div>
      <div class="stats-grid" style="margin-top:17px">
        <article class="stat-card"><div class="stat-label">Weighted lesson coverage <span>↗</span></div><div class="stat-value">${score}%</div><div class="stat-note">Lesson completion across the five exam domains (${totalWeight}% total), not an exam readiness score</div></article>
        <article class="stat-card"><div class="stat-label">Lessons completed <span>▤</span></div><div class="stat-value">${progress.completed.length}<small style="font-size:13px;color:var(--muted)"> / ${totalLessons}</small></div><div class="stat-note">Foundations and exam skills are extra preparation</div></article>
        <article class="stat-card"><div class="stat-label">Labs passed <span>◈</span></div><div class="stat-value">${passedLabs}</div><div class="stat-note">Graded from simulated final state</div></article>
        <article class="stat-card"><div class="stat-label">Latest mock score <span>◷</span></div><div class="stat-value">${recentMock ? recentMock.score + "%" : "—"}</div><div class="stat-note">${recentMock ? `${recentMock.exam} · ${recentMock.timeLeft} remaining` : "Start a timed exam when ready"}</div></article>
      </div>
      <div class="dashboard-grid"><section><div class="section-heading"><h2>Exam domains</h2><button class="button quiet" data-view="progress">Detailed progress →</button></div><div class="card domain-list">${domains.map((item) => `<div class="domain-row"><strong>${escapeHtml(item.title)}</strong><div class="progress-track"><div class="progress-fill" style="width:${pct(completedCount(item), item.lessonIds.length)}%"></div></div><span class="domain-weight">${item.weight}% · ${pct(completedCount(item), item.lessonIds.length)}%</span></div>`).join("")}</div>
        <div class="section-heading"><h2>Study modules</h2><button class="button quiet" data-view="learn">Open learning path →</button></div><div class="module-list">${DATA.modules.map((item) => `<article class="module-card" data-action="open-module" data-id="${item.id}" tabindex="0" role="button"><span class="module-number">${String(item.id).padStart(2, "0")}</span><div><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.description)}</p></div><span class="tag">${item.weight ? item.weight + "% exam weight" : "Preparation"}</span></article>`).join("")}</div>
      </section><aside><div class="section-heading"><h2>Suggested next step</h2></div><div class="card"><div class="eyebrow">Continue your path</div><h3 style="margin-top:12px">${escapeHtml(next.title)}</h3><p class="muted small">Module ${next.module} · ${escapeHtml(next.domain)}</p><button class="button primary" data-action="open-lesson" data-id="${next.id}">Open lesson</button></div>
        <div class="section-heading"><h2>Study tools</h2></div><div class="card" style="display:grid;gap:9px"><button class="button" data-view="terminal">Open practice terminal</button><button class="button" data-view="labs">Try a graded lab</button><button class="button" data-view="reference">Search Docs Navigator</button><button class="button" data-view="exams">Browse six mock exams</button></div>
        <div class="section-heading"><h2>What this simulator is</h2></div><div class="callout">A local teaching model for selected kubectl workflows. It is not a real cluster, and it does not claim complete Kubernetes command fidelity. Open <button class="button quiet" style="padding:1px 4px" data-action="coverage">Command Coverage</button> before relying on it.</div></aside></div>`;
  }

  function renderLesson() {
    const lesson = lessonById(selectedLesson);
    const module = moduleById(lesson.module);
    const siblings = module.lessonIds.map(lessonById);
    const questions = quizFor(lesson);
    if (!quizState[lesson.id]) quizState[lesson.id] = { answers: {}, submitted: false };
    const quiz = quizState[lesson.id];
    return `<div class="eyebrow">${escapeHtml(module.title)}${module.weight ? ` · ${module.weight}% domain` : ""}</div><div class="hero-row"><div class="hero-copy"><h1>${escapeHtml(lesson.title)}</h1><p>${escapeHtml(lesson.domain)} · One home lesson for this concept set</p></div><button class="button ${progress.completed.includes(lesson.id) ? "" : "primary"}" data-action="complete-lesson" data-id="${lesson.id}">${progress.completed.includes(lesson.id) ? "✓ Completed" : "Mark lesson complete"}</button></div>
      <div class="split"><nav class="card lesson-nav" aria-label="Module lessons">${siblings.map((item) => `<button class="${item.id === lesson.id ? "active" : ""}" data-action="open-lesson" data-id="${item.id}">${progress.completed.includes(item.id) ? "✓ " : ""}${escapeHtml(item.title)}</button>`).join("")}</nav>
      <article class="card lesson-content"><div class="lesson-section"><h3>1. Objectives</h3><ul>${lesson.objectives.map((x) => `<li>${escapeHtml(x)}</li>`).join("")}</ul></div>
        <div class="lesson-section"><h3>2. Prerequisites</h3><p>${escapeHtml(lesson.prerequisites)}</p></div>
        <div class="lesson-section"><h3>3. Plain-English explanation</h3>${lesson.explanation.split("\n\n").map((p) => `<p>${escapeHtml(p)}</p>`).join("")}</div>
        <div class="lesson-section"><h3>4. How it works</h3><div class="code-sample">${escapeHtml(lesson.how)}</div></div>
        <div class="lesson-section"><h3>5. Worked example</h3><pre>${escapeHtml(lesson.command)}</pre><p><strong>Expected output</strong></p><pre>${escapeHtml(lesson.expected)}</pre><p>${escapeHtml(lesson.breakdown)}</p><button class="button" data-action="copy" data-copy="${encodeURIComponent(lesson.command)}">Copy commands</button></div>
        <div class="lesson-section"><h3>6. Hands-on lab</h3><p>${escapeHtml(lesson.lab)}</p><p class="small muted">Open the matching lab set in Labs &amp; troubleshooting to practice in the simulator. The simulator does not model every operation described in this lesson.</p><button class="button" data-view="labs">Open labs</button></div>
        <div class="lesson-section"><h3>7. Common mistakes</h3><ul>${lesson.mistakes.map((x) => `<li>${escapeHtml(x)}</li>`).join("")}</ul></div>
        <div class="lesson-section"><h3>8. Exam angle</h3><p>${escapeHtml(lesson.exam)}</p></div>
        <div class="lesson-section"><h3>9. Check your understanding</h3>${questions.map((item, qIndex) => {
          const chosen = quiz.answers[qIndex];
          const show = quiz.submitted && chosen !== undefined;
          const correct = chosen === item.answer;
          return `<div class="card" style="padding:13px;margin:9px 0"><p style="margin-bottom:9px;color:var(--text);font-weight:600">${qIndex + 1}. ${escapeHtml(item.question)}</p>${item.choices.map((choice, cIndex) => `<label style="display:flex;gap:8px;align-items:flex-start;margin:7px 0;font-size:11px;color:var(--muted)"><input type="radio" name="quiz-${lesson.id}-${qIndex}" data-action="quiz-answer" data-lesson="${lesson.id}" data-question="${qIndex}" value="${cIndex}" ${chosen === cIndex ? "checked" : ""} ${quiz.submitted ? "disabled" : ""}>${escapeHtml(choice)}</label>`).join("")}${show ? `<p class="${correct ? "" : "muted"} small" style="color:${correct ? "var(--accent)" : "var(--yellow)"}">${correct ? "Correct. " : "Review: "}${escapeHtml(item.why)}</p>` : ""}</div>`;
        }).join("")}<button class="button primary" data-action="submit-quiz" data-id="${lesson.id}" ${quiz.submitted ? "disabled" : ""}>Check answers</button>${quiz.submitted ? `<span class="small muted"> Best: ${quizScoreFor(lesson.id)}%</span><button class="button" data-action="retry-quiz" data-id="${lesson.id}">Try a new review</button>` : ""}</div>
        <div class="lesson-section"><h3>10. Summary</h3><ul>${lesson.summary.map((x) => `<li>${escapeHtml(x)}</li>`).join("")}</ul><button class="button" data-action="next-lesson" data-id="${lesson.id}">Next lesson →</button></div>
      </article></div>`;
  }

  function terminalWindow(compact) {
    return `<div class="terminal-window"><div class="terminal-titlebar"><i class="terminal-dot"></i><i class="terminal-dot"></i><i class="terminal-dot"></i><span>student@cluster — ${escapeHtml(SIM.context)}</span><span>simulated shell</span></div><pre id="terminal-output" class="terminal-output">${escapeHtml(terminalOutput)}</pre><form class="terminal-form" id="terminal-form"><span class="terminal-prompt">${escapeHtml(SIM.context)} $</span><input id="terminal-input" aria-label="Terminal command" autocomplete="off" spellcheck="false" placeholder="Type a command, e.g. kubectl get pods"><button>Run</button></form></div>${compact ? "" : `<p class="muted small">Tab completes selected kubectl resource names; ↑ recalls a previous command. Commands that are not emulated return an explicit notice and do not silently succeed.</p>`}`;
  }

  function renderTerminal() {
    return `<div class="hero-row"><div class="hero-copy"><div class="eyebrow">Hands-on command practice</div><h1>Practice terminal</h1><p>Type supported commands against an isolated, simulated cluster. State changes are temporary and reset when you clear the simulator.</p></div><button class="button danger" data-action="reset-simulator">Reset all clusters</button></div>
      <div class="callout warning" style="margin-bottom:14px">Not a real shell or cluster. Node commands, Kubernetes output, controllers, and state transitions are simplified. Use the Command Coverage reference to see exact limits.</div>${terminalWindow(false)}
      <div class="section-heading"><h2>Try a command</h2><span class="tag">Context: ${escapeHtml(SIM.context)}</span></div><div class="card"><div class="form-row">${["kubectl get nodes -o wide", "kubectl get pods -A", "kubectl create deployment demo --image=nginx", "kubectl scale deployment/demo --replicas=3", "kubectl config use-context staging"].map((command) => `<button class="button" data-action="run-command" data-command="${encodeURIComponent(command)}">${escapeHtml(command)}</button>`).join("")}</div></div>`;
  }

  function renderLabs() {
    const tasks = SIM.checks();
    return `<div class="hero-row"><div class="hero-copy"><div class="eyebrow">State-based grading</div><h1>Labs &amp; troubleshooting</h1><p>Each supported lab checks the simulated cluster's final state, not a preferred command sequence. Partial credit is shown per assertion.</p></div><button class="button" data-view="terminal">Open terminal ↗</button></div>
      <div class="callout warning" style="margin-bottom:16px">The fault library below contains 40 diagnosis drills (symptom + evidence + likely cause), not 40 independently running broken virtual clusters. Those drills teach investigation; stateful repair is currently implemented only for the listed command/lab coverage.</div>
      <div class="lab-grid">${tasks.map((task) => {
        const result = progress.labRuns[task.id];
        return `<article class="card lab-card"><span class="tag">${escapeHtml(task.namespace)} · ${task.weight} pts</span><h3>${escapeHtml(task.title)}</h3><p>${escapeHtml(task.description)}</p>${result ? `<p class="small" style="color:${result.passed ? "var(--accent)" : "var(--yellow)"}">${result.passed ? "Passed" : "Needs work"} · ${result.score}% · ${fmtDate(result.date)}</p>` : ""}<button class="button ${selectedLab === task.id ? "primary" : ""}" data-action="select-lab" data-id="${task.id}">${selectedLab === task.id ? "Selected" : "Open lab"}</button>${selectedLab === task.id ? `<div class="hint-panel"><details><summary>Nudge</summary><p>${escapeHtml(task.hint)}</p></details><details><summary>Stronger hint</summary><p>${escapeHtml(task.strongerHint)}</p></details><div class="form-row" style="margin-top:10px"><button class="button" data-action="grade-lab" data-id="${task.id}">Grade final state</button><button class="button" data-action="show-solution" data-id="${task.id}">Run model solution</button><button class="button quiet" data-action="reset-simulator">Reset cluster</button></div><ul class="assertion-list" id="lab-assertions">${result ? result.assertions.map((a) => `<li class="${a.pass ? "pass" : ""}">${escapeHtml(a.label)} — ${a.pass ? "passed" : "not met"}</li>`).join("") : ""}</ul></div>` : ""}</article>`;
      }).join("")}</div>
      <div class="section-heading"><h2>40 troubleshooting diagnosis drills</h2><span class="tag">Symptom → evidence → hypothesis</span></div><input class="reference-search" id="fault-search" placeholder="Filter fault scenarios by symptom, domain, or evidence…"><div id="fault-list" class="reference-grid">${renderFaults(DATA.faults)}</div>`;
  }
  function renderFaults(faults) {
    return faults.map((fault, index) => {
      index = DATA.faults.indexOf(fault);
      const answer = faultAnswers[index];
      const options = [fault.cause, ...DATA.faults.filter((other) => other.cause !== fault.cause && other.domain === fault.domain).slice(0, 3).map((other) => other.cause)];
      const unique = [...new Set(options)];
      return `<article class="card"><span class="tag">${escapeHtml(fault.domain)} · Drill ${String(index + 1).padStart(2, "0")}</span><h3 style="margin-top:9px">${escapeHtml(fault.symptom)}</h3><p><strong>Evidence:</strong> ${escapeHtml(fault.evidence)}</p><p class="small muted">Next check: ${escapeHtml(fault.next)}</p><label class="field">Most likely cause<select data-action="fault-answer" data-index="${index}"><option value="">Choose diagnosis…</option>${unique.map((option) => `<option ${answer ? answer.value === option ? "selected" : "" : ""} value="${escapeHtml(option)}">${escapeHtml(option)}</option>`).join("")}</select></label>${answer ? `<p class="small" style="color:${answer.correct ? "var(--accent)" : "var(--yellow)"}">${answer.correct ? "Correct diagnosis." : "Not quite. "} ${escapeHtml(fault.cause)}</p>` : ""}</article>`;
    }).join("");
  }

  function makeExamTask(examIndex, index) {
    const types = ["deployment", "configmap", "service", "node-label", "image-update", "context"];
    const type = types[(index + examIndex) % types.length];
    const context = ["training", "staging", "production"][(index + examIndex) % 3];
    const base = `m${examIndex + 1}-${String(index + 1).padStart(2, "0")}`;
    const common = { id: base, index: index + 1, context, checked: false, assertions: [], timeSpent: 0 };
    if (type === "deployment") return { ...common, type, domain: "Workloads & Scheduling", weight: 7, name: `web-${base}`, namespace: "default", image: "nginx:1.27", replicas: 2 + (index % 2), prompt: `In context ${context}, create Deployment web-${base} in default with image nginx:1.27 and ${2 + (index % 2)} ready replicas.` };
    if (type === "configmap") return { ...common, type, domain: "Workloads & Scheduling", weight: 6, name: `settings-${base}`, namespace: "shop", key: "MODE", value: `exam${examIndex + 1}`, prompt: `In context ${context}, create ConfigMap settings-${base} in namespace shop with MODE=exam${examIndex + 1}.` };
    if (type === "service") return { ...common, type, domain: "Services & Networking", weight: 7, name: `api-${base}`, namespace: "shop", image: "nginx:1.27", port: 8080, prompt: `In context ${context}, create Deployment api-${base} in shop with image nginx:1.27 and expose it internally as a ClusterIP Service on port 8080.` };
    if (type === "node-label") return { ...common, type, domain: "Cluster Architecture", weight: 5, name: "worker-b", key: `exam-group-${examIndex + 1}`, value: `set-${index + 1}`, prompt: `In context ${context}, label node worker-b with exam-group-${examIndex + 1}=set-${index + 1}.` };
    if (type === "image-update") return { ...common, type, domain: "Troubleshooting", weight: 7, name: `repair-${base}`, namespace: "shop", image: "nginx:1.28", prompt: `In context ${context}, ensure Deployment repair-${base} exists in shop and uses image nginx:1.28.` };
    return { ...common, type, domain: "Cluster Architecture", weight: 5, prompt: `Switch kubectl to context ${context} and verify it is the active context.` };
  }
  function makeExam(index) {
    return { index, name: `Mock ${String(index + 1).padStart(2, "0")}`, tasks: Array.from({ length: 15 }, (_, i) => makeExamTask(index, i)), startedAt: Date.now(), taskStartedAt: Date.now(), duration: 120 * 60, finished: false, notepad: "" };
  }
  function gradeExamTask(task, snapshot) {
    const cluster = snapshot.clusters[task.context];
    const key = `${task.namespace || "default"}/${task.name}`;
    const assertions = [];
    if (task.type === "deployment") {
      const d = cluster.deployments[key];
      assertions.push({ label: "Deployment exists with requested image", pass: !!d && d.image === task.image }, { label: "Requested replicas are ready", pass: !!d && d.ready === task.replicas && d.replicas === task.replicas });
    } else if (task.type === "configmap") {
      const cm = cluster.configmaps[key];
      assertions.push({ label: "ConfigMap exists in requested namespace", pass: !!cm }, { label: "Required key has requested value", pass: !!cm && cm.data[task.key] === task.value });
    } else if (task.type === "service") {
      const d = cluster.deployments[key], s = cluster.services[key];
      assertions.push({ label: "Deployment uses requested image", pass: !!d && d.image === task.image }, { label: "ClusterIP Service exposes requested port and selects the Deployment", pass: !!s && s.type === "ClusterIP" && s.port === task.port && !!d && s.selector.app === d.name });
    } else if (task.type === "node-label") {
      const node = cluster.nodes.find((item) => item.name === task.name);
      assertions.push({ label: "Node has the required label", pass: !!node && node.labels[task.key] === task.value });
    } else if (task.type === "image-update") {
      const d = cluster.deployments[key];
      assertions.push({ label: "Deployment exists with corrected image", pass: !!d && d.image === task.image });
    } else {
      assertions.push({ label: "Requested context was active when task was checked", pass: snapshot.currentContext === task.context });
    }
    return assertions;
  }
  function gradeActiveExamTask() {
    if (!exam || exam.finished) return;
    const task = exam.tasks[examTaskIndex];
    task.assertions = gradeExamTask(task, SIM.snapshot());
    task.checked = true;
    persistExam();
    render();
    toast(`${task.assertions.filter((x) => x.pass).length}/${task.assertions.length} assertions passed for task ${task.index}.`);
  }
  function examTimeLeft() {
    if (!exam) return 0;
    return Math.max(0, exam.duration - Math.floor((Date.now() - exam.startedAt) / 1000));
  }
  function clock(seconds) {
    const mins = Math.floor(seconds / 60).toString().padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  }
  function finishExam() {
    if (!exam || exam.finished) return;
    recordTaskTime();
    const snapshot = SIM.snapshot();
    exam.tasks.forEach((task) => {
      if (task.type !== "context" || !task.checked) task.assertions = gradeExamTask(task, snapshot);
      task.checked = true;
    });
    exam.finished = true;
    const possible = exam.tasks.reduce((sum, task) => sum + task.weight * task.assertions.length, 0);
    const earned = exam.tasks.reduce((sum, task) => sum + task.weight * task.assertions.filter((item) => item.pass).length, 0);
    const result = {
      exam: exam.name, score: pct(earned, possible), date: new Date().toISOString(),
      timeLeft: clock(examTimeLeft()),
      domains: DATA.modules.filter((item) => item.weight).map((module) => {
        const tasks = exam.tasks.filter((task) => task.domain === module.title);
        const max = tasks.reduce((sum, task) => sum + task.weight * task.assertions.length, 0);
        const got = tasks.reduce((sum, task) => sum + task.weight * task.assertions.filter((x) => x.pass).length, 0);
        return { name: module.title, score: max ? pct(got, max) : null, tasks: tasks.length };
      }),
      missed: exam.tasks.filter((task) => task.assertions.some((x) => !x.pass)).length,
      taskTimes: exam.tasks.map((task) => ({ index: task.index, seconds: Math.round(task.timeSpent / 1000), passed: task.assertions.every((item) => item.pass) }))
    };
    progress.mocks.push(result);
    progress.activeExam = null;
    progress.activeExamTaskIndex = 0;
    saveProgress();
    render();
    toast(`Mock complete: ${result.score}%`);
  }
  function renderExam() {
    if (!exam) return `<div class="hero-row"><div class="hero-copy"><div class="eyebrow">Timed hands-on practice</div><h1>Mock exams</h1><p>Six unique 15-task exams. Each task includes a final-state rubric and draws on the simulator's honest command coverage. The real exam's number and weighting of tasks can vary.</p></div></div>
      <div class="callout warning" style="margin-bottom:15px">This mock mode is 120 minutes and uses weighted simulated tasks. It is not an exact recreation of the official exam environment, complete task bank, or grading system.</div><div class="exam-grid">${Array.from({ length: 6 }, (_, index) => `<article class="card exam-card"><span class="tag">2 hours · 15 tasks</span><h3>${`Mock ${String(index + 1).padStart(2, "0")}`}</h3><p>Variant ${index + 1} · Context switches, workload tasks, configuration, node operations, and Services.</p><button class="button primary" data-action="start-exam" data-id="${index}">Start timed mock</button></article>`).join("")}</div>
      <div class="section-heading"><h2>Recent results</h2></div>${progress.mocks.length ? `<table class="table"><thead><tr><th>Exam</th><th>Score</th><th>Time left</th><th>Missed tasks</th></tr></thead><tbody>${progress.mocks.slice().reverse().slice(0, 8).map((item) => `<tr><td>${escapeHtml(item.exam)}</td><td>${item.score}%</td><td>${escapeHtml(item.timeLeft)}</td><td>${item.missed}</td></tr>`).join("")}</tbody></table>` : `<div class="card empty-state">No mock results yet.</div>`}`;
    const task = exam.tasks[examTaskIndex];
    const complete = exam.tasks.filter((item) => item.checked).length;
    const timeLeft = examTimeLeft();
    return `<div class="hero-row"><div class="hero-copy"><div class="eyebrow">${exam.name} · ${complete}/15 tasks checked</div><h1>Timed mock exam</h1><p>No hints. Use the practice terminal and final-state checks. Navigate and flag tasks; use the notepad for context or follow-up.</p></div><div class="timer" id="exam-timer">${clock(timeLeft)}</div></div>
      ${exam.finished ? renderExamReport() : `<div class="exam-toolbar"><button class="button danger" data-action="end-exam">End and score exam</button><button class="button" data-action="flag-task" data-id="${examTaskIndex}">${task.flagged ? "⚑ Flagged" : "⚐ Flag for review"}</button><span class="tag">Target context: ${escapeHtml(task.context)}</span><span class="tag">Weight ${task.weight}</span></div>
      <div class="exam-layout"><div><article class="card"><div class="eyebrow">Task ${task.index} · ${escapeHtml(task.domain)}</div><h2 style="margin-top:10px">${escapeHtml(task.prompt)}</h2><p class="muted small">Make the requested change in the simulator. This exam has no hints. Task is graded against its final cluster state.</p><button class="button primary" data-action="grade-exam-task">Check task state</button>${task.checked ? `<ul class="assertion-list">${task.assertions.map((x) => `<li class="${x.pass ? "pass" : ""}">${escapeHtml(x.label)} — ${x.pass ? "passed" : "not met"}</li>`).join("")}</ul>` : ""}</article><div class="section-heading"><h2>Practice terminal</h2><span class="tag">${escapeHtml(SIM.context)}</span></div>${terminalWindow(true)}<label class="field" style="margin-top:12px">Persistent notepad<textarea id="exam-notepad" rows="4" style="background:#0d1624;color:var(--text);border:1px solid var(--line);border-radius:7px;padding:10px">${escapeHtml(exam.notepad)}</textarea></label></div>
      <aside class="card"><h3>Question navigator</h3><div class="task-nav">${exam.tasks.map((item, index) => `<button class="${item.checked ? "done" : ""} ${item.flagged ? "flagged" : ""}" data-action="go-exam-task" data-id="${index}" aria-label="Task ${index + 1}">${index + 1}${item.flagged ? " ⚑" : ""}</button>`).join("")}</div><p class="small muted" style="margin-top:12px">Green: checked · Gold: flagged</p><button class="button primary" style="width:100%;margin-top:9px" data-action="end-exam">Finish and score</button></aside></div>`}`;
  }
  function renderExamReport() {
    const latest = progress.mocks[progress.mocks.length - 1];
    const recent = progress.mocks.slice(-3);
    const ready = recent.length === 3 && recent.every((item) => item.score >= 76 && item.timeLeft !== "00:00");
    const weak = latest ? latest.domains.filter((item) => item.tasks && item.score < 75) : [];
    const slowest = latest ? (latest.taskTimes || []).slice().sort((a, b) => b.seconds - a.seconds).slice(0, 3) : [];
    const missedByDomain = latest ? latest.domains.filter((item) => item.tasks).map((item) => ({ ...item, missed: exam.tasks.filter((task) => task.domain === item.name && task.assertions.some((assertion) => !assertion.pass)).length })) : [];
    return `<div class="dashboard-grid"><section class="card"><div class="eyebrow">Exam report</div><h2 style="margin-top:10px">${latest ? latest.score : 0}% · ${latest && latest.score >= 66 ? "Passing mark reached" : "Below passing mark"}</h2><p class="muted">Official passing score: 66%. This study tool's mock score is not a prediction or guarantee. Storage is not tested in this mock bank.</p><div class="domain-list">${latest ? latest.domains.map((item) => `<div class="domain-row"><strong>${escapeHtml(item.name)}</strong><div class="progress-track"><div class="progress-fill" style="width:${item.score == null ? 0 : item.score}%"></div></div><span class="domain-weight">${item.score == null ? "Not tested" : `${item.score}% · ${item.tasks} tasks`}</span></div>`).join("") : ""}</div><h3 style="margin-top:18px">Missed tasks by domain</h3><p class="small muted">${missedByDomain.map((item) => `${escapeHtml(item.name)}: ${item.missed} missed`).join(" · ")}</p><h3>Tasks taking the most time</h3><p class="small muted">${slowest.map((item) => `Task ${item.index}: ${item.seconds}s`).join(" · ") || "No timing data"}</p></section><aside class="card"><h3>Readiness gate</h3><p class="small muted">${ready ? "You've met the suggested three consecutive mocks at 76%+ with time remaining." : "Recommendation: three consecutive mocks at 76% or higher, finishing with time to spare. This is a study target, not a guarantee."}</p><h3>Suggested review</h3>${weak.length ? weak.map((item) => {
      const lesson = DATA.lessons.find((itemLesson) => itemLesson.domain === item.name);
      return `<p class="small">${escapeHtml(item.name)} (${item.score}%)${lesson ? ` · <button class="button quiet" data-action="open-lesson" data-id="${lesson.id}">Review lesson</button>` : ""}</p>`;
    }).join("") : `<p class="small muted">Review any unchecked assertions and repeat with another scenario.</p>`}<button class="button" data-action="back-exams">Back to mock exams</button></aside></div><div class="section-heading"><h2>Task review</h2></div><div class="module-list">${exam.tasks.map((task) => `<article class="card"><span class="tag">${escapeHtml(task.domain)} · ${task.weight} pts · ${Math.round(task.timeSpent / 1000)} sec</span><h3 style="margin-top:8px">Task ${task.index}: ${escapeHtml(task.prompt)}</h3><ul class="assertion-list">${task.assertions.map((item) => `<li class="${item.pass ? "pass" : ""}">${escapeHtml(item.label)} — ${item.pass ? "passed" : "not met"}</li>`).join("")}</ul></article>`).join("")}</div>`;
  }

  function renderReference() {
    return `<div class="hero-row"><div class="hero-copy"><div class="eyebrow">Local reference</div><h1>Reference library</h1><p>Search bundled concepts, YAML guidance, troubleshooting flow, and command coverage. This is a study aid, not an external docs browser.</p></div></div>
      <div class="reference-grid"><article class="card"><h3>Command cheat sheets</h3>${DATA.cheats.map((sheet) => `<details class="hint-panel"><summary>${escapeHtml(sheet.title)}</summary><pre>${escapeHtml(sheet.lines.join("\n"))}</pre><button class="button" data-action="copy" data-copy="${encodeURIComponent(sheet.lines.join("\n"))}">Copy</button></details>`).join("")}</article><article class="card"><h3>Exam-day checklist</h3><ul class="small muted"><li>Read the current handbook and allowed-resource rules.</li><li>Confirm context and namespace before every task.</li><li>Read all requested fields before creating a resource.</li><li>Check final state, readiness, selectors, and events.</li><li>Leave time for a final verification pass.</li></ul></article></div>
      <div class="section-heading"><h2>Docs Navigator</h2><span class="tag">${DATA.reference.length} bundled lookup cards</span></div><input class="reference-search" id="reference-search" placeholder="Try: add a toleration, expose a Deployment, why PVC Pending…"><div id="reference-list" class="card">${renderReferenceItems(DATA.reference)}</div>
      <div class="section-heading"><h2>YAML field and template library</h2></div><div class="reference-grid">${[
        ["Pod", "apiVersion: v1\\nkind: Pod\\nmetadata:\\n  name: demo\\n  labels:\\n    app: demo\\nspec:\\n  containers:\\n  - name: web\\n    image: nginx:1.27"],
        ["Deployment", "apiVersion: apps/v1\\nkind: Deployment\\nmetadata:\\n  name: demo\\nspec:\\n  replicas: 2\\n  selector:\\n    matchLabels:\\n      app: demo\\n  template:\\n    metadata:\\n      labels:\\n        app: demo\\n    spec:\\n      containers:\\n      - name: web\\n        image: nginx:1.27"],
        ["Service", "apiVersion: v1\\nkind: Service\\nmetadata:\\n  name: demo\\nspec:\\n  selector:\\n    app: demo\\n  ports:\\n  - port: 80\\n    targetPort: 8080\\n  type: ClusterIP"],
        ["PersistentVolumeClaim", "apiVersion: v1\\nkind: PersistentVolumeClaim\\nmetadata:\\n  name: data\\nspec:\\n  accessModes:\\n  - ReadWriteOnce\\n  resources:\\n    requests:\\n      storage: 5Gi"]
      ].map(([title, body]) => `<article class="card"><h3>${title}</h3><pre>${escapeHtml(body.replace(/\\n/g, "\n"))}</pre><button class="button" data-action="copy" data-copy="${encodeURIComponent(body.replace(/\\n/g, "\n"))}">Copy YAML</button></article>`).join("")}</div>
      <div class="section-heading"><h2>Command Coverage</h2><button class="button" data-action="coverage">Show full coverage</button></div><div class="card" id="coverage-panel" hidden>${coverageHtml()}</div>`;
  }
  function renderReferenceItems(items) {
    return items.length ? items.map((item) => `<article class="reference-item"><h3>${escapeHtml(item[0])}</h3><p>${escapeHtml(item[1])}</p><button class="button quiet" data-action="open-lesson" data-id="${item[2]}">Home lesson →</button></article>`).join("") : `<div class="empty-state">No matching reference entries.</div>`;
  }
  function coverageHtml() {
    const groups = [
      ["Emulated kubectl", "get (Pods, Deployments, Services, Nodes, Namespaces, ConfigMaps, Secrets, PVC placeholders, Events; Pods support -o wide only), create (Namespace, Deployment, ConfigMap, Secret, Pod), run, scale, set image, rollout status/history/undo, expose, delete, label/annotate (node and Pod only), taint, cordon, drain, uncordon, describe (Pod, Deployment, Node), logs (sample output), auth can-i (simplified canned authorization), config current-context/get-contexts/use-context, api-resources (sample list), explain (placeholder), wait (Pod Ready and Deployment Available checks), top pods (illustrative fixed metrics)."],
      ["Simulated Linux/node", "pwd, hostname, ls, cat (selected fixtures), grep (selected fixtures), systemctl status and journalctl (sample output), nslookup/dig, ip, ss/netstat (sample output), ssh (three virtual node labels), exit."],
      ["Simulator mechanics", "Three isolated contexts; in-memory namespaces, nodes, Deployments, Pods, Services, ConfigMaps, Secrets, PVC placeholders, events; simple Deployment-to-Pod reconciliation; six state-assertion practice labs; six generated mock exams with fifteen weighted tasks each."],
      ["Not emulated", "Full YAML parsing/apply/patch/edit; JSON, YAML, jsonpath and custom-column serializers; selectors and sort-by semantics; real scheduling/resource accounting; real rollouts and rollback history; exec/curl; vim/nano editing or file mutation; filesystem writes; real node shell; Helm/Kustomize; etcdctl; kubeadm; crictl; service networking, DNS, policy enforcement, storage provisioning; live logs/events; full RBAC model; real API errors/version fidelity."],
      ["Important fidelity note", "Unsupported commands print an explicit simulator message. Sample diagnostic outputs are illustrative, not byte-for-byte Kubernetes outputs. The simulator does not reproduce Kubernetes scheduling, controllers, API validation, security, or cluster failure behavior."]
    ];
    return groups.map(([title, body]) => `<section class="reference-item"><h3>${escapeHtml(title)}</h3><p>${escapeHtml(body)}</p></section>`).join("");
  }

  function renderProgress() {
    const domains = DATA.modules.filter((item) => item.weight);
    const topMissed = [...new Set(progress.missed)].slice(-8);
    const planner = progress.planner || {};
    const remaining = DATA.lessons.filter((item) => !progress.completed.includes(item.id));
    let plan = [];
    if (planner.examDate && planner.hours) {
      const days = Math.max(1, Math.ceil((new Date(planner.examDate + "T12:00:00") - new Date()) / 86400000));
      const slots = Math.max(1, Math.floor(days * Number(planner.hours)));
      plan = Array.from({ length: Math.min(14, slots) }, (_, i) => remaining[i % Math.max(1, remaining.length)] || DATA.lessons[i % DATA.lessons.length]);
    }
    const recent = progress.mocks.slice(-3);
    const ready = recent.length === 3 && recent.every((item) => item.score >= 76 && item.timeLeft !== "00:00");
    return `<div class="hero-row"><div class="hero-copy"><div class="eyebrow">Your local study record</div><h1>Progress &amp; planner</h1><p>Track lessons, quiz attempts, lab results, mock exam scores, and speed. Progress is stored locally in this browser; export regular backups.</p></div><button class="button primary" data-action="export-progress">Export progress JSON</button></div>
      <div class="dashboard-grid"><section><div class="section-heading"><h2>Domain readiness</h2></div><div class="card domain-list">${domains.map((module) => `<div><div class="domain-row"><strong>${escapeHtml(module.title)}</strong><div class="progress-track"><div class="progress-fill" style="width:${pct(completedCount(module), module.lessonIds.length)}%"></div></div><span class="domain-weight">${module.weight}% · ${pct(completedCount(module), module.lessonIds.length)}%</span></div><p class="small muted">${completedCount(module)}/${module.lessonIds.length} lessons · average quiz ${Math.round(module.lessonIds.reduce((sum, id) => sum + (quizScoreFor(id) || 0), 0) / module.lessonIds.length)}%</p></div>`).join("")}</div>
        <div class="section-heading"><h2>Mock exam trend</h2></div>${progress.mocks.length ? `<table class="table"><thead><tr><th>Mock</th><th>Score</th><th>Avg task seconds</th><th>Finished with time</th></tr></thead><tbody>${progress.mocks.slice(-10).reverse().map((item) => { const times = (item.taskTimes || []).map((task) => task.seconds); const average = times.length ? Math.round(times.reduce((sum, value) => sum + value, 0) / times.length) : "—"; return `<tr><td>${escapeHtml(item.exam)}</td><td>${item.score}%</td><td>${average}</td><td>${item.timeLeft === "00:00" ? "No" : "Yes"} (${escapeHtml(item.timeLeft)})</td></tr>`; }).join("")}</tbody></table>` : `<div class="card empty-state">Take a mock exam to build your trend.</div>`}
      </section><aside><div class="card"><h3>Am I ready?</h3><p class="small muted">${ready ? "Suggested readiness gate met: three consecutive mocks at 76%+ with time to spare." : "Suggested gate: three consecutive mock scores at least 10 points above 66%, all finished with time remaining."}</p><p class="small muted">This is not a promise of passing. Verify the current exam handbook and assess your confidence honestly.</p></div>
        <div class="section-heading"><h2>Study planner</h2></div><form id="planner-form" class="card" style="display:grid;gap:10px"><label class="field">Exam date<input type="date" name="examDate" value="${escapeHtml(planner.examDate || "")}"></label><label class="field">Study hours per week<input type="number" name="hours" min="1" max="60" value="${escapeHtml(planner.hours || 6)}"></label><button class="button primary">Generate schedule</button></form>
        <div class="section-heading"><h2>Progress backup</h2></div><div class="card"><label class="field">Import a previously exported JSON file<input type="file" id="import-progress" accept="application/json,.json"></label><p class="small muted">Import replaces this browser's saved study history.</p><button class="button danger" data-action="clear-progress">Clear saved progress</button></div>
        <div class="section-heading"><h2>Weak areas</h2></div><div class="card">${topMissed.length ? topMissed.map((id) => { const lesson = lessonById(id); return `<p class="small">${escapeHtml(lesson.title)} <button class="button quiet" data-action="open-lesson" data-id="${lesson.id}">Review</button></p>`; }).join("") : `<p class="small muted">Missed concepts appear here after quiz reviews.</p>`}</div></aside></div>
      ${plan.length ? `<div class="section-heading"><h2>Suggested next ${plan.length} study blocks</h2><span class="tag">Generated from remaining lessons</span></div><div class="module-list">${plan.map((lesson, i) => `<article class="module-card" data-action="open-lesson" data-id="${lesson.id}" tabindex="0" role="button"><span class="module-number">${String(i + 1).padStart(2, "0")}</span><div><h3>${escapeHtml(lesson.title)}</h3><p>${escapeHtml(lesson.domain)} · Read lesson, complete its quiz, and do one lab or drill.</p></div><span class="tag">Study block</span></article>`).join("")}</div>` : ""}`;
  }

  function render() {
    document.body.classList.toggle("light-mode", progress.theme === "light");
    const root = document.getElementById("app-view");
    document.getElementById("page-label").textContent = VIEWS[view] || "Overview";
    document.querySelectorAll(".nav-link[data-view]").forEach((item) => item.classList.toggle("active", item.dataset.view === view));
    if (view === "overview") root.innerHTML = renderOverview();
    else if (view === "learn") root.innerHTML = renderLesson();
    else if (view === "terminal") root.innerHTML = renderTerminal();
    else if (view === "labs") root.innerHTML = renderLabs();
    else if (view === "exams") root.innerHTML = renderExam();
    else if (view === "reference") root.innerHTML = renderReference();
    else if (view === "progress") root.innerHTML = renderProgress();
    else { view = "overview"; root.innerHTML = renderOverview(); }
    window.setTimeout(() => {
      const input = document.getElementById("terminal-input");
      if (input && document.activeElement && document.activeElement.id === "terminal-input") input.focus();
    }, 0);
  }

  function setView(next) {
    if (next === "exams" && exam && !exam.finished) {
      view = "exams";
    } else view = VIEWS[next] ? next : "overview";
    render();
    document.getElementById("app-view").focus({ preventScroll: true });
    document.querySelector(".sidebar").classList.remove("open");
  }
  function appendTerminal(line, output) {
    const prompt = `${SIM.context} $ ${line}`;
    terminalOutput += `${terminalOutput.endsWith("\n") ? "" : "\n"}${prompt}\n${output === "\u0000CLEAR" ? "" : output}\n`;
    if (output === "\u0000CLEAR") terminalOutput = "";
  }
  function runCommand(line) {
    const output = SIM.command(line);
    persistSimulator();
    appendTerminal(line, output);
    terminalHistoryIndex = 0;
    render();
    if (view === "labs") return;
    const input = document.getElementById("terminal-input");
    if (input) input.focus();
  }
  function resetSimulator() {
    SIM.reset();
    persistSimulator();
    terminalOutput = "Simulated clusters reset to their starting state.\n";
    if (exam && !exam.finished) {
      exam.tasks.forEach((task) => { task.checked = false; task.assertions = []; });
    }
    render();
    toast("All simulated cluster states reset.");
  }
  function selectLab(id) {
    selectedLab = id;
    render();
  }
  function gradeLab(id) {
    const lab = getLab(id);
    const assertions = lab.grade();
    const score = pct(assertions.filter((item) => item.pass).length, assertions.length);
    progress.labRuns[id] = { passed: assertions.every((item) => item.pass), score, date: new Date().toISOString(), assertions };
    saveProgress();
    render();
    toast(`Lab score: ${score}%`);
  }
  function runSolution(id) {
    const lab = getLab(id);
    view = "terminal";
    lab.solution.forEach((command) => appendTerminal(command, SIM.command(command)));
    persistSimulator();
    render();
    toast("Model solution commands ran in the simulated cluster.");
  }
  function startExam(index) {
    SIM.reset();
    persistSimulator();
    exam = makeExam(Number(index));
    examTaskIndex = 0;
    terminalOutput = `Mock ${Number(index) + 1} started. Commands are simulated; see Command Coverage.\n`;
    view = "exams";
    persistExam();
    render();
    toast("120-minute mock started. No hints are available.");
  }
  function recordTaskTime() {
    if (!exam || !exam.taskStartedAt) return;
    const task = exam.tasks[examTaskIndex];
    if (task) task.timeSpent = (task.timeSpent || 0) + Math.max(0, Date.now() - exam.taskStartedAt);
    exam.taskStartedAt = Date.now();
  }
  function submitQuiz(id) {
    const lesson = lessonById(id);
    const questions = quizFor(lesson);
    const state = quizState[id];
    if (!questions.every((_, index) => state.answers[index] !== undefined)) {
      toast("Answer every question before checking.");
      return;
    }
    state.submitted = true;
    const correct = questions.filter((item, index) => item.answer === state.answers[index]).length;
    const score = pct(correct, questions.length);
    const previous = progress.quizScores[id];
    progress.quizScores[id] = { best: Math.max(previous ? previous.best : 0, score), latest: score, attempts: (previous ? previous.attempts : 0) + 1 };
    if (score < 100 && !progress.missed.includes(id)) progress.missed.push(id);
    else if (score === 100) progress.missed = progress.missed.filter((missedId) => missedId !== id);
    saveProgress();
    render();
    toast(`Quiz score: ${score}%`);
  }
  function answerFault(index, value) {
    const fault = DATA.faults[index];
    if (!fault || !value) return;
    faultAnswers[index] = { value, correct: value === fault.cause };
    render();
    const input = document.querySelector(`[data-action="fault-answer"][data-index="${index}"]`);
    if (input) input.focus();
  }
  function updateSearch(query) {
    const box = document.getElementById("search-results");
    const value = query.trim().toLowerCase();
    if (value.length < 2) { box.hidden = true; box.innerHTML = ""; return; }
    const lessons = DATA.lessons.filter((item) => `${item.title} ${item.domain} ${item.concepts.join(" ")} ${item.explanation}`.toLowerCase().includes(value)).slice(0, 7);
    const refs = DATA.reference.filter((item) => `${item[0]} ${item[1]}`.toLowerCase().includes(value)).slice(0, 5);
    const results = [
      ...lessons.map((item) => `<button data-action="open-lesson" data-id="${item.id}"><strong>${escapeHtml(item.title)}</strong><small>Lesson · ${escapeHtml(item.domain)}</small></button>`),
      ...refs.map((item) => `<button data-action="open-reference" data-query="${encodeURIComponent(item[0])}"><strong>${escapeHtml(item[0])}</strong><small>Reference lookup</small></button>`)
    ];
    box.innerHTML = results.length ? results.join("") : `<div class="empty-state">No local results.</div>`;
    box.hidden = false;
  }
  function updateFilteredReference(query, targetId, data) {
    const node = document.getElementById(targetId);
    if (!node) return;
    const q = query.toLowerCase().trim();
    node.innerHTML = renderReferenceItems(data.filter((item) => !q || `${item[0]} ${item[1]}`.toLowerCase().includes(q)));
  }

  document.addEventListener("click", async (event) => {
    const target = event.target.closest("[data-action], [data-view]");
    if (!target) return;
    if (target.dataset.view) { setView(target.dataset.view); return; }
    const action = target.dataset.action;
    const id = target.dataset.id;
    if (action === "open-lesson") { selectedLesson = id; setView("learn"); }
    else if (action === "open-module") {
      const module = moduleById(id);
      if (module) { selectedLesson = module.lessonIds[0]; setView("learn"); }
    } else if (action === "complete-lesson") {
      if (!progress.completed.includes(id)) progress.completed.push(id);
      saveProgress(); render(); toast("Lesson completion saved locally.");
    } else if (action === "next-lesson") {
      const index = DATA.lessons.findIndex((item) => item.id === id);
      selectedLesson = DATA.lessons[(index + 1) % DATA.lessons.length].id; render();
    } else if (action === "quiz-answer") {
      const lesson = target.dataset.lesson; const q = Number(target.dataset.question);
      quizState[lesson] = quizState[lesson] || { answers: {}, submitted: false };
      quizState[lesson].answers[q] = Number(target.value);
    } else if (action === "submit-quiz") submitQuiz(id);
    else if (action === "retry-quiz") { quizState[id] = { answers: {}, submitted: false }; render(); }
    else if (action === "select-lab") selectLab(id);
    else if (action === "grade-lab") gradeLab(id);
    else if (action === "show-solution") runSolution(id);
    else if (action === "reset-simulator") resetSimulator();
    else if (action === "run-command") runCommand(decodeURIComponent(target.dataset.command || ""));
    else if (action === "coverage") {
      const panel = document.getElementById("coverage-panel");
      if (panel) { panel.hidden = !panel.hidden; panel.innerHTML = coverageHtml(); }
      else { setView("reference"); window.setTimeout(() => { const p = document.getElementById("coverage-panel"); if (p) { p.hidden = false; p.innerHTML = coverageHtml(); } }, 0); }
    } else if (action === "start-exam") startExam(id);
    else if (action === "go-exam-task" && exam) { recordTaskTime(); examTaskIndex = Number(id); persistExam(); render(); }
    else if (action === "flag-task" && exam) { exam.tasks[Number(id)].flagged = !exam.tasks[Number(id)].flagged; persistExam(); render(); }
    else if (action === "grade-exam-task") gradeActiveExamTask();
    else if (action === "end-exam") {
      if (exam && window.confirm("Finish this mock exam and score all task states?")) finishExam();
    } else if (action === "back-exams") { exam = null; setView("exams"); }
    else if (action === "open-reference") { setView("reference"); window.setTimeout(() => { const input = document.getElementById("reference-search"); if (input) { input.value = decodeURIComponent(target.dataset.query || ""); input.dispatchEvent(new Event("input")); } }, 0); }
    else if (action === "copy") {
      const text = decodeURIComponent(target.dataset.copy || "");
      try { await navigator.clipboard.writeText(text); toast("Copied."); }
      catch (error) { console.error("Clipboard copy failed.", error); toast("Copy was blocked by this browser. Select the text and copy it manually."); }
    } else if (action === "export-progress") exportProgress();
    else if (action === "clear-progress") {
      if (window.confirm("Clear saved lessons, quizzes, labs, planner, and mock scores from this browser?")) { progress = defaultProgress(); saveProgress(); render(); toast("Saved progress cleared."); }
    }
  });

  document.addEventListener("submit", (event) => {
    if (event.target.id === "terminal-form") {
      event.preventDefault();
      const input = document.getElementById("terminal-input");
      const command = input.value.trim();
      if (command) runCommand(command);
    } else if (event.target.id === "planner-form") {
      event.preventDefault();
      const form = new FormData(event.target);
      const examDate = String(form.get("examDate") || "");
      const hours = Number(form.get("hours"));
      if (!examDate || new Date(examDate + "T23:59:59") <= new Date() || !Number.isFinite(hours) || hours < 1 || hours > 60) { toast("Choose a future exam date and 1–60 study hours per week."); return; }
      progress.planner = { examDate, hours };
      saveProgress(); render(); toast("Study schedule generated.");
    }
  });
  document.addEventListener("input", (event) => {
    if (event.target.id === "global-search") updateSearch(event.target.value);
    if (event.target.id === "reference-search") updateFilteredReference(event.target.value, "reference-list", DATA.reference);
    if (event.target.id === "fault-search") {
      const query = event.target.value.toLowerCase();
      const filtered = DATA.faults.filter((item) => `${item.domain} ${item.symptom} ${item.evidence} ${item.cause}`.toLowerCase().includes(query));
      document.getElementById("fault-list").innerHTML = renderFaults(filtered);
    }
    if (event.target.id === "exam-notepad" && exam) { exam.notepad = event.target.value; persistExam(); }
  });
  document.addEventListener("change", (event) => {
    if (event.target.dataset.action === "fault-answer") answerFault(Number(event.target.dataset.index), event.target.value);
    if (event.target.id === "import-progress" && event.target.files[0]) importProgress(event.target.files[0]);
  });
  document.addEventListener("keydown", (event) => {
    if (event.target.id === "terminal-input") {
      const commands = SIM.snapshot().history;
      if (event.key === "ArrowUp") {
        event.preventDefault(); terminalHistoryIndex = Math.min(commands.length, terminalHistoryIndex + 1);
        event.target.value = commands[commands.length - terminalHistoryIndex] || "";
      } else if (event.key === "ArrowDown") {
        event.preventDefault(); terminalHistoryIndex = Math.max(0, terminalHistoryIndex - 1);
        event.target.value = terminalHistoryIndex ? commands[commands.length - terminalHistoryIndex] : "";
      } else if (event.key === "Tab") {
        event.preventDefault();
        const candidates = ["kubectl get pods", "kubectl get deployments", "kubectl get services", "kubectl get nodes", "kubectl describe pod", "kubectl create deployment", "kubectl config use-context"];
        const match = candidates.find((item) => item.startsWith(event.target.value));
        if (match) event.target.value = match;
      }
    }
    if (event.key === "/" && !["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) {
      event.preventDefault(); document.getElementById("global-search").focus();
    }
    if ((event.key === "Enter" || event.key === " ") && event.target.matches(".module-card")) {
      event.preventDefault(); event.target.click();
    }
  });
  document.getElementById("theme-toggle").addEventListener("click", () => {
    progress.theme = progress.theme === "light" ? "dark" : "light";
    saveProgress(); render();
  });
  document.getElementById("mobile-menu").addEventListener("click", () => document.querySelector(".sidebar").classList.toggle("open"));
  document.addEventListener("click", (event) => {
    const search = document.getElementById("global-search");
    const results = document.getElementById("search-results");
    if (!event.target.closest(".searchbox") && !event.target.closest(".search-results")) results.hidden = true;
    if (event.target === search) results.hidden = false;
  });

  function exportProgress() {
    const blob = new Blob([JSON.stringify({ version: 1, exportedAt: new Date().toISOString(), progress, simulator: SIM.snapshot() }, null, 2)], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob); link.download = "clustercraft-progress.json"; link.click();
    URL.revokeObjectURL(link.href);
    toast("Progress JSON exported.");
  }
  function persistExam() {
    if (exam && exam.taskStartedAt) exam.activeTaskSeconds = (exam.tasks[examTaskIndex].timeSpent || 0) + Math.max(0, Date.now() - exam.taskStartedAt);
    progress.activeExam = exam;
    progress.activeExamTaskIndex = examTaskIndex;
    saveProgress();
  }
  function persistSimulator() {
    try { localStorage.setItem(SIMULATOR_KEY, JSON.stringify(SIM.snapshot())); }
    catch (error) {
      console.error("Could not save the simulated cluster state.", error);
      toast("Simulator state could not be saved in this browser.");
    }
  }
  async function importProgress(file) {
    try {
      const parsed = JSON.parse(await file.text());
      const candidate = parsed.progress || parsed;
      if (!candidate || typeof candidate !== "object" || !Array.isArray(candidate.completed) || !candidate.quizScores || !Array.isArray(candidate.mocks)) throw new Error("This file does not have the expected ClusterCraft progress format.");
      progress = { ...defaultProgress(), ...candidate };
      if (parsed.simulator) {
        SIM.restore(parsed.simulator);
        persistSimulator();
      }
      saveProgress(); render(); toast("Progress imported.");
    } catch (error) {
      console.error("Progress import failed.", error);
      toast(`Import failed: ${error.message}`);
    }
  }

  window.setInterval(() => {
    if (exam && !exam.finished && view === "exams") {
      const timer = document.getElementById("exam-timer");
      if (timer) timer.textContent = clock(examTimeLeft());
      if (examTimeLeft() === 0) finishExam();
    }
  }, 1000);
  render();
})();
