# ReSequel: Robust LLM-assisted Query Rewriting and Optimization using Templatization and Sampling

**ReSequel** · PVLDB 19(10) · 2026

Read: [PDF](https://arxiv.org/pdf/2606.20853) · [arXiv](https://arxiv.org/abs/2606.20853) · [DOI](https://doi.org/10.14778/3828612.3828639)  
Code: [ReSequel](https://github.com/CoDS-GCS/ReSequel)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- An outer optimization layer that rewrites query templates with LLMs.
- Variants are verified only on sampled data, then ranked and cached.
- LLM-written template rewrites, reused across query instances, with sample-based verification that the authors say "does not provide a formal guarantee of semantic equivalence" (§5); it reports SQLSolver answering *Equal* for at most 27% of its rewrites on any workload (Tab. 4, §7.2). Turning them into DBMS rewrite rules is future work (§9).

## In plain words

Database systems rewrite SQL queries into faster forms with the same answer, using hundreds to thousands of rewrite rules. The authors argue that such rule sets are hard to maintain, brittle in the order rules fire, and miss chances on "messy" real-world queries, while earlier LLM rewriters face a huge search space, unreliable checking and poor use of what the database knows about its data (abstract, §1–2). ReSequel sits on top of an unchanged database system. It groups queries that differ only in their constants into templates, asks an LLM for several rewritten versions of each template, guided by table definitions, statistics and hand-written hints, keeps the versions that return the original's results on small samples of the data, and for a query picks whichever candidate, the original included, finishes first on a sample (§1, §6.3). The authors report workload speedups of up to 16x over the unmodified systems and 22x over LLM-based rewriters, as best cases over eight benchmarks and three database systems (abstract). They state that the sample check gives no formal guarantee of equivalence (§5).

## Background and terms

**Terms to know:** [query rewriting and rewrite rules](#/glossary/query-rewriting-and-rewrite-rules) · [query equivalence](#/glossary/query-equivalence) · [integrity constraint](#/glossary/integrity-constraint) · [correlated subquery](#/glossary/correlated-subquery) · [NULL and three-valued logic](#/glossary/null-and-three-valued-logic) · [SAT and SMT solvers](#/glossary/sat-and-smt-solvers) · [cardinality estimation](#/glossary/cardinality-estimation) (Tab. 1) · [cost-based optimization](#/glossary/cost-based-optimization) (rule-based rewriting runs before it, §1, §2.1) · [phase ordering](#/glossary/phase-ordering) (an incorrect order "may cause a rewrite to destroy the source pattern required by a more impactful rewrite", §2.1; Fig. 2 caption, §9)

**The paper's own terms:**
- **outer optimization layer**: a system on top of an existing database system that changes the SQL it is sent, leaving its optimizer as it is (abstract, §3).
- **template**: a query with its constants masked (strings `$$$`, numbers `###`), its syntax normalized and variable-length value lists collapsed into one placeholder; queries with one template share rewrites (§3.2, §4). The constants are the **query parameters**; putting them back is **query reconstruction** (§6.3).
- **messy queries**: queries "originating from SQL-generating applications, text-to-SQL tools, or inexperienced users" (§2.2); Fig. 2 classifies them per benchmark.
- **template-specific rules**: rewrite guidance in the prompt from three sources: Apache Calcite's rules ([Apache Calcite](#/papers/begoli2018calcite "Apache Calcite: A Foundational Framework for Optimized Query Processing Over Heterogeneous Data Sources (2018)"), an optimizer framework), rules derived from metadata, and "nearly 50" hand-crafted examples (§3.3, §7.3).
- **downsampling**: building several small sample databases per group of templates, to check rewrites and time them (§5).
- **Template Cache / Query Cache**: per template, the rewritten versions that passed the sample check; per query and parameter values, the chosen rewrite (§3.2, §6.1).
- **Top-1 selection**: for a query not yet in the Query Cache, running the original and every cached version, filled with its constants, in parallel on a sample and keeping the first to finish (§6.3).
- **Groups 1–3**: benchmarks with one query per template (TPC-H, Stats/Stats-CEB, DSB, Public BI), about 15% sharing (JOB), and many per template (StackOverflow, IMDB) (§7.1).

**Builds on:**
- Rule-based rewrite engines, Starburst's ([Starburst query rewrite](#/papers/pirahesh1992starburst "Extensible/Rule Based Query Rewrite Optimization in Starburst (1992)")) and Calcite's ([Apache Calcite](#/papers/begoli2018calcite "Apache Calcite: A Foundational Framework for Optimized Query Processing Over Heterogeneous Data Sources (2018)")): their limits motivate the work (§1, §2.1).
- The baselines (§7.1): LLM-R2 ([LLM-R2](#/papers/li2024llmr2 "LLM-R2: A Large Language Model Enhanced Rule-Based Rewrite System for Boosting Query Efficiency (2024)")), which has an LLM select Calcite rules and needs training on query plans; R-Bot ([R-Bot](#/papers/sun2024rbot "R-Bot: An LLM-based Query Rewrite System (2025)")), one of two systems "that use LLMs to apply rules"; LearnedRewrite ([LearnedRewrite](#/papers/zhou2021learnedrewrite "A learned query rewrite system using Monte Carlo tree search (2021)")), which searches rewrites with a cost-estimation model and Monte Carlo tree search (a randomized search that tries rule sequences and favours those that paid off).
- SQLSolver ([SQLSolver](#/papers/ding2023sqlsolver "Proving Query Equivalence Using Linear Integer Arithmetic (2023)")), which "determines query equivalence using linear integer arithmetic and existing solvers" (§8), that is, by reducing it to formulas over whole numbers that a solver decides; it is the comparison for the sample check (§7.1).
- GenRewrite ([GenRewrite](#/papers/liu2024genrewrite "GenRewrite: Query Rewriting via Large Language Models (2026)")), which has an LLM write natural-language rewrite rules from seed queries and reuses them (§8).

## Problem and setting

- **Question:** produce a semantically equivalent, faster query; formally, the output is the equivalent candidate with the lowest run time on the downsampled database, no slower there than the original (§2.3).
- **"Correct" in practice:** a version is admitted when its results on the samples are identical to the original's, with the constants of the query that triggered the rewrite (§6.1, Algorithm 3). Set, bag or ordered comparison: not discussed; order-sensitive and order-insensitive queries share a template and are separated at reconstruction and Top-1 selection (§4).
- **Scope:** read-only queries, executed independently (§6.4); what SQLGlot (an open-source SQL parser) parses in the dialects of PostgreSQL, MySQL and DuckDB, an embedded analytical database (§4, §7.1). Outer joins, correlated subqueries and window functions stay unchanged in templates (§4). Samples are chosen to include rare values and NULLs, and primary and foreign keys steer sampling (§5); NULLs in the result comparison: not discussed.
- **LLMs:** Gemini-2.5-pro, and OSS-120B, an open-weight model served by Groq Cloud (§7.1).
- **Benchmarks** (§7.1, Tab. 2): TPC-H and DSB, synthetic decision-support workloads (DSB "skewed and highly correlated", §7.2); Stats/Stats-CEB, a cardinality-estimation benchmark; Public BI, the 100 longest-running queries of a business-intelligence benchmark; JOB, the Join Order Benchmark on movie data; IMDB, 13,646 queries in 79 templates; StackOverflow, 1,192 queries in 60 templates from SQLStorm, an LLM-generated query workload, made with GPT-4o-mini (§7.2).

## Approach

- **Two layers (§3, Fig. 3).** Online, cached rewrites are reused; offline, new templates are rewritten and checked.
- **Templatization (§4, Algorithm 1, Figs. 5–6).** SQLGlot parses each query; constants are extracted and unnecessary conditions removed; the query is normalized (output columns sorted, joins alphabetical, aliases replaced), values masked, and `IN`, `OR` chains and `LIKE ANY` lists generalized to one placeholder. The authors state that only constants and variable-length predicate lists are generalized.
- **Downsampling (§5, Algorithm 2).** Templates are clustered when their table sets differ by at most two tables. Per cluster, up to a set number of sample databases: a uniform random sample of the "central table" (most foreign-key links), then matching rows of linked tables, so joins don't come out empty.
- **Prompting (§6.2, Tab. 1).** Each prompt holds the masked template, one optimization task (e.g. "data skipping through prefiltering", a join-cardinality formula), example rules and the relevant schema, indexes and statistics, and asks for several versions. Tab. 1's example outputs include index creation and session settings.
- **Checking and ranking (§6.1, §6.3, Algorithms 3–4).** Each version, filled with the triggering query's constants, runs on the samples beside the original; versions with identical results enter the Template Cache. For a later query of the template not found in the Query Cache, Top-1 selection fills the cached versions with its constants, adds the original, and keeps the first to finish on a sample in the Query Cache. The authors write that "deterministic components validate" the LLM's output, so "model evolution mainly affects the diversity of rewritten variants, not their ranking or correctness" (§3.3).
- **Testing the check (§5).** They remove rows from samples and rerun both queries, keeping predicate matches "to avoid empty query results".

## Results

- **Setup.** Baselines: the host systems on unmodified queries, LLM-R2, R-Bot, LearnedRewrite; R-Bot ran only on Groups 1–2 and LLM-R2 only on JOB, TPC-H and DSB, since they rewrite one query at a time and LLM-R2 needs training (§7.1).
- **Headline:** up to 16x over native systems, 22x over LLM-based systems (abstract).
- **Many queries per template** (Fig. 8, Gemini-2.5-pro, 10% samples): on StackOverflow and IMDB, workload time improved by up to 2.45x on PostgreSQL, 4.81x on MySQL and 3.95x on DuckDB against the unmodified queries (§7.2).
- **Against the baselines:** Tab. 3 lists ReSequel as rewriting every query and the baselines only part; the baselines "show limited success in rewriting workloads of queries while preserving query equivalence" (§7.2). Differences from their published results are put down to the LLMs used instead of GPT-4, "indicating strong sensitivity" (§7.2).
- **Against a prover** (Tab. 4): SQLSolver answers Equal for 27% of TPC-H rewrites, 8% and 7% on Stats and Stats-CEB, 0% on the other five, Unknown otherwise, taking up to 5,764 minutes (Public BI). The authors conclude that most LLM-generated queries fall "outside the recognized AST patterns" (abstract syntax trees SQLSolver handles) (§7.2).
- **Rule sources** (JOB, Fig. 20, §7.3): all together 5.64x over PostgreSQL, Calcite rules alone 4.4x, metadata-derived rules alone 2x.
- **Sample check:** Gemini yields more validated variants than OSS-120B, which gets weaker speedups (§7.3, Tab. 5). With 1–5 samples, "in most cases, two (sometimes three) samples are sufficient to correctly verify the entire workloads" (§7.3, Fig. 19).
- **Overheads** (Fig. 11, §7.3): building the extended data catalog (the catalog plus column statistics and inferred dependencies, §6.1) dominates; templatization is negligible.

## Limits the authors state

- "Downsampling does not provide a formal guarantee of semantic equivalence or exact runtime behavior on the full database"; several samples and the original as fallback mitigate it (§5).
- Read-only workloads, independent execution; downsampling "becomes more challenging for queries that span the entire database"; queries with side effects "are not explicitly handled" (§6.4).
- Ranking on samples "may yield different execution plans" (§6.3).
- "unrecognized constructs cannot be generalized into semantically equivalent templates": support depends on SQLGlot (§4).
- Public BI shows "limited improvement": its size limits sample diversity, masking over-generalizes range predicates, and self-join hints sometimes hurt (§7.2).
- On a mid-sized StackOverflow template "nearly half of the queries slow down due to aggregations", as Top-1 on a 10% sample misses the best variant (§7.3, Fig. 16).
- Empty results are "difficult to verify" (§7.3).
- Metadata-derived rules sometimes hurt, and example rules sometimes "introduce greater slowdowns" (§7.3).

## Open problems and building blocks

- **Open:** "Reusing optimized templates across workloads as well as the discovery of new built-in rewrites" (§3.2); "Broad and extensible support of SQL dialects" (§4); "generating DBMS-specific rewrite rules from verified LLM-generated rewrites" (§9). Named bottleneck: building the extended data catalog (§7.3).
- **Released:** "The source code, data, and/or other artifacts have been made available" (PVLDB Artifact Availability, PDF p. 1).
- **To reuse it:** a hosted LLM; PostgreSQL, MySQL or DuckDB; SQLGlot; profiling queries over the full data (§7.1).

## On this site

- **Discussed in:** [Comparing LLM methods under noise](#/challenges/method_comparison_under_noise) · [Sourcing realistic, hard query pairs](#/challenges/query_pair_sourcing) · [Discovering new rewrite rules](#/challenges/rewrite_rule_discovery) · [Can a memory across problems be checked before it is reused?](#/challenges/verified_memory) · [Verified query speedups](#/challenges/verified_query_speedup) · [SQL features that verifiers don't cover](#/challenges/verifier_coverage_gaps)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/llm-gen">llm-gen</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/rewrite-llm">rewrite-llm</a><a class="tag sub" href="#/tags/scaling-sql">scaling-sql</a></span>
