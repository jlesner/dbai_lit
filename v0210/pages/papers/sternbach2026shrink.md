# How Can We Shrink the Family of Test Databases? Query Containment with Nulls and Comparisons

**How Can We Shrink…** · preprint Sep 2026

Read: [PDF](https://arxiv.org/pdf/2609.16218) · [arXiv](https://arxiv.org/abs/2609.16218)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Containment of CQs over databases with NULLs (SQL 3-valued logic) and of CQs with order comparisons; both Π₂ᵖ-complete by prior work (abstract).
- Shrinks the exponential family of test databases: for nulls, containment is in NP when the toggled set V_t has constant size (Cor. 3.4); combined, the family size is FPT in three local parameters (Thm. 5.2).
- Complete families of small databases: passing all of them certifies containment, by running the containing query in an engine (abstract, §6); set semantics (bags are left open, §7) and rational values (§2).

## In plain words

One query is contained in another if, on every database, its answers are among the other's; two queries are equivalent when containment holds both ways. For the simplest queries (joins and equality filters, without OR, NOT or aggregates), one test database built from the first query decides containment. The authors note that this test breaks down when databases hold SQL NULLs or queries compare values by order: the known tests then need exponentially many test databases, "leaving no practical route to certifying equivalence" (abstract). They motivate the problem with query optimization and rewriting, including LLM-proposed rewrites (§1).

The paper is theory only, and presents its advance as replacing the known exponential families by smaller ones (§1). With NULLs, only a special set of "toggled" variables needs to vary, which puts containment in [NP](#/glossary/np-complete-and-the-polynomial-hierarchy) when that set has constant size (abstract; §3). With NULLs and comparisons together, the number of test databases is bounded by a function of three parameters of the two queries that the authors call local (abstract).

## Background and terms

**Terms to know:** [conjunctive query](#/glossary/conjunctive-query) · [query containment](#/glossary/query-containment) · [query equivalence](#/glossary/query-equivalence) · [homomorphism](#/glossary/homomorphism-containment-mapping) · [NULL and three-valued logic](#/glossary/null-and-three-valued-logic) · [set semantics](#/glossary/set-semantics) · [bag semantics](#/glossary/bag-semantics) · [canonical database](#/glossary/canonical-database) (§1, §2)

**The paper's own terms** (q is the contained query, q′ the containing one):
- **position** (§2): a column of a table atom (relation and column number).
- **Boolean query** (§2): a query with no output variables.
- **join variable** (§2): occurs at least twice in the query's table atoms; it must take a non-null value.
- **null version** (§3): the canonical database (below) with some frozen non-join variables replaced by null.
- **covered, toggled** (§3): a non-join variable of q is covered when it sits in exactly the positions of an output variable of q′. Covered variables that also share their position with a join variable of q′ are toggled (tried both frozen and null; their set is Vt).
- **effective domain** (§4.1): the interval of values a variable's comparisons allow.
- **match, witness set, canonical values** (§4.1): y of q′ matches x of q if y's positions are among x's and their effective domains overlap. The witness set of x holds, for each set of x's matches that is maximal among those leaving infinitely many values of x's effective domain outside all their domains, that leftover part, plus each single value left over by a set that leaves only finitely many. Each witness gives one canonical value, and a canonical assignment picks one per variable.
- **relational graph RG, legal separator** (§4.2): RG links variables of q that share an atom of q or are matched (allowing several variables with a shared value) by one atom of q′. A separator is a set of variables whose removal splits RG into components; it is legal if no variable of q′ matches two of its variables in this sense.
- **comparison graph CG, opposite graph, cycle reverse edges** (§4.3–4.4): CG links variables of q related by a comparison of q or one induced from q′ (a comparison of q′ whose two sides can map to them). The opposite graph of a CG component holds the order q forces plus a reverse edge for each induced comparison q leaves undecided; cycle reverse edges lie on a directed cycle (a cyclic order conflict).
- **trichotomy query, minimal MFES, feedback query** (§4.4): a trichotomy query adds one of <, =, > for each cycle reverse edge. A match feedback edge set (MFES) is a set of cycle reverse edges whose removal leaves the graph acyclic; each minimal one gives a feedback query. A local assignment is a canonical assignment restricted to one component.
- **Δ, w, |Ecycle(q)|** (§5): the size of the largest match set; the width, the minimum over legal separators of the separator's size plus its largest component (in RG+, RG plus cliques for comparison constraints); the number of cycle reverse edges.

**Missing glossary terms:**
- **fixed-parameter tractable** (Thm. 5.2): bounded by a function of some parameters times a polynomial in the input size.
- **polynomial delay** (Thm. 4.21): an enumeration whose time between consecutive outputs is polynomial in the input size.

**Builds on:**
- Chandra and Merlin: one canonical database decides containment of plain conjunctive queries (§1–2; [Optimal Implementation of Conjunctive…](#/papers/chandra1977conjunctive "Optimal Implementation of Conjunctive Queries in Relational Data Bases (1977)")).
- Farré et al.: with nulls, all null versions decide it (Thm. 3.2); not listed here.
- Klug's test over canonical databases for all orderings of variables and constants, compared against in Ex. 4.4 and §4.3 ([On conjunctive queries containing…](#/papers/klug1988inequalities "On conjunctive queries containing inequalities (1988)")); van der Meyden's matching lower bound (§6; [querying indefinite order data](#/papers/vandermeyden1992indefinite "The complexity of querying indefinite data about linearly ordered domains (1992)")).

## Problem and setting

- **Question:** "how can we shrink the family of test databases that decides containment?" (§1).
- **Queries** (§2): conjunctive queries with comparisons using < and ≤ (an equality is a pair of ≤). Classes: CQ⊥ (no comparisons, nulls allowed), CQvc (variable–constant comparisons) and CQcmp (any comparisons), both null-free, and the combined CQvc,⊥ and CQcmp,⊥ (§5).
- **Values:** rational numbers plus one null symbol ⊥ (§2).
- **Nulls** (§2): a comparison with a null argument is not satisfied, "following SQL's three-valued logic"; join variables must be non-null; output tuples may contain nulls.
- **Semantics:** a query's result is a set of tuples (§2); bag semantics is left open (§7).
- **Correct** means containment over all databases of the class (§2). Integrity constraints: not discussed. No experiments.

## Approach

- **Nulls (§3).** Freeze join variables, output variables and the other covered variables, null the rest, and vary only Vt.
- **Variable–constant comparisons (§4.1).** Pick one fresh value (distinct from all constants and other chosen values) per infinite witness, and the value itself for single-value witnesses.
- **Components (§4.2).** Remove a legal separator from RG and vary each component with it, independently of the others.
- **Variable–variable comparisons (§4.3).** Witness sets alone fail (Ex. B.5); inside each CG component, pick ordered representatives in each interval between the relevant constants.
- **Order conflicts (§4.4).** Add to q every order no induced comparison contests; split only on the remaining cyclic conflicts.
- **Combined (§5).** A compared variable is never nulled, so the §3 partition is reused "with nonnull in place of join, in both queries" (nonnull: join or compared variables).

## Results

The main results, as the authors state them:
- **Thm. 3.3:** for CQ⊥ queries over databases with nulls, 2^|Vt| toggled databases decide containment, in place of the 2^|njoin(q)| null versions of Thm. 3.2; in Ex. 3.5, 64 null versions shrink to 2. Cor. 3.4: see In brief; for Boolean queries Vt is empty, which the authors say extends the known NP bound for that case to a wider class (§3).
- **Prop. 4.3:** a variable x has at most 2|match(x)| + 1 witnesses.
- **Thm. 4.5:** for CQvc queries, the canonical databases of §4.1 decide containment.
- **Thm. 4.9, Lemma 4.10:** for CQvc queries and a legal separator S that is not all of q's variables, trying every value combination on S with each component separately suffices; the smallest such family has size (product of value counts on S) × (largest such product over a component).
- **Thm. 4.12:** for CQvc queries, deciding whether some legal separator gives a family of at most a given size is NP-complete, even when every variable has exactly two canonical values (reduction from Vertex Cover, a classic NP-complete graph problem; App. B.3).
- **Thm. 4.16:** for CQcmp queries, the canonical databases of §4.3 decide containment; unlike Klug's, they order only variables within a CG component, against its relevant constants (§4.3).
- **Thm. 4.18:** adding to q a comparison x1 < x2 within one component that q doesn't strictly imply, when the opposite graph has no path from x2 to x1, leaves containment unchanged.
- **Thm. 4.19:** q is contained in q′ if and only if every trichotomy query is, and each is tested over at most one local assignment.
- **Thm. 4.21:** if the opposite graph has no cycle whose edges are all ≤, one feedback query per minimal MFES suffices, generated with polynomial delay in the sizes of q and q′.
- **Thm. 5.1:** for CQcmp,⊥ queries, the combined canonical family decides containment over databases with nulls.
- **Thm. 5.2:** for CQcmp,⊥ queries and any legal separator S of RG+, at most 3^|Ecycle(q)| · (2Δ+2)^(|S| + largest component) canonical databases decide containment. Cor. 5.3: with Δ, w and |Ecycle(q)| constant, containment is in NP, and in P when q′ admits polynomial evaluation (q′ runs in polynomial time on a database); without non-strict cycles, the 3^|Ecycle(q)| factor improves to the product over components of their numbers of minimal MFESs.
- **Ex. B.16:** the full combined family has 512 databases, Thm. 5.2 tests 18, and the feedback improvement 4.

## Limits the authors state

- "Aggregation, unions and negation are beyond our constructions as well" (§7).
- "our families are generated in no particular order, while a checker hoping to refute [13, 31] wants a distinguishing database early" (§7); refs. 13 and 31 are VeriEQL and Polygon, bounded counterexample searchers.
- Choosing the best separator "is intractable" (§4.2, Thm. 4.12), and finding one that minimizes w is NP-complete (§5); "in practice one fixes a legal separator heuristically" (§4.2).
- Thm. 4.21's assumption "cannot be dropped": in their example, containment fails only where two variables are equal, which both feedback queries miss; the trichotomy split still decides it.

## Open problems and building blocks

  - "The nearest is to admit disequality atoms", whose effective domains are unions of intervals (§7).
  - Under bag semantics containment "remains open", slight extensions make it undecidable, "so it is not clear what a canonical-database test should even be" (§7).
- **Released:** Nothing stated.
- **To reuse it:** a database system to run q′ over each test database (abstract); witness sets computed by a sweep over the endpoints of effective domains (proof of Thm. 4.12, App. B.3); a legal separator, chosen heuristically (§4.2); queries in the fragment of §2.

## On this site

- **Discussed in:** [Query equivalence: prove or refute](#/challenges/query_equivalence)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/bounded-theory">bounded-theory</a><a class="tag sub" href="#/tags/theory-null">theory-null</a><a class="tag sub" href="#/tags/theory-set">theory-set</a></span>
