export type SessionEvidence = {
  authenticatedAt: string;
  lastSeenAt: string;
  expiresAt: string;
  revokedAt?: string | null;
  assuranceLevel: "standard" | "reauthenticated" | "phishing_resistant";
};

export type SessionDecision =
  | { allowed: true; code: "session_valid" }
  | {
      allowed: false;
      code:
        | "session_revoked"
        | "session_expired"
        | "session_idle"
        | "reauthentication_required";
      reason: string;
    };

const DEFAULT_IDLE_MINUTES = 30;
const SENSITIVE_REAUTH_MINUTES = 10;

export function validateSession(
  session: SessionEvidence,
  options: {
    now?: Date;
    sensitiveAction?: boolean;
    idleMinutes?: number;
  } = {},
): SessionDecision {
  const now = (options.now ?? new Date()).getTime();
  if (session.revokedAt)
    return { allowed: false, code: "session_revoked", reason: "The session was revoked." };

  const expiresAt = Date.parse(session.expiresAt);
  if (!Number.isFinite(expiresAt) || expiresAt <= now)
    return { allowed: false, code: "session_expired", reason: "The session has expired." };

  const lastSeenAt = Date.parse(session.lastSeenAt);
  const idleMs = (options.idleMinutes ?? DEFAULT_IDLE_MINUTES) * 60_000;
  if (!Number.isFinite(lastSeenAt) || now - lastSeenAt > idleMs)
    return { allowed: false, code: "session_idle", reason: "The session exceeded its idle limit." };

  if (options.sensitiveAction) {
    const authenticatedAt = Date.parse(session.authenticatedAt);
    const reauthFresh = Number.isFinite(authenticatedAt) &&
      now - authenticatedAt <= SENSITIVE_REAUTH_MINUTES * 60_000;
    if (session.assuranceLevel === "standard" || !reauthFresh)
      return {
        allowed: false,
        code: "reauthentication_required",
        reason: "Recent strong reauthentication is required for this action.",
      };
  }

  return { allowed: true, code: "session_valid" };
}
