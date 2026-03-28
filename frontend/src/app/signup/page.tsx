"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import AppNavbar from "@/components/AppNavbar";
import Button from "@/components/ui/Button";
import { InputField } from "@/components/ui/FormFields";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Toast from "@/components/ui/Toast";
import { useAuth } from "@/context/AuthContext";

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"user" | "authority">(() => {
    if (typeof window === "undefined") {
      return "user";
    }
    return new URLSearchParams(window.location.search).get("role") ===
      "authority"
      ? "authority"
      : "user";
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!name || !email || !password) {
      setError("Please fill all fields.");
      return;
    }

    setLoading(true);
    try {
      const signedUpUser = await signup(name, email, password, role);
      router.push(signedUpUser.role === "authority" ? "/admin" : "/dashboard");
    } catch (signupError) {
      const message =
        signupError instanceof Error
          ? signupError.message
          : "Sign up failed. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_right,_#dff4ff_0%,_#f7fbff_45%,_#fff7ef_100%)] text-slate-900">
      <AppNavbar />
      <main className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-10 md:grid-cols-[0.95fr_1.05fr] md:px-8">
        <section className="rounded-3xl border border-slate-200 bg-white/85 p-7 shadow-xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700">
            Join FindMe AI
          </p>
          <h1 className="mt-2 text-3xl font-extrabold">Create Your Account</h1>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">
            Choose your role and create secure access to the platform.
          </p>

          <div className="mt-6 grid gap-3">
            <button
              type="button"
              onClick={() => setRole("user")}
              className={`rounded-2xl border p-4 text-left transition ${role === "user" ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 bg-white hover:border-slate-300"}`}
            >
              <p className="text-sm font-bold">Normal User</p>
              <p
                className={`mt-1 text-xs ${role === "user" ? "text-slate-200" : "text-slate-600"}`}
              >
                Submit missing/found reports and monitor your cases.
              </p>
            </button>

            <button
              type="button"
              onClick={() => setRole("authority")}
              className={`rounded-2xl border p-4 text-left transition ${role === "authority" ? "border-cyan-700 bg-cyan-700 text-white" : "border-slate-200 bg-white hover:border-slate-300"}`}
            >
              <p className="text-sm font-bold">Authority</p>
              <p
                className={`mt-1 text-xs ${role === "authority" ? "text-cyan-100" : "text-slate-600"}`}
              >
                Access command dashboard and alert management.
              </p>
            </button>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white/90 p-7 shadow-xl">
          <h2 className="text-2xl font-extrabold text-slate-900">Sign Up</h2>
          <p className="mt-2 text-sm text-slate-600">
            Enter your details to continue as a {role}.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <InputField
              id="name"
              label="Full Name"
              type="text"
              placeholder="Your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <InputField
              id="email"
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <InputField
              id="password"
              label="Password"
              type="password"
              placeholder="Create password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {error ? <Toast message={error} tone="error" /> : null}

            <Button type="submit" fullWidth disabled={loading}>
              {loading ? (
                <LoadingSpinner label="Creating account..." />
              ) : (
                `Sign Up as ${role === "authority" ? "Authority" : "User"}`
              )}
            </Button>
          </form>

          <p className="mt-5 text-sm text-slate-600">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-cyan-700 hover:text-cyan-600"
            >
              Login
            </Link>
          </p>
        </section>
      </main>
    </div>
  );
}
