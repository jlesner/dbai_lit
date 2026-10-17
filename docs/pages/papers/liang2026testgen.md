# Auditing and Decomposing Feedback-Driven Evolution in LLM Test Generation under the Oracle Problem

**Auditing and Decomposing Feedback-Driven…** · preprint 2026 (the source's comment calls it an FSE submission)

Read: [PDF](https://arxiv.org/pdf/2608.19626) · [arXiv](https://arxiv.org/abs/2608.19626)

<p class="notice">A summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Audits LLM generation of input–output tests from a problem statement when one accepted program supplies the expected outputs, and asks whether the gains of mutation-based test evolution and of a three-round execution-feedback loop survive an audit by the task's other accepted programs (abstract; §1).
- Freezes each selected archive of tests before the other accepted programs re-run its inputs, and drops any test they disagree on; real faulty submissions are split into a selection fold and an evaluation fold; evolution is compared with independent resampling at equal candidate slots, and real feedback with a density-matched placebo that randomly reassigns inputs to faults (§2.2–2.4, §3.2–3.3). Qwen2.5-Coder-7B and Qwen3.5-9B, with a blinded human audit of disconfirmed inputs (§3.1, §3.4).
- A measured case of a single-reference execution check misleading search, with a placebo arm for crediting feedback content rather than extra interaction rounds: the authors report that one reference inflates the apparent evolutionary gain by 9.46–14.85 percentage points (abstract; Tab. 5).

## In plain words

When an LLM writes tests for a programming problem from its English statement, running them looks like a self-check. A common shortcut runs each generated input on one accepted solution and takes its output as the right answer; the authors argue this turns inputs the problem doesn't allow into apparent bug-finding and apparent progress of an evolving test search (abstract). They audit this on competitive-programming problems with two Qwen models: once the tests are chosen, the problem's other accepted solutions re-run them, and any test they disagree on is dropped. Across both models and both main task sets, they report that one reference inflates the apparent gain of evolving tests by 9.46–14.85 percentage points, and that after the audit, independent sampling at the same candidate budget does 6.01–18.83 points better than evolution (abstract; §1). A three-round loop with real execution feedback, set against a placebo that scrambles which input caught which bug, leaves the credit due to that fine-grained feedback "unresolved, not established absent" (§1). The work is "diagnostic rather than a new generator" (§1).

## Background and terms

**Terms to know:** [test oracle](#/glossary/test-oracle) · [differential testing](#/glossary/differential-testing) · [online judge](#/glossary/online-judge) · [cross-fitting](#/glossary/cross-fitting) · [bootstrap resampling](#/glossary/bootstrap-resampling) · [compute-matched comparison](#/glossary/compute-matched-comparison) (here the budget is candidate slots, not tokens: §4.3) · [placebo control](#/glossary/placebo-control) (here the ingredient under test is the input–fault mapping, §2.4)

**The paper's own terms:**
- **Accepted and faulty programs**: a task's submissions the benchmark accepted, and ones with wrong verdicts; acceptance "is a platform verdict rather than a proof" (§2.1).
- **Held-out kill**: the primary outcome, the share of the faults kept for evaluation that the frozen archive (the selected tests, at most three) rejects, averaged over tasks (§2.1, §3.2).
- **Single-reference oracle**: one accepted program, fixed before generation, supplies each input's expected output; this "does not validate" the input (§2.2).
- **Panel-confirmed, audit-disconfirmed**: once the archive is frozen, a test is confirmed only if every other accepted program completes and agrees with the reference, and is otherwise removed: "differential disagreement, not semantic falsity" (§2.2).
- **Gain inflation**: evolution's gain over one shot under one reference, minus the same gain after the audit (§2.3, Eq. 3).
- **Variants** (§3.2, Tab. 3): One-shot (one call, up to three tests); Evolve (the same call plus six deterministic mutations); Matched (three independent calls, the same nine candidate slots); Public evolve (mutations of the public example inputs, no model call).
- **Real, Placebo, Plain** (§3.3): Real shows later rounds the earlier inputs and opaque identifiers of the faults each detected in the search fold (the faults used for selection); Placebo keeps the template, rounds, history size, detected-set size and top per-input kill counts but "randomly reassigns history inputs and fault identifiers"; Plain is independent resampling. Real minus Placebo "measures aligned attribution" (§2.4, Eq. 4).
- **E14, E15, E16-B** (Tab. 2): the real loop, locked on the already exposed external cohort; its placebo, added "post hoc"; a held-out run of all three arms after an amended qualification gate (§3.1, §3.3).

**Builds on:**
- Generated tests as feedback: CodeT (ranks programs by agreement with generated tests; [CodeT](#/papers/chen2022codet "CodeT: Code Generation with Generated Tests (2023)")), CodeContests-O (refines tests by execution), CURE and UTRL (co-train code and test generators) (§1, §6.1–6.2).
- TestCase-Eval (a benchmark pairing algorithm problems with human submissions): the external cohort is "a conservatively filtered Python exact-output subset" (§6.1).
- Barr et al.'s survey of the test-oracle problem (§1).
- Self-Refine, Reflexion ([Reflexion](#/papers/shinn2023reflexion "Reflexion: Language Agents with Verbal Reinforcement Learning (2023)")), Self-Debugging ([Self-Debugging](#/papers/chen2023selfdebug "Teaching Large Language Models to Self-Debug (2023)")) and Huang et al. ([Large Language Models Cannot…](#/papers/huang2023selfcorrect "Large Language Models Cannot Self-Correct Reasoning Yet (2024)")), which "motivate separating the effect of another interaction round from the effect of grounded feedback content" (§6.2).

## Problem and setting

- **Questions** (§3): six (RQ1–RQ6): model-output agreement, inflation, the audited ranking, fault families, human validity judgments, and what aligned feedback adds beyond the placebo.
- **Tasks** (§3.1, Tab. 1): Python problems with exact expected output. Three cohorts, never pooled: development, 142 CodeContests-family tasks (CodeContests: the competitive-programming dataset of [AlphaCode](#/papers/li2022alphacode "Competition-Level Code Generation with AlphaCode (2022)")) "previously exposed during method development"; external, 114 TestCase-Eval tasks hash-locked before generation, three accepted and 20 faulty programs each; held-out E16-B, 138 CodeContests tasks, three accepted and 18 faulty each.
- **Models** (§3.1): Qwen2.5-Coder-7B Instruct with a fixed LoRA warm start, and Qwen3.5-9B with thinking disabled: "They test replication, not a causal scale effect." Three seeds.
- **Correct** means agreement with the accepted programs, "operational with respect to the accepted-program panel" (§2.1), exact after whitespace normalization (§7).
- **Inference** (§3.5): paired task-level bootstraps, 95% intervals; frozen gates. E15 had no equivalence margin, so zero-crossing intervals mean "no detectable incremental effect, not equivalence"; E16-B pre-specified ±2 points (equivalence: the whole interval inside; superiority: a lower end above +2), per model.
- Not discussed: how the IID and OOD (usually in-distribution and out-of-distribution) strata of the development and held-out cohorts are defined (Tab. 1, App. C).

## Approach

- **Select on one reference** (§3.2): the reference supplies expected outputs; a content hash splits each task's faults into two folds, greedy selection builds an archive of at most three tests on one fold, the other scores it, and the roles swap.
- **Freeze, then audit** (§3.2): only then do the other accepted programs run the archive, so "single-reference and audited scores describe the same selected archive". Evolve against Matched after the audit "separates the operator from additional search" (§2.3).
- **The loop** (§3.3): two feedback rounds after a shared first call; Real "never sees sources, outputs, stack traces, held-out behavior, or audit outcomes". Placebo minus Plain "combines prompt/history scaffolding with coarse progress signals" (§4.6).
- **Yield-matched replay** (§3.3, App. C): post hoc, keep equal numbers of reference-valid (parsed, new, and run on the reference) Real and Placebo candidates per round and redo selection and audit; "not counterfactual reruns because later generations retain their original histories".
- **E16 qualification** (§3.1, App. C): E16-A (the first, failed held-out design) required "20 faults and at least 40 tasks per source" and stopped before model calls "because only 36 OOD tasks qualified"; an "outcome-blind amendment" lowered the fault requirement to 18.
- **Human audit** (§3.4, App. D): 300 disconfirmed inputs sampled in locked strata (fixed subgroups by cohort, construction and disagreement mode), labelled independently by two software-engineering doctoral students, blinded to, among other things, method, outputs, panel outcome and each other, as valid, out of domain, malformed, ambiguous or insufficient information: "structured human judgments, not definitive semantic ground truth".

## Results

- **RQ1** (§4.1, Tab. 4): on inputs where all accepted programs run and agree, the model's output matches theirs for 44.16% (Qwen2.5) and 58.90% (Qwen3.5) of development inputs, 27.79% and 50.12% externally; Qwen3.5's error rate "remains too high for use as a reward oracle".
- **RQ2** (§4.2, Tab. 5): Evolve's apparent gains over One-shot of 10.58–13.38 points on development vanish after the audit, and externally shrink to about 2; inflation is 9.46–14.85 across the four model–cohort conditions, every interval above zero; "most inflation is detectable with one additional program" (§4.2; App. A.1).
- **RQ3** (§4.3, Tab. 6): audited, Matched beats Evolve by 6.01–18.83 points, all four intervals excluding zero; this "concerns search quality at nine candidate slots, not token or wall-clock efficiency". The modest external Evolve gain over One-shot "is metric-sensitive": audited task coverage (the share of tasks keeping a confirmed test) falls.
- **RQ4** (§4.4, Tab. 7): each of the 2,836 development faults is put in one family by what exposes it (§3.4). Public examples and the official exact-output anchors already expose the largest shares; a family exposed "only through public mutations that are audit-disconfirmed by the accepted panel", about as large as the four "safe local-mutation families" combined, has the highest disconfirmed share of single-reference detections ("not a semantic false-positive rate").
- **RQ5** (§4.5, Tab. 8): the reviewers agree on most labels ([Cohen's kappa](#/glossary/cohens-kappa) reported); design-weighted (weighted back from the strata to the whole population), 94.41% of disconfirmed inputs are jointly judged invalid and 3.60% valid. "These exceptions preclude treating panel disagreement as semantic truth."
- **RQ6, E15** (§4.6, Tab. 9): against Plain, real feedback lowers audited kill for Qwen2.5 and raises it for Qwen3.5; "The placebo reproduces that direction and nearly the same magnitude", and no Real-minus-Placebo interval excludes zero.
- **RQ6, E16-B** (§4.6, Tab. 10–11): Real minus Placebo is +1.99 points (95% CI [+0.08, +3.88]) for Qwen2.5 and +0.28 ([−1.41, +2.03]) for Qwen3.5, both decisions "inconclusive"; yield matching changes them to −0.30 and +0.78, with intervals crossing zero. Together, E15 and E16-B "narrow the plausible claim but do not constitute a clean confirmatory test of feedback efficacy or ineffectiveness".
- **Safeguards** (§5.3): freeze, then audit on "at least two independent accepted programs"; match candidate slots; add a placebo; cross-fit real faults; adjudicate disagreements against the natural-language contract.

## Limits the authors state

- Accepted-program agreement "does not prove that an input conforms to natural language"; accepted programs "can contain or share defects, and legal outputs may have multiple textual forms" (§7).
- Exact-output tasks only; the authors "do not generalize to special checkers or floating-point tolerance" (§7).
- The human audit "is also not definitive ground truth": the reviewers "may share training and interpretation biases", and a 67-case packet "remains for consensus or third-reviewer specification adjudication" (§7).
- The placebo "does not remove all coarse feedback, nor exactly match prompt tokens"; Real minus Placebo "estimates fine-grained input–fault attribution only" (§7).
- Development tasks were exposed and the family analysis is post hoc; infrastructure and provider amendments "can still affect execution or judgment behavior"; E15 "remains exploratory" (§7).
- E16-B changed the fault panel "after observing qualification supply"; included tasks have more exact-compatible accepted programs (accepted programs usable as exact-output references), and "no outcomes exist for excluded tasks, so profile analyses cannot eliminate selection bias", and RQ6 "is not presented as a clean confirmatory experiment" (§7).
- "exploratory family tests are not multiplicity-corrected" (not adjusted for running many tests); intervals cover "the observed task populations, not arbitrary domains or models"; the replay "demonstrates non-robustness, not a causal decomposition" (§7).
- All tasks are algorithmic and all executed submissions Python-family; both models are Qwen, so they "neither establish cross-family generality nor identify a scale effect"; "A size-matched code-instruction model from an independent family is the highest-priority replication; repository tests, other languages, richer checkers, and production systems also require study" (§7).
- The older development runner lacks per-row isolation evidence, and "timeouts or environmental differences may still alter classifications" (§7).

## Open problems and building blocks

- **Open:** relational evolution, which transforms a public example under an executable precondition and checks a [metamorphic](#/glossary/metamorphic-testing) output relation, "is future work" (§5.4); and, as the authors suggest, optimizing "admissible hard-case yield rather than raw disagreement", which "A prospective study should lock" (§5.4).
- **Released:** "An anonymized replication package containing protocol locks, task-level derived metrics, analysis code, figure builders, and integrity instructions"; restricted weights and datasets "are represented by checksums and deterministic preparation instructions" (§ "Data Availability").
- **To reuse it:** tasks with several independently accepted programs and real faulty submissions, exact-output (§3.1); "Two accepted programs capture most of the ranking change, so audits can remain an offline evaluation standard rather than a deployment-time cost" (§5.5).

## On this site

- **Discussed in:** [Self-improvement that compounds](#/challenges/compounding_self_improvement) · [Comparing LLM methods under noise](#/challenges/method_comparison_under_noise) · [Gains made against a checker, carried beyond it](#/challenges/transfer_beyond_the_checker) · [Weak checkers get exploited](#/challenges/weak_checker_exploitation)
- **Tags:** <span class="tags"><a class="tag" href="#/tags/labels">labels</a><a class="tag sub" href="#/tags/cex-general">cex-general</a><a class="tag sub" href="#/tags/cex-llm">cex-llm</a><a class="tag sub" href="#/tags/hacking-general">hacking-general</a><a class="tag sub" href="#/tags/harness-general">harness-general</a><a class="tag sub" href="#/tags/llm-assist">llm-assist</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/scaling-general">scaling-general</a></span>
