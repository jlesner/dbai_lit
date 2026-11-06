# ContinualSkillBench: Can LLM Agents Truly Evolve Their Capabilities?

**ContinualSkillBench** · preprint 2026

Read: [PDF](https://arxiv.org/pdf/2608.03874) · [arXiv](https://arxiv.org/abs/2608.03874)  
Code: [continual-skill-bench](https://github.com/gtynnn060110-hash/continual-skill-bench-final)

<p class="notice">A summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- A benchmark of "in-context continual skill learning": five domains (Law, Finance, Healthcare, Mathematics, Office), each a stream of 100 tasks taken from existing benchmarks and ordered by difficulty and by LLM-judged skill-transfer dependencies, in which the agent may create or revise skills after each task's evaluator feedback (abstract; §3, §3.2, §3.5).
- Compares Independent runs (history and skills reset before every task) with Sequential runs on Harbor with Codex CLI and Claude Code harnesses (three turns per task: the task with the skill repository, execution, reflection with Create Skill and Modify Skill meta-skills) for GPT-4o, GPT-5.3-Codex and Claude Opus 4.7, scored by exact match, F1, numeric tolerance, programmatic tests and an LLM rubric judge; a pure-ICL arm keeps the same context and feedback but cannot edit the skills (§3.4–3.5, §4.1, §4.3).
- A control that separates a skill library's effect from retained context and feedback (our reading): across two models and three domains the authors report that the pure-ICL arm reaches "nearly the same mean performance" as maintaining a skill library (abstract; §4.3), with skills ahead on exact-match tasks, level with or ahead of ICL on programmatic ones and behind it on rubric-judged ones in most comparisons (§4.3), and that GPT-4o builds larger skill pools it reuses less (§4.4, Fig. 3). Part of the score is an LLM rubric judge whose model the paper doesn't name, and no repeated runs are reported (§3.4, §4; our reading).

## In plain words

Agent frameworks such as Claude Code and Codex let a model load "skills", written instructions and workflows. Writing a full skill library by hand is "fundamentally difficult and expensive", so the authors ask whether an agent can write and improve its own skills from feedback, and whether that helps more than remembering earlier tasks and feedback (§1). They build ContinualSkillBench, five domains (Law, Finance, Healthcare, Mathematics, Office) with 100 tasks each, ordered by difficulty and by opportunities for skill transfer (abstract; §3). They present it as "a dynamic evaluation framework", not a new method (abstract).

Running the tasks in order with feedback and skill editing raises the score (over tasks where both settings gave a valid output) over running each task alone in 14 of 15 model–domain pairs, with gains that vary by model and domain (§4.2). But in a smaller comparison (two models, three domains), an agent that keeps the same earlier context and feedback without editing skills scores about the same on average as one that maintains skills; skills help selectively, on tasks "requiring reusable procedures or precise outputs" (abstract; §4.3). The weaker model, GPT-4o, writes more skills than GPT-5.3-Codex and reuses them less (abstract; §4.4).

## Background and terms

**Terms to know:** [agent skill](#/glossary/agent-skill) · [agent harness](#/glossary/agent-harness) · [catastrophic forgetting](#/glossary/catastrophic-forgetting) · [LLM-as-a-judge](#/glossary/llm-as-a-judge) · [rubric](#/glossary/rubric) · [exact match](#/glossary/exact-match) · [F1 score](#/glossary/f1-score) · [curriculum learning](#/glossary/curriculum-learning) (here a "curriculum constraint" orders a test stream; nothing is trained, App. B.2) · [continual learning](#/glossary/continual-learning) (the paper's in-context continual learning grows a skill library "without fine-tuning their parameters", against fine-tuning that "typically leads to catastrophic forgetting", §2)

**The paper's own terms:**
- D, Turn 3).
- **Create Skill, Modify Skill**: meta-skills (skills about writing skills) the agent uses to add or revise skills (§3.5).
- **core skills**, in two senses: each domain's 100 subtasks are "anchored to three core skills" (§1), and Fig. 2 shows three "macro capability tracks" per domain; for the validation, a task's core skills are the "main capabilities exercised by the task", proposed per task by Qwen3-32B (App. C.1).
- **Independent (Ind.)**: history and skill repository reset before every task. **Sequential (Seq.)**: the 100 subtasks in order, retaining and updating the repository (§4.1) and keeping earlier context and feedback (§4.3).
- **pure ICL** (in-context learning): the same sequence, context and evaluator feedback, but the agent "cannot create or modify the skill repository" (§4.3).
- **raw and normalized reward**: the average over all 100 tasks, and over the tasks where every compared setting produced a valid output; Δ is Sequential minus Independent (§4.1).

**Builds on:**
- SkillsBench (Li et al., 2026; [SkillsBench](#/papers/li2026skillsbench "SkillsBench: Benchmarking How Well Agent Skills Work Across Diverse Tasks (2026)")): evidence that expert-written skills help (§1), and a paired skill/no-skill benchmark that "does not study how a skill library evolves" (§2).
- Benchmarks it says it complements (§2): SkillLearnBench (Zhong et al., 2026; [SkillLearnBench](#/papers/zhong2026skilllearnbench "SkillLearnBench: Benchmarking Continual Learning Methods for Agent Skill Generation on Real-World Tasks (2026)")), skills generated from seed instances; CL-Bench (Dou et al., 2026), stateful task sequences; SkillCraft (Chen et al., 2026), reusable tool compositions.
- Harbor (Harbor Framework Team, 2026) with Terminal-Bench (Merrill et al., 2026; command-line agent tasks), the container-based evaluation framework it extends with sequential harnesses on Codex CLI and Claude Code (§3.5).
- Its source benchmarks (App. A, Tab. 3), e.g. GAIA (assistant tasks), ClawBench (multi-step tool workflows), LegalBench (legal reasoning) and OlympiadBench (competition mathematics) (§3.1).

## Problem and setting

- **Question:** can experience from earlier tasks improve later ones, can agents consolidate it into reusable skills "rather than merely adapting to recent feedback or output conventions", and does an evolving skill repository help "beyond retaining prior context and feedback" (§1)?
- **Tasks:** 500 subtasks (tasks within a stream) from a pool of about 30,000 (Fig. 1), ordered "from relatively simple to more challenging" and by potential skill-transfer dependencies (§3.2), on the "working assumption" that "complex tasks within the same domain often rely on a shared set of foundational skills" (§3.2).
- **Scoring (§3.4):** exact match for short deterministic answers, token-level F1 for longer ones, numeric comparison under a "task-specific tolerance" (typically at most 10⁻⁴), programmatic tests of files, outputs or environment states (official evaluators "where available"), and an LLM judge with rubric criteria for open-ended answers.
- **Models (§4.1):** GPT-4o, GPT-5.3-Codex and Claude Opus 4.7 on the Codex CLI and Claude Code harnesses. The pure-ICL arm covers GPT-5.3-Codex and Opus 4.7 on Law, Finance and Healthcare only (§4.3).

## Approach

- **Building the streams (§3.2; App. B).** An LLM labels each raw task's skills, filters by relevance and rates difficulty. GPT-5.4 judges sampled task pairs in both directions (YES, PARTIAL or NO) on whether one task "could provide skills useful for" the other (App. B.1); YES judgments become edges of a directed graph. Tasks are grouped by difficulty level (for Mathematics, predefined skill layers), edges back to easier levels are dropped, and within a level a greedy topological sort (Kahn's algorithm: repeatedly place a task with no unplaced prerequisites) picks, among the ready tasks, the one with the most outgoing edges, "expected to provide useful skills for more downstream tasks" (App. B.2).
- **Checking that the order offers reuse (§3.3; App. C).** Qwen3-32B annotates each task's core skills without seeing its position; skills match when their embeddings' [cosine similarity](#/glossary/cosine-similarity) is at least 0.85. The curated order is compared with 10,000 random orders by a one-sided (asking only whether the curated order is better) [permutation test](#/glossary/permutation-test) with Holm correction for [multiple testing](#/glossary/multiple-testing) (App. C.5), and again with Gemma-3-12B judging whether two skills are functionally equivalent (App. C.7).
- **The agent loop (§3.5; App. D).** Each subtask takes three turns: the task with the current repository (after the first, plus a memory file of "previous task context and judge feedback"); execution; and reflection on the evaluator's feedback, where the agent may create or revise skills, told not to "memorize the solution or hardcode fixes for this specific task" (App. D). Updates apply from the next subtask.
- **Extra arms.** A [retrieval-augmented generation (RAG)](#/glossary/retrieval-augmented-generation-rag) arm retrieves earlier trajectory snippets instead of keeping skills, on Opus 4.7 Healthcare (App. F). GPT-4.1-mini scores generated skills as format × content, so an unloadable skill scores 0 (App. G).

## Results

All are the authors' claims.

- **Sequential against Independent (§4.2, Tab. 1).** Sequential raises normalized reward in 14 of 15 model–domain pairs and raw reward in 13 of 15. GPT-5.3-Codex has the largest average normalized gain, then GPT-4o, then Opus 4.7, although Opus 4.7 has the strongest average Independent baseline. Healthcare gains most on average; the only drop in normalized reward is Opus 4.7 on Mathematics. Gains also vary with the evaluator type.
- **Skills against pure ICL (§4.3, Tab. 2).** Macro-averaged (each pair weighted equally) over the six model–domain pairs, normalized rewards are 0.469 (Independent), 0.585 (ICL) and 0.582 (Sequential): skill maintenance "provides no consistent aggregate advantage over retaining context and feedback alone". Sequential beats ICL on exact match in five of six comparisons (one tie) and matches or beats it on programmatic tasks in five of six; ICL scores higher on rubric-judged tasks in five of six. The authors suggest that "much of the Sequential–Independent gain comes from retained context and feedback", and that skills "can stabilize reusable procedures under rigid output or execution requirements, but may over-specialize to earlier solution patterns on open-ended tasks". The RAG arm shows "a similar pattern to the ICL setting", better on rubric-judged subtasks and worse on exact match (App. F, Tab. 10).
- **Skill libraries (§4.4, Fig. 3; App. G, Tab. 11).** In all five domains GPT-4o ends with a larger skill pool than GPT-5.3-Codex and calls its skills less often (Fig. 3). Counting only agent-written skills, GPT-4o writes 384 with an average quality score of 5.68, GPT-5.3-Codex 205 at 7.94 (Tab. 11); the authors read this as GPT-4o tending to keep "fragmented, task-specific skills".
- **The order offers reuse (§3.3; App. C).** Under the Gemma judge, a five-task window covers 25.7% of a task's core skills in the curated order against 20.4% for random orders (macro-averaged), significant in all five domains after Holm correction (App. C.7, Tab. 9); with embedding matching the curated order is ahead in all 15 domain–window comparisons (App. C.5, Fig. 4).
- **The dependency judge (App. B.3, Tab. 5).** Adjudicated human labels match GPT-5.4's in 89.0% of the 400 audited judgments (Finance and Law).

## Limits the authors state

- The tasks in each domain "are still curated from a fixed set of sources"; rare edge cases, shifted data distributions and instructions that differ substantially from the benchmark format "are not fully covered by our current evaluation" (§ "Limitations").
- "due to the high time and API cost of sequential agent evaluation, we evaluate only a limited set of representative models and harnesses", with no other Claude, GPT or Gemini variants and no other agent environments such as Cursor or Google CLI; "future work should broaden both model and infrastructure coverage" (§ "Limitations").
- Normalized reward's common subset "may exclude setting-specific failures", so it is read "jointly with raw reward", and it "may differ slightly across experiments involving different sets of settings" (§4.1).
- Sequential against Independent "does not isolate the contribution of the explicit skill repository" (§4.3).
- In Mathematics the curated order's coverage gains "do not remain significant after correction" (App. C.5). The continuity analysis "establishes structural opportunities for skill reuse"; whether agents exploit them "is evaluated separately through the sequential experiments" (App. C.5). Lexical (embedding) similarity "may not always reflect functional equivalence" (App. C.7).
- A Qwen3-32B pilot on Finance was stopped after 32 subtasks and is "not included as a directly comparable benchmark result"; its performance "was frequently limited by unreliable base-agent execution", so the main comparison is restricted "to models that can reliably complete the underlying agentic tasks" (App. I).

## Open problems and building blocks

- **Open:** the bottleneck the authors name: current agents "still struggle to consolidate experience into transferable skills" (§1; §5).
- **Released:** a source-code link in the title footnote (title page); no other release statement.
- **To reuse it:** the Harbor infrastructure with the authors' sequential harnesses on Codex CLI or Claude Code (§3.5); a model that can "reliably complete the underlying agentic tasks" (App. I); and, in the authors' words, "high time and API cost" (§ "Limitations").

## On this site

- **Tags:** <span class="tags"><a class="tag" href="#/tags/agent">agent</a><a class="tag" href="#/tags/benchmark">benchmark</a><a class="tag" href="#/tags/harness">harness</a><a class="tag" href="#/tags/llm">llm</a><a class="tag" href="#/tags/math">math</a><a class="tag" href="#/tags/nl">nl</a><a class="tag sub" href="#/tags/promptopt-context">promptopt-context</a><a class="tag sub" href="#/tags/promptopt-feedback">promptopt-feedback</a></span>
