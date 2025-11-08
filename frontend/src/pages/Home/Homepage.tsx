/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import ExerciseCatalog, { type Exercise } from "../../components/ExerciseCatalog";
import { listExercises, type ExerciseDto } from "../../lib/api";
import { toast } from "react-toastify";

import TrainingDayDisplay from "./components/TrainingDayDisplay";
import RecentSessions from "./components/RecentSessions";

export default function Home() {
  const [catalog, setCatalog] = useState<Exercise[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const today = new Date().toLocaleDateString();
  const quickActions = [
    { label: "Novo exercício", to: "/exercises" },
    { label: "Novo dia de treino", to: "/training-days" },
    { label: "Nova sessão", to: "/training-sessions" },
  ];

  // primeiro carregamento do catálogo
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
      } catch (err: any) {
        toast.error(err?.message ?? "Falha ao carregar exercícios");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
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
    } catch (err: any) {
      toast.error(err?.message ?? "Falha ao carregar mais exercícios");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="w-full max-w-100vw max-h-100vh m-auto">
      <Header />

      <section className="mx-auto max-w-7xl px-4 py-6 mt-8 min-h-[80vh]">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between ">
          <div>
            <p className="text-sm text-neutral-500">Hoje • {today}</p>
            <h2 className="text-2xl font-bold tracking-tight">Bem-vindo de volta! Pronto para treinar?</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {quickActions.map((a) => (
              <Link
                key={a.label}
                to={a.to}
                className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-black hover:text-white transition-colors"
              >
                {a.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Coluna esquerda (2/3) */}
          <div className="lg:col-span-2 space-y-6">
            <TrainingDayDisplay />
            <RecentSessions />
          </div>

          {/* Coluna direita (1/3) */}
          <div className="space-y-6">
            <ExerciseCatalog catalog={catalog} selectedIds={[]} showAdd={false} />
            {loading && <p className="text-sm text-neutral-500 mt-2">Carregando…</p>}
            {nextCursor && !loading && (
              <div className="mt-3">
                <button onClick={loadMore} className="rounded-md border px-3 py-1.5 text-sm hover:bg-neutral-50">
                  Carregar mais
                </button>
              </div>
            )}
            {catalog.length === 0 && !loading && (
              <p className="text-sm text-neutral-500">Você ainda não criou exercícios.</p>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
