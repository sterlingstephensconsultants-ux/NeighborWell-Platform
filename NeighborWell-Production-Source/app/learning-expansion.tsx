"use client";
import { useState } from "react";
import { deliverAction } from "../lib/action-artifacts";
type Tab = "evidence" | "learning" | "sustainability" | "expansion";
const scorecards = [
  ["Resident-confirmed benefit", "68%", "Target ≥ 60%", "good"],
  ["Meaningful outcome gap", "7%", "Limit ≤ 10%", "good"],
  ["Unauthorized disclosures", "0", "Stop threshold: 1", "good"],
  ["Resident control score", "88%", "Target ≥ 85%", "good"],
  ["Partner operating margin", "4%", "Target ≥ 8%", "watch"],
  ["Navigator caseload health", "82%", "Target ≥ 80%", "good"],
];
export default function LearningExpansion({
  onExit,
  onPilot,
}: {
  onExit: () => void;
  onPilot: () => void;
}) {
  const [tab, setTab] = useState<Tab>("evidence");
  const [investment, setInvestment] = useState(650);
  const [decision, setDecision] = useState(false);
  const [note, setNote] = useState("");
  function flash(s: string) {
    deliverAction(s);
    setNote(s);
    window.setTimeout(() => setNote(""), 3000);
  }
  return (
    <main className="learn-shell">
      <header className="learn-top">
        <button className="brand" onClick={onExit}>
          <span className="brand-mark">
            <i></i>
            <i></i>
            <i></i>
          </span>
          <span>
            <b>NeighborWell</b>
            <small>Evidence, learning, and stewardship</small>
          </span>
        </button>
        <span className="learn-state">
          <i></i>Expansion decision <b>Improve first</b>
        </span>
        <button onClick={onPilot}>Pilot operations ↗</button>
        <button onClick={onExit}>Resident experience ↗</button>
      </header>
      <div className="learn-layout">
        <aside className="learn-nav">
          <p>PHASE 15</p>
          <h2>Learning & Expansion</h2>
          <small>Scale evidence and governance—not assumptions.</small>
          <nav>
            {(
              [
                ["evidence", "Evidence review", "◎"],
                ["learning", "Learning system", "↺"],
                ["sustainability", "Sustainability", "◇"],
                ["expansion", "Expansion studio", "↗"],
              ] as const
            ).map(([id, label, icon]) => (
              <button
                key={id}
                className={tab === id ? "active" : ""}
                onClick={() => setTab(id)}
              >
                <span>{icon}</span>
                {label}
              </button>
            ))}
          </nav>
          <div>
            <b>Responsible growth rule</b>
            <p>
              Communities may adapt, govern, pause, or reject NeighborWell. Geography
              never expands automatically.
            </p>
          </div>
        </aside>
        <section className="learn-main">
          {tab === "evidence" && (
            <>
              <Head
                over="POST-PILOT EVIDENCE REVIEW"
                title="Decide from outcomes—not momentum."
                text="Illustrative pilot results remain separate from verified real-world evidence until the supervised pilot is conducted."
              />
              <section className="decision-card">
                <div>
                  <small>ILLUSTRATIVE DECISION</small>
                  <h2>Improve locally before geographic expansion</h2>
                  <p>
                    Resident benefit, safety, and control meet targets. Partner
                    operating sustainability requires improvement.
                  </p>
                </div>
                <strong>IMPROVE</strong>
                <button onClick={() => setTab("sustainability")}>
                  Examine constraint →
                </button>
              </section>
              <div className="scorecards">
                {scorecards.map((x) => (
                  <article key={x[0]}>
                    <small>{x[0]}</small>
                    <b>{x[1]}</b>
                    <em>{x[2]}</em>
                    <span className={x[3]}></span>
                  </article>
                ))}
              </div>
              <div className="evidence-split">
                <section>
                  <header>
                    <h2>Truthful outcome ladder</h2>
                    <p>Each level remains a separate fact.</p>
                  </header>
                  {[
                    ["1", "Referral sent", "89"],
                    ["2", "Provider accepted", "76"],
                    ["3", "Service delivered", "64"],
                    ["4", "Resident confirms benefit", "52"],
                    ["5", "Benefit sustained at 30 days", "43"],
                  ].map((x) => (
                    <article key={x[0]}>
                      <span>{x[0]}</span>
                      <p>
                        <b>{x[1]}</b>
                        <small>{x[2]} of 100 enrolled residents</small>
                      </p>
                      <meter min="0" max="100" value={x[2]} />
                    </article>
                  ))}
                </section>
                <aside>
                  <small>INTERPRETATION</small>
                  <h2>Activity is not impact.</h2>
                  <p>
                    Fifty-two residents reported meaningful assistance.
                    Forty-three still reported benefit after 30 days. NeighborWell does
                    not call all 89 referrals successful.
                  </p>
                  <button
                    onClick={() =>
                      flash(
                        "Outcome lineage opened with limitations and missing data.",
                      )
                    }
                  >
                    Inspect evidence lineage →
                  </button>
                </aside>
              </div>
            </>
          )}
          {tab === "learning" && (
            <>
              <Head
                over="CONTINUOUS LEARNING SYSTEM"
                title="Improve without rewriting history."
                text="Changes remain versioned, challengeable, reversible, and traceable to evidence and community review."
              />
              <div className="learning-loop">
                {[
                  ["Observe", "Resident outcomes, incidents, burden, equity"],
                  [
                    "Interpret",
                    "Separate signal, uncertainty, and missing evidence",
                  ],
                  [
                    "Co-design",
                    "Residents, navigators, providers, rights reviewers",
                  ],
                  ["Test", "Supervised scenarios before live changes"],
                  ["Authorize", "Named human approval and rollback conditions"],
                  [
                    "Measure again",
                    "Compare outcomes without erasing prior versions",
                  ],
                ].map((x, i) => (
                  <article key={x[0]}>
                    <span>{i + 1}</span>
                    <h2>{x[0]}</h2>
                    <p>{x[1]}</p>
                  </article>
                ))}
              </div>
              <section className="change-ledger">
                <header>
                  <h2>Learning ledger</h2>
                  <p>Recent evidence-driven changes</p>
                </header>
                {[
                  [
                    "Referral language simplified",
                    "Resident comprehension increased 11 points",
                    "Active",
                  ],
                  [
                    "Provider response clock adjusted",
                    "Reduced false escalation for weekend referrals",
                    "Review",
                  ],
                  [
                    "Career pathway recommendation paused",
                    "Evidence coverage below threshold",
                    "Protected",
                  ],
                ].map((x) => (
                  <article key={x[0]}>
                    <div>
                      <b>{x[0]}</b>
                      <small>{x[1]}</small>
                    </div>
                    <strong>{x[2]}</strong>
                    <button onClick={() => flash("Version comparison opened.")}>
                      Compare versions →
                    </button>
                  </article>
                ))}
              </section>
            </>
          )}
          {tab === "sustainability" && (
            <>
              <Head
                over="PUBLIC-BENEFIT SUSTAINABILITY"
                title="Fund the system without monetizing desperation."
                text="Residents retain free core navigation. Revenue supports verification, coordination, governance, and infrastructure."
              />
              <div className="funding-model">
                {[
                  [
                    "Public contracts",
                    "Network coordination and verified outcomes",
                    "38%",
                  ],
                  [
                    "Provider subscriptions",
                    "Affordable operational tools; no ranking influence",
                    "24%",
                  ],
                  [
                    "Foundation support",
                    "Access, evaluation, and community governance",
                    "22%",
                  ],
                  [
                    "Implementation services",
                    "Training, integration, and responsible deployment",
                    "16%",
                  ],
                ].map((x) => (
                  <article key={x[0]}>
                    <h2>{x[0]}</h2>
                    <p>{x[1]}</p>
                    <strong>{x[2]}</strong>
                  </article>
                ))}
              </div>
              <div className="sustain-sim">
                <section>
                  <small>ANNUAL NETWORK INVESTMENT</small>
                  <h2>Model operational durability</h2>
                  <label>
                    <span>
                      Available investment <b>{"$" + investment + ",000"}</b>
                    </span>
                    <input
                      type="range"
                      min="350"
                      max="1200"
                      step="50"
                      value={investment}
                      onChange={(e) => setInvestment(Number(e.target.value))}
                    />
                  </label>
                  <div>
                    <p>
                      <b>{Math.round(investment / 78)}</b>
                      <small>funded navigator equivalents</small>
                    </p>
                    <p>
                      <b>{Math.round(investment / 42)}</b>
                      <small>verified program records</small>
                    </p>
                    <p>
                      <b>{investment >= 750 ? "12" : "7"} mo</b>
                      <small>operating reserve</small>
                    </p>
                  </div>
                </section>
                <aside>
                  <h2>Non-negotiable boundaries</h2>
                  <p>✓ No sale of resident data</p>
                  <p>✓ No advertising against urgent needs</p>
                  <p>✓ No pay-to-rank providers</p>
                  <p>✓ No core navigation fee for residents</p>
                  <p>✓ Public-benefit governance retains veto authority</p>
                </aside>
              </div>
            </>
          )}
          {tab === "expansion" && (
            <>
              <Head
                over="RESPONSIBLE EXPANSION STUDIO"
                title="A new community is not a copy-and-paste market."
                text="Expansion requires local authority, verified evidence, operational capacity, rights review, and a reversible learning period."
              />
              <div className="expansion-gates">
                {[
                  [
                    "Local governance",
                    "Community oversight body has decision authority",
                    "Ready",
                  ],
                  [
                    "Needs evidence",
                    "Resident and provider discovery completed",
                    "Ready",
                  ],
                  [
                    "Program truth",
                    "Local sources and verification owners identified",
                    "Review",
                  ],
                  [
                    "Operational capacity",
                    "Funded navigators and escalation coverage",
                    "Blocked",
                  ],
                  [
                    "Legal and safety",
                    "Jurisdiction-specific reviews complete",
                    "Blocked",
                  ],
                  [
                    "Community approval",
                    "Public-benefit conditions accepted",
                    "Pending",
                  ],
                ].map((x) => (
                  <article key={x[0]}>
                    <span className={x[2].toLowerCase()}>
                      {x[2] === "Ready" ? "✓" : x[2] === "Blocked" ? "!" : "◌"}
                    </span>
                    <div>
                      <b>{x[0]}</b>
                      <small>{x[1]}</small>
                    </div>
                    <strong>{x[2]}</strong>
                  </article>
                ))}
              </div>
              <section className="expansion-decision">
                <div>
                  <small>EXPANSION AUTHORIZATION</small>
                  <h2>East Contra Costa County learning site</h2>
                  <p>
                    Two required gates are blocked. NeighborWell may continue
                    discovery, but cannot enroll residents or import Alameda
                    assumptions as local truth.
                  </p>
                </div>
                <label>
                  <input
                    type="checkbox"
                    checked={decision}
                    onChange={(e) => setDecision(e.target.checked)}
                  />
                  <span>
                    <b>Record “discovery only” authorization</b>
                    <small>
                      No resident data or live recommendations permitted.
                    </small>
                  </span>
                </label>
                <button
                  disabled={!decision}
                  onClick={() =>
                    flash("Discovery-only decision recorded with review date.")
                  }
                >
                  Record accountable decision →
                </button>
              </section>
            </>
          )}
        </section>
      </div>
      {note && (
        <div className="learn-toast" role="status">
          ✓ {note}
        </div>
      )}
    </main>
  );
}
function Head({
  over,
  title,
  text,
}: {
  over: string;
  title: string;
  text: string;
}) {
  return (
    <div className="learn-heading">
      <p>{over}</p>
      <h1>{title}</h1>
      <span>{text}</span>
    </div>
  );
}
