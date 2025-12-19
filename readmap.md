# Roadmap to V1.0.0

## Phase 0 — Foundations (Planning)
**Goal:** Lock scope and philosophy before writing code.

- [x] Define core principles
- [x] Choose project name & namespace
- [x] Decide browser support (e.g. modern evergreen browsers)
- [x] Write a 1-page philosophy / README draft

---

## Phase 1 — Core DOM Engine (MVP)
**Goal:** Minimal but usable framework.

### Core API
- [x] Element creation
  - Attributes
  - Classes
  - Event listeners (`onClick`, etc.)
- [x] Text node handling
- [x] Nested children support

### Mounting
- [x] Basic mounting to parent elements
- [x] Optional `clear()` helper

### Error Handling
- [ ] Helpful runtime errors for invalid tags or props
- [x] Safe handling of `null` / `undefined` children

---

## Phase 2 — Styling System
**Goal:** Clean default UI without locking users in.

### Default CSS
- [x] Reset / normalize
- [x] Typography defaults
- [x] Spacing system
- [ ] Color palette
- [ ] Border radius & shadows
- [ ] CSS variables for theming

### Base Classes
- [x] `.container`
- [x] `.column` (vertical layout)
- [x] `.row`
- [x] `.grid`

---

## Phase 3 — Components v1
**Goal:** Cover common UI needs.

### Basic Components
- [ ] Button
- [ ] Card
- [ ] Badge
- [ ] Divider

### Layout Components
- [ ] Navbar
- [ ] Footer
- [ ] Sidebar

### Forms
- [ ] Text input
- [ ] Checkbox
- [ ] Select
- [ ] Form group

---

## Phase 4 — Interactivity & Behaviors
**Goal:** Enhance UI with minimal JS.

### Built-in Behaviors
- [ ] Dropdown menu
- [ ] Modal
- [ ] Tabs
- [ ] Accordion

### Event Utilities
- [ ] Event delegation helpers
- [ ] Keyboard accessibility helpers
- [ ] Click-outside detection

---

## Phase 5 — Simple State Management (Optional)
**Goal:** Enable small dynamic apps without complexity.

- [ ] `createState(initialValue)`
- [ ] Subscriptions
- [ ] Manual re-render pattern
- [ ] Explicit updates (no auto magic)

---

## Phase 6 — Accessibility & UX
**Goal:** Reasonable defaults without heavy abstraction.

- [ ] ARIA attributes on components
- [ ] Keyboard navigation
- [ ] Focus management for modals
- [ ] Reduced-motion support

---

## Phase 7 — Documentation & Examples
**Goal:** Make the framework easy to adopt.

### Docs
- [ ] Getting Started
- [ ] Core API reference
- [ ] Styling & theming guide
- [ ] Component usage examples

### Examples
- [ ] Static marketing page
- [ ] Dashboard layout
- [ ] Simple interactive app (counter, todo)
- [ ] Form-heavy page

---

## Phase 8 — Extensibility & Add-ons
**Goal:** Keep core small, grow via plugins.

- [ ] Add-on API
- [ ] Official add-ons (menus, modals, etc.)
- [ ] Third-party component support
- [ ] Namespacing conventions

---

## Phase 9 — Optimization & Polish
**Goal:** Stability and performance.

- [ ] Bundle size audit
- [ ] Memory leak checks
- [ ] Event cleanup patterns
- [ ] Performance benchmarks vs vanilla JS

---

## Phase 10 — Release & Community
**Goal:** Public release and feedback loop.

- [ ] v1.0.0 release
- [ ] Website & demo
- [x] GitHub repo
- [ ] Contribution guidelines
- [ ] Issue templates
- [ ] Changelog

---