# KEEN AI

A modern AI workspace platform — a dark, focused command center for builders and creators to think and create alongside AI.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm --filter @workspace/keen-ai run dev` — run the frontend (port 18498)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string (auto-provisioned by Replit)

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite, Tailwind CSS, shadcn/ui, Framer Motion, Wouter
- Auth: Supabase (client-side, @supabase/supabase-js)
- AI: Google Gemini (via direct GEMINI_API_KEY)
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (zod/v4), drizzle-zod
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/keen-ai/` — React frontend
- `artifacts/api-server/` — Express API backend
- `lib/api-spec/openapi.yaml` — OpenAPI spec (source of truth for API contracts)
- `lib/api-client-react/src/generated/` — Generated React Query hooks
- `lib/api-zod/src/generated/` — Generated Zod schemas
- `lib/db/src/schema/` — Drizzle ORM schemas (conversations, messages, userProfiles)
- `lib/integrations-gemini-ai/` — Gemini AI client wrapper

## Secrets Required

- `GEMINI_API_KEY` — Google Gemini API key (aistudio.google.com)
- `SUPABASE_URL` + `SUPABASE_ANON_KEY` — Supabase project credentials (server-side)
- `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY` — Same values, VITE_ prefix for frontend

## Architecture decisions

- Supabase handles auth entirely client-side; backend routes are unauthenticated at Phase 1 (auth enforcement planned for later phases)
- Gemini integration uses direct API key (GEMINI_API_KEY) instead of Replit AI Integration proxy
- AI chat uses SSE streaming via raw fetch (not React Query hook) since Orval can't type SSE responses
- All API contracts defined in OpenAPI first, then codegen runs to produce hooks + Zod schemas

## Product — Phase 1 Complete

- Landing page with hero, features, CTA
- Supabase authentication (email/password sign in + sign up)
- Dashboard with conversation stats
- AI Chat with Gemini (streaming SSE, conversation history, sidebar)
- Settings (profile editing, theme switcher light/dark/system)
- Command palette (Ctrl+K)
- Responsive design with dark-first aesthetic

## Roadmap

Phases 2–10 planned covering: AI Writing Workspace, Document Intelligence, Smart Notes, AI Code Studio, Productivity, Voice AI, Research, Automation, Memory & Plugins.

## User preferences

- Build in phases — instructions given one at a time
- Supabase for authentication
- Gemini for AI features

## Gotchas

- After any OpenAPI spec change, run `pnpm --filter @workspace/api-spec run codegen` before editing routes
- `@google/genai` must be listed in `artifacts/api-server/package.json` dependencies (not just the lib) for esbuild to bundle it
- Gemini image client uses GEMINI_API_KEY (not the AI_INTEGRATIONS_ env vars from the Replit proxy)
- VITE_ prefix required for any env vars accessed in the frontend
