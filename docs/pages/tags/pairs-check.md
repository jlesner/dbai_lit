# Tag <span class="tag sub big">pairs-check</span>

A subtag of <a class="tag" href="#/tags/pairs">pairs</a>

Pairs built or used to **evaluate SQL equivalence checkers**.

<!-- filter -->

## Papers

- **[VeriEQL](https://arxiv.org/pdf/2403.03193 "VeriEQL: Bounded Equivalence Verification for Complex SQL Queries with Integrity Constraints (2024)")**: Bounded Equivalence Verification for Complex SQL Queries with Integrity Constraints (OOPSLA 2024). Bounded equivalence verification of complex SQL with integrity constraints. <span class="links">[🔎](#/papers/he2024verieql "Summary") · [PDF](https://arxiv.org/pdf/2403.03193) · [arXiv](https://arxiv.org/abs/2403.03193) · [DOI](https://doi.org/10.1145/3649849) · [Code: VeriEQL](https://github.com/VeriEQL/VeriEQL) · [Code: VeriEQL-artifact-evaluation](https://zenodo.org/records/10795614)</span> <span class="tags"><a class="tag sub" href="#/tags/bounded-smt">bounded-smt</a><a class="tag sub" href="#/tags/cex-smt">cex-smt</a><a class="tag sub" href="#/tags/pairs-check">pairs-check</a></span>
- **[Evaluating SQL Understanding in Large Language Models](https://arxiv.org/pdf/2410.10680 "Evaluating SQL Understanding in Large Language Models (2025)")** (EDBT 2025). Tests LLMs on syntax error detection, missing-token identification, query performance prediction, query equivalence and query explanation, with labelled datasets built from known workloads (abstract). <span class="links">[🔎](#/papers/rahaman2024sqlunderstanding "Summary") · [PDF](https://arxiv.org/pdf/2410.10680) · [arXiv](https://arxiv.org/abs/2410.10680) · [DOI](https://doi.org/10.48786/EDBT.2025.74) · [Code](https://github.com/AnanyaRahaman/LLMs_SQL_Understading)</span> <span class="tags"><a class="tag" href="#/tags/dbtask">dbtask</a><a class="tag sub" href="#/tags/judge-sql">judge-sql</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/pairs-check">pairs-check</a></span>
- **[Can the Rookies Cut the Tough Cookie? Exploring the Use of LLMs for SQL Equivalence Checking](https://arxiv.org/pdf/2412.05561 "Can the Rookies Cut the Tough Cookie? Exploring the Use of LLMs for SQL Equivalence Checking (2024)")** (preprint, 2024). A harder, realistic equivalence benchmark; most LLMs are biased towards "equivalent", GPT-4 excepted (§5). <span class="links">[🔎](#/papers/singh2024sqlequiquest "Summary") · [PDF](https://arxiv.org/pdf/2412.05561) · [arXiv](https://arxiv.org/abs/2412.05561) · [Code](https://github.com/rajatb115/LLMs-for-SQL-Equivalence-Checking)</span> <span class="tags"><a class="tag sub" href="#/tags/judge-sql">judge-sql</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/pairs-check">pairs-check</a></span>

## Projects

- **[Argus](https://github.com/joyemang33/Argus)**: implements [Argus](#/papers/mang2025oracles "Automated Discovery of Test Oracles for Database Management Systems Using LLMs (2025)")
- **[calcite](https://github.com/apache/calcite)**: implements [Apache Calcite](#/papers/begoli2018calcite "Apache Calcite: A Foundational Framework for Optimized Query Processing Over Heterogeneous Data Sources (2018)")
- **[Cosette](https://github.com/uwdb/Cosette)**: implements [Cosette](#/papers/chu2017cosette "Cosette: An Automated Prover for SQL (2017)"), [HoTTSQL](#/papers/chu2016hottsql "HoTTSQL: proving query rewrites with univalent SQL semantics (2017)"), [UDP](#/papers/chu2018udp "Axiomatic foundations and algorithms for deciding semantic equivalences of SQL queries (2018)")
- **[LLM-SQL-Solver](https://github.com/ZhaoFuheng/LLM-SQL-Solver)**: implements [LLM-SQL-Solver](#/papers/zhao2023llmsqlsolver "LLM-SQL-Solver: Can LLMs Determine SQL Equivalence? (2025)")
- **[LLMs_SQL_Understading](https://github.com/AnanyaRahaman/LLMs_SQL_Understading)**: implements [Evaluating SQL Understanding in…](#/papers/rahaman2024sqlunderstanding "Evaluating SQL Understanding in Large Language Models (2025)")
- **[Logos](https://github.com/WindOctober/Logos)**: implements [Logos](#/papers/ke2026logos "Logos: Certified Order-Sensitive SQL Rewrites with Mechanized Semantics and LLM Guidance (2026)")
- **[ParSEval](https://github.com/sfu-db/ParSEval)**: implements [ParSEval](#/papers/chen2025parseval "ParSEval: Plan-aware Test Database Generation for SQL Equivalence Evaluation (2025)")
- **[polygon-artifact-evaluation](https://zenodo.org/records/15059866)**: implements [Polygon](#/papers/zhao2025polygon "Polygon: Symbolic Reasoning for SQL using Conflict-Driven Under-Approximation Search (2025)")
- **[polygon-sql](https://github.com/polygon-sql/polygon)**: implements [Polygon](#/papers/zhao2025polygon "Polygon: Symbolic Reasoning for SQL using Conflict-Driven Under-Approximation Search (2025)")
- **qed-solver**: implements [QED](#/papers/wang2024qed "QED: A Powerful Query Equivalence Decider for SQL (2024)")
- **[spes](https://github.com/georgia-tech-db/spes)**: implements [SPES](#/papers/zhou2020spes "SPES: A Symbolic Approach to Proving Query Equivalence Under Bag Semantics (2022)")
- **[SQLEquiQuest](https://github.com/rajatb115/LLMs-for-SQL-Equivalence-Checking)**: implements [Can the Rookies Cut…](#/papers/singh2024sqlequiquest "Can the Rookies Cut the Tough Cookie? Exploring the Use of LLMs for SQL Equivalence Checking (2024)")
- **[SQLSolver](https://github.com/SJTU-IPADS/SQLSolver)**: implements [SQLSolver](#/papers/ding2023sqlsolver "Proving Query Equivalence Using Linear Integer Arithmetic (2023)")
- **[VeriEQL](https://github.com/VeriEQL/VeriEQL)**: implements [VeriEQL](#/papers/he2024verieql "VeriEQL: Bounded Equivalence Verification for Complex SQL Queries with Integrity Constraints (2024)")
- **[VeriEQL-artifact-evaluation](https://zenodo.org/records/10795614)**: implements [VeriEQL](#/papers/he2024verieql "VeriEQL: Bounded Equivalence Verification for Complex SQL Queries with Integrity Constraints (2024)")
- **[WeTune](https://github.com/WeTune/WeTune-code)**: implements [WeTune](#/papers/wang2022wetune "WeTune: Automatic Discovery and Verification of Query Rewrite Rules (2022)")
