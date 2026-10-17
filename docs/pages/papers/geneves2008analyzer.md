# XML Static Analyzer User Manual

**XML Static Analyzer User Manual** · INRIA research report RR-6726 (arXiv 2008)

Read: [PDF](https://arxiv.org/pdf/0812.3550) · [arXiv](https://arxiv.org/abs/0812.3550)

<p class="notice">A summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- User manual of a satisfiability solver for a logic of finite trees that decides XPath emptiness, containment and equivalence, optionally under a DTD, XML Schema or Relax NG type, and outputs a satisfying or counterexample XML tree (§2, Examples 1–3; §3.2 "Supported XML Types"; §4).
- XPath expressions from a navigational fragment (Fig. 7, in which "data values are ignored", §3.1) and tree types are compiled into an alternation-free μ-calculus with converse for finite trees, decided by a BDD-based inverse tableau method the authors say runs in time exponential in the formula size (§4).

## In plain words

XPath is a small language for picking out parts of an XML document (a tree of nested, named elements). Two questions arise: can a query ever select anything, and does one query always select part of what another selects? The authors say the first check is "important for error-detection and optimization" (§2, Example 1) and the second is needed, for instance, to type-check queries, check integrity constraints in XML databases and secure XML data (§2, Example 3). This report is the user manual for their earlier solver (§1), which turns queries and document schemas into a formula about trees and decides whether any tree makes it true. An answer of unsatisfiable proves a query empty, or a containment true, on every document; satisfiable comes with an example tree, a counterexample when a containment fails (§2, Examples 1–3). The report has no experiments. The authors claim the solver decides formulas in exponential time and is "considerably (orders of magnitude) faster" than solvers for an equally expressive logic, such as MONA (§4), and call the logic "one of the most expressive yet decidable known logic" (§4) (decidable: a program can always settle each formula).

## Background and terms

**Terms to know:** [satisfiable and valid](#/glossary/satisfiable-and-valid) · [query containment](#/glossary/query-containment) · [query equivalence](#/glossary/query-equivalence) · [decidable and undecidable](#/glossary/decidable-and-undecidable) · [soundness and completeness](#/glossary/soundness-and-completeness)

**The paper's own terms:**
- **XML tree**: a document seen as "a finite tree of unbounded depth and arity" with two kinds of nodes: elements, which are ordered and may have child elements, and attributes, which are unordered leaves; "data values are ignored" (§3.1, Fig. 1).
- **containment, here**: one XPath query's result "is always included into the result of" another (§2, Example 3), on every tree, from the same starting nodes; the glossary defines it over databases.
- **binary encoding** ("first-child & next-sibling"): each element keeps its first child as its first successor, and its next sibling becomes its second successor, so any tree becomes a binary tree; the logic works on these (§3.1 "Unranked and Binary Trees", Figs. 2–3). Attributes are left unchanged by it.
- **programs `1`, `2`, `-1`, `-2`**: the four moves a formula can make in the binary tree, labelled first child, next sibling, parent and previous sibling (§3.2 "Modal Formulas for Navigating in Trees", Fig. 4). `a & <1>b` says the node is named a and its first child b (Tab. 1).
- **recursive formula** (`let $X = … in …`): a binder that lets a formula refer to itself, for properties such as the absence of some name in a whole subtree (§3.2 "Recursive Formulas").
- **cycle-free**: intuitively, a formula that does not contain both a program and its converse inside the same recursion; only cycle-free formulas are allowed (§3.2 "Cycle-Freeness Restriction").
- **predicates**: built-in and user-defined "logical macros" translated into the core logic, which the authors regard "as an assembly language" (§3.3; Figs. 5–6). Two of them: `select("e", φ)`, the nodes the XPath expression e selects when evaluated from nodes where formula φ holds (`select("e")` starts from the context mark `#`), and `type("file", start)`, the documents a schema file allows from a chosen start element (§3.2 "Supported XPath Expressions", "Supported XML Types"). Users may add their own (§3.4).
- **Lean**: "the set of all basic subformulas that notably defines the search space that is going to be explored by the solver" (§2, Example 1).

**Missing glossary terms:**
- **modal μ-calculus** (general definition): a logic that describes a node by what holds at the nodes reachable by moves, with fixpoint operators for recursion; "alternation-free" limits how fixpoints nest, and "with converse" adds backward moves. The paper's logic is "an alternation-free µ-calculus with converse for finite trees" (§4).
- **tree automaton and regular tree language** (general definition): an automaton that reads a tree rather than a string; the sets of trees such automata accept are the regular tree languages. The authors say tree automata "provide the foundation for the Relax NG language" (§4) (an XML schema language) and that the logic can encode "any regular tree grammar" (§3.2 "Supported XML Types").
- **monadic second-order logic (MSO)** (general definition): a logic that can quantify over nodes and over sets of nodes; the authors say that on finite trees it is as expressive as tree automata and their logic (§4).
- **binary decision diagram (BDD)** (general definition): a compact graph that stores a Boolean function, letting a program work on large sets of states at once (§4 cites Bryant 1986).

**Builds on:**
- Genevès (2006), the PhD thesis "Logics for XML", and Genevès, Layaïda and Schmitt (2007), "Efficient static analysis of XML paths and types" (PLDI 2007, a programming-languages conference; [Efficient Static Analysis of…](#/papers/geneves2007efficient "Efficient Static Analysis of XML Paths and Types (2007)")): the logic and solver this manual documents, "formally described" there (§1, §4).
- MONA (Klarlund, Møller and Schwartzbach, 2001), a solver for MSO formulas, the speed comparison point (§4).

## Problem and setting

- **The question:** given a formula over trees, built from XPath expressions, schemas and logical operators, is there a finite tree that satisfies it? Validity can be checked as unsatisfiability of the negation (§1). Instances: emptiness of an XPath query (§2, Example 1); emptiness on the documents a schema allows, here the DTD of SMIL, a W3C multimedia format (§2, Example 2) (a DTD lists which elements may nest in which); containment, checked as unsatisfiability of the negated implication; and equivalence, written `<=>` (§2, Example 3).
- **Trees:** "Models of a formula are finite binary trees for which the formula is satisfied at some node" (§3.2). "data values are ignored" (§3.1).
- **XPath fragment** (Fig. 7): paths, union, intersection, qualifiers (bracketed filters) with and, or and not, attribute and name tests, over forward and reverse axes (e.g. child, ancestor, preceding-sibling). Some uses of `position` and `count` are rewritten into the fragment (Fig. 8); "We observed that, in practice, many XPath expressions contain syntactic sugars that can also fit into this fragment" (§3.2 "Supported XPath Expressions").
- **Context:** two compared expressions must start "from the same evaluation context, which can be any set of nodes", the same for both (§2, Example 3).
- **Schemas:** tree grammars "written in usual notations like DTD, XML Schema, or Relax NG", standard schema languages for XML (§3.2 "Supported XML Types").
- **What correct means:** the semantics of formulas "is formally defined in" the thesis and the PLDI paper (§3.2), not in this report.

## Approach

- **Input:** a text file holding one formula, run as `java -jar solver.jar formula.txt` (§2). The syntax: Fig. 4 (formulas), Fig. 5 (predicates), Fig. 6 (custom predicates) (§3.2–§3.4).
- **Compilation:** XPath expressions are parsed and compiled into the logic; a DTD is converted into an internal binary-tree form ("BTT"), then into the logic (§2, Example 2). The authors say XPath expressions and regular tree types "can be linearly translated into the logic" (§4), and that these translations "always generate cycle-free formulas" (§3.2 "Cycle-Freeness Restriction").
- **Solving:** after computing the Fisher-Ladner closure (the subformulas it must track) and the Lean, the solver "attempts to build a satisfying tree in a bottom-up way, in the manner of a fixpoint computation that iteratively updates a set of tree nodes", in at most exponentially many steps in the size of the Lean (§2, Example 1). §4 calls it "an inverse tableau method that searches for a satisfying tree", implemented with BDDs and optimizations "such as on-the-fly formula normalization and simplification, conjunctive partitioning, early quantification" (techniques for speeding up BDD computations).
- **Output:** satisfiable or unsatisfiable; when satisfiable, an example tree in XML, with attributes marking the starting node and a selected node (§2, Example 2). The authors say this "allows for instance to reproduce a program's bug in the developer environment, independently from the logical solver" (§4).
  - Containment can be decided as implication because the logic is closed under negation; the cycle-freeness restriction ensures this, since converse moves may interact with recursion so that the finite model property is lost (that a satisfiable formula has a finite model) (§3.2, §4).
  - The logic is as expressive as tree automata and as MSO of finite trees (§4).
  - Satisfiability is decided in exponential time, more precisely time 2^O(n) with n "proportional to (and smaller than) the size of the logical formula" (§4).
  - The algorithm "has been proved sound and complete" in the thesis and the PLDI paper (§4).
  - The complexity is "optimal since it subsumes tree automata and less expressive logics such as CTL" (§4) (CTL: a temporal logic used in model checking).

## Results

No experiments (§2–§4). The worked examples show the solver's traces (§2). The authors' results and claims:
- **Example 1** (§2): `a/b[following-sibling::c/parent::d]` is unsatisfiable, so empty on every document, because, intuitively, one node would have to be named both `a` and `d`.
- **Example 2** (§2): the SMIL query is satisfiable under the SMIL DTD, and the solver prints a sample document.
- **Example 3** (§2): the first of two expressions is contained in the second; they are not equivalent, as a three-node counterexample tree shows.
- **Speed:** the solver is "considerably (orders of magnitude) faster than solvers for monadic second-order logic, like e.g., the MONA solver" (§4).
- **Balance:** the logic "currently offers the best balance known between expressivity and complexity for decidability" (§4).
- **Uses:** "especially useful" for, among others, static analysis of XML code, security checks, query optimization and type-checkers (§1).

## Limits the authors state

- "Notice that from an XML perspective, data values are ignored" (§3.1).
- Only cycle-free formulas are allowed; "The cycle-freeness restriction only matters when one directly writes recursive logical formulas" (§3.2).
- Only the XPath fragment of Fig. 7 is supported, plus the patterns Fig. 8 rewrites into it (§3.2 "Supported XPath Expressions").
- A custom predicate may call other predicates "but not to the currently defined predicate"; recursion must use the `let` binder (§3.4).
- MONA "nevertheless remains useful when one wants to write logical formulas using MSO syntax" (§4).
- The manual gives "informal documentation for using its implementation" (§1).

## Open problems and building blocks

- **Open:** None stated.
- **Released:** the solver, "shipped as a compressed file which, once extracted, provides binaries along with all required libraries" (§2).
- **To reuse it:** a Java virtual machine version 1.5.0 or later and Java compiler compliance level 5.0 or later (§2, footnote 2); schemas as DTD, XML Schema or Relax NG files with a start element (§3.2); XPath within Figs. 7–8; compared expressions evaluated from the same context (§2, Example 3).
- **Beyond its domain:** "The solver can be used for reasoning over finite ordered trees whatever these trees do actually represent" (§1), and the authors name "optimizing compilers for a wide variety of tree-manipulating programs and XML processors" among its uses (§1).

## On this site

- **Discussed in:** [Distinguishing documents for two programs in any DSL](#/challenges/dsl_counterexamples) · [A gym of DSL tasks with answer keys made by code](#/challenges/dsl_gym)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/cex-general">cex-general</a><a class="tag sub" href="#/tags/cex-misc">cex-misc</a><a class="tag sub" href="#/tags/prove-general">prove-general</a></span>
