import { useState, useEffect } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Input from "../../components/Input";
import ExerciseCatalog, { type Exercise } from "../../components/ExerciseCatalog";
import Label from "../../components/Label";
import { createTrainingDay, listExercises, type ExerciseDto } from "../../lib/api";
import { toast } from "react-toastify";

type DayItem = {
  tempId: string;
  exerciseId: string;
  name: string;
  muscleGroup: string;
};

export default function DayPage() {
  // form (nome do dia e notas)
  const [name, setName] = useState<string>("Full Body");

  // catálogo vindo do backend
  const [catalog, setCatalog] = useState<Exercise[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [items, setItems] = useState<Array<DayItem>>([]);

  function addExercise(ex: Exercise) {
    if (items.some((i) => i.exerciseId === ex.id)) {
      toast.info("Esse exercício já foi adicionado.");
      return;
    }
    setItems((arr) => [
      ...arr,
      {
        tempId: crypto.randomUUID(),
        exerciseId: ex.id,
        name: ex.name,
        muscleGroup: ex.muscleGroup,
      },
    ]);
    toast.success(`Adicionado: ${ex.name}`);
  }

  function removeItem(tempId: string) {
    setItems((arr) => arr.filter((i) => i.tempId !== tempId));
  }

  function moveItem(tempId: string, dir: -1 | 1) {
    setItems((arr) => {
      const i = arr.findIndex((x) => x.tempId === tempId);
      if (i < 0) return arr;
      const j = i + dir;
      if (j < 0 || j >= arr.length) return arr;
      const copy = arr.slice();
      [copy[i], copy[j]] = [copy[j], copy[i]];
      return copy;
    });
  }

  // primeira carga do catálogo
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const res = await listExercises({ limit: 50 });
        if (!alive) return;

        // mapeia DTO do back → tipo Exercise do catálogo
        const mapped: Exercise[] = res.items.map((e: ExerciseDto) => ({
          id: e._id,
          name: e.name,
          muscleGroup: e.muscleGroup ??  "",
        }));

        setCatalog(mapped);
        setNextCursor(res.nextCursor);
      } catch (err: Error | unknown) {
        toast.error((err as Error)?.message ?? "Falha ao carregar exercícios");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  async function loadMore() {
    if (!nextCursor || loading) return;
    try {
      setLoading(true);
      const res = await listExercises({ limit: 50, cursor: nextCursor });
      const mapped: Exercise[] = res.items.map((e: ExerciseDto) => ({
        id: e._id,
        name: e.name,
        muscleGroup: e.muscleGroup ?? "",
      }));
      setCatalog((curr) => [...curr, ...mapped]);
      setNextCursor(res.nextCursor);
    } catch (err: Error | unknown) {
      toast.error(
        (err as Error)?.message ?? "Falha ao carregar mais exercícios"
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    const payload = {
      name,
      items: items.map((it, order) => ({ exerciseId: it.exerciseId, order })),
    };

    console.log("POST /training-days ->", payload);

    try {
      await createTrainingDay(payload);
      toast.success("Dia de treino salvo!");
      // navigate("/training-days") ...
    } catch (err: Error | unknown) {
      toast.error((err as Error)?.message ?? "Falha ao salvar dia");
    }
  }

  return (
    <main>
      <Header />
      <div className="mx-auto max-w-6xl p-4">
        <h1 className="text-2xl font-semibold my-6">Novo Dia de Treino</h1>

        {/* Cabeçalho: nome e notas */}
        <div className="grid gap-3 sm:grid-cols-3 mb-6">
          <div className="space-y-1 sm:col-span-1">
            <Label htmlFor="day-name">Nome do dia</Label>
            <Input
              id="day-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="ex.: Full Body A"
            />
          </div>
          
        </div>

        <div className="grid gap-6 lg:grid-cols-2 min-h-110">
          
            <ExerciseCatalog
              catalog={catalog}
              onAdd={addExercise}
              selectedIds={items.map((it) => it.exerciseId)}
            ></ExerciseCatalog>

            {loading && (
              <p className="text-sm text-neutral-500 mt-2">Carregando…</p>
            )}
            {nextCursor && !loading && (
              <div className="mt-3">
                <button
                  onClick={loadMore}
                  className="rounded-md border px-3 py-1.5 text-sm hover:bg-neutral-50"
                >
                  Carregar mais
                </button>
              </div>
            )}
          

          {/* Dia atual (apenas ordem) */}
          <section className="rounded-2xl border-2 bg-white  border-gray-300 p-4">
            <h2 className="text-lg font-semibold mb-3">Exercícios do dia</h2>

            {items.length === 0 ? (
              <p className="text-sm text-neutral-500">
                Nenhum exercício adicionado ainda.
              </p>
            ) : (
              <ul className="space-y-2">
                {items.map((it, idx) => (
                  <li
                    key={it.tempId}
                    className="flex items-center justify-between rounded-md border px-3 py-2"
                  >
                    <div>
                      <p className="font-medium">
                        {idx + 1}. {it.name}
                      </p>
                      <p className="text-xs text-neutral-500">{it.muscleGroup}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => moveItem(it.tempId, -1)}
                        disabled={idx === 0}
                        className="rounded-md border px-2 py-1 text-xs disabled:opacity-40"
                        title="Mover para cima"
                      >
                        ↑
                      </button>
                      <button
                        onClick={() => moveItem(it.tempId, 1)}
                        disabled={idx === items.length - 1}
                        className="rounded-md border px-2 py-1 text-xs disabled:opacity-40"
                        title="Mover para baixo"
                      >
                        ↓
                      </button>
                      <button
                        onClick={() => removeItem(it.tempId)}
                        className="rounded-md border px-2 py-1 text-xs hover:bg-red-50 hover:border-red-300"
                      >
                        Remover
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-4 flex items-center justify-between">
              <button
                onClick={() => setItems([])}
                className="rounded-md border px-3 py-2 text-sm hover:bg-neutral-50"
                disabled={items.length === 0}
              >
                Limpar tudo
              </button>
              <button
                onClick={handleSave}
                className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:opacity-90"
                disabled={name.trim() === "" || items.length === 0}
              >
                Salvar dia
              </button>
            </div>
          </section>
        </div>
      </div>
      <Footer />
    </main>
  );
}
