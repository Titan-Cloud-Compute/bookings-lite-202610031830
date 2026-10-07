import { Component } from '@angular/core';

@Component({
  selector: 'app-site-footer',
  standalone: true,
  template: `
    <footer class="site-footer">
      <div class="site-footer-inner">
        <span class="footer-brand">Ferguson Pest Control</span>
        <a href="tel:+18149422290" class="footer-phone">(814) 942-2290</a>
        <span class="footer-copy">&copy; {{ year }} Ferguson Pest Control. All rights reserved.</span>
      </div>
    </footer>
  `,
  styles: [`
    .site-footer {
      background: var(--color-primary);
      color: rgba(255,255,255,0.8);
      padding: 1.5rem 1.5rem;
    }
    .site-footer-inner {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      gap: 1.5rem;
      flex-wrap: wrap;
    }
    .footer-brand {
      font-weight: 700;
      color: #fff;
    }
    .footer-phone {
      color: rgba(255,255,255,0.9);
      text-decoration: none;
    }
    .footer-phone:hover { color: #fff; }
    .footer-copy {
      margin-left: auto;
      font-size: 0.875rem;
    }
  `]
})
export class SiteFooterComponent {
  readonly year = new Date().getFullYear();
}
