# PsiClaw (ΨClaw)

**A fine-tuned desktop companion model for OpenClaw — control your machine like magic.**

PsiClaw is the training grounds, evaluation harness, and operator console for a specialized VLM (vision-language model) built on top of [qwen3-vl-8b](https://lmstudio.ai/models/qwen/qwen3-vl-8b). It ships as the default desktop companion option inside OpenClaw for users who want a model that deeply understands and operates their macOS environment.

---

## What PsiClaw does

PsiClaw operates across your **entire computing environment** — not just the browser:

- **Browser** — navigate, search, fill forms, verify evidence, multi-hop research
- **Native apps** — VS Code, Terminal, Slack, Finder, and more via system accessibility + Peekaboo
- **File system** — read, organize, and act on files with appropriate confirmation gates
- **Memory** — persistent user identity via OpenTrust (prediction-based, not static retrieval)

It prefers **direct API calls** over browser DOM automation when an API skill is available (Unbrowse pattern), falling back to visual automation only when needed.

---

## Model

| | |
|---|---|
| **Base model** | qwen3-vl-8b |
| **Format (Mac mini 16GB)** | MLX 4BIT (5.78 GB) |
| **Format (M3 Max 48GB)** | MLX 8BIT (9.87 GB) |
| **Min hardware for users** | 8GB RAM (runs at ~5.8GB) |
| **Agent framework** | Qwen-Agent (first-party, native tool calling) |
| **Personalization** | OpenTrust (memory as reasoning) |

---

## Repo structure

```
psi-claw/
├── docs/
│   ├── psiclaw-training-plan.md     # Full training design + research sources
│   └── psiclaw-system-prompt-v2.md  # System prompt used for fine-tuning
├── src/
│   └── app/
│       ├── page.tsx          # Overview / landing
│       ├── console/          # Operator console — observe, approve, deny
│       ├── gym/              # Desktop Gym — task scenarios for training
│       ├── traces/           # Trace explorer — replay + audit
│       └── evals/            # Eval dashboard — success rate, interventions
└── src/lib/
    └── demo-data.ts          # Scenarios, task data, eval rows
```

---

## Running locally

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## License

MIT
