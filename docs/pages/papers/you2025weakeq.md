# Query Weak Equivalence and its Verification in Analytical Databases

**Query Weak Equivalence and…** · ICDE 2025

Read: [DOI](https://doi.org/10.1109/icde65448.2025.00144)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- "Weak equivalence": non-equivalent queries that agree on the *current* database; a Query Lattice caches OLAP results.
- EQUITAS-style SMT implication between filter predicates plus monotone aggregates.
- The formal name for agreement on one given database; its printed Definition 2 ("there exists a database instance", PDF p. 5) is not an equivalence relation; the paper elsewhere uses the given instance (borderline, kept: equivalence on the current database only, for result caching).

## In plain words

In data warehouses, non-equivalent queries that differ only in their filters often return the same rows on the stored data (§VII, PDF p. 12), e.g. when no stored row lies where filters disagree. The authors argue existing equivalence provers "only optimize the repetitive execution of equivalent queries" (§I, PDF p. 2), so these run again, wasting computation and disk reads (§I, PDF p. 1). They call these queries weakly equivalent and build the Query Lattice into the PostgreSQL database. It stores past queries' filters as logic formulas, groups queries with matching results into classes, and answers a new query from a class's cached result when a logic prover shows its filter lies between the class's loosest and tightest. Its safety proof needs aggregates that move one way as rows are added, like a sum of non-negative numbers. They report a best gain of 44.95% in response time over plain PostgreSQL, with 500 queries on the most skewed of five generated datasets (abstract, PDF p. 1; §VI-D, PDF p. 12). They present it as "a novel structure" (abstract, PDF p. 1).

## Background and terms

**Terms to know:** [query equivalence](#/glossary/query-equivalence) · [query containment](#/glossary/query-containment) · [first-order logic](#/glossary/first-order-logic) · [SAT and SMT solvers](#/glossary/sat-and-smt-solvers) · [satisfiable and valid](#/glossary/satisfiable-and-valid) · [OLAP and OLTP](#/glossary/olap-and-oltp) · [NULL and three-valued logic](#/glossary/null-and-three-valued-logic) · [lattice](#/glossary/lattice) (here ordered by one filter implying another; a parent is a cell directly above another, with no cell in between; §II-B, PDF p. 4) · [Zipfian skew factor](#/glossary/zipf-distribution) (the parameter of the TPC-H Skew data generator; "The bigger the factor is, the higher the degree of skewness of the data", §VI-A, PDF p. 10)

**The paper's own terms:**
- **similar queries**: queries that "select the same columns and have the same aggregate functions with the same inputs" and differ only in their filter predicates (§I, PDF p. 1).
- **SPJ / SPJA queries**: select-project-join queries, and the same with aggregation (§II-A, PDF p. 3).
- **qualified tuples**: the table rows that satisfy a query's filter conditions (§II-A, PDF p. 3).
- **symbolic representation (SR), COND**: after EQUITAS, a set of first-order formulas for a query; here only the filter predicate's formula, without the returned columns or the join condition, "because it is assumed that two tables are always joined with the same key" (§II-A, PDF p. 3).
- **input-containment** (Def. 1, PDF p. 5): query 1 is input-contained by query 2 when query 1's filter predicate implies query 2's. Classic containment of result rows is called **output-containment** (Fig. 1, PDF p. 5).
- **weak equivalence** (Def. 2, PDF p. 5): two queries are weakly equivalent "if and only if there exists a database instance D" on which their results are equal.
- **monotone aggregate function**: an aggregate whose value moves only one way as qualified tuples are added; the proof of Lemma 2 assumes it "is monotonically increasing" (PDF p. 6), and Example 2 calls SUM monotone when its inputs are all non-negative (PDF p. 4).
- **cell**: a node of the lattice holding one query's filter formula (§IV-A, PDF p. 7).
- **equivalence class**: cells that are ordered by input-containment and have identical output tuples, stored only through their **upper cells** (no ancestor in the class) and **lower cells** (no descendant); every cell between an upper and a lower cell belongs to the class (§III-A, PDF p. 5; §IV-B, PDF p. 7).
- **cluster** and **center class**: similar classes with the same selected columns, found through a hash table; a new query is first compared with the cluster's first class (§IV-C, PDF p. 8).

**Builds on:**
- EQUITAS [21] ([EQUITAS](#/papers/zhou2019equitas "Automated verification of query equivalence using satisfiability modulo theories (2019)")), a prover that turns queries into first-order formulas and checks containment both ways with an SMT solver; the Query Lattice reuses its representation of filter predicates and its implication check (§I, PDF p. 2; §II-A, PDF p. 3; §III-B, PDF p. 6).
- The algebraic approaches [15]–[17] ([HoTTSQL](#/papers/chu2016hottsql "HoTTSQL: proving query rewrites with univalent SQL semantics (2017)"), [Cosette](#/papers/chu2017cosette "Cosette: An Automated Prover for SQL (2017)"), [UDP](#/papers/chu2018udp "Axiomatic foundations and algorithms for deciding semantic equivalences of SQL queries (2018)")), among them COSETTE and UDP, which normalize queries with rewrite rules, and the further equivalence solvers [22], [23] ([SPES](#/papers/zhou2020spes "SPES: A Symbolic Approach to Proving Query Equivalence Under Bag Semantics (2022)"), [WeTune](#/papers/wang2022wetune "WeTune: Automatic Discovery and Verification of Query Rewrite Rules (2022)")); contrasted in §I (PDF pp. 1–2).
- The quotient cube [30] (Lakshmanan, Pei and Han), a lattice that summarizes a data cube (aggregates over base tables at several grouping levels), whose cells differ only in "the granularity of grouping"; the authors call their order and information "completely different" (§II-B, PDF p. 4).

## Problem and setting

- **Question:** can a database detect that a new query, not equivalent to earlier ones, returns the same result on the current data as cached earlier queries, and answer it from the cache (§I, PDF p. 2)?
- **Queries:** similar queries only, SPJ and aggregation queries over joined tables; the join predicates "cannot change" (§II-A, PDF p. 3). The authors say the approach can model predicates "including arithmetic operations and three-valued logic" (§I, PDF p. 2).
- **Aggregates:** Lemma 2 needs monotone ones; AVG is handled only under extra conditions (§III-C, PDF pp. 6–7).
- **Setting:** read-mostly warehouses (abstract, PDF p. 1; §VII, PDF p. 12).
- **Set or bag semantics:** not discussed.

## Approach

- **Input-containment check (§III-B, PDF p. 6).** To show that filter 2 implies filter 1, the lattice asks an SMT solver whether filter 2 and not filter 1 can both hold; if not (unsatisfiable), every row qualifying for query 2 qualifies for query 1.
  - Lemma 1: equivalent queries are also weakly equivalent.
  - Prop. 1: if one query's filter implies another's, its qualified tuples are a subset of the other's.
  - Lemma 2: for one equivalence class and one database instance, a query similar to the class's queries (as the proof assumes), with no non-monotone aggregate functions, whose filter implies an upper cell's filter and is implied by a lower cell's filter returns on that instance the same result as the lower and upper cells. The authors say it applies to SPJ queries too, as monotone maps from qualified tuples to output tuples (PDF p. 6).
  - AVG: handled for queries that compute SUM and COUNT together; it becomes monotone in a class "as long as cells in the class compute AVG and COUNT and the inputs of SUM are non-negative or non-positive" (§III-C, PDF pp. 6–7).
- **Structure (§IV, PDF pp. 7–8).** Cells, then equivalence classes (Def. 3: the lattice of classes, PDF p. 5), then clusters. A top cell with no filter and an empty bottom cell keep it a lattice (Fig. 2, PDF p. 7). Prop. 2 (PDF pp. 7–8): for two similar classes, if a cell of the first is input-contained by a cell of the second, the first class is below the second, and no cell of the second is input-contained by a cell of the first.
- **Compare, Alg. 1 (§V-A, PDF pp. 8–9).** The query's formula is checked against a class's upper cells, then its lower cells; when it lies between them the class returns its cached result, otherwise the search moves to a parent or child class, or the lattice is updated. Worst case O(mn) for m classes of n cells.
- **Query_Update, Alg. 2 (§V-B, PDF p. 9).** When no class answers, the query's result is compared with the class's: a different result creates a new parent or child class; an equal result replaces a boundary cell or adds the query to the class.
- **Data updates, Alg. 3–4 (§V-C–D, PDF pp. 9–10).** An inserted row is added to a class's result if all its cells contain the row, splits the class if some do, and creates a new class if none do; a deletion removes a class whose qualified set becomes empty and merges two classes when the deleted rows are exactly the difference of their qualified sets. Examples in §V-E (PDF p. 10).

## Results

- **Setup (§VI-A–B, PDF p. 10).** Five 1 GB datasets: TPC-H (a standard synthetic decision-support benchmark) and TPC-H Skew (the same schema with Zipfian skew factors 1–4); a MacBook Pro laptop (16 GB). Baseline: PostgreSQL without it. Batches of 50 to 500 queries built from TPC-H queries #1, #3, #5, #6 and #10, with randomly generated selection predicates.
- **Against the baseline (Fig. 4, §VI-B, PDF pp. 10–11).** They report that on each dataset the gains "grow as the number of input queries grows and becomes maximum with 500 queries".
- **Hits and classes (§VI-C, PDF pp. 11–12).** Queries answered by classes rise with the number of queries (Fig. 5); the number of classes stops growing at 300 or 400 queries and falls as skew rises (Fig. 6).
- **Skew (§VI-D, PDF p. 12).** With 500 queries the gains in response time are 12.92%, 16.9%, 30.65%, 43.08% and 44.95% for TPC-H and Skew factors 1–4 (Fig. 8). Beyond a certain skew "there is no longer a significant reduction in execution time" (Figs. 7–8).

## Limits the authors state

- "The Query Lattice can process part of query templates of TPC-H benchmark"; a few SQL features "like the sublinks, CASE" (subqueries and SQL's if-then-else expression) in other templates are left to future work (§VII, PDF p. 12).
- The join predicates of the queries it can process "cannot change" (§II-A, PDF p. 3).
- "Normally, we cannot infer whether two queries having non-monotone functions like AVG have the same results if the inputs of the two functions are the same" (§III-C, PDF p. 6).
- As more queries are processed, the number of classes grows "and the corresponding overhead of searching the class that can answer queries grows" (§VI-C, PDF p. 11).
- Result sharing "is best exploited in read-mostly environments" (§VII, PDF p. 12).

## Open problems and building blocks

- **Open:** coupling with the execution of other databases, "such as MySQL, Oceanbase and openGauss" (§VII, PDF p. 12).
- **Released:** Nothing stated.
- **To reuse it:** an SMT solver, similar queries with fixed join predicates, and monotone aggregates or AVG under the §III-C conditions (PDF pp. 6–7).

## On this site

- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/smt-misc">smt-misc</a></span>
