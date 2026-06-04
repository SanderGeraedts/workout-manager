"use client";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import type { WorkoutExerciseRow } from "@/lib/types";
import { SortableExerciseRow } from "./sortable-exercise-row";

interface WorkoutBuilderProps {
  workoutName: string;
  description: string;
  exercises: WorkoutExerciseRow[];
  onNameChange: (v: string) => void;
  onDescriptionChange: (v: string) => void;
  onUpdate: (id: string, patch: Partial<WorkoutExerciseRow>) => void;
  onRemove: (id: string) => void;
  onReorder: (newOrder: WorkoutExerciseRow[]) => void;
}

export function WorkoutBuilder({
  workoutName,
  description,
  exercises,
  onNameChange,
  onDescriptionChange,
  onUpdate,
  onRemove,
  onReorder,
}: WorkoutBuilderProps) {
  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = exercises.findIndex((e) => e.id === active.id);
    const newIndex = exercises.findIndex((e) => e.id === over.id);
    onReorder(arrayMove(exercises, oldIndex, newIndex));
  };

  return (
    <div className="bg-gray-900 rounded-xl p-6 flex flex-col gap-4">
      <h2 className="text-xl font-semibold text-white">Workout Details</h2>

      <div className="flex flex-col gap-3">
        <input
          type="text"
          placeholder="Workout name *"
          value={workoutName}
          onChange={(e) => onNameChange(e.target.value)}
          className="bg-gray-800 border border-gray-700 text-white placeholder-gray-500 rounded-lg px-4 py-2 focus:outline-none focus:border-green-500"
        />
        <textarea
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          rows={2}
          className="bg-gray-800 border border-gray-700 text-white placeholder-gray-500 rounded-lg px-4 py-2 focus:outline-none focus:border-green-500 resize-none"
        />
      </div>

      <h2 className="text-xl font-semibold text-white mt-2">Exercises</h2>

      {exercises.length === 0 ? (
        <p className="text-gray-500 text-center py-8">
          No exercises added yet. Browse and add exercises below.
        </p>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={exercises.map((e) => e.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="flex flex-col gap-2">
              {exercises.map((row) => (
                <SortableExerciseRow
                  key={row.id}
                  row={row}
                  onUpdate={onUpdate}
                  onRemove={onRemove}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}
