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
function renderLesson(container, question, revealed = false) {
  container.replaceChildren();
  const lesson = question.lesson;
  const domain = moduleById(question.domain);
  container.append(node("div", "kicker", `${revealed ? "LESSON UNLOCKED" : "THINK IT THROUGH"} · ${domain.title.toUpperCase()}`));
  if (!revealed) {
    container.append(node("h2", "lesson-title", "Build your reasoning"));
    container.append(node("p", "", "No answer spoilers here. Use these prompts, jot down your reasoning below, then commit to an answer. The full lesson unlocks after your attempt."));
    const prompts = node("ol", "lesson-points");
    reasoningPrompts(question).forEach((prompt) => prompts.append(node("li", "", prompt)));
    container.append(prompts);
    const hint = node("details", "guided-hint");
    hint.append(node("summary", "", "Need another nudge?"));
    hint.append(node("p", "", "Compare each option against your rule, not against the other options. Which assumption would have to be true for each one to work? Eliminate choices you can disprove."));
    container.append(hint);
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
}

function reasoningPrompts(question) {
  const prompts = {
    "network-fundamentals": "Trace the traffic from source to destination. At which layer does the decision happen, and what information is available there?",
    "network-access": "Sketch the switches, links, and endpoints. What scope or boundary is involved, and what changes as traffic crosses it?",
    "ip-connectivity": "Write down the destination, available paths, and next-hop information. Which selection rule applies first, and which rules only break ties?",
    "ip-services": "Identify the client, server, or device roles. What must happen before the requested service can work, and how would you verify it?",
    "security-fundamentals": "Name the asset, the threat, and the point where a control is enforced. What should be permitted, and what should be blocked?",
    "automation-programmability": "Identify the input, desired state, and output. Who sends the request, who processes it, and how could you check the result?"
  };
  let method = prompts[question.domain] || "Identify the relevant rule and test it against the scenario.";
  if (/subnet|prefix|\/\d{1,3}|broadcast|usable host/i.test(question.question)) {
    method = "Write the address and prefix on paper. Find the network boundaries, then check whether the question asks for a range, a host, or a route match.";
  } else if (/command|configure|configuration|syntax/i.test(question.question)) {
    method = "Identify the intended change and the configuration context. What scope should the command affect, and how would you verify the result?";
  } else if (/\bSTP\b|spanning.tree|root bridge/i.test(question.question)) {
    method = "Sketch the links and compare the candidate devices and paths. Which tie-breaker applies at each step, and which path would remain if a link failed?";
  } else if (/\bVLAN\b|trunk|802\.1Q/i.test(question.question)) {
    method = "Label each link and its traffic membership. What happens to a frame's identity when it enters, crosses, and leaves each link?";
  } else if (/\bTCP\b|\bUDP\b|transport/i.test(question.question)) {
    method = "List the application's delivery requirements. Does it need ordering, acknowledgments, or low overhead, and what trade-offs would follow?";
  } else if (/\bOSPF\b|routing table|administrative distance/i.test(question.question)) {
    method = "Separate route learning from route selection. What information builds the candidate paths, and what criteria decide the installed or forwarded path?";
  } else if (/\bACL\b|access.list|wildcard/i.test(question.question)) {
    method = "Write down source, destination, protocol, and direction. Walk through the rules in order and ask where the traffic would first match.";
  } else if (/\bJSON\b|\bREST\b|\bHTTP\b|\bAPI\b/i.test(question.question)) {
    method = "Separate the data format from the operation. What is being represented or requested, and how would you distinguish a valid request from its response?";
  }
  return [
    "Restate the question in your own words. Which details constrain the answer, and what exactly must you choose?",
    method,
    "Predict the result before comparing the options. Can you explain why your choice fits and why at least one alternative does not?"
  ];
}
