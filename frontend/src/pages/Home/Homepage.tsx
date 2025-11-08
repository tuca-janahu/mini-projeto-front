/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import ExerciseCatalog, {
  type Exercise,
} from "../../components/ExerciseCatalog";
import {
  listExercises,
  type ExerciseDto,
  listMyTrainingDays,
  getTrainingDayById,
  type TrainingDayLite,
  listTrainingSessions,
  type TrainingSessionLite,
  getTrainingDayName,
} from "../../lib/api";
import { toast } from "react-toastify";
import { useEffect, useMemo, useState } from "react";
import SelectBase, { type Option } from "../../components/SelectBase";

export default function Home() {
  const [catalog, setCatalog] = useState<Exercise[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [exIndex, setExIndex] = useState<
    Record<string, { name: string; muscleGroup?: string }>
  >({});
  const [loading, setLoading] = useState(false);
  const [days, setDays] = useState<TrainingDayLite[]>([]);
  const [selectedDayId, setSelectedDayId] = useState<string>("");
  const [recentSessions, setRecentSessions] = useState<TrainingSessionLite[]>(
    []
  );
  const [loadingSessions, setLoadingSessions] = useState(false);

  const today = new Date().toLocaleDateString();
  const quickActions = [
    { label: "Novo exercício", to: "/exercises" },
    { label: "Novo dia de treino", to: "/training-days" },
    { label: "Nova sessão", to: "/training-sessions" },
  ];

  const dayOptions: Option[] = useMemo(
    () => days.map((d) => ({ value: d.id, label: d.label })),
    [days]
  );

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoadingSessions(true);
        const { items } = await listTrainingSessions({
          limit: 3,
          sort: "desc",
        });
        if (!alive) return;
        const resolved = await Promise.all(
          items.map(async (s) => ({
            ...s,
            title: await getTrainingDayName(String(s.trainingDayId ?? "")),
            date: new Date(s.performedAt).toLocaleDateString(),
          }))
        );

        if (!alive) return;
        setRecentSessions(resolved);
      } catch (e: Error | unknown) {
        toast.error((e as Error)?.message ?? "Falha ao carregar sessões");
      } finally {
        if (alive) setLoadingSessions(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const mine = await listMyTrainingDays();
        if (!alive) return;
        setDays(mine);
        if (mine.length > 0) setSelectedDayId(mine[0].id); // pré-seleciona 1º
      } catch (e: Error | unknown) {
        toast.error((e as Error)?.message ?? "Falha ao carregar dias");
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const res = await listExercises({ limit: 50 });

        if (!alive) return;

        const mapped: Exercise[] = res.items.map((e: ExerciseDto) => ({
          id: e._id,
          name: e.name,
          muscleGroup: e.muscleGroup ?? "",
        }));
        setCatalog(mapped);
        setNextCursor(res.nextCursor);

        const idx: Record<string, { name: string; muscleGroup?: string }> = {};
        res.items.forEach((e: ExerciseDto) => {
          idx[e._id] = { name: e.name, muscleGroup: e.muscleGroup ?? "" };
        });
        setExIndex(idx);
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
      const res = await listExercises({ limit: 10, cursor: nextCursor });

      const mapped: Exercise[] = res.items.map((e: ExerciseDto) => ({
        id: e._id,
        name: e.name,
        muscleGroup: e.muscleGroup ?? "",
      }));
      setCatalog((curr) => [...curr, ...mapped]);
      setNextCursor(res.nextCursor);

      // merge no índice
      setExIndex((prev) => {
        const copy = { ...prev };
        res.items.forEach((e: ExerciseDto) => {
          copy[e._id] = { name: e.name, muscleGroup: e.muscleGroup ?? "" };
        });
        return copy;
      });
    } catch (err: Error | unknown) {
      toast.error(
        (err as Error)?.message ?? "Falha ao carregar mais exercícios"
      );
    } finally {
      setLoading(false);
    }
  }

  // COMPONENTIZAR DPS

  type SimpleRow = { name: string, muscleGroup?: string };

  const [todayTitle, setTodayTitle] = useState<string>("Sem dia definido");
  const [todayRows, setTodayRows] = useState<SimpleRow[]>([]);
  const [loadingToday, setLoadingToday] = useState(false);

  useEffect(() => {
    let alive = true;
    if (!selectedDayId) {
      setTodayTitle("Sem dia definido");
      setTodayRows([]);
      return;
    }
    (async () => {
      try {
        setLoadingToday(true);
        const day = await getTrainingDayById(selectedDayId);
        if (!alive) return;
        setTodayTitle(day.label ?? "Dia");
        // back retorna { items: [{ exerciseId, order }...] }
        // se não tiver, mapeia pra "Exercício" 
        const rows = (day.items ?? [])
          .sort((a: any, b: any) => a.order - b.order)
          .map((it: any) => ({
            name: exIndex[it.exerciseId]?.name ?? "Exercício",
            muscleGroup: exIndex[it.exerciseId]?.muscleGroup,
          }));
        setTodayRows(rows);
      } catch (e: any) {
        toast.error(e?.message ?? "Falha ao carregar o dia");
        setTodayRows([]);
      } finally {
        if (alive) setLoadingToday(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [exIndex, selectedDayId]);

  return (
    <main className="w-full max-w-100vw max-h-100vh m-auto">
      <Header />

      <section className="mx-auto max-w-7xl px-4 py-6">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm text-neutral-500">Hoje • {today}</p>
            <h2 className="text-2xl font-bold tracking-tight">
              Bem-vindo de volta! Pronto para treinar?
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {quickActions.map((a) => (
              <Link
                key={a.label}
                to={a.to}
                className="rounded-xl border px-4 py-2 text-sm font-medium hover:bg-black hover:text-white transition-colors"
              >
                {a.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl border p-5">
              <div className="mb-4 flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold">Treino de hoje</h3>
                  <p className="text-sm text-neutral-600">{todayTitle}</p>
                </div>

                <div className="w-56">
                  <SelectBase
                    id="home-day"
                    value={selectedDayId}
                    onChange={setSelectedDayId}
                    options={dayOptions}
                    placeholder="Selecione o dia"
                    required
                  />
                </div>
                <Link
                  to={
                    selectedDayId
                      ? `/training-sessions?day=${selectedDayId}`
                      : "/training-sessions"
                  }
                  className="rounded-xl bg-black px-4 py-2 text-sm font-medium text-white hover:opacity-90"
                >
                  Iniciar treino
                </Link>
              </div>
              {loadingToday ? (
                <p className="text-sm text-neutral-500">Carregando…</p>
              ) : todayRows.length === 0 ? (
                <p className="text-sm text-neutral-500">
                  Nenhum exercício configurado para este dia.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="text-left text-neutral-500">
                      <tr className="[&>th]:py-2 [&>th]:font-medium">
                        <th>Exercício</th>
                       
                        <th>Músculo</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {todayRows.map((ex, i) => (
                        <tr key={`${ex.name}-${i}`} className="[&>td]:py-2">
                          <td className="font-medium">{ex.name}</td>
                          
                          <td>{ex.muscleGroup ? ex.muscleGroup : "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="rounded-2xl border p-5">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold">Últimas sessões</h3>
              </div>
              {loadingSessions ? (
                <p className="text-sm text-neutral-500">Carregando…</p>
              ) : recentSessions.length === 0 ? (
                <p className="text-sm text-neutral-500">
                  Você ainda não registrou sessões.
                </p>
              ) : (
                <ul className="divide-y">
                  {recentSessions.map((s) => (
                    <li key={s.id} className="py-3">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="font-medium">{s.title ?? "Sessão"}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-neutral-600">
                            {new Date(s.performedAt).toLocaleDateString(
                              "pt-BR",
                              {
                                timeZone: "America/Bahia",
                              }
                            )}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Coluna direita (1/3) */}
          <div className="space-y-6">
            {/* Exercícios em destaque */}
            <ExerciseCatalog
              catalog={catalog}
              selectedIds={[]}
              showAdd={false} 
            />
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
            {catalog.length === 0 && !loading && (
              <p className="text-sm text-neutral-500">
                Você ainda não criou exercícios.
              </p>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
