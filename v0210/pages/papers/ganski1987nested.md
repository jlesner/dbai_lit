# Optimization of Nested SQL Queries Revisited

**Optimization of Nested SQL Queries Revisited** · SIGMOD 1987

Read: [PDF](https://dl.acm.org/doi/pdf/10.1145/38713.38723) · [DOI](https://doi.org/10.1145/38713.38723)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Shows that Kim's unnesting algorithm NEST-JA is wrong for COUNT over empty groups (the "COUNT bug", found by Kiessling in a 1984 memo, §5.1) and for join predicates other than equality (§5.3); the outer-join fix for the first then fails when the outer relation has duplicates in the join column (§5.4).
- Fixes them with an outer join in building the temporary relation, a join on the original predicate, and projecting the outer relation first; the result is algorithm NEST-JA2 (§5.2, §6).
- A published rewrite rule shown wrong on edge cases; Cosette uses the COUNT bug as its running example ([Cosette](#/papers/chu2017cosette "Cosette: An Automated Prover for SQL (2017)") §3, Fig. 3) and refutes it in its evaluation (§6). Its own ANY/ALL rewrites (§8.2) have errors too.

## In plain words

A nested SQL query has one query inside another's WHERE clause; run literally, the inner query reruns for each outer row, which the authors say can be inefficient (abstract, PDF p. 1). Won Kim proposed rewriting them into equivalent flat queries with joins that can run faster. The paper retells Kiessling's COUNT bug in Kim's rewrite for inner queries that use outer columns and compute a total: rows whose count should be zero vanish. It reports "another bug in the same algorithm" (abstract, PDF p. 1), for join conditions other than equality (§5.3, PDF pp. 5–6), and a problem with repeated values in the outer table (§5.4, PDF pp. 6–7). They fix these in a new algorithm and a recursive procedure they claim "can be used to transform any nested query" (abstract, PDF p. 1). They show the fixes on example tables and estimate, for one query with assigned sizes and one join strategy, about 475 disk page fetches against 3050 for rerunning the inner query in the worst case. They present it as correcting and extending a published algorithm.

## Background and terms

**Terms to know:** [correlated subquery](#/glossary/correlated-subquery) · [query rewriting and rewrite rules](#/glossary/query-rewriting-and-rewrite-rules) · [query optimizer](#/glossary/query-optimizer) · [NULL and three-valued logic](#/glossary/null-and-three-valued-logic) · [bag semantics](#/glossary/bag-semantics) · [outer join](#/glossary/outer-join) · [merge join](#/glossary/join-algorithms-nested-loop-hash-and-merge-join)

**The paper's own terms:**
- **query block; outer and inner block**: a SELECT–FROM–WHERE unit; the block nested in another's WHERE clause is the inner one (§1, PDF p. 1). Relations are tables and tuples their rows.
- **nested predicate**: a WHERE condition comparing a column with a query block by a scalar comparison or set membership (IS IN) (§1, PDF p. 1).
- **type-A, -N, -J, -JA nesting**: Kim's classes, by whether the inner block has a join condition referring to an outer relation (J) and whether it selects an aggregate, a total such as COUNT or MAX (A): type-N has neither, type-A only the aggregate, type-J only the join condition (to an outer relation not named in the inner FROM clause), type-JA both (§2.1–2.4, PDF pp. 1–2).
- **nested iteration**: how System R (IBM's relational database system, into which SQL was built; §1, PDF p. 1) runs type-J and type-JA queries: the inner block is processed once per outer tuple that satisfies all simple predicates on the outer relation (§2.4, PDF p. 2).
- **simple predicate**: a condition on only one relation (§5.2, PDF p. 5). To **restrict** is to keep the rows meeting such conditions, to **project** to keep only some columns (§5.2, PDF p. 5).
- **canonical query**: the single-level query with explicit joins that Kim's algorithms produce, "logically equivalent to the original nested query" (§3.1, PDF p. 3).
- **NEST-N-J, NEST-JA, NEST-G**: Kim's algorithms. NEST-N-J merges the FROM and WHERE clauses of all blocks, replacing IS IN by = (§3.1, PDF p. 3); NEST-JA turns a type-JA query into a type-J one over a temporary table built with GROUP BY (§3.2, PDF p. 3); NEST-G handles general nesting through a graph drawn from the query (§9, PDF p. 9).
- **page I/O's, page fetches**: the cost measure (§7, PDF p. 8).

**Builds on** (none on this site):
- Kim (1982): the classification, algorithms and cost analysis revisited here (§1–4, PDF pp. 1–3).
- Kiessling's 1984 Berkeley memorandum: the COUNT bug, example tables and queries (§5.1, PDF pp. 3–4).
- Codd (1979), for the outer join (§5.2, PDF p. 4); the System R papers, for SQL, nested iteration and the optimizer (§1–3, PDF pp. 1–2).

## Problem and setting

- **Question:** when do Kim's rewrites of type-JA queries disagree with nested iteration, and how can they be fixed while keeping Kim's temporary table of aggregate values (§5, PDF pp. 3–7)?
- **Correct** means returning the nested-iteration result on the same tables (§5.1–5.4.1, PDF pp. 3–7).
- **SQL fragment:** SQL as in System R, with nested predicates using scalar comparisons or set membership (§1, PDF p. 1); the examples use COUNT, COUNT(*) and MAX (§5.1–5.3, PDF pp. 3–6); §8 (PDF p. 9) adds EXISTS, NOT EXISTS, ANY and ALL.
- **Empty sets:** the non-equality example assumes the maximum over no rows is NULL (§5.3, PDF p. 6).

## Approach

- **Kim's NEST-JA (§3.2, PDF p. 3).** Group the inner relation by its join column into a temporary table holding the aggregate, and join that to the outer relation; Kim's Lemma 2 states the two queries are equivalent.
- **The COUNT bug (§5.1, PDF pp. 3–4).** The temporary table has groups only for inner values that match the inner conditions, so its counts are never zero, and outer rows whose count should be zero are lost. Kiessling concluded "there seems to be no general way to recover values lost by COUNTs on a correlation level greater than 1"; the authors say this seems true for SQL as specified in the 1976 System R paper, but that an outer join, if available, solves it.
- **Fix 1 (§5.2, PDF pp. 4–5).** Build the temporary table with an outer join from the outer relation to the inner one, so unmatched outer values get a count of zero. With COUNT(*), count the inner join column instead: otherwise TEMP3 gives an unmatched part a count of 1, which the paper calls "semantically incorrect" (§5.2.1, PDF p. 5).
- **Bug 2 (§5.3, PDF pp. 5–6).** For aggregates other than COUNT, NEST-JA works with equality; with an operator such as <, the temporary table aggregates per single join value, while the query asks about "a range of join column values". Fix (§5.3.1, PDF p. 6): join outer and inner relations with the original operator when building the table (an outer join only for COUNT), and change the original condition to equality.
- **Problem 3 (§5.4, PDF pp. 6–7).** With duplicates in the outer join column, the fix inflates the counts; the authors say this arises with COUNT, AVG and SUM, not MAX and MIN. Fix (§5.4.1, PDF p. 7): join with a duplicate-free projection of the outer join column (restricting it too can improve efficiency), which they note is part of the procedure INGRES (another relational system of the time) follows for nested queries.
- **NEST-JA2 (§6.1, PDF p. 7)** combines the fixes in three steps: project and restrict the outer join column; build the temporary table by joining the inner relation with it (an outer join when the aggregate is COUNT); join the outer relation with the table.
- **Cost (§7, PDF pp. 7–9).** Nested iteration or merge join for each of NEST-JA2's two joins gives four total costs to estimate; with two merge joins, each intermediate table comes out sorted for the next step (§7.4, PDF p. 8).
- **Extensions (§8, PDF p. 9).** EXISTS becomes a test that a COUNT over the subquery exceeds zero, NOT EXISTS that it equals zero, both called semantically equivalent (§8.1, PDF p. 9). A comparison with ANY becomes one with the subquery's MAX or MIN, a form called "logically (but not necessarily semantically) equivalent"; one with ALL becomes one with MIN or MAX, called logically equivalent; =ANY and !=ANY become IN and NOT IN (§8.2, PDF p. 9).
- **nest_g (§9.1, PDF pp. 9–10).** It processes the query's tree of blocks innermost first, applying each block's rewrite by type. A join condition reaching across an aggregating block (a "trans-aggregate" join predicate) is inherited as blocks merge upward, so deeper type-JA nesting is caught in one block and handled by the single-level NEST-JA2 (Fig. 2 example). Its stated advantage is simplicity: each step looks at two levels only.

## Results

Worked examples and an analytical cost estimate.
- **Bugs.** On the example tables, NEST-JA drops a part with no qualifying shipments (§5.1, PDF pp. 3–4) and, for the < query, returns an extra part (§5.3, PDF p. 6); with duplicate outer join values the outer-join fix alone loses parts (§5.4, PDF pp. 6–7).
- **Fixes.** The outer-join, non-equality and duplicates fixes and NEST-JA2 return the nested-iteration result on these tables (§5.2, §5.3.1, §5.4.1, §6.1, PDF pp. 5–7). The outer-join solution "has been tested successfully on queries with more than a single level of nesting", including a Kiessling query (§5.2, PDF p. 5).
- **Kim's costs, restated.** Fig. 1 (PDF p. 3) gives Kim's costs for three examples; the authors say Kim "has shown that cost savings of 80% to 95% are possible" (§4, PDF p. 3).
- **NEST-JA2's cost.** On Kim's query Q3 (a MAX aggregate), with sizes the authors assign, NEST-JA2 with two merge joins costs "about 475 page fetches", against 3050 for nested iteration "in the worst case" (§7.4, PDF pp. 8–9); the summary says it "yields a cost reduction similar to that achieved by Kim in his example" (§10, PDF p. 11).

## Limits the authors state

- The fix needs an outer join, "either internally or through extensions to the query language" (§5.2, PDF p. 4); for SQL as specified in the 1976 System R paper they say Kiessling's conclusion seems true (§5.1, PDF p. 4).
- The inner relation's simple predicates must be applied before the join, or the result would be incorrect (§5.2, PDF p. 5).
- The outer-join fix works correctly "if the outer relation of the nested query contains no duplicates in the join column" (§5.4, PDF p. 6), hence §5.4.1.
- The ANY rewrite is "logically (but not necessarily semantically) equivalent" (§8.2, PDF p. 9).
- The cost analysis assumes "nested queries are of depth one" (§7, PDF p. 7), relations "scanned sequentially" (§7, PDF p. 8), and merge joins after transformation, as Kim does (§7.2, PDF p. 8).

## Open problems and building blocks

- **Open:** None stated.
- **Released:** Nothing stated.
- **To reuse it:** an outer join in the system or language (§5.2, PDF p. 4) and duplicate removal (§5.4.1, PDF p. 7).

## On this site

- **Discussed in:** [Refuting faulty rewrite rules](#/challenges/faulty_rewrite_rules) · [Canonical forms for queries](#/challenges/query_canonical_forms)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/qo-rules">qo-rules</a><a class="tag sub" href="#/tags/rewrite-classic">rewrite-classic</a><a class="tag sub" href="#/tags/rules-lib">rules-lib</a></span>
