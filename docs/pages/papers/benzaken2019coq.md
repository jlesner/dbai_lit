# A Coq mechanised formal semantics for realistic SQL queries: formally reconciling SQL and bag relational algebra

**A Coq mechanised formal…** · CPP 2019

Read: [DOI](https://doi.org/10.1145/3293880.3294107)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Executable Coq semantics for SELECT … GROUP BY … HAVING with NULLs, aggregates and correlated subqueries.
- Mechanised proof that it equals an extended bag relational algebra; pins down aggregate grouping levels.
- The semantics Logos's FormalSQL refactors and extends ([Logos](#/papers/ke2026logos "Logos: Certified Order-Sensitive SQL Rewrites with Mechanized Semantics and LLM Guidance (2026)") §4); its authors tested it against PostgreSQL and Oracle (PDF p. 3), and its aggregate-context cases (Fact 2, PDF p. 5) are test cases for any checker's semantics (our suggestion).

## In plain words

SQL's ISO standard is a thousand-page document that the authors call often under-specified, and earlier formal definitions covered only restricted parts (§1, §2.2, PDF pp. 1–3). Their long-term goal is a SQL compiler machine-checked in the Coq proof assistant (§1, PDF p. 1). They write in Coq a runnable definition of what a large SQL fragment computes, with duplicate rows, missing values, aggregates and subqueries that refer to outer queries. On queries and a small database they designed, it gave the same results as PostgreSQL and Oracle (§2.2, PDF pp. 3–4). They prove in Coq that the fragment computes the same results as an extended relational algebra, a small set of table operators, on databases where all rows of a table have the same columns and, from SQL to algebra, for queries whose FROM items use distinct column names, subqueries included (§4.3, PDF p. 11). They call it "the first, to our best knowledge, mechanised, formal proof of equivalence between the considered SQL fragment and bag relational algebra" (§1, PDF p. 2).

## Background and terms

**Terms to know:** [formal semantics](#/glossary/formal-semantics) · [proof assistant](#/glossary/proof-assistant) · [bag semantics](#/glossary/bag-semantics) · [set semantics](#/glossary/set-semantics) · [NULL and three-valued logic](#/glossary/null-and-three-valued-logic) · [correlated subquery](#/glossary/correlated-subquery) · [relational algebra](#/glossary/relational-algebra) · [semijoin and anti-semijoin](#/glossary/semijoin-and-anti-semijoin) · [extraction](#/glossary/extraction-proof-assistants)

**The paper's own terms:**
- **SQLCoq**: the authors' Coq SQL syntax with its executable bag semantics (§1, PDF p. 2; §3, PDF pp. 6–10).
- **SQLAlg**: their bag, "environment-aware" algebra (§1, PDF p. 2), extending the textbook algebra of [8] with grouping over expressions, aggregate expressions in projections and a HAVING condition on grouping (§4.2, PDF pp. 10–11).
- **Extended relational algebra**: here, selection σ (filter rows), projection π (keep columns), join ⋈ and grouping γ, plus union, intersection and difference (§4.1, PDF p. 10). In SQLAlg ⋈ is "the true natural join", combining rows that agree on shared columns (§4.2, PDF p. 11).
- **Evaluation context**: the list of tuples an aggregate runs over (§2.2.2, PDF p. 3). A group is **split** when each of its tuples feeds the aggregate, and **collapsed** to one tuple when only its grouping columns are used (§2.2.2, PDF pp. 4–5).
- **Environment and slice**: an environment is a stack of slices, one per nesting level, innermost on top; a slice holds the level's attribute names, its GROUP BY expressions and its tuples (a group if the level groups, otherwise one tuple) (§2.3, PDF p. 5).
- **Simple and complex expressions**: simple ones (values, attributes, functions) are evaluated on one tuple; complex ones may also contain aggregates, none inside another, and are in that case evaluated on a collection of tuples (§3.1, PDF p. 6).
- **Well-sorted instance**: all tuples of a table have the same labels (column names) (Def. 4.1, PDF p. 11). **Well-formed query**: the labels in its FROM clauses are pairwise disjoint, and its subqueries are well-formed (Def. 4.2, PDF p. 11).

**Missing glossary terms:**
- **Structural induction**: proving a property for every query by proving it for each way a query is built, assuming it for the parts; here done by induction on size (§4.3, PDF p. 11).

**Builds on:**
- The textbook extended relational algebra of Garcia-Molina, Ullman and Widom [8], which SQLAlg extends and which, the authors note, gives grouping no formal definition (§4.1–4.2, PDF pp. 10–11).
- The authors' Coq formalisation of the relational model with Dumbrava [3], where the algebraic equivalences are proven, and their Coq formalisation of SQL's execution engines [4] (§5, PDF pp. 12–13).
- Guagliardo and Libkin [12] ([A Formal Semantics of SQL Queries](#/papers/guagliardo2017semantics "A formal semantics of SQL queries, its validation, and applications (2017)")), "The first semantics for SQL accounting for NULL's and bags" in the authors' words, which they say lacks GROUP BY … HAVING, aggregates, quantifiers in formulae and complex expressions (§1, PDF p. 2); Q2–Q4 come from it (§2.2.1, PDF p. 3).
- Mechanised work they compare against (§1, PDF p. 2): Malecha et al.'s attempt to verify a database system in Coq [16]; the equivalence checker HoTTSQL [6] ([HoTTSQL](#/papers/chu2016hottsql "HoTTSQL: proving query rewrites with univalent SQL semantics (2017)")), whose semantics they call not executable; and Auerbach et al. [2], who translate SQL into a Coq nested relational algebra.

## Problem and setting

- **Question:** what do SQL queries with NULLs, aggregates and correlated subqueries compute, and is the fragment equivalent to a bag algebra (§1, PDF pp. 1–2)?
- **Fragment:** `select [distinct] from where group by having` with NULLs, functions, aggregates, the quantifiers `in`, `any`, `all` and `exists`, and nested, possibly correlated subqueries in FROM, WHERE and HAVING; plus `union`, `intersect`, `except` (§3, PDF p. 6; Fig. 4, PDF p. 7).
- **NULLs** (§3.2 "About NULL's", PDF p. 10): absorbing for functions, ignored by aggregates except `count(*)`, where a NULL counts as 1; formulae use three-valued logic, with unknown cast to false when a formula filters; NULL equals NULL for grouping.
- **What "correct" means:** the authors followed the ISO Standard as much as possible, testing against PostgreSQL and Oracle (§2.2, PDF p. 3); the Standard's section on aggregates "was of no help" for evaluation contexts (§2.2.2, PDF p. 3). They state the semantics "complies with the Standard" (§3, PDF p. 6).
- LIMIT and window functions are not discussed; `order by` is future work (§5, PDF p. 12).

## Approach

- **Probing engines (§2.2, Fig. 1, PDF pp. 3–5).** Q1–Q5 show NULL behaviour. Q7–Q14 group an outer table t1 by its column a1 and, in a subquery, an inner table t2 by a2 (b1, b2 are their other columns), to find which group an aggregate in the subquery ranges over.
- **Facts 1–4 (§2.2.2, PDF p. 5).** With an inner and an outer group in scope, SQL splits one of them, and the expression under the aggregate decides which (Fact 1); so in the same environment `1+0*a2` equals `1` under the aggregate and `1+0*a1` does not: "under aggregates, in SQL, usual arithmetic equalities are no longer valid" (Fact 2); two aggregates in one expression can range over different groups (Fact 3); in Q11, an aggregate over an inner and an outer grouping column splits the inner group and collapses the outer one to any of its tuples (Fact 4). Q13, with non-grouped columns of two levels under one aggregate, "is not well formed according to the Standard, thus, is not evaluated", and Q14 is also ill-formed (PDF p. 5).
- **The context rule (§2.3, PDF pp. 5–6; §3.2 and Fig. 6, PDF pp. 7–8).** A constant uses the innermost level's tuples. Otherwise a level is "a suitable candidate" when the expression is built on that level's attributes plus the outer levels' grouping expressions (all of a level's attributes if it has no GROUP BY, footnote 4, PDF p. 6), and the outermost suitable level's group is split, its tuples combined with one fixed tuple per outer level; an expression using a non-grouped expression of an outer level is not well-formed.
- **The Coq semantics (§3.2, Fig. 5–8, PDF pp. 6–10).** A SELECT block takes the product of its FROM items, filters by WHERE, partitions by GROUP BY, filters groups by HAVING with the group pushed on the environment, and applies SELECT.
- **SQLAlg and the translations (§4, PDF pp. 10–11; Fig. 9–12, PDF pp. 12–13).** The algebra adds an empty-tuple query to these operators; δ (for DISTINCT), semi-join, anti-join and, given a null value, outer joins are derived (Fig. 10, PDF p. 12). Translating the empty tuple back to SQL assumes the schema has a table (§4.3, PDF p. 11).
- **Theorem 4.3 (§4.3, PDF p. 11).** For a well-sorted database and every environment: a well-formed SQLCoq query translated to SQLAlg gives the query's result, and any SQLAlg query translated to SQLCoq gives the algebra query's result. The proof is a mutual induction (queries and formulae together, as each contains the other) on their size, 500 lines of Coq, with a [tactic](#/glossary/tactic) automating the size-decrease proofs; well-formedness "essentially ensures that Cartesian product and natural join coincide".

## Results

No experiments.
- **Thm. 4.3** (PDF p. 11): SQLCoq and SQLAlg agree both ways, under its conditions.
- **Engine agreement** (§2.2.2, PDF p. 4): on Figure 1's queries, "we obtained the same results on all three systems" (PostgreSQL, Oracle, their semantics).
- **Algebraic equivalences:** the authors say they "recover the well-known algebraic equivalences presented in textbooks upon which are based most of optimisations used in practice", proven in Coq in [3] (§5, PDF p. 12).
- **Lessons** (§5, PDF p. 11): adding bags to an earlier set-only version was "not so problematic"; "What was really challenging was to accurately and faithfully handle correlated sub-queries".

## Limits the authors state

- The translations are sound (preserve results) provided they are applied to "reasonable" database instances and queries: well-sorted instances and, from SQL to algebra, well-formed queries (§4.3, PDF p. 11).
- SQLCoq "slightly differs" from SQL: the full SELECT … HAVING block is mandatory, renaming is explicit unless `*` is used, and query aliases are replaced by renaming (§3.1, PDF p. 6).
- Set operators get bag semantics "even if our notations do not explicitely mention all"; duplicate elimination recovers set semantics (§3.2, PDF p. 10).
- Outer joins need a null value: "provided that a null value be defined" (§4.2, PDF p. 11).

## Open problems and building blocks

  - A Coq-verified compiler for SQL (§1, PDF p. 1; §5, PDF p. 12).
  - Extending the semantic analyser (the compiler stage that works out what a query means) "to features like order by" (§5, PDF p. 12).
  - "What remains to be done is to address the logical optimisation part of the compiler." (§5, PDF p. 13)
  - The Figure 1 queries, "augmented with others not listed in this article, could serve as a benchmark for testing SQL's other implementations" (§5, PDF p. 12).
- **Released:** Nothing stated; the paper prints Coq excerpts (Fig. 2–10, PDF pp. 7–12).
- **To reuse it:** Coq and its extraction to OCaml (abstract, PDF p. 1); the fragment of §3 (PDF p. 6); well-sorted databases and, from SQL to algebra, well-formed queries (Thm. 4.3, PDF p. 11).

## On this site

- **Discussed in:** [Refuting faulty rewrite rules](#/challenges/faulty_rewrite_rules) · [SQL features that verifiers don't cover](#/challenges/verifier_coverage_gaps)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/itp-sql">itp-sql</a></span>
