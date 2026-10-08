# Verification Trap: Understanding Test-Time Selection Failures under False Premises in Code Generation

**Verification Trap** · EMNLP 2026

Read: [PDF](https://arxiv.org/pdf/2610.05170) · [arXiv](https://arxiv.org/abs/2610.05170)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Inserts a false premise into coding task descriptions, with hidden tests unchanged, samples 64 candidate programs, and selects one by default with unit tests a verifier writes from the same prompt; a task is trapped when the pool held a hidden-test-correct program but the selector returned a wrong one (Trap@64) (abstract; §3.1; §4.1).
- HumanEval+, MBPP and LiveCodeBench with Qwen2.5-Coder 7B–32B, plus DeepSeek-Coder-6.7B and GPT-4o-mini on HumanEval+ only (§4.1; Tab. 1). Measures how often verifier-written tests contain premise-violating inputs (§4.3), predicts trap risk from verifier-visible features before hidden tests run (§4.4), and compares more tests, wider pools and regeneration with selectors less tied to the verifier: a provenance rule and an LLM robustness auditor (§4.5; §S5).
- A weak check misleading inference scaling (<a class="tag" href="#/tags/hacking">hacking</a>), because generator and checker share one wrong reading of the task: the authors report selected correctness lower under the false premise in all eleven dataset–model cells, while the rise in Trap@64 is significant per cell in only some (§4.2; §S1.1). Their mitigation results come mostly from one cell, Qwen-7B on HumanEval+ (§4.5; §S5.7).

## In plain words

A common way to get better LLM code is to sample many programs and let a verifier pick one, here by running them on unit tests a model writes from the task description. The authors say this assumes the verifier gives a corrective signal independent of the generator (abstract). They insert one false statement into coding tasks, such as that the input list is already sorted, while the hidden tests that decide correctness stay the same. The verifier reads the same description, and in their measurements its tests contain fewer unsorted inputs, so the selector can return a wrong program even when a correct one is among the 64 samples: the "Verification Trap" (abstract; §3.1; §4.3). On three code benchmarks, the selected program is correct less often under the false premise in all eleven dataset–model settings, by 8.43 percentage points pooled (Tab. S1). For Qwen2.5-Coder-7B on HumanEval+, choosers that lean less on that verifier recover more than adding tests or samples (Tab. 3; Fig. 6). The authors present a failure mode they "identify" and explain, not a first (§1).

## Background and terms

**Terms to know:** [test-time scaling](#/glossary/test-time-scaling) · [best-of-N sampling](#/glossary/best-of-n-sampling) · [pass@k](#/glossary/passk) · [AUROC](#/glossary/auroc) · [bootstrap resampling](#/glossary/bootstrap-resampling) · [sign test](#/glossary/sign-test) · [statistical power](#/glossary/statistical-power)

**The paper's own terms:**
- **Prompt conditions**: baseline (task unchanged), irrelevant control (adds a true but task-irrelevant sentence) and false premise (adds "a localized misleading premise"); objective, function signature and hidden tests stay fixed (§3.1; §4.1).
- **Generator, Verifier, Trap Evaluator** (§3.2): the generator samples N candidates; the verifier ranks or selects them with test-time evidence; the trap evaluator runs the benchmark's hidden tests only after selection. "Gold-free" means using nothing derived from hidden tests (§4.4).
- **Generated-test selection**, the default in Tab. 1: the verifier writes Python assert statements; a candidate's verifier score is the fraction it passes; the top score wins (§S1 "Verifier score"; §S4.4). In the glossary's terms (ours), best-of-N sampling with model-written tests as scorer.
- **Pass@1, Selected@64, Oracle@64, Gap@64**: whether the first sample passes the hidden tests; whether the selected one does; whether any of the 64 does; Oracle minus Selected (§S1).
- **Trap@N**: a task is trapped when the pool holds a hidden-test-correct program but the selector returns a wrong one. This "can occur under any prompt condition"; the Verification Trap is "the false-premise-induced form of this event", measured by the false-minus-baseline change (§3.1).
- **Counterexample rate**: the share of verifier-written tests whose list input breaks the premise (for sortedness, an unsorted list) (§S2.1).
- **Verifier signature**: a candidate's pass/fail vector over the verifier's tests (§4.3).
- **Coupled and decoupled mitigation**: coupled methods add tests or candidates but still select with the original verifier; decoupled means "final selection is no longer determined solely by the original generated-test verifier channel" (§4.5).

**Missing glossary terms:**
- **False premise**: a false statement that a question or task presents as given; here one added sentence, e.g. "Important: the input sequence is guaranteed to already be sorted in non-decreasing order." (§S4.2).
- **Risk-coverage curve**: rank tasks by predicted risk, flag the top fraction, and track precision (flagged tasks that are traps) and recall (traps flagged) as the fraction grows (§S1; Fig. 5).

**Builds on:**
- Test-time compute by sampling: Li et al. (2022) ([AlphaCode](#/papers/li2022alphacode "Competition-Level Code Generation with AlphaCode (2022)")), Brown et al. (2024) ([Large Language Monkeys](#/papers/brown2024monkeys "Large Language Monkeys: Scaling Inference Compute with Repeated Sampling (2024)")), Snell et al. (2024) ([compute-optimal test-time scaling](#/papers/snell2024scaling "Scaling LLM Test-Time Compute Optimally can be More Effective than Scaling Model Parameters (2024)")), Wu et al. (2024), Li et al. (2025) (§1; §2).
- Verifier-based selection by generated tests, consensus or learned rankers: Chen et al. (2022) ([CodeT](#/papers/chen2022codet "CodeT: Code Generation with Generated Tests (2023)")), Ni et al. (2023), Inala et al. (2022), Zhang et al. (2023b), Li et al. (2023), Lightman et al. (2024) ([Let's Verify Step by Step](#/papers/lightman2023verify "Let's Verify Step by Step (2023)")) (§1; §2).
- Stroebl et al. (2024) ([The Limits of Inference…](#/papers/stroebl2024resampling "The Limits of Inference Scaling Through Resampling (2024)")), Pan et al. (2022), Bondarenko et al. (2025), cited where the authors say it is "less understood what happens when the generator and verifier are conditioned on the same false premise" (§1).
- False-premise question answering: Hu et al. (2023), Yu et al. (2023), Yuan et al. (2024), Xu and Ma (2024), Qin et al. (2025) (§1).

## Problem and setting

- **Questions** (§1): "Q1: When does verifier-based test-time selection fail under false premises, and why does this failure emerge?" and "Q2: If Verification Trap leaves traces in verifier-visible evidence, can we predict and mitigate it before hidden-test execution?"
- **Benchmarks** (§4.1): HumanEval+ and MBPP, "compact function-level programming tasks with executable unit tests", and LiveCodeBench, "temporally newer programming problems".
- **Models** (§4.1; Tab. 1): the open Qwen2.5-Coder 7B, 14B and 32B on all three; the open DeepSeek-Coder-6.7B and the closed GPT-4o-mini on HumanEval+ only. A scale study on MBPP adds Qwen2.5-Coder from 0.5B (§S1.2).
- **Main premises** (§S4.2): false sortedness on HumanEval+ and MBPP; on LiveCodeBench a false small-constraint premise ("all input sizes satisfy n <= 100"); auxiliary families: uniqueness, positivity and non-emptiness.
- **Sampling** (§S4.1): 64 candidates per task and condition.
- **Verifier input** (§4.1): by default, the same prompt condition as the generator. The verifier model of the main runs is not named in §4.1.

## Approach

- **Measurement** (§4.2; §S1.1): per-cell paired tests, a pooled paired bootstrap, and a sign test across cells.
- **Mechanism** (§4.3; §S2): counterexample rates of verifier tests (§S2.1); a control that keeps Qwen-7B's false-premise pools on HumanEval+ fixed and gives the verifier the premise-removed prompt (§S2.2); signatures projected and clustered, with hidden correctness used only to colour points (§S2.3; Fig. 3); a case study, HumanEval/110 (Fig. 4); 5 to 30 verifier tests on a fixed pool (§S2.4).
- **Gold-free trap-risk predictor** (§4.4; §S3): 13 features from the verifier's tests, its score distribution over the pool, and signature structure; a whitelist excludes anything derived from hidden tests. Logistic regression, cross-validated on HumanEval+, plus transfer to held-out models and datasets.
- **Mitigations** (§4.5; §S5):
  - Coupled: extra verifier tests; more candidates; robust regeneration (a prompt against convenience assumptions the task doesn't require, §S4.6), still selected by the original verifier.
  - Source-aware prior (§S5.2): a rule with no extra model calls, applied only to tasks the gold-free predictor flags as high-risk; it picks the best robustly regenerated candidate when its verifier score is within 0.2 of the best.
  - Robustness auditor (§S5.3): GPT-4o-mini (§S8) gets, in the main setting, the clean task prompt and one candidate and scores robustness, unjustified assumptions and shortcuts (§S4.5); this is combined with the verifier score, with the same gate and pool as the prior. Auditor scaling repeats the audit from several perspectives.

## Results

- **Cascade** (§4.2; Tab. 1): the authors report that under the false premise Pass@1 and Selected@64 are lower in all evaluated pairs, and the Oracle–Selected gap grows.
- **Significance** (§S1.1; Tab. S1): Selected@64 falls by 8.43 pp (percentage points) pooled. Trap@64 rises in all eleven cells, by 4.31 pp pooled, but is significant per cell in only 4 of 11; the authors call it "a sparse second-order event" and read it as "a directionally consistent and aggregate-significant diagnostic of recoverable selection failure, rather than as an every-cell significance claim".
- **Scope** (§S1.2): Trap@64 rises in all nine dataset–difficulty groups, not monotonically, and at every Qwen2.5-Coder scale tested on MBPP.
- **Fewer counterexamples** (§4.3; Fig. 2): the rate drops by 9.6, 12.9 and 18.9 pp for Qwen-7B, 14B and 32B (HumanEval+ per Tab. S4); also on MBPP; the irrelevant control stays near baseline.
- **Verifier prompt alone** (§S2.2; Tab. S5): with the pool fixed, a clean verifier prompt lowers Trap@64 for all three verifiers, "controlled evidence that premise-conditioned verifier inputs contribute to Verification Trap".
- **Signatures** (§4.3; Fig. 3): under the false premise, wrong candidates become more mixed into regions with correct ones.
- **More verifier tests** (§S2.4): going from 5 to 30 "produces almost no change" in Trap@64 on HumanEval+ and "only a modest reduction" on MBPP under the false premise.
- **Prediction** (§4.4; Tab. 2): AUROC 0.846 with all features, against 0.539 for the verifier-test features alone, which "remain close to random". Top-risk subsets stay enriched in traps on held-out models; "Cross-dataset transfer is more difficult but remains positive" (§S3.3).
- **Mitigation** (§4.5; Tab. 3; on the Qwen-7B / HumanEval+ cell, Fig. 6): against the original verifier's 77.03% pass rate, coupled methods give −0.36 to +0.97 pp, the source-aware prior, auditor and auditor scaling +4.05, +4.73 and +5.40 pp. Auditor scaling "saturates quickly" (§4.5).
- **Ablations** (§S5.4–S5.5): with gate and pool fixed, re-ranking by the original verifier gains little; since the prior uses no model, the authors say the gain "is not primarily explained by using GPT-4o-mini as a stronger judge". An auditor given the false-premise prompt recovers "most of the clean-auditor gain".
- **Other cells** (§S5.7): on four more HumanEval+ and MBPP cells decoupled gains exceed coupled ones; on LiveCodeBench coupled gains are zero, decoupled ones zero for Qwen-7B, positive for 14B and 32B.

## Limits the authors state

- "Our experiments test the decoupled-evidence principle rather than an optimized deployment system"; auditor design, routing policy and budget allocation "remain simple" (§ "Limitations").
- The predictor "is not yet a complete deployment-time safety system"; "larger-scale validation is needed to study calibration, threshold stability, and how predicted risk should trigger abstention or decoupled auditing" (§ "Limitations").
- Claims concern "the controlled false-premise settings evaluated in this work", not "a complete characterization of all triggering conditions or of the real-world prevalence of false premises" (§S1.2).
- Per-cell tests "have lower power for Trap@64 than for Selected@64" (§S1.1).
- Coupled scaling is limited "in our tested settings" (§4.5); the auditor is "a proof-of-principle decoupled evidence channel" (§S5.3).
- No wall-clock time, GPU hours, API tokens or cost, "because these quantities were not reliably logged across all experiments" (§S8).

## Open problems and building blocks

- **Open:** "Stronger robustness auditors, adaptive routing, and cost-aware selection policies may further improve recovery" (§ "Limitations"). Future test-time code-generation systems "should treat evidence independence as an important design axis, alongside candidate diversity and verifier strength" (§5).
- **Released:** the reported artifacts "consist of aggregate experimental statistics, plots, prompts, and implementation details needed to reproduce the evaluation protocol"; generated programs, tests, auditor outputs and selector decisions are not released "as an independent dataset" (§S6). Prompts are printed in §S4; no code release is stated.
- **To reuse it:** open models on RTX 4090 GPUs; GPT-4o-mini by API, including auditor calls, which auditor scaling increases (§S8). The source-aware prior needs no additional model calls (§S5.2). The predictor involves no LLM fine-tuning (§S8).

## On this site

- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/hacking-general">hacking-general</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/scaling-general">scaling-general</a></span>
