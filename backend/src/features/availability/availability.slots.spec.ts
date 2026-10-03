import { computeBookableSlots } from './availability.slots';

// 2026-10-05 is a Monday.
const MONDAY = '2026-10-05';

describe('computeBookableSlots', () => {
  const windows = [{ dayOfWeek: 1, startMinute: 9 * 60, endMinute: 12 * 60 }];

  it('splits a window into service-length slots and drops blocked ones', () => {
    const blocks = [{ startsAt: '2026-10-05T10:00:00.000Z', endsAt: '2026-10-05T10:30:00.000Z' }];
    const slots = computeBookableSlots(windows, blocks, 30, MONDAY);
    expect(slots.map((s) => s.time)).toEqual(['09:00', '09:30', '10:30', '11:00', '11:30']);
    expect(slots[0]).toEqual({ time: '09:00', startsAt: '2026-10-05T09:00:00.000Z', endsAt: '2026-10-05T09:30:00.000Z' });
  });

  it('offers nothing on a day without a window', () => {
    expect(computeBookableSlots(windows, [], 30, '2026-10-06')).toEqual([]);
  });

  it('never offers a slot that would run past the window end', () => {
    expect(computeBookableSlots(windows, [], 45, MONDAY).map((s) => s.time)).toEqual(['09:00', '09:45', '10:30', '11:15']);
  });

  it('drops any slot partially overlapping a block', () => {
    const blocks = [{ startsAt: new Date('2026-10-05T09:15:00.000Z'), endsAt: new Date('2026-10-05T09:20:00.000Z') }];
    expect(computeBookableSlots(windows, blocks, 30, MONDAY).map((s) => s.time)).toEqual(['09:30', '10:00', '10:30', '11:00', '11:30']);
  });

  it('ignores blocks on other days and rejects bad input', () => {
    const blocks = [{ startsAt: '2026-10-12T10:00:00.000Z', endsAt: '2026-10-12T10:30:00.000Z' }];
    expect(computeBookableSlots(windows, blocks, 30, MONDAY)).toHaveLength(6);
    expect(computeBookableSlots(windows, [], 0, MONDAY)).toEqual([]);
    expect(computeBookableSlots(windows, [], 30, 'not-a-date')).toEqual([]);
  });
});
