#!/usr/bin/env bash
# Oracle: L2 — Ferguson brand tokens, sticky header/footer, new landing page, shared ServiceCard
# Prints L2-OK and exits 0 when all checks pass; prints a failure line and exits 1 on first failure.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
FAIL=0
fail() { echo "FAIL: $1"; FAIL=1; }

# ── 1. Brand tokens ────────────────────────────────────────────────────────────
TOKENS="$ROOT/web/src/styles/tokens.css"
grep -q -- '--color-primary: #0B2A4A'  "$TOKENS" || fail "tokens.css missing --color-primary: #0B2A4A"
grep -q -- '--color-cta: #2DB34A'       "$TOKENS" || fail "tokens.css missing --color-cta: #2DB34A"
grep -q -- '--color-cta-hover:'         "$TOKENS" || fail "tokens.css missing --color-cta-hover"

# ── 2. index.html ─────────────────────────────────────────────────────────────
IDX="$ROOT/web/src/index.html"
grep -q 'Ferguson Pest Control | Book pest control online' "$IDX" || fail "index.html title not updated"
grep -q '#0B2A4A' "$IDX" || fail "index.html theme-color not updated to #0B2A4A"
grep -qi 'Enterprise Platform\|Enterprise Template\|Enterprise application template' "$IDX" && fail "index.html still contains old Enterprise strings"

# ── 3. Shared components exist ────────────────────────────────────────────────
test -f "$ROOT/web/src/app/shared/site-header.component.ts"   || fail "site-header.component.ts missing"
test -f "$ROOT/web/src/app/shared/site-footer.component.ts"   || fail "site-footer.component.ts missing"
test -f "$ROOT/web/src/app/shared/service-card.component.ts"  || fail "service-card.component.ts missing"
test -f "$ROOT/web/src/app/shared/pest-icons.ts"              || fail "pest-icons.ts missing"

# ── 4. site-header selector ───────────────────────────────────────────────────
HEADER="$ROOT/web/src/app/shared/site-header.component.ts"
grep -q "selector: 'app-site-header'" "$HEADER" || fail "site-header selector must be app-site-header"
grep -q 'Ferguson Pest Control'        "$HEADER" || fail "site-header missing brand name"
grep -q 'tel:+18149422290\|tel:\+18149422290\|(814) 942-2290' "$HEADER" || fail "site-header missing phone number"
grep -q 'routerLink.*\/book\|routerLink.*book' "$HEADER" || fail "site-header missing /book routerLink"
# Sticky nav: must use position:sticky or position: sticky
grep -q 'position.*sticky\|sticky.*position' "$HEADER" || fail "site-header not sticky"

# ── 5. site-footer selector ───────────────────────────────────────────────────
FOOTER="$ROOT/web/src/app/shared/site-footer.component.ts"
grep -q "selector: 'app-site-footer'" "$FOOTER" || fail "site-footer selector must be app-site-footer"

# ── 6. service-card component ─────────────────────────────────────────────────
CARD="$ROOT/web/src/app/shared/service-card.component.ts"
grep -q "selector: 'app-service-card'" "$CARD" || fail "service-card selector must be app-service-card"
# Must accept name input
grep -q "name\b" "$CARD" || fail "service-card missing name input"
# Must accept durationMinutes input
grep -q "durationMinutes" "$CARD" || fail "service-card missing durationMinutes input"
# Must accept priceCents input
grep -q "priceCents" "$CARD" || fail "service-card missing priceCents input"
# Book button routes to /book when showBook
grep -q '/book' "$CARD" || fail "service-card missing /book routerLink"

# ── 7. Landing page ───────────────────────────────────────────────────────────
LANDING="$ROOT/web/src/app/landing/landing.component.ts"
grep -q 'Pest-free homes, booked in minutes' "$LANDING" || fail "landing missing hero h1"
grep -q 'app-site-header' "$LANDING" || fail "landing missing app-site-header"
grep -q 'app-site-footer' "$LANDING" || fail "landing missing app-site-footer"
grep -q 'app-service-card' "$LANDING" || fail "landing missing app-service-card"
grep -q "id='services'\|id=\"services\"" "$LANDING" || fail "landing missing id='services' section"
# How it works
grep -q 'How it works\|How It Works' "$LANDING" || fail "landing missing How it works section"
# api/services call
grep -q 'api/services' "$LANDING" || fail "landing missing api/services fetch"

# ── 8. services component uses app-service-card ───────────────────────────────
SERVICES="$ROOT/web/src/app/features/services/services.component.ts"
grep -q 'app-service-card' "$SERVICES" || fail "services component must use app-service-card"
# Must preserve data-testid attributes
grep -q "data-testid='service-list'\|data-testid=\"service-list\"" "$SERVICES" || fail "services component missing data-testid=service-list"
grep -q "data-testid='service-item'\|data-testid=\"service-item\"" "$SERVICES" || fail "services component missing data-testid=service-item"

# ── 9. styles.css has .btn-primary with var(--color-cta) ─────────────────────
STYLES="$ROOT/web/src/styles.css"
grep -q '\.btn-primary' "$STYLES" || fail "styles.css missing .btn-primary"
grep -A5 '\.btn-primary' "$STYLES" | grep -q 'var(--color-cta)' || fail ".btn-primary must use var(--color-cta)"

# ── Final ─────────────────────────────────────────────────────────────────────
if [ "$FAIL" -eq 0 ]; then
  echo "L2-OK"
  exit 0
else
  exit 1
fi
