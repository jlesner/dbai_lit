# SPA: A SQL-Plan-Aware Reinforcement Learning Framework for Query Rewriting with LLMs

**SPA** · preprint 2026

Read: [PDF](https://arxiv.org/pdf/2606.08620) · [arXiv](https://arxiv.org/abs/2606.08620)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- GRPO-trained rewriter with gated rewards: syntax, equivalence, plan change, measured latency.
- Equivalence is result-set comparison on one database; on-policy self-improvement from its own slowdowns.
- A verifiable-reward rewriter whose equivalence signal is evidence, not a certificate.

## In plain words

A database can run two queries with the same answer at very different speeds, so rewriting slow queries pays off. The authors say rule-based rewriters only know fixed transformations, while LLM rewriters often produce rewrites that the database ends up running the same way, or more slowly (abstract, §1). They train open Qwen3 models (8B and 32B parameters) with reinforcement learning. A rewrite earns reward in steps: it must be valid SQL, return the same rows as the original on the benchmark database, make the database pick a different execution strategy, and run faster. A step pays only once enough of the model's tries on that query pass the earlier ones. A second phase retrains on the model's own correct-but-slower rewrites. Pooled over four test workloads, the authors report that the 32B model (fine-tuned on 5k examples first) has the lowest mean query runtime, ahead of GPT-5.4 (§4.2). They present this as beating rule-based and LLM baselines (abstract), not as a first.

## Background and terms

**Terms to know:** [query rewriting and rewrite rules](#/glossary/query-rewriting-and-rewrite-rules), [query equivalence](#/glossary/query-equivalence), [logical plan](#/glossary/logical-plan) (its entry also explains physical plans), [correlated subquery](#/glossary/correlated-subquery), [reinforcement learning](#/glossary/reinforcement-learning), [GRPO](#/glossary/grpo), [reward shaping](#/glossary/reward-shaping), [reward hacking](#/glossary/reward-hacking), [curriculum](#/glossary/curriculum-learning) (here by which gates are open, per query, §3.5), [LoRA](#/glossary/lora-low-rank-adaptation) (§4.1.1).

**The paper's own terms:**
- **semantic equivalence**: as checked here, the rewrite's result set is identical to the original's on the benchmark database (§3.3, §3.4).
- **physical plan, plan divergence**: the plan PostgreSQL's optimizer picks, shown by `EXPLAIN`; a rewrite is plan-divergent when its plan differs from the original's (§3.4).
- **trivial rewrite**: same physical plan, or only superficial text changes (§3.1, §3.4).
- **rollout group**: the G rewrites sampled for one query (G = 16 in training, §4.1.1).
- **PGARS** (Probability-Gated Adaptive Reward Shaping): the gated reward, a "query-level curriculum" (§1, §3.5).
- **gate, threshold τ**: a level counts as mastered for a query when at least a fraction τ of its group passes it (Eq. 2); the ablation's full SPA-8B uses τ = 50% (§4.3).
- **speedup S**: the original's latency divided by the rewrite's; below 1 is a slowdown (§3.4).
- **slowdown rewrite, optimizable query**: an equivalent but slower rewrite; a query for which another equivalent rewrite in the group is nontrivially faster (§3.6).
- **IID / OOD**: the IID ("In-Distribution") workloads, TPC-H and TPC-DS, also supply training queries, from different generator streams; the OOD ("Out-of-Distribution") ones, DSB and StackOverflow, are used only for zero-shot testing (§4.1.3).
- **Succ., Equiv.**: the share of rewrites that pass the syntax check, and the share of those that are equivalent; failed or inequivalent rewrites count with the original's runtime (Tab. 3 caption).
- **P50 to P95**: runtime percentiles over a workload's queries (Tab. 3).

**Missing glossary terms:**
- **Levenshtein distance**: the number of single-character insertions, deletions or substitutions that turn one string into another; SPA divides it by the longer query's length (§3.4).

**Builds on:**
- GRPO, from DeepSeekMath ([DeepSeekMath](#/papers/shao2024deepseekmath "DeepSeekMath: Pushing the Limits of Mathematical Reasoning in Open Language Models (2024)")), which SPA "extends" with database-aware rewards (§1).
- E3-Rewrite ([E3-Rewrite](#/papers/xu2025e3rewrite "E3-Rewrite: Learning to Rewrite SQL for Executability, Equivalence, and Efficiency (2025)")), a GRPO framework for SQL rewriting; unlike it, the authors say, SPA needs no demonstration pool at inference and uses real execution rather than optimizer cost estimates (§2.3).
- The baselines LearnedRewrite ([LearnedRewrite](#/papers/zhou2021learnedrewrite "A learned query rewrite system using Monte Carlo tree search (2021)")), a tree search over sequences of rewrite rules from Calcite (an open-source query-optimizer framework) guided by a learned cost estimator, and R-Bot ([R-Bot](#/papers/sun2024rbot "R-Bot: An LLM-based Query Rewrite System (2025)")), where an LLM selects and orders rules using retrieved evidence and self-reflection (§2.1, §4.1.4).
- Prompted LLM rewriters LITHE ([LITHE](#/papers/dharwada2025lithe "LITHE: A Query Rewrite Advisor using LLMs (2026)")), GenRewrite ([GenRewrite](#/papers/liu2024genrewrite "GenRewrite: Query Rewriting via Large Language Models (2026)")) and QUITE ([QUITE](#/papers/song2025quite "QUITE: A Query Rewrite System Beyond Rules with LLM Agents (2025)")), "still largely guided by handcrafted rules, generated rule descriptions, or curated refinement actions" (§2.2).

## Problem and setting

- **Question:** can an LLM learn from execution feedback on its own rewrites to produce equivalent, plan-changing, faster rewrites (§1)?
- **Engine and timing:** PostgreSQL 16 (16.14 at evaluation); runtime is the mean of three runs after one warm-up, on an 8-vCPU, 30 GiB server (§4.1.2).
- **What "correct" means:** identical result sets on the benchmark database (§3.4, §4.1.2). In training, a group is skipped when the original query times out (120 s), and a rewrite that times out while the original finishes gets a negative signal (§3.4, §4.1.1). Evaluation stops a query at 300 s (Tab. 3 caption).
- **NULLs, SQL fragment:** not discussed; the examples use CTEs (named subqueries in a `WITH` clause), `IN`/`EXISTS` subqueries, a correlated subquery and aggregation (Fig. 1, Fig. 6).
- **Workloads**: training queries come from the TPC-H and TPC-DS toolkits (decision-support benchmarks) and from SQLStorm, used to synthesize queries "beyond benchmark templates" (§3.3). Tests: TPC-H and TPC-DS at 10 GB (IID); DSB, a TPC-DS variant with skewed data and more complex templates, and StackOverflow, real queries over the Stack Overflow data dump (OOD) (§4.1.3, Tab. 3).
- **Models and baselines:** SPA-8B and SPA-32B on Qwen3-8B and Qwen3-32B, against GPT-5.4, GPT-4o, Gemini-2.5-Pro, untrained Qwen3, LearnedRewrite and R-Bot (§4.1.4). All LLMs get the same plan-hint prompt and up to three retries fed with `EXPLAIN` errors (§4.1.2). E3-Rewrite is excluded (§4.1.4).

## Approach

Three stages (§3.3, Tab. 2, Fig. 3 for the two RL stages): supervised fine-tuning on 5k rewrite pairs, GRPO on 1.6k original queries, then self-improvement on 0.8k original queries plus 0.8k slowdown rewrites.

- **Fine-tuning data (§3.3):** o3-mini and GPT-5.4 propose rewrites; one is kept only if its result set matches and its speedup exceeds 1.1, a cut-off chosen because such rewrites are "strongly associated with plan changes" (Fig. 4).
- **Plan Parser (§3.2):** turns PostgreSQL's JSON plan into short prompt hints: rows into and out of each operator, grouped into five operator kinds and ranked by rows removed.
- **The check behind each reward level (§3.4–3.5),** run in parallel by isolated database workers:
  - *Syntax validity:* the first level (§3.5); at evaluation, a rewrite is successful when PostgreSQL's `EXPLAIN` accepts it (§4.1.2).
  - *Equivalence:* run both queries and compare their result sets.
  - *Text distance:* a rewrite is textually nontrivial only if its normalized Levenshtein distance exceeds 0.01, meant to stop the model returning "near-identical SQL strings" to obtain correctness rewards.
  - *Plan divergence:* get both plans with `EXPLAIN` and walk the two operator trees together; a node differing in operator type, join keys, filter predicates, scanned table, aggregation keys or children makes the rewrite plan-divergent.
  - *Speedup:* measured only for equivalent, plan-divergent rewrites; the latency ratio becomes a bounded reward, positive for speedups and negative for slowdowns, zero within ±10%.
- **Gating (§3.5, Eq. 2–3)**: a valid rewrite always gets the syntax reward; the equivalence reward counts only if the syntax gate is open for its group, the plan reward only if the syntax and equivalence gates are open, and the speedup reward only if all three are. In Tab. 1 (group of 8, τ = 25%), six valid rewrites open the syntax gate; one equivalent rewrite is too few to open the next.
- **On-policy self-improvement (§3.6):** from the GRPO rollouts, take equivalent rewrites that ran slower than the original, only for optimizable queries; mix them 1:1 with base training data and continue GRPO with the same reward. Because SQL rewriting is "closed over the query space", the authors say a slowdown rewrite "becomes a valid rewriting input whose physical plan has been pushed toward an unfavorable region".

## Results

- **Mean runtime per workload (Tab. 3, §4.2)**, original → GPT-5.4 / SPA-32B, in seconds: TPC-H 57.00 → 38.36 / 32.73; TPC-DS 30.92 → 16.88 / 19.92; DSB 21.23 → 20.98 / 6.96; StackOverflow 28.12 → 5.21 / 5.41. The authors report SPA-32B best on every TPC-H runtime metric and on DSB's mean, P90 and P95 (§4.2).
- **All four workloads pooled (Tab. 6, §4.2, §4.6):** mean runtime 31.82 s original, 19.55 s GPT-5.4, 20.92 s SPA-32B fine-tuned on 2k pairs (o3-mini targets only), 17.19 s SPA-32B on 5k. The authors also claim SPA-32B's P50 to P95 are the lowest.
- **Slowdowns:** SPA-32B (2k) has a nontrivial-slowdown rate of 7.78% against GPT-5.4's 21.56% (Tab. 6, §4.6). On TPC-H and DSB the authors report SPA-32B with the highest 2×, 4× and 10× speedup rates and no 10× slowdowns (Tab. 5, §4.4).
- **Ablation, SPA-8B (Tab. 4, §4.3)**: DSB mean runtime is 13.20 s for the full model, against 21.28 s with fine-tuning only, 21.49 s without the plan-divergence reward, 21.55 s without self-improvement and 28.26 s with τ = 25%. The same step count without self-improvement is also worse: "the benefit is not merely due to additional training" (§4.3).
- **Case study (Fig. 6, §4.5):** on a TPC-DS query with a correlated subquery, LearnedRewrite and R-Bot apply no rule; GPT-5.4's rewrite aggregates before filtering by manufacturer and runs at 0.85× speed; SPA's filters items first: a 28.1× speedup.
- **Cost (Tab. 7, §4.7):** $12.95 and 20.44 h for Qwen3-8B, $52.08 and 24.99 h for Qwen3-32B (token-billed training platform).

## Limits the authors state

- Equivalence checking "may be inconclusive" when a query times out; in training a group is skipped only when the original query times out, and a rewrite that times out gets a negative signal (§3.4).
- On TPC-DS, GPT-5.4 "obtains the lowest mean runtime and best P90/P95 latency"; on StackOverflow SPA-32B is "competitive" with GPT-5.4 and Gemini-2.5-Pro (§4.2).
- A query whose rollouts all fail to improve "may be difficult to optimize under the current rewrite space" (§3.6).
- After the switch to self-improvement, mean reward "drops sharply and requires a similar number of steps as the base training stage to recover" (§3.6, Fig. 5).
- The RL stages "dominate both cost and time" (§4.7); fine-tuning targets are "the major cost in data synthesis" (§4.6).

## Open problems and building blocks

- **Open:** None stated. The conclusion calls aligning rewrite policies with physical execution "a promising direction for robust and effective SQL query optimization" (§5).
- **Released:** Nothing stated.
- **To reuse it:** PostgreSQL JSON plans (§3.2); Qwen3-8B or -32B with LoRA (rank 32), on an API-based training service, with rewards computed on one 128 GiB machine (§4.1.1); fine-tuning targets from o3-mini and GPT-5.4 (§3.3); 20–25 hours of training (Tab. 7).

## On this site

- **Discussed in:** [Verified query speedups](#/challenges/verified_query_speedup) · [Weak checkers get exploited](#/challenges/weak_checker_exploitation)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/harness-sql">harness-sql</a><a class="tag sub" href="#/tags/llm-gen">llm-gen</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/rewrite-llm">rewrite-llm</a><a class="tag sub" href="#/tags/rlvr-sql">rlvr-sql</a></span>
