# Lemur: Integrating Large Language Models in Automated Program Verification

**Lemur** · ICLR 2024

Read: [PDF](https://arxiv.org/pdf/2310.04870) · [arXiv](https://arxiv.org/abs/2310.04870)  
Code: [Lemur-program-verification](https://github.com/wu-haoze/Lemur-program-verification)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Combines LLMs and automated reasoners for program verification: LLM oracle calls propose and repair properties, which the verifier checks (abstract; §3).
- Stated as a calculus of transition rules proved sound (abstract).
- LLM proposals that a sound verifier checks, beyond Coq and Lean provers; the calculus also refutes (Fail rule, Thm. 3.2), and 20 of its 107 "solved" Code2Inv instances are refutations, not proofs (released logs).

## In plain words

Proving that a program never breaks an assertion often needs a helper fact, such as a condition that holds on every pass through a loop, which automatic verifiers find hard to invent. The authors ask whether LLMs can supply this high-level reasoning soundly (abstract; §2). In Lemur, an LLM proposes and repairs candidate facts, each treated as an unproven assumption until an automatic verifier proves it. The authors state the method as rules and prove that a success or failure the rules reach is correct whenever the verifier's answers are (§3). Their algorithm on these rules provably stops, given a cap on proposals per goal and proposals placed earlier in the program than their goal (§4). With GPT-4 and the verifier ESBMC, they report solving 107 of 133 Code2Inv benchmark programs within 10 minutes, against 68 for ESBMC alone. They say this beats the 92 reported for Code2Inv, a learned invariant generator given one hour (§5.2). They call Lemur "the first fully automated framework combining LLMs and reasoners" (§1).

## Background and terms

**Terms to know:** [loop invariant](#/glossary/loop-invariant) · [soundness and completeness](#/glossary/soundness-and-completeness) · [SAT and SMT solvers](#/glossary/sat-and-smt-solvers) · [reinforcement learning](#/glossary/reinforcement-learning) · [abstract syntax tree (AST)](#/glossary/abstract-syntax-tree-ast) · [bounded model checking (BMC)](#/glossary/bounded-verification) · [k-induction](#/glossary/k-induction) · [abstract interpretation](#/glossary/abstract-interpretation)

**The paper's own terms:**
- **property**: a true/false condition on the program state plus a program line, written p = ⟨ϕ, l⟩ (§2).
- **invariant**: a property whose condition holds at its line, any line, in every execution (Def. 2.1).
- **assumption**: a property added to the program so that executions where it is false stop at its line (Def. 2.2). **q implies p** (with respect to P): p is an invariant once q is assumed (Def. 2.3).
- **stable**: in each execution, the condition is always true or always false at its line (Def. 2.4).
- **verifier V**: given a program, assumptions and a property, answers TRUE (proven), FALSE (falsified) or UNKNOWN. **Sound** here means both TRUE and FALSE are correct (§2).
- **oracles**: the LLM calls. O_propose proposes properties for a goal; O_repair revises an earlier proposal, told whether the verifier said FALSE or UNKNOWN (§3).
- **trail**: the list of proof goals in a calculus state; the last is the goal being proved (§3).

**Builds on:**
- Code2Inv (Si et al., 2020), a neural invariant generator trained by reinforcement learning against a reasoner's feedback: "The most related work" (App. E) and the §5.2 baseline.
- Pei et al. (2023), LLM-generated invariants for Java, and Charalambous et al. (2023), ESBMC-AI, LLM code repair checked by a verifier (§1; App. E). The authors say such work lacks a formalization of the LLM–verifier interaction, needs manual effort, or does invariant generation alone (§1).
- The C verifiers ESBMC (k-induction) and UAutomizer (predicate abstraction), per the authors the top two non-portfolio solvers (single tools, not combinations) in the reachability track of SV-COMP, the software verification competition (§5.1).

## Problem and setting

- **Question:** can LLMs do what verifiers find hard, "the automatic decomposition of a verification task into smaller, more manageable sub-tasks", while staying sound (§2)?
- **Correctness:** the target is whether the property is an invariant (Def. 2.1). The authors "further assume that V is sound" (§2). LLM proposals "are treated as assumptions until we can prove that they are invariants of the original program" (§3).
- **Programs:** C programs whose property is an assert statement. Code2Inv set: 133 benchmarks, one loop each (nested if-then-else blocks allowed, no nested loops), assertion after the loop, invariants proposed at the loop head (§5.2). SV-COMP 2023 set: 47 benchmarks under 150 tokens that ESBMC and UAutomizer cannot solve within 10 minutes; "The property is expected to hold in all benchmarks" (§5.3).
- **Models and limits:** GPT-4 and GPT-3.5 turbo through the OpenAI API; by default 30 seconds per verifier call (§5.1); 10 minutes per Code2Inv benchmark, with ESBMC checking implications, and 15 minutes per SV-COMP benchmark.

## Approach

- **Why sub-goals help (§2):** an invariant implying p makes p an invariant (Prop. 2.1). Lemma 2.1: if q is stable, q implies p, and not-q implies p, all with respect to the program, then p is an invariant.
- **The calculus (Fig. 1, §3):** rules saying when a step may be taken, starting from the program, no assumption, and a trail holding only the target property:
  - Propose: the verifier answers UNKNOWN on the goal, so an LLM proposal can become the assumption.
  - Repair 1 strengthens or corrects an assumption that doesn't let the verifier prove the goal; Repair 2 repairs a proposal on the trail that the verifier falsified.
  - Decide: the verifier proves the assumption implies the goal, so the assumption becomes the new goal.
  - Backtrack: the newest goal isn't proven, so return to the previous goal with another proposal.
  - Success 1: no assumption and the goal is proven. Success 2: the newest goal is stable and the verifier proves the previous goal assuming the newest one false (Lemma 2.1), so an "incorrect sub-goal" still splits the task into cases.
  - Fail: the verifier shows the original property is not an invariant, with or without an assumption.
- **Soundness (Thms. 3.1–3.2):** if valid rule applications from the start state for p0 reach SUCCESS, p0 is an invariant; if they reach FAIL, it is not; both rest on §2's sound-verifier assumption. Proofs: App. C.1.
- **The algorithm (Alg. 1, §4):** to make the calculus terminate, Alg. 1 allows at most k proposals per goal and requires Condition 1: every proposal sits at a smaller line number than its goal. It recurses on proposals shown to imply the goal, tries Success 2 when that recursion fails to prove one, and asks for a repair when the implication check gives UNKNOWN or the recursion gives FAIL. The authors state "The algorithm is sound as it only applies the rules of the calculus".
- **Termination (Thm. 4.1):** for any program and property, Alg. 1 stops with SUCCESS, FAIL or UNKNOWN, given its parameters: oracles that satisfy Condition 1 and the bound k (proof: App. D).
- **Tactics the authors found useful (§5.1):** a fixed output format instead of verbose chain-of-thought; placeholder lines ("// Line A"), as GPT "is not good at counting program lines"; several samples, proposals ordered by frequency and merged when their syntax trees are equivalent. Prompts: App. F.

## Results

The authors' claims.
- **Code2Inv (Tab. 1a, §5.2):** within 10 minutes Lemur (GPT-4) solves 107 of 133, Lemur (GPT-3.5 turbo) 103 and ESBMC 68; Code2Inv's 92, quoted from its original work, had one hour. Lemur "solves more instances than Code2Inv, which is specifically designed for invariant synthesis tasks". Among benchmarks Lemur solves and ESBMC doesn't, most need few proposals and some many (Fig. 3).
- **Hard SV-COMP (Tab. 1b, §5.3):** within 15 minutes Lemur (GPT-4) solves 25 of the 47, Lemur (GPT-3.5 turbo) 14, ESBMC and UAutomizer 1 each. Of Lemur's solved instances, 8 have two loops and 5 three or more, which "suggests" it handles several loops and boosts conventional verifiers. Mean proposals per solved problem: 7.2, against 4.7 on Code2Inv.
- **What the LLM adds (§5.3):** it can propose invariants with operators absent from the program (x%4==0 for the running example), bounds from an unsigned char's range (App. F.1), and disjunctive invariants, where predicate-abstraction techniques "typically" use the program's own operators and values.
- **Model choice (§5.3):** "LEMUR (GPT4) significantly outperforms LEMUR (GPT3) across all metrics".
- **Repeated runs (Tab. 3, App. G):** with 12 hours, UAutomizer solves 2 and ESBMC 4. Over three runs, Lemur (GPT-4) solves 25, 24, 24; without repair rules 19, 20, 20; with GPT-3.5 turbo 14, 15, 15. The authors conclude that running the baselines longer gives no "significantly more solutions", that repair rules "contribute to the solving of more instances", and that despite "un-negligible variance" the §5 conclusions on boosting verifiers and on the choice of oracle "remain valid".

## Limits the authors state

- The calculus alone has "no guarantees that it terminates" (§4).
- "modern verifiers are capable of handling only relatively small programs", and "even when provided with a strong invariant, they sometimes cannot solve the verification problem" (§6).
- Lemur "primarily focuses on imperative languages" (§6).
- "current LLMs have token limits, and many practical programs exceed those limits"; LLMs find formulas "with nested if-then-else expressions" sometimes challenging, and "programs with multiple loops" remain challenging (§6).
- Performance "may vary depending on the LLM oracle" (§6).
- "our framework does not yet offer a significant boost for complex properties of real-world C libraries" (§6).
- Proving hard benchmarks beyond conventional verifiers: "[In several cases]" (§5).

## Open problems and building blocks

  - Customize Lemur to one back-end verifier "to obtain better performance and solve larger programs"; extend it to functional languages (§6).
  - A prompting language for invariant generation, and fine-tuning LLMs with it; fine-tuning "could help" with multiple loops (§6).
  - Modular approaches summarizing program parts as pre- and post-conditions "can benefit from frameworks like LEMUR" (§6).
  - It "might be possible" to add rules that rewrite the program with LLMs "in an invariant-preserving manner" (§3); other rule-application strategies balancing LLM cost (§4; one in App. G).
- **Released:** "The source code and the benchmarks" (footnote 3, §5.1); execution traces on solved benchmarks "in the supplementary materials" (App. F).
- **To reuse it:** a sound automated verifier (ESBMC or UAutomizer), a GPT model through the OpenAI API, and App. F's prompts with placeholder lines; evaluated on C programs with assert statements, the SV-COMP ones under 150 tokens (§5).

## On this site

- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/harness-general">harness-general</a><a class="tag sub" href="#/tags/llm-assist">llm-assist</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/prove-general">prove-general</a></span>
