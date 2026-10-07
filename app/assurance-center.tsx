"use client";
import { useState } from "react";
import { deliverAction } from "../lib/action-artifacts";

type Domain = "security" | "privacy" | "accessibility" | "ai" | "compliance";
const suites = [
  {
    id: "security" as Domain,
    mark: "◇",
    name: "Security",
    score: 92,
    passed: 46,
    open: 3,
    summary: "Identity, authorization, encryption, isolation, resilience",
  },
  {
    id: "privacy" as Domain,
    mark: "◎",
    name: "Privacy",
    score: 95,
    passed: 31,
    open: 2,
    summary: "Consent, minimization, retention, disclosure, resident rights",
  },
  {
    id: "accessibility" as Domain,
    mark: "◉",
    name: "Accessibility",
    score: 89,
    passed: 38,
    open: 4,
    summary: "Keyboard, screen reader, contrast, language, cognition",
  },
  {
    id: "ai" as Domain,
    mark: "✦",
    name: "AI safety",
    score: 91,
    passed: 42,
    open: 3,
    summary: "Evidence grounding, uncertainty, bias, escalation, agency",
  },
  {
    id: "compliance" as Domain,
    mark: "§",
    name: "Compliance",
    score: 78,
    passed: 24,
    open: 7,
    summary: "Control mapping, policy evidence, legal and independent review",
  },
];
const controls: Record<
  Domain,
  {
    title: string;
    method: string;
    status: "pass" | "review" | "external";
    owner: string;
    evidence: string;
  }[]
> = {
  security: [
    {
      title: "Cross-organization access isolation",
      method: "Attempt 128 prohibited record requests across six roles",
      status: "pass",
      owner: "Security Engineering",
      evidence: "128/128 denied and receipted",
    },
    {
      title: "Consent-revocation race condition",
      method: "Revoke during referral and document exchange",
      status: "pass",
      owner: "Platform Engineering",
      evidence: "Processing stopped in 240 ms",
    },
    {
      title: "Independent penetration test",
      method: "External authenticated and unauthenticated assessment",
      status: "external",
      owner: "Independent assessor",
      evidence: "Required before live pilot",
    },
  ],
  privacy: [
    {
      title: "Purpose and field minimization",
      method: "Compare requested payloads against active consent grants",
      status: "pass",
      owner: "Privacy Engineering",
      evidence: "0 excess fields in 500 simulations",
    },
    {
      title: "Resident data-access request",
      method:
        "Generate readable identity, consent, referral, and ledger export",
      status: "pass",
      owner: "Resident Rights Office",
      evidence: "Complete export in 42 seconds",
    },
    {
      title: "California privacy legal review",
      method:
        "Qualified counsel reviews notices, rights, contracts, and exclusions",
      status: "external",
      owner: "Privacy counsel",
      evidence: "Counsel engagement required",
    },
  ],
  accessibility: [
    {
      title: "Keyboard-only critical journey",
      method:
        "Complete consent, story, action review, referral, and revocation",
      status: "pass",
      owner: "Accessibility Lead",
      evidence: "All critical controls reachable",
    },
    {
      title: "Text contrast and reflow",
      method: "Automated contrast plus 200% and 400% visual review",
      status: "review",
      owner: "Design Systems",
      evidence: "Two secondary labels need adjustment",
    },
    {
      title: "Disabled-user usability study",
      method: "Moderated testing with compensated participants",
      status: "external",
      owner: "Research Partner",
      evidence: "Schedule before pilot launch",
    },
  ],
  ai: [
    {
      title: "Unsupported recommendation resistance",
      method: "Prompt engine with missing, stale, and quarantined evidence",
      status: "pass",
      owner: "AI Assurance",
      evidence: "Unsafe recommendation rate: 0%",
    },
    {
      title: "Resident correction persistence",
      method: "Correct extracted need and regenerate reasoning receipt",
      status: "pass",
      owner: "AI Assurance",
      evidence: "Correction preserved across all stages",
    },
    {
      title: "Disparate-impact challenge set",
      method: "Compare match and priority behavior across equivalent cases",
      status: "review",
      owner: "Equity Review Board",
      evidence: "Language-access variance under review",
    },
  ],
  compliance: [
    {
      title: "Control-to-evidence traceability",
      method:
        "Map every asserted control to owner, test, artifact, and review date",
      status: "pass",
      owner: "Compliance Lead",
      evidence: "141 controls mapped",
    },
    {
      title: "Partner data-processing agreements",
      method:
        "Legal review of processor duties, incidents, deletion, and audit rights",
      status: "external",
      owner: "Legal Counsel",
      evidence: "Required per participating vendor",
    },
    {
      title: "Regulatory applicability determination",
      method:
        "Counsel determines applicable federal, state, local, sector, and contract duties",
      status: "external",
      owner: "Legal Counsel",
      evidence: "Not represented as certification",
    },
  ],
};

export default function AssuranceCenter({
  onExit,
  onGovernance,
  onArchitecture,
}: {
  onExit: () => void;
  onGovernance: () => void;
  onArchitecture: () => void;
}) {
  const [domain, setDomain] = useState<Domain>("security");
  const [running, setRunning] = useState(false);
  const [ran, setRan] = useState(false);
  const [notice, setNotice] = useState("");
  const active = suites.find((s) => s.id === domain)!;
  function run() {
    setRunning(true);
    setRan(false);
    window.setTimeout(() => {
      setRunning(false);
      setRan(true);
    }, 1000);
  }
  function flash(s: string) {
    deliverAction(s);
    setNotice(s);
    window.setTimeout(() => setNotice(""), 3000);
  }
  return (
    <main className="assurance-shell">
      <header className="assurance-top">
        <button className="brand" onClick={onExit}>
          <span className="brand-mark">
            <i></i>
            <i></i>
            <i></i>
          </span>
          <span>
            <b>NeighborWell</b>
            <small>Assurance and release governance</small>
          </span>
        </button>
        <span className="assurance-state">
          <i></i>Pilot gate <b>Conditional</b>
        </span>
        <button onClick={onArchitecture}>Architecture ↗</button>
        <button onClick={onGovernance}>Trust center ↗</button>
        <button onClick={onExit}>Resident experience ↗</button>
      </header>
      <div className="assurance-layout">
        <aside className="assurance-rail">
          <p>PHASE 13</p>
          <h2>Assurance Center</h2>
          <small>Evidence before claims. Remediation before release.</small>
          <nav>
            {suites.map((s) => (
              <button
                key={s.id}
                className={domain === s.id ? "active" : ""}
                onClick={() => {
                  setDomain(s.id);
                  setRan(false);
                }}
              >
                <span>{s.mark}</span>
                <div>
                  <b>{s.name}</b>
                  <small>{s.score}% assurance</small>
                </div>
                <em>{s.open}</em>
              </button>
            ))}
          </nav>
          <div className="claim-warning">
            <b>Not a certification</b>
            <p>
              This validation center documents readiness evidence. Qualified
              legal, security, accessibility, and independent reviews remain
              required.
            </p>
          </div>
        </aside>
        <section className="assurance-main">
          <div className="assurance-heading">
            <div>
              <p>VALIDATION & RELEASE GOVERNANCE</p>
              <h1>Prove what NeighborWell protects.</h1>
              <span>
                Every claim is tied to a test, evidence artifact, accountable
                owner, review date, and release consequence.
              </span>
            </div>
            <button
              onClick={() =>
                flash(
                  "Pilot assurance brief prepared with unresolved risks included.",
                )
              }
            >
              Generate assurance brief
            </button>
          </div>
          <section className="release-gate">
            <div className="gate-score">
              <span>87</span>
              <small>/100</small>
            </div>
            <div>
              <p>PILOT READINESS</p>
              <h2>Conditionally ready for supervised testing</h2>
              <small>
                Prototype controls are strong. Live launch remains blocked by
                three independent reviews and production infrastructure testing.
              </small>
            </div>
            <strong>3 RELEASE BLOCKERS</strong>
          </section>
          <div className="assurance-metrics">
            <article>
              <small>CONTROLS MAPPED</small>
              <b>141</b>
              <em>100% have owners</em>
            </article>
            <article>
              <small>TESTS PASSING</small>
              <b>181</b>
              <em>Across five domains</em>
            </article>
            <article>
              <small>OPEN FINDINGS</small>
              <b>19</b>
              <em>3 block pilot release</em>
            </article>
            <article>
              <small>UNOWNED RISKS</small>
              <b>0</b>
              <em>No silent exceptions</em>
            </article>
          </div>
          <div className="suite-header">
            <div>
              <span>{active.mark}</span>
              <div>
                <small>ACTIVE VALIDATION DOMAIN</small>
                <h2>{active.name} assurance</h2>
                <p>{active.summary}</p>
              </div>
            </div>
            <div className="suite-score">
              <b>{active.score}%</b>
              <small>
                {active.passed} tests passed · {active.open} open
              </small>
            </div>
          </div>
          <div className="control-table">
            <div className="control-head">
              <span>CONTROL & TEST METHOD</span>
              <span>STATUS</span>
              <span>OWNER</span>
              <span>EVIDENCE</span>
            </div>
            {controls[domain].map((c) => (
              <article key={c.title}>
                <div>
                  <b>{c.title}</b>
                  <small>{c.method}</small>
                </div>
                <strong className={c.status}>
                  {c.status === "pass"
                    ? "✓ Passed"
                    : c.status === "review"
                      ? "! Review"
                      : "↗ External"}
                </strong>
                <span>{c.owner}</span>
                <em>{c.evidence}</em>
              </article>
            ))}
          </div>
          <div className="assurance-bottom">
            <section className="test-lab">
              <div>
                <small>CONTINUOUS CONTROL TEST</small>
                <h2>Run the protected-path challenge</h2>
                <p>
                  Uses synthetic identities to test cross-organization access,
                  expired consent, quarantined evidence, and prohibited
                  disclosure.
                </p>
              </div>
              <button onClick={run} disabled={running}>
                {running
                  ? "Testing…"
                  : ran
                    ? "✓ All attacks contained"
                    : "Run challenge suite →"}
              </button>
              {ran && (
                <div className="test-result">
                  <span>✓</span>
                  <p>
                    <b>24/24 prohibited actions contained</b>
                    <small>
                      No resident data used · receipts sealed · evidence
                      snapshot available
                    </small>
                  </p>
                </div>
              )}
            </section>
            <aside className="release-blockers">
              <small>RELEASE BLOCKERS</small>
              <h2>What still requires people.</h2>
              <ol>
                <li>
                  <span>1</span>
                  <p>
                    <b>Independent penetration test</b>
                    <small>External security assessor</small>
                  </p>
                </li>
                <li>
                  <span>2</span>
                  <p>
                    <b>Legal applicability and privacy review</b>
                    <small>Qualified California counsel</small>
                  </p>
                </li>
                <li>
                  <span>3</span>
                  <p>
                    <b>Disabled-user usability study</b>
                    <small>Compensated community participants</small>
                  </p>
                </li>
              </ol>
              <button
                onClick={() => flash("Release-blocker ownership plan opened.")}
              >
                Open remediation plan →
              </button>
            </aside>
          </div>
        </section>
      </div>
      {notice && (
        <div className="assurance-toast" role="status">
          ✓ {notice}
        </div>
      )}
    </main>
  );
}
