import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
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

    <!-- Hero -->
    <section class="hero">
      <div class="hero-inner">
        <h1 class="hero-heading">Pest-free homes, booked in minutes</h1>
        <p class="hero-sub">Pick a treatment, choose a time that suits you, and a licensed local technician will be there.</p>
        <a routerLink="/book" class="btn-hero">Book a treatment</a>

        <!-- Badges -->
        <ul class="badge-row">
          <li class="badge">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            Licensed &amp; insured
          </li>
          <li class="badge">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            Same-week appointments
          </li>
          <li class="badge">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
            Reminders before every visit
          </li>
          <li class="badge">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            Satisfaction guaranteed
          </li>
        </ul>
      </div>
    </section>

    <!-- Services section -->
    <section class="services-section" id="services">
      <div class="section-inner">
        <h2 class="section-heading">Our services</h2>
        <p class="section-sub">Choose the treatment that's right for your home.</p>

        @if (loadingServices()) {
          <p class="state-msg">Loading services…</p>
        } @else if (servicesError()) {
          <p class="state-msg state-error">Unable to load services right now. Please call us at <a href="tel:+18149422290">(814) 942-2290</a>.</p>
        } @else if (services().length === 0) {
          <p class="state-msg">No services available at the moment. Please call us at <a href="tel:+18149422290">(814) 942-2290</a>.</p>
        } @else {
          <div class="services-grid">
            @for (svc of services(); track svc.id) {
              <app-service-card
                [name]="svc.name"
                [durationMinutes]="svc.durationMinutes"
                [priceCents]="svc.priceCents"
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
        <h2 class="section-heading">How it works</h2>
        <ol class="steps">
          <li class="step">
            <span class="step-num">1</span>
            <div>
              <h3 class="step-title">Choose a treatment</h3>
              <p class="step-desc">Browse our services and pick the one that fits your pest problem.</p>
            </div>
          </li>
          <li class="step">
            <span class="step-num">2</span>
            <div>
              <h3 class="step-title">Pick a time</h3>
              <p class="step-desc">Select a time that works for you — same-week slots available.</p>
            </div>
          </li>
          <li class="step">
            <span class="step-num">3</span>
            <div>
              <h3 class="step-title">We arrive</h3>
              <p class="step-desc">A licensed local technician arrives on time and gets the job done.</p>
            </div>
          </li>
        </ol>
      </div>
    </section>

    <!-- CTA band -->
    <section class="cta-band">
      <div class="section-inner cta-inner">
        <h2 class="cta-heading">Ready to reclaim your home?</h2>
        <a routerLink="/book" class="btn-cta-band">Book a treatment</a>
      </div>
    </section>

    <app-site-footer />
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
    }

    /* ── Hero ────────────────────────────────────────────────────────────── */
    .hero {
      background: var(--color-primary);
      color: #ffffff;
      padding: 5rem 1.5rem 4rem;
    }

    .hero-inner {
      max-width: 720px;
      margin: 0 auto;
      text-align: center;
    }

    .hero-heading {
      font-family: var(--font-display);
      font-size: clamp(2rem, 5vw, 3rem);
      font-weight: 800;
      color: #ffffff;
      line-height: 1.15;
      margin: 0 0 1rem;
    }

    .hero-sub {
      font-size: var(--font-size-lg, 1.125rem);
      color: rgba(255, 255, 255, 0.85);
      margin: 0 0 2rem;
      line-height: 1.6;
    }

    .btn-hero {
      display: inline-flex;
      align-items: center;
      padding: 0.875rem 2.25rem;
      background: var(--color-cta);
      color: #ffffff;
      border-radius: var(--radius-btn, 8px);
      font-size: 1rem;
      font-weight: 700;
      text-decoration: none;
      transition: background 0.15s ease;
      margin-bottom: 2.5rem;
    }

    .btn-hero:hover {
      background: var(--color-cta-hover);
    }

    .badge-row {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 0.75rem 1.5rem;
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .badge {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      font-size: var(--font-size-sm, 0.875rem);
      color: rgba(255, 255, 255, 0.8);
      font-weight: 500;
    }

    /* ── Shared section styles ───────────────────────────────────────────── */
    .section-inner {
      max-width: 1100px;
      margin: 0 auto;
      padding: 0 1.5rem;
    }

    .section-heading {
      font-family: var(--font-display);
      font-size: clamp(1.5rem, 3vw, 2rem);
      font-weight: 700;
      color: var(--color-text-primary);
      margin: 0 0 0.5rem;
      text-align: center;
    }

    .section-sub {
      text-align: center;
      color: var(--color-text-secondary);
      margin: 0 0 2.5rem;
      font-size: var(--font-size-md, 0.9375rem);
    }

    /* ── Services ────────────────────────────────────────────────────────── */
    .services-section {
      padding: 4rem 0;
      background: var(--color-bg-secondary);
    }

    .services-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.25rem;
    }

    .state-msg {
      text-align: center;
      color: var(--color-text-secondary);
      font-size: var(--font-size-md, 0.9375rem);
      padding: 2rem;
    }

    .state-error { color: var(--color-error); }
    .state-msg a { color: var(--color-primary); text-decoration: underline; }

    /* ── How it works ────────────────────────────────────────────────────── */
    .how-section {
      padding: 4rem 0;
      background: var(--color-bg-primary);
    }

    .steps {
      display: flex;
      flex-direction: column;
      gap: 2rem;
      max-width: 600px;
      margin: 0 auto;
      list-style: none;
      padding: 0;
    }

    .step {
      display: flex;
      gap: 1.25rem;
      align-items: flex-start;
    }

    .step-num {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: var(--color-primary);
      color: #ffffff;
      font-weight: 700;
      font-size: 1rem;
      flex-shrink: 0;
    }

    .step-title {
      font-size: var(--font-size-lg, 1.125rem);
      font-weight: 600;
      color: var(--color-text-primary);
      margin: 0 0 0.25rem;
    }

    .step-desc {
      color: var(--color-text-secondary);
      font-size: var(--font-size-sm, 0.875rem);
      margin: 0;
    }

    /* ── CTA band ────────────────────────────────────────────────────────── */
    .cta-band {
      padding: 4rem 1.5rem;
      background: var(--color-primary);
    }

    .cta-inner {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1.5rem;
      text-align: center;
    }

    .cta-heading {
      font-family: var(--font-display);
      font-size: clamp(1.5rem, 3vw, 2rem);
      font-weight: 700;
      color: #ffffff;
      margin: 0;
    }

    .btn-cta-band {
      display: inline-flex;
      align-items: center;
      padding: 0.875rem 2.25rem;
      background: var(--color-cta);
      color: #ffffff;
      border-radius: var(--radius-btn, 8px);
      font-size: 1rem;
      font-weight: 700;
      text-decoration: none;
      transition: background 0.15s ease;
    }

    .btn-cta-band:hover {
      background: var(--color-cta-hover);
    }

    @media (max-width: 600px) {
      .services-grid { grid-template-columns: 1fr; }
    }
  `],
})
export class LandingComponent implements OnInit {
  private readonly http = inject(HttpClient);

  readonly services = signal<PublicService[]>([]);
  readonly loadingServices = signal(true);
  readonly servicesError = signal(false);

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
      this.servicesError.set(true);
    } finally {
      this.loadingServices.set(false);
    }
  }
}
