# SKILL-DISCO: Distilling and Compiling Agent Traces into Reusable Procedural Skills

**SKILL-DISCO** · preprint 2026

Read: [PDF](https://arxiv.org/pdf/2606.26669) · [arXiv](https://arxiv.org/abs/2606.26669)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Distills the procedure shared by an agent's successful traces and compiles it into callable, executable skills (abstract): Python procedures, not prompts (§3.1).
- Treats successful traces as paths in an unknown finite-state transition graph and skills as parameterized control-flow subgraphs (abstract); evaluated on ALFWorld and WebArena (abstract).
- A stronger model's skills reused by compact ones: a GPT-4o-induced library lifts Qwen3.5-9B on ALFWorld from 54.5% to 98.5%, above GPT-4o's own 96.3% without skills (§4.3, Tab. 2). It needs successful traces, so a success signal.

## In plain words

LLM agents often solve similar tasks from scratch, which the authors say wastes reasoning and lengthens runs (abstract). Earlier work reuses workflows or code skills, but it "remains unclear which task scenarios admit procedural skills" and how runs' shared structure should be represented (abstract). They limit the question to environments with finitely many states and actions whose effects are fixed, and define a skill as a reusable routine, with parameters and branches, shared by many successful runs (§1–2). SKILL-DISCO has an LLM rewrite successful runs as programs, cut them into subgoal steps, group steps that follow one routine, and compile each widely shared (high-coverage) group into a Python function tested on held-out tasks (§3). With GPT-4o inducing and using the library, success on the household benchmark ALFWorld rises from 96.3% to 99.3% for a code-writing agent, and on the web benchmark WebArena from 23.9% to 29.1% for a reasoning-and-acting agent (§4.2). Reused unchanged by five other models, the library cuts turns for all and never lowers success (§4.3). They claim no first, presenting a scope, formulation, framework and experiments (§1).

## Background and terms

**Terms to know:** [finite-state machine](#/glossary/finite-state-machine) (here deterministic, with start and goal states: Def. 1, §2.1).

**The paper's own terms:**
- **FSM-defined scenario**: an environment whose dynamics form a finite-state machine: finite sets of states and actions, a deterministic transition function (a state and an action give exactly one next state), possible start states and goal states (Def. 1, §2.1).
- **Primitive operator**: an operation with a precondition on its input and a "post-evaluation predicate" on input and output; every action of an FSM-defined scenario is treated as one (Def. 2, §2.1).
- **Successful trace**: the observations and actions of one run whose hidden states start in a valid start state and end in a goal state (Def. 3, §2.1).
- **PFSM (parameterized finite-state machine)**: an FSM whose states and actions carry parameters (`go_to(l)` for a location `l`), so runs with different objects, locations or lengths can follow one pattern (Def. 4, Example 1, §2.2).
- **Parameterized trace graph**: one successful trace lifted to the PFSM level, with "its abstract states, parameterized actions, and control-flow relations" (§2.2). **Parameter binding**: assigning concrete values (objects, locations) to parameters, making parameterized transitions concrete (Def. 4).
- **Lifting function**: the map from a trace to its parameterized trace graph; it "does not admit a closed-form definition", so the pipeline approximates it (§2.2).
- **Procedural skill** (executable, unlike the text-file sense of [agent skill](#/glossary/agent-skill)): a parameterized control-flow subgraph that matches a subset of the trace graphs under parameter binding (Problem 1, §2.2). A "desirable skill set" has Coverage (each skill supported by several traces), Utility (helps reach goal states) and Compactness ("neither overly specific nor trivially generic") (§2.2). The Stage 5 prompt requires each compiled skill to be a Python function that calls the environment's step function and returns at least success, the latest observation, the available actions and its action–observation trace (App. B.5).
- **Reusability score**: an estimate of the fraction of traces whose graph a cluster's subgraph matches, "estimated from trace coverage and operation statistics" (§3.2).
- **Distillation**, two senses: the pipeline's first phase, which recovers shared subgraphs from traces (§3.2); and "procedural-knowledge Distillation into compact models and transfer", small models reusing a stronger model's skills (§4.3).
- **SR**, **Avg. Turns**: success rate and average agent turns per episode (§4.1). **Van.**, **+Sk.**: without and with the skill library (Tab. 2).

**Missing glossary terms:**
- **Agent trace (trajectory)**: the log of one agent episode; raw logs "interleave reasoning text, tool calls, observations, and action histories" (§3.2).
- **Skill induction**: building a library of reusable routines from an agent's past runs (§1, §5).

**Builds on:**
- AWM (Agent Workflow Memory, Wang et al. 2024c), which extracts workflows from trajectories, and ASI (Wang et al. 2025, "Inducing programmatic skills for agentic tasks"), which induces executable skills: the experience-reuse work §1 starts from. §4.1 compares their offline variants, AWM-offline and ASI-offline, run on SKILL-DISCO's induction and evaluation splits (§4.2); offline is not defined further.
- The base agents ReAct ([ReAct](#/papers/yao2022react "ReAct: Synergizing Reasoning and Acting in Language Models (2023)"); interleaves reasoning and actions; run via the AgentBench implementation, a suite for evaluating LLM agents) and CodeAct (Wang et al. 2024b; acts by writing executable code) (§4.1).
- Contrasted in §5, not built on: Voyager, an embodied LLM agent that commits one JavaScript function per successful task; Trace2Skill, which writes structured skill documents; tool makers such as LATM (Large Language Models as Tool Makers, [Large Language Models as Tool Makers](#/papers/cai2023toolmakers "Large Language Models as Tool Makers (2024)")), which start from explicit task specifications.

## Problem and setting

- **Question:** which scenarios admit procedural skills and how shared structure should be represented (abstract); then RQ1–RQ4 on success and turns, transfer across "model families, scales, and reasoning modes" (reasoning modes: undefined in the published text; usually a model's thinking switched on or off), skill use at inference, and each component's share (§4).
- **Scope and input:** FSM-defined scenarios (§2.1); reusable skills "become ill-defined for open-ended, instance-specific generation" (§1). Only successful traces are input (Problem 1).
- **Benchmarks** (§4.1): ALFWorld (text-based household tasks of navigation, search and object manipulation), inducing from 200 tasks of the official train set and evaluating on the official unseen split of 134 tasks; WebArena (realistic web-navigation tasks over self-hosted websites), its 812 tasks split in half, the first 406 for induction. All baselines use the same splits.
- **Models:** GPT-4o induces the library and runs the agents (§4.2). §4.3 reuses that library (from the CodeAct configuration on ALFWorld, the ReAct one on WebArena) on Qwen3.5-4B and Qwen3.5-9B (the "smaller open-source backbones") and GPT-4o, GPT-4o-mini, GPT-5-chat and GPT-5-mini.
- **At run time,** each skill's signature and description are appended to the agent's prompt; the LLM decides whether to call a skill or emit a primitive action (§4.1).
- **Metrics:** SR and average turns; tokens and cost in App. A, at provider-published token prices retrieved on 23 May 2026 from Artificial Analysis, a site that compiles them (App. A.1).
- **Not discussed:** which tasks form the verification held-out set (§3.3).

## Approach

Two phases, five stages (§3.1, Fig. 2). The authors call the problem hard: the PFSM is unavailable, the lifting function must be inferred, and exact subgraph matching under parameter binding "is costly and noise-sensitive" (§3).

  - **Stage 1, trace normalization:** an LLM rewrites each successful trace as a Python-like program that keeps every action and observation in order, replaces concrete entities with typed variables "when possible", and makes loops and observation-dependent branches explicit (prompt: App. B.1).
  - **Stage 2, subgoal-level operation extraction:** each program is cut into operations (name, summary, action sequence, code fragment); single-action fragments are dropped (§3.2; fields: App. B.2).
  - **Stage 3, procedural skill consolidation:** operations with the same parameterized structure are clustered even when objects, locations or lengths differ; each cluster gets a reusability score, and each high-coverage cluster becomes a skill. App. B.3 does this with two LLM passes: grouping over mini-batches, then merging overlapping proposals into "a minimal cluster set".
  - **Stage 4, skill specification:** signature (typed parameters with defaults, structured return type), description (docstring and guidance for the agent), preconditions, postconditions, declared side effects, and metadata including a confidence score from the reusability score (App. B.4).
  - **Stage 5, synthesis and verification:** an LLM writes a Python function from the specification using the primitive actions (App. B.5: only the step call and the standard library). On a held-out set, verification checks "runtime correctness, postcondition satisfaction, and action savings"; failing skills are re-synthesized with feedback for up to R retries, a bound the paper gives no value for, then discarded.

## Results

All are the authors' claims.

- **End to end (§4.2, Tab. 1; GPT-4o):** on ALFWorld, SKILL-DISCO with CodeAct reaches 99.3% against CodeAct's 96.3% (AWM-offline 54.5%, ASI-offline 47.0%); on WebArena, with ReAct 29.1% against ReAct's 23.9% and ASI-offline's 24.6%, while the CodeAct variant reaches 22.9% (CodeAct alone 20.0%). The authors claim the "highest SR on all benchmarks under our evaluation setting". Average turns fall in all four settings.
- **Cost (Tab. 5):** per-episode cost with skills falls on ALFWorld and rises on WebArena, for both agents.
- **Transfer (§4.3, Tab. 2):** percentages are relative changes over each model's vanilla setting, not percentage points. SR rises by +3.1% to +80.8% on ALFWorld and by up to +85.3% on WebArena "with no decreases" (GPT-4o-mini's WebArena SR is unchanged); turns drop in every cell (−7.7% to −68.2%). Qwen3.5-9B with the GPT-4o-induced library goes from 54.5% to 98.5% on ALFWorld, above GPT-4o's 96.3% without skills, "at a fraction of the cost" (§4.3; Tab. 6). The largest jumps are on the smaller open-source models, though gains "are not strictly monotone in capacity".
- **Skill use (§4.4, Tab. 3; against ASI-offline):** 5 skills against 110 on ALFWorld and 20 against 146 on WebArena, with more primitive steps per call; skill-call execution errors fall from 75.3% to 0.0% on ALFWorld and from 33.9% to 21.5% on WebArena.
- **Ablation (§4.5, Tab. 4; ALFWorld, CodeAct, GPT-4o):** without Distillation into compact models (skills induced per successful trace, 43 of them) SR drops from 99.3% to 53.0% and turns rise from 3.2 to 11.5, which the authors attribute to overlapping trace-specific variants; without compilation (Stage 3's output shipped as natural-language procedures) SR is 97.0%, but the procedure text stays in context and inflates tokens.

## Limits the authors state

All in § "Limitations":
- "Procedural tasks only": "It offers no benefit for pure NLP tasks such as text generation or reading comprehension, where success depends on linguistic understanding rather than executable procedures".
- "Pipeline quality depends on model capability": "Insufficient model capability yields incorrect or overly specific skills, and output quality degrades as model capability decreases".
- "Requires successful traces": "In domains where even frontier models succeed rarely, the corpus may be too sparse for reliable corpus-level skill extraction".

## Open problems and building blocks

- **Open:** None stated.
- **Released:** Nothing stated.
- **To reuse it:** successful traces (Problem 1); a capable compiler LLM (§ "Limitations"), GPT-4o in §4.2; an environment whose step call takes an action string and returns an observation and the available actions (App. B.4–B.5); per-benchmark prompt slots (App. B).
- **Beyond its domain:** the authors call it "effective for tasks with reusable procedural structure (navigation, web automation, tool use)" (§ "Limitations").

## On this site

- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/harness-general">harness-general</a><a class="tag sub" href="#/tags/harness-promptopt">harness-promptopt</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/promptopt-context">promptopt-context</a><a class="tag sub" href="#/tags/promptopt-general">promptopt-general</a></span>
