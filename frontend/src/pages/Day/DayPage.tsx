import { useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Input from "../../components/Input";
import ExerciseCatalog, { type Exercise } from "./components/ExerciseCatalog";
import Label from "../../components/Label";


const CATALOG: Exercise[] = [
  { id: 1, name: "Supino reto", muscle: "peito" },
  { id: 2, name: "Agachamento livre", muscle: "pernas" },
  { id: 3, name: "Remada curvada", muscle: "costas" },
  { id: 4, name: "Desenvolvimento", muscle: "ombros" },
  { id: 5, name: "Puxada na frente", muscle: "costas" },
];

type DayItem = {
  tempId: string; // id local para mover/remover
  exerciseId: number;
  name: string; // só para render
  muscle: string; // só para render
};

export default function DayPage() {
  const [name, setName] = useState<string>("Full Body");
  const [notes, setNotes] = useState("");
  const [items, setItems] = useState<DayItem[]>([]);


  /* Handlers básicos */
  function addExercise(ex: Exercise) {
    setItems((arr) => [
      ...arr,
      {
        tempId: crypto.randomUUID(),
        exerciseId: ex.id,
        name: ex.name,
        muscle: ex.muscle,
      },
    ]);
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

  function buildPayload() {
    return {
      name,
      notes,
      items: items.map((it, order) => ({
        exerciseId: it.exerciseId,
        order, // ordem definida pelo usuário
      })),
    };
  }

  async function handleSave() {
    const payload = buildPayload();
    console.log("payload pronto para POST /training-days:", payload);

    // Depois:
    // await api.post("/training-days", payload);
    // navigate("/training-days");
  }

  return (
    <main>
      <Header />
      <div className="mx-auto max-w-6xl p-4">
        <h1 className="text-2xl font-semibold my-6">Novo Dia de Treino</h1>

        {/* Cabeçalho: nome e notas */}
        <div className="grid gap-3 sm:grid-cols-3 mb-6">
          <div className="space-y-1 sm:col-span-1">
            <Label htmlFor="day-name">
              Nome do dia
            </Label>
            <Input
              id="day-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="ex.: Full Body A"
            />
              
          </div>
          <div className="space-y-1 sm:col-span-2">
            <Label htmlFor="notes">
              Notas
            </Label>
            <Input
              id="notes"
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Observações gerais (aquecimento, técnica, etc.)"
            />
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2 min-h-110">
          {/* Catálogo */}
          <ExerciseCatalog  
            catalog={CATALOG}
            onAdd={addExercise}
            selectedIds={items.map((it) => it.exerciseId)}
          >
          </ExerciseCatalog>
         

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
                      <p className="text-xs text-neutral-500">{it.muscle}</p>
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
