import { Hono } from "hono";
import { db, exercises, exerciseMuscles } from "@workout-manager/db";
import { eq } from "drizzle-orm";

export const exercisesRouter = new Hono();

exercisesRouter.get("/", async (c) => {
  const allExercises = await db.query.exercises.findMany({
    with: { muscles: true },
  });

  return c.json({ data: allExercises, error: null });
});

exercisesRouter.get("/:id", async (c) => {
  const id = Number(c.req.param("id"));
  const exercise = await db.query.exercises.findFirst({
    where: eq(exercises.id, id),
    with: { muscles: true },
  });

  if (!exercise) {
    return c.json({ data: null, error: "Exercise not found" }, 404);
  }

  return c.json({ data: exercise, error: null });
});
