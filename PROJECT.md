# Workout Program Generator

## Overview

An application that generates personalized workout programs using a locally hosted AI model, based on a predefined set of exercises.

## Tech Stack

- **Frontend**: Next.js
- **Backend API**: Hono
- **Database**: SQLite
- **AI**: Locally hosted model (trained on RTX 3080 Ti, deployed for CPU inference)

## Architecture

```
┌─────────────┐     ┌─────────────┐     ┌─────────┐
│   Next.js   │────▶│  Hono API   │────▶│  SQLite  │
│  Frontend   │     │   Backend   │     │    DB    │
└─────────────┘     └──────┬──────┘     └─────────┘
                           │
                    ┌──────▼──────┐
                    │  Local AI   │
                    │  (CPU inf.) │
                    └─────────────┘
```

## Constraints

- **Training**: Model can be trained on an RTX 3080 Ti (12GB VRAM)
- **Inference**: Server lacks a sophisticated GPU — model must run efficiently on CPU
  - Implies using a quantized model (e.g., GGUF/llama.cpp, ONNX Runtime)
  - Or a small fine-tuned model (e.g., fine-tuned Phi-3, TinyLlama, Mistral 7B quantized)

## AI Approach

Given the hardware constraints, recommended approach:

1. **Fine-tune** a small model (7B or smaller) on workout programming data using the RTX 3080 Ti
2. **Quantize** the model (4-bit GGUF) for CPU-friendly inference
3. **Serve** via llama.cpp server or Ollama on the production server

Alternatively, use a structured generation approach where the AI outputs JSON conforming to a workout schema, reducing hallucination risk.

## Data Model (SQLite)

### Core Tables

- **exercises** — predefined exercise library (name, explanation, video_url, muscles[])
- **workouts** — user-created workout templates (name, description)
- **workout_exercises** — exercises in a workout (order, sets, reps, duration_seconds, rest_seconds)
- **workout_sessions** — completed workout instances (workout_id, started_at, completed_at)
- **session_sets** — individual sets logged (exercise, set_number, reps_achieved, weight_used)

## Features

### V1 (No AI)

- Predefined exercise database with metadata
- **Plan a workout**: UI to create workout routines by selecting exercises, setting sets/reps/duration/rest
- **Do a workout**: Guided session with:
  - Exercise video playback
  - Rep counter display (when rep-based)
  - Timer display (when time-based)
  - Rest timer between sets
- **Workout history**: Track completed workouts with date, exercises performed, weights/reps achieved

### V2 (AI-powered)

- AI-generated workout programs based on user profile and exercise pool
- Program adjustments based on progress/feedback
- Exercise substitution suggestions
- Export (PDF, calendar)

## Project Structure

```
workout-manager/
├── apps/
│   ├── web/              # Next.js frontend
│   └── api/              # Hono backend
├── packages/
│   └── db/               # SQLite schema & migrations
├── ai/
│   ├── training/         # Fine-tuning scripts & data
│   └── inference/        # Model serving config
├── data/
│   └── exercises.json    # Seed exercise library
└── PROJECT.md
```

## Getting Started

```bash
pnpm install          # Install dependencies
pnpm db:migrate       # Create database tables
pnpm db:seed          # Seed exercise data
pnpm dev              # Start API on http://localhost:3001
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/exercises` | List all exercises with muscles |
| GET | `/exercises/:id` | Get single exercise |
| GET | `/workouts` | List all workouts |
| GET | `/workouts/:id` | Get workout with exercises |
| POST | `/workouts` | Create workout with exercises |
| GET | `/sessions` | List all sessions |
| GET | `/sessions/:id` | Get session with logged sets |
| POST | `/sessions` | Start a new session |
| POST | `/sessions/:id/sets` | Log a set |
| PATCH | `/sessions/:id/complete` | Mark session complete |

## Status

- [x] Monorepo setup (pnpm workspaces)
- [x] Database schema (Drizzle + SQLite)
- [x] Migrations & seed script
- [x] Hono API with exercises, workouts, sessions routes
- [ ] Next.js frontend
- [ ] Workout planning UI
- [ ] Guided workout session UI
- [ ] Workout history UI
