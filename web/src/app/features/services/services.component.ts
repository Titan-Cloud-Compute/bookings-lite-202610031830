import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { ServiceCardComponent } from '../../shared/service-card.component';

export interface ProviderService {
  id: string;
  name: string;
  durationMinutes: number;
  priceCents: number;
  active: boolean;
}

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [FormsModule, ServiceCardComponent],
  template: `
    <div class="services-page">
      <header class="page-header">
        <h1>Services</h1>
        <p class="subtitle">Create the services clients can book.</p>
      </header>

      <form class="card" data-testid="service-form" (ngSubmit)="create()">
        <div class="form-group">
          <label for="service-name">Name</label>
          <input id="service-name" name="name" type="text" required [(ngModel)]="name" data-testid="service-name" />
        </div>
        <div class="form-group">
          <label for="service-duration">Duration (minutes)</label>
          <input id="service-duration" name="durationMinutes" type="number" min="1" required [(ngModel)]="durationMinutes" data-testid="service-duration" />
        </div>
        <div class="form-group">
          <label for="service-price">Price</label>
          <input id="service-price" name="price" type="number" min="0" step="0.01" required [(ngModel)]="price" data-testid="service-price" />
        </div>
        @if (error()) {
          <p class="error" role="alert" data-testid="service-error">{{ error() }}</p>
        }
        <button type="submit" class="btn-primary" [disabled]="saving()" data-testid="service-submit">Create service</button>
      </form>

      <section class="card">
        <h2>Your services</h2>
        <ul class="service-list" data-testid="service-list">
          @for (s of services(); track s.id) {
            <li data-testid="service-item">
              <app-service-card
                [name]="s.name"
                [durationMinutes]="s.durationMinutes"
                [priceCents]="s.priceCents"
                [showBook]="false"
              />
            </li>
          } @empty {
            <li class="empty" data-testid="service-empty">No services yet.</li>
          }
        </ul>
      </section>
    </div>
  `,
  styles: [`
    .services-page { max-width: 800px; margin: 0 auto; padding: 2rem 1rem; }
    .page-header { margin-bottom: 1.5rem; }
    h1 { font-size: var(--font-size-xl); color: var(--color-text-primary); margin: 0 0 0.25rem; }
    .subtitle { color: var(--color-text-secondary); font-size: var(--font-size-sm); margin: 0; }
    .card { background: white; border-radius: var(--radius-card); border: 1px solid var(--color-border); padding: 1.5rem; margin-bottom: 1.5rem; }
    .form-group { display: flex; flex-direction: column; gap: 0.25rem; margin-bottom: 1rem; }
    .error { color: var(--color-error); }
    .service-list { list-style: none; padding: 0; margin: 0; }
    .service-list li { display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 1px solid var(--color-border); }
    .service-meta, .empty { color: var(--color-text-secondary); }
  `],
})
export class ServicesComponent implements OnInit {
  private readonly http = inject(HttpClient);

  readonly services = signal<ProviderService[]>([]);
  readonly saving = signal(false);
  readonly error = signal<string | null>(null);

  name = '';
  durationMinutes: number | null = 30;
  price: number | null = 0;

  ngOnInit(): void {
    void this.load();
  }

  async load(): Promise<void> {
    try {
      const rows = await firstValueFrom(
        this.http.get<ProviderService[]>('api/services/mine', { withCredentials: true }),
      );
      this.services.set(Array.isArray(rows) ? rows : []);
    } catch {
      this.error.set('Could not load your services.');
    }
  }

  async create(): Promise<void> {
    const name = this.name.trim();
    const durationMinutes = Number(this.durationMinutes);
    const priceCents = Math.round(Number(this.price) * 100);
    if (!name || !Number.isInteger(durationMinutes) || durationMinutes <= 0 || !Number.isFinite(priceCents) || priceCents < 0) {
      this.error.set('Enter a name, a whole-minute duration above 0 and a price of 0 or more.');
      return;
    }
    this.error.set(null);
    this.saving.set(true);
    try {
      await firstValueFrom(
        this.http.post('api/services', { name, durationMinutes, priceCents }, { withCredentials: true }),
      );
      this.name = '';
      await this.load();
    } catch {
      this.error.set('Could not create the service.');
    } finally {
      this.saving.set(false);
    }
  }

  formatPrice(cents: number): string {
    return `$${(cents / 100).toFixed(2)}`;
  }
}
