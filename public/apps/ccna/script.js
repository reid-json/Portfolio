// Legacy copy, unused. The live modules and questions are in data.js.
const legacyModules = [
  {
    id: "network-fundamentals",
    title: "Network Fundamentals",
    weight: "20% of exam",
    duration: "4 lessons · ~2 hrs",
    description: "Get comfortable with how networks are built, how devices communicate, and the models that make it all make sense.",
    lesson: "Networks use layers to break communication into manageable jobs. Ethernet and MAC addresses deliver frames on a local link; IP addresses and routers move packets between networks. A subnet mask separates the network portion of an IPv4 address from its host portion.",
    topics: ["OSI and TCP/IP models", "Ethernet, cabling, and interface errors", "IPv4 addressing and subnetting", "IPv6 address types and notation"]
  },
  {
    id: "network-access",
    title: "Network Access",
    weight: "20% of exam",
    duration: "4 lessons · ~2 hrs",
    description: "Learn how switches connect users to the network, segment traffic, and provide resilient Layer 2 connectivity.",
    lesson: "A VLAN creates its own Layer 2 broadcast domain. Access ports connect end devices to one VLAN, while 802.1Q trunks carry multiple VLANs between network devices. Inter-VLAN communication needs a Layer 3 device, and STP prevents switching loops.",
    topics: ["VLANs, access ports, and trunks", "Inter-VLAN routing", "Spanning Tree Protocol", "EtherChannel and wireless fundamentals"]
  },
  {
    id: "ip-connectivity",
    title: "IP Connectivity",
    weight: "25% of exam",
    duration: "5 lessons · ~3 hrs",
    description: "Understand how routers select paths and configure the routing protocols and services that move packets between networks.",
    lesson: "Routers compare a destination IP against their routing table and choose the most specific matching prefix. Routes can be configured statically or learned dynamically; OSPF shares routes between routers using link-state information.",
    topics: ["Routing tables and longest-prefix match", "Static routes and default routes", "OSPFv2 single-area fundamentals", "First-hop redundancy and gateway behavior"]
  },
  {
    id: "ip-services",
    title: "IP Services",
    weight: "10% of exam",
    duration: "3 lessons · ~1.5 hrs",
    description: "Explore the everyday services that keep a network usable, observable, and secure.",
    lesson: "DHCP assigns host configuration, DNS maps names to addresses, and NTP synchronizes clocks. NAT translates addresses between networks, while syslog and SNMP help operators monitor network devices.",
    topics: ["NAT and PAT", "DHCP, DNS, and NTP", "SNMP, syslog, and QoS concepts", "Secure remote access with SSH"]
  },
  {
    id: "security-fundamentals",
    title: "Security Fundamentals",
    weight: "15% of exam",
    duration: "3 lessons · ~1.5 hrs",
    description: "Build a foundation in device hardening, access control, and the security concepts tested on the CCNA.",
    lesson: "Use defense in depth: harden management access, apply least privilege, and limit traffic with access control lists. ACL entries are evaluated in order, and an implicit deny at the end means permitted traffic must be explicitly matched.",
    topics: ["Threats, vulnerabilities, and mitigation", "Device access control and password security", "ACL purpose and behavior", "Layer 2 security concepts"]
  },
  {
    id: "automation-programmability",
    title: "Automation & Programmability",
    weight: "10% of exam",
    duration: "2 lessons · ~1 hr",
    description: "See how APIs, controllers, and configuration tools are changing the way networks are managed.",
    lesson: "Controller-based networking centralizes parts of the control plane and exposes APIs for automation. REST APIs commonly use HTTP methods to act on resources, and JSON is a widely used format for exchanging structured data.",
    topics: ["Traditional versus controller-based networks", "REST APIs and HTTP verbs", "JSON data structures", "Configuration management with Ansible and Terraform"]
  }
];

const flashcards = [
  { question: "What does a switch learn from an incoming Ethernet frame?", answer: "It learns the source MAC address and associates it with the incoming switch port in its MAC address table." },
  { question: "What is the purpose of a default gateway?", answer: "It is the router interface a host sends packets to when the destination is outside the host's local subnet." },
  { question: "What does the /24 prefix mean in IPv4?", answer: "The first 24 bits identify the network. This is equivalent to the subnet mask 255.255.255.0." },
  { question: "What is the primary purpose of Spanning Tree Protocol?", answer: "STP prevents Layer 2 switching loops by placing redundant paths into a blocking state while keeping them available as backups." }
];

const legacyQuestions = [
  {
    question: "A host has the address 192.168.10.34/27. Which address is its subnet's network address?",
    options: ["192.168.10.0", "192.168.10.32", "192.168.10.34", "192.168.10.64"],
    answer: 1,
    explanation: "A /27 has blocks of 32 addresses. The range 192.168.10.32–63 starts at network address 192.168.10.32."
  },
  {
    question: "Which two pieces of information does a switch use to build its MAC address table?",
    options: ["Destination MAC and outgoing port", "Source MAC and incoming port", "Source IP and incoming port", "Destination IP and VLAN"],
    answer: 1,
    explanation: "A switch records the frame's source MAC address against the port on which that frame arrived."
  },
  {
    question: "A router has two matching routes for a destination. Which route is preferred first?",
    options: ["The route with the longest prefix match", "The route learned most recently", "The route with the lowest next-hop IP", "The route with the largest subnet"],
    answer: 0,
    explanation: "Routers use longest-prefix match: the most specific route (the one with the most matching network bits) wins."
  },
  {
    question: "What is the main purpose of a VLAN on a Layer 2 switch?",
    options: ["Encrypt traffic between switches", "Create separate broadcast domains", "Assign IP addresses to hosts", "Replace the need for routing"],
    answer: 1,
    explanation: "Each VLAN is a separate Layer 2 broadcast domain. Communication between VLANs requires Layer 3 routing."
  },
  {
    question: "Which protocol does an IPv4 host commonly use to automatically obtain an IP address and subnet mask?",
    options: ["DNS", "NTP", "DHCP", "SNMP"],
    answer: 2,
    explanation: "DHCP dynamically provides hosts with addressing details such as an IPv4 address, subnet mask, and default gateway."
  },
  {
    question: "What is the role of the root bridge in Spanning Tree Protocol?",
    options: ["It assigns IP addresses to switches", "It is the reference point for path-cost calculations", "It encrypts trunk links", "It forwards all inter-VLAN traffic"],
    answer: 1,
    explanation: "STP elects one root bridge. Other switches calculate their best path toward it to determine which ports forward or block."
  }
];

// Home-page quick quiz uses the single-answer questions from data.js
const questions = questionBank.filter((q) => q.answer.length === 1).map((q) => ({ ...q, answer: q.answer[0] }));

const storageKey = "packetpath-ccna-progress-v1";
const defaults = { completed: [], sessions: 0, correct: 0, answered: 0, questionIndex: 0, cardIndex: 0 };
let state = loadState();
let selectedModule = modules[0].id;
let cardRevealed = false;
let questionAnswered = false;

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || "null");
    if (!saved || typeof saved !== "object") return { ...defaults };
    return {
      ...defaults,
      ...saved,
      completed: Array.isArray(saved.completed) ? saved.completed.filter((id) => modules.some((module) => module.id === id)) : [],
      sessions: Number.isFinite(saved.sessions) && saved.sessions >= 0 ? saved.sessions : 0,
      correct: Number.isFinite(saved.correct) && saved.correct >= 0 ? saved.correct : 0,
      answered: Number.isFinite(saved.answered) && saved.answered >= 0 ? saved.answered : 0,
      questionIndex: Number.isInteger(saved.questionIndex) ? ((saved.questionIndex % questions.length) + questions.length) % questions.length : 0,
      cardIndex: Number.isInteger(saved.cardIndex) ? ((saved.cardIndex % flashcards.length) + flashcards.length) % flashcards.length : 0
    };
  } catch (error) {
    console.error("Could not load saved study progress.", error);
    return { ...defaults };
  }
}

function saveState() {
  try {
    localStorage.setItem(storageKey, JSON.stringify(state));
  } catch (error) {
    console.error("Could not save study progress.", error);
  }
}

function renderStats() {
  const completed = state.completed.length;
  const percent = Math.round(completed / modules.length * 100);
  document.getElementById("progress-percent").textContent = percent;
  document.getElementById("progress-bar").style.width = `${percent}%`;
  document.getElementById("completed-count").textContent = `${completed} of ${modules.length} modules complete`;
  document.getElementById("session-count").textContent = state.sessions;
  const accuracy = state.answered ? Math.round(state.correct / state.answered * 100) : null;
  document.getElementById("quiz-accuracy").textContent = accuracy === null ? "—" : accuracy;
  document.getElementById("accuracy-unit").textContent = accuracy === null ? "" : "%";
  document.getElementById("quiz-stat-description").textContent = accuracy === null ? "Answer a question to begin" : "Correct answers";
  document.getElementById("quiz-answer-count").textContent = state.answered ? `${state.correct} correct of ${state.answered} answered` : "Your practice, at a glance";
}

function renderModules(filter = "") {
  const list = document.getElementById("module-list");
  const matching = modules.filter((module) => `${module.title} ${module.description} ${module.topics.join(" ")}`.toLowerCase().includes(filter.toLowerCase()));
  if (matching.length && !matching.some((module) => module.id === selectedModule)) selectedModule = matching[0].id;
  list.replaceChildren();
  if (!matching.length) {
    list.innerHTML = '<div class="no-results">No topics match that search. Try a different keyword.</div>';
    document.getElementById("module-detail").innerHTML = '<div class="detail-kicker">NO MATCHES</div><h3 class="detail-title">Keep exploring</h3><p class="detail-description">Try a topic like subnetting, VLANs, routing, or security.</p>';
    return;
  }

  for (const [index, module] of modules.entries()) {
    if (!matching.includes(module)) continue;
    const button = document.createElement("button");
    button.type = "button";
    button.className = `module-row${module.id === selectedModule ? " selected" : ""}${state.completed.includes(module.id) ? " completed" : ""}`;
    button.setAttribute("aria-pressed", module.id === selectedModule ? "true" : "false");
    button.innerHTML = `<span class="module-number">${String(index + 1).padStart(2, "0")}</span><span class="module-copy"><strong>${module.title}</strong><span>${module.topics.slice(0, 2).join(" · ")}</span></span><span class="module-weight">${module.weight}</span><span class="module-completion" aria-label="${state.completed.includes(module.id) ? "Completed" : "Not completed"}">✓</span>`;
    button.addEventListener("click", () => {
      selectedModule = module.id;
      renderModules(document.getElementById("module-search").value);
    });
    list.append(button);
  }
  renderModuleDetail();
}

function renderModuleDetail() {
  const module = modules.find((item) => item.id === selectedModule) || modules[0];
  const detail = document.getElementById("module-detail");
  const isCompleted = state.completed.includes(module.id);
  detail.innerHTML = `
    <div class="detail-kicker">MODULE ${String(modules.indexOf(module) + 1).padStart(2, "0")} <span>·</span> ${module.weight.toUpperCase()}</div>
    <h3 class="detail-title">${module.title}</h3>
    <p class="detail-description">${module.description}</p>
    <div class="detail-meta"><span><span class="meta-icon">◷</span> ${module.duration}</span><span><span class="meta-icon">▤</span> ${module.topics.length} key topics</span></div>
    <h4 class="detail-subtitle">THE BIG IDEA</h4>
    <p class="core-idea">${module.lesson}</p>
    <h4 class="detail-subtitle">WHAT YOU'LL LEARN</h4>
    <ul class="topic-list">${module.topics.map((topic) => `<li>${topic}</li>`).join("")}</ul>
    <div class="detail-actions">
      <button class="detail-button${isCompleted ? " completed-button" : ""}" id="complete-module" type="button">${isCompleted ? "✓ Completed" : "Mark as complete"} <span>${isCompleted ? "" : "→"}</span></button>
      <a class="detail-link" href="study.html#${module.id}">Study this domain →</a>
      <button class="detail-link" id="study-module" type="button">Practice with flashcards</button>
    </div>`;

  document.getElementById("complete-module").addEventListener("click", () => {
    if (state.completed.includes(module.id)) {
      state.completed = state.completed.filter((id) => id !== module.id);
    } else {
      state.completed.push(module.id);
      state.sessions += 1;
    }
    saveState();
    renderStats();
    renderModules(document.getElementById("module-search").value);
  });
  document.getElementById("study-module").addEventListener("click", () => {
    document.getElementById("practice").scrollIntoView({ behavior: "smooth" });
    document.getElementById("flashcard").focus({ preventScroll: true });
  });
}

function renderFlashcard() {
  const index = state.cardIndex;
  const card = flashcards[index];
  document.getElementById("card-count").textContent = `${String(index + 1).padStart(2, "0")} / ${String(flashcards.length).padStart(2, "0")}`;
  document.getElementById("flashcard-prompt").textContent = card.question;
  const answer = document.getElementById("flashcard-answer");
  answer.textContent = card.answer;
  answer.hidden = !cardRevealed;
  document.getElementById("flip-hint").hidden = cardRevealed;
  const dots = document.getElementById("card-dots");
  dots.replaceChildren();
  flashcards.forEach((_, dotIndex) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = `card-dot${dotIndex === index ? " active" : ""}`;
    dot.setAttribute("aria-label", `Show flashcard ${dotIndex + 1}`);
    dot.setAttribute("aria-current", dotIndex === index ? "true" : "false");
    dot.addEventListener("click", () => setCard(dotIndex));
    dots.append(dot);
  });
  document.getElementById("prev-card").disabled = index === 0;
  document.getElementById("next-card").disabled = index === flashcards.length - 1;
}

function setCard(index) {
  state.cardIndex = index;
  cardRevealed = false;
  saveState();
  renderFlashcard();
}

function renderQuestion() {
  questionAnswered = false;
  const question = questions[state.questionIndex];
  const content = document.getElementById("quiz-content");
  content.replaceChildren();
  const heading = document.createElement("h3");
  heading.className = "quiz-question";
  heading.textContent = question.question;
  const options = document.createElement("div");
  options.className = "quiz-options";
  question.options.forEach((option, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "quiz-option";
    button.innerHTML = `<span class="option-letter">${String.fromCharCode(65 + index)}.</span><span></span>`;
    button.querySelector("span:last-child").textContent = option;
    button.addEventListener("click", () => answerQuestion(index, options, feedback, nextButton));
    options.append(button);
  });
  const feedback = document.createElement("div");
  feedback.className = "quiz-feedback";
  feedback.setAttribute("aria-live", "polite");
  const nextButton = document.createElement("button");
  nextButton.type = "button";
  nextButton.className = "quiz-next";
  nextButton.textContent = "Next question →";
  nextButton.hidden = true;
  nextButton.addEventListener("click", () => {
    state.questionIndex = (state.questionIndex + 1) % questions.length;
    saveState();
    renderQuestion();
  });
  content.append(heading, options, feedback, nextButton);
}

function answerQuestion(selected, options, feedback, nextButton) {
  if (questionAnswered) return;
  questionAnswered = true;
  const question = questions[state.questionIndex];
  state.answered += 1;
  if (selected === question.answer) state.correct += 1;
  options.querySelectorAll(".quiz-option").forEach((button, index) => {
    button.disabled = true;
    if (index === question.answer) button.classList.add("correct");
    else if (index === selected) button.classList.add("incorrect");
  });
  const correct = selected === question.answer;
  feedback.className = `quiz-feedback ${correct ? "is-correct" : "is-incorrect"}`;
  feedback.textContent = `${correct ? "Correct! " : "Not quite. "}${question.explanation}`;
  nextButton.hidden = false;
  saveState();
  renderStats();
}

document.getElementById("module-search").addEventListener("input", (event) => renderModules(event.target.value.trim()));
document.getElementById("flashcard").addEventListener("click", () => {
  cardRevealed = !cardRevealed;
  renderFlashcard();
});
document.getElementById("prev-card").addEventListener("click", () => {
  if (state.cardIndex > 0) setCard(state.cardIndex - 1);
});
document.getElementById("next-card").addEventListener("click", () => {
  if (state.cardIndex < flashcards.length - 1) setCard(state.cardIndex + 1);
});
document.getElementById("reset-progress").addEventListener("click", () => {
  if (!window.confirm("Reset your saved progress, study sessions, domain study answers, exam history, and quiz stats?")) return;
  state = { ...defaults, completed: [] };
  cardRevealed = false;
  saveState();
  renderStats();
  renderModules(document.getElementById("module-search").value);
  renderFlashcard();
  renderQuestion();
});
document.getElementById("today-label").textContent = new Intl.DateTimeFormat(undefined, { weekday: "short", month: "short", day: "numeric" }).format(new Date());

document.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", () => {
    document.querySelectorAll(".nav-link").forEach((item) => item.classList.remove("active"));
    link.classList.add("active");
  });
});
document.addEventListener("keydown", (event) => {
  if (event.key === "/" && document.activeElement.tagName !== "INPUT" && document.activeElement.tagName !== "TEXTAREA") {
    event.preventDefault();
    document.getElementById("module-search").focus();
  }
  if (event.key === "Escape" && document.activeElement.id === "module-search") {
    document.getElementById("module-search").value = "";
    renderModules();
    document.getElementById("module-search").blur();
  }
});

renderStats();
renderModules();
renderFlashcard();
renderQuestion();
