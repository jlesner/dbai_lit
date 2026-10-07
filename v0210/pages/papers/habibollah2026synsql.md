# SynSQL: Synthesizing Relational Databases for Robust Evaluation of Text-to-SQL Systems

**SynSQL** · preprint · 2026

Read: [PDF](https://arxiv.org/pdf/2604.27261) · [arXiv](https://arxiv.org/abs/2604.27261)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- LLM-synthesized test databases conditioned on the NL question and schema, not the gold SQL.
- Schema selection, question-guided data synthesis, constraint-aware critique and refinement.
- LLM-generated test databases, one per question and blind to the predicted query (§3, §4.1); not OmniSQL's SynSQL-2.5M dataset.

## In plain words

[Text-to-SQL](#/glossary/text-to-sql) systems are usually scored by running the system's query and a human-written reference query on one fixed benchmark database and checking that the results match. The authors argue this is fragile: the same queries may behave differently on other data (abstract, §1). They ask whether an LLM can write a meaningful, schema-consistent test database from only the question and the database's table definitions, without the reference query, and build SynSQL to do it: an LLM picks the relevant tables and columns, writes rows for them, and an LLM critic scores the rows and asks for rewrites (§3). Counting a system's answer as right only when it matches on both the original and the generated database, they report accuracy drops of 3–14% across ten text-to-SQL systems on three public benchmarks (Spider, BIRD, Spider 2.0), compared with the usual single-database score, and read them as errors the fixed database hides (abstract). They present generating databases from questions as "a new task", unlike earlier test-database generators that need the reference query (§1).

## Background and terms

**Terms to know:** [gold query](#/glossary/gold-query) · [execution accuracy](#/glossary/execution-accuracy) · [counterexample database](#/glossary/counterexample-database) · [integrity constraint](#/glossary/integrity-constraint) · [SAT and SMT solvers](#/glossary/sat-and-smt-solvers) · [bounded verification](#/glossary/bounded-verification)

**The paper's own terms:**
- **reduced schema**: the subset of the schema (the table definitions) that SynSQL keeps for one question (§3.1).
- **question-conditioned database synthesis**: from a natural-language question and a schema, generate a database that (i) satisfies the schema's structural constraints, e.g. primary and foreign keys, and (ii) holds values, implied by the question, that let correct and incorrect readings of the question be told apart (§3).
- **EX**: execution accuracy on a single database (§4.1); the paper also measures it on each method's generated database (Tab. 5).
- **EXc** (compound execution accuracy): a prediction counts as correct only if it matches the gold query's result on both the original database and the SynSQL-generated one, so EXc is at most EX on either (§4.1). **ΔEXc** is the drop from the official EX to EXc, the cells of Tabs. 1–3.
- **SR** (success rate): the share of questions for which the gold query returns a non-empty result on the generated database (§4.1).
- **vanilla synthesizer**: the baseline, one LLM pass over the full schema with the same prompting, without schema selection, data validation or critic (§4.1).
- **relational validity**: the share of generated databases that respect key constraints and table structure, run, and hold valid data (§4.3, Fig. 4).
- **evidence / hints**: extra text given with a BIRD question, absent in Spider (Fig. 2 caption).

**Missing glossary terms:** none.

**Builds on:**
- Test-database generators that work from the gold query, mutating it or analysing it symbolically: AGENDA, XData ([XData](#/papers/chandra2014xdata "Data generation for testing and grading SQL queries (2015)")) and TestSuiteAccuracy ([Semantic Evaluation for Text-to-SQL…](#/papers/zhong2020testsuite "Semantic Evaluation for Text-to-SQL with Distilled Test Suites (2020)")) (§1, §2).
- SMT-based tools VeriEQL ([VeriEQL](#/papers/he2024verieql "VeriEQL: Bounded Equivalence Verification for Complex SQL Queries with Integrity Constraints (2024)")) and SpotIt ([SpotIt](#/papers/klopfenstein2025spotit "SpotIt: Evaluating Text-to-SQL Evaluation with Formal Verification (2026)")), which the authors describe as synthesizing databases "that distinguish predicted queries from reference queries" (§1); of these methods the authors say they "rely on access to gold SQL and are limited by bounded verification and query complexity" (§1).
- Mitsopoulou & Koutrika 2025 and Renggli et al. 2025 ([Fundamental Challenges in Evaluating…](#/papers/renggli2025text2sql "Fundamental Challenges in Evaluating Text2SQL Solutions and Detecting Their Limitations (2025)")), for outcomes depending on the database instance (§1).
- Self-correction for LLMs (Pan et al. 2023), which inspired the critic (§3.3).

## Problem and setting

- **Question:** "Can large language models synthesize semantically meaningful, schema-consistent relational data directly from a natural language question?" (abstract); and do such databases reveal failures a fixed database hides (§4).
- **Inputs:** the question, the schema and any hint (BIRD's evidence), which the selector, synthesizer and critic prompts all take; no gold or predicted query (§3.2, App. A.1, Figs. 20–23).
- **Benchmarks** (§4.1): Spider, which "features simple schemas"; BIRD, which "includes complex queries with joins and nested subqueries" (both dev sets, Tab. 5); and Spider 2.0-SQLite, "135 enterprise-level problems" with complex schemas and multi-step queries.
- **Generator LLMs:** GPT-4.1-mini, Gemini-2.5-Flash, Gemini-3-Flash (Spider 2.0 only), Qwen-3-8B (not Spider 2.0) (§4.1, Tabs. 1–3).
- **Systems scored:** "ten competitive text-to-SQL systems", several named with the LLM they use (§4.1): OmniSQL, RSL-SQL, Alpha-SQL, CSC-SQL and Gemini-SQL on BIRD; Graphix, C3, DIN-SQL and DAIL-SQL on Spider; OmniSQL and GPT 5.4 on Spider 2.0 (Tabs. 1–3).
- **Correct** means matching the gold query's result on the original database and on one generated database per question (EXc, §4.1).
- The synthesizer prompt asks for "SQLite test data" (Fig. 22). How two results are compared (row order, duplicates): not discussed. NULLs: named as a benchmark error source (§1) and used to pad short rows (§3.2).

## Approach

SynSQL has three LLM stages (§3, Fig. 1).

- **Schema selector** (§3.1, Algorithm 1 in App. A.1). An LLM picks the tables and columns the question needs. To favour recall it is queried at temperatures 0, 0.3 and 0.7, the union of its answers forms a core, and a further call adds "semantically or functionally related columns" (expansion).
- **Synthesizer** (§3.2). An LLM writes rows table by table from the question and the reduced schema, keeping keys and related values consistent across tables. Values should be grounded in the question, "including values that can expose potential errors in query interpretation". Postprocessing "ensures the database can be loaded and executed, but cannot resolve referential integrity violations or semantic misalignment" (§3.2).
- **Critic** (§3.3). An LLM scores each database from 1 to 10 on six dimensions: alignment with question hints, key and referential integrity, schema coverage, data complexity, variety in records and overall relevance. If the average meets a threshold (8.0 in the experiments) the database is accepted; otherwise its feedback goes into another generation round, at most three (§3.3, §4.1). Scoring complexity and variety is meant to counter "overly simplistic or repetitive data patterns" (App. A.7).

No theorems.

## Results

- **EXc drops** (§4.2, Tabs. 1–3). Requiring a match on both databases lowers accuracy for every system and dataset; the abstract reports drops of 3–14% against the official single-database EX. The authors read the gap as "revealing errors that are not exposed under standard single-instance evaluation" (§4.2).
- **Rankings** (§4.2). They report rankings "remain largely stable on BIRD and Spider 2.0", with changed gaps between systems; on Spider, Graphix ranks above C3 under SynSQL, reversing the official order.
- **Success rate** (§4.3, Tab. 5(a)). On BIRD, SynSQL with GPT-4.1-Mini reaches SR 82.07%, against 69.43% for the better vanilla baseline and 99.87% on the original databases. The authors report SynSQL "consistently outperforming vanilla baselines across all datasets and LLM families" (§4.3). On Spider, SynSQL with Gemini-2.5-Flash or GPT-4.1-Mini exceeds the original databases' SR, which they attribute to inconsistencies in the benchmark data (§4.3, App. A.9).
- **EX on generated databases** (§4.3, Tab. 5). They report EX "close to" that on the original databases, "while remaining consistently lower than vanilla baselines", and read lower EX as "a more discriminative evaluation setting".
- **Validity** (§4.3, Fig. 4). They report "near-perfect validity (99% across all datasets)", with gains over the vanilla baseline "most pronounced" on BIRD and Spider 2.0.
- **By schema complexity** (App. A.4, Fig. 5, BIRD, against vanilla GPT-4.1-mini). With complexity counted as the columns a gold query touches, SynSQL's SR lead "widens as schema complexity increases", while its compound execution accuracy stays lower than vanilla's in every bucket.
- **Failures** (§4.4, Fig. 2(a), App. A.5). On a random sample of 500 BIRD dev questions, the gold query returned nothing on 84 generated databases: 40 because schema selection dropped a needed table or column, 44 semantic failures (e.g. case or value granularity mismatches), of which they attribute 27 to SynSQL and 17 to ambiguous or inconsistent BIRD question–query pairs.
- **Critic ablation** (§4.5, Fig. 3, BIRD). The critic raises SR for all three generator LLMs, most for Qwen-3-8B (67.86% → 73.60%). With the critic, EXc for OmniSQL is lower for all three LLMs, which the authors read as better separation of correct from incorrect queries (App. A.7, Fig. 10). With Gemini-2.5-Flash, the critic's per-criterion scores improve on all dimensions on both Spider and BIRD (Fig. 2(b)).
- **Schema-selection ablation** (§4.5, Tab. 4, GPT-4.1-Mini as generator and critic). On BIRD, SynSQL reaches SR 82.07%, against 71.25% without schema selection and 91.46% with the oracle schema (perfect recall, "an upper bound"), while keeping far fewer columns; the authors say compact databases are "easier to inspect and validate" (§4.5).

## Limits the authors state

- "The schema selection process may omit relevant tables or columns, leading to gold queries returning empty results"; without database contents and value-based retrieval, high-recall schema selection is "inherently difficult" (App. A.6).
- "SynSQL relies on the assumptions made by the large language models used. If the LLMs misinterpret the question intent or generate inconsistent data, this can lead to lower success rates." (App. A.6)
- "aggressive reduction risks omitting columns required by gold queries, causing otherwise correct queries to fail" (§4.5).
- "precise semantic control and constraint adherence under complex schemas remain challenging" (§4.4).
- SR is "a necessary but weak proxy for semantic grounding" (§4.1).

## Open problems and building blocks

  - Two key challenges: high-recall schema selection "without access to gold queries", and consistent semantic grounding of values (case, format, granularity); "Improving controllability and constraint-aware generation is an important direction for future work" (§4.4).
  - Test-time evaluation without annotations, where "model-generated queries can be validated against synthesized databases to ensure semantic support" (§5).
  - Stronger evaluation criteria, "e.g., consistency across diverse synthesized databases or adversarial data generation"; multi-database scenarios and interactive workflows (§5).
  - Multi-hop schema traversal guided by LLMs, ensembles across several LLMs, and "additional constraints or validation steps during data generation" (App. A.6).
  - Human-in-the-loop evaluation and "generating expected outputs via table reasoning" (§4.5, App. A.8).
- **Released:** Nothing stated.
- **To reuse it:** a question, its schema and any hint; an LLM (four used, §4.1); the prompts of Figs. 20–23, which target SQLite; four schema-selection calls and up to three critic rounds (App. A.1, §4.1). Run time and cost are not stated.
- **Beyond its domain:** the authors position relational data synthesis as "a useful testbed for studying structured reasoning in LLMs" (§5) and "a new lens for studying LLM reasoning, controllability, and robustness in structured environments" (abstract).

## On this site

- **Discussed in:** [Text-to-SQL can't be verified against intent](#/challenges/text_to_sql_verification)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/cex-llm">cex-llm</a><a class="tag sub" href="#/tags/llm-assist">llm-assist</a><a class="tag sub" href="#/tags/nl2sql-eval">nl2sql-eval</a></span>
