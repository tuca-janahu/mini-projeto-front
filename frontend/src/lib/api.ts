
// src/lib/api.ts
// Uso: defina no .env do front -> VITE_API_URL=https://registros-treinos.tucajanahu.app
// Em dev local: VITE_API_URL=http://localhost:3000

/** Base da API (sem /api, já que suas rotas não usam esse prefixo no Vercel) */
export const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

/** Armazenamento simples do token (caso seu back retorne no corpo). */
const TOKEN_KEY = "token";
export function setAuthToken(token: string | null) {
  if (!token) localStorage.removeItem(TOKEN_KEY);
  else localStorage.setItem(TOKEN_KEY, token);
}
export function getAuthToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

/** Helper HTTP genérico */
async function http<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(init.headers as Record<string, string> | undefined),
  };

  // Se houver token salvo, envia como Bearer.
  const token = getAuthToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, {
    credentials: "include", // necessário se usar cookie httpOnly
    ...init,
    headers,
  });

  // Trata erros de forma simples e útil
  if (!res.ok) {
  let detail = "";
  try {
    const body = await res.json();
    // zod.flatten vem em body.error; serialize pra ver campos inválidos
    detail = body?.error ? JSON.stringify(body.error) : JSON.stringify(body);
  } catch {
    detail = await res.text().catch(() => "");
  }
  throw new Error(`HTTP ${res.status} - ${detail}`);
}

  // Algumas rotas 204 não têm body
  if (res.status === 204) return undefined as unknown as T;
  return res.json() as Promise<T>;
}

/* =========================
 * AUTH
 * ========================= */

export type User = { id: string; name: string | null; email: string };

export async function register(data: {
  name?: string;
  email: string;
  password: string;
}) {
  const out = await http<User & { token?: string }>(`/auth/register`, {
    method: "POST",
    body: JSON.stringify(data),
  });
  if (out.token) setAuthToken(out.token);
  return out as User;
}

export async function login(data: { email: string; password: string }) {
  const out = await http<User & { token?: string }>(`/auth/login`, {
    method: "POST",
    body: JSON.stringify(data),
  });
  if (out.token) setAuthToken(out.token);
  return out as User;
}

export async function me() {
  return http<User>(`/auth/protected`);
}

export async function logout() {
  try {
    await http<{ ok: true }>(`/auth/logout`, { method: "POST" });
  } catch {
    // ignore
  }
  setAuthToken(null);
}

/* =========================
 * EXERCISES
 * ========================= */

export type ExerciseDto = { _id: string; name: string; muscleGroup: string, weightUnit: "kg" | "stack" | "bodyweight";  };

export async function createExercise(payload: {
  name: string;
  muscleGroup: string;             // ex.: "peito"
  weightUnit: "kg" | "stack" | "bodyweight";
}) {
  return http<{ id: string }>(`/exercises`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function listExercises(params: {
  search?: string;
  muscle?: string;
  limit?: number;
  cursor?: string;
} = {}) {
  const q = new URLSearchParams();
  if (params.search) q.set("search", params.search);
  if (params.muscle) q.set("muscle", params.muscle);
  if (params.limit) q.set("limit", String(params.limit));
  if (params.cursor) q.set("cursor", params.cursor);
const suf = q.toString() ? `?${q.toString()}` : "";
return http<{ items: ExerciseDto[]; nextCursor: string | null }>(`/exercises${suf}`);
}

/* =========================
 * TRAINING DAYS
 * ========================= */

export type TrainingDayItemInput = { exerciseId: string; order: number };

export async function createTrainingDay(payload: {
  name: string; // vindo do formulário
  items: Array<{ exerciseId: string; order: number }>;
}) {
  const body = {
    label: payload.name,                // <- controller usa "label"
    exercises: payload.items.map((it) => ({
      exerciseId: it.exerciseId,
      order: it.order,
    })),
  };

  return http<{ id: string }>(`/training-days`, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export type TrainingDayDto = { id: string; label: string };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapDay(raw: any): TrainingDayDto {
  return {
    id: String(raw.id ?? raw._id),
    label: String(raw.label ?? raw.name ?? ""),
  };
}

export async function getTrainingDays(): Promise<TrainingDayDto[]> {
  const data = await http<TrainingDayDto[]>("/training-days"); // o que seu back retorna
  return (Array.isArray(data) ? data : []).map(mapDay);
}

export type TrainingDayDetail = {
  id: string;
  label: string;
  items: { exerciseId: string; order: number }[];
};

export async function getTrainingDayById(id: string): Promise<TrainingDayDetail> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const raw = await http<any>(`/training-days/${encodeURIComponent(id)}`);
  const items =
    Array.isArray(raw.items) ? raw.items :
    Array.isArray(raw.exercises) ? raw.exercises : [];

  return {
    id: String(raw.id ?? raw._id),
    label: String(raw.label ?? raw.name ?? ""),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    items: items.map((it: any) => ({
      exerciseId: String(it.exerciseId),
      order: Number(it.order ?? 0),
    })),
  };
}

/* =========================
 * TRAINING SESSIONS
 * ========================= */

export type SessionSetInput = {
  reps: number | null;
  load: number | null;
  unit: "kg" | "stack" | "bodyweight";
};

type DraftPayload = {
  trainingDayId: string;
  items: Array<{
    exerciseId: string;
    sets: Array<{ reps: number | null | ""; load: number | null | ""; unit: "kg"|"stack"|"bodyweight" }>;
  }>;
  notes?: string;
  performedAt?: string | Date;
};

export async function createTrainingSession(draft: DraftPayload) {
  const exercises = draft.items
    .filter((it) => it.sets.length > 0)
    .map((it) => ({
      exerciseId: it.exerciseId,
      sets: it.sets.map((s) => ({
        reps: s.reps === "" ? null : Number(s.reps),
        weight:
          s.unit === "bodyweight"
            ? null
            : s.load === "" ? null : Number(s.load),
      })),
    }));

  const body = {
    trainingDayId: draft.trainingDayId,
    performedAt: draft.performedAt ?? new Date().toISOString(),
    exercises,
    notes: draft.notes ?? undefined,
  };

  return http("/training-sessions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}