"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { useAuth } from "@/context/AuthContext";
import Button from "@/components/ui/Button";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Report Missing", href: "/report-missing" },
  { label: "Report Found", href: "/report-found" },
  { label: "Dashboard", href: "/dashboard", role: "user" },
  { label: "Authority", href: "/admin", role: "authority" },
];

export default function AppNavbar() {
  const pathname = usePathname();
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/85 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-4 py-3 md:px-8">
        <Link
          href="/"
          className="text-lg font-extrabold tracking-tight text-slate-900 md:text-xl"
        >
          FindMe AI
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          {navLinks
            .filter((link) => {
              if (!("role" in link) || !link.role) {
                return true;
              }
              return user?.role === link.role;
            })
            .map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-lg px-3 py-2 text-sm font-medium transition ${isActive ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"}`}
                >
                  {link.label}
                </Link>
              );
            })}
        </nav>

        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <span className="hidden text-sm text-slate-600 sm:inline">
                Hi, {user?.name}
              </span>
              <Button variant="ghost" onClick={logout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link href="/signup">
                <Button variant="secondary">Sign Up</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
