import type { AlertRecord } from "@/types";

interface AlertCardProps {
  alert: AlertRecord;
}

export default function AlertCard({ alert }: AlertCardProps) {
  return (
    <article className="flex flex-col gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 shadow-sm sm:flex-row">
      <img
        src={alert.personImage}
        alt="Alert person"
        className="h-24 w-24 rounded-xl object-cover"
      />
      <div className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-amber-700">
          Potential Match
        </p>
        <p className="text-sm font-semibold text-slate-800">
          Confidence:{" "}
          <span className="text-amber-700">{alert.confidence.toFixed(1)}%</span>
        </p>
        <p className="text-sm text-slate-700">Location: {alert.location}</p>
        <p className="text-sm text-slate-700">Contact: {alert.contactInfo}</p>
      </div>
    </article>
  );
}
