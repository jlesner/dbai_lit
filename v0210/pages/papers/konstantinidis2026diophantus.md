# Attacking Diophantus: Special Cases of Bag Containment

**Attacking Diophantus** · preprint Sep 2026

Read: [PDF](https://arxiv.org/pdf/2609.30956) · [arXiv](https://arxiv.org/abs/2609.30956)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- A unified framework that decides bag-set containment of join-uniform CQs into arbitrary CQs, subsuming the projection-free and join-on-free cases; bag-bag stays open for join-uniform queries (§1, PDF p. 3; Thm. 6.2).
- Builds on the link between bag containment and Diophantine inequalities.
- Decidable fragments are where a complete bag-semantics checker could exist.

## In plain words

Query containment asks whether, on every database, one query's answers are among another's; under bag semantics it compares how many times each answer appears. For conjunctive queries (select-from-where queries with equality conditions), "the decidability of bag containment for conjunctive queries remains open", while slightly richer classes are undecidable through reductions from variants of Hilbert's tenth problem, about whole-number solutions of polynomial equations (abstract). The authors note that bag semantics is the default of most relational systems (§1). They prove containment decidable when stored tables hold no duplicates but answers are counted, the first query is "join-uniform" (every atom, i.e. table reference, in a group linked by non-output variables contains all that group's non-output variables), and the second is any conjunctive query; the body treats queries that return only a count (§1). Non-containment becomes a constrained whole-number inequality, decided through a linear system. They present a "unified framework" that subsumes two decidable cases from their earlier papers and covers "a substantially broader class of queries" (abstract). It is a theory paper.

## Background and terms

**Terms to know:** [conjunctive query](#/glossary/conjunctive-query) · [query containment](#/glossary/query-containment) · [bag semantics](#/glossary/bag-semantics) · [bag-set semantics](#/glossary/bag-set-semantics) · [homomorphism](#/glossary/homomorphism-containment-mapping) · [decidable and undecidable](#/glossary/decidable-and-undecidable) · [NP-complete and the polynomial hierarchy](#/glossary/np-complete-and-the-polynomial-hierarchy) · [union of conjunctive queries](#/glossary/union-of-conjunctive-queries)

**The paper's own terms:**
- **containee / containing query**: the first query, which should be contained, and the second (§1).
- **bag-bag / bag-set containment**: bag-bag lets stored facts carry multiplicities (the glossary's bag semantics); bag-set keeps stored tables as sets and counts answers. Bag-bag containment implies bag-set containment (§3.1).
- **Boolean query (BCQ)**: a query with no output variables; its bag-set answer is the number of homomorphisms from its body into the database (§2.1, §4.1).
- **component**: a maximal group of atoms linked through shared existential (non-output) variables (Def. 2.2).
- **PFQ / JoFQ / JUQ**: projection-free queries have no existential variables (Def. 3.1); join-on-free queries may have existential variables but no joins on them (Def. 3.2); join-uniform queries let every atom of a component contain all of that component's existential variables (Def. 3.3). PFQs and JoFQs are JUQs (§3.2).
- **minimal unification closure**: the set of query shapes obtained by unifying (identifying) atoms within and across the containee's components, each kept once up to isomorphism (variable renaming), ordered by homomorphism; "ground" elements are the fully-constant ones (Def. 4.1, Thm. 4.3).
- **multicanonical instance**: a database whose non-constant components are each an exact copy (a net image, below) of a closure shape, and whose fully-constant facts belong to ground closure elements present in it; these form a **ground selection**, **non-trivial** when the containee's own fully-constant components are built from selected facts (Def. 4.8, Def. 4.9, Lem. 4.11).
- **net image / net-image counting**: an image of a closure shape in the database that is not contained in an image of a strictly more specific shape, and the number of such images per shape (Defs. 4.6, 4.10); **homomorphism counting**: total homomorphism counts per shape whose recovered copy counts form a net-image counting (Def. 4.27).
- **multiplicity weight / multiplicity poset**: the number of homomorphisms between two comparable closure shapes, and the partially ordered set (poset) carrying these weights and a fixed offset for the ground part (Def. 4.25; Def. 5.1, instantiated in Lem. 6.1). **Convolution** with the weights turns copy counts into total counts; its inverse (Möbius inversion) turns them back (§2.2).
- **n-MPI**: an inequality in n unknowns whose left side is a single monomial with coefficient 1 and whose right side is a polynomial (§5).
- **natural / Diophantine natural**: an assignment whose recovered copy counts are natural numbers, and which is itself in natural numbers (§1; Def. 5.2).
- **strong non-negativeness**: on Diophantine natural assignments the polynomial is non-negative and at least each of its positive-coefficient monomials taken with coefficient 1 (§1; Def. 5.3).

**Missing glossary terms:**
- **Diophantine inequality**: an inequality between polynomials whose unknowns must take whole-number values; deciding whether one has a solution is undecidable in general, through Hilbert's tenth problem (§5 intro).
- **coNEXPTIME / 2coNEXPTIME**: problems whose no-answers have a certificate checkable in exponential, resp. doubly exponential, time (§6).

**Builds on:**
- The authors' [KM19] (projection-free containees) and [KM25] (join-on-free containees), on which "This work is based" (title footnote; §1); not listed here.
- Chaudhuri and Vardi ([Optimization of real conjunctive queries](#/papers/chaudhuri1993real "Optimization of real conjunctive queries (1993)")), who posed the open problem (§1) and whose variable-onto homomorphisms (covering every variable of the target) the paper uses as a sufficient test for bag-set containment (Thm. 4.3 proof).

## Problem and setting

- **Question:** given a Boolean JUQ q and a Boolean conjunctive query p, is q bag-set contained in p, i.e. is q's count at most p's on every database without duplicates (Prob. 2, §3.2)? In general it must hold for every answer tuple, and for bag-bag for every multiplicity of the stored facts (§3.1).
- **Queries:** conjunctive queries over variables and constants (§2.1). The containing query is an arbitrary conjunctive query; restrictions fall on the containee (§3.1).
- **Semantics:** bag-set for JUQs. For PFQs and JoFQs bag-bag follows through the copy-attribute reduction, which adds a fresh existential "copy" variable to each atom (§1, §3.2, Example 4); that reduction leaves the JUQ class, so bag-bag stays open for JUQs (§3.2).
- **Boolean queries:** §4 treats Boolean queries; the non-Boolean case guesses a "prototypical tuple" (Thm. 6.2 proof).
- **Context** (§1): bag containment is undecidable for unions of conjunctive queries ([Containment of conjunctive queries](#/papers/ioannidis1995bag "Containment of conjunctive queries: beyond relations as sets (1995)")), conjunctive queries with inequalities ([The containment problem for…](#/papers/jayram2006inequalities "The containment problem for &lt;bi&gt;Real&lt;/bi&gt; conjunctive queries with inequalities (2006)")) and generalisations ([Bag Semantics Conjunctive Query…](#/papers/marcinkowski2025smallsteps "Bag Semantics Conjunctive Query Containment. Four Small Steps Towards Undecidability. (2024)")).
- NULLs and integrity constraints: not discussed.

## Approach

**Part 1, database to arithmetic (§4).**
- Close the containee's components under unification. For a Boolean JUQ this closure is a finite poset, every non-ground element is connected and join-uniform, and among closure elements the homomorphism order coincides with bag-set containment (Thm. 4.3).
- For a Boolean JUQ q and any database, there is a multicanonical database on which q has the same number of homomorphisms and every Boolean CQ p whose constants all occur in q has at most as many (Thm. 4.13). So for a Boolean JUQ q and Boolean CQ p, q is not bag-set contained in p exactly when some multicanonical instance shows it (Thm. 4.17).
- On a multicanonical instance, p's count is a sum, over homomorphisms of p into one copy of each non-ground closure shape plus the selected ground facts, of products of copy counts (Thm. 4.23); q's count is a product of total counts (Prop. 4.2). Convolution links the two kinds of count (Lem. 4.28).
- Polynomial characterisation: for a Boolean JUQ q and Boolean CQ p, q is not bag-set contained in p iff there are a non-trivial ground selection and a whole-number assignment at which q's count (a monomial) exceeds p's count (a polynomial) and whose recovered copy counts are natural numbers (Thm. 4.34). The polynomial can have negative coefficients but is strongly non-negative (Lem. 6.1).

**Part 2, the Diophantine problem (§5)**, stated abstractly as Prob. 3 (a multiplicity poset, an MPI with a strongly non-negative polynomial; is there a Diophantine natural solution?).
- One unknown: if the monomial's degree exceeds every positive-coefficient term's, all large enough values solve it (Lem. 5.5); with coefficients at least 1, a solution of at least 1 forces that gap (Lem. 5.4).
- Several unknowns: write each as a power of one base; degree comparisons become a homogeneous linear system (inequalities without constant terms), plus strict increase along the order (§5.2). For a polynomial whose coefficients are all at least 1, a real solution with every value at least 1 and strictly increasing along the order exists iff that linear system is feasible iff arbitrarily large increasing whole-number solutions exist (Thm. 5.13).
- Restoring the naturality constraints, for a multiplicity poset and a strongly non-negative polynomial: Thm. 5.17 for solutions with every unknown at least 1; Thm. 5.18 handles zero values by restricting to the unknowns that must stay positive. Unlike in [KM25], the order need not be a meet-semilattice, where every two elements have a greatest common lower element (§5.4, §7).
- Decision: guess a small integer solution of the linear system and check its constraints (Algorithm 1, Thm. 5.19), using a bit-size bound for integer solutions (Lem. 5.8). The linear system gives "a bounded witness" (§1).

## Results

The authors prove:
- **Thm. 4.34:** the polynomial characterisation (above).
- **Thm. 5.19:** Prob. 3 is decidable in ∃∀-alternating polynomial time (guess a certificate polynomial in the linear system's encoding, then check every constraint). By Lem. 5.8, a feasible system has a positive integer solution of at most 6ϕn³ bits (ϕ the largest constraint's encoding length, n the unknowns).
- **Thm. 6.2:** upper bounds: bag-set containment of JUQs into CQs in 2coNEXPTIME; bag-set and bag-bag containment of JoFQs into CQs in coNEXPTIME; bag-bag containment of PFQs into CQs in Π₂ᵖ. The authors bound the JUQ closure's number of elements by a doubly exponential function of the containee's size (§6, before Thm. 6.2).
- **Thm. 6.3:** the four problems of Thm. 6.2, restricted to Boolean queries, are NP-hard, by a reduction from graph 3-colourability.
- **Worked example:** for the running pair q6, p1 (Exm. 5), one counting gives monomial 480 against polynomial 25 (Exm. 17, Exm. 20).

## Limits the authors state

- "our result does not settle bag-bag containment for JUQs" (§1): the copy-attribute reduction "takes the class of queries outside of JUQ" (§3.2). They focus on bag-set, which "seems technically less complicated" (§3.2).

## Open problems and building blocks

  - "identifying tighter bounds remains an open challenge"; which part of the closure's exponential blow-up is avoidable (§7).
  - Lower bounds, where progress "has stalled" since a hardness claim by Chaudhuri and Vardi was withdrawn, per the authors (§7).
  - The frontier beyond JUQs: "It is not yet clear whether some of these requirements can be weakened, e.g., finiteness of the closure" (§7).
  - Integrating the method with techniques that restrict the containing query [KR11, KKNS20, KKNS21], which "may be a necessary step towards a final solution of this open problem" (§7).
- **Released:** Nothing stated.
- **To reuse it:** the containee must be a JUQ (bag-set) or JoFQ/PFQ (also bag-bag); the containing query is any conjunctive query (§6). The procedure enumerates ground selections and solves a linear feasibility problem for each (§6).

## On this site

- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/theory-bag">theory-bag</a></span>
