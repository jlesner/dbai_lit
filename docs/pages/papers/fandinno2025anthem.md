# anthem 2.0: Automated Reasoning for Answer Set Programming

**anthem 2.0** · Theory and Practice of Logic Programming 25(4) 2025 (ICLP 2025)

Read: [PDF](https://arxiv.org/pdf/2507.11704) · [arXiv](https://arxiv.org/abs/2507.11704) · [DOI](https://doi.org/10.1017/S1471068425100112)  
Code: [anthem](https://github.com/potassco/anthem)

<p class="notice">A summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- A tool that verifies answer set programs written in mini-gringo, a fragment of the clingo solver's input language with arithmetic and simple choice rules but no aggregates (abstract, §2): it proves strong equivalence (the same stable models inside any larger program), external equivalence (the same output for every input that a "user guide" permits) and adherence to a first-order specification (§4.1–4.3).
- Translates programs into many-sorted first-order formulas (translations τ*, ν and μ, §3.1), embeds the logic of here-and-there into classical logic for strong equivalence (§3.2.1), uses completion for external equivalence, which it can currently only verify automatically for programs that are tight and lack private recursion (§3.2.2, §4.2), and splits each claim into subproblems for the theorem prover vampire; for external equivalence, users can add proof outlines (definitions, lemmas, inductive lemmas) when vampire stalls (§5.3).
- A proof-based equivalence checker (it proves, never refutes) for a Datalog-family rule language with negation, choice and integer arithmetic, beside the decision procedures of this section; harder pairs often rest on hand-written proof outlines (§5.3): in Tab. 2, three external-equivalence problems time out without one (§6), and the authors state that a failed run "is not a proof" of non-equivalence (§5.3). Its proved refactoring of a primes program into a faster one (§4.2, §5.3) is the kind of certified result [Repairing and rewriting DSL programs with a certified result](#/challenges/certified_dsl_repair) asks for, where no decision procedure exists.

## In plain words

Answer set programs solve search problems with logical rules; a solver returns the sets of facts the rules allow. The authors present anthem 2.0, a tool that can prove, with an automatic theorem prover, that two such programs behave the same or that a program meets a logical specification (abstract). It covers a subset of the clingo solver's language with arithmetic and simple choice rules (whose conclusion may or may not be added) but no aggregates (counts or sums over sets of facts) (abstract). Two programs can be proved interchangeable inside any larger program, which earlier checkers it cites do only for programs without variables, or to give the same output for every input that a short description of their intended use allows (§1). The authors present it as consolidating earlier prototypes into "a stable tool" (§1), and the anthem systems as "unique" among proof-based checkers of such programs in supporting variables and integer arithmetic (§7). They report that on the Frame problem (reasoning about what stays unchanged after actions), with a hand-written proof outline, the proof takes under 8 seconds on 8 prover cores, where without one both anthem 2.0 and its predecessor time out at 5 minutes (Tab. 2, §6).

## Background and terms

**Terms to know:** [answer set programming](#/glossary/answer-set-programming) · [logic programming](#/glossary/logic-programming) · [first-order logic](#/glossary/first-order-logic) · [many-sorted first-order logic](#/glossary/many-sorted-first-order-logic) · [formal specification](#/glossary/formal-specification) · [program equivalence](#/glossary/program-equivalence) · [stable model (answer set)](#/glossary/stable-model-answer-set) (and ground programs; both used undefined, §1) · [strong equivalence](#/glossary/strong-equivalence-logic-programs) (§1) · [negation as failure](#/glossary/negation-as-failure) (§2) · [logic of here-and-there (HT)](#/glossary/logic-of-here-and-there) (for the paper's translations, "two programs are strongly equivalent if and only if their formula representations are equivalent in HT", §3.2.1) · [Clark's completion and tight programs](#/glossary/clarks-completion-and-tight-programs) (§3.2.2) · [automated theorem prover (ATP)](#/glossary/automated-theorem-prover-atp) (vampire, given TPTP problems, §2, §4.1)

**The paper's own terms:**
- **mini-gringo**: the subset of the input language of the grounder gringo (a tool that replaces variables by values) that anthem accepts: basic rules, choice rules (`{H} :- B.`) and constraints (rules that only rule out answers), whose bodies hold atoms (predicates applied to arguments), "possibly preceded by one or two negation-as-failure symbols", and comparisons, with arithmetic but no aggregates (§1, §2).
- **external equivalence**: two programs are equivalent "with respect to a user guide if, for any input that is permitted by the user guide, they produce the same output" (§1). A **user guide** declares inputs (input predicates, and **placeholders**, symbolic constants given a value by the input), outputs, and assumptions about the inputs (§4.2, Listing 2); the other predicates are auxiliary ("private", §1). In the glossary's terms, program equivalence restricted to permitted inputs and output predicates (ours).
- **weak equivalence**: the special case with no inputs and no auxiliary predicates: the same stable models (§1, §6).
- **specification adherence**: checking a program against first-order formulas marked `spec` and input assumptions, run as a special case of external equivalence (§4.3).
- **target language**: anthem's internal first-order language with three sorts: a general sort (integers, symbolic constants and two special symbols), integers, and symbols (§2).
- **τ\*, ν, μ**: translations of programs into formulas. To accommodate features such as partial arithmetic functions (division, for one), τ\* "produces complex formulas that are not easily understood"; the natural translation ν gives more readable ones for rules called **regular**; μ applies ν to regular rules and τ\* to the rest (§3.1).
- **γ and ordering sentences**: γ rewrites a here-and-there formula as a classical one, with a here-copy and a there-copy of each predicate; ordering sentences say that the here-copy implies the there-copy (§3.2.1).
- **standard interpretations** (assignments of meaning to symbols): those that "give a standard treatment to operations like integer addition" (§4.1, footnote 3).
- **private recursion** (roughly, a dependency cycle among auxiliary predicates) and **local tightness**: conditions defined in earlier papers (Fandinno et al. 2023, Section 6; Fandinno et al. 2024), not in this one (§4.2, §5.2); many non-tight programs are locally tight (§5.2).
- **proof outline**: annotated formulas a user adds to help the prover in external-equivalence tasks: definitions of new predicates, lemmas and inductive lemmas, each optionally tied to one direction of the proof (§5.3).

**Builds on:**
- anthem-1 (Fandinno et al. 2020), specification adherence (§1).
- anthem-se (Lifschitz et al. 2019), strong equivalence, extended to programs with negation by Heuer (2020) (§1).
- anthem-p2p (Fandinno et al. 2023), external equivalence, built on anthem-1 (§1).
- The translations' theory: τ\* (Lifschitz et al. 2019), ν (Lifschitz 2021), μ and γ (Fandinno and Lifschitz 2023b), completion (Fandinno et al. 2024) (§3); none is on this site.

## Problem and setting

How to prove, for programs with variables and integer arithmetic, that two answer set programs are strongly or externally equivalent, or that a program meets a first-order specification (§1, §4). Inputs are fixed only by the user guide: anthem "does not require a concrete valuation of placeholders" (§4.2), so a proof covers every permitted input. Strong equivalence can be established by showing that, given the ordering sentences, the γ-translations of the two programs are equivalent in every standard interpretation (§4.1, citing Fandinno and Lifschitz 2023b, Theorem 2).

## Approach

- **Translate (§3.1).** `anthem translate` turns a program into target-language formulas with τ\*, ν or μ, and can print them in TPTP syntax (§2).
- **Strong equivalence (§3.2.1, §4.1).** anthem applies γ to both programs' formulas and splits the equivalence into implications (four in the Listing 3 example, two of them trivial); vampire checks each against axioms describing standard interpretations, and anthem answers that the programs are strongly equivalent if all are entailed (§4.1).
- **External equivalence (§3.2.2, §4.2).** anthem completes each program's τ\* formulas and sends subtasks to vampire; private predicates get fresh names, and their completed definitions become assumptions for deriving the equivalence of the public predicates' definitions (§5.3 example). Each direction of the proof can be run separately (§4.3).
- **Specifications (§4.3).** A specification file takes the second program's place (Listing 5).
- **Analysis (§1, §3.2.2).** It checks properties such as tightness and regularity.
- **When the prover stalls (§5.3).** Raise the per-subproblem timeout (`-t`) or the prover's cores (`-m`); look for missing or malformed assumptions; or write a proof outline. anthem attempts to verify the outline's lemmas in order, each established one serving as an assumption for the next; an inductive lemma (a claim about every integer from some starting value on) is split into a base case and an inductive step (§5.3). With the tightness check bypassed, one inductive lemma lets anthem prove two locally tight programs for the frame problem (what stays unchanged after an action) externally equivalent for every time horizon (number of time steps) (§5.3, "A Challenging Example").

## Results

- **Capabilities (Tab. 1, §6).** Tab. 1 marks anthem 2.0 as supporting variables, double negation (`not not`), arithmetic, and all four kinds of check, but not disjunctive rule heads (several possible conclusions); the tools selp, dlpeq and ccT, built on [SAT](#/glossary/sat-and-smt-solvers), ASP and QBF (quantified Boolean formula) solvers for propositional (variable-free) programs with disjunctive heads, support none of variables, double negation or arithmetic, so "there cannot be a sensible runtime comparison" with them (§6).
- **Runtimes (Tab. 2, §6).** 13 problems (our count) from the repository's examples, "excluding only trivial parsing tests", each against at most one predecessor (anthem-1, anthem-se or anthem-p2p), with 2, 4 and 8 prover cores and a 5-minute limit.
  - Division, Frame and Primes (2v3) time out for both tools without a proof outline; with one, anthem 2.0 finishes in 1.68, 7.88 and 29.47 s at 8 cores (Tab. 2). The authors say these "all rely on proof outlines with features specific to anthem 2.0" (§6).
  - Predecessors time out on Choice and Primes (2vs), which anthem 2.0 completes (Tab. 2).
  - On Squares, anthem-se takes 17.37, 141.43 and 69.45 s at 2, 4 and 8 cores, against 5.71, 2.53 and 1.20 s for anthem 2.0 (Tab. 2).
  - anthem-se is faster on Bounds, Successor and Transitive, which the authors call trivial, with "negligible" differences on Transitive (§6); on Bounds at 8 cores, 0.07 against 0.48 s (Tab. 2).
- The authors conclude that anthem 2.0 is "considerably more powerful than its predecessors when applied to non-trivial problems, both in terms of capabilities and performance" (§6).

## Limits the authors state

- "currently, anthem can only automatically verify external equivalence for programs that are tight and lack private recursion" (§4.2); strong equivalence verification "does not suffer this restriction", and "in certain cases, the tightness limitation can be lifted" (§4.2).
- Validating the external behavior of a non-tight program, which "the current incarnation of anthem refuses to attempt"; locally tight programs can pass with `--bypass-tightness` if the user has proven local tightness by hand, since "an effective procedure for checking local tightness has not been developed" (§5.2).
- A failed run "is not a proof that the programs are not (strongly, externally) equivalent" (§5.3).
- For nontrivial tasks, vampire often cannot validate a subproblem "in a reasonable amount of time" (§5.3); the primes refactoring "is difficult for the current version of vampire without some human help" (§4.2).
- anthem-se's lead on Bounds and Successor is "likely due to a shortcut employed by anthem-se when it encounters positive programs" (basic rules and constraints without negation) (§6).

## Open problems and building blocks

- **Open:** improvements planned or in progress (§7), including better formula simplification; proof outlines for strong equivalence; other backend ATPs; natural translation in external equivalence; ordered completion and/or tightening to bypass tightness; conditional literals (a clingo language feature); counting and/or unrestricted aggregates; revising integer division for consistency with clingo. "The long-term goal is to support the complete abstract gringo language within anthem" (a formal version of clingo's language) (§7).
- **Released:** most examples are in the `res/examples` directory of the anthem repository, which "also contains installation instructions and a more detailed user manual" (§1, footnote 1), with "a user manual and set of examples with expected outputs" (§7).
- **To reuse it:** programs in mini-gringo, without aggregates (§1); the prover vampire (§1, §4.1); for external equivalence, tight programs without private recursion (§4.2); often, proof outlines for nontrivial tasks (§5.3).

## On this site

- **Discussed in:** [Repairing and rewriting DSL programs with a certified result](#/challenges/certified_dsl_repair) · [Porting programs between DSLs and dialects without changing their meaning](#/challenges/dsl_porting)
- **Tags:** <span class="tags"><a class="tag" href="#/tags/method">method</a><a class="tag" href="#/tags/prove">prove</a><a class="tag sub" href="#/tags/dsl-datalog">dsl-datalog</a></span>
