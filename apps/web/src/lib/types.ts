export interface Exercise {
  id: number;
  name: string;
  explanation: string;
  videoUrl: string | null;
  muscles: { id: number; exerciseId: number; muscleName: string }[];
}

export interface Workout {
  id: number;
  name: string;
  description: string | null;
  createdAt: string;
}

export interface WorkoutSession {
  id: number;
  workoutId: number;
  startedAt: string;
  completedAt: string | null;
}
