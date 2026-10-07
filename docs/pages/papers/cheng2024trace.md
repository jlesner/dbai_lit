# Trace is the Next AutoDiff: Generative Optimization with Rich Feedback, Execution Traces, and LLMs

**Trace / OptoPrime** · NeurIPS 2024

Read: [PDF](https://arxiv.org/pdf/2406.16218) · [arXiv](https://arxiv.org/abs/2406.16218)  
Code: [Trace](https://github.com/microsoft/Trace)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Optimizes general workflows (prompts, code, hyperparameters) from rich feedback such as console output or a user's responses (abstract) and execution errors (§1.2).
- The Trace library records the execution graph with a PyTorch-like API; the LLM optimizer OptoPrime reads the trace and the feedback to update the parameters (abstract, §4).
- The authors liken the execution trace to a back-propagated gradient (abstract); a GEPA baseline ([GEPA](#/papers/agrawal2025gepa "GEPA: Reflective Prompt Evolution Can Outperform Reinforcement Learning (2026)") Tab. 2).

## In plain words

AI systems built from LLM calls, tools and code have many hand-set parts (prompts, code, settings). The authors say designing them takes laborious engineering, and tuners judging them by one score are very inefficient for large spaces of choices (§1). They build Trace, a Python library that records how a program ran (which values came from which) and passes that record, with feedback on the output (an error message, a hint in words), to an optimizer; and OptoPrime, an optimizer that asks GPT-4 for new values of the marked parts (§1, §4). They report that OptoPrime is often competitive with specialized optimizers for each domain (abstract), e.g. "10% higher accuracy on BigBenchHard" (hard reasoning tasks) when optimizing a program in the LLM library DSPy, against DSPy's own prompt optimizer (§1). There Trace also tunes two code functions of the program (§5). They call their work "the first tractable algorithm for optimizing general computational workflows end-to-end" (§1).

## Background and terms

**Terms to know:** [textual gradient](#/glossary/textual-gradient) · [reinforcement learning](#/glossary/reinforcement-learning) · [Markov decision process](#/glossary/markov-decision-process) · [AutoDiff and back-propagation](#/glossary/automatic-differentiation-backpropagation) · [black-box optimization](#/glossary/black-box-optimization)

**The paper's own terms:**
- **computational graph**: a directed graph without cycles whose nodes are objects (tensors, strings, …) and whose edges say which inputs created a node; some inputs are trainable parameters (§2 "Preliminary").
- **execution trace**: "the sequence of operations and their execution results invoked when computing the output from a set of inputs", as a computational graph (§2 "Preliminary").
- **OPTO (Optimization with Trace Oracle)**: each iteration the optimizer picks parameters, and the Trace Oracle returns the execution trace plus feedback on one output (scores, gradients, hints in words, console messages). A fixed context, such as "Follow the feedback", says how to read the feedback. The graph can change between iterations (§2.1, Fig. 3).
- **minimal subgraph**: the part of the graph connecting the parameters to the output, with the parents of the nodes on those paths (§3.3 footnote); **MSP** (Minimal Subgraph Propagator) collects it (Alg. 2).
- **node, bundle, trainable**: `node` wraps a Python object as a graph node; `bundle` makes a function one operator (one step of the graph), recording its docstring and code; either can be `trainable`, so a value or a function's code becomes a parameter (§3.1).
- **memory**: OptoPrime's "basic memory module" of past parameter–feedback pairs (§4); **Trace NoMem** lacks it (§5.2); **Trace Masked** does not see the graph (§5.1).
- **meta-prompt**: here, the task LLM's prompt template (§5.3), not a prompt for a prompt-writing LLM.

**Builds on:**
- LLM-based generative optimizers (§1), among them APE ([APE](#/papers/zhou2022ape "Large Language Models Are Human-Level Prompt Engineers (2023)")), ProTeGi ([ProTeGi](#/papers/pryzant2023protegi "Automatic Prompt Optimization with 'Gradient Descent' and Beam Search (2023)")) and OPRO ([OPRO](#/papers/yang2023opro "Large Language Models as Optimizers (2024)")), the main baseline, which here uses past parameter–feedback pairs but not the trace (§5).
- DSPy ([DSPy](#/papers/khattab2023dspy "DSPy: Compiling Declarative Language Model Calls into Self-Improving Pipelines (2024)")), a library for LLM programs whose prompt optimizer COPRO is the §5.3 baseline; and TextGrad ([TextGrad](#/papers/yuksekgonul2024textgrad "TextGrad: Automatic 'Differentiation' via Text (2024)")), a concurrent framework that propagates text feedback (§5.5, App. H).
- Learning from Language Feedback (LLF-Bench, not listed here); OPTO is framed as its special case (App. B).

## Problem and setting

- **Question:** can an optimizer that sees the execution trace, not just a score, optimize a general, possibly non-differentiable workflow's parameters end-to-end (§1)?
- **Assumptions:** problems whose feedback and context "can be expressed compactly in text" (§2.1). Trace can trace most Python code "except for those modifying the content of an object reference in place" (§3.2).
- **Models:** GPT-4-0125-Preview (§5); GPT-4o-2024-08-06 in the TextGrad comparison (Tab. 2).
- **Solution concept:** Axiom 1 posits a verification oracle ("a human, a machine learning model, or a polynomial-time algorithm") that tells from parameter, context and feedback whether a parameter is a solution (App. F.1); App. F.2 assumes a solution exists.
- **Correct on BBH:** an evaluation function that "extracts a segment or does exact string matching", so the format must match too (§5.3, App. I.5).

## Approach

- **Using Trace** (§3.1, Fig. 2): mark parameters, run the workflow (building the graph), call `backward` with the feedback, then `step`.
- **Backward pass** (§3.3): Alg. 1 walks from the output toward the inputs; a propagator decides what each node passes to its parents: with MSP (Alg. 2), the node, its parents and the subgraphs its children sent; with gradients, it is back-propagation.
- **Thm. 1** bounds the pass's cost: for a graph with N nodes and maximum degree W, Algorithms 1 and 2 take time of order W·N²·log N and extra space (beyond the forward run) of order W·N (proof App. E.1). The authors say "in practice the difference is negligible" compared with back-propagation, but anticipate that computational issues "could arise" for "very large problems with millions of nodes in the minimal subgraph" (§3.3).
- **Thm. 2** says why passed-back feedback can't be fixed-size like a gradient: for generic computational graphs of N nodes, in the worst case, it needs a description of length growing at least in proportion to N to construct an improvement direction (a parameter change that improves the output) (proof App. E.2).
- **OptoPrime** (§4): it prints the minimal subgraph as a pseudo-code report (code, operator descriptions, values, feedback; Fig. 4) and asks the LLM in one query, with a ReAct-CoT style prompt (reasoning, answer, suggestion; App. G.2), for new values; if a suggestion can be extracted, the parameters are updated.
- **Joint updates:** the authors argue that per-parameter updates, "akin to co-ordinate descent", which they say TextGrad employs, can be sub-optimal for many problems, with an xor example (App. H).

## Results

- **Battleship** (§1.2, Fig. 1): Trace writes an agent's two functions from hit/miss feedback, rewarded by the share of ship squares hit. "The reward plateaued at 60%", put down to chance (App. I.2).
- **Numerical** (§5.1, Fig. 5a): random arithmetic graphs, feedback "The output should be <larger/smaller>", 30 trials: "Trace is able to match the best-in-class Adam" (a gradient optimizer), while Trace Masked struggles.
- **Traffic lights** (§5.2, Fig. 5b–c): two green-light durations in a simulator. Trace is "quickly competitive with the SCATS heuristic, whereas OPRO is not" (SCATS: a traffic-control heuristic), and "memory is crucial". §5.2 blames GP's and PSO's poor curves on too few iterations.
- **Big-Bench Hard** (§5.3, Tab. 1): 23 tasks (12 language, 11 algorithmic); Trace trains on 15 examples and validates on 5, one epoch (App. I.5). Trace tunes the prompt template plus prompt-building and answer-extraction functions; COPRO tunes the prompt. Over all tasks without chain of thought, Trace scores 59.5 against 55.3 for DSPy with COPRO and 41.6 for plain DSPy; with chain of thought, 78.6 against 71.6 (Tab. 1). Trace goes beyond COPRO "especially on algorithmic tasks" (§5.3).
- **Robot control** (§5.4, Fig. 6, App. I.6): controller code for a simulated robot arm (LLF-Bench Meta-World: Reach, Pick-place, Push), 30 one-rollout iterations, 10 seeds. "OptoPrime is clearly the top-performing optimizer, especially the version with memory"; OPRO, proposing one candidate per iteration, solves Reach then degrades; masking the trace "leads to a significant decline in performance and stability".
- **TextGrad** (§5.5, Tab. 2): on TextGrad's pipeline (MMLU and GPQA exam questions, two BBH tasks, GSM8K math), 5 seeds: "all these algorithms achieve similar success rates", and OptoPrime is "about 3x faster wall-clock time than TextGrad", one LLM call per step against calls linear in graph size.

## Limits the authors state

- "the OptoPrime optimizer is preliminary": "not a provably optimal algorithm and uses more tokens than OPRO", though in their experiments OPRO does not improve "even when given a large token budget" (§6).
- Stateful functions that modify their state in place can't be represented as a DAG without modification; distributed or parallel workflows (§6) and recursive bundle operators (App. A "What can be traced?") don't fit the current implementation.
- The LLM's "debugging ability and context limits" "crucially determine the scale of problems that we can practically address today" (§6).
- Without trace feedback beyond reward signals, "information-wise, OPTO is no easier than black-box problems"; the current OptoPrime "does not handle non-textual content" (App. A "Where do we get rich feedback?").
- With the current design, Trace and OptoPrime "does not replace classical AutoDiff" for large-scale numerical problems; values not compact in text prevent "optimizing neural network weights, or reasoning with large, stateful objects like a database"; OptoPrime "likely cannot handle large graphs (with thousands of nodes) at the moment"; the authors "do not know how to rigorously define the concept of step size"; LLMs don't always follow parameter constraints given in text (App. A "How to design adaptive optimizer…").
- In traffic control Trace "consumes extra overhead compared to other methods", materializing the graph and sending effectively a longer prompt than OPRO (§5.2).
- Meta-World success "varies largely across random seeds"; without an added line of task context, "none of the LLM-based optimizers works in the experiments" (App. I.6).
- Some DSPy 0.0 scores arise because DSPy's output doesn't match the evaluation's expected format (Tab. A.2 caption). TextGrad's published numbers "cannot be reproduced exactly" (§5.5 footnote).

## Open problems and building blocks

- **Open:** feedback design, likened to loss design, both "open research questions"; token-efficient generative optimizers (§6). §7: LLM-plus-search optimizers; generality against task-specific context ("an open question"); propagators for very large graphs; OPTO theory; non-textual feedback; optimizers reasoning about counterfactual parameter settings, for "a divide-and-conquer approach to OPTO". Which subsets of OPTO are efficiently solvable (App. F.3). What and how to trace; graph simplification; "projecting" proposals onto feasible sets (App. A). Workflow analogues of AutoDiff's forward mode, checkpointing and truncated back-propagation (App. B). Optimizers that "blend OptoPrime and TextGrad" (App. H).
- **Released:** the Trace library (abstract); code reproducing all experiments (NeurIPS checklist "Open access to data and code"); "no datasets or models" (checklist "New Assets").
- **To reuse it:** a Python workflow decorated with `node` and `bundle`; text feedback and context (§2.1); an OpenAI API key (checklist "Experimental Result Reproducibility"); a "standard PC with 16 GB RAM" (§5).
- **Beyond its domain:** the authors frame neural-network training, reinforcement learning, code debugging and multi-agent collaboration as OPTO problems (§2.1, App. C).

## On this site

- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/promptopt-context">promptopt-context</a><a class="tag sub" href="#/tags/promptopt-feedback">promptopt-feedback</a><a class="tag sub" href="#/tags/promptopt-general">promptopt-general</a></span>
