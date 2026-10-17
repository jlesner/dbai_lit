# ProgAgent: Learning Tool Orchestration through Programmatic Training

**ProgAgent** · preprint 2026

Read: [PDF](https://arxiv.org/pdf/2610.14774) · [arXiv](https://arxiv.org/abs/2610.14774)  
Code: [ProgAgent](https://github.com/hkust-nlp/ProgAgent)

<p class="notice">A summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Trains Qwen3-8B and 14B to call tools by writing Python programs that run in a persistent sandbox, keeping tool results in variables and printing only what they choose (programmatic tool calling, PTC), and compares this under one recipe with direct tool calling (DTC), where every tool result enters the context, and with a Hybrid of the two (abstract; §2.2; §3.3).
- An LLM pipeline builds 215 tasks, each a relational database and files behind single-purpose tools, with a Python verifier and an oracle solution, at four environment scales with database rows at 1×, 2×, 4× and 8× (§3.1; App. B.2); cold-start SFT, then GSPO RL on the verifier's binary reward (§3.3); evaluated on MCPMark, LOCA-bench, Toolathlon-Verified and MCP-Atlas, with cross-harness runs that evaluate PTC-trained models under DTC and the reverse (§4.1; §5.3).
- A data-size dial on agent tasks with programmatic checks, comparing the engine arm (code over data kept in variables) with the in-context arm on the same tasks, in prompting and in trained weights: the authors report DeepSeek V4 Pro's DTC pass@8 dropping from 0.95 to 0.42 from the smallest to the largest scale (§5.2, Tab. 4) while its PTC pass@8 stays high (§3.1.1, Fig. 7). Bears on [Reliability that holds with size, by handing the procedure to an engine](#/challenges/engine_offloading_with_size), [Bringing compact models to frontier accuracy](#/challenges/compact_model_accuracy) and [Gains made against a checker, carried beyond it](#/challenges/transfer_beyond_the_checker).

## In plain words

LLM agents that use many tools usually call each tool directly, so every raw tool result is appended to the model's context; the authors say this "can lead to context rot and orchestration breakdown" (abstract), that is, reliability falls as the context fills. In the alternative, programmatic tool calling, the model writes Python that calls the tools, keeps their results in variables and prints only what it needs. It has been explored "mainly as an inference-time optimization", and its benefits for training "remain unclear" (abstract). ProgAgent comprises 215 tasks checked by programs, each at four data sizes, a sandboxed Python runtime, and fine-tuning then reinforcement learning on the checkers' rewards. The authors' 14B model reaches a 30.7% pass rate on LOCA-bench (tool-use tasks whose environment can be enlarged) at a 64k-token environment, where the evaluated baselines of comparable size score zero (abstract). On two benchmarks, code-trained models also beat direct-call-trained ones when both use direct calls, which the authors say suggests the benefits "extend beyond the interface" (abstract; §5.3). They present a training stack for studying a known interface as a training method, not a first.

## Background and terms

**Terms to know:** [tool calling](#/glossary/tool-calling-function-calling) · [agent harness](#/glossary/agent-harness) · [reinforcement learning](#/glossary/reinforcement-learning) · [RL with verifiable rewards](#/glossary/rl-with-verifiable-rewards-rlvr) · [cold start](#/glossary/cold-start) · [pass@k](#/glossary/passk) · [POMDP](#/glossary/pomdp-partially-observable-markov-decision-process) · [GRPO](#/glossary/grpo) · [context rot](#/glossary/context-rot) (cited without a definition, §1) · [GSPO](#/glossary/gspo) (cited without a description, §3.3)

**The paper's own terms:**
- **Direct tool calling (DTC)**: one tool call per turn; the call and its full result are appended to the context (§2.2, Fig. 2).
- **Programmatic tool calling (PTC)**: the model writes a program that calls tools and can loop, branch and handle exceptions; results stay in runtime variables kept across turns, and only the program and its printed output enter the context (§2.2). The code tool is "the ONLY way to invoke env tools" (App. C.1).
- **Hybrid**: both interfaces, interleaved (§3.3).
- **Harness**: which of the three interfaces the agent gets (§3.3; App. C.4); in the glossary's terms, the tool-interface part of an agent harness (ours). **Cross-harness evaluation** tests a model under an interface it wasn't trained with (§5.3).
- **Environment state, scales v0–v3**: a task's database and workspace files. Instruction, task logic, tool schemas and verifier stay fixed while database rows grow 1×, 2×, 4× and 8× and scalable workspace files 1×–4× (App. B.2).
- **Verifier, oracle solution**: per task, a Python script that returns 1 "if and only if all criteria are satisfied", and a solution using only the task's tools that must pass it (§3.1.1).
- **DTC-like calls**: PTC calls with one tool call and no control flow, error handling or selective printing (Tab. 8 caption).

**Missing glossary terms:**
- **MCP (Model Context Protocol)** (general definition): an open protocol through which an agent's harness connects to tool servers. The runtime is exposed "as an MCP server" (§3.2), and the benchmarks run on MCP servers (App. C.4).

**Builds on:**
- Anthropic's programmatic tool calling (Anthropic, 2025b), used at inference "to reduce token use and latency" (App. A); cited as a website.
- LOCA-bench (Zeng et al., 2026; [LOCA-bench](#/papers/zeng2026locabench "LOCA-bench: Benchmarking Language Agents Under Controllable and Extreme Context Growth (2026)")): the runtime is exposed as an MCP server "Following LOCA-bench" (§3.2), and growing the environment at a fixed task is "Inspired by the concept of description length" (roughly, how long the shortest description of something is), citing it among others (§3.1.1).
- Environment-synthesis pipelines that "primarily make tasks harder by increasing tool diversity or orchestration complexity", such as EnvScaler and Agent-World (Song et al., 2026; Dong et al., 2026; §3.1.1); six models trained on such data are baselines (Tab. 1).
- CodeAct (Wang et al., 2024), code as the agent's action, which "does not provide verifiable long-horizon tasks" (App. A).

## Problem and setting

- **Question:** whether training agents to use PTC improves tool orchestration, and whether what they learn under PTC transfers to DTC (§1); and whether models can learn to filter what enters their context (§2.3).
- **Frame:** a POMDP; the state is the environment (databases, files, tools) plus the interaction history; the verifier's 0/1 reward comes at the episode's end (§2.1).
- **Tasks:** intents from 23 domains (§3.1.2); data in related tables of a relational database, constraints in unstructured files (§3.1.1). Each tool call returns a bounded amount of data, "for example through pagination"; the instruction omits tool names and database schemas (App. B.2).
- **Correctness:** the verifier checks the final response and environment state; "Verification does not use an LLM judge" (App. B.2). Benchmarks keep their own servers, verifiers and prompts (App. C.4); each pass rate averages four runs (§4.1).
- **Models:** Qwen3-8B and 14B in thinking mode, context stretched from 32k to 128k with YaRN (a context-extension method) (App. C.3).
- **Benchmarks:** MCPMark (a benchmark of tool use over MCP servers) (Filesystem, Notion, Playwright browser and PostgreSQL suites, App. C.4), LOCA-bench at 8k–64k environment-state sizes (§4.1), Toolathlon-Verified and MCP-Atlas (multi-server tool-use benchmarks). **Baselines:** GPT-5.2, Claude Sonnet-4.5, Gemini-3 Pro, Qwen3 models up to 235B, DeepSeek-V3.2 and six trained baselines (TOUCAN, Simulator, EnvScaler, AWM, Agent-World, EnvFactory; Tab. 1), under DTC in Tab. 2 (§4.1).

## Approach

- **Task synthesis** (§3.1.2–3.1.3; App. B.2–B.4): An LLM writes intents; a constructor agent (Claude Opus 4.6 through Claude Code) writes data-generation scripts, the tools, the instruction, the verifier and an oracle, repairing the task until the oracle passes; a `SCALE` setting yields v0–v3. A separate agent audits each task at v3. A difficulty filter samples 8 DeepSeek V4 Pro trajectories per task and scale under PTC and keeps a task only if its pass rate is strictly between 0 and 0.8 at every scale, cutting 250 candidates to 215 (App. B.3).
- **Runtime** (§3.2; App. C.2): a fresh, persistent IPython kernel per episode; printed output is the observation. Bubblewrap (a sandboxing tool) leaves the workspace the only writable host-mounted path and keeps the verifier and oracle out of reach.
- **Training** (§3.3; §4.1; App. C.3): cold-start SFT (supervised fine-tuning) on teacher trajectories whose criterion-level score (the share of the task's criteria met) is at least 0.7 (App. B.4), equal counts per harness; then GSPO for 150 steps on the verifier's binary reward, no KL penalty (no term keeping the model near its starting point). The recipe runs under DTC, PTC and Hybrid with "the same task pool and training hyperparameters across all three settings" (§3.3); App. C.3 adds that for DTC RL "we only use v0 environments".

## Results

- **Main results** (Tab. 2; §4.2): ProgAgent-8B and 14B have higher average pass rates than the evaluated comparable-size baselines on all four benchmarks. On LOCA-bench those baselines score zero at 32k and 64k, while ProgAgent keeps 17.3% (8B) and 30.7% (14B) at 64k. On MCP-Atlas the 14B model (run under PTC, App. C.4) is "comparable to Claude Sonnet-4.5" evaluated under DTC (§1).
- **Training paradigms** (Tab. 3; §4.2): untrained backbones gain little from PTC and "often" score lowest under it; after SFT and RL, PTC gives the highest aggregate score on each benchmark at both sizes. At 14B, PTC reaches 29.7% on MCPMark and 45.6% on MCP-Atlas, against 8.0% and 29.7% for DTC. Hybrid stays below PTC; the authors "hypothesize" that one uniform interface "lowers learning difficulty".
- **Data size** (§3.1.1; §5.2): from v0 to v3 of the synthesized tasks, DeepSeek V4 Pro's pass@8 under DTC drops from 0.95 to 0.42 (Tab. 4), while under PTC it "remains above 0.90 across all four scales" (Fig. 7). PTC training on all four scales rather than v0 only raises LOCA-bench averages from 16.0% to 24.3% at 8B and from 23.7% to 38.3% at 14B (Tab. 7).
- **During RL** (§5.1, Fig. 4; App. D.3): DTC's reward stays substantially lower than PTC's and Hybrid's; under PTC, tool-output tokens entering the context and runtime errors fall, and both programmatic settings make fewer tool calls than DTC. PTC models use loops, conditionals and error handling during RL (Tab. 5; App. E).
- **Across interfaces** (§5.3, Tab. 6): DTC-trained models gain from the PTC harness on LOCA-bench but not on MCP-Atlas, and trained baselines under PTC stay near zero (Tab. 7), "suggesting that access to the PTC interface alone is insufficient". PTC-trained models beat DTC-trained ones under both harnesses on both benchmarks, which the authors say suggests benefits "that extend to direct tool calling"; this persists with v0-only training (Tab. 7).

## Limits the authors state

- **DTC-like behaviour** (§5.4): "When environments return unpredictable or highly unstructured content, PTC agents may revert to DTC-like behavior." On Playwright, 40.7% of ProgAgent-14B's PTC calls are DTC-like (Tab. 8), which "limits the benefits of programmatic orchestration and context management".
- **Silent server failures** (§5.4): the PTC harness relies on MCP's `isError` field to raise exceptions, but "non-compliant servers often omit this field"; with server-level error detection disabled, LOCA-bench pass rates drop from 24.3% to 19.3% at 8B and from 38.3% to 34.5% at 14B (Tab. 7), and "the agent may process error messages as successful tool returns".
- **DTC training data** (App. C.3): DTC RL uses only v0, "as the other environments are too difficult for the model to obtain any rewards".
- **Evaluation coverage** (App. C.4): the MCPMark GitHub suite is excluded "because repeated account suspensions during evaluation prevented consistent comparisons across models"; MCP-Atlas uses its last release before version 2.0. Several baseline scores come from other papers; four Toolathlon scores are from the original Toolathlon, not Toolathlon-Verified (†, Tab. 2).

## Open problems and building blocks

- **Open:** "The transfer of these gains to DTC motivates further study of how programmatic training shapes tool-use behavior across interfaces"; the pipeline and runtime "provide a basis for studying this question across environment scales and training settings" (§6).
- **Released:** no explicit release statement. The abstract links a project page (`llleoli.github.io/ProgAgent`); App. B.3 says "We additionally provide each task in a Harbor-compatible format" (Harbor: an agent-evaluation framework) "for use outside our training stack".
- **To reuse it:** Qwen3-8B or 14B with YaRN; SFT on 2 nodes and RL on 8 nodes, each with 8 H200 GPUs (App. C.3); Claude Opus 4.6, Gemini 3.0 Flash and DeepSeek V4 Pro for task building and filtering (§4.1); a Bubblewrap sandbox with cgroup v2 limits (Linux caps on a process's memory and CPU) (App. C.2); MCP servers that set `isError` (§5.4).

## On this site

- **Tags:** <span class="tags"><a class="tag" href="#/tags/compact">compact</a><a class="tag" href="#/tags/gym">gym</a><a class="tag" href="#/tags/offload">offload</a><a class="tag" href="#/tags/transfer">transfer</a><a class="tag sub" href="#/tags/harness-general">harness-general</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/rlvr-general">rlvr-general</a></span>
