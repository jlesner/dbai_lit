# PolySQL: Scaling Text-to-SQL Evaluation Across SQL Dialects via Automated Backend Isomorphism

**PolySQL** · preprint 2026

Read: [PDF](https://arxiv.org/pdf/2605.07796) · [arXiv](https://arxiv.org/abs/2605.07796)  
Code: [polysql](https://github.com/IBM/polysql)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Evaluates text-to-SQL across SQL dialects by running each side on its own engine and comparing normalized results.
- No transpilation; reports that cross-dialect errors are mostly logical, not syntactic (abstract, §1), by a rubric that counts failing queries as logic errors (App. A).
- Result normalization across engines, the comparison dialect translation faces. It checks LLM and SQLGlot transpilations of gold queries (§4, Tab. 3) and migrates databases between engines (§2.2), so it is tagged <a class="tag" href="#/tags/dialect">dialect</a>.

## In plain words

Text-to-SQL systems turn a question into a database query, but each engine speaks its own SQL. The authors note that text-to-SQL benchmarks are "predominantly SQLite based" and argue that SQLite scores are "an unreliable proxy for other dialects"; porting a benchmark has needed costly hand-rewriting of the reference queries, or translation tools that "often fail on complex SQL" (abstract). They build PolySQL: copy each benchmark's databases into five other engines, run the model's query on the copy and the reference query on SQLite, and compare the two results after smoothing over formatting differences such as date formats and number precision (§1, §2). Checked against one benchmark's hand-translated reference queries, they report higher agreement than translating queries with a rule-based tool or an LLM, while scoring every query (§4). Testing 16 LLMs, they report "a 10.1% average accuracy drop from SQLite to other dialects" (abstract) and that this drop stems from logical rather than syntactic errors, "61% vs. 8%" (abstract). They present PolySQL as "a novel dual-execution method" (abstract) and their study as "the largest multi-dialect study to date" (§1).

## Background and terms

**Terms to know:** [text-to-SQL](#/glossary/text-to-sql) · [SQL dialect](#/glossary/sql-dialect) · [gold query](#/glossary/gold-query) · [execution accuracy](#/glossary/execution-accuracy) · [Cohen's kappa](#/glossary/cohens-kappa) · [LLM-as-a-judge](#/glossary/llm-as-a-judge) · [McNemar's test](#/glossary/mcnemars-exact-test) (the paper doesn't say "exact") · [bag semantics](#/glossary/bag-semantics) · [Spearman's ρ](#/glossary/spearmans-rank-correlation) · [Pearson's r](#/glossary/pearson-correlation)

**The paper's own terms:**
- **Source and target dialect**: the source is the engine the benchmark was written for (SQLite in all experiments); the targets are the "five enterprise dialects" PostgreSQL, MySQL, Snowflake, BigQuery and ClickHouse (§1, §3), i.e. two open-source database servers, two cloud data warehouses and a column-oriented analytics database.
- **Migration** (the paper's "Automated Environment Isomorphism"): copying a database's schema and rows into a target engine, with column types mapped to target types (§2.2).
- **Dual-Execution Protocol**: the gold query runs on the source database and the model's query on the migrated target database; the two results are compared (§2.1, Fig. 1c).
- **Output Representation Divergence**: different engines return the same data in different formats, e.g. dates as strings in SQLite and as timestamp objects in PostgreSQL (§2.3).
- **Normalized Comparator**: the result comparison that bridges those formats (§2.3, App. B).
- **Execution accuracy** (here): the share of predictions the Normalized Comparator judges correct, with the gold query on SQLite and the prediction on the target engine (§3 "Evaluation").
- **Gap Errors**: queries a model gets right on SQLite but wrong on the target dialect (§5.3).
- **Logic Degradation**: Tab. 4's Filtering/Logic category, described in §5.3 as "syntactically valid queries with incorrect semantic reasoning".
- **Dialect Robustness Score**: one minus the relative drop from a model's SQLite accuracy to its mean accuracy over the five targets, i.e. the fraction of SQLite performance retained (App. C, Eq. 1).

**Missing glossary terms:**
- **Query transpilation**: rewriting a query from one SQL dialect into another, by rules or by an LLM (§1, §2.1).

**Builds on:**
- BIRD ([BIRD](#/papers/li2023bird "Can LLM Already Serve as A Database Interface? A BIg Bench for Large-Scale Database Grounded Text-to-SQLs (2023)"), "DB efficiency and complexity"): one of the three benchmarks, and its "manually-transpiled queries" are the reference for validating PolySQL (§1, §4, §6.1).
- Spider ([Spider](#/papers/yu2018spider "Spider: A Large-Scale Human-Labeled Dataset for Complex and Cross-Domain Semantic Parsing and Text-to-SQL Task (2018)"), "cross-domain generalization") and Archer ("arithmetic reasoning"), the other two benchmarks (§3).
- The baselines it compares against first: SQLGlot, a rule-based SQL transpiler, and LLM-based transpilation and judging with GPT-oss-120b (§4, Tab. 3).
- dlt (Data Load Tool), "an industrial-grade ELT framework" (a data-loading tool) with connectors for major SQL engines, used for migration (§2.2).

## Problem and setting

- **Question:** can a benchmark written for one dialect be extended to other dialects without translating its gold queries (§2.1 "Problem Formulation")? Then three research questions: can SQLite stand in for other dialects, how do model rankings change across dialects, and why do models fail on the target dialects (§5)?
- **Motivation:** hand-translated benchmarks "do not scale beyond a handful of dialects"; benchmarks that aggregate datasets from different engines, such as Spider 2.0, "conflate dialect differences with changes in question content" (§1).
- **Benchmarks:** 100 randomly sampled questions from each of Spider, BIRD and Archer, migrated from SQLite to the five targets, giving 15 "multi-dialect evaluation environments" (§3 "Benchmarks").
- **Models:** 16 models from GPT-OSS 120B and Claude 3.5 Sonnet down to 8B open models, all with greedy decoding (temperature 0) (§3 "Models").
- **Prompting:** zero-shot with instructions: for each target dialect, five syntax guidelines generated by Gemini-2.5-Pro, "manually validated for correctness" and fixed across models, are put in the system prompt with the migrated schema (§3 "Prompting Strategy").
- **What "correct" means:** a binary signal from the Normalized Comparator (§3 "Evaluation"). Results of queries without `ORDER BY` are compared as multisets ([bag semantics](#/glossary/bag-semantics)); with `ORDER BY`, in order ([list semantics](#/glossary/list-semantics)) (App. B).
- **NULLs:** two NULLs in the same cell count as equal, and sorting puts NULLs last (App. B, Alg. 1).
- **Constraints:** foreign-key constraints are "selectively" relaxed during migration, because benchmark data frequently violates them (§2.2).

## Approach

- **Why not translate queries:** the authors argue that, because dialects diverge in meaning, a translation of the gold query is "inherently lossy", so a failed translation gives "a corrupted ground truth" (§2.1). Their "key insight": "bridging dialect differences is fundamentally easier at the result level than the query level" (§1).
- **Migration (§2.2):** the authors' dlt-based pipeline runs three phases: read the source schema, map types (e.g. "SQLite's TEXT dates to PostgreSQL's TIMESTAMP"), and bulk-load the rows; loading is "strictly typed yet constraint-permissive".
  - empty results on both sides pass; different row counts fail; a query that fails to execute fails;
  - without `ORDER BY` in the gold query, both results are sorted on all columns before comparison; with it, row order must match;
  - column names are lowercased, and when the prediction returns extra columns they are dropped to match the gold result;
  - numbers match within a tolerance of 10⁻⁵ (`numpy.allclose`), strings after stripping whitespace, and numbers of different machine types (e.g. `int64` and `uint32`) if their values are within the tolerance.
- **Fidelity check (§4):** for all 16 models on BIRD, the pass/fail verdicts of PolySQL and of four alternatives are compared with those from BIRD's hand-translated target queries. The alternatives: SQLGlot translating predictions back or gold queries forward, an LLM judge without execution, and an LLM translating gold queries. Agreement is measured per query (Cohen's κ), on model rankings (Spearman's ρ) and on model accuracies (Pearson's r).
- **Error analysis (§5.3, App. A):** GPT-OSS-120B, given a rubric, classifies each gap error into the categories of Tab. 4; the authors validated it by labelling 100 random gap errors by hand.

## Results

- **Fidelity (§4, Tab. 3)**: the authors report κ = 0.72 for PolySQL against 0.38–0.66 for the two LLM-based methods, and 100% coverage against at most 46% for the SQLGlot methods; PolySQL also has the highest rank and accuracy correlations. They note the SQLGlot scores reflect "a reduced and easier subset" ("survivorship bias", §4 "The Failure of Static Transpilation").
- **SQLite as a proxy (§5.1, Tab. 2):** averaged over the five targets, per-query agreement between SQLite and target outcomes is κ = 0.39, which the authors call "weak per-query agreement"; they report rank correlation "significantly lower than the linear correlation", implying that optimizing for a SQLite leaderboard "does not guarantee SOTA performance on target dialects" (SOTA: state of the art).
- **Accuracy across dialects (§5.2, Tab. 5)**: the authors report "a systematic 10.1% accuracy drop" on enterprise dialects compared with SQLite, significant by a paired t-test (§5.2 "Dialect Distribution Shift"). They report Claude 3.5 Sonnet leading on every dialect, while Llama 3.1 405B moves from near the top on SQLite to the middle on Snowflake (§5.2 "Rank Volatility", Fig. 3).
- **Dialect hierarchy (§5.2, Fig. 2):** the authors report Snowflake and BigQuery as the hardest, PostgreSQL and MySQL an easier tier, and pairwise McNemar's tests show SQLite differing significantly from every target (Fig. 2 caption).
- **Why models fail (§5.3, Tab. 4)**: the authors report Logic Degradation as "the dominant failure mode (61.2%)" against 7.7% for Dialect Syntax errors. They class some gap errors as Evaluation Framework issues, "primarily ambiguous gold query semantics rather than framework bugs", and report that Logic Degradation stays dominant after excluding them.

## Limits the authors state

- **Source bias (§8 "Source-Bias and Feature Intersection"):** the questions come from SQLite benchmarks, so they don't test features exclusive to enterprise dialects (e.g. Snowflake's `VARIANT`, BigQuery's array structs); the study measures "dialect portability" rather than "native dialect mastery".
- **Knowledge vs. instruction following (§8):** the design "cannot fully disentangle" whether failures come from not knowing the dialect or ignoring the prompt's dialect rules; smaller models "with weaker instruction-following capabilities may be disproportionately penalized".
- **Normalization boundaries (§8):** certain floating-point and collation (sort-order) edge cases differ between engines; "extremely subtle divergences in how different engines handle NULL ordering or mixed-type comparisons may still yield false negatives, though our manual audit suggests this affects" <1% of queries.
- **Migration overhead (§8):** PolySQL "requires active DB infrastructure"; running 16 models across 15 environments needed "significant compute resources", and the computational cost is "non-trivial compared to text-matching metrics".

## Open problems and building blocks

- **Open:** the authors write that their finding "suggests future work should prioritize semantic robustness over pattern matching", and that future work can study "multi-dialect training strategies, dialect-aware prompting techniques, and architectural modifications that preserve reasoning coherence under syntactic variation" (§7).
- **Released:** "framework code, experiments, and leaderboard" (abstract); PolySQL "with extensible support for new dialects and benchmarks", the 15 environments and a live leaderboard (§1, contribution 3), with a footnote that code, results and environments "would be available upon acceptance" (§1).
- **To reuse it:** dlt for migration (§2.2); running instances of each target engine (§8); the authors say their codebase also supports MySQL, PostgreSQL and Snowflake as source databases (§3, §7); prompts are "provided in the code" (§3).

## On this site

- **Discussed in:** [Telling bad translations from legitimate engine differences](#/challenges/bad_translation_detection) · [SQL dialect translation](#/challenges/dialect_translation) · [Equivalence of nondeterministic queries](#/challenges/nondeterministic_equivalence)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/dialect-translate">dialect-translate</a><a class="tag sub" href="#/tags/llm-gen">llm-gen</a><a class="tag sub" href="#/tags/nl2sql-eval">nl2sql-eval</a></span>
