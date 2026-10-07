import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PEST_ICONS, PEST_DESCRIPTIONS, pestIconKey } from './pest-icons';

@Component({
  selector: 'app-service-card',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="service-card">
      <div class="service-icon" [innerHTML]="icon"></div>
      <div class="service-body">
        <h3 class="service-card-name">{{ name }}</h3>
        <p class="service-card-desc">{{ description }}</p>
        <div class="service-card-meta">
          <span class="service-card-duration">{{ durationMinutes }} min</span>
          <span class="service-card-price">{{ formattedPrice }}</span>
        </div>
        @if (showBook) {
          <a class="btn-primary service-card-book" routerLink="/book">Book</a>
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
      border-radius: var(--radius-card, 12px);
      overflow: hidden;
      box-shadow: var(--shadow-sm);
      transition: box-shadow 150ms ease, transform 150ms ease;
    }
    .service-card:hover {
      box-shadow: var(--shadow-hover);
      transform: translateY(-2px);
    }
    .service-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100px;
      background: var(--color-primary-light, #e4eaf2);
      color: var(--color-primary);
    }
    .service-icon svg {
      width: 56px;
      height: 56px;
    }
    .service-body {
      padding: 1.25rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      flex: 1;
    }
    .service-card-name {
      margin: 0;
      font-size: var(--font-size-lg, 1.125rem);
      font-weight: 600;
      color: var(--color-text-primary);
    }
    .service-card-desc {
      margin: 0;
      font-size: var(--font-size-sm, 0.875rem);
      color: var(--color-text-secondary);
      line-height: 1.5;
    }
    .service-card-meta {
      display: flex;
      gap: 1rem;
      font-size: var(--font-size-sm, 0.875rem);
      color: var(--color-text-secondary);
    }
    .service-card-price {
      font-weight: 600;
      color: var(--color-text-primary);
    }
    .service-card-book {
      align-self: flex-start;
      margin-top: 0.5rem;
    }
  `],
})
export class ServiceCardComponent {
  @Input() name = '';
  @Input() durationMinutes = 0;
  @Input() priceCents = 0;
  @Input() showBook = false;

  get icon(): string {
    const key = pestIconKey(this.name);
    return PEST_ICONS[key] ?? PEST_ICONS['default'];
  }

  get description(): string {
    const key = pestIconKey(this.name);
    return PEST_DESCRIPTIONS[key] ?? PEST_DESCRIPTIONS['default'];
  }

  get formattedPrice(): string {
    return `$${(this.priceCents / 100).toFixed(2)}`;
  }
}
