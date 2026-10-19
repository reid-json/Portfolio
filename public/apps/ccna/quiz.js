// Shared helpers used by the study and exam pages.
const STORE_KEY = "packetpath-ccna-progress-v1";
const OPTION_LETTERS = "ABCDEFGH";
let progressLoadFailed = false;

function loadStore() {
  let saved = null;
  try {
    saved = JSON.parse(localStorage.getItem(STORE_KEY) || "null");
    if (saved !== null && (typeof saved !== "object" || Array.isArray(saved))) throw new Error("Invalid saved progress structure.");
  } catch (error) {
    progressLoadFailed = true;
    saved = null;
    console.error("Could not load saved progress or assessment evidence.", error);
    const notice = node("p", "q-feedback is-incorrect", "Saved progress and assessment evidence could not be loaded. Check browser storage before starting another attempt.");
    notice.setAttribute("role", "alert");
    document.querySelector("main").prepend(notice);
  }
  const base = { completed: [], sessions: 0, correct: 0, answered: 0, questionIndex: 0, cardIndex: 0 };
  const store = { ...base, ...(saved && typeof saved === "object" ? saved : {}) };
  if (!store.study || typeof store.study !== "object") store.study = {};
  if (!Array.isArray(store.exams)) store.exams = [];
  if (!Array.isArray(store.assessments)) store.assessments = [];
  return store;
}

function saveStore(store) {
  if (progressLoadFailed) return false;
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(store));
    document.getElementById("progress-error")?.remove();
    return true;
  } catch (error) {
    console.error("Could not save progress.", error);
    let notice = document.getElementById("progress-error");
    if (!notice) {
      notice = node("p", "q-feedback is-incorrect");
      notice.id = "progress-error";
      notice.setAttribute("role", "alert");
      document.querySelector("main").prepend(notice);
    }
    notice.textContent = "Progress and assessment evidence could not be saved. Browser storage may be full or unavailable. Keep this page open to review your results.";
    return false;
  }
}

function isCorrect(question, selected) {
  const a = [...question.answer].sort((x, y) => x - y);
  const s = [...selected].sort((x, y) => x - y);
  return a.length === s.length && a.every((value, i) => value === s[i]);
}

function moduleById(id) {
  return modules.find((module) => module.id === id);
}

function node(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}

// Draws a question into `container`.
//   selected   – indexes the user has picked
//   revealed   – show right/wrong marks and the explanation
//   checkable  – multi-answer questions get a "Check answer" button
//   onSelect(i), onCheck()
function renderQuestionCard(container, question, { selected = [], revealed = false, checkable = false, onSelect, onCheck }) {
  container.replaceChildren();
  const multi = question.answer.length > 1;

  container.append(node("h3", "q-text", question.question));
  if (multi) container.append(node("p", "q-hint", `Choose ${question.answer.length}.`));

  const list = node("div", "q-options");
  list.setAttribute("role", multi ? "group" : "radiogroup");
  list.setAttribute("aria-label", "Answer options");
  question.options.forEach((text, index) => {
    const picked = selected.includes(index);
    const correct = question.answer.includes(index);
    const button = node("button", "q-option");
    button.type = "button";
    button.append(node("span", "q-letter", OPTION_LETTERS[index]), node("span", "q-label", text));
    button.setAttribute("aria-pressed", String(picked));
    if (!revealed && picked) button.classList.add("selected");
    if (revealed) {
      button.disabled = true;
      if (correct) button.classList.add("correct");
      else if (picked) button.classList.add("incorrect");
      if (correct && !picked) button.classList.add("missed");
      const mark = node("span", "q-mark", correct ? "✓" : picked ? "✕" : "");
      mark.setAttribute("aria-hidden", "true");
      button.append(mark);
    }
    button.addEventListener("click", () => onSelect && onSelect(index));
    list.append(button);
  });
  container.append(list);

  if (!revealed && multi && checkable) {
    const check = node("button", "btn primary q-check", "Check answer");
    check.type = "button";
    check.disabled = selected.length !== question.answer.length;
    check.addEventListener("click", () => onCheck && onCheck());
    container.append(check);
  }

  if (revealed) {
    const right = isCorrect(question, selected);
    const feedback = node("div", `q-feedback ${right ? "is-correct" : "is-incorrect"}`);
    feedback.setAttribute("role", "status");
    feedback.append(node("strong", "", right ? "Correct" : selected.length ? "Not quite" : "Not answered"));
    feedback.append(node("p", "", question.explanation));
    if (!right) {
      const letters = question.answer.map((i) => OPTION_LETTERS[i]).join(" and ");
      feedback.append(node("p", "q-answer", `Correct answer: ${letters}`));
    }
    container.append(feedback);
  }
}

// Draws the "quick learn" panel for a question.
function renderLesson(container, question, revealed = false) {
  container.replaceChildren();
  container.dataset.questionId = question.id;
  const lesson = question.lesson;
  const domain = moduleById(question.domain);
  container.append(node("div", "kicker", `${revealed ? "LESSON UNLOCKED" : "THINK IT THROUGH"} · ${domain.title.toUpperCase()}`));
  if (!revealed) {
    const guide = questionGuidance(question);
    container.append(node("h2", "lesson-title", "Quick learn: this question"));
    container.append(node("p", "guidance-focus", guide.focus));
    container.append(node("p", "", "Use the details of this question, not a memorized answer. The lesson and explanation stay hidden until you submit."));
    const prompts = node("ol", "lesson-points");
    guide.prompts.forEach((prompt) => prompts.append(node("li", "", prompt)));
    container.append(prompts);
    const hint = node("details", "guided-hint");
    hint.append(node("summary", "", "Need another nudge?"));
    hint.append(node("p", "", guide.hint));
    container.append(hint);
    renderQuestionEvidence(container, guide.sources, false, guide.referenceScope);
    const notes = node("a", "btn small", "Capture your reasoning in a note");
    notes.href = "#notebook";
    container.append(notes);
    return;
  }
  container.append(node("h2", "lesson-title", lesson.title));
  const points = node("ul", "lesson-points");
  lesson.points.forEach((point) => points.append(node("li", "", point)));
  container.append(points);
  if (lesson.code) {
    const pre = node("pre", "lesson-code");
    pre.append(node("code", "", lesson.code));
    container.append(pre);
  }

  if (lesson.tip) {
    const tip = node("p", "lesson-tip");
    tip.append(node("strong", "", "Tip · "), document.createTextNode(lesson.tip));
    container.append(tip);
  }
  const guide = questionGuidance(question);
  renderQuestionEvidence(container, guide.sources, true, guide.referenceScope);
}

function renderQuestionEvidence(container, ids, revealed, scope) {
  const evidence = node("details", "guided-hint question-evidence");
  evidence.open = revealed;
  evidence.append(node("summary", "", revealed ? "Check the underlying documentation" : "Optional evidence and documentation - may reveal clues"));
  evidence.append(node("p", "note", "These primary sources support the underlying concepts, not a Cisco endorsement or an independently audited answer key. The prompts and questions are written by PacketPath. Opening a reference may reveal the answer; leave this closed for an unaided attempt."));
  evidence.append(node("p", "note", scope));
  renderReferences(evidence, ids);
  const library = node("a", "btn small", "Browse the documentation library");
  library.href = "library.html";
  evidence.append(library);
  container.append(evidence);
}
