# An Imperfect Verifier is Good Enough: Learning with Noisy Rewards

**An Imperfect Verifier is Good Enough** · preprint 2026

Read: [PDF](https://arxiv.org/pdf/2604.07666) · [arXiv](https://arxiv.org/abs/2604.07666)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- RLVR on code (MBPP; Qwen3 8B and GLM4 9B, with Llama 3.1 8B and Qwen3 4B ablations; most configurations single-seed, §4) with injected reward noise of controlled rate and structure, and model-based verifiers as rewards (abstract; §3.2).
- Derives conditional advantage distributions under symmetric and asymmetric group noise (abstract).
- A hedged counter-claim on weak checkers (our framing), injected noise beside [When the Reward Suite Is Leaky](#/papers/zhang2026leaky "When the Reward Suite Is Leaky: A Preregistered Causal Contrast of Natural Verifier False Positives in RLVR (2026)")'s natural noise: for Qwen3 8B on MBPP it reports mean validation reward over two late evaluations within 1 point of clean through 20% resampled group-rollout noise, and says this does not establish a general tolerance threshold (abstract).

## In plain words

Reinforcement learning with verifiable rewards trains a language model by rewarding answers a checker accepts. The authors note that a perfect checker "does not exist" in practice and ask under which kinds of checker errors and training conditions an imperfect one can still support effective training (§1). They train code-writing models on Python problems while corrupting unit-test results at chosen rates and in four patterns, also reward with two language-model judges, and derive what whole-group corruption does to the training signal (abstract). Headline: for one 8-billion-parameter model on these problems, when each group of answers to a prompt has all its test results inverted with a given probability, redrawn on every visit, the score averaged over two late evaluations stays within 1 percentage point of clean training at tested rates up to 20%, and within about 2 points at 30% (abstract). Confidence intervals allow larger losses, and the authors say these estimates set no general tolerance threshold (abstract). They present the work as a study of how the rate and structure of reward noise affect training (abstract).

## Background and terms

**Terms to know:** [reinforcement learning](#/glossary/reinforcement-learning) · [RL with verifiable rewards](#/glossary/rl-with-verifiable-rewards-rlvr) · [GRPO](#/glossary/grpo) · [PPO](#/glossary/ppo) · [LLM-as-a-judge](#/glossary/llm-as-a-judge) · [pass@k](#/glossary/passk) · [multiple testing](#/glossary/multiple-testing) · [equivalence test](#/glossary/equivalence-test-tost)

**The paper's own terms:**
- **RLVR**: the paper also counts rubric and LLM-judge rewards in "semi-verifiable domains" as RLVR (§1), unlike the glossary entry.
- **"error-free"**: passing the supplied tests; "a finite test suite does not establish program correctness on every input" (§3).
- **binary matrix M**: for one prompt, G sampled responses (rollouts) by T unit tests, 1 where a rollout passes; a rollout's reward is its share of passed tests (§3.1).
- **format penalty**: −0.25 for a response without a fenced Python code block, "retained unchanged under corruption" (§3.1). Other responses are **test-scored**; a **mixed group** has both kinds (App. F).
- **noise modes**: flip entries of M with probability p, so false-positive and false-negative rates (FPR, FNR) both equal p: (a) each cell, (b) a rollout's row, (c) a test's column across the group, (d) the whole matrix; redrawn each time a prompt recurs (§3.1, Fig. 1).
- **group-rollout noise**: mode (d), the main sweep (§3.1).
- **advantage vector**: GRPO's group-normalized rewards (App. E, Eq. 1), with a small **normalization stabilizer** η in the denominator (App. F.1).
- **clipping**: GRPO's objective clips each token's new-to-old probability ratio to an interval (App. E, Eq. 2).
- **late-training metric**: a run's validation reward averaged over steps 239 and 259, then over seeds, "without selecting a checkpoint by validation performance" (App. A; Tab. 8). **Peak** scores take each run's best evaluation (§5.1).

**Missing glossary terms:**
- **reward overoptimization**: the scorer's reward rises while true quality, measured separately, falls; the 4B-judge run is "consistent with reward overoptimization (Gao et al., 2023)" (§6.3).

**Builds on:**
- DeepSeek-R1 ([DeepSeek-R1](#/papers/deepseek2025reasoning "DeepSeek-R1: Incentivizing Reasoning Capability in LLMs via Reinforcement Learning (2025)")): RLVR is taken "as a given" (§2); training uses GRPO from DeepSeekMath ([DeepSeekMath](#/papers/shao2024deepseekmath "DeepSeekMath: Pushing the Limits of Mathematical Reasoning in Open Language Models (2024)"); §4).
- Rad et al. (2026, not listed here), reward noise in GRPO on code; this study "adds comparisons across noise structures and model families at finite training budgets" (§2).
- Other noisy-reward RLVR work: Cai et al. (2025; App. M), Spurious Rewards ([Spurious Rewards](#/papers/shao2025spurious "Spurious Rewards: Rethinking Training Signals in RLVR (2025)")), Zhu & Kang (2026), Mansouri et al. (§2).
- Rubric-based post-training with judge rewards (Gunjal et al., 2025; He et al., 2025), which the judge setup "resembles" (§3.2).

## Problem and setting

- **Question:** "under which error structures and training conditions can an imperfect verifier support effective RLVR?" (§1). Coding is chosen because unit tests resemble rubric criteria and its verifiers can be highly accurate (§1).
- **Data:** MBPP (Mostly Basic Python Problems: a description plus three unit tests each), 374 training and 90 validation problems (§4). A preliminary check uses GPQA (graduate-level multiple-choice science questions), training on 250 and validating on 198 (§6.1).
- **Models:** Qwen3 8B and GLM4 9B main, Llama 3.1 8B and Qwen3 4B ablations, trained with GRPO; GPQA uses GSPO (GRPO's group-normalized advantages with sequence-level ratios and clipping) (§4; §6.1; App. E).
- **Seeds:** "Unless otherwise noted, results are from a single seed"; the Qwen3 8B group-rollout sweep has 3–6 per setting (§4).
- **Measured:** validation reward from real tests, "including format penalties", and pass@k requiring all tests (§4).

## Approach

- **Controlled corruption (§3.1).** Noise acts in training only; group-rollout noise is swept up to p = 0.50 (§5.1), and the four modes compared at p = 0.10 (§5.2). An exploratory asymmetric sweep draws two independent group-level decisions, pass-to-fail (FNR) and fail-to-pass (FPR), over a 5 × 5 grid (App. C).
- **Judge rewards (§3.2; App. D.1).** Qwen3-4B or Qwen3-30B-A3B-Instruct-2507 (30B parameters, 3B active per token; 2507 a release tag) gets the code and the tests as assert statements and judges pass or fail, aggregated per rollout. Executed tests label verdicts, giving precision (correct share of "pass" verdicts) and recall (share of real passes accepted).
- **Analysis (§6.2; App. F),** for a fixed prompt, sampled responses and clean outcomes, with the corruption decision as the only randomness (App. F):
  - Under group-rollout noise, in a group without format penalties, the advantages are negated with probability p, so their expectation is the clean one times (1 − 2p) and the expected unclipped gradient stays aligned with the clean one for p < 0.5 (§6.2; App. F.2, Eq. 10), "a property of this particular corruption rule, not a general property of erroneous verifiers" (App. F.2).
  - With penalties retained, even at p = 0.5 mixed groups favour, on average, test-scored responses over penalized ones (App. F.2, Eq. 11).
  - The four symmetric modes give a test-scored response the same expected reward, but since groups are normalized separately, equal expected rewards "do not imply equal expected advantages" (§6.2).
  - Asymmetric, without penalties: advantages are kept, negated or zeroed, and swapping FNR and FPR leaves their distribution unchanged; at equal rates the mean matches the main sweep with half the spread (conditional covariance) (§6.2; App. F.3, Eq. 14–15). With penalties the swap invariance is exact when η = 0 (App. F.3).
  - Outside the clipping interval an extra term breaks the simple scaling, and with Adam and weight decay a scaled expected gradient does not imply a scaled update (App. F.4).
- **Illustration (§6.2, Fig. 4).** A policy sampling 2-D points from a normal distribution around a learned centre, on the Ackley test function (many basins, one global minimum), under additive reward noise.

## Results

- **Group-rollout sweep, Qwen3 8B (§5.1; Tab. 8).** It reports the late-training metric within 1 point of clean at p = 0.05–0.20 and an observed 2.0-point loss at p = 0.30; the 95% interval at p = 0.20 is [−2.9, +1.8] points. Peak scores "show a similar pattern (Figure 2), but include unequal checkpoint-selection opportunities". Performance drops substantially from p = 0.40; at 0.50 format penalties still give a signal.
- **Metric (§5.1; Tab. 6).** At 40% noise peak pass@1 falls to 0.756 while pass@16 matches the baseline: "tolerance depends on the evaluation metric".
- **Noise structure (§5.2; Tab. 1).** At p = 0.10, group-level modes (c, d) give higher recorded best and final rewards than sample-level ones (a, b) for Qwen3 8B and GLM4 9B; "Most comparisons use only 1–2 seeds, so the magnitude and reliability of these differences remain uncertain".
- **Judges (§5.2; §6.3; Fig. 5).** Peak validation reward is 0.871 with the 30B judge and 0.704 with the 4B judge (which peaks early, then declines), against 0.900 clean. Both judges have high recall on their own policy's outputs, the 4B lower precision; "High observed recall alone does not ensure effective training" (§6.3).
- **GPQA (§6.1; Tab. 2).** Peak 0.540 base, 0.600 clean, 0.604 at p = 0.05, 0.603 at p = 0.30, one seed each.
- **Other models.** Llama 3.1 8B's single-seed noisy peaks are nonmonotonic (App. L); Qwen3 4B against 8B "does not establish a model-capacity effect" (Fig. 7).
- **Asymmetric grid (App. C; Tab. 7).** One seed; swapped settings "do not establish a general precision–recall preference".

## Limits the authors state

- "Most replication concerns one model and one resampled corruption process" (§7); 90 validation problems; "seed intervals do not quantify generalization to new problems, and peak selection can be optimistic" (§7). No untouched test set or prespecified non-inferiority margin, a loss small enough to count as no loss (App. A); peak tests "unadjusted for multiple testing" (App. C).
- GPQA changes the optimizer and uses one seed per setting (§7).
- "Pass@k records and exact per-run source revisions are incomplete" (§7); the Qwen3 8B cohort is "a retrospective cohort" (App. A).
- "Retained format penalties confound the separation of formatting and correctness gains" (§7).
- "These controlled experiments do not model persistent verifier blind spots" (§3.1); no "verifier-accuracy threshold, robustness to persistent biases, a general precision–recall preference, or improved generalization from noise" is established (§7).
- Judge metrics come from each judge's own policy outputs, and test-execution judging "need not reproduce the error structure of rubric judgments in other domains" (§3.2); App. F should not be assumed to describe judge rewards (App. D.1).
- Without a correction baseline, they cannot say when correction methods help (§2).

## Open problems and building blocks

- **Open:** "Whether noise also improves generalization through regularization remains untested" (§6.2). Separating false-positive from false-negative effects "would require comparable response distributions and an intervention that separates them" (App. G.2). Findings "motivate assessing verifiers through both aggregate error rates and the reward contrasts they induce within a rollout group" (§7).
- **Released:** "a script that reproduces our numbers with tinker", in a paragraph on base-model evaluation (tinker: a hosted training service), and "accompanying data": seed scores, run records, table-reproduction scripts (App. A). Training uses "an internal training framework built on SLIME" (§4), an RL post-training framework (its cited title).
- **To reuse it:** GRPO, 16 rollouts per prompt (Tab. 3); about 64 H100 GPU-hours per run (§4).
- **Beyond its domain:** GPQA results "suggest that imperfect verification can also support post-training in scientific reasoning", but are "insufficient to establish a common robustness threshold across domains" (§6.1).

## On this site

- **Discussed in:** [Benchmarks with checkable ground truth](#/challenges/checkable_benchmark_ground_truth) · [Weak checkers get exploited](#/challenges/weak_checker_exploitation)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/hacking-general">hacking-general</a><a class="tag sub" href="#/tags/judge-general">judge-general</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/rlvr-general">rlvr-general</a></span>
