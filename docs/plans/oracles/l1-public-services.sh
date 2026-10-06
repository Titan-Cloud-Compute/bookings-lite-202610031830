#!/usr/bin/env bash
# Oracle: L1 — GET /api/services is public (anonymous visitors can see service cards)
set -euo pipefail

CTRL="backend/src/features/services/services.controller.ts"
SPEC="backend/src/features/services/services.spec.ts"

fail() { echo "FAIL: $*" >&2; exit 1; }

# 1. @Public() decorator is applied to listBookable
grep -q "@Public()" "$CTRL" || fail "@Public() not found in $CTRL"

# 2. @RequireUser() is NOT on listBookable (was the old decoration)
# Check that RequireUser is not imported or used at all
if grep -q "RequireUser" "$CTRL"; then
  fail "RequireUser still present in $CTRL — should have been removed"
fi

# 3. Public decorator is imported from the correct path
grep -q "from '../../auth/decorators/public.decorator'" "$CTRL" || fail "Public import not found in $CTRL"

# 4. listMine and create still use @RequireManager()
grep -q "@RequireManager()" "$CTRL" || fail "@RequireManager() not found in $CTRL"

# 5. Spec imports IS_PUBLIC_KEY and tests metadata
grep -q "IS_PUBLIC_KEY" "$SPEC" || fail "IS_PUBLIC_KEY not referenced in $SPEC"
grep -q "listBookable.*@Public\|IS_PUBLIC_KEY.*listBookable\|listBookable.*IS_PUBLIC_KEY" "$SPEC" || \
  grep -q "IS_PUBLIC_KEY, ServicesController.prototype.listBookable" "$SPEC" || \
  fail "No IS_PUBLIC_KEY check for listBookable in $SPEC"

# 6. Run the backend tests for the services feature
cd backend
npx jest --testPathPatterns="services.spec" --passWithNoTests 2>&1 | tail -20
TEST_EXIT=${PIPESTATUS[0]}
cd ..

[ "$TEST_EXIT" -eq 0 ] || fail "Jest tests failed (exit $TEST_EXIT)"

echo "L1-OK"
