import { api } from "@/lib/api";
import { WorkoutSession } from "@/lib/types";

export default async function HistoryPage() {
  const sessions = await api<WorkoutSession[]>("/sessions");

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Workout History</h1>
      {sessions.length === 0 ? (
        <p className="text-gray-500">No sessions recorded yet. Complete a workout to see it here!</p>
      ) : (
        <div className="space-y-3">
          {sessions.map((session) => (
            <div
              key={session.id}
              className="bg-white rounded-lg shadow p-4"
            >
              <div className="flex justify-between items-center">
                <span className="font-medium">
                  Workout #{session.workoutId}
                </span>
                <span className="text-sm text-gray-500">
                  {new Date(session.startedAt).toLocaleDateString()}
                </span>
              </div>
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${
                  session.completedAt
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {session.completedAt ? "Completed" : "In progress"}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
