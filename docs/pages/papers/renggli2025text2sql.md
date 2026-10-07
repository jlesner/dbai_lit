# Fundamental Challenges in Evaluating Text2SQL Solutions and Detecting Their Limitations

**Fundamental Challenges in Evaluating…** · preprint 2025

Read: [PDF](https://arxiv.org/pdf/2501.18197) · [arXiv](https://arxiv.org/abs/2501.18197)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- A taxonomy of text-to-SQL limitations that cause prediction and evaluation errors (abstract).
- Surveys how match functions approximate SQL equivalence and how NL ambiguity enters benchmarks (abstract).
- A map of where equivalence checking enters text-to-SQL evaluation.

## In plain words

Text-to-SQL systems turn a natural-language question, plus a description of a database's tables, into an SQL query; benchmarks score them against one human-written answer query per question. The authors argue that trusting the aggregate scores as a guide to real use "can be misleading" (§1): a question typically has several plausible queries, some answer queries are wrong, and the scoring rules that stand in for checking whether two queries mean the same thing can over- or under-estimate a system. They sort the causes of prediction and scoring errors into a taxonomy with three top levels (the system, the benchmark data, the scoring method) and give examples, possible fixes and open challenges for each, mostly from the test set of Spider, "the most prominent public benchmark" (§1). One headline count, checked by hand: of the 25 Spider test questions whose answer query returns no rows, they judge 21 answer queries wrong (§5). They present the work as "a first step towards building a complete taxonomy" (§7), a survey rather than a new system or benchmark.

## Background and terms

**Terms to know:** [text-to-SQL](#/glossary/text-to-sql) · [gold query](#/glossary/gold-query) · [query equivalence](#/glossary/query-equivalence) · [execution accuracy](#/glossary/execution-accuracy) · [abstract syntax tree (AST)](#/glossary/abstract-syntax-tree-ast) · [integrity constraint](#/glossary/integrity-constraint) · [NULL and three-valued logic](#/glossary/null-and-three-valued-logic) · [nondeterministic query](#/glossary/nondeterministic-query) · [constrained decoding](#/glossary/constrained-decoding) (the paper writes "constraint decoding") · [normalized schema](#/glossary/normalized-schema)

**The paper's own terms:**
- **Text2SQL task**: from a natural-language (NL) description and a serialized schema (the table definitions as text), predict "exactly one, i.e., the most likely or any of the most likely, valid, and executable SQL query" (§2.1).
- **Match function**: a practical stand-in for SQL equivalence (§2.2). Semantic match functions parse both queries into an intermediate form such as an AST and test whether valid algebraic transformations (rewrites that keep the meaning) turn one into the other; execution match functions compare the queries' results on one or more database instances (the schema's tables filled with rows) (§1, §6.1).
- **Prediction and evaluation errors** (§3, Tab. 2): a prediction is missing (no executable query although a valid one exists) or wrong. A type I error, a false positive (FP), marks a prediction wrongly correct; a type II error, a false negative (FN), marks it wrongly incorrect.
- **Ambiguous and unanswerable** (§3): ambiguous when an NL description and schema have "multiple equally likely interpretations"; unanswerable if unrelated to the schema or resting on a wrong presupposition (an assumption the question makes that the data may break). Example: a top-k question about "the oldest person" when several tie (Tab. 1).
- **Label and feature accuracy and completeness** (§5), two data-management dimensions applied to labels (the gold queries) and features (the inputs): an inaccurate label is not executable or gives a wrong or incomplete result (§5.1); an incomplete label is one gold query where other plausible queries exist (§5.2); an inaccurate feature has no plausible valid SQL reading (§5.3); an incomplete feature lacks schema information such as attribute domains (the values a column holds) and integrity constraints (§5.4).
- **Ambiguity relaxation** (§6.2): a rule, typically built into match functions, that lets a prediction differing in an allowed way still match: ignore row order, duplicate rows, column type, column order, column affiliation (flatten the result into values), or exact column overlap (accept a result equal to a subset of the other's columns).

**Builds on:**
- The benchmarks Spider ([Spider](#/papers/yu2018spider "Spider: A Large-Scale Human-Labeled Dataset for Complex and Cross-Domain Semantic Parsing and Text-to-SQL Task (2018)")) and BIRD ([BIRD](#/papers/li2023bird "Can LLM Already Serve as A Database Interface? A BIg Bench for Large-Scale Database Grounded Text-to-SQLs (2023)")), human-labelled questions and SQL over many databases, and their default match functions (§2.2, §6).
- Extensions of those match functions (§6.1.1): ESM+ (semantic matching with more rules that use schema information), test suites ([Semantic Evaluation for Text-to-SQL…](#/papers/zhong2020testsuite "Semantic Evaluation for Text-to-SQL with Distilled Test Suites (2020)"), which add database variants for larger coverage), and Dr.Spider (adversarial changes to samples or databases).
- Work it calls "preliminary studies" on scoring several plausible queries (§5.2.1): [AmbiQT](#/papers/bhaskar2023ambiqt "Benchmarking and Improving Text-to-SQL Generation under Ambiguity (2023)") (AmbiQT, questions with two plausible SQL readings) and Wang et al. 2023.

## Problem and setting

- **Questions** (§1): Q1, whether causes beyond the model can make predictions inaccurate; Q2, whether the evaluation procedure can bias accuracy estimates up or down.
- **Evidence:** the taxonomy was built from "manual inspections of failure cases observed in state-of-the-art LLMs" on public benchmarks like Spider and on proprietary datasets (§3).
- **What "correct" means:** two queries are equivalent for a fixed schema if no valid database instance makes them return different results (§1); the authors write that testing this "has been proven computationally hard or even undecidable in general" (§2.2). In their probabilistic view, "there is typically not a single ground truth SQL query for a fixed input" (§2.1).
- **NULLs and engine:** NULLs appear as label errors and filter ambiguity (§5.1, §5.2); some examples rest on SQLite behaviour (§5.1.1).

## Approach

- **The taxonomy (Tab. 3),** with errors and mitigations per issue (§3):
  - *Text2SQL solution* (§4): input preparation (missing information, suboptimal prompt), inference (API or system failures, model misprediction), result extraction; these cause prediction errors.
  - *Evaluation data* (§5): label accuracy; label completeness (distinct vs. not distinct, projection clauses (which columns to return), filter conditions, schema ambiguity); feature accuracy (unanswerable inputs, wrong presuppositions); feature completeness. These "can affect both prediction and evaluation outcomes" (§3).
  - *Evaluation metric* (§6): semantic match, execution match, and six ambiguity relaxations; these can cause evaluation errors.
- **Where scoring goes wrong (§6.1).** Many semantic match functions "result in type II evaluation errors (FNs)" when valid transformations are missing or the search stops early. Execution match tests on few instances, "one for both Spider and BIRD", so different queries can agree, especially on empty results; "these errors typically result in type I evaluation errors (FPs)".
- **Relaxations (§6.2).** "In general, applying any relaxation can increase the FP rate, whereas omitting it can increase the FN rate." The authors write that Spider and BIRD apply different relaxations.
- **Noisy-sample detector (§5.1.2, Fig. 2, App. A)**: several LLMs each propose up to three plausible SQL variants per question (App. A.1). When the gold query matches none under the chosen match functions, the authors check it by hand. A majority-vote version looks for other noisy samples (App. A.2).
- **Mitigations proposed** include asking the model for several variants (§4.2.1), labelling all plausible variants and scoring with an overlap metric such as F1 (§5.2.1), serializing attribute domains and constraints (§5.4.1), choosing relaxations per input (§6.2.1), and multi-turn clarification (§7).

## Results

Counts from filtering and hand-checking Spider's test split, not system scores.
- **Empty results (§5.1.2):** of 25 test queries whose gold query returns no rows ("roughly 1% of the full dataset"), 21 have a wrong label, "mostly due to wrong value comparison or null handling"; one is a correct but not the most plausible NULL handling, and three "are likely to represent wrong labels as well".
- **Detector lists (App. A.3–A.4)**: 43 test samples ("roughly 2%") "likely to have inaccurate labels", and another 42 whose feature and label "contain some degree of noise based on manual inspection".
- **Top-k (§5.3.2):** 335 samples ("roughly 15% of the test set size") match an ORDER BY … LIMIT k template and may give wrong predictions; of random samples, "only a very small fraction" clarify that all tied rows are wanted.
- **Row order (§6.2, item 1):** 24 samples ("roughly 1% of the test dataset") have ORDER BY without LIMIT, where, if row order is ignored, a wrong order passes as an FP.
- **Duplicates (§6.2, item 2):** 521 (~24%) test queries lack DISTINCT and 151 (~7%) have it; "only a very small fraction" of the 151 ask for distinct results, so for many of them a prediction without DISTINCT, "assuming no other label noise, might result in FP evaluation errors".
- **Without counts:** with "different open LLMs", prompting for several variants "helps resolve many of the prediction issues for simple queries, especially when relying on smaller models" (§4.2.1); "most of the missing predictions for these datasets stem from result extraction errors only" (§4.3.2).

## Limits the authors state

- The taxonomy "might miss some relevant categories and could be extended in the future" (§7).
- It "cannot be directly applied to existing benchmarks", for three stated reasons (§1).
- The detector "is merely a proxy to find interesting samples and does not differentiate between different data quality issues"; its list is "not necessarily complete" (§5.1.2).
- The empty-result proxy "does not generalize to benchmark datasets where there are queries resulting in empty results on purpose" (§5.1.2).
- The extraction finding holds "for these relatively simple and answerable inputs" (§4.3.2).

## Open problems and building blocks

  - Separating input-preparation from prediction issues, "a largely under-explored area of research" (§4.1.2), and finding why sub-populations perform poorly, "an under-explored area of research" (§4.2.2); separating the causes of missing predictions on real-world distributions, which the authors conjecture is "an important research direction for the future" (§4.3.2); automatic categorization, which needs new benchmarks (§7 "Automatic Categorizations").
  - Wrong-label detection has "no benchmark to evaluate automatic approaches", and extending ML data-cleaning and label-noise methods to generative-AI use cases and text inputs is "an open challenge requiring future research" (§5.1.2); labelling all variants "can be very expensive to obtain if there are exponentially many variants", and no methods find samples with missing variants (§5.2.2).
  - Detecting inaccurate inputs: beyond one "preliminary analysis on unanswerable queries", there is "to the best of our knowledge, no related work targeting this problem in a principled way"; for top-k questions where any k tied rows are acceptable, "there is currently no evaluation method able to capture this nondeterministic behavior" (§5.3.2).
  - "identifying which samples are affected by missing schema components remains an open problem" (§5.4.2).
  - Estimating match-function bias on an input-output distribution "remains an unsolved challenge" (§6); measuring relaxations' impact, with a disagreement-based algorithm left "for future work" (§6.2.2).
  - Trade-offs among mitigations, "an open and challenging problem" (§7 "Cross Top-Level Limitation Mitigation"); benchmarks for "unanswerable and multi-answer cases" (§7 "Takeaways").
- **Released:** Nothing stated; the appendix prints the detector's prompt and sample lists (App. A).
- **To reuse it:** the detector uses "multiple different models available via public APIs" (App. A), at least 3 for majority voting, match functions with chosen hyperparameters (App. A.2), and manual checks (§5.1.2).

## On this site

- **Discussed in:** [Equivalence of nondeterministic queries](#/challenges/nondeterministic_equivalence) · [Text-to-SQL can't be verified against intent](#/challenges/text_to_sql_verification) · [Weak checkers get exploited](#/challenges/weak_checker_exploitation)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/llm-gen">llm-gen</a><a class="tag sub" href="#/tags/nl2sql-data">nl2sql-data</a><a class="tag sub" href="#/tags/nl2sql-eval">nl2sql-eval</a></span>
