const learning = (() => {
  const key = "packetpath-learning-v1";
  const empty = () => ({ notes: {}, awards: {}, days: {} });
  let data = empty();
  let loadFailed = false;
  try {
    const saved = JSON.parse(localStorage.getItem(key) || "null");
    if (saved !== null) {
      const record = (value) => value && typeof value === "object" && !Array.isArray(value);
      if (!record(saved) || !record(saved.notes) || !record(saved.awards) || !record(saved.days)
        || !Object.values(saved.notes).every((note) => record(note) && ["domain", "topic", "text", "updated"].every((field) => typeof note[field] === "string"))
        || !Object.values(saved.awards).every((award) => record(award) && [5, 15].includes(award.xp) && typeof award.correct === "boolean")
        || !Object.values(saved.days).every((count) => Number.isInteger(count) && count >= 0)) {
        throw new Error("Invalid notebook or journey data.");
      }
      data = saved;
    }
  } catch (error) {
    loadFailed = true;
    console.error("Could not load your notebook and journey.", error);
    window.addEventListener("DOMContentLoaded", () => notify("Could not load your notebook and journey. Check browser storage before editing notes."));
  }

  function notify(message) {
    let notice = document.getElementById("learning-error");
    if (!notice) {
      notice = document.createElement("p");
      notice.id = "learning-error";
      notice.className = "learning-error";
      notice.setAttribute("role", "alert");
      document.querySelector("main").prepend(notice);
    }
    notice.textContent = message;
  }

  function persist() {
    if (loadFailed) {
      notify("Not saved: existing notebook data could not be loaded. Export new notes and check browser storage; existing data has not been overwritten.");
      return false;
    }
    try {
      localStorage.setItem(key, JSON.stringify(data));
      document.getElementById("learning-error")?.remove();
      return true;
    } catch (error) {
      console.error("Could not save your notebook and journey.", error);
      notify("Not saved: browser storage is unavailable or full. Keep this page open and export your notes.");
      return false;
    }
  }

  function dayKey(date = new Date()) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  }

  function snapshot(now = new Date()) {
    const awards = Object.values(data.awards);
    const xp = awards.reduce((sum, award) => sum + award.xp, 0);
    const today = dayKey(now);
    const cursor = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12);
    if (!data.days[today]) cursor.setDate(cursor.getDate() - 1);
    let streak = 0;
    while (data.days[dayKey(cursor)]) {
      streak += 1;
      cursor.setDate(cursor.getDate() - 1);
    }
    return { xp, level: Math.floor(xp / 200) + 1, today: data.days[today] || 0, streak, count: awards.length };
  }

  function award(question, correct, now = new Date()) {
    if (data.awards[question.id]) return 0;
    const xp = correct ? 15 : 5;
    data.awards[question.id] = { xp, correct, domain: question.domain, topic: question.topic || question.lesson.title };
    const day = dayKey(now);
    data.days[day] = (data.days[day] || 0) + 1;
    persist();
    return xp;
  }

  function noteKey(domain, topic) { return JSON.stringify([domain, topic]); }
  function getNote(domain, topic) { return data.notes[noteKey(domain, topic)]?.text || ""; }
  function saveNote(domain, topic, text) {
    const id = noteKey(domain, topic);
    if (text.trim()) data.notes[id] = { domain, topic, text, updated: new Date().toISOString() };
    else delete data.notes[id];
    return persist();
  }
  function notes() { return Object.values(data.notes).sort((a, b) => b.updated.localeCompare(a.updated)); }
  function exportNotes() {
    return ["# PacketPath notebook", "", ...notes().flatMap((note) => [
      `## ${note.topic}`, `Domain: ${note.domain}`, "", note.text, ""
    ])].join("\n");
  }

  function element(tag, text, className) {
    const el = document.createElement(tag);
    if (text !== undefined) el.textContent = text;
    if (className) el.className = className;
    return el;
  }

  function renderJourney(bank = []) {
    const container = document.getElementById("learning-journey");
    if (!container) return;
    const stats = snapshot();
    container.replaceChildren();
    const header = element("div", undefined, "journey-heading");
    const title = element("div");
    const ranks = ["Packet explorer", "Link builder", "Route finder", "Network navigator", "PacketPath captain"];
    title.append(element("h2", `Level ${stats.level} · ${ranks[Math.min(4, Math.floor((stats.level - 1) / 5))]}`),
      element("p", `${stats.xp} XP · ${200 - stats.xp % 200} XP to the next level`));
    const start = element("a", bank.length ? "Back to your question" : "Continue your quest", "journey-link");
    start.href = bank.length ? "#question" : "study.html";
    header.append(title, start);
    container.append(header);
    const meter = element("progress");
    meter.max = 200;
    meter.value = stats.xp % 200;
    meter.setAttribute("aria-label", "XP toward next level");
    container.append(meter);
    const details = element("div", undefined, "journey-stats");
    details.append(element("span", `Daily quest: ${Math.min(stats.today, 10)}/10 new questions${stats.today >= 10 ? " - complete!" : ""}`),
      element("span", `${stats.streak}-day streak`), element("span", `${stats.count} questions explored`));
    container.append(details);
    const badges = element("div", undefined, "journey-badges");
    [[1, "First packet"], [25, "Making connections"], [100, "Century club"], [500, "Network builder"]].forEach(([count, label]) => {
      const earned = stats.count >= count;
      badges.append(element("span", `${earned ? "Earned" : `Unlock at ${count}`}: ${label}`, earned ? "badge earned" : "badge"));
    });
    if (bank.length) {
      const groups = new Map();
      bank.forEach((q) => {
        const id = noteKey(q.domain, q.topic || q.lesson.title);
        if (!groups.has(id)) groups.set(id, []);
        groups.get(id).push(q);
      });
      let complete = 0;
      let mastered = 0;
      groups.forEach((questions) => {
        if (questions.every((q) => data.awards[q.id])) {
          complete += 1;
          if (questions.filter((q) => data.awards[q.id].correct).length / questions.length >= 0.8) mastered += 1;
        }
      });
      badges.append(element("span", `${complete}/${groups.size} topic badges · ${mastered} with 80%+ first-try accuracy`, "badge earned"));
    }
    const help = element("p", "15 XP for a first-try correct answer; 5 XP for learning from a miss. Each question earns once, even after reset. Your quest is 10 new questions a day.", "journey-help");
    if (bank.length) {
      const achievements = element("details", undefined, "journey-achievements");
      achievements.append(element("summary", "Your badges and XP rules"), badges, help);
      container.append(achievements);
    } else {
      container.append(badges, help);
    }
  }
  window.addEventListener("DOMContentLoaded", () => {
    if (!document.getElementById("learning-journey")?.children.length) renderJourney();
  });
  return { award, snapshot, getNote, saveNote, notes, exportNotes, renderJourney };
})();
