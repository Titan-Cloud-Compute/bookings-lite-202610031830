import { Component, OnInit, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

export interface ReminderItem {
  id: string;
  appointmentId: string;
  subject: string;
  message: string;
  serviceName: string;
  providerName: string;
  startsAt: string;
  sentAt: string;
}

/** Story: reminder-notifications — the signed-in customer's appointment reminders. */
@Component({
  selector: 'app-reminders',
  standalone: true,
  template: `
    <div class="reminders-page">
      <header class="page-header">
        <h1>Reminders</h1>
        <p class="subtitle">Reminders are sent 24 hours before each upcoming appointment.</p>
      </header>

      <section class="card">
        @if (error()) {
          <p class="error" role="alert" data-testid="reminders-error">{{ error() }}</p>
        }
        @if (reminders().length > 0) {
          <ul class="reminder-list" data-testid="reminders-list">
            @for (r of reminders(); track r.id) {
              <li class="reminder" data-testid="reminder-item">
                <strong data-testid="reminder-service">{{ r.serviceName }}</strong>
                <span data-testid="reminder-when">{{ formatWhen(r.startsAt) }}</span>
                <span data-testid="reminder-provider">with {{ r.providerName }}</span>
                <p class="message">{{ r.message }}</p>
              </li>
            }
          </ul>
        } @else {
          <p class="empty" data-testid="reminders-empty">{{ loading() ? 'Loading reminders…' : 'No reminders yet.' }}</p>
        }
      </section>
    </div>
  `,
  styles: [`
    .reminders-page { max-width: 800px; margin: 0 auto; padding: 2rem 1rem; }
    .page-header { margin-bottom: 1.5rem; }
    h1 { font-size: var(--font-size-xl); color: var(--color-text-primary); margin: 0 0 0.25rem; }
    .subtitle { color: var(--color-text-secondary); font-size: var(--font-size-sm); margin: 0; }
    .card { background: white; border-radius: var(--radius-card); border: 1px solid var(--color-border); padding: 1.5rem; margin-bottom: 1.5rem; }
    .reminder-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 1rem; }
    .reminder { display: flex; flex-wrap: wrap; gap: 0.5rem; border-bottom: 1px solid var(--color-border); padding-bottom: 1rem; }
    .message { width: 100%; margin: 0; color: var(--color-text-secondary); }
    .empty { color: var(--color-text-secondary); }
    .error { color: var(--color-error); }
  `],
})
export class RemindersComponent implements OnInit {
  private readonly http = inject(HttpClient);

  readonly reminders = signal<ReminderItem[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  ngOnInit(): void {
    void this.load();
  }

  async load(): Promise<void> {
    try {
      const rows = await firstValueFrom(this.http.get<ReminderItem[]>('api/reminders/mine', { withCredentials: true }));
      this.reminders.set(Array.isArray(rows) ? rows : []);
    } catch {
      this.error.set('Could not load reminders.');
    } finally {
      this.loading.set(false);
    }
  }

  formatWhen(iso: string): string {
    const d = new Date(iso);
    return `${d.toLocaleDateString()} ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  }
}
