# Skill Issue: Lessons from Optimizing Repository SKILLs for Coding Agents

**Skill Issue** · preprint 2026

Read: [PDF](https://arxiv.org/pdf/2609.12742) · [arXiv](https://arxiv.org/abs/2609.12742)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Optimizes repository SKILL files for coding agents on tasks mined from real pull requests.
- GEPA vs SkillOpt on three Kotlin repositories.
- The gains are within run-to-run noise: a caution on small benchmarks.

## In plain words

Coding agents can read a SKILL, a Markdown file in the repository describing the project that, unlike a separate memory service, can be reviewed and merged like code (§1). Recent work optimizes these files against a benchmark, but a repository has none, and the authors say the synthetic tasks prior work builds are small enough that a capable agent saturates them with no file at all (abstract). They mine harder tasks from a repository's merged pull requests, undone at one fixed commit, and score a file by whether the same agent (Claude Code with Sonnet 4.6) does better with it than with an empty file. On held-out tasks from three Kotlin repositories, files from the optimizer GEPA raise this score by 4.9 percentage points on average, and files from SkillOpt by 0.1; at the dataset size one repository supplies, the authors say, the GEPA gain cannot be separated from the agent's run-to-run variance (abstract). They present lessons, not a new optimizer: a mining pipeline, a two-optimizer comparison, a maintainer's reading, and yield and cost numbers (§1).

## Background and terms

**Terms to know:** [agent harness](#/glossary/agent-harness) · [reflective prompt optimization](#/glossary/reflective-prompt-optimization) · [Pareto front](#/glossary/pareto-front) · [sign test](#/glossary/sign-test) (between the two rollouts of a task, §4.2)

**The paper's own terms:**
- **Seed**: the starting SKILL; in the reported runs an empty document, in fact a file with only a header (§3.2, §4.1 footnote).
- **Reverse-PR mining**: reverting a merged pull request's implementation at a single **frozen base** commit shared by all tasks, so the tests that start failing specify the task (§1, §3.1). The **forward direction**, the setup of the SWE-bench benchmark (tasks from GitHub issues), places each task at its own parent commit (§3.1).
- **Paired score**: a candidate's rollout (one full agent run) is compared with the seed's stored rollout on the same task; the seed against itself scores exactly 0.5 (§3.2). The "pp" gains are this score's mean rise above 0.5 (abstract, §1).
- **Proposer, verifier, reflector**: the proposer (GEPA or SkillOpt) edits the SKILL, the verifier scores it on mined tasks (§1), the reflector is the model that reads rollouts and proposes edits (§1, §2).

**Missing glossary terms:**
- **FAIL_TO_PASS set**: the tests that pass at the unmodified base and fail once the change is reverted; the agent must make them pass (§3.1 "Validation and grading").

**Builds on:**
- GEPA ([GEPA](#/papers/agrawal2025gepa "GEPA: Reflective Prompt Evolution Can Outperform Reinforcement Learning (2026)")), a prompt optimizer that picks a candidate from a Pareto frontier, runs it on a minibatch, and has a reflection model rewrite it (§2).
- SkillOpt ([SkillOpt](#/papers/yang2026skillopt "SkillOpt: Executive Strategy for Self-Evolving Agent Skills (2026)")), bounded edits to one skill document behind a strict improvement gate (§2).
- gskill and its blog post, GEPA's authors applying GEPA to one repository's SKILL, "the closest published system to ours" (§5); listed with the project `gepa`.
- SWE-smith, which builds tasks by injecting defects into working code (§1); its pull-request-mirroring strategy is reimplemented for the JVM (Java Virtual Machine) (§3.1).

## Problem and setting

- **Research questions RQ1–RQ4 (§4):** RQ1, how many usable tasks mining yields and how hard they are against SWE-smith's; RQ2, whether GEPA or SkillOpt finds a document that helps on held-out tasks; RQ3, whether such a gain can be told apart from the agent's own variance; RQ4, whether a maintainer finds the documents useful.
- **Agent:** Claude Code (Anthropic's coding agent) driven by Sonnet 4.6, frozen, with the same tools and limits for every candidate, each attempt in a fresh Docker container with `.git` removed (§4.1).
- **Repositories:** kotest (a Kotlin testing tool), ktor (a framework for microservices and web applications) and koog (a JVM framework for AI agents), per their reference titles. Each pool is split once into train, validation and test (§4.1), leaving 20 to 26 held-out tasks per repository (§1).
- **Budgets:** GEPA 200 scored attempts per repository, SkillOpt three epochs (§4.1).
- **Task statements:** the linked issue, or else the pull request description rewritten by an LLM into issue text and checked for leakage against the gold patch, the merged pull request's own change (§3.1).
- **Resolved** means every hidden FAIL_TO_PASS test passes (§3.2).

## Approach

- **Mining (§3.1).** The implementation is reverted in three tiers: `git apply --reverse`; added and deleted files undone structurally; then, for modified files within a size gate, an LLM reconstructs the old source. The LLM tier "carries most of the yield" but introduces defects the validation gate cannot see; a static check catches them (§3.1, App. A).
- **Why a frozen base (§3.1).** At per-PR parent commits the SKILLs described the repository "as it was across months of history rather than as it is"; App. I prints one telling the agent to identify which of "two distinct repository shapes" it is in.
- **Validation (§3.1).** The suite runs at the base, then per task with the gold patch reversed; a task is kept only if tests that passed start failing, confined to that change.
- **The objective (§3.2).** Two rollouts are compared in three steps, the first that separates them deciding: editing test files or claiming a success the tests contradict loses; then passing every FAIL_TO_PASS test wins; then a bounded blend of tests passed, honesty, diff size and tool calls, so "a cheaper or tidier rollout can never outrank a correct one". Absolute scores, tried first, were dropped: "Counting solved tasks leaves almost every rollout at 0", and grading the document "improves the grade while leaving the agent unchanged" (§3.2, App. D).
- **The optimizers (§2).** GEPA keeps a rewrite that beats its parent on the minibatch and evaluates it on a larger selection set. SkillOpt's optimizer model proposes add/delete/replace edits under an edit budget (a textual learning rate, decayed on a schedule) and accepts a candidate only if it strictly improves a held-out selection score.
- **Maintainer reading (§4.3).** A koog maintainer read both koog documents and blind-reviewed the agent's patches for two open issues under no SKILL, GEPA's and SkillOpt's.

## Results

- **Yield and difficulty (RQ1, §4.1).** "Roughly one merged pull request in five survives". Mined tasks change a median of 54 lines across 3 files on koog, against 4 and 7 lines in SWE-smith's instances for gskill's repositories; the authors note the contrast is between ways of building tasks, not projects. With no SKILL the agent resolves 53% pooled (koog 40%, kotest 51%, ktor 66%), "where the same harness leaves almost nothing to resolve on SWE-smith's".
- **Gain (RQ2).** On the held-out splits GEPA's documents score above 0.5 on every repository, and SkillOpt's loss on ktor cancels its gains elsewhere (§4.2, Tab. 1); the mean gains are 4.9pp and 0.1pp (abstract, §1, §7).
- **Separability (RQ3, §4.2).** No run of either proposer clears p = 0.05 in a sign test; at 20–26 tasks the test rejects only when the document wins four of every five disagreements, pooled over 69 tasks two of three. The authors say every effect reported in this line of work sits below that line, "ours, and gskill's on its strongest configuration", and that "The documents may still help; however, a pass rate over a hundred mined tasks is not sensitive enough to show it."
- **Maintainer (RQ4, §4.3).** The GEPA document's valued parts need project experience: multiplatform source sets (Kotlin's split of a module's code between target platforms) and module dependency direction; it omits the `@Tool` annotation, which turns a Kotlin function into a tool the agent can call. Of the SkillOpt document one item is "great and important", the rest "a lot of description of very general best practices". On the two issues, with either document, the agent took 6 to 8 minutes end to end against 15 and 20 without, at \$2.44–\$4.20 against \$6.06 and \$4.85 (Tab. 2).
- **Cost (Tab. 1, §1).** The six runs spent \$2,013.98 and 69.2 h of wall clock; a rollout costs \$0.84 on average.
- **Rejected objectives (App. D, Tabs. 3–4).** In a preliminary sweep on tracy (an AI tracing library), rescored on a shared six-task pool, the document the `ideal` score (completeness and operational tone) selected was "the worst of the set on every metric that looked at behaviour", and pairing shipped the seed.

## Limits the authors state

- The 100-task floor "is what makes three splits possible, not evidence that it suffices": at 20 to 26 held-out tasks a pass-rate comparison cannot separate a few-point gain from the agent's variance (§6).
- A small or heavily refactored repository runs out of candidates (§3.1); tracy and http4k (an HTTP toolkit) never reached the floor (§6, App. C). The yields "are what these repositories yielded, not a rate a new one should expect" (App. C).
- When the empty SKILL already solved SkillOpt's hand-collected http4k training tasks, every rewrite was rejected (App. C).
- "This is one maintainer of one repository, and what we collected is an opinion of what the two documents contain" (§4.3).
- App. D is a preliminary Tracy run, "not the paired kotest, ktor, or koog results" (App. D).
- On gskill, "we make no claim about their reported rates" (§5).
- A synthesized SKILL "can read as authoritative while stating claims that are stale or over-general"; the paired score "does not certify that the document is accurate" (Responsible use statement).

## Open problems and building blocks

- **Open:** "Whether this holds more broadly is the open question. Answering it needs cheaper rollouts, or an evaluation that does not rest on a pass rate, and a developer study with many reviewers where ours has one" (§7). The bottleneck they name: "we attribute the difficulty to the measurement rather than to the optimizers" (§1).
- **Released:** Nothing stated. The appendices print the optimized SKILLs (App. E–H) and the issue patches (App. J).
- **To reuse it:** a repository whose touched files survive at the frozen base, whose suite passes there, and whose reverted changes make passing tests fail, confined to that reversion (App. C); at least 100 graded tasks (§6); a Docker sandbox and an LLM for reverting and issue rewriting (§3.1); the agent and spend above (§4.1, Tab. 1).

## On this site

- **Discussed in:** [Benchmarks with checkable ground truth](#/challenges/checkable_benchmark_ground_truth) · [Comparing LLM methods under noise](#/challenges/method_comparison_under_noise) · [Can a memory across problems be checked before it is reused?](#/challenges/verified_memory) · [Weak checkers get exploited](#/challenges/weak_checker_exploitation)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/hacking-general">hacking-general</a><a class="tag sub" href="#/tags/harness-general">harness-general</a><a class="tag sub" href="#/tags/harness-promptopt">harness-promptopt</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/promptopt-context">promptopt-context</a><a class="tag sub" href="#/tags/promptopt-general">promptopt-general</a></span>
