import Link from "next/link";
import { WorkoutPlannerClient } from "@/components/workout-planner/workout-planner-client";

export default function NewWorkoutPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Link
          href="/workouts"
          className="text-sm text-stone-500 hover:text-stone-800 font-medium transition-colors"
        >
          ← Back
        </Link>
        <div>
          <h1 className="text-4xl font-extrabold text-stone-900">New Workout</h1>
          <p className="text-stone-500 mt-1 text-sm">
            Build your routine, then add exercises from the library below.
          </p>
        </div>
      </div>
      <WorkoutPlannerClient />
    </div>
  );
}
