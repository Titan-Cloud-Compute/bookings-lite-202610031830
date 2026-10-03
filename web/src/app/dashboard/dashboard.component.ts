import { Component } from '@angular/core';
import { ProviderDashboardComponent } from '../features/appointments/provider-dashboard.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ProviderDashboardComponent],
  template: `
    <app-provider-dashboard />
  `,
  styles: [`
    .dashboard-page {
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem 1rem;
    }
    .page-header {
      margin-bottom: 2rem;
    }
    h1 {
      font-size: var(--font-size-xl);
      color: var(--color-text-primary);
      margin: 0 0 0.25rem;
    }
    .subtitle {
      color: var(--color-text-secondary);
      font-size: var(--font-size-sm);
      margin: 0;
    }
    .placeholder-card {
      background: white;
      border-radius: var(--radius-card);
      border: 1px solid var(--color-border);
      padding: 2rem;
    }
    .placeholder-text {
      color: var(--color-text-secondary);
      margin: 0 0 1.5rem;
    }
    .placeholder-form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.375rem;
    }
    .form-group label {
      font-size: var(--font-size-sm);
      font-weight: 600;
      color: var(--color-text-primary);
    }
    .form-group input {
      padding: 0.625rem 0.75rem;
      font-size: var(--font-size-input, 1rem);
      border: 1px solid var(--color-gray-300);
      border-radius: var(--radius-btn);
      background: white;
      min-height: 44px;
    }
    .btn-primary {
      align-self: flex-start;
      padding: 0.625rem 1.5rem;
      font-size: var(--font-size-sm);
      font-weight: 600;
      color: white;
      background: var(--color-primary);
      border: none;
      border-radius: var(--radius-btn);
      cursor: not-allowed;
      opacity: 0.6;
      min-height: 44px;
    }
  `]
})
export class DashboardComponent {}
