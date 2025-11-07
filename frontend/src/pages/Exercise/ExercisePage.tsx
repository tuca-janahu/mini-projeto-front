import Input from "../../components/Input";
import Label from "../../components/Label";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import SelectBase, { type Option } from "../../components/SelectBase";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { createExercise } from "../../lib/api";

// (value = canônico p/ backend; label = texto na UI)
const weightUnitOptions: Option[] = [
  { value: "kg", label: "Kg" },
  { value: "stack", label: "Placa" },
  { value: "bodyweight", label: "Peso corporal" },
];

const muscleGroupOptions: Option[] = [
  { value: "peito", label: "Peito" },
  { value: "costas", label: "Costas" },
  { value: "ombros", label: "Ombros" },
  { value: "biceps", label: "Bíceps" },
  { value: "triceps", label: "Tríceps" },
  { value: "pernas", label: "Pernas" },
  { value: "gluteos", label: "Glúteos" },
  { value: "core", label: "Core" },
];

export default function ExercisePage() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [unit, setUnit] = useState("");     // "kg" | "stack" | "bodyweight"
  const [muscle, setMuscle] = useState(""); // ex.: "peito"
  const [loading, setLoading] = useState(false);

  const canSubmit = name.trim() !== "" && unit !== "" && muscle !== "" && !loading;

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
      navigate("/training-days"); 
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
      <section className="rounded-2xl w-full max-w-2xl bg-white p-12 shadow-md m-auto mt-20">
        <h1 className="text-3xl font-bold pt-8 text-center">Novo Exercício</h1>
        <h2 className="text-xl font-semibold py-4 text-center">
          Insira os dados do exercício abaixo
        </h2>
        <form className="my-6 max-w-lg m-auto" onSubmit={onSubmit}>
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
          
          <div className="py-8">
            <button
              type="submit"
              disabled={!canSubmit}
              className="mt-6 w-full bg-blue-600 text-white p-2 rounded cursor-pointer"
            >
                {loading ? "Salvando..." : "Salvar Exercício"}
            </button>
          </div>
        </form>
      </section>
        <Footer />
    </main>
  );
}
