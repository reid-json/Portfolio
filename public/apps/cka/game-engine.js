(function (root) {
  "use strict";

  const STORAGE_KEY = "clustercraft-game-v1";
  const RANKS = [
    { name: "Signal Scout", xp: 0 },
    { name: "Relay Keeper", xp: 120 },
    { name: "Current Mapper", xp: 320 },
    { name: "Beacon Engineer", xp: 650 },
    { name: "Tidewatch Operator", xp: 1100 },
    { name: "Harbor Architect", xp: 1750 }
  ];
  const COSMETICS = [
    { id: "sea-glass", name: "Sea Glass Terminal", type: "terminal theme", xp: 120 },
    { id: "north-star", name: "North Star Console Frame", type: "console frame", xp: 320 },
    { id: "storm-lantern", name: "Storm Lantern Map", type: "map decoration", xp: 650 },
    { id: "quiet-current", name: "Quiet Current Avatar", type: "avatar style", xp: 1100 }
  ];
  const ACHIEVEMENTS = [
    ["first-signal", "First Signal", "Run your first simulated terminal command.", "Exploration"],
    ["first-lesson", "Open Channel", "Complete your first lesson.", "Learning"],
    ["first-quiz", "Signal Check", "Submit a lesson quiz.", "Learning"],
    ["first-lab", "First Repair", "Pass a graded simulator lab independently.", "Skill"],
    ["five-labs", "Five Clean Repairs", "Pass five graded simulator labs independently.", "Skill"],
    ["ten-labs", "Steady Hands", "Pass ten graded simulator labs independently.", "Skill"],
    ["twenty-five-labs", "Reliable Operator", "Pass twenty-five graded simulator labs independently.", "Skill"],
    ["first-note", "Field Journal", "Write your first field-journal note.", "Learning"],
    ["ten-notes", "Journal Keeper I", "Write ten field-journal notes.", "Consistency"],
    ["twenty-five-notes", "Journal Keeper II", "Write twenty-five field-journal notes.", "Consistency"],
    ["fifty-notes", "Journal Keeper III", "Write fifty field-journal notes.", "Consistency"],
    ["first-review", "Recall the Route", "Review a flashcard.", "Learning"],
    ["first-mock", "Trial Run", "Finish a mock exam.", "Skill"],
    ["mock-70", "Above the Breakwater", "Score at least 70% on a mock exam.", "Skill"],
    ["mock-80", "Clear Horizon", "Score at least 80% on a mock exam.", "Skill"],
    ["three-mocks", "Three Bearings", "Finish three mock exams.", "Consistency"],
    ["first-track", "Region Surveyed", "Complete a curriculum track.", "Learning"],
    ["three-tracks", "Coastal Network", "Complete three curriculum tracks.", "Learning"],
    ["all-tracks", "Chart the Coast", "Complete every curriculum track.", "Learning"],
    ["five-quiz-perfect", "Five Clear Signals", "Earn a perfect score on five lesson quizzes.", "Skill"],
    ["first-perfect-quiz", "No Static", "Earn a perfect score on a lesson quiz.", "Skill"],
    ["quiz-streak-three", "Three in Sequence", "Submit quizzes for three distinct lessons.", "Learning"],
    ["five-lessons", "Five Briefings", "Complete five lessons.", "Learning"],
    ["twenty-lessons", "Twenty Briefings", "Complete twenty lessons.", "Learning"],
    ["all-lessons", "Full Chart", "Complete every lesson.", "Learning"],
    ["no-hint-lab", "Self-Reliant", "Pass a lab without opening a hint.", "Skill"],
    ["quick-lab", "Quick Current", "Pass a lab in under five minutes.", "Skill"],
    ["returning-learner", "Welcome Back", "Resume learning after a week away.", "Consistency"],
    ["five-day-streak", "Five-Day Rhythm", "Study on five distinct days.", "Consistency"],
    ["ten-day-streak", "Ten-Day Rhythm", "Study on ten distinct days.", "Consistency"],
    ["twenty-five-day-streak", "A Month of Bearings", "Study on twenty-five distinct days.", "Consistency"],
    ["first-quest", "Quest Accepted", "Complete a daily quest.", "Exploration"],
    ["five-quests", "Quest Cartographer", "Complete five daily quests.", "Exploration"],
    ["twenty-quests", "Quest Regular", "Complete twenty daily quests.", "Exploration"],
    ["first-domain-storage", "Stores in Order", "Pass a storage-tagged lab.", "Skill"],
    ["first-domain-networking", "Connected Lights", "Pass a networking-tagged lab.", "Skill"],
    ["first-domain-troubleshooting", "Find the Fault", "Pass a troubleshooting-tagged lab.", "Troubleshooting"],
    ["first-domain-workloads", "Steady Workloads", "Pass a workload-tagged lab.", "Skill"],
    ["first-domain-access", "Granted Carefully", "Pass an access-control-tagged lab.", "Skill"],
    ["three-concepts", "Three Bearings", "Pass labs covering three distinct skill tags.", "Skill"],
    ["five-concepts", "Wide Coverage", "Pass labs covering five distinct skill tags.", "Skill"],
    ["first-star", "First Star", "Earn a three-star lab result.", "Skill"],
    ["five-stars", "Starboard", "Earn five three-star lab results.", "Skill"],
    ["ten-stars", "Night Watch", "Earn ten three-star lab results.", "Skill"],
    ["first-confidence", "Calibrated Guess", "Record a confidence rating in guided learning.", "Learning"],
    ["first-variant", "Transfer Signal", "Complete a lesson's apply task.", "Learning"],
    ["first-boss", "Boss Encounter", "Complete a boss capstone.", "Skill"],
    ["three-bosses", "Capstone Crew", "Complete three boss capstones.", "Skill"],
    ["first-sandbox", "Safe to Experiment", "Enter the chaos sandbox.", "Exploration"],
    ["first-codex", "Curious Mind", "Discover a codex concept.", "Exploration"],
    ["ten-codex", "Codex Keeper", "Discover ten codex concepts.", "Exploration"],
    ["all-codex", "Every Light Mapped", "Discover every available codex concept.", "Exploration"],
    ["first-cosmetic", "Personal Touch", "Unlock a cosmetic.", "Fun"],
    ["three-cosmetics", "A Look of Your Own", "Unlock three cosmetics.", "Fun"],
    ["plain-mode", "Plain Sailing", "Choose Plain Mode.", "Fun"],
    ["game-mode", "Back to the Map", "Return to Game Mode.", "Fun"],
    ["backup-export", "Backup Beacon", "Export a local progress backup.", "Skill"],
    ["planner-set", "Tide Table", "Create a study plan.", "Learning"],
    ["three-domains", "Three Channels", "Pass labs across three domains.", "Troubleshooting"],
    ["stuck-and-solved", "A Useful Detour", "Use a model solution, then pass independently.", "Learning"],
    ["daily-challenge", "Today's Signal", "Complete a daily challenge.", "Exploration"],
    ["welcome-home", "The Lights Are Still On", "Return after a break; earned progress remains.", "Fun"]
  ].map(([id, name, description, category]) => ({ id, name, description, category }));

  function freshState() {
    return {
      version: 1,
      xp: 0,
      earned: [],
      achievements: [],
      cosmetics: [],
      completedQuests: {},
      activityDays: [],
      processedEvents: [],
      records: {},
      mode: "game",
      freezeDays: 2,
      lastActiveDay: "",
      lastSeenAt: "",
      codex: []
    };
  }
  function safeState(value) {
    const base = freshState();
    if (!value || typeof value !== "object") return base;
    return {
      ...base,
      ...value,
      earned: Array.isArray(value.earned) ? value.earned : [],
      achievements: Array.isArray(value.achievements) ? value.achievements : [],
      cosmetics: Array.isArray(value.cosmetics) ? value.cosmetics : [],
      completedQuests: value.completedQuests && typeof value.completedQuests === "object" ? value.completedQuests : {},
      activityDays: Array.isArray(value.activityDays) ? value.activityDays : [],
      processedEvents: Array.isArray(value.processedEvents) ? value.processedEvents : [],
      records: value.records && typeof value.records === "object" ? value.records : {},
      codex: Array.isArray(value.codex) ? value.codex : [],
      xp: Number.isFinite(value.xp) && value.xp >= 0 ? value.xp : 0,
      freezeDays: Math.max(0, Number(value.freezeDays) || 0),
      mode: value.mode === "plain" ? "plain" : "game"
    };
  }
  function dateKey(date) {
    if (typeof date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(date)) return date;
    const d = date instanceof Date ? date : new Date(date);
    if (Number.isNaN(d.getTime())) throw new Error("A valid date is required for game progression.");
    return d.toISOString().slice(0, 10);
  }
  function hash(text) {
    let result = 2166136261;
    for (let index = 0; index < text.length; index++) result = Math.imul(result ^ text.charCodeAt(index), 16777619);
    return result >>> 0;
  }
  function dailyQuests(date, context) {
    const key = dateKey(date || new Date());
    const completed = context && Array.isArray(context.completed) ? context.completed : [];
    const dueReviews = Number(context && context.dueReviews) || 0;
    const choices = [
      { id: "mission", title: "Clear one practice mission", detail: "Pass a graded practice lab independently.", type: "mission" },
      { id: "review", title: "Review one study card", detail: "Try to recall the answer before revealing it.", type: "review" },
      { id: "journal", title: "Add one field-journal note", detail: "Write one idea in your own words.", type: "note" },
      { id: "terminal", title: "Run one command and explain its output", detail: "Use the simulated terminal, then record what you observed.", type: "terminal" }
    ];
    const seed = hash(key);
    const selected = [];
    for (let offset = 0; selected.length < 3; offset++) {
      const quest = choices[(seed + offset * 7) % choices.length];
      if (!selected.some((item) => item.id === quest.id)) selected.push(quest);
    }
    return selected.map((quest) => ({ ...quest, date: key, completed: completed.includes(`${key}:${quest.id}`) }));
  }
  function createEngine(storage) {
    let backing = storage || null;
    if (!backing) {
      try { backing = root.localStorage || null; }
      catch (error) { console.error("Game progress storage is unavailable.", error); }
    }
    let state = freshState();
    const listeners = new Map();
    let storageErrorReported = false;
    function persist() {
      if (!backing) {
        if (!storageErrorReported) console.error("Game progress could not be saved because browser storage is unavailable.");
        storageErrorReported = true;
        return;
      }
      try { backing.setItem(STORAGE_KEY, JSON.stringify(state)); }
      catch (error) { console.error("Could not save game progress.", error); }
    }
    function restore(value) {
      state = safeState(value);
      persist();
      return getState();
    }
    try {
      const saved = backing && backing.getItem(STORAGE_KEY);
      if (saved) state = safeState(JSON.parse(saved));
    } catch (error) {
      console.error("Could not restore game progress.", error);
      state = freshState();
    }
    function getRank() {
      return RANKS.slice().reverse().find((rank) => state.xp >= rank.xp) || RANKS[0];
    }
    function getState() {
      return JSON.parse(JSON.stringify({ ...state, rank: getRank().name, nextRank: RANKS.find((rank) => rank.xp > state.xp) || null }));
    }
    function emit(type, payload) {
      const event = { ...(payload || {}), type, at: payload && payload.at || new Date().toISOString() };
      (listeners.get(type) || []).forEach((listener) => listener(event));
      return event;
    }
    function on(type, listener) {
      if (!listeners.has(type)) listeners.set(type, new Set());
      listeners.get(type).add(listener);
      return () => listeners.get(type).delete(listener);
    }
    function award(amount, source, date) {
      if (amount <= 0) return 0;
      const key = dateKey(date || new Date());
      const lowEffort = source === "note" || source === "review";
      const lowEffortToday = state.earned.filter((item) => item.date === key && (item.source === "note" || item.source === "review")).reduce((sum, item) => sum + item.amount, 0);
      const permitted = lowEffort ? Math.max(0, 15 - lowEffortToday) : amount;
      const actual = Math.min(amount, permitted);
      if (actual) {
        state.xp += actual;
        state.earned.push({ amount: actual, source, date: key });
        updateActivity(key);
        if (state.xp >= COSMETICS[0].xp) unlock("first-cosmetic");
        if (COSMETICS.filter((item) => state.xp >= item.xp).length >= 3) unlock("three-cosmetics");
      }
      return actual;
    }
    function unlock(id) {
      if (!state.achievements.includes(id)) state.achievements.push(id);
    }
    function updateActivity(key) {
      const previous = state.lastActiveDay;
      if (previous && previous !== key) {
        const elapsed = Math.floor((new Date(`${key}T12:00:00`) - new Date(`${previous}T12:00:00`)) / 86400000);
        if (elapsed > 7) unlock("returning-learner");
        if (elapsed === 2 && state.freezeDays > 0) state.freezeDays--;
      }
      if (!state.activityDays.includes(key)) state.activityDays.push(key);
      state.activityDays.sort();
      state.lastActiveDay = key;
      state.lastSeenAt = new Date().toISOString();
      if (state.activityDays.length >= 5) unlock("five-day-streak");
      if (state.activityDays.length >= 10) unlock("ten-day-streak");
      if (state.activityDays.length >= 25) unlock("twenty-five-day-streak");
    }
    function dailyCaps(event, date) {
      const eventId = String(event.eventId || `${event.type}:${event.id || event.concept || event.sourceId || "event"}:${dateKey(date)}`);
      if (state.processedEvents.includes(eventId)) return false;
      state.processedEvents.push(eventId);
      if (state.processedEvents.length > 2000) state.processedEvents.splice(0, state.processedEvents.length - 2000);
      return true;
    }
    on("terminal-command", (event) => {
      if (!dailyCaps(event, event.at)) return;
      updateActivity(dateKey(event.at));
      unlock("first-signal");
      state.records.lastTerminalAt = event.at;
      persist();
    });
    on("confidence-recorded", (event) => {
      if (!dailyCaps(event, event.at)) return;
      updateActivity(dateKey(event.at));
      unlock("first-confidence");
      persist();
    });
    on("lesson-completed", (event) => {
      if (!dailyCaps(event, event.at)) return;
      award(15, "lesson", event.at);
      unlock("first-lesson");
      if ((event.completedCount || 0) >= 5) unlock("five-lessons");
      if ((event.completedCount || 0) >= 20) unlock("twenty-lessons");
      if (event.completedCount >= event.totalLessons && event.totalLessons > 0) unlock("all-lessons");
      persist();
    });
    on("quiz-result", (event) => {
      if (!dailyCaps(event, event.at)) return;
      updateActivity(dateKey(event.at));
      unlock("first-quiz");
      if (event.score === 100) unlock("first-perfect-quiz");
      if ((event.perfectCount || 0) >= 5) unlock("five-quiz-perfect");
      if (event.distinctLessons >= 3) unlock("quiz-streak-three");
      if (event.isNewBest) award(Math.max(0, Math.min(12, Math.round((Number(event.score) || 0) / 10))), "quiz", event.at);
      persist();
    });
    on("lab-evidence", (event) => {
      if (!dailyCaps(event, event.at)) return;
      updateActivity(dateKey(event.at));
      if (!event.passed || event.eligible === false) return;
      state.records.passedLabIds = state.records.passedLabIds || [];
      const firstPass = !state.records.passedLabIds.includes(event.labId);
      if (firstPass) {
        state.records.passedLabIds.push(event.labId);
        award(40, "lab", event.at);
      }
      unlock("first-lab");
      if ((event.passedCount || 0) >= 5) unlock("five-labs");
      if ((event.passedCount || 0) >= 10) unlock("ten-labs");
      if ((event.passedCount || 0) >= 25) unlock("twenty-five-labs");
      if (event.hintUsage === 0) unlock("no-hint-lab");
      if (event.timeTakenSeconds < 300) unlock("quick-lab");
      (event.skillTags || []).forEach((tag) => {
        if (!state.codex.includes(tag)) state.codex.push(tag);
        const id = tag.includes("storage") ? "first-domain-storage" : tag.includes("network") ? "first-domain-networking" : tag.includes("troubleshoot") ? "first-domain-troubleshooting" : tag.includes("workload") ? "first-domain-workloads" : tag.includes("access") ? "first-domain-access" : "";
        if (id) unlock(id);
      });
      if (state.codex.length >= 3) unlock("three-concepts");
      if (state.codex.length >= 5) unlock("five-concepts");
      if (event.stars >= 3) {
        state.records.threeStarLabIds = state.records.threeStarLabIds || [];
        if (!state.records.threeStarLabIds.includes(event.labId)) state.records.threeStarLabIds.push(event.labId);
        unlock("first-star");
        if (state.records.threeStarLabIds.length >= 5) unlock("five-stars");
        if (state.records.threeStarLabIds.length >= 10) unlock("ten-stars");
      }
      persist();
    });
    on("note-created", (event) => {
      if (!dailyCaps(event, event.at)) return;
      updateActivity(dateKey(event.at));
      award(5, "note", event.at);
      unlock("first-note");
      if ((event.noteCount || 0) >= 10) unlock("ten-notes");
      if ((event.noteCount || 0) >= 25) unlock("twenty-five-notes");
      if ((event.noteCount || 0) >= 50) unlock("fifty-notes");
      persist();
    });
    on("review-completed", (event) => {
      if (!dailyCaps(event, event.at)) return;
      updateActivity(dateKey(event.at));
      award(3, "review", event.at);
      unlock("first-review");
      persist();
    });
    on("mock-completed", (event) => {
      if (!dailyCaps(event, event.at)) return;
      if (event.score >= 70) unlock("mock-70");
      if (event.score >= 80) unlock("mock-80");
      unlock("first-mock");
      if ((event.mockCount || 0) >= 3) unlock("three-mocks");
      award(25, "mock", event.at);
      persist();
    });
    on("track-completed", (event) => {
      if (!dailyCaps(event, event.at)) return;
      unlock("first-track");
      if ((event.trackCount || 0) >= 3) unlock("three-tracks");
      if (event.trackCount >= event.totalTracks && event.totalTracks > 0) unlock("all-tracks");
      state.records.completedTrackIds = state.records.completedTrackIds || [];
      if (!state.records.completedTrackIds.includes(event.trackId)) {
        state.records.completedTrackIds.push(event.trackId);
        award(30, "track", event.at);
      }
      persist();
    });
    on("quest-completed", (event) => {
      const key = dateKey(event.at);
      const questKey = `${key}:${event.questId}`;
      if (state.completedQuests[questKey]) return;
      state.completedQuests[questKey] = true;
      award(8, "quest", event.at);
      const total = Object.keys(state.completedQuests).length;
      unlock("first-quest");
      if (total >= 5) unlock("five-quests");
      if (total >= 20) unlock("twenty-quests");
      persist();
    });
    on("planner-created", (event) => {
      if (!dailyCaps(event, event.at)) return;
      unlock("planner-set");
      persist();
    });
    on("progress-exported", (event) => {
      if (!dailyCaps(event, event.at)) return;
      unlock("backup-export");
      persist();
    });
    function setMode(mode) {
      if (mode !== "game" && mode !== "plain") throw new Error("Mode must be game or plain.");
      state.mode = mode;
      unlock(mode === "plain" ? "plain-mode" : "game-mode");
      persist();
      return getState();
    }
    function completeQuest(id, date) {
      emit("quest-completed", { questId: id, at: date || new Date().toISOString() });
    }
    function questEligible(id, context, date) {
      const today = dateKey(date || new Date());
      if (id === "mission") return Boolean((context && context.evidenceRecords || []).some((item) => item.passed && item.eligible !== false && item.date && dateKey(item.date) === today));
      if (id === "journal") return Boolean((context && context.notes || []).some((item) => typeof item.text === "string" && item.text.trim() && item.createdAt && dateKey(item.createdAt) === today));
      if (id === "review") return Boolean((context && context.notes || []).some((item) => item.flashcard && item.flashcard.lastReviewedAt && dateKey(item.flashcard.lastReviewedAt) === today));
      if (id === "terminal") return Boolean(state.records.lastTerminalAt && dateKey(state.records.lastTerminalAt) === today);
      return false;
    }
    return {
      on, emit, getState, restore, setMode, completeQuest, questEligible,
      quests(date, context) {
        const key = dateKey(date || new Date());
        return dailyQuests(date, { ...(context || {}), completed: Object.keys(state.completedQuests).filter((item) => item.startsWith(`${key}:`)) });
      },
      achievements: () => ACHIEVEMENTS.map((item) => ({ ...item, unlocked: state.achievements.includes(item.id) })),
      cosmetics: () => COSMETICS.map((item) => ({ ...item, unlocked: state.xp >= item.xp })),
      exportState: () => getState()
    };
  }

  root.CKA_GAME = {
    STORAGE_KEY, RANKS, ACHIEVEMENTS, COSMETICS, dailyQuests, createEngine,
    simulateProfiles() {
      return ["fast", "average", "struggling", "grinder", "skipper"].map((profile) => {
        const engine = createEngine({ getItem: () => null, setItem: () => {} });
        const count = profile === "fast" ? 45 : profile === "average" ? 30 : profile === "struggling" ? 18 : profile === "grinder" ? 100 : 0;
        for (let index = 0; index < count; index++) {
          engine.emit("lab-evidence", {
            eventId: `${profile}-lab-${index}`, id: `${profile}-lab-${index}`, passed: true, eligible: true,
            passedCount: index + 1, stars: index % 3 === 0 ? 3 : 2,
            skillTags: ["workload-deployment"], hintUsage: index % 4, timeTakenSeconds: 400
          });
        }
        if (profile === "grinder") {
          for (let index = 0; index < 200; index++) engine.emit("note-created", { eventId: `grind-${index}`, id: `grind-${index}`, noteCount: index + 1 });
        }
        return { profile, xp: engine.getState().xp, rank: engine.getState().rank, grinderNotesXp: profile === "grinder" ? engine.getState().earned.filter((item) => item.source === "note").reduce((sum, item) => sum + item.amount, 0) : 0 };
      });
    }
  };
})(typeof window !== "undefined" ? window : globalThis);
