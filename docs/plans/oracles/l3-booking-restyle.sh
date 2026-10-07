#!/usr/bin/env bash
# L3 oracle: booking pages restyled (colours/spacing only), no behaviour change, build. Run from repo root.
set -euo pipefail
# No-remote behaviour guard: fingerprint of every behaviour-bearing line (testids, ngModel, handlers, http/api, routerLink, id/name)
# in each component, taken on main 65a3f9d. The oracle runs without an origin remote, so it cannot diff against origin/main.
fp() { grep -E 'data-testid|ngModel|http\.|api/|routerLink|name="|id="|\(click\)|\(ngSubmit\)|\(ngModelChange\)' "$1" | sed 's/^[[:space:]]*//' | sha256sum | cut -c1-64; }
D=web/src/app/features/appointments
[ "$(fp $D/book-appointment.component.ts)" = "a71767ed42b06c0a7feb56a3a30eed9372d078c152966c20f503abe48fd0e080" ] || { echo 'FAIL: book-appointment behaviour lines changed'; exit 1; }
[ "$(fp $D/my-appointments.component.ts)" = "af6fcd993296f36cb069e4aee58e325cd11b715f45a7b11a05aee1635583f147" ] || { echo 'FAIL: my-appointments behaviour lines changed'; exit 1; }
[ "$(fp $D/provider-dashboard.component.ts)" = "2b2a1e405ba2671dae4a3a8f4743ab3c088a44af2ce79a21fa016a5a36899cab" ] || { echo 'FAIL: provider-dashboard behaviour lines changed'; exit 1; }
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
