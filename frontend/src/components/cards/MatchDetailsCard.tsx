"use client";

import { useState } from "react";

interface MatchDetails {
  _id?: string;
  missing_id: string;
  found_id: string;
  similarity: number;
  finder_name: string;
  finder_phone: string;
  found_location: string;
  found_image_path: string;
  scoring?: {
    face_score?: number;
    metadata_score?: number;
  };
  created_at: string;
  missing_image_path?: string;
  missing_name?: string;
}

const buildImageUrl = (path?: string | null) => {
  if (!path) return undefined;

  const trimmed = path.trim();
  if (trimmed === "") return undefined;
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8000";
  let normalizedPath = trimmed.replace(/\\/g, "/");

  // If an absolute Windows path is stored, convert it to a usable uploads route.
  const uploadsIndex = normalizedPath.toLowerCase().indexOf("uploads/");
  if (uploadsIndex !== -1) {
    normalizedPath = normalizedPath.slice(uploadsIndex);
  }

  if (!normalizedPath.startsWith("/")) {
    normalizedPath = `/${normalizedPath}`;
  }

  const encodedPath = encodeURI(normalizedPath);
  return `${apiBaseUrl}${encodedPath}`;
};

interface Props {
  match: MatchDetails;
  missingName?: string;
}

export default function MatchDetailsCard({
  match,
}: Props) {
  const [isContactRevealed, setIsContactRevealed] = useState(false);
  const [imageError, setImageError] = useState({ missing: false, found: false });

  const overallSimilarity = Math.round((match.similarity || 0) * 100);
  const faceScore = Math.round((match.scoring?.face_score || 0) * 100);
  const metadataScore = Math.round((match.scoring?.metadata_score || 0) * 100);

  const getScoreColor = (score: number) => {
    if (score >= 80) return "bg-emerald-500";
    if (score >= 70) return "bg-cyan-500";
    return "bg-amber-500";
  };

  const getConfidenceLabel = (score: number) => {
    if (score >= 80) return "High confidence";
    if (score >= 70) return "Medium confidence";
    return "Low confidence";
  };

  const matchedDate = new Date(match.created_at);

  const missingImageSrc = buildImageUrl(match.missing_image_path);
  const foundImageSrc = buildImageUrl(match.found_image_path);

  return (
    <div className="w-full rounded-xl border border-slate-200 bg-white p-6 shadow-lg dark:border-slate-700 dark:bg-slate-900">
      {/* Latest match badge */}
      <div className="mb-6 flex items-center gap-2">
        <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
        <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
          Latest match
        </span>
      </div>

      {/* Match Header with Images and Percentage */}
      <div className="mb-8 flex items-center justify-between gap-4">
        {/* Missing Person Image */}
        <div className="flex flex-col items-center gap-2">
          <div className="relative h-32 w-32 overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-800 flex-shrink-0">
            {!imageError.missing && missingImageSrc ? (
              <img
                src={missingImageSrc}
                alt="Missing person"
                className="h-full w-full object-cover"
                onError={() => setImageError({ ...imageError, missing: true })}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-slate-400">
                <svg
                  className="h-16 w-16"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              </div>
            )}
          </div>
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            Your photo
          </p>
          <p className="text-xs text-slate-600 dark:text-slate-400">Missing</p>
        </div>

        {/* Match Percentage Circle */}
        <div className="flex flex-col items-center gap-2">
          <div className="relative flex h-28 w-28 items-center justify-center">
            <svg
              className="absolute h-full w-full"
              viewBox="0 0 100 100"
              style={{ transform: "rotate(-90deg)" }}
            >
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                className="text-slate-200 dark:text-slate-700"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                className={getScoreColor(overallSimilarity)}
                strokeDasharray={`${(overallSimilarity / 100) * 251.33} 251.33`}
                strokeLinecap="round"
              />
            </svg>
            <div className="text-center">
              <p className="text-4xl font-bold text-slate-900 dark:text-slate-100">
                {overallSimilarity}%
              </p>
              <p className="text-xs font-medium text-slate-600 dark:text-slate-400">
                match
              </p>
            </div>
          </div>
          <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 text-center">
            {getConfidenceLabel(overallSimilarity)}
          </p>
        </div>

        {/* Found Person Image */}
        <div className="flex flex-col items-center gap-2">
          <div className="relative h-32 w-32 overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-800 flex-shrink-0">
            {!imageError.found && foundImageSrc ? (
              <img
                src={foundImageSrc}
                alt="Found person"
                className="h-full w-full object-cover"
                onError={() => setImageError({ ...imageError, found: true })}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-slate-400">
                <svg
                  className="h-16 w-16"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              </div>
            )}
          </div>
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            Camera capture
          </p>
          <p className="text-xs text-slate-600 dark:text-slate-400">Found</p>
        </div>
      </div>

      {/* Match Analysis Section */}
      <div className="mb-8 space-y-6 border-t border-b border-slate-200 py-6 dark:border-slate-700">
        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <svg
            className="h-5 w-5 text-slate-600 dark:text-slate-400"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M3 13h2v8H3zm4-8h2v16H7zm4-2h2v18h-2zm4 4h2v14h-2zm4-2h2v16h-2z" />
          </svg>
          Match analysis
        </h3>

        {/* Overall Similarity Score */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Overall similarity
            </p>
            <span className="text-sm font-bold text-orange-600 dark:text-orange-400">
              {overallSimilarity}%
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
            <div
              className="h-full bg-orange-500 transition-all duration-500"
              style={{ width: `${overallSimilarity}%` }}
            />
          </div>
        </div>

        {/* Face Recognition Score */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Face recognition score
            </p>
            <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
              {faceScore}%
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
            <div
              className="h-full bg-emerald-500 transition-all duration-500"
              style={{ width: `${faceScore}%` }}
            />
          </div>
        </div>

        {/* Metadata Match Score */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Metadata match score
            </p>
            <span className="text-sm font-bold text-cyan-600 dark:text-cyan-400">
              {metadataScore}%
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
            <div
              className="h-full bg-cyan-500 transition-all duration-500"
              style={{ width: `${metadataScore}%` }}
            />
          </div>
        </div>

        {/* View detailed scoring button */}
        <button className="flex items-center gap-1 text-sm font-semibold text-slate-700 transition hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100">
          <span>› View detailed scoring breakdown</span>
        </button>
      </div>

      {/* Details */}
      <div className="mb-6 space-y-2 text-sm">
        <p className="text-slate-600 dark:text-slate-400">
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            Reported by:
          </span>{" "}
          {match.finder_name}
        </p>
        <p className="text-slate-600 dark:text-slate-400">
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            Location:
          </span>{" "}
          {match.found_location || "Not specified"}
        </p>
        <p className="text-slate-600 dark:text-slate-400">
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            Matched on:
          </span>{" "}
          {matchedDate.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </p>
      </div>

      {/* Reveal Contact Button */}
      {!isContactRevealed ? (
        <button
          onClick={() => setIsContactRevealed(true)}
          className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-center text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          Reveal admin contact
        </button>
      ) : (
        <div className="w-full rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2.5 dark:border-emerald-800/50 dark:bg-emerald-900/20">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-400">
            Contact Information
          </p>
          <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
            {match.finder_phone || "No phone number available"}
          </p>
        </div>
      )}
    </div>
  );
}
