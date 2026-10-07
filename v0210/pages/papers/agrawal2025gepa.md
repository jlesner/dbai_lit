# GEPA: Reflective Prompt Evolution Can Outperform Reinforcement Learning

**GEPA** · ICLR 2026

Read: [PDF](https://arxiv.org/pdf/2507.19457) · [arXiv](https://arxiv.org/abs/2507.19457)  
Code: [gepa](https://github.com/gepa-ai/gepa) · [gepa-ai](https://github.com/gepa-ai/dspy) · [gepa-artifact](https://github.com/gepa-ai/gepa-artifact)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Reflective prompt evolution with Pareto selection.
- It reports beating GRPO on five of six tasks with Qwen3 8B while using far fewer rollouts; GRPO stays ahead on AIME-2025 (§4).
- A candidate optimizer for refuter and checker prompts (cf. ).

## In plain words

LLM applications are often pipelines of prompted LLM calls and tools. Adapting one to a new task with reinforcement learning (training the weights from scored trial runs), such as GRPO, typically takes tens of thousands of runs, which the authors call a serious bottleneck when runs are expensive or weights can't be changed (§1). GEPA changes only the prompts. It runs the pipeline on a few training examples, shows an LLM the reasoning, outputs, score and evaluator messages, has it diagnose what went wrong and rewrite one prompt, and keeps the rewrite if it scores better. Rather than always building on the best prompt, it samples among candidates that are best on some held-out example (§3). With the open model Qwen3 8B, the authors report GEPA beating GRPO on five of six tasks, by about 6 points on average and with up to 35 times fewer runs, and beating the prompt optimizer MIPROv2 on every task with both models tested (abstract, §4). They present this as improving on reinforcement learning and on MIPROv2, "the prior state-of-the-art" (§1).

## Background and terms

**Terms to know:** [reinforcement learning](#/glossary/reinforcement-learning) · [GRPO](#/glossary/grpo) · [reflective prompt optimization](#/glossary/reflective-prompt-optimization) · [Pareto front](#/glossary/pareto-front) · [pass@k](#/glossary/passk) · [evolutionary search](#/glossary/evolutionary-search) · [LoRA](#/glossary/lora-low-rank-adaptation) (the GRPO baseline uses it, §4 footnote, App. E.4)

**The paper's own terms:**
- **compound AI system**: a program of one or more LLM calls (modules), possibly with tools, under arbitrary control flow; each module has a prompt (instructions and few-shot demonstrations) and model weights (§2).
- **rollout**: one run of the system on a task instance plus its scoring (§2); budgets count rollouts.
- **feedback function**: the task metric (a score from 0 to 1, §2) extended to also return text produced while evaluating, the **evaluation trace** (compiler errors, failed rubric items), as distinct from the **execution trace**, the text the LLMs produce (§3).
- **feedback set and Pareto set**: the examples minibatches come from, and those every accepted candidate is scored on for selection; in the experiments, the train and validation splits (Alg. 1, App. E.4).
- **Pareto frontier (this paper's sense)**: for each Pareto-set example, the candidates with the top score on it. GEPA keeps candidates that are on at least one of these, prunes dominated ones, and samples in proportion to how many examples each leads (§3.1, Alg. 2).
- **Merge / GEPA+Merge**: a "system-aware crossover" that builds a new candidate from the prompts of two lineages (App. D.1).
- **generalization gap**: the difference between the final test score and the best validation score, after Wan et al. (App. H, Fig. 16).

**Builds on:**
- The DSPy line: §2's formalization follows BetterTogether (fine-tuning plus prompt optimization), DSPy (a framework for LLM programs), MIPROv2 and LangProBe (a benchmark of LLM programs, the source of most tasks, App. E.1). MIPROv2, which tunes instructions and few-shot examples jointly by Bayesian search, is the main prompt-optimizer baseline (§4) ([DSPy](#/papers/khattab2023dspy "DSPy: Compiling Declarative Language Model Calls into Self-Improving Pipelines (2024)"), [MIPRO (shipped in DSPy as MIPROv2)](#/papers/opsahlong2024mipro "Optimizing Instructions and Demonstrations for Multi-Stage Language Model Programs (2024)")).
- GRPO, the RL baseline (§4), run with the multi-module GRPO implementation of Ziems et al. (App. E.4) ([DeepSeekMath](#/papers/shao2024deepseekmath "DeepSeekMath: Pushing the Limits of Mathematical Reasoning in Open Language Models (2024)"), [mmGRPO](#/papers/ziems2025mmgrpo "Composing Policy Gradients and Prompt Optimization for Language Model Programs (2026)")).
- TextGrad and Trace's OptoPrime (LLM optimizers driven by textual feedback) as baselines (Tab. 2); the selection rules of TextGrad (greedy) and APO (an earlier optimizer that edits prompts from LLM critiques, keeping a beam of candidates) as ablations (Tab. 3) ([TextGrad](#/papers/yuksekgonul2024textgrad "TextGrad: Automatic 'Differentiation' via Text (2024)"), [Trace / OptoPrime](#/papers/cheng2024trace "Trace is the Next AutoDiff: Generative Optimization with Rich Feedback, Execution Traces, and LLMs (2024)"), [ProTeGi](#/papers/pryzant2023protegi "Automatic Prompt Optimization with 'Gradient Descent' and Beam Search (2023)")).
- MAP-Elites, an evolutionary algorithm that keeps the best solution found for each of many niches rather than one overall best; the Pareto-based selection follows its "illumination" strategy (§3.1).

## Problem and setting

- **The question:** "How do we extract maximal learning signal from every expensive rollout to enable effective adaptation of complex, modular AI systems in low-data or budget-constrained settings?" (§2). Formally: maximize the expected metric within a rollout budget on the training set (Eq. 2), over prompts or weights, so that prompt optimizers and GRPO can be compared (§2).
- **Data access:** optimizers see training labels and may track validation scores but not read validation instances (§4).
- **Benchmarks (App. E.1):** HotpotQA (multi-hop question answering over Wikipedia), IFBench (following output constraints, tested on constraints unseen in training), HoVer (multi-hop retrieval for claim verification), PUPA (answering well without leaking personal information to an untrusted model), AIME-2025 (30 competition math problems, each run 5 times) and LiveBench-Math (math questions).
- **Models:** Qwen3 8B and GPT-4.1 Mini; every module of a system uses the same model (App. E.2).
- **Budgets (App. E.4):** MIPROv2 in its heavy setting (18 instruction candidates and 18 few-shot sets); GEPA capped at MIPROv2's rollout count per benchmark; Trace and TextGrad on the same budget with GEPA's feedback functions; GRPO with LoRA for 500 steps (24,000 rollouts), with early stopping on validation and three hyperparameters tuned by hand.

## Approach

- **Loop (§3, Alg. 1, Fig. 4):** each iteration picks a candidate (Pareto selection) and a module (round-robin), and runs the candidate on a minibatch (3 examples, App. E.4) through the feedback function. A reflection LLM sees the module's current prompt, the traces, scores and feedback text, and writes a new instruction with the meta-prompt of App. C. If the minibatch average improves, the new candidate joins the pool and is scored on the Pareto set, whose best average candidate is returned at the end. Weights never change, and GEPA's prompts are instructions only, with no demonstrations (App. L).
- **Feedback text:** the authors call evaluation traces "a second valuable source of diagnostic information" (§3). Examples: documents still to retrieve, constraints met and failed (App. E.1); human-written explanations can serve too (§3).
- **Pareto selection (§3.1, Alg. 2):** greedy best-candidate selection "often traps the optimizer in a local optimum" (§3.1, Fig. 6); sampling among per-example winners keeps diverse strategies alive.
- **Merge (App. D.1, Fig. 9, Algs. 3–4):** for two candidates with a common ancestor that evolved different modules, take each module's prompt from the descendant that changed it; the authors say "merge occurs sparsely", and runs invoke it at most 5 times (App. E.4).
- **Other uses (§5):** as inference-time search, the problems serve as both training and Pareto set, and the feedback function can retrieve manual sections matching compiler errors (§5.1). As adversarial search, the reward is inverted to lower pass@1 while the prompt must still state the task (§5.2).

## Results

- **Qwen3 8B (Tab. 1):** the authors report six-task aggregates GEPA 54.85 against GRPO 48.91, MIPROv2 47.84 and the unoptimized baseline 45.23. GEPA is ahead of GRPO on five tasks and behind on AIME-2025, 32.00 against 38.00 (§4 Obs. 1). GEPA used 1,839–7,051 rollouts per task against GRPO's 24,000; on IFBench it found its best prompts after 678 (Tab. 1 caption). The abstract claims "up to 35x fewer rollouts". Prompt optimizers learn faster than GRPO (Figs. 1, 12–15), also against full fine-tuning GRPO on a 2-hop HoVer program (Fig. 11).
- **GPT-4.1 Mini (Tab. 2):** reported aggregates GEPA+Merge 66.36 and GEPA 65.22, against TextGrad 59.14, MIPROv2 58.67, instruction-only MIPROv2 57.14, Trace 56.30 and baseline 53.03. Prompts optimized with Qwen3 8B score above every baseline optimized on GPT-4.1 Mini (§4 Obs. 6). GEPA is ahead of MIPROv2 on every task with both models (§4 Obs. 2).
- **Selection ablation (Tab. 3, Qwen3 8B, four tasks):** reported aggregates: Pareto selection 61.28 against always mutating the top candidate (SelectBestCandidate) 54.89 and a top-4 beam (BeamSearch) 53.95, baseline 48.84.
- **Merge:** best with GPT-4.1 Mini but below plain GEPA with Qwen3 8B (Tabs. 1–2); the authors attribute this to fixed budget-split and timing settings (§4 Obs. 5).
- **Prompts and generalization:** the authors report GEPA's prompts much shorter than MIPROv2's (§4 Obs. 4, Figs. 17–18), and its generalization gap lower, where Wan et al. had found few-shot examples generalizing better (§4 Obs. 2, Fig. 16).
- **Kernels (§5.1):** on NPUEval (kernels for AMD's XDNA2 neural processors), the authors report a GPT-4o agent refining up to 10 times reaching 4.25% mean vector utilization (NPUEval's score), 16.33% with retrieval, 19.03% with retrieval and MIPROv2, 30.52% with GEPA search (Fig. 7). On 35 KernelBench tasks (CUDA kernels), GEPA lifts GPT-4o's share of tasks with a kernel faster than PyTorch eager from close to zero as the budget grows (Fig. 8).
- **Adversarial (§5.2):** one learned instruction lowers GPT-5 Mini's pass@1 on AIME-2025 from 76% to 10%.
- **Cost:** Tab. 2's runs cost under $500 (App. E.3).

## Limits the authors state

- "The majority of GEPA's rollout budget is spent on validation, where scores are utilized solely for candidate selection" (§4 Obs. 1).
- Merge "lead to performance degradation when used with Qwen3 8B"; its hyperparameters were the same for both models, "leading to suboptimal choice for Qwen3 8B" (§4 Obs. 5).
- The kernel results "are early results and warrant further systematic study" (§5.1); §5.1 calls them "preliminary findings".

## Open problems and building blocks

  - A smaller validation set, or dynamically chosen validation subsets, to cut validation cost (§4 Obs. 1).
  - Adaptive choice of Merge's budget share and timing (§4 Obs. 5).
  - Inference-time search with domain-specific textual feedback for other code generation and domain adaptation tasks (§5.1).
- **Released:** the code (abstract).
- **To reuse it:** a program of LLM modules, a metric, ideally a feedback function returning text, training and validation sets (45–150 training examples here, App. E.1), a reflection LLM and a rollout budget; no weight access: it "works off-the-shelf on closed-source models" (Tab. 2 caption).
- **Beyond its domain:** the authors propose GEPA as inference-time search for code (§5.1) and adversarial prompts as "reusable stress tests and regression suites" and data for safety training (§5.2).

## On this site

- **Discussed in:** [Bringing compact models to frontier accuracy](#/challenges/compact_model_accuracy) · [Comparing LLM methods under noise](#/challenges/method_comparison_under_noise) · [The self-improving SQL ↔ text ↔ verify loop](#/challenges/sql_text_round_trip_loop)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/promptopt-evolve">promptopt-evolve</a><a class="tag sub" href="#/tags/promptopt-general">promptopt-general</a><a class="tag sub" href="#/tags/scaling-general">scaling-general</a></span>
