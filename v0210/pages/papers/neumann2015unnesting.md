# Unnesting Arbitrary Queries

**Unnesting Arbitrary Queries** · BTW 2015

Read: [Paper](https://dl.gi.de/handle/20.500.12116/2418)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Claims to unnest arbitrary correlated subqueries ("the dependent join can be eliminated from any query", §3.2) by pushing dependent joins down until they become regular joins.
- Push-down rules per operator, plus substitution to drop the outer-binding domain.
- A source of equivalent pairs and of rules to prove; its group-by push-down rule loses empty groups (the COUNT bug) and its ALL/anti-join example (§3.5) is wrong under NULLs.

## In plain words

A [correlated subquery](#/glossary/correlated-subquery) refers to the outer query's current row, so run literally it is re-evaluated for every outer row, which the authors say leads to "(at least) quadratic execution time" (§1, PDF p. 2). Systems rewrite these into ordinary joins, but the authors say existing techniques "are usually limited to certain classes of queries" (abstract, PDF p. 1). Their rewrite rules collect the distinct outer values the subquery needs, evaluate it once per value, and push that evaluation down the [query plan](#/glossary/query-plan-and-explain) (a tree of steps) until it becomes an ordinary join; they claim "the dependent join can be eliminated from any query" (§3.2, PDF p. 9), a dependent join being that per-row evaluation. In their system HyPer, on a small data set, their harder example query runs in 42 ms against 408 ms without unnesting, and they know of no other system that unnests it (§5, PDF p. 16). They claim novelty: "To the best of our knowledge no existing system can de-correlate queries in the general case" (abstract, PDF p. 1), that is, remove the correlation.

## Background and terms

**Terms to know:** [relational algebra](#/glossary/relational-algebra) · [bag semantics](#/glossary/bag-semantics) · [set semantics](#/glossary/set-semantics) · [semijoin and anti-semijoin](#/glossary/semijoin-and-anti-semijoin) · [NULL and three-valued logic](#/glossary/null-and-three-valued-logic) · [cost-based optimization](#/glossary/cost-based-optimization) · [query rewriting and rewrite rules](#/glossary/query-rewriting-and-rewrite-rules) · [nested-loop and hash join](#/glossary/join-algorithms-nested-loop-hash-and-merge-join) · [NULL-rejecting](#/glossary/null-rejecting) (the paper relies on "the top-most join on D" being NULL-rejecting, §4, PDF p. 14) · [magic sets](#/glossary/magic-sets)

**The paper's own terms:**
- **dependent join**: a join whose right input is evaluated again for each row of the left input, using that row's values (§2, PDF pp. 3–4); semi-, anti- and outer joins get dependent variants too (§2, PDF p. 4).
- **domain D**: the distinct values of the outer columns the subquery refers to, computed by a duplicate-eliminating projection; every relation named D is assumed duplicate-free (§3.2, PDF pp. 6–7).
- **group-by and map**: group-by groups by a list of columns and computes aggregates; "If A is empty, just one aggregation tuple is produced", A being the grouping columns, as in SQL without GROUP BY (§2, PDF p. 4). Map adds a column computed from each row.
- **"is" semantics**: comparing two rows on a set of columns treats two NULLs as equal, "unless indicated otherwise" (§2, PDF p. 4).
- **simple and general unnesting**: simple unnesting moves correlated predicates up the plan; general unnesting, the D-based framework, is used when that is not sufficient (§3, PDF p. 5).
- **sideways information passing**: handing D from the outer query to the subquery (§3.2, PDF p. 6).
- **substitution (decoupling)**: replacing the join with D by computing D's columns from columns already in the subquery that equal them, found as equivalence classes of join and filter conditions (§3.3, PDF p. 13; §4, PDF pp. 14–15).

**Builds on** (none on this site):
- Kim's unnesting "recipes" for particular patterns [Kim82] and Kiessling's work on "the correctness problems of some of the suggested transformations when empty sets are encountered" [Kie85] (§6, PDF p. 16).
- Galindo-Legaria and Joshi's apply operator in Microsoft SQL Server [GJ01], which runs a subquery per outer row and is "similar to our bind join" (the dependent join), but "fell short of being able to transform all possible nesting patterns"; the authors are "confident that our paper closes this cited" research gap (§6, PDF p. 17).

## Problem and setting

- **Question:** can every correlated subquery be rewritten without dependent joins, at no more cost than row-by-row evaluation (§1, PDF pp. 2–3)?
- **Fragment:** subqueries "at nearly all places within a query", as SQL-99 (the 1999 SQL standard) allows (abstract, PDF p. 1); the approach "covers all kinds of nested subqueries" (§7, PDF p. 18). A query is first translated into an algebra expression with a dependent join (§3, PDF p. 5).
- **Semantics:** the technique does "preserve the SQL multi-set semantics"; only D is duplicate-free (§3.2, PDF p. 7).
- **Correctness:** the rules are stated as equivalences between algebra expressions (§3.2, PDF pp. 6–9); substitution gives, in general, a superset at the point applied, which "does not affect the final result" (§3.3, PDF p. 13).

## Approach

- **Simple unnesting (§3.1, PDF p. 5).** Correlated predicates move up the plan, potentially past joins, selections and group-by, until all their columns are available; the dependent join can then become a regular one.
- **Step 1 (§3.2, PDF p. 6).** The dependent join of the outer input with the subquery becomes a regular join of the outer input with a dependent join of D with the subquery, so the subquery runs once per distinct value of D; "If there are a lot of duplicates, this already greatly reduces the number of invocations" of it.
- **Step 2, push-down rules (§3.2, PDF pp. 7–9)**. The dependent join of D is pushed below each operator: selections; inner joins (to the side that needs D, or to both with a match on D's columns); outer joins, which keep unmatched rows padded with NULLs (replicated whenever the inner side depends on D, "as otherwise we cannot keep track of unmatched tuples from the outer side"), and semi- and anti-joins likewise; group-by, whose grouping columns gain D's columns, which "makes use of the fact that D is a set" (PDF p. 8); projection; union, intersection and difference. When the right side no longer refers to D it can become a regular join, a state "we can always reach" (PDF p. 7).
- **Size of D (§3.2, PDF p. 9).** D is never larger than the outer input; if the top-most join after unnesting is a hash join storing the outer input, computing D at most doubles that join's memory.
- **Substitution (§4, PDF pp. 14–15)**. When all of D's columns are equi-joined (matched by equality) with existing columns, a map can compute them instead. Its output contains the dependent join's rows and possibly more (a superset relation that "only holds because D is a set"); it "only pays off if the join with D is unselective" (removes few rows), so the cost-based optimizer compares both options.
- **Examples.** Q1 (each student's best exams) is unnested step by step until no trace of nesting remains (§3.3, Figs. 2–8, PDF pp. 9–13). In Q2 (exams at least one grade worse than the average of the student's own and elder peers' exams), D cannot be removed because it meets the subquery through a non-equality join, but "all dependent joins have disappeared" (§3.4, Fig. 9, PDF pp. 12–13). A correlated ALL comparison (Q3) becomes a dependent anti-join by negating the predicate, then a regular anti-join (§3.5, PDF pp. 13–14).

## Results

- **Design claim.** Unnesting "will definitely not incur higher costs than the straightforward nested loops evaluation – and in the majority of cases improve the performance dramatically, often by several orders of magnitude" (§1, PDF p. 2).
- **Setup (§5, PDF p. 15).** One Intel i7-3930K machine with 64 GB RAM, comparing HyPer (the authors' main-memory database system), Microsoft SQL Server 2014 (commercial; its license forbids publishing runtimes) and PostgreSQL 9.1 (open source), on 1,000 students and 10,000 exams.
- **Q1 (§5, PDF pp. 15–16).** HyPer, unnesting with substitution: under 1 ms, against 51 ms with unnesting off. SQL Server unnests it. PostgreSQL does not, taking 1,300 ms, against 17 ms for the hand-decorrelated form Q1′ (§1, PDF p. 2).
- **Q2 (§5, PDF p. 16)**. HyPer: 42 ms, against 408 ms with unnesting off. SQL Server cannot unnest it and uses nested-loop joins; PostgreSQL's runtime is "again growing sharply with the data size".
- **TPC-H (§5, PDF p. 16)**, a standard decision-support benchmark, at scale factor 1 (its data-size setting), HyPer with unnesting on and off: Query 4 takes 7 ms against 157,616 ms, Query 17 9 ms against 4,664 ms. The authors say "all of the large commercial systems" unnest them.

## Limits the authors state

- "There are a few cases where nested evaluation is actually beneficial, in particular if the outer side is very small and the inner side can be evaluated using an index lookup" (§1, PDF p. 3).
- A query like Q2 "will be more expensive to evaluate than a more simple subquery" (§1, PDF p. 2).
- Computing D and joining with it "causes some extra costs" (§4, PDF p. 14).
- Substitution "creates a superset of the original tuples" in general and "can affect the query runtime" (§3.3, PDF p. 13; §4, PDF p. 15).
- Dropping the filter left by substitution is safe only if the column it tests "is not nullable" (§3.3, PDF p. 13).
- The join push-down rule is "overly pessimistic" (§3.2, PDF p. 8).
- The evaluation is "cursory" (§1, PDF p. 3) and its data set "small" (§5, PDF p. 15).

## Open problems and building blocks

- **Open:** None stated.
- **Released:** no code or data release is stated; the technique "has been fully implemented" in HyPer, with a web interface showing the resulting plans (§1, PDF p. 3) and runtimes (§7, PDF p. 18).
- **To reuse it:** an algebra with dependent variants of each join and a duplicate-eliminating projection (§2, PDF pp. 3–4; §3.2, PDF p. 6); equivalence classes from join and filter conditions (§4, PDF p. 14); a cost-based optimizer to choose between substitution and keeping D (§4, PDF p. 15; §7, PDF p. 18).

## On this site

- **Discussed in:** [Refuting faulty rewrite rules](#/challenges/faulty_rewrite_rules)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/qo-rules">qo-rules</a><a class="tag sub" href="#/tags/rewrite-classic">rewrite-classic</a><a class="tag sub" href="#/tags/rules-lib">rules-lib</a></span>
