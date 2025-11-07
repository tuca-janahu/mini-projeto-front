import { useEffect, useMemo, useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Label from "../../components/Label";
import Input from "../../components/Input";
import SelectBase from "../../components/SelectBase";
import { toast } from "react-toastify";
import SessionExerciseCard from "./components/SessionExerciseCard";
import type { SetRow } from "./components/SetTable";
import {
  getTrainingDays,
  getTrainingDayById,
  listExercises,
  createTrainingSession,
  type ExerciseDto,
  type TrainingDayDto,
} from "../../lib/api";

import { weightUnitOptions } from "../../constants/options";

/* ======================== Tipos mínimos ======================== */
type WeightUnit = "kg" | "stack" | "bodyweight";

type SessionItem = {
  exerciseId: string;
  name: string;
  muscleGroup: string;
  order: number;
  baseUnit: WeightUnit;
  sets: SetRow[];
};

/* ======================== Página ======================== */
export default function SessionPage() {
  const [days, setDays] = useState<TrainingDayDto[]>([]);
  const [notes, setNotes] = useState<string>("");
  const [exIndex, setExIndex] = useState<
    Record<
      string,
      { name: string; muscleGroup: string; weightUnit: WeightUnit }
    >
  >({});
  const [loadingBoot, setLoadingBoot] = useState(true);

  const [trainingDayId, setTrainingDayId] = useState<string>("");
  const [items, setItems] = useState<SessionItem[]>([]);
  const [saving, setSaving] = useState(false);

  const dayOptions = useMemo(
    () => days.map((d) => ({ value: d.id, label: d.label })),
    [days]
  );

  useEffect(() => {
    // Remova após validar
    console.table(days);
    console.table(dayOptions);
  }, [days, dayOptions]);

  // Carrega lista de dias (mock → depois GET /training-days?mine=true)
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoadingBoot(true);
        const [daysApi, exApi] = await Promise.all([
          getTrainingDays(),
          listExercises({ limit: 500 }), // índice local p/ nome/grupo
        ]);

        if (!alive) return;

        const idx: Record<
          string,
          {
            name: string;
            muscleGroup: string;
            weightUnit: ExerciseDto["weightUnit"];
          }
        > = {};
        (exApi.items as ExerciseDto[]).forEach((e) => {
          idx[e._id] = {
            name: e.name,
            muscleGroup: e.muscleGroup ?? "",
            weightUnit: e.weightUnit ?? "kg", // fallback seguro
          };
        });

        setDays(daysApi);
        setExIndex(idx);
      } catch (err: Error | unknown) {
        toast.error(
          (err as Error)?.message ?? "Falha ao carregar dados iniciais"
        );
      } finally {
        if (alive) setLoadingBoot(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  /* ===== 3) ao escolher um dia, monta os exercícios da sessão (sem sets) ===== */
  useEffect(() => {
    let alive = true;
    if (!trainingDayId) {
      setItems([]);
      return;
    }
    (async () => {
      try {
        const day = await getTrainingDayById(trainingDayId);
        if (!alive) return;

        // Enriquecemos com nome/muscleGroup a partir do índice local
        const mapped: SessionItem[] = day.items
          .sort((a, b) => a.order - b.order)
          .map((it) => ({
            exerciseId: it.exerciseId,
            name: exIndex[it.exerciseId]?.name ?? "Exercício",
            muscleGroup: exIndex[it.exerciseId]?.muscleGroup ?? "",
            order: it.order,
            baseUnit: exIndex[it.exerciseId]?.weightUnit ?? "kg",
            sets: [], // o usuário vai adicionar
          }));

        setItems(mapped);
      } catch (err: Error | unknown) {
        toast.error(
          (err as Error)?.message ?? "Falha ao carregar exercícios do dia"
        );
      }
    })();
    return () => {
      alive = false;
    };
  }, [trainingDayId, exIndex]);

  /* ===== 4) helpers de sets ===== */
  function addSet(exerciseId: string) {
    setItems((arr) =>
      arr.map((it) =>
        it.exerciseId === exerciseId
          ? {
              ...it,
              sets: [
                ...it.sets,
                {
                  tempId: crypto.randomUUID(),
                  reps: "",
                  load: "",
                  unit: it.baseUnit,
                },
              ],
            }
          : it
      )
    );
  }

  function updateSet(
    exerciseId: string,
    tempId: string,
    patch: Partial<Omit<SetRow, "tempId">>
  ) {
    setItems((arr) =>
      arr.map((it) =>
        it.exerciseId === exerciseId
          ? {
              ...it,
              sets: it.sets.map((s) =>
                s.tempId === tempId ? { ...s, ...patch } : s
              ),
            }
          : it
      )
    );
  }

  function removeSet(exerciseId: string, tempId: string) {
    setItems((arr) =>
      arr.map((it) =>
        it.exerciseId === exerciseId
          ? { ...it, sets: it.sets.filter((s) => s.tempId !== tempId) }
          : it
      )
    );
  }

  const canSave = useMemo(
    () => trainingDayId !== "" && items.some((it) => it.sets.length > 0),
    [trainingDayId, items]
  );

  /* ===== 5) salvar sessão ===== */
  async function handleSave() {
    if (!canSave) return;
    try {
      setSaving(true);

      // Mapeia para o payload que o backend espera
      const payload = {
        trainingDayId,
        items: items.map((it, order) => ({
          exerciseId: it.exerciseId,
          order, // mantém a ordem visível
          sets: it.sets.map((s) => ({
            reps: s.reps === "" ? null : Number(s.reps),
            load: s.load === "" ? null : Number(s.load),
            unit: s.unit,
          })),
        })),
      };

      await createTrainingSession(payload);
      toast.success("Sessão salva com sucesso!");
      // navigate("/training-sessions")
    } catch (err: Error | unknown) {
      toast.error((err as Error)?.message ?? "Falha ao salvar sessão");
    } finally {
      setSaving(false);
    }
  }

  /* ===== 6) UI ===== */
  if (loadingBoot) {
    return (
      <div className="p-6 text-sm m-auto text-neutral-500">Carregando…</div>
    );
  }

  return (
    <main>
      <Header />
      <div className="mx-auto max-w-6xl p-4">
        <h1 className="text-2xl font-semibold mb-4">Nova sessão de treino</h1>

        <div className="grid gap-3 sm:grid-cols-3 mb-6">
          <div className="space-y-1 sm:col-span-1">
            <label htmlFor="training-day" className="text-sm font-medium">
              Dia de treino
            </label>
            <SelectBase
              id="training-day"
              value={trainingDayId}
              onChange={setTrainingDayId}
              placeholder="Selecione o dia"
              options={dayOptions}
              required
            />
</div>
            <div className="space-y-1 sm:col-span-2">
              <Label htmlFor="notes">Notas</Label>
              <Input
                id="notes"
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Observações gerais (aquecimento, técnica, etc.)"
              />
            </div>
          
        </div>

        {items.length === 0 ? (
          <p className="text-sm text-neutral-500">
            Nenhum exercício carregado para este dia.
          </p>
        ) : (
          <ul className="space-y-4">
            {items.map((it) => (
              <SessionExerciseCard
                key={it.exerciseId}
                exerciseId={it.exerciseId}
                name={it.name}
                sets={it.sets}
                weightOptions={weightUnitOptions}
                onAddSet={addSet}
                onChangeSet={updateSet}
                onRemoveSet={removeSet}
                unitDisabled={true}
              />
            ))}
          </ul>
        )}

        <div className="mt-6">
          <button
            onClick={handleSave}
            disabled={!canSave || saving}
            className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            {saving ? "Salvando..." : "Salvar sessão"}
          </button>
        </div>
      </div>
      <Footer />
    </main>
  );
}
