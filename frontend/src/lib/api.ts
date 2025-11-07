
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
  return http<User>(`/auth/me`);
}

export async function logout() {
  await http<{ ok: true }>(`/auth/logout`, { method: "POST" });
  setAuthToken(null);
}

/* =========================
 * EXERCISES
 * ========================= */

export type ExerciseDto = { _id: string; name: string; muscleGroup: string };

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
  name: string; // vindo do teu formulário
  notes?: string; // se o schema não aceitar, NÃO envia
  items: Array<{ exerciseId: string; order: number }>;
}) {
  const body = {
    label: payload.name,                // <- controller usa "label"
    exercises: payload.items.map((it) => ({
      exerciseId: it.exerciseId,
      order: it.order,
    })),
    // notes: payload.notes,            // só inclua se o schema aceitar "notes"
  };

  return http<{ id: string }>(`/training-days`, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function getTrainingDays() {
  return http<Array<{ id: string; name: string }>>(`/training-days`);
}

export async function getTrainingDayById(id: string) {
  return http<{
    id: string;
    name: string;
    notes?: string;
    items: { exerciseId: string; order: number }[];
  }>(`/training-days/${id}`);
}

/* =========================
 * TRAINING SESSIONS
 * ========================= */

export type SessionSetInput = {
  reps: number | null;
  load: number | null;
  unit: "kg" | "stack" | "bodyweight";
};

export async function createTrainingSession(payload: {
  trainingDayId: string;
  startedAt?: string | null; // ISO
  notes?: string;
  items: Array<{
    exerciseId: string;
    order: number;
    sets: SessionSetInput[];
  }>;
}) {
  return http<{ id: string }>(`/training-sessions`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
