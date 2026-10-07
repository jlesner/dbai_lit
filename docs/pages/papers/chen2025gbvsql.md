# GBV-SQL: Guided Generation and SQL2Text Back-Translation Validation for Multi-Agent Text2SQL

**GBV-SQL** · preprint 2025 (the litsearch listed ACL 2025)

Read: [PDF](https://arxiv.org/pdf/2509.12612) · [arXiv](https://arxiv.org/abs/2509.12612)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Multi-agent text-to-SQL that translates the generated SQL back into text and checks it against the question.
- Also a typology of "gold errors" in benchmarks.
- A back-translation check, a half-step towards the SQL ↔ text loop, but judged by an LLM.

## In plain words

Text-to-SQL turns a question into a database query. The authors say a query can run and still misread the question, and current methods "often lack a dedicated mechanism" to check this (§1). GBV-SQL chains four LLM agents: a planner, a query writer, a validator that explains the query in words and fixes it on a mismatch with the question, and a checker that runs and repairs it (§1). On the BIRD text-to-SQL benchmark's development set, with the Deepseek-v3 model, it reports 63.23% correct, 5.8 points above an earlier multi-agent pipeline using it (§4). The authors also hand-audit the Spider benchmark, classify its flaws, and report 96.5% on its development set "After removing flawed examples" (abstract). Both are called "novel" (§1).

## Background and terms

**Terms to know:** [text-to-SQL](#/glossary/text-to-sql) · [execution accuracy](#/glossary/execution-accuracy) · [gold query](#/glossary/gold-query) · [schema linking](#/glossary/schema-linking) · [Cohen's kappa](#/glossary/cohens-kappa)

**The paper's own terms:**
- **SQL2Text back-translation**: an LLM explains a generated query in words, and the explanation is compared with the natural-language question (NLQ) (§3.4).
- **Gold Errors**: "flaws inherent in the ground-truth data itself" (§1).
- **Dirty data**: erroneous or inconsistent database values (C1, Fig. 5), which §4.3 calls "data contamination" (not training-data leakage).

**Builds on:**
- MAC-SQL, a multi-agent text-to-SQL framework: the base of the schema description, the inspiration for the architecture, and the same-model baseline (§3.2 "Schema Representation", §4.1 "Implementation Details", Tab. 1–2).
- MAG-SQL, another multi-agent framework: its Targets-Conditions decomposition, which splits the NLQ by "its distinct conditional clauses and query targets" (§3.2 "NLQ Decomposition").
- RSL-SQL, a schema-linking method: it inspired the binary selector (§3.4).
- Label-quality work: [Fundamental Challenges in Evaluating…](#/papers/renggli2025text2sql "Fundamental Challenges in Evaluating Text2SQL Solutions and Detecting Their Limitations (2025)") (label accuracy), [SQLDriller](#/papers/yang2025sqldriller "Automated Validating and Fixing of Text-to-SQL Translation with Execution Consistency (2025)") (detecting wrong question–SQL pairs) (§2 "Benchmark Quality and Gold Errors").

## Problem and setting

- **Question:** can translating a generated query back into text catch queries that run but miss the question's intent, and how much measured failure comes from flawed benchmarks (§1)?
- **Setting:** prompted LLMs; Deepseek-v3 by API is the main model, GPT-4o "for supplementary validation", both at temperature 0 (§4.1 "Implementation Details").
- **Benchmarks:** Spider (cross-domain, many databases) and BIRD (harder, with "noisy data and external knowledge") (§4.1 "Datasets").
- **Correct** means execution accuracy: execution results that "exactly match" the gold query's (§4.1 "Evaluation Metrics").

## Approach

Four agents (Fig. 2):
- **Planner (§3.2):** a schema description adding column types, clearer foreign-key descriptions and primary-key descriptions, which the authors say they are "the first to include" (Fig. 3); LLM schema pruning; decomposition of the NLQ into sub-questions.
- **SQLGenerator (§3.3):** a "Human-like CoT" prompt (Fig. 4) that reasons from intent to tables, columns and clauses. It writes one sub-query per sub-question; an LLM "back-linking" step extracts the table-column pairs each used, and their union, with the sub-queries, is the context for the full query.
- **SQL2TextValidator (§3.4):** the LLM explains the query, compares that with the NLQ, and rewrites the query on a mismatch; an LLM "binary selector" then picks the original or rewritten query, "taking their execution results into account".
- **SQLChecker (§3.5, Alg. 1):** trims formatting, runs the query, and repairs it when it fails or the result is empty, 0 or contains NULL, with retrieved database values, until it executes successfully or exceeds 3 iterations (§4.1 "Implementation Details").

**Gold Error typology (§4.3 "A New Typology of Gold Errors", Fig. 5):** Type A, a gold SQL that is wrong, suboptimal or not executable, "assuming the NLQ is valid"; Type B, a question that is ambiguous, underspecified, logically flawed or unanswerable with the given database; Type C, database errors (flawed schema, dirty data); each with subcategories. Two of three "SQL-proficient graduate students" label each item independently (agreement reported as Cohen's kappa); the third adjudicates disagreements (§4.3 "Gold Error Identification").

## Results

- **BIRD dev (Tab. 1, §4.2 "BIRD Result"):** 63.23% execution accuracy against MAC-SQL + Deepseek-v3's 57.43%; the authors say it "even surpasses numerous methods that use GPT-4".
- **Spider (Tab. 2, §4.2 "Spider Result"):** 79.6% dev and 82.8% test against MAC-SQL + Deepseek-v3's 80.1% and 77.6%.
- **Gold Errors in Spider dev (§4.3 "Analysis of Gold Errors in Spider", Fig. 6):** 183 instances among failed items and 62 among passed ones. The authors report "the overwhelming majority of failures are not caused by our model" (§4.3).
- **"No Gold Errors" row (Tab. 2):** 96.5% dev and 97.6% test, on what the caption calls "a cleaned subset of the benchmark, from which entries with quality issues have been removed".
- **BIRD:** "a preliminary analysis on a 10% stratified sample of the BIRD dev set indicates over 30% of its items contain similar Gold Errors" (§4.3 "Analysis…").
- **Ablation (Tab. 3, §4.4):** removing or replacing any one component lowers total BIRD execution accuracy; removing the SQLChecker causes "the most significant performance drop".

## Limits the authors state

- Spider 2.0, "an important industry-oriented evolution" of Spider, is not evaluated (future work): its "complexity in long-context understanding and multi-tool usage currently hinders a clear evaluation of our semantic validation mechanism" (§4.1 "Datasets").
- The Spider dev result is "unexpectedly lower than anticipated" (§4.2 "Spider Result"); details of the test-set analysis are left to "the supplementary material due to space limitations" (§4.3 "Analysis…").

## Open problems and building blocks

- **Open:** "automated dataset validation and the extension of this validation mechanism to other complex reasoning tasks" (§5); benchmarks maintained as "dynamic entities that require continuous validation, correction, and versioning" (§4.5).
- **Released:** Nothing stated.
- **To reuse it:** an LLM (Deepseek-v3 or GPT-4o), a database to run queries on, and the stated scope: "capable of handling moderately complex queries, covering scenarios that involve both single and multiple tables" (§4.1 "Implementation Details").

## On this site

- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/harness-sql">harness-sql</a><a class="tag sub" href="#/tags/judge-sql">judge-sql</a><a class="tag sub" href="#/tags/llm-gen">llm-gen</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/nl2sql-data">nl2sql-data</a><a class="tag sub" href="#/tags/nl2sql-select">nl2sql-select</a></span>
