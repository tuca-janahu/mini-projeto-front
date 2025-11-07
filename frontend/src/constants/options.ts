import type { Option } from "../components/SelectBase";

export const muscleGroupOptions: Option[] = [
  { value: "peito", label: "Peito" },
  { value: "costas", label: "Costas" },
  { value: "bíceps", label: "Bíceps" },
  { value: "tríceps", label: "Tríceps" },
  { value: "ombros", label: "Ombros" },
  { value: "quadríceps", label: "Quadríceps" },
  { value: "posteriores", label: "Posteriores" },
  { value: "glúteos", label: "Glúteos" },
  { value: "panturrilhas", label: "Panturrilhas" },
  { value: "core", label: "Core" },
  { value: "trapézio", label: "Trapézio" },
  { value: "antebraço", label: "Antebraço" },
];

// (value = canônico p/ backend; label = texto na UI)
export const weightUnitOptions: Option[] = [
  { value: "kg", label: "Kg" },
  { value: "stack", label: "Placa" },
  { value: "bodyweight", label: "Peso corporal" },
];