import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { db, workouts, workoutExercises } from "@workout-manager/db";
import { eq } from "drizzle-orm";

export const workoutsRouter = new Hono();

const createWorkoutSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  exercises: z.array(
    z.object({
      exerciseId: z.number(),
      order: z.number(),
      sets: z.number().min(1),
      reps: z.number().optional(),
      durationSeconds: z.number().optional(),
      restSeconds: z.number().default(60),
    })
  ),
});

workoutsRouter.get("/", async (c) => {
  const allWorkouts = await db.query.workouts.findMany();
  return c.json({ data: allWorkouts, error: null });
});

workoutsRouter.get("/:id", async (c) => {
  const id = Number(c.req.param("id"));
  const workout = await db.query.workouts.findFirst({
    where: eq(workouts.id, id),
    with: { exercises: true },
  });

  if (!workout) {
    return c.json({ data: null, error: "Workout not found" }, 404);
  }

  return c.json({ data: workout, error: null });
});

workoutsRouter.post("/", zValidator("json", createWorkoutSchema), async (c) => {
  const body = c.req.valid("json");

  const [workout] = await db
    .insert(workouts)
    .values({ name: body.name, description: body.description })
    .returning();

  for (const ex of body.exercises) {
    await db.insert(workoutExercises).values({
      workoutId: workout.id,
      exerciseId: ex.exerciseId,
      order: ex.order,
      sets: ex.sets,
      reps: ex.reps,
      durationSeconds: ex.durationSeconds,
      restSeconds: ex.restSeconds,
    });
  }

  return c.json({ data: workout, error: null }, 201);
});
