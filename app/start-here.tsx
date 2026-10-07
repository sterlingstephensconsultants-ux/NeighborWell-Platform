"use client";

import { useState } from "react";
import { useLanguage } from "./language-access";

const needOptions = [
  {
    id: "housing",
    icon: "⌂",
    label: "Housing",
    detail: "Rent, shelter, eviction, or a safe place to stay",
  },
  {
    id: "food",
    icon: "◒",
    label: "Food",
    detail: "Groceries, meals, or immediate food support",
  },
  {
    id: "health",
    icon: "+",
    label: "Health",
    detail: "Coverage, care, medicine, or emotional wellbeing",
  },
  {
    id: "income",
    icon: "$",
    label: "Income & work",
    detail: "Benefits, employment, training, or financial stability",
  },
  {
    id: "safety",
    icon: "◇",
    label: "Safety",
    detail: "Personal safety, crisis support, or a safer plan",
  },
  {
    id: "documents",
    icon: "▤",
    label: "Documents",
    detail: "Identification, records, forms, or verification",
  },
  {
    id: "transport",
    icon: "↗",
    label: "Transportation",
    detail: "Getting to services, work, school, or appointments",
  },
  {
    id: "unsure",
    icon: "?",
    label: "I’m not sure",
    detail: "Tell NeighborWell what is happening in your own words",
  },
] as const;

const matches = [
  {
    need: "housing",
    title: "Housing stability navigation",
    provider: "Alameda County coordinated support",
    fit: "Strong match",
    why: "You selected housing and indicated that help may be time-sensitive.",
    documents: "No documents required to start",
    response: "Human response target: 1–2 days",
  },
  {
    need: "income",
    title: "Benefits and income recovery",
    provider: "California and county benefit pathways",
    fit: "Possible match",
    why: "You selected income or employment support.",
    documents: "Income information may be requested later",
    response: "You can review before applying",
  },
  {
    need: "health",
    title: "Coverage continuity support",
    provider: "Local health-access navigation",
    fit: "Possible match",
    why: "You selected healthcare or emotional wellbeing.",
    documents: "Coverage information is optional to begin",
    response: "Phone and in-person help available",
  },
  {
    need: "food",
    title: "Rapid food connection",
    provider: "Alameda County community resources",
    fit: "Strong match",
    why: "You selected food support.",
    documents: "No documents required to ask for help",
    response: "Same-day options may be available",
  },
];

export default function StartHere({
  onContinue,
  onSituation,
  onSupport,
}: {
  onContinue: () => void;
  onSituation: () => void;
  onSupport: () => void;
}) {
  const { t } = useLanguage();
  const [stage, setStage] = useState<"welcome" | "screen" | "results">(
    "welcome",
  );
  const [selected, setSelected] = useState<string[]>([]);
  const [urgent, setUrgent] = useState("No");
  const [zip, setZip] = useState("");
  const toggle = (id: string) =>
    setSelected(
      selected.includes(id)
        ? selected.filter((x) => x !== id)
        : [...selected, id],
    );
  const recommended = matches.filter((m) => selected.includes(m.need));
  return (
    <div className="start-here">
      {stage === "welcome" && (
        <>
          <section className="start-hero">
            <div>
              <p className="eyebrow">{t("welcome", "WELCOME TO NeighborWell")}</p>
              <h1>{t("start", "Start with what you need today.")}</h1>
              <p>{t("intro", "You do not need to know a program name or complete a long application. NeighborWell helps you understand options, choose your next step, and stay in control of your information.")}</p>
              <div className="start-actions">
                <button className="primary" onClick={() => setStage("screen")}>
                  {t("find", "Find possible support →")}
                </button>
                <button className="secondary" onClick={onSituation}>
                  {t("example", "View example situation")}
                </button>
              </div>
              <small>
                {t("noAccount", "No account required for this first check · About 3 minutes")}
              </small>
            </div>
            <aside>
              <span>◇</span>
              <h2>{t("yours", "Your story stays yours.")}</h2>
              <p>{t("private", "Your answers remain private during this check. NeighborWell will ask before creating a record or sharing anything.")}</p>
              <button onClick={onSupport}>{t("talk", "Talk with a person instead →")}</button>
            </aside>
          </section>
          <section className="start-steps">
            <article>
              <b>1</b>
              <div>
                <h2>{t("matters", "Tell us what matters")}</h2>
                <p>{t("mattersText", "Select needs or use your own words.")}</p>
              </div>
            </article>
            <article>
              <b>2</b>
              <div>
                <h2>{t("matches", "Review possible matches")}</h2>
                <p>{t("matchesText", "See why each option may fit.")}</p>
              </div>
            </article>
            <article>
              <b>3</b>
              <div>
                <h2>{t("choose", "Choose what happens")}</h2>
                <p>{t("chooseText", "Nothing moves forward without you.")}</p>
              </div>
            </article>
          </section>
          <div className="human-strip">
            <span>{t("urgent", "Need urgent help or prefer not to use a form?")}</span>
            <button onClick={onSupport}>{t("human", "Contact human support")}</button>
          </div>
        </>
      )}
      {stage === "screen" && (
        <>
          <button className="back" onClick={() => setStage("welcome")}>
            {t("back", "← Back")}
          </button>
          <div className="screen-head">
            <p className="eyebrow">PRIVATE SUPPORT CHECK · STEP 1 OF 2</p>
            <h1>{t("help", "What would you like help with?")}</h1>
            <p>{t("select", "Select every area that matters. This is not an eligibility decision.")}</p>
          </div>
          <div className="need-picker">
            {needOptions.map((n) => (
              <button
                key={n.id}
                className={selected.includes(n.id) ? "selected" : ""}
                onClick={() => toggle(n.id)}
              >
                <span>{selected.includes(n.id) ? "✓" : n.icon}</span>
                <div>
                  <b>{n.label}</b>
                  <small>{n.detail}</small>
                </div>
              </button>
            ))}
          </div>
          <section className="quick-context">
            <h2>A little context helps us sort the options.</h2>
            <div>
              <label>
                <span>
                  ZIP code <em>Optional</em>
                </span>
                <input
                  inputMode="numeric"
                  maxLength={5}
                  value={zip}
                  onChange={(e) => setZip(e.target.value.replace(/\D/g, ""))}
                  placeholder="94612"
                />
              </label>
              <fieldset>
                <legend>Does anything need attention today?</legend>
                {["Yes", "No", "I’m not sure"].map((v) => (
                  <button
                    key={v}
                    className={urgent === v ? "selected" : ""}
                    onClick={() => setUrgent(v)}
                  >
                    {v}
                  </button>
                ))}
              </fieldset>
            </div>
            <p>
              Why we ask: location helps identify service areas; urgency helps
              put safety and deadlines first.
            </p>
          </section>
          <div className="screen-footer">
            <span>
              {selected.length} area{selected.length === 1 ? "" : "s"} selected
            </span>
            <button
              className="primary"
              disabled={!selected.length}
              onClick={() => setStage("results")}
            >
              See possible support →
            </button>
          </div>
        </>
      )}
      {stage === "results" && (
        <>
          <button className="back" onClick={() => setStage("screen")}>
            ← Change my answers
          </button>
          <div className="results-head">
            <div>
              <p className="eyebrow">PRIVATE SUPPORT CHECK · RESULTS</p>
              <h1>Here are some possible next steps.</h1>
              <p>
                These are recommendations, not final eligibility decisions. You
                choose whether to continue.
              </p>
            </div>
            <span>✓ No information shared</span>
          </div>
          {urgent !== "No" && (
            <div className="urgent-banner">
              <b>If you are in immediate danger, call 911.</b>
              <span>
                NeighborWell will not contact emergency services automatically.
              </span>
              <button onClick={onSupport}>See crisis and human support</button>
            </div>
          )}
          <div className="match-list">
            {(recommended.length ? recommended : matches.slice(0, 2)).map(
              (m, i) => (
                <article key={m.title}>
                  <span className="match-number">{i + 1}</span>
                  <div className="match-main">
                    <div>
                      <em>{m.fit}</em>
                      <h2>{m.title}</h2>
                      <p>{m.provider}</p>
                    </div>
                    <dl>
                      <div>
                        <dt>Why this may fit</dt>
                        <dd>{m.why}</dd>
                      </div>
                      <div>
                        <dt>Documents</dt>
                        <dd>{m.documents}</dd>
                      </div>
                      <div>
                        <dt>What to expect</dt>
                        <dd>{m.response}</dd>
                      </div>
                    </dl>
                  </div>
                  <button onClick={onContinue}>Choose this support →</button>
                </article>
              ),
            )}
          </div>
          <section className="journey-preview">
            <h2>What happens if you continue?</h2>
            {[
              "Create your private story",
              "Review the information NeighborWell understood",
              "Choose a service and specific consent",
              "Track the provider response",
              "Confirm whether help arrived",
            ].map((x, i) => (
              <div key={x}>
                <span>{i + 1}</span>
                <p>{x}</p>
              </div>
            ))}
          </section>
          <div className="results-footer">
            <p>
              <b>Ready to save your choices?</b>
              <small>
                Enrollment creates a private record. It does not submit an
                application or send a referral.
              </small>
            </p>
            <button className="primary" onClick={onContinue}>
              Continue to My Story →
            </button>
          </div>
        </>
      )}
    </div>
  );
}
