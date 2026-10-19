const store = loadStore();
const pending = {}; // multi-answer picks that have not been checked yet

function hashDomain() {
  const id = location.hash.replace("#", "");
  return moduleById(id) ? id : null;
}

let domainId = hashDomain() || store.lastDomain || modules[0].id;
if (!moduleById(domainId)) domainId = modules[0].id;

function domainQuestions(id) {
  return studyBank.filter((question) => question.domain === id);
}

function topicOf(question) {
  return question.topic || question.lesson.title;
}

// Topics in order of first appearance, each with the index of its first question in the domain.
function domainTopics(id) {
  const topics = [];
  domainQuestions(id).forEach((question, index) => {
    const name = topicOf(question);
    let topic = topics.find((item) => item.name === name);
    if (!topic) { topic = { name, start: index, indexes: [] }; topics.push(topic); }
    topic.indexes.push(index);
  });
  return topics;
}

function domainState(id) {
  if (!store.study[id]) store.study[id] = { index: 0, answers: {} };
  const state = store.study[id];
  const total = domainQuestions(id).length;
  state.index = Math.min(Math.max(Number(state.index) || 0, 0), total - 1);
  return state;
}

function answeredCount(id) {
  const state = domainState(id);
  return domainQuestions(id).filter((question) => state.answers[question.id]).length;
}

function setDomain(id) {
  domainId = id;
  store.lastDomain = id;
  saveStore(store);
  history.replaceState(null, "", `#${id}`);
  render();
}

function goTo(index) {
  const state = domainState(domainId);
  const total = domainQuestions(domainId).length;
  if (index < 0 || index >= total) return;
  state.index = index;
  saveStore(store);
  render();
}

function commit(question, selected) {
  const state = domainState(domainId);
  if (state.answers[question.id]) return;
  const correct = isCorrect(question, selected);
  state.answers[question.id] = { selected, correct };
  store.answered += 1;
  if (correct) store.correct += 1;
  delete pending[question.id];
  saveStore(store);
  render();
}

function onSelect(question, index) {
  const state = domainState(domainId);
  if (state.answers[question.id]) return;
  if (question.answer.length === 1) {
    commit(question, [index]);
    return;
  }
  const picks = pending[question.id] || [];
  const at = picks.indexOf(index);
  if (at >= 0) picks.splice(at, 1);
  else {
    picks.push(index);
    if (picks.length > question.answer.length) picks.shift();
  }
  pending[question.id] = picks;
  render();
}

function renderTabs() {
  const tabs = document.getElementById("domain-tabs");
  tabs.replaceChildren();
  modules.forEach((module) => {
    const total = domainQuestions(module.id).length;
    const done = answeredCount(module.id);
    const tab = node("button", `domain-tab${done === total ? " done" : ""}`);
    tab.type = "button";
    tab.setAttribute("role", "tab");
    tab.setAttribute("aria-selected", String(module.id === domainId));
    tab.append(node("strong", "", module.short));
    tab.append(node("span", "tab-meta", `${done}/${total} answered`));
    const bar = node("div", "tab-bar");
    const fill = node("span");
    fill.style.width = `${Math.round(done / total * 100)}%`;
    bar.append(fill);
    tab.append(bar);
    tab.addEventListener("click", () => setDomain(module.id));
    tabs.append(tab);
  });
}

function renderSummary() {
  const box = document.getElementById("domain-summary");
  const questions = domainQuestions(domainId);
  const state = domainState(domainId);
  if (answeredCount(domainId) !== questions.length) {
    box.hidden = true;
    return;
  }
  const right = questions.filter((question) => state.answers[question.id].correct).length;
  const percent = Math.round(right / questions.length * 100);
  const module = moduleById(domainId);
  box.replaceChildren();
  const copy = node("div");
  copy.append(node("strong", "", `${module.title} complete: ${right} of ${questions.length} correct (${percent}%)`));
  copy.append(node("p", "", percent >= 80 ? "Strong work. Try the full practice exam when you are ready." : "Review any questions you missed, then reset the domain and try again."));
  box.append(copy);
  const actions = node("div");
  const exam = node("a", "btn primary", "Take a practice exam");
  exam.href = "exam.html";
  actions.append(exam);
  box.append(actions);
  box.hidden = false;
}

function render() {
  const questions = domainQuestions(domainId);
  const state = domainState(domainId);
  const question = questions[state.index];
  const record = state.answers[question.id];

  renderTabs();
  renderSummary();
  renderLesson(document.getElementById("lesson"), question);

  document.getElementById("q-position").textContent = `QUESTION ${state.index + 1} OF ${questions.length}`;
  document.getElementById("q-status").textContent = record ? (record.correct ? "✓ CORRECT" : "✕ INCORRECT") : "";
  renderQuestionCard(document.getElementById("question"), question, {
    selected: record ? record.selected : pending[question.id] || [],
    revealed: Boolean(record),
    checkable: true,
    onSelect: (index) => onSelect(question, index),
    onCheck: () => commit(question, pending[question.id] || [])
  });

  const topics = domainTopics(domainId);
  const current = topics.find((topic) => topic.indexes.includes(state.index));
  const select = document.getElementById("topic-select");
  select.replaceChildren();
  topics.forEach((topic) => {
    const done = topic.indexes.filter((i) => state.answers[questions[i].id]).length;
    const option = node("option", "", `${topic.name} (${done}/${topic.indexes.length})`);
    option.value = String(topic.start);
    option.selected = topic === current;
    select.append(option);
  });

  const dots = document.getElementById("dots");
  dots.replaceChildren();
  current.indexes.forEach((index) => {
    const item = questions[index];
    const answer = state.answers[item.id];
    const dot = node("button", `dot${index === state.index ? " current" : ""}${answer ? (answer.correct ? " right" : " wrong") : ""}`, String(index - current.start + 1));
    dot.type = "button";
    dot.setAttribute("aria-label", `Question ${index - current.start + 1} of this topic${answer ? (answer.correct ? ", correct" : ", incorrect") : ""}`);
    dot.addEventListener("click", () => goTo(index));
    dots.append(dot);
  });

  document.getElementById("prev").disabled = state.index === 0;
  const next = document.getElementById("next");
  next.disabled = state.index === questions.length - 1;
  next.classList.toggle("primary", Boolean(record));
}

document.getElementById("prev").addEventListener("click", () => goTo(domainState(domainId).index - 1));
document.getElementById("topic-select").addEventListener("change", (event) => goTo(Number(event.target.value)));
document.getElementById("next").addEventListener("click", () => goTo(domainState(domainId).index + 1));
document.getElementById("reset-domain").addEventListener("click", () => {
  if (!window.confirm("Clear your answers for this domain and start it again?")) return;
  store.study[domainId] = { index: 0, answers: {} };
  domainQuestions(domainId).forEach((question) => delete pending[question.id]);
  saveStore(store);
  render();
});

document.addEventListener("keydown", (event) => {
  if (event.metaKey || event.ctrlKey || event.altKey) return;
  const question = domainQuestions(domainId)[domainState(domainId).index];
  if (event.key === "ArrowRight") goTo(domainState(domainId).index + 1);
  else if (event.key === "ArrowLeft") goTo(domainState(domainId).index - 1);
  else if (/^[1-8]$/.test(event.key) && Number(event.key) <= question.options.length) onSelect(question, Number(event.key) - 1);
});

window.addEventListener("hashchange", () => {
  const id = hashDomain();
  if (id && id !== domainId) setDomain(id);
});

setDomain(domainId);
