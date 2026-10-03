import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

interface DayRow {
  dayOfWeek: number;
  label: string;
  enabled: boolean;
  start: string;
  end: string;
}

interface WindowView { dayOfWeek: number; startMinute: number; endMinute: number }
interface BlockView { id: string; startsAt: string; endsAt: string }
interface SlotView { time: string; startsAt: string; endsAt: string }
interface ServiceView { id: string; name: string; durationMinutes: number }

const DAY_LABELS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function toMinute(hhmm: string): number {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
}

function toHhmm(minute: number): string {
  return `${String(Math.floor(minute / 60)).padStart(2, '0')}:${String(minute % 60).padStart(2, '0')}`;
}

@Component({
  selector: 'app-availability',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="availability-page">
      <header class="page-header">
        <h1>Availability</h1>
        <p class="subtitle">Set your weekly hours and block times when you are unavailable. Times are UTC.</p>
      </header>

      <section class="card" data-testid="availability-weekly">
        <h2>Weekly hours</h2>
        @for (d of days(); track d.dayOfWeek) {
          <div class="day-row" data-testid="availability-day-row">
            <label class="day-label">
              <input type="checkbox" [(ngModel)]="d.enabled" [name]="'enabled-' + d.dayOfWeek" data-testid="availability-day-enabled" />
              {{ d.label }}
            </label>
            <input type="time" [(ngModel)]="d.start" [name]="'start-' + d.dayOfWeek" [disabled]="!d.enabled" data-testid="availability-day-start" />
            <span>–</span>
            <input type="time" [(ngModel)]="d.end" [name]="'end-' + d.dayOfWeek" [disabled]="!d.enabled" data-testid="availability-day-end" />
          </div>
        }
        <button type="button" class="btn-primary" [disabled]="saving()" (click)="saveWeekly()" data-testid="availability-save">Save hours</button>
        @if (weeklyMessage()) {
          <p class="status" data-testid="availability-weekly-status">{{ weeklyMessage() }}</p>
        }
      </section>

      <section class="card">
        <h2>Blocked time slots</h2>
        <form class="block-form" data-testid="availability-block-form" (ngSubmit)="addBlock()">
          <input type="date" name="blockDate" [(ngModel)]="blockDate" required data-testid="availability-block-date" />
          <input type="time" name="blockStart" [(ngModel)]="blockStart" required data-testid="availability-block-start" />
          <span>–</span>
          <input type="time" name="blockEnd" [(ngModel)]="blockEnd" required data-testid="availability-block-end" />
          <button type="submit" class="btn-primary" data-testid="availability-block-submit">Block</button>
        </form>
        <ul class="block-list" data-testid="availability-block-list">
          @for (b of blocks(); track b.id) {
            <li data-testid="availability-block-item">
              <span>{{ formatRange(b.startsAt, b.endsAt) }}</span>
              <button type="button" (click)="removeBlock(b.id)" data-testid="availability-block-remove">Remove</button>
            </li>
          } @empty {
            <li class="empty">No blocked slots.</li>
          }
        </ul>
      </section>

      <section class="card" data-testid="availability-slot-preview">
        <h2>Bookable slot preview</h2>
        <div class="preview-controls">
          <select name="previewService" [(ngModel)]="previewServiceId" data-testid="availability-preview-service">
            <option value="">Select a service</option>
            @for (s of services(); track s.id) {
              <option [value]="s.id">{{ s.name }} ({{ s.durationMinutes }} min)</option>
            }
          </select>
          <input type="date" name="previewDate" [(ngModel)]="previewDate" data-testid="availability-preview-date" />
          <button type="button" (click)="loadSlots()" data-testid="availability-preview-submit">Show slots</button>
        </div>
        <ul class="slot-list" data-testid="availability-slot-list">
          @for (s of slots(); track s.startsAt) {
            <li data-testid="availability-slot-item">{{ s.time }}</li>
          } @empty {
            <li class="empty">No bookable slots to show.</li>
          }
        </ul>
      </section>

      @if (error()) {
        <p class="error" role="alert" data-testid="availability-error">{{ error() }}</p>
      }
    </div>
  `,
  styles: [`
    .availability-page { max-width: 800px; margin: 0 auto; padding: 2rem 1rem; }
    .page-header { margin-bottom: 1.5rem; }
    h1 { font-size: var(--font-size-xl); color: var(--color-text-primary); margin: 0 0 0.25rem; }
    .subtitle { color: var(--color-text-secondary); font-size: var(--font-size-sm); margin: 0; }
    .card { background: white; border-radius: var(--radius-card); border: 1px solid var(--color-border); padding: 1.5rem; margin-bottom: 1.5rem; }
    .day-row, .block-form, .preview-controls { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem; }
    .day-label { min-width: 8rem; }
    .block-list, .slot-list { list-style: none; padding: 0; margin: 0; }
    .block-list li { display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 1px solid var(--color-border); }
    .slot-list { display: flex; flex-wrap: wrap; gap: 0.5rem; }
    .empty, .status { color: var(--color-text-secondary); }
    .error { color: var(--color-error); }
  `],
})
export class AvailabilityComponent implements OnInit {
  private readonly http = inject(HttpClient);

  readonly days = signal<DayRow[]>(DAY_LABELS.map((label, dayOfWeek) => ({
    dayOfWeek, label, enabled: false, start: '09:00', end: '17:00',
  })));
  readonly blocks = signal<BlockView[]>([]);
  readonly services = signal<ServiceView[]>([]);
  readonly slots = signal<SlotView[]>([]);
  readonly saving = signal(false);
  readonly error = signal<string | null>(null);
  readonly weeklyMessage = signal<string | null>(null);

  blockDate = '';
  blockStart = '10:00';
  blockEnd = '10:30';
  previewServiceId = '';
  previewDate = '';

  ngOnInit(): void {
    void this.loadWeekly();
    void this.loadBlocks();
    void this.loadServices();
  }

  async loadWeekly(): Promise<void> {
    try {
      const rows = await firstValueFrom(this.http.get<WindowView[]>('api/availability/weekly', { withCredentials: true }));
      const next = this.days().map((d) => ({ ...d }));
      for (const w of Array.isArray(rows) ? rows : []) {
        const d = next[w.dayOfWeek];
        if (!d) continue;
        d.enabled = true;
        d.start = toHhmm(w.startMinute);
        d.end = toHhmm(w.endMinute);
      }
      this.days.set(next);
    } catch {
      this.error.set('Could not load your weekly hours.');
    }
  }

  async loadBlocks(): Promise<void> {
    try {
      const rows = await firstValueFrom(this.http.get<BlockView[]>('api/availability/blocks', { withCredentials: true }));
      this.blocks.set(Array.isArray(rows) ? rows : []);
    } catch {
      this.error.set('Could not load blocked slots.');
    }
  }

  async loadServices(): Promise<void> {
    try {
      const rows = await firstValueFrom(this.http.get<ServiceView[]>('api/services/mine', { withCredentials: true }));
      this.services.set(Array.isArray(rows) ? rows : []);
    } catch {
      this.services.set([]);
    }
  }

  async saveWeekly(): Promise<void> {
    const windows: WindowView[] = [];
    for (const d of this.days().filter((x) => x.enabled)) {
      const startMinute = toMinute(d.start);
      const endMinute = toMinute(d.end);
      if (!(startMinute < endMinute)) {
        this.error.set(`${d.label}: start must be before end.`);
        return;
      }
      windows.push({ dayOfWeek: d.dayOfWeek, startMinute, endMinute });
    }
    this.error.set(null);
    this.saving.set(true);
    try {
      await firstValueFrom(this.http.put('api/availability/weekly', { windows }, { withCredentials: true }));
      this.weeklyMessage.set('Weekly hours saved.');
    } catch {
      this.error.set('Could not save weekly hours.');
    } finally {
      this.saving.set(false);
    }
  }

  async addBlock(): Promise<void> {
    if (!this.blockDate || !this.blockStart || !this.blockEnd) {
      this.error.set('Enter a date, start and end time to block.');
      return;
    }
    const startsAt = `${this.blockDate}T${this.blockStart}:00.000Z`;
    const endsAt = `${this.blockDate}T${this.blockEnd}:00.000Z`;
    if (!(startsAt < endsAt)) {
      this.error.set('Block start must be before its end.');
      return;
    }
    this.error.set(null);
    try {
      await firstValueFrom(this.http.post('api/availability/blocks', { startsAt, endsAt }, { withCredentials: true }));
      await this.loadBlocks();
    } catch {
      this.error.set('Could not block that slot.');
    }
  }

  async removeBlock(id: string): Promise<void> {
    try {
      await firstValueFrom(this.http.delete(`api/availability/blocks/${encodeURIComponent(id)}`, { withCredentials: true }));
      await this.loadBlocks();
    } catch {
      this.error.set('Could not remove the blocked slot.');
    }
  }

  async loadSlots(): Promise<void> {
    if (!this.previewServiceId || !this.previewDate) {
      this.error.set('Pick a service and a date to preview slots.');
      return;
    }
    this.error.set(null);
    try {
      const rows = await firstValueFrom(this.http.get<SlotView[]>('api/availability/slots', {
        params: { serviceId: this.previewServiceId, date: this.previewDate },
        withCredentials: true,
      }));
      this.slots.set(Array.isArray(rows) ? rows : []);
    } catch {
      this.error.set('Could not load bookable slots.');
    }
  }

  formatRange(startsAt: string, endsAt: string): string {
    const s = new Date(startsAt).toISOString();
    const e = new Date(endsAt).toISOString();
    return `${s.slice(0, 10)} ${s.slice(11, 16)}–${e.slice(11, 16)} UTC`;
  }
}
