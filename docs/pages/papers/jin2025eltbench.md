# ELT-Bench: An End-to-End Benchmark for Evaluating AI Agents on ELT Pipelines

**ELT-Bench** · preprint 2025

Read: [PDF](https://arxiv.org/pdf/2504.04808) · [arXiv](https://arxiv.org/abs/2504.04808)  
Code: [ELT-Bench](https://github.com/uiuc-kang-lab/ELT-Bench)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- An end-to-end benchmark of AI agents building Extract-Load-Transform pipelines (abstract).
- Pipelines with source tables and data models across domains (abstract).
- Data-engineering agents beyond single queries; its benchmark errors are the subject of [ELT-Bench-Verified](#/papers/zanoli2026eltverified "ELT-Bench-Verified: Benchmark Quality Issues Underestimate AI Agent Capabilities (2026)").

## In plain words

Companies move data from many places (databases, web APIs, cloud storage, files) into one central analytics database, then write SQL that reshapes it into the tables analysts use. Designing such an Extract-Load-Transform pipeline often takes significant manual work (abstract); the authors cite prior estimates that building pipelines takes most of data engineers' time on data-warehousing projects (§1). They say current benchmarks in data engineering test only isolated tasks, such as using data tools or writing transformation queries, leaving a gap in evaluating agents on whole pipelines (abstract).

They build ELT-Bench: 100 pipelines, each in a prepared sandbox with real tools, where the agent must load every source and then write the SQL for the target tables (§1–2). They test two agent frameworks with six LLMs. The best, Spider-Agent with Claude-3.7-Sonnet with extended thinking, loads all data for 57% of pipelines but builds only 3.9% of target tables correctly, against 37% and 1% for the best non-reasoning agent, SWE-Agent with Claude-3.5-Sonnet (Tab. 4, §3.3). They present it as "the first benchmark that covers the entire workflow for building ELT pipelines" (§1).

## Background and terms

**Terms to know:** [text-to-SQL](#/glossary/text-to-sql) · [gold query](#/glossary/gold-query) · [pass@k](#/glossary/passk) · [pass^k](#/glossary/passk-reliability-over-k-trials) · [agent harness](#/glossary/agent-harness) (the paper says "code agent framework")

**The paper's own terms:**
- **Data extraction & loading stage (Stage 1)**: copying every source table into the warehouse with the data-integration tool Airbyte, configured by writing Terraform code (a configuration-as-code language) and started through Airbyte's API (§2.5).
- **Data transformation stage (Stage 2)**: writing SQL, run through DBT (a tool that builds tables from SQL files), that turns the loaded tables into the target data models (§2.5).
- **Data model**: a target table the pipeline must produce, given in `data_model.yaml` as a description plus column names and their explanations (§2.3).
- **Project base**: the files the agent starts from: connection details (`config.yaml`), the data-model definitions, a Terraform starter file, Airbyte documentation, and the source tables' column names and descriptions (§2.3).
- **Derived, aggregated, categorical and ranked columns**: the four kinds of data-model columns, by transformation: copies or simple operations; SUM, AVG and similar over a fact table (a table of recorded events, such as orders); 0/1 or category flags from thresholds or conditions; and a value picked by a ranking function such as `RANK` (§2.4 "Step 4").
- **SRDEL** (Success Rate for Data Extraction & Loading): the share of pipelines whose every source table arrives in the warehouse; checked by comparing each table's row count with the original data's (§3.1).
- **SRDT** (Success Rate for Data Transformation): the share of all data models, across pipelines, that are built correctly (§3.1).

**Missing glossary terms:**
- **ELT pipeline**: Extract-Load-Transform: data is first loaded raw into a data warehouse and transformed there with SQL; in the older ETL order it is transformed before loading (§1).
- **Data warehouse**: a central database for analytics that collects data from many sources; the paper uses the cloud warehouse Snowflake (§2.3).

**Builds on:**
- Spider 2.0 ([Spider 2.0](#/papers/lei2024spider2 "Spider 2.0: Evaluating Language Models on Real-World Enterprise Text-to-SQL Workflows (2025)")), an enterprise text-to-SQL agent benchmark, and Spider2-V, a benchmark of agents using data tools: the two benchmarks Tab. 1 compares against; ELT-Bench follows Spider 2.0 in counting SQL tokens by whitespace and in allowing extra columns (§2.2, §3.1).
- BIRD ([BIRD](#/papers/li2023bird "Can LLM Already Serve as A Database Interface? A BIg Bench for Large-Scale Database Grounded Text-to-SQLs (2023)")), a text-to-SQL benchmark with large databases: 78 of its databases, with their questions and SQL turned into data-model columns (§2.1).
- Fivetran, a data movement platform that publishes DBT packages: 22 databases with their predefined data models (§2.1).
- The agent frameworks Spider-Agent (from Spider 2.0) and SWE-Agent ([SWE-agent](#/papers/yang2024sweagent "SWE-agent: Agent-Computer Interfaces Enable Automated Software Engineering (2024)")), the first built on ReAct ([ReAct](#/papers/yao2022react "ReAct: Synergizing Reasoning and Acting in Language Models (2023)")), a loop in which the model alternates reasoning and actions (§3.2).

## Problem and setting

The question is "Can AI agents effectively reduce the manual effort involved in constructing ELT pipelines?" (§1).

- **Data:** 100 pipelines with 835 source tables and 203 data models (§2.2). 60 pipelines draw on all five source kinds: REST APIs, Amazon S3 (cloud file storage, simulated with LocalStack, a local emulator of Amazon's cloud services; §2.3), PostgreSQL, MongoDB (a document database) and flat files such as CSV (§2.2, Tab. 3). Docker containers host the four non-file sources, and flat files come as download links; the warehouse is Snowflake (§2.3).
- **Configuration hints differ from the tool's field names on purpose:** the annotated configurations "do not strictly match the field names in the Airbyte documentation", which the authors say "requires the agent's reasoning capabilities" (§2.4 "Step 3").
- **Correctness:** Stage 1 succeeds when every source table's row count matches the original (§3.1). For Stage 2, each data model is dumped with `SELECT * … ORDER BY` a hand-chosen unique key and compared as a CSV file with the ground truth dumped the same way; "A generated data model is correct if it contains all columns of the ground truth", and extra columns are allowed, following Spider 2.0 (§3.1). How values such as decimals or NULLs are compared is not discussed.
- **Ground truth:** authors' configuration files and SQL, with BIRD's questions and SQL checked and corrected by hand; each pipeline was run end to end, and each data model was checked with, on average, ten extra test queries run against both the source tables and the model (§2.1, §2.4 "Step 5" and "Step 6").
- **Agents and models:** GPT-4o, Claude-3.5-Sonnet, the open models Llama-3.1-405B-Instruct and Qwen2.5-Coder-32B-Instruct, and the reasoning model DeepSeek-R1, each in both frameworks; Claude-3.7-Sonnet with extended thinking only in Spider-Agent, "as a case study" (§3.2). Spider-Agent may take 100 steps; SWE-Agent gets a $6 cost budget (§3.2). The number of runs behind Tab. 4 is not discussed.

## Approach

The contribution is the benchmark and an error study, not a new agent.

- **Building the benchmark (§2.4):** six steps: convert each database into several source formats, choosing the format "that maximizes the source diversity" where several fit; set up the containers, including a custom Airbyte extractor for local REST APIs; write the connection details; define the data models; write the ground truth; and verify by execution.
- **Data models from BIRD (§2.4 "Step 4"):** BIRD's questions about one entity are turned into a column for every entity (for example, each director's highest-rated film). The authors prioritize features whose SQL involves more components, conditions and joins, and a data model "typically" has three derived columns and five others drawn from BIRD questions. Fivetran's databases already have predefined data models, which are kept minus the columns generated by utility functions (the paper doesn't say more) and columns holding only nulls, unless another data model needs them.
- **Metrics (§3.1):** SRDEL and SRDT, plus average cost (from token use and API prices) and average steps per task.
- **Error analysis (§4–5):** the authors read the agents' action logs and sort failures by stage and cause.

## Results

The authors report (Tab. 4, §3.3):
- **Headline:** Spider-Agent with Claude-3.7-Sonnet with extended thinking reaches 57% SRDEL and 3.9% SRDT, against 37% and 1% for SWE-Agent with Claude-3.5-Sonnet (which the authors call 54.1% and 290% improvements). It costs $4.30 and 89.3 steps per pipeline on average.
- **Open models and DeepSeek-R1:** 0% in Stage 1 in both frameworks, so 0% overall; GPT-4o in SWE-Agent also scores 0 (Tab. 4, §4.1).
- **Cost against Spider 2.0:** Spider-Agent with GPT-4o needs 43.7 steps and $2.03 per ELT-Bench task, where 30 steps suffice for most Spider 2.0 tasks, at $0.30 on average with the same agent (§3.3).

Where agents fail (§4–5):
- **Not reading the inputs:** Spider-Agent with DeepSeek-R1 seldom consults `config.yaml` and in most cases invents configuration values; agents that don't consult the provided documentation write configuration from outdated versions of Airbyte's documentation (§4.1).
- **Format errors:** Spider-Agent stops after three unparsable actions; with Claude-3.5-Sonnet it ends 47% of tasks in Stage 1 this way, against 7% with GPT-4o (§4.2, Fig. 4).
- **Order of work:** Spider-Agent with GPT-4o reads the documentation before writing configuration in 27 tasks and gets the Snowflake password field right in 21; it writes first in 73 tasks, and only six succeed (§4.2). Repeated synchronization (sync) jobs, the Airbyte runs that copy a source's data into the warehouse, multiply rows when triggered again; flat files needing one configuration block each cause further failures (§4.2).
- **Stage 2 errors** come in three kinds: the agent stops or runs out of budget before building the model, DBT compilation errors, and SQL that runs but is wrong (§4.3, Fig. 11). For Claude-3.7-Sonnet the main Stage 2 problems are too many iterations (28.7%), wrong SQL logic (24.3%) and invalid actions (21.7%) (§5, Fig. 14).

Sensitivity (§6):
- **Several attempts:** Spider-Agent with GPT-4o succeeds in Stage 1 in at least one of five attempts on 57% of tasks, against 15% with one, but still builds no correct data model; its pass^k falls to 0 at k = 5 (§6.1, Fig. 16–17).
- **Documentation:** without it, Stage 1 success falls from 21% to 1% for Spider-Agent with Claude-3.5-Sonnet and from 15% to 0% with GPT-4o (§6.2, Fig. 18).

## Limits the authors state

None stated.

## Open problems and building blocks

  - "the need for a more advanced AI agent to reduce manual effort in ELT workflows" (abstract); "significant opportunities for future research to develop more powerful and intelligent AI agents capable of handling complex ELT workflows" (§8).
  - From the error study (§4.2): "developing frameworks that robustly ensure LLMs generate correct syntax for actions and code"; "effective planning (e.g., executing actions in the correct sequence)"; "short-term memorization in the agent for tracking executed actions"; and "the need for the agent to handle diverse configuration patterns across different data sources".
  - From the repeated-trials result, "the need for a more robust agent in future work" (§6.1).
- **Released:** "Our code and data are available" (abstract).
- **To reuse it:** a Snowflake warehouse, Docker containers for four source kinds and for Airbyte, and DBT; a Docker file with the packages and a script that waits for sync jobs are provided (§2.3). The sources need setting up only once before running experiments (§2.4 "Step 2").
- **Beyond its domain:** none claimed.

## On this site

- **Discussed in:** [Whole-job reliability of multi-step LLM work](#/challenges/whole_job_reliability)
- **Tags:** <span class="tags"><a class="tag" href="#/tags/dbtask">dbtask</a><a class="tag sub" href="#/tags/harness-sql">harness-sql</a><a class="tag sub" href="#/tags/llm-gen">llm-gen</a><a class="tag sub" href="#/tags/llm-method">llm-method</a></span>
