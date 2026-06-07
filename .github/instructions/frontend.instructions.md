---
applyTo: "frontend/**/*.{ts,tsx}"
---

# Frontend TypeScript Instructions

## Style & Formatting
- Enforce with ESLint + Prettier
- Use strict TypeScript (`strict: true` in tsconfig)
- Use `kebab-case` for filenames (e.g., `regulation-card.tsx`)
- Use `PascalCase` for components and types, `camelCase` for variables/functions

## Components
- Use named exports, not default exports
- Define a TypeScript interface for all component props
- Prefer React Server Components; add `"use client"` only when needed
- Use Tailwind CSS utility classes with shadcn/ui primitives
- Handle loading, error, and empty states explicitly

## State Management
- Use React Server Components for data fetching when possible
- Use `useState`/`useReducer` for local client state
- Avoid global state libraries unless absolutely necessary

## Imports
- Use path aliases: `@/components`, `@/lib`, `@/types`
- Group: React/Next → third-party → local, separated by blank lines

## Error Handling
- Use Error Boundaries for component-level error recovery
- Use `try/catch` in async functions with user-friendly error messages
- Validate external data with Zod schemas

## Internationalization (i18n)
- The application MUST support English (`en`) and Spanish (`es`) with English as the default locale
- Use `next-intl` as the translation library (compatible with App Router)
- Use `[locale]` dynamic segment in the App Router for locale-based routing (e.g., `/en/contracts`, `/es/contracts`)
- Store all user-facing strings in JSON translation files under `frontend/messages/` (`en.json`, `es.json`)
- Organize translation keys by feature/page (e.g., `common`, `contracts`, `alerts`, `organizations`, `dashboard`)
- Never hardcode user-facing strings in components — always use the `useTranslations()` hook
- Include a `LanguageSwitcher` component in the main navigation/header
- Persist the user's language preference via cookie
- Use `Intl.DateTimeFormat` and `Intl.NumberFormat` for locale-aware date/number formatting
- For AI-generated content (summaries, analysis), pass the user's locale to the backend API so responses are generated in the correct language
- When adding new UI text, always add entries to BOTH `en.json` and `es.json`

## Testing
- Use Vitest for unit/component tests
- Use Testing Library (`@testing-library/react`) for component assertions
- Test user behavior, not implementation details
