# The complexity of querying indefinite data about linearly ordered domains

**querying indefinite order data** · PODS 1992

Read: [PDF](https://dl.acm.org/doi/pdf/10.1145/137097.137902) · [DOI](https://doi.org/10.1145/137097.137902)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Complexity of evaluating positive existential (conjunctive and disjunctive) queries over databases that state only some order facts between points (abstract, §1).
- This preliminary version treats `<` only; ≤ and ≠ are deferred to "the full version" (PDF p. 1).
- Proves the Π₂ᵖ lower bound for containment of CQs with `<` that Klug left open (Thm 3.2 with the §1 reduction, PDF pp. 3, 9); cited by [How Can We Shrink…](#/papers/sternbach2026shrink "How Can We Shrink the Family of Test Databases? Query Containment with Nulls and Comparisons (2026)"), [HoTTSQL](#/papers/chu2016hottsql "HoTTSQL: proving query rewrites with univalent SQL semantics (2017)"), [XData](#/papers/chandra2014xdata "Data generation for testing and grading SQL queries (2015)").

## In plain words

Data may fix only part of an order: two witnesses' timelines can't be lined up exactly. The author asks how hard it is to answer a query over such data, where an answer counts only if it holds for every way of completing the facts into one timeline; he says such data is frequent (abstract, PDF p. 1). The paper proves complexity bounds for queries built from AND, OR and existential quantifiers, using only the strict before-comparison (§1, PDF p. 1). It reports that in general the problem is intractable even with the query fixed, and that one result implies checking whether one query's answers are always among another's, with inequalities, is complete for the second level of the [polynomial hierarchy](#/glossary/np-complete-and-the-polynomial-hierarchy), "solving an open problem" (abstract, PDF p. 1). With one-argument predicates and a fixed query, answering takes polynomial time, though with OR the proof only shows that an algorithm exists (abstract, PDF p. 1); with the query varying too, some polynomial cases need a bound on how many timelines run side by side (§1, PDF pp. 4–5).

## Background and terms

**Terms to know:** [conjunctive query](#/glossary/conjunctive-query) · [query containment](#/glossary/query-containment) · [data, query and combined complexity](#/glossary/data-query-and-combined-complexity) · [disjunctive normal form (DNF)](#/glossary/disjunctive-normal-form-dnf) · [homomorphism (containment mapping)](#/glossary/homomorphism-containment-mapping) · [co-NP](#/glossary/co-np) (used without definition, Tab. 1, PDF p. 4)

**The paper's own terms:**
- **indefinite order database**: ordinary facts plus order facts `u < v` between order constants, which name unknown points of a linearly ordered domain and "may be thought of as a special sort of null value" (§1, PDF p. 1).
- **entailment, D ⊨ Φ**: query Φ holds in every model of database D, i.e. under every compatible linear order, an "open world semantics" (§1, PDF p. 1); distinct constants may denote the same point (§2, PDF p. 6).
- **Fin, Z, Q**: time as a finite order, integers or rationals (§2, PDF p. 6). **Minimal models**: topological sorts of the order facts, ties allowed (§2, PDF p. 7).
- **positive existential query**: a yes/no sentence using only AND, OR and existential quantifiers, in DNF; **conjunctive** without OR, **disjunctive** with it; **tight** if every variable of each disjunct occurs in an ordinary fact (§2, PDF pp. 5–6).
- **expression complexity**: the query varies, the database is fixed (§2, PDF p. 8); the glossary's query complexity.
- **monadic**: every predicate takes one argument (§1, PDF p. 3).
- **width**: the most order constants of which none is known to precede another; reports of k independent observers have width k (§2, PDF p. 8).
- **sequential query**: its points form one chain; it asks "does a particular sequence of events occur?" (§1, PDF p. 4). A **path** is a maximal sequential part of a query or database, a word of predicate sets; a **subword** embeds into another word in order (§4, PDF p. 10).
- **power automaton**: a finite automaton whose transitions test whether a set of predicates is or isn't contained in the input symbol (§5, PDF p. 12).
- **well-quasi-order**: a reflexive, transitive relation where every nonempty subset has "a non-empty finite set of (inequivalent) minimal elements" (Def. 6.1, PDF p. 14).
- **Π₂ᵖ**: the polynomial hierarchy's second level; Π₂-SAT, true formulas: for every truth assignment to some variables, one to the rest makes a propositional formula true, is complete for it (§3, PDF p. 8). **PTIME**: polynomial time.

**Builds on:**
- Klug [12] ([On conjunctive queries containing…](#/papers/klug1988inequalities "On conjunctive queries containing inequalities (1988)")): containment of conjunctive queries with inequalities, a Π₂ᵖ upper bound but no lower bound (§1, PDF p. 3), which the paper says its Thm. 3.2 supplies.
- Chandra and Merlin [4] ([Optimal Implementation of Conjunctive…](#/papers/chandra1977conjunctive "Optimal Implementation of Conjunctive Queries in Relational Data Bases (1977)")): the homomorphism theory that, the paper says, shows containment of conjunctive queries NP-complete (§1, PDF p. 3).
- Allen's interval algebra [2], of time intervals, and Vilain and Kautz [24], who restrict temporal data to points with relations {<, ≤, ≠}, where deriving point relations is polynomial [18, 19] (§1, PDF p. 3).

## Problem and setting

- **Question:** the data, expression and combined complexity of deciding D ⊨ Φ (§1, PDF p. 1), and which restrictions (monadic predicates, bounded width, sequential queries, bounded disjuncts) make it polynomial (§1, PDF pp. 3–5).
- **Order relations:** "In this preliminary version of the paper, we confine ourselves to results for databases and queries which contain the order relation < only" (§1, PDF p. 1).
- **Semantics:** two kinds of values, objects and time points; linear orders of type Fin, Z or Q; consistent databases and queries only (§2, PDF pp. 5–7). The paper states that all its results hold under any of the three (§1, PDF p. 4).
- **Containment** is over relational databases with definite data and set answers (§1, PDF p. 3).
- **No constants in queries**, by replacing each with a new monadic predicate, "for most purposes" without loss of generality (§2, PDF p. 6).

## Approach

- **Semantics (§2, PDF pp. 6–7).** Tight queries get the same answers under all three (Prop. 2.2); one-way reductions to Fin (Prop. 2.3, Cor. 2.5) carry upper bounds. Minimal models suffice (Cor. 2.9).
- **Upper bounds (§3, PDF p. 8).** Minimal models are built in polynomially many nondeterministic steps; checking a query on one model is in NP (Vardi [22]).
- **Thm. 3.2's reduction (PDF pp. 8–9).** From Π₂-SAT: a small database per universal variable makes it true or false in every model, each value alone in some model; fixed And/Or/Not facts let the query evaluate the formula. Three-argument predicates "may be eliminated using a well-known reduction" (PDF p. 8).
- **Containment (§1, PDF p. 3; §3, PDF p. 9).** One query is treated as an indefinite order database and the other evaluated in it, so containment of conjunctive queries corresponds to combined complexity.
- **Monadic conjunctive queries (§4, PDF pp. 9–12).** A query holds exactly when each of its paths does (Lemma 4.1); a sequential query holds exactly when it is a subword of some database path (Lemma 4.2), whose proof builds a falsifying model if one exists.
- **Bounded width (§5, PDF pp. 12–13).** Polynomial-size power automata recognize a bounded-width database's models and a query's falsifying models; via Lemma 5.2, entailment becomes an automaton emptiness test.
- **Disjunctive data complexity (§6, PDF pp. 13–15).** For a fixed finite predicate set, monadic databases are well-quasi-ordered by their paths; every database above one that entails a fixed query entails it too, so finitely many minimal ones decide it.

## Results

The author's claims, for < only; lower bounds can be established with conjunctive queries; upper bounds also cover disjunctive ones (§1, PDF p. 4). *Both varying* means combined complexity.
- **Tab. 1 (PDF p. 4):** any number of arguments per predicate: data co-NP-complete, expression NP-complete, combined Π₂ᵖ-complete; monadic: data and expression PTIME, combined co-NP-complete. Prop. 3.1 (PDF p. 8) gives those upper bounds; Klug noted part (1).
- **Thm. 3.2 (PDF p. 8):** with both varying, conjunctive queries using two-argument predicates are Π₂ᵖ-hard. The paper concludes a Π₂ᵖ lower bound for containment of conjunctive queries with inequalities, "solving an open problem from Klug" (§3, PDF p. 9).
- **Thm. 3.3, 3.4 (PDF p. 9):** some fixed conjunctive query with two-argument predicates has co-NP-hard data complexity; some fixed database has NP-hard expression complexity for conjunctive queries.
- **Cor. 4.3, 4.4 (PDF p. 11):** over monadic databases, sequential queries are polynomial with both varying; a fixed conjunctive monadic query takes linear time.
- **Thm. 4.5 (PDF p. 11):** with both varying, conjunctive queries of width two over a fixed set of two monadic predicates are co-NP-hard.
- **Prop. 5.1 (PDF p. 12):** with both varying, bounded disjunctions of sequential queries over arbitrary databases, with six fixed monadic predicates, are co-NP-hard.
- **Thm. 5.3 (PDF p. 12):** width-bounded monadic databases with monadic queries of boundedly many disjuncts are polynomial with both varying.
- **Prop. 5.4 (PDF p. 13):** width-bounded databases over four monadic predicates with unboundedly many sequential disjuncts are co-NP-hard. With Thm. 4.5 and Prop. 5.1, the paper says Thm. 5.3 "characterizes the maximal class" with PTIME combined complexity in its parameters (cf. Fig. 4, PDF p. 5).
- **Thm. 5.5–Prop. 5.8 (PDF p. 13):** width-bounded monadic databases with conjunctive queries are polynomial with both varying; monadic disjunctive queries are in co-NP with both varying; monadic databases have polynomial expression complexity for conjunctive and disjunctive queries.
- **Thm. 6.4 (PDF p. 14):** each fixed monadic disjunctive query has linear-time data complexity, by a non-constructive proof.

## Limits the authors state

- Only < is treated; "The full version will give a more complete analysis including ≤ and ≠" (§1, PDF p. 1).
- Monadic predicates are "insufficiently expressive to represent the interval data required in many applications" (§1, PDF p. 3); the author does not "wish to claim" the gene-alignment query class "is biologically realistic" (§1, PDF p. 4).
- A query's paths can be exponentially many, so for Cor. 4.4 "the constant of proportionality may be very large", and per-path testing is not polynomial when the query grows (§4, PDF p. 11).
- Thm. 5.3 "probably cannot be generalized" to arbitrarily many disjuncts (§5, PDF p. 13).
- Thm. 6.4 gives no algorithm and "is of no practical significance until an alternate constructive proof can be found, or further analysis makes the present proof constructive"; the number of minimal databases is expected to be exponential in the query size (§6, PDF p. 14).

## Open problems and building blocks

- **Open:** explicit polynomial algorithms per query need further analysis; whether any algorithm computes the minimal databases is open, and the author conjectures one exists but has "not yet been able to provide this algorithm" (§6, PDF p. 14). He knows no case besides conjunctive queries where they can be computed (§6, PDF p. 15).
- **Released:** Nothing stated.
- **To reuse it:** Cor. 4.3's procedure runs in O(n) time on a random access machine for a fixed predicate set, O(n log n) if it may grow (§4, PDF p. 11).

## On this site

- **Discussed in:** [Query equivalence: prove or refute](#/challenges/query_equivalence)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/bounded-theory">bounded-theory</a><a class="tag sub" href="#/tags/theory-set">theory-set</a></span>
