import { api } from "@/lib/api";
import { Workout } from "@/lib/types";
import Link from "next/link";

export default async function WorkoutsPage() {
  const workouts = await api<Workout[]>("/workouts");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Workouts</h1>
        <Link
          href="/workouts/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700"
        >
          Create Workout
        </Link>
      </div>
      {workouts.length === 0 ? (
        <p className="text-gray-500">No workouts yet. Create your first one!</p>
      ) : (
        <div className="space-y-3">
          {workouts.map((workout) => (
            <Link
              key={workout.id}
              href={`/workouts/${workout.id}`}
              className="block bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow"
            >
              <h2 className="font-semibold">{workout.name}</h2>
              {workout.description && (
                <p className="text-sm text-gray-600 mt-1">{workout.description}</p>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
