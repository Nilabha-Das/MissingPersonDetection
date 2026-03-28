import type {
  InputHTMLAttributes,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";

interface BaseFieldProps {
  label: string;
  id: string;
}

interface InputFieldProps
  extends BaseFieldProps, Omit<InputHTMLAttributes<HTMLInputElement>, "id"> {}
interface SelectFieldProps
  extends BaseFieldProps, Omit<SelectHTMLAttributes<HTMLSelectElement>, "id"> {
  options: Array<{ label: string; value: string }>;
}
interface TextAreaFieldProps
  extends
    BaseFieldProps,
    Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "id"> {}

const baseClassName =
  "mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100";

export function InputField({
  label,
  id,
  className,
  ...props
}: InputFieldProps) {
  return (
    <label htmlFor={id} className="block text-sm font-semibold text-slate-700">
      {label}
      <input
        id={id}
        className={`${baseClassName} ${className ?? ""}`}
        {...props}
      />
    </label>
  );
}

export function SelectField({
  label,
  id,
  options,
  className,
  ...props
}: SelectFieldProps) {
  return (
    <label htmlFor={id} className="block text-sm font-semibold text-slate-700">
      {label}
      <select
        id={id}
        className={`${baseClassName} ${className ?? ""}`}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function TextAreaField({
  label,
  id,
  className,
  ...props
}: TextAreaFieldProps) {
  return (
    <label htmlFor={id} className="block text-sm font-semibold text-slate-700">
      {label}
      <textarea
        id={id}
        className={`${baseClassName} min-h-28 ${className ?? ""}`}
        {...props}
      />
    </label>
  );
}
