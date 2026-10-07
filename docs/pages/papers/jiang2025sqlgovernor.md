# SQLGovernor: An LLM-powered SQL Toolkit for Real World Application

**SQLGovernor (Tencent)** · preprint · 2025

Read: [PDF](https://arxiv.org/pdf/2509.08575) · [arXiv](https://arxiv.org/abs/2509.08575)  
Code: [SQLGovernor](https://github.com/TencentBigData-SiriusAI/SQLGovernor)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Toolkit for SQL syntax correction, query rewriting, query modification and equivalence verification, with LLM-generated, expert-validated rules (abstract; §4.3).
- Its equivalence verifier is an LLM agent behind a reject-only schema heuristic, with no correctness guarantee (§5.3, Tab. 2).
- It reports verifier F1 57.1% on BIRD dev's challenging queries, with labels from CodeS-7B execution match (Tab. 7, §6.3.4).

## In plain words

Hand-written and generated SQL queries "often suffer from syntax errors, inefficiency, or semantic misalignment, especially in complex OLAP scenarios" (abstract): analytical queries that are typically deeply nested, run over large data and often rerun (§1). They argue existing tools typically cover isolated tasks, few keep a knowledge base, and companies depend on scarce experts (§1). SQLGovernor is a toolkit of four LLM tools: a syntax fixer, a rewriter for speed, a modifier following plain-language requests, and a checker of whether two queries mean the same. The tools work piece by piece, drawing on stored rules and past cases that an LLM extends from database outputs with expert approval (§1). On benchmarks and industrial data, they report that it "consistently boosts the performance of base models by up to 10%", and that it shows "strong practical utility" in production (abstract). On 50 industrial queries, rewriting cut execution time by 45.92% on average, against 31.25% for the next-best rewriter (§6). "To the best of our knowledge", they write, it is "the first comprehensive LLM-based SQL toolkit with a knowledge management module" (§1).

## Background and terms

**Terms to know:** [text-to-SQL](#/glossary/text-to-sql) · [gold query](#/glossary/gold-query) · [execution accuracy](#/glossary/execution-accuracy) · [query equivalence](#/glossary/query-equivalence) · [query rewriting and rewrite rules](#/glossary/query-rewriting-and-rewrite-rules) · [common table expression (CTE)](#/glossary/common-table-expression-cte) · [F1 score](#/glossary/f1-score) · [OLAP and OLTP](#/glossary/olap-and-oltp)

**The paper's own terms:**
- **fragment**: a self-contained piece of a query: the main query, each CTE, and, recursively, each subquery inside them; each is analysed on its own (§5.1, Alg. 1).
- **knowledge base**: one repository per tool, with two parts: "Rules" (an index and a description of the rule's use and scope) and "Historical Data" (past cases with an index, details, and a tag linking them to rules) (§4.1, Fig. 2).
- **hybrid self-learning**: an LLM agent reads the logs of queries that "fail to meet user requirements" (such as errors, wrong results, excessive runtime) and writes new rules (prompt in Listing 1); experts verify them "based on predefined conditions" once the count of new rules or the time since the last update passes a threshold, and near-duplicates are merged by clustering their RoBERTa text embeddings with DBSCAN, a density-based clustering method (§4.3).
- **Scenario 1 / Scenario 2**: the rewriter's prompt when a stored rule matches a fragment, and when none matches and the query also fails the "already efficient SQL" rules, so the LLM looks for a faster form itself (§5.2.1).
- **SR (success rate)**: BIRD-CRITIC's official metric, judged by the benchmark's test cases (§6.1).
- **ETS, ETOG, Cost, Δ**: Execution Time Saved is run time before rewriting minus run time after; Execution Time Optimization Gain is ETS as a percentage of the time before (§6.1); Cost is the time spent rewriting, and Δ is ETS minus Cost (§6.3.3, Tab. 6).
- **Payment-SQL**: the authors' dataset of 50 analytical queries from industrial OLAP work, curated by experts from execution logs, averaging 421 tokens (§6.1).

**Builds on:**
- The LLM query rewriters GenRewrite ([GenRewrite](#/papers/liu2024genrewrite "GenRewrite: Query Rewriting via Large Language Models (2026)")) and LLM-R² ([LLM-R2](#/papers/li2024llmr2 "LLM-R2: A Large Language Model Enhanced Rule-Based Rewrite System for Boosting Query Efficiency (2024)"); an LLM picks rewrite rules, guided by a trained demonstration selector), the rewriting baselines (§2.1, §6.3.3).
- SQLFixAgent, a multi-agent LLM tool that repairs text-to-SQL output (not listed here), the post-processing baseline on BIRD (§6.2.1, Tab. 1).
- The benchmarks BIRD ([BIRD](#/papers/li2023bird "Can LLM Already Serve as A Database Interface? A BIg Bench for Large-Scale Database Grounded Text-to-SQLs (2023)"); text-to-SQL over 95 large databases) and BIRD-CRITIC ([SWE-SQL (BIRD-CRITIC)](#/papers/li2025swesql "SWE-SQL: Illuminating LLM Pathways to Solve User SQL Issues in Real-World Applications (2025)"); user SQL issues to diagnose and fix), and the fine-tuned text-to-SQL models CodeS and XiYan-SQL (§6.1, Tab. 3).
- The equivalence checkers the verifier is compared with in Tab. 2: SPES ([SPES](#/papers/zhou2020spes "SPES: A Symbolic Approach to Proving Query Equivalence Under Bag Semantics (2022)"); [symbolic execution](#/glossary/symbolic-execution)), SQLSolver ([SQLSolver](#/papers/ding2023sqlsolver "Proving Query Equivalence Using Linear Integer Arithmetic (2023)"); formal logic: a proof), FuncEvalGMN (graph matching: a trained model compares the queries' structure; not listed here) and LLM-SQL-Solver ([LLM-SQL-Solver](#/papers/zhao2023llmsqlsolver "LLM-SQL-Solver: Can LLMs Determine SQL Equivalence? (2025)"); prompting an LLM) (§5.3).

## Problem and setting

- **Question:** can one LLM toolkit with a managed knowledge base correct, speed up, modify and check analytical SQL better than base models and single-task tools?
- **Use:** the user picks the tool; it "optionally" consults the knowledge base and returns revised SQL, whose execution outputs feed back into the knowledge base (§3).
- **Correctness:** equivalent queries "produce the same results regardless of database content" (§3); set or bag semantics: not discussed. The verifier is "specifically tailored for SELECT-based DML queries in OLAP scenarios" (§5.3; DML: data manipulation language, statements that read or change data).
- **BIRD** (§6.1, §6.2.1): SQLGovernor post-processes the output of CodeS-7B, CodeS-15B and XiYan-32B on the 1,534-entry dev set.
- **BIRD-CRITIC** (§6.1, §6.2.2): the 200-issue PostgreSQL version `bird-critic-1.0-flash-exp`, with Qwen3-32B and Qwen2.5-72B-Instruct as base LLMs; each issue is routed to the rewriter (efficiency), the corrector (execution errors) or the modifier (other semantic or stylistic changes).
- **Error correction** (§6.3.2): only the wrong queries of CodeS-7B and CodeS-15B on BIRD; syntax failures go to the corrector, semantic misalignment to the modifier.
- **Rewriting** (§6.3.3): Payment-SQL; the authors "typically execute both the pre-optimized and post-optimized SQL queries in the same system while excluding interference factors such as execution caching" (§6.1).
- **Verifier** (§6.3.4): CodeS-7B's BIRD predictions paired with the gold queries; "Correctly predicted" ones are labelled equivalent, the others not.
- Which LLM runs inside the tools for the BIRD and Payment-SQL runs: not discussed.

## Approach

- **Fragment processing** (§5.1, Alg. 1): analyse each subquery and CTE on its own, to "reduce the chance of LLM hallucinations and lower the cost of using the LLM" for long, complex queries (§1).
- **Knowledge storage** (§4.2): past cases are retrieved from a vector database (StarRocks) by similarity of query templates (names replaced by placeholders), then filtered by tag; rewriter rules by exact label match in ElasticSearch, a search engine. Rewriter rules start "primarily sourced from domain experts", corrector rules from FAQs and documentation (§4.3).
- **Query Rewriter** (§5.2): an evaluation stage matches rules against fragments (Fig. 3) and has the LLM turn the matches, or its own ideas in Scenario 2, into JSON suggestions; a rewriting stage has the LLM combine them with retrieved past examples into "a semantically equivalent yet execution-efficient SQL query" (§5.2.2). Listings 2–3 work an example: a `LEFT JOIN` with `IS NOT NULL` becomes an `INNER JOIN`, and two scans of one table are merged.
- **Equivalence Verifier** (§5.3): each query is translated into a structured natural-language account of where each output field comes from, inner subqueries first. Then a pre-filter "eliminates clearly inconsistent query pairs based on schema-level heuristics, such as mismatches in field count or source tables", and an LLM agent aligns the remaining pairs' `SELECT` fields and reasons about equivalence. The prompt "enforces bidirectional field mapping, supports counterexample generation for non-equivalent pairs, and incorporates calibrated confidence scoring" (§5.3): fields matched both ways, an input on which the queries differ, and a confidence score for the verdict.
- **Query Modifier** (§5.4, Fig. 4): requests fall into four categories (change the meaning, explain, adopt a given syntax, other). The tool gathers metadata (referenced tables and columns, the user's most-used tables, a timestamp), classifies the request by a weighted mix of keyword score and embedding similarity to category centroids, rejects it below a confidence threshold, then prompts the LLM.
- **Syntax Error Corrector** (§5.5, Fig. 5): extracts the exception, location and message from the error log with regular expressions, retrieves a stored fix strategy, and falls back to the full schema and a whole-query fix when no confident match is found (§5.5.2).

## Results

- **BIRD** (Tab. 3, §6.2.1): CodeS-7B's execution accuracy rises from 57.17% to 64.02% with SQLGovernor, against 60.17% with SQLFixAgent. Gains are smaller on XiYan-32B, the highest-scoring base model, and larger on moderate and challenging questions than on simple ones (Fig. 6a).
- **BIRD-CRITIC** (Tab. 4, §6.2.2): total SR rises from 26.0% to 36.0% (Qwen3-32B) and from 32.0% to 40.5% (Qwen2.5-72B-Instruct), with gains in all four categories for both models.
- **Intent classification** (§6.3.1): on 150 hand-labelled production requests, the 8B Qwen3 embedding is less accurate than Qwen3-32B classifying directly, at about half its latency.
- **Error correction** (Tab. 5, §6.3.2): of 691 wrong CodeS-7B queries, 25.8% reach a correct result (EX) after correction, and similarly for CodeS-15B.
- **Rewriting** (Tab. 6, §6.3.3): average ETOG 45.92% for SQLGovernor, against 31.25% (GenRewrite), 29.87% (LLM-R²), 14.56% and 11.06% (Qwen2.5-72B and Qwen3-32B, each asked to rewrite in one call); despite 30.73 s of rewriting cost, its net benefit is the largest. Listing 4 shows one rewrite.
- **Verifier** (Tab. 7, §6.3.4): F1 79.3% overall, falling to 57.1% on challenging queries.
- **Productivity** (§6.4.2): in an A/B test with 60 practitioners, half experts, doing 50 tasks each, the integrated toolkit gave faster task completion than separate modules orchestrated by hand, an advantage called "statistically significant", with greater gains for non-experts than for experts.
- **Self-learning** (Fig. 7, §6.4.3): rule counts, ETOG on Payment-SQL and EX on BIRD dev grow as more data is consumed.

## Limits the authors state

- Average end-to-end run time per query rises from 8.5 s to 18.4 s (Qwen3-32B) and from 9.8 s to 21.3 s (Qwen2.5-72B-Instruct), "a non-trivial overhead" they attribute largely to the multi-stage pipeline (§6.2.2).
- Tab. 2 marks the verifier, like LLM-SQL-Solver and FuncEvalGMN, as having no correctness guarantee, with "SELECT-based DML" as its scope (§5.3).
- Verifier scores on challenging queries are lower, "which is expected given the increased complexity of the SQL statements" (§6.3.4).
- The embedding intent classifier trades accuracy for speed against an LLM classifier (§6.3.1).
- Rule-based rewriters that transform execution plans are excluded from the comparison as "orthogonal to our design" (§6.3.3).

## Open problems and building blocks

- **Open:** None stated.
- **Released:** the Payment-SQL dataset, stated as "available" at an anonymous link (§6.1). Nothing else stated.
- **To reuse it:** an LLM for every tool; the Qwen3 embedding model (8B parameters, 1,024 dimensions, §6.3.1); RoBERTa-base and DBSCAN for rule merging (§4.3); StarRocks and ElasticSearch (§4.2); DBMS execution logs; experts to verify new rules (§4.3); `SELECT`-based DML for the verifier (§5.3).

## On this site

- **Discussed in:** [Self-improvement that compounds](#/challenges/compounding_self_improvement) · [Discovering new rewrite rules](#/challenges/rewrite_rule_discovery)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/harness-sql">harness-sql</a><a class="tag sub" href="#/tags/judge-sql">judge-sql</a><a class="tag sub" href="#/tags/llm-gen">llm-gen</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/nl2sql-eval">nl2sql-eval</a><a class="tag sub" href="#/tags/rewrite-llm">rewrite-llm</a><a class="tag sub" href="#/tags/rules-discover">rules-discover</a></span>
