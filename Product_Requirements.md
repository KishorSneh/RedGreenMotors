# Product Requirements Document
## Car Dealership Inventory System

## 1. Objective
A full-stack inventory management system for a car dealership: a RESTful backend API backed by a real database, and a React SPA frontend, built with a visible Test-Driven Development (Red-Green-Refactor) history and transparent AI-tool usage, per the kata brief.

## 2. Users & Roles
- **Guest** — unauthenticated visitor; can register or log in. No inventory access.
- **User** (registered, default role) — can browse, search, and purchase vehicles.
- **Admin** — everything a User can do, plus add, update, delete, and restock vehicles.

## 3. Functional Requirements

### 3.1 Authentication
- FR-1: A guest can register with name, email, password → account created with role `user`.
- FR-2: A guest can log in with email + password → receives a JWT.
- FR-3: All `/api/vehicles*` routes require a valid JWT (`401` if missing/invalid).
- FR-4: Admin-only routes reject non-admin tokens (`403`).

### 3.2 Vehicle Inventory
- FR-5: Any authenticated user can list all vehicles (`GET /api/vehicles`), **including** out-of-stock ones — the frontend has to *show* zero-quantity vehicles with a disabled Purchase button, so the API can't filter them out.
- FR-6: Any authenticated user can search/filter vehicles by make, model, category, and price range (`GET /api/vehicles/search`).
- FR-7: An admin can add a vehicle (`POST /api/vehicles`).
- FR-8: An admin can update a vehicle's details (`PUT /api/vehicles/:id`).
- FR-9: An admin can delete a vehicle (`DELETE /api/vehicles/:id`).
- FR-10: Any authenticated user can purchase a vehicle (`POST /api/vehicles/:id/purchase`), decrementing quantity by 1. Rejected with `409` if quantity is already 0.
- FR-11: An admin can restock a vehicle (`POST /api/vehicles/:id/restock`), incrementing quantity.

### 3.3 Frontend
- FR-12: Registration and login forms with validation and error states.
- FR-13: A dashboard listing all vehicles (make, model, category, price, quantity).
- FR-14: Search/filter controls wired to `GET /api/vehicles/search`.
- FR-15: A Purchase button per vehicle, disabled (and relabeled) when quantity is 0.
- FR-16: Admin-only add/edit/delete/restock UI, hidden for non-admin users.
- FR-17: Responsive layout (mobile → desktop), built with Tailwind.

## 4. Non-Functional Requirements
- NFR-1: Real Red-Green-Refactor commit history — tests committed before (or alongside, clearly noted) the implementation that makes them pass.
- NFR-2: SOLID / clean-code structure — layered backend (routes → controllers → services → repositories), meaningful names, no dead code.
- NFR-3: Passwords hashed (bcrypt or equivalent) — never stored or returned in plaintext.
- NFR-4: Every commit that used AI assistance carries a `Co-authored-by` trailer for the tool used.
- NFR-5: `README.md` includes setup steps, screenshots, a test report, and a "My AI Usage" section.
- NFR-6: `PROMPTS.md` at the repo root logs the real prompt history across all tools used, kept current as you go — not reconstructed at the end.

## 5. Assumption Called Out: Admin Scope
The kata's backend section only marks **DELETE** and **restock** as "(Admin only)" — POST (add) and PUT (update) are just listed as "Protected," with no admin qualifier. But the frontend section groups add/update/delete together under **"(For Admin Users)"**. Those two read as inconsistent with each other.

**Resolution used in this plan:** gate all four vehicle-mutating endpoints (add, update, delete, restock) as Admin-only, both in the backend guard and the frontend UI. It's the more secure, internally consistent reading, and it's worth being ready to explain in the interview — the ambiguity is real in the source doc, and defending the interpretation you chose is exactly the kind of judgment call this exercise is testing for.

## 6. Other Assumptions
- "Purchase" decrements quantity by exactly 1 per call (not a client-specified amount).
- The backend independently re-validates stock on purchase — a disabled frontend button is a UX nicety, not the enforcement mechanism.
- Search matching is case-insensitive on make/model; category is an exact match against a small fixed set (e.g., Sedan, SUV, Truck, Coupe, Hatchback).

## 7. Out of Scope
- Real payment processing (purchase just decrements quantity).
- Multi-tenant dealerships / multiple locations.
- An image upload pipeline (a static placeholder or an image-URL field is enough).

## 8. Deliverables Checklist
- [ ] Public Git repo, frequent descriptive commits
- [ ] Backend API (all endpoints above) + real database (not in-memory)
- [ ] React/Tailwind SPA (all frontend requirements above)
- [ ] Test suite with meaningful coverage, visible TDD history
- [ ] `README.md` — explanation, setup (backend + frontend), screenshots, My AI Usage section, test report
- [ ] `PROMPTS.md` — full AI chat history at repo root
- [ ] AI co-author trailers on every AI-assisted commit
- [ ] (Optional) Live deployment link
