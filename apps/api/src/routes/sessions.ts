import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { db, workoutSessions, sessionSets } from "@workout-manager/db";
import { eq } from "drizzle-orm";

export const sessionsRouter = new Hono();

const createSessionSchema = z.object({
  workoutId: z.number(),
});

const logSetSchema = z.object({
  workoutExerciseId: z.number(),
  setNumber: z.number().min(1),
  repsAchieved: z.number().optional(),
  weightUsed: z.number().optional(),
});

sessionsRouter.get("/", async (c) => {
  const allSessions = await db.query.workoutSessions.findMany();
  return c.json({ data: allSessions, error: null });
});

sessionsRouter.get("/:id", async (c) => {
  const id = Number(c.req.param("id"));
  const session = await db.query.workoutSessions.findFirst({
    where: eq(workoutSessions.id, id),
    with: { sets: true },
  });

  if (!session) {
    return c.json({ data: null, error: "Session not found" }, 404);
  }

  return c.json({ data: session, error: null });
});

sessionsRouter.post("/", zValidator("json", createSessionSchema), async (c) => {
  const { workoutId } = c.req.valid("json");

  const [session] = await db
    .insert(workoutSessions)
    .values({ workoutId })
    .returning();

  return c.json({ data: session, error: null }, 201);
});

sessionsRouter.post("/:id/sets", zValidator("json", logSetSchema), async (c) => {
  const sessionId = Number(c.req.param("id"));
  const body = c.req.valid("json");

  const [set] = await db
    .insert(sessionSets)
    .values({ sessionId, ...body })
    .returning();

  return c.json({ data: set, error: null }, 201);
});

sessionsRouter.patch("/:id/complete", async (c) => {
  const id = Number(c.req.param("id"));

  const [session] = await db
    .update(workoutSessions)
    .set({ completedAt: new Date().toISOString() })
    .where(eq(workoutSessions.id, id))
    .returning();

  if (!session) {
    return c.json({ data: null, error: "Session not found" }, 404);
  }

  return c.json({ data: session, error: null });
});
