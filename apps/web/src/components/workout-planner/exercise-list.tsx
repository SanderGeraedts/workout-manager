"use client";

import type { Exercise } from "@/lib/types";

interface ExerciseListProps {
  exercises: Exercise[];
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onAddExercise: (exercise: Exercise) => void;
}

export function ExerciseList({
  exercises,
  searchQuery,
  onSearchChange,
  onAddExercise,
}: ExerciseListProps) {
  return (
    <div className="flex flex-col gap-3">
      <input
        type="search"
        placeholder="Search exercises…"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="border border-stone-200 bg-stone-50 text-stone-900 placeholder-stone-400 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition text-sm w-full"
      />

      {exercises.length === 0 ? (
        <p className="text-stone-400 text-center py-10 text-sm">
          No exercises found.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[520px] overflow-y-auto pr-1">
          {exercises.map((ex) => (
            <div
              key={ex.id}
              className="group bg-stone-50 border border-stone-200 hover:border-orange-300 rounded-xl p-3 flex flex-col gap-2 transition-all hover:shadow-sm"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="font-semibold text-stone-900 text-sm leading-snug">
                  {ex.name}
                </span>
                <button
                  onClick={() => onAddExercise(ex)}
                  className="shrink-0 bg-orange-500 hover:bg-orange-600 text-white rounded-full w-7 h-7 flex items-center justify-center text-lg leading-none font-bold transition-colors shadow-sm shadow-orange-200"
                  aria-label={`Add ${ex.name}`}
                >
                  +
                </button>
              </div>
              {ex.muscles.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {ex.muscles.map((m) => (
                    <span
                      key={m.id}
                      className="text-xs bg-orange-50 text-orange-600 border border-orange-100 rounded-full px-2 py-0.5 font-medium"
                    >
                      {m.muscleName}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
