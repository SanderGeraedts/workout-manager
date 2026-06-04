"use client";

import type { Exercise } from "@/lib/types";
import { ExerciseList } from "./exercise-list";
import { MuscleMap } from "./muscle-map";

interface ExerciseBrowserProps {
  exercises: Exercise[];
  selectedMuscle: string | null;
  searchQuery: string;
  onMuscleSelect: (muscle: string | null) => void;
  onSearchChange: (q: string) => void;
  onAddExercise: (exercise: Exercise) => void;
}

export function ExerciseBrowser({
  exercises,
  selectedMuscle,
  searchQuery,
  onMuscleSelect,
  onSearchChange,
  onAddExercise,
}: ExerciseBrowserProps) {
  const filtered = exercises.filter((ex) => {
    const matchesSearch =
      !searchQuery ||
      ex.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMuscle =
      !selectedMuscle ||
      ex.muscles.some(
        (m) => m.muscleName.toLowerCase() === selectedMuscle.toLowerCase()
      );
    return matchesSearch && matchesMuscle;
  });

  return (
    <div className="bg-white border border-stone-200 rounded-2xl p-6">
      <h2 className="text-xl font-extrabold text-stone-900 mb-1">
        Exercise Browser
      </h2>
      <p className="text-sm text-stone-400 mb-6">
        Click a muscle on the body map to filter, or search by name.
      </p>
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 min-w-0">
          <ExerciseList
            exercises={filtered}
            searchQuery={searchQuery}
            onSearchChange={onSearchChange}
            onAddExercise={onAddExercise}
          />
        </div>
        <div className="lg:w-72 shrink-0">
          <MuscleMap
            exercises={exercises}
            selectedMuscle={selectedMuscle}
            onMuscleSelect={onMuscleSelect}
          />
        </div>
      </div>
    </div>
  );
}
