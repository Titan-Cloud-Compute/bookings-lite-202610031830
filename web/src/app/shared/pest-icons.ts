/** Inline SVG pest icons — no external dependency. */

export const PEST_ICONS: Record<string, string> = {
  termite: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none" width="48" height="48" aria-hidden="true">
    <circle cx="24" cy="24" r="22" fill="#e9f4ee"/>
    <!-- body segments -->
    <ellipse cx="24" cy="30" rx="7" ry="9" fill="#4a7c59"/>
    <ellipse cx="24" cy="20" rx="5" ry="6" fill="#5a9068"/>
    <circle cx="24" cy="13" r="4" fill="#4a7c59"/>
    <!-- antennae -->
    <line x1="22" y1="10" x2="17" y2="5" stroke="#4a7c59" stroke-width="1.5" stroke-linecap="round"/>
    <line x1="26" y1="10" x2="31" y2="5" stroke="#4a7c59" stroke-width="1.5" stroke-linecap="round"/>
    <!-- legs -->
    <line x1="17" y1="22" x2="10" y2="19" stroke="#4a7c59" stroke-width="1.5" stroke-linecap="round"/>
    <line x1="17" y1="26" x2="10" y2="26" stroke="#4a7c59" stroke-width="1.5" stroke-linecap="round"/>
    <line x1="31" y1="22" x2="38" y2="19" stroke="#4a7c59" stroke-width="1.5" stroke-linecap="round"/>
    <line x1="31" y1="26" x2="38" y2="26" stroke="#4a7c59" stroke-width="1.5" stroke-linecap="round"/>
  </svg>`,

  rodent: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none" width="48" height="48" aria-hidden="true">
    <circle cx="24" cy="24" r="22" fill="#f0ece8"/>
    <!-- body -->
    <ellipse cx="24" cy="28" rx="12" ry="9" fill="#8b7355"/>
    <!-- head -->
    <circle cx="34" cy="22" r="7" fill="#8b7355"/>
    <!-- ear -->
    <circle cx="37" cy="16" r="4" fill="#c9a88a"/>
    <circle cx="37" cy="16" r="2.5" fill="#e8c4b0"/>
    <!-- eye -->
    <circle cx="37" cy="21" r="1.5" fill="#1a1a1a"/>
    <!-- nose -->
    <circle cx="41" cy="23" r="1" fill="#cc6677"/>
    <!-- tail -->
    <path d="M12 30 Q4 32 6 38" stroke="#8b7355" stroke-width="2" stroke-linecap="round" fill="none"/>
    <!-- whiskers -->
    <line x1="38" y1="23" x2="46" y2="21" stroke="#8b7355" stroke-width="1" stroke-linecap="round"/>
    <line x1="38" y1="24" x2="46" y2="24" stroke="#8b7355" stroke-width="1" stroke-linecap="round"/>
  </svg>`,

  mosquito: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none" width="48" height="48" aria-hidden="true">
    <circle cx="24" cy="24" r="22" fill="#e8f0f8"/>
    <!-- body -->
    <ellipse cx="24" cy="26" rx="3" ry="10" fill="#3a5f8a"/>
    <!-- head -->
    <circle cx="24" cy="15" r="3.5" fill="#3a5f8a"/>
    <!-- wings -->
    <ellipse cx="16" cy="22" rx="8" ry="4" fill="#a8c4e0" opacity="0.7" transform="rotate(-20 16 22)"/>
    <ellipse cx="32" cy="22" rx="8" ry="4" fill="#a8c4e0" opacity="0.7" transform="rotate(20 32 22)"/>
    <!-- proboscis -->
    <line x1="24" y1="12" x2="24" y2="6" stroke="#3a5f8a" stroke-width="1.5" stroke-linecap="round"/>
    <!-- legs -->
    <line x1="21" y1="24" x2="13" y2="20" stroke="#3a5f8a" stroke-width="1" stroke-linecap="round"/>
    <line x1="21" y1="27" x2="12" y2="28" stroke="#3a5f8a" stroke-width="1" stroke-linecap="round"/>
    <line x1="21" y1="30" x2="13" y2="34" stroke="#3a5f8a" stroke-width="1" stroke-linecap="round"/>
    <line x1="27" y1="24" x2="35" y2="20" stroke="#3a5f8a" stroke-width="1" stroke-linecap="round"/>
    <line x1="27" y1="27" x2="36" y2="28" stroke="#3a5f8a" stroke-width="1" stroke-linecap="round"/>
    <line x1="27" y1="30" x2="35" y2="34" stroke="#3a5f8a" stroke-width="1" stroke-linecap="round"/>
  </svg>`,

  bedbug: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none" width="48" height="48" aria-hidden="true">
    <circle cx="24" cy="24" r="22" fill="#f8ebe8"/>
    <!-- body -->
    <ellipse cx="24" cy="26" rx="10" ry="7" fill="#8b3a2a"/>
    <!-- head -->
    <circle cx="24" cy="18" r="5" fill="#8b3a2a"/>
    <!-- antennae -->
    <line x1="22" y1="14" x2="18" y2="9" stroke="#8b3a2a" stroke-width="1.5" stroke-linecap="round"/>
    <line x1="26" y1="14" x2="30" y2="9" stroke="#8b3a2a" stroke-width="1.5" stroke-linecap="round"/>
    <!-- legs -->
    <line x1="14" y1="22" x2="8" y2="19" stroke="#8b3a2a" stroke-width="1.5" stroke-linecap="round"/>
    <line x1="14" y1="26" x2="7" y2="25" stroke="#8b3a2a" stroke-width="1.5" stroke-linecap="round"/>
    <line x1="14" y1="30" x2="8" y2="33" stroke="#8b3a2a" stroke-width="1.5" stroke-linecap="round"/>
    <line x1="34" y1="22" x2="40" y2="19" stroke="#8b3a2a" stroke-width="1.5" stroke-linecap="round"/>
    <line x1="34" y1="26" x2="41" y2="25" stroke="#8b3a2a" stroke-width="1.5" stroke-linecap="round"/>
    <line x1="34" y1="30" x2="40" y2="33" stroke="#8b3a2a" stroke-width="1.5" stroke-linecap="round"/>
  </svg>`,

  bug: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none" width="48" height="48" aria-hidden="true">
    <circle cx="24" cy="24" r="22" fill="#eef4f0"/>
    <!-- body -->
    <ellipse cx="24" cy="27" rx="8" ry="10" fill="#2d7a4a"/>
    <!-- head -->
    <circle cx="24" cy="16" r="5" fill="#2d7a4a"/>
    <!-- antennae -->
    <line x1="22" y1="12" x2="18" y2="7" stroke="#2d7a4a" stroke-width="1.5" stroke-linecap="round"/>
    <line x1="26" y1="12" x2="30" y2="7" stroke="#2d7a4a" stroke-width="1.5" stroke-linecap="round"/>
    <!-- eyes -->
    <circle cx="22" cy="15" r="1.2" fill="white"/>
    <circle cx="26" cy="15" r="1.2" fill="white"/>
    <!-- legs -->
    <line x1="16" y1="23" x2="9" y2="20" stroke="#2d7a4a" stroke-width="1.5" stroke-linecap="round"/>
    <line x1="16" y1="27" x2="9" y2="27" stroke="#2d7a4a" stroke-width="1.5" stroke-linecap="round"/>
    <line x1="16" y1="31" x2="9" y2="35" stroke="#2d7a4a" stroke-width="1.5" stroke-linecap="round"/>
    <line x1="32" y1="23" x2="39" y2="20" stroke="#2d7a4a" stroke-width="1.5" stroke-linecap="round"/>
    <line x1="32" y1="27" x2="39" y2="27" stroke="#2d7a4a" stroke-width="1.5" stroke-linecap="round"/>
    <line x1="32" y1="31" x2="39" y2="35" stroke="#2d7a4a" stroke-width="1.5" stroke-linecap="round"/>
  </svg>`,
};

export function getPestIcon(name: string): string {
  const lower = name.toLowerCase();
  if (lower.includes('termite')) return PEST_ICONS['termite'];
  if (lower.includes('rodent') || lower.includes('mouse') || lower.includes('rat')) return PEST_ICONS['rodent'];
  if (lower.includes('mosquito')) return PEST_ICONS['mosquito'];
  if (lower.includes('bed bug') || lower.includes('bedbug')) return PEST_ICONS['bedbug'];
  return PEST_ICONS['bug'];
}

export function getPestDescription(name: string): string {
  const lower = name.toLowerCase();
  if (lower.includes('termite')) {
    return 'Comprehensive inspection and treatment to protect your home from termite damage.';
  }
  if (lower.includes('rodent') || lower.includes('mouse') || lower.includes('rat')) {
    return 'Seal entry points and eliminate rodent activity to keep your home pest-free.';
  }
  if (lower.includes('mosquito')) {
    return 'Targeted yard treatments to reduce mosquito populations and protect your family outdoors.';
  }
  if (lower.includes('bed bug') || lower.includes('bedbug')) {
    return 'Thorough heat or chemical treatments to fully eliminate bed bugs from your home.';
  }
  return 'Professional pest control treatment to protect your home from unwanted insects and pests.';
}
