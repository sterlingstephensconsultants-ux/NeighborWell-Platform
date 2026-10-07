"use client";
import { useState } from "react";
import Link from "next/link";
import type { ChatGPTUser } from "../chatgpt-auth";
import {
  deliverAction,
  downloadDeploymentPlan,
} from "../../lib/action-artifacts";
import "./access.css";
type Tab =
  | "overview"
  | "security"
  | "permissions"
  | "settings"
  | "verification"
  | "audit";
const roles = [
  [
    "Resident",
    "My Story · Action plan · My consent · My connections · Outcomes · Human support",
    "No administration, provider records, analytics, or policy controls",
  ],
  [
    "Navigator",
    "Assigned participants · Needs and goals · Consent scope · Referrals · Follow-ups · Service plan",
    "No security, settings, identity logs, or verification approval",
  ],
  [
    "Provider",
    "Referral queue · Program capacity · Eligibility evidence · Service delivery · Outcome report",
    "No unrelated participant records, network identities, or settings",
  ],
  [
    "Network analyst",
    "Aggregate signals · Equity measures · Evaluation · Evidence lineage",
    "No identity, contact data, documents, consent editing, or administration",
  ],
  [
    "Accountability reviewer",
    "De-identified receipts · Incidents · Appeals · Policy versions · Audit evidence",
    "No operational case editing, user provisioning, or configuration",
  ],
  [
    "Administrator",
    "Security · Permissions · Settings · Verifications · Organizations · Integrations · Audit configuration",
    "No default access to participant stories, documents, or service notes",
  ],
];
export default function AccessCenter({
  user,
  signOutPath,
}: {
  user: ChatGPTUser;
  signOutPath: string;
}) {
  const [tab, setTab] = useState<Tab>("overview");
  const [mfa, setMfa] = useState(true);
  const [sessions, setSessions] = useState(true);
  const [dual, setDual] = useState(true);
  const [note, setNote] = useState("");
  const flash = (s: string) => {
    deliverAction(s);
    setNote(s);
    window.setTimeout(() => setNote(""), 2800);
  };
  const nav: [Tab, string, string][] = [
    ["overview", "Control center", "⌘"],
    ["security", "Security", "◇"],
    ["permissions", "Roles & permissions", "♙"],
    ["settings", "System settings", "⚙"],
    ["verification", "Verification settings", "✓"],
    ["audit", "Audit & receipts", "▤"],
  ];
  return (
    <main className="admin-shell">
      <header className="admin-top">
        <Link className="admin-brand" href="/">
          <span className="brand-mark">
            <i></i>
            <i></i>
            <i></i>
          </span>
          <span>
            <b>NeighborWell</b>
            <small>Administrator control center</small>
          </span>
        </Link>
        <div className="admin-identity">
          <i></i>
          <span>
            <small>PROTECTED ADMINISTRATIVE SESSION</small>
            <b>{user.displayName}</b>
          </span>
        </div>
        <Link href="/">Resident experience</Link>
        <a href={signOutPath}>Sign out</a>
      </header>
      <div className="admin-layout">
        <aside className="admin-nav">
          <div className="admin-role">
            <span>◆</span>
            <div>
              <b>System Administrator</b>
              <small>Privileged control plane</small>
            </div>
          </div>
          <p>ADMINISTRATION</p>
          {nav.map(([id, label, icon]) => (
            <button
              key={id}
              className={tab === id ? "active" : ""}
              onClick={() => setTab(id)}
            >
              <span>{icon}</span>
              {label}
              {id === "verification" && <em>3</em>}
            </button>
          ))}
          <div className="boundary">
            <b>Administrative boundary</b>
            <p>
              System authority does not create default access to participant
              stories, documents, or service notes.
            </p>
          </div>
        </aside>
        <section className="admin-main">
          {tab === "overview" && (
            <>
              <Head
                over="ADMINISTRATOR CONTROL CENTER"
                title="Control the platform without entering participant work."
                text="Security, permissions, settings, and verifications are isolated here. Every privileged change requires identity, purpose, confirmation, and an immutable receipt."
              />
              <div className="posture">
                <div>
                  <span>94</span>
                  <small>/100</small>
                </div>
                <p>
                  <b>Strong control posture</b>
                  <small>
                    MFA required · least privilege active · three verification
                    reviews due
                  </small>
                </p>
                <strong>2 ADMINISTRATORS</strong>
              </div>
              <Metrics />
              <div className="split">
                <section className="card">
                  <h2>Administrative attention</h2>
                  {[
                    ["!", "Housing-rule source expires in three days"],
                    ["◇", "Unusual provider request blocked"],
                    ["↺", "Quarterly permission review due"],
                  ].map((x) => (
                    <article key={x[1]}>
                      <span>{x[0]}</span>
                      <p>
                        <b>{x[1]}</b>
                        <small>Owner assigned · receipt available</small>
                      </p>
                      <button
                        onClick={() => flash("Administrative review opened.")}
                      >
                        Review →
                      </button>
                    </article>
                  ))}
                </section>
                <aside className="duties">
                  <small>SEPARATION OF DUTIES</small>
                  <h2>No administrator silently controls NeighborWell.</h2>
                  <p>
                    High-impact permission, verification, retention, and
                    AI-policy changes require a second authorized approver.
                  </p>
                  <ul>
                    <li>Proposers cannot self-approve</li>
                    <li>Emergency access expires automatically</li>
                    <li>Participant access requires a separate case purpose</li>
                    <li>All approvals and denials are receipted</li>
                  </ul>
                </aside>
              </div>
            </>
          )}
          {tab === "security" && (
            <>
              <Head
                over="SECURITY"
                title="Protect identities, sessions, data, and platform boundaries."
                text="Only administrators configure technical security. Participant records remain separately purpose-protected."
              />
              <div className="controls">
                <Toggle
                  title="Multi-factor authentication"
                  text="Required for privileged and participant-facing staff roles."
                  on={mfa}
                  set={() => setMfa(!mfa)}
                />
                <Toggle
                  title="Privileged session limits"
                  text="15-minute inactivity lock and eight-hour maximum session."
                  on={sessions}
                  set={() => setSessions(!sessions)}
                />
                <Toggle
                  title="Two-person approval"
                  text="Required for permissions, retention, verifications, and high-impact policies."
                  on={dual}
                  set={() => setDual(!dual)}
                />
              </div>
              <Queue
                title="Security event queue"
                rows={[
                  ["Blocked", "Provider requested fields beyond consent"],
                  ["Resolved", "Expired document token rejected"],
                  ["Healthy", "Administrative backup verified"],
                ]}
                flash={flash}
              />
            </>
          )}
          {tab === "permissions" && (
            <>
              <Head
                over="ROLES & PERMISSIONS"
                title="Give every workspace only what its function requires."
                text="Widgets, records, actions, and fields are assigned by role and purpose. Hidden controls are also denied by server policy."
              />
              <section className="roles">
                {roles.map((r, i) => (
                  <article key={r[0]}>
                    <header>
                      <span>{r[0].slice(0, 2).toUpperCase()}</span>
                      <div>
                        <h2>{r[0]}</h2>
                        <small>
                          {[84, 7, 12, 3, 2, 2][i]} active assignments
                        </small>
                      </div>
                      <button onClick={() => flash(r[0] + " profile opened.")}>
                        Review →
                      </button>
                    </header>
                    <div>
                      <b>Required widgets</b>
                      <p>{r[1]}</p>
                    </div>
                    <footer>
                      <b>Explicitly excluded</b>
                      <p>{r[2]}</p>
                    </footer>
                  </article>
                ))}
              </section>
            </>
          )}
          {tab === "settings" && (
            <>
              <Head
                over="SYSTEM SETTINGS"
                title="Configure NeighborWell without exposing casework."
                text="Platform-wide configuration is administrator-only, versioned, and subject to change control."
              />
              <button
                className="deployment-plan"
                onClick={downloadDeploymentPlan}
              >
                Download production action deployment plan ↓
              </button>
              <div className="settings">
                {[
                  [
                    "Organization settings",
                    "Partners, locations, hours, service areas",
                  ],
                  [
                    "Communications",
                    "Templates, quiet hours, languages, sender identities",
                  ],
                  [
                    "Data retention",
                    "Schedules, deletion, legal holds, backups",
                  ],
                  [
                    "Integrations",
                    "Program feeds, provider exchange, email, SMS, calendars",
                  ],
                  [
                    "Accessibility",
                    "Languages, reading level, contrast, assistance",
                  ],
                  [
                    "Environment",
                    "Feature releases, maintenance, health thresholds",
                  ],
                ].map((x) => (
                  <article key={x[0]}>
                    <span>⚙</span>
                    <h2>{x[0]}</h2>
                    <p>{x[1]}</p>
                    <button
                      onClick={() =>
                        flash(x[0] + " opened in protected edit mode.")
                      }
                    >
                      Configure →
                    </button>
                  </article>
                ))}
              </div>
            </>
          )}
          {tab === "verification" && (
            <>
              <Head
                over="VERIFICATION SETTINGS"
                title="Govern what NeighborWell may treat as trusted."
                text="Administrators manage workflows; qualified reviewers approve subject-matter truth. Technical access never substitutes for expertise."
              />
              <div className="verify">
                <section>
                  <h2>Verification policy</h2>
                  {[
                    ["Official program sources", "Review every 30 days"],
                    ["Provider capacity", "Confirm every seven days"],
                    ["Eligibility changes", "Two qualified reviewers"],
                    ["Professional credentials", "Verify before assignment"],
                    ["Conflicting evidence", "Quarantine immediately"],
                  ].map((x) => (
                    <article key={x[0]}>
                      <span>✓</span>
                      <p>
                        <b>{x[0]}</b>
                        <small>{x[1]}</small>
                      </p>
                      <strong>Active</strong>
                    </article>
                  ))}
                </section>
                <aside>
                  <small>REVIEW QUEUE</small>
                  <h2>Three items need verification.</h2>
                  <p>
                    <b>Housing income threshold</b>
                    <small>Official update · quarantined</small>
                  </p>
                  <p>
                    <b>Nutrition program geography</b>
                    <small>Sources conflict</small>
                  </p>
                  <p>
                    <b>Clinical reviewer credential</b>
                    <small>Renewal due in five days</small>
                  </p>
                  <button
                    onClick={() =>
                      flash("Queue opened; no unverified data activated.")
                    }
                  >
                    Open queue →
                  </button>
                </aside>
              </div>
            </>
          )}
          {tab === "audit" && (
            <>
              <Head
                over="AUDIT & CONTROL RECEIPTS"
                title="Every privileged action leaves evidence."
                text="Search administrative actions, permission changes, verification decisions, emergency access, settings versions, and denials."
              />
              <section className="audit">
                <div>
                  <input placeholder="Search administrator, action, object, or receipt…" />
                  <button onClick={() => flash("Audit search completed.")}>
                    Search
                  </button>
                </div>
                {[
                  ["VER-411", "Housing rule quarantined"],
                  ["SEC-290", "Provider request denied"],
                  ["PER-188", "Navigator assignment ended"],
                  ["SET-074", "Retention policy approved"],
                ].map((x) => (
                  <article key={x[0]}>
                    <strong>{x[0]}</strong>
                    <p>
                      <b>{x[1]}</b>
                      <small>Named authority · immutable receipt</small>
                    </p>
                    <button onClick={() => flash("Control receipt opened.")}>
                      Open →
                    </button>
                  </article>
                ))}
              </section>
            </>
          )}
        </section>
      </div>
      {note && <div className="admin-toast">✓ {note}</div>}
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
    <div className="admin-heading">
      <p>{over}</p>
      <h1>{title}</h1>
      <span>{text}</span>
    </div>
  );
}
function Metrics() {
  return (
    <div className="metrics">
      {[
        ["PRIVILEGED SESSIONS", "2", "Both MFA verified"],
        ["OPEN SECURITY EVENTS", "1", "Contained; review due"],
        ["VERIFICATIONS DUE", "3", "No expired rules live"],
        ["UNRECEIPTED CHANGES", "0", "All attributable"],
      ].map((x) => (
        <article key={x[0]}>
          <small>{x[0]}</small>
          <b>{x[1]}</b>
          <em>{x[2]}</em>
        </article>
      ))}
    </div>
  );
}
function Toggle({
  title,
  text,
  on,
  set,
}: {
  title: string;
  text: string;
  on: boolean;
  set: () => void;
}) {
  return (
    <article>
      <span>◇</span>
      <div>
        <h2>{title}</h2>
        <p>{text}</p>
      </div>
      <button className={on ? "on" : ""} onClick={set}>
        <i></i>
      </button>
    </article>
  );
}
function Queue({
  title,
  rows,
  flash,
}: {
  title: string;
  rows: string[][];
  flash: (s: string) => void;
}) {
  return (
    <section className="queue">
      <h2>{title}</h2>
      {rows.map((x) => (
        <article key={x[1]}>
          <strong>{x[0]}</strong>
          <p>
            <b>{x[1]}</b>
            <small>Receipt available</small>
          </p>
          <button onClick={() => flash("Security receipt opened.")}>
            Receipt →
          </button>
        </article>
      ))}
    </section>
  );
}
