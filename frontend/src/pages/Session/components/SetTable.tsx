import Label from "../../../components/Label";
import Input from "../../../components/Input";
import SelectBase, { type Option } from "../../../components/SelectBase";

export type WeightUnit = "kg" | "stack" | "bodyweight";

export type SetRow = {
  tempId: string;
  reps: number | "";
  load: number | "";
  unit: WeightUnit;
};

type SetTableProps = {
  rows: SetRow[];
  weightOptions: Option[]; // [{value:"kg", label:"kg"}, ...]
  onChangeRow: (tempId: string, patch: Partial<Omit<SetRow, "tempId">>) => void;
  onRemoveRow: (tempId: string) => void;
  unitDisabled?: boolean;
  title?: string; // opcional, ex.: nome do exercício
};

export default function SetTable({
  rows,
  weightOptions,
  onChangeRow,
  onRemoveRow,
  unitDisabled = false,
  title,
}: SetTableProps) {
  return (
    <div className="overflow-x-auto">
      {title && (
        <div className="mb-2">
          <Label>{title}</Label>
        </div>
      )}

      <table className="w-full text-sm">
        {rows.length > 0 && (
          <thead className="text-left text-neutral-500">
            <tr className="[&>th]:py-2 [&>th]:font-medium">
              <th className="w-16">Set</th>
              <th className="w-28">Reps</th>
              <th className="w-32">Carga</th>
              <th className="w-40">Unidade</th>
              <th></th>
            </tr>
          </thead>
        )}

        <tbody className="divide-y">
          {rows.length === 0 ? (
            <tr>
              <td colSpan={5} className="py-2 text-neutral-500">
                Nenhum set adicionado.
              </td>
            </tr>
           ) : (
            rows.map((s, idx) => (
              <tr key={s.tempId} className="[&>td]:py-2">
                <td>#{idx + 1}</td>

              <td>
                <Input
                  type="number"
                  min={0}
                  value={s.reps}
                  onChange={(e) =>
                    onChangeRow(s.tempId, {
                      reps: e.target.value === "" ? "" : Number(e.target.value),
                    })
                  }
                  placeholder="ex.: 10"
                />
              </td>

              <td>
                <Input
                  type="number"
                  min={0}
                  step="0.5"
                  value={s.load}
                  onChange={(e) =>
                    onChangeRow(s.tempId, {
                      load: e.target.value === "" ? "" : Number(e.target.value),
                    })
                  }
                  placeholder="ex.: 40"
                />
              </td>

              <td>
                <SelectBase
                  id={`unit-${s.tempId}`}
                  value={s.unit}
                  onChange={(v) =>
                    onChangeRow(s.tempId, { unit: v as WeightUnit })
                  }
                  options={weightOptions}
                  className="h-9 w-36"
                  disabled={unitDisabled}
                />
              </td>

              <td className="text-right">
                <button
                  onClick={() => onRemoveRow(s.tempId)}
                  className="rounded-md border px-2 py-1 text-xs hover:bg-red-200 cursor-pointer hover:border-red-300"
                >
                  Remover
                </button>
              </td>
            </tr>
          ))
          )}
        </tbody>
      </table>
    </div>
  );
}
