/** Inline SVG pest icons keyed by keyword. Used by ServiceCardComponent. */
export const PEST_ICONS: Record<string, string> = {
  termite: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none" aria-hidden="true">
    <circle cx="24" cy="12" r="6" fill="currentColor" opacity=".85"/>
    <ellipse cx="24" cy="30" rx="8" ry="10" fill="currentColor" opacity=".7"/>
    <line x1="10" y1="20" x2="24" y2="28" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    <line x1="38" y1="20" x2="24" y2="28" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    <line x1="8" y1="30" x2="24" y2="34" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    <line x1="40" y1="30" x2="24" y2="34" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
  </svg>`,
  rodent: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none" aria-hidden="true">
    <ellipse cx="22" cy="28" rx="12" ry="10" fill="currentColor" opacity=".85"/>
    <circle cx="22" cy="17" r="7" fill="currentColor" opacity=".85"/>
    <ellipse cx="34" cy="12" rx="4" ry="6" fill="currentColor" opacity=".5"/>
    <ellipse cx="10" cy="12" rx="4" ry="6" fill="currentColor" opacity=".5"/>
    <circle cx="19" cy="15" r="1.5" fill="white"/>
    <circle cx="25" cy="15" r="1.5" fill="white"/>
    <path d="M22 38 Q34 42 40 36" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/>
  </svg>`,
  mosquito: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none" aria-hidden="true">
    <ellipse cx="24" cy="26" rx="4" ry="8" fill="currentColor" opacity=".85"/>
    <circle cx="24" cy="15" r="5" fill="currentColor" opacity=".85"/>
    <path d="M4 20 Q14 24 20 28" stroke="currentColor" stroke-width="1.5" fill="none" opacity=".6"/>
    <path d="M44 20 Q34 24 28 28" stroke="currentColor" stroke-width="1.5" fill="none" opacity=".6"/>
    <path d="M8 30 Q16 32 20 34" stroke="currentColor" stroke-width="1.5" fill="none" opacity=".6"/>
    <path d="M40 30 Q32 32 28 34" stroke="currentColor" stroke-width="1.5" fill="none" opacity=".6"/>
    <line x1="24" y1="10" x2="22" y2="4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" opacity=".7"/>
    <line x1="24" y1="10" x2="26" y2="4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" opacity=".7"/>
  </svg>`,
  'bed bug': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none" aria-hidden="true">
    <ellipse cx="24" cy="26" rx="12" ry="9" fill="currentColor" opacity=".85"/>
    <circle cx="24" cy="16" r="5" fill="currentColor" opacity=".85"/>
    <line x1="10" y1="20" x2="24" y2="26" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    <line x1="38" y1="20" x2="24" y2="26" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    <line x1="8" y1="30" x2="20" y2="30" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    <line x1="40" y1="30" x2="28" y2="30" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    <line x1="8" y1="36" x2="20" y2="34" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    <line x1="40" y1="36" x2="28" y2="34" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
  </svg>`,
  default: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none" aria-hidden="true">
    <ellipse cx="24" cy="28" rx="10" ry="8" fill="currentColor" opacity=".85"/>
    <circle cx="24" cy="17" r="5" fill="currentColor" opacity=".85"/>
    <line x1="10" y1="22" x2="18" y2="26" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    <line x1="38" y1="22" x2="30" y2="26" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    <line x1="10" y1="30" x2="16" y2="32" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    <line x1="38" y1="30" x2="32" y2="32" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    <line x1="12" y1="36" x2="18" y2="36" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    <line x1="36" y1="36" x2="30" y2="36" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
  </svg>`,
};

export const PEST_DESCRIPTIONS: Record<string, string> = {
  termite: 'Protect your home from costly structural damage with our thorough termite inspection and treatment.',
  rodent: 'Seal entry points and remove rodents safely with our humane exclusion and control program.',
  mosquito: 'Reduce mosquito populations around your yard so you can enjoy the outdoors again.',
  'bed bug': 'Eliminate bed bugs at every life stage with our heat and chemical treatment protocol.',
  default: 'Our licensed technicians identify and eliminate the pest problem at the source.',
};

/** Pick the best icon key for a service name. */
export function pestIconKey(name: string): string {
  const n = name.toLowerCase();
  if (n.includes('termite')) return 'termite';
  if (n.includes('rodent') || n.includes('mouse') || n.includes('rat')) return 'rodent';
  if (n.includes('mosquito')) return 'mosquito';
  if (n.includes('bed bug') || n.includes('bedbug')) return 'bed bug';
  return 'default';
}
