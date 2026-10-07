"use client";

function safeName(value: string) {
  return (
    value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 64) || "neighborwell-action"
  );
}

export function downloadArtifact(
  title: string,
  summary: string,
  sections: string[] = [],
) {
  const content = [
    `# ${title}`,
    "",
    `Created: ${new Date().toISOString()}`,
    "",
    summary,
    "",
    ...sections,
  ].join("\n");
  const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${safeName(title)}.md`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export function deliverAction(message: string) {
  const external =
    /call|sms|text|email|upload|submit|provider|referral|document|integration|message/i.test(
      message,
    );
  downloadArtifact(
    external ? "NeighborWell action setup record" : "NeighborWell draft action record",
    message,
    external
      ? [
          "## Current result\nA reviewable draft and action record were created. No external transmission occurred.",
          "## Production setup required\n1. Configure server-side authentication and role authorization.\n2. Connect encrypted database and object storage.\n3. Configure the applicable email, SMS, telephony, provider, or government API.\n4. Add purpose-bound consent validation and an immutable audit receipt.\n5. Add delivery, retry, failure, and escalation handling.\n6. Complete security, privacy, accessibility, and end-to-end testing.",
          "## Release condition\nKeep this action draft-only until its integration is configured and an authorized human approves production use.",
        ]
      : [
          "## Draft status\nThis artifact is ready for human review. It is not evidence that an external action was completed.",
          "## Next step\nReview, approve, and save the approved version to persistent storage.",
        ],
  );
}

export function downloadDeploymentPlan() {
  downloadArtifact(
    "NeighborWell operational action deployment plan",
    "Required development to convert prototype actions into production workflows.",
    [
      "## Data foundation\nDeploy PostgreSQL records for participants, organizations, programs, referrals, consent, documents, messages, appointments, verification, action events, and audit receipts. Add migrations, backups, retention, deletion, and recovery.",
      "## Identity and authorization\nImplement organization membership, role and field permissions, privileged MFA, administrator allowlisting, session controls, separation of duties, and server-side denial tests.",
      "## Documents\nConnect encrypted object storage, malware scanning, file controls, signed purpose-bound links, expiration, revocation, and access logging.",
      "## Communications\nConfigure verified email and SMS senders, preferences, quiet hours, translated templates, receipts, opt-outs, failed-delivery queues, and human escalation.",
      "## Referral exchange\nBuild secure provider workflows for accept, decline, request information, schedule, deliver, and outcome events, with clocks, retries, reassignment, and resident notices.",
      "## Drafts and submissions\nGenerate PDF/DOCX drafts from versioned templates. Government submission must use an approved API or explicit participant handoff and return a verified receipt.",
      "## Deployment gates\nComplete threat modeling, penetration testing, California privacy/legal review, WCAG 2.2 AA testing, recovery testing, partner agreements, training, a supervised pilot, and rollback approval.",
    ],
  );
}
