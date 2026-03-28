"use client";

import { useState } from "react";
import Link from "next/link";

import AppNavbar from "@/components/AppNavbar";
import AuthPromptModal from "@/components/AuthPromptModal";
import Carousel from "@/components/Carousel";
import { useAuth } from "@/context/AuthContext";

export default function HomePage() {
  const { isAuthenticated, initialized } = useAuth();
  const [dismissedPrompt, setDismissedPrompt] = useState(false);
  const showAuthPrompt = initialized && !isAuthenticated && !dismissedPrompt;

  const features = [
    {
      title: "Face Match Engine",
      desc: "Generate robust embeddings and compare live feeds against registered profiles in seconds.",
      icon: "AI",
    },
    {
      title: "Multi-Camera Ingestion",
      desc: "Track multiple camera streams in parallel with confidence scoring and event snapshots.",
      icon: "CAM",
    },
    {
      title: "Instant Alerts",
      desc: "Push high-confidence detections to operators with actionable context and timestamps.",
      icon: "ALRT",
    },
    {
      title: "Secure Case Storage",
      desc: "Keep sensitive records protected with audited access patterns and encrypted persistence.",
      icon: "SAFE",
    },
  ];

  const steps = [
    "Upload missing person image",
    "Create embedding profile",
    "Scan CCTV streams",
    "Flag likely matches",
    "Notify response team",
  ];

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_#dff4ff_0%,_#f6fbff_42%,_#fff9ef_100%)] text-slate-900">
      <AppNavbar />
      <AuthPromptModal
        open={showAuthPrompt}
        onClose={() => setDismissedPrompt(true)}
      />

      <section
        id="home"
        className="relative overflow-hidden pt-28 pb-20 px-6 md:px-10"
      >
        <div className="pointer-events-none absolute -top-16 -left-16 h-56 w-56 rounded-full bg-cyan-300/40 blur-3xl drift-slow"></div>
        <div className="pointer-events-none absolute top-20 right-4 h-60 w-60 rounded-full bg-amber-200/40 blur-3xl drift-slower"></div>

        <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="reveal-up">
            <p className="mb-5 inline-flex items-center rounded-full border border-slate-300/70 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-slate-700 shadow-sm">
              FindMe AI Response Platform
            </p>
            <h1 className="text-4xl font-extrabold leading-tight md:text-6xl">
              Faster Match Detection for
              <span className="block bg-gradient-to-r from-cyan-700 via-sky-600 to-amber-500 bg-clip-text text-transparent">
                Missing Person Cases
              </span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-700 md:text-xl">
              A realtime workflow for agencies to upload case photos, monitor
              live camera feeds, and receive ranked match alerts with traceable
              confidence.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <Link
                href="/report-missing"
                className="rounded-full bg-slate-900 px-7 py-3 text-sm font-semibold text-white shadow-xl transition hover:-translate-y-0.5 hover:bg-slate-800"
              >
                Report Missing Person
              </Link>
              <Link
                href="/report-found"
                className="rounded-full border border-slate-300 bg-white/90 px-7 py-3 text-sm font-semibold text-slate-800 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-400"
              >
                Report Found Person
              </Link>
              <a
                href="#features"
                className="rounded-full border border-slate-300 bg-white/90 px-7 py-3 text-sm font-semibold text-slate-800 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-400"
              >
                Explore Features
              </a>
            </div>

            <div className="mt-10 grid max-w-xl grid-cols-3 gap-3 text-left">
              {[
                { label: "Avg Match Latency", value: "< 4s" },
                { label: "Concurrent Streams", value: "24+" },
                { label: "Alert Precision", value: "95%" },
              ].map((metric) => (
                <div
                  key={metric.label}
                  className="rounded-2xl border border-white/70 bg-white/80 p-4 shadow-sm backdrop-blur"
                >
                  <p className="text-lg font-extrabold text-slate-900">
                    {metric.value}
                  </p>
                  <p className="mt-1 text-xs text-slate-600">{metric.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="reveal-up delay-1 rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-[0_20px_65px_-35px_rgba(15,23,42,0.45)] backdrop-blur">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">
              Live Case Snapshot
            </p>
            <div className="mt-5 rounded-2xl bg-slate-900 p-5 text-slate-100">
              <div className="mb-4 flex items-center justify-between text-xs text-slate-300">
                <span>Camera: STN-12</span>
                <span>Confidence: 92.3%</span>
              </div>
              <div className="rounded-xl border border-cyan-300/50 bg-slate-800 p-4 pulse-soft">
                <p className="text-sm text-cyan-200">
                  Potential match detected in corridor feed
                </p>
                <p className="mt-2 text-xs text-slate-300">
                  Matched profile: Case #D-1192
                </p>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 text-xs text-slate-200">
                <div className="rounded-lg bg-slate-800 p-3">
                  Embedding Drift: 0.07
                </div>
                <div className="rounded-lg bg-slate-800 p-3">
                  Frame Age: 2.1s
                </div>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-slate-600">
              Operators can verify evidence quickly and escalate only
              high-signal detections.
            </p>
          </div>
        </div>
      </section>

      <section className="px-6 pb-8 md:px-10">
        <div className="mx-auto max-w-7xl reveal-up delay-2 rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-[0_24px_70px_-45px_rgba(15,23,42,0.5)]">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">
            Interface Preview
          </p>
          <Carousel />
        </div>
      </section>

      <section id="features" className="px-6 py-20 md:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
            <h2 className="text-3xl font-extrabold md:text-4xl">
              System Capabilities
            </h2>
            <p className="max-w-xl text-slate-700">
              Built for real operations where speed, explainability, and
              decision confidence are mandatory.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
            {features.map((feature) => (
              <article
                key={feature.title}
                className="feature-card rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm"
              >
                <div className="mb-4 inline-flex rounded-lg bg-slate-900 px-3 py-2 text-xs font-bold tracking-[0.12em] text-white">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-extrabold text-slate-900">
                  {feature.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  {feature.desc}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200/70 bg-white/70 px-6 py-20 backdrop-blur md:px-10">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-center text-3xl font-extrabold md:text-4xl">
            How It Works
          </h2>
          <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-5">
            {steps.map((step, idx) => (
              <div
                key={step}
                className="rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm"
              >
                <p className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-cyan-100 text-sm font-extrabold text-cyan-700">
                  {idx + 1}
                </p>
                <p className="text-sm font-semibold text-slate-800">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="px-6 py-20 md:px-10">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-white/90 p-8 shadow-sm">
            <h2 className="text-3xl font-extrabold">About This Initiative</h2>
            <p className="mt-5 leading-relaxed text-slate-700">
              FindMe AI focuses on reducing time-to-response in missing person
              investigations. The platform combines a FastAPI backend,
              operational dashboards, and model-assisted matching into one
              streamlined decision system.
            </p>
            <p className="mt-4 leading-relaxed text-slate-700">
              The goal is simple: convert fragmented surveillance data into
              reliable leads that teams can act on quickly.
            </p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-900 p-8 text-slate-100 shadow-sm">
            <h3 className="text-2xl font-extrabold">Why It Matters</h3>
            <ul className="mt-5 space-y-3 text-sm leading-relaxed text-slate-200">
              <li>
                Prioritizes high-confidence detections to avoid alert fatigue.
              </li>
              <li>
                Preserves searchable evidence trails for audit and review.
              </li>
              <li>
                Supports faster coordination between field teams and control
                rooms.
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section id="contact" className="px-6 pb-20 md:px-10">
        <div className="mx-auto max-w-7xl rounded-3xl bg-gradient-to-r from-slate-900 via-cyan-950 to-slate-900 p-10 text-center text-white shadow-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-200">
            Deployment Ready
          </p>
          <h2 className="mt-4 text-3xl font-extrabold md:text-4xl">
            Start Improving Case Resolution Speed
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-slate-200 md:text-base">
            Launch your pilot with secure onboarding, stream configuration, and
            end-to-end monitoring workflows.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/login"
              className="rounded-full bg-white px-7 py-3 text-sm font-semibold text-slate-900 transition hover:-translate-y-0.5 hover:bg-slate-100"
            >
              Login / Sign Up
            </Link>
            <a
              href="mailto:team@findme.ai"
              className="rounded-full border border-slate-400 px-7 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:border-slate-200"
            >
              Contact Team
            </a>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white/80 py-10 text-center text-slate-600">
        <div className="mb-5 flex justify-center space-x-6 text-sm font-medium">
          <a href="#about" className="transition hover:text-slate-900">
            About
          </a>
          <a href="#contact" className="transition hover:text-slate-900">
            Contact
          </a>
          <a href="#features" className="transition hover:text-slate-900">
            Privacy Policy
          </a>
        </div>
        <p className="text-xs md:text-sm">
          © {new Date().getFullYear()} FindMe AI Detection System. All rights
          reserved.
        </p>
      </footer>
    </div>
  );
}
