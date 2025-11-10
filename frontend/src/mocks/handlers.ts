/* eslint-disable @typescript-eslint/no-explicit-any */
import { http, HttpResponse, delay } from 'msw';

type Exercise = { _id: string; name: string; muscleGroup?: string; weightUnit?: 'kg'|'stack'|'bodyweight' };
type TrainingDay = { id: string; label: string; items: Array<{ exerciseId: string; order: number }> };
type Session = { id: string; trainingDayId: string; performedAt: string };

const mockUser = { id: 'u1', email: 'demo@example.com', name: 'Demo' };

const mockExercises: Exercise[] = [
  { _id: 'e1', name: 'Agachamento livre', muscleGroup: 'pernas', weightUnit: 'kg' },
  { _id: 'e2', name: 'Supino reto', muscleGroup: 'peito', weightUnit: 'kg' },
  { _id: 'e3', name: 'Remada curvada', muscleGroup: 'costas', weightUnit: 'kg' },
];

const mockDays: TrainingDay[] = [
  {
    id: 'd1',
    label: 'Full Body',
    items: [
      { exerciseId: 'e1', order: 0 },
      { exerciseId: 'e2', order: 1 },
      { exerciseId: 'e3', order: 2 },
    ],
  },
];

const mockSessions: Session[] = [
  { id: 's1', trainingDayId: 'd1', performedAt: new Date().toISOString() },
];

export const handlers = [
  // === AUTH ===
  http.post('*/auth/register', async ({ request }) => {
    await delay(300);
    const body = await request.json() as any;
    if (!body?.email || !body?.password) {
      return HttpResponse.json({ error: 'Campos obrigatórios' }, { status: 400 });
    }
    return HttpResponse.json({ id: 'new-user', email: body.email, name: body.name ?? null, token: 'mock.jwt.token' }, { status: 201 });
  }),

  http.post('*/auth/login', async ({ request }) => {
    await delay(300);
    const body = await request.json() as any;
    if (body?.email === mockUser.email) {
      return HttpResponse.json({ token: 'mock.jwt.token', user: mockUser });
    }
    return HttpResponse.json({ error: 'Credenciais inválidas' }, { status: 401 });
  }),

  http.get('*/auth/protected', () =>
    HttpResponse.json({ ok: true, user: mockUser })
  ),

  // === EXERCISES ===
  http.get('*/exercises', ({ request }) => {
    // query params ?limit & cursor & search (finge paginação)
    const url = new URL(request.url);
    const search = url.searchParams.get('search')?.toLowerCase() ?? '';
    const filtered = search
      ? mockExercises.filter(e => e.name.toLowerCase().includes(search))
      : mockExercises;

    return HttpResponse.json({ items: filtered, nextCursor: null });
  }),

  http.post('*/exercises', async ({ request }) => {
    const body = await request.json() as Partial<Exercise>;
    if (!body?.name) return HttpResponse.json({ error: 'name obrigatório' }, { status: 400 });
    const created: Exercise = {
      _id: crypto.randomUUID(),
      name: body.name!,
      muscleGroup: body.muscleGroup ?? '',
      weightUnit: (body.weightUnit ?? 'kg') as any,
    };
    mockExercises.push(created);
    return HttpResponse.json(created, { status: 201 });
  }),

  http.put('*/exercises/:id', async ({ params, request }) => {
    const { id } = params as { id: string };
    const patch = await request.json() as Partial<Exercise>;
    const idx = mockExercises.findIndex(e => e._id === id);
    if (idx === -1) return HttpResponse.json({ error: 'not found' }, { status: 404 });
    mockExercises[idx] = { ...mockExercises[idx], ...patch, _id: id };
    return HttpResponse.json(mockExercises[idx]);
  }),

  http.delete('*/exercises/:id', ({ params }) => {
    const { id } = params as { id: string };
    const idx = mockExercises.findIndex(e => e._id === id);
    if (idx === -1) return HttpResponse.json({ error: 'not found' }, { status: 404 });
    mockExercises.splice(idx, 1);
    return HttpResponse.json({ ok: true });
  }),

  // === TRAINING DAYS ===
  http.get('*/training-days', () =>
    HttpResponse.json(mockDays.map(d => ({ id: d.id, label: d.label })))
  ),

  http.get('*/training-days/:id', ({ params }) => {
    const day = mockDays.find(d => d.id === (params as any).id);
    if (!day) return HttpResponse.json({ error: 'not found' }, { status: 404 });
    // enriquece com nomes
    const items = day.items.map(it => ({
      ...it,
      name: mockExercises.find(e => e._id === it.exerciseId)?.name ?? 'Exercício',
    }));
    return HttpResponse.json({ id: day.id, label: day.label, items });
  }),

  // === SESSIONS ===
  http.get('*/training-sessions', () =>
    HttpResponse.json({ items: mockSessions, total: mockSessions.length, page: 1, limit: 20 })
  ),

  http.post('*/training-sessions', async ({ request }) => {
    const body = await request.json() as any;
    if (!body?.trainingDayId) return HttpResponse.json({ error: 'trainingDayId é obrigatório' }, { status: 400 });
    const created = { id: crypto.randomUUID(), trainingDayId: body.trainingDayId, performedAt: new Date().toISOString() };
    mockSessions.unshift(created);
    return HttpResponse.json(created, { status: 201 });
  }),
];
