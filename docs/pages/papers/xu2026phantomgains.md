# Phantom Gains: Auditing Self-Improvement Against a Measured Null

**Phantom Gains** · preprint 2026 (under review, venue not named)

Read: [PDF](https://arxiv.org/pdf/2608.20290) · [arXiv](https://arxiv.org/abs/2608.20290)  
Code: [phantom-gains](https://github.com/chengxuphd/phantom-gains)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Audits per-problem claims about self-improvement (which problems a model learned, lost or newly reached) by passing a frozen, untrained model through the same pipeline as every trained arm, so that any transition the frozen model shows is a measurement artifact (abstract; §3).
- Self-training on Qwen3-8B with LoRA, as STaR, majority-vote SFT in the manner of TTRL and a policy-gradient arm, against Distillation into compact models from a stronger model as a positive control, on MATH-500, AIME 2025–2026 and a band of MATH problems, with answers checked by symbolic equivalence (§3; §5). It names seven measurement failures (§4, Tab. 1) and replaces thresholded expansion counts by a per-problem Fisher exact test against a pooled baseline under FDR control (§4.2).
- Measured nulls for comparing training methods on checked answers: the authors report that the expansion statistic in current use gives the frozen model a rate of 0.280 (abstract; §4.2). With the controls, they find Distillation into compact models, but not self-training, improving problems the base model rarely reaches, and the evidence on problems it never reaches inconclusive (abstract; §5).

## In plain words

Self-improving models are increasingly judged by which problems they gain and lose; the authors argue each such change is a difference of two noisy estimates and so open to measurement artifacts (abstract; §1). They fine-tune Qwen3-8B, an open 8-billion-parameter model, for three rounds under self-training methods and a Distillation into compact models control, and push an untrained copy through the same pipeline: whatever it shows is noise, a measured "null". They name seven measurement failures, "each of which inverts a reported finding when its control is absent" (abstract). The rule in current use for counting newly reached problems gives the untrained model a rate of 0.280 on AIME; requiring two successes still leaves a null of 0.058 over all their untrained comparisons (§4.2). They replace the rule with a per-problem test against pooled untrained runs. With it, on AIME with arms matched in stream, volume and evaluation, Distillation into compact models improves 8–11 of 22 rarely reached problems per seed, against 0–2 for three forms of self-training; on never-reached problems the evidence is inconclusive (§1; §5). They present an audit and reporting standard (§1; §6).

## Background and terms

**Terms to know:** [pass@k](#/glossary/passk) · [LoRA](#/glossary/lora-low-rank-adaptation) · [self-consistency](#/glossary/self-consistency-majority-voting) · [Distillation into compact models](#/glossary/distillation) · [greedy decoding](#/glossary/greedy-decoding-and-temperature-sampling) · [policy gradient](#/glossary/policy-gradient) · [multiple testing](#/glossary/multiple-testing) · [statistical power](#/glossary/statistical-power)

**The paper's own terms:**
- **transition ledger**: puts each problem in one of seven categories across checkpoints; **learned** means unsolved at the base checkpoint and solved at the last, **corrupted** the reverse (§3 "The ledger", Eq. 1).
- **corruption-to-learning ratio (CLR)**: corrupted over learned; above one, a method "removes more capability than it adds, whatever happens to mean accuracy" (§3, Eq. 1).
- **solve rate with hysteresis**: the share of 128 samples correct; after the base checkpoint, a problem changes state only when it leaves [0.41, 0.59] (§3, Eq. 2). Not the "difficulty band" benchmark.
- **sharpened / expanded**: a newly solved problem the base model solved at least once in its samples is sharpened; one it never reached is expanded (§3).
- **expansion rate ER_m**: the share of base-unreached problems where the trained model has at least m correct samples; prior work uses m = 1 implicitly (§3, Eq. 3).
- **frozen control (no-op control, floor, null)**: an untrained copy evaluated at every checkpoint, every statistic computed as for a trained model; each transition it shows "is an artifact by construction" (§3). **Design-matched**: with as many checkpoints as an arm (§5).
- **pooled baseline**: every arm's checkpoint 0 is another evaluation of the untrained model; AIME has eleven, 1,408 samples per problem (§4.2).
- **low-base problems**: the 22 AIME problems the pooled baseline reaches at most five times; 10 never (§3 "Benchmarks").
- **matched ladder**: AIME arms on one shared stream at matched volume, varying only the correctness filter (§5; Tab. 2).

**Missing glossary terms:**
- **false-discovery-rate (FDR) control**: a multiple-testing rule bounding the expected share of false detections among all detections (§4.2; App. D.1).
- **Fisher exact test**: an exact test of whether two success rates differ, from the success and failure counts of two groups (§4.1, §4.2; not defined in the paper; general definition).

**Builds on:**
- Mayilvahanan et al. (2026), MATH-Beyond, a benchmark for whether RL expands beyond the base model, which "supplies the expansion statistic we audit" (§2).
- The sharpening account of Huang et al. (2025) ([Self-Improvement in Language Models](#/papers/huang2024sharpening "Self-Improvement in Language Models: The Sharpening Mechanism (2025)")) and Yue et al. (2025) ([Does Reinforcement Learning Really…](#/papers/yue2025rlreasoning "Does Reinforcement Learning Really Incentivize Reasoning Capacity in LLMs Beyond the Base Model? (2025)")), with which the result "aligns" (§1).
- The audited STaR (Zelikman et al., 2022; [STaR (Self-Taught Reasoner)](#/papers/zelikman2022star "STaR: Bootstrapping Reasoning With Reasoning (2022)")), fine-tuning on its samples with correct answers, and TTRL (Zuo et al., 2025), RL on a majority-vote reward (§3).
- Concurrent: Strozzi (2026) ([Teacher-Free Self-Training Amplifies but…](#/papers/strozzi2026selftraining "Teacher-Free Self-Training Amplifies but Does Not Compound: A Pass@$K$ Crossover on a Free-Verifier Domain (2026)")), which they read their result as replicating, and Yuan et al. (2026), whose per-problem tracking is "structurally our ledger" (§2).

## Problem and setting

What would an untrained model also show, and what survives a measured null (abstract; §3)?

- **Training:** Qwen3-8B with rank-32 LoRA, three rounds of 256 stream problems (§3).
- **Arms:** STaR; majority-vote SFT "in the manner of TTRL" (fine-tune on samples agreeing with the vote); Distillation into compact models from gpt-oss-120b, an open 120B model, filtered like STaR; a policy-gradient arm with the vote as reward (§3; §5). TTRL-style training on the test set is only an "unmatched baseline" (§3).
- **Benchmarks:** MATH-500 (competition math, subsampled to 200, "thoroughly contaminated": likely in training data); AIME 2025 and 2026 (60 problems; the 2026 half post-dates the model's cutoff); a "difficulty band" of 1,163 MATH training problems with middling solve rates, so corruption is observable; its counts are "not a forgetting rate for a natural distribution" (§3; App. B).
- **Correctness:** the final answer, compared by symbolic equivalence with the Math-Verify library; truncated completions count as wrong (App. A.2). Per problem and checkpoint, 128 samples at temperature 0.8 plus one greedy sample (§3).
- **Scope:** "every claim below is about what a stated sampling budget reaches, not about the support of the base distribution" (§3).

## Approach

- **A measured null for every statistic,** per benchmark, with an interval and matched checkpoints (§3; Fig. 1).
- **Seven failures, F1–F7,** each with its would-be conclusion and control cost (Tab. 1); F7 "arises inside the correction for the second" (§4).
- **Threshold-free expansion test:** per AIME problem, a one-sided (testing only for a rise) Fisher exact test of the arm's final count out of 128 against the pooled untrained count out of 1,408, with FDR control at 0.05 over the 60 problems; its null holds out one base evaluation as the "after" (§4.2; Tab. 19).
- **Bigger gain or different kind?** A logistic model (a regression on the log-odds of a correct sample) with terms for arm, base-rate group and their interaction (§5; Tab. 15).

## Results

Authors' claims; brackets are 95% intervals.

- **F1:** one greedy decode per problem makes an untrained model appear to learn and corrupt problems, mostly through inference batching; a single-decode ledger "has to be replaced by an estimator" (§4.1; Tab. 11).
- **F2, F7:** at m = 1 the frozen AIME control "expands" 7 of 25 unreached problems, 0.280 (§4.2). At m = 2 the null is zero on that one comparison but 0.058 [0.038, 0.078] over 110 frozen comparisons, against 0.048 measured for majority-vote self-training, "indistinguishable from its own null" (§4.2; Tab. 20). Calculating this null instead of measuring it would have certified the same false repair (§6; Tab. 17).
- **Replicates:** with four baselines (a three-arm study's count), the null still ranges 0.022–0.098; only at nine does it stay within ±0.02 of the eleven-baseline value (§4.3; Tab. 18).
- **Exact test:** zero detections on all eleven held-out replicates; unchanged across testing rules, pool sizes and error rates (§4.2; Tab. 14, Tab. 16).
- **Dissociation:** on the matched ladder, Distillation into compact models detects 8–11 low-base problems per seed, each self-training arm 0–2 (§5; Tab. 2). The teacher moves low-base problems a further β = 1.91 [1.25, 2.56] log-odds beyond its overall lift, p < 10⁻⁸, against 0.21 [−0.60, 1.03] for majority-vote SFT (§5; Tab. 15). On never-reached problems the difference is not significant, "so the claim is about rarely-reached problems and not about expansion" (§1). Every problem self-training newly solved was already reachable (§5).
- **Corruption:** on the band, STaR corrupts 106 problems and majority-vote SFT 88, against a design-matched floor median of 8, while STaR's mean accuracy rises; many drops exceed every solve-rate change the frozen model showed in twenty comparisons (§5; Tab. 7, Tab. 23).
- **F3:** the distilled student adopts its teacher's verbosity and hits the token cap, so a fixed cap scores what is, on finished completions, "the most effective method tested, not the most destructive" as most destructive (App. C.3; Tab. 4).
- **F4–F6:** a 112-problem pilot cannot resolve the method comparison (App. C.3); across seeds majority-vote self-training lands on both sides of a ratio of one: "a majority-vote method's outcome is not determined by its design alone" (§4.3; Tab. 13); a 10-prompt refusal probe shows a safety drop that 50 prompts dissolve (App. D.4).
- **Policy gradient:** collapses into unbounded repetition on AIME on all three seeds, on one while its vote grew more accurate (§5; App. A.3).
- **Reporting standard:** a matched frozen control with an interval per statistic, a solve-rate estimator, a pooled-baseline test, logged generation length, a prior power analysis, three or more seeds (§6).

## Limits the authors state

- Three rounds, roughly 270 optimizer steps: "what we establish is that this regime does not expand, not that self-training cannot" (§6 "Limitations"). Expansion rests on 22 low-base problems on one benchmark, "enough for the dissociation to be significant, not to be precise", and not significant on the 10 never reached (§6; App. E.3).
- The band comes from MATH training problems "almost certainly" in pretraining data, so corruption "may in part be the perturbation of memorized answers rather than of reasoning" (§6; App. E.3).
- One backbone family: "We therefore state cross-backbone generalization as untested"; extra band seeds used a 175-problem subsample (App. E.3).
- The Distillation into compact models control is matched, but "teacher capability and verbosity necessarily still differ"; the stream is far easier than AIME, and for curriculum-generating methods "our null does not speak to them" (App. E.3).
- The method ranking moves with the discretization rule and seed, so "we rest nothing on the between-method comparison" (§5; App. C.2). The refusal probe gives only a bound, scoped to its refusal-marker rule (§5; App. D.4).
- Separating reward from step size in the collapse "needs a learning-rate sweep we did not run" (App. A.3).

## Open problems and building blocks

- **Open:** their account of corruption, needing both unreliable supervision and prior competence, "is testable, predicts that the corrupting regime is a moderately competent model rather than a weak or a strong one" (App. E.1).
- **Released:** per-problem count records for every run, with code that recomputes every number and figure; evaluation subsets; noise-floor runs; the reimplemented methods; per-sample records "are available on request" (Reproducibility Statement); the refusal probe (App. D.4).
- **To reuse it:** Tinker, "a hosted LoRA training and sampling service" (Reproducibility Statement), Qwen3-8B, gpt-oss-120b and Math-Verify; the study cost $3,171 over 48 runs, mostly for sampling (App. A.4, Tab. 6).

## On this site

- **Tags:** <span class="tags"><a class="tag" href="#/tags/stats">stats</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/rlvr-general">rlvr-general</a></span>
