# Containment of conjunctive queries: beyond relations as sets

**Containment of conjunctive queries** · TODS 20(3) 1995

Read: [DOI](https://doi.org/10.1145/211414.211419)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Containment under "label systems" (sets, bags and more), with homomorphism-type characterizations.
- Bag containment of UCQs is undecidable (Thm 6.2, PDF p. 30); for CQs it stays open (§9, PDF p. 35).
- Green, Karvounarakis and Tannen, who introduced K-relations ([Provenance Semirings](#/papers/green2007provenance "Provenance Semirings (2007)"), Related Work, PDF p. 9), write that "the first attempt at a general theory of relations with annotations appears to be" this paper.

## Problem and setting

When is one conjunctive query contained in another if each tuple carries a label (truth value, certainty factor, multiplicity)? The motivation is SQL optimization, whose results are multisets unless **distinct** is used (§1.1, PDF pp. 2–3). In Example 1.2 (PDF pp. 4–6), SQ3 and SQ4 return the same set of pairs, but SQ3 is contained in SQ4 under multisets and not vice versa.

- **Label system** 𝓛 = ⟨L, ∗, +, 0, ≤⟩ (Def. 2.1, PDF p. 8): ∗ and + associative and commutative; 0 is the additive identity, annihilates ∗, and is least in the partial order ≤.
- **Type A** (Def. 2.2, PDF p. 8): 0 < a ∗ b ≤ a for nonzero a, b; ∗ idempotent; + monotone; a + b ≤ a or a + b ≤ b. Examples: sets (and/or) and certainty factors in [0, 1] (min/max) (Ex. 2.1, PDF p. 9).
- **Type B** (Def. 2.3, PDF p. 9): (B1) a ≤ a ∗ b for nonzero a, b; (B2) + monotone; (B3) every label has a strictly larger one. Example: nonnegative integers with × and +, i.e. multisets (Exs. 2.2–2.3, PDF pp. 9–10).
- A **relation instance** maps every tuple to a label (Def. 2.4, PDF p. 10).
- A **conjunctive query** A₁ ∧ ⋯ ∧ A_m →^f C has only variables as arguments, no recursion, and a unary function f with 0 < f(a) for a ≠ 0, identity if omitted (Def. 2.5, PDF p. 11).
- A valuation θ = ⟨θ_v, θ_l⟩ labels the consequent f(∏ θ_l(A_i)) (Def. 2.6, PDF p. 12); a result tuple's label is the sum over the true valuations producing it (Defs. 2.8–2.9, PDF p. 14).
- **Containment** α ≤_r β: pointwise ≤ on every instance (Defs. 2.10–2.11, PDF pp. 19–20). A union's result is the sum of its members' results (Def. 6.2, PDF p. 27).
- A **homomorphism** h: β → α maps variables, distinguished to distinguished, each atom of β to an atom of α; *onto* if it covers α's atoms, *variable-onto* if it covers α's variables (Def. 2.12, PDF p. 20).

## Approach

Labels stay out of query syntax: an explicit label column fails because it sees one derivation, while a projected tuple's label combines several (PDF p. 17).

- Lemma 3.1 (PDF p. 20): if nonzero labels have nonzero products, containment implies a homomorphism β → α.
- Lemma 3.2 (PDF p. 21): a homomorphism h maps each true valuation θ of α to a true, compatible valuation θ ∘ h of β.
- Sufficiency proofs compare θ's label with θ ∘ h's, then the sums. Type A uses that a sum is bounded by one term (PDF pp. 22–23); type B also needs θ ↦ θ ∘ h one-to-one, which an onto homomorphism gives (PDF pp. 23–25).
- Necessity proofs for type B assume h not onto and build an instance on one constant on which α's label exceeds β's (PDF pp. 25–27).
- Theorem 6.2's proof (PDF pp. 29–32) reduces from a Diophantine variant: is Φ ≤ Ψ for all nonnegative integers? Each monomial becomes copies of a one-variable query with repeated unary atoms, so the union computes the polynomial (Eq. 11, PDF p. 31).

## Results

The authors show:
- Thm. 4.1 (PDF p. 22): type A, assuming a ≤ b ⇒ f_α(a) ≤ f_β(b): α ≤_r β iff a homomorphism β → α exists, which they say "strictly generalizes" Chandra and Merlin (§1.3, PDF p. 7). Cor. 4.1 (PDF p. 23): NP-complete.
- Thm. 5.1 (PDF p. 23): type B, same premise: an onto homomorphism suffices. Prop. 5.1 (PDF p. 25): a homomorphism is necessary.
- Thm. 5.2 (PDF p. 25): if α has no repeated predicates, an onto homomorphism is necessary and sufficient.
- Ex. 5.1 (PDF p. 26) is meant to show a repetition-free β is not enough for type B. Type B′ (Def. 5.1, PDF p. 26) adds a label a with a^k < a^(k+1) for all k ≥ 1.
- Thm. 5.3 (PDF p. 26): type B′, either query repetition-free: onto homomorphism necessary and sufficient, and then every homomorphism β → α must be onto (PDF p. 27). Commercial systems "operate under the semantics of type B (and, in fact, type B′)", so Theorems 5.1–5.3 apply (PDF p. 27).
- Thm. 6.1 (PDF p. 28): type A unions: containment iff each α_i is contained in some β_j; for sets this is Sagiv and Yannakakis's theorem (PDF p. 29). Hence §1.2 calls both single-query and union containment "decidable but NP-complete" for type A (PDF p. 7).
- Thm. 6.2 (PDF p. 30): see In brief.
- Thm. 7.1 (PDF pp. 32–33): type A′ (type A without (A4), Def. 7.1, PDF p. 32; e.g. MYCIN's a + b − a·b, Ex. 7.1): a variable-onto homomorphism suffices.
- §8 (PDF p. 34): Chaudhuri and Vardi independently found Thm. 5.1, Prop. 5.1 and Thm. 5.2 for multisets.

## Limits the authors state

- The type-B sufficient condition "is not necessary, in general" (§5, PDF p. 23; Ex. 5.1, PDF p. 26).
- Single-query type-B containment: is there an exact condition, is it decidable? Chaudhuri and Vardi gave "a lower bound … but not an upper bound"; the authors see "the possibility that the problem is undecidable even for individual queries" (§9, PDF pp. 35–36).
- Theorem 6.2 does not cover every type-B system: "there could be some such label system for which the problem of containment of unions … is decidable" (PDF p. 32).
- Open (§7, PDF p. 33): an exact version of Thm. 7.1; equivalence; unions under other label systems; whether 0 must be both additive identity and multiplicative annihilator.
- Shortest and critical path "are not even label systems" (no multiplicative annihilator); most reliable path is neither type A nor B (Table IX and text, PDF p. 34).
- Recursive queries are not considered (PDF pp. 19, 33). Future work: recursion, a label system for probabilities, use in optimizers (§9, PDF p. 36).

## On this site

- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/theory-bag">theory-bag</a></span>
