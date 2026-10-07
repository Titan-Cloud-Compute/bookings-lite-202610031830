/** Inline SVG pest icons keyed by keyword found in a service name. */
export const PEST_ICONS: Record<string, string> = {
  termite: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none" aria-hidden="true">
    <circle cx="24" cy="30" r="8" fill="currentColor" opacity="0.15" stroke="currentColor" stroke-width="2"/>
    <circle cx="24" cy="16" r="6" fill="currentColor" opacity="0.2" stroke="currentColor" stroke-width="2"/>
    <line x1="24" y1="22" x2="24" y2="26" stroke="currentColor" stroke-width="2"/>
    <line x1="18" y1="28" x2="10" y2="22" stroke="currentColor" stroke-width="2"/>
    <line x1="30" y1="28" x2="38" y2="22" stroke="currentColor" stroke-width="2"/>
    <line x1="18" y1="32" x2="10" y2="36" stroke="currentColor" stroke-width="2"/>
    <line x1="30" y1="32" x2="38" y2="36" stroke="currentColor" stroke-width="2"/>
    <circle cx="21" cy="14" r="1.5" fill="currentColor"/>
    <circle cx="27" cy="14" r="1.5" fill="currentColor"/>
  </svg>`,

  rodent: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none" aria-hidden="true">
    <ellipse cx="22" cy="30" rx="12" ry="9" fill="currentColor" opacity="0.15" stroke="currentColor" stroke-width="2"/>
    <circle cx="22" cy="18" r="8" fill="currentColor" opacity="0.2" stroke="currentColor" stroke-width="2"/>
    <path d="M28 12 Q36 6 38 14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    <path d="M16 12 Q8 6 6 14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    <circle cx="19" cy="17" r="1.5" fill="currentColor"/>
    <circle cx="25" cy="17" r="1.5" fill="currentColor"/>
    <path d="M34 30 Q40 28 42 36" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    <path d="M22 39 L22 44" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
  </svg>`,

  mouse: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none" aria-hidden="true">
    <ellipse cx="22" cy="30" rx="12" ry="9" fill="currentColor" opacity="0.15" stroke="currentColor" stroke-width="2"/>
    <circle cx="22" cy="18" r="8" fill="currentColor" opacity="0.2" stroke="currentColor" stroke-width="2"/>
    <path d="M28 12 Q36 6 38 14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    <path d="M16 12 Q8 6 6 14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    <circle cx="19" cy="17" r="1.5" fill="currentColor"/>
    <circle cx="25" cy="17" r="1.5" fill="currentColor"/>
    <path d="M34 30 Q40 28 42 36" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
  </svg>`,

  mosquito: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none" aria-hidden="true">
    <ellipse cx="24" cy="28" rx="5" ry="8" fill="currentColor" opacity="0.2" stroke="currentColor" stroke-width="2"/>
    <circle cx="24" cy="18" r="4" fill="currentColor" opacity="0.2" stroke="currentColor" stroke-width="2"/>
    <path d="M24 22 L24 24" stroke="currentColor" stroke-width="2"/>
    <path d="M19 26 Q12 20 8 24" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    <path d="M29 26 Q36 20 40 24" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    <path d="M19 30 Q12 30 8 34" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    <path d="M29 30 Q36 30 40 34" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    <path d="M22 14 Q22 8 24 6 Q26 8 26 14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
    <line x1="21" y1="16" x2="16" y2="12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
    <line x1="27" y1="16" x2="32" y2="12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
  </svg>`,

  bed: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none" aria-hidden="true">
    <ellipse cx="24" cy="28" rx="10" ry="7" fill="currentColor" opacity="0.15" stroke="currentColor" stroke-width="2"/>
    <circle cx="24" cy="19" r="5" fill="currentColor" opacity="0.2" stroke="currentColor" stroke-width="2"/>
    <line x1="18" y1="26" x2="10" y2="20" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    <line x1="30" y1="26" x2="38" y2="20" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    <line x1="18" y1="30" x2="10" y2="36" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    <line x1="30" y1="30" x2="38" y2="36" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    <line x1="22" y1="35" x2="20" y2="42" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    <line x1="26" y1="35" x2="28" y2="42" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    <circle cx="22" cy="18" r="1" fill="currentColor"/>
    <circle cx="26" cy="18" r="1" fill="currentColor"/>
  </svg>`,

  default: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none" aria-hidden="true">
    <ellipse cx="24" cy="28" rx="10" ry="8" fill="currentColor" opacity="0.15" stroke="currentColor" stroke-width="2"/>
    <circle cx="24" cy="18" r="6" fill="currentColor" opacity="0.2" stroke="currentColor" stroke-width="2"/>
    <line x1="24" y1="24" x2="24" y2="26" stroke="currentColor" stroke-width="2"/>
    <line x1="17" y1="26" x2="10" y2="22" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    <line x1="31" y1="26" x2="38" y2="22" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    <line x1="17" y1="30" x2="10" y2="36" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    <line x1="31" y1="30" x2="38" y2="36" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    <circle cx="21" cy="17" r="1.5" fill="currentColor"/>
    <circle cx="27" cy="17" r="1.5" fill="currentColor"/>
  </svg>`,
};

export const PEST_DESCRIPTIONS: Record<string, string> = {
  termite: 'Comprehensive inspection and treatment to protect your home from costly termite damage.',
  rodent: 'Humane exclusion and baiting to remove mice and rats and keep them from coming back.',
  mouse: 'Humane exclusion and baiting to remove mice and keep them from coming back.',
  mosquito: 'Yard treatment that reduces mosquito populations so you can enjoy your outdoor spaces.',
  bed: 'Thorough treatment targeting bed bugs at every life stage for lasting relief.',
  default: "Professional pest control tailored to your home's needs by a licensed local technician.",
};

/** Returns the icon SVG for a service name. */
export function iconForService(name: string): string {
  const n = name.toLowerCase();
  if (n.includes('termite')) return PEST_ICONS['termite'];
  if (n.includes('rodent') || n.includes('mouse') || n.includes('rat')) return PEST_ICONS['rodent'];
  if (n.includes('mosquito')) return PEST_ICONS['mosquito'];
  if (n.includes('bed bug') || n.includes('bedbug')) return PEST_ICONS['bed'];
  return PEST_ICONS['default'];
}

/** Returns a short description for a service name. */
export function descForService(name: string): string {
  const n = name.toLowerCase();
  if (n.includes('termite')) return PEST_DESCRIPTIONS['termite'];
  if (n.includes('rodent') || n.includes('mouse') || n.includes('rat')) return PEST_DESCRIPTIONS['rodent'];
  if (n.includes('mosquito')) return PEST_DESCRIPTIONS['mosquito'];
  if (n.includes('bed bug') || n.includes('bedbug')) return PEST_DESCRIPTIONS['bed'];
  return PEST_DESCRIPTIONS['default'];
}
