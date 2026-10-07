# SkillsBench: Benchmarking How Well Agent Skills Work Across Diverse Tasks

**SkillsBench** · preprint 2026

Read: [PDF](https://arxiv.org/pdf/2602.12670) · [arXiv](https://arxiv.org/abs/2602.12670)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- A paired benchmark of agent skills: tasks across domains with curated skills and deterministic verifiers, each run with and without skills on many model–harness configurations (abstract).
- The authors report that curated skills raise pass rates unevenly, focused skills beat exhaustive bundles, and smaller models with skills can match larger models without them (abstract).
- Self-written skills, in a diagnostic condition (an agent writes skill packs with Anthropic's skill-creator, then a solver session uses only those; how isolated the two sessions are is disputed): the authors report them below no skills on all three configurations tested, −8.1 to −11.5 pp (App. D.6, Tab. 6), with their audit naming unused packs, creator–solver interference, confident errors and one leakage win (App. D.6.1).

## In plain words

Agent Skills are folders of instructions, scripts and reference files that an LLM agent can find and use while it works. The authors say there is "no standard way to measure whether they actually help" (abstract), and that existing agent benchmarks fold the model, the agent program around it and any add-ons into one pass rate (§1). They build SkillsBench: 87 real-work tasks in 8 domains, each in a container with hand-picked Skills and a deterministic test script, and run every task with and without the Skills on 18 pairings of a model with an agent program (abstract). Averaged over the 18, Skills raise the pass rate from 33.9% to 50.5%, with gains from +4.1 to +25.7 points per pairing (abstract). In a separate diagnostic on three pairings, Skills the agent first wrote for itself scored below no Skills (App. D.6); the authors say this deficit mixes content quality with whether the solver finds the Skills and with interference between writing and solving (§6.1). They call SkillsBench "the first benchmark that treats Skills as a first-class evaluation artifact" (§1).

## Background and terms

**Terms to know:** [agent skill](#/glossary/agent-skill) (here "a reusable, file-system-based procedural package for a class of agent tasks", §2, which can carry executable resources, Tab. 1) · [normalized gain](#/glossary/normalized-gain) (computed per configuration and macro-averaged, §4, Eq. 1; it "can overstate small absolute gains near the ceiling", App. N.4) · [progressive disclosure](#/glossary/progressive-disclosure) (how agents find Skills here, without the task naming them, §3) · [agent harness](#/glossary/agent-harness) · [LLM-as-a-judge](#/glossary/llm-as-a-judge) · [data contamination](#/glossary/data-contamination)

**The paper's own terms:**
- **Agent harness**: "the execution layer that wraps an LLM and connects it to its environment", which in Skill-augmented agents also "discovers and loads relevant Skills" (§2). The four used (App. D.3): OpenHands (an open-source terminal agent harness), and the vendors' own terminal agents Claude Code (Anthropic), Gemini CLI (Google) and Codex CLI (OpenAI).
- **Configuration**: one model run in one harness. The **dedicated-harness configurations** are Claude Code with Opus 4.7, Codex with GPT-5.5 and Gemini CLI with Gemini 3.1 Pro (App. D.6).
- **Conditions**: *no Skills* (the instruction only), *curated Skills* (the task's full `environment/skills/` folder) and *self-generated Skills* (the agent first authors skill packs with Anthropic's `skill-creator` Skill, then solves with only those) (§4).
- **Oracle**: the task's reference solution, which must pass the verifier (§3). Not the glossary's test-oracle sense. **Verifier**: a deterministic `pytest` script; §4 says it "emits a pass/fail result".
- **Leakage**: a Skill that encodes task-specific answers, so that "a Skill becomes a hidden answer key" (§3).
- **Task-macro pass rate**: outcomes averaged over a task's three trials, then over the 87 tasks, as in Terminal-Bench (§4).
- **Skill Invocation Rate**: the share of curated-Skills trials whose trajectory reads or invokes a Skill shipped with the task (§5.1.1, Finding 4).

**Builds on:**
- Anthropic's Agent Skills (2025): the format and discovery mechanism tasks follow (§1, §3). Not on this site.
- Terminal-Bench (Merrill et al., 2026), hard command-line tasks: its scoring is used "for comparability" (§7). Not on this site.
- C); and BenchFlow, the authors' open-source benchmarking harness (§4).
- Agent benchmarks (SWE-bench for code repositories, WebArena for the web, OSWorld for desktops, among others), which "measure fixed-agent task completion" (§7).

## Problem and setting

- **Question:** "how much do Skills actually help, and when do they fail?" (§1).
- **Tasks:** 87, from 400 submissions by 142 contributors, in 8 domains from software engineering to natural science and finance; by estimated time for a human specialist, 6 take under an hour, 53 take 1–4 hours and 28 take longer (§3; App. M.9). Each has an instruction, a Docker environment, an oracle and a verifier (§3, Fig. 3).
- **Skills:** authored independently of the benchmark; instructions never name which Skills to use (§3).
- **Models:** 18 configurations, 15 in OpenHands, with models from eight providers (App. D.2, Tab. 5).
- **Protocol:** a fresh pinned container per configuration, task and condition; three trials per cell; temperature 0 (§4; App. D.1). Timeout rows enter "only when healthy pass/fail replacements are unavailable and then scored as failures" (§4).

## Approach

- **Construction (§3; App. B, M):** four automated gates (structure, oracle execution, an AI-text detector plus human label on instructions, and Skill-to-solution leakage), then at least one 30-minute maintainer review; "tasks with no measurable separation between conditions are rejected as low-signal" (§3).
- **Self-generated condition (App. D.6):** "two isolated sessions" per task. A *creator* gets the task with curated Skills removed and only `skill-creator` mounted, told "Do not solve the task directly"; a fresh *solver* runs the task with the generated packs, and "none of the creator's reasoning is in the solver's context". Claude Code runs both scenes "back-to-back inside each trial's sandbox", where "file-system state can carry over beyond the pack files"; Codex and Gemini CLI generated packs once per task and configuration and reused them. The Claude Code self-generated runs used effort level `max` against `high` for its baselines (App. D.6, footnote 3). The condition is kept "as a diagnostic rather than part of the main two-condition aggregate" (App. D.6).
- **Audits:** trajectories where Skills hurt (App. F.3), of the 10 largest gains (App. F.4) and of self-generated runs (App. D.6.1).

## Results

- **Main (Tab. 2):** curated Skills lift the mean pass rate from 33.9% to 50.5% (+16.6 points, normalized gain 25.5%); all 18 configurations improve, by +4.1 to +25.7 points (§5.1.1, Finding 1). The authors conclude Skill efficacy is "an empirical property of a specific agent stack rather than a universal constant".
- **Findings 2–3 (§5.1.1):** "The strongest absolute systems are not always the largest beneficiaries" (GPT-5.5 and Opus 4.7 in Claude Code lead with Skills); Gemini 3.1 Pro and Opus 4.7 do better with Skills in their vendors' harnesses than in OpenHands.
- **Finding 4:** "Skill discovery is usually not the bottleneck"; high invocation "does not guarantee high resolution, so the remaining failures often occur after task-Skill access" (§5.1.1, Fig. 5; App. K).
- **Self-generated (App. D.6, Tab. 6):** below no Skills on all three dedicated-harness configurations (−8.1 to −11.5 points), while curated Skills add +18.2 to +24.8 on the same ones; 253–258 of 261 trial slots scored. The audit (App. D.6.1) names four mechanisms: packs "frequently go unused" (Codex, Gemini CLI); authoring displaces task work (shown on one Claude Code task, where the scenes "share a single trial context"); consumed packs "lock in confident errors" (one hard-codes a unit conversion the curated Skill warns against); and the clearest win is "leakage, not reuse", a pack written "inside the graded sandbox" that names what the verifier checks.
- **Domains (Tab. 3):** all eight gain; natural science, media and cybersecurity most, software engineering and mathematics least, which the authors tie to procedural knowledge "underrepresented in model pretraining" (§5.1.2).
- **Tasks:** 13 of 87 tasks show negative deltas; in the audit the Skill prescribes an "unnecessarily heavyweight pipeline", displaces a stronger default strategy, or points the agent at a solver it cannot debug (§5.1.3; App. F.3).
- **Design (Finding 6; App. F):** tasks with 1 or 2–3 Skills gain +18.0 and +19.0 points against +10.1 with four or more (Tab. 8); comprehensive documentation gains +0.7 against +19.0 and +21.5 for compact and standard-length Skills (Tab. 9). MiniMax M2.7 with Skills exceeds the no-Skills pass rates of two stronger configurations, so Skills "can partly compensate for model capacity on procedural tasks" (§5.1.3).
- **Cost and time:** curated Skills lift the mean at "broadly unchanged agent time" (App. L.4).

## Limits the authors state

- Terminal-based containerized tasks, so "results may not transfer directly to GUI agents, multi-agent coordination, or very long-horizon workflows"; a limited set of models and harnesses "whose Skills integration can change over time" (§6.1).
- "Skills injection increases context length", so gains could partly reflect more context rather than procedural structure (§6.1).
- The self-generated deficit "mixes content quality with skill-discovery and creator/solver interference effects" (§6.1).
- The authors "cannot eliminate all nondeterminism or memorization effects" (§6.1).
- "Our 87 tasks with high-quality Skills represent an optimistic scenario" (App. A.4).
- Cybersecurity and media have under 8 tasks: "per-domain inferential claims should treat those slices as descriptive" (App. M.9).
- Claude models were trained with awareness of the Agent Skills specification, "which may confer advantages" (App. D.3).
- In the self-generated audit, "some zeros are measurement artifacts" (a verifier was patched after the runs), and Codex and Gemini CLI creator sessions are not released (App. D.6.1).

## Open problems and building blocks

  - "stronger length-matched baselines, such as random or irrelevant text and retrieval-only documentation", and "to study automatic Skills synthesis" (§6.1).
  - Lower-quality and automatically selected Skills, and composition: "whether composite performance can be predicted from atomic effects" (§6.1).
  - "multi-modal Skills and protocols for vision-language agents in GUI environments" (§6.1).
- **Released:** "the benchmark, the BenchFlow harness, and the public trajectories/results" (§8); the benchmark also runs on the AgentBeats platform (App. C, footnote 1).
- **To reuse it:** Docker containers with 1–4 CPUs and no GPU (App. D.8); temperature 0, highest available reasoning effort, an 8K-token sliding context window (App. C). Mean cost per trial, where priced: $0.15 to $22.70 (App. L.1, Tab. 15).
- **Beyond its domain:** the paired protocol "can evaluate other artifacts (retrieval pipelines, memory stores, scaffolding) without confounding model and augmentation effects" (§1).

## On this site

- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/harness-general">harness-general</a><a class="tag sub" href="#/tags/harness-promptopt">harness-promptopt</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/promptopt-context">promptopt-context</a><a class="tag sub" href="#/tags/promptopt-general">promptopt-general</a></span>
