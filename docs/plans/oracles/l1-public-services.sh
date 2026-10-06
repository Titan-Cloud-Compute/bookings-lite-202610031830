#!/usr/bin/env bash
# L1 oracle: GET /api/services is public; list-mine/create stay manager-only; spec passes. Run from repo root.
set -euo pipefail
python3 - <<'PY'
import re, sys
src = open('backend/src/features/services/services.controller.ts').read()
def decos(name):
    m = re.search(r'((?:\s*@\w+\([^)]*\)\s*)+)\s*' + name + r'\(', src)
    return m.group(1) if m else None
d = decos('listBookable')
if d is None: sys.exit('FAIL: listBookable not found')
if '@Public()' not in d: sys.exit('FAIL: listBookable lacks @Public()')
if '@RequireUser()' in d: sys.exit('FAIL: listBookable still @RequireUser()')
for name in ('listMine', 'create'):
    dd = decos(name)
    if not dd or '@RequireManager()' not in dd or '@Public()' in dd:
        sys.exit('FAIL: ' + name + ' must stay @RequireManager() and not public')
spec = open('backend/src/features/services/services.spec.ts').read()
if 'IS_PUBLIC_KEY' not in spec:
    sys.exit('FAIL: spec has no IS_PUBLIC_KEY assertion for the public list')
print('static OK')
PY
cd backend
npm ci --include=dev >/dev/null 2>&1
npx prisma generate >/dev/null 2>&1 || true
npx jest src/features/services
echo L1-OK
