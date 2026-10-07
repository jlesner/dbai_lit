# SQL-Zero: Self-Evolving Text-to-SQL

**SQL-Zero** · preprint 2026

Read: [PDF](https://arxiv.org/pdf/2609.04697) · [arXiv](https://arxiv.org/abs/2609.04697)  
Code: [sql-zero](https://anonymous.4open.science/r/sql-zero-artifact-478E)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Challenger–solver self-play with GRPO and zero annotated pairs.
- The solver is rewarded for matching the challenger's results on one database; no equivalence checker.
- The closest listed prior work to the SQL ↔ text ↔ verify loop, by our judgement; the authors call SPFT-SQL ([SPFT-SQL](#/papers/zhang2025spftsql "SPFT-SQL: Enhancing Large Language Model for Text-to-SQL Parsing by Self-Play Fine-Tuning (2025)")) "the closest T2SQL self-play" (§2).

## In plain words

Text-to-SQL models, which turn a question about a database into an SQL query, are usually trained on human-written question–query pairs, which the authors call "a bottleneck for scaling to new databases" (abstract). SQL-Zero trains with none. Two copies of one language model take turns training each other by trial and reward: a challenger writes an SQL query and then a question for it, and a solver answers the question with its own query. The solver is rewarded when its query returns the same rows as the challenger's on that one database. The challenger is rewarded for questions the solver gets right only now and then.

The authors report gains on the BIRD benchmark over the untrained model at two sizes, and, for the smaller model, higher scores than the same recipe trained on human pairs, by margins their statistical test does not resolve (abstract). They present it as showing "it is possible to train a competitive solver with zero annotated pairs" (abstract).

## Background and terms

**Terms to know:** [text-to-SQL](#/glossary/text-to-sql) · [execution accuracy](#/glossary/execution-accuracy) · [gold query](#/glossary/gold-query) · [reinforcement learning](#/glossary/reinforcement-learning) · [RL with verifiable rewards](#/glossary/rl-with-verifiable-rewards-rlvr) · [GRPO](#/glossary/grpo) · [self-play](#/glossary/self-play)

**The paper's own terms:**
- **challenger / solver**: the two roles, both started from one Qwen2.5-Coder-Instruct model (§3.1).
- **candidate gold**: the challenger's SQL, written before its question ("SQL-first"); it plays the gold query's role in training (§3.1).
- **masked SQL template**: a query with its literal values masked; used for deduplication and the repetition penalty (§3.1, §5).
- **iteration, spiral**: one round of challenger training, pair generation and solver training; the spiral is the chain of rounds, each role starting from its own last checkpoint (§3.1).
- **gold control**: the same 3B recipe trained on 8,390 human BIRD pairs over the same training databases (§5).
- **KL term** (not in the glossary): a penalty keeping the trained model close to its start (§4).
- **policy entropy** (not in the glossary): how varied the model's outputs are (§6).
- **McNemar's exact test** (not in the glossary): a significance test for two systems on the same examples, using only those where exactly one is right (§5).

**Builds on:** Dr. Zero (not listed), for the co-evolving loop and the difficulty function (§2, §3.3); R-Zero (not listed), for the repetition penalty (§2, §3.3); Absolute Zero ([Absolute Zero](#/papers/zhao2025absolutezero "Absolute Zero: Reinforced Self-play Reasoning with Zero Data (2025)")), for a determinism filter the authors say they reuse (§2); OmniSQL (not listed), for SQL-first synthesis with template deduplication (§2).

## Problem and setting

- **Question:** "can execution-verified self-play improve a T2SQL solver without annotated NL–SQL training pairs?" (§1), where T2SQL is text-to-SQL and NL natural language.
- **Allowed inputs:** schemas, database contents and execution (§3.1).
- **Data:** training on 64 of BIRD-train's 69 databases (App. C); evaluation on BIRD dev ([BIRD](#/papers/li2023bird "Can LLM Already Serve as A Database Interface? A BIg Bench for Large-Scale Database Grounded Text-to-SQLs (2023)"), same benchmark, other databases), Spider test ([Spider](#/papers/yu2018spider "Spider: A Large-Scale Human-Labeled Dataset for Complex and Cross-Domain Semantic Parsing and Text-to-SQL Task (2018)"), unseen databases) and Spider-Syn (Spider's schemas with reworded questions, "unseen phrasing") (§4, §5).
- **Models:** Qwen2.5-Coder-3B- and 7B-Instruct, with 3 and 7 billion parameters (§4).
- **SQL fragment:** generated queries are `SELECT`s; SQLite only (§3.1, §6).
- **What "correct" means:** in training, the solver's result equals the candidate gold's on the pair's one database, compared as [bags](#/glossary/bag-semantics) unless the gold contains `ORDER BY`, then in order ([list semantics](#/glossary/list-semantics)) (§3.2). In evaluation, execution accuracy from one greedy sample (greedy@1) through the OmniSQL prompt and pipeline (§4).
- **Noise:** the authors treat differences below roughly two points as non-conclusive (§4).
- **NULLs:** not discussed.

## Approach

- **The loop (§3.1, Fig. 1–2).** Each iteration (1) trains the challenger against the previous solver; (2) the challenger samples SQL-first pairs for a schema and a target complexity level, admitted only if the SQL is a deterministic `SELECT` with a non-empty result and the question does not leak SQL, then deduplicated by template; (3) trains the solver on them with GRPO, 8 samples per question. The roles train in turn, the other frozen (§3.3); one epoch each, no KL term (§4).
- **Solver reward (Eq. 2, §3.2).** 1.0 if its result matches the candidate gold's, 0.1 if it runs but differs, 0 if it fails; the tiers follow Arctic-Text2SQL-R1, an RL system trained on human pairs (§2). The 0.1 tier keeps a group's rewards from all being equal, which would leave GRPO no signal (§2, §3.2). The reported recipe mixes in, with weight 0.1, a bonus for a non-empty `<think>` block before the SQL (§3.2).
- **Challenger reward (Eqs. 4–5, §3.3).** Half a format score (pair complete, no leak, reasoning block, valid gold), plus a difficulty score, minus a repetition penalty, floored at zero. For difficulty, the frozen solver answers 5 times: the score is highest when exactly one answer matches, falls as more match, and is zero when none or all do. The penalty grows with the share of the batch sharing the pair's masked template. GRPO's baseline is computed within each complexity level ("HRPO-lite").
- **Prompt (§3.4).** The full schema with three example rows per table; no schema-linking step.

## Results

- **Against the base (Tab. 1, §5).** At the best iteration, BIRD dev rises 6.6 points at 3B and 7.3 at 7B over the untrained (zero-shot) base; most arrives at the first iteration. "No sequence compounds" (§5).
- **Against the gold control (§5).** All three 3B iterations exceed it by 1.8 to 3.4 points, but no McNemar test is significant; the authors call this "bounded, directional evidence".
- **Against CSC-SQL-3B** (a generator trained with GRPO on human BIRD pairs, §2). It stays ahead on BIRD dev, 48.3 against 45.3 (Tab. 1), and on Spider test; two of three iterations pass it on Spider-Syn (§5).
- **Transfer (§5).** At 3B every iteration beats the base on both Spider sets. At 7B iterations 2–3 fall below it, by 2.4–2.5 points on Spider test and 1.1–1.3 on Spider-Syn. OmniSQL-7B (fine-tuned on 2.5M synthetic pairs) and Arctic-Text2SQL-R1-7B stay stronger (Tab. 1, §5).
- **Static generation fails at 7B (§5).** With the base model as a challenger that is never trained, and no repetition penalty, the solver's groups become all-correct, GRPO gets no signal, and validation accuracy falls below the base.
- **Not reconstruction (§5).** Generated and human corpora share almost no templates.
- **Strong start (App. A, Tab. 2).** One iteration on OmniSQL-7B with BIRD tasks raises BIRD from 63.8 to 65.5.
- **Ablations (App. B, internal harness, not comparable to Tab. 1).** No reasoning-bonus comparison is significant after correcting for multiple tests; a format reward cannot bring back reasoning once training has removed it; training past one epoch erodes transfer.

## Limits the authors state

- All training arms are single runs; the paired test covers evaluation noise, not training-seed noise (§5, §6).
- The gold control is not budget-matched: 32 updates against 78 (§6).
- Only Qwen2.5-Coder, SQLite and single-shot generation; "cross-family, cross-dialect, and broader robustness conclusions are untested" (§6).
- The template-coverage comparison is descriptive; benchmark annotation errors can change small differences (§6).
- Gaps to external systems "cannot be charged to labels, coverage, or test-time self-consistency alone" (§6).
- Iterations don't compound the first gain; generator diversity, the solver's training signal and policy entropy fall across turns, and the diagnostics don't say which causes the plateau (§6).
- The difficulty reward's adaptation is "not re-ablated here" (§3.1); 3B transfer is not isolated from BIRD's difficulty (§5).

## Open problems and building blocks

- **Open:** admit only pairs the solver gets right one to four times in five, against unfiltered generation at matched budget; counter the entropy decline with an entropy floor, a KL term or a partial reset; adaptive exploration, mixtures of earlier opponents, training-only early stopping (§6). "Later turns remain a curriculum-control problem" (§7).
- **Released:** code, configurations, prompts, the seed policy, the database gate, the paired-significance and coverage analyses, and the training-history export scripts; checkpoints withheld during review (§ "Ethics and Reproducibility"; App. C).
- **To reuse it:** executable databases with schemas and contents (§7); Qwen2.5-Coder-3B/7B; a 3B solver iteration takes 6–9 hours on two GPUs, a 7B one about 26 hours on three, about 820 GPU-hours overall (App. C). 3B results are research-only by licence (App. C).

## On this site

- **Discussed in:** [Self-improvement that compounds](#/challenges/compounding_self_improvement) · [Comparing LLM methods under noise](#/challenges/method_comparison_under_noise) · [Equivalence of nondeterministic queries](#/challenges/nondeterministic_equivalence) · [The self-improving SQL ↔ text ↔ verify loop](#/challenges/sql_text_round_trip_loop) · [Weak checkers get exploited](#/challenges/weak_checker_exploitation)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/llm-gen">llm-gen</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/nl2sql-data">nl2sql-data</a><a class="tag sub" href="#/tags/nondet-eval">nondet-eval</a><a class="tag sub" href="#/tags/rlvr-sql">rlvr-sql</a></span>
