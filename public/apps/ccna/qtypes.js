// Question types beyond multiple choice: drag-and-drop matching and a small simulated Cisco CLI for labs.
// Answers are always stored as arrays:
//   mc  -> selected option indexes
//   dnd -> slots[targetIndex] = pair index placed there (or null)
//   lab -> list of commands typed

function qType(q) { return q.type || "mc"; }

function isAnswered(q, a) {
  a = a || [];
  if (qType(q) === "dnd") return a.some((v) => v !== null && v !== undefined);
  return a.length > 0;
}

function gradeQuestion(q, a) {
  a = a || [];
  const type = qType(q);
  if (type === "dnd") return q.pairs.every((_, t) => a[t] === t);
  if (type === "lab") return labResults(q, a).every(Boolean);
  return isCorrect(q, a);
}

/* ── Simulated IOS device ── */
const IOS_VOCAB = ["configure", "terminal", "enable", "disable", "exit", "end", "interface", "vlan", "name", "switchport", "mode", "access", "trunk", "ip", "address", "route", "default-gateway", "domain-name", "ssh", "version", "shutdown", "no", "description", "hostname", "secret", "password", "login", "local", "transport", "input", "line", "vty", "console", "username", "crypto", "key", "generate", "rsa", "modulus", "show", "running-config", "startup-config", "brief", "write", "memory", "copy", "service", "password-encryption", "router", "ospf", "network", "area", "router-id", "passive-interface", "duplex", "speed", "encapsulation", "dot1q", "native", "allowed", "spanning-tree", "portfast", "access-list", "permit", "deny", "any", "host", "exec-timeout", "banner", "motd", "do", "interfaces", "vlan", "do"];
const IOS_ALIASES = { sh: "show", conf: "configure", t: "terminal", int: "interface", en: "enable", wr: "write", ex: "exit" };
const LITERAL_AFTER = new Set(["name", "description", "hostname", "secret", "password", "domain-name", "username", "motd"]);
const GLOBAL_CMDS = ["hostname", "interface", "vlan", "ip", "enable", "service", "banner", "line", "username", "crypto", "router", "no", "access-list", "spanning-tree"];
const SUB_CMDS = {
  if: ["ip", "no", "shutdown", "description", "switchport", "duplex", "speed", "encapsulation", "spanning-tree"],
  line: ["password", "login", "transport", "exec-timeout", "no"],
  vlan: ["name", "no"],
  router: ["network", "router-id", "passive-interface", "no"]
};
const IP_SUBCMDS = ["address", "route", "default-gateway", "domain-name", "ssh", "ospf"];

function expandTokens(tokens) {
  const out = [];
  let literal = false;
  tokens.forEach((token) => {
    if (literal || !/^[a-z-]+$/i.test(token)) { out.push(token); literal = false; return; }
    const lower = token.toLowerCase();
    let word = token;
    if (IOS_VOCAB.includes(lower)) word = lower;
    else if (IOS_ALIASES[lower]) word = IOS_ALIASES[lower];
    else {
      const matches = [...new Set(IOS_VOCAB.filter((v) => v.startsWith(lower)))].sort((a, b) => a.length - b.length);
      if (matches.length && matches.every((m) => m.startsWith(matches[0]))) word = matches[0];
    }
    out.push(word);
    if (LITERAL_AFTER.has(word)) literal = true;
  });
  return out;
}

function canonInterface(parts) {
  const joined = parts.join("").toLowerCase();
  const m = joined.match(/^(fastethernet|fa|gigabitethernet|gi|g|ethernet|eth|loopback|lo|vlan)(\d.*)$/);
  if (!m) return null;
  const names = { fa: "fastethernet", gi: "gigabitethernet", g: "gigabitethernet", eth: "ethernet", lo: "loopback" };
  return (names[m[1]] || m[1]) + m[2];
}

const shortIf = (name) => name.replace("gigabitethernet", "Gi").replace("fastethernet", "Fa").replace("loopback", "Lo").replace("vlan", "Vlan");
const ipInt = (s) => s.split(".").reduce((a, o) => a * 256 + Number(o), 0);
const intIp = (n) => [24, 16, 8, 0].map((shift) => Math.floor(n / 2 ** shift) % 256).join(".");
const maskLen = (mask) => ipInt(mask).toString(2).replace(/0/g, "").length;
const validIp = (s) => /^(\d{1,3}\.){3}\d{1,3}$/.test(s) && s.split(".").every((o) => Number(o) <= 255);

class IosSim {
  constructor(device) {
    this.device = device;
    this.host = device.hostname;
    this.mode = "user";
    this.ctx = "";
    this.config = [];
  }

  prompt() {
    const suffix = { user: ">", priv: "#", config: "(config)#", if: "(config-if)#", line: "(config-line)#", vlan: "(config-vlan)#", router: "(config-router)#" };
    return this.host + suffix[this.mode];
  }

  has(ctx, text) { return this.config.some((l) => l.ctx === ctx && l.text === text); }

  addLine(ctx, text) {
    const opposite = text.startsWith("no ") ? text.slice(3) : `no ${text}`;
    this.config = this.config.filter((l) => !(l.ctx === ctx && (l.text === opposite || l.text === text)));
    this.config.push({ ctx, text });
  }

  help() {
    if (this.mode === "user") return "Exec commands:\n  enable   Turn on privileged commands\n  show     Show running system information";
    if (this.mode === "priv") return "Exec commands:\n  configure  Enter configuration mode\n  show       Show running system information\n  write      Write running configuration to memory\n  disable    Turn off privileged commands";
    const list = this.mode === "config" ? GLOBAL_CMDS : SUB_CMDS[this.mode];
    return `Commands in this mode:\n  ${list.join(", ")}\n  exit, end, do`;
  }

  exec(raw) {
    const text = raw.trim();
    if (!text) return "";
    if (text === "?") return this.help();
    const tokens = expandTokens(text.split(/\s+/));
    if (this.mode === "user" || this.mode === "priv") return this.execExec(tokens);
    return this.execConfig(tokens);
  }

  execExec(t) {
    const invalid = "% Invalid input detected at '^' marker.";
    const first = t[0];
    if (first === "enable") { if (this.mode === "user") this.mode = "priv"; return ""; }
    if (first === "disable") { if (this.mode === "priv") this.mode = "user"; return ""; }
    if (first === "exit" || first === "end") { if (this.mode === "priv") this.mode = "user"; return ""; }
    if (first === "configure" && t[1] === "terminal" && this.mode === "priv") {
      this.mode = "config";
      this.ctx = "";
      return "Enter configuration commands, one per line.  End with CNTL/Z.";
    }
    if (first === "write" || (first === "copy" && t[1] === "running-config")) {
      return this.mode === "priv" ? "Building configuration...\n[OK]" : invalid;
    }
    if (first === "show") {
      if (t[1] === "running-config" && this.mode !== "user") return this.running();
      if (t[1] === "vlan") return this.showVlan();
      if (t[1] === "ip" && t[2] === "interface" && t[3] === "brief") return this.showIpBrief();
      if (t[1] === "ip" && t[2] === "route") return this.showRoute();
    }
    return invalid;
  }

  execConfig(t) {
    const first = t[0];
    if (first === "end") { this.mode = "priv"; this.ctx = ""; return ""; }
    if (first === "exit") {
      if (this.mode === "config") this.mode = "priv";
      else { this.mode = "config"; this.ctx = ""; }
      return "";
    }
    if (first === "do") return this.execExec(t.slice(1));

    const subset = SUB_CMDS[this.mode];
    let ctx = this.ctx;
    if (this.mode !== "config" && !subset.includes(first)) {
      if (!GLOBAL_CMDS.includes(first)) return "% Invalid input detected at '^' marker.";
      this.mode = "config";
      this.ctx = "";
      ctx = "";
    } else if (this.mode === "config" && !GLOBAL_CMDS.includes(first)) {
      return "% Invalid input detected at '^' marker.";
    }
    return this.applyCommand(t, ctx);
  }

  applyCommand(t, ctx) {
    const incomplete = "% Incomplete command.";
    const first = t[0];

    if (first === "hostname") {
      if (!t[1]) return incomplete;
      this.host = t[1];
      this.addLine("", `hostname ${t[1]}`);
      return "";
    }
    if (first === "interface") {
      const name = canonInterface(t.slice(1));
      const known = (this.device.interfaces || []).includes(name) || /^(vlan|loopback)\d+$/.test(name || "");
      if (!name || !known) return "% Invalid interface.";
      this.mode = "if";
      this.ctx = `interface ${name}`;
      if (!this.has("", this.ctx)) this.config.push({ ctx: "", text: this.ctx });
      return "";
    }
    if (first === "vlan") {
      if (!/^\d+$/.test(t[1] || "") || Number(t[1]) < 1 || Number(t[1]) > 4094) return incomplete;
      this.mode = "vlan";
      this.ctx = `vlan ${t[1]}`;
      if (!this.has("", this.ctx)) this.config.push({ ctx: "", text: this.ctx });
      return "";
    }
    if (first === "line") {
      const text = t.join(" ");
      if (!/^line (vty \d+ \d+|console 0)$/.test(text)) return incomplete;
      this.mode = "line";
      this.ctx = text;
      if (!this.has("", text)) this.config.push({ ctx: "", text });
      return "";
    }
    if (first === "router") {
      if (t[1] !== "ospf" || !/^\d+$/.test(t[2] || "")) return incomplete;
      this.mode = "router";
      this.ctx = `router ospf ${t[2]}`;
      if (!this.has("", this.ctx)) this.config.push({ ctx: "", text: this.ctx });
      return "";
    }
    if (first === "ip") {
      if (!IP_SUBCMDS.includes(t[1])) return "% Invalid input detected at '^' marker.";
      if (t[1] === "address" && !(validIp(t[2] || "") && validIp(t[3] || ""))) return incomplete;
      if (t[1] === "route" && !(validIp(t[2] || "") && validIp(t[3] || "") && validIp(t[4] || ""))) return incomplete;
    }
    if (t.length < 2 && ["name", "description", "password", "network", "enable", "username", "crypto"].includes(first)) return incomplete;
    this.addLine(ctx, t.join(" "));
    return "";
  }

  running() {
    const lines = ["Building configuration...", "", "Current configuration:", "!"];
    this.config.filter((l) => l.ctx === "").forEach((parent) => {
      lines.push(parent.text);
      this.config.filter((l) => l.ctx === parent.text).forEach((child) => lines.push(` ${child.text}`));
      lines.push("!");
    });
    lines.push("end");
    return lines.join("\n");
  }

  interfaceUp(name) {
    const ctx = `interface ${name}`;
    return this.device.kind === "router" ? this.has(ctx, "no shutdown") : !this.has(ctx, "shutdown");
  }

  ipOf(name) {
    const line = this.config.find((l) => l.ctx === `interface ${name}` && l.text.startsWith("ip address "));
    return line ? line.text.split(" ").slice(2) : null;
  }

  showIpBrief() {
    const rows = ["Interface              IP-Address      Status"];
    (this.device.interfaces || []).forEach((name) => {
      const ip = this.ipOf(name);
      rows.push(`${shortIf(name).padEnd(22)} ${(ip ? ip[0] : "unassigned").padEnd(15)} ${this.interfaceUp(name) ? "up" : "administratively down"}`);
    });
    return rows.join("\n");
  }

  showRoute() {
    const rows = ["Codes: C - connected, S - static", ""];
    (this.device.interfaces || []).forEach((name) => {
      const ip = this.ipOf(name);
      if (!ip || !this.interfaceUp(name)) return;
      const len = maskLen(ip[1]);
      const size = 2 ** (32 - len);
      rows.push(`C    ${intIp(Math.floor(ipInt(ip[0]) / size) * size)}/${len} is directly connected, ${shortIf(name)}`);
    });
    this.config.filter((l) => l.ctx === "" && l.text.startsWith("ip route ")).forEach((l) => {
      const [, , net, mask, hop] = l.text.split(" ");
      rows.push(`S    ${net}/${maskLen(mask)} [1/0] via ${hop}`);
    });
    return rows.join("\n");
  }

  showVlan() {
    const vlans = new Map([[1, "default"]]);
    this.config.filter((l) => l.ctx === "" && /^vlan \d+$/.test(l.text)).forEach((l) => {
      const id = Number(l.text.split(" ")[1]);
      const nameLine = this.config.find((c) => c.ctx === l.text && c.text.startsWith("name "));
      vlans.set(id, nameLine ? nameLine.text.slice(5) : `VLAN${String(id).padStart(4, "0")}`);
    });
    const ports = new Map([...vlans.keys()].map((id) => [id, []]));
    (this.device.interfaces || []).forEach((name) => {
      const access = this.config.find((l) => l.ctx === `interface ${name}` && l.text.startsWith("switchport access vlan "));
      const id = access ? Number(access.text.split(" ")[3]) : 1;
      if (ports.has(id)) ports.get(id).push(shortIf(name));
    });
    const rows = ["VLAN Name                 Status    Ports", "---- -------------------- --------- ----------------------------"];
    [...vlans.entries()].sort((a, b) => a[0] - b[0]).forEach(([id, name]) => {
      rows.push(`${String(id).padEnd(4)} ${name.padEnd(20)} active    ${ports.get(id).join(", ")}`);
    });
    return rows.join("\n");
  }
}

function labResults(q, history) {
  const sim = new IosSim(q.lab.device);
  (history || []).forEach((command) => sim.exec(command));
  return q.lab.objectives.map((o) => sim.config.some((l) => l.ctx === o.ctx && new RegExp(o.cmd, "i").test(l.text)));
}

/* ── Rendering ── */
function appendFeedback(container, q, right, answered, extra) {
  const feedback = node("div", `q-feedback ${right ? "is-correct" : "is-incorrect"}`);
  feedback.setAttribute("role", "status");
  feedback.append(node("strong", "", right ? "Correct" : answered ? "Not quite" : "Not answered"));
  feedback.append(node("p", "", q.explanation));
  if (extra) feedback.append(extra);
  container.append(feedback);
}

function renderDnd(container, q, { answer = [], revealed = false, order, onChange }) {
  const slots = q.pairs.map((_, i) => (answer[i] === undefined ? null : answer[i]));
  let selected = null;
  const wrap = node("div", "dnd");

  function place(item, target) {
    const from = slots.indexOf(item);
    if (from >= 0) slots[from] = null;
    if (target !== null) slots[target] = item;
    selected = null;
    onChange && onChange([...slots]);
    draw();
  }

  function chip(item, inSlot) {
    const button = node("button", "chip", q.pairs[item][1]);
    button.type = "button";
    if (revealed) { button.disabled = true; return button; }
    if (selected === item) button.classList.add("selected");
    button.draggable = true;
    button.addEventListener("dragstart", (event) => { event.dataTransfer.setData("text/plain", String(item)); });
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      if (inSlot) place(item, null);
      else { selected = selected === item ? null : item; draw(); }
    });
    return button;
  }

  function dropHandler(target) {
    return (event) => {
      event.preventDefault();
      const item = Number(event.dataTransfer.getData("text/plain"));
      if (!Number.isNaN(item)) place(item, target);
    };
  }

  function draw() {
    wrap.replaceChildren();
    wrap.append(node("p", "q-hint", revealed ? "Your matches:" : "Drag each item onto its match, or click an item and then click a slot."));

    const pool = node("div", "dnd-pool");
    pool.addEventListener("dragover", (event) => event.preventDefault());
    pool.addEventListener("drop", dropHandler(null));
    order.filter((i) => !slots.includes(i)).forEach((i) => pool.append(chip(i, false)));
    if (!pool.children.length) pool.append(node("span", "note", revealed ? "" : "All items placed"));
    wrap.append(pool);

    const rows = node("div", "dnd-rows");
    q.pairs.forEach((pair, t) => {
      const row = node("div", "dnd-row");
      row.append(node("span", "dnd-label", pair[0]));
      const slot = node("div", "dnd-slot");
      if (revealed) slot.classList.add(slots[t] === t ? "correct" : "incorrect");
      slot.addEventListener("dragover", (event) => event.preventDefault());
      slot.addEventListener("drop", dropHandler(t));
      slot.addEventListener("click", () => { if (!revealed && selected !== null) place(selected, t); });
      if (slots[t] !== null) slot.append(chip(slots[t], true));
      else slot.append(node("span", "slot-empty", revealed ? "No answer" : "Drop here"));
      row.append(slot);
      rows.append(row);
    });
    wrap.append(rows);
  }

  container.replaceChildren(node("h3", "q-text", q.question), wrap);
  draw();
}

function renderLab(container, q, { answer = [], revealed = false, onChange, rerender }) {
  const lab = q.lab;
  const sim = new IosSim(lab.device);
  const history = [...answer];
  const results = revealed ? labResults(q, history) : null;

  container.replaceChildren(node("h3", "q-text", q.question));
  container.append(node("p", "lab-scenario", lab.scenario));
  if (lab.topology) container.append(node("pre", "lab-topology", lab.topology));

  container.append(node("p", "field-title", "TASKS"));
  const tasks = node("ul", "lab-tasks");
  lab.objectives.forEach((objective, i) => {
    const li = node("li", results ? (results[i] ? "done" : "todo") : "");
    li.append(node("span", "task-mark", results ? (results[i] ? "✓" : "✕") : "•"), document.createTextNode(` ${objective.text}`));
    tasks.append(li);
  });
  container.append(tasks);

  const term = node("div", "term");
  const out = node("pre", "term-out");
  const row = node("div", "term-row");
  const promptEl = node("span", "term-prompt", sim.prompt());
  const input = node("input", "term-input");
  input.type = "text";
  input.autocomplete = "off";
  input.spellcheck = false;
  input.setAttribute("aria-label", "Device console");
  input.disabled = revealed;
  row.append(promptEl, input);
  term.append(out, row);
  container.append(term);

  const log = (text) => { out.textContent += `${text}\n`; out.scrollTop = out.scrollHeight; };
  log(`${lab.device.hostname} console. Type ? for help. Commands can be abbreviated (for example: conf t).`);
  history.forEach((command) => {
    log(`${sim.prompt()} ${command}`);
    const reply = sim.exec(command);
    if (reply) log(reply);
  });
  promptEl.textContent = sim.prompt();

  let cursor = history.length;
  input.addEventListener("keydown", (event) => {
    if (event.key === "ArrowUp" && cursor > 0) { cursor -= 1; input.value = history[cursor]; event.preventDefault(); }
    else if (event.key === "ArrowDown") { cursor = Math.min(cursor + 1, history.length); input.value = history[cursor] || ""; event.preventDefault(); }
    else if (event.key === "Enter") {
      const command = input.value;
      log(`${sim.prompt()} ${command}`);
      const reply = sim.exec(command);
      if (reply) log(reply);
      if (command.trim()) { history.push(command); onChange && onChange([...history]); }
      cursor = history.length;
      input.value = "";
      promptEl.textContent = sim.prompt();
    }
  });
  term.addEventListener("click", () => input.focus());

  if (!revealed) {
    const reset = node("button", "btn small", "Reset lab");
    reset.type = "button";
    reset.addEventListener("click", () => { onChange && onChange([]); rerender && rerender(); });
    container.append(reset);
  }
}

// Draws any question type. For revealed questions it also appends the explanation.
//   multiple choice: onSelect(i), onCheck()
//   drag-and-drop / lab: onChange(answer), onCheck(), order (display order of draggable items)
function renderAny(container, q, opts) {
  const type = qType(q);
  const answer = opts.answer || [];
  if (type === "mc") {
    renderQuestionCard(container, q, { selected: answer, revealed: opts.revealed, checkable: opts.checkable, onSelect: opts.onSelect, onCheck: opts.onCheck });
    return;
  }
  const inner = node("div");
  container.replaceChildren(inner);
  const settings = { ...opts, answer };
  if (type === "dnd") renderDnd(inner, q, settings);
  else renderLab(inner, q, settings);

  if (opts.revealed) {
    const right = gradeQuestion(q, answer);
    let extra = null;
    if (!right && type === "dnd") {
      extra = node("p", "q-answer", `Correct matches: ${q.pairs.map((p) => `${p[0]} → ${p[1]}`).join(" · ")}`);
    } else if (!right && type === "lab") {
      extra = node("pre", "lesson-code", `Example solution:\n${q.lab.solution.join("\n")}`);
    }
    appendFeedback(container, q, right, isAnswered(q, answer), extra);
  } else if (opts.checkable) {
    const check = node("button", "btn primary q-check", type === "lab" ? "Submit lab" : "Check answer");
    check.type = "button";
    check.addEventListener("click", () => opts.onCheck && opts.onCheck());
    container.append(check);
  }
}
