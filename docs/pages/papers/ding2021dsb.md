# DSB: a decision support benchmark for workload-driven and traditional database systems

**DSB** · PVLDB 14(13) 2021

Read: [DOI](https://doi.org/10.14778/3484224.3484234)  
Code: [dsb](https://github.com/microsoft/dsb)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- TPC-DS adapted for workload-driven systems: skewed, correlated data and new join-heavy templates.
- Configurable parameter distributions; harder for real optimizers.
- A common workload of LLM query rewriters (LLM-R2, R-Bot, E3-Rewrite, SPA, LASER, ReSequel); QO-Verify cites it but evaluates on TPC-H, TPC-DS, JOB and real queries. Not equivalence pairs.

## In plain words

Decision-support benchmarks pair a synthetic warehouse with analytical query templates. The authors argue that newer workloads and self-tuning systems challenge the widely used industry standard, TPC-DS (a retail warehouse): its data mostly assumes independence between columns and tables, its joins are mostly along keys, some templates can yield only a few distinct queries, and it gives not enough guidance for comparing systems that tune themselves from their workload, such as machine-learning [query optimizers](#/glossary/query-optimizer), which may spend extra resources on data collection, training and inference (§1, PDF pp. 1–2). They build DSB, adapted from TPC-DS, with skewed and correlated data, widened and new query templates, configurable and changing workloads, and guidelines on evaluation and reporting (§1, PDF p. 2). With 1,000 queries generated per template from the default parameter distribution, they report 8% duplicate queries for DSB against 63% for TPC-DS, and more complex query optimization than TPC-DS on both the database systems Microsoft SQL Server 2019 and Postgres 13 (§1, PDF p. 2; §6.2, PDF p. 7). They present it as "a new benchmark" (abstract, PDF p. 1).

## Background and terms

**Terms to know:** [query optimizer](#/glossary/query-optimizer) · [query plan and EXPLAIN](#/glossary/query-plan-and-explain) · [cardinality estimation](#/glossary/cardinality-estimation) · [selectivity](#/glossary/selectivity) · [index (database)](#/glossary/index-database) · [fact and dimension tables, snowflake schema](#/glossary/star-and-snowflake-schemas) (TPC-DS has several snowflake schemas, §2, PDF p. 2) · [q-error](#/glossary/q-error) (the paper cites Moerkotte, Neumann and Steidl (2009) for it, §6.4, PDF p. 9) · [OLAP](#/glossary/olap-and-oltp) (in our terms, the paper's decision-support workloads: analytical querying of a data warehouse) · [primary key-foreign key (PK–FK) join](#/glossary/primary-key-foreign-key-join) (the paper contrasts it with joins on columns "neither primary keys nor foreign keys", such as [many-to-many](#/glossary/many-to-many-relationship) joins, and with non-equi joins, whose condition is not an equality, §1, PDF p. 1)

**The paper's own terms:**
- **workload-driven database system**: one that observes its workload, "passively or actively" collects execution feedback, and tunes itself (§1, PDF p. 2); the others are "traditional".
- **query template, query instance**: a parameterized query, and that query with its parameters bound to values (§4.1, PDF p. 4).
- **duplicate ratio**: the share of duplicate instances in a workload; an instance is distinct if no other has the same query text after DSB's canonical ordering of parameters (§5.2, §6.2, PDF pp. 6–7).
- **preparation stage, test stage**: before testing, a system may use the database and a training workload to build statistics or models; the test stage runs and times the test workload (§5.3–5.4, PDF pp. 6–7).

**Missing glossary terms:**
- **independence assumption**: estimating a value combination's frequency as the product of each column's own frequency (§6.4, PDF p. 9).

**Builds on:**
- TPC-DS (Poess, Smith, Kollar and Larson, 2002), whose schema DSB keeps and whose templates and generator it adapts (§1, PDF p. 2).
- Data generators with Zipfian or exponential skew, and JCC-H (Boncz et al., 2017; TPC-H, an older decision-support benchmark, with join-crossing correlations and skew), whose techniques DSB "leverages" (§2, PDF pp. 2–3).
- Dutt, Wang, Narasayya and Chaudhuri's (2020) machine-learning cardinality estimator, adapted for the case study (§7.1, PDF p. 10).

## Problem and setting

- **Question:** how to benchmark workload-driven and traditional systems on modern decision support (§1, PDF pp. 1–2).
- **Setting (§6, PDF p. 7):** TPC-DS's schema; 100 GB databases with 56 secondary B+-tree indexes (extra indexes beside the table's storage, kept as balanced search trees) from SQL Server's Database Tuning Advisor (§3.3, PDF p. 4); SQL Server 2019 and Postgres 13 in §6, SQL Server 2019 only in §7 (PDF p. 10).
- **Duplicates** are textual, justified as: "Since deciding the equivalence of SQL queries is NP-hard" (§6.2, PDF p. 7).
- **Harder:** "With the same database system, a query can result in more time of query optimization if the query is more complex, i.e., a larger search space or no obvious good plan based on heuristics", so a benchmark "can be more challenging" when optimization takes longer (§6.3, PDF p. 8); it also counts distinct plans and measures misestimates, which "Intuitively" make good plans harder (§6.4, PDF p. 9).

## Approach

- **Data (§3, PDF pp. 3–4).** Single-column skew from exponential distributions; for large ordered domains such as dates, and for numbers, values are bucketized (a range is drawn from the skewed distribution, then a value inside it) (§3.1, PDF p. 3). Within a table: skew over pairs of values of two columns, and positive correlation, where a value of one "driving column" restricts which values another column gets (Alg. 1). Across tables: Alg. 2 correlates columns of two dimension tables in their join through a fact table, by choosing the fact table's foreign keys to match a target joint distribution (§3.2, PDF pp. 3–4).
- **Queries (§4, PDF pp. 4–5).** Extra parameterized filters and wider parameter ranges in TPC-DS templates; some templates are left out that have few joins, a parameter space that can't easily be widened without more joins or a large change of meaning, or a very similar twin (§4.1, PDF p. 4). Three new templates (Queries 100–102) with join patterns including many-to-many, non-equi and cyclic joins (join conditions that form a cycle among the tables) (§4.3, PDF p. 5). Categorical parameter weights from Gaussian distributions with configurable mean and variance; a sequence of configurations gives a workload that shifts over time (§4.2, PDF p. 5). Canonical parameter order "to reduce duplication when possible" (§4.4, PDF p. 5).
- **Method (§5, Tab. 1, PDF pp. 5–7).** Results should use at least 100 GB and at least 10 instances per template, and a duplicate ratio below 0.1 over training and test together is recommended (§5.2, PDF pp. 5–6). Test-stage elapsed and CPU time should include every per-query overhead (optimization, model inference, data collection, model updates); overhead outside them (GPUs, FPGAs) is disclosed and reported; percentiles are recommended (§5.4, PDF pp. 6–7).

## Results

Each is the authors' claim, on 100 GB databases, with test workloads from the default parameter distribution.
- **Shape (Tab. 2, PDF p. 8).** 37 templates plus 15 derived single-block select-project-join queries, against TPC-DS's 99; more joins per query on average.
- **Duplicates (§6.2, Fig. 1, PDF pp. 7–8).** DSB's duplicate ratio stays below TPC-DS's at every workload size tested: 8% against 63% at 1,000 instances per template.
- **Optimization work (§6.3, Tabs. 3–4, PDF pp. 8–9).** With 20 instances per template, average optimization time (normalized by one constant) on DSB is 2.7× TPC-DS's on SQL Server 2019 and 2.9× on Postgres 13. Distinct plans per template: 7.9 against 1.5 on SQL Server, 4.9 against 2.5 on Postgres. Swapping in TPC-DS data or TPC-DS queries shows that the data and the template changes each raise both on SQL Server; "The trend is similar on Postgres 13".
- **Misestimates (§6.4, Tab. 5, PDF p. 9).** For four parts of DSB templates, each a table or a join of three to five tables grouped by two or three columns, q-errors of group-size estimates under the independence assumption are up to 4.5× TPC-DS's at the median and up to 29.0× at the 90th percentile; the errors are "amplified after joining multiple tables".
- **Room for better plans (§6.5, Figs. 2–4, PDF pp. 9–10).** On SQL Server 2019, the best plans the authors got by injecting true cardinalities ("Optimal") take 31% less elapsed time on average than the original plans (20 instances per template), with gains spread over many instances and templates.
- **Case study (§7, PDF pp. 10–12).** Five SQL Server 2019 variants, tested on 20 instances per template: unmodified (Original); with the rules that push partial aggregation below other operators disabled (NoPartAgg); and the ML estimator trained on instances it generates from the data (MLData), on a workload with the test's parameter distribution (MLSame), or on one with a different distribution (MLDiff) (§7.1, PDF p. 10). In normalized average elapsed time, MLSame is 7% faster than Original, MLDiff 4% slower, NoPartAgg 6% slower (§7.3, Fig. 5, PDF pp. 11–12). MLSame also slows down some instances and templates (Figs. 6–8, PDF p. 12).

## Limits the authors state

- DSB "does not comply with the TPC-DS benchmark", so its results are not comparable to published TPC-DS results (footnote 1, PDF p. 2).
- The widened templates' semantics "only change slightly" (§4.1, PDF p. 4).
- Misestimates "do not necessarily translate to suboptimality in plan quality" (§6.4, PDF p. 9).
- Optimal indicates "a lower bound of the room for improvement" (§6.5, PDF p. 9).
- The case study "does not necessarily reflect the best implementation" of the estimator, "nor the performance of the state-of-the-art ML-enhanced database systems" (§7, PDF p. 10); the implementation "has limitations in parsing complex predicate filters and optimizing time and space consumption" (footnote 2, PDF p. 10).
- Under a time limit, "Most models are successfully trained to converge" (§7.2, PDF p. 11); sampling the new templates' many-to-many fact-table joins timed out, so the estimator falls back to Original for those expressions (§7.2, PDF p. 11).

## Open problems and building blocks

- **Open:** none called open. The authors state that "our adaptation and the evaluation methodology can be extended to enhance other benchmarks" (§1, PDF p. 2), and that DSB could use other parameter-generation techniques such as Gubichev and Boncz's (§2, PDF p. 2).
- **Released:** the benchmark's code, "open sourced" (abstract, PDF p. 1); the PVLDB Artifact Availability box names "source code, data, and/or other artifacts" (PDF p. 1). Also the index specification (§3.3, PDF p. 4), a database generator from 1 GB to 100 TB and a workload toolkit (§5.2, PDF p. 5).
- **To reuse it:** besides the Method bullet's sizes, the full template set and publicly accessible hardware are recommended (Tab. 1, PDF p. 6).

## On this site

- **Tags:** <span class="tags"><a class="tag" href="#/tags/workload">workload</a></span>
