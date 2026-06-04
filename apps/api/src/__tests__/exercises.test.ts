import { describe, it, expect } from "vitest";
import { app } from "../app.js";

describe("GET /", () => {
  it("returns ok status", async () => {
    const res = await app.request("/");
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ status: "ok" });
  });
});

describe("GET /exercises", () => {
  it("returns a list of exercises", async () => {
    const res = await app.request("/exercises");
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.error).toBeNull();
    expect(Array.isArray(body.data)).toBe(true);
    expect(body.data.length).toBeGreaterThan(0);
    expect(body.data[0]).toHaveProperty("name");
    expect(body.data[0]).toHaveProperty("muscles");
  });

  it("returns a single exercise by id", async () => {
    const res = await app.request("/exercises/1");
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data.id).toBe(1);
    expect(body.data.muscles.length).toBeGreaterThan(0);
  });

  it("returns 404 for non-existent exercise", async () => {
    const res = await app.request("/exercises/9999");
    expect(res.status).toBe(404);
    const body = await res.json();
    expect(body.error).toBe("Exercise not found");
  });
});
