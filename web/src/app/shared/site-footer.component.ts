import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-site-footer',
  standalone: true,
  imports: [RouterLink],
  template: `
    <footer class="site-footer">
      <div class="site-footer-inner">
        <div class="footer-brand">
          <span class="footer-name">Ferguson Pest Control</span>
          <a class="footer-phone" href="tel:+18149422290">(814) 942-2290</a>
        </div>
        <nav class="footer-nav" aria-label="Footer navigation">
          <a routerLink="/terms">Terms</a>
          <a routerLink="/privacy">Privacy</a>
          <a routerLink="/about">About</a>
        </nav>
        <p class="footer-copy">&copy; {{ year }} Ferguson Pest Control. All rights reserved.</p>
      </div>
    </footer>
  `,
  styles: [`
    .site-footer {
      background: var(--color-primary);
      color: rgba(255, 255, 255, 0.75);
      padding: 2rem 1.5rem;
    }
    .site-footer-inner {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      flex-wrap: wrap;
      gap: 1.5rem;
      align-items: center;
      justify-content: space-between;
    }
    .footer-brand {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }
    .footer-name {
      font-weight: 700;
      color: #ffffff;
      font-family: var(--font-display);
    }
    .footer-phone {
      color: rgba(255, 255, 255, 0.8);
      text-decoration: none;
      font-size: var(--font-size-sm, 0.875rem);
    }
    .footer-phone:hover { color: #ffffff; }
    .footer-nav {
      display: flex;
      gap: 1.5rem;
    }
    .footer-nav a {
      color: rgba(255, 255, 255, 0.75);
      text-decoration: none;
      font-size: var(--font-size-sm, 0.875rem);
    }
    .footer-nav a:hover { color: #ffffff; }
    .footer-copy {
      width: 100%;
      margin: 0;
      font-size: var(--font-size-xs, 0.75rem);
      text-align: center;
      color: rgba(255, 255, 255, 0.5);
    }
  `],
})
export class SiteFooterComponent {
  readonly year = new Date().getFullYear();
}
