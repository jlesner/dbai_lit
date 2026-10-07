# Bridging the Procedural Code Gap: Agentic Database Migration with Execution-Grounded Validation

**AgentMigrate** · DBTest@SIGMOD 2026

Read: [PDF](https://dl.acm.org/doi/pdf/10.1145/3810991.3811630) · [DOI](https://doi.org/10.1145/3810991.3811630)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Agentic migration of Oracle stored procedures to PostgreSQL: translate, compile, execute, diff results, repair.
- Validation at three levels: compiles, executes, returns equivalent results.
- Executing is not being equivalent: it reports that a rule-based converter (AWS DMS SC, §5.1) executes far more often than it is right: only 20.7% result equivalence on SQL-ProcBench (abstract; Tab. 2).

## In plain words

Moving a database from Oracle to PostgreSQL means rewriting its stored procedures (programs kept inside the database), which the author calls among the most labor-intensive steps of database modernization (abstract, PDF p. 1). AgentMigrate, an LLM agent, translates, runs tests on both databases, compares results and repairs. On the 37 of 66 benchmark objects with result tests, 83.8% of its translations matched the original on every test, against 75.0% for one plain call to the same model and 20.7% for an AWS rule-based converter (abstract, PDF p. 1; §5.2, §5.5, PDF pp. 4–5). The author presents this as an improvement, and reports converting 89.5% of 187 objects an AWS tool had left in production (§6, PDF p. 6).

## Background and terms

**Terms to know:** [differential testing](#/glossary/differential-testing), [test oracle](#/glossary/test-oracle), [procedural code](#/glossary/stored-procedure-and-trigger).

**The paper's own terms:**
- **L0, L1, L2**: "each strictly stronger": the translation compiles on the target; runs without runtime errors on the tests; returns the source's results (§2, PDF p. 2).
- **object-level**: share of objects passing all tests; **test-level**: share of tests (§2, PDF p. 2).
- **CSR**: compilation success rate; the **procedural code gap** is its drop from queries to procedural objects (§4, PDF p. 3).
- **SA (Single-Agent)**: the evaluated AgentMigrate setup (§5.1, PDF p. 4).

**Builds on:**
- SQL-ProcBench, "the primary stored procedure benchmark", extended to Oracle PL/SQL (§1, PDF p. 1).
- Baselines: SQLGlot, an open-source rule-based SQL transpiler (§4, PDF p. 3), and DMS SC, AWS DMS (Database Migration Service) Schema Conversion (§5.1, PDF p. 4).
- Agentic approaches such as SWE-agent ([SWE-agent](#/papers/yang2024sweagent "SWE-agent: Agent-Computer Interfaces Enable Automated Software Engineering (2024)")) and ReAct ([ReAct](#/papers/yao2022react "ReAct: Synergizing Reasoning and Acting in Language Models (2023)")) (§1, PDF pp. 1–2).

## Problem and setting

- **Correct** means matching results on every test (§2, PDF p. 2), within tolerances for numeric precision, NULLs and types (§3, PDF p. 3).
- **Scoring:** a pytest suite "generated using Claude Code" and hand-reviewed, not the agent's own tests (§5.5, PDF p. 5).
- **Data:** SQL-ProcBench, 66 Oracle objects with hand-verified PostgreSQL ground truth, 45 with L1 and 37 with L2 tests; Synthetic Real-World, 10 objects of 500–1000 lines that Claude Sonnet 4.6 generated from the TPC-DS decision-support schema (§5.1, §5.5, PDF pp. 3–5). The compilation study adds queries from Spider ([Spider](#/papers/yu2018spider "Spider: A Large-Scale Human-Labeled Dataset for Complex and Cross-Domain Semantic Parsing and Text-to-SQL Task (2018)")) and BIRD ([BIRD](#/papers/li2023bird "Can LLM Already Serve as A Database Interface? A BIg Bench for Large-Scale Database Grounded Text-to-SQLs (2023)")), [text-to-SQL](#/glossary/text-to-sql) benchmarks (Tab. 1, PDF p. 3).
- **Approaches:** SA runs Claude Sonnet 4.6 on Amazon Bedrock (AWS's model service), temperature 0, up to 3 iterations; single-shot is one tool-free call; DMS SC is the rule-based converter "the customer in §6 originally tried" (§5.1, PDF pp. 3–4).

## Approach

- **Loop:** translate, compile, execute, diff, repair (§1, PDF p. 1; Fig. 1, PDF p. 2), through MCP (Model Context Protocol, a standard LLM tool interface) servers that run SQL on each database, handle files and spawn sub-agents (§3, PDF p. 2).
- **Dependencies** (Alg. 1, PDF p. 3): converted first by recursive sub-agents; cycles are deployed as stubs, then filled in (§3, PDF p. 2).
- **Three phases** (Alg. 2, PDF p. 3): record the source's results on generated boundary-value tests before translating; convert and repair on compile errors; run the tests on PostgreSQL and compare.

## Results

- **Compilation** (§4, Tab. 1, PDF p. 3): SQLGlot reaches 99.9–100% CSR on queries but 3.8% on Oracle PL/SQL and 31.2% on T-SQL UDFs (user-defined functions); single-shot 88.5–100% throughout.
- **SQL-ProcBench** (Tab. 2, PDF p. 4), L0 / L1 / L2: SA 93.9 / 77.8 / 83.8%; single-shot 93.6 / 72.7 / 75.0%; DMS SC – / 63.4 / 20.7%; ground truth L2 97.3%, its one failure "an inherent cross-platform difficulty" (§5.5, PDF p. 5).
- **Synthetic Real-World** (Tab. 3, PDF p. 4): SA 80 / 70 / 50%; single-shot 60 / 0 / 0%; DMS SC 70.5 / 0 / 0%.
- **Complexity** (Fig. 4, PDF p. 4), test-level L2: SA falls 88.2 → 58.3%, single-shot 79.3 → 16.7%.
- **Errors** (§5.4, PDF p. 5): DMS SC's dominant failure, "40% of 15 failing objects", is turning procedures into functions; collection-type mapping (choosing among several valid PostgreSQL forms for Oracle's TABLE OF types) is "the hardest category".
- **Production** (§6, PDF p. 6): 89.5% of the 187 objects AWS SCT (Schema Conversion Tool) left.

## Limits the authors state

- Features without PostgreSQL equivalents need manual work; "semantic equivalence does not guarantee performance equivalence" (§7, PDF p. 6).
- "The self-correction loop is not universal"; validation covers only Oracle to PostgreSQL (§7, PDF p. 6).
- SQL-ProcBench is "of moderate complexity"; the Synthetic set "was LLM-generated"; results "may vary slightly across runs" (§7, PDF p. 6).
- Single-shot's ~250× lower cost covers only the translation call: not like-for-like (§5.5, PDF p. 5).

## Open problems and building blocks

- **Open** (§7, PDF p. 6): collection-type rules, "the largest remaining error category"; ablation against other agent scaffolds "to attribute the gain to specific loop ingredients"; more dialect pairs; tests from production query logs.
- **Released:** "All artifacts are publicly available" (§1, PDF p. 1): the Synthetic dataset, prompt, evaluation framework and test suites (§7, PDF p. 6).
- **To reuse it:** Claude Sonnet 4.6, the Strands Agents SDK (an agent framework), live databases on both sides (§4, §5.1, PDF pp. 3–4); median cost $2.50–15.33 per object (Tab. 5, PDF p. 5); only the rules, MCP servers and definition extractor are dialect-specific (§7, PDF p. 6).

## On this site

- **Discussed in:** [Telling bad translations from legitimate engine differences](#/challenges/bad_translation_detection) · [SQL dialect translation](#/challenges/dialect_translation)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/dialect-difftest">dialect-difftest</a><a class="tag sub" href="#/tags/dialect-translate">dialect-translate</a><a class="tag sub" href="#/tags/harness-sql">harness-sql</a><a class="tag sub" href="#/tags/llm-gen">llm-gen</a><a class="tag sub" href="#/tags/llm-method">llm-method</a></span>
