"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import MatchDetailsCard from "@/components/cards/MatchDetailsCard";
import Button from "@/components/ui/Button";

interface Match {
  _id: string;
  missing_id: string;
  found_id: string;
  similarity: number;
  finder_name?: string;
  finder_phone?: string;
  found_location?: string;
  found_image_path?: string;
  missing_image_path?: string;
  scoring?: {
    face_score?: number;
    metadata_score?: number;
  };
  created_at: string;
}

interface MatchesResponse {
  report_id: string;
  missing_name: string;
  missing_image_path?: string;
  matches: Match[];
}

export default function MatchesPage() {
  const params = useParams();
  const reportId = params?.reportId as string;
  const { token, isAuthenticated } = useAuth();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [missingName, setMissingName] = useState("Unknown");

  useEffect(() => {
    const fetchMatches = async () => {
      if (!token || !isAuthenticated || !reportId) {
        setLoading(false);
        setError("Not authenticated or invalid report ID");
        return;
      }

      try {
        const apiBaseUrl =
          process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
        const response = await fetch(
          `${apiBaseUrl}/missing/${reportId}/matches`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Report not found");
          }
          throw new Error(`Failed to fetch matches: ${response.status}`);
        }

        const data: MatchesResponse = await response.json();
        setMatches(data.matches || []);
        setMissingName(data.missing_name || "Unknown");
        setError(null);
      } catch (err) {
        console.error("Error fetching matches:", err);
        setError(
          err instanceof Error ? err.message : "An error occurred while fetching matches"
        );
        setMatches([]);
      } finally {
        setLoading(false);
      }
    };

    void fetchMatches();
  }, [token, isAuthenticated, reportId]);

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 px-4 py-8">
        <div className="max-w-6xl mx-auto flex items-center justify-center">
          <div className="text-center">
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              Please log in to view matches.
            </p>
            <Button onClick={() => window.location.href = "/login"}>
              Go to Login
            </Button>
          </div>
        </div>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 px-4 py-8">
        <div className="max-w-6xl mx-auto flex items-center justify-center">
          <div className="text-center">
            <div className="mb-4 inline-flex h-12 w-12 animate-spin rounded-full border-4 border-slate-300 border-t-cyan-500"></div>
            <p className="text-slate-600 dark:text-slate-400">
              Loading match details...
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-slate-900 dark:text-slate-100">
            Matches for {missingName}
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            {matches.length} potential match{matches.length !== 1 ? "es" : ""} found
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900/30 dark:bg-red-900/10">
            <p className="text-sm text-red-700 dark:text-red-300">
              <span className="font-semibold">Error:</span> {error}
            </p>
          </div>
        )}

        {matches.length > 0 ? (
          <div className="grid gap-6">
            {matches.map((match, index) => (
              <MatchDetailsCard
                key={match._id || index}
                match={{
                  _id: match._id,
                  missing_id: match.missing_id,
                  found_id: match.found_id,
                  similarity: match.similarity || 0,
                  finder_name: match.finder_name || "Unknown",
                  finder_phone: match.finder_phone || "",
                  found_location: match.found_location || "Not specified",
                  found_image_path: match.found_image_path || "",
                  missing_image_path: match.missing_image_path || "",
                  scoring: match.scoring,
                  created_at: match.created_at,
                }}
                missingName={missingName}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-slate-200 bg-white p-12 text-center dark:border-slate-700 dark:bg-slate-900">
            <svg
              className="mx-auto mb-4 h-16 w-16 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M20 21l-4.35-4.35m0 0a7 7 0 10-9.9 0l4.35 4.35zm-4.35-4.35L9.172 9.172m0 0a3 3 0 014.243-4.243l4.35 4.35"
              />
            </svg>
            <p className="mb-4 text-lg font-semibold text-slate-700 dark:text-slate-300">
              No matches found yet
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Check back later or submit a new report. The AI will automatically detect matches.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
