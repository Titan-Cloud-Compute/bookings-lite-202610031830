import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { SiteHeaderComponent } from '../shared/site-header.component';
import { SiteFooterComponent } from '../shared/site-footer.component';
import { ServiceCardComponent } from '../shared/service-card.component';

export interface PublicService {
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
    <div class="landing-page">
      <app-site-header></app-site-header>

      <!-- Hero -->
      <section class="hero">
        <div class="hero-inner">
          <h1 class="hero-title">Pest-free homes, booked in minutes</h1>
          <p class="hero-sub">Pick a treatment, choose a time that suits you, and a licensed local technician will be there.</p>
          <a routerLink="/book" class="btn-hero">Book a treatment</a>
          <div class="badge-row">
            <span class="badge">
              <svg class="badge-icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/></svg>
              Licensed &amp; insured
            </span>
            <span class="badge">
              <svg class="badge-icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
              Same-week appointments
            </span>
            <span class="badge">
              <svg class="badge-icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
              Reminders before every visit
            </span>
            <span class="badge">
              <svg class="badge-icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
              Satisfaction guaranteed
            </span>
          </div>
        </div>
      </section>

      <!-- Services -->
      <section class="services-section" id="services">
        <div class="section-inner">
          <h2 class="section-title">Our treatments</h2>
          <p class="section-sub">Professional pest control services for your home.</p>

          @if (loadError()) {
            <div class="services-error">
              <p>We couldn't load our services right now. Please call us at <a href="tel:+18149422290">(814) 942-2290</a> to book.</p>
            </div>
          } @else if (services().length === 0 && !loading()) {
            <div class="services-empty">
              <p>No services available right now. Check back soon!</p>
            </div>
          } @else {
            <div class="services-grid">
              @for (s of services(); track s.id) {
                <app-service-card
                  [name]="s.name"
                  [durationMinutes]="s.durationMinutes"
                  [priceCents]="s.priceCents"
                  [showBook]="true"
                ></app-service-card>
              }
            </div>
          }
        </div>
      </section>

      <!-- How it works -->
      <section class="how-section">
        <div class="section-inner">
          <h2 class="section-title">How it works</h2>
          <div class="steps-grid">
            <div class="step">
              <div class="step-num">1</div>
              <h3 class="step-title">Choose a treatment</h3>
              <p class="step-desc">Browse our pest control services and pick the one that fits your needs.</p>
            </div>
            <div class="step">
              <div class="step-num">2</div>
              <h3 class="step-title">Pick a time</h3>
              <p class="step-desc">Select a day and time slot that works for you — same-week availability.</p>
            </div>
            <div class="step">
              <div class="step-num">3</div>
              <h3 class="step-title">We arrive</h3>
              <p class="step-desc">A licensed local technician shows up at your door, ready to get the job done.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA band -->
      <section class="cta-band">
        <div class="section-inner cta-inner">
          <h2 class="cta-title">Ready to be pest-free?</h2>
          <a routerLink="/book" class="btn-cta-band">Book a treatment</a>
          <a href="tel:+18149422290" class="cta-phone">(814) 942-2290</a>
        </div>
      </section>

      <app-site-footer></app-site-footer>
    </div>
  `,
  styles: [`
    .landing-page {
      min-height: 100vh;
      background: var(--color-bg-primary);
    }

    /* Hero */
    .hero {
      background: var(--color-primary);
      color: var(--color-on-primary);
      padding: 5rem 1.25rem 4rem;
    }

    .hero-inner {
      max-width: 720px;
      margin: 0 auto;
      text-align: center;
    }

    .hero-title {
      font-size: clamp(2rem, 5vw, 3rem);
      font-weight: 800;
      color: var(--color-on-primary);
      margin: 0 0 1rem;
      line-height: 1.15;
    }

    .hero-sub {
      font-size: 1.125rem;
      color: var(--color-on-primary-soft);
      margin: 0 0 2rem;
      line-height: 1.6;
    }

    .btn-hero {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 0.875rem 2rem;
      background: var(--color-cta);
      color: var(--color-on-primary);
      border-radius: var(--radius-btn);
      font-size: 1rem;
      font-weight: 700;
      text-decoration: none;
      transition: background 0.15s ease;
    }

    .btn-hero:hover {
      background: var(--color-cta-hover);
    }

    .badge-row {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
      justify-content: center;
      margin-top: 2rem;
    }

    .badge {
      display: inline-flex;
      align-items: center;
      gap: 0.375rem;
      background: rgba(255, 255, 255, 0.1);
      color: var(--color-on-primary-soft);
      border-radius: 999px;
      padding: 0.375rem 0.875rem;
      font-size: var(--font-size-sm);
      font-weight: 500;
    }

    .badge-icon {
      width: 16px;
      height: 16px;
      flex-shrink: 0;
    }

    /* Sections */
    .section-inner {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1.25rem;
    }

    .section-title {
      text-align: center;
      font-size: var(--font-size-xl);
      font-weight: 700;
      color: var(--color-text-primary);
      margin: 0 0 0.5rem;
    }

    .section-sub {
      text-align: center;
      color: var(--color-text-secondary);
      margin: 0 0 2rem;
    }

    /* Services section */
    .services-section {
      padding: 4rem 0;
      background: var(--color-bg-secondary);
    }

    .services-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
      gap: 1.5rem;
    }

    .services-error,
    .services-empty {
      text-align: center;
      padding: 2rem;
      color: var(--color-text-secondary);
    }

    .services-error a {
      color: var(--color-cta);
    }

    /* How it works */
    .how-section {
      padding: 4rem 0;
      background: var(--color-bg-primary);
    }

    .steps-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: 2rem;
      text-align: center;
    }

    .step {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.75rem;
    }

    .step-num {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: var(--color-cta);
      color: var(--color-on-primary);
      font-size: 1.25rem;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .step-title {
      font-size: 1rem;
      font-weight: 700;
      color: var(--color-text-primary);
      margin: 0;
    }

    .step-desc {
      font-size: var(--font-size-sm);
      color: var(--color-text-secondary);
      line-height: 1.5;
      margin: 0;
    }

    /* CTA band */
    .cta-band {
      padding: 4rem 0;
      background: var(--color-cta);
    }

    .cta-inner {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
      text-align: center;
    }

    .cta-title {
      font-size: var(--font-size-xl);
      font-weight: 700;
      color: var(--color-on-primary);
      margin: 0;
    }

    .btn-cta-band {
      display: inline-flex;
      align-items: center;
      padding: 0.875rem 2rem;
      background: var(--color-bg-primary);
      color: var(--color-cta);
      border-radius: var(--radius-btn);
      font-size: 1rem;
      font-weight: 700;
      text-decoration: none;
      transition: opacity 0.15s ease;
    }

    .btn-cta-band:hover {
      opacity: 0.9;
    }

    .cta-phone {
      color: var(--color-on-primary);
      font-size: var(--font-size-sm);
      text-decoration: none;
    }

    .cta-phone:hover {
      text-decoration: underline;
    }
  `],
})
export class LandingComponent implements OnInit {
  private readonly http = inject(HttpClient);

  readonly services = signal<PublicService[]>([]);
  readonly loading = signal(true);
  readonly loadError = signal(false);

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
      this.loadError.set(true);
    } finally {
      this.loading.set(false);
    }
  }
}
