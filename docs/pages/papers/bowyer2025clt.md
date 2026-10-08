# Position: Don't Use the CLT in LLM Evals With Fewer Than a Few Hundred Datapoints

**Position** · ICML 2025 (spotlight position paper)

Read: [PDF](https://arxiv.org/pdf/2503.01747) · [arXiv](https://arxiv.org/abs/2503.01747)  
Code: [bayes_evals](https://github.com/sambowyer/bayes_evals) · [no_clt_paper](https://github.com/sambowyer/no_clt_paper)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Argues that error bars from the central limit theorem fail for LLM evals with few questions, with clustered questions, when comparing two models, and for metrics that are not averages such as F1, and recommends Wilson score or Bayesian Beta–Bernoulli intervals for one model on independent questions and Bayesian models for clustered and paired data (abstract; §3.1–3.5).
- Measures the coverage of CLT, bootstrap, Wilson, Clopper–Pearson and Bayesian intervals on simulated eval datasets of 3 to 300 questions whose true values are known (§3; N = 300 only in the clustered setting, Fig. 3), with mismatched priors as ablations (§4; App. I), and draws the intervals for real results on a LangChain tool-use eval (§1, Fig. 1) and MathArena AIME 2025 II (App. B.2).
- Interval methods for comparing LLMs on small checked item sets (<a class="tag" href="#/tags/stats">stats</a>): the authors report that 95% CLT intervals reach only 92.5% coverage at N = 100 (§3.1, Fig. 2), and that in the paired setting all non-Bayesian methods "severely underperform" in reaching nominal coverage at small N (§3.4).

## In plain words

For an LLM scored right or wrong on questions, the reported error bar typically comes from the central limit theorem: accuracy plus or minus a multiple of its standard error, how much accuracy varies between question samples (§2). The authors argue this is "appropriate when benchmarks consist of thousands of examples" but fails for smaller, specialized benchmarks, "usually dramatically underestimating uncertainty" (abstract). Their motivation: targeted benchmarks are costly and so tend to be small, "often on the order of tens to hundreds per task", and large ones are often split into sub-tasks (§1).

In this position paper they simulate evals with known true accuracy and measure how often each interval contains it, for one model, grouped questions, two-model comparisons and F1 score (§3). For one model on independent questions, they report that central-limit intervals meant to hold the truth 95% of the time held it only 92.5% of the time even with 100 questions (§3.1). They recommend the Wilson score interval (a classical formula for right/wrong outcomes) or simple Bayesian intervals there, and Bayesian models for harder cases (§3.1–3.5).

## Background and terms

**Terms to know:** [Wilson score interval](#/glossary/wilson-score-interval) · [bootstrap resampling](#/glossary/bootstrap-resampling) · [F1 score](#/glossary/f1-score) · [pass@k](#/glossary/passk)

**The paper's own terms:**
- **N**: the number of questions in an eval (§2).
- **Coverage**: the share of intervals containing the true value; **nominal coverage** is the level an interval claims, such as 95% (§1; §3 "Evaluation metrics").
- **IID, clustered and paired questions**: IID, independent draws from one distribution; clustered, groups of questions sharing difficulty, such as several about one passage (§3.2); paired, two models answering the same questions (§3.4).
- **QBI and HDI**: Bayesian intervals between two posterior quantiles (2.5% cut from each end for 95%) or around the most probable values (highest posterior density) (§3 "Interval methods").

**Missing glossary terms:**
- **Central limit theorem (CLT)**: for IID draws with finite variance, the average of many draws is close to normally distributed, with spread shrinking as N grows (§2).
- **Confidence interval**: a frequentist interval (treating the true value as a fixed unknown, Remark 1) such that, under repeated sampling, 95% of 95% intervals contain the true value (§3 "Evaluation metrics").
- **Bayesian credible interval, prior, posterior**: the prior is a belief about the true accuracy before the data, the posterior after it; a 95% credible interval has 95% posterior probability of holding the value (§3).
- **Beta–Bernoulli model**: right/wrong outcomes with a Beta prior on accuracy (a distribution over 0–1 that includes the uniform, App. C); the posterior is again Beta, in closed form (§3.1).
- **Hypothesis test**: asks whether data rule out a value; a two-sided test at 5% rejects exactly those outside the 95% confidence interval (§2.2).
- **Clopper–Pearson interval**: an exact interval holding every accuracy that a binomial test (one on the count of right answers) does not reject, with coverage guaranteed at least nominal (App. A.3).
- **Odds ratio**: the ratio of the two models' odds, each its success rate over its failure rate (§3.3).
- **Fisher's exact test**: an exact test for two proportions, inverted (keeping the values it does not reject) into odds-ratio intervals (§3.3).
- **Delta method**: under standard regularity conditions (e.g. a differentiable function), extends the CLT to smooth non-linear functions of averages, such as F1, by a first-order Taylor expansion (§3.5; App. A.4).
- **Importance sampling**: here, draw many guesses from the prior, weight each by how well it explains the data, resample by weight (§3.2; App. E).

**Builds on:**
- Works using or recommending CLT intervals for LLM evals, such as Madaan et al. (2024), Miller (2024) and Dubey et al. (2024, the Llama 3 report) (§2.2); the paper tests Miller's suggested clustered standard errors, a CLT fix for within-group correlation (§3.2).
- Classical intervals for proportions: Wilson (1927) and Clopper & Pearson (1934), with Agresti & Coull (1998) and Newcombe & Nurminen (2011) for preferring Wilson (§3.1).
- Thulin (2014): Clopper–Pearson equals the Bayesian interval "with the uniform prior removed" (§3.1); Altham (1969): Fisher's exact test matches a Bayesian analysis with extreme priors (§3.3).

## Problem and setting

- **Question:** how best to compute error bars for LLM evals; the authors take it "as read that LLM evals should come with error bars" (§1).
- **Data:** each answer is right or wrong; for F1, one cell of a confusion matrix (true or false positive or negative) (§3.5).
- **Simulation:** 100 true values from a prior, each giving 200 datasets of N = 3, 10, 30 and 100 questions (80,000); intervals at 100 confidence levels from 0.8 to 0.995; five seeds (§3 "Experimental setup").
- **What "correct" means:** coverage matching nominal coverage; width is recorded too (§3 "Evaluation metrics").
- **Priors:** the main experiments draw true accuracies from the uniform prior the Bayesian intervals assume (§3.1–3.5, §4); App. I draws them from other priors or fixes them, keeping the uniform prior for inference.
- **Real data:** public results on a LangChain tool-use task (agents spell strings with 26 one-letter tools; 20 questions; Fig. 1, App. B.1) and MathArena AIME 2025 II (15 competition math problems, first attempts; App. B.2).

## Approach

- **One model, IID questions (§3.1):** CLT, bootstrap, Wilson, Clopper–Pearson, and a Beta–Bernoulli interval with a uniform prior (Snippet 1).
- **Clustered questions (§3.2):** a hierarchical Bayesian model: each task's accuracy scatters around a global one, by an amount a concentration parameter sets; inference by importance sampling (App. E.1, Snippet 4).
- **Two models, independent (§3.3):** e.g. only accuracies known, or different question sets. Intervals on the difference and the odds ratio (no CLT interval for the latter). Bayesian intervals sample the two posteriors (Snippet 2), also giving the probability that one model beats the other (Remark 1). Better frequentist methods exist but are "harder to implement and are not available in standard libraries" (§3.3).
- **Two models, paired (§3.4):** simulated answers are the signs of a hidden two-dimensional normal draw per question, correlated between the models (positive correlation favoured) (App. C). The paired Bayesian model inverts this by importance sampling (App. E.2, Snippet 5); "unpaired Bayes" treats the models separately.
- **F1 (§3.5):** a Dirichlet–multinomial model (a uniform prior on the four cells' probabilities, updated by their counts) gives posterior samples of F1 (Snippet 3), compared with the bootstrap and a delta-method interval (Fig. 6).

## Results

Coverage comes from simulated data (§3).
- **One model (§3.1, Fig. 2):** CLT and bootstrap intervals cover well below nominal, "a fairly catastrophic failure"; at 100 questions, 95% CLT intervals reach 92.5% coverage. They are also wider than needed for any given coverage. All methods approach nominal coverage for large N, but only the Bayesian and Wilson intervals reach it for small N (Fig. 2 caption). Clopper–Pearson is overly conservative (§3.1).
- **Clustered (§3.2, Fig. 3):** in a small-data regime neither plain nor clustered CLT intervals give correct coverage; of the methods considered, only the clustered Bayesian model reaches the right coverage across sample sizes.
- **Independent comparison (§3.3, Fig. 4):** CLT coverage is far below target when N is small; Fisher's exact test "tends to be overly conservative", especially for small N; the Bayesian intervals achieve "excellent coverage across all sample sizes for both metrics". Fisher odds-ratio intervals were infinitely wide in 43.5% of cases at N = 3, 1.9% at N = 100 (Fig. 14 caption).
- **Paired comparison (§3.4, Fig. 5):** all non-Bayesian methods "severely underperform" in reaching nominal coverage for small N; the authors recommend paired Bayes as it can account for correlations and so give narrower intervals, and call unpaired Bayes a reasonable, easier alternative.
- **F1 (§3.5, Fig. 6):** the Bayesian intervals "closely track the nominal coverage, while the bootstrap ones systematically under-cover".
- **Real data (Fig. 1; App. B.2, Fig. 9):** CLT intervals extend beyond 0–1 or collapse to zero width; on AIME, bootstrap ones also collapse.
- **Prior mismatch (§4; App. I):** Bayesian coverage "generally does not fall below that of CLT-based methods and often still outperforms them", especially for small N (§4).
- **Width (App. H):** in the clustered and comparison settings, Bayesian error bars tend to be much narrower for a given coverage than CLT and bootstrap ones.

## Limits the authors state

- CLT intervals of zero width (all or none right) or outside 0–1: "While these issues might occur in practice only rarely", they show the CLT's assumptions may not suit small evals (§3.1).
- That CLT methods usually suffice when their assumptions hold: "We do not disagree." Whether N is large enough is context-dependent and hard to know in advance; the title avoids implying a hard threshold (§4).
- Informative priors could narrow intervals, but optimal coverage needs the true prior information, "typically unavailable or unreliable", and subjective priors can bring unwanted biases (§4).
- With a mismatched data prior (IID setting), Bayesian intervals come out too wide; "this problem resolves fairly quickly" as data grows (App. I.1).
- For much larger N, where compute cost grows, the faster CLT-based methods would perform acceptably (App. F).

## Open problems and building blocks

  - Clustered data: "To our knowledge there are no readily available frequentist methods, tailored to such clustered data that can be applied in here." (§3.2)
  - Pass@K would need a hierarchical Bayesian model with a per-model hidden variable, which could extend to questions or tasks; "It is unclear to us how best to construct a corresponding CLT-based/frequentist interval." (App. D)
- **Released:** "a simple Python library for these Bayesian methods" (abstract); the raw evals data, "along with code to reproduce all experiments in this paper" (App. B.1, footnote); code in Snippets 1–5.
- **To reuse it:** Wilson and Clopper–Pearson are implemented in SciPy, and the Beta–Bernoulli posterior is closed-form (§3.1). The clustered and paired models use importance sampling with 10,000 prior samples (§3.2, §3.4; App. E.1); the paired model needs a two-dimensional normal distribution function, approximated after Tsay & Ke (2023) (App. E.2). Paired methods use both models' per-question outcomes (§3.4). The longest mean time was 200 milliseconds on one CPU (App. F).

## On this site

- **Tags:** <span class="tags"><a class="tag" href="#/tags/stats">stats</a><a class="tag sub" href="#/tags/general-misc">general-misc</a><a class="tag sub" href="#/tags/llm-misc">llm-misc</a></span>
