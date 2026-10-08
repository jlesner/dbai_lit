# Measuring all the noises of LLM Evals

**Measuring all the noises of LLM Evals** · preprint 2025 (v2)

Read: [PDF](https://arxiv.org/pdf/2512.21326) · [arXiv](https://arxiv.org/abs/2512.21326)  
Code: [eval-arena](https://github.com/all-the-noises/eval-arena)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Splits the noise of an LLM eval into prediction noise (different answers to the same question), data noise (which questions were sampled) and their total, by the law of total variance, and proposes the "all-pairs paired method": paired analysis on every pair of models, measuring all three components (abstract; §1; §2.1; §3.2).
- Measured on question-level results from public leaderboards (SWE-bench Verified, one prediction per question) and from controlled sampling (MATH500 with about 1000 predictions per question, CRUXEval at two temperatures) (§1, Fig. 1; §4.1.1; §4.2, Fig. 4); the estimators are checked against the bootstrap and the sign test (App. E) and on simulated data with known variances (App. F), and a Beta(p, 1−p) model predicts the paired prediction variance from accuracy, which the authors report agrees with the measured total noise (§4.2.1; §4.2, Fig. 1; App. B).
- How large a difference between two LLM methods a checked eval can show (<a class="tag" href="#/tags/stats">stats</a>): the author reports that each eval has a predictable total paired noise, close to the rule of thumb Var[A−B] ≈ p(1−p) (§1), and that prediction noise usually exceeds data noise, so pairing and averaging several samples per question detect much smaller differences; on HumanEval he puts the difference needed for p < 0.05 at 12% unpaired against 2–4% paired with averaging (§2.1, Example 1). All its data are from correctness evals (§6.5).

## In plain words

Part of any benchmark score gap between two LLMs is luck. The author separates prediction noise (a model gives different answers to the same question when sampled again) from data noise (the questions are one sample out of many possible ones); together they make the total noise (abstract; §2.1). His motivation: well-established statistics are applied to LLM evals with "choices and confusions" that give misleading measurements and low [statistical power](#/glossary/statistical-power) (§1). His all-pairs paired method compares every pair of models on the same questions and measures all three noises, on millions of question-level predictions (abstract). He reports that each eval has a characteristic, highly predictable total noise across model pairs, and that paired prediction noise "typically exceeds" paired data noise, so averaging answers per question "can significantly increase statistical power" (abstract). On HumanEval (164 programming questions), for typical model pairs near half accuracy, the gap needed for significance at the 5% level falls from 12% without pairing to 2–4% paired with averaging (§2.1, Example 1). He presents the work as defining and measuring three noises (§1, "Contributions").

## Background and terms

**Terms to know:** [bootstrap resampling](#/glossary/bootstrap-resampling) · [sign test](#/glossary/sign-test) · [statistical power](#/glossary/statistical-power) · [greedy decoding and temperature sampling](#/glossary/greedy-decoding-and-temperature-sampling) · [self-consistency (majority voting)](#/glossary/self-consistency-majority-voting)

**The paper's own terms:**
- **prediction noise**: from a model "generating different answers on a given question"; the per-question variance across samples, averaged over questions (§2.1; §3.2). Choices such as prompt formatting or training seeds add to it (§2.1).
- **data noise**: from which questions were sampled; the variance across questions of each question's expected score. It "cannot be directly measured by evaluating on the fixed, given set of questions; and it cannot be reduced" (§2.1).
- **total noise**: data plus prediction noise (§1; §3.2). **Noise** means variance or standard error "when there is no need to distinguish" (§3.1).
- **paired analysis**: the variance of the per-question score difference between two models on the same questions; correlation between them shrinks it (§3.1).
- **all-pairs paired method**: the paired standard error for every pair of models; "the total noise is always measured", the data and prediction noises when there are several predictions per question (§2.1).
- **expected metric**: the score averaged over many samples per question; contrasted with the "best prediction metric" (e.g. majority vote) and the "one prediction metric" (App. C.1, Example 7).
- **Beta theory**: each question's expected accuracy is drawn from Beta(p, 1−p), p being the model's mean accuracy (§4.2.1; App. B).
- **rule of thumb**: on correctness evals, the variance of the paired difference is about p(1−p), p being one model's accuracy (§1).
- **small-K correction**: a bias correction for data variance estimated from K samples per question (App. A.2).

**Missing glossary terms:**
- **standard error (SE)**: the standard deviation of a measured mean; over N questions, the per-question standard deviation over the square root of N (§3.1).
- **law of total variance**: total variance = variance of the per-question mean + mean of the per-question variance; here data + prediction (§1; §3.2).
- **z-score**: the score difference divided by its standard error; for large enough N it converts to a p-value, the chance of a value as extreme (§3.1; App. E).
- **Central Limit Theorem (CLT)**: for a large sample, the mean of independent draws is approximately normal (general definition; §3.1).
- **Beta distribution**: a distribution over 0 to 1 with two shape parameters; a smaller sum "means more bimodal" (two-peaked) (App. B).

**Builds on:**
- Miller (2024), "Adding Error Bars to Evals": "we adopt the approach of Miller (2024) to estimate the variance directly" (§5).
- The bootstrap (Efron, 1979) and the sign test (Dixon and Mood, 1946), shown to give the same answer as the variance method (App. E).
- Madaan et al. (2024): seed noise (from random seeds; §5) and unpaired confidence intervals, used by Llama 3, "much looser than the paired methods" (§5).
- Chatbot Arena (Chiang et al., 2024), a model-comparison leaderboard, and CRUXEval (Gu et al., 2024), a code-reasoning benchmark: per-model error bars against a fixed reference model, which the author calls incorrect (§5; Example 4); the all-pairs approach "is inspired by Chatbot Arena" (§6.5, "Acknowledgments").

## Problem and setting

- **Question:** how large are the three noises for all pairs of models, and do they follow patterns usable for a whole table of results (§1)? Data noise counts because on most evals "we care about the underlying ability measured by the eval rather than the specific questions" (§2.1).
- **Setting:** a metric "typically 0 for incorrect and 1 for correct but can be a real number or an aggregate metric" (§3.1); K predictions per question, the sampling seed independent of the question (§3.2); the CLT is used when "N > 100 is moderately large" (§3.1).
- **Data:** public leaderboards and controlled sampling (§1): SWE-bench Verified (500 software tasks for coding agents, one answer per question; Fig. 1, Fig. 2), MATH500 (500 math problems, about 1000 samples per question and model; §4.1.1), CRUXEval at temperatures 0.8 and 0.2 (Fig. 4), HumanEval (Example 1). The paper doesn't list the models.

## Approach

- **Decomposition:** the law of total variance, for one model and for the paired difference (§1; §3.2).
- **Estimators:** formulas as if using all pairs of collected predictions, with a small-K correction (a per-question bias would otherwise not shrink with more questions) and a correction for comparing a model with itself (App. A.2); numpy-style code in Tab. 1 and Tab. 2 (App. A.3).
- **All pairs:** with a fixed baseline, one error bar per model is not possible in general, so every pair is measured; for the total noise of LLM evals the author finds "almost no such surprises" (Example 4).
- **Beta theory** (App. B): if per-question expected accuracy follows Beta(p, 1−p), both models answer each question correctly with that same probability, and their predictions are drawn independently, the paired prediction variance, averaged over questions, is p(1−p).
- **Checks:** variance method, bootstrap and sign test "give the same answer", with "A slight approximation" on the sign test (App. E); estimator tests on simulated data with known variances (App. F).
- **Recommendations** (App. D): eval and leaderboard builders run the method, or release question-level results, "ideally with multiple predictions per question"; model developers use, in increasing accuracy and overhead, the rule of thumb, the paper's curves, or the estimators; several evals are combined through weighted per-eval z-scores.

## Results

- **Predictable total noise:** on SWE-bench Verified and MATH500 the paired total SE follows accuracy and agrees with the Beta theory (Fig. 1; §4.2); the Beta model fits per-question accuracies, and better models are more bimodal (App. B, Fig. 6).
- **Prediction > data noise:** on MATH500 the data SE is "typically less than 1/2 of the prediction SE between different final models" (§2.1). On SWE-bench Verified training curves from one checkpoint, the data SE is about 1/6 of the prediction SE, so averaging 36 predictions would let one detect effects "0.24 the size" at the same p-value and power (§2.1).
- **Training curves** (Fig. 2): paired bootstrap z-score 1.7 at one prediction per question against 3.5 averaged over 5 checkpoints; the unpaired bootstrap shows "a meaningless difference".
- **HumanEval** (Example 1): difference needed for p < 0.05 of 12% unpaired, 8% unpaired with averaging, 8% paired, 2–4% paired with averaging, "between typical pairs of LLMs".
- **Temperature:** on CRUXEval prediction noise dominates at 0.8 and data noise at 0.2, "while both still yield about the same total noise" (Fig. 4); at temperatures from 0.7 to 1 prediction noise tends to exceed data noise across evals (§4.2).
- **Question level:** similar-accuracy models do similarly per question (§4.1.1, Fig. 3).
- **Estimators:** "reasonable accuracy" on paired total and prediction variance; "The data variance is the hardest to estimate", where the small-K correction is critical (App. F; Fig. 5).

## Limits the authors state

- "all the empirical data are from correctness evals, so whether the empirical findings generalize to other evals remains to be tested" (§6.5).
- Bowyer et al. (2025) ([Position](#/papers/bowyer2025clt "Position: Don't Use the CLT in LLM Evals With Fewer Than a Few Hundred Datapoints (2025)")): the CLT "does not work well for less than a few hundred questions, though with 100 questions the errors are only significant in the tails" (§6.5).
- "For simplicity", the "potentially impactful clustered correction" of Miller (2024) is left out (§6.5).
- The all-pairs approach "can be inconclusive in general" (§2.1; Example 4).
- Even at low temperature, where data noise exceeds prediction noise, total noise follows the Beta prediction, "except for chain-of-thought predictions" (§6.1).
- "In theory, the prediction noise can still be arbitrarily small" (§6.1); the training curve ignores data noise, which in theory "can be much higher than the prediction noise" (Example 2a).
- Averaging is recommended for most controlled experiments "not expected to have a large effect on the eval" that "do not target the eval specifically"; caveats come with majority voting or a reliable verifier, or a change in "sharpness" (sharpening "can lead to much better expected accuracy" on a good-enough model), and "an independent standard of effect size is also needed" (App. C.1, Examples 5–7).
- Exceptions (App. C.2): near random chance on guessable evals such as MMLU (multiple-choice), noise is "closer to the independent prediction rather than the Beta prediction" (Fig. 1's indep. theory curve); SWE-Fixer, an LLM system for GitHub issues, gives outliers by using "a deterministic filter"; Llama on vLLM (an inference engine) is "more deterministic than expected", "likely due to faulty settings"; distilled models "tend to have less sharp distribution at the same performance level".

## Open problems and building blocks

- **Open:** "More data is needed to further test if this continues to hold, and if low temperature can reduce prediction noise as the model is training" (§6.1). Modeling question difficulty with Item Response Theory or filtering questions "should deal with the prediction noise first" (§6.1). "If we continue in the direction of smaller and harder evals, we probably need to also generate more information per question" (§6.2).
- **Released:** "The data and analysis", as interactive figures on a website (§1; §4).
- **To reuse it:** question-level scores of each model on the same questions; several predictions per question to split the noises (App. D); a moderately large N (App. F); the small-K correction (App. A.2).

## On this site

- **Tags:** <span class="tags"><a class="tag" href="#/tags/stats">stats</a><a class="tag sub" href="#/tags/general-misc">general-misc</a><a class="tag sub" href="#/tags/llm-misc">llm-misc</a></span>
