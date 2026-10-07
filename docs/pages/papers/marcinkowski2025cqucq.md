# Bag Semantics Query Containment: The CQ vs. UCQ Case and Other Stories

**Bag Semantics Query Containment** · PACMMOD 2025

Read: [PDF](https://arxiv.org/pdf/2503.07219) · [arXiv](https://arxiv.org/abs/2503.07219) · [DOI](https://doi.org/10.1145/3767711)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Turns a UCQ into a CQ so containment questions transfer.
- Bag containment of a CQ in a UCQ is decidable iff it is for CQs (Theorem 1; its proof fails with constants); UCQ-in-CQ (Theorem 2) and (1+ε)·β_s ≤ β_b for CQs (Theorem 3) are undecidable over non-trivial databases (`:302–319`); cited by [Few Rows Tell Them Apart](#/papers/cohen2026fewrows "Few Rows Tell Them Apart: Equivalence of Queries Mixing Set and Bag Semantics (2026)").
- More of the bag-containment frontier around SQL's semantics.

## Problem and setting

QCP^bag asks, for a "small" query Ψs and a "big" query Ψb, whether Ψs ➋ D ≤ Ψb ➋ D for every structure D, written Ψs ≤∀ Ψb (§2). For a CQ ϕ, ϕ ➋ D = |Hom(ϕ, D)|; for a UCQ it is the sum over disjuncts (§2). The open target is QCP^bag_CQ, "one of the most intriguing open problems in database theory" (abstract). The paper asks what happens when one side is a UCQ, and how close a CQ-only undecidability proof gets (§3).

Assumptions:
- Queries are Boolean CQs or UCQs, and the signature Σ may contain constants, which the authors say covers non-Boolean queries (§2, §4.1).
- Structures are sets: "bag-set semantics, not bag-bag semantics" (§2).
- A query is *pleasant* if every atom contains a variable (Def. 8). This matters only when Σ has constants (footnote 6).
- A structure is *non-trivial* if it has constants ♂ (Mars) and ♀ (Venus) with ♂ ≠ ♀. ≤∀^nt quantifies over non-trivial structures only (§2). Without this, the one-element "well of positivity" lets a multi-disjunct UCQ beat any CQ "for trivial reasons" (§3).
- Undecidability comes from variants of Hilbert's 10th Problem (Facts 37, 38, 46). Polynomials are sums of coefficient-1 monomials, which may repeat (§8).

## Approach

**CQ-ization** (Def. 21) turns a pleasant UCQ ϕ1 ∨ … ∨ ϕj into a CQ cq(Φ) over Σ⁺ = Σ ∪ {V, R, ♂, ♀} (Def. 9):
- It adds j "alien" variables that must form an R-clique with ♀ (Def. 16).
- Each alien xi must satisfy ϕi in what it can see. The relativization x ↠ ϕ is ϕ ∧ Planet(x) ∧ V(x, y) for each variable y of ϕ (Def. 18).

Homomorphisms are counted by *trips*, the placements of aliens on planets (Def. 23). cq(Φ) ➋ D is a sum over trips (Lemma 24) of products of ϕi ➋ seen(h(xi), D) (Lemma 25). On *good* (Def. 12) and *♀-foggy* (Def. 14) structures, an alien left on ♀ contributes exactly 1 (Lemmas 13, 20). *Marsification* mr(D) adds a planet ♂ that sees all of D (§6.5), giving cq(Φ) ➋ mr(D) = 1 + Φ ➋ D (Lemma 26, App. A). So counterexamples transfer to the CQ-ized pair (Corollary 11).

**Theorem 1** (§7). Let γs = Good ∧ cq(ψs) and γb = η0 ∧ cq(Ψb), where η0 = ⋀ V(♀, _) (one conjunct per disjunct of Ψb) gives the b-query a "bonus" on structures that are not ♀-foggy. The proof shows ψs ≤∀ Ψb ⟺ γs ≤∀ γb (Eq. 12), using only trips with at most one alien off ♀ (Lemmas 27, 28). App. B removes the pleasant restriction by a standard construction.

**Theorems 2 and 3.** A polynomial P becomes a UCQ rep(P) with P(Ξ_D) = rep(P) ➋ D (Def. 33, Lemma 34), "the same as in [IR95]" (§3). Each planet sees its own valuation (Lemma 36).
- Theorem 2 (§9) reduces from Fact 37. Φs evaluates Ps on Mars, ϕb = cq(rep(Pb)), and Lemma 26 supplies the "+1".
- Theorem 3 (§10) CQ-izes both sides: βs = Good ∧ Planet(♂) ∧ cq(rep(Ps)) and βb = η1 ∧ cq(rep(Pb)).
  - Fact 38 adds c = 1 + ε and a rational ¢ with c > ¢ > √c and ¢ · Coef(M, Ps) ≤ Coef(M, Pb) for every monomial M.
  - Structures that are not "very good" are handled by η1 ≥ 2 (§10.3).
  - Trips with two or more aliens away (§10.5) are grouped by the set A of destination planets and the monomial each planet receives. Both sides take equal values per trip (Lemma 44), and the trip counts satisfy c · t_s ≤ t_b (Lemma 45), since |A| ≥ 2 gives "¢·¢ > c" (§10.5).

## Results

Theory only; no experiments. All are the authors' claims.
- **Theorem 1** (§3; proof §7, App. B–C). They call it "quite a surprising observation" (§3).
- **Theorem 2** (§3; proof §9). They note it already follows from [MO24], an observation that "escaped the attention" of [MO24]'s authors (§3, footnote 4).
- **Theorem 3** (§3; proof §10, App. D–G).
- **Corollary 4** (§3): with ε = 1, (ϕs ∨ ϕs) ≤∀^nt ϕb for CQs is undecidable, so two disjuncts suffice.
- **Corollary 5** (§3): ≤∀ for Boolean CQs with at most one inequality each is undecidable, "one of the main results of [MO24]". It is derived from Theorem 3 at ε = 1.
- They rederive [IR95]'s undecidability of QCP^bag_UCQ (§8). They also claim to "easily reproduce all the results from [JKV06], [MO24]" (§3).

## Limits the authors state

- The ε = 0 case, QCP^bag_CQ itself, is open: "technical difficulties which stopped us one infinitely small ε before reaching this ultimate goal" (§3; the abstract says the same). Also, it "would need to really be undecidable" (§3).
- Theorem 1 "is not a negative result" (§3).
- Non-triviality "is crucial, because (1+ε) ≰ 1" (§3). Theorem 2's proof "needs Φs to be a UCQ with potentially unbounded number of disjuncts" (§3).
- ♀ and ♂ could be traded for free variables "using the argument from [MO24]" (§4.1). This is not done here.
- The results "in principle remain true for bag-bag semantics (but the notational complexity increases)" (§2).
- Constants have "downsides", namely Def. 8 (§4.1), and Lemma 26 needs pleasantness (§6.5).
- §10.1 assumes ε ≤ 1, "not crucial, we could easily live without it" (§10.1).

## On this site

- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/theory-bag">theory-bag</a></span>
