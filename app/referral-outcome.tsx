"use client";

import { useState } from "react";
import { deliverAction } from "../lib/action-artifacts";

type Stage =
  | "authorized"
  | "routed"
  | "accepted"
  | "scheduled"
  | "delivered"
  | "confirmed";
const stages: { id: Stage; label: string; detail: string }[] = [
  {
    id: "authorized",
    label: "Authorized",
    detail: "Resident approved 8 fields",
  },
  { id: "routed", label: "Routed", detail: "Matched to verified program" },
  { id: "accepted", label: "Accepted", detail: "Provider acknowledged" },
  { id: "scheduled", label: "Scheduled", detail: "Appointment confirmed" },
  { id: "delivered", label: "Delivered", detail: "Provider reported service" },
  { id: "confirmed", label: "Confirmed", detail: "Resident reports outcome" },
];

export default function ReferralOutcomeEngine({
  onExit,
  onProvider,
}: {
  onExit: () => void;
  onProvider: () => void;
}) {
  const [stage, setStage] = useState<Stage>("accepted");
  const [tab, setTab] = useState<"journey" | "queue" | "outcomes" | "receipt">(
    "journey",
  );
  const [consent, setConsent] = useState(true);
  const [helpful, setHelpful] = useState<"yes" | "partly" | "no" | null>(null);
  const [notice, setNotice] = useState("");
  const index = stages.findIndex((s) => s.id === stage);
  const advance = () => {
    if (index < stages.length - 1) {
      setStage(stages[index + 1].id);
      setNotice(
        `Recorded: ${stages[index + 1].label}. The previous event remains unchanged.`,
      );
    }
  };
  const statusCopy =
    stage === "accepted"
      ? "Response clock active · 19h remaining"
      : stage === "scheduled"
        ? "Appointment · Aug 14 at 2:30 PM"
        : stage === "delivered"
          ? "Awaiting resident confirmation"
          : stage === "confirmed"
            ? "Outcome closed with resident voice"
            : "Consent and routing checks passed";
  return (
    <main className="roe-shell">
      <header className="roe-top">
        <button className="brand" onClick={() => setTab("journey")}>
          <span className="brand-mark">
            <i></i>
            <i></i>
            <i></i>
          </span>
          <span>
            <b>NeighborWell</b>
            <small>Referral & outcome engine</small>
          </span>
        </button>
        <div className="roe-live">
          <i /> Controlled lifecycle · policy v4.2
        </div>
        <button onClick={onProvider}>Provider workspace ↗</button>
        <button onClick={onExit}>Resident experience ↗</button>
      </header>
      <div className="roe-layout">
        <aside className="roe-nav">
          <small>PHASE 10 CONTROL</small>
          {(
            [
              ["journey", "Live journey"],
              ["queue", "Network queue"],
              ["outcomes", "Outcome truth"],
              ["receipt", "Event receipt"],
            ] as const
          ).map(([id, label]) => (
            <button
              className={tab === id ? "active" : ""}
              key={id}
              onClick={() => setTab(id)}
            >
              <span>
                {id === "journey"
                  ? "↳"
                  : id === "queue"
                    ? "≡"
                    : id === "outcomes"
                      ? "◎"
                      : "◇"}
              </span>
              {label}
            </button>
          ))}
          <div className="roe-rule">
            <b>Truth rule</b>
            <small>
              Provider completion never becomes resident-confirmed success
              automatically.
            </small>
          </div>
        </aside>
        <section className="roe-main">
          <div className="roe-heading">
            <div>
              <p className="eyebrow">CLOSED-LOOP COORDINATION</p>
              <h1>
                {tab === "journey"
                  ? "From permission to proven help."
                  : tab === "queue"
                    ? "Every referral has an owner and clock."
                    : tab === "outcomes"
                      ? "Activity is not the same as impact."
                      : "A permanent, reviewable chain of events."}
              </h1>
              <p>
                Every transition is consent-aware, attributable, reversible
                where possible, and visible to the resident.
              </p>
            </div>
            <span className="roe-case">
              CASE CIV-240812-017
              <br />
              <b>{statusCopy}</b>
            </span>
          </div>
          {tab === "journey" && (
            <>
              <div className="stage-track">
                {stages.map((s, i) => (
                  <button
                    key={s.id}
                    className={`${i < index ? "done" : ""} ${i === index ? "current" : ""}`}
                    onClick={() => i <= index && setStage(s.id)}
                  >
                    <span>{i < index ? "✓" : i + 1}</span>
                    <b>{s.label}</b>
                    <small>{s.detail}</small>
                  </button>
                ))}
              </div>
              <div className="roe-grid">
                <article className="case-control">
                  <div className="case-title">
                    <span>MS</span>
                    <div>
                      <small>RESIDENT-CONTROLLED CONNECTION</small>
                      <h2>Maya S. · Housing stabilization</h2>
                      <p>Bay Community Alliance · Emergency Rent Prevention</p>
                    </div>
                  </div>
                  <div className="consent-gate">
                    <span>{consent ? "✓" : "!"}</span>
                    <div>
                      <b>
                        {consent
                          ? "Active purpose-bound consent"
                          : "Consent revoked—workflow paused"}
                      </b>
                      <small>
                        8 approved fields · Housing stabilization only · Expires
                        Sep 12
                      </small>
                    </div>
                    <button onClick={() => setConsent(!consent)}>
                      {consent ? "Revoke" : "Restore demo consent"}
                    </button>
                  </div>
                  <dl className="case-facts">
                    <div>
                      <dt>Current stage</dt>
                      <dd>{stages[index].label}</dd>
                    </div>
                    <div>
                      <dt>Accountable owner</dt>
                      <dd>Nia Williams · Navigator</dd>
                    </div>
                    <div>
                      <dt>Response standard</dt>
                      <dd>24 hours · 19 remaining</dd>
                    </div>
                    <div>
                      <dt>Last resident notice</dt>
                      <dd>12 minutes ago · secure message</dd>
                    </div>
                  </dl>
                  <div className="transition-box">
                    <small>NEXT LEGAL TRANSITION</small>
                    <h3>
                      {index < stages.length - 1
                        ? stages[index + 1].label
                        : "Outcome monitoring"}
                    </h3>
                    <p>
                      {index === 4
                        ? "The resident—not the provider—decides whether assistance was received and helpful."
                        : "NeighborWell checks consent, required evidence, program status, and transition policy before recording this event."}
                    </p>
                    {index === 4 ? (
                      <div className="helpful-choice">
                        {(["yes", "partly", "no"] as const).map((v) => (
                          <button
                            className={helpful === v ? "selected" : ""}
                            onClick={() => setHelpful(v)}
                            key={v}
                          >
                            {v === "yes"
                              ? "Yes, it helped"
                              : v === "partly"
                                ? "Partly"
                                : "No, I still need help"}
                          </button>
                        ))}
                      </div>
                    ) : null}
                    <button
                      className="advance"
                      disabled={
                        !consent || (index === 4 && !helpful) || index === 5
                      }
                      onClick={advance}
                    >
                      {index === 5
                        ? "Lifecycle complete"
                        : "Validate and record transition →"}
                    </button>
                  </div>
                </article>
                <aside className="integrity-panel">
                  <small>LIVE INTEGRITY CHECKS</small>
                  <h2>Five gates protect this transition.</h2>
                  {[
                    ["Consent", "Active · field scope valid"],
                    ["Program truth", "Verified · v3.2"],
                    ["Authority", "Nia may coordinate"],
                    [
                      "State policy",
                      `${stages[index].label} → ${index < 5 ? stages[index + 1].label : "monitor"}`,
                    ],
                    ["Resident notice", "Required on completion"],
                  ].map(([a, b], i) => (
                    <div key={a}>
                      <span>{!consent && i === 0 ? "!" : "✓"}</span>
                      <p>
                        <b>{a}</b>
                        <small>
                          {!consent && i === 0
                            ? "Blocked · no disclosure permitted"
                            : b}
                        </small>
                      </p>
                    </div>
                  ))}
                  <button onClick={() => setTab("receipt")}>
                    Inspect decision receipt →
                  </button>
                </aside>
              </div>
            </>
          )}
          {tab === "queue" && (
            <div className="queue-board">
              <div className="queue-metrics">
                <article>
                  <small>OPEN CONNECTIONS</small>
                  <b>32</b>
                  <span>Across 9 programs</span>
                </article>
                <article>
                  <small>AT RISK OF DELAY</small>
                  <b>4</b>
                  <span>Human review assigned</span>
                </article>
                <article>
                  <small>MEDIAN RESPONSE</small>
                  <b>18h</b>
                  <span>Target: 24 hours</span>
                </article>
                <article>
                  <small>UNOWNED</small>
                  <b>0</b>
                  <span>Accountability intact</span>
                </article>
              </div>
              <section>
                <div className="queue-row head">
                  <span>Resident-approved need</span>
                  <span>Current owner</span>
                  <span>Clock</span>
                  <span>Stage</span>
                  <span>Safeguard</span>
                </div>
                {[
                  [
                    "Maya S. · Housing",
                    "Nia Williams",
                    "19h left",
                    "Accepted",
                    "Consent active",
                  ],
                  [
                    "Jordan L. · Food + income",
                    "Omar Chen",
                    "6h left",
                    "Scheduled",
                    "Resident notified",
                  ],
                  [
                    "Alex R. · Health coverage",
                    "Elena Ruiz",
                    "2d 4h",
                    "Delivered",
                    "Confirmation due",
                  ],
                  [
                    "R. K. · Employment",
                    "Unassigned",
                    "Paused",
                    "Authorized",
                    "Human routing",
                  ],
                ].map((r, i) => (
                  <div
                    className={`queue-row ${i === 3 ? "paused" : ""}`}
                    key={r[0]}
                  >
                    {r.map((v, j) => (
                      <span key={v}>
                        {j === 0 && (
                          <i>
                            {i === 0
                              ? "MS"
                              : i === 1
                                ? "JL"
                                : i === 2
                                  ? "AR"
                                  : "RK"}
                          </i>
                        )}
                        <b>{v}</b>
                      </span>
                    ))}
                  </div>
                ))}
              </section>
            </div>
          )}
          {tab === "outcomes" && (
            <div className="truth-layout">
              <section>
                <div className="truth-number">
                  <small>REFERRALS STARTED</small>
                  <b>1,284</b>
                  <span>Trailing 90 days</span>
                </div>
                <div className="truth-funnel">
                  {[
                    ["Provider accepted", 1018, 79],
                    ["Provider reported delivery", 842, 66],
                    ["Resident confirmed receipt", 731, 57],
                    ["Resident said it helped", 654, 51],
                  ].map(([a, b, c]) => (
                    <div key={String(a)}>
                      <p>
                        <b>{a}</b>
                        <span>
                          {b} · {c}%
                        </span>
                      </p>
                      <meter min="0" max="100" value={Number(c)} />
                    </div>
                  ))}
                </div>
              </section>
              <aside>
                <small>ACCOUNTABILITY GAP</small>
                <h2>111 services lack resident confirmation.</h2>
                <p>
                  NeighborWell does not count them as successful. Navigators can
                  request confirmation, record “unable to reach,” or reopen
                  support—without altering the provider’s original report.
                </p>
                <dl>
                  <div>
                    <dt>Helpful</dt>
                    <dd>654</dd>
                  </div>
                  <div>
                    <dt>Partly helpful</dt>
                    <dd>53</dd>
                  </div>
                  <div>
                    <dt>Not helpful / reopened</dt>
                    <dd>24</dd>
                  </div>
                </dl>
                <button onClick={() => setTab("queue")}>
                  Review confirmation queue →
                </button>
              </aside>
            </div>
          )}
          {tab === "receipt" && (
            <div className="receipt-layout">
              <section>
                <small>HASH-LINKED ACTION LEDGER</small>
                <h2>Case event receipt</h2>
                <p>
                  Original events cannot be silently rewritten. Corrections
                  create a new linked event with a reason and reviewer.
                </p>
                {stages.slice(0, index + 1).map((s, i) => (
                  <div className="receipt-event" key={s.id}>
                    <time>
                      AUG {12 + i}
                      <small>{i % 2 ? "10:18 AM" : "4:18 PM"}</small>
                    </time>
                    <span>{i < index ? "✓" : "●"}</span>
                    <article>
                      <small>
                        {s.label.toUpperCase()} · EVENT 0{i + 1}
                      </small>
                      <h3>{s.detail}</h3>
                      <p>
                        {i === 0
                          ? "Approved by resident · purpose: housing stabilization"
                          : i === 1
                            ? "Policy match v4.2 · program record v3.2"
                            : i === 2
                              ? "Recorded by Nia Williams · Bay Community Alliance"
                              : "Resident and provider notified · evidence snapshot preserved"}
                      </p>
                    </article>
                  </div>
                ))}
              </section>
              <aside>
                <small>RECEIPT INTEGRITY</small>
                <h2>Reproducible decision record</h2>
                <dl>
                  <div>
                    <dt>Policy version</dt>
                    <dd>Referral v4.2</dd>
                  </div>
                  <div>
                    <dt>Consent receipt</dt>
                    <dd>CON-88A21</dd>
                  </div>
                  <div>
                    <dt>Evidence snapshot</dt>
                    <dd>EVD-0812-44</dd>
                  </div>
                  <div>
                    <dt>Program version</dt>
                    <dd>PRG v3.2</dd>
                  </div>
                  <div>
                    <dt>Chain status</dt>
                    <dd>✓ Verified</dd>
                  </div>
                </dl>
                <button
                  onClick={() =>
                    deliverAction(
                      "Privacy-safe referral receipt prepared with policy, consent, evidence, program version, and event-chain status. Resident identifiers were excluded.",
                    )
                  }
                >
                  Export privacy-safe receipt
                </button>
              </aside>
            </div>
          )}
        </section>
      </div>
      {notice && (
        <div className="toast" role="status">
          <span>✓</span>
          {notice}
        </div>
      )}
    </main>
  );
}
