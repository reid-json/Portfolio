(function (root) {
  "use strict";

  const SKILLS = {
    "workload-deployment": ["Orchestration", "Kubernetes Deployments"],
    "workload-scaling": ["Orchestration", "Workload scaling"],
    "workload-configuration": ["Orchestration", "ConfigMaps and application configuration"],
    "cluster-operations": ["Cluster administration", "Kubernetes cluster operations"],
    "access-control": ["Security", "Kubernetes access control"],
    "scripting-cli": ["Linux and CLI", "Command-line administration"],
    scheduling: ["Orchestration", "Kubernetes scheduling"],
    "service-networking": ["Networking", "Kubernetes Services and traffic routing"],
    "observability-troubleshooting": ["Troubleshooting", "Kubernetes diagnostics and log analysis"],
    storage: ["Storage", "Kubernetes persistent storage"]
  };

  const LAB_EVIDENCE = {
    "deploy-three": ["workload-deployment", "workload-scaling"],
    "config-map": ["workload-configuration"],
    "expose-shop": ["service-networking"],
    "context-switch": ["cluster-operations", "scripting-cli"],
    "node-label": ["scheduling", "cluster-operations"],
    "deployment-update": ["workload-deployment", "observability-troubleshooting"],
    "create-namespace": ["cluster-operations"],
    "run-pod": ["workload-deployment", "scripting-cli"],
    "create-secret": ["workload-configuration", "access-control"],
    "expose-nodeport": ["service-networking"],
    "taint-node": ["scheduling"],
    "rollback-image": ["workload-deployment", "observability-troubleshooting"]
  };
  const LAB_TRACKS = {
    "deploy-three": 2, "config-map": 2, "deployment-update": 2, "run-pod": 2, "create-secret": 2, "taint-node": 2, "rollback-image": 2,
    "expose-shop": 3, "expose-nodeport": 3,
    "context-switch": 1, "node-label": 1, "create-namespace": 1
  };

  const ROLES = [
    { name: "Junior DevOps", needs: ["workload-deployment", "workload-configuration", "scripting-cli", "observability-troubleshooting"], modules: [0, 1, 2, 5, 6] },
    { name: "Platform Support", needs: ["cluster-operations", "access-control", "workload-deployment", "observability-troubleshooting"], modules: [1, 2, 5, 6] },
    { name: "Junior SRE", needs: ["observability-troubleshooting", "service-networking", "workload-deployment", "scripting-cli"], modules: [1, 2, 3, 5, 6] },
    { name: "Cloud Administrator", needs: ["cluster-operations", "access-control", "storage", "scripting-cli"], modules: [1, 4, 5, 6] },
    { name: "Kubernetes Support", needs: ["observability-troubleshooting", "service-networking", "workload-configuration", "storage"], modules: [2, 3, 4, 5] }
  ];
  const SKILL_LESSONS = {
    "workload-deployment": "workloads-core",
    "workload-scaling": "workloads-schedule",
    "workload-configuration": "workloads-config",
    "cluster-operations": "arch-flow",
    "access-control": "arch-access",
    "scripting-cli": "f-linux-yaml",
    scheduling: "workloads-schedule",
    "service-networking": "network-service",
    "observability-troubleshooting": "trouble-method",
    storage: "storage-data"
  };

  function passedEvidence(progress, trackId) {
    return (progress.evidenceRecords || []).filter((item) => item.evidenceType !== "drill" && item.passed && item.eligible !== false && Number(item.trackId) === Number(trackId));
  }

  function trackStates(data, progress) {
    return data.modules.map((track) => {
      const lessonsComplete = track.lessonIds.every((id) => (progress.completed || []).includes(id));
      const quizzesPassed = track.lessonIds.every((id) => progress.quizScores && progress.quizScores[id] && progress.quizScores[id].latest >= 75);
      const complete = lessonsComplete && quizzesPassed;
      const evidence = passedEvidence(progress, track.id);
      return {
        id: track.id,
        title: track.title,
        complete,
        lessonsComplete,
        quizzesPassed,
        lessonCount: track.lessonIds.length,
        completedLessons: track.lessonIds.filter((id) => (progress.completed || []).includes(id)).length,
        passedLabCount: evidence.length,
        evidence,
        missingLessons: track.lessonIds.filter((id) => !(progress.completed || []).includes(id))
      };
    });
  }

  function evidenceBullets(evidence) {
    const bullets = [];
    evidence.forEach((record) => {
      const skills = record.skillTags || LAB_EVIDENCE[record.labId] || [];
      (record.assertions || []).filter((assertion) => assertion.pass).forEach((assertion) => {
        const label = String(assertion.label || "").replace(/[.!?]+$/, "").toLowerCase();
        if (!label) return;
        const skill = skills.map((tag) => SKILLS[tag] && SKILLS[tag][1]).filter(Boolean)[0] || "Kubernetes administration";
        const statement = `Configured and verified ${label} in a simulated Kubernetes lab (${record.score}% of checks passed).`;
        bullets.push({
          id: `${record.id}-${bullets.length}`,
          text: statement,
          variants: {
            concise: `Configured ${label} in a simulated Kubernetes lab.`,
            detailed: statement,
            keywords: `Applied ${skill} by configuring and verifying ${label} in a simulated Kubernetes lab.`
          },
          evidence: {
            lab: record.labTitle || record.labId,
            date: record.date,
            passed: (record.assertions || []).filter((item) => item.pass).length,
            total: (record.assertions || []).length
          },
          skillTags: skills
        });
      });
    });
    return bullets.slice(0, 8);
  }

  function skillEvidence(progress) {
    const map = new Map();
    (progress.evidenceRecords || []).filter((item) => item.evidenceType !== "drill" && item.passed && item.eligible !== false).forEach((record) => {
      (record.skillTags || LAB_EVIDENCE[record.labId] || []).forEach((tag) => {
        if (!SKILLS[tag]) return;
        const key = SKILLS[tag][0] + "|" + SKILLS[tag][1];
        const entry = map.get(key) || { group: SKILLS[tag][0], name: SKILLS[tag][1], evidence: [] };
        entry.evidence.push(record);
        map.set(key, entry);
      });
    });
    return [...map.values()];
  }

  function conceptsForTrack(track, data) {
    return track.lessonIds.flatMap((id) => {
      const lesson = data.lessons.find((item) => item.id === id);
      return lesson ? lesson.concepts.map((concept) => ({ concept, lesson })) : [];
    });
  }

  function answerForConcept(concept, lesson) {
    const terms = String(lesson.explanation || "").split(/(?<=[.!?])\s+/);
    const relevant = terms.find((sentence) => sentence.toLowerCase().includes(concept.toLowerCase()));
    return relevant || lesson.objectives.join("; ") + ".";
  }

  function interviewQuestions(track, data) {
    const concepts = conceptsForTrack(track, data);
    if (!concepts.length) return [];
    return Array.from({ length: 20 }, (_, index) => {
      const item = concepts[index % concepts.length];
      const difficulty = index < 7 ? "beginner" : index < 14 ? "intermediate" : "advanced";
      const kind = index % 3;
      const question = kind === 0
        ? `Explain ${item.concept} and why a Kubernetes administrator uses it.`
        : kind === 1
          ? `During a task involving ${item.concept}, what evidence would you gather before changing anything?`
          : `Describe a safe sequence for checking or using ${item.concept} in a hands-on task.`;
      const answer = answerForConcept(item.concept, item.lesson);
      return {
        id: `${track.id}-${index}`,
        trackId: track.id,
        lessonId: item.lesson.id,
        difficulty,
        kind: ["conceptual", "scenario", "hands-on"][kind],
        question,
        modelAnswer: answer,
        testing: `Whether you can explain ${item.concept} accurately, connect it to the requested task, and verify the result.`,
        weakAnswer: `Naming ${item.concept} without explaining its role, the evidence you would inspect, or how you would verify a change.`,
        followUp: `What would you inspect next if your first check did not explain the ${item.concept} behavior?`,
        checklist: [item.concept, "why it matters", "evidence or verification"],
        explanation: answer
      };
    });
  }

  function roleReadiness(role, data, progress, states) {
    const covered = new Set(skillEvidence(progress).map((item) => {
      const match = Object.entries(SKILLS).find(([, value]) => value[1] === item.name);
      return match && match[0];
    }).filter(Boolean));
    const skillsPercent = role.needs.length ? role.needs.filter((tag) => covered.has(tag)).length / role.needs.length : 0;
    const completedModules = role.modules.filter((id) => states.some((item) => item.id === id && item.complete)).length;
    const trackPercent = role.modules.length ? completedModules / role.modules.length : 0;
    const mocks = (progress.mocks || []).slice(-3);
    const mockPercent = mocks.length ? Math.min(1, mocks.reduce((sum, item) => sum + (item.score || 0), 0) / mocks.length / 76) : 0;
    const ratings = Object.values((progress.career && progress.career.ratings) || {});
    const practicePercent = ratings.length ? ratings.reduce((sum, value) => sum + Math.max(0, Math.min(5, value)) / 5, 0) / ratings.length : 0;
    const score = Math.round(skillsPercent * 0.4 * 100 + trackPercent * 0.3 * 100 + mockPercent * 0.2 * 100 + practicePercent * 0.1 * 100);
    const gaps = role.needs.filter((tag) => !covered.has(tag)).map((tag) => ({
      skill: SKILLS[tag] ? SKILLS[tag][1] : tag,
      lesson: data.lessons.find((lesson) => lesson.id === SKILL_LESSONS[tag])
    }));
    return { name: role.name, score, formula: "40% passed lab skill evidence + 30% relevant tracks + 20% latest three mock scores (normalized to 76%) + 10% self-rated interview practice.", gaps };
  }

  function build(data, progress) {
    const tracks = trackStates(data, progress);
    const evidence = (progress.evidenceRecords || []).filter((item) => item.evidenceType !== "drill" && item.passed && item.eligible !== false);
    const bullets = tracks.map((track) => ({ track, bullets: evidenceBullets(track.evidence) }));
    const questions = data.modules.flatMap((track) => interviewQuestions(track, data));
    const avgMock = (progress.mocks || []).length
      ? Math.round(progress.mocks.reduce((sum, item) => sum + (item.score || 0), 0) / progress.mocks.length)
      : null;
    const roleReadinessList = ROLES.map((role) => roleReadiness(role, data, progress, tracks));
    const date = progress.career && progress.career.certificationDate;
    const certified = !!(progress.career && progress.career.certificationPassed && date);
    const passedFaults = Object.values(progress.faultResults || {}).filter((item) => item.correct).length;
    return {
      tracks,
      bullets,
      skills: skillEvidence(progress),
      evidence,
      questions,
      roles: roleReadinessList,
      avgMock,
      passedFaults,
      passedLabCount: evidence.length,
      completedTrackCount: tracks.filter((item) => item.complete).length,
      certification: certified ? { date, wording: `Certified Kubernetes Administrator (CKA) — passed ${date}. Add the official credential ID and verification details exactly as issued.` } : null,
      headline: certified ? "Certified Kubernetes Administrator (CKA) | Kubernetes administration" : "Kubernetes administration learner | Preparing for the CKA",
      about: evidence.length
        ? `I am preparing for the Certified Kubernetes Administrator (CKA) exam and have completed ${evidence.length} graded hands-on lab${evidence.length === 1 ? "" : "s"} in a simulated Kubernetes environment. My practice includes ${[...new Set(evidence.flatMap((item) => item.skillTags || LAB_EVIDENCE[item.labId] || []))].map((tag) => SKILLS[tag] && SKILLS[tag][1]).filter(Boolean).join(", ") || "cluster administration"}.`
        : "I am studying Kubernetes administration and preparing for the Certified Kubernetes Administrator (CKA) exam. I am building hands-on practice evidence in a simulated learning environment.",
      elevatorPitch: evidence.length
        ? `I am preparing for the CKA and have completed ${evidence.length} graded Kubernetes lab${evidence.length === 1 ? "" : "s"} in a simulated environment. I can talk through the exact checks I performed and what I learned.`
        : "I am building Kubernetes administration skills through structured study and simulated labs. I can describe my current learning goals and the evidence I am working toward.",
      rolesDisclaimer: "Role skill categories are illustrative entry-level guidance, not a live survey of current job listings.",
      nextSteps: tracks.filter((item) => !item.complete).slice(0, 3).map((item) => ({
        text: `Continue ${item.title}: ${item.completedLessons}/${item.lessonCount} lessons marked complete.`,
        lessonId: item.missingLessons[0]
      })),
      canUseCertificationWording: certified,
      noEvidenceClaims: evidence.length === 0
    };
  }

  root.CKA_CAREER = { build, trackStates, interviewQuestions, evidenceBullets, skillEvidence, labEvidence: LAB_EVIDENCE, labTracks: LAB_TRACKS, roles: ROLES };
})(typeof globalThis === "undefined" ? this : globalThis);
