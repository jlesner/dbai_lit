# SpotIt: Evaluating Text-to-SQL Evaluation with Formal Verification

**SpotIt** · ICLR 2026

Read: [PDF](https://arxiv.org/pdf/2510.26840) · [arXiv](https://arxiv.org/abs/2510.26840)  
Code: [Spotit-plus](https://github.com/ai-ar-research/SpotIt-plus)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Evaluates text-to-SQL by searching, with bounded verification, for a database that separates generated and gold SQL.
- Extends VeriEQL to strings and dates; filters spurious counterexamples (e.g. from `ORDER BY` + `LIMIT`) by re-execution.

## In plain words

Text-to-SQL systems turn an English question into an SQL query. Benchmarks such as BIRD score a system by running its query and a human-written reference query on one fixed test database and comparing the results, but two different queries can match there by chance. The authors argue that leaderboards drive progress, so their scoring must be reliable (§1). They build SpotIt, which has a solver (a program that finds values meeting logical constraints) search small databases, up to a set number of rows per table, for one on which the two queries disagree, then re-runs both queries on it to rule out false alarms. For this they extend an existing checker, VeriEQL, to string and date operations. On ten leading systems' BIRD predictions, accuracy falls by 9.8 to 13.5 percentage points against the official score, and the ranking changes (§5). In a sample inspected by hand, the reference query was wrong more often than the system's (§5). They call SpotIt "the first verification-based evaluation pipeline for Text-to-SQL" (§7).

## Background and terms

**Terms to know:** [text-to-SQL](#/glossary/text-to-sql) · [gold query](#/glossary/gold-query) · [execution accuracy](#/glossary/execution-accuracy) · [query equivalence](#/glossary/query-equivalence) · [bounded verification](#/glossary/bounded-verification) · [counterexample database](#/glossary/counterexample-database) · [SAT and SMT solvers](#/glossary/sat-and-smt-solvers) · [spurious counterexample](#/glossary/spurious-counterexample)

**The paper's own terms:**
- **EX-TEST**: BIRD's official score; a prediction is correct when its result and the gold result on the test database contain the same set of rows (§2, Eq. 1).
- **Differentiating database**: the paper's name for a counterexample database (§2).
- **Bound K**: the most rows per table the search considers (§2); 5 in the experiments (§5).
- **SpotIt⁻, SpotIt, SpotIt⁺**: the pipeline with plain VeriEQL, with the extended engine, and with cross-checking added (§5); EX-SpotIt and EX-SpotIt⁺ are their accuracy scores (Tab. 3).
- **Coverage**: the share of generated–gold pairs the engine can encode as a solver formula (§5).
- **Symbolic execution** (not in the glossary): running a query on tables whose values are unknowns, so the result is a formula over those unknowns (§2, §4.1 Example 4.1).
- Method names: the ten text-to-SQL methods, e.g. CSC-32B (CSC-SQL with XiYanSQL) and Alpha (Alpha-SQL) (Tab. 1).

**Builds on:** VeriEQL ([VeriEQL](#/papers/he2024verieql "VeriEQL: Bounded Equivalence Verification for Complex SQL Queries with Integrity Constraints (2024)")), which SpotIt extends (§2, §5); BIRD ([BIRD](#/papers/li2023bird "Can LLM Already Serve as A Database Interface? A BIg Bench for Large-Scale Database Grounded Text-to-SQLs (2023)")) and its metric (§2, §5); test-data generation such as [Semantic Evaluation for Text-to-SQL…](#/papers/zhong2020testsuite "Semantic Evaluation for Text-to-SQL with Distilled Test Suites (2020)"), contrasted in §6.

## Problem and setting

The question: when test-based evaluation marks a generated query correct, how often does it really return the gold query's results on every database, and how well does current evaluation measure Text-to-SQL performance (§1)?

- **Fragment:** the grammar of Fig. 2: row filters (`WHERE`), column lists, joins, grouping with aggregates, set operations, `WITH`, `ORDER BY`, `CASE`, NULL, and the new string, date and type-conversion operators (§4.1).
- **Semantics:** results are compared as sets, as BIRD does (§4.1, Eq. 2), where checkers typically support [bags](#/glossary/bag-semantics) and ordered [lists](#/glossary/list-semantics). The valid date range is engine-specific, with SQLite's as the example (§4.1).
- **NULLs:** in the grammar; counterexamples where one query returns nothing and the other NULL are excluded (§5).
- **Bound:** only databases whose tables each hold at most K rows, because full equivalence checking is [undecidable](#/glossary/decidable-and-undecidable) in general (§1, §2).
- **Data:** 1,533 BIRD dev questions over 11 databases (§5). Ten methods' predictions came from their developers, and SpotIt checks only those that pass EX-TEST (§5).

## Approach

- **Encoding (§4.1, Example 4.1):** each table becomes K rows of unknowns; both queries' symbolic execution plus a condition that their results differ form one SMT formula, and a solution decodes into a differentiating database. The authors state that the queries agree on every database within the bound if and only if the formula is unsatisfiable (§2) ([satisfiable and valid](#/glossary/satisfiable-and-valid)).
- **New operators (Fig. 2; App. E–F, Figs. 17–19):** string matching (prefix, suffix, `LIKE`, contains), `SUBSTR`, concatenation, `STRFTIME` date formatting, Julian day (a day count used in date arithmetic), date shifts, and conversions among NULL, integers, dates and strings for implicit casts. A date becomes year, month and day integers with validity constraints, leap years included (§4.1).
- **Encoding matches the definitions:** for any solver solution, the encoded value of an expression equals the value given by the paper's [formal semantics](#/glossary/formal-semantics) (Fig. 17), its mathematical definition of what each operator returns, on the matching concrete database and rows (Thm. 1; Thm. 3 for conditions, App. G).
- **Set comparison:** if the set-equality condition, formula (2) (Eq. 2), is valid, the two results are equal as sets (Thm. 2).
- **Pipeline (§4.2, Fig. 3, Alg. 1):** verification for bounds k = 1 … K, raised while the queries agree; then validation, which re-runs both queries on the database "e.g., in SQLite" to discard spurious ones. Alg. 1 returns nothing after all bounds pass, on a timeout, or on an unsupported query.
- **Cross-checking (Alg. 2):** counterexamples found for one method's query are tried on the other methods' queries for the same question (§4.2).

## Results

Setup (§5): K = 5; one core, 8 GB and 600 seconds per verifier call.

- **Coverage (Tab. 2):** the extensions raise coverage for every method, e.g. CSC-32B from 84.83% (SpotIt⁻) to 94.88% (SpotIt); a counterexample takes seconds on average.
- **Accuracy (Tab. 3):** against EX-TEST, SpotIt cuts every method's accuracy by 9.8 to 13.5 points, e.g. CSC-32B from 71.32% to 58.80%, and cross-checking a little more (57.82%) (§5). Ranks change most in the top half: CSC-32B 1st → 4th, Alpha 3rd → 6th (§5).
- **Bound (Fig. 4):** most extra differences appear going from K = 1 to 2; the gain past 3 is "marginal" (§5).
- **Causes (Fig. 5):** in 50 sampled CSC-32B pairs, the authors attribute 64% of differences to a wrong gold query, 26% to a wrong prediction and 10% to an ambiguous question (§5). They call the databases found "guaranteed to be minimal" (§5).
- **Shared disagreement (Figs. 6–7):** on 36 questions all ten methods differ from the gold query; by inspection 31 have wrong gold queries, 3 ambiguous questions, 2 genuine prediction errors. If shared disagreement also marks wrong gold queries among EX-TEST failures, "even a perfect Text-to-SQL method might not be able to achieve an EX-TEST score much higher than 80%" on BIRD dev (§5).
- **Spider 2.0 (Tab. 4),** a newer text-to-SQL benchmark: for the text-to-SQL method OmniSQL and for GPT-5 on 135 SQLite questions, SpotIt finds differences the test missed, with a smaller supported share than on BIRD (§5).
- **Run time (App. B):** the median rises with columns, [integrity constraints](#/glossary/integrity-constraint), subqueries and query size, not with tables.
- **Findings 1–4 (§5):** tests miss real differences; benchmarks hold many wrong gold queries; ambiguous questions with a single gold query may penalize methods unfairly; SMT checkers already cover much practical SQL.

## Limits the authors state

- Complete equivalence guarantees are "in general undecidable", hence the bound (§1).
- No window or analytic functions (`RANK`, `LAG`) or recursive `WITH`; VeriEQL's `ORDER BY` + `LIMIT` encoding is imprecise and yields spurious counterexamples (App. C).
- Spurious counterexamples come from over-approximated operators ([over-approximation](#/glossary/over-approximation-and-under-approximation)) or "non-deterministic behaviors that cannot be modeled" (§4.2).
- On Spider 2.0 many needed operators are unsupported; the one it names is window functions (`OVER` clauses) (§5).
- Not all leaderboard methods have public predictions (§5); Spider 2.0's are "predominantly closed source" (§5, footnote 3).

## Open problems and building blocks

- **Open:** precisely cover a larger SQL fragment, starting with App. C's features (§5 Finding 4); search for counterexample databases of kinds users prefer, encoded as extra solver constraints (§5 Finding 4); run test-based and verification-based checks as a parallel portfolio, "an orthogonal but interesting future direction" (App. A).
- **Released:** nothing stated.
- **To reuse it:** the extended VeriEQL (§4.1), an SMT solver (Z3 is cited, §2), the schema and both queries, the Fig. 2 fragment, and per-call resources as in §5.

## On this site

- **Discussed in:** [Benchmarks with checkable ground truth](#/challenges/checkable_benchmark_ground_truth) · [Comparing LLM methods under noise](#/challenges/method_comparison_under_noise) · [Minimal counterexamples](#/challenges/minimal_counterexamples) · [Equivalence of nondeterministic queries](#/challenges/nondeterministic_equivalence) · [Text-to-SQL can't be verified against intent](#/challenges/text_to_sql_verification) · [SQL features that verifiers don't cover](#/challenges/verifier_coverage_gaps)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/bounded-smt">bounded-smt</a><a class="tag sub" href="#/tags/cex-llm">cex-llm</a><a class="tag sub" href="#/tags/cex-smt">cex-smt</a><a class="tag sub" href="#/tags/llm-gen">llm-gen</a><a class="tag sub" href="#/tags/nl2sql-eval">nl2sql-eval</a></span>
