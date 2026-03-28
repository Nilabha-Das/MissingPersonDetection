import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  fullWidth?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-slate-900 text-white hover:bg-slate-800",
  secondary: "bg-cyan-600 text-white hover:bg-cyan-500",
  ghost: "bg-white text-slate-900 border border-slate-300 hover:bg-slate-50",
};

export default function Button({
  variant = "primary",
  fullWidth = false,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${variantClasses[variant]} ${fullWidth ? "w-full" : ""} ${className ?? ""}`}
      {...props}
    />
  );
}
