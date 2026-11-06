# Measuring all the noises of LLM Evals

**Measuring all the noises of LLM Evals** · preprint 2025 (v3)

Read: [PDF](https://arxiv.org/pdf/2512.21326) · [arXiv](https://arxiv.org/abs/2512.21326)  
Code: [eval-arena](https://github.com/all-the-noises/eval-arena)

<p class="notice">A summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Splits the noise of an LLM eval into prediction noise (different answers to the same question), data noise (which questions were sampled) and their total, by the law of total variance, and proposes "all-pairs comparison": paired comparison on every pair of models, measuring all three components (abstract; §1; §3.1; §4.2).
- Measured on question-level results from public leaderboards (SWE-bench Verified, one prediction per question) and from controlled sampling (MATH500 with about 1000 predictions per question, CRUXEval at two temperatures) (§1, Fig. 1; §5.1.1; §5.1.2, Fig. 4); the estimators are checked against the bootstrap and the sign test (App. E) and on simulated data with known variances (App. F), and a Beta(p, 1−p) model predicts the paired prediction variance from accuracy, which the authors report agrees with the measured total noise (§5.1.3; §5.1.2, Fig. 1; App. B).
- How large a difference between two LLM methods a checked eval can show (<a class="tag" href="#/tags/stats">stats</a>): the author reports that most evals have a predictable total paired noise (narrowed in v3's abstract and §1; v2 said each eval, as v3 §3.1 still does), close to the rule of thumb Var[A−B] ≈ EA (§1), and that prediction noise usually exceeds data noise, so pairing and averaging several samples per question detect much smaller differences; on HumanEval he puts the difference needed for p < 0.05 at 11% unpaired against 2–4% paired with averaging (§3.1, Example 2). All its data are from correctness evals (§6.5).

## In plain words

Part of any benchmark score gap between two LLMs is luck. The author separates prediction noise (a model gives different answers to the same question when sampled again) from data noise (the questions are one sample out of many possible ones); together they make the total noise (abstract; §3.1). His motivation: leading evals "often ignore data noise, have low statistical power, or make unnecessary trade-offs" (abstract). His all-pairs comparison applies paired comparison to every pair of models on the same questions and measures all three noises, on millions of question-level predictions (abstract). He reports that "most evals exhibit a characteristic and highly predictable total noise level across all model pairs", and that paired prediction noise "typically exceeds" paired data noise, so averaging answers per question "can significantly increase statistical power" (abstract). On HumanEval (164 programming questions), for typical model pairs near half accuracy, the gap needed for significance at the 5% level falls from 11% without pairing to 2–4% paired with averaging (§3.1, Example 2).

## Background and terms

**Terms to know:** [bootstrap resampling](#/glossary/bootstrap-resampling) · [sign test](#/glossary/sign-test) · [statistical power](#/glossary/statistical-power) · [greedy decoding and temperature sampling](#/glossary/greedy-decoding-and-temperature-sampling) · [self-consistency (majority voting)](#/glossary/self-consistency-majority-voting) · [standard error](#/glossary/standard-error) (over N questions; §4.1) · [law of total variance](#/glossary/law-of-total-variance) (here data + prediction noise; §1; §4.2) · [z-score](#/glossary/z-score) (§4.1; App. E) · [central limit theorem (CLT)](#/glossary/central-limit-theorem-clt) (§4.1) · [Beta distribution](#/glossary/beta-distribution) (a smaller sum "means more bimodal"; App. B)

**The paper's own terms:**
- **prediction noise**: from "generating different answers on a given question with the same model"; the per-question variance across samples, averaged over questions (§3.1; §4.2). Choices such as prompt formatting or training seeds add to it (§3.1).
- **data noise**: from which questions were sampled; the variance across questions of each question's expected score. It "cannot be directly measured by evaluating on the fixed, given set of questions; and it cannot be reduced" (§3.1).
- **total noise**: data plus prediction noise (§1; §4.2). **Noise** means variance or standard error "when there is no need to distinguish" (§4.1).
- **paired comparison**: the variance of the per-question score difference between two models on the same questions; correlation between them shrinks it (§3.1; §4.1).
- **all-pairs comparison**: the paired standard error for every pair of models; "the total noise is always measured", the data and prediction noises when there are several predictions per question (§3.1).
- **expected metric**: the score averaged over many samples per question; contrasted with the "best prediction metric" (e.g. majority vote) and the "one prediction metric" (App. C.1, Example 8).
- **Beta theory**: each question's expected accuracy is drawn from Beta(p, 1−p), p being the model's mean accuracy (§5.1.3; App. B).
- **rule of thumb**: for many evals, the variance of the paired difference is about EA, E[A] being one model's accuracy (§1).
- **small-K correction**: a bias correction for data variance estimated from K samples per question (App. A.2).

**Builds on:**
- Miller (2024), "Adding Error Bars to Evals": "adopt the approach of Miller (2024) to estimate the variance directly" (§2).
- The bootstrap (Efron, 1979) and the sign test (Dixon and Mood, 1946), shown to give the same answer as the variance method (App. E).
- Noise measured "across runs" (Merrill et al., 2026) or random seeds (Madaan et al., 2024) on one eval "necessarily ignores the critical data noise"; Llama 3's unpaired Bernoulli confidence intervals, "much looser than paired comparison" (§2; Examples 1–2).
- Chatbot Arena (Chiang et al., 2024), a model-comparison leaderboard, and CRUXEval (Gu et al., 2024), a code-reasoning benchmark: per-model error bars through "ELO or a reference model, which is necessarily lossy" (Example 4; §2); the project's start "is inspired by Chatbot Arena" (Acknowledgments).

## Problem and setting

- **Question:** how large are the three noises for all pairs of models, and do they follow patterns usable for a whole table of results (§1)? Data noise counts because on most evals "we care about the underlying ability estimated by the eval rather than the specific questions in the eval" (§3.1).
- **Setting:** a metric "typically 0 for incorrect and 1 for correct but can be a real number or an aggregate metric" (§4.1); K predictions per question, the sampling seed independent of the question (§4.2); the CLT is used when "N > 100 is moderately large" (§4.1).
- **Data:** SWE-bench Verified (a coding-agent benchmark, "N = 500", Fig. 2): leaderboard submissions, "the leaderboard data, which had to commit to single answers" (§5.1.1; Fig. 1, Fig. 3), and training checkpoints of two runs from one starting checkpoint (Fig. 2; Example 3b); MATH500 (math problems), "Around 1000 samples" per question and model (§5.1.1); CRUXEval at temperatures 0.2 and 0.8 (Fig. 4); HumanEval, "N = 164 questions" (Example 2); pairs of training seeds on nq (Natural Questions, open-domain question answering) and hellaswag (commonsense sentence completion) (Fig. 6). The paper doesn't list the models.

## Approach

- **Decomposition:** the law of total variance, for one model and for the paired difference (§1; §4.2).
- **Estimators:** formulas as if using all pairs of collected predictions, with a small-K correction (a per-question bias would otherwise not shrink with more questions) and a correction for comparing a model with itself (App. A.2); numpy-style code in Tab. 1 and Tab. 2 (App. A.3). Prediction noise taken as the spread of K whole-eval reruns (Example 1) is far noisier than from question-level results (App. A.1).
- **All pairs:** one error bar per model is "not in general possible"; plotting every paired comparison lets one "check if meaningful error bars per model is possible, identify any surprises, and see any statistical claims in context" (Example 4).
- **Beta theory** (App. B): if per-question expected accuracy follows Beta(p, 1−p), both models answer each question correctly with that same probability, and their predictions are drawn independently, the paired prediction variance, averaged over questions, is p(1−p).
- **SE against difference** (§5.1.4, Fig. 5): paired SE plotted against the accuracy difference shows "exactly which pairs are significant".
- **Checks:** variance method, bootstrap and sign test "give the same answer", with "A slight approximation" on the sign test (App. E); estimator tests on simulated data with known variances (App. F).
- **Recommendations** (§6.1): eval and leaderboard builders run the all-pairs comparison, or release question-level results, "ideally with multiple predictions per question"; experimenters use, in increasing accuracy and cost, the rule of thumb, the paper's curves, or the estimators. Several evals are combined through weighted per-eval z-scores (App. D).

## Results

- **Predictable total noise:** on SWE-bench Verified and MATH500 the paired total SE follows accuracy and the Beta theory (Fig. 1; §5.1.2); the Beta model fits per-question accuracies, and better models are more bimodal (Fig. 8).
- **Prediction > data noise:** on MATH500 the data SE is "typically less than 1/2 of the prediction SE between different final models" (§3.1). On SWE-bench Verified training curves from one checkpoint, the data SE is about 1/6 of the prediction SE, so averaging 36 predictions would let one detect effects "0.24 the size" at the same p-value and power (§3.1).
- **Training curves** (Fig. 2): paired bootstrap z-score 1.7 at one prediction per question against 3.5 averaged over 5 checkpoints; the unpaired bootstrap shows "a meaningless difference".
- **HumanEval** (Example 2): difference needed for p < 0.05 of 11% unpaired, 8% unpaired with averaging, 8% paired, 2–4% paired with averaging, "between typical pairs of LLMs".
- **Temperature:** on CRUXEval prediction noise dominates at 0.8 and data noise at 0.2, "while both still have similar total noise" (Fig. 4); at temperatures from 0.7 to 1 prediction noise tends to exceed data noise across evals (§5.1.2).
- **Question level:** similar-accuracy models do similarly per question (Fig. 3).
- **Training seeds** (Example 5, Fig. 6): the variance due to training seeds "does not correspond to the statistical standard"; "The eval nq produced more significant results than the null hypothesis whereas hellaswag produced even less than the null".
- **Estimators:** "reasonable accuracy" on paired total and prediction variance; "The data variance is the hardest to estimate", where the small-K correction is critical (App. F; Fig. 7).

## Limits the authors state

- "all the empirical data are from correctness evals, so how well the empirical findings generalize to other evals remains to be tested" (§6.5).
- "Currently, we did not consider the potentially impactful clustered correction of Miller (2024)" (§6.5).
- The all-pairs approach "can be inconclusive in general" (§3.1; Example 4).
- Even at low temperature, where data noise exceeds prediction noise, total noise follows the Beta prediction, "except for chain-of-thought predictions" (§6.4).
- "In theory, the prediction noise can still be arbitrarily small" (§6.4); the training curve ignores data noise, which in theory "can be much higher than the prediction noise" (Example 3a).
- Averaging is recommended for most controlled experiments "not expected to have a large effect on the eval" that "do not target the eval specifically"; caveats come with majority voting or a reliable verifier, or a change in "sharpness" (sharpening "can lead to much better expected accuracy" on a good-enough model), and "an independent standard of effect size is also needed" (App. C.1, Examples 6–8).
- Exceptions (App. C.2): near random chance on guessable evals such as MMLU (multiple-choice), noise is "closer to the independent prediction rather than the Beta prediction" (Fig. 1's indep. theory curve); SWE-Fixer, an LLM system for GitHub issues, gives outliers by using "a deterministic filter"; Llama on vLLM (an inference engine) is "more deterministic than expected", "likely due to faulty settings"; distilled models "tend to have less sharp distribution at the same performance level".

## Open problems and building blocks

- **Open:** "More data is needed to further test if this continues to hold, and if low temperature can reduce prediction noise as the model is training" (§6.4). "Large prediction noise has impact on modeling question difficulty using the Item Response Theory (IRT) or filtering questions" (§6.4). "If we continue in the direction of smaller and harder evals, we probably need to also generate more information per question" (§6.2).
- **Released:** "Interactive results based on 100k+ model pairs" on a website (§1, footnote 1; §5).
- **To reuse it:** question-level scores of each model on the same questions; several predictions per question to split the noises (§6.1); a moderately large N (App. F); the small-K correction (App. A.2).

## On this site

- **Discussed in:** [Comparing LLM methods under noise](#/challenges/method_comparison_under_noise)
- **Tags:** <span class="tags"><a class="tag" href="#/tags/code">code</a><a class="tag" href="#/tags/llm">llm</a><a class="tag" href="#/tags/math">math</a><a class="tag" href="#/tags/method">method</a><a class="tag" href="#/tags/stats">stats</a><a class="tag" href="#/tags/study">study</a></span>
