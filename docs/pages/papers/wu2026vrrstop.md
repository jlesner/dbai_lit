# Verify, Repair, Repeat, or Stop? Robust Stopping for Noisy Verify-Repair Loops in LLM Agents

**VRR-Stop ("Verify** · Repair, Repeat, or Stop?"), preprint 2026

Read: [PDF](https://arxiv.org/pdf/2607.17641) · [arXiv](https://arxiv.org/abs/2607.17641)  
Code: [vrr-artifact](https://anonymous.4open.science/r/vrr-artifact-2583)

<p class="notice">A summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- When to stop an LLM's verify-repair loop when both the verifier and the repairer err: a four-parameter model (false accepts, false rejects, repairs, damage) turns each round's repeated verifier votes into a belief that the current plan is valid, and the loop repairs only while the expected gain of one more round is positive; VRR-Guard, a fallback for verifiers that barely separate valid from invalid plans, keeps the best candidate and replaces it only on a margin of votes (abstract; §3.2; §4.1–4.3).
- The verifier's error rates come from label-free mixture-model fitting of repeated votes and the repair and damage rates from a small set of labelled before/after pairs, with cross-fitting; replayed on saved trajectories on GSM8K, MATH-500, MBPP and BFCL with Qwen2.5, Mistral and Llama models judging their own plans, except a process reward model on MATH-500 and an executor on BFCL multi-turn (§4.2; §5.1; App. B, Tab. 3).
- A measured case of a weak judge misleading a repair loop, and of when its error rates can be estimated without labels: on its GSM8K prompt-mismatch stress traces, the authors report that 24% of the repairs that turned a correct plan wrong won majority acceptance from the judge (§5.2; App. C.2), and that label-free calibration fails when the judge's discrimination is near zero (§5.4).

## In plain words

LLM agents often run a verify-repair loop: a verifier checks a candidate answer, a repairer revises it from the feedback, and the loop repeats. The authors argue that when both err, "repair can damage already-correct plans, and reported acceptance keeps rising while true validity falls", so existing methods lack "a principled basis for deciding when repair should stop" (abstract). They propose VRR-Stop, which estimates from repeated verifier votes how likely the current answer is correct and repairs only while one more round is expected to help, and VRR-Guard, a cautious fallback for verifiers that barely tell right from wrong (§4). On a GSM8K math stress setting, where the repairer sees a corrupted copy of each problem and Qwen2.5-3B generates and judges, VRR-Stop commits 72.2% correct answers, against 11.6% for always repairing five rounds and 70.0% for never repairing (Tab. 1). With a Llama judge, VRR-Stop collapses while VRR-Guard holds (§5.4–5.5). They claim no first.

## Background and terms

**Terms to know:** [self-correction](#/glossary/self-correction) · [LLM-as-a-judge](#/glossary/llm-as-a-judge) · [Youden's index](#/glossary/youdens-index) · [Bayes' rule, prior and posterior](#/glossary/bayes-rule-prior-and-posterior) · [outcome and process rewards](#/glossary/outcome-and-process-rewards) · [expectation-maximization (EM)](#/glossary/expectation-maximization-em) (for the binomial mixture of judge votes, App. A.4) · [identifiability](#/glossary/identifiability) (the mixture is identifiable "if and only if the two component acceptance rates differ", App. A.4) · [cross-fitting](#/glossary/cross-fitting) (five folds, App. B)

**The paper's own terms:**
- **verify-repair-repeat (VRR) loop**: each round queries the verifier M times on the current plan (the candidate answer) and counts accepts; a policy then commits the plan or has it repaired (§3.1).
- **true validity**: whether a plan really meets the task, checked by answer matching, symbolic verification, unit tests or an executor; V is that of the final commit (§3.1; §5.1).
- **the four parameters** (§3.2, Eq. 3): ρ0 and ρ1, the chances that one query accepts an invalid plan or rejects a valid one; α and β, the chances that a repair makes an invalid plan valid or "damages" a valid one. **J** = 1 − ρ0 − ρ1, the verifier's "discrimination ability" (§3.2), is Youden's J (§5.1).
- **belief b**: the posterior probability that the current plan is valid given the history, "not the verification pass rate" (§4.1).
- **marginal gain G** and **decision margin Δ**: the expected change in true validity from one more repair (Eq. 4), and its distance from the stopping threshold, 0 in all experiments (§4.1–4.2).
- **TPM (true-parameter myopic) reference**: the same rule with the true parameters; a diagnostic, not an upper bound (App. A.6; App. F).

**Builds on:**
- Self-Refine (Madaan et al. 2023), Reflexion (Shinn et al. 2023; [Reflexion](#/papers/shinn2023reflexion "Reflexion: Language Agents with Verbal Reinforcement Learning (2023)")), CRITIC (Gou et al. 2024) and SCoRe (Kumar et al. 2025), self-correction methods used as fixed-budget baselines; this line "does not formalize termination as a decision problem in which the verifier and the repairer are simultaneously noisy" (§2; §5.1).
- HedgeTune (Khalaf et al. 2025), ROC-n-reroll (Dorner et al. 2026) and Stroebl, Kapoor, and Narayanan 2026 ([The Limits of Inference…](#/papers/stroebl2024resampling "The Limits of Inference Scaling Through Resampling (2024)")): imperfect verifiers in selection among independent candidates, unlike a loop that "keeps rewriting the same candidate" (§2).

## Problem and setting

- **Question:** when has repair "degenerated from improving true quality into fitting verifier noise" (§1)? Each decision compares committing now with one more round, "without look-ahead" (§3.3).
- **Assumptions:** binary validity (§3.1); votes on one plan independent given its true state, parameters stable "within a local decision window" (§3.2); repair outcomes independent of the history given the true state (§4.1).
- **Calibration:** ρ0, ρ1 from unlabelled repeated votes; α, β from at most 300 labelled before/after pairs; the prior from initial plans (§4.2; App. A.4).
- **Tasks and models:** GSM8K (grade-school math word problems), MATH-500 (math), MBPP (code, unit tests) and BFCL (the Berkeley Function Calling Leaderboard, tool use) (§5.1); Qwen2.5, Mistral-7B and Llama-3-8B generators, each judging its own plans, except a process reward model on MATH-500 and an executor on BFCL multi-turn (Tab. 3). Stress perturbs only the repairer's copy of the problem; the favorable setting, nothing (App. B).
- **Protocol:** M = 8 votes per round, at most 5 repairs, margin δ = 5; all numbers replay frozen trajectories in which every round repaired, with VRR-Stop and VRR-Guard evaluated separately (App. B; App. J; Alg. 1). V gets [bootstrap](#/glossary/bootstrap-resampling) intervals, paired differences [McNemar tests](#/glossary/mcnemars-exact-test) (§5.1).

## Approach

- **Belief filtering (§4.1).** Each round's votes update the belief by Bayes' rule (Eq. 5). One more repair gains (1 − b)·α − b·β, expected fix minus expected damage (Eq. 6), so it helps only while b is below α/(α + β), for α + β > 0 (Eq. 7). This boundary "depends only on the repairer's α and β"; verifier noise decides, through the belief, whether the comparison is reliable.
- **Calibration (§4.2).** In the experiments VRR-Stop "acts directly on the sign" of the estimated gain; Prop. 1 is a "reliability-analysis" tool (§4.2).
- **Prop. 1 (§4.2; App. A.2)** says when an estimate can be trusted: given an error radius that holds with probability at least 1 − η, if the estimated gain is more than the radius above the threshold, or at least the radius at or below it, the estimated action matches the true one with probability at least 1 − η. In an idealized single-query loop, the calibration sample needed grows like log(1/δc)/(M·J²·Δ²), δc the allowed failure probability; no bound is claimed for the deployed rule (App. A.5).
- **VRR-Guard (§4.3).** It keeps the best candidate so far, replaces it only when a new plan's accepts beat it by at least δ (Eq. 9), and commits it at the end; it is for when a labelled held-out test, not using EM, finds J near zero, or Prop. 1's condition fails throughout. **Lemma 1:** if the kept plan is truly valid, the new one truly invalid, votes independent given the true states, and J ≥ 0, a wrong swap has chance at most exp(−(M·J + δ)²/(2M)) per round, and K_max times that over a budget of K_max rounds (§4.3; App. A.3).

## Results

- **Loop dynamics (§5.2).** In a non-stationary diagnostic (truncated first drafts, perturbation from round 3), validity rises from 0.45 to 0.87 after two repairs and falls to 0.12 by round 6, while independent resampling stays between 0.47 and 0.85 (Fig. 4); the authors blame "repeated rewriting of the same candidate". Validity falls with repair in most of the eight settings (App. C.1); a process reward model judging GSM8K (J = 0.805) does not stop five fixed repairs cutting it from 0.727 to 0.097 (§5.2; App. H.1). On the 500-instance GSM8K stress traces, 55% of instances see a correct plan repaired into a wrong one, and 24% of these damaging repairs win majority acceptance (§5.2; App. C.2).
- **Stopping (§5.3, Tab. 1).** On GSM8K with Qwen2.5-3B under stress, VRR-Stop reaches 0.722 at 0.72 mean repair rounds; fixed five-round repair 0.116 (paired gain 60.6 points), no repair 0.700, majority stopping (commit once most votes accept) 0.690, TPM 0.694. VRR-Stop beats majority stopping and TPM in McNemar tests, but its edge over no repair "has a CI crossing zero" (confidence interval).
- **Identifiability (§5.4; App. E).** On a controlled grid, sign-flip probability is 0.183 where J ≤ 0.15 and Δ ≤ 0.10, against 0.014 where J ≥ 0.4 or Δ ≥ 0.30 (Fig. 5). Calibrated stopping stays near TPM with the Qwen and Mistral judges, but the Llama-3-8B judge has J = 0.03, and VRR-Stop falls to 0.223 against TPM's 0.803 despite a large margin (§5.4; Tab. 2): EM's likelihood flattens as J approaches 0, and a larger calibration sample worsened its estimate (Tab. 8).
- **Fallback (§5.5, Tab. 2).** Fixed repair "falls far below no-repair in most shifted settings", while VRR-Guard "stays near the no-repair level in all seven settings and never collapses".

## Limits the authors state

- The method is limited by its "local-stationarity approximation and binary validity representation" (§6): first-round parameters cannot represent an abrupt later change, and in the non-stationary diagnostic VRR-Stop and TPM both stay far below the best round picked afterwards (App. H.2); binary validity cannot fully describe partial correctness, multiple error types or staged goals (App. H.6). Named directions: round-varying dynamics, multi-level quality (§6; App. H.6).
- Instance difficulty is ignored, and repeated queries "may be correlated" (§3.2).
- Prop. 1 needs the radius's nominal coverage (§4.2); the sample-size bound covers only the idealized loop (App. A.5); near-zero J "can defeat even a large margin" (§4.2).
- "VRR-Guard does not strictly dominate no-repair" (§4.3): it falls slightly below it with the Mistral judge and on BFCL (whose interval contains zero), and below fixed repair in the favorable setting (§5.5). It assumes the verifier's noise is stationary within a trajectory (§4.3).
- Modes are assigned offline (§4.3); online switching is future work (§6).
- The Reflexion and Self-Refine runs do not claim to "reproduce the full training details of the original methods" (App. D).
- Family patterns rest on "only three model families", some sharing tasks and samples; for deterministic verifiers EM "cannot be applied directly", so ρ0, ρ1 need labels (App. H.4).
- α + β ≤ 1 fails on the Qwen2.5-3B stress trajectory, so conclusions there rest on single-round gains and finite-trajectory diagnostics; TPM is not a globally optimal upper bound (App. H.6).
- The vote budget M and the threshold were not swept (App. I).
- Trajectories are not bit-wise reproducible across inference-engine versions; numbers come from replay (App. J).

## Open problems and building blocks

- **Open:** noise that depends on plan features, giving plans of different difficulty different stopping boundaries; per-instance gains to choose which instances to repair under a total inference budget (App. H.6).
- **Released:** code (title page), with a figure-to-data manifest (App. B), two failure transcripts (App. C.2), the flip-rate grids (App. E), the calibration biases (App. H.4), seeds and prompts (App. J).
- **To reuse it:** repeated votes per plan, at most 300 labelled pairs from trajectories that always repair, and a labelled separation test (§4.2–4.3). Parameters "should not be transferred directly" to a new model family, verifier or repair prompt (App. H.6). Trajectories were generated on one A800 GPU per experiment (App. J).

## On this site

- **Discussed in:** [Weak checkers get exploited](#/challenges/weak_checker_exploitation) · [Whole-job reliability of multi-step LLM work](#/challenges/whole_job_reliability)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/hacking-general">hacking-general</a><a class="tag sub" href="#/tags/harness-general">harness-general</a><a class="tag sub" href="#/tags/judge-general">judge-general</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/scaling-general">scaling-general</a></span>
