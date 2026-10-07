import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
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
    <app-site-header></app-site-header>

    <!-- Hero -->
    <section class="hero">
      <div class="hero-inner">
        <h1 class="hero-h1">Pest-free homes, booked in minutes</h1>
        <p class="hero-sub">Pick a treatment, choose a time that suits you, and a licensed local technician will be there.</p>
        <a routerLink="/book" class="btn-primary hero-cta">Book a treatment</a>
        <div class="badge-row">
          <span class="badge">&#10003; Licensed &amp; insured</span>
          <span class="badge">&#10003; Same-week appointments</span>
          <span class="badge">&#10003; Reminders before every visit</span>
          <span class="badge">&#10003; Satisfaction guaranteed</span>
        </div>
      </div>
    </section>

    <!-- Services -->
    <section id="services" class="services-section">
      <div class="section-inner">
        <h2 class="section-title">Our Services</h2>
        @if (loadingServices()) {
          <p class="services-loading">Loading services&hellip;</p>
        } @else if (servicesError()) {
          <p class="services-error">{{ servicesError() }}</p>
        } @else if (services().length === 0) {
          <p class="services-empty">No services available at this time. Call us at (814) 942-2290 to book.</p>
        } @else {
          <div class="services-grid">
            @for (svc of services(); track svc.id) {
              <app-service-card
                [name]="svc.name"
                [durationMinutes]="svc.durationMinutes"
                [priceCents]="svc.priceCents"
                [showBook]="true"
              ></app-service-card>
            }
          </div>
        }
      </div>
    </section>

    <!-- How it works -->
    <section class="how-it-works">
      <div class="section-inner">
        <h2 class="section-title">How it works</h2>
        <div class="steps-grid">
          <div class="step">
            <div class="step-num">1</div>
            <h3 class="step-title">Choose a treatment</h3>
            <p class="step-desc">Browse our licensed pest control treatments and pick the one you need.</p>
          </div>
          <div class="step">
            <div class="step-num">2</div>
            <h3 class="step-title">Pick a time</h3>
            <p class="step-desc">Select a day and time that works for you — we have same-week slots available.</p>
          </div>
          <div class="step">
            <div class="step-num">3</div>
            <h3 class="step-title">We arrive</h3>
            <p class="step-desc">A licensed local technician arrives on time and completes the treatment.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA band -->
    <section class="cta-band">
      <div class="section-inner cta-inner">
        <h2 class="cta-heading">Ready to reclaim your home?</h2>
        <a routerLink="/book" class="btn-primary cta-btn">Book a treatment</a>
        <p class="cta-phone">Or call us: <a href="tel:+18149422290" class="cta-phone-link">(814) 942-2290</a></p>
      </div>
    </section>

    <app-site-footer></app-site-footer>
  `,
  styles: [`
    /* Hero */
    .hero {
      background: var(--color-primary);
      color: #fff;
      padding: 5rem 1.5rem 4rem;
      text-align: center;
    }
    .hero-inner {
      max-width: 700px;
      margin: 0 auto;
    }
    .hero-h1 {
      font-size: clamp(2rem, 5vw, 3rem);
      font-weight: 800;
      color: #fff;
      margin: 0 0 1rem;
      line-height: 1.15;
    }
    .hero-sub {
      font-size: 1.125rem;
      color: rgba(255,255,255,0.85);
      margin: 0 0 2rem;
    }
    .hero-cta {
      font-size: 1.0625rem;
      padding: 0.875rem 2rem;
    }
    .badge-row {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 0.75rem;
      margin-top: 2rem;
    }
    .badge {
      background: rgba(255,255,255,0.12);
      border: 1px solid rgba(255,255,255,0.2);
      border-radius: 999px;
      padding: 0.35rem 1rem;
      font-size: 0.875rem;
      color: rgba(255,255,255,0.9);
    }

    /* Services section */
    .services-section {
      padding: 4rem 1.5rem;
      background: var(--color-bg-secondary);
    }
    .section-inner {
      max-width: 1100px;
      margin: 0 auto;
    }
    .section-title {
      font-size: 1.75rem;
      font-weight: 700;
      color: var(--color-text-primary);
      margin: 0 0 2rem;
      text-align: center;
    }
    .services-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1.25rem;
    }
    .services-loading, .services-error, .services-empty {
      text-align: center;
      color: var(--color-text-secondary);
      font-size: 1rem;
    }

    /* How it works */
    .how-it-works {
      padding: 4rem 1.5rem;
      background: var(--color-bg-primary);
    }
    .steps-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 2rem;
    }
    .step {
      text-align: center;
    }
    .step-num {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: var(--color-primary);
      color: #fff;
      font-size: 1.25rem;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 1rem;
    }
    .step-title {
      font-size: 1.0625rem;
      font-weight: 600;
      color: var(--color-text-primary);
      margin: 0 0 0.5rem;
    }
    .step-desc {
      font-size: 0.9375rem;
      color: var(--color-text-secondary);
    }

    /* CTA band */
    .cta-band {
      padding: 4rem 1.5rem;
      background: var(--color-cta);
      text-align: center;
    }
    .cta-inner { }
    .cta-heading {
      font-size: 1.75rem;
      font-weight: 700;
      color: #fff;
      margin: 0 0 1.5rem;
    }
    .cta-btn {
      background: #fff;
      color: var(--color-cta);
      font-size: 1.0625rem;
      padding: 0.875rem 2rem;
    }
    .cta-btn:hover {
      background: rgba(255,255,255,0.9);
    }
    .cta-phone {
      margin-top: 1rem;
      color: rgba(255,255,255,0.85);
      font-size: 0.9375rem;
    }
    .cta-phone-link {
      color: #fff;
      font-weight: 600;
    }
  `]
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
      this.servicesError.set('Could not load services. Please call us at (814) 942-2290 to book.');
    } finally {
      this.loadingServices.set(false);
    }
  }
}
