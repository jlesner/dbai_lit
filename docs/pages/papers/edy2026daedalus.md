# DAEDALUS: Bootstrapping Agent Memory from Self-Generated Tasks

**DAEDALUS** · preprint 2026

Read: [PDF](https://arxiv.org/pdf/2610.08048) · [arXiv](https://arxiv.org/abs/2610.08048)  
Code: [daedalus](https://github.com/illuin-tech/daedalus)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Builds an agent's memory with no training tasks and no oracle verifier: an Explorer proposes tasks with success conditions and tunes their difficulty, a Solver attempts them, and a heuristic written from each failure is kept only after the Solver then succeeds with it several times in a row; the kept heuristics are merged into one bank given to the agent at test time (abstract; §3).
- Whether an attempt succeeded is decided by an LLM judge reading the trajectory against the task's success conditions (§3). Evaluated on AppWorld, τ²-bench (retail) and AutomationBench against memory methods that learn from the benchmarks' training tasks, ACE among them, and against PREPING, which also generates its own tasks (§4.1, Tab. 1).
- Memory admitted by a test of the heuristic rather than by the outcome it came from, with an LLM judge as the test: the authors report the judge's precision against the official verifiers at 0.86 to 0.94 (§5.1, Tab. 4). In their ablation, heuristics from exploration alone hurt the agent and validating them in the Solver loop adds to the gain (§5.1, Tab. 3); beyond 90 generation sessions the bank keeps growing but success falls (§5.1, Fig. 6).

## In plain words

An LLM agent in a new software environment (a set of apps, a customer-service system) often has to discover on its own how the tools behave, and without memory of past attempts it repeats the same mistakes. Existing fixes, the authors say, typically rely on human-written guidelines or on memory learned from curated practice tasks with an automatic grader, both of which "require prior knowledge of the environment" (abstract). DAEDALUS needs neither: one agent invents practice tasks and tunes their difficulty, a second attempts them, and a lesson written after a failure is kept only once the second agent succeeds with it several times in a row. The kept lessons are merged into one text given to the agent on every real task.

The authors report gains over the same agent without memory of up to 15.9 points of mean success (AppWorld, GPT-5.4-mini as the agent), and call the method "competitive with methods using training tasks" (abstract; Tab. 1). They present it as removing the need for curated tasks and a grader (§6), not as a first (§4.1).

## Background and terms

**Terms to know:** [agent harness](#/glossary/agent-harness) · [LLM-as-a-judge](#/glossary/llm-as-a-judge) · [pass^k](#/glossary/passk-reliability-over-k-trials) · [BM25](#/glossary/bm25) · [dense retrieval](#/glossary/dense-retrieval) · [bootstrap resampling](#/glossary/bootstrap-resampling)

**The paper's own terms:**
- **heuristic**: a short piece of textual advice, written by an LLM after a failed attempt (§3; example in Tab. 15). The merged heuristics form the **bank**.
- **Solver loop**: the Solver attempts a task, an LLM Judge grades it, and an Extractor writes or revises a heuristic after each failure (§3, Fig. 3; Alg. 3). One task proposal with its revisions is a **session** (Alg. 2).
- **auxiliary agents**: all agents but the Solver: Surveyor, Explorer, Judge, Extractor, Consolidator (§3). The **base agent** is the agent tested with the bank; in the main experiments it shares the Solver's model (§3).
- **oracle verifier**: a verifier that scores each attempt (§1), such as the benchmarks' official verifiers (§5.1).
- **MSR**: mean success rate over five inference runs (§4.1). **κ**: a chance-corrected agreement score (§5.1, Tab. 4).
- **DAEDALUS-curated**: the same Solver loop run on the benchmark's training tasks, with the benchmark verifier in place of the Judge (§4.1; Alg. 4).

**Missing glossary terms:**
- **procedural memory**: knowledge of how to act, kept across tasks; in the methods the paper discusses, "lessons drawn from its successes and failures are stored and injected in context at test time" (§1).
- **Kendall's τ**: a rank correlation based on how many pairs of items two rankings order the same way versus oppositely; 1 means the same order (used in §5.3).

**Builds on:**
- Memory methods that learn from attempts on training tasks, also its baselines: ExpeL (Zhao et al., 2024), AutoGuide (Fu et al., 2024), ERL (Allard et al., 2026), ReasoningBank (Ouyang et al., 2026) and ACE (Zhang et al., 2026; [ACE](#/papers/zhang2025ace "Agentic Context Engineering: Evolving Contexts for Self-Improving Language Models (2026)")), an evolving playbook (§2, §4.1).
- PREPING (Choi et al., 2026), which builds a playbook from self-proposed tasks, "closest to our setting" (§2).
- Reflexion (Shinn et al., 2023; [Reflexion](#/papers/shinn2023reflexion "Reflexion: Language Agents with Verbal Reinforcement Learning (2023)")): retrying with the lesson in context (§3).
- Proposer–solver curricula (Yue et al., 2026), where tasks serve to update weights rather than memory (§2, §3).

## Problem and setting

The question: can an agent's memory be built for a new environment with no training tasks and no oracle verifier, raising success "without updating its weights" (§3)?

- **Benchmarks** (§4.1): AppWorld (code-based app automation; *normal* test split), τ²-bench (conversational customer service; *retail* only, since airline "contains ground-truth errors" and telecom would need simulated user-side tools) and AutomationBench (business workflows with software-as-a-service apps; *Operations* split only, for compute cost). Training/test tasks: 90/168, 74/40 and 30/70. DAEDALUS runs one session per training task, to match the baselines; the authors say generation never accesses test instances (§4.1; App. E).
- **Models** (§4.1; Tab. 11): GPT-5.4 for auxiliary agents and GPT-5.4-mini for Solver and base agent on AppWorld and τ²-bench; GPT-5.6 Terra and GPT-5.6 Luna in the same roles on AutomationBench. Every method uses the same pair, with baselines' auxiliary roles raised to the larger model (App. E).
- **Success**: the official verifiers at test time; the Judge against the Explorer's self-written success conditions during generation (§3). Metrics: MSR, pass^5 and inference cost per run (§4.1).
- **Baselines**: reimplemented on the authors' harness, except PREPING, run from its authors' code (App. E).

## Approach

- **Solver loop** (§3 "Failure-to-success heuristic validation"). A task is an instruction plus success conditions. The Solver attempts it from a freshly reset environment; after a failure the Extractor writes or revises a heuristic from the instruction and failed trajectory, and the Solver retries with it. "The Extractor does not see which success conditions were missed", to favour general advice. The loop stops at a streak of consecutive successes or a failure limit: *accepted* if the Solver failed at least once before the streak, *too easy* if it never failed, *too hard* at the limit. Unlike methods that validate a lesson by the outcome of the trajectory it came from or by task feasibility, this tests the heuristic itself; the streak "lowers the probability of accepting an ineffective heuristic after a success due to chance" (§3).
- **Calibration** (§3). The Explorer proposes a realistic task and completes it itself to establish feasibility; a too-easy or too-hard outcome makes it revise the task, a limited number of times. This "steers generation toward the edge of the Solver's capability, where failures are recoverable".
- **Efficiency** (§3). A Surveyor sets a target distribution of tasks over the environment's areas once; revision histories become task-design guidelines for later sessions.
- **Consolidation** (§3). A Consolidator merges accepted heuristics in one LLM call; the frozen bank is injected once at the start of each test task.
- **Settings** (§4.1; Tab. 12): up to 5 revisions, 8 failures, 3 consecutive successes, set "from a few preliminary generation sessions on AppWorld" and reused elsewhere without tuning.

## Results

- **Main** (§4.2; Tab. 1). Over no memory, MSR gains of 15.9, 10.0 and 4.3 points on AppWorld, τ²-bench and AutomationBench, and pass^5 up 1.7× to 2.2×; better than PREPING on both metrics, at no extra inference cost over no memory on AppWorld and τ²-bench. Against training-task methods it is within error margins of the best in most MSR and pass^5 columns, behind only ACE on AppWorld pass^5 and ExpeL on AutomationBench MSR, and never falls below no memory, unlike ACE, ReasoningBank and AutoGuide.
- **Self-made against curated tasks** (§4.2). DAEDALUS trails DAEDALUS-curated by 0.6, 2.5 and 4.0 MSR points, with pass^5 gaps within error margins.
- **Transfer** (§4.2; Tab. 2, Fig. 1). On AppWorld, banks built with GPT, Qwen and DeepSeek model pairs each helped each of three base agents: "all nine gains are positive".
- **Ablation** (§5.1; Tab. 3). Heuristics from exploration alone lower MSR to 35.7 against 44.3 with no memory; drawing heuristics from Solver attempts adds 15.8 points, and the Solver loop's validation another 4.5. The guidelines and the survey improve generation efficiency, cutting generation cost (finding (ii)).
- **Judge** (§5.1; Tab. 4). On official test tasks, with the Explorer restating the official requirements as success conditions, the Judge against official verifiers: precision 0.86 to 0.94, κ 0.73 to 0.81, recall below precision on every benchmark, which the authors call "the safer direction for accepting heuristics".
- **Budget** (§5.1; Fig. 6). On one AppWorld generation run, five sessions give more than half of the improvement at the 90-session peak; beyond 90 sessions MSR falls as the bank grows, and hierarchical consolidation does not recover it (App. B).
- **Smaller auxiliary model** (§5.1; Tab. 5): still beats no memory, with a smaller gain.
- **Using the bank** (§5.2; Tab. 6, Fig. 7). At this scale, whole-bank injection at task start was the best and cheapest option tested; five heuristics per turn by BM25, Qwen3-Embedding-4B (dense) or random selection improved over no memory but did not differ significantly.
- **Replay** (App. C). On accepted AppWorld tasks, graded by the Judge, the Solver does better with its heuristic than without; paired-bootstrap 95% intervals exclude zero.
- **Generated tasks as a test set** (§5.3; Fig. 8). Nine models without memory rank alike on the generated AppWorld tasks and the official test split: Kendall's τ = 0.89, 34 of 36 pairs in the same order; absolute rates differ. The authors say this suggests the tasks "can serve as a proxy for ranking models when no curated test set is available".

## Limits the authors state

- The bank is frozen; updating it at test time "is left to future work", and "our preliminary attempts at such iterative schemes did not yield consistent gains" (App. B).
- It assumes the Explorer "can set up and complete tasks alone in a resettable environment"; dual-control settings "are not yet supported" (App. B).
- The Judge's agreement with official verifiers is "substantial but imperfect" (App. B).
- Performance declined beyond 90 sessions on AppWorld (§6); with a larger bank, consolidation "misstates the scope of some heuristics" (§5.1).
- It spends more Solver attempts than any baseline; "Most of this gap is the cost of not having training tasks" (App. E).
- On the 90-session AppWorld run, an early filter discarded seven accepted tasks as near-duplicates, replaced by sessions from the scaling run; it "was not part of the general method" (App. E).

## Open problems and building blocks

- **Open:** "how the composition and coverage of the bank vary across environments, how heuristics should be consolidated as the bank grows, and which retrieval mechanisms can best exploit large memories at inference time" (§6); "developing more reliable multi-judge validation schemes" (§6); for code-based tasks, "an executable verifier agent could replace or complement the judge" (App. B).
- **Released:** code, prompts, configurations, generated tasks, heuristic banks and agent trajectories (abstract; §1; Reproducibility statement).
- **To reuse it:** a resettable environment the Explorer can act in alone (App. B); by default a larger auxiliary model, though it "remains useful when a larger model is not available" (§5.1). AppWorld generation cost 109.7 USD (Tab. 3) and 1,225 Solver rollouts (Tab. 14).

## On this site

- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/harness-general">harness-general</a><a class="tag sub" href="#/tags/harness-promptopt">harness-promptopt</a><a class="tag sub" href="#/tags/judge-general">judge-general</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/promptopt-context">promptopt-context</a><a class="tag sub" href="#/tags/promptopt-feedback">promptopt-feedback</a><a class="tag sub" href="#/tags/promptopt-general">promptopt-general</a></span>
