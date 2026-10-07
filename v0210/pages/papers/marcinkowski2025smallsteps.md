# Bag Semantics Conjunctive Query Containment. Four Small Steps Towards Undecidability.

**Bag Semantics Conjunctive Query…** · PACMMOD 2(2) (PODS 2024)

Read: [PDF](https://arxiv.org/pdf/2503.18003) · [arXiv](https://arxiv.org/abs/2503.18003) · [DOI](https://doi.org/10.1145/3651604)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Undecidability for small generalizations of bag CQ containment.
- Hilbert's-tenth-problem-style reductions.
- Maps how close the open problem sits to undecidability.

## In plain words

Query containment asks whether one query's answer is always part of another's, on every database. For select-project-join queries it has been understood since the 1970s when answers are sets, but when answers keep duplicates, as the authors argue real database systems usually do (§1.1), whether it can be decided at all "remains an open question, one of the most intriguing open questions in database theory" (abstract). The authors prove that several slight generalizations are undecidable: no algorithm answers them for all inputs. All their results are for yes/no queries, whose answer with duplicates is a count of the ways the query matches (§1.2). The abstract's example: given two such queries and a linear function, whether the function of the first count stays at most the second count on every database is undecidable (abstract). Another compares the counts directly but allows one not-equal condition in the second query, over databases holding two distinct fixed values (Thm. 3). The authors present it as "an improvement upon the main result" of Jayram, Kolaitis and Vee, which needed many such conditions (§1.2).

## Background and terms

**Terms to know:** [bag semantics](#/glossary/bag-semantics) · [set semantics](#/glossary/set-semantics) · [conjunctive query](#/glossary/conjunctive-query) · [query containment](#/glossary/query-containment) · [decidable and undecidable](#/glossary/decidable-and-undecidable) · [homomorphism](#/glossary/homomorphism-containment-mapping) · [union of conjunctive queries](#/glossary/union-of-conjunctive-queries) · [canonical database](#/glossary/canonical-database) · [Boolean query](#/glossary/boolean-query) (under bag semantics its yes "can be repeated any positive natural number of times": the answer is the number of homomorphisms from the query into the database, §2.1, PDF p. 5) · [Hilbert's tenth problem](#/glossary/hilberts-tenth-problem) (in the paper's form: decide whether a polynomial with integer coefficients is non-zero for every assignment of natural numbers to its variables; Thm. 6, App. B.1, PDF p. 23, citing Davis [18])

**The paper's own terms:**
- **s-query and b-query**: the "small" and the "big" query; containment asks whether the small one's answer is always part of the big one's (§1.1, PDF p. 1).
- **inequality**: an atom x ≠ x′, not an order comparison (§2.1, PDF p. 5); the glossary's conjunctive-query entry also uses the word for order comparisons.
- **non-trivial database**: one that "contains two different constants, ♂ and ♀" (§1.2, PDF p. 3). Constants are fixed names that every homomorphism keeps fixed (§2.1).
- **well of positivity**: a one-element database where every fact holds; queries without inequalities count 1 there (§1.2, PDF p. 3).
- **multiply by q** (Def. 3, §3, PDF p. 7): a pair of queries whose s-count is at most q times the b-count on every non-trivial database, with equality, non-zero, on some non-trivial database.
- **Arena; correct, slightly incorrect, seriously incorrect** (§4.4, Def. 13, PDF pp. 13–14): the Arena is a fixed set of facts on constants: it records which variable occurs in which monomial (§4.4) and holds a self-loop on ♂ plus one long cycle through all its other constants in a relation E (§4.6). The relation X, outside the Arena, encodes the variables' values. A correct database is the Arena plus X-facts only; a slightly incorrect one has extra facts of other relations too; a seriously incorrect one matches the Arena but merges some of its constants.
- **anti-cheating mechanism**: the part of a reduction that makes the b-count large on databases that are not "good" (§1.2, PDF p. 4).

**Builds on:**
- Chaudhuri and Vardi [1] ([Optimization of real conjunctive queries](#/papers/chaudhuri1993real "Optimization of real conjunctive queries (1993)")): noticed that the set-semantics understanding of containment "does not transfer" to bag semantics (abstract; §1.1, PDF p. 2).
- Ioannidis and Ramakrishnan [14] ([Containment of conjunctive queries](#/papers/ioannidis1995bag "Containment of conjunctive queries: beyond relations as sets (1995)")): proved bag containment of unions of conjunctive queries undecidable, by "a straightforward encoding of Hilbert's 10th problem" (§1.1, PDF p. 3).
- Jayram, Kolaitis and Vee [15] ([The containment problem for…](#/papers/jayram2006inequalities "The containment problem for &lt;bi&gt;Real&lt;/bi&gt; conjunctive queries with inequalities (2006)")): proved bag containment of conjunctive queries with inequalities undecidable, encoding a polynomial as one query plus "an elaborate anti-cheating mechanism" (§1.2, PDF p. 4).

## Problem and setting

- **Question:** which small generalizations of bag containment of conjunctive queries are undecidable; for "(some of)" them, "no stronger undecidability result is possible unless" the open problem is undecidable (§1.2, PDF p. 3).
- **Queries:** "All our results hold for boolean conjunctive queries (with, or without, inequality)", with constants allowed (§1.2, PDF p. 3; §2.1).
- **Databases:** finite relational structures; answers are bags (§1.1 footnote 3, PDF p. 2).
- **NULLs and SQL:** not discussed.

## Approach

- **The polynomial problem** (Lemma 11, §4.1, PDF p. 11; proved in App. B): given a natural number 𝔠 ≥ 2 and two polynomials with natural coefficients and the same monomials, all of one degree and all starting with the first variable, each small coefficient at least 1 and at most the matching big one, it is undecidable whether 𝔠 times the small polynomial stays at most the first variable to that degree times the big one, for every assignment of natural numbers.
- **Encoding (§4.3–4.4, PDF pp. 12–14).** Each polynomial becomes a star-shaped query: a ray per monomial "of length equal to the coefficient"; a self-loop at the centre. Other rays end in X-facts; a variable's value is the number of X-facts leaving its constant (Def. 14), so ranging over databases ranges over assignments (§1.2, PDF p. 4). On a correct database the s-star counts the small polynomial, and the b-star the first variable to the degree times the big one, at the encoded assignment (Lemma 15). On every database the s-star counts at most the b-star, through a homomorphism onto it, covering all its variables (Lemma 12).
- **Anti-cheating without inequalities (§4.5–4.6, PDF pp. 15–16).** One factor of the b-query counts the facts of each relation the rays use (not X or E), raised to a power, so extra facts make it at least c, which is 𝔠 times its value on the Arena (Lemma 18). A second counts E-cycles of every length up to ℓ+1 except ℓ, the length of the Arena's long E-cycle; merging constants creates a further such cycle, making that factor at least c (Lemma 21, for non-trivial databases). This c is the output constant (§4.5).
- **Multiplying with one inequality (§3, PDF pp. 6–11).** Thm. 3 comes from Thm. 1 by conjoining, with separate variables and relations, a pair that multiplies by c, so the factors multiply (Lemma 1, Lemma 4). Pair β uses cyclic patterns on a relation with ñ ≥ 3 columns, has one inequality in its b-query, and multiplies by (ñ+1)²/2ñ (Lemma 5, a probability argument). Pair γ, without inequality, multiplies by (M−1)/M, M being its relation's column count (Lemma 10). Taking ñ = 2c−1 and M = ñ+1 gives c (§3.2, PDF p. 11).
- **Thm. 5 (§5, PDF pp. 17–19).** Blow-ups (copying each element) and products of databases (pairs of elements; a fact holds if it holds in both) scale inequality-free counts predictably (Lemma 22), so, for a b-query without inequalities, a database where the s-query beats it exists exactly when one exists for the s-query with its inequalities deleted (Lemma 23).

## Results

Five theorems (§1.2, PDF pp. 3–4):
- **Thm. 1:** given two Boolean conjunctive queries without inequalities and a natural number c, whether c times the first count is at most the second count on every non-trivial database is undecidable; proved in §4.
- **Thm. 2:** given two Boolean conjunctive queries without inequalities and natural numbers c and c′, whether c times the first count is at most the second count plus c′ on every database, trivial or not, is undecidable.
- **Thm. 3:** given a Boolean conjunctive query without inequalities as s-query and one with at most one inequality as b-query, whether the s-count is at most the b-count on every non-trivial database is undecidable; proved in §3 from Thm. 1. Enforcing non-triviality with one inequality in the s-query gives, the authors say, undecidability "already for queries with one inequality each, instead of" 59 to the power 10 (§1.2, PDF p. 4).
- **Thm. 4:** for an s-query without inequalities and a b-query with at most one, whether the s-count is at most the larger of 1 and the b-count on every database is undecidable.
- **Thm. 5:** for an s-query with any number of inequalities and a b-query without, whether the s-count is at most the b-count on every database is decidable if and only if bag containment of conjunctive queries is decidable; proved in §5.

## Limits the authors state

- "Proofs of Theorems 4 and 2 are deferred to the full paper"; they meet "some new obstacles", because the anti-cheating mechanism of Thms. 1 and 3 "strongly relies on the input database to be non-trivial" (§1.2, PDF p. 5).
- Thm. 1 "would make no sense without the condition that D must be non-trivial", at least for a multiple above 1, because of the well of positivity (§1.2, PDF p. 3); for Thm. 3, non-triviality "cannot be easily dropped" (§1.2, PDF p. 4).
- Avoiding inequalities "comes with a cost however, which is the multiplicative constant" (§1.2, PDF p. 4).
- If constants are banned, Thms. 1 and 3 "survive almost intact" when ♂ and ♀ stay allowed; if those are banned too, Thm. 3 "survives, but with the additional inequality" ♂ ≠ ♀ in the s-query (§2.3, PDF p. 6).
- "we are not able to multiply by anything bigger than 1, without using an inequality in the b-query" (§3.2, PDF p. 10).
- Thm. 5 is proved for one inequality in the s-query; the general case "is similar" (§5.2, PDF pp. 18–19).

## Open problems and building blocks

- **Open:** decidability of bag containment of conjunctive queries "remains an open question" (abstract); no upper bound on its complexity has been proved, apart from "the problem is in co-r.e." (§1.1 footnote 5, PDF p. 2): non-containment can be confirmed by a search. Whether the b-query's inequality can be dropped: "maybe we can, but this can only happen if" the open problem is undecidable (§1.2, PDF p. 4).
- **Released:** nothing stated.
- **To reuse it:** the reductions assume Hilbert's tenth problem is undecidable, as Thm. 6 states it (App. B.1, PDF p. 23).

## On this site

- **Discussed in:** [Query equivalence: prove or refute](#/challenges/query_equivalence)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/theory-bag">theory-bag</a></span>
