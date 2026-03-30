import { AppShell, Panel } from "@/components/app-shell";
import { evalRows } from "@/lib/demo-data";

export default function EvalsPage() {
  return (
    <AppShell>
      <div className="space-y-8">
        <section>
          <div className="text-xs uppercase tracking-[0.3em] text-cyan-200/70">
            Evals
          </div>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-white md:text-5xl">
            Measure safety, intervention burden, and task success over time.
          </h1>
          <p className="mt-4 max-w-3xl text-zinc-300">
            Benchmark eval results for PsiClaw (qwen3-vl-8b) across browser automation,
            API-first routing, native app navigation, terminal safety, confirmation
            discipline, and memory quality.
          </p>
        </section>

        <Panel title="Evaluation suites" eyebrow="Prototype benchmark board">
          <div className="overflow-hidden rounded-3xl border border-white/8 bg-black/20">
            <div className="grid grid-cols-[1.4fr_0.7fr_0.9fr_1.4fr] gap-4 border-b border-white/8 px-5 py-4 text-xs uppercase tracking-[0.25em] text-zinc-500">
              <div>Suite</div>
              <div>Success</div>
              <div>Interventions</div>
              <div>Notes</div>
            </div>
            {evalRows.map((row) => (
              <div
                key={row.suite}
                className="grid grid-cols-[1.4fr_0.7fr_0.9fr_1.4fr] gap-4 border-b border-white/6 px-5 py-5 text-sm text-zinc-300 last:border-b-0"
              >
                <div className="font-medium text-white">{row.suite}</div>
                <div>{row.success}</div>
                <div>{row.interventions}</div>
                <div>{row.note}</div>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </AppShell>
  );
}
