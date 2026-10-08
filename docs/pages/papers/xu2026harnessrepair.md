# What Does a Harness Repair? A Preregistered Study of Visibility, Baseline Adequacy and Evaluation Defects

**What Does a Harness…** · preprint 2026

Read: [PDF](https://arxiv.org/pdf/2610.05533) · [arXiv](https://arxiv.org/abs/2610.05533)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- A preregistered study of where the gains of harness search come from, a search that keeps a change to the prompts, reasoning switches, token budgets or parsers around a frozen model if it raises a score: three small models (a longevity-tuned Qwen3-1.7B, SmolLM3-3B, Intern-S1-mini) on LongevityBench, MMLU-Pro and GSM8K pools with replication and test partitions, and a GEPA arm that searches prompt text only (abstract; §1; §3.1; Tab. 1).
- Four hypotheses with family-adjusted paired bootstrap intervals (§3.3, Tab. 2; §3.5): an exact split of a gain into rows only the new setting parses, rows both parse and rows only the old one parses (H1); non-inferiority of the benchmark authors' thinking-off protocol against a rescue configuration and four GEPA harnesses (H2); a serving-engine thinking budget (H3); and six evaluation defects from an earlier case study, such as the reference answer leaked into the prompt or unparsed answers scored as "A", injected one at a time to ask whether replication through the same pipeline reveals them (H4; §3.4).
- Harness-search gains that come from parsing, weak comparisons or broken evaluation rather than better answers (<a class="tag" href="#/tags/hacking">hacking</a>, <a class="tag" href="#/tags/stats">stats</a>): the authors report that turning thinking off beat capped thinking mostly on rows the capped setting left unreadable (§4.2), that no GEPA-selected harness was more accurate than thinking off (§4.3), and that in 6 of 15 evaluable defect–model pairs replication through the same pipeline reproduced the defect's distortion instead of revealing it (abstract; §4.5). The results cover three small models, three pools and six defects (§1; §6).

## In plain words

Harness search changes what surrounds a frozen model (prompts, whether it thinks first, token limits, the answer parser) and keeps a change if the score rises (abstract). The authors say a gain can come from answers the parser could not read before, a weak comparison, or a defect in the evaluation (abstract); in their earlier search, replication could not reveal a leaked reference answer, since every call carried it (§1 "Background"). They fixed hypotheses and decision rules in advance, testing three small models on three benchmarks, injecting six evaluation defects one at a time (abstract). Turning thinking off raised accuracy over a capped thinking setting in 5 of 9 model-benchmark cells, each time mostly on questions where the capped setting gave no readable answer (abstract). In 6 of 15 evaluable defect-model pairs, replication through the same pipeline reproduced the defect's distortion instead of revealing it (abstract). They "do not claim that harness gains can be illusory" (shown before), but claim to have found no study fixing such questions in advance (§1).

## Background and terms

**Terms to know:** [agent harness](#/glossary/agent-harness) · [reflective prompt optimization](#/glossary/reflective-prompt-optimization) · [bootstrap resampling](#/glossary/bootstrap-resampling) · [multiple testing](#/glossary/multiple-testing) · [statistical power](#/glossary/statistical-power) · [equivalence test (TOST)](#/glossary/equivalence-test-tost) · [greedy decoding and temperature sampling](#/glossary/greedy-decoding-and-temperature-sampling)

**The paper's own terms:**
- **harness**: "everything around a frozen model that changes what it is scored on: the prompts, reasoning switches, token budgets, retry rules and parsers" (§1). Our bridge: the glossary's agent harness plus parser and budgets, for single questions.
- **configurations** (Tab. 1): THINK-64/512/1536 (thinking on, that many tokens for thinking and answer together); AUTHORS-1500 (thinking off, "the benchmark authors' serving protocol"); BUDGET-512-1500 (the engine ends thinking after 512 tokens, then up to 1,500 answer tokens); RESCUE-1500 (THINK-512, or the AUTHORS-1500 call where THINK-512 hit the token limit).
- **unparsed / truncated / non-committed** (§3.2): no readable answer / ended at the token limit / ended by itself and unparsed.
- **V/B/L split, statistic T, gain gate** (§3.2; Tab. 2): a gain of R over P splits exactly into rows only R parses (V), both parse (B) and only P parses (L). T is positive "when visibility supplies more than 0.8 of what the rows R parses contribute"; the gate tests T only if the gain's lower bound is above zero.
- **H1–H4, primary endpoint**: the four preregistered hypotheses (see Problem and setting), their confirmatory results (§3.3).
- **H4 terms** (§3.4): a defect's **distortion** of the reported quantity (the start's accuracy on the letter pool; for the broken start, the gain over the start) on a selection sample S (the replication partition) and a check sample R (the test partition), and their difference Γ; a pair is **evaluable** if the defect could move S by more than 0.05 (the skewed split is evaluable by rule). The six defects: reference answer sent as an assistant turn (A); fallback gold labels on one task (B1); unparsed scored as letter A (B2); the case study's skewed split (C); a broken start (D); a tied output layer (reusing the input embedding matrix) served instead of the checkpoint's stored one (E; §3.1).
- **checks** (Tab. 5): rules on a pipeline's records, e.g. prompt-token reconciliation (server against local count).

**Missing glossary terms:**
- **preregistration**: fixing hypotheses, endpoints and decision rules before seeing outcomes; here frozen before any replication or test call (§3.5).
- **non-inferiority test**: a one-sided test that a method is not worse than a comparator by more than a margin; here the difference's lower bound must exceed −0.05 (Tab. 2). Our bridge: one half of an equivalence test.

**Builds on:**
- The authors' own case study around a longevity model (§1 "Background"; App. A).
- Chen et al. (2026), whose split is "our split under other names but without a predefined dominance threshold" (§2).
- GEPA (Agrawal et al., 2025; [GEPA](#/papers/agrawal2025gepa "GEPA: Reflective Prompt Evolution Can Outperform Reinforcement Learning (2026)")) as the search arm; budget forcing (Muennighoff et al., 2025; [s1](#/papers/muennighoff2025simple "s1: Simple test-time scaling (2025)")) in H3: "the technique is not ours" (§2).
- After-the-fact studies where harness and scaffold gains vanish against matched-budget test-time scaling and simple baselines: Wang et al. (2026b; [Rethinking the Evaluation of…](#/papers/wang2026harnesseval "Rethinking the Evaluation of Harness Evolution for Agents (2026)")), Gideoni et al. (2026) and others (§1).

## Problem and setting

- **Questions** (§1; Tab. 2): better answers or answers made readable (H1); is thinking off non-inferior to a rescue and to GEPA harnesses (H2); does the engine's thinking budget lower truncation (H3); does replication through the same pipeline confirm a defect's distortion (H4).
- **Models** (§3.1): Qwen3-1.7B-Longevity (a Qwen3 model tuned on aging-biology data), SmolLM3-3B and Intern-S1-mini, on the vLLM 0.30.0 server at zero temperature in batch-invariant mode (batched and one-at-a-time runs gave identical outputs; preregistration §1.3).
- **Benchmarks** (§3.1): a LongevityBench letter pool (multiple-choice aging-biology tasks such as age band and ten-year survival), an MMLU-Pro subset (multiple-choice knowledge questions) and GSM8K (math word problems), split 40/20/40 into search, replication and test partitions.
- **Correctness:** strict scoring rules, plus extended ones (e.g. ignoring markdown) for calls that ended by themselves (preregistration §1.6); unparsed scores as wrong and "may hide a correct answer, a wrong one or none" (§3.2).
- **Statistics** (§3.5; Tab. 2): 50,000 percentile-bootstrap resamples over participant components (groups of LongevityBench rows sharing participants, §3.1) or items; verdicts from intervals Bonferroni-adjusted (error level divided by the number of tests) within each family (one hypothesis's endpoints); margins 0.05.

## Approach

- **H1–H3** (Tab. 2): H1 splits AUTHORS-1500's gain over THINK-512, and "visibility dominates" if T's lower bound exceeds zero; H2 compares AUTHORS-1500 with RESCUE-1500 in nine cells and with four GEPA harnesses.
- **GEPA arm** (Tab. 1; App. J): four runs (clean start AUTHORS-1500 or broken start THINK-64) on Qwen3-1.7B-Longevity's letter tasks, Intern-S1-mini proposing edits to the system prompt and an appended instruction.
- **H4** (§3.4; App. I): inject each defect into a pipeline starting from THINK-1536 and compare with the clean pipeline on the same rows. The claim holds when the adjusted intervals put the distortion beyond 0.05 on S and R with the same sign, and Γ within 0.05; error control covers "holds" only, and "fails" is a descriptive label (§3.5).

## Results

On the test partition, they report:
- **Replication** (§4.1; §3.5): 30 of 31 H1–H3 endpoints replicated (same verdict on the replication partition); the other is an inconclusive replication (neither the same nor the opposite).
- **H1** (§4.2; Tab. 8): visibility dominates in 5 of 9 cells. Qwen3-1.7B-Longevity's cells fail the gain gate (THINK-512 already parses most rows); in Intern-S1-mini on GSM8K thinking off loses accuracy and T is positive only through the rows both parse, "the reading the gate exists to stop".
- **H2** (§4.3; Tab. 10): thinking off is non-inferior in 11 of 13 comparisons, losing to the rescue on GSM8K for SmolLM3-3B and Intern-S1-mini; the study "does not isolate which part of the rescue" matters. GEPA repaired its broken starts, but none of its selected harnesses was more accurate than thinking off.
- **H3** (§4.4; Tab. 12): BUDGET-512-1500 lowers truncation and raises parsing in the 6 of 9 cells where THINK-512 truncates a large share; "H3 therefore supports the combined change and not forced termination alone".
- **H4** (§4.5; Tab. 4): the claim holds in 6 of 15 evaluable pairs (broken start in all three models), fails in four, is inconclusive in five, among them all reference-answer pairs.
- **Checks** (§4.5; Tab. 5): detections are "largely true by construction"; some also fired on clean pipelines.
- **Trivial baselines** (§4.6; Tab. 6; post hoc): only Qwen3-1.7B-Longevity beats the strongest constant on the letters (AUTHORS-1500 0.632 against the oracle constant label's 0.539: the best single label per task on the scored rows).
- **Sensitivity** (§4.7; Tab. 26, descriptive): the strict scorer (strict rules only) and never-called rows only (which no earlier study had called) change some verdicts.

## Limits the authors state

- Defects "chosen from one line of work" (§6 "Limitations"); results cover these models, pools and defects "and nothing beyond them" (§1).
- Earlier work had called most LongevityBench rows with other configurations, and "the rows the case study had held out are excluded" (§6).
- "Power is mixed": H4 has no planned power, and an H2 endpoint (Intern-S1-mini, GSM8K) expected to be inconclusive is not (§6).
- "The batch-invariant server differs from the standard one call for call, and everything ran on one GPU instance" (§6).
- The GEPA result, with one proposer and four runs, "says nothing about searching the thinking switch, the token limits or retry rules" (§6; App. J).
- The extended scorer and the role-break rule (on start-of-turn markers in answers; preregistration §1.6) were fixed after the pilot's parse audit (§6); the pilot showed H1's and H3's directions, and H1's primary set changed before the freeze after pilot rates were seen (§3.5).
- "The study measures differences between configurations as served and not what the models know" (§6).
- Intervals "cover item sampling and not prompt or judge variance"; the family-wise error rate "is controlled approximately and is not guaranteed" (§6; §3.5).
- "The freeze guards the rules and not model-specific tuning" (§6); the freeze time is not independently timestamped (§ "Code and data availability").
- Zero temperature may turn some thinking into repetition; truncation persists under sampling in the two models sampled, and SmolLM3-3B is untested (§6).
- After the freeze a stopping rule was waived and a label settled after seeing outputs (§5).
- "We found no study that" means "none was found, not that none exists" (App. H); why a search repairs one defect and not another "is not tested here" (§2).
- The accuracies "do not support any use of these models for medical advice or clinical decisions" (§6 "Broader impact").

## Open problems and building blocks

- **Open:** None stated. The authors advise that "a thinking-off baseline is one to run and not one to assume adequate" (§6).
- **Released:** arXiv ancillary files: the frozen preregistration, its addenda and the aggregate analysis report; the repository "is not public at present" and a filtered export "is planned" (§ "Code and data availability").
- **To reuse it:** reporting truncated and non-committed answers apart, thinking-off and constant-label baselines, reading rendered inputs and per-call prompt-token reconciliation "cost little, and they exposed the defects here" (§7). It ran on one RTX 5090 within a 77 GPU-hour bound (§3.1; App. G "Cost").

## On this site

- **Tags:** <span class="tags"><a class="tag" href="#/tags/stats">stats</a><a class="tag sub" href="#/tags/hacking-general">hacking-general</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/promptopt-evolve">promptopt-evolve</a><a class="tag sub" href="#/tags/promptopt-general">promptopt-general</a><a class="tag sub" href="#/tags/scaling-general">scaling-general</a></span>
