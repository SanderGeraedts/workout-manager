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
    <div className="bg-white border border-stone-200 rounded-2xl p-6 flex flex-col gap-5">
      <h2 className="text-xl font-extrabold text-stone-900">Workout Details</h2>

      <div className="flex flex-col gap-3">
        <input
          type="text"
          placeholder="Workout name *"
          value={workoutName}
          onChange={(e) => onNameChange(e.target.value)}
          className="border border-stone-200 bg-stone-50 text-stone-900 placeholder-stone-400 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition text-sm font-medium"
        />
        <textarea
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          rows={2}
          className="border border-stone-200 bg-stone-50 text-stone-900 placeholder-stone-400 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition text-sm resize-none"
        />
      </div>

      <div className="border-t border-stone-100 pt-4">
        <h3 className="text-sm font-bold text-stone-500 uppercase tracking-widest mb-4">
          Exercises
        </h3>

        {exercises.length === 0 ? (
          <div className="border-2 border-dashed border-stone-200 rounded-xl py-10 text-center text-stone-400 text-sm">
            No exercises yet — add some from the browser below.
          </div>
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
    </div>
  );
}
