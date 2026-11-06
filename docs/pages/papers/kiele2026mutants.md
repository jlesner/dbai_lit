# Beyond Rule-Based Mutation Testing: Test-Aware Mutant Generation Using Large Language Models

**Beyond Rule-Based Mutation Testing** · ESEM 2026 (LIPIcs, per the PDF's title page)

Read: [PDF](https://arxiv.org/pdf/2609.35841) · [arXiv](https://arxiv.org/abs/2609.35841) · [DOI](https://doi.org/10.4230/LIPIcs.ESEM.2026.49)  
Code: [test-aware-mutants](https://github.com/codingWhale13/test-aware-mutants)

<p class="notice">A summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Mutation testing with an LLM that sees the tests: given the problem statement, the reference solution and its few base tests in one prompt, the model must write a mutant (a wrong version of the program) that passes the base tests; the larger EvalPlus test suites then decide whether it is a real fault (abstract; §3).
- Two prompt families, each in a test-aware variant (the base tests in the prompt, with instructions to pass them) and a test-blind one without them, run single-shot at temperature 0 on HumanEval and MBPP with five LLMs, against the rule-based tool mutmut; an ablation retries with execution feedback (§3, PDF pp. 6–8; §4.4).
- A generator of wrong programs aimed at a shown, weak check, scored against a stronger hidden one (<a class="tag" href="#/tags/hacking">hacking</a>, <a class="tag" href="#/tags/labels">labels</a>): the authors report that 144 of 164 HumanEval mutants from Gemini 3.1 Pro with the test-aware AGENT1 prompt pass the base tests and fail the extended ones, against far fewer test-blind (§4, Tab. 4); a single-author review of mutants that pass both suites classes most as genuine faults the extended tests miss (§4.2, Tab. 5).

## In plain words

Mutation testing judges a test suite by planting small bugs (mutants) in a program and checking whether the tests notice. The authors say rule-based tools "often generate large numbers of trivial, redundant, or equivalent mutants", and that most LLM-based generators "remain test-blind", seeing only the code (abstract). They propose test-aware generation: in one prompt, an LLM gets the problem statement, the reference solution and its few existing tests, and must write a nontrivial mutant that still passes those tests (abstract; §1). Many more hidden tests, from EvalPlus (an extension of the Python benchmarks HumanEval and MBPP), then decide whether the mutant is a real fault. With the LLM Gemini 3.1 Pro and their main prompt, 87.8% of HumanEval mutants pass the shown tests and fail the hidden ones, against 12.2% when the prompt leaves the tests out and 4.4% for the rule-based tool mutmut (§4.1; Tab. 4); on MBPP, 79.1%, 23.0% and 5.7% (abstract). They present it as an empirical study: "To the best of our knowledge, no prior work empirically studies the direct impact of test-awareness on LLM-based mutant generation" (§2).

## Background and terms

**Terms to know:** [mutation testing](#/glossary/mutation-testing) · [test oracle](#/glossary/test-oracle) · [program equivalence](#/glossary/program-equivalence) · [greedy decoding and temperature sampling](#/glossary/greedy-decoding-and-temperature-sampling) · [retrieval-augmented generation (RAG)](#/glossary/retrieval-augmented-generation-rag)

**The paper's own terms:**
- **base tests**: the few tests shipped with each problem (7.7 per HumanEval problem on average, 3 per MBPP problem), treated as "high-quality but incomplete developer-written tests that a good mutant must evade" (§1; §3 "Benchmarks and Oracle Design").
- **oracle** (also "extended tests"): EvalPlus's larger suites, with 80× and 35× more tests than HumanEval and MBPP (§1), never shown to the model (§3).
- **verified fault**: a mutant that passes all base tests and fails at least one oracle test (§1; §3).
- **outcome classes** (Tab. 1): Invalid (does not compile, or times out on the base tests), Rejected (runs, but a base test kills it), Success (evades the base tests, caught by the oracle), Undetected (survives both).
- **test-aware (TA) and test-blind (TB)**: two variants of each prompt that "differ only in whether the base tests are included in the context" (§3 "Model Prompts").
- **AGENT1, AGENT2** (AGENT stands for Adversarial Generation of Evasive Non-equivalent Transformations): the two prompt families, with free-form reasoning and a fixed reasoning template (Tab. 2; §3).
- **success rate**: the share of generated mutants classed Success (§3 "Evaluation Metrics" (a)).
- **oracle kill rate**: for a Success mutant, the share of oracle tests that fail on it; lower means "a narrower fault", a subtler one (§3 (b)).
- **amortized cost per verified fault**: all tokens (input, thinking and output) divided by the number of Success mutants (§3 (c)).
- **classes of Undetected mutants** (§4.2; Tab. 5): equivalent mutants, "programs that behave exactly as the original program on all possible inputs", are identical or cosmetic changes, semantic refactorings (same outputs, different procedure), out-of-specification faults (wrong only on inputs the task rules out) or dead code; non-equivalent ones are true oracle gaps (real bugs the oracle misses) or ambiguous faults (bugs that show only under an underspecified task).

**Builds on:**
- EvalPlus (ref. [14], Liu et al.; [EvalPlus](#/papers/liu2023evalplus "Is Your Code Generated by ChatGPT Really Correct? Rigorous Evaluation of Large Language Models for Code Generation (2023)")): its extended suites, built for benchmarking code generation, are the oracle (§3 "Benchmarks and Oracle Design").
- LLMut (ref. [29], Wang et al.) (LLM mutant generation with varying prompt context), "closest to our work": its prompt with unit tests did slightly worse than without; the authors hypothesize it "only appends the tests as passive context" (§2).
- LLMorpheus and BugFarm (refs. [27], [9]), test-blind LLM mutant generators, and iterative approaches with execution feedback such as AdverTest and MutGen, whose cost the single prompt is meant to avoid (§1; §2).
- mutmut, a rule-based Python mutation-testing tool, the baseline (§1; §4, Fig. 2).

## Problem and setting

- **Question:** does putting the existing tests in an LLM's prompt, with no compilation or test feedback, make it better at writing mutants that keep the function signature, pass those tests and fail at least one oracle test (§1; §3)?
- **Data:** 164 HumanEval and 378 MBPP problems, short Python programming tasks, in their EvalPlus versions (§3).
- **Models:** Gemini 3.1 Pro, Gemini 3 Flash, GPT 5.1 Codex Mini, GPT 4.1 Mini and Qwen3-32B, which the authors describe as a mix of open-source, frontier and "more computationally efficient" models (§3 "Models and Baselines").
- **Runs:** temperature 0, one mutant per model, prompt and problem (§3; §4). mutmut generates 2841 mutants for HumanEval and 3427 for MBPP (Tab. 3), and its rates cover all of them.
- **What counts as correct:** the EvalPlus oracle decides; Undetected mutants are not split automatically into equivalent ones and missed faults (§6 (b)).

## Approach

- **Pipeline** (§3; Fig. 1): (1) prompt the model; (2) extract the mutant code from the reply, using the reference solution's imports when the mutant omits them; (3) run the base tests and discard a mutant that errors, times out or fails; (4) run the survivors on the oracle tests.
- **Prompts** (§3 "Model Prompts", full text on PDF pp. 7–8): AGENT1 asks for "a subtle, realistic logic bug" that must show on valid inputs, and for reasoning in three steps: find a blind spot of the base tests, plan a minimal mutation, dry-run it against the base tests. AGENT2 fills a template: what the function does, base-test coverage, two to three blind spots, a mutation plan, a trace of each base test. Only TA variants show the base tests; AGENT2-TB keeps only the summary and plan fields.
- **Iterative ablation** (§4.4): up to 2 retries. An Invalid mutant gets its execution error back with a request for a syntax fix; a Rejected one gets the failing base-test input with the mutant's and the expected output; an Undetected one is told to try a different approach to avoid equivalence. Run only with Gemini 3.1 Pro and Gemini 3 Flash (Tab. 6).
- **Manual review** (§4.2): one author sorts every Undetected mutant of the best setting, Gemini 3.1 Pro with AGENT1-TA, into the six classes above.

## Results

- **Test-aware against test-blind** (§4.1; Fig. 4; Tab. 4): "In every model, the ta prompt variant outperforms tb"; the headline rates above are Gemini 3.1 Pro with AGENT1-TA, "the best-performing setting" (§4.2). Outcomes shift from Rejected to Success: test-blind mutants are mostly caught by the base tests (§4; Fig. 3).
- **Weakest model** (§4.1): GPT 4.1 Mini goes from 5.5% to 31.7% with AGENT1 on HumanEval. Every LLM setting beats mutmut's success rate except Gemini 3.1 Pro and GPT 4.1 Mini with AGENT2-TB on HumanEval (§4.1).
- **Prompts and models** (§4; §4.1): AGENT1 "generally outperforms" AGENT2, but, generally, "the particular prompt has less effect on the mutant status distribution than the model capability"; smaller models produce more Invalid mutants.
- **Subtlety** (§4.2; Fig. 5): the median oracle kill rate of test-aware settings "falls between roughly 10-30%, comparable to those produced by test-blind models", and "it is not clear from our experiments that LLMs produce significantly more or less subtle bugs than mutmut".
- **What the oracle misses** (§4.2; Tab. 5): of the 65 Undetected mutants of Gemini 3.1 Pro with AGENT1-TA (9 HumanEval, 56 MBPP), the review finds 9 equivalent, 49 true oracle gaps and 7 ambiguous faults; the authors conclude EvalPlus "does not provide guaranteed perfect test cases in these instances".
- **Cost** (§4.3; Fig. 6): test-aware prompting uses fewer tokens per verified mutant than test-blind "for all models except GPT 4.1 Mini". In wall-clock time one LLM candidate is "roughly 7–12× slower" than one mutmut mutant, yet per verified mutant GPT 5.1 Codex Mini with AGENT1-TA needs 36.6 s on HumanEval against 54.0 s for mutmut.
- **Iterative prompting** (§4.4; Fig. 7; Tab. 6): with retries, Gemini 3.1 Pro AGENT1-TB rises from 12.2% to 83.5% on HumanEval, "approaching the iterative ta rate of 98.2%", and its test-aware runs there need 1.19–1.24 attempts per problem against 2.27–2.46 test-blind. The authors say the results "suggest that single-shot test-aware prompting captures the majority of the achievable gain".

## Limits the authors state

- The oracle is imperfect: "While these extended test suites are not perfect either, they serve as a useful tool" (§3), and EvalPlus "is a proxy rather than a definitive ground-truth measure of mutant quality in industrial settings" (§6 (b)).
- The Undetected mutants were labelled "by a single author, and therefore inter-rater agreement was not measured" (agreement between independent labellers) (§4.2).
- Real projects have no such oracle: surviving mutants "should be interpreted primarily as concrete suggestions for stronger tests and developer inspection rather than automatically validated defects" (§5 "No Oracle in the Real World").
- The model "can only exploit shortcomings that are actually expressed in the provided tests", and base-test quality was not varied, so the study "does not establish exactly how performance changes as the initial suite becomes stronger or weaker"; the authors call this dependency "an important direction for future work" (§5 "The Dependency on Base Test Quality").
- Evading a handful of base tests "may appear to be a low bar for modern LLMs" (§6 (a)).
- Only self-contained Python benchmarks: industrial code brings larger test suites, stateful functions and multi-file dependencies that "could exceed an LLM's context window and dilute its focus"; scaling to production-level datasets such as Defects4J (a dataset of real Java bugs) "may require iterative prompting" and retrieval-augmented generation to fetch relevant unit tests (§6 (c)).
- Results depend on the model and on provider-side policies (§6 (d)): GPT 4.1 Mini with AGENT2-TA does worse than AGENT1-TB with Gemini 3 Flash or Qwen3-32B (§5 "Model Selection"). Rule-based techniques "remain the cheapest overall" (§1); mutmut is compared on success and subtlety only, not tokens (§3 (c)); temperature 0 "does not guarantee exact reproducibility" (§3).

## Open problems and building blocks

- **Open:** "scale test-aware mutant generation to production-level environments" (abstract). Researchers with well-tested industrial repositories could split a test suite into a handful of base tests and keep the rest as the oracle; the authors "hypothesize that this would replicate our finding" (§7). Quantify energy use and CO₂ of local against cloud inference, and whether newer reasoning models can further lower the amortized cost per fault (§7). Models could suggest targeted mutants on pull requests in continuous integration (§5 "Practical Implications").
- **Released:** "We make all code and data publicly available as open artifacts": the code repository, and the generated data on Zenodo "under a CC-BY 4.0 license" (Data Availability Statement; title page, "Supplementary Material").
- **To reuse it:** a problem statement, a reference solution and its existing tests, in one prompt per mutant (§3); to verify mutants automatically, a stronger test suite to act as oracle, which the authors say real settings usually lack (§5). The authors recommend frontier models such as Gemini 3.1 Pro "to maximize the discovery of subtle edge-case faults", and smaller ones such as GPT 5.1 Codex Mini to "save token costs" when the budget is strict (§5 "Model Selection").

## On this site

- **Tags:** <span class="tags"><a class="tag" href="#/tags/code">code</a><a class="tag" href="#/tags/compact">compact</a><a class="tag" href="#/tags/hacking">hacking</a><a class="tag" href="#/tags/harness">harness</a><a class="tag" href="#/tags/labels">labels</a><a class="tag" href="#/tags/method">method</a><a class="tag" href="#/tags/study">study</a><a class="tag sub" href="#/tags/llm-assist">llm-assist</a></span>
