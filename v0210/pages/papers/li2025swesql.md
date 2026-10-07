# SWE-SQL: Illuminating LLM Pathways to Solve User SQL Issues in Real-World Applications

**SWE-SQL (BIRD-CRITIC)** · NeurIPS 2025

Read: [PDF](https://arxiv.org/pdf/2506.18951) · [arXiv](https://arxiv.org/abs/2506.18951)  
Code: [BIRD-CRITIC-1](https://github.com/bird-bench/BIRD-CRITIC-1)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- BIRD-CRITIC: a benchmark of debugging SQL issues, distilled from real user issues and replayed in new environments, with a PostgreSQL set and a multi-dialect set (abstract).
- Baselines with reasoning models; the paper also targets open-source models for the task (abstract).
- Repairing SQL against an executable check, rather than writing a fresh query.

## In plain words

Fixing a user's broken SQL query "often demands considerable manual efforts, domain expertise, and time", and the authors say LLMs have not been systematically tested on this repair task (§1). They build BIRD-CRITIC: Stack Overflow questions about broken SQL, rebuilt by trained annotators on altered copies of existing databases, each with a hand-written test script; one set is PostgreSQL-only, the other spans four database systems (abstract, §3). They present it as, "As far as we know, … the first debugging benchmark for SQL applications" (§3).

The best tested model, OpenAI's o3-mini, used directly without an agent loop, fixes 38.87% of the PostgreSQL tasks and 33.33% of the multi-system ones (abstract). For small open models that run locally, protecting private data, they make training tasks by breaking correct queries, record a stronger model's fixing sessions, guided by a plan derived from the known fix, and fine-tune on them. Their fine-tuned 14-billion-parameter Qwen model scores 38.11% and 29.65%, which they describe as "surpassing many leading proprietary models such as Claude-3.7-Sonnet and GPT-4.1" (abstract), comparing with those models used the same way (§6).

## Background and terms

**Terms to know:** [text-to-SQL](#/glossary/text-to-sql) · [execution accuracy](#/glossary/execution-accuracy) · [SQL dialect](#/glossary/sql-dialect) · [data contamination](#/glossary/data-contamination) · [Distillation into compact models](#/glossary/distillation) · [rejection sampling](#/glossary/rejection-sampling) · [LoRA (low-rank adaptation)](#/glossary/lora-low-rank-adaptation) · [DML, DDL and DCL](#/glossary/sql-statement-categories-ddl-dml-dql-dcl-tcl) (with the examples UPDATE, INSERT, DELETE; CREATE, ALTER; GRANT, REVOKE; App. C)

**The paper's own terms:**
- **issue SQL, user issue query, solution SQL**: the faulty query, the natural-language description of problem and intent, and the corrected reference query (§2, §3).
- **Success Rate (SR)**: the share of tasks whose predicted query passes all test cases of the task's evaluation script (§3, App. D).
- **query-like, management and personalization issues**: the three issue categories. Query-like issues are mainly SELECT queries; management issues change data, schema or permissions, or are complex multi-step procedures; personalization issues constrain the solution itself, e.g. requiring or forbidding SQL features (App. C).
- **SQL-Rewind** and **Six-Gym** (Sql-fIX-Gym): the automatic making of training tasks by introducing an issue into a correct query, and the training environment of tasks it produces (§4).
- **SQL-Act / Tool-Act**: two agent designs. SQL-Act's action is any SQL statement, run on the database; Tool-Act picks from fixed tools (inspect the schema, preview rows, submit the solution) (§5.1, App. G.3).
- **trajectory**: an agent's logged thoughts, SQL actions and database responses on one task (§5.1).
- **f-plan (functional plan)**: a step-by-step plan, written as pseudo-functional code, of the debugging operations that turn the issue SQL into the solution (§1, §5.2).
- **Bird-Fixer**: a small open model fine-tuned on f-plan trajectories, run with SQL-Act and GTM (§5).
- **GTM (Generative Thought Mode)**: at each step the fine-tuned model writes the thought, and the original base model writes the SQL action from it (§5.2 "Generative Thought Mode (GTM)").

**Missing glossary terms:**
- **ReAct**: an agent loop that interleaves a reasoning step (thought), an action on the environment, and the environment's response (observation) (§5.1; App. G.3).

**Builds on:**
- SWE-Gym, a training environment for software-engineering agents: Six-Gym is "inspired by" it, and it is cited for the "common practice" of fine-tuning small models on a teacher's trajectories (§1).
- ReAct ([ReAct](#/papers/yao2022react "ReAct: Synergizing Reasoning and Acting in Language Models (2023)")) and CodeAct (agents whose actions are generated code): SQL-Act builds on ReAct and is a SQL variant of CodeAct (§5.1, §6.1).
- BIRD ([BIRD](#/papers/li2023bird "Can LLM Already Serve as A Database Interface? A BIg Bench for Large-Scale Database Grounded Text-to-SQLs (2023)")), a text-to-SQL benchmark: its development databases host BIRD-CRITIC, its training databases Six-Gym (§3 "Environment Setup", §4).
- Spider-Agent (from Spider 2.0, [Spider 2.0](#/papers/lei2024spider2 "Spider 2.0: Evaluating Language Models on Real-World Enterprise Text-to-SQL Workflows (2025)"), enterprise text-to-SQL) and InterCode (an interactive coding benchmark): Tool-Act follows them (§6.1).

## Problem and setting

- **The question:** can LLMs, alone or as agents, repair faulty SQL given the issue description, schema and issue SQL, preserving the user's intent (§2); and can small open models be trained to do it (§1)?
- **Data:** 530 PostgreSQL tasks (BIRD-CRITIC-PG) and 570 tasks across PostgreSQL, MySQL, SQL Server and Oracle (BIRD-CRITIC-Multi) (Tab. 1, §1), from Stack Overflow issues (§3 "Environment Setup"). Issues were kept when they met at least 3 of 4 quality criteria (App. A.3).
- **Against contamination:** the BIRD databases were migrated from SQLite to the four systems with refined table and column names, adjusted data types and "guarded alterations" to the schema (§3 "Environment Setup"); Six-Gym excludes every issue used in BIRD-CRITIC and uses only BIRD's training databases (§4 "Solution SQL Collection").
- **What counts as correct:** passing all tests of a per-task Python and SQL script (§3). For query-like issues, the predicted and reference queries are run and their result sets compared, "typically accommodating variations in tuple ordering unless explicitly constrained by the task specifications"; for management issues, "domain experts manually design test cases"; personalization issues add compliance checks (App. C). Strict execution matching, the authors argue, would fail valid fixes that change database state (§1). How duplicates and NULLs are treated in the result comparison is not discussed.
- **Evaluation:** single-turn (App. I); eight general-purpose and four reasoning models (§6.1); open-model results average five runs (App. G.2).

## Approach

- **Building the benchmark (§3):** 10 tested annotators and 3 senior experts. Annotators distill intent and error cause, map the issue to a database, confirm it reproduces, write the solution and test script, then cross-check, including "red teaming" the SQL by planting errors the scripts must catch ("Validation").
- **SQL-Rewind (§4):** Gemini-2.0-Flash adapts SQL mined from Stack Overflow to 12 BIRD training databases; queries that run without error and return a non-null result become solutions. It then writes the issue's cause, a broken issue SQL and tests meant to pass the solution and fail the issue SQL, checks them for coherence, and writes a user description. This yields "approximately 3,301" instances (§4); App. E.3 compares their statistics with BIRD-CRITIC-PG (Tab. 8).
- **f-Plan Boosting (§5.2):** standard practice keeps only the teacher's trajectories that reach the reference solution. Here the teacher (Gemini-2.0-Flash) sees the problem and the correct query and writes an f-plan (backward inference); then, from the problem and plan only, it solves the task with SQL-Act, and the plan is accepted only if the SQL passes every test (forward validation). The plan is dropped and only the trace kept for training: "a two-phase self-distillation loop".
- **Fine-tuning and inference (§5.2):** open models are fine-tuned with LoRA on these trajectories. With GTM, only the fine-tuned model's thought is kept and the base model writes the SQL. The authors' reason: generalization "can degrade" when one model predicts both, as it "tends to overfit to the SQL patterns seen during fine-tuning", while the base model brings "wide-coverage knowledge of diverse SQL dialects".

## Results

- **Baselines (Tab. 2, §6.2):** o3-mini is best: 38.87% on PG and 33.33% on Multi, "leaving large head-room for future research". Reasoning models beat general-purpose ones on average. Data-management issues are "relatively more manageable"; query-like issues "present the greatest challenge for all LLMs", and Fig. 5 shows a strong negative correlation between a category's query diversity and success rate. Gemini-2.0-Flash-Thinking is weak on PostgreSQL but best on SQL Server, which the authors call "plausibly attributable" to training data.
- **Agents (Fig. 4):** for four models on PG, agents beat base models; SQL-Act "mostly outperforms" Tool-Act (§6.2).
- **Bird-Fixer (Tab. 3, §6.3):** it improves all four backbones (Llama-3.1-8B, Qwen-2.5-Coder-7B and -14B, Phi-4) on both sets. On Qwen-2.5-Coder-14B: 31.32% → 38.11% on PG and 24.04% → 29.65% on Multi, against GPT-4.1's 37.36% and 29.12% without an agent loop (Tab. 2). The authors call it competitive with o3-mini and above the Claude-3.7-Sonnet agent on PG (§6.3). As plain SQL-Act agents without fine-tuning, several small models score below their base scores, suggesting to the authors that "long, complicated interaction histories can overwhelm SLMs" (small language models). Bird-Fixer is fine-tuned only on PostgreSQL trajectories; the authors credit GTM for its multi-dialect results.
- **Trajectory collection (Tab. 4, §6.4):** on Six-Gym, one plain teacher rollout yields 1,254 successful trajectories, f-Plan 2,178 (+73.7%), rejection sampling with up to 5 tries 1,910, and both combined 2,560. The authors say f-Plan does this "while maintaining similar runtime and overhead". f-Plan's gain over rejection sampling grows with the issue SQL's number of clauses (App. E.3, Tab. 9).
- **Ablation (Fig. 6, §6.5):** on PG with Qwen-2.5-Coder-14B, removing GTM drops Bird-Fixer from 38.11% to 33.33%, and training on plain trajectories without f-Plan drops it to 32.45%.
- **Error analysis (§6.6, Fig. 8):** in 100 sampled failures of four agents on PG, the four error modes are projection mismatch, chain of errors, syntax errors and incorrect logic, "the most prevalent" at 44.5%.

## Limits the authors state

- The work "primarily focuses on SQL content and knowledge by simplifying the impact of external workflows through containerized Docker environments". In preliminary experiments where models must also save results to files, success rates dropped "from approximately 30% to 10%" (App. I).
- BIRD-CRITIC uses single-turn evaluation, while "real-world applications typically require crucial interaction between users and agents", since most users cannot state their intent with complete clarity (App. I).

## Open problems and building blocks

  - Workflow operations such as file reading and editing, "important considerations for future development in BIRD-CRITIC 1.5"; and extending BIRD-CRITIC to dynamic, multi-turn user–SQL debugging, where they point to their BIRD-Interact ([BIRD-INTERACT](#/papers/huo2025birdinteract "BIRD-INTERACT: Re-imagining Text-to-SQL Evaluation for Large Language Models via Lens of Dynamic Interactions (2026)")) (App. I).
  - From the error analysis, "future improvements should emphasize logical and schema-aware reasoning, cross-step dependency tracking, and dialect-robust SQL generation rather than mere syntactic refinement" (§6.6).
- **Released:** no release statement; the title page links a project page, and the abstract calls Bird-Fixer "an open-source agent".
- **To reuse it:** Docker containers for the four database systems (App. A.1). LoRA fine-tuning on 8×H100 GPUs, 22–36 GPU hours per backbone (App. G.2, Tab. 10); a teacher model for trajectories (Tab. 4 costs); both the fine-tuned and the base model at inference for GTM (§5.2). Proprietary-model API cost was "around $200 USD" (App. G.2).
- **Beyond its domain:** the authors offer "a workflow for constructing robust benchmarks from diverse open platforms, such as StackOverflow" (App. J).

## On this site

- **Tags:** <span class="tags"><a class="tag" href="#/tags/dbtask">dbtask</a><a class="tag sub" href="#/tags/harness-sql">harness-sql</a><a class="tag sub" href="#/tags/llm-gen">llm-gen</a><a class="tag sub" href="#/tags/llm-method">llm-method</a></span>
