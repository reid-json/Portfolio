// Shared helpers used by the study and exam pages.
const STORE_KEY = "packetpath-ccna-progress-v1";
const OPTION_LETTERS = "ABCDEFGH";

function loadStore() {
  let saved = null;
  try { saved = JSON.parse(localStorage.getItem(STORE_KEY) || "null"); } catch (error) { saved = null; }
  const base = { completed: [], sessions: 0, correct: 0, answered: 0, questionIndex: 0, cardIndex: 0 };
  const store = { ...base, ...(saved && typeof saved === "object" ? saved : {}) };
  if (!store.study || typeof store.study !== "object") store.study = {};
  if (!Array.isArray(store.exams)) store.exams = [];
  return store;
}

function saveStore(store) {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(store)); } catch (error) { console.error("Could not save progress.", error); }
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
function renderLesson(container, question) {
  container.replaceChildren();
  const lesson = question.lesson;
  const domain = moduleById(question.domain);
  container.append(node("div", "kicker", `QUICK LEARN · ${domain.title.toUpperCase()}`));
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
}
