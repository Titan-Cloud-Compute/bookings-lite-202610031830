#!/usr/bin/env bash
# Oracle: L3 booking pages restyle — colours and spacing only.
# Prints "L3-OK" and exits 0 when all checks pass; exits 1 on any failure.

set -euo pipefail

BOOK="web/src/app/features/appointments/book-appointment.component.ts"
MY="web/src/app/features/appointments/my-appointments.component.ts"
PROV="web/src/app/features/appointments/provider-dashboard.component.ts"

fail() { echo "FAIL: $*" >&2; exit 1; }

# 1. No raw 'white' in the styles blocks of any of the three files
for f in "$BOOK" "$MY" "$PROV"; do
  if grep -q "background: white" "$f"; then
    fail "$f still contains 'background: white' — replace with var(--color-surface)"
  fi
done

# 2. h1 must use var(--color-primary) in each file
for f in "$BOOK" "$MY" "$PROV"; do
  if ! grep -q "color: var(--color-primary)" "$f"; then
    fail "$f: h1/heading color must be var(--color-primary)"
  fi
done

# 3. Cards must use var(--color-surface), var(--radius-lg), var(--shadow-sm) and padding >= 1.75rem
for f in "$BOOK" "$MY" "$PROV"; do
  if ! grep -q "background: var(--color-surface)" "$f"; then
    fail "$f: .card must use background: var(--color-surface)"
  fi
  if ! grep -q "var(--radius-lg)" "$f"; then
    fail "$f: .card must use var(--radius-lg)"
  fi
  if ! grep -q "var(--shadow-sm)" "$f"; then
    fail "$f: .card must include box-shadow: var(--shadow-sm)"
  fi
  # padding must be 1.75rem or 2rem (generous)
  if ! grep -E "padding: (1\.75rem|2rem)" "$f" > /dev/null 2>&1; then
    fail "$f: .card must have padding of 1.75rem or 2rem"
  fi
done

# 4. Selected slot in book-appointment must use primary colour tokens
if ! grep -q "var(--color-primary-light)" "$BOOK"; then
  fail "$BOOK: .slot.selected must include background: var(--color-primary-light)"
fi
if ! grep -q "border-color: var(--color-primary)" "$BOOK"; then
  fail "$BOOK: .slot.selected must include border-color: var(--color-primary)"
fi

echo "L3-OK"
