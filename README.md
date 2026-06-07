# CivicLens

**AI-powered transparency for government regulatory processes.**

CivicLens makes federal regulations and public comments accessible to everyone. It ingests data from sources like regulations.gov, uses large language models to generate plain-language summaries, and presents insights through an intuitive web interface.

---

## Features

- 📜 **Regulation Tracking** — Browse and search federal regulations with AI-generated summaries
- 💬 **Comment Analysis** — Understand public sentiment through aggregated comment insights
- 🤖 **AI Summaries** — Complex legal language translated into plain English
- 🔍 **Search & Filter** — Find regulations by agency, topic, status, and more
- 📊 **Analytics Dashboard** — Visualize trends in regulatory activity

## Architecture

```
Frontend (Next.js)  →  Backend API (FastAPI)  →  PostgreSQL
                              ↓
                       AI Pipeline (OpenAI)
                              ↓
                        Redis (Cache/Queue)
```

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14+, TypeScript, Tailwind CSS, shadcn/ui |
| Backend | Python 3.12+, FastAPI, SQLAlchemy 2.x, Pydantic v2 |
| Database | PostgreSQL 16, Redis |
| AI | OpenAI API, LangChain |
| Infrastructure | Docker, GitHub Actions |

## Getting Started

### Prerequisites

- Python 3.12+
- Node.js 20+
- Docker & Docker Compose
- PostgreSQL 16 (or use Docker)

### Setup

```bash
# Clone the repository
git clone https://github.com/destaben/civiclens.git
cd civiclens

# Copy environment variables
cp .env.example .env
# Edit .env with your API keys and configuration

# Start all services with Docker
docker compose up -d

# --- OR set up locally ---

# Backend
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -e ".[dev]"
uvicorn app.main:app --reload

# Frontend
cd frontend
npm install
npm run dev
```

### Running Tests

```bash
# Backend tests
cd backend
pytest

# Frontend tests
cd frontend
npm test
```

## Project Structure

```
civiclens/
├── backend/           # Python FastAPI application
│   ├── app/
│   │   ├── api/       # Route handlers
│   │   ├── core/      # Config, deps, security
│   │   ├── models/    # SQLAlchemy models
│   │   ├── schemas/   # Pydantic schemas
│   │   ├── services/  # Business logic
│   │   └── ai/        # LLM pipeline code
│   └── tests/
├── frontend/          # Next.js application
│   └── src/
│       ├── app/       # App router pages
│       ├── components/
│       ├── lib/       # Utilities & API client
│       └── types/
├── infra/             # Infrastructure as code
├── docs/              # Extended documentation
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

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.