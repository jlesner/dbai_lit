# Few Rows Tell Them Apart: Equivalence of Queries Mixing Set and Bag Semantics

**Few Rows Tell Them Apart** · preprint Sep 2026

Read: [PDF](https://arxiv.org/pdf/2609.09978) · [arXiv](https://arxiv.org/abs/2609.09978)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Computable bounds B such that agreement on all databases with ≤ B tuples per relation implies equivalence, for conjunctive queries mixing set and bag-set semantics (abstract).
- For CQs the bound is linear in query size for fixed width; declared keys shrink it for "key-anchorable" pairs, and for other keyed pairs a bound is open (§4).

## In plain words

Bounded SQL equivalence checkers search small databases for one where two queries differ; an empty search proves nothing, yet such verdicts are trusted (§1). The author seeks a computable size limit: queries that agree on every database with at most that many rows per table are equivalent. The setting is conjunctive queries (select-from-where blocks with ANDed conditions) under combined semantics, SQL's mix of duplicate-removing (DISTINCT) and duplicate-keeping counting, over tables without duplicate rows (abstract). For queries of one kind only, one row per table reference suffices; mixed queries can need more (§1).

The paper is proofs only. Without constraints or comparisons, the limit grows linearly with query size and exponentially with the number of counted columns in one table reference. Declared keys lower it under a condition linking counted columns to key columns (key-anchorability), and several classes with comparisons are covered (abstract). The author calls the keyed results "the first results on equivalence of multiset and combined queries" (duplicate-keeping and mixed ones) "in the presence of integrity constraints" (§1).

## Background and terms

**Terms to know:** [conjunctive query](#/glossary/conjunctive-query) · [combined semantics](#/glossary/combined-semantics) · [set semantics](#/glossary/set-semantics) · [bag-set semantics](#/glossary/bag-set-semantics) · [bounded verification](#/glossary/bounded-verification) · [small counterexample property](#/glossary/small-counterexample-property) · [homomorphism](#/glossary/homomorphism-containment-mapping) · [integrity constraint](#/glossary/integrity-constraint)

**The paper's own terms:**
- **set / multiset (counted) variable**: a non-output variable whose different values don't / do add copies of an answer (§2). Conjunctive queries here allow comparisons (`<`, `≤`, `=`, `≠`, …) in §5; a *relational* query has none (§2).
- **set-equivalent, satisfiable**: the standing assumption that the queries agree when copies are ignored and each returns something on some legal database (§2).
- **n-bound**: at most n rows per table; **legal**: meets the declared constraints; **|Q|**: the number of table references (atoms) in Q (§2).
- **multiset width w**: the most distinct counted variables in one atom (§3). **Key-width kw** counts only those at key columns (§4).
- **multiset-homomorphism**: a homomorphism that also maps the counted variables one-to-one into the other query's (§3).
- **canonical family, corner**: test databases built from a query: a block of fresh values per counted variable, one fixed value per other variable; at a corner each block has one or two values (§3).

**Builds on:** the multiset-homomorphism characterization of [Equivalence of Queries Combining…](#/papers/cohen2006setbag "Equivalence of Queries Combining Set and Bag-Set Semantics (2006)") and [Equivalence of Queries That…](#/papers/cohen2009multiplicities "Equivalence of Queries That Are Sensitive to Multiplicities (2009)") (Thm. 4, §3); [Optimal Implementation of Conjunctive…](#/papers/chandra1977conjunctive "Optimal Implementation of Conjunctive Queries in Relational Data Bases (1977)"), whose test database has one row per query atom (§2); Alon's Combinatorial Nullstellensatz, not listed here (§3); the [chase](#/glossary/chase) of [Equivalences among Relational Expressions](#/papers/aho1979equivalences "Equivalences among Relational Expressions (1979)") (§6).

## Problem and setting

- **Question:** "Given a class of queries, is there a computable bound n such that n-bounded equivalence implies equivalence?" (§2).
- **Semantics:** combined semantics over stored tables that are sets, "as is the case whenever every table declares a key" (§1). The author states that combined-semantics equivalence "is thus precisely the equivalence of SQL counting queries" (§2).
- **Constraints:** none (§3); declared keys (§4); keys plus acyclic foreign keys (§4 "Foreign keys"). Equivalence is judged over legal databases (§2).
- **Comparisons** (§5 only): column-versus-constant, except key-pinned ones (§5.3); values from "a dense linear order without endpoints, taken to be ℚ" (§5): the rationals, with a value between any two and none smallest or largest.
- **NULLs:** not discussed.

## Approach

- **Separation** (§3). How often the fixed answer appears is a polynomial in the block sizes. The product of all block sizes appears in Q's polynomial, and in Q′'s exactly when a multiset-homomorphism maps Q′ into Q (Prop. 5; Prop. A.3). When no such map exists and Q′ has no more counted variables than Q (a naming the paper calls free), the Nullstellensatz, a fact about polynomials, yields a corner where the counts differ. At a corner an atom yields at most 2 to the power of its counted variables rows (Lemma 6).
- **Thm. 7, no constraints, no comparisons** (with the §2 assumptions): inequivalent queries differ on a database of at most 2^w × max(|Q|, |Q′|) rows, and per table p at most 2^(w_p) × the larger count of p-atoms (w_p: the pair's width on p). So agreement up to the largest per-table bound proves equivalence.
- **Collapse** (Lemma 9): columns no query reads are merged into one, so the width counts only read columns.
- **Keys** (§4). Demotion (Lemma 11) stops counting a variable that keys determine from the output and the other counted variables, changing no answer; repeating it gives a key-reduct. A query is key-anchorable when its key-reducts have counted variables only at key columns, a decidable condition (Prop. B.3). The key-chase merges atoms that agree on a key; a key-chased, key-anchored query has legal corners (Lemma B.1).
- **Thm. 13, declared keys, no foreign keys, key-anchorable relational queries:** equivalent over legal databases exactly when their key-chased key-reducts are multiset-homomorphic both ways; otherwise a legal database of at most 2^kw × the larger key-chased reduct's size rows separates them.
- **Prop. 14:** a sufficient condition for key-anchorability of *well-formed* queries (each counted variable sits in an atom holding only output and counted variables); the author says foreign-key joins "as in star and snowflake schemas" (a central table with foreign keys to lookup tables) "always satisfy both" conditions.
- **Foreign keys:** a chase adds each referenced row with fresh uncounted variables (Lemma B.4).
- **Comparisons** (§5). Constants cut the number line into slots that hold the test values. Variables linked by sharing a column form a group: *directed* if its comparisons are strict and point one way, *retained* if all are output or counted, *isolated* if just one variable from each query, with no constant in its column (§5.2); set-equivalence forces an isolated pair's ranges to match (Lemma 20). A comparison is *pinned* when keys fix its variables from the output, so it only decides whether an answer appears (§5.3).

## Results

Proved results:
- **Thm. 7, Thm. 13:** the main bounds, stated above.
- **Thm. 15:** with keys and acyclic foreign keys, for relational pairs whose foreign-key chases are key-anchorable, Thm. 13's clauses hold for the chased queries, with bound 2^kw × the larger chased query's size. The chased size is "at most |Q| times the reference depth of the schema" (longest foreign-key chain; undefined in the paper).
- **Cor. 16:** under the same conditions, deciding equivalence is [NP-complete](#/glossary/np-complete-and-the-polynomial-hierarchy).
- **Thm. 18:** with no constraints and only column-versus-constant comparisons, if every group is directed, retained or isolated (non-strict comparisons at constants used only in non-strict comparisons on variables neither output nor counted first made strict), inequivalent queries differ on a database of at most 2^w|Q| rows.
- **Cor. 19, Cor. 21:** when every group is directed, equivalence means multiset-homomorphisms both ways respecting the value ranges; when every comparison is on an isolated column, multiset-homomorphism of the comparison-free parts.
- **Thm. 23:** with declared keys, every comparison pinned (column-versus-column allowed) and key-anchorable comparison-free bodies, inequivalent queries differ on a legal database of at most 2^kw|Q| rows.
- **Example 8:** a pair needing every block doubled, yet separated by a database below the bound (§3).

## Limits the authors state

- Stored relations are taken to be sets, "following common practice" (§1).
- The directed-or-retained criterion "is no short certificate" (no proof of equivalence small enough to check quickly), so "no counterpart of Corollary 16 accompanies Theorem 18" (§5.2).
- Prop. 14's conditions are not free: Example 12 is well-formed but not key-anchorable (§4).
- Demotion order changes the key-reduct and so how tight the witness is (App. B.2).

## Open problems and building blocks

- **Open:** queries in which demotion strands a counted variable off every key, a regime "not exotic" (§4 "The residual open case"); the comparison frontier (two-sided comparisons on projected-away values neither isolated nor key-determined, and unpinned column-versus-column comparisons; Remark 22); tightness: "whether the true threshold is polynomial in the query is open" (§7). Next steps: tables with duplicate rows, and "aggregation foremost" (§7).
- **Released:** nothing stated.
- **To reuse it:** the bounds tell a bounded checker how many rows per table to search for this fragment (§1; Thm. 7, 13, 15); up to them, the author says, "bounded search becomes a terminating, complete proof method" (§7). For Cor. 16's classes, deciding needs no search: "Enumeration is thus needed only to exhibit a counter-example, never to decide" (§4).

## On this site

- **Discussed in:** [Benchmarks with checkable ground truth](#/challenges/checkable_benchmark_ground_truth) · [Minimal counterexamples](#/challenges/minimal_counterexamples) · [Query equivalence: prove or refute](#/challenges/query_equivalence) · [Equivalence under schema constraints](#/challenges/schema_constrained_equivalence)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/bounded-theory">bounded-theory</a><a class="tag sub" href="#/tags/theory-bag">theory-bag</a></span>
