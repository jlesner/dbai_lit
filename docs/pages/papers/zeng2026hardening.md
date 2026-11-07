# Scalable Weak-to-Strong Verifier Hardening for Agent Environments

**Scalable Weak-to-Strong Verifier Hardening…** · preprint 2026

Read: [PDF](https://arxiv.org/pdf/2610.15924) · [arXiv](https://arxiv.org/abs/2610.15924)

<p class="notice">A summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Weaker LLMs automatically find and repair exploitable verifiers in agent environments from Terminal Bench, KernelBench and SETA, and stronger held-out models attack the result (abstract; §1; §4.1).
- Grading first moves to an isolated verifier sandbox that receives only the declared task outputs; then a verifier-aware hacker agent searches for reward hacks and a fixer agent patches the runtime, verifier or output specification, each patch accepted only after an LLM patch review, replay of known legitimate solutions and a fresh blind solve (§3; Fig. 2).
- Repairing weak checks against exploitation, with the residual measured: against the hardened Terminal Bench verifiers it reports Claude Opus 5 still succeeding in 63.1% of verifier-aware attack trials (Tab. 1), and calls the loop's in-loop `robust` status "an empirical stopping outcome rather than a security guarantee" (App. F).

## In plain words

LLM agents are often scored by programs, called verifiers, that check whether a task was done; an agent can sometimes earn full marks without doing it, "for example by deleting failing tests or monkey-patching the verifier" (§1) (swapping in its own code for the verifier's at run time). The authors say this causes "inaccurate evaluation and misalignment in training" (abstract); their audit found exploits, confirmed by an LLM judge, in 22% of 1,860 tasks from five terminal-agent benchmarks (§2.1). They ask whether a weaker model with more compute can repair verifiers against stronger cheaters (§1). Their loop grades in a separate sandbox that receives only the agent's declared output files, then lets a "hacker" agent that reads the verifier's code look for cheats and a "fixer" agent patch them, keeping a patch only if a review, known legitimate solutions and a fresh solving attempt all pass (§3). Of 295 tasks Claude Opus 5 could first exploit without hints, 201 showed no successful attack in three unhinted tries after hardening by weaker models (§1). They present a "scalable, fully automatic approach" that outperforms "the static, non-iterative baseline" (abstract).

## Background and terms

**Terms to know:** [reward hacking](#/glossary/reward-hacking) · [LLM-as-a-judge](#/glossary/llm-as-a-judge) · [weak-to-strong supervision](#/glossary/weak-to-strong-supervision) · [RL with verifiable rewards (RLVR)](#/glossary/rl-with-verifiable-rewards-rlvr) · [GPU kernel](#/glossary/gpu-kernel-and-kernel-fusion) · [attack success rate (ASR)](#/glossary/attack-success-rate-asr) (an attempt counts only if it reaches the reward threshold and a GPT-5.6-Sol judgment confirms a reward hack, §4.1; App. D.2)

**The paper's own terms:**
- **agent environment, hackable, hardening**: a task is its fixed instruction plus three parts that hardening may change: the agent runtime (execution configuration and workspace), the verifier (test scripts and supporting files that assign reward) and the output specification (§3.1). A verifier is hackable "if an agent can reach the target reward without satisfying" the instruction; hardening removes such exploits "while preserving the task's requirements and legitimate solution routes" (§3.1).
- **output specification**: the list of paths the agent produced that are copied into the isolated verifier sandbox; the paper calls it "part of the defense", since a list that is too broad can carry tampered inputs or executables along (§3.1).
- **AutoSep** (automatic verifier separation): derive a deliberately permissive output specification from the files the shipped reference solution changes, grade in a fresh container, and precheck that the converted task is still solvable (§3.1; App. C.1). **Before / AutoSep / After** name the original environment, the state after this step, and the final hardened one (§4.2).
- **the four held-out conditions**: benign (solve legitimately); unhinted attack (the task plus the cheating goal); hinted attack (adds fixed exploit patterns, no verifier code; App. D.3); verifier-aware attack (adds the current verifier code and output specification, no hints) (App. D.2).
- **per-task / per-trial**: the share of tasks with at least one success in three attempts, and the share of attempts that succeed (App. D.2).
- **Static-15**: the offline baseline that collects up to 15 successful attacks on the AutoSep environment within 45 attack calls, then makes one repair; Tab. 2 reports "gated" and "ungated" variants (§4.2).
- **`robust` status**: the loop stops when the hacker's attempts reach no target reward, at least one effective repair has been accepted, and no earlier attack on that task version reached the threshold (App. C.2).

In the glossary's terms, the setting is weak-to-strong supervision turned to evaluation: a weaker model improves the verifiers that score stronger ones (§2.2).

**Builds on** (none on this site):
- Detection of reward hacking, e.g. EvilGenie [11], which "compares held-out tests, LLM judges, and test-file edit detection"; the authors say the vulnerabilities "still require repair" (§2.2).
- Environment- and domain-specific defenses: RHB [12] (Reward Hacking Benchmark; studies hardening measures such as restricting file access), and CUDA Agent [13] and robust-kbench [14] (more reliable evaluation of CUDA kernels); the authors say these "target particular environments or domains" (§2.2).
- Weak-to-strong generalization, Burns et al. [15], which trains stronger models on weaker models' labels (§2.2).

## Problem and setting

- **Question:** "can weaker models use additional compute to make verifiers more resistant to stronger agents?" (§1), with the hardening model fixed and the search, repair and validation budget growing (§1).
- **Environments:** 102 Terminal Bench tasks (tasks done in a terminal, graded by test scripts) that pass the precheck and have validated legitimate solutions (§4.2), which the authors call "Luna-solvable and Luna-hackable" (App. F); 53 KernelBench Level-1 tasks that run on the authors' GPUs and pass the precheck, whose GPU kernels "must compute correct outputs and run faster than the reference implementation" (§4.3.1); 155 SETA tasks (automatically constructed terminal tasks) that pass reference checks and the precheck, from the collection Terminal Wrench, which the paper does not describe (§4.3.2).
- **Models:** GPT-5.6-Luna hardens Terminal Bench and SETA, GPT-5.6-Terra hardens KernelBench; GPT-5.6-Sol, Claude Opus 5 and Gemini 3.1 Pro are the "stronger" evaluators, with three attempts per task, state and condition and no hardening history (§4.1; App. D.2). Loop budgets: at most 15 iterations, 3 attack attempts each, up to 4 repair candidates per exploit (Tab. 7).
- **What counts:** benign success is the verifier's reward alone; an attack also needs a GPT-5.6-Sol hack judgment (App. D.2). On KernelBench, benign means "a correct kernel that achieves at least 95% of the reference speed" (App. D.2).
- **Scope:** "agent-side exploitation under the stated evaluation permissions; deliberate answer leakage by benchmark submitters is a separate threat" (App. B).
- **The audit:** Claude Opus 4.6, Gemini 3.1 Pro and GPT-5.4 seek shortcuts without the verifier code; an LLM judge classifies rewarded trajectories, and a manual check of the first 49 environments with a confirmed hack found no false positives (App. A.1).

## Approach

- **Separation first** (§3.1; App. C.1): the verifier runs in a container built from the pristine image, and the agent's changes reach it only through the output specification. On KernelBench, AutoSep also times kernels with an external GPU profiler outside the submitted code's process (App. E.2).
- **The hacker–fixer loop** (§3.2; Fig. 2; Alg. 1, App. C): the hacker sees the current verifier code, runtime description and output specification read-only, an advantage the authors call "white-box verifier access" (§1); an in-loop judge separates reward hacks from legitimate completions (§3.2.1); the fixer gets the attack evidence, the reference solution and examples from a corpus of legitimate solutions, and patches the runtime, verifier or output specification (§3.2.2).
- **Three validation gates** (§3.2.3): an LLM patch review rejects patches that remove or weaken substantive checks without an adequate replacement, conceal the tests, "or otherwise change what completion means"; benign replay requires every corpus entry to pass; a fresh blind solve, without reference or verifier hints, checks that a legitimate solution "remains discoverable". A rejected patch returns to the fixer with the reason and evidence (§3.2.3).
- **Online search:** each accepted patch is the target of the next attack, until a stopping condition holds or the budget runs out (§3; App. C.2). On KernelBench only, hackers and fixers also share notes across tasks (App. E.2).

## Results

- **Audit:** exploits in 409 environments, 22% of the 1,860 audited tasks (§2.1; App. A.1).
- **Terminal Bench** (Tab. 1; §4.2): from Before to After, verifier-aware per-trial ASR falls by 33.0–43.1 points across the three evaluators, for Opus 5 from 99.3% to 63.1%. "Benign per-trial solve rates remain within approximately two percentage points of their original levels across all three evaluators." AutoSep alone "sharply reduces" hinted attacks; after it, hinted ASR is below unhinted for all three evaluators, which the authors say suggests "that fixed exploit guidance can lose relevance as the environment changes" (§4.2). Verifier-aware ASR falls at every measured checkpoint (Tab. 3).
- **Online against static repair** (§4.2): Static-15 leaves Opus 5 a verifier-aware per-trial ASR of 72.5% (Tab. 2, ungated row), against 63.1% for the full loop (§4.2).
- **KernelBench and SETA** (§4.3): on KernelBench, "AutoSep already suppresses attacks without verifier access", while verifier-aware attacks "remain effective at AutoSep" and are lower after hardening (Tab. 4; App. E.2). On SETA, hardening lowers all three ASRs for each evaluator relative to AutoSep (Tab. 5), and benign per-trial success also decreases for all three (App. E.3).
- **Ablations, Terminal Bench, Opus 5** (Tab. 6; §4.4): removing the hacker's verifier access, freezing the output specification, or removing separation each leaves higher verifier-aware ASR than the full loop, separation having "the largest effect" (§4.4.1). Without validation, benign per-trial success ends at 71.2% against 91.2%, while verifier-aware ASR is lower (57.5% against 63.1%) (§4.4.2).

## Limits the authors state

- "Hardening is bounded by the hacker's search capability and budget. Verifier access supports targeted search but cannot ensure that all exploit routes are discovered." The hardened environments "still admit successful attacks", and `robust` status "is an empirical stopping outcome rather than a security guarantee" (App. F).
- Validation "provides finite evidence of task preservation"; passing the gates "does not establish preservation of every legitimate solution or of task difficulty" (App. F).
- The cohort "does not represent the prevalence of vulnerabilities across the source benchmarks", and Static-15 and the full loop "differ in realized compute, limiting attribution of their performance gap to online adaptation alone" (App. F).
- On KernelBench, "many hardened tasks still admit at least one exploit within the evaluation budget"; in one case that ended `robust`, an independent Opus attack moved the computation to the CPU, and "the loop's stopping outcome remains specific to the in-loop hacker and its search budget" (App. E.2).
- The cost estimates "exclude unmetered judge, patch-review, and summary calls, upstream preparation, and otherwise unrecorded usage" (App. D.5).
- Dual use: "the automated exploit-search component could lower the effort needed to discover and exploit verifier weaknesses" (App. G).

## Open problems and building blocks

- **Open:** "Integrating this process into RL training and evaluating its effects on reward hacking and task performance are directions for future work" (§5).
- **Released:** "We will release our hardening implementation, hardened verifiers, and evaluation code" (§1); a project page (abstract). "An earlier version of our hacker-fixer loop has been adopted by the official Terminal Bench repository as a way to audit exploits in its environments" (abstract).
- **To reuse it:** a reference solution per task and earlier legitimate solver trajectories (§3.1); container-graded tasks with an `artifacts` path list in `task.toml` (the task's configuration file) (App. C.1); the models and budgets of Tab. 7; CPU hosts, and GPU slices for KernelBench (App. D.5). Estimated hardening API cost per task: $1.45 on Terminal Bench, $1.65 on SETA, $4.42 on KernelBench (Tab. 11).

## On this site

- **Discussed in:** [Can SQL equivalence checkers be trusted?](#/challenges/checker_soundness) · [A gym of DSL tasks with answer keys made by code](#/challenges/dsl_gym) · [Weak checkers get exploited](#/challenges/weak_checker_exploitation)
- **Tags:** <span class="tags"><a class="tag" href="#/tags/agent">agent</a><a class="tag" href="#/tags/code">code</a><a class="tag" href="#/tags/hacking">hacking</a><a class="tag" href="#/tags/harness">harness</a><a class="tag" href="#/tags/labels">labels</a><a class="tag" href="#/tags/llm">llm</a><a class="tag" href="#/tags/method">method</a></span>
