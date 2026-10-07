# Unsupervised Evaluation of Code LLMs with Round-Trip Correctness

**Round-Trip Correctness (RTC)** · ICML 2024

Read: [PDF](https://arxiv.org/pdf/2402.08699) · [arXiv](https://arxiv.org/abs/2402.08699)  
Code: [icml2024-roundtrip-correctness](https://github.com/google-deepmind/icml2024-roundtrip-correctness)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Evaluates code LLMs without human labels: describe code in natural language, synthesize code back, and check whether the result is semantically equivalent to the original (abstract).
- The equivalence estimate can be a metric or an execution-based check such as unit tests (§2).
- The origin [Developing and Benchmarking Verification…](#/papers/alrashed2026verification "Developing and Benchmarking Verification Algorithms to Improve Text-to-SQL Generation (2026)") adapts for its round-trip critique (PDF p. 1, ref. [1]).

## In plain words

Testing how well an LLM writes code usually needs benchmarks written by skilled programmers, which the authors say are costly to build and focus on narrow kinds of code, such as small standalone exercises or simple data-science tasks (abstract, §1). They propose round-trip correctness: a model describes a piece of existing code in a short sentence, a model (possibly the same one) rewrites the code from that sentence, and the rewrite is checked against the original, for code writing by running unit tests and for code editing by exact match. On two human-made benchmarks, across seven models, this score correlates strongly with the usual share of problems solved (§4.1). On real Python projects, the score of two Gemini models varies widely between projects, which the authors read as a sign that narrow benchmarks "do not capture the LLM's capabilities across multiple domains" (§4.2).

They present it as an alternative evaluation method, meant to complement existing benchmarks, that reaches "a much broader set of domains and tasks which was not previously possible without costly human annotations" (abstract).

## Background and terms

**Terms to know:** [property-based testing](#/glossary/property-based-testing) · [pass@k](#/glossary/passk) · [test oracle](#/glossary/test-oracle) · [exact match](#/glossary/exact-match) · [Spearman's rank correlation](#/glossary/spearmans-rank-correlation) · [decidable and undecidable](#/glossary/decidable-and-undecidable) · [BLEU and ROUGE](#/glossary/bleu-and-rouge) · [Pearson correlation](#/glossary/pearson-correlation) · [concrete syntax tree (CST)](#/glossary/concrete-syntax-tree-cst) · [back translation](#/glossary/back-translation)

**The paper's own terms:**
- **Round-trip correctness (RTC)**: a forward model turns an input x (code) into y (a description), a backward model turns y back into code, and RTC is the expected similarity of each rewrite to x, estimated from a few forward and backward samples (§2, Eq. 1). "These models could be a single LLM prompted differently" (§2); the experiments use one model for both (§4).
- **sim(·)**: the function that "estimates the semantic equivalence" of original and rewrite; it may be exact match, CodeBLEU or CodeBERTScore (similarity scores against a reference code), or an execution check such as unit tests (§2).
- **RTC_pass**: RTC with sim(·) = 1 when all unit tests pass, else 0; the tests are "a proxy" for semantic equivalence (§3.1, Tab. 1). **RTC_ExactMatch**: RTC for editing, scored by exact match with the original edit (§3.2, Tab. 3).
- **Forward lift**: RTC minus the score the backward model reaches when the description is replaced by an uninformative one ("TODO: Implement." for synthesis, "Edit." for editing) (§2, §3.1, §3.2). It "can serve as a weak measure of a model's ability to perform the forward task" (§2).
- **SynthesisRtc**: a code region is described, replaced by a TODO comment holding the description, and the model implements the TODO (§3.1, Fig. 1). **EditingRtc**: the model describes an edit from the old and new code, then must produce the new code from the old code and the description (§3.2).

**Builds on:**
- **Property-based testing** (Fink and Bishop, 1997): the authors "draw inspiration" from it; round-trip correctness is one such property, like decompressing compressed data (§2 "Background").
- **IdentityChain** (Min et al., 2023), which measures a code LLM's self-consistency through repeated round trips but "still requires an annotated human corpus" (§5 "Self-Consistency").
- **HumanEvalExplain** of the HumanEvalPack benchmark (Muennighoff et al., 2023), which the authors call a special case of SynthesisRtc on HumanEval without forward and backward sampling (§5 "Code Synthesis Benchmarks").
- **Ideas set apart in §5:** back translation (used for training data, while "our focus is model evaluation"), self-consistency decoding ([Self-Consistency](#/papers/wang2022selfconsistency "Self-Consistency Improves Chain of Thought Reasoning in Language Models (2023)"); "a model can be consistently wrong"), and faithfulness tests for explanations (Atanasova et al., 2023).

## Problem and setting

- **The question:** can a label-free round-trip score track existing metrics on narrow-domain benchmarks (§4.1), show how models differ across real software domains (§4.2), and evaluate code editing, for which "there are no well-established metrics or benchmarks" (§3.2)?
- **What "correct" means:** for synthesis, the rewrite passes all unit tests, because "proving semantic equivalence is hard" (§3.1); for editing, the predicted new code equals the original (§3.2).
- **Models** (§4.1, Tab. 2): three variants of Google's PaLM 2 (S, S+, S*), which "have the same number of parameters"; Google's Gemini Nano 2 and Gemini v1 Pro; and two open models, StarCoder2 15B and DeepSeekCoder-33B-Instruct (DSC33B-IT). §4.2 and §4.3 use only the two Gemini models.
- **Sampling, unless stated otherwise** (§4 "Experimental Setup"): the same model both ways, to avoid a "communication chasm" between models; 3 forward samples at temperature 0.8, one backward sample each at 0.1; identical three-shot prompts; forward samples limited to 128 characters; no hyperparameter variations explored.
- **Narrow benchmarks** (§4.1): HumanEval (Python function problems; the docstring is removed and the ground-truth body described) and ARCADE (multi-turn data-science problems in Jupyter notebooks).
- **Open-source projects** (§4.2, App. A): 77 permissively licensed Python projects whose tests run and pass; ranges of consecutive statements, 32–384 characters, covered by tests, outside test files, whose deletion changes the test results; 100 ranges per project, projects under 80 dropped, giving "5,961 samples from 58 open source Python projects". Context: whole lines around the range, at most 1024 characters.
- **Editing** (§4.3): a random 1K sample of the CodeReviewer test set (GitHub pull-request review comments paired with old and new code), nine languages; 3 forward samples at temperature 1.0, 1 backward at 0.0.

## Approach

- **The round trip** (§2, Fig. 1): average sim(·) over sampled descriptions and rewrites; the forward lift removes what the context alone gives, since "the code may be obvious within the code context" (§2 "Measuring the forward lift").
- **Checks** (§3): unit tests for synthesis, which "are often readily available", with "automatic test generation methods" or weaker similarities as fallbacks (§3.1); exact match for editing, with the footnote "If unit tests were available we would have preferred them." (§3.2).
- **Range sampling** (§4.2): statements are CST nodes, sampled in proportion to their characters and inversely to the number of other candidate nodes containing them; the test-effect filter, called "crucial", ensures "at least some observable effect".

## Results

- **Correlation with pass@1** (§4.1, Tab. 2): over the seven models, Pearson r = 0.96 on both HumanEval and ARCADE, Spearman ρ = 0.90 and 0.81. The authors "conclude that RTC is a valid metric that reflects the real-world performance of LLMs and thus can complement existing human-annotated benchmarks", noting "these correlations are not perfect" because RTC_pass also measures code-to-text. The PaLM 2 variants still correlate strongly, which "suggests that RTC correlates with the coding abilities controlling for model size".
- **Absolute level** (§4.1, Tab. 2): RTC_pass is below pass@1 on HumanEval (40.2% against 75.6% for DSC33B-IT), which the authors attribute to the HumanEval prompt's input-output examples, which the forward model is not prompted to generate, and to noise from the description step.
- **Lift on HumanEval** (§4.1 "Evaluating Code-to-Description"): all models except PaLM 2-S show a lift, "but better models offer a larger lift than small ones"; not computed for ARCADE, where the baseline "would be always zero".
- **Stability** (§4.1 "Sensitivity of RTC"): ten repeats on HumanEval give a standard deviation of 1.11%; a higher backward temperature "requires a significant increase" in backward samples to reduce variance.
- **Across projects** (§4.2, Fig. 2): RTC_pass "varies widely across projects/domains"; TheAlgorithms (educational algorithm implementations) scores very well, jedi (a Python static analysis library) lowest. The two models correlate at r = 0.75 (Spearman 0.76) across projects, "showing that different LLMs can have varying performance characteristics in different domains".
- **Lift across projects** (§4.2 "Lift across domains", Fig. 5): average lift 7.0% for Gemini Nano 2 and 21.5% for Gemini Pro; the authors call this "higher compared to HumanEval" and say it "further suggests that HumanEval may be a relatively simple benchmark".
- **Qualitative** (§4.2 "Qualitative Analysis", Fig. 3): Fig. 3 is a "cherry-picked" example of common error modes; overall the authors "often see some important part of the logic not being captured" in the descriptions.
- **Editing** (§4.3, Tab. 3): RTC_ExactMatch 5.2% for Gemini Nano 2 against 12.9% for Gemini Pro, forward lift 4.8% and 12.4%. Supervised BLEU against the review comments is "very low for the two models and uninformative"; with CodeReviewer aligned by "rough heuristics", the authors argue that when labels are noisy "RTC provides a more reliable evaluation" (§4.3, Fig. 4, App. C). Outputs with a non-zero exact-match score are "generally shorter" (App. D).

## Limits the authors state

- RTC's quality "depends on that of the similarity function"; "A weak measure of semantic similarity may yield arbitrary results" (§2 "Limitations").
- Forward and backward performance are coupled: "This may be a problem if we care for only one" of the two tasks (§2 "Limitations").
- RTC assumes "reasonably" trained and instruction-tuned LLMs; in an adversarial setting a forward model can recite its input for perfect RTC, unlikely with common (pre)training but something that "can arise naturally" if models are trained or fine-tuned on the RTC objective (§2 "Limitations").
- Unit tests "cannot guarantee semantic equivalence which in the general case is undecidable" (§5).
- Hyperparameters were set "Given the time constraints and compute limitations"; other sample counts or temperatures "changes the results" (§4, §4.1).
- RTC "should be complemented with good qualitative understanding of the LLM's error modes and suggestions rather than used blindly as a metric to be maximized" (§6).

## Open problems and building blocks

- **Open:** none called open. Directions: "the entire file, more files, or even an entire repository" as context, expected to "become increasingly viable in the future" (§4.2); complementing benchmarks with RTC "using a strong" similarity function (§6).
- **Released:** "Our code can be found at" a GitHub repository (§1).
- **To reuse it:** a code base with a passing test suite covering the sampled code (§4.2), or generated tests or a weaker similarity (§3.1); instruction-tuned LLMs (§2).
- **Beyond its domain:** "While RTC is general, it is well-suited for code" (§3); "a general metric that can be used for other tasks, like code editing" (§1).

## On this site

- **Discussed in:** [The self-improving SQL ↔ text ↔ verify loop](#/challenges/sql_text_round_trip_loop)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/general-misc">general-misc</a><a class="tag sub" href="#/tags/llm-misc">llm-misc</a></span>
