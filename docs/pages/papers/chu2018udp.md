# Axiomatic foundations and algorithms for deciding semantic equivalences of SQL queries

**UDP** · PVLDB 11(11) 2018

Read: [PDF](https://arxiv.org/pdf/1802.02229) · [arXiv](https://arxiv.org/abs/1802.02229) · [DOI](https://doi.org/10.14778/3236187.3236200)  
Code: [Cosette](https://github.com/uwdb/Cosette)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- U-semirings: semiring semantics with unbounded summation and duplicate elimination, implemented in a proof assistant.
- Equivalence checker: sound for SQL with keys, foreign keys, views and indexes; claimed complete for UCQs under set or bag semantics without constraints (Thms 5.4–5.5, PDF p. 10; the set-semantics completeness proof fails for redundant unions).
- The algebraic prover EQUITAS, SPES, SQLSolver and QED compare against.

## In plain words

A database optimizer rewrites a query into a faster one; each rewrite must return the same rows as the original on every possible database. The authors write that history suggests missing tools for proving this have caused long-standing bugs, and that many newer systems lack the resources to check every rewrite (§1). They turn each SQL query into an algebraic expression (a U-expression) governed by a few equations, write keys and foreign keys as equations too, and build an algorithm, UDP (U-expression Decision Procedure), in the Lean proof assistant that puts both expressions in a standard form and searches for a match (§1). On rules from research papers and from the open-source optimizer Apache Calcite whose SQL features it supports, it reports proving 62 of 68 correct ones and failing "as intended" on the one expressible wrong rule (§1). They claim it is sound in general and complete for unions of join-and-equality queries under set or bag semantics (§1). They call it, "To the best of our knowledge", the first implemented algorithm for such queries with integrity constraints (§5).

## Background and terms

**Terms to know:** [query equivalence](#/glossary/query-equivalence) · [bag semantics](#/glossary/bag-semantics) · [set semantics](#/glossary/set-semantics) · [conjunctive query](#/glossary/conjunctive-query) · [union of conjunctive queries](#/glossary/union-of-conjunctive-queries) (UCQ) · [integrity constraint](#/glossary/integrity-constraint) · [proof assistant](#/glossary/proof-assistant) · [soundness and completeness](#/glossary/soundness-and-completeness) · [semiring and K-relation](#/glossary/k-relation-and-semiring-semantics)

**The paper's own terms:**
- **U-semiring**: a commutative semiring plus an unbounded sum over all tuples of a schema (models projection), squash ‖x‖ (models `DISTINCT`) and `not` (models `NOT EXISTS`), each governed by a few identities taken as axioms (Def. 3.1, §3.1).
- **U-expression**: what a query is translated into; it gives each candidate output row its multiplicity. Unlike K-relations, a table need not have finitely many rows with nonzero multiplicity (§3.2).
- **Mixed set/bag semantics**: "the bag semantics that allows explicit DISTINCT on arbitrary subqueries" (§1, footnote 1).
- **U-equivalent**: U-expressions equal in every U-semiring and every interpretation of the tables that satisfies the key and foreign-key constraints, with views inlined (Def. 4.6). The paper calls this "equivalence" "when the context is clear".
- **Integrity constraints**, here: keys, foreign keys, views and indexes (§4). An index is a view that projects the key and the indexed attribute (§4.1).
- **SPNF** (Sum-Product Normal Form): a sum of terms, each a sum over tuple variables of a product of predicates, one squashed part, one negated part and table lookups (Def. 3.3); **canonical form** is SPNF after rewriting with the constraints (§5.1).

**Builds on:**
- K-relations (§2; [Provenance Semirings](#/papers/green2007provenance "Provenance Semirings (2007)")).
- The authors' earlier prover Cosette, which models SQL in the Coq proof assistant with a semiring from Homotopy Type Theory (a foundation of mathematics); they say this makes it hard to extend and that it lacks foreign keys (§1; [HoTTSQL](#/papers/chu2016hottsql "HoTTSQL: proving query rewrites with univalent SQL semantics (2017)")). Its counterexample finder is the "complementary task" (§1; [Cosette](#/papers/chu2017cosette "Cosette: An Automated Prover for SQL (2017)")).
- Classical UCQ equivalence tests: Sagiv and Yannakakis for set semantics (§5.2; [Equivalences Among Relational Expressions…](#/papers/sagiv1980union "Equivalences Among Relational Expressions with the Union and Difference Operators (1980)")), cited with Cohen, Nutt and Serebrenik for bag semantics (proof of Thm. 5.4).
- The [chase](#/glossary/chase)/back-chase procedure, which finds a minimal equivalent conjunctive query under constraints (§7); `canonize` resembles it (§1, §5.1; Popa et al., not listed here).

## Problem and setting

- **Question:** can a program prove automatically that two SQL queries agree on every database satisfying the declared keys, foreign keys, views and indexes?
- **SQL fragment** (Fig. 2): `SELECT`, `FROM`, `WHERE`, `UNION ALL`, `DISTINCT`, predicates with `=`, `NOT`, `AND`, `OR`, `EXISTS`, and user-defined functions and aggregates; aggregates are [uninterpreted functions](#/glossary/uninterpreted-function) (§3.2). `GROUP BY` is de-sugared into a correlated subquery (§3.2).
- **Semantics:** mixed set/bag, "the semantics that most real-world database systems use" (§5).
- **Correctness:** U-equivalence. The authors argue it is sound (U-equivalent queries are equivalent over the natural numbers) but not complete: for example, queries equal on all finite databases but not on infinite ones are not U-equivalent (§4.2 "Discussion").
- **Benchmarks** (§6.2): 29 literature rules (6 rules claimed valid only under constraints, from papers at SIGMOD (a major database conference), technical reports and blogs; 23 proved interactively in the authors' earlier work); 232 query pairs from Calcite's test cases, with table names generalized; 3 documented bugs.

## Approach

- **Translation** (§3.2, App. B–C): a table becomes its multiplicity function, a join a product, a projection a sum over all tuples, `DISTINCT` and `EXISTS` a squash, `NOT EXISTS` a `not`. Two equality axioms (Eqs. 13–14) and a summation axiom yield the rule that removes a summation (Eq. 15, footnote 5).
- **Axioms** (Def. 3.1): "Our core contribution is identifying the minimal set of axioms for U-semirings that are sufficient to prove sophisticated SQL query equivalences" (§1), since the number of axioms sets the size of the trusted code base (code that is trusted, not machine-checked). Orders and complete semirings are left out to keep the axioms few (§3.1).
- **Normal form:** every U-expression can be rewritten, using only the axioms, into an SPNF expression equal to it in every U-semiring (Thm. 3.4, §3.3).
- **Constraints as identities** (§4.1):
  - If R.k satisfies the key identity (Def. 4.1) over the natural numbers, R.k is a standard key (Thm. 4.2).
  - Under the key identity, a sum over R's rows with key value e, times any predicate and any squashed expression, is unchanged by squashing (Thm. 4.3).
  - If S.k′ and R.k satisfy the foreign-key identity (Def. 4.4) over the natural numbers, R.k is a standard key in R and S.k′ a standard foreign key to R.k (Thm. 4.5).
- **UDP** (§5.1–5.2, Alg. 1–4):
  - `canonize` (Alg. 1) adds transitive equalities, removes summations, and repeatedly applies the key identity, Thm. 4.3 and the foreign-key identity.
  - UDP (Alg. 2) requires equal numbers of terms and searches for a pairing of terms that TDP (below) accepts.
  - TDP (Decision Procedure for Terms, Alg. 3) searches for a one-to-one renaming of summation variables that makes two terms identical; predicates are compared by the Nelson–Oppen congruence procedure (grouping equal variables and function applications), squashed parts by SDP, negated parts by UDP.
  - SDP (Decision Procedure for Squashed Expressions, Alg. 4) removes nested squashes (Lemma 5.1), canonizes, minimizes each term with the axioms (drops redundant tuple variables, Ex. 5.2), and checks that each minimized term has an equal one on the other side; the authors say this makes it "sound and complete for squashed expressions derived from UCQs" (§5.2).
- **Theorems** (§5.3):
  - If Alg. 2 returns true for a pair of SQL queries, the pair is equivalent under standard SQL semantics (Thm. 5.3).
  - Alg. 2 is complete for UCQs evaluated under bag semantics (Thm. 5.4).
  - Alg. 2 is complete for UCQs evaluated under set semantics (Thm. 5.5); the proof appeals to a [homomorphism](#/glossary/homomorphism-containment-mapping) check.
- **Example** (§5.4): a rewrite from Starburst's optimizer (an IBM research database system) mixing set and bag semantics under a key; "To the best of our knowledge, this is the first time that this rewrite rule is formally proved to be correct."
- **Implementation** (§6.1): parser (440 lines of Haskell), converter (202 lines of Lean) and axioms (129 lines of Lean) form the trusted code base. Lean guarantees a true answer means equivalence "according to our U-semiring semantics".

## Results

All are the authors' claims.
- **Overall:** UDP "can automatically prove 62 of 68 correct ones and fail as intended on the 1 buggy one" (§1; Fig. 5).
- **Literature:** all 29 rules proved (Fig. 5).
- **Calcite:** of 232 pairs, 39 use supported features and 33 of those (85%) are proved; of the 6 unproved, 5 involve integer arithmetic and string casting, and one, with two very long queries, gave no result in 30 minutes (§6.2).
- **Bugs:** UDP fails to prove the COUNT bug (a wrong rewrite of nested `COUNT` queries; [Optimization of Nested SQL Queries Revisited](#/papers/ganski1987nested "Optimization of Nested SQL Queries Revisited (1987)")) within 30 minutes, "As expected"; the other two bugs rely on `NULL` semantics, which UDP does not support (§6.2).
- **Run time:** every proved rule within 15 seconds; averages 6,594.3 ms (literature) and 4,160.4 ms (Calcite), longer with constraints, grouping and aggregates, or `DISTINCT` in a subquery (§6.3, Fig. 7).
- **Normal-form size:** exponential growth is possible in theory; measured sizes grew 4.1% on average (literature) and 0.7% (Calcite) (§6.3).
- **Feature breakdown:** Fig. 6 counts proved rules by overlapping categories; §6.3 says many lie beyond UCQ.
- **Against Cosette:** Cosette can express 61 of the 69 rewrite rules UDP proved; 17 of these were proved manually, none automatically (§6.3).

## Limits the authors state

- `CASE`, `UNION` under set semantics, `NULL` and `PARTITION BY` are unsupported, excluding 193 Calcite pairs; "We believe further engineering will enable us to support the majority of the remaining rewrite rules" (§6.4).
- Proving the unproved Calcite example requires modeling integer arithmetic ("undecidable in general"); other rules require string concatenation and string-to-date conversion (§6.4).
- "Our system only proves equivalence"; counterexamples are left to their earlier work (§1).
- `canonize` may not terminate, for example with a cycle in the key/foreign-key graph; "While this is possible in theory, we did not encounter any case that does not terminate" (§5.1).
- "For squashed expressions that represent SQL queries beyond UCQs, SDP is not complete, however, our procedure is still sound." (§5.2)
- U-equivalence is not complete for standard semantics (§4.2).

## Open problems and building blocks

- **Open:** "As future work, we plan to support more SQL features and other non-relational data models such as Hive and Spark." (§8; Hive and Spark: data-analytics systems, §1); arithmetic and string cases: "We leave supporting such cases as future work." (§6.4)
- **Released:** no code release is stated; footnote 10 says "The detailed benchmark queries and rules can be found in [19]", the arXiv version of this paper (§6.2).
- **To reuse it:** the Lean proof assistant; input in the Fig. 2 syntax with schemas and constraints declared (§3.2, §6.1).
- **Beyond its domain:** not claimed.

## On this site

- **Discussed in:** [Can SQL equivalence checkers be trusted?](#/challenges/checker_soundness) · [Refuting faulty rewrite rules](#/challenges/faulty_rewrite_rules) · [Canonical forms for queries](#/challenges/query_canonical_forms) · [Equivalence under schema constraints](#/challenges/schema_constrained_equivalence)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/itp-sql">itp-sql</a><a class="tag sub" href="#/tags/prove-itp">prove-itp</a><a class="tag sub" href="#/tags/rules-verify">rules-verify</a></span>
