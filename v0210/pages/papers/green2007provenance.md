# Provenance Semirings

**Provenance Semirings** · PODS 2007

Read: [PDF](https://dl.acm.org/doi/pdf/10.1145/1265530.1265535) · [DOI](https://doi.org/10.1145/1265530.1265535)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Relations annotated with elements of a commutative semiring (K-relations): sets, bags, lineage and why-provenance are special cases (§2–4).
- RA⁺ on any K-relations factors through provenance polynomials ℕ[X] (Thm 4.3); datalog through formal power series (§5–7).
- The semantics HoTTSQL generalizes ([HoTTSQL](#/papers/chu2016hottsql "HoTTSQL: proving query rewrites with univalent SQL semantics (2017)") § Introduction) and UDP starts from ([UDP](#/papers/chu2018udp "Axiomatic foundations and algorithms for deciding semantic equivalences of SQL queries (2018)") §2: bag-semantics SQL as ℕ-relations); it decides containment only when K is a distributive lattice (Thm 9.2, proof sketch, PDF p. 9) and leaves bags to a conjecture (PDF p. 10).

## Problem and setting

The authors observe "strikingly similar" calculations in query answering over c-tables (incomplete databases, [19]), event tables (probabilistic databases, [17, 33]), lineage ([12, 13]) and bags (§1, PDF p. 1), and seek one algebraic structure for all four, plus the most general annotation, recording how an output tuple was derived.

Setting:
- **Languages:** positive relational algebra RA⁺ (union, projection, selection, natural join, renaming; no difference) (§3, PDF pp. 2–3), and "pure" datalog, every subgoal a relational atom (§5, PDF p. 5).
- **K-relation** (Def. 3.1, PDF p. 3): a function from tuples to K with finite **support** (tuples not tagged 0). Def. 3.2 (PDF p. 3) evaluates RA⁺ with + for union and projection and · for join and selection; selection predicates are {0, 1}-valued, otherwise unspecified.
- **Commutative semiring** (K, +, ·, 0, 1) (PDF p. 3): two commutative monoids, · distributing over +, 0 annihilating. PosBool(B) (positive Boolean expressions up to equivalence) gives the c-table algebra; 𝒫(Ω) gives event tables.
- For datalog, K must be **commutative ω-continuous** (§5, PDF p. 5): naturally ordered (a ≤ b iff a + x = b for some x), with least upper bounds of ω-chains and ω-continuous + and ·, so countable sums exist. ℕ and ℕ[X] are not; ℕ^∞, PosBool(B) (finite B), 𝒫(Ω), the tropical and the fuzzy semiring are.

## Approach

- **Why semirings** (§3, PDF pp. 3–4): standard RA identities hold on K-relations iff K is a commutative semiring (Prop. 3.4, PDF p. 3); idempotence of union and self-join is "glaringly absent", failing for bags. Applying h : K → K′ to every tag commutes with RA⁺ queries iff h is a semiring homomorphism (Prop. 3.5, PDF p. 4).
- **Provenance polynomials** (§4, PDF p. 4): why-provenance is presented as Def. 3.2 (PDF p. 3) over (𝒫(X), ∪, ∪, ∅, ∅). Fig. 5 (PDF p. 4) shows that it cannot say how a tuple was derived. Def. 4.1 (PDF p. 4) tags input tuples with their ids and computes in ℕ[X] ("how-provenance", footnote 3, PDF p. 4). Prop. 4.2 (PDF p. 4): each valuation v : X → K extends to a unique homomorphism Eval_v : ℕ[X] → K; with Prop. 3.5 (PDF p. 4) this gives the factorization Thm. 4.3 (PDF p. 4).
- **Datalog** (§5, PDF pp. 5–6): Def. 5.1 (PDF p. 5) tags an answer with the sum over its derivation trees of the product of leaf tags, "not so useful computationally" (PDF p. 6). The equivalent fixpoint form is an **algebraic system** (Def. 5.5, PDF p. 6): one polynomial equation per output tuple, solved by the least fixed point. Fig. 7 (PDF p. 6) works this for transitive closure under bag semantics.
- **Power series** (§6, PDF pp. 6–7): datalog may sum infinitely many distinct monomials, or infinitely many copies of one, so Def. 6.1 (PDF p. 7) uses formal power series ℕ^∞[[X]].
- **Algorithms** (§7, PDF pp. 7–8): All-Trees (Fig. 8, PDF p. 8, "inspired by [28]" on PDF p. 7) builds derivation trees and the set T^∞ of tuples with infinitely many; Monomial-Coefficient (Fig. 9, PDF p. 8) computes one monomial's coefficient, even ∞.
- **Finite distributive lattices** (§8, PDF pp. 8–9): All-Trees keeps a tree only if its monomial is smaller than any seen for that tuple; it then always returns a polynomial, evaluated in K.

## Results

The authors' claims; there are no experiments.
- Prop. 3.3 (PDF p. 3): RA⁺ preserves finite support. Thm. 4.3 (PDF p. 4) is the RA⁺ factorization under In brief.
- Prop. 5.2–5.4 (PDF pp. 5–6): datalog results have finite support, agree with RA⁺ under equality-only selections, and over 𝔹 give standard datalog.
- Thm. 5.6 (PDF p. 6): the derivation-tree tag equals the solution of the algebraic system Q̄ = T_q(R, Q̄). Prop. 5.7 (PDF p. 6): ω-continuous homomorphisms commute with datalog.
- Prop. 6.3 and Thm. 6.4 (PDF p. 7): datalog on any commutative ω-continuous K factors through ℕ^∞[[X]].
- Thm. 6.5 (PDF p. 7): a tuple's series has no ∞ coefficient iff no cycle of unit rules in the instantiation passes through it (t in the result).
- §7 (PDF pp. 7–8): it is decidable whether a tuple's provenance is a polynomial in ℕ[X], in ℕ[[X]] or in ℕ^∞[X]. All-Trees also evaluates datalog under bag semantics "just like in [28]".
- §8 (PDF pp. 8–9): a datalog semantics on Boolean c-tables, which "is new for incomplete databases", and an algorithm for event tables that "generalizes that of [16]".
- Thm. 9.2 (PDF p. 9), as under In brief. The authors say [20]'s similar theorem covers the fuzzy semiring but not PosBool(B) or 𝒫(Ω).
- [3]'s lineage is a special semiring, "so our approach is more general" (§10, PDF p. 9); polynomials and power series are "the most general form of annotation possible" within semirings (§11, PDF p. 9).

## Limits the authors state

- Props. 5.3 and 6.2 hold only for selections that "only test for attribute equality" (PDF pp. 5, 7).
- Probabilistic datalog assumes a finite domain, "as usual" (§8, PDF p. 8).
- Only Boolean c-tables are treated; the results "can be extended to arbitrary c-tables" (§11, PDF p. 10).
- Negation is future work and "seems to require axiomatizing an additional operation akin to 'proper subtraction'" (§11, PDF p. 10).
- All-Trees "does not immediately give an effective way to evaluate datalog over the tropical semiring"; the authors conjecture one exists (§11, PDF p. 10).
- Bag containment of (unions of) conjunctive queries is only conjectured to equal ℕ[X] containment (§11, PDF p. 10).

## On this site

- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/theory-bag">theory-bag</a><a class="tag sub" href="#/tags/theory-set">theory-set</a></span>
