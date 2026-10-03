/**
 * Feature module registry.
 *
 * Each story appends its NestJS module to this array.
 * AppModule spreads FEATURE_MODULES so new features are picked up automatically.
 */
import { ServicesModule } from './services/services.module';
import { AvailabilityModule } from './availability/availability.module';
import { AppointmentsModule } from './appointments/appointments.module';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const FEATURE_MODULES: any[] = [ServicesModule, AvailabilityModule, AppointmentsModule];
