# Dialect-Agnostic SQL Parsing via LLM-Based Segmentation

**SQLFlex** · PACMMOD 4(3) / SIGMOD 2026

Read: [PDF](https://arxiv.org/pdf/2603.16155) · [arXiv](https://arxiv.org/abs/2603.16155) · [DOI](https://doi.org/10.1145/3802038)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Dialect-agnostic parsing: grammar-based parsing plus LLM segmentation with validation checks.
- Used for linting and test-case reduction.
- A possible front end for running checkers on dialects they don't parse; the authors call it best-effort and defer correctness-critical uses (§1) (borderline, kept: dialect-agnostic parsing, not translation).

## In plain words

Most SQL analysis and rewriting tools turn a query into a tree with a grammar-based parser, which often fails on syntax that only some database systems accept; multi-dialect parsers need "substantial manual effort" per new dialect (§1). The authors build SQLFlex, a "dialect-agnostic query rewriting framework": it tries an ordinary parser first and, where that fails, asks an LLM (GPT-4.1) to cut the failing text into pieces that the parser can handle or that become leaves of the tree, checking each cut against its input (§1). On SELECT queries from eight database systems' test suites, it reports that 91.55% to 100% of queries print back to the same text (ignoring whitespace and parentheses), the best average of all parsers compared (abstract). As the base of a linter (a tool flagging poor coding practice) on T-SQL (SQL Server's dialect) queries, it reports an F1 score 63.68% above the linter SQLFluff in generic ANSI mode, matching SQLFluff's T-SQL mode (abstract). The authors call it, to the best of their knowledge, "the first work that integrates LLM with grammar-based parsing" for this (§9).

## Background and terms

**Terms to know:** [SQL dialect](#/glossary/sql-dialect) · [test oracle](#/glossary/test-oracle) · [mutation testing](#/glossary/mutation-testing) · [text-to-SQL](#/glossary/text-to-sql) · [abstract syntax tree (AST)](#/glossary/abstract-syntax-tree-ast) · [grammar, terminals and non-terminals](#/glossary/bnf-backus-naur-form) · [test-case reduction](#/glossary/delta-debugging)

**The paper's own terms:**
- **query rewriting**: transforming a query into one that satisfies a target objective; it includes analysis, such as linting (§1). Broader than the glossary's [query rewriting](#/glossary/query-rewriting-and-rewrite-rules).
- **dialect-specific features**: syntax that the SQL standard, here SQL-92, doesn't support (§2).
- **clauses and expressions**: clauses (SELECT, FROM, …) make up a query; expressions are composable units of values, operators, functions or subqueries. In SQL-92, clauses "tend to be non-recursive, while expressions are typically recursive" (§2).
- **segmentation**: an LLM call splitting a fragment into segments, each mapped to a grammar symbol or marked dialect-specific (§3, §4).
- **anchors**: operators the grammar knows (AND, <); parenthesized parts and the text between anchors become placeholder tokens (parenthesis and mask tokens) (§4.2).
- **`Other` / `Unsegmented` nodes**: leaves holding raw text, for a dialect-specific segment with no grammar symbol (e.g. T-SQL's OPTION clause, a [query hint](#/glossary/query-hint)) (§4.1), or for a fragment still unsegmented after the repair attempts (§4.3).
- **Q-RT rate**: share of queries that print back identical after parse-and-print twice, ignoring whitespace and parentheses; pglast and SQLGlot need only match their own first output (§7.1 "Metrics", Eq. 1).
- **SM rate**: on PostgreSQL queries, per element (tables, columns, aliases, joins, common operators, literal operands, precedence), the share of trees whose extracted values overlap with those of pglast, the official PostgreSQL parser (§7.1 "Metrics").

**Missing glossary terms:**
- **round-trip property**: parsing a query and printing the tree gives the input back; a property-based test, needing no labelled answers (§7.1 "Metrics").
- **SQL anti-pattern**: poor practice that "could cause performance and maintainability issues", such as `SELECT *` (§6.1).

**Builds on:**
- SQLess ([SQLess](#/papers/lin2024sqless "SQLess: Dialect-Agnostic SQL Query Simplification (2024)")), a test-case reducer whose adaptive parser attempts to generate grammar rules for unparsed syntax: the "most closely related work" (§7.1 "Baselines"); the authors adopt its reduction algorithm and metrics and compare against it (§6.2).
- Multi-dialect parsers SQLGlot (hand-written, over 30 dialects) and SQLFluff (a linter), whose per-dialect effort motivates the work (§1, §2), and pglast; all are baselines (§6.1, §7.1). Not on this site.
- SchemaPile's (a collection of database schemas) way of checking parsed DDL (schema statements such as CREATE TABLE) against a reference parser (§7.1, §7.4). Not on this site.

## Problem and setting

- **Question:** an "automatic dialect-agnostic query parsing approach" whose tree suits "a wide range of query analysis and rewriting tasks" (§1).
- **Scope:** SELECT statements (§2), CREATE TABLE as an extension (§7.4); ANTLR with an SQL-92 base grammar (§5), SQL:2003 (a newer standard adding window functions) as a second setting (§7.3).
- **Model:** GPT-4.1, temperature zero; GPT-4.1-mini in the ablation (§5, §7.2).
- **Correctness:** many systems embed their official parser in the engine, making reference trees hard to get (§7.1 "Metrics"); the main measure is the Q-RT rate; the SM rate covers PostgreSQL.
- **Parsing benchmark,** built because, to the authors' knowledge, no public one fits (§7 "Dataset"): 9,051 SELECT queries from the test suites of the database systems PostgreSQL, MySQL, DuckDB, ClickHouse, H2, CockroachDB, Cassandra and SurrealDB, kept if a dialect-specific parser (JSQLParser for H2) accepts them and deduplicated by keyword set, except SurrealDB (§7 "Dataset", Tab. 3).
- **Linting:** 14 rules (Tab. 1) on 1,916 T-SQL queries from SESD (Stack Exchange queries); labels are what SQLFlex and SQLFluff's T-SQL mode both report, plus manual review of disagreements and a 50-query audit (§6.1 "Dataset").
- **Reduction:** a new set of 1,166 SQLite and 1,491 MySQL bug-triggering queries from SQLancer (a DBMS testing tool) with its NoREC oracle, which compares results with and without optimization (§6.2 "Dataset").

## Approach

- **Hybrid segmentation (§4, Alg. 1):** a queue of (fragment, grammar rule) pairs starts with the query. Each fragment is first parsed with ANTLR; on failure, expression-level segmentation runs for the `expr` rule, clause-level otherwise.
- **Clause-level (§4.1):** predefined mappings give each rule its tree node and prompts (one per symbol) and map segments back to symbols. Segments whose symbol has non-terminals are queued; terminal-only ones are attached; unmatched dialect-specific ones become `Other` nodes. The prompts are few-shot, and "The prompts remain unchanged when applying SQLFlex across dialects" (§4.1).
- **Expression-level (§4.2, Alg. 2):** with parenthesized parts and the text between anchors replaced by tokens, an extended grammar builds a partial tree that keeps the known operators' precedence. Each masked fragment is parsed if possible; otherwise the LLM returns a literal or the lowest-precedence operator with its operands, which recurse. Parenthesized contents go to the next round. Dialect-specific operators of unknown precedence are assumed to have the highest precedence among unparenthesized operators (§4.2). Anchors match only when space-separated (App. A.2).
- **Validation and repair (§4.3):** each output is checked for missing or extra characters, for order, and that an expression answer is a literal or an operation, not both; a failure triggers a repair prompt, up to three attempts (§5), then an `Unsegmented` node.
- **Rewriting (§4.4):** `find` and `transform` APIs and a rule-based printer.

## Results

- **Parsing (§7.1, Tab. 4)**: Q-RT ranges from 91.55% (SurrealDB) to 100% (Cassandra), averaged over three runs; the geometric mean, 96.37%, is above SQLGlot's dialect-specific mode at 93.26% (only on the dialects it supports, four in Tab. 4), SQLGlot's standard mode (a superset of its dialects) at 74.43%, pglast at 65.94% and a GPT-4.1 baseline writing the tree as JSON at 46.48%. SQLFlex's few failures are "mostly caused by limitations in handling dialect-specific features in the rule-based pretty-printer", plus some `Unsegmented` trees.
- **Semantic match (§7.1, Tab. 5)**: on PostgreSQL, highest SM rate on every element, ahead of both SQLGlot modes.
- **Ablation (§7.2, Tab. 6):** without the LLM segmenter Q-RT drops sharply; removing validation or anchors lowers it, and without anchors more LLM calls are needed; with GPT-4.1-mini SQLFlex "remains accurate even for lightweight models".
- **Efficiency (§7.3, Tab. 7):** 3.67 s per query on average, 6.39 s for segmented queries (SQL-92); the SQL:2003 grammar cuts LLM calls and time. Under SQL:2003, segmented queries took a median of 1 to 6 LLM calls per dialect; an artificial worst case took 94, "an outlier rather than typical behavior".
- **Linting (§6.1, Fig. 2)**: F1 98.14% against 98.24% for SQLFluff's T-SQL mode, and 63.68% above its ANSI mode (abstract, §1); also ahead of SQLCheck (a regular-expression linter) and a GPT-4.1-only linter. Errors come mainly from imprecise segmentation of ambiguous syntax.
- **Reduction (§6.2, Tab. 2)**: average token reduction 18.91% against SQLess's 1.83% on SQLite (the abstract's "up to 10 times") and 7.53% against 6.27% on MySQL.
- **CREATE TABLE (§7.4, Tab. 8):** on 18,139 PostgreSQL statements from SchemaPile, ahead of SQLGlot on most elements, slightly behind on columns and foreign keys.
- **AST round-trip (App. B.2, Tab. 9),** whether the tree survives printing and re-parsing: best on most datasets; it tends to be slightly lower than Q-RT, for SQLFlex mainly on complex expressions without anchors, such as window functions.
- **Mutation testing (App. C, Tab. 10)**: on the text-to-SQL benchmarks BIRD, Spider 1.0, Spider 2.0 and MiniDev, the SQLFlex-based tool "generally produces more surviving mutants" than a pglast-based one, except on MiniDev's PostgreSQL version.

## Limits the authors state

- SQLFlex "relies on a best-effort approach" (§1) and "lacks formal correctness guarantees" (§8 "Use cases").
- Validation "remains best-effort, as it might miss mistakes made by the LLM" (§4.3).
- "In practice", the authors "expect users to disambiguate the precedence of dialect-specific features that have a low precedence by adding parentheses" (§4.2).
- The round-trip property "cannot reliably detect incorrect ASTs" (§7.1 "Metrics"); the SM rate "also remains a best-effort correctness metric" (§7.1).
- Layout, symbol and capitalization rules were left out of linting, "as SQLFlex does not preserve this information during parsing" (§6.1 "Rule selection").
- Speed "does not yet match that of rule-based parsers"; it suits non-interactive uses (§8 "Efficiency"); "the number of LLM calls is highly workload-specific" (§7.3).
- Results cover "only two applications" (§8 "Use cases").

## Open problems and building blocks

  - Retrieving dialect documentation, fine-tuning ("less scalable"), better prompting and stronger LLMs may improve segmentation (§8 "Effectiveness").
  - "The main efficiency bottleneck lies in the large number of LLM calls required"; faster inference, grammar rules for common features such as `::` and `LIMIT`, and grammar inference could cut them (§8 "Efficiency").
  - Correctness-critical uses such as "SQL-level query optimization" are future work (§1); SQLFlex "could potentially be integrated with query equivalence verification tools" (§1), and research on making SQL solvers dialect-aware "might be needed" (§8 "Use cases").
- **Released:** "Our artifact is publicly available" (§1, footnote).
- **To reuse it:** the GPT-4.1 API, LangChain, ANTLR, an SQL-92 grammar, and pydantic field descriptions that took "less than ten minutes" with LLM help (§5); new statement types need grammar rules, node definitions, prompts and mappings (§7.4). The authors call it "in principle, applicable to any AST-based SQL analysis or rewriting workflow" (§8 "Use cases").

## On this site

- **Discussed in:** [Telling bad translations from legitimate engine differences](#/challenges/bad_translation_detection) · [SQL dialect translation](#/challenges/dialect_translation) · [SQL features that verifiers don't cover](#/challenges/verifier_coverage_gaps)
- **Tags:** <span class="tags"><a class="tag" href="#/tags/reduce">reduce</a><a class="tag sub" href="#/tags/dialect-parse">dialect-parse</a><a class="tag sub" href="#/tags/llm-assist">llm-assist</a></span>
