import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { exercisesRouter } from "./routes/exercises.js";
import { workoutsRouter } from "./routes/workouts.js";
import { sessionsRouter } from "./routes/sessions.js";

const app = new Hono();

app.use("*", cors());

app.route("/exercises", exercisesRouter);
app.route("/workouts", workoutsRouter);
app.route("/sessions", sessionsRouter);

app.get("/", (c) => c.json({ status: "ok" }));

const port = Number(process.env.PORT) || 3001;
console.log(`API server running on http://localhost:${port}`);

serve({ fetch: app.fetch, port });

export { app };
