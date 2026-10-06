#!/usr/bin/env bash
# L3 oracle: booking pages restyled (colours/spacing only), no behaviour change, build. Run from repo root.
set -euo pipefail
F="web/src/app/features/appointments/book-appointment.component.ts web/src/app/features/appointments/my-appointments.component.ts web/src/app/features/appointments/provider-dashboard.component.ts"
git fetch -q origin main || true
CHANGED=$(git diff origin/main -- $F | grep -E '^[-+][^-+]' | grep -E 'data-testid|ngModel|http\.|api/|routerLink|name="|id="|\(click\)|\(ngSubmit\)|\(ngModelChange\)' || true)
if [ -n "$CHANGED" ]; then echo "FAIL: behaviour lines changed:"; echo "$CHANGED"; exit 1; fi
python3 - <<'PY'
import re, sys
fail = []
for f in ['web/src/app/features/appointments/book-appointment.component.ts',
          'web/src/app/features/appointments/my-appointments.component.ts',
          'web/src/app/features/appointments/provider-dashboard.component.ts']:
    t = open(f).read()
    styles = t.split('styles:')[-1].split('})')[0]
    if not re.search(r'h1[^{]*\{[^}]*color:\s*var\(--color-primary\)', styles): fail.append(f + ': h1 not var(--color-primary)')
    if re.search(r'#[0-9a-fA-F]{3,6}\b|:\s*white\b', styles): fail.append(f + ': raw colour in styles')
if fail:
    print('FAIL:'); [print('  ' + x) for x in fail]; sys.exit(1)
print('static OK')
PY
cd web
npm ci --include=dev >/dev/null 2>&1
if ! npx ng build --configuration production >/tmp/ngb-l3.log 2>&1; then tail -40 /tmp/ngb-l3.log; exit 1; fi
echo L3-OK
