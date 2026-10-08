# SAGE: A Statistical Acceptance Gate for Self-Evolving Agents

**SAGE (Statistical Acceptance Gate)** · preprint 2026

Read: [PDF](https://arxiv.org/pdf/2609.36043) · [arXiv](https://arxiv.org/abs/2609.36043)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- An acceptance gate for agents that evolve a skill document: instead of keeping any edit that raises the aggregate validation score, it compares the current and the edited skill item by item, weighs a regression more than a repair, caps the share of solved items an edit may break, and commits only when a one-sided exact binomial test on the discordant items rejects, abstaining otherwise (abstract; §3.2–3.3).
- Edits come from SkillOpt's optimizer unchanged, under an equal budget of proposals and tokens; five benchmarks (LiveMath, SpreadsheetBench, SearchQA, OfficeQA Pro, ALFWorld) and four open-weight backbones (§4.1).
- A statistical gate for [SkillOpt](#/papers/yang2026skillopt "SkillOpt: Executive Strategy for Self-Evolving Agent Skills (2026)")'s loop, against the Optimizer's Curse ([The Optimizer's Curse](#/papers/smith2006optimizerscurse "The Optimizer's Curse: Skepticism and Postdecision Surprise in Decision Analysis (2006)"), cited in §1 and §3.1): it reports a regression rate ("the fraction of the items the current skill already solves that an accepted edit breaks", §4.2) of 42.8% for SkillOpt's gate on OfficeQA with DeepSeek-V4 (abstract; Tab. 1). The gate's three hyperparameters are tuned on held-out data, and its guarantee holds per comparison, not over a trajectory (§5.2).

## In plain words

Some LLM agents improve themselves by editing a skill document; a gate decides whether to keep each edit. The authors say the usual gate keeps any edit that raises the average validation score, which lets in edits that break questions the skill already solved, and edits that only looked better by luck on a small, noisy validation set (abstract; §1). Their gate, SAGE, compares old and edited skill question by question, counts a newly broken question at least as much as a newly solved one, caps the share of solved questions an edit may break, and keeps an edit only when a statistical test says its wins reliably outweigh its losses. Edits come unchanged from SkillOpt's optimizer, with equal budgets (§4.1). Across five benchmarks and four LLMs, against SkillOpt's gate, SAGE lowers the share of solved questions that accepted edits break in 19 of 20 settings and matches it in the last, and has the highest final score in all 20 (abstract). They call the gate "an overlooked bottleneck" (§1) and SAGE "a conservative refinement of the standard gate" (abstract).

## Background and terms

**Terms to know:** [agent skill](#/glossary/agent-skill) · [McNemar's exact test](#/glossary/mcnemars-exact-test) · [sign test](#/glossary/sign-test) · [Wilcoxon signed-rank test](#/glossary/wilcoxon-signed-rank-test)

**The paper's own terms:**
- **skill document** (or skill): a persistent text that "encodes their workflow, tool-use rules, and decision logic" (abstract); only this text is edited, the model stays frozen (§3.1).
- **gate**: decides whether a candidate edit replaces the current skill, the **incumbent** (§3). The **naive gate g₀** is SkillOpt's rule: keep an edit exactly when its average validation score is strictly higher than the incumbent's (§3.1, Eq. 3).
- **win / regression / tie**: per validation question, the edit solves what the incumbent misses (win), the incumbent solves it and the edit breaks it (regression), or both agree (tie) (§3.2). Wins and regressions are the **discordant** outcomes; w and ℓ count them (Eqs. 4–5).
- **λ (regression weight)**: the gate scores an edit by wins minus λ times regressions, the "discounted net gain" Δλ, with λ ≥ 1 so that "a regression cost at least as much as a repair rewards" (§3.2, Eq. 7).
- **ρ and τ (regression cap)**: ρ is the share of the incumbent's solved questions that the edit breaks; the gate requires ρ ≤ τ (§3.2–3.3, Eqs. 7, 11).
- **α (significance level)**: the threshold the test's p-value (the chance of a record at least this good if the edit were no better than break-even) must fall below (§3.3).
- **regression rate** (the experiments' metric): "the fraction of the items the current skill already solves that an accepted edit breaks" (§4.2).
- **C1**: the "paired-comparison variant", which "uses the per-item paired criterion without the statistical test" (§4.3).
- **equal-budget protocol**: "an equal number of proposed edits and equal token cost" (§4.1).

**Missing glossary terms:**
- **Optimizer's Curse**: when one picks the option with the highest observed score among noisy estimates, that best score is biased upward (§1, citing Smith and Winkler, 2006). The paper applies it to keeping edits that "were lucky rather than better" (§1).
- **one-sided exact binomial test**: asks whether m trials gave more successes than a fixed success probability explains, computing that chance exactly; only an excess counts as evidence (§3.3, Eq. 10).

**Builds on:**
- **SkillOpt** (Yang et al., 2026; [SkillOpt](#/papers/yang2026skillopt "SkillOpt: Executive Strategy for Self-Evolving Agent Skills (2026)")), which treats the skill as the trainable state of a frozen agent with bounded edits (§2); the paper calls it "The current state-of-the-art (SOTA)" (§1) and keeps its optimizer and setting, changing only the gate (§3.1, §4.1).
- **The Optimizer's Curse** (Smith and Winkler, 2006; [The Optimizer's Curse](#/papers/smith2006optimizerscurse "The Optimizer's Curse: Skepticism and Postdecision Surprise in Decision Analysis (2006)")), the second weakness in §1; §3.1 ties both components to it (also §3.3).
- **Asymmetric counterfactual utilities** (Ben-Michael, Imai and Jiang, 2024; Träuble et al., 2021): the "first-do-no-harm principle" behind weighting regressions more (§3.2).
- **Hawinkel, Thas and Maere (2025)**, cited for: reducing the error of each score "does not imply a more accurate ranking" (§3.3).

## Problem and setting

The question: how should the gate decide when validation is "finite and noisy" (§1)? Following SkillOpt (§3.1), the gate receives the incumbent and a batch of candidate edits, and scores each on a held-out validation set with a frozen target model and a **binary verifier** (1 if the skill solves the question, else 0). The hyperparameters λ, τ and α "are tuned on held-out data only", and "The test set is unseen during the whole optimization process" (§3.2).

Experiments (§4.1): five benchmarks, chosen following SkillOpt: LiveMath (LiveMathematicianBench, mathematician-level reasoning), SpreadsheetBench (SSB, real-world spreadsheet manipulation), SearchQA (question answering with search-engine context), OfficeQA Pro (an enterprise benchmark for grounded reasoning) and ALFWorld (text versions of embodied tasks in an interactive environment), glossed from the cited titles. DocVQA (questions on document images) is left out because "not all four backbones support visual input". Backbones: the open-source models DeepSeek-V4-flash (DeepSeek-V4 in the tables), GLM-5.2, MiniMax-M3 and Qwen3.6. SkillOpt's optimizer proposes every edit; "the only difference is the gate that accepts them" (§4.1). Not discussed: the values of λ, τ and α used, the validation-set sizes, the number of runs per setting, and whether the regression rate is measured on validation or test questions.

## Approach

SAGE has two components that share one per-question record (§3.1, Fig. 2).

- **Per-item paired evaluation (§3.2).** Run incumbent and candidate on the same validation questions; count wins w and regressions ℓ. An edit with one more win than regressions passes g₀, though it "may have quietly broken ℓ items the current skill already solves" (§3.2). SAGE summarizes the record by the discounted net gain and the regression share ρ.
- **Hypothesis-test denoising (§3.3).** The authors argue for testing the paired record rather than pulling each edit's average score toward the mean: scores on a shared validation set are correlated through common question difficulty, which pairing holds fixed within each comparison (§3.3). Let the population gain be the probability of a win minus λ times the probability of a regression, for a question drawn from the target distribution (Eq. 8), and q the probability that a discordant outcome is a win. Whenever discordant outcomes have nonzero probability, a positive population gain is equivalent to q exceeding the break-even level λ/(1+λ) (Eq. 9). SAGE tests this with a one-sided exact binomial test, conditional on the number of discordant questions (Eq. 10); with none, the p-value is 1 and the gate abstains. At λ = 1 this "reduces to the one-sided exact McNemar test" (§3.3). At λ = 1, five wins to three losses "does not reach significance, whereas eight wins to zero losses does" (§3.3).
- **The gate (Eq. 11).** Commit the edit only when the discounted net gain is positive, the p-value is below α, and ρ ≤ τ; otherwise keep the incumbent.
- **Relation to g₀ (§3.3).** At λ = 1, α = 1, τ = 1 the gate accepts exactly when wins exceed regressions, which is g₀. With λ ≥ 1, α ≤ 1 and τ ≤ 1, any edit SAGE accepts against an incumbent would also be accepted by g₀ against that incumbent. The authors say α "should match the task noise", for instance "verifiable tasks can use a looser gate, while noisy tasks should use a stricter one, where abstention is expected" (§3.3).

## Results

- **Regressions (§4.2, Tab. 1; naive gate also in Fig. 1).** The paper reports that SAGE lowers the regression rate in 19 of 20 backbone–benchmark settings and matches it in the remaining one (GLM-5.2 on SearchQA). With DeepSeek-V4 it drops from 36.5% to 0% on LiveMath and from 42.8% to 0% on OfficeQA. The naive gate already regresses little on SearchQA and "comparatively little" on ALFWorld, so there is "less to prevent" (§4.2).
- **Final scores (§4.3, Tab. 2).** SAGE has the highest final score in all 20 settings, improving over vanilla SkillOpt by 8.73 points on average. With DeepSeek-V4 it raises LiveMath from 34.15 to 48.78 and OfficeQA from 32.93 to 45.12.
- **Components (§4.3, Tab. 2).** C1 beats SkillOpt in every setting, by 6.20 points on average; full SAGE beats C1 in all 20 comparisons, by 2.53 on average.
- **Where it helps (§5.1).** The gain "tracks how readily the baseline gate regresses": with DeepSeek-V4, the two largest gains are on LiveMath and OfficeQA, where the naive gate regresses most, and the benefit is small on ALFWorld and SearchQA, where it regresses little. On verifiable, low-noise tasks SAGE "reduces to a near pass-through" (§5.1).

## Limits the authors state

- The method assumes a binary verifier; "a continuous or graded reward would require a different paired statistic such as a signed-rank test that the current gate does not cover" (§5.2). §5.3 proposes one.
- The test uses only win and loss counts and discards magnitude, so "it can be insensitive to a small but consistent real improvement" (§5.2).
- The guarantee is per comparison: the exact test controls the false-commit probability for a fixed incumbent–candidate pair, but the validation set is reused across steps, so "trajectory-level error rates are not controlled" (§5.2).
- λ, τ and α are still tuned on held-out data, so "the gate is not yet free of manual configuration" (§5.2). §5.3 proposes an adaptive α set from an online estimate of task noise.
- Text-only benchmarks; DocVQA is omitted, "which leaves multimodal generalization open" (§5.2). §5.3 proposes adding DocVQA and a multimodal model such as LLaVA.
- Pairing removes shared question difficulty, but "stochastic execution noise may remain" (§3.3).

## Open problems and building blocks

- **Open:** "a co-design of the optimizer and the gate rather than the decoupled setting of this work" (§5.3). Multi-agent systems in which several agents evolve their own documents: a joint acceptance rule that accounts for inter-agent dependence and [credit assignment](#/glossary/credit-assignment-problem), including "how a harmful edit propagates along a collaboration chain to corrupt other agents and how several gates coordinate their decisions under a shared budget" (§5.3). The conclusion suggests statistical acceptance "extends naturally to graded verifiers and to multi-agent settings" (§6).
- **Released:** Nothing stated.
- **To reuse it:** a binary verifier, a held-out validation set on which the incumbent and each candidate are run, and tuned λ, τ and α (§3.1–3.2, §5.2).

## On this site

- **Tags:** <span class="tags"><a class="tag" href="#/tags/stats">stats</a><a class="tag sub" href="#/tags/harness-general">harness-general</a><a class="tag sub" href="#/tags/harness-promptopt">harness-promptopt</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/promptopt-context">promptopt-context</a><a class="tag sub" href="#/tags/promptopt-feedback">promptopt-feedback</a><a class="tag sub" href="#/tags/promptopt-general">promptopt-general</a></span>
