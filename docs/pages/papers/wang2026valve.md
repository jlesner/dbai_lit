# Certified Long-Horizon Code Agent Evolution via Validation-Gated Skill Optimization

**Certified Long-Horizon Code Agent…** · preprint 2026

Read: [PDF](https://arxiv.org/pdf/2609.32990) · [arXiv](https://arxiv.org/abs/2609.32990)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Long-horizon self-evolution of a code agent with frozen weights: after a task with mixed outcomes, the same LLM contrasts successful and failed trajectories to propose skills and principles, which join a persistent bank only if a paired rerun on a fixed 50-task validation panel gains at least 0.02 in pass rate; a retriever that scores embedding similarity, word overlap and an importance prior (App. B.5) picks items for later tasks (§1; §4.1; App. B.6).
- Runs mini-SWE-agent over streams of about 1,000 tasks from four SWE-smith repositories with three LLMs, against SkillOpt and itself without the gate (§4.1), and proves finite convergence, gain and drawdown bounds, and holdout sizes under i.i.d. sampling and a variance bound (§3).
- A gated skill bank over a long stream, with executable checks: without the gate, three of the four Claude-4.6 runs finish below the unevolved model (§4.2). "Certified" means high-probability bounds under i.i.d. sampling and a stated variance bound (§1), with the variance estimated from the main runs' own paired samples; the gate itself is "an empirical acceptance margin rather than a confidence level" (App. B.6).

## In plain words

A coding agent working through a long task stream could keep improving without retraining, by writing lessons from its attempts into notes it reads before later tasks. The authors say such methods "often suffer from unstable updates, performance drawdown, and agent collapse over extended deployments" (abstract). Their method, VALVE, keeps the notes proposed from a task only if they raise the pass rate on a fixed set of 50 held-out tasks by at least two percentage points (§3.1, §4.1). They prove that the number of kept changes is limited, and bound, with high probability, the real gain and the drop from the best saved version of the notes to the final one, assuming tasks drawn independently from one distribution and a stated variance bound (§1, §3). Over about 1,000 tasks in each of four repositories with three LLMs, the held-out pass rate, averaged over twelve runs, rises from 63.9% to 78.9%, against 71.1% for the skill optimizer SkillOpt and 64.9% without the check (Tab. 1). They make no "first" claim, but call the repository setting "unexplored" (abstract).

## Background and terms

**Terms to know:** [agent skill](#/glossary/agent-skill) · [agent harness](#/glossary/agent-harness) · [automated program repair](#/glossary/automated-program-repair) · [reflective prompt optimization](#/glossary/reflective-prompt-optimization) · [dense retrieval](#/glossary/dense-retrieval)

**The paper's own terms:**
- **in-context self-evolution**: improving during deployment "while its model weights remain frozen", with the harness fixed, through a persistent text memory (§1, §3.1).
- **bank**: that memory; in the reference setup, append-only banks of principles and of skills (App. B.4).
- **principle / skill**: a principle encodes "transferable reasoning guidance", a skill "narrow executable procedures" (§3.1).
- **mixed task**: a task whose three attempts include passes and failures; only these trigger Extract, and evolution steps count them (App. B.2).
- **validation panel / evaluation set**: 50 tasks reused for every accept decision; 100 tasks only for measuring checkpoints, "never used by extraction or validation" (§4.1; Assumption 1, §3.1).
- **avg@3 resolved rate**: the percentage of all three attempts per evaluation task that pass the task's tests (App. B.7).
- **final gain, peak gain, drawdown**: with checkpoints the bank frozen and evaluated every ten mixed tasks (App. B.7): final and highest checkpoint rate minus the step-0 rate, and the "peak-to-final" drop (§3.2, §4.1).
- **certified**: holding with probability at least 1 − δ (δ: the allowed failure probability) under Assumption 1 and stated variance bounds (§1, §3.2); not the glossary's certificate (evidence a program checks).
- **Bennett radius**: how far an average of N i.i.d. samples, with variance at most s² and rising at most M above their mean, can exceed the true mean, except with probability at most e^(−L), L setting the confidence (§3.1; Lemma 1, App. A.2).
- **Assumption 1**: per repository, panel, evaluation set and task stream are disjoint i.i.d. (independent, identically distributed) samples from the repository's task distribution; proposals may depend on earlier verdicts and the panel may be reused (§3.1).

**Missing glossary terms:**
- **concentration inequality**: a bound on the chance that an average of independent samples lies far from its expectation; Bennett's inequality uses their variance and largest deviation (App. A.2).

**Builds on:**
- SkillOpt (Yang et al., 2026; [SkillOpt](#/papers/yang2026skillopt "SkillOpt: Executive Strategy for Self-Evolving Agent Skills (2026)")), which "accepts edits using held-out performance", and SkillOpt-Lite (Shen et al., 2026; not listed here), which "introduces an independent validation gate for skill updates": "Most closely related" (§2), motivating the study (§1).
- Lines the paper "connects" with: prompt optimizers APE, ProTeGi, OPRO, TextGrad and GEPA ([APE](#/papers/zhou2022ape "Large Language Models Are Human-Level Prompt Engineers (2023)"), [ProTeGi](#/papers/pryzant2023protegi "Automatic Prompt Optimization with 'Gradient Descent' and Beam Search (2023)"), [OPRO](#/papers/yang2023opro "Large Language Models as Optimizers (2024)"), [TextGrad](#/papers/yuksekgonul2024textgrad "TextGrad: Automatic 'Differentiation' via Text (2024)"), [GEPA](#/papers/agrawal2025gepa "GEPA: Reflective Prompt Evolution Can Outperform Reinforcement Learning (2026)")) and context engineering (evolving "richer context artifacts", §2) with ACE ([ACE](#/papers/zhang2025ace "Agentic Context Engineering: Evolving Contexts for Self-Improving Language Models (2026)")) and MCE (not listed here) (§1).
- The harness mini-SWE-agent, a minimal coding agent from the SWE-agent team ([SWE-agent](#/papers/yang2024sweagent "SWE-agent: Agent-Computer Interfaces Enable Automated Software Engineering (2024)"); mini-SWE-agent cited as its repository), and the task source SWE-smith (Yang et al., 2025; not listed here) (§4.1).

## Problem and setting

- **Question:** can a frozen code agent keep its gains as its text bank grows, and what can a held-out check guarantee (§1)?
- **Objective:** a bank maximizing expected solve probability on the repository's tasks, Retrieve fixed (§3.1).
- **Correct** means the patch passes the task's executable tests; "this outcome, rather than the agent's self-assessment, supplies the binary label" (App. B.2).
- **Statistics:** Assumption 1 and variance bounds (§3.1); the panel's bound σ² = 0.025 is estimated from 24,600 task-level paired samples "from the main runs" (App. B.6); "the certificates are stated as holding under these bounds" (App. A.9).
- **Tasks:** issue-fixing tasks from four repositories in SWE-smith's training split (Tab. 5; App. B.2): `pygments` (syntax highlighting), `sqlfluff` (SQL parsing and linting), `pydicom` (medical-image processing), `deepdiff` (recursive object comparison) (App. B.1). Per repository: a 100-task evaluation set, the 50-task panel, and a stream of about 1,000 tasks with at most 100 mixed-task steps (§4.1).
- **Models:** one LLM as solver, extractor and consumer: open-weight MiniMax-M2.7 (served locally), or proprietary GPT-5.5 or Claude-4.6-sonnet (§4.1).

## Approach

- **Retrieve (App. B.5):** the top 10 principles and top 10 skills by a score of word overlap, an importance prior and embedding similarity go in full into the system prompt.
- **Extract (§3.1; App. B.3–B.4):** the solver makes three attempts; on a mixed task, a reflection call given the labeled attempt summaries proposes at most three principles and three skills. Near-duplicates are dropped.
- **Validate (Eq. 1, §3.1; App. B.6):** a task's proposals form one move, judged together. Current and candidate banks each get three graded attempts per panel task; the move is committed only if the candidate's pass rate is at least the current one plus ρ = 0.02.
- **Thm. 1 (Fixed-panel convergence, §3.2):** if the current bank's panel score is carried forward rather than re-measured after a rejection, that score never decreases, and the number K of accepted moves is at most (1 − initial panel score)/ρ ≤ 1/ρ, rounded down; the run visits at most K + 1 banks. It holds "for arbitrary history-dependent proposals and reuse of V" (the panel). If improvement is localized to tasks with unstable baseline outcomes, a fraction h, the cap tightens to h/ρ rounded down (§3.2; App. A.4 proves it under Assumption 2 with the observed fraction plus a residual allowance).
- **Thm. 2 (Certified gain and drawdown, §3.2):** under Assumption 1, with probability at least 1 − δ, the final bank's true gain is at least the gain measured on the evaluation set minus a Bennett radius (using the evaluation variance bound), this part requiring that lower bound to be nonnegative; and the true drawdown is at most the measured one plus a radius with ln(A/δ), A being the number of distinct banks among checkpoints, at most K + 1. The proof uses a checkpoint schedule fixed in advance (App. A.5).
- **Thm. 3 (Adaptive-validation population-loss guarantee, §3.3):** under Assumption 1, with probability at least 1 − δ, for every accepted move and every slack γ > 0 for which the bound is at least −γ, the move's true gain is at least its measured panel gain minus a Bennett radius, hence at least ρ minus it. The radius grows with the log of how many bank-and-move pairs could have produced that acceptance, given a gate-query horizon (the number of accept checks allowed) fixed in advance (App. A.7).
- **Cor. 1 (Holdout sizing, §3.3):** inverting the radius gives the number of held-out tasks that keeps it at most a tolerance γ > 0, growing to leading order as variance times the log term over γ².
- **Thm. 4, Cor. 2 (App. A.6):** a like lower bound on the gated-minus-ungated gap on one evaluation set, given a variance bound on its per-task values, and on its average over repositories with disjoint evaluation sets.

## Results

- **Final pass rate (Tab. 1, §4.2):** averaged over twelve model–repository runs, 63.9% → 78.9% (+14.9 points), against 71.1% for SkillOpt and 64.9% ungated. Every VALVE run beats its base and ungated runs; SkillOpt remains best on two runs (MiniMax-M2.7 `deepdiff`, Claude-4.6 `pydicom`).
- **Retention (Tab. 2, §4.2):** average drawdown 1.5 points, against 6.1 ungated and 3.6 for SkillOpt (peak gains 16.5, 7.0, 10.8); the abstract calls this a 75% cut. Without validation, three of the four Claude-4.6 runs and the MiniMax-M2.7 `pydicom` run end below the base model (§4.2).
- **Bank size (Tab. 3, §5.3):** 204 skills and 192 principles kept with the gate, against 2,422 and 2,024 without, "an 11× reduction". Each item of the gated Claude-4.6 `pygments` bank, alone, beats the no-memory baseline (Tab. 10, App. E).
- **Ablation (Fig. 3, §5.1), GPT-5.5 on `pydicom` only:** the full pipeline beats six one-change variants, by 4.0 points (inject every item) up to 11.7 (reflect on batches of four tasks); the bars show each variant's maximum through evolution (Fig. 3 axis).
- **Panel size (Fig. 4, §5.2), Claude-4.6 on `pygments` only:** the final rate rises over sizes 0, 10, 30, 50, mostly from 10 to 30; the peak is not monotone.
- **Bounds in numbers (Tab. 4, App. A.9):** at δ = 0.05 and σ² = 0.025, a 10-point tolerance on each accepted move, for up to seven accepts and 60 gate queries, anchored at the observed accepted panel gain, needs 136 panel tasks.

## Limits the authors state

- "The theorem does not imply monotone realized performance"; the panel sweep is "not … empirical verification of the bound or evidence that any particular panel size is universally sufficient" (§5.2).
- The panel is "50 distinct task draws with three within-task replications, not 150 independent population-task samples", and ρ "is an empirical acceptance margin rather than a confidence level" (App. B.6).
- Peak values, selected on the evaluation set, are "not an untouched final-test estimate" (App. B.7).
- Some ablations change more than one thing, so differences "should therefore be interpreted as effects of these operational method variants, not as estimates of perfectly isolated primitives" (App. B.8).

## Open problems and building blocks

- **Open:** None stated.
- **Released:** Nothing stated (App. B.7 says the records "needed to reconstruct each accepted transition" are retained).
- **To reuse it:** tasks with executable pass/fail tests (App. B.2); Qwen3-Embedding-0.6B for retrieval "when available, with a deterministic hashing representation as a fallback" (App. B.5). A gate comparison uses up to 300 graded attempts (App. B.6); a gated run averaged 122.1 hours, against 50.6 ungated and 96.1 for SkillOpt, evaluation excluded (§4.1; Tab. 8, App. D).

## On this site

- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/harness-general">harness-general</a><a class="tag sub" href="#/tags/harness-promptopt">harness-promptopt</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/promptopt-context">promptopt-context</a><a class="tag sub" href="#/tags/promptopt-feedback">promptopt-feedback</a><a class="tag sub" href="#/tags/promptopt-general">promptopt-general</a></span>
