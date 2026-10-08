# LLM-Powered Test Case Generation for Detecting Bugs in Plausible Programs

**TrickCatcher** · ACL 2025

Read: [PDF](https://arxiv.org/pdf/2404.10304) · [arXiv](https://arxiv.org/abs/2404.10304) · [DOI](https://doi.org/10.18653/v1/2025.acl-long.20)  
Code: [TrickCatcher](https://github.com/RinCloud/TrickCatcher)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Generates tests that expose bugs in "plausible programs", those that pass an existing test suite yet are wrong (abstract; §3).
- An LLM writes repaired variants of the program under test, kept only if they pass the existing tests, and a Python input-generator script; the generated inputs run on the program and its variants, and an output that differs from the program's becomes the oracle, the most frequent among the differing ones rather than the majority (§4.1–4.3, Alg. 1). Runs on `gpt-3.5-turbo-0125` (§5.5); evaluated on TrickyBugs and EvalPlus plausible programs (§5.2).
- Refuting programs that pass their tests, with executed inputs and an oracle from LLM-written variants (<a class="tag" href="#/tags/cex">cex</a>); it follows [Who Judges the Judge](#/papers/liu2023onlinejudge "Who Judges the Judge: An Empirical Study on Online Judge Tests (2023)") (same first author), whose majority-vote oracle it replaces (§4.3). The authors report that 40.10% of test inputs an LLM writes directly from the input constraints are invalid (§1), the false-positive source its generator step addresses.

## In plain words

A program can pass every test in its test suite and still be wrong. The authors call such programs plausible, and their hidden bugs tricky bugs (§1). They say a recent study found such bugs common in programs that online-judge sites had accepted, and that testing methods aimed at them have been "largely overlooked" (§1). They built TrickCatcher: an LLM checks the program for bugs and writes repaired versions, kept only if they still pass the existing tests, and writes a Python script meant to generate valid inputs; each input runs on the program and its versions, and the most common output that differs from the program's becomes the expected answer of a new test (§1; §4). With gpt-3.5-turbo, on 366 human-written and 151 LLM-written plausible programs, they report up to 1.80×, 2.65× and 1.66× the recall, precision and F1 score of the best baseline, an adapted LLM test generator (§6.1), and up to 16× fewer false alarms than the other test generators on correct programs of the EvalPlus code benchmark (§6.2). They present it as filling that gap (§1).

## Background and terms

**Terms to know:** [differential testing](#/glossary/differential-testing) · [test oracle](#/glossary/test-oracle) · [automated program repair](#/glossary/automated-program-repair) · [F1 score](#/glossary/f1-score)

**The paper's own terms:**
- **PUT (program under test)**: the program being tested (§1).
- **test oracle**: in this paper, the expected output itself; a test case is an input plus its oracle, and fails when the PUT's output differs from the oracle (§1; §3).
- **tricky bug**: a bug in a plausible program; the authors say these are "often logical corner cases, that escape detection by test suites" (§1; §3).
- **program variant**: a version of the PUT written by an LLM asked to find and repair any bug in it (§4.1, Fig. 3).
- **input generator**: a Python script, written by an LLM from the specification, that produces test inputs meeting the stated input constraints (§4.2, Fig. 4).
- **true positive (TP), false positive (FP)**: a failing test case is a TP when its input is valid and its oracle correct, and an FP, a false alarm, when either condition fails (§3). The paper sorts FPs into incorrect oracles and invalid inputs (§6.2).
- **precision, recall**: precision is TP / (TP + FP); recall is TP / (TP + FN), where on a buggy PUT every negative counts as a false negative (FN) (§5.3).
- **majority voting**: taking the most frequent output as correct (§1).
- **k**: the number of program variants used, 2 to 10 in the experiments (Tab. 1).
- **useful variant**: one that produced the correct oracle for some TP test case; a variant is **buggy** if it ever gave an output different from the canonical solution (§7.1).

**Missing glossary terms:**
- **plausible program**: a program that passes all test cases in a given test suite (plausible relative to that suite); a **buggy plausible program** still contains a bug (§3).

**Builds on:**
- Differential Prompting (Li et al., 2023), which the authors call the state of the art in LLM-based test generation for bug detection; it also generates program variants, but uses majority voting. They adapt it as their baseline DPP (§2; §5.4). Not on this site.
- Liu et al. (2023b), the study of online-judge tests that found tricky bugs in accepted programs (§1), cited also for majority voting as the usual practice in differential testing (§4.3): [Who Judges the Judge](#/papers/liu2023onlinejudge "Who Judges the Judge: An Empirical Study on Online Judge Tests (2023)").
- The datasets (§5.2) TrickyBugs (Liu et al., 2024b; online-judge plausible programs with extra bug-revealing tests; not listed here) and EvalPlus (Liu et al., 2023a; a code-generation benchmark with base and extra tests; [EvalPlus](#/papers/liu2023evalplus "Is Your Code Generated by ChatGPT Really Correct? Rigorous Evaluation of Large Language Models for Code Generation (2023)")).
- Set apart (§2): LLM test generators aimed at coverage, not bugs (ChatTester, TestPilot, ChatUnitTest, SymPrompt), and search-based and [symbolic execution](#/glossary/symbolic-execution) tools (EvoSuite, Pynguin, KLEE), which they say cannot automatically parse specifications.

## Problem and setting

- **The question (§3):** given a plausible program and its specification (and, for TrickCatcher, its existing test suite, §4), generate test cases, each an input with its correct output, on which the program gives a wrong output.
- **What "correct" means (§3):** the specification defines a mapping from valid inputs to outputs. A test case is valid only if its input is in the valid input space and its oracle equals the specified output.
- **Ground truth (§5.3):** the datasets' canonical programs give the correct outputs; input validity is checked with EvalPlus's Python checkers and, for TrickyBugs, by hand.
- **Scope (App. A):** functional bugs, not timeouts or crashes.
- **Programs (§5.2):** 251 C++ and 115 Python human-written plausible programs from TrickyBugs (online-judge tasks); 151 EvalPlus tasks, each with an LLM-written program from EvalPlus's pre-generated samples that passes the base tests but fails the extra ones.
- **Model (§5.5):** `gpt-3.5-turbo-0125` for TrickCatcher and all baselines, chosen to balance "performance and cost"; deepseek-v3 is added on EvalPlus only (§7.2).
- **Repetition (App. B):** for DPP and TrickCatcher, 100 inputs and 10 variants are sampled per program; metrics are averaged over every choice of k of the filtered variants.
- Tasks that accept several correct outputs: not discussed.

## Approach

Three steps (§4, Fig. 2):

- **PUT-guided program variant generation (§4.1, Fig. 3).** The LLM sees the specification and the PUT, is asked whether the PUT has a bug, and if so repairs it. Variants that fail the existing test suite are dropped. The authors' reasoning: the PUT is already partly correct, so an LLM building on it is "more likely to produce high-quality variants with a reduced risk of introducing new bugs" than one writing from the specification alone.
- **Generator-based test input generation (§4.2, Fig. 4).** Instead of inputs, the LLM writes a Python input generator, which is then run. The authors say this "separates logical reasoning from input generation" (§1). Few-shot examples teach the LLM a helper library (CYaRon in the experiments), and "the library can be easily replaced by adjusting the few-shot examples" (§4.2).
- **Diversity-driven differential testing (§4.3, Alg. 1).** Each input runs on the PUT and every variant. If some variants' outputs differ from the PUT's, the most frequent of those differing outputs becomes the oracle, and the input with that oracle becomes a test case; if all agree with the PUT, the input is dropped. The authors call this "counterintuitive", since developers typically rely on majority voting: the LLM "can also be misled by the PUT", so variants may inherit its bug, and they "place greater trust in program variants that differ from the PUT’s output" (§4.3).

## Results

Baselines (§5.4): DirectChat (CHAT, the LLM writes bug-revealing test cases directly from the PUT and specification); DPP (Differential Prompting given the true specification instead of an inferred one); and APR (the LLM writes repair patches; a correct patch counts as a TP), which the authors add to show the method is not just program repair.

- **Bug detection (§6.1, Tab. 1).** The authors report up to 1.80×, 2.65× and 1.66× DPP's recall, precision and F1 score, and best F1 scores of 41.31%, 42.35% and 51.34% on TrickyBugs (C++), TrickyBugs (Python) and EvalPlus, against DPP's 24.95%, 36.20% and 35.76%. Tab. 1 gives the improvement three ways (average over k, best against best, worst against worst); in the best-against-best rows, recall on TrickyBugs (Python) and precision on EvalPlus are lower than DPP's.
- **False alarms on correct programs (§6.2, Fig. 5; EvalPlus only, since it has input checkers).** The authors report up to 16× fewer FPs than DPP and CHAT, none of TrickCatcher's from invalid inputs, while most of DPP's come from invalid inputs and most of CHAT's from incorrect oracles. Their motivating measurement, from preliminary experiments: 40.10% of test inputs an LLM generates directly from the input constraints are invalid (§1).
- **Ablation (§6.3, Tab. 2; TrickyBugs C++ only).** Six combinations of basic and full versions of the steps, plus a test-filtered basic program generation; the authors read it as showing that each component contributes.
- **Number of variants (§6.4, Fig. 6; TrickyBugs C++ only).** The authors report TrickCatcher stays stable as k changes while DPP fluctuates, and that in precision and F1 TrickCatcher, "even in the worst case, outperforms DPP in the best case".
- **Task difficulty (§6.5, Figs. 7–8; TrickyBugs).** The authors report a larger advantage over DPP on harder tasks, and that more of TrickCatcher's variants than DPP's pass the base tests, more so on harder tasks.
- **Buggy variants help (§7.1).** The authors find that 23.2% (TrickyBugs) and 15.0% (EvalPlus) of useful variants are buggy; the authors conclude that "buggy program variants can also contribute to generating true positive test cases", and note TrickCatcher's recall beats APR's "in most cases" (on EvalPlus APR's is higher, Tab. 1).
- **Another model (§7.2, Tab. 3; EvalPlus).** With deepseek-v3, recall, precision and F1 are all higher than with gpt-3.5-turbo; the authors find "the stronger the underlying model, the better the performance".

## Limits the authors state

- Only two models, "due to budget constraints", gpt-3.5-turbo and deepseek-v3; they believe more advanced LLMs "could further enhance the performance" (§ "Limitations").
- "the inherent uncertainty in the behavior of LLMs", which they mitigate by repeated runs and averaging (§ "Limitations"; App. B).
- "the risk of data leakage" (in the glossary's terms, [data contamination](#/glossary/data-contamination)): TrickyBugs was released after `gpt-3.5-turbo-0125`, EvalPlus prohibits training on it, and the baselines' poor scores suggest "data leakage is not a main concern in our evaluation" (§ "Limitations").
- The FP study uses only EvalPlus (§6.2); the ablation uses only TrickyBugs (C++) "Due to the page limit" (§6.3).
- DPP is a modified baseline: Differential Prompting "is not designed or evaluated for detecting bugs in plausible programs", and is given the true specification "for a fair comparison" (§5.4).
- A failing test can stem from an error in the test itself (§3).

## Open problems and building blocks

- **Open:** None stated.
- **Released:** "Code and data used are available at" the authors' repository (abstract).
- **To reuse it:** the PUT, its natural-language specification and its existing test suite (§4); an LLM (`gpt-3.5-turbo-0125`, §5.5; deepseek-v3, §7.2); a Python environment to run the generated input generators, with a helper library taught by few-shot examples (CYaRon, §4.2); canonical programs and input checkers only for evaluation (§5.3).

## On this site

- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/cex-general">cex-general</a><a class="tag sub" href="#/tags/cex-llm">cex-llm</a><a class="tag sub" href="#/tags/llm-assist">llm-assist</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/scaling-general">scaling-general</a></span>
