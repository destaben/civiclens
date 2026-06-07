---
description: Creating a new React component
---

Create a new React component following CivicLens frontend conventions:

1. Create the component file in `frontend/src/components/` using `kebab-case.tsx` naming
2. Use a named export (not default export)
3. Define a TypeScript interface for props
4. Use Tailwind CSS for styling with shadcn/ui primitives
5. Handle loading and error states explicitly
6. Add JSDoc comment describing the component's purpose

Template:
```typescript
import { cn } from "@/lib/utils";

interface MyComponentProps {
  /** Brief description of the prop */
  title: string;
  className?: string;
}

/** Brief description of what this component renders. */
export function MyComponent({ title, className }: MyComponentProps) {
  return (
    <div className={cn("rounded-lg border p-4", className)}>
      <h2 className="text-lg font-semibold">{title}</h2>
    </div>
  );
}
```

If the component needs client-side interactivity, add `"use client"` at the top. Prefer React Server Components by default.
