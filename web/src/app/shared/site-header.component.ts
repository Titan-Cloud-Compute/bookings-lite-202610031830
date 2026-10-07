import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-site-header',
  standalone: true,
  imports: [RouterLink],
  template: `
    <header class="site-header">
      <div class="header-inner">
        <!-- Brand -->
        <a routerLink="/" class="brand">Ferguson Pest Control</a>

        <!-- Desktop Nav -->
        <nav class="desktop-nav" aria-label="Main navigation">
          <a routerLink="/" fragment="services" class="nav-link">Services</a>
          <a routerLink="/book" class="nav-link">Book</a>
          <a routerLink="/appointments" class="nav-link">My appointments</a>
          <a routerLink="/login" class="nav-link">Log in</a>
        </nav>

        <!-- Right: phone + CTA -->
        <div class="header-right">
          <a href="tel:+18149422290" class="phone-link">(814) 942-2290</a>
          <a routerLink="/book" class="btn-book-cta">Book a treatment</a>
        </div>

        <!-- Mobile hamburger -->
        <button class="hamburger" (click)="toggleMenu()" aria-label="Toggle navigation">
          @if (menuOpen()) {
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M6 18L18 6M6 6l12 12"/>
            </svg>
          } @else {
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 12h18M3 6h18M3 18h18"/>
            </svg>
          }
        </button>
      </div>

      <!-- Mobile menu drawer -->
      @if (menuOpen()) {
        <nav class="mobile-nav" aria-label="Mobile navigation">
          <a routerLink="/" fragment="services" class="mobile-nav-link" (click)="closeMenu()">Services</a>
          <a routerLink="/book" class="mobile-nav-link" (click)="closeMenu()">Book</a>
          <a routerLink="/appointments" class="mobile-nav-link" (click)="closeMenu()">My appointments</a>
          <a routerLink="/login" class="mobile-nav-link" (click)="closeMenu()">Log in</a>
          <a href="tel:+18149422290" class="mobile-nav-link phone-mobile">(814) 942-2290</a>
          <a routerLink="/book" class="mobile-book-btn" (click)="closeMenu()">Book a treatment</a>
        </nav>
      }
    </header>
  `,
  styles: [`
    .site-header {
      position: sticky;
      top: 0;
      z-index: 200;
      background: var(--color-primary);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
    }

    .header-inner {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1.5rem;
      height: 64px;
    }

    .brand {
      font-family: var(--font-display);
      font-size: 1.1rem;
      font-weight: 700;
      color: #ffffff;
      text-decoration: none;
      white-space: nowrap;
      flex-shrink: 0;
    }

    .desktop-nav {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      flex: 1;
    }

    .nav-link {
      color: rgba(255, 255, 255, 0.85);
      font-size: var(--font-size-sm, 0.875rem);
      font-weight: 500;
      padding: 0.4rem 0.75rem;
      border-radius: var(--radius-sm, 6px);
      text-decoration: none;
      transition: color 0.15s, background 0.15s;
    }

    .nav-link:hover {
      color: #ffffff;
      background: rgba(255, 255, 255, 0.1);
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: 1rem;
      flex-shrink: 0;
      margin-left: auto;
    }

    .phone-link {
      color: rgba(255, 255, 255, 0.9);
      font-size: var(--font-size-sm, 0.875rem);
      font-weight: 500;
      text-decoration: none;
      white-space: nowrap;
    }

    .phone-link:hover {
      color: #ffffff;
      text-decoration: underline;
    }

    .btn-book-cta {
      display: inline-flex;
      align-items: center;
      padding: 0.5rem 1.25rem;
      background: var(--color-cta);
      color: #ffffff;
      border-radius: var(--radius-btn, 8px);
      font-size: var(--font-size-sm, 0.875rem);
      font-weight: 600;
      text-decoration: none;
      white-space: nowrap;
      transition: background 0.15s ease;
    }

    .btn-book-cta:hover {
      background: var(--color-cta-hover);
    }

    .hamburger {
      display: none;
      background: none;
      border: none;
      color: #ffffff;
      cursor: pointer;
      padding: 0.4rem;
      border-radius: var(--radius-sm, 6px);
      margin-left: auto;
    }

    .hamburger:hover {
      background: rgba(255, 255, 255, 0.1);
    }

    /* Mobile nav drawer */
    .mobile-nav {
      display: flex;
      flex-direction: column;
      padding: 0.75rem 1.5rem 1rem;
      border-top: 1px solid rgba(255, 255, 255, 0.12);
      gap: 0.1rem;
    }

    .mobile-nav-link {
      color: rgba(255, 255, 255, 0.85);
      font-size: var(--font-size-md, 0.9375rem);
      font-weight: 500;
      padding: 0.65rem 0.5rem;
      text-decoration: none;
      border-radius: var(--radius-sm, 6px);
      transition: background 0.15s;
    }

    .mobile-nav-link:hover {
      background: rgba(255, 255, 255, 0.1);
      color: #ffffff;
    }

    .phone-mobile {
      font-weight: 600;
    }

    .mobile-book-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      margin-top: 0.5rem;
      padding: 0.75rem 1.5rem;
      background: var(--color-cta);
      color: #ffffff;
      border-radius: var(--radius-btn, 8px);
      font-size: var(--font-size-sm, 0.875rem);
      font-weight: 600;
      text-decoration: none;
      transition: background 0.15s ease;
    }

    .mobile-book-btn:hover {
      background: var(--color-cta-hover);
    }

    @media (max-width: 768px) {
      .desktop-nav { display: none; }
      .header-right { display: none; }
      .hamburger { display: flex; align-items: center; justify-content: center; }
    }
  `],
})
export class SiteHeaderComponent {
  readonly menuOpen = signal(false);

  toggleMenu() { this.menuOpen.update(v => !v); }
  closeMenu() { this.menuOpen.set(false); }
}
