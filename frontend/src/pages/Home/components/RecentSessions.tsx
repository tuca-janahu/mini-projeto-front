/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { listTrainingSessions, getTrainingDayName, type TrainingSessionLite } from "../../../lib/api";

export default function RecentSessions({ limit = 3 }: { limit?: number }) {
  const [items, setItems] = useState<TrainingSessionLite[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const { items } = await listTrainingSessions({ limit, sort: "desc" });
        if (!alive) return;
        const resolved = await Promise.all(
          items.map(async (s) => ({
            ...s,
            title: await getTrainingDayName(String(s.trainingDayId ?? "")),
          }))
        );
        if (!alive) return;
        setItems(resolved);
      } catch (e: any) {
        toast.error(e?.message ?? "Falha ao carregar sessões");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [limit]);

  return (
    <div className="rounded-xl border-2 bg-white border-gray-300 p-5 ">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Últimas sessões</h3>
      </div>

      {loading ? (
        <p className="text-sm text-neutral-500">Carregando…</p>
      ) : items.length === 0 ? (
        <p className="text-sm text-neutral-500">Você ainda não registrou sessões.</p>
      ) : (
        <ul className="divide-y divide-gray-300">
          {items.map((s) => (
            <li key={s.id} className="py-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-medium">{s.title ?? "Sessão"}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-neutral-600">
                    {new Date(s.performedAt).toLocaleDateString("pt-BR", { timeZone: "America/Bahia" })}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
