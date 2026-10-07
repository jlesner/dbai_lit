# A Formal Framework for Typing and Cast Semantics in SQL Engines

**TRAF** · ACM TOPLAS 2026 (Just Accepted)

Read: [PDF](https://dl.acm.org/doi/pdf/10.1145/3834861) · [DOI](https://doi.org/10.1145/3834861)  
Code: [Elucidating-Type-Conversions](https://github.com/YeWenjia/Elucidating-Type-Conversions-in-SQL-Engines)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- A formal typing and cast semantics (TRAF) for SQL engines, instantiated for PostgreSQL, SQL Server, MySQL, SQLite and Oracle.
- Cast insertion makes each engine's implicit casts explicit; PyTRAF is tested against the engines on random queries, Spider, Calcite and SQLancer++ queries.
- Where engines differ in typing and implicit casts, and which explicit cast preserves a query's behaviour across engines or where none can (PDF p. 2); for a core fragment without aggregation (PDF p. 3).

## In plain words

Database engines such as PostgreSQL, SQL Server, Oracle, MySQL and SQLite disagree on how they type queries and convert values between types: the same query can be rejected before it runs, fail while running, or return different rows. The authors say this directly affects moving queries between engines, and that existing migration tools tend to put syntax before behaviour (§1, PDF pp. 1–2). They build TRAF, a formal model of typing and type conversion for a core fragment of SQL whose engine-specific parts are left open, fill it in for the five engines, prove which engines meet which safety guarantees, and test a Python implementation, PyTRAF, against them. They report that after their stated simplifications PyTRAF agrees with PostgreSQL, MySQL and SQLite across their three workloads, while SQL Server and Oracle keep disagreements in a small set of catalogued cases, e.g. optimizer rewrites hiding runtime errors (§6, PDF p. 29). They call type constraints and casts that may raise errors at runtime a problem that "has not been dealt with before" (§1, PDF p. 3).

## Background and terms

**Terms to know:** [formal semantics](#/glossary/formal-semantics) · [SQL dialect](#/glossary/sql-dialect) · [NULL and three-valued logic](#/glossary/null-and-three-valued-logic) · [bag semantics](#/glossary/bag-semantics) · [correlated subquery](#/glossary/correlated-subquery) · [query optimizer](#/glossary/query-optimizer) · [fuzzing](#/glossary/fuzzing) · [relational algebra](#/glossary/relational-algebra) (§3.1, Fig. 2, PDF pp. 7–8)

**The paper's own terms:**
- **implicit and explicit cast**: an explicit cast is written in the query (`CAST('1.1' AS FLOAT)`); an implicit cast is a conversion the engine applies itself, such as '1' to 1 before adding (§2.1, PDF p. 5; §3.4, PDF p. 12).
- **static and runtime error**: rejection before running, and failure during it; engines "differ in behavior" when results differ, "including different kinds of errors" (§1, PDF p. 3).
- **abstract operators**: the engine-dependent functions the rules leave open (§3.2, PDF pp. 8–9), e.g. `resolve` (overload resolution, below), `biconv` (the common column type of a set operation), a feasibility check that rules out explicit casts known to fail, and `clean` (in some engines, replaces the unknown type in a result type).
- **unknown type**: PostgreSQL's internal type for string literals; for SQLite it approximates dynamic typing (§3.1, PDF p. 8).
- **instantiation**: one engine's definitions of the abstract operators, from documentation, and black-box experiments where it lacked detail (§4, PDF p. 19).
- **cast insertion** (elaboration): rewrites a well-typed query so every implicit cast becomes explicit (§3.4, PDF p. 12).
- **cast-free query**: a query with no explicit cast (§5, PDF p. 27; Fig. 12, PDF p. 28).

**Missing glossary terms:**
- **overload resolution**: choosing which typed version of an operator (integer `+` or real `+`) a call uses, from the argument types (§3.2, PDF p. 8).
- **type safety and type soundness**: safety means a well-typed query evaluates to a table or a controlled error and does not "get stuck" (stop with neither); soundness adds that the table has the query's type (§5, PDF p. 27).

**Builds on:**
- Guagliardo and Libkin's formal semantics of SQL ([A Formal Semantics of SQL Queries](#/papers/guagliardo2017semantics "A formal semantics of SQL queries, its validation, and applications (2017)")), "whose core we follow here" (§7, PDF p. 38).
- The authors' conference paper (European Symposium on Programming, ESOP 2025) "Elucidating Type Conversions in SQL Engines", extended with EXISTS, IN, NULL, Oracle and more validation (§1, PDF pp. 4–5).
- Formal SQL semantics assuming right-typed arguments, e.g. Guagliardo–Libkin and Ricciotti–Cheney ([A Formalization of SQL with Nulls](#/papers/ricciotti2020nulls "A Formalization of SQL with Nulls (2022)")) (§1, PDF p. 3).

## Problem and setting

- **Question:** can one framework capture each engine's static rejections, runtime failures and results, and the conditions for each guarantee (§1, PDF pp. 3–4)?
- **Fragment:** booleans, numbers, nulls, selections, cross products, nested queries, set operations, `+`, `<`, `=`, casts, EXISTS, IN and IS NULL (§1, PDF pp. 3–4; Fig. 2, PDF p. 7); "features such as aggregation are not supported within this core" (§1, PDF p. 3).
- **Semantics:** integers, reals, booleans, strings, unknown (Fig. 2, PDF p. 7), without widths or precisions (§2, PDF p. 5); tables are bags of rows (§3.1, PDF p. 8); three-valued logic (§3.5, PDF p. 16); a typed schema is assumed (§7, PDF p. 39). In the metatheory (the proofs about TRAF) runtime errors come from explicit casts; overflow and division by zero are "outside the core calculus" (§3.5, PDF p. 16).
- **"Correct" in the experiments:** PyTRAF's outcome equals the engine's, compared "as row sets, errors, or rejections" (§6, PDF p. 29).

## Approach

- **Four phases** (Fig. 1, PDF p. 3): translate SQL to relational algebra, typecheck, insert casts, evaluate.
- **Translation** (§3.6, PDF pp. 17–19): each query of the paper's SQL grammar has exactly one translation (Thm. 3.1, PDF p. 19), "a well-definedness result", not that engines behave alike.
- **Typechecking** (§3.3, Fig. 3, PDF pp. 9–12): one rule per syntactic form, so for a fixed instantiation with computable operators it is linear in query size, "up to the cost of abstract operator calls" (PDF p. 9).
- **Cast insertion** (§3.4, Fig. 4, PDF pp. 12–14): e.g. PostgreSQL's `SELECT '1' + 1` becomes `SELECT CAST('1' AS INT) + 1`.
- **Evaluation** (§3.5, Fig. 5, PDF pp. 14–17): each step returns a value or an error that propagates.
- **Instantiations** (§4, PDF pp. 19–25): PostgreSQL "strongly-typed", often rejecting a query when it cannot check a cast's feasibility; Oracle "a middle ground"; SQLite types values as unknown, uses a runtime type for comparisons, and makes all abstract operators total (defined on every input).
- **Translation examples** (§4.4, PDF pp. 25–26): a general PostgreSQL translation of SQLite's string-versus-number comparison would use type tests and dynamic casts, which "are not supported natively".
- **Theorems** (§5, PDF pp. 26–28), for well-typed queries; the first three also assume a database matching the schema:
  - If every operator is deterministic and total on its right types (R1), `biconv` returns one of its two input types (R2) and `resolve` one of the candidate signatures (R3), evaluation returns a table or a controlled error (Thm. 5.1, PDF p. 27).
  - If also a successful explicit cast to a type yields a value whose cleaned type is that type (R4), evaluation returns a controlled error or a table that has the query's type up to `clean` (Thm. 5.2, PDF p. 27).
  - If R1 holds, casts inserted by `resolve` (R5) and by `biconv` (R6) never fail at runtime, and `clean` is the identity or replaces unknown by String (R9), a cast-free query's cast-inserted form evaluates without error (Thm. 5.3, PDF p. 27).
  - If R1, R2, R4, R9 hold and the feasibility check accepts the casts `resolve` (R7) and `biconv` (R8) choose, cast insertion yields exactly one query, of the same type (Thm. 5.4, PDF p. 28).

## Results

- **Theorems per engine** (Tabs. 3–4, PDF pp. 27–28): all five are type safe; SQLite fails R4, so soundness and the cast-insertion theorem; the cast-free theorem holds for PostgreSQL, MySQL and SQLite, not SQL Server (fails R5, R6) or Oracle (fails R5).
- **Random fuzzing** (§6.2, PDF pp. 29–31): "100,000 random queries per engine", with nulls and simplification (avoiding constructs known to trigger engine rewrites) each on or off; a static rejection on both sides counts as agreement. It reports 0 disagreements for SQLite in every configuration, at most 7 for MySQL, and 0 for PostgreSQL with simplification (Tab. 5, PDF p. 31). Simplification cuts SQL Server's from 6,986 to 746 without nulls, and Oracle's fall too; "the formalism does not resolve these cases on its own" (§6.2, PDF p. 30).
- **Benchmarks** (§6.3, PDF pp. 30–33): on Spider, a cross-domain [text-to-SQL](#/glossary/text-to-sql) benchmark ([Spider](#/papers/yu2018spider "Spider: A Large-Scale Human-Labeled Dataset for Complex and Cross-Domain Semantic Parsing and Text-to-SQL Task (2018)")), after excluding 206 queries too slow for PyTRAF and rewriting idioms that violate standard SQL or depend on SQLite so all five engines agree, PyTRAF and the five engines agree on each of the remaining 3,472. On Calcite's optimizer test queries ([Apache Calcite](#/papers/begoli2018calcite "Apache Calcite: A Foundational Framework for Optimized Query Processing Over Heterogeneous Data Sources (2018)"), a query-processing framework), the 250 of 794 without OVER, PARTITION or FULL OUTER JOIN all agree.
- **SQLancer++** (§6.4, PDF pp. 33–34), a fuzzer that builds database states and adapts queries to engine feedback: on 76,808 cases, after fixing PyTRAF on cases that crashed it or disagreed, it agrees with PostgreSQL, MySQL and SQLite on the whole corpus; SQL Server keeps 348 and Oracle 26 mismatches. SQL Server and Oracle queries run in PyTRAF under two evaluation orders, and "A query validation is successful if each evaluation order agrees with the engine" (PDF p. 34).
- **Mismatch catalog** (§6.5, Tab. 7, PDF pp. 34–38): 17 cases, among them optimizer rewrites that hide or trigger cast errors. The authors' dominant remaining cause of SQL Server and Oracle disagreement: PyTRAF casts a comparison operand before seeing that the other is NULL, a cast the engines skip (§6.5.4, PDF p. 36).

## Limits the authors state

- Aggregation is not in the core (§1, PDF p. 3); PyTRAF's aggregation, GROUP BY, HAVING, ORDER BY, LIMIT and LIKE are "implemented outside the formal model", and "the theorems of Section 5 do not cover them" (§6.6, PDF p. 38).
- Optimizers "can skip or reorder expressions and thereby hide or expose runtime cast errors" (§3.6, PDF p. 19).
- The random generator "cannot produce the schemas and queries found in real applications" (§6.6, PDF p. 38).
- Other engine versions "may affect the exact disagreement counts, but is unlikely to change the per-engine asymmetry" (§6.6, PDF p. 38).

## Open problems and building blocks

- **Open:** "Future work may involve an automatic translation mechanism" (§4.4, PDF p. 26); discrepancies "under query optimizations", plus aggregation, GROUP BY, ORDER BY and OUTER JOINs (§8, PDF p. 39); type inference (§7, PDF p. 39); the open cases of Tab. 7 (PDF p. 35).
- **Released:** a prototype, PyTRAF (§1, footnote 4, PDF p. 4).
- **To reuse it:** an instantiation per engine (§4, PDF p. 19), a typed schema (§7, PDF p. 39); runs used an 18 GB Apple M3 Pro (§6.1, PDF p. 29). The authors say TRAF can "provide a formal basis to study type-aware query optimizations and design provably-correct query translators" (abstract, PDF p. 1).

## On this site

- **Discussed in:** [Telling bad translations from legitimate engine differences](#/challenges/bad_translation_detection) · [SQL dialect translation](#/challenges/dialect_translation) · [Refuting faulty rewrite rules](#/challenges/faulty_rewrite_rules) · [Equivalence of nondeterministic queries](#/challenges/nondeterministic_equivalence) · [SQL features that verifiers don't cover](#/challenges/verifier_coverage_gaps)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/dialect-misc">dialect-misc</a></span>
