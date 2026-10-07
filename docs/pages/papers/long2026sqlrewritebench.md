# SQL-RewriteBench: A Correctness-Gated, Full-Denominator Benchmark for Statement-Level SQL Rewriting

**SQL-RewriteBench** · preprint Jul 2026

Read: [PDF](https://arxiv.org/pdf/2607.09251) · [arXiv](https://arxiv.org/abs/2607.09251)  
Code: [SQL-RewriteBench](https://github.com/SQL-RewriteBench/benchmark)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Executable rewrite instances in EQUIV / PERF / ROBUST / PG-aware pools, with *correctness gating*.
- Metrics include UnsafeRewrite Rate and Result Consistency.
- A ready rewrite benchmark; its correctness labels are result consistency on the packaged data, and it says it doesn't establish formal equivalence (§5).

## In plain words

Tools that rewrite a SQL query into a faster or simpler one outside the database engine can look good on average speedup over their successes. The authors argue this hides cases where a method rejects the input, returns nothing, emits SQL that fails or changes the answer, or returns a correct but slower query (§1). They build a benchmark of 180 PostgreSQL queries, each with a checked faster or simpler reference rewrite, and scoring that counts every case. A rewrite earns credit only if it returns the same result as the input on the packaged data, which the authors say does not prove equivalence (§5). They present it as filling a gap: "To our knowledge, no existing resource" keeps all these outcomes in one denominator (§1).

Across seven method families in eight configurations (§7, §9), every method's full-benchmark score is negative under all 81 scoring settings tried, so on this score each does worse than never rewriting, which scores zero (§5). Prompting GPT-5.5 directly matches the input's result on 171 of 180 queries, but 121 of those are slower (§7).

## Background and terms

**Terms to know:** [query rewriting and rewrite rules](#/glossary/query-rewriting-and-rewrite-rules) · [bag semantics](#/glossary/bag-semantics) · [query equivalence](#/glossary/query-equivalence) · [common table expression (CTE)](#/glossary/common-table-expression-cte) · [correlated subquery](#/glossary/correlated-subquery) · [query plan and EXPLAIN](#/glossary/query-plan-and-explain) · [SQL dialect](#/glossary/sql-dialect)

**The paper's own terms:**
- **Base Query / Benchmark Input Query / Reference Rewrite**: the original workload statement; the enriched version methods receive; and the validated improved statement (§4.1).
- **Opportunity enrichment**: edits guided by database administrators (DBAs), constrained by the case's Checker Contract, that make a rewrite opportunity measurable (e.g. a filter applied late, repeated computation) (§4.1).
- **Pools** (Tab. 3): EQUIV (48 cases, semantic edge cases), PERF (44, speedup), ROBUST (58, long-tail structure) and PG-AWARE (30, PostgreSQL-specific constructs).
- **Checker Contract**: what a rewrite must preserve; the **Correctness Gate** is passing it (§5.1).
- **Result Consistency**: the rewrite's result equals the input's under the Checker Contract on the packaged data, as opposed to formal equivalence on every database (§5.1).
- **No-Rewrite Decision / no-op**: a method declines to change the input, or changes only formatting, comments or aliases; neither earns value (§3.1).
- **Terminal outcomes**: one status per method–case pair: Source Acceptance Failure (the method's front end, e.g. its parser, stops before any decision), Generation Failure, Execution Failure, Unsafe Rewrite (runs but fails the Checker Contract), or a result-consistent gain, neutral or regression (§3.4).
- **Full-denominator rates** (Tab. 5): Source Acceptance, Generation, No-Rewrite Decision, Execution Coverage, Result Consistency and UnsafeRewrite Rate, each divided by all 180 cases.
- **SCS (Static SQL Complexity Score)**: a 0–100 index of a statement's syntax-tree structure over six feature groups (Tab. 6) (§5.2).
- **CGOQ (Correctness-Gated Optimization Quality)**: a per-case score, positive for gains and negative for slowdowns, defined only for outputs that pass the gate (§5.3). **CGOQ@N** divides its sum by all 180 cases, so every other outcome counts as zero (Eq. 10); **CGOQ@Accept** divides by the cases a method accepted (Tab. 15).

**Missing glossary terms:**
- **Materialization barrier**: a CTE the engine is made to compute and store separately (in PostgreSQL, `WITH … AS MATERIALIZED`), so the optimizer cannot merge it into the rest of the query; named, not defined, in §4.1.

**Builds on:**
- The rewrite systems it evaluates (§7.1, Tab. 9): LearnedRewrite ([LearnedRewrite](#/papers/zhou2021learnedrewrite "A learned query rewrite system using Monte Carlo tree search (2021)"), a search over rewrite sequences), LLM-R2 ([LLM-R2](#/papers/li2024llmr2 "LLM-R2: A Large Language Model Enhanced Rule-Based Rewrite System for Boosting Query Efficiency (2024)"), an LLM picks rules from retrieved example rewrites; run as LLM-R2-plan, retrieving by [logical plan](#/glossary/logical-plan) tree edit distance, and LLM-R2-queryCL, by a learned query embedding), R-Bot ([R-Bot](#/papers/sun2024rbot "R-Bot: An LLM-based Query Rewrite System (2025)"), retrieved rule evidence and LLM rule ordering), the first three running rules in Apache Calcite ([Apache Calcite](#/papers/begoli2018calcite "Apache Calcite: A Foundational Framework for Optimized Query Processing Over Heterogeneous Data Sources (2018)"), a query-processing framework), and QUITE ([QUITE](#/papers/song2025quite "QUITE: A Query Rewrite System Beyond Rules with LLM Agents (2025)"), a "Database-feedback-driven rewrite agent").
- Query sources (§4.1): DSB ([DSB](#/papers/ding2021dsb "DSB: a decision support benchmark for workload-driven and traditional database systems (2021)"), an adaptation of the decision-support workload TPC-DS), TPC-DS, Calcite test queries and SQLStorm, which "stresses complex SQL behavior" (§2).
- Equivalence tools run as supplementary evidence (§5.1, §7.4): SQLSolver ([SQLSolver](#/papers/ding2023sqlsolver "Proving Query Equivalence Using Linear Integer Arithmetic (2023)"), an automated equivalence prover) and VeriEQL ([VeriEQL](#/papers/he2024verieql "VeriEQL: Bounded Equivalence Verification for Complex SQL Queries with Integrity Constraints (2024)"), which checks equivalence on databases up to a size bound).

## Problem and setting

- **Question:** how do rewrite methods behave end to end, with every failure counted (§1, §7.1)?
- **Task scope:** a complete statement in, one statement out, in a declared dialect and engine (here PostgreSQL); not physical plans, indexes, materialized views, or join ordering and cardinality estimation as separate tasks (§3.2).
- **Correctness:** by default the Checker Contract compares results under bag semantics, and a case may strengthen its requirements; row order is ignored "unless it is observable from the Benchmark Input Query, such as through an ORDER BY combined with LIMIT"; NULLs compare as cells; exact numeric types need exact equality, any float tolerance must be declared by the case, and output arity and compatible types must match (§5.1). The check runs over the packaged schema and data, which the authors describe as about 20 GB of TPC-DS and DSB data with real NULLs and duplicates (§7.4).
- **Runtime:** median of five measured runs after warm-up, on one workstation running PostgreSQL 16.14 in Docker under WSL2 with default-style settings (§7.2).
- **Models:** direct prompting, with one shared prompt, of DeepSeek-V4, Kimi-K2.5 and GPT-5.5; LLM-R2, R-Bot and LearnedRewrite use GPT-5.5 inside (§7.1).

## Approach

- **Construction (§4.1):** the release draws 39 SQLStorm, 60 Calcite, 34 TPC-DS and 47 DSB entries. DBAs apply pool-specific enrichment; PERF enrichment adds patterns such as "late filtering, repeated aggregation, materialization barriers, and avoidable join inputs". Five DBAs reviewed a sample blind and judged the patterns plausible in production extract-transform-load (ETL), business-intelligence (BI) and reporting workloads, "particularly for SQL written by less experienced developers"; the authors make "no claim about the production frequency of these patterns" (§4.1).
- **Reference validation (§4.1):** each pair must pass exact Result Consistency; PERF references must reach at least 1.10× speedup; other pools may instead show a large SCS reduction at neutral runtime.
- **Pool assignment (§4.2):** a 0–100 Pool Suitability Score per pool; automatic admission needs a top score of at least 60 and a margin of at least 5, and borderline cases are reviewed.
- **Executable Case Package (§4.3, Tab. 4):** input, reference, base query, schema, evidence and a rewrite-opportunity note; methods see only the input and permitted schema context.
- **SCS (§5.2, Eq. 1–2):** feature counts are log-scaled, capped at the 95th percentile of the 180 inputs, and averaged with equal weights.
- **CGOQ (§5.3, Eq. 3–8), with default parameters:** a runtime part scores zero within 5% of parity and rises smoothly with the log speedup (falling for slowdowns), scaled so a 2× speedup scores about 0.76. A simplification part gives nothing below 10% SCS reduction and full credit from 30%. Simplification adds at most 0.4 × (1 − |runtime part|), all times 100, and gets "full credit for speedups and runtime-neutral changes, partial credit for slowdowns between 5% and 10%, and no credit once the Rewritten Query is at least 10% slower".

## Results

- **References (§7.3, Tab. 10):** all 180 input–reference pairs execute and pass exact Result Consistency; PERF references reach a geometric-mean speedup of 4.12×, while EQUIV and ROBUST references mostly gain through simplification at near-neutral runtime.
- **Formal-tool audit (§5.1, §7.4):** SQLSolver proves 14 of the 180 reference pairs equivalent, with 115 UNKNOWN and 51 timeouts. VeriEQL, run with bound size 1, reports 51 pairs equivalent and returns ERROR on 129 it cannot parse or support.
- **Full denominator (§7.5, Tab. 11):** it reports no method with positive CGOQ@N, from −0.55 (LLM-R2-plan, least negative "largely because most cases do not reach a scored output") to −32.65 (GPT-5.5). The direct-prompted models and QUITE accept every case.
- **Direct prompting (§7.6, Fig. 1):** GPT-5.5 executes 178 outputs and 171 pass the Checker Contract, but 121 result-consistent outputs are slower and only 49 score positive. DeepSeek-V4 reaches high Execution Coverage but is "much less safe" (§7.5); many Kimi-K2.5 outputs do not execute, often because they contain ellipses or placeholder text.
- **Rule-engine front ends (Tab. 11, 13):** Source Acceptance is 43.9% for LearnedRewrite, 52.2% for each LLM-R2 configuration and 49.4% for R-Bot. The leading LLM-R2 parse failures are `WITH MATERIALIZED` and PostgreSQL `::` casts. CGOQ@Accept, over accepted cases only, stays negative for all four (§7.9, Tab. 15).
- **By pool (§7.7, Fig. 2, Tab. 12):** PERF is the only pool where several methods gain on aggregate (QUITE most); the same systems are negative on EQUIV and ROBUST.
- **Sensitivity (§5.2–5.3, Tab. 7–8):** method order is unchanged under four SCS weightings; all methods stay below zero across 81 CGOQ settings, though "lower-ranked methods exchange positions".

## Limits the authors state

- Result Consistency "does not prove that two queries are equivalent over every legal database instance" (§5.1).
- Available verifiers "could not accept a substantial fraction" of the inputs, and verifying only those accepted would bias the evaluation "toward simpler SQL" (§5.1).
- SCS is "not a model of DBMS execution cost or a validated measure of human maintainability" (§5.2).
- The 180 cases are "an executable capability benchmark rather than a prevalence estimate of rewrite opportunities in production" (§8).
- PG-AWARE "is limited to PostgreSQL" (§8).
- Speedups are tied to the reported workstation, PostgreSQL configuration and databases; cloud storage, distributed execution, caching, optimizer versions, data scale and skew "may change speedup magnitudes"; PERF results are "controlled evidence that a rewrite opportunity exists, not … a universal estimate of production savings" (§8).

## Open problems and building blocks

  - What future systems need: "broader SQL front ends, cleaner rule-executor interfaces, result-aware validation, and more selective optimization policies" (§1; §7.10 adds "stronger Checker-Contract feedback").
  - The link between SCS and human review or maintenance effort is left "to a future user study" (§5.2).
  - Future releases: more Base Queries, Reference Rewrites and application-derived cases; separate MySQL-aware and Spark-aware tracks, each validated on its own engine (§8).
- **Released:** case packages, baseline adapters, documentation, scripts and output templates (§6; PDF p. 1 artifact box); §6 says the artifact also "freezes the complete Direct-LLM prompt, schema serialization, SQL extraction logic, raw responses, and model identifiers".
- **To reuse it:** PostgreSQL with the benchmark databases (§7.2, §7.4), and a method adapter returning a rewrite, a No-Rewrite Decision, a Source Acceptance Failure or a Method Error (§6).

## On this site

- **Discussed in:** [Benchmarks with checkable ground truth](#/challenges/checkable_benchmark_ground_truth) · [Sourcing realistic, hard query pairs](#/challenges/query_pair_sourcing) · [Verified query speedups](#/challenges/verified_query_speedup) · [SQL features that verifiers don't cover](#/challenges/verifier_coverage_gaps)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/llm-gen">llm-gen</a><a class="tag sub" href="#/tags/pairs-rewrite">pairs-rewrite</a><a class="tag sub" href="#/tags/rewrite-eval">rewrite-eval</a><a class="tag sub" href="#/tags/rewrite-llm">rewrite-llm</a></span>
