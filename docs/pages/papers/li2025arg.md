# ARG: Testing Query Rewriters via Abstract Rule Guided Fuzzing

**ARG** · ASE 2025

Read: [DOI](https://doi.org/10.1109/ase63991.2025.00151)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Fuzzes query rewriters with queries steered toward untested "abstract rules".
- Compares original and rewritten results on generated databases.
- Rewriters return wrong results: it reports 21 semantic deviations among its bugs in Calcite, WeTune, LearnedRewrite and the rewriter in SQLSolver's repository (abstract, Tab. II); it doesn't separate rule errors from implementation bugs (our reading).

## In plain words

A query rewriter turns a database query into a faster one that should return the same answers; a bug can crash it, make it emit SQL the database rejects, or silently change the answers. The authors argue that general database testing tools rarely exercise a rewriter's many specific rewrite patterns (abstract, §I, PDF pp. 1–2). They built ARG, a fuzzer: it generates random tables and queries, runs each query and its rewritten version, and reports crashes, rejected SQL and differing results. It records which kinds of rewrite it has triggered and steers generation toward the others. On four rewriters it reports 38 previously unknown bugs, 21 of them wrong results (abstract, PDF p. 1), and in 24-hour runs more rewrite patterns and bugs than two general query generators. The authors call ARG "the first fuzzing-based approach for query rewriters" (§I, PDF p. 2).

## Background and terms

**Terms to know:** [query rewriting and rewrite rules](#/glossary/query-rewriting-and-rewrite-rules) · [query equivalence](#/glossary/query-equivalence) · [integrity constraint](#/glossary/integrity-constraint) · [NULL and three-valued logic](#/glossary/null-and-three-valued-logic) · [fuzzing](#/glossary/fuzzing) (§VII, PDF p. 10) · [test oracle](#/glossary/test-oracle) (§III-C, PDF p. 6) · [branch coverage](#/glossary/branch-and-path-coverage) (of the rewriter's code, Tab. III, PDF p. 9)

**The paper's own terms:**
- **query rewriter**: inside a database system or standalone, it turns SQL into an equivalent, more efficient form, mostly by matching predefined rules (§II, PDF p. 2). Every rule format reduces to "original structure, rewritten structure, and constraint conditions" (§II "Rewriting Rules", PDF p. 2).
- **keyword AST** (`To`, `Tr`): an abstract syntax tree of the original or rewritten query whose nodes are SQL keywords, with nested subqueries linked in (§III-A, PDF p. 4).
- **abstract rule**: a triple `R = (Fo, Fr, C)` that ARG infers from one observed rewrite, without reading the rewriter's code: `Fo` and `Fr` are keyword-tree fragments of the original and rewritten query, `C` the constraints (keys, NOT NULL …) on the tables under `Fo`; when `C` holds, a part matching `Fo` can be rewritten into one matching `Fr` (§III-A, PDF p. 4).
- **"rule", two senses**: the rewriter's own rules, counted as "unique combinations of real rewriting rules" (§V-C, Tab. IV, PDF p. 9); and ARG's abstract rules (Fig. 7, Tab. VI, PDF pp. 9–10), also called "rewrite rules" (§V-C, PDF p. 9) and "written rules" (abstract, PDF p. 1).
- **Feedback = pos[x0, x1, x2, x3]**: `pos` is where `Fo`'s root sits in the original tree; the four bits mark the rule's behaviours among WHERE-clause, JOIN-change, Subquery-change and UNION-related (§III-B, PDF p. 5).
- **State**: the generator's "core state vector", which shapes the queries it generates (§III-B, PDF p. 6).
- **bug types** (Tab. I, PDF p. 6): *rewriter crash* (no rewritten query); *invalid SQL output* (the original runs, the database rejects the rewritten query); *semantic deviation* (both run, results differ).
- **ARG-**: ARG with rule feedback off, generating clauses at random from the grammar (§V-D, PDF p. 9).

**Builds on:**
- SQLsmith (a random SELECT generator): ARG's query generator is "a customized version of SQLsmith" (§IV, PDF p. 6); also a baseline (§V-C, PDF p. 8).
- SQLancer (a database-testing tool that also creates schemas and data): generates ARG's schemas and data (§IV, PDF p. 6); also a baseline. Neither is on this site.
- sql-formatter (an SQL formatting library): builds the keyword ASTs (§IV, PDF p. 6).
- the documentation of IBM's Db2 (a commercial database system), for three rewrite behaviours: operation merging, operation movement, predicate translation (§III-B, PDF p. 5).

## Problem and setting

- **The question:** how to generate queries that exercise many of a rewriter's rules, and catch broken rewrites, "without requiring knowledge of the internal implementation details" (§II, PDF p. 3).
- **What is tested:** any rewriter behind an interface "which takes a query and schema as input and returns the optimized statement" (§IV, PDF p. 6). Tested, at a given version or commit (§V-A, PDF p. 7): Apache Calcite ([Apache Calcite](#/papers/begoli2018calcite "Apache Calcite: A Foundational Framework for Optimized Query Processing Over Heterogeneous Data Sources (2018)")), an open-source query-processing framework the paper treats as a cost-based optimizer, one that weighs execution costs such as disk I/O (§VI, PDF p. 10); and three it calls rule-based rewriters (§VI, PDF p. 10): WeTune ([WeTune](#/papers/wang2022wetune "WeTune: Automatic Discovery and Verification of Query Rewrite Rules (2022)"), cited for automatic discovery and verification of rewrite rules), SQLSolver ([SQLSolver](#/papers/ding2023sqlsolver "Proving Query Equivalence Using Linear Integer Arithmetic (2023)"), cited paper "Proving query equivalence using linear integer arithmetic") and LearnedRewrite ([LearnedRewrite](#/papers/zhou2021learnedrewrite "A learned query rewrite system using Monte Carlo tree search (2021)"), cited as a learned rewrite system using Monte Carlo tree search).
- **Queries and data:** whatever the customized SQLsmith and SQLancer generate; the examples use outer joins, subqueries in FROM, UNION/EXCEPT, LIMIT and CAST (Tab. II, PDF p. 8; Figs. 5, 6 and 8, PDF pp. 7–10). Each rewriter runs on a database system it supports, such as MySQL (§V-A, PDF p. 7).
- **What counts as a bug:** the three types of Tab. I (PDF p. 6); a semantic deviation means both queries run and return unequal results on the generated database (§III-C, PDF p. 6).
- **Runs:** two weeks of bug hunting; 24-hour comparisons in Docker containers with 10 CPU cores and 10 GiB, every tool starting "with an empty database" (§V-A, PDF p. 7; §V-C, PDF p. 8).

## Approach

ARG loops over three stages (Fig. 2, PDF p. 3):

- **Abstract rule construction (§III-A, PDF pp. 3–5).** Parse both queries into keyword trees; hash each node from its type and children; walk both trees top-down together, and at the first node whose hashes differ take the two subtrees as `(Fo, Fr)`, possibly several per query pair; add the constraint bitmap, whose bits encode each table's constraints, merged bitwise for joins, to get `C`. In the worked example a FROM subquery is flattened (Fig. 3, PDF p. 4). To count each rule once, its identity is the hashes of the "first three" levels of `Fo` and `Fr`; a rule is new if no stored rule has that structure, or one does with different constraints (§III-A, PDF p. 4).
- **Rule-guided query generation (§III-B, PDF pp. 5–6).** When a generated query maps to abstract rules, its `Feedback` lowers the generation probability of structures already seen; a behaviour bit that stays 0 "for multiple consecutive cycles" raises the weight of that kind of clause. *Cross-schema rule propagation:* when a new rule fires, ARG saves `State` and `Feedback`; on a new schema it samples saved pairs into the current state, retrying what worked on schemas with similar constraints (Fig. 4, PDF p. 5).
- **Result validation (§III-C, PDF p. 6).** Watch for crashes, check that the database accepts the rewritten query, then run both queries and compare results.

Implementation: 8.4k lines of Java and about 1k of C++ (§IV, PDF p. 6).

## Results

- **Bugs (§V-B, PDF p. 7; Tab. II, PDF p. 8).** In two weeks, 38 previously unknown bugs across all four rewriters, SQLSolver included: 21 semantic deviations, 13 invalid SQL outputs, 4 crashes. 19 "have been confirmed and acknowledged", the rest are "still under investigation".
- **Case studies.** WeTune gives two output columns the same alias, so the database rejects the rewrite (Fig. 5, PDF p. 7); Calcite drops an outer query as redundant and returns different rows (Fig. 6, PDF p. 8).
- **A database quirk.** A further mismatch is traced to MySQL and not counted; the authors run rewritten queries on several databases to tell such cases apart (§VI, Fig. 8, PDF p. 10).
- **Against SQLsmith and SQLancer, 24 hours (§V-C, PDF pp. 8–9)**: more branches on every rewriter (Tab. III); 76% and 1017% more abstract rules (Fig. 7); 53% and 476% more combinations of real rules (Tab. IV); 38 bugs against 25 and 23 (Tab. V).
- **Ablation (§V-D, Tab. VI, PDF pp. 9–10).** More abstract rules and branches than ARG- on all four rewriters.

## Limits the authors state

- Changes in predicate logic can't be extracted directly, only those "caused by structural transformations, such as converting OR predicates to IN predicates" (§III-B, PDF p. 5).
- Database bugs or quirks "might manifest as semantic equivalence deviations", so an anomaly "could stem from underlying database mechanisms rather than the rewriting logic itself" (§VI, PDF p. 10).
- In the comparisons, "the data may vary due to randomness and differences in generation strategies" (§V-C, PDF p. 8).

## Open problems and building blocks

- **Open:** "we plan to extend ARG to further test SQL optimizers, with the goal of identifying semantic errors and suboptimal plan generation" (§VIII, PDF p. 11).
- **Released:** Nothing stated.
- **To reuse it:** the rewriter wrapped in the query-and-schema interface, SQLsmith, SQLancer and sql-formatter (§IV, PDF p. 6), and a database to run both queries (§V-A, PDF p. 7). The authors say "any rewriter that takes an input schema and original query as input and produces one or more rewritten queries as output can be tested", rule-based or cost-based (§VI, PDF p. 10).

## On this site

- **Discussed in:** [Refuting faulty rewrite rules](#/challenges/faulty_rewrite_rules) · [Sourcing realistic, hard query pairs](#/challenges/query_pair_sourcing)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/cex-search">cex-search</a><a class="tag sub" href="#/tags/rewrite-eval">rewrite-eval</a><a class="tag sub" href="#/tags/rules-verify">rules-verify</a></span>
