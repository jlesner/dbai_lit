# Unified Multi-Dimensional Benchmark for Complex Graph Reasoning in Large Language Models

**Unified Multi-Dimensional Benchmark for…** · preprint 2026

Read: [PDF](https://arxiv.org/pdf/2608.12391) · [arXiv](https://arxiv.org/abs/2608.12391)

<p class="notice">A summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- A semi-automatic framework in which an LLM writes composite graph tasks, their graph generators, reference solvers, graph-loading and evaluation scripts, with human-written tests for the solvers and an LLM quality filter, and a benchmark built with it that varies graph size (10 to 10,000 nodes), the number of composed seed tasks, explicit or story-like descriptions, graph in the prompt or in a file, and textbook or LeetCode-style task sources (abstract; §1; §3).
- Zero-shot chain-of-thought runs of open and closed LLMs in three modes: answering in text with the graph in the prompt, or writing a Python solve function that the evaluator runs, with the graph in the prompt or given only as a file path (§4; models in App. E.1); also retrieval from graph-algorithm knowledge bases, two graph-fine-tuned models against their bases, and graph neural networks on the scalar-output tasks (§4.2).
- Evidence on the engine-offloading premise along data size that separates writing code from where the data sits: the authors report average exact match at 10,000 nodes of 46.3 when the program loads the graph from a file, against 14.2 with the graph inline in the prompt and 10.4 for text reasoning (§4.1, Tab. 1; averages over six model families), with the two code modes close at 10 nodes, and attribute the file mode's remaining drop "mainly" to computational constraints, such as timeouts or memory limits (§4.1), though nearly all of its strict-score failures are missing benchmark instances. The reference answers come from LLM-written solver programs checked by human-written test cases (§3).

## In plain words

Graph problems (shortest paths, connectivity) are, the authors say, a promising test of LLM reasoning because instances can be generated at any size, which also helps against leaked test items. They argue that existing graph benchmarks rarely use very large graphs or multi-step tasks, are built largely by hand, and usually test either reasoning in text or writing code, not both (§1). They build GraphGym, a pipeline in which an LLM writes the tasks, graph generators, reference solvers and grading scripts, with people checking the solvers, and make a 202-task benchmark with it (abstract; §3). Their headline: as graphs grow from 10 to 10,000 nodes, the average share of exactly correct answers falls from 66.7 to 10.4 for reasoning in text, and from 77.9 to 14.2 for code when the graph is pasted into the prompt, but only from 77.7 to 46.3 when the code reads the graph from a file (§4.1, Tab. 1; averages over six model families). They present it as filling a gap: by their own rubric, "no prior benchmark simultaneously attains high scores on all dimensions" (App. B).

## Background and terms

**Terms to know:** [exact match](#/glossary/exact-match) · [data contamination](#/glossary/data-contamination) · [program-of-thought and tool-integrated reasoning](#/glossary/program-of-thought-and-tool-integrated-reasoning) · [retrieval-augmented generation (RAG)](#/glossary/retrieval-augmented-generation-rag) · [out-of-distribution generalization](#/glossary/out-of-distribution-generalization) · [Cohen's kappa](#/glossary/cohens-kappa) · [greedy decoding and temperature sampling](#/glossary/greedy-decoding-and-temperature-sampling) · [graph neural network (GNN)](#/glossary/graph-neural-network-gnn) (four variants, GCN, GAT, GIN and GraphSAGE, each trained per task, §4.2, App. E.1)

**The paper's own terms:**
- **Seed task**: an atomic graph problem used as a building block: 40 classical ones (e.g. shortest path) and 60 from LeetCode (§3; App. D.1).
- **Combo size** (also "composition depth"): how many seed tasks one composite task combines, 1–4 here (§3).
- **Composition pattern**: one of seven ways to combine seed tasks, e.g. sequential (one task's output is the next one's input), constrained (restrict the graph to a region, then solve inside it) and counterfactual (modify the graph, then recompute) (§3; App. D.1, Fig. 10).
- **Explicit / implicit description**: the task stated in graph terms, or as a real-world story that "must be mapped to the underlying graph problem" (§3).
- **Reasoning modes**: *textual* (the model answers in text, graph in the prompt); *coding-inline* (it writes a Python `solve` function, graph in the prompt); *coding-file* (the prompt gives only a file path and the program loads the graph) (§4; App. D.8).
- **Task source, CL vs OA**: classical textbook problems against problems from online assessment platforms (here LeetCode), which are "usually more open-ended and less likely to be covered by off-the-shelf graph libraries" such as NetworkX (a Python graph library) (§4.1). In the glossary's terms, LeetCode is an [online judge](#/glossary/online-judge).
- **EM and PC**: exact match uses type-aware equality (sets ignore order, floats allow a small tolerance); partial credit gives fractional credit (e.g. the Jaccard overlap of two sets: shared items over all items) and equals EM for single values (App. D.5). **Strict** scores count invalid outputs (e.g. syntax errors, context-window rejections, timeouts) as wrong; **lenient** ones leave them out; strict is the headline (App. E.2).
- **Inline (solve), inline (full), graph extraction (GE)**: by default only the model's `solve` function is run, on a graph the benchmark's script loads; "full" also requires the model's own code to parse the inlined graph; GE is the share of cases where that parse is exactly right (App. E.6, Tab. 22).

**Builds on:**
- Text benchmarks on classical graph tasks (NLGraph, GraphQA) and the LeetCode-based code benchmark GraphEval36K, whose limits motivate the paper (§1; App. C.1).
- GraphArena, a benchmark whose GNN protocol the authors follow (§4.2).
- GraphTeam (a multi-agent system that retrieves NetworkX documentation), whose NetworkX knowledge base is used for code-mode retrieval (§4.2).
- GCoder and GraphWiz, models fine-tuned for graph coding and graph question answering, evaluated against their bases (§4.2).

## Problem and setting

- **Questions:** how do the five dimensions (graph size, task complexity, task description, graph loading, task source) affect LLM graph reasoning (RQ1), and do retrieval, instruction tuning or task-specific GNNs help (RQ2) (§4)?
- **Models:** 16 LLMs from the DeepSeek, Gemma, Llama, Nemotron, OpenAI (o4-mini) and Qwen families, 15 of them in code mode (App. E.1; Tab. 12); zero-shot chain of thought, greedy decoding, one sample per prompt, and a maximum output of 8,192 tokens "Unless otherwise specified" (App. E.1).
- **Sizes:** 10 to 10,000 nodes in four steps, with "partial coverage at larger scales" because graph generation stops after 10 minutes (§3). In sparse graphs the inline prompt grows to roughly 117k tokens at about 10,000 nodes (§1; App. A, Tab. 2).
- **What counts as correct:** the output matches the label computed by the validated reference solver (§3). Generated programs run under a 60-second wall-clock budget (App. E.2).
- **Averages:** Tab. 1's family cells average their models (its caption); its Average row is the mean of the six families (our arithmetic).
- **Generator also evaluated:** DeepSeek-V3.2 generates the data (App. D.10) and is evaluated; the authors say evaluation prompts "do not expose the reference solver, construction prompts, or validation traces" (App. E.1).

## Approach

- **Five stages** (§3, Fig. 2; App. D):
  1. The LLM picks a composition pattern for sampled seed tasks, defines the new task, and writes graph-generation code that is run at the four sizes.
  2. It writes a Python reference solver; people write functional test cases, and failures go back to the LLM as "error messages and human feedback" until the code passes; the solver then computes the labels.
  3. It writes explicit and implicit descriptions, text and code question forms, and inline and file graph-loading scripts.
  4. It writes two evaluation scripts per task: one parses text answers, one runs the model's `solve` function in a template (App. D.5).
  5. An LLM judge scores clarity, graph suitability, naturalness and answer uniqueness from 1 to 5, and tasks scoring below 3 anywhere are removed; two human annotators scored 20 composite tasks to check the judge (§3; App. D.6–D.7).
- **Funnel and cost:** 400 candidate tasks shrink to 202, for $1.143 of API calls (App. D.10, Tab. 11).
- **Context-calibrated stress test** (App. E.3): six models in three pairs that share a context window; for 12 tasks, a binary search finds the largest graph whose inline prompt fills 10%, 25%, 50% or 98% of the window (Tab. 18).
- **RQ2 setups** (§4.2; App. E.8–E.10): retrieval from a NetworkX knowledge base (code) or a hand-built algorithm one (text); GCoder (reproduced by the authors) and GraphWiz against their bases; four GNNs trained per task on graphs of 10–50 nodes, on the 70 tasks with a single scalar answer.

## Results

- **Graph size** (§4.1, Finding 4.1, Tab. 1): "EM decreases monotonically with graph size across all evaluated model-mode combinations"; averages above. The authors attribute file mode's robustness to delegating graph reading "to offline code execution", and its remaining drop "mainly" to "computational constraints, such as timeouts or memory limits". Per-model averages are lower, in the same order (App. E.2, Tab. 13). For DeepSeek-V3.2 at 10,000 nodes, file-mode errors are nearly all timeouts, while inline and text errors are mostly context-window rejections (App. E.2 Finding 5, Tab. 17).
- **File against inline loading** (Finding 4.4, Fig. 4): every model does better with the file; average EM rises from 39.0 to 63.1.
- **Graph extraction** (Finding 4.5; App. E.6, Tab. 22): average GE is 54.5%, and requiring it lowers inline EM from 39.0 to 24.5.
- **Composition** (Finding 4.2): going from one to four seed tasks costs "about 20 points on average" (§1).
- **Descriptions** (Finding 4.3): implicit descriptions "introduce only modest additional difficulty".
- **Task source** (Findings 4.6–4.7, Fig. 5; App. E.7): OA tasks are harder than classical ones for every tested model; at 10 nodes, strong models are near-perfect on classical tasks but well below that on OA tasks.
- **Stress test** (App. E.3, Tab. 19): file mode keeps most of its 10-node accuracy even at 98% of the window; inline code collapses for most models, and some models' abrupt drops come "mainly", the authors say, from output truncation when they copy the graph into their code; text mode also degrades sharply.
- **Retrieval** (Finding 4.8, Fig. 6; App. E.8): it helps text reasoning but hurts code reasoning on average, helping code mainly on explicit classical tasks.
- **Fine-tuned models** (Finding 4.9, Fig. 7(d); App. E.9): GCoder is below its base "across all scenarios and graph sizes", and the authors find it often calls nonexistent NetworkX functions; GraphWiz gains on classical tasks but not on OA tasks.
- **GNNs** (Finding 4.10, Fig. 7(a–c)): on the 70 scalar tasks, average EM is 61.1 for LLMs writing code, 45.5 for GNNs and 39.3 for LLMs reasoning in text.
- **Labels and judge** (§3): in human validation "approximately 80% of the generated solver scripts are correct, but the remaining 20% still contain errors"; the LLM judge "achieves comparable agreement with humans" (Tab. 6).

## Limits the authors state

- "its effectiveness depends on the backbone LLM's capability to reliably generate and solve graph reasoning problems. Thus, standard local LLMs may be insufficient, and stronger close-source LLMs may be needed, though at modest token cost" (§5).
- GraphGym "is not specifically tailored for fine-tuning; its current scope is mainly limited to evaluation and supporting the generation of new benchmark data" (§5).
- Some instances are discarded, e.g. for program execution timeouts, and large sizes are only partly covered (§3); the tasks that survive at 10,000 nodes are "a slightly easier subset" (App. D.8).
- In the file-mode stress test, with a 60-second timeout, "a longer execution budget would likely further improve retention" (App. E.3).
- Qwen2.5-72B scoring below Qwen2.5-7B under stress "does not necessarily indicate stronger graph reasoning" for the smaller model, but more likely better format alignment (App. E.3).
- For GraphWiz, "part of the gain comes from better format adherence"; GCoder's checkpoint was not released, so the authors reproduced it (App. E.9).

## Open problems and building blocks

  - Output budgets: "Many models still lack reliable strategies for avoiding unnecessary token consumption, shortening intermediate reasoning, and prioritizing valid final-answer generation" (App. E.3).
  - Retrieval: "future graph reasoning retrieval methods should better handle open-ended task sources, implicit task descriptions, and the adaptation of retrieved knowledge to task-specific constraints" (App. E.8).
- **Released:** "Code and dataset will be published soon" (abstract); the full seed tasks are said to be in "our code repository" (§3).
- **To reuse it:** a strong generator LLM (DeepSeek-V3.2 here, App. D.10), people to write solver test cases (§3), and a Python environment that runs the generated code (App. D.5); combo size is "extensible to larger values" (§3); GNN training and the GCoder reproduction used one NVIDIA A6000 GPU (App. E.1).

## On this site

- **Discussed in:** [Benchmarks with checkable ground truth](#/challenges/checkable_benchmark_ground_truth) · [A gym of DSL tasks with answer keys made by code](#/challenges/dsl_gym) · [Reliability that holds with size, by handing the procedure to an engine](#/challenges/engine_offloading_with_size)
- **Tags:** <span class="tags"><a class="tag" href="#/tags/compact">compact</a><a class="tag" href="#/tags/gym">gym</a><a class="tag" href="#/tags/labels">labels</a><a class="tag" href="#/tags/offload">offload</a><a class="tag sub" href="#/tags/harness-general">harness-general</a><a class="tag sub" href="#/tags/llm-assist">llm-assist</a><a class="tag sub" href="#/tags/llm-method">llm-method</a></span>
