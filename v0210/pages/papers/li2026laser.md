# LASER: A Data-Centric Method for Low-Cost and Efficient SQL Rewriting based on SQL-GRPO

**LASER** · preprint 2026

Read: [PDF](https://arxiv.org/pdf/2604.06804) · [arXiv](https://arxiv.org/abs/2604.06804)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Small-model rewriter trained with SQL-GRPO on SQL-MCTS, a corpus of complex slow queries.
- Its slow-query generator sorts results before hashing to compare them (§4.2); the evaluation says only that results must be "identical", not how rows are matched (§6.1.4).
- Compact models for rewriting; its "Anchored Group Advantage" reduces to a rescaled relative advantage.

## In plain words

Query rewriting turns a slow SQL query into one that returns the same answer faster. The authors argue that rule-based rewriters adapt poorly, while rewriters built on large hosted language models are costly, slow, and send private queries to outside services (abstract, §1). LASER trains small open models (Qwen3, 8 and 14 billion parameters). It first builds SQL-MCTS, 11,675 slow queries made by a tree search in which a large model makes seed queries slower while keeping their results (§1). The small model is then fine-tuned on rewrites by the large reasoning model DeepSeek-R1 and trained further by trial and reward on measured run time, with two changes meant to focus sampling on hard queries and to stop rewarding slow but valid rewrites (§1). A rewrite counts as equivalent when both queries return identical results on the test database (§6). On the authors' slow-query set (PostgreSQL, 10 GB of data), the 14-billion-parameter model cuts mean query time from 69.73 s to 13.03 s, against 13.40 s for DeepSeek-R1 (§6.3). The authors call their training method "a novel alignment strategy" (§1).

## Background and terms

**Terms to know:** [query rewriting](#/glossary/query-rewriting-and-rewrite-rules) · [query equivalence](#/glossary/query-equivalence) · [reinforcement learning](#/glossary/reinforcement-learning) · [GRPO](#/glossary/grpo) · [Distillation into compact models](#/glossary/distillation) · [KL penalty](#/glossary/kl-penalty) · [policy entropy](#/glossary/policy-entropy) · [correlated subquery](#/glossary/correlated-subquery) · [MCTS](#/glossary/monte-carlo-tree-search-mcts) (here selection uses the UCT score, Eq. 1, and nodes are scored by running the queries; §4.2, Fig. 2) · [CTE](#/glossary/common-table-expression-cte) (§6.8)

**The paper's own terms:**
- **Equivalence, two senses**: the task asks for "an equivalent form" of the query (§2.1); the reported **Equivalence Rate** is the share of rewrites "verified by executing both queries and comparing whether their results are identical" (§6.1.4).
- **Result-set hash**: in corpus generation, results are compared by hashing rows after "a mandatory in-memory sort of the result set" (§4.2, Eq. 2).
- **Slow query, SQL-MCTS**: a search-tree leaf at least twice as slow as its seed; SQL-MCTS holds 11,675 of them grown from 3,000 seeds on the TPC-DS schema (§4.3).
- **Slowdown Causes**: anti-patterns an LLM extracts by inverting the rewrite rules of Apache Calcite (an open-source query-optimizer framework), e.g. turning joins into correlated subqueries; a "Reverse Query Optimizer" (§4.2).
- **Performance-Driven Hierarchical Reward**: fixed penalties for no SQL in the output, an execution error, or a result that differs from the reference query's (−3, −2.5, −1.5, §6.1.5); otherwise a bounded score of the speedup, tripled when the rewrite is faster (§5.2, Eq. 7–8).
- **Complexity-Adaptive Dynamic Rollout**: each training query first gets a small pilot batch of samples; the rest of the sampling budget is shared in proportion to a weight that adds a flag for queries with no valid rewrite yet, the policy entropy, and the spread of the pilot rewards (§5.2, Eq. 9, Fig. 3).
- **Anchored Group Advantage**: GRPO's advantage mixed with an "absolute" term (the reward minus a fixed baseline, over a fixed scale, times the square root of the group size), then centred on the group mean; the authors state that "the negative absolute component dominates to suppress misleading relative signal" in poor groups (§5.2, Eq. 10, Fig. 4).
- **Verification-Driven Self-Correction**: at inference each rewrite goes to the database's `EXPLAIN` command (which plans a query without running it) as a "zero-cost syntax filter"; on an error the model rewrites again, given the message (§5.3).

**Builds on:**
- GRPO, from DeepSeekMath ([DeepSeekMath](#/papers/shao2024deepseekmath "DeepSeekMath: Pushing the Limits of Mathematical Reasoning in Open Language Models (2024)")): SQL-GRPO is "adapted from Group Relative Policy Optimization" (abstract, §5.2).
- SQL-Factory, an LLM-based SQL generator (not listed here), prompted with complexity constraints to make the seeds (§4.1).
- Apache Calcite's rewrite rules ([Apache Calcite](#/papers/begoli2018calcite "Apache Calcite: A Foundational Framework for Optimized Query Processing Over Heterogeneous Data Sources (2018)")), inverted into the Slowdown Causes (§4.2).
- Compared against first (§6.1.3): the rule-based rewriters LearnedRewrite ([LearnedRewrite](#/papers/zhou2021learnedrewrite "A learned query rewrite system using Monte Carlo tree search (2021)"), tree search with a learned cost model), LLM-R² ([LLM-R2](#/papers/li2024llmr2 "LLM-R2: A Large Language Model Enhanced Rule-Based Rewrite System for Boosting Query Efficiency (2024)"), LLM rule selection by in-context learning) and R-Bot ([R-Bot](#/papers/sun2024rbot "R-Bot: An LLM-based Query Rewrite System (2025)"), retrieval-augmented rule selection); DeepSeek-R1 ([DeepSeek-R1](#/papers/deepseek2025reasoning "DeepSeek-R1: Incentivizing Reasoning Capability in LLMs via Reinforcement Learning (2025)"), also the fine-tuning teacher, §5.1) and GPT-4o rewriting directly; and a naive GRPO model standing for E³-Rewrite ([E3-Rewrite](#/papers/xu2025e3rewrite "E3-Rewrite: Learning to Rewrite SQL for Executability, Equivalence, and Efficiency (2025)"), an RL-trained rewriter).

## Problem and setting

- **Question:** can a small, locally run model, trained on generated slow queries with rewards from real execution, rewrite SQL for speed better than rule-based and LLM-based rewriters, more cheaply and without sending data out (§1)?
- **SQL fragment:** not stated; seeds are steered toward "deeply nested subqueries and multi-table joins" (§4.1).
- **Correctness:** identical results on one database, by sorted-row hashes in generation (§4.2) and result comparison in evaluation (§6.1.4). Set versus bag semantics and NULLs: not discussed.
- **Speed:** one warm-up run, then the mean of three runs; over 300 s is a timeout; mean, median, 75th and 95th percentile latency (§6.1.4).
- **Engine and data:** PostgreSQL 13 on a 2-core, 4 GB cloud server (§6.1.1), MySQL in §6.7; 10 GB of data per benchmark (§6.1.2), plus 1 and 50 GB for DSB (§6.5).
- **Benchmarks (§6.1.2):** TPC-DS (decision support, 24 tables, 103 queries), DSB (TPC-DS with harder data distributions, 37 templates), TPC-H (8 tables, 22 templates) and Calcite, "a real-world benchmark mainly used to evaluate rewrite rules", 50 of 793 queries. TPC-H and Calcite are the schemas unseen in training (§6.4).
- **Models:** Qwen3-8B and -14B as base models; DeepSeek-V3 writes and audits the slow variants (§4.3, §6.1.5); DeepSeek-R1 writes the fine-tuning targets (§5.1).

## Approach

- **Seeds (§4.1):** from SQL-Factory; seeds that fail or return nothing are dropped.
- **Slow-query search (§4.2, Fig. 2):** expansion asks the LLM to apply an unused Slowdown Cause or to add an inefficiency freely. Variants run asynchronously on a scaled-down database. The reward (Eq. 5) is a penalty for failure or a changed result hash; a fixed reward for a timeout, "since result equivalence cannot be verified for timed-out queries"; otherwise a bounded slowdown score plus structural novelty, the tree edit distance between syntax trees from the SQL parser SQLGlot (Eq. 3–4).
- **Corpus (§4.3):** leaves at least twice as slow are kept; DeepSeek-V3 removes slowdowns from "syntactic noise" such as superfluous `ORDER BY` clauses.
- **Fine-tuning (§5.1):** on 30% of SQL-MCTS, DeepSeek-R1 writes reasoning and a rewrite from the schema, the slow query and its `EXPLAIN` plan.
- **SQL-GRPO (§5.2):** GRPO with the hierarchical reward on real execution "rather than theoretical optimizer cost estimates", the dynamic rollout, the Anchored Group Advantage and a KL penalty toward the fine-tuned model (Eq. 11). The baseline is set to 0 "to enforce absolute correctness constraints", and the other coefficients "are set to equal weights" (§6.1.5).
- **Inference (§5.3):** the `EXPLAIN` check with regeneration.

## Results

The authors report (PostgreSQL unless noted):
- **Training-schema benchmarks (Tab. 3, §6.3):** LASER-14B's mean latency against the original queries and DeepSeek-R1: SQL-MCTS 69.73 → 13.03 s against 13.40 s, with 90% equivalence; TPC-DS 49.00 → 27.16 s against 26.87 s; DSB 44.88 → 10.33 s against 19.03 s. They say the rule-based methods' "limited set of rules cannot effectively handle such complex queries".
- **Unseen schemas (Tab. 5, §6.4):** mean latency TPC-H 77.43 → 31.78 s (DeepSeek-R1 38.70 s), Calcite 32.59 → 9.98 s (DeepSeek-R1 13.00 s); equivalence 100% and 75% against DeepSeek-R1's 86% and 89%. The authors say LASER-14B "achieves the best results across all metrics".
- **Data size (Tab. 6, §6.5):** on DSB at 1, 10 and 50 GB, LASER-14B has the lowest latency, or ties for it, in every column among the LLM, Qwen3 and LASER rows (no rule-based rows).
- **Cost (Tab. 4, §6.3, DSB):** per 10,000 queries, $5.92 (8B) and $15.6 (14B) against $23.7–$2,075.5 for the others; rewrite time 24.6 and 28.8 s against 18.5 s for GPT-4o and 43.9–982.3 s for the rest. The authors conclude LASER shows "significantly faster rewrite times".
- **Ablation (Tab. 7, §6.6, DSB):** full LASER-14B (10.40 s, 83%) beats every variant on all five columns; variants reach 11.78–18.57 s and 64–78%, naive GRPO being slowest. The authors explain the drop without Anchored Group Advantage by "disproportionately high advantages to poorly performing samples".
- **MySQL (Tab. 8, §6.7, DSB):** LASER-14B's mean latency is a little above DeepSeek-R1's and its equivalence rate a little higher; the authors call this "comparable to DeepSeek-R1".
- **Corpus quality (Tab. 1–2, §6.2):** three PhD-level students rated 100 queries sampled from SQL-MCTS and SQL-Factory against the benchmarks; SQL-MCTS scores 4.26 on Optimization Non-Triviality (a 5-point scale) against TPC-DS's 4.25, and its "Top 70%" subset 4.74, "surpassing all benchmarks".
- **Case study (Fig. 5, §6.8):** LASER-14B moves a twice-computed aggregation into a CTE.
- **ByteDance deployment (§6.9):** of 462 production queries over 129 databases, LASER-14B rewrote 69; 73% of those got faster, with an average latency reduction of 23.1%.

## Limits the authors state

- Timed-out search variants get a fixed reward, "since result equivalence cannot be verified for timed-out queries", without the structural bonus "as a penalty for semantic uncertainty" (§4.2).
- QUITE (an LLM multi-agent rewriter) is not compared, "as its complex agent-based architecture and lack of open-source availability prevent a fair comparison" (§6.1.3).

## Open problems and building blocks

- **Open:** None stated (§7 names no future work).
- **Released:** the front matter's "PVLDB Artifact Availability" note says "The source code, data, and/or other artifacts have been made available" (p. 1).
- **To reuse it:** Qwen3-8B or -14B and the Verl training framework; training took about 34.9 hours (§6.1.5) on 8 A800 80 GB GPUs (§6.1.1); building SQL-MCTS took about 6.3 days with DeepSeek-V3 (§4.3); every sampled rewrite is run on a database during training (§5.2); inference needs 32 or 40 GB of GPU memory (Tab. 4). The authors say LASER is "not overfitted to PostgreSQL's planner logic" (§6.7).

## On this site

- **Discussed in:** [Bringing compact models to frontier accuracy](#/challenges/compact_model_accuracy) · [Comparing LLM methods under noise](#/challenges/method_comparison_under_noise) · [Equivalence of nondeterministic queries](#/challenges/nondeterministic_equivalence) · [Verified query speedups](#/challenges/verified_query_speedup) · [Weak checkers get exploited](#/challenges/weak_checker_exploitation)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/harness-sql">harness-sql</a><a class="tag sub" href="#/tags/llm-gen">llm-gen</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/rewrite-llm">rewrite-llm</a><a class="tag sub" href="#/tags/rlvr-sql">rlvr-sql</a></span>
