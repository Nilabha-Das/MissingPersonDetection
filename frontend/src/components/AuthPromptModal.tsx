"use client";

import { useMemo } from "react";
import Link from "next/link";

import Button from "@/components/ui/Button";

interface AuthPromptModalProps {
  open: boolean;
  onClose: () => void;
}

export default function AuthPromptModal({
  open,
  onClose,
}: AuthPromptModalProps) {
  const classes = useMemo(
    () =>
      open
        ? "pointer-events-auto opacity-100"
        : "pointer-events-none opacity-0",
    [open],
  );

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4 transition ${classes}`}
    >
      <div className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl md:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700">
          Secure Access
        </p>
        <h2 className="mt-2 text-2xl font-extrabold text-slate-900 md:text-3xl">
          Continue with the right account type
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-slate-600">
          Create a user account for reporting and personal tracking, or an
          authority account for operational command dashboards. You can skip and
          browse the home page only.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-bold text-slate-900">Normal User</p>
            <p className="mt-2 text-xs text-slate-600">
              Report missing/found cases and track workflow updates.
            </p>
            <Link href="/signup?role=user" className="mt-4 inline-block">
              <Button fullWidth>Sign Up as User</Button>
            </Link>
          </div>

          <div className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4">
            <p className="text-sm font-bold text-slate-900">Authority</p>
            <p className="mt-2 text-xs text-slate-600">
              Access legal/operations dashboard and high-priority alerts.
            </p>
            <Link href="/signup?role=authority" className="mt-4 inline-block">
              <Button variant="secondary" fullWidth>
                Sign Up as Authority
              </Button>
            </Link>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <Link href="/login">
            <Button variant="ghost">Already have an account? Login</Button>
          </Link>
          <Button variant="ghost" onClick={onClose}>
            Continue Home Only
          </Button>
        </div>
      </div>
    </div>
  );
}
