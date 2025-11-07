import type { SelectHTMLAttributes } from "react";
import { cn } from "../lib/utils";

export type Option = { value: string; label: string };

type Props = Omit<SelectHTMLAttributes<HTMLSelectElement>, "onChange" | "children"> & {
  id: string;
  value: string;
  onChange: (v: string) => void;
  options: Option[];
  placeholder?: string;
};

export default function SelectBase({
  id,
  value,
  onChange,
  options,
  placeholder,
  className,
  ...rest
}: Props) {
  return (
    <div className="space-y-2">
     
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(`border border-gray-300 p-2 w-full rounded mb-4 outline-none ${className ?? ""}`)}
        {...rest}
      >
        {value === "" && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}

        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}
