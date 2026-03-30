import { AppShell, Panel } from "@/components/app-shell";
import { desktopWindows, taskScenarios } from "@/lib/demo-data";

export default function GymPage() {
  return (
    <AppShell>
      <div className="space-y-8">
        <section>
          <div className="text-xs uppercase tracking-[0.3em] text-cyan-200/70">
            Desktop Gym
          </div>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-white md:text-5xl">
            A simulated macOS task arena for training and evaluation.
          </h1>
          <p className="mt-4 max-w-3xl text-zinc-300">
            Structured task scenarios spanning browser, native apps, terminal, and
            cross-app workflows. Each scenario generates a trace artifact for
            replay, eval scoring, and fine-tuning data collection.
          </p>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <Panel title="Simulated desktop state" eyebrow="Current arena">
            <div className="grid gap-4 lg:grid-cols-3">
              {desktopWindows.map((window) => (
                <div
                  key={window.title}
                  className="rounded-[1.6rem] border border-white/10 bg-gradient-to-b from-white/10 to-black/25 p-4"
                >
                  <div className="rounded-2xl border border-white/10 bg-black/35 p-4">
                    <div className="mb-6 flex gap-2">
                      <span className="h-3 w-3 rounded-full bg-red-400/90" />
                      <span className="h-3 w-3 rounded-full bg-yellow-400/90" />
                      <span className="h-3 w-3 rounded-full bg-emerald-400/90" />
                    </div>
                    <div className="text-sm font-medium text-white">{window.title}</div>
                    <div className="mt-2 text-xs uppercase tracking-[0.25em] text-zinc-500">
                      {window.subtitle}
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {window.chips.map((chip) => (
                        <span
                          key={chip}
                          className="rounded-full border border-white/10 bg-white/6 px-3 py-1 text-xs text-zinc-300"
                        >
                          {chip}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="Task scenarios" eyebrow="Training queue">
            <div className="space-y-4">
              {taskScenarios.map((scenario) => (
                <div
                  key={scenario.name}
                  className="rounded-2xl border border-white/8 bg-black/20 p-5"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-lg font-medium text-white">{scenario.name}</div>
                    <div className="rounded-full border border-white/10 px-3 py-1 text-xs text-zinc-300">
                      {scenario.status}
                    </div>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-zinc-300">
                    {scenario.objective}
                  </p>
                </div>
              ))}
            </div>
          </Panel>
        </section>
      </div>
    </AppShell>
  );
}
