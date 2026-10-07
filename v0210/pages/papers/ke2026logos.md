# Logos: Certified Order-Sensitive SQL Rewrites with Mechanized Semantics and LLM Guidance

**Logos** · preprint Aug 2026

Read: [PDF](https://arxiv.org/pdf/2608.15709) · [arXiv](https://arxiv.org/abs/2608.15709)  
Code: [FormalSQL](https://github.com/WindOctober/FormalSQL) · [Logos](https://github.com/WindOctober/Logos)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Order-sensitive SQL semantics mechanized in Rocq (FormalSQL); an LLM proof agent proves equivalence or proposes a counter-database.
- Each certificate it produces is checked by the Rocq kernel (§1); it claims one for every equivalence result (§5.3).

## In plain words

A rewritten, faster query is safe only if it returns the same rows as the original on every database of any size; testing can find a difference but never prove there is none (§1). This is hard when order matters: SQL often leaves order open, so keeping the first 20 rows can legally return different rows, and existing checkers mostly ignore order, allow it only in restricted forms, or fix one arbitrary order (abstract, §1). The authors define SQL's meaning inside the [proof assistant](#/glossary/proof-assistant) Rocq, keeping every legal order, and prove when simpler order-free reasoning is still safe. Logos asks an LLM agent for a proof that two queries agree or a database on which they differ, and Rocq's checker, not the LLM, accepts it (§1). On 389 query pairs Logos solves 86.9%, against 64.0% for SQLSolver, the strongest earlier automatic prover (abstract). They claim, "to our knowledge", the "first mechanized" (machine-checked) SQL semantics combining nested first-k-rows queries with ties and this shortcut (abstract).

## Background and terms

**Terms to know:** [proof assistant](#/glossary/proof-assistant) · [certificate](#/glossary/certificate) · [formal semantics](#/glossary/formal-semantics) · [bag semantics](#/glossary/bag-semantics) · [list semantics](#/glossary/list-semantics) · [query equivalence](#/glossary/query-equivalence) · [counterexample database](#/glossary/counterexample-database)

**The paper's own terms:**
- **FormalSQL**: the authors' Rocq library, an "order-sensitive extension of SQLCoq" giving each query the set of its legal ordered row lists plus the errors it can raise (§1, §4).
- **top-k, tie-sensitive**: `LIMIT`/`FETCH` keep the first k rows; with ties or no `ORDER BY`, which rows is open (§1, §2).
- **outcome equivalence**: neither query's outcome set is empty, every legal list of each matches one of the other's row by row, and the errors agree (Def. 6); queries are equivalent when this holds on every database satisfying the schema's [integrity constraints](#/glossary/integrity-constraint) (Def. 7).
- **bag closed**: every reordering of each possible row bag is also legal (Def. 8).
- **countermodel**: a fixed database plus a Rocq proof that one query has a legal outcome the other cannot match (§1).
- **Unsupported** (Tab. 2): "non-definite outcomes other than timeouts", e.g. syntax or lowering failures (§5.2).

**Builds on:** SQLCoq ([A Coq mechanised formal…](#/papers/benzaken2019coq "A Coq mechanised formal semantics for realistic SQL queries: formally reconciling SQL and bag relational algebra (2019)")), an executable SQL semantics in Coq (Rocq's former name), extended into FormalSQL (§1, §4). Compared against three earlier unbounded verifiers (§5.1): SQLSolver ([SQLSolver](#/papers/ding2023sqlsolver "Proving Query Equivalence Using Linear Integer Arithmetic (2023)")), which reduces queries to an extension of linear integer arithmetic for SMT solvers; QED ([QED](#/papers/wang2024qed "QED: A Powerful Query Equivalence Decider for SQL (2024)")), which normalizes queries and uses SMT for side conditions; and Cosette ([Cosette](#/papers/chu2017cosette "Cosette: An Automated Prover for SQL (2017)")), a bounded counterexample search plus Coq proofs.

## Problem and setting

- **Question:** prove or refute, over databases of "arbitrary finite cardinality" (§6; "unbounded", unlike [bounded verification](#/glossary/bounded-verification)), that two queries agree when duplicates, order, typed values and runtime errors matter (abstract, §1).
- **Fragment:** the typed core of Fig. 2: joins of all kinds, `ALL` set operations, `DISTINCT`, grouping, grouping sets, `RANK`, windows, `ORDER BY`, `OFFSET`, `FETCH`, subqueries, `CASE`, casts, aggregates (§3.1); [correlated subqueries](#/glossary/correlated-subquery) through a stack of "bindings", the rows of enclosing queries in scope (§3.2).
- **Semantics:** ordered lists, bags derived; [NULLs and three-valued logic](#/glossary/null-and-three-valued-logic) and errors modeled (§3.2); "PostgreSQL-oriented" values and errors, with PostgreSQL's documented behavior where the standard is silent (§1, §5.4). Constraints: keys, NOT NULL, CHECK, unique indexes (Fig. 2). A failed search reports "unknown" (§3.2).
- **Benchmarks:** 389 pairs in six families (§5.1, Tab. 1): Literature (30, from VeriEQL, a bounded SMT checker, §6); Calcite (236, from tests of the Apache Calcite query optimizer); R-Bot TPC-H (22) and R-Bot DSB (37), on the decision-support benchmarks TPC-H and DSB, with targets made by "applying a single rewrite" with the Calcite rewrite engine of R-Bot, an LLM rewriting system, so they are "deterministic rewrite workloads rather than unpublished LLM outputs"; TPC-DS variants (14 official templates of the decision-support benchmark TPC-DS, with variants); and WeTune (50 before/after rewrites from open-source application commits, via the WeTune study).
- **Model and budget:** `gpt-5.6-sol` at medium reasoning effort, at most three counterexample rounds, 14,400 s and 16 GB per pair (§5.1).

## Approach

- **Rules (§3.2, Fig. 3):** scans, set operations, joins and grouping may return any order of their result bag; projection and filter keep their input's order; `ORDER BY` admits every sorted order, so ties stay open; `OFFSET`/`FETCH` cut by position.
- **Thm. 9 (bag-to-list lifting):** for two queries with the same output columns and types, whose outcome sets are non-empty and whose successful lists are both bag closed, the queries are outcome-equivalent exactly when they have the same set of possible bags and the same errors (§3.3). Row-count proofs can then be done locally and carried outward, since swapping in an equivalent sub-query keeps the whole equivalent ("semantic congruence", mechanized in FormalSQL, §3.3).
- **Thm. 10 (closure-certificate soundness):** the paper's "syntactic certificate" is a test on the query's outermost operator, not a checkable proof in the glossary's sense. For every admitted query whose outermost operator is a table scan, an empty or one-row constant table, a set operation, a join, `DISTINCT`, grouping, grouping sets, `RANK` or a window, its legal lists are bag closed on every database and every set of outer-row bindings (proof sketch). For projection and filter, closure "requires additional premises" (§3.3).
- **Running example (Fig. 1, §2, §3.4):** a rewrite from the WeTune family replaces an `IN` subquery with a join under `LIMIT 20`; a unique key makes the row counts match, and Thm. 11 proves the pair equivalent under that schema.
- **Pipeline (§4):** SQLGlot (a SQL dialect translator) turns the input into Calcite SQL, Calcite resolves types, and a Rust frontend lowers the pair to a Rocq goal. Then an "untrusted proof-search loop": the LLM agent, given a compact FormalSQL context and indexes of the lemma library (over 2,000 verified lemmas), picks equivalence or non-equivalence and keeps submitting candidate Rocq proof modules to the checker for diagnostics (§5.3). The kernel, Rocq's small trusted core, checks the final certificate "in isolation" (§1), leaving "certificate acceptance to Rocq" (§6).
- **Non-equivalence (§1, §4):** one engine run sees only one legal order, so Logos accepts non-equivalence only through a checked countermodel or "an observable mismatch between the queries' output signatures", that is, their output columns or types differ (§4).

## Results

- **Coverage (Tab. 2, §5.2):** it reports 338 of 389 solved (86.9%) against 64.0% for SQLSolver, 54.8% for QED and 12.9% for Cosette. Logos has the highest solved count on every family, tying SQLSolver on R-Bot TPC-H; most of its unsolved pairs are timeouts (Tab. 2).
- **Order-sensitive pairs (§5.2):** 73.1% solved against 41.3% for SQLSolver.
- **Unsupported (§5.2):** 1.0% for Logos against 30.3% (SQLSolver), 45.2% (QED) and 87.1% (Cosette). The authors call the main gain "semantic reach rather than merely a stronger decision procedure" (§5.2).
- **Runtime (§5.3, Fig. 4):** the authors report that on solved cases Logos's median is 3,632 s, against medians of 1.4–8.5 s for the baselines.
- **Bottleneck (§5.3):** 87.6% of agent-round time is spent outside Rocq checking, on "model deliberation and proof orchestration"; 50,841 of 53,565 submitted candidate modules do not compile.
- **Certificates (§5.3):** "Every equivalence result has a Rocq certificate"; most certificate modules call the Logos lemma library.

## Limits the authors state

- SQLGlot "cannot guarantee semantic preservation across dialects", so a few outcomes may be wrong either way; adopting PostgreSQL behavior "does not eliminate dialect-specific discrepancies" (§5.4).
- Agent search "is also not fully deterministic"; the runtime distribution and timeout boundary "may vary under repeated campaigns" (§5.4).
- Logos is "substantially slower" than the baselines; its route leaves proof construction "to a comparatively expensive synthesis loop" (§5.3).
- Its four unsupported cases come from "isolated frontend and formalization gaps" (§5.2).
- Its marks in Tab. 3, a table of which features each system supports, cover only its "stated typed SQL fragment, rather than all PostgreSQL or ISO SQL" (§6).

## Open problems and building blocks

- **Open:** "deterministic proof templates, more selective lemma retrieval, and incremental diagnostics" as the main ways to cut synthesis cost (§5.3).
- **Released:** the Logos implementation (§4, footnote) and the FormalSQL mechanization, including the typing and semantic rules left out of Fig. 3 (§3.2, footnote).
- **To reuse it:** Rocq with FormalSQL, SQLGlot, Calcite and the Rust frontend (§4); an LLM proof agent (`gpt-5.6-sol`, medium effort), proof search capped at 14,100 s and Rocq checking at 420 s per pair, a 6 GB agent sandbox (§5.1); queries inside the Fig. 2 core.

## On this site

- **Discussed in:** [Can SQL equivalence checkers be trusted?](#/challenges/checker_soundness) · [Equivalence of nondeterministic queries](#/challenges/nondeterministic_equivalence) · [Query equivalence: prove or refute](#/challenges/query_equivalence) · [Equivalence under schema constraints](#/challenges/schema_constrained_equivalence) · [SQL features that verifiers don't cover](#/challenges/verifier_coverage_gaps)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/cex-llm">cex-llm</a><a class="tag sub" href="#/tags/harness-sql">harness-sql</a><a class="tag sub" href="#/tags/itp-sql">itp-sql</a><a class="tag sub" href="#/tags/llm-assist">llm-assist</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/nondet-semantics">nondet-semantics</a><a class="tag sub" href="#/tags/prove-itp">prove-itp</a></span>
