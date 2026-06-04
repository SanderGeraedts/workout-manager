"use client";

import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { WorkoutExerciseRow } from "@/lib/types";

interface SortableExerciseRowProps {
  row: WorkoutExerciseRow;
  onUpdate: (id: string, patch: Partial<WorkoutExerciseRow>) => void;
  onRemove: (id: string) => void;
}

export function SortableExerciseRow({
  row,
  onUpdate,
  onRemove,
}: SortableExerciseRowProps) {
  const [expanded, setExpanded] = useState(false);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: row.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const summary =
    row.mode === "reps"
      ? `${row.sets} sets × ${row.reps ?? "?"} reps · ${row.restSeconds}s rest`
      : `${row.sets} sets × ${row.durationSeconds ?? "?"}s · ${row.restSeconds}s rest`;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden"
    >
      {/* Header row */}
      <div className="flex items-center gap-3 px-4 py-3">
        {/* Drag handle */}
        <button
          {...attributes}
          {...listeners}
          className="text-gray-500 hover:text-gray-300 cursor-grab active:cursor-grabbing touch-none"
          aria-label="Drag to reorder"
        >
          ⠿
        </button>

        <span className="flex-1 font-medium text-white">{row.exerciseName}</span>
        <span className="text-sm text-gray-400 hidden sm:block">{summary}</span>

        <button
          onClick={() => setExpanded((v) => !v)}
          className="text-gray-400 hover:text-white text-sm px-2"
          aria-label={expanded ? "Collapse" : "Expand"}
        >
          {expanded ? "▲" : "▼"}
        </button>

        <button
          onClick={() => onRemove(row.id)}
          className="text-red-500 hover:text-red-400 text-lg leading-none"
          aria-label="Remove exercise"
        >
          ×
        </button>
      </div>

      {/* Expanded controls */}
      {expanded && (
        <div className="px-4 pb-4 flex flex-wrap gap-4 border-t border-gray-700 pt-3">
          {/* Sets */}
          <label className="flex flex-col gap-1 text-sm text-gray-400">
            Sets
            <input
              type="number"
              min={1}
              value={row.sets}
              onChange={(e) => onUpdate(row.id, { sets: Number(e.target.value) })}
              className="bg-gray-700 text-white rounded px-2 py-1 w-16 focus:outline-none focus:ring-1 focus:ring-green-500"
            />
          </label>

          {/* Mode toggle */}
          <label className="flex flex-col gap-1 text-sm text-gray-400">
            Mode
            <select
              value={row.mode}
              onChange={(e) =>
                onUpdate(row.id, {
                  mode: e.target.value as "reps" | "duration",
                  reps: e.target.value === "reps" ? (row.reps ?? 10) : null,
                  durationSeconds:
                    e.target.value === "duration"
                      ? (row.durationSeconds ?? 30)
                      : null,
                })
              }
              className="bg-gray-700 text-white rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-green-500"
            >
              <option value="reps">Reps</option>
              <option value="duration">Duration</option>
            </select>
          </label>

          {/* Reps or Duration */}
          {row.mode === "reps" ? (
            <label className="flex flex-col gap-1 text-sm text-gray-400">
              Reps
              <input
                type="number"
                min={1}
                value={row.reps ?? ""}
                onChange={(e) => onUpdate(row.id, { reps: Number(e.target.value) })}
                className="bg-gray-700 text-white rounded px-2 py-1 w-16 focus:outline-none focus:ring-1 focus:ring-green-500"
              />
            </label>
          ) : (
            <label className="flex flex-col gap-1 text-sm text-gray-400">
              Duration (s)
              <input
                type="number"
                min={1}
                value={row.durationSeconds ?? ""}
                onChange={(e) =>
                  onUpdate(row.id, { durationSeconds: Number(e.target.value) })
                }
                className="bg-gray-700 text-white rounded px-2 py-1 w-20 focus:outline-none focus:ring-1 focus:ring-green-500"
              />
            </label>
          )}

          {/* Rest */}
          <label className="flex flex-col gap-1 text-sm text-gray-400">
            Rest (s)
            <input
              type="number"
              min={0}
              value={row.restSeconds}
              onChange={(e) =>
                onUpdate(row.id, { restSeconds: Number(e.target.value) })
              }
              className="bg-gray-700 text-white rounded px-2 py-1 w-20 focus:outline-none focus:ring-1 focus:ring-green-500"
            />
          </label>
        </div>
      )}
    </div>
  );
}
