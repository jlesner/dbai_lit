# Taming SQL Complexity: LLM-Based Equivalence Evaluation for Text-to-SQL

**Taming SQL Complexity** · preprint Jun 2025

Read: [PDF](https://arxiv.org/pdf/2506.09359) · [arXiv](https://arxiv.org/abs/2506.09359)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- An LLM judges semantic and "weak" semantic equivalence for text-to-SQL.
- Catalogues common equivalence and inequivalence patterns; several of its "equivalent" examples differ when names repeat or on NULLs.
- LLM-judge baseline and a pattern taxonomy.

## In plain words

Grading a text-to-SQL system needs a way to tell whether its query means the same as a reference query. The authors argue that running both on one test database misjudges queries, "particularly with sparse test data or when minor syntactic variations are acceptable" (§1). They study whether an LLM can judge strict equivalence and a looser "weak" equivalence (abstract). They list common patterns of equivalent and inequivalent query pairs, and build a pipeline: clean-up, string matching for easy cases, then an LLM asked several times, with more runs and a majority vote possible when its answers differ. They test it on three sets they built, one hand-labelled from a Microsoft business platform (§1). On synthetic pairs, rewriting subqueries into joins together with a prompt that has the model imagine small databases and run both queries on them raised the rate at which equivalent pairs were identified from 61.25% to 95%, while the rate for inequivalent pairs fell from 90% to 83.75% (Tab. 4). They present "a comprehensive LLM-based framework", not a first (§1).

## Background and terms

**Terms to know:** [text-to-SQL](#/glossary/text-to-sql) · [gold query](#/glossary/gold-query) · [query equivalence](#/glossary/query-equivalence) · [execution accuracy](#/glossary/execution-accuracy) · [exact match](#/glossary/exact-match) · [LLM-as-a-judge](#/glossary/llm-as-a-judge) · [F1 score](#/glossary/f1-score)

**The paper's own terms:**
- **Semantically equivalent**: two queries that "produce the same result when executed on an arbitrary but fixed database of that schema" (Def. 3.4, §3.1). The authors call it "often being undecidable in the general case" (§3.1), meaning no algorithm can decide it for every pair.
- **Weakly equivalent** (also "relaxed" or "practical" equivalence): two queries that "will most likely produce the same results given the database in practical use", or that "minor, trivial edits (like changing an alias or the order of independent conditions) would make" semantically equivalent "according to user intent" (Def. 3.5, §3.1).
- **Syntactically equivalent**: identical parse trees, "perhaps allowing for trivial differences like whitespace or canonicalized aliasing" (Def. 3.3, §3.1). Defs. 3.1–3.2 define a parsable and an executable query.
- **EM and ESM**: Exact Match and Exact Set Match, the string-based checks the pipeline runs first, "slight adapted to the database that we use" (§7); ESM "performs string-based component-wise matching" (§3.1).
- **Dataverse**: "a data platform integral to Dynamics 365 applications", Microsoft's business software (§6.1).
- **Miniature & Mull**: a prompt from LLM-SQL-Solver in which the LLM is told "to simulate executing both SQL queries on a self-conceptualized simple database, then repeat this on a modified version of that database, comparing outputs to infer equivalence" (§8.2.3; templates App. D.3–D.4).
- **Unstable**: the verdict when the LLM's repeated runs disagree (§7; Algorithm 1, App. E).
- **Passing rate**: Table 4's score, given separately for equivalent and inequivalent pairs (Tab. 4); the conclusion reads its rise on equivalent pairs as improved "identification of equivalent query pairs" (§9).

**Missing glossary terms:** none.

**Builds on:**
- LLM-SQL-Solver ([LLM-SQL-Solver](#/papers/zhao2023llmsqlsolver "LLM-SQL-Solver: Can LLMs Determine SQL Equivalence? (2025)")): an earlier study of LLMs judging SQL equivalence, with "relaxed equivalence" and the Miniature & Mull and Explain and Compare prompts (§2); this paper adopts Miniature & Mull (§8.2.3).
- Cosette ([Cosette](#/papers/chu2017cosette "Cosette: An Automated Prover for SQL (2017)"), [UDP](#/papers/chu2018udp "Axiomatic foundations and algorithms for deciding semantic equivalences of SQL queries (2018)")) and SQLSolver ([SQLSolver](#/papers/ding2023sqlsolver "Proving Query Equivalence Using Linear Integer Arithmetic (2023)")), automated provers of SQL equivalence (§2); the authors say such logic-based approaches "cannot capture fully the semantic meaning" carried by table and column names (§2).
- Critiques and refinements of text-to-SQL scores: Enhanced Tree Matching (ETM, Ascoli et al., a syntax-tree comparison with equivalence rules) and FLEX (Kim et al., a score that aims to match human judgment and "reduces both false negatives and false positives in using Execution Accuracy") (§2, §3.3).
- The benchmarks Spider ([Spider](#/papers/yu2018spider "Spider: A Large-Scale Human-Labeled Dataset for Complex and Cross-Domain Semantic Parsing and Text-to-SQL Task (2018)")) and BIRD ([BIRD](#/papers/li2023bird "Can LLM Already Serve as A Database Interface? A BIg Bench for Large-Scale Database Grounded Text-to-SQLs (2023)")), text-to-SQL benchmarks, as the setting where execution accuracy is "often favored for its objectivity" (§1, §3.3).

## Problem and setting

- **Question:** can an LLM, inside a pipeline with cheaper checks, judge whether a generated SQL query is equivalent to a reference query, under strict or weak equivalence (abstract, §1)?
- **Why execution accuracy falls short, in the authors' view:** a wrong query can match on sparse test data (false positive), and a right query can fail on column order or aliases (false negative) (§3.2; App. A). In business use a false negative "can be more detrimental" (§5).
- **Data** (§6):
  - Dataverse: 77 ground-truth questions with SQL; a GPT-based pipeline generated an alternative query for each, and each pair was labelled by hand "for logical equivalence": 56 positive, 21 negative (§6.1, Tab. 1).
  - Development set: 14 pairs "selected from challenging failure cases and instances of unstable LLM judgments" (§6.2), one per failure category (§8.2.2).
  - Synthetic: 80 equivalent and 80 inequivalent pairs built from the pattern categories of §4; the equivalent ones "were split into two sub-datasets of 60 and 20 pairs for different testing phases" (§6.3).
- **Models:** GPT-4-0314, later gpt-4-32k-0613 (§7), "GPT-4 series models accessed through the Azure OpenAI API" (§8.1), and GPT-4o for Table 4 (Tab. 4 caption).
- **Metrics:** accuracy, and precision, recall and F1 with equivalent as the positive class (§8.1); §8.1 also defines Stability, "the percentage of query pairs for which the LLM produces consistent judgments across multiple runs", and an error analysis.
- **SQL fragment:** not discussed. The prompt's context names "Dataverse t-sql" (§7), Microsoft's SQL dialect.

## Approach

- **Pattern catalogue** (§4; App. B; examples App. C): 11 categories of equivalent pairs, among them join vs. subquery, DISTINCT vs. GROUP BY, implicit vs. explicit join, aggregation methods, OR vs. UNION, CASE vs. UNION ALL with WHERE, and EXISTS vs. JOIN (App. B.1), and 8 sources of inequivalence, such as wrong join conditions, wrong WHERE clauses, wrong aggregation, and misuse of DISTINCT, subqueries, ORDER BY or functions (App. B.2). §4.1 says App. C gives examples "for each of these categories".
- **Basic pipeline** (§7; Algorithm 1, App. E, PDF p. 22):
  1. Preprocess both queries to standardize formatting such as dates and filters.
  2. Return Equivalent if EM or ESM matches.
  3. Otherwise prompt the LLM with a task definition, Dataverse context, the query pair, optionally the schema, execution results and few-shot examples, and an output format (binary with confidence, or a five-way scale from Equivalent to Not Equivalent, with reasons) (§7; App. D.1–D.2).
  4. Run it "multiple times (e.g., 3 by default)"; if the runs disagree the result is "unstable", and "the number of runs may be increased (e.g., to 5), applying majority voting" (§7).
- **Tuning on the development set** (§8.2.2): a clearer definition of equivalence, chain-of-thought few-shot examples, and more detailed grading criteria.
- **Improved pipeline for strict equivalence** (§8.2.3; Algorithm 2, App. E, PDF p. 23): a query-rewrite module first "rewrites subqueries (if they appear) into queries with left joins", then string matching, then the LLM with the Miniature & Mull prompt, with the same multi-run vote.
- **Business variant** (§5): replacing selected columns with `*` before judging is called a pragmatic but "brutal" mitigation for Dataverse, which "can be useful when minor variations in selected columns are acceptable".

## Results

- **Dataverse, basic pipeline with GPT-4-0314** (§8.2.1, Tab. 2): it reports precision 0.9545 and recall 0.8936 on equivalent pairs, against 0.6429 and 0.8182 on inequivalent ones. The authors call it "robust enough especially for the debugging purpose", since their text-to-SQL pipeline produces few wrong queries (§8.2.1).
- **String matching alone** (§8.2.1, Tab. 3): by design it never calls an inequivalent pair equivalent; its recall on equivalent pairs is 0.5536, which the authors say means "it can save around 50% of GPT calls on datasets which have similar distribution as the testing data we used".
- **After iteration** (§8.2.2): after several iterations the authors report "100% precision and recall on the original testing data"; after tuning on the 14-pair development set, "92.9% accuracy on this data".
- **Synthetic data, strict equivalence** (§8.2.3, Tab. 4): in the initial pipeline's failure cases, "many issues arose from subqueries, where GPT had difficulties translating between SQL queries using subqueries and those using joins". With the rewrite and Miniature & Mull together, the passing rate rose from 61.25% to 95% on equivalent pairs and fell from 90% to 83.75% on inequivalent ones, both with GPT-4o (Tab. 4). The table shows "the combined effect of these enhancements" (§8.2.3).

## Limits the authors state

- On inequivalent Dataverse pairs the LLM does "slightly worse" (§8.2.1).
- The query rewrite brought a "slight drop in the in-equivalent case, which implies that we need to be careful when applying query re-write as it may cause regressions in some cases" (§8.2.3).
- LLM answers "can be non-deterministic and may vary across runs or with slight prompt modifications", and LLMs "are not yet a foolproof substitute for execution-based checks, especially for ensuring factual correctness" (§3.4).
- Replacing selected columns with `*`, though "potentially helpful in some Dataverse scenarios", "can obscure important differences and may not be suitable for rigorous benchmarking" (§3.4); on benchmarks like BIRD it "may even cause LLM-based evaluations to regress in performance compared to standard EX" (§5), EX being execution accuracy.
- "challenges remain, including handling highly complex queries, ensuring consistent LLM behavior, and mitigating issues arising from preprocessing steps" (§9).
- The ORDER BY category "requires careful consideration" (App. B.1).

## Open problems and building blocks

  - Future work: "more advanced LLM reasoning techniques, robust automated query rewriting, and strategies to reduce LLM hallucination"; integrating "syntactic, semantic, execution-based" methods and open-source evaluation tools; "Expanding datasets with more diverse and complex examples, particularly from real-world applications, and refining error analysis" (§9).
  - Bottleneck named: because text-to-SQL self-tuning uses evaluation results, "the quality of the SQL evaluation becomes a bottleneck in improving the quality of Text-to-SQL" (§2).
- **Released:** Nothing stated.
- **To reuse it:** GPT-4-series models through the Azure OpenAI API (§8.1); 3 LLM calls per pair by default, optionally up to 5 when runs disagree (§7; Algorithm 1); the schema for Miniature & Mull (App. D.3); the prompt templates (App. D) and pseudocode (App. E).

## On this site

- **Discussed in:** [Sourcing realistic, hard query pairs](#/challenges/query_pair_sourcing)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/judge-sql">judge-sql</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/nl2sql-eval">nl2sql-eval</a></span>
