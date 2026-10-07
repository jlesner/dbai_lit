# Deciding Equivalences among Conjunctive Aggregate Queries

**Deciding Equivalences among Conjunctive…** · J. ACM 54(2) 2007

Read: [DOI](https://doi.org/10.1145/1219092.1219093)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Equivalence characterizations for CQs with comparisons plus count, min/max or sum (no HAVING); for count-distinct a sufficient condition, also shown necessary in special cases (abstract; §5.1; Thm. 7.3, Cor. 7.4).
- Dominance mappings (max), isomorphism of linear expansions (count), a balance condition (sum).
- Complexity map for SQL-style aggregates (Tab. I); settles bag-set equivalence of CQs with constants and comparisons (§10).

## In plain words

When do two SQL queries with GROUP BY and one of COUNT, COUNT DISTINCT, MIN, MAX or SUM return the same result on every database? Deciding this is, the authors write, "widely accepted" to be "a key" to optimizing such queries and answering them from stored views (§1, PDF p. 2). For essentially unnested queries whose WHERE clause is an AND of comparisons, with no HAVING, they give tests on the queries' text alone. MAX and MIN need a mapping between queries. COUNT queries are equivalent exactly when, once each is split into one case per possible ordering of its variables among the constants of both queries, the cases match one to one up to renaming. SUM needs a more elaborate test when queries mix constants and comparisons. For COUNT DISTINCT the test is sufficient, and shown also necessary in some special cases. Tests differ between integer and rational values; all are decidable in polynomial memory (abstract, PDF p. 1). The proofs are "based on novel techniques"; the 1998 conference version "did not provide proofs" (§1, PDF p. 3).

## Background and terms

**Terms to know:** [conjunctive query](#/glossary/conjunctive-query) · [set semantics](#/glossary/set-semantics) · [bag-set semantics](#/glossary/bag-set-semantics) · [bag semantics](#/glossary/bag-semantics) · [query containment](#/glossary/query-containment) · [query equivalence](#/glossary/query-equivalence) · [homomorphism](#/glossary/homomorphism-containment-mapping) · [NP-complete and the polynomial hierarchy](#/glossary/np-complete-and-the-polynomial-hierarchy) · [GI (graph isomorphism)](#/glossary/graph-isomorphism) · [PSPACE](#/glossary/pspace)

**The paper's own terms:**
- **comparison**: s ρ t with ρ among <, ≤, >, ≥ (s = t abbreviates both ≤); a query without comparisons is **relational** (§2.1, PDF p. 5).
- **homomorphism**: also maps each comparison to one the target's comparisons imply (§2.3, PDF p. 7).
- **isomorphic queries**: "identical up to a renaming of the existential variables and up to the multiplicity of atoms" (§2.3, PDF p. 8); existential variables are those in the body but not the head (§2.1, PDF p. 5).
- **linearization, linear expansion**: in one sense, a set L of comparisons fixing, for every pair of terms, which is smaller or that they are equal (§2.4, PDF p. 8); in the other, the query q_L made by adding L to a query and merging equal terms (PDF p. 9). A linear expansion over constants D holds one q_L per such L over the query's variables and D compatible with its comparisons; expansions are isomorphic if their queries pair up one to one, each pair isomorphic (§2.4, PDF p. 9).
- **core, kernel, comparable**: an aggregate query is written q(x̄, α(y)) ← body, output on the left, conditions on the right, x̄ the tuple of grouping variables, α one of min, max, count, cntd (count-distinct), sum (§3.1, PDF pp. 10–11). Its core strips the aggregate (head x̄, y; for count, x̄), its j-th kernel keeps only the j-th aggregate, and comparable queries share grouping variables and functions position by position (§3.3, PDF pp. 13–14).
- **reduced query**: its comparisons are satisfiable and imply no equality between distinct terms (§4.1, PDF p. 14).
- **virtual constant**: over the integers, a constant of D or a value a linearization consistent with the comparisons forces on a variable, as 0 < z1 < z2 < 3 forces z1 = 1, z2 = 2 (§4.2, PDF p. 17).
- **dominance mapping**: q is dominated by q′ if on every database, for each row (d̄, d) q returns (grouping values d̄, value d), q′ returns some (d̄, d′) with d′ ≥ d; a dominance mapping is a homomorphism also sending the max-argument to one at least as large (§6.1–6.2, PDF pp. 23–24).
- **possible preimage**: a variable in the same position (up to implied equality) of a same-predicate atom as a variable of the other query (§7, PDF p. 28).
- **constant query, weak isomorphism, weakly set-equivalent, in balance, variable isomorphic**: for sum-query cores, a linearization q_L whose summed term is a constant (else a variable query); isomorphism, or set-equivalence, ignoring the summed term; equal totals of summed constants in both expansions per set of weakly isomorphic constant queries; a one-to-one isomorphic pairing of variable queries (§9.2.1, PDF pp. 42–43).

**Builds on:**
- Nutt, Sagiv and Shurin, PODS 1998: this article is "a significantly extended version" of it (§1, PDF p. 3).
- Chaudhuri and Vardi 1993 ([Optimization of real conjunctive queries](#/papers/chaudhuri1993real "Optimization of real conjunctive queries (1993)")): introduced bag-set semantics (§2.2.2, PDF p. 6) and stated, unproved, the isomorphism test for queries without comparisons or constants; proved here with constants and extended to comparisons (§1, PDF p. 4; §8, PDF p. 30).
- Klug 1988 ([On conjunctive queries containing…](#/papers/klug1988inequalities "On conjunctive queries containing inequalities (1988)")), whose containment test with comparisons Thm. 2.3 extends, and van der Meyden 1992 ([querying indefinite order data](#/papers/vandermeyden1992indefinite "The complexity of querying indefinite data about linearly ordered domains (1992)")), whose Π₂ᵖ-completeness of it the hardness proofs use (§2.4, PDF p. 10; §6.2, PDF pp. 26–27).

## Problem and setting

- **Question:** do two comparable aggregate queries return the same relation on every database (§3.3, PDF p. 12)?
- **Fragment:** unnested SQL with aggregation in which "(1) the where clause consists of a conjunction of comparisons, (2) all attributes in the group by clause also appear in the select clause, and (3) there is no having clause" (§3.2, PDF p. 12).
- **Semantics:** databases hold sets of tuples; cores are compared under set or bag-set semantics (§2.2, PDF p. 6).
- **Domains:** integers or rationals, results stated per domain; they "can easily be generalized" to attributes of several types (§2.1 footnote 1, PDF p. 5).
- **One aggregate at a time:** comparable queries are equivalent iff their kernels are (Prop. 3.2, PDF p. 13).
- NULLs: not discussed.

## Approach

- **Case split:** test each query of a linear expansion (§2.4, PDF pp. 8–10); not for cntd, since "the result of a cntd-query cannot be evaluated from the results of each of its linearizations" (§7, PDF p. 28).
- **count:** for relational queries, functions counting how often a tuple is returned over databases made by "blowing up" one query are polynomials whose terms reveal surjective homomorphisms (§8.2, PDF pp. 31–34); with comparisons, a minimal counter-example and one database built from one q_L (Thm. 8.8 proof, PDF pp. 36–37).
- **sum:** without constants, a strictly increasing renaming of values to powers of a large M makes multiplicities readable from sums (Thm. 9.5 proof, PDF pp. 40–41); with constants, expansions over the virtual constants keep every case reduced (Thm. 4.9, PDF p. 20), and constant cases are matched by totals, variable cases one to one (§9.2, PDF pp. 41–47).

## Results

All are the authors' claims.
- **max, and likewise min (§6, PDF pp. 23–27; §5.3, PDF p. 22).** Max-queries are equivalent iff their cores dominate each other (Prop. 6.1); q is dominated by q′ iff a dominance mapping from q′ exists into each query of a linear expansion of q (Thm. 6.4); for relational cores, dominance is containment (Prop. 6.2). Over either domain, equivalence is Π₂ᵖ-complete, NP-complete for relational max-queries (Thm. 6.6), as is dominance (Thm. 6.5).
- **cntd (§7, PDF pp. 28–30).** Set-equivalent cores suffice (Prop. 7.1), but are not necessary with comparisons (Ex. 7.2). They are necessary when no variable of either query is both a possible preimage of the other's counted variable and in a comparison (Thm. 7.3); so relational cntd-queries are equivalent iff their cores are set-equivalent (Cor. 7.4), an NP-complete test (Cor. 7.5).
- **count (§8, PDF pp. 31–38).** Count-queries are equivalent iff their cores are bag-set-equivalent (Prop. 8.1). Relational conjunctive queries, constants allowed, are bag-set-equivalent iff isomorphic (Thm. 8.5), which fails with comparisons (Ex. 8.6). Queries with comparisons are bag-set-equivalent if their linear expansions are isomorphic (Thm. 8.7), and only if their expansions over the constants of both queries are (Thm. 8.8); this is claimed as the characterization of bag-set equivalence with constants and comparisons, open since Chaudhuri and Vardi 1993 (§10, PDF p. 48).
- **sum (§9, PDF pp. 39–47).** Bag-set-equivalent cores suffice (Prop. 9.1). Two sum-queries can be equivalent over the integers though their cores are not, and differ over the rationals (Ex. 9.2). Without constants, equivalence implies bag-set-equivalent cores (Thm. 9.5), also over databases restricted by "functional dependency or referential integrity constraints" ([functional dependency](#/glossary/functional-dependency)) and others with that property (PDF p. 41). Equivalence holds if the cores are weakly set-equivalent with linear expansions in balance and variable isomorphic (Thm. 9.8), and implies these with expansions over both queries' constants and virtual constants (Thm. 9.13). Without comparisons: equivalent iff cores bag-set-equivalent iff cores isomorphic (Thm. 9.14).
- **Tab. I (§5.3, PDF p. 22)** adds: with comparisons, cntd "not known", count and sum GI-hard and in PSPACE (Thm. 8.9, 9.15, PDF pp. 38, 47); relational count and sum GI-complete. Linear queries (no self-joins): polynomial, for cntd only relational ones (§5.2, PDF pp. 21–22); the authors add "In practice, linear queries occur frequently".

## Limits the authors state

- No constants in aggregate heads, "to simplify our presentation" (§3.1, PDF p. 11).
- Summing 1s does not carry sum results over to count "in a straightforward manner": those queries "are not safe", since the summed variable occurs in no relational atom (§2.1, PDF p. 5; §9.2, PDF p. 41).
- "it is not clear how to modify the characterization of Theorem 9.13 for the case of databases that satisfy integrity constraints" (§9.2.1, PDF p. 47).
- For Thm. 9.8 and Lemma 9.11, "We therefore just give an outline" (§9.2.1, PDF pp. 43–44).

## Open problems and building blocks

- **Open:** for cntd-queries "which may contain arbitrary comparisons, determining equivalence is an open problem" (§5.1, PDF p. 21), left "for future research" (§10, PDF p. 48).
- **Open:** "Finding tight upper and lower bounds for equivalence is another important open issue" (§10, PDF p. 48).
- **Open:** "We have not addressed equivalences among aggregate queries with a having clause"; Ross et al. 1998 on aggregation constraints "may be relevant" (§10, PDF p. 48).
- **Released:** nothing stated beyond the proofs in the article (§1, PDF p. 3).
- **To reuse it:** the fragment above; containment with comparisons needs "as many homomorphisms as there are queries in a linear expansion" (§2.4, PDF p. 10).

## On this site

- **Discussed in:** [Can SQL equivalence checkers be trusted?](#/challenges/checker_soundness) · [Minimal counterexamples](#/challenges/minimal_counterexamples) · [Canonical forms for queries](#/challenges/query_canonical_forms) · [Query equivalence: prove or refute](#/challenges/query_equivalence) · [Equivalence under schema constraints](#/challenges/schema_constrained_equivalence) · [SQL features that verifiers don't cover](#/challenges/verifier_coverage_gaps)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/theory-bag">theory-bag</a></span>
