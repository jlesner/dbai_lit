# Deep Reinforcement Learning at the Edge of the Statistical Precipice

**Deep Reinforcement Learning at…** · (rliable), NeurIPS 2021

Read: [PDF](https://arxiv.org/pdf/2108.13264) · [arXiv](https://arxiv.org/abs/2108.13264)  
Code: [rliable](https://github.com/google-research/rliable)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Argues that comparisons of deep RL methods from a handful of runs per task must report uncertainty: stratified bootstrap confidence intervals, performance profiles, and the interquartile mean (IQM) as aggregate (Tab. 1; §4).
- A case study on Atari 100k with 100 runs per algorithm, subsampled to 3–100 runs (§3), then re-evaluations of published comparisons on ALE, Procgen and the DeepMind Control Suite (§5); released as the `rliable` library (abstract).
- Classical statistics for comparing methods on few runs and many tasks, whose IQM listed [APE](#/papers/zhou2022ape "Large Language Models Are Human-Level Prompt Engineers (2023)") uses (it reports IQM across 24 tasks); the authors report that the number of runs needed for reliable 95% intervals on sample medians in Atari 100k "is closer to 50–100", against the "folk wisdom" of 20 or 30 (§3).

## In plain words

Deep [reinforcement learning](#/glossary/reinforcement-learning) (RL) methods are compared by one mean or median score over a suite of tasks, such as Atari games, usually from a few training runs, as more are often too costly. The authors argue that ignoring how much such numbers would change with fresh runs risks "slowing down progress in the field" (abstract). On Atari 100k, a 26-game benchmark, they train 100 runs of each of five recent methods and find that, judged by 95% confidence intervals on the median, enough runs is closer to 50–100 than the "folk wisdom" of 20 or 30 (§3). They recommend three tools for a handful of runs: intervals from [bootstrap resampling](#/glossary/bootstrap-resampling) within each task, plots of the whole score distribution, and robust summary scores such as the [interquartile mean](#/glossary/interquartile-mean-iqm) (Tab. 1; §4). On Procgen, 16 tasks testing generalization, they find a number of published improvements only 50–70% likely to hold on a randomly chosen task (§5). They present this as a call for "a change in how we evaluate performance in deep RL", with a library, rliable (abstract).

## Background and terms

**Terms to know:** [reinforcement learning](#/glossary/reinforcement-learning) · [bootstrap resampling](#/glossary/bootstrap-resampling) · [interquartile mean (IQM)](#/glossary/interquartile-mean-iqm) · [Mann-Whitney U test](#/glossary/mann-whitney-u-test).

**The paper's own terms:**
- **run**: one independent training of an algorithm; the paper counts runs per task, each giving one score (§2), though in the Atari 100k study one run trains on all 26 games (§3). A run "can be different from using a fixed random seed", as seeds may not control GPU non-determinism (§2, footnote).
- **normalized score**: a task's score (often the average return, the reward summed over an episode) rescaled linearly between two reference points; on Atari typically a random agent scores 0 and an average human 1 (§2).
- **point estimate**: a median or mean from finitely many runs, as against the true value unlimited runs would give (§2).
- **stratified bootstrap CI**: resample runs with replacement within each task, recompute the aggregate, repeat, and read the interval off the spread (§4.1); **percentile** CIs take the interval directly from percentiles of the resampled values (App. A.5).
- **score distribution**: the authors' performance profile: for each score threshold, the fraction of all run-task scores above it, with bootstrap bands (§4.2, Eq. 1). The older **average-score distribution** counts tasks whose mean score is above it (§4.2).
- **IQM, as used here**: the mean of the middle 50% of all run-task scores (§4.3).
- **optimality gap**: "the amount by which the algorithm fails to meet a minimum score of" 1.0 (§4.3, Fig. 8).
- **average probability of improvement**: the chance that one algorithm beats another on a randomly selected task, computed per task over all pairs of runs with the Mann-Whitney U-statistic (§4.3; App. A.7, Eq. A.2).

**Missing glossary terms:**
- **confidence interval (CI) and coverage**: an interval such that, over many reruns with new runs, the stated fraction of intervals (the nominal coverage, typically 95%) would contain the true score (§2).
- **stochastic dominance**: one curve lies at or above another everywhere and strictly above somewhere (§4.3, footnote).

**Builds on** (none on this site):
- Earlier calls for rigor in deep RL, among them Henderson et al., Colas et al. and Jordan et al. (§6; App. A.3); "this paper focuses on reliable comparisons on a suite of tasks" (App. A.3).
- Efron's bootstrap and bootstrap confidence intervals (§4.1; App. A.5).
- Dolan and Moré's performance profiles, from benchmarking optimization software, and average-score distributions from Bellemare et al.'s paper introducing the ALE (Arcade Learning Environment, Atari 2600 games) (§4.2).
- Amrhein et al., Romer and Wasserstein et al., whom they follow in recommending confidence intervals (§2, Remark).

## Problem and setting

- **The question:** "How do we reliably evaluate performance on deep RL benchmarks with only a handful of runs?" (§1). Ignoring uncertainty "gives a false impression of fast scientific progress in the field" (§1).
- **A result:** each independent run gives one normalized score per task; scores vary from run to run, from sources such as task randomness, exploration, initial weights and GPU non-determinism (§2).
- **Correctness:** a CI is good when its true coverage, estimated from 200 DER runs, matches the nominal 95% (Fig. 6). Significance tests are avoided "because of their dichotomous nature" and common misreadings (§2, Remark).
- **Scope:** performance after hyperparameter tuning (App. A.3), scored at the end of training rather than by taking a maximum (§3; App. A.4).
- **Benchmarks:** Atari 100k, "an offshoot of the ALE for evaluating data-efficiency in deep RL", 100k steps on each of 26 games (§3); the ALE at 200M frames on 55 games (Fig. 9); Procgen, 16 tasks "for evaluating generalization in RL"; the DeepMind Control Suite, 6 continuous-control tasks (§5). The authors trained the Atari 100k runs (App. A.2); the others came from Dopamine (a deep RL framework) or the original authors (App. A.1).

## Approach

- **Case study (§3).** Five recent Atari 100k agents, DER, OTR, DrQ, CURL and SPR, all built on the Rainbow architecture (an earlier Atari agent) (App. A.2); DrQ is also run with standard settings for its random-action rate, as DrQ(ε) (§3, footnote). Each gets 100 runs; subsets of 3–100 runs are drawn with replacement, 100,000 times, to measure how point estimates vary (Figs. 2–3). SPR's scores are inflated by a fixed percentage, a lift, to see how many runs a metric needs to detect it (Fig. 4), and DER is re-scored under the maximum-based protocols of CURL and SUNRISE (another Atari 100k agent) (App. A.4).
- **Stratified bootstrap CIs (§4.1).** Pooling across tasks gives more samples than bootstrapping each task alone; four bootstrap variants are checked against true coverage (Fig. 6; App. A.5). With 1–2 runs per task, the bootstrap can run over tasks instead (App. A.5).
- **Score distributions (§4.2).** The authors state that they are unbiased, that an outlier run with an extremely high score moves them by at most one over the number of run-task scores, and that they typically vary less than average-score distributions.
- **Aggregate metrics (§4.3).** IQM replaces the median, since "zero scores on nearly half of the tasks does not affect the median"; optimality gap replaces the mean, which "can be easily dominated by performance on a few outlier tasks" (§1); probability of improvement shows how robust a gain is.

## Results

  - Published medians vary widely under resampling; the analysis suggests DER may in fact be better than OTR, contrary to the reported point estimates (Fig. 2 left).
  - "In the few-run regime", median bias can dominate a comparison: for SPR, the gap between 5-run and 100-run sample medians (+0.03 points) is about 36% of its mean improvement over DrQ(ε) (+0.08); its size and sign depend on the algorithm (Fig. 3).
  - By 95% CIs on sample medians, enough runs is closer to 50–100 than the folk wisdom of 20 or 30 (Fig. 2 right).
  - "statistically defensible improvements with median scores is only achieved for 25 runs" at a 25% lift and 100 runs at a 10% lift; with no lift, even 100 runs are insufficient. IQM "requires fewer runs than median for small uncertainty" (Fig. 4).
  - "Gains from SUNRISE and CURL over DER can mostly be explained by such protocols", the maximum-based ones (Fig. 5).
- **Tools (§4).** Percentile CIs "provide good interval estimates for as few as" 10 runs for median and IQM (§4.1, Fig. 6). IQM gives much smaller CIs than the median (Fig. 2 right); the shift in its expected score between 3 and 100 runs is "typically an order of magnitude smaller" than the median's (Fig. A.17).
  - ALE: a later agent and the Rainbow version it claimed to beat on median score have intervals that "strikingly overlap" (Fig. 9).
  - DeepMind Control: when uncertainty is accounted for, "most algorithms do not consistently rank above algorithms they claimed to improve upon", suggesting "a lot of the reported improvements are spurious, resulting from randomness in the experimental protocol" (Fig. 11).
  - Procgen: scores normalized by PPO (a common baseline) are typically heavy-tailed, so means depend on a few tasks. A number of reported improvements are only 50–70% likely (Fig. 12).

## Limits the authors state

- "with 3 runs, bootstrap CIs underestimate the true 95% CIs and might require a larger nominal coverage rate to achieve true 95% coverage" (Fig. 6).
- "depending on the choice of metric, the ordering between algorithms changes" (§5); "no single metric would be sufficient for evaluating progress" (App. A.7).
- The median is more robust to outliers than IQM; probability of improvement "does not account for the size of improvement"; optimality gap "assumes that a score of 1.0 is a desirable target beyond which improvements are not very important" (§4.3).
- With many tasks "stochastic dominance is rarely observed" (§4.3); bootstrapping over tasks "results in much larger uncertainty" (App. A.5).
- "statistical sophistication can introduce new forms of statistical abuses and monitoring the literature for such abuses should be an ongoing priority for the research community"; the paper "only partly addresses it by providing tools for more reliable evaluation" (§ "Societal Impacts").
- A barrier to adoption is whether researchers have clear incentives, as "more rigor generally entails more nuanced and tempered claims" (§6).

## Open problems and building blocks

  - "finding the best aggregate metric is still an open question and is often dependent on underlying normalized score distribution" (§4.3).
  - "a more pragmatic incentive would be if conferences and reviewers required more rigorous evaluation for publication" (§6), and papers should provide "results for all runs to allow for future statistical analyses" (§6).
  - Bottleneck: more runs are "often computationally prohibitive" (§1), and the authors argue more computation is "unlikely" to resolve the problem "for the future generation of RL benchmarks" (§6).
- **Released:** the Python library rliable, a Colab notebook, and the individual runs (abstract; §6; App. A.1); Atari 100k agent code in Dopamine (App. A.2).
- **To reuse it:** per-run normalized scores for every task (§2); the authors call the tools easily applicable with 3–10 runs per task (§1), with bootstrap over tasks for 1–2 runs (App. A.5). Defaults: 50,000 bootstrap resamples for aggregate metrics, 2,000 for bands and probability of improvement (App. A.5). The case study took roughly 2,400–3,600 GPU days (App. A.2).

## On this site

- **Tags:** <span class="tags"><a class="tag" href="#/tags/stats">stats</a><a class="tag sub" href="#/tags/general-misc">general-misc</a></span>
