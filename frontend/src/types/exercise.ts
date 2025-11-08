export type WeightUnit = "kg" | "stack" | "bodyweight";

export type Exercise = {
  id: string;
  name: string;
  muscleGroup: string;      // obrigatório no front (string vazia se vier faltando)
  weightUnit: WeightUnit;   // idem, padronize para "kg" se vier faltando
};

// inputs úteis para API
export type ExerciseCreate = Pick<Exercise, "name" | "muscleGroup" | "weightUnit">;
export type ExerciseUpdate = Partial<Pick<Exercise, "name" | "muscleGroup" | "weightUnit">>;
