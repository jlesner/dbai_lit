# SkillGLoW: Procedural-Family Skill Consolidation for Self-Improving Agents on Long-Horizon Task Streams

**SkillGLoW (Global–Local Weave)** · preprint 2026

Read: [PDF](https://arxiv.org/pdf/2609.02217) · [arXiv](https://arxiv.org/abs/2609.02217)

<p class="notice">A summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Organizes the skills a self-improving agent writes for itself by procedural family: the local skill each task writes from its own runs is clustered with others by how the task is solved, each cluster is compressed into one de-instantiated prior, and at solving time a recalled prior is combined with a local skill regenerated from the current task's own feedback (abstract; §3.1–3.5).
- Skill cards (instruction, short operation signature, trajectory, verifier score, local skill) are embedded in several views and grouped by consensus clustering with an automatic number of clusters; each round, three routes (fresh compression, append-only repair, best version so far) each give a candidate revision with one prior per family, and the best-scoring revision is committed as a whole only if its measured value with the prior alone, on the task stream, reaches the larger of the standing library's and no skill's value (floored at the previous round's best measurement), less a small tolerance (§3.2–3.4, Eq. 5; App. B; App. D.3). One frozen model (DeepSeek-V4-Pro, MiniMax-M3 or GPT-5.4-mini) solves, extracts and compresses, on Terminal-Bench-Pro, SWE-bench Verified, ALFWorld and LiveMathematicianBench, against no skill, SkillOpt ([SkillOpt](#/papers/yang2026skillopt "SkillOpt: Executive Strategy for Self-Evolving Agent Skills (2026)")) and an AWM-style workflow pool (§4.1–4.3).
- The gate is measured execution on the training stream itself, not a sound check, and each main-table cell is one run read at its peak across rounds (App. D.2–D.3; §4.1).

## In plain words

Agents can improve by writing skills (short how-to texts) from their own runs. The authors say the two usual ways of storing skills fail on long-horizon work where each task needs a different solution: one shared document turns generic, and a per-task pool grows, its entries tied to the task that wrote them (abstract; §1). They argue the right unit is a family of tasks solved the same way, and build SkillGLoW (Global–Local Weave; GLoW) around it: per-task skills are grouped by solving method, each group condensed into one general guide, and new guides are kept only when real runs show they do no worse (abstract; §3). They present this as finding "the missing unit of reuse" (§1), not as a first. On four agent benchmarks with three models, the guides alone gain 17.2 points of all-or-nothing success on average over no skill, positive in all 12 runs, read at their best round on the task streams they were built from (abstract; §4.2; App. H). On unseen tasks of one benchmark, the unchanged library raises success from 73.9% to 83.9% (abstract; Tab. 4).

## Background and terms

**Terms to know:** [agent skill](#/glossary/agent-skill) · [procedural memory](#/glossary/procedural-memory) · [agent harness](#/glossary/agent-harness) · [agglomerative clustering](#/glossary/agglomerative-clustering) · [cosine similarity](#/glossary/cosine-similarity) · [Wilcoxon signed-rank test](#/glossary/wilcoxon-signed-rank-test) · [resolve rate](#/glossary/resolve-rate) · [consensus clustering](#/glossary/consensus-clustering) (nine clusterings: three linkage rules × three cluster counts, §3.3; App. B) · [silhouette score](#/glossary/silhouette-score) (used undefined, §3.3) · [knee point (Kneedle)](#/glossary/knee-point-kneedle) (picks the cluster count, §3.3; App. B)

**The paper's own terms:**
- **skill**: "a natural-language procedure inserted into the agent's context" (§3.1).
- **local skill**: written for one task from the differences between its successive runs and their verifier scores; it consults no library and is "not written into the long-term library" (§3.1–3.2).
- **skill card**: one task's record: instruction, a short "abstract signature naming what the solution did", trajectory, verifier score, local skill (§3.2).
- **procedural family**: tasks grouped by "how it is solved" rather than "what the task is about" (§3.3).
- **global prior**: one compressed skill per family, keeping only "applicability conditions, the core solving procedure, and common failure modes", with instance-specific bindings filtered out ("de-instantiated", §3.3); a base prior is always injected too (§3.1).
- **Recall**: before a task, the prior most similar to the instruction is injected if it passes a fixed similarity threshold, else the base prior alone (§3.5).
- **sub-round, round**: a sub-round is "one real deployment over the whole task stream"; runs have 3 rounds of 3 sub-rounds (App. I).
- **hard, soft**: the benchmark's all-or-nothing flag; partial credit, the benchmark's own or, for ALFWorld (text-based household tasks), the authors' (§4.1; App. A).
- **No-Skill, Local-only, Global-only, Global+Local, Base-only**: the skill context holds nothing; only the task's regenerated skill; only the recalled prior; both; one document compressed from the whole library (§4.1).

**Builds on:**
- SkillOpt (Yang et al. 2026a, [SkillOpt](#/papers/yang2026skillopt "SkillOpt: Executive Strategy for Self-Evolving Agent Skills (2026)")), which trains one skill document for a frozen agent: the "published single-document optimizer" compared (abstract; §4.2; App. C.1).
- Agent Workflow Memory (AWM, Wang et al. 2025b), which induces reusable workflows from past runs: ported as the flat-pool-with-retrieval arm (§4.3; App. C.2).
- Trace2Skill (Ni et al. 2026), which distils many trajectories into one skill, and per-task libraries (Lin et al. 2026; Yang et al. 2026b), the two "organizational extremes" (§4.3).
- SkillsBench (Li et al. 2026a, [SkillsBench](#/papers/li2026skillsbench "SkillsBench: Benchmarking How Well Agent Skills Work Across Diverse Tasks (2026)"); a benchmark of agent skills) and Kim et al. (2026, [Memory Transfer Learning (MTL](#/papers/kim2026memorytransfer "Memory Transfer Learning: How Memories are Transferred Across Domains in Coding Agents (2026)"); memory transfer between coding benchmarks), the motivating evidence that skills a model writes from the task description alone can fall below no skill and that little beyond meta-level experience (general lessons rather than task-specific steps) transfers across long-horizon tasks (§1).

## Problem and setting

- **Question:** "in what form should an agent organize and maintain these skills?" (§1).
- **Agent:** one frozen model per run (DeepSeek-V4-Pro, MiniMax-M3 or GPT-5.4-mini, hosted LLMs) solves, extracts and compresses (§4.1). The skill context is "our only handle on the frozen agent's behavior", and a verifier score in [0, 1] "is the only trustworthy measure of effect" (§3.1).
- **Benchmarks** (§4.1; App. H, Tab. A17): Terminal-Bench-Pro (terminal tasks checked by tests; 32 hard tasks), SWE-bench Verified (fixing real repository issues through an agentic harness; 20 instances), ALFWorld (text-based household tasks; 42) and LiveMathematicianBench (research-level math multiple choice; 53).
- **Runs:** 12 (3 models × 4 benchmarks), one trial per task; "Every main-table cell is a single run" at the provider's default temperature, and seeds fix splits and task order, not generation (§4.1; App. H).
- **What the main table measures:** the task streams themselves; the paper has "exactly two held-out evaluations" (App. H). It reports "a peak across rounds", over gate-admitted libraries only (App. D.2), and the gate's task set "is the training task stream itself" (App. D.3). SkillOpt runs from its authors' code, one model as optimizer and solver, read at its peak over epochs (§4.2; App. C.1).

## Approach

Each round has three stages (Alg. 1, Fig. 2):
- **Local evidence (§3.2):** each task runs with its recalled prior; Localize compares successive runs with verifier feedback and keeps "the operational hypotheses that execution feedback has already supported on the current task".
- **Consolidation (§3.3; App. B):** cards are embedded in several text views, weighted most on the signature and least on the skill text; consensus clustering over agglomerative runs gives the families. An LLM compresses each family into a candidate prior, told to drop any step that "would only ever fire for 1" of its tasks (App. M, Fig. A3).
- **Admission (§3.4; App. D.3):** candidates come from fresh compression, append-only repair (narrow rules from the failing tasks' local skills, appended where the deployed prior "lost ground") and each family's best version so far. A revision's value is the mean soft score with the prior alone, no local skill (Eq. 4; App. A). The best is committed only if it reaches an anchor minus 0.02 (Eq. 5): the larger of the standing library's and No-Skill's value, floored at the best value measured in the previous round. A round's candidate is decided by the next round's first deployment.
- **Solving (§3.5):** the frozen prior plus a local skill kept updated.

## Results

- **Main table (§4.2, Tab. 1):** both GLoW settings beat No-Skill in all 12 runs; the frozen priors gain 17.2 points on average (hard; best round, on the training streams), slightly more with local regeneration, with the smallest p a [sign test](#/glossary/sign-test) or Wilcoxon test can give at 12 runs (App. D.1). The authors place the largest gain in Tab. 1 on software repair and the smallest, for two of three models, on math: "the ordering the framework predicts".
- **Against SkillOpt (§4.2):** "Across all 21 cells, GLoW leads on 15, SkillOpt on 4 and two tie", SkillOpt's four all on ALFWorld, "the one benchmark whose tasks share a single action space".
- **Other organizations (§4.3, Tab. 2):** Base-only averages +2.0 points over No-Skill and loses ground on 4 of 12 cells; Local-only gains +10.9 but "still trails Global-only"; the AWM-style pool averages +5.0, below one round of family consolidation (App. C.2).
- **Gate (§4.3, Fig. 3):** decisions followed the benchmark, not the model. By the final round the gated library averages +14.7 points over No-Skill against +9.6 for candidates admitted unconditionally; some rejected candidates would have passed on their consolidation-time score (measured when the candidate was built) alone.
- **What families capture (§4.4; App. G):** on ALFWorld (MiniMax-M3) almost all families fall inside one of the dataset's own six task types (Tab. 3). On Terminal-Bench-Pro a "binary" family's prior helped only the members really solved by scanning raw bytes (Tab. A16); the largest family of another run, grouping a debugger session with a write-ahead-log recovery (restoring a database from its change log), had no net gain.
- **Transfer (§4.5, Tab. 4):** unmodified, the library raises mean success on 60 unseen ALFWorld tasks from 73.9% to 83.9%, all three models improving; it also lifts MiniMax-M3's resolve rate on 30 held-out SWE-bench instances, mean of three trials (App. F).
- **Size:** the committed library is 3.6 times smaller than the per-task pool, counted in words (§4.2; App. E, Tab. A10).

## Limits the authors state

- "Transfer was shown where task categories recur; whether a prior survives a genuine domain change remains open" (§5); the two held-out sets "carry different kinds of evidential weight" (App. H, Tab. A18).
- "this paper does not report a sensitivity analysis" for its hyperparameters (App. K); the clustering weights for cards without a trajectory were picked on ALFWorld and a spreadsheet benchmark, and "the other three inherited the result directly" (App. B, Tab. A4).
- "performance peaks at round 1 and then decays" (App. K, Tab. A21); later sub-rounds have "diminishing returns" (App. I).
- The significance "cannot be pushed down to a single cell" (App. J.2).
- Admitting ties is "a design choice, not a conclusion we verify" (App. D.3); repair "is not guaranteed to help" (App. O.1).
- The Avg. soft column "should be read only as relative movement across settings within one row" (App. A).
- "Procedure sharing is therefore a property of how the family is drawn rather than of the benchmark" (§4.4); family names are "not the clustering axis" (App. N.2).
- The flat-versus-family control "is a 15-task validation split at a single trial" (App. O.2).

## Open problems and building blocks

- **Open:** "cross-model inheritance remains untested": handing one model's library to another (§5).
- **Released:** "The outputs of all twelve ship with the supplementary material" (configurations, library states, per-task results, priors, local skills; App. I), as do the split files (App. H); five core prompts are printed (App. M). No code release is stated.
- **To reuse it:** one frozen API model; Qwen3-Embedding-8B (an embedding model), 4-bit, for recall on one 16 GB GPU (§4.1; App. L); Docker for the SWE-bench and Terminal-Bench-Pro containers (App. L); a per-task verifier score (§3.1). The prompts are "phrased benchmark-independently" apart from one category phrase (App. M).

## On this site

- **Discussed in:** [Self-improvement that compounds](#/challenges/compounding_self_improvement)
- **Tags:** <span class="tags"><a class="tag" href="#/tags/agent">agent</a><a class="tag" href="#/tags/code">code</a><a class="tag" href="#/tags/harness">harness</a><a class="tag" href="#/tags/llm">llm</a><a class="tag" href="#/tags/math">math</a><a class="tag" href="#/tags/method">method</a><a class="tag sub" href="#/tags/promptopt-context">promptopt-context</a><a class="tag sub" href="#/tags/promptopt-feedback">promptopt-feedback</a></span>
