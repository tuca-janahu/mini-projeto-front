import { useMemo, useState } from "react";
import SelectBase, { type Option } from "../../../components/SelectBase";
import Input from "../../../components/Input";

export type Exercise = { id: number; name: string; muscle: string };

const muscleGroupOptions: Option[] = [
  { value: "", label: "Todos os grupos" },
  { value: "peito", label: "Peito" },
  { value: "costas", label: "Costas" },
  { value: "ombros", label: "Ombros" },
  { value: "biceps", label: "Bíceps" },
  { value: "triceps", label: "Tríceps" },
  { value: "pernas", label: "Pernas" },
  { value: "gluteos", label: "Glúteos" },
  { value: "core", label: "Core" },
];

export default function ExerciseCatalog({
  catalog,
  onAdd,
  selectedIds = [],
}: {
  catalog: Exercise[];
  onAdd: (ex: Exercise) => void;
  selectedIds?: number[];
}) {
  const [query, setQuery] = useState("");
  const [muscle, setMuscle] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return catalog.filter((e) => {
      const okQ = q === "" || e.name.toLowerCase().includes(q);
      const okG = muscle === "" || e.muscle === muscle;
      return okQ && okG;
    });
  }, [catalog, query, muscle]);

  return (
    <section className="rounded-xl border-2 bg-white border-gray-300 p-4">
      <h2 className="text-lg font-semibold mb-3">Catálogo de exercícios</h2>

      <div className="mb-3 flex gap-2">
        <Input
          type="search"
          placeholder="Buscar por nome…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1"
        />
        
        <SelectBase
          id="muscle-filter"
          value={muscle}
          onChange={setMuscle}
          options={muscleGroupOptions}
          placeholder="Selecione o grupo muscular"
          className={`flex-1 ${muscle === "" ? "text-gray-400" : "text-gray-900"}`}
        />
      </div>

      <ul className="divide-gray-300 divide-y">
        {filtered.map((ex) => {
          const already = selectedIds.includes(ex.id);
          return (
            <li key={ex.id} className="py-3 flex items-center justify-between">
              <div>
                <p className="font-medium">{ex.name}</p>
                <p className="text-xs text-neutral-500">{ex.muscle}</p>
              </div>
              <button
                onClick={() => onAdd(ex)}
                disabled={already}
                className={` rounded-md border px-3 py-1.5 text-sm ${
                  already
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-black hover:text-white  cursor-pointer"
                }`}
              >
                {already ? "Adicionado" : "Adicionar"}
              </button>
            </li>
          );
        })}
        {filtered.length === 0 && (
          <li className="py-6 text-sm text-neutral-500 text-center">
            Nada encontrado.
          </li>
        )}
      </ul>
    </section>
  );
}
