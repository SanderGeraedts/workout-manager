import { WorkoutPlannerClient } from "@/components/workout-planner/workout-planner-client";

export default function NewWorkoutPage() {
  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Create Workout</h1>
        <WorkoutPlannerClient />
      </div>
    </main>
  );
}
