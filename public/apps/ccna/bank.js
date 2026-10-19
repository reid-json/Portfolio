// Builds the two separate question pools from the content files.
//   studyBank  – used by the study page (every question has a quick lesson)
//   examBank   – used only by the practice exam (never shown on the study page)
function textId(prefix, text) {
  let h = 5381;
  for (let i = 0; i < text.length; i += 1) h = ((h * 33) ^ text.charCodeAt(i)) >>> 0;
  return `${prefix}-${h.toString(36)}`;
}

function rowToQuestion(prefix, domain, row) {
  const [question, options, answer, explanation] = row;
  return { id: textId(prefix, question), domain, question, options, answer, explanation };
}

const studyBank = [...questionBank];
studyTopics.forEach((topic) => {
  const lesson = { title: topic.title, points: topic.points };
  if (topic.code) lesson.code = topic.code;
  if (topic.tip) lesson.tip = topic.tip;
  topic.questions.forEach((row) => {
    studyBank.push({ ...rowToQuestion("s", topic.domain, row), topic: topic.title, lesson });
  });
});

const examQuestions = [...examBank];
examPool.forEach((pack) => {
  pack.items.forEach((item) => {
    if (Array.isArray(item)) examQuestions.push({ ...rowToQuestion("e", pack.domain, item), examOnly: true });
    else examQuestions.push({ ...item, id: textId("e", item.question), domain: pack.domain, examOnly: true });
  });
});
