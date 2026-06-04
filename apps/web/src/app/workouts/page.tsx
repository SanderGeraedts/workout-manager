import { api } from "@/lib/api";
import { Workout } from "@/lib/types";
import Link from "next/link";

export default async function WorkoutsPage() {
  const workouts = await api<Workout[]>("/workouts");

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-extrabold text-stone-900">Workouts</h1>
          <p className="text-stone-500 mt-1">Your saved routines, ready to go.</p>
        </div>
        <Link
          href="/workouts/new"
          className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-5 py-2.5 rounded-full transition-colors shadow-md shadow-orange-200 text-sm"
        >
          + New workout
        </Link>
      </div>

      {/* Empty state */}
      {workouts.length === 0 ? (
        <div className="bg-white border border-stone-200 rounded-2xl p-12 text-center space-y-4">
          <div className="text-5xl">🏋️</div>
          <h2 className="text-xl font-bold text-stone-700">No workouts yet</h2>
          <p className="text-stone-400 max-w-xs mx-auto">
            Create your first workout and start building your routine.
          </p>
          <Link
            href="/workouts/new"
            className="inline-block mt-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-3 rounded-full transition-colors"
          >
            Create a workout
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {workouts.map((workout) => (
            <Link
              key={workout.id}
              href={`/workouts/${workout.id}`}
              className="group bg-white border border-stone-200 hover:border-orange-300 rounded-2xl p-6 flex flex-col gap-2 transition-all hover:shadow-lg hover:shadow-orange-100"
            >
              <div className="flex items-start justify-between gap-2">
                <h2 className="font-bold text-stone-900 text-lg leading-snug group-hover:text-orange-600 transition-colors">
                  {workout.name}
                </h2>
                <span className="shrink-0 text-orange-400 text-lg group-hover:translate-x-0.5 transition-transform">
                  →
                </span>
              </div>
              {workout.description && (
                <p className="text-sm text-stone-500 leading-relaxed line-clamp-2">
                  {workout.description}
                </p>
              )}
              <p className="text-xs text-stone-400 mt-auto pt-2 border-t border-stone-100">
                Created {new Date(workout.createdAt).toLocaleDateString()}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
