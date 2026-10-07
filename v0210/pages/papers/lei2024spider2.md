# Spider 2.0: Evaluating Language Models on Real-World Enterprise Text-to-SQL Workflows

**Spider 2.0** · ICLR 2025

Read: [PDF](https://arxiv.org/pdf/2411.07763) · [arXiv](https://arxiv.org/abs/2411.07763)  
Code: [Spider2](https://github.com/xlang-ai/Spider2)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Enterprise text-to-SQL workflows over real databases in local and cloud systems such as BigQuery and Snowflake (abstract).
- Solving a task often needs searching database metadata, dialect documentation and project codebases, and writing several long queries (abstract).
- A harder shared benchmark than BIRD; [Pervasive Annotation Errors Break…](#/papers/jin2026annotation "Pervasive Annotation Errors Break Text-to-SQL Benchmarks and Leaderboards (2026)") measures annotation errors in its Snowflake subset.

## In plain words

Text-to-SQL turns an English question into a database query. The authors argue that older benchmarks often use small databases and simple queries, while real company work runs on huge databases in many SQL versions and needs project code, documentation and several long queries (§1). They built Spider 2.0: 632 tasks from real enterprise database use cases, on cloud systems such as BigQuery and Snowflake and on local ones, where an agent explores files and databases and runs commands until it has an answer. Two self-contained versions, Spider 2.0-lite and Spider 2.0-snow, give a method the question, the table and column lists and documents, and ask for one SQL query (abstract, §1). They report that their agent built on o1-preview solves only 21.3% of Spider 2.0 tasks, while methods based on GPT-4 reach 91.2% and 73.0% on the older benchmarks Spider 1.0 and BIRD (abstract, §1), and that the best text-to-SQL method they adapted solves 5.7% of Spider 2.0-lite (§1). They present it as a benchmark (with a baseline agent) whose demands go "far beyond traditional text-to-SQL challenges" (abstract).

## Background and terms

**Terms to know:** [text-to-SQL](#/glossary/text-to-sql) · [execution accuracy](#/glossary/execution-accuracy) (this paper uses its own variant, below) · [gold query](#/glossary/gold-query) · [schema linking](#/glossary/schema-linking) · [SQL dialect](#/glossary/sql-dialect) · [common table expression (CTE)](#/glossary/common-table-expression-cte) · [data contamination](#/glossary/data-contamination)

**The paper's own terms:**
- **Spider 2.0 (the code agent task)**: given a question, a database interface and a codebase, the agent repeatedly edits and runs code (SQL or Python); its last observation is its answer: text, a table or a changed database (§2.1).
- **Spider 2.0-lite and Spider 2.0-snow**: no codebase; input the schema, the question and documentation, output one SQL query. Lite is hosted on BigQuery, Snowflake and SQLite; snow entirely on Snowflake (§1, §2.1). Each has 547 examples (Tab. 2). The authors say they are "not easier" than Spider 2.0 because they give less information, e.g. no execution feedback (§1).
- **Success rate (SR)**: the share of Spider 2.0 tasks that the task's human-written evaluation script scores as solved, comparing strings, tables or database files (§3.1, App. A, Tab. 12).
- **Execution accuracy (EX), as used here ("execution-based focused evaluation")**: a predicted query counts as correct if every column of the gold result appears among the columns of the predicted result, so extra columns are ignored; a task's script may check only chosen gold columns (`condition_cols`) and may ignore row order (`ignore_order`) (App. A, Fig. 6, Tab. 12). This differs from the usual requirement of the same result.
- **Surface and semantic rewrites**: rewrites against leakage; surface rewrites "adjust the parameters and the answer format", semantic ones "expand the question's meaning" (Tab. 1).
- **DBT project**: a project for dbt, "a widely used tool for managing data transformations and analytics engineering" (§2.3); YML files "generally define the data models" (the tables a transformation produces), Markdown files describe them, and SQL files compute them; a data flow is a chain of models from raw tables to final ones (App. B.2, Fig. 9).
- **Nested columns**: arrays or dictionary-like records stored inside one column (§4.1, App. B.3).

**Missing glossary terms:**
- **Cloud data warehouse**: a database service run by a cloud provider for large-scale analytics; the paper groups BigQuery and Snowflake as cloud data warehouses, against local databases such as SQLite and DuckDB (§1, §2.3).

**Builds on:**
- The text-to-SQL benchmarks it compares against first: Spider 1.0 ([Spider](#/papers/yu2018spider "Spider: A Large-Scale Human-Labeled Dataset for Complex and Cross-Domain Semantic Parsing and Text-to-SQL Task (2018)")) and BIRD ([BIRD](#/papers/li2023bird "Can LLM Already Serve as A Database Interface? A BIg Bench for Large-Scale Database Grounded Text-to-SQLs (2023)")), plus WikiSQL, KaggleDBQA and SEDE (§1, Tab. 2).
- ReAct ([ReAct](#/papers/yao2022react "ReAct: Synergizing Reasoning and Acting in Language Models (2023)"), reasoning interleaved with tool actions) and InterCode (an interactive coding environment, §5), which inspired Spider-Agent (§3.1).
- The code agent frameworks Reflexion ([Reflexion](#/papers/shinn2023reflexion "Reflexion: Language Agents with Verbal Reinforcement Learning (2023)")), CodeR and AutoEval, run as baselines (§3.1).
- Text-to-SQL methods adapted as baselines: DIN-SQL, DAIL-SQL and CHESS (prompting GPT-4o) and CodeS (fine-tuned open models) (§3.1, App. C.2).

## Problem and setting

- **Question:** how well do LLMs and agents handle company text-to-SQL work: very large schemas, many dialects, multi-query workflows, documents and project code (§1)?
- **Data:** 213 databases chosen to have more than 200 columns or a nested schema, on BigQuery, Snowflake, SQLite, DuckDB, PostgreSQL and ClickHouse (§2.2 step 1, Tab. 2). Tab. 2 reports 743.5 columns per database and 148.3 tokens per gold SQL for Spider 2.0, against 54.2 and 30.9 for BIRD.
- **Queries:** over 50 tokens, from real tutorials, forums and projects, plus DBT projects from Fivetran (a vendor of dbt transformation packages, App. B.2) and DBT (§2.2 step 1). By Tab. 3, 78 tasks are DBT projects, 82 come with external documents and 474 use special functions.
- **Correctness:** SR or focused EX, above. Spider 2.0 instructions favour naturalness, with context files such as answer formats; lite and snow favour unambiguity (§2.2 step 4, App. B.6).
- **Models:** OpenAI, Anthropic, Google, DeepSeek, Qwen2.5 and Llama-3.1 models (§3.1, Tab. 4, Tab. 6).
- How NULLs, duplicate rows and float rounding in tables are compared is not discussed in the main text.

## Approach

- **Annotation pipeline (§2.2):** eight authors (1) collect databases and SQL; (2) rewrite each query at surface or semantic level "to avoid contamination", checking it runs, finishes in acceptable time and returns non-empty results; (3) gather dialect and function docs (Tab. 18) and, for Spider 2.0, the codebase; (4) write two versions of each instruction; (5) write evaluation scripts; (6) have each example reviewed by at least three annotators, plus a "red team" check of the scripts with false and correct results.
- **DBT tasks (App. B.2):** the authors run a full DBT project, then may delete the SQL files of one to three data flows; solving one typically requires finding what is missing from the YML files and docs, writing the SQL models, running `dbt run`, and checking the database.
- **Spider-Agent (§3.1, App. C.1):** a multi-turn agent whose actions are shell commands, file edits, running SQL, listing tables and columns, sampling rows, and declaring failure or completion (Tab. 19); runs have a 30-step limit (App. C.1).
- **Text-to-SQL baselines (§3.1, App. C.2):** prompts add sampled cell values, external knowledge and dialect notes (Fig. 21).

## Results

- **Spider 2.0:** Spider-Agent with o1-preview reaches 21.36% SR (Tab. 6), against the 91.2% and 73.0% the authors cite for GPT-4-based methods on Spider 1.0 and BIRD (§1). With GPT-4o, AutoEval, Reflexion and CodeR score below Spider-Agent (Tab. 6).
- **Text-to-SQL methods:** DAIL-SQL + GPT-4o, the best of them on lite and snow, reports 86.6% EX on Spider 1.0 and 57.4% on BIRD but 5.68% on lite and 2.20% on snow (Tab. 5, §3.2).
- **Spider-Agent on lite and snow:** with o1-preview it reaches 23.22% EX on lite and 23.77% on snow; o3-mini is slightly higher on lite (Tab. 4).
- **Task types (§4.1):** among tasks outside DBT projects, the agent does worse on those with nested columns (Tab. 7) and with external documents (Tab. 8); it solves 12.82% of DBT tasks against 23.22% of the others (Tab. 9). For documents, models "typically have the correct problem-solving strategies" but fail to ground the documents' requirements in SQL (§4.1).
- **Errors (§4.2, Fig. 4):** on 300 randomly sampled examples, erroneous data analysis makes up 35.5% of errors and wrong schema linking 27.6%; the text also discusses JOIN errors, which the authors tie to BigQuery databases often lacking explicit foreign keys.
- **Settings (§4.3):** hand-picked function documents give "only a slight improvement" (Tab. 10); one or three hand-picked examples give "only marginal improvements" for DAIL-SQL + GPT-4o (Tab. 11).
- **Dialects (App. C.4):** Snowflake tasks are "the most challenging" (Tab. 20); on 180 random examples hosted on both systems with the same questions, performance is lower on Snowflake.
- **Annotation (§2.2 step 6):** first validators found errors in 45% of examples, the second round in 5%; all were then corrected.
- **Evaluation:** the authors report that, "Empirically", focused evaluation "significantly reduces the false negative rate without increasing the number of false positives" (App. A).

## Limits the authors state

- Difficulty is measured only by SQL length: "While there are various ways to measure difficulty, we use SQL length here as the most common and significant metric for experimental reference" (§3.1, footnote).
- Some questions "do not specify the columns that should be returned", hence the focused scripts (§2.2 step 5); some intentions "may not be fully captured by a natural language question" (§2.2 step 3).
- Naturalness and unambiguity are "often a conflicting challenge" (App. A); answer-format constraints are given "for a limited number of examples" (App. B.5).
- Value linking (finding the database values a question's filters name) was skipped on BigQuery because retrieving all values "is prohibitively expensive", and "its omission may hinder performance" (App. C.2).
- Lite is "not divided into train and dev sets", so few-shot examples were picked by hand (§4.3).
- The 30-step limit is "enough for most tasks" (App. C.1).

## Open problems and building blocks

  - The obstacles the authors name: linking schemas in very large databases, handling dialects, planning sequences of nested queries, and using documentation and project codebases (§1).
  - "Exploring cost-efficient methods for value linking or alternative approaches is an important direction for future work" (App. C.2).
  - Named bottlenecks: grounding complex document requirements into SQL (§4.1); "accurately utilizing these functions to reflect user intentions" (§4.3); debugging from execution feedback and exploring schemas of different database types (§3.2).
  - "There is still significant room for improvement in Spider-Agent" (§3.2).
- **Released:** "Our code, baseline models, and data are available" (abstract).
- **To reuse it:** tasks run against BigQuery and Snowflake through a query interface with credentials (App. B.5, Tab. 19); average API cost per instance is $0.75 for Spider-Agent + o1-preview and $0.09 for DAIL-SQL + GPT-4o (Tab. 21); long prompts (GPT-4o's 128K window is the lite default, App. C.2).

## On this site

- **Discussed in:** [Text-to-SQL can't be verified against intent](#/challenges/text_to_sql_verification)
- **Tags:** <span class="tags"><a class="tag" href="#/tags/dbtask">dbtask</a><a class="tag sub" href="#/tags/harness-sql">harness-sql</a><a class="tag sub" href="#/tags/llm-gen">llm-gen</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/nl2sql-eval">nl2sql-eval</a></span>
