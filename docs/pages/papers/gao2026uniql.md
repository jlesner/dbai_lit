# UniQL: Towards Dialect-Universal Benchmarking for Text-to-SQL

**UniQL** · preprint 2026

Read: [PDF](https://arxiv.org/pdf/2606.08018) · [arXiv](https://arxiv.org/abs/2606.08018)  
Code: [UniQL](https://github.com/JerryGao818/UniQL)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Cross-dialect text-to-SQL: questions aligned with executable SQL in many dialects over shared schemas and data (abstract).
- Built by migration, translation, execution-guided verification and, for what automation couldn't accept, human validation (abstract, §3.4).
- It reports 24,544 dialect-specific queries across 16 dialects (abstract): a source of aligned cross-dialect pairs, accepted by agreement on the benchmark databases, "rather than a complete formal guarantee" (§8).

## In plain words

Text-to-SQL benchmarks such as BIRD mostly run their queries on SQLite, a small embedded database. Engines differ in syntax, functions, types and behaviour, so one question often needs different SQL on each engine, and the authors argue that this leaves it unclear whether models generalize across engines (abstract, §1). They build UniQL, a benchmark they call "human-verified": BIRD's SQLite answer queries for 1,534 questions are translated into 15 other engines' versions of SQL, with the same questions, tables and data everywhere. A rule-based translator goes first, then an LLM that retries using feedback from running its query, then translation rules that an LLM writes from past failures, then people for what automation could not accept (§3). Testing 13 LLMs with one shared prompt and no task-specific training, they report that the best, Claude-4.5-Sonnet, averages 54.63% of answers whose results match the reference query's over the 16 engines, and answers only 20.14% of questions correctly on all 16 (§6.2, §6.4). They present a new benchmark, the translation framework that built it, and an evaluation of current models (§1).

## Background and terms

**Terms to know:** [text-to-SQL](#/glossary/text-to-sql) · [SQL dialect](#/glossary/sql-dialect) · [gold query](#/glossary/gold-query) · [execution accuracy](#/glossary/execution-accuracy) · [bag semantics](#/glossary/bag-semantics) · [list semantics](#/glossary/list-semantics) · [query equivalence](#/glossary/query-equivalence)

**The paper's own terms:**
- **Source and target dialects**: SQLite, BIRD's original engine, is the source; the dialects of 15 other database engines (ClickHouse, Doris, Drill, Druid, DuckDB, Hive, MySQL, Oracle, PostgreSQL, Presto, Spark, StarRocks, Teradata, Trino, T-SQL) are the targets built by the pipeline (§3, §4).
- **Aligned**: every dialect shares "the same intents, aligned schemas and database contents" (abstract), so dialect is not conflated with task or data (§4).
- **EX (execution accuracy, this paper's version)**: the predicted and gold queries run on the same target database; a prediction that fails to run is wrong. "For queries with explicit ordering semantics, such as those containing ORDER BY", results are compared as ordered lists; otherwise as multisets, so duplicate counts must match (§5, App. A). The same protocol is the acceptance test during construction (§5).
- **Construction source**: the stage that produced a target query: Tool (SQLGlot), LLM, Reflection, Rule refinement (labelled "EvoRule" in Fig. 4) or Human (§6.3, Tab. 6).
- **Cross-dialect consistency**: "for the same intent, how many dialect realizations can a model answer correctly?" (§6.4). Tab. 3 reports its Mean, All-16 (share of questions right in all 16 dialects) and SQLite→15, "the percentage of SQLite-correct questions that remain correct across other 15 dialects" (§6.4).
- **BIRD difficulty**: the simple, moderate and challenging labels BIRD gives its questions (§6.3).
- **Evidence**: hint text that comes with each BIRD question and is put into the prompt (App. B, App. F).

**Missing glossary terms:**
- **Database migration**: moving a database's schema and data to another engine, here with "type mapping, identifier normalization, namespace adaptation, and necessary formatting changes" (§3.1).

**Builds on:**
- BIRD ([BIRD](#/papers/li2023bird "Can LLM Already Serve as A Database Interface? A BIg Bench for Large-Scale Database Grounded Text-to-SQLs (2023)")), a text-to-SQL benchmark the paper calls "primarily SQLite-based" (§2): UniQL is "Built upon the BIRD development set" (§1), its 1,534 questions (§4), with BIRD's SQLite queries as the source of every translation (§3.2).
- SQLGlot, a rule-based SQL translator that relies on "manually maintained dialect mappings" (§2): the pipeline's first stage (§3.2).
- The benchmarks it compares itself with first (§4, Tab. 1): WikiSQL, Spider ([Spider](#/papers/yu2018spider "Spider: A Large-Scale Human-Labeled Dataset for Complex and Cross-Domain Semantic Parsing and Text-to-SQL Task (2018)")) and BIRD, each single-dialect, and Spider 2.0 (Spider 2.0-lite in Tab. 1), which covers several database systems with tasks that are "system-specific rather than aligned realizations of the same natural language intents across dialects" (§1).
- Dialect-translation work it calls "complementary" (§2): rule-based translators (SQLGlot, JOOQ, SQLines), "LLM-based or hybrid systems" (MALLET, RISE [RISE](#/papers/xie2026rise "RISE: Rule-Driven SQL Dialect Translation via Query Reduction (2026)"), CrackSQL [CrackSQL](#/papers/zhou2025cracksql "Cracking SQL Barriers: An LLM-based Dialect Translation System (2025)")), and PARROT ([PARROT](#/papers/zhou2025parrot "PARROT: A Benchmark for Evaluating LLMs in Cross-System SQL Translation (2025)")), a benchmark for SQL-to-SQL translation across database systems.

## Problem and setting

- **Question:** can LLMs write correct, executable SQL for the same question in many dialects, and does success in SQLite carry over to other engines (abstract, §1, §6.4)?
- **Data:** the BIRD development set, its databases migrated to each of 15 target engines (§3.1).
- **What correct means for a target query:** it runs on the migrated target database and preserves the semantics of the SQLite query (§3.2). Automatic acceptance requires the target query's result to match the SQLite query's result under the EX protocol (§3.2, §5); the rest goes to people (§3.4).
- **Evaluation setting:** the model gets the target dialect, the schema and the question and must output one SQL query; 13 models (five closed, eight open) are "evaluated once in an inference-only setting", without fine-tuning, reinforcement learning, few-shot example selection or dialect-specific adaptation, with one prompt template (§6.1, App. B).
- **How NULLs and floating-point values are compared** when two results are matched: not discussed.

## Approach

- **Rule-based translation and check (§3.2, Eq. 1–2):** SQLGlot translates the SQLite query; the translation is "automatically accepted only when it executes successfully on the target database and its result is equivalent to the source execution result". The check keeps row order when the query has "explicit ordering semantics" and keeps duplicate counts otherwise, because set comparison "can introduce false positives in cross-dialect construction" (§3.2).
- **LLM translation and self-reflection (§3.2, Eq. 3–4):** a rejected translation goes to GPT-5-mini, given the source SQL, target schema, dialect and current rules; it then gets up to three rounds of retrying with the previous SQL and its execution errors or result mismatches.
- **Rule evolution (§3.3, Eq. 5):** for each target dialect, failed translations are collected in a failure log; Gemini-2.5-Pro turns them, with the current rules and target-dialect documentation, into an updated rule set that conditions later translations, for three rounds.
- **Human verification (§3.4, Eq. 6):** the remaining cases go to people; "Each routed case is independently reviewed by two annotators", who rewrite invalid, ambiguous or non-equivalent SQL and settle disagreements by discussion. Routed cases include translation failures, unsupported constructs, and results that differ because of engine behaviour or under-specified SQL, such as tie order (§3.4).
- **Result:** 24,544 queries in all (§4); MySQL and Doris "can largely be handled by SQLGlot", while Teradata and Hive need more of the later stages (§4, Fig. 2).

## Results

- **Main results (§6.2, Tab. 2):** Claude-4.5-Sonnet has the best average EX, 54.63%, "followed by Gemini-2.5-Pro with 52.10% and GPT-5-mini with 50.50%".
- **SQLite hides dialect gaps (§6.2, Observation 2):** Claude-4.5-Sonnet scores 59.84% on SQLite but 63.75% on Oracle and 37.74% on Teradata, a commercial data-warehouse system.
- **Scaling (§6.2, Observation 3):** average EX rises with Qwen3 model size from 1.7B to 32B parameters, and Llama-3-70B improves "substantially" on Llama-3-8B; they add that "difficult dialects such as Druid, Presto, and Teradata remain challenging even for larger models".
- **By dialect (§6.2, Observation 4, Tab. 2 bottom row):** Oracle has the highest average over models, Teradata and Druid the lowest. The authors say this "should not be interpreted simply as a ranking of intrinsic dialect complexity": models do well on Oracle "likely because Oracle SQL has abundant public documentation, examples, and training exposure", while Teradata and Druid "may be less represented in model pretraining corpora and involve more system-specific functions, type handling, temporal operations, or execution behavior".
- **By BIRD difficulty (§6.3, Fig. 3):** "Across almost all models", accuracy falls from simple to moderate to challenging questions.
- **By construction source (§6.3, Fig. 4, averaged with each dialect weighted equally):** Claude-4.5-Sonnet scores 59.1% on the Tool subset against 44.1%, 30.7% and 14.6% on the LLM, Reflection and Rule subsets. The Human subset "does not always have the lowest accuracy".
- **Cross-dialect consistency (§6.4, Tab. 3):** Claude-4.5-Sonnet answers 8.74 dialects correctly per question on average, but only 20.14% of questions in all 16. Of the questions a model gets right in SQLite, only 33.66% (Claude-4.5-Sonnet) and 34.29% (GPT-5-mini) stay right in all 15 other dialects, and 15.38% for Gemini-2.5-Pro; the authors conclude that "SQLite correctness is not a reliable proxy for cross-dialect robustness".
- **Error analysis (App. C, Tab. 4–5):** Claude-4.5-Sonnet's failures, sorted into five coarse categories with "manual calibration": "For most dialects", value/filter and schema/reference errors dominate; Druid and Teradata "exhibit much larger syntax/function error shares"; in Drill, SQL-logic errors are the largest group.

## Limits the authors state

- The design "limits the use of target-system-specific data models": migration "largely preserves the original BIRD schemas", SQLite-derived and "mostly flat relational tables", so the benchmark "does not systematically cover native features" such as JSON querying, arrays, maps and structs, or the large-scale aggregation and time-series features of ClickHouse and Druid (§8).
- Target queries preserve the original intent rather than dialect idioms, so one "may therefore use a portable formulation even when the target system provides a more native expression" (§8).
- "execution-based verification, even with our stricter protocol, cannot fully guarantee semantic equivalence": two queries can agree on the current database and differ on others; agreement "should be understood as strong empirical evidence of equivalence on the benchmark databases rather than a complete formal guarantee of semantic equivalence" (§8).
- "exact one-to-one migration is not always possible across heterogeneous DBMSs" (database management systems) (§3.1).
- The acceptance check "may reject some translations that are semantically reasonable"; the authors call this intentional, favouring "precision over recall" (App. A).
- The construction-source split "should be interpreted as a long-tail and verification-complexity indicator rather than a strict difficulty scale" (§6.3).

## Open problems and building blocks

- **Open:** extend UniQL "by redesigning target databases with native data models" and with questions that "explicitly require dialect-specific capabilities" (JSON operators, nested data, array functions, partition-aware queries, time granularity), to test "dialect-native text-to-SQL generation" (§8). The authors call for "dialect-aware text-to-SQL methods" (§7).
- **Released:** "Code and data are available" (abstract). App. E says the authors "plan to release the UniQL benchmark, construction metadata, evaluation scripts, and accompanying documentation", and that users must follow BIRD's license and usage terms.
- **To reuse it:** the 16 engines with the migrated databases; for construction, GPT-5-mini as translator and Gemini-2.5-Pro as rule summarizer (§3.2–3.3), and two annotators per routed case (§3.4). Run time and cost are not stated.

## On this site

- **Discussed in:** [Telling bad translations from legitimate engine differences](#/challenges/bad_translation_detection) · [Benchmarks with checkable ground truth](#/challenges/checkable_benchmark_ground_truth) · [SQL dialect translation](#/challenges/dialect_translation)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/dialect-difftest">dialect-difftest</a><a class="tag sub" href="#/tags/dialect-pairs">dialect-pairs</a><a class="tag sub" href="#/tags/dialect-translate">dialect-translate</a><a class="tag sub" href="#/tags/harness-sql">harness-sql</a><a class="tag sub" href="#/tags/llm-gen">llm-gen</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/nl2sql-eval">nl2sql-eval</a><a class="tag sub" href="#/tags/rules-discover">rules-discover</a></span>
