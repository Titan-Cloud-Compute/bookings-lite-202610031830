import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-service-card',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="sc-card">
      <div class="sc-icon" [innerHTML]="icon"></div>
      <div class="sc-body">
        <h3 class="sc-name">{{ name }}</h3>
        <p class="sc-desc">{{ description }}</p>
        <div class="sc-meta">
          <span class="sc-duration">{{ durationMinutes }} min</span>
          <span class="sc-sep">·</span>
          <span class="sc-price">{{ formattedPrice }}</span>
        </div>
        @if (showBook) {
          <a routerLink="/book" class="sc-book-btn">Book</a>
        }
      </div>
    </div>
  `,
  styles: [`
    .sc-card {
      background: var(--color-bg-primary);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-card);
      padding: 1.25rem;
      display: flex;
      gap: 1rem;
      align-items: flex-start;
      transition: box-shadow 0.15s;
    }
    .sc-card:hover {
      box-shadow: var(--shadow-hover);
    }
    .sc-icon {
      flex-shrink: 0;
      width: 48px;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--color-primary-light);
      border-radius: var(--radius-md);
      color: var(--color-primary);
    }
    .sc-body {
      flex: 1;
    }
    .sc-name {
      font-size: 1rem;
      font-weight: 600;
      color: var(--color-text-primary);
      margin: 0 0 0.25rem;
    }
    .sc-desc {
      font-size: 0.875rem;
      color: var(--color-text-secondary);
      margin: 0 0 0.5rem;
    }
    .sc-meta {
      display: flex;
      gap: 0.5rem;
      font-size: 0.875rem;
      color: var(--color-text-secondary);
    }
    .sc-sep { opacity: 0.5; }
    .sc-book-btn {
      display: inline-flex;
      align-items: center;
      margin-top: 0.75rem;
      padding: 0.4rem 1rem;
      background: var(--color-cta);
      color: #fff;
      border-radius: var(--radius-btn);
      font-size: 0.875rem;
      font-weight: 600;
      text-decoration: none;
      transition: background 0.15s;
    }
    .sc-book-btn:hover {
      background: var(--color-cta-hover);
    }
  `]
})
export class ServiceCardComponent {
  @Input() name = '';
  @Input() durationMinutes = 0;
  @Input() priceCents = 0;
  @Input() showBook = false;

  get formattedPrice(): string {
    return `$${(this.priceCents / 100).toFixed(2)}`;
  }

  get description(): string {
    const n = this.name.toLowerCase();
    if (n.includes('termite')) return 'Full inspection for termite activity and structural damage.';
    if (n.includes('rodent') || n.includes('mouse') || n.includes('mice') || n.includes('rat')) return 'Exclusion and bait station program for rodent control.';
    if (n.includes('mosquito')) return 'Barrier treatment to dramatically reduce mosquito populations.';
    if (n.includes('bed bug')) return 'Heat and chemical treatment to eliminate bed bugs.';
    return 'Professional treatment by a licensed local technician.';
  }

  get icon(): string {
    const n = this.name.toLowerCase();
    if (n.includes('termite')) return ICON_TERMITE;
    if (n.includes('rodent') || n.includes('mouse') || n.includes('mice') || n.includes('rat')) return ICON_RODENT;
    if (n.includes('mosquito')) return ICON_MOSQUITO;
    if (n.includes('bed bug')) return ICON_BED_BUG;
    return ICON_BUG;
  }
}

const ICON_BUG = `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
  <ellipse cx="12" cy="13" rx="4" ry="5"/>
  <path d="M12 8a3 3 0 100-6 3 3 0 000 6z"/>
  <path d="M8 10l-4-2M16 10l4-2M8 13H4M20 13h-4M8 17l-3 3M16 17l3 3"/>
</svg>`;

const ICON_TERMITE = `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
  <ellipse cx="12" cy="14" rx="3" ry="4"/>
  <circle cx="12" cy="7" r="2.5"/>
  <path d="M9 10l-4-1M15 10l4-1M9 14H5M19 14h-4M10 18l-2 3M14 18l2 3"/>
</svg>`;

const ICON_RODENT = `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
  <ellipse cx="11" cy="14" rx="5" ry="4"/>
  <circle cx="8" cy="9" r="2.5"/>
  <path d="M16 12c2-2 5-1 5 2s-3 3-5 2M11 18l-1 3M13 18l1 3"/>
  <circle cx="7" cy="8.5" r="0.5" fill="currentColor"/>
</svg>`;

const ICON_MOSQUITO = `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
  <ellipse cx="12" cy="13" rx="2" ry="4"/>
  <circle cx="12" cy="7" r="2"/>
  <path d="M8 10l-5-2M16 10l5-2M8 13H4M20 13h-4M12 17v4M10 21h4"/>
</svg>`;

const ICON_BED_BUG = `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
  <ellipse cx="12" cy="13" rx="5" ry="4"/>
  <path d="M8 9l-3-2M16 9l3-2M7 13H3M21 13h-4M8 16l-2 3M16 16l2 3"/>
  <circle cx="10" cy="11" r="0.6" fill="currentColor"/>
  <circle cx="14" cy="11" r="0.6" fill="currentColor"/>
</svg>`;
