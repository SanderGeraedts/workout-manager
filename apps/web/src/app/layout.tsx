import type { Metadata } from "next";
import "./globals.css";
import { Nav } from "@/components/nav";

export const metadata: Metadata = {
  title: "Workout Manager",
  description: "Plan, execute, and track your workouts",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-stone-50 text-stone-900">
        <Nav />
        <main className="flex-1 container mx-auto px-4 py-10 max-w-7xl">
          {children}
        </main>
      </body>
    </html>
  );
}
