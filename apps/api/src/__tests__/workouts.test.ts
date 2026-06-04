import { describe, it, expect } from "vitest";
import { app } from "../app.js";

describe("POST /workouts", () => {
  it("creates a workout with exercises", async () => {
    const res = await app.request("/workouts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Test Workout",
        description: "A test workout",
        exercises: [
          { exerciseId: 1, order: 1, sets: 3, reps: 10, restSeconds: 60 },
          { exerciseId: 2, order: 2, sets: 4, reps: 8, restSeconds: 90 },
        ],
      }),
    });

    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.data.name).toBe("Test Workout");
    expect(body.data.id).toBeDefined();
  });

  it("rejects invalid workout (missing name)", async () => {
    const res = await app.request("/workouts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ exercises: [] }),
    });

    expect(res.status).toBe(400);
  });
});

describe("GET /workouts", () => {
  it("returns list of workouts", async () => {
    const res = await app.request("/workouts");
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(Array.isArray(body.data)).toBe(true);
  });
});
