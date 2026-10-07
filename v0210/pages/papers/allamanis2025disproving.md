# Disproving Program Equivalence with LLMs

**Disproving Program Equivalence with LLMs** · preprint 2025

Read: [PDF](https://arxiv.org/pdf/2502.18473) · [arXiv](https://arxiv.org/abs/2502.18473)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- A white-box search for counterexamples to the equivalence of two or more executable programs, by an LLM with execution feedback (abstract).
- Uses the differences found to cluster samples semantically for self-consistency (abstract).

## In plain words

Benchmarks for LLM-written code judge a sample by its unit tests, and the authors argue these tests "are often inadequate, missing corner cases and other implementation-specific oddities" (abstract). They build ProbeGen: an LLM reads the source of two or more programs meant to do the same job, writes inputs, sees what each program returns, and tries again until the outputs differ; one differing output disproves equivalence (§1). A second LLM prompt discards differences the task description leaves open. On about 10,000 deliberately diverse samples for a Python benchmark, with that filter on, they report that 24% of the samples passing the unit tests differ from the reference solution, an estimated 18.7% after correcting for the filter's errors as judged by two authors (§1, §4). Grouping samples by behaviour and choosing from the largest group raises the unit-test pass rate of the chosen sample from 40.6% to 44.6%, with Gemini Flash 2.0 and the filter on (§5.1). They present the work as introducing this task "as a machine learning task that requires deep program understanding" (§1).

## Background and terms

**Terms to know:** [differential testing](#/glossary/differential-testing) · [decidable and undecidable](#/glossary/decidable-and-undecidable) · [LLM-as-a-judge](#/glossary/llm-as-a-judge) · [pass@k](#/glossary/passk) · [self-consistency](#/glossary/self-consistency-majority-voting) · [Cohen's kappa](#/glossary/cohens-kappa) · [property-based testing](#/glossary/property-based-testing) (PBT, a baseline, §4.2 "Baselines")

**The paper's own terms:**
- **probe**: a function that calls an implementation on inputs and returns a value comparable in bounded time; unlike a unit test it asserts nothing about the expected output, and "unit tests are a special limited case of probes" (§2, Fig. 2). ProbeGen works **white-box** (reading the source); unit tests and property-based testing are black-box (§1, §4.2 "Baselines").
- **counterexample**: a probe on which two implementations return different values, showing they are not functionally equivalent. This assumes no randomness, side effects the probe can capture, only functional behaviour (not, e.g., memory usage), and no inspection of internals such as reflection (§2).
- **spurious counterexample**: in this paper, one exposing "a difference due to inherent ambiguities in natural language or the expected behavior is left unspecified" (§3.1): inputs that break a precondition the task only implies (a negative number of students), or outputs that differ in a way the task doesn't care about (the order of a list of indices) (§3.1, §4.3).
- **K, D, search strategies** (§4.1, Fig. 3): ProbeGen as a tree: K samples per context, D feedback turns. **Full** keeps branching K at every level; **Top** samples K independent multi-turn runs; **Decreasing** branches K, then K−1, and so on (at least 1); **Increasing** grows it instead; **Halving/Doubling** halve or double it each turn.
- **probability of success σ**: pass@k extended to search trees: the chance a strategy finds a disproving probe "assuming that one exists" (§4.1).
- **semantic clustering**: grouping implementations so that any two a non-spurious counterexample separates land in different groups (§5); **semantic self-consistency (SSC)** picks the largest group (§3.2, §5.1).

**Builds on:**
- Differential testing (McKeeman 1998) and the "equivalence modulo inputs" paradigm of Le et al. (2014), testing compilers with program variants meant to agree on given inputs: probe generation "can be thought as a form of differential testing" using that paradigm (§2); neither on this site.
- The pass@k estimator of Chen et al. (2021), which σ generalizes (§4.1); not listed here.
- Self-consistency ([Self-Consistency](#/papers/wang2022selfconsistency "Self-Consistency Improves Chain of Thought Reasoning in Language Models (2023)")) and universal self-consistency (Chen et al. 2023, not listed here; an LLM picks the most consistent of free-form answers); SSC is "a form of self-consistency" for code (§5.1).
- Its baselines: the benchmark's unit tests, and PBT (Fink and Bishop 1997, not listed here) run with Hypothesis, a Python PBT package (§4.2 "Baselines").

## Problem and setting

- **The question:** can an LLM reading code and execution results find inputs on which programs differ, how should it trade samples against turns, and does it catch samples unit tests wrongly pass (§1, §4)?
- **Programs:** Python; this implementation is "limited to testing function interfaces", compares two implementations at a time, and has the LLM write a Python generator of argument sets; the `typeguard` package (a run-time type checker) rejects inputs that don't match the type annotations, if any (§4 "Experimental Setup").
- **What "different" means:** floats equal if close by `math.isclose` defaults, NaNs equal, NumPy and Pandas compared by their own methods, only the first 1k elements of an iterable checked, and "all exceptions equivalent independent of their type or error message" (§4 "Experimental Setup").
- **Data:** LBPP (Matton et al. 2024), a set of Python programming tasks, "a code synthesis benchmark that is relatively new and unleaked" (unleaked: not in models' training data), gives each task unit tests and a ground-truth solution. About 10k samples come from a variety of models; the goal "is not to maximize correctness" but diversity (§4 "Evaluation Data"; prompt in App. A).
- **Model:** Gemini Flash 2.0 (a Google LLM) for the filter, with greedy decoding (§4 "Experimental Setup"), the strategy study (§4.1) and clustering (§5.1).

## Approach

- **The loop (§3, Eq. 1):** each turn, the LLM sees the implementations plus all earlier probes and their outputs, and samples the next probe. The authors call this "guided differential testing" (§3; execution feedback after [Self-Debugging](#/papers/chen2023selfdebug "Teaching Large Language Models to Self-Debug (2023)")).
- **Strategy study (§4.1, Fig. 4):** full trees with K = 5, D = 5 for 600 samples (half passing the unit tests), from which σ is computed per strategy and setting; cost is the number of LLM calls, "a reasonable proxy to the actual inference cost". The main evaluation then uses Decreasing with K = 3, D = 4: at most 21 calls per sample (§4.2).
- **The filter (§3.1, App. C):** an LLM sees the task text, the inputs and the two outputs, and answers IMPORTANT or IRRELEVANT; per the prompt, differences "may be irrelevant" for inputs violating implicit preconditions, error handling under them, or insignificant output differences.
- **Clustering (§5, Fig. 5):** start with one cluster; repeatedly run ProbeGen on an unpicked random pair from the largest cluster, run the probe on every sample, and split clusters a non-spurious counterexample separates; N_P = 10 probes (§5.1). SSC's pass@1 is the unit-test pass rate in the largest cluster, averaged over ties (§5.1).
- No theorems; finding a counterexample is undecidable in general but "often feasible" in practice (§1).

## Results

- **Strategies (§4.1, Fig. 4c), Gemini Flash 2.0 only**: "Deeper search (multiple turns) are favored compared to more samples, but some sampling also provides useful diversity". Decreasing reaches 90% success with "about 4x less cost" than Full. Increasing is "also competitive for a mild number of LLM turns"; Top "performs about as well as Full".
- **Against unit tests (§4.2, Tab. 1, on samples both methods can run):** ProbeGen finds 24.3% of the samples that pass the unit tests to differ significantly from the ground truth; applying the filter's precision from their human evaluation, the authors estimate 18.7% (§4.2 "Human Evaluation").
- **Failures (§4.2):** ProbeGen cannot run 11% of the samples (decorators, inputs failing the type check, targets that aren't plain functions). Of the samples where it found no counterexample within budget, the unit tests disproved 12.5%.
- **PBT (§4.2):** it runs on the fewest samples, and the authors say PBT and Hypothesis "suffer from many spurious counterexamples" for lack of strong preconditions.
- **Human evaluation (§4.2):** two authors judged 2 samples per task (if more than 2 exist) that pass the unit tests but where ProbeGen found a counterexample, seeing what the filter sees; their agreement on the doubly annotated subset is "substantial" by Cohen's kappa "but not perfect". The filter "seems to have some common failure cases": hard-to-check preconditions, some string manipulation, tasks ambiguous about preconditions.
- **Qualitative (§4.3):** for most samples failing the unit tests where ProbeGen finds a counterexample, it finds it early. A large set of spurious ones break implicit preconditions and usually come after deep search; another comes from ill-defined output types or default equality that doesn't match the task's.
- **SSC (§5.1, Tab. 2):** pass@1 40.6 → 44.6 with ProbeGen; PBT and ProbeGen without the filter stay at 40.6. The authors call the gain "non-trivial" but "relatively small", and suggest LLM errors are spread evenly rather than around one correct cluster.

## Limits the authors state

- §3 "Limitations": "Code must be executable and deterministic on the explicit inputs provided"; "The value equality operator must be provided and probes must return readily comparable values"; LLM queries are "much more costly" than unit tests, so "this approach makes sense only when unit tests — if they exist — have already failed to disprove equivalence"; "Side-effects may go unnoticed, unless there are rigorous checks and sandboxing."
- It cannot prove equivalence (§1), and with a limited budget it can fail to disprove (§4.2).
- "a ground truth implementation needs to be present" (§6).
- The LLM filter works "at the risk of introducing false negatives"; what is spurious "generally depends on the target use case" (§3.1).
- "the above results may vary for different models" (§4.1); other tasks or domains may need a different equality (§4).
- An LLM's failed attempt to disable `typeguard` "shows the importance of setting up guardrails and sandboxing" (§4.3).

## Open problems and building blocks

- **Open:** "Future work may also investigate more complex, learned search strategies" (§4.1). Formal preconditions generated from the task text (Endres et al. 2023) "could complement our filtering", left out "given its complexity" (§3.1). Probe generation as a standalone task: "future work may opt to study it in isolation" (§7).
- **Released:** nothing stated; the prompts are printed (App. A, App. C).
- **To reuse it:** an LLM taking execution feedback (Gemini Flash 2.0 here), a sandbox, a reference implementation, deterministic code with comparable outputs, an equality operator; up to 21 LLM calls per sample (§3, §4, §4.2).
- **Beyond its domain:** ProbeGen "may find multiple applications": explaining code edits, exposing differences introduced in refactoring, explaining mistakes in student code, and showing users how alternative implementations differ (§3.2).

## On this site

- **Discussed in:** [Benchmarks with checkable ground truth](#/challenges/checkable_benchmark_ground_truth) · [Equivalence of nondeterministic queries](#/challenges/nondeterministic_equivalence) · [SQL features that verifiers don't cover](#/challenges/verifier_coverage_gaps)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/cex-general">cex-general</a><a class="tag sub" href="#/tags/cex-llm">cex-llm</a><a class="tag sub" href="#/tags/harness-general">harness-general</a><a class="tag sub" href="#/tags/llm-assist">llm-assist</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/scaling-general">scaling-general</a></span>
