# Rethinking the Evaluation of Harness Evolution for Agents

**Rethinking the Evaluation of…** · preprint 2026 (v4)

Read: [PDF](https://arxiv.org/pdf/2607.12227) · [arXiv](https://arxiv.org/abs/2607.12227)  
Code: [harness-evolution](https://github.com/rethinking-harness-evolution/code)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Re-evaluates automatic harness evolution, where an LLM agent rewrites an agent's prompts, tools, memory and control code from task feedback (as Meta-Harness, AHE and AEVO do), against parallel sampling and sequential refinement at a matched budget, with and without unit-test feedback, on Terminal-Bench 2.1 with Claude Opus 4.6, GPT-5.4 and GPT-5.4 mini (abstract; §3; §4.1). It adds harness scaling, its own per-task variant that rewrites the harness for each task (§3.5).
- Tests transfer by evolving the harness on a training split and scoring it on held-out tasks (§4.4, Tab. 3), then turns to long-horizon games (ARC-AGI-3, EdgeBench), starting from engineered harnesses (VISTA, Claude Code, Codex CLI) and comparing harness scaling with sequential refinement (§5; Tabs. 4–5).
- Evidence on harness-code optimizers under matched budgets and held-out evaluation: the authors report that harness evolution "fails to outperform simple test-time scaling methods both with and without test cases" (abstract; Tabs. 1–2), that guided only by the agent's own judgment it lowers GPT-5.4's score (§4.2, Tab. 1), and that the evolved harness leaves the held-out average unchanged (§4.4, Tab. 3). The gains it reports are for its own per-task harness scaling on the games (abstract; §5).

## In plain words

An LLM agent works inside a harness: the prompts, tools, memory, checks and control code around the model. Recent methods let an agent rewrite its harness from task feedback and report gains on the benchmark they searched on. The authors argue these reports lack a comparison with spending the same budget on more attempts per task, and a test on unseen tasks, since the signals guiding the search, such as unit tests, come from the benchmark reported on (abstract; §1). At comparable budgets on Terminal-Bench 2.1 (command-line tasks), they report that harness evolution "fails to outperform simple test-time scaling methods both with and without test cases, and exhibits limited generalization" (abstract), test-time scaling meaning extra sampled or revised attempts. On long-horizon games (ARC-AGI-3's visual puzzles, EdgeBench's bot-writing tasks), starting from engineered harnesses, with fine-grained feedback and counting each run's best score (§5.1), their own per-task variant beats revising attempts under a fixed harness "by 80% on ARC-AGI-3 and by 11% on EdgeBench games under matched budgets" (abstract). They present it as a re-examination of the evaluation protocol (§1).

## Background and terms

**Terms to know:** [agent harness](#/glossary/agent-harness) · [test-time scaling](#/glossary/test-time-scaling) · [compute-matched comparison](#/glossary/compute-matched-comparison) · [pass@k](#/glossary/passk) · [LLM-as-a-judge](#/glossary/llm-as-a-judge) · [out-of-distribution generalization](#/glossary/out-of-distribution-generalization) · [agent skill](#/glossary/agent-skill)

**The paper's own terms:**
- **harness**: "the prompts, tools, memory, verification routines, and control logic through which a model observes tasks and acts" (§1); in §5 also skills, agent-written tools and hooks, which are event-triggered rules (App. B.1–B.2).
- **trajectory**: one run of the agent on a task (§3.1).
- **harness evolution**, two senses: the family of methods in which agents improve their harness (abstract; the "Automatic Harness Evolution" rows of Tabs. 1–2, holding both methods below), and the cross-task method **Harness Evolution** (§3.4). The abstract's "task-specific harness evolution" is Harness Scaling (§5.2–5.3).
- **parallel sampling** (§3.2): independent trajectories under a fixed harness; without unit tests a **self judge** (the agent itself) picks one, with tests any passing one is returned.
- **sequential refinement** (§3.3): each attempt sees a summary of the previous one (and its test result, when tests exist), under a fixed harness; the last attempt, or any passing one, is returned. In the glossary's terms, [self-correction](#/glossary/self-correction) over whole trajectories.
- **Harness Evolution** (§3.4): a **meta agent** reads summaries of earlier harnesses and their rollouts over a batch of tasks and writes the next shared harness; the result is the last harness (no tests) or the best-scoring one (tests).
- **Harness Scaling** (§3.5): the authors' variant that revises the harness for one task at a time, "a harness-level analogue of test-time scaling".
- **compute budget K** (§3.1, §4.1): trajectories (or harness versions) per task; 5 on Terminal-Bench.
- **RHAE** (Relative Human Action Efficiency; §5.2, App. B.1): ARC-AGI-3's score, per-level action efficiency against a human baseline, so both finishing levels and using few actions count. **Win rate** counts levels completed (App. B.1).
- **[VISTA*] / [VISTA] / [full harness]** (Tab. 4 caption): VISTA with memory evolution off, as published (evolves memory), and extended to evolve skills, tools and hooks.

**Missing glossary terms:** none.

**Builds on:**
- The harness-evolution methods whose evaluation it questions (§1; §2): Meta-Harness (Lee et al., 2026; [Meta-Harness](#/papers/lee2026metaharness "Meta-Harness: End-to-End Optimization of Model Harnesses (2026)")), Agentic Harness Engineering, AHE (Lin et al., 2026; [Agentic Harness Engineering (AHE)](#/papers/lin2026ahe "Agentic Harness Engineering: Observability-Driven Automatic Evolution of Coding-Agent Harnesses (2026)")), and AEVO (Zhang et al., 2026; not listed here). AHE is the one run (§3.4).
- Test-time scaling baselines (§2): Snell et al. (2024; [compute-optimal test-time scaling](#/papers/snell2024scaling "Scaling LLM Test-Time Compute Optimally can be More Effective than Scaling Model Parameters (2024)")); parallel sampling after Wang et al. (2022; [Self-Consistency](#/papers/wang2022selfconsistency "Self-Consistency Improves Chain of Thought Reasoning in Language Models (2023)")) and Brown et al. (2024; [Large Language Monkeys](#/papers/brown2024monkeys "Large Language Monkeys: Scaling Inference Compute with Repeated Sampling (2024)")); sequential refinement after Madaan et al. (2023), not listed here (§3.2–3.3).
- Starting harnesses for the games (§5.2–5.3): VISTA (Han et al., 2026; not listed here), a visual harness for ARC-AGI-3, and the vendor coding agents Claude Code CLI and Codex CLI.

## Problem and setting

- **Question** (§1): "Does harness evolution yield generalizable improvements in harness design, or are its gains primarily due to repeated sampling?"
- **Budget view** (§3; Fig. 1): a fixed model, a task and a budget; methods differ in what they update and what feedback they see, and each returns one final trajectory per task (§3.1).
- **Terminal-Bench 2.1** (§4.1): 89 terminal tasks, "a verified revision of Terminal-Bench 2.0". Models Claude Opus 4.6, GPT-5.4 and GPT-5.4 mini; "Unless otherwise noted", 128k generation tokens and high reasoning effort; averages over two runs. All methods start from AHE's initial harness (§4.1), "a single bash tool and nothing else" (App. A.1).
- **Feedback** (§4.2–4.3): without unit tests the agent judges itself; with them, the tests serve "both as feedback for iterative refinement and as an oracle for selecting the final trajectory" (§4.3).
- **Metrics** (App. A.1): pass@1, average success over rollouts; pass@k, share of tasks solved by at least one of k rollouts.
- **Held-out test** (§4.4): 45 training, 10 validation, 34 test tasks; only Harness Evolution is tested, as the other methods produce no reusable artifact.
- **Games** (§5.1): ARC-AGI-3, turn-based visual games whose goal the agent must infer (25 public games, 2,000 actions; §5.2), and EdgeBench's five "Interactive Games & Simulators" tasks, where the agent writes a game-playing bot the simulator scores (12 hours wall-clock, harness editing included; §5.3, App. C.1). Models: Claude Opus 4.8, GPT-5.6 Terra (ARC-AGI-3), GPT-5.4 (EdgeBench). Only Sequential Refinement and Harness Scaling are compared, on "the best score achieved throughout the entire trajectory" (§5.1).

## Approach

- **Four methods under one budget** (§3; Fig. 1): independent trajectories, revisions of a trajectory, shared harness updates across tasks, per-task harness updates.
- **Harness Evolution** is AHE with its explore agent (which retrieves benchmark-tuned harnesses from outside) disabled, "so that improvements come from evolving the harness on feedback" (§3.4; App. A.1).
- **Harness Scaling on ARC-AGI-3** uses VISTA's "free" mechanism: harness updates are tools (e.g. `read_skill`, `write_skill`) the agent may call at any point (§5.2).
- **On EdgeBench**, a "periodic" one: after three submissions or 120 minutes, whichever comes first, the meta agent pauses the agent and may edit the harness or leave it (§5.3).

## Results

- **Without unit tests** (Tab. 1, §4.2): average pass@1 is 72.3 for parallel sampling, 71.8 Harness Scaling, 69.3 sequential refinement, 67.4 Harness Evolution, against 68.2 for one attempt. Harness Evolution drops GPT-5.4 from 75.3 to 69.7, which the authors read as "iterative harness revision can actively hurt a strong model when the revision process is guided only by the agent's own judgment".
- **With unit tests** (Tab. 2, §4.3): parallel sampling has the best average pass@1 (82.0); on pass@5 sequential refinement leads with 87.1, against 85.6 for Harness Scaling and 79.0 for Harness Evolution. Parallel sampling's pass@1 and pass@5 columns are equal; with tests it returns any passing trajectory (§3.2). The authors take this to suggest that harness evolution's gains "largely stem from making multiple attempts" (§4.3).
- **Held-out tasks** (Tab. 3, §4.4): the evolved harness leaves average test pass@1 unchanged at 63.2 (+1.2 points on Claude Opus 4.6, none on GPT-5.4, −1.4 on GPT-5.4 mini). The authors say that, "based on the Terminal-Bench results", current harness evolution algorithms "appear prone to severe overfitting to the training tasks, especially for weaker models".
- **K = 10** (App. A.3, Tabs. 7–9; Claude Opus 4.6 only): "the same trend holds"; at K = 10 with tests, Harness Scaling scores highest (Tab. 8), a gap the caption calls "within run-to-run variance".
- **What the meta agent edits** (App. A.2; Fig. 2): "most edits memorize fixes rather than distilling strategies", and "the stable core of hard failures" is left unaffected.
- **ARC-AGI-3** (Tab. 4, §5.2): [full harness] Harness Scaling raises average RHAE over sequential refinement on [VISTA*] from 43.3 to 77.5 with Claude Opus 4.8 and from 21.1 to 38.2 with GPT-5.6 Terra; memory-only [VISTA] lies between. Agent-written tools dominate harness operations, hooks are almost never written (App. B.2). In three case studies the authors find the bottleneck in each case "perceptual rather than strategic", and full-harness evolution helps by "repairing perception on tr87, replacing manual search with programmatic search on lp85, and adding planning machinery" on ls20 (App. B.3).
- **EdgeBench** (Tab. 5, §5.3): average best score 54.7 against 48.3 with Claude Opus 4.8 and 49.8 against 45.9 with GPT-5.4 (13.3% and 8.5% better), not on every task. The authors note that memory "remains the dominant interface through which the harness is modified" (§5.3).

## Limits the authors state

- The Terminal-Bench result "may simply reflect that current models are not yet capable enough to revise the entire harness, in which case stronger priors could help, or they may already be optimized for Terminal-Bench during training" (§5).
- Its remaining failures "may stem from limitations in the underlying model rather than deficiencies in the harness", and it "may simply not be very sensitive to harness design" (§5).
- Harness-modification cost is not counted, being "very cheap compared with generating a new trajectory" (App. A.1 "Cost").
- On ARC-AGI-3, "in some cases the agent chooses to exit before exhausting this budget" (App. B.1 "Cost").
- The harness-operation counts "measure usage rather than value" (App. B.2).
- On EdgeBench the meta agent "sometimes neglects breadth, failing to prompt exploration of alternative directions" (§5.3).

## Open problems and building blocks

- **Open:** "the need to identify the settings in which it is genuinely helpful" (§6); evaluation protocols "that separate optimization feedback from final measurement and compare against test-time scaling baselines" (§1). Harness evolution "may benefit adaptation to out-of-distribution, long-horizon tasks with rich feedback", the authors suggest (§1).
- **Released:** code (abstract: "Our code is available at" the authors' GitHub organization).
- **To reuse it:** on Terminal-Bench, agent, Agent Debugger (AHE's trajectory summarizer) and meta agent all run the evaluated model (Tab. 6), each rollout in an E2B remote sandbox (App. A.1); ARC-AGI-3 settings in Tab. 10, EdgeBench's (Kubernetes, 12-hour timeout) in Tab. 14.

## On this site

- **Tags:** <span class="tags"><a class="tag" href="#/tags/stats">stats</a><a class="tag sub" href="#/tags/hacking-general">hacking-general</a><a class="tag sub" href="#/tags/harness-general">harness-general</a><a class="tag sub" href="#/tags/harness-promptopt">harness-promptopt</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/promptopt-context">promptopt-context</a><a class="tag sub" href="#/tags/promptopt-feedback">promptopt-feedback</a><a class="tag sub" href="#/tags/promptopt-general">promptopt-general</a><a class="tag sub" href="#/tags/scaling-general">scaling-general</a></span>
