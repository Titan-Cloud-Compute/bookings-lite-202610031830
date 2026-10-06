/**
 * Inline SVG pest icons for ServiceCardComponent.
 * All icons are 48×48 view-box, rendered at 40×40 in cards.
 */

export interface PestIcon {
  svg: string;
  description: string;
}

const TERMITE: PestIcon = {
  description: 'Professional termite treatment to protect your home structure.',
  svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none" aria-hidden="true">
    <circle cx="24" cy="14" r="7" fill="currentColor" opacity="0.15"/>
    <circle cx="24" cy="14" r="5" fill="currentColor"/>
    <ellipse cx="24" cy="30" rx="7" ry="10" fill="currentColor" opacity="0.7"/>
    <line x1="24" y1="19" x2="24" y2="20" stroke="currentColor" stroke-width="2"/>
    <line x1="17" y1="24" x2="10" y2="20" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
    <line x1="31" y1="24" x2="38" y2="20" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
    <line x1="17" y1="30" x2="10" y2="28" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
    <line x1="31" y1="30" x2="38" y2="28" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
    <line x1="24" y1="9" x2="21" y2="5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
    <line x1="24" y1="9" x2="27" y2="5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
  </svg>`,
};

const RODENT: PestIcon = {
  description: 'Rodent control to keep mice and rats out of your home.',
  svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none" aria-hidden="true">
    <ellipse cx="22" cy="28" rx="12" ry="9" fill="currentColor" opacity="0.8"/>
    <circle cx="34" cy="22" r="8" fill="currentColor" opacity="0.8"/>
    <circle cx="36" cy="20" r="2" fill="white"/>
    <circle cx="36.5" cy="19.5" r="1" fill="currentColor"/>
    <ellipse cx="38" cy="22" r="4" rx="4" ry="3" fill="currentColor" opacity="0.4"/>
    <path d="M10 30 Q6 28 6 34 Q6 38 10 36" fill="currentColor" opacity="0.6"/>
    <line x1="34" y1="14" x2="30" y2="10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
    <line x1="38" y1="14" x2="40" y2="10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
    <path d="M10 37 Q14 42 20 40" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/>
  </svg>`,
};

const MOSQUITO: PestIcon = {
  description: 'Mosquito treatments for a bite-free yard all season long.',
  svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none" aria-hidden="true">
    <ellipse cx="24" cy="26" rx="4" ry="8" fill="currentColor" opacity="0.8"/>
    <circle cx="24" cy="15" r="4" fill="currentColor"/>
    <ellipse cx="14" cy="22" rx="9" ry="4" fill="currentColor" opacity="0.3" transform="rotate(-20 14 22)"/>
    <ellipse cx="34" cy="22" rx="9" ry="4" fill="currentColor" opacity="0.3" transform="rotate(20 34 22)"/>
    <line x1="24" y1="11" x2="22" y2="7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
    <line x1="24" y1="11" x2="26" y2="7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
    <line x1="20" y1="26" x2="12" y2="30" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
    <line x1="28" y1="26" x2="36" y2="30" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
    <line x1="20" y1="30" x2="14" y2="34" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
    <line x1="28" y1="30" x2="34" y2="34" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
    <line x1="24" y1="19" x2="24" y2="38" stroke="currentColor" stroke-width="1" stroke-linecap="round"/>
  </svg>`,
};

const BED_BUG: PestIcon = {
  description: 'Heat-treatment and chemical bed bug elimination solutions.',
  svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none" aria-hidden="true">
    <ellipse cx="24" cy="26" rx="11" ry="8" fill="currentColor" opacity="0.8"/>
    <circle cx="24" cy="18" r="5" fill="currentColor"/>
    <line x1="13" y1="22" x2="7" y2="18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
    <line x1="13" y1="26" x2="7" y2="26" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
    <line x1="13" y1="30" x2="7" y2="34" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
    <line x1="35" y1="22" x2="41" y2="18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
    <line x1="35" y1="26" x2="41" y2="26" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
    <line x1="35" y1="30" x2="41" y2="34" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
    <line x1="22" y1="13" x2="20" y2="9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
    <line x1="26" y1="13" x2="28" y2="9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
    <ellipse cx="24" cy="26" rx="7" ry="5" fill="none" stroke="currentColor" stroke-width="1" opacity="0.4"/>
  </svg>`,
};

const BUG: PestIcon = {
  description: 'General pest control covering ants, spiders, cockroaches and more.',
  svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none" aria-hidden="true">
    <ellipse cx="24" cy="26" rx="9" ry="11" fill="currentColor" opacity="0.8"/>
    <circle cx="24" cy="14" r="5" fill="currentColor"/>
    <line x1="15" y1="20" x2="8" y2="16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
    <line x1="15" y1="26" x2="8" y2="26" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
    <line x1="15" y1="32" x2="8" y2="36" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
    <line x1="33" y1="20" x2="40" y2="16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
    <line x1="33" y1="26" x2="40" y2="26" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
    <line x1="33" y1="32" x2="40" y2="36" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
    <line x1="22" y1="9" x2="20" y2="5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
    <line x1="26" y1="9" x2="28" y2="5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
  </svg>`,
};

/**
 * Returns the correct icon and description for a given service name.
 * Matching is case-insensitive keyword search.
 */
export function getPestIcon(name: string): PestIcon {
  const lower = name.toLowerCase();
  if (lower.includes('termite')) return TERMITE;
  if (lower.includes('rodent') || lower.includes('mouse') || lower.includes('mice') || lower.includes('rat')) return RODENT;
  if (lower.includes('mosquito')) return MOSQUITO;
  if (lower.includes('bed bug') || lower.includes('bedbug')) return BED_BUG;
  return BUG;
}
