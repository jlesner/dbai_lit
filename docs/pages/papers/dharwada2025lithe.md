# LITHE: A Query Rewrite Advisor using LLMs

**LITHE** · EDBT 2026

Read: [PDF](https://arxiv.org/pdf/2502.12918) · [arXiv](https://arxiv.org/abs/2502.12918) · [DOI](https://doi.org/10.48786/edbt.2026.20)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Prompt ensemble, database-sensitive prompts and LLM token-probability-guided rewrite paths (MCTS).
- Logic-based and statistical tools check semantic violations before a DBA sees the rewrite.
- Its authors say logic-based checking covers industrial queries "only to a limited extent", so a DBA makes the final call, and call improving that coverage "a key challenge" (§8.4).

## In plain words

Slow SQL queries can often be rewritten into equivalent queries that run much faster. The authors say rule-based rewriting tools are "limited in scope and difficult to update in a production system", and LLM-based ones "prone to semantic and syntactic errors" (abstract). LITHE, an assistant for database administrators, prompts GPT-4o with general prompts and with prompts that each teach one database rule, plus schema and data statistics. Where the model is unsure of its next word, a tree search explores the alternatives. Candidates are checked by running both queries on small database samples and with tools that try to prove equivalence (abstract, §1). On slow TPC-DS benchmark queries in PostgreSQL, the database's cost estimate rates LITHE's rewrites at least 1.5 times cheaper for 26 queries, against 13 for the best rewrite per query from four earlier rewriters. Measured runtime speedups have a geometric mean of 13.2 against 4.9, over the queries where either found such a rewrite (abstract, §7).

## Background and terms

**Terms to know:** [query rewriting and rewrite rules](#/glossary/query-rewriting-and-rewrite-rules) · [query equivalence](#/glossary/query-equivalence) · [mutation testing](#/glossary/mutation-testing) · [Text-to-SQL](#/glossary/text-to-sql) · [selectivity](#/glossary/selectivity) (LITHE takes estimates from the optimizer, §4.2) · [optimizer cost estimate](#/glossary/optimizer-cost-estimate) (the authors note "material discrepancies between optimizer cost predictions and actual execution times", §1) · [MCTS](#/glossary/monte-carlo-tree-search-mcts) (here its upper-confidence score adds a branch's best value so far to an exploration bonus, larger for likelier tokens and for less-visited branches, §5.1)

**The paper's own terms:**
- **Slow query**: one taking over 10 seconds on the native engine; the main workload (§2.1, §7).
- **CPR (Cost Productive Rewrite)**: a rewrite that improves a slow query "by at least 1.5 times wrt the optimizer-estimated cost" (§2.1).
- **CSGM / TSGM**: geometric mean of the estimated cost speedups / of the measured cold-cache runtime speedups against the original query, "over the set of all CPRs (i.e. CPRs arising from either LITHE or SOTA)" (§7 "Metrics").
- **SOTA**: four earlier rewriters run separately, keeping the best rewrite per query: GenRewrite's baseline prompt, Learned Rewrite, LLM-R² and GenRewrite (§7 "Rewrite Baselines").
- **Query space vs plan space**: rewriting the SQL text, against optimizing "on the nodes of the execution plan tree" (§1).
- **Verification label**: "provable" (a prover succeeded) or "statistical" (only result tests passed) (§1, §2).

**Builds on:**
- **GenRewrite** ([GenRewrite](#/papers/liu2024genrewrite "GenRewrite: Query Rewriting via Large Language Models (2026)")), an LLM rewriter that writes natural-language rewrite rules as hints (§9); its baseline prompt is LITHE's Prompt 1 (§3).
- **Rewriters that choose rules of Apache Calcite** (a query-optimization framework): Learned Rewrite, ordering them by MCTS ([LearnedRewrite](#/papers/zhou2021learnedrewrite "A learned query rewrite system using Monte Carlo tree search (2021)"); the paper cites the 2023 demo), LLM-R² ([LLM-R2](#/papers/li2024llmr2 "LLM-R2: A Large Language Model Enhanced Rule-Based Rewrite System for Boosting Query Efficiency (2024)")) and R-Bot ([R-Bot](#/papers/sun2024rbot "R-Bot: An LLM-based Query Rewrite System (2025)")), both asking an LLM (§9). The authors place these and QueryBooster ([QueryBooster](#/papers/bai2023querybooster "QueryBooster: Improving SQL Performance Using Middleware Services for Human-Centered Query Rewriting (2023)")) "via the query plan space" (§9).
- **MCTS-guided decoding** from LLM code generation (Zhang et al., ICLR 2023, not listed here), with UCB adapted from AlphaZero (§5).
- **Checkers**: the provers QED ([QED](#/papers/wang2024qed "QED: A Powerful Query Equivalence Decider for SQL (2024)")) and SQLSolver ([SQLSolver](#/papers/ding2023sqlsolver "Proving Query Equivalence Using Linear Integer Arithmetic (2023)")) (§6.2); tuple injection after the XData mutant-killing tool (Shah et al., ICDE 2011); and SEER, a robust-plan algorithm by two of the authors (§6.3).

## Problem and setting

- **Question:** how LLMs can rewrite slow SQL queries into faster ones while guarding against wrong or invalid rewrites, with a database administrator (DBA) deciding (abstract, §1).
- **Queries:** complex analytic queries, mainly TPC-DS (a decision-support benchmark of a retail supplier) at 100 GB, with 88 slow queries, timed with cold caches (§7, §7.1.1). Also DSB (a TPC-DS variant with harder distributions and joins), ARCHER (a Text-to-SQL benchmark), JOB (an optimizer stress test with large join graphs) and StackOverflow (real-world query templates); all but DSB are mostly fast queries, included "to test the coverage" (App. A.1).
- **Development set:** 10 TPC-DS queries with hand-crafted rewrites as the target (§2.2).
- **Platforms:** PostgreSQL v16 and GPT-4o at temperature 0 for most runs; two anonymous commercial engines, OptA and OptB (§7.4); LLaMA 3.1 70B and Gemini 2.5 Flash (§7.5.2).
- **Correctness:** semantic equivalence, checked by sampling, provers and a full-database comparison, with the DBA deciding (§6.2). Set or bag semantics, NULLs and row order: not discussed, beyond the Fig. 2 example's assumption of "NOT NULL column constraints and key-joins" (joins along key references) (§1).

## Approach

A five-stage pipeline (§2, Fig. 3):
- **1. Prompting.** SQL the engine's parser rejects goes back to the LLM with the error, up to 5 times (§2, §6.1).
  - *Basic prompts* (§3, Fig. 4): Prompt 1 just asks for a faster rewrite; Prompt 2 adds an expert role and asks to keep equivalence; Prompt 3 asks step by step to find inefficiencies, plan fixes, then rewrite; Prompt 4 gives those steps as separate turns.
  - *Database-sensitive prompts* (§4, Tab. 2, Fig. 5): one rule per prompt, with one worked example (App. D) and the relevant schema. R1 use CTEs (named subqueries) for repeated computation, R2 scan a shared table once, R3 drop redundant filters, R4 drop redundant joins along a key reference (primary key to foreign key); R5 choose `EXISTS` or `IN` by subquery selectivity (Fig. 6), R6 pre-filter self-joined tables with low selectivity. R5 and R6 prompts also get selectivity estimates (§4.2). The authors found "the precise wording of the rule instructions is not significant"; the examples matter (§4.1).
- **2. Costing.** Candidates the optimizer prices above the original are dropped (§2).
- **3. Fast equivalence check** on results over several database samples (App. C): correlated sampling keeps joining rows together, filter constants are moved to values in the sample to avoid empty results, and synthetic tuples cover predicate boundaries (§6.2).
- **4. Token-probability MCTS** (§5, Alg. 1, Fig. 7), seeded with the prompt that gave the best rewrite, else Prompt 1 (§5.2). Each edge is a token with its probability (from the API's log-probabilities). The tree branches into the top 2 tokens only when the top token's probability is at most 0.7, and extends greedily otherwise. A new node is completed greedily to a full query, valued at its cost speedup if it passes the syntax and sampling checks, else zero; the best value propagates up. After 8 iterations the best rewrite with value above 1 is returned, else the original (§5.1, §6.1).
- **5. Final checks** on the least-cost rewrite: QED and SQLSolver; if inconclusive, a full-database result comparison the DBA may stop early (§6.2). A regression check (SEER) turns filter constants into parameters, sets them so each filter's selectivity is at an extreme (the corners of the selectivity space), makes the engine use each query's original plan there (plan forcing), and keeps the rewrite only if cheaper at every corner; engines without plan forcing compare runtimes on the samples (§6.3). The output adds the estimated gain, the verification label and an LLM-written explanation (§1).

## Results

- **Micro-benchmark** (§3–§5.3, Tabs. 1, 3, 4): CPRs rise from 6 of 10 (prompt ensemble) to 7 (+R1–R4), 9 (+R5, R6) and 10 with MCTS, matching the hand-written rewrites' CSGM; on MCTS the authors write "these gains over just prompting may seem marginal" (§5.3).
- **TPC-DS, PostgreSQL, GPT-4o** (§7.1.1): 26 CPRs against SOTA's 13. Of the 27 queries with a CPR from either, 11 were proved equivalent and 16 passed the statistical tests; the authors also checked them by hand.
- **Runtime** (§7.1.2, Fig. 9): TSGM 13.2 against 4.9; "regressions were not encountered among the CPR rewrites thanks to the sampling-based checks".
- **Ablations:** CPRs per component (§7.2.1, Tab. 5); without rules R1–R6, CSGM drops to 5 against 11.5 (§7.2.2).
- **Overheads** (Tab. 6): about 5 minutes per CPR query, against 1.7 for SOTA (§7.3).
- **Commercial engines** (§7.4, Tab. 7): more CPRs and higher speedups than SOTA on both; the checks caught the few regressions, the authors report.
- **Workloads the authors call unknown to GPT-4o** (§7.5.1): complex Football (Text-to-SQL) queries plus their own, and a proprietary workload; LITHE still finds CPRs.
- **Other LLMs** (§7.5.2): with LLaMA 3.1 70B (4-bit), CPRs go from 18 to 22 when MCTS is added (Tab. 8); Gemini 2.5 Flash trails GPT-4o.
- **Other benchmarks** (App. A.1, Tab. 9): more CPRs and higher CSGM than SOTA on all four. Nearly all SOTA CPRs come from its LLM-based members (App. A.2, Tab. 10).
- **Rule classifier** (App. B, Tab. 11): an LLM picking the rule roughly halves rewrite time, at the price of fewer CPRs.

## Limits the authors state

- The sampling test "is a necessary condition for query equivalence, it is not sufficient": the sample may miss predicates (§6.2).
- Statistically verified rewrites need the DBA's final call, which "restricts the use of LITHE in a fully automated scenario" (§8.4).
- Runtime speedups do not always match projections (§7.1.2); regressions surfaced on the commercial engines (§7.4).
- The authors' audit traces missed CPRs mainly to "Structural Simplicity" (flat queries optimizers already handle) or "Structural Tightness" (no repeated computation to remove), and some may be due to the specific LLM (§7.1.1).
- Applying rules in sequence was judged infeasibly expensive, given the many orderings (§4); LITHE is "considerably slower than SOTA in producing rewrites" (§7.3.1).
- "a significant semantic distance between foundation models and query optimizers" (§10); some rewrites, such as TPC-DS Q90's (Fig. 10), look hard to turn into generic optimizer rules (§8.2).

## Open problems and building blocks

- **Open:** combining rewrites with LLM plan hints, which steer the optimizer's plan choice (§8.1); distilling optimizer rules from LLM rewrites (§8.2); an agentic LITHE with database tools and memory (§8.3); improving logic-based equivalence coverage (§8.4); rewrite rules in NL-to-SQL (text-to-SQL) prompts (§8.5); fine-tuning small open models (§10); an ensemble of LLMs (§7.1.1); a better classifier trade-off and early checks to prune MCTS, whose greedy completion the authors call a bottleneck (App. B).
- **Released:** Nothing stated.
- **To reuse it:** an LLM API that returns token probabilities; the engine's parser, cost and selectivity estimates; plan forcing for SEER (§6.3); QED and SQLSolver (§6.2); MCTS settings chosen empirically (§6.1). LLaMA needed up to two examples per rule prompt (§7.5.2).
- **Beyond its domain:** the authors suggest LITHE could help text-to-SQL systems produce faster SQL (§8.5).

## On this site

- **Discussed in:** [Refuting faulty rewrite rules](#/challenges/faulty_rewrite_rules) · [Discovering new rewrite rules](#/challenges/rewrite_rule_discovery) · [Verified query speedups](#/challenges/verified_query_speedup)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/harness-sql">harness-sql</a><a class="tag sub" href="#/tags/llm-gen">llm-gen</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/rewrite-llm">rewrite-llm</a><a class="tag sub" href="#/tags/scaling-sql">scaling-sql</a></span>
