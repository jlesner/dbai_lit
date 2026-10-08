# Admission Without Answers: Label-Free Certification and Experience Learning for LLM-Based Optimization Modeling

**ADMITOR ("Admission Without Answers")** · preprint 2026

Read: [PDF](https://arxiv.org/pdf/2608.15565) · [arXiv](https://arxiv.org/abs/2608.15565)  
Code: [AdmitOR](https://github.com/junbolian/AdmitOR)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- A label-free admission gate for an agent that learns skills for optimization modeling (LLM-written LP and MILP models): three model families each write a model, every model is solved on the stated instance and on instances with resampled parameters, the largest group whose optimal values agree on every instance across families gives the accepted value, and a threshold fitted on solver-verified synthetic problems turns the agreement into accept, abstain or escalate, with a Clopper–Pearson bound on false certificates (abstract; §3, Prop. 2). Only the host's own trajectories whose answer equals the accepted value enter its skill library (§3, Step 5).
- Run inside the OptSkills learner on an OptMATH training stream with labels withheld; four judges (sealed ground truth, majority vote over the host's samples, execution success, ADMITOR) replay the same logged candidates, and each judge's library is scored on five public benchmarks (§4; §4.2, Tabs. 2–3); the panel is DeepSeek-V3.2, GPT-5.4 and Claude Sonnet 4.6 (App. B).
- Certified admission into a memory, outside SQL, and where its guarantee fails: the authors report that their preregistered false-discovery criterion fails on the benchmark stream, with 22 of 138 admitted certificates disagreeing with the withheld labels (§4.3), and their audit traces almost all of them to problem texts that omit or round the numbers the label needs, the rest to wrong labels (§4.3; App. C, Tab. 6). Agreement across families certifies the instance one LLM extractor read from the text, not the intended one (§4.3); in their ablation resampling changed no accepted value, and the gain over majority vote comes from the value being external to the learner (§4.2, Tab. 3).

## In plain words

Some LLM agents improve at optimization modeling (turning a word problem into a program for a math solver) by storing solved attempts as skills; a stored wrong attempt "can be retrieved repeatedly and affect many later decisions", and new problems lack answers to check (§1). AdmitOR admits without answers: three LLM families each write a model, all are solved on the stated problem and randomly changed versions, a value is accepted when the largest group agreeing everywhere spans at least two families, and a threshold tuned on problems with known answers aims to limit wrong acceptances (abstract; §3). Inside the OptSkills learner, on 300 problems with answers withheld, 0.927 of its admitted attempts are right, against 0.871 for majority vote over the learner's attempts and 0.726 for admitting whatever runs; its store, the smallest, scores highest on average over five benchmarks, 58.4 against 54.8 for majority vote (abstract; §4.2). The limit holds on the tuning problems, not the benchmark stream (abstract). They call it, "to our knowledge", "the first label-free method designed for all four" properties of Tab. 1 (§2).

## Background and terms

**Terms to know:** [agent skill](#/glossary/agent-skill) · [self-consistency (majority voting)](#/glossary/self-consistency-majority-voting) · [bootstrap resampling](#/glossary/bootstrap-resampling) · [multiple testing](#/glossary/multiple-testing)

**The paper's own terms:**
- **host**: OptSkills (Yang et al., 2026), the skill learner hosting the gate, which distills solved trajectories (recorded attempts) into skill files (§4; App. B).
- **candidate, value function**: a program building and solving a model for any parameter values in a range around the stated ones; its optimal objective as a function of them (not the RL sense); candidates whose value functions agree on the range are **behaviorally equivalent** (§3 "Setup").
- **certificate**: an accept that carries a value for the stated problem; "the word refers to the agreement that supports the value, not to a proof of correctness" (§3 "Setup"). In our terms, not a glossary [certificate](#/glossary/certificate) (checkable without trusting its producer).
- **ACCEPT, ABSTAIN, ESCALATE, UNINFORMATIVE**: the outcomes; ABSTAIN: values disagree; ESCALATE: add instances or candidates, then decide again (Lemma 1); UNINFORMATIVE: fewer than three instances where two or more candidates return a finite value, mapped to escalation (§3 "Setup", Step 2; §4.2).
- **judge swap**: candidates and solver logs are collected once; four judges (sealed ground truth, the host's majority vote, execution success, AdmitOR) replay them, each building its library (§1; §4.2).
- **admission precision, poisoned admission**: the share of admitted candidates matching the withheld answer (the **sealed vault**), and an admitted one that doesn't (Tab. 3).
- **numeric-coverage check**: checks that the extracted numbers are printed in the text, before any model is generated (§4.3; App. B.1).

**Missing glossary terms:**
- **LP and MILP**: a linear objective optimized under linear inequalities; mixed-integer programs force some variables to be integers (App. A.1, (A2)).
- **false-discovery rate (FDR)**: "the expectation of the false-discovery proportion", the share of wrong items among those accepted (§3, Prop. 2).

**Builds on:**
- Experience learners admitting by known optima, labels or experts (Kong et al., 2025; Yang et al., 2026; Liang et al., 2026; §2).
- Self-consistency (Wang et al., 2023; [Self-Consistency](#/papers/wang2022selfconsistency "Self-Consistency Improves Chain of Thought Reasoning in Language Models (2023)")) and juries (Liu, 2026; [LLMs as a Jury](#/papers/liu2026jury "LLMs as a Jury: Cross-Model Consensus Can Outperform Process Reward Models for LLM Reasoning (2026)")), whose "shared-error floor" (the chance all panel members make the same mistake) motivates several families; Zhou (2026; [More Convincing, Not More Correct](#/papers/zhou2026convincing "More Convincing, Not More Correct: Self-Play Reward Hacking of Reference-Free LLM Judges (2026)")) on judges scoring plausibility (§2; §3 Step 1).
- Single-model perturbation testers (Lian et al., 2026; Li & Hai, 2026); Li & Hai's proof that no fixed-threshold tester is "sound and nontrivial" (undefined here) motivates calibration (§2; §3 Step 4).
- Split-conformal Benjamini–Hochberg (Jin & Candès, 2023), which, given many false calibration certificates, replaces the threshold rule and controls the FDR (§2; Prop. 2; App. A.2).

## Problem and setting

Can a learner decide what to store without labels, targeting the FDR among admitted items, "not certainty about each one" (§1)?
- Candidates are Python programs on Pyomo (a modeling library) with the HiGHS solver, or on gurobipy (Gurobi's Python interface); the panel is DeepSeek-V3.2 (also the extractor), GPT-5.4 and Claude Sonnet 4.6 at temperature 0; the host runs DeepSeek-V3.2 (App. B).
- Each certification uses the stated instance and five resampled ones; values agree within relative tolerance 10⁻⁴ (§3 Step 3; §4).
- The stream: the first 300 problems of OptMATH's training split (a synthetic optimization-modeling set), disjoint from the 1,100 evaluation items (§4; App. C). Calibration uses 150 solver-verified NANO-CO instances (cited to OptSkills), whose texts are generated from their instances (§4.3).
- Evaluation: five public optimization-modeling benchmarks (Tab. 9); the **uniform scorer** counts a prediction correct within relative tolerance 10⁻⁴ of the published label or after rounding to its printed decimals (App. B "Scoring rule"). Preregistered (App. B): K1, the best label-free arm reaches 70% of the ground-truth arm's macro accuracy; K2, the gate beats majority vote downstream; K3, realized FDR at most 5%, its 95% upper bound at most 10%; K4, report a nearly uniform family-by-error matrix as weakening decorrelation.

## Approach

Five steps (§3; Fig. 2; Alg. 1):
1. One candidate from each of three families, with different prompts and solver stacks (Step 1).
2. An extractor LLM returns each parameter's stated value and a perturbation range, keeping sizes fixed; instances are drawn at random (Step 2).
3. Candidates agreeing on every informative instance, the stated one included, are linked; if a maximum clique (largest group all consistent with one another) spans two or more families, its value at the stated instance is accepted, else ABSTAIN (Step 3).
4. A score (families, then clique size, then informative instances) is compared with a threshold fitted on solver-verified synthetic problems (Step 4).
5. Only the host's own trajectories whose answer matches the accepted value go to its unchanged Distillation into compact models (Step 5).

The judge swap used the Step 3 rule; the threshold was fitted later and replayed on its stored verdicts (§3, after Prop. 2).

**Theory:**
- For linear and mixed-integer models solved exactly, whose costs and right-hand sides change linearly with the parameters, with a fixed constraint matrix, finitely many optimal integer patterns (settings of the integer variables) and finite values, over a bounded, full-dimensional range (with volume in every direction), sampled independently with each region drawn at least in proportion to its size: if two candidates are not equivalent, they disagree on an open set (a whole region), and the chance that all random instances miss it shrinks geometrically with their number. With a tolerance, the same holds where they differ by more than it, if that region has positive size; an error within tolerance everywhere is undetectable (Prop. 1; App. A.1). With integer-valued parameters it covers only the continuous coordinates, given the rounded ones (App. A.1, Remark 5).
- The lowest threshold whose estimated false-certificate rate is at most the target and whose exact (Clopper–Pearson) upper confidence bound is at most twice it is chosen; its rate is then at most twice the target with probability at least one minus the number of thresholds times the per-threshold failure probability. Under Assumption 1 (the text determines the labeled instance; calibration and deployment certificates of equal score are exchangeable, alike in how often they are false) this carries to deployment (Prop. 2; App. A.2).
- If deployment escalates borderline cases, the guarantee needs calibration under the same escalation policy (Lemma 1; App. A.2).

## Results

- **Admission (§4.2, Tab. 3; Fig. 1).** In the judge swap, admission precision is 0.927 for AdmitOR (30 poisoned of 413), 0.871 for majority vote (93 poisoned) and 0.726 for execution success (241 of 878); AdmitOR's recall of correct candidates is 0.601.
- **Downstream (§4.2, Tab. 2).** Macro accuracy is 58.35 against 54.82 for majority vote, 95% paired-bootstrap interval of the gain [+0.87, +6.68], meeting K2. Against execution success the interval includes zero; the authors claim equal accuracy with a smaller library, "not higher accuracy". Weighted by item, neither gain excludes zero (App. C).
- **Ablation (§4.2, Tab. 3).** Three-family unanimity at the stated instance alone reaches 0.938; the authors credit an external, unanimous value, and "on this stream, resampling never changed an accepted value and only reduced coverage" (abstract).
- **Panel (§4.2; Tab. 5).** The arms' failure profiles differ (K4).
- **Calibration (§4.3; Tab. 8).** The rule holds on the calibration set; on the stream 22 of 138 admitted certificates disagree with the vault (uniform scorer), 15.9% with 95% upper bound 22.0%, failing K3, and "no threshold on the amount of agreement separates them".
- **Audit (§4.3; Tab. 6).** None of the 22 is a gate defect or a legitimate alternative reading; 2 are label errors, 15 lack decisive data and 5 print parameters too imprecisely; the 15 (10.9% of the 138) "cannot be answered from the printed text by any method" (§4.3).
- **Numeric-coverage check (§4.3; App. B.1).** Applied after the fact, it flags 9 of the 15 missing-data cases and none of the 116 concordant admissions; agreement between extractors "does not work at this granularity" (Tab. 4).

## Limits the authors state

- "the gate certifies agreement across independently derived behaviors, not the intended meaning of the problem" (§5).
- "higher admission precision reduces coverage", and the withheld values were mostly correct (§5).
- "the model-level evidence of resampling is not used at admission"; using it "would require parameterized code, which the host does not produce" (§5).
- Prop. 2 "is conditional on Assumption 1" (§5).
- One host backbone, "withdrawn by its providers during the study", so the intermediate judges got no downstream run; no single-model selection judge is evaluated (§5).
- Truncated precision stays "outside the reach of any text-only check" (App. B.1).
- K4 shows "the arms are not interchangeable rather than isolating family as the source of decorrelation" (App. C).
- The audit "is the authors' own" (§4.3); label errors count against every method, and "we base no central claim" on absolute OptMATH scores (§4.1).

## Open problems and building blocks

- **Open:** "The remedy therefore has to act on the extracted numbers before any model is generated" (§4.3); the numeric-coverage check "is the check we specify for deployment" (§4.3; App. B.1).
- **Released:** code, verdicts, the run record and complete case packets (§1; abstract).
- **To reuse it:** three model families and solvers (App. B); solver-verified calibration problems, run under the deployment escalation policy (§3; Lemma 1); per problem one extraction call, one generation call per family, at most one repair and six solver runs per candidate (App. C "Certification cost budget").

## On this site

- **Tags:** <span class="tags"><a class="tag" href="#/tags/labels">labels</a><a class="tag" href="#/tags/stats">stats</a><a class="tag sub" href="#/tags/cex-general">cex-general</a><a class="tag sub" href="#/tags/cex-llm">cex-llm</a><a class="tag sub" href="#/tags/cex-search">cex-search</a><a class="tag sub" href="#/tags/hacking-general">hacking-general</a><a class="tag sub" href="#/tags/harness-general">harness-general</a><a class="tag sub" href="#/tags/harness-promptopt">harness-promptopt</a><a class="tag sub" href="#/tags/judge-general">judge-general</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/promptopt-context">promptopt-context</a><a class="tag sub" href="#/tags/promptopt-general">promptopt-general</a><a class="tag sub" href="#/tags/scaling-general">scaling-general</a></span>
