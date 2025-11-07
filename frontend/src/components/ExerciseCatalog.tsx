import { useMemo, useState } from "react";
import SelectBase from "./SelectBase";
import Input from "./Input";
import { muscleGroupOptions } from "../constants/options";
//tipo mais simples pra essa página
export type Exercise = { id: string; name: string; muscleGroup: string };

export default function ExerciseCatalog({
  catalog,
  onAdd,
  selectedIds = [],
  showAdd = true,
}: {
  catalog: Exercise[];
  onAdd?: (ex: Exercise) => void;
  selectedIds?: string[];
  showAdd?: boolean;

}) {
  const [query, setQuery] = useState("");
  const [muscle, setMuscle] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return catalog.filter((e) => {
      const okQ = q === "" || e.name.toLowerCase().includes(q);
      const okG = muscle === "" || e.muscleGroup === muscle;
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
                <p className="text-xs text-neutral-500">{ex.muscleGroup}</p>
              </div>
              {showAdd && onAdd && (
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
              )}
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
