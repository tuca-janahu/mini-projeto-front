import type { InputHTMLAttributes, AriaAttributes } from "react";
import { cn } from "../lib/utils";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  className?: string;
  "aria-invalid"?: AriaAttributes["aria-invalid"];
};

function Input({ className, ...props }: Props) {
  const ariaInvalid = props["aria-invalid"];
  const isInvalid =
    ariaInvalid === true ||
    ariaInvalid === "true" ||
    ariaInvalid === "grammar" ||
    ariaInvalid === "spelling";

  return (
    <input
      className={cn(
        "border p-2 w-full placeholder:text-gray-300 rounded mb-4 outline-none",
        isInvalid
          ? "border-red-600 focus:border-red-600 focus:ring-4 focus:ring-red-200 text-red-900 placeholder:text-red-300"
          : "border-gray-300",
        className
      )}
      data-invalid={isInvalid ? true : undefined}
      {...props}
    />
  );
}

export default Input;
