"use client";

import { useState } from "react";
import { deliverAction } from "../lib/action-artifacts";

type ConnectorState = "healthy" | "review" | "paused";

const connectors = [
  {
    id: "programs",
    mark: "▤",
    name: "Official program data",
    system: "California & Alameda source registry",
    purpose: "Refresh eligibility, deadlines, and service rules",
    scope: "Public records only",
    state: "healthy" as ConnectorState,
    last: "12 min ago",
    events: "184 records",
  },
  {
    id: "provider",
    mark: "↔",
    name: "Provider systems",
    system: "NeighborWell Partner Exchange",
    purpose: "Route authorized referrals and receive status events",
    scope: "8 approved fields",
    state: "healthy" as ConnectorState,
    last: "4 min ago",
    events: "27 events",
  },
  {
    id: "email",
    mark: "@",
    name: "Secure email",
    system: "Resident notification service",
    purpose: "Deliver resident-approved updates and verification links",
    scope: "Contact + message",
    state: "healthy" as ConnectorState,
    last: "7 min ago",
    events: "42 delivered",
  },
  {
    id: "sms",
    mark: "◫",
    name: "SMS notifications",
    system: "Consent-bound messaging gateway",
    purpose: "Send appointment and deadline reminders",
    scope: "Mobile + reminder",
    state: "review" as ConnectorState,
    last: "Consent review",
    events: "0 sent",
  },
  {
    id: "calendar",
    mark: "□",
    name: "Calendar coordination",
    system: "Provider availability exchange",
    purpose: "Offer appointment times without exposing full calendars",
    scope: "Free/busy only",
    state: "healthy" as ConnectorState,
    last: "18 min ago",
    events: "13 openings",
  },
  {
    id: "documents",
    mark: "◇",
    name: "Secure documents",
    system: "Encrypted document exchange",
    purpose: "Transfer only approved documents for a named service",
    scope: "2 approved files",
    state: "paused" as ConnectorState,
    last: "Resident revoked",
    events: "Access closed",
  },
];

export default function IntegrationCenter({
  onExit,
  onVault,
  onGovernance,
}: {
  onExit: () => void;
  onVault: () => void;
  onGovernance: () => void;
}) {
  const [selected, setSelected] = useState(0);
  const [testState, setTestState] = useState<"idle" | "running" | "passed">(
    "idle",
  );
  const [notice, setNotice] = useState("");
  const current = connectors[selected];
  function testConnection() {
    setTestState("running");
    window.setTimeout(() => setTestState("passed"), 900);
  }
  function flash(message: string) {
    deliverAction(message);
    setNotice(message);
    window.setTimeout(() => setNotice(""), 3000);
  }
  return (
    <main className="integration-shell">
      <header className="integration-top">
        <button className="brand" onClick={onExit}>
          <span className="brand-mark">
            <i></i>
            <i></i>
            <i></i>
          </span>
          <span>
            <b>NeighborWell</b>
            <small>Governed integration exchange</small>
          </span>
        </button>
        <div className="integration-mode">
          <i></i> External exchange perimeter <b>Protected</b>
        </div>
        <button onClick={onGovernance}>Trust center ↗</button>
        <button onClick={onVault}>Consent vault ↗</button>
        <button onClick={onExit}>Resident experience ↗</button>
      </header>
      <div className="integration-layout">
        <aside className="integration-nav">
          <p>PHASE 12</p>
          <h2>Integration Control Center</h2>
          <small>
            Every external exchange is authorized, minimized, verified, and
            receipted.
          </small>
          <nav>
            {connectors.map((c, i) => (
              <button
                key={c.id}
                className={selected === i ? "active" : ""}
                onClick={() => {
                  setSelected(i);
                  setTestState("idle");
                }}
              >
                <span>{c.mark}</span>
                <b>{c.name}</b>
                <i className={c.state}></i>
              </button>
            ))}
          </nav>
          <div className="boundary-card">
            <span>◇</span>
            <b>Fail-closed boundary</b>
            <p>
              A disconnected or unverified service cannot receive resident
              information.
            </p>
          </div>
        </aside>
        <section className="integration-main">
          <div className="integration-heading">
            <div>
              <p>EXTERNAL INTEGRATION LAYER</p>
              <h1>Connect systems without losing accountability.</h1>
              <span>
                NeighborWell brokers every exchange through authorization, consent,
                minimization, and an append-only receipt.
              </span>
            </div>
            <button
              onClick={() =>
                flash(
                  "Integration activity report prepared for authorized review.",
                )
              }
            >
              Export activity report
            </button>
          </div>
          <div className="posture-grid">
            <article>
              <small>CONNECTED SERVICES</small>
              <b>
                4<span>/6</span>
              </b>
              <em>Two safely restricted</em>
            </article>
            <article>
              <small>EXCHANGES TODAY</small>
              <b>266</b>
              <em>100% policy evaluated</em>
            </article>
            <article>
              <small>BLOCKED DISCLOSURES</small>
              <b>7</b>
              <em>No data released</em>
            </article>
            <article>
              <small>UNRECEIPTED EVENTS</small>
              <b>0</b>
              <em>Ledger is complete</em>
            </article>
          </div>
          <div className="integration-workbench">
            <section className="connector-detail">
              <div className="connector-title">
                <span>{current.mark}</span>
                <div>
                  <small>SELECTED CONNECTION</small>
                  <h2>{current.name}</h2>
                  <p>{current.system}</p>
                </div>
                <strong className={current.state}>
                  {current.state === "healthy"
                    ? "● Operational"
                    : current.state === "review"
                      ? "● Review required"
                      : "● Paused safely"}
                </strong>
              </div>
              <div className="exchange-path">
                <div>
                  <span>1</span>
                  <b>Authorize</b>
                  <small>Identity + purpose</small>
                </div>
                <i>→</i>
                <div>
                  <span>2</span>
                  <b>Minimize</b>
                  <small>Approved fields only</small>
                </div>
                <i>→</i>
                <div>
                  <span>3</span>
                  <b>Exchange</b>
                  <small>Encrypted adapter</small>
                </div>
                <i>→</i>
                <div>
                  <span>4</span>
                  <b>Receipt</b>
                  <small>Result + evidence</small>
                </div>
              </div>
              <dl className="connector-facts">
                <div>
                  <dt>Permitted purpose</dt>
                  <dd>{current.purpose}</dd>
                </div>
                <div>
                  <dt>Maximum data scope</dt>
                  <dd>{current.scope}</dd>
                </div>
                <div>
                  <dt>Last verified exchange</dt>
                  <dd>{current.last}</dd>
                </div>
                <div>
                  <dt>Current activity</dt>
                  <dd>{current.events}</dd>
                </div>
              </dl>
              <div className={`connection-test ${testState}`}>
                <div>
                  <span>{testState === "passed" ? "✓" : "◎"}</span>
                  <p>
                    <b>
                      {testState === "passed"
                        ? "Boundary test passed"
                        : "Test the complete exchange boundary"}
                    </b>
                    <small>
                      {testState === "passed"
                        ? "Authorization, consent, encryption, response validation, and ledger receipt verified."
                        : "Uses synthetic data. No resident record leaves NeighborWell."}
                    </small>
                  </p>
                </div>
                <button
                  onClick={testConnection}
                  disabled={testState === "running"}
                >
                  {testState === "running"
                    ? "Testing…"
                    : testState === "passed"
                      ? "Run again"
                      : "Run safety test →"}
                </button>
              </div>
            </section>
            <aside className="integration-receipt">
              <small>LATEST EXCHANGE RECEIPT</small>
              <h2>Nothing consequential is invisible.</h2>
              <div className="receipt-line">
                <span>✓</span>
                <p>
                  <b>Policy evaluated</b>
                  <small>INT-POL-4.2 · allowed</small>
                </p>
                <time>14:31:08</time>
              </div>
              <div className="receipt-line">
                <span>✓</span>
                <p>
                  <b>Consent matched</b>
                  <small>Purpose and recipient active</small>
                </p>
                <time>14:31:08</time>
              </div>
              <div className="receipt-line">
                <span>✓</span>
                <p>
                  <b>Payload minimized</b>
                  <small>8 of 31 available fields</small>
                </p>
                <time>14:31:09</time>
              </div>
              <div className="receipt-line">
                <span>✓</span>
                <p>
                  <b>Response validated</b>
                  <small>Signed provider event</small>
                </p>
                <time>14:31:10</time>
              </div>
              <div className="receipt-line">
                <span>◆</span>
                <p>
                  <b>Ledger sealed</b>
                  <small>Hash linked · immutable</small>
                </p>
                <time>14:31:10</time>
              </div>
              <button
                onClick={() =>
                  flash(
                    "Full reasoning and disclosure receipt opened for review.",
                  )
                }
              >
                Inspect full receipt →
              </button>
            </aside>
          </div>
          <section className="integration-queue">
            <div>
              <h2>Safety and exception queue</h2>
              <p>Failures become owned work—not silent data loss.</p>
            </div>
            <article>
              <span className="review">!</span>
              <p>
                <b>SMS consent template requires review</b>
                <small>
                  Policy owner: Resident Rights Office · no messages released
                </small>
              </p>
              <em>Due today</em>
              <button
                onClick={() =>
                  flash("Review assigned to the Resident Rights Office.")
                }
              >
                Open review →
              </button>
            </article>
            <article>
              <span className="paused">◇</span>
              <p>
                <b>Document access revoked by resident</b>
                <small>
                  Provider download token expired immediately · receipt sealed
                </small>
              </p>
              <em>Resolved</em>
              <button onClick={onVault}>View consent →</button>
            </article>
          </section>
        </section>
      </div>
      {notice && (
        <div className="integration-toast" role="status">
          ✓ {notice}
        </div>
      )}
    </main>
  );
}
