# Explaining Wrong Queries Using Small Examples

**RATest** · SIGMOD 2019

Read: [PDF](https://arxiv.org/pdf/1904.04467) · [arXiv](https://arxiv.org/abs/1904.04467) · [DOI](https://doi.org/10.1145/3299869.3319866)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Given a separating database, looks for the smallest sub-instance that still separates a wrong query from the right one (abstract); its faster algorithm, used for the rest of the experiments (§7.1), minimizes the witness of one differing tuple (§4.2, Alg. 2).
- Provenance of the differing tuples plus Z3 optimization (§4.2, §6); deployed in an undergraduate database course of about 170 students (§8; the paper names only "a US university").

## In plain words

A student's query is often graded by running it and a correct query on a test database. When they differ, the test database shows that the query is wrong but can be too large to show why (abstract, §1). The authors look for the smallest part of that test database on which the two queries still disagree, so the student sees a few familiar rows instead of invented values (§1). They show the search is hard in general and easy for some simple kinds of query, and build a tool, RATest, that records how a wrong output row was produced from input rows and hands that record to a logic solver, which keeps the fewest rows (§3–§6). On real student queries over synthetic test data of 100,000 rows, a faster shortcut, which minimizes for one wrong row only, found counterexamples of the same mean size as the search over all wrong rows and ran about 6.9 times faster (§7). The authors present the problem as new: "to the best of our knowledge, no prior work considered" it (§9).

## Background and terms

**Terms to know:** [counterexample database](#/glossary/counterexample-database) · [query equivalence](#/glossary/query-equivalence) · [relational algebra](#/glossary/relational-algebra) · [data provenance](#/glossary/data-provenance) · [SAT and SMT solvers](#/glossary/sat-and-smt-solvers) · [integrity constraint](#/glossary/integrity-constraint) · [NP-complete and the polynomial hierarchy](#/glossary/np-complete-and-the-polynomial-hierarchy) · [set semantics](#/glossary/set-semantics) · [data, query and combined complexity](#/glossary/data-query-and-combined-complexity) · [witness](#/glossary/witness-provenance) · [optimizing SMT solver](#/glossary/optimizing-smt-solver)

**The paper's own terms:**
- **SPJUD and its subclasses**: queries built from Select, Project, Join, Union and Difference; a subset of letters names a subclass, e.g. PJ = projection and join only (§2).
- **Counterexample**: a sub-instance of the test database that satisfies the constraints and on which the two queries return different results (§2.1, Def. 1).
- **Smallest counterexample problem (SCP)**: find a counterexample with the fewest tuples (rows) (Def. 1).
- **Smallest witness problem (SWP)**: fix one output row that is in one query's result but not the other's, and find the fewest input rows on which that row is still in the difference of the two queries (§2.2, Def. 2). SCP's answer is the smallest SWP answer over all such rows (§2.2).
- **Boolean how-provenance**: a true/false formula over one variable per input row, true exactly when the output row is produced; joins combine with AND, projections and unions with OR, and the paper's rule for difference is AND NOT (§2.3).
- **JU\* and SPJUD\***: JU queries with every union after every join; and differences of SPJU queries (Table 1, App. A.5).

**Missing glossary terms:**
- **Min-ones satisfiability**: satisfy a true/false formula with as few variables true as possible (§4).

**Builds on:**
- Buneman et al.'s witnesses and why-provenance (§2.2).
- Boolean how-provenance (lineage) from Green et al.'s provenance semirings ([Provenance Semirings](#/papers/green2007provenance "Provenance Semirings (2007)")) and Imieliński and Lipski (§2.3).
- Amsterdamer et al.'s provenance for aggregate queries (§5.2).
- Compared against first: the prover Cosette ([Cosette](#/papers/chu2017cosette "Cosette: An Automated Prover for SQL (2017)")), which encodes SQL as logic formulas to find a counterexample, and the test-data generator XData ([XData](#/papers/chandra2014xdata "Data generation for testing and grading SQL queries (2015)")); their counterexamples "can lead to arbitrary values, which may not be meaningful to the user" (§1).

## Problem and setting

- **Queries:** relational algebra, used interchangeably with SQL (§2); SPJUD, then aggregates (§5). Both must have the same output schema ("union-compatible", §2.1). The question is SCP (Def. 1).
- **Semantics:** sets (Thm. 1's proof); the implementation removes duplicates after projection and union (§6).
- **Constraints:** keys, foreign keys, NOT NULL and functional dependencies (§2). All but foreign keys hold on any sub-instance; foreign keys are handled explicitly (§2.1, §4.3).
- **Aggregates:** no aggregate values or NULLs in GROUP BY attributes, HAVING conditions of the simple form "expr relop expr" (one expression compared with another), and no difference above an aggregate (§5).
- **NULLs:** beyond the GROUP BY assumption, not discussed.

## Approach

- **From SCP to SWP:** the authors mainly solve SWP for one differing row, which allows faster solutions and optimizations (§2.2).
  - Two select-join queries, or two select-project-union queries: the smallest witness can be found in time polynomial in data and query size together (Thm. 1, Thm. 2); the same holds for two JU\* queries (Thm. 5).
  - Two SPJU queries: polynomial in data complexity (Thm. 6, via Prop. 1); likewise two SPJUD\* queries (Thm. 7).
  - Two PJ queries, and two JU queries: the theorems state NP-hardness in query complexity, by reductions from vertex cover (choosing few graph nodes that touch every edge) (Thm. 3, Thm. 4); Table 1 lists both as polynomial in data complexity and NP-hard in combined complexity.
  - Two SPJUD queries: NP-hard in data complexity "even for queries of bounded size" (Thm. 8; Table 1's PJD row, projection, join and difference), and with "the database instance only contains two relations" (§3).
- **Solver encoding (§4):** SWP becomes min-ones satisfiability on the row's how-provenance; the true variables are the witness (§4.1).
  - **Basic (Alg. 1)** asks a SAT solver for a new model up to a set number of times and keeps the smallest; for SCP it repeats this for every differing row (§4.1).
  - **Opt_σ (Alg. 2)** picks one differing row, puts a selection on its values on top of the difference query so provenance is computed for it only, and has an optimizing SMT solver minimize the true variables (§4.2).
  - Foreign keys become implications: a row needs the row it refers to (§4.3).
  - Challenges (§5.1): a witness for an aggregate value may need the whole group, while a smaller counterexample can exist (Example 4); how-provenance over all group combinations is impractical for large groups; and a HAVING test of COUNT or SUM against a large constant can force many rows to be kept (Example 5).
  - **Agg-Basic** encodes aggregate values and HAVING tests symbolically and asks for a sub-instance where a group exists in only one result, or in both with different values (§5.2).
  - **Agg-Param** also lets the solver choose the HAVING constants: the smallest parameterized counterexample problem (§5.3.1, Def. 3).
  - **Agg-Opt (Alg. 3)**, a heuristic for queries with the same aggregate functions and attributes, finds a differing row in the results before aggregation, applies the SPJUD method, sets the parameters, and re-runs the solver until the original queries differ (§5.3.2).
- **Implementation (§6):** a relational algebra interpreter turns each operator into a SQL subquery, which gains a column holding the provenance formula. Z3 minimizes the true variables, and a web interface shows the counterexample with both queries' results on it.

## Results

- **Setup:** SPJUD queries are student submissions to one relational algebra assignment (8 questions, 141 students, Fall 2017) on synthetic test instances of 1,000 to 100,000 rows (§7.1). Aggregates use TPC-H (a synthetic decision-support benchmark) at scale 1: Q4, Q16, Q18, Q21 and a variant Q21-S, two hand-made wrong queries each (§7.2). Larger test instances catch more wrong queries (Table 3).
- **SCP against SWP:** at 100,000 rows, Basic (run with the Z3 optimizer, over every differing row) and Opt_σ return the same mean counterexample size, 3.52 rows, in 26.29 s against 3.80 s (Table 4). "for 168 of 170 wrong queries", all output rows' smallest witnesses have the same size, so the authors see "only a small probability of not reaching the global minimum" (§7.1).
- **Run time:** at 100,000 rows, provenance for one selected row is much faster than the plain difference query and than provenance for all rows (§7.1, Fig. 4). Run time grows "roughly" with query complexity (Fig. 3).
- **Solver strategy:** the authors report that Opt "always return a smaller witness" than Naive-\* (Z3 enumerating up to 128 models; best found, averaged over 10 runs), at "negligible" extra run time (§7.1, Fig. 5).
- **Aggregates:** Agg-Opt's solver takes milliseconds on all five queries; Agg-Basic's times out after 2 hours on Q4 (Fig. 6). On Q18, parameterization cuts the counterexample from 25.3 to 7.5 rows (70%) (Fig. 7).
- **User study (§8):** in a Fall 2018 course of about 170 students, most used RATest, optional on 5 of 10 homework problems (Fig. 8). On the harder problems (g) and (i), users averaged 97.98 and 94.40 against 92.38 and 89.80 for non-users (Table 5), "a clear advantage". Users on (i) also scored higher on the similar (h), 93.57 against 88.34, but not on the dissimilar (j), 85.42 against 85.46 (Fig. 9), which the authors say diligence alone cannot explain. 69.4% of questionnaire respondents agreed the counterexamples helped them understand or fix their bug (Fig. 10).

## Limits the authors state

- Basic "may not find the minimum model when it stops", though it "is likely to find one that is small if given enough time" (§4.1).
- The §3 polynomial-time algorithms "are not efficient for practical purposes" (§4).
- On the instance Agg-Opt finds, the original queries' results "may happen to be the same", so it must evaluate them and re-run (§5.3.2).
- The provenance-based aggregate method "may not scale very well when a group contains too many tuples" (§5.3.2); its performance "decreases as the database size increases" (§7.2).
- The test instance "may not be able to differentiate all incorrect queries"; two student queries with "massive cross products" were dropped (§7.1).
- Performance "heavily depends on the solver implementation; a comprehensive evaluation would be beyond the scope of this paper" (§7.1).
- User study: "it is still difficult to conclude how much of this improvement comes from RATest itself"; users may have been "simply more diligent" (§8).

## Open problems and building blocks

- **Open:** None stated.
- **Released:** Nothing stated.
- **To reuse it:** queries in relational algebra; Microsoft SQL Server 2017; Z3 4.7.1 as the optimizing SMT solver; Python 3.6 on Ubuntu 16.04 (§6); experiments on one desktop (Intel Core i7-4790, 16 GB RAM) (§7). Covers SPJUD queries, aggregates under the §5 assumptions, and foreign keys (§4.3).

## On this site

- **Discussed in:** [Minimal counterexamples](#/challenges/minimal_counterexamples) · [Equivalence under schema constraints](#/challenges/schema_constrained_equivalence)
- **Tags:** <span class="tags"><a class="tag" href="#/tags/reduce">reduce</a><a class="tag sub" href="#/tags/cex-smt">cex-smt</a></span>
