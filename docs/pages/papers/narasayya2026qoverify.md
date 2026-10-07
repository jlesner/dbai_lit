# Leveraging Query Optimizers to Verify the Soundness of LLM-based Query Rewrites for Real-World Workloads, and More!

**QO-Verify** · CIDR 2026

Read: [PDF](https://www.vldb.org/cidrdb/papers/2026/p33-narasayya.pdf)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Verifies an LLM rewrite by finding a common expression in the optimizer *memos* of original and rewrite.
- Sound, its authors say, because "each transformation rule is known to be sound" (PDF p. 2); no test of that is reported; can't disprove (§4.3).

## In plain words

Developers speed up slow queries by rewriting them into equivalent, faster ones, and large language models can now propose such rewrites. Nothing guarantees a rewrite returns the same answers, and the authors (Microsoft) call checking this "a major impediment" to adopting LLM rewriting (abstract, PDF p. 1). Running GPT-4o-mini and GPT-5 on real customer queries and benchmarks in Microsoft SQL Server, they found about 32% of rewrites returned different results on the given database (§1, PDF p. 1).

Their checker, QO-Verify, reuses the query optimizer, the database component that turns a query into equivalent forms while searching for a fast way to run it. If the forms reachable from the original and from the rewrite overlap, it declares them equivalent, which the authors call sound because every optimizer rule preserves meaning (§1, PDF p. 2); otherwise the answer is unknown. It verified about 37% of the rewrites that had matched on the database (§4, PDF p. 10). They call the idea "an overlooked opportunity" (§1, PDF p. 2), and add three rules distilled by hand from rewrites it couldn't verify.

## Background and terms

**Terms to know:** [query equivalence](#/glossary/query-equivalence) · [query rewriting and rewrite rules](#/glossary/query-rewriting-and-rewrite-rules) · [logical plan](#/glossary/logical-plan) · [soundness and completeness](#/glossary/soundness-and-completeness) · [SAT and SMT solvers](#/glossary/sat-and-smt-solvers) · [decidable and undecidable](#/glossary/decidable-and-undecidable) · [correlated subquery](#/glossary/correlated-subquery) · [query optimizer](#/glossary/query-optimizer) (Volcano/Cascades is "an extensible framework for query optimizers", used by SQL Server's, §2, PDF p. 2) · [memo](#/glossary/memo) (§2.1, PDF p. 3) · [transformation and implementation rules](#/glossary/transformation-and-implementation-rules)

**The paper's own terms:**
- **QO-Verify**: returns True or Unknown, never "not equivalent": "a one-sided check" (§2, PDF p. 2).
- **Group** and **logical expression**: in the memo (below), a group holds equivalent expressions; a logical expression is one operator (e.g. Join) whose inputs are groups, so one expression stands for many full query trees. The root group holds the forms of the whole query (§2.1, Fig. 2, PDF p. 3).
- **Guidance** and **promise**: mechanisms of Cascades (the optimizer framework below) that decide which rules apply to an operator and, heuristically, which to try; turning them off applies all relevant rules, "potentially increasing coverage" (§2.2, PDF p. 4).
- **Task limits**: SQL Server's cap on optimizer work; turning them off disables timeouts and cost-based pruning, the usual dropping of alternatives estimated too costly (§2.2, PDF p. 3).
- **Normalization**: steps run before the memo is built: constant folding, "substitution rules", and rules considered "always beneficial", e.g. decorrelation (turning a correlated subquery into a join) (§2.2, PDF p. 4).
- **Coverage**, two senses: the fraction of truly equivalent pairs for which QO-Verify returns True (§2.2, PDF p. 4); in experiments, the percentage of candidate rewrites verified (§4.3, PDF p. 10).
- **Candidate rewrite**: a rewrite whose results on the given database equal the original's, "ignoring ordering of rows" (§4.2, PDF p. 8).
- **GBAgg**: the group-by-aggregation operator of the rule figures (§3.1, PDF p. 6).

**Builds on:**
- Volcano/Cascades [20, 21] (§2, PDF p. 2): Cascades is [The Cascades Framework for Query Optimization](#/papers/graefe1995cascades "The Cascades Framework for Query Optimization (1995)"); Volcano is cited as a 1991 report (the collection has the 1993 paper, [The Volcano Optimizer Generator](#/papers/graefe1993volcano "The Volcano optimizer generator: extensibility and efficient search (1993)")).
- LLM rewriters GenRewrite and LITHE (§1, PDF p. 1), LLM-R2 and R-Bot (§5, PDF p. 11): [GenRewrite](#/papers/liu2024genrewrite "GenRewrite: Query Rewriting via Large Language Models (2026)"), [LITHE](#/papers/dharwada2025lithe "LITHE: A Query Rewrite Advisor using LLMs (2026)"), [LLM-R2](#/papers/li2024llmr2 "LLM-R2: A Large Language Model Enhanced Rule-Based Rewrite System for Boosting Query Efficiency (2024)"), [R-Bot](#/papers/sun2024rbot "R-Bot: An LLM-based Query Rewrite System (2025)"); three of its four prompts come from LITHE and GenRewrite (§4.2, PDF p. 8).
- SMT-based provers Cosette, SQLSolver, VeriEQL and QED ([Cosette](#/papers/chu2017cosette "Cosette: An Automated Prover for SQL (2017)"), [SQLSolver](#/papers/ding2023sqlsolver "Proving Query Equivalence Using Linear Integer Arithmetic (2023)"), [VeriEQL](#/papers/he2024verieql "VeriEQL: Bounded Equivalence Verification for Complex SQL Queries with Integrity Constraints (2024)"), [QED](#/papers/wang2024qed "QED: A Powerful Query Equivalence Decider for SQL (2024)")), which have "limited coverage" on queries with group-by, aggregation, outer joins or nested subqueries, "as noted in [12], and confirmed by our experiments" (§1, PDF p. 2).
- Computation sharing across aggregates (query fusion in Amazon Athena, COMPARE, Blitz, streaming window aggregates): the §3 rules are "closely related to rules identified in prior work, but they cover new cases" (§5, PDF p. 11).

## Problem and setting

- **Questions:** how well LLM rewrites do on enterprise queries, which unlike benchmarks weren't in LLM training (§1, PDF p. 1); whether the optimizer can verify them.
- **Engine and models:** Microsoft SQL Server only; GPT-4o-mini and GPT-5 (§4.2, PDF p. 8).
- **Workloads (§4.1, Tab. 1, PDF p. 8):** REAL-1 to REAL-4, analytics warehouses of four Microsoft customers, plus the decision-support benchmarks TPC-DS and TPC-H (skewed data) and JOB, an optimizer benchmark [26]. §1 gives 118 real-world and 224 benchmark queries (PDF p. 1). Real queries use outer joins, group-by, `UNION ALL`, subqueries, views and common table expressions (CTEs: named subqueries in a `WITH` clause). Indexes were tuned with SQL Server's Database Tuning Advisor.
- **Correctness:** semantic equivalence; equal results on the database are "only a necessary condition but not sufficient" (§1, PDF p. 1). General SQL equivalence is undecidable (§1, PDF p. 2).
- **Not discussed:** sets or bags (duplicates) in result comparison; NULLs in the matching.

## Approach

- **The memo check (§2.2, Algorithm 1, PDF pp. 3–4).** The optimizer builds a memo per query with pruning, timeouts and implementation rules off, to explore the full logical space. `MatchGroups` says two groups match if any pair of their expressions match; `MatchExprs` requires the same operator and number of inputs, then matching input groups in order (an outer join of A and B differs from one of B and A). True needs an exact match between the two root groups; it "does not produce any false positives" (§2.2, PDF p. 4).
- **Implementation (§2.2, PDF p. 4):** SQL Server exports the memo; a client matches, with early stops and caching.
- **Coverage depends on** the rules existing, guidance and promise, and pruning (§2.2, PDF p. 4); wider normalization (e.g. of `a+b+c` against `b+a+c`) could raise it.
- **Plan forcing:** a modified `USE PLAN` (SQL Server's command to force a plan) could check equivalence as a special case of QO-Verify, when a memo is too expensive (§2.2, PDF pp. 4–5).
- **Rules from rewrites (§3, PDF pp. 5–8).** A pair that QO-Verify can't verify but a person confirms can reveal a missing rule. The authors found well-known rules SQL Server lacks (group-by pushed below `UNION ALL`, as in IBM DB2; `GROUPING SETS` for a `UNION ALL` of group-bys) and three new variations, each an algebraic rule (Figs. 3–5) with a prose correctness argument, all comparing aggregates over a common subexpression:
  - **§3.1** (PDF pp. 5–6): a join of group-by subqueries on columns C and on a subset of C becomes window functions (per-partition aggregates) over one input, with a filter on NULL ([NULL](#/glossary/null-and-three-valued-logic)) subset columns. From a REAL-1 query.
  - **§3.2** (PDF pp. 6–7): a self-join of a grouped relation (TPC-DS Q74) becomes one group-by with CASE-conditioned aggregates; the paper calls Query 5 "semantically equivalent to Query 4" (PDF p. 6).
  - **§3.3** (PDF pp. 7–8): two scalar aggregates, one over a subset reached by a foreign-key–primary-key join (TPC-DS Q61), become one aggregate over a left outer join with a CASE. Query 7 is a simplified form of the LLM's rewrite (PDF p. 7).
  - Query 5 ran 3.6× faster than Query 4 on SQL Server (§3.2, PDF p. 6). The rules are not generalized beyond what was observed.

## Results

- **LLM rewriting (§4.2, PDF pp. 8–10).** Rewrites were timed in cold runs (nothing cached), up to 3 calls per prompt while invalid or under 2× faster. About 32% returned different results and were discarded, leaving 3100+ candidates (Fig. 6). For the best candidate per query, the authors report median improvements of 38% overall, 46% on benchmarks and 29% on real queries (Fig. 7). All real databases show gains; QHint (ask for SQL Server query hints) and General (unconstrained) improve the most rewrites, more than CTE (express repeated computation as CTEs) and SubQ (optimize shared or similar expressions in subqueries) (Fig. 8; prompts §4.2, PDF p. 8). They "do not observe a statistically significant difference in the quality" between GPT-5 and GPT-4o-mini (§4.2, PDF p. 9; Fig. 10, PDF p. 10).
- **QO-Verify (§4.3, PDF pp. 10–11).** Run on each candidate, it verified 1150+ of 3100+, about 37%. The best verified rewrite per query improves the median query by 6% or less, against 38% for any candidate, but much more at higher percentiles (Fig. 11). Coverage is similar on real and benchmark databases (Fig. 12) and varies by prompt: QHint 95%, CTE 24%, SubQ 20%, General 8% (Fig. 13); the authors suggest constraining the LLM's changes raises coverage.
- **Overheads:** median about 1.2 s per check with no task limit; 0.85 s, with slightly lower coverage, with the default limit (§4.3, PDF pp. 10–11).
- QED verified none of their real-world rewrites, they report (§5, PDF p. 11).

## Limits the authors state

- QO-Verify "cannot disprove equivalence" (§4.3, PDF p. 10).
- It verifies only when the needed rules exist in the optimizer (§1, PDF p. 2), and optimizers "do not have all the general purpose theorem proving capabilities of SMT solvers" (§3, PDF p. 5).
- Building a memo can be too expensive (§2.2, PDF p. 5).
- Rule Distillation into compact models is manual; broad applicability "must be ascertained" before a rule is added; rules must be applied cost-based (§3, PDF p. 5).
- LLM rewriting often needs several calls, and each rewrite must be executed to confirm a benefit (§1, PDF p. 1; §4.2, Fig. 9, PDF p. 9).

## Open problems and building blocks

  - "It is an open question" whether SMT-based methods can add coverage where QO-Verify returns Unknown (§6, PDF p. 11).
  - Counterexample generation by testing or formal methods to prune wrong rewrites; combining LLMs, checkers and testing cost-efficiently (§6, PDF pp. 11–12).
  - Tools to distil rules from a shared, anonymized database of queries and manually verified rewrites (§6, PDF p. 12).
  - Comparing more LLMs (§4.2, PDF p. 10).
- **Released:** Nothing stated; the real workloads are private (abstract, PDF p. 1).
- **To reuse it:** a Volcano/Cascades-style optimizer that can export its memo and turn off pruning, timeouts and implementation rules (§2.2, PDF p. 3), and for more coverage guidance and promise (§2.2, PDF p. 4).

## On this site

- **Discussed in:** [Can SQL equivalence checkers be trusted?](#/challenges/checker_soundness) · [Refuting faulty rewrite rules](#/challenges/faulty_rewrite_rules) · [Equivalence of nondeterministic queries](#/challenges/nondeterministic_equivalence) · [Canonical forms for queries](#/challenges/query_canonical_forms) · [Query equivalence: prove or refute](#/challenges/query_equivalence) · [Sourcing realistic, hard query pairs](#/challenges/query_pair_sourcing) · [Discovering new rewrite rules](#/challenges/rewrite_rule_discovery) · [Equivalence under schema constraints](#/challenges/schema_constrained_equivalence) · [Verified query speedups](#/challenges/verified_query_speedup) · [SQL features that verifiers don't cover](#/challenges/verifier_coverage_gaps)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/harness-sql">harness-sql</a><a class="tag sub" href="#/tags/llm-gen">llm-gen</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/pairgen-check">pairgen-check</a><a class="tag sub" href="#/tags/prove-memo">prove-memo</a><a class="tag sub" href="#/tags/qo-rules">qo-rules</a><a class="tag sub" href="#/tags/rewrite-llm">rewrite-llm</a><a class="tag sub" href="#/tags/rules-discover">rules-discover</a><a class="tag sub" href="#/tags/scaling-sql">scaling-sql</a></span>
