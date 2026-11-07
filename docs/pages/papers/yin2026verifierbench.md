# VerifierBench: Benchmarking the Generation of Executable Verifiers for LLM Agents

**VerifierBench** · preprint 2026

Read: [PDF](https://arxiv.org/pdf/2610.28679) · [arXiv](https://arxiv.org/abs/2610.28679)

<p class="notice">A summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- A benchmark of verifier generation: from the instruction and environment a solver would get, an agent writes an executable verifier that must return PASS for every valid solution and FAIL for invalid ones, scored on 222 tasks from six agent benchmarks (tool-call, state and code tasks) with 4,993 hidden test cases: reference solutions, valid variants, ordinary errors and attacks on verification (abstract; §2.1–2.2, Tab. 1).
- Labels are screened by Verifier4Verifier (V4V), six checks on the source verifiers and test cases (replay, repeatability, provenance, input-label consistency, trivial baselines, mutation testing), which excluded 45 of 267 initial tasks for confirmed source defects (§2.3; App. B.1). 19 models run in one agent harness (Pi), plus 17 other model–harness pairs; the score is normalized task-averaged balanced accuracy, true positive rate plus true negative rate minus 100 (§2.4, Eq. 1; §3.1). Generation code and traces of selected failing verifiers are read to find the checks that reject valid solutions and why self-tests missed them (§4).
- LLM-written checks scored on both sides against an audited, labelled suite: valid variants they wrongly reject and planted attacks they wrongly accept (<a class="tag" href="#/tags/labels">labels</a>, <a class="tag" href="#/tags/hacking">hacking</a>), with V4V as an audit of a benchmark's own verifiers before use (our reading). The authors report that every model's verifiers accept valid solutions less reliably than they reject invalid ones, with true positive rates of 21.1% to 70.2% (§3.2, Tab. 2), and that in the records they analyzed (nine models' archived per-task records and one model's trace batch) most false rejections come from verifiers that reject every test case of their task (§3.4; App. H).

## In plain words

When agents build their own training data, programs called verifiers decide which candidate solutions are rewarded or kept, so a wrong one can repeatedly reward violations or discard valid solutions (§1). The paper asks how well an LLM agent writes such a verifier: from what a solver of the task would see, the agent writes a program that must answer PASS for every valid solution and FAIL for invalid ones (abstract). The authors build VerifierBench, 222 agent tasks whose hidden test solutions include valid alternatives and deliberate attacks, with an audit of its labels, and test 19 models in one shared agent framework and 17 other pairings (abstract; §1). In the shared framework, scores range from 10.6 to 62.1, where always giving the same answer scores 0 and perfect agreement 100 (abstract; §2.4). Every model's verifiers accept valid solutions less reliably than they reject invalid ones, and in the records analyzed most wrong rejections come from verifiers that accept no tested solution to their task (abstract; §3.2; §3.4). They present a benchmark, a screening procedure and an analysis (§1).

## Background and terms

**Terms to know:** [agent harness](#/glossary/agent-harness) · [tool calling (function calling)](#/glossary/tool-calling-function-calling) · [test oracle](#/glossary/test-oracle) · [true and false positive rates](#/glossary/true-and-false-positive-rates) · [macro recall (balanced accuracy)](#/glossary/macro-recall-balanced-accuracy) · [Youden's index](#/glossary/youdens-index) · [mutation testing](#/glossary/mutation-testing) · [reinforcement learning](#/glossary/reinforcement-learning)

**The paper's own terms:**
- **data-oriented recursive self-improvement (RSI)**: agents construct training data for their own later learning, and can generate tasks together with verification functions that provide reinforcement-learning rewards (§1).
- **harness**: "the agent framework that manages model calls, tool use, and the generation loop" (§2.1). Pi, cited as a coding agent (Zechner, 2025), is the common one; a **native harness** is "the vendor's own agent tool" (Claude Code, Codex, Gemini CLI); OpenClaw and mini-swe are third-party (§3.1).
- **self-test**: a candidate solution the agent writes during generation to check its draft verifier; "self-tests are the agent's only evidence about how its verifier behaves" (§2.1).
- **construction label, reference label**: a test case's PASS or FAIL label, set before any verifier runs (§2.2); after screening it equals the decision of the retained source verifier (the **reference verifier**) and is called the reference label (§2.3).
- **test-case groups**: the **reference solution** (`gold`); **valid variants**, which change presentation, implementation or execution path while meeting every requirement; **ordinary errors** (initial, partial, near-miss, regressing solutions); and **attacks**, "which exploit checking omissions, fabricate success signals, or interfere with verification" (§2.2, Tab. 1; nine categories in App. C, Tab. 10).
- **TPR, TNR, BA_norm, FPR_h**: per task, the share of positive cases receiving PASS (TPR) and of negative cases receiving FAIL (TNR), averaged over tasks, with no credit for missing or invalid outputs; BA_norm (normalized task-averaged balanced accuracy) is TPR + TNR − 100 (§2.4, Eq. 1), 0 for constant valid decisions and 100 for perfect agreement; FPR_h is the task-averaged share of attack cases receiving PASS (§2.4). In the glossary's terms, BA_norm is Youden's index in percentage points (our reading).
- **all-reject verifier**: one that returns a valid FAIL on every test case of its task, so it contributes zero to BA_norm (§3.4).
- **unjustified check**: "a condition that the instruction, tool definitions, and environment rules do not require, and that rejects solutions they permit" (§4.1).
- **confirmatory self-testing**: "the tests confirm that the verifier accepts a chosen solution but never ask whether its other conditions follow from the task" (§4.2).
- **archived records, Astra trace batch**: an earlier per-task export for nine Pi-harness models; and a separate generation of GPT-6-astra verifiers (Pi or Claude Code, LOW or HIGH reasoning effort) that keeps traces. Reported scores come from the **main release** of final judgments (§3.1).

**Builds on:**
- Verifier generation, cited to Zhang et al. (2025) (generative verifiers, [Generative Verifiers (GenRM)](#/papers/zhang2024genrm "Generative Verifiers: Reward Modeling as Next-Token Prediction (2025)")) and Dinella et al. (2022) (TOGA, test-assertion generation) (§1).
- Evaluations of generated unit tests, issue-reproducing tests and executable specifications (TestGenEval, SWT-Bench, nl2postcond, CodeSpecBench), which it extends "to agent task completion" (§1; §6).
- Training-data construction with generated verification: Self-Challenging Language Model Agents (Zhou et al., 2026) and Absolute Zero (Zhao et al., 2026; [Absolute Zero](#/papers/zhao2025absolutezero "Absolute Zero: Reinforced Self-play Reasoning with Zero Data (2025)")) (§6).

## Problem and setting

- **Question:** can an agent, from what a solver gets, write a verifier that accepts all valid solutions and rejects invalid ones? A verifier "must therefore distinguish task requirements from choices that can vary across valid solutions" (§1).
- **Tasks (§2.2, Tab. 1):** 222 from open-source agent benchmarks, each with an instruction, an environment and a source verifier: 95 tool-call tasks from BFCL v4 and ACEBench (function-calling benchmarks); 80 state tasks from τ²-bench, AppWorld and AgentDojo (agents acting in simulated apps and services), checked on interactions or the resulting state; 47 code tasks from SWE-bench Verified (GitHub issues fixed by patches). Terminal-Bench (command-line tasks) lost all its tasks in screening (App. B).
- **Test suites:** 4,993 hidden cases, 1,566 positive and 3,427 negative (Tab. 1), with an attack case in every task (App. D).
- **What "correct" means:** agreement with the reference label on these finite suites (§2.3; § Limitations).
- **Budgets:** 5,400 seconds per task and 32,768 output tokens per reply (§3.1). Generation and evaluation executions are budgeted separately (§2.1); the Astra trace batch allows 20 executions in the environment (through `run_public`) per task during generation (§3.3; App. E).
- **Models:** 19 LLMs (Tab. 2), sizes not discussed. Harnesses differ in prompts, tools and reasoning settings (§3.1).

## Approach

- **Screening with Verifier4Verifier (V4V) (§2.3; App. B):** six checks on source verifiers and cases: replay against the construction labels, repeatability (the same decision on a rerun), provenance (each decision traced to its case and verifier version), input-label consistency (identical inputs within a task never carry opposite labels), trivial baselines (always-accept, always-reject and accept-only-the-reference verifiers must be exposed), and mutation testing (modify one check in the source verifier; some case must then get a different valid decision; App. B.3, Tab. 9). Disagreements are resolved "against the task requirements". Confirmed source defects excluded 45 of 267 initial tasks: all 37 Terminal-Bench tasks, 35 because its parser counts skipped tests as passes; five BFCL tasks whose answer keys conflict with default-argument rules; three SWE-bench tasks with parsing and empty-report errors (§2.3; App. B.1, Tab. 7).
- **Experiments:** 19 models in Pi, 17 other configurations (§3.1; App. E), and the Astra trace batch for reasoning effort (§3.3).
- **Code and trace reading:** a selected Astra verifier's rejection is blamed on a check only when the public requirements permit the rejected property (§4).

## Results

- **Ranking (§3.2, Tab. 2, Fig. 3):** with Pi, BA_norm runs from 10.6 (Doubao Seed 2.0 Mini) to 62.1 (GPT-6-astra), "and no model approaches perfect agreement".
- **Acceptance is the weak side:** "Every model has lower TPR than TNR": TPR 21.1% to 70.2%, TNR 79.2% to 96.3% (§3.2, Tab. 2). Unaccepted positives are mostly explicit FAILs (§3.2; App. G, Tab. 21). The gap is widest on state and code tasks; on tool-call tasks some models reverse it, and rankings change with task type (App. F, Tab. 16–18).
- **Attacks:** FPR_h ranges from 0.8% (GPT-5.6-sol) to 13.6% (Qwen3.7 Plus) (Tab. 2). "Low attack acceptance does not by itself indicate a reliable verifier": on code tasks most models have an FPR_h of 0.0% "at the reported precision" across the whole range of BA_norm (§3.2; App. F, Tab. 18).
- **Harnesses against Pi (§3.3, Tab. 3):** Claude Code raises Claude Opus 4.8 by 12.2 points to 66.2, "the best of all 36 configurations", and Codex lowers all four GPT models by 4.1–26.6 points; "no harness improves every model it runs" (§3.3; App. E, Tab. 11–12).
- **Reasoning effort** "barely changes aggregate scores in the Astra trace batch"; HIGH helps code tasks and hurts state tasks under both harnesses (§3.3; App. E, Tab. 13–14), and most HIGH-effort state and code runs exhaust the generation execution budget (§4.3; Tab. 15).
- **Concentration (§3.4):** in the archived records, all-reject verifiers contribute 87.9–96.0% of each model's false rejections, whether cases or tasks are weighted equally (App. H, Fig. 5); the Astra trace batch shows the same pattern (Tab. 22).
- **Mechanisms (§4, Tab. 4; App. I):** the unjustified checks include rejecting any patch to a file named `__init__.py` (Fig. 6), accepting only some representations of a value, rejecting authorized user-side tool calls, a tool allowlist (list of permitted operations) missing a permitted read-only query (Fig. 2), and a category keyword list missing an item (Fig. 8). For some, the self-tests used only solutions the check already allows (§4.2); for the rest, no positive self-test returned a complete PASS (§4.3). The review "is targeted and does not estimate prevalence" (Tab. 4).

## Limits the authors state

- "Scores measure agreement with retained reference verifiers on finite, constructed test suites", and agreement between construction labels and reference decisions "does not certify that every label is semantically correct" (§ Limitations).
- Cross-harness differences "describe configurations and do not isolate any harness component; rankings are point estimates without repeated generations or significance tests" (§ Limitations).
- The concentration analysis uses archived per-task records for nine models and the Astra trace batch for one, not final per-task records for all 19 (§ Limitations); Gemini 3.5 Flash is excluded because its archived judgments differ from the final aggregates (App. H). An all-reject pattern on the suite "does not establish that the verifier returns a constant decision on all possible inputs" (App. H).
- The code and trace analysis covers selected verifiers, "mostly from GPT-6-astra", attributes rejections by inspecting source code rather than by intervention experiments, and does not reconstruct the verifier version at each self-test, so "it therefore identifies mechanisms but not their prevalence" (§ Limitations).
- Task-type comparisons "do not isolate the effect of task type alone" (App. F); the four Astra conditions "do not estimate variation across independent generation seeds" (App. H).

## Open problems and building blocks

- **Open:** the authors propose that self-testing also check that a verifier "does not reject other solutions the task allows", by tracing each acceptance condition to the instruction, tool definitions or environment rules and testing it with a case that varies a permitted property and one that violates a required condition, and that generation reserve execution budget for testing the final verifier and tell an execution failure from a failed requirement. "We do not evaluate the effectiveness of these directions" (§5; §7).
- **Released:** the project page and dataset "are publicly available" (abstract). Its own scripts and annotations are under Apache 2.0; protected AppWorld task and solution text is omitted, with metadata and scripts to rebuild it from official data (App. B "Licensing and redistribution").
- **To reuse it:** environments with public code execution for state and code tasks (§2.1); the recorded harness versions (App. E "Harness and reasoning settings").

## On this site

- **Discussed in:** [Benchmarks with checkable ground truth](#/challenges/checkable_benchmark_ground_truth) · [A gym of DSL tasks with answer keys made by code](#/challenges/dsl_gym)
- **Tags:** <span class="tags"><a class="tag" href="#/tags/benchmark">benchmark</a><a class="tag" href="#/tags/code">code</a><a class="tag" href="#/tags/hacking">hacking</a><a class="tag" href="#/tags/harness">harness</a><a class="tag" href="#/tags/labels">labels</a><a class="tag" href="#/tags/llm">llm</a><a class="tag" href="#/tags/scaling">scaling</a></span>
