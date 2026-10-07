# C-Evolve: Consensus-based Evolution for Prompt Groups

**C-Evolve** · preprint 2025

Read: [PDF](https://arxiv.org/pdf/2509.23331) · [arXiv](https://arxiv.org/abs/2509.23331)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Evolves a group of prompts whose majority vote is best, with island-based diversity.
- Fitness is a prompt's contribution to its group's vote.
- Prompt optimization combined with majority voting over several evolved prompts: a prompt ensemble, not single-prompt self-consistency ([Self-Consistency](#/papers/wang2022selfconsistency "Self-Consistency Improves Chain of Thought Reasoning in Language Models (2023)") §3.4).

## In plain words

Prompt optimizers that evolve prompts for a fixed LLM usually return one best prompt. The authors argue that "in complex task environments, a single optimal prompt often suffers from inherent expressive limitations", and that when several different prompts answer and their answers are combined, one prompt's failures "can be compensated by others" (§1). C-Evolve evolves several separate populations of prompts (three in the experiments, §5.3). After a warm-up in which each prompt is scored on its own, it scores each prompt by how well the groups it joins do once their answers are combined, and it returns the top prompt of each population as the final group (§1, §4). With the open-source model Qwen3-8B, the authors report 70.67% on HotpotQA (multi-hop question answering) and 43.88% on IFBench (instruction following), which the abstract puts 4.95% and 2.73% above the prompt optimizer GEPA (abstract). They present it as, "to our best knowledge", "the first algorithm developing the group consensus among prompts to drive their evolution for making more accurate predictions" (§6).

## Background and terms

**Terms to know:** [evolutionary search](#/glossary/evolutionary-search) · [reflective prompt optimization](#/glossary/reflective-prompt-optimization) · [Pareto front](#/glossary/pareto-front) · [F1 score](#/glossary/f1-score) · [exact match](#/glossary/exact-match) · [island model](#/glossary/island-model) · [exponential moving average (EMA)](#/glossary/exponential-moving-average-ema)

**The paper's own terms:**
- **compound AI system**: a program of one or more LLM calls ("modules"), possibly with tool calls such as retrieval; only the modules' prompts are optimized (§3).
- **individual**: one complete set of prompts, one per module; this is what evolves (§3).
- **evolver**: the LLM that reads an individual's prompts, its score and feedback, and proposes edits as SEARCH/REPLACE blocks (§4.1, App. H).
- **feedback set, metric set, test set**: disjoint splits; the first supplies example runs for the evolver, the second scores fitness, the third is held out (§4.1, App. B.3).
- **consensus aggregator**: combines a group's answers. For closed-ended tasks (HoVer, MATH, GPQA in the paper's split, Tab. 1) it is a majority vote (in MATH and GPQA, a random pick when no answer has a majority, App. B.2); for open-ended tasks (HotpotQA, IFBench) an LLM picks the "most representative" answer, called LLM-selection (§3, §5.5.1, App. K).
- **voting score**: the mean score, on the metric set, of the combined answers of all groups in the current iteration that contain the individual (Eq. 3).
- **EMA voting score**: the voting score smoothed over iterations, with weight α on the old value; the fitness in the voting stage (Eq. 4).
- **group feedback**: what the evolver sees in the voting stage: the individual's prompts, its group, every member's output, the group's combined answer and score, and all module inputs and outputs (§4.2).

**Builds on:**
- GEPA ([GEPA](#/papers/agrawal2025gepa "GEPA: Reflective Prompt Evolution Can Outperform Reinforcement Learning (2026)")), which the paper describes as a genetic algorithm with "natural language reflection and pareto-based selection" (§2). C-Evolve follows its split protocol (App. B.3) and IFBench system (App. B.1); the HotpotQA and HoVer systems follow LangProBe, a benchmark of LLM programs (App. B).
- AlphaEvolve ([AlphaEvolve](#/papers/novikov2025alphaevolve "AlphaEvolve: A coding agent for scientific and algorithmic discovery (2025)")), an evolutionary coding agent, which the paper describes as using "an island-based evolutionary algorithm" (§2); the main baseline besides GEPA (§5.3).
- Island-model evolution: the generalized island model (Izzo et al., 2012) and FunSearch (Romera-Paredes et al., 2024), LLM-guided program search (§1).
- Ensembles and consensus in LLMs: ensemble methods, self-consistency ([Self-Consistency](#/papers/wang2022selfconsistency "Self-Consistency Improves Chain of Thought Reasoning in Language Models (2023)")), which the paper describes as a technique "where multiple outputs are generated from multiple prompts and final answer is chosen by majority voting" (§2), and multi-agent systems (§2).

## Problem and setting

- **Question:** can evolution target a group of prompts whose combined answer is best, rather than the single best prompt (Eq. 2 against Eq. 1, §3)?
- **Systems and tasks** (App. B, App. I): HotpotQA, Wikipedia questions that need several documents, run as two rounds of retrieval and summary with four prompts, scored by F1; IFBench, precise instruction following, run as answer-then-refine with two prompts, scored by whether all instructions are followed; HoVer, multi-hop claim verification, scored by whether the gold passages are all in the union of the system's three retrieval outputs; MATH, high-school and competition-level math problems, and GPQA, graduate-level multiple-choice science questions, both scored by exact match of the extracted answer.
- **Models** (§5.2, App. C): Qwen3-8B (served with SGLang on 8×H800 GPUs) and GPT-4.1 mini (OpenAI API), both at temperature 1 with at most 4,096 generated tokens, "during both evolution and evaluation" (stated for Qwen3-8B).
- **Splits** (Tab. 7): 150 / 300 / 300 for feedback / metric / test, except GPQA (100 / 200 / 264) and the IFBench test set (294).
- **Settings** (§5.3): 3 islands, at most 10 individuals each, 3 feedback questions per individual, 10 groups sampled per voting iteration, a 10% migration rate between islands; all runs start from the baseline prompts in App. L.
- **Baselines** (§5.3): the starting prompts; GEPA, for which "we evaluate the optimal system prompts provided in its paper"; AlphaEvolve, "not open-sourced", so the authors report their "own reimplementation".

## Approach

- **Warm-up stage** (§4.1, Alg. 2): each island starts from the baseline individual. Per iteration and island, a parent is drawn so that "higher-performing individuals have a greater probability of being selected" (a softmax over scores, Alg. 1). The evolver edits it using its execution feedback on a minibatch from the feedback set; the child is scored on the metric set, and when an island exceeds its cap the lowest-scoring individual is removed.
- **Voting stage** (§4.1, Fig. 2, Alg. 3): each island again adds one evolved child, which starts with its parent's EMA score. Then groups are formed by drawing one individual from each island, each group's combined answer is scored on the metric set, each sampled member's voting score (Eq. 3) updates its EMA score (Eq. 4), and the lowest-EMA individual in each island is removed (Alg. 3: when the island exceeds its cap). The EMA starts from the warm-up's individual score. The authors avoid a plain average over all past groups because past partners "may have already been eliminated" (§4.1); pruning every member of the worst group instead "makes no sense in this context", since members overlap with better groups (§4.1).
- **Feedback** (§4.2, App. J): every module's inputs and outputs; for HotpotQA an LLM compiles it, as retrieved documents are "usually long".
- **Output:** each island's highest-EMA individual joins the final group; at test time its members answer in parallel and the aggregator combines them (§4.1, §5.5.3).
- **Cost measures** (§5.5.3): new prompts' metric-set answers are cached and reused when groups are scored, which the authors say "eliminates the need for repeated LLM calls during the voting stage".

## Results

- **Main comparison** (Tab. 1): with Qwen3-8B, C-Evolve scores 70.67 on HotpotQA against GEPA's 65.72, AlphaEvolve's 65.31 and the starting prompts' 50.03, and 43.88 on IFBench against 34.01, 41.15 and 31.29; the abstract calls these gains over GEPA 4.95% and 2.73%. With GPT-4.1 mini it reports 47.96 on IFBench (GEPA 46.59, AlphaEvolve 45.24) and 95.33 on MATH (AlphaEvolve 92.66, starting prompts 78.66). The abstract calls this "state-of-the-art performance across a wide range of tasks".
- **Average gain** (Tab. 1 "Improvement", "the average relative gain … over baseline across available tasks"; §5.4.1): +13.85 for C-Evolve against +8.02 (GEPA) and +9.75 (AlphaEvolve) on Qwen3-8B, and +16.09 against +9.2 and +13.42 on GPT-4.1 mini.
- **Voting during evolution matters** (Tab. 2, IFBench, Qwen3-8B): the best of AlphaEvolve's three island prompts scores 41.15 alone, and combining all three gives 41.15 too; C-Evolve's three chosen prompts score 40.47, 39.79 and 38.77 alone and 43.88 together. On HotpotQA and HoVer, "AlphaEvolve exhibits rapid improvement in the early stage but soon plateaus, while C-Evolve continues to improve after entering the voting stage" (§5.4.1, Fig. 1, metric-set scores).
- **Diversity** (§5.4.2, App. E, Figs. 5–6): on IFBench the islands' prompts develop different emphases, and in a t-SNE map (a 2-D projection of the prompts' word statistics) each island's best individuals "gradually diverge" during the voting stage.
- **Hard problems** (§5.4.3, Tab. 3, MATH by difficulty level): at Level 5 the islands' best prompts score 66.66, 63.66 and 62.66 and their majority vote 68.33. The authors say the vote "consistently outperforms all islands on Levels 3–5" and conclude that "problems unsolvable by a single optimal prompt can often be addressed through majority voting"; App. F, Tab. 8 splits Level 5 by how many prompts agree.
- **Ablations** (IFBench, Qwen3-8B, 50 warm-up plus 50 voting iterations): LLM-selection beats an aggregator that writes a summary answer (Tab. 4, §5.5.1); EMA with α 0.8 beats α 0.5 and the plain group average (Tab. 5); the warm-up stage helps (Tab. 9, App. G.1); averaging over groups beats taking a prompt's best group score, which "generalizes poorly" (Tab. 10, App. G.2).
- **Cost** (Tab. 6, GPQA, Qwen3-8B): 47.15 accuracy against AlphaEvolve's 43.08, at 4.3 against 3.5 minutes per evolution iteration and 0.79 against 0.68 seconds per test question with the three prompts called in parallel (§5.5.3).

## Limits the authors state

- C-Evolve "introduces additional computational overhead", from computing the voting score during evolution and from "multi-prompt reasoning in inference" (§5.5.3).
- For open-ended tasks, "it indeed needs another LLM request to complete majority voting" (§5.5.3).

## Open problems and building blocks

- **Open:** none stated as open problems. The conclusion says the method "opens new directions for optimizing compound AI systems, especially for those built on proprietary models" (§6).
- **Released:** nothing stated beyond what the appendices print: the evolver prompt (App. H), task descriptions (App. I), feedback templates (App. J), the aggregator prompt (App. K), and the baseline, AlphaEvolve and C-Evolve prompts for each task (App. L).
- **To reuse it:** an evolver LLM; a scored metric set and a feedback set per task (Tab. 7); a consensus aggregator suited to the answer type, majority vote or an extra LLM call (§3, §5.5.3).

## On this site

- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/promptopt-evolve">promptopt-evolve</a><a class="tag sub" href="#/tags/promptopt-general">promptopt-general</a><a class="tag sub" href="#/tags/scaling-general">scaling-general</a></span>
