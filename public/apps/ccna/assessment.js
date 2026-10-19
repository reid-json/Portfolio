const assessmentPolicy = { version: 1, count: 100, limit: 7200, pass: 0.8, skillMinimum: 3 };

function makeAssessment(exam, results, seconds) {
  return {
    version: assessmentPolicy.version,
    date: Date.now(),
    length: exam.length,
    feedback: exam.feedback,
    timed: exam.timed,
    limit: exam.limit,
    seconds: exam.timed ? Math.min(seconds, exam.limit) : seconds,
    items: results.map(({ q, right, picks }) => ({
      id: q.id, domain: q.domain, skill: questionGuidance(q).skill,
      type: q.type || "mc", right, answered: isAnswered(q, picks),
      task: q.type === "lab" ? q.question : ""
    }))
  };
}

function validAssessment(attempt) {
  return attempt && attempt.version === assessmentPolicy.version
    && Number.isFinite(attempt.date) && Number.isFinite(attempt.seconds) && attempt.seconds >= 0
    && typeof attempt.feedback === "boolean" && typeof attempt.timed === "boolean"
    && Array.isArray(attempt.items) && attempt.items.length > 0
    && attempt.items.every((item) => item && typeof item === "object")
    && new Set(attempt.items.map((item) => item.id)).size === attempt.items.length
    && attempt.items.every((item) => typeof item.id === "string" && moduleById(item.domain)
      && guidanceProfiles.some((profile) => profile.id === item.skill)
      && ["mc", "dnd", "lab"].includes(item.type) && typeof item.right === "boolean"
      && typeof item.answered === "boolean" && (!item.right || item.answered) && typeof item.task === "string");
}

function assessmentDecision(attempt) {
  if (!validAssessment(attempt)) return { eligible: false, passed: false, reason: "No detailed assessment evidence is available for this attempt." };
  const correct = attempt.items.filter((item) => item.right).length;
  const ratio = correct / attempt.items.length;
  let reason = "";
  if (attempt.length !== "full" || attempt.items.length !== assessmentPolicy.count) reason = "A full 100-question exam is required.";
  else if (attempt.feedback !== false) reason = "Answers must be hidden throughout the attempt.";
  else if (attempt.timed !== true || attempt.limit !== assessmentPolicy.limit || attempt.seconds > assessmentPolicy.limit) reason = "The 120-minute countdown must be enabled and enforced.";
  else if (!modules.every((module) => attempt.items.some((item) => item.domain === module.id))) reason = "Evidence from all six exam domains is required.";
  if (reason) return { eligible: false, passed: false, correct, ratio, reason };
  return {
    eligible: true, passed: ratio >= assessmentPolicy.pass, correct, ratio,
    reason: ratio >= assessmentPolicy.pass
      ? "Practice benchmark met: full timed exam, answers hidden, at least 80% correct."
      : "Valid assessment conditions, but below the 80% practice benchmark. Review gaps and reassess."
  };
}

function skillLabel(id) {
  const labels = {
    ipv6: "IPv6 addressing", subnet: "IPv4 subnetting and prefixes", private: "Private IPv4 addressing",
    arp: "Address resolution", transport: "TCP and UDP concepts", stp: "Spanning-tree concepts",
    etherchannel: "EtherChannel concepts", vlan: "VLAN and trunk concepts", wireless: "Wireless networking concepts",
    ospf: "OSPF concepts", redundancy: "First-hop redundancy concepts", routing: "IP route selection",
    dhcp: "DHCP concepts", dns: "DNS concepts", nat: "NAT concepts", ntp: "Time synchronization",
    snmp: "Network monitoring concepts", syslog: "Network logging concepts", qos: "QoS concepts",
    ssh: "Secure management concepts", acl: "ACL reasoning", security: "Network security fundamentals",
    json: "JSON interpretation", netconf: "NETCONF concepts", restconf: "RESTCONF concepts",
    http: "HTTP API concepts", ansible: "Network automation concepts", terraform: "Infrastructure-as-code concepts",
    architecture: "Network architecture concepts", ethernet: "Ethernet and layered troubleshooting",
    ai: "AI-assisted operations concepts", virtualization: "Virtualization concepts", icmp: "Network diagnostic reasoning",
    "file-transfer": "Configuration and file-transfer concepts", ports: "Application service ports",
    ipv4: "IPv4 addressing concepts", cryptography: "Cryptographic protection concepts", "configuration-tools": "Configuration management models"
  };
  return labels[id] || id;
}

function assessmentSkills(attempt) {
  if (!validAssessment(attempt)) return [];
  const groups = new Map();
  attempt.items.forEach((item) => {
    const key = `${item.domain}:${item.skill}`;
    if (!groups.has(key)) groups.set(key, { domain: item.domain, skill: item.skill, total: 0, correct: 0 });
    const group = groups.get(key);
    group.total += 1;
    if (item.right) group.correct += 1;
  });
  return [...groups.values()].map((group) => ({
    ...group, supported: group.total >= assessmentPolicy.skillMinimum && group.correct / group.total >= assessmentPolicy.pass
  })).sort((a, b) => Number(b.supported) - Number(a.supported) || b.total - a.total);
}

function careerEvidence(attempts) {
  const detailed = attempts.filter(validAssessment).sort((a, b) => b.date - a.date);
  const latest = detailed.find((attempt) => assessmentDecision(attempt).eligible);
  if (!latest) return { latest: null, decision: null, skills: [], resume: "" };
  const decision = assessmentDecision(latest);
  const skills = assessmentSkills(latest);
  const supported = skills.filter((skill) => skill.supported);
  const date = new Date(latest.date).toLocaleDateString();
  const lines = [];
  if (decision.passed) {
    lines.push(`CCNA-aligned independent study: scored ${decision.correct}/100 on a 120-minute PacketPath practice exam with feedback hidden (${date}; self-administered).`);
    if (supported.length) lines.push(`Demonstrated conceptual knowledge in practice assessment: ${[...new Set(supported.map((skill) => skillLabel(skill.skill)))].join(", ")}.`);
    latest.items.filter((item) => item.type === "lab" && item.right).forEach((item) => {
      lines.push(`Completed a simplified PacketPath simulated CLI exercise: ${item.task}`);
    });
  }
  return { latest, decision, skills, resume: lines.join("\n") };
}
