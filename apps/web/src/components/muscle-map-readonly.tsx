"use client";

import Model from "react-body-highlighter";
import type { IExerciseData } from "react-body-highlighter";
import { MUSCLE_MAP, HIGHLIGHT_COLORS } from "@/lib/muscle-map-constants";

interface MuscleMapReadonlyProps {
  muscles: string[];
}

export function MuscleMapReadonly({ muscles }: MuscleMapReadonlyProps) {
  const frequencyMap: Record<string, number> = {};
  for (const muscle of muscles) {
    const mapped = MUSCLE_MAP[muscle.toLowerCase()];
    if (mapped) {
      frequencyMap[mapped] = (frequencyMap[mapped] ?? 0) + 1;
    }
  }

  const data: IExerciseData[] = Object.entries(frequencyMap).map(
    ([mapped, count]) => ({
      name: mapped,
      muscles: Array(count).fill(mapped) as IExerciseData["muscles"],
    })
  );

  const legendLabels = ["1 exercise", "2 exercises", "3 exercises", "4+"];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4 justify-center">
        <Model
          type="anterior"
          data={data}
          highlightedColors={HIGHLIGHT_COLORS}
          style={{ maxWidth: 130 }}
        />
        <Model
          type="posterior"
          data={data}
          highlightedColors={HIGHLIGHT_COLORS}
          style={{ maxWidth: 130 }}
        />
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 justify-center">
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
