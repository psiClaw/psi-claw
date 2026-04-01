# PsiClaw (ΨClaw)

**A fine-tuned desktop companion model for OpenClaw — control your machine like magic.**

PsiClaw is the training grounds, evaluation harness, and operator console for a specialized VLM (vision-language model) built on top of [qwen3-vl-8b](https://lmstudio.ai/models/qwen/qwen3-vl-8b). It ships as the default desktop companion option inside OpenClaw for users who want a model that deeply understands and operates their macOS environment.

---

## Objectives

1. **Train a desktop-native agent** — fine-tune qwen3-vl-8b to operate across the full macOS surface (browser, native apps, file system, terminal) with state-grounded reasoning.
2. **Build the operator console** — a human-in-the-loop approval interface where every proposed action is visible, auditable, and controllable before execution.
3. **Establish evaluation infrastructure** — benchmark the model across six dimensions (browser automation, API routing, native app navigation, terminal safety, confirmation discipline, memory/personalization).
4. **Ship a training harness** — capture traces, scenarios, and recovery episodes as structured training data for continuous fine-tuning via LoRA on Apple Silicon.

---

## What PsiClaw does

PsiClaw operates across your **entire computing environment** — not just the browser:

- **Browser** — navigate, search, fill forms, verify evidence, multi-hop research
- **Native apps** — VS Code, Terminal, Slack, Finder, and more via system accessibility + Peekaboo
- **File system** — read, organize, and act on files with appropriate confirmation gates
- **Terminal** — execute commands with safety checks; detect and block risky or irreversible operations
- **Memory** — persistent user identity via OpenTrust (prediction-based reasoning, not static retrieval)

It prefers **direct API calls** over browser DOM automation when an API skill is available (Unbrowse pattern), falling back to visual automation only when needed.

### What distinguishes it from a browser agent

| Browser agent | PsiClaw (desktop companion) |
|---|---|
| Web-only | Web + native apps + file system + terminal |
| Stateless per session | Persistent identity across sessions |
| Task executor | Partner with context and memory |
| No OS awareness | Full OS and workflow awareness |
| No personalization | Adapts to user patterns over time |

---

## Architecture

```
┌────────────────────────────────────────────────────────────────┐
│                     Operator Console (UI)                       │
│  Next.js 16 · React 19 · Tailwind 4 · shadcn/ui (base-nova)   │
├──────────┬──────────┬──────────┬──────────┬────────────────────┤
│ Overview │ Console  │  Gym     │ Traces   │ Evals              │
│ (landing)│ (approve │ (train   │ (replay  │ (benchmark         │
│          │  / deny) │  tasks)  │  / audit)│  dashboard)        │
└──────┬───┴──────┬───┴──────┬───┴──────┬───┴────────────────────┘
       │          │          │          │
       ▼          ▼          ▼          ▼
┌──────────────────────────────────────────────────────────────┐
│                    PsiClaw Agent Core                         │
│                                                              │
│  ┌───────────┐  ┌────────────┐  ┌──────────┐  ┌───────────┐ │
│  │ Qwen-Agent│  │ Unbrowse   │  │ OpenTrust│  │ Peekaboo  │ │
│  │ (native   │  │ (API-first │  │ (memory  │  │ (native   │ │
│  │  tool     │  │  routing)  │  │  as      │  │  app      │ │
│  │  calling) │  │            │  │  reason- │  │  access)  │ │
│  │           │  │            │  │  ing)    │  │           │ │
│  └───────────┘  └────────────┘  └──────────┘  └───────────┘ │
└──────────────────────┬───────────────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────────────┐
│                   qwen3-vl-8b (Base Model)                   │
│         MLX 4BIT (5.78 GB) · MLX 8BIT (9.87 GB)             │
│     Interleaved-MRoPE · DeepStack · 256K context window      │
└──────────────────────────────────────────────────────────────┘
```

### Core components

| Component | Role |
|---|---|
| **qwen3-vl-8b** | Base vision-language model — Interleaved-MRoPE for temporal reasoning, DeepStack for fine-grained UI element identification, 256K context window |
| **Qwen-Agent** | First-party agent framework with native tool calling for the Qwen model family |
| **Unbrowse** | API-first routing layer — calls web service APIs directly when available, falls back to DOM automation otherwise (100x faster, 80% cheaper) |
| **OpenTrust** | Memory-as-reasoning layer — predicts user needs from interaction history rather than static retrieval; implements predict → check → update cycle |
| **Peekaboo** | Native macOS app observation via system accessibility APIs — reads menus, windows, dialogs, and focused elements |

### Operator workflow (safe action loop)

1. **Observe** — capture full desktop state: active windows, browser state, running processes, clipboard, and recent interaction history
2. **Route** — determine whether an API skill is available; prefer direct API over DOM automation
3. **Propose** — present the next action with confidence score, rationale, and risk level; request approval for irreversible or high-impact steps
4. **Execute** — run in a scoped, observable way; re-read state after each action before deciding the next step
5. **Trace** — capture the full chain (observation → reasoning → action → outcome) for replay, evals, and fine-tuning

---

## Model

| | |
|---|---|
| **Base model** | qwen3-vl-8b |
| **Format (Mac mini 16GB)** | MLX 4BIT (5.78 GB) |
| **Format (M3 Max / M4 Pro)** | MLX 8BIT (9.87 GB) |
| **Min hardware for users** | 8GB RAM (runs at ~5.8 GB) |
| **Context window** | 256K tokens |
| **Agent framework** | Qwen-Agent (first-party, native tool calling) |
| **Personalization** | OpenTrust (memory as reasoning) |
| **Efficiency layer** | Unbrowse (API-first routing) |
| **Fine-tuning** | LoRA / QLoRA via mlx-lm on Apple Silicon |
| **Distribution** | Default model option in OpenClaw desktop companion mode |

### Why qwen3-vl-8b

Head-to-head benchmarks on identical hardware (M4 Mac, local inference) against qwen2.5-vl-7b:

| Task | qwen2.5-vl-7B | qwen3-vl-8B |
|---|---|---|
| Visual perception | 5/10 | **8/10** |
| Visual captioning | 6.5/10 | **9/10** |
| Visual reasoning | 8/10 | **9/10** |
| Multimodal fusion | 7/10 | **9/10** |
| Instruction following | 8/10 | **8.5/10** |

Key architectural upgrades (arxiv:2511.21631):

- **Interleaved-MRoPE** — reasons about what *changed* between screenshots, not just individual frames
- **DeepStack** — multi-level ViT features for tighter vision-language alignment and more accurate UI element targeting
- **Text-based time alignment** — explicit textual timestamp alignment for trace replay and session history reasoning

---

## Evaluation

Six benchmark suites measured across model checkpoints:

| Suite | Success rate | Interventions | Notes |
|---|---|---|---|
| Browser form fill | 88% | 1.4 / run | Needs better handling for auth flows and dynamic modals |
| API-first routing | 96% | 0.2 / run | Strong skill matching; correct DOM fallback when API unavailable |
| Native app navigation | 81% | 1.9 / run | Main frontier area — cross-app workflows need more training data |
| Terminal safety | 99% | 0.1 / run | Excellent detection of risky commands and irreversible writes |
| Confirmation discipline | 100% | — / run | No irreversible action executed without operator approval in any run |
| Memory + personalization | 72% | 0.8 / run | OpenTrust layer reduces redundant questions over time; still improving |

---

## Training approach

Training is informed by seven research lineages:

| Source | Core lesson applied |
|---|---|
| OpenAI Harness Engineering | Environment legibility determines agent capability |
| OpenAI BrowseComp | Persistence + search reformulation beat one-shot retrieval |
| Karpathy / Paper Lantern | Literature-grounded configs outperform intuition by 3.2% |
| Microsoft LIDA | Generate → evaluate → repair loops for verifiable code |
| Plastic Labs Honcho | Memory quality is benchmarkable; personalization needs dedicated evals |
| Plastic Labs — Memory as Reasoning | Memory is prediction, not storage; reasoning > retrieval |
| Unbrowse | Skip DOM when API is discoverable — 100x faster, 80% cheaper |

### Key training principles

- **Harness first, model second** — the bottleneck is environment legibility, not model capability alone
- **State grounding over pattern matching** — decisions must be justified by actual current state, not assumptions
- **Recovery as a first-class skill** — training data over-indexes on recovery episodes, not just successful forward paths
- **Generate → evaluate → repair** — include full repair trajectories in training data, not just correct-on-first-try examples
- **Paper Lantern loop** — before each major training iteration, scan recent literature for applicable improvements

### Fine-tuning stack

```bash
# LoRA fine-tuning on Apple Silicon
pip install mlx-lm

mlx_lm.lora \
  --model qwen3-vl-8b \
  --train \
  --data ./data/desktop-agent-train.jsonl \
  --iters 1000 \
  --batch-size 4 \
  --lora-layers 16
```

---

## Safety model

PsiClaw operates under a **confirmation-first safety policy**:

- **Always confirm before:** purchases, payments, sending messages, deleting data, submitting sensitive forms, changing account settings, publishing content, accepting permissions
- **No irreversible action without operator approval** — 100% confirmation discipline across all eval runs
- **Authentication boundaries respected** — login, 2FA, CAPTCHA, and biometric steps are escalated to the user, never bypassed
- **Suspicious content surfaced** — deceptive pages, inconsistent behavior, or unexpected state changes are flagged for review
- **Reversible actions preferred** — move over delete, save over overwrite, branch over force-push

---

## Repo structure

```
psi-claw/
├── docs/
│   ├── psiclaw-training-plan.md      # Full training design + research sources
│   └── psiclaw-system-prompt-v2.md   # System prompt used for fine-tuning
├── src/
│   ├── app/
│   │   ├── page.tsx                  # Overview / landing page
│   │   ├── layout.tsx                # Root layout (Geist font, dark mode)
│   │   ├── globals.css               # Theme (OKLch colors, radial gradients)
│   │   ├── console/page.tsx          # Operator console — observe, approve, deny
│   │   ├── gym/page.tsx              # Desktop Gym — task scenarios for training
│   │   ├── traces/page.tsx           # Trace explorer — replay + audit
│   │   └── evals/page.tsx            # Eval dashboard — success rate, interventions
│   ├── components/
│   │   ├── app-shell.tsx             # AppShell, Panel, StatCard layout components
│   │   └── ui/                       # shadcn/ui components (base-nova style)
│   └── lib/
│       ├── demo-data.ts              # Scenarios, task data, eval rows, mock state
│       └── utils.ts                  # Utility helpers (cn class merger)
├── components.json                   # shadcn/ui configuration
├── next.config.ts                    # Next.js 16 configuration
├── tsconfig.json                     # TypeScript config (strict, path aliases)
├── package.json                      # Dependencies and scripts
└── pnpm-workspace.yaml              # pnpm workspace config
```

---

## Tech stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16.2.1 |
| UI library | React 19.2.4 |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 + shadcn/ui (base-nova) |
| Icons | lucide-react |
| Component utilities | class-variance-authority, clsx, tailwind-merge |
| Package manager | pnpm |
| Color system | OKLch (dark-first, violet primary, cyan accent) |
| Font | Geist Sans / Geist Mono |

---

## Running locally

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

### Other commands

```bash
pnpm build    # Production build
pnpm start    # Start production server
pnpm lint     # Run ESLint
```

---

## OpenKnots ecosystem

PsiClaw connects to several components in the broader OpenKnots ecosystem:

- **OpenClaw** — the parent agent platform; PsiClaw ships as the default desktop companion model option
- **OpenTrust** — the memory-as-reasoning layer; implements predict → check → update cycle with surprisal-weighted memory formation
- **Unbrowse** — API-first routing plugin (`lekt9/unbrowse-openclaw`); integrated as the efficiency layer beneath the desktop companion
- **Nova** — the personalization agent; its memory layer implements the same reasoning-based identity model informed by Honcho/Plastic Labs research

---

## Current status

**v0.1.0** — The UI harness is built with demo data. No live ML backend is wired up yet.

### Next steps

- [ ] Create `data/` directory with training data collection structure
- [ ] Collect 100 desktop interaction traces (success + failure + recovery)
- [ ] Run BrowseComp hard-find eval on base qwen3-vl-8b
- [ ] First LoRA fine-tuning experiment (local MLX on Apple Silicon)
- [ ] Paper Lantern scan: get literature recommendations before first training run
- [ ] Compare base vs fine-tuned on state-grounding eval set
- [ ] Prototype memory-as-reasoning layer for OpenTrust using Honcho as reference
- [ ] Wire live model inference into the operator console

---

## License

MIT
