import { Component, OnInit, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { SiteHeaderComponent } from '../shared/site-header.component';
import { SiteFooterComponent } from '../shared/site-footer.component';
import { ServiceCardComponent } from '../shared/service-card.component';

interface PublicService {
  id: string;
  name: string;
  durationMinutes: number;
  priceCents: number;
}

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterLink, SiteHeaderComponent, SiteFooterComponent, ServiceCardComponent],
  template: `
    <app-site-header />

    <main class="landing-main">
      <!-- Hero -->
      <section class="hero">
        <div class="hero-inner">
          <h1 class="hero-title">Pest-free homes, booked in minutes</h1>
          <p class="hero-subtitle">
            Pick a treatment, choose a time that suits you, and a licensed local technician will be there.
          </p>
          <a routerLink="/book" class="btn-primary hero-cta">Book a treatment</a>
          <ul class="badge-row">
            <li class="badge">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              Licensed &amp; insured
            </li>
            <li class="badge">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
              Same-week appointments
            </li>
            <li class="badge">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
              Reminders before every visit
            </li>
            <li class="badge">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              Satisfaction guaranteed
            </li>
          </ul>
        </div>
      </section>

      <!-- Services -->
      <section id="services" class="services-section">
        <div class="section-inner">
          <h2 class="section-title">Our services</h2>
          <p class="section-sub">Professional treatments for every common household pest.</p>
          @if (loadingServices()) {
            <div class="services-loading">Loading services…</div>
          } @else if (servicesError()) {
            <p class="services-error">{{ servicesError() }}</p>
          } @else if (services().length === 0) {
            <p class="services-empty">No services available right now. Please check back soon or call us at <a href="tel:+18149422290">(814) 942-2290</a>.</p>
          } @else {
            <div class="services-grid">
              @for (s of services(); track s.id) {
                <app-service-card
                  [name]="s.name"
                  [durationMinutes]="s.durationMinutes"
                  [priceCents]="s.priceCents"
                  [showBook]="true"
                />
              }
            </div>
          }
        </div>
      </section>

      <!-- How it works -->
      <section class="how-section">
        <div class="section-inner">
          <h2 class="section-title">How it works</h2>
          <ol class="steps">
            <li class="step">
              <div class="step-num">1</div>
              <div class="step-body">
                <h3>Choose a treatment</h3>
                <p>Select from our range of professional pest-control services.</p>
              </div>
            </li>
            <li class="step">
              <div class="step-num">2</div>
              <div class="step-body">
                <h3>Pick a time</h3>
                <p>Browse available slots and book the time that works for you.</p>
              </div>
            </li>
            <li class="step">
              <div class="step-num">3</div>
              <div class="step-body">
                <h3>We arrive</h3>
                <p>A licensed local technician shows up on time and gets to work.</p>
              </div>
            </li>
          </ol>
        </div>
      </section>

      <!-- CTA band -->
      <section class="cta-band">
        <div class="cta-inner">
          <h2>Ready for a pest-free home?</h2>
          <a routerLink="/book" class="btn-primary">Book a treatment</a>
        </div>
      </section>
    </main>

    <app-site-footer />
  `,
  styles: [`
    .landing-main {
      background: var(--color-bg-primary);
    }
    /* Hero */
    .hero {
      background: var(--color-primary);
      color: var(--color-on-primary);
      padding: 5rem 1.5rem 4rem;
      text-align: center;
    }
    .hero-inner {
      max-width: 720px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1.25rem;
    }
    .hero-title {
      font-family: var(--font-display);
      font-size: clamp(2rem, 5vw, 3rem);
      font-weight: 800;
      color: var(--color-on-primary);
      margin: 0;
      line-height: 1.15;
    }
    .hero-subtitle {
      font-size: var(--font-size-lg);
      color: var(--color-on-primary-soft);
      max-width: 560px;
      line-height: 1.6;
    }
    .hero-cta {
      font-size: var(--font-size-md);
      padding: 0.875rem 2rem;
    }
    .badge-row {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 0.75rem;
      margin-top: 0.5rem;
    }
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 0.375rem;
      background: rgba(255,255,255,0.1);
      border: 1px solid rgba(255,255,255,0.18);
      border-radius: var(--radius-pill);
      padding: 0.375rem 0.875rem;
      font-size: var(--font-size-sm);
      color: var(--color-on-primary-soft);
      white-space: nowrap;
    }
    /* Services */
    .services-section {
      padding: 4rem 1.5rem;
      background: var(--color-bg-secondary);
    }
    .section-inner {
      max-width: 1200px;
      margin: 0 auto;
    }
    .section-title {
      font-family: var(--font-display);
      font-size: var(--font-size-2xl);
      font-weight: 700;
      color: var(--color-text-primary);
      margin: 0 0 0.5rem;
      text-align: center;
    }
    .section-sub {
      text-align: center;
      color: var(--color-text-secondary);
      margin-bottom: 2.5rem;
    }
    .services-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
      gap: 1.5rem;
    }
    .services-loading,
    .services-empty {
      text-align: center;
      color: var(--color-text-secondary);
      padding: 3rem;
    }
    .services-empty a {
      color: var(--color-primary);
      text-decoration: underline;
    }
    .services-error {
      text-align: center;
      color: var(--color-error);
      padding: 3rem;
    }
    /* How it works */
    .how-section {
      padding: 4rem 1.5rem;
      background: var(--color-bg-primary);
    }
    .steps {
      display: flex;
      flex-wrap: wrap;
      gap: 2rem;
      list-style: none;
      padding: 0;
      margin: 2rem 0 0;
      justify-content: center;
    }
    .step {
      display: flex;
      align-items: flex-start;
      gap: 1rem;
      max-width: 300px;
      flex: 1 1 240px;
    }
    .step-num {
      width: 40px;
      height: 40px;
      border-radius: var(--radius-circle);
      background: var(--color-primary);
      color: var(--color-on-primary);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: var(--font-size-lg);
      font-weight: 700;
      flex-shrink: 0;
    }
    .step-body h3 {
      font-size: var(--font-size-lg);
      font-weight: 600;
      color: var(--color-text-primary);
      margin: 0 0 0.25rem;
    }
    .step-body p {
      color: var(--color-text-secondary);
      font-size: var(--font-size-sm);
      line-height: 1.55;
    }
    /* CTA band */
    .cta-band {
      background: var(--color-primary);
      padding: 3.5rem 1.5rem;
    }
    .cta-inner {
      max-width: 600px;
      margin: 0 auto;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1.5rem;
    }
    .cta-inner h2 {
      font-family: var(--font-display);
      font-size: var(--font-size-2xl);
      color: var(--color-on-primary);
      margin: 0;
    }
  `],
})
export class LandingComponent implements OnInit {
  private readonly http = inject(HttpClient);

  readonly services = signal<PublicService[]>([]);
  readonly loadingServices = signal(true);
  readonly servicesError = signal<string | null>(null);

  ngOnInit(): void {
    void this.loadServices();
  }

  async loadServices(): Promise<void> {
    try {
      const rows = await firstValueFrom(
        this.http.get<PublicService[]>('api/services', { withCredentials: true }),
      );
      this.services.set(Array.isArray(rows) ? rows : []);
    } catch {
      this.servicesError.set('Could not load services. Please try again later.');
    } finally {
      this.loadingServices.set(false);
    }
  }
}
