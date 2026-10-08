# Towards Reliable LLM Evaluation: Correcting the Winner's Curse in Adaptive Benchmarking

**Towards Reliable LLM Evaluation** · preprint 2026

Read: [PDF](https://arxiv.org/pdf/2605.05973) · [arXiv](https://arxiv.org/abs/2605.05973)  
Code: [siren](https://github.com/jefferyz001/siren)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- A reporting protocol for scores after prompt or program search. Its target is the fresh-data performance of the whole tune-then-deploy procedure at each tuning budget, not the winning artifact's score (§2). It freezes the shortlist the search returned and, on a separate evaluation pool, repeatedly splits the items into a scoring part that sets smooth selection weights (softmax by default, §3.3, §4) and a held-out part that scores the result, with an item-level Gaussian multiplier bootstrap for intervals and simultaneous bands over budgets (abstract; §3.1–3.2).
- Proves a first-order item-level expansion of the estimator and the bootstrap's validity for a fixed shortlist and smooth selection (§3.3; App. B), checks them in simulations (App. C.1), and compares the protocol with four reporting baselines (naive max, max with a Wald interval, one split, repeated-split argmax) and with PromptEval on MMLU-Pro Math and Law, with random-search and DSPy tuners on eleven open-weight models (§4). On the real data the reference θ* is a Monte Carlo approximation of SIREN's own reporting target (§4; Eq. (7), §3.2).
- Selection bias after search, on checked answers (<a class="tag" href="#/tags/stats">stats</a>): in a simulation where every artifact is equally good and both systems are scored on the same items, the authors report that same-data best-of reporting declares the system that tried 50 artifacts better than one that tried 3 in 94.0% of trials (App. C.1.3, Tab. 8); on MMLU-Pro they report that winner-based reporting can change tuned-versus-default conclusions (abstract; §4.2).

## In plain words

When an optimizer tries many prompts or LLM programs on benchmark questions and keeps the best, the winner's score there can be too high, partly from luck. The authors call this gap "the winner's curse in adaptive benchmarking" and argue for reporting how well the tune-then-deploy recipe does on new questions at each budget (§1). SIREN runs after tuning: it fixes the returned candidates, repeatedly splits a separate question pool into one part that weights the candidates and one that scores the weighted mix, and gets confidence intervals by randomly reweighting questions (§3). They prove these intervals valid for large pools, under conditions including a fixed candidate list and a smooth weighting rule, for the average SIREN result over redrawn pools with splits fixed (§3.2–3.3). In a simulation with all candidates equally good and both systems on the same questions, scoring each winner on the questions that picked it declares a system that tried 50 candidates better than one that tried 3 in 94.0% of trials (App. C.1.3, Tab. 8). They claim no first; they ask "a different question" (§1).

## Background and terms

**Terms to know:** [bootstrap resampling](#/glossary/bootstrap-resampling); the others are below.

**The paper's own terms:**
- **artifact**: a deployable configuration, such as an instruction, demonstrations, decoding choices or an LM program (§2).
- **tuner, budget B**: a rule mapping a development sample to one artifact; B is its cost (§2), tokens in the experiments (§4).
- **procedure-level target**: the expected new-item score of the artifact the budget-B tuner returns, averaged over development samples, tuner randomness and new items (§2, Eq. 3).
- **frozen shortlist**: the candidates kept after search stops; SIREN "only scores and reweights these retained artifacts" (§3.1).
- **split**: a division of the evaluation pool into a scoring subset, used only to set weights, and a held-out subset, used only to score (§3.1).
- **selector**: maps scoring-subset scores to weights over the shortlist; softmax with a temperature is smooth, hard argmax (pick the single best) is not (§3.1, §3.3).
- **finite-sample reporting target** (Eq. 7): the expected SIREN estimate given the split design, with the evaluation pool redrawn and tuning and splits fixed (§3.2).
- **item-level contribution**: an item's first-order (linearized) effect on the estimate through its held-out scores and, via the selector's derivative, the weights (§3.2; App. B.2).
- **Gaussian multiplier bootstrap**: multiply each item's estimated contribution by an independent standard normal draw, one per item, shared across systems and budgets (§3.2).
- **M1–M4**: M1 reports the best candidate's full-pool score; M2 adds a Wald interval on the same items; M3 picks on one fold and scores on another; M4 averages M3 over R splits with a Student-t interval (a standard small-sample interval) from the spread across splits (§4).
- **bias, dir**: estimate minus the reference θ* (defined below), in percentage points; dir counts cells whose tuned-versus-default direction agrees with the references' (§4.1).

**Missing glossary terms:**
- **winner's curse**: "the empirically best option is likely to have benefited from positive noise, so conventional estimates and confidence intervals for selected winners can be optimistic" (App. A).
- **coverage**: the share of trials in which a nominal 95% interval contains its target (App. C.1.1).
- **central limit theorem (CLT)**: an average of many independent bounded contributions is approximately normal (general definition; Thm. 1, §3.3).
- **Wald interval**: estimate ± about two standard errors (general definition; used for M2, §4).
- **item response theory (IRT), Rasch model**: the chance of a correct answer depends on item difficulty and a candidate's latent quality. PromptEval fits a "Rasch IRT model" (§4.3); the simulations draw scores from such a model (App. C.1; the Rasch reading is ours).

**Builds on:**
- PromptEval [24] (Polo et al.), which models scores over a prespecified prompt pool with IRT under limited budgets: "the closest external baseline" (§4.3; App. A).
- Prompt and program optimizers as upstream tuners: OPRO ([OPRO](#/papers/yang2023opro "Large Language Models as Optimizers (2024)")), DSPy ([DSPy](#/papers/khattab2023dspy "DSPy: Compiling Declarative Language Model Calls into Self-Improving Pipelines (2024)")), MIPRO ([MIPRO (shipped in DSPy as MIPROv2)](#/papers/opsahlong2024mipro "Optimizing Instructions and Demonstrations for Multi-Stage Language Model Programs (2024)")), TRIPLE (fixed-budget [best arm identification](#/glossary/best-arm-identification)) and OPTS (bandit-based strategy selection) (§1; App. A).
- Work on how "repeated data use and data-dependent selection invalidate naive uncertainty estimates": the reusable holdout (Dwork et al.); post-selection inference (inference after a model, coefficient or hypothesis is chosen from the data); the winner's curse (Andrews et al.) (App. A).
- Gaussian multiplier bootstraps for maxima (Chernozhukov et al.) (App. A).

## Problem and setting

- **Question:** "after budgeted adaptive search has produced the reported artifact, what can be said about the fresh-data performance of the resulting tune-then-deploy procedure?" (§1).
- **Assumptions:** scores in [0, 1], possibly random (§2); evaluation items drawn independently from one distribution, separate from the tuning data (§3, §3.1); everything conditional on the completed tuning (§3.3); large-pool asymptotics (§3.3; App. B.1); a finite budget grid fixed in advance (§2).
- **Experiments:** MMLU-Pro ("reasoning-focused questions and larger answer sets", App. A), subjects Math and Law; tuners random search and DSPy (which compiles LM pipelines against a task metric, App. A); eleven open-weight instruction-tuned models (§4; Tab. 3); token budgets 500K, 1.5M, 3M, 6.5M. Tuning and reporting use disjoint pools; all methods share shortlist and pool (§4). Unless otherwise stated: 10 splits, half for scoring, softmax at temperature 1, uniform split weights, 2,000 bootstrap draws (§4).
- **What counts as correct:** on real data the reference θ* is a Monte Carlo approximation, over 10,000 redraws, of the Eq. 7 reporting target (§4). Simulation ground truth is "known by construction" (App. C.1) or estimated by Monte Carlo (App. C.1.1); Study B computes each method's own target (App. C.1.2).
- MMLU-Pro pool and shortlist sizes, and the default (untuned) configuration: not discussed.

## Approach

- **Protocol (§3.1; Fig. 1).** In each split, per system and budget: score every candidate on the scoring subset, turn scores into weights with the selector, score the weighted mix on the held-out subset; then average over splits with fixed weights (Eq. 6).
- **Uncertainty (§3.2).** Multipliers on the item contributions give pointwise intervals (per system and budget), simultaneous bands (all at once), and pre-specified equal-budget and cross-budget comparisons, without rerunning the tuner.
- **Thm. 1, "Selection-aware CLT" (§3.3; formal Thm. 3, App. B.4).** SIREN's error, jointly over systems and budgets, is approximately normal, with one term per item covering its held-out effect and its first-order effect through the selection. Conditions: conditional on the split design and completed tuning; the pool grows with the numbers of systems, budgets, splits and candidates fixed; split sizes proportional to the pool; a "stabilized smooth" selector with uniformly bounded derivatives (formally twice continuously differentiable near the population scores, Assumption 1); items and their execution randomness (randomness in scoring, §2) independent and identically distributed, independent of the splits; scores in [0, 1]; nonnegative split weights summing to one. The normal limit also needs the items' average score covariance (how scores vary together) to converge to a limit (Thm. 3). Softmax-type selectors are covered; hard argmax "requires smoothing or an additional margin condition" (§3.3; margin: the quality gap between candidates, App. C.1.2).
- **Thm. 2, "Multiplier bootstrap validity" (§3.3; formal Thm. 4, App. B.5).** Under Thm. 1's regime and covariance condition, if the computable item contributions approximate the true ones (average squared discrepancy vanishing as the pool grows), the bootstrap gives asymptotically valid pointwise intervals and simultaneous bands for the Eq. 7 target over the budget grid. Prop. 2 (App. B.6): a bounded selector derivative changing at most proportionally to score changes (Lipschitz) gives that approximation (under Assumption 1).
- **Adaptive rule (App. C.1.2).** A winner-instability score (share of splits whose best candidate differs from the majority winner) switches between hard and soft selection.

## Results

- **Against M1–M4 (§4.1, Tabs. 1–2).** Over four subject–tuner summaries, the authors report M1's mean signed error at +1.01 to +1.90 points and SIREN's at −0.20 to +0.08. SIREN gets the direction right in 40–43 of 44 cells per summary; M1 falls to 15 on Law with random search (SIREN 42); on Law with DSPy, M1, M2 and M4 tie SIREN at 40. They locate the error in "the selected-winner point estimate itself" (§4.1).
- **Deployment calls (§4.2, Tab. 3; Tabs. 9–11).** "winner-based reporting can change the deployment verdict, especially in small-gap cases" (§4.2).
- **Against PromptEval (§4.3, Tab. 5; Tabs. 12–17).** On Math with DSPy, PromptEval's bias runs from −8.15 to −8.75 points with 5% of the score matrix observed to +1.33 to +1.95 at 20% or more, against SIREN's −0.09 to −0.03: "sparse PromptEval is too pessimistic, while dense PromptEval approaches the optimistic same-data winner" (§4.3).
- **Simulations (App. C.1).** Study A: over fifteen pool and shortlist sizes at 5 splits, 95% intervals cover 93.9% to 95.9% of the time, matching a full item bootstrap "at a fraction of the computational cost" (App. C.1.1, Figs. 2, 4). Study B, with two artifacts: hard argmax coverage falls to 89.8% at a quality gap of 0.20; softmax holds between 93.7% and 96.0% (App. C.1.2, Tab. 7). Study C, all artifacts equally good, both systems on the same items: same-data best-of reporting picks the 50-artifact system over the 3-artifact one in 94.0% of trials, against 48.3% at 3 versus 3 (App. C.1.3, Tab. 8); SIREN's intervals "overlap in essentially every trial".

## Limits the authors state

- "The formal guarantees are therefore conditional on the completed search and the fixed shortlist, rather than on resampling an unrestricted search process." (§1)
- Hard argmax needs smoothing or a margin condition (§3.3); its bootstrap undercovers near ties because argmax "has zero derivative almost everywhere" (App. C.1.2).
- The adaptive rule "does not fully close the gap at boundary points"; "a practitioner who needs guaranteed nominal coverage should use soft selection throughout", which costs width when the margin is large (App. C.1.2).
- "Repeated splits are cheap but not magical": extra splits add little once their number is moderate (App. C.1.1).

## Open problems and building blocks

- **Open:** "Fully open-ended adaptive search remains future work." (§5)
- **Released:** code ("Codes are available at", abstract).
- **To reuse it:** a frozen shortlist from the tuner, per-item scores of every candidate on a separate pool, a smooth selector; no tuner reruns (§3.2–3.3). App. C.1.1 gives a "practitioner recommendation" of 5 to 10 splits. Models ran on one NVIDIA RTX 4090 GPU (24 GB) (§4).

## On this site

- **Tags:** <span class="tags"><a class="tag" href="#/tags/stats">stats</a><a class="tag sub" href="#/tags/general-misc">general-misc</a><a class="tag sub" href="#/tags/llm-misc">llm-misc</a></span>
