import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-site-header',
  standalone: true,
  imports: [RouterLink],
  template: `
    <header class="site-header">
      <div class="site-header-inner">
        <a class="brand-logo" routerLink="/">Ferguson Pest Control</a>

        <!-- Desktop nav -->
        <nav class="site-nav" aria-label="Main navigation">
          <a class="nav-link" routerLink="/" fragment="services">Services</a>
          <a class="nav-link" routerLink="/appointments">My appointments</a>
          <a class="nav-link" routerLink="/login">Log in</a>
        </nav>

        <!-- Right side: phone + CTA -->
        <div class="site-header-actions">
          <a class="phone-link" href="tel:+18149422290" aria-label="Call us at (814) 942-2290">
            (814) 942-2290
          </a>
          <a class="btn-book" routerLink="/book">Book a treatment</a>
        </div>

        <!-- Mobile menu toggle -->
        <button
          class="mobile-toggle"
          type="button"
          aria-label="Toggle menu"
          (click)="toggleMenu()"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            @if (menuOpen()) {
              <path d="M6 18L18 6M6 6l12 12"/>
            } @else {
              <path d="M3 12h18M3 6h18M3 18h18"/>
            }
          </svg>
        </button>
      </div>

      <!-- Mobile nav drawer -->
      @if (menuOpen()) {
        <div class="mobile-nav">
          <a class="mobile-nav-link" routerLink="/" fragment="services" (click)="closeMenu()">Services</a>
          <a class="mobile-nav-link" routerLink="/appointments" (click)="closeMenu()">My appointments</a>
          <a class="mobile-nav-link" routerLink="/login" (click)="closeMenu()">Log in</a>
          <a class="mobile-nav-link phone-link" href="tel:+18149422290">(814) 942-2290</a>
          <a class="btn-book mobile-book" routerLink="/book" (click)="closeMenu()">Book a treatment</a>
        </div>
      }
    </header>
  `,
  styles: [`
    :host {
      display: block;
      position: sticky;
      top: 0;
      z-index: 1000;
    }
    .site-header {
      background: var(--color-primary);
      color: #ffffff;
      box-shadow: var(--shadow-md);
    }
    .site-header-inner {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1.5rem;
      height: 64px;
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }
    .brand-logo {
      font-family: var(--font-display);
      font-weight: 700;
      font-size: 1.1rem;
      color: #ffffff;
      text-decoration: none;
      white-space: nowrap;
      flex-shrink: 0;
    }
    .site-nav {
      display: flex;
      align-items: center;
      gap: 1.25rem;
      flex: 1;
    }
    .nav-link {
      color: rgba(255, 255, 255, 0.85);
      text-decoration: none;
      font-size: var(--font-size-sm, 0.875rem);
      font-weight: 500;
      transition: color 120ms;
    }
    .nav-link:hover {
      color: #ffffff;
    }
    .site-header-actions {
      display: flex;
      align-items: center;
      gap: 1rem;
      flex-shrink: 0;
    }
    .phone-link {
      color: rgba(255, 255, 255, 0.85);
      text-decoration: none;
      font-size: var(--font-size-sm, 0.875rem);
      font-weight: 500;
      white-space: nowrap;
    }
    .phone-link:hover { color: #ffffff; }
    .btn-book {
      display: inline-flex;
      align-items: center;
      padding: 0.5rem 1.25rem;
      background: var(--color-cta);
      color: #ffffff;
      border-radius: var(--radius-btn, 8px);
      font-weight: 600;
      font-size: var(--font-size-sm, 0.875rem);
      text-decoration: none;
      white-space: nowrap;
      transition: background 150ms;
    }
    .btn-book:hover { background: var(--color-cta-hover); }
    .mobile-toggle {
      display: none;
      background: none;
      border: none;
      color: #ffffff;
      cursor: pointer;
      padding: 0.25rem;
      margin-left: auto;
    }
    .mobile-nav {
      display: none;
      flex-direction: column;
      padding: 1rem 1.5rem;
      gap: 0.75rem;
      border-top: 1px solid rgba(255,255,255,0.12);
    }
    .mobile-nav-link {
      color: rgba(255, 255, 255, 0.9);
      text-decoration: none;
      font-size: 1rem;
      padding: 0.25rem 0;
    }
    .mobile-nav-link:hover { color: #ffffff; }
    .mobile-book {
      margin-top: 0.5rem;
      align-self: flex-start;
    }
    @media (max-width: 768px) {
      .site-nav, .site-header-actions { display: none; }
      .mobile-toggle { display: flex; }
      .mobile-nav { display: flex; }
    }
  `],
})
export class SiteHeaderComponent {
  readonly menuOpen = signal(false);

  toggleMenu(): void {
    this.menuOpen.update(v => !v);
  }

  closeMenu(): void {
    this.menuOpen.set(false);
  }
}
