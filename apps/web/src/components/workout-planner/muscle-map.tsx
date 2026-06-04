"use client";

import Model from "react-body-highlighter";
import type { IMuscleStats, IExerciseData } from "react-body-highlighter";
import type { Exercise } from "@/lib/types";
import { MUSCLE_MAP, HIGHLIGHT_COLORS } from "@/lib/muscle-map-constants";

interface MuscleMapProps {
  exercises: Exercise[];
  selectedMuscle: string | null;
  onMuscleSelect: (muscle: string | null) => void;
}

export function MuscleMap({
  exercises,
  selectedMuscle,
  onMuscleSelect,
}: MuscleMapProps) {
  const data: IExerciseData[] = exercises.map((ex) => ({
    name: ex.name,
    muscles: ex.muscles
      .map((m) => MUSCLE_MAP[m.muscleName.toLowerCase()])
      .filter(Boolean) as IExerciseData["muscles"],
  }));

  const handleClick = (stats: IMuscleStats) => {
    const clicked = stats.muscle as string;
    onMuscleSelect(selectedMuscle === clicked ? null : clicked);
  };

  const legendLabels = ["1×", "2×", "3×", "4×+"];

  return (
    <div className="flex flex-col gap-4">
      {/* Filter status */}
      <div className="min-h-[28px]">
        {selectedMuscle ? (
          <div className="flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-xl px-3 py-1.5 text-sm">
            <span className="text-stone-600">Filtering:</span>
            <span className="text-orange-600 font-semibold capitalize">
              {selectedMuscle}
            </span>
            <button
              onClick={() => onMuscleSelect(null)}
              className="ml-auto text-stone-400 hover:text-stone-700 text-xs underline"
            >
              Clear
            </button>
          </div>
        ) : (
          <p className="text-xs text-stone-400 text-center">
            Click a muscle to filter exercises
          </p>
        )}
      </div>

      {/* Models */}
      <div className="flex gap-2 justify-center cursor-pointer">
        <Model
          type="anterior"
          data={data}
          highlightedColors={HIGHLIGHT_COLORS}
          onClick={handleClick}
          style={{ maxWidth: 120 }}
        />
        <Model
          type="posterior"
          data={data}
          highlightedColors={HIGHLIGHT_COLORS}
          onClick={handleClick}
          style={{ maxWidth: 120 }}
        />
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-2 justify-center">
        {HIGHLIGHT_COLORS.map((color, i) => (
          <div key={color} className="flex items-center gap-1.5">
            <span
              className="w-3 h-3 rounded-sm inline-block border border-black/10"
              style={{ backgroundColor: color }}
            />
            <span className="text-xs text-stone-500 font-medium">
              {legendLabels[i] ?? `${i + 1}+`}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
