import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

export interface BookableService {
  id: string;
  name: string;
  durationMinutes: number;
  priceCents: number;
}

export interface OpenSlot {
  startsAt: string;
  endsAt: string;
}

function tomorrowUtc(): string {
  return new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

@Component({
  selector: 'app-book-appointment',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="book-page">
      <header class="page-header">
        <h1>Book an appointment</h1>
        <p class="subtitle">Pick a service and a day, then choose an open time slot.</p>
      </header>

      <section class="card">
        <div class="form-group">
          <label for="book-service">Service</label>
          <select id="book-service" name="service" data-testid="book-service" [(ngModel)]="serviceId" (ngModelChange)="loadSlots()">
            <option value="" disabled>Select a service</option>
            @for (s of services(); track s.id) {
              <option [value]="s.id">{{ s.name }} ({{ s.durationMinutes }} min · {{ formatPrice(s.priceCents) }})</option>
            }
          </select>
        </div>
        <div class="form-group">
          <label for="book-date">Day</label>
          <input id="book-date" name="date" type="date" data-testid="book-date" [(ngModel)]="date" (ngModelChange)="loadSlots()" />
        </div>
      </section>

      <section class="card">
        <h2>Open slots</h2>
        <ul class="slot-list" data-testid="slot-list">
          @for (slot of slots(); track slot.startsAt) {
            <li>
              <button type="button" class="slot" data-testid="slot-item"
                [class.selected]="selected()?.startsAt === slot.startsAt"
                [attr.aria-pressed]="selected()?.startsAt === slot.startsAt"
                (click)="selectSlot(slot)">{{ formatTime(slot.startsAt) }}</button>
            </li>
          } @empty {
            <li class="empty" data-testid="slot-empty">{{ serviceId ? 'No open slots on this day.' : 'Select a service to see open slots.' }}</li>
          }
        </ul>

        @if (error()) {
          <p class="error" role="alert" data-testid="booking-error">{{ error() }}</p>
        }
        @if (confirmation()) {
          <p class="success" role="status" data-testid="booking-success">{{ confirmation() }}</p>
        }
        <button type="button" class="btn-primary" data-testid="confirm-booking"
          [disabled]="!selected() || saving()" (click)="confirm()">Confirm booking</button>
      </section>
    </div>
  `,
  styles: [`
    .book-page { max-width: 800px; margin: 0 auto; padding: 2rem 1rem; }
    .page-header { margin-bottom: 1.75rem; }
    h1 { font-size: var(--font-size-xl); color: var(--color-primary); margin: 0 0 0.25rem; }
    h2 { font-size: var(--font-size-lg); color: var(--color-primary); margin: 0 0 1rem; }
    .subtitle { color: var(--color-text-secondary); font-size: var(--font-size-sm); margin: 0; }
    .card { background: var(--color-surface); border-radius: var(--radius-lg); border: 1px solid var(--color-border); box-shadow: var(--shadow-sm); padding: 2rem; margin-bottom: 1.75rem; }
    .form-group { display: flex; flex-direction: column; gap: 0.25rem; margin-bottom: 1rem; }
    .slot-list { list-style: none; padding: 0; margin: 0 0 1.25rem; display: flex; flex-wrap: wrap; gap: 0.5rem; }
    .slot { padding: 0.5rem 0.75rem; border: 1px solid var(--color-border); border-radius: var(--radius-md); background: var(--color-surface); cursor: pointer; }
    .slot.selected { border-color: var(--color-primary); background: var(--color-primary-light); font-weight: 600; }
    .empty { color: var(--color-text-secondary); }
    .error { color: var(--color-error); }
    .success { color: var(--color-text-primary); }
  `],
})
export class BookAppointmentComponent implements OnInit {
  private readonly http = inject(HttpClient);

  readonly services = signal<BookableService[]>([]);
  readonly slots = signal<OpenSlot[]>([]);
  readonly selected = signal<OpenSlot | null>(null);
  readonly saving = signal(false);
  readonly error = signal<string | null>(null);
  readonly confirmation = signal<string | null>(null);

  serviceId = '';
  date = tomorrowUtc();

  ngOnInit(): void {
    void this.loadServices();
  }

  async loadServices(): Promise<void> {
    try {
      const rows = await firstValueFrom(this.http.get<BookableService[]>('api/services', { withCredentials: true }));
      this.services.set(Array.isArray(rows) ? rows : []);
      if (!this.serviceId && this.services().length > 0) {
        this.serviceId = this.services()[0].id;
        await this.loadSlots();
      }
    } catch {
      this.error.set('Could not load services.');
    }
  }

  async loadSlots(): Promise<void> {
    this.selected.set(null);
    if (!this.serviceId || !this.date) {
      this.slots.set([]);
      return;
    }
    try {
      const rows = await firstValueFrom(
        this.http.get<OpenSlot[]>(`api/services/${encodeURIComponent(this.serviceId)}/slots`, {
          params: { date: this.date },
          withCredentials: true,
        }),
      );
      this.slots.set(Array.isArray(rows) ? rows : []);
    } catch {
      this.slots.set([]);
      this.error.set('Could not load open slots.');
    }
  }

  selectSlot(slot: OpenSlot): void {
    this.selected.set(slot);
    this.error.set(null);
    this.confirmation.set(null);
  }

  async confirm(): Promise<void> {
    const slot = this.selected();
    if (!slot || !this.serviceId) return;
    this.saving.set(true);
    this.error.set(null);
    this.confirmation.set(null);
    try {
      await firstValueFrom(
        this.http.post('api/appointments', { serviceId: this.serviceId, startsAt: slot.startsAt }, { withCredentials: true }),
      );
      this.confirmation.set(`Booked for ${this.formatTime(slot.startsAt)} on ${this.date}.`);
    } catch (err) {
      if (err instanceof HttpErrorResponse && err.status === 409) {
        this.error.set('That slot is no longer available. Please pick another slot.');
      } else {
        this.error.set('Could not book the appointment.');
      }
    } finally {
      this.saving.set(false);
      const keepError = this.error();
      await this.loadSlots();
      if (keepError) this.error.set(keepError);
    }
  }

  formatTime(iso: string): string {
    return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  formatPrice(cents: number): string {
    return `$${(cents / 100).toFixed(2)}`;
  }
}
