<div align="center">

# KEEN AI

**Ambient intelligence for builders & creators.**

A dark, focused command center where your thoughts meet cutting-edge AI — real-time streaming, developer-first UX, and a production-ready monorepo.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![pnpm](https://img.shields.io/badge/pnpm-workspace-F69220?logo=pnpm&logoColor=white)](https://pnpm.io/)

[Features](#-features) · [Architecture](#-architecture) · [Getting Started](#-getting-started) · [Environment](#-environment-variables)

</div>

---

## ✨ Features

| | |
|---|---|
| **Real-time AI chat** | Stream Gemini responses with Server-Sent Events — zero perceived latency |
| **Command center UI** | Dark ambient design, command palette, dashboard, and polished shadcn/ui components |
| **Auth & profiles** | Supabase authentication with protected routes and user settings |
| **Type-safe API** | OpenAPI spec → Zod schemas → auto-generated React Query hooks |
| **Persistent storage** | PostgreSQL via Drizzle ORM for conversations, messages, and profiles |
| **Monorepo workspace** | Shared libraries, independent artifacts, unified tooling with pnpm |

---

## 🏗 Architecture

```
KEEN-AI/
├── artifacts/
│   ├── keen-ai/          # React frontend (Vite + Tailwind)
│   ├── api-server/       # Express API + Gemini integration
│   └── mockup-sandbox/   # UI component sandbox
└── lib/
    ├── api-spec/         # OpenAPI definition
    ├── api-zod/          # Generated Zod validators
    ├── api-client-react/ # Generated React Query client
    ├── db/               # Drizzle schema & PostgreSQL client
    └── integrations-gemini-ai/
```

```mermaid
flowchart LR
    subgraph Client
        UI[keen-ai React App]
    end
    subgraph Server
        API[api-server Express]
        Gemini[Gemini AI]
        DB[(PostgreSQL)]
    end
    Auth[Supabase Auth]

    UI -->|REST / SSE| API
    UI -->|Auth| Auth
    API --> Gemini
    API --> DB
```

---

## 🛠 Tech Stack

**Frontend** — React 19 · Vite 7 · Tailwind CSS 4 · Radix UI · Framer Motion · TanStack Query · Wouter · Supabase

**Backend** — Express 5 · Google Gemini · Drizzle ORM · PostgreSQL · Pino

**Tooling** — TypeScript · pnpm workspaces · Orval · esbuild · Prettier

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 20+
- [pnpm](https://pnpm.io/installation) 9+
- PostgreSQL database
- [Supabase](https://supabase.com/) project (auth)
- [Google AI Studio](https://aistudio.google.com/) API key (Gemini)

### Installation

```bash
git clone https://github.com/DSnext412-jpg/KEEN-AI.git
cd KEEN-AI
pnpm install
```

### Environment variables

Create a `.env` file in the project root (or configure secrets in your deployment platform):

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/keen_ai

# Gemini
GEMINI_API_KEY=your_gemini_api_key

# Frontend (keen-ai)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Runtime
PORT=5000
BASE_PATH=/
NODE_ENV=development
LOG_LEVEL=info
```

### Database setup

```bash
pnpm --filter @workspace/db push
```

### Development

Run the API server and frontend in separate terminals:

```bash
# Terminal 1 — API server
pnpm --filter @workspace/api-server dev

# Terminal 2 — Frontend
PORT=5000 BASE_PATH=/ pnpm --filter @workspace/keen-ai dev
```

Open the app at `http://localhost:5000`.

### Build

```bash
pnpm build
```

---

## 📜 Scripts

| Command | Description |
|---------|-------------|
| `pnpm install` | Install all workspace dependencies |
| `pnpm build` | Typecheck and build all packages |
| `pnpm typecheck` | Run TypeScript across the monorepo |
| `pnpm --filter @workspace/keen-ai dev` | Start the frontend dev server |
| `pnpm --filter @workspace/api-server dev` | Build and start the API server |
| `pnpm --filter @workspace/db push` | Push Drizzle schema to PostgreSQL |

---

## 📁 Key Routes

| Route | Description |
|-------|-------------|
| `/` | Landing page |
| `/login` | Authentication |
| `/dashboard` | Usage stats & quick actions |
| `/chat` | AI conversations with streaming |
| `/settings` | User preferences |
| `/profile` | Profile management |

---

## 🤝 Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

<div align="center">

**Built for the bold.**

[⬆ Back to top](#keen-ai)

</div>
