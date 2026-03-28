interface ToastProps {
  message: string;
  tone?: "success" | "error";
}

export default function Toast({ message, tone = "success" }: ToastProps) {
  const toneClasses =
    tone === "success"
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : "border-rose-200 bg-rose-50 text-rose-700";

  return (
    <div
      className={`rounded-xl border px-3 py-2 text-sm font-medium ${toneClasses}`}
      role="status"
      aria-live="polite"
    >
      {message}
    </div>
  );
}
