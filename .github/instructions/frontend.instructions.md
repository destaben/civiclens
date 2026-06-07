---
applyTo: "frontend/**/*.{ts,tsx}"
---

# Frontend TypeScript Instructions

## Style & Formatting
- Enforce with ESLint + Prettier
- Use strict TypeScript (`strict: true` in tsconfig)
- Use `kebab-case` for filenames (e.g., `contract-card.tsx`)
- Use `PascalCase` for components and types, `camelCase` for variables/functions

## Components
- Use named exports, not default exports
- Define a TypeScript interface for all component props
- Prefer React Server Components; add `"use client"` only when needed. Note: hooks such as `useTranslations()` from next-intl require either `"use client"` or the equivalent server-side `getTranslations()` API — prefer `getTranslations()` in Server Components to preserve RSC benefits.
- Use Tailwind CSS utility classes with shadcn/ui primitives
- Handle loading, error, and empty states explicitly

## State Management
- Use React Server Components for data fetching when possible
- Use `useState`/`useReducer` for local client state
- Do not use global state libraries (e.g., Zustand, Redux). If state must be shared across distant components, use React Context with `useReducer`. Only introduce a global state library if Context causes measurable performance issues and document the reason with a comment.

## Imports
- Use path aliases: `@/components`, `@/lib`, `@/types`
- Group: React/Next → third-party → local, separated by blank lines

## Error Handling
- Use Error Boundaries for component-level error recovery
- Use `try/catch` in async functions with user-friendly error messages
- Validate external data with Zod schemas. When a Zod schema parse fails, log the `ZodError` to the console in development. In production, log to the error tracking service and render the nearest Error Boundary fallback by re-throwing the error. Do not silently swallow Zod errors or render partially-typed data.

## Internationalization (i18n)

### Component Authoring Rules
_(Apply these every time you create or edit a component)_
- Never hardcode user-facing strings. In Server Components use `getTranslations()` from next-intl; in Client Components use the `useTranslations()` hook.
- When adding new UI text, always add entries to BOTH `en.json` and `es.json` under the same key path.
- Organize translation keys by feature/page (e.g., `common`, `contracts`, `alerts`, `organizations`, `dashboard`).
- Use `Intl.DateTimeFormat` and `Intl.NumberFormat` (or next-intl's `useFormatter`) for locale-aware date/number formatting — never format manually.
- Configure next-intl with `onError: "ignore"` and a `getMessageFallback` that falls back to the `en` translation when a key is missing in another locale. Never let a missing key surface a raw key string or throw in production.

### Architecture & Infrastructure
_(One-time setup rules — apply when scaffolding or modifying routing/middleware)_
- Use `next-intl` as the translation library (compatible with App Router).
- Use a `[locale]` dynamic segment in the App Router for locale-based routing (e.g., `/es/contratos`, `/en/contracts`). Spanish (`es`) is the default locale.
- Store translation files under `frontend/messages/` (`en.json`, `es.json`).
- Include a `LanguageSwitcher` component in the main navigation/header.
- Persist the user's language preference in a cookie named `NEXT_LOCALE`, written by Next.js middleware (not client-side JS), with `path=/`, `maxAge=31536000` (1 year), `SameSite=Lax`, and `Secure` in production.
- For AI-generated content (summaries, analysis), include the user's locale as a JSON body field `"locale": "es"` in the backend API request payload. Do not rely on the `Accept-Language` header for this purpose.

## Accessibility
- All interactive elements must have accessible labels (via `aria-label`, `aria-labelledby`, or visible text).
- Use shadcn/ui primitives as-is where possible — they include built-in ARIA.
- For custom interactive components, verify keyboard operability (Enter/Space activation, Escape to close) and focus visibility (`focus-visible` Tailwind classes).

## Testing
- Use Vitest for unit/component tests
- Use Testing Library (`@testing-library/react`) for component assertions
- Test user behavior, not implementation details
- Wrap components under test with the next-intl `NextIntlClientProvider` using the `en` messages fixture by default.
- Add a Vitest test in `src/__tests__/i18n-coverage.test.ts` that asserts all keys present in `en.json` also exist in `es.json`.
