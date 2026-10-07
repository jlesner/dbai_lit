# SkillOpt: Executive Strategy for Self-Evolving Agent Skills

**SkillOpt** · preprint 2026

Read: [PDF](https://arxiv.org/pdf/2605.23904) · [arXiv](https://arxiv.org/abs/2605.23904)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Trains an agent's skill document like weights: bounded add/delete/replace edits accepted only on validation gains.
- Textual learning-rate budget, rejected-edit buffer, epoch-wise slow updates.
- A validation-gated skill optimizer, though no ablation removes the gate; [Skill Issue](#/papers/kozyrev2026skillissue "Skill Issue: Lessons from Optimizing Repository SKILLs for Coding Agents (2026)") finds its documents leave the score where it started on three Kotlin repositories (abstract).

## In plain words

LLM agents are often given a skill: a short text of procedures, tool habits and output rules placed in the model's context. The authors argue that today's skills are hand-written, generated in one shot or revised with loose control, and that none of these "reliably improves over its starting point under feedback" (abstract); retraining weights is often unavailable for closed models and expensive for open ones (§1). They build SkillOpt, which trains the skill like weights while the model stays fixed. A second model reads scored runs and proposes a limited number of add, delete or replace edits, and a changed skill is kept only if it scores strictly higher on a held-out selection set. On six benchmarks, seven models and three ways of running the agent, they report SkillOpt best or tied in all 52 combinations against hand-written, one-shot and optimized skills and prompts. With GPT-5.5 answering in a single chat call, it raises the six-benchmark average by 23.5 points over no skill. They call it, "to our knowledge, the first systematic controllable text-space optimizer for agent skills" (abstract).

## Background and terms

**Terms to know:** [agent harness](#/glossary/agent-harness) · [reflective prompt optimization](#/glossary/reflective-prompt-optimization) · [agent skill](#/glossary/agent-skill) (the paper follows SkillsBench and a systematization-of-knowledge paper on agentic skills, both §2 and not listed here, in treating skills as "reusable procedural knowledge", §3.1)

**The paper's own terms:**
- **target model** (student): the frozen model being adapted (§3.1). **Optimizer model** (teacher): the separate model that edits the skill, used only in training (§3.3, §4.3).
- **harness**: how the target runs a task. The paper counts three "execution harnesses" (abstract): direct chat (one chat call; "No harness / direct chat" in Tab. 1), and Codex and Claude Code, which drive the target through the `codex` and `claude` command-line agents in a sandboxed workspace (§4 "Harnesses").
- **rollout batch / reflection minibatch**: the tasks run with the current skill at one step, and the groups of failed or successful runs the optimizer analyses together (§3.2–3.3).
- **textual learning rate** (edit budget, Lt): "the maximum number of skill edits applied at step t" (§3.4), changed over training by a schedule (constant, linear, cosine, autonomous).
- **rejected-edit buffer**: an epoch-local record of failure patterns and rejected edits with "the score drop they caused", shown to later optimizer calls in that epoch (§3.5).
- **slow update / meta skill**: an end-of-epoch guidance block in a protected part of the skill, and an optimizer-side summary of which edit patterns helped or failed, never shipped (§3.6).

**Builds on:**
- GEPA ([GEPA](#/papers/agrawal2025gepa "GEPA: Reflective Prompt Evolution Can Outperform Reinforcement Learning (2026)")), which the authors say shows "trajectory feedback can guide reflective prompt evolution" (§2); a baseline (§4 "Baselines").
- TextGrad ([TextGrad](#/papers/yuksekgonul2024textgrad "TextGrad: Automatic 'Differentiation' via Text (2024)")), "gradient-style natural-language prompt optimization", a baseline (§4 "Baselines").
- Skill-evolution systems, among them the baselines Trace2Skill ("trajectory-level skill Distillation into compact models") and EvoSkill ("skill-folder evolution under failure analysis") (§2, §4 "Baselines"); not listed here.

## Problem and setting

- **Question:** "if skills are the adaptation layer, how should they be optimized?" (§1).
- **Setting:** a frozen target model and harness, one skill for one domain, and tasks scored in [0, 1] by each benchmark's own evaluator (pass/fail "hard success" or exact-match accuracy; §3.1, App. C). Candidates come from the training split, the best is chosen on the selection split, and the test split "is used only for final reporting" (§3.1, Eq. 1–3).
- **Splits:** "Dataset-backed runs" use deterministic splits from one dataset seed (§4 "Setting"), "a default 2:1:7 split when no benchmark-specific split is stated" (App. C).
- **Benchmarks:** SearchQA (extractive question answering), SpreadsheetBench (spreadsheet code and tool use), OfficeQA (local-document reasoning with tool loops), DocVQA (multimodal-document reasoning), LiveMathematicianBench ("LiveMath", mathematical multiple choice) and ALFWorld (household tasks in an embodied environment) (§4 "Setting", App. C).
- **Models:** targets GPT-5.5, GPT-5.4, GPT-5.4-mini, GPT-5.4-nano, GPT-5.2, Qwen3.5-4B and Qwen3.6-35B-A3B (§4); harness runs use GPT-5.5 only (Tab. 1). The optimizer is "an additional frontier model" (§1), GPT-5.5 in the optimizer-strength study (Tab. 5).
- **Baselines:** no skill, a human expert skill, a one-shot skill written by GPT-5.5, Trace2Skill, TextGrad, GEPA and EvoSkill, all with "the same target model, the same held-out test split, and the same scorer" (§4 "Baselines"); TextGrad and GEPA run in direct chat, EvoSkill in harness runs "where a matched completed run is available" (App. C).

## Approach

The authors call their "deep-learning analogy" "operational rather than decorative" (§1): batch sizes set the noise in the evidence, the edit budget the step size, the gate plays validation, and the slow update "acts like a momentum term" (§1; Fig. 1–2; Alg. 1 in App. C.1).

- **Forward pass (§3.2):** the target runs a rollout batch with the current skill; the harness records the runs and verifier feedback.
- **Backward pass (§3.3):** the optimizer splits runs into failures and successes, analyses minibatches of each, and proposes edits, merged hierarchically "with priority on failure corrections".
- **Bounded update (§3.4):** the optimizer ranks the merged edits "by expected utility" and keeps the top Lt. The default cosine schedule "starts with larger edits and decays toward smaller consolidation steps". Step edits cannot touch the protected slow-update field.
- **Gate and buffer (§3.5):** each candidate is scored on the selection split.
- **Slow/meta update (§3.6):** at an epoch's end the same training items are run under the previous and current skill and compared; the optimizer writes guidance into the protected field, and that candidate "is still passed through the validation gate". The meta skill is prepended to later optimizer prompts only.
- **Adapters (§3.7):** one per harness; deployment adds "zero inference-time model calls" (abstract).
- **Defaults (§4 "Default optimizer hyperparameters"):** "Unless noted" (benchmarks with small training pools, LiveMath and ALFWorld, scale batch sizes), four epochs, rollout batch 40, minibatch 8, Lt = 4 with cosine decay to a floor of 2, slow update on 20 tasks per epoch, meta skill on, patch mode (localized edits rather than a full rewrite, §3.4).

## Results

- **Main matrix (Tab. 1, §4.1):** SkillOpt is "best or tied-best" on 52 of 52 (model, benchmark, harness) cells (§4.1). For GPT-5.5 it reports average gains over no skill of +23.5 in direct chat (58.8 → 82.3), +24.8 under Codex and +19.1 under Claude Code. In direct chat SkillOpt is +5.4 points above an oracle that picks the best competing method per cell.
- **Ablations (Tab. 2, Tab. 3, Fig. 3, §4.2),** run "using GPT–5.5 as both the target and the optimizer": procedural benchmarks reward more training evidence, while mini-batch and rollout-batch sizes move SearchQA and SpreadsheetBench little. The authors state that "any moderate, bounded edit budget already beats" the no-budget row. Removing the rejected-edit buffer lowers all three benchmarks, and removing both meta skill and slow update gives "the largest degradation in the ablation suite" (SpreadsheetBench). They read Fig. 3 as showing the gate "tends to select skills that generalize", and the ablations as showing the gains are "much more sensitive" to bounded edits, validation gating, rejected-edit feedback and the slow/meta update than to batch sizes or schedule.
- **Transfer (Tab. 4, §4.3):** with no further optimization, skills moved to smaller GPT models, between harnesses, and from OlympiadBench to Omni-MATH (two olympiad-level math benchmarks) all stay above the target's no-skill score (Tab. 4 caption). A SpreadsheetBench skill trained under Codex gains +59.7 under Claude Code (22.1 → 81.8) on GPT-5.5.
- **Optimizer strength (Tab. 5, §4.3):** on two small GPT targets and two benchmarks, a GPT-5.5 optimizer gives larger gains in all four cells than an optimizer that is the target model itself, which "recovers 56–74% of the strong-optimizer gain".
- **Learned skills (Tab. 6, Fig. 4, §4.4–4.5):** in the GPT-5.5/GPT-5.5 runs, the final skills stay compact and the gains come from "very few accepted edits" (§4.4, Tab. 6), which the authors call "direct evidence that the validation gate is doing real work". Fig. 4 shows one learned rule per benchmark; §4.5 traces two skills' evolution.

## Limits the authors state

- The loop needs scored runs and a held-out selection split, so it "is most directly applicable when the target task has automatic verifiers, exact-match metrics, executable checks, or otherwise reliable feedback signals"; where success is subjective, multi-dimensional or costly to judge, the gate "may require stronger human or model-based evaluation" (App. B).
- Training "requires additional rollout computation and calls to an optimizer model", amortized when the skill is reused "but may be less attractive for one-off tasks" (App. B).
- "a single skill may be insufficient for highly heterogeneous domains that require many disjoint procedures" (App. B).
- Skills "can encode domain-specific heuristics from the training distribution", so held-out evaluation "remains necessary" before moving them to substantially different models, harnesses or tasks (App. B).
- ALFWorld is left out of the harness runs because it "requires persistent embodied-environment interaction" (§4.1).

## Open problems and building blocks

- **Open:** the authors list "skill libraries that share infrastructure across domains, reuse of optimizer-side meta skills across benchmarks, reward-free or preference-driven validation gates for open-ended tasks, and self-distillation of optimized skills back into the target model" (§5 "Outlook").
- **Released:** a code link under the abstract (PDF p. 1); the paper says nothing more about it.
- **To reuse it:** a frozen target model with a harness adapter (§3.7); an optimizer model, where the authors call a frontier optimizer "the right default whenever it is available" (§4.3); a task with an automatic scorer and a selection split (App. B); training tokens per benchmark from 20.8M to 213.8M in the GPT-5.5/GPT-5.5 runs (Tab. 6).
- **Beyond its domain:** the authors say the results "suggest that compact natural-language skills can serve as a practical domain-adaptation layer for frontier agents" (§5).

## On this site

- **Discussed in:** [Bringing compact models to frontier accuracy](#/challenges/compact_model_accuracy) · [Can a memory across problems be checked before it is reused?](#/challenges/verified_memory)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/harness-general">harness-general</a><a class="tag sub" href="#/tags/harness-promptopt">harness-promptopt</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/promptopt-context">promptopt-context</a><a class="tag sub" href="#/tags/promptopt-feedback">promptopt-feedback</a><a class="tag sub" href="#/tags/promptopt-general">promptopt-general</a></span>
