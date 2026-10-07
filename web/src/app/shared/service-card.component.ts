import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { getPestIcon, getPestDescription } from './pest-icons';

@Component({
  selector: 'app-service-card',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="service-card">
      <div class="card-icon" [innerHTML]="icon"></div>
      <div class="card-body">
        <h3 class="card-name">{{ name }}</h3>
        <p class="card-desc">{{ description }}</p>
        <div class="card-meta">
          <span class="meta-item">{{ durationMinutes }} min</span>
          <span class="meta-sep">·</span>
          <span class="meta-item">{{ formattedPrice }}</span>
        </div>
        @if (showBook) {
          <a routerLink="/book" class="btn-book">Book</a>
        }
      </div>
    </div>
  `,
  styles: [`
    .service-card {
      display: flex;
      flex-direction: column;
      background: var(--color-bg-primary);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-card);
      overflow: hidden;
      box-shadow: var(--shadow-card);
      transition: box-shadow 0.15s ease, transform 0.15s ease;
    }

    .service-card:hover {
      box-shadow: var(--shadow-hover);
      transform: translateY(-2px);
    }

    .card-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1.5rem;
      background: var(--color-bg-secondary);
    }

    .card-body {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      padding: 1.25rem;
      flex: 1;
    }

    .card-name {
      font-size: var(--font-size-lg);
      font-weight: 600;
      color: var(--color-text-primary);
      margin: 0;
    }

    .card-desc {
      font-size: var(--font-size-sm);
      color: var(--color-text-secondary);
      line-height: 1.5;
      margin: 0;
      flex: 1;
    }

    .card-meta {
      display: flex;
      align-items: center;
      gap: 0.375rem;
      font-size: var(--font-size-sm);
      color: var(--color-text-secondary);
      margin-top: 0.25rem;
    }

    .meta-sep {
      color: var(--color-text-muted);
    }

    .btn-book {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 0.5rem 1.25rem;
      background: var(--color-cta);
      color: var(--color-on-primary);
      border-radius: var(--radius-btn);
      font-weight: 600;
      font-size: var(--font-size-sm);
      text-decoration: none;
      margin-top: 0.75rem;
      align-self: flex-start;
      transition: background 0.15s ease;
    }

    .btn-book:hover {
      background: var(--color-cta-hover);
    }
  `],
})
export class ServiceCardComponent {
  @Input() name = '';
  @Input() durationMinutes = 0;
  @Input() priceCents = 0;
  @Input() showBook = false;

  get icon(): string {
    return getPestIcon(this.name);
  }

  get description(): string {
    return getPestDescription(this.name);
  }

  get formattedPrice(): string {
    return `$${(this.priceCents / 100).toFixed(2)}`;
  }
}
