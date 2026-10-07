# When the Reward Suite Is Leaky: A Preregistered Causal Contrast of Natural Verifier False Positives in RLVR

**When the Reward Suite Is Leaky** · preprint 2026

Read: [PDF](https://arxiv.org/pdf/2607.11022) · [arXiv](https://arxiv.org/abs/2607.11022)  
Code: [rlvr-leaky-suite](https://github.com/toffee-desuwa/rlvr-leaky-suite)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- A preregistered two-arm contrast: GRPO on MBPP rewarded by the original tests (leaky) or by the MBPP+ extra tests alone (hardened; not the official base-and-extra metric, §3.1), with the same tasks, seeds and compute (abstract).
- A static leakiness audit before training, and a human-adjudicated audit of every rewarded false positive (abstract).
- Natural false positives in a code reward: it reports the held-out effect non-inferior within a 1.5-point margin, while the audit finds much of the rewarded false-positive code genuinely wrong (abstract).

## In plain words

When a code model is trained by [reinforcement learning](#/glossary/reinforcement-learning), the reward is often whether its program passes the task's unit tests. A weak suite accepts some wrong programs, the same ones every time; the author argues that noise-robustness studies instead model checker errors as random flips redrawn on every attempt, which average out (§1). The paper trains a small code model twice with identical tasks, seeds and compute, rewarded by a benchmark's few original tests ("leaky") or by a much larger set of extra tests ("hardened"), and repeats this with two more small models (abstract). In the main test, frozen before the data existed, at 1–1.5B parameters and 400 steps, the average held-out accuracy cost of the leaky reward, always scored by the extra tests, stays at 95% confidence below a 1.5-point margin fixed in advance. A cheap check of the untrained model's samples predicts before training which tasks leak reward, and an exploratory audit under human-adjudicated rules finds about half of the main model's leaked reward paid for genuinely wrong code. The contribution is "the measurement layer itself" (§1).

## Background and terms

**Terms to know:** [RLVR](#/glossary/rl-with-verifiable-rewards-rlvr) · [GRPO](#/glossary/grpo) · [KL penalty](#/glossary/kl-penalty) · [reward hacking](#/glossary/reward-hacking) · [bootstrap resampling](#/glossary/bootstrap-resampling) · [multiple testing](#/glossary/multiple-testing) · [LLM-as-a-judge](#/glossary/llm-as-a-judge) · [statistical power](#/glossary/statistical-power) (§4.7) · [Spearman rank correlation (ρ)](#/glossary/spearmans-rank-correlation)

**The paper's own terms:**
- **natural false positive (FP)**: a wrong program a deployed suite accepts, per task, persistently and in one direction only (§1). A **rewarded FP** is a leaky-arm rollout that passes the original MBPP tests but fails the MBPP+ extra tests; **FP mass** is the fraction of rewarded rollouts that are FPs (§3.2).
- **MBPP, MBPP+, HumanEval+**: MBPP is a benchmark of short Python tasks with about three assert tests each; MBPP+ is EvalPlus's much larger generated extra test set for them; HumanEval+ extends another Python benchmark, the out-of-distribution held-out set (§3.1–3.2).
- **leaky and hardened arms**: runs rewarded by the original MBPP tests, or by the MBPP+ extra tests alone, "not the official EvalPlus metric, which requires passing base and extra together" (§3.1).
- **families A, B, C**: the trained models Qwen2.5-Coder-1.5B-Instruct (A), deepseek-coder-1.3b-instruct (B, the preregistered decision family) and Llama-3.2-1B-Instruct (C), small open instruction-tuned LLMs (§3.1).
- **static leakiness audit**: before training, 16 samples per task from the family's base model; leakiness is the fraction of MBPP-passing samples that fail MBPP+, undefined when none pass (§3.1).
- **verified-wrong**: an FP record that signed, human-adjudicated predicates class as genuinely wrong code rather than one of four non-model causes, such as extra tests that reject correct code (§3.4).
- **[C], [E], [I]**: confirmatory (preregistered), exploratory (computed after seeing the data), instrument-validity check (§1).
- **channel**: a task where FPs concentrate and persist across seeds (§3.5, §4.5).

**Missing glossary terms:**
- **preregistration**: freezing design, margins and analyses in a signed document before the data exist (§1, §3.3).
- **non-inferiority test**: a one-sided test that one condition is not worse than another by more than a fixed margin; here inferiority (hardened-minus-leaky gap ≥ 1.5 points) is rejected when the one-sided 95% upper confidence bound on the gap falls below the margin (§4.1).

**Builds on:**
- Rajan (2026), an audit of code-RL suites that names the causal test this paper runs (§1, §2 "Audit-side measurement").
- Noise-robustness work, Plesner et al. (2026, [An Imperfect Verifier is Good Enough](#/papers/plesner2026imperfect "An Imperfect Verifier is Good Enough: Learning with Noisy Rewards (2026)")) and Rad et al. (2026), contrasted with persistent FPs (§2 "Verifier noise in RLVR", §6).
- Egashira et al. (2026), which "come closest on the error model" with injected systematic FPs (§2).
- Engineered-exploit testbeds (Taufeeque et al. 2026 and others), whose natural case this paper studies (§2 "Engineered exploits…").

## Problem and setting

- **Question:** what a deployed suite's natural FPs do to training (§1).
- **Training:** GRPO, group size 8, temperature 1.0, no KL anchor, 400 steps on 250 MBPP tasks, 5 seeds per arm (§3.1).
- **Evaluation:** 128 held-out MBPP and 164 HumanEval+ tasks, scored by the extra tests only (§3.2). The seed is the unit of inference; intervals are two-sided 90% "unless stated otherwise" (§3.6).
- **What "wrong" means:** a rewarded FP is mechanical (§3.2); verified-wrong is a human-adjudicated label (§3.4).
- **Scope:** 400 GRPO steps, 1–1.5B models, "and we claim nothing past that" (§1).

## Approach

- **Two-arm contrast:** only the reward suite differs (§3.1, Fig. 1). **Preregistration with its failures:** the pre-launch check of the labeling instrument was voided and its replacement failed; version 2 switched to an exhaustive audit; version 3 registered families B and C before their data existed (§3.3, App. A). The author calls the audit "self-penalizing by construction", as added predicates can only shrink the verified-wrong share (§3.3).
- **Verified-wrong audit:** all 2821 family-A rewarded FPs, classified under per-task predicates signed by the human adjudicator over four specification generations (§3.4, App. B).
- **Stratification** by static leakiness (§4.4). **Mechanism tests:** trends over training, distinctness of paid-for programs, a base-model control passing untrained models' samples through the same leaky filter, and a test of whether training raises the per-token likelihood of FPs more than of genuine passes, comparing completions of matched length (§4.5).
- **Replication** in families B and C against three frozen criteria (§4.6), and preregistered 800-step runs (§4.7).
- **Meta-audit (exploratory, outside every confirmatory claim):** two frontier-lab LLMs, DeepSeek-V4-Pro and MiMo-v2.5-Pro, judge code without running it, including FPs from their own outputs; swapping which judge reads which pool separates authorship from pool, and a further study tells judges who wrote the code. GPT-5.6 is an extra reader with no confirmatory weight (§5, App. F).

## Results

- **Held-out effect [C]:** at step 400 the hardened arm is 0.20 percentage points (pt) ahead, one-sided 95% upper bound 0.75 pt, below the 1.5-pt margin, under all six interval methods; both arms improve over their base model (§4.1, Tab. 4).
- **Tracking [C]:** per-task rewarded-FP mass tracks static leakiness, Spearman ρ = 0.80 over 216 tasks, nearly the same after controlling for task difficulty (§4.2, Fig. 2).
- **Train-side stratification [C]:** 45.9% of rewarded rollouts are FPs on the 77 leaky-flagged tasks against 2.1% on the 173 clean ones, a gap of +43.8 pt (§4.4).
- **Verified-wrong share [E]:** 47.57% of family A's rewarded FPs (bootstrap interval over tasks [36.4, 60.5]); families B and C give 45.37% and 62.78%, a large share, "not one number" (§4.3, Tab. 1).
- **Reward inflation:** the leaky arm banks 8.37 pt more training reward, with "no held-out counterpart within the bound", though "parameter-level sharpening below behavioral resolution is not excluded" (abstract).
- **Eval-side association [E]:** in family A, leaky held-out tasks gain less under the leaky arm, with four mandatory caveats and it does not replicate cleanly: family B shows a reversed-direction candidate signal, family C an underpowered positive (§4.4, §4.6).
- **Mechanism [E]:** no growth of FP incidence within the horizon (flat in A and C, declining in B); all verified-wrong records on the largest channel are distinct programs; no family's FP pool shows signs of engineered exploits; among untrained base-model samples that pass the leaky filter, the channel's wrong output appears at or above the trained rate on most of 11 persistent channels; no preferential rise in FP likelihood above the smallest size the test can detect (family B under every length matching, C under one). The author calls this "consistent with selection of pre-existing error modes rather than learned exploitation" (abstract, §4.5, Tab. 8).
- **Replication [C]:** all three criteria pass on family B, and C shows the same signatures; held-out task-level effects do not transfer (§4.6, Tab. 2).
- **800-step continuation [C]:** no part of the frozen growth criterion fires; family B is "adequately powered", family C "an underpowered non-detection" (§4.7, Tab. 10).
- **Meta-audit [E]:** GPT-5.6 and DeepSeek-V4-Pro, reading blind, separate the trained policies' rewarded verified-wrong FPs from genuine passes well; DeepSeek-V4-Pro and MiMo-v2.5-Pro separate their own FPs "only weakly"; the swapped-judge test of authorship is unresolved; for DeepSeek a told authorship claim shifts judgments in the "harsher-when-truly-own direction", which the author says fits a response to the claim's truth and, inseparably, an interaction of claim text with pool properties "that is not truth-mediated" (§5, Tab. 3).

## Limits the authors state

- At 1–1.5B, 400 steps and MBPP-length tasks, the bounded average and the absence of measured growth are "one-way statements about that box"; all findings are in one benchmark family (§7 "Scope").
- "Not equivalence at zero, and not a clearance for longer runs or larger models"; "true gaps between roughly 0.2 and 1.5 pt are not reliably detectable" (§4.1).
- Growth nulls are "not proofs of zero" (§4.5); the continuation leaves "the task axis" untested (§4.7).
- The eval-side cut is "permanently exploratory", its correction a lower bound; family A kept no per-sample eval dumps or checkpoints, so no causal sentence attaches (§7 "Inference limits").
- The hardened suite has its own false negatives; family C's share is least audited; hardware differs, so cross-family comparisons are only directional (§7 "Instrument limits").
- Scoring is extra-tests-only, not official union scoring; union re-scoring covered families B and C, and family C's two MBPP+ cells sit outside the margin under both (§7 "Suite operationalization").
- The meta-audit has two subjects on MBPP and no "frontier models" generalization (§7 "Meta-audit scope").

## Open problems and building blocks

- **Open:** growth "at larger scale or longer horizons" is a falsifiable hypothesis the data do not answer; "the open axis is scale" (§1, §7 "Scope"). Effects below the likelihood test's floor "remain open" (§4.5). Flat FP share in A and C, against a theory's predicted die-out, is "an open resolution question" (§6). Three meta-audit leads await new preregistrations (App. F.4).
- **Released:** the split, suite versions, reward paths, preregistration chain, adjudication cards, leakiness tables, rollout logs, evaluations, predicate specifications, scripts and meta-audit materials (Reproducibility Statement; some "available to reviewers on request").
- **To reuse it:** two suites per task; the static audit "executes code but involves no training" (§3.1).
- **Beyond its domain:** the author draws "a recursive implication for audit methodology itself" for oversight relying on stronger judges, as motivation, not a result (§6 "A recursive implication…").

## On this site

- **Discussed in:** [Can SQL equivalence checkers be trusted?](#/challenges/checker_soundness) · [Comparing LLM methods under noise](#/challenges/method_comparison_under_noise) · [Weak checkers get exploited](#/challenges/weak_checker_exploitation)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/hacking-general">hacking-general</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/rlvr-general">rlvr-general</a></span>
