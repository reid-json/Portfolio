const store = loadStore();
const PASS_TARGET = 80;
const total = examQuestions.length;
const MINUTES_PER_QUESTION = 1.2; // 100 questions = 120 minutes, like the real exam
const lengthOptions = [
  { id: "full", count: 100, title: "Full CCNA practice exam", text: "100 questions drawn from the exam pool, with drag-and-drop and CLI labs." },
  { id: "half", count: 50, title: "Half exam", text: "A weighted mix across all six domains. No labs." },
  { id: "quick", count: 20, title: "Quick check", text: "A short weighted mix. No labs." }
].map((option) => ({ ...option, count: Math.min(option.count, total), minutes: Math.round(Math.min(option.count, total) * MINUTES_PER_QUESTION) }));

let settings = { length: "full", feedback: true, timer: true };
let exam = null; // { questions, answers, flagged, checked, order, feedback, timed, limit, startedAt, index, interval }

const views = {
  setup: document.getElementById("view-setup"),
  run: document.getElementById("view-run"),
  results: document.getElementById("view-results")
};

function show(name) {
  Object.entries(views).forEach(([key, element]) => { element.hidden = key !== name; });
  window.scrollTo({ top: 0 });
}

function shuffle(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// Allocates questions to each domain by exam weight (largest remainder), then shuffles the combined set.
// The full exam always includes every lab; shorter exams skip labs.
function pickQuestions(count, withLabs) {
  const labs = withLabs ? shuffle(examQuestions.filter((q) => qType(q) === "lab")) : [];
  const bank = examQuestions.filter((q) => qType(q) !== "lab");
  const target = count - labs.length;
  const pools = modules.map((module) => shuffle(bank.filter((q) => q.domain === module.id)));
  const raw = modules.map((module) => target * module.weightPct / 100);
  const alloc = raw.map((value, i) => Math.min(Math.floor(value), pools[i].length));
  let remaining = target - alloc.reduce((a, b) => a + b, 0);
  const order = raw.map((value, i) => ({ i, frac: value - Math.floor(value) })).sort((a, b) => b.frac - a.frac);
  for (let round = 0; remaining > 0 && round < 5; round += 1) {
    for (const { i } of order) {
      if (remaining > 0 && alloc[i] < pools[i].length) { alloc[i] += 1; remaining -= 1; }
    }
  }
  return shuffle([...labs, ...pools.flatMap((pool, i) => pool.slice(0, alloc[i]))]);
}

function formatTime(seconds) {
  const s = Math.max(0, seconds);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const rest = s % 60;
  const mm = String(m).padStart(2, "0");
  const ss = String(rest).padStart(2, "0");
  return h ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
}

/* ── Setup ── */
function renderSetup() {
  document.getElementById("pool-note").textContent = `The full exam mirrors the real CCNA 200-301: 100 questions in 120 minutes, mixing multiple choice, drag-and-drop matching, and hands-on CLI labs, weighted by domain. The exam-only pool has ${total} questions that never appear on the study page, so every attempt is different.`;
  const list = document.getElementById("length-choices");
  list.replaceChildren();
  lengthOptions.forEach((option) => {
    const label = node("label", "choice");
    const input = node("input");
    input.type = "radio";
    input.name = "length";
    input.value = option.id;
    input.checked = settings.length === option.id;
    input.addEventListener("change", () => { settings.length = option.id; });
    const copy = node("div");
    copy.append(node("strong", "", `${option.title} · ${option.count} questions · ${option.minutes} min`), node("span", "", option.text));
    label.append(input, copy);
    list.append(label);
  });

  const history = document.getElementById("history");
  history.replaceChildren();
  if (!store.exams.length) {
    history.append(node("li", "note", "No attempts yet. Your scores will appear here."));
  }
  store.exams.slice(0, 6).forEach((attempt) => {
    const item = node("li");
    const left = node("div");
    left.append(node("strong", "", `${attempt.total} questions`));
    left.append(node("small", "", `${new Date(attempt.date).toLocaleDateString(undefined, { month: "short", day: "numeric" })} · ${attempt.feedback ? "answers shown" : "answers hidden"} · ${formatTime(attempt.seconds)}`));
    item.append(left, node("span", `score ${attempt.percent >= PASS_TARGET ? "pass" : "fail"}`, `${attempt.percent}%`));
    history.append(item);
  });
}

function updateFeedbackText() {
  const on = document.getElementById("feedback-toggle").checked;
  settings.feedback = on;
  document.getElementById("feedback-label").textContent = on ? "Show answers as I go" : "Hide answers until the end";
  document.getElementById("feedback-help").textContent = on
    ? "After each question, see right or wrong with an explanation."
    : "Behaves like the real exam: change answers freely and see everything at the end.";
}

document.getElementById("feedback-toggle").addEventListener("change", updateFeedbackText);
document.getElementById("timer-toggle").addEventListener("change", (event) => { settings.timer = event.target.checked; });
document.getElementById("start").addEventListener("click", startExam);

/* ── Running ── */
function startExam() {
  const option = lengthOptions.find((item) => item.id === settings.length);
  const questions = pickQuestions(option.count, option.id === "full");
  exam = {
    length: option.id,
    questions,
    answers: {},
    flagged: {},
    checked: {},
    order: {},
    feedback: settings.feedback,
    timed: settings.timer,
    limit: option.minutes * 60,
    startedAt: Date.now(),
    index: 0,
    interval: null
  };
  questions.filter((q) => qType(q) === "dnd").forEach((q) => { exam.order[q.id] = shuffle(q.pairs.map((_, i) => i)); });
  exam.interval = setInterval(tick, 1000);
  show("run");
  tick();
  renderRun();
}

function elapsed() { return Math.floor((Date.now() - exam.startedAt) / 1000); }

function tick() {
  const timer = document.getElementById("run-timer");
  if (!exam.timed) {
    timer.textContent = formatTime(elapsed());
    timer.classList.remove("low");
    return;
  }
  const left = exam.limit - elapsed();
  timer.textContent = `${formatTime(left)} left`;
  timer.classList.toggle("low", left <= 300);
  if (left <= 0) finishExam(true);
}

function isLocked(question) {
  return exam.feedback && Boolean(exam.checked[question.id]);
}

function canAnswer() {
  if (exam.finished) return false;
  if (exam.timed && elapsed() >= exam.limit) {
    finishExam(true);
    return false;
  }
  return true;
}

function answerOf(question) { return exam.answers[question.id] || []; }

function renderChrome() {
  const question = exam.questions[exam.index];
  const locked = isLocked(question);
  document.getElementById("run-position").textContent = `Question ${exam.index + 1} of ${exam.questions.length}`;
  document.getElementById("run-mode").textContent = exam.feedback ? "Answers shown" : "Answers hidden";
  const typeLabel = { mc: "", dnd: " · DRAG AND DROP", lab: " · LAB" }[qType(question)];
  document.getElementById("run-domain").textContent = moduleById(question.domain).title.toUpperCase() + typeLabel;
  document.getElementById("run-status").textContent = locked ? (gradeQuestion(question, answerOf(question)) ? "✓ CORRECT" : "✕ INCORRECT") : "";
  const answeredTotal = exam.questions.filter((q) => isAnswered(q, answerOf(q))).length;
  document.getElementById("run-bar").style.width = `${Math.round(answeredTotal / exam.questions.length * 100)}%`;

  const dots = document.getElementById("run-dots");
  dots.replaceChildren();
  exam.questions.forEach((item, index) => {
    const picks = answerOf(item);
    let cls = "dot";
    if (index === exam.index) cls += " current";
    if (exam.feedback && exam.checked[item.id]) cls += gradeQuestion(item, picks) ? " right" : " wrong";
    else if (isAnswered(item, picks)) cls += " answered";
    if (exam.flagged[item.id]) cls += " flagged";
    const dot = node("button", cls, String(index + 1));
    dot.type = "button";
    dot.setAttribute("aria-label", `Go to question ${index + 1}${isAnswered(item, picks) ? ", answered" : ""}${exam.flagged[item.id] ? ", flagged" : ""}`);
    dot.addEventListener("click", () => { exam.index = index; renderRun(); });
    dots.append(dot);
  });
}

function renderRun() {
  const question = exam.questions[exam.index];
  renderChrome();

  renderAny(document.getElementById("run-question"), question, {
    answer: answerOf(question),
    revealed: isLocked(question),
    checkable: exam.feedback,
    order: exam.order[question.id],
    onSelect: (index) => pick(question, index),
    onChange: (answer) => { if (canAnswer()) { exam.answers[question.id] = answer; renderChrome(); } },
    onCheck: () => { if (canAnswer()) { exam.checked[question.id] = true; renderRun(); } },
    rerender: renderRun
  });

  document.getElementById("run-flag").setAttribute("aria-pressed", String(Boolean(exam.flagged[question.id])));
  document.getElementById("run-prev").disabled = exam.index === 0;
  document.getElementById("run-next").textContent = exam.index === exam.questions.length - 1 ? "Finish exam" : "Next →";
}

function pick(question, index) {
  if (!canAnswer()) return;
  if (isLocked(question)) return;
  const multi = question.answer.length > 1;
  let picks = [...answerOf(question)];
  if (!multi) {
    picks = [index];
    exam.answers[question.id] = picks;
    if (exam.feedback) exam.checked[question.id] = true;
  } else {
    const at = picks.indexOf(index);
    if (at >= 0) picks.splice(at, 1);
    else {
      picks.push(index);
      if (picks.length > question.answer.length) picks.shift();
    }
    exam.answers[question.id] = picks;
  }
  renderRun();
}

document.getElementById("run-prev").addEventListener("click", () => { exam.index -= 1; renderRun(); });
document.getElementById("run-next").addEventListener("click", () => {
  if (exam.index === exam.questions.length - 1) finishExam();
  else { exam.index += 1; renderRun(); }
});
document.getElementById("run-flag").addEventListener("click", () => {
  const id = exam.questions[exam.index].id;
  exam.flagged[id] = !exam.flagged[id];
  renderRun();
});
document.getElementById("finish-top").addEventListener("click", () => finishExam());

/* ── Results ── */
function finishExam(auto = false) {
  if (!exam || exam.finished) return;
  if (!auto) {
    const unanswered = exam.questions.filter((q) => !isAnswered(q, answerOf(q))).length;
    const flagged = exam.questions.filter((q) => exam.flagged[q.id]).length;
    let warning = "";
    if (unanswered) warning += `${unanswered} question${unanswered === 1 ? " is" : "s are"} unanswered. `;
    if (flagged) warning += `${flagged} flagged. `;
    if (warning && !window.confirm(`${warning}Finish the exam anyway?`)) return;
  }

  clearInterval(exam.interval);
  exam.finished = true;
  const seconds = elapsed();
  const results = exam.questions.map((q) => ({ q, picks: answerOf(q), right: gradeQuestion(q, answerOf(q)) }));
  const right = results.filter((r) => r.right).length;
  const percent = Math.round(right / results.length * 100);
  const assessment = makeAssessment(exam, results, seconds);
  const decision = assessmentDecision(assessment);
  store.assessments.unshift(assessment);
  store.assessments = store.assessments.slice(0, 20);
  if (decision.eligible) store.latestAssessment = assessment;

  store.exams.unshift({ date: Date.now(), total: results.length, correct: right, percent, seconds, feedback: exam.feedback });
  store.exams = store.exams.slice(0, 10);
  store.sessions += 1;
  store.answered += results.filter((r) => isAnswered(r.q, r.picks)).length;
  store.correct += right;
  const saved = saveStore(store);

  renderResults(results, right, percent, seconds, auto);
  document.getElementById("assessment-status").textContent = `${decision.reason}${saved ? " Detailed results saved to Skills & career." : " Results could not be saved; the career page will not receive this attempt."}`;
  show("results");
}

function renderResults(results, right, percent, seconds, auto) {
  const ring = document.getElementById("score-ring");
  ring.style.setProperty("--pct", percent);
  ring.style.setProperty("--ring", percent >= PASS_TARGET ? "var(--good)" : percent >= 60 ? "var(--accent)" : "var(--bad)");
  document.getElementById("score-pct").textContent = `${percent}%`;
  document.getElementById("score-title").textContent = auto ? "Time's up" : percent >= PASS_TARGET ? "Great result" : percent >= 60 ? "Getting there" : "Keep studying";
  document.getElementById("score-detail").textContent = `${right} of ${results.length} correct in ${formatTime(seconds)}. A score of ${PASS_TARGET}% or more is a good target.`;

  const rows = document.getElementById("domain-rows");
  rows.replaceChildren();
  modules.forEach((module) => {
    const items = results.filter((r) => r.q.domain === module.id);
    if (!items.length) return;
    const got = items.filter((r) => r.right).length;
    const pct = Math.round(got / items.length * 100);
    const row = node("div", "domain-row");
    const track = node("div", "track");
    const fill = node("span", pct >= PASS_TARGET ? "high" : pct < 60 ? "low" : "");
    fill.style.width = `${pct}%`;
    track.append(fill);
    row.append(node("span", "", module.title), track, node("b", "", `${got}/${items.length}`));
    rows.append(row);
  });

  window.lastResults = results;
  document.getElementById("missed-only").checked = results.some((r) => !r.right);
  renderReview();
}

function renderReview() {
  const missedOnly = document.getElementById("missed-only").checked;
  const list = document.getElementById("review-list");
  list.replaceChildren();
  const items = window.lastResults.map((r, i) => ({ ...r, number: i + 1 })).filter((r) => !missedOnly || !r.right);
  if (!items.length) {
    list.append(node("div", "panel", "Nothing missed. Perfect run."));
    return;
  }
  items.forEach((item) => {
    const panel = node("div", "panel review-item");
    panel.append(node("div", "review-domain", `QUESTION ${item.number} · ${moduleById(item.q.domain).title.toUpperCase()}`));
    const body = node("div");
    panel.append(body);
    renderAny(body, item.q, { answer: item.picks, revealed: true, order: exam.order[item.q.id] });
    list.append(panel);
  });
}

document.getElementById("missed-only").addEventListener("change", renderReview);
document.getElementById("retake").addEventListener("click", () => { renderSetup(); show("setup"); });
window.addEventListener("beforeunload", (event) => {
  if (exam && !views.run.hidden) { event.preventDefault(); event.returnValue = ""; }
});

renderSetup();
updateFeedbackText();
