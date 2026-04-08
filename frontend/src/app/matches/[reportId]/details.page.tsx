"use client";

import { useState } from "react";
import Image from "next/image";

interface MatchDetails {
  missing_id: string;
  found_id: string;
  similarity: number;
  finder_name: string;
  finder_phone: string;
  found_location: string;
  found_image_path: string;
  scoring?: {
    face_score: number;
    metadata_score: number;
  };
  created_at: string;
  missing_image_path: string;
}

interface Props {
  match: MatchDetails;
  missingName: string;
}

export default function MatchDetailsCard({ match, missingName }: Props) {
  const [isContactRevealed, setIsContactRevealed] = useState(false);

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

  return (
    <div className="w-full bg-white rounded-xl border border-slate-200 shadow-lg p-6 dark:bg-slate-900 dark:border-slate-700">
      {/* Match Header with Images and Percentage */}
      <div className="mb-8 flex items-center justify-between gap-4">
        {/* Missing Person Image */}
        <div className="flex flex-col items-center gap-2">
          <div className="relative w-32 h-32 rounded-lg bg-slate-100 dark:bg-slate-800 overflow-hidden">
            {match.missing_image_path ? (
              <Image
                src={match.missing_image_path}
                alt="Missing person"
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-400">
                <svg
                  className="w-16 h-16"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              </div>
            )}
          </div>
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            Missing
          </p>
        </div>

        {/* Match Percentage Circle */}
        <div className="flex flex-col items-center gap-2">
          <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center border-4 border-orange-300 dark:border-orange-700">
            <div className="text-center">
              <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                {overallSimilarity}%
              </p>
              <p className="text-xs font-medium text-orange-600 dark:text-orange-400">
                match
              </p>
            </div>
          </div>
          <p className="text-xs font-medium text-slate-600 dark:text-slate-400">
            {getConfidenceLabel(overallSimilarity)}
          </p>
        </div>

        {/* Found Person Image */}
        <div className="flex flex-col items-center gap-2">
          <div className="relative w-32 h-32 rounded-lg bg-slate-100 dark:bg-slate-800 overflow-hidden">
            {match.found_image_path ? (
              <Image
                src={match.found_image_path}
                alt="Found person"
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-400">
                <svg
                  className="w-16 h-16"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              </div>
            )}
          </div>
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            Found
          </p>
        </div>
      </div>

      {/* Match Analysis Section */}
      <div className="mb-8 border-t border-b border-slate-200 dark:border-slate-700 py-6">
        <h3 className="text-lg font-bold text-slate-900 mb-4 dark:text-slate-100 flex items-center gap-2">
          <svg
            className="w-5 h-5 text-slate-600"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M3 13h2v8H3zm4-8h2v16H7zm4-2h2v18h-2zm4 4h2v14h-2zm4-2h2v16h-2z" />
          </svg>
          Match analysis
        </h3>

        {/* Overall Similarity Score */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Overall similarity
            </p>
            <span className="text-sm font-bold text-orange-600 dark:text-orange-400">
              {overallSimilarity}%
            </span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2 dark:bg-slate-700 overflow-hidden">
            <div
              className={`h-full ${getScoreColor(overallSimilarity)} transition-all`}
              style={{ width: `${overallSimilarity}%` }}
            />
          </div>
        </div>

        {/* Face Recognition Score */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Face recognition score
            </p>
            <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
              {faceScore}%
            </span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2 dark:bg-slate-700 overflow-hidden">
            <div
              className="h-full bg-emerald-500 transition-all"
              style={{ width: `${faceScore}%` }}
            />
          </div>
        </div>

        {/* Metadata Match Score */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Metadata match score
            </p>
            <span className="text-sm font-bold text-cyan-600 dark:text-cyan-400">
              {metadataScore}%
            </span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2 dark:bg-slate-700 overflow-hidden">
            <div
              className="h-full bg-cyan-500 transition-all"
              style={{ width: `${metadataScore}%` }}
            />
          </div>
        </div>
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
          className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg font-semibold text-slate-700 dark:text-slate-300 transition text-sm"
        >
          Reveal admin contact
        </button>
      ) : (
        <div className="w-full py-2.5 px-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-800/50">
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Contact Information
          </p>
          <p className="text-sm text-emerald-700 dark:text-emerald-300">
            {match.finder_phone || "No phone number available"}
          </p>
        </div>
      )}
    </div>
  );
}
