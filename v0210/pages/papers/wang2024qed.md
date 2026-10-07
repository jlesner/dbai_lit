# QED: A Powerful Query Equivalence Decider for SQL

**QED** · PVLDB 17(11) 2024

Read: [PDF](https://www.vldb.org/pvldb/vol17/p3602-wang.pdf) · [DOI](https://doi.org/10.14778/3681954.3682024)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Q-expressions (semiring semantics), with SMT used in normalization and unification; NULLs, keys and foreign keys modelled.
- Complete for a fragment "with respect to an oracle that can decide satisfiability in the theory T" (§1, PDF p. 1); incomplete otherwise.
- It reports proving "more than 2×" the cases of the prior state-of-the-art solver on its new Calcite and its CockroachDB pairs (abstract; vs. SPES, Tab. 1); no ORDER BY/LIMIT, "limited support for aggregations" (PDF p. 11).

## In plain words

Optimizers rewrite queries into faster ones that must return the same rows, duplicates included. The authors say prior automated checking "only supports a limited number of query features" (abstract, PDF p. 1). QED turns each query into a formula counting, for every possible row, how often it appears in the result, then simplifies and compares them with logic solvers. It models keys, foreign keys, missing values (NULLs) and unknown operators. For queries built only from tables, literal rows, filters, projections, joins and unions, the authors prove the check finds every equivalence, assuming a solver that always decides a logic holding the queries' values and conditions plus at least equality, unknown functions and predicates, an ordering of each kind of value, whole-number addition and if-then-else (§4, PDF pp. 5–8). On rewrite tests from the Calcite optimizer framework and the CockroachDB database, they report proving 299 of 444 and 979 of 1,287 pairs, "more than 2×" what the prior best solver proves (abstract, PDF p. 1). They present their approach as "capturing and vastly improving upon prior work" (§1, PDF p. 2).

## Background and terms

**Terms to know:** [query equivalence](#/glossary/query-equivalence) · [bag semantics](#/glossary/bag-semantics) · [first-order logic](#/glossary/first-order-logic) · [SAT and SMT solvers](#/glossary/sat-and-smt-solvers) · [uninterpreted function](#/glossary/uninterpreted-function) · [soundness and completeness](#/glossary/soundness-and-completeness) · [integrity constraint](#/glossary/integrity-constraint) · [NULL and three-valued logic](#/glossary/null-and-three-valued-logic) · [semiring semantics](#/glossary/k-relation-and-semiring-semantics)

**The paper's own terms:**
- **Q-expression**: an expression whose value is a multiplicity (a natural number or infinity); a query means the function from each possible row to its multiplicity in the result (§3.2, PDF p. 4).
- **[P], squash, Σ**: [P] is 1 when condition P holds, else 0, so multiplying by it filters; squash caps a multiplicity at 1, modelling duplicate removal and uniqueness; Σ is an unbounded sum, used for projection (§2, PDF p. 2; §3.2, PDF p. 4).
- **Oracle**: a solver deciding satisfiability in a first-order theory T (§4, PDF p. 5).
- **Complete fragment** (Def. 1, PDF p. 5): queries built from tables, literal rows, filters, projections, joins and unions, with values, projections and filter conditions definable in T; primary keys allowed.
- **SNF, LNF, SPNF**: SNF (scoped normal form) is a sum of terms, each nested sums over table-drawn variables around a table-free condition; LNF (linearized normal form) also makes each table's variables distinct and ordered (Defs. 2–3, PDF pp. 5–6). SPNF (sum–product normal form), for the general algorithm, allows tables anywhere in a term (Def. 4, PDF p. 8).
- **Stabilization** (§5.2, PDF p. 9): dropping a summation variable that the term's condition makes equal to an expression in the other variables.

**Missing glossary terms:**
- **U-expression**: UDP's formal expression of a result's multiplicities (§1, PDF p. 1); QED's domain is "a model of U-semiring" (§3.2, PDF p. 4), the algebra Cosette uses to axiomatize queries (§1, PDF p. 1).

**Builds on:**
- UDP [7] ([UDP](#/papers/chu2018udp "Axiomatic foundations and algorithms for deciding semantic equivalences of SQL queries (2018)")), the U-expression decision procedure of the Cosette prover [6, 8]; the authors say it relies too much on syntactic equality in many places and models neither NULLs nor outer joins (§1, PDF p. 1).
- SPES [17, 18] ([SPES](#/papers/zhou2020spes "SPES: A Symbolic Approach to Proving Query Equivalence Under Bag Semantics (2022)")), which normalizes queries with rewrite rules, then compares them by SMT: "the current state-of-the-art solver in terms of completeness"; the authors say its primary-key rules miss joins of different tables on primary keys (§1, PDF p. 1).
- Cohen [9] ([Equivalence of Queries That…](#/papers/cohen2009multiplicities "Equivalence of Queries That Are Sensitive to Multiplicities (2009)")): bag equivalence is [decidable](#/glossary/decidable-and-undecidable) for [unions of conjunctive queries](#/glossary/union-of-conjunctive-queries), whose filters must be conjunctions of equalities or inequalities (§1, PDF p. 1); QED's fragment generalizes this (§4, PDF p. 5).
- EQUITAS [17] ([EQUITAS](#/papers/zhou2019equitas "Automated verification of query equivalence using satisfiability modulo theories (2019)")), an earlier checker using SMT (ref. [17], PDF p. 13), compared in Tab. 1 (PDF p. 11).

## Problem and setting

- **Question:** for two queries over the same tables and assumptions, does every row have the same multiplicity in both results on every database satisfying the assumptions (§3.2, PDF p. 4)?
- **Semantics:** bag. Set minus and DISTINCT are modelled; bag minus and multiset intersection are not (footnote 1, PDF p. 3). Other operators can be uninterpreted (§3.1, PDF p. 3).
- **NULLs:** an operation returns NULL when an argument is NULL, except AND, OR, subquery comparisons (IN, SOME) and COUNT(*) against COUNT(k) (§3.4, PDF p. 5).
- **Complete algorithm:** T contains at least equality with uninterpreted functions and predicates; on every sort (type of value) of T a total order is definable in the oracle, which also supports natural-number addition and if-then-else (§4, PDF p. 5).
- **General algorithm:** the oracle may answer unknown (§5, PDF p. 8); tables hold each row finitely often, "to better reflect real-world usage" (§5.3.3, PDF p. 10).
- **Benchmarks** (§6.1, PDF pp. 10–11): input queries and expected rewrites from Calcite [2] and CockroachDB [15] tests: UDP's 232 pairs from an older Calcite (Calcite – Old), 444 non-trivial pairs from Calcite v1.32.0 (Calcite – New), 1,287 non-trivial CockroachDB pairs.

## Approach

- **Pipeline** (Fig. 1, PDF p. 3): queries and constraints become Q-expressions, then are normalized, linearized (complete fragment) or stabilized (the rest), and unified; the last two steps call the SMT solver.
- **Constraints** (§3.3, PDF pp. 4–5): a primary key replaces the table by a set of keys plus a function from key to other columns, which the authors say is complete, unlike SPES's rules. A foreign key becomes one global formula the solver unfolds lazily, avoiding, the authors say, UDP's non-termination on tables referencing each other. CHECK constraints become row assumptions.
- **Complete algorithm** (§4, PDF pp. 5–8): Alg. 1 builds the SNF; Alg. 2 splits each term by every combination of orderings, ties included, of each table's variables; Alg. 3 groups terms by the tables they sum over and asks the oracle whether each group's conditions give the same count.
- **Completeness theorem** (§4.4, PDF p. 7): for two queries of the fragment under the same context (tables and assumptions), if they are equivalent, normalize–linearize–unify answers equal, relative to an oracle deciding T under the assumptions above. The proof (PDF pp. 7–8) turns a failed comparison into databases where the two sides differ. With an incomplete oracle, Alg. 3 "would still be sound" (footnote 2, PDF p. 5).
- **General algorithm** (§5, PDF pp. 8–10):
  - Alg. 4 (PDF p. 8) builds the SPNF; rules after it turn nonzero tests into plain logic for the oracle (PDF p. 9).
  - Alg. 5 (PDF p. 9) stabilizes using the solver's congruence classes (groups of expressions it finds equal). Syntax-Guided Synthesis (SyGuS [1]), synthesizing the function directly, may find dependencies congruence misses, but the authors found both "equally powerful in our evaluation" and chose congruence for "implementation ease" (§5.2, PDF p. 9).
  - Alg. 6 drops provably empty terms and matches terms one to one, trying up to 24 orderings of summation variables; "only about 2% of cases in our evaluation dataset" need more than the first (§5.3.1, PDF p. 9). Aggregates and other higher-order operators (taking a subquery) become fresh variables (new unknowns), compared recursively assuming at least one of the two terms' conditions holds; this carries outer conditions into subqueries (§5.3.2, PDF p. 10).
- **Implementation** (§6, PDF p. 10): 2,520 lines of Rust; each formula goes to the SMT solvers cvc5 and z3 in parallel, taking the first answer, with a 60-second default timeout.

## Results

- **Against SPES** (Tab. 1, PDF p. 11): QED proves 147 pairs against SPES's 95 on Calcite – Old, 299 against 121 on Calcite – New and 979 against 325 on CockroachDB. "all test cases provable by SPES are also provable by QED" (§6.1, PDF p. 11).
- **Complete fragment:** "33% of the provable Calcite cases lies within the complete fragment, while 67% does so for CockroachDB" (§6.1, PDF p. 11).
- **Against UDP:** on Calcite – Old, with UDP's numbers taken from [7], QED "can prove 3.32× more cases and prove each case 67% faster on average" (§6.1, PDF p. 11).
- **Run time** (Tab. 2, PDF p. 11): on pairs both prove, QED's average is 1.53 s against SPES's 0.99 s (Calcite – New) and 0.16 s against 0.03 s (CockroachDB), "although the slowdown is within one order of magnitude" (§6.1, PDF p. 11).
- **Failures** (Tab. 3, PDF p. 11): aggregates are the largest group on Calcite (96 pairs), custom operators on CockroachDB (152); the others are [list semantics](#/glossary/list-semantics) and typing.
- **Cases SPES fails** (§6.3, PDF p. 12): in one, a SPES rule "unsoundly rewrites the left join in Q2 into a cross join when it sees the join condition is TRUE"; in the other, SPES's self-join rule does not apply.

## Limits the authors state

- The general algorithm is incomplete; the complete one "can only handle a subset of queries defined in Sec. 3" (§5, PDF p. 8), and its completeness "relies on the oracle O being complete" (footnote 2, PDF p. 5).
- "Supporting the bag variants requires some ordering/monus operator at the semiring level, which we don't introduce in our formalism" (footnote 1, PDF p. 3); a monus is subtraction that stops at zero.
- Congruence-based stabilization "can theoretically miss cases if the solution is absent as an expression already in the term" (§5.2, PDF p. 9).
- From the failures (§6.2, PDF pp. 11–12): only "common operators for SQL" are modelled; ordering semantics of LIMIT, OFFSET or ORDER BY are unsupported; the normal form's design has "limited support for aggregations"; SMT solvers "do not currently reason about type casting", so implicit casts cause type-mismatch errors.
- QED "does perform slower than SPES on the commonly provable cases" (§6.1, PDF p. 11).

## Open problems and building blocks

- **Open:** none stated. Related work suggests that if an optimizer's code base is trusted, "a simple verifier can make use of those query optimizers for the normalization process" (§7, PDF p. 12).
- **Released:** "The source code, data, and/or other artifacts have been made available" (PVLDB Artifact Availability box, PDF p. 1).
- **To reuse it:** queries in the Fig. 2 grammar (PDF p. 3); cvc5 and z3 (§6, PDF p. 10).

## On this site

- **Discussed in:** [Can SQL equivalence checkers be trusted?](#/challenges/checker_soundness) · [Canonical forms for queries](#/challenges/query_canonical_forms) · [Query equivalence: prove or refute](#/challenges/query_equivalence) · [Equivalence under schema constraints](#/challenges/schema_constrained_equivalence)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/prove-smt">prove-smt</a></span>
