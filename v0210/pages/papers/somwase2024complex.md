# Test Data Generation for Complex SQL Queries

**Test Data Generation for Complex SQL Queries** · PACMMOD 3(6) 2025 (SIGMOD 2026)

Read: [PDF](https://arxiv.org/pdf/2409.18821) · [arXiv](https://arxiv.org/abs/2409.18821) · [DOI](https://doi.org/10.1145/3769832)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- XData's successor for multi-block, multi-level nested queries (§6; benchmark, §9).
- Constraint generation solved with Z3.

## In plain words

SQL queries are often tested on small example databases; this paper builds them automatically. Likely mistakes are modelled as small edits to the query, such as a less-than changed to less-than-or-equal; each edited copy is a mutant, and a database kills it when the two queries return different results there (§1). The authors cite testing application, student and text-to-SQL queries (abstract, §1). Its predecessor XData handled only single-level subquery nesting (§1). The new system turns each part of a query, at any nesting depth, into conditions for a constraint solver (a program that finds values meeting logical conditions); each solution is a test database. On 84 queries the authors wrote, it kills 378 of 407 mutants, against 320 for a hand-made textbook database, 244 for old XData and 230 for VeriEQL, a tool that checks whether two queries always agree, given each query-mutant pair (§9). They present "a novel data generation approach" that "can outperform the state-of-the-art VeriEQL system" (abstract).

## Background and terms

**Terms to know:** [bag semantics](#/glossary/bag-semantics) · [correlated subquery](#/glossary/correlated-subquery) · [SMT solver](#/glossary/sat-and-smt-solvers) · [integrity constraint](#/glossary/integrity-constraint) · [NULL and three-valued logic](#/glossary/null-and-three-valued-logic) · [counterexample database](#/glossary/counterexample-database) · [query equivalence](#/glossary/query-equivalence) · [bounded verification](#/glossary/bounded-verification) · [mutation testing](#/glossary/mutation-testing) (here of queries, §1) · [semijoin and anti-semijoin](#/glossary/semijoin-and-anti-semijoin)

**The paper's own terms:**
- **mutation (mutant), kill**: a mutation is a syntactic variant of the query, modelling an error, and may be equivalent to it; a dataset kills it if the two give different results on it, and a mutation counts as killed if at least one generated dataset does so (§1, §9.1).
- **mutation structure**: a location in the query tree plus a mutation there; each gets a targeted dataset (§3.5, §5.2).
- **CNT, valid tuple**: each tuple of solver variables carries a count CNT ≥ 0, its number of copies; CNT = 0 marks it invalid (absent), and constraints ignore it (§3.1).
- **result table** (join: **JRT**, aggregation: **ART**): solver variables standing for the output of one operation or subquery. **Forward constraints** put every valid input combination meeting the conditions into it; **backward constraints** make every valid result tuple come from such inputs (§3.4, §4).
- **unfolding**: writing a for-all condition over a fixed-size array as one AND of per-tuple conditions, and there-exists as an OR (§9.2).
- **XDataN, XDataO, USSm, VEQL, XDataBM**: the new system; the original XData; the small University sample database from the textbook *Database System Concepts*; VeriEQL; the authors' benchmark on that textbook's University schema (§9, §9.1).

**Builds on:**
- XData ([XData](#/papers/chandra2014xdata "Data generation for testing and grading SQL queries (2015)")), whose mutation space, multi-dataset approach and string solver it extends (§2, §3, §5.2, §5.4).
- Neumann and Kemper's decorrelation ([Unnesting Arbitrary Queries](#/papers/neumann2015unnesting "Unnesting Arbitrary Queries (2015)")), the basis of its rewriting of correlated subqueries into joins (§6).
- Qex, an earlier generator of non-empty query results using the SMT solver Z3, whose NULL check in comparisons it follows (§3.2, §8); not listed here.
- VeriEQL ([VeriEQL](#/papers/he2024verieql "VeriEQL: Bounded Equivalence Verification for Complex SQL Queries with Integrity Constraints (2024)")), a "query equivalence verification" tool for query pairs, the main comparison (§8, §9.1). The authors say VeriEQL does not handle correlated nested queries or data types "such as strings, dates" (§8).

## Problem and setting

- **Question:** given one SQL query and its schema (no correct query to compare with, unlike equivalence tools, §8), generate few datasets that kill as many non-equivalent mutants as possible, including for multi-level and correlated subqueries (§1, §6).
- **SQL fragment:** inner and outer joins, selections, GROUP BY, aggregates, HAVING, DISTINCT, set operations, and FROM and WHERE subqueries with EXISTS, NOT EXISTS, IN, NOT IN, ANY/ALL and scalar comparison (§4–§6).
- **Semantics:** bags, via the CNT counts (§3.1). One NULL value per type; a comparison is true only when neither side is NULL, and there is no "unknown" truth value (§3.2).
- **Bounds:** table sizes set by rules and heuristics, result tables capped (default 16 tuples), 120 s solver timeout per dataset (§5.3, §9).
- **Constraints:** primary and foreign keys, NOT NULL, domain and CHECK (§3.3).
- **Evaluation:** XDataBM, 84 queries and 407 non-equivalent mutants written by the authors (§9, §9.1); the 22 queries of TPC-H (a decision-support benchmark) with 213 mutants (§9.1). VeriEQL gets query pairs, with natural joins rewritten as inner joins (§9.1, footnote 4).

## Approach

- **Tuple counts (§3.1).** Each table is an array of solver-variable tuples with CNT; since CNT may be 0, the solver chooses each table's size up to the array length instead of retrying sizes.
- **Keys (§3.3).** A primary key forces CNT ≤ 1 and at most one valid tuple per key value; a foreign key requires a valid referenced tuple when its values are not NULL.
- **Result tables (§4).** Built bottom-up: inner and outer joins multiply input counts (Listings 1–2), while semijoin and anti-semijoin keep the left tuple's count (§4.1, Listing 3); aggregates are computed per group, skipping NULLs (Listings 4–6); projection is grouping; set operations combine the two input counts (§4.4). Upper levels use a result table as an input, making the approach "very modular" (§3.4).
- **Datasets (§5.1–5.2, Listings 7–8).** First one with a non-empty query result; then, per mutation structure, the same constraints except at the target node, which must behave differently from its mutant, often empty against non-empty. XData's techniques cover comparison, join-type, string, group-by and aggregate mutations, a few datasets covering exponentially many join-tree mutants (§2, §5.2). New: DISTINCT (a result tuple with CNT > 1), HAVING, non-equality joins, subquery connectives, scalar-subquery conditions (§5.2).
- **Sizes (§5.3, Listing 9).** One tuple per occurrence of a relation, more for foreign keys and aggregate conditions; join sizes cut by key rules and heuristics, then capped.
- **Strings (§5.4).** XData's string solver picks candidate values, an enumerated type mapped to integers in sort order.
- **Subqueries (§6).** Uncorrelated FROM subqueries get their own result table. Correlated WHERE subqueries are rewritten first: EXISTS becomes a semijoin and NOT EXISTS an anti-semijoin, correlation columns join the subquery's output (and its GROUP BY when it aggregates), and values from two levels up pass down through a join with the outer table. IN and NOT IN become semijoin and anti-semijoin, with NULL checks for NOT IN.
- **Equivalence check (§7).** The solver seeks a database where two queries' symmetric difference (rows in one result only) is non-empty; none found means the queries are equivalent or there are too few tuples (§7).

## Results

- **Mutant killing (Tab. 2, §9.1).** XDataN kills 378 of 407 XDataBM mutants, "around 93%", against 320 (USSm), 244 (XDataO) and 230 (VeriEQL). VeriEQL kills more set-operator and DISTINCT mutants, and as many group-by and NULL-condition mutants (Tab. 2). USSm beats XDataO here, unlike on the original XData paper's queries (§9.1).
- **Subqueries (Tab. 3).** XDataN kills 192 of 204 subquery mutants against VeriEQL's 86. On WHERE-clause subqueries XDataN kills 79 of 80 with correlation and 31 of 33 without, and VeriEQL none, which the authors attribute to VeriEQL being "unable to handle WHERE clause subqueries with EXISTS connective" (§9.1). On scalar, IN and NOT IN subqueries VeriEQL kills more (Tab. 3).
- **TPC-H (§9.1).** XDataN handles 15 of the 22 queries and kills 175 of 213 mutants.
- **Output size (Tab. 1).** On average 10 datasets per query, 21 tuples per dataset (input and result tables).
- **Time (§9.2).** 19.64 s per query for all its datasets and 2.04 s per dataset, against 3.51 s for VeriEQL per pair, a direct comparison the authors call not "meaningful". From 4 to 7 tables, time per dataset grows from 0.34 to 0.60 s for joins and 0.48 to 1.70 s for cross products (Tab. 4). Without unfolding, many runs timed out.

## Limits the authors state

- No "unknown" truth value, "which is required for a full implementation of three-value logic" (§3.2, footnote 1).
- LATERAL subqueries in FROM are "not yet implemented" (§6.1).
- ORDER BY mutations "cannot be caught using datasets" (§5.2).
- The scalar-subquery rewrite assumes at most one row; the rewritten query cannot raise the original's runtime error (§6.2).
- LIKE patterns are assumed constant; Z3's string solvers were too slow (§5.4).
- Unkilled mutants come from mutations the implementation doesn't support and from solver timeouts (§9.1).
- XDataBM's queries use constants present in USSm; with other constants "USSm would perform much worse" (§9.1).
- VeriEQL "can only be used to compare pairs of queries" (§9.1); the §7 check is bounded (§7).
- The implementation still prefixes constants with relation names, unlike the description (App. B.1).

## Open problems and building blocks

  - Future work: testing the output of text-to-SQL systems, optimizing constraints for larger queries and datasets, more SQL features such as window functions, more mutation classes, and query-equivalence checking (§10).
  - Supporting the remaining TPC-H queries and unsupported mutation types (§9.1).
  - Comparing the §7 bounded check with "state-of-the-art query equivalence tools" (§7).
- **Released:** Nothing stated; App. A names functions of "the actual code base".
- **To reuse it:** Z3 via its API (§5.1, App. A); the SQL parser jsqlparser-5.0 (App. A.1); the schema, constraints and sample values (§3.2); the XData code it extends (§9). Runs used an AMD Ryzen 7 5700G with 16 GB (§9).

## On this site

- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/cex-smt">cex-smt</a></span>
