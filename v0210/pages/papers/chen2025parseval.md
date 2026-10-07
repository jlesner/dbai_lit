# ParSEval: Plan-aware Test Database Generation for SQL Equivalence Evaluation

**ParSEval** · PVLDB 18(11) 2025

Read: [PDF](https://dbgroup.cs.tsinghua.edu.cn/jnwang/papers/vldb2025-parseval.pdf) · [DOI](https://doi.org/10.14778/3749646.3749727)  
Code: [ParSEval](https://github.com/sfu-db/ParSEval)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Generates test databases that aim to cover every branch of the queries' logical plans (abstract; a greedy heuristic, §4.2).
- No LLM; plan-aware branch coverage.

## In plain words

Text-to-SQL benchmarks score a model's query by running it and the reference query on a few databases and comparing results, so a wrong query can pass unnoticed. The authors say logic-based equivalence provers may lack support for advanced SQL features, while test-data generators fail to fully explore a query's structure (abstract, PDF p. 1). ParSEval builds test databases on purpose: it breaks the query into its tree of operations, lists the ways each can behave (a filter keeping some rows and dropping others), and asks a constraint solver for rows that make each behaviour happen. Across four sets of query pairs, the authors report that it handles up to 40% more pairs than the provers and runs 21× faster than the random-data generator behind the Spider benchmark's test suites (abstract, PDF p. 1; on BIRD, §5.2.2, PDF p. 10), finding at least 8% more wrong queries than it (§7, PDF p. 12). They present it as test-based checking improved with formal-verification ideas (§1, PDF p. 2).

## Background and terms

**Terms to know:** [query equivalence](#/glossary/query-equivalence) · [counterexample database](#/glossary/counterexample-database) · [text-to-SQL](#/glossary/text-to-sql) · [execution accuracy](#/glossary/execution-accuracy) · [symbolic execution](#/glossary/symbolic-execution) · [path and branch coverage](#/glossary/branch-and-path-coverage) · [SAT and SMT solvers](#/glossary/sat-and-smt-solvers) · [integrity constraint](#/glossary/integrity-constraint) · [bag semantics](#/glossary/bag-semantics) · [logical plan](#/glossary/logical-plan) (ParSEval gets it from Apache Calcite, a query-processing framework, [Apache Calcite](#/papers/begoli2018calcite "Apache Calcite: A Foundational Framework for Optimized Query Processing Over Heterogeneous Data Sources (2018)"); §3.1, PDF p. 5)

**The paper's own terms:**
- **ground truth query**: the reference query, a [gold query](#/glossary/gold-query) (§1, PDF p. 1).
- **test suite, S-equivalent** (Def. 1, PDF p. 3): a set of databases satisfying the integrity constraints; two queries are S-equivalent if their results are identical on every one.
- **"positive", two senses:** in "False Positive" (Def. 1, PDF p. 3), a pair the suite calls equivalent although it isn't; in "positive branch" (§3.1, PDF p. 5), an operator returning a non-empty result, the "negative branch" being the other cases.
- **neighbor queries** (§2.1–2.2, PDF p. 3): variants (mutants) of the ground truth with one predicate or operator changed, the target of the earlier test generators Spider-TS and XData.
- **U-expression** (§2.3, Tab. 1, PDF pp. 4–5): a formula giving how many copies of each row an operator outputs (the row's multiplicity); for a filter, the row's count times 1 if the condition holds, else 0.
- **coverage constraint** (Def. 3, PDF p. 4): a U-expression condition saying that one behaviour of one operator happens on the database, in five forms (predicate, multiplicity, grouping, binary-nojoin, and binary-set/bag, which compares a row's multiplicities in two inputs; examples under Approach). The record of which ones a database satisfies, over all operators, is its **query plan coverage** (Defs. 4–5, PDF pp. 5–6).
- **relaxed completeness** (§3.2, Eq. 3, PDF p. 6): each coverage constraint must hold on at least one database of the suite, with as few databases as possible, instead of covering every combination (Eq. 2).
- **symbolic instance** (§4.1, Fig. 5, PDF p. 6): a small database whose cells are unknowns, constants or NULL, each row with a formula for its count, plus key and foreign-key conditions.
- **unsupported** (§5.2.1, PDF p. 10): the method can't handle the pair or gives no verdict before the timeout; for test generators, also both results empty on every database. Support ratio: the share not unsupported.
- **ParSEval-Sym, ParSEval-Hybrid** (§4.2–4.3, PDF pp. 7–9): see Approach; the experiments' "ParSEval" is Hybrid (§5.1, PDF p. 9).

**Missing glossary terms:**
- **U-semiring** (§2.3, PDF p. 4): an algebra in which a relation maps each possible row to its count, with duplicate removal, negation and a sum over all possible rows; provers use it to model SQL under bag semantics.

**Builds on:**
- Ding et al.'s extension of U-semirings, behind the prover SQLSolver (§2.3, PDF p. 4; [SQLSolver](#/papers/ding2023sqlsolver "Proving Query Equivalence Using Linear Integer Arithmetic (2023)")).
- CInsGen and QAGen, query-aware instance generators (§3.1, PDF p. 4).
- Spider-TS, the test-suite generator compared against first (§1, PDF p. 2; [Semantic Evaluation for Text-to-SQL…](#/papers/zhong2020testsuite "Semantic Evaluation for Text-to-SQL with Distilled Test Suites (2020)")).

## Problem and setting

- **Question:** given a ground-truth query, schema and constraints, find a test suite that separates it from as many inequivalent predictions as possible (Def. 2, Eq. 1, PDF p. 3); plan coverage serves as the proxy (§3.2, PDF p. 6).
- **Correctness:** equivalent means identical results on every database satisfying the constraints (§2.1, PDF p. 3). The authors argue test suites give only false positives, no false negatives, so the objective counts only separated pairs.
- **SQL covered:** selection, projection, join, set/bag operations, group-by aggregation, and "ORDER BY, CASE WHEN, IN/NOT IN, etc."; keys, foreign keys, unique, not null (§2, PDF p. 2); bag semantics via U-expressions (§2.3, PDF p. 4). How two results are compared (as sets, bags or ordered lists) is not discussed.
- **Datasets** (§5.1, PDF pp. 9–10): the text-to-SQL benchmarks BIRD (1534 dev queries) and Spider (1034), with predictions from the repository of DAIL-SQL, an LLM text-to-SQL method; LeetCode (23,865 pairs of answers to LeetCode questions, collected by VeriEQL's authors); Literature (64 pairs from equivalence papers).
- **Baselines** (§5.1, PDF p. 9): the prover SQLSolver (SQL into linear integer arithmetic for an SMT solver), the checker VeriEQL ([VeriEQL](#/papers/he2024verieql "VeriEQL: Bounded Equivalence Verification for Complex SQL Queries with Integrity Constraints (2024)")), which uses [bounded verification](#/glossary/bounded-verification), and Spider-TS (random test databases). Left out: the mutant-based generator XData, for low support; the provers SPES and QED, whose code lacks foreign keys. Timeout 360 s.

## Approach

- **Pipeline** (Fig. 6, PDF p. 7): parse into a logical plan, encode each operator as a U-expression, emit its coverage constraints (Tab. 2, PDF p. 5), solve. Filter: some row passes, some fails. Join: some pair joins, some row joins nothing. Projection and grouping: some row duplicated, some group above a size threshold (no negative branch). Set difference: a row in one input only, a row in both.
- **Symbolic execution** (§4.1, Fig. 7, PDF pp. 6–7): a custom engine runs the plan on a symbolic instance; output row counts are formulas. Constraints become SMT formulas (each condition an if-then-else worth 1 or 0) for Z3 or cvc5; a solution gives concrete rows (§4.2, PDF p. 7).
- **ParSEval-Sym** (Alg. 1, §4.2, PDF pp. 7–8): requires all positive-branch constraints, tries the largest uncovered set of negative-branch constraints first, grows tables from 1 row to a size limit, keeps each database found. The authors call it a "greedy heuristic" (PDF p. 8).
- **ParSEval-Hybrid** (§4.3, PDF pp. 8–9), a "novel hybrid approach" (§4.3.1, PDF p. 8): since symbolic formulas grow with table size and query complexity, some unknowns get values before solving: join keys matched along a foreign key, random values for unique attributes used only in joins and keys, fixed group-by values and group sizes. A failed guess falls back to the symbolic formula.

## Results

- **Disproved and unsupported pairs** (Fig. 8, PDF p. 9; §5.2.1, PDF p. 10): it reports ParSEval disproving the largest share of pairs and supporting most pairs on all four datasets. On BIRD and Spider the provers fail on `ORDER BY`, nested subqueries and `CAST`; the authors say the gain over Spider-TS is "clearer for human-crafted queries".
- **Speed** (Tab. 3, PDF p. 10): mean 7.62 s per BIRD pair against 166.77 s (Spider-TS) and 57.36 s (SQLSolver).
- **Recall** (§5.3, PDF p. 11): on BIRD hand-labelled by the authors (979 of 1534 pairs inequivalent), 91.01% against 76.30% (Spider-TS), 46.17% (VeriEQL) and 27.89% (SQLSolver).
- **Failure analysis** (§5.3, PDF p. 11): Spider-TS struggles with [correlated subqueries](#/glossary/correlated-subquery); the provers sometimes called pairs differing only in projected columns equivalent, which the authors "manually fixed". Per feature on BIRD (Tab. 4, PDF p. 11), the authors state ParSEval's support beats all methods on each.
- **Ablation on BIRD** (§5.4, Tab. 5, PDF pp. 11–12): more constraints disprove more pairs; covering all subsets takes 20.83 s against 7.62 s and finds no more. ParSEval-Sym supports 49% of pairs against Hybrid's 98%.
- **Against BIRD's own databases** (§5.5, PDF p. 12), one model on BIRD dev: a suite built per schema from the ground-truth queries alone flags 59.45% of pairs inequivalent against 50.33%, using 88 MB against 1.7 GB; manual inspection finds 41 false positives against BIRD's 180.

## Limits the authors state

- ParSEval-Sym risks "path explosion" (formulas growing with every combination of rows), and the U-expression encoding "still struggles" with `ORDER BY` and aggregates (§4.3, PDF p. 8).
- The group-by assignment holds "as long as there are no other constraints like selection predicates on the group-by attributes" (§4.3.1, PDF p. 9).
- "it did not handle varying numbers of NULL values", missing pairs such as `COUNT(bond_id)` against `COUNT(bond_type)` (§5.3, PDF p. 11).
- Chained string transformations "remain challenging and may cause constraint solving to fail" (§5.3, PDF p. 11).
- The ground-truth-only suite misses wrong joins (an extra joined table gets no rows) and SQLite-specific types and functions such as the date function `JULIANDAY` (§5.5, PDF p. 12).

## Open problems and building blocks

  - "further optimizations for branch collection" and integration "with random data generation to support an even larger number of query pairs" (§7, PDF p. 12).
  - The NULL gap "can be addressed by incorporating multiplicity constraints on NULL values" (§5.3, PDF p. 11).
- **Released:** "The source code, data, and/or other artifacts have been made available" (PVLDB Artifact Availability, PDF p. 1).
- **To reuse it:** Python 3.8, Calcite's parser, Z3 or cvc5; experiments on a 32-core server with 1000 GB RAM (§4.2, PDF p. 7; §5.1, PDF p. 9). Inputs: schema, constraints, one query or both.

## On this site

- **Discussed in:** [Can SQL equivalence checkers be trusted?](#/challenges/checker_soundness) · [Equivalence of nondeterministic queries](#/challenges/nondeterministic_equivalence) · [Text-to-SQL can't be verified against intent](#/challenges/text_to_sql_verification) · [SQL features that verifiers don't cover](#/challenges/verifier_coverage_gaps)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/cex-smt">cex-smt</a><a class="tag sub" href="#/tags/nl2sql-eval">nl2sql-eval</a></span>
