import { AppShell, Panel, StatCard } from "@/components/app-shell";
import { consoleStats, observedApps, proposedActions } from "@/lib/demo-data";

export default function ConsolePage() {
  return (
    <AppShell>
      <div className="space-y-8">
        <section className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="text-xs uppercase tracking-[0.3em] text-cyan-200/70">
              Operator Console
            </div>
            <h1 className="mt-2 text-4xl font-semibold tracking-tight text-white md:text-5xl">
              Human-centered command for desktop-aware agent runs.
            </h1>
            <p className="mt-4 max-w-3xl text-zinc-300">
              Observe the full desktop surface, review action proposals with confidence
              and risk scores, and approve only what feels safe. ΨClaw never executes
              irreversible actions without your sign-off.
            </p>
          </div>
          <div className="rounded-3xl border border-emerald-400/20 bg-emerald-400/10 px-5 py-4 text-sm text-emerald-100">
            Policy mode: operator approval required for medium+ risk actions
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {consoleStats.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </section>

        <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <Panel title="Observed application graph" eyebrow="Live desktop state">
            <div className="space-y-3">
              {observedApps.map((app) => (
                <div
                  key={app.name}
                  className="rounded-2xl border border-white/8 bg-black/20 p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-base font-medium text-white">{app.name}</div>
                    <div className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs uppercase tracking-[0.25em] text-cyan-100">
                      {app.state}
                    </div>
                  </div>
                  <div className="mt-2 text-sm text-zinc-400">{app.detail}</div>
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="Proposed next actions" eyebrow="Approval queue">
            <div className="space-y-4">
              {proposedActions.map((action) => (
                <div
                  key={action.title}
                  className="rounded-2xl border border-white/8 bg-black/20 p-5"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="text-lg font-medium text-white">{action.title}</div>
                    <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-zinc-300">
                      Confidence {action.confidence}
                    </span>
                    <span className="rounded-full border border-violet-300/20 bg-violet-300/10 px-3 py-1 text-xs text-violet-100">
                      {action.risk}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-zinc-300">{action.reason}</p>
                  <div className="mt-4 flex gap-3">
                    <button className="rounded-full bg-white px-4 py-2 text-sm font-medium text-black">
                      Approve
                    </button>
                    <button className="rounded-full border border-white/12 bg-white/6 px-4 py-2 text-sm text-white">
                      Inspect trace
                    </button>
                    <button className="rounded-full border border-red-300/20 bg-red-300/10 px-4 py-2 text-sm text-red-100">
                      Deny
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </section>
      </div>
    </AppShell>
  );
}
