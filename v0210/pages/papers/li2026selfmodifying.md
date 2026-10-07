# Self-Modifying Lean Proof Agents with Verifier-Grounded Benchmark Coevolution

**Self-Modifying Lean Proof Agents** · preprint 2026

Read: [PDF](https://arxiv.org/pdf/2607.17352) · [arXiv](https://arxiv.org/abs/2607.17352)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- A fixed, trusted runtime wraps a mutable workspace (proof workflow, prompts, tools) that the agent rewrites between generations, around one fixed LLM backend (abstract; App. A).
- The benchmark coevolves by a mastery-throttled curriculum that draws harder tasks from a candidate pool stratified by difficulty (§3.3); every success must be a Lean-verified proof (abstract).
- Code- and prompt-level self-improvement (no weight training) with a sound check, for Proposer–solver self-play; its curriculum selects tasks rather than writing them.

## In plain words

Strong agents that write machine-checked proofs in the Lean proof checker use hand-designed workflows: how to split a theorem into lemmas, use error messages and repair failed proofs. The authors ask whether an agent can evolve that workflow itself (§1). An agent rewrites its own prompts, tools and workflow code over 15 generations, while a fixed, protected part of the system decides what counts as solved: only proofs Lean accepts. The set of practice problems also changes: problems every agent of a generation solved are retired and replaced, by harder ones only once that generation's best agent has mastered the current level, and a rescaling step keeps scores comparable across the harder sets. The authors contrast this with most self-evolving agents, which use a fixed benchmark (abstract). In a single run with one fixed language model, the best evaluated agent solves 45.1% of a held-out set of competition-style problems, against 12.7% for the starting agent and 32.0% for the best agent evolved on a fixed benchmark (abstract; §4).

## Background and terms

**Terms to know:** [proof assistant](#/glossary/proof-assistant) · [tactic](#/glossary/tactic) · [curriculum learning](#/glossary/curriculum-learning)

**The paper's own terms:**
- **Lean, Mathlib**: Lean 4 is the proof assistant used; Mathlib is its community library of formalized mathematics; the paper gives the version as `v4.30.0` (App. A).
- **trusted runtime**: the fixed code that handles "Lean verification, evaluation, benchmark management, and proof-context validation"; it stays outside the evolutionary search (§3.1).
- **mutable workspace**: the proof workflow, prompts and tools, plus "the meta-level logic that adapts it"; all that evolves (§3.1).
- **seed agent**: the starting agent, kept minimal on purpose: one proof attempt checked once, with no repair loop, search or decomposition (§3.1).
- **child, archive, champion**: children are rewritten copies of agents in a shared archive; each generation's highest-scoring agent, the champion, seeds the next generation and drives the benchmark update (Fig. 1).
- **proof context**: a machine-readable record of an attempt's mathematical structure (claims, lemmas, subgoals, dependencies), separate from the log of LLM and tool calls (§3.2).
- **node-level verification**: checking one item of the proof context, such as a helper lemma, in Lean on its own (§3.2, §4.5).
- **raw score, difficulty coefficient**: raw score is the solve rate on that generation's benchmark; the coefficient measures how much harder the current benchmark is than the first; their product is the **difficulty-normalized score** (§3.3).
- **`have` statement, binder**: a `have` is an intermediate claim inside a Lean proof; lifted out of its proof, it lacks the surrounding binders (declared variables), local hypotheses and type context (§4.5).

**Missing glossary terms:**
- **self-evolving agent**: an agent that improves by rewriting its own code or prompts, or by searching over agent designs, instead of keeping a fixed hand-designed workflow (§2).
- **coevolution**: evolving solvers together with their environments or task curricula, so that the tasks change as the solvers improve (§2).

**Builds on:**
- The Darwin Gödel Machine (DGM), an agent that rewrites its own code and tests the variants on coding benchmarks (the parent-selection weight is "DGM-style", §3.4), and Hyperagents, which put a task agent and a meta agent that edits itself and the task agent into one program (§1). Neither is on this site.
- LEAP and Goedel-Architect, hand-designed workflows around a fixed prover built on plans of intermediate lemmas, the line the paper follows (§1, §2). Not on this site.
- Coevolution and automatic curricula (POET, MCC, PAIRED), and the Red Queen Gödel Machine, which coevolves the evaluator; here the evaluator stays fixed and task difficulty coevolves (§2). Not on this site.

## Problem and setting

- **Question:** "if a Lean proof agent is not given a carefully hand-designed workflow, what proof workflow can it evolve for itself?" (§1). Lean is the fixed judge (§5).
- **Model:** one LLM backend, DeepSeek `deepseek-v4-pro` served over an API, drives both proving and self-modification, with greedy decoding (App. A); only the workspace evolves (§3.1).
- **What counts as solved:** a proof that re-verifies, with the task statement, under a trusted Lean snapshot. Lean's placeholders for skipped steps (`sorry`, `admit`) and top-level Lean commands in the returned proof are rejected (§3.2).
- **Tasks:** a pool of 365 tasks in three levels: L1, author-written warm-up lemmas that one tactic proves; L2, problems from the valid split of miniF2F (a benchmark of formalized math-competition problems); L3, problems from PutnamBench (formalized Putnam competition problems). The active benchmark holds 76 tasks, starting at 27 L1, 46 L2 and 3 L3, mixed so the seed solves about 0.37 of it (App. A).
- **Held-out test:** the 244-problem miniF2F test split, disjoint from the curriculum and never used for selection (§4, App. A); the seed solves almost none of its competition-level (AMC/AIME/IMO) problems (§1).
- **Budget:** 15 generations of up to three accepted children each; a 1,200 s cap per proof workflow (App. A).

## Approach

- **Fixed runtime, mutable workspace (§3.1).** A rewritten agent must pass smoke tests (its code runs and keeps the interface) to be evaluated; Lean alone decides what is solved, and benchmark updates use only Lean-verified records.
- **Proof-context contract (§3.2).** Each attempt returns a success flag, a proof body and a proof context. The context may take any shape; the validator checks a few grounding rules, among them a root item, at least one mathematical item, edges to known items, and Lean evidence behind any item marked solved. The principle: "representation is flexible, but groundedness is mandatory" (§3.2 Part A).
- **Spoofing resistance (§3.2 Part B).** The runtime ignores self-reports, re-checks proofs itself, guards its files, and runs agent code in isolated workers.
- **Mastery-throttled curriculum (§3.3; Alg. 1, App. B).** The benchmark changes only if the champion solves more than 30% of it. Then up to six tasks solved by every agent of the generation are retired, each replaced from the next level if the champion solves at least 70% of the task's level, else from the same level, preferring areas where the archive fails most. New tasks count as unsolved and the level's rate is recomputed after each swap, which the authors say prevents abrupt hardening (thresholds in App. A).
- **Single-anchor recalibration (§3.3).** The champion is re-run on the new benchmark and the coefficient is multiplied by its old raw score over its new one (floored at 0.1, App. A), so the champion's normalized score is unchanged and all agents share one scale.
- **Parent selection (§3.4).** Parents are drawn in proportion to normalized score divided by one plus their number of children; a child can parent siblings as soon as it is scored.
- **Baseline:** the same evolution on a benchmark that never retires tasks (App. A).

## Results

All from one coevolving run and one fixed-benchmark run (App. A).

- **Held-out solve rate (abstract; §4.1–4.2; Tab. 1).** The authors report the seed at 12.7% and the best of the agents evaluated across the coevolving run (c144, generation 15) at 45.1%, against 32.0% and 26.6% for the two highest-scoring fixed-benchmark agents.
- **Not monotone (§4.1, Tab. 1).** The held-out rate goes up and down across generations, e.g. 11.9% for the generation-9 agent; the authors attribute this to selection optimizing active-benchmark score, not held-out performance.
- **Benchmark hardening (§4.1, Tab. 2).** The difficulty coefficient rises from 1.00 to 3.17, reached at generation 13 and flat after it.
- **Why the fixed run lags (§4.2).** Once agents solve a stable subset of the fixed tasks, the authors report, later mutations mostly tweak repair and tools.
- **What evolved (§4.3).** "The high-scoring workflow is repair-centered, not decomposition-centered": generate a whole proof, run Lean, use the error message and lemma-name checks, retry with bounded feedback. Mutation traces often reason about splitting proofs into lemmas; the gap is "between reasoning about these workflows and shipping them". Shipped versions crash, stay shallow or fail at putting lemmas back together: "assembly is exactly the hard part". Very large repair loops are selected against too.
- **Tools (§4.4).** "Most evolved tools target hallucinated Lean names" (name checks, library search, caches); they make repair safer rather than adding strategies.
- **Proof context (§4.5).** "Proof contexts become inspectable but rarely grow into deep verified proof graphs." In early and middle generations most are `have` statements extracted after the fact; the c44/c47 branch is "the first meaningful node-level verification attempt", with self-contained sub-lemmas certified by Lean (§4.5, Tab. 3).

## Limits the authors state

- "We report a single-run study; quantitative comparisons therefore come without variance estimates and should be interpreted accordingly." (App. A)
- Even at temperature 0, the backend shows "non-negligible output instability on boundary problems", so small differences should be read cautiously (App. A).
- 45.1% "remains well below the strongest hand-designed proof agents", with Goedel-Architect at 99.2% on miniF2F-test "with a different backend"; their lineage audit "suggests a main reason for the gap": the winning workflow is still mostly repair-centered (§5).
- Proof-context quality is logged but not rewarded; the "sparse pass/fail reward" gives no credit to proof structure, so agents that chase solve rate often skip it (§4.5, App. D).
- The benchmark update follows fixed rules over a fixed candidate pool, "a bounded first step" towards agents that propose their own problems (§1).
- The lineage table shows representative rows for early generations, and for generations 10–15 the children "available at writing time" (App. D).
- The result is "evidence for a direction rather than a finished proof assistant"; in 15 generations the agent "has not yet evolved a deep, durable proof-context graph" (§5).

## Open problems and building blocks

- **Open:** "Longer runs, larger populations, or rewards that directly value verified decomposition may make decomposition-based workflows a more important evolutionary route." (§5). The bottleneck they name is assembling verified helper lemmas back into the final theorem (§4.3, §5).
- **Released:** Nothing stated.
- **To reuse it:** an LLM API (`deepseek-v4-pro`, chosen to keep long runs affordable), Lean 4 with Mathlib, and one multi-core CPU host; wall-clock time, dominated by Lean checking and long generation calls, grows roughly linearly with generations (App. A).
- **Beyond its domain:** the authors see a path to other domains where Lean-verified reasoning is essential, "such as quantum computing" (§5).

## On this site

- **Discussed in:** [Self-improvement that compounds](#/challenges/compounding_self_improvement)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/harness-general">harness-general</a><a class="tag sub" href="#/tags/harness-promptopt">harness-promptopt</a><a class="tag sub" href="#/tags/itp-general">itp-general</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/promptopt-context">promptopt-context</a><a class="tag sub" href="#/tags/promptopt-evolve">promptopt-evolve</a><a class="tag sub" href="#/tags/promptopt-general">promptopt-general</a></span>
