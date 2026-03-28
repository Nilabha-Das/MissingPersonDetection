"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Script from "next/script";

import AppNavbar from "@/components/AppNavbar";
import Button from "@/components/ui/Button";
import { InputField } from "@/components/ui/FormFields";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Toast from "@/components/ui/Toast";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { login, loginWithGoogleToken } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const initGoogle = () => {
      const windowWithGoogle = window as typeof window & {
        google?: {
          accounts: {
            id: {
              initialize: (config: {
                client_id: string;
                callback: (response: { credential?: string }) => void;
              }) => void;
              renderButton: (
                parent: HTMLElement,
                options: Record<string, string>,
              ) => void;
            };
          };
        };
      };

      const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
      if (!googleClientId || !windowWithGoogle.google) {
        return;
      }

      const target = document.getElementById("google-login-button");
      if (!target) {
        return;
      }

      windowWithGoogle.google.accounts.id.initialize({
        client_id: googleClientId,
        callback: async (response) => {
          if (!response.credential) {
            setError("Google login failed. No credential returned.");
            return;
          }

          setError("");
          setGoogleLoading(true);
          try {
            const signedInUser = await loginWithGoogleToken(
              response.credential,
            );
            const redirect =
              new URLSearchParams(window.location.search).get("redirect") ||
              (signedInUser.role === "authority" ? "/admin" : "/dashboard");
            router.push(redirect);
          } catch (loginError) {
            const message =
              loginError instanceof Error
                ? loginError.message
                : "Google login failed. Please try again.";
            setError(message);
          } finally {
            setGoogleLoading(false);
          }
        },
      });

      target.innerHTML = "";
      windowWithGoogle.google.accounts.id.renderButton(target, {
        theme: "outline",
        size: "large",
        text: "signin_with",
        shape: "pill",
      });
    };

    initGoogle();
    window.addEventListener("google-loaded", initGoogle);

    return () => {
      window.removeEventListener("google-loaded", initGoogle);
    };
  }, [loginWithGoogleToken, router]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    setLoading(true);
    try {
      const signedInUser = await login(email, password);
      const redirect =
        new URLSearchParams(window.location.search).get("redirect") ||
        (signedInUser.role === "authority" ? "/admin" : "/dashboard");
      router.push(redirect);
    } catch {
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_right,_#dff4ff_0%,_#f7fbff_45%,_#fff7ef_100%)]">
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
        onLoad={() => window.dispatchEvent(new Event("google-loaded"))}
      />
      <AppNavbar />
      <main className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-10 md:grid-cols-[1fr_1fr] md:px-8">
        <section className="rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-cyan-900 p-7 text-white shadow-xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200">
            Secure Access Portal
          </p>
          <h2 className="mt-3 text-3xl font-extrabold leading-tight">
            Welcome Back to FindMe AI
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-slate-200">
            Sign in to continue to your personalized dashboard and case tools.
          </p>
          <div className="mt-6 space-y-3 text-sm text-slate-100">
            <p>• User accounts open reporting workflows.</p>
            <p>• Authority accounts unlock command center views.</p>
            <p>• Use Google or email/password for quick access.</p>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white/90 p-7 shadow-xl">
          <h1 className="text-2xl font-extrabold text-slate-900">Login</h1>
          <p className="mt-2 text-sm text-slate-600">
            Sign in to access reporting and dashboard features.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
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
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {error ? <Toast message={error} tone="error" /> : null}

            <Button type="submit" fullWidth disabled={loading}>
              {loading ? <LoadingSpinner label="Signing in..." /> : "Login"}
            </Button>
          </form>

          <div className="my-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-slate-200" />
            <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
              Or
            </p>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          <div className="space-y-3">
            <div id="google-login-button" className="flex justify-center" />
            {googleLoading ? (
              <div className="flex justify-center">
                <LoadingSpinner label="Signing in with Google..." />
              </div>
            ) : null}
            {!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ? (
              <p className="text-center text-xs text-slate-500">
                Google login is disabled. Set NEXT_PUBLIC_GOOGLE_CLIENT_ID to
                enable.
              </p>
            ) : null}
          </div>

          <p className="mt-5 text-sm text-slate-600">
            New here?{" "}
            <Link
              href="/signup"
              className="font-semibold text-cyan-700 hover:text-cyan-600"
            >
              Create an account
            </Link>
          </p>
        </section>
      </main>
    </div>
  );
}
