# Evaluating the Practical Effectiveness of LLM-Driven Index Tuning on Microsoft SQL Server

**LLM-driven index tuning on SQL Server** · PVLDB 19(12) (reference-format block; not yet published) · 2026

Read: [PDF](https://arxiv.org/pdf/2603.09181) · [arXiv](https://arxiv.org/abs/2603.09181)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Compares LLM index recommendations with Microsoft's Database Tuning Advisor (DTA) on industrial benchmarks and real enterprise workloads (abstract).
- Recommendations are evaluated on SQL Server (abstract).
- An LLM proposer with a measured outcome; the authors report that LLM recommendations vary a lot "both across invocations for the same query and across queries" (§9; the abstract says "high variance").

## In plain words

A database index is an extra, sorted copy of some of a table's columns that lets a query find rows without reading the whole table; index tuning means choosing which indexes to build for a set of queries. Tools such as Microsoft's Database Tuning Advisor (DTA) choose by asking the query optimizer to predict each query's cost, and the authors note that wrong predictions can lead to poor choices, sometimes to slower queries (§1). They ask how well an LLM (GPT-5, shown each query, the schema and the current execution plan) picks indexes against DTA, by real run time on SQL Server, on the public TPC-H benchmark and four real enterprise customer workloads (abstract, §1). Taking the best of five LLM answers, they report a configuration comparable to DTA's for approximately 67% of single-query workloads, and one at least 20% faster for 31% of queries (§1). But quality varies widely, and the worst answers can be far worse than DTA (§1). They present an evaluation study, plus a simple rule-based tuner distilled from the LLM's reasoning as a "proof-of-concept" (§1).

## Background and terms

**Terms to know:** [query optimizer](#/glossary/query-optimizer) · [optimizer cost estimate](#/glossary/optimizer-cost-estimate) · [cardinality estimation](#/glossary/cardinality-estimation) · [query plan and EXPLAIN](#/glossary/query-plan-and-explain) · [selectivity](#/glossary/selectivity) · [common table expression (CTE)](#/glossary/common-table-expression-cte) · [data contamination](#/glossary/data-contamination)

**The paper's own terms:**
- **index configuration**: a set of indexes, "a subset (a.k.a. a configuration) from the candidate indexes" (§2.2.1); the original configuration is the pre-existing indexes (§2.3.1).
- **"what-if" API**: an optimizer extension that estimates a query's cost under a given configuration without building the indexes (§2.2.1).
- **DTA's pipeline**: find indexable columns, generate candidate indexes, pick the subset with the lowest estimated cost within the constraints (§2.2.1); it searches per query, then per workload (§3).
- **best, worst, first, median response**: of the five GPT-5 answers per prompt (§3.1, §3.4, App. A.1); the authors "use the two terms GPT-5 and LLM interchangeably" (§2.3).
- **K**: the cap on the number of indexes in multi-query tuning (§5.1).
- **α (alpha)**: the rule-based tuner's threshold: a table gets an index only if its scans' estimated cost exceeds α times the plan's cost (§4.2).

**Missing glossary terms:**
- **key columns, included columns, covering index**: an index is sorted on its key columns, in order, so a lookup on them (a seek) avoids a full scan; included columns are only stored in it; a covering index holds every column the query needs from that table, so the table itself need not be read (the paper's terms, §2.2.1, §4.1–4.2).
- **query performance regression (QPR)**: a query that runs slower with the recommended indexes than before (used, not defined, in §1, §3.1).

**Builds on:**
- DTA and the "what-if" API (Chaudhuri and Narasayya), the baseline, called the "current state of the art (SOTA) in classic cost-based index tuning" (§2.2.1).
- The LLM index tuners λ-Tune, LLMIdxAdvis and MAAdvisor, whose evaluations, the authors say, used mainly open benchmarks and were "limited to PostgreSQL and comparison with simplified baselines" (§1).
- The tabular plan format follows [QO-Verify](#/papers/narasayya2026qoverify "Leveraging Query Optimizers to Verify the Soundness of LLM-based Query Rewrites for Real-World Workloads, and More! (2026)") (§2.3.1).

## Problem and setting

- **Question:** how effective LLM-driven index tuning is against DTA on SQL Server, on real enterprise workloads, judged by execution time rather than estimated cost (§1, §2.2.2).
- **Setting:** pre-trained LLMs "in an end-to-end setting, given only basic information about the database and workload" (§1); "Our goal is not to identify an optimal prompt" (§2.3.1).
- **Prompt:** the SQL text; the referenced tables with cardinalities, columns and pre-existing indexes, plus view definitions; and the estimated plan as a table, one row per physical operator with estimated cost and cardinality (§2.3.1, Fig. 1–2). Multi-query prompts concatenate this per query, uncompressed, and add the number of indexes allowed (§2.3.2, Fig. 3).
- **Models:** DeepSeek-R1, Qwen3, GPT-4o and GPT-5 were tried; all reported results use GPT-5, the best (§2.3), called five times per prompt; DTA once, "since it is deterministic" (§1).
- **Workloads (Tab. 1, §2.1):** TPC-H (a public decision-support benchmark) at scale factor 10, and four customer workloads, Real-D, Real-M, Real-R and Real-S, of analytical queries using CTEs and views over tables with "numerous pre-existing indexes that were manually created by human experts" (§2.1); 127 queries in all (App. A.1).
- **Measurement:** median of five isolated runs per query, each capped at 300 seconds; totals for multi-query workloads (§2.2.2).
- **Constraints:** none for the LLM on single queries; DTA's default storage limit is three times the database size (§3). Multi-query: K of 5, 10 or 20; Real-D's and Real-M's workloads are their 10 queries with the largest single-query GPT-5 gains, as all queries together exceed GPT-5's context window (§5.1).

## Approach

- **Comparison:** build each recommended configuration and run the queries; single-query analysis uses the best of five answers "to illustrate the best potential of LLM" (§3.1), then the worst (§3.4), first and median (App. A.1).
- **Reasoning analysis:** GPT-5 is asked to output its reasoning (Fig. 7). The authors summarize its rules of thumb: favor indexes that reduce costly scans, order key columns by plan cues (filters, joins, aggregates), use covering indexes when possible, and "ignore small table scans" (Key Finding 5, §4.1).
- **Rule-based tuner (Alg. 1, §4.2):** a deterministic tuner that reads only the original plan, building one covering index per table. A depth-first walk sums each table's scan costs, collects its referenced columns, and appends key columns in order of first appearance in seek, filter, join, group-by and order-by operators; tables whose scan cost is not above α times the plan cost get none. The aim: an index likely to be used to improve the current plan, and less likely to significantly change the join order (§4.2).
- **Integration with DTA:** add LLM-recommended indexes to DTA's candidate pool, leaving the rest of DTA unchanged (§6.1); or validate: build every recommended configuration, run, keep the fastest (§6.2).

## Results

- **Single queries:** the best of five "underperforms, matches, or substantially outperforms DTA across different sets of queries, each comprising a considerable fraction of our test cases" (Key Finding 1, §3.1, Fig. 4). The queries where it is at least 20% faster are "primarily those where DTA's recommendation is misled by inaccurate optimizer cost estimates" (§1). Anonymizing TPC-H's names gave similar results (§3.1).
- **Index use:** for single queries, plans use most LLM-proposed indexes, and in many cases the LLM proposes fewer than DTA (Key Finding 2, §3.2).
- **Cost estimates mislead:** where LLM indexes run faster, their estimated costs are "consistently higher" than DTA's (Key Finding 3, §3.3, Tab. 2), so DTA would not select them "even when they fall within the search space of DTA" (§3.3).
- **Variance:** worst answers "may significantly underperform DTA and, in many cases, lead to severe performance regressions" (Key Finding 4, §3.4). With a single unvalidated answer (the first or the median), more than half of the 127 queries run over 5% slower than with DTA, against about 30% for the best answer (App. A.1).
- **Rule-based tuner:** where DTA underperforms the LLM, it "produces better recommendations than DTA in approximately 60% of our test queries, and achieves performance comparable to or better than LLM in about 40% of all test cases" (Key Finding 6, §4.3, Fig. 8). Alone, with α of 0, it is "surprisingly effective" on single queries but "underperforms both on a substantial fraction of queries" (App. A.2.1).
- **Multi-query:** DTA gives "more stable and reliable improvements", but the LLM "can significantly outperform DTA" in some cases (Key Finding 7, §5.1, Fig. 9): Real-D with K of 5 or 10, and its best answers on Real-R; it is worse at every K on Real-M (§5.1).
- **Real-D case (K of 10):** the LLM favors indexes serving several queries, and none of its three most beneficial indexes were DTA candidates; adding its multi-query recommendations to DTA's pool improves DTA substantially, adding its single-query ones slows the workload (§5.2, Key Finding 8).
- **Real-M case:** two queries dominate run time, and the LLM's answers mostly miss them. With the costliest query alone, roughly 50% of 50 answers match or beat DTA on it; once the workload has four queries, below 5% do (§5.3, Fig. 11b). With plainly concatenated queries, the LLM "places less emphasis on the most costly queries" (Key Finding 9, §5.3).
- **Integration:** enriching DTA's candidates "does not consistently improve performance, and often leads to performance degradation" (Key Finding 10, §6.1, Tab. 3). Validation's cost is "often significantly higher than the cost of index tuning itself, largely due to the overhead of index creation" (Key Finding 11, §6.2, Fig. 12).

## Limits the authors state

- "These techniques have not been used in the production DTA studied in this paper" (recent DTA extensions, §2.2.1).
- TPC-H "may have been seen during GPT-5's training" (§3.1).
- For Real-D and Real-M, "including other less beneficial queries will further reduce the relative effectiveness of LLM" (§5.1).
- Rule-based tuner: "more experiments are required to evaluate whether this approach is effective across different prompts and models" (§1); GPT-5 showed no consistent key-column order (§4.2); Fig. 8 shows only queries where the LLM beats DTA (§4.3).
- Validation as in λ-Tune "incurs considerable overhead that is perhaps infeasible in practical industrial applications" (§8).

## Open problems and building blocks

  - Safe use: "realizing their potential in practice remains an open problem" (§1).
  - Less variance: distilled heuristics, fine-tuned models (§1); "Whether additional insights can be extracted and applied more systematically remains an open question" (§7).
  - Cheaper, less disruptive validation, built into tuning decisions (§1, §7).
  - Workload compression (shrinking a workload before tuning) for multi-query LLM tuning (§8).
- **Released:** Nothing stated.
- **To reuse it:** a context window large enough for the full prompts (GPT-5's one million tokens, §2.3.2); the optimizer's estimated plan per query (§2.3.1); GPT-5's average response time per query was 1.1–2.2 minutes across the workloads (§3.1). The rule-based tuner needs only the original plan (§4.2).

## On this site

- **Tags:** <span class="tags"><a class="tag" href="#/tags/dbtask">dbtask</a><a class="tag sub" href="#/tags/llm-misc">llm-misc</a></span>
