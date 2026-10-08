# CodeT: Code Generation with Generated Tests

**CodeT** · ICLR 2023

Read: [PDF](https://arxiv.org/pdf/2207.10397) · [arXiv](https://arxiv.org/abs/2207.10397)  
Code: [CodeT](https://github.com/microsoft/CodeT)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- The same code model that samples candidate programs is prompted to write test cases (input and expected output) for the problem; every program runs on every test, programs that pass the same tests form a consensus set, and the set scored by its numbers of programs and tests supplies the answer ("dual execution agreement", RANSAC-inspired) (abstract; §2.1–2.2). Zero-shot on HumanEval, MBPP, APPS and CodeContests with three Codex models, InCoder-6B and CodeGen-16B (§3).
- It needs no labelled data or trained ranker (§1). In Tab. 2 its pass@1 on HumanEval and MBPP is above both the baseline (greedy decoding for pass@1, App. A) and the authors' replication of AlphaCode's output clustering, "AlphaCode-C", for all five models (§4.1).
- Model-written tests as the check for choosing among sampled programs, a code analogue of LLM-built test databases for choosing among SQL candidates. The tests are themselves unchecked: the authors measure test accuracy against the canonical solution and a "toxicity" rate, tests that some generated program passes while the canonical solution fails, and report that test quality "strongly correlates" with the gain (§4.3, Fig. 4).

## In plain words

A code model can sample many programs for a problem, and often one is right, but picking it is hard: for Codex on the HumanEval benchmark, the authors cite a large gap between how often one of 100 samples is correct and how often one sample is (§1). Tests would settle it, but they are often "costly and time-consuming" to write, and it is unrealistic to expect users of a coding assistant to supply them for every problem (§1). CodeT has the same model write test cases too, runs every program on every test, groups programs that pass exactly the same tests, and picks from the group with the best combined count of programs and tests (abstract; §2). With code-davinci-002 on HumanEval, zero-shot and with example tests removed from the prompt, its first pick solves 65.8% of the problems, against 47.0% for the model's greedy answer and 42.7% for the best earlier result cited (§1; §4.1; Tab. 2; App. A). They call it "a novel method" (abstract) that, with code-davinci-002, beats "previous state-of-the-art methods by a large margin" (§1).

## Background and terms

**Terms to know:** [pass@k](#/glossary/passk) · [best-of-N sampling](#/glossary/best-of-n-sampling) · [self-consistency (majority voting)](#/glossary/self-consistency-majority-voting) · [greedy decoding and temperature sampling](#/glossary/greedy-decoding-and-temperature-sampling) · [top-k and nucleus (top-p) sampling](#/glossary/top-k-and-nucleus-top-p-sampling)

**The paper's own terms:**
- **test case**: "a pair of input and expected output for the function defined in the context" (§2.1), written as a Python `assert` (App. H.3); a code solution (a sampled program) passes it if it runs without errors and its output matches (§2.2).
- **hypothetical inlier**: a (solution, test) pair in which the solution passes the test (§2.2).
- **consensus set**: from a hypothetical inlier (x, y), the tests x passes, the solutions that pass exactly those tests, and all pairs across the two (§2.2, Fig. 3).
- **dual execution agreement**: ranking consensus sets by both their solutions and their tests (§4.4). §2.2 scores a set by solutions times tests (its number of pairs); the experiments use the square root of the solution count times the test count (App. A; App. C).
- **pass@k, as used here**: of n sampled solutions, k are selected; a problem is solved if any of the k passes all ground-truth tests (§3 "Metrics and Baseline"). The Baseline picks at random (the unbiased estimator of Chen et al., 2021), but uses greedy decoding for pass@1 (App. A); CodeT picks from its k best consensus sets (§2.2). So, unlike the glossary's sense, CodeT's pass@k scores its own picks.
- **test case accuracy / toxic test case**: a test is correct "if the canonical solution can pass it" (the benchmark's reference solution); it is "toxic" if "any generated code solution can pass it while the canonical solution cannot" (§4.3).
- **AlphaCode-C**: the authors' replication of AlphaCode's clustering: groups solutions by their outputs on the inputs of CodeT's tests, ranked by size (§3; App. I).

**Missing glossary terms:**
- **RANSAC** (random sample consensus, Fischler & Bolles, 1981): "a robust method for finding consensus among noisy data" (§2.2); it repeatedly fits a random sample, collects the data that agree (the consensus set), and keeps the best-supported fit (general definition).

In the glossary's terms (our wording), CodeT is a kind of best-of-N sampling whose scorer is agreement with model-written tests and with other samples; App. I relates its solutions-only variant to the idea of self-consistency.

**Builds on:**
- RANSAC (Fischler & Bolles, 1981): the method is "inspired by the classical RANSAC algorithm" (§1).
- Codex and HumanEval (Chen et al., 2021): models, a benchmark, the Baseline (§3).
- AlphaCode (Li et al., 2022b; [AlphaCode](#/papers/li2022alphacode "Competition-Level Code Generation with AlphaCode (2022)")): its clustering is the compared method, AlphaCode-C, and its CodeContests a benchmark (§3; App. I).
- Trained rankers and verifiers (Cobbe et al., 2021, [GSM8K and trained verifiers](#/papers/cobbe2021verifiers "Training Verifiers to Solve Math Word Problems (2021)"); Shen et al., 2021; Inala et al., 2022), contrasted in §5; Inala et al. give "the best previously reported results" on HumanEval (§4.1).

## Problem and setting

- **Question:** from many programs a pre-trained model samples for one problem, select the one most likely to be correct (§2); the method "does not require any labelled data or additional rankers" (§1).
- **Input:** a problem description as a code comment plus context such as imports and the function header (§2, Fig. 2); for APPS and CodeContests, the header `def solution(stdin : str) -> str:` (§3 "Benchmarks").
- **No example tests in the prompt:** they are removed before generating solutions and tests, "to avoid exposing real test cases to the language model and to increase the diversity and difficulty of the generated test cases" (§2.1).
- **Assumptions (§2.2):** (1) solutions and tests are "independently and randomly sampled" from the model; (2) "incorrect code solutions are often diverse, and the probability of having a functionality agreement between two incorrect code solutions by chance is very low".
- **Models (§3 "Models"):** OpenAI's Codex models code-cushman-001, code-davinci-001 and code-davinci-002; the open models InCoder 6.7B (printed InCoder-6B) and CodeGen-Mono-16B (Python-only).
- **Benchmarks (§3; Tab. 1), zero-shot:** HumanEval and MBPP (hand-written and crowd-sourced Python problems), APPS (coding-website problems at three difficulty levels), CodeContests (Codeforces competition problems).
- **Sampling (App. A; Tab. 1; App. H.3):** temperature 0.8, top p 0.95, 0.1 s timeout per test. Solutions per problem: 100 (HumanEval, MBPP), 50 (APPS), 1,000 (CodeContests). Test samples: 100 (HumanEval, MBPP) or 50 (APPS, CodeContests), keeping up to 5 tests from each.

## Approach

- **Test generation (§2.1, Fig. 2).** The same model gets the context plus a `pass` body, a comment "check the correctness of [entry point]", and an opening `assert`; it tries to complete the asserts with input-output pairs.
- **Dual execution agreement (§2.2, Fig. 3).** The RANSAC-style version samples a (solution, test) pair; if the solution passes, it builds and scores that pair's consensus set; after a fixed number of rounds it returns a solution from the best set (for k picks, one from each of the k best). With not many solutions, a "naive version" runs every solution on every test and scores every group of solutions that pass the same tests (§2.2).
- **Scoring.** "the more pairs that agree with the hypothetical functionality, the more likely this functionality is correct, according to our assumptions" (§2.2). The square root damps the solution count because the authors "believe passing more test cases is more important than having more code solutions with the same functionality" (App. C).

## Results

Numbers are pass@k (%), as reported.

- **HumanEval and MBPP (§4.1, Tab. 2).** CodeT's pass@1 is above the Baseline and AlphaCode-C for all five models on both benchmarks. For code-davinci-002 on HumanEval: 47.0 → 65.8, against 55.1 for AlphaCode-C, a "20+% absolute improvement" over the 42.7 of Inala et al. Codex models gain "about 10%" in pass@1, "consistently above 10% on HumanEval" (§4.1).
- **APPS and CodeContests (§4.2, Tab. 3),** code-davinci-002: pass@1 27.2 → 34.6 on APPS introductory problems, 0.7 → 2.1 on CodeContests.
- **Test quality (§4.3, Fig. 4).** On HumanEval, Codex tests are more accurate and less often toxic than CodeGen's and InCoder's, and "the quality of test cases strongly correlates to the performance gain using" CodeT across models.
- **Better tests (§4.3, Tab. 4).** code-davinci-002's tests raise the other four models' pass@1, most for InCoder and CodeGen.
- **Fewer tests (§4.3, Tab. 5; App. H.3).** More tests "could generally lead to better performance", the gap narrowing from 50 test samples per problem and 3 tests kept per sample; with only 10 tests, code-davinci-002's HumanEval pass@1 still gains 9.5 points over the baseline.
- **Ablations.** Scoring by solutions alone or tests alone "performs consistently worse than" CodeT (HumanEval, Codex; App. I, Tab. 13); damping the solution count "can consistently improve the performance" (App. C, Fig. 8, HumanEval); de-duplication has "slight and inconsistent influence" (App. D, code-cushman-001); removing trivial solutions (ones returning a constant or their input) brings "little performance gain" (App. F, APPS and CodeContests).
- **Original HumanEval (App. B, Tab. 6).** With example tests in the prompt, Codex models' CodeT results are "significantly improved": models could borrow the real tests.
- **One-shot (App. G, Tab. 9).** After filtering by the given example, CodeT "can further outperform" the filtered baseline on APPS, "especially for the introductory and interview problems"; on CodeContests and competition-level APPS it "has little performance improvement or even performs slightly worse".
- **Error analysis (§4.4).** With code-cushman-001 on HumanEval, 53 of 164 problems have a correct solution outside the top consensus set; 20% of them "can be blamed on issues such as ambiguous problem descriptions, uncovered corner cases, and lack of import statements", the rest on "the failure of the model to understand the problem descriptions".

## Limits the authors state

- CodeT "only works for executable code generation and it introduces extra computation cost for test case generation" (§6).
- It "is empowered by the pre-trained language models, but is also limited by them": the second assumption "does not always hold" (§4.4).
- Toxic tests "may hinder the scoring of consensus sets and lead to the failure of" CodeT (§4.3).
- Improvements "are not significant for competition level problems in APPS and CodeContest" (§4.2); in one-shot runs the authors blame "the generated low-quality test cases" (App. G).
- "there are still corner cases that the models cannot cover" (App. H.2).
- AlphaCode's test-input model "is unavailable and hard to replicate" (App. I); the gray reference numbers in Tab. 2 come from settings "not exactly the same as ours" (Tab. 2 caption).

## Open problems and building blocks

- **Open:** improve CodeT "to solve more difficult programming problems" (§6); "future study on test case generation for more challenging programming problems" (App. G); "more advanced de-duplication methods" (App. D); "All the bad cases call for future improvements on the quality of generated code solutions and test cases" (App. J).
- **Released:** "Our work is publicly available at" a GitHub repository (§1).
- **To reuse it:** a model that writes both programs and tests (§2.1), or a stronger model's tests (§4.3); execution of every solution on every test (§2.2); a Python function with a named entry point (§2.1). Budgets: § Problem and setting; the authors suggest fewer test samples in real-world use to balance performance and computation cost (§4.3).

## On this site

- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/cex-general">cex-general</a><a class="tag sub" href="#/tags/cex-llm">cex-llm</a><a class="tag sub" href="#/tags/llm-assist">llm-assist</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/scaling-general">scaling-general</a></span>
