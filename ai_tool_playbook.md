# AI Tool Playbook
## Car Dealership Inventory System

This file answers one question in three parts: which tool fits which kind of task, how the project's actual work splits across Cursor / Codex / Antigravity, and the prompts to start each piece with. Read it alongside `implementation_plan.md`, which has the phase order — this file cuts across those phases by tool instead.

## 1. Pick the tool by task shape, not by preference

| If the task is... | Use | Because |
|---|---|---|
| A single failing test you want made to pass, watched step by step | **Cursor** | Agent Mode edits your open files and runs terminal commands live — you see every step, which is what an honest Red-Green-Refactor commit needs |
| A well-specified, repetitive, self-contained chunk (a whole CRUD module, a batch of similar components) | **Codex** | Clones the repo into a sandbox, runs the tests itself, and comes back with a diff — good to fire off and let run while you do something else |
| "Does this actually work when a human clicks through it" | **Antigravity** | Its agents drive a real Chrome browser, so it can register/log in/purchase/etc. through your actual running UI and report back with screenshots |
| Boring and mechanical (dependency bump, lint sweep, a batch rename) | **Cursor's Background Agents** or **Codex** | Neither needs your judgment mid-task — let it run and review the PR when it's done |

The rule that applies to all three: you write, or at minimum read and understand, the test before the tool writes the implementation. That's what keeps this from being generic vibe coding and turns it into a defensible Red-Green-Refactor history.

## 2. The actual task split

| Task | Tool | Notes |
|---|---|---|
| Backend scaffold (Express/TS/Prisma/Jest) | Cursor | Fast and iterative — you want to see it run immediately |
| Frontend scaffold (Vite/React/Tailwind/Router) | Cursor | Same reason |
| Auth: register/login/JWT middleware | Cursor | Security-sensitive — the place you most want to review every line as it's written |
| Vehicle CRUD (add/list/update/delete) | Codex | Once the layered pattern exists from Auth, this is repetitive enough to delegate wholesale against a pre-written test file |
| Search endpoint | Codex | Mostly query-param plumbing against an established repository pattern — can run in parallel with whatever you're doing in Cursor |
| Purchase / restock (stock validation, admin gating) | Cursor | Enough edge-case nuance (409 on zero stock, 403 on non-admin) that you want the tight loop |
| Auth UI (forms + AuthContext) | Cursor to build → **Antigravity to verify** | Build it, then have Antigravity actually register and log in through the browser to confirm the flow matches `design.md` |
| Dashboard / search-filter / vehicle cards | Codex to build → **Antigravity to verify** | Well-specified from `design.md`'s component tree; verify the disabled-at-zero-stock behavior visually afterward |
| Admin panel (add/edit/delete/restock UI) | Codex to build → **Antigravity to verify** | Same pattern — delegate the build, verify end-to-end as an admin user |
| Test coverage gaps | Cursor | You want to see exactly what's untested and fill it deliberately, not have an agent invent tests to hit a number |
| Screenshots for the README | **Antigravity** | Its verification passes already produce screenshots — reuse them instead of taking new ones by hand |
| README / PROMPTS.md writing | You | The one deliverable that should stay entirely yours — see §7 |

## 3. Running two tools at once
Because Codex runs in its own sandbox and Antigravity runs its own agents, you're not limited to one tool at a time. A realistic sequence: kick off Codex on the Vehicle CRUD module against your finished test file, then immediately switch to Cursor and start the Purchase/restock TDD loop while Codex works in the background. Check Codex's diff when you hit a natural break. That's real parallelism, not tool-switching for variety.

## 4. Prompts — Cursor

**Backend scaffold:**
> Scaffold an Express + TypeScript backend matching the folder structure in architecture.md — routes/controllers/services/repositories/middleware — with Prisma configured for SQLite using the User and Vehicle models from architecture.md §3. Add a GET /api/health route returning { status: 'ok' }, and set up Jest + Supertest so `npm test` runs. Don't implement anything beyond the health check yet.

**One TDD step (repeat per behavior):**
> Here's a failing test in tests/auth.test.ts: [paste the test]. Implement only enough code across src/controllers, src/services, and src/repositories to make it pass, following the layered structure in architecture.md. Don't add validation or behavior the test doesn't require yet — we'll write the next failing test after this one is green.

**Refactor step:**
> This test is green. Refactor AuthService and AuthController for clarity and single-responsibility without changing behavior. Re-run the tests after each change to confirm they still pass.

**Purchase logic (the nuanced one):**
> Here's the failing test suite for POST /api/vehicles/:id/purchase — successful purchase decrements quantity, 409 on zero stock, 404 on an unknown id. Implement VehicleService.purchase() and the route to satisfy all three, reusing the existing requireAuth middleware.

**Frontend scaffold:**
> Scaffold a Vite + React + TypeScript + Tailwind frontend per the component tree in design.md. Set up React Router with routes for /login, /register, and / (dashboard), and an empty AuthContext provider wrapping the app. Skeleton and routing only — no feature logic yet.

## 5. Prompts — Codex

**Vehicle CRUD (delegate the whole module):**
> Here is architecture.md's API contract and the full test file tests/vehicles.test.ts, covering POST, GET, PUT, DELETE /api/vehicles. Implement VehicleController, VehicleService, and VehicleRepository so every test in that file passes, following the pattern already established in src/controllers/AuthController.ts and src/services/AuthService.ts. Don't modify auth code or the test files. Return a diff for review.

**Search endpoint:**
> Implement GET /api/vehicles/search per architecture.md's API contract — filter by make, model, category (exact match), and price range via minPrice/maxPrice query params, case-insensitive on make and model. Tests are in tests/search.test.ts. Match the existing VehicleRepository pattern.

**Admin panel UI:**
> Using design.md's component tree and the API client pattern in src/api/vehicles.ts, build VehicleFormModal (shared Add/Edit), a Delete confirmation, and a Restock control. All three should render only when useAuth().user.role === 'admin'. Match the existing Tailwind conventions in VehicleCard.tsx.

## 6. Prompts — Antigravity

**Auth flow verification:**
> Run the app locally, register a new user through the UI, then log in. Confirm the JWT is stored and the Navbar switches to the logged-in state. Screenshot each step and flag anything that doesn't match the flow in design.md.

**Purchase + disabled-button check:**
> Log in as a regular user, purchase a vehicle that has stock, and confirm the quantity decrements and the button disables and relabels once it hits zero. Screenshot the card before and after.

**Admin smoke test:**
> Log in as an admin, add a new vehicle through the UI, edit its price, restock a low-quantity vehicle, then delete a different one. Confirm each change reflects immediately in the dashboard, and screenshot after each action.

**README screenshot pass:**
> Walk through the full app — register, login, browse, search/filter, purchase, and (as admin) add/edit/delete/restock — and capture a clean screenshot of each screen for the README.

## 7. A note on PROMPTS.md
Everything above is a starting point, not the deliverable. `PROMPTS.md` is supposed to be your *actual* chat history — including the prompt that didn't work, the follow-up correction, the time you had to tell a tool to stop touching a file it shouldn't have. Copying this playbook in verbatim and calling it your prompt history would misrepresent the work, and it's a thin cover in an interview where you're asked to walk through it. Use these prompts, then log what really happened.
