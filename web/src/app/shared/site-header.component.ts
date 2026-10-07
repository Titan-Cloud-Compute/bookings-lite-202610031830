import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-site-header',
  standalone: true,
  imports: [RouterLink],
  template: `
    <header class="site-header">
      <div class="header-inner">
        <a routerLink="/" class="header-brand">Ferguson Pest Control</a>

        <nav class="header-nav" aria-label="Main navigation">
          <a routerLink="/" fragment="services" class="nav-link">Services</a>
          <a routerLink="/book" class="nav-link">Book</a>
          <a routerLink="/appointments" class="nav-link">My appointments</a>
          <a routerLink="/login" class="nav-link">Log in</a>
        </nav>

        <div class="header-actions">
          <a href="tel:+18149422290" class="header-phone">(814) 942-2290</a>
          <a routerLink="/book" class="btn-book-cta">Book a treatment</a>
        </div>

        <button
          class="mobile-menu-btn"
          (click)="toggleMenu()"
          [attr.aria-expanded]="menuOpen"
          aria-label="Toggle navigation"
          type="button"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            @if (menuOpen) {
              <path d="M6 18L18 6M6 6l12 12"/>
            } @else {
              <path d="M3 12h18M3 6h18M3 18h18"/>
            }
          </svg>
        </button>
      </div>

      @if (menuOpen) {
        <nav class="mobile-nav" aria-label="Mobile navigation">
          <a routerLink="/" fragment="services" class="mobile-nav-link" (click)="closeMenu()">Services</a>
          <a routerLink="/book" class="mobile-nav-link" (click)="closeMenu()">Book</a>
          <a routerLink="/appointments" class="mobile-nav-link" (click)="closeMenu()">My appointments</a>
          <a routerLink="/login" class="mobile-nav-link" (click)="closeMenu()">Log in</a>
          <a href="tel:+18149422290" class="mobile-nav-link mobile-phone">(814) 942-2290</a>
          <a routerLink="/book" class="btn-book-cta mobile-cta" (click)="closeMenu()">Book a treatment</a>
        </nav>
      }
    </header>
  `,
  styles: [`
    .site-header {
      position: sticky;
      top: 0;
      z-index: 100;
      background: var(--color-primary);
      color: var(--color-on-primary);
      box-shadow: var(--shadow-nav);
    }

    .header-inner {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1.25rem;
      height: 64px;
    }

    .header-brand {
      font-size: 1.125rem;
      font-weight: 700;
      color: var(--color-on-primary);
      text-decoration: none;
      white-space: nowrap;
      flex-shrink: 0;
    }

    .header-nav {
      display: flex;
      align-items: center;
      gap: 1.25rem;
      flex: 1;
    }

    .nav-link {
      color: var(--color-on-primary-soft);
      font-size: var(--font-size-sm);
      font-weight: 500;
      text-decoration: none;
      white-space: nowrap;
      transition: color 0.12s ease;
    }

    .nav-link:hover {
      color: var(--color-on-primary);
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 1rem;
      flex-shrink: 0;
    }

    .header-phone {
      color: var(--color-on-primary-soft);
      font-size: var(--font-size-sm);
      font-weight: 500;
      text-decoration: none;
      white-space: nowrap;
      transition: color 0.12s ease;
    }

    .header-phone:hover {
      color: var(--color-on-primary);
    }

    .btn-book-cta {
      display: inline-flex;
      align-items: center;
      padding: 0.5rem 1.25rem;
      background: var(--color-cta);
      color: var(--color-on-primary);
      border-radius: var(--radius-btn);
      font-size: var(--font-size-sm);
      font-weight: 600;
      text-decoration: none;
      white-space: nowrap;
      transition: background 0.15s ease;
    }

    .btn-book-cta:hover {
      background: var(--color-cta-hover);
    }

    .mobile-menu-btn {
      display: none;
      background: none;
      border: none;
      color: var(--color-on-primary);
      cursor: pointer;
      padding: 0.25rem;
      margin-left: auto;
    }

    .mobile-nav {
      display: none;
      flex-direction: column;
      gap: 0;
      background: var(--color-primary);
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      padding: 0.5rem 0 1rem;
    }

    .mobile-nav-link {
      display: block;
      padding: 0.75rem 1.25rem;
      color: var(--color-on-primary-soft);
      font-size: var(--font-size-sm);
      font-weight: 500;
      text-decoration: none;
    }

    .mobile-nav-link:hover {
      color: var(--color-on-primary);
    }

    .mobile-cta {
      margin: 0.5rem 1.25rem 0;
      text-align: center;
      justify-content: center;
    }

    @media (max-width: 768px) {
      .header-nav,
      .header-phone {
        display: none;
      }

      .mobile-menu-btn {
        display: block;
      }

      .btn-book-cta:not(.mobile-cta) {
        display: none;
      }

      .mobile-nav {
        display: flex;
      }
    }
  `],
})
export class SiteHeaderComponent {
  menuOpen = false;

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu(): void {
    this.menuOpen = false;
  }
}
