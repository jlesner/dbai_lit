# Correction and Corruption: A Two-Rate View of Error Flow in LLM Protocols

**Correction and Corruption** · preprint 2026

Read: [PDF](https://arxiv.org/pdf/2604.18245) · [arXiv](https://arxiv.org/abs/2604.18245)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- A paired audit of an added model call: success before and after on the same instances, under one binary rule (abstract).
- Splits the net effect into a correction rate and a corruption rate; the break-even correction rate "rises sharply with baseline success" (abstract).

## In plain words

When an LLM system adds a model call (a revision, a re-solve, a judge's pick), it is usually judged only by the change in overall accuracy. The author argues this net number hides two opposite flows: wrong answers that get fixed and right answers that get broken (abstract, §1). It proposes logging, on the same tasks, whether each answer passed before and after the call under one fixed pass/fail rule, and reporting the fix rate and the break rate separately. The net change is exactly fixes minus breaks, so for a given break rate, the higher the starting accuracy, the higher the fix rate needed to break even (§2.1). Experiments on generated arithmetic, the math benchmark GSM8K and the Python benchmark MBPP ask whether measured rates predict new tasks, shift with the call's inputs, and combine across successive calls. On MBPP, adding a Mistral-written solution when Llama 3.2 revised its own passing programs raised broken programs among 357 from 28 to 100 (abstract, §4.2). The author calls this "a measurement discipline rather than a universal performance law" (§6).

## Background and terms

**Terms to know:** [LLM-as-a-judge](#/glossary/llm-as-a-judge) · [bootstrap resampling](#/glossary/bootstrap-resampling).

**The paper's own terms:**
- **protocol operation**: one model call within "a structured sequence of model calls", fixed by its model, instruction, decoding rule and required output (§1).
- **paired audit**: recording, per task, success before (E0) and after (E1) one operation under the same binary rule; the four counts are stays-wrong, corrected, corrupted, stays-right (§2.1, Eq. 1).
- **correction rate c / corruption rate γ**: the share of initially failing outputs that pass afterwards / of initially passing outputs that fail afterwards; undefined when the group is empty (§2.1, Eq. 2).
- **helper-transcript conditioning (A→B)**: model A writes a worked solution; model B re-solves the task with it in context, not asked to critique it (§3).
- **verify-and-fix**: keeps the incoming answer if accepted, else writes a replacement; unlike **verdict-only verification**, which only labels an answer (§2.2, §5.1).
- **structural depth, depth mixture**: how many levels (1–5) a generated arithmetic expression is recursively composed to; each depth's share of a population (§3).
- **calibration data**: the tasks the rates are estimated on (here two seeds), not confidence calibration (§3).
- **pooled vs depth-conditioned predictor**: one rate pair for all tasks vs one per depth group, plugged into the accounting identity (Eq. 3, see Approach) (§3.1–3.2).
- **anchor, posshuffle, oracle accuracy**: the baseline candidate (candidate 1); a fixed per-item reshuffle of presentation order; the best accuracy any selection could reach on the candidate sets (§4.1, Tab. 4).
- **transition, direct vs composed**: the 2×2 table of success at one checkpoint given success at an earlier one; composed = product of the two one-step tables, direct = measured end to end (§5.1, Eq. 5). Its two rows are the items that failed and passed at the earlier checkpoint; a row's support is how many items it holds (§5.3).

**Missing glossary terms:**
- **Jeffreys smoothing**: estimating a rate as (count + 1/2) / (group size + 1), stabilizing small groups while pulling them toward 1/2 (§3).
- **dataset shift**: a change between the population a quantity is estimated on and the one it is applied to; a changed task-group mix is "a form of dataset shift" (§6).
- **conditional independence**: here, the final outcome depends on the first only through the middle one (§5.1).

**Builds on:**
- Huang et al. 2024 (ICLR), whose GPT-4 GSM8K totals are reanalyzed (§1, §2.3).
- Yang et al. 2025a;b, the "closest prior formal precedents": repair of wrong answers vs retention of right ones, over several rounds (§1).
- Parallel, not a basis: Liu & Meng 2026, "Independent contemporaneous work" whose rates coincide with c and γ and which derives the same identity and break-even boundary for repeated self-revision (§1, §7).

## Problem and setting

- **Question:** can one call's before/after measurement predict unseen tasks, anticipate changed inputs, and combine with other calls in a chain (§1)?
- **Success:** exact match after a shared formatter and parser (arithmetic, GSM8K; §3) or passing unit tests (MBPP; §4.2).
- **Four audit conditions (§2.2):** the same instances before and after; one common binary rule; a specified operation; both bits encoding success of the output (which excludes verdict-only verification).
- **Tasks:** three generation seeds of 600 synthetic items each, 100 arithmetic expressions per depth 1–5 plus 100 2×2 integer linear systems (§3); GSM8K grade-school math word problems ([GSM8K and trained verifiers](#/papers/cobbe2021verifiers "Training Verifiers to Solve Math Word Problems (2021)")): a 1319-item pool with K = 2 candidates (§3.3) and a 200-item subset with K = 4 (§4.1); 960 Python tasks from MBPP (Mostly Basic Python Problems, checked by unit tests) (§4.2).
- **Models:** open-weight Llama 3.2, Mistral and Qwen 2.5; deterministic decoding on synthetic tasks; GSM8K candidates sampled at temperature 0.7, judge deterministic (§3, §3.3). Call cost: not modeled (§3.4).

## Approach

- **Exact accounting (§2.1).** On a fixed population with all pairs observed, the change in success rate equals (share initially failing × c) minus (share initially passing × γ) (Eq. 3), an identity; empty groups contribute zero. The call is a net gain exactly when corrections outnumber corruptions; for baseline success p0 strictly between 0 and 1 this reads c > γ · p0/(1 − p0) (Eq. 4), equality being break-even.
- **Bounds from published totals (§2.3).** Before/after accuracies fix only corrections minus corruptions; the counts can be bounded, and a protocol rule can pin them down.
- **Prediction (§3).** Jeffreys-smoothed rates fitted on two seeds predict the third, with the depth mixture unchanged (§3.1) and reweighted onto single depths, with no new calls (§3.2). On GSM8K, six features of the problem text (lengths, number counts, sentence count, a keyword score) are tested as groupings (§3.3–3.4). A rule applies the operation in a group only when its predicted change is positive (§3.4).
- **Input sensitivity (§4).** The same candidate set goes to the Qwen 2.5 judge in standard or shuffled order (§4.1); Llama 3.2 revises its own passing MBPP programs with or without a Mistral-generated solution, which "isolates corruption by construction" (§1, §4.2).
- **Composition (§5).** Mistral solves, re-solves with a Llama 3.2 helper transcript, then Qwen 2.5 runs verify-and-fix. If the second step depends on the past only through intermediate success, direct and composed tables are equal; the converse need not hold (§5.1).

## Results

- **Running example (Tab. 1):** on 500 arithmetic problems, a Mistral worked solution given to Llama 3.2 corrected 32 of 81 wrong answers, corrupted 114 of 419 right ones, accuracy 0.838 → 0.674; the reverse direction gained.
- **Baseline effect (§2.1):** the break-even multiplier rises from 3 at baseline 0.75 to 19 at 0.95, where no correction rate offsets a corruption rate above 1/19.
- **Reanalysis (§2.3):** for Huang et al.'s GPT-4 GSM8K accuracy drop from 191/200 to 183/200 after one round of intrinsic self-correction, the published totals bound the corruption count but leave the correction rate "entirely undetermined" within the sample; their oracle-guided procedure never revises answers known to be correct, so its gain is corrections only.
- **Prediction (Fig. 1, Tab. 2):** on a matched holdout, calibration estimates track held-out accuracy, but the pooled predictor misses a depth trend the depth-conditioned one follows. For llama3.2→mistral, mean absolute error is 0.0078 pooled vs 0.0084 conditioned under the original mixture, 0.0711 vs 0.0375 across single-depth mixtures (Tab. 2).
- **GSM8K (§3.3–3.4, Tab. 3):** length bins give "little evidence of resolvable bin-specific deviation at the available sample sizes"; a sentence-count rule's predicted signs match all four groups, but the feature was chosen after inspecting six on the same pool, so the rule is exploratory. On the synthetic mistral→llama3.2 holdout the rule never applies the operation: "correct suppression of a harmful operation" (§3.4).
- **Order (Tab. 4):** shuffling cuts selection of the original anchor from 0.790 to 0.280, near chance among four candidates; accuracy falls where candidates differ but none beats the anchor and rises where the anchor is wrong and a correct alternative exists; the aggregate change over 200 items is small relative to sampling variation (§4.1).
- **Helper context (Tab. 5):** corruptions rise from 28 to 100 of 357 passing programs, with a bootstrap 95% confidence interval on the paired increase (§4.2).
- **Composition (Tab. 6):** within a seed, intermediate success gives "a close average summary but not uniform agreement across groups" (§5.2); held-out pooled gaps are larger, and weighting the initial-success rows by held-out support "substantially reduces the discrepancy" (abstract, §5.3). Group-conditioned composition lowers final-accuracy error in all six groups for held-out seed 125 (§5.3).

## Limits the authors state

- "The empirical evidence is deliberately bounded": three open-weight model families; broader domains and substantially different capability levels remain outside the experiments (§1, §6).
- Results are "direct evidence only for the settings studied here" (§6); the holdout does not establish transfer to another task family, model, operation or input condition (§3.1).
- Graded or non-unique outputs "would require an auditable success rule" (§6).
- MBPP measures corruption only, the K = 4 audit has 200 items, the GSM8K feature analysis is exploratory (§6).
- Longer adaptive workflows, repeated stochastic calls and richer feedback "remain outside the direct evidence" (§6).
- Group conditioning thins denominators, which can increase uncertainty (§3.1, §6); the audit shows what changed, not why (§6).
- A deployment rule would need call cost and validation on data not used to choose its features (§6).
- Equal direct and composed tables do not prove conditional independence (§5.1).

## Open problems and building blocks

- **Open:** longer or more adaptive protocols "will require testing whether the retained state is adequate for each downstream operation"; confidence, error type or transcript features are "illustrative possibilities, not states identified as sufficient by our experiments" (§7). "A persistent, well-supported discrepancy could indicate missing predictive history, although finite-sample support and calibration-to-target mismatch can also contribute" (§6).
- **Released:** prompt templates, row-level examples and reproduction details in Supp. S9 and "the accompanying coding-check notebook" (§4.2); artifacts: Supp. S8.
- **To reuse it:** paired per-item logs at each operation, one binary success rule, "representative calibration data and held-out evaluation" and the added call's cost (abstract); logging contract in Supp. S8.3.
- **Beyond its domain:** "any operation satisfying the paired measurement conditions can be audited" (§2.2), with rules such as unit tests, successful execution or a fixed constraint (§1).

## On this site

- **Discussed in:** [Whole-job reliability of multi-step LLM work](#/challenges/whole_job_reliability)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/scaling-general">scaling-general</a></span>
