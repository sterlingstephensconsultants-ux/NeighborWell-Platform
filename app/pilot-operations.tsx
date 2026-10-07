"use client";
import { useState } from "react";
import { deliverAction } from "../lib/action-artifacts";
type Tab = "command" | "partners" | "academy" | "safeguards" | "evaluation";
const gates = [
  ["Independent penetration test", "Blocked", "External assessor"],
  ["Privacy and legal approval", "Blocked", "Qualified counsel"],
  ["Disabled-user usability study", "Scheduled", "Research partner"],
  ["Partner operating agreements", "In progress", "Pilot director"],
  ["Navigator competency", "On track", "Training lead"],
  ["Incident response rehearsal", "Ready", "Safety officer"],
];
const partners = [
  ["Bay Community Alliance", "Housing stability", "Ready"],
  ["East Bay Opportunity Center", "Income recovery", "Review"],
  ["Community Health Bridge", "Coverage navigation", "Ready"],
  ["Alameda Pantry Network", "Food access", "Blocked"],
];
export default function PilotOperations({
  onExit,
  onAssurance,
}: {
  onExit: () => void;
  onAssurance: () => void;
}) {
  const [tab, setTab] = useState<Tab>("command");
  const [arrivals, setArrivals] = useState(8);
  const [ran, setRan] = useState(false);
  const [note, setNote] = useState("");
  function flash(s: string) {
    deliverAction(s);
    setNote(s);
    window.setTimeout(() => setNote(""), 3000);
  }
  return (
    <main className="pilot-shell">
      <header className="pilot-top">
        <button className="brand" onClick={onExit}>
          <span className="brand-mark">
            <i></i>
            <i></i>
            <i></i>
          </span>
          <span>
            <b>NeighborWell</b>
            <small>Alameda County supervised pilot</small>
          </span>
        </button>
        <span className="pilot-status">
          <i></i>Pre-launch control <b>3 blockers</b>
        </span>
        <button onClick={onAssurance}>Assurance ↗</button>
        <button onClick={onExit}>Resident experience ↗</button>
      </header>
      <div className="pilot-layout">
        <aside className="pilot-nav">
          <p>PHASE 14</p>
          <h2>Pilot Operations</h2>
          <small>
            One supervised service area · 90 days · resident authority preserved
          </small>
          <nav>
            {(
              [
                ["command", "Command center", "⌘"],
                ["partners", "Partner readiness", "◇"],
                ["academy", "Navigator academy", "◎"],
                ["safeguards", "Resident safeguards", "◉"],
                ["evaluation", "Evaluation studio", "↗"],
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
            <b>Pilot boundary</b>
            <p>
              Oakland service area
              <br />5 connected needs
              <br />
              50–100 residents
              <br />
              5–10 navigators
              <br />
              3–5 partners
            </p>
          </div>
        </aside>
        <section className="pilot-main">
          {tab === "command" && (
            <>
              <Head
                over="90-DAY SUPERVISED PILOT"
                title="Launch carefully. Learn truthfully."
                text="NeighborWell advances only when people, protections, partners, and technology are ready together."
              />
              <section className="launch-decision">
                <div>
                  <small>LAUNCH DECISION</small>
                  <h2>Not yet authorized for resident enrollment</h2>
                  <p>
                    The operating model is ready for rehearsal. Three external
                    assurance conditions still block live enrollment.
                  </p>
                </div>
                <strong>HOLD</strong>
                <button onClick={onAssurance}>Resolve blockers →</button>
              </section>
              <div className="pilot-metrics">
                {[
                  ["PARTNERS", "3/4", "One verification hold"],
                  ["NAVIGATORS", "7/8", "One coaching plan"],
                  ["PROGRAMS", "16/20", "Four in review"],
                  ["OPERATING COVERAGE", "94%", "Two shifts uncovered"],
                ].map((x) => (
                  <article key={x[0]}>
                    <small>{x[0]}</small>
                    <b>{x[1]}</b>
                    <em>{x[2]}</em>
                  </article>
                ))}
              </div>
              <div className="pilot-split">
                <section className="gate-board">
                  <header>
                    <h2>Launch-gate control</h2>
                    <p>
                      Requirements cannot be overridden by schedule pressure.
                    </p>
                  </header>
                  {gates.map((g) => (
                    <article key={g[0]}>
                      <span
                        className={
                          g[1] === "Blocked"
                            ? "bad"
                            : g[1] === "Ready"
                              ? "good"
                              : "watch"
                        }
                      >
                        {g[1] === "Blocked"
                          ? "!"
                          : g[1] === "Ready"
                            ? "✓"
                            : "◌"}
                      </span>
                      <p>
                        <b>{g[0]}</b>
                        <small>Owner: {g[2]}</small>
                      </p>
                      <em>{g[1]}</em>
                    </article>
                  ))}
                </section>
                <aside className="rehearsal">
                  <small>OPERATIONS REHEARSAL</small>
                  <h2>Simulate a pilot day.</h2>
                  <label>
                    <span>
                      Resident arrivals <b>{arrivals}</b>
                    </span>
                    <input
                      type="range"
                      min="0"
                      max="18"
                      value={arrivals}
                      onChange={(e) => {
                        setArrivals(Number(e.target.value));
                        setRan(false);
                      }}
                    />
                  </label>
                  <dl>
                    <div>
                      <dt>Navigator load</dt>
                      <dd>
                        {arrivals < 8
                          ? "Sustainable"
                          : arrivals < 14
                            ? "Watch"
                            : "Escalate"}
                      </dd>
                    </div>
                    <div>
                      <dt>First response</dt>
                      <dd>
                        {arrivals < 8
                          ? "18 min"
                          : arrivals < 14
                            ? "34 min"
                            : "61 min"}
                      </dd>
                    </div>
                    <div>
                      <dt>Coverage risk</dt>
                      <dd>{arrivals < 14 ? "Low" : "High"}</dd>
                    </div>
                  </dl>
                  <button onClick={() => setRan(true)}>
                    Run supervised rehearsal →
                  </button>
                  {ran && (
                    <p className={arrivals < 14 ? "safe" : "risk"}>
                      {arrivals < 14
                        ? "✓ Capacity safeguards held."
                        : "! Surge protocol activated; four cases paused safely."}
                    </p>
                  )}
                </aside>
              </div>
            </>
          )}
          {tab === "partners" && (
            <>
              <Head
                over="PARTNER READINESS"
                title="Every organization must be ready to receive trust."
                text="Programs, agreements, staff authority, capacity, response standards, and escalation paths are verified separately."
              />
              <section className="partner-list">
                {partners.map((p) => (
                  <article key={p[0]}>
                    <div>
                      <b>{p[0]}</b>
                      <small>Alameda County pilot partner</small>
                    </div>
                    <span>{p[1]}</span>
                    <strong className={p[2].toLowerCase()}>{p[2]}</strong>
                    <button
                      onClick={() => flash(p[0] + " readiness record opened.")}
                    >
                      Open →
                    </button>
                  </article>
                ))}
              </section>
              <div className="principles">
                {[
                  ["No pay-to-rank", "Funding never changes service priority."],
                  [
                    "Minimum necessary data",
                    "Partners receive only the approved referral scope.",
                  ],
                  [
                    "Resident outcome authority",
                    "Provider closure never erases resident confirmation.",
                  ],
                ].map((x) => (
                  <article key={x[0]}>
                    <span>◇</span>
                    <h2>{x[0]}</h2>
                    <p>{x[1]}</p>
                  </article>
                ))}
              </div>
            </>
          )}
          {tab === "academy" && (
            <>
              <Head
                over="NAVIGATOR ACADEMY"
                title="Train judgment—not button clicking."
                text="Navigators demonstrate consent practice, service knowledge, trauma-aware communication, escalation judgment, and honest outcome recording."
              />
              <div className="academy">
                {[
                  ["Resident authority", "8/8"],
                  ["Consent in practice", "8/8"],
                  ["Program evidence", "7/8"],
                  ["Safety escalation", "7/8"],
                  ["Outcome truth", "6/8"],
                ].map((x, i) => (
                  <article key={x[0]}>
                    <span>{i + 1}</span>
                    <p>
                      <b>{x[0]}</b>
                      <small>Scenario assessment + observed practice</small>
                    </p>
                    <strong>{x[1]}</strong>
                  </article>
                ))}
                <aside>
                  <b>Coaching signal</b>
                  <p>
                    Two navigators treated provider completion as resident
                    success. Independent resident confirmation remains required.
                  </p>
                </aside>
              </div>
            </>
          )}
          {tab === "safeguards" && (
            <>
              <Head
                over="RESIDENT SAFEGUARDS"
                title="Participation must never become pressure."
                text="Residents may decline, pause, correct, appeal, revoke, or leave without losing access to ordinary services."
              />
              <div className="safeguards">
                {[
                  [
                    "Voluntary entry",
                    "No service is conditioned on joining NeighborWell.",
                  ],
                  [
                    "Readable consent",
                    "Purpose, recipient, fields, duration, and revocation are shown.",
                  ],
                  [
                    "Human alternative",
                    "A navigator pathway remains available without AI.",
                  ],
                  [
                    "Crisis boundary",
                    "NeighborWell escalates to trained humans; it does not impersonate care.",
                  ],
                  [
                    "Independent complaint",
                    "Oversight remains reachable outside the provider.",
                  ],
                  [
                    "Exit and deletion",
                    "Participation can end with minimized accountability records.",
                  ],
                ].map((x) => (
                  <article key={x[0]}>
                    <span>◇</span>
                    <h2>{x[0]}</h2>
                    <p>{x[1]}</p>
                  </article>
                ))}
              </div>
            </>
          )}
          {tab === "evaluation" && (
            <>
              <Head
                over="EVALUATION STUDIO"
                title="Measure whether help arrived—and at what cost."
                text="Activity, delivery, resident benefit, equity, safety, burden, and sustainability remain separate measures."
              />
              <div className="measures">
                {[
                  [
                    "Primary outcome",
                    "Resident-confirmed meaningful assistance",
                    "Target ≥ 60%",
                  ],
                  [
                    "Access",
                    "Median time to first human response",
                    "Target < 1 day",
                  ],
                  [
                    "Truthfulness",
                    "Provider closure without resident confirmation",
                    "Report separately",
                  ],
                  [
                    "Equity",
                    "Outcome gaps by language and access need",
                    "No gap > 10%",
                  ],
                  [
                    "Safety",
                    "Unauthorized disclosure or harmful automation",
                    "Target: 0",
                  ],
                  [
                    "Burden",
                    "Repeated information and resident effort",
                    "Reduce baseline",
                  ],
                  [
                    "Operations",
                    "Navigator time per resolved need",
                    "Track carefully",
                  ],
                  [
                    "Trust",
                    "Resident understanding and control",
                    "Target ≥ 85%",
                  ],
                ].map((x) => (
                  <article key={x[0]}>
                    <small>{x[0]}</small>
                    <b>{x[1]}</b>
                    <em>{x[2]}</em>
                  </article>
                ))}
              </div>
              <section className="preregister">
                <span>◆</span>
                <div>
                  <h2>Pre-register evaluation before enrollment.</h2>
                  <p>
                    Success criteria, exclusions, comparison logic, adverse
                    events, and stop conditions must be fixed before results are
                    known.
                  </p>
                </div>
                <button
                  onClick={() =>
                    flash("Evaluation registration draft prepared.")
                  }
                >
                  Prepare registration →
                </button>
              </section>
            </>
          )}
        </section>
      </div>
      {note && (
        <div className="pilot-toast" role="status">
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
    <div className="pilot-heading">
      <p>{over}</p>
      <h1>{title}</h1>
      <span>{text}</span>
    </div>
  );
}
