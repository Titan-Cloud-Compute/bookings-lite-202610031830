#!/usr/bin/env bash
# Oracle: verify GET /api/services is public (IS_PUBLIC_KEY metadata set on listBookable).
# Prints L1-OK on success; exits non-zero on failure.
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
cd "$REPO_ROOT/backend"

npx jest "src/features/services/services.spec.ts" --no-coverage --forceExit 2>&1

echo "L1-OK"
