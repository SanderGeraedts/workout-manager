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
- [x] Next.js frontend (shell, routing, API client)
- [ ] Workout planning UI
- [ ] Guided workout session UI
- [ ] Workout history UI

## UI Design — Workout Planner

### Layout Overview

The workout planner page is split into two vertical sections:

**Top section — Workout Builder (full width)**
- A list of exercises added to the current workout
- Rows are **drag-and-drop reorderable** (vertical DnD)
- Each row displays:
  - Exercise name
  - Sets count input
  - Toggle: **reps-based** or **time-based** (per exercise — a workout can mix both)
  - Reps input (if reps-based) or duration input in seconds (if time-based)
  - Rest time input (seconds between sets)
  - Remove button
- Consider collapsed rows by default with an expand/edit affordance to reduce visual noise

**Bottom section — Exercise Browser (split: left + right)**

_Left panel — Exercise List_
- Scrollable list/grid of all exercises from the library
- **Text search** bar to filter by exercise name
- Each exercise card shows name and muscle group tags
- Clicking an exercise adds it to the workout builder above
- The list is filtered when a muscle is selected on the right panel

_Right panel — Muscle Map_
- Uses **`react-body-highlighter`** (npm: `react-body-highlighter`) — a React SVG body model component
- Render two `<Model>` instances side by side: `type="anterior"` (front) and `type="posterior"` (back)
- Pass current workout exercises as the `data` prop: `{ name, muscles[] }` per exercise
- Muscle groups are color-coded based on workout focus (set via `highlightedColors` prop):
  - **White / light grey** (`bodyColor`) — not targeted
  - **Green** — lightly targeted (frequency 1–2)
  - **Orange** — moderately targeted
  - **Red** — heavily targeted / most focused
  - Suggested: `highlightedColors: ['#22c55e', '#86efac', '#f97316', '#ef4444']`
- A small legend below the models explains the color scale
- Clicking a muscle triggers the `onClick` callback → filters the exercise list on the left
- Active muscle filter is visually indicated; clicking again deselects (shows all exercises)

### Key Interactions
- Drag handle on each workout row for reordering
- Muscle click toggles filter on/off (deselect to show all)
- Rep/time toggle switches input field type inline
- Exercise cards have a quick-add button (+ icon) for fast addition
