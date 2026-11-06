# Better Harnesses, Smaller Models: Building 90\% Cheaper Agents via Automated Harness Adaptation

**Better Harnesses, Smaller Models** · Smaller Models"), preprint 2026

Read: [PDF](https://arxiv.org/pdf/2607.08938) · [arXiv](https://arxiv.org/abs/2607.08938)  
Code: [slm-harness-adaptation](https://github.com/malusamayo/slm-harness-adaptation)

<p class="notice">A summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- A frontier meta-agent (`gemini-3.1-pro-preview`) adapts the harness of a small open-weight model per task, so that it approaches a frontier model with a generic harness at a fraction of the cost; seven business-style agentic tasks, three small models (abstract; §IV-A; §IV-B).
- Diagnoses failure trajectories and edits the harness's prompts, tools, hooks, context management and sub-agents in the OpenHands software-agent-sdk, keeping a GEPA-style Pareto pool of candidates scored on validation data (§III-A, §III-B); a framework maps five capability-indexed failure modes to six adaptation strategies (§II, Fig. 2).
- Frontier optimizes once, offline, compact runs, with no weight training ([Bringing compact models to frontier accuracy](#/challenges/compact_model_accuracy)): it reports seven of 21 task–model pairs closing the gap to the frontier model (abstract; §IV-D, Tab. II), with higher optimized scores on less diverse tasks (§IV-D, Fig. 5) and larger gains for stronger small models (§IV-D, Fig. 6), and that harnesses do not transfer cleanly across small models (§IV-D).

## In plain words

Agents run by frontier LLMs are costly at scale; small language models (SLMs) are cheaper but typically fall short when swapped into a harness (the prompts, tools and control code around the model) designed for a frontier LLM (abstract). The authors argue that in routine business tasks much of the difficulty is shared across instances and can be moved from the model into the harness (abstract). They build a framework mapping agent failure types to harness changes, and an optimizer in which a frontier model reads a small model's run logs and rewrites its harness (§II–III). On seven business-style tasks and three small models, they report that the optimized harnesses "significantly improve performance on 16 of 21 task-SLM pairs" (abstract). Seven of these close the gap to a frontier model with a generic harness (abstract), and the best small model can reach 89% of that model's performance at 4% of its cost (§IV-D). Adaptation works best, they find, for more repetitive tasks and small models with "sufficient base capabilities" (abstract). They call the work "a first in-depth empirical analysis" of if, when and how it works (§VII).

## Background and terms

**Terms to know:** [agent harness](#/glossary/agent-harness) · [tool calling](#/glossary/tool-calling-function-calling) · [agent skill](#/glossary/agent-skill) · [context compaction](#/glossary/context-compaction) · [Pareto front](#/glossary/pareto-front) · [Levenshtein distance](#/glossary/levenshtein-distance) · [Spearman's rank correlation](#/glossary/spearmans-rank-correlation) · [MCP (Model Context Protocol)](#/glossary/model-context-protocol-mcp) (tools are commonly implemented as MCP servers, §II-B "Tool adaptations"; Fig. 4)

**The paper's own terms:**
- **SLM**: used "operationally for cheaper, smaller, open-weight models that can be deployed locally"; the experiments' models have 3B to 8B active and 8B to 30B total parameters (§I, footnote 2).
- **Harness adaptation**: changing an agent's harness for one task and one model, to move task demands from the model to the harness (§II-B).
- **Meta-agent**: the frontier-model agent that inspects trajectories and edits the harness code (§III-B).
- **Failure modes**, indexed by the model capability they implicate (§II-A, Fig. 2, left): **tool-use** (wrong tool, malformed call), **instruction-following** (violating system or user instructions), **knowledge** (missing domain, environment or commonsense assumptions for an under-specified task), **long-context** (failing to retrieve and use information from a long trajectory) and **planning / reasoning** (failing to decompose a goal, choose a next action or revise a plan).
- **Adaptation strategies**, grouped by the harness part they change (§II-B, Fig. 2, right): contexts (**adding contexts**, **managing contexts**, e.g. revealing progressively, offloading to storage, summarizing, pruning, splitting into multi-agents), tools (**creating tools** that wrap recurring tool sequences, **managing tools**: filtering the tool set, tailoring schemas) and the agent loop (**instrumenting code**, e.g. deterministic checks run before or after tool calls; **orchestrating agents**).
- **Hooks**: "custom scripts that are triggered based on tool use" (§III-A).
- **Task diversity**: the average pairwise normalized Levenshtein distance between the tool-call sequences of the frontier model's runs on a task, used as a proxy for how much the workflow varies (§IV-B, RQ2).

**Builds on:**
- Automated harness optimization: the Darwin Gödel Machine ([Darwin Gödel Machine (DGM)](#/papers/zhang2025dgm "Darwin G\'odel Machine: Open-Ended Evolution of Self-Improving Agents (2026)")), Meta-Harness ([Meta-Harness](#/papers/lee2026metaharness "Meta-Harness: End-to-End Optimization of Model Harnesses (2026)")) and Live-SWE-agent, agents that modify agent code (§I; §III; §VI).
- GEPA ([GEPA](#/papers/agrawal2025gepa "GEPA: Reflective Prompt Evolution Can Outperform Reinforcement Learning (2026)"), a prompt optimizer that evolves a pool of candidates), whose Pareto-based sampling of candidates the optimizer reuses (§III-B).
- The OpenHands software-agent-sdk, an open-source framework for building software agents, whose APIs define the search space (§III-A).
- ADAS ([ADAS](#/papers/hu2024adas "Automated Design of Agentic Systems (2024)"), an LLM that optimizes agents defined in code) and later automated agent design, which the authors say mostly targets pre-defined workflows and tends to add model compute (§VI).

## Problem and setting

**Question.** "To what extent can harness adaptation make SLM agents competitive with frontier-LLM agents?", and how task diversity, model capability and the kind of adaptation bear on it (RQ1–RQ4, §IV).

**Tasks** (Tab. I): seven tasks, each grounded in an existing benchmark "with verifiable outcomes". Attendance-auditing and budget-approval are built from templates of TheAgentCompany (a benchmark of simulated workplace tasks) with new instances generated; stock-alert and anomaly-detection are taken from LOCA-Bench ([LOCA-bench](#/papers/zeng2026locabench "LOCA-bench: Benchmarking Language Agents Under Controllable and Extreme Context Growth (2026)"), agent tasks with growing context) with its pipeline reused for new instances; playwright-testing writes end-to-end tests with Playwright (a browser-automation library) for static websites built from WebGenBench instances (a website-generation benchmark) by `gemini-3.1-pro`; website-management samples shopping-site administration tasks from WebArena (a web-agent benchmark), keeping those a frontier LLM can solve; code-refactoring reuses RefactorBench (repository refactoring requests). Each has 100 instances except website-management (50). Scoring checks against ground truth or runs tests (Tab. I). Each task is split 20/20/60 into training, validation and test (§IV-A).

**Models** (§IV-A): the small models `qwen3-coder-30b-a3b`, `ministral-3-8b` and `gemma-4-26b-a4b`, compared with `gemini-3.1-pro-preview` (a frontier model) with a generic harness. Cost is computed from token usage and official API prices (Google Vertex AI for the Gemini and Gemma models, AWS Bedrock for the others; both are cloud model-hosting services); each configuration is run three times and averaged (§IV-B).

**Optimization setup** (§IV-B): the meta-agent is `gemini-3.1-pro-preview`; each optimization run has a $20 budget, and each task–model pair gets three runs, keeping the harness with the best validation score.

## Approach

**The framework** (§II, Fig. 2) links each failure mode to the strategies likely to address it, e.g. knowledge failures to adding contexts, tool-use failures to creating high-level tools and filtering unused ones. It also lists trade-offs, e.g.: added context can cause new long-context and instruction-following failures; more tools can worsen tool-use failures; orchestrating agents may raise cost and latency ("Trade-offs of harness adaptations", §II-B). The authors keep it "not tied to model size" because SLM capabilities keep improving (§II-C).

**The optimizer** (§III, Fig. 3) takes a small model, a task with training and validation data, and an initial harness, and returns an optimized harness. The harness is Python code over the software-agent-sdk APIs; the meta-agent may change contexts (system prompts, skills, contexts added on need), tools (primitive ones such as bash, custom classes, scripts), hooks, context management (external file systems, context condensers, which shorten the history) and sub-agents (§III-A). Each iteration (§III-B):
1. picks a harness from a pool of earlier candidates and their validation scores, by "a GEPA-style genetic search procedure" that samples from the Pareto front ("the sampled harness will be optimal on at least one training instance"), and runs it on a batch of training instances, logging full trajectories;
2. the meta-agent reads those trajectories, the harness code, a "search memory" of past proposals and their effects, and documentation of the harness components, then edits the harness; a cheap sanity check catches broken code and asks for repairs;
3. the new harness is run on the same batch; if it improves, it is evaluated on the full validation set and added to the pool if it beats earlier candidates.

**An example** (§III-C, Fig. 4): for budget-approval, after 23 iterations the optimizer narrowed the tool set, rewrote the system prompt as a step-by-step procedure, and added a hook (`anti_loop_hook.py`) that refuses to re-send the same message to the same recipient, to stop loops.

## Results

- **SLMs against the frontier model (RQ1; §IV-D, Tab. II).** Optimized harnesses "significantly improve performance on 16 of 21 task-SLM pairs", with seven pairs closing the gap to `gemini-3.1-pro-preview` (abstract; §IV-D). The best, `gemma-4-26b-a4b`, "can recover 89% of LLM performance at 4% cost, with 25% latency reduction" (§IV-D); Tab. II's average accuracies are 80.2 against 89.7. `ministral-3-8b` stays at 0.0 on stock-alert and anomaly-detection after optimization (Tab. II). The one-time optimization cost is amortized by reusing the harness, the authors argue (§IV-D).
- **Task diversity (RQ2; §IV-D, Fig. 5).** Across the seven tasks, the authors report a "strong, statistically significant negative correlation" (a Spearman correlation) between task diversity and optimized performance (Fig. 5, left). In variants of attendance and budget with 3 to 20 workflow templates, optimized performance drops from 89.1% to 68.0% as templates are added (Fig. 5, right). They see attendance-auditing as easier to adapt (shared failure modes) and code-refactoring as harder (each repository and request differs).
- **Model capability (RQ3; §IV-D, Fig. 6).** Stronger small models, measured by the Artificial Analysis intelligence index (an aggregate of public benchmark scores), perform better and improve more; more capable SLMs gain "+48.8% vs. +15.5%" (§I) (gains in average accuracy, strongest against weakest small model). The authors read this as harnesses that "can absorb substantial task difficulty but cannot fully replace missing core model capabilities" (§I).
- **What the harnesses change (RQ4; §IV-D).** Reviewing the optimized harnesses by hand, the most commonly addressed failure modes are instruction-following (81%) and knowledge (81%), then tool-use (62%) and long-context (33%); the strategies are mostly adding contexts (86%), creating tools (43%) and managing tools (29%). No successful harness creates sub-agents; the authors hypothesize this reflects current SLMs' limited ability to manage agents, or limits of the meta-agent. Different SLMs fail differently (e.g. `ministral-3-8b` sometimes struggles with file-editing tools; `qwen3-coder-30b-a3b` occasionally emits raw XML instead of JSON tool calls), so "harness optimization needs to be re-run each time we migrate to a new SLM".
- **Lessons for optimizer design (§V-A).** Raw JSON trajectories worked better than summarized markdown; the cheaper meta-agent `gemini-3-flash-preview` gave worse final harnesses despite more iterations; showing successful frontier trajectories or hand-written heuristics "did not consistently improve outcomes"; a memory of prior attempts and several independent searches helped.

## Limits the authors state

- The agent runs and optimization are "highly stochastic, even with our mitigation of multiple repeated runs" (§IV-C).
- Findings rest on "a particular set of tasks, models, and one optimizer implementation, and may not transfer cleanly to other tasks, future models, or different optimizer implementations"; the tasks have clear success metrics and clean environments, which "do not fully capture the complex deployment scenarios of specialized agents" (§IV-C).
- Closed frontier APIs may change, so "exact replication of the optimization may be difficult once these APIs change or get deprecated"; the authors "believe our findings generalize well to any frontier LLMs with strong capabilities" (§IV-C).
- Harnesses cannot fully replace missing core capabilities: some tasks need coding or long-context ability that "cannot be fully delegated to the harness" (§IV-D, RQ3).

## Open problems and building blocks

- **Open:** better optimizers need "evidence from larger-scale experiments and a more thorough exploration of the design space"; finer task and model profiles, by failure mode, to predict when adaptation helps and which edits; "mixtures-of-harnesses", specialized harnesses with a router per instance for diverse tasks; online monitoring and adaptation when task distributions drift (§V-B "For researchers"). Model developers should "optimize for harness compatibility" (§V-B "For model developers").
- **Released:** code ("Code available at", footnote to the abstract). The task suite is a listed contribution (§I).
- **To reuse it:** a strong frontier model as meta-agent (§V-A); task instances "with clear evaluation criteria, to optimize against" (§V-B); the software-agent-sdk harness APIs (§III-A); in the experiments, $20 per optimization run and three runs per task–model pair (§IV-B).
- **Beyond its domain:** the framework is "not tied to model size and applies to language model agents broadly" (§II-C).

## On this site

- **Discussed in:** [Bringing compact models to frontier accuracy](#/challenges/compact_model_accuracy)
- **Tags:** <span class="tags"><a class="tag" href="#/tags/agent">agent</a><a class="tag" href="#/tags/benchmark">benchmark</a><a class="tag" href="#/tags/code">code</a><a class="tag" href="#/tags/compact">compact</a><a class="tag" href="#/tags/harness">harness</a><a class="tag" href="#/tags/llm">llm</a><a class="tag" href="#/tags/method">method</a><a class="tag" href="#/tags/study">study</a><a class="tag sub" href="#/tags/promptopt-context">promptopt-context</a><a class="tag sub" href="#/tags/promptopt-evolve">promptopt-evolve</a></span>
