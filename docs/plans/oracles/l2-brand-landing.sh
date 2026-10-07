#!/usr/bin/env bash
# L2 oracle: brand, tokens, sticky header, landing, shared service card, /services, build. Run from repo root.
set -euo pipefail
python3 - <<'PY'
import re, sys, glob, os
fail = []
def rd(p): return open(p).read()
idx = rd('web/src/index.html')
if '<title>Ferguson Pest Control | Book pest control online</title>' not in idx: fail.append('title')
for f in glob.glob('web/src/**/*', recursive=True) + glob.glob('web/public/**/*', recursive=True):
    if os.path.isfile(f) and f.endswith(('.ts', '.html', '.css', '.json', '.webmanifest')):
        t = rd(f)
        for s in ('Enterprise Platform', 'Enterprise Template', 'Enterprise application template'):
            if s in t: fail.append('"' + s + '" in ' + f)
tok = rd('web/src/styles/tokens.css').lower()
for k, v in [('--color-primary', '#0b2a4a'), ('--color-cta', '#2db34a'),
             ('--color-text-primary', '#2b2b2b'), ('--color-bg-primary', '#ffffff')]:
    if not re.search(re.escape(k) + r'\s*:\s*' + re.escape(v) + r'\s*;', tok): fail.append('token ' + k)
if not re.search(r'--color-cta-hover\s*:\s*#[0-9a-f]{6}', tok): fail.append('token --color-cta-hover')
css = rd('web/src/styles.css')
if not re.search(r'\.btn-primary[^{]*\{[^}]*var\(--color-cta\)', css): fail.append('global .btn-primary not var(--color-cta)')
hdr = glob.glob('web/src/app/shared/**/site-header*.ts', recursive=True)
if not hdr: fail.append('site-header component missing')
else:
    h = ''.join(rd(p) for p in hdr)
    for s in ['Ferguson Pest Control', 'position: sticky', 'tel:+18149422290', '(814) 942-2290',
              'Book a treatment', '/book', 'Services', 'My appointments', 'Log in', 'var(--color-primary)']:
        if s not in h: fail.append('header missing ' + s)
if not glob.glob('web/src/app/shared/**/service-card*.ts', recursive=True): fail.append('service-card component missing')
land = rd('web/src/app/landing/landing.component.ts')
for s in ['Pest-free homes, booked in minutes',
          'Pick a treatment, choose a time that suits you, and a licensed local technician will be there.',
          'Licensed &amp; insured', 'Same-week appointments', 'Reminders before every visit', 'Satisfaction guaranteed',
          'How it works', 'Choose a treatment', 'Pick a time', 'We arrive', 'Book a treatment',
          'api/services', 'app-service-card', 'app-site-header', '(814) 942-2290']:
    if s not in land and s.replace('&amp;', '&') not in land: fail.append('landing missing ' + s)
for s in ['General pest treatment', 'Termite inspection', 'Rodent exclusion', 'Mosquito treatment', 'Bed bug treatment']:
    if s in land: fail.append('landing hard-codes service ' + s)
svc = rd('web/src/app/features/services/services.component.ts')
if 'app-service-card' not in svc: fail.append('/services does not use app-service-card')
for t in ['service-form', 'service-name', 'service-duration', 'service-price', 'service-submit',
          'service-list', 'service-item', 'service-empty', 'api/services/mine']:
    if t not in svc: fail.append('/services lost ' + t)
if fail:
    print('FAIL:'); [print('  ' + x) for x in fail]; sys.exit(1)
print('static OK')
PY
# No-remote dependency guard: blob hashes of web/package.json + lock as on main 65a3f9d (oracle runs without an origin remote).
[ "$(git hash-object web/package.json)" = "a7b6c59e634c294e60975547d0354f636c8608eb" ] || { echo 'FAIL: web/package.json changed (no new deps allowed)'; exit 1; }
[ "$(git hash-object web/package-lock.json)" = "f34eaf09b9b6a8f0d95c2d11dfabdd3c7d2cdcff" ] || { echo 'FAIL: web/package-lock.json changed (no new deps allowed)'; exit 1; }
cd web
npm ci --include=dev >/dev/null 2>&1
if ! npx ng build --configuration production >/tmp/ngb-l2.log 2>&1; then tail -40 /tmp/ngb-l2.log; exit 1; fi
echo L2-OK
