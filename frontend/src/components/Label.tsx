import type { LabelHTMLAttributes } from "react";

export default function Label({ children, ...props }: LabelHTMLAttributes<HTMLLabelElement> & {children: React.ReactNode}) {
    return (
        <label className="block text-sm font-medium text-gray-700" {...props} >
            {children}
        </label>
    );
}