# On conjunctive queries containing inequalities

**On conjunctive queries containing…** · J. ACM 35(1) 1988

Read: [DOI](https://doi.org/10.1145/42267.42273)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- CQ containment with <, ≤, = over dense orders needs a finite family of representative databases, one per ordering.
- Minimization via essential constants.
- The test-database family [How Can We Shrink…](#/papers/sternbach2026shrink "How Can We Shrink the Family of Test Databases? Query Containment with Nulls and Comparisons (2026)") shrinks; an early "check a finite family of small DBs" result.

## Problem and setting

The paper studies containment, equivalence and minimization of conjunctive queries extended with comparisons (abstract, PDF p. 1). Klug died during refereeing; D. S. Johnson and M. Yannakakis revised it (first-page footnote, PDF p. 1).

- **Queries** (§2, PDF pp. 2–3). An *inequality query* Q has distinguished variables X_Q (in sequence, the *summary* s), existential variables Y_Q, conjuncts C_Q (atoms over variables only) and *inequalities* L_Q of the form z_1 θ z_2, θ ∈ {=, <, ≤}, over variables and constants (not two constants). K_Q is Q's set of constants, CK_Q those in equalities x = c. Plain conjunctive queries are *equality queries*. The class is stated equivalent to select-project-join algebra with inequality selections and joins (PDF p. 3); unions are *query sets*.
- **Data and semantics** (§2, PDF pp. 2–3). Relations are finite sets of tuples over ℚ; results are said to hold for any totally ordered dense domain. No data dependencies (footnote 1, PDF p. 2). A *valuation* ρ maps variables to ℚ and fixes constants; it is *order preserving* if it satisfies L_Q; Q(D) collects ρ(s) for order-preserving ρ that map every conjunct into D.
- **Normal form** (§2, PDF pp. 3–4). Implied inequalities come from paths in a graph G(L); queries are assumed *reduced* (no derivable inequality kept) and *consistent*.
- **Correctness.** Q_1 ⊆ Q_2 if Q_1(D) ⊆ Q_2(D) for every database D; ≡ likewise (§3, PDF p. 4). Minimization means fewest conjuncts, i.e. fewest joins (§4, PDF p. 9).

## Approach

**Containment (§3, PDF pp. 4–8).** Freezing Q_1 into one database by a one-to-one valuation fails, because distinct rationals always stand in a < relation that L_{Q_1} need not imply (Example 2, PDF pp. 4–5). Valuations are instead grouped by *order equivalence* with respect to a constant set K; one representative r_i per class of order-preserving valuations gives the *representative database set* (rds) D_{Q,K} (PDF p. 5). Lemma 1 (a strictly increasing map fixing K carries one order-equivalent valuation to another), Lemma 2 (such maps commute with evaluation) and Lemma 3 (monotonicity) prove Thm. 1 (PDF pp. 5–6).

The *homomorphism property* (containment iff a homomorphism Q_2 → Q_1 exists that also sends each inequality to one derivable from L_{Q_1}) would put containment in NP (PDF p. 6). For *left (right) semiinterval queries*, with comparisons only of the form x θ c (c θ x), Thm. 2's proof builds one valuation placing each variable inside its bound but above every smaller constant, and reads the homomorphism off it (PDF p. 7).

**Minimization (§4, PDF pp. 9–13).** Guessing an equivalent query with no more conjuncts and checking equivalence needs a finite guess space; variables are bounded, so the question is whether new constants are needed (PDF p. 9). Example 6 shows useless constants (PDF pp. 9–10). Tools: the *perturbation* Q[c → c′], replacing constant c by c′ with set strict/non-strict switches (PDF p. 10); the *canonical interval* Δ_{c,Q}, bounded by Q's nearest constants around c or ±∞ (PDF pp. 10–11); Lemma 5, that a valuation avoiding the values between c and c′ is order preserving for Q iff for Q[c → c′] (PDF p. 11). c is *essential* if some c′ ∈ Δ_{c,Q} gives Q ≢ Q[c → c′] (PDF p. 12); a nonessential one is "slid" into an endpoint of Δ_{c,Q} (PDF p. 13).

## Results

Each is the author's claim; Thms. 1 and 9 are under In brief.

- **Thm. 1** (§3, PDF p. 6): with exponentially many rds databases the algorithm "is not in the complexity class NP"; containment is NP-hard as it generalizes equality-query containment [5].
- **Lemma 4, Examples 3–4** (§3, PDF pp. 6–8; Fig. 1, PDF p. 8): a homomorphism implies containment; the converse fails in general, even for typed queries with disjoint interval-only comparisons (Example 4).
- **Thm. 2** (PDF p. 7): left and right semiinterval queries have the homomorphism property, so their containment is in NP (§5, PDF p. 13).
- **Example 5, Thm. 3** (§3.1, PDF p. 8): a query can be in a union without being in any member; Q ⊆ query set iff each rds database D_i has a member Q′ with r_i(s) ∈ Q′(D_i).
- **Thm. 4** (§3.1, PDF pp. 8–9): for semiinterval queries, containment in a union means containment in some member.
- **Thm. 5** (§4, PDF p. 11): one perturbation applied to two equivalent queries keeps them equivalent (c outside both CK sets, c′ in both canonical intervals).
- **Thm. 6** (PDF p. 12): for c ∉ CK_Q, either every c′ ∈ Δ_c preserves Q or every c′ ≠ c changes it, so one test decides essentiality.
- **Lemma 6, Cor. 6.1, Lemma 7** (PDF p. 12): constants of CK_Q in consistent queries, and a query's only constant, are essential.
- **Thm. 7** (PDF p. 13): nonessential constants can be removed one by one without adding conjuncts.
- **Thm. 8** (PDF p. 13): equivalent consistent queries have the same essential constants.
- **Thm. 9** (PDF p. 13): the minimum-query guess space.
- **§5** (PDF p. 14): containment is stated to be in Π₂ᵖ, Π₂ᵖ-completeness "plausible".

## Limits the authors state

- The results "do not carry over to nondense data domains such as the integers" (§2, PDF p. 2); "many of our proofs rely crucially on this assumption"; non-dense and partial orders are open (§5, problem 5, PDF p. 14).
- No data dependencies are considered (footnote 1, PDF p. 2).
- The algorithm "does not run in even nondeterministic polynomial time"; Π₂ᵖ-completeness is open (§5, problem 1, PDF p. 14), as are further classes in NP or P (problem 2).
- Without the homomorphism property "a different approach must be taken" for an NP algorithm (§3, PDF p. 8).
- Unknown whether a minimum query always lies among the given query's rows, or whether minimizations are isomorphic (§5, problem 3, PDF p. 14).
- No definition or algorithm yet for minimizing unions; disjunctions of inequalities are suggested (§5, problem 4, PDF p. 14).

## On this site

- **Discussed in:** [Query equivalence: prove or refute](#/challenges/query_equivalence)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/bounded-theory">bounded-theory</a><a class="tag sub" href="#/tags/theory-set">theory-set</a></span>
