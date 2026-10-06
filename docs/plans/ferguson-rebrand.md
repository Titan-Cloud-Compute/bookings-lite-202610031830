# Ferguson Pest Control rebrand (Bookings Lite)

## Goal
Restyle Bookings Lite as "Ferguson Pest Control" (operator: name Ferguson, text logo, option (a) public service list).
Every booking feature must keep working: services, availability, book, cancel, reminders, provider dashboard.

## Operator decisions (2026-10-06)
- Brand name: **Ferguson Pest Control** (brief said Tanner; ugotpest.com is Ferguson). Text logo.
- Phone: assumed real number from ugotpest.com, (814) 942-2290, tel:+18149422290.
- Option (a): `GET /api/services` becomes public (`@Public()`), read-only, so anonymous visitors see the service cards. Only backend change allowed.

## Pattern & sources
- Design tokens (`web/src/styles/tokens.css`) are the single source of colour; components use `var(--token)` only. New `--color-cta`/`--color-cta-hover` for the green CTA, used only on buttons.
- One shared presentational `ServiceCardComponent` (standalone, input-driven) reused by `/` and `/services` (Angular smart/dumb component split).
- Shared `SiteHeaderComponent` / `SiteFooterComponent` (sticky navy header, `position: sticky; top: 0`).
- Public route via existing `@Public()` decorator (`backend/src/auth/decorators/public.decorator.ts`), same as auth.controller.
- Design refs: aptivepestcontrol.com Provo page, americanpest.net DC page.

## Scope fence
- Change: web/src/** (styles, templates, new shared components), plus `services.controller.ts` + its spec (public list).
- Do NOT change: booking backend logic, prisma schema/migrations, API routes paths, login/signup flow, route paths, any form field / data-testid / http call in booking pages. No new npm deps (inline SVG icons).

## Tree (docs/plans/ferguson-rebrand.tree.json)
- L1 backend public service list — oracle: @Public on listBookable, no @RequireUser on it, services jest spec passes.
- L2 brand shell + landing + service card + /services — oracle: title, tokens, strings, landing copy, sticky header, card reuse, ng build.
- L3 booking pages restyle (book, appointments, provider dashboard) — oracle: no data-testid / api diff vs origin/main, headings navy, ng build.

## Lead steps after land (not leaves)
1. Rebuild via by-bridge/:id/rebuild; confirm live.
2. Seed the 5 services as the MANAGER via POST /api/services (existing create path).
3. Live checks: title/h1/sticky navy header/green buttons; visitor books Termite inspection; provider sees it on /dashboard and slot gone; cancel → slot back.
4. Screenshots of / and /book; reply with SHA + staging URL.

## Cursor
- 2026-10-06: plan written; oracles verified fail-before. Tree armed: rootId 4d6143d3-f49f-445c-ad39-52d1ecc174af, workflow goal-tree-4d6143d3…, backstop wakeup 1407d273 (90 min).
- RISK: local commits (plan + oracles, 821b558) could not be pushed (no GitHub creds in this worktree); origin/main is still 2f7a3bf. If workers fail on `test -f docs/plans/oracles/...`, that is why. Fix the push path, then re-arm.
- 2026-10-06 23:52: tree 4d6143d3 L1 hit REDECOMPOSE (3x rc1). Root cause: oracle scripts not on origin → attempt 3 failed `test -f`; attempts 1-2 wrote their own (weaker) oracle files. Attempt 1 code (worker/a43e2906) was correct. Cancelled 4d6143d3. Re-armed as ferguson-rebrand.v2.tree.json with oracles embedded (base64) in each verify expr so no push is needed.
- 2026-10-06 23:52: v2 armed — rootId 6321d3de-5f4b-47e1-890a-410b0c5544e1, backstop d2b8b8b3 (90 min). Oracles embedded via bash -c base64; verified fail-before.
- Next: on terminal wake → re-run the oracles on merged main, rebuild, seed the 5 services as MANAGER, run live checks, take screenshots.
