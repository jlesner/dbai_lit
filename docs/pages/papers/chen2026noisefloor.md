# Noise Floor Audit for Agent Benchmarks

**Noise Floor Audit for Agent Benchmarks** · preprint 2026

Read: [PDF](https://arxiv.org/pdf/2608.22331) · [arXiv](https://arxiv.org/abs/2608.22331)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Measures how much the score of a tool-calling endpoint moves between identical reruns at temperature 0 and under semantics-preserving surface changes to the user message (collapsed whitespace, or an added prefix, wrapper or suffix), on a frozen set of 150 matched instances from BFCL's AST-graded `multiple` and `parallel` categories (abstract; §3; Tab. 1).
- Three endpoints from two providers (Groq's Llama-3.1-8B and Llama-3.3-70B, and Gemini 3.5 Flash with thinking set to low), 10 reruns in the main arm and 5 reruns of each of 4 prompt variants; it reports marginal and paired-difference SDs on matched instances, a bootstrap curve over the instance count, a check of system fingerprints, and a failure taxonomy (wrong function, wrong arguments, malformed output) (§3; §4; Tabs. 2–4; App. A).
- Despite the title, the scope is single-turn function calling with AST matching, not multi-turn agents (§6).

## In plain words

Function-calling benchmarks score whether a model answers a request with the right structured call to a tool; their headline scores "often appear as single numbers" (§1). The authors ask how much such a score moves when nothing that matters changes: when the same requests are rerun at temperature zero, and when the user's message gets meaning-preserving surface changes. Their stated goal is "to make uncertainty visible at the level at which benchmark claims are usually made" (§1). They ran three hosted models from two providers on 150 fixed tasks from the Berkeley Function Calling Leaderboard (§3), and report that reruns are nearly deterministic: 0.7%, 2.0% and 2.7% of tasks ever change outcome across ten reruns. The median spread of task-by-task score differences under four such changes is 11 to 58 times the spread under reruns (abstract; §4). Unparseable, missing or cut-off calls make up 30%, 7% and under 1% of the three models' failures, which a single accuracy number hides (abstract; Tab. 4). They present the work as "a noise floor audit rather than a new benchmark" (§1).

## Background and terms

**Terms to know:** [abstract syntax tree (AST)](#/glossary/abstract-syntax-tree-ast) · [greedy decoding and temperature sampling](#/glossary/greedy-decoding-and-temperature-sampling) · [bootstrap resampling](#/glossary/bootstrap-resampling) · [pass^k (reliability over k trials)](#/glossary/passk-reliability-over-k-trials)

**The paper's own terms:**
- **endpoint**: a hosted model behind a provider's API; its identifiers are "time-bound API products rather than immutable model artifacts" (§6 "Scope limits").
- **rerun floor** and **perturbation floor**: score movement under identical reruns and under prompt surface changes, with suite, grader and instances fixed (§2 "Reproducibility"; §4).
- **AST exactness**: the score; "the predicted function-name multiset must match, and each expected argument must match one of the allowed ground-truth values" (§3 "Interface and scoring"). Parse failures, malformed payloads, version-drift aborts and truncations count as incorrect unless an unrecoverable instance is excluded (same place).
- **marginal SD**: the standard deviation of the aggregate score across runs (§3 "Reported uncertainty").
- **paired-difference SD (paired SD)**: the authors first compute "matched score differences on the same instances" and then report "the standard deviation of those paired differences" (§3 "Reported uncertainty"). They call it "the right target for any reported leaderboard gap" (§3 "Design isolation"). pp: percentage points.
- **ever-flip fraction**: the share of the 150 instances that are neither correct in every rerun nor wrong in every rerun (Tab. 2, columns "Always C", "Always W", "Flip inst.").
- **semantics-preserving prompt perturbation**: one of four surface changes to the user message only, with tool schema, target functions and reference call held fixed: collapsing whitespace, prefixing an instruction to use the tools, wrapping the request in neutral labels, and appending an instruction to answer through the function-calling interface (§3; Tab. 1).
- **system fingerprint**: a provider-reported identifier (Groq's `system_fingerprint`), recorded as a covariate and used as a proxy for backend routing (§3 "Endpoints"; §4 "Endpoint fingerprint variance").
- **failure taxonomy**: `wrong_function` (the called function names, counted with repeats, differ from the expected ones), `wrong_arguments` (names right, required arguments missing, mistyped or outside the accepted values), `malformed_output` (output or tool-call payload "structurally unparseable, missing, truncated, or degenerate before ordinary argument grading"), and `other`, "chiefly wrong call counts" (§4 "Failure character shifts across endpoints").

**Missing glossary terms:**
- **native function calling (tool calling)**: an API mode in which the model returns a structured call to one of the functions declared in a supplied schema instead of free text; "an endpoint emits a structured call, the harness parses provider-specific tool payloads, a grader maps that call to a task outcome" (§1; §3 "Interface and scoring").

**Builds on:**
- Miller (2024) on error bars for language-model evaluations, "including paired comparisons and evaluation planning"; the audit "adds a narrower empirical target" (§2 "Evaluation variance and error bars"). Not on this site.
- Biderman et al. (2024) on sources of irreproducibility in language-model evaluation; the audit "adopts that reproducibility framing" (§2 "Reproducibility"). Not on this site.
- Prompt-sensitivity work, among it Sclar et al. (2024) and Mizrahi et al. (2024): formatting changes and paraphrased templates can change scores and rankings (§2 "Prompt sensitivity and surface-form robustness"). Not on this site.
- τ-bench (Yao et al., 2024; [τ-bench](#/papers/yao2024taubench "$\tau$-bench: A Benchmark for Tool-Agent-User Interaction in Real-World Domains (2025)")), a benchmark of tool-using agents that reports pass^k-style consistency over repeated trials; the audit "instead estimates score-scale movement under frozen reruns and matched prompt perturbations" (§2 "Agent benchmarking and per-run consistency").

## Problem and setting

- **Question:** how large rerun noise is, whether larger variance lies in prompt perturbations, and whether one marginal score can hide different failure modes (§1).
- **Benchmark:** the official Berkeley Function Calling Leaderboard (BFCL) distribution, built on "the tool-use evaluation setting introduced by Gorilla" (§2), restricted to its AST-graded `multiple` and `parallel` categories (§3 "Suite and study set"). The paper does not define the two categories.
- **Study set:** 150 matched instances, the sorted id list "hash-frozen before any reported run"; an unrecoverable unit would drop the whole instance from all runs, and none was dropped (§3 "Suite and study set").
- **Endpoints:** `llama-3.1-8b-instant` and `llama-3.3-70b-versatile` on Groq (an API provider; the paper doesn't describe it), and `gemini-3.5-flash` with thinking pinned to low, averaging 189 thinking tokens per retained main-arm call (§3 "Endpoints"). A version-drift guard aborts an experiment if the served model identity changes (same place).
- **Arms:** the main arm runs 10 reruns at temperature 0 on all 150 instances; the perturbation arm runs 5 reruns of each of 4 prompt variants (§3 "Arms"). A temperature-0.7 arm "exists outside the completed results reported here" (§6 "Scope limits").

## Approach

- **Freeze the instances.** This leaves "rerun or prompt-perturbation movement on fixed cases" (§3 "Design isolation").
- **Report both marginal and paired SDs.** Paired-to-√2-marginal ratios are "close to unity, indicating that reruns are nearly independent at each endpoint" (§3 "Reported uncertainty").
- **Compare all variant pairs** on matched instances (Tab. 3), then the median with the rerun paired SD (Fig. 1).
- **Diagnostics:** a bootstrap curve of rerun paired SD over 25 to 150 instances (Tab. A.1), fingerprint SDs (Tab. A.2), and the failure taxonomy (Tab. 4).

## Results

On the frozen BFCL subset and these three endpoints; the reported arms "primarily use temperature 0" (§6). Order: 8B, 70B, Gemini.
- **Reruns are nearly deterministic** (§4 "Rerun near-determinism"; Tab. 2): ever-flip fractions 0.7%, 2.0% and 2.7%; rerun paired SDs 0.28, 0.91 and 1.1 pp.
- **Perturbation is the larger floor, the authors report** (§4 "Perturbation is the larger floor"; Tab. 3; Fig. 1): accuracy per variant stays nearly constant (71–73%, 82%, 80–82%), while median perturbation paired SDs are 16, 10 and 19 pp, about 58x, 11x and 16x the rerun paired SD. The authors read this as perturbations that "mostly reshuffle which matched instances pass".
- **Capability does not predict stability here** (§4 "Capability does not predict…"): the 70B endpoint is noisier than the 8B under reruns but less noisy under perturbations, so "the two stability metrics rank the Groq pair in opposite orders"; within these endpoints and this suite, capability "does not consistently predict either rerun stability or perturbation stability".
- **Failure character** (§4 "Failure character shifts…"; Tab. 4): malformed-output failures are 30%, 7% and under 1% of task failures; the 70B and Gemini endpoints "fail mostly with well-formed but wrong arguments or wrong call counts."
- **Sample size** (§4 "Bootstrap sample-size curve"; Tab. A.1): the bootstrap intervals "widen substantially at the low-instance end", so a small pilot "should not be treated as a precise endpoint-ranking instrument until the matched sample is large enough for the bootstrap intervals to settle."
- **Fingerprints** (§4 "Endpoint fingerprint variance"; Tab. A.2): within- and across-fingerprint paired SDs "remain on the same order"; backend routing, "as proxied by the recorded system fingerprint, is not the dominant explanation for the observed rerun floor in this harness."
- **Recommendations** (§5): for these endpoints, extra frozen reruns "buy little precision relative to their cost"; evaluation compute "is better spent on matched prompt perturbations, grader audits, or broader instance coverage"; leaderboard gaps "should report prompt sensitivity alongside any rerun error bar"; for maintainers this "suggests a reporting contract": publish "the frozen instance list, the prompt-template family, paired perturbation SDs, and a small failure-character table with each headline score."

## Limits the authors state

- "a scope audit for a specific harness snapshot, not a stable public leaderboard"; one suite, with "no executable BFCL categories, irrelevance categories, retrieval tasks, or multi-turn agent trajectories", so results "should therefore not be generalized" to agents whose errors come from environment state, tool side effects, retrieval or long-horizon planning (§6 "Scope limits").
- Three endpoints are "still too small to estimate provider-level variance"; the drift guard "cannot make future provider deployments reproduce the same floor" (§6).
- The paper "should not be read as a temperature-sensitivity study" (§6).
- The design "cannot separate provider effects from the thinking-enabled setting" for Gemini (§6).
- The AST graders "do not execute calls and can miss semantically correct calls outside the accepted normalization rules or over-credit calls that match the expected structure for superficial reasons"; the taxonomy inherits that boundary and "is also interface-specific" (§6).
- The four variants "do not span every reasonable prompt rewrite"; read them as "a lower-level robustness audit over a declared prompt family, not as an estimate over the population of all possible prompts" (§6).
- Estimates are "conditional on the frozen study set" and not estimates over every BFCL item, release or deployment prompt distribution; the bootstrap curve "is a planning diagnostic for matched-set size" (§6 "Statistical and causal limits").
- The analysis is "descriptive rather than causal", and treating the hosted endpoint as the measurement object leaves out questions that need model weights, decoder internals, log probabilities, controlled seeds or serving-stack ablations (§6).

## Open problems and building blocks

- **Open:** why the 70B and 8B endpoints swap order between rerun and perturbation stability: "This audit does not explain the reversal" (§5 "Open question").
- **Released:** Nothing stated; raw per-call outputs "are retained for auditability" (§3 "Data flow").
- **To reuse it:** endpoints with a native tool-calling interface, the official BFCL distribution and its ground truth (§3); the audit works at the hosted-API level, which the authors call "appropriate for leaderboard users who call hosted APIs" (§6).

## On this site

- **Tags:** <span class="tags"><a class="tag" href="#/tags/stats">stats</a><a class="tag sub" href="#/tags/general-misc">general-misc</a><a class="tag sub" href="#/tags/llm-misc">llm-misc</a></span>
