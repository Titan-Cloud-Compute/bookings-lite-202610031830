import { Component, OnInit, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

/** Story: provider-dashboard — one row of GET /api/provider/appointments/upcoming. */
export interface UpcomingAppointment {
  id: string;
  serviceId: string;
  serviceName: string | null;
  customerId: string;
  customerName: string | null;
  customerEmail: string | null;
  startsAt: string;
  endsAt: string;
  status: string;
}

@Component({
  selector: 'app-provider-dashboard',
  standalone: true,
  template: `
    <div class="provider-page">
      <header class="page-header">
        <h1>Upcoming appointments</h1>
        <p class="subtitle">Every booked appointment you are providing, soonest first.</p>
      </header>

      <section class="card">
        @if (error()) {
          <p class="error" role="alert" data-testid="upcoming-error">{{ error() }}</p>
        }
        <ul class="upcoming-list" data-testid="upcoming-list">
          @for (a of appointments(); track a.id) {
            <li class="upcoming-item" data-testid="upcoming-item" [attr.data-starts-at]="a.startsAt">
              <span class="when">{{ formatWhen(a.startsAt) }}</span>
              <span class="service">{{ a.serviceName || 'Service' }}</span>
              <span class="customer">{{ a.customerName || a.customerEmail || 'Customer' }}</span>
            </li>
          } @empty {
            <li class="empty" data-testid="upcoming-empty">{{ loading() ? 'Loading…' : 'No upcoming appointments.' }}</li>
          }
        </ul>
      </section>
    </div>
  `,
  styles: [`
    .provider-page { max-width: 800px; margin: 0 auto; padding: 2rem 1rem; }
    .page-header { margin-bottom: 2rem; }
    h1 { font-size: var(--font-size-xl); color: var(--color-primary); margin: 0 0 0.25rem; }
    .subtitle { color: var(--color-text-secondary); font-size: var(--font-size-sm); margin: 0; }
    .card { background: var(--color-surface); border-radius: var(--radius-lg); border: 1px solid var(--color-border); padding: 1.75rem; margin-bottom: 1.75rem; box-shadow: var(--shadow-sm); }
    .upcoming-list { list-style: none; margin: 0; padding: 0; }
    .upcoming-item { display: flex; gap: 1rem; flex-wrap: wrap; padding: 0.875rem 0; border-bottom: 1px solid var(--color-border); }
    .upcoming-item:last-child { border-bottom: none; }
    .when { font-weight: 600; color: var(--color-text-primary); min-width: 12rem; }
    .service { color: var(--color-text-primary); }
    .customer { color: var(--color-text-secondary); }
    .empty { color: var(--color-text-secondary); font-size: var(--font-size-sm); }
    .error { color: var(--color-error); font-size: var(--font-size-sm); }
  `],
})
export class ProviderDashboardComponent implements OnInit {
  private readonly http = inject(HttpClient);

  readonly appointments = signal<UpcomingAppointment[]>([]);
  readonly loading = signal(true);
  readonly error = signal('');

  ngOnInit(): void {
    void this.load();
  }

  async load(): Promise<void> {
    this.loading.set(true);
    this.error.set('');
    try {
      const rows = await firstValueFrom(
        this.http.get<UpcomingAppointment[]>('api/provider/appointments/upcoming', { withCredentials: true }),
      );
      const list = Array.isArray(rows) ? [...rows] : [];
      list.sort((a, b) => Date.parse(a.startsAt) - Date.parse(b.startsAt));
      this.appointments.set(list);
    } catch {
      this.error.set('Could not load upcoming appointments.');
    } finally {
      this.loading.set(false);
    }
  }

  formatWhen(iso: string): string {
    const d = new Date(iso);
    return Number.isNaN(d.getTime()) ? iso : d.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
  }
}
