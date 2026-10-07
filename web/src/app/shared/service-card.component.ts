import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SafeHtmlPipe } from './safe-html.pipe';
import { iconForService, descForService } from './pest-icons';

@Component({
  selector: 'app-service-card',
  standalone: true,
  imports: [RouterLink, SafeHtmlPipe],
  template: `
    <div class="service-card">
      <div class="card-icon" [innerHTML]="icon | safeHtml"></div>
      <div class="card-body">
        <h3 class="card-name">{{ name }}</h3>
        <p class="card-desc">{{ description }}</p>
        <div class="card-meta">
          <span class="meta-duration">{{ durationMinutes }} min</span>
          <span class="meta-sep">·</span>
          <span class="meta-price">{{ formattedPrice }}</span>
        </div>
        @if (showBook) {
          <a routerLink="/book" class="btn-book">Book</a>
        }
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }

    .service-card {
      display: flex;
      gap: 1rem;
      background: var(--color-bg-primary);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-card, 12px);
      padding: 1.25rem;
      box-shadow: var(--shadow-sm);
      transition: box-shadow 0.15s ease;
    }

    .service-card:hover {
      box-shadow: var(--shadow-hover);
    }

    .card-icon {
      flex-shrink: 0;
      width: 56px;
      height: 56px;
      color: var(--color-primary);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .card-icon ::ng-deep svg {
      width: 100%;
      height: 100%;
    }

    .card-body {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
    }

    .card-name {
      font-size: var(--font-size-lg, 1.125rem);
      font-weight: 600;
      color: var(--color-text-primary);
      margin: 0;
    }

    .card-desc {
      font-size: var(--font-size-sm, 0.875rem);
      color: var(--color-text-secondary);
      margin: 0;
      line-height: 1.5;
    }

    .card-meta {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      font-size: var(--font-size-sm, 0.875rem);
      color: var(--color-text-secondary);
    }

    .meta-sep { opacity: 0.5; }

    .btn-book {
      display: inline-flex;
      align-items: center;
      margin-top: 0.5rem;
      align-self: flex-start;
      padding: 0.5rem 1.25rem;
      background: var(--color-cta);
      color: var(--color-on-primary);
      border-radius: var(--radius-btn, 8px);
      font-size: var(--font-size-sm, 0.875rem);
      font-weight: 600;
      text-decoration: none;
      transition: background 0.15s ease;
    }

    .btn-book:hover {
      background: var(--color-cta-hover);
    }
  `],
})
export class ServiceCardComponent {
  @Input() name: string = '';
  @Input() durationMinutes: number = 0;
  @Input() priceCents: number = 0;
  @Input() showBook: boolean = false;

  get icon(): string {
    return iconForService(this.name);
  }

  get description(): string {
    return descForService(this.name);
  }

  get formattedPrice(): string {
    return `$${(this.priceCents / 100).toFixed(2)}`;
  }
}
