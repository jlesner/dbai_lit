# Tag <span class="tag big">workload</span>

Query or data generators for testing or benchmarking, with no equivalence pairs: benchmark kits and random query generators.

<!-- filter -->

## Papers

- **[DSB](#/papers/ding2021dsb "DSB: a decision support benchmark for workload-driven and traditional database systems (2021)")**: a decision support benchmark for workload-driven and traditional database systems (PVLDB 14(13) 2021). TPC-DS adapted for workload-driven systems: skewed, correlated data and new join-heavy templates. <span class="links">[🔎](#/papers/ding2021dsb "Summary") · [DOI](https://doi.org/10.14778/3484224.3484234) · [Code](https://github.com/microsoft/dsb)</span> <span class="tags"><a class="tag" href="#/tags/workload">workload</a></span>
- **[S3Eval](https://arxiv.org/pdf/2310.15147 "S3Eval: A Synthetic, Scalable, Systematic Evaluation Suite for Large Language Models (2024)")**: A Synthetic, Scalable, Systematic Evaluation Suite for Large Language Models (NAACL 2024). Evaluates LLMs by SQL execution: given a randomly generated table and a random SQL query, the model must return the execution result (PDF §1). <span class="links">[🔎](#/papers/lei2023s3eval "Summary") · [PDF](https://arxiv.org/pdf/2310.15147) · [arXiv](https://arxiv.org/abs/2310.15147) · [Code](https://github.com/lfy79001/S3Eval)</span> <span class="tags"><a class="tag" href="#/tags/dbtask">dbtask</a><a class="tag" href="#/tags/workload">workload</a><a class="tag sub" href="#/tags/llm-misc">llm-misc</a></span>
- **[Massive Stochastic Testing of SQL](https://www.vldb.org/conf/1998/p618.pdf "Massive Stochastic Testing of SQL (1998)")** (VLDB 1998). Generates random SQL statements and runs each one on several vendors' DBMSs, comparing row counts and a checksum of the results (§2). <span class="links">[🔎](#/papers/slutz1998rags "Summary") · [PDF](https://www.vldb.org/conf/1998/p618.pdf)</span> <span class="tags"><a class="tag" href="#/tags/reduce">reduce</a><a class="tag" href="#/tags/workload">workload</a><a class="tag sub" href="#/tags/dialect-difftest">dialect-difftest</a></span>

## Projects

- **benchmarks-tpc**
- **[dsb](https://github.com/microsoft/dsb)**: implements [DSB](#/papers/ding2021dsb "DSB: a decision support benchmark for workload-driven and traditional database systems (2021)")
- **[S3Eval](https://github.com/lfy79001/S3Eval)**: implements [S3Eval](#/papers/lei2023s3eval "S3Eval: A Synthetic, Scalable, Systematic Evaluation Suite for Large Language Models (2024)")
- **[tpcc-mysql](https://github.com/memsql/tpcc-mysql)**
- **tpcc-postgres**
- **[tpcds-kit](https://github.com/databricks/tpcds-kit)**
- **[tpch-kit](https://github.com/gregrahn/tpch-kit)**
