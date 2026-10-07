# Data generation for testing and grading SQL queries

**XData** · VLDB J. 24(6) 2015

Read: [PDF](https://arxiv.org/pdf/1411.6704) · [arXiv](https://arxiv.org/abs/1411.6704) · [DOI](https://doi.org/10.1007/s00778-015-0395-0)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Generates small datasets that "kill" query mutants (join-type, comparison, aggregation, …).
- Each mutant-killing condition becomes constraints for the SMT solver CVC3; string conditions are solved outside it by XData's own string solver (§2.3, §4.2; Z3 only as "ongoing work", §13.3, and used by the successor, [Test Data Generation for Complex SQL Queries](#/papers/somwase2024complex "Test Data Generation for Complex SQL Queries (2025)") §5.1); also grades student queries.
- A non-LLM generator of counterexample data for *likely* mistakes; successor [Test Data Generation for Complex SQL Queries](#/papers/somwase2024complex "Test Data Generation for Complex SQL Queries (2025)").

## In plain words

A wrong SQL query is often a small change of the right one: an inner join where an outer join was meant, or a wrong comparison operator. The authors say tests on hand-made or query-independent data "are likely to miss errors in queries", and graders reading queries are "likely to miss subtle mistakes" (§1). They extend XData, their system that turns each targeted mistake into constraints for a solver (a program that finds values meeting them) and its answer into a tiny test database on which the correct and mistaken queries differ. The extension covers string patterns, NULLs (missing values), conditions on aggregates, subqueries, set operations and more mistake types; they also build a grading tool (abstract, §1). On mistaken versions of TPC-H decision-support benchmark queries that are not equivalent to the original, they report catching 108 of 110 (§13.3). On one course's student queries, they report catching more wrong queries overall than two textbook sample databases, and that the tool "outperforms TAs" (teaching assistants) (§13.4). They present it as extending XData to "a much larger class of mutations" (abstract).

## Background and terms

**Terms to know:** [mutation testing](#/glossary/mutation-testing) · [counterexample database](#/glossary/counterexample-database) · [SAT and SMT solvers](#/glossary/sat-and-smt-solvers) · [query equivalence](#/glossary/query-equivalence) · [integrity constraint](#/glossary/integrity-constraint) · [NULL and three-valued logic](#/glossary/null-and-three-valued-logic) · [correlated subquery](#/glossary/correlated-subquery) · [bag semantics](#/glossary/bag-semantics) · [finite automaton](#/glossary/finite-state-machine) · [LIKE and ILIKE](#/glossary/like-and-ilike)

**The paper's own terms:**
- **mutation, mutant, kill**: a mutation is one syntactically correct change to the query, and a mutant the query after one or more mutations; a dataset kills a mutant if the two give different results on it, and a test suite kills it if one of its datasets does (§1).
- **first dataset**: the dataset built to give the query a non-empty result, "wherever feasible"; it already kills several mutants that return nothing on it (§2.1).
- **constrained aggregation**: an aggregate whose result must meet a condition, as in a HAVING clause or in the query around a subquery with aggregation (§6).
- **USm, ULg**: the small and larger sample University databases from the Silberschatz et al. textbook; USm was "manually created" "to catch common errors" (§13.4).

**Builds on:**
- The authors' earlier XData papers, Gupta et al. 2010 and Shah et al. 2011 (§1); §2 summarizes the latter.
- Tuya et al.'s technique for killing mutations under OR, now in XData (§2.4).
- Reverse Query Processing (Binnig et al.), which generates a database from a query and its result; from it they "borrow the idea" of finding a tuple count by repeated solver tries (§6.1).
- Qex, which uses the SMT solver Z3 to generate data and parameters giving a parameterized query a non-empty result, but "does not address killing of query mutations" (§12).

## Problem and setting

- **The question:** for a correct SQL query, generate "a relatively small number of" datasets that kill "a wide variety of query mutations" (§1), and grade student queries with them (§11).
- **Queries covered:** single-block (subquery-free) select/project/join/outer-join queries with optional aggregation; subqueries up to "a single level of nesting"; UNION, INTERSECT and EXCEPT, with and without ALL (§3). §10 adds parameters, views, INSERT/DELETE/UPDATE, dates and reals.
- **Assumptions:** only unique, primary-key and foreign-key constraints; only simple arithmetic; join predicates are conjunctions of simple conditions; no user-defined functions; single mutations only (§3).
- **NULLs:** modelled with designated ordinary values, since "to the best of our knowledge, none of the SMT solvers supports NULL values with SQL NULL value semantics" (§5).
- **What "correct" means:** a student query is marked incorrect if its result differs from the correct query's on some dataset, duplicates counted unless the instructor decides otherwise (§11). The authors "do not aim to prove query equivalence" (§11).
- **Data:** the textbook's University schema (§13.1, §13.2, §13.4); TPC-H, a benchmark of 22 queries, with mutants from volunteers outside the project (§13.3); 14 questions from an IIT Bombay undergraduate database course (§13.4).

## Approach

- **Core loop (§2.1–2.3):** each relation (table) is an array of tuples (rows) of solver variables, its size fixed before solving; selections, joins, primary and foreign keys become constraints for the solver CVC3. Each dataset targets mutations; "we do not generate any mutants at all" (§1).
- **Earlier mutations (§2.2):** join types die by a tuple without a join partner; comparisons by greater, less and equal datasets; unconstrained aggregate swaps by three tuples, two sharing a non-zero value.
- **Strings (§4, App. B):** "many constraint solvers, including CVC3, do not support string constraints", so their own solver runs first, intersecting automata per variable, taking the lexicographically smallest accepted string (Algorithm 4). Datasets kill swaps among the LIKE operators (Tab. 1) and of `%` and `_` (§4.3).
- **NULLs (§5):** a different NULL value per variable, so no two compare equal; this covers nullable foreign keys, IS NULL mutations and COUNT(attribute) against COUNT(*).
- **Constrained aggregation (§6, App. A, App. C):** estimate the tuples a group needs from constraints linking SUM, MIN, MAX, AVG, COUNT and the domain, trying counts up to a cap (32 in the experiments), keeping the smallest CVC3 solves; give each joined relation 1 tuple or the n the group needs, by rules on which attributes must be unique or single-valued in a group (heuristic, Algorithm 3); Algorithm 5 keeps extra tuples from changing a group.
- **Subqueries (§7):** EXISTS gets subquery tuples per outer tuple; for NOT EXISTS, Algorithm 1 adds constraints so that the subquery yields no tuple. IN, NOT IN, ANY and ALL are rewritten into EXISTS or NOT EXISTS. Datasets target connective mutations and those inside the subquery (§7.3–7.4).
- **Set operators (§8):** eight datasets with zero, one or several copies of a tuple per side (Tab. 2), which the authors say kill all operator swaps, except possibly some involving EXCEPT ALL, when all can be generated (§8.2).
- **§9:** missing or extra join conditions and GROUP BY attributes, and DISTINCT mutations.
- **Grading tool (§11):** compares the student and correct queries on each dataset with EXCEPT ALL both ways; a learning mode shows the failing dataset, tagged with its target mutation.
- **Completeness argument (App. D):** operator by operator, whether a difference arises at the mutated operator and reaches the root, using only necessary constraints.

## Results

The authors' claims; only non-equivalent mutants counted.

- **Constrained aggregation (§13.1, Tab. 3):** non-empty results for all nine queries; 35 of 36 hand-written mutants killed; MAX to MIN on CA2 survived because the relation with the MAX got only one tuple.
- **Subqueries (§13.2):** non-empty results on all ten queries; all 40 hand-written mutants killed.
- **TPC-H (§13.3, Tab. 4):** datasets for 17 of 22 queries (four used unsupported constructs, CVC3 crashed on one); 108 of 110 mutants killed, the misses being one extra GROUP BY attribute and one arithmetic-operator mutation, a kind not targeted.
- **Grading (§13.4, Fig. 1, Tab. 7):** the results "indicate that, overall," XData caught more incorrect queries than USm and ULg, and it "performed significantly better" than TAs on many queries. CQ8: of 79 submissions, XData caught 33, USm 12, ULg 14, the TAs 16.
- **Plan matching (§13.4):** marking a student query correct when its PostgreSQL plan matches the correct query's passed less than 5% for CQ3, CQ7, CQ8, CQ13 and CQ14.
- **String solver (App. B.2, Tab. 6, Figs. 4–5):** against Hampi, Kaluza, SUSHI, Rex and CVC4 (string solvers), XData's solver and CVC4 were the most efficient on the Tab. 5 test cases, but only XData's solved the three with several string variables; it "turned out to be the most efficient for most cases" as string length grew.

## Limits the authors state

- Queries with several mistakes are "likely, but not always guaranteed, to be killed" (§3).
- Grading may miss extra selection conditions, and extra join conditions on differently named columns: "it is possible that a non-equivalent student query may be marked correct" (§11).
- String constraints must be independent of other constraints (§4); with OR in the selection they can't be separated (§4.2). Constrained aggregates must be on one attribute, without OR (§6); NOT EXISTS subqueries currently must have no OR (§7.1).
- "primary key constraints may prevent generation of datasets with duplicates"; if only the last set-operator dataset can be generated, EXCEPT ALL mutations may survive (§8.2).
- Datasets for one correct query "may or may not succeed in killing mutations of a different formulation"; instructors can upload several correct queries (§11).
- Not handled: some FROM-clause subqueries with aggregates, and LATERAL (subqueries referring to earlier FROM items) (§10). ORDER BY mutations can't in general be caught by comparing results (§10).
- "it is difficult for us to provide any completeness results for our grading tool"; the TAs' actual effectiveness "is a little better than what the table indicates", as they ignored minor errors (§13.4).
- "Although not complete, in practice our data generation techniques work well" (App. D.4); "SMT solvers are, in general, not complete" (App. D.2).

## Open problems and building blocks

  - SMT-LIB (a standard solver input format) output for other solvers (§2.3); a newer CVC or Z3 and the failed TPC-H constructs, "an area of ongoing work" (§13.3).
  - Constrained aggregation "in general for these cases" (comparison with a column, DISTINCT) (§6.1); ensuring in general that an aggregate mutation flips whether the aggregation constraint holds (§6.4); tuple assignments other than 1 or n (§6.3.2); the CA2 MAX-to-MIN miss (§13.1).
  - Uncovered mutations: arithmetic expressions, some LIKE patterns, AND against OR, some three-valued-logic cases, replaced identifiers (§12); projections (App. D.3).
  - Subqueries within subqueries, and partial marks reflecting "how close the student query is to some correct query" (§14).
- **Released:** the grading tool is available online and "can be used by course instructors for grading queries" (§14).
- **To reuse it:** CVC3 (§2.3); the authors' string solver, built on a modified dk.brics.automaton package (App. B.1). Dataset generation took 11–90 seconds per question on a Core i5 with 8 GB (§13.4).

## On this site

- **Discussed in:** [Sourcing realistic, hard query pairs](#/challenges/query_pair_sourcing)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/cex-smt">cex-smt</a></span>
