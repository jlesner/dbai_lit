# Cosette: An Automated Prover for SQL

**Cosette** · CIDR 2017

Read: [Paper](https://www.cidrdb.org/cidr2017/papers/p51-chu-cidr17.pdf)  
Code: [Cosette](https://github.com/uwdb/Cosette)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Automated SQL prover: a Rosette/SMT bounded search for counterexamples plus a Coq prover for equivalence.
- Covers conjunctive, correlated, outer-join and aggregate queries; reproduces the COUNT bug and real optimizer bugs.
- Pairs bounded refutation with unbounded proof; VeriEQL runs its bounded engine, sped up by [Speeding up symbolic reasoning…](#/papers/wang2018symbolic "Speeding up symbolic reasoning for relational queries (2018)"), as a baseline ([VeriEQL](#/papers/he2024verieql "VeriEQL: Bounded Equivalence Verification for Complex SQL Queries with Integrity Constraints (2024)")).

## Problem and setting

Decide whether two SQL queries return the same result on every instance; answers are "equivalent", "inequivalent" or "unknown" (§2, PDF p. 2). Relations without given contents are *symbolic*: schemas inferred from referenced attributes, distinct names assumed distinct; predicates may be symbolic too, to state rewrite rules (§2, PDF p. 2). Bag semantics (§3.1, PDF p. 3). Undecidable, via Trakhtenbrot's theorem (§1 footnote 1, PDF p. 2). NULL encoding is not described.

## Approach

- **Counterexamples (§3, Fig. 2, PDF pp. 2–4).** Tuples are integer lists; a relation is a list of (tuple, multiplicity) pairs, symbolic ones of fixed size (§3.1, PDF p. 3). Queries compile to Rosette functions; correlated subqueries take the outer tuple as parameter, grouping becomes correlated aggregates (§3.2, PDF p. 3). The solver seeks a model of Q1 ≠ Q2 in the resulting SMT-LIB constraints, growing relation sizes until success or timeout (§3.3–3.4, PDF p. 4).
- **Proofs (§4, PDF pp. 4–5).** A relation is a function Tuple → ℕ (after K-relations); queries become *UniNomials* over +, ×, Σ and truncation ‖·‖ (§4.1–4.2, PDF p. 4), in Coq with univalent types (footnote 4). A generated script splits the goal (§4.3, PDF p. 4; Fig. 4, PDF p. 5); new tactics HoTTRing, Congruence, CQSolve (conjunctive queries), DeductSolve (set-valued queries) (§4.4, PDF p. 5).
- **Interaction (§5, PDF p. 5).** The solver tries to falsify unproved subgoals; users add lemma-library proofs.

## Results

Prototype: 3k lines of Rosette, 2k of Coq (§6, PDF p. 5). The authors report (Fig. 5, PDF p. 5):
- counterexamples for all inequivalent pairs (3 Bugs, 5 Exams, 9 XData mutants), average times under 1 s to 8.8 s;
- 17 of 23 Rules proved automatically, 6 interactively; 7 automatic ones by CQSolve (§6, PDF p. 6);
- 3 of 4 equivalent Exams pairs automatic, 1 interactive.

Case studies (§6.1–6.2, PDF p. 6): COUNT-bug counterexample in 2 iterations; Oracle 12c outer-join bug; magic-set semijoin rewrite proved with a manual lemma.

## Limits the authors state

- An automated SQL prover "will never be complete" (§1, PDF p. 2); proof search cannot be "completely automatic" (§4.4, PDF p. 5).
- Strings modelled as integers, no floating point (§3.1, PDF p. 3); no LIKE, no ORDER BY (§3.2, PDF pp. 3–4).
- The solver checks only bounded sizes, so cannot validate equivalence (§4, PDF p. 4).
- The magic-set rewrite "cannot be done automatically" (§6.2, PDF p. 6).

## On this site

- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/bounded-smt">bounded-smt</a><a class="tag sub" href="#/tags/cex-smt">cex-smt</a><a class="tag sub" href="#/tags/itp-sql">itp-sql</a><a class="tag sub" href="#/tags/prove-itp">prove-itp</a><a class="tag sub" href="#/tags/prove-smt">prove-smt</a><a class="tag sub" href="#/tags/rules-verify">rules-verify</a></span>
