"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import type { AlertRecord } from "@/types";

interface AlertCardProps {
  alert?: AlertRecord;
  match?: {
    missing_id: string;
    found_id: string;
    missing_name?: string;
    missing_age?: number;
    missing_gender?: string;
    missing_image_path?: string;
    found_image_path?: string;
    found_location?: string;
    similarity: number;
    created_at: string;
  };
}

export default function AlertCard({ alert, match }: AlertCardProps) {
  const router = useRouter();
  const [imageError, setImageError] = useState({ missing: false, found: false });

  // Legacy alert support
  if (alert) {
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

  if (!match) return null;

  const handleViewDetails = () => {
    router.push(`/matches/${match.missing_id}`);
  };

  const similarityPercent = Math.round((match.similarity || 0) * 100);

  const getConfidenceLevel = (percent: number) => {
    if (percent >= 80) return "High Match";
    if (percent >= 70) return "Possible Match";
    return "Low Confidence";
  };

  const getConfidenceBadgeColor = (percent: number) => {
    if (percent >= 80)
      return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300";
    if (percent >= 70)
      return "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300";
    return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300";
  };

  const getCircleColor = (percent: number) => {
    if (percent >= 80) return "text-emerald-500";
    if (percent >= 70) return "text-cyan-500";
    return "text-amber-500";
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md dark:border-slate-700 dark:bg-slate-900">
      {/* Header with Badge */}
      <div className="mb-4 flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
            MISSING
          </p>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            {match.missing_name || "Unknown Person"}
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            {match.missing_age && `Age ${match.missing_age}`}
            {match.missing_age && match.missing_gender && " • "}
            {match.missing_gender}
          </p>
        </div>
        <span
          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getConfidenceBadgeColor(
            similarityPercent
          )}`}
        >
          {getConfidenceLevel(similarityPercent)}
        </span>
      </div>

      {/* Images and Percentage */}
      <div className="mb-4 flex items-center justify-between gap-3">
        {/* Missing Image */}
        <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-800">
          {!imageError.missing && match.missing_image_path ? (
            <Image
              src={match.missing_image_path}
              alt={match.missing_name || "Missing person"}
              fill
              className="object-cover"
              onError={() => setImageError({ ...imageError, missing: true })}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-slate-400">
              <svg
                className="h-8 w-8"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </div>
          )}
        </div>

        {/* Match Percentage Circle */}
        <div className="flex flex-col items-center">
          <div className="relative flex h-20 w-20 items-center justify-center">
            <svg className="absolute h-full w-full" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-slate-200 dark:text-slate-700"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className={getCircleColor(similarityPercent)}
                strokeDasharray={`${(similarityPercent / 100) * 282.74} 282.74`}
                strokeLinecap="round"
                style={{ transform: "rotate(-90deg)", transformOrigin: "50% 50%" }}
              />
            </svg>
            <div className="text-center">
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {similarityPercent}%
              </p>
            </div>
          </div>
        </div>

        {/* Found Image */}
        <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-800">
          {!imageError.found && match.found_image_path ? (
            <Image
              src={match.found_image_path}
              alt="Found person"
              fill
              className="object-cover"
              onError={() => setImageError({ ...imageError, found: true })}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-slate-400">
              <svg
                className="h-8 w-8"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </div>
          )}
        </div>
      </div>

      {/* Details */}
      <div className="mb-4 space-y-1 text-sm">
        <p className="text-slate-600 dark:text-slate-400">
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            Found:
          </span>{" "}
          {match.found_location || "Location not specified"}
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-500">
          {new Date(match.created_at).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </p>
      </div>

      {/* View Details Button */}
      <button
        onClick={handleViewDetails}
        className="w-full rounded-lg bg-slate-50 px-3 py-2 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
      >
        View details →
      </button>
    </div>
  );
}
