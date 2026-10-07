# Semantic Evaluation for Text-to-SQL with Distilled Test Suites

**Semantic Evaluation for Text-to-SQL…** · EMNLP 2020

Read: [PDF](https://arxiv.org/pdf/2010.02840) · [arXiv](https://arxiv.org/abs/2010.02840) · [DOI](https://doi.org/10.18653/v1/2020.emnlp-main.29)  
Code: [test-suite-sql-eval](https://github.com/taoyds/test-suite-sql-eval)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- "Test-suite accuracy": a small suite of databases distilled to separate the gold query from near-miss neighbours.
- Its README says it is now the official metric of Spider, SParC and CoSQL (`test-suite-sql-eval` `README.md:3`).
- A sampling-based refuter for text-to-SQL evaluation; SpotIt cites it as test-data generation that can detect non-equivalence ([SpotIt](#/papers/klopfenstein2025spotit "SpotIt: Evaluating Text-to-SQL Evaluation with Formal Verification (2026)")).

## In plain words

A [text-to-SQL](#/glossary/text-to-sql) model is graded against a human-written reference query. Comparing query text marks correct rewordings wrong; comparing results on one database can mark a wrong query right by chance. The authors call judging whether two queries agree on every possible database "a long-standing problem" (§1). For each reference query they keep a few databases, chosen from many random ones because they tell the reference apart from slightly altered copies of it, and accept a model's query only if it matches the reference's result on all of them (abstract). On 21 submissions to the Spider benchmark, a hand check of 100 sampled queries that an adapted version of Spider's official clause-by-clause metric rejected and the new metric accepted found the new metric right every time (§6.1). Measured against the new metric, that adapted metric's rate of wrongly rejected queries averaged 2.6% (§6.2). They present it as a better approximation, not a general equivalence check (§8).

## Background and terms

**Terms to know:** [gold query](#/glossary/gold-query) · [execution accuracy](#/glossary/execution-accuracy) · [query equivalence](#/glossary/query-equivalence) · [decidable and undecidable](#/glossary/decidable-and-undecidable) · [fuzzing](#/glossary/fuzzing) · [counterexample database](#/glossary/counterexample-database) · [branch and path coverage](#/glossary/branch-and-path-coverage) · [integrity constraint](#/glossary/integrity-constraint)

**The paper's own terms:**
- **denotation**: a query's result on a database, computed with SQLite as in Spider; a query that doesn't finish (in practice, a timeout) gets a special value (§2, footnote).
- **semantic accuracy**: the prediction has the gold's denotation on every possible database; "undecidable in general", citing Cosette (§2).
- **exact set match (ESM)**: Spider's official metric; it splits both queries into clauses and checks that the sets of clauses match (§5.3).
- **single denotation accuracy**: comparing denotations on the one database the dataset ships (§2); the glossary's execution accuracy.
- **distinguishes**: a database distinguishes two queries if their denotations on it differ; a test suite (a set of databases) does if any of its databases does (§2, Eq. 2–3).
- **test suite accuracy**: a prediction is correct if no database in the suite distinguishes it from the gold (§2).
- **code coverage**: the suite should exercise "every branch and clause of the gold query" (§3), e.g. hold people above, below and at age 34 for a condition on age 34 (§3.1); measured by how many neighbor queries it distinguishes.
- **neighbor queries**: copies of the gold with exactly one small change, close in text but probably not equivalent (§3.1, Fig. 2).
- **distilled test suite**: the few databases kept from a large random sample because they distinguish neighbors (§1, §4.2); "distill" means keeping a subset, not training a model.
- **adapted metrics**: ESM and test suite accuracy as changed for a fair comparison (§5.3); the rest of the paper means these.
- **difficulty splits**: Spider's easy, medium, hard and extra hard classes, set by gold query complexity (§5.1).

**Missing glossary terms:**
- **Kendall τ (tau) correlation**: a rank correlation; it is high when two scores put most pairs of items in the same order. Here the items are the 21 submissions (§6.3).

**Builds on:**
- Spider's evaluation ([Spider](#/papers/yu2018spider "Spider: A Large-Scale Human-Labeled Dataset for Complex and Cross-Domain Semantic Parsing and Text-to-SQL Task (2018)")): ESM and single denotation accuracy, the metrics measured against (§2, §5.3); the paper cites ESM to Zhong et al. 2017 (WikiSQL, not listed here) and Spider (§5.3).
- Formal equivalence tools that turn SQL into other mathematical forms, K-relations ([Provenance Semirings](#/papers/green2007provenance "Provenance Semirings (2007)")), UniNomial ([Cosette](#/papers/chu2017cosette "Cosette: An Automated Prover for SQL (2017)")) and U-semiring ([UDP](#/papers/chu2018udp "Axiomatic foundations and algorithms for deciding semantic equivalences of SQL queries (2018)")), which the authors say "cannot express sort operations and float comparisons" (§1).
- Fuzzing, citing the testing tools Zest, AFL, PerfFuzz and QuickCheck, and testing work cited for code coverage (Miller and Maloney 1963; Ammann and Offutt) (§1); none on this site.

## Problem and setting

- **Question:** how to approximate semantic accuracy better than ESM or single denotation accuracy, cheaply, without seeing the predictions when building the suite (§1, §2).
- **Ordering:** the authors state exact match ⇒ semantic accuracy ⇒ test suite accuracy ⇒ single denotation accuracy (correctness under the first implies correctness under the second), so test suite accuracy is an upper bound on semantic accuracy (§2).
- **Data:** the Spider development set, 1034 questions over 20 database schemas (§5.1); predictions from 21 leaderboard submissions, received by the first author only after the suites were built (§5.2). Also suites for ten more datasets (App. A.2, Tab. 4) and a check on WikiSQL, a dataset of simple queries (App. A.3).
- **Comparison rules:** the adapted test suite accuracy tries every way of putting the gold's constants into the prediction and ignores column order, because Spider's metric checks neither (§5.3). The authors fix a bug in Spider's script that ignored join conditions, and keep its choice not to check table aliases (§5.3).
- **Databases:** random databases respect table and column names, column types and foreign keys (§4.1); rules that hold in the data but not in the schema are not modelled (§8).
- Set, bag or ordered-list comparison of results, and NULLs: not discussed.

## Approach

- **Neighbor queries (§3.1, Fig. 2).** Every copy of the gold that differs in one way: a number replaced by a random value or by itself ±1 (±0.001 for decimals); a string replaced by a random string, a substring, or itself plus a random string; a comparison operator or column name swapped; or a piece of the query dropped unless that can't change the meaning (e.g. `ASC`). Copies that fail to run are removed. One change at a time, because two can cancel (`> 34` equals `>= 35` on integers).
- **Objective (§3.2, Eq. 4).** The smallest suite that distinguishes the gold from every neighbor. The authors' reasoning: telling all near-misses apart forces the suite to exercise every part of the gold, so it should catch other wrong queries too (§1, §3.1).
- **Random databases (§4.1, Fig. 3).** Tables are filled so that a table comes after those its foreign keys point to; a foreign-key column draws its values from the column it refers to. Other values are random numbers from a very wide range or random strings, mixed with the gold's constants and close variants (34 → 35, "Alice" → "aAlicegg").
- **Distillation (§4.2).** Draw random databases one by one and keep one if it distinguishes a neighbor that no kept database distinguishes yet; the authors call this greedy search "far from finding the optimal solution". Gold queries over one schema share the random databases.
- **Metric.** Run prediction and gold on the suite and compare. The authors state it "provably never creates false negatives in a strict programming language sense" (§8).

## Results

- **Coverage (§6.1, Fig. 5).** With 1000 random databases per schema the suite distinguishes more than 99% of neighbors, against 5% left undistinguished by Spider's own database; most of the remaining 1% are equivalent to the gold (Fig. 4).
- **Manual check (§6.1).** All 100 sampled queries that ESM rejects and test suite accuracy accepts were judged equivalent to the gold.
- **ESM's errors (§6.2, Tab. 1).** With test suite accuracy as ground truth, ESM's false-negative rate averages 2.6% over submissions (worst 8.1%), and 4.4% (worst 12.1%) on the hard split; the authors say ESM "tends to underestimate model performances" (§1).
- **Single denotation's errors (Tab. 2).** False-positive rate 6.5% on average (worst 9.0%) on all data, 11.0% (worst 17.6%) on extra hard.
- **Rankings (§6.3, Fig. 6–7, Tab. 3).** Kendall τ between ESM and test suite accuracy is 91.4% overall but 74.1% on the hard split; the authors read this as ESM falling behind as models improve. The official script, without the join fix, correlates poorly (Tab. 3).
- **Cost (§6.4).** About 42 databases per query, 695 in all (3.27 GB); running the gold queries takes 75.3 minutes on one CPU against 1.2 on the original databases. Checking one random database instead matched the full suite on the 21 submissions; the authors still recommend the full suite.
- **Other datasets (App. A.2, Tab. 4).** Every datapoint in all eleven datasets gets a non-empty gold result on some suite database; the share "reliably evaluated" is lowest on Advising and ATIS.
- **WikiSQL (App. A.3).** Among about 200K predictions from eight models, the authors find 1 that their metric wrongly accepts, an extra condition the suite never exercises.

## Limits the authors state

- "We do not attempt to solve SQL equivalence testing in general"; the suite "might not cover all the branches of model-predicted queries", and a query that differs from the gold "only under extreme cases" fools the metric; they "never observe models making such pathological mistakes" (§8).
- Neighbors that differ only at floating-point precision (`<= 2.31` vs `< 2.31`) are hard to distinguish (§6.1); so are gold queries with many `WHERE` conditions or thresholds like `COUNT(*) > 5000` (App. A.2).
- Common-sense rules missing from the schema (`A_wins` vs `scoreA > scoreB`) let random databases reject acceptable answers (§8); pragmatically acceptable answers with extra columns count as wrong (§8).
- Inserting gold constants can loosen the metric: a wrong `LIKE '%name%'` passes (§7, Fig. 8 row 6).
- Semantic accuracy ignores how a query computes its result, e.g. unnecessary joins (§7).
- They "do NOT recommend" it for WikiSQL, whose only equivalent variant is counting another column (App. A.3).

## Open problems and building blocks

  - Revisit the hypothesis that models make no such pathological mistakes "due to Goodhardt's law, since researchers will optimize over our metric" (§8).
  - "Automatic constraint induction from database content and schema descriptions", "on its own an open research problem"; dataset builders should define their database generation (§8).
  - Multiple gold references per question; complementary metrics such as efficiency and readability (§8).
  - Hand-crafted test suites for ATIS and Advising (App. A.2).
- **Released:** the metric implementation and test suites for eleven datasets (abstract, footnote 1; §8), the submissions' predictions (§5.2), and the 100 hand-checked queries with reasons (§6.1).
- **To reuse it:** a schema with column types and foreign keys, and SQLite (§2, §4.1); building the Spider suites took "around a week on 16 CPUs" (§6.1). The framework needs strongly typed inputs and neighbor queries (§8).
- **Beyond its domain:** it "might potentially be applied to other logical forms", such as λ-DCS, knowledge graphs and Python code snippets, "if variable types can be heuristically extracted" (§8).

## On this site

- **Discussed in:** [Canonical forms for queries](#/challenges/query_canonical_forms) · [Sourcing realistic, hard query pairs](#/challenges/query_pair_sourcing) · [Equivalence under schema constraints](#/challenges/schema_constrained_equivalence) · [Text-to-SQL can't be verified against intent](#/challenges/text_to_sql_verification) · [Weak checkers get exploited](#/challenges/weak_checker_exploitation)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/cex-search">cex-search</a><a class="tag sub" href="#/tags/nl2sql-eval">nl2sql-eval</a></span>
