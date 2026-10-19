(function () {
  "use strict";

  const DATA = window.CKA_DATA;
  const SIM = window.CKA_SIM;
  const GAME = window.CKA_GAME.createEngine();
  const STORAGE_KEY = "clustercraft-progress-v1";
  const SIMULATOR_KEY = "clustercraft-simulator-v1";
  const VIEWS = {
    overview: "Overview", learn: "Learning path", terminal: "Practice terminal",
    labs: "Labs & troubleshooting", exams: "Mock exams", reference: "Reference library",
    progress: "Progress & planner", notes: "Smart Notes", career: "Career Kit", game: "Relay map & quests"
  };
  const defaultProgress = () => ({
    completed: [], quizScores: {}, labRuns: {}, missed: [], mocks: [], planner: null, theme: "dark",
    evidenceRecords: [], trackCompletions: [], faultResults: {}, guidedLessons: {},
    career: { ratings: {}, edits: {}, certificationPassed: false, certificationDate: "", certificationId: "" }
  });
  function normalizeProgress(value) {
    const defaults = defaultProgress();
    return {
      ...defaults,
      ...value,
      career: { ...defaults.career, ...(value.career || {}) },
      evidenceRecords: Array.isArray(value.evidenceRecords) ? value.evidenceRecords : [],
      trackCompletions: Array.isArray(value.trackCompletions) ? value.trackCompletions : [],
      faultResults: value.faultResults && typeof value.faultResults === "object" ? value.faultResults : {},
      guidedLessons: value.guidedLessons && typeof value.guidedLessons === "object" ? value.guidedLessons : {}
    };
  }
  let progress = loadProgress();
  let view = "overview";
  let selectedLesson = DATA.lessons[0].id;
  let selectedLab = null;
  let terminalOutput = "ClusterCraft simulated shell · type `help` to see the supported command list.\nThis is a teaching model, not a real Kubernetes cluster.\n";
  let terminalHistoryIndex = 0;
  try {
    const savedSimulator = localStorage.getItem(SIMULATOR_KEY);
    if (savedSimulator) SIM.restore(JSON.parse(savedSimulator));
  } catch (error) {
    console.error("Could not restore the saved simulator state.", error);
  }
  let exam = progress.activeExam && !progress.activeExam.finished ? progress.activeExam : null;
  let examTaskIndex = Number(progress.activeExamTaskIndex || 0);
  let toastTimer = 0;
  let quizState = {};
  let quickLearn = false;
  let faultAnswers = {};
  let noteRecords = [];
  let activeNoteId = null;
  let noteFilter = "all";
  let noteQuery = "";
  let noteSaveTimer = 0;
  let noteWriteQueue = Promise.resolve();
  let noteSaveStatus = "Saved locally";
  let selectedInterviewId = "";
  let pendingNoteCapture = null;
  let careerTrackId = 0;
  let selectedLabStartedAt = Date.now();
  let selectedLabHintsUsed = 0;
  let selectedLabUsedSolution = false;
  let activeExamTaskForNote = null;
  let selectedLabCommandStart = 0;

  function loadProgress() {
    try {
      const value = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
      return value && typeof value === "object" ? normalizeProgress(value) : defaultProgress();
    } catch (error) {
      console.error("Could not read saved study progress.", error);
      return defaultProgress();
    }
  }
  function saveProgress() {
    const newlyCompleted = [];
    if (window.CKA_CAREER) {
      const states = window.CKA_CAREER.trackStates(DATA, progress);
      states.filter((item) => item.complete).forEach((item) => {
        if (!progress.trackCompletions.some((track) => track.id === item.id)) {
          const completion = { id: item.id, completedAt: new Date().toISOString() };
          progress.trackCompletions.push(completion);
          newlyCompleted.push(completion);
          GAME.emit("track-completed", {
            eventId: `track-${item.id}`,
            trackId: item.id,
            trackCount: progress.trackCompletions.length,
            totalTracks: DATA.modules.length,
            at: completion.completedAt
          });
        }
      });
    }
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(progress)); }
    catch (error) {
      console.error("Could not save study progress.", error);
      toast("Progress could not be saved. Export a backup and check browser storage settings.");
    }
    return newlyCompleted;
  }
  function escapeHtml(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
  }
  function toast(message) {
    const node = document.getElementById("toast");
    node.textContent = message;
    node.classList.add("show");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => node.classList.remove("show"), 2600);
  }
  function pct(n, total) { return total ? Math.round(n / total * 100) : 0; }
  function lessonById(id) { return DATA.lessons.find((item) => item.id === id) || DATA.lessons[0]; }
  function moduleById(id) { return DATA.modules.find((item) => item.id === Number(id)); }
  function completedCount(module) { return module.lessonIds.filter((id) => progress.completed.includes(id)).length; }
  function weightedReadiness() {
    const domains = DATA.modules.filter((item) => item.weight > 0);
    const total = domains.reduce((sum, item) => sum + item.weight, 0);
    return Math.round(domains.reduce((sum, item) => sum + item.weight * pct(completedCount(item), item.lessonIds.length), 0) / total);
  }
  function getLab(id) { return SIM.checks().find((item) => item.id === id); }
  function labTrackId(id) { return window.CKA_CAREER.labTracks[id] ?? 5; }
  function fmtDate(value) {
    if (!value) return "Not set";
    const date = /^\d{4}-\d{2}-\d{2}$/.test(value) ? new Date(value + "T12:00:00") : new Date(value);
    return Number.isNaN(date.getTime()) ? "Unknown date" : date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
  }
  function quizFor(lesson) {
    const result = lesson.questions.slice();
    const templates = [
      (concept) => `Which concept is a direct fit for "${lesson.title}"?`,
      (concept) => `A task mentions ${concept}. Which home lesson should you revisit?`,
      (concept) => `Which term should you recognize when working through this lesson?`,
      (concept) => `Which item is most closely connected to this lesson's core skill?`
    ];
    let index = 0;
    while (result.length < 4) {
      const concept = lesson.concepts[(index + result.length) % lesson.concepts.length] || lesson.title;
      const distractors = DATA.lessons.filter((item) => item.id !== lesson.id).flatMap((item) => item.concepts).filter((item) => item !== concept);
      const wrong = distractors.slice(result.length, result.length + 3);
      const choices = [concept, ...wrong];
      const shift = result.length % choices.length;
      const shuffled = choices.slice(shift).concat(choices.slice(0, shift));
      result.push({
        question: templates[index % templates.length](concept),
        choices: shuffled,
        answer: shuffled.indexOf(concept),
        why: `${concept} is owned by this lesson. Use the concept map to find the single home lesson for any term.`
      });
      index++;
    }
    return result.slice(0, 6);
  }
  function quizScoreFor(id) {
    return progress.quizScores[id] ? progress.quizScores[id].best : null;
  }

  function lessonInfo(lessonId) {
    const lesson = DATA.lessons.find((item) => item.id === lessonId);
    return lesson ? { lessonId, trackId: lesson.module, domain: lesson.domain, concepts: lesson.concepts || [] } : {};
  }
  function makeNoteRecord(options) {
    const source = options.source || (view === "learn" ? lessonInfo(selectedLesson) : {});
    const now = new Date().toISOString();
    return {
      id: `note-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      title: options.title || (source.lessonId ? `Note: ${lessonById(source.lessonId).title}` : "Quick note"),
      text: options.text || "",
      quote: options.quote || "",
      source,
      trackId: source.trackId,
      lessonId: source.lessonId,
      domain: source.domain,
      conceptTags: source.concepts || [],
      userTags: [],
      createdAt: now,
      updatedAt: now,
      pinned: false,
      starred: false,
      confusing: false,
      cheatSheet: false,
      format: "markdown",
      type: options.type || "note",
      flashcard: null
    };
  }
  function createNote(options) {
    const note = makeNoteRecord(options);
    noteRecords.unshift(note);
    activeNoteId = note.id;
    persistNote(note);
    noteSaveStatus = "Saved locally";
    noteOpen = true;
    if (note.text.trim() && (note.type === "note" || note.type === "reflection")) {
      note.gameRewarded = true;
      GAME.emit("note-created", { eventId: note.id, id: note.id, noteCount: noteRecords.filter((item) => item.text && item.text.trim()).length });
    }
    render();
    if (view !== "notes" && view !== "career") toast("Note captured. Your original page is still open.");
    return note;
  }
  let noteOpen = false;
  function persistNote(note) {
    note.updatedAt = new Date().toISOString();
    noteSaveStatus = "Saving…";
    clearTimeout(noteSaveTimer);
    noteSaveTimer = window.setTimeout(() => {
      noteWriteQueue = noteWriteQueue.then(() => window.CKA_NOTES.save(note)).then(() => {
        noteSaveStatus = "Saved locally";
        const label = document.getElementById("note-save-status");
        if (label) label.textContent = noteSaveStatus;
      }).catch((error) => {
        console.error("Could not autosave a note.", error);
        noteSaveStatus = "Save failed — export a backup";
        const label = document.getElementById("note-save-status");
        if (label) label.textContent = noteSaveStatus;
        toast("Note could not be saved. Export a backup and check browser storage.");
      });
    }, 180);
  }
  function persistNotesBatch() {
    clearTimeout(noteSaveTimer);
    noteSaveStatus = "Saving…";
    noteWriteQueue = noteWriteQueue.then(() => window.CKA_NOTES.saveAll(noteRecords)).then(() => {
      noteSaveStatus = "Saved locally";
      const label = document.getElementById("note-save-status");
      if (label) label.textContent = noteSaveStatus;
    }).catch((error) => {
      console.error("Could not save the notes collection.", error);
      noteSaveStatus = "Save failed — export a backup";
      toast("Notes could not be saved. Export a backup and check browser storage.");
    });
  }
  function saveNoteField(note, field, value) {
    if (!note) return;
    note[field] = value;
    persistNote(note);
  }
  function getActiveNote() { return noteRecords.find((item) => item.id === activeNoteId) || null; }
  function getReflection(lessonId) {
    return noteRecords.find((item) => item.type === "reflection" && item.lessonId === lessonId);
  }
  function noteMarkdown(note) {
    return `<article class="note-preview">${escapeHtml(note.text || "").replace(/```([\s\S]*?)```/g, (_, code) => `<pre><code>${code}</code></pre>`).replace(/^### (.+)$/gm, "<h4>$1</h4>").replace(/^## (.+)$/gm, "<h3>$1</h3>").replace(/^# (.+)$/gm, "<h2>$1</h2>").replace(/^- \[x\] (.+)$/gim, '<p>☑ $1</p>').replace(/^- \[ \] (.+)$/gm, '<p>☐ $1</p>').replace(/`([^`]+)`/g, "<code>$1</code>").replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>").replace(/\*([^*]+)\*/g, "<em>$1</em>").replace(/(?:^|\n)(?!<h[234]|<pre|<p>)(.+)(?=\n|$)/g, "<p>$1</p>")}</article>`;
  }
  function renderLessonNotes(lesson) {
    const reflection = getReflection(lesson.id);
    const points = lesson.summary.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
    return `<div class="lesson-section note-prompt"><h3>Note prompt</h3><p>In your own words, explain: <strong>${escapeHtml(lesson.title)}</strong>. Writing a reflection helps you check your understanding; the site does not grade your prose.</p><textarea class="note-reflection" data-lesson="${lesson.id}" rows="3" placeholder="Explain the idea in your own words…">${escapeHtml(reflection ? reflection.text : "")}</textarea><p class="small muted">${reflection && reflection.text.trim() ? "✓ You have explained this idea yourself." : "Your reflection autosaves locally."}</p><details><summary>Compare with the key points</summary><ul>${points}</ul></details><button class="button quiet" data-action="quick-note" data-lesson="${lesson.id}">Open in Smart Notes</button></div>`;
  }
  function renderNotesDock() {
    let dock = document.getElementById("notes-dock");
    if (!dock) {
      dock = document.createElement("aside");
      dock.id = "notes-dock";
      dock.setAttribute("aria-label", "Quick notes panel");
      document.body.appendChild(dock);
    }
    if (!noteOpen) { dock.hidden = true; dock.innerHTML = ""; return; }
    const note = getActiveNote();
    dock.hidden = false;
    dock.innerHTML = `<div class="notes-dock-head"><strong>Smart Notes</strong><span id="note-save-status" class="small muted">${escapeHtml(noteSaveStatus)}</span><button class="button quiet" data-action="close-notes">×</button></div><div class="notes-dock-body">${note ? `<label class="field">Title<input data-note-field="title" value="${escapeHtml(note.title)}"></label><label class="field">Note<textarea data-note-field="text" rows="8" placeholder="Write in Markdown. Autosaves as you type…">${escapeHtml(note.text)}</textarea></label><p class="small muted">${escapeHtml((note.domain || "Quick capture") + (note.lessonId ? ` · ${lessonById(note.lessonId).title}` : ""))}</p><button class="button" data-action="view-note" data-id="${note.id}">Open full notes</button>` : `<p class="small muted">Create a note without leaving this page.</p><button class="button primary" data-action="quick-note">New note</button>`}</div>`;
  }
  function filteredNotes() {
    let result = noteRecords.slice();
    const query = noteQuery.trim().toLowerCase();
    if (query) result = result.filter((note) => [note.title, note.text, note.quote, note.domain, ...(note.conceptTags || []), ...(note.userTags || [])].join(" ").toLowerCase().includes(query));
    if (noteFilter === "starred") result = result.filter((note) => note.starred);
    else if (noteFilter === "pinned") result = result.filter((note) => note.pinned);
    else if (noteFilter === "confusing") result = result.filter((note) => note.confusing);
    else if (noteFilter === "cheatsheet") result = result.filter((note) => note.cheatSheet);
    else if (noteFilter === "flashcards") result = result.filter((note) => note.flashcard);
    else if (noteFilter.startsWith("track:")) result = result.filter((note) => String(note.trackId) === noteFilter.slice(6));
    else if (noteFilter.startsWith("tag:")) result = result.filter((note) => [...(note.conceptTags || []), ...(note.userTags || [])].includes(noteFilter.slice(4)));
    if (noteFilter === "date") result.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
    return result.sort((a, b) => Number(b.pinned) - Number(a.pinned) || b.updatedAt.localeCompare(a.updatedAt));
  }
  function noteListHtml() {
    const notes = filteredNotes();
    return notes.length ? notes.map((note) => `<article class="note-list-item ${note.id === activeNoteId ? "active" : ""}" data-action="select-note" data-id="${note.id}" tabindex="0"><strong>${escapeHtml(note.title || "Untitled note")}</strong><small>${escapeHtml(note.domain || "Quick capture")} · ${fmtDate(note.updatedAt.slice(0, 10))}</small><span>${escapeHtml((note.text || note.quote || "Empty note").slice(0, 115))}</span><div class="note-flags">${note.pinned ? "Pinned · " : ""}${note.starred ? "Starred · " : ""}${note.confusing ? "Confusing" : ""}</div></article>`).join("") : `<div class="empty-state">No notes match this view. Capture one with the N key or Note +.</div>`;
  }
  function noteLinks(note) {
    const linked = [...String(note.text || "").matchAll(/\[\[([^\]]+)\]\]/g)].map((match) => match[1]);
    const unique = [...new Set(linked)];
    return unique.length ? `<div class="backlinks"><strong>Linked concepts</strong>${unique.map((term) => {
      const lesson = DATA.lessons.find((item) => item.title.toLowerCase() === term.toLowerCase() || item.concepts.some((concept) => concept.toLowerCase() === term.toLowerCase()));
      const backlinks = noteRecords.filter((item) => item.id !== note.id && (item.text || "").toLowerCase().includes(`[[${term.toLowerCase()}]]`));
      return `<p><span>${escapeHtml(term)}</span>${lesson ? ` · <button class="button quiet" data-action="open-lesson" data-id="${lesson.id}">Home lesson</button>` : ""} · ${backlinks.length} backlink${backlinks.length === 1 ? "" : "s"}</p>`;
    }).join("")}</div>` : "";
  }
  function renderNoteEditor(note) {
    if (!note) return `<div class="card empty-state">Select a note or create one. Notes stay in this browser and are not synced to an account.</div>`;
    const tracks = DATA.modules.map((track) => `<option value="${track.id}" ${Number(note.trackId) === track.id ? "selected" : ""}>${escapeHtml(track.title)}</option>`).join("");
    const cardsDue = note.flashcard && (!note.flashcard.dueAt || note.flashcard.dueAt <= new Date().toISOString());
    return `<article class="card note-editor"><div class="note-editor-toolbar"><button class="button" data-action="toggle-note-flag" data-flag="pinned" data-id="${note.id}">${note.pinned ? "Unpin" : "Pin"}</button><button class="button" data-action="toggle-note-flag" data-flag="starred" data-id="${note.id}">${note.starred ? "★ Starred" : "☆ Star"}</button><button class="button" data-action="toggle-note-flag" data-flag="confusing" data-id="${note.id}">${note.confusing ? "Confusing ✓" : "Mark confusing"}</button><button class="button danger" data-action="delete-note" data-id="${note.id}">Delete</button></div>
      <label class="field">Title<input data-note-field="title" value="${escapeHtml(note.title)}"></label>
      ${note.quote ? `<blockquote class="note-quote">${escapeHtml(note.quote)}<small>Source: <button class="button quiet" data-action="open-note-source" data-lesson="${escapeHtml(note.lessonId || "")}" data-anchor="${escapeHtml(note.source && note.source.section || "")}">${escapeHtml(note.source && note.source.label || "lesson selection")}</button></small></blockquote>` : ""}
      ${note.format === "cornell" ? `<div class="cornell-grid"><label class="field">Cues<input data-note-field="cues" value="${escapeHtml(note.cues || "")}" placeholder="Questions or keywords"></label><label class="field">Notes<textarea data-note-field="text" rows="12">${escapeHtml(note.text)}</textarea></label><label class="field">Summary<textarea data-note-field="summary" rows="3">${escapeHtml(note.summary || "")}</textarea></label></div>` : `<div class="markdown-toolbar"><button class="button" data-action="markdown-insert" data-value="**bold**">Bold</button><button class="button" data-action="markdown-insert" data-value="\`code\`">Code</button><button class="button" data-action="markdown-insert" data-value="- [ ] Task">Checklist</button></div><label class="field">Your note (Markdown supported)<textarea id="note-body" data-note-field="text" rows="14" list="concept-options" placeholder="Write freely. Use [[ to link a concept or lesson.">${escapeHtml(note.text)}</textarea><datalist id="concept-options">${DATA.lessons.flatMap((item) => [item.title, ...item.concepts]).map((term) => `<option value="[[${escapeHtml(term)}]]"></option>`).join("")}</datalist></label><div class="note-preview-wrap"><strong>Live preview</strong>${noteMarkdown(note)}</div>`}
      <div class="note-meta"><label class="field">Track<select data-note-field="trackId"><option value="">General</option>${tracks}</select></label><label class="field">Your tags<input data-note-field="userTags" value="${escapeHtml((note.userTags || []).join(", "))}" placeholder="comma-separated"></label></div>
      <p class="small muted">Auto-tags: ${escapeHtml([note.domain, ...(note.conceptTags || [])].filter(Boolean).join(" · ") || "General note")} · ${escapeHtml(noteSaveStatus)} · Autosaves locally; no account or cloud sync.</p>
      <div class="note-editor-toolbar"><button class="button" data-action="toggle-note-flag" data-flag="cheatSheet" data-id="${note.id}">${note.cheatSheet ? "Remove from cheat sheet" : "Add to my cheat sheet"}</button><button class="button" data-action="make-flashcard" data-id="${note.id}">${note.flashcard ? "Flashcard created" : "Make flashcard"}</button><button class="button" data-action="toggle-cornell-view" data-id="${note.id}">${note.format === "cornell" ? "Switch to Markdown" : "Cornell mode"}</button></div>
      ${note.flashcard ? `<div class="callout"><strong>Flashcard</strong><p>Front: ${escapeHtml(note.flashcard.front)}</p><p>Back: ${escapeHtml(note.flashcard.back.slice(0, 300))}</p>${cardsDue ? `<p>Due for spaced review · ${note.flashcard.reviews || 0} reviews</p><button class="button" data-action="review-card" data-rating="again" data-id="${note.id}">Review again</button> <button class="button" data-action="review-card" data-rating="good" data-id="${note.id}">Know it</button>` : `<p class="small muted">Next review ${fmtDate(note.flashcard.dueAt.slice(0, 10))}</p>`}</div>` : ""}
      ${noteLinks(note)}</article>`;
  }
  function renderCheatSheet() {
    const items = noteRecords.filter((note) => note.cheatSheet).sort((a, b) => (a.order || 0) - (b.order || 0));
    return items.length ? `<div class="card cheat-sheet">${items.map((note, index) => `<article class="cheat-entry" draggable="true" data-note-id="${note.id}" data-cheat-index="${index}"><div><h3>${escapeHtml(note.title)}</h3><p>${escapeHtml(note.quote || note.text)}</p><small>${escapeHtml(note.domain || "Personal note")}</small></div><div><button class="button" data-action="cheat-move" data-id="${note.id}" data-direction="-1">↑</button><button class="button" data-action="cheat-move" data-id="${note.id}" data-direction="1">↓</button></div></article>`).join("")}</div>` : `<div class="card empty-state">Add reference entries or notes to build a personal cheat sheet.</div>`;
  }
  function renderNotes() {
    const note = getActiveNote();
    const tags = [...new Set(noteRecords.flatMap((item) => [...(item.conceptTags || []), ...(item.userTags || [])]))].sort();
    const filterOptions = [
      ["all", "All notes"], ["date", "By date"], ["starred", "Starred"], ["pinned", "Pinned"], ["confusing", "Confusing"], ["flashcards", "Flashcards"], ["cheatsheet", "My cheat sheet"],
      ...DATA.modules.map((item) => [`track:${item.id}`, item.title]),
      ...tags.map((tag) => [`tag:${tag}`, `Tag: ${tag}`])
    ];
    const due = noteRecords.filter((item) => item.flashcard && (!item.flashcard.dueAt || item.flashcard.dueAt <= new Date().toISOString()));
    const backupReminder = noteRecords.length && progress.notesBackupAt && Date.now() - Date.parse(progress.notesBackupAt) < 30 * 86400000
      ? "" : noteRecords.length ? `<div class="callout warning" style="margin-bottom:14px">Back up your notes: browser storage can be cleared, and there is no cloud sync. Export a JSON or Markdown copy periodically.</div>` : "";
    return `<div class="hero-row"><div class="hero-copy"><div class="eyebrow">Local-first · no account · no cloud sync</div><h1>Smart Notes</h1><p>Capture reflections, quotes, commands, and lessons learned. Notes autosave in IndexedDB when available, with a local-storage fallback.</p></div><div class="note-editor-toolbar"><button class="button primary" data-action="quick-note">New note</button><button class="button" data-action="export-notes-md">Export Markdown</button><button class="button" data-action="export-notes-zip">Export ZIP</button><button class="button" data-action="export-notes-json">Backup JSON</button><button class="button" data-action="print-notes">Print</button></div></div>
      ${backupReminder}<div class="callout warning">Personal notes and cheat sheets are for studying only. The actual exam has separate resource rules; verify the current handbook. Browser storage is not a backup.</div>
      <div class="notes-toolbar"><input id="notes-search" class="reference-search" type="search" placeholder="Search note text, quotes, and tags…" value="${escapeHtml(noteQuery)}"><select id="notes-filter" aria-label="Filter notes">${filterOptions.map(([value, label]) => `<option value="${escapeHtml(value)}" ${noteFilter === value ? "selected" : ""}>${escapeHtml(label)}</option>`).join("")}</select><label class="button">Import notes<input type="file" id="import-notes" accept="application/json,.json" hidden></label></div>
      <div class="flashcard-queue card"><strong>Spaced-repetition queue</strong><span>${due.length} note flashcard${due.length === 1 ? "" : "s"} due</span>${due.slice(0, 5).map((item) => `<button class="button" data-action="select-note" data-id="${item.id}">${escapeHtml(item.flashcard.front)}</button>`).join("")}</div>
      <div class="notes-layout"><div class="note-list card" id="note-list">${noteListHtml()}</div><div id="note-editor">${renderNoteEditor(note)}</div></div>
      <div class="section-heading"><h2>My Cheat Sheet</h2><div class="note-editor-toolbar"><button class="button" data-action="export-cheatsheet">Export Markdown</button><button class="button" data-action="print-cheatsheet">Print</button></div></div>${renderCheatSheet()}
      <div class="section-heading"><h2>Track recaps</h2><span class="tag">Your notes, confusing items first</span></div><div class="module-list">${DATA.modules.map((track) => {
        const trackNotes = noteRecords.filter((item) => Number(item.trackId) === track.id);
        const complete = window.CKA_CAREER.trackStates(DATA, progress).find((item) => item.id === track.id).complete;
        return `<article class="module-card"><span class="module-number">${String(track.id).padStart(2, "0")}</span><div><h3>${escapeHtml(track.title)}</h3><p>${trackNotes.length} note${trackNotes.length === 1 ? "" : "s"} · ${complete ? "Track complete" : "In progress"}</p></div><button class="button" data-action="track-recap" data-id="${track.id}">Review recap</button></article>`;
      }).join("")}</div>`;
  }

  function markdownForNotes(notes) {
    return notes.map((note) => {
      const tags = [...(note.conceptTags || []), ...(note.userTags || [])];
      return `# ${note.title || "Untitled note"}\n\n${note.domain ? `**Track:** ${DATA.modules.find((item) => item.id === Number(note.trackId))?.title || note.domain}\n\n` : ""}${note.quote ? `> ${note.quote.replace(/\n/g, "\n> ")}\n\n` : ""}${note.text || ""}${tags.length ? `\n\n**Tags:** ${tags.join(", ")}` : ""}`;
    }).join("\n\n---\n\n");
  }
  function downloadFile(name, content, type) {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = name;
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  function zipNotes(files) {
    const encoder = new TextEncoder();
    const crcTable = Array.from({ length: 256 }, (_, index) => {
      let value = index;
      for (let bit = 0; bit < 8; bit++) value = value & 1 ? 0xedb88320 ^ (value >>> 1) : value >>> 1;
      return value >>> 0;
    });
    const crc32 = (bytes) => {
      let crc = 0xffffffff;
      bytes.forEach((byte) => { crc = crcTable[(crc ^ byte) & 255] ^ (crc >>> 8); });
      return (crc ^ 0xffffffff) >>> 0;
    };
    const localParts = [], centralParts = [];
    let offset = 0;
    files.forEach((file) => {
      const name = encoder.encode(file.name);
      const data = encoder.encode(file.content);
      const checksum = crc32(data);
      const local = new Uint8Array(30 + name.length);
      const localView = new DataView(local.buffer);
      localView.setUint32(0, 0x04034b50, true); localView.setUint16(4, 20, true); localView.setUint16(6, 0x0800, true);
      localView.setUint32(14, checksum, true); localView.setUint32(18, data.length, true); localView.setUint32(22, data.length, true);
      localView.setUint16(26, name.length, true); local.set(name, 30);
      localParts.push(local, data);
      const central = new Uint8Array(46 + name.length);
      const view = new DataView(central.buffer);
      view.setUint32(0, 0x02014b50, true); view.setUint16(4, 20, true); view.setUint16(6, 20, true);
      view.setUint16(8, 0x0800, true); view.setUint32(16, checksum, true); view.setUint32(20, data.length, true);
      view.setUint32(24, data.length, true); view.setUint16(28, name.length, true); view.setUint32(42, offset, true); central.set(name, 46);
      centralParts.push(central);
      offset += local.length + data.length;
    });
    const centralSize = centralParts.reduce((sum, part) => sum + part.length, 0);
    const end = new Uint8Array(22);
    const endView = new DataView(end.buffer);
    endView.setUint32(0, 0x06054b50, true); endView.setUint16(8, files.length, true); endView.setUint16(10, files.length, true);
    endView.setUint32(12, centralSize, true); endView.setUint32(16, offset, true);
    return new Blob([...localParts, ...centralParts, end], { type: "application/zip" });
  }
  function printDocument(title, content) {
    const popup = window.open("", "_blank");
    if (!popup) { toast("Print window was blocked. Allow popups or use the Markdown export."); return; }
    popup.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>${escapeHtml(title)}</title><style>body{font:14px/1.6 system-ui,sans-serif;max-width:850px;margin:30px auto;color:#18212c}pre{white-space:pre-wrap}blockquote{border-left:3px solid #888;padding-left:12px}</style></head><body><h1>${escapeHtml(title)}</h1>${content}</body></html>`);
    popup.document.close();
    popup.focus();
    popup.print();
  }
  function exportNotesJson() {
    const backup = { version: 1, exportedAt: new Date().toISOString(), notes: noteRecords };
    downloadFile("clustercraft-notes.json", JSON.stringify(backup, null, 2), "application/json");
    progress.notesBackupAt = new Date().toISOString();
    saveProgress();
    render();
    toast("Notes JSON backup exported.");
  }
  function exportNotesMarkdown() {
    downloadFile("clustercraft-notes.md", markdownForNotes(noteRecords), "text/markdown");
    progress.notesBackupAt = new Date().toISOString();
    saveProgress();
    toast("Markdown notes exported.");
  }
  function exportNotesZip() {
    const files = DATA.lessons.map((lesson) => {
      const notes = noteRecords.filter((note) => note.lessonId === lesson.id);
      return { name: `lessons/${lesson.id}.md`, content: markdownForNotes(notes) || `# ${lesson.title}\n\nNo notes yet.` };
    });
    const other = noteRecords.filter((note) => note.trackId == null || !DATA.modules.some((track) => track.id === Number(note.trackId)));
    if (other.length) files.push({ name: "general-notes.md", content: markdownForNotes(other) });
    const blob = zipNotes(files);
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url; link.download = "clustercraft-notes.zip"; link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    progress.notesBackupAt = new Date().toISOString();
    saveProgress();
    render();
    toast("Per-track notes ZIP exported.");
  }
  function exportResume(format) {
    const kit = window.CKA_CAREER.build(DATA, progress);
    const bullets = kit.bullets.flatMap((item) => item.bullets.map((bullet) => careerEdit(`bullet:${bullet.id}`, bullet.text)));
    const defaultDraft = ["KUBERNETES LAB EXPERIENCE", ...bullets.map((item) => `- ${item}`), kit.skills.length ? `\nSkills demonstrated in passed simulated labs: ${kit.skills.map((item) => item.name).join(", ")}` : ""].filter(Boolean).join("\n");
    const content = `${careerEdit("headline", kit.headline)}\n\n${careerEdit("resume", defaultDraft)}\n\n${careerEdit("about", kit.about)}`;
    const ext = format === "txt" ? "txt" : "md";
    downloadFile(`clustercraft-resume.${ext}`, content, format === "txt" ? "text/plain" : "text/markdown");
  }
  function openTrackRecap(trackId) {
    careerTrackId = Number(trackId);
    noteFilter = `track:${trackId}`;
    noteRecords.sort((a, b) => Number(b.confusing) - Number(a.confusing) || b.updatedAt.localeCompare(a.updatedAt));
    const recap = noteRecords.find((note) => Number(note.trackId) === Number(trackId));
    activeNoteId = recap ? recap.id : null;
    noteQuery = "";
    setView("notes");
  }
  function createLessonsLearnedNote(title, detail, source) {
    const text = `## What I tried\n\n\n## What went wrong\n\n${detail || ""}\n\n## The fix\n\n\n## How to spot it next time\n\n`;
    createNote({ title, text, type: "lessons-learned", source });
  }
  function removeNote(id) {
    noteRecords = noteRecords.filter((item) => item.id !== id);
    if (activeNoteId === id) activeNoteId = noteRecords[0] ? noteRecords[0].id : null;
    window.CKA_NOTES.remove(id).catch((error) => {
      console.error("Could not remove a note.", error);
      toast(error.message);
    });
    render();
    toast("Note deleted.");
  }
  function reviewFlashcard(note, rating) {
    if (!note || !note.flashcard) return;
    const card = note.flashcard;
    card.reviews = (card.reviews || 0) + 1;
    card.intervalDays = rating === "again" ? 1 : Math.min(60, Math.max(2, (card.intervalDays || 1) * 2));
    card.dueAt = new Date(Date.now() + card.intervalDays * 86400000).toISOString();
    card.lastRating = rating;
    card.lastReviewedAt = new Date().toISOString();
    GAME.emit("review-completed", { eventId: `review-${note.id}-${card.reviews}`, id: note.id, at: card.lastReviewedAt });
    persistNote(note);
    render();
    toast(`Flashcard scheduled in ${card.intervalDays} day${card.intervalDays === 1 ? "" : "s"}.`);
  }
  function addCheatEntry(title, text, source) {
    const existing = noteRecords.find((item) => item.cheatSheet && item.title === title && item.text === text);
    if (existing) {
      toast("That item is already on your cheat sheet.");
      return;
    }
    const note = makeNoteRecord({
      title,
      text,
      source: source || {},
      type: "reference"
    });
    note.cheatSheet = true;
    note.order = noteRecords.filter((item) => item.cheatSheet).length;
    noteRecords.unshift(note);
    activeNoteId = note.id;
    persistNote(note);
    toast("Added to your personal cheat sheet.");
  }

  function renderOverview() {
    const totalLessons = DATA.lessons.length;
    const passedLabs = Object.values(progress.labRuns).filter((item) => item && item.passed).length;
    const recentMock = progress.mocks[progress.mocks.length - 1];
    const domains = DATA.modules.filter((item) => item.weight > 0);
    const score = weightedReadiness();
    const next = DATA.lessons.find((item) => !progress.completed.includes(item.id)) || DATA.lessons[0];
    const totalWeight = domains.reduce((sum, item) => sum + item.weight, 0);
    return `<div class="hero-row"><div class="hero-copy"><div class="eyebrow">Your CKA practice workspace</div><h1>Learn Kubernetes by doing.</h1><p>Move from command-line basics to cluster operations with focused lessons, a browser-based simulator, and state-checked tasks. Your work stays in this browser.</p></div><button class="button primary" data-action="open-lesson" data-id="${next.id}">Continue learning <span>→</span></button></div>
      <div class="callout warning"><strong>Exam facts:</strong> Official CKA curriculum v1.37 (Kubernetes 1.37 curriculum version), revised competencies effective February 18, 2025. The exam is 2 hours with a 66% passing score; the task count can vary. Exam environments and allowed resources can change—confirm the current candidate handbook before test day. In the real exam, only handbook-approved documentation access is permitted.</div>
      <div class="stats-grid" style="margin-top:17px">
        <article class="stat-card"><div class="stat-label">Weighted lesson coverage <span>↗</span></div><div class="stat-value">${score}%</div><div class="stat-note">Lesson completion across the five exam domains (${totalWeight}% total), not an exam readiness score</div></article>
        <article class="stat-card"><div class="stat-label">Lessons completed <span>▤</span></div><div class="stat-value">${progress.completed.length}<small style="font-size:13px;color:var(--muted)"> / ${totalLessons}</small></div><div class="stat-note">Foundations and exam skills are extra preparation</div></article>
        <article class="stat-card"><div class="stat-label">Labs passed <span>◈</span></div><div class="stat-value">${passedLabs}</div><div class="stat-note">Graded from simulated final state</div></article>
        <article class="stat-card"><div class="stat-label">Latest mock score <span>◷</span></div><div class="stat-value">${recentMock ? recentMock.score + "%" : "—"}</div><div class="stat-note">${recentMock ? `${recentMock.exam} · ${recentMock.timeLeft} remaining` : "Start a timed exam when ready"}</div></article>
      </div>
      <div class="dashboard-grid"><section><div class="section-heading"><h2>Exam domains</h2><button class="button quiet" data-view="progress">Detailed progress →</button></div><div class="card domain-list">${domains.map((item) => `<div class="domain-row"><strong>${escapeHtml(item.title)}</strong><div class="progress-track"><div class="progress-fill" style="width:${pct(completedCount(item), item.lessonIds.length)}%"></div></div><span class="domain-weight">${item.weight}% · ${pct(completedCount(item), item.lessonIds.length)}%</span></div>`).join("")}</div>
        <div class="section-heading"><h2>Study modules</h2><button class="button quiet" data-view="learn">Open learning path →</button></div><div class="module-list">${DATA.modules.map((item) => `<article class="module-card" data-action="open-module" data-id="${item.id}" tabindex="0" role="button"><span class="module-number">${String(item.id).padStart(2, "0")}</span><div><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.description)}</p></div><span class="tag">${item.weight ? item.weight + "% exam weight" : "Preparation"}</span></article>`).join("")}</div>
      </section><aside><div class="section-heading"><h2>Suggested next step</h2></div><div class="card"><div class="eyebrow">Continue your path</div><h3 style="margin-top:12px">${escapeHtml(next.title)}</h3><p class="muted small">Module ${next.module} · ${escapeHtml(next.domain)}</p><button class="button primary" data-action="open-lesson" data-id="${next.id}">Open lesson</button></div>
        <div class="section-heading"><h2>Study tools</h2></div><div class="card" style="display:grid;gap:9px"><button class="button" data-view="terminal">Open practice terminal</button><button class="button" data-view="labs">Try a graded lab</button><button class="button" data-view="reference">Search Docs Navigator</button><button class="button" data-view="exams">Browse six mock exams</button></div>
        <div class="section-heading"><h2>What this simulator is</h2></div><div class="callout">A local teaching model for selected kubectl workflows. It is not a real cluster, and it does not claim complete Kubernetes command fidelity. Open <button class="button quiet" style="padding:1px 4px" data-action="coverage">Command Coverage</button> before relying on it.</div></aside></div>`;
  }

  function renderGuidedPrompt(lesson, question, guide) {
    const selected = guide.answer;
    const isCommitted = guide.revealed;
    const feedback = isCommitted
      ? selected === question.answer
        ? `<div class="callout guided-feedback">Your prediction fits the evidence. ${escapeHtml(question.why)}</div>`
        : `<div class="callout warning guided-feedback">You chose “${escapeHtml(question.choices[selected] || "")}.” What would that predict for the situation? Compare that with the observed result: ${escapeHtml(question.why)}</div>`
      : "";
    return `<section class="lesson-section guided-prompt" aria-labelledby="guided-question">
      <div class="eyebrow">Predict before the reveal</div>
      <p>${escapeHtml(lesson.lab)}</p>
      <h2 id="guided-question">${escapeHtml(question.question)}</h2>
      <fieldset class="guided-options" ${isCommitted ? "disabled" : ""}><legend class="small muted">Choose the prediction that best fits the evidence</legend>${question.choices.map((choice, index) => `<label><input type="radio" name="guided-${lesson.id}" value="${index}" ${selected === index ? "checked" : ""}><span>${escapeHtml(choice)}</span></label>`).join("")}</fieldset>
      ${!isCommitted ? `<label class="field">How confident are you?<select id="guided-confidence"><option value="low">Low</option><option value="medium" selected>Medium</option><option value="high">High</option></select></label><div class="form-row"><button class="button primary" data-action="guided-commit" data-id="${lesson.id}">Commit my prediction</button><button class="button" data-action="guided-explain-first" data-id="${lesson.id}">Explain first</button><button class="button quiet" data-action="quick-learn" data-id="${lesson.id}">Quick Learn</button></div>` : `<div class="form-row"><button class="button" data-action="quick-learn" data-id="${lesson.id}">${quickLearn ? "Show full lesson" : "Quick Learn"}</button><button class="button quiet" data-action="guided-retry" data-id="${lesson.id}">Try a new prediction</button></div>`}
      ${feedback}
      ${!isCommitted && guide.explainFirst ? `<div class="lesson-section"><h3>Tool tip</h3><p>${escapeHtml(lesson.explanation.split("\n\n")[0])}</p><p class="small muted">Now commit a prediction above to check what you understood.</p></div>` : ""}
    </section>`;
  }

  function renderLesson() {
    const lesson = lessonById(selectedLesson);
    const module = moduleById(lesson.module);
    const siblings = module.lessonIds.map(lessonById);
    const questions = quizFor(lesson);
    if (!quizState[lesson.id]) quizState[lesson.id] = { answers: {}, submitted: false };
    const quiz = quizState[lesson.id];
    const guide = progress.guidedLessons[lesson.id] || {};
    const revealed = progress.completed.includes(lesson.id) || guide.revealed;
    const titleVisible = revealed || guide.explainFirst;
    return `<div class="eyebrow">${revealed ? `${escapeHtml(module.title)}${module.weight ? ` · ${module.weight}% domain` : ""}` : "Guided briefing"}</div><div class="hero-row"><div class="hero-copy"><h1>${titleVisible ? escapeHtml(lesson.title) : "What would you predict?"}</h1><p>${titleVisible ? `${escapeHtml(lesson.domain)} · One home lesson for this concept set` : "Make a prediction before the key idea is revealed."}</p></div><button class="button ${progress.completed.includes(lesson.id) ? "" : "primary"}" data-action="complete-lesson" data-id="${lesson.id}">${progress.completed.includes(lesson.id) ? "✓ Completed" : "Mark lesson complete"}</button></div>
      <div class="split"><nav class="card lesson-nav" aria-label="Module lessons">${siblings.map((item, index) => { const known = progress.completed.includes(item.id) || Boolean(progress.guidedLessons[item.id] && progress.guidedLessons[item.id].revealed); return `<button class="${item.id === lesson.id ? "active" : ""}" data-action="open-lesson" data-id="${item.id}">${progress.completed.includes(item.id) ? "✓ " : ""}${known ? escapeHtml(item.title) : `Briefing ${index + 1}`}</button>`; }).join("")}</nav>
      <article class="card lesson-content">${renderGuidedPrompt(lesson, questions[0], guide)}${revealed && quickLearn ? `<div class="lesson-section"><h3>Quick Learn · apply what you worked out</h3><p>${escapeHtml(lesson.summary[0] || lesson.title)}</p><pre>${escapeHtml(lesson.command.split("\n")[0])}</pre><p>What changed in your prediction after comparing it with the output?</p><button class="button" data-action="run-command" data-command="${encodeURIComponent(lesson.command.split("\n")[0])}">Try the first command</button><p><button class="button" data-action="quick-learn" data-id="${lesson.id}">Show full lesson</button></p></div>` : revealed ? `<div class="guided-lesson-content"><div class="lesson-section"><h3>1. Objectives</h3><ul>${lesson.objectives.map((x) => `<li>${escapeHtml(x)}</li>`).join("")}</ul></div>
        <div class="lesson-section"><h3>2. Prerequisites</h3><p>${escapeHtml(lesson.prerequisites)}</p></div>
        <div class="lesson-section"><h3>3. Plain-English explanation</h3>${lesson.explanation.split("\n\n").map((p) => `<p>${escapeHtml(p)}</p>`).join("")}</div>
        <div class="lesson-section"><h3>4. How it works</h3><div class="code-sample">${escapeHtml(lesson.how)}</div></div>
        <div class="lesson-section"><h3>5. Worked example</h3><pre>${escapeHtml(lesson.command)}</pre><p><strong>Expected output</strong></p><pre>${escapeHtml(lesson.expected)}</pre><p>${escapeHtml(lesson.breakdown)}</p><button class="button" data-action="copy" data-copy="${encodeURIComponent(lesson.command)}">Copy commands</button></div>
        <div class="lesson-section"><h3>6. Hands-on lab</h3><p>${escapeHtml(lesson.lab)}</p><p class="small muted">Open the matching lab set in Labs &amp; troubleshooting to practice in the simulator. The simulator does not model every operation described in this lesson.</p><button class="button" data-view="labs">Open labs</button></div>
        <div class="lesson-section"><h3>7. Common mistakes</h3><ul>${lesson.mistakes.map((x) => `<li>${escapeHtml(x)}</li>`).join("")}</ul></div>
        <div class="lesson-section"><h3>8. Exam angle</h3><p>${escapeHtml(lesson.exam)}</p></div>
        <div class="lesson-section"><h3>9. Check your understanding</h3>${questions.map((item, qIndex) => {
          const chosen = quiz.answers[qIndex];
          const show = quiz.submitted && chosen !== undefined;
          const correct = chosen === item.answer;
          return `<div class="card" style="padding:13px;margin:9px 0"><p style="margin-bottom:9px;color:var(--text);font-weight:600">${qIndex + 1}. ${escapeHtml(item.question)}</p>${item.choices.map((choice, cIndex) => `<label style="display:flex;gap:8px;align-items:flex-start;margin:7px 0;font-size:11px;color:var(--muted)"><input type="radio" name="quiz-${lesson.id}-${qIndex}" data-action="quiz-answer" data-lesson="${lesson.id}" data-question="${qIndex}" value="${cIndex}" ${chosen === cIndex ? "checked" : ""} ${quiz.submitted ? "disabled" : ""}>${escapeHtml(choice)}</label>`).join("")}${show ? `<p class="${correct ? "" : "muted"} small" style="color:${correct ? "var(--accent)" : "var(--yellow)"}">${correct ? "Correct. " : "Review: "}${escapeHtml(item.why)}</p>` : ""}</div>`;
        }).join("")}<button class="button primary" data-action="submit-quiz" data-id="${lesson.id}" ${quiz.submitted ? "disabled" : ""}>Check answers</button>${quiz.submitted ? `<span class="small muted"> Best: ${quizScoreFor(lesson.id)}%</span>${progress.quizScores[lesson.id].latest < 100 ? `<button class="button" data-action="learned-quiz" data-id="${lesson.id}">Add missed questions to notes</button>` : ""}<button class="button" data-action="retry-quiz" data-id="${lesson.id}">Try a new review</button>` : ""}</div>
        ${renderLessonNotes(lesson)}
        <div class="lesson-section"><h3>10. Summary</h3><ul>${lesson.summary.map((x) => `<li>${escapeHtml(x)}</li>`).join("")}</ul><button class="button" data-action="next-lesson" data-id="${lesson.id}">Next lesson →</button></div></div>` : ""}
      </article></div>`;
  }

  function renderGame() {
    const game = GAME.getState();
    const today = GAME.quests(new Date(), {
      dueReviews: noteRecords.filter((item) => item.flashcard && item.flashcard.dueAt <= new Date().toISOString()).length,
      weakAreas: progress.missed.map((id) => lessonById(id).title)
    });
    const unlocked = game.achievements.length;
    const cosmetics = GAME.cosmetics();
    const maxXP = game.nextRank ? game.nextRank.xp : null;
    return `    <div class="hero-row"><div class="hero-copy"><div class="eyebrow game-only">Tidelight Relay · Command Center</div><h1>Relay map &amp; quests</h1><p>${game.mode === "game" ? "Keep the harbor lights connected by practicing real, evidence-checked skills." : "Plain Mode is on. Learning tools remain available; switch to Game Mode to show story and rewards."}</p></div><div class="form-row"><button class="button primary" data-action="toggle-game-mode">${game.mode === "game" ? "Switch to Plain Mode" : "Switch to Game Mode"}</button><button class="button game-only" data-action="export-player-card">Export player card JSON</button></div></div>
      <div class="game-only stats-grid"><article class="stat-card"><div class="stat-label">Operator rank</div><div class="stat-value">${escapeHtml(game.rank)}</div><div class="stat-note">Ranks measure game progress, not skill or exam readiness.</div></article><article class="stat-card"><div class="stat-label">Learning XP</div><div class="stat-value">${game.xp}</div><div class="stat-note">${maxXP ? `${maxXP - game.xp} XP to ${escapeHtml(game.nextRank.name)}` : "Top rank reached"}</div></article><article class="stat-card"><div class="stat-label">Achievements</div><div class="stat-value">${unlocked}<small style="font-size:13px;color:var(--muted)"> / ${GAME.achievements().length}</small></div><div class="stat-note">Cosmetic recognition only.</div></article><article class="stat-card"><div class="stat-label">Field Journal</div><div class="stat-value">${noteRecords.filter((item) => item.text && item.text.trim()).length}</div><div class="stat-note">Notes stay in this browser.</div></article></div>
      <section class="card game-only"><div class="section-heading"><h2>Today's Plan</h2><span class="tag">Local · deterministic · no streak loss</span></div><p class="small muted">Pick a short activity or a deeper session. Quests only count when the related local learning action is recorded.</p>${today.map((quest) => `<div class="game-quest"><div><strong>${escapeHtml(quest.title)}</strong><p class="small muted">${escapeHtml(quest.detail)}</p></div>${quest.completed ? `<span class="tag">Complete</span>` : quest.type === "mission" ? `<button class="button" data-view="labs">Go to labs</button>` : quest.type === "review" ? `<button class="button" data-view="notes">Open reviews</button>` : quest.type === "note" ? `<button class="button" data-action="quick-note">Write note</button>` : `<button class="button" data-view="terminal">Open terminal</button>`}${!quest.completed && GAME.questEligible(quest.id, { evidenceRecords: progress.evidenceRecords, notes: noteRecords }) ? `<button class="button primary" data-action="claim-quest" data-id="${quest.id}">Complete quest</button>` : ""}</div>`).join("")}<div class="form-row"><button class="button" data-action="quick-session">Quick 10 minutes</button><button class="button" data-action="deep-session">Deep session</button></div></section>
      <div class="section-heading game-only"><h2>Regions</h2><span class="tag">Navigation only; no learning content is locked</span></div><div class="game-map game-only">${DATA.modules.map((track) => { const total = track.lessonIds.length; const done = completedCount(track); return `<article class="game-region"><span class="tag">Region ${track.id} · ${done}/${total} briefings</span><h3>${escapeHtml(track.title)}</h3><p class="small muted">${track.weight ? `${track.weight}% CKA domain` : "Preparation region"} · ${pct(done, total)}% explored</p><button class="button" data-action="open-module" data-id="${track.id}">Enter region</button></article>`; }).join("")}</div>
      <div class="section-heading game-only"><h2>Collection &amp; trophy room</h2><span class="tag">${unlocked} discovered</span></div><div class="achievement-grid game-only">${GAME.achievements().map((item) => `<article class="achievement-card ${item.unlocked ? "" : "locked"}"><strong>${item.unlocked ? "✦ " : "◇ "}${escapeHtml(item.name)}</strong><small>${item.unlocked ? escapeHtml(item.description) : `${escapeHtml(item.category)} achievement · keep practicing to discover it.`}</small></article>`).join("")}</div>
      <div class="section-heading game-only"><h2>Cosmetics</h2></div><div class="card game-only">${cosmetics.map((item) => `<span class="tag" style="margin:3px">${item.unlocked ? "Unlocked" : `Unlock at ${item.xp} XP`} · ${escapeHtml(item.name)}</span>`).join("")}<p class="small muted">Cosmetics have no effect on learning or exam readiness. XP comes only from learning actions; low-effort rewards have daily caps.</p></div>
      <div class="callout warning" style="margin-top:16px">This is a progress dashboard, not a credential or readiness assessment. No complete game map, boss-capstone suite, arcade games, ghost races, sound, or friend challenges are implemented yet. The simulator remains a bounded teaching model.</div>`;
  }

  function terminalWindow(compact) {
    return `<div class="terminal-window"><div class="terminal-titlebar"><i class="terminal-dot"></i><i class="terminal-dot"></i><i class="terminal-dot"></i><span>student@cluster — ${escapeHtml(SIM.context)}</span><span>simulated shell</span></div><pre id="terminal-output" class="terminal-output">${escapeHtml(terminalOutput)}</pre><form class="terminal-form" id="terminal-form"><span class="terminal-prompt">${escapeHtml(SIM.context)} $</span><input id="terminal-input" aria-label="Terminal command" autocomplete="off" spellcheck="false" placeholder="Type a command, e.g. kubectl get pods"><button>Run</button></form></div>${compact ? "" : `<p class="muted small">Tab completes selected kubectl resource names; ↑ recalls a previous command. Commands that are not emulated return an explicit notice and do not silently succeed.</p>`}`;
  }

  function renderTerminal() {
    return `<div class="hero-row"><div class="hero-copy"><div class="eyebrow">Hands-on command practice</div><h1>Practice terminal</h1><p>Type supported commands against an isolated, simulated cluster. State changes are temporary and reset when you clear the simulator.</p></div><button class="button danger" data-action="reset-simulator">Reset all clusters</button></div>
      <div class="callout warning" style="margin-bottom:14px">Not a real shell or cluster. Node commands, Kubernetes output, controllers, and state transitions are simplified. Use the Command Coverage reference to see exact limits.</div>${terminalWindow(false)}
      <div class="section-heading"><h2>Try a command</h2><span class="tag">Context: ${escapeHtml(SIM.context)}</span></div><div class="card"><div class="form-row">${["kubectl get nodes -o wide", "kubectl get pods -A", "kubectl create deployment demo --image=nginx", "kubectl scale deployment/demo --replicas=3", "kubectl config use-context staging"].map((command) => `<button class="button" data-action="run-command" data-command="${encodeURIComponent(command)}">${escapeHtml(command)}</button>`).join("")}</div></div>`;
  }

  function renderLabs() {
    const tasks = SIM.checks();
    return `<div class="hero-row"><div class="hero-copy"><div class="eyebrow">State-based grading</div><h1>Labs &amp; troubleshooting</h1><p>Each supported lab checks the simulated cluster's final state, not a preferred command sequence. Partial credit is shown per assertion.</p></div><button class="button" data-view="terminal">Open terminal ↗</button></div>
      <div class="callout warning" style="margin-bottom:16px">The fault library below contains 40 diagnosis drills (symptom + evidence + likely cause), not 40 independently running broken virtual clusters. Those drills teach investigation; stateful repair is currently implemented only for the listed command/lab coverage.</div>
      <div class="lab-grid">${tasks.map((task) => {
        const result = progress.labRuns[task.id];
        const attempts = progress.evidenceRecords.filter((item) => item.labId === task.id).length;
        return `<article class="card lab-card"><span class="tag">${escapeHtml(task.namespace)} · ${task.weight} pts</span><h3>${escapeHtml(task.title)}</h3><p>${escapeHtml(task.description)}</p><p class="small muted">${attempts} recorded attempt${attempts === 1 ? "" : "s"} · passed evidence ${progress.evidenceRecords.filter((item) => item.labId === task.id && item.passed && item.eligible !== false).length}</p>${result ? `<p class="small" style="color:${result.passed ? "var(--accent)" : "var(--yellow)"}">${result.passed ? "Passed" : "Needs work"} · ${result.score}% · ${fmtDate(result.date)}</p>` : ""}<button class="button ${selectedLab === task.id ? "primary" : ""}" data-action="select-lab" data-id="${task.id}">${selectedLab === task.id ? "Selected" : "Open lab"}</button>${selectedLab === task.id ? `<div class="hint-panel"><details data-lab-hint><summary>Level 1 · Where would you look?</summary><p>${escapeHtml(task.hint)}</p></details><details data-lab-hint><summary>Level 2 · Narrow the hypothesis</summary><p>${escapeHtml(task.strongerHint)}</p></details><p class="small muted">Track ${escapeHtml(moduleById(labTrackId(task.id)).title)}. If you reveal the model solution, reset the task and solve it independently to create eligible evidence.</p><div class="form-row" style="margin-top:10px"><button class="button" data-action="grade-lab" data-id="${task.id}">Grade final state</button><button class="button" data-action="show-solution" data-id="${task.id}">I'm stuck, show me the solution</button><button class="button quiet" data-action="reset-simulator">Reset cluster</button>${result && !result.passed ? `<button class="button" data-action="learned-lab" data-id="${task.id}">Add failed lab to notes</button>` : ""}</div><ul class="assertion-list" id="lab-assertions">${result ? result.assertions.map((a) => `<li class="${a.pass ? "pass" : ""}">${escapeHtml(a.label)} — ${a.pass ? "passed" : "not met"}</li>`).join("") : ""}</ul></div>` : ""}</article>`;
      }).join("")}</div>
      <div class="section-heading"><h2>40 troubleshooting diagnosis drills</h2><span class="tag">Symptom → evidence → hypothesis</span></div><input class="reference-search" id="fault-search" placeholder="Filter fault scenarios by symptom, domain, or evidence…"><div id="fault-list" class="reference-grid">${renderFaults(DATA.faults)}</div>`;
  }
  function renderFaults(faults) {
    return faults.map((fault, index) => {
      index = DATA.faults.indexOf(fault);
      const answer = faultAnswers[index];
      const options = [fault.cause, ...DATA.faults.filter((other) => other.cause !== fault.cause && other.domain === fault.domain).slice(0, 3).map((other) => other.cause)];
      const unique = [...new Set(options)];
      return `<article class="card"><span class="tag">${escapeHtml(fault.domain)} · Drill ${String(index + 1).padStart(2, "0")}</span><h3 style="margin-top:9px">${escapeHtml(fault.symptom)}</h3><p><strong>Evidence:</strong> ${escapeHtml(fault.evidence)}</p><p class="small muted">Next check: ${escapeHtml(fault.next)}</p><label class="field">Most likely cause<select data-action="fault-answer" data-index="${index}"><option value="">Choose diagnosis…</option>${unique.map((option) => `<option ${answer ? answer.value === option ? "selected" : "" : ""} value="${escapeHtml(option)}">${escapeHtml(option)}</option>`).join("")}</select></label>${answer ? `<p class="small" style="color:${answer.correct ? "var(--accent)" : "var(--yellow)"}">${answer.correct ? "Correct diagnosis." : "Not quite. "} ${escapeHtml(fault.cause)}</p>` : ""}</article>`;
    }).join("");
  }

  function makeExamTask(examIndex, index) {
    const types = ["deployment", "configmap", "service", "node-label", "image-update", "context"];
    const type = types[(index + examIndex) % types.length];
    const context = ["training", "staging", "production"][(index + examIndex) % 3];
    const base = `m${examIndex + 1}-${String(index + 1).padStart(2, "0")}`;
    const common = { id: base, index: index + 1, context, checked: false, assertions: [], timeSpent: 0 };
    if (type === "deployment") return { ...common, type, domain: "Workloads & Scheduling", weight: 7, name: `web-${base}`, namespace: "default", image: "nginx:1.27", replicas: 2 + (index % 2), prompt: `In context ${context}, create Deployment web-${base} in default with image nginx:1.27 and ${2 + (index % 2)} ready replicas.` };
    if (type === "configmap") return { ...common, type, domain: "Workloads & Scheduling", weight: 6, name: `settings-${base}`, namespace: "shop", key: "MODE", value: `exam${examIndex + 1}`, prompt: `In context ${context}, create ConfigMap settings-${base} in namespace shop with MODE=exam${examIndex + 1}.` };
    if (type === "service") return { ...common, type, domain: "Services & Networking", weight: 7, name: `api-${base}`, namespace: "shop", image: "nginx:1.27", port: 8080, prompt: `In context ${context}, create Deployment api-${base} in shop with image nginx:1.27 and expose it internally as a ClusterIP Service on port 8080.` };
    if (type === "node-label") return { ...common, type, domain: "Cluster Architecture", weight: 5, name: "worker-b", key: `exam-group-${examIndex + 1}`, value: `set-${index + 1}`, prompt: `In context ${context}, label node worker-b with exam-group-${examIndex + 1}=set-${index + 1}.` };
    if (type === "image-update") return { ...common, type, domain: "Troubleshooting", weight: 7, name: `repair-${base}`, namespace: "shop", image: "nginx:1.28", prompt: `In context ${context}, ensure Deployment repair-${base} exists in shop and uses image nginx:1.28.` };
    return { ...common, type, domain: "Cluster Architecture", weight: 5, prompt: `Switch kubectl to context ${context} and verify it is the active context.` };
  }
  function makeExam(index) {
    return { index, name: `Mock ${String(index + 1).padStart(2, "0")}`, tasks: Array.from({ length: 15 }, (_, i) => makeExamTask(index, i)), startedAt: Date.now(), taskStartedAt: Date.now(), duration: 120 * 60, finished: false, notepad: "" };
  }
  function gradeExamTask(task, snapshot) {
    const cluster = snapshot.clusters[task.context];
    const key = `${task.namespace || "default"}/${task.name}`;
    const assertions = [];
    if (task.type === "deployment") {
      const d = cluster.deployments[key];
      assertions.push({ label: "Deployment exists with requested image", pass: !!d && d.image === task.image }, { label: "Requested replicas are ready", pass: !!d && d.ready === task.replicas && d.replicas === task.replicas });
    } else if (task.type === "configmap") {
      const cm = cluster.configmaps[key];
      assertions.push({ label: "ConfigMap exists in requested namespace", pass: !!cm }, { label: "Required key has requested value", pass: !!cm && cm.data[task.key] === task.value });
    } else if (task.type === "service") {
      const d = cluster.deployments[key], s = cluster.services[key];
      assertions.push({ label: "Deployment uses requested image", pass: !!d && d.image === task.image }, { label: "ClusterIP Service exposes requested port and selects the Deployment", pass: !!s && s.type === "ClusterIP" && s.port === task.port && !!d && s.selector.app === d.name });
    } else if (task.type === "node-label") {
      const node = cluster.nodes.find((item) => item.name === task.name);
      assertions.push({ label: "Node has the required label", pass: !!node && node.labels[task.key] === task.value });
    } else if (task.type === "image-update") {
      const d = cluster.deployments[key];
      assertions.push({ label: "Deployment exists with corrected image", pass: !!d && d.image === task.image });
    } else {
      assertions.push({ label: "Requested context was active when task was checked", pass: snapshot.currentContext === task.context });
    }
    return assertions;
  }
  function gradeActiveExamTask() {
    if (!exam || exam.finished) return;
    const task = exam.tasks[examTaskIndex];
    task.assertions = gradeExamTask(task, SIM.snapshot());
    task.checked = true;
    persistExam();
    render();
    toast(`${task.assertions.filter((x) => x.pass).length}/${task.assertions.length} assertions passed for task ${task.index}.`);
  }
  function examTimeLeft() {
    if (!exam) return 0;
    return Math.max(0, exam.duration - Math.floor((Date.now() - exam.startedAt) / 1000));
  }
  function clock(seconds) {
    const mins = Math.floor(seconds / 60).toString().padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  }
  function finishExam() {
    if (!exam || exam.finished) return;
    recordTaskTime();
    const snapshot = SIM.snapshot();
    exam.tasks.forEach((task) => {
      if (task.type !== "context" || !task.checked) task.assertions = gradeExamTask(task, snapshot);
      task.checked = true;
    });
    exam.finished = true;
    const possible = exam.tasks.reduce((sum, task) => sum + task.weight * task.assertions.length, 0);
    const earned = exam.tasks.reduce((sum, task) => sum + task.weight * task.assertions.filter((item) => item.pass).length, 0);
    const result = {
      exam: exam.name, score: pct(earned, possible), date: new Date().toISOString(),
      timeLeft: clock(examTimeLeft()),
      domains: DATA.modules.filter((item) => item.weight).map((module) => {
        const tasks = exam.tasks.filter((task) => task.domain === module.title);
        const max = tasks.reduce((sum, task) => sum + task.weight * task.assertions.length, 0);
        const got = tasks.reduce((sum, task) => sum + task.weight * task.assertions.filter((x) => x.pass).length, 0);
        return { name: module.title, score: max ? pct(got, max) : null, tasks: tasks.length };
      }),
      missed: exam.tasks.filter((task) => task.assertions.some((x) => !x.pass)).length,
      taskTimes: exam.tasks.map((task) => ({ index: task.index, seconds: Math.round(task.timeSpent / 1000), passed: task.assertions.every((item) => item.pass) }))
    };
    progress.mocks.push(result);
    GAME.emit("mock-completed", {
      eventId: `mock-${result.exam}-${result.date}`,
      score: result.score,
      mockCount: progress.mocks.length,
      at: result.date
    });
    GAME.emit("mock-completed", {
      eventId: `mock-${result.exam}-${result.date}`,
      score: result.score,
      mockCount: progress.mocks.length,
      at: result.date
    });
    progress.activeExam = null;
    progress.activeExamTaskIndex = 0;
    saveProgress();
    render();
    toast(`Mock complete: ${result.score}%`);
  }
  function renderExam() {
    if (!exam) return `<div class="hero-row"><div class="hero-copy"><div class="eyebrow">Timed hands-on practice</div><h1>Mock exams</h1><p>Six unique 15-task exams. Each task includes a final-state rubric and draws on the simulator's honest command coverage. The real exam's number and weighting of tasks can vary.</p></div></div>
      <div class="callout warning" style="margin-bottom:15px">This mock mode is 120 minutes and uses weighted simulated tasks. It is not an exact recreation of the official exam environment, complete task bank, or grading system.</div><div class="exam-grid">${Array.from({ length: 6 }, (_, index) => `<article class="card exam-card"><span class="tag">2 hours · 15 tasks</span><h3>${`Mock ${String(index + 1).padStart(2, "0")}`}</h3><p>Variant ${index + 1} · Context switches, workload tasks, configuration, node operations, and Services.</p><button class="button primary" data-action="start-exam" data-id="${index}">Start timed mock</button></article>`).join("")}</div>
      <div class="section-heading"><h2>Recent results</h2></div>${progress.mocks.length ? `<table class="table"><thead><tr><th>Exam</th><th>Score</th><th>Time left</th><th>Missed tasks</th></tr></thead><tbody>${progress.mocks.slice().reverse().slice(0, 8).map((item) => `<tr><td>${escapeHtml(item.exam)}</td><td>${item.score}%</td><td>${escapeHtml(item.timeLeft)}</td><td>${item.missed}</td></tr>`).join("")}</tbody></table>` : `<div class="card empty-state">No mock results yet.</div>`}`;
    const task = exam.tasks[examTaskIndex];
    const complete = exam.tasks.filter((item) => item.checked).length;
    const timeLeft = examTimeLeft();
    return `<div class="hero-row"><div class="hero-copy"><div class="eyebrow">${exam.name} · ${complete}/15 tasks checked</div><h1>Timed mock exam</h1><p>No hints. Use the practice terminal and final-state checks. Navigate and flag tasks; use the notepad for context or follow-up.</p></div><div class="timer" id="exam-timer">${clock(timeLeft)}</div></div>
      ${exam.finished ? renderExamReport() : `<div class="exam-toolbar"><button class="button danger" data-action="end-exam">End and score exam</button><button class="button" data-action="flag-task" data-id="${examTaskIndex}">${task.flagged ? "⚑ Flagged" : "⚐ Flag for review"}</button><span class="tag">Target context: ${escapeHtml(task.context)}</span><span class="tag">Weight ${task.weight}</span></div>
      <div class="exam-layout"><div><article class="card"><div class="eyebrow">Task ${task.index} · ${escapeHtml(task.domain)}</div><h2 style="margin-top:10px">${escapeHtml(task.prompt)}</h2><p class="muted small">Make the requested change in the simulator. This exam has no hints. Task is graded against its final cluster state.</p><button class="button primary" data-action="grade-exam-task">Check task state</button>${task.checked ? `<ul class="assertion-list">${task.assertions.map((x) => `<li class="${x.pass ? "pass" : ""}">${escapeHtml(x.label)} — ${x.pass ? "passed" : "not met"}</li>`).join("")}</ul>` : ""}</article><div class="section-heading"><h2>Practice terminal</h2><span class="tag">${escapeHtml(SIM.context)}</span></div>${terminalWindow(true)}<label class="field" style="margin-top:12px">Persistent notepad<textarea id="exam-notepad" rows="4" style="background:#0d1624;color:var(--text);border:1px solid var(--line);border-radius:7px;padding:10px">${escapeHtml(exam.notepad)}</textarea></label></div>
      <aside class="card"><h3>Question navigator</h3><div class="task-nav">${exam.tasks.map((item, index) => `<button class="${item.checked ? "done" : ""} ${item.flagged ? "flagged" : ""}" data-action="go-exam-task" data-id="${index}" aria-label="Task ${index + 1}">${index + 1}${item.flagged ? " ⚑" : ""}</button>`).join("")}</div><p class="small muted" style="margin-top:12px">Green: checked · Gold: flagged</p><button class="button primary" style="width:100%;margin-top:9px" data-action="end-exam">Finish and score</button></aside></div>`}`;
  }
  function renderExamReport() {
    const latest = progress.mocks[progress.mocks.length - 1];
    const recent = progress.mocks.slice(-3);
    const ready = recent.length === 3 && recent.every((item) => item.score >= 76 && item.timeLeft !== "00:00");
    const weak = latest ? latest.domains.filter((item) => item.tasks && item.score < 75) : [];
    const slowest = latest ? (latest.taskTimes || []).slice().sort((a, b) => b.seconds - a.seconds).slice(0, 3) : [];
    const missedByDomain = latest ? latest.domains.filter((item) => item.tasks).map((item) => ({ ...item, missed: exam.tasks.filter((task) => task.domain === item.name && task.assertions.some((assertion) => !assertion.pass)).length })) : [];
    return `<div class="dashboard-grid"><section class="card"><div class="eyebrow">Exam report</div><h2 style="margin-top:10px">${latest ? latest.score : 0}% · ${latest && latest.score >= 66 ? "Passing mark reached" : "Below passing mark"}</h2><p class="muted">Official passing score: 66%. This study tool's mock score is not a prediction or guarantee. Storage is not tested in this mock bank.</p><div class="domain-list">${latest ? latest.domains.map((item) => `<div class="domain-row"><strong>${escapeHtml(item.name)}</strong><div class="progress-track"><div class="progress-fill" style="width:${item.score == null ? 0 : item.score}%"></div></div><span class="domain-weight">${item.score == null ? "Not tested" : `${item.score}% · ${item.tasks} tasks`}</span></div>`).join("") : ""}</div><h3 style="margin-top:18px">Missed tasks by domain</h3><p class="small muted">${missedByDomain.map((item) => `${escapeHtml(item.name)}: ${item.missed} missed`).join(" · ")}</p><h3>Tasks taking the most time</h3><p class="small muted">${slowest.map((item) => `Task ${item.index}: ${item.seconds}s`).join(" · ") || "No timing data"}</p></section><aside class="card"><h3>Readiness gate</h3><p class="small muted">${ready ? "You've met the suggested three consecutive mocks at 76%+ with time remaining." : "Recommendation: three consecutive mocks at 76% or higher, finishing with time to spare. This is a study target, not a guarantee."}</p><h3>Suggested review</h3>${weak.length ? weak.map((item) => {
      const lesson = DATA.lessons.find((itemLesson) => itemLesson.domain === item.name);
      return `<p class="small">${escapeHtml(item.name)} (${item.score}%)${lesson ? ` · <button class="button quiet" data-action="open-lesson" data-id="${lesson.id}">Review lesson</button>` : ""}</p>`;
    }).join("") : `<p class="small muted">Review any unchecked assertions and repeat with another scenario.</p>`}<button class="button" data-action="back-exams">Back to mock exams</button></aside></div><div class="section-heading"><h2>Task review</h2></div><div class="module-list">${exam.tasks.map((task) => `<article class="card"><span class="tag">${escapeHtml(task.domain)} · ${task.weight} pts · ${Math.round(task.timeSpent / 1000)} sec</span><h3 style="margin-top:8px">Task ${task.index}: ${escapeHtml(task.prompt)}</h3><ul class="assertion-list">${task.assertions.map((item) => `<li class="${item.pass ? "pass" : ""}">${escapeHtml(item.label)} — ${item.pass ? "passed" : "not met"}</li>`).join("")}</ul>${task.assertions.some((item) => !item.pass) ? `<button class="button" data-action="learned-exam" data-id="${encodeURIComponent(task.prompt)}" data-domain="${encodeURIComponent(task.domain)}" data-missed="${encodeURIComponent(task.assertions.filter((item) => !item.pass).map((item) => item.label).join("; "))}">Add missed task to notes</button>` : ""}</article>`).join("")}</div>`;
  }

  function renderReference() {
    return `<div class="hero-row"><div class="hero-copy"><div class="eyebrow">Local reference</div><h1>Reference library</h1><p>Search bundled concepts, YAML guidance, troubleshooting flow, and command coverage. This is a study aid, not an external docs browser.</p></div></div>
      <div class="reference-grid"><article class="card"><h3>Command cheat sheets</h3>${DATA.cheats.map((sheet) => `<details class="hint-panel"><summary>${escapeHtml(sheet.title)}</summary><pre>${escapeHtml(sheet.lines.join("\n"))}</pre><button class="button" data-action="copy" data-copy="${encodeURIComponent(sheet.lines.join("\n"))}">Copy</button></details>`).join("")}</article><article class="card"><h3>Exam-day checklist</h3><ul class="small muted"><li>Read the current handbook and allowed-resource rules.</li><li>Confirm context and namespace before every task.</li><li>Read all requested fields before creating a resource.</li><li>Check final state, readiness, selectors, and events.</li><li>Leave time for a final verification pass.</li></ul></article></div>
      <div class="section-heading"><h2>Docs Navigator</h2><span class="tag">${DATA.reference.length} bundled lookup cards</span></div><input class="reference-search" id="reference-search" placeholder="Try: add a toleration, expose a Deployment, why PVC Pending…"><div id="reference-list" class="card">${renderReferenceItems(DATA.reference)}</div>
      <div class="section-heading"><h2>YAML field and template library</h2></div><div class="reference-grid">${[
        ["Pod", "apiVersion: v1\\nkind: Pod\\nmetadata:\\n  name: demo\\n  labels:\\n    app: demo\\nspec:\\n  containers:\\n  - name: web\\n    image: nginx:1.27"],
        ["Deployment", "apiVersion: apps/v1\\nkind: Deployment\\nmetadata:\\n  name: demo\\nspec:\\n  replicas: 2\\n  selector:\\n    matchLabels:\\n      app: demo\\n  template:\\n    metadata:\\n      labels:\\n        app: demo\\n    spec:\\n      containers:\\n      - name: web\\n        image: nginx:1.27"],
        ["Service", "apiVersion: v1\\nkind: Service\\nmetadata:\\n  name: demo\\nspec:\\n  selector:\\n    app: demo\\n  ports:\\n  - port: 80\\n    targetPort: 8080\\n  type: ClusterIP"],
        ["PersistentVolumeClaim", "apiVersion: v1\\nkind: PersistentVolumeClaim\\nmetadata:\\n  name: data\\nspec:\\n  accessModes:\\n  - ReadWriteOnce\\n  resources:\\n    requests:\\n      storage: 5Gi"]
      ].map(([title, body]) => `<article class="card"><h3>${title}</h3><pre>${escapeHtml(body.replace(/\\n/g, "\n"))}</pre><button class="button" data-action="copy" data-copy="${encodeURIComponent(body.replace(/\\n/g, "\n"))}">Copy YAML</button></article>`).join("")}</div>
      <div class="section-heading"><h2>Command Coverage</h2><button class="button" data-action="coverage">Show full coverage</button></div><div class="card" id="coverage-panel" hidden>${coverageHtml()}</div>`;
  }

  function careerEdit(key, fallback) {
    return progress.career.edits[key] == null ? fallback : progress.career.edits[key];
  }
  function renderCareer() {
    const kit = window.CKA_CAREER.build(DATA, progress);
    const trackId = DATA.modules.some((item) => item.id === careerTrackId) ? careerTrackId : DATA.modules[0].id;
    const track = DATA.modules.find((item) => item.id === trackId);
    const state = kit.tracks.find((item) => item.id === trackId);
    const bullets = kit.bullets.find((item) => item.track.id === trackId).bullets;
    const questions = window.CKA_CAREER.interviewQuestions(track, DATA);
    if (state.evidence.length && !state.evidence.some((item) => item.id === progress.career.activeEvidence)) progress.career.activeEvidence = state.evidence[0].id;
    const trackAttempts = progress.evidenceRecords.filter((item) => item.evidenceType === "lab" && Number(item.trackId) === trackId && !item.passed);
    const storedRating = Number(progress.career.ratings[selectedInterviewId] || 0);
    const relevantFaults = DATA.faults.filter((item) => item.domain === track.title || (trackId === 5 && /troubleshoot|node|service|crash|dns|storage/i.test(item.symptom + item.domain))).slice(0, 8);
    const trackNotes = noteRecords.filter((item) => Number(item.trackId) === trackId);
    const trackCompletion = progress.trackCompletions.find((item) => item.id === trackId);
    const resumeBullets = kit.bullets.flatMap((item) => item.bullets);
    const skillsText = kit.skills.map((item) => item.name).join(" · ");
    const resumeDraft = [
      "KUBERNETES LAB EXPERIENCE",
      ...resumeBullets.map((item) => `• ${careerEdit(`bullet:${item.id}`, item.text)}`),
      skillsText ? `Skills demonstrated in passed simulated labs: ${skillsText}` : ""
    ].filter(Boolean).join("\n");
    const writeup = [
      `# ${track.title} — simulated Kubernetes study project`,
      "",
      "## Objective",
      `Practice concepts in ${track.title} using the offline ClusterCraft study simulator.`,
      "",
      "## Verified work",
      ...state.evidence.flatMap((record) => [`- ${record.labTitle || record.labId}: ${record.score}% of final-state checks passed on ${fmtDate(record.date.slice(0, 10))}.`, ...(record.assertions || []).filter((item) => item.pass).map((item) => `  - Verified: ${item.label}.`), ...(record.commands && record.commands.length ? [`  - Commands entered: ${record.commands.join("; ")}`] : [])]),
      "",
      "## What I learned",
      ...trackNotes.map((note) => `- ${note.text || note.quote || note.title}`),
      "",
      "## Checks that did not pass yet",
      ...(trackAttempts.flatMap((record) => [`- ${record.labTitle || record.labId}: ${record.score}% on attempt ${record.attempt}.`, ...(record.assertions || []).filter((item) => !item.pass).map((item) => `  - Review: ${item.label}.`)]).length ? trackAttempts.flatMap((record) => [`- ${record.labTitle || record.labId}: ${record.score}% on attempt ${record.attempt}.`, ...(record.assertions || []).filter((item) => !item.pass).map((item) => `  - Review: ${item.label}.`)]) : ["- No failed lab attempts are recorded for this track."]),
      "",
      "All work described here was completed in a simulated training environment; it is not production experience."
    ].join("\n");
    const selection = questions.find((item) => item.id === selectedInterviewId) || questions[0];
    const ratings = (progress.career.ratings || {});
    const activeStory = progress.career.starStories && progress.career.starStories[trackId] && progress.career.starStories[trackId][progress.career.activeEvidence] || {};
    return `<div class="hero-row"><div class="hero-copy"><div class="eyebrow">Honest, evidence-backed drafts · local only</div><h1>Career Kit</h1><p>Turn passed simulated labs and your own notes into editable study-to-career drafts. Nothing is sent anywhere; review every claim before using it.</p></div><button class="button" data-action="export-resume-md">Export resume Markdown</button></div>
      <div class="callout warning">These drafts describe simulated lab practice, not professional production experience. Employers value being able to explain and demonstrate skills. Personalize each draft; do not memorize it as a script.</div>
      <div class="stats-grid" style="margin-top:17px"><article class="stat-card"><div class="stat-label">Passed graded labs</div><div class="stat-value">${kit.passedLabCount}</div><div class="stat-note">Evidence records only</div></article><article class="stat-card"><div class="stat-label">Tracks completed</div><div class="stat-value">${kit.completedTrackCount} / ${DATA.modules.length}</div><div class="stat-note">Every lesson complete and quiz score ≥75%</div></article><article class="stat-card"><div class="stat-label">Average mock score</div><div class="stat-value">${kit.avgMock == null ? "—" : `${kit.avgMock}%`}</div><div class="stat-note">Tracked mock exam results</div></article><article class="stat-card"><div class="stat-label">Interview ratings</div><div class="stat-value">${Object.keys(ratings).length}</div><div class="stat-note">Self-assessed practice attempts</div></article></div>
      <div class="section-heading"><h2>Choose a track</h2><span class="tag">Career Kit unlocks when lessons and quizzes are complete</span></div><div class="track-selector">${kit.tracks.map((item) => `<button class="button ${item.id === trackId ? "primary" : ""}" data-action="career-track" data-id="${item.id}">${item.complete ? "✓ " : ""}${escapeHtml(item.title)} · ${item.completedLessons}/${item.lessonCount}</button>`).join("")}</div>
      ${trackCompletion ? `<div class="callout" style="margin-top:12px"><strong>Track complete.</strong> Completed ${fmtDate(trackCompletion.completedAt.slice(0, 10))}. ${trackNotes.length} of your notes are ready for a recap.</div>` : ""}
      <div class="career-tabs"><button class="button" data-action="career-tab" data-id="dashboard">Dashboard</button><button class="button" data-action="career-tab" data-id="resume">Resume &amp; portfolio</button><button class="button" data-action="career-tab" data-id="interview">Interview practice</button><button class="button" data-action="career-tab" data-id="roles">Role mapping</button></div>
      <section class="career-section"><div class="section-heading"><h2>${escapeHtml(track.title)} Career Kit</h2><span class="tag">${state.complete ? "Unlocked" : `${state.completedLessons}/${state.lessonCount} lessons · quizzes ${state.quizzesPassed ? "passed" : "in progress"}`}</span></div>
      ${!state.complete ? `<div class="card"><p class="muted">Finish every lesson and score at least 75% on each lesson quiz to unlock this track's Career Kit. Resume claims remain hidden unless a relevant graded lab has a passed evidence record.</p>${state.missingLessons.slice(0, 2).map((lessonId) => `<button class="button" data-action="open-lesson" data-id="${lessonId}">Continue: ${escapeHtml(lessonById(lessonId).title)}</button>`).join(" ")}</div>` : `<div class="dashboard-grid"><article class="card"><h3>Evidence-backed resume bullets</h3>${bullets.length ? `<p class="small muted">${bullets.length < 5 ? `Only ${bullets.length} distinct supported bullets are available; complete more relevant graded labs before claiming more.` : `${bullets.length} bullets are supported by passed lab checks.`}</p>${bullets.map((item) => `<div class="career-bullet"><label class="field">${escapeHtml(item.evidence.lab)} · ${fmtDate(item.evidence.date.slice(0, 10))} · ${item.evidence.passed}/${item.evidence.total} checks passed<textarea rows="2" data-career-edit="bullet:${item.id}">${escapeHtml(careerEdit(`bullet:${item.id}`, item.text))}</textarea></label><details><summary>Alternative phrasing (same evidence)</summary>${Object.entries(item.variants).map(([variant, text]) => `<p><strong>${escapeHtml(variant)}:</strong> ${escapeHtml(text)}</p>`).join("")}</details></div>`).join("")}` : `<p class="muted">No passed lab evidence is linked to this track yet. Complete a graded lab; the generator will not invent claims.</p>`}</article><aside class="card"><h3>Track recap</h3><p>${trackNotes.length} personal notes · confusing items appear first in the recap.</p><button class="button" data-action="track-recap" data-id="${trackId}">Open my recap in Smart Notes</button><h3 style="margin-top:20px">Skills evidence</h3>${kit.skills.filter((skill) => skill.evidence.some((item) => Number(item.trackId) === trackId)).map((skill) => `<p class="small">${escapeHtml(skill.name)} · ${skill.evidence.filter((item) => Number(item.trackId) === trackId).length} passed evidence record(s)</p>`).join("") || `<p class="small muted">No skill is listed until a passed lab demonstrates it.</p>`}</aside></div>`}</section>
      <div class="section-heading"><h2>Cumulative resume builder</h2><div class="note-editor-toolbar"><button class="button" data-action="copy-career-text" data-id="resume">Copy text</button><button class="button" data-action="export-resume-txt">Plain text</button><button class="button" data-action="print-career">Print / save PDF</button></div></div><label class="field">Editable resume draft<textarea rows="8" data-career-edit="resume">${escapeHtml(careerEdit("resume", resumeDraft))}</textarea></label><p class="small muted">${resumeBullets.length ? `${resumeBullets.length} distinct evidence-supported statements. ` : "No resume claims yet: complete a graded lab first. "}${kit.skills.length} demonstrated skills; ${kit.passedFaults} correctly diagnosed fault drills are recorded separately.</p>
      <div class="section-heading"><h2>Skills evidence table</h2></div>${kit.skills.length ? `<div class="card table-wrap"><table class="table"><thead><tr><th>Skill</th><th>Passed evidence</th></tr></thead><tbody>${kit.skills.map((skill) => `<tr><td>${escapeHtml(skill.group)} · ${escapeHtml(skill.name)}</td><td>${skill.evidence.map((item) => `${escapeHtml(item.labTitle || item.labId)} — ${fmtDate(item.date.slice(0, 10))}`).join("<br>")}</td></tr>`).join("")}</tbody></table></div>` : `<div class="card empty-state">Passed labs create the evidence used here. No skill claims are generated from lesson completion alone.</div>`}
      <div class="section-heading"><h2>Portfolio write-up · ${escapeHtml(track.title)}</h2><button class="button" data-action="copy-career-text" data-id="portfolio">Copy write-up</button></div><label class="field">Editable project draft<textarea rows="10" data-career-edit="portfolio:${trackId}">${escapeHtml(careerEdit(`portfolio:${trackId}`, writeup))}</textarea></label><button class="button" data-action="export-portfolio" data-id="${trackId}">Export Markdown</button>
      <div class="section-heading"><h2>LinkedIn and summary helpers</h2></div><div class="reference-grid"><label class="field card">Headline<textarea rows="2" data-career-edit="headline">${escapeHtml(careerEdit("headline", kit.headline))}</textarea></label><label class="field card">About section<textarea rows="4" data-career-edit="about">${escapeHtml(careerEdit("about", kit.about))}</textarea></label><label class="field card">30-second elevator pitch<textarea rows="4" data-career-edit="pitch">${escapeHtml(careerEdit("pitch", kit.elevatorPitch))}</textarea></label></div>
      <div class="section-heading"><h2>Interview practice · ${escapeHtml(track.title)}</h2></div><div class="dashboard-grid"><section><label class="field">Filter interview questions<select id="interview-filter"><option value="all">All levels</option><option value="beginner">Beginner</option><option value="intermediate">Intermediate</option><option value="advanced">Advanced</option><option value="struggled">Questions rated 1–2</option></select></label><div class="interview-question-list">${questions.map((item) => `<button class="button interview-question ${item.id === (selection && selection.id) ? "primary" : ""}" data-action="select-interview" data-id="${item.id}" data-track="${track.id}" data-difficulty="${item.difficulty}" data-struggled="${ratings[item.id] && ratings[item.id] <= 2 ? "true" : "false"}">${escapeHtml(item.difficulty)} · ${escapeHtml(item.question)}</button>`).join("")}</div></section><article class="card">${selection ? `<span class="tag">${escapeHtml(selection.kind)} · ${escapeHtml(selection.difficulty)}</span><h3 style="margin-top:10px">${escapeHtml(selection.question)}</h3><textarea rows="5" data-interview-answer="${selection.id}" placeholder="Practice your answer. No automated scoring.">${escapeHtml(progress.career.answers && progress.career.answers[selection.id] || "")}</textarea><details><summary>Reveal model answer and self-check</summary><p><strong>Model answer:</strong> ${escapeHtml(selection.modelAnswer)}</p><p><strong>Testing:</strong> ${escapeHtml(selection.testing)}</p><p><strong>Weak answer to avoid:</strong> ${escapeHtml(selection.weakAnswer)}</p><p><strong>Follow-up:</strong> ${escapeHtml(selection.followUp)}</p><ul>${selection.checklist.map((item) => `<li>Did I mention ${escapeHtml(item)}?</li>`).join("")}</ul></details><label class="field">Self-rate (1 = struggled, 5 = confident)<input type="range" min="1" max="5" value="${storedRating || 3}" data-interview-rating="${selection.id}"><span>${storedRating ? `${storedRating}/5 saved` : "Not rated yet"}</span></label>` : `<p>No interview questions for this track.</p>`}</article></div>
      <div class="section-heading"><h2>Explain it simply</h2></div><div class="reference-grid">${track.lessonIds.map((lessonId) => { const lesson = lessonById(lessonId); return `<details class="card"><summary>Explain ${escapeHtml(lesson.concepts[0])} to a non-technical person</summary><label class="field">Your explanation<textarea rows="3" data-career-edit="explain:${lessonId}" placeholder="Try a short plain-English explanation."></textarea></label><p><strong>Model explanation:</strong> ${escapeHtml(lesson.explanation.split("\n\n")[0])}</p></details>`; }).join("")}</div>
      <div class="section-heading"><h2>Troubleshooting walkthroughs</h2></div><div class="reference-grid">${relevantFaults.slice(0, 4).map((fault, index) => `<details class="card"><summary>Scenario ${index + 1}: ${escapeHtml(fault.symptom)}</summary><p>Talk through: symptom → layer → evidence → hypothesis → smallest safe fix → verification.</p><p><strong>Evidence to seek:</strong> ${escapeHtml(fault.evidence)}</p><p><strong>Suggested next check:</strong> ${escapeHtml(fault.next)}</p><details><summary>Reveal likely cause</summary><p>${escapeHtml(fault.cause)}</p></details><label class="field">Your walkthrough<textarea rows="3" data-career-edit="walkthrough:${trackId}:${index}"></textarea></label></details>`).join("")}</div>
      <div class="section-heading"><h2>STAR story builder</h2></div><div class="card">${state.evidence.length ? `<label class="field">Choose real evidence<select id="star-evidence">${state.evidence.map((item) => `<option value="${item.id}" ${progress.career.activeEvidence === item.id ? "selected" : ""}>${escapeHtml(item.labTitle || item.labId)} · ${fmtDate(item.date.slice(0, 10))}</option>`).join("")}</select></label><div class="star-grid">${["Situation", "Task", "Action", "Result", "What I learned"].map((part) => `<label class="field">${part}<textarea rows="3" data-star-field="${part.toLowerCase()}" data-track="${trackId}" placeholder="Describe your own experience honestly.">${escapeHtml(activeStory[part.toLowerCase()] || "")}</textarea></label>`).join("")}</div><p class="small muted">Use a real study or simulated lab example. Describe it as training work, not production experience.</p>` : `<p class="muted">Complete and pass a graded lab in this track to build a STAR story from real evidence. No fictional experience is prefilled.</p>`}</div>
      <div class="section-heading"><h2>Role mapping and next steps</h2></div><div class="reference-grid">${kit.roles.map((role) => `<article class="card"><h3>${escapeHtml(role.name)} · ${role.score}% practice match</h3><div class="progress-track"><div class="progress-fill" style="width:${role.score}%"></div></div><p class="small muted">${escapeHtml(role.formula)}</p><p class="small">${role.gaps.slice(0, 3).map((gap) => `${escapeHtml(gap.skill)}${gap.lesson ? ` · <button class="button quiet" data-action="open-lesson" data-id="${gap.lesson.id}">Study ${escapeHtml(gap.lesson.title)}</button>` : ""}`).join("<br>") || "All mapped skill tags have passed lab evidence."}</p></article>`).join("")}</div><p class="small muted">${escapeHtml(kit.rolesDisclaimer)}</p>
      <div class="section-heading"><h2>Next steps</h2></div><div class="card">${kit.nextSteps.map((item) => `<p>${escapeHtml(item.text)}${item.lessonId ? ` · <button class="button quiet" data-action="open-lesson" data-id="${item.lessonId}">Open lesson</button>` : ""}</p>`).join("") || `<p>Practice explaining your capstone aloud, then review your evidence and personal notes.</p>`}<p class="small muted">Employers care most about what you can explain and demonstrate. Customize this draft for the role and keep simulated work clearly labeled.</p></div>
      <div class="section-heading"><h2>Certification status (optional)</h2></div><div class="card"><label class="field"><span><input type="checkbox" id="certification-passed" ${progress.career.certificationPassed ? "checked" : ""}> I passed the CKA</span></label><label class="field">Pass date<input type="date" id="certification-date" value="${escapeHtml(progress.career.certificationDate || "")}"></label><label class="field">Credential ID as issued (optional)<input id="certification-id" value="${escapeHtml(progress.career.certificationId || "")}"></label><p class="small muted">${kit.certification ? escapeHtml(kit.certification.wording) : "Certification wording is not shown unless you manually attest to a pass and provide its date. Use the official credential ID and verification details exactly as issued."}</p>${kit.certification ? `<div class="callout"><strong>Post-exam checklist</strong><ul><li>Update your resume and profile with the credential as issued.</li><li>Use the exact official credential ID and verification details.</li><li>Share your portfolio project write-up, clearly labeling simulated lab work.</li></ul>${escapeHtml(kit.certification.wording)} ${progress.career.certificationId ? `Credential ID: ${escapeHtml(progress.career.certificationId)}` : ""}</div>` : ""}</div>`;
  }
  function renderReferenceItems(items) {
    return items.length ? items.map((item) => `<article class="reference-item"><h3>${escapeHtml(item[0])}</h3><p>${escapeHtml(item[1])}</p><button class="button quiet" data-action="open-lesson" data-id="${item[2]}">Home lesson →</button><button class="button quiet" data-action="add-cheat-entry" data-title="${encodeURIComponent(item[0])}" data-text="${encodeURIComponent(item[1])}" data-track="${lessonById(item[2]).module}" data-lesson="${item[2]}">Add to my cheat sheet</button></article>`).join("") : `<div class="empty-state">No matching reference entries.</div>`;
  }
  function coverageHtml() {
    const groups = [
      ["Emulated kubectl", "get (Pods, Deployments, Services, Nodes, Namespaces, ConfigMaps, Secrets, PVC placeholders, Events; Pods support -o wide only), create (Namespace, Deployment, ConfigMap, Secret, Pod), run, scale, set image, rollout status/history/undo, expose, delete, label/annotate (node and Pod only), taint, cordon, drain, uncordon, describe (Pod, Deployment, Node), logs (sample output), auth can-i (simplified canned authorization), config current-context/get-contexts/use-context, api-resources (sample list), explain (placeholder), wait (Pod Ready and Deployment Available checks), top pods (illustrative fixed metrics)."],
      ["Simulated Linux/node", "pwd, hostname, ls, cat (selected fixtures), grep (selected fixtures), systemctl status and journalctl (sample output), nslookup/dig, ip, ss/netstat (sample output), ssh (three virtual node labels), exit."],
      ["Simulator mechanics", "Three isolated contexts; in-memory namespaces, nodes, Deployments, Pods, Services, ConfigMaps, Secrets, PVC placeholders, events; simple Deployment-to-Pod reconciliation; six state-assertion practice labs; six generated mock exams with fifteen weighted tasks each."],
      ["Not emulated", "Full YAML parsing/apply/patch/edit; JSON, YAML, jsonpath and custom-column serializers; selectors and sort-by semantics; real scheduling/resource accounting; real rollouts and rollback history; exec/curl; vim/nano editing or file mutation; filesystem writes; real node shell; Helm/Kustomize; etcdctl; kubeadm; crictl; service networking, DNS, policy enforcement, storage provisioning; live logs/events; full RBAC model; real API errors/version fidelity."],
      ["Important fidelity note", "Unsupported commands print an explicit simulator message. Sample diagnostic outputs are illustrative, not byte-for-byte Kubernetes outputs. The simulator does not reproduce Kubernetes scheduling, controllers, API validation, security, or cluster failure behavior."]
    ];
    return groups.map(([title, body]) => `<section class="reference-item"><h3>${escapeHtml(title)}</h3><p>${escapeHtml(body)}</p></section>`).join("");
  }

  function renderProgress() {
    const domains = DATA.modules.filter((item) => item.weight);
    const topMissed = [...new Set(progress.missed)].slice(-8);
    const planner = progress.planner || {};
    const remaining = DATA.lessons.filter((item) => !progress.completed.includes(item.id));
    let plan = [];
    if (planner.examDate && planner.hours) {
      const days = Math.max(1, Math.ceil((new Date(planner.examDate + "T12:00:00") - new Date()) / 86400000));
      const slots = Math.max(1, Math.floor(days * Number(planner.hours)));
      plan = Array.from({ length: Math.min(14, slots) }, (_, i) => remaining[i % Math.max(1, remaining.length)] || DATA.lessons[i % DATA.lessons.length]);
    }
    const recent = progress.mocks.slice(-3);
    const ready = recent.length === 3 && recent.every((item) => item.score >= 76 && item.timeLeft !== "00:00");
    const confusingNotes = noteRecords.filter((item) => item.confusing);
    const dueCards = noteRecords.filter((item) => item.flashcard && (!item.flashcard.dueAt || item.flashcard.dueAt <= new Date().toISOString()));
    return `<div class="hero-row"><div class="hero-copy"><div class="eyebrow">Your local study record</div><h1>Progress &amp; planner</h1><p>Track lessons, quiz attempts, lab results, mock exam scores, and speed. Progress is stored locally in this browser; export regular backups.</p></div><button class="button primary" data-action="export-progress">Export progress JSON</button></div>
      <div class="dashboard-grid"><section><div class="section-heading"><h2>Domain readiness</h2></div><div class="card domain-list">${domains.map((module) => `<div><div class="domain-row"><strong>${escapeHtml(module.title)}</strong><div class="progress-track"><div class="progress-fill" style="width:${pct(completedCount(module), module.lessonIds.length)}%"></div></div><span class="domain-weight">${module.weight}% · ${pct(completedCount(module), module.lessonIds.length)}%</span></div><p class="small muted">${completedCount(module)}/${module.lessonIds.length} lessons · average quiz ${Math.round(module.lessonIds.reduce((sum, id) => sum + (quizScoreFor(id) || 0), 0) / module.lessonIds.length)}%</p></div>`).join("")}</div>
        <div class="section-heading"><h2>Mock exam trend</h2></div>${progress.mocks.length ? `<table class="table"><thead><tr><th>Mock</th><th>Score</th><th>Avg task seconds</th><th>Finished with time</th></tr></thead><tbody>${progress.mocks.slice(-10).reverse().map((item) => { const times = (item.taskTimes || []).map((task) => task.seconds); const average = times.length ? Math.round(times.reduce((sum, value) => sum + value, 0) / times.length) : "—"; return `<tr><td>${escapeHtml(item.exam)}</td><td>${item.score}%</td><td>${average}</td><td>${item.timeLeft === "00:00" ? "No" : "Yes"} (${escapeHtml(item.timeLeft)})</td></tr>`; }).join("")}</tbody></table>` : `<div class="card empty-state">Take a mock exam to build your trend.</div>`}
      </section><aside><div class="card"><h3>Am I ready?</h3><p class="small muted">${ready ? "Suggested readiness gate met: three consecutive mocks at 76%+ with time to spare." : "Suggested gate: three consecutive mock scores at least 10 points above 66%, all finished with time remaining."}</p><p class="small muted">This is not a promise of passing. Verify the current exam handbook and assess your confidence honestly.</p></div>
        <div class="section-heading"><h2>Study planner</h2></div><form id="planner-form" class="card" style="display:grid;gap:10px"><label class="field">Exam date<input type="date" name="examDate" value="${escapeHtml(planner.examDate || "")}"></label><label class="field">Study hours per week<input type="number" name="hours" min="1" max="60" value="${escapeHtml(planner.hours || 6)}"></label><button class="button primary">Generate schedule</button></form>
        <div class="section-heading"><h2>Progress backup</h2></div><div class="card"><label class="field">Import a previously exported JSON file<input type="file" id="import-progress" accept="application/json,.json"></label><p class="small muted">Import replaces this browser's saved study history.</p><button class="button danger" data-action="clear-progress">Clear saved progress</button></div>
        <div class="section-heading"><h2>Weak areas</h2></div><div class="card">${topMissed.map((id) => { const lesson = lessonById(id); return `<p class="small">${escapeHtml(lesson.title)} <button class="button quiet" data-action="open-lesson" data-id="${lesson.id}">Review</button></p>`; }).join("")}${confusingNotes.map((note) => `<p class="small">Confusing: ${escapeHtml(note.conceptTags[0] || note.title)} <button class="button quiet" data-action="view-note" data-id="${note.id}">Review note</button></p>`).join("")}${!topMissed.length && !confusingNotes.length ? `<p class="small muted">Missed quizzes and confusing notes appear here after review.</p>` : ""}<p class="small muted">${dueCards.length} personal flashcard${dueCards.length === 1 ? "" : "s"} due for review.</p><button class="button" data-view="notes">Open Smart Notes review queue</button></div></aside></div>
      ${plan.length ? `<div class="section-heading"><h2>Suggested next ${plan.length} study blocks</h2><span class="tag">Generated from remaining lessons</span></div><div class="module-list">${plan.map((lesson, i) => `<article class="module-card" data-action="open-lesson" data-id="${lesson.id}" tabindex="0" role="button"><span class="module-number">${String(i + 1).padStart(2, "0")}</span><div><h3>${escapeHtml(lesson.title)}</h3><p>${escapeHtml(lesson.domain)} · Read lesson, complete its quiz, and do one lab or drill.</p></div><span class="tag">Study block</span></article>`).join("")}</div>` : ""}`;
  }

  function render() {
    document.body.classList.toggle("light-mode", progress.theme === "light");
    document.body.classList.toggle("plain-mode", GAME.getState().mode === "plain");
    const root = document.getElementById("app-view");
    document.getElementById("page-label").textContent = VIEWS[view] || "Overview";
    document.querySelectorAll(".nav-link[data-view]").forEach((item) => item.classList.toggle("active", item.dataset.view === view));
    if (view === "overview") root.innerHTML = renderOverview();
    else if (view === "learn") root.innerHTML = renderLesson();
    else if (view === "terminal") root.innerHTML = renderTerminal();
    else if (view === "labs") root.innerHTML = renderLabs();
    else if (view === "exams") root.innerHTML = renderExam();
    else if (view === "reference") root.innerHTML = renderReference();
    else if (view === "progress") root.innerHTML = renderProgress();
    else if (view === "notes") root.innerHTML = renderNotes();
    else if (view === "career") root.innerHTML = renderCareer();
    else if (view === "game") root.innerHTML = renderGame();
    else { view = "overview"; root.innerHTML = renderOverview(); }
    decorateStudyContent();
    renderNotesDock();
    window.setTimeout(() => {
      const input = document.getElementById("terminal-input");
      if (input && document.activeElement && document.activeElement.id === "terminal-input") input.focus();
    }, 0);
  }

  function decorateStudyContent() {
    const root = document.getElementById("app-view");
    root.querySelectorAll(".lesson-section").forEach((section, index) => {
      if (!section.id) section.id = `lesson-${selectedLesson}-section-${index + 1}`;
    });
    root.querySelectorAll("pre, .code-sample").forEach((block, index) => {
      if (block.dataset.noteDecorated) return;
      block.dataset.noteDecorated = "true";
      const button = document.createElement("button");
      button.className = "button quiet save-block-note";
      button.dataset.action = "save-block-note";
      button.dataset.blockIndex = String(index);
      button.textContent = "Save to notes";
      block.insertAdjacentElement("afterend", button);
    });
    root.querySelectorAll(".reference-item").forEach((entry) => {
      if (entry.querySelector("[data-action='add-cheat-entry']")) return;
      const title = entry.querySelector("h3") && entry.querySelector("h3").textContent;
      const text = entry.querySelector("p") && entry.querySelector("p").textContent;
      if (!title || !text) return;
      const button = document.createElement("button");
      button.className = "button quiet";
      button.dataset.action = "add-cheat-entry";
      button.dataset.title = encodeURIComponent(title);
      button.dataset.text = encodeURIComponent(text);
      button.textContent = "Add to my cheat sheet";
      entry.appendChild(button);
    });
  }

  function setView(next) {
    if (next === "exams" && exam && !exam.finished) {
      view = "exams";
    } else view = VIEWS[next] ? next : "overview";
    render();
    document.getElementById("app-view").focus({ preventScroll: true });
    document.querySelector(".sidebar").classList.remove("open");
  }
  function appendTerminal(line, output) {
    const prompt = `${SIM.context} $ ${line}`;
    terminalOutput += `${terminalOutput.endsWith("\n") ? "" : "\n"}${prompt}\n${output === "\u0000CLEAR" ? "" : output}\n`;
    if (output === "\u0000CLEAR") terminalOutput = "";
  }
  function runCommand(line) {
    const output = SIM.command(line);
    if ((!exam || exam.finished) && !String(output).includes("[simulator]")) {
      GAME.emit("terminal-command", { eventId: `command-${Date.now()}-${SIM.snapshot().history.length}` });
    }
    persistSimulator();
    appendTerminal(line, output);
    terminalHistoryIndex = 0;
    render();
    if (view === "labs") return;
    const input = document.getElementById("terminal-input");
    if (input) input.focus();
  }
  function resetSimulator() {
    SIM.reset();
    persistSimulator();
    terminalOutput = "Simulated clusters reset to their starting state.\n";
    if (selectedLab) {
      selectedLabStartedAt = Date.now();
      selectedLabHintsUsed = 0;
      selectedLabUsedSolution = false;
      selectedLabCommandStart = SIM.snapshot().history.length;
    }
    if (exam && !exam.finished) {
      exam.tasks.forEach((task) => { task.checked = false; task.assertions = []; });
    }
    render();
    toast("All simulated cluster states reset.");
  }
  function selectLab(id) {
    if (selectedLab !== id) {
      selectedLabStartedAt = Date.now();
      selectedLabHintsUsed = 0;
      selectedLabUsedSolution = false;
      selectedLabCommandStart = SIM.snapshot().history.length;
    }
    selectedLab = id;
    render();
  }
  function gradeLab(id) {
    const lab = getLab(id);
    const assertions = lab.grade();
    const score = pct(assertions.filter((item) => item.pass).length, assertions.length);
    const passed = assertions.every((item) => item.pass);
    const skillTags = window.CKA_CAREER.labEvidence[id] || [];
    const trackId = labTrackId(id);
    const date = new Date().toISOString();
    const attempt = progress.evidenceRecords.filter((item) => item.labId === id).length + 1;
    const evidence = {
      id: `${id}-${Date.now()}`,
      labId: id,
      labTitle: lab.title,
      trackId,
      skillTags,
      passed,
      score,
      timeTakenSeconds: Math.max(0, Math.round((Date.now() - selectedLabStartedAt) / 1000)),
      attempt,
      hintUsage: selectedLabHintsUsed,
      date,
      assertions,
      commands: SIM.snapshot().history.slice(selectedLabCommandStart),
      evidenceType: "lab",
      eligible: !selectedLabUsedSolution,
      source: selectedLabUsedSolution ? "model-solution" : "learner"
    };
    progress.evidenceRecords.push(evidence);
    progress.labRuns[id] = { passed, score, date, assertions, attempts: attempt, timeTakenSeconds: evidence.timeTakenSeconds, hintUsage: selectedLabHintsUsed, evidenceId: evidence.id };
    const passedEvidence = progress.evidenceRecords.filter((item) => item.evidenceType === "lab" && item.passed && item.eligible !== false);
    const threeStarCount = passedEvidence.filter((item) => item.score >= 90 && item.hintUsage === 0).length;
    GAME.emit("lab-evidence", {
      eventId: `lab-${evidence.id}`,
      id: evidence.id,
      labId: id,
      passed,
      eligible: evidence.eligible,
      score,
      stars: passed && score >= 90 && selectedLabHintsUsed === 0 ? 3 : passed && score >= 75 ? 2 : passed ? 1 : 0,
      passedCount: new Set(passedEvidence.map((item) => item.labId)).size,
      threeStarCount,
      hintUsage: selectedLabHintsUsed,
      timeTakenSeconds: evidence.timeTakenSeconds,
      skillTags,
      at: date
    });
    saveProgress();
    render();
    toast(`Lab score: ${score}%. ${passed && !selectedLabUsedSolution ? "Passed evidence saved to Career Kit." : selectedLabUsedSolution ? "Solution-assisted runs are excluded from career claims." : "Attempt saved; retry after reviewing the failed checks."}`);
  }
  function runSolution(id) {
    const lab = getLab(id);
    selectedLabUsedSolution = true;
    view = "terminal";
    lab.solution.forEach((command) => appendTerminal(command, SIM.command(command)));
    persistSimulator();
    render();
    toast("Model solution commands ran in the simulated cluster.");
  }
  function startExam(index) {
    SIM.reset();
    persistSimulator();
    exam = makeExam(Number(index));
    examTaskIndex = 0;
    terminalOutput = `Mock ${Number(index) + 1} started. Commands are simulated; see Command Coverage.\n`;
    view = "exams";
    persistExam();
    render();
    toast("120-minute mock started. No hints are available.");
  }
  function recordTaskTime() {
    if (!exam || !exam.taskStartedAt) return;
    const task = exam.tasks[examTaskIndex];
    if (task) task.timeSpent = (task.timeSpent || 0) + Math.max(0, Date.now() - exam.taskStartedAt);
    exam.taskStartedAt = Date.now();
  }
  function submitQuiz(id) {
    const lesson = lessonById(id);
    const questions = quizFor(lesson);
    const state = quizState[id];
    if (!questions.every((_, index) => state.answers[index] !== undefined)) {
      toast("Answer every question before checking.");
      return;
    }
    state.submitted = true;
    const correct = questions.filter((item, index) => item.answer === state.answers[index]).length;
    const score = pct(correct, questions.length);
    const previous = progress.quizScores[id];
    const attemptCount = (previous ? previous.attempts : 0) + 1;
    const best = Math.max(previous ? previous.best : 0, score);
    progress.quizScores[id] = { best, latest: score, attempts: attemptCount };
    GAME.emit("quiz-result", {
      eventId: `quiz-${id}-${attemptCount}`,
      id,
      score,
      isNewBest: !previous || score > previous.best,
      distinctLessons: Object.keys(progress.quizScores).length,
      perfectCount: Object.values(progress.quizScores).filter((item) => item.best === 100).length
    });
    if (score < 100 && !progress.missed.includes(id)) progress.missed.push(id);
    else if (score === 100) progress.missed = progress.missed.filter((missedId) => missedId !== id);
    const completedTracks = saveProgress();
    if (completedTracks.length) careerTrackId = completedTracks[0].id;
    if (completedTracks.length) view = "career";
    render();
    toast(completedTracks.length ? `Track complete: ${moduleById(careerTrackId).title}. Career Kit unlocked.` : `Quiz score: ${score}%`);
  }
  function answerFault(index, value) {
    const fault = DATA.faults[index];
    if (!fault || !value) return;
    faultAnswers[index] = { value, correct: value === fault.cause };
    progress.faultResults[index] = { correct: value === fault.cause, domain: fault.domain, date: new Date().toISOString() };
    if (value === fault.cause) {
      progress.evidenceRecords.push({
        id: `fault-${index}-${Date.now()}`, evidenceType: "drill", labId: `fault-${index}`,
        labTitle: `Fault drill ${index + 1}`, trackId: 5, passed: true, eligible: true,
        skillTags: [], date: new Date().toISOString(), score: 100, assertions: [{ label: "Correctly diagnosed the presented fault", pass: true }]
      });
    }
    saveProgress();
    render();
    const input = document.querySelector(`[data-action="fault-answer"][data-index="${index}"]`);
    if (input) input.focus();
  }
  function updateSearch(query) {
    const box = document.getElementById("search-results");
    const value = query.trim().toLowerCase();
    if (value.length < 2) { box.hidden = true; box.innerHTML = ""; return; }
    const lessons = DATA.lessons.filter((item) => {
      const guide = progress.guidedLessons[item.id];
      return (progress.completed.includes(item.id) || (guide && guide.revealed))
        && `${item.title} ${item.domain} ${item.concepts.join(" ")} ${item.explanation}`.toLowerCase().includes(value);
    }).slice(0, 7);
    const refs = DATA.reference.filter((item) => `${item[0]} ${item[1]}`.toLowerCase().includes(value)).slice(0, 5);
    const notes = noteRecords.filter((item) => [item.title, item.text, item.quote, ...(item.userTags || [])].join(" ").toLowerCase().includes(value)).slice(0, 5);
    const results = [
      ...lessons.map((item) => `<button data-action="open-lesson" data-id="${item.id}"><strong>${escapeHtml(item.title)}</strong><small>Lesson · ${escapeHtml(item.domain)}</small></button>`),
      ...refs.map((item) => `<button data-action="open-reference" data-query="${encodeURIComponent(item[0])}"><strong>${escapeHtml(item[0])}</strong><small>Reference lookup</small></button>`),
      ...notes.map((item) => `<button data-action="view-note" data-id="${item.id}"><strong>${escapeHtml(item.title)}</strong><small>Personal note</small></button>`)
    ];
    box.innerHTML = results.length ? results.join("") : `<div class="empty-state">No local results.</div>`;
    box.hidden = false;
  }
  function updateFilteredReference(query, targetId, data) {
    const node = document.getElementById(targetId);
    if (!node) return;
    const q = query.toLowerCase().trim();
    node.innerHTML = renderReferenceItems(data.filter((item) => !q || `${item[0]} ${item[1]}`.toLowerCase().includes(q)));
  }
  async function importNotes(file) {
    try {
      const parsed = JSON.parse(await file.text());
      const records = Array.isArray(parsed) ? parsed : parsed.notes;
      if (!Array.isArray(records) || records.some((item) => !item || typeof item.id !== "string" || typeof item.text !== "string")) {
        throw new Error("This file is not a ClusterCraft notes backup.");
      }
      noteRecords = records;
      await window.CKA_NOTES.saveAll(noteRecords);
      activeNoteId = noteRecords[0] ? noteRecords[0].id : null;
      render();
      toast(`Imported ${noteRecords.length} notes.`);
    } catch (error) {
      console.error("Notes import failed.", error);
      toast(`Notes import failed: ${error.message}`);
    }
  }
  function addSelectionNoteButton() {
    const selection = window.getSelection();
    const text = selection && selection.toString().trim();
    const root = document.getElementById("app-view");
    if (!text || view !== "learn" || !root.contains(selection.anchorNode)) return;
    const lesson = lessonById(selectedLesson);
    const section = selection.anchorNode.parentElement && selection.anchorNode.parentElement.closest(".lesson-section");
    pendingNoteCapture = {
      quote: text.slice(0, 2000),
      lessonTitle: lesson.title,
      source: {
        ...lessonInfo(lesson.id),
        href: section ? `#${section.id}` : `#lesson-${lesson.id}`,
        section: section ? section.id : "",
        label: `${lesson.title}${section ? ` · ${section.querySelector("h3")?.textContent || "section"}` : ""}`
      }
    };
    let button = document.getElementById("selection-note-button");
    if (!button) {
      button = document.createElement("button");
      button.id = "selection-note-button";
      button.className = "button primary";
      button.dataset.action = "note-selection";
      button.textContent = "Note this";
      document.body.appendChild(button);
    }
    const rect = selection.getRangeAt(0).getBoundingClientRect();
    button.style.left = `${Math.max(8, Math.min(rect.left, window.innerWidth - 120))}px`;
    button.style.top = `${Math.max(8, rect.bottom + 6)}px`;
    button.hidden = false;
  }

  document.addEventListener("click", async (event) => {
    const target = event.target.closest("[data-action], [data-view]");
    if (!target) return;
    if (target.dataset.view) { setView(target.dataset.view); return; }
    const action = target.dataset.action;
    const id = target.dataset.id;
    if (action === "quick-note") {
      const lessonId = target.dataset.lesson || (view === "learn" ? selectedLesson : "");
      const source = lessonId ? lessonInfo(lessonId) : {};
      createNote({ title: lessonId ? `Reflection: ${lessonById(lessonId).title}` : "Quick note", source, type: lessonId ? "reflection" : "note" });
    } else if (action === "note-selection") {
      const capture = pendingNoteCapture;
      pendingNoteCapture = null;
      const button = document.getElementById("selection-note-button");
      if (button) button.remove();
      if (capture) createNote({ title: `Highlight: ${capture.lessonTitle}`, quote: capture.quote, source: capture.source });
    } else if (action === "open-note-source") {
      const lessonId = target.dataset.lesson;
      if (lessonId) {
        selectedLesson = lessonId;
        setView("learn");
        window.setTimeout(() => {
          const anchor = document.getElementById(target.dataset.anchor);
          if (anchor) anchor.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 30);
      }
    } else if (action === "close-notes") { noteOpen = false; renderNotesDock(); }
    else if (action === "view-note") { activeNoteId = id; noteOpen = false; noteFilter = "all"; noteQuery = ""; setView("notes"); }
    else if (action === "select-note") { activeNoteId = id; render(); }
    else if (action === "save-block-note") {
      const block = target.previousElementSibling;
      if (!block) return;
      const section = block.closest(".lesson-section");
      const lesson = view === "learn" ? lessonById(selectedLesson) : null;
      const source = lesson ? { ...lessonInfo(lesson.id), section: section ? section.id : "", href: section ? `#${section.id}` : `#${lesson.id}`, label: lesson.title } : {};
      const title = view === "terminal" || (exam && view === "exams") ? "Practice terminal output" : "Saved code or example";
      createNote({ title, text: `\`\`\`text\n${block.innerText}\n\`\`\``, source });
    } else if (action === "add-cheat-entry") {
      const lessonId = target.dataset.lesson || "";
      addCheatEntry(decodeURIComponent(target.dataset.title || "Reference item"), decodeURIComponent(target.dataset.text || ""), lessonId ? lessonInfo(lessonId) : { trackId: Number(target.dataset.track), domain: "" });
    } else if (action === "toggle-note-flag") {
      const note = noteRecords.find((item) => item.id === id);
      if (!note) return;
      const flag = target.dataset.flag;
      note[flag] = !note[flag];
      persistNote(note);
      render();
      toast(flag === "confusing" && note.confusing ? "Marked confusing; added to Smart Notes review and weak areas." : "Note updated.");
    } else if (action === "delete-note") {
      if (window.confirm("Delete this note permanently from this browser?")) removeNote(id);
    } else if (action === "make-flashcard") {
      const note = noteRecords.find((item) => item.id === id);
      if (!note || !(note.text || note.quote).trim()) { toast("Add note content before creating a flashcard."); return; }
      note.flashcard = { front: note.conceptTags[0] || note.title, back: note.text || note.quote, dueAt: new Date().toISOString(), intervalDays: 0, reviews: 0 };
      persistNote(note); render(); toast("Flashcard added to the spaced-repetition queue.");
    } else if (action === "review-card") reviewFlashcard(noteRecords.find((item) => item.id === id), target.dataset.rating);
    else if (action === "toggle-cornell-view") {
      const note = noteRecords.find((item) => item.id === id);
      if (note) { note.format = note.format === "cornell" ? "markdown" : "cornell"; persistNote(note); render(); }
    } else if (action === "markdown-insert") {
      const textarea = document.getElementById("note-body");
      if (!textarea) return;
      const snippet = target.dataset.value || "";
      const start = textarea.selectionStart, end = textarea.selectionEnd;
      textarea.setRangeText(snippet, start, end, "select");
      textarea.dispatchEvent(new Event("input", { bubbles: true }));
      textarea.focus();
    } else if (action === "cheat-move") {
      const entries = noteRecords.filter((item) => item.cheatSheet).sort((a, b) => (a.order || 0) - (b.order || 0));
      const from = entries.findIndex((item) => item.id === id);
      const to = Math.max(0, Math.min(entries.length - 1, from + Number(target.dataset.direction)));
      if (from >= 0 && from !== to) {
        [entries[from], entries[to]] = [entries[to], entries[from]];
        entries.forEach((item, index) => { item.order = index; });
        persistNotesBatch();
        render();
      }
    } else if (action === "track-recap") openTrackRecap(id);
    else if (action === "career-track") { careerTrackId = Number(id); selectedInterviewId = ""; setView("career"); }
    else if (action === "career-tab") {
      const targets = { dashboard: ".stats-grid", resume: "[data-career-edit='resume']", interview: "#interview-filter", roles: ".career-section" };
      const node = document.querySelector(targets[id] || ".career-section");
      if (node) node.scrollIntoView({ behavior: "smooth", block: "center" });
    } else if (action === "select-interview") { careerTrackId = Number(target.dataset.track); selectedInterviewId = id; setView("career"); }
    else if (action === "learned-quiz") {
      const lesson = lessonById(id);
      const state = quizState[id];
      const details = quizFor(lesson).map((question, index) => state.answers[index] !== question.answer ? `- ${question.question}\n  - Key point: ${question.why}` : "").filter(Boolean).join("\n");
      createLessonsLearnedNote(`Quiz review: ${lesson.title}`, details || "Review the lesson key points and explain them in my own words.", lessonInfo(id));
    } else if (action === "learned-lab") {
      const lab = getLab(id);
      const failures = (progress.labRuns[id] && progress.labRuns[id].assertions || []).filter((item) => !item.pass).map((item) => item.label).join("; ");
      createLessonsLearnedNote(`Lab review: ${lab.title}`, `Failed checks: ${failures || "Review the task requirements and verify final state."}`, { trackId: labTrackId(id), domain: lab.title, concepts: [] });
    } else if (action === "learned-exam") {
      const detail = `Mock task: ${decodeURIComponent(id || "")}\nDomain: ${decodeURIComponent(target.dataset.domain || "")}\nMissed checks: ${decodeURIComponent(target.dataset.missed || "")}`;
      const track = DATA.modules.find((item) => item.title === decodeURIComponent(target.dataset.domain || ""));
      createLessonsLearnedNote("Mock exam lesson learned", detail, track ? { trackId: track.id, domain: track.title, concepts: [], lessonId: track.lessonIds[0] } : {});
    } else if (action === "copy-career-text") {
      const kit = window.CKA_CAREER.build(DATA, progress);
      const text = id === "portfolio" ? careerEdit(`portfolio:${careerTrackId}`, "") : careerEdit("resume", [...kit.bullets.flatMap((item) => item.bullets.map((bullet) => bullet.text)), ...kit.skills.map((item) => `Skill: ${item.name}`)].join("\n"));
      try { await navigator.clipboard.writeText(text); toast("Career draft copied."); }
      catch (error) { console.error("Clipboard copy failed.", error); toast("Copy was blocked. Select the draft and copy it manually."); }
    } else if (action === "export-resume-md") exportResume("md");
    else if (action === "export-resume-txt") exportResume("txt");
    else if (action === "export-portfolio") {
      const track = DATA.modules.find((item) => item.id === Number(id));
      const state = window.CKA_CAREER.build(DATA, progress).tracks.find((item) => item.id === Number(id));
      const notes = noteRecords.filter((item) => Number(item.trackId) === Number(id));
      const content = `# ${track.title} — simulated Kubernetes study project\n\n## Verified lab work\n\n${state.evidence.map((item) => `- ${item.labTitle}: ${item.score}% of checks passed on ${fmtDate(item.date.slice(0, 10))}.\n${(item.assertions || []).filter((assertion) => assertion.pass).map((assertion) => `  - ${assertion.label}`).join("\n")}\n${(item.commands || []).length ? `  - Commands entered: ${item.commands.join("; ")}` : ""}`).join("\n") || "No passed evidence records yet."}\n\n## My study notes\n\n${markdownForNotes(notes) || "No notes saved for this track yet."}\n\nAll described work was completed in a simulated training environment.`;
      downloadFile(`track-${id}-portfolio.md`, content, "text/markdown");
    } else if (action === "print-career") {
      const kit = window.CKA_CAREER.build(DATA, progress);
      printDocument("ClusterCraft Career Kit", `<pre>${escapeHtml(careerEdit("resume", kit.bullets.flatMap((item) => item.bullets.map((bullet) => bullet.text)).join("\n")))}</pre>`);
    } else if (action === "export-notes-md") exportNotesMarkdown();
    else if (action === "export-notes-zip") exportNotesZip();
    else if (action === "export-notes-json") exportNotesJson();
    else if (action === "print-notes") printDocument("My ClusterCraft notes", `<pre>${escapeHtml(markdownForNotes(noteRecords))}</pre>`);
    else if (action === "export-cheatsheet") downloadFile("clustercraft-cheat-sheet.md", markdownForNotes(noteRecords.filter((item) => item.cheatSheet)), "text/markdown");
    else if (action === "print-cheatsheet") printDocument("My ClusterCraft cheat sheet", `<pre>${escapeHtml(markdownForNotes(noteRecords.filter((item) => item.cheatSheet)))}</pre>`);
    else if (action === "open-lesson") { selectedLesson = id; setView("learn"); }
    else if (action === "open-module") {
      const module = moduleById(id);
      if (module) { selectedLesson = module.lessonIds[0]; setView("learn"); }
    } else if (action === "complete-lesson") {
      if (!progress.completed.includes(id) && !(progress.guidedLessons[id] && progress.guidedLessons[id].revealed)) {
        toast("Make a prediction first, or choose Explain first and then commit your answer.");
        return;
      }
      if (!progress.completed.includes(id)) {
        progress.completed.push(id);
        GAME.emit("lesson-completed", {
          eventId: `lesson-${id}`,
          id,
          completedCount: progress.completed.length,
          totalLessons: DATA.lessons.length
        });
      }
      const completedTracks = saveProgress();
      if (completedTracks.length) { careerTrackId = completedTracks[0].id; view = "career"; }
      render();
      toast(completedTracks.length ? `Track complete: ${moduleById(careerTrackId).title}. Career Kit unlocked.` : "Lesson completion saved locally.");
    } else if (action === "next-lesson") {
      const index = DATA.lessons.findIndex((item) => item.id === id);
      selectedLesson = DATA.lessons[(index + 1) % DATA.lessons.length].id; render();
    } else if (action === "guided-commit") {
      const selected = Array.from(document.getElementsByName(`guided-${id}`)).find((input) => input.checked);
      if (!selected) { toast("Choose a prediction before revealing the key idea."); return; }
      const guide = progress.guidedLessons[id] || {};
      guide.answer = Number(selected.value);
      guide.confidence = document.getElementById("guided-confidence").value;
      guide.revealed = true;
      guide.committedAt = new Date().toISOString();
      guide.attempts = (guide.attempts || 0) + 1;
      progress.guidedLessons[id] = guide;
      GAME.emit("confidence-recorded", { eventId: `confidence-${id}-${guide.attempts}`, id });
      saveProgress();
      render();
      toast("Prediction recorded. Compare your reasoning with the evidence.");
    } else if (action === "guided-explain-first") {
      const guide = progress.guidedLessons[id] || {};
      guide.explainFirst = !guide.explainFirst;
      progress.guidedLessons[id] = guide;
      saveProgress();
      render();
    } else if (action === "guided-retry") {
      const guide = progress.guidedLessons[id] || {};
      guide.revealed = false;
      guide.explainFirst = false;
      delete guide.answer;
      progress.guidedLessons[id] = guide;
      saveProgress();
      render();
    } else if (action === "quick-learn") {
      quickLearn = !quickLearn;
      render();
    } else if (action === "toggle-game-mode") {
      const mode = GAME.getState().mode === "game" ? "plain" : "game";
      GAME.setMode(mode);
      render();
      toast(mode === "plain" ? "Plain Mode hides story and reward presentation; all study tools stay open." : "Game Mode presentation restored.");
    } else if (action === "export-player-card") {
      const state = GAME.getState();
      const card = {
        type: "ClusterCraft local progress card",
        generatedAt: new Date().toISOString(),
        rank: state.rank,
        learningXP: state.xp,
        regions: DATA.modules.map((track) => ({ name: track.title, completedBriefings: completedCount(track), totalBriefings: track.lessonIds.length })),
        badges: GAME.achievements().filter((item) => item.unlocked).map((item) => item.name),
        disclaimer: "Progress summary only; not a certification, credential, or proof of professional experience."
      };
      downloadFile("clustercraft-player-card.json", JSON.stringify(card, null, 2), "application/json");
    } else if (action === "claim-quest") {
      if (!GAME.questEligible(id, { evidenceRecords: progress.evidenceRecords, notes: noteRecords })) {
        toast("That quest needs its matching learning action before it can be completed.");
        return;
      }
      GAME.completeQuest(id);
      render();
      toast("Quest completed. Nice work.");
    } else if (action === "quick-session") {
      const due = noteRecords.find((item) => item.flashcard && item.flashcard.dueAt <= new Date().toISOString());
      if (due) { activeNoteId = due.id; setView("notes"); }
      else { selectedLesson = DATA.lessons.find((item) => !progress.completed.includes(item.id))?.id || DATA.lessons[0].id; setView("learn"); }
    } else if (action === "deep-session") {
      setView("learn");
    } else if (action === "quiz-answer") {
      const lesson = target.dataset.lesson; const q = Number(target.dataset.question);
      quizState[lesson] = quizState[lesson] || { answers: {}, submitted: false };
      quizState[lesson].answers[q] = Number(target.value);
    } else if (action === "submit-quiz") submitQuiz(id);
    else if (action === "retry-quiz") { quizState[id] = { answers: {}, submitted: false }; render(); }
    else if (action === "select-lab") selectLab(id);
    else if (action === "grade-lab") gradeLab(id);
    else if (action === "show-solution") runSolution(id);
    else if (action === "reset-simulator") resetSimulator();
    else if (action === "run-command") runCommand(decodeURIComponent(target.dataset.command || ""));
    else if (action === "coverage") {
      const panel = document.getElementById("coverage-panel");
      if (panel) { panel.hidden = !panel.hidden; panel.innerHTML = coverageHtml(); }
      else { setView("reference"); window.setTimeout(() => { const p = document.getElementById("coverage-panel"); if (p) { p.hidden = false; p.innerHTML = coverageHtml(); } }, 0); }
    } else if (action === "start-exam") startExam(id);
    else if (action === "go-exam-task" && exam) { recordTaskTime(); examTaskIndex = Number(id); persistExam(); render(); }
    else if (action === "flag-task" && exam) { exam.tasks[Number(id)].flagged = !exam.tasks[Number(id)].flagged; persistExam(); render(); }
    else if (action === "grade-exam-task") gradeActiveExamTask();
    else if (action === "end-exam") {
      if (exam && window.confirm("Finish this mock exam and score all task states?")) finishExam();
    } else if (action === "back-exams") { exam = null; setView("exams"); }
    else if (action === "open-reference") { setView("reference"); window.setTimeout(() => { const input = document.getElementById("reference-search"); if (input) { input.value = decodeURIComponent(target.dataset.query || ""); input.dispatchEvent(new Event("input")); } }, 0); }
    else if (action === "copy") {
      const text = decodeURIComponent(target.dataset.copy || "");
      try { await navigator.clipboard.writeText(text); toast("Copied."); }
      catch (error) { console.error("Clipboard copy failed.", error); toast("Copy was blocked by this browser. Select the text and copy it manually."); }
    } else if (action === "export-progress") exportProgress();
    else if (action === "clear-progress") {
      if (window.confirm("Clear saved study progress and all Smart Notes from this browser? This cannot be undone.")) {
        progress = defaultProgress();
        GAME.restore(null);
        noteRecords = [];
        activeNoteId = null;
        window.CKA_NOTES.clear().catch((error) => { console.error("Could not clear notes.", error); toast(error.message); });
        saveProgress(); render(); toast("Saved progress and notes cleared.");
      }
    }
  });

  document.addEventListener("submit", (event) => {
    if (event.target.id === "terminal-form") {
      event.preventDefault();
      const input = document.getElementById("terminal-input");
      const command = input.value.trim();
      if (command) runCommand(command);
    } else if (event.target.id === "planner-form") {
      event.preventDefault();
      const form = new FormData(event.target);
      const examDate = String(form.get("examDate") || "");
      const hours = Number(form.get("hours"));
      if (!examDate || new Date(examDate + "T23:59:59") <= new Date() || !Number.isFinite(hours) || hours < 1 || hours > 60) { toast("Choose a future exam date and 1–60 study hours per week."); return; }
      progress.planner = { examDate, hours };
      GAME.emit("planner-created", { eventId: `planner-${examDate}-${hours}` });
      saveProgress(); render(); toast("Study schedule generated.");
    }
  });
  document.addEventListener("input", (event) => {
    if (event.target.id === "global-search") updateSearch(event.target.value);
    if (event.target.id === "reference-search") updateFilteredReference(event.target.value, "reference-list", DATA.reference);
    if (event.target.id === "notes-search") {
      noteQuery = event.target.value;
      const list = document.getElementById("note-list");
      if (list) list.innerHTML = noteListHtml();
    }
    if (event.target.id === "fault-search") {
      const query = event.target.value.toLowerCase();
      const filtered = DATA.faults.filter((item) => `${item.domain} ${item.symptom} ${item.evidence} ${item.cause}`.toLowerCase().includes(query));
      document.getElementById("fault-list").innerHTML = renderFaults(filtered);
    }
    if (event.target.matches("[data-note-field]")) {
      const note = noteRecords.find((item) => item.id === activeNoteId);
      if (!note) return;
      const field = event.target.dataset.noteField;
      if (field === "userTags") note.userTags = event.target.value.split(",").map((tag) => tag.trim()).filter(Boolean);
      else if (field === "trackId") {
        note.trackId = event.target.value === "" ? null : Number(event.target.value);
        const track = DATA.modules.find((item) => item.id === Number(note.trackId));
        if (track) note.domain = track.title;
      } else note[field] = event.target.value;
      if (field === "text" && note.text.trim() && !note.gameRewarded) {
        note.gameRewarded = true;
        GAME.emit("note-created", { eventId: note.id, id: note.id, noteCount: noteRecords.filter((item) => item.text && item.text.trim()).length });
      }
      persistNote(note);
      const preview = document.querySelector(".note-preview");
      if (preview) preview.outerHTML = noteMarkdown(note);
    }
    if (event.target.matches(".note-reflection")) {
      const lesson = lessonById(event.target.dataset.lesson);
      let reflection = getReflection(lesson.id);
      if (!reflection) {
        reflection = makeNoteRecord({ title: `Reflection: ${lesson.title}`, source: lessonInfo(lesson.id), type: "reflection" });
        noteRecords.unshift(reflection);
      }
      reflection.text = event.target.value;
      if (reflection.text.trim() && !reflection.gameRewarded) {
        reflection.gameRewarded = true;
        GAME.emit("note-created", { eventId: reflection.id, id: reflection.id, noteCount: noteRecords.filter((item) => item.text && item.text.trim()).length });
      }
      persistNote(reflection);
      const indicator = event.target.nextElementSibling;
      if (indicator) indicator.textContent = event.target.value.trim() ? "✓ You have explained this idea yourself." : "Your reflection autosaves locally.";
    }
    if (event.target.dataset.careerEdit) {
      progress.career.edits[event.target.dataset.careerEdit] = event.target.value;
      saveProgress();
    }
    if (event.target.dataset.starField) {
      const trackId = event.target.dataset.track;
      const evidenceId = progress.career.activeEvidence;
      if (evidenceId) {
        progress.career.starStories = progress.career.starStories || {};
        progress.career.starStories[trackId] = progress.career.starStories[trackId] || {};
        progress.career.starStories[trackId][evidenceId] = progress.career.starStories[trackId][evidenceId] || {};
        progress.career.starStories[trackId][evidenceId][event.target.dataset.starField] = event.target.value;
        saveProgress();
      }
    }
    if (event.target.dataset.interviewAnswer) {
      progress.career.answers = progress.career.answers || {};
      progress.career.answers[event.target.dataset.interviewAnswer] = event.target.value;
      saveProgress();
    }
    if (event.target.id === "exam-notepad" && exam) { exam.notepad = event.target.value; persistExam(); }
  });
  document.addEventListener("change", (event) => {
    if (event.target.dataset.action === "fault-answer") answerFault(Number(event.target.dataset.index), event.target.value);
    if (event.target.id === "import-progress" && event.target.files[0]) importProgress(event.target.files[0]);
    if (event.target.id === "import-notes" && event.target.files[0]) importNotes(event.target.files[0]);
    if (event.target.id === "notes-filter") { noteFilter = event.target.value; const list = document.getElementById("note-list"); if (list) list.innerHTML = noteListHtml(); }
    if (event.target.dataset.interviewRating) {
      progress.career.ratings[event.target.dataset.interviewRating] = Number(event.target.value);
      saveProgress();
      const label = event.target.parentElement.querySelector("span");
      if (label) label.textContent = `${event.target.value}/5 saved`;
      const questionButton = document.querySelector(`.interview-question[data-id="${event.target.dataset.interviewRating}"]`);
      if (questionButton) questionButton.dataset.struggled = Number(event.target.value) <= 2 ? "true" : "false";
    }
    if (event.target.id === "star-evidence") {
      progress.career.activeEvidence = event.target.value;
      saveProgress();
      render();
    }
    if (event.target.id === "certification-passed") {
      progress.career.certificationPassed = event.target.checked;
      saveProgress();
      render();
    }
    if (event.target.id === "certification-date") { progress.career.certificationDate = event.target.value; saveProgress(); render(); }
    if (event.target.id === "certification-id") { progress.career.certificationId = event.target.value; saveProgress(); }
    if (event.target.id === "interview-filter") {
      const selected = event.target.value;
      document.querySelectorAll(".interview-question").forEach((button) => {
        button.hidden = selected === "struggled" ? button.dataset.struggled !== "true" : selected !== "all" && button.dataset.difficulty !== selected;
      });
    }
  });
  document.addEventListener("toggle", (event) => {
    if (event.target.matches("details[data-lab-hint]") && event.target.open) selectedLabHintsUsed += 1;
  }, true);
  document.addEventListener("dragstart", (event) => {
    const entry = event.target.closest(".cheat-entry");
    if (entry && event.dataTransfer) event.dataTransfer.setData("text/plain", entry.dataset.noteId);
  });
  document.addEventListener("dragover", (event) => {
    if (event.target.closest(".cheat-entry")) event.preventDefault();
  });
  document.addEventListener("drop", (event) => {
    const targetEntry = event.target.closest(".cheat-entry");
    const sourceId = event.dataTransfer && event.dataTransfer.getData("text/plain");
    if (!targetEntry || !sourceId || sourceId === targetEntry.dataset.noteId) return;
    event.preventDefault();
    const entries = noteRecords.filter((item) => item.cheatSheet).sort((a, b) => (a.order || 0) - (b.order || 0));
    const from = entries.findIndex((item) => item.id === sourceId);
    const to = entries.findIndex((item) => item.id === targetEntry.dataset.noteId);
    if (from < 0 || to < 0) return;
    const [moved] = entries.splice(from, 1);
    entries.splice(to, 0, moved);
    entries.forEach((item, index) => { item.order = index; });
    persistNotesBatch();
    render();
  });
  document.addEventListener("mouseup", addSelectionNoteButton);
  document.addEventListener("keydown", (event) => {
    if ((event.key === "n" || event.key === "N") && !event.ctrlKey && !event.metaKey && !["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement.tagName)) {
      event.preventDefault();
      createNote({ title: view === "learn" ? `Note: ${lessonById(selectedLesson).title}` : "Quick note", source: view === "learn" ? lessonInfo(selectedLesson) : {} });
    }
    if (event.target.id === "terminal-input") {
      const commands = SIM.snapshot().history;
      if (event.key === "ArrowUp") {
        event.preventDefault(); terminalHistoryIndex = Math.min(commands.length, terminalHistoryIndex + 1);
        event.target.value = commands[commands.length - terminalHistoryIndex] || "";
      } else if (event.key === "ArrowDown") {
        event.preventDefault(); terminalHistoryIndex = Math.max(0, terminalHistoryIndex - 1);
        event.target.value = terminalHistoryIndex ? commands[commands.length - terminalHistoryIndex] : "";
      } else if (event.key === "Tab") {
        event.preventDefault();
        const candidates = ["kubectl get pods", "kubectl get deployments", "kubectl get services", "kubectl get nodes", "kubectl describe pod", "kubectl create deployment", "kubectl config use-context"];
        const match = candidates.find((item) => item.startsWith(event.target.value));
        if (match) event.target.value = match;
      }
    }
    if (event.key === "/" && !["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) {
      event.preventDefault(); document.getElementById("global-search").focus();
    }
    if ((event.key === "Enter" || event.key === " ") && event.target.matches(".module-card")) {
      event.preventDefault(); event.target.click();
    }
  });
  document.getElementById("theme-toggle").addEventListener("click", () => {
    progress.theme = progress.theme === "light" ? "dark" : "light";
    saveProgress(); render();
  });
  document.getElementById("mobile-menu").addEventListener("click", () => document.querySelector(".sidebar").classList.toggle("open"));
  document.addEventListener("click", (event) => {
    const search = document.getElementById("global-search");
    const results = document.getElementById("search-results");
    if (!event.target.closest(".searchbox") && !event.target.closest(".search-results")) results.hidden = true;
    if (event.target === search) results.hidden = false;
  });

  function exportProgress() {
    window.CKA_NOTES.load().then((notes) => {
      GAME.emit("progress-exported", { eventId: `progress-export-${new Date().toISOString().slice(0, 10)}` });
      const blob = new Blob([JSON.stringify({ version: 3, exportedAt: new Date().toISOString(), progress, simulator: SIM.snapshot(), notes, game: GAME.exportState() }, null, 2)], { type: "application/json" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob); link.download = "clustercraft-progress.json"; link.click();
      window.setTimeout(() => URL.revokeObjectURL(link.href), 1000);
      progress.notesBackupAt = new Date().toISOString();
      saveProgress();
      toast("Progress, evidence, Career Kit edits, and notes exported.");
    }).catch((error) => {
      console.error("Progress export could not read notes.", error);
      toast("Progress backup failed because notes could not be read. Use the Smart Notes JSON export.");
    });
  }
  function persistExam() {
    if (exam && exam.taskStartedAt) exam.activeTaskSeconds = (exam.tasks[examTaskIndex].timeSpent || 0) + Math.max(0, Date.now() - exam.taskStartedAt);
    progress.activeExam = exam;
    progress.activeExamTaskIndex = examTaskIndex;
    saveProgress();
  }
  function persistSimulator() {
    try { localStorage.setItem(SIMULATOR_KEY, JSON.stringify(SIM.snapshot())); }
    catch (error) {
      console.error("Could not save the simulated cluster state.", error);
      toast("Simulator state could not be saved in this browser.");
    }
  }
  async function importProgress(file) {
    try {
      const parsed = JSON.parse(await file.text());
      const candidate = parsed.progress || parsed;
      if (!candidate || typeof candidate !== "object" || !Array.isArray(candidate.completed) || !candidate.quizScores || !Array.isArray(candidate.mocks)) throw new Error("This file does not have the expected ClusterCraft progress format.");
      progress = { ...defaultProgress(), ...candidate };
      progress = normalizeProgress(progress);
      if (parsed.simulator) {
        SIM.restore(parsed.simulator);
        persistSimulator();
      }
      if (parsed.game) GAME.restore(parsed.game);
      if (Array.isArray(parsed.notes)) {
        noteRecords = parsed.notes;
        await window.CKA_NOTES.saveAll(noteRecords);
      }
      saveProgress(); render(); toast("Progress imported.");
    } catch (error) {
      console.error("Progress import failed.", error);
      toast(`Import failed: ${error.message}`);
    }
  }

  window.setInterval(() => {
    if (exam && !exam.finished && view === "exams") {
      const timer = document.getElementById("exam-timer");
      if (timer) timer.textContent = clock(examTimeLeft());
      if (examTimeLeft() === 0) finishExam();
    }
  }, 1000);
  render();
  window.CKA_NOTES.load().then((records) => {
    noteRecords = records;
    if (!noteRecords.some((item) => item.id === activeNoteId)) activeNoteId = noteRecords[0] ? noteRecords[0].id : null;
    render();
  }).catch((error) => {
    console.error("Notes could not be initialized.", error);
    noteSaveStatus = "Notes storage unavailable";
    toast("Smart Notes could not be loaded. Check browser storage settings.");
  });
})();
