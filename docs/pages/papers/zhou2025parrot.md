# PARROT: A Benchmark for Evaluating LLMs in Cross-System SQL Translation

**PARROT** · NeurIPS 2025

Read: [PDF](https://arxiv.org/pdf/2509.23338) · [arXiv](https://arxiv.org/abs/2509.23338)  
Code: [PARROT](https://github.com/OpenDataBox/PARROT)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- A cross-system SQL translation benchmark from open-source benchmarks and real services, across many systems.
- Public leaderboard; Diverse and Simple variants.
- Translation is hard for LLMs: it reports average accuracy "lower than 38.53%" (abstract; 38.53 is the unweighted mean of Tab. 2's cells, computed here), on a benchmark that drops queries a small LLM already translates (§3).

## In plain words

Database engines such as MySQL, PostgreSQL and ClickHouse each accept their own variant of SQL, so a query written for one often fails or changes meaning on another. Moving queries between engines is, the authors say, "of great practical importance but remains underexplored", and existing SQL benchmarks mostly target one engine (SQLite) and miss engine-specific functions, data types and syntax rules (abstract, §1). They build PARROT: 598 pairs of a source query and its hand-checked translation, drawn from open-source benchmarks and from ByteDance's production queries, plus two larger variant sets covering 22 database systems, and a pipeline that filters, translates and checks the pairs (abstract, §3). LLMs are scored on whether the translation runs on the target engine and returns the same results (§4). The abstract reports that LLMs reach "lower than 38.53%" accuracy on average on PARROT; they also find that accuracy swings between target engines and that larger or reasoning models are not consistently better (§5). They present PARROT as "the first large-scale dataset and evaluation suite dedicated to cross-system SQL translation" (§1).

## Background and terms

**Terms to know:** [text-to-SQL](#/glossary/text-to-sql) · [execution accuracy](#/glossary/execution-accuracy) (the paper defines its own two metrics, below) · [query equivalence](#/glossary/query-equivalence) · [NULL and three-valued logic](#/glossary/null-and-three-valued-logic)

**The paper's own terms:**
- **Cross-system SQL translation (SQL-to-SQL)**: converting a query written for a source database system into one that follows the target system's syntax and keeps the original meaning, so that it runs with equivalent functionality on the target (§2). The paper also calls it dialect translation.
- **Dialect**: "SQLs designed for specific data systems" (§2).
- **Functional equivalence**: a translated operation is functionally equivalent to a source operation when it follows the target system's syntax ("syntactically compatible") and "produces the same execution results or has the same effect" ("semantically consistent"); example: PostgreSQL's `CURRENT_TIMESTAMP` and MySQL's `NOW` (§2).
- **Acc_EX ("Dialect Compatability")**: the share of translated queries that execute on the target database without an incompatibility error such as a wrong data type or function (§4). It counts queries that run, not results that match.
- **Acc_RES ("Result Consistency")**: the share of translated queries whose results on the target database are "strictly identical" to the source query's results on the source database, "including the returned data format, precision, and displayed order" (§4).
- **PARROT, PARROT-Diverse, PARROT-Simple**: the main set (598 pairs, 8 dialects); a 28,003-pair set across 22 dialects "for extensive syntax testing"; and 5,306 pairs built from the test cases of rule-based translation tools, which are "typically SQL snippets dedicated to a single translation type" (abstract, §4, Tab. 1). §1 instead describes 28,003 statements as an "augmented training pool" and 5,306 as a "specialized challenge set", and names Diverse and Simple separately as "two lighter benchmark variants" (§1).
- **Translation types**: seven kinds of dialect difference (App. A, Tab. 5): syntax rules, keywords, data types, operators and built-in functions, stored procedures (programs stored in the database), UDFs (user-defined functions), and other.
- **Jim Gray's benchmark design principles**: relevance, scalability, simplicity and portability, the headings under which §4 describes PARROT.

**Missing glossary terms:**
- **Code coverage**: the share of a program's code that a set of inputs exercises. PARROT keeps a query only if it raises the code coverage of a SQL parser (§3.2 Step 2).

**Builds on:**
- The text-to-SQL benchmarks Spider ([Spider](#/papers/yu2018spider "Spider: A Large-Scale Human-Labeled Dataset for Complex and Cross-Domain Semantic Parsing and Text-to-SQL Task (2018)")), BIRD ([BIRD](#/papers/li2023bird "Can LLM Already Serve as A Database Interface? A BIg Bench for Large-Scale Database Grounded Text-to-SQLs (2023)")) and WikiSQL, which the authors say target one dialect, mostly SQLite, and lack dialect annotations (§6); they are also query sources (§3.1, App. A Tab. 6).
- The rule-based translators SQLGlot, jOOQ and SQLines, which "typically encode translation logic through handcrafted rules or pattern-based templates" (§6); SQLGlot and jOOQ produce PARROT's first translations (§3.2 Step 3).
- CrackSQL ([CrackSQL](#/papers/zhou2025cracksql "Cracking SQL Barriers: An LLM-based Dialect Translation System (2025)")), an LLM-based dialect translator: a candidate annotator (§3.2 Step 3) and the "segment-based translation strategy" §5.2 points to for long queries.
- Gray's *The Benchmark Handbook* (1991), whose four principles the curation is meant to satisfy (§3, §4).

## Problem and setting

- **Question:** how well LLMs translate realistic queries between database systems, and what benchmark can measure it (§1).
- **Motivation:** the authors survey 28 open-source SQL benchmarks and read them as mostly SQLite-only, with few queries that need system-specific handling (Fig. 1 bottom, §1). Fig. 1 top shows GPT-4o failing three PostgreSQL-to-MySQL translations: a missing division-by-zero guard, a `GROUP BY ROLLUP` lost in a long query, and a column alias defined inside a CTE (a named subquery in a `WITH` clause) used outside its scope (§1).
- **Sources (§3.1):** queries from 38 open-source benchmarks; test cases and GitHub-issue queries from translation tools' repositories; and a ByteDance set of 343 pairs over 102 tables, written for a PostgreSQL-like dialect and rewritten by hand for ByteHouse (ByteDance's cloud-native data warehouse, which follows ClickHouse syntax) during a migration, verified by "senior SQL experts".
- **SQL covered:** whole queries, including stored procedures and UDFs (Tab. 5); queries reach "up to 2,182 tokens" (§4).
- **What counts as correct:** the target syntax plus the same results (§2); Acc_RES also requires the same format, precision and row order (§4). Reference pairs are checked by hand and by LLM-generated test data (§1, §3.2). How NULLs behave across engines: not discussed, apart from one case-study error (§5.3).
- **Models (§5.1):** open-source DeepSeek-R1 at 7B, 32B and 671B parameters, DeepSeek-V3 671B and the code model DeepSeek-Coder-V2 Lite; proprietary GPT-4o, o3-mini, o1-preview and Claude 3.7 Sonnet. Each gets the system and user prompt of App. A Tab. 7. Tab. 2 has no o1-preview; Tab. 3 has no DeepSeek-R1 7B or Coder.

## Approach

After collection, a five-step curation workflow (§3.2, Fig. 2):
1. **Preprocessing:** reformat and deduplicate queries; anonymize the proprietary ones at three levels: rename tables and columns and merge tables, add noise to numbers and replace text values, and abstract repeated filter conditions.
2. **Type-based filter:** drop queries that a parser for the target dialect (e.g. one built with ANTLR, a parser generator) already accepts; then group queries from the same template by a normalized prefix and, taking queries by average length, longest first, keep a query only if it raises the parser's code coverage, moving on after a set number of tries (e.g. 5).
3. **Ensemble annotator:** SQLGlot and jOOQ translate each query; CrackSQL is a candidate annotator; a small LLM (e.g. Llama3.1-8B) also translates, as a baseline for the next step.
4. **Error-guided selector:** queries that fail the target parser go to human experts (e.g. ByteHouse engineers) helped by LLM hints, and are dropped if still failing. For meaning, an LLM writes `INSERT` statements that make both queries return non-empty results and is steered to provoke different results, for up to a set number of rounds (e.g. 5); a pair is dropped once results differ. Queries the small LLM already translates correctly are removed "to enhance the difficulty of the constructed benchmark".
5. **Serialization:** each pair goes into a JSON file with an id, source dialect, target dialect and the queries.

Evaluation runs translations on the target engines and reports Acc_EX and Acc_RES (§4). §1 describes the protocol as "reference executors, schema normalizers, and an execution-first metric". An efficiency score is mentioned but not used (§4).

## Results

- **Curation volume:** the authors report the workflow cut 9,912,231 SQL pairs to 28,003 (§4 "Simplicity").
- **Main set, Tab. 2:** "Translation Accuracy (%)" of 8 models for five target dialects, PostgreSQL, MySQL, Oracle, DuckDB (an embedded analytical database) and SQL Server, from any source.
- **Observation 1, accuracy swings by target (§5.2)**: GPT-4o scores 58.62% into PostgreSQL but 50.00% into MySQL, below DeepSeek-R1 32B there. The authors conclude LLMs must "capture the nuanced differences of diverse dialect standards".
- **Observation 2, size and reasoning don't reliably help (§5.2)**: DeepSeek-R1 32B beats DeepSeek-R1 671B into PostgreSQL, MySQL and SQL Server (58.62%, 58.82%, 42.11% against 48.28%, 44.12%, 36.84%), and reasoning LLMs such as o3-mini "exhibit undesirable translation performance".
- **Observation 3, longer queries fail more (§5.2)**: the authors report that all LLMs lose accuracy as queries grow longer, citing Tab. 3, and attribute it to more operations per query and to hallucination and "lost-in-the-middle" (losing track of mid-prompt content).
- **ByteHouse workload, Tab. 3**: o3-mini scores highest, 58.60% Acc_EX and 54.23% Acc_RES, against 23.91% and 21.87% for GPT-4o.
- **Case study, Tab. 4 (§5.3):** on one ByteHouse query o3-mini makes two errors. It passes an integer column to `parseDateTimeBestEffort` without the source's conversion to text and drops the date format, causing a runtime error; and it replaces an `IS NOT NULL` test with `!= ''`, which the authors call incorrect handling of NULL values. They conclude LLMs "are still too careless to miss some operations in the source SQLs".

## Limits the authors state

- The ByteDance set "represents only a portion of the internal data" (§3.1).
- Execution efficiency matters for translated business queries, but "our primary focus lies in the translation accuracy in this paper" (§4).
- Field-level anonymization replaces data values, on the view that "specific values typically do not affect cross-system translation" (§3.2 Step 1).
- The rule-based annotators "might inevitably produce incorrect translations (e.g., missing specific rules)", which Step 4 is meant to catch (§3.2).

## Open problems and building blocks

  - How to design an LLM "or augment existing ones to specifically enhance the dialect translation capability so that different dialects can be equivalently handled well" (§5.2, Observation 1).
  - The two abilities the authors say accurate translation needs: SQL understanding, and "the SQL syntax matching ability to be aware of the equivalent operations" (§5.2).
  - Techniques for translating long queries, e.g. CrackSQL's segment-based strategy (§5.2).
- **Released:** "a public leaderboard and source code" (abstract); §1 adds "an open-sourced annotation toolchain" and the two lighter variants (§1).
- **To reuse it:** the target database engines, to execute translations (§4); for the pipeline, target-dialect parsers (e.g. ANTLR), SQLGlot and jOOQ, an LLM for test data, a small LLM as difficulty filter, and human experts for syntax fixes (§3.2); the translation prompt (App. A Tab. 7). Experiments ran on two Xeon CPUs with 256 GB memory and "four GeForce RTX 3080 and H100 Ti graphics cards" (§5.1).

## On this site

- **Discussed in:** [Telling bad translations from legitimate engine differences](#/challenges/bad_translation_detection) · [SQL dialect translation](#/challenges/dialect_translation) · [Equivalence of nondeterministic queries](#/challenges/nondeterministic_equivalence) · [Sourcing realistic, hard query pairs](#/challenges/query_pair_sourcing)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/dialect-difftest">dialect-difftest</a><a class="tag sub" href="#/tags/dialect-pairs">dialect-pairs</a><a class="tag sub" href="#/tags/llm-assist">llm-assist</a><a class="tag sub" href="#/tags/llm-gen">llm-gen</a></span>
