import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-site-footer',
  standalone: true,
  imports: [RouterLink],
  template: `
    <footer class="site-footer">
      <div class="footer-inner">
        <span class="footer-brand">Ferguson Pest Control</span>
        <a href="tel:+18149422290" class="footer-phone">(814) 942-2290</a>
        <nav class="footer-nav" aria-label="Footer navigation">
          <a routerLink="/login" class="footer-link">Log in</a>
          <a routerLink="/privacy" class="footer-link">Privacy</a>
          <a routerLink="/terms" class="footer-link">Terms</a>
        </nav>
        <p class="footer-copy">&copy; {{ year }} Ferguson Pest Control. Licensed &amp; insured.</p>
      </div>
    </footer>
  `,
  styles: [`
    .site-footer {
      background: var(--color-primary);
      color: rgba(255, 255, 255, 0.75);
      padding: 2rem 1.5rem;
    }

    .footer-inner {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 1rem 2rem;
    }

    .footer-brand {
      font-family: var(--font-display);
      font-weight: 700;
      color: #ffffff;
      font-size: 1rem;
    }

    .footer-phone {
      color: rgba(255, 255, 255, 0.85);
      text-decoration: none;
      font-size: var(--font-size-sm, 0.875rem);
    }

    .footer-phone:hover { color: #ffffff; text-decoration: underline; }

    .footer-nav {
      display: flex;
      gap: 1rem;
      margin-left: auto;
    }

    .footer-link {
      color: rgba(255, 255, 255, 0.7);
      font-size: var(--font-size-sm, 0.875rem);
      text-decoration: none;
    }

    .footer-link:hover { color: #ffffff; }

    .footer-copy {
      width: 100%;
      font-size: var(--font-size-xs, 0.75rem);
      margin: 0;
      opacity: 0.6;
    }

    @media (max-width: 600px) {
      .footer-nav { margin-left: 0; }
    }
  `],
})
export class SiteFooterComponent {
  readonly year = new Date().getFullYear();
}
