# The Winner's Curse in LLM Self-Improvement Loops: Selection Noise, Lock-in, and Acceptance Rules

**The Winner's Curse in…** · preprint 2026

Read: [PDF](https://arxiv.org/pdf/2610.09239) · [arXiv](https://arxiv.org/abs/2610.09239)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Models the keep-if-better step of self-improvement loops as selection under measurement noise, with candidates of a generation sharing the incumbent's error, and studies what reusing the selection set does (abstract; §3).
- Qwen models rewrite their own instructions from four failures per generation, on TREC, Banking77 and GSM8K, with every candidate also scored on a 600-item held-out set in its oracle-instrumented runs (§5); it compares greedy acceptance with McNemar, select-then-confirm and a Bayes gate in a pre-registered study (§5.3), with PACE's published test in an exploratory single-decision replay (§4; App. C, Tab. 13), and audits GEPA's and MIPROv2's validation scores (§5.4).
- Selection bias after search, measured on checked answers: it reports greedy loops' final selection-set score 13 to 20 points above held-out accuracy with 16 selection items, in the four settings where a model proposes for itself (abstract; §5.3; App. C Tab. 3), and that the tested acceptance rules did not beat greedy acceptance over whole runs (abstract).

## In plain words

Self-improving LLM systems propose changes to themselves and keep a change when it scores better on a small evaluation set, the same score their logs show as progress (§1). The authors note that picking the best of several noisy scores biases that score upward, and that in LLM loops the candidates are related rewrites and one small set is reused for many rounds (§1). They model this keep-if-better step statistically and test it in loops where small Qwen models rewrite their own instructions, with candidates also scored on 600 held-out items (abstract). In a study whose design was fixed in advance, keep-if-better loops' final score on their selection set exceeded held-out accuracy by 13 to 20 points with 16 selection items and by 1 to 5 points with 256, in the four settings where a model proposes for itself (§5.3, Tab. 3); the stricter acceptance rules tested "did not beat greedy acceptance over whole runs" (abstract). They present a model and measurement study and advise that studies report held-out gains with their uncertainty (abstract).

## Background and terms

**Terms to know:** [McNemar's exact test](#/glossary/mcnemars-exact-test) · [multiple testing](#/glossary/multiple-testing) · [reflective prompt optimization](#/glossary/reflective-prompt-optimization)

**The paper's own terms:**
- **generation, incumbent, candidate**: each generation a proposer writes K rewrites (candidates, K = 4 here) of the current instruction (the incumbent) (§3, §5); the **seed** is the starting instruction, distinct from random seeds (§5).
- **selection set** (n items): scores candidates item by item against the incumbent, reused across generations; **proxy**: the loop's score on it (§5).
- **gold (held-out) set**: 600 items per task "excluded from selection and feedback by item ID" (§5). **Oracle-instrumented runs** score every candidate on it; **native loops** are ordinary runs that don't (§5, §5.2).
- **inflation**: a program's selection-set score minus its held-out accuracy; **overstatement**: the gain measured on the selection set minus the held-out gain (§1).
- **acceptance rules** (§3, §4): **greedy** commits the best-measured candidate if its measured gain is positive; **McNemar** is a one-sided exact test against the incumbent at a fixed level; **PACE**, the test of Shawn (2026) as published, bets half its "wealth" on each item where candidate and incumbent disagree and commits when the wealth reaches 1/α (α the level); **select-then-confirm** chooses on one half of the selection set and commits only if the winner also wins on the other half; **Bayes gates** commit the largest posterior mean (expected true effect given the scores and a prior over effects) if it and the measured gain are positive, with the prior from a separate **pilot** run whose candidates were also scored on a large evaluation set (**pilot-calibrated**) or from the loop's history (**online**).
- **lock-in**: a "possible mechanism": the incumbent's lucky selection error, subtracted from later measured gains, "acts as an implicit threshold" if later candidates do not inherit an equally large error (§3.3).

**Missing glossary terms:**
- **winner's curse**: "When the best of several noisy estimates is selected, its estimate is biased upward" (§1).
- **shrinkage**: scaling a winner's measured advantage down by the share of the measured spread that is real (§3.1, §5.1).
- **pre-registration**: fixing design, hypotheses and tests "in a dated written plan before the first run started" (§5.3).

**Builds on:**
- PACE, Shawn (2026), one of two papers called "closest": it replaces greedy acceptance by a per-decision test (§2).
- SIREN, Xu et al. (2026b), on reporting after adaptive search; the authors target "the decision inside the loop instead" (§2).
- Selection under noise (§2, §3.1): the breeder's equation (real gain from selection = measured selection gap × the real share of variation) and the optimizer's curse ([The Optimizer's Curse](#/papers/smith2006optimizerscurse "The Optimizer's Curse: Skepticism and Postdecision Surprise in Decision Analysis (2006)"): the top estimate is biased high).
- GEPA ([GEPA](#/papers/agrawal2025gepa "GEPA: Reflective Prompt Evolution Can Outperform Reinforcement Learning (2026)"); reflects on failures, returns the best program on a reused validation set) and MIPROv2 ([MIPRO (shipped in DSPy as MIPROv2)](#/papers/opsahlong2024mipro "Optimizing Instructions and Demonstrations for Multi-Stage Language Model Programs (2024)"); searches a fixed pool of proposed instructions), audited in §5.4.

## Problem and setting

- **Questions** (§1): how correlated errors distort the winner's gain; how reused items change the incumbent; whether fixes for single decisions improve whole runs. "The first is derived under a fresh-set model; the other two are empirical".
- **Loop** (§5, App. B.1): unless stated otherwise solver and proposer are one model, Qwen2.5-1.5B- or 7B-Instruct, shown the instruction, a task description and four failures; seed instructions are one sentence long.
- **Tasks** (§5, App. B.1): TREC-50 (classifying questions by answer type), Banking77 (banking customer intents) and GSM8K (grade-school math), scored by deterministic rules.
- **Designs**: exploratory runs (three random seeds) drew failure examples from the selection set (§5.3); the pre-registered confirmatory study used a fresh gold set, a separate feedback pool, five hypotheses (H1–H5), four settings with nine arms of eight random seeds, and paired tests Holm-corrected for multiple testing (§5.3), plus Qwen2.5-14B proposing for the 1.5B solver (App. B.2).
- **Later studies** (§5.4): Qwen3.5-4B improving itself; GEPA and MIPROv2 in the DSPy library ([DSPy](#/papers/khattab2023dspy "DSPy: Compiling Declarative Language Model Calls into Self-Improving Pipelines (2024)")), with Qwen3.5-4B as task model and Qwen3.8-27B as proposer.

## Approach

- **Model** (§3, Assumption 1): given history and a fresh selection set, a generation's true candidate effects are independent normal draws with a mean (the proposal bias) and spread; each measured effect adds an error shared by all candidates (same incumbent and items) and the candidate's own error, all independent and normal.
- **Prop. 1** (§3.1): under Assumption 1, for the best-measured candidate before any acceptance filter, its expected true advantage over the generation mean is a fixed fraction (the real share of within-generation spread) of its measured advantage, and its measured gain overstates its true gain by an amount that grows with K, plus the mean shared error (zero on a fresh set).
- **Prop. 2** (§3.2): under Assumption 1 with the proposal mean and spread and both noise variances known, the rule maximizing one generation's expected true improvement commits the largest posterior mean if and only if it is positive; with no shared error and nonzero spread, it is a threshold on the measured gain, which, when proposals are harmful on average, rises with their mean harm and with the noise relative to the spread. It is optimal "only myopically" (§3.2).
- **Prop. 3** (§3.3): if all proposals share one harmful true effect, distributions stay fixed across generations, and the selection set is fresh each generation, greedy commits with a per-generation probability that rises with K and falls with n, and held-out performance drifts down while every commit reports a gain; "local to such a stationary regime" (App. A).

## Results

The authors report:
- **Proposals** (§5.1, Tab. 2): after the first rewrite "only 4 to 39% of rewrites improve on their incumbent".
- **Winner's curse** (§5.1, Fig. 1): the model's implied ratio of the winner's true to measured advantage matches the observed one in nine settings, on trajectories of 256-item loops.
- **Native loops** (§5.2, Tabs. 5–6, post hoc): first-generation commits overstate by 9.1 points observed against 9.0 modelled (with a separate pilot's prior) at n = 16, with errors of several points in single settings: "agreement on average, not as calibration". Commits against a selected incumbent overstate less than the fresh-set reference at every n, "consistent with lock-in".
- **Pre-registered study** (§5.3, Tab. 1, Fig. 2): the inflation drop above was significant in three settings, not Banking77 (H2). Held-out gains rose with n on TREC but not on GSM8K (H1); the exploratory Banking77 loss did not replicate (H3). At n = 16 the pilot-calibrated gate ended 2.1 ± 1.1 points below greedy, pooled (p = 0.06), significantly worse on GSM8K (H4); select-then-confirm also ended below greedy, pooled (H5); "Fixed-level McNemar tests gave up most of the available gain on TREC".
- **Isolated decisions** (§6; Tab. 13): calibrated thresholds "improved isolated decisions on fresh evaluations, mainly by committing less often".
- **Strong starts** (§5.4): from a competent instruction, Qwen3.5-4B loops with 16 items reported large gains while held-out accuracy fell on TREC and stayed flat on Banking77 (four planned random seeds); p-values combined with added seeds "are exploratory".
- **GEPA and MIPROv2** (§5.4, Fig. 3, Tabs. 9–12): with 16 validation items GEPA's score "put the improvement at 38.8 points on TREC for a real 19.2" (at a budget of 1000 metric calls); its held-out gain did not grow with validation-set size. MIPROv2's validation scores also overstated its gains. Prop. 1 tracks how overstatement varies with validation-set size and budget "but is not calibrated".
- **Reporting the gain** (§6, Tab. 7): scoring the seed and the incumbent after 19 generations on 64 items never used for selection "removes the bias of the reported gain and reduces its root-mean-square error from 15.5 to 5.7 points" (n = 16), "still as large as a typical gain". They "do not recommend the tested rules as a general remedy for adaptive reuse".

## Limits the authors state

- "Our artifacts are instructions, our tasks use deterministic scoring rules" (though outputs are not bitwise reproducible), the largest proposer has 27B parameters, and "we have not examined agentic or code tasks" (§6).
- The confirmatory study uses Qwen2.5 only; the Fig. 1 checks use oracle quantities; the native-loop check is post hoc; Bayes gates need a pilot with a large evaluation set; PACE ran with its published fixed bet and n items (§6).
- Candidate-specific noise from stochastic rollouts would make Prop. 1 predict "a larger winner's curse, holding the effect distribution fixed" (§6).
- The propositions "no longer describe" reused sets; "the fresh-set model does not identify its net size on reused items", and lock-in is measured "without isolating the mechanism causally" (§3.3). "We do not model the dynamics of lock-in or make claims about recursive self-improvement" (§6).
- They measure the optimism of the optimizers' validation scores, "not of GEPA's published gains" (§5.4); GEPA arms are "matched in metric calls, not in reflection compute" (App. B.2).

## Open problems and building blocks

- **Open:** None stated.
- **Released:** "The code, saved run records, and reproduction instructions are provided in the ancillary files accompanying this preprint" (§ "Code and data availability").
- **To reuse it:** shrinkage needs per-item score vectors; predicting an accepted gain's overstatement also uses a prior over effects, here from a separate pilot (§6). A 64-item audit costs "a tenth of the nominal budget" of a 16-item loop; "at the disagreement rates of our tasks, resolving gains of a few points would take a few hundred items" (§6).

## On this site

- **Tags:** <span class="tags"><a class="tag" href="#/tags/stats">stats</a><a class="tag sub" href="#/tags/hacking-general">hacking-general</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/promptopt-feedback">promptopt-feedback</a><a class="tag sub" href="#/tags/promptopt-general">promptopt-general</a></span>
