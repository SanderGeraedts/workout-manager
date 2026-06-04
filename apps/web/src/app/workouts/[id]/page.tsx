import Link from "next/link";
import { api } from "@/lib/api";
import { WorkoutDetail } from "@/lib/types";
import { MuscleMapReadonly } from "@/components/muscle-map-readonly";

interface WorkoutDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function WorkoutDetailPage({
  params,
}: WorkoutDetailPageProps) {
  const { id } = await params;
  const workout = await api<WorkoutDetail>(`/workouts/${id}`);

  const allMuscles = workout.exercises.flatMap((we) =>
    we.exercise.muscles.map((m) => m.muscleName)
  );
  const uniqueMuscles = [...new Set(allMuscles)];
  const sortedExercises = [...workout.exercises].sort(
    (a, b) => a.order - b.order
  );

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Back */}
      <Link
        href="/workouts"
        className="inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-800 font-medium transition-colors"
      >
        ← Back to Workouts
      </Link>

      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-extrabold text-stone-900">{workout.name}</h1>
        {workout.description && (
          <p className="text-stone-500 text-lg leading-relaxed">{workout.description}</p>
        )}
      </div>

      {/* Start button */}
      <Link
        href={`/workouts/${id}/session`}
        className="flex items-center justify-center gap-2 w-full bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-lg py-4 rounded-2xl transition-colors shadow-xl shadow-orange-200"
      >
        <span className="text-2xl">▶</span>
        Start Workout
      </Link>

      {/* Muscle map */}
      {uniqueMuscles.length > 0 && (
        <div className="bg-white border border-stone-200 rounded-2xl p-6">
          <h2 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-4">
            Muscles Targeted
          </h2>
          <MuscleMapReadonly muscles={allMuscles} />
        </div>
      )}

      {/* Exercise list */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-stone-700">
          {sortedExercises.length} Exercise{sortedExercises.length !== 1 ? "s" : ""}
        </h2>
        <ol className="space-y-3">
          {sortedExercises.map((we, index) => (
            <li
              key={we.id}
              className="bg-white border border-stone-200 rounded-2xl p-5 flex items-start gap-4"
            >
              {/* Order badge */}
              <span className="shrink-0 w-8 h-8 rounded-xl bg-orange-100 text-orange-600 text-sm font-extrabold flex items-center justify-center">
                {index + 1}
              </span>

              <div className="flex-1 space-y-2">
                <p className="font-bold text-stone-900 text-base">
                  {we.exercise.name}
                </p>

                {/* Stats row */}
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1 bg-stone-100 text-stone-600 text-xs font-semibold px-2.5 py-1 rounded-full">
                    🔁 {we.sets} sets
                  </span>
                  <span className="inline-flex items-center gap-1 bg-stone-100 text-stone-600 text-xs font-semibold px-2.5 py-1 rounded-full">
                    {we.reps != null ? `💪 ${we.reps} reps` : `⏱ ${we.durationSeconds}s`}
                  </span>
                  <span className="inline-flex items-center gap-1 bg-stone-100 text-stone-600 text-xs font-semibold px-2.5 py-1 rounded-full">
                    ☕ {we.restSeconds}s rest
                  </span>
                </div>

                {/* Muscle tags */}
                {we.exercise.muscles.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {we.exercise.muscles.map((m) => (
                      <span
                        key={m.id}
                        className="text-xs bg-orange-50 text-orange-600 font-medium px-2.5 py-0.5 rounded-full border border-orange-100"
                      >
                        {m.muscleName}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
