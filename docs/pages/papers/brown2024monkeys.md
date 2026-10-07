# Large Language Monkeys: Scaling Inference Compute with Repeated Sampling

**Large Language Monkeys** · preprint 2024

Read: [PDF](https://arxiv.org/pdf/2407.21787) · [arXiv](https://arxiv.org/abs/2407.21787)  
Code: [large_language_monkeys](https://github.com/ScalingIntelligence/large_language_monkeys)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Coverage (any sample correct) often grows log-linearly with the number of samples and can be modelled as an exponentiated power law (abstract; §1, §3.1).
- Repeated sampling on code, math and Lean, with and without verifiers.
- With an automatic checker, coverage gains become solved problems (abstract); without one, majority voting and reward models plateau beyond about 100 samples (§1, §4.1).

## In plain words

Users and developers "often restrict models to making only one attempt when solving a problem" (§1). The authors let a model make many independent attempts per problem and separate two questions: how many problems at least one attempt solves (coverage), and how often the right attempt can be picked out (§1). They measure this on math word problems, formal proofs and programming, with up to 10,000 attempts per problem (§2), fit a curve to coverage growth (§3), and test common ways of picking an answer without an automatic checker (§4). They present a systematic study, aiming "to systematically characterize these benefits across a range of tasks, models, and sample budgets" (§1).

Headline: on real GitHub issues, an open model inside a code-editing agent solves 15.9% of issues with one attempt and 56% with 250 attempts, judged by each repository's own tests, against 43% for the best single-attempt system (abstract). On math word problems, which lack an automatic checker, majority voting and a reward model stop improving beyond about 100 attempts while coverage keeps rising (§1, §4.1).

## Background and terms

**Terms to know:** [pass@k](#/glossary/passk) · [best-of-N sampling](#/glossary/best-of-n-sampling) · [self-consistency (majority voting)](#/glossary/self-consistency-majority-voting) · [reward model](#/glossary/reward-model) · [proof assistant](#/glossary/proof-assistant) · [compute-matched comparison](#/glossary/compute-matched-comparison) · [scaling law](#/glossary/scaling-law)

**The paper's own terms:**
- **repeated sampling**: drawing many independent candidate solutions from one model "with a positive temperature", then using a domain-specific verifier to choose a final answer (Fig. 1).
- **coverage**: "the fraction of problems that are solved by any generated sample" (abstract); for code it equals pass@k, for proofs in Lean (a proof assistant) a pass means the proof checker accepts, and for the math word-problem sets GSM8K and MATH it means "using an oracle verifier" (§2).
- **oracle verifier**: here, a check that knows the correct final answer and asks whether any sample reaches it (§2).
- **precision**: "How often can we identify correct samples from our collection of generations?" (§1).
- **success rate**: the fraction of problems actually solved after an answer is chosen; coverage gives an upper bound on it "in the general case" (§2).
- **sample / attempt** on SWE-bench Lite (real GitHub issues, solved by editing the repository): "one entire multi-turn trajectory" with the agent framework (§2.1).
- **exponentiated power law**: the curve coverage ≈ exp(a·k^b), where k is the number of samples and a and b are fitted constants (§3.1, Eq. 3).
- **flaky tests**: test suites "that do not produce consistent results when running them on the same candidate solution" (§4.2.1).
- **false negatives**: solutions "that are correct but fail the tests" (§4.2.2).

**Builds on:**
- Earlier evidence for repeated sampling: self-consistency ([Self-Consistency](#/papers/wang2022selfconsistency "Self-Consistency Improves Chain of Thought Reasoning in Language Models (2023)")), Code Llama, a GPT-4o result on ARC-AGI puzzles (§6), and AlphaCode, a competitive-programming system that "finds that performance continues to improve with a million samples per problem" (§1).
- Chen et al. (2021), not listed here, for pass@k and its estimator (§2).
- Training scaling laws (§3) and the GPT-4 technical report's power law linking the average log pass rate on coding problems to training compute, whose function class the authors adopt (§3.1).
- The datasets GSM8K ([GSM8K and trained verifiers](#/papers/cobbe2021verifiers "Training Verifiers to Solve Math Word Problems (2021)")), MATH, MiniF2F (math problems formalized for proof checkers), CodeContests (competitive programming, from AlphaCode) and SWE-bench (§2).

## Problem and setting

- **Question:** how coverage grows with samples across tasks and models, whether it follows a predictable curve, and whether selection methods keep up (§1).
- **Tasks** (§2; pass-fail only): GSM8K (grade-school level) and MATH (harder), 128 random test problems each; MiniF2F-MATH (130 test problems from MATH, in Lean4); CodeContests (Python3; 140 test problems without images, App. A.2); SWE-bench Lite, where "only a single file needs to be changed".
- **Correctness:** the Lean4 proof checker; for CodeContests, public, private and generated tests (App. A.2) "hidden from the model" (§2); repository unit tests for SWE-bench Lite; a final-answer match for GSM8K and MATH (App. A.3–A.4).
- **Models:** Llama-3-8B-Instruct and -70B-Instruct on four tasks, 10,000 samples per problem (§2.1); more Llama-3, Gemma and Pythia models (70M–70B, base and instruction-tuned) on MATH and CodeContests (§2.2, Fig. 3); for SWE-bench Lite, the open-source DeepSeek-Coder-V2-Instruct (the task's context length exceeds Llama-3's) in the Moatless Tools agent framework (tools for navigating and editing codebases), 250 attempts per issue (§2.1).
- **Sampling:** independent attempts, one prompt and settings (§5); temperature 0.5 (Lean), 0.6 (others), 1.6 for SWE-bench Lite, picked by a sweep on 50 random test problems (App. A, App. B.1).

## Approach

- **Measure coverage** with the unbiased pass@k estimator (§2, Eq. 1).
- **Cost:** plot coverage against approximate inference FLOPs (floating-point operations; prompt counted once, generated tokens once per completion), and compare API dollar costs on SWE-bench Lite with the agent framework fixed (§2.3, Tab. 1).
- **Fit the curve:** model log coverage as a power law in k, then exponentiate (§3.1, Eq. 2–3); the fit uses SciPy's `curve_fit` on 40 points spread on a log scale (App. C.1).
- **Compare families:** shift each family's curves sideways on a log axis through one anchor point (§3.2, Fig. 6).
- **Test selection methods** on GSM8K and MATH: majority vote, reward model plus best-of-N, and reward-weighted majority vote, with the reward model ArmoRM-Llama3-8B-v0.1 (high on RewardBench's reasoning section, a reward-model leaderboard), averaged over 100 random subsets of size k (§4.1, App. D).
- **Is verification hard?** Hand-grade 105 chains of thought from correct Llama-3-8B-Instruct GSM8K samples (§4.1, Tab. 2).

## Results

- **Coverage across tasks (§2.1, Fig. 2):** coverage "smoothly improves as the sample budget increases" on all five tasks; GPT-4o beats the Llama and DeepSeek models at one attempt each, but with more samples all three exceed its single attempt. On SWE-bench Lite, DeepSeek-Coder-V2-Instruct goes from 15.9% to 56% with 250 samples, against the single-attempt state of the art of 43% (CodeStory Aide, a system combining GPT-4o and Claude 3.5 Sonnet).
- **Across model sizes and families (§2.2, Fig. 3):** coverage rises for "almost every model"; Gemma-2B on CodeContests goes from 0.02% with one sample to 7.1% with 10,000. Pythia models stay at zero on CodeContests, which the authors "speculate" reflects less coding-specific training data.
- **Cost (§2.3):** at a fixed FLOP budget, Llama-3-8B-Instruct "always obtains higher coverage" than the 70B model on MiniF2F, GSM8K and MATH, while on CodeContests "the 70B model is almost always more cost effective" (Fig. 4). On SWE-bench Lite, five DeepSeek attempts solve 29.62% of issues for $10.8 in total, against single attempts by GPT-4o (24.00%, $39) and Claude 3.5 Sonnet (26.70%, $51), which makes DeepSeek "over 3x cheaper" in this comparison (Tab. 1; §1).
- **Scaling law (§3.1, Fig. 5; App. C.2, Fig. 10):** coverage "can be modelled with an exponentiated power law for most tasks and models", with exceptions such as Llama-3-8B-Instruct on MiniF2F-MATH. For a given task, curves of models from one family resemble S-curves "with similar slopes but distinct horizontal offsets" (§3, Fig. 6).
- **Selection without a checker (§4.1, Fig. 7):** all three methods rise at first, then "plateau around 100 samples", while coverage keeps rising toward the top. On MATH with Llama-3-8B-Instruct, coverage goes from 82.9% at 100 samples to 98.44% at 10,000, while the biggest gain from majority voting or reward models is "only from 40.50% to 41.41%" (§1).
- **Chains of thought (Tab. 2):** "the CoTs almost always follow valid logical steps", even on hard problems, which the authors say indicates "signal for a verifier to exploit" (§4.1). One GSM8K problem has a wrong reference answer (App. E), the only one Llama-3-70B-Instruct never got "correct" in 10,000 attempts (§4.1).
- **Verifier imperfections (§4.2):** 11.3% of SWE-bench Lite problems have flaky test suites (34 problems, 30 of them flaky even on the dataset's own correct solutions; App. B.2, Tab. 3); results without them are similar (Fig. 9). Of the 122 CodeContests test problems with Python3 solutions, 35 have "correct" reference solutions that fail the tests, because some tests demand one particular output where several are valid, or use mutated inputs that break the input rules (§4.2.2).

## Limits the authors state

- "we explore only a simple version of repeated sampling where all attempts to a problem are generated independently of one another using the exact same prompt and hyperparameters" (§5).
- The fitted laws "are not as exact as training scaling laws (most strikingly on MiniF2F-MATH)" and are "encouraging early evidence" (§3.1).
- "examining FLOPs alone can be a crude cost metric that ignores other aspects of system efficiency" (§2.3).
- Unit tests "take a black-box approach to verifying a piece of code and are not as comprehensive as methods like proof checkers", which can give false positives and false negatives (§4.2).
- The wider model set runs only on MATH and CodeContests, and SWE-bench Lite only to 250 attempts, to cut costs (§2.1, §2.2).

## Open problems and building blocks

- **Open (§5, "Improving Repeated Sampling"):** higher-level ways to diversify samples beyond temperature, which "may be able to further increase diversity" (e.g. AlphaCode's metadata tags); multi-turn attempts with execution feedback, which "should improve solution quality", and their cost trade-off; and access to earlier attempts, which "may be helpful".
- **Open (§5, "Verifiers"):** better verification where no automatic tool exists; applying repeated sampling to unstructured tasks such as creative writing; and "converters that can make an unstructured task verifiable", such as formalizing math into Lean. The bottleneck they name: "scalable verification is necessary for fully benefiting from repeated sampling" (§1).
- **Released:** code and data (abstract footnotes; §2), and Tab. 2's generations and human labels (Tab. 2 caption).
- **To reuse it:** an automatic verifier or a selection method for the task; many samples per problem (up to 10,000 here); for SWE-bench, a long-context model and Moatless Tools with Voyage AI retrieval embeddings, "entirely as off-the-shelf components" (App. B.1). As a throughput-oriented workload, repeated sampling "can therefore be accomplished at a lower cost" than many parallel chatbot API requests (§5, "Repeated Sampling and Inference Systems").

## On this site

- **Discussed in:** [Bringing compact models to frontier accuracy](#/challenges/compact_model_accuracy) · [Equivalence of nondeterministic queries](#/challenges/nondeterministic_equivalence) · [Weak checkers get exploited](#/challenges/weak_checker_exploitation)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/hacking-general">hacking-general</a><a class="tag sub" href="#/tags/judge-general">judge-general</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/scaling-general">scaling-general</a></span>
