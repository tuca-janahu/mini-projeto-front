import Input from "../../components/Input";
import Label from "../../components/Label";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import SelectBase from "../../components/SelectBase";
import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { createExercise, listExercises } from "../../lib/api";
import ExerciseCatalog from "../../components/ExerciseCatalog";
import { muscleGroupOptions, weightUnitOptions } from "../../constants/options";
import type { Exercise } from "../../types/exercise";


export default function ExercisePage() {
  // const navigate = useNavigate();

  const [name, setName] = useState("");
  const [unit, setUnit] = useState("");     // "kg" | "stack" | "bodyweight"
  const [muscle, setMuscle] = useState(""); // ex.: "peito"
  const [loading, setLoading] = useState(false);
  const [catalog, setCatalog] = useState<Exercise[]>([]);

  const canSubmit = name.trim() !== "" && unit !== "" && muscle !== "" && !loading;

  useEffect(() => {
      let alive = true;
      (async () => {
        try {
          setLoading(true);
          const res = await listExercises({ limit: 50 });
          if (!alive) return; 
  
          setCatalog(res.items);
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
    
  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;

    try {
      setLoading(true);
      await createExercise({
        name: name.trim(),
        muscleGroup: muscle,
        weightUnit: unit as "kg" | "stack" | "bodyweight",
      });
      toast.success("Exercício criado com sucesso!");
      // navigate("/training-days"); 
    } catch (err: Error | unknown) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Falha ao criar exercício");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
        <Header />
        <div className="mx-auto max-w-6xl grid gap-6 lg:grid-cols-2 mt-10 px-4 sm:px-6 lg:px-8">
      <section className="rounded-xl border-2 bg-white border-gray-300 p-4 min-w-0 md:mx-10 max-h-[80vh] ">
        <h1 className="text-3xl font-bold pt-8 text-center">Novo Exercício</h1>
        <h2 className="text-xl font-semibold py-4 text-center">
          Insira os dados do exercício abaixo
        </h2>
          
          <form className="my-6 mx-10 " onSubmit={onSubmit}>
          <div>
            <Label htmlFor="exercise-name">Nome do Exercício</Label>
            <Input type="exercise-name" id="exercise-name" value={name}
              onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="mt-4">
            <Label htmlFor="muscle-group">Grupo Muscular</Label>
            <SelectBase
              id="muscle-group"
              value={muscle}
              onChange={setMuscle}
              options={muscleGroupOptions}
              placeholder="Selecione o grupo muscular"
              className={`text-gray-300 ${muscle === "" ? "text-gray-400" : "text-gray-900"}`}
              required
            />
          </div>
          <div className="mt-4">
            <Label htmlFor="weight-unit">Unidade de Peso</Label>
            <SelectBase
              id="weight-unit"
              value={unit}
              onChange={setUnit}
              options={weightUnitOptions}
              placeholder="Selecione a unidade"
              className={`text-gray-300 ${unit === "" ? "text-gray-400" : "text-gray-900"}`}
              required
            />
          </div>
          
          <div className="pt-8 flex justify-end">
            <button
              type="submit"
              disabled={!canSubmit}
              className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 transition-colors cursor-pointer"
            >
                {loading ? "Salvando..." : "Salvar Exercício"}
            </button>
          </div>
        </form>
          
          
      </section>
      <section className="w-full my-6 md:mt-0  min-w-0">
        <div className="w-full overflow-x-auto">
          <ExerciseCatalog
              catalog={catalog}
              onAdd={() => {}}
              selectedIds={[]}
              showAdd={false}
            ></ExerciseCatalog>
            </div>
          </section>
          </div>
        <Footer />
    </main>
  );
}
