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
        className="bg-gray-800 border border-gray-700 text-white placeholder-gray-500 rounded-lg px-4 py-2 focus:outline-none focus:border-green-500 w-full"
      />

      {exercises.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No exercises found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[480px] overflow-y-auto pr-1">
          {exercises.map((ex) => (
            <div
              key={ex.id}
              className="bg-gray-800 border border-gray-700 rounded-lg p-3 flex flex-col gap-2"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="font-medium text-white text-sm leading-snug">
                  {ex.name}
                </span>
                <button
                  onClick={() => onAddExercise(ex)}
                  className="shrink-0 bg-green-700 hover:bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-lg leading-none"
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
                      className="text-xs bg-gray-700 text-gray-300 rounded-full px-2 py-0.5"
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
