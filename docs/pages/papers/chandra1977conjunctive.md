# Optimal Implementation of Conjunctive Queries in Relational Data Bases

**Optimal Implementation of Conjunctive…** · STOC 1977

Read: [DOI](https://doi.org/10.1145/800105.803397)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Defines conjunctive queries; equivalence iff homomorphisms both ways between their "natural models" (Lemma 13; later called canonical databases).
- Unique minimal equivalent by "folding"; CQ evaluation NP-complete, first-order PSPACE-complete.
- Later work cites it for containment mappings (e.g. [How Can We Shrink…](#/papers/sternbach2026shrink "How Can We Shrink the Family of Test Databases? Query Containment with Nulls and Comparisons (2026)")), though it states only equivalence. Set semantics only.

## In plain words

Many database questions ask for values for which other values exist making a list of stored facts all true, with no alternatives, negations or for-all conditions; the authors call these conjunctive queries. Their contrived opening example shows the speedups possible: the obvious method's time grows with the sixth power of the number of values, yet the answer is whether one table is non-empty (§1, PDF p. 1). They prove every such query has a smallest equivalent query, unique up to renaming variables, reached by merging variables; two such queries are equivalent exactly when each one's facts map into the other's keeping constants and output positions (§5, PDF pp. 5–7). Deciding whether such a yes/no query holds is NP-complete when the database is part of the input (§4, PDF p. 5). Their algorithm yields a program within a constant factor of the fastest for every database, in their cost model, at a cost exponential in the query's length but independent of the data (§6, PDF pp. 8–9). They present this as introducing "the notion of conjunctive queries" (§7, PDF p. 10).

## Background and terms

**Terms to know:** [conjunctive query](#/glossary/conjunctive-query) · [set semantics](#/glossary/set-semantics) · [query equivalence](#/glossary/query-equivalence) · [homomorphism](#/glossary/homomorphism-containment-mapping) · [relational algebra](#/glossary/relational-algebra) · [first-order logic](#/glossary/first-order-logic) · [NP-complete](#/glossary/np-complete-and-the-polynomial-hierarchy) · [union of conjunctive queries](#/glossary/union-of-conjunctive-queries) · [PSPACE-complete](#/glossary/pspace) · [graph isomorphism](#/glossary/graph-isomorphism)

**The paper's own terms:**
- **data base**: a nonempty finite domain D plus finitely many relations on it; a relation's or query's **rank** is its number of columns (§2, PDF p. 1). n = |D| measures running times (§6.1, PDF p. 8).
- **first order formula**: built from ∀, ∃, ∨, ∧, ¬, variables, constants and relation names; "equality is not allowed", and constants "stand for themselves", so distinct constants are distinct elements (§2, PDF p. 1).
- **conjunctive query**: (x₁,…,x_k). ∃x_{k+1}…x_m. A₁ ∧ … ∧ A_r, each A_i an **atomic formula** (atom): one relation applied to variables or constants; x₁,…,x_k are the output variables, and a **boolean query** has none (§2, PDF p. 2).
- **equivalent (≡)**: equal results on every database **compatible** with both queries, i.e. holding all relations and constants they use (§2, PDF pp. 1–2).
- **relational expression**: a term over D and the stored relations using ten operations, such as join, union and difference (§3, PDF pp. 2–3).
- **restriction** keeps rows whose two given columns are equal, dropping the later; **selection** keeps rows with a given constant in a given column (§3, PDF p. 3).
- **generalized join**: joins two relations on chosen overlapping columns, then deletes chosen columns (§3, PDF pp. 3–4; Fig. 1, PDF p. 14).
- **natural model** M_Q: the query's atoms read as a small database over its variables and constants, plus marker relations for each output variable and each constant (§5, PDF p. 5).
- **folding**: a query whose natural model is the image of M_Q under a homomorphism from M_Q to itself that fixes a set V, containing the output variables and constants, and maps everything into V; the authors describe minimization as "combining variables" (§5, PDF p. 5).
- **isomorphic**: equal up to renaming variables and reordering atoms and quantified variables (§5, PDF p. 6).
- **Church–Rosser**: up to isomorphism, the order of foldings does not matter (Thm. 9, PDF p. 6; §7, PDF p. 10).

**Missing glossary terms:**
- **boolean matrix multiplication**: matrix product with "and" for times and "or" for plus; M(a,b,c) is the time to multiply an a×b by a b×c boolean matrix (§3, PDF p. 4).

**Builds on:**
- Codd's relational model [C70] and his result [C71b] that first-order queries and relational expressions are "essentially the same" (§2–3, PDF pp. 1–3).
- Fast boolean matrix multiplication by Strassen [S69], Arlazarov et al. [ADKF70] and Fischer and Meyer [FM71], applied to joins (§3, PDF p. 4).
- Work on computing joins [T74, R75, G75, NS76] (§3, PDF p. 4) and on reordering a query's evaluation [SC75, NS76], which the authors call "usually local" (§6, PDF p. 7).

## Problem and setting

- **Question:** answer a conjunctive query with least work: minimize it, then choose a global order of computation (§6, PDF pp. 7–8).
- **Query class:** conjunctive queries without equality (§2, PDF pp. 1–2). The authors say they include "a large number of queries actually asked in practice" and that a query with ∨ splits into a union of conjunctive queries (§2, PDF p. 2).
- **Semantics:** a result is the set of output tuples that make the formula true (§2, PDF p. 2). NULLs and aggregates: not discussed.
- **Cost model (§6.1, PDF p. 8):** straight-line programs (assignments without loops or branches) whose variables hold relations; six statements: load a stored relation, load D, permute, restrict, select, generalized join. The first five cost zero; a generalized join costs n^p + n^q + n^r + n^{s+t+u+v} (p, q input ranks, r output rank, s, t, u, v as in Lemma 4). Constant or n^rank costs for the first five leave results "essentially without change" (PDF p. 8). A program is equivalent to Q if its output equals Q's result "for every data base" (same page).

## Approach

- **Expressions and queries (§3, PDF pp. 3–5).** Relational expressions and first-order queries are interchangeable (Lemma 2, proof in the Appendix, PDF p. 11); with the first seven operations only, expressions match conjunctive queries (Lemma 3). Expressions of generalized joins, restriction and selection are equivalent to conjunctive queries, and each conjunctive query has one with restriction and selection at the bottom (Lemma 5, PDF pp. 4–5).
- **Joins as matrix products (Lemma 4, PDF p. 4).** Fixing the shared kept columns turns a generalized join into boolean matrix products, so it runs on a random-access machine (a standard computer model) in time O(n^p + n^q + n^r) + n^v·M(n^s, n^t, n^u), where s and u count each input's unshared output columns, t the shared columns projected away, and v the shared columns kept.
- **Equivalence test (Lemma 13, PDF p. 7).** Two conjunctive queries are equivalent exactly when there are homomorphisms between their natural models in both directions; the proof's maps fix the constants and send the i-th output variable to the i-th.
- **Folding and minimization (§5, PDF pp. 6–7).** A folding is equivalent to the original (Thm. 10). For every conjunctive query Q, some folding Q₀ of Q is such that every query equivalent to Q has a folding isomorphic to Q₀ (Thm. 12, PDF p. 7).
- **Optimization (§6.2, PDF pp. 8–9).** A program P is **near-optimal** for Q if P ≡ Q and some constant c gives Time(P,B) ≤ c·Time(P′,B) for every program P′ ≡ Q and every compatible database B (§6.1, PDF p. 8). Run times are polynomials in n, so this means least degree. Every program has an equivalent expression in a normal form ("property *") of no higher degree (Lemma 14). For a folding, deleting relations from the original's expression gives one no slower on any compatible database (Lemma 15). The algorithm minimizes the query, then picks a matching expression of least degree; projecting columns out early reduces this to parenthesizing the query's atoms (PDF p. 9).

## Results

- **Thm. 6 (PDF p. 5):** deciding whether a boolean first-order query is true in a database, both given as input, is logspace complete in polynomial space; **Thm. 6′:** also for one fixed database with domain {0,1} and one relation {0}.
- **Thm. 7 (PDF p. 5):** the same question for conjunctive boolean queries is logspace complete in NP, by reduction from clique (k mutually adjacent vertices).
- **Minimizing** a conjunctive query is NP-hard (at least as hard as every problem in NP), unlike deterministic automata (§5, PDF p. 5).
- **Thm. 8 (PDF p. 6):** isomorphism of conjunctive queries is logspace equivalent to graph isomorphism.
- **Thm. 9 (PDF p. 6):** two foldings of one query have foldings isomorphic to each other.
- **Thm. 11 (PDF p. 6):** deciding whether one query is a folding of another is NP-complete, also for boolean conjunctive queries, by reduction from graph coloring (coloring vertices with c colors so neighbours differ).
- **Thm. 16 (PDF p. 9):** the algorithm, which runs "in time exponential in the length of the input query (but independent of the data base)", computes a near-optimal program in the §6.1 cost model (PDF p. 8).

## Limits the authors state

- The program is within a constant of optimal "in our model"; the authors believe it "would also be good for practical implementations" (§6, PDF p. 8).
- Finding the optimal implementation takes time exponential in the query's size (§6, PDF p. 8), and minimizing is NP-hard (§5, PDF p. 5).
- The hardness results count the database as input; when queries are substantially shorter than the database, which the authors call usual, optimizing at a cost independent of it pays (§4, PDF p. 5).
- A query may need exponential time if its output is large (§4, PDF p. 5).
- With equality in formulas, ≡ would not be transitive in their formalism, which "merely points to the pitfalls that may be encountered when formalizing data bases in terms of logic" (Appendix, PDF pp. 10–11).
- The proofs of Lemmas 3 and 5 and part of Thm. 8's are omitted; Lemma 14 has an outline (PDF pp. 3, 5, 6, 9).

## Open problems and building blocks

- **Open:** none stated. The authors note two partial options: improving a query "for some given period of time rather than optimizing it completely" (§6, PDF p. 8), and finding smaller equivalent queries "without having to obtain the minimal" (§7, PDF p. 10).
- **Released:** nothing stated.
- **To reuse it:** needs only the query, not the data (§6.2, PDF p. 9); covers conjunctive queries without equality, with set results (§2, PDF pp. 1–2).

## On this site

- **Discussed in:** [Canonical forms for queries](#/challenges/query_canonical_forms) · [Query equivalence: prove or refute](#/challenges/query_equivalence) · [Verified query speedups](#/challenges/verified_query_speedup)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/bounded-theory">bounded-theory</a><a class="tag sub" href="#/tags/theory-set">theory-set</a></span>
