# Who Verifies the Verifier? Co-Evolving Inspectable Graders with Self-Improving Agents

**Who Verifies the Verifier?…** · NeurIPS 2026 Workshop "Who Verifies the Agents? Toward Reliable Agent Development" (PDF p. 1 footer)

Read: [PDF](https://arxiv.org/pdf/2610.11464) · [arXiv](https://arxiv.org/abs/2610.11464)

<p class="notice">A summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Evolves the grader of a self-improving agent rather than the agent: a readable expression (any-of, all-of, votes) over small, mostly deterministic drawback detectors (static checks, execution in a sandbox or a live warehouse, narrow LLM-judge questions), selected for agreement with a ten-item anchored reference set and with detector consensus on unlabeled outputs, "never for the agent's score"; paired with the Ratchet skill loop ([Ratchet](#/papers/zhang2026ratchet "Ratchet: How Reliable Must an LLM Judge Be to Retire a Skill? (2026)")) as Double Ratchet (abstract; §3.1–3.3).
- Detectors are synthesized from clustered failures and admitted by a birth gate; those born only from unlabeled gaps are held as unselectable shadows until they raise anchor agreement, and detectors are retired by their leave-one-out contribution; selection fails closed and drops all-pass, all-fail and all-abstain candidates (§3.2, Alg. 1; App. C). Claude Opus 4.7 in every loop role, on MBPP+, Spider 2.0-Snow and analyst-report sections, three seeds, locked held-out sets of 40–48 items no part of verifier evolution reads; a naive arm turns off the anchor guards and skill-side rollback, a no-lifecycle arm the detector lifecycle (§3.3; §4; Tab. 1).
- A weak check exploited in prompt space: with the anchor guards off, the verifier on report generation collapses to always-pass, passing 0.97–1.00 of what it grades, yet its skill loop scores as well as the anchored one, so the authors conclude task score "cannot validate a self-evolved verifier" (§5.2, Fig. 3; Tab. 1). They also report evolved skills gaming the report rubric, caught only by an outer judge (§5.4), and Spider verifier agreement near chance once failures are clean-executing wrong values (§5.5).

## In plain words

Every self-improving agent loop needs a grader to say whether a change helped. On open-ended tasks no reliable grader exists, so loops get a hand-written rubric or a bare LLM judge, which the authors say invites [reward hacking](#/glossary/reward-hacking) and shared blind spots (abstract; §1). They evolve the grader itself: a readable combination of small, mostly deterministic checks for known drawbacks, chosen for agreement with ten reference examples and with the checks' consensus on unlabeled outputs, never for the agent's score (abstract). On MBPP+ (writing Python functions) its agreement with hidden unit tests rises by 0.21 over the hand-written starting grader, on every seed, though a task-level test finds it not significant (§5.1). Their warning: on report generation, with the anchoring safeguards (the guards that tie selection to those examples) off, the grader collapses to passing almost everything, yet trains skills (reusable guidance texts for the agent) as well as the anchored one, so task score cannot certify a grader (§5.2). Driving an existing skill loop, it keeps 88–110% of the peak gain that ground truth or a rubric buys it, across code, text-to-SQL and report tasks (abstract; Tab. 1). They call it "a mechanism study" (§6).

## Background and terms

**Terms to know:** [agent skill](#/glossary/agent-skill) · [LLM-as-a-judge](#/glossary/llm-as-a-judge) · [Goodhart's law](#/glossary/goodharts-law) · [rubric](#/glossary/rubric) · [reference-free evaluation](#/glossary/reference-free-evaluation) · [text-to-SQL](#/glossary/text-to-sql) · [permutation test](#/glossary/permutation-test)

**The paper's own terms:**
- **verifier (grader)**: "the function that grades one output" (pass, fail or abstain); the only thing that evolves (§1; §3).
- **op (drawback detector)**: checks "exactly one failure class" and says drawback, clean or abstain. Static ops inspect the output, execution ops run it (in a sandbox for code, on a live warehouse for SQL), judge ops ask an LLM one narrow question (§3.1).
- **verifier expression**: ops combined by any-of, all-of, negation or votes; an output passes when a fixed root check and the expression find no drawback (§3.1; grammar in App. C).
- **splits**: train, large and unlabeled; dev, the anchor: ten items, each with a golden reference against which a teacher LLM gives soft (judged rather than checked) pass/fail labels, "the only supervised signal verifier evolution reads"; test, locked, with the strongest reference (unit tests, official execution comparison, the report rubric), read by no part of verifier evolution (§3; App. B).
- **misses, gaps, birth gate, shadows**: misses are dev items the verifier passes though their label is fail, gaps train outputs on which the ops abstain or split. A new op is admitted only if it fires on at least half its cluster and stays clean on known-good outputs; ops born only from unlabeled gaps are shadows, unselectable until they raise dev agreement (§3.2; App. C).
- **selection objective** (Eq. 1): dev agreement, recall-weighted ("a missed drawback costing twice a false alarm"), times agreement with the ops' consensus on train outputs, each op's vote weighted by its anchored leave-one-out marginal (its contribution to the current verifier, measured by leaving it out), minus a size penalty (§3.2).
- **anchor guards**: selection fails closed (a candidate with no usable dev opinion is unselectable), and a validity gate drops candidates that pass, fail or abstain on everything (§3.2). The **lifecycle** is the birth gate, shadows and retirement of ops with no positive marginal (§3.3).
- **failure capsule**: a failed attempt whose error text feeds skill synthesis (§3.3).
- **Double Ratchet**: the evolved verifier grading the Ratchet skill loop; the **reference** loop is the same skill loop given ground truth or the best available rubric. The **naive** arm turns off the anchor guards and skill-side rollback (undoing skill changes that lower the held-out score); the **no-lifecycle** arm turns off the lifecycle (§3.3).
- **lift retention**: Double Ratchet's peak gain over round 0 as a fraction of the reference loop's (Tab. 1 caption). **Peak** is the best round on the locked set, "optimistic"; **final rounds** the mean of the last ten (§5).
- **outer audit** (report task): a stronger LLM compares each final output with the pre-evolution baseline, twice with positions swapped; "It is an audit, never a training signal" (§3.3; App. D).

**Builds on:**
- Ratchet [1] ([Ratchet](#/papers/zhang2026ratchet "Ratchet: How Reliable Must an LLM Judge Be to Retire a Skill? (2026)"), cited by its v1 title), the authors' own skill loop, "adopted unchanged here as the skill-side component" (§2).
- Program search against a supplied evaluator, AlphaEvolve (an LLM-driven evolutionary coding agent) [32] ([AlphaEvolve](#/papers/novikov2025alphaevolve "AlphaEvolve: A coding agent for scientific and algorithmic discovery (2025)")) among them: "the fitness differs in kind" (§2).
- Agent-as-a-Judge co-evolution [44] (agents judging other agents), "closest in spirit", which "validates the judge through the system it grades" (§2).
- CodeScore [45] (a learned predictor of code correctness) and SQLHD [46] (text-to-SQL hallucination detection by hand-written [metamorphic](#/glossary/metamorphic-testing) relations), read "as components rather than competitors" (§2).

## Problem and setting

- **The question:** "can an agent's verifier be evolved from a handful of anchored examples, drive learning as well as ground truth, and not be gamed in the process?" (§1). A clean verdict "means no known drawback was found rather than certified correctness" (§1).
- **Tasks** (§4 "Task areas"; App. A): MBPP+ (Python functions, anchored by the hidden unit tests of EvalPlus (a suite adding many more tests per MBPP problem), [EvalPlus](#/papers/liu2023evalplus "Is Your Code Generated by ChatGPT Really Correct? Rigorous Evaluation of Large Language Models for Code Generation (2023)")) and Spider 2.0-Snow (enterprise text-to-SQL on Snowflake (a cloud database service) warehouses, anchored by official execution-result comparison, [Spider 2.0](#/papers/lei2024spider2 "Spider 2.0: Evaluating Language Models on Real-World Enterprise Text-to-SQL Workflows (2025)")) validate; report generation (analyst-report sections from audited evidence cards (claims with verbatim source quotes, stance and an auditor's credibility verdict)) is the target, where "No golden verifier exists" and the rubric score plus golden demonstration sections are "a partial reference signal, not ground truth".
- **Data and models:** locked test sets of 40–48 items (Tab. 1; App. B). Every in-loop role is Claude Opus 4.7; the report task's outer judge is Claude Opus 4.8 (§4 "Roles and models"). The solver is "a single direct LLM call with no tools, iteration, or scaffolding" (§4).
- **Budget and statistics:** skill loops run 100 rounds; co-evolution puts verifier phases of 15/8/5/2 rounds between four 25-round skill phases (§4). Three seeds; validity is tested by a task-level sign-flip permutation test, since pooled [McNemar](#/glossary/mcnemars-exact-test) tests would be "anti-conservative" (too quick to find significance) (§5).

## Approach

- **One round** (§3.2, Alg. 1): collect misses and gaps; cluster them by failure class; a synthesizer writes a typed op per recurring cluster, behind the birth gate; an LLM composer proposes expressions, plus mutations and crossovers (edits of one expression, and recombinations of two) of the best earlier ones; keep the best by Eq. 1, behind the validity gate; retire and promote ops; report locked-set agreement, as measurement only.
- **Co-evolution** (§3.3): the current best verifier grades the skill loop's training attempts; held-out scoring and rollback stay on the locked set, "so a corrupted verifier can slow skill learning but cannot redefine the evaluation metric".

## Results

- **Validity on MBPP+** (§5.1, Fig. 2): held-out agreement 0.625 ± 0.050 against 0.417 ± 0.058 for the hand-authored seed composition and 0.55 for the bare LLM judge op it contains. Every seed is net positive, but the task-level test gives p = 0.12 at peak: with 40 locked tasks and three seeds, "the design supports a consistent direction, not a calibrated rejection".
- **The other tasks are "not replications"** (§5.1): report generation starts at ceiling, and Spider sits near chance (0.500 ± 0.026) while its objective climbs. Under a first Spider prompt, failures were mostly compile errors and agreement reached 0.85; prompt grounding left failures that are wrong values from queries that run cleanly, "invisible to deterministic detectors" (§5.5).
- **Which guard matters** (§5.2, Fig. 3; App. F Tab. 3): on report generation, turning off the anchor guards collapses the verifier on every seed into one that passes 0.97–1.00 of everything; turning off the lifecycle collapses nothing. For verifiers under anchored selection, "anchor discipline carries the safety load", the reverse of the skill-evolution emphasis (§5.2).
- **Why task score cannot tell** (§5.2; Tab. 1): the naive arm's skill loop scores as well as Double Ratchet's: an always-pass verifier reduces training to "unfiltered practice", and held-out scoring never passes through the verifier.
- **Sufficiency** (§5.3, Tab. 1): Double Ratchet retains 106%, 110% and 88% of the reference loop's peak lift on MBPP+, Spider and Report, within noise on the first two and a small gap on Report; on MBPP+ and Spider it solves more never-solved held-out tasks than the reference loop. The authors call the verifier's training role "directional": it picks which attempts become capsules.
- **Reward hacking** (§5.4, Tab. 2): evolved skills raised the rubric score partly by writing metric tags (inline tags tying a figure to a registered metric) in place of numbers and inventing confident forecasts, which no in-loop signal saw but the outer judge did. One added erasure detector, with rewritten failure hints, repaired it. A generic outer judge's win rate barely moves after the repair (0.122 to 0.126); given a task-aware rubric that states the output's format contract, the judge goes from 0.515 to 0.770.

## Limits the authors state

- "This is a mechanism study, not a scaling result: three task families, one model family, rounds in the low hundreds, held-out sets of tens of items, and one stronger model as outer judge rather than a panel or human study" (§6).
- The MBPP+ validity lift is "consistent but not significant" (§5.1).
- Because the skill loop rolls back against the test set, "absolute skill-side levels are nonetheless optimistic against a never-touched third split" (§3); peak is "a locked-set argmax and therefore optimistic" (§5).
- Substitution "is a weaker claim than causing the gain": retained lift "does not isolate verifier accuracy"; the report reference "is itself a partial rubric" (§5.3).
- "We claim the pair rather than the detector alone, since separating them needs reruns we did not do"; the task-aware rubric "was written after reading the generic judge's rationales, so it diagnoses the audit rather than independently confirming the repair" (§5.4).
- Verifier evolution "buys the most where failures are checkable, a scoping condition rather than an implementation limit" (§5.5).
- With the single-call solver, "absolute numbers are not comparable to leaderboard agents" (§4).
- "Guidance-text skills cannot substitute for capabilities that need interaction" (the ceiling on Spider); metamorphic-style detectors are implemented but unused, "so we make no claim about them" (App. F "Two further scope limits").
- "Evolution expands coverage but never creates ground truth. With no anchor the loop optimizes noise" (§6).

## Open problems and building blocks

- **Open:** "The open frontier is outputs that execute cleanly yet are semantically wrong"; "hardening soft anchors into checkable ones pays most" (§6). The reasons to build a verifier well "lie elsewhere, in triage, gating, and repairability" (§5.3).
- **Released:** Nothing stated. App. G describes the JSON and SQLite files each run writes, from which "every number in this paper is read directly".
- **To reuse it:** no GPUs, only a CPU host calling a hosted API; each LLM role is bound from a role-to-model table, so another model is "a configuration change rather than a code change"; Spider 2.0 needs credentialed access to the benchmark's hosted warehouse (App. G).

## On this site

- **Discussed in:** [Checking text-to-SQL against intent](#/challenges/text_to_sql_verification) · [Gains made against a checker, carried beyond it](#/challenges/transfer_beyond_the_checker) · [Weak checkers get exploited](#/challenges/weak_checker_exploitation)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/hacking-general">hacking-general</a><a class="tag sub" href="#/tags/harness-general">harness-general</a><a class="tag sub" href="#/tags/harness-promptopt">harness-promptopt</a><a class="tag sub" href="#/tags/judge-general">judge-general</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/promptopt-context">promptopt-context</a><a class="tag sub" href="#/tags/promptopt-feedback">promptopt-feedback</a><a class="tag sub" href="#/tags/promptopt-general">promptopt-general</a></span>
