/**
 * Pure slot-generation logic (Story: set-availability).
 *
 * All times are interpreted in UTC: `date` is a calendar day (YYYY-MM-DD),
 * window minutes are minutes from 00:00 UTC of that day.
 */

export interface WindowLike {
  dayOfWeek: number; // 0 = Sunday … 6 = Saturday
  startMinute: number;
  endMinute: number;
}

export interface BlockLike {
  startsAt: Date | string;
  endsAt: Date | string;
}

export interface BookableSlot {
  /** "HH:MM" (UTC) */
  time: string;
  startsAt: string;
  endsAt: string;
}

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export function parseDay(date: string): Date | null {
  if (!DATE_RE.test(date)) return null;
  const d = new Date(`${date}T00:00:00.000Z`);
  return Number.isNaN(d.getTime()) ? null : d;
}

export function formatMinute(minute: number): string {
  const h = Math.floor(minute / 60);
  const m = minute % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

export function computeBookableSlots(
  windows: WindowLike[],
  blocks: BlockLike[],
  durationMinutes: number,
  date: string,
): BookableSlot[] {
  const day = parseDay(date);
  if (!day || !Number.isInteger(durationMinutes) || durationMinutes <= 0) return [];
  const dow = day.getUTCDay();
  const dayStart = day.getTime();
  const blockRanges = blocks.map((b) => [new Date(b.startsAt).getTime(), new Date(b.endsAt).getTime()] as const);

  const seen = new Set<number>();
  const out: BookableSlot[] = [];
  const todays = windows
    .filter((w) => w.dayOfWeek === dow)
    .sort((a, b) => a.startMinute - b.startMinute);

  for (const w of todays) {
    for (let m = w.startMinute; m + durationMinutes <= w.endMinute; m += durationMinutes) {
      if (seen.has(m)) continue;
      const start = dayStart + m * 60_000;
      const end = start + durationMinutes * 60_000;
      const blocked = blockRanges.some(([bs, be]) => start < be && end > bs);
      if (blocked) continue;
      seen.add(m);
      out.push({ time: formatMinute(m), startsAt: new Date(start).toISOString(), endsAt: new Date(end).toISOString() });
    }
  }
  return out.sort((a, b) => a.startsAt.localeCompare(b.startsAt));
}
