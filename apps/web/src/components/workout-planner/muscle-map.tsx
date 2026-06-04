"use client";

import Model from "react-body-highlighter";
import type { IMuscleStats, IExerciseData } from "react-body-highlighter";
import type { Exercise } from "@/lib/types";

// Map API muscle names → react-body-highlighter muscle names
const MUSCLE_MAP: Record<string, string> = {
  biceps: "biceps",
  triceps: "triceps",
  chest: "chest",
  abs: "abs",
  abdominals: "abs",
  obliques: "obliques",
  trapezius: "trapezius",
  traps: "trapezius",
  "upper back": "upper-back",
  "upper-back": "upper-back",
  "lower back": "lower-back",
  "lower-back": "lower-back",
  shoulders: "front-deltoids",
  deltoids: "front-deltoids",
  "front deltoids": "front-deltoids",
  "front-deltoids": "front-deltoids",
  "rear deltoids": "back-deltoids",
  "back-deltoids": "back-deltoids",
  forearm: "forearm",
  forearms: "forearm",
  hamstrings: "hamstring",
  hamstring: "hamstring",
  quadriceps: "quadriceps",
  quads: "quadriceps",
  glutes: "gluteal",
  gluteal: "gluteal",
  calves: "calves",
  abductors: "abductors",
  adductors: "adductor",
  neck: "neck",
};

const HIGHLIGHT_COLORS = ["#22c55e", "#86efac", "#f97316", "#ef4444"];

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
  // Build data for the highlighter: one "exercise" entry per real exercise
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

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-gray-400">
        {selectedMuscle ? (
          <>
            Filtering by{" "}
            <span className="text-green-400 font-medium">{selectedMuscle}</span>.{" "}
            <button
              onClick={() => onMuscleSelect(null)}
              className="underline text-gray-400 hover:text-white"
            >
              Clear
            </button>
          </>
        ) : (
          "Click a muscle to filter exercises."
        )}
      </p>

      <div className="flex gap-2 justify-center">
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
      <div className="flex flex-col gap-1 text-xs text-gray-400 mt-1">
        <p className="font-medium text-gray-300">Exercise frequency</p>
        <div className="flex gap-2 flex-wrap">
          {HIGHLIGHT_COLORS.map((color, i) => (
            <div key={color} className="flex items-center gap-1">
              <span
                className="w-3 h-3 rounded-sm inline-block"
                style={{ backgroundColor: color }}
              />
              <span>{i + 1}{i === HIGHLIGHT_COLORS.length - 1 ? "+" : ""}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
