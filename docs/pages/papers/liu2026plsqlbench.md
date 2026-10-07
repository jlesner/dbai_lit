# PLSQLBench: Benchmarking LLM Systems for Executable Procedural Database Programming

**PLSQLBench** · preprint 2026

Read: [PDF](https://arxiv.org/pdf/2608.15931) · [arXiv](https://arxiv.org/abs/2608.15931)  
Code: [plsqlbench](https://github.com/oracle-samples/plsqlbench)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- A benchmark of writing executable PL/SQL, scored by execution-based tests (abstract).
- Single-turn tasks and multi-turn conversations over Spider 2 and Spider databases, plus MBPP-derived procedural problems (abstract).

## In plain words

Many business databases run stored programs written in a procedural SQL language such as Oracle's PL/SQL, which mixes queries with variables, loops and error handling. The authors say existing LLM benchmarks target general-purpose code or single declarative SQL queries, "leaving procedural database programming underexplored" (abstract). They build PLSQLBench: 2,865 PL/SQL tasks, some single requests and some conversations whose later requests extend or fix earlier code, over databases from the Spider and Spider 2.0 benchmarks, plus exercises translated from the MBPP programming benchmark. Answers are scored by running tests in an Oracle database (§3). Across eight models, the best score averaged over the three test sets (the share of a task's tests passed) is 64.96% for GPT-5.4, just ahead of Claude-Opus-4.8 at 63.49% (§4). A coding agent that can query the database scores higher on the Spider 2.0 tasks, but at best still finishes fewer than half of the test conversations with every turn correct (§4). The authors call PLSQLBench "to our knowledge the first benchmark for evaluating whether LLMs can write executable PL/SQL programs" (abstract).

## Background and terms

**Terms to know:** [stored procedure and trigger](#/glossary/stored-procedure-and-trigger) · [SQL dialect](#/glossary/sql-dialect) · [text-to-SQL](#/glossary/text-to-sql) · [gold query](#/glossary/gold-query) · [execution accuracy](#/glossary/execution-accuracy) · [Pass@k](#/glossary/passk) · [LLM-as-a-judge](#/glossary/llm-as-a-judge)

**The paper's own terms:**
- **PL/SQL**: "Oracle's procedural extension to SQL", supporting "variables, control flow, exception handling, cursors, packages, object types, and dynamic SQL" (App. F.1, Fig. 8). A cursor steps through a query's rows; a package groups procedures behind a public specification.
- **Schema grounding**: using the tables, columns and objects the given schema really has; named as a recurring difficulty (abstract).
- **DDL**: the schema-definition statements (`CREATE TABLE …`) given in each prompt (App. F.1).
- **Subsets** (§3.1, Tab. 1): **Spider2-ST** and **Spider2-MT**, new single-turn and multi-turn tasks written over Spider 2.0 Lite databases ported to Oracle; **Spider-PLSQL**, the original Spider 1.0 questions answered in PL/SQL; **MBPP-PLSQL** and **MBPP+-PLSQL**, short exercises with their Python tests translated to PL/SQL, needing no database tables.
- **Task families** (§3.3, App. B.3): code generation, code repair (fix "incorrect, incomplete, or failing" code), and interactive development, whose later turns "may add new requirements, modify business logic, introduce debugging feedback, or ask for repairs".
- **Mean Test Pass@1** (§4.2, App. C): the main metric, with partial credit. Per task, the fraction of its unit tests the model's single generated program passes, averaged over tasks; a conversation counts as one item (its passed tests over all its tests).
- **Suite Pass@1**: a task counts only if all its tests pass. For conversations, **Turn Suite Pass@1** is the share of turns passing all their tests and **Episode Pass@1** the share of conversations in which every turn does (§4.2, App. C).
- **Rollout evaluation**: for Spider2-MT, reference and generated answers are each run turn by turn in their own clean state, so later turns see what earlier turns built (§3.4). The model's own earlier answers stay in its history (§4.2, Tab. 11).
- **Codex DB Agent**: a Codex CLI-based agent with a GPT-5.4-Mini or GPT-5.6-Sol backbone, "using Oracle SQL/PLSQL skills" and a database tool (§4.1); the paper doesn't describe these further.

**Builds on:**
- Spider 2.0 Lite ([Spider 2.0](#/papers/lei2024spider2 "Spider 2.0: Evaluating Language Models on Real-World Enterprise Text-to-SQL Workflows (2025)"), enterprise text-to-SQL workflows), whose databases, from dialects including SQLite, Snowflake and BigQuery, are converted to Oracle (§3.1, App. B.2).
- Spider 1.0 ([Spider](#/papers/yu2018spider "Spider: A Large-Scale Human-Labeled Dataset for Complex and Cross-Domain Semantic Parsing and Text-to-SQL Task (2018)"), cross-domain text-to-SQL), through an Oracle-converted release whose gold SQL results serve as expected outputs (§3.1, App. B.4).
- MBPP (Mostly Basic Programming Problems, short Python exercises with unit tests) and MBPP+ (an MBPP subset with many more tests), not listed here; App. B.5 cites EvalPlus ([EvalPlus](#/papers/liu2023evalplus "Is Your Code Generated by ChatGPT Really Correct? Rigorous Evaluation of Large Language Models for Code Generation (2023)")): a small number of tests can fail to catch many wrong programs.
- MXEval (not listed here), a multilingual code benchmark built by rule-based conversion with manual expert review, contrasted with their pipeline (App. B.5).

## Problem and setting

- **Question:** can LLM systems generate, modify, debug and repair executable PL/SQL "while preserving conversational context" (§1)? PL/SQL is chosen because Oracle Database "is currently ranked first in the DB-Engines popularity ranking" (§1).
- **Dialect and engine:** Oracle PL/SQL on Oracle Autonomous Database 23ai (App. G, Tab. 11).
- **Read-only:** tasks "do not require modifying persistent data through inserts, updates, or deletes" (§3.1).
- **What correct means** (§3.4): output matches the expected output. Spider2 expected outputs come from running the same tests on a curated reference PL/SQL answer; MBPP tests are the Python asserts translated into PL/SQL test blocks; Spider-PLSQL programs print one comma-separated line per row, compared with the gold SQL result under "a bounded set of permutations" of its columns (§3.4). A compile error, runtime error or missing object counts as zero tests passed (App. C).
- **Prompt and decoding:** the prompt gives the schema DDL and the request; the model is told to return only PL/SQL, or exactly `INVALID_REQUEST` if required tables, columns or objects are missing or the task is logically impossible (App. F.1, Fig. 8). One sample per task (§4.2, App. C), temperature 0.0 (Tab. 11).
- **Splits** (§4.1): Spider2 development and private test splits are database-disjoint; MBPP+-PLSQL and the Spider2 test splits are the evaluation sets; the translated MBPP+ tests are withheld.
- **Sizes** (§3.1, Tab. 1): 2,594 single-turn tasks and 271 conversations of 978 turns; Spider2-ST 407 development and 103 test tasks, Spider2-MT 208 and 63 conversations, Spider-PLSQL 970, MBPP-PLSQL 806, MBPP+-PLSQL 308.
- **Models** (§4.1, Tab. 2): open-weight Llama-4-Maverick and Gemma-4-31B; proprietary Gemini-2.5-Flash-Lite, Grok-4.3, GPT-5.4-Mini, GPT-5.4, GPT-5.6-Sol and Claude-Opus-4.8.
- **NULLs:** example tasks specify behavior for NULL inputs (App. D.3); the Oracle port replaces unloadable values (BigQuery geography values, `NaN`, infinities) with NULL (App. B.2).

## Approach

- **Oracle port** (App. B.2): Spider 2.0 Lite identifiers, types and literals are rewritten so the data loads in Oracle.
- **Spider2 curation** (App. B.1, B.3): tasks start from preassigned metadata (database, required constructs, reasoning types, difficulty, turns); annotators write the prompt, a reference solution and deterministic tests to match, "updated consistently across turns" for multi-turn tasks (App. B.3).
- **Spider2 quality control** (§3.5, App. B.6, Tab. 4): automatic checks (compilation, execution, test validity and more), human review, post-processing and an LLM-as-judge pass; failing examples are "revised or removed" (§3.5).
- **MBPP conversion** (App. B.5): "fully rule-based and automatic". It parses each Python assert, infers argument and return types, rejects non-literal or unsafe tests and inconsistent types, and emits a PL/SQL signature, collection types and a test block. A replay check shows each test block runs and can be satisfied. With GPT-5.5 given the Python solution and growing shares of tests, the MBPP+ pass rate rises (Tab. 5); a comparison with Python outputs serves as "a strong sanity check rather than as a proof of exact semantic equivalence".
- **Error taxonomy** (§4.4, App. E.2): each failed task or turn, excluding reference or harness failures, is put in one of three classes using Oracle error codes and expected-versus-actual outputs.

## Results

- **Direct generation** (Tab. 2, §4.3): on Mean Test Pass@1 averaged over the three test sets (MBPP+, Spider2-ST test, Spider2-MT test), GPT-5.4 leads at 64.96%, then Claude-Opus-4.8 at 63.49%; open-weight Gemma-4-31B ranks third, ahead of GPT-5.6-Sol. Subset leaders differ (GPT-5.6-Sol on MBPP, Claude-Opus-4.8 on Spider-PLSQL, GPT-5.4 on both Spider2 subsets), so "no single model dominates"; the authors read the best score as "indicating substantial headroom" (§4.3).
- **Tool-augmented agent** (§4.3, Tab. 3, 9, 10): Codex DB Agent, with medium reasoning (Tab. 3), "improves every Spider2 result for both backbones"; on the Spider2 test sets Mean Test Pass@1 rises 6.9–9.8 points with GPT-5.4-Mini and 12.0–14.5 with GPT-5.6-Sol. On MBPP+ one backbone gains and the other loses slightly, "suggesting that the benefits of database interaction are primarily concentrated in schema-grounded tasks".
- **Strict metrics** (§4.3, Tab. 9, 10): scores drop when every test must pass. On Spider2-MT test, GPT-5.4 reaches 33.33% Episode Pass@1 against 59.21% Turn Suite Pass@1; the best agent (GPT-5.6-Sol) reaches 41.27% Episode Pass@1, "fewer than half of the conversations without error". The authors conclude that "errors compound across successive modifications".
- **Error analysis** (§4.4): wrong logic or output makes up 82.5% of failures (11,015: 9,953 output mismatches, 1,062 runtime failures), invalid or incomplete PL/SQL 13.3% (1,777), interface or schema-grounding errors 4.2% (566). Spider2-MT has 525 of the 566 interface errors, "suggesting that multi-turn settings make it harder for models to preserve interface contracts and schema grounding across edits".

## Limits the authors state

- It "covers only a subset of real-world database development"; larger schemas, legacy dependencies, performance constraints, permission boundaries and deployment requirements "are not fully captured" (§ "Limitations").
- It "currently supports only read-only PL/SQL programs", which "omits important write-oriented workflows" (§ "Limitations").
- "correctness is bounded by test coverage: passing all tests does not guarantee that a program is correct under all inputs" (§ "Limitations").
- No large training set: results should be read as measuring generalization to its schemas, formats and tests, "rather than their ability to adapt through benchmark-specific tuning" (§ "Limitations").
- LLM-assisted task and prompt creation "may introduce artifacts or distributional biases", which the authors say human review and execution checks mitigate (§ "Ethical Considerations").
- The MBPP-derived tasks need no tables; the authors "nevertheless, believe" they give "a useful indication" of PL/SQL ability, and call the Python-to-PL/SQL comparison "itself heuristic" (App. B.5).
- Hand-inspected error examples avoid those "that are primarily artifacts of brittle exact-string evaluation, such as harmless date-format differences" (App. E.2).

## Open problems and building blocks

- **Open:** updatable PL/SQL, hard because data changes "may be interleaved with DDL, commits, rollbacks, and session-level side effects that are difficult to isolate or undo"; left to future work (§ "Limitations"). Multi-turn is where "The bottleneck is larger" (§4.3). §5 ends by "highlighting the need for LLMs that reason more reliably over executable database semantics, dialect constraints, and iterative database development".
- **Released:** "Our code is available" (abstract). The Spider2 test splits are private and the translated MBPP+ tests withheld (§4.1).
- **To reuse it:** an Oracle database and the benchmark schemas; temperature 0.0, at most 8,192 output tokens (App. G, Tab. 11).
- **Beyond its domain:** none claimed.

## On this site

- **Discussed in:** [Whole-job reliability of multi-step LLM work](#/challenges/whole_job_reliability)
- **Tags:** <span class="tags"><a class="tag" href="#/tags/dbtask">dbtask</a><a class="tag sub" href="#/tags/harness-sql">harness-sql</a><a class="tag sub" href="#/tags/llm-gen">llm-gen</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/nl2sql-misc">nl2sql-misc</a></span>
