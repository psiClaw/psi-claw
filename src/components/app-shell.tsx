import Link from "next/link";
import { PropsWithChildren } from "react";
import { Shield, Sparkles } from "lucide-react";

import { navItems } from "@/lib/demo-data";

export function AppShell({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(133,76,255,0.22),transparent_32%),radial-gradient(circle_at_80%_20%,rgba(0,220,255,0.16),transparent_24%),linear-gradient(180deg,#07070c_0%,#0b1020_45%,#05060a_100%)] text-white">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-6 sm:px-8 lg:px-10">
        <header className="sticky top-4 z-30 mb-8 rounded-full border border-white/10 bg-white/6 px-5 py-3 backdrop-blur-xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-violet-400/30 bg-violet-400/15 shadow-[0_0_30px_rgba(139,92,246,0.28)]">
                <Sparkles className="h-5 w-5 text-violet-200" />
              </div>
              <div>
                <div className="text-sm uppercase tracking-[0.3em] text-violet-200/80">
                  ΨClaw
                </div>
                <div className="text-sm text-zinc-300">
                  Desktop companion model · qwen3-vl-8b · OpenClaw
                </div>
              </div>
            </Link>

            <nav className="flex flex-wrap items-center gap-2 text-sm text-zinc-300">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-full border border-white/10 px-4 py-2 transition hover:border-violet-300/40 hover:bg-white/8 hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-sm text-emerald-200">
              <Shield className="h-4 w-4" />
              Safety-first operator mode
            </div>
          </div>
        </header>

        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}

export function Panel({
  title,
  eyebrow,
  children,
}: PropsWithChildren<{ title: string; eyebrow?: string }>) {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/6 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl">
      <div className="mb-5">
        {eyebrow ? (
          <div className="mb-2 text-xs uppercase tracking-[0.28em] text-cyan-200/70">
            {eyebrow}
          </div>
        ) : null}
        <h2 className="text-xl font-semibold tracking-tight text-white">{title}</h2>
      </div>
      {children}
    </section>
  );
}

export function StatCard({
  label,
  value,
  change,
}: {
  label: string;
  value: string;
  change: string;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-black/25 p-5">
      <div className="text-sm text-zinc-400">{label}</div>
      <div className="mt-3 text-3xl font-semibold text-white">{value}</div>
      <div className="mt-2 text-sm text-cyan-200">{change}</div>
    </div>
  );
}
