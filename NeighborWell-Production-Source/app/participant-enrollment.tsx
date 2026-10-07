"use client";
/* eslint-disable react-hooks/exhaustive-deps -- autosave is intentionally keyed only to persisted enrollment fields. */
import { useEffect, useRef, useState } from "react";
import { useLanguage } from "./language-access";

const needs = [
  "Housing",
  "Employment or income",
  "Healthcare",
  "Mental health or emotional wellbeing",
  "Identity-affirming support",
  "Relationships or personal safety",
  "Community connection",
  "Identification or documents",
  "Financial stability",
  "Other",
];
const goals = [
  "Find stable housing",
  "Improve my emotional wellbeing",
  "Find work or increase income",
  "Access healthcare",
  "Replace important documents",
  "Build community support",
  "Improve personal safety",
  "Develop a business or career plan",
];

export default function ParticipantEnrollment({
  initialStory,
  onBack,
  onComplete,
}: {
  initialStory: string;
  onBack: () => void;
  onComplete: (story: string) => void;
}) {
  const { locale } = useLanguage();
  const [step, setStep] = useState(0);
  const [data, setData] = useState({
    preferred: "",
    legal: "",
    dob: "",
    pronouns: "",
    gender: "",
    ethnicity: "",
    phone: "",
    email: "",
    contact: "Secure message",
    language: ({ en: "English", es: "Spanish", zh: "Chinese", vi: "Vietnamese", tl: "Tagalog", ar: "Arabic" } as const)[locale],
    access: "",
    story: initialStory,
    employment: "Prefer not to answer",
    insurance: "Prefer not to answer",
    needs: [] as string[],
    urgent: "",
    goals: [] as string[],
    ownGoal: "",
    frequency: "Weekly",
    warmline: false,
    workshops: false,
    consent: false,
    accuracy: false,
  });
  const [saveState, setSaveState] = useState<
    "checking" | "private" | "saving" | "saved" | "error"
  >("checking");
  const hydrated = useRef(false);
  useEffect(() => {
    const names = { en: "English", es: "Spanish", zh: "Chinese", vi: "Vietnamese", tl: "Tagalog", ar: "Arabic" } as const;
    const update = (event: Event) => {
      const next = (event as CustomEvent<keyof typeof names>).detail;
      if (names[next]) setData((current) => ({ ...current, language: names[next] }));
    };
    window.addEventListener("neighborwell-language-change", update);
    return () => window.removeEventListener("neighborwell-language-change", update);
  }, []);
  useEffect(() => {
    fetch("/api/enrollment", { cache: "no-store" })
      .then(async (response) => {
        if (response.status === 401) {
          setSaveState("private");
          return;
        }
        const result = await response.json();
        if (result.enrollment || result.participant)
          setData((current) => ({
            ...current,
            ...result.participant,
            ...result.enrollment,
          }));
        setSaveState("saved");
      })
      .catch(() => setSaveState("error"))
      .finally(() => {
        hydrated.current = true;
      });
  }, []);
  useEffect(() => {
    if (
      !hydrated.current ||
      saveState === "private" ||
      !data.preferred.trim() ||
      data.story.trim().length < 20
    )
      return;
    const timer = window.setTimeout(() => save("draft"), 900);
    return () => window.clearTimeout(timer);
  }, [
    data.preferred,
    data.legal,
    data.language,
    data.contact,
    data.story,
    data.needs,
    data.goals,
    data.urgent,
  ]);
  async function save(status: "draft" | "completed") {
    setSaveState("saving");
    try {
      const response = await fetch("/api/enrollment", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          goals: [...data.goals, data.ownGoal].filter(Boolean),
          status,
        }),
      });
      if (response.status === 401) {
        setSaveState("private");
        return false;
      }
      if (!response.ok) throw new Error("Save failed");
      setSaveState("saved");
      return true;
    } catch {
      setSaveState("error");
      return false;
    }
  }
  async function complete() {
    if (saveState === "private") {
      window.location.assign("/signin-with-chatgpt?return_to=%2F");
      return;
    }
    if (await save("completed")) onComplete(data.story);
  }
  const titles = [
    "About you",
    "How we can reach you",
    "What is happening",
    "What support matters",
    "Your goals and preferences",
    "Review and enroll",
  ];
  function field<K extends keyof typeof data>(key: K, value: (typeof data)[K]) {
    setData({ ...data, [key]: value });
  }
  function toggle(key: "needs" | "goals", value: string) {
    const list = data[key];
    field(
      key,
      list.includes(value) ? list.filter((x) => x !== value) : [...list, value],
    );
  }
  const canContinue =
    step === 0
      ? !!data.preferred
      : step === 1
        ? !!data.contact
        : step === 2
          ? data.story.trim().length > 20
          : step === 5
            ? data.consent && data.accuracy
            : true;
  return (
    <div className="enroll">
      <button className="back" onClick={onBack}>
        ← Save and return to My Situation
      </button>
      <div className="enroll-head">
        <div>
          <p className="eyebrow">MY STORY · PARTICIPANT ENROLLMENT</p>
          <h1>Let’s understand what support would help.</h1>
          <p className="lede">
            Go at your own pace. Only your preferred name, contact preference,
            story, and enrollment consent are required. You can skip optional
            questions.
          </p>
        </div>
        <span>About 6–8 minutes</span>
      </div>
      <div className="privacy-note">
        <span>◇</span>
        <p>
          <b>Your enrollment is not permission to share your information.</b>
          <small>
            NeighborWell asks separately before sending any field or document to
            another organization.
          </small>
        </p>
      </div>
      <div className="enroll-progress">
        <div>
          <span style={{ width: ((step + 1) / 6) * 100 + "%" }}></span>
        </div>
        <p>
          Step {step + 1} of 6 · <b>{titles[step]}</b>
        </p>
      </div>
      <section className="enroll-card">
        {step === 0 && (
          <>
            <Section
              title="What should we call you?"
              text="We use your preferred name throughout NeighborWell. Legal information is optional unless a specific service later requires it."
            />
            <div className="form-grid">
              <Field
                label="Preferred name"
                required
                value={data.preferred}
                onChange={(v) => field("preferred", v)}
              />
              <Field
                label="Legal name"
                optional
                value={data.legal}
                onChange={(v) => field("legal", v)}
              />
              <Field
                label="Date of birth"
                optional
                type="date"
                value={data.dob}
                onChange={(v) => field("dob", v)}
              />
              <Field
                label="Pronouns"
                optional
                value={data.pronouns}
                onChange={(v) => field("pronouns", v)}
              />
              <Field
                label="Gender identity"
                optional
                value={data.gender}
                onChange={(v) => field("gender", v)}
                hint="Self-describe in your own words"
              />
              <Field
                label="Race or ethnicity"
                optional
                value={data.ethnicity}
                onChange={(v) => field("ethnicity", v)}
                hint="Used only with your permission for equity review"
              />
            </div>
          </>
        )}
        {step === 1 && (
          <>
            <Section
              title="How may NeighborWell communicate with you?"
              text="Choose the safest and easiest way to reach you. You can change this later."
            />
            <div className="form-grid">
              <Field
                label="Mobile phone"
                optional
                type="tel"
                value={data.phone}
                onChange={(v) => field("phone", v)}
              />
              <Field
                label="Email address"
                optional
                type="email"
                value={data.email}
                onChange={(v) => field("email", v)}
              />
            </div>
            <Choice
              label="Preferred contact method"
              values={[
                "Secure message",
                "Text message",
                "Phone call",
                "Email",
                "Contact me through my navigator",
              ]}
              selected={data.contact}
              onSelect={(v) => field("contact", v)}
            />
            <div className="form-grid">
              <Field
                label="Preferred language"
                value={data.language}
                onChange={(v) => field("language", v)}
              />
              <Field
                label="Accessibility or communication needs"
                optional
                value={data.access}
                onChange={(v) => field("access", v)}
                hint="For example: interpreter, larger text, more time, screen reader, support person"
              />
            </div>
          </>
        )}
        {step === 2 && (
          <>
            <Section
              title="Tell us what is happening right now."
              text="Use your own words. You do not need to know a program name, diagnosis, or government term."
            />
            <textarea
              className="story-box"
              value={data.story}
              onChange={(e) => field("story", e.target.value)}
              aria-label="Describe your current situation"
            />
            <p className="field-help">
              {data.story.length} characters ·{" "}
              {saveState === "saved"
                ? "private draft saved"
                : saveState === "private"
                  ? "sign in required for private saving"
                  : "save pending"}
            </p>
            <div className="form-grid">
              <Select
                label="Current employment"
                value={data.employment}
                values={[
                  "Employed",
                  "Self-employed",
                  "Not currently employed",
                  "Student",
                  "Unable to work right now",
                  "Prefer not to answer",
                ]}
                onChange={(v) => field("employment", v)}
              />
              <Select
                label="Health insurance"
                value={data.insurance}
                values={["Yes", "No", "Not sure", "Prefer not to answer"]}
                onChange={(v) => field("insurance", v)}
              />
            </div>
            <Field
              label="Is anything urgent or time-sensitive?"
              optional
              value={data.urgent}
              onChange={(v) => field("urgent", v)}
              hint="Examples: losing housing, safety concern, medicine ending, deadline, or no food today"
            />
          </>
        )}
        {step === 3 && (
          <>
            <Section
              title="Which areas would you like help with?"
              text="Select all that apply. This identifies possible support—it does not determine eligibility."
            />
            <CheckGrid
              values={needs}
              selected={data.needs}
              onToggle={(v) => toggle("needs", v)}
            />
            <div className="participant-boundary">
              <b>If you may be in immediate danger</b>
              <p>
                NeighborWell is not an emergency service. A trained human should help
                determine the safest next step. Nothing here automatically
                contacts police or another agency.
              </p>
            </div>
          </>
        )}
        {step === 4 && (
          <>
            <Section
              title="What would you like to work toward?"
              text="Your goals guide the service plan. NeighborWell and providers should not replace them with goals chosen for you."
            />
            <CheckGrid
              values={goals}
              selected={data.goals}
              onToggle={(v) => toggle("goals", v)}
            />
            <Field
              label="A goal in your own words"
              optional
              value={data.ownGoal}
              onChange={(v) => field("ownGoal", v)}
              hint="What would meaningful progress look like to you?"
            />
            <Choice
              label="How often would you like a check-in?"
              values={["As needed", "Weekly", "Every two weeks", "Monthly"]}
              selected={data.frequency}
              onSelect={(v) => field("frequency", v)}
            />
            <div className="mini-checks">
              <label>
                <input
                  type="checkbox"
                  checked={data.warmline}
                  onChange={(e) => field("warmline", e.target.checked)}
                />{" "}
                I’m interested in optional warm-line or peer support
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={data.workshops}
                  onChange={(e) => field("workshops", e.target.checked)}
                />{" "}
                I’m interested in workshops or community activities
              </label>
            </div>
          </>
        )}
        {step === 5 && (
          <>
            <Section
              title="Review your enrollment choices."
              text="You can go back and correct anything. Enrollment creates your private NeighborWell record; it does not send referrals or documents."
            />
            <div className="review-grid">
              <Review label="Name" value={data.preferred} />
              <Review label="Contact" value={data.contact} />
              <Review
                label="Support areas"
                value={
                  data.needs.length
                    ? data.needs.join(", ")
                    : "None selected yet"
                }
              />
              <Review
                label="Goals"
                value={
                  [...data.goals, data.ownGoal].filter(Boolean).join(", ") ||
                  "Not specified"
                }
              />
              <Review label="Check-ins" value={data.frequency} />
              <Review label="Your story" value={data.story} />
            </div>
            <div className="consent-box">
              <h2>Enrollment consent</h2>
              <label>
                <input
                  type="checkbox"
                  checked={data.consent}
                  onChange={(e) => field("consent", e.target.checked)}
                />
                <span>
                  <b>
                    I voluntarily agree to create a private NeighborWell participant
                    record.
                  </b>
                  <small>
                    I understand that joining is optional, I may stop
                    participating, and NeighborWell will ask separately before sharing
                    information.
                  </small>
                </span>
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={data.accuracy}
                  onChange={(e) => field("accuracy", e.target.checked)}
                />
                <span>
                  <b>
                    I reviewed this information and it reflects what I want
                    NeighborWell to understand.
                  </b>
                  <small>
                    I can correct it later. Staff observations and assessments
                    are not part of this participant enrollment.
                  </small>
                </span>
              </label>
            </div>
          </>
        )}
      </section>
      <div className="enroll-actions">
        <button
          className="secondary"
          disabled={step === 0}
          onClick={() => setStep(step - 1)}
        >
          ← Back
        </button>
        <span>
          {saveState === "checking"
            ? "Checking for a saved enrollment…"
            : saveState === "saving"
              ? "Saving private draft…"
              : saveState === "saved"
                ? "✓ Private draft saved"
                : saveState === "private"
                  ? "Sign in through Secure access to save and recover this enrollment"
                  : "Save unavailable · entries remain on this page"}
        </span>
        {step < 5 ? (
          <button
            className="primary"
            disabled={!canContinue}
            onClick={() => setStep(step + 1)}
          >
            Continue →
          </button>
        ) : (
          <button
            className="primary"
            disabled={!canContinue || saveState === "saving"}
            onClick={complete}
          >
            {saveState === "private"
              ? "Sign in to complete enrollment →"
              : "Complete enrollment →"}
          </button>
        )}
      </div>
    </div>
  );
}
function Section({ title, text }: { title: string; text: string }) {
  return (
    <header className="form-section">
      <h2>{title}</h2>
      <p>{text}</p>
    </header>
  );
}
function Field({
  label,
  value,
  onChange,
  optional,
  required,
  type = "text",
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  optional?: boolean;
  required?: boolean;
  type?: string;
  hint?: string;
}) {
  return (
    <label className="field">
      <span>
        {label}
        {required && <b>Required</b>}
        {optional && <em>Optional</em>}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {hint && <small>{hint}</small>}
    </label>
  );
}
function Select({
  label,
  value,
  values,
  onChange,
}: {
  label: string;
  value: string;
  values: string[];
  onChange: (v: string) => void;
}) {
  return (
    <label className="field">
      <span>
        {label}
        <em>Optional</em>
      </span>
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        {values.map((v) => (
          <option key={v}>{v}</option>
        ))}
      </select>
    </label>
  );
}
function Choice({
  label,
  values,
  selected,
  onSelect,
}: {
  label: string;
  values: string[];
  selected: string;
  onSelect: (v: string) => void;
}) {
  return (
    <fieldset className="choice">
      <legend>{label}</legend>
      <div>
        {values.map((v) => (
          <button
            type="button"
            key={v}
            className={selected === v ? "selected" : ""}
            onClick={() => onSelect(v)}
          >
            {selected === v ? "✓ " : ""}
            {v}
          </button>
        ))}
      </div>
    </fieldset>
  );
}
function CheckGrid({
  values,
  selected,
  onToggle,
}: {
  values: string[];
  selected: string[];
  onToggle: (v: string) => void;
}) {
  return (
    <div className="check-grid">
      {values.map((v) => (
        <label key={v} className={selected.includes(v) ? "selected" : ""}>
          <input
            type="checkbox"
            checked={selected.includes(v)}
            onChange={() => onToggle(v)}
          />
          <span>{selected.includes(v) ? "✓" : "+"}</span>
          {v}
        </label>
      ))}
    </div>
  );
}
function Review({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <small>{label}</small>
      <p>{value}</p>
    </div>
  );
}
