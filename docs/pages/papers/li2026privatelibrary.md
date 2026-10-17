# Learning from Execution: Self-Evolving Memory for Private-Library Code Generation

**Learning from Execution** · preprint 2026

Read: [PDF](https://arxiv.org/pdf/2604.24222) · [arXiv](https://arxiv.org/abs/2604.24222)  
Code: [MEMCoder](https://github.com/THU-Agent/MEMCoder)

<p class="notice">A summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Code generation against recently released Python libraries that stand in for an enterprise's private libraries, chosen to reduce "the chance that models have memorized their latest APIs" (§V-B); the authors report that even with every API document a task needs in the prompt, models still misuse single APIs, chain APIs wrongly and pick wrong solution strategies (§III, Tab. I, Fig. 1), and add to a RAG pipeline a memory of usage guidelines learned from running the generated code, with no weight updates (abstract; §IV).
- Memory at three levels, per API, per API pair (a data-flow graph) and per task, each entry holding passing code or an LLM-written guideline plus usage counts; after each task the code is run on the benchmark's unit tests, an LLM attributes a failure to APIs or API pairs and rewrites their guidelines, and task memories are ranked by similarity weighted by their past success (§IV-B–IV-D, Eq. 2). Evaluated on NdonnxEval and NumbaEval with three 7–8B open code models and two larger ones, on three retrievers, against Dynamic Cheatsheet and ReMem (§V).
- Evidence that documentation alone doesn't teach an unseen library: the authors report pass@1 below 60% on NdonnxEval even with oracle documentation (§III, Tab. I), and gains when lessons from test runs are kept in prompts. The memory is built from the benchmark's own tests while the evaluated tasks are processed in sequence (§VI-B, §VII-A ❶; no held-out split, our reading), and its guidelines are reused without being checked first (our reading of §IV-C–IV-D); the authors audit a sample of memory updates by hand after the fact (§VII-A ❸). Bears on [Learning a rarely seen DSL in prompts](#/challenges/unseen_dsl_in_prompts) and [Checking a memory across problems before it is reused](#/challenges/verified_memory).

## In plain words

Companies often code against internal libraries unseen in a model's training; the usual fix puts their documentation into the prompt. The authors argue this mainly tells the model which functions to call, with limited help on how to use them correctly (abstract; §I): even given every document a task needs, three models pass the tests in under 60% of single attempts on one benchmark, and documentation adds little on the other (§III, Tab. I). Their MEMCoder adds a memory: each generated program is run against unit tests, passing code and LLM-written notes on failures are kept for single functions, functions used together and whole tasks, and later prompts retrieve them; no weights change (§IV). With the memory built from the benchmarks' own tests as tasks are processed in turn (§VI-B; §VII-A), they report an average gain of 18.41 percentage points in single-attempt pass rate over the same lookup without memory, across three lookup methods, five models and two benchmarks (abstract; §VI-A), and beating two general memory methods (§VI-B). They present a "training-free self-evolving memory framework" (abstract), not a first.

## Background and terms

**Terms to know:** [retrieval-augmented generation (RAG)](#/glossary/retrieval-augmented-generation-rag) · [pass@k](#/glossary/passk) · [abstract syntax tree (AST)](#/glossary/abstract-syntax-tree-ast) · [dense retrieval](#/glossary/dense-retrieval) · [greedy decoding and temperature sampling](#/glossary/greedy-decoding-and-temperature-sampling) · [top-k and nucleus (top-p) sampling](#/glossary/top-k-and-nucleus-top-p-sampling)

**The paper's own terms:**
- **private-library code generation**: the task "where models must generate correct code by understanding and invoking APIs from previously unseen private libraries" (§I). In the experiments, recently released public libraries stand in for private ones (§V-B).
- **Usage Guidelines**: the paper's name for know-how about "how to use" a library, drawn from generated code and its execution feedback (§I); in memory, an LLM-written note on how an API (or API pair) was misused and what to avoid or correct (§IV-B).
- **Vanilla and Oracle settings**: Vanilla gives the model only the task requirement and starter code; Oracle injects "all API documents required by the current task", which removes retrieval errors (§III).
- **API-level, cross-API-level and task-level errors**: a wrong call of one API, or a hallucinated API (a name absent from the documentation); intermediate results flowing wrongly between APIs; a wrong overall solution strategy (§I; §III, Fig. 1).
- **Index, Content and Monitoring layers**: each memory entry's key for lookup, the text injected into the prompt, and its record of later usage outcomes (§IV-B, Fig. 2).
- **Freq, Pass, Fault, Bypass, Traj**: for API and API-pair entries, counts of uses, successes after use, failures blamed on the entry, failures not blamed on it, and the sequence of outcomes; task entries count successes and failures after reuse, with no Bypass (§IV-B).
- **error attributor and reflector**: two LLM roles after a failure; the attributor judges whether a given API or API pair caused it, the reflector summarizes the failure and revises that entry's guideline (§IV-D).
- **invalid API name warning**: a stored hallucinated API name with the documented APIs it appeared with (§IV-B, §IV-D).
- **Exec@k**: like pass@k, except that a sample counts as a success "if it runs to completion on the test inputs without raising any runtime exceptions" (§V-C).

In the glossary's terms, the memory is a form of [procedural memory](#/glossary/procedural-memory) (our bridge).

**Builds on:**
- Retrieval methods for private libraries, used as backbones (the base retrieval each run builds on): Naive RAG (Zan et al. [6]; Zhou et al., DocPrompting [7]), which retrieves API documents by the requirement; EpiGEN (Li et al. [8]), which retrieves APIs per subtask of the requirement; CAPIR (Ma et al. [18]), which also splits requirements and reranks candidate APIs (§II-A, §V-D).
- Self-evolving memory methods, used as baselines with the same Naive RAG module: Dynamic Cheatsheet (Suzgun et al. [19], [Dynamic Cheatsheet](#/papers/suzgun2025cheatsheet "Dynamic Cheatsheet: Test-Time Learning with Adaptive Memory (2025)")), run as DC-RS (Dynamic Cheatsheet with Retrieval & Synthesis), which keeps reusable strategies and code snippets and has an LLM curator write a task-specific cheatsheet; and ReMem (Wei et al., Evo-Memory [20]), which stores past requirements, outputs and feedback and follows a "Think-Act-Refine" loop (§II-B, §V-D).
- The benchmarks NdonnxEval and NumbaEval, from Zhang et al. [13] (§V-B).

## Problem and setting

- **Question:** can execution feedback kept as memory teach an LLM to use an unseen library better than documentation retrieval alone, without training (§I; §V-A)?
- **Benchmarks (§V-B):** NdonnxEval, 169 manually curated tasks for `ndonnx`, "an ONNX-based tensor library" (ONNX: an open format for machine-learning models; general words); NumbaEval, 187 tasks for `numba-cuda`, "for CUDA JIT programming" (compiling Python into GPU code at run time; general words). Tasks need "more than 4 APIs on average" and are "verified by over 9 unit tests". Both libraries were "released in 2024 and actively developed in 2025".
- **Models (§V-E, §V-F):** three local 7–8B code models (Qwen2.5-Coder-7B-Instruct, Llama-3.1-8B-Instruct, DeepSeek-Coder-6.7B-Instruct), sampled 10 times per task at temperature 0.7 and top-p 0.95; two larger models through APIs (Qwen3-32B, and GLM-4-Plus, a proprietary model of undisclosed size, §III), one sample at temperature 0. The embedding model is bge-base-en-v1.5; API retrieval returns the top 5 APIs unless otherwise specified.
- **Correct** means passing the benchmark's unit tests (pass@k, §V-C).
- **The memory's data:** tasks are processed "sequentially with execution feedback" (§VI-B "Settings"), and in the experiments that feedback "is obtained from benchmark test cases" (§VII-A ❶). A separate held-out split, the task order and the memory's starting state are not discussed.

## Approach

- **Loop (§IV-A, Fig. 2):** a forward phase (Memory-Driven Code Generation) and a backward phase (Feedback-Driven Memory Evolution).
  - API-level: indexed by each documented API name; holds the static documentation, the most recent successful code using the API, the current usage guideline, and invalid API name warnings.
  - Cross-API-level: a directed graph whose edge from one API to another records an observed data-flow or coordination relation, with the latest successful code slice (the excerpt that uses the pair) and a guideline for that pair.
  - Task-level: indexed by the requirement; a solved task stores its passing code, a failed one the failure guideline.
  - "To avoid unbounded growth", each API and each edge keeps only one successful code memory and one current guideline.
- **Generation (§IV-C, Eq. 1):** the base RAG method retrieves API documents; each retrieved API's code and guideline are appended to its documentation, with a warning for a hallucinated name that has "exceeded a predefined failure threshold" or appeared with a current candidate API; edges between two candidate APIs are injected. Task memories are ranked by the embedding similarity of requirements times a smoothed success rate, (Pass + 1)/(Pass + Fault + 2), so a new memory "starts with a neutral utility" (Eq. 2). In the experiments, tasks above similarity 0.8 are reranked and the top 2 injected (§V-F).
- **Evolution (§IV-D):** AST analysis extracts the APIs used and the data flow between them. On success, each API's code is stored or updated. On failure, the error attributor judges each documented API; for one judged the source, the reflector revises its guideline and Fault rises, otherwise it is marked bypass. New edges are created "only from successful executions"; on failure only existing edges are judged. Every completed task writes a task memory, and the task memories used update their counts.

## Results

- **Documentation alone (§III, Tab. I):** with temperature 0, Oracle documentation raises pass@1 by 21.30–32.60 points on NdonnxEval but every model stays below 60%; on NumbaEval it adds only 0.54–4.27 points (see Limits). Their Observation 1: "static documentation remains insufficient for reliable private-library code generation".
- **On top of RAG (RQ1, the first research question; §VI-A, Tabs. II–III):** MEMCoder improves every backbone on both benchmarks; "Across all evaluated settings" the authors report average gains of 18.41 points in pass@1 and 21.17 in Exec@1. The authors find that memory "often brings stronger improvements than improving retrieval alone": e.g. with Llama-3.1 on NumbaEval, Naive RAG with MEMCoder beats EpiGEN and CAPIR alone.
- **Against memory baselines (RQ2, §VI-B, Tabs. IV–V):** best in "all evaluated model-benchmark settings"; against the stronger of ReMem and DC-RS, pass@1 is 20.32 points higher and Exec@1 22.76 higher on average. The authors call the advantage "especially clear in executability".
- **Ablation (RQ3, §VI-C, Tab. VI; Llama-3.1 and GLM-4-Plus only):** removing any memory level lowers pass@1 in all four model-benchmark settings. Task memory is "especially important for the locally deployed model": with Llama-3.1 on NumbaEval, removing it drops pass@1 from 45.99% to 15.88%. With GLM-4-Plus on NumbaEval, removing API or cross-API memory costs more than removing task memory.
- **Cost (§VII-B, Fig. 4; Llama-3.1 and GLM-4-Plus):** inference tokens are "only slightly higher" than Naive RAG and ReMem and far below DC-RS. Counting memory evolution, MEMCoder adds about 4.09M tokens over Naive RAG on the two benchmarks, about $2.84 at GLM-4-Plus's price. Evolution "can be performed asynchronously", so user-facing latency is "mainly determined by inference latency", close to ReMem's and lower than DC-RS's.

## Limits the authors state

- MEMCoder "relies on executable feedback"; here it came from the benchmarks' test cases. The authors argue that tests are "often available" in test-driven development and that LLM-generated tests "can also provide additional execution signals", citing CodeT (which uses model-written tests to pick among code samples) (Chen et al. [21], [CodeT](#/papers/chen2022codet "CodeT: Code Generation with Generated Tests (2023)")) (§VII-A ❶).
- The proxy libraries "cannot fully represent all industrial private libraries", and "the latest models may have been exposed to the benchmark libraries or related data", which constrains model choice; "Broader validation on industrial private-library repositories remains future work" (§VII-A ❷).
- "inaccurate reflections may introduce noisy guidance": in 150 manually checked memory-evolution records from Qwen3-32B, error attribution was 87% (API) and 80% (cross-API) accurate, and guidelines 87%, 80% and 70% (API, cross-API, task), 80.8% on average, which the authors read as "generally reliable" (§VII-A ❸).
- Task memory "grows with the task stream"; the monitoring layer "provides a practical mechanism" to prune rarely used or low-utility task memories "when the memory becomes too large" (§VII-A ❹).
- The memory adds computation for retrieval, prompt injection and evolution (§VII-B).
- On NumbaEval, "many" tasks "already expose strong CUDA/Numba programming cues" in their requirements and starter code, so larger models can solve part of the benchmark "using general CUDA programming knowledge" without documentation (§III).

## Open problems and building blocks

- **Open:** none stated beyond the industrial validation listed under Limits (§VII-A ❷).
- **Released:** "The artifacts are publicly available in the GitHub repository" (§IX).
- **To reuse it:** executable feedback such as unit tests (§VII-A ❶); a base RAG retriever over the library's API documentation (§IV-A); an embedding model (bge-base-en-v1.5 here, §V-F); LLM calls for error attribution and reflection (§IV-D; the audited records are from Qwen3-32B, §VII-A ❸). It ran with 7–8B local models and two API models (§V-E).

## On this site

- **Discussed in:** [Comparing LLM methods under noise](#/challenges/method_comparison_under_noise) · [Prompt-space self-play judged by an engine](#/challenges/prompt_space_self_play) · [Which entries of a learned skill help](#/challenges/skill_entry_attribution) · [Learning a rarely seen DSL in prompts](#/challenges/unseen_dsl_in_prompts) · [Checking a memory across problems before it is reused](#/challenges/verified_memory)
- **Tags:** <span class="tags"><a class="tag" href="#/tags/compact">compact</a><a class="tag" href="#/tags/rarelang">rarelang</a><a class="tag sub" href="#/tags/harness-general">harness-general</a><a class="tag sub" href="#/tags/harness-promptopt">harness-promptopt</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/promptopt-context">promptopt-context</a><a class="tag sub" href="#/tags/promptopt-feedback">promptopt-feedback</a><a class="tag sub" href="#/tags/promptopt-general">promptopt-general</a></span>
