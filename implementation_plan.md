# Implementation Plan
## Car Dealership Inventory System

Read this alongside `Product_Requirements.md` (the what), `architecture.md` (how it's built), and `design.md` (the UI). This file is the order of operations, phase by phase, with a suggested AI tool and a starter prompt for each. For the full prompt library organized by tool instead of by phase, see `ai_tool_playbook.md`.

## Dividing the work across Cursor, Codex, and Antigravity
- **Cursor** — the tight in-editor loop. Agent Mode writes code, runs terminal commands, and iterates directly in the files you have open; Background/Cloud Agents are there for handing off repetitive chores (a dependency bump, a lint sweep) as a PR you review on your own time. This is the tool for the actual Red-Green-Refactor cycle, where you want to watch each step.
- **Codex** — CLI, IDE extension, or cloud agent that clones the repo into an isolated sandbox, edits files, runs tests, and comes back with a diff and logs. Good for delegating a whole well-specified chunk once you've defined the shape (e.g., "implement this CRUD module against these already-written tests"), and it can run more than one task in parallel. Read every line before merging — in head-to-head reviews its first-pass output trails hand-reviewed alternatives, so budget a refactor pass.
- **Antigravity** — Google's agent-first IDE, with a Manager surface for running several agents in parallel and a genuinely useful trick: its agents can drive an actual Chrome browser to click through your running app and verify behavior, returning a "Walkthrough" with screenshots. Good for a late-phase sanity check rather than writing the core logic — e.g., confirming the Purchase button really disables at quantity 0, without you clicking through it by hand.

None of this is a hard rule — use whichever tool you're fastest in. What actually gets graded is that **you** can explain every decision afterward, so treat all three the same way: read the diff, run the tests yourself, understand why it works.

## Phase 0 — Setup
- `git init`, create `backend/` and `frontend/`, add the four planning docs at the repo root.
- Backend: `npm init`, install Express, TypeScript, Prisma, Jest, Supertest, `jsonwebtoken`, `bcrypt`.
- Frontend: `npm create vite@latest` (React + TS template), install Tailwind.
- Prisma: define `User` + `Vehicle` (see `architecture.md` §3), run the first migration.
- First test: `GET /api/health` → `200 { status: 'ok' }`. RED → implement → GREEN → commit.

> **Prompt (Cursor):** "Scaffold an Express + TypeScript backend with the folder structure in architecture.md, Prisma configured for SQLite, and a GET /api/health route returning { status: 'ok' }. Set up Jest + Supertest so `npm test` runs."

## Phase 1 — Auth
- RED/GREEN/REFACTOR, one behavior at a time: register success → duplicate email (409) → missing fields (400) → login success (200 + JWT) → login with a bad password (401) → JWT middleware rejects a missing/invalid token (401).
- Commit after each green-plus-refactor, not after the whole feature at once — this is what makes the commit history actually show Red-Green-Refactor instead of one giant "add auth" commit.

> **Prompt (Cursor):** "Here's a failing test in tests/auth.test.ts for POST /api/auth/register. Implement only enough in src/controllers, src/services, and src/repositories to make it pass, following the layered structure in architecture.md — don't add anything the test doesn't require yet."

## Phase 2 — Vehicle CRUD (Admin-gated add/update/delete)
- Same TDD loop for POST/GET/PUT/DELETE `/api/vehicles`. Apply `requireAdmin` middleware per the assumption documented in `Product_Requirements.md` §5.

> **Prompt (Codex):** "Given the API contract in architecture.md and the tests already written in tests/vehicles.test.ts, implement VehicleController, VehicleService, and VehicleRepository for POST, GET, PUT, DELETE /api/vehicles. Admin-only routes should use the existing requireAdmin middleware. Open a diff I can review — don't touch the auth code."

## Phase 3 — Search, Purchase, Restock
- `GET /api/vehicles/search` with query filters.
- `POST /api/vehicles/:id/purchase` — decrement by 1, `409` at zero stock.
- `POST /api/vehicles/:id/restock` — admin-only increment.
- Edge cases worth their own test: purchasing a vehicle that doesn't exist (404), a non-admin hitting restock (403).

## Phase 4 — Frontend: Auth
- Vite + Tailwind scaffold, React Router, `AuthContext`, Login/Register pages and forms, at least one RTL test per form (a validation error shows; a successful submit calls the API).

> **Prompt (Antigravity):** "Run the app, register a new user through the UI, log in, and confirm the JWT is stored and the Navbar switches to the logged-in state. Report anything that doesn't match the flow in design.md, with screenshots."

## Phase 5 — Frontend: Dashboard, Search, Purchase
- `VehicleGrid` + `VehicleCard`, `SearchFilterBar` wired to the search endpoint, the Purchase button — this is the one frontend behavior worth a dedicated test: **the button is disabled and relabeled at quantity 0.**

## Phase 6 — Frontend: Admin Panel
- Add/Edit modal (one shared component, mode prop), Delete confirmation, Restock control — all conditionally rendered on `role === 'admin'`.

## Phase 7 — Polish & Deliverables
- Responsive pass, empty/loading/error states, a quick accessibility check (labels, focus states).
- `README.md`: project explanation, backend + frontend setup steps, screenshots, the test report (`npm test -- --coverage` output), and the **My AI Usage** section.
- Finalize `PROMPTS.md` — this should already be a running log by this point, not something reconstructed from memory. Group entries by phase; for each one, note the tool, the prompt, and one line on what you kept vs. changed.
- Double-check every AI-assisted commit has a `Co-authored-by` trailer, e.g.:
  ```
  Co-authored-by: Cursor <cursor@users.noreply.github.com>
  Co-authored-by: OpenAI Codex <codex@users.noreply.github.com>
  Co-authored-by: Google Antigravity <antigravity@users.noreply.github.com>
  ```
- Optional: deploy the backend + DB (Render/Railway/Fly + hosted Postgres) and the frontend (Vercel/Netlify).

## If you'd rather use Python or Ruby
The phase order doesn't change — only the tool names inside each prompt:
- **FastAPI:** Pydantic models instead of DTOs, `pytest` + `httpx.AsyncClient` instead of Jest/Supertest, SQLAlchemy or SQLModel instead of Prisma.
- **Rails:** RSpec request specs instead of Jest/Supertest, ActiveRecord instead of Prisma, Devise (or a hand-rolled JWT concern) for auth. Expect more implicit "magic" for the AI tools to get right — read the generated migrations and associations especially carefully.
