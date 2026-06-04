import Link from "next/link";

export function Nav() {
  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex h-14 items-center gap-8">
          <Link href="/" className="font-bold text-lg">
            Workout Manager
          </Link>
          <div className="flex gap-6 text-sm">
            <Link href="/exercises" className="text-gray-600 hover:text-gray-900">
              Exercises
            </Link>
            <Link href="/workouts" className="text-gray-600 hover:text-gray-900">
              Workouts
            </Link>
            <Link href="/history" className="text-gray-600 hover:text-gray-900">
              History
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
