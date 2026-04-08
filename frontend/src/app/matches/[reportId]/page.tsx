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

export default function MatchReportPage() {
  const params = useParams();
  const reportId = params?.reportId as string | undefined;
  const { token, isAuthenticated } = useAuth();
  const [matches, setMatches] = useState<Match[]>([]);
  const [missingName, setMissingName] = useState("Unknown");
  const [missingImagePath, setMissingImagePath] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMatches = async () => {
      if (!reportId || !token || !isAuthenticated) {
        setError("Not authenticated or invalid report ID");
        setLoading(false);
        return;
      }

      try {
        const apiBaseUrl =
          process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";
        const response = await fetch(`${apiBaseUrl}/missing/${reportId}/matches`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          const raw = await response.text();
          let backendMessage = response.statusText;
          try {
            const parsed = JSON.parse(raw);
            backendMessage = parsed.detail || parsed.message || raw || backendMessage;
          } catch {
            backendMessage = raw || backendMessage;
          }

          if (response.status === 404) {
            throw new Error("Report not found");
          }
          throw new Error(`Failed to fetch matches: ${response.status} — ${backendMessage}`);
        }

        const data = (await response.json()) as MatchesResponse;
        setMatches(data.matches || []);
        setMissingName(data.missing_name || "Unknown");
        setMissingImagePath(data.missing_image_path ?? null);
        setError(null);
      } catch (fetchError) {
        setError(
          fetchError instanceof Error
            ? fetchError.message
            : "Unable to load match details.",
        );
        setMatches([]);
      } finally {
        setLoading(false);
      }
    };

    void fetchMatches();
  }, [isAuthenticated, reportId, token]);

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 px-4 py-8">
        <div className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-xl dark:border-slate-800 dark:bg-slate-950">
          <p className="mb-4 text-lg font-semibold text-slate-700 dark:text-slate-200">
            Please log in to view match details.
          </p>
          <Button onClick={() => window.location.assign("/login")}>Log in</Button>
        </div>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 px-4 py-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-4 inline-flex h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-cyan-500" />
          <p className="text-slate-600 dark:text-slate-400">
            Loading match details...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 px-4 py-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-xl dark:border-slate-800 dark:bg-slate-950">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-cyan-700 dark:text-cyan-300">
                Match report
              </p>
              <h1 className="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-100">
                Matches for {missingName}
              </h1>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                {matches.length} potential match{matches.length !== 1 ? "es" : ""} found.
              </p>
            </div>
            <Button onClick={() => window.history.back()}>
              Back to dashboard
            </Button>
          </div>

          {error && (
            <div className="rounded-3xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/30 dark:bg-red-900/10 dark:text-red-300">
              {error}
            </div>
          )}
        </div>

        <div className="grid gap-6">
          {matches.length === 0 ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-xl dark:border-slate-800 dark:bg-slate-950">
              <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                No matches found yet.
              </p>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                Submit additional information to improve the match results.
              </p>
            </div>
          ) : (
            matches.map((match) => (
              <MatchDetailsCard
                key={match._id}
                match={{
                  ...match,
                  finder_name: match.finder_name ?? "Unknown reporter",
                  finder_phone: match.finder_phone ?? "Not available",
                  found_location: match.found_location ?? "Unknown location",
                  found_image_path: match.found_image_path ?? "",
                  missing_image_path: match.missing_image_path ?? missingImagePath ?? "",
                }}
                missingName={missingName}
              />
            ))
          )}
        </div>
      </div>
    </main>
  );
}
