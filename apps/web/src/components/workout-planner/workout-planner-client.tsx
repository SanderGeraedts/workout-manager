"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import type { Exercise, WorkoutExerciseRow } from "@/lib/types";
import { WorkoutBuilder } from "./workout-builder";
import { ExerciseBrowser } from "./exercise-browser";

export function WorkoutPlannerClient() {
  const router = useRouter();
  const [workoutName, setWorkoutName] = useState("");
  const [description, setDescription] = useState("");
  const [exercises, setExercises] = useState<WorkoutExerciseRow[]>([]);
  const [allExercises, setAllExercises] = useState<Exercise[]>([]);
  const [selectedMuscle, setSelectedMuscle] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api<Exercise[]>("/exercises")
      .then(setAllExercises)
      .catch(() => setError("Failed to load exercises"));
  }, []);

  const addExercise = (exercise: Exercise) => {
    setExercises((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        exerciseId: exercise.id,
        exerciseName: exercise.name,
        order: prev.length + 1,
        sets: 3,
        mode: "reps",
        reps: 10,
        durationSeconds: null,
        restSeconds: 60,
      },
    ]);
  };

  const updateExercise = (id: string, patch: Partial<WorkoutExerciseRow>) => {
    setExercises((prev) =>
      prev.map((row) => (row.id === id ? { ...row, ...patch } : row))
    );
  };

  const removeExercise = (id: string) => {
    setExercises((prev) =>
      prev
        .filter((row) => row.id !== id)
        .map((row, i) => ({ ...row, order: i + 1 }))
    );
  };

  const reorderExercises = (newOrder: WorkoutExerciseRow[]) => {
    setExercises(newOrder.map((row, i) => ({ ...row, order: i + 1 })));
  };

  const handleSave = async () => {
    if (!workoutName.trim()) {
      setError("Workout name is required");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await api("/workouts", {
        method: "POST",
        body: JSON.stringify({
          name: workoutName.trim(),
          description: description.trim() || undefined,
          exercises: exercises.map((row) => ({
            exerciseId: row.exerciseId,
            order: row.order,
            sets: row.sets,
            reps: row.mode === "reps" ? row.reps : undefined,
            durationSeconds: row.mode === "duration" ? row.durationSeconds : undefined,
            restSeconds: row.restSeconds,
          })),
        }),
      });
      router.push("/workouts");
    } catch {
      setError("Failed to save workout");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {error && (
        <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <WorkoutBuilder
        workoutName={workoutName}
        description={description}
        exercises={exercises}
        onNameChange={setWorkoutName}
        onDescriptionChange={setDescription}
        onUpdate={updateExercise}
        onRemove={removeExercise}
        onReorder={reorderExercises}
      />

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-green-600 hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold px-8 py-3 rounded-lg transition-colors"
        >
          {saving ? "Saving…" : "Save Workout"}
        </button>
      </div>

      <ExerciseBrowser
        exercises={allExercises}
        selectedMuscle={selectedMuscle}
        searchQuery={searchQuery}
        onMuscleSelect={setSelectedMuscle}
        onSearchChange={setSearchQuery}
        onAddExercise={addExercise}
      />
    </div>
  );
}
