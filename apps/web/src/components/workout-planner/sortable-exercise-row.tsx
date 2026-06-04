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
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: row.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  const summary =
    row.mode === "reps"
      ? `${row.sets} sets × ${row.reps ?? "?"} reps · ${row.restSeconds}s rest`
      : `${row.sets} sets × ${row.durationSeconds ?? "?"}s · ${row.restSeconds}s rest`;

  const inputCls =
    "bg-white border border-stone-200 text-stone-900 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition";

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-stone-50 border rounded-xl overflow-hidden transition-shadow ${
        isDragging ? "shadow-lg border-orange-300" : "border-stone-200"
      }`}
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3">
        {/* Drag handle */}
        <button
          {...attributes}
          {...listeners}
          className="text-stone-300 hover:text-stone-500 cursor-grab active:cursor-grabbing touch-none text-lg"
          aria-label="Drag to reorder"
        >
          ⠿
        </button>

        <span className="flex-1 font-semibold text-stone-900 text-sm truncate">
          {row.exerciseName}
        </span>

        <span className="text-xs text-stone-400 hidden sm:block shrink-0">
          {summary}
        </span>

        <button
          onClick={() => setExpanded((v) => !v)}
          className="text-stone-400 hover:text-stone-700 text-xs px-2 py-1 rounded-lg hover:bg-stone-200 transition-colors"
          aria-label={expanded ? "Collapse" : "Expand"}
        >
          {expanded ? "▲" : "▼"}
        </button>

        <button
          onClick={() => onRemove(row.id)}
          className="text-stone-300 hover:text-red-500 transition-colors text-xl leading-none"
          aria-label="Remove exercise"
        >
          ×
        </button>
      </div>

      {/* Expanded controls */}
      {expanded && (
        <div className="px-4 pb-4 flex flex-wrap gap-4 border-t border-stone-200 pt-4 bg-white">
          <label className="flex flex-col gap-1.5 text-xs font-semibold text-stone-500 uppercase tracking-wide">
            Sets
            <input
              type="number"
              min={1}
              value={row.sets}
              onChange={(e) =>
                onUpdate(row.id, { sets: Number(e.target.value) })
              }
              className={`${inputCls} w-16`}
            />
          </label>

          <label className="flex flex-col gap-1.5 text-xs font-semibold text-stone-500 uppercase tracking-wide">
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
              className={inputCls}
            >
              <option value="reps">Reps</option>
              <option value="duration">Duration</option>
            </select>
          </label>

          {row.mode === "reps" ? (
            <label className="flex flex-col gap-1.5 text-xs font-semibold text-stone-500 uppercase tracking-wide">
              Reps
              <input
                type="number"
                min={1}
                value={row.reps ?? ""}
                onChange={(e) =>
                  onUpdate(row.id, { reps: Number(e.target.value) })
                }
                className={`${inputCls} w-16`}
              />
            </label>
          ) : (
            <label className="flex flex-col gap-1.5 text-xs font-semibold text-stone-500 uppercase tracking-wide">
              Duration (s)
              <input
                type="number"
                min={1}
                value={row.durationSeconds ?? ""}
                onChange={(e) =>
                  onUpdate(row.id, { durationSeconds: Number(e.target.value) })
                }
                className={`${inputCls} w-20`}
              />
            </label>
          )}

          <label className="flex flex-col gap-1.5 text-xs font-semibold text-stone-500 uppercase tracking-wide">
            Rest (s)
            <input
              type="number"
              min={0}
              value={row.restSeconds}
              onChange={(e) =>
                onUpdate(row.id, { restSeconds: Number(e.target.value) })
              }
              className={`${inputCls} w-20`}
            />
          </label>
        </div>
      )}
    </div>
  );
}
