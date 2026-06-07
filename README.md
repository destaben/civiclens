# CivicLens

**Transparencia en la contratación pública, impulsada por IA.**  
**AI-powered transparency for public procurement.**

CivicLens is a **free, open-source** civic technology platform that makes public procurement **transparent and searchable**. Browse government contracts, discover high-risk transactions, and explore spending patterns across public organizations in Spain. AI-generated insights highlight suspicious patterns, and all data is presented through a bilingual, user-friendly web interface (Spanish default, English available).

> **Disclaimer:** CivicLens is an **informational tool only**. Flagged anomalies are statistical and pattern-based indicators; they do not constitute accusations of wrongdoing or legal conclusions. Users should consult qualified professionals before acting on any finding. This platform does not provide legal advice.

---

## Open Source & Free to Use

CivicLens is completely **free** and open-source under the MIT License. If you find it valuable, you can support the project through **voluntary donations** to help cover infrastructure and development costs.

<!-- TODO: add donation link (e.g. Open Collective, GitHub Sponsors) once set up -->

---

## Features

- � **Visual Dashboard** — At-a-glance overview of public spending, risk trends, and top anomalies
- 🔍 **Powerful Search** — Find contracts by agency, amount, risk score, date, and more
- 🚩 **High-Risk Detection** — Automatic identification of suspicious patterns: split contracts, anomalous pricing, sole-source awards, short tender windows
- ⚖️ **Legal Context** — AI-generated risk analysis and legal framework references (LCSP 9/2017, EU Directives 2014/23–25/EU)
- 🏛️ **Organization Profiles** — Explore spending patterns, risk trends, and contract distribution by government body
- 🤖 **AI Summaries** — Plain-language analysis of complex procurement data in Spanish & English
- 🌐 **Bilingual (ES/EN)** — Spanish default; full English support

## Architecture

```
Public Data (JSON)  →  Frontend App (SPA)  →  User Interface
├── contracts.json      [Vite + React]        ├── Dashboard
├── organizations.json  CSS Modules           ├── Contract Search
└── stats.json          TypeScript            └── Organization Profiles

                        AI Pipeline (Planned)
                    ┌─────────────────────┐
                    │ Risk Scoring Engine │
                    │ Legal Context RAG   │
                    │ AI Summaries        │
                    └─────────────────────┘
```

| Layer | Technology |
|-------|-----------|
| Frontend | Vite, React 18, TypeScript, CSS Modules |
| Backend | Python 3.12+, FastAPI, SQLAlchemy 2.x, Pydantic v2 |
| Database | PostgreSQL 16, Redis |
| AI – Anomaly Engine | OpenAI API, LangChain (pattern scoring & risk analysis) |
| AI – Legal Agent | RAG over LCSP 9/2017 + EU Directives, OpenAI API |
| Testing | Vitest (frontend), pytest (backend) |
| Hosting | GitHub Pages (frontend), Docker (backend) |
| Infrastructure | Docker, GitHub Actions CI/CD |

## Getting Started

### Prerequisites

- Python 3.12+
- Node.js 20+
- Docker & Docker Compose
- PostgreSQL 16 (or use Docker)

### Setup

#### Clone the repository
```bash
git clone https://github.com/destaben/civiclens.git
cd civiclens
```

#### Frontend (Vite + React + TypeScript)

```bash
cd frontend

# Install dependencies
npm install

# Start development server (localhost:5173)
npm run dev

# Build for production (outputs to dist/)
npm run build

# Preview production build locally
npm run preview

# Run linting
npm run lint
```

#### Backend (FastAPI) – Coming Soon

```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # or `venv\Scripts\activate` on Windows
pip install -e ".[dev]"
uvicorn app.main:app --reload
```

#### Environment Variables

```bash
# Copy environment variables (once .env.example is added)
cp .env.example .env
# Edit .env with your API keys and configuration
```

### Running Tests

#### Frontend
```bash
cd frontend

# Run all tests once
npm run test

# Run tests in watch mode
npm run test:watch
```

#### Backend – Coming Soon
```bash
cd backend
pytest
```

### Deployment

**Frontend:** The Vite static build is deployed to **GitHub Pages** via GitHub Actions.

```bash
# Build locally for deployment
cd frontend
npm run build   # outputs to dist/
```

#### GitHub Pages setup (one-time)

1. Push this repository to GitHub.
2. In GitHub, go to **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to `GitHub Actions`.
4. Push to `main` (or run the `Deploy Frontend to GitHub Pages` workflow manually).

The workflow file is at `.github/workflows/deploy-pages.yml` and will:

- install frontend dependencies
- build the app with the correct base path for project pages
- upload `frontend/dist`
- publish to GitHub Pages

#### Public URL

- Project pages: `https://<github-username>.github.io/<repo-name>/`
- If you later use a custom domain, update the base path strategy accordingly.

#### SPA routing note

This project includes `dist/404.html` (copied from `index.html` during build) so direct links such as `/explore` or `/contract/CNT-2024-003` work on GitHub Pages.

**Backend API:** Will be deployed separately via Docker.


## Project Structure

```
civiclens/
├── backend/           # Python FastAPI application (coming soon)
│   ├── app/
│   │   ├── api/       # Route handlers
│   │   ├── core/      # Config, deps, security
│   │   ├── models/    # SQLAlchemy models
│   │   ├── schemas/   # Pydantic schemas
│   │   ├── services/  # Business logic
│   │   └── ai/        # LLM pipeline code
│   │       ├── anomaly/   # Anomaly detection & scoring engine
│   │       └── legal/     # Legal context agent (LCSP / EU law RAG)
│   └── tests/
├── frontend/          # Vite + React + TypeScript application
│   ├── src/
│   │   ├── components/
│   │   ├── lib/       # Utilities & API client
│   │   ├── pages/     # Page components
│   │   ├── types/     # TypeScript types
│   │   └── styles/    # Global styles
│   ├── public/        # Static assets & test data
│   ├── __tests__/     # Test files
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
├── infra/             # Infrastructure as code
├── docs/              # Extended documentation
│   └── i18n-guidelines.md  # Internationalization rules
└── .github/           # CI/CD, Copilot config, prompts
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make your changes following the [coding conventions](.github/copilot-instructions.md)
4. Write tests for new functionality
5. Commit using conventional commits: `type(scope): description`
6. Open a pull request referencing the relevant issue

### Commit Types

| Type | Description |
|------|-------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `style` | Formatting, no logic change |
| `refactor` | Code restructuring |
| `test` | Adding/updating tests |
| `chore` | Build, CI, tooling |

## License

This project is licensed under the **MIT License**. A `LICENSE` file will be added to the repository.
