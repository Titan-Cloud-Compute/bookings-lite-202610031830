import { Routes } from '@angular/router';

/**
 * Feature route registry.
 *
 * Each story appends its Angular routes to this array.
 * app.routes.ts spreads FEATURE_ROUTES before the wildcard catch-all so new
 * feature routes are picked up automatically.
 *
 * Signed-in feature pages are children of the authenticated LayoutComponent
 * shell. An empty-path parent with no matching child lets the router fall
 * through to the remaining top-level routes (landing, login, ...).
 */
export const FEATURE_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('../shared/layout.component').then(m => m.LayoutComponent),
    data: { rendersSupportFooterInLayout: true },
    children: [
      // Story: create-service
      {
        path: 'services',
        loadComponent: () => import('./services/services.component').then(m => m.ServicesComponent),
      },
      // Story: set-availability
      {
        path: 'availability',
        loadComponent: () => import('./availability/availability.component').then(m => m.AvailabilityComponent),
      },
      // Story: book-appointment
      {
        path: 'book',
        loadComponent: () => import('./appointments/book-appointment.component').then(m => m.BookAppointmentComponent),
      },
      // Story: provider-dashboard
      {
        path: 'provider-dashboard',
        loadComponent: () => import('./appointments/provider-dashboard.component').then(m => m.ProviderDashboardComponent),
      },
    ],
  },
];
