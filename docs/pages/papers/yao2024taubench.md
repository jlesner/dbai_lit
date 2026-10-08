# $\tau$-bench: A Benchmark for Tool-Agent-User Interaction in Real-World Domains

**τ-bench** · ICLR 2025

Read: [PDF](https://arxiv.org/pdf/2406.12045) · [arXiv](https://arxiv.org/abs/2406.12045)  
Code: [tau-bench](https://github.com/sierra-research/tau-bench)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- A benchmark of customer-service agents (retail and airline domains) that use database API tools, follow a written domain policy and talk to an LLM-simulated user; each task's hidden user instruction is written so that only one final database state is possible (abstract; §3; §4).
- Graded by a program: the final database must equal the annotated goal state and the agent's replies must contain the required outputs (§3, "Reward"). Introduces pass^k, the chance that all k i.i.d. trials of a task succeed, as a reliability counterpart of pass@k (§3), and runs function-calling, ReAct and Act agents on proprietary and open models (§5).
- A state check on multi-turn agent loops, and the reliability metric that listed [Flat Score, Amplified Failures](#/papers/jang2026flatscore "Flat Score, Amplified Failures: How the Error Budget Masks Damage in Quantized LLM Agents (2026)") and [interwhen](#/papers/bhat2026interwhen "interwhen: A Generalizable Framework for Steering Reasoning Models with Test-time Verification (2026)") meet through its successor τ²-bench. The authors report that gpt-4o's function-calling agent falls below 25% at pass^8 in retail (abstract; §5.1, Fig. 4).

## In plain words

Existing agent benchmarks often give the agent all the information up front (§1); the authors say they do not test interaction with human users or following domain-specific rules, both "vital for deploying them in real world applications" (abstract). τ-bench puts an agent in a customer-service chat with a user played by an LLM; the agent reads and changes a hidden database only through API tools and must obey a written domain policy. Each task's hidden user instruction allows only one final database under the policy, and a program grades a conversation by comparing the final database with the annotated one (§3). The authors also propose "a new metric", pass^k: the chance that all of k repeated runs of a task succeed (abstract; §3). They report that the best agent tested, gpt-4o with its built-in function calling, succeeds on 61.2% of retail and 35.2% of airline tasks (Tab. 2), and that its chance of solving a retail task in all of 8 runs falls below 25% (abstract; §5.1). They present the work as "a novel benchmark" (§6).

## Background and terms

**Terms to know:** [pass@k](#/glossary/passk) · [pass^k (reliability over k trials)](#/glossary/passk-reliability-over-k-trials) · [Markov decision process](#/glossary/markov-decision-process) · [greedy decoding and temperature sampling](#/glossary/greedy-decoding-and-temperature-sampling)

**The paper's own terms:**
- **τ-retail and τ-airline**: the two customer-service domains, an online shop and an airline (§4.1).
- **Domain policy**: a Markdown document given to the agent with the domain's procedures and restrictions; some are enforced by checks inside the API tools, others are left to the agent (§3 "Domain policy").
- **Task instance**: a hidden instruction for the simulated user (identity, intent, preferences) plus an annotation of the ground-truth database write actions and, optionally, outputs the agent must tell the user (§3 "Task instances", Fig. 2d).
- **Reward**: 1 when the final database is identical to the annotated one and the agent's replies contain all required information (in the worked example, the required outputs as substrings); else 0 (§3 "Reward").
- **pass^k** (read "pass hat k"): the paper's metric, "the chance that all k i.i.d. task trials are successful, averaged across tasks" (§3 "Pass^k metric"), i.e. over independent runs of each task. pass^1, the average reward, is the main metric.
- **FC, ReAct, Act**: the agent methods. FC (function calling) uses the model's native tool-call interface, with the policy as system prompt; each turn the model messages the user or calls a tool. ReAct has the model write "Thought: … Action: …" as text, zero-shot; Act drops the thought (§5 "Methods").

**Missing glossary terms:**
- **POMDP** (partially observable Markov decision process): a Markov decision process in which the agent does not see the state itself, only observations of it. The paper casts each task as one: the state is the database plus the simulated user's state, actions are API calls and messages to the user, and the reward depends on the final state (§3).

**Builds on:**
- pass@k, from Chen et al. [5] for code generation checked by unit tests; pass^k is its reliability counterpart (§3).
- ReAct [26] ([ReAct](#/papers/yao2022react "ReAct: Synergizing Reasoning and Acting in Language Models (2023)")), a prompting method interleaving reasoning and actions, run as a baseline (§5).
- Agent benchmarks in web, code-terminal or API environments (§1) and tool-use benchmarks that check function calls (the Berkeley Function Calling Leaderboard, ToolBench, MetaTool; ToolEmu, which emulates tools with LLMs to expose safety risks) (§2). The authors say these have only a single-step user interaction, with all needed information in the first instruction (§2).
- Task-oriented dialogue (systems that help a user complete a task such as a booking), tested on offline datasets such as MultiWOZ [3] or with rule-based simulated users, and LLM simulation of people (Park et al. [15]) (§1, §2).

## Problem and setting

- **Question:** can an LLM agent gather information from a user, use APIs and follow a domain policy, and do so consistently across repeated runs (§1)?
- **Environment (§3):** databases are JSON files, read and written only through deterministic Python API tools; the agent sees neither the database nor the task annotation (Fig. 2). `gpt-4-0613` simulates the user, who sees the instruction and the chat but not the tool calls, and ends the episode with "###STOP###".
- **Data (Tab. 1):** retail has 500 users, 50 products, 1,000 orders, 7 write (database-changing) and 8 non-write tools, and 115 tasks; airline has 500 users, 300 flights, 2,000 reservations, 6 write and 7 non-write tools, and 50 tasks (tool list: Tab. 4).
- **Models (§5):** 12 models through APIs (Tab. 2): four GPT, three Claude 3, two Gemini 1.5, two Mistral, and Llama-3-70B; only open-mixtral-8x22b and Llama-3-70B have open weights. Llama-3 runs via text ReAct, the rest via FC. Small models (7/13B) are not tested "due to the difficulty of the benchmark".
- **Settings (§5):** at most 30 agent actions per task; at least 3 trials per task for the main results; temperature 0.0 for the agent and 1.0 for the user, the variation between runs coming from sampled messages (§3).

## Approach

  - Stage I: hand-designed "simplest possible" schemas, APIs and policies.
  - Stage II: gpt-4 writes code that samples database entries, polished by hand (App. B.2).
  - Stage III: the authors write each user instruction, run a `gpt-4-turbo` FC agent, and revise the instruction until they are "certain no ambiguities exist"; each retail task got more than 40 such trials (§4; Fig. 7's caption: at least 40), and tasks with zero or low success were checked (App. A).
- **Domains (§4.1):** in retail, the agent cancels or modifies pending orders or returns or exchanges delivered ones (each only once), updates addresses or answers questions. In airline, it books, modifies or cancels reservations or gives refunds, under a policy the authors call "more complex" than retail's, with rules on payments, baggage, changes, cancellations and more, which can depend on membership tier and cabin class.
- **Rule-based evaluation:** comparing database states lets the conversation vary; the authors "trade off slow, careful task annotation for fast, faithful evaluation" (§4.2).
- **pass^k estimate (§3):** run each task n times with c successes; pass^k averages, over tasks, the number of ways to pick k successful trials divided by the number of ways to pick any k trials.
- **Modular code (§4, §4.2):** shared environment and user-simulation classes plus per-domain data, tools, policy and tasks; the authors say new domains, tasks or metrics are easy to add "(given they are consistent with the existing domain data)".

## Results

- **Models (Tab. 2, §5.1):** gpt-4o FC is best, at 61.2 (retail) and 35.2 (airline) pass^1, against 44.2 and 34.7 for claude-3-opus and 14.8 and 14.4 for Llama-3-70B; the authors say open-weight models "still have a significant gap" to the best proprietary ones.
- **Methods (Fig. 3, §5.1):** in retail, FC beats ReAct and Act for each of the four GPT models shown; a "think" function for FC agents "did not boost performance".
- **Consistency (Fig. 4, §5.1):** in retail, pass^k falls as k grows while pass@k rises; for gpt-4o FC, pass^8 drops below 25%.
- **Failures (§5.2, Fig. 5):** of 115 retail gpt-4o FC trajectories (one per task), 40 failed, 4 of them from flawed user instructions (then fixed); of the 36 agent failures about 55% were wrong arguments or information, 25% wrong decisions against the policy, and 19% partial handling of compound requests.
- **Invented IDs (§5.2):** per retail task, gpt-4o FC makes 0.46 tool calls with non-existent IDs, against 2.08 for `gpt-3.5-turbo` FC and 6.34 for its Act agent.
- **Policy removed (Tab. 3, §5.2):** pass^1 drops 61.2 → 56.8 (gpt-4o) and 20.0 → 14.5 (gpt-3.5) in retail, and 33.2 → 10.8 and 10.8 → 9.6 in airline. The authors read the retail drops as suggesting successes "mostly stem from using tools in an intuitive and common sense way".
- **Compound tasks (Fig. 6, §5.2):** retail tasks with more ground-truth database writes have lower success.

## Limits the authors state

- A reward of 1 "might be a necessary but not sufficient condition for a successful episode", e.g., the agent may issue a return without the explicit user confirmation the policy requires (§3 "Reward").
- The schemas, APIs and rules "are simplified compared to real-world domains" (§4.2).
- The simulated user (§6 "Directions for improvement"): its instruction "might contain typos or ambiguities"; it "may not contain all domain knowledge"; and the simulator LLM "might have limited capacity at reasoning, calculation, long-context memorization, or alignment with the instruction prompt".
- "The manual annotation process for the benchmark is difficult and requires a deep understanding of both the domain and agent capabilities" (§6).
- "some element of implicit bias" in task curation, since a `gpt-4-turbo` FC agent was used to tune the user prompts (§6).

## Open problems and building blocks

  - more systematic checks in the simulator to ensure unique outcomes, more complex policies, and more metrics of success "(e.g., LM checks that certain rules are followed)" (§6);
  - "alternative ways of using LMs for improving data curation and user simulation" (§6);
  - "more advanced domains (e.g., medical, tax, or legal)" for more capable future agents (§4.1);
  - "Domain-specific fine-tuning or agent code scaffolding might provide some remedy" for rule following (§5.2);
  - for agents: consistency and rule following, "long-horizon information tracking and memory", and focusing on the right information in context, "especially when there may be conflicting facts present" (§6 "Challenges for agents"); better "common sense and numerical reasoning over complex databases and user intents" (§5.2).
- **Released:** "Code and data" (title-page footnote); "We release our codebase publicly to encourage the community to create new tasks and domains" (§4.2); more data-generation code (App. B.2).
- **To reuse it:** an LLM user simulator (`gpt-4-0613`, §3). With a `gpt-4o` FC agent and a `gpt-4` user on retail, the authors report $0.38 (agent) and $0.23 (user) per task; the agent's cost is mainly its long system prompt of policy and function definitions (§5.1 "Cost analysis").

## On this site

- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/harness-general">harness-general</a><a class="tag sub" href="#/tags/llm-method">llm-method</a></span>
