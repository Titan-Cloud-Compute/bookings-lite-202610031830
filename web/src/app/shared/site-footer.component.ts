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
      color: var(--color-on-primary-soft);
    }

    .footer-inner {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem 1.25rem;
      text-align: center;
    }

    .footer-brand {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
    }

    .brand-name {
      font-weight: 700;
      font-size: 1rem;
      color: var(--color-on-primary);
    }

    .footer-phone {
      color: var(--color-on-primary-soft);
      font-size: var(--font-size-sm);
      text-decoration: none;
      transition: color 0.12s ease;
    }

    .footer-phone:hover {
      color: var(--color-on-primary);
    }

    .footer-nav {
      display: flex;
      gap: 1.5rem;
    }

    .footer-link {
      color: var(--color-on-primary-soft);
      font-size: var(--font-size-sm);
      text-decoration: none;
      transition: color 0.12s ease;
    }

    .footer-link:hover {
      color: var(--color-on-primary);
    }

    .footer-copy {
      font-size: var(--font-size-xs);
      color: var(--color-on-primary-muted);
      margin: 0;
    }
  `],
})
export class SiteFooterComponent {
  readonly year = new Date().getFullYear();
}
