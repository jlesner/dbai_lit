# Maestro: Joint Graph & Config Optimization for Reliable AI Agents

**Maestro** · preprint 2025 (RELAI technical report)

Read: [PDF](https://arxiv.org/pdf/2509.04642) · [arXiv](https://arxiv.org/abs/2509.04642)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Jointly searches an agent's graph (modules, flow) and each node's configuration.
- Reflective textual feedback from traces prioritizes edits under a rollout budget.
- Structure search beyond prompts, evaluated on two of GEPA's benchmarks (HotpotQA, IFBench; §5.1–5.2) and two in-house agents (§5.3–5.4).

## In plain words

An LLM agent has two layers of design choices: its graph (which modules exist and how information flows) and each module's configuration (model, prompt, tools, settings). The authors argue that most optimizers tune only the configuration, holding the graph fixed, "leaving structural failure modes unaddressed" (abstract). They describe Maestro, a "beta version" (§1) of an optimizer by authors at RELAI.ai, which alternates between tuning configurations and proposing small graph edits, guided by scores and by written feedback on the agent's runs; its "technical details remain proprietary" (§4 footnote). With the model fixed to GPT-4.1 mini and graph and prompts optimized together, it reports 72.33% on HotpotQA (multi-document questions) against 69.00% for the best baseline, the prompt optimizer GEPA, its score copied from GEPA's paper (Fig. 4), after 2,220 agent runs against GEPA's "over 6000" (§1). On two applications it reports "large gains" (abstract), such as a financial interviewer's complete-interview rate rising from 2% to 92% with graph and configuration both optimized (Fig. 7). The authors present the advance as surpassing "leading prompt optimizers" (abstract), not as a first.

## Background and terms

**Terms to know:** [reflective prompt optimization](#/glossary/reflective-prompt-optimization) · [coordinate ascent](#/glossary/coordinate-ascent) · [multi-hop question answering](#/glossary/multi-hop-question-answering) · [retrieval-augmented generation (RAG)](#/glossary/retrieval-augmented-generation-rag) · [LLM-as-a-judge](#/glossary/llm-as-a-judge) · [GRPO](#/glossary/grpo)

**The paper's own terms:**
- **graph**: "which modules exist and how information flows" (abstract); formally a directed graph whose nodes "encapsulate capabilities" (LLM invocation, retrieval, tool calls, memory modules, validators) and whose edges define information flow and control logic (§1, §2).
- **configuration**: the settings of each node, "models, prompts, tools, control knobs" (abstract), plus the parameters of the edge adapters and merge operators (§2).
- **holistic optimization**: tuning "all facets of an AI agent" in an integrated way (§1); here, searching graph and configuration jointly.
- **C-step and G-step**: the two alternating updates of §4, a configuration update with the graph fixed, and a graph update over small structural edits (Fig. 2).
- **reflective feedback**: "non-numeric" feedback that Maestro extracts "from execution traces and evaluation rationale" to guide proposals in both steps (§4), e.g. evaluator rubrics or free-form critiques (§1).
- **rollout**: one run of the agent during the search; the formulation bounds "the (expected) number of training rollouts the search procedure expends" (§2.2).
- **context gating**: controlling "which intermediate artifacts are visible to which nodes" (§1).
- **evaluation score**: the benchmark's metric averaged over test cases (§5.1.1, §5.2.1), defined per benchmark in the next section.
- **Bridge to the glossary** (ours): in the glossary's terms, the graph plus configuration covers much of an [agent harness](#/glossary/agent-harness), with model choice added.

**Builds on:**
- GEPA (Agrawal et al., 2025; [GEPA](#/papers/agrawal2025gepa "GEPA: Reflective Prompt Evolution Can Outperform Reinforcement Learning (2026)")), a reflective prompt optimizer, and GEPA+Merge (GEPA with its crossover of modules from two candidates, per GEPA's paper): "We follow exactly the evaluation protocol of GEPA" for both benchmarks, with its splits, initial agents and evaluators, and its reported scores as baselines (§5.1.1, §5.2.1, §5.1.2).
- MIPROv2 (Opsahl-Ong et al., 2024; [MIPRO (shipped in DSPy as MIPROv2)](#/papers/opsahlong2024mipro "Optimizing Instructions and Demonstrations for Multi-Stage Language Model Programs (2024)"), a DSPy optimizer of instructions and few-shot examples) and GRPO (Shao et al., 2024; [DeepSeekMath](#/papers/shao2024deepseekmath "DeepSeekMath: Pushing the Limits of Mathematical Reasoning in Open Language Models (2024)")): with GEPA, the configuration-only optimizers of §3, which keep the graph fixed.
- MAAS (Zhou et al., 2025; not listed here), which "takes an important step by coupling prompt and topology search" but has a restricted search space, and Reflexion (Shinn et al., 2023; [Reflexion](#/papers/shinn2023reflexion "Reflexion: Language Agents with Verbal Reinforcement Learning (2023)")), verbal self-critique on a fixed architecture (§1).
- DSPy (Khattab et al., 2023; [DSPy](#/papers/khattab2023dspy "DSPy: Compiling Declarative Language Model Calls into Self-Improving Pipelines (2024)")), a framework for LM pipelines: the HotpotQA agent is implemented in it (§5.1.1); Maestro is said not to require agents "to be rewritten in a specific DSL" (§1).

## Problem and setting

The question: can searching an agent's graph and configuration together fix failures that configuration tuning alone cannot, and beat prompt optimizers on their own benchmarks (§1)?

- **Formulation (§2).** An agent is a directed graph; each node is a stochastic function of its inputs and its configuration (e.g. model, prompt, tool set, decoding hyperparameters). Edges carry adapters (e.g. templates, serializers); a node merges its incoming inputs; conditional edges model routing. A DAG (directed acyclic graph) runs in topological order; cycles can be handled by unrolling for a fixed number of steps "or use a fixed-point operator if well-defined" (§2).
- **Objective (§2.2).** Maximize the expected metric over tasks, subject to an average resource-cost bound, a structure-complexity bound and a bound on training rollouts.
- **HotpotQA and IFBench.** The model is fixed to `gpt-4.1-mini-2025-04-14`, and only the prompts are optimizable in config-only mode (§5.1.1, §5.2.1). Baselines are the scores "evaluated and reported by" GEPA's paper (§5.1.2, §5.2.2).
- **HotpotQA (§5.1.1).** Multi-hop questions over several documents; 150 training, 300 validation, 300 test examples, following GEPA. The agent is GEPA's two-hop retrieval agent (two retrievals, two summarizers, a second-hop query writer, an answer writer). The score per question is 0 or 100%, whether the answer matches a ground-truth answer; GEPA's feedback module (which relevant documents remain to be retrieved) is the textual feedback.
- **IFBench (§5.2.1).** A benchmark of "precise instruction following" on "verifiable" constraints; training and validation from the IF-RLVR training data, 150/300/294 examples. A re-implemented two-stage agent (answer, then rewrite to satisfy constraints). The score is the fraction of constraints followed; the failed constraints' descriptions are the textual feedback.
- **Interviewer agent (§5.3.1).** A financial interviewer must cover a question tree with 5 branches (Tab. 1). 60 simulated personas (50 training, 10 test), 5 trajectories per test persona, 50 test cases; an `o4-mini` LLM judge scores each interview 0 or 100% and explains its verdict. Optimizable: the model (one of three OpenAI models) and the system prompt.
- **RAG agent (§5.4.1).** A financial question-answering agent limited to Apple, Alphabet and Nvidia, with a semantic-search tool over their 10-K filings and a stock-price tool. Its benchmark has four categories: factual, quantitative stock analysis, out-of-scope and adversarial queries (Tab. 2). Optimizable: the model, the number of retrieved chunks (1–6) and the system prompt; scored by "a custom LLM-based judge that uses per-sample rubrics" (§5.4.2).

## Approach

- **Search space (§1).** It "admits" non-sequential DAGs with conditional routing and retries, persistent or global state with read/write policies, context gating, and multiple models and tools per node with tunable hyperparameters.
- **Two alternating steps (§4, Fig. 2)**. The C-step tunes the configuration under a rollout budget, with the graph held fixed. The G-step picks a graph from a local neighbourhood of structural edits ("add/remove/rewire nodes or edges, create/attach tools, change module types, etc."), within an edit-distance limit, scoring each with a fast configuration warm-start (e.g. "inheritance from" the new configuration "plus brief tuning") and a budget-aware estimate on mini-batches. "At a high level", the paper calls this a "block-coordinate" scheme (§4).
- **Reflective guidance (§4).** Non-numeric feedback from traces and evaluator rationales guides proposals in both steps; the authors say this avoids needing the agent to be differentiable.
- **Acceptance (§4).** A new graph and configuration are accepted when "a guarded improvement criterion holds", for example when their estimated score is at least the old graph's (with the new configuration) plus a non-negative tolerance; the authors say this "yields a monotone sequence of estimated objectives under fixed budgets and constraints".
- **Framework agnostic (§4).** Utilities register optimizable configurations and track agents' internal activities; these "can, in principle, be used by any framework".
- **Edits it found (§5).** HotpotQA: an entity-extraction step that gives the second-hop query writer "more concrete handles" (§5.1.2, Fig. 3). IFBench: a `validate_constraints` module that triggers one more rewrite "if needed" (§5.2.2, Fig. 6). Interviewer: a state variable `branches_done`, fed to the model every turn and updated when it emits a branch-complete marker (§5.3.2, Fig. 8). RAG: new tools for computations such as mean, standard deviation and percentage growth, which in the initial design the LLM handled itself (§5.4.2, Fig. 10).

## Results

Each result is the authors' claim.

- **HotpotQA (§5.1.2, Fig. 4)**. Reported baselines: initial agent 38.00%, MIPROv2 58.00%, GEPA 69.00%, GEPA+Merge 65.67%. Maestro reaches 70.33% optimizing prompts only, "using as few as 240 rollouts", and with the new graph 72.00% at 420 and 72.33% at 2,220 rollouts; GEPA's budget is "over 6000 rollouts" (§1).
- **IFBench (§5.2.2, Fig. 5)**. Reported baselines: MIPROv2 49.15%, GEPA 52.72%, GEPA+Merge 55.95%. Prompts only: 56.12% at 700 rollouts, "marginally better than GEPA+Merge"; with the new graph: 59.18% at 900 rollouts, against GEPA's and GEPA+Merge's peak "with more than 3000 rollouts".
- **Interviewer (§5.3.2, Fig. 7)**. The initial agent "fails catastrophically" with 1 complete interview out of 50 (2%); configuration-only optimization reaches 66% and graph plus configuration 92%.
- **RAG agent (§5.4.2, Fig. 9)**. Judge scores: initial 39.1, configuration only 58.9, graph plus configuration 80.4. In the graph run, the graph edits were applied first and configuration optimization then continued.

## Limits the authors state

- The report introduces "a beta version" of Maestro (§1); §4 "presents the general formulation of the Maestro optimizer; technical details remain proprietary" (§4 footnote).
- "global optimality is not guaranteed in the mixed discrete–continuous, nonconvex setting" (§4).
- Its registration utilities "can, in principle, be used by any framework" (§4).

## Open problems and building blocks

- **Open:** None stated.
- **Released:** Nothing stated as code or data. The initial and optimized prompts, configurations and graph edits of all four agents are printed in App. A (§5.1.2, §5.2.2, §5.3.2, §5.4.2).
- **To reuse it:** per the paper, a way to register the agent's optimizable parameters (prompts, models, tools) and to track its internal activities (§4); an evaluator giving a score, plus textual feedback for the reflective steps (§5.1.1, §5.2.1, §5.3.1).

## On this site

- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/promptopt-feedback">promptopt-feedback</a><a class="tag sub" href="#/tags/promptopt-general">promptopt-general</a></span>
