# Evaluating LLMs in Database Scenarios: A Lifecycle Benchmark for Assessing Their Potential in Core Database Tasks

**DBLifeBench** · preprint 2026

Read: [PDF](https://arxiv.org/pdf/2608.03794) · [arXiv](https://arxiv.org/abs/2608.03794)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Evaluates LLMs across five phases of the database lifecycle: design, implementation, operation, debugging and maintenance (abstract).
- Also proposes Progressive-Text2SQL, a task built on structured reasoning graphs (abstract).
- A broad map of LLM database tasks beyond text-to-SQL.

## In plain words

Benchmarks for language models on databases mostly test one job: turning a question into an SQL query. The authors argue that this misses most of a database administrator's work, and that a model good at queries can still fail at designing tables or fixing a running system (abstract, §1). Their benchmark, DBLifeBench, has tasks for five phases: designing tables from written requirements, writing the statements that create them, writing queries and updates, repairing broken queries, and diagnosing database alerts with simulated tools. They add Progressive-Text2SQL, where a hard question comes split into linked smaller steps (abstract, §2).

Across 11 models, GPT-4o and GPT-4o-mini generally lead in almost all phases, while some models fine-tuned for SQL fall far behind outside query writing: SQLCoder scores much lower on writing table definitions than on queries (§4). The authors call this a "curse of specialization" (§1). They also report that the step-by-step version improves final-query accuracy for all the models compared, most on the hardest questions (§5). They present DBLifeBench as "the first benchmark to evaluate LLMs across five critical lifecycle phases" (abstract).

## Background and terms

**Terms to know:** [text-to-SQL](#/glossary/text-to-sql) · [execution accuracy](#/glossary/execution-accuracy) · [gold query](#/glossary/gold-query) · [integrity constraint](#/glossary/integrity-constraint) · [catastrophic forgetting](#/glossary/catastrophic-forgetting) · [normalization](#/glossary/normalized-schema)

**The paper's own terms:**
- **Database lifecycle phases P1–P5**: Design (from requirements to a schema of entities, data types and foreign-key dependencies), Implementation (from that schema to Data Definition Language, the `CREATE TABLE` statements, valid in an engine such as SQLite), Operation (Data Manipulation Language: queries and updates, as Text2SQL and Progressive-Text2SQL), Debugging (a flawed SQL statement plus its error message, to be corrected), Maintenance (a site-reliability-engineer or database-administrator role) (§2.1).
- **Assigner and Expert**: the two Maintenance tasks. The Assigner reads error logs and picks which experts should handle them (e.g. an IO expert); the Expert calls simulated API tools to diagnose and fix the anomaly (§2.1; Listings 6–7).
- **Progressive-Text2SQL (P-Text2SQL)**: a task in which a complex query is broken into a reasoning graph. Each node is a sub-task with a short natural-language description and its SQL fragment; edges are logical dependencies; the last node is the final query (§2.2.2). Per §2.1 the model generates SQL for each node; the example in Listing 4 shows an input with the nodes, the edges and the final question.
- **ACCi-Entity, ACCi-Data, ACCi-Key**: Design scores, the share of matching entity names, data types and foreign-key dependencies, summed over the tables; i is the number of output tables, "defaulting to 2" (§3, Eq. 1).
- **T-Level and F-Level**: Implementation scores after executing the model's statements: the share of tables whose name is "semantically consistent (not necessarily identical in name)" with the ground truth, and the share of ground-truth fields matched (§3, Eq. 2).
- **G-EX (graph execution accuracy)**: execution accuracy computed for each node of a graph, averaged over the graphs (§3, Eq. 4).
- **Single-round and multi-round debugging**: the two Debugging columns of Tab. 2; the authors read gains in the multi-round setting as models being "better at recognizing and correcting their previous mistakes" (§4.3).
- **Level-k perturbation**: applying "one or more disruptive operations" to selected graph nodes, including broken SQL syntax, misalignment with the schema, contradictory logic, or removal (§5.4).
- **Curse of specialization**: models "fine-tuned specifically for SQL generation exhibit significant performance degradation in broader database management tasks" (§1); the abstract calls it "catastrophic forgetting".

**Missing glossary terms:**
- **Jaccard similarity**: the size of the overlap of two sets divided by the size of their union (§2.2.2).
- **Coefficient of variation**: the standard deviation divided by the mean (§5.1, Tab. 3).

**Builds on:**
- Text-to-SQL benchmarks it sets itself against: Spider ([Spider](#/papers/yu2018spider "Spider: A Large-Scale Human-Labeled Dataset for Complex and Cross-Domain Semantic Parsing and Text-to-SQL Task (2018)")), Spider 2.0 ([Spider 2.0](#/papers/lei2024spider2 "Spider 2.0: Evaluating Language Models on Real-World Enterprise Text-to-SQL Workflows (2025)")), BIRD ([BIRD](#/papers/li2023bird "Can LLM Already Serve as A Database Interface? A BIg Bench for Large-Scale Database Grounded Text-to-SQLs (2023)")) and SQLStorm (§1, §6). BIRD is also its source for standard Text2SQL items (§2.2.1).
- DB-GPT (Zhou et al., 2024a), an LLM framework for database tasks: the Maintenance tasks follow its split into assignment and expert execution (§2.2.1).
- BigTable (Zhang et al., 2024), a text-to-SQL evaluation of LLMs: consulted for collecting erroneous SQL (§2.2.1).
- Fürst et al. (2024), on how robust text-to-SQL systems are to the data model: the source of the three schema variants (§5.1).

## Problem and setting

- **Question:** how well do LLMs handle the five phases, and do reasoning graphs help on hard queries (§1)?
- **Data:** 13 databases with "an average of 7.8 tables per database", across domains such as finance, education and sports (§2.2.1). Tab. 1 lists 265 requirement texts (shared by Design and Implementation), 1,534 Text2SQL and 1,149 P-Text2SQL items, 523 debugging items and 518 maintenance items.
- **Requirements:** three students and an AI revise them together over three rounds (§2.2.1).
- **P-Text2SQL graphs:** built from harder Text2SQL examples where the mismatch between question and SQL "has been manually identified"; several LLMs, including GPT-4o, Claude, Gemini and DeepSeek-R1, propose graphs (§2.2.2; prompt in App. A.2), and an LLM writes each node's description (§2.2.2). Nodes that fail to run in SQLite are dropped; three graduate students rebuild the edges without seeing the generated ones, and only examples with "more than 80% consensus" (Jaccard) are kept (§2.2.2). Statements such as UPDATE and DELETE are added by hand (§2.2.1).
- **Correctness:** Text2SQL by execution accuracy against the ground-truth SQL's result (Eq. 3); Debugging by executing the corrected SQL; Maintenance by whether expert assignments and API calls are correct (§3). How Debugging and Maintenance outputs are compared, how multi-round debugging works, and how "semantically consistent" table names are judged: not discussed.
- **Models:** general models (GPT-4o, GPT-4o-mini, Llama3, Mistral, DeepSeek, Qwen2.5, ChatGLM-4) and models "fine-tuned on SQL, code, and related data" (DeepSeek-Coder, SQLCoder, CodeQwen, and a Llama3 SQL fine-tune, named "Llama3-Coder" in §4.1 and "Llama3-sqlcoder" in the tables) (§4.1). Model sizes and versions: not discussed for most models.
- **Setup:** SQLite throughout, temperature 0.3, top-p 0.2 (§4.2). NULLs and set or bag comparison of results: not discussed.

## Approach

Each phase has its own inputs and scores (§2.1, §3). Implementation takes the Design phase's output as input (Listing 2). Maintenance items come from existing open-source datasets (Tab. 1), filtered automatically, then executed and checked in a database (§2.2.1).

Progressive-Text2SQL is the authors' answer to what they call a "cognitive gap": "complex SQL logic is often too intricate to be mapped directly from a single natural language sentence" (§1). The graph acts as "a cognitive scaffold", guiding the model to build the final query step by step, which the authors liken to chain of thought (§2.2.2).

## Results

- **Main table (Tab. 2):** GPT-4o and GPT-4o-mini "generally outperform other models across almost all aspects" (§4.3). Phase profiles differ: ChatGLM-4 does well on Design and Implementation but poorly on Operation and Maintenance (§4.3).
- **Specialized models:** SQLCoder's Implementation average is 8.68 against 24.64 on Text2SQL, and it scores 0.00 on both Maintenance tasks (Tab. 2), which the authors attribute "likely" to training data "heavily focused on Text2SQL tasks" (§4.3). Llama3's SQL fine-tune drops from 62.74 to 42.60 on the Design average (Tab. 2), while DeepSeek-Coder shows "significant improvements" over DeepSeek across the lifecycle, in the authors' words (§4.3). Task-specific fine-tuning "can sometimes cause models to over-focus on particular patterns", in the authors' reading (§4.3). Fig. 6 ranks models separately on SQL generation and other tasks; SQLCoder ranks last on the other tasks (§5.6).
- **Debugging:** some models, "such as Llama3 and Mistral", gain from multiple rounds; Mistral goes from 23.62 to 36.82 (Tab. 2, §4.3).
- **Maintenance:** as Assigners, models "like GPT-4o and Qwen" read error types well and others do not; as Experts, all score low, between 0.00 and 33.58 (Tab. 2), "because they are not good at using database tools" (§4.3).
- **P-Text2SQL vs Text2SQL (Fig. 4(a), final node only):** graphs "significantly improve the Execution Accuracy (EX) of all baseline models" (the figure plots five models); the authors report that the gain grows with difficulty and is largest on "Challenging" queries (§5.3, Fig. 4(b)). No values are printed on the plots.
- **Robustness (Tab. 4):** accuracy falls as the perturbation level rises but "in most cases" stays above plain Text2SQL; Llama3 goes from 46.76 (clean graph) to 32.14 at Level-5, against 28.85 on Text2SQL (§5.4).
- **Schema variants (§5.1, Tab. 5 in App. A.1):** of v1 ("lowest normalization"), v2 and v3 ("highest normalization"), v2 does worst, which the authors attribute to alias conflicts (clashing table nicknames) and redundant UNIONs from bridge (linking) tables; v3 does better. They take this to suggest "over-normalization should be avoided". The coefficient of variation across variants is smaller for P-Text2SQL for every model listed (Tab. 3); the authors read this as better adaptation to schema variations.
- **Requirements quality (§5.2, Fig. 3):** human ratings improve after each revision round, and the 11 models score better on Design as the requirements improve.
- **Number of tables (§5.5, Fig. 5):** general models stay fairly stable from 1 to 5 tables; code-tuned models fluctuate more, and some specialized models "in most cases" do worse with fewer tables.

## Limits the authors state

- DBLifeBench "is primarily designed for LLMs, which may not fully capture the performance of non-LLM approaches" (§ Limitations).
- "some tasks, particularly in design and maintenance, may be challenging to define and evaluate accurately" (§ Limitations).
- It "focuses exclusively on textual modalities", not multimodal cases such as performance charts (§ Limitations).
- The clean reasoning graphs are "high-quality", but "real-world reasoning may contain errors", which motivates the perturbation test (§5.4).

## Open problems and building blocks

- **Open:** "Future work will aim to incorporate multimodal inputs to broaden the scope of evaluation" (§ Limitations). Logged annotation disagreements (e.g. "alias confusion and aggregation mismatches") are meant to "inform future refinements to the data construction pipeline" (§2.2.2).
- **Released:** Nothing stated.
- **To reuse it:** SQLite (§4.2); several LLMs and student annotators to build and check graphs (§2.2.2); simulated maintenance APIs (§2.1).

## On this site

- **Tags:** <span class="tags"><a class="tag" href="#/tags/dbtask">dbtask</a><a class="tag sub" href="#/tags/llm-gen">llm-gen</a><a class="tag sub" href="#/tags/nl2sql-misc">nl2sql-misc</a></span>
