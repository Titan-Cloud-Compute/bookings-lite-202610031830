/**
 * Feature module registry.
 *
 * Each story appends its NestJS module to this array.
 * AppModule spreads FEATURE_MODULES so new features are picked up automatically.
 */
import { ServicesModule } from './services/services.module';
import { AvailabilityModule } from './availability/availability.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { ProviderDashboardModule } from './provider-dashboard/provider-dashboard.module';
import { CancellationsModule } from './cancellations/cancellations.module';
import { RemindersModule } from './reminders/reminders.module';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const FEATURE_MODULES: any[] = [ServicesModule, AvailabilityModule, AppointmentsModule, ProviderDashboardModule, CancellationsModule, RemindersModule];
