# Equivalence of Queries Combining Set and Bag-Set Semantics

**Equivalence of Queries Combining…** · PODS 2006

Read: [PDF](https://dl.acm.org/doi/pdf/10.1145/1142351.1142362) · [DOI](https://doi.org/10.1145/1142351.1142362)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- "Combined semantics" for SQL mixing DISTINCT parts (set) with plain parts (bag-set).
- Multiset-homomorphisms are sufficient; exact for several query classes.
- Shows combined semantics loses the small-counterexample property; conference version of [Equivalence of Queries That…](#/papers/cohen2009multiplicities "Equivalence of Queries That Are Sensitive to Multiplicities (2009)").

## Problem and setting

When do queries mixing set and bag-set evaluation return the same multiset on every database? Motivation (§1, PDF pp. 1–2): a non-DISTINCT query with an `EXISTS` subquery (Example 1.1's Q3, which "cannot be modeled using either set or bag-set semantics"), a query over a DISTINCT view (Example 1.2's Q4, said to be equivalent to Q3), UNION ALL of DISTINCT queries, referential constraints, and `cntd` (count distinct, Example 1.3).

Setting (§2.1–2.3, PDF pp. 3–4):
- **Queries** are non-recursive disjunctions Q(x̄) ← L1, M1 ∨ … ∨ Ln, Mn of safe conditions Li (conjunctions of positive or negated relational atoms and comparisons <, ≤, >, ≥, ≠). Mi lists Li's **multiset variables**, whose different assignments add to an answer's multiplicity; its other nondistinguished variables are **set variables**, whose assignments don't.
- **Databases** are sets of ground atoms (§2.2, PDF p. 3).
- **Combined semantics** Res_C (Def. 2.3, Eq. 1, PDF pp. 3–4): per disjunct, one output tuple per distinct restriction of a satisfying assignment to the distinguished and multiset variables ("satisfiably extendible" assignments), multiset-unioned over disjuncts. Prop. 2.5 (PDF p. 4): Res_C equals Res_S on conjunctive set queries (no multiset variables) and Res_M on multiset queries (no set variables).
- Assumptions: every disjunct is satisfiable, and comparisons never force a multiset variable to equal a constant or another variable (§2.1, PDF p. 3). ≡_C, ≡_S, ≡_M: equivalence under the three semantics (§2.3, PDF p. 4).

## Approach

- **Multiset-homomorphism** (Def. 3.1, PDF pp. 4–5): a homomorphism Q → Q′ (head to head, literals into Q′'s, Q′'s comparisons implying the mapped ones) that maps multiset variables injectively to multiset variables. **Multiset-homomorphic** (Def. 3.2, PDF p. 5): disjuncts paired one-to-one with such mappings both ways. Theorem 3.3's proof (PDF p. 5): the mappings are bijective on multiset variables, so distinct restricted assignments of one query compose into distinct ones of the other.
- **Relational queries** (§4.1, PDF pp. 5–6). Lemma 4.1 (PDF p. 6): equivalent relational queries have equally many multiset variables, by counting answers on all body images over |M| constants. Theorem 4.2 (PDF p. 6), in outline: on a database family D_N̄ built from Q, the answer counts F, F′ are polynomials; F has a monomial c N1 ⋯ Nm (c > 0), and F′ has none containing all of N1…Nm if no multiset-homomorphism Q′ → Q exists. The technique is credited to "the long version of [18]" (footnote 1, PDF p. 6).
- **Join queries** (§4.2, PDF pp. 6–7): conjunctive queries where no literal holds both a set and a multiset variable. Lemma 4.4 (PDF p. 6): for set-equivalent queries, conjoining the same condition over fresh variables to both preserves ≡_C either way. Theorem 4.5's proof sketch (PDF p. 7) adds renamed copies of both set-variable parts as multiset variables, then applies Theorem 3.3 (PDF p. 5).
- **Set queries** (§4.3, PDF p. 7): **canonical databases** DB[Q], one per total order (consistent with the comparisons) of the variables of each subset of disjuncts.
- **Quasilinear queries** (§4.4, PDF pp. 7–8): no predicate in a positive literal occurs twice. The proof sketch: if the positive parts are homomorphic, there is a single homomorphism each way, and these must be multiset-homomorphisms.
- **Referential constraints** (§5, PDF p. 8): chase the queries, but add every new chase variable as a **set** variable, so multiplicities don't change.

## Results

The author's claims; no experiments. Thm. 3.3 (PDF p. 5) and Example 2.6 (PDF p. 4) are under In brief.
- Thm. 4.2 (PDF p. 6): relational queries are ≡_C iff multiset-homomorphic.
- Thm. 4.5 (PDF p. 7): join queries Q, Q′ are ≡_C iff Q ≡_S Q′ and two derived multiset queries Q*, Q′* are ≡_C. By Prop. 2.5 (PDF p. 4), one set and one bag-set equivalence test.
- Thm. 4.6 (PDF p. 7): positive set queries are ≡_C iff they agree on every database in DB[Q] ∪ DB[Q′].
- Thm. 4.7 and Cor. 4.8 (PDF p. 7): without comparisons, positive set queries are ≡_C iff their disjuncts pair up one-to-one with ≡_S, equivalently iff they are multiset-homomorphic.
- Thm. 4.9 (PDF p. 8): conjunctive quasilinear queries are ≡_C iff multiset-homomorphic.
- Thm. 5.1 (PDF p. 8): if the chase terminates, R-equivalence under combined semantics equals ≡_C of the chased queries. For multiset queries this reduces bag-set R-equivalence to ≡_C; the plain chase gives no such reduction, since adding a right-hand side "changes the multiplicities" (PDF p. 8).

## Limits the authors state

- Results extend "easily" when the satisfiability and comparison assumptions are lifted (§2.1, PDF p. 3).
- Theorem 3.3's condition "is not necessary": for conjunctive set queries it differs from the known set-equivalence characterization (§3, PDF p. 5).
- Join queries are treated without disjunction "to simplify the exposition" (§4.2, PDF p. 6).
- "A full treatment of integrity constraints is beyond the scope"; only referential constraints are handled, and the chase "does not always terminate" (§5, PDF p. 8).
- cntd characterizations "cannot easily be generalized" to combined semantics (§6, PDF p. 8).
- The syntax captures UNION ALL with nested existential subqueries and FROM views, but only "limited single level non-existential subqueries" (§6, PDF p. 9).
- Open (§6, PDF p. 9): rewriting with views, general integrity constraints, containment (likely at least as hard; undecidable with inequalities, by [10, 11]), and equivalence combining set and **bag** semantics. Multiset-homomorphism is NP-complete to decide, quasilinear equivalence polynomial; elsewhere "no tight complexity bounds are known".

## On this site

- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/bounded-theory">bounded-theory</a><a class="tag sub" href="#/tags/theory-bag">theory-bag</a></span>
