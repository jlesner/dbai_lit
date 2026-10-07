# SEPO: Evidence-Grounded Prompt Optimization via Structural Editing

**SEPO** · preprint 2026

Read: [PDF](https://arxiv.org/pdf/2608.28067) · [arXiv](https://arxiv.org/abs/2608.28067)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Edits typed units of a structured prompt and links each edit to the examples it fixes or breaks.
- Multi-trajectory search guided by edit-effect lineage.
- Reports beating GEPA on two 8B workers (abstract); its much shorter prompts are measured on Llama only (Tab. 5). Compact models, cf.

## In plain words

Prompt optimisers let a large model rewrite a prompt and score each version on training examples. The authors say most rewrite the whole prompt each round, leaving no record of where, why, or which examples each change helped or harmed (§1). SEPO keeps the prompt as numbered steps, each with rules. Each round, one large-model call picks the step to change and why; a second writes the change. It records which training examples each change newly fixed and broke, passes that record to later edits descended from it, and keeps several prompts. They say this makes optimisation "addressable, attributable, and actionable" (§1): each edit has a place and traceable effects. On 14 held-out tasks, with 2000 scorings of a training example per task and seed, they report average accuracy 3.1 points above the strongest rival, GEPA, with Llama-3.1-8B answering, 2.2 with Qwen3-8B (abstract). With Llama, cost is lower and prompts over five times shorter than GEPA's.

## Background and terms

**Terms to know:** [Pareto frontier](#/glossary/pareto-front)

**The paper's own terms:**
- **worker / architect**: the worker is the frozen model whose prompt is optimised (Llama-3.1-8B-Instruct or Qwen3-8B, open models of about 8B parameters); the architect is the frozen model that writes edits, Qwen3.5-397B-A17B, a mixture-of-experts model with 17B of 397B parameters active (§3.1, §4.1, App. A.2).
- **two-layer schema**: the prompt as numbered top-level steps (the outline), each with its own list of step-local rules (§3.2, Eq. 2). Runs start from one three-step seed: understand, reason step by step, answer (App. B.1).
- **typed target (τ)**: where the first architect call says the edit belongs: inside one step (`step <N>`), `ADD step at <pos>`, `SPLIT step <N>`, `DROP step <N>`, or `backbone` (rewrite the whole outline) (§3.3).
- **operator labels (o(c))**: a text-similarity diff of parent and child labels each changed spot with one of eight operations, four on rules (e.g. AddRule) and four on the outline (e.g. RewriteStep); the architect never names them (§3.2, Eq. 3, Tab. 7).
- **newly broken / newly fixed**: training examples the parent prompt gets wrong that its own parent got right, and the reverse (§3.3).
- **breadcrumb (ℓ)**: a short text block on what the parent's last edit changed, with its counts of newly fixed and broken examples (§3.3, App. D.3).
- **edit-effect lineage feedback**: the core mechanism: each child stores its target, breadcrumb, operations and newly fixed and broken examples for later architect calls on its branch (§1, §3.3).
- **evidence packet**: up to six training examples shown to both architect calls: two "focus" examples from the parent's newly broken ones (favouring examples many archive members solve), one "anchor" from its newly fixed ones, three random "train probes"; no focus slot when nothing is newly broken (§3.3, App. D.1–D.2).
- **metric call**: scoring the worker once on one training example; the budget is 2000 per task and seed, architect calls not counted (§4.1).
- **archive, Gate 1, Gate 2**: the archive is the pool of kept prompts. A child must beat its parent on the three probes (Gate 1); after full training scoring it is kept if it solves an example no archive member solves, is shorter than its parent, or scores higher (Gate 2, Eq. 6) (§3.4).

**Missing glossary terms:**
- **lexicase selection**: a parent-selection method from genetic programming that filters candidates through the training examples in random order, keeping "specialists" that solve rare or hard examples; SEPO uses it with probability 0.8, otherwise a random pick (§3.4, citing Spector 2012).
- **macro accuracy**: the unweighted mean of per-task accuracies (§4.1); pp = percentage points.

**Builds on:**
- GEPA ([GEPA](#/papers/agrawal2025gepa "GEPA: Reflective Prompt Evolution Can Outperform Reinforcement Learning (2026)")), "the strongest baseline" (abstract): reflective per-module edits with a Pareto-frontier archive (§2).
- MPO, Modular Prompt Optimisation (Sharma and Henley 2026, not listed here): refines each section of a fixed cross-task schema (§2).
- APSF (Liu et al. 2026c, not listed here): optimises self-discovered prompt factors (§2).

## Problem and setting

- **Question:** can local, typed edits that carry their per-example effects forward beat whole-prompt rewriting on held-out accuracy and cost (§4, Q1–Q4)?
- **Claimed gap:** structured optimisers expose local units but typically don't link each edit to the examples it newly fixes or breaks, or carry that record forward (§2).
- **Setting:** API-only (prompts change, weights don't); maximise a binary task metric's mean over the training set (Eq. 1).
- **Tasks** (§4.1, Tab. 6): 8 BBH tasks (BIG-Bench Hard reasoning subtasks), 3 MMLU-Pro subjects (multiple choice: computer science, economics, psychology), MBPP+ (Python coding, scored by pass@1: whether the first program passes the tests), GSM-Hard (math word problems), HotpotQA (multi-hop questions over Wikipedia passages). Training sets: 50, 100 or 200 examples; disjoint test splits; three random seeds per cell, a cell being one method on one task (App. A.3). HotpotQA uses its Medium split with Llama and Hard with Qwen, so that column isn't comparable across workers (§4.1).
- **Models:** workers at temperature 0.0 "for deterministic metric evaluation" (§4.1); architect at 0.7.
- **Baselines** (§4.1, App. F): the unoptimised Seed prompt; OPRO ([OPRO](#/papers/yang2023opro "Large Language Models as Optimizers (2024)"), the LLM as optimiser fed scored earlier prompts); APSF; MIPROv2 ([MIPRO (shipped in DSPy as MIPROv2)](#/papers/opsahlong2024mipro "Optimizing Instructions and Demonstrations for Multi-Stage Language Model Programs (2024)"), DSPy's optimiser of instructions and demonstrations); MPO; GEPA. All share the worker, splits, seed prompt and the 2000-call budget.

## Approach

- **One iteration** (§3.3, Fig. 2, Alg. 1): pick a parent; build the evidence packet from parent and grandparent; the attribution call reads schema, packet and breadcrumb and returns a typed target and a short failure reason, not a prompt (Eq. 4); the patch call gets the same plus that diagnosis and returns a full revised schema, parsed into the child (Eq. 5); the diff labels the realised operations (Eq. 3).
- **Edit scope:** the patch prompt asks for "the smallest applicable operation"; rules under other steps are kept unless the change makes them irrelevant (App. B.3).
- No theorems.

## Results

The authors' claims, on held-out test splits:

- **Accuracy (Tab. 1, §4.2):** macro 61.9% against GEPA's 58.8% (Llama) and 73.3% against 71.1% (Qwen), at least 3.3 and 4.8 pp above every other baseline; the seed prompt scores 49.1% and 57.1%.
- **Wins (§4.2):** 13/14 tasks against GEPA on Llama, 11/14 on Qwen, at least 11/14 against every other baseline.
- **Where gains concentrate (§4.2):** procedural multi-step tasks; Word Sorting on Llama 58.2% against GEPA's 39.3% (seed 0.0%).
- **Budget curves (Fig. 3, Llama worker):** at or above every baseline at each checkpoint up to 2000 calls.
- **Ablations (Tab. 2–3, Fig. 4, §4.3; five tasks, Llama):** removing any one design principle (localised edits, lineage feedback, several branches) costs 1.8–4.7 pp on the five-task mean, most for dropping multiple branches; without the attribution call, prompts roughly double in length and edits grow and are accepted less often. Matched controls with random targets, or random errors in place of newly broken examples, lower the net gain per proposal (§4.3).
- **Edit types (Tab. 4, §4.4):** most edits add a rule, many also drop or refine one; "Edits stay overwhelmingly step-local".
- **Auditability (§4.4, Fig. 5–6, App. E.2–E.3):** in one Word Sorting run (Llama, random seed 45), the log shows a self-verification rule followed by worker repetition loops, then its replacement by a rule not to re-process the sorted list.
- **Cost (Tab. 5, §4.5; Llama worker)**: SEPO lies on both the optimisation-time and test-time Pareto frontiers, with the less accurate APSF the only other method on both (§1 (iv)); 2.9M optimisation tokens per cell against GEPA's 4.1M, 203k deployment tokens (spent answering the test set) against 424k, a 236-token prompt against 1,324.
- **Robustness (App. G.1–G.2, Llama):** three extra random seeds on five high-variance tasks keep SEPO's mean above GEPA's (Tab. 9).
- **Parse failures (App. B.4):** 2.3% of architect calls returned unusable output; those children were discarded, their tokens counted.

## Limits the authors state

- SEPO yields "a task-specialised artefact rather than a universal prompt" (§ "Limitations", "Task-tailored schemas").
- Evaluated only on single-turn, single-call, text-based tasks (§ "Limitations", "Evaluation setting").
- Word Sorting accuracy falls with list length: 0.79 for at most 5 words against 0.31 for 16 or more (Tab. 8, App. E.4; Llama, 100 test examples). Edits fix length-independent failures but "cannot substitute for an algorithmic execution mechanism on long inputs" (App. E.4).
- Gains vary by task family; MMLU-Pro margins are thin (§4.2).
- With Llama, HotpotQA Hard compresses all optimisers' scores, so Medium is used (App. G.2).

## Open problems and building blocks

- **Open:** whether the efficiency advantage reaches "substantially longer prompts or more compositional agentic skills involving multiple steps, tool calls, or state tracking remains open" (§ "Limitations", "Instruction-space scalability"); cross-task transfer is "left to future work" ("Task-tailored schemas"); so are agentic pipelines and multimodal prompts, which the edits "may suit" ("Evaluation setting").
- **Released:** nothing stated; the paper prints the architect prompt templates (App. B) and example final prompts (§3.2, App. E.1).
- **To reuse it:** an architect model (theirs: Qwen3.5-397B-A17B, temperature 0.7, up to 16,000 generated tokens, App. A.2); a worker at temperature 0; a binary metric; 2000 metric calls per task and seed plus architect calls. A Llama cell cost about $0.17 (Tab. 5, App. G.3).

## On this site

- **Discussed in:** [Bringing compact models to frontier accuracy](#/challenges/compact_model_accuracy)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/promptopt-evolve">promptopt-evolve</a><a class="tag sub" href="#/tags/promptopt-general">promptopt-general</a></span>
