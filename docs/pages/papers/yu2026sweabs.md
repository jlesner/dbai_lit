# SWE-ABS: Adversarial Benchmark Strengthening Exposes Inflated Success Rates on Test-based Benchmark

**SWE-ABS** · ICML 2026 (per the authors' repo)

Read: [PDF](https://arxiv.org/pdf/2603.00520) · [arXiv](https://arxiv.org/abs/2603.00520)  
Code: [SWE-ABS](https://github.com/OpenAgentEval/SWE-ABS)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Strengthens SWE-Bench test suites in two stages: tests aimed at patch-relevant lines found by program slicing, then LLM-made mutants of the gold patch that pass the existing tests, with new tests written to reject them (abstract; §3).
- LLM agents (GPT-5 by default) write and run the tests; three LLMs vote on whether each mutant is equivalent to the gold patch, checked against human labels on a sample (§3.2.2; §4.1; App. A.1.3, A.4.3). Tests that overfit the gold patch were found by manual inspection and fixed before the reported results (§4.4.1; Tab. 2 caption).
- Benchmark tests that accept wrong patches, measured on the leaderboard: the authors report rejecting 2,184 of the 11,041 patches from the top-30 agents that passed the original SWE-Bench Verified tests (19.78%) (abstract; §1; Tab. 2); the top agent drops from first to fifth (Tab. 1).

## In plain words

Coding agents are ranked on SWE-Bench, real GitHub issues where a fix counts as solved when it passes the project's tests, and its leaderboard is "approaching saturation" (abstract). The authors argue that these tests, taken from developers' pull requests, check one fix rather than tell correct fixes from wrong ones, so wrong fixes pass (§1). Their SWE-ABS has LLM agents add tests in two stages: tests aimed at the code a fix touches, then tests that reject deliberately wrong variants of the reference fix that the existing tests miss (§3). On SWE-Bench Verified (500 human-checked tasks), the new tests reject 2,184 of the 11,041 patches from the top-30 agents that had passed (19.78%), after the authors hand-corrected new tests that encoded details of the reference fix in 53 tasks (§1; §4.4.1). The top agent falls from 78.80% to 62.20%, from first place to fifth (Tab. 1). The authors present this as far stronger than the prior tool UTBoost, and as evidence of inflated scores (abstract; §1).

## Background and terms

**Terms to know:** [automated program repair](#/glossary/automated-program-repair) · [mutation testing](#/glossary/mutation-testing) · [LLM-as-a-judge](#/glossary/llm-as-a-judge) · [Spearman's rank correlation](#/glossary/spearmans-rank-correlation) · [data contamination](#/glossary/data-contamination) · [abstract syntax tree (AST)](#/glossary/abstract-syntax-tree-ast)

**The paper's own terms:**
- **instance**: one SWE-Bench task: an issue, a gold patch, and the original tests, which are the repository's existing tests plus those added in the pull request (§3).
- **discriminative power**: "the ability to reject incorrect solutions while accepting correct ones" (§1).
- **coverage gap**: tests that "miss patch-affected code entirely"; **semantic blind spot**: tests that "accept superficially correct behavior without verifying deeper semantic requirements" (§1).
- **mutant**: an LLM-made edit of the gold patch meant to be wrong yet pass the original tests (§3.2.1). It is **equivalent** if it behaves like the gold patch (§3.2.2).
- **false negative / false positive**, about the tests: an equivalent mutant the tests reject (tests too tied to the gold patch); a non-equivalent mutant they accept (a blind spot) (§3.2.3). §4.4.1 also calls the share of instances with overfitting tests a "false-negative rate".
- **test decoupling**: an LLM step that rewrites generated tests tied to the gold patch's details (e.g. hard-coded error messages) so they check only that the issue is fixed (§3.1.2; App. A.2).
- **Metrics** (§4.1): **Str.** (strengthened), instances where at least one previously passing patch now fails; **Drop**, the fall in an agent's resolve rate, in percentage points; **Patch Kill**, patches the new tests reject; Spearman ρ between old and new rankings (1 means unchanged).
- **SWE-ABS\***: the run that drops the 53 instances with overfitting tests instead of correcting them (Tab. 2 caption).

**Missing glossary terms:**
- **program slicing**: finding the lines a set of lines depends on (backward slice) or that depend on them (forward slice), through data flow (a variable defined here, used there) and control flow (§3.1.3; App. A.3.2). **Intraprocedural** slicing stays within one function or class.
- **plausible patch**: one that passes all tests; citing Qi et al. (2015) and Smith et al. (2015), the paper says such patches "may not be correct (genuinely fixing the bug)" (§2).
- **gold patch**: the reference fix shipped with the issue, "The official or correct fix patch" in the prompts (App. A.1.5).
- **resolve rate**: the share of instances an agent solves (its patch passes the tests); the paper uses the term without defining it.

**Builds on:**
- SWE-Bench (Jimenez et al., 2024) and its variants SWE-Bench Verified (Chowdhury et al., 2024) and SWE-Bench Pro (Deng et al., 2025), the benchmarks evaluated (§2).
- UTBoost (Yu et al., 2025), LLM-generated extra unit tests for SWE-Bench, the main baseline (RQ1, §4.2; cost, App. A.8).
- EvalPlus (Liu et al., 2023; [EvalPlus](#/papers/liu2023evalplus "Is Your Code Generated by ChatGPT Really Correct? Rigorous Evaluation of Large Language Models for Code Generation (2023)")), which added generated tests to the code benchmarks HumanEval and MBPP (§2).
- Mutation testing (DeMillo et al., 1978; Jia & Harman, 2011) and its LLM-based forms (Wang et al., 2026; Harman et al., 2025), which SWE-ABS says it "extends" (§2).

## Problem and setting

- **Question:** how many wrong patches do SWE-Bench tests accept, and can generated tests reject them without rejecting correct alternative fixes (§1; research questions RQ1–RQ4, §4)?
- **"Incorrect"** means passing the original tests but failing the strengthened ones, which "assumes the augmented tests do not overfit to gold-patch-specific behaviors" (App. A.12). The gold patch is taken as correct: new tests must pass it (§3.1.2; App. A.1.6).
- **Benchmarks:** all 500 instances of SWE-Bench Verified (human-validated, Python); 150 of SWE-Bench Pro's 731 (harder, contamination-resistant; Python, JavaScript, Go, TypeScript), sampled at random, stratified by language, among instances some agent's patch passes (§4.1).
- **Patches:** those passing the original tests, from the top-30 leaderboard agents on Verified and all 13 available on Pro, "collected as of December 31, 2025" (§4.1); agents limited to a bash tool in App. A.6.
- **Models:** GPT-5 runs every stage by default; GLM-4.7, an open-source model, is the alternative (§4.1).

## Approach

Test and mutant writers are LLM agents issuing shell commands in the repository (prompts in App. A.1; pipeline in Fig. 2).

- **Stage I, coverage-driven (§3.1).** The LLM writes tests from the issue, the gold patch and the pull request's tests; test decoupling generalizes them and keeps those the gold patch passes; slicing with the multi-language parser Tree-sitter finds patch-relevant lines (App. A.3.2); the LLM is shown the relevant lines no test executes and asked to cover them (§3.1.1–3.1.4).
- **Stage II, mutation-driven (§3.2).** Coverage only makes tests reach the code: a wrong fix "may execute the same control-flow paths as the correct patch yet produce incorrect states or outputs that existing assertions fail to detect" (§3.2).
  - An LLM writes up to 2 mutants per instance that pass the original tests (§3.2.1; App. A.3.1).
  - Three LLMs judge each mutant's relevance to the issue and its equivalence to the gold patch, by majority vote; irrelevant mutants are dropped (§3.2.2).
  - For each false negative, an LLM relaxes the tests that rejected it; for each false positive, an LLM writes tests that pass the gold patch and fail the mutant. The final suite swaps in the relaxed tests and adds the new ones (§3.2.3–3.2.4; App. A.1.6).
- **Hand correction.** The authors hand-inspected all 500 Verified instances and revised or removed gold-patch-specific assertions in the 53 where they found them; Tab. 1 and Tab. 2 report results after this (§4.4.1).

## Results

- **Verified (§4.2).** SWE-ABS strengthens 251 of 500 instances against UTBoost's 10 (a 25.1× improvement, abstract), with an average Drop over the top-30 agents of 14.56 points against 0.70 (Tab. 2), and rejects 2,184 of 11,041 passing patches (19.78%). The authors report significant reordering: the top agent (the TRAE agent with the Doubao-Seed-Code model) falls from 78.80% to 62.20%, first to fifth, and live-SWE-agent with Gemini 3 Pro Preview rises to first (Tab. 1; all 30 in Tab. 4).
- **SWE-Bench Pro (§4.3.1).** Although the top system's resolve rate there is far lower, SWE-ABS strengthens 97 of 150 instances, with an average Drop of 16.46 points against 14.56 on Verified (Tab. 9): "a benchmark can be hard yet still have weak test suites". Python has the highest strengthening rate, TypeScript the lowest (Tab. 7).
- **Base model (§4.3.2).** On 50 random Verified instances, GLM-4.7 strengthens as many instances as GPT-5, with a lower Drop; the authors say this suggests the method "is not tightly coupled to a specific proprietary base model" (Tab. 10).
- **Error types (§4.4.2).** Of 100 rejected patches classified by two authors, 47% are logic errors and 35% incomplete fixes; type mismatches, boundary violations, off-by-one and other errors make up the rest (Tab. 11; examples in App. A.11.2). The authors link this to training on test-passing rewards, which they say encourages agents to "teach to the test".
- **Ablation (§4.5).** Stage I alone gives "a modest improvement" over the initial tests; Stage II adds "substantial additional gains" (Tab. 3).
- **Judge and cost.** On 100 sampled mutants, the LLM judge agreed with human equivalence labels at a high rate (App. A.4.3). SWE-ABS costs more per instance than UTBoost but, the authors report, much less per strengthened instance (§4.2; App. A.8).

## Limits the authors state

- **Overfitting:** augmented tests "may encode gold-patch-specific behaviors", "a conservative false-negative rate of 10.6% (53/500)" of instances (§4.4.1; §5; case in App. A.11.1).
- **Slicing scope:** it "may miss cross-module dependencies"; interprocedural analysis has a cost that "may be prohibitive for large-scale benchmarks" (§5; App. A.12).
- **Gold patch needed:** "requiring reference implementations limits applicability to scenarios without them", e.g. real-time bug triage (§5; App. A.12).
- **Validity (App. A.12):** "LLM-based components inherit risks of hallucination and prompt sensitivity"; results "may not generalize to other programming languages outside this subset" of four, nor to proprietary code or functional and low-level languages; the LLM equivalence labels "may misclassify subtle semantic differences", which voting over three LLMs is meant to reduce.

## Open problems and building blocks

  - "Fully automated detection of such overfitting remains an open challenge." (App. A.12).
  - Weakening the gold-patch requirement "through property-based testing or specification mining techniques" (inferring specifications from code or runs) (App. A.12; [property-based testing](#/glossary/property-based-testing)).
  - Java, C++ and Rust through language-specific parsers; pipelines that periodically re-strengthen benchmark tests; strengthened tests as training signals in environments such as SWE-Gym, a training environment for software agents (§5).
- **Released:** strengthened test suites for Verified (500 instances) and the Pro subset (150), "included in supplementary materials" (§1); "All data, enhanced test suites, and evaluation scripts are publicly available" (§ "Software and Data").
- **To reuse it:** a gold patch per task (§5); an LLM for every stage (GPT-5; GLM-4.7 tested) (§4.1); Tree-sitter and coverage tools for Python, JavaScript, Go and TypeScript (App. A.3.2–A.3.3); with GPT-5, about $2.50 and 18.5 minutes per instance (App. A.8, Tab. 8); hyperparameters in App. A.3.1.
- **Beyond its domain:** the approach "applies to any domain where correctness can be verified through automated testing, including code translation, text-to-SQL, and robotic control" (§ "Impact Statement"); §5 claims "potential applicability to other domains with executable oracles" ([test oracle](#/glossary/test-oracle)).

## On this site

- **Tags:** <span class="tags"><a class="tag" href="#/tags/labels">labels</a><a class="tag sub" href="#/tags/cex-general">cex-general</a><a class="tag sub" href="#/tags/cex-llm">cex-llm</a><a class="tag sub" href="#/tags/harness-general">harness-general</a><a class="tag sub" href="#/tags/llm-assist">llm-assist</a><a class="tag sub" href="#/tags/llm-method">llm-method</a></span>
