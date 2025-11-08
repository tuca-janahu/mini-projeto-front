/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import Input from "./Input";
import Label from "./Label";
import SelectBase, { type Option } from "./SelectBase";
import { updateExercise, deleteExercise } from "../lib/api";
import { weightUnitOptions, muscleGroupOptions } from "../constants/options";
import { toast } from "react-toastify";
import type { Exercise, ExerciseUpdate , WeightUnit } from "../types/exercise";

// 1) Torne o prop nullable
type Props = {
  open: boolean;
  exercise: Exercise | null;
  onClose: () => void;
  onSaved: (updated: Exercise) => void;
  onDeleted: (id: string) => void;
};

export default function EditExerciseModal({
  open,
  exercise,
  onClose,
  onSaved,
  onDeleted,
}: Props) {
  // 2) Inicialize estados com fallback seguro (lazy initializer)
  const [name, setName] = useState<string>(() => exercise?.name ?? "");
  const [muscleGroup, setMuscleGroup] = useState<string>(() => exercise?.muscleGroup ?? "");
  const [weightUnit, setWeightUnit] = useState<WeightUnit>(() => (exercise?.weightUnit ?? "kg") as WeightUnit);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // 3) Sincronize quando exercise mudar (abrir modal / trocar item)
  useEffect(() => {
    if (!exercise) return;
    setName(exercise.name ?? "");
    setMuscleGroup(exercise.muscleGroup ?? "");
    setWeightUnit((exercise.weightUnit ?? "kg") as WeightUnit);
  }, [exercise]);

  // 4) Não renderize conteúdo enquanto não estiver aberto OU sem exercise
  if (!open || !exercise) return null;

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    try {
      setSaving(true);
      const patch: ExerciseUpdate = { name, muscleGroup, weightUnit };
      const updated = await updateExercise((exercise as Exercise).id, patch);
      toast.success("Exercício atualizado!");
      onSaved(updated);
      onClose();
    } catch (err: any) {
      toast.error(err?.message ?? "Não foi possível salvar");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!window.confirm("Tem certeza que deseja excluir este exercício? Esta ação não pode ser desfeita.")) return;
    try {
      setDeleting(true);
      await deleteExercise((exercise as Exercise).id);
      toast.success("Exercício excluído.");
      onDeleted((exercise as Exercise).id);
      onClose();
    } catch (err: any) {
      const msg = err?.message ?? "Não foi possível excluir";
      if (err?.status === 409 || /em uso/i.test(msg)) {
        toast.error("Este exercício está em uso em um dia/sessão e não pode ser excluído.");
      } else {
        toast.error(msg);
      }
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-xl bg-white p-5 shadow-lg">
        <h3 className="mb-3 text-lg font-semibold">Editar exercício</h3>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <Label htmlFor="ex-name">Nome</Label>
            <Input id="ex-name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>

          <div>
            <Label htmlFor="ex-muscle">Grupo muscular</Label>
            <SelectBase
              id="ex-muscle"
              value={muscleGroup}
              onChange={setMuscleGroup}
              options={muscleGroupOptions as Option[]}
              placeholder="Selecione o grupo muscular"
              required
            />
          </div>

          <div>
            <Label htmlFor="ex-unit">Unidade de peso</Label>
            <SelectBase
              id="ex-unit"
              value={weightUnit}
              onChange={(v) => setWeightUnit(v as WeightUnit)}
              options={weightUnitOptions as Option[]}
              placeholder="Selecione a unidade"
              required
            />
          </div>

          <div className="mt-5 flex items-center justify-between">
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting || saving}
              className="rounded-md border border-red-300 px-3 py-2 text-sm text-red-700 hover:bg-red-700 hover:text-white transition-colors disabled:opacity-50 cursor-pointer"
            >
              {deleting ? "Excluindo…" : "Excluir"}
            </button>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                disabled={saving || deleting}
                className="rounded-md border px-3 py-2 text-sm hover:opacity-50 transition-all cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={saving || deleting}
                className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-50 hover:bg-blue-600 transition-colors cursor-pointer"
              >
                {saving ? "Salvando..." : "Salvar"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
