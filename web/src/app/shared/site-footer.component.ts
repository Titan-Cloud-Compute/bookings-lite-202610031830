import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-site-footer',
  standalone: true,
  imports: [RouterLink],
  template: `
    <footer class="site-footer">
      <div class="footer-inner">
        <div class="footer-brand">
          <span class="brand-name">Ferguson Pest Control</span>
          <a href="tel:+18149422290" class="footer-phone">(814) 942-2290</a>
        </div>
        <nav class="footer-nav" aria-label="Footer navigation">
          <a routerLink="/" [fragment]="'services'" class="footer-link">Services</a>
          <a routerLink="/book" class="footer-link">Book</a>
          <a routerLink="/appointments" class="footer-link">My appointments</a>
          <a routerLink="/login" class="footer-link">Log in</a>
          <a routerLink="/terms" class="footer-link">Terms</a>
          <a routerLink="/privacy" class="footer-link">Privacy</a>
        </nav>
        <p class="footer-copy">&copy; {{ year }} Ferguson Pest Control. All rights reserved.</p>
      </div>
    </footer>
  `,
  styles: [`
    .site-footer {
      background: var(--color-primary);
      color: var(--color-on-primary-muted);
      padding: 2.5rem 1.5rem;
    }
    .footer-inner {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }
    .footer-brand {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      flex-wrap: wrap;
    }
    .brand-name {
      font-family: var(--font-display);
      font-size: var(--font-size-lg);
      font-weight: 700;
      color: var(--color-on-primary);
    }
    .footer-phone {
      color: var(--color-on-primary-soft);
      font-weight: 600;
      font-size: var(--font-size-sm);
      text-decoration: none;
    }
    .footer-phone:hover { color: var(--color-on-primary); }
    .footer-nav {
      display: flex;
      flex-wrap: wrap;
      gap: 0.25rem 1rem;
    }
    .footer-link {
      color: var(--color-on-primary-muted);
      font-size: var(--font-size-sm);
      text-decoration: none;
    }
    .footer-link:hover { color: var(--color-on-primary); }
    .footer-copy {
      font-size: var(--font-size-xs);
      color: var(--color-on-primary-faint);
    }
  `],
})
export class SiteFooterComponent {
  readonly year = new Date().getFullYear();
}
