# Optimization of real conjunctive queries

**Optimization of real conjunctive queries** · PODS 1993

Read: [DOI](https://doi.org/10.1145/153850.153856)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Bag semantics for CQs (SQL without DISTINCT), which it says Dayal et al.
- Bag-set equivalence is isomorphism after removing duplicate atoms (Thm 7.11); mostly without proofs.
- The open problem `marcinkowski2025*` and [Attacking Diophantus](#/papers/konstantinidis2026diophantus "Attacking Diophantus: Special Cases of Bag Containment (2026)") work on.

## In plain words

Theory knew how to simplify [conjunctive queries](#/glossary/conjunctive-query) (SELECT–FROM–WHERE queries whose WHERE clause only equates columns) by deleting joins, but almost always under [set semantics](#/glossary/set-semantics), ignoring duplicates. SQL keeps duplicates unless asked to remove them, because removing them "might be computationally expensive" and aggregates such as COUNT depend on them, so the authors re-examine those results (§1, PDF p. 1). They study containment and equality of query answers under [bag semantics](#/glossary/bag-semantics), also over duplicate-free tables. They prove that two conjunctive queries return the same rows with the same counts on every database exactly when they are identical up to renaming variables and reordering conditions. So under bag semantics such queries cannot be optimized by removing any of their conditions (joins), only by reordering them (§1, PDF p. 2). Containment with duplicates counted, they prove, is at least as hard as a class believed harder than NP; whether it is [decidable](#/glossary/decidable-and-undecidable) they "do not even know" (§1, PDF p. 2). They present this as showing that "optimization techniques from the set-theoretic setting do not carry over" (abstract, PDF p. 1).

## Background and terms

**Terms to know:** [conjunctive query](#/glossary/conjunctive-query) · [set semantics](#/glossary/set-semantics) · [bag semantics](#/glossary/bag-semantics) · [bag-set semantics](#/glossary/bag-set-semantics) · [query containment](#/glossary/query-containment) · [query equivalence](#/glossary/query-equivalence) · [homomorphism (containment mapping)](#/glossary/homomorphism-containment-mapping) · [NP-complete and the polynomial hierarchy](#/glossary/np-complete-and-the-polynomial-hierarchy) · [graph isomorphism](#/glossary/graph-isomorphism)

**The paper's own terms:**
- **bag, multiplicity, subbag, bag union**: a bag annotates each element with its multiplicity, the number of copies, written (t; [m]); B is a subbag of B′ if every element of B is in B′ at least as often; bag union adds multiplicities (§2, PDF pp. 2–3).
- **SQL conjunctive query**: `SELECT columnlist FROM rellist WHERE equalitylist`, equalitylist being a conjunction of equalities among attributes (§3.1, PDF p. 3).
- **logical conjunctive query**: a rule `Query(X) :- C1(X1), …, Cn(Xn)`, a head and a body of conjuncts (also literals); equalities are repeated variables; the head's variables are the **distinguished variables** (§3.2, PDF p. 4).
- **assignment mapping**: a choice of database values for the query's variables that sends every conjunct to a stored tuple. It yields the output tuple with multiplicity the product of the matched tuples' multiplicities; the query's result is the bag union over all such mappings (§3.2, PDF p. 4).
- **onto containment mapping**: a containment mapping from Q′ to Q whose image, counted as a bag of conjuncts, includes every conjunct of Q as often as Q has it (§4.2, PDF p. 6).
- **isomorphic**: there are one-to-one containment mappings from Q′ onto Q and from Q onto Q′ (§5, PDF p. 7).
- **set-valued relation or database**: one with no duplicate tuples (§7, PDF p. 9). **Bag-set containment and equivalence** are bag containment and equivalence required only over set-valued databases (§7.1, PDF p. 9; §7.2, PDF p. 10).
- **variable-onto**: a containment mapping from Q′ to Q whose image covers every variable of Q (§7.1, PDF p. 10).
- **canonical representation**: the query with all duplicate conjuncts removed (§7.2, PDF p. 10).

**Builds on:**
- Chandra and Merlin [CM77] ([Optimal Implementation of Conjunctive…](#/papers/chandra1977conjunctive "Optimal Implementation of Conjunctive Queries in Relational Data Bases (1977)")), with Aho, Sagiv and Ullman [ASU79A] ([Equivalences among Relational Expressions](#/papers/aho1979equivalences "Equivalences among Relational Expressions (1979)")) and [ASU79B]: set containment is NP-complete and holds exactly when a containment mapping exists; every conjunctive query has a minimal equivalent (§1, PDF p. 2; §4.2, PDF p. 5; §5, PDF pp. 7–8).
- Sagiv and Yannakakis [SY81] ([Equivalences Among Relational Expressions…](#/papers/sagiv1980union "Equivalences Among Relational Expressions with the Union and Difference Operators (1980)")): under set semantics a conjunctive query contained in a union is contained in one member (§6.3, PDF pp. 8–9).
- Dayal, Goodman and Katz [DGK82], who the paper says "first addressed" bag containment and equivalence, and Klausner [K86], in an extended relational algebra with more control over duplicates than SQL, where the problems are harder (§8, PDF pp. 10–11).
- Ioannidis and Ramakrishnan [IR92], a 1992 technical report that "independently addressed" bag containment, finding Prop. 4.4 and Thm. 4.6 too (§4.2, PDF p. 6; §8, PDF p. 11).

## Problem and setting

- **Question:** do the set-semantics results on containment, equivalence and minimization of conjunctive queries carry over to bag semantics, which SQL has (§1, PDF pp. 1–2)?
- **Query class:** conjunctive queries with equality joins only (§3.1, PDF p. 3), and their unions, SQL's `UNION ALL` (§6, PDF p. 8).
- **Semantics:** set semantics; bag semantics over relations that may hold duplicates (§3.2, PDF p. 4); and bag semantics over set-valued databases, a case the authors say "arise often in practice" (§7, PDF p. 9).
- **What "correct" means:** Q is bag contained in Q′ if Q's result is a subbag of Q′'s on every database, and bag equivalent if the two are equal as bags (§4.1, PDF p. 5; §5, PDF p. 7).
- **NULLs:** not discussed.

## Approach

The results are stated through containment mappings, strengthening the set-semantics test of [CM77] (§4.2, PDF p. 5).

- **SQL and logic agree:** an SQL conjunctive query and its translation (sketched for queries with no table repeated in FROM) return the same bag on every database (Thm. 3.8, PDF p. 5).
- **Bag containment is stricter:** it implies set containment, not conversely (Prop. 4.1, Example 4.2, PDF p. 5).
- **Necessary conditions:** if Q is bag contained in Q′, then (a) for every relation name, Q′ has at least as many conjuncts with that name as Q, and (b) every conjunct of Q is in the image of some containment mapping from Q′ to Q (Prop. 4.3, PDF pp. 5–6).
- **Sufficient condition:** an onto containment mapping from Q′ onto Q guarantees that Q is bag contained in Q′ (Prop. 4.4, PDF p. 6).
- **Exact for one class:** if Q has no two conjuncts with the same relation name, then Q is bag contained in Q′ exactly when there is a containment mapping from Q′ onto Q (Thm. 4.6, PDF p. 6). In general an onto mapping is not necessary (Example 4.7, PDF p. 6).
- **Set-valued databases:** bag-set containment needs, for every variable of Q, a containment mapping from Q′ to Q that covers it (Prop. 7.4, PDF p. 9); a variable-onto mapping from Q′ to Q is enough (Prop. 7.5, PDF p. 10), but not necessary (§7.1, PDF p. 10).
- **Hardness through reductions:** bag containment reduces in polynomial time to bag-set containment (Prop. 7.8, PDF p. 10).

## Results

- **Thm. 4.8 (PDF p. 6):** deciding whether a containment mapping from Q′ onto Q exists is NP-complete.
- **Thm. 4.9 (PDF p. 7):** bag containment of conjunctive queries is Π₂ᵖ-hard: at least as hard as every problem at the second level of the polynomial hierarchy; it "suggests that bag containment is indeed harder than set containment".
- **Thm. 5.2 (PDF p. 7):** two conjunctive queries are bag equivalent exactly when they are isomorphic. **Cor. 5.3 (PDF p. 7):** bag equivalence of conjunctive queries is polynomially equivalent to graph isomorphism, so it is "perhaps easier" than set equivalence, which is NP-complete (§5, PDF p. 7).
- **Consequence (§5, PDF p. 8):** replacing a query by an equivalent one with fewer conjuncts "is simply not applicable in the bag-theoretic setting". §9 (PDF p. 11) calls this "an a posteriori justification of the current emphasis on join ordering rather than on join elimination in commercial database management systems".
- **Prop. 6.3 (PDF p. 9):** under bag semantics there are conjunctive queries Q, Q′, Q″ with Q bag contained in the union of Q′ and Q″ but in neither alone, so the Sagiv–Yannakakis result fails.
- **Thm. 7.7 (PDF p. 10):** deciding whether a variable-onto containment mapping exists is NP-complete. **Thm. 7.9 (PDF p. 10):** bag-set containment is Π₂ᵖ-hard, from Prop. 7.8 and Thm. 4.9.
- **Thm. 7.11 (PDF p. 10):** over set-valued databases, two conjunctive queries are equivalent exactly when their canonical representations (duplicate conjuncts removed) are bag equivalent. **Cor. 7.12 (PDF p. 10):** bag-set equivalence is polynomially equivalent to graph isomorphism. The authors conclude that "only very limited optimization, namely that of removing duplicate literals, is possible in the case where relations are set-valued" (§7.2, PDF p. 10).

## Limits the authors state

- SQL's operational semantics is outlined: "The details will be described in the full paper" (§3.1, PDF p. 3).
- The translation to logical syntax assumes "no relation name is repeated more than once in rellist" (§3.2.1, PDF p. 4).
- Testing on finitely many databases with symbolic multiplicities, which "can sometimes" replace all databases, "does not yield a decision procedure for bag containment"; it works "in certain cases, such as the queries in Example 4.7" (§4.2, PDF p. 6).
- The onto-mapping condition is "in general sufficient but not necessary, so Theorem 4.8 tells us nothing about the complexity of bag containment in general" (§4.3, PDF p. 7); likewise the condition of Thm. 7.7 "does not tell us about the complexity of bag-set containment" (§7.1.1, PDF p. 10).

## Open problems and building blocks

  - "The precise complexity of bag containment is an open problem. We do not even know if the problem is decidable." (§4.3, PDF p. 7)
  - "As in the unrestricted case, the decision problem for bag-set containment remains open." (§7.1.1, PDF p. 10)
  - Whether Thm. 5.2 carries over to conjunctive queries with inequalities, citing Klug [K88] ([On conjunctive queries containing…](#/papers/klug1988inequalities "On conjunctive queries containing inequalities (1988)")) (§5, PDF p. 8).
  - For unions, "a first step" toward optimization "would be to obtain a characterization of bag equivalence for unions of conjunctive queries" (§6.3, PDF p. 9).
  - Promised for the full paper: the finite symbolic test above (§4.2, PDF p. 6), an algorithm for finding onto containment mappings (§4.3, PDF p. 7), and databases where only some relations are set-valued (§7.2, PDF p. 10).
- **Released:** Nothing stated.
- **To reuse it:** the results cover conjunctive queries with equality joins, and unions of them in §6 (PDF pp. 8–9). The authors call the intractability suggested by NP-completeness of set containment "somewhat misleading": it is in the size of the queries, "which is typically much smaller than the size of the database" (§4.3, PDF p. 7).

## On this site

- **Discussed in:** [Refuting faulty rewrite rules](#/challenges/faulty_rewrite_rules) · [Canonical forms for queries](#/challenges/query_canonical_forms) · [Query equivalence: prove or refute](#/challenges/query_equivalence) · [Equivalence under schema constraints](#/challenges/schema_constrained_equivalence) · [Verified query speedups](#/challenges/verified_query_speedup)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/theory-bag">theory-bag</a></span>
