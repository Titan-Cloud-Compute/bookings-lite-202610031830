/** Late-cancellation policy: cancelling within this window of the start is "late". */
export const LATE_CANCELLATION_WINDOW_MS = 24 * 60 * 60 * 1000;

/** True when `startsAt` is within 24 hours of `now` (or already past). */
export function isLateCancellation(startsAt: Date, now: Date): boolean {
  return startsAt.getTime() - now.getTime() <= LATE_CANCELLATION_WINDOW_MS;
}
