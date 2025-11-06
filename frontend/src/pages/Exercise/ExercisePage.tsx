import Input from "../../components/Input";
import Label from "../../components/Label";
import SelectBase, { type Option } from "../../components/SelectBase";
import { useState } from "react";

// listas de opções (value = canônico p/ backend; label = texto na UI)
const weightUnitOptions: Option[] = [
  { value: "kg", label: "kg" },
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
  const [unit, setUnit] = useState(""); // começa vazio para mostrar placeholder
  const [muscle, setMuscle] = useState("peito"); // começa com valor padrão

  return (
    <main>
      <section className="rounded-2xl w-full max-w-2xl bg-white p-12 shadow-md m-auto mt-20">
        <h1 className="text-3xl font-bold pt-8 text-center">Novo Exercício</h1>
        <h2 className="text-xl font-semibold py-4 text-center">
          Insira os dados do exercício abaixo
        </h2>
        <form className="my-6 max-w-lg m-auto">
          <div>
            <Label htmlFor="exercise-name">Nome do Exercício</Label>
            <Input type="exercise-name" id="exercise-name" required />
          </div>
          <div className="mt-4">
            <Label htmlFor="weight-unit">Unidade de Peso</Label>
            <SelectBase
              id="weight-unit"
              value={unit}
              onChange={setUnit}
              options={weightUnitOptions}
              placeholder="Selecione a unidade"
              required
            />
          </div>
          <div className="mt-4">
            <Label htmlFor="muscle-group">Grupo Muscular</Label>
            <SelectBase
              id="muscle-group"
              value={muscle}
              onChange={setMuscle}
              options={muscleGroupOptions}
              placeholder="Selecione o grupo muscular"
              required
            />
          </div>
          <div className="py-8">
            <button
              type="submit"
              onClick={() => (window.location.href = "/home")}
              className="mt-6 w-full bg-blue-600 text-white p-2 rounded cursor-pointer"
            >
              Entrar
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
