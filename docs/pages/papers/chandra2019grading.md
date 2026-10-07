# Edit Based Grading of SQL Queries

**Edit Based Grading of SQL Queries** · arXiv 2019, published at CODS-COMAD 2021; a short version is ICDE 2019 ("Automated Grading of SQL Queries")

Read: [PDF](https://arxiv.org/pdf/1912.09019) · [arXiv](https://arxiv.org/abs/1912.09019)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Grades student SQL: XData's generated test databases decide correctness, and partial marks come from an edit distance to the nearest correct query.
- Canonicalizes queries, then searches for the cheapest sequence of edits (shortest path, or a greedy heuristic) that makes the student query canonically equivalent to a correct one (§4.4–4.6).
- The XData family applied to grading; partial equivalence as a distance.

## In plain words

Grading SQL homework means deciding whether a student's query is right and, if not, how much credit it deserves. The authors call hand grading "a tedious and error-prone process", and hand-awarded partial marks unscalable for large classes, "especially MOOCs" (massive open online courses) (abstract). Their system first runs the query on test databases that the XData tool builds from the instructor's correct query. For a wrong query, it searches for the cheapest sequence of small edits that makes it match a correct query once both are rewritten into a standard form, and deducts the edits' cost (abstract, §1). On wrong queries from an IIT Bombay course, the authors report that these marks agreed with two volunteers' ranking of query pairs for 92.5% of 228 pairs, against 65.8% for marks from the distance between standardized queries (§6). A much faster greedy search gave the same marks as the full search wherever the full search finished (§6). They present it as new: "To the best of our knowledge, there is no other system for awarding partial marks to student SQL queries" (§5).

## Background and terms

**Terms to know:** [query equivalence](#/glossary/query-equivalence) · [mutation testing](#/glossary/mutation-testing) · [integrity constraint](#/glossary/integrity-constraint) · [functional dependency](#/glossary/functional-dependency) · [query rewriting and rewrite rules](#/glossary/query-rewriting-and-rewrite-rules) · [NULL and three-valued logic](#/glossary/null-and-three-valued-logic) · [abstract syntax tree](#/glossary/abstract-syntax-tree-ast) · [common table expression](#/glossary/common-table-expression-cte) · [tree edit distance](#/glossary/tree-edit-distance)

**The paper's own terms:**
- **correct query**: an instructor-supplied right answer; there may be several, and the student gets the best marks over all of them (§1, §3.1).
- **canonicalization**: rewriting a query into a standard form so that irrelevant differences disappear. *Syntactic* rules change only the form (App. A); *semantic* rules "can only be applied to queries provided some query and/or database constraints are satisfied", such as keys (§3.2, App. B).
- **flattened tree**: the parse tree with commutative, associative operators (INNER JOIN when its inputs have no DISTINCT, GROUP BY or aggregation; UNION, INTERSECT, AND, OR; chains of equalities) merged into one node with unordered children (UNION and INTERSECT under column-name conditions, footnote); LEFT OUTER JOIN, EXCEPT and ORDER BY keep ordered children (§3.3, Figs. 2–3).
- **component**: a part of a query such as a selection, projection, aggregate or subquery; the instructor can change each component's weight (§3.4).
- **canonicalized edit distance**: the weighted sum, over components, of the edit distance between the two canonicalized flattened trees (§3.4).
- **canonically equivalent**: having the same canonical form (§4.4).
- **guided edits**: edits that move the student query towards the correct one (§4.2).
- **weighted edit sequence distance**: the cost of the cheapest edit sequence that makes the student query canonically equivalent to a correct query (§1, §4.4).

**Builds on:**
- XData ([XData](#/papers/chandra2014xdata "Data generation for testing and grading SQL queries (2015)"), and Shah et al., ICDE 2011), which generates test databases that kill common mutants of a query; it decides correctness here (§1, §2.1).
- The SQL equivalence provers Cosette ([Cosette](#/papers/chu2017cosette "Cosette: An Automated Prover for SQL (2017)")) and U-semiring work of Chu et al. ([UDP](#/papers/chu2018udp "Axiomatic foundations and algorithms for deciding semantic equivalences of SQL queries (2018)"), an algebraic model of SQL); the authors say they also handle "ORDER BY, outer joins, nulls, strings and more types of subqueries" (§5).
- Tools for students: the SQL testers Gradience (instructor-provided datasets) and RATest ([RATest](#/papers/miao2019ratest "Explaining Wrong Queries Using Small Examples (2019)"), small distinguishing datasets), and program-feedback systems such as SARFGEN, which also finds minimum edits to the closest reference program (§5).

## Problem and setting

- **Question:** how to mark an incorrect query so that "small errors are penalized less than large errors" (abstract).
- **Correctness:** a query matching the instructor query on all XData datasets is marked correct (§2.1).
- **SQL class (§2.3):** single-block queries with joins, outer joins, WHERE predicates and optional aggregation; nested subqueries in SELECT, FROM or WHERE, "which may have arbitrary levels of nesting"; UNION, INTERSECT and EXCEPT, with or without ALL. Queries must parse; differences in column names are not penalized.
- **Equivalence:** canonicalized edit distance 0 serves "as a sufficient condition for equivalence testing" (§1). Keys, foreign keys and non-nullable attributes license semantic rules (App. B).
- **Naive marking (§2.2):** marking by the share of datasets passed "may not be fair": a single flipped comparison can fail almost all datasets, while an always-empty query on the wrong tables gets some marks.
- **Semantics:** [set](#/glossary/set-semantics) or [bag semantics](#/glossary/bag-semantics) is not named; DISTINCT is dropped where keys show there can be no duplicates (App. B.1). NULLs are handled in outer-join rules and NOT IN rewriting (App. A, App. B.2).
- **Data:** the University Schema of the textbook *Database System Concepts* (§1); student submissions from an IIT Bombay course, 2015–2017 (§6).

## Approach

- **Canonicalization (§3.2, App. A–B).** Syntactic rules include inlining non-recursive WITH clauses, turning IN and NOT IN subqueries into EXISTS forms, and flattening. Semantic rules remove DISTINCT and redundant joins, turn outer joins into inner joins under a null-rejecting condition (one that fails on NULL) or a non-nullable foreign key, replace attributes equated by a chain of equalities with the lexicographically smallest above those predicates, and use functional dependencies to simplify ORDER BY and expand GROUP BY (App. B.4). Rules repeat until none applies; the authors say "it is easy to prove each rule correct" and that the rules "are carefully designed to ensure termination and confluence" (§3.2). The authors call these and the edit rules "extensible" (§1).
- **Why not grade by canonicalized edit distance (§3.5).** a) One edit can remove several differences. b) Canonicalization can increase the distance when a condition is missing.
- **Edit the student query, not the correct one (§4.1):** editing the correct query could hide what the student left out.
- **Guided edits (§4.2–4.3):** insert, remove or replace projections, grouping, DISTINCT, aggregates and conditions; switch joins between INNER and OUTER, and EXISTS with NOT EXISTS; change ORDER BY. Every edit leaves a valid query.
- **Shortest path (§4.4).** Queries are nodes, edits are cost-weighted edges, and canonically equivalent queries are joined by zero-cost edges. Within "the space of edits considered by our system" and "the given space of canonicalization", the cheapest edit sequence from the student query to a query canonically equivalent to a given correct query can be found by a shortest-path algorithm (Thm. 1).
- **Algorithm 1 (§4.5)** builds the graph lazily. Total marks come from the correct query's number of components; each edit's cost is subtracted, the query with most marks left is expanded next, and queries at 0 marks or less are dropped. The student query gets only syntactic rules before editing.
- **Greedy heuristic (§4.6).** Benefit is an edit's drop in canonicalized edit distance; only the edited query with the best benefit minus cost is kept, even if its benefit is zero or negative.
- **System (§4.7).** A learning mode can show students edits as feedback. The authors state that canonicalization finds matches "without giving false positives". Clustering canonically equivalent student queries can help the instructor add missing correct queries.

## Results

- **Canonicalization as an equivalence test (§6.1, Tab. 1).** Over 15 questions and 1489 student queries, the authors report that canonicalization matched 92.1% of correct student queries (those XData passed, minus false positives found by hand). Misses they name: extra components with no effect, such as UNION with an empty query.
- **Fairness (§6.2, Tab. 2).** For 13 questions, two volunteers (a TA and a database instructor) sorted random pairs of incorrect queries: first deserves more, second deserves more, or almost the same (marks: within 10%). Edit-sequence marks (greedy) matched the volunteers' bucket for 92.5% of 228 pairs, against 65.8% for canonicalized-edit-distance marks, which "works well for simpler queries" but "performs poorly for more complex queries". Some mismatches: volunteers penalized outer joins and extra relations that canonicalization removes.
- **Use in class (§6.2 "Real World Usage").** Over 1800 queries were graded at IIT Bombay in Autumn 2018; students contested 4 submissions, 2 genuine, both from implementation bugs; "in earlier years, anecdotally", many contested hand-awarded marks. Also used at IIT Dharwad in 2018 (§1, §7).
- **Greedy against exhaustive (§6.3, Tab. 3).** Marks were "identical for all student queries that could be evaluated by both techniques" (Match 100%); the exhaustive search ran out of memory on some queries despite a 14 GB Java limit, and these were excluded (asterisked: CQ10, CQ12–CQ15). Average time per student query against one correct query: 165–378 ms greedy, 171 ms to about 32 s exhaustive.

## Limits the authors state

- XData is "a best effort test": an extra condition in a student query may go uncaught, and generating datasets from student queries is "an expensive process" (§2.1, §4.7). Its data generation can "currently handle only one level of nesting in WHERE clause subqueries" (§2.3, footnote).
- Canonicalization can give false negatives, so "partial marks may be lower" for "some small fraction of queries" (§6.1).
- Inlining a WITH clause used twice can double an edit, so marks should follow the original query's edits; in their space of edits, other syntactic rules "do not increase the edit distance" (§4.5).
- The shortest-path search "can be very expensive for queries with a large number of components" (§4.6).
- GROUP BY may have no unique canonical form when a result has more than one superkey (columns that determine all others) (App. B.4).
- Earlier hand marks are "only approximate and not necessarily consistent", so no direct comparison (§6.2).
- In 2018, a few queries using "RANK, PARTITION, string functions and expressions" weren't handled (§6.2 "Real World Usage").

## Open problems and building blocks

  - "adding more canonicalization rules like unnesting of subqueries and support for more SQL features such as windowing, ranking and OLAP features" (§7; OLAP: online analytical processing).
  - Removing extra components that don't affect results "is part of future work" (§6.1).
  - New rules without termination or confluence could use a DAG of alternatives, as in the Volcano optimizer; "we currently do not use this option" (§3.2).
  - Turning off outer-join conversion and redundant-relation removal "would be an option to model human intuition" (§6.2).
- **Released:** "The source code and binaries available for download" (§7).
- **To reuse it:** XData, correct queries, schema keys, component weights and the §2.3 SQL class; experiments ran in Java on a 16 GB machine (§6.3).

## On this site

- **Discussed in:** [Canonical forms for queries](#/challenges/query_canonical_forms) · [Weak checkers get exploited](#/challenges/weak_checker_exploitation)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/cex-misc">cex-misc</a></span>
