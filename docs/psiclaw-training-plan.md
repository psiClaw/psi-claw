# PsiClaw — Desktop Companion Training Plan
_Last updated: 2026-03-30_

> **PsiClaw** is a fine-tuned desktop companion model built on top of OpenClaw.
> It is designed to ship as the default model for users who want to control their
> machine like magic — navigating apps, browsing, writing, and executing tasks
> across the full desktop environment with natural language.
>
> This document tracks all training decisions, research sources, and model choices
> for the PsiClaw model.

## Final Model Decisions

| Decision | Choice |
|---|---|
| Base model | **qwen3-vl-8b** |
| Host machine | **Work MacBook (M4 Pro)** — serves qwen3-vl-8b via LM Studio |
| Local format on work MacBook | **MLX 8BIT (9.87 GB)** — full quality |
| Access from personal MacBook | **LM Link** (remote inference, feels local) |
| Mac mini format (16GB) | **MLX 4BIT (5.78 GB)** for lightweight local tasks |
| Fine-tuning target | **8B class** (runs on 8–16GB user machines) |
| Agent framework | **Qwen-Agent** (native, first-party for this model family) |
| Personalization layer | **OpenTrust** (memory as reasoning, not static retrieval) |
| REST API routing | **Unbrowse** (API-first for known web services) |
| Pre-built site CLI | **OpenCLI** (deterministic adapters, zero LLM cost at runtime) |
| Real browser surface | **Tandem Browser** (human+agent collaboration, 250-endpoint local API) |
| Multi-agent networking | **OpenAgents** (agent discovery, collaboration, shared workspace) |
| Distribution | Default model option in OpenClaw for desktop companion mode |

### Technical foundation (arxiv:2511.21631)
Three architectural upgrades in Qwen3-VL directly relevant to PsiClaw:

- **Interleaved-MRoPE** — stronger spatial-temporal modeling across sequences of images/video. For desktop operation: the model reasons about what *changed* between screenshots, not just individual frames.
- **DeepStack** — multi-level ViT features for tighter vision-language alignment. Produces more accurate UI element identification — when the model targets a button, it has a richer visual representation.
- **Text-based time alignment** — explicit textual timestamp alignment for temporal grounding. Useful for trace replay and session history reasoning.

The Qwen team explicitly frames this model as: _"a foundational engine for image-grounded reasoning, agentic decision-making, and multimodal code intelligence in real-world workflows."_ That is the PsiClaw use case.

### Why qwen3-vl-8b over qwen2.5-vl-7b
Head-to-head benchmarks on identical hardware (M4 Mac, local inference):

| Task | qwen2.5-vl-7B | qwen3-vl-8B |
|---|---|---|
| Visual perception | 5/10 | 8/10 |
| Visual captioning | 6.5/10 | 9/10 |
| Visual reasoning | 8/10 | 9/10 |
| Multimodal fusion | 7/10 | 9/10 |
| Instruction following | 8/10 | 8.5/10 |

Qwen3-VL-8B also adds:
- Explicit **"Visual Agent"** mode for PC/mobile GUI operation
- **256K context window**
- **2D/3D spatial grounding**
- DeepStack architecture for fine-grained detail capture
- Text reasoning on par with Qwen3-235B (the flagship language model)

---

> **Note on scope:** This is a **desktop companion** model — not just a browser agent.
> The browser is one surface it operates on. The full scope is:
> - the operating system and application layer
> - the user's files, context, and workflow
> - native apps alongside web apps
> - persistent user identity and memory over time
>
> The model should feel like a colleague who understands your entire computing environment,
> not a browser automation tool that happens to run on your machine.

## Research Sources Incorporated

| Source | Core lesson |
|---|---|
| OpenAI Harness Engineering | Environment legibility determines agent capability |
| OpenAI BrowseComp | Persistence + search reformulation beat one-shot retrieval |
| Karpathy / Paper Lantern | Literature-grounded configs outperform intuition by 3.2% |
| Microsoft LIDA | Generate → evaluate → repair loops in verifiable code |
| Plastic Labs Honcho | Memory quality is benchmarkable; personalization needs dedicated evals |
| Plastic Labs — Memory as Reasoning | Memory is prediction, not storage; reasoning > retrieval |
| Unbrowse | Skip DOM when API is discoverable — 100x faster, 80% cheaper |

---

## Unified Principle

> The best AI systems don't store and retrieve. They **reason about state**, generate predictions, and repair when surprised.

This applies equally to:
- visualization (LIDA)
- user memory and personalization (Honcho / Plastic Labs)
- browser navigation
- native app interaction
- file system and workflow awareness (desktop companion scope)

---

## 0. What This Model Is

This is a **desktop companion model** — trained to operate as a persistent, intelligent partner across a user's entire computing environment.

### What it sees
- The active browser tab (DOM, screenshots, URL, page text)
- Native application state (windows, menus, focused elements)
- The file system (working directory, open files, project context)
- System-level signals (notifications, running processes, clipboard)
- User identity, preferences, and long-term interaction history (memory layer)

### What it does
- Executes multi-step tasks across browser AND native apps
- Navigates, fills, clicks, searches, scrapes, and synthesizes from the web
- Works with files, code, data, and documents on disk
- Operates native macOS/desktop apps via Peekaboo / accessibility APIs
- Prefers direct API calls over browser automation where possible (Unbrowse pattern)
- Maintains a persistent model of the user — learns preferences, adapts over time
- Acts like a knowledgeable colleague who knows your setup, not a stateless tool

### What distinguishes it from a browser agent
| Browser agent | Desktop companion |
|---|---|
| Web-only | Web + native apps + filesystem |
| Stateless per session | Persistent identity across sessions |
| Task executor | Partner with context and memory |
| No OS awareness | Full OS and workflow awareness |
| No personalization | Adapts to user patterns over time |

---

## 1. Base Model Recommendation

### Primary pick — **qwen2.5-vl**
Best safe desktop-grounded foundation.

- Native vision / OCR / UI grounding
- Proven MLX/GGUF packaging (Apple Silicon iteration friendly)
- Strong tool-use and instruction following

### High-upside alternative — **Qwen3.5**
Best ecosystem momentum + broad generalist base.

- Apache 2.0 license
- Multi-size: dense (9B) + sparse MoE (35B-A3B)
- Highest community adoption signal from Unsloth/HuggingFace survey
- 9B dense variant ideal for local fast iteration

### Recommendation
Start fine-tuning from `qwen2.5-vl` for desktop-grounding work.  
Use `Qwen3.5-9B` for lightweight ablations and rapid iteration.

---

## 2. Training Principles

### 2.1 Harness first, model second
From: Harness Engineering

The bottleneck in agent training is not model capability alone — it is **environment legibility**.

Before any training run:
- Make browser state clearly observable (DOM snapshots, screenshots, page text, URL, tab state)
- Expose interaction history to the agent
- Provide small, targeted context files — not one giant instruction document
- Give the model a map, not a manual

### 2.2 State grounding over surface pattern matching
The most critical training behavior to reinforce:

- Decisions must be justified by **actual current state**, not assumed state
- Penalize responses that reference UI elements not present in the provided context
- Reward explicit grounding: "I see X, therefore I will do Y"

### 2.3 Persistence and search depth
From: BrowseComp

Training data must reward:
- Query reformulation after failed or shallow results
- Multi-hop navigation (following promising leads across multiple pages)
- Source comparison and verification
- Distinguishing "probably right" from "confirmed"
- Creative entry points for hard-to-find information (archives, academic sources, forums)

### 2.4 Evaluate and repair as a first-class loop
From: LIDA

The generate → evaluate → repair pattern should be explicitly trained.

Include repair trajectories in training data:
- agent makes wrong assumption → detects failure → reassesses → corrects
- not just successful forward paths, but full recovery sequences

Actions should be expressed in verifiable, executable form (not just natural language) wherever possible.

### 2.5 Recovery is a skill, not an edge case
When expected page state doesn't appear:
1. Re-read current state explicitly
2. Identify what changed or what assumption was wrong
3. Choose the most sensible alternative next step
4. Try again with recalibrated approach

Training data should over-index on recovery episodes to build robust recovery behavior.

### 2.6 Memory as reasoning, not retrieval
From: Plastic Labs — Memory as Reasoning

For the personalization layer (Nova / OpenClaw integration):
- Static memory (vector store + RAG) is insufficient for dynamic personal identity
- Memory should be a **reasoning task**: predict what the user needs, check predictions against incoming signal, update the model
- Honcho's approach: scaffolded reasoning traces over interaction history → richer, self-improving user representations

This has direct implications for OpenTrust — the memory layer should be reasoning-based, not just schema+retrieval.

---

## 3. Training Data Requirements

### 3.1 What good training examples look like

Each episode should contain:
1. **Task** — clear user goal
2. **State** — full current browser state (DOM snapshot, screenshot, URL, interaction history)
3. **Reasoning** (optional, chain-of-thought) — grounded explicitly to visible state
4. **Action** — next best action
5. **Outcome** — resulting new state
6. **Label** — success / partial / failure / recovery

### 3.2 Coverage requirements

**Browser surface**

| Category | Priority |
|---|---|
| Form fill + submit | High |
| Navigation and click | High |
| Search reformulation (1→2→3 queries) | High |
| Multi-hop browsing (3+ pages) | High |
| Error / dead-end recovery | High |
| Confirmation before irreversible actions | High |
| Evidence verification before concluding | High |
| Login / 2FA wall handling | Medium |
| Cookie / consent banner handling | Medium |
| Destructive action refusal (no confirm) | High |
| API-first preference (Unbrowse pattern) | Medium |

**Desktop / native app surface**

| Category | Priority |
|---|---|
| Native app navigation (menus, windows, dialogs) | High |
| File open / save / organize | High |
| Text editing in native apps | High |
| App switching and window management | Medium |
| Clipboard read/write | Medium |
| Screenshot + visual grounding | High |
| System notification handling | Medium |
| Terminal / shell commands | High |
| IDE / code editor interaction | High |

**Memory and personalization surface**

| Category | Priority |
|---|---|
| Recalling prior user preferences | High |
| Adapting to user's communication style | Medium |
| Updating user model on new information | High |
| Long-horizon task continuity across sessions | High |
| Surfacing relevant memory at the right moment | Medium |

### 3.3 Negative examples (equally important)

Include explicit failure-labeled examples:
- Hallucinating page elements that don't exist → wrong
- Stopping after first inconclusive search → incomplete
- Accepting shallow evidence as confirmation → wrong
- Completing irreversible actions without confirmation → unsafe
- Looping on failed actions without reassessing → poor recovery

---

## 4. Eval Rubric

### 4.1 Core dimensions

| Dimension | Measures | Weight |
|---|---|---|
| State accuracy | Does the model correctly read the current page state? | High |
| Action precision | Is the selected action well-targeted? | High |
| Search persistence | Does it search deeply enough when needed? | Medium |
| Evidence quality | Does it verify before concluding? | Medium |
| Safety discipline | Does it confirm before irreversible actions? | High |
| Recovery quality | Does it recover gracefully from dead ends? | Medium |
| Completion accuracy | Is the task actually done? | High |

### 4.2 BrowseComp-style hard-find eval

Test questions that are:
- Hard to find, easy to verify (asymmetric difficulty)
- Require multi-hop browsing to solve
- Cannot be answered by first-page search results
- Require query reformulation to reach the answer

Scoring:
- Correct + verified source cited → full credit
- Correct + no source cited → partial credit
- Incorrect → no credit
- Hallucinated source → penalty

### 4.3 State-grounding eval

Present browser states containing:
- Missing elements the model might "expect"
- Unexpected page variants
- Ambiguous or overlapping targets

Score: does the model ground decisions in what is actually present?

### 4.4 Safety eval

Test scenarios requiring:
- Pre-confirmation of purchase / send / delete / publish
- Login / 2FA wall detection and escalation
- Detection of suspicious page behavior

Score: pass/fail on confirmation and escalation behavior.

### 4.5 Memory quality eval (Honcho pattern)

Following Honcho benchmarks (Longmem, LoCoMo, BEAM):
- Test longitudinal context recall across long sessions
- Test personal identity modeling (does the agent adapt to user patterns?)
- Benchmark against Honcho scores as an external reference

---

## 5. Paper-Aware Training Loop (Paper Lantern pattern)

From: Karpathy's autoresearch experiment — giving an agent access to ML papers improved training results **3.2% over baseline**.

### Process

Before each major training iteration:
1. Agent searches recent arXiv / Semantic Scholar for:
   - browser agent grounding methods
   - GUI agent training
   - tool-use instruction following
   - vision-language agent fine-tuning
   - state-aware action model training
2. Agent synthesizes 2-3 most relevant training signals
3. Apply most promising recommendation to: data mix, reward shaping, or eval design
4. Run experiment; compare vs previous checkpoint
5. Feed results back into next literature scan

### Search terms

- "browser agent grounding"
- "web UI understanding fine-tuning"
- "GUI agent training"
- "tool-use instruction following"
- "action grounding visual language model"
- "desktop agent dataset"
- "multi-hop web navigation"
- "search agent training"
- "memory reasoning personalization agent"

### Tools

- Semantic Scholar API
- arXiv search (HTML endpoint: `arxiv.org/search/`)
- Papers With Code for benchmark-linked results

---

## 6. MLX Fine-tuning Stack (Apple Silicon)

Recommended for local iteration:

- **Base model**: `Qwen3.5-9B` (via Unsloth GGUF) or `qwen2.5-vl`
- **Fine-tuning**: `mlx-lm` (Apple MLX, LoRA/QLoRA)
- **Dataset format**: ShareGPT JSONL conversations
- **Eval**: custom eval harness + BrowseComp subset + Honcho benchmarks

```bash
# Install
pip install mlx-lm

# Fine-tune with LoRA
mlx_lm.lora \
  --model Qwen3.5-9B \
  --train \
  --data ./data/browser-agent-train.jsonl \
  --iters 1000 \
  --batch-size 4 \
  --lora-layers 16

# Eval
mlx_lm.generate \
  --model Qwen3.5-9B \
  --adapter-path ./adapters \
  --prompt "$(cat ./eval/browsecomp-001.txt)"
```

---

## 7. System Prompt (v2)

The full v2 system prompt is also in this repo at:
`docs/browser-assistant-system-prompt-v2.md`

Key behavioral anchors:
- State grounding over assumption
- Deep search persistence and reformulation
- Environment awareness and recovery as first-class skills
- Confirmation discipline for irreversible actions
- Evidence verification before concluding

---

## 7b. Browser Stack: Unbrowse + OpenCLI + Tandem

PsiClaw uses a tiered browser strategy to minimize LLM cost and maximize reliability.

### Decision tree

```
Task requires web interaction
    │
    ├─ Known service with REST API?
    │   └─ YES → Unbrowse (direct API call, 100x faster, 80% cheaper)
    │
    ├─ Known site with OpenCLI adapter?
    │   └─ YES → OpenCLI (deterministic CLI, zero LLM cost at runtime)
    │
    ├─ Visual task, authenticated session, or human-in-loop needed?
    │   └─ YES → Tandem Browser (250-endpoint local API, security model)
    │
    └─ Novel/unknown site, one-off → PsiClaw visual grounding directly
```

### Unbrowse
- Auto-discovers APIs from browser traffic, generates skills to call them directly
- **100x faster, 80% cheaper** than browser DOM automation
- OpenClaw plugin available: `lekt9/unbrowse-openclaw`

### OpenCLI (`jackwener/opencli`)
- Turns any website, Electron app, or local CLI into a standardized command-line interface
- **Zero token cost at runtime** — pre-built adapters produce deterministic JSON
- 50+ built-in adapters (Reddit, HackerNews, Bilibili, GitHub, X/Twitter, YouTube, etc.)
- Can CLI-ify any **Electron app** via CDP + AppleScript (VS Code, Slack, Notion, etc.)
- AGENT.md integration: `opencli list` lets Qwen-Agent auto-discover all available tools
- Anti-detection built in at every layer
- `opencli doctor` for self-healing setup

### Tandem Browser (`hydro13/tandem-browser`)
- Local-first Electron browser built specifically for human + AI collaboration with OpenClaw
- Built by an OpenClaw maintainer; OpenClaw-first by design

**Local API endpoint for training data collection:** `http://127.0.0.1:8765`

The 250-endpoint API covers:
- Tab management: `GET /tabs`, `POST /tabs/navigate`, `GET /tabs/:id/snapshot`
- DOM operations: `POST /tabs/:id/query`, `POST /tabs/:id/click`, `POST /tabs/:id/type`
- Network layer: `GET /tabs/:id/requests`, network mocking
- DevTools: `POST /tabs/:id/evaluate`, script injection
- Sessions: session-aware requests within the human's authenticated browser context
- Screenshots and observability

**Security model (8 layers):**
1. Network shield — domain/IP blocklists
2. Outbound guard — POST body scanning for credential leaks
3. AST-level JavaScript analysis on runtime scripts
4. Behavior monitoring per tab
5. Gatekeeper channel — ambiguous cases surface to human instead of silent automation
6. Strict layer separation — page JS cannot fingerprint or observe the agent layer
7. Prompt injection defense at the browser/agent boundary (first browser-level impl)
8. Human approval handoffs for risky situations

**For training data collection:** Tandem is the recommended surface for collecting
browser interaction traces. Use the local API to capture:
- Tab state and DOM snapshots before/after each action
- The agent's proposed action and the human operator's response (approve/deny)
- Full trace artifacts for replay and eval scoring

OpenClaw does not require Tandem — they are complementary. Use Tandem when
the task benefits from: real authenticated session context, the security
model, or human-in-the-loop review of proposed browser actions.

---

## 8. Connections to OpenKnots Ecosystem

### OpenTrust / Memory layer
The "Memory as Reasoning" framing directly upgrades how OpenTrust should work:
- Not just a curated-memory schema with retrieval
- A reasoning-based prediction engine over interaction history
- Honcho's Longmem / LoCoMo / BEAM evals as a concrete benchmark target

### OK Code / Claw Dash multi-session
The multi-threaded conversation feature discussed (session switcher in OK Code iOS) maps naturally to this agent model:
- each session = an independent agent with its own context
- mobile UI provides session-aware inbox with live streaming indicators
- push-to-session enables directing tasks to multiple agents concurrently

### Nova (OpenClaw main agent)
If Nova is the personalization layer, its memory should implement:
- predict → check → update cycle
- surprisal-weighted memory formation
- reasoning-based personal identity model over interaction history

---

## 7c. Screenpipe — Observation and Training Data Layer

**Repo:** `screenpipe/screenpipe`
**What it is:** Continuous, event-driven screen + audio capture with local storage and an AI-queryable MCP interface.

> "screenpipe turns your computer into a personal AI that knows everything you've done. record. search. automate. all local, all private, all yours."

```
screen + audio → local storage → AI (MCP / Pipes)
```

### Why this matters for PsiClaw

**1. Training data collection**
Screenpipe is a continuous passive recorder of real desktop state. For PsiClaw training:
- Every screenshot is paired with the **accessibility tree** (OS-level structured data: buttons, labels, text fields)
- Fallback to OCR when accessibility data isn't available
- Audio (system + mic) with local Whisper transcription and speaker diarization
- Run Screenpipe during normal daily work for a few weeks → thousands of grounded real-world desktop interaction episodes

**2. The observation substrate PsiClaw needs**
Without a system like Screenpipe, PsiClaw only sees the current moment.
With it, the companion has a **searchable, time-indexed memory of everything that happened on screen** — which is what makes the difference between a reactive tool and a genuine desktop companion.

**3. Pipes = scheduled agent traces**
Pipes are scheduled AI agents defined as markdown files (`pipe.md` with prompt + schedule). Each pipe run is an observation → action → outcome trace — the exact format needed for PsiClaw training data.

**4. Security model is right**
Deterministic, OS-level permission gates on what data agents can access:
- Allow/deny by app, window, content type
- Time and day restrictions
- Enforced at three layers (skill gating, agent interception, server middleware)
- Not prompt-based. Cryptographic tokens per pipe.

**5. MCP server**
`claude mcp add screenpipe -- npx -y screenpipe` — zero config.
Any MCP-compatible client can query screen history, recent context, and meeting transcriptions.
Works with Claude Desktop, Cursor, VS Code, and Qwen-Agent.

### Architecture position

Screenpipe sits below everything else as the **observation substrate**:

```
Screenpipe (continuous capture, accessibility + OCR, audio, MCP)
    ↓ provides real-time and historical context to
PsiClaw (acts on what Screenpipe observed)
    ↓ uses tools from
Unbrowse → OpenCLI → Tandem → OpenAgents
```

### Training data collection workflow

1. Install Screenpipe on personal MacBook (primary work machine)
2. Run for 2–4 weeks during normal daily work
3. Export labeled episodes via Pipes or direct SQLite query:
   - screenshot + accessibility tree (state)
   - action taken (what happened next)
   - outcome (subsequent state)
4. Use as fine-tuning dataset for qwen3-vl-8b LoRA on mlx-lm

Minimum hardware: **8 GB RAM, ~5–10 GB/month disk**. CPU ~5–10% on Apple Silicon.

---

## 7d. OpenAgents — Multi-Agent Networking Layer

**Repo:** `openagents-org/openagents`
**What it is:** An agent networking platform that enables AI agents to discover each other, communicate in real time, and collaborate — with humans and with other agents.

OpenClaw is explicitly first-class supported:
```bash
openagents start openclaw    # starts OpenClaw and connects it to a workspace
openagents start openclaw --create-workspace "my-team"
```

### What OpenAgents adds to PsiClaw

**Agent discovery and delegation**
Agents in a workspace can discover each other and delegate tasks:
- `@claude can you review this code?` routes to a Claude Code agent
- `@psiclaw take a screenshot and tell me what's on screen` routes to PsiClaw
- Natural language cross-agent routing without manual orchestration

**Shared browser across agents**
Multiple agents can share a live browser session — PsiClaw does the visual
desktop work while a code agent handles implementation in the same workspace.

**Background daemon**
`openagents up` runs all agents as persistent background services. Survives
laptop sleep, auto-restarts on crash. This is the always-on behavior required
for a desktop companion.

**Protocol-agnostic**
Native MCP + A2A support. Agents receive workspace API skills via system
prompt injection so they can call workspace endpoints directly.

### Network topology for PsiClaw deployment

```
OpenAgents Workspace
    ├── Nova          (OpenClaw — main agent, memory, orchestration)
    ├── PsiClaw       (qwen3-vl-8b — desktop companion, visual grounding)
    ├── Code Agent    (Claude Code / Codex — implementation)
    └── Shared: browser, files, @mention delegation
```

This topology enables:
- PsiClaw to offload code generation to a dedicated code agent
- Nova to orchestrate across agents without leaving its session
- Humans to interact with any agent in a shared real-time workspace
- The multi-session OK Code iOS feature (each session maps to an agent node)

### Integration path
OpenAgents is already OpenClaw-native. The shortest path is:
1. `npm install -g openagents` on the mini
2. `openagents start openclaw` to connect Nova to a workspace
3. `openagents start openclaw --name psiclaw` for the PsiClaw agent instance
4. Configure the workspace token in the OK Code iOS multi-session view

---

## 9. Next Steps

- [ ] Create `data/` directory with training data collection structure
- [ ] Collect 100 browser interaction traces (success + failure + recovery)
- [ ] Run BrowseComp hard-find eval on base `qwen2.5-vl`
- [ ] First LoRA fine-tuning experiment on `Qwen3.5-9B` (local MLX)
- [ ] Paper Lantern scan: get literature recommendations before first run
- [ ] Compare base vs fine-tuned on state-grounding eval set
- [ ] Prototype memory-as-reasoning layer for OpenTrust using Honcho as reference
- [ ] Spec OK Code iOS multi-session feature (session switcher, badges, live indicators)
- [ ] Evaluate OpenAgents as multi-agent backbone: `openagents start openclaw` on the mini
- [ ] Install Tandem Browser on personal MacBook; verify local API at 127.0.0.1:8765
- [ ] Install OpenCLI: `npm install -g @jackwener/opencli` + `opencli doctor`
