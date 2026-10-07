# Search-Based Test Data Generation for SQL Queries

**EvoSQL** · ICSE 2018

Read: [DOI](https://doi.org/10.1145/3180155.3180202)  
Code: [evosql](https://github.com/SERG-Delft/evosql) · [evosql-appendix](https://zenodo.org/records/1166023)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Generates test data covering each SQLFpc coverage target of a query.
- A genetic algorithm with fitness from the instrumented HSQLDB plan; no solver.
- §8 contrasts it with earlier test-DB generators (QAGrow, Emmi et al., ADUSA, QAGen); coverage-driven, not pair-distinguishing.

## In plain words

Testing a SQL query needs rows that make each test goal return output, such as each join and each condition true and false. The authors say earlier tools, which hand the query to a constraint solver (a program that finds values meeting stated conditions), commonly lack support for strings, joins and subqueries (§1, PDF p. 1). They treat data generation as a search: a genetic algorithm proposes table contents and scores, in a modified database, how near they come to satisfying a goal. Their tool, EvoSQL, also runs random search, plain and seeded (e.g. with the query's constants). On 2,135 queries from four applications, the genetic algorithm "is able to completely cover 98.6% of all queries in the dataset, requiring only a few seconds per query" (abstract, PDF p. 1), with every goal met in all ten runs (§5.3, PDF p. 7). Seeded random search completely covered 90%, plain 6.5% (§6.1, PDF p. 7). They add that it "does not suffer from the limitations affecting state-of-the art techniques" (abstract, PDF p. 1), untested against those tools (§8, PDF p. 10).

## Background and terms

**Terms to know:** [genetic algorithm](#/glossary/genetic-algorithm) · [branch and path coverage](#/glossary/branch-and-path-coverage) · [query plan and EXPLAIN](#/glossary/query-plan-and-explain) · [SAT and SMT solvers](#/glossary/sat-and-smt-solvers) · [symbolic execution](#/glossary/symbolic-execution) · [regression testing](#/glossary/regression-testing) · [test oracle](#/glossary/test-oracle) · [branch distance](#/glossary/branch-distance) (Korel's, cited as [22]: for `price=10` it is abs(price − 10); §3.2.2, PDF p. 3) · [constraint satisfaction problem](#/glossary/constraint-satisfaction-problem) (§1, PDF p. 1; not defined there)

**The paper's own terms:**
- **SQLFpc and coverage targets** (§2, PDF p. 2): Tuya et al.'s "full predicate coverage criterion for SQL queries", covering logical operators, joins, grouping, aggregation, subqueries, `CASE` and nulls. It turns a query into targets that are themselves SQL queries; a target is satisfied when the database, filled with the test data, returns at least one row for it.
- **Step** (§3.2.1, Fig. 1, PDF p. 3): the paper views the physical plan as "an ordered list of relational algebra operations" and calls each one (a join, a `WHERE` predicate) a step.
- **Fitness** (§3.2.2, Eq. 2–3, PDF p. 3): the number of plan steps not executed (step level) plus how far the data is from satisfying the step where execution stopped (step distance, scaled into [0, 1) by x/(x+1)); zero when the data covers the target.
- **Seeding** (§3.3.1, PDF p. 5): putting the query's constants into generated cells, and copying values between columns joined by an equality.
- **Completely covered** (§5.3, PDF p. 7): every target covered in every one of 10 runs, "the 'worst-case view'".

**Builds on:**
- SQLFpc of Tuya et al. [37], and their web service that produces the targets (§2, PDF p. 2; §4, PDF p. 5).
- Search-based test generation for programs: Korel's branch distance [22] and Alshraideh et al.'s string distances [1] (§3.2.2, PDF pp. 3–4).
- HSQLDB, a Java relational database engine that can run in memory, which they modified (§4, PDF p. 5).
- Four constraint-solving generators, compared only from their papers (§8, PDF p. 10): QAGrow (Suárez-Cabal et al. [34]; SQLFpc test databases via the Choco solver), Emmi et al. [11] (inputs for branch coverage of application code), ADUSA (Khalek et al. [21]; data for finding database-system faults, via the Alloy solver) and QAGen (Binnig et al. [4]; test databases for database systems, by symbolic query processing, "their extension of symbolic execution").

## Problem and setting

- **The question** (Def. 3.1, PDF p. 2): given a query's coverage targets, find test data satisfying all of them. Research questions (§5, PDF p. 5): coverage, run time, and what keeps each approach from 100%.
- **One target at a time** (§3.3.4, PDF p. 5): the budget is split equally among targets, unused time moves to the rest, and the GA reuses some solutions from earlier targets.
- **Engine** (§4, PDF p. 5): HSQLDB with indexing and short-circuit `AND`/`OR` turned off, as they "would reduce the amount of information we could collect".
- **Dataset** (§5.1, Tab. 1, PDF p. 6): queries logged while running the test suites of Alura (closed-source e-learning), EspoCRM and SuiteCRM (open-source customer-relationship managers) and ERPNext (business management). Removed: queries HSQLDB or SQLFpc doesn't support, queries differing only in constants, and queries with no predicates or other constraints; 19,868 became 2,135. 127 of 12,991 targets were removed by hand as infeasible, e.g. `A > 10 and A < 10` (§5.3, PDF p. 7).
- **Configuration** (§5.2, PDF p. 6): the fastest of 108 GA settings on a 100-query training set; a 30-minute search budget; 10 runs per approach (§5.3, PDF p. 7).

## Approach

- **Fitness from the instrumented plan** (§3.1–3.2, PDF pp. 2–4): a candidate (rows for each table the target uses) is loaded into the engine, the target runs, and the step-by-step trace gives the fitness. Comparisons use branch distance for numbers and booleans, Alshraideh et al.'s "enhanced edit distance" for strings, and calendar-part differences for dates; logic, `IN`, `LIKE`, `EXISTS`, joins and others get their own rules.
- **The GA** (§3.3.1, PDF pp. 4–5): tournament selection (parents are the fittest of random groups of four, §5.2, PDF p. 6); crossover that swaps whole tables between parents; mutation that deletes a row, changes cells by type (or to NULL) and inserts a new or duplicated row; the fittest of parents and children survive. Only columns used in `FROM`, `WHERE`, `GROUP BY` or `HAVING` are searched. It stops at zero fitness or when the budget runs out; when a solution is found, a naive row minimization drops unneeded rows.
- **Baselines** (§3.3.2–3.3.3, PDF p. 5): random search draws fresh random solutions under the same stopping rule; biased random search adds the seeding.
- **Failure analysis** (§5.3, PDF p. 7): per approach, a J48 decision tree (a classifier learning yes/no feature tests) predicts whether a target gets covered from query features such as counts of joins, predicates and columns; SMOTE (Synthetic Minority Over-sampling Technique) generates extra data points for the smaller class.
- **Intended uses** (§7.2, PDF p. 9): query unit testing; query regression testing, "using data sets generated from an earlier version as an oracle"; and integration testing.

## Results

The authors report:
- **Coverage** (§6.1, PDF p. 7; Tab. 3, Fig. 2, PDF p. 8): queries completely covered: GA 2,106 (98.64%), biased 1,923 (90%), random 140 (6.5%).
- **By size** (§6.1, PDF p. 7): with "less than 10 coverage targets" the GA missed 3 of 1,906 queries and biased search 66; with more than 20 targets the GA covered 53 of 71, biased search 5.
- **Run time** (§6.2, PDF pp. 7–8; Tab. 4, PDF p. 8): biased search is the fastest on queries with few targets; then its run time grows faster than the GA's. Table 4's medians: 5.95 s against the GA's 1.48 s at 9–10 targets, 74.04 s against 3.65 s at 11–15.
- **Time budget** (§6.2, Fig. 3, PDF p. 8): "A time budget of one minute is enough for the GA to completely cover simple queries and to cover at least 70% of complex queries"; for complex queries the 30-minute budget "does not seem enough for the biased search".
- **Causes of failure** (§6.3, PDF p. 9): the trees reach 85.93% (random), 90.27% (biased) and 91.88% (GA) accuracy. Joins and string equalities predict failure for random search, many predicates for biased search; for the GA, "the number of columns in a query is what impacts the performance".
- **String functions** (§7.1, PDF p. 9): on hand-written queries using `length`, `left`, `right` or `reverse`, only the GA found solutions ("these queries are just examples").
- **Against solver tools** (§8, PDF p. 10): solvers "may not be able to satisfy certain constraints", e.g. with subqueries and string predicates, and "in our evaluation set, 84.1% of queries contained such constructions".

## Limits the authors state

- The dataset "is limited by the queries that are actually exercised by their test suites", and "more research needs to be conducted to generalize our results" (§7.3, PDF p. 10).
- Infeasible targets were found by hand, with a risk of misclassifying feasible ones; GA probabilities came from well-known intervals tried on 100 tests, and "there might be better configurations" (§7.3, PDF p. 10).
- The dataset "did not contain more complex string manipulation functions" (§7.1, PDF p. 9).
- One GA run per target "often leads to an inefficient allocation of the search budget"; better results "may be obtained" with multi-target algorithms, whose evaluation is future work (§7.1, PDF p. 9).
- The approach "only exercises queries expressed by the standard SQL92 Specification" (the 1992 SQL standard), without database-specific functions and types (§7.2, PDF p. 9; §9, PDF p. 10).
- The authors write that "to the best of our knowledge, none of the tools discussed in this section are available for download", and reimplementing them "would be a highly demanding task", so there is no empirical comparison (§8, PDF p. 10).

## Open problems and building blocks

  - Combining the GA with source-code test generation, which "could increase test coverage substantially" (§7.2, PDF p. 9).
  - Local search or memetic algorithms (local plus global search) (§7.2, PDF p. 9).
  - Further optimizing the GA, using all the schema's integrity constraints to speed up search, and using information from the system's source code (§9, PDF p. 10).
- **Released:** EvoSQL, "available open source" (§4, PDF p. 5); a replication package with the implementations, the R analysis scripts and "the queries and schemas from all systems but the closed-source application Alura" (§5.3, PDF p. 7); the training set in the online appendix (§5.2, PDF p. 6).
- **To reuse it:** a query, a schema and a time budget, the instrumented HSQLDB and Tuya et al.'s target service (§4, PDF p. 5); queries HSQLDB and SQLFpc support (§5.1, PDF p. 6). Another criterion fits if its targets are SQL and count as met on a non-empty result (§2, PDF p. 2).

## On this site

- **Discussed in:** [Minimal counterexamples](#/challenges/minimal_counterexamples)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/cex-search">cex-search</a></span>
