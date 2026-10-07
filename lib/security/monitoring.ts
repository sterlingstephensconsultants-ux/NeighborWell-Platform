export type SecuritySignal = {
  category: "authorization_denial" | "rate_limit" | "session" | "recovery";
  actorUserId?: string | null;
  organizationId?: string | null;
  code: string;
  occurredAt: string;
};

export type SecurityAlertCandidate = {
  category: string;
  severity: "low" | "medium" | "high" | "critical";
  summary: string;
  evidence: Record<string, unknown>;
};

export function detectSecurityAlert(
  signals: SecuritySignal[],
  now = new Date(),
): SecurityAlertCandidate | null {
  const cutoff = now.getTime() - 15 * 60_000;
  const recent = signals.filter((signal) => Date.parse(signal.occurredAt) >= cutoff);
  const crossTenant = recent.filter((signal) => signal.code === "organization_denied");
  if (crossTenant.length >= 3)
    return {
      category: "repeated_cross_tenant_access",
      severity: "critical",
      summary: "Repeated cross-tenant access attempts require immediate review.",
      evidence: { attempts: crossTenant.length, windowMinutes: 15 },
    };
  const rateLimits = recent.filter((signal) => signal.category === "rate_limit");
  if (rateLimits.length >= 5)
    return {
      category: "repeated_rate_limit",
      severity: "high",
      summary: "Repeated rate-limit blocks indicate automated or abusive behavior.",
      evidence: { blocks: rateLimits.length, windowMinutes: 15 },
    };
  const revokedSessions = recent.filter((signal) => signal.code === "session_revoked");
  if (revokedSessions.length >= 1)
    return {
      category: "revoked_session_use",
      severity: "high",
      summary: "A revoked session was presented after revocation.",
      evidence: { attempts: revokedSessions.length },
    };
  return null;
}
