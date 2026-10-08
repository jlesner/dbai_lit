# Not All Skills Help: Measuring and Repairing Agent Knowledge

**Not All Skills Help** · preprint 2026

Read: [PDF](https://arxiv.org/pdf/2606.15390) · [arXiv](https://arxiv.org/abs/2606.15390)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Curates an agent's natural-language skill library by measurement rather than LLM judgment: randomized masking on a small development set gives each skill a causal score per development task, from which it splits skills whose effect varies across tasks into conditional variants (an LLM rewrites them, behind a development-set gate), retires inert ones, merges near-duplicates, and at inference suppresses the skills predicted to hurt each test task, using its nearest development tasks (abstract; §2.1–2.3).
- Seven models from four providers in non-reasoning mode, on AppWorld (`test_normal`, `test_challenge`) with a ReAct agent and τ-bench retail, with 15 development tasks per benchmark and five hand-written, protected templates added to every library; compared with published skill-curation results on AppWorld and with each model's unaugmented agent (§2; §3.1; App. B).
- Skills that help some task types and hurt others, whose effects "cancel in aggregate" so global curation misses them (abstract; §2.1); the authors call it "the first empirical characterisation of causal heterogeneity in agent skill libraries" (§1). In their sequential ablation the hand-written templates add almost as much as per-task masking (App. H, Tab. 7), and two models show no gain on τ-bench (App. A.3).

## In plain words

LLM agents can improve without retraining by putting short written skills, rules learned from earlier tasks, into the prompt. The authors say current systems leave every decision about which skills to keep and apply to LLM judgment alone, and they find that skills routinely help on some kinds of task while hurting on others, so their effects "cancel in aggregate" and curation by average effect misses them (abstract). Their framework, ASSAY, runs the agent on a few held-out tasks with random subsets of skills switched off, estimates each skill's effect on each task, rewrites, removes or merges skills, and for each new task drops the skills predicted to hurt it (abstract; §2). With models in non-reasoning mode and hand-written skills added to every library, they report 69.3% task-goal completion for DeepSeek-V3 on AppWorld's hardest split (an app-automation coding benchmark), against 47.0% without skills, "a new state of the art among all published methods including weight-tuned approaches" (abstract; Tab. 1). They claim "the first empirical characterisation of causal heterogeneity in agent skill libraries" (§1): of skills whose effect varies across tasks.

## Background and terms

**Terms to know:** [agent skill](#/glossary/agent-skill) · [retrieval-augmented generation (RAG)](#/glossary/retrieval-augmented-generation-rag) · [bootstrap resampling](#/glossary/bootstrap-resampling) · [statistical power](#/glossary/statistical-power) · [Mann-Whitney U test](#/glossary/mann-whitney-u-test)

**The paper's own terms:**
- **skill**: "short rules, heuristics, procedural templates" distilled from agent trajectories (§1), injected into the system prompt (§3.1); not the glossary entry's folder format.
- **templates**: five hand-written skills per benchmark (prefix `tpl-`), "derived from each benchmark's public documentation and training-split failure analysis", appended to every library and "exempt from all subsequent modification and masking" (§2; App. B).
- **development set**: held-out tasks, disjoint from training and test, where all measurement happens (§2).
- **causal score, attribution matrix**: for one skill and one development task, the success rate of the random masks (skill subsets) that include the skill minus that of the masks that exclude it (Eq. 1); one row per skill, one column per task.
- **global causal score**: a skill's mean causal score over the development tasks (Eq. 3).
- **causal heterogeneity**: a skill's largest minus smallest causal score across development tasks (Eq. 4); "causally heterogeneous" when this reaches a threshold (Def. 1).
- **development gate**: a rewritten library must do at least as well as the original on all development tasks (§2.2; App. I).
- **TGC, SGC**: AppWorld's Task Goal Completion, the primary metric, and Sub-Goal Completion, which "awards partial credit" for sub-goals (§3.1; App. J).

**Missing glossary terms:**
- **average treatment effect (ATE)**: the average change in an outcome caused by a treatment; here, by including one skill on one task, "marginalised over the distribution of co-occurring skills" (§2.1).

**Builds on:**
- Agents that store experience as text in their context, among them Reflexion [9] ([Reflexion](#/papers/shinn2023reflexion "Reflexion: Language Agents with Verbal Reinforcement Learning (2023)")), ExpeL [23] and ACE [22] ([ACE](#/papers/zhang2025ace "Agentic Context Engineering: Evolving Contexts for Self-Improving Language Models (2026)")); in these methods, the authors say, every lifecycle decision is made by "LLM judgment operating within individual tasks" (§1; §4).
- The AppWorld baselines ACE; CUGA [8], a "hierarchical planner-executor" agent; and Gupta et al. [3], who select sets of demonstrations by an embedding-based similarity score (§3.1; §4).
- Randomized ablation [2] and Shapley-value attribution [6], ways to explain a model's output by removing parts of its input, here applied "to natural-language skill instructions rather than model components" (§4).
- The ReAct agent [17] ([ReAct](#/papers/yao2022react "ReAct: Synergizing Reasoning and Acting in Language Models (2023)")), interleaving reasoning and actions, and the benchmarks AppWorld [11] and τ-bench [18] ([τ-bench](#/papers/yao2024taubench "$\tau$-bench: A Benchmark for Tool-Agent-User Interaction in Real-World Domains (2025)")) (§3.1).

## Problem and setting

The authors ask whether measurement-driven curation generalises, where gains and harm concentrate, and which stages matter most (§3).

- **Input:** a skill library "produced by an existing curation pipeline" (§2), for GPT-5.1 "the upstream ACE library" (App. E); 71 to 126 skills on AppWorld (App. G).
- **AppWorld:** nine simulated consumer apps (email, Spotify, Amazon, etc.) driven by Python API calls in a code REPL; splits `test_normal` (168 tasks) and the harder `test_challenge` (417); a ReAct agent with a 40-step budget (§3.1).
- **τ-bench retail:** customer service through function-calling tools, with a GPT-4o-simulated customer and a policy document; 115 tasks graded by exact database-state match, no partial credit; the benchmark's native tool-calling agent (§3.1).
- **Models:** GPT-5.4, GPT-5.1, GPT-4.1, GPT-4o, DeepSeek-V3 (`deepseek-chat`, V3.2, Tab. 6), Claude Sonnet 4.5 and Gemini 2.5 Pro, in non-reasoning mode "to isolate the effect of skill curation from chain-of-thought reasoning", at temperature 0 (§3.1).
- **Settings:** 15 development tasks per benchmark; 12 masks keeping each skill with probability 0.4, "approximately 5 masks per skill" (§3.1); no per-cell tuning (App. G, Tab. 5).
- **Baselines:** on AppWorld, the best published method per model (ACE, CUGA or Gupta et al.) or bare ReAct where none exists; on τ-bench, each model without skills (§3.1). The GPT-4o ReAct number comes from a leaderboard entry on an older GPT-4o version (Tab. 6, footnote).

## Approach

Three stages driven by the attribution matrix, recomputed per base model (§2.1; Fig. 2).

- **Measure (§2.1).** Run each development task under each mask and score each skill (Eq. 1). The authors state that "under Bernoulli sampling" (skills kept independently) this is an unbiased estimate of the skill's average treatment effect on that task (variance bound: Eq. 2).
- **Restructure offline (§2.2).** First *split* each skill at or above the heterogeneity threshold (0.40, Tab. 5): the base LLM rewrites it into two variants with explicit trigger conditions, one for tasks where it helps and one where it hurts, kept only if they pass the development gate; at most 15 candidates (Tab. 5), "the one point where LLM judgment re-enters curation". Then *retire* skills whose global score is below 0.10 in absolute value, and *merge* near-duplicate skills by embedding similarity, keeping the best-scoring one. Splitting goes first, since a heterogeneous skill's near-zero global score means it "would be incorrectly retired" otherwise.
- **Mask per task at inference (§2.3, Alg. 1).** Find the test task's nearest development tasks by embedding similarity, weight them with a temperature softmax (Eq. 5), and predict each skill's effect as the weighted average of its scores there (Eq. 6). Keep a skill if the prediction is at least −0.10 or it is protected (prefixes `tpl-`, `shr-`, `api-`) (Eq. 7, Tab. 5); if fewer than 30 remain, use the whole library (Tab. 5). The authors argue that "under the approximation that skills contribute independently to task success" removal-only masking minimises expected harm, and call its asymmetry deliberate: missing a critical skill "causes catastrophic failure" (§2.3).

The authors claim the pipeline "cannot degrade performance below any prefix of stages" (§2.3, "Summary").

## Results

- **AppWorld (Tab. 1, §3.2).** "Every model improves over its respective baseline on both splits". On `test_challenge`, DeepSeek-V3 reaches 69.3% TGC against 47.0% for bare ReAct and 63.1% for ACE (47.4% relative over ReAct); the leaderboard leader, a weight-tuned Qwen3-14B entry with "No accompanying publication" (§3.1, footnote), has 67.6%.
- **Harm from the uncurated library (§3.2).** For GPT-5.1 on `test_challenge`, the upstream library lowers TGC from 52.5% to 49.9%; ASSAY reaches 66.4%. The harm sits in level-2 and level-3 tasks (Fig. 3; App. E, Tab. 3). Masking the most positively-scoring skills instead "degrades performance" (§3.2).
- **τ-bench retail (Tab. 2, §3.2).** GPT-4.1 goes from 68.0% to 73.9% (8.7% relative), from leaderboard rank 14 to the rank 8–9 range, "past o4-mini, o1, and GPT-4.5". GPT-5.1 and Sonnet 4.5 show no gain, the other four models gain. The authors say gains concentrate on return and cancel tasks (§3.2; App. F, Tab. 4).
- **Sequential ablation (Tab. 7, App. H; §3.3).** GPT-5.1, `test_normal`: bare ReAct 61.9%, +templates 67.9%, +offline restructuring 69.9%, +per-task masking 77.4%; "Per-task masking contributes the largest single increment".
- **Heterogeneity (App. A.1).** On the GPT-5.1 attribution (103 skills) the authors report that over 90% of skills have a per-task range above 0.40, a pattern "qualitatively similar across all seven models", backed by six outcome-level tests, among them a Mann-Whitney test (dropped skills score worse than kept ones) (App. A.1; Tab. 11); most masking decisions keep their direction when masks are resampled (App. K.2, Tab. 10).
- **Other measures.** Sub-goal completion "mirrors the TGC results", though CUGA beats ASSAY for GPT-4.1 on `test_normal` (App. J, Tab. 8). Suppressed sets differ by task (App. A.2). For GPT-5.1, the method improves over ReAct even in the quarter of `test_normal` least like the development tasks, "though gains are largest in the mid-range" (App. K.4, Tab. 12).

## Limits the authors state

- GPT-5.1's null result on τ-bench: the authors offer two hypotheses, that its prior "saturates easy tasks but is insufficiently aligned to absorb external procedural knowledge on hard ones", and that "the skill library is curated on AppWorld", whose patterns "transfer only partially" (App. A.3).
- With Sonnet 4.5's null result, "the marginal value of prompt-time skill injection appears to diminish as base model competence strengthens" (App. A.3; §5).
- The attribution uses 15 development tasks "extrapolated via nearest-neighbour weighting", with limited coverage, especially of `test_challenge` (App. A.3; App. K.4, Fig. 5).
- The split step "invokes LLM judgment … reintroducing the subjectivity we aim to reduce"; "a fully measurement-driven splitting procedure remains open" (App. A.3).
- The framework "assumes a fixed skill library"; online settings "would require incremental attribution updates" (App. A.3; §5 calls them future work).
- With 12 masks, per-cell permutation tests (significance tests by random reshuffling) have 38.5% power for a true effect of ±0.30, and the 0.40 threshold flags about all skills when no effect exists: it "cannot distinguish real heterogeneity from noise at the single-skill level", hence the outcome-level tests (App. K.1, Tab. 9).
- Few suppressed cells are confirmed at the stricter 95% confidence-interval level (App. K.2).

## Open problems and building blocks

- **Open:** "increasing M to 30–50 masks would bring per-cell power to 80–98%, providing a clear path for future work" (App. K.1; M is the mask count there). Splitting and the online setting: see Limits.
- **Released:** "Code is available" (abstract).
- **To reuse it:** a skill library, a small held-out development set with pass/fail outcomes (§2), 180 agent rollouts per model (§3.1), the base LLM for split rewrites (§2.2) and the embedding model Qwen3-Embedding-0.6B (Tab. 6), redone per base model (§2.1).

## On this site

- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/harness-general">harness-general</a><a class="tag sub" href="#/tags/harness-promptopt">harness-promptopt</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/promptopt-context">promptopt-context</a><a class="tag sub" href="#/tags/promptopt-general">promptopt-general</a></span>
