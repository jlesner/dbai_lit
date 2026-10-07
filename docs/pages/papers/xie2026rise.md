# RISE: Rule-Driven SQL Dialect Translation via Query Reduction

**RISE** · ICSE 2026

Read: [PDF](https://arxiv.org/pdf/2601.05579) · [arXiv](https://arxiv.org/abs/2601.05579) · [DOI](https://doi.org/10.1145/3744916.3773257)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Reduces a query to the part relevant to one dialect feature and has an LLM translate it.
- Extracts a translation rule from the pair and applies it to the full query.
- LLM-discovered *translation rules*: rule discovery across dialects.

## In plain words

Database systems such as PostgreSQL, MySQL and Oracle each speak their own variant of SQL, so moving an application between them means rewriting its queries. The authors say hand-written translation tools miss features and are costly to maintain, and that an LLM translating a long query often changes parts that needed no change (§1). Their system, RISE, cuts a query down to the few lines that still fail on the target system, has an LLM translate that small query, turns the before-and-after pair into a reusable rewrite pattern, and applies it to the full query (§1). A translation is accepted when both systems run it and return the same results (§3).

On analytical queries translated from PostgreSQL to MySQL and stored procedures (programs kept inside the database) translated from PostgreSQL to Oracle, the authors report 97.98% and 100% accuracy with GPT-4o, ahead of all six baselines (abstract, §4). They call RISE "novel" (abstract) and their study of plain LLM translation the "first empirical study" of its kind (§1).

## Background and terms

**Terms to know:** [query equivalence](#/glossary/query-equivalence) · [abstract syntax tree (AST)](#/glossary/abstract-syntax-tree-ast) (§3) · [stored procedure](#/glossary/stored-procedure-and-trigger) (§2.1.1) · [program reduction](#/glossary/delta-debugging); the other field terms are not in the glossary yet (below).

**The paper's own terms:**
- **SQL dialect**, two senses: a vendor's variant of SQL (§1); and one vendor-specific construct in a query, as in Fig. 1's query with "two PostgreSQL-specific dialects" (§1). RISE translates one construct at a time.
- **Semantic equivalence**: same query results and same database states before and after translation (§1).
- **Dialect-irrelevant elements**: the parts of a query unrelated to the construct being translated (§1).
- **Accuracy**: a translation is correct when it runs on the target system, matches the source query's results, and a manual check confirms equivalence (§2.1.3, §4.1.2).
- **LLMTranslator**: the authors' prompting baseline: collect error messages by running the source query on both systems, have the LLM summarise the query's dialect features, then translate with both, using chain of thought and at most three iterations (§2.1.2). Variants drop the messages (w/o ErrMsg), the summaries (w/o Summary) or both (SingleLLM).
- **Translation rule**: a source and a target tree pattern; a part of a query's syntax tree that matches the source pattern is replaced by the target pattern (§3.3.2).
- **Placeholders**: `$N` for a name or constant present in both patterns, `ANYVALUE` for a new name (filled with a fresh one), `TREE_N` for any subtree whose root has a given type (§3.3.2).
- **Notation:** source query Q_c, simplified query Q_s, its translation Q_s′, rule r_d (abstract). **NVR**: number of valid rules (§4.3).

**Missing glossary terms:**
- **Parser grammar**: ANTLR is a parser generator that builds a parser from a grammar file (`.g4`) of syntax rules (§3.2.1).

**Builds on:**
- The rule-based translators SQLGlot (an open-source SQL transpiler), SQLines (a migration tool) and jOOQ (a Java SQL library with dialect translation), whose rules the authors call "incomplete and error-prone" (§1, §4.1.2).
- LLM-based translation: Mallet, whose LLM-generated rules developers add to SQLGlot (§1, §6; not listed here), and CrackSQL ([CrackSQL](#/papers/zhou2025cracksql "Cracking SQL Barriers: An LLM-based Dialect Translation System (2025)")), which combines LLMs with cross-dialect embeddings and translates piece by piece (§4.1.2, §6).
- SQLess ([SQLess](#/papers/lin2024sqless "SQLess: Dialect-Agnostic SQL Query Simplification (2024)")), the inspiration for RISE's adaptive parser (§3.2.1).
- Program reduction methods (HDD, Perses and others), cited as related; RISE deletes random subtrees instead (§3.2.2, §6).

## Problem and setting

- **The question:** can long, complex queries be translated between dialects accurately without hand-written rules, given that LLMs handle short queries well but err on long ones (§1, §2)?
- **Benchmarks**: PostgreSQL to MySQL on TPC-DS, an industry benchmark of 99 analytical queries, some over 100 lines; PostgreSQL to Oracle on SQLProcBench's 44 stored procedures, procedural code on the TPC-DS schema (§2.1.1, §4.2); 143 queries in all (§5.1). The authors built the PostgreSQL TPC-DS by hand-fixing its version for DB2 (IBM's database system); 12 queries also run on MySQL unchanged (§4.1.3).
- **What correct means:** the accuracy metric above. RISE itself only executes queries on the benchmark's table data, resetting the database before each check (§3.1).
- **Models:** GPT-4o for all of RISE; DeepSeek-V3 also in the study and baselines (§2.1.2, §4.1.3).
- Set or bag semantics, and NULLs: not discussed.

## Approach

Five steps, repeated up to three times (§3, Fig. 2; §4.1.3):

- **1. Validation (§3.1):** run the source query on the target system; if it fails or its results differ, the error or difference marks an untranslated construct. Every translation is checked the same way: it fails if the target can't run it, returns different results, or leaves a different database state. The authors say this can "effectively verify the syntactic validity and semantic equivalence" of the queries.
- **2. Reduction (§3.2):** an ANTLR parser for the source system; on a parse failure an LLM writes new grammar rules, which are "manually validated" (§3.2.1). Then random reduction deletes up to two subtrees at a time, keeping a deletion only if the query still runs on the source and still gives the same error on the target. An LLM then shortens it further (Listing 1): five outputs per attempt, scored by how similar their target error is to the original, with 0.85 as "an empirically determined threshold", up to five rounds (§3.2.2).
- **3. Translation (§3.3.1):** LLMTranslator translates the reduced query, retrying when validation fails.
- **4. Rule generation (§3.3.2):** extraction (Alg. 1) takes the smallest pair of subtrees with the same root outside which the two trees are identical (Fig. 3: MySQL requires every derived table, a subquery used in `FROM`, to have a name, its alias); abstraction (Alg. 2) inserts the placeholders, assuming names, constants and unchanged subtrees are irrelevant to the dialect.
- **5. Conversion (§3.4, Alg. 3):** replace every subtree of the full query that matches the source pattern with the filled-in target pattern. Rules are kept for later queries (§4.4).

## Results

- **Plain LLMs (§2.2, Tab. 1):** on the 143 queries, SingleLLM reaches 76.22% (GPT-4o) and 71.33% (DeepSeek-V3), full LLMTranslator 86.71% and 82.52%; "A pure LLM alone can correctly translate the majority of dialects" (§2.2).
- **Failure factors (§2.3):** of the 44 LLMTranslator failures, 38.64% were fixed by removing irrelevant parts by hand; after reduction GPT-4o fixed all 8 of its remaining cases, DeepSeek-V3 all but those involving `ROLLUP`, a `GROUP BY` option that adds subtotal rows and behaves slightly differently in MySQL and PostgreSQL (§2.3; the difference is shown in Fig. 4). The authors name three kinds of hallucination: improper optimizations of unrelated parts, mishandling the construct in complex context, and changing column names or dropping elements.
- **Accuracy (§4.2.1, Tab. 2)**: RISE reaches 97.98% on TPC-DS and 100.00% on SQLProcBench, against 90.91% and 77.27% for LLMTranslator on GPT-4o and 82.83% and 81.82% on DeepSeek-V3.
- **Other baselines (Tab. 2):** jOOQ, SQLines and SQLGlot reach 73.74%, 67.68% and 75.76% on TPC-DS and 13.64%, 0.00% and 0.00% on SQLProcBench; CrackSQL 80.81% and 4.55%, the latter attributed to its lack of stored-procedure knowledge (§4.2.1).
- **RISE's failures (§4.2.2):** two TPC-DS queries using `||` (string concatenation in PostgreSQL, logical OR in MySQL), missed because both systems returned empty results.
- **Ablation (§4.3, Tab. 3)**: without reduction, accuracy falls to 81.82% and 72.73%, and valid rules from 13 to 3 and from 37 to 20; the authors blame edits to irrelevant parts and query length (§4.3.1).
- **Efficiency (§4.4, Fig. 5):** on GPT-4o, RISE starts slower than LLMTranslator because it has no rules yet; the 99 TPC-DS queries take 25.42 minutes (RISE), 26.75 (LLMTranslator) and 84.02 (CrackSQL).
- **Rules (§4.5, Listings 2–3):** judged valid by manual inspection; they cover constructs such as `FULL OUTER JOIN`, `INTERVAL` and `FETCH FIRST N ROWS`, and procedure declarations, cursors and exceptions.
- **Reduction cost (§3.2.2 footnote):** random reduction averages 16 seconds per query and removes 91% of it.

## Limits the authors state

- RISE "cannot fully resolve semantic inconsistencies, as relying solely on the execution results of DBMSs cannot ensure complete accuracy" (§5.2), as the `||` case with empty results shows; validating equivalence across systems automatically is "challenging" (§5.2).
- Some constructs depend on schema information the query alone doesn't give, e.g. PostgreSQL's `/`; rules carry no schema information, "resulting in potentially unreliable translation rules" (§5.2).
- The main threat to validity is query diversity and generalisation to other database systems (§5.1).
- Random reduction may leave irrelevant parts inside subqueries and `WITH` clauses, hence the LLM step (§3.2.2).
- Mallet is not publicly available, so it is no baseline (§4.1.2).

## Open problems and building blocks

- **Open:** resolving semantic inconsistency "remains as our future work" (§5.2); extending rules with schema information (§5.2); more benchmarks, database systems and dialects (§5.1); bringing program-reduction methods to SQL "represents a significant research direction" (§6).
- **Released:** "We have made our tool available" (§1).
- **To reuse it:** GPT-4o (§4.1.3); an ANTLR grammar for the source system with manual review of LLM-written patches (§3.2.1, §4.1.3); running source and target systems with table data (§3.1). Evaluated on PostgreSQL to MySQL and PostgreSQL to Oracle (§4.2).

## On this site

- **Discussed in:** [Telling bad translations from legitimate engine differences](#/challenges/bad_translation_detection) · [SQL dialect translation](#/challenges/dialect_translation) · [Discovering new rewrite rules](#/challenges/rewrite_rule_discovery)
- **Tags:** <span class="tags"><a class="tag" href="#/tags/reduce">reduce</a><a class="tag sub" href="#/tags/dialect-difftest">dialect-difftest</a><a class="tag sub" href="#/tags/dialect-translate">dialect-translate</a><a class="tag sub" href="#/tags/harness-sql">harness-sql</a><a class="tag sub" href="#/tags/llm-gen">llm-gen</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/rules-discover">rules-discover</a><a class="tag sub" href="#/tags/scaling-sql">scaling-sql</a></span>
