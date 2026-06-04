import { db } from "./index.js";
import { exercises, exerciseMuscles } from "./schema.js";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

interface ExerciseData {
  name: string;
  explanation: string;
  video_url: string | null;
  muscles: string[];
}

const data: ExerciseData[] = JSON.parse(
  readFileSync(resolve(__dirname, "../../../data/exercises.json"), "utf-8")
);

async function seed() {
  console.log("Seeding exercises...");

  for (const exercise of data) {
    const [inserted] = await db
      .insert(exercises)
      .values({
        name: exercise.name,
        explanation: exercise.explanation,
        videoUrl: exercise.video_url,
      })
      .returning();

    for (const muscle of exercise.muscles) {
      await db.insert(exerciseMuscles).values({
        exerciseId: inserted.id,
        muscleName: muscle,
      });
    }
  }

  console.log(`Seeded ${data.length} exercises.`);
}

seed();
