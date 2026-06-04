import { describe, it, expect } from "vitest";
import { app } from "../app.js";

describe("Sessions", () => {
  let sessionId: number;

  it("POST /sessions creates a session", async () => {
    // First create a workout to reference
    const workoutRes = await app.request("/workouts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Session Test Workout",
        exercises: [
          { exerciseId: 1, order: 1, sets: 3, reps: 10, restSeconds: 60 },
        ],
      }),
    });
    const workout = (await workoutRes.json()).data;

    const res = await app.request("/sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ workoutId: workout.id }),
    });

    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.data.workoutId).toBe(workout.id);
    expect(body.data.completedAt).toBeNull();
    sessionId = body.data.id;
  });

  it("POST /sessions/:id/sets logs a set", async () => {
    // Get workout exercises to reference
    const sessRes = await app.request(`/sessions/${sessionId}`);
    const session = (await sessRes.json()).data;

    const res = await app.request(`/sessions/${sessionId}/sets`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        workoutExerciseId: 1,
        setNumber: 1,
        repsAchieved: 10,
        weightUsed: 60,
      }),
    });

    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.data.repsAchieved).toBe(10);
    expect(body.data.weightUsed).toBe(60);
  });

  it("PATCH /sessions/:id/complete marks session complete", async () => {
    const res = await app.request(`/sessions/${sessionId}/complete`, {
      method: "PATCH",
    });

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data.completedAt).not.toBeNull();
  });

  it("GET /sessions returns list", async () => {
    const res = await app.request("/sessions");
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(Array.isArray(body.data)).toBe(true);
    expect(body.data.length).toBeGreaterThan(0);
  });
});
