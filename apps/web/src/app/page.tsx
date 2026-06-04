import Link from "next/link";

const cards = [
  {
    href: "/workouts",
    emoji: "🏋️",
    title: "Workouts",
    description: "Build and manage your workout routines",
    cta: "View workouts",
  },
  {
    href: "/exercises",
    emoji: "📖",
    title: "Exercises",
    description: "Browse the full exercise library with muscle guides",
    cta: "Browse exercises",
  },
  {
    href: "/history",
    emoji: "📈",
    title: "History",
    description: "Review your past sessions and track progress",
    cta: "See history",
  },
];

export default function Home() {
  return (
    <div className="space-y-12">
      {/* Hero */}
      <div className="space-y-4 pt-4">
        <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 text-xs font-semibold uppercase tracking-widest px-3 py-1.5 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-orange-500 inline-block" />
          Your personal trainer
        </div>
        <h1 className="text-5xl font-extrabold text-stone-900 leading-tight max-w-xl">
          Build the habit.<br />
          <span className="text-orange-500">We&apos;ll guide the rest.</span>
        </h1>
        <p className="text-stone-500 text-lg max-w-md leading-relaxed">
          Plan your routines step by step, then follow along during your workout — no experience needed.
        </p>
        <div className="flex gap-3 pt-2">
          <Link
            href="/workouts/new"
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-3 rounded-full transition-colors shadow-lg shadow-orange-200"
          >
            Create your first workout
          </Link>
          <Link
            href="/exercises"
            className="bg-white border border-stone-200 hover:border-stone-300 text-stone-700 font-semibold px-6 py-3 rounded-full transition-colors"
          >
            Explore exercises
          </Link>
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {cards.map(({ href, emoji, title, description, cta }) => (
          <Link
            key={href}
            href={href}
            className="group bg-white border border-stone-200 hover:border-orange-300 rounded-2xl p-6 flex flex-col gap-3 transition-all hover:shadow-lg hover:shadow-orange-100"
          >
            <span className="text-3xl">{emoji}</span>
            <div>
              <h2 className="text-lg font-bold text-stone-900">{title}</h2>
              <p className="text-stone-500 text-sm mt-1 leading-relaxed">{description}</p>
            </div>
            <span className="text-orange-500 text-sm font-semibold group-hover:underline mt-auto">
              {cta} →
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
