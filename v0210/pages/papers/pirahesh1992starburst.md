# Extensible/Rule Based Query Rewrite Optimization in Starburst

**Starburst query rewrite** · SIGMOD 1992

Read: [PDF](https://dl.acm.org/doi/pdf/10.1145/130283.130294) · [DOI](https://doi.org/10.1145/130283.130294)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- An extensible rule engine that rewrites queries in the Query Graph Model (QGM) before plan optimization.
- Rules are C condition/action pairs in rule classes (sequential or priority order); the named rules merge views (SELMERGE), push or pull DISTINCT, turn EXISTS into joins (EtoF) and INTERSECT into EXISTS.
- Its authors call it "the first system implementation (to our knowledge) to organically incorporate query transformation schemes into a full RDBMS" (§5, PDF p. 9); WeTune cites it for hand-crafted rewrite rules ([WeTune](#/papers/wang2022wetune "WeTune: Automatic Discovery and Verification of Query Rewrite Rules (2022)"), PDF p. 1).

## In plain words

A database takes a declarative query and chooses how to run it. The authors argue that equivalent ways of writing one query "can have widely varying performance, often differing by orders of magnitude", because nested subqueries and views can force the optimizer into a poor plan; it is their "conviction" that Query Rewrite is "an essential step in query optimization" (§1, PDF p. 1). They describe Query Rewrite, a phase of IBM's extensible Starburst database system that runs before the plan is chosen: rules that turn views and existential (EXISTS- or IN-style) subqueries into one flat SELECT whenever possible while keeping duplicate rows right, and an engine that chooses and fires the rules. Measured on IBM's commercial DB2 before and after rewriting, a view-merge example gained 1100× in CPU time and 200× in elapsed time, on a benchmark database scaled up tenfold (§3.1, PDF p. 5). They call it, to their knowledge, "the first system implementation" to "organically incorporate query transformation schemes into a full RDBMS" (relational database management system) (§5, PDF p. 9).

## Background and terms

**Terms to know:** [query rewriting and rewrite rules](#/glossary/query-rewriting-and-rewrite-rules) · [query optimizer](#/glossary/query-optimizer) · [query plan and EXPLAIN](#/glossary/query-plan-and-explain) · [bag semantics](#/glossary/bag-semantics) · [query equivalence](#/glossary/query-equivalence) · [semijoin and anti-semijoin](#/glossary/semijoin-and-anti-semijoin) · [correlated subquery](#/glossary/correlated-subquery) · [production rule and conflict resolution](#/glossary/production-rule-rule-engine)

**The paper's own terms:**
- **plan optimization**: the usual phase that chooses how to read each table, join orders and join methods; **Query Rewrite** precedes it (§1, PDF p. 1).
- **QGM (Query Graph Model)**: Starburst's internal form of a query, a graph of **boxes**, each a table operation (SELECT, GROUP BY, UNION, INTERSECT, EXCEPT) or a base table, with a **head** describing its output and a **body** its operation (§2, PDF pp. 2–3; Fig. 1, PDF p. 3).
- **quantifier**: a tuple variable in a box's body ranging over another box's output: type **F** from the FROM clause, **E** existential (EXISTS, IN, ANY, SOME), **A** universal (ALL) (§2, PDF p. 3).
- **distinct attributes** (§2, PDF p. 3): the head's is TRUE if the output holds only distinct tuples; the body's is ENFORCE (must remove duplicates), PRESERVE (can keep the number of duplicates it generates) or PERMIT (may remove or generate duplicates arbitrarily), and each quantifier carries the same three values.
- **Boolean factor**: an edge standing for one conjunct of the WHERE clause; a **table expression** is an SQL2 (the 1992 ISO SQL standard, [ISO91]) construct "similar to view definitions" (§2, PDF p. 3).
- **one-tuple-condition**: at most one tuple of a quantifier satisfies a given set of predicates; **quantifier-nodup-condition**: a primary or candidate key (columns whose values identify a row) of an F quantifier appears in the output (§3.1 Rule 2, PDF p. 5).

**Builds on:**
- Subquery transformations by Kim [Kim82], Ganski and Wong [GW87] ([Optimization of Nested SQL Queries Revisited](#/papers/ganski1987nested "Optimization of Nested SQL Queries Revisited (1987)")), Dayal [Day87] and Anfindsen [Anf89]: the authors say their work "subsumes many of these transformations" and generalizes it "to handle duplicates correctly" (§5, PDF p. 9).
- Dayal's semijoin rule: EtoF is "the QGM equivalent of a rule proven correct in [Day87]" (§3.2 Rule 7, PDF p. 7).
- The Starburst DBMS [HCL+90] (§1, PDF p. 1), an earlier rule-system design [HP88], and their rules for subqueries with aggregation [MFPR90a, MPR90, MFPR90b] (§1.2–1.3, PDF p. 2).

## Problem and setting

- **Question:** how to rewrite queries into equivalent, faster ones, chiefly by merging views and subqueries into one SELECT (§1, PDF p. 1; §3, PDF p. 4). Plan optimizers "typically can only make decisions based on the environment of a single query block" (§3, PDF p. 4).
- **SQL covered:** UNION, INTERSECT and EXCEPT may appear inside subqueries, "as is required by the SQL2 standard" (§1.3, PDF p. 2). Duplicates count, as in SQL (§1.1, PDF p. 2); some rules use keys or unique tuple IDs (Rules 2 and 6, PDF pp. 5–7). NULLs: not discussed.
- **"Correct":** each rule must be "an atomic change mapping a valid QGM to an equivalent valid QGM" (§4 item 4, PDF p. 9).
- **Measurements** (§2.1, PDF pp. 3–4): elapsed and CPU time on DB2 before and after rewriting, both through DB2's usual plan optimization, on the DB2 benchmark database of [Loo86] (inventory tracking and stock control) "scaled up by a factor of 10" (Tab. 1, PDF p. 4).

## Approach

- **Rules** (§3.1–3.2, PDF pp. 4–8; Tab. 2–11), each a condition and an action on QGM:
  - **SELMERGE** (Rule 1, Tab. 2, PDF p. 4): merges a lower SELECT box into the upper one when an F quantifier connects them, no other quantifier ranges over the lower box, and one of three duplicate conditions holds, giving the optimizer more join orders; BOXCOPY and ADDKEYS handle the only two cases where it can't apply (PDF p. 5).
  - **DISTPU** (Rule 2, Tab. 4, PDF p. 5): marks a SELECT box's output distinct, with no duplicate removal, when every F quantifier meets the one-tuple- or quantifier-nodup-condition.
  - **DISTPDFR/DISTPDTO** (Rule 3, Tab. 5, PDF p. 6): a SELECT or set-operation box that removes or ignores duplicates lets its F quantifiers permit them; a box whose every user permits duplicates may then add or drop them. **EorAPDFR** (Rule 4, Tab. 6, PDF p. 6): E and A quantifiers permit duplicates, since existential and universal tests are blind to them.
  - **BOXCOPY** (Rule 5, Tab. 7, PDF p. 6) copies a box that several quantifiers range over; **ADDKEYS** (Rule 6, Tab. 8, PDF p. 7) adds the inputs' keys so a duplicate-keeping box can remove duplicates safely.
  - **EtoF** (Rule 7, Tab. 9, PDF p. 7): makes an existential subquery that forms a Boolean factor a join member, when the box's output is distinct, its body permits duplicates, or the one-tuple-condition holds. With ADDKEYS, the authors argue such subqueries over SELECT boxes "are guaranteed to merge" (§3.2, PDF pp. 7–8).
  - **INT2EXIST** (Rule 8, Tab. 11, PDF p. 8): turns an INTERSECT whose body need not preserve duplicates into a SELECT DISTINCT over one arbitrarily chosen input, with an EXISTS subquery matching all columns for each other input. A similar rule, EXC2NEXIST, turns EXCEPT into a negated existential subquery (footnote 7).
- **Triggering graph** (Fig. 2, PDF p. 4): SELMERGE is "transitively dependent on each of the other rules".
- **Rule engine** (§4, PDF pp. 8–9), built since typical rule systems such as the expert-system language OPS5 lacked needed capabilities: rules as pairs of functions in a procedural language such as C; a current **context** (box, quantifier or predicate) that special rules advance, traversing QGM; **rule classes**, each with its own conflict resolution, **sequential** (cycles through ordered rules) or **priority** (fires the highest-order rule whose condition holds), organized to enforce orderings such as INT2EXIST before SELMERGE; termination after a programmer-set number of rules considered; per-user rule switches and tracing.

## Results

- **Example 1, view merge** (Tab. 3, PDF p. 5): DISTPU, then SELMERGE, give what the authors call "an 1100× improvement in CPU time" and "a 200× improvement in the elapsed time"; "Although this example is simple, many commercial DBMSs miss this optimization."
- **Example 4, IN subquery to join** (Tab. 10, PDF p. 7): DISTPU, EtoF and SELMERGE give "a 32× improvement in CPU time and a 14× improvement in elapsed time".
- **Example 5, INTERSECT to join** (Tab. 12, PDF p. 8): INT2EXIST, EtoF, SELMERGE; CPU 9.65 s → .42 s, elapsed 13.92 s → 1.77 s, on the unscaled database (footnote 9); DB2 then chose a nested-loop join (for each row of one input, look up matching rows of the other) using the index on the join column.
- **Design claims:** once all engine controls were in, adding rules became "fairly easy"; since each rule yields a valid QGM and "does not degrade query performance", the worst case is an untouched query (§4, PDF p. 9). They report few of "the oft-cited problems of rule systems" and capabilities that "surpass by a significant margin those of current RDBMSs, commercial systems included", and say converting INTERSECT and EXCEPT to subqueries "has not been dealt with in the past" (§5, PDF p. 9).

## Limits the authors state

- "Naturally we do not propose to find an optimal expression of a query" (§1.2, PDF p. 2).
- Queries with non-existential or non-Boolean-factor subqueries, set operators (though "Even some of these get converted to a single SELECT", footnote 2), aggregates, or user-defined extension operators such as OUTER JOIN are not rewritten to one SELECT (§3, PDF p. 4); of Fig. 2, "We make no claim to be exhaustive" (§3, PDF p. 4).
- EtoF: "We do not prove its correctness here" (§3.2 Rule 7, PDF p. 7).
- BOXCOPY with correlated queries is "beyond the scope of this paper", though Starburst's version handles it (footnote 4, PDF p. 6).
- Example 3's SQL "does not exactly capture the semantics of the transformed QGM" (§3.1 Rule 6, PDF p. 7).
- Table 12: DB2 "does not support INTERSECT", so UNION was run; its output is small in their experiment, so they call the error "negligible", and the original's numbers "conservative" (footnote 10, PDF p. 8).
- "As the size of the graph grows, the cost of optimization also grows" (§2, PDF p. 3).

## Open problems and building blocks

- **Open:** the speedups suggest, they say, that query transformation is a ripe area of research, and "we expect to continue adding transformations to it" (§1.2, PDF p. 2); extensibility should let plan optimizers be "taught" to avoid shortcomings that may only show in production (§5, PDF p. 9).
- **Released:** Nothing stated.
- **To reuse it:** rules are written over Starburst's QGM (§4, PDF p. 8); Query Rewrite can emit SQL for another DBMS (§2.1, PDF p. 4); keys for DISTPU and ADDKEYS (§3.1, PDF pp. 5–7).
- **Beyond its domain:** planning "path expressions" in object-oriented queries (reaching related records through a path, such as a patient's medical records) is "a problem very similar to that of optimizing (nested) SQL subqueries" (§1.1, PDF p. 1).

## On this site

- **Discussed in:** [Refuting faulty rewrite rules](#/challenges/faulty_rewrite_rules)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/qo-rules">qo-rules</a><a class="tag sub" href="#/tags/rewrite-classic">rewrite-classic</a><a class="tag sub" href="#/tags/rules-lib">rules-lib</a></span>
