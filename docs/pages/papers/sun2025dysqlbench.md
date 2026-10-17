# Rethinking Text-to-SQL: Dynamic Multi-turn SQL Interaction for Real-world Database Exploration

**DySQL-Bench** · preprint 2025

Read: [PDF](https://arxiv.org/pdf/2510.26495) · [arXiv](https://arxiv.org/abs/2510.26495)  
Code: [Real-World-SQL-Bench](https://github.com/Aurora-slz/Real-World-SQL-Bench)

<p class="notice">A summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- A benchmark of dynamic, multi-turn text-to-SQL over 13 SQLite databases from BIRD and Spider 2: an LLM-simulated user (Qwen2.5-72B-Instruct) follows a task instruction over several turns, and the model under test talks to it and runs SQL, including INSERT, UPDATE and DELETE (abstract; §IV-D; §V).
- Tasks are written by GPT-4.1 from per-record trees built along foreign keys, filtered by a committee of two LLM validators and an executability test, then reviewed by ten human experts (§IV-A–C); a run counts as solved when a hash of the final database equals that left by the task's golden action list (§III), and reliability is pass^k from τ-bench (§VI-A).
- Grading by the final database state, not by query results: τ-bench's state check and pass^k ([τ-bench](#/papers/yao2024taubench "$\tau$-bench: A Benchmark for Tool-Agent-User Interaction in Real-World Domains (2025)")) carried over to SQL writes (our reading; the paper cites τ-bench for pass^k, §VI-A), beside [BIRD-INTERACT](#/papers/huo2025birdinteract "BIRD-INTERACT: Re-imagining Text-to-SQL Evaluation for Large Language Models via Lens of Dynamic Interactions (2026)"). The authors report GPT-4o at 23.81% on pass^5 (abstract).

## In plain words

Most benchmarks for writing database queries from questions ask for one query per question. The authors argue that in many real-world scenarios users refine their requests over several turns and also change data, so a model must adapt to "evolving user intents" (abstract; §I). They build DySQL-Bench: an LLM plays a user following a written task, the model under test talks with it and runs SQL on a real database, reading, adding, changing and deleting rows, and a run is solved when the database ends in the state a reference list of SQL statements leaves. Tasks are written by an LLM, filtered by other LLMs, then reviewed by people; the authors report that their generated data "achieves 100% correctness" under human evaluation (abstract). They report that "even advanced models such as GPT-4o achieve only 58.34% overall accuracy and 23.81% on the Passˆ5 metric" (abstract), the second being the chance that five independent tries of a task all succeed; no comparison stated. They call it "the first benchmark explicitly designed to evaluate models in dynamic, multi-turn Text-to-SQL scenarios" (§I).

## Background and terms

**Terms to know:** [text-to-SQL](#/glossary/text-to-sql) · [pass^k](#/glossary/passk-reliability-over-k-trials) · [SQL statement categories (DDL, DML, DQL)](#/glossary/sql-statement-categories-ddl-dml-dql-dcl-tcl) · [gold query](#/glossary/gold-query) · [ReAct](#/glossary/react) · [LLM-as-a-judge](#/glossary/llm-as-a-judge) · [Cohen's kappa](#/glossary/cohens-kappa)

**The paper's own terms:**
- **CRUD**: Create, Read, Update, Delete, i.e. the SQL statements INSERT, SELECT, UPDATE and DELETE; "full CRUD" means a benchmark includes all four, not only SELECT (§I; §IV-D).
- **Dynamic vs static evaluation**: in a static benchmark the dialogue history is given in advance (§II-C calls such histories "static and noise-free"); in a dynamic one a simulated user reacts to what the model actually says and does (§I; §V). Tab. I classifies earlier datasets this way.
- **Simulated user, evaluated agent, database environment**: the three roles (§V, Fig. 5). The simulated user is an LLM whose system message holds the task instruction (example: Fig. 6); the agent gets the schema as DDL, i.e. the `CREATE TABLE` statements (§V "Interaction Roles").
- **Golden action list**: the reference sequence of SQL statements for a task, built by synthesis and manual validation (§III). In the glossary's terms it plays the role of a gold query, for a whole dialogue.
- **Short / Long tasks**: golden lists of fewer than three actions, or of three or more (§IV-D).
- **Primary table and tree representation**: per database, a table whose records are the core entities; each record becomes the root of a tree of the records linked to it by foreign keys, stored as JSON (§IV-A, Fig. 3).
- **Verifier Committee**: LLM validators that check each generated task (§IV-B), in the glossary's terms an LLM-as-a-judge panel over generated data; **Quality Assurance Board**: ten human experts who inspect every remaining task (§IV-B; §IV-C).
- **Extrinsic hallucination**: here, the agent writing an SQL query and then inventing its result instead of waiting for the database; the term comes from the taxonomy of Bang et al. [44] (§VI-D).

**Builds on:**
- τ-bench (Yao et al. [34], [τ-bench](#/papers/yao2024taubench "$\tau$-bench: A Benchmark for Tool-Agent-User Interaction in Real-World Domains (2025)")), a benchmark of tool-using customer-service agents with an LLM-simulated user: the source of the pass^k metric (§VI-A "Metric"); the authors note that such agent work has "not been adapted to the Text-to-SQL context" (§II-C).
- BIRD ([BIRD](#/papers/li2023bird "Can LLM Already Serve as A Database Interface? A BIg Bench for Large-Scale Database Grounded Text-to-SQLs (2023)")) and Spider 2 ([Spider 2.0](#/papers/lei2024spider2 "Spider 2.0: Evaluating Language Models on Real-World Enterprise Text-to-SQL Workflows (2025)")), text-to-SQL benchmarks over large real-world databases: the source of its 13 databases (§IV), and among the benchmarks Tab. I compares against.
- CoSQL, a conversational extension of the Spider benchmark ([Spider](#/papers/yu2018spider "Spider: A Large-Scale Human-Labeled Dataset for Complex and Cross-Domain Semantic Parsing and Text-to-SQL Task (2018)")), and MultiSQL, which the authors call "an early effort toward covering the full CRUD spectrum" (§I; §II-C; Tab. I).

## Problem and setting

- **Question:** can LLMs handle text-to-SQL when the user's goal unfolds over several turns, the model must change data as well as read it, and the model's own actions shape the conversation? The authors name three gaps: limited multi-turn coverage, an incomplete CRUD spectrum, and no standardized protocol for "stateful execution" across turns (§I).
- **What counts as solved (§III):** the model's SQL actions and the golden list are run on identical copies of the starting database. All tables are read in a fixed order, serialized, and hashed, with timestamp-like columns (e.g. `updated_at`, `created_at`) left out; equal hashes mean solved, otherwise unsolved. How the answers the agent gives the user from SELECT queries are judged is not discussed, nor is the number of trials per task behind pass^k.
- **Data:** 13 SQLite databases (an embedded, file-based database engine) from BIRD and Spider 2, in sports, entertainment and business domains, each of the 13 sub-tasks with its own database (§IV-D; §V); 1,072 tasks (abstract; Tab. II). UPDATE is the most common statement type (§IV-D, Tab. II).
- **Interaction (§V "Interaction Logic"):** the user opens; the agent may reply or ask for information, run SQL, or reason internally; the dialogue ends when the user writes `###STOP###` or after a turn limit, set to 30 (§VI-A "Hyperparameters").
- **Models (§VI-A "Hyperparameters"):** GPT-4o, DeepSeek-V3, Qwen2.5-Max, Qwen2.5-72B-Instruct, Llama-3.1-70B-Instruct, OmniSQL-32B (a text-to-SQL model), Qwen3-32B, Qwen3-Coder-30B-A3B-Instruct and Gemini-2.5-Flash; [temperature](#/glossary/greedy-decoding-and-temperature-sampling) 0.6, [top_p 0.95, top_k 20](#/glossary/top-k-and-nucleus-top-p-sampling); zero-shot unless stated (§VI-G). The simulated user is Qwen2.5-72B-Instruct (§V; §VI-A).

## Approach

- **Sampling trees instead of live queries (§IV-A).** Sampling through live SQL queries "can be inefficient" on large real-world databases, so each database is turned into one tree per primary-table record (e.g. one per bowler in `bowling`), following foreign keys recursively. GPT-4.1 receives a tree and writes a user instruction with its golden actions.
- **Filtering (§IV-B).** Generated tasks often have critical issues, including instructions that don't match the actions, invented columns, or SQL that won't run. A Verifier Committee checks each task: each validator runs a set number of independent checks, and a task counts as verified only if all the checks of two distinct validators, DeepSeek-r1 and Qwen3-235B-A22B-2507 (two LLMs), accept it. A refinement step then writes parameters the golden actions need back into the instruction, a second committee round follows, and tasks whose golden actions fail to execute in a mock runtime are dropped.
- **Human review (§IV-C).** Every remaining task is inspected by the ten-expert board for agreement between instruction and SQL, valid SQL against the schema, and correct execution; disagreements are settled by discussion.
- **Evaluation loop (§V, Fig. 5)** and **pass^k (§VI-A "Metric", Eq. 1):** for each task, the probability that k randomly chosen runs out of n are all successful, averaged over tasks; the paper reports k = 1, 3, 5.
- **Detecting hallucination (§VI-D):** a trajectory counts as hallucinating when an SQL code block is immediately followed by the `<result>` tag that the environment, not the model, is meant to write.

## Results

- **Human evaluation:** the authors report "100% correctness" of the synthesized data (abstract) and a "near-perfect" agreement among the experts, given as more than 99.5% Cohen's κ (§IV-C).
- **Main results (§VI-B; Tabs. III–V for Short, Long, all tasks):** besides the abstract's GPT-4o figures, Qwen2.5-Max is strongest at pass^1, "reaching state-of-the-art results on 7 out of 13 databases", and Qwen2.5-72B-Instruct beats it on some databases. The authors read the results as performance that "generally improves with scale" below about 70B parameters, with diminishing gains beyond.
- **Reliability over trials (§VI-C):** for Short and Long tasks alike, all models' accuracy "drops significantly" as k grows, while the ranking stays "largely consistent". Qwen2.5-72B-Instruct and Qwen2.5-Max are highest on most databases; models such as DeepSeek-V3, Gemini-2.5-Flash, Qwen3-32B and Qwen3-Coder degrade fast, with "some tasks eventually reaching an accuracy of zero".
- **Invented query results (§VI-D, Fig. 9):** hallucination rates of 44.28% for DeepSeek-V3 and 26.15% for OmniSQL-32B, against 0.09% for GPT-4o. The authors "hypothesize" this comes from post-training on step-by-step solutions that print intermediate results (example: Fig. 10).
- **Dialogue length and failed SQL calls (§VI-E, Figs. 7–8):** on `car` and `retail_world` (Fig. 7), DeepSeek-V3's dialogues are long-tailed and much longer, which the authors attribute to [GRPO](#/glossary/grpo) post-training that "likely" encourages longer responses. GPT-4o and DeepSeek-V3 issue SQL that fails less often from syntax errors than Qwen2.5-72B-Instruct's yet solve fewer tasks; the authors say this gap "suggests" that intent understanding, multi-turn planning and schema-aware SQL writing, "rather than surface-level SQL correctness", are the main bottlenecks for those two models "on our benchmark".
- **Failure cases (§VI-F, Figs. 11–12):** a repetition loop after a correct SQL execution, observed "frequently" with OmniSQL-32B, and a refusal to verify a user by an employee ID the user offered.
- **Few-shot prompting (§VI-G, Tab. VI):** on three databases, average score rises from 62.60 to 64.68 for GPT-4o and from 63.39 to 65.52 for Qwen2.5-72B with three examples; gains plateau beyond two.

## Limits the authors state

The paper has no limitations section. Caveats it states:
- The LLM-generated instructions "sometimes omitted necessary parameters due to limitations of the initial prompting", which the refinement step addresses (§IV-B).
- The automatic pipeline "effectively eliminates the majority of noisy data", but "ensuring benchmark rigor requires human oversight" (§IV-B).
- Constructing an effective user simulator for this task "remains non-trivial: it must balance database realism with controlled answer spaces and schema constraints" (§II-C).
- "relying solely on Passˆ1 can lead to considerable variance in results", since a single interaction "may be influenced by random fluctuations in model behavior or user simulation" (§VI-C).
- Few-shot prompting "remains insufficient for handling deeper schema reasoning or cross-domain transfer" (§VI-G).

## Open problems and building blocks

  - Hallucination in multi-turn dialogue "remains a critical challenge" (§VI-D heading).
  - Bottleneck named: intent understanding, multi-turn planning and schema-aware SQL synthesis, with "room for improvement in generating higher-quality, goal-satisfying SQL over extended dialogues" (§VI-E).
  - "the need for more pragmatic interaction handling mechanisms" when the user has given enough information, and for balancing one-shot SQL skill with "multi-turn interaction fluency and termination policies" (§VI-F).
  - "Future work may integrate schema-aware pretraining or reinforcement learning-based adaptation" (§VI-G).
- **Released:** "All code and benchmark data are publicly available" (abstract).
- **To reuse it:** an LLM to play the user (Qwen2.5-72B-Instruct here); the 13 SQLite databases; the agent gets the schema as DDL (§V). For models up to 70B, the authors used one server with eight H200 GPUs, four serving the simulated user and four the evaluated model; closed models were called through APIs (§VI-A "Implementation Details").

## On this site

- **Discussed in:** [Checking text-to-SQL against intent](#/challenges/text_to_sql_verification)
- **Tags:** <span class="tags"><a class="tag" href="#/tags/dbtask">dbtask</a><a class="tag sub" href="#/tags/harness-sql">harness-sql</a><a class="tag sub" href="#/tags/llm-gen">llm-gen</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/nl2sql-eval">nl2sql-eval</a></span>
