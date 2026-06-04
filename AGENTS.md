# AGENTS.md

## Project Overview

Workout program manager — plan workouts, execute guided sessions, track history. See `PROJECT.md` for full spec.

## Tech Stack

- **Frontend**: Next.js (App Router)
- **Backend**: Hono (REST API)
- **Database**: SQLite (via Drizzle ORM or similar)
- **Monorepo**: apps/web, apps/api, packages/db

## Project Structure

```
apps/web/          → Next.js frontend
apps/api/          → Hono API server
packages/db/       → SQLite schema, migrations, seed data
data/              → Static exercise data (exercises.json)
```

## Coding Conventions

- TypeScript everywhere, strict mode enabled
- Use named exports over default exports
- Prefer `const` over `let`; never use `var`
- Use async/await over raw promises
- Error handling: throw typed errors, never swallow exceptions silently

## Frontend (apps/web)

- Next.js App Router with server components by default
- Client components only when interactivity is needed (`"use client"`)
- Styling: Tailwind CSS
- State: React hooks + URL state where possible; avoid heavy state libraries for V1
- API calls via fetch to the Hono backend

## Backend (apps/api)

- Hono with typed routes
- RESTful endpoints: `/exercises`, `/workouts`, `/sessions`
- Validate request bodies with Zod
- Return consistent JSON response shape: `{ data, error }`

## Database (packages/db)

- SQLite with an ORM/query builder (Drizzle recommended)
- Migrations tracked in `packages/db/migrations/`
- Seed script for exercise data from `data/exercises.json`

## Key Tables

- `exercises` (id, name, explanation, video_url)
- `exercise_muscles` (exercise_id, muscle_name)
- `workouts` (id, name, description, created_at)
- `workout_exercises` (id, workout_id, exercise_id, order, sets, reps, duration_seconds, rest_seconds)
- `workout_sessions` (id, workout_id, started_at, completed_at)
- `session_sets` (id, session_id, workout_exercise_id, set_number, reps_achieved, weight_used)

## Testing

- Unit tests with Vitest
- API route tests with supertest or Hono test client
- Run tests: `pnpm test`

## Commands

- `pnpm dev` — start all apps in dev mode
- `pnpm build` — production build
- `pnpm test` — run test suite
- `pnpm db:migrate` — run migrations
- `pnpm db:seed` — seed exercise data

## Guidelines for AI Agents

- Always read `PROJECT.md` for feature context before implementing
- Prefer small, focused commits
- Do not add dependencies without justification
- Keep API responses typed end-to-end (shared types in `packages/db` or a shared package)
- When creating UI components, keep them composable and single-responsibility
- Muscles are stored as a separate relation (exercise_muscles), not a JSON array
