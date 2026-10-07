"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ReferralOutcomeEngine from "./referral-outcome";
import ConsentVault from "./consent-vault";
import IntegrationCenter from "./integration-center";
import AssuranceCenter from "./assurance-center";
import PilotOperations from "./pilot-operations";
import LearningExpansion from "./learning-expansion";
import ParticipantEnrollment from "./participant-enrollment";
import StartHere from "./start-here";
import ResourceGuide from "./resource-guide";
import { deliverAction } from "../lib/action-artifacts";

const needs = [
  {
    icon: "⌂",
    label: "Housing stability",
    detail: "Rent is 18 days overdue",
    urgency: "Urgent",
    tone: "coral",
  },
  {
    icon: "$",
    label: "Income replacement",
    detail: "Job ended July 10",
    urgency: "This week",
    tone: "gold",
  },
  {
    icon: "+",
    label: "Health coverage",
    detail: "Coverage may end soon",
    urgency: "Review",
    tone: "teal",
  },
  {
    icon: "↗",
    label: "Career transition",
    detail: "Software skills pathway",
    urgency: "Plan",
    tone: "blue",
  },
];

const actions = [
  {
    title: "Submit unemployment claim",
    source: "California EDD",
    status: "Ready for review",
    confidence: "High",
    due: "Today",
    color: "blue",
  },
  {
    title: "Request eviction-prevention support",
    source: "Alameda County Housing Secure",
    status: "3 items needed",
    confidence: "High",
    due: "By Aug 15",
    color: "coral",
  },
  {
    title: "Compare health coverage options",
    source: "Covered California",
    status: "Needs your answer",
    confidence: "Medium",
    due: "This week",
    color: "teal",
  },
];

export default function Home() {
  const [portal, setPortal] = useState<
    | "resident"
    | "provider"
    | "network"
    | "governance"
    | "architecture"
    | "intelligence"
    | "referrals"
    | "vault"
    | "integrations"
    | "assurance"
    | "pilot"
    | "learning"
    | "resources"
  >("resident");
  const [view, setView] = useState<"start" | "canvas" | "story" | "ledger">(
    "start",
  );
  const [story, setStory] = useState(
    "I lost my job last month. My rent is behind, and I’m worried my health coverage will end. I also want help turning my computer science studies into a stable career.",
  );
  const [expanded, setExpanded] = useState<number | null>(0);
  const [notice, setNotice] = useState("");
  function showNotice(message: string) {
    deliverAction(message);
    setNotice(message);
    window.setTimeout(() => setNotice(""), 3200);
  }
  if (portal === "provider")
    return (
      <ProviderWorkspace
        onExit={() => setPortal("resident")}
        onNetwork={() => setPortal("network")}
      />
    );
  if (portal === "network")
    return (
      <NetworkCommandCenter
        onResident={() => setPortal("resident")}
        onProvider={() => setPortal("provider")}
      />
    );
  if (portal === "governance")
    return (
      <GovernanceCenter
        onResident={() => setPortal("resident")}
        onProvider={() => setPortal("provider")}
        onNetwork={() => setPortal("network")}
      />
    );
  if (portal === "architecture")
    return <ArchitectureCenter onExit={() => setPortal("resident")} />;
  if (portal === "intelligence")
    return (
      <IntelligenceEngine
        onExit={() => setPortal("resident")}
        onRegistry={() => setPortal("provider")}
      />
    );
  if (portal === "referrals")
    return (
      <ReferralOutcomeEngine
        onExit={() => setPortal("resident")}
        onProvider={() => setPortal("provider")}
      />
    );
  if (portal === "vault")
    return (
      <ConsentVault
        onExit={() => setPortal("resident")}
        onReferral={() => setPortal("referrals")}
      />
    );
  if (portal === "integrations")
    return (
      <IntegrationCenter
        onExit={() => setPortal("resident")}
        onVault={() => setPortal("vault")}
        onGovernance={() => setPortal("governance")}
      />
    );
  if (portal === "assurance")
    return (
      <AssuranceCenter
        onExit={() => setPortal("resident")}
        onGovernance={() => setPortal("governance")}
        onArchitecture={() => setPortal("architecture")}
      />
    );
  if (portal === "pilot")
    return (
      <PilotOperations
        onExit={() => setPortal("resident")}
        onAssurance={() => setPortal("assurance")}
      />
    );
  if (portal === "learning")
    return (
      <LearningExpansion
        onExit={() => setPortal("resident")}
        onPilot={() => setPortal("pilot")}
      />
    );
  if (portal === "resources")
    return <ResourceGuide onExit={() => setPortal("resident")} />;
  return (
    <main className="app-shell">
      <header className="topbar">
        <button
          className="brand"
          onClick={() => setView("start")}
          aria-label="NeighborWell home"
        >
          <span className="brand-mark">
            <i></i>
            <i></i>
            <i></i>
          </span>
          <span>
            <b>NeighborWell</b>
            <small>Community intelligence for real life</small>
          </span>
        </button>
        <nav aria-label="Resident navigation">
          <button
            className={view === "canvas" ? "active" : ""}
            onClick={() => setView("canvas")}
          >
            My situation
          </button>
          <button
            className={view === "ledger" ? "active" : ""}
            onClick={() => setView("ledger")}
          >
            Action plan <em>3</em>
          </button>
          <button onClick={() => setPortal("vault")}>My consent</button>
          <button onClick={() => setPortal("referrals")}>My connections</button>
          <button onClick={() => setPortal("resources")}>Resource guide</button>
          <button
            onClick={() =>
              showNotice(
                "A trusted navigator is available. This prototype does not place a real call.",
              )
            }
          >
            Human support
          </button>
        </nav>
        <Link
          className="profile"
          href="/access"
          aria-label="Open secure access center"
        >
          <span>SS</span>
          <b>Secure access</b>
          <i>→</i>
        </Link>
      </header>
      <div className="workspace">
        <aside className="rail">
          <div className="journey-label">Your journey</div>
          <ol>
            <li className="done">
              <span>✓</span>
              <div>
                <b>Welcome & consent</b>
                <small>You control every action</small>
              </div>
            </li>
            <li className="done">
              <span>✓</span>
              <div>
                <b>Tell your story</b>
                <small>4 connected needs found</small>
              </div>
            </li>
            <li className="current">
              <span>3</span>
              <div>
                <b>Situation canvas</b>
                <small>Review what NeighborWell understood</small>
              </div>
            </li>
            <li>
              <span>4</span>
              <div>
                <b>Action plan</b>
                <small>Choose what happens next</small>
              </div>
            </li>
            <li>
              <span>5</span>
              <div>
                <b>Outcomes</b>
                <small>Confirm help was received</small>
              </div>
            </li>
          </ol>
          <div className="trust-card">
            <div className="shield">◇</div>
            <b>Your information stays yours.</b>
            <p>Nothing is submitted or shared without your clear approval.</p>
            <button
              onClick={() =>
                showNotice(
                  "Privacy Center opened: no external sharing is enabled.",
                )
              }
            >
              View privacy controls →
            </button>
          </div>
        </aside>
        <section className="content">
          {view === "start" ? (
            <StartHere
              onContinue={() => setView("story")}
              onSituation={() => setView("canvas")}
              onSupport={() =>
                showNotice(
                  "Human support options opened. This prototype does not place a real call.",
                )
              }
            />
          ) : view === "story" ? (
            <ParticipantEnrollment
              initialStory={story}
              onBack={() => setView("start")}
              onComplete={(nextStory) => {
                setStory(nextStory);
                setView("canvas");
                showNotice(
                  "Enrollment saved. Review NeighborWell’s understanding before continuing.",
                );
              }}
            />
          ) : view === "ledger" ? (
            <Ledger onBack={() => setView("canvas")} onNotice={showNotice} />
          ) : (
            <>
              <div className="content-head">
                <div>
                  <p className="eyebrow">SITUATION CANVAS</p>
                  <h1>Here’s what NeighborWell understands.</h1>
                  <p className="lede">
                    Your situation is connected. Review each part before we
                    build your action plan.
                  </p>
                </div>
                <button className="edit-story" onClick={() => setView("story")}>
                  <span>✎</span> Edit my story
                </button>
              </div>
              <div className="insight-band">
                <span className="spark">✦</span>
                <p>
                  <b>NeighborWell connected four needs that may affect one another.</b>
                  <br />
                  Addressing income and housing first may protect your health
                  coverage and give you more room to plan your career
                  transition.
                </p>
                <span className="ai-label">AI insight · reviewable</span>
              </div>
              <section className="needs-section">
                <div className="section-title">
                  <div>
                    <h2>Your connected needs</h2>
                    <p>Select any card to see why NeighborWell included it.</p>
                  </div>
                  <span>
                    <b>4</b> needs identified
                  </span>
                </div>
                <div className="needs-grid">
                  {needs.map((need, i) => (
                    <button
                      key={need.label}
                      className={`need-card ${expanded === i ? "selected" : ""}`}
                      onClick={() => setExpanded(expanded === i ? null : i)}
                    >
                      <span className={`need-icon ${need.tone}`}>
                        {need.icon}
                      </span>
                      <span className="need-copy">
                        <b>{need.label}</b>
                        <small>{need.detail}</small>
                      </span>
                      <span className={`urgency ${need.tone}`}>
                        {need.urgency}
                      </span>
                      <i>›</i>
                      {expanded === i && (
                        <span className="reason">
                          Included from your story. You can correct or remove
                          this before any recommendation is made.
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </section>
              <section className="action-section">
                <div className="section-title">
                  <div>
                    <h2>Recommended next actions</h2>
                    <p>
                      Ordered by urgency, eligibility signals, and what unlocks
                      other help.
                    </p>
                  </div>
                  <button
                    className="why"
                    onClick={() =>
                      showNotice(
                        "Priority combines deadlines, potential harm, and dependencies—not payment or advertising.",
                      )
                    }
                  >
                    ⓘ How priorities work
                  </button>
                </div>
                <div className="action-list">
                  {actions.map((action, i) => (
                    <article key={action.title} className="action-row">
                      <span className={`priority ${action.color}`}>
                        {i + 1}
                      </span>
                      <div className="action-main">
                        <b>{action.title}</b>
                        <small>
                          Official source: {action.source}{" "}
                          <span>✓ verified Aug 12</span>
                        </small>
                      </div>
                      <div className="status">
                        <small>Status</small>
                        <b>{action.status}</b>
                      </div>
                      <div className="confidence">
                        <small>Evidence confidence</small>
                        <b>
                          <i
                            className={
                              action.confidence === "High" ? "high" : "medium"
                            }
                          ></i>
                          {action.confidence}
                        </b>
                      </div>
                      <div className="due">
                        <small>Best completed</small>
                        <b>{action.due}</b>
                      </div>
                      <button
                        onClick={() =>
                          showNotice(
                            `${action.title}: details opened for review.`,
                          )
                        }
                        aria-label={`Open ${action.title}`}
                      >
                        →
                      </button>
                    </article>
                  ))}
                </div>
              </section>
              <div className="continue-bar">
                <div>
                  <span>✓</span>
                  <p>
                    <b>You remain in control</b>
                    <small>
                      NeighborWell will ask before preparing, sharing, or submitting
                      anything.
                    </small>
                  </p>
                </div>
                <button className="primary" onClick={() => setView("ledger")}>
                  Build my action plan <b>→</b>
                </button>
              </div>
            </>
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

function Ledger({
  onBack,
  onNotice,
}: {
  onBack: () => void;
  onNotice: (s: string) => void;
}) {
  const [approved, setApproved] = useState(false);
  return (
    <div className="ledger-view">
      <button className="back" onClick={onBack}>
        ← Back to situation
      </button>
      <p className="eyebrow">ACTION LEDGER</p>
      <h1>Every action. Visible and accountable.</h1>
      <p className="lede">
        Nothing moves forward until you understand and approve it.
      </p>
      <div className="ledger-summary">
        <div>
          <span>3</span>
          <small>Open actions</small>
        </div>
        <div>
          <span>0</span>
          <small>Shared externally</small>
        </div>
        <div>
          <span>100%</span>
          <small>Under your control</small>
        </div>
      </div>
      <article className="approval-card">
        <div className="approval-head">
          <span className="priority blue">1</span>
          <div>
            <p>READY FOR YOUR REVIEW</p>
            <h2>California unemployment claim</h2>
          </div>
          <span className="verified">✓ Official source verified</span>
        </div>
        <div className="approval-body">
          <h3>NeighborWell proposes to:</h3>
          <ul>
            <li>Use the information you already provided to prepare a draft</li>
            <li>Show every answer and source before anything leaves NeighborWell</li>
            <li>Ask for separate approval before submission</li>
          </ul>
          <label>
            <input
              type="checkbox"
              checked={approved}
              onChange={(e) => setApproved(e.target.checked)}
            />
            <span>
              <b>I understand and approve draft preparation.</b>
              <small>This does not submit or share my information.</small>
            </span>
          </label>
          <button
            className="primary"
            disabled={!approved}
            onClick={() =>
              onNotice(
                "Draft preparation approved. No information has been submitted.",
              )
            }
          >
            Prepare private draft →
          </button>
        </div>
      </article>
      <div className="audit-note">
        <span>◎</span>
        <p>
          <b>Permanent accountability record</b>
          <small>
            NeighborWell records what was proposed, which evidence was used, what you
            approved, and when—without changing your original story.
          </small>
        </p>
      </div>
    </div>
  );
}

const referrals = [
  {
    initials: "MS",
    name: "Maya S.",
    need: "Eviction prevention",
    risk: "72-hour deadline",
    match: 96,
    status: "New",
    tone: "critical",
  },
  {
    initials: "JL",
    name: "Jordan L.",
    need: "Food + income support",
    risk: "Household of 3",
    match: 91,
    status: "Review",
    tone: "watch",
  },
  {
    initials: "AR",
    name: "Alex R.",
    need: "Health coverage",
    risk: "Coverage ends Aug 31",
    match: 88,
    status: "Contacted",
    tone: "stable",
  },
];

const registryPrograms = [
  {
    id: "housing",
    initials: "HS",
    category: "Housing stability",
    name: "Emergency Rent & Eviction Prevention",
    organization: "Bay Community Alliance",
    geography: "Alameda County",
    status: "verified",
    review: "Aug 20",
    evidence: 4,
    version: "v3.2",
    capacity: 7,
  },
  {
    id: "income",
    initials: "IR",
    category: "Income recovery",
    name: "Employment & Benefits Navigation",
    organization: "East Bay Opportunity Center",
    geography: "North and Central Alameda",
    status: "review",
    review: "Aug 14",
    evidence: 3,
    version: "v2.7",
    capacity: 11,
  },
  {
    id: "health",
    initials: "HC",
    category: "Health coverage",
    name: "Coverage Continuity Navigation",
    organization: "Community Health Bridge",
    geography: "Alameda County",
    status: "verified",
    review: "Aug 27",
    evidence: 5,
    version: "v4.1",
    capacity: 18,
  },
  {
    id: "food",
    initials: "FN",
    category: "Food access",
    name: "Rapid Nutrition Connection",
    organization: "Alameda Community Pantry Network",
    geography: "Oakland · Emeryville",
    status: "quarantine",
    review: "Source conflict",
    evidence: 2,
    version: "v1.9",
    capacity: 0,
  },
] as const;

function ProviderWorkspace({
  onExit,
  onNetwork,
}: {
  onExit: () => void;
  onNetwork: () => void;
}) {
  const [tab, setTab] = useState<
    "overview" | "referrals" | "registry" | "outcomes"
  >("overview");
  const [selected, setSelected] = useState(0);
  const [capacity, setCapacity] = useState(7);
  const [accepted, setAccepted] = useState(false);
  const [note, setNote] = useState("");
  const [authorizedDocuments, setAuthorizedDocuments] = useState<Array<{
    id: string;
    name: string;
    participantName: string;
    purpose: string;
    expiresAt: string;
  }>>([]);
  const [documentStatus, setDocumentStatus] = useState("Checking authorized documents…");
  useEffect(() => {
    fetch("/api/provider/documents", { cache: "no-store" })
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || "Document access unavailable.");
        setAuthorizedDocuments(result.documents ?? []);
        setDocumentStatus(
          result.documents?.length
            ? `${result.documents.length} participant-authorized document${result.documents.length === 1 ? "" : "s"}`
            : "No participant-authorized documents are currently available.",
        );
      })
      .catch((error) =>
        setDocumentStatus(error instanceof Error ? error.message : "Document access unavailable."),
      );
  }, []);
  const current = referrals[selected];
  return (
    <main className="provider-shell">
      <header className="provider-top">
        <button
          className="brand provider-brand"
          onClick={() => setTab("overview")}
        >
          <span className="brand-mark">
            <i></i>
            <i></i>
            <i></i>
          </span>
          <span>
            <b>NeighborWell</b>
            <small>Coordinated service network</small>
          </span>
        </button>
        <div className="network-status">
          <i></i> Alameda County network <b>Live</b>
        </div>
        <button className="resident-return" onClick={onNetwork}>
          Network intelligence ↗
        </button>
        <button className="resident-return" onClick={onExit}>
          Resident experience ↗
        </button>
        <button
          className="profile"
          onClick={() => window.location.assign("/access")}
        >
          <span>NW</span>
          <b>Nia Williams</b>
          <i>⌄</i>
        </button>
      </header>
      <div className="provider-layout">
        <aside className="provider-nav">
          <div className="org">
            <span>BC</span>
            <div>
              <b>Bay Community Alliance</b>
              <small>Housing & stability team</small>
            </div>
          </div>
          <p>WORKSPACE</p>
          {(
            [
              ["overview", "Command center"],
              ["referrals", "Referral intelligence"],
              ["registry", "Program registry"],
              ["outcomes", "Outcomes & equity"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              className={tab === id ? "active" : ""}
              onClick={() => setTab(id)}
            >
              <span>
                {id === "overview"
                  ? "⌘"
                  : id === "referrals"
                    ? "↳"
                    : id === "registry"
                      ? "▤"
                      : "◎"}
              </span>
              {label}
              {id === "referrals" && <em>3</em>}
            </button>
          ))}
          <p>GOVERNANCE</p>
          <button onClick={() => setTab("registry")}>
            <span>✓</span>Evidence reviews
          </button>
          <button onClick={() => setTab("outcomes")}>
            <span>◇</span>Consent receipts
          </button>
          <div className="capacity-mini">
            <div>
              <span>Current capacity</span>
              <b>{capacity} openings</b>
            </div>
            <meter min="0" max="12" value={capacity} />
            <small>Updated just now · shared with network</small>
          </div>
        </aside>
        <section className="provider-main">
          {tab === "overview" && (
            <>
              <div className="provider-heading">
                <div>
                  <p className="eyebrow">WEDNESDAY · AUGUST 12</p>
                  <h1>Good afternoon, Nia.</h1>
                  <p>
                    Three residents need a response. One has a time-sensitive
                    housing risk.
                  </p>
                </div>
                <button
                  className="capacity-button"
                  onClick={() => setCapacity(capacity === 7 ? 5 : 7)}
                >
                  <i></i> Update capacity
                </button>
              </div>
              <div className="signal-strip">
                <span className="signal-icon">!</span>
                <div>
                  <b>Network signal: eviction-prevention demand is rising.</b>
                  <small>
                    Requests increased 31% in West Oakland over 14 days. Two
                    partner programs report limited capacity.
                  </small>
                </div>
                <button onClick={() => setTab("outcomes")}>
                  Examine signal →
                </button>
              </div>
              <div className="metric-grid">
                <article>
                  <small>NEW REFERRALS</small>
                  <b>3</b>
                  <span>1 urgent</span>
                </article>
                <article>
                  <small>AWAITING RESPONSE</small>
                  <b>5</b>
                  <span>Oldest: 19 hours</span>
                </article>
                <article>
                  <small>ACTIVE CONNECTIONS</small>
                  <b>24</b>
                  <span>83% on track</span>
                </article>
                <article>
                  <small>OUTCOMES CONFIRMED</small>
                  <b>18</b>
                  <span>↑ 12% this month</span>
                </article>
              </div>
              <div className="provider-columns">
                <section>
                  <div className="panel-title">
                    <div>
                      <h2>Referral intelligence</h2>
                      <p>
                        Prioritized by urgency, fit, and resident consent—not
                        payment.
                      </p>
                    </div>
                    <button onClick={() => setTab("referrals")}>
                      View queue →
                    </button>
                  </div>
                  <div className="referral-table">
                    {referrals.map((r, i) => (
                      <button
                        key={r.name}
                        onClick={() => {
                          setSelected(i);
                          setTab("referrals");
                        }}
                      >
                        <span className="person">{r.initials}</span>
                        <span>
                          <b>{r.name}</b>
                          <small>{r.need}</small>
                        </span>
                        <span className={`risk ${r.tone}`}>{r.risk}</span>
                        <span className="match">
                          <small>Service fit</small>
                          <b>{r.match}%</b>
                        </span>
                        <i>→</i>
                      </button>
                    ))}
                  </div>
                </section>
                <aside className="truth-panel">
                  <div className="truth-head">
                    <span>◆</span>
                    <div>
                      <small>PROGRAM TRUTH CARD</small>
                      <h2>Keep your public promise accurate.</h2>
                    </div>
                  </div>
                  <p>
                    Your housing program information was last confirmed{" "}
                    <b>6 days ago</b>.
                  </p>
                  <dl>
                    <div>
                      <dt>Openings</dt>
                      <dd>{capacity}</dd>
                    </div>
                    <div>
                      <dt>Typical response</dt>
                      <dd>1–2 days</dd>
                    </div>
                    <div>
                      <dt>Languages</dt>
                      <dd>EN · ES</dd>
                    </div>
                  </dl>
                  <button onClick={() => setTab("registry")}>
                    Review program record →
                  </button>
                </aside>
              </div>
            </>
          )}
          {tab === "referrals" && (
            <>
              <div className="provider-heading">
                <div>
                  <p className="eyebrow">REFERRAL INTELLIGENCE</p>
                  <h1>See the situation, not just the form.</h1>
                  <p>
                    Only information the resident approved for this referral is
                    visible.
                  </p>
                </div>
                <span className="consent-badge">
                  ◇ Consent verified · 8 fields shared
                </span>
              </div>
              <div className="referral-workbench">
                <aside>
                  {referrals.map((r, i) => (
                    <button
                      key={r.name}
                      className={selected === i ? "selected" : ""}
                      onClick={() => {
                        setSelected(i);
                        setAccepted(false);
                      }}
                    >
                      <span className="person">{r.initials}</span>
                      <span>
                        <b>{r.name}</b>
                        <small>{r.need}</small>
                      </span>
                      <span className={`dot ${r.tone}`}></span>
                    </button>
                  ))}
                </aside>
                <article>
                  <div className="case-head">
                    <div>
                      <span className="person large">{current.initials}</span>
                      <div>
                        <p>REFERRED WITH PERMISSION · 42 MIN AGO</p>
                        <h2>{current.name}</h2>
                        <small>{current.need} · Oakland, CA</small>
                      </div>
                    </div>
                    <span className={`risk ${current.tone}`}>
                      {current.risk}
                    </span>
                  </div>
                  <div className="why-fit">
                    <span>✦</span>
                    <div>
                      <b>Why NeighborWell matched this referral</b>
                      <p>
                        Your program serves this location, the preliminary rules
                        align, and you report {capacity} openings. Final
                        eligibility remains your decision.
                      </p>
                    </div>
                    <strong>
                      {current.match}%<small>service fit</small>
                    </strong>
                  </div>
                  <div className="case-grid">
                    <section>
                      <h3>Resident-approved context</h3>
                      <dl>
                        <div>
                          <dt>Immediate concern</dt>
                          <dd>Rent overdue; prevention support requested</dd>
                        </div>
                        <div>
                          <dt>Household</dt>
                          <dd>1 adult</dd>
                        </div>
                        <div>
                          <dt>Current income</dt>
                          <dd>Employment ended July 10</dd>
                        </div>
                        <div>
                          <dt>Preferred contact</dt>
                          <dd>Secure message · afternoons</dd>
                        </div>
                      </dl>
                    </section>
                    <section>
                      <h3>Decision evidence</h3>
                      <p>
                        <span>✓</span> Alameda County residency signal
                      </p>
                      <p>
                        <span>✓</span> Income change documented
                      </p>
                      <p><span>◇</span> {documentStatus}</p>
                      {authorizedDocuments.map((document) => (
                        <button
                          key={document.id}
                          onClick={() => window.open(`/api/provider/documents/${encodeURIComponent(document.id)}`, "_blank", "noopener,noreferrer")}
                          title={`${document.purpose}; access ends ${new Date(document.expiresAt).toLocaleString()}`}
                        >
                          Review {document.name} →
                        </button>
                      ))}
                      {!authorizedDocuments.length && (
                        <button
                          onClick={() => setNote("Document requested. NeighborWell will require a separate participant decision before access is possible.")}
                        >
                          Request through consent vault →
                        </button>
                      )}
                    </section>
                  </div>
                  <label className="case-note">
                    <span>Private coordination note</span>
                    <textarea
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="Add a note visible only to authorized team members…"
                    />
                  </label>
                  <div className="decision-bar">
                    <button
                      className="secondary"
                      onClick={() =>
                        setNote(
                          "Lease document requested through the resident-controlled vault.",
                        )
                      }
                    >
                      Request one missing item
                    </button>
                    <button
                      className="secondary"
                      onClick={() => setTab("registry")}
                    >
                      Route to another program
                    </button>
                    <button
                      className="primary"
                      onClick={() => setAccepted(true)}
                    >
                      {accepted ? "✓ Referral accepted" : "Accept connection →"}
                    </button>
                  </div>
                  {accepted && (
                    <div className="accepted-note">
                      The resident has been notified. NeighborWell recorded your
                      acceptance and started the response-time clock.
                    </div>
                  )}
                </article>
              </div>
            </>
          )}
          {tab === "registry" && (
            <ProgramRegistry capacity={capacity} onCapacity={setCapacity} />
          )}
          {tab === "outcomes" && (
            <>
              <div className="provider-heading">
                <div>
                  <p className="eyebrow">OUTCOMES & EQUITY</p>
                  <h1>Measure whether help actually arrived.</h1>
                  <p>
                    Referral counts are activity. Confirmed outcomes are
                    accountability.
                  </p>
                </div>
                <button
                  className="capacity-button"
                  onClick={() =>
                    deliverAction(
                      "Provider outcomes and equity brief prepared with service rates, capacity signals, delays, consent comprehension, and limitations.",
                    )
                  }
                >
                  Export privacy-safe brief
                </button>
              </div>
              <div className="outcome-hero">
                <div>
                  <small>CONFIRMED SERVICE RATE</small>
                  <b>74%</b>
                  <span>↑ 8 points since May</span>
                </div>
                <div className="outcome-bars">
                  <p>
                    <span>Housing stabilized</span>
                    <b>81%</b>
                  </p>
                  <meter min="0" max="100" value="81" />
                  <p>
                    <span>Income connected</span>
                    <b>69%</b>
                  </p>
                  <meter min="0" max="100" value="69" />
                  <p>
                    <span>Resident-confirmed helpful</span>
                    <b>76%</b>
                  </p>
                  <meter min="0" max="100" value="76" />
                </div>
              </div>
              <div className="equity-grid">
                <article>
                  <small>EARLY-WARNING SIGNAL</small>
                  <h2>West Oakland demand is outpacing capacity.</h2>
                  <p>
                    There are 2.4 requests for every available housing opening.
                    Median response time is now 31 hours.
                  </p>
                  <button onClick={onNetwork}>
                    Open neighborhood evidence →
                  </button>
                </article>
                <article>
                  <small>SERVICE FRICTION</small>
                  <h2>Document requirements create the largest delay.</h2>
                  <p>
                    Residents wait 3.2 additional days when lease verification
                    requires manual follow-up.
                  </p>
                  <button onClick={() => setTab("referrals")}>
                    Examine workflow →
                  </button>
                </article>
                <article>
                  <small>TRUST INDICATOR</small>
                  <h2>92% understood what was shared.</h2>
                  <p>
                    Consent comprehension is strongest when staff use NeighborWell’s
                    plain-language handoff.
                  </p>
                  <button onClick={() => setTab("referrals")}>
                    View consent analysis →
                  </button>
                </article>
              </div>
              <div className="outcome-ledger">
                <div>
                  <span>✓</span>
                  <p>
                    <b>18 outcomes independently confirmed this month</b>
                    <small>
                      12 by residents · 4 by providers · 2 by both parties
                    </small>
                  </p>
                </div>
                <button onClick={() => setTab("referrals")}>
                  View outcome ledger →
                </button>
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  );
}

const architectureDomains = [
  [
    "Identity & authority",
    "Accounts, organizations, roles, MFA, assignments and purpose-bound access",
  ],
  [
    "Resident situation",
    "Households, narratives, structured needs, priorities and corrections",
  ],
  [
    "Evidence registry",
    "Official sources, extracted rules, provenance, review dates and quarantine",
  ],
  [
    "Consent vault",
    "Field-level grants, purpose, recipient, expiry, revocation and disclosure receipts",
  ],
  [
    "Service network",
    "Programs, locations, capacity, eligibility, referrals and provider responses",
  ],
  [
    "Intelligence receipts",
    "Model runs, inputs, evidence snapshots, uncertainty and human approvals",
  ],
  [
    "Outcomes & appeals",
    "Resident confirmation, service outcomes, complaints, corrections and appeals",
  ],
  [
    "Action ledger",
    "Append-only events, policy versions, signatures and privacy-safe audit exports",
  ],
];

function ArchitectureCenter({ onExit }: { onExit: () => void }) {
  const [view, setView] = useState<"system" | "data" | "workflow" | "security">(
    "system",
  );
  return (
    <main className="architecture-shell">
      <header className="architecture-top">
        <button
          className="brand architecture-brand"
          onClick={() => setView("system")}
        >
          <span className="brand-mark">
            <i></i>
            <i></i>
            <i></i>
          </span>
          <span>
            <b>NeighborWell</b>
            <small>Production architecture laboratory</small>
          </span>
        </button>
        <div>
          <span>PHASE 5</span>
          <b>Buildable technical foundation</b>
        </div>
        <button onClick={onExit}>Return to platform ↗</button>
      </header>
      <div className="architecture-layout">
        <aside className="architecture-nav">
          <p>ENGINEERING MODEL</p>
          {(
            [
              ["system", "System topology"],
              ["data", "Information model"],
              ["workflow", "Referral lifecycle"],
              ["security", "Security boundaries"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              className={view === id ? "active" : ""}
              onClick={() => setView(id)}
            >
              <span>
                {id === "system"
                  ? "⌘"
                  : id === "data"
                    ? "▦"
                    : id === "workflow"
                      ? "↺"
                      : "◇"}
              </span>
              {label}
            </button>
          ))}
          <div className="architecture-principle">
            <span>01</span>
            <b>Resident authority is a system invariant.</b>
            <p>
              Every service checks purpose, consent, organization, relationship
              and sensitivity before access or action.
            </p>
          </div>
        </aside>
        <section className="architecture-main">
          <div className="architecture-heading">
            <div>
              <p className="eyebrow">PRODUCTION REFERENCE ARCHITECTURE</p>
              <h1>
                Trust is enforced in the system—not promised in the interface.
              </h1>
              <p>
                NeighborWell separates operational work, sensitive records, governed
                intelligence, and public analytics while preserving one
                verifiable chain of action.
              </p>
            </div>
            <span>Architecture baseline · v1.0</span>
          </div>
          {view === "system" && (
            <>
              <div className="architecture-flow">
                <article>
                  <small>EXPERIENCE EDGE</small>
                  <h2>Four controlled environments</h2>
                  <p>Resident · Provider · Network intelligence · Governance</p>
                </article>
                <i>→</i>
                <article>
                  <small>POLICY GATEWAY</small>
                  <h2>Authority before execution</h2>
                  <p>Identity · purpose · consent · evidence · risk</p>
                </article>
                <i>→</i>
                <article>
                  <small>DOMAIN SERVICES</small>
                  <h2>Bounded operations</h2>
                  <p>Needs · programs · referrals · outcomes · appeals</p>
                </article>
                <i>→</i>
                <article>
                  <small>TRUSTED RECORD</small>
                  <h2>Proof, not hidden state</h2>
                  <p>
                    Encrypted data · immutable receipts · de-identified facts
                  </p>
                </article>
              </div>
              <div className="architecture-grid">
                <section>
                  <small>SERVICE PLANE</small>
                  <h2>Production components</h2>
                  {[
                    [
                      "Experience gateway",
                      "Accessible web and mobile interfaces; rate limits and session protection",
                    ],
                    [
                      "Consent & authorization service",
                      "Evaluates every read, disclosure and consequential action",
                    ],
                    [
                      "Program and evidence service",
                      "Versioned program truth with source health and rule quarantine",
                    ],
                    [
                      "Referral orchestrator",
                      "Durable state machine with deadlines, retries and human escalation",
                    ],
                    [
                      "Governed AI gateway",
                      "Approved models, retrieval, prompt policy, redaction and evaluation",
                    ],
                    [
                      "Ledger and notification service",
                      "Append-only receipts plus reliable resident and provider notices",
                    ],
                  ].map((x) => (
                    <div className="architecture-row" key={x[0]}>
                      <span>✓</span>
                      <p>
                        <b>{x[0]}</b>
                        <small>{x[1]}</small>
                      </p>
                    </div>
                  ))}
                </section>
                <aside>
                  <small>DATA SEPARATION</small>
                  <h2>Four stores, four purposes</h2>
                  <div className="store resident">
                    <b>Operational PostgreSQL</b>
                    <span>
                      Source-of-truth records with tenant and row-level controls
                    </span>
                  </div>
                  <div className="store evidence">
                    <b>Evidence index</b>
                    <span>
                      Approved policy text, provenance and immutable snapshots
                    </span>
                  </div>
                  <div className="store vault">
                    <b>Encrypted document vault</b>
                    <span>
                      User-controlled files and field-specific disclosure
                    </span>
                  </div>
                  <div className="store analytics">
                    <b>Privacy-safe warehouse</b>
                    <span>
                      Suppressed, de-identified outcomes for system learning
                    </span>
                  </div>
                </aside>
              </div>
            </>
          )}
          {view === "data" && (
            <>
              <div className="domain-grid">
                {architectureDomains.map((d, i) => (
                  <article key={d[0]}>
                    <span>{String(i + 1).padStart(2, "0")}</span>
                    <h2>{d[0]}</h2>
                    <p>{d[1]}</p>
                  </article>
                ))}
              </div>
              <div className="model-rule">
                <b>Canonical relationship</b>
                <p>
                  A resident situation produces structured needs. Approved
                  evidence supports recommendations. A consent grant authorizes
                  a referral disclosure. Provider responses and resident
                  confirmation create an outcome. Every transition writes an
                  immutable receipt.
                </p>
              </div>
            </>
          )}
          {view === "workflow" && (
            <>
              <div className="lifecycle">
                <div>
                  <span>1</span>
                  <b>Proposed</b>
                  <small>Recommendation cites evidence and uncertainty</small>
                </div>
                <i>→</i>
                <div>
                  <span>2</span>
                  <b>Authorized</b>
                  <small>
                    Resident approves exact fields, purpose and recipient
                  </small>
                </div>
                <i>→</i>
                <div>
                  <span>3</span>
                  <b>Disclosed</b>
                  <small>Minimum data released; receipt sealed</small>
                </div>
                <i>→</i>
                <div>
                  <span>4</span>
                  <b>Accepted</b>
                  <small>Provider owns response clock and next step</small>
                </div>
                <i>→</i>
                <div>
                  <span>5</span>
                  <b>Delivered</b>
                  <small>
                    Provider records service; resident confirms outcome
                  </small>
                </div>
              </div>
              <section className="state-rules">
                <h2>State changes NeighborWell refuses to hide</h2>
                <div>
                  <b>No silent submission</b>
                  <span>
                    Preparation and submission are separate approvals.
                  </span>
                </div>
                <div>
                  <b>No referral disappearance</b>
                  <span>
                    Timeouts escalate; closure requires a reason and
                    notification.
                  </span>
                </div>
                <div>
                  <b>No outcome by assumption</b>
                  <span>
                    Provider completion and resident confirmation remain
                    distinct facts.
                  </span>
                </div>
                <div>
                  <b>No destructive correction</b>
                  <span>
                    Amendments preserve the original record and explain the
                    change.
                  </span>
                </div>
              </section>
            </>
          )}
          {view === "security" && (
            <>
              <div className="security-grid">
                <article>
                  <span>◇</span>
                  <h2>Zero-trust authorization</h2>
                  <p>
                    Default deny. Role alone is insufficient; policy evaluates
                    tenant, relationship, purpose, consent, record and action.
                  </p>
                </article>
                <article>
                  <span>⌁</span>
                  <h2>Encryption boundaries</h2>
                  <p>
                    Separate keys for operational records and documents, TLS in
                    transit, managed rotation, recovery-tested backups.
                  </p>
                </article>
                <article>
                  <span>◆</span>
                  <h2>AI isolation</h2>
                  <p>
                    Models receive the minimum task context, never direct
                    database access, and cannot approve high-impact actions.
                  </p>
                </article>
                <article>
                  <span>◎</span>
                  <h2>Observable accountability</h2>
                  <p>
                    Security events, model receipts and disclosures are
                    tamper-evident, monitored and exportable for independent
                    review.
                  </p>
                </article>
              </div>
              <div className="threat-strip">
                <b>Failure containment</b>
                <span>
                  If evidence expires, a model degrades, consent is revoked, or
                  an integration fails, NeighborWell pauses the affected action without
                  blocking unrelated resident support.
                </span>
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  );
}
function ProgramRegistry({
  capacity,
  onCapacity,
}: {
  capacity: number;
  onCapacity: (value: number) => void;
}) {
  const [selected, setSelected] = useState(0);
  const [mode, setMode] = useState<"record" | "rules" | "evidence" | "history">(
    "record",
  );
  const [published, setPublished] = useState(false);
  const program = registryPrograms[selected];
  const isQuarantined = program.status === "quarantine";
  return (
    <>
      <div className="provider-heading registry-title">
        <div>
          <p className="eyebrow">VERIFIED PROGRAM REGISTRY ENGINE</p>
          <h1>One living source of service truth.</h1>
          <p>
            Rules, capacity, geography, and evidence remain versioned,
            reviewable, and attributable.
          </p>
        </div>
        <div className="registry-health">
          <b>Registry health · 82%</b>
          <span>2 verified · 1 review due · 1 quarantined</span>
        </div>
      </div>
      <div className="registry-engine">
        <aside className="program-index">
          <div className="program-search">
            ⌕ <span>Search 24 programs</span>
          </div>
          <p>ALAMEDA COUNTY PILOT</p>
          {registryPrograms.map((item, i) => (
            <button
              key={item.id}
              className={selected === i ? "selected" : ""}
              onClick={() => {
                setSelected(i);
                setPublished(false);
              }}
            >
              <span>{item.initials}</span>
              <div>
                <b>{item.name}</b>
                <small>{item.organization}</small>
              </div>
              <i className={item.status}>
                {item.status === "verified"
                  ? "✓"
                  : item.status === "review"
                    ? "!"
                    : "◇"}
              </i>
            </button>
          ))}
          <button className="add-program" onClick={() => setSelected(0)}>
            ＋ Start governed program record
          </button>
        </aside>
        <section className="program-record">
          <div className="record-banner">
            <div>
              <span className="record-mark">{program.initials}</span>
              <div>
                <small>
                  {program.category.toUpperCase()} · {program.version}
                </small>
                <h2>{program.name}</h2>
                <p>
                  {program.organization} · {program.geography}
                </p>
              </div>
            </div>
            <span className={`record-state ${program.status}`}>
              {program.status === "verified"
                ? "✓ Verified"
                : program.status === "review"
                  ? "! Review due"
                  : "◇ Evidence quarantine"}
            </span>
          </div>
          {isQuarantined && (
            <div className="quarantine-alert">
              <span>◇</span>
              <div>
                <b>This program is excluded from resident recommendations.</b>
                <p>
                  Two sources disagree about current intake availability. A
                  named reviewer must resolve the conflict before publication.
                </p>
              </div>
              <button onClick={() => setMode("evidence")}>
                Inspect conflict →
              </button>
            </div>
          )}
          <div className="record-tabs">
            {(
              [
                ["record", "Service record"],
                ["rules", "Eligibility rules"],
                ["evidence", "Evidence lineage"],
                ["history", "Version history"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                className={mode === id ? "active" : ""}
                onClick={() => setMode(id)}
              >
                {label}
                {id === "evidence" && <em>{program.evidence}</em>}
              </button>
            ))}
          </div>
          {mode === "record" && (
            <div className="record-content">
              <div className="truth-grid">
                <label>
                  Current openings
                  <strong>
                    {selected === 0 ? capacity : program.capacity}
                  </strong>
                  <input
                    type="range"
                    min="0"
                    max="24"
                    value={selected === 0 ? capacity : program.capacity}
                    disabled={selected !== 0}
                    onChange={(e) => onCapacity(Number(e.target.value))}
                  />
                  <small>
                    {selected === 0
                      ? "Provider-attested · visible after approval"
                      : "Read-only demonstration record"}
                  </small>
                </label>
                <div>
                  <small>INTAKE STATUS</small>
                  <b>
                    {isQuarantined
                      ? "Verification paused"
                      : "Accepting screened referrals"}
                  </b>
                  <span>Purpose: service connection</span>
                </div>
                <div>
                  <small>TYPICAL RESPONSE</small>
                  <b>1–2 business days</b>
                  <span>Measured over 30 days</span>
                </div>
                <div>
                  <small>LANGUAGE ACCESS</small>
                  <b>English · Spanish</b>
                  <span>Human interpretation available</span>
                </div>
                <div>
                  <small>GEOGRAPHIC RULE</small>
                  <b>{program.geography}</b>
                  <span>Address signal; provider decides</span>
                </div>
                <div>
                  <small>NEXT REQUIRED REVIEW</small>
                  <b>{program.review}</b>
                  <span>Owner: Maya Chen</span>
                </div>
              </div>
              <div className="minimum-rule">
                <span>◎</span>
                <p>
                  <b>NeighborWell does not determine eligibility.</b>
                  <small>
                    This record supports an explainable preliminary match. The
                    provider makes the final service decision and the resident
                    may request human review.
                  </small>
                </p>
              </div>
            </div>
          )}
          {mode === "rules" && (
            <div className="rule-list">
              <div>
                <span>01</span>
                <p>
                  <b>Residence signal</b>
                  <small>
                    Resident reports a current Alameda County address.
                  </small>
                </p>
                <em>Required · human-verifiable</em>
              </div>
              <div>
                <span>02</span>
                <p>
                  <b>Housing disruption</b>
                  <small>
                    Overdue rent, notice, unsafe displacement, or credible
                    near-term instability.
                  </small>
                </p>
                <em>Any one signal</em>
              </div>
              <div>
                <span>03</span>
                <p>
                  <b>Income context</b>
                  <small>
                    Income change may affect prioritization; it never creates an
                    automated denial.
                  </small>
                </p>
                <em>Review only</em>
              </div>
              <div className="rule-guardrail">
                <span>◇</span>
                <p>
                  <b>Prohibited automation</b>
                  <small>
                    No autonomous denial, protected-characteristic inference, or
                    undocumented rule substitution.
                  </small>
                </p>
              </div>
            </div>
          )}
          {mode === "evidence" && (
            <div className="evidence-lineage">
              <div className="evidence-score">
                <strong>{isQuarantined ? "46" : "92"}</strong>
                <span>/100</span>
                <p>
                  <b>
                    {isQuarantined
                      ? "Conflicting evidence"
                      : "Strong evidence health"}
                  </b>
                  <small>
                    Score reflects authority, freshness, agreement, and reviewer
                    confirmation.
                  </small>
                </p>
              </div>
              <ol>
                <li>
                  <span>✓</span>
                  <div>
                    <b>Official program policy</b>
                    <small>
                      Provider-published source · checked Aug 12 · content hash
                      preserved
                    </small>
                  </div>
                  <em>Authoritative</em>
                </li>
                <li>
                  <span>✓</span>
                  <div>
                    <b>Geographic service statement</b>
                    <small>County contract exhibit · checked Aug 10</small>
                  </div>
                  <em>Primary source</em>
                </li>
                <li className={isQuarantined ? "conflict" : ""}>
                  <span>{isQuarantined ? "!" : "✓"}</span>
                  <div>
                    <b>Live intake availability</b>
                    <small>
                      {isQuarantined
                        ? "Provider page says closed; staff attestation says open"
                        : "Named staff attestation · expires Aug 20"}
                    </small>
                  </div>
                  <em>{isQuarantined ? "Conflict" : "Time-bound"}</em>
                </li>
              </ol>
            </div>
          )}
          {mode === "history" && (
            <div className="version-history">
              <article>
                <time>
                  AUG 12
                  <br />
                  <b>3:42 PM</b>
                </time>
                <span>✓</span>
                <div>
                  <b>{program.version} · Capacity attestation renewed</b>
                  <p>
                    Seven openings recorded. Source, reviewer, and previous
                    value preserved.
                  </p>
                  <small>Approved by Maya Chen · Evidence reviewer</small>
                </div>
              </article>
              <article>
                <time>
                  AUG 06
                  <br />
                  <b>9:18 AM</b>
                </time>
                <span>↺</span>
                <div>
                  <b>v3.1 · Geographic language clarified</b>
                  <p>
                    Replaced “East Bay” with the contracted Alameda County
                    boundary.
                  </p>
                  <small>Change receipt CIV-PR-0812</small>
                </div>
              </article>
            </div>
          )}
          <div className="registry-actions">
            <p>
              <b>Publication gate</b>
              <span>
                {isQuarantined
                  ? "Blocked until evidence conflict is resolved."
                  : "Changes require evidence review and a named human approver."}
              </span>
            </p>
            <button className="secondary" onClick={() => setPublished(false)}>
              Preview resident view
            </button>
            <button
              className="primary"
              disabled={isQuarantined || published}
              onClick={() => setPublished(true)}
            >
              {published ? "✓ Update recorded" : "Submit governed update →"}
            </button>
          </div>
        </section>
      </div>
      <div className="friction-card">
        <span>◎</span>
        <div>
          <small>REGISTRY INTELLIGENCE</small>
          <h3>Three program records will expire within eight days.</h3>
          <p>
            NeighborWell has opened review tasks for capacity, geographic scope, and
            required-document claims. Unreviewed facts automatically stop
            powering recommendations.
          </p>
        </div>
        <button onClick={() => setSelected(1)}>Open review queue →</button>
      </div>
    </>
  );
}

const engineStages = [
  ["01", "Interpret", "Separate facts from assumptions"],
  ["02", "Structure", "Map connected needs and timing"],
  ["03", "Retrieve", "Use approved evidence only"],
  ["04", "Evaluate", "Test fit, conflicts and uncertainty"],
  ["05", "Explain", "Create a resident-reviewable receipt"],
] as const;

function IntelligenceEngine({
  onExit,
  onRegistry,
}: {
  onExit: () => void;
  onRegistry: () => void;
}) {
  const [stage, setStage] = useState(4);
  const [corrected, setCorrected] = useState(false);
  const [reviewed, setReviewed] = useState(false);
  const labels = [
    "Source interpretation",
    "Need graph",
    "Evidence retrieval",
    "Safety evaluation",
    "Reasoning receipt",
  ];
  return (
    <main className="intelligence-shell">
      <header className="intelligence-top">
        <button className="brand" onClick={() => setStage(4)}>
          <span className="brand-mark">
            <i></i>
            <i></i>
            <i></i>
          </span>
          <span>
            <b>NeighborWell</b>
            <small>Governed intelligence engine</small>
          </span>
        </button>
        <div className="engine-status">
          <i></i> Evaluation gateway healthy · approved evidence only
        </div>
        <button onClick={onRegistry}>Verified registry ↗</button>
        <button onClick={onExit}>Return to resident experience ↗</button>
      </header>
      <div className="intelligence-layout">
        <aside className="engine-nav">
          <small>INTELLIGENCE CONTROL</small>
          {labels.map((label, i) => (
            <button
              key={label}
              className={stage === i ? "active" : ""}
              onClick={() => setStage(i)}
            >
              <span>{String(i + 1).padStart(2, "0")}</span>
              {label}
            </button>
          ))}
          <div className="engine-boundary">
            <b>◆ Decision boundary active</b>
            <small>
              The engine may organize and recommend. It may not determine
              eligibility, submit information, or approve a consequential
              action.
            </small>
          </div>
        </aside>
        <section className="intelligence-main">
          <div className="intelligence-heading">
            <div>
              <p className="eyebrow">PHASE 9 · NeighborWell INTELLIGENCE ENGINE</p>
              <h1>Intelligence that can show its work.</h1>
              <p>
                One governed run converts a resident narrative into reviewable
                needs and evidence-grounded options—without hiding uncertainty
                or replacing human authority.
              </p>
            </div>
            <span className="run-pill">RUN CIV-IE-0914 · policy v2.4</span>
          </div>
          <div className="engine-pipeline">
            {engineStages.map((item, i) => (
              <button
                key={item[1]}
                className={stage === i ? "active" : ""}
                onClick={() => setStage(i)}
              >
                <span>{item[0]}</span>
                <b>{item[1]}</b>
                <small>{item[2]}</small>
              </button>
            ))}
          </div>
          {stage === 0 && (
            <>
              <div className="engine-workbench">
                <section className="engine-card">
                  <small>RESIDENT NARRATIVE · ORIGINAL PRESERVED</small>
                  <h2>“I lost my job last month. My rent is behind…”</h2>
                  <div className="extraction-list">
                    <button onClick={() => setStage(1)}>
                      <b>Explicit fact</b>
                      <small>Employment ended July 10.</small>
                      <em>Resident-stated</em>
                    </button>
                    <button onClick={() => setStage(1)}>
                      <b>Explicit fact</b>
                      <small>Rent is currently overdue.</small>
                      <em>Resident-stated</em>
                    </button>
                    <button className="flagged" onClick={() => setStage(1)}>
                      <b>Unverified assumption</b>
                      <small>Health coverage may end; date is not known.</small>
                      <em>Needs confirmation</em>
                    </button>
                    <button onClick={() => setStage(1)}>
                      <b>Resident goal</b>
                      <small>Build a stable software-career pathway.</small>
                      <em>Preference, not eligibility</em>
                    </button>
                  </div>
                </section>
                <aside className="engine-card reasoning-receipt">
                  <small>INTERPRETATION SAFEGUARDS</small>
                  <h2>Meaning is proposed, never silently assigned.</h2>
                  <div className="receipt-step">
                    <span>1</span>
                    <div>
                      <b>Original text remains authoritative</b>
                      <small>
                        Structured facts can be corrected without rewriting the
                        resident’s words.
                      </small>
                    </div>
                  </div>
                  <div className="receipt-step">
                    <span>2</span>
                    <div>
                      <b>No protected traits inferred</b>
                      <small>
                        Identity, disability, immigration, and household facts
                        require voluntary input.
                      </small>
                    </div>
                  </div>
                  <div className="receipt-step">
                    <span>3</span>
                    <div>
                      <b>Ambiguity lowers confidence</b>
                      <small>
                        Missing dates and documents become questions—not
                        invented answers.
                      </small>
                    </div>
                  </div>
                </aside>
              </div>
            </>
          )}
          {stage === 1 && (
            <>
              <section className="engine-card">
                <small>CONNECTED-NEED GRAPH</small>
                <h2>
                  Four needs, two immediate dependencies, one resident goal.
                </h2>
                <div className="extraction-list">
                  <button onClick={() => setStage(2)}>
                    <b>Housing stability · urgent</b>
                    <small>Risk increases while income is interrupted.</small>
                    <em>Dependency: income</em>
                  </button>
                  <button onClick={() => setStage(2)}>
                    <b>Income replacement · immediate</b>
                    <small>
                      May unlock housing documentation and short-term stability.
                    </small>
                    <em>Potential unlock</em>
                  </button>
                  <button onClick={() => setCorrected(true)}>
                    <b>Coverage continuity · confirm</b>
                    <small>End date and current plan remain unknown.</small>
                    <em>Question required</em>
                  </button>
                  <button onClick={() => setStage(2)}>
                    <b>Career transition · planned</b>
                    <small>
                      Resident-defined goal; not allowed to displace urgent
                      needs.
                    </small>
                    <em>Resident priority</em>
                  </button>
                </div>
                <div className="uncertainty-band">
                  <span>?</span>
                  <div>
                    <b>
                      NeighborWell needs one correction before using the health signal.
                    </b>
                    <small>
                      {corrected
                        ? "Confirmed: coverage ends August 31. The fact is versioned and ready for evidence matching."
                        : "The engine will not guess the coverage end date."}
                    </small>
                  </div>
                </div>
                <div className="engine-actions">
                  <p>
                    <b>Resident correction right</b>
                    <small>
                      Changes create a new structured version while preserving
                      the original narrative.
                    </small>
                  </p>
                  <div>
                    <button
                      className="secondary"
                      onClick={() => setCorrected(false)}
                    >
                      Remove health need
                    </button>
                    <button
                      className="primary"
                      onClick={() => setCorrected(true)}
                    >
                      {corrected ? "✓ Date confirmed" : "Confirm end date →"}
                    </button>
                  </div>
                </div>
              </section>
            </>
          )}
          {stage === 2 && (
            <>
              <div className="engine-workbench">
                <section className="engine-card">
                  <small>APPROVED EVIDENCE RETRIEVAL</small>
                  <h2>Three candidate pathways survived the evidence gate.</h2>
                  <div className="extraction-list">
                    <button onClick={onRegistry}>
                      <b>California EDD claim pathway</b>
                      <small>Official source · current · statewide</small>
                      <em>94% evidence health</em>
                    </button>
                    <button onClick={onRegistry}>
                      <b>Emergency Rent Prevention</b>
                      <small>
                        Provider policy + county boundary + live capacity
                      </small>
                      <em>92% evidence health</em>
                    </button>
                    <button onClick={onRegistry}>
                      <b>Coverage Continuity Navigation</b>
                      <small>
                        Provider policy · review current through Aug 27
                      </small>
                      <em>88% evidence health</em>
                    </button>
                    <button className="flagged" onClick={onRegistry}>
                      <b>Rapid Nutrition Connection</b>
                      <small>Conflicting intake sources detected.</small>
                      <em>Quarantined · excluded</em>
                    </button>
                  </div>
                </section>
                <aside className="engine-card reasoning-receipt">
                  <small>RETRIEVAL RECEIPT</small>
                  <h2>Every claim has lineage.</h2>
                  <div className="receipt-step">
                    <span>1</span>
                    <div>
                      <b>6 approved sources searched</b>
                      <small>
                        Official agencies and provider-attested program records.
                      </small>
                    </div>
                  </div>
                  <div className="receipt-step">
                    <span>2</span>
                    <div>
                      <b>1 source set quarantined</b>
                      <small>
                        Conflicting availability claims cannot influence
                        ranking.
                      </small>
                    </div>
                  </div>
                  <div className="receipt-step">
                    <span>3</span>
                    <div>
                      <b>Snapshot sealed</b>
                      <small>
                        Source versions and retrieval time remain reproducible.
                      </small>
                    </div>
                  </div>
                </aside>
              </div>
            </>
          )}
          {stage === 3 && (
            <>
              <section className="engine-card">
                <small>SAFETY & QUALITY EVALUATION</small>
                <h2>The engine must pass before a recommendation appears.</h2>
                <div className="eval-grid">
                  <article>
                    <b>100%</b>
                    <small>recommendations cite approved evidence</small>
                  </article>
                  <article>
                    <b>0</b>
                    <small>autonomous adverse decisions permitted</small>
                  </article>
                  <article>
                    <b>92%</b>
                    <small>
                      overall run confidence after uncertainty penalties
                    </small>
                  </article>
                </div>
                <div className="human-gate">
                  <b>Human-review boundary detected</b>
                  <small>
                    Housing instability has a possible 72-hour deadline. A
                    navigator must review urgency and the resident must approve
                    any disclosure before referral preparation.
                  </small>
                </div>
                <div className="engine-actions">
                  <p>
                    <b>Adversarial evaluation set · 48 scenarios</b>
                    <small>
                      Checks hallucinated programs, stale rules, overcollection,
                      proxy discrimination, unsupported certainty, and missing
                      escalation.
                    </small>
                  </p>
                  <div>
                    <button
                      className="secondary"
                      onClick={() => setReviewed(false)}
                    >
                      Inspect failures
                    </button>
                    <button
                      className="primary"
                      onClick={() => setReviewed(true)}
                    >
                      {reviewed ? "✓ Evaluation passed" : "Run evaluation →"}
                    </button>
                  </div>
                </div>
              </section>
            </>
          )}
          {stage === 4 && (
            <>
              <div className="engine-workbench">
                <section className="engine-card">
                  <small>REVIEWABLE RECOMMENDATION</small>
                  <h2>
                    Address income and housing first; confirm coverage timing
                    next.
                  </h2>
                  <div className="extraction-list">
                    <button onClick={onExit}>
                      <b>1 · Prepare unemployment draft</b>
                      <small>
                        High confidence · official state source · resident
                        review required
                      </small>
                      <em>Preparation only</em>
                    </button>
                    <button onClick={onRegistry}>
                      <b>2 · Review housing connection</b>
                      <small>
                        High urgency · verified program · 7 reported openings
                      </small>
                      <em>Human navigator required</em>
                    </button>
                    <button onClick={() => setStage(1)}>
                      <b>3 · Confirm coverage end date</b>
                      <small>
                        Medium confidence until resident supplies the date.
                      </small>
                      <em>No action yet</em>
                    </button>
                    <button onClick={onExit}>
                      <b>4 · Preserve career goal</b>
                      <small>
                        Schedule after immediate stabilization unless resident
                        reprioritizes.
                      </small>
                      <em>Resident-directed</em>
                    </button>
                  </div>
                  <div className="uncertainty-band">
                    <span>!</span>
                    <div>
                      <b>What NeighborWell does not know</b>
                      <small>
                        It has not verified final program eligibility, document
                        sufficiency, provider acceptance, or whether assistance
                        will resolve the resident’s situation.
                      </small>
                    </div>
                  </div>
                </section>
                <aside className="engine-card reasoning-receipt">
                  <small>REASONING RECEIPT</small>
                  <h2>Why this recommendation exists</h2>
                  <div className="receipt-score">
                    <b>92%</b>
                    <span>bounded confidence</span>
                  </div>
                  <div className="receipt-step">
                    <span>1</span>
                    <div>
                      <b>Resident facts</b>
                      <small>2 confirmed · 1 uncertain · 1 resident goal</small>
                    </div>
                  </div>
                  <div className="receipt-step">
                    <span>2</span>
                    <div>
                      <b>Evidence</b>
                      <small>
                        5 current sources · 1 quarantined source excluded
                      </small>
                    </div>
                  </div>
                  <div className="receipt-step">
                    <span>3</span>
                    <div>
                      <b>Policy</b>
                      <small>
                        Urgency, dependency and resident preference · no paid
                        ranking
                      </small>
                    </div>
                  </div>
                  <div className="receipt-step">
                    <span>4</span>
                    <div>
                      <b>Authority</b>
                      <small>
                        Resident review next · navigator review required for
                        housing
                      </small>
                    </div>
                  </div>
                </aside>
              </div>
              <div className="engine-actions">
                <p>
                  <b>No action has been taken.</b>
                  <small>
                    This recommendation remains a reviewable proposal until the
                    resident explicitly authorizes the next step.
                  </small>
                </p>
                <div>
                  <button className="secondary" onClick={() => setStage(0)}>
                    Challenge interpretation
                  </button>
                  <button className="primary" onClick={onExit}>
                    Return for resident review →
                  </button>
                </div>
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  );
}

const systemSignals = [
  {
    level: "Priority 1",
    title: "Eviction-prevention capacity gap",
    place: "West Oakland",
    value: "2.4×",
    unit: "demand / opening",
    confidence: 94,
    tone: "critical",
  },
  {
    level: "Priority 2",
    title: "Benefits completion breakdown",
    place: "Countywide",
    value: "27%",
    unit: "delayed at documents",
    confidence: 89,
    tone: "watch",
  },
  {
    level: "Monitor",
    title: "Food access pressure",
    place: "East Oakland",
    value: "+18%",
    unit: "14-day requests",
    confidence: 82,
    tone: "stable",
  },
];

function GovernanceCenter({
  onResident,
  onProvider,
  onNetwork,
}: {
  onResident: () => void;
  onProvider: () => void;
  onNetwork: () => void;
}) {
  const [view, setView] = useState<
    "overview" | "access" | "policies" | "incidents" | "audit"
  >("overview");
  const [policies, setPolicies] = useState([true, true, true, false]);
  const toggle = (i: number) =>
    setPolicies(policies.map((p, n) => (n === i ? !p : p)));
  const nav = [
    ["overview", "Trust control plane"],
    ["access", "Access & authority"],
    ["policies", "AI policy studio"],
    ["incidents", "Incidents & appeals"],
    ["audit", "Decision receipts"],
  ] as const;
  return (
    <main className="governance-shell">
      <header className="governance-top">
        <button
          className="brand governance-brand"
          onClick={() => setView("overview")}
        >
          <span className="brand-mark">
            <i></i>
            <i></i>
            <i></i>
          </span>
          <span>
            <b>NeighborWell</b>
            <small>Accountable intelligence infrastructure</small>
          </span>
        </button>
        <div className="control-label">
          <span>TRUST CONTROL PLANE</span>
          <b>Alameda County pilot</b>
        </div>
        <button onClick={onResident}>Resident experience ↗</button>
        <button onClick={onProvider}>Provider workspace ↗</button>
        <button onClick={onNetwork}>Network intelligence ↗</button>
        <button
          className="profile"
          onClick={() => window.location.assign("/access")}
        >
          <span>DS</span>
          <b>Dr. Dana Shah</b>
          <i>⌄</i>
        </button>
      </header>
      <div className="governance-layout">
        <aside className="governance-nav">
          <div className="governance-seal">
            <span>◇</span>
            <div>
              <b>NeighborWell Accountability Office</b>
              <small>Independent oversight</small>
            </div>
          </div>
          <p>GOVERNANCE</p>
          {nav.map(([id, label]) => (
            <button
              key={id}
              className={view === id ? "active" : ""}
              onClick={() => setView(id)}
            >
              <span>
                {id === "overview"
                  ? "⌘"
                  : id === "access"
                    ? "♙"
                    : id === "policies"
                      ? "◆"
                      : id === "incidents"
                        ? "!"
                        : "▤"}
              </span>
              {label}
              {id === "incidents" && <em>1</em>}
            </button>
          ))}
          <p>ASSURANCE</p>
          <button onClick={() => setView("audit")}>
            <span>✓</span>Evidence registry
          </button>
          <button onClick={() => setView("policies")}>
            <span>◎</span>Equity reviews
          </button>
          <div className="trust-posture">
            <span>94</span>
            <b>Strong trust posture</b>
            <p>
              All high-impact controls are active. One review is due in 3 days.
            </p>
            <small>Assessed 18 minutes ago</small>
          </div>
        </aside>
        <section className="governance-main">
          {view === "overview" && (
            <>
              <div className="governance-heading">
                <div>
                  <p className="eyebrow">TRUST CONTROL PLANE · AUGUST 12</p>
                  <h1>See how authority moves through NeighborWell.</h1>
                  <p>
                    Every recommendation, disclosure, approval, and reversal is
                    attributable to evidence, policy, consent, and a named human
                    authority.
                  </p>
                </div>
                <div className="posture-score">
                  <span>94</span>
                  <div>
                    <b>Trust posture</b>
                    <small>28 of 29 controls healthy</small>
                  </div>
                </div>
              </div>
              <div className="governance-alert">
                <span>!</span>
                <div>
                  <b>One evidence rule needs human review.</b>
                  <p>
                    The Alameda County housing-income threshold changes August
                    15. NeighborWell has quarantined the draft rule from live
                    recommendations.
                  </p>
                </div>
                <button onClick={() => setView("policies")}>
                  Review safeguard →
                </button>
              </div>
              <div className="governance-metrics">
                <article>
                  <small>HIGH-IMPACT ACTIONS</small>
                  <b>186</b>
                  <span>100% human-authorized</span>
                </article>
                <article>
                  <small>ACTIVE CONSENT GRANTS</small>
                  <b>412</b>
                  <span>37 expire this week</span>
                </article>
                <article>
                  <small>EVIDENCE HEALTH</small>
                  <b>97%</b>
                  <span>42 sources current</span>
                </article>
                <article>
                  <small>OPEN APPEALS</small>
                  <b>3</b>
                  <span>Oldest: 19 hours</span>
                </article>
              </div>
              <div className="governance-grid">
                <section className="control-card">
                  <small>LIVE ASSURANCE MAP</small>
                  <h2>Controls protecting consequential action</h2>
                  <div className="control-list">
                    <div className="control-row">
                      <span>◇</span>
                      <div>
                        <b>Purpose-bound consent</b>
                        <small>
                          Data use is previewed, specific, expiring, and
                          revocable.
                        </small>
                      </div>
                      <strong>Healthy · 100%</strong>
                    </div>
                    <div className="control-row">
                      <span>✓</span>
                      <div>
                        <b>Named human authority</b>
                        <small>
                          Legal, health, housing, and crisis pathways cannot
                          self-approve.
                        </small>
                      </div>
                      <strong>Healthy · 100%</strong>
                    </div>
                    <div className="control-row">
                      <span>◆</span>
                      <div>
                        <b>Evidence before answers</b>
                        <small>
                          Official sources, verification date, uncertainty, and
                          limitations shown.
                        </small>
                      </div>
                      <strong>Review due</strong>
                    </div>
                    <div className="control-row">
                      <span>↺</span>
                      <div>
                        <b>Reversible decisions</b>
                        <small>
                          Rule versions, appeals, correction rights, and
                          rollback paths preserved.
                        </small>
                      </div>
                      <strong>Healthy · 98%</strong>
                    </div>
                  </div>
                </section>
                <aside className="receipt-panel">
                  <small>LIVE DECISION RECEIPT</small>
                  <h2>Housing referral · CIV-8841</h2>
                  <p>
                    This trace contains no resident identity. Open each layer to
                    inspect the accountable chain.
                  </p>
                  <div className="receipt-path">
                    <div>
                      <span>1</span>
                      <p>
                        <b>Proposal</b>
                        <small>Need-matching engine v2.4 · 3:41 PM</small>
                      </p>
                    </div>
                    <div>
                      <span>2</span>
                      <p>
                        <b>Evidence</b>
                        <small>4 approved sources · 92% confidence</small>
                      </p>
                    </div>
                    <div>
                      <span>3</span>
                      <p>
                        <b>Resident authority</b>
                        <small>8 fields approved · expires Aug 19</small>
                      </p>
                    </div>
                    <div>
                      <span>4</span>
                      <p>
                        <b>Human review</b>
                        <small>Nia Williams · Housing Navigator</small>
                      </p>
                    </div>
                    <div>
                      <span>5</span>
                      <p>
                        <b>Outcome</b>
                        <small>Provider accepted · resident notified</small>
                      </p>
                    </div>
                  </div>
                  <button onClick={() => setView("audit")}>
                    Inspect complete receipt →
                  </button>
                </aside>
              </div>
            </>
          )}
          {view === "access" && (
            <>
              <div className="governance-heading">
                <div>
                  <p className="eyebrow">ACCESS & AUTHORITY</p>
                  <h1>Permission follows purpose—not job title alone.</h1>
                  <p>
                    Role, organization, record relationship, consent scope, and
                    action sensitivity are checked together before access is
                    granted.
                  </p>
                </div>
                <span className="privacy-badge">◇ Least privilege active</span>
              </div>
              <section className="role-card">
                <small>AUTHORITY MATRIX</small>
                <h2>What each role may see and do</h2>
                <table className="permission-matrix">
                  <thead>
                    <tr>
                      <th>Role</th>
                      <th>Resident record</th>
                      <th>Prepare action</th>
                      <th>Approve action</th>
                      <th>Policy control</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <b>Resident / caregiver</b>
                      </td>
                      <td className="allowed">Own record</td>
                      <td className="allowed">✓</td>
                      <td className="allowed">Own consent</td>
                      <td className="blocked">—</td>
                    </tr>
                    <tr>
                      <td>
                        <b>Navigator</b>
                      </td>
                      <td className="allowed">Assigned + consent</td>
                      <td className="allowed">✓</td>
                      <td className="blocked">Limited</td>
                      <td className="blocked">—</td>
                    </tr>
                    <tr>
                      <td>
                        <b>Provider supervisor</b>
                      </td>
                      <td className="allowed">Purpose-bound</td>
                      <td className="allowed">✓</td>
                      <td className="allowed">Service decision</td>
                      <td className="blocked">—</td>
                    </tr>
                    <tr>
                      <td>
                        <b>Accountability officer</b>
                      </td>
                      <td className="blocked">De-identified</td>
                      <td className="blocked">—</td>
                      <td className="allowed">Policy exception</td>
                      <td className="allowed">✓</td>
                    </tr>
                    <tr>
                      <td>
                        <b>System administrator</b>
                      </td>
                      <td className="blocked">No default access</td>
                      <td className="blocked">—</td>
                      <td className="blocked">—</td>
                      <td className="allowed">Technical only</td>
                    </tr>
                  </tbody>
                </table>
              </section>
              <div className="governance-grid" style={{ marginTop: 14 }}>
                <section className="role-card">
                  <small>ACTIVE AUTHORITY</small>
                  <h2>Human reviewers online</h2>
                  <div className="role-list">
                    <div className="role-item">
                      <span>NW</span>
                      <div>
                        <b>Nia Williams · Housing Navigator</b>
                        <small>24 assigned records · MFA verified</small>
                      </div>
                      <strong>Active</strong>
                    </div>
                    <div className="role-item">
                      <span>DM</span>
                      <div>
                        <b>Dr. Marisol Chen · Clinical reviewer</b>
                        <small>
                          Health pathway · professional credential current
                        </small>
                      </div>
                      <strong>Active</strong>
                    </div>
                    <div className="role-item">
                      <span>AL</span>
                      <div>
                        <b>Avery Lee · Accountability Officer</b>
                        <small>
                          Independent audit scope · no resident identifiers
                        </small>
                      </div>
                      <strong>Active</strong>
                    </div>
                  </div>
                </section>
                <aside className="incident-card">
                  <small>ACCESS SIGNAL</small>
                  <h2>Unusual request blocked</h2>
                  <p className="prototype-note">
                    A provider staff account requested fields outside an active
                    consent purpose. NeighborWell denied access automatically and
                    recorded the attempt for supervisor review.
                  </p>
                </aside>
              </div>
            </>
          )}
          {view === "policies" && (
            <>
              <div className="governance-heading">
                <div>
                  <p className="eyebrow">AI POLICY STUDIO</p>
                  <h1>Define what intelligence may—and may never—do.</h1>
                  <p>
                    These controls govern all four NeighborWell environments. Changes
                    require two-person approval and create a permanent versioned
                    receipt.
                  </p>
                </div>
                <span className="simulation-badge">
                  ◆ Policy set v2.4 · active
                </span>
              </div>
              <section className="policy-card">
                <small>HIGH-IMPACT SAFEGUARDS</small>
                <h2>Non-negotiable system boundaries</h2>
                <div className="policy-list">
                  {[
                    [
                      "No autonomous eligibility denial",
                      "NeighborWell may identify missing evidence, but a qualified human makes adverse decisions.",
                    ],
                    [
                      "Human review for specialized risk",
                      "Legal, medical, immigration, domestic violence, child safety, and crisis pathways escalate.",
                    ],
                    [
                      "Evidence quarantine",
                      "Expired, disputed, or unapproved sources cannot influence live recommendations.",
                    ],
                    [
                      "External model training",
                      "Resident information may never train an external model without separate informed permission.",
                    ],
                  ].map((p, i) => (
                    <div className="policy-item" key={p[0]}>
                      <span>{i === 2 ? "!" : "◆"}</span>
                      <div>
                        <b>{p[0]}</b>
                        <small>{p[1]}</small>
                      </div>
                      <button
                        className={`switch ${policies[i] ? "on" : ""}`}
                        onClick={() => toggle(i)}
                        aria-label={`Toggle ${p[0]}`}
                      >
                        <i></i>
                      </button>
                    </div>
                  ))}
                </div>
                <div className="prototype-note">
                  <b>Prototype safeguard:</b> Controls demonstrate governance
                  behavior only. No live model, public-benefit system, resident
                  record, or external data source is connected.
                </div>
              </section>
            </>
          )}
          {view === "incidents" && (
            <>
              <div className="governance-heading">
                <div>
                  <p className="eyebrow">INCIDENTS, COMPLAINTS & APPEALS</p>
                  <h1>Every person can challenge the system.</h1>
                  <p>
                    Residents can correct facts, revoke permission, appeal an
                    outcome, or report harm without losing access to other
                    services.
                  </p>
                </div>
                <span className="privacy-badge">3 open · 0 overdue</span>
              </div>
              <section className="incident-card">
                <small>REVIEW QUEUE</small>
                <h2>Matters requiring accountable response</h2>
                <div className="incident-list">
                  <div className="incident-item alert">
                    <span>!</span>
                    <div>
                      <b>Evidence-rule review · Housing threshold</b>
                      <small>
                        System-raised · quarantined from recommendations · due
                        Aug 14
                      </small>
                    </div>
                    <strong>High priority</strong>
                  </div>
                  <div className="incident-item">
                    <span>↺</span>
                    <div>
                      <b>Resident appeal · Referral closure</b>
                      <small>
                        Resident states service was not received · navigator
                        response due in 5 hours
                      </small>
                    </div>
                    <strong>Open</strong>
                  </div>
                  <div className="incident-item">
                    <span>✎</span>
                    <div>
                      <b>Fact correction · Household size</b>
                      <small>
                        Correction submitted by resident · no action taken from
                        disputed fact
                      </small>
                    </div>
                    <strong>Reviewing</strong>
                  </div>
                  <div className="incident-item">
                    <span>◇</span>
                    <div>
                      <b>Consent revocation confirmed</b>
                      <small>
                        Provider access ended · previously transmitted fields
                        preserved in receipt
                      </small>
                    </div>
                    <strong>Resolved</strong>
                  </div>
                </div>
              </section>
            </>
          )}
          {view === "audit" && (
            <>
              <div className="governance-heading">
                <div>
                  <p className="eyebrow">DECISION RECEIPTS & ACTION LEDGER</p>
                  <h1>Trace any material action end to end.</h1>
                  <p>
                    Search by receipt identifier, rule version, organization,
                    reviewer, or action type. Resident identity remains
                    protected by access scope.
                  </p>
                </div>
                <button
                  className="capacity-button"
                  onClick={() =>
                    deliverAction(
                      "Governance audit export prepared with decision receipts, rule versions, named authorities, and privacy-safe identifiers.",
                    )
                  }
                >
                  Export privacy-safe audit
                </button>
              </div>
              <section className="control-card">
                <small>ACCOUNTABILITY SEARCH</small>
                <h2>Decision and disclosure history</h2>
                <div className="receipt-search">
                  <input
                    aria-label="Search decision receipts"
                    placeholder="Search receipt, rule, reviewer, or organization…"
                  />
                  <button onClick={() => setView("audit")}>
                    Search records
                  </button>
                </div>
                <div className="audit-table">
                  <div className="audit-row">
                    <time>Aug 12 · 3:41</time>
                    <b>CIV-8841 · Housing referral</b>
                    <span>Nia Williams · authorized</span>
                    <strong>Outcome confirmed</strong>
                  </div>
                  <div className="audit-row">
                    <time>Aug 12 · 1:18</time>
                    <b>CIV-8829 · Coverage guidance</b>
                    <span>Rule v2.4 · 3 sources</span>
                    <strong>Resident reviewing</strong>
                  </div>
                  <div className="audit-row">
                    <time>Aug 11 · 10:06</time>
                    <b>POL-214 · Language access</b>
                    <span>Governance Council · approved</span>
                    <strong>Active</strong>
                  </div>
                  <div className="audit-row">
                    <time>Aug 06 · 2:31</time>
                    <b>POL-198 · Priority rule</b>
                    <span>Equity review · adjusted</span>
                    <strong>Version preserved</strong>
                  </div>
                </div>
              </section>
            </>
          )}
        </section>
      </div>
    </main>
  );
}

function NetworkCommandCenter({
  onResident,
  onProvider,
}: {
  onResident: () => void;
  onProvider: () => void;
}) {
  const [view, setView] = useState<
    "signals" | "scenario" | "equity" | "ledger"
  >("signals");
  const [investment, setInvestment] = useState(600);
  const [selected, setSelected] = useState(0);
  const [authorized, setAuthorized] = useState(false);
  const signal = systemSignals[selected];
  const openings = Math.round(investment / 24);
  const households = Math.round(investment / 5.4);
  return (
    <main className="network-shell">
      <header className="network-top">
        <button
          className="brand network-brand"
          onClick={() => setView("signals")}
        >
          <span className="brand-mark">
            <i></i>
            <i></i>
            <i></i>
          </span>
          <span>
            <b>NeighborWell</b>
            <small>Public intelligence commons</small>
          </span>
        </button>
        <div className="network-scope">
          <span>ALAMEDA COUNTY</span>
          <b>Housing & economic stability</b>
        </div>
        <button onClick={onProvider}>Provider workspace ↗</button>
        <button onClick={onResident}>Resident experience ↗</button>
        <button
          className="profile"
          onClick={() => window.location.assign("/access")}
        >
          <span>AM</span>
          <b>Alex Morgan</b>
          <i>⌄</i>
        </button>
      </header>
      <div className="network-layout">
        <aside className="network-nav">
          <div className="public-seal">
            <span>AC</span>
            <div>
              <b>Alameda County</b>
              <small>Community response office</small>
            </div>
          </div>
          <p>INTELLIGENCE</p>
          {(
            [
              ["signals", "System signals"],
              ["scenario", "Intervention studio"],
              ["equity", "Equity observatory"],
              ["ledger", "Public action ledger"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              className={view === id ? "active" : ""}
              onClick={() => setView(id)}
            >
              <span>
                {id === "signals"
                  ? "⌁"
                  : id === "scenario"
                    ? "◈"
                    : id === "equity"
                      ? "◎"
                      : "▤"}
              </span>
              {label}
              {id === "signals" && <em>3</em>}
            </button>
          ))}
          <div className="privacy-floor">
            <span>◇</span>
            <b>Privacy floor active</b>
            <p>
              Groups under 15 people are suppressed. No resident identity is
              visible here.
            </p>
            <small>Last audit · Aug 11</small>
          </div>
        </aside>
        <section className="network-main">
          {view === "signals" && (
            <>
              <div className="network-heading">
                <div>
                  <p className="eyebrow">SYSTEM SITUATION ROOM · AUGUST 12</p>
                  <h1>See pressure before it becomes crisis.</h1>
                  <p>
                    Verified outcomes, live provider capacity, and privacy-safe
                    community patterns in one accountable view.
                  </p>
                </div>
                <div className="evidence-health">
                  <span>97%</span>
                  <div>
                    <b>Evidence health</b>
                    <small>42 sources · 11 providers current</small>
                  </div>
                </div>
              </div>
              <div className="network-banner">
                <span>✦</span>
                <div>
                  <b>NeighborWell detected a preventable housing bottleneck.</b>
                  <p>
                    Demand is accelerating while two programs reduced openings.
                    A targeted 30-day response could protect an estimated 111
                    households.
                  </p>
                </div>
                <button onClick={() => setView("scenario")}>
                  Model a response →
                </button>
              </div>
              <div className="network-metrics">
                <article>
                  <small>RESIDENT NEED SIGNALS</small>
                  <b>1,284</b>
                  <span>↑ 12% in 30 days</span>
                </article>
                <article>
                  <small>VERIFIED SERVICE CAPACITY</small>
                  <b>438</b>
                  <span>Across 11 providers</span>
                </article>
                <article>
                  <small>CLOSED-LOOP OUTCOMES</small>
                  <b>74%</b>
                  <span>Service confirmed</span>
                </article>
                <article>
                  <small>MEDIAN TIME TO HELP</small>
                  <b>2.8d</b>
                  <span>↓ 0.6 day</span>
                </article>
              </div>
              <div className="network-grid">
                <section className="signal-list">
                  <div className="panel-title">
                    <div>
                      <h2>Priority intelligence</h2>
                      <p>
                        Ranked by potential harm, scale, velocity, and
                        confidence.
                      </p>
                    </div>
                    <span>Identity-safe aggregate</span>
                  </div>
                  {systemSignals.map((s, i) => (
                    <button
                      key={s.title}
                      className={selected === i ? "selected" : ""}
                      onClick={() => setSelected(i)}
                    >
                      <i className={s.tone}></i>
                      <span>
                        <small>
                          {s.level} · {s.place}
                        </small>
                        <b>{s.title}</b>
                        <em>{s.confidence}% evidence confidence</em>
                      </span>
                      <strong>
                        {s.value}
                        <small>{s.unit}</small>
                      </strong>
                      <b>→</b>
                    </button>
                  ))}
                </section>
                <aside className="signal-evidence">
                  <small>EVIDENCE PROVENANCE</small>
                  <h2>{signal.title}</h2>
                  <p>
                    This is a system signal, not a prediction about any
                    individual.
                  </p>
                  <dl>
                    <div>
                      <dt>Resident-authorized outcomes</dt>
                      <dd>186</dd>
                    </div>
                    <div>
                      <dt>Provider capacity attestations</dt>
                      <dd>11</dd>
                    </div>
                    <div>
                      <dt>Official datasets</dt>
                      <dd>4</dd>
                    </div>
                    <div>
                      <dt>Last recalculated</dt>
                      <dd>18 min ago</dd>
                    </div>
                  </dl>
                  <div className="confidence-ring">
                    <span>{signal.confidence}%</span>
                    <p>
                      <b>Strong evidence</b>
                      <small>Known limitations disclosed</small>
                    </p>
                  </div>
                  <button onClick={() => setView("ledger")}>
                    Inspect full lineage →
                  </button>
                </aside>
              </div>
            </>
          )}
          {view === "scenario" && (
            <>
              <div className="network-heading">
                <div>
                  <p className="eyebrow">INTERVENTION STUDIO</p>
                  <h1>
                    Test public action before committing public resources.
                  </h1>
                  <p>
                    Scenarios are estimates—not promises. Assumptions remain
                    visible and challengeable.
                  </p>
                </div>
                <span className="simulation-badge">
                  ◈ Decision simulation · not deployed
                </span>
              </div>
              <div className="scenario-layout">
                <section className="scenario-controls">
                  <small>RESPONSE DESIGN</small>
                  <h2>30-day housing stabilization surge</h2>
                  <label>
                    <span>
                      Proposed investment <b>${investment},000</b>
                    </span>
                    <input
                      type="range"
                      min="250"
                      max="1200"
                      step="50"
                      value={investment}
                      onChange={(e) => {
                        setInvestment(Number(e.target.value));
                        setAuthorized(false);
                      }}
                    />
                  </label>
                  <div className="allocation">
                    <button
                      className="active"
                      onClick={() =>
                        setInvestment(Math.max(250, investment - 50))
                      }
                    >
                      Direct assistance <b>58%</b>
                    </button>
                    <button
                      onClick={() =>
                        setInvestment(Math.min(1200, investment + 50))
                      }
                    >
                      Navigation staff <b>24%</b>
                    </button>
                    <button
                      onClick={() =>
                        setInvestment(Math.min(1200, investment + 50))
                      }
                    >
                      Legal prevention <b>18%</b>
                    </button>
                  </div>
                  <h3>Safeguards applied</h3>
                  <p>✓ No automated eligibility denial</p>
                  <p>✓ Resident appeal and human review</p>
                  <p>✓ Weekly disparate-impact check</p>
                  <p>✓ Funds cannot be ranked by provider payment</p>
                </section>
                <section className="scenario-results">
                  <div className="result-head">
                    <div>
                      <small>MODELED COMMUNITY EFFECT</small>
                      <h2>What could change in 30 days</h2>
                    </div>
                    <span>Range shown</span>
                  </div>
                  <div className="impact-number">
                    <span>
                      {households - 18}–{households + 22}
                    </span>
                    <p>
                      <b>households stabilized</b>
                      <small>68% model confidence</small>
                    </p>
                  </div>
                  <div className="impact-grid">
                    <article>
                      <small>NEW SERVICE OPENINGS</small>
                      <b>+{openings}</b>
                      <span>Across 5 partners</span>
                    </article>
                    <article>
                      <small>MEDIAN RESPONSE TIME</small>
                      <b>1.6d</b>
                      <span>From 2.8 days</span>
                    </article>
                    <article>
                      <small>CAPACITY RATIO</small>
                      <b>1.3×</b>
                      <span>From 2.4× demand</span>
                    </article>
                  </div>
                  <div className="assumption-box">
                    <b>What could make this wrong?</b>
                    <p>
                      Landlord participation, processing time, applicant
                      documentation, and unreported demand could materially
                      change the result.
                    </p>
                    <button onClick={() => setView("signals")}>
                      Review 12 assumptions →
                    </button>
                  </div>
                  <label className="authorization">
                    <input
                      type="checkbox"
                      checked={authorized}
                      onChange={(e) => setAuthorized(e.target.checked)}
                    />
                    <span>
                      <b>Authorize this scenario for committee review</b>
                      <small>
                        Records the evidence, assumptions, author, and approval
                        path. It does not release funds.
                      </small>
                    </span>
                  </label>
                  <button
                    disabled={!authorized}
                    className="primary"
                    onClick={() => setView("ledger")}
                  >
                    Record proposed intervention →
                  </button>
                </section>
              </div>
            </>
          )}
          {view === "equity" && (
            <>
              <div className="network-heading">
                <div>
                  <p className="eyebrow">EQUITY OBSERVATORY</p>
                  <h1>Measure who receives help—and who is still waiting.</h1>
                  <p>
                    Comparisons appear only above NeighborWell’s privacy threshold and
                    include data-quality warnings.
                  </p>
                </div>
                <span className="privacy-badge">◇ Minimum group size · 15</span>
              </div>
              <div className="equity-hero">
                <div>
                  <small>NETWORK EQUITY INDEX</small>
                  <b>
                    78<em>/100</em>
                  </b>
                  <span>↑ 5 points since May</span>
                </div>
                <div>
                  <h3>Largest correctable gap</h3>
                  <p>
                    Residents using non-English services wait{" "}
                    <b>1.4 days longer</b> for confirmed housing assistance.
                  </p>
                  <button onClick={() => setView("scenario")}>
                    Design language-access response →
                  </button>
                </div>
              </div>
              <div className="equity-table">
                <div className="panel-title">
                  <div>
                    <h2>Outcome parity by access need</h2>
                    <p>Confirmed service rate · trailing 90 days</p>
                  </div>
                  <span>Coverage: 91%</span>
                </div>
                <div className="equity-row">
                  <b>Network baseline</b>
                  <meter min="0" max="100" value="74" />
                  <strong>74%</strong>
                  <small>1,012 outcomes</small>
                </div>
                <div className="equity-row">
                  <b>English service</b>
                  <meter min="0" max="100" value="77" />
                  <strong>77%</strong>
                  <small>812 outcomes</small>
                </div>
                <div className="equity-row gap">
                  <b>Non-English service</b>
                  <meter min="0" max="100" value="63" />
                  <strong>63%</strong>
                  <small>200 outcomes · gap flagged</small>
                </div>
                <div className="equity-row">
                  <b>Mobility accommodation</b>
                  <meter min="0" max="100" value="71" />
                  <strong>71%</strong>
                  <small>96 outcomes</small>
                </div>
              </div>
              <div className="data-caution">
                <span>!</span>
                <p>
                  <b>Interpret with care</b>
                  <small>
                    Identity, disability, and language information is voluntary.
                    Missing information may hide additional inequity; NeighborWell
                    never infers protected characteristics.
                  </small>
                </p>
              </div>
            </>
          )}
          {view === "ledger" && (
            <>
              <div className="network-heading">
                <div>
                  <p className="eyebrow">PUBLIC ACTION LEDGER</p>
                  <h1>Every consequential decision leaves a public trace.</h1>
                  <p>
                    Transparent at the system level. Private at the resident
                    level.
                  </p>
                </div>
                <button
                  className="capacity-button"
                  onClick={() =>
                    deliverAction(
                      "Public action ledger export prepared with proposals, decisions, assumptions, reviewers, and version history.",
                    )
                  }
                >
                  Export public record
                </button>
              </div>
              <div className="ledger-principles">
                <div>
                  <span>✓</span>
                  <p>
                    <b>Actions are attributable</b>
                    <small>Named office, reviewer, and timestamp</small>
                  </p>
                </div>
                <div>
                  <span>◇</span>
                  <p>
                    <b>Residents stay private</b>
                    <small>No case records or identity fields</small>
                  </p>
                </div>
                <div>
                  <span>↺</span>
                  <p>
                    <b>Decisions are reversible</b>
                    <small>Review dates and rollback conditions</small>
                  </p>
                </div>
              </div>
              <section className="public-ledger">
                <div className="ledger-event">
                  <time>
                    AUG 12
                    <br />
                    <b>4:18 PM</b>
                  </time>
                  <span className="event-mark proposed">◈</span>
                  <article>
                    <small>PROPOSED · AWAITING COMMITTEE REVIEW</small>
                    <h2>30-day housing stabilization surge</h2>
                    <p>
                      ${investment},000 modeled allocation · {households - 18}–
                      {households + 22} households estimated · assumptions
                      disclosed
                    </p>
                    <div>
                      <b>Proposed by</b> Community Response Office{" "}
                      <b>Evidence snapshot</b> CIV-AC-0812-44
                    </div>
                    <button onClick={() => setView("scenario")}>
                      Open decision receipt →
                    </button>
                  </article>
                </div>
                <div className="ledger-event">
                  <time>
                    AUG 11
                    <br />
                    <b>10:06 AM</b>
                  </time>
                  <span className="event-mark verified">✓</span>
                  <article>
                    <small>VERIFIED · ACTIVE</small>
                    <h2>Language-access response standard</h2>
                    <p>
                      Human interpretation required for 8 high-impact service
                      pathways. 30-day equity review scheduled.
                    </p>
                    <div>
                      <b>Approved by</b> Network Governance Council{" "}
                      <b>Public comments</b> 14 reviewed
                    </div>
                    <button onClick={() => setView("equity")}>
                      Open decision receipt →
                    </button>
                  </article>
                </div>
                <div className="ledger-event">
                  <time>
                    AUG 06
                    <br />
                    <b>2:31 PM</b>
                  </time>
                  <span className="event-mark review">↺</span>
                  <article>
                    <small>REVIEW COMPLETED · ADJUSTED</small>
                    <h2>Eviction referral prioritization rule</h2>
                    <p>
                      Deadline weight reduced after disparate-impact review;
                      urgency remains human-reviewable.
                    </p>
                    <div>
                      <b>Changed by</b> NeighborWell Accountability Office{" "}
                      <b>Reason</b> Equity threshold exceeded
                    </div>
                    <button onClick={() => setView("equity")}>
                      Compare rule versions →
                    </button>
                  </article>
                </div>
              </section>
            </>
          )}
        </section>
      </div>
    </main>
  );
}
