// ─── PsiClaw Demo Data ─────────────────────────────────────────────────────
// Updated: 2026-03-30
// Model: qwen3-vl-8b (MLX 4BIT / 8BIT)
// Agent framework: Qwen-Agent
// Distribution: OpenClaw desktop companion mode

export const navItems = [
  { href: "/", label: "Overview" },
  { href: "/console", label: "Operator Console" },
  { href: "/gym", label: "Desktop Gym" },
  { href: "/traces", label: "Traces" },
  { href: "/evals", label: "Evals" },
];

export const capabilityCards = [
  {
    title: "Desktop-aware observation",
    description:
      "PsiClaw reads the full desktop surface: browser tabs, native apps, active windows, focused elements, and system state — all as structured context for the model.",
  },
  {
    title: "API-first, browser as fallback",
    description:
      "When a web service has a discoverable API, PsiClaw calls it directly. DOM automation is the fallback for visual-only tasks, keeping execution fast and reliable.",
  },
  {
    title: "Persistent identity via OpenTrust",
    description:
      "User preferences, working patterns, and long-term context are reasoned over — not just retrieved. PsiClaw learns you across sessions, not just within them.",
  },
];

export const workflowSteps = [
  "Observe current desktop state: active windows, browser state, running processes, clipboard, and recent interaction history.",
  "Determine whether an API skill is available for the target action. Prefer direct API over DOM automation when possible.",
  "Propose the next action with confidence, rationale, and risk level. Request approval for irreversible or high-impact steps.",
  "Execute in a scoped, observable way. Re-read state after each action before deciding the next step.",
  "Capture the full trace — observation, reasoning, action, outcome — for replay, evals, and future fine-tuning.",
];

export const consoleStats = [
  { label: "Active desktop sessions", value: "12", change: "+3 today" },
  { label: "Approval queue", value: "04", change: "2 high priority" },
  { label: "Task success rate", value: "93.4%", change: "+4.2% this week" },
  { label: "Mean intervention time", value: "11s", change: "-6s vs baseline" },
];

export const observedApps = [
  {
    name: "Safari",
    state: "Focused",
    detail: "GitHub PR review tab active · 1 form detected · login wall resolved",
  },
  {
    name: "VS Code",
    state: "Observed",
    detail: "psi-claw repo open · TypeScript file in focus · no unsaved changes",
  },
  {
    name: "Terminal",
    state: "Observed",
    detail: "pnpm dev running · no elevated prompt · stdout streaming",
  },
  {
    name: "Slack",
    state: "Muted",
    detail: "Unread badge present · async update thread · no required action",
  },
];

export const proposedActions = [
  {
    title: "Call GitHub API: list open PRs",
    confidence: "98%",
    risk: "Low",
    reason:
      "API skill available for github.com. Calling the REST API directly is faster and more reliable than navigating the PR list via browser DOM.",
  },
  {
    title: "Submit Thursday async update",
    confidence: "84%",
    risk: "Medium",
    reason:
      "Form fields are filled and validated. Final submission is irreversible — requesting operator confirmation before executing.",
  },
  {
    title: "Dismiss Slack notification modal",
    confidence: "72%",
    risk: "Needs review",
    reason:
      "Modal content is partially obscured by overlapping window. Safe dismissal is likely but state is ambiguous — surfacing for review.",
  },
];

export const desktopWindows = [
  {
    title: "Safari · github.com/PsiClaw/psi-claw",
    subtitle: "Frontmost · PR #12 open · API skill active",
    chips: ["API call ready", "No DOM scrape needed", "Low risk"],
  },
  {
    title: "VS Code · psi-claw",
    subtitle: "Background · clean working tree",
    chips: ["No unsaved changes", "TypeScript active", "Editable repo"],
  },
  {
    title: "Terminal · psi-claw dev server",
    subtitle: "Background process healthy",
    chips: ["pnpm dev running", "No sudo", "Port 3000"],
  },
];

export const taskScenarios = [
  {
    name: "Review and merge PR",
    status: "Ready",
    objective:
      "Use GitHub API skill to fetch PR diff, summarize changes, run eval on code quality, then request operator approval before merging.",
  },
  {
    name: "Draft Thursday async update",
    status: "Running",
    objective:
      "Read recent memory files and retrospection logs, populate the Ritual Foundation update form fields, and confirm with operator before submission.",
  },
  {
    name: "Desktop cleanup: Downloads folder",
    status: "Queued",
    objective:
      "Observe Downloads folder state, categorize files, propose reversible moves to appropriate directories. No deletes without confirmation.",
  },
  {
    name: "Cross-app: Commit and notify team",
    status: "Drafting",
    objective:
      "Stage changes in VS Code, compose commit message, push via terminal, then compose a brief Slack thread update — all with operator approval at irreversible steps.",
  },
];

export const traceEvents = [
  {
    step: "01",
    event: "Desktop snapshot captured",
    detail:
      "Desktop graph encoded: 4 windows, 28 actionable elements, 0 permission prompts. Active focus: Safari · PR review tab.",
    status: "Observed",
  },
  {
    step: "02",
    event: "API skill match found",
    detail:
      "Target site github.com has a registered API skill. Policy engine routes to direct API call instead of browser DOM automation.",
    status: "Reasoned",
  },
  {
    step: "03",
    event: "Action proposed: call GitHub API",
    detail:
      "GET /repos/PsiClaw/psi-claw/pulls?state=open — confidence 98%, blast radius: none. No approval required under current policy.",
    status: "Auto-approved",
  },
  {
    step: "04",
    event: "Result processed",
    detail:
      "3 open PRs returned. Ranked by priority. Trace hash saved as training artifact. Proposed next action: display summary to operator.",
    status: "Complete",
  },
];

export const evalRows = [
  {
    suite: "Browser form fill",
    success: "88%",
    interventions: "1.4 / run",
    note: "Needs better handling for auth flows and dynamic modals.",
  },
  {
    suite: "API-first routing",
    success: "96%",
    interventions: "0.2 / run",
    note: "Strong skill matching. Fallback to DOM when API unavailable works correctly.",
  },
  {
    suite: "Native app navigation",
    success: "81%",
    interventions: "1.9 / run",
    note: "Main frontier area. Cross-app workflows need more training data.",
  },
  {
    suite: "Terminal safety",
    success: "99%",
    interventions: "0.1 / run",
    note: "Excellent detection of risky commands and irreversible writes.",
  },
  {
    suite: "Confirmation discipline",
    success: "100%",
    interventions: "— / run",
    note: "No irreversible action executed without operator approval in any run.",
  },
  {
    suite: "Memory + personalization",
    success: "72%",
    interventions: "0.8 / run",
    note: "OpenTrust layer reduces redundant questions over time. Still improving.",
  },
];
