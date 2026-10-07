# LLMs as a Jury: Cross-Model Consensus Can Outperform Process Reward Models for LLM Reasoning

**LLMs as a Jury** · preprint 2026

Read: [PDF](https://arxiv.org/pdf/2607.10139) · [arXiv](https://arxiv.org/abs/2607.10139)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Agreement across independently trained models, each solving once, picks the answer from a Best-of-N pool; the authors report it beats self-consistency and self-scoring on seven benchmarks (Tab. 1).
- A closed-form law predicts consensus accuracy from measured, label-based panel statistics: accuracy, error correlation and a wrong-answer profile of up to six masses (§3.2, App. B–C).
- When to trust agreement as a verifier, and its shared-error floor.

## In plain words

When an LLM samples many candidate solutions, the hard part is picking the right one. The author argues that the usual pickers each carry a cost: a majority vote over one model's samples repeats its own mistakes, and trained scoring models need labeled data and transfer poorly (§1). The paper instead lets several independently trained LLMs each solve the problem once, never seeing each other's work, and picks the candidate their answers agree on: an "LLM-jury". Choosing from twelve candidates of one generator, the author reports that the jury beats the majority vote and a model scoring its own candidates on seven benchmarks, not always significantly, and on the 30-problem AIME-2024 picks as well as a selector that knows the answer. A formula predicts the jury's accuracy from a few panel statistics measured on labeled problems and names its limit: problems on which all models give the same wrong answer. The author presents it as "a predictable, training-free verifier with a quantified ceiling that rivals trained reward models and generalizes where they do not" (§1).

## Background and terms

**Terms to know:** [self-consistency](#/glossary/self-consistency-majority-voting) · [outcome and process rewards](#/glossary/outcome-and-process-rewards) · [LLM-as-a-judge](#/glossary/llm-as-a-judge) · [bootstrap resampling](#/glossary/bootstrap-resampling) · [AUROC](#/glossary/auroc) (not defined in the paper, §5.3)

**The paper's own terms:**
- **LLM-jury, cross-model consensus**: M independently trained models each answer once; equivalent answers form classes, the largest class is the consensus, and its share of the panel (the agreement) is a confidence signal (§3.1, Fig. 1). As a selector it scores each pool candidate by how many panel answers match it, breaking ties by the answer's frequency in the pool (App. A).
- **single-model LLM-verifier**: one model rates each candidate 0–10 and the top one is returned (App. A); in the main comparison it rates its own candidates (§1).
- **oracle**: returns a correct candidate whenever the pool holds one (§3.1); its gain over self-consistency is the oracle gap (§5.1).
- **a, ρ, s**: mean member accuracy; mean pairwise correlation of the members' being wrong; and the share of wrong answers that fall on the most common wrong answer (§3.2, App. B).
- **attractor**: a wrong answer several erring models tend to give (§3.2); the **mass profile** spreads wrong answers over up to six (App. C).
- **shared-error floor**: the rate at which the whole panel agrees on one wrong answer, which no agreement signal can detect (§3.2).
- **selective prediction**: answering only the most-agreed problems; coverage is the fraction answered (§3.2).
- **calibration** (this paper's sense): how well the agreement level predicts whether the selected answer is correct (§3.2).
- **self-check gate**: a trained verifier is used only where its scores separate correct from wrong candidates at AUROC 0.6 or more, else self-consistency is (§5.3).
- **RFT** (rejection-sampling fine-tuning): fine-tune on sampled solutions whose answer matches a target (App. F).

**Missing glossary terms:**
- **Beta distribution**: a distribution over numbers between 0 and 1, set here by a mean and a concentration (§3.2).

**Builds on:**
- Self-consistency (Wang et al., 2023; [Self-Consistency](#/papers/wang2022selfconsistency "Self-Consistency Improves Chain of Thought Reasoning in Language Models (2023)")): the baseline whose within-model agreement the jury replaces (§1, §2).
- Trained verifiers: process reward models (Lightman et al., 2023, [Let's Verify Step by Step](#/papers/lightman2023verify "Let's Verify Step by Step (2023)")) (§2), and the four compared head-to-head (§5.3): Qwen2.5-Math-PRM 7B and 72B, the outcome reward model AceMath-72B-RM and the generative verifier ThinkPRM-14B, which writes step-by-step verdicts (App. A).
- Prompted judges: the verifier credited to Zhang et al. (2025b) (§3.1; [Generative Verifiers (GenRM)](#/papers/zhang2024genrm "Generative Verifiers: Reward Modeling as Next-Token Prediction (2025)")) and LLM-as-a-judge (Zheng et al., 2023) (§2).
- Multi-model methods, which the author says treat combination as "an aggregation heuristic for a better answer" (§2): ranking and fusion, layered refinement, many-agent voting, a panel replacing one judge (Verga et al., 2024); and ensemble theory, where decorrelated errors drive the gain (Krogh & Vedelsby, 1994; Dietterich, 2000) (§1, §2).

## Problem and setting

- **Question:** which signal selects best, and can its reliability be predicted (§2, §3)?
- **Models** (§4, App. A): Qwen3-235B, DeepSeek-V3.2, Claude Sonnet 4.6 and Kimi-K2.5 (hosted API), and a same-family Qwen control. Qwen3-235B samples N=12 candidates at temperature 0.8; the panel is "the three remaining cross-family models plus the generator" (§4), answering greedily (App. A).
- **Benchmarks** (§4): AIME-2024 and AIME-2025 (competition math, 30 problems each), MATH-500 (500), OlympiadBench (olympiad math, 674), GSM8K (grade-school word problems, 1,319), GPQA Diamond (graduate science multiple choice, 198), MMLU-Pro (ten-option broad knowledge, 1,000 sampled); HumanEval+ (code) in App. H.
- **Correctness:** symbolic or numeric equivalence for math, letter-choice match for multiple choice (§4, App. A); for code, programs agree if they give identical outputs on shared test inputs, and are correct if they pass held-out unit tests (App. H). One-sided paired bootstrap p-values (§4).
- **The law's assumptions** (§3.2, App. C): each problem has a hidden chance of being solved, drawn from a Beta distribution with mean a and a concentration set so that the pairwise error correlation equals ρ; every member has that same chance, independently of the others given it; a wrong member lands on the single shared attractor with probability s, otherwise on a wrong answer no other member gives; ties go to the correct class.

## Approach

- **Selection** (§3.1, App. A): in Tab. 1 all four selectors choose from the same twelve Qwen3-235B candidates; self-consistency returns the pool's most frequent answer. The jury reads only final answers; trained verifiers read full reasoning traces (§5.3).
- **The law** (§3.2, App. B–C): under these assumptions, consensus accuracy, the selective-prediction curve and the floor are exact functions of a, ρ, s and panel size M. Eq. 1: the floor is the chance that all M members are wrong times the chance all land on the attractor (s multiplied by itself M times). Eq. 2 (App. C): the correct class wins when at least one member is right and the attractor class is no larger. It is called parameter-free because the inputs are "never fit to the prediction target" (§3.2); reported predictions use the mass profile instead of s (App. C).
- **Decorrelation** (§3.2): accuracy rises as error correlation falls; calibration depends "chiefly on member accuracy".
- **Extensions:** a cascade calling the full panel only when two models disagree (§5.3, App. I); agreement by program behavior (App. H); consensus as an RFT reward (App. F).

## Results

- **Selection** (§5.1, Tab. 1): on AIME-2024 the jury scores 56.7 against 36.7 (self-consistency) and 30.0 (LLM-verifier), equal to the oracle; on GPQA 35.9 against 33.3, oracle 53.0, not significant. The author reports it is the strongest non-oracle selector on every unsaturated benchmark (one where the oracle leaves room above the selectors), the LLM-verifier capturing "essentially none of the oracle gap" (§5.1); the abstract claims the full gap on "competition math", and the gain "is largest where the oracle gap is widest" (§5.1).
- **Robustness** (App. J–K): the result holds with a DeepSeek-V3.2 generator, an open-weight panel, a frontier panel (Tab. 15) and N=4 or 8 (Tab. 16).
- **The law** (§5.2, Tab. 2): mean absolute error 0.028 on accuracy, similar with the wrong-answer profile taken from the other benchmarks (App. C), looser on AIME. The empirical floor is 0.000 (both AIME sets) and 0.004 (MATH-500) against 0.030 (GPQA) and 0.143 (MMLU-Pro). The author also reports that the law's 90% intervals from resampling its input data contain the empirical values (Tab. 6), transfer to the frontier panel (App. C), forecasts of adding models (Fig. 3 left) and of selective curves (Fig. 4).
- **Shared errors** (App. D): of GPQA's unanimous wrong answers, two are grading artifacts and four share a convention or heuristic.
- **Abstention** (§5.2, Tab. 11): unanimous answers are far more accurate, but on GPQA and MMLU-Pro stay well below perfect, which the author attributes to the floor.
- **Trained verifiers** (§5.3, Tab. 3): on MATH-500 the jury's 96.6 beats the PRMs and ThinkPRM (92.8–94.6) and edges AceMath's 95.6 (p=0.142, not significant); on GPQA 35.9 against 26.8–32.3.
- **Mechanism** (§5.4, Tab. 8): mean error correlation 0.68 (one model resampled), 0.52 (same family), 0.47 (cross-family). At matched accuracy distinct models win on AIME-2024 while being less well calibrated, called "the first measurement to separate the accuracy and calibration contributions", "To our knowledge"; on AIME-2025 and GPQA the gain "all but vanishes" (App. E). On AIME-2024 four models reach 70.0 against 43.3 for 32 samples of one (§5.4).
- **Cascade** (App. I, Tab. 12): full-panel accuracy at 2.1–2.2 calls per problem (GSM8K, MATH-500) and 3.2–3.4 (AIME, GPQA), against 4.
- **Training reward** (App. F): consensus "recovers most of the gain that gold labels provide, at both 1.5B and 7B policy scales" (§5.3), the policy being the model fine-tuned.

## Limits the authors state

- Where models "share a misconception (measurably, parts of GPQA), unanimous agreement is confidently wrong and no agreement-based verifier can help"; selection cannot exceed the pool's oracle (§6).
- "As a voting rule it does not beat the single strongest panel member when panel strength is highly unequal", and it needs more than one model (§6).
- "The jury spends M full generations where a PRM needs a single forward pass"; with in-domain reward data and a hosted PRM, "a trained verifier remains economical" (§5.3).
- The law's inputs must be "measured on a sample with ground truth" (App. B); on the hardest sets its one hidden difficulty per problem "is an approximation" (§5.2).
- The GPQA floor is "a conservative upper bound" because of grading artifacts (App. D).
- "we do not claim to have bracketed the strongest possible prompted judge" (App. K).
- RFT uses one run per arm (App. F). Hosted models' "exact outputs may shift across provider-side updates" (Reproducibility Statement); intervals are wide on 30-problem sets (App. A).

## Open problems and building blocks

- **Open:** "On-policy RL and larger policies" (App. F), i.e. reinforcement learning on the model's own fresh samples, and larger models; a "systematic judge-prompting sweep" (App. K); "training models that fail differently" to lower the floor (§6). Named bottleneck: the selector (§1).
- **Released:** nothing stated; prompts are printed in App. A.
- **To reuse it:** "a panel of three to four cross-family models" (§6), each solving every problem; an answer-equivalence check, or test inputs for code (App. H); for the law, "a few hundred labeled problems" (App. B).
- **Beyond its domain:** code (§5.3, App. H) and a label-free training reward (App. F).

## On this site

- **Discussed in:** [Comparing LLM methods under noise](#/challenges/method_comparison_under_noise) · [Whole-job reliability of multi-step LLM work](#/challenges/whole_job_reliability)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/judge-general">judge-general</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/scaling-general">scaling-general</a></span>
