# E3-Rewrite: Learning to Rewrite SQL for Executability, Equivalence, and Efficiency

**E3-Rewrite** · preprint · 2025

Read: [PDF](https://arxiv.org/pdf/2508.09023) · [arXiv](https://arxiv.org/abs/2508.09023)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- LLM rewriter trained with GRPO on executability, equivalence and cost rewards.
- Equivalence reward: QED first; on *unknown*, an LLM judge; only if the judge is inconclusive, execution on sampled databases.
- A verifiable-reward rewriter whose reward falls back to unverified checks.

## In plain words

A query can run faster when rewritten into an equivalent but cheaper form. Most rewriters apply fixed rules, which the authors say miss many useful rewrites (§ "Introduction"). E3-Rewrite has an LLM write the rewrite directly. Its prompt includes the database's plan for the query, and [reinforcement learning](#/glossary/reinforcement-learning) trains it on three rewards: the database accepts the rewrite, a checker finds it equivalent, and the database's own cost estimate drops. The authors present it as "the first LLM-based SQL rewriting framework" producing executable, equivalent and efficient queries "without relying on rule sets" (§ "Introduction"). They report execution time "as much as 25.6%" shorter than leading baselines and "up to 24.4% more rewrites" meeting equivalence criteria, across multiple benchmarks (abstract).

## Background and terms

**Terms to know:** [query rewriting](#/glossary/query-rewriting-and-rewrite-rules) · [query equivalence](#/glossary/query-equivalence) · [reinforcement learning](#/glossary/reinforcement-learning) · [GRPO](#/glossary/grpo) · [KL penalty](#/glossary/kl-penalty) · [LLM-as-a-judge](#/glossary/llm-as-a-judge)

**The paper's own terms:**
- **execution hint**: the query's execution plan (operators, join order, index use) as indented text before the query in the prompt (§ "Execution Hint Injection"). Training takes it from PostgreSQL's EXPLAIN ANALYZE, which runs the query and records real times; inference uses EXPLAIN, which only plans.
- **optimizer-estimated cost**: the optimizer's predicted cost of a plan, read from EXPLAIN without running the query (Eq. 4).
- **Equivalence Rate** (called Equivalence Ratio in Fig. 3 and Tabs. 2, 4): the share of rewrites whose output tuples match the original's "when executed on the same database instance" (§ "Experiment Setting").
- **Improved Queries**: rewrites that cut execution time by at least 10% (§ "Experiment Setting").
- **demonstration pool**: past (original, rewrite) pairs, the most similar put in the prompt as examples (§ "Hybrid Demonstration Retrieval").

**Builds on:**
- GRPO, adopted from DeepSeek-R1 ([DeepSeek-R1](#/papers/deepseek2025reasoning "DeepSeek-R1: Incentivizing Reasoning Capability in LLMs via Reinforcement Learning (2025)")) because it needs no value network (§ "Reinforcement Learning for SQL Rewriting").
- QED-Solver ([QED](#/papers/wang2024qed "QED: A Powerful Query Equivalence Decider for SQL (2024)")), a formal SQL equivalence checker, as the first equivalence stage (same section).
- The rule-based rewriters it compares against: LearnedRewrite ([LearnedRewrite](#/papers/zhou2021learnedrewrite "A learned query rewrite system using Monte Carlo tree search (2021)")), LLM-R² ([LLM-R2](#/papers/li2024llmr2 "LLM-R2: A Large Language Model Enhanced Rule-Based Rewrite System for Boosting Query Efficiency (2024)")) and R-Bot ([R-Bot](#/papers/sun2024rbot "R-Bot: An LLM-based Query Rewrite System (2025)")) (§ "Introduction", § "Experiment Setting").

## Problem and setting

- **Question:** can an LLM trained on execution feedback, without rules, write rewrites that run, stay equivalent and are faster?
- **Correctness** (§ "Problem Formulation"): the rewrite must parse and run on the target database; return identical result sets on every database instance; and have lower runtime. Set or bag semantics, NULLs and ORDER BY: not discussed.
- **Benchmarks** (§ "Experiment Setting"): about 2,000 queries each from TPC-H (a decision-support benchmark, 22 query templates, 10 GB), IMDB (JOB, queries derived from the Join Order Benchmark over a movie database) and DSB (an extension of the TPC-DS decision-support benchmark), on PostgreSQL 14. Timeouts count as 300 s.
- **Models:** fine-tuned Qwen3 and LLaMA4; training configurations are deferred to "the supplementary material" (§ "Experiment Setting").
- **Baselines:** LearnedRewrite (Monte Carlo tree search, a search that tries rule sequences at random and favours promising ones, guided by a learned cost model), LLM-R² (described as prompting GPT-3.5 and applying rules from Apache Calcite, an open-source query optimizer framework), R-Bot (retrieval-augmented, step-by-step rule selection) and GPT-4o rewriting alone.

## Approach

- **Prompt:** execution hint, query, and the k demonstrations most similar by a weighted mix of syntax-tree edit distance and embedding similarity (Eqs. 5–7).
- **Training** (§ "Reinforcement Learning for SQL Rewriting"): GRPO samples several rewrites per query and scores each against the group's mean (Eq. 1), with a KL penalty (Eq. 2). The reward is a weighted sum of three parts (Eq. 3):
  - *Executability*: run EXPLAIN on the rewrite; 1 if it passes parsing and semantic analysis, else 0.
  - *Equivalence*: QED-Solver first: 1 if it proves equivalence, 0 if it refutes it. On an unknown verdict (timeout, unsupported constructs), "a lightweight LLM-based semantic judgment". If that is inconclusive, both queries run on sampled databases: 1 only if outputs match exactly.
  - *Performance*: the fraction by which the rewrite lowers the optimizer-estimated cost, zero if it doesn't (half the cost gives 0.5; Eq. 4).
- **Curriculum:** stage 1 uses only executability and equivalence; stage 2 adds performance once correctness holds consistently, optionally replaying some stage-1 examples.
- **Pool update:** a rewrite that is equivalent and fast enough (the text's example: over 1.5× speedup) joins the pool (§ "Hybrid Demonstration Retrieval").

## Results

- **Latency** (Tab. 1): TPC-H average 29.67 s for E3-Rewrite (Qwen), against 39.89 s for the best baseline (R-Bot) and 78.81 s unrewritten; lowest average, median and 90th-percentile (p90) latency on all three benchmarks. LLaMA is slower than Qwen throughout.
- **Equivalence and improved queries** (Fig. 3): equivalence ratios of 99.6% (TPC-H), 99.4% (IMDB) and 98.8% (DSB); the authors claim the most improved queries and highest ratios "across all datasets".
- **Model size** (Tab. 2): Qwen 14B is worse than 32B on all TPC-H metrics.
- **Data scale** (Tab. 3): lowest average and p90 at TPC-H 1, 5, 10 GB.
- **Ablation** (Tab. 4, TPC-H): without RL the equivalence ratio falls from 99.6% to 90.1%; without plan hints average latency rises from 29.67 s to 39.56 s; the base model without fine-tuning or structured input is worst on every metric.

## Limits the authors state

None stated.

## Open problems and building blocks

- **Open:** none stated.
- **Released:** code, models: nothing stated. Training configurations and hyperparameters are said to be in "the supplementary material" (§ "Experiment Setting").
- **To reuse it:** PostgreSQL, QED-Solver, an LLM judge, sampled databases, a sentence encoder, and fine-tuning Qwen3 or LLaMA4 (Qwen 14B and 32B in Tab. 2) on 8 A100 GPUs (§ "Experiment Setting").

## On this site

- **Discussed in:** [Can a memory across problems be checked before it is reused?](#/challenges/verified_memory) · [Verified query speedups](#/challenges/verified_query_speedup) · [SQL features that verifiers don't cover](#/challenges/verifier_coverage_gaps) · [Weak checkers get exploited](#/challenges/weak_checker_exploitation)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/harness-sql">harness-sql</a><a class="tag sub" href="#/tags/judge-sql">judge-sql</a><a class="tag sub" href="#/tags/llm-gen">llm-gen</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/rewrite-llm">rewrite-llm</a><a class="tag sub" href="#/tags/rlvr-sql">rlvr-sql</a></span>
