# Design
## Car Dealership Inventory System — UI/UX & Component Design

## 1. Visual Direction
A clean, modern showroom feel: confident typography, generous white space, one strong accent color for primary actions (Purchase, Save), and a neutral palette otherwise so the vehicle cards stay the visual focus.

- **Type:** a single sans-serif (Tailwind's default stack, or Inter), bold weights for prices and headings.
- **Color:** neutral gray/white base; one accent (blue or amber) reserved for primary buttons and "in stock" badges; a muted red/gray reserved for "out of stock" states.
- **Density:** card-based grid for the vehicle dashboard, generous padding — this is a browsing experience, not a dense admin table (the admin controls are the one place a tighter, table-like layout makes sense).

## 2. Key Screens
1. **Login / Register** — centered card, minimal fields, inline validation errors, a link to switch between the two.
2. **Dashboard** — a search/filter bar on top, a responsive grid of vehicle cards below (make, model, category badge, price, quantity, Purchase button).
3. **Vehicle Card** (component) — image or placeholder, make + model, category badge, price, a stock indicator, and the Purchase button (disabled and relabeled "Out of Stock" at qty 0).
4. **Admin Panel** — only rendered when `role === 'admin'`: an "Add Vehicle" button opens a form modal, and each card gets inline Edit / Delete / Restock controls.
5. **Vehicle Form Modal** — shared by Add and Edit (same fields: make, model, category, price, quantity), with the submit label changing based on mode.

## 3. Component Tree
```
App
├── AuthProvider (context: user, token, login, logout)
├── Navbar (Login/Register links, or user name + Logout + Admin badge)
├── LoginPage
│   └── LoginForm
├── RegisterPage
│   └── RegisterForm
└── DashboardPage
    ├── SearchFilterBar (make, model, category, price range)
    ├── VehicleGrid
    │   └── VehicleCard[] (Purchase button; Edit/Delete/Restock if admin)
    └── VehicleFormModal (Add / Edit, admin only)
```

## 4. Core User Flows
- **Browse → Purchase:** land on the Dashboard → filter/search → click Purchase → quantity decrements (optimistic update, then confirmed against the API response) → the button disables itself the moment quantity hits 0.
- **Admin → Add Vehicle:** log in as admin → Dashboard shows "Add Vehicle" → fill out the modal → the new card appears in the grid.
- **Admin → Restock:** click Restock on a low/zero-quantity card → quantity increases → the Purchase button re-enables.

## 5. State Management
Kept intentionally simple for a kata's scope — no Redux/Zustand needed:
- `AuthContext` — holds the JWT and decoded user (id, role); exposes `login`, `register`, `logout`.
- Vehicle data — fetched per-page with a small `useVehicles` hook wrapping `fetch`; refetch (or optimistic update) after purchase/restock/add/edit/delete.

## 6. Responsive & Accessibility Notes
- Grid: 1 column on mobile, 2–3 columns on tablet/desktop (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3`).
- Every form input gets a real `<label>` tied to it (not just placeholder text) — cheap to do, and its absence is easy for a reviewer to spot.
- The disabled Purchase button needs a real state change, not just lower opacity — swap the label to "Out of Stock" so it reads correctly for screen readers too.
