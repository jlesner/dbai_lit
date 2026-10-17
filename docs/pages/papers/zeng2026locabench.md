# LOCA-bench: Benchmarking Language Agents Under Controllable and Extreme Context Growth

**LOCA-bench** · preprint 2026

Read: [PDF](https://arxiv.org/pdf/2602.07962) · [arXiv](https://arxiv.org/abs/2602.07962)  
Code: [LOCA-bench](https://github.com/hkust-nlp/LOCA-bench)

<p class="notice">A summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- A benchmark of tool-using agents under a context-length dial: code generators enlarge the environment state behind 15 seed tasks adapted from Toolathlon, served by local database-backed mock servers (Canvas, email, BigQuery, Snowflake, WooCommerce and others), from 8K to 256K tokens of "environment description length", "while keeping the underlying task semantics fixed" (abstract; §2.2–2.3).
- Success is checked by hand-written rule-based scripts that compare the final environment state with the ground truth (§2.1; §3.1). Seven frontier and open models run under a ReAct scaffold (§3.1); four of them then run at 128K with context-engineering strategies (tool-result and thinking-block clearing, compaction, context awareness, memory tools, programmatic tool calling; Claude-4.5-Opus with programmatic tool calling only), and Claude-4.5-Opus also with the Claude Agent SDK (§4.2–4.3, Tabs. 2–3).
- A length dial on agent tasks with state checks, and a comparison on the same tasks of an agent that writes code to call tools and process their outputs (programmatic tool calling) against one that reads the outputs in its context: the authors report it lifting DeepSeek-V3.2-Thinking from 10.7% to 24.0% at 128K while shortening its trajectory (Tab. 2). Bears on [Reliability that holds with size, by handing the procedure to an engine](#/challenges/engine_offloading_with_size) and [Whole-job reliability of multi-step LLM work](#/challenges/whole_job_reliability).

## In plain words

An LLM agent that works through tools keeps adding what the tools return to its context, and the authors note that reliability "often deteriorates" as context grows, an effect called "context rot" (abstract). Existing long-context benchmarks, they argue, mostly test retrieval from one long text, not agents acting as their context grows (abstract; §1). They build LOCA-bench: 15 real-world work tasks run against local imitations of online services, where code makes more or less data behind each task while the task itself stays the same, and a script checks the final result (§2). Under one standard agent loop, accuracy falls sharply as the data grows: Claude-4.5-Opus solves 96.0% of tasks with 8K tokens of data and 14.7% with 256K (Tab. 1). Context management can help; letting the model write code that calls the tools and returns only the processed result is, in the authors' words, "consistently strong across all models" tested with a 128K-token environment (§4.2). They present it as a benchmark and open-source platform for evaluating models and agent frameworks (abstract).

## Background and terms

**Terms to know:** [agent harness](#/glossary/agent-harness) · [ReAct](#/glossary/react) · [tool calling (function calling)](#/glossary/tool-calling-function-calling) · [context compaction](#/glossary/context-compaction) · [context rot](#/glossary/context-rot) (§1)

**The paper's own terms:**
- **scaffold**: the agent framework a model runs in, with its context strategies; agents are evaluated "as a combination of models and scaffolds" (abstract). In the glossary's terms, an agent harness (our bridge).
- **environment state** and **environment configuration**: the data in the simulated services when a task starts, and the parameters (e.g. number of courses, amount of distracting content) from which generators build it (§2.2).
- **environment description length**: the paper's measure of how much an agent must read. Scripted tool calls fetch everything an agent would need to read, and the length is the token count of those outputs under GPT-4's tokenizer (§2.2). The authors say it is inspired by the concept of description length (the number of bits needed to encode data) (§2.2), and it is the dial set to 8K, 16K, 32K, 64K, 96K, 128K or 256K (§2.3).
- **seed task**: one of the 15 base tasks; each length gets five random seeds per task (§2.3).
- **mock server**: a local, database-backed imitation of an online service, written to offer the same tools and the same request and return formats as the real one, without logins (§2.2).
- **context engineering strategies** (§4.1), in two groups. **Context editing**, rule-based pruning triggered at a context-length threshold:
  - **tool-result clearing** removes past tool outputs;
  - **thinking-block clearing** deletes earlier turns' reasoning;
  - **context compaction** has the model summarize the history and replaces the history with the summary.

  **Tool-use methods:**
  - **context awareness** tells the model after each tool call how much context it has left;
  - **memory tools** let it create, read, update and delete memory files;
  - **programmatic tool calling** lets it submit code that calls the tools, so that "code can consume intermediate tool outputs and return only the final processed result to the model" (§4.1).
- **trajectory length**: the tokens a run takes; for strategies that edit the context, the removed text is added back (§4.2).

**Missing glossary terms:**
- **MCP server**: a server that exposes tools to an LLM agent through the Model Context Protocol, a standard interface for tool calls (general definition); the paper says agentic tasks "require online services from MCP servers" (§2.2) without defining the term.

**Builds on:**
- Toolathlon (Li et al., 2025), an agent benchmark with diverse environments and tools whose tasks are all verifiable: the 15 seed tasks are "sourced and adapted" from it (§2.3).
- GEM (Liu et al., 2025), a gym (a framework of environments) for agentic LLMs, on which the implementation is built (§2.3).
- The mock servers follow the tool-use benchmarks Berkeley Function Calling Leaderboard (Patil et al.) and τ-bench (Yao et al. (2024), [τ-bench](#/papers/yao2024taubench "$\tau$-bench: A Benchmark for Tool-Agent-User Interaction in Real-World Domains (2025)")) (§2.2).
- It contrasts itself with long-context benchmarks that "mainly test single-step retrieval from long text", Oolong ([Oolong](#/papers/bertsch2025oolong "Oolong: Evaluating Long Context Reasoning and Aggregation Capabilities (2026)")) and LongBench v2 among them (§2.1).

## Problem and setting

The question: how well do agents perform as the context they must handle grows, with the task held fixed, and which scaffolds and context strategies mitigate the decline (abstract; §1).

- **Tasks:** 15 seed tasks over mock servers for Google Calendar, Canvas (a course-management system), Email, BigQuery and Snowflake (cloud data warehouses), Google Sheets and WooCommerce (an online-shop platform), plus file and code tools (§2.2; App. B, Tab. 7); 280 tools in all, each task seeing a subset; seven lengths × 15 tasks × 5 seeds give 525 samples (§2.3). Generators can add edge cases (e.g. exempt courses) and distractors (§2.2).
- **Correctness:** hand-written evaluation scripts compare the final environment state with the ground-truth state; each run scores 1 or 0, and the metric is mean accuracy, alongside trajectory length, number of tool calls and tool-output tokens (§3.1).
- **Models:** three proprietary frontier models (Claude-4.5-Opus, GPT-5.2-Medium, Gemini-3-Flash) and four open models (DeepSeek-V3.2-Thinking, MiniMax-M2.1, GLM-4.7, Kimi-K2-Thinking), each at its maximum context length, from 130K (DeepSeek) to 1050K tokens (Gemini) (§3.1). When an input exceeds a model's limit, the oldest tokens are cut and the most recent kept (§3.1). Main runs use a ReAct scaffold (§3.1).
- **Context strategies (§4.2):** all at a 128K environment description length. Editing strategies trigger at 200K tokens for Gemini-3-Flash and GPT-5.2-Medium and 100K for DeepSeek-V3.2-Thinking; tool-result clearing removes 50% of accumulated tool calls and outputs each time; thinking-block clearing keeps only the latest thinking turn.
- Sampling settings and repeated runs per sample: not discussed.

## Approach

The benchmark grows the context through the environment, not the prompt (§1). Its four design aims are reasoning-driven exploration, controlled context scaling with task semantics fixed, verifiable evaluation by state-checking scripts, and an extensible platform whose tasks, environments and scaffolds are decoupled (§2.1). For each task, a task-specific generator assembles hand-written state templates (courses, exams, emails) according to the configuration, as Fig. 2 shows for a task that collects final exams into an Excel file (§2.2).

For §4 they implement the six context strategies inside their own scaffold, "Since frontier models have not open-sourced their context engineering strategies" (§4.1). Programmatic tool calling is an extra tool: the model submits code, the code can call tools from the other servers, and the model receives only the script's final output (§4.1). §4.3 also runs Claude-4.5-Opus with Anthropic's official programmatic tool calling and inside the Claude Agent SDK (Anthropic's agent framework), which brings strategies such as compaction, with features such as semantic search and subagents (helper agents the model launches).

## Results

- **Accuracy against length (Tab. 1, Fig. 1).** Accuracy "drops quickly across models" as the environment grows (§3.2). At short lengths, "most models perform strongly when the context is short, with accuracy typically above 70%" (§1). Claude-4.5-Opus goes from 96.0% at 8K to 14.7% at 256K (Tab. 1). The gap between frontier and open models "begins to open around 32K", and "in longer settings the frontier models achieve roughly two to three times the accuracy of the open-source models" (§3.2). Of the frontier models, Claude-4.5-Opus is best at short lengths and GPT-5.2-Medium "more consistent across context lengths" (§3.2).
- **Exploration plateaus (§3.2, Fig. 3).** For most models, trajectory length and tool calls largely plateau after 96K, which the authors read as limited exploration (§3.2). Models that retrieve more tool-output tokens "tend to perform better" (§3.2). Claude-4.5-Opus and DeepSeek-V3.2-Thinking call tools more often, which the authors attribute largely to their shorter context windows forcing repeated calls after truncation (§3.2).
- **Failure modes (§3.3).** From trajectories, the authors name four failure modes "rarely seen in short-context settings": declining complex reasoning (Fig. 5), weaker instruction following (Fig. 6), insufficient exploration, such as stopping after the first page of products (Fig. 4), and hallucination-like inconsistencies, a retrieved value miscopied later (Fig. 7).
  - Programmatic tool calling lifts DeepSeek-V3.2-Thinking from 10.7% to 24.0%, with trajectory length falling from 191K to 103K tokens (Tab. 2).
  - It lifts GPT-5.2-Medium from 38.7% to 49.3% (Tab. 2).
  - For Gemini-3-Flash, context awareness gives the highest accuracy in Tab. 2.
  - The authors report that, overall, frontier models benefit more than the open model: memory tools and context awareness "hurt DeepSeek-V3.2-thinking", while Gemini-3-Flash and GPT-5.2-Medium gain from them, and "advanced, tool-use methods outperform crude context-editing methods" (§4.2).
  - Compaction lets DeepSeek-V3.2-Thinking run past its 130K limit, "which leads to exceptionally long trajectories" (§4.2).
  - They attribute programmatic tool calling's strength ("This likely comes from") to shorter context use and code-driven workflows that handle edge cases such as pagination (§4.2; App. D, Fig. 8).
- **Existing scaffolds (§4.3, Tab. 3).** For Claude-4.5-Opus at 128K: 34.0% natively, 40.0% with the authors' programmatic tool calling, 49.3% with Anthropic's, and 26.7% inside the Claude Agent SDK (Tab. 3). A "likely reason" for the drop, from the trajectories: the framework pushes the model toward built-in features such as subagents, which it often misuses (on Canvas tasks, subagents without the tools they need), piling up irrelevant context; it later fabricated "some quiz and assignment details" (§4.3).

## Limits the authors state

- Claude-4.5-Opus is tested with only one context strategy: "we limit evaluation to the programmatic tool-calling strategy because of its higher testing cost" (§4.2).
- The context strategies are the authors' own implementations, "Since frontier models have not open-sourced their context engineering strategies" (§4.1). Their programmatic tool calling trails Anthropic's, and "Since Anthropic has not disclosed the exact implementation details, the most plausible explanation is that their programmatic tool calling is more tightly aligned with Claude's training scaffold" (§4.3).

## Open problems and building blocks

- **Open:** None stated as open problems. The authors offer the findings as "useful guidance for the future design of agent training and inference scaffolds" (§1).
- **Released:** LOCA-bench is open-sourced (abstract; §5), and the seeded configurations "are released with the benchmark to ensure reproducibility and comparability across studies" (§3.1). The authors say "we will also open-source our data synthesis toolkit" for adding tasks or lengths, with built-in context-engineering strategies (§2.3).
- **To reuse it:** the mock servers remove the need for authentication with real services (§2.2); the benchmark is built on GEM and decouples environment, models and scaffolds (§2.3); it is meant to integrate with existing scaffolds such as Claude Agent and OpenHands (an open agent framework) (§2.1). Each model runs at its maximum supported context length (§3.1). No cost or hardware is stated beyond Claude-4.5-Opus's "higher testing cost" (§4.2).

## On this site

- **Tags:** <span class="tags"><a class="tag" href="#/tags/gym">gym</a><a class="tag" href="#/tags/offload">offload</a><a class="tag sub" href="#/tags/harness-general">harness-general</a><a class="tag sub" href="#/tags/llm-method">llm-method</a></span>
