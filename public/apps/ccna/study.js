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
  document.getElementById("reward-message").textContent = "";
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
  document.getElementById("reward-message").textContent = "";
  saveStore(store);
  render();
}

function commit(question, selected) {
  const state = domainState(domainId);
  if (state.answers[question.id]) return;
  const correct = isCorrect(question, selected);
  state.answers[question.id] = { selected, correct };
  const before = learning.snapshot();
  const xp = learning.award(question, correct);
  const after = learning.snapshot();
  const milestones = [];
  if (after.level > before.level) milestones.push(`Level ${after.level} unlocked!`);
  if (before.today < 10 && after.today >= 10) milestones.push("Daily quest complete!");
  const topicQuestions = domainQuestions(domainId).filter((q) => topicOf(q) === topicOf(question));
  if (xp && topicQuestions.every((q) => state.answers[q.id])) milestones.push("Topic complete! Pick a new topic or review your notes.");
  document.getElementById("reward-message").textContent = xp
    ? `+${xp} XP! ${correct ? "Connection made." : "Every missed packet teaches you something. Read the explanation and reflect."} ${milestones.join(" ")}`
    : "Reviewed! This question already earned its XP. Keep going with a new question.";
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
  renderLesson(document.getElementById("lesson"), question, Boolean(record));
  learning.renderJourney(studyBank);
  renderNotebook(question);
  document.getElementById("review-missed").disabled = !questions.some((q) => state.answers[q.id]?.correct === false);
  document.getElementById("continue-quest").disabled = answeredCount(domainId) === questions.length;

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
  const completed = current.indexes.filter((index) => state.answers[questions[index].id]).length;
  const mission = document.getElementById("topic-mission");
  mission.replaceChildren(node("strong", "", `Topic quest ${topics.indexOf(current) + 1}/${topics.length}: ${current.name}`));
  mission.append(node("span", "", `${completed}/${current.indexes.length} explored${completed === current.indexes.length ? " - complete!" : " - answer, reflect, and keep moving"}`));
  const progress = node("progress");
  progress.max = current.indexes.length;
  progress.value = completed;
  progress.setAttribute("aria-label", "Current topic progress");
  mission.append(progress);
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
  if (!window.confirm("Clear your answers for this domain and start it again? Your notes and lifetime XP will be kept.")) return;
  store.study[domainId] = { index: 0, answers: {} };
  domainQuestions(domainId).forEach((question) => delete pending[question.id]);
  saveStore(store);
  render();
});

document.addEventListener("keydown", (event) => {
  if (event.metaKey || event.ctrlKey || event.altKey) return;
  if (event.target.closest("input, textarea, select, button, a, summary, [contenteditable]")) return;
  const question = domainQuestions(domainId)[domainState(domainId).index];
  if (event.key === "ArrowRight") goTo(domainState(domainId).index + 1);
  else if (event.key === "ArrowLeft") goTo(domainState(domainId).index - 1);
  else if (/^[1-8]$/.test(event.key) && Number(event.key) <= question.options.length) onSelect(question, Number(event.key) - 1);
});

window.addEventListener("hashchange", () => {
  const id = hashDomain();
  if (id && id !== domainId) setDomain(id);
});

function renderNotebook(question) {
  const topic = topicOf(question);
  const textarea = document.getElementById("topic-note");
  const key = JSON.stringify([question.domain, topic]);
  if (textarea.dataset.topic !== key) {
    textarea.value = learning.getNote(question.domain, topic);
    textarea.dataset.topic = key;
    document.getElementById("note-status").textContent = "Notes autosave as you type.";
  }
  document.getElementById("note-label").textContent = `${moduleById(question.domain).short} / ${topic}`;
  renderSavedNotes();
}

function saveCurrentNote() {
  const question = domainQuestions(domainId)[domainState(domainId).index];
  const saved = learning.saveNote(domainId, topicOf(question), document.getElementById("topic-note").value);
  document.getElementById("note-status").textContent = saved ? "Saved in this browser." : "Not saved. Export your notes before leaving.";
  renderSavedNotes();
}

function renderSavedNotes() {
  const all = learning.notes();
  const query = document.getElementById("note-search").value.trim().toLowerCase();
  const list = document.getElementById("saved-notes");
  list.replaceChildren();
  document.getElementById("notebook-count").textContent = `Browse your notes (${all.length} topics)`;
  all.filter((note) => `${note.topic} ${note.text} ${note.domain}`.toLowerCase().includes(query)).forEach((note) => {
    const item = node("li");
    const button = node("button", "btn", `${moduleById(note.domain)?.short || note.domain} / ${note.topic}`);
    button.type = "button";
    button.append(node("small", "", note.text.slice(0, 120)));
    button.addEventListener("click", () => {
      const index = domainQuestions(note.domain).findIndex((q) => topicOf(q) === note.topic);
      if (index < 0) {
        document.getElementById("note-status").textContent = "This topic is no longer available. Export your notebook to read its notes.";
        return;
      }
      setDomain(note.domain);
      goTo(index);
      document.getElementById("topic-note").focus();
    });
    item.append(button);
    list.append(item);
  });
  if (!list.children.length) list.append(node("li", "", all.length ? "No matching notes." : "Your saved notes will appear here."));
}

document.getElementById("topic-note").addEventListener("input", saveCurrentNote);
document.getElementById("note-search").addEventListener("input", renderSavedNotes);
document.getElementById("add-reflection").addEventListener("click", () => {
  const question = domainQuestions(domainId)[domainState(domainId).index];
  const textarea = document.getElementById("topic-note");
  textarea.value += `${textarea.value ? "\n\n" : ""}Question: ${question.question}\nMy reasoning:\nWhat I learned:\nWhat I will check next:\n`;
  saveCurrentNote();
  textarea.focus();
  textarea.setSelectionRange(textarea.value.length, textarea.value.length);
});
document.getElementById("export-notes").addEventListener("click", () => {
  const url = URL.createObjectURL(new Blob([learning.exportNotes()], { type: "text/markdown;charset=utf-8" }));
  const link = node("a");
  link.href = url;
  link.download = "packetpath-notes.md";
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
});
function findNext(matches) {
  const questions = domainQuestions(domainId);
  const state = domainState(domainId);
  for (let offset = 1; offset <= questions.length; offset += 1) {
    const index = (state.index + offset) % questions.length;
    if (matches(state.answers[questions[index].id])) { goTo(index); return; }
  }
}
document.getElementById("continue-quest").addEventListener("click", () => findNext((record) => !record));
document.getElementById("review-missed").addEventListener("click", () => findNext((record) => record?.correct === false));

setDomain(domainId);
