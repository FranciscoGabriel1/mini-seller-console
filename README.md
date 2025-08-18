# Mini Seller Console

A lightweight React + Tailwind app to triage **Leads** and convert them into **Opportunities**.

## Description

This mini CRM lets you:
- Load a local JSON list of **Leads**
- **Search** (name/company), **filter** (status), and **sort** (score asc/desc)
- Open a **slide-over detail panel** for inline edits (email with validation, status)
- **Edit score inline** with optimistic updates and rollback on failure
- **Convert Lead → Opportunity** (stage + optional amount) and view them in a table
- Persist UI state (search/filter/sort) and opportunities via **localStorage**
- Handle loading, empty and error states smoothly

**Tech stack:** React (Vite) · TypeScript · Tailwind CSS v4 · Vitest + React Testing Library · ESLint + Prettier

---

## Prerequisites

- **Node.js ≥ 20.x**
- A package manager:
  - **pnpm** (recommended) or **npm** / **yarn**

> Check your versions:
```bash
node -v
pnpm -v    # or: npm -v / yarn -v
```

## Install
```bash
# clone the repo
git clone https://github.com/FranciscoGabriel1/mini-seller-console.git
cd mini-seller-console

# install deps (choose one)
pnpm install
# npm install
# yarn install
```
## Run
```bash
pnpm dev
# or: npm run dev
# or: yarn dev
```

## Other useful scripts
```bash
# build for production
pnpm build

# preview the production build locally
pnpm preview

# lint sources
pnpm lint

# run tests (no script alias by default)
pnpm vitest
# or with UI
pnpm vitest --ui

```