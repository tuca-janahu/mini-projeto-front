/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import SelectBase, { type Option } from "../../../components/SelectBase";
import { toast } from "react-toastify";
import {
  listMyTrainingDays,
  getTrainingDayById,
  listExercises,
  type ExerciseDto,
  type TrainingDayLite,
} from "../../../lib/api";

type SimpleRow = { name: string; muscleGroup?: string };

export default function TrainingDayDisplay() {
  const [days, setDays] = useState<TrainingDayLite[]>([]);
  const [selectedDayId, setSelectedDayId] = useState<string>("");

  const [exIndex, setExIndex] = useState<
    Record<string, { name: string; muscleGroup?: string }>
  >({});

  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("Sem dia definido");
  const [rows, setRows] = useState<SimpleRow[]>([]);

  const dayOptions: Option[] = useMemo(
    () => days.map((d) => ({ value: d.id, label: d.label })),
    [days]
  );

  // boot: carrega dias e índice de exercícios
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const [mine, ex] = await Promise.all([
          listMyTrainingDays(),
          listExercises({ limit: 500 }),
        ]);
        if (!alive) return;

        setDays(mine);
        if (mine.length > 0) setSelectedDayId(mine[0].id);

        const idx: Record<string, { name: string; muscleGroup?: string }> = {};
        ex.items.forEach((e: ExerciseDto) => {
          idx[e._id] = { name: e.name, muscleGroup: e.muscleGroup ?? "" };
        });
        setExIndex(idx);
      } catch (e: any) {
        toast.error(e?.message ?? "Falha ao carregar dados iniciais");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  // quando escolher um dia, monta tabela
  useEffect(() => {
    let alive = true;
    if (!selectedDayId) {
      setTitle("Sem dia definido");
      setRows([]);
      return;
    }
    (async () => {
      try {
        setLoading(true);
        const day = await getTrainingDayById(selectedDayId);
        if (!alive) return;

        setTitle(day.label ?? "Dia");
        const mapped: SimpleRow[] = (day.items ?? [])
          .sort((a: any, b: any) => a.order - b.order)
          .map((it: any) => ({
            name: exIndex[it.exerciseId]?.name ?? "Exercício",
            muscleGroup: exIndex[it.exerciseId]?.muscleGroup,
          }));
        setRows(mapped);
      } catch (e: any) {
        toast.error(e?.message ?? "Falha ao carregar o dia");
        setRows([]);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [selectedDayId, exIndex]);

  return (
    <div className={"rounded-xl border-2 border-gray-300 p-5 bg-white"}>
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold">Treino de hoje</h3>
          <p className="text-sm text-neutral-600">{title}</p>
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
          to={selectedDayId ? `/training-sessions?day=${selectedDayId}` : "/training-sessions"}
          className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 transition-colors"
        >
          Iniciar treino
        </Link>
      </div>

      {loading ? (
        <p className="text-sm text-neutral-500">Carregando…</p>
      ) : rows.length === 0 ? (
        <p className="text-sm text-neutral-500">Nenhum exercício configurado para este dia.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-neutral-500">
              <tr className="[&>th]:py-2 [&>th]:font-medium">
                <th>Exercício</th>
                <th>Músculo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-300">
              {rows.map((ex, i) => (
                <tr key={`${ex.name}-${i}`} className="[&>td]:py-2">
                  <td className="font-medium">{ex.name}</td>
                  <td>{ex.muscleGroup || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
