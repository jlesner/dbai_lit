# A formal semantics of SQL queries, its validation, and applications

**A Formal Semantics of SQL Queries** · Its Validation, and Applications, PVLDB 11(1) 2017

Read: [DOI](https://doi.org/10.14778/3151113.3151116)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Formal semantics of basic SQL with subqueries, bags, set operations and NULLs (3-valued logic).
- Validated by running random queries against PostgreSQL and Oracle; 3VL adds no expressive power.
- QED cites it for SQL's NULL semantics ([QED](#/papers/wang2024qed "QED: A Powerful Query Equivalence Decider for SQL (2024)") §1); VeriEQL cites it only next to DataFiller ([VeriEQL](#/papers/he2024verieql "VeriEQL: Bounded Equivalence Verification for Complex SQL Queries with Integrity Constraints (2024)") Evaluation, Related Work).

## In plain words

SQL's official Standard is written in natural language, which is ambiguous, and vendors read parts of it in their own ways; earlier mathematical definitions simplified SQL, assuming rows never repeat or leaving out missing values (NULLs) (§1, PDF p. 1). The authors define precisely a core of SQL: SELECT-FROM-WHERE queries without aggregation, with nested subqueries, repeated rows, UNION, INTERSECT, EXCEPT and NULLs, "without any departures from the real language" (abstract, PDF p. 1). On random queries and small random databases, their implementation, adjusted to each system's quirks, matched the database systems PostgreSQL and Oracle: "The results were always the same" (§4, PDF p. 7). They then prove that queries which only move existing data around, never repeating a column name, express exactly what relational algebra, a small set of table operators, expresses with repeated rows counted, "the first formal proof" of this "that extends to bag semantics and nulls" (abstract, PDF p. 1); and that every query of the fragment can be rewritten to give the same answers with conditions only true or false, and back (§6, PDF p. 10).

## Background and terms

**Terms to know:** [formal semantics](#/glossary/formal-semantics) · [bag semantics](#/glossary/bag-semantics) · [set semantics](#/glossary/set-semantics) · [NULL and three-valued logic](#/glossary/null-and-three-valued-logic) · [correlated subquery](#/glossary/correlated-subquery) · [relational algebra](#/glossary/relational-algebra) · [semijoin and anti-semijoin](#/glossary/semijoin-and-anti-semijoin) · [SQL dialect](#/glossary/sql-dialect) · [expressive power](#/glossary/expressive-power) · [relational calculus](#/glossary/relational-calculus)

**The paper's own terms:**
- **basic SQL**: SELECT-FROM-WHERE queries with constants and NULLs in the SELECT list, three-valued logic, correlated subqueries in WHERE (EXISTS, IN, their negations) and FROM, set and bag union, intersection and difference, and any Boolean combination of conditions; a term is a constant, NULL or a full name (§2, PDF p. 3).
- **full name**: a pair table.attribute; output column names may repeat (§2, PDF p. 3).
- **fully annotated query**: every FROM item is named explicitly, every attribute qualified with that name, and every SELECT output named (§2, PDF p. 3).
- **environment**: values for the full names a subquery takes from outer queries (its **parameters**); a query's meaning depends on the database, the environment and a Boolean switch (§3, PDF p. 4).
- **not compositional**: the Standard's `SELECT *` returns all attributes, but acts like any constant directly under EXISTS; the switch marks that case (§3, PDF p. 4). PostgreSQL is compositional (§4, PDF p. 7).
- **Kleene logic**: SQL's truth tables for AND, OR and NOT over true, false and unknown (Fig. 1, PDF p. 2; §3, PDF p. 5).
- **data manipulation query** (Def. 1, PDF p. 9): the query and every subquery is a SELECT with an explicit list whose output names don't repeat, and every full name in the list refers to a table named in that block's FROM.
- **SQL-RA**: relational algebra plus two selection conditions, membership in an expression's result and emptiness of a result, analogues of IN and EXISTS (§5, PDF p. 9).
- **syntactic equality** (Def. 2, PDF p. 10): true when two terms denote the same constant or are both NULL, else false; §1 says set operations such as difference and intersection compare values this way (PDF p. 2).
- **two-valued semantics**: a predicate is true when it holds and no argument is NULL, else false; equality may instead be syntactic (§6, PDF p. 10).

**Builds on:**
- SQL-to-algebra translations by Ceri and Gottlob [7] and Van den Bussche and Vansummeren [36], assuming set semantics and no nulls; the authors' proof "is more direct, and covers more cases than the translations of [7, 36]" (§5, PDF p. 9; §7, PDF p. 11).
- Albert's bag operations [3], "the set of RA operations on bags we used here" (§7, PDF p. 11).
- Earlier direct semantics that, the authors say, fall short of real SQL (§7, PDF p. 12): Negri et al. [29] ([Formal semantics of SQL queries](#/papers/negri1991semantics "Formal semantics of SQL queries (1991)"); set semantics only), Cosette and HoTTSQL [8, 9] ([Cosette](#/papers/chu2017cosette "Cosette: An Automated Prover for SQL (2017)"), [HoTTSQL](#/papers/chu2016hottsql "HoTTSQL: proving query rewrites with univalent SQL semantics (2017)"); for proving query equivalences in a [proof assistant](#/glossary/proof-assistant); no nulls), and [24, 37]; none, they add, justified its semantics.

## Problem and setting

- **Questions:** what a basic SQL query returns, whether that matches engines, whether it equals relational algebra, whether three-valued logic is needed (§1, PDF pp. 1–2).
- **Motivation:** Example 1 (PDF p. 2): three ways to compute R minus S (NOT IN, NOT EXISTS, EXCEPT) agree without NULLs but give three different answers on a database with NULLs. Example 2 (PDF p. 2): a `SELECT *` query that some commercial systems reject alone but accept under EXISTS; hence "no single semantics will account for all the existing RDBMSs, even for the core language".
- **Assumptions:** queries have compiled and type-checked, so they are fully annotated, over one set of values for all types (§2, PDF p. 3); predicates are a parameter, equality always among them, each needing a meaning on non-null values only (§2, PDF p. 3).
- **What "correct" means:** the implementation's and the engine's tables have the same columns in number, name and order, and the same rows with the same multiplicities, in any order (§4 "Correctness criterion", PDF p. 7).
- **The algebra:** bag relational algebra, three-valued conditions, no repeated column names (§5, PDF p. 8).

## Approach

- **Semantics (§3, PDF pp. 3–5; Figs. 3–7, PDF pp. 4–6).** References resolve in the local FROM, then in enclosing scopes. Evaluating WHERE on a row binds that row's names; a full name occurring twice stays unbound, so referring to it fails as ambiguous (PDF pp. 4–5). Only predicates and IN produce unknown; IN is a disjunction of equalities with the subquery's rows, and EXISTS tests non-emptiness (Fig. 6, PDF p. 6).
- **Validation (§4, PDF pp. 5–7)**. A random query generator, its limits (tables, nesting, SELECT attributes, WHERE conditions) set from TPC-H, a performance benchmark with 22 business-support queries; eight tables, all attributes int; 100,000 queries, each with a database from the random data generator DataFiller, capped at 50 rows per table; two Python implementations, one for PostgreSQL's compositional `SELECT *`, one for Oracle's syntax (MINUS for EXCEPT) (PDF p. 7).
- **SQL to algebra (§5, PDF pp. 7–10).** Translate into SQL-RA (Fig. 9, PDF p. 11), simulating full names by unused plain names and repeated SELECT columns by extra joins on syntactic equality (PDF p. 10); then remove the extra conditions: membership becomes emptiness, and emptiness tests become left semijoins or antijoins (Prop. 2, PDF p. 10). With the standard algebra-to-SQL direction this gives Thm. 1 (PDF p. 9).
- **Removing three-valued logic (§6, PDF pp. 10–11).** Each condition gets a t-translation and an f-translation that, under two-valued semantics, hold exactly when the original is true, or false, under three-valued semantics; queries keep the t-translation (Fig. 10, PDF p. 12). This proves Thm. 2 (PDF p. 10): for every basic SQL query there is one whose two-valued result equals its three-valued result on every database, and conversely, whether two-valued equality is read like other predicates or as syntactic equality.

## Results

- **Thm. 1 (PDF p. 9):** data manipulation queries of basic SQL and relational algebra under bag semantics have the same expressive power; via Prop. 1 (each such query has an equivalent SQL-RA query, PDF p. 9) and Prop. 2 (PDF p. 10).
- **Thm. 2 (PDF p. 10):** three-valued logic adds no expressive power to basic SQL, under either reading of equality.
- **Validation:** PostgreSQL's and Oracle's outputs matched the corresponding variant on each query and database, "The results were always the same", Oracle's ambiguity errors included. The authors: "This gives us good evidence to state that the semantics of Figures 4–7 is correct." (§4, PDF p. 7).
- **Worked examples:** the rules reproduce Examples 1 and 2 (§3 "Examples", PDF p. 5); §5 "Example" translates Example 1's queries into the algebra (PDF p. 10).

## Limits the authors state

- No aggregation (§1, contribution 1, PDF p. 2).
- The semantics must be adjusted to each system's quirks, which the authors call minor and well documented (§1, PDF p. 2; §4, PDF pp. 5–7).
- Proving that it matches real engines "formally is infeasible", which leaves experiment (§4, PDF p. 5).
- The implementation checks correctness, "and not for its performance"; it computes Cartesian products, hence the 50-row cap (§4, PDF p. 7).
- Equivalence with the algebra needs a restriction, since algebra queries "do not invent new values, nor repeat attributes" (§5, PDF p. 9).
- Not ready to drop three-valued logic: legacy code assumes it, emulation makes queries cumbersome and less efficient, and "commercial optimizers struggle with queries involving disjunctions" (§6 "SQL and two-valued logic", PDF p. 11).

## Open problems and building blocks

- **Open** (all §8, PDF p. 12):
  - Extend the semantics and its validation to "aggregation and grouping", and beyond queries to "schema definition, constraints and updates".
  - See what the verification techniques of the restricted semantics [9, 24, 37] "would yield without restrictions on the language".
  - Whether two-valued queries are natural for users to write: "This conjecture should be confirmed (or disproved) by a proper usability study."
  - Extend their work on correct answers over incomplete data [17], so far only for marked nulls (nulls carrying identifiers, so two equal marks denote one value), to SQL's nulls.
  - They advocate that the semantics (or a variant) "should be an integral part of the Standard and serve as the basis for a reference implementation endorsed by ISO"; engines could then be checked with test suites like the Technology Compatibility Kit of openCypher, a graph-query initiative.
- **Released:** Nothing stated.
- **To reuse it:** basic SQL, fully annotated, adjusted per engine (§2, PDF p. 3; §4, PDF p. 7); the authors call it "very easy to implement and modify" (§8, PDF p. 12).

## On this site

- **Discussed in:** [Telling bad translations from legitimate engine differences](#/challenges/bad_translation_detection) · [Can SQL equivalence checkers be trusted?](#/challenges/checker_soundness) · [SQL dialect translation](#/challenges/dialect_translation) · [Refuting faulty rewrite rules](#/challenges/faulty_rewrite_rules) · [Query equivalence: prove or refute](#/challenges/query_equivalence) · [SQL features that verifiers don't cover](#/challenges/verifier_coverage_gaps)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/theory-null">theory-null</a></span>
