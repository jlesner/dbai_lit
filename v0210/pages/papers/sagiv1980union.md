# Equivalences Among Relational Expressions with the Union and Difference Operators

**Equivalences Among Relational Expressions…** · J. ACM 27(4) 1980

Read: [DOI](https://doi.org/10.1145/322217.322221)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Unions of tableaux with the same target relation scheme: a union is contained in another iff each member is contained in some member of the other (Theorem 3, PDF p. 9).
- Containment of monotonic (SPJU) expressions is Π₂ᵖ-complete (Theorem 19, PDF p. 19); a normal form for difference without projection over it.
- Containment is decided on one canonical ("magic") instance per member tableau (§4, PDF p. 9): a finite complete test family. Linking it to complete bounds is ours: the paper doesn't discuss bounds.

## In plain words

Databases rewrite queries into cheaper ones, and a rewrite must give the same answer on every database. The authors note that earlier rewriting methods lower cost without promising the cheapest equivalent query, and study deciding whether two queries are equivalent as a first step toward that (§1, PDF p. 1). Their queries filter rows on a constant, keep columns, join, unite and subtract, over tables that are sets. Without subtraction, a query becomes a union of filter-column-join queries, and one such union is contained in another with the same output columns exactly when each of its parts is contained in some part of the other. With subtraction, as long as columns are never dropped after it, they give a normal form and an equivalence test. They prove that equivalence without subtraction is among the hardest problems of a complexity class containing NP, and that the part-by-part check is NP-complete even for one column-dropping step over joins (abstract, PDF p. 1). They present this as extending an existing theory to union and difference (§1, PDF pp. 1–2).

## Background and terms

**Terms to know:** [relational algebra](#/glossary/relational-algebra) · [query equivalence](#/glossary/query-equivalence) · [query containment](#/glossary/query-containment) · [set semantics](#/glossary/set-semantics) · [conjunctive query](#/glossary/conjunctive-query) · [union of conjunctive queries](#/glossary/union-of-conjunctive-queries) · [homomorphism (containment mapping)](#/glossary/homomorphism-containment-mapping) · [NP-complete and the polynomial hierarchy](#/glossary/np-complete-and-the-polynomial-hierarchy) · [tableau](#/glossary/tableau) · [finite Church–Rosser](#/glossary/church-rosser-property) · [Q3-SAT](#/glossary/3-sat)

**The paper's own terms:**
- **restricted / monotonic expression**: built from select, project and join / also union (§2.2, PDF p. 3).
- **instance**: one "universal" relation over all attributes; each table in an expression is its projection onto the table's columns (§2.3, PDF p. 3).
- **⊆_T, ≡**: containment and equivalence on every instance (§4, PDF p. 8).
- **union of tableaux**: tableaux with the same output columns (target relation scheme); its result is the union of theirs (§3, PDF p. 4).
- **"magic" instance and tuple**: give each symbol of a tableau T₂ a different constant (constants stay themselves); the instance is T₂'s rows, the tuple its summary. T₂ ⊆_T T₁ exactly when T₁ returns that tuple on that instance (§4, PDF p. 9).
- **nonredundant union**: no tableau in it is contained in another (§5, PDF p. 10).
- **tableau expression (t.e.)**: tableaux combined by union, intersection and difference (§6, PDF p. 12).
- **elementary difference**: a tableau minus a union of tableaux, T − Y, with Y assumed contained in T (§6, PDF pp. 12–13).
- **irreducible**: no §7 transformation applies (§7, PDF p. 13).
- **repeated symbol; covered row**: a symbol in more than one row; row w of T₁ is covered by row v of T₂ if v has w's constants (also in the summary, where T₁'s summary has them), and an output variable or output constant wherever w has an output variable (§9.2, PDF p. 16).
- **simple tableau**: a subclass from [4] ([Equivalences among Relational Expressions](#/papers/aho1979equivalences "Equivalences among Relational Expressions (1979)")) with polynomial equivalence algorithms; not defined here (§1, PDF p. 1).

**Missing glossary terms:**
- **exact cover**: choose some of given sets so every element lies in exactly one chosen set; NP-complete per [16] (§8, PDF p. 15).

**Builds on:**
- [Equivalences among Relational Expressions](#/papers/aho1979equivalences "Equivalences among Relational Expressions (1979)") [4]: tableaux, and the rules turning select-project-join expressions into them; this paper extends its tableau theory (§1, PDF pp. 1–2; §3, PDF p. 5).
- [Optimal Implementation of Conjunctive…](#/papers/chandra1977conjunctive "Optimal Implementation of Conjunctive Queries in Relational Data Bases (1977)") [9]: conjunctive queries and their unique minimal form (§1, PDF p. 1); Lemma 2, the containment-mapping test, is credited to [4, 9] (§4, PDF p. 9).
- [3, 5] (Aho, Sagiv, Ullman and coauthors): polynomial algorithms for simple tableaux, and tableau minimization (§1, PDF p. 1; §5, PDF p. 11).

## Problem and setting

- **Question:** decide whether two expressions over select, project, join, union and difference are equivalent, or one contains the other (§1, PDF pp. 1–2).
- **Operators:** selections compare one attribute with a constant; the authors note that to make the operators "complete" in Codd's sense (as expressive as relational calculus) they "only need to allow selections involving arithmetic comparisons between two components of a tuple" (§2.2, PDF p. 3).
- **Semantics:** relations are sets; union and difference are set operations (§2.1–2.2, PDF p. 2). Tables are projections of one universal instance; the authors cite [4] for results also holding without that (§2.3, PDF p. 3).
- **Difference:** only where project is never applied to a subexpression with difference (abstract, PDF p. 1; §6, PDF p. 11).
- NULLs and integrity constraints: not discussed.

## Approach

- **Unions of tableaux (§3, PDF pp. 4–8).** Select and project apply to each tableau of a union; a join pairs every tableau of one side with every one of the other; a union concatenates. Thm. 1 (PDF p. 7): these rules turn every monotonic expression into a union of tableaux with the same result on every instance.
- **Containment (§4, PDF pp. 8–9).** Containment of unions reduces to single tableaux. Thm. 3: one union is contained in another exactly when both have the same output columns and each tableau of the first is contained in some tableau of the second. The proof evaluates the second union on each magic instance of the first. Cor. 4 gives equivalence.
- **Minimization (§5, PDF pp. 10–11).** Delete tableaux contained in another, then minimize each tableau [5, 9]. Thm. 5: nonredundant unions are equivalent exactly when they have the same output columns and their tableaux pair up one-to-one as equivalent, so they "are unique up to equivalence of tableaux" (PDF p. 10).
- **Difference (§6, PDF pp. 11–13).** Six equivalence-preserving rules push select, join, and project (over difference-free parts only) down to tableaux. Tableau expressions with fixed output columns, up to equivalence, form a Boolean algebra (the authors "only show that t.e.'s satisfy the axioms of Boolean algebra", PDF p. 12), so each has a "disjunctive" normal form: a union of elementary differences.
- **Equivalence with difference (§7, PDF pp. 13–14).** Three transformations preserve equivalence (Lemma 6) and apply finitely often. Thm. 10: T₂ − Y₂ ⊆_T T₁ − Y₁ exactly when both have the same output columns, T₂ ⊆_T T₁, and T₂ ∩ Y₁ ⊆_T Y₂. Thm. 12: irreducible unions of elementary differences are equivalent exactly when they have the same output columns and their elementary differences pair up one-to-one as equivalent.
- **Hardness** comes from reductions of exact cover (§8, PDF pp. 14–16) and of Q3-SAT (§10, Figs. 1–2, PDF pp. 19–21).

## Results

The authors prove Thm. 3, Cor. 4, Thm. 5 and Thm. 12 (PDF pp. 9–14, see Approach), and:
- **Thm. 14 (PDF p. 16):** containment between two expressions that join tables and then keep some columns is NP-complete; the authors say this "indicates that there is no large class of tableaux for which there is an efficient containment algorithm" (§8, PDF p. 15).
- **§9.1 (PDF p. 16):** for tableaux T₁, T₂ with the same output columns, T₂ ⊆_T T₁ is tested in O(n³) time, n the size of T₁ and T₂, when the join of T₁ and T₂ is a simple tableau.
- **Cor. 16 (PDF p. 17):** O(n²) time, same n, when each row of T₁ has at most one repeated nondistinguished variable (via Thm. 15's covering conditions, PDF p. 16).
- **Thm. 18 (PDF p. 18):** O(n²) time, n the input size, when every row of T₁ is covered by at most two rows of T₂ (§9.3, PDF p. 17).
- **§9.4 (PDF pp. 18–19):** up to three covering rows and two repeated nondistinguished variables per row make containment NP-complete, even for join-then-project expressions.
- **Thm. 19, Cor. 20 (PDF pp. 19–21):** Thm. 19 as under In brief, and Cor. 20 the same Π₂ᵖ-completeness for equivalence; unions of tableaux "may be exponential in the size of" the expressions (PDF p. 19).
- **§11 (PDF p. 22), stated without proof:** equivalence of unions of elementary differences is also Π₂ᵖ-complete, which "follows from the results of [20, 25]".
- **Design claims (§11, PDF p. 22):** the authors feel many practical queries over the five operators "are naturally represented as unions of elementary differences"; in many cases the §7 transformations (PDF pp. 13–14) improve queries like earlier optimization techniques, applying select as early as possible and turning a union of elementary differences into a single tableau whenever it is equivalent to one.

## Limits the authors state

- Difference is handled only "provided that the project operator is not applied to subexpressions with the difference operator" (abstract, PDF p. 1).
- The polynomial cases are "albeit very special cases" (§9, PDF p. 16).
- The algorithm for monotonic expressions is an "exponential time algorithm" (§11, PDF p. 21).
- "We have not discussed the exact time complexity of testing equivalence of unions of elementary differences" (§11, PDF p. 22).
- "We have not considered the problem of query optimization" (§11, PDF p. 22).

## Open problems and building blocks

- **Open:** how far the unique minimization of unions of tableaux and the §7 transformations (PDF pp. 13–14) are useful tools for query optimization is "not clear"; "This problem merits further research" (§11, PDF p. 22).
- **Released:** Nothing stated.
- **To reuse it:** a containment test for single tableaux: the authors say their results imply that testing containment, rather than equivalence, of tableaux "is a necessary step in optimizing queries that contain union and difference" (§1, PDF p. 2); they feel most practical queries over the five operators "can be handled by using" the §9 algorithms (§1, PDF p. 2). "Analogous results are easily obtained for conjunctive queries" (§2.5, PDF p. 4).

## On this site

- **Discussed in:** [Minimal counterexamples](#/challenges/minimal_counterexamples) · [Canonical forms for queries](#/challenges/query_canonical_forms) · [Query equivalence: prove or refute](#/challenges/query_equivalence)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/bounded-theory">bounded-theory</a><a class="tag sub" href="#/tags/theory-set">theory-set</a></span>
