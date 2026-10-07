# DLBench: A Comprehensive Benchmark for SQL Translation with Large Language Models

**DLBench** · ASE 2025

Read: [PDF](https://ieeexplore.ieee.org/stampPDF/getPDF.jsp?tp=&arnumber=11334627) · [DOI](https://doi.org/10.1109/ase63991.2025.00076)  
Code: [DLBench](https://github.com/dlbenchll/DLBench)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- A benchmark for LLM SQL dialect translation from SQLite and other sources into six engines (MySQL, PostgreSQL, MariaDB, MonetDB, DuckDB, ClickHouse) (§I, §IV).
- Scores translations by dialect match, exact match and execution (Tabs. IV–V).
- It reports 6,402 translation tasks (§I); same group as [QTRAN](#/papers/lin2025qtran "QTRAN: Extending Metamorphic-Oracle Based Logical Bug Detection Techniques for Multiple-DBMS Dialect Support (2025)").

## In plain words

Moving a workload to another database system means rewriting its SQL into that system's version of the language. The authors say rule-based translators "do not always perform well" and that "current evaluation practices for LLM-based SQL translation remain overly simplistic": an execution-based check can miss that outputs differing only in format mean the same, or that a translation silently breaks a schema rule such as a foreign key (§I, PDF pp. 1–2). They build DLBench, 6,402 translation tasks across seven database systems, made with LLM-based and human annotation, and score seven LLMs on dialect-specific constructs, exact text match and identical execution results (§I, PDF pp. 2–3). With their basic prompt (§V-B, PDF p. 7), the best model, GPT-4o, reaches 0.70 execution accuracy over both datasets, against 0.67 for Gemini-2.5-flash and far less for the small open models (Fig. 6, PDF p. 8). They present DLBench as "the first comprehensive benchmark designed to evaluate the SQL translation capabilities of Large Language Models (LLMs)" (abstract, PDF p. 1).

## Background and terms

**Terms to know:** [SQL dialect](#/glossary/sql-dialect) · [text-to-SQL](#/glossary/text-to-sql) · [execution accuracy](#/glossary/execution-accuracy) · [exact match](#/glossary/exact-match) · [F1 score](#/glossary/f1-score) · [Cohen's kappa](#/glossary/cohens-kappa) · [self-consistency](#/glossary/self-consistency-majority-voting) · [integrity constraint](#/glossary/integrity-constraint) · [DQL, DDL, DML, DCL and TCL](#/glossary/sql-statement-categories-ddl-dml-dql-dcl-tcl) (Fig. 4 legend, PDF p. 6; classified following the SQL standard, ISO/IEC 9075, §III-B, PDF p. 5) · [open coding](#/glossary/open-coding) (used for the error taxonomy, §VI-C, PDF p. 9) · [SQL standard](#/glossary/sql-standard) (SQL-92, its 1992 edition, is detected with an "ANTLR parser based on the ANSI Standard", §III-A(2), PDF p. 4)

**The paper's own terms:**
- **SQL translation**: "converting SQL queries from a source dialect DBMS to a target dialect DBMS" (abstract, PDF p. 1); tasks include table definitions and permission commands too (Fig. 4, PDF p. 6).
- **Dialect, two senses**: the SQL a system accepts (§II-A, PDF p. 3); and, as a count, one dialect-specific feature: "9,320 SQL dialects" (§I, PDF p. 2), called "dialect variants" and "dialect features" in §III-B (PDF p. 5).
- **Semantic equivalence** and **dependency integrity**: the translation gives semantically equivalent results and keeps relationships among database objects, such as foreign keys (§I, PDF p. 2).
- **Approximately equivalent**: how translations whose outputs differ only in representation, such as date-time formatting, are annotated (§II-B, PDF p. 3; §III-A(4), PDF p. 5).
- **Dialect location** and **dialect knowledge**: annotations marking a task's dialect-specific features and explaining each from official documentation (§III-A(4), PDF p. 5).
- **BIRDTrans** (3,206 tasks, from BIRD's SQLite queries) and **ButterTrans** (3,196 tasks, from the MySQL and PostgreSQL test suites), both into MySQL, PostgreSQL, MariaDB, MonetDB, DuckDB and ClickHouse (Tab. II, PDF p. 6), "six widely used, large-scale open-source relational DBMSs" (§III-B, PDF p. 5).
- **DM, EM, EX** (§IV, PDF pp. 6–7): Dialect Matching, the authors' new F1 score over dialect-specific constructs; Exact Matching (all tokens equal the reference); Execution Accuracy (identical execution results).
- **IP, FS, KA** (§V-B, PDF p. 7): the Initial Prompt; Few-shot prompting, with 3 examples from the same translation direction; Knowledge-augmented prompting, which adds the labelled dialect knowledge.

**Builds on:**
- Spider (a cross-domain text-to-SQL benchmark, [Spider](#/papers/yu2018spider "Spider: A Large-Scale Human-Labeled Dataset for Complex and Cross-Domain Semantic Parsing and Text-to-SQL Task (2018)")): EM and EX are adapted from its evaluation (§IV, PDF p. 6).
- BIRD (a text-to-SQL benchmark, [BIRD](#/papers/li2023bird "Can LLM Already Serve as A Database Interface? A BIg Bench for Large-Scale Database Grounded Text-to-SQLs (2023)")): source of BIRDTrans (§III-A(1), PDF p. 4).
- MALLET [2] (LLM rule generation for dialect translation) and SEDAR [8] (cross-DBMS SQL transfer for fuzzing), which check only that a translation runs, and the dialect translator CrackSQL [12] ([CrackSQL](#/papers/zhou2025cracksql "Cracking SQL Barriers: An LLM-based Dialect Translation System (2025)")), which also compares results: the execution-based evaluation the authors argue falls short (§I, PDF p. 1).
- The rule-based translators JOOQ [3] and SQLGlot [6], the non-LLM baselines (§VII, PDF pp. 9–10).

## Problem and setting

- **Question:** how general and code LLMs perform at SQL translation, how enhanced prompts change that, and which errors they make (research questions RQ1–RQ3, §V, PDF p. 7).
- **Task (§II, PDF p. 3):** translate a statement into a target dialect, given the schema and a data instance. A valid translation parses in the target dialect (Eq. 1), gives results identical to the source's, "including preservation of row order and duplicates when explicitly specified by the query" (Eq. 2), and preserves "all functional dependencies and integrity constraints implied by the schema" (Eq. 3; [functional dependency](#/glossary/functional-dependency): some columns' values determine others'). Strict equality is required, though "practical translators may allow datatype-driven relaxations". NULLs appear only as an example of data-dependent behaviour (§II-B, PDF p. 3).
- **Scoring:** EX compares result sets of predicted and reference statements for SELECT queries, "focusing on row order and duplicates, where specified", and affected-row counts for non-query statements such as INSERT, UPDATE and DELETE (§IV-B, PDF p. 7).
- **Models (Tab. III, PDF p. 7):** the code models SQLCoder-7B, CodeLlama-7B-Instruct and Deepseek-Coder-6.7B-Instruct; the general models DeepSeek-R1-Distill-Llama-8B, GPT-3.5-turbo (the "primary test subject"), GPT-4o and Gemini-2.5-flash. Temperature 0.8, five runs, keeping the answer most consistent across runs (§V-C, PDF p. 7).

## Approach

  - Drop statements that parse as SQL-92, so the tasks focus on dialect-specific translation; check the rest with a dialect-specific parser and confirm they run. A sample of 100 SQL-92-compliant queries behaved consistently across seven systems, "and we therefore regard such discrepancies as statistically insignificant" (PDF p. 4).
  - GPT-4o-mini translates, given the dialects and schema, and the result is executed; experts review it and translate by hand what the model failed on. Three experienced experts review all translations.
  - Two annotators label each task, and a third settles disagreements. Equivalence labels rest on official documentation, with execution results as "supportive evidence", which the authors say defines equivalence "at the logical level", unlike benchmarks that judge equivalence primarily by execution (PDF p. 5).
- **Dialect Matching (§IV-A, PDF p. 6):** a dialect-specific construct occurs in exactly one dialect (Eq. 4). The constructs in each output are compared with those in the reference, and precision and recall pooled over all tasks give an F1 score (Eqs. 5–13).
- **Evaluation:** an automated translation–execution–evaluation pipeline (§I, PDF p. 2); a prompt of system message, task description, schema and sample data, and output constraints, following Pan et al. [25], a study of LLM code-translation bugs (§V-B, Fig. 5, PDF p. 7).

## Results

The authors report:
- **Construction (§III-A, PDF pp. 4–5):** "approximately 35% of the statements were successfully translated" by GPT-4o-mini in their trials (PDF p. 4); the annotators' Cohen's kappa is 0.92 (PDF p. 5).
- **Overall, initial prompt (Fig. 6, §VI-A, PDF p. 8):** GPT-4o scores DM 0.52, EM 0.28 and EX 0.70, and Gemini-2.5-flash 0.53, 0.32 and 0.67; SQLCoder is worst on all three. EM is "uniformly low across all models", which the authors say shows EM is "overly sensitive to syntactic details". Finding 1: "DM and EX serve as more informative indicators of SQL translation quality than EM".
- **By dataset and target (Tabs. IV–V, PDF p. 10; §VI-A, PDF p. 8):** most models do moderately better in EX on ButterTrans, and Finding 2 says models generalize better to "shorter, varied-dialect queries than to long, complex real-world SQL", with MySQL, PostgreSQL, MariaDB and DuckDB easiest and MonetDB and ClickHouse hardest.
- **Prompting, GPT-3.5-turbo EX only (Fig. 7, §VI-B, PDF pp. 8–9):** over the initial prompt, KA raises EX by 15% on DuckDB and 22% on ClickHouse on BIRDTrans, and by 7% to 17% on all six targets on ButterTrans, also beating FS there; on PostgreSQL in BIRDTrans, KA lowers EX slightly. Finding 3: both strategies improve translation "to varying degrees", KA "showing greater potential overall".
- **Errors in 300 sampled outputs (Fig. 8, §VI-C, PDF p. 9):** syntax errors 46%, semantic 15%, logic 28%, others 11%; Finding 4: syntax and logic errors make up 74% of failures.
- **Rule-based tools (Tab. VI, PDF p. 10)**, on the systems they support: EX of JOOQ 15.4% on BIRDTrans and 18.2% on ButterTrans, SQLGlot 8.2% and 5.2%, GPT-3.5-turbo 54.9% and 62.6%.

## Limits the authors state

- "we evaluate three source DBMSs and six popular target DBMSs, and results may differ for other DBMSs"; they plan to extend to more systems (§VII "Threats to Validity", PDF p. 11).
- Resource constraints limit the evaluation to four open-source LLMs of 6.7–8B parameters and three closed-source ones (§VII "Threats…", PDF p. 11).
- The quality and detail of the automatic translation's natural-language descriptions may affect the LLM's output, and "Human translations may also be influenced by subjective factors"; a final review mitigates this (§VII "Threats…", PDF p. 11).
- The metrics "might not fully capture the functional correctness or performance of translations" for certain query types; they plan further metrics such as execution time comparisons, logical consistency checks and performance benchmarking (§VII "Threats…", PDF p. 11).
- Untranslatable statements, where the target lacks a feature: "These issues, though rare, must be accounted for" (§III-A(3), PDF p. 5).
- The error-analysis sample size was "not determined through formal statistical power analysis" (§VI-C, PDF p. 9).
- RQ2 shows only GPT-3.5-turbo's EX, "Due to space constraints" (§VI-B, PDF p. 8).

## Open problems and building blocks

- **Open:** "SQL translation remains far from solved" (§VII "Long-term Significance…", PDF p. 10). The authors recommend using the benchmark for targeted evaluation and fine-tuning and building richer dialect-specific datasets, and call [retrieval-augmented generation](#/glossary/retrieval-augmented-generation-rag) "a practical strategy for deployment" (§VII "Implications", PDF p. 10). They say a dialect feature knowledge base crawled from seven systems reduces annotation effort for future expansion (§VII "Long-term…", PDF p. 11).
- **Released:** the benchmark repository, "publicly available" (§I, PDF p. 3); the official evaluation script, to be released with the corpus (§IV, PDF p. 6); RQ2 results for the other LLMs, "in our released artifact" (§VI-B, PDF p. 8).
- **To reuse it:** the open models ran unquantized through vLLM on one 48GB NVIDIA RTX A6000 (§V-C, PDF p. 7). Construction took GPT-4o-mini, qualified experts and "150 man-hours" (§III-A(3)–(4), PDF p. 5).

## On this site

- **Discussed in:** [Telling bad translations from legitimate engine differences](#/challenges/bad_translation_detection) · [SQL dialect translation](#/challenges/dialect_translation)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/dialect-pairs">dialect-pairs</a><a class="tag sub" href="#/tags/dialect-translate">dialect-translate</a><a class="tag sub" href="#/tags/llm-gen">llm-gen</a></span>
