# The containment problem for &lt;bi&gt;Real&lt;/bi&gt; conjunctive queries with inequalities

**The containment problem for…** · PODS 2006

Read: [DOI](https://doi.org/10.1145/1142351.1142363)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Bag containment of CQs with ≠ is undecidable, by reduction from Hilbert's tenth problem.
- Holds even with one binary relation and a bounded number of ≠'s, and under bag-set semantics (abstract).
- Marks where bounded checking of bag containment can't be complete: for CQs with ≠ there is no computable bound on counterexample size (our inference; plain CQs stay open, §5).

## Problem and setting

- **Question (§1, PDF pp. 1–2).** Under set semantics, containment of conjunctive queries is NP-complete, and with ≠ it is Π₂ᵖ-complete (the paper attributes this to van der Meyden [14]). Under bag semantics the complexity, even the decidability, of plain conjunctive-query containment was open after Chaudhuri and Vardi [4] proved it Π₂ᵖ-hard. The authors study the ≠ extension, partly to build tools for the plain case.
- **Queries (Def. 1, PDF p. 2).** A conjunctive query with inequalities is a rule `Q(x⃗) :– T_1(z⃗_1), …, T_p(z⃗_p)` where each `T_i` is a schema relation or ≠, so "inequality" means ≠ only. Subgoals may repeat and queries must be safe. Views are non-recursive rules over earlier views that unfold into such queries (§2, PDF p. 3).
- **Semantics (§2, PDF p. 3).** Under *bag semantics* the multiplicity of an answer tuple is the sum, over assignments τ that extend it, of the product of the multiplicities `|T_i(τ(z⃗_i))|_D`. *Bag-set semantics* first removes duplicates from the database D, then evaluates under bag semantics.
- **Containment (Defs. 2–3, PDF p. 3).** `Q ⊆_B Q′` means that on every database and every tuple, Q's multiplicity is at most Q′'s, and `⊆_BS` is the bag-set analogue. `ConQC_B(k, m, d)` is the problem for schemas of at most m relations of arity at most d and queries with at most k ≠'s each, with ∞ meaning unbounded. `ConQC_BS(k, m, d)` is the bag-set version.

## Approach

- **Bag vs. bag-set (§3, PDF pp. 4–5).** Thm. 1 gives two polynomial-time reductions: `ConQC_BS(k, m, d) ≤_P ConQC_B(2k, m, d)` and `ConQC_B(k, ∞, ∞) ≤_P ConQC_BS(k, 1, 2)`. The first pairs `Q_1 ∧ Q_1` against `Q_2 ∧ Q_1′`, where Q_1′ is Q_1 with every subgoal doubled, proved by Cauchy–Schwarz. The second replaces each k-ary relation by a view built from directed paths in one binary relation R. Cor. 2 chains them, so undecidability with many relations carries over to a single binary relation.
- **Hilbert's Tenth Problem (§4, PDF p. 5).** Thm. 3 is the form used: for homogeneous degree-d polynomials P_1 and P_2 with the same terms, positive integer coefficients and both divisible by x_1, it is undecidable whether some non-negative integers give `P_1(x⃗) > x_1^d · P_2(x⃗)`. This holds even for d = 5 and n = 59 variables.
- **Polynomial encoders (§4.2, PDF p. 6).** For ξ ∈ ℕ₀ⁿ, a database D_ξ encodes the polynomial's variables, terms and coefficient chains in binary relations. Lemma 4 gives what the ≠-free views `Term`, `Value`, `Coeff_α` and `Coeff_β` return on it. Thm. 5 shows that ≠-free queries Poly_1 and Poly_2 evaluate on D_ξ to P_1(ξ) and ξ_1^d·P_2(ξ). So containment restricted to encoders is already undecidable.
- **Arbitrary databases (§4.3, PDF pp. 7–8).** Adding a sink database gives *augmented encoders* D_ξ^aug, on which the counts become 1 + P_1(ξ) and 1 + ξ_1^d·P_2(ξ) (Lemma 6). *AugDB*, the canonical query of D_0^aug with ≠ between every pair of variables, matches only isomorphic copies of D_0^aug (Lemma 7). Then `Q_1 :– Poly_1, AugDB` and `Q_2 :– Poly_2, CounterCheating`. A map of Poly_1 *cheats* when a non-`Value` subgoal lands outside the matched copy. Lemma 8, the "key technical lemma", says CounterCheating has multiplicity 1 on augmented encoders, and in general at least 1 + γ when γ maps cheat.
- **Lemma 8's proof sketch (§4.4, PDF pp. 8–10).** CounterCheating is AugDB together with seven kinds of `Counter` views, each a copy of Poly_1′ (Poly_1 with chain variables free) plus ≠ constraints. Claim 11 (PDF p. 9) sorts every cheating map into seven classes `N_1 … N_7`. Claim 12 (PDF p. 9) shows each view's multiplicity is at least 1 plus its class size.

## Results

All are the authors' claims.

- **Thm. 1 and Cor. 2 (PDF pp. 4–5):** bag and bag-set containment, with or without ≠, are polynomial-time inter-reducible, and each reduces to a single binary relation, at most quadrupling k.
- **Thm. 9 (PDF p. 7):** `ConQC_BS(k, ∞, ∞)` is undecidable for some k bounded by n^{2d} with n ≤ 59 and d ≤ 5.
- **Cor. 10 (PDF p. 8):** `ConQC_B(k, 1, 2)` and `ConQC_BS(k, 1, 2)` are undecidable for some k with the same bound, "counting the number of inequalities in Q1 and Q2 a little more carefully".
- **Containment vs. equivalence (§1, PDF p. 2):** citing Nutt, Sagiv and Shurin [10], the authors note that bag equivalence of conjunctive queries with ≠ is in PSPACE. They conclude that their result shows "a provable dramatic difference in complexity" between equivalence and containment.
- **Earlier characterization (§1, PDF p. 2):** they report "a subtle counting error" in the proof of a necessary and sufficient condition claimed in [1, 2, 12], with a counterexample in [16].
- **Consequence (§5, PDF p. 10):** "there is no hope of using query containment as a tool to optimize conjunctive queries with inequalities in real database systems".

## Limits the authors state

- Two proofs are deferred to "the full version": the correctness claim behind Thm. 1's second reduction, given only as "a rough intuition", and the derivation of Thm. 3 from Matiyasevich [9] (both PDF p. 5).
- Lemma 8 gets only a proof sketch (§4.4, PDF pp. 8–10). Claim 12's proof works through case N_1 and sketches the last four cases, saying "An analogous proof holds for each of the other cases" (PDF pp. 9–10).
- The bound on the number of ≠'s is "a certain fixed (albeit large) value" (§5, PDF p. 10).
- The reduction makes "heavy use of directed graphs". Decidability when the single binary relation is an undirected graph is left open (§5, PDF p. 10).
- The original question, bag containment of conjunctive queries without ≠, "remains unanswered" (§5, PDF p. 10). Decidable or low-complexity classes defined by syntactic or structural conditions are proposed as future work (same page).

## On this site

- **Discussed in:** [Query equivalence: prove or refute](#/challenges/query_equivalence)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/theory-bag">theory-bag</a></span>
