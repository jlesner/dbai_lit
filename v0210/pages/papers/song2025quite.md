# QUITE: A Query Rewrite System Beyond Rules with LLM Agents

**QUITE** · preprint · 2025

Read: [PDF](https://arxiv.org/pdf/2506.07675) · [arXiv](https://arxiv.org/abs/2506.07675)  
Code: [QUITE](https://github.com/Yuyang-Song/QUITE)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- FSM-driven multi-agent LLM rewriter with database feedback.
- Structured knowledge base, hybrid SQL corrector, hint injection.
- Checks: SQLSolver, then, for pairs it can't decide, an LLM that verifies and corrects iteratively (§5.2).

## In plain words

Query rewriting turns a slow SQL query into a faster one that returns the same answers. The authors say existing rewriters apply predefined rules, so they "can only handle a small subset of queries and may lead to performance regressions", while human experts rewrite better but don't scale (abstract, §1). They build QUITE, a training-free system in which LLM agents with separate jobs propose a rewrite, check that it runs and gives the same answers, judge from the query plan and cost estimates whether it is good enough, and otherwise retry with tips from a curated knowledge base. Finally, hints steer the database's plan choices. On four PostgreSQL benchmarks, with DeepSeek-R1 as the reasoning model and Claude-3.7-Sonnet for the other agents, they report "up to a 35.8% reduction in query execution over state-of-the-art approaches" and "24.1% additional rewrites compared to prior methods" (abstract). They present it as rewriting "beyond rules", covering "a broader range of query patterns and rewrite strategies compared to rule-based methods" (abstract).

## Background and terms

**Terms to know:** [query rewriting and rewrite rules](#/glossary/query-rewriting-and-rewrite-rules) · [query equivalence](#/glossary/query-equivalence) · [logical plan](#/glossary/logical-plan) (and the physical plan the optimizer picks for it) · [LLM-as-a-judge](#/glossary/llm-as-a-judge) · [Markov decision process](#/glossary/markov-decision-process) (MDP; here states are query forms, actions are rewrite steps and the reward is the drop in estimated cost "and LLM's evaluation", §4.1; nothing is trained, the framing is a prompting goal) · [query hint](#/glossary/query-hint) (QUITE uses PostgreSQL's `pg_hint_plan`, §2.2, §6.1) · [CTE](#/glossary/common-table-expression-cte) (the paper says PostgreSQL materializes CTEs by default; its `NOT_MATERIALIZE` hint inlines one, §6.1)

**The paper's own terms:**
- **Query rewrite**: turning a query into a semantically equivalent, faster one at the SQL level, before the optimizer runs (Def. 2.1); **equivalent**: same result "for any valid instance of the database schema" (Def. 2.2).
- **FSM stages** (finite state machine: fixed stages with rules for moving between them): Reasoning (generate candidates), Verification (check and correct syntax and equivalence), Decision (continue or stop), Termination (§4.2.1, Fig. 5).
- **The four agents** (Tab. 1): the *MDP-based Reasoning Agent* writes a chain of rewrite proposals and SQL candidates; the *Rewrite Agent* extracts and refines the best candidate and "serves as a reward model" (§4.2.2); the *Assistant Agent* runs the corrector; the *Decision Agent* reports on cost and plan changes and decides whether to stop.
- **Rewrite middleware** (§5): the knowledge base, the hybrid SQL corrector, and a memory buffer of selected context (§5.3).
- **Q&A unit**: a knowledge-base entry, a rewrite question (text and SQL) with its answer (strategy and rewritten SQL) (§5.1, Definition 1).
- **QUITE○ / QUITE★**: without / with hint injection (Tab. 4 note).
- **Equivalence rate** and **improvement rate**: the fractions of rewrites whose results match the original's, and that cut execution time by at least 10% (§7.1). **Judge Accuracy** and **Coverage Ratio**: the corrector's fractions of correct and of definitive decisions (§7.3).

**Builds on:**
- The baselines: LearnedRewrite (tree search over rule orders with a learned cost model, [LearnedRewrite](#/papers/zhou2021learnedrewrite "A learned query rewrite system using Monte Carlo tree search (2021)")), LLM-R² (an LLM picks rules of Apache Calcite, an open-source query-optimization framework, from retrieved demonstrations, [LLM-R2](#/papers/li2024llmr2 "LLM-R2: A Large Language Model Enhanced Rule-Based Rewrite System for Boosting Query Efficiency (2024)")), R-Bot (an LLM with retrieved evidence picks rules, [R-Bot](#/papers/sun2024rbot "R-Bot: An LLM-based Query Rewrite System (2025)")) (§2.1, §7.1).
- Rule discovery: WeTune ([WeTune](#/papers/wang2022wetune "WeTune: Automatic Discovery and Verification of Query Rewrite Rules (2022)")), QueryBooster ([QueryBooster](#/papers/bai2023querybooster "QueryBooster: Improving SQL Performance Using Middleware Services for Human-Centered Query Rewriting (2023)")), GenRewrite ([GenRewrite](#/papers/liu2024genrewrite "GenRewrite: Query Rewriting via Large Language Models (2026)"), LLM-written natural-language rules; not run, §7.1) (§2.1).
- Equivalence: the prover SQLSolver ([SQLSolver](#/papers/ding2023sqlsolver "Proving Query Equivalence Using Linear Integer Arithmetic (2023)")), and LLM studies ([Can the Rookies Cut…](#/papers/singh2024sqlequiquest "Can the Rookies Cut the Tough Cookie? Exploring the Use of LLMs for SQL Equivalence Checking (2024)"), [LLM-SQL-Solver](#/papers/zhao2023llmsqlsolver "LLM-SQL-Solver: Can LLMs Determine SQL Equivalence? (2025)")) cited for "the potential of LLMs in deducing query equivalence with high confidence" (§5.2).
- Learned hint selectors such as Bao, which apply query-wide on/off hints (§2.2, §6.2), and multi-agent frameworks such as MetaGPT (§4.2).

## Problem and setting

- **Question:** can LLM agents with database feedback produce equivalent, faster rewrites for more queries than rule-based rewriters (§1, challenges C1 "Ensuring Equivalent Rewrites" and C2 "Ensuring Optimized Rewrites")?
- **Scope:** "primarily designed for long-running OLAP workloads, where execution time dominates and the cost of query rewriting is negligible" (§1) (OLAP: analytical queries over large data).
- **SQL fragment:** none stated; TPC-H's Q15 is dropped because two baselines' rewrite engines don't support its `CREATE VIEW` (§7.1). Set or bag semantics and NULLs: not discussed.
- **Correctness in the experiments:** "equivalence is determined by comparing the execution outputs of the original and rewritten queries" (§7.1). A rewrite with a syntax error or mismatched output is scored at the original's time; one that times out is rechecked at a smaller scale (§7.1).
- **Setup** (§7.1): PostgreSQL 14.13; DeepSeek-R1 as reasoning agent, Claude-3.7-Sonnet for the other three, temperature 0, at most 2 FSM iterations. Workloads: TPC-H (synthetic decision-support benchmark, 63 queries) and DSB (derived from the decision-support benchmark TPC-DS, with complex data distributions, 156 queries), both at scale factor 10 (the benchmark's data-size multiplier); Calcite (58 queries from Apache Calcite's rewrite-rule tests, 10 GB of uniform data); StackOverflow (43 LLM-generated queries over a 13.8 GB Mathematics Stack Exchange dump, following SQLStorm's LLM-based query generation). Queries stop at 300 s.

## Approach

- **Reasoning (§4.1).** A reasoning LLM is prompted to treat rewriting as an MDP: at each step it scores candidate refinements by expected cost reduction and takes the best, until it emits a final query (Fig. 4).
- **FSM loop (§4.2, Alg. 1, Fig. 5)**: the Rewrite Agent groups the chain's proposals by knowledge-base category, picks the top candidate and looks for further improvements; the Assistant Agent repairs syntax (a bounded number of tries, then back to Reasoning) and checks equivalence; the Decision Agent's report decides whether to stop. If not, it retrieves knowledge-base proposals and stores query, report and knowledge in the shared buffer for the next iteration.
- **Knowledge base (§5.1).** 3,432 Stack Overflow Q&A units tagged "query rewrite" or "query optimization" are filtered by votes, LLM-judged consensus and LLM majority vote to 241, enriched from DBMS documentation, sorted into five categories (join, constant, predicate, CTE, others; Tab. 2) and retrieved with the keyword ranking BM25.
- **Hybrid SQL corrector (§5.2)**: an LLM fixes syntax errors from the DBMS's message. SQLSolver answers equivalent, non-equivalent or unknown; on unknown, an LLM compares and corrects the rewrite "until the LLM confidently establishes query equivalence or a predefined time budget is exhausted", returning the original query on the budget. The authors write that this "ensures that only valid, semantically equivalent rewrites advance to the Decision stage" (§4.2.2).
- **Hints (§6)**: the hint base (Tab. 3) holds `pg_hint_plan` hints chosen by an LLM and expert review, without index or hardware hints, plus `NOT_MATERIALIZE` (§6.1). An LLM judges each cardinality estimate (the optimizer's guess of how many rows an operation returns) and join method in the plan against data statistics; the Assistant Agent checks these and builds per-operator hints (§6.2).

## Results

- **Latency (Tab. 4, §7.2)**: QUITE★ has the lowest mean latency on all four workloads; on DSB, 5.85 s against 32.62 s for the original queries and 9.11 s for the best baseline, LLM-R² (Claude-3.7).
- **Equivalence (Fig. 6, §7.2)**: QUITE's rates are 100%, 96.8%, 98.3% and 90.7% on TPC-H, DSB, Calcite and StackOverflow,, which the authors call "the highest equivalence rate across all benchmarks". They attribute the rule-based methods' incomplete equivalence to rules that "lack formal verification" (§7.2).
- **Corrector ablation (§7.3, Fig. 9)**: without it, "nonequivalent queries increase from 5 to 11", unchanged ones rise by 13 and improved ones drop by 17.
- **Other ablations (§7.3):** the filtered knowledge base beats none and the 3,432 raw units (Tab. 5); the full system "outperforms all variants across metrics" that drop the MDP framing, or both it and the FSM (Tab. 6); hint injection cuts mean time by a further 1.8%, 3.8% and 0.3% on TPC-H, DSB and Calcite (Tab. 4), while LLM-chosen Bao hint sets degrade performance (Tab. 5, Fig. 8).
- **Models (Tab. 5)**: DeepSeek-R1 with Claude-3.7-Sonnet "significantly outperforms all other combinations" (§7.3).
- **Robustness (§7.4, Tab. 7):** at scale factors 1, 10 and 30 QUITE "consistently achieves substantial latency reductions at every scale"; rewrites run at another scale show "only minor regressions and still outperform all baselines".
- **End to end (Fig. 7, §7.2)**: on TPC-H and DSB at scale factor 50, rewrite time included, QUITE has the lowest overall latency; its DSB rewrite time is longer (§7.2).
- **Rewrite types and cost (§7.5):** most gains come from join, CTE and predicate rewrites (Fig. 10). On TPC-H, Tab. 8 lists QUITE's average time as 218.25 s and its cost as $0.200, between LLM-R² and R-Bot.

## Limits the authors state

- Aimed at long-running OLAP workloads where rewrite cost is negligible (§1).
- LLMs "may be unsure for some complex queries or incorrectly identify a pair of nonequivalent queries as equivalent" (§5.2); verification may return the original query, which they accept because it "avoids the far greater cost of returning nonequivalent SQL" (§4.2.2).
- Knowledge is mostly context-specific, so "its effectiveness may diminish under changing conditions" (§5.1).
- GenRewrite isn't compared: "the lack of released code prevents direct comparison" (§7.1).
- StackOverflow queries were dialect-normalized for the Calcite-based baselines, "discarding unresolvable cases" (§7.2).
- Using all hints causes "a slight performance degradation" (§7.3).

## Open problems and building blocks

- **Open:** the authors write that SQL equivalence is "an NP-hard challenge" and "whether this problem admits a polynomial-time solution remains an open question" (§5.2). No future work is stated.
- **Released:** analyses of rewrite types, query structures, Q&A units and hints "in our Github files" (§7.5, refs. [80, 81]).
- **To reuse it:** a reasoning LLM and a long-context LLM (DeepSeek-R1 and Claude-3.7-Sonnet by default, §7.1), SQLSolver (§5.2), PostgreSQL with `pg_hint_plan` (§6.1), the 241-unit knowledge base (§5.1); no training (abstract). Time and dollar cost: Tab. 8.

## On this site

- **Discussed in:** [Refuting faulty rewrite rules](#/challenges/faulty_rewrite_rules) · [Weak checkers get exploited](#/challenges/weak_checker_exploitation)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/harness-sql">harness-sql</a><a class="tag sub" href="#/tags/judge-sql">judge-sql</a><a class="tag sub" href="#/tags/llm-gen">llm-gen</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/rewrite-llm">rewrite-llm</a></span>
