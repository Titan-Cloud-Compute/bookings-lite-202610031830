import { Component, OnInit, inject, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

export interface MyAppointment {
  id: string;
  serviceId: string;
  startsAt: string;
  endsAt: string;
  status: string;
}

interface CancellationResult {
  appointmentId: string;
  status: string;
  late: boolean;
}

const LATE_WINDOW_MS = 24 * 60 * 60 * 1000;

@Component({
  selector: 'app-my-appointments',
  standalone: true,
  template: `
    <div class="appts-page">
      <header class="page-header">
        <h1>My appointments</h1>
        <p class="subtitle">Your bookings. Cancelling less than 24 hours before the start counts as a late cancellation.</p>
      </header>

      <section class="card">
        @if (error()) {
          <p class="error" role="alert" data-testid="cancel-error">{{ error() }}</p>
        }
        @if (notice()) {
          <p class="success" role="status" data-testid="cancel-notice" [class.late]="noticeLate()">{{ notice() }}</p>
        }
        <ul class="appt-list" data-testid="my-appointments-list">
          @for (a of appointments(); track a.id) {
            <li class="appt" data-testid="appointment-item">
              <span class="when">{{ formatWhen(a.startsAt) }}</span>
              <span class="status" data-testid="appointment-status">{{ statusLabel(a) }}</span>
              @if (a.status === 'BOOKED') {
                @if (pendingLate() === a.id) {
                  <span class="warning" role="alert" data-testid="late-cancel-warning">
                    This appointment starts within 24 hours — cancelling now is a late cancellation and the provider will be notified.
                  </span>
                  <button type="button" class="btn-danger" data-testid="confirm-late-cancel" [disabled]="busy()" (click)="doCancel(a)">Cancel anyway</button>
                  <button type="button" class="btn-secondary" data-testid="keep-appointment" (click)="pendingLate.set(null)">Keep</button>
                } @else {
                  <button type="button" class="btn-danger" data-testid="cancel-appointment" [disabled]="busy()" (click)="cancel(a)">Cancel</button>
                }
              }
            </li>
          } @empty {
            <li class="empty" data-testid="appointments-empty">You have no appointments yet.</li>
          }
        </ul>
      </section>
    </div>
  `,
  styles: [`
    .appts-page { max-width: 800px; margin: 0 auto; padding: 2rem 1rem; }
    .page-header { margin-bottom: 2rem; }
    h1 { font-size: var(--font-size-xl); color: var(--color-primary); margin: 0 0 0.25rem; }
    .subtitle { color: var(--color-text-secondary); font-size: var(--font-size-sm); margin: 0; }
    .card { background: var(--color-surface); border-radius: var(--radius-lg); border: 1px solid var(--color-border); padding: 1.75rem; margin-bottom: 1.75rem; box-shadow: var(--shadow-sm); }
    .appt-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.5rem; }
    .appt { display: flex; flex-wrap: wrap; align-items: center; gap: 0.75rem; padding: 0.75rem 0; border-bottom: 1px solid var(--color-border); }
    .when { font-weight: 600; }
    .status, .empty { color: var(--color-text-secondary); }
    .warning, .error { color: var(--color-error); }
    .success { color: var(--color-text-primary); }
  `],
})
export class MyAppointmentsComponent implements OnInit {
  private readonly http = inject(HttpClient);

  readonly appointments = signal<MyAppointment[]>([]);
  readonly lateIds = signal<Set<string>>(new Set());
  readonly pendingLate = signal<string | null>(null);
  readonly busy = signal(false);
  readonly error = signal<string | null>(null);
  readonly notice = signal<string | null>(null);
  readonly noticeLate = signal(false);

  ngOnInit(): void {
    void this.load();
  }

  async load(): Promise<void> {
    try {
      const rows = await firstValueFrom(this.http.get<MyAppointment[]>('api/appointments/mine', { withCredentials: true }));
      this.appointments.set(Array.isArray(rows) ? rows : []);
    } catch {
      this.error.set('Could not load your appointments.');
      return;
    }
    try {
      const cancellations = await firstValueFrom(
        this.http.get<CancellationResult[]>('api/appointments/mine/cancellations', { withCredentials: true }),
      );
      if (Array.isArray(cancellations)) {
        this.lateIds.set(new Set(cancellations.filter((c) => c.late).map((c) => c.appointmentId)));
      }
    } catch {
      // Late flags are best-effort; the list still renders without them.
    }
  }

  isWithin24h(a: MyAppointment): boolean {
    return Date.parse(a.startsAt) - Date.now() <= LATE_WINDOW_MS;
  }

  /** Within 24h: show the late-cancellation warning first; otherwise cancel straight away. */
  cancel(a: MyAppointment): void {
    this.error.set(null);
    this.notice.set(null);
    if (this.isWithin24h(a)) {
      this.pendingLate.set(a.id);
      return;
    }
    void this.doCancel(a);
  }

  async doCancel(a: MyAppointment): Promise<void> {
    this.busy.set(true);
    this.error.set(null);
    try {
      const res = await firstValueFrom(
        this.http.post<CancellationResult>(`api/appointments/${encodeURIComponent(a.id)}/cancel`, {}, { withCredentials: true }),
      );
      const late = !!res?.late;
      if (late) this.lateIds.update((s) => new Set(s).add(a.id));
      this.appointments.update((list) => list.map((x) => (x.id === a.id ? { ...x, status: res?.status ?? 'CANCELLED' } : x)));
      this.noticeLate.set(late);
      this.notice.set(late
        ? 'Appointment cancelled. This was a late cancellation (within 24 hours); the provider has been notified.'
        : 'Appointment cancelled. The slot is available again and the provider has been notified.');
    } catch (err) {
      this.error.set(err instanceof HttpErrorResponse && err.status === 409
        ? 'This appointment can no longer be cancelled.'
        : 'Could not cancel the appointment.');
    } finally {
      this.pendingLate.set(null);
      this.busy.set(false);
    }
  }

  statusLabel(a: MyAppointment): string {
    if (a.status === 'BOOKED') return 'Confirmed';
    if (a.status === 'CANCELLED') return this.lateIds().has(a.id) ? 'Cancelled (late)' : 'Cancelled';
    return a.status;
  }

  formatWhen(iso: string): string {
    const d = new Date(iso);
    return `${d.toLocaleDateString()} ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  }
}
