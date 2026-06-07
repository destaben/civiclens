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

## Testing
- Use Vitest for unit/component tests
- Use Testing Library (`@testing-library/react`) for component assertions
- Test user behavior, not implementation details
