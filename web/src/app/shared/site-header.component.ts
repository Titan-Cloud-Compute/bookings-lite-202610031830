import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-site-header',
  standalone: true,
  imports: [RouterLink],
  template: `
    <header class="site-header">
      <div class="site-header-inner">
        <a routerLink="/" class="site-logo">Ferguson Pest Control</a>
        <nav class="site-nav">
          <a routerLink="/" fragment="services" class="nav-link">Services</a>
          <a routerLink="/book" class="nav-link">Book</a>
          <a routerLink="/appointments" class="nav-link">My appointments</a>
          <a routerLink="/login" class="nav-link">Log in</a>
        </nav>
        <div class="site-header-actions">
          <a href="tel:+18149422290" class="site-phone">(814) 942-2290</a>
          <a routerLink="/book" class="btn-cta-header">Book a treatment</a>
        </div>
      </div>
    </header>
  `,
  styles: [`
    :host {
      display: block;
      position: sticky;
      top: 0;
      z-index: 100;
    }
    .site-header {
      background: var(--color-primary);
      color: #fff;
      box-shadow: 0 2px 8px rgba(0,0,0,0.15);
    }
    .site-header-inner {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1.5rem;
      height: 64px;
      display: flex;
      align-items: center;
      gap: 2rem;
    }
    .site-logo {
      color: #fff;
      text-decoration: none;
      font-size: 1.125rem;
      font-weight: 700;
      white-space: nowrap;
      flex-shrink: 0;
    }
    .site-nav {
      display: flex;
      gap: 1.5rem;
      flex: 1;
    }
    .nav-link {
      color: rgba(255,255,255,0.85);
      text-decoration: none;
      font-size: 0.9375rem;
      font-weight: 500;
      transition: color 0.15s;
    }
    .nav-link:hover {
      color: #fff;
    }
    .site-header-actions {
      display: flex;
      align-items: center;
      gap: 1rem;
      flex-shrink: 0;
    }
    .site-phone {
      color: rgba(255,255,255,0.9);
      text-decoration: none;
      font-size: 0.9375rem;
      font-weight: 500;
      white-space: nowrap;
    }
    .site-phone:hover {
      color: #fff;
    }
    .btn-cta-header {
      display: inline-flex;
      align-items: center;
      padding: 0.5rem 1.25rem;
      background: var(--color-cta);
      color: #fff;
      border-radius: var(--radius-btn);
      font-weight: 600;
      font-size: 0.9375rem;
      text-decoration: none;
      white-space: nowrap;
      transition: background 0.15s;
    }
    .btn-cta-header:hover {
      background: var(--color-cta-hover);
    }
    @media (max-width: 768px) {
      .site-nav { display: none; }
      .site-header-actions { gap: 0.75rem; }
      .site-phone { display: none; }
    }
  `]
})
export class SiteHeaderComponent {}
