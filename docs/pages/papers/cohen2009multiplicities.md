# Equivalence of Queries That Are Sensitive to Multiplicities

**Equivalence of Queries That…** · VLDB J. 18(3) 2009

Read: [PDF](https://link.springer.com/content/pdf/10.1007/s00778-008-0122-1.pdf) · [DOI](https://doi.org/10.1007/s00778-008-0122-1)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Extends [Equivalence of Queries Combining…](#/papers/cohen2006setbag "Equivalence of Queries Combining Set and Bag-Set Semantics (2006)") with bag semantics, full proofs and positive multiset queries.
- Positive multiset queries are equivalent iff their reduced linear expansions are isomorphic (Thm 4.7); databases with one copy per atom can't always separate copy-sensitive queries (Remark 4.8).
- The "Cohen'09" whose framework and canonical database family [Few Rows Tell Them Apart](#/papers/cohen2026fewrows "Few Rows Tell Them Apart: Equivalence of Queries Mixing Set and Bag Semantics (2026)") builds on for its size bounds (appendix).

## In plain words

SQL mixes rules about duplicate rows: a plain SELECT keeps them, DISTINCT removes them, an EXISTS subquery ignores how many rows match, and a stored table may repeat a row. Classic theories of when two queries agree assume one rule throughout: set semantics (no duplicates), bag semantics (tables and results may repeat rows) or bag-set semantics (duplicate-free tables, repeats in results). The author argues that "real SQL queries often combine elements of set, bag and bag-set semantics", and that characterizing equivalence is "widely believed to be the key" to query optimization and query rewriting (§1, PDF p. 1). The paper defines queries whose non-output variables and table references are each marked as counting copies or not, gives a sufficient condition for equivalence, and gives exact conditions for five classes (abstract, PDF p. 1; §1, PDF p. 4). It shows two queries can agree on every database as small as the queries and still differ (Ex. 2.15, PDF p. 8). The author calls the paper "the first to consider combining bag semantics with bag-set or set semantics" (§1, PDF p. 4).

## Background and terms

**Terms to know:** [set semantics](#/glossary/set-semantics) · [bag semantics](#/glossary/bag-semantics) · [bag-set semantics](#/glossary/bag-set-semantics) · [combined semantics](#/glossary/combined-semantics) · [query equivalence](#/glossary/query-equivalence) · [query containment](#/glossary/query-containment) · [homomorphism (containment mapping)](#/glossary/homomorphism-containment-mapping) · [small counterexample property](#/glossary/small-counterexample-property) · [Datalog](#/glossary/datalog) (the paper's notation: a head of output variables, then a body of conditions joined by "and", Def. 2.2, PDF p. 5; its subgoals, the atoms or comparisons in a body, are used without definition, §2.5, PDF p. 8) · [dense domain](#/glossary/dense-domain) (Remark 4.2, PDF p. 10)

**The paper's own terms:**
- **Bag-set semantics, here**: stored tables may hold duplicates, but the result ignores how many copies are stored (Remark 2.11, PDF p. 7).
- **Atom**: in a query, a reference to a table, such as A(x, y) for table A; in a database, a stored row (§2.1–2.2, PDF pp. 4–5).
- **Copy number, copy-sensitive atom, copy variable**: a database may hold N copies of a row (§2.1, PDF p. 4); an atom with a copy variable i, written A(x; i), ranges i over 1 to N and so matches once per copy; omitting it "essentially gives the same effect as removing duplications in the database" (§2.2, PDF p. 5; Remark 2.8, PDF p. 6).
- **Set and multiset variables**: each non-output variable is a set variable, whose different values "do not contribute to the multiplicity" of an answer, or a multiset variable, whose values do (§2.2, PDF p. 5).
- **Query classes** (§2.2, PDF p. 5): *conjunctive*: one disjunct, any kind of atom (footnote 1, PDF p. 3), wider than the glossary's [conjunctive query](#/glossary/conjunctive-query); *relational*: conjunctive, without negation or comparisons; *positive*: no negated atoms; *copy insensitive*: no copy variables; *set query*: no multiset variables; *multiset query*: no set variables.
- **Combined semantics, as defined here** (Def. 2.7, PDF p. 6): per disjunct, one output tuple for each assignment of the head and multiset variables that extends to a full match; disjuncts add up as bags. Set, bag and bag-set semantics are special cases (Prop. 2.12, PDF pp. 7–8).
- **Multiset-homomorphism** (Def. 3.1, PDF p. 8): a homomorphism between one-disjunct queries whose target's comparisons imply the mapped ones and which maps multiset variables one-to-one into multiset variables, "the only difference" from an ordinary homomorphism (PDF p. 9). Queries are *multiset-homomorphic* when their disjuncts pair up with such maps both ways (Def. 3.2, PDF p. 9).
- **Reduced linear expansion** (§4, PDF pp. 10–11): the query split into one query per disjunct and per complete ordering of its variables and a given set of constants, with implied equalities substituted and duplicate atoms removed (Def. 4.4). *Isomorphic*: identical up to renaming variables (PDF p. 11).
- **Canonical databases, in §7** (PDF p. 18): one per complete ordering of the terms of each subset of a query's disjuncts, a family, unlike the glossary's single [canonical database](#/glossary/canonical-database).
- **Small counterexample property, as stated here** (§2.5, PDF p. 8): inequivalent queries differ on a database "which contains as many atoms as there are subgoals" in either query.

**Builds on:**
- Cohen (PODS 2006) [Equivalence of Queries Combining…](#/papers/cohen2006setbag "Equivalence of Queries Combining Set and Bag-Set Semantics (2006)"), the early version (§1, PDF p. 4).
- Cohen, Nutt and Sagiv (2007) [Deciding Equivalences among Conjunctive…](#/papers/cohen2007aggregate "Deciding Equivalences among Conjunctive Aggregate Queries (2007)") and Cohen, Sagiv and Nutt (2005), whose proof techniques Theorems 4.7, 5.3 and 8.1 extend (§1, PDF p. 4; Remarks 4.8, 5.4, 8.2, PDF pp. 13, 16, 20).
- Chaudhuri and Vardi (1993) [Optimization of real conjunctive queries](#/papers/chaudhuri1993real "Optimization of real conjunctive queries (1993)") and Ioannidis and Ramakrishnan (1995) [Containment of conjunctive queries](#/papers/ioannidis1995bag "Containment of conjunctive queries: beyond relations as sets (1995)"), who introduced Datalog with bag-set and bag semantics (§1, PDF p. 1).
- Chandra and Merlin (1977) [Optimal Implementation of Conjunctive…](#/papers/chandra1977conjunctive "Optimal Implementation of Conjunctive Queries in Relational Data Bases (1977)"), the homomorphism characterization under set semantics (§1 "Related work", PDF p. 3).

## Problem and setting

- **Question:** for a class of queries, decide whether two queries return the same bag of answers on every database (§2.5, PDF p. 8).
- **Language:** non-recursive Datalog with "or", comparisons (<, ≤, >, ≥, ≠), negated table atoms and copy-sensitive atoms (never negated); every variable appears in a non-negated table atom; every disjunct is satisfiable (§2.2, PDF p. 5).
- **Assumption 2.3** (PDF p. 5): comparisons don't force a multiset variable to equal a constant or another variable; "All our results can easily be extended if these assumptions are lifted".
- **§4 only:** comparisons range over a dense domain (Remark 4.2, PDF p. 10).
- **SQL:** a thorough discussion of translating SQL into Datalog is "beyond the scope" of the paper (§1, PDF p. 3).
- NULLs: not discussed.

## Approach

- **Sufficient test:** multiset-homomorphic queries are equivalent (Thm. 3.4, PDF p. 9).
- **Exact tests by counting** (§§4–5, PDF pp. 10–16): to separate inequivalent queries, the proofs build a family of databases indexed by tuples of natural numbers, express how often each query returns a fixed tuple as a polynomial in those numbers, and show the polynomials differ.
  - In §4 the family holds the same few rows with varying copy numbers (proof of Thm. 4.7, PDF pp. 12–13). One database with one copy of each row is not enough here: Q(x) ← A(x; i) and Q′(x) ← A(x) "return the same answers for databases that do not contain multiple occurrences of the same atom, yet are not equivalent in general" (Remark 4.8, PDF p. 13).
  - In §5 the family holds one copy each of many rows, made by "blowing up" the query body (PDF p. 14). First, equivalent copy-insensitive relational queries have equally many multiset variables (Lemma 5.1, PDF p. 14); then, if there is no multiset-homomorphism from the second query to the first, the counts are different polynomials (Lemma 5.2, PDF p. 15), which contradicts equivalence (PDF p. 16).

## Results

- **No small counterexamples under combined semantics:** Q7(x) ← A(x, y) without multiset variables and Q8(x) ← A(x, y) with multiset variable y agree on any database "that contains a single atom" but differ on a two-row one (Ex. 2.15, PDF p. 8).
- **Bag semantics has them:** for queries without negation, possibly with constants, comparisons and "or", inequivalent queries differ under bag semantics on a database with "as many unique atoms as there are subgoals" in either query (Thm. 2.14, PDF p. 8, from Cor. 4.9, PDF p. 13, and Prop. 2.12, PDF pp. 7–8).
- **Positive multiset queries** (no negation, no set variables), over a dense domain: equivalent iff their reduced linear expansions over the constants of both queries are isomorphic (Thm. 4.7, PDF p. 12), iff these are multiset-homomorphic both ways (Cor. 4.10, PDF pp. 13–14). Inequivalent ones differ on a database of the size in Thm. 2.14 (Cor. 4.9, PDF p. 13).
- **Copy-insensitive relational queries:** equivalent iff multiset-homomorphic (Thm. 5.3, PDF p. 16).
- **Conjunctive join queries** (no atom or comparison mentions both a set and a multiset variable, §6, PDF p. 16): equivalent iff set-equivalent and two derived multiset queries are equivalent (Thm. 6.2, PDF p. 17); without copy variables this reduces to set and bag-set equivalence.
- **Positive set queries** (no negation or multiset variables): equivalent iff they agree on every canonical database of either query (Thm. 7.1, PDF p. 18); without comparisons, iff their disjuncts pair up into set-equivalent pairs (Thm. 7.2, PDF p. 18), iff multiset-homomorphic (Cor. 7.3, PDF p. 19).
- **Conjunctive quasilinear queries** (no table in a non-negated atom occurs more than once): equivalent iff multiset-homomorphic (Thm. 8.1, PDF p. 19).
- **Complexity** (§9, PDF p. 20): deciding whether two queries are multiset-homomorphic is [NP-complete](#/glossary/np-complete-and-the-polynomial-hierarchy); for quasilinear queries equivalence "can be determined in polynomial time".
- **Containment:** known [undecidability](#/glossary/decidable-and-undecidable) results under bag and bag-set semantics "immediately yield undecidability of containment for the corresponding classes" (§9, PDF p. 20).
- **By-product:** equivalence characterizations for bag semantics, "an important problem for which almost no previous results are available" (§1, PDF p. 4; §9, PDF p. 20).

## Limits the authors state

- Thm. 3.4's condition "is not necessary" (§3, PDF p. 9).
- §4 assumes a dense domain; for the integers "Some care must be taken" in choosing Thm. 4.7's set of constants, as in Cohen, Nutt and Sagiv (2007) (Remark 4.2, PDF p. 10).
- Extending Thm. 4.7 to set variables "would be useful", but "the crux of the proof" relies on a property that "would no longer hold" with set variables (Remark 4.8, PDF p. 13).
- §6 treats only conjunctive join queries "to simplify the exposition"; its results "can be extended to join queries with disjunctions" (PDF p. 16).
- Non-existential subqueries are captured in "limited single level" form, over a single relation (§9, PDF p. 20).

## Open problems and building blocks

- **Open** (§9, PDF p. 20):
  - rewriting queries with views under combined semantics;
  - equivalence under integrity constraints: "the general equivalence problem under constraints is still an open question";
  - containment: "it seems likely that characterizing containment is at least as hard, if not more difficult, than characterizing equivalence";
  - exact complexity: where equivalence "is not determined by multiset-homomorphisms, no tight complexity bounds are known".
- **Released:** Nothing stated.
- **To reuse it:** queries in the paper's syntax (§2.2, PDF p. 5); for §4, a dense domain (Remark 4.2, PDF p. 10).

## On this site

- **Discussed in:** [Minimal counterexamples](#/challenges/minimal_counterexamples) · [Canonical forms for queries](#/challenges/query_canonical_forms) · [Query equivalence: prove or refute](#/challenges/query_equivalence)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/bounded-theory">bounded-theory</a><a class="tag sub" href="#/tags/theory-bag">theory-bag</a></span>
