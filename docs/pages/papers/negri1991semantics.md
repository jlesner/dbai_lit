# Formal semantics of SQL queries

**Formal semantics of SQL queries** · TODS 16(3) 1991

Read: [PDF](https://dl.acm.org/doi/pdf/10.1145/111197.111212) · [DOI](https://doi.org/10.1145/111197.111212)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Defines SQL query semantics by translation into an Extended Three-Valued tuple Predicate Calculus (§1–§3).
- Handles SQL's three-valued logic, nested subqueries and aggregates, then studies query equivalence by reduction to two-valued calculus (§1, §4).
- Shows which queries agree on NULL-free databases but not in general ("critical equivalence sets"; only queries with universal quantification, §4.2, PDF pp. 17–20); its claim that equivalence analysis is "completely solved" is overstated. Predates [A Formal Semantics of SQL Queries](#/papers/guagliardo2017semantics "A formal semantics of SQL queries, its validation, and applications (2017)") and [A Coq mechanised formal…](#/papers/benzaken2019coq "A Coq mechanised formal semantics for realistic SQL queries: formally reconciling SQL and bag relational algebra (2019)").

## In plain words

In SQL, comparing with a missing value (NULL) gives unknown, not true or false. The paper defines SQL queries' meaning exactly by translating them, rule by rule, into a three-valued logic the authors build (§1, PDF pp. 1–2). Their motivation: earlier translations covered only a subset of SQL, some with a restricted semantics, e.g. without three-valued logic; a complete treatment provides "a safe foundation" for rewrites before optimization (§1, PDF p. 2). They add rules bringing a translated query into a standard shape that true/false logic handles, and call this a complete solution to deciding whether two SQL queries always return the same result (abstract, PDF p. 1; §4, PDF p. 15). Main finding: queries that true/false reasoning calls equivalent, such as the NOT EXISTS and NOT IN forms of a condition on every row of a subquery, can differ once NULLs occur; under their assumption that different conditions are unrelated, only queries with such universal conditions are affected (§4.2, PDF pp. 17–20). They place their originality in considering "the complete syntax and semantics of SQL" (§1, PDF p. 2).

## Background and terms

**Terms to know:** [NULL and three-valued logic](#/glossary/null-and-three-valued-logic) · [formal semantics](#/glossary/formal-semantics) · [query equivalence](#/glossary/query-equivalence) · [relational calculus](#/glossary/relational-calculus) · [first-order logic](#/glossary/first-order-logic) · [correlated subquery](#/glossary/correlated-subquery) · [query rewriting and rewrite rules](#/glossary/query-rewriting-and-rewrite-rules) · [syntax-directed translation](#/glossary/syntax-directed-translation) (§3, PDF pp. 7–9)

**The paper's own terms:**
- **E3VPC**: target logic, Extended Three-Valued (Tuple) Predicate Calculus (abstract, PDF p. 1; §2, PDF p. 3). A tuple predicate calculus (variables range over table rows) with three truth values, aggregates and the operators below (§2, PDF p. 3); an expression denotes the rows for which an interpreted condition holds (§2.1, PDF p. 4).
- **Interpretation operator; true-, false-interpreted**: turns a three-valued condition into a two-valued one by reading unknown as true or as false (Defs. 1–2, §2.2, PDF pp. 5–6).
- **Compact form**: a quantifier restricted to a set (for all rows of a set, or some row of it, a condition holds); over an empty set the first is true, the second false (§2.2, PDF pp. 6–7).
- **Null-comparison operator**: an equality that is also true when both sides are NULL, used to translate GROUP BY (§2.1, PDF p. 4; Tab. II rule 15, PDF p. 10).
- **External reference operator** (an up-arrow): makes a variable refer to the closest outer expression that ranges over a variable of that name, so a subquery can use its outer query's rows (§2.2, PDF p. 6).
- **Selection Expression**: the translated WHERE and HAVING clauses joined by AND, false-interpreted because SQL drops rows and groups whose condition is unknown (§3 point 1.1, PDF p. 11).
- **Complex predicate**: a condition containing a subquery (SOME, ALL, IN, NOT IN, EXISTS, comparison with a subquery), split, except EXISTS, by whether the subquery selects a column or an aggregate (§3 point 2, PDF pp. 11–12).
- **Canonical E3VPC expression**: every atomic predicate (one comparison, or the constant true, false or unknown) carries its own interpretation operator, there are no others, and no compact forms (§4.1, PDF p. 15).
- **Critical Equivalence Set**: queries whose canonical forms have identical structure and differ only in whether some elementary (atomic) predicates are true- or false-interpreted; the example pair agrees on databases without NULLs but not in general (§4.2, PDF p. 17).

**Builds on:**
- Codd (1979), Jarke and Schmidt (1982) and Klug (1982), from which several of E3VPC's extensions are derived, beside "a few completely new extensions" (§1, PDF p. 2).
- Earlier translations of SQL [4, 5, 16], among them Ceri and Gottlob (1985) into [relational algebra](#/glossary/relational-algebra); all, the authors say, refer to a subset of SQL (§1, PDF p. 2).
- Equivalence work [2, 5, 18, 23], including Aho, Sagiv and Ullman ([Equivalences among Relational Expressions](#/papers/aho1979equivalences "Equivalences among Relational Expressions (1979)")) and Sagiv and Yannakakis ([Equivalences Among Relational Expressions…](#/papers/sagiv1980union "Equivalences Among Relational Expressions with the Union and Difference Operators (1980)")), which do not consider "the three-valuedness of predicates" (§1.1 (d), PDF p. 3).

## Problem and setting

- **Question:** what an SQL query means, formally, and how to decide equivalence under three-valued logic (§1, PDF pp. 1–2; §4, PDF p. 15).
- **SQL fragment:** the grammar of Tab. I (PDF p. 8): SELECT ALL or DISTINCT, FROM, WHERE, GROUP BY, HAVING; COUNT, AVG, MAX, MIN, SUM; subquery conditions in WHERE and HAVING. The authors say it "covers the whole syntax of SQL queries as defined in [3]", reformulated: arithmetic expressions removed, correlation names (table aliases) mandatory (§3, PDF p. 7). Set operations such as UNION, and outer joins: not discussed.
- **Duplicates:** relations are "sets of distinct objects" whose tuples carry a unique identifier (§2.1, PDF p. 4), so a translation keeps every qualifying row, which the authors say corresponds to SELECT ALL (§3 point 1.3, PDF p. 11).
- **NULLs:** a comparison with NULL has an undefined result (§2.1, PDF p. 4). Aggregates return NULL on an empty set, except COUNT and COUNTD (count distinct), which return 0, and ignore rows with a NULL in the aggregated column, except COUNT (§2.2, PDF p. 6).
- **Correctness:** consistency with ANSI SQL [3], with an almost-formal proof in the authors' report [21] (§1, PDF p. 2). Equivalence means agreeing on a general database, not only on NULL-free ones (§4.2, PDF p. 17).

## Approach

- **Translation** (§3, PDF pp. 7–15). Each syntax rule of Tab. I has a translation rule; Tab. II lists 33, leaving the obvious ones implicit (PDF pp. 9–10). A query block becomes the set of FROM-clause rows whose Selection Expression is true (point 1, PDF p. 11). GROUP BY becomes a join condition, with the null-comparison operator, used inside the HAVING and aggregate translations (point 1.2, PDF p. 11). A subquery condition becomes a quantifier over the subquery's rows (point 2.1, PDF p. 12). Subqueries selecting an aggregate need an extra term for the empty case, where COUNT still gives 0 and the others NULL (point 4, PDF p. 13).
- **Equivalence rules** (§4.1, PDF pp. 15–17). Two-valued rules hold except two: that P or not P is always true, and P and not P always false (PDF p. 16). Tab. III (PDF p. 16) adds six: interpretation distributes over OR, AND and the quantifiers (rules 1–2, 5–6); moving it through a negation swaps true- and false-interpretation (rule 3); a doubly interpreted condition keeps the inner interpretation (rule 4).
- **Thm. 1** (PDF p. 16) lets a program remove an existential compact form: an interpreted statement that some row of the restricted set satisfies Q becomes: some row of R satisfies the range condition P (which defines the restricted set), under its own interpretation, and Q, under the outer one, for any table R, conditions P and Q, and either interpretation in each place. **Thm. 2** (PDF pp. 16–17) does the same for the universal compact form: every row of R satisfies the negated range condition under the opposite interpretation, or Q under the outer one.
- **Three-valuedness analysis** (§4.2, PDF pp. 17–20). The translation produces only false-interpretations, so a critical equivalence set can only come from Tab. III rules 3 and 4 (PDF pp. 17–18). Assumptions: predicates are identical only if syntactically identical, and different predicates are unrelated, so A = B and A ≠ B count as different if the latter is not rewritten as NOT (A = B) (PDF p. 17).

## Results

No experiments; derivations only (§4, PDF pp. 15–20).
- **Canonical form:** any E3VPC expression can be brought to canonical form (PDF p. 16); since two-valued predicate calculus is "well understood", this is "a complete solution of the problem of deciding whether two SQL queries are equivalent" (§4, PDF p. 15).
- **Simple queries** (no nesting, no quantification): "It is easy to show" that two cannot form a critical equivalence set (PDF p. 18).
- **Universal quantification:** five basic SQL forms, equivalent under two-valued logic, reduce to three canonical forms, equivalent only if the outer interpretation is the opposite of the inner false one; "in general this is not true", e.g. both are false when the quantified condition is the only complex predicate of an otherwise simple query (PDF p. 18). Fig. 1 (PDF p. 19) gives the five: NOT EXISTS, NOT … ≠ SOME, NOT … IN, = ALL, NOT IN.
- **Existential quantification:** its five forms are equivalent only if both interpretations agree, so a critical set needs the condition inside a universally quantified one; a comparison with a subquery has one form and one class (PDF p. 20).
- **Summary** (PDF p. 20), under the assumptions above: queries without universal quantification "never belong to a critical equivalence set"; queries with it "always produce critical equivalence sets"; quantified conditions nested inside a universal one increase the number of different interpretations.
- **Conclusion:** equivalence of queries with quantified predicates "cannot be analyzed by simply using two-valued logic", so transformers that reduce queries to standard forms before optimization should be based on these rules (§5, PDF p. 21). The authors also call their specification "completely non-procedural" and "much more compact than the procedural specification of [3]" (§5, PDF p. 20).

## Limits the authors state

- Consistency with ANSI SQL: "A proof of this statement is not given in this paper"; an almost-formal one is in report [21], and "A completely formal proof of equivalence is impossible with respect to a nonformal definition" (§1, PDF p. 2).
- "there are SQL dialects that contain features not defined here" (§1, PDF p. 2).
- Arithmetic expressions are left out as "absolutely irrelevant to the points considered in this paper" (§3, PDF p. 7).
- DISTINCT in the outer select list "is not considered, as this select list is not translated" (§3 point 3, PDF p. 13).

## Open problems and building blocks

- **Open:** using E3VPC "as a basis for the definition of a more rigorous language having the same power of SQL", which "has been left as a subject for further work"; analysing the translation rules to improve SQL itself (§5, PDF p. 21).
- **Released:** Nothing stated.
- **To reuse it:** the SQL fragment of Tab. I (PDF p. 8); Tab. II's correspondence to ANSI SQL is discussed in report [21] (PDF p. 10).

## On this site

- **Discussed in:** [Refuting faulty rewrite rules](#/challenges/faulty_rewrite_rules) · [Canonical forms for queries](#/challenges/query_canonical_forms) · [Query equivalence: prove or refute](#/challenges/query_equivalence)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/theory-null">theory-null</a></span>
