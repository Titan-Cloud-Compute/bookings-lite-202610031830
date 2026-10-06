import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { getPestIcon } from './pest-icons';

@Component({
  selector: 'app-service-card',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="service-card">
      <div class="card-icon" [innerHTML]="icon.svg"></div>
      <div class="card-body">
        <h3 class="card-name">{{ name }}</h3>
        <p class="card-desc">{{ icon.description }}</p>
        <div class="card-meta">
          <span class="card-duration">{{ durationMinutes }} min</span>
          <span class="card-price">{{ formattedPrice }}</span>
        </div>
        @if (showBook) {
          <a routerLink="/book" class="btn-primary card-book">Book</a>
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
      color: var(--color-primary);
    }
    .card-icon :global(svg),
    .card-icon svg {
      width: 40px;
      height: 40px;
    }
    .card-body {
      padding: 1.25rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
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
      flex: 1;
    }
    .card-meta {
      display: flex;
      gap: 1rem;
      font-size: var(--font-size-sm);
      color: var(--color-text-secondary);
      font-weight: 500;
    }
    .card-price {
      color: var(--color-text-primary);
      font-weight: 600;
    }
    .card-book {
      margin-top: 0.75rem;
      align-self: flex-start;
      padding: 0.5rem 1.25rem;
      font-size: var(--font-size-sm);
    }
  `],
})
export class ServiceCardComponent {
  @Input() name = '';
  @Input() durationMinutes = 0;
  @Input() priceCents = 0;
  @Input() showBook = false;

  get icon() {
    return getPestIcon(this.name);
  }

  get formattedPrice(): string {
    return `$${(this.priceCents / 100).toFixed(2)}`;
  }
}
