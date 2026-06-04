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
    <div className="bg-gray-900 rounded-xl p-6">
      <h2 className="text-xl font-semibold text-white mb-4">Exercise Browser</h2>
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1">
          <ExerciseList
            exercises={filtered}
            searchQuery={searchQuery}
            onSearchChange={onSearchChange}
            onAddExercise={onAddExercise}
          />
        </div>
        <div className="lg:w-80">
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
