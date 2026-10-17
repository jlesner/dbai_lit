# Reasoning Core: Designing Broad Procedural Data for Completion-Supervised Reasoning Training

**Reasoning Core** · preprint 2026

Read: [PDF](https://arxiv.org/pdf/2608.05148) · [arXiv](https://arxiv.org/abs/2608.05148)  
Code: [reasoning-core](https://github.com/sileod/reasoning-core)

<p class="notice">A summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- A library of procedural generators of checkable reasoning tasks (e.g. mathematics, logic, planning, formal languages, structured data, code), each with a semantic scorer and difficulty controls, compared under matched supervised fine-tuning with Procedural Warmup, Reasoning Gym and SynLogic on held-out benchmarks (abstract; §3, Tab. 1; §4).
- Compact answers with a deterministic canonical form where suitable, scorers that accept any valid answer, and external solvers (Lean, ProbLog, Clingo, DuckDB, among others) as answer oracles; and an audit of generators by model-assisted review, model sampling at the lowest difficulty, human adjudication and regression tests, applied to its own tasks and to the other collections (§3.1, §3.4; App. A).
- Generators of checkable tasks, with an audit of other collections' checks: the authors report confirmed default-path defects in 13 of 105 Reasoning Gym tasks and in SynLogic generators (§3.4), such as a scorer that gives full credit to any nonempty answer (App. G, Tab. 11), and say procedural generation "does not guarantee correctness" (abstract); its generators include regular-expression equivalence and table QA over generated SQL with DuckDB as the oracle (App. A).

## In plain words

Programs can generate checkable reasoning problems at scale, but these have received less attention as fine-tuning data, where a model learns to write the reference answer; the broad collections were built mainly for reinforcement learning (training by trial and reward) (abstract; §1). The authors ask how to design such data for fine-tuning (§1). They build Reasoning Core, 50 problem generators in nine families (Tab. 1), each with a scorer and a difficulty setting, and compare it with three other generated collections when each replaces a fifth of a small model's training tokens (§3–4). In the main comparison, a 3-billion-parameter model trained for 2,400 updates with Reasoning Core has the highest mean scores on three held-out reasoning benchmarks, above training without generated data and all three other collections (abstract; §5.1, Tab. 2). Under conservative criteria, an audit confirms defects, such as wrong stored answers or scorers accepting wrong outputs, in 13 of 105 Reasoning Gym tasks, and the authors conclude "procedural generation alone does not guarantee correctness" (abstract; §3.4). They present it as a resource, a controlled comparison and an audit, not as a first (§1).

## Background and terms

**Terms to know:** [GRPO](#/glossary/grpo) · [RL with verifiable rewards (RLVR)](#/glossary/rl-with-verifiable-rewards-rlvr) · [Kendall's tau](#/glossary/kendalls-tau) · [regression testing](#/glossary/regression-testing) · [Pearson correlation](#/glossary/pearson-correlation) · [F1 score](#/glossary/f1-score) · [Earley parser](#/glossary/earley-parser) · [negative log-likelihood (NLL)](#/glossary/negative-log-likelihood-nll) (§4.2 defines only its change, ΔNLL)

**The paper's own terms:**
- **Completion-supervised fine-tuning**: fine-tuning with the loss only on the answer tokens (completion-only masking), one reference answer per problem (§3.1; App. E.1, Tab. 9).
- **Generator / task**: code that maps a seed and a difficulty setting to a prompt, a structured reference answer, metadata and a scoring function (§3.2).
- **Semantic validity** vs **training utility**: whether a rendered problem has a correct, identifiable answer, against whether training on it helps "under a specified model, objective, dose, and mixture" (§1).
- **Main data, auxiliary collection, main-only**: the main stream mixes educational web text (FineWeb-Edu) with DOLCI, a public instruction-tuning set; a generated (auxiliary) collection replaces 20% of the prompt-plus-answer tokens, with the number of updates fixed; main-only trains on the main stream alone, same seed and settings (§4.1).
- **ΔNLL**: the percentage by which adding a collection lowers the held-out answer's negative log-likelihood against the matched main-only run; positive is better (§4.2).
- **Reasoning and Retention compounds**: averages over DROP, LogiQA, ARC-Challenge and BBH-test, and over MMLU-other and DOLCI (Retention asks whether other abilities are lost) (§4.2).
- **BBH-development / BBH-test**: BIG-Bench Hard (a set of hard reasoning tasks) split by its authors' taxonomy: non-algorithmic tasks for development, algorithmic ones for testing (§4.3).
- **Native reward**: the task's own scorer on the model's free generation (§5.2.2).
- **Isolated-task intervention**: one generator mixed alone into the main stream, compared with main-only (§5.2.1; App. D.4).
- **Default-path defect**: a failure in default generation or scoring, such as a wrong label or a scorer accepting wrong outputs (§3.4; captions of Tab. 10–11).

**Missing glossary terms:** none.

**Builds on:**
- Procedural Warmup (Jiang et al., 2026): a warmup on abstract procedural sequences, reimplemented here for comparison (§1; §2; §4.1).
- Reasoning Gym (Stojanovski et al., 2025) and SynLogic (Liu et al., 2025): broad collections of verifiable reasoning environments, primarily for RL (§1; §2).
- Work questioning how much RL adds beyond earlier training, e.g. Yue et al. (2025) ([Does Reinforcement Learning Really…](#/papers/yue2025rlreasoning "Does Reinforcement Learning Really Incentivize Reasoning Capacity in LLMs Beyond the Base Model? (2025)")) (§1).

## Problem and setting

The question: "how should broad collections of verifiable reasoning examples be designed and represented to become effective supervised fine-tuning (SFT) data?" (§1).

Setting (§4.1–4.3):
- **Collections:** the four, as prompt–answer pairs; external ones keep their original prompts (§3.1).
- **Models:** SmolLM2-135M, SmolLM2-360M, OLMo-1B and SmolLM3-3B-Base, pretrained base models; 300 to 2,400 updates.
- **Evaluation:** answer NLL wherever all scores were logged; accuracy and F1 at 3B, where the authors say they become discriminative. Benchmarks: DROP (reading comprehension with arithmetic), LogiQA (logic questions), ARC-Challenge (science questions), BBH-test and MMLU-other (a multiple-choice knowledge test, here 47 subjects without mathematics, formal logic and computer science) (§4.2).
- **No tuning per collection:** learning rates and the 20% share were set on Reasoning Gym and then fixed (§4.1); BBH-development and FineWeb NLL were the only development signals (§4.3).

## Approach

**Design choices** (§3.1, run-in headings):
- **Broad distributions:** generators vary structure, and planning and game generators sample whole domains, not one fixed environment ("Broad, structured problem distributions").
- **Difficulty:** one scalar level maps to task parameters (e.g. depth, plan length, variable count); levels up to 5 stay practical for every generator "by convention" ("Difficulty control and forced sampling").
- **Targets:** compact answers (e.g. a number, label, set, plan, short program) rather than explanations, with a deterministic canonical form "when suitable". "Training thus uses a canonical target while evaluation accepts any semantically valid answer": sets compared without order, lambda terms (expressions of a minimal functional language) up to renaming, plans executed, proofs compiled, programs tested ("SFT-aware answer design and semantic scoring").
- **External solvers** run behind a common layer with Docker images, pinned versions and isolation, and verifier failures are kept apart from wrong answers ("External tools and reproducibility"). App. A names e.g. the Lean REPL (the Lean proof assistant run as a checker), ProbLog (probabilistic logic programming), an automated theorem prover, Clingo (a solver for answer-set programs, a form of logic programming) and DuckDB (an embedded SQL engine, the oracle for generated table queries).

**Coverage:** 50 generators in nine descriptive groups (Tab. 1; App. A); one interface also wraps Reasoning Gym and SynLogic (§3.2).

**Audit** (§3.4): repeated GPT-5.5/5.6 High reviews of code, prompts, targets and scorers; Claude Haiku 4.5, without reasoning, answered sampled examples at difficulty 0 and 1; every case with a reward other than 1 adjudicated by Claude Opus, then by a person; confirmed failures reduced to minimal examples and covered by regression tests. "Model judgments were never treated as ground truth." The authors corrected their own tasks until the final reviews found no further material defects, then audited the external collections. Also: a checklist (App. C, Tab. 4) and `validate` smoke tests (App. C).

## Results

- **Collection comparison** (§5.1, Tab. 2): at 3B after 2,400 updates over 5 seeds, Reasoning Core leads on all four Reasoning metrics, e.g. DROP F1 41.7 against 33.1 main-only and 39.2 for Reasoning Gym; Reasoning Gym leads on MMLU-other. Across models and durations each collection gives positive reasoning transfer in at least some settings, but their order varies (Fig. 1; App. D.2, Tab. 6).
- **Task ranks across models** (§5.2.1, Tab. 3): within the SmolLM2 family, isolated-task ranks agree with Kendall's τ_b of +0.68 (Reasoning Core), +0.75 (Reasoning Gym) and +0.88 (SynLogic); agreement with OLMo-1B is lower, and negative for SynLogic. The diagnostic is "explicitly developmental" (§5.2.1).
- **Learnability and format** (§5.2.2; App. D.4, Tab. 8), observational, on Reasoning Gym tasks: native reward gain says more than initial reward; intermediate final rewards show the strongest held-out transfer, and fully saturated tasks (where native reward reaches its ceiling) don't transfer better. Grid and board tasks form a negative cluster, on FineWeb mostly explained by length; matching the auxiliary token share improves BBH in all 18 paired OLMo-1B tasks, but long examples stay costly. The authors read the task analyses as showing that "semantic validity alone does not ensure training utility" (abstract).
- **Step-by-step targets** (§5.2.3): for tasks including parsing (the Earley parser's steps) and graph pathfinding (breadth-first search and Dijkstra traces), correct traces did worse than compact answers on BBH-development and FineWeb NLL, with or without matched budgets; "a faithful transcript of a correct algorithm can be a worse training target than the answer it computes".
- **Zero-shot solvability** (§5.3; App. B, Fig. 3): DeepSeek V4 Flash in High reasoning mode stays below 0.75 reward on 18 of 50 tasks; neither Flash (roughly 300B parameters) nor Pro (roughly 1.6T, Instant mode) fully solves the collection.
- **RL** (§5.4, Fig. 2): in a matched single-seed GRPO run on Qwen2.5-3B-Instruct (an instruction-tuned 3B model), Reasoning Core reaches, at the final checkpoint, 38.6% against 23.1% for Reasoning Gym on BBH-test, and 62.5% against 43.2% on MMLU, but the Reasoning Gym run falls below the base model on MMLU, "suggesting run-specific instability rather than a reliable collection-level difference"; the gap is "illustrative only", and the narrower conclusion is that the library "can support verifier-backed RL".
- **Audit** (§3.4; App. F–G): under "conservative criteria", confirmed material default-path defects in 13 of 105 Reasoning Gym tasks and nine native SynLogic generators, e.g. a Reasoning Gym scorer giving full credit to any nonempty answer and a SynLogic Futoshiki generator (a grid puzzle with inequality clues) whose signs ignore the stored grid (Tab. 10–11). Non-unique answers are listed apart, not counted.

## Limits the authors state

- "our evidence stops at 3B parameters, so whether these trends persist at larger scales remains unknown; model-family coverage is also limited" (§ "Limitations").
- The evaluation emphasizes formal and closed-answer reasoning; "it does not establish improvements on open-ended, multimodal, or real-world agentic tasks" (§ "Limitations").
- No comparison with matched mixtures of DOLCI's human-curated parts such as GSM8K or MATH (math problem sets), and no formal-logic benchmarks beyond MMLU and BBH (§ "Limitations").
- Sequential fine-tuning then RL on one collection is untested; "whether the same procedural collection should be reused for sequential SFT and RL remains open" (§6; § "Limitations").
- The RL comparison has one seed and "should be interpreted as a demonstration of viability rather than a precise estimate of the collection-level margin" (§ "Limitations").
- The external audits were "retrospective and neither independent nor blinded"; "These findings are not aggregate judgments of either library", and are "not to establish a quality ranking" (§3.4).
- The `validate` checks "do not establish semantic correctness, target uniqueness, shortcut resistance, learnability, or mixture utility" (App. C).
- "A generator does not have a single model-independent value" (§6); the diagnostics "do not define a universal automatic selection rule" (§3.3); task-level screening is used "as a low-cost development diagnostic rather than as a model-independent valuation method" (§2).
- Answer NLL "could in principle reward answer-format adaptation"; Retention is the authors' control (§4.2).
- "The result does not imply that rationale supervision is generally harmful" (§5.2.3).

## Open problems and building blocks

- **Open:** none stated beyond the sequential fine-tuning-then-RL question under Limits (§6); the conclusion says the released diagnostics support future comparisons of the two (§7).
- **Released:** the library, generated datasets and audit material (abstract, its footnote), with versioned manifests, caches, behavior hashes (records of each generator's behavior, for reproducibility) and task-level measurements (§1; §3.2); Procedural Pile, approximately 10 billion prompt-and-answer tokens from Reasoning Core under CC BY 4.0, with slices of the three other collections under their own licenses; code under MIT (App. E.3).
- **To reuse it:** Docker images for the solvers and runtimes (§3.1 "External tools and reproducibility"), the external solvers above for some generators (App. A), and the fine-tuning configuration (App. E.1, Tab. 9).

## On this site

- **Discussed in:** [Benchmarks with checkable ground truth](#/challenges/checkable_benchmark_ground_truth) · [Can SQL equivalence checkers be trusted?](#/challenges/checker_soundness) · [A gym of DSL tasks with answer keys made by code](#/challenges/dsl_gym) · [Gains made against a checker, carried beyond it](#/challenges/transfer_beyond_the_checker)
- **Tags:** <span class="tags"><a class="tag" href="#/tags/gym">gym</a><a class="tag" href="#/tags/labels">labels</a><a class="tag" href="#/tags/transfer">transfer</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/rlvr-general">rlvr-general</a></span>
