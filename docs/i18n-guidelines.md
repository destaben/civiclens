# Internationalization (i18n) Guidelines

CivicLens supports **English** and **Spanish**. All user-facing text must be translatable.

---

## Supported Locales

| Code | Language | Default |
|------|----------|---------|
| `en` | English  | ✅       |
| `es` | Spanish  | —       |

---

## Technology Stack

| Concern | Solution |
|---------|----------|
| Translation library | `next-intl` |
| Routing | App Router `[locale]` dynamic segment |
| Translation files | JSON in `frontend/messages/` |
| Date/number formatting | `Intl.DateTimeFormat`, `Intl.NumberFormat` |
| Language persistence | Cookie (`NEXT_LOCALE`) |

---

## File Structure

```
frontend/
├── messages/
│   ├── en.json              # English translations
│   └── es.json              # Spanish translations
├── src/
│   ├── i18n/
│   │   ├── config.ts        # Locale list, default locale
│   │   ├── request.ts       # Server-side message loading
│   │   └── navigation.ts    # Locale-aware Link, redirect, usePathname
│   ├── app/
│   │   └── [locale]/        # All pages nested under locale segment
│   │       ├── layout.tsx   # Wraps children with NextIntlClientProvider
│   │       ├── page.tsx     # Homepage
│   │       └── contracts/
│   │           └── page.tsx
│   └── components/
│       └── language-switcher.tsx
└── next.config.ts
```

---

## Translation File Format

Translation files use nested JSON organized by feature:

```json
// messages/en.json
{
  "common": {
    "appName": "CivicLens",
    "search": "Search",
    "loading": "Loading...",
    "error": "Something went wrong"
  },
  "nav": {
    "home": "Home",
    "contracts": "Contracts",
    "alerts": "Alerts",
    "organizations": "Organizations",
    "dashboard": "Dashboard"
  },
  "home": {
    "title": "AI-powered transparency for public procurement",
    "subtitle": "Monitoring government contracts to prevent corruption"
  },
  "contracts": {
    "title": "Contracts",
    "filter": "Filter",
    "noResults": "No contracts found",
    "riskScore": "Risk Score",
    "amount": "Amount",
    "agency": "Agency"
  },
  "alerts": {
    "title": "Risk Alerts",
    "noAlerts": "No active alerts",
    "severity": "Severity"
  },
  "organizations": {
    "title": "Organizations",
    "level": "Level",
    "national": "National",
    "regional": "Regional",
    "local": "Local"
  }
}
```

```json
// messages/es.json
{
  "common": {
    "appName": "CivicLens",
    "search": "Buscar",
    "loading": "Cargando...",
    "error": "Algo salió mal"
  },
  "nav": {
    "home": "Inicio",
    "contracts": "Contratos",
    "alerts": "Alertas",
    "organizations": "Organizaciones",
    "dashboard": "Panel"
  },
  "home": {
    "title": "Transparencia impulsada por IA para la contratación pública",
    "subtitle": "Monitorizando contratos gubernamentales para prevenir la corrupción"
  },
  "contracts": {
    "title": "Contratos",
    "filter": "Filtrar",
    "noResults": "No se encontraron contratos",
    "riskScore": "Puntuación de riesgo",
    "amount": "Importe",
    "agency": "Organismo"
  },
  "alerts": {
    "title": "Alertas de riesgo",
    "noAlerts": "No hay alertas activas",
    "severity": "Gravedad"
  },
  "organizations": {
    "title": "Organizaciones",
    "level": "Nivel",
    "national": "Nacional",
    "regional": "Autonómico",
    "local": "Local"
  }
}
```

---

## Implementation Rules

### Components

1. **Never hardcode user-facing strings.** Always use the `useTranslations()` hook:
   ```tsx
   import { useTranslations } from 'next-intl';

   export function ContractList() {
     const t = useTranslations('contracts');
     return <h1>{t('title')}</h1>;
   }
   ```

2. **Use namespaces** to scope translations per feature/page.

3. **Handle plurals and interpolation** using next-intl's ICU message syntax:
   ```json
   { "results": "Found {count, plural, one {# result} other {# results}}" }
   ```

### Routing

4. **All pages live under `app/[locale]/`** — no pages at the root level.

5. **Use locale-aware navigation helpers** from `src/i18n/navigation.ts` (wrapping `next-intl/navigation`):
   ```tsx
   import { Link } from '@/i18n/navigation';
   <Link href="/contracts">...</Link>
   ```

6. **Middleware** should detect locale from URL, cookie, or `Accept-Language` header and redirect accordingly. Note: Next.js Middleware requires a Node/Edge runtime and will **not** run on a purely static GitHub Pages deployment. For static export, use build-time generation with explicit `/en`/`/es` route segments instead of runtime middleware redirects.

### Adding New Text

7. When adding any new user-facing string:
   - Add the key to **both** `en.json` and `es.json`
   - Use a descriptive, dot-separated key path relative to the namespace (e.g., `detailPage.riskScore` under the `contracts` namespace)
   - Keep keys in English for consistency

### Date & Number Formatting

8. Use `next-intl` formatting or native `Intl` APIs — never format dates/numbers manually:
   ```tsx
   const format = useFormatter();
   format.dateTime(date, { dateStyle: 'long' });
   format.number(count);
   ```

### AI-Generated Content

9. Pass the user's active locale to backend API calls so AI-generated summaries and analyses are returned in the correct language:
   ```tsx
   fetch(`/api/contracts/${id}/summary?locale=${locale}`)
   ```

10. The backend AI pipeline should include the target language in its LLM prompt.

---

## Language Switcher

- Place in the site header/navigation, always visible
- Display language names in their own language: "English" / "Español"
- On switch: update the URL locale segment and set the `NEXT_LOCALE` cookie
- Use `kebab-case` filename: `language-switcher.tsx`

---

## Configuration Checklist

When scaffolding the frontend, ensure:

- [ ] `next-intl` is installed
- [ ] `src/i18n/config.ts` exports `locales: ['en', 'es']` and `defaultLocale: 'en'`
- [ ] `src/i18n/request.ts` loads messages for the active locale
- [ ] `src/i18n/navigation.ts` exports locale-aware `Link`, `redirect`, `usePathname`
- [ ] `middleware.ts` handles locale detection and redirects
- [ ] `app/[locale]/layout.tsx` wraps children with `NextIntlClientProvider`
- [ ] `messages/en.json` and `messages/es.json` exist with matching keys
- [ ] `next.config.ts` includes the `createNextIntlPlugin` wrapper
- [ ] `LanguageSwitcher` component is included in the main layout

---

## Testing i18n

- Test components render correctly in both locales
- Test that missing translation keys fall back gracefully
- Test the language switcher updates the locale
- Test that date/number formatting respects the active locale
