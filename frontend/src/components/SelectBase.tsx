import type { SelectHTMLAttributes } from "react";
import { cn } from "../lib/utils";

export type Option = { value: string | number; label: string };

type Props = Omit<SelectHTMLAttributes<HTMLSelectElement>, "onChange" | "children"> & {
  id: string;
  value: string | number;
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
  const sane = options.filter(
    (o): o is Option => !!o && typeof o.value === "string" && typeof o.label === "string"
  );

  return (
    <div className="space-y-2">
     
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(`border border-gray-300 p-2 w-full bg-white rounded mb-4 outline-none ${className ?? ""}`)}
        {...rest}
      >
        {placeholder && (
        <option key="__ph__" value="" disabled hidden>
          {placeholder}
        </option>
      )}

        {sane.map((o, idx) => (
        <option key={`${o.value}-${idx}`} value={o.value}>
          {o.label}
        </option>
      ))}
      </select>
    </div>
  );
}
