// src/components/training/SessionExerciseCard.tsx
import SetTable, { type SetRow } from "./SetTable";

type Option = { value: string; label: string };

export default function SessionExerciseCard({
  exerciseId,
  name,
  sets,
  weightOptions,
  onAddSet,
  onChangeSet,
  onRemoveSet,
  unitDisabled = false,
}: {
  exerciseId: number;
  name: string;
  sets: SetRow[];
  weightOptions: Option[]; 
  onAddSet: (exerciseId: number) => void;
  onChangeSet: (exerciseId: number, tempId: string, patch: Partial<Omit<SetRow, "tempId">>) => void;
  onRemoveSet: (exerciseId: number, tempId: string) => void;
  unitDisabled?: boolean;
}) {
  return (
    <li className="rounded-lg border p-3">
      <div className="mb-2 flex items-center justify-between">
        <div className="font-medium">{name}</div>
        <button
          className="rounded-md border px-2 py-1 text-xs hover:bg-neutral-50"
          onClick={() => onAddSet(exerciseId)}
        >
          + Adicionar set
        </button>
      </div>

      <SetTable
        rows={sets}
        weightOptions={weightOptions}
        unitDisabled={unitDisabled}
        onChangeRow={(tempId, patch) => onChangeSet(exerciseId, tempId, patch)}
        onRemoveRow={(tempId) => onRemoveSet(exerciseId, tempId)}
      />
    </li>
  );
}
