# LangProBe: a Language Program Benchmark

**LangProBe** · Findings of EMNLP 2025

Read: [PDF](https://arxiv.org/pdf/2502.20315) · [arXiv](https://arxiv.org/abs/2502.20315) · [DOI](https://doi.org/10.18653/v1/2025.findings-emnlp.1172)  
Code: [langProBe](https://github.com/Shangyint/langProBe)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- A benchmark of language programs: DSPy programs from a single call and chain of thought to RAG, multi-hop retrieval, ReAct agents and generator–critic–ranker or –fuser pipelines (§3.2), crossed with four prompt optimizers (BootstrapFewShot, BootstrapFewShotRandomSearch, MIPROv2, and the authors' RuleInfer, §3.3) and six OpenAI and Llama models (§4), on 16 tasks in six categories, among them AppWorld, HumanEval, MATH, GSM8K, classification and question answering (§3.1; Tab. 1).
- Scores each combination with its task's metric, mostly answer matching, unit tests or a final-state check (App. A), and plots quality against inference cost as Pareto curves (§5); ranks optimizers by how often they come within 3% of a program's best score, and gives their relative gains over the unoptimized program for the Llama runs (§7; Figs. 5–6).
- A released grid of prompt-optimizer gains on mostly checked metrics, as an audit target: the authors report results for "over 2000 combinations" (abstract; §4), gains that vary by model, task and program, with optimizers sometimes lowering the score, which they attribute to overfitting the validation set (§7.2), and gpt-4o-mini with programs and optimizers beating gpt-4o's raw calls at lower cost on aggregate (<a class="tag" href="#/tags/compact">compact</a>; §5, Fig. 2).

## In plain words

Developers now build LLM applications as language programs: pipelines of model calls and tools whose prompts an optimizer tunes. The authors say the trade-offs in this space "have only scarcely been studied before" (abstract), and that it is unclear which problems need such pipelines, and which designs and optimizers work best where (§1). They build LangProBe, which they call "the first large-scale benchmark for evaluating the architectures and optimization strategies for language programs" (abstract): 16 tasks, more than 10 pipeline designs, four prompt optimizers and six OpenAI and Llama models, run in combination (§4). Aggregated over seven datasets, they report that gpt-4o-mini with pipelines and optimization scores 11.68% higher than gpt-4o's plain baseline at 50% of its cost (§5, Fig. 2). Optimizers can raise scores for many but not all combinations (§1); in the Llama runs the median gain over the same unoptimized pipeline is 6.3% to 18.1%, depending on the optimizer, and some runs lose score (Fig. 6). Their theme: "human judgment (or empirical decisions) about which compositions to pursue is still necessary for best performance" (abstract).

## Background and terms

**Terms to know:** [Pareto front](#/glossary/pareto-front) · [retrieval-augmented generation (RAG)](#/glossary/retrieval-augmented-generation-rag) · [multi-hop question answering](#/glossary/multi-hop-question-answering) · [Bayesian optimization](#/glossary/bayesian-optimization) · [test-time scaling](#/glossary/test-time-scaling) · [LLM-as-a-judge](#/glossary/llm-as-a-judge)

**The paper's own terms:**
- **language program**: "modular natural-language software systems" that "make highly structured language model calls, invoke external tools, and compose all of these into sophisticated systems" (§1).
- **baseline (raw model prediction)**: "In most cases, the baseline is a zero-shot call to the LM with task description and task inputs" (Fig. 3 caption).
- **general and specialized programs**: general ones can be used for all benchmarks with little to no change; specialized ones suit some tasks (§3.2; Tab. 1).
- **generator, critic, fuser, ranker**: modules taken from Archon. A generator writes several responses, a critic lists their strengths and weaknesses, then a fuser merges them into one (GeneratorCriticFuser) or a ranker ranks them (GeneratorCriticRanker) (§3.2; App. B).
- **Model, Model+Program, Model+Optimizer, Model+Program+Optimizer**: the baseline unoptimized, other programs unoptimized, the baseline optimized, and other programs optimized (Fig. 2 caption).
- **Pareto curve**: drawn as the "upper-left convex hull over linearly scaled performance-cost axes", so every point on it can be reached by "cost-aware load balancing" between a segment's two end configurations (§5); wider than the glossary's front, which holds only the non-dominated configurations.
- **cost**: dollar inference cost from OpenAI's and, for Llama, Amazon Bedrock's prices (§1, footnote 1).
- **-T and lite optimizers**: "T" variants use a stronger optimizer model (gpt-4o-mini), "lite" ones less compute (Fig. 6 caption; Tab. 2).

**Builds on:**
- DSPy (Khattab et al., 2022, 2024; the 2024 paper is [DSPy](#/papers/khattab2023dspy "DSPy: Compiling Declarative Language Model Calls into Self-Improving Pipelines (2024)")): the framework of the whole testbed and the source of the BootstrapFewShot optimizers (§3.2, §3.3).
- MIPRO (Opsahl-Ong et al., 2024; [MIPRO (shipped in DSPy as MIPROv2)](#/papers/opsahlong2024mipro "Optimizing Instructions and Demonstrations for Multi-Stage Language Model Programs (2024)")), which the authors find best overall on average (§1, §3.3).
- Archon (Saad-Falcon et al., 2024; not listed here), an architecture-search framework for inference-time techniques, whose modular structure the general programs adapt (§3.2).
- ReAct (Yao et al., 2023; [ReAct](#/papers/yao2022react "ReAct: Synergizing Reasoning and Acting in Language Models (2023)")) and Baleen (Khattab et al., 2021; not listed here), the bases of the agent and multi-hop retrieval programs (§3.2).

## Problem and setting

- **Questions (§1):** whether programs and optimizers improve cost-performance over raw model calls (§5), which program architectures work best on which problems (§6), and which optimizers perform best and where (§7).
- **The grid:** runs are "Cartesian products of dataset tasks, language programs, optimizers, and language models", even ones that "obviously do not work" (§4), over 2000 in all (abstract; §4). Tab. 1 lists 16 tasks from 15 datasets (Fig. 1).
- **Tasks (§3.1; Tab. 1; App. A):** existing datasets recast "into a uniform testbed with metrics and data splits" (§3.1). Agent: AppWorld (mobile-app questions, answered by Python code the AppWorld server runs). Code: HumanEval (function-writing problems), SWEUnderspecified and SWEValidity (scoring SWE-bench issues and tests, against annotated scores). Reasoning: JudgeBench (pick the better of two answers; [JudgeBench](#/papers/tan2024judgebench "JudgeBench: A Benchmark for Evaluating LLM-based Judges (2025)")), Scone (negation). Knowledge: MMLU (multiple choice), HotpotQA (multi-hop questions over Wikipedia), HoVer (multi-hop claim checking), HotpotQAConditional (answer-format rules the model doesn't know, §6.2), IReRa (labels from a huge label set), RAG-QA Arena "Technology" questions. Classification: Iris, Heart Disease (measurements given as text). Math: MATH, GSM8K.
- **What "correct" means (App. A):** mostly string or integer equality with the gold answer; unit tests for HumanEval; for AppWorld, unit tests on the final database state and no unwanted actions; rank-precision for IReRa (true relevant items against the ranked predictions). RAG-QA Arena uses "semantic F1" ([F1 score](#/glossary/f1-score)) against the ground truth: "Note here the language model used to evaluate F1 is the same as the model being evaluated."
- **Models (§4):** gpt-4o, gpt-4o-mini, o1-mini, and Llama 3.1-8B, 3.2-3B and 3.3-70B Instruct.
- **Splits:** optimizers learn from training data, most also from a separate validation set; final scores are on a test set (§7.2). Split sizes and repeated runs: not discussed.

## Approach

- **Programs (§3.2; App. B gives each one's number of LLM calls):** general: `Predict` (one structured call), chain of thought, GeneratorCriticRanker, GeneratorCriticFuser. Specialized: RAG (retrieve, then chain of thought); SimplifiedBaleen (multi-hop retrieval), plus a variant with a hand-written format prompt; MultiHopSummarize; RAGBasedRank (an LLM re-ranks retrieved items); CoTBasedVote (chain-of-thought votes, consolidated); ReActBaseline and ReActAugmented (with few-shot demonstrations), the AppWorld agents.
  - **BootstrapFewShot:** a teacher model runs the program on training examples to generate demonstrations; "successful" ones, which pass the metric, become few-shot examples.
  - **BootstrapFewShotRandomSearch** (also written BootstrapFewShotWithRandomSearch, §5; Tab. 2): random search over sets of bootstrapped demonstrations, chosen on the validation set.
  - **MIPROv2:** bootstrapped demonstrations plus instruction candidates per module from a separate LM proposer, combined by Bayesian Optimization.
  - **RuleInfer**, introduced here: one round of BootstrapFewShot, then an LLM induces rules from the successful demonstrations and appends them to the instructions; a candidate is kept only if it beats the best validation score (§3.3; App. E, Alg. 1).
- **Cost analysis (§5):** score against dollar cost, with a Pareto curve per configuration family, aggregated over seven datasets (Scone, HotpotQA, HumanEval, HeartDisease, Judge, Iris, HotpotQAConditional; App. C) and per dataset (Figs. 7–9).
- **Optimizer ranking (§7.1):** how often each optimizer comes within 3% of the best score for the same dataset and program (Fig. 5).

## Results

All are the authors' claims.

- **Programs against the baseline (§6; Fig. 3, averaged over models):** "In almost all cases, using some selected language programs, either unoptimized or optimized, gives a better performance than the raw model prediction baseline."
- **Which programs (§6.1; Fig. 4, gpt-4o-mini, unoptimized):** large gains come mostly from retrieval programs; GeneratorCriticRanker on RAGQAArena and GeneratorCriticFuser on JudgeBench fall below the baseline. Traces show errors in multi-module programs that "cascade from one module flow into other modules"; optimization mitigates this, especially parsing errors. Human judgment "(or a well-scoped search for tasks with enough data)" is still required for best performance. §1 adds that inference-time scaling programs "can fail to exceed baseline systems in certain applications".
- **When programs help (§6.2):** often more on tasks needing information the model lacks (HotpotQAConditional, IReRa); tasks models are trained on, like MMLU or HumanEval, "often see little to no benefit from unoptimized language programs".
- **Cost (§5; Fig. 2):** for both model families, the Model+Program+Optimizer curve dominates the Model+Program and Model+Optimizer curves, which dominate the Model curve. On the seven-dataset aggregate, gpt-4o-mini with programs and optimization scores 11.68% higher than gpt-4o's baseline at 50% of the cost, and slightly better than gpt-4o with programs at a fraction of its cost. On HotpotQA, 33.2% better than gpt-4o without programs or optimization at 18% lower cost (Fig. 8c). On GSM8K, BootstrapFewShotWithRandomSearch gives gpt-4o-mini an 8% better result at 5% lower cost (Fig. 7b): few-shot examples add cheap input tokens and remove costly long reasoning in the output.
- **Which optimizers (§7.1; Fig. 5):** MIPROv2, BootstrapFewShotRandomSearch and their variants lead; the caption names MIPROv2-T best. RuleInfer reaches top scores but generalizes slightly worse, as it can "only work for tasks with obvious and conclusive rules from the examples". -T variants generally do better, except RuleInfer.
- **Size of gains (§7.2; Fig. 6, Llama runs only):** 90th percentiles of 80.2% to 122.5%, medians of 6.3% to 18.1%. MIPROv2 raises Llama-3.2-3B on HeartDisease from 26.32 to 76.32. "In some rare cases, performance degradation happens", which they attribute to possible overfitting of the validation set; RuleInfer and its variants degrade most, "due to non-transferable rules".

## Limits the authors state

- "Due to compute constraints", LangProBe "is not able to include more language programs (e.g., program-of-thought) and datasets (e.g., SWE-bench)", and "does not run full evaluation on the newest reasoning models, like DeepSeek-R1 or OpenAI o3-mini, also due to budget and time constraint" (§ Limitations). [Program-of-thought](#/glossary/program-of-thought-and-tool-integrated-reasoning): the model answers by writing and running a program.
- "Inference costs are likely to vary across time and providers, but provide a reasonable relative comparison between models by the same provider" (§1, footnote 1).
- MATH is scored by string equality: "Arguably, a more prominent evaluator like Math-Verify … would report fairer (and higher) scores for all programs and optimizers, which is left as future work" (App. A; Math-Verify is a math-answer evaluator).

## Open problems and building blocks

  - Choosing compositions still needs "human judgment (or empirical decisions)" (abstract), or "a well-scoped search for tasks with enough data" (§6.1).
  - "While this lies outside our scope", they see "large headroom for new prompt optimizers and also for finetuning- or RL-based optimizers to boost quality even further" (§1).
  - Agentic benchmarks: "we intend to add some of them to future iterations" (§2).
  - Moving "past the general capability datasets that model providers hill climb and closer to the composite downstream problems that LM programmers seek to solve" (§3.1).
  - A goal of the benchmark: "to facilitate the development and comparison of new language program architectures and optimization strategies" (§8; App. E presents RuleInfer as an example).
- **Released:** a plan: "We will open source the code and evaluation data" (abstract).
- **To reuse it:** built in DSPy "out of convenience", "although in principle future declarative languages can support the same research questions we ask about programs, models, and optimizers" (§3.2). RuleInfer needs an LLM for rule induction, a training set and a validation set (Alg. 1).

## On this site

- **Tags:** <span class="tags"><a class="tag" href="#/tags/compact">compact</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/promptopt-general">promptopt-general</a><a class="tag sub" href="#/tags/promptopt-misc">promptopt-misc</a></span>
