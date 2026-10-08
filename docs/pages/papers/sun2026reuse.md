# Which Self-Improvements Should We Trust? Reliable Self-Improvement When Agents Reuse Their Benchmarks

**Which Self-Improvements Should We…** · preprint 2026

Read: [PDF](https://arxiv.org/pdf/2609.33180) · [arXiv](https://arxiv.org/abs/2609.33180)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- A certified evaluation and promotion rule for self-improvement loops that reuse one fixed evaluation set: with probability at least 1−α every promoted change is a genuine improvement on the task distribution (abstract).
- Limits the feedback returned to the search and accounts for possible promotion histories (abstract).
- Adaptive overfitting to a reused evaluation set, with a remedy: it reports the share of promotions that are false cut from up to 20.7% to 0% (abstract).

## In plain words

Self-improving AI systems propose changes to themselves (prompts, code) and keep those scoring better on a benchmark. The authors say such systems typically reuse a fixed set of benchmarks, so later proposals are shaped by earlier results on them; the search can overfit them, and a kept change may not be a real improvement (abstract, §1). Their rule, REUSE (Risk-controlled Evaluation Under Sequential Evolution), decides which to keep: the search sees only the keep-or-reject decisions, never the scores, and the allowed error is split in advance over every sequence of decisions the run could produce. With probability at least one minus an error level the user picks, every kept change is then a real improvement (abstract). In runs where a 7-billion-parameter language model edits a pipeline for one classification task, they report the share of false kept changes falling from up to 20.7% for compared rules to 0%, with final gains "comparable to the best baselines" (abstract). They present it as jointly handling three sources of error that, they say, no recent statistical-control method for self-improvement handles together (§1).

## Background and terms

**Terms to know:** [multiple testing](#/glossary/multiple-testing) · [exact paired sign test](#/glossary/sign-test)

**The paper's own terms:**
- **promotion**: accepting a candidate as the new current system (the incumbent); a **false promotion** improves population performance by at most a threshold γ, zero in Thm. 1 and the experiments (§2.1, Tab. 2).
- **population performance**: expected score on a fresh task, as opposed to the score on the reused evaluation set S of n tasks (§2.1).
- **three sources of false promotion**: within-round selection (picking the best of several favours advantages overstated by chance), repeated testing (many tests make one error likelier) and adaptive dependence ("Later candidates are adapted to earlier evaluation outcomes"); the first two would arise even with fresh data (§1).
- **decision history**: which rounds promoted and which candidate won (§2.2).
- **running certificate C_t**: the sum over promotions of max{ℓ, 0}, where ℓ is a lower confidence bound on the step's gain, hidden from the proposer (§2.2); the **direct certificate D_t** bounds the gain over the starting system in one comparison, at a separate error level (Prop. A1).
- **optimism gap**: the final gain measured on S minus the population gain (§3.1).
- **threshold gate**: promote the candidate with the largest standardized mean gain on S if it exceeds a fixed threshold set by the round and promotion count (Def. A1).

**Missing glossary terms:**
- **recursive self-improvement (RSI)**: systems that propose modifications to themselves, with evaluation deciding which are kept (abstract, §1).
- **union bound**: the chance that any of many tests errs is at most the sum of their error chances, so splitting α among them caps it at α (§2.2).
- **lower confidence bound**: a value below the true quantity except with a chosen small probability (App. A.1, A.3).

**Builds on:**
- SGM (a Statistical Gödel Machine with a global error budget) and PACE (sequential tests valid however often results are checked), gates that, the authors say, "typically treat candidates as independent of the test data or restrict feedback" without accounting for what promotion decisions reveal (§4); not listed here.
- Adaptive data analysis (reusing a held-out set for questions chosen after earlier answers), whose information bound REUSE turns into "exact finite-sample tests for each promotion" (§4); not listed here.
- DGM (Darwin Gödel Machine) and SICA (a Self-Improving Coding Agent), agents that "rewrite their own tools" (§1), and AlphaEvolve ([AlphaEvolve](#/papers/novikov2025alphaevolve "AlphaEvolve: A coding agent for scientific and algorithmic discovery (2025)"), an evolutionary coding agent), whose searches the baselines follow or draw on (§3.1).

## Problem and setting

- **Question:** can one fixed evaluation set support repeated adaptive decisions while guaranteeing that every promotion is a population improvement (§2.1)?
- **Assumptions:** S is an i.i.d. (independent, identically distributed) sample from the task distribution, drawn independently of the proposer's randomness, the development data and the starting system (Assumption 1); decision-only feedback, so that candidates depend on S only through past promotion decisions, plus a technical measurability condition that "holds for essentially any practical proposer" (Assumption 2, §2.1). Thm. 1 covers pass/fail scores with γ = 0; an extension covers scores in [0, 1] (§2.2, App. A.4).
- **Experiments:** binary classification on Covertype (public forest cover-type data); systems are scikit-learn pipeline configurations, scored by accuracy (§3.1, Tab. 2).

## Approach

- **Each round (Fig. 1, Alg. 1):** the proposer generates K candidates; each is compared with the incumbent on the same n tasks by the exact one-sided paired sign test (Eq. 3). A candidate passes if its p-value is at most ρ·δ_{t,p}, with δ_{t,p} its error budget and ρ the share for the test; the passing candidate with the largest mean gain on S is promoted, and only the decision goes back. The rest of the budget yields the bound ℓ for C_t (§2.2).
- **Error allocation (Eq. 4):** at round t after p promotions, δ_{t,p} = α·w_t·v_p / (C(t−1, p)·K^{p+1}): weights w_t over rounds (repeated testing) and v_p over promotion counts spread α; the extra K handles within-round selection, and C(t−1, p)·K^p, the number of histories with p promotions, handles adaptive dependence (§2.2). Because, once the proposer's randomness, development data and starting system are fixed, each history determines the candidates without S, this turns adaptive dependence into "a multiple comparison problem over all possible decision histories" (§2.1).
- **Thm. 1:** for pass/fail scores with γ = 0, under Assumptions 1 and 2, running Alg. 1 with Eq. 4, for every such proposer: with probability at least 1 − α every promoted step strictly improves population performance, and on the same event the total gain is at least C_t at every round. If development data pick one candidate and only it is tested on S, the theorem applies with K = 1 (§2.2).
- **Minimum detectable improvement (Prop. 1):** for pass/fail scores, γ = 0 and ρ = 1/2, at a fixed history, with pairs fixed independently of S and disagreeing on a task with probability d, under asymptotic conditions (App. A.6): a true gain a fixed factor above √(2d·ln(2/δ_{t,p})/n) passes with probability tending to one; if all K gains are a fixed factor below it, promotion has probability tending to zero.
- **Lower bound (Thm. A1):** in a constructed model with bounded non-binary scores (App. A.7.1), for threshold gates, under the conditions of Cor. A2–A3 and the asymptotic regimes of Remark A3, a proposer seeing only decisions can cause a false promotion with probability tending to one if the threshold parameters stay "uniformly below" (at every relevant round) the leading-term ("first-order") rate ln(tK) before the first promotion, or P·ln(Kt/P) over the relevant rounds after P promotions, by a fixed factor. REUSE's history term agrees with this rate to first order as K times the rounds per promotion grows, the authors say (Remark A3).

## Results

- **Setup:** 30 seeds at each n of 2,000 or 10,000; 200 rounds; Qwen2.5-7B-Instruct proposes up to 8 modifications per round; a held-out set H of 50,000 examples, seen by no method, judges population gain; α = 0.05 (§3.1, Tab. 2). Only REUSE hides accuracies on S from its proposer (Tab. 3).
- **Baselines (§3.1, Tab. 4):** Empirical best-of-K, SICA-style, DGM-style, Elite and Niche-elite (the last two inspired by AlphaEvolve) promote the largest positive gain on S, differing in search. PACE-style applies a one-sided McNemar test (a normal-approximation test on the disagreeing tasks, App. B.3) at 0.05 per candidate; Bonferroni-style splits 0.05 evenly over all potential comparisons of a run.
- **False promotions:** REUSE makes none at either size (Tab. 1), against up to 20.7% of promotions for the compared rules (abstract). PACE-style "still commits false promotions at both evaluation set sizes" (§3.2).
- **Final population gain:** REUSE 7.02 percentage points (pp) against 7.04 pp for Empirical best-of-K at n = 2,000; 7.19 pp against 7.19 pp (best-of-K) and 7.23 pp (PACE-style) at n = 10,000 (Tab. 1).
- **Promotions per run**, n = 2,000: 3.2 for REUSE against 13.0 for Empirical best-of-K (Tab. 1).
- **Bonferroni-style** at n = 2,000 makes no false promotion but gains 2.35 pp against REUSE's 7.02 pp (§3.2).
- **Authors' reading:** REUSE's "optimism gap stays within one standard error of zero at both sizes", "proving that it eliminates adaptive overfitting" (§3.2).
- **Ablations (App. B.4.1):** 11 budget allocations on 10 fresh seeds at n = 2,000 made no false promotion (Tab. 6). At n = 10,000, with REUSE's pre-screening on development data loosened to let poor candidates reach S, removing the test on S gave 6 false promotions in 5 of 10 runs, against none among REUSE's 47 accepted updates (Fig. 4).
- **Certificates:** at n = 2,000 the mean running certificate is 0.92 pp and the direct one 3.10 pp, against a realized 7.02 pp; both are at most the realized gain in every run at both sizes (Tab. 10).

## Limits the authors state

- REUSE's "exact test is not literally a member of this class", and "the comparison does not by itself establish a lower bound for every pass/fail promotion rule" (Remark A3).
- "the results do not assert that every individual threshold must exceed the stated rate" (Remark A3).
- The power statements "are not conditional on reaching that history in an adaptive run" (App. A.6).
- "Neither bound dominates in every configuration" (C_t and D_t, App. A.5).

## Open problems and building blocks

- **Open:** "larger agentic settings like coding and model post-training"; "richer signals including rounded scores, privatized summaries, or periodically refreshed evaluation sets"; "secondary metrics like safety and cost" (all §5).
- **Released:** Nothing stated.
- **To reuse it:** an evaluation set independent of everything that shapes the search, reaching the search only through decisions (Assumptions 1–2); weights and split fixed before S is queried (App. B.4.1). It places "no restrictions on the underlying proposer or agent architecture" (§5).

## On this site

- **Discussed in:** [Self-improvement that compounds](#/challenges/compounding_self_improvement) · [Comparing LLM methods under noise](#/challenges/method_comparison_under_noise) · [The self-improving SQL ↔ text ↔ verify loop](#/challenges/sql_text_round_trip_loop)
- **Tags:** <span class="tags"><a class="tag" href="#/tags/stats">stats</a><a class="tag sub" href="#/tags/hacking-general">hacking-general</a><a class="tag sub" href="#/tags/llm-misc">llm-misc</a></span>
