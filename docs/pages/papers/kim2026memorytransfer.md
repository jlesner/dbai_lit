# Memory Transfer Learning: How Memories are Transferred Across Domains in Coding Agents

**Memory Transfer Learning (MTL** · "How Memories are Transferred Across Domains in Coding Agents"), preprint 2026

Read: [PDF](https://arxiv.org/pdf/2604.14004) · [arXiv](https://arxiv.org/abs/2604.14004)  
Code: [MemoryTransferLearning](https://github.com/KangsanKim07/MemoryTransferLearning)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- A coding agent gets memories built from its own runs on other coding benchmarks (the target benchmark left out) in its system prompt; four memory formats, from raw command traces to task-agnostic insights, on six benchmarks with GPT-5-mini, and Insight memories only with DeepSeek V3.2 and Qwen3-Coder (abstract; §3.1; Tab. 1).
- gpt-5-mini writes the Workflow, Summary and Insight memories from mini-swe-agent trajectories, with a success or failure prompt chosen by an LLM judge's label (Trajectory memories keep the run's commands and outputs as they are), and the top three by embedding similarity are retrieved (§3.1.1–3.1.2, §3.2.2); analyses cover what transfers, abstraction, negative transfer, pool size, cross-model memory and retrieval methods (§4).
- Memory carried across task families, written from runs that an LLM judge labels success or failure (the label only picks the writing prompt; failed runs become memories too), with no check of the memory itself (§3.1.1, App. E; our reading), against [Can a memory across problems be checked before it is reused?](#/challenges/verified_memory). It reports that cross-domain memory improves average performance by 3.7% (abstract), mainly through procedural know-how such as validation routines rather than task-specific code (abstract; §4.2.1), with low-level traces "often" causing negative transfer (abstract).

## In plain words

Coding agents that learn from their own past runs keep notes, called memories, but existing approaches typically reuse them only within one task domain, usually one benchmark. The authors argue that different coding tasks share infrastructure, such as runtime environments and programming languages, so memories from other kinds of tasks could help (abstract; §1). Their simple agent puts into its prompt the three most similar memories written from its runs on the other benchmarks; they compare four memory formats, from raw command logs to general lessons, on six coding benchmarks (§3). With GPT-5-mini and lesson-style memories, the share of tasks solved in at least one of three runs rises on average from 0.523 to 0.560 against the same agent with no memory, which they report as a 3.7% improvement (abstract; Tab. 1); two open models gain less (§4.1.1). They report that the help comes mainly from general know-how, such as validation routines, not task-specific code, and that low-level logs often hurt (abstract). They call the work "a first holistic investigation of Memory Transfer Learning" (§1).

## Background and terms

**Terms to know:** [procedural memory](#/glossary/procedural-memory) · [pass@k](#/glossary/passk) · [LLM-as-a-judge](#/glossary/llm-as-a-judge) · [dense retrieval](#/glossary/dense-retrieval) · [t-SNE](#/glossary/t-sne) (Fig. 4)

**The paper's own terms:**
- **Self-evolving agent**: an agent improved by self-evolution, "which leverages prior inference outcomes to enhance future performance without additional supervision" (§1); here, through memory.
- **Memory Transfer Learning (MTL)**: using memories "generated from heterogeneous tasks" on a target task (§3). The memory pool for a test benchmark holds the memories of every task not in it, per memory format (§3.1.2).
- **The four memory formats** (§3.1.1, Fig. 2):
  - **Trajectory**: the task plus every command the agent ran and its output, without the reasoning.
  - **Workflow**: a goal plus the meaningful actions an LLM extracts from the run.
  - **Summary**: an LLM's summary of the task and one paragraph of experience: environment, actions, results and why the run succeeded or failed.
  - **Insight**: a title, description and content, written "without mentioning specific files or details" and meant to generalize, following ReasoningBank's design.
- **Meta-knowledge (meta-memory)**: procedural and behavioural guidance, e.g. an inspect–edit–verify–submit workflow, compliance with output formats and APIs, or self-written checks, as opposed to task-specific programming content (§4.2.1; Core Finding 2).
- **Abstraction level**: how free of task-specific detail a memory is, from Trajectory (least) to Insight (most) (§4.3.1).
- **Negative transfer**: here, the instances where the agent with no memory succeeded but MTL failed (§4.4.1).
- **Pass@3 and Avg Pass@1**: each model is run three times (§4.1.2); Pass@3 counts a task solved in any of the three runs (main tables), and App. A and Tab. 6 report "Average Pass@1", which the paper doesn't define further.

**Missing glossary terms:**
- **Davies–Bouldin index (DBI) and Local Inverse Simpson's Index (LISI)** (§4.3.1, Fig. 5): cluster scores; the paper reads rising DBI as weaker separation of benchmark clusters and rising LISI as more mixing of benchmarks among nearby points.

**Builds on:**
- The memory formats come from Synapse (Zheng et al., 2024; trajectories), AWM (Agent Workflow Memory) (Wang et al., 2024c; workflows), Reflexion (Shinn et al., 2023; summaries; [Reflexion](#/papers/shinn2023reflexion "Reflexion: Language Agents with Verbal Reinforcement Learning (2023)")) and ReasoningBank (Ouyang et al., 2025; insights) (§1; §3.1.1).
- ReasoningBank and AgentKB (Tang et al., 2025), memory systems that are the two self-evolving baselines (§4.1.2). AgentKB already pools memory across task domains; the authors say it gives no deeper analysis of which knowledge transfers, and that prior work typically pools general reasoning, web and coding tasks, missing principles shared only by coding (§2.3).
- Separate memory prompts for successful and failed runs follow ReasoningBank and ReMe (Cao et al., 2025), a framework covering memory generation, retrieval and refinement (§2.2; §3.1.1).
- The agent is mini-swe-agent (a minimal agent that runs shell commands) (Yang et al., 2024, the SWE-agent paper, [SWE-agent](#/papers/yang2024sweagent "SWE-agent: Agent-Computer Interfaces Enable Automated Software Engineering (2024)")), and Harbor (Team, 2026) is the "evaluation platform" (§3.2.2).

## Problem and setting

- **Questions** (§1): "RQ1. Does memory from heterogeneous domains improve the performance of coding agents?"; "RQ2. Why do transferred memories yield benefits across different domains?"; "RQ3. Which factors in memory transfer learning most influence transfer effectiveness?"
- **Models:** gpt-5-mini for "every LLM usage": writing memories, running the agent, and judging (§3.2.2); DeepSeek V3.2 and Qwen3-Coder-480B-A35B-Instruct (B: billions of parameters, in total and active per token), which the authors call open-sourced models, as agents too (§4.1.1).
- **Memory generation** is offline: the agent first runs on all benchmarks, an LLM judge labels each attempt successful or failed, and the label picks the memory-writing prompt (§3.1.1; prompts in App. E).
- **Retrieval:** each memory is indexed with OpenAI's text-embedding-3-small; for a task, the three memories most similar by cosine similarity go into the agent's system prompt at the start (§3.1.2, §3.2.2). Trajectories are matched on the task text; the other formats on a 4–5 sentence coding plan the model first writes (§3.2.2).
- **Benchmarks** (§3.2.1): Aider Polyglot and LiveCodeBench v6 (competitive, function-level programming), SWE-Bench Verified and Terminal Bench 2 (repository-level tasks), ReplicationBench (code grounded in scientific knowledge) and MLGym-Bench (machine-learning research tasks). 100 tasks are sampled at random from any benchmark with more; success follows each benchmark's own evaluation protocol.
- **Not discussed:** how accurate the LLM judge's success labels are.

## Approach

- **The agent:** a "simple memory-based coding agent" with two stages, memory generation and per-query retrieval (§3.1).
- **Why transfer helps** (§4.2.1): for tasks that fail with no memory but succeed with Insight memories, GPT-5 sorts each trajectory into a category of how the memory helped (Fig. 3; categories in App. D, Tab. 10).
- **Abstraction** (§4.3): embedding plots and cluster scores per format (Figs. 4–5); then, to separate abstraction from format, Insights are split into the 30% whose reconstructed task is most similar to the real one (task-specific) and the 30% least similar (task-agnostic) (§4.3.3).
- **Further analyses** (§4.4): a categorization of negative-transfer cases (§4.4.1); pools subsampled to 1/4, 2/4 and 3/4, and pools from varying numbers of source domains (§4.4.3); memories written by another model (§4.4.4); and two retrieval variants, an LLM choosing three of 20 embedding candidates, and an LLM rewriting the retrieved memories for the task (§4.4.5).
- **Formal model** (App. C): a memory's embedding is split into a domain-invariant part (meta-knowledge) and a domain-specific part; abstraction is the invariant part's squared length over the sum of both parts', and a memory's usefulness for a new task is modelled as growing with its invariant part's alignment to the task and shrinks with its specific part's. Under two assumptions, that embeddings have bounded capacity (e.g. normalized length), so more abstraction replaces specific detail with meta-knowledge, and that for an unseen task the specific part "acts as misaligned noise", the authors state that their model proves "the expected empirical transfer gain strictly increases with the abstraction level" (Proposition 1).

## Results

- **Main results** (§4.1.1, Tab. 1, Pass@3): with GPT-5-mini all four formats beat no memory on average, Insight most (0.560 against 0.523), then Summary, Workflow and Trajectory (§4.3.2); per benchmark, some formats score below no memory (e.g. Trajectory on Terminal Bench 2 and MLGym-Bench; Tab. 1). With Insight memories, DeepSeek V3.2 gains 2.6% and Qwen3-Coder 1.8% on average (§4.1.1).
- **Against self-evolving methods** (§4.1.2, Tab. 2, three benchmarks): MTL averages 0.630 against ReasoningBank's 0.601, which uses 97 in-domain memories, and AgentKB's 0.613 with 5,899 out-of-domain ones; MTL's pool holds 431.
- **What transfers** (§4.2.1, Fig. 3): the authors report that memory helps mainly through meta-knowledge; "Algorithmic Strategy Transfer" accounts for only 5.5% of the gains, so direct transfer of algorithms "is limited in our setting". Tab. 3 shows a SWE-Bench Verified failure turned into a success by a LiveCodeBench Insight about quick inline tests.
- **Abstraction** (§4.3): Insight embeddings mix across benchmarks while task and Workflow embeddings cluster by benchmark (Figs. 4–5); task-agnostic Insights beat task-specific ones, 0.534 against 0.523 on average (§4.3.3, Tab. 4), which the authors take as "evidence that abstraction, rather than format itself, is a key factor". In Tab. 5, an agent copies a Trajectory's commands into an incompatible setting and hits a runtime error (§4.3.4).
- **Negative transfer** (§4.4.1): three causes, "Domain-mismatched anchoring", "False validation confidence" and "Misapplied best-practice transfer", which the authors trace to wrong retrieval and failed adaptation; cases in App. B (Tab. 9).
- **Scaling** (§4.4.3, Fig. 6, plotted as the change in Avg Pass@1, without value labels): on three benchmarks, average performance rises consistently with pool size, the gain "generally increases" with the number of source domains, and 9 domains do best.
- **Cross-model memory** (§4.4.4, Tab. 6, Avg Pass@1): memories from another model beat no memory for every pair, in both directions, and the authors report that cross-model transfer "consistently underperforms" MTL with self-generated memories.
- **Retrieval** (§4.4.5, Tab. 7): plain embedding similarity (0.630) beats LLM reranking (0.598) and adaptive rewriting (0.608).

## Limits the authors state

- "Memory Transfer Learning can degrade performance in certain benchmarks" (§4.4.1); it carries "the risk of negative transfer through blind imitation or misinterpretation of transferred knowledge" (§4.4.2).
- With memories from other models, "model-specific biases may exist in the memories" (§4.4.4).
- Better retrieval methods fail "likely because the required knowledge is difficult to anticipate in dynamic, multi-step agent settings"; methods designed for static settings "may not generalize well to cross-domain memory transfer" (§4.4.5).
- Agents "might misapply implementation patterns or overlook domain-specific safety constraints", and deployment "requires careful attention to robust retrieval strategies to prevent the generation of unreliable or insecure code" (Impact Statement).

## Open problems and building blocks

  - "Advanced memory retrieval methods that retrieve truly helpful memories not semantically relevant items", and better adaptation of memories, "such as memory rewriting module" (§4.4.1).
  - "Further study on agentic memory retrieval and adaptation", such as domain routing and step-wise memory retrieval (§4.4.5).
  - "Further research into robust memory usage strategies for self-evolving coding agents" (§5).
- **Released:** Nothing stated (the title page links a project page).
- **To reuse it:** one LLM for memory writing, the agent and the judge (gpt-5-mini in the paper), an embedding model (text-embedding-3-small), mini-swe-agent and Harbor, and a first run of the agent over every source benchmark to build the pool (§3.1.1, §3.2.2); the benefit categorization used GPT-5 (§4.2.1).

## On this site

- **Discussed in:** [Gains made against a checker, carried beyond it](#/challenges/transfer_beyond_the_checker) · [Can a memory across problems be checked before it is reused?](#/challenges/verified_memory)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/harness-general">harness-general</a><a class="tag sub" href="#/tags/harness-promptopt">harness-promptopt</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/promptopt-context">promptopt-context</a><a class="tag sub" href="#/tags/promptopt-general">promptopt-general</a></span>
