# Recursive Language Models

**RLM (Recursive Language Models)** · preprint 2025

Read: [PDF](https://arxiv.org/pdf/2512.24601) · [arXiv](https://arxiv.org/abs/2512.24601)  
Code: [rlm](https://github.com/alexzhang13/rlm)

<p class="notice">A summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- An inference scaffold that stores a long prompt as a variable in a Python REPL and lets the model inspect it with code and call itself, or a smaller model, on slices it builds in loops; only short previews of each step's output return to the model (abstract; §2, Alg. 1; smaller sub-call model: §3.2).
- GPT-5 and Qwen3-Coder-480B-A35B at recursion depths 0–3 against the base model, a compaction agent, CodeAct and the coding agents Claude Code and OpenCode on four long-context tasks (§3.2, Tab. 1), and GPT-5 against its RLM as input length grows on three tasks whose processing complexity is "roughly constant, linear, and quadratic" in it (§3.1; §4 Obs. 3, Fig. 1); also fine-tunes Qwen3-8B on filtered trajectories of a larger model and RL-trains Qwen3-4B on MRCRv2 (§4, Fig. 3; App. A).
- Evidence that handing the data to an interpreter, with the model writing code over it, holds where reading the data in context fails as the task's work grows with input size: the authors report base GPT-5 at F1 ≤ 0.1% on their quadratic OOLONG-Pairs against 58.0% for the RLM at recursion depth 1 (§4 Obs. 1, Tab. 1). The engine is open-ended Python with LLM sub-calls, not a DSL with fixed semantics, and the authors report that models without enough coding ability "struggle as RLMs" (App. B).

## In plain words

LLMs read limited text at once and, even within that limit, tend to answer worse as prompts grow; the authors ask whether general-purpose models can handle inputs "by orders of magnitude" longer (§1). Their Recursive Language Model (RLM) stores the prompt as a variable in a Python session; the model writes code that reads pieces of it and calls itself or a smaller model on pieces it picks, seeing only short previews of each step's output (§2). With GPT-5 and an open coding model on four long-input tasks, they report that RLMs can process inputs more than an order of magnitude beyond the model's limit, with median gains on GPT-5 of 26% over summarizing the context as it fills ([context compaction](#/glossary/context-compaction)), 130% over a code-running agent with sub-calls and 13% over the coding agent Claude Code (run on Claude Opus 4.1, §3.2), at comparable cost (abstract). An 8B model fine-tuned on RLM runs, "the first natively recursive language model" (§1), beats the same base model run as an RLM by a median 28% over the four tasks (abstract; §1).

## Background and terms

**Terms to know:** [agent harness](#/glossary/agent-harness) (the paper says "scaffold") · [context compaction](#/glossary/context-compaction) · [test-time scaling](#/glossary/test-time-scaling) (the paper says "inference-time scaling") · [Distillation into compact models](#/glossary/distillation) · [rejection sampling](#/glossary/rejection-sampling) · [RL with verifiable rewards (RLVR)](#/glossary/rl-with-verifiable-rewards-rlvr) · [REPL (read-eval-print loop)](#/glossary/repl-read-eval-print-loop) (the RLM sets the prompt "as the value of a variable" in one, §1) · [needle in a haystack (NIAH)](#/glossary/needle-in-a-haystack-niah) (needles generally constant as length grows, §3; §3.1) · [context rot](#/glossary/context-rot) (§1, citing [Context Rot](#/papers/hong2025contextrot "Context Rot: How Increasing Input Tokens Impacts LLM Performance (2025)"))

**The paper's own terms:**
- **RLM**: an "inference-time scaffold" around a model that "treats the user prompt as part of the environment" (§2, Alg. 1).
- **Root model and sub-calls**: the root model writes the code; a sub-call, made from that code, runs a model (sub-LM) or a full RLM (sub-RLM) on a prompt the code builds (§2; App. C.1).
- **Recursion depth**: a maximum depth of 0 allows no sub-calls, 1 allows sub-calls to LLMs, above 1 sub-calls to RLMs; written RLM(model, depth=N), depth 1 when not stated (§3.2).
- **Symbolic handle** and **symbolic recursion**: the model reaches the prompt through a variable instead of copying it into its context, and code in the environment calls the model on programmatically built transformations of it, e.g. inside loops (§2). Alg. 2 is the contrasting "standard (poor)" scaffold (§2).
- **Processing complexity**: how a task's needed work grows with prompt length, "roughly constant, linear, and quadratic" for their three scaling tasks (§3; §4 Obs. 3).
- **Context offloading**: a coding-agent variant whose context is put in a file (§3.2).

**Missing glossary terms:** none.

**Builds on:**
- Reasoning models, the authors' stated inspiration (§1).
- Context compaction, "the most popular general approach" (§1); their compaction baseline follows Context Folding, ReSum and MemAgent (§3.2).
- CodeAct, an agent that "can execute code inside of a ReAct loop" ([ReAct](#/glossary/react): [ReAct](#/papers/yao2022react "ReAct: Synergizing Reasoning and Acting in Language Models (2023)")), which they "compare directly to"; unlike an RLM it gives the prompt to the model directly (§3.2).
- Methods that let the LM choose its sub-calls (ViperGPT, THREAD, ReDel, Context Folding, AgentFold), which they say can't handle inputs longer than the base model (§6); STaR ([STaR (Self-Taught Reasoner)](#/papers/zelikman2022star "STaR: Bootstrapping Reasoning With Reasoning (2022)")) and Quiet-STaR, bootstrapping methods (training a model on its own successful reasoning) they hypothesize could train RLMs (§7).

## Problem and setting

- **Question:** can a general-purpose LLM, without task-specific methods, handle prompts far beyond its context window, and do better even on shorter ones (§1; abstract)? The authors frame this "through the lens of inference-time scaling" (abstract).
- **Tasks (§3.1):** S-NIAH, 50 single-needle tasks after RULER (a long-context benchmark); BrowseComp-Plus (1K documents), 150 [multi-hop](#/glossary/multi-hop-question-answering) deep-research questions over 1,000 documents holding the evidence, scored as percent correct; OOLONG's `trec_coarse` split (questions with semantic labels), 50 tasks that label and aggregate nearly every entry; OOLONG-Pairs, the authors' 20 queries over pairs of entries, scored by [F1](#/glossary/f1-score) (App. D.1 lists them); LongBench-v2 CodeQA, multiple-choice questions about a code repository. Inputs reach 6M–11M tokens (BrowseComp-Plus, Tab. 1); the scaling runs go from 2^13 to 2^20 tokens (Fig. 1).
- **Models and baselines (§3.2):** GPT-5 with medium reasoning (GPT-5-mini for sub-calls) and Qwen3-Coder-480B-A35B, "a frontier open model" (§1); the base model; CodeAct with a [BM25](#/glossary/bm25) retriever or with sub-calls; a compaction agent (GPT-5-nano summarizes in the GPT-5 runs); the coding agents OpenCode and Claude Code (with Claude Opus 4.1), each with and without context offloading.
- **Fixed prompts:** one system prompt per method across tasks, with small model-specific edits (App. C.1).
- Repeated runs, or intervals on the scores: not discussed. All LM calls are blocking and sequential (§4).

## Approach

- **The loop (§2, Alg. 1):** the REPL starts with the prompt in a variable and a function that calls a sub-RLM. The root model first sees only constant-size metadata (length, a short prefix, how to access it). Each turn it writes code; the REPL runs it, and only metadata about printed output joins the model's history. The loop stops when the variable `Final` is set; in principle each root turn "can launch arbitrarily many sub-calls" (footnote 2).
- **Three design choices** missing from Alg. 2: the symbolic handle, an answer built in a variable (so not capped by the model's context window), and symbolic recursion, which can launch work growing with the prompt's length or its square (§2).
- **Implementation:** a Python REPL with sub-calls as modules and truncated printing (§2); LongCoT-mini (compositional problems with interdependent subproblems) runs use a fork, Prime Intellect's `rlm-harness`, for higher-throughput sandbox evaluation (App. C.3).
- **RLM-Qwen3-8B (App. A):** RLM(Qwen3-Coder-480B-A35B) runs on English LongBenchPro tasks (a bilingual long-context benchmark) ("a small, unrelated set of tasks", §4 Obs. 6); runs scoring exactly 0.0 or ending after one turn are dropped; each root turn becomes one fine-tuning example; over-long turns are dropped and small template mistakes (e.g. in final answers or REPL calls) fixed programmatically; then Distillation into compact models into Qwen3-8B, which the Fig. 3 caption calls "rejection fine-tuning". The authors' rationale: a good sub-call model is "roughly similar" to a general reasoning model, so training can focus on the root (§3.2).
- **MRCRv2 run (App. A):** Qwen3-4B-Instruct-0527 as RLM(depth=1) trained by RLVR on MRCRv2's 32k–64k-token, 2-needle split (a task to count and reproduce passages, §4 Obs. 6), evaluated on its 512K–1M-token, 8-needle split.

## Results

- **Main comparison (§4, Tab. 1):** on OOLONG-Pairs both base models score F1 ≤ 0.1%, against 58.0% (GPT-5) and 23.1% (Qwen3-Coder) for RLM(depth=1) (§4 Obs. 1). Deeper recursion gives GPT-5's best OOLONG and OOLONG-Pairs scores (depth 3), while for Qwen3-Coder depth 0 is best on CodeQA (Obs. 2) and depths above 1 "perform worse on average", which the authors blame on its syntax errors spreading to sub-calls (§5, Fig. 4b). OpenCode with context offloading has GPT-5's best BrowseComp-Plus score (Tab. 1); "The REPL is necessary for handling long inputs" (Obs. 2).
- **Input length (§4 Obs. 3, Fig. 1):** GPT-5 degrades faster on more complex tasks, the RLM more slowly; the authors report that beyond 2^14 tokens the RLM "consistently outperforms GPT-5". RLM costs grow with task complexity but stay in the same order of magnitude as GPT-5's (Fig. 16).
- **Cost (§4 Obs. 4; App. F.2):** average cost comparable to or below most baselines; "the median RLM run is cheaper than the median base model run, but more expensive on average due to outlier trajectories where the RLM struggles to find an answer" (Fig. 11); costs and runtimes are long-tailed (Figs. 12–15).
- **Long reasoning (§4 Obs. 5, Tab. 2):** on LongCoT-mini, GPT-5.2 (the best model in the LongCoT paper) solves 38.7%, RLM(GPT-5.2) 50.6% and, with decomposition hints, 65.6%; without hints the RLM scores below the base model on the MATH and CS splits. Similar hints, without the sub-calling details, lower the base model's overall score (App. C.3, Tab. 3).
- **Training (§4 Obs. 6, Fig. 3):** RLM-Qwen3-8B beats Qwen3-8B as an RLM on all four tasks, with lower cost and runtime (Fig. 6); the RL-trained Qwen3-4B generalizes from the short MRCRv2 split to the long one (Fig. 3b, which also marks the score of Gemini 3.1 Pro, a 1M-context frontier model).
- **Behaviour (§5, Fig. 4):** example trajectories in the system prompt improve OOLONG results and the first decomposition, "even if the example is unrelated to the actual task" (Fig. 4a).
- **BrowseComp-Plus scaling (App. D.2, Fig. 7):** on 20 queries with growing document counts, only the iterative methods (RLM, ReAct) "maintain reasonable performance at 100+ documents".

## Limits the authors state

- Evaluations on "more difficult and natural long-context processing tasks" and guardrails for RLMs "both remain highly under-explored"; RLMs "may lead to unintentional side-effects like exploding sub-call costs, which we leave for future work to solve" (§7).
- Asynchronous sub-calls and sandboxed REPLs could cut runtime and cost "but further contribute to this complexity" (§7); without asynchrony RLMs are slow (App. B).
- Experiments use existing frontier models; training evidence is "initial", on Qwen3-8B (§7), from an "exceedingly simple training recipe" (App. A).
- App. B (some observations "based on small samples of results"): one system prompt across models "can be problematic"; "Models without sufficient coding capabilities struggle as RLMs", e.g. Qwen3-8B; thinking models run out of output tokens; depending on the model, telling a final answer from a thought "is brittle", e.g. a plan returned as the answer.
- "RLMs often make non-optimal choices": Qwen3-Coder discarded an answer it had built and returned a wrong one (App. E, E.2).
- The first decomposition attempt "is important for overall performance", though RLMs frequently recover from a wrong one (§5).

## Open problems and building blocks

- **Open:** the authors "call on future work to investigate training native RLMs much more thoroughly", and expect larger model sizes, more and more varied examples and more "(ideally on-policy and online) rollouts" (runs sampled from the model being trained, during training) to be needed "to maximize the potential of RLMs" (App. A); they hope training native RLMs "can be treated as a new axis of scale" (§7; similarly §8).
- **Released:** code (abstract). The OOLONG-Pairs queries are printed (§3.1, App. D.1) and the system prompts given (App. C.1).
- **To reuse it:** a model with enough coding ability (App. B); a Python REPL; model-specific prompt edits (App. C.1). The 8B training took 48 H100 hours (App. A).
- **Beyond its domain:** the authors conclude RLMs are "an effective task-agnostic paradigm for both long-context problems and general reasoning" (§8; LongCoT-mini, §4 Obs. 5).

## On this site

- **Discussed in:** [Reliability that holds with size, by handing the procedure to an engine](#/challenges/engine_offloading_with_size)
- **Tags:** <span class="tags"><a class="tag" href="#/tags/compact">compact</a><a class="tag" href="#/tags/offload">offload</a><a class="tag" href="#/tags/transfer">transfer</a><a class="tag sub" href="#/tags/harness-general">harness-general</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/rlvr-general">rlvr-general</a><a class="tag sub" href="#/tags/scaling-general">scaling-general</a></span>
