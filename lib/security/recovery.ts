export type RecoveryApproval = {
  approverUserId: string;
  decision: "approved" | "denied";
};

export type RecoveryRequestEvidence = {
  requestedByUserId: string;
  status: "pending" | "approved" | "denied" | "executed" | "expired";
  expiresAt: string;
  approvals: RecoveryApproval[];
};

export type RecoveryDecision = {
  executable: boolean;
  code:
    | "recovery_ready"
    | "recovery_not_pending"
    | "recovery_expired"
    | "recovery_denied"
    | "separation_of_duties_failed"
    | "second_approval_required";
  reason: string;
};

export function evaluateRecovery(
  request: RecoveryRequestEvidence,
  now = new Date(),
): RecoveryDecision {
  if (request.status !== "pending" && request.status !== "approved")
    return {
      executable: false,
      code: "recovery_not_pending",
      reason: "The recovery request is not awaiting execution.",
    };
  if (Date.parse(request.expiresAt) <= now.getTime())
    return { executable: false, code: "recovery_expired", reason: "The recovery request expired." };
  if (request.approvals.some((approval) => approval.decision === "denied"))
    return { executable: false, code: "recovery_denied", reason: "A reviewer denied recovery." };
  const approvingUsers = new Set(
    request.approvals
      .filter((approval) => approval.decision === "approved")
      .map((approval) => approval.approverUserId),
  );
  if (approvingUsers.has(request.requestedByUserId))
    return {
      executable: false,
      code: "separation_of_duties_failed",
      reason: "The requester cannot approve their own recovery request.",
    };
  if (approvingUsers.size < 2)
    return {
      executable: false,
      code: "second_approval_required",
      reason: "Two independent approvals are required.",
    };
  return {
    executable: true,
    code: "recovery_ready",
    reason: "Two independent approvals authorize recovery.",
  };
}
