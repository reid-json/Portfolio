const careerStore = loadStore();
const evidence = careerEvidence([...careerStore.assessments, careerStore.latestAssessment].filter(Boolean));
const status = document.getElementById("career-status");
status.textContent = evidence.decision
  ? `${evidence.decision.correct}/100 correct. ${evidence.decision.reason}`
  : "No qualifying assessment conditions recorded yet. Practice attempts with feedback shown, shorter exams, untimed exams, and older summary-only results cannot unlock resume suggestions.";
document.getElementById("career-date").textContent = evidence.latest
  ? `Assessment date: ${new Date(evidence.latest.date).toLocaleString()} · ${Math.floor(evidence.latest.seconds / 60)} minutes elapsed · self-administered`
  : "";
document.getElementById("resume-copy").value = evidence.resume;
document.getElementById("download-career").disabled = !evidence.decision?.passed;

function renderCoverage() {
  const container = document.getElementById("knowledge-coverage");
  if (!evidence.latest) {
    container.append(node("p", "", "No detailed full assessment yet. Complete one to see sampled strengths and gaps."));
    return;
  }
  const scroll = node("div", "table-scroll");
  const table = node("table", "evidence-table");
  const head = node("thead");
  const heading = node("tr");
  ["Domain", "Correct / sampled", "Assessment"].forEach((label) => {
    const th = node("th", "", label);
    th.scope = "col";
    heading.append(th);
  });
  head.append(heading);
  const body = node("tbody");
  modules.forEach((module) => {
    const items = evidence.latest.items.filter((item) => item.domain === module.id);
    const correct = items.filter((item) => item.right).length;
    const row = node("tr");
    const label = !items.length ? "Not assessed" : correct / items.length >= 0.8 ? "Strong practice result; see concept sampling below" : "Review this domain";
    row.append(node("td", "", module.title), node("td", "", `${correct}/${items.length}`), node("td", "", label));
    body.append(row);
  });
  table.append(head, body);
  scroll.append(table);
  container.append(scroll);
  const list = node("ul");
  evidence.skills.forEach((skill) => {
    list.append(node("li", "", `${skillLabel(skill.skill)} (${moduleById(skill.domain).short}): ${skill.correct}/${skill.total} - ${skill.supported ? "supports conceptual knowledge" : skill.total < 3 ? "insufficient sample" : "needs review"}`));
  });
  container.append(list);
}

function interviewItems() {
  if (!evidence.decision?.passed) return [];
  const seen = new Set();
  return evidence.skills.filter((skill) => {
    if (!skill.supported || seen.has(skill.skill)) return false;
    seen.add(skill.skill);
    return true;
  }).map((skill) => ({ skill, profile: guidanceProfiles.find((profile) => profile.id === skill.skill) }));
}

function renderInterviews() {
  const list = document.getElementById("interview-plan");
  const items = interviewItems();
  if (!items.length) {
    list.append(node("p", "panel", "Pass a qualifying exam and build enough concept-level evidence to unlock a personalized interview plan."));
    return;
  }
  items.forEach(({ skill, profile }) => {
    const card = node("article", "panel interview-card");
    card.append(node("h3", "", skillLabel(skill.skill)), node("p", "", profile.interview),
      node("p", "note", `Evidence: ${skill.correct}/${skill.total} in ${moduleById(skill.domain).title}, on your ${new Date(evidence.latest.date).toLocaleDateString()} assessment.`));
    const details = node("details");
    details.append(node("summary", "", "Preparation checklist and credible reading"));
    const rubric = node("ul");
    ["Explain the mechanism in your own words, not just its acronym.",
      "Work through an example and name the observations or commands you would use to verify it.",
      "Describe a failure mode, an alternative explanation, and the limits of your experience."].forEach((point) => rubric.append(node("li", "", point)));
    details.append(rubric);
    renderReferences(details, profile.sources);
    card.append(details);
    list.append(card);
  });
}

function renderTrail() {
  const list = document.getElementById("assessment-trail");
  if (!careerStore.assessments.length) {
    list.append(node("p", "", "No detailed exams completed since this feature was added. Older recent-attempt summaries remain on the exam page."));
    return;
  }
  const items = node("ul");
  careerStore.assessments.forEach((attempt) => {
    const decision = assessmentDecision(attempt);
    const date = Number.isFinite(attempt?.date) ? new Date(attempt.date).toLocaleString() : "Unknown date";
    items.append(node("li", "", `${date} - ${decision.correct === undefined ? "" : `${decision.correct}/${attempt.items.length}. `}${decision.reason}`));
  });
  list.append(items);
}

document.getElementById("download-career").addEventListener("click", () => {
  const text = [
    "# PacketPath practice evidence", "", evidence.resume, "",
    "Self-administered, locally stored practice only. Not a Cisco credential, verified assessment, or professional experience.",
    "", "## Interview preparation",
    ...interviewItems().flatMap(({ skill, profile }) => [
      `### ${skillLabel(skill.skill)} (${skill.correct}/${skill.total})`, profile.interview,
      "Explain the mechanism, work through an example, verify an outcome, and discuss a failure mode.",
      ...profile.sources.map((id) => { const source = referenceById(id); return `- ${source.title}: ${source.url}`; }), ""
    ])
  ].join("\n");
  const url = URL.createObjectURL(new Blob([text], { type: "text/markdown;charset=utf-8" }));
  const link = node("a");
  link.href = url;
  link.download = "packetpath-career-evidence.md";
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
});
renderCoverage();
renderInterviews();
renderTrail();
