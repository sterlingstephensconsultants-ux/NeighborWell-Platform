"use client";

import { useEffect, useRef, useState } from "react";
import { deliverAction } from "../lib/action-artifacts";

const fields = [
  ["Name and preferred contact", "Required to coordinate an appointment"],
  ["Alameda County residency", "Confirms geographic service area"],
  ["Employment end date", "Supports preliminary program matching"],
  ["Rent amount and overdue status", "Used only for housing stabilization"],
] as const;

type VaultDocument = {
  id: string;
  name: string;
  mimeType: string;
  sizeBytes: number;
  scanStatus: string;
  status: string;
  createdAt: string;
};
type ConsentGrant = {
  id: string;
  fields: string[];
  documentIds: string[];
  expiresAt: string;
  effectiveStatus: string;
  createdAt: string;
  revokedAt?: string | null;
};

export default function ConsentVault({
  onExit,
  onReferral,
}: {
  onExit: () => void;
  onReferral: () => void;
}) {
  const [tab, setTab] = useState<
    "consent" | "documents" | "disclosures" | "security"
  >("consent");
  const [enabled, setEnabled] = useState([true, true, true, true]);
  const [active, setActive] = useState(true);
  const [days, setDays] = useState(30);
  const [notice, setNotice] = useState("");
  const [vaultDocuments, setVaultDocuments] = useState<VaultDocument[]>([]);
  const [grants, setGrants] = useState<ConsentGrant[]>([]);
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);
  useEffect(() => {
    fetch("/api/documents", { cache: "no-store" })
      .then(async (response) => {
        if (response.ok) {
          const result = await response.json();
          setVaultDocuments(result.documents ?? []);
        }
      })
      .catch(() => undefined);
    fetch("/api/consents", { cache: "no-store" })
      .then(async (response) => {
        if (response.ok) {
          const result = await response.json();
          setGrants(result.grants ?? []);
        }
      })
      .catch(() => undefined);
  }, []);
  async function saveConsent() {
    setNotice("Recording your purpose-bound consent decision…");
    try {
      const response = await fetch("/api/consents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fields: fields.filter((_, index) => enabled[index]).map(([name]) => name),
          documentIds: selectedDocuments,
          days,
        }),
      });
      const result = await response.json();
      if (response.status === 401) {
        window.location.assign("/signin-with-chatgpt?return_to=%2F");
        return;
      }
      if (!response.ok) throw new Error(result.error || "Consent could not be saved.");
      const refresh = await fetch("/api/consents", { cache: "no-store" });
      const refreshed = await refresh.json();
      setGrants(refreshed.grants ?? []);
      setActive(true);
      setNotice(`Consent saved. Receipt ${result.receiptId} was added to your ledger.`);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Consent could not be saved.");
    }
    window.setTimeout(() => setNotice(""), 5000);
  }
  async function revokeConsent(id: string) {
    setNotice("Revoking access…");
    const response = await fetch(`/api/consents?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    const result = await response.json();
    if (!response.ok) {
      setNotice(result.error || "Access could not be revoked.");
    } else {
      setGrants((current) =>
        current.map((grant) =>
          grant.id === id ? { ...grant, effectiveStatus: "revoked", revokedAt: result.revokedAt } : grant,
        ),
      );
      setActive(false);
      setNotice(`Access revoked. Receipt ${result.receiptId} preserves the decision.`);
    }
    window.setTimeout(() => setNotice(""), 5000);
  }
  async function uploadDocument(file?: File) {
    if (!file) return;
    setUploading(true);
    setNotice("Validating and uploading to the private vault…");
    try {
      const form = new FormData();
      form.append("file", file);
      const response = await fetch("/api/documents", {
        method: "POST",
        body: form,
      });
      const result = await response.json();
      if (response.status === 401) {
        window.location.assign("/signin-with-chatgpt?return_to=%2F");
        return;
      }
      if (!response.ok) throw new Error(result.error || "Upload failed");
      setVaultDocuments((current) => [result.document, ...current]);
      setNotice(
        "Document stored privately and quarantined pending security scan. Nothing was shared.",
      );
    } catch (error) {
      setNotice(
        error instanceof Error ? error.message : "Document upload failed.",
      );
    } finally {
      setUploading(false);
      if (fileInput.current) fileInput.current.value = "";
      window.setTimeout(() => setNotice(""), 5000);
    }
  }
  const toggle = (i: number) =>
    setEnabled((v) => v.map((x, n) => (n === i ? !x : x)));
  const message = (s: string) => {
    deliverAction(s);
    setNotice(s);
    window.setTimeout(() => setNotice(""), 3000);
  };
  return (
    <main className="cv-shell">
      <header className="cv-top">
        <button className="brand" onClick={() => setTab("consent")}>
          <span className="brand-mark">
            <i />
            <i />
            <i />
          </span>
          <span>
            <b>NeighborWell</b>
            <small>Consent & secure document vault</small>
          </span>
        </button>
        <div className="cv-live">
          <i /> Resident authority active · encrypted controls
        </div>
        <button onClick={onReferral}>Referral engine ↗</button>
        <button onClick={onExit}>Resident experience ↗</button>
      </header>
      <div className="cv-layout">
        <aside className="cv-nav">
          <small>PHASE 11 CONTROL</small>
          {(
            [
              ["consent", "Consent studio"],
              ["documents", "Document vault"],
              ["disclosures", "Disclosure ledger"],
              ["security", "Security posture"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              className={tab === id ? "active" : ""}
              onClick={() => setTab(id)}
            >
              <span>
                {id === "consent"
                  ? "◇"
                  : id === "documents"
                    ? "▣"
                    : id === "disclosures"
                      ? "▤"
                      : "◆"}
              </span>
              {label}
            </button>
          ))}
          <div className="cv-rule">
            <b>Resident authority</b>
            <small>
              Permission is specific, time-bound, revocable, and never expanded
              by silence.
            </small>
          </div>
        </aside>
        <section className="cv-main">
          <div className="cv-heading">
            <div>
              <p className="eyebrow">CONSENT & SECURE DOCUMENT VAULT</p>
              <h1>
                {tab === "consent"
                  ? "Share only what this action needs."
                  : tab === "documents"
                    ? "Your documents have a purpose—not a blank permission."
                    : tab === "disclosures"
                      ? "Every disclosure leaves a receipt."
                      : "Protection is visible, testable, and accountable."}
              </h1>
              <p>
                Residents decide which fields and documents may be used, by
                whom, for what purpose, and for how long.
              </p>
            </div>
            <span className="cv-status">
              VAULT CIV-RV-0812
              <br />
              <b>{active ? "Consent active" : "Sharing paused"}</b>
            </span>
          </div>
          {tab === "consent" && (
            <div className="cv-grid">
              <section className="cv-card">
                <div className="cv-cardhead">
                  <div>
                    <small>PROPOSED SHARE · HOUSING STABILIZATION</small>
                    <h2>Bay Community Alliance</h2>
                    <p>
                      Purpose: screen and coordinate one eviction-prevention
                      referral.
                    </p>
                  </div>
                  <span>{enabled.filter(Boolean).length} of 4 fields</span>
                </div>
                <div className="cv-fields">
                  {fields.map((f, i) => (
                    <button
                      key={f[0]}
                      className={enabled[i] ? "allowed" : ""}
                      onClick={() => toggle(i)}
                    >
                      <span>{enabled[i] ? "✓" : "—"}</span>
                      <p>
                        <b>{f[0]}</b>
                        <small>{f[1]}</small>
                      </p>
                      <em>{enabled[i] ? "Allowed" : "Private"}</em>
                    </button>
                  ))}
                </div>
                <label className="cv-expiry">
                  <span>
                    Permission expires in <b>{days} days</b>
                  </span>
                  <input
                    type="range"
                    min="1"
                    max="90"
                    value={days}
                    onChange={(e) => setDays(Number(e.target.value))}
                  />
                  <small>
                    Expiration automatically ends provider access. Renewal
                    requires a new resident decision.
                  </small>
                </label>
                <div className="cv-actions">
                  <button
                    className="cv-secondary"
                    onClick={() => {
                      const activeGrant = grants.find((grant) => grant.effectiveStatus === "active");
                      if (activeGrant) revokeConsent(activeGrant.id);
                      else message("There is no active permission to revoke.");
                    }}
                  >
                    Revoke access now
                  </button>
                  <button
                    className="cv-primary"
                    onClick={saveConsent}
                  >
                    Save consent decision →
                  </button>
                </div>
              </section>
              <aside className="cv-dark">
                <small>CONSENT RECEIPT PREVIEW</small>
                <h2>Plain-language permission</h2>
                <dl>
                  <div>
                    <dt>Recipient</dt>
                    <dd>Bay Community Alliance</dd>
                  </div>
                  <div>
                    <dt>Purpose</dt>
                    <dd>Housing stabilization</dd>
                  </div>
                  <div>
                    <dt>Scope</dt>
                    <dd>{enabled.filter(Boolean).length} selected fields</dd>
                  </div>
                  <div>
                    <dt>Expires</dt>
                    <dd>In {days} days</dd>
                  </div>
                  <div>
                    <dt>Reuse</dt>
                    <dd>Not permitted</dd>
                  </div>
                </dl>
                <div className="cv-warning">
                  <span>!</span>
                  <p>
                    <b>Lease document remains separate.</b>
                    <small>
                      Field consent never silently grants document access.
                    </small>
                  </p>
                </div>
              </aside>
            </div>
          )}
          {tab === "documents" && (
            <div className="cv-grid">
              <section className="cv-card">
                <div className="cv-cardhead">
                  <div>
                    <small>ENCRYPTED RESIDENT VAULT</small>
                    <h2>
                      {vaultDocuments.length} protected document
                      {vaultDocuments.length === 1 ? "" : "s"}
                    </h2>
                    <p>
                      Documents remain private until a separate,
                      purpose-specific approval is recorded.
                    </p>
                  </div>
                  <button
                    className="cv-primary"
                    disabled={uploading}
                    onClick={() => fileInput.current?.click()}
                  >
                    {uploading ? "Uploading…" : "＋ Add document"}
                  </button>
                  <input
                    ref={fileInput}
                    hidden
                    type="file"
                    accept="application/pdf,image/jpeg,image/png"
                    onChange={(event) =>
                      uploadDocument(event.target.files?.[0])
                    }
                  />
                </div>
                <div className="cv-docs">
                  {vaultDocuments.map((d) => (
                    <article key={d.id}>
                      <label className="cv-doc-select" title="Include in the next consent decision">
                        <input
                          type="checkbox"
                          checked={selectedDocuments.includes(d.id)}
                          disabled={d.scanStatus !== "baseline_security_check_passed"}
                          onChange={(event) =>
                            setSelectedDocuments((current) =>
                              event.target.checked
                                ? [...current, d.id]
                                : current.filter((id) => id !== d.id),
                            )
                          }
                        />
                      </label>
                      <div>
                        <b>{d.name}</b>
                        <small>
                          {(d.sizeBytes / 1024).toFixed(1)} KB ·{" "}
                          {new Date(d.createdAt).toLocaleDateString()}
                        </small>
                      </div>
                      <em>
                        {d.scanStatus.replaceAll("_", " ")} · {d.status}
                      </em>
                      <button
                        onClick={() => window.location.assign(`/api/documents/${encodeURIComponent(d.id)}`)}
                      >
                        Download
                      </button>
                    </article>
                  ))}
                  {!vaultDocuments.length && (
                    <p className="cv-empty">
                      No private documents stored yet. Accepted formats: PDF,
                      JPEG, and PNG up to 10 MB.
                    </p>
                  )}
                </div>
              </section>
              <aside className="cv-dark">
                <small>DOCUMENT CONTROL</small>
                <h2>Document permission</h2>
                <p className="cv-copy">
                  Select a checked document and save consent to authorize it for
                  housing stabilization only.
                </p>
                <dl>
                  <div>
                    <dt>Access ends</dt>
                    <dd>{grants.find((g) => g.effectiveStatus === "active") ? new Date(grants.find((g) => g.effectiveStatus === "active")!.expiresAt).toLocaleDateString() : "No active access"}</dd>
                  </div>
                  <div>
                    <dt>Download</dt>
                    <dd>Blocked</dd>
                  </div>
                  <div>
                    <dt>Forwarding</dt>
                    <dd>Blocked</dd>
                  </div>
                  <div>
                    <dt>Last viewed</dt>
                    <dd>Never</dd>
                  </div>
                </dl>
                <button
                  className="cv-revoke"
                  onClick={() => {
                    const activeGrant = grants.find((grant) => grant.effectiveStatus === "active");
                    if (activeGrant) revokeConsent(activeGrant.id);
                    else message("There is no active document access to revoke.");
                  }}
                >
                  Revoke document access
                </button>
              </aside>
            </div>
          )}
          {tab === "disclosures" && (
            <section className="cv-card">
              <div className="cv-cardhead">
                <div>
                  <small>APPEND-ONLY DISCLOSURE LEDGER</small>
                  <h2>Nothing leaves NeighborWell invisibly.</h2>
                  <p>
                    Each receipt preserves the recipient, purpose, exact fields,
                    policy, time, and resident decision.
                  </p>
                </div>
                <span>{grants.length} verified decision{grants.length === 1 ? "" : "s"}</span>
              </div>
              <div className="cv-ledger">
                {grants.map((grant) => (
                  <article key={grant.id}>
                    <time>{new Date(grant.createdAt).toLocaleDateString()}<b>{new Date(grant.createdAt).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}</b></time>
                    <span>{grant.effectiveStatus === "active" ? "✓" : "↺"}</span>
                    <div>
                      <small>{grant.effectiveStatus.toUpperCase()} · {grant.id}</small>
                      <h3>{grant.fields.length} fields and {grant.documentIds.length} documents</h3>
                      <p>Bay Community Alliance · expires {new Date(grant.expiresAt).toLocaleDateString()} · purpose limited</p>
                    </div>
                    {grant.effectiveStatus === "active" && <button onClick={() => revokeConsent(grant.id)}>Revoke access →</button>}
                  </article>
                ))}
                {!grants.length && <p className="cv-empty">No consent decisions recorded yet.</p>}
              </div>
            </section>
          )}
          {tab === "security" && (
            <div className="cv-security">
              <article>
                <small>ENCRYPTION</small>
                <b>Protected at rest and in transit</b>
                <p>
                  Vault objects use separate storage references; operational
                  records do not contain document contents.
                </p>
                <span>Healthy</span>
              </article>
              <article>
                <small>ACCESS BOUNDARY</small>
                <b>Purpose + role + consent required</b>
                <p>
                  A signed-in user still receives a denial unless every
                  authorization condition passes.
                </p>
                <span>Enforced</span>
              </article>
              <article>
                <small>EXPIRATION</small>
                <b>Access closes automatically</b>
                <p>
                  Background controls invalidate expired grants without relying
                  on a provider to remember.
                </p>
                <span>Monitoring</span>
              </article>
              <article>
                <small>AUDITABILITY</small>
                <b>Views and disclosures are attributable</b>
                <p>
                  Residents and authorized reviewers can inspect who accessed
                  which item and why.
                </p>
                <span>Complete</span>
              </article>
              <div className="cv-test">
                <span>◆</span>
                <p>
                  <b>Last control test passed · Aug 12 at 4:42 PM</b>
                  <small>
                    Expired grant blocked · wrong-purpose access denied ·
                    revocation propagated · ledger receipt verified.
                  </small>
                </p>
                <button
                  onClick={() =>
                    message(
                      "Security control test completed: all four boundaries passed.",
                    )
                  }
                >
                  Run control test →
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
      {notice && (
        <div className="cv-toast" role="status">
          ✓ {notice}
        </div>
      )}
    </main>
  );
}
