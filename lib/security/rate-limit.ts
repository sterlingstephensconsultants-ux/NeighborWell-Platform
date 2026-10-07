export type RateLimitState = {
  windowStartedAt: string;
  requestCount: number;
  blockedUntil?: string | null;
};

export type RateLimitPolicy = {
  limit: number;
  windowSeconds: number;
  blockSeconds: number;
};

export type RateLimitDecision = {
  allowed: boolean;
  requestCount: number;
  remaining: number;
  retryAfterSeconds: number;
  nextState: RateLimitState;
};

export function evaluateRateLimit(
  state: RateLimitState | null,
  policy: RateLimitPolicy,
  now = new Date(),
): RateLimitDecision {
  const nowMs = now.getTime();
  if (state?.blockedUntil) {
    const blockedUntil = Date.parse(state.blockedUntil);
    if (Number.isFinite(blockedUntil) && blockedUntil > nowMs)
      return {
        allowed: false,
        requestCount: state.requestCount,
        remaining: 0,
        retryAfterSeconds: Math.ceil((blockedUntil - nowMs) / 1000),
        nextState: state,
      };
  }

  const windowStart = state ? Date.parse(state.windowStartedAt) : Number.NaN;
  const windowExpired = !Number.isFinite(windowStart) ||
    nowMs - windowStart >= policy.windowSeconds * 1000;
  const requestCount = windowExpired ? 1 : (state?.requestCount ?? 0) + 1;
  const nextState: RateLimitState = {
    windowStartedAt: windowExpired ? now.toISOString() : state!.windowStartedAt,
    requestCount,
    blockedUntil: null,
  };

  if (requestCount > policy.limit) {
    nextState.blockedUntil = new Date(nowMs + policy.blockSeconds * 1000).toISOString();
    return {
      allowed: false,
      requestCount,
      remaining: 0,
      retryAfterSeconds: policy.blockSeconds,
      nextState,
    };
  }

  return {
    allowed: true,
    requestCount,
    remaining: policy.limit - requestCount,
    retryAfterSeconds: 0,
    nextState,
  };
}
