# Coding Agents are Strong Prompt Optimizers

**Coding Agents are Strong Prompt Optimizers** · preprint 2026

Read: [PDF](https://arxiv.org/pdf/2609.26261) · [arXiv](https://arxiv.org/abs/2609.26261)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- A coding agent analyzes a static corpus of trajectories with its own code and writes behavioral rules into the prompt.
- One offline pass: no rollouts, no validation search.
- Reports beating GEPA on three of four benchmarks and SkillOpt on all four when every optimizer sees the same static rollout pool (abstract, Tab. 1).

## In plain words

Search-based prompt optimizers for LLM agents edit the prompt, rerun the agent and keep edits that score better. The authors argue that cost then grows with the number of edits and each edit sees only a few runs (§1). Instead, an unmodified coding agent gets a folder of logged runs and a short instruction, runs analysis code over all of them and writes behavior rules that become the new system prompt. With all optimizers limited to the same pool of runs, on four agent benchmarks, they report an average gain over the unoptimized prompt of 16.6 points, against 10.9 and 5.3 for the search-based GEPA and SkillOpt (abstract). They claim the loop "is unnecessary" (abstract).

## Background and terms

**Terms to know:** [reflective prompt optimization](#/glossary/reflective-prompt-optimization) · [Pareto front](#/glossary/pareto-front) · [Distillation into compact models](#/glossary/distillation) (here: runs turned into a prompt) · [pass@k](#/glossary/passk)

**The paper's own terms:**
- **rollout corpus**: logged runs (trajectories) of the initial prompt on a training set (§3.1).
- **skill file**: the coding agent's markdown file of behavioral rules, used as the system prompt (§3.2).
- **reflection scope**: whether the optimizer reasons over a small batch of trajectories or the whole corpus (abstract).
- **limited-data regime**: all optimizers see only the same pool, GEPA's Pareto set "equal to train" (§5). **Head-to-head regime**: GEPA and SkillOpt also get "a separate held-out validation set" (§5).

**Missing glossary terms:**
- **coding agent**: an LLM tool loop that interleaves "code execution, file inspection, and editing" (§2).

**Builds on:**
- GEPA ([GEPA](#/papers/agrawal2025gepa "GEPA: Reflective Prompt Evolution Can Outperform Reinforcement Learning (2026)")), "the strongest reflective variant": it evolves prompts, selecting on a Pareto front over a validation set (§2).
- SkillOpt ([SkillOpt](#/papers/yang2026skillopt "SkillOpt: Executive Strategy for Self-Evolving Agent Skills (2026)")), "reflective search with a validation-selection gate" (§5).
- APE ([APE](#/papers/zhou2022ape "Large Language Models Are Human-Level Prompt Engineers (2023)")), OPRO ([OPRO](#/papers/yang2023opro "Large Language Models as Optimizers (2024)")), ProTeGi ([ProTeGi](#/papers/pryzant2023protegi "Automatic Prompt Optimization with 'Gradient Descent' and Beam Search (2023)")), DSPy ([DSPy](#/papers/khattab2023dspy "DSPy: Compiling Declarative Language Model Calls into Self-Improving Pipelines (2024)")): all re-run and re-score each candidate, the authors say (§2).
- Learning from experience, e.g. Reflexion ([Reflexion](#/papers/shinn2023reflexion "Reflexion: Language Agents with Verbal Reinforcement Learning (2023)")), Dynamic Cheatsheet ([Dynamic Cheatsheet](#/papers/suzgun2025cheatsheet "Dynamic Cheatsheet: Test-Time Learning with Adaptive Memory (2025)")): these "reflect trajectory-by-trajectory" (§2).

## Problem and setting

- Can a better prompt come from a fixed rollout corpus alone, with no new runs or environment access (§3.1)?
- Target agent (and simulated user, where applicable): GPT-5.4-mini, reasoning disabled (no-think); optimizer LLM for all methods: Claude Sonnet 5, in Claude Code for CASD (§5, §7).
- Benchmarks (§5): ALFWorld (household tasks; win rate, 50 held-out games), τ²-bench retail and telecom (customer-service tool agents with an LLM-simulated user; pass@1, 40 tasks each), SpreadsheetBench-Verified, SSB (spreadsheet manipulation; "modified accuracy", 50 items).
- Accuracy is the mean of 3 seeds; CASD's is the mean of 3 distilled skills (§5).

## Approach

- **The pass (§3.2):** the coding agent gets the corpus, the initial prompt and one instruction to "distill a skill markdown file capturing the behavioral rules that would make a future agent instance more accurate". No analysis pipeline or metric is prescribed.
- **Inside the distiller (§3.3, Fig. 2)**: in 24 runs, exploration comes first, then alternation between corpus statistics and reading flagged episodes, then writing; skills cite measured counts.
- **One template (§4.1, Eq. 1–3)** for "a broad class" of optimizers: propose an edit from feedback, then accept or reject it; search uses sampled batches and validation scores, CASD whole-corpus statistics.
- **Bias against variance (§4.2–4.3)**: validation scores are noisy estimates that improve only with more rollouts; corpus statistics remove that noise but add bias "whenever the rollout corpus fails to capture important behaviors". This "suggests" that under limited budgets CASD "can" do better at lower cost, and that with more data its advantage "is expected to diminish".

## Results

- **Limited data (Tab. 1, Fig. 3, §6.1)**: it reports CASD ahead of GEPA on three of four benchmarks (GEPA leads on SSB) and of SkillOpt on all four (ALFWorld's SkillOpt cell "not directly comparable", Tab. 1 caption), with mean gains +16.6, +10.9 (GEPA), +5.3 (SkillOpt). GEPA drops below baseline on telecom, its edits "selected on the same pool it reflects on, and overfit" (§6.1).
- **Head-to-head (Tab. 2, §6.2):** with validation data and environment access, GEPA leads on retail and SSB, SkillOpt on telecom; CASD "still wins ALFWorld outright" (repeated limited-data runs). The abstract says it "remains ahead on two of four benchmarks"; §1 that it "consistently matches or outperforms" search optimizers.
- **Cost (Tab. 3, §6.3)**: about $1.60 per skill; over four benchmarks "22× cheaper than SkillOpt" and below GEPA.
- **Case study (§6.4, Fig. 4):** of a telecom ticket's two causes, the device one is "captured by all methods"; the billing one (a payment call no rollout makes) only by CASD.
- **Thinking (Tab. 4, §6.5):** the skill beats reasoning mode on ALFWorld and retail and recovers 78% and 55% of the no-think-to-think gap on telecom and SSB, with output at or below the no-think budget; think numbers from "an earlier study", SSB's only "indicative" (footnote). Think- and no-think-distilled skills land "within a few points".

## Limits the authors state

- CASD's spread is skill-to-skill, the baselines' seed-to-seed: "close but not identical" (§7).
- "At these evaluation-set sizes the binomial standard error alone is ≈7 points per seed" (§5).
- One target model and coding agent; "sensitivity to distiller capability is untested" (§7).
- CASD "cannot discover behaviors absent from the logged rollouts and very small or failure-free corpora may leave nothing to distill" (§7).

## Open problems and building blocks

- **Open:** the residual telecom and SSB gaps "suggest" a part of thinking "that no static prompt recovers; closing it is future work" (§6.5). "As coding agents improve", corpus-scale reflection "may become the default first step of prompt optimization" (§8).
- **Released:** Nothing stated.
- **To reuse it:** a rollout corpus, a coding agent and the instruction (§3.2); it "also runs where no simulator, grader, or validation split exists" (§6.3).

## On this site

- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/harness-general">harness-general</a><a class="tag sub" href="#/tags/harness-promptopt">harness-promptopt</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/promptopt-context">promptopt-context</a><a class="tag sub" href="#/tags/promptopt-feedback">promptopt-feedback</a><a class="tag sub" href="#/tags/promptopt-general">promptopt-general</a></span>
