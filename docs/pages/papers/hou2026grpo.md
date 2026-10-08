# Prompt Dominance and Asymmetric Verifier Costs: Empirical Ablations of GRPO at 1B Scale on GSM8K

**Prompt Dominance and Asymmetric…** · (GRPO at 1B on GSM8K), preprint 2026

Read: [PDF](https://arxiv.org/pdf/2610.04928) · [arXiv](https://arxiv.org/abs/2610.04928)  
Code: [llm-from-scratch](https://github.com/Helios-YQH/llm-from-scratch)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- A from-scratch GRPO implementation trains OLMo-2-0425-1B on GSM8K with a symbolic-equality grader as the reward, with prompt and learning-rate ablations, one-change estimator variants (Dr. GRPO among them) and off-policy corrections (clipped, unclipped, GSPO); two seeds per configuration except the learning-rate sweep and the verifier study's exact arm (abstract; §2–5; Fig. 2; §6.3).
- Degrades the same grader in two ways, flipping its verdicts at a set rate or keeping only its format check, and measures both uses against the true grader: as the RL reward, and as the best-of-n selector over a fixed pool of base-model samples (§6.1–6.2). The author argues that symmetric flip noise is an affine transform of the expected reward, which the group-normalized advantage and Adam cancel exactly, leaving a second-order variance cost (§6.3); the cancellation does not hold for the realized rewards.
- In the author's 1B GSM8K setup, a noisy or wrong reward costs RL training less than test-time selection (<a class="tag" href="#/tags/hacking">hacking</a>, <a class="tag" href="#/tags/scaling">scaling</a>): the author reports that the 10% flip rate costs best-of-32 selection 43% of its attainable gain and RL nothing measurable, while a format-only reward is maximized with accuracy far below the exact arm (abstract; §6.2–6.3). The RL side rests on a single-seed exact arm and the 30% flip arm was evaluated only on the validation split (§6.3 caveats; §8).

## In plain words

In reinforcement learning (RL) on math problems, a program that checks the final answer supplies the reward, and a checker can also pick one of several sampled answers at test time; the author notes these two uses "are usually studied separately" (§1). The author trains a 1-billion-parameter base model on grade-school math word problems with a from-scratch implementation of GRPO, an RL algorithm for language models, in controlled ablations. The prompt decides whether training can work: under a zero-shot prompt the base model's sampled answers are right 0.08% of the time, so almost nothing can be learned, against 18.3% with three worked examples (abstract; Tab. 1). A checker that flips 10% of its verdicts leaves RL 91% and 106% of the exact checker's gain (two seeds, against a single exact-checker run), while picking the checker's top answer among 32 base-model samples keeps 57% of its possible gain (abstract; §6.3). The paper calls itself "an implementation and replication study" (§1) and claims, "to our knowledge", the first direct comparison of the two uses under the same degradation (§7).

## Background and terms

**Terms to know:** [GRPO](#/glossary/grpo) · [RL with verifiable rewards](#/glossary/rl-with-verifiable-rewards-rlvr) · [best-of-N sampling](#/glossary/best-of-n-sampling) · [self-consistency (majority voting)](#/glossary/self-consistency-majority-voting) · [pass@k](#/glossary/passk) · [importance ratio and clipping](#/glossary/importance-ratio-and-clipping) · [reward hacking](#/glossary/reward-hacking) · [greedy decoding and temperature sampling](#/glossary/greedy-decoding-and-temperature-sampling)

**The paper's own terms:**
- **verifier / grader**: a symbolic grader for GSM8K (a set of grade-school math word problems) that takes the answer from a `\boxed{}` or the final line, checks symbolic equality with the reference, and separately reports whether the `</think> <answer>` format is present (§2).
- **exact, noisy and format-only verifiers**: the grader as is; the grader with each verdict inverted with probability ε, the flip rate; and a reward of 1 whenever the answer tags are present, the answer never checked (§6, App. A.3).
- **arm**: one configuration in a sweep, e.g. "the exact arm" (§6.2).
- **zero-variance group**: GRPO scores 8 answers per question; when all get the same reward, the group gives no gradient and is pruned (§3.1, §3.2).
- **standard estimator**: GRPO that normalizes each sequence's loss by its length and divides the group's advantages by their standard deviation (§4; settings in Tab. 2).
- **two decoding protocols**: every checkpoint is scored greedily (temperature 0) and by sampling (temperature 1.0); the sweeps of §4–5 use greedy accuracy, comparisons with the prompting baselines sampled accuracy (§2).
- **coverage ceiling**: pass@n over the fixed sample pool (Fig. 6).
- **attainable gain, retained fraction**: for selection, best-of-32 minus the base rate (accuracy without selection, Fig. 6), over the ceiling minus the base rate; for RL, the trained arm minus the same-protocol prompting baseline, over the exact arm minus that baseline (Fig. 8).
- **affine transform**: multiplying by a constant and adding a constant (§6.3).

**Missing glossary terms:**
- **off-policy training (stale data)**: updating the model on samples drawn by an earlier version of itself; here one [rollout](#/glossary/reinforcement-learning) batch (one step's sampled responses) is consumed as 32 successive optimizer steps, so the last step's data is 32 updates old (§5).

**Builds on:**
- GRPO from Shao et al. [11] ([DeepSeekMath](#/papers/shao2024deepseekmath "DeepSeekMath: Pushing the Limits of Mathematical Reasoning in Open Language Models (2024)")), which "introduced the group-relative advantage used throughout this paper" (§7).
- The objective variants it tests (§7): dropping the standard-deviation division, from Liu et al. [9] (Dr. GRPO); constant loss normalization, from Yu et al. [14] (DAPO); sequence-level importance ratios (one ratio per whole response, not per token; §5), from Zheng et al. [15] (GSPO), none on this site; rejection-sampling-style updates, from Lambert et al. [7] ([Tülu 3](#/papers/lambert2024tulu "Tulu 3: Pushing Frontiers in Open Language Model Post-Training (2024)")).
- Verifiers (§7): re-ranking with trained verifiers, Cobbe et al. [3] ([GSM8K and trained verifiers](#/papers/cobbe2021verifiers "Training Verifiers to Solve Math Word Problems (2021)"), also cited for GSM8K, §2); reward-model over-optimization, "a proxy reward going up while the true objective falls", Gao et al. [4] ([Scaling Laws for Reward…](#/papers/gao2022overoptimization "Scaling Laws for Reward Model Overoptimization (2023)")).
- Test-time selection (§7): the "large language monkeys" effect of Brown et al. [1] ([Large Language Monkeys](#/papers/brown2024monkeys "Large Language Monkeys: Scaling Inference Compute with Repeated Sampling (2024)")): "repeated sampling with selection converts coverage into accuracy".

## Problem and setting

The paper asks "what estimator choices do to the learning signal, and what a degraded reward signal does to what is learned" (abstract), and whether training and test-time selection degrade unequally under one faulty verifier at 1B scale (§1).

- **Model and data:** OLMo-2-0425-1B, a 1B-parameter base model, trained on 6,400 GSM8K training questions, 1,024 more held out for validation, and evaluated on the 1,319-question test split (§2).
- **Correct** means the exact grader's verdict; all evaluation uses it, "never the training reward" (§2).
- **Budget:** 200 rollout steps for the standard run, 80 for everything else; each step samples 32 questions × 8 answers; two seeds per configuration (§2), except the exact arm of the verifier study (§8). The 3-shot prompt is used throughout, except in the prompt ablation (§3.1, §3.4).
- **Selection pool:** 512 GSM8K questions × 32 base-model samples with the 3-shot prompt, generated once (§6).

## Approach

- **Implementation (§2):** log-probabilities, advantage, clipped objective, aggregation and training step are the author's own code; vLLM (an LLM serving engine) generates rollouts and receives the updated weights before every batch.
- **Sweeps (§3–5):** a standard run (§3.2), a learning-rate sweep (§3.3), the bare-question prompt under RL (§3.4); four one-change estimator variants (§4): `grpo_constant` (constant instead of length normalization), `dr_grpo` (also drops the standard-deviation division), `rft` (also drops the group baseline), `maxrl` (divides by the group mean instead); four off-policy schemes (§5): `naive` ignores the staleness, `noclip` weights each token by the unclipped importance ratio, `clip` is GRPO's clipped objective, `gspo` uses a sequence-level ratio with a much tighter range.
- **Verifier study (§6):** each degraded verifier serves as the selector over the fixed pool (§6.1) and as the reward for 80-step training runs scored by the exact grader (§6.2).
- **Mechanism (§6.3):** first, RL averages the noise over each group of 8, the groups of a step and the steps, while selection keeps one top candidate, "an order statistic, and one whose sensitivity grows with n" (the pick is the top-ranked of n candidates, here 32, so one flip near the top can change the winner). Second, under symmetric flips the expected reward is an affine transform of the true one (Eq. 1); GRPO's advantage is unchanged by any positive scaling plus shift, and the update of Adam (the optimizer) by a global rescaling of the gradient. So, the author argues, "the first-order effect of the closed form is neutralized exactly by the estimator's normalization: what remains is the per-sample variance the flips inject, which is second order" (the closed form is Eq. 1 and the expected-gradient scaling by 1 − 2ε that follows; first-order is that scaling and shift, second order the random scatter flips add to each reward). The prediction: if the residual cost is that variance, a 30% flip rate should retain markedly less than the 10% arm.

## Results

- **Prompt (§3.1, Tab. 1):** 0.08% zero-shot against 18.27% 3-shot; a large fraction of well-formed zero-shot responses are "degenerate continuations of the pretraining distribution", and essentially every group has zero reward variance. Under RL the bare-question prompt barely moves, its seeds far apart (§3.4, Fig. 3).
- **Standard run (§3.2, Fig. 1):** sampled accuracy goes from 0.214 and 0.229 to 0.470 and 0.503 (two seeds, 200 steps), with longer responses. [Policy entropy](#/glossary/policy-entropy) falls fast, then holds, "low enough to be a concern but not collapse".
- **Learning rate (§3.3, Fig. 2):** the highest rate peaks and then falls, "divergence rather than the tail of a plateau"; the lowest is still climbing at step 80.
- **Estimator variants (§4, Fig. 4):** only Dr. GRPO beats the standard run's 80-step value (seed 0) on both seeds, by about the seed spread; "At this scale and horizon the normalization and baseline choices do not matter much" (§4).
- **Off-policy (§5, Fig. 5):** `clip` and `gspo` match the on-policy reference; `naive` and `noclip` lose 3.5–6.3 points (rounded to 4–6 in the abstract); "clipping is load-bearing, not decoration".
- **Selection (§6.1, Fig. 6):** with the exact verifier best-of-32 reaches the coverage ceiling; majority voting is above the base rate but far below it; at a 50% flip rate, and format-only, selection is no better than not selecting.
- **Training with weak verifiers (§6.2, Fig. 7):** the 10%-flip arm keeps 91% and 106% of the exact arm's gain over the 3-shot baseline, format-only 30% and 16% while reaching near-maximal reward: "The model optimizes exactly what the reward measures".
- **Asymmetry (§6.3, Fig. 8):** at 10% flips selection loses 43% of its attainable gain, RL "nothing measurable".
- **30% flips (§6.2):** at step 60 on the validation split, the two seeds retain 61% and 83%, against 99% at 10%, in the predicted direction.
- **Protocol trap (§2):** scoring validation with the training reward made format-only arms report their format rate as accuracy: "the apparent reward-hacking curves were an artefact of the evaluation wiring".

## Limits the authors state

- 1B parameters and grade-school arithmetic, "so nothing here is a scaling result" (§8).
- Two seeds, one for the verifier study's exact arm; "differences below a few points are not resolved by them" (§8); the RL retained fractions' denominators carry no seed variance (§6.3 caveat (i)).
- 80- or 200-step runs, some still improving: "snapshots rather than converged values" (§8).
- The verifier is a program with an injected failure mode, which "leaves open how much of it carries over to a learned reward model with correlated errors" (§8); "the claim we take from them is the ordering between the two uses" (§6.3 caveat (iii)).
- Selection and RL use different sets: compare retained fractions, not levels (§6.3 caveat (ii)).
- The 10% result is a single noise level (§6.3 caveat (iv)); the 30% arm lacks a test-set evaluation after an infrastructure failure, and one 10%-flip seed is usable on the validation split (§6.2, §8).

## Open problems and building blocks

- **Open:** None stated as future work; the 30% comparison is "a first test of its central prediction" (§9).
- **Released:** "The implementation, the run records behind every number, and the scripts that render the figures" (§1 "Code and data"); prompts verbatim (App. A.1); settings (App. A.2, Tab. 2–3).
- **To reuse it:** one node with 6 RTX A6000 GPUs (48 GB), one trainer and one rollout GPU per job; about 100 GPU-hours for the reported runs (§2).

## On this site

- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/hacking-general">hacking-general</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/rlvr-general">rlvr-general</a><a class="tag sub" href="#/tags/scaling-general">scaling-general</a></span>
