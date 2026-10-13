# Word Problems Requiring Exponential Time (Preliminary Report)

**Word Problems Requiring Exponential Time** · Preliminary Report (Stockmeyer and Meyer), STOC 1973

Read: [PDF](https://dl.acm.org/doi/pdf/10.1145/800125.804029,) · [DOI](https://doi.org/10.1145/800125.804029)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Pins down the inherent complexity of deciding whether two regular-like expressions (regular expressions over a set of letters, optionally with squaring or complement) describe different sets of words, and of similar word problems for integer expressions, quantified Boolean formulas and the first-order theory of equality, mostly as completeness under log-space or log-linear reductions (§2, table on PDF p. 3).
- Lower bounds come from writing, for a Turing machine and an input, an expression for all words up to a length except the machine's accepting computations (Thm. 3.1, PDF pp. 4–5, with squaring and no star); for plain expressions over {0,1} with union, concatenation and star the table lists inequivalence as log-linear complete in nondeterministic linear space, proved in the authors' earlier paper (§3, PDF p. 4).

## In plain words

Testing whether two regular expressions describe the same strings "has several effective solutions, all of which are computationally inefficient" (§1, PDF p. 1). The authors determine the time or memory any algorithm needs for a family of such word problems (table, PDF p. 3). For two-letter regular expressions with union, concatenation and star, telling two apart is among the hardest problems a guessing machine (one that may choose among several next steps) solves in memory proportional to the input, under cheap, linear-size translations (§3, PDF p. 4; proved in their earlier paper). With squaring instead of star, it is as hard as anything a guessing machine solves in exponential time (Thm. 3.1, PDF p. 4). They present this as characterizing the problems "precisely" (§7, PDF p. 8).

## Background and terms

**Terms to know:** [decidable and undecidable](#/glossary/decidable-and-undecidable) · [NP-complete and the polynomial hierarchy](#/glossary/np-complete-and-the-polynomial-hierarchy) · [PSPACE](#/glossary/pspace) · [3-SAT](#/glossary/3-sat) · [first-order logic](#/glossary/first-order-logic) · [satisfiable and valid](#/glossary/satisfiable-and-valid)

**The paper's own terms:**
- **regular-like expression**: built from letters and the empty string with concatenation (·), union (∪), star (*), complement (¬) and squaring (², E·E) (§2, PDF p. 1).
- **INEQ, MEMBER**: expression pairs, over a given alphabet and operation set, describing different sets; word–expression pairs where the set holds the word (§2, PDF p. 1). **N-INEQ, N-MEMBER**: the same over nonnegative integers, with + (all pairwise sums), ∪, ¬.
- **B_k, B_ω, 1EQ**: Boolean formulas true under k alternating blocks of quantifiers (existential first, then universal); B_ω, their union; 1EQ, the valid sentences of the first-order theory of equality (logic whose only relation is equality) (§2, PDF p. 2). Σ_k^p: level k of the hierarchy, Σ_1^p = NP (§4, PDF p. 5).
- **log-space and log-linear reducibility**: A reduces to B when a log-space function (one using work memory logarithmic in input length) maps members of A exactly to members of B; log-linear also keeps output length within a constant times input length (§2, PDF p. 2).
- **complete in a family**: every member reduces to C, and C is a member (§2, PDF p. 3).

**Missing glossary terms:**
- **regular expression** (Kleene's): only ∪, ·, *.
- **nondeterministic Turing machine** (a model computer that may choose its next step): it accepts if some choices do (§2, PDF p. 2); a class like nondeterministic linear space is what it accepts within that bound (general definition).

**Builds on:**
- Meyer and Stockmeyer [1] (1972): equivalence with squaring needs exponential space (§1, PDF p. 1); its two results with star are proved there (§3, PDF p. 4).
- Cook [3] and Karp [4]: NP; SAT (satisfiability of clauses of three literals) and KNAPSACK (picking numbers that sum exactly to a target), reduced from in §5–6 (PDF pp. 4, 6–8).

## Problem and setting

- **Question:** each word problem's time or space needs on deterministic and nondeterministic Turing machines (§1, PDF p. 1).
- **Assumptions:** alphabets {0,1} or {0}; integers in binary; lower bounds on infinitely many inputs (§2, PDF p. 3).

## Approach

- **Encoding computations (Thm. 3.1, PDF pp. 4–5).** For an exponential-time guessing machine, an input becomes an expression with only ∪, · and ² for all words up to some length except accepting computations (each written out as a string of machine snapshots), as a union of words that "start wrong", "end wrong", "move wrong" or are "too long"; the input is accepted exactly when this differs from the expression for every word up to that length. Such expressions describe finite sets, so decidability is trivial (PDF p. 4).
- **Quantified formulas (Thm. 4.3, PDF pp. 5–6).** A polynomial-space computation becomes a B_ω formula by halving step counts through a quantified midpoint.

## Results

Reductions are log-space unless marked log-linear.
- **Table, over {0,1} (table, PDF p. 3):** ∪, ·, * log-linear complete in nondeterministic linear space; ∪, ·, ², * log-linear complete in exponential space (both from [1], §3, PDF p. 4); ∪, ·, ² log-linear complete in nondeterministic exponential time (lower bound: Thm. 3.1, PDF p. 4); ∪, ·, ¬: space a tower of 2s of height log₂ n log-linear reduces to it (upper bound: height n); ∪, · complete in NP; membership with all five operations in P (deterministic polynomial time).
- **Thm. 4.2 (PDF p. 5):** B_k complete in Σ_k^p for k ≥ 1, earlier "stated and proved in slightly weaker form".
- **Thm. 4.3, Cor. 4.4 (PDF pp. 5–6):** B_ω and 1EQ complete in polynomial space.
- **Thm. 5.1, 5.2 (PDF pp. 6–7):** integer membership with ∪, + complete in NP, inequivalence in Σ_2^p; with ¬, both complete in polynomial space (table, PDF p. 3).
- **One letter (§6, PDF pp. 7–8):** ∪, ·, * complete in NP (Thm. 6.1); ∪, ·, ², ¬ complete in polynomial space; ∪, ·, ¬ in P.

## Limits the authors state

- "Preliminary Report" (title): "Complete proofs will appear in the forthcoming papers" (§1, PDF p. 1); of the {0,1} results, only Thm. 3.1's proof is indicated (§3, PDF p. 4); integer proofs with ¬ are "too long to present here" (§5, PDF p. 6); Thm. 4.1 "stated without proof" (§4, PDF p. 5); Lemma 2.2's proof omitted (PDF p. 3).
- "certain of the word problems considered in this paper are somewhat arbitrarily constructed", and the authors "hesitate to recommend this entire class of problems as an interesting research topic" (§7, PDF p. 8).

## Open problems and building blocks

- **Open:** whether each hierarchy level is properly inside the next, "an open question" (§4, PDF p. 5). One-letter inequivalence with ∪, ·, *, ², ¬ or ∪, ·, *, ¬, conjectured solvable within time a tower of 2s of some fixed height, via Presburger arithmetic (the logic of integer addition); equivalence of polynomial expressions over finite integer sets (§7, PDF p. 8).
- **Released:** Nothing stated.
- **To reuse it:** Nothing stated.
- **Beyond its domain:** their recent studies show their methods "applicable to nearly all of the classical decidability results in logic"; they hope these "will extend to algebra, topology and other areas where decision procedures arise" (§7, PDF p. 8).

## On this site

- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/general-misc">general-misc</a><a class="tag sub" href="#/tags/theory-misc">theory-misc</a></span>
