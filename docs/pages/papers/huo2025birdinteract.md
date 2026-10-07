# BIRD-INTERACT: Re-imagining Text-to-SQL Evaluation for Large Language Models via Lens of Dynamic Interactions

**BIRD-INTERACT** · ICLR 2026

Read: [PDF](https://arxiv.org/pdf/2510.05318) · [arXiv](https://arxiv.org/abs/2510.05318)  
Code: [BIRD-Interact](https://github.com/bird-bench/BIRD-Interact)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Multi-turn text-to-SQL: each database comes with a knowledge base, metadata files and a function-driven user simulator, so a model can ask for clarification, retrieve knowledge and recover from errors (abstract).
- Goes beyond read-only operations (abstract).
- Interactive database work with an LLM user simulator constrained to symbolic actions (§3.3); from the BIRD group, like [BIRD](#/papers/li2023bird "Can LLM Already Serve as A Database Interface? A BIg Bench for Large-Scale Database Grounded Text-to-SQLs (2023)") and [SWE-SQL (BIRD-CRITIC)](#/papers/li2025swesql "SWE-SQL: Illuminating LLM Pathways to Solve User SQL Issues in Real-World Applications (2025)").

## In plain words

Most tests of LLMs that turn questions into database queries grade one answer to one clear question. The authors argue that real database work is a conversation: the request is vague, the first query may fail, and the user then asks something that builds on the last answer; existing multi-turn tests either replay a fixed transcript or ask only for read-only queries (abstract, §1). They build a benchmark of 900 two-step tasks in which a model must ask a simulated user for missing details, look things up in the database and its documentation, fix failed queries, and also change data, graded by executable tests. It runs in two modes: a fixed conversation script, and an agent mode where the model picks its actions within a budget. The authors report that GPT-5 completes only 8.67% of tasks in the scripted mode and 17.00% in the agent mode, on the full set (abstract). They present a new benchmark, calling it "the first benchmark that jointly stresses SQL generation, ambiguity resolution, and dynamic interaction with both users and environments" (App. E.1).

## Background and terms

**Terms to know:** [text-to-SQL](#/glossary/text-to-sql) · [gold query](#/glossary/gold-query) · [schema linking](#/glossary/schema-linking) · [stored procedure and trigger](#/glossary/stored-procedure-and-trigger) · [LLM-as-a-judge](#/glossary/llm-as-a-judge) · [abstract syntax tree (AST)](#/glossary/abstract-syntax-tree-ast) · [Pearson correlation](#/glossary/pearson-correlation) · [DML and DDL](#/glossary/sql-statement-categories-ddl-dml-dql-dcl-tcl) (DML statements change rows, DDL statements the schema, such as `ALTER TABLE`, §1)

**The paper's own terms:**
- **Priority and follow-up sub-task**: each task has an ambiguous priority sub-task, then a follow-up released only after the first is solved (§2). **State dependency**: the follow-up may work on data or objects (such as tables) the first sub-task changed or created (§3.2, Tab. 8).
- **BI and DM**: business-intelligence tasks (analytical queries) and data-management tasks (state-changing operations) (§1, App. G).
- **HKB (hierarchical knowledge base)**: each database's domain facts, a graph in which facts can depend on others (§3.1).
- **Ambiguity injection** (§3.2): annotators add *user query ambiguities* (*intent-level*: vague wording such as "elderly people"; *implementation-level*: clear intent, open details such as decimal precision), *knowledge ambiguities* (*one-shot*: a knowledge entry removed; *knowledge chain breaking*: a middle fact of a multi-hop chain masked) and *environmental ambiguities* (noise already in the data, such as NULLs in critical fields). Each comes with a **clarification source**, the ground-truth SQL snippet the simulated user answers from.
- **Function-driven user simulator** (§3.3): stage 1, an LLM maps the model's question to `AMB` (a pre-annotated ambiguity), `LOC` (another reasonable question, answered by locating the relevant part of the ground-truth SQL through its AST, App. N) or `UNA` (refuse, e.g. a request for the answer); stage 2 writes the reply from that action.
- **c-Interact** (conversational): a fixed protocol of clarification, SQL submission and one debugging retry per sub-task after execution feedback; failing the priority sub-task ends the session (§4.1). **a-Interact** (agentic): nine tools (run SQL, read schema, column meanings and knowledge, ask the user, submit) in the ReAct style ([ReAct](#/papers/yao2022react "ReAct: Synergizing Reasoning and Acting in Language Models (2023)"): the model alternates reasoning and tool calls), each with a cost (§4.2, Tab. 9).
- **Budget-constrained awareness testing**: interactions are capped and the model is told the remaining budget: in c-Interact, clarification turns equal to the annotated ambiguities plus a "user patience" allowance; in a-Interact, a base budget plus twice each, spent by tool costs (`ask` 2, `submit` 3, others 0.5–1) (§4, Tab. 9).
- **Success rate (SR)**: the share of sub-tasks whose SQL passes all test cases, per sub-task and cumulative (§2, Tab. 2). **Normalized reward**: weights the priority sub-task 0.7 and the follow-up 0.3, with less after debugging in c-Interact (0.5 and 0.2) (App. F.2).
- **Interaction test-time scaling (ITS)**: how success changes as more interaction turns are allowed. A model satisfies the "ITS Law" "if, given enough interactive turns, its performance can match or even surpass that of the idealized single-turn task" (§5.2).
- **UserSim-Guard**: 2,100 questions with human-labelled reference actions, for testing user simulators (§6, App. O.1).

**Missing glossary terms:**
- **CRUD**: Create, Read, Update, Delete, the basic kinds of data operation (§3.4).

**Builds on:**
- LiveSQLBench, an open single-turn text-to-SQL benchmark whose tasks, databases, metadata and HKB the authors make interactive (§1, §3.1); not listed here.
- Static multi-turn text-to-SQL benchmarks (SParC, CoSQL, CHASE, Learn-to-Clarify) with fixed transcripts, the main contrast (§1, §7).
- LLM-simulated users in the agent benchmarks MINT and τ-bench (§3.3, §7).
- Benchmarks compared in Tab. 4 (App. E.1), among them BIRD ([BIRD](#/papers/li2023bird "Can LLM Already Serve as A Database Interface? A BIg Bench for Large-Scale Database Grounded Text-to-SQLs (2023)")), BIRD-Critic ([SWE-SQL (BIRD-CRITIC)](#/papers/li2025swesql "SWE-SQL: Illuminating LLM Pathways to Solve User SQL Issues in Real-World Applications (2025)")), Spider 2.0 ([Spider 2.0](#/papers/lei2024spider2 "Spider 2.0: Evaluating Language Models on Real-World Enterprise Text-to-SQL Workflows (2025)")) and AMBROSIA ([AMBROSIA](#/papers/saparina2024ambrosia "AMBROSIA: A Benchmark for Parsing Ambiguous Questions into Database Queries (2024)")).

## Problem and setting

- **Question:** how well do LLMs do text-to-SQL when they must resolve ambiguity, recover from errors, and handle follow-ups that depend on earlier results or changed state (§1, §2)?
- **Data:** Full, 600 tasks over 22 databases; Lite, 300 tasks over 18 databases, with "simplified databases" (abstract) (Tab. 1, Tab. 5).
- **Correctness:** a sub-task is correct if its SQL passes all its test cases (§2). BI sub-tasks use a default "soft exact-match" script that strips comments, `DISTINCT` and `ROUND` wrappers from both queries and compares execution results under task-specific conditions such as ignoring row order; DM sub-tasks use hand-written scripts that check postconditions on the database state (App. G).
- **Runs:** PostgreSQL 14 in a fresh Docker instance; seven system models (two open-source, five closed); temperature 0, top_p 1, default reasoning settings; patience 3 and a-Interact base budget 6 by default; "single runs due to cost" (§5, App. I.3).
- **Assumptions:** each ambiguous query should be "unsolvable without clarification yet fully reconstructable once clarifications are provided" (§3.2). NULLs appear as environmental noise and as an implementation-level ambiguity type (Tab. 7). Whether results are compared as sets or bags is not discussed, and the text does not name the LLM behind the user simulator in the main runs.

## Approach

- **Tasks (§3.2, App. H):** annotators inject ambiguities into LiveSQLBench tasks and the HKB and add one follow-up of six types (Tab. 8: constraint change, topic pivot, attribute change, result-based, aggregation, state-dependent). Ambiguities can chain: a clarification may point to a masked knowledge entry, sending the model back to the user (App. H.3).
- **Simulated user (§3.3):** the two-stage design targets two issues the authors observe in LLM simulators: "they sometimes leak information from ground-truth SQL query" and "they may deviate from the original task requirements".
- **Analyses:** memory grafting; ITS over patience values 0, 3, 5 and 7 on Lite (App. I.3); action distributions (App. J).

## Results

- **Difficulty (Tab. 2, §5.1):** on Full, few tasks are solved end to end, "with most models falling in substantially lower rates"; GPT-5 completes 8.67% in c-Interact against 17.00% in a-Interact. Follow-ups are "noticeably more challenging", "likely" from the longer context. BI is harder than DM, the authors say since DM operations "typically follow standardized, predictable patterns".
- **Mode matters (§5.1):** GPT-5 has the lowest priority sub-task SR of the seven in c-Interact and the highest in a-Interact; the authors "hypothesize" this stems from training data and architectural biases.
- **Memory grafting (§5.2, Fig. 5):** with clarification histories grafted from Qwen-3-Coder or O3-mini, GPT-5's success rises from 13.8% to 18.8% and 20.5%, which the authors read as strong SQL generation needing "a more effective communication schema".
- **ITS (§5.2, Fig. 4):** on Lite, Claude-3.7-Sonnet "exhibits clear scaling behavior" as more interaction is allowed, measured against each model's single-turn score on unambiguous tasks.
- **Trial and error (§5.2, App. J.3):** `submit` and `ask`, the costliest actions, make up 60.87% of a-Interact actions, over cheaper lookups, "likely due to pre-training biases". On Full, across systems the share of `execute` calls correlates negatively with priority sub-task success.
- **Errors (App. M):** in 50 sampled failures, "over 80%" of errors came from incomplete ambiguity resolution (in many cases too few, no, or misdirected clarification questions).
- **Simulator (§6, Fig. 6, Tab. 11):** on unanswerable UserSim-Guard questions, judged by an LLM (Qwen3-235B), baseline single-prompt simulators fail up to 67.4% of the time depending on the backbone, against as low as 2.7% for the function-driven one.
- **Human users (§6, Tab. 3):** on 100 sampled tasks, success rates with the function-driven GPT-4o simulator correlate with those under human expert users at Pearson 0.84 (p = 0.02), against 0.61 (p = 0.14) for the baseline.

## Limits the authors state

- The simulator is given the reference SQL: "While in real-world scenarios, real users may only have vague initial goals without an answer when making a request, this pragmatic design choice enhances evaluation reliability" (App. D).
- Single runs, "due to the high cost of commercial API calls and the deterministic nature of the outputs under these settings" (App. I.3).
- a-Interact "imposes strict budget constraints that create a stress-mode evaluation environment" (§8).
- Reward and success rate can diverge because the reward gives 70% to the priority sub-task and 30% to the follow-up (§5.1).
- The work "has centered on the text-to-SQL domain" (App. A).

## Open problems and building blocks

  - A post-trained, human-aligned local user simulator, for more reliable responses and lower API cost (§8).
  - A "free-mode" a-Interact setting without the budget, to compare with stress mode (§8).
  - "Future work should incentivize broader tool utilization for complex interactive tasks" (§5.2).
  - Whether single-turn systems work in multi-turn settings "remains an open question" (§7).
- **Released:** the authors "will publicly release all components under a permissive license, including databases, tasks, hierarchical knowledge bases, documentation, interaction logs, and the source code for both evaluation settings and the user simulator", and trajectories "upon publication" (§ "Reproducibility Statement"); databases under CC BY-SA 4.0 (Tab. 5); all prompts in App. R.
- **To reuse it:** PostgreSQL 14 in Docker (§5); system models through APIs; the simulator costs about 0.03 USD per task (Tab. 2 caption); the simulator judging ran on 4 A100 80G GPUs (§ "Reproducibility Statement"); custom agents keep the costs of `ask`, `submit` and `execute` and price other environment actions at 0.5 or 1.0 by token counts (App. J.2).
- **Beyond its domain:** the authors "believe our proposed interaction evaluation is not inherently limited to it", naming Python code synthesis and API call generation (App. A).

## On this site

- **Tags:** <span class="tags"><a class="tag" href="#/tags/dbtask">dbtask</a><a class="tag sub" href="#/tags/harness-sql">harness-sql</a><a class="tag sub" href="#/tags/llm-gen">llm-gen</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/nl2sql-misc">nl2sql-misc</a></span>
