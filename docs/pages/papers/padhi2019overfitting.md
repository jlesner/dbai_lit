# Overfitting in Synthesis: Theory and Practice

**Overfitting in Synthesis** · CAV 2019

Read: [PDF](https://arxiv.org/pdf/1905.07457) · [arXiv](https://arxiv.org/abs/1905.07457) · [DOI](https://doi.org/10.1007/978-3-030-25540-4_17)  
Code: [LoopInvGen](https://github.com/SaswatPadhi/LoopInvGen)

<p class="notice">A summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Observes that syntax-guided synthesis tools built on counterexample-guided inductive synthesis (CEGIS) fail on problems they solve with a less expressive grammar once the grammar grows, and attributes part of it to overfitting: candidates that fit the examples so far but violate the specification (abstract, §2).
- Defines a "potential for overfitting" (the number of such spurious candidates) and proves no-free-lunch theorems trading learnability against grammar expressiveness (§3); mitigates by running a tool on subgrammars in parallel (PLearn) or by hybrid enumeration, which interleaves nested grammars in one thread (§4), implemented inside LoopInvGen (§1, §5.2), on integer and Boolean loop-invariant benchmarks (§5).
- A pre-LLM theory of examples-only false accepts, with a language's expressiveness as the dial that grows them: the authors report more counterexample rounds in 27% of the cases where a more expressive grammar slowed LoopInvGen (§2.2, Fig. 3).

## In plain words

Syntax-guided synthesis (SyGuS) tools search a grammar of allowed programs for one meeting a logical specification. The authors study tools using [counterexample-guided inductive synthesis](#/glossary/counterexample-guided-inductive-synthesis-cegis) (propose a program fitting the examples, get a counterexample, repeat). A richer grammar lets these tools solve some new problems but fail on many a poorer one solves (§1). They "claim that this degradation is not only due to a larger search space, but also due to overfitting" (abstract): intuitively, a richer grammar holds more wrong programs fitting the examples (§1). They measure this and prove no-free-lunch theorems (no learner does well on every problem) that "reveal a fundamental tradeoff between synthesizer performance and grammar expressiveness" (abstract). As fixes they run a tool on smaller grammars in parallel (PLearn) or interleave them in one thread (hybrid enumeration, §4). In their invariant generator LoopInvGen, with the winner's heuristic, it "outperforms the winner of the 2018 SyGuS competition" on its [loop-invariant](#/glossary/loop-invariant) track, "solving more problems and achieving a 5× mean speedup" (abstract; 117 against 115 problems, §5.3). Of PLearn they write: "to our knowledge, this is the first proposal to explore multiple grammars as a means to improve the performance of SyGuS" (§1).

## Background and terms

**Terms to know:** [program synthesis](#/glossary/program-synthesis) · [formal specification](#/glossary/formal-specification) · [loop invariant](#/glossary/loop-invariant) · [satisfiable and valid](#/glossary/satisfiable-and-valid) · [SAT and SMT solvers](#/glossary/sat-and-smt-solvers) (for "background theory") · [linear and nonlinear integer arithmetic](#/glossary/linear-and-nonlinear-integer-arithmetic) · [abstract interpretation](#/glossary/abstract-interpretation) (the grammars follow its "abstract domains", §2.1) · [syntax-guided synthesis (SyGuS)](#/glossary/syntax-guided-synthesis-sygus) (§1; Def. 1, §3.1) · [overfitting](#/glossary/overfitting) (§1) · [no-free-lunch theorem](#/glossary/no-free-lunch-theorem) (§1) · [ensemble methods](#/glossary/ensemble-methods) (§1) · [enumerative synthesis](#/glossary/enumerative-synthesis) (§4.2)

**The paper's own terms:**
- **grammar**: "a (possibly infinite) set … of expressions" (Def. 1, §3.1), not the rules that generate it.
- **satisfiable** (problem): its grammar holds an expression solving it (Def. 1, §3.1).
- **IO example**: an input–output pair that some function meeting the specification agrees with (Def. 2).
- **verification oracle**: confirms a candidate meets the specification on every input, or returns a counterexample, an IO example the candidate gets wrong (Def. 3).
- **CEGIS-based learner**: queries the oracle at most a given number of times, each candidate agreeing with all earlier counterexamples; its **trace** is that sequence (Def. 4). Learners and oracles are assumed deterministic (§3.1). A **round** is one iteration (§2.2).
- **spurious candidates**: programs that "satisfy a given set of examples but violate the specification" (§1).
- **k-expressive**: the grammar expresses exactly k distinct functions (Def. 5, §3.2).
- **m-learnable**: some oracle exists under which the learner finds a correct program with at most m queries (Def. 6), "a much weaker notion" than machine learning's, which needs success, up to a bounded error, on an arbitrary set of m examples (§3.2).
- **potential for overfitting**: the number of programs in the grammar that agree with a given set of IO examples but do not solve the problem (Def. 7, §3.3).
- **PLearn** and **hybrid enumeration** (**HEnum**): the two mitigations (Alg. 1–3, §4); **LoopInvGen+HE** is LoopInvGen using HEnum (§5.2).
- **component-based grammar**: all well-typed expressions built from a set of typed operators and constants, the "components" (Def. 8, §4.2).
- **well order**: an order on (grammar, expression size) pairs in which a smaller-or-equal grammar at a smaller size always comes first (Def. 9, §4.2), so subexpressions are built and cached before the expressions that use them.
- **total-time cost**: wall-clock time, times the number of parallel instances for PLearn (§5.2).
- **the six grammars** (Fig. 1, §2.1), each adding operators to the previous one: Equalities (=), Intervals (<, ≤, >, ≥), Octagons (+, −), Polyhedra (multiplication by a constant), Polynomials (multiplication of variables), Peano (div, mod).

**Missing glossary terms:** none.

**Builds on:**
- The SyGuS framework of Alur et al. [3], whose problem definition the paper borrows (§3.1), and CEGIS (Solar-Lezama [36]), the approach it restricts itself to (§1).
- Enumerative synthesis in Escher (Albarghouthi et al. [2]) and component-based synthesis (Jha et al. [21]), which hybrid enumeration extends (§4.2), inside the authors' LoopInvGen (Padhi et al. [28]) (§5.2).
- No-free-lunch theorems (Shalev-Shwartz and Ben-David [33]) and ensemble methods (Dietterich [13]) from machine learning (§1; §4).

## Problem and setting

- **Question:** why do CEGIS-based SyGuS tools fail, given a more expressive grammar, on problems they solve with a less expressive one, and how to mitigate it (§1)?
- **Correct** means the specification holds on every input, valid in the background theory (Def. 1). For an invariant: the precondition implies it, a loop iteration preserves it, and on exit it implies the postcondition (§2.2, Fig. 4).
- **Theory assumptions:** deterministic learners and oracles (§3.1); in Thms. 1–4, a theory that "supports equality" and finite input and output sets, or a countably infinite (infinite but listable, like the integers) input set (§3.2–3.3).
- **Experiments:** 180 invariant-synthesis benchmarks over integer and Boolean values: all 127 official ones of the 2018 SyGuS competition's invariant (Inv) track, plus benchmarks from the 2018 Software Verification competition (SV-Comp) and prior work (§5); six grammars; a 30-minute timeout (§2.1). Five tools (§2.1): SketchAC (extends the Sketch synthesis system with explicit and symbolic search), Stoch (stochastic search), EUSolver (combines enumeration with unification strategies), CVC4 (a solver extended with a refutation-based approach) and LoopInvGen (enumeration with Boolean function learning).

## Approach

- **Evidence (§2.2):** LoopInvGen is instrumented to record candidates and rounds; each pair of successful runs of a benchmark on two grammars is compared, failing runs ignored. On the `fib_19` benchmark (a small integer loop program), Peano yields complex intermediate predicates "unlikely to generalize well" (Fig. 5).
- **No free lunch (§3.2).** Thm. 1: for finite input and output sets, a theory that supports equality, any grammar, and m smaller than the number of inputs, if the grammar expresses more distinct functions than the bound (which counts the possible traces of at most m counterexamples, App. A.1), then for every CEGIS-based learner some satisfiable problem is not m-learnable by it, though a different learner can m-learn it. Thm. 2: the same for a countably infinite input set, finite or countably infinite outputs, any m, and a grammar expressing more than countably many functions.
- **Overfitting (§3.3).** Thm. 3: in the finite setting, with m smaller than the number of inputs and the grammar expressing more functions than there are sets of m IO examples (App. A.2), some satisfiable problem has a positive potential for overfitting for every set of m IO examples: a wrong program always fits them. Thm. 4: the countably infinite analogue, for more than countably many functions. Thm. 5: for any sets, theory, specification and IO examples, a subgrammar never has a higher potential for overfitting than a grammar containing it.
- **PLearn (§4.1, Alg. 1):** runs one tool on copies of the problem, each with a subgrammar, in parallel, and returns the first solution, which solves the original problem. Thm. 6: on any set of IO examples, each copy's potential for overfitting is at most the original's.
- **Hybrid enumeration (§4.2).** For nested component-based grammars inside the problem's grammar, a well order and a maximum size, HEnum builds expressions level by level from cached smaller ones (Alg. 2); its Divide procedure splits a size budget among an operator's arguments so each expression is built once (Alg. 3). The implementation orders pairs by the number of components raised to the size, "a rough measure of the expressiveness"; Thm. 7 says this is a well order. Thm. 8: with nested component-based grammars whose largest equals the problem's grammar, any well order and a size bound, HEnum finds a satisfying expression whenever one within the bound exists. Thm. 9: with nested component-based grammars inside the problem's grammar, it enumerates each distinct expression at most once.
- **Integration (§5.2):** HEnum replaces Escher, LoopInvGen's enumerative synthesizer, with "no other changes"; §5.3 adds the winning solver's postcondition-first heuristic "for a fair comparison".

## Results

- **Grammar sensitivity (§2.1, Fig. 2):** for each tool, benchmarks that fail with a grammar but are solvable with a less expressive one increase with expressiveness, the authors observe.
- **Overfitting evidence (§2.2, Fig. 3):** among slowdowns with a more expressive grammar, rounds stay the same in 67% ("mainly due to a larger search space") and increase in 27%; 79% of the cases needing more rounds were slower.
- **PLearn (§5.1, Fig. 6):** without it, failures "initially decreases and then increases across all solvers" as expressiveness grows; with it, tools fail less at each level, with "a trend of decreased failures with increased expressiveness".
- **Hybrid enumeration (§5.2, Fig. 7):** LoopInvGen+HE has "a significantly lower failure rate" than LoopInvGen, and its failures decrease with expressiveness. The median total-time overhead of PLearn over LoopInvGen+HE grows from 1.91 (Intervals) to 5.49 (Peano); that of LoopInvGen+HE over LoopInvGen stays between 0.97 and 1.04 (Fig. 7(b)).
- **Competition (§5.3):** against the 2018 Inv-track winner LIG, "a version of LoopInvGen … extensively tuned for this track", the paper reports "LoopInvGen solves 115 benchmarks in a total of 2191 seconds whereas LoopInvGen+HE solves 117 benchmarks in 429 seconds, for a mean speedup of over 5×", and that no competition entrant solved the two additional benchmarks LoopInvGen+HE solves.

## Limits the authors state

- Learners and oracles are defined as deterministic, an assumption that "simplifies the subsequent theorems"; "we expect that these theorems can be appropriately generalized to randomized oracles and learners" (§3.1).
- Parallel instances "can be prohibitively expensive, both computationally and memory-wise", worse because many tools already use several threads (SketchAC spawns 9) (§4.1).
- Hybrid enumeration assumes each grammar's components are "known (explicitly provided by the user)" (§4.2).
- Other competition tracks are omitted: they "either require us to construct" the subgrammars "by hand or lack verification oracles" (§5).
- For programming-by-example systems, whose specification is a set of examples, "our notion of overfitting does not apply to such tools" (§6).

## Open problems and building blocks

- **Open:** probabilistic enumeration (listing programs by a likelihood learned from known solutions) and type-based pruning (cutting the search by types) are "orthogonal to, and may be combined with, our approach of exploring grammar subsets" (§6).
- **Released:** the implementation (§1 footnote) and all benchmarks (§5 footnote).
- **To reuse it:** PLearn needs a tool and subgrammars of the problem's grammar and is "agnostic to the synthesizer's implementation" (§4.1); HEnum needs nested component-based grammars with their components given (§4.2); both were evaluated with verification oracles on integer and Boolean benchmarks (§5).

## On this site

- **Discussed in:** [A gym of DSL tasks with answer keys made by code](#/challenges/dsl_gym) · [Weak checkers get exploited](#/challenges/weak_checker_exploitation)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/general-misc">general-misc</a></span>
