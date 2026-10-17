# Efficient Static Analysis of XML Paths and Types

**Efficient Static Analysis of…** · PLDI 2007

Read: [PDF](https://inria.hal.science/inria-00502789/document) · [DOI](https://doi.org/10.1145/1250734.1250773)

<p class="notice">A summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Decides XPath emptiness, containment, overlap and coverage, with or without regular tree type constraints (DTDs and other XML schemas), by testing whether one formula over finite trees is satisfiable (abstract, PDF p. 1; §8, PDF pp. 8–9); the XPath fragment "covers all features except counting [8] and data values" (§1, PDF p. 1), though its abstract syntax (Fig. 3, PDF p. 3) has 11 of XPath 1.0's 13 axes (no attribute or namespace axis).
- The authors translate XPath expressions and regular tree types in linear size into cycle-free formulas of a sub-logic of the alternation-free modal μ-calculus with converse, in which least and greatest fixpoints coincide on finite trees, so the logic is closed under negation (Lemma 4.2, PDF p. 3; Prop. 5.1, PDF p. 5; §5.2, PDF pp. 5–6); a bottom-up algorithm, implemented with BDDs, decides satisfiability in time exponential in the number of elements of the formula's "Lean" set (Lemma 6.7 and §7, PDF p. 8). Detailed proofs are deferred to a long version, its ref. [16] (§2, PDF p. 2).
- General comparisons of data values from an infinite domain, which earlier works showed "may lead to undecidability" (§1, PDF p. 1), stay outside it.

## In plain words

Programs processing XML pick out parts of documents with XPath, a language of path expressions. A type checker must answer questions about a query over every possible document, perhaps limited by a schema (a grammar of allowed documents): can the query ever select anything, and does one query always select a subset of what another selects? They are motivated by "the need of efficient type checkers for XML-based programming languages" (§1, PDF p. 1). They prove that a logic for finite trees with restricted formulas is decidable in time "a simple exponential of the size of a formula" (abstract, PDF p. 1), translate queries and schemas into it at linear size, and build a solver. Queries with counting or data-value comparisons are left out (§1, PDF p. 1). On six sample problems the solver takes 41 ms to 2,872 ms, slowest under the XHTML schema (the XML form of HTML), with no comparison, since they know of no other tool that handles backward and recursive navigation (§8, PDF p. 9). They call their bound "tighter" (§10, PDF p. 10), and discuss earlier bounds for related logics (§9, PDF p. 9).

## Background and terms

**Terms to know:** [query containment](#/glossary/query-containment) · [query equivalence](#/glossary/query-equivalence) · [decidable and undecidable](#/glossary/decidable-and-undecidable) · [satisfiable and valid](#/glossary/satisfiable-and-valid) · [soundness and completeness](#/glossary/soundness-and-completeness). The glossary defines containment and equivalence over databases; here they range over XML trees (below).

**The paper's own terms:**
- **XPath decision problems** (§1, PDF p. 1): emptiness (does an expression ever select nodes), containment (are one expression's results always included in another's), overlap (do two expressions select common nodes) and coverage (are one expression's nodes always in the union of several others' results), over all finite trees, with or without type constraints. Equivalence is two containment tests (§8, PDF p. 9).
- **XPath fragment** (§5, Fig. 3, PDF p. 3): paths, union, intersection; steps along eleven **axes** (directions of navigation, such as child, ancestor or foll-sibling) with an optional name test; and **qualifiers**, boolean expressions in brackets "that can test the existence or absence of paths".
- **Focused tree** (§3, PDF p. 2): a tree seen from one node, with its context (previous siblings and parent, recursively), after Huet's Zipper. It carries one **start mark**, where evaluation started.
- **Programs** (§3–4, PDF p. 2): the four moves of binary-style navigation: to the first child (1), to the next sibling (2), and their **converses**, to the parent from a leftmost child and to the previous sibling.
- **Cycle-free formula** (§4, PDF p. 2): one with a bound, however often its fixpoints (recursive definitions) are unrolled, on its **modality cycles**: a move whose subformula, under only conjunctions and disjunctions, steps along the converse move (e.g. down, then straight back up).
- **Lean** (§6.1, PDF p. 6): the basic tests of a formula ψ, written Lean(ψ): whether each move exists, the labels ψ uses plus one name for all others, the start mark, and each move-then-subformula in ψ's closure (subformulas, with each fixpoint unrolled once). Every subformula and negation is a boolean combination of them.
- **ψ-type** (§6.1, PDF p. 6): a subset of the Lean describing one node, called a "Hintikka set in the temporal logic literature"; among its conditions, exactly one label and not both backward moves.

**Missing glossary terms:**
- **Modal μ-calculus** (§4, PDF pp. 2–3; §9, PDF p. 9): a logic of formulas that hold at nodes; ⟨a⟩φ says a move along a reaches a node where φ holds, and a **least** or **greatest fixpoint** (μ, ν) defines a property recursively, as the smallest or largest solution. **Alternation-free** means no least and greatest fixpoints depend on each other; **converse** adds backward moves (general definition, in the paper's terms).
- **Regular tree language** (§5.2, PDF p. 5): a set of trees defined by a tree grammar (general definition); the authors say the class gathers XML type formalisms such as DTD, XML Schema and Relax NG.
- **Binary decision diagram (BDD)** (§7, PDF p. 8): a compact graph form of a boolean function, here holding sets of bit vectors.

**Builds on:**
- Vardi's μ-calculus with converse [31], and Tanabe et al.'s procedure for its alternation-free fragment [29], whose models are infinite graphs; its finite-tree variant needs "expensive cycle-detection", and "The present work shows how this can be avoided for finite trees" (§9, PDF p. 9).
- The authors' earlier XPath containment through monadic second-order logic (which can quantify over sets of nodes) and the MONA tool [15], and their finite-tree XML setting [14] (§9, PDF p. 9).
- The Lean of Pan, Sattler and Vardi [27] (§6.1, PDF p. 6) and the binary regular tree types of Hosoya, Vouillon and Pierce [19] (§5.2, PDF p. 5).
- The W3C XPath 1.0 recommendation [6] ([XML Path Language (XPath) Version 1.0](#/papers/clark1999xpath "XML Path Language (XPath) Version 1.0 (1999)")) (§5, PDF p. 3).

## Problem and setting

The question: decide these problems, with or without type constraints, to type-check XPath queries statically (abstract, PDF p. 1).

- **Data:** finite ordered trees with labels, in binary style, with a single start mark (§3, PDF p. 2). XML attributes: not discussed.
- **Queries:** Fig. 3's fragment, "all features except counting [8] and data values", since earlier works showed that general comparisons of data values from an infinite domain "may lead to undecidability" (§1, PDF p. 1); its meaning is Fig. 4 (PDF p. 4).
- **Types:** binary regular tree types, via an isomorphism with unranked ones (nodes may have any number of children) (§5.2, PDF p. 5). A type's root may sit anywhere, so it can describe nodes deep in a document, unless the root's position is known, as for an expression starting at the root (§5.2, PDF p. 6).
- **Correct:** a problem is a formula; for containment, an unsatisfiable formula means "all nodes selected by e1 under type constraint T1 are selected by e2 under type constraint T2" (§8, PDF p. 8).
- **Type checking (§8, PDF pp. 8–9):** the authors single out "Static type checking of an annotated XPath query" (are the nodes an expression selects under one type always in a second type?) and equivalence under type constraints.

## Approach

- **The logic (§4, PDF pp. 2–3).** Formulas (Fig. 1) test labels and the start mark, combine by conjunction and disjunction, step along the programs, and use fixpoints over several variables. Only cycle-free formulas are allowed. Lemma 4.2: a cycle-free formula holds of a finite focused tree exactly when one of its finite unfoldings (Def. 4.1: each fixpoint unrolled finitely often) does; so for such formulas least and greatest fixpoints coincide on finite trees. With one fixpoint, negation can be pushed inward, so the logic is closed under negation, which containment, "a logical implication", needs (§1, PDF p. 1).
- **XPath into the logic (§5.1, PDF pp. 3–5).** Each axis becomes a formula for the nodes it reaches from a context (Fig. 5); paths compose these "navigational" formulas, while qualifiers use a "filtering" translation that states that a path exists without moving to its end (Figs. 6–8). The authors call backward moves "crucial for supporting XPath": without them a logic can solve emptiness, but not other problems such as containment "efficiently". Prop. 5.1: for an expression and a formula denoting the set of trees it is applied to, the translation holds exactly at the nodes the expression selects from those trees, is cycle-free, and is linear in the size of the expression and that formula.
- **Schemas (§5.2, PDF pp. 5–6)** become fixpoint formulas with only downward moves.
- **The algorithm (§6.2, PDF pp. 6–7).** Bottom-up over ψ-types: each round adds types for deeper trees whose required first children and next siblings are already found, leaving backward requirements for later, until a marked type with no backward move implies the formula, or nothing new is added (Fig. 10).
- **Guarantees (§6.3, PDF pp. 7–8).** Thm. 6.3: the algorithm decides satisfiability of the logic's formulas over finite focused trees. Lemma 6.5 (soundness): each formula true at a type in the result is satisfied by some tree when backward moves are checked only up to level 0 (Fig. 11), a level bounding how far backward moves are checked. Lemma 6.6 (completeness): for a cycle-free closed formula (no variable left unbound by a fixpoint) that some finite tree satisfies, the algorithm ends with a set that passes its final check. Lemma 6.7: satisfiability of a formula ψ is decidable in time 2^O(n), with n the number of elements of Lean(ψ).
- **Implementation (§7, PDF p. 8).** Sets of ψ-types are BDDs, one variable per Lean element; it tests a linear-size "plunging" formula (true at a root when the tested formula holds there or below).

## Results

- **Theory:** above. §9 (PDF p. 9) restates earlier bounds: 2^O(n·log n) for Tanabe et al. [29] on infinite graphs, and non-elementary (above every fixed tower of exponentials) for WS2S (weak monadic second-order logic of two successors, MONA's logic).
- **Experiments (§8, PDF pp. 8–9).** A Java implementation (footnote 1, PDF p. 9) runs on the twelve expressions of Fig. 12 and two DTDs (Tab. 1): SMIL 1.0 (a multimedia language) and XHTML 1.0 Strict, the larger. Tab. 2 gives six problems: three containment tests without a type, one a Miklau and Suciu example on which their tree-pattern technique is incomplete, satisfiability under SMIL and under XHTML, and a coverage test under XHTML. Times range from 41 ms to 2,872 ms, the XHTML problems slowest, counting only the solver (parsing and translation are "negligible"). The XHTML satisfiability instance shows that the official XHTML DTD "does not syntactically prohibit the nesting of anchors" (§8, PDF p. 9).

## Limits the authors state

- No comparison: "As no third-party implementation we know of addresses reverse axes and recursion, we simply provide evidence that our approach is efficient" (§8, PDF p. 9).
- Only "a representative sample" of "extensive tests" is shown (§8, PDF p. 9).
- XHTML: "the time needed is more important, but it remains practically relevant, especially for static analysis operations performed only at compile-time" (§8, PDF p. 9).
- No counting or data-value comparisons in the fragment (§1, PDF p. 1).
- Proofs: "Detailed proofs and implementation techniques can be found in a long version of this paper [16]" (§2, PDF p. 2); Lemmas 6.5–6.6 give proof outlines (PDF p. 8).

## Open problems and building blocks

- **Open:** "extending XPath to restricted data values comparisons that preserves this complexity, for instance data values on a finite domain"; "integrating related work on counting [8] to our logic"; improving the implementation's performance (§10, PDF p. 10).
- **Released:** Nothing stated.
- **To reuse it:** a BDD package (§7, PDF p. 8); queries within the Fig. 3 fragment (PDF p. 3) and types written as regular tree types (§5.2, PDF p. 5). The experiments ran on a Pentium 4, 3 GHz, with 512 MB of RAM (footnote 1, PDF p. 9).

## On this site

- **Discussed in:** [Repairing and rewriting DSL programs with a certified result](#/challenges/certified_dsl_repair) · [A gym of DSL tasks with answer keys made by code](#/challenges/dsl_gym)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/general-misc">general-misc</a><a class="tag sub" href="#/tags/prove-general">prove-general</a></span>
