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

        <!-- Desktop nav -->
        <nav class="nav-desktop" aria-label="Main navigation">
          <a routerLink="/" [fragment]="'services'" class="nav-link">Services</a>
          <a routerLink="/book" class="nav-link">Book</a>
          <a routerLink="/appointments" class="nav-link">My appointments</a>
          <a routerLink="/login" class="nav-link">Log in</a>
        </nav>

        <!-- Right: phone + CTA -->
        <div class="header-right">
          <a href="tel:+18149422290" class="phone-link">(814) 942-2290</a>
          <a routerLink="/book" class="btn-primary header-cta">Book a treatment</a>
        </div>

        <!-- Mobile hamburger -->
        <button
          class="hamburger"
          aria-label="Toggle navigation"
          (click)="toggleMenu()"
          [attr.aria-expanded]="menuOpen()"
        >
          @if (menuOpen()) {
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M6 18L18 6M6 6l12 12"/>
            </svg>
          } @else {
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 12h18M3 6h18M3 18h18"/>
            </svg>
          }
        </button>
      </div>

      <!-- Mobile nav drawer -->
      @if (menuOpen()) {
        <nav class="nav-mobile" aria-label="Mobile navigation">
          <a routerLink="/" [fragment]="'services'" class="mobile-link" (click)="closeMenu()">Services</a>
          <a routerLink="/book" class="mobile-link" (click)="closeMenu()">Book</a>
          <a routerLink="/appointments" class="mobile-link" (click)="closeMenu()">My appointments</a>
          <a routerLink="/login" class="mobile-link" (click)="closeMenu()">Log in</a>
          <a href="tel:+18149422290" class="mobile-link mobile-phone">(814) 942-2290</a>
          <a routerLink="/book" class="btn-primary mobile-cta" (click)="closeMenu()">Book a treatment</a>
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
      box-shadow: 0 2px 8px rgba(0,0,0,0.18);
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
      font-size: var(--font-size-lg);
      font-weight: 700;
      color: var(--color-on-primary);
      text-decoration: none;
      white-space: nowrap;
      flex-shrink: 0;
    }
    .brand:hover { opacity: 0.9; }

    .nav-desktop {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      flex: 1;
    }
    .nav-link {
      padding: 0.5rem 0.75rem;
      color: var(--color-on-primary-muted);
      font-size: var(--font-size-sm);
      font-weight: 500;
      border-radius: var(--radius-sm);
      transition: color 0.15s, background 0.15s;
      text-decoration: none;
    }
    .nav-link:hover {
      color: var(--color-on-primary);
      background: rgba(255,255,255,0.1);
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: 1rem;
      flex-shrink: 0;
    }
    .phone-link {
      color: var(--color-on-primary-soft);
      font-size: var(--font-size-sm);
      font-weight: 600;
      text-decoration: none;
      white-space: nowrap;
    }
    .phone-link:hover { color: var(--color-on-primary); }
    .header-cta {
      padding: 0.5rem 1.125rem;
      font-size: var(--font-size-sm);
    }

    .hamburger {
      display: none;
      background: none;
      border: none;
      color: var(--color-on-primary);
      cursor: pointer;
      padding: 0.25rem;
      margin-left: auto;
      border-radius: var(--radius-sm);
    }
    .hamburger:hover { background: rgba(255,255,255,0.1); }

    /* Mobile nav */
    .nav-mobile {
      display: flex;
      flex-direction: column;
      background: var(--color-primary);
      border-top: 1px solid rgba(255,255,255,0.12);
      padding: 0.75rem 1.5rem 1.25rem;
      gap: 0.25rem;
    }
    .mobile-link {
      padding: 0.625rem 0.5rem;
      color: var(--color-on-primary-muted);
      font-size: var(--font-size-md);
      font-weight: 500;
      text-decoration: none;
      border-radius: var(--radius-sm);
    }
    .mobile-link:hover {
      color: var(--color-on-primary);
      background: rgba(255,255,255,0.08);
    }
    .mobile-phone { font-weight: 600; color: var(--color-on-primary-soft); }
    .mobile-cta {
      margin-top: 0.5rem;
      align-self: flex-start;
    }

    @media (max-width: 768px) {
      .nav-desktop { display: none; }
      .header-right { display: none; }
      .hamburger { display: flex; align-items: center; justify-content: center; }
    }
  `],
})
export class SiteHeaderComponent {
  menuOpen = signal(false);
  toggleMenu() { this.menuOpen.update(v => !v); }
  closeMenu() { this.menuOpen.set(false); }
}
