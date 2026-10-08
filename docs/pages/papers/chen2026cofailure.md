# When Does Combining Language Models Help? A Co-Failure Ceiling on Routing, Voting, and Mixture-of-Agents Across 67 Frontier Models

**When Does Combining Language…** · preprint 2026

Read: [PDF](https://arxiv.org/pdf/2606.27288) · [arXiv](https://arxiv.org/abs/2606.27288)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Any policy whose output is one member model's answer (a router, a vote, a cascade) has accuracy at most 1 − β, where β is the rate at which every model in the pool is wrong on the same query. The average pairwise error correlation ρ, the diagnostic practice reports, cannot identify β (abstract; §5, Props. 1 and 3).
- A Clopper–Pearson bound on β from one graded held-out query set certifies, before a router is trained, the largest gain any such policy could deliver over the single best model (abstract; §5, Prop. 1 (iii)). Measured on pools of 15 and 67 models over mathematics, science and multi-subject multiple choice (MMLU, MMLU-Pro), and of 18 models on execution-graded code and free-response GPQA (§4; §5; Apps. F–G), graded programmatically except that free-response test, graded by an LLM panel (App. G).
- A ceiling on voting and routing over checked answers that holds even for a perfect selector (Prop. 1 (i)); in our reading it complements [The Limits of Inference…](#/papers/stroebl2024resampling "The Limits of Inference Scaling Through Resampling (2024)"), whose limit on resampling comes from verifier false positives (its abstract). The author reports that "on our pool, and on tasks where answers can be checked, combining models rarely beats the single best model without a strong query-level routing signal" (abstract), with β = 0.079 on execution-graded code (abstract; App. F).

## In plain words

Systems that combine several LLMs (one model per question, voting, escalating from cheap to strong, merging answers) aim to beat the best single model. The author says practitioners judge whether combining will pay by how correlated two models' errors are, and argues this is the wrong number (§1). A method that always returns one model's own answer is capped by how often every model is wrong on the same question. For three or more models, the paper proves that pairwise correlations cannot pin down that rate, and turns a confidence bound on it, from one graded held-out question set, into a cap on the gain before any router is trained (abstract; §5). Across 67 models, it reports that a model in which one shared hidden difficulty drives every model's errors, fitted with the right kind of correlation, still predicts about 2.5 times too few all-wrong questions on open-ended math, resting on 17 such questions (abstract). The author presents standard tools applied to this setting plus a "market-scale measurement", claiming "no new routing algorithm" (§1).

## Background and terms

**Terms to know:** [self-consistency (majority voting)](#/glossary/self-consistency-majority-voting) · [Pearson correlation](#/glossary/pearson-correlation) · [bootstrap resampling](#/glossary/bootstrap-resampling) · [Cohen's kappa](#/glossary/cohens-kappa) · [LLM-as-a-judge](#/glossary/llm-as-a-judge) · [AUROC](#/glossary/auroc) (the paper's "AUC").

**The paper's own terms:**
- **Router, cascade, fusion, mixture-of-agents (MoA), Self-MoA**: a router picks one model per query; a cascade escalates from a cheap to a strong model on low confidence; fusion combines several outputs; MoA aggregates in layers; Self-MoA fuses samples of the single best model (§2; §5).
- **Selection policy**: any policy whose output is almost surely one member's answer: a router, a (weighted) vote or a cascade (Prop. 1); §2 adds debate and self-consistency.
- **β (co-failure, all-models-wrong rate)**: the share of queries on which every model in the pool is wrong (Prop. 1). **ρ**: the mean pairwise error correlation (§1).
- **Single-best; per-query oracle; oracle gain G**: the model with the best average accuracy, chosen in-sample (§4); the oracle picks a correct model whenever one exists; G is the oracle's accuracy minus single-best's (Prop. 1).
- **Certificate**: in the glossary's terms not a [certificate](#/glossary/certificate) but a statistical bound: a Clopper–Pearson lower bound on β (below) that, with stated confidence, caps every selection policy's gain (Prop. 1).
- **Ceiling-bound and realizability-bound regimes**: β clearly above zero caps every policy, or β is near zero and the gain is limited by how well a router finds the right model (§5 "Two regimes across three domains…"; Tab. 3).
- **Common-mode atom**: a positive-probability set of queries all models fail, however large the pool (§5 "The driver is a common mode…").

**Missing glossary terms:**
- **Clopper–Pearson interval**: an exact confidence interval for a rate seen as k events in n trials, valid even when k is small (general definition; used undefined, §5).
- **Tetrachoric correlation**: the correlation of hidden continuous scores assumed behind two yes/no outcomes; the paper says the one-factor model must be calibrated with it, not with the Pearson correlation of 0/1 correctness indicators (§5 "The mispricing is a large-pool phenomenon…").
- **Copula (Gaussian, single-factor, Clayton)**: a way to join individual error rates into a joint distribution with a chosen dependence. Gaussian: the hidden scores are jointly normal; single-factor: one shared hidden factor (App. A.2, Prop. 7). A Gaussian copula with correlation below one has zero lower tail dependence: joint extreme failures become vanishingly rare (Prop. 2); a Clayton copula has positive lower tail dependence (§5).

**Builds on:**
- Kuncheva's Oracle combiner and Kuncheva et al.'s majority-vote limits: the ceiling itself is classical; the author claims that it bounds every selection policy, and its conversion into a certificate (§2).
- Dekoninck et al.: the oracle upper envelope and the optimality of routing and cascading are "due to" them (§1 "What we concede").
- Turkmen et al.: a tetrachoric Gaussian copula and ensemble error floor for LLMs; the author reaches "the opposite conclusion" (§2).
- Kim et al. ([Correlated Errors in Large Language Models](#/papers/kim2025correlated "Correlated Errors in Large Language Models (2025)"); correlated pairwise LLM errors) and Li et al. (Self-MoA, a baseline) (§2; §4).

## Problem and setting

- **Question:** what caps the gain of combining models over the single best, and can ρ see it (§1)?
- **Formal setting:** models have a quality per hidden query type and a price; the objective is dollars per correct answer, or quality under a budget (§3).
- **Pillar pool (§4; Pillars A–C, its routing, voting and cascade experiments, §5):** 15 models from 9 provider families in a "pre-registered program", on GSM8K (grade-school math), MMLU, ARC-Challenge and MMLU-Pro (multiple-choice knowledge and science) and MATH-500 (competition math), 100–200 queries each.
- **Market-scale pool (§4; App. D):** 67 chat/instruct models from 21 provider families on OpenRouter (a reseller of many providers' models), "from the current frontier down to small open-weights", reasoning variants excluded; benchmarks MATH-500, MATH-Hard Level-5, AIME 2024/2025 (math competitions) and GPQA-Diamond (graduate science, multiple choice).
- **Grading:** programmatic answer matching (§4). Code (App. F): 63 code_contests problems (Codeforces rating 1900–3500), 18 models, run against private and generated tests, not the official judge. Free-response GPQA (App. G): 18 models, graded by a five-judge LLM panel.
- **Certificate assumption:** i.i.d. queries (Prop. 1 (iii)). **Cost:** about $270 in reported experiments (§4).

## Approach

- **Ceiling and certificate (Prop. 1, §5).** (i) Any selection policy has accuracy at most one minus β, reached by the per-query oracle. (ii) The oracle gain equals the chance that single-best is wrong minus β: it comes only from queries where single-best is wrong but not every model is. (iii) From n i.i.d. queries with K all-wrong, the Clopper–Pearson lower limit on β gives, with probability at least one minus the chosen error level, an upper bound on every selection policy's gain over single-best; if it is below the overhead, "no policy in the class can pay for itself". The author calls (i)–(ii) "elementary identities".
- **Why ρ underprices β (Prop. 2, §5).** If each query is, with some probability, "co-hard" (all models err) and otherwise models err independently, a single-factor Gaussian copula (correlation below one) calibrated to the same error rate and pairwise correlation predicts an all-wrong rate falling to zero as the pool grows, while the true rate stays above the co-hard probability; their ratio is one at two models, grows without bound, and is eventually strictly increasing in pool size.
- **Non-identification (Prop. 3, §5).** For three or more models, error distributions with identical one- and two-model marginals (so identical error rates and pairwise Pearson and tetrachoric correlations) can differ in β, so no statistic computed from pairwise correlations identifies it. The author claims "no novelty for the mathematics".
- **Economics and churn (Apps. A, E):** budgets, ensemble size, cascades; not load-bearing for the empirical results, the author says (§3; §5 "Optionality under churn").

## Results

- **Open-ended math (§5 "The mispricing…"; Fig. 2).** On MATH-500 (all 67 models, 330 queries) it reports β = 0.052 (17 all-wrong; Clopper–Pearson 0.030–0.081) against 0.021 from the tetrachoric one-factor copula and 0.023 from the full 67×67 Gaussian copula: about 2.5× underpricing (bootstrap 90% CI 1.7–3.4). A Clayton copula also underpredicts; naive Pearson calibration gives a spurious, much larger gap. Over random sub-pools the ratio rises monotonically with pool size. MATH-Hard replicates, the "same task family"; the finding is "measured, not a law" (§5).
- **Code (§5; App. F; Tab. 3).** β = 0.079 (5 of 63; Clopper–Pearson 0.026–0.176), underpriced 3.1× (90% CI 1.5–6.2).
- **Science and format (§5 "Two regimes…"; Tab. 3; Fig. 3; App. G).** Multiple-choice GPQA-Diamond (52 models) has no all-wrong query (of 130), yet oracle gain 0.154, which the author calls resolvable disagreement. Asked free-response, the same questions give β = 0.127 (10 of 79; Clopper–Pearson 0.062–0.220; judge agreement "substantial-to-near-perfect"), positive under every judge-aggregation rule tried.
- **Routing (§5 Pillar A, 15-model saturated mix; Fig. 9).** A held-out TF-IDF-plus-domain router captures 9% of the oracle gain (CI spans zero); three stronger routers do no better; GPT-5-mini as router always picked single-best, capturing none.
- **Voting and fusion (§5 Pillar B).** Three-model majority votes lose to their best member on average; the rise with lower ρ is not significant under model-clustered inference. At matched quality, low-correlation fusion beats Self-MoA at three draws per side by +0.027, averaged over 60 resplits, positive in all; "supported in one regime, not established".
- **Cascades (§5 Pillar C; Fig. 6).** The advantage over random mixing falls toward zero as the verifier's AUC falls toward one half, and holds in a 5-fold held-out test.

## Limits the authors state

- "Programmatic grading covers verifiable tasks only and is sensitive to answer-extraction heuristics that can mildly penalize verbose models"; "Saturated benchmarks inflate ρ, mitigated but not removed by the hard regime" (§7).
- "The decisive all-models-wrong counts are small" (§1); the MATH ratios come "with wide CIs" (§5).
- Routers ran only on the 15-model mix; the market-scale routing claim rests on the certificate, "not an end-to-end routing run" (§5 Pillar A).
- The code magnitude rests on 5 events, 18 models and a "strict-but-not-official judge" (§7).
- Free-response GPQA covers 79 of 130 questions, LLM-graded, without human adjudication (App. G).
- The cascade is compared with a naive confidence cascade, not Dekoninck et al.'s optimal policy; its verifier scores only the cheap model, "a practical, provably-dominated choice" (§7).
- The matched-quality test rests on one provider-matched band; G lacks seed replication; static-price results hold only within a release epoch (§7).

## Open problems and building blocks

  - "Whether this holds on open-ended generative tasks beyond our verifiable benchmarks is open" (§8); whether a router could capture the GPQA gain (§5 "Two regimes…").
  - Items "for a top-venue submission": three or more seeds and held-out model selection for the matched-quality result; fitting the diversification sensitivity across ρ levels; a price-controlled test of the cascade's tail-edge effect (§7).
  - Jitkrittum et al.'s two-model deferral bound (§5 Pillar C); a human-calibrated judge on all 130 GPQA questions (App. G).
- **Released:** the paper says it releases the outcome matrices, the model registry, the graders, all analysis scripts, and the certificate as the tool `beta_certificate.py` (App. C).
- **To reuse it:** the certificate needs the all-wrong count over n graded i.i.d. queries and the single-best accuracy (App. C; Prop. 1 (iii)).

## On this site

- **Tags:** <span class="tags"><a class="tag" href="#/tags/stats">stats</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/scaling-general">scaling-general</a></span>
