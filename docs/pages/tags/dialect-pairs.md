# Tag <span class="tag sub big">dialect-pairs</span>

A subtag of <a class="tag" href="#/tags/dialect">dialect</a>

<a class="tag" href="#/tags/dialect">dialect</a> ∩ <a class="tag" href="#/tags/pairs">pairs</a>.

<!-- filter -->

## Challenges

- **[SQL dialect translation](#/challenges/dialect_translation)**: Translate queries between engines (PostgreSQL, MySQL, SQLite, DuckDB, SQL Server, …) without changing their meaning.
- **[Sourcing realistic, hard query pairs](#/challenges/query_pair_sourcing)**: Checkers and benchmarks need many query pairs that are *nearly* equivalent. Where do they come from, and how are they labelled?

## Papers

- **[UniQL](#/papers/gao2026uniql "UniQL: Towards Dialect-Universal Benchmarking for Text-to-SQL (2026)")**: Towards Dialect-Universal Benchmarking for Text-to-SQL (preprint 2026). Cross-dialect text-to-SQL: questions aligned with executable SQL in many dialects over shared schemas and data (abstract). <span class="links">[🔎 Summary](#/papers/gao2026uniql) · [PDF](https://arxiv.org/pdf/2606.08018) · [arXiv](https://arxiv.org/abs/2606.08018) · [Code](https://github.com/JerryGao818/UniQL)</span> <span class="tags"><a class="tag sub" href="#/tags/dialect-difftest">dialect-difftest</a><a class="tag sub" href="#/tags/dialect-pairs">dialect-pairs</a><a class="tag sub" href="#/tags/dialect-translate">dialect-translate</a><a class="tag sub" href="#/tags/harness-sql">harness-sql</a><a class="tag sub" href="#/tags/llm-gen">llm-gen</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/nl2sql-eval">nl2sql-eval</a><a class="tag sub" href="#/tags/rules-discover">rules-discover</a></span>
- **[DLBench](#/papers/lin2025dlbench "DLBench: A Comprehensive Benchmark for SQL Translation with Large Language Models (2025)")**: A Comprehensive Benchmark for SQL Translation with Large Language Models (ASE 2025). A benchmark for LLM SQL dialect translation from SQLite and other sources into six engines (MySQL, PostgreSQL, MariaDB, MonetDB, DuckDB, ClickHouse) (§I, §IV). <span class="links">[🔎 Summary](#/papers/lin2025dlbench) · [PDF](https://ieeexplore.ieee.org/stampPDF/getPDF.jsp?tp=&arnumber=11334627) · [DOI](https://doi.org/10.1109/ase63991.2025.00076) · [Code](https://github.com/dlbenchll/DLBench)</span> <span class="tags"><a class="tag sub" href="#/tags/dialect-pairs">dialect-pairs</a><a class="tag sub" href="#/tags/dialect-translate">dialect-translate</a><a class="tag sub" href="#/tags/llm-gen">llm-gen</a></span>
- **[PARROT](#/papers/zhou2025parrot "PARROT: A Benchmark for Evaluating LLMs in Cross-System SQL Translation (2025)")**: A Benchmark for Evaluating LLMs in Cross-System SQL Translation (NeurIPS 2025). A cross-system SQL translation benchmark from open-source benchmarks and real services, across many systems. <span class="links">[🔎 Summary](#/papers/zhou2025parrot) · [PDF](https://arxiv.org/pdf/2509.23338) · [arXiv](https://arxiv.org/abs/2509.23338) · [Code](https://github.com/OpenDataBox/PARROT)</span> <span class="tags"><a class="tag sub" href="#/tags/dialect-difftest">dialect-difftest</a><a class="tag sub" href="#/tags/dialect-pairs">dialect-pairs</a><a class="tag sub" href="#/tags/llm-assist">llm-assist</a><a class="tag sub" href="#/tags/llm-gen">llm-gen</a></span>

## Projects

- **[DLBench](https://github.com/dlbenchll/DLBench)**: implements [DLBench](#/papers/lin2025dlbench "DLBench: A Comprehensive Benchmark for SQL Translation with Large Language Models (2025)")
- **[PARROT](https://github.com/OpenDataBox/PARROT)**: implements [PARROT](#/papers/zhou2025parrot "PARROT: A Benchmark for Evaluating LLMs in Cross-System SQL Translation (2025)")
- **[UniQL](https://github.com/JerryGao818/UniQL)**: implements [UniQL](#/papers/gao2026uniql "UniQL: Towards Dialect-Universal Benchmarking for Text-to-SQL (2026)")
