# Agentic Harness Engineering: Observability-Driven Automatic Evolution of Coding-Agent Harnesses

**Agentic Harness Engineering (AHE)** · preprint 2026

Read: [PDF](https://arxiv.org/pdf/2604.25850) · [arXiv](https://arxiv.org/abs/2604.25850)  
Code: [agentic-harness-engineering](https://github.com/china-qijizhifeng/agentic-harness-engineering)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- A closed loop that evolves coding-agent harnesses.
- Three kinds of observability: editable components as files, distilled trajectory evidence, and edits paired with checked predictions.
- Automatic harness engineering; its edits' predicted fixes beat a random baseline, but most regressions go unforeseen (§4.4.2).

## In plain words

A coding agent is an LLM plus a harness: the prompts, tools and control code. The authors say harness design shifts task completion on long-horizon coding benchmarks even with the model fixed, that a harness tuned for one model often underperforms on another, and that hand-tuning "struggles to keep pace" with new models (§1). Agentic Harness Engineering (AHE) is a loop where LLM agents run a coding agent, summarize its logs, and edit the harness files; each edit carries a prediction of which tasks it will fix or break, checked in the next round (abstract, §3).

On Terminal-Bench 2 (89 command-line tasks), ten rounds from a shell-only harness raise the per-attempt success rate from 69.7% to 77.0% with GPT-5.4 at high effort, above the hand-built Codex (71.9%) and two self-evolving methods (abstract). Frozen, the harness also gains on three other model families, and on SWE-bench-verified (GitHub issue fixes) reaches the highest success of the compared harnesses with 12% fewer tokens than its seed (abstract). The authors present a new formulation, "agent-driven harness evolution", and a method (§1).

## Background and terms

**Terms to know:** [agent harness](#/glossary/agent-harness) · [pass@k](#/glossary/passk) · [reflective prompt optimization](#/glossary/reflective-prompt-optimization)

**The paper's own terms:**
- **harness**: the "model-external, editable components" around the model: system prompt, tools, middleware (§1).
- **seven component types**: system prompt, tool description, tool implementation, middleware (code hooked into the agent loop that can inspect or change model and tool calls), skill (a workflow package loaded on demand), sub-agent configuration, long-term memory (a file of persistent cross-session knowledge), each a file at a fixed place in one workspace (§3.1; App. B.2 table).
- **NexAU**: the agent framework the harness runs on (§3.1). **NexAU₀** is the seed harness: one `bash` tool, no skills, no middleware, no long-term memory (App. A).
- **the three role agents**: the **Code Agent** (solves the benchmark tasks), the **Agent Debugger** (analyses its traces) and the **Evolve Agent** (edits the harness) (§4.1); a one-shot **Explore Agent** seeds a few skills from the NexAU source and public coding-agent references in iteration 1 (§3.3).
- **component, experience and decision observability**: the three "pillars" (abstract). Component: every editable part is a file, each logical edit one git commit (§3.1). Experience: traces are distilled into per-task analysis reports and one benchmark-level overview, with the original traces kept for drill-down (§3.2). Decision: every edit is recorded with a prediction (§3.3).
- **change manifest**: per round, one entry per edit naming "the failure evidence, the inferred root cause, the targeted fix, and a predicted impact comprising both expected fixes and at-risk regressions" (§3.3); the next round intersects these with observed task-level changes to give a per-edit verdict.
- **progressive disclosure**: serving reports and traces as files the agent opens as needed, which the authors say "saves on tokens" (§3.2).
- **pass@1**: here the mean binary success over k rollouts per task; timed-out and infrastructure-aborted trials count as failures (§4.1, App. A Eq. 1). **tokens/trial**: mean prompt-plus-completion tokens per trial, in thousands, excluding aborted and timed-out trials (§4.1). **Succ/Mtok**: expected successes per million tokens (App. A Eq. 2). **pp**: percentage points.
- **fix and regression precision/recall**: the round-N−1 predicted fix (or regression) task sets scored against the round-N outcomes over the 89 tasks (§4.4.2).

**Builds on:**
- NexAU, the substrate framework (§3.1), and the Agent Debugger framework for exploring trajectories as files (§3.2); neither is on this site.
- Evolution agents that optimize harness parts from experience, such as GEPA ([GEPA](#/papers/agrawal2025gepa "GEPA: Reflective Prompt Evolution Can Outperform Reinforcement Learning (2026)")), ACE ([ACE](#/papers/zhang2025ace "Agentic Context Engineering: Evolving Contexts for Self-Improving Language Models (2026)")) and Training-Free GRPO (§1; [GRPO](#/glossary/grpo) is an RL training algorithm); the authors say most focus on a single component: typically the prompt, skills, or an in-context playbook (§1).
- ACE (which "distills natural-language playbooks the agent reads in-context") and Training-Free GRPO, TF-GRPO ("a trajectory-feedback variant of GRPO that reinforces successful tool sequences") are the self-evolving baselines (§4.2).

## Problem and setting

The question: how can an evolution agent jointly and stably evolve all editable components of a coding agent's harness (§1)? The authors' "central insight" is that this is "bottlenecked by observability, not by agent capability" (§1).

- **Fixed:** the base model; only the harness is edited (§3).
- **Benchmarks:** evolution runs on "the full 89 tasks of Terminal-Bench 2" (4 easy, 55 medium, 30 hard by the official labels), with a per-task timeout of 1 hour (§4.1). Transfer is tested on SWE-bench-verified, which §4.1 describes as "500 tasks across seven repositories".
- **Correct** means the benchmark's verifier passes the task; Harbor (the task dispatcher) runs each rollout in a fresh E2B remote sandbox (a cloud sandbox, so shell side-effects cannot leak between tasks) and verifies pass or fail (App. A).
- **Models:** §4.1 says all three role agents share GPT-5.4 "at the high reasoning setting". Transfer re-evaluates the Code Agent on GPT-5.4 at the medium and xhigh reasoning-effort settings, qwen-3.6-plus, gemini-3.1-flash-lite-preview and deepseek-v4-flash (§4.1).

## Approach

Each round of Algorithm 1 (§3.3): roll out the current harness (k rollouts per task), clean the traces, check the previous round's manifest against the new outcomes and roll back rejected edits, run the Agent Debugger, let the Evolve Agent edit the workspace and write a new manifest, and commit to git; the best-scoring harness is returned.

- **Controllability (§3.3):** the Evolve Agent writes only in the harness workspace; "the runs directory, tracer, verifier, and LLM configuration are read-only" and the seed system prompt is marked non-deletable, which the authors say blocks shortcuts "such as disabling the verifier".
- **Evidence-driven edits (§3.3, App. B.2):** each edit must cite failure evidence and a root cause and predict fixes and risks; the prompt also forbids task-specific logic and reverse-engineering tests from trajectories.
- **Minimal seed (§3.1):** the authors argue a seed fitted to the benchmark "would contaminate every subsequent edit's attribution".
- **k ≥ 2 rollouts per task (§3.3)** so partially passing tasks can be compared; the reference run uses k = 2 and ten iterations (Tab. 4).

## Results

The authors report (one campaign, "the best resulting configuration is reported as AHE", §4.2):

- **Main result (Tab. 1, Fig. 1):** pass@1 on Terminal-Bench 2 rises from 69.7% (seed) to 77.0%, against the human-designed harnesses OpenCode (an open-source coding agent), Terminus-2 and Codex (OpenAI's Codex CLI, 71.9%), and the self-evolving baselines ACE (68.9%) and TF-GRPO (72.3%). The authors say the gain "accumulates across iterations" (Fig. 1, §4.2), though the per-iteration curve has "non-monotone steps" (§4.4.2). The authors say the only exception by difficulty is the Hard tier, where AHE "marginally trails Codex" (§4.2), and trace it to interference between components on long-horizon tasks, since memory alone in the seed beats Codex on Hard.
- **Cross-benchmark transfer (Tab. 2, §4.3):** on SWE-bench-verified, with GPT-5.4 and no re-evolution, AHE has the highest aggregate success, while ACE and TF-GRPO fall below the seed in aggregate success. AHE cuts aggregate tokens by 32% against ACE, 21% against TF-GRPO and 12% against the seed. The authors place the gain on django and sphinx-doc, "the two largest and most token-expensive repositories"; "Marginal regressions appear only on the three smallest repositories".
- **Cross-model transfer (Fig. 3, §4.3):** all five alternate bases gain over the seed on the same base; the cross-family gains are +5.1 to +10.1 pp, larger than the gains on GPT-5.4 medium and xhigh. The authors read the magnitude as tracking "the evolution operating point rather than raw base capability", since step budget and timeout were fitted to GPT-5.4 high (§4.3).
- **Component ablation (Tab. 3, §4.4.1)**: swapping one evolved component into the seed, memory, tools and middleware each beat the seed, while the system prompt alone regresses; the authors infer that "factual harness structure transfers across tasks and models whereas prose-level strategy does not" (§1). The three positive single-component gains sum to +11.1 pp against full AHE's +7.3 pp, which they read as non-additive interaction; memory alone exceeds full AHE on Hard.
- **Self-attribution (Fig. 4, §4.4.2, App. D)**: fix predictions are well above a random-prediction baseline (fix precision 33.7% against 6.5%), but regression predictions are much closer to it (regression recall 11.1% against 5.4%), so "most upcoming regressions go unforeseen". The authors say this blindness "is what produces the non-monotone steps in the evolution curve".
- **Case study (App. C):** four tasks traced from failure to fix across iterations 2, 5, 6 and 8, with the manifest entries behind them, e.g. a shell-tool guard that blocks deleting verified output files.

## Limits the authors state

- "This work studies a promising but high-variance setting, and the scope of our claims should be interpreted accordingly" (Limitations).
- Evolution is on Terminal-Bench 2 and transfer is probed on SWE-bench-verified; "broader programming languages, repository-scale deployments, and human-in-the-loop workflows remain untested" (Limitations).
- Step budget and timeout were fitted to GPT-5.4 high, so "cross-model transfer numbers conflate harness portability with operating-point coupling" (Limitations, §4.3).
- AHE "does not provide a complete guardrail stack"; "Long-horizon harness cleanup and stronger misuse prevention remain incomplete", and it is "a controlled research prototype rather than a fully mature autonomous self-improvement system" (Limitations).
- Components interact non-additively, so "stacking effective edits caps the aggregate gain" (§1); the Evolve Agent converges to a Medium-heavy trade-off that gives back part of the Hard memory effect, because the aggregate is dominated by the 55 Medium tasks (§4.4.1).

## Open problems and building blocks

  - Regression foresight: "Closing this gap is the clearest direction for future self-evolution loops" (§4.4.2; also §1).
  - "we leave interaction-aware evolution to future work" (§4.4.1).
  - "Untangling these factors will require re-running the loop under multiple operating points" (Limitations).
- **Released:** the title page links the authors' GitHub repository, and App. B says its prompts reproduce the files "in the public repository" at the commit behind the experiments.
- **To reuse it:** GPT-5.4 for all agents with per-agent reasoning tiers and limits (Tab. 4); the NexAU framework, Harbor and E2B sandboxes (App. A); k = 2 rollouts on 89 tasks per round with 96 concurrent rollouts (Tab. 4); the ten-iteration campaign took "roughly 32 hours" (§4.2).

## On this site

- **Discussed in:** [Can a memory across problems be checked before it is reused?](#/challenges/verified_memory) · [Weak checkers get exploited](#/challenges/weak_checker_exploitation)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/harness-general">harness-general</a><a class="tag sub" href="#/tags/harness-promptopt">harness-promptopt</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/promptopt-context">promptopt-context</a><a class="tag sub" href="#/tags/promptopt-feedback">promptopt-feedback</a><a class="tag sub" href="#/tags/promptopt-general">promptopt-general</a></span>
