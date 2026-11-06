# Compilation Is Not Correctness: Scan-by-Scan Evaluation of LLM-Generated PLC Programs

**Compilation Is Not Correctness** · preprint 2026

Read: [PDF](https://arxiv.org/pdf/2610.28675) · [arXiv](https://arxiv.org/abs/2610.28675)

<p class="notice">A summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- A benchmark of 301 tasks for LLMs writing Structured Text (ST: a high-level textual language defined in IEC 61131-3 for programmable logic controllers, which run their logic in repeated scans), each with a reviewed public specification and a hidden reference program and input scenarios; a program passes only if it keeps the public interface, compiles, completes every scenario and matches the reference's outputs after every scan (abstract; §3). The authors call it "To our knowledge, the first benchmark for LLM-based Structured Text generation with comprehensive per-scan behavioral evaluation against hidden references" (§1).
- Candidate and reference are translated to C by the Matiec toolchain, built with GCC and driven with the same inputs, initialization and logical time (§3.2); eight LLMs run direct generation and adaptations of three published PLC methods (§5, Tab. 5); a fixed-trace study re-scores Direct's failures as if outputs were checked only every 2nd, 5th or 10th scan, or only at the end (§6.4). CycleGen samples five candidates, repairs each compile failure once from compiler diagnostics, and selects with self-tests the same model wrote beforehand in a separate context (§4).
- How often weaker checks accept wrong programs, measured on the same traces: the authors report that "checking outputs only at every fifth scan misses 21.66% of the 157 failures detected by per-scan comparison" (abstract); and model-written tests as a fallible selection signal, measured against the hidden reference (§6.3 "Self-test agreement and discrimination").

## In plain words

Programmable logic controllers (PLCs) are factory computers that repeat one cycle, a scan: read inputs, run the program, update outputs. They are typically programmed in Structured Text, a Pascal-like language. LLMs can now write this code from English, but the authors argue that a program that compiles, or matches at selected scans, can still give wrong outputs in between, and that published methods are hard to compare because their tasks and acceptance rules differ (§1). They build CycleBench, 301 tasks whose generated programs are compared with a hidden reference (a reference implementation the generators never see) after every scan, and a generation method, CycleGen. Across eight LLMs and four baseline methods, 83.99% of outcomes compile but 72.07% pass (§6.1). On fixed runs of five models' direct outputs, checking only every fifth scan, with each scenario's first and last scans kept, misses 34 of 157 failures at sampling offset zero (§6.4). CycleGen raises the eight models' pooled pass rate from 74.63% (direct generation) to 83.31% (§6.1). They call CycleBench "To our knowledge, the first benchmark for LLM-based Structured Text generation with comprehensive per-scan behavioral evaluation against hidden references" (§1).

## Background and terms

- **Terms to know:** [test oracle](#/glossary/test-oracle) · [best-of-N sampling](#/glossary/best-of-n-sampling) · [pass@k](#/glossary/passk) · [mutation testing](#/glossary/mutation-testing) · [Cohen's kappa](#/glossary/cohens-kappa) · [cluster bootstrap](#/glossary/clustered-standard-errors-and-cluster-bootstrap) · [multiple testing](#/glossary/multiple-testing) · [programmable logic controller (PLC)](#/glossary/programmable-logic-controller-plc) (and Structured Text (ST), "a high-level textual language defined by IEC 61131-3", §1)
  - **scan**: one run of a cyclic PLC task. Function-block instances keep state across calls and timers depend on elapsed time, so a test must fix the inputs, initialization, time progression and observed scans (§2.1).
  - **POU** (program organization unit): a function, function block or program, whose interface declares inputs, outputs and inouts (read/write arguments) (§2.1). A task's answer is one function block or program (§3.1).
  - **scenario**: input values for successive scans, with a scan interval and reset policy (when state returns to its initial values); expected outputs come from running the reference (Tab. 1). **Logical time** advances one scan interval per scan (§3.2).
  - **Comp.** (compilation rate): the share of task–model pairs whose program completes ST-to-C translation and native GCC compilation and linking. **Exec.** (execution pass rate): the share whose program also keeps the public interface, completes all scenarios and matches the reference at every scan. The **gap** is Comp. minus Exec. (§5).
  - **Eligible**: a CycleGen candidate that keeps the public interface and passes Matiec's ST-to-C translation (§4.2).
  - **requirement anchor**: the model's quotation of, or pointer to, the requirement clause a test case targets; only well-formed anchored cases add assertions to the selection score (§4.1).
  - **Oracle@k**: a retrospective count of pools (the candidates of one task and model) whose first k candidates include a hidden behavioral match, without the interface check; "not a deployable selector" (Fig. 4 caption).
  - **missed failure**: "a disagreement detected by that criterion but not by the coarser policy" (that criterion: per-scan comparison); **phase**: the offset at which a sampling stride starts (§6.4).
  - CodeT (selection with generated tests) and Self-Debugging (repair from execution feedback), which CycleGen "adapts" (§1): [CodeT](#/papers/chen2022codet "CodeT: Code Generation with Generated Tests (2023)"), [Self-Debugging](#/papers/chen2023selfdebug "Teaching Large Language Models to Self-Debug (2023)"); and MBR-EXEC and DOCE, execution-based selection (§4.4), not listed here.
  - The PLC methods LLM4PLC and Agents4PLC (formal-verification feedback), AutoPLC (repair from vendor-compiler diagnostics) and SemaPLC (specification, compilation and runtime checks), adapted or reconstructed as baselines (§2.3; §5); not listed here.
  - EvalPlus, which expands test inputs; RQ4 asks instead "when outputs must be observed within the same execution" (§6.4): [EvalPlus](#/papers/liu2023evalplus "Is Your Code Generated by ChatGPT Really Correct? Rigorous Evaluation of Large Language Models for Code Generation (2023)").

## Problem and setting

- **Questions** (§5): how far execution trails compilation (RQ1), which failures occur (RQ2), how observation granularity changes verdicts (RQ4), and, for CycleGen (RQ1, RQ3), "whether runtime feedback can improve ST code generation when the generator does not have access to hidden references or evaluation scenarios" (§1).
- **What "correct" means** (§3.2): matching the hidden reference after every scan on all declared outputs and inouts, decoded types and values exactly, from the first scan and without shifting traces; private variables may differ (§3.1). Both programs start each scenario fresh.
- **Benchmark** (§3.1, §3.3, Tab. 2): 287 function blocks and 14 programs, 684 scenarios; the median task has one scenario and 15 scans. Sources: GitHub, AutoPLC's library, the Agents4PLC dataset, and examples from the open-source PLC toolchains Matiec and OpenPLC. DeepSeek-V3.2 and Grok-4.6 helped draft requirements, Grok-4.6 and Qwen3-Coder-Next generated scenario inputs, and two PLC engineers jointly reviewed the tasks (§3.1).
- **Models** (§5): GPT-5.5, GPT-4o, Claude Sonnet 4, Claude Haiku 4.5, GLM-5.2, Qwen3-Coder-Next, MiniMax-M2.5 and Qwen3.6-27B, accessed in September 2026; aliases "identify deployments rather than immutable checkpoints". RQ2 and RQ4 use the first five.
- **Baselines** (§5, Tab. 4): Direct (one program from the public requirement and interface), and adaptations of Agents4PLC, LLM4PLC and AutoPLC from public material that keep compiler-feedback repair but omit formal-property checking. Each returns one program per task and model; failures stay in the denominator.

## Approach

- **Evaluator** (§3.2): translates candidate and reference to C with a fixed Matiec build, builds them with GCC, and drives both with identical inputs, initialization, scan intervals and resets; references and scenarios stay hidden from generation, selection and repair.
- **CycleGen** (§4, Fig. 3):
  - *Context & Generation* (§4.1): the same model writes one self-test suite (each case a reset, inputs, predicted outputs and a requirement anchor; at most one revision), then, in a separate context that never sees the suite, k = 5 programs with distinct seeds; this "controls information flow, not semantic independence".
  - *Compile-Fix* (§4.2): each candidate failing Matiec's front end gets at most one repair from its diagnostics, kept only if it keeps the interface and passes.
  - *Self-Test* (§4.3): runs the suite on each eligible candidate in the benchmark runtime.
  - *Selection Gate* (§4.4): ranks by complete execution, then more passing cases, then fewer mismatched outputs, then generation order.
- **RQ4** (§6.4): keeps the five models' Direct programs and traces fixed and re-scores their 157 behavioral failures under sparser observation, at every phase.
- **RQ2** (§5): one reviewer labels each behavioral failure; a blinded second annotator checks 40 sampled tasks.

## Results

- **Compile–execution gap** (§6.1, Tab. 5): across 9,632 baseline outcomes, 83.99% compile and 72.07% pass, a gap of 11.92 points (95% interval 9.63–14.43), which "appears in every model–method combination, including combinations with compilation rates above 99%".
- **CycleGen** (§6.1, Tab. 5): 83.31% against Direct's 74.63% (+8.68 points, interval 7.23–10.22) and adapted Agents4PLC's 76.33%, the strongest pooled baseline; it also beats each model's best baseline (descriptively: no significance test per model) and still leaves a compile–execution gap. The gap and gain persist without the tasks from Agents4PLC or AutoPLC, or without the six tasks over 1,000 scans (§6.1 "Source and scenario-length sensitivity").
- **SemaPLC** (§6.1 "SemaPLC reconstruction…"): run with GPT-4o only, it passes fewer tasks than CycleGen on that model, with many times its tokens.
- **Direct's failures** (§6.2, Tab. 6): compilation failures are led by malformed statements and declarations; behavioral failures by public-output updates, arithmetic or boundary logic, and timing or call order.
- **Observation granularity** (§6.4): every 2nd, 5th or 10th scan at phase zero misses 11, 34 or 47 of the 157 failures (7.01%, 21.66%, 29.94%), "even when each scenario's first and final scans are always checked". Final-scan-only checking misses 98 (62.42%), raising the five models' apparent Direct pass rate from 79.53% to 86.05%. "Every fixed phase misses failures"; all final-scan misses are failures whose outputs agree again later in the scenario (§6.4 "Mechanisms…").
- **Ablations** (§6.3, Tab. 7): five unrepaired candidates with first-eligible selection reach 79.94% from Direct's 74.63%; with the suite and selector fixed, removing Compile-Fix lowers CycleGen by 2.28 points; self-test selection adds 1.62 points over first-eligible selection on repaired pools (Holm-adjusted p = 1.14×10⁻⁵). Mean tokens per task–model pair: 1,929 for Direct, 18,197 for CycleGen.
- **Candidate count** (§6.3, Fig. 4): from five to eight candidates, tokens rise 38.8% and four selected passes are lost, while the pool oracle still rises.
- **Self-test pilot** (§6.3 "Self-test agreement…"): on 24 tasks, suites' predictions match most reference scans, but many valid suites reject the reference on some case; suites that accept the reference reject most single-site mutants, yet only a minority of all suite slots detect any mutant.

## Limits the authors state

- Passing "establishes agreement on the supplied finite scenarios, subject to reference validity, rather than complete functional correctness, termination, or physical safety"; "physical timing guarantees require separate measurements" (§3.2).
- "Exact equality may count numerical rounding differences as failures"; the independent annotation "assesses consistency, not unique root causes or sparse-category accuracy" (§7 "Construct validity").
- The Agents4PLC and LLM4PLC adaptations omit their described formal-verification loops: "Results characterize these adaptations, not native systems"; budgets differ, and "shared pools narrow but do not remove this limitation" (§7 "Baseline fidelity"). SemaPLC's result is not "an eight-model baseline ranking or a complete reproduction claim" (§6.1).
- Taxonomy and observation analyses cover five models; source concentration and limited scenarios constrain diversity and coverage; "Baseline-derived tasks and Qwen3-Coder-Next's roles in scenario authoring and evaluation may affect results; training exposure remains unknown"; fixed budgets, one runtime and provider-specific reasoning limit transfer to other dialects and physical controllers (§7 "External validity").
- "The CycleGen configuration was developed using this benchmark. Independent tasks and repeated generations are needed to assess generalization and sampling stability" (§7 "Conclusion validity"); one program per condition cannot estimate reliability over repeated runs or seed variance (§5).
- Tests and code share a model and specification, "so a shared misunderstanding can still appear in code and predicted outputs" (§4.1).
- The ablations "fix pools and stated controls, not total inference resources"; Self-Test's and Selection Gate's effects "are not separately identified"; the best observed k "does not establish a generally optimal or equal-resource budget" (§6.3).
- Task-cluster bootstrap intervals and Holm-corrected tests are "exploratory estimates on the evaluated task set"; "related tasks may violate independence" (§5).
- Syntax-feature counts "do not establish semantic coverage" (§3.3); "visible agreement does not establish internal-state equivalence" (§6.4).

## Open problems and building blocks

- **Open:** no future-work section. The bottleneck named: the gap between pools holding a match and CycleGen's selection "includes both interface-contract violations and limitations of self-test coverage, execution availability, and ranking", and in most tied pools "changing expected outputs alone cannot separate them" (§6.3); "broader input scenarios address a separate coverage question" (§6.4).
- **Released:** "We plan to publicly release the code and data after the peer-review process is complete" (Data Availability).
- **To reuse it:** a fixed Matiec build and GCC (§3.2). CycleGen's budget, excluding transport retries: one test-authoring call, at most one suite revision, k generations and at most k repairs (§4.4); at k=5, 7 model calls per task–model pair on average, against Direct's 1 (§6.3).

## On this site

- **Discussed in:** [Weak checkers get exploited](#/challenges/weak_checker_exploitation)
- **Tags:** <span class="tags"><a class="tag" href="#/tags/cex">cex</a><a class="tag" href="#/tags/code">code</a><a class="tag" href="#/tags/hacking">hacking</a><a class="tag" href="#/tags/harness">harness</a><a class="tag" href="#/tags/labels">labels</a><a class="tag" href="#/tags/llm">llm</a><a class="tag" href="#/tags/method">method</a><a class="tag" href="#/tags/scaling">scaling</a></span>
