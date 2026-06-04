import { api } from "@/lib/api";
import { Exercise } from "@/lib/types";

export default async function ExercisesPage() {
  const exercises = await api<Exercise[]>("/exercises");

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Exercises</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {exercises.map((exercise) => (
          <div
            key={exercise.id}
            className="bg-white rounded-lg shadow p-4 space-y-2"
          >
            <h2 className="font-semibold text-lg">{exercise.name}</h2>
            <p className="text-sm text-gray-600">{exercise.explanation}</p>
            <div className="flex flex-wrap gap-1">
              {exercise.muscles.map((m) => (
                <span
                  key={m.id}
                  className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full"
                >
                  {m.muscleName}
                </span>
              ))}
            </div>
            {exercise.videoUrl && (
              <a
                href={exercise.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:underline"
              >
                Watch video
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
