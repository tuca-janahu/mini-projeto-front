import { useEffect, useMemo, useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Input from "../../components/Input";
import Label from "../../components/Label";
import SelectBase, { type Option } from "../../components/SelectBase";
import SessionExerciseCard from "./components/SessionExerciseCard";

/* ======================== Tipos mínimos ======================== */
type WeightUnit = "kg" | "stack" | "bodyweight";

type Exercise = {
  id: number;
  name: string;
  defaultUnit: WeightUnit;
};

type TrainingDay = {
  id: number;
  name: string;
  items: { exerciseId: number; order: number }[];
};

type SetRow = {
  tempId: string; // id local
  reps: number | ""; // vazio = null no payload
  load: number | ""; // idem
  unit: WeightUnit; // unidade do set
};

type SessionExercise = {
  exerciseId: number;
  name: string;
  sets: SetRow[];
};

type SessionDraft = {
  trainingDayId: number | null;
  notes: string;
  startedAt: string; // ISO date-time local
  items: SessionExercise[];
};

/* ======================== MOCKs (troque por API depois) ======================== */
// Exercícios do catálogo (normalmente você tem isso no banco)
const EXERCISES: Exercise[] = [
  { id: 1, name: "Supino reto", defaultUnit: "kg" },
  { id: 2, name: "Agachamento livre", defaultUnit: "kg" },
  { id: 3, name: "Remada curvada", defaultUnit: "kg" },
  { id: 4, name: "Desenvolvimento", defaultUnit: "kg" },
  { id: 5, name: "Puxada na frente", defaultUnit: "kg" },
];

// Dias de treino já salvos (cada um lista apenas exerciseId e ordem)
const TRAINING_DAYS: TrainingDay[] = [
  {
    id: 10,
    name: "Full Body",
    items: [
      { exerciseId: 2, order: 0 },
      { exerciseId: 5, order: 1 },
      { exerciseId: 1, order: 2 },
      { exerciseId: 3, order: 3 },
    ],
  },
  {
    id: 11,
    name: "Upper A",
    items: [
      { exerciseId: 1, order: 0 },
      { exerciseId: 4, order: 1 },
      { exerciseId: 5, order: 2 },
    ],
  },
];

const WEIGHT_OPTIONS: { value: WeightUnit; label: string }[] = [
  { value: "kg", label: "kg" },
  { value: "stack", label: "Placa" },
  { value: "bodyweight", label: "Peso corporal" },
];

/* ======================== Página ======================== */
export default function SessionPage() {
  const [days, setDays] = useState<TrainingDay[]>([]);
  const [draft, setDraft] = useState<SessionDraft>(() => ({
    trainingDayId: null,
    notes: "",
    startedAt: toLocalDateTimeInput(new Date()),
    items: [],
  }));

  const dayOptions: Option[] = useMemo(
    () => days.map((d) => ({ value: String(d.id), label: d.name })),
    [days]
  );

  // Carrega lista de dias (mock → depois GET /training-days?mine=true)
  useEffect(() => {
    setDays(TRAINING_DAYS);
  }, []);

  // Quando muda o dia selecionado, carregamos seus exercícios
  useEffect(() => {
    if (!draft.trainingDayId) return;
    const day = days.find((d) => d.id === draft.trainingDayId);
    if (!day) return;

    // Monta a lista de exercícios da sessão com 0 sets inicialmente
    const items: SessionExercise[] = day.items
      .sort((a, b) => a.order - b.order)
      .map(({ exerciseId }) => {
        const ex = EXERCISES.find((e) => e.id === exerciseId);
        return {
          exerciseId,
          name: ex?.name ?? `Exercício ${exerciseId}`,
          sets: [], // começa vazio; usuário vai adicionar
        };
      });

    setDraft((d) => ({ ...d, items }));
  }, [draft.trainingDayId, days]);

  function addSet(exerciseId: number) {
    const ex = EXERCISES.find((e) => e.id === exerciseId);
    const fallbackUnit: WeightUnit = ex?.defaultUnit ?? "kg";
    setDraft((d) => ({
      ...d,
      items: d.items.map((it) =>
        it.exerciseId === exerciseId
          ? {
              ...it,
              sets: [
                ...it.sets,
                {
                  tempId: crypto.randomUUID(),
                  reps: "",
                  load: "",
                  unit: fallbackUnit,
                },
              ],
            }
          : it
      ),
    }));
  }

  function removeSet(exerciseId: number, tempId: string) {
    setDraft((d) => ({
      ...d,
      items: d.items.map((it) =>
        it.exerciseId === exerciseId
          ? { ...it, sets: it.sets.filter((s) => s.tempId !== tempId) }
          : it
      ),
    }));
  }

  function updateSet(
    exerciseId: number,
    tempId: string,
    patch: Partial<Omit<SetRow, "tempId">>
  ) {
    setDraft((d) => ({
      ...d,
      items: d.items.map((it) =>
        it.exerciseId === exerciseId
          ? {
              ...it,
              sets: it.sets.map((s) =>
                s.tempId === tempId ? { ...s, ...patch } : s
              ),
            }
          : it
      ),
    }));
  }

  // payload para POST /training-sessions
  function buildPayload() {
    return {
      trainingDayId: draft.trainingDayId,
      startedAt: toISOFromLocalInput(draft.startedAt), // opcional
      notes: draft.notes,
      items: draft.items.map((it, order) => ({
        exerciseId: it.exerciseId,
        order,
        sets: it.sets.map((s) => ({
          reps: s.reps === "" ? null : Number(s.reps),
          load: s.load === "" ? null : Number(s.load),
          unit: s.unit,
        })),
      })),
    };
  }

  async function handleSave() {
    const payload = buildPayload();
    console.log("payload pronto para POST /training-sessions:", payload);

    // Depois, troque por:
    // await api.post("/training-sessions", payload);
    // navigate(`/training-sessions/${res.data.id}`);
  }

  const canSave =
    !!draft.trainingDayId &&
    draft.items.length > 0 &&
    draft.items.every((it) => it.sets.length > 0); // exige ao menos 1 set por exercício

  // Para exibir o nome do dia no topo
  const currentDayName = useMemo(() => {
    const d = days.find((x) => x.id === draft.trainingDayId);
    return d?.name ?? "";
  }, [draft.trainingDayId, days]);

  return (
    <main>
      <Header />
      <div className="mx-auto max-w-6xl p-4 min-h-[80vh]">
        <h1 className="text-2xl font-semibold my-6">Nova Training Session</h1>

        <div className="grid gap-3 sm:grid-cols-3 mb-6">
          <div className="space-y-1">
            <label htmlFor="training-day" className="text-sm font-medium">
              Dia de treino
            </label>

            <SelectBase
              id="training-day"
              value={
                draft.trainingDayId == null ? "" : String(draft.trainingDayId)
              }
              onChange={(v) =>
                setDraft((d) => ({
                  ...d,
                  trainingDayId: v === "" ? null : Number(v),
                }))
              }
              options={dayOptions}
              placeholder="Selecione o dia"
              className={`w-full ${
                draft.trainingDayId == null ? "text-gray-400" : "text-gray-900"
              }`}
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="startedAt" className="text-sm font-medium">
              Início
            </Label>
            <Input
              id="startedAt"
              type="datetime-local"
              value={draft.startedAt}
              onChange={(e) =>
                setDraft((d) => ({ ...d, startedAt: e.target.value }))
              }
            />
          </div>

          <div className="space-y-1 sm:col-span-1">
            <Label htmlFor="notes" className="text-sm font-medium">
              Notas
            </Label>
            <Input
              id="notes"
              type="text"
              placeholder="Sensação do treino, dores, etc."
              value={draft.notes}
              onChange={(e) =>
                setDraft((d) => ({ ...d, notes: e.target.value }))
              }
              
            />
          </div>
        </div>

        {/* Exercícios do dia selecionado */}
        {draft.trainingDayId && (
          <section className="rounded-2xl border p-4">
            <h2 className="text-lg font-semibold mb-3">
              Exercícios —{" "}
              <span className="text-neutral-600">{currentDayName}</span>
            </h2>

            {draft.items.length === 0 ? (
              <p className="text-sm text-neutral-500">
                Este dia não tem exercícios.
              </p>
            ) : (
              <ul className="space-y-4">
                {draft.items.map((it) => (
                  <SessionExerciseCard
                    key={it.exerciseId}
                    exerciseId={it.exerciseId}
                    name={it.name}
                    sets={it.sets}
                    weightOptions={WEIGHT_OPTIONS}
                    unitDisabled
                    onAddSet={addSet}
                    onChangeSet={updateSet}
                    onRemoveSet={removeSet}
                  />
                ))}
              </ul>
            )}

            <div className="mt-4 flex items-center justify-end">
              <button
                onClick={handleSave}
                className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
                disabled={!canSave}
              >
                Salvar sessão
              </button>
            </div>
          </section>
        )}
      </div>
      <Footer />
    </main>
  );
}

/* ======================== Helpers de data/hora ======================== */
// datetime-local quer "YYYY-MM-DDTHH:mm"
function toLocalDateTimeInput(d: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
}

// Converte "YYYY-MM-DDTHH:mm" (sem timezone) para ISO assumindo localtime
function toISOFromLocalInput(s: string) {
  if (!s) return null;
  const [date, time] = s.split("T");
  const [y, m, d] = date.split("-").map(Number);
  const [hh, mm] = time.split(":").map(Number);
  const asLocal = new Date(y, (m ?? 1) - 1, d ?? 1, hh ?? 0, mm ?? 0, 0);
  return asLocal.toISOString();
}
