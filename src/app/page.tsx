import Link from "next/link";
import { ArrowRight, Eye, Lock, MonitorCog, ShieldCheck } from "lucide-react";

import { AppShell, Panel, StatCard } from "@/components/app-shell";
import {
  capabilityCards,
  consoleStats,
  workflowSteps,
} from "@/lib/demo-data";

export default function HomePage() {
  return (
    <AppShell>
      <div className="space-y-8">
        <section className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="rounded-[2rem] border border-white/10 bg-white/6 p-8 shadow-[0_30px_90px_rgba(0,0,0,0.45)] backdrop-blur-xl md:p-10">
            <div className="mb-4 inline-flex rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-xs uppercase tracking-[0.3em] text-cyan-100/80">
              qwen3-vl-8b · Qwen-Agent · OpenTrust
            </div>
            <h1 className="max-w-4xl text-5xl font-semibold tracking-tight text-white md:text-7xl">
              ΨClaw — control your machine like magic.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-300 md:text-xl">
              A fine-tuned desktop companion model for OpenClaw. PsiClaw operates across
              your browser, native apps, and file system — with persistent memory, API-first
              execution, and a confirmation-first safety policy.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/console"
                className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-cyan-100"
              >
                Enter operator console
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/gym"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/6 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/10"
              >
                Explore Desktop Gym
              </Link>
            </div>
          </div>

          <Panel title="Mission profile" eyebrow="Why this exists">
            <div className="space-y-5 text-sm leading-7 text-zinc-300">
              <p>
                ΨClaw is built on qwen3-vl-8b — a model specifically designed for
                PC/mobile GUI operation — and ships as the default desktop companion
                inside OpenClaw.
              </p>
              <div className="grid gap-3">
                {[
                  {
                    icon: Eye,
                    text: "Observe browser, native apps, and filesystem state in full.",
                  },
                  {
                    icon: MonitorCog,
                    text: "Prefer direct API calls. Fall back to visual automation only when needed.",
                  },
                  {
                    icon: Lock,
                    text: "Require confirmation before any irreversible action.",
                  },
                  {
                    icon: ShieldCheck,
                    text: "Persist user identity via OpenTrust — memory as reasoning, not retrieval.",
                  },
                ].map((item) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.text}
                      className="flex items-start gap-3 rounded-2xl border border-white/8 bg-black/20 p-3"
                    >
                      <Icon className="mt-0.5 h-4 w-4 text-violet-200" />
                      <p>{item.text}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </Panel>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {consoleStats.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          {capabilityCards.map((card) => (
            <Panel key={card.title} title={card.title}>
              <p className="text-sm leading-7 text-zinc-300">{card.description}</p>
            </Panel>
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <Panel title="Operator workflow" eyebrow="Safe action loop">
            <div className="space-y-3">
              {workflowSteps.map((step, index) => (
                <div
                  key={step}
                  className="flex gap-4 rounded-2xl border border-white/8 bg-black/20 p-4"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-400/20 text-sm text-violet-100">
                    {index + 1}
                  </div>
                  <p className="text-sm leading-7 text-zinc-300">{step}</p>
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="Product story" eyebrow="What the demo proves">
            <div className="grid gap-4 md:grid-cols-2">
              {[
                "Operator console: live desktop state, proposed actions, and approval queue.",
                "Desktop Gym: structured training scenarios across browser, native apps, and terminal.",
                "Trace explorer: full causal chain from observation → API/DOM → outcome.",
                "Eval dashboard: success rate, intervention burden, API routing, memory quality.",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/8 bg-black/20 p-4 text-sm leading-7 text-zinc-300"
                >
                  {item}
                </div>
              ))}
            </div>
          </Panel>
        </section>
      </div>
    </AppShell>
  );
}
