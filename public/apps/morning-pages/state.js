export const STORAGE_KEY = 'morning-pages-v1';
export const emptyState = () => ({
  version: 1, theme: 'light', favorites: {}, notes: [], read: {}, attempts: {},
  xp: 0, activity: {}, streakDays: [], reviewDue: {}, noteDays: [],
});
export function localDate(value = new Date()) {
  return `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, '0')}-${String(value.getDate()).padStart(2, '0')}`;
}
export function previousDay(day) {
  const date = new Date(`${day}T12:00:00`);
  date.setDate(date.getDate() - 1);
  return localDate(date);
}
export function streak(state, today = localDate()) {
  const days = new Set(state.streakDays);
  let day = days.has(today) ? today : previousDay(today);
  let count = 0;
  while (days.has(day)) { count++; day = previousDay(day); }
  return count;
}
export function longestStreak(state) {
  let best = 0, count = 0, previous = null;
  for (const day of [...new Set(state.streakDays)].sort()) {
    count = previous === previousDay(day) ? count + 1 : 1;
    best = Math.max(best, count);
    previous = day;
  }
  return best;
}
export function award(state, amount, day = localDate()) {
  state.xp += amount;
  state.activity[day] = (state.activity[day] || 0) + amount;
}
export function markRead(state, articleId, day = localDate()) {
  if (state.read[articleId]) return false;
  state.read[articleId] = day;
  award(state, 10, day);
  return true;
}
export function answerQuestion(state, question, selected, category, day = localDate()) {
  if (!Number.isInteger(selected) || selected < 0 || selected >= question.options.length) throw new Error('Choose an answer.');
  const correct = selected === question.answer;
  if (state.attempts[question.id]) return { correct, first: false };
  state.attempts[question.id] = { correct, selected, category, day };
  award(state, correct ? 15 : 5, day);
  if (!correct) state.reviewDue[question.id] = day;
  return { correct, first: true };
}
export function finishQuiz(state, questions, day = localDate()) {
  if (!questions.length || !questions.every(q => state.attempts[q.id])) return false;
  // A streak day requires actually answering at least one question that day.
  if (!questions.some(q => state.attempts[q.id].day === day) || state.streakDays.includes(day)) return false;
  state.streakDays.push(day);
  award(state, 20, day);
  return true;
}
export function reviewAnswer(state, question, selected, day = localDate()) {
  if (!Number.isInteger(selected) || selected < 0 || selected >= question.options.length) throw new Error('Choose an answer.');
  const correct = selected === question.answer;
  const next = new Date(`${day}T12:00:00`);
  next.setDate(next.getDate() + (correct ? 3 : 1));
  state.reviewDue[question.id] = localDate(next);
  return correct;
}
export function validateState(value) {
  const record = v => v && typeof v === 'object' && !Array.isArray(v);
  const day = v => typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v);
  if (!record(value) || value.version !== 1 || !['light', 'dark'].includes(value.theme) ||
      !Number.isSafeInteger(value.xp) || value.xp < 0 ||
      !Array.isArray(value.notes) || !Array.isArray(value.streakDays) || !Array.isArray(value.noteDays) ||
      !['favorites', 'read', 'attempts', 'activity', 'reviewDue'].every(k => record(value[k]))) {
    throw new Error('This is not a valid Morning Pages v1 backup.');
  }
  if (!Object.values(value.favorites).every(v => typeof v === 'string' && !Number.isNaN(Date.parse(v))) ||
      !Object.values(value.read).every(day) || !value.streakDays.every(day) || !value.noteDays.every(day) ||
      !Object.values(value.reviewDue).every(day) ||
      !Object.values(value.activity).every(v => Number.isSafeInteger(v) && v >= 0) ||
      !Object.values(value.attempts).every(v => record(v) && typeof v.correct === 'boolean' &&
        Number.isInteger(v.selected) && typeof v.category === 'string' && day(v.day)) ||
      !value.notes.every(n => record(n) && ['id', 'title', 'body', 'createdAt', 'updatedAt'].every(k => typeof n[k] === 'string') &&
        (n.articleId === null || typeof n.articleId === 'string'))) {
    throw new Error('Backup contains invalid notes or progress data.');
  }
  if (new Set(value.notes.map(n => n.id)).size !== value.notes.length) throw new Error('Backup contains duplicate note IDs.');
  return value;
}
export function exportNotes(notes) {
  // Per-note JSON metadata preserves multiline Markdown exactly without executing it.
  return '# Morning Pages notebook\n\n' + notes.map(n =>
    `<!-- morning-pages-note ${JSON.stringify(n)} -->\n## ${n.title.replaceAll('\n', ' ')}\n\n${n.body}\n`
  ).join('\n---\n\n');
}
export function importNotes(text) {
  const matches = [...text.matchAll(/^<!-- morning-pages-note (.+) -->$/gm)];
  if (!matches.length && text.trim() === '# Morning Pages notebook') return [];
  if (!matches.length) throw new Error('Use a Markdown notebook exported by Morning Pages.');
  const notes = matches.map(m => JSON.parse(m[1]));
  validateState({ ...emptyState(), notes });
  return notes;
}
