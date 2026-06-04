export default function Home() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Workout Manager</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <a
          href="/exercises"
          className="block p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
        >
          <h2 className="text-xl font-semibold mb-2">Exercises</h2>
          <p className="text-gray-600">Browse the exercise library</p>
        </a>
        <a
          href="/workouts"
          className="block p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
        >
          <h2 className="text-xl font-semibold mb-2">Workouts</h2>
          <p className="text-gray-600">Plan and manage your workouts</p>
        </a>
        <a
          href="/history"
          className="block p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
        >
          <h2 className="text-xl font-semibold mb-2">History</h2>
          <p className="text-gray-600">View past workout sessions</p>
        </a>
      </div>
    </div>
  );
}
