# Horizon: Robust Checks for SQL Migration Using LLMs

**Horizon** · PVLDB 18(12) 2025 (demo)

Read: [DOI](https://doi.org/10.14778/3750601.3750646)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Microsoft's LLM-based schema and code migration, with checks for syntactic completeness and functional equivalence.
- Combines traditional database tools with LLMs and iterative refinement.
- Equivalence is tested on two random rows per table, topped up by LLM-written rows for each script whose result is empty or NULL, up to "a predefined maximum number of attempts per script" (§2.2, Alg. 1); LLM judges run only after migration, since in the loop they can "cause regression spirals" (§2.2).

## In plain words

Switching database systems means rewriting tables, views and stored programs in the new system's SQL dialect. Rule-based vendor tools leave gaps; LLMs filling them make subtle mistakes (§1, PDF pp. 1–2). Microsoft's demo paper describes Horizon: the rule tool translates what it can, an LLM finishes the script, and checks (parser, compiler, a guard against needless edits, running both scripts on partly LLM-generated test data) feed errors back. The authors call it "the first comprehensive approach for practical and effective SQL schema migration using LLMs" (abstract, PDF p. 1). On production-derived scripts the rule tool can't fully translate, with GPT-4o and the parser check, they report equivalent translations rising from 5% (rules alone) to 76% (§3, PDF p. 4).

## Background and terms

**Terms to know:** [query equivalence](#/glossary/query-equivalence) · [decidable and undecidable](#/glossary/decidable-and-undecidable) · [LLM-as-a-judge](#/glossary/llm-as-a-judge) · [stored procedure and trigger](#/glossary/stored-procedure-and-trigger)

**The paper's own terms:**
- **schema migration** (or "SQL migration"): recreating tables, views, stored procedures and other metadata in the target system, functionally equivalent (§1, PDF p. 1).
- **SSMA**: Microsoft's rule-based SQL Server Migration Assistant; its **partial migration** marks warnings and errors with predefined comment patterns (§2.2, PDF pp. 2–3).
- **Error, Warn + Error, Warn**: Fig. 3's script categories (PDF p. 4), undefined; §3 says warning (+ error) cases "typically indicate dialect compatibility issues" (PDF p. 4).
- **regression spirals**: what LLM judges "may also cause" during migration (§2.2, PDF p. 3), undefined; our reading: feedback rounds that worsen the script.

**Builds on:**
- Vendor rule-based migration tools [5, 8, 12] (§1 C3, PDF pp. 1–2), and minimal test-data generation [2], behind the two-rows choice (§2.2, PDF p. 3).
- Equivalence checking, undecidable in general [1] (§1 C2, PDF p. 1): constraint-solver methods [2, 14] (programs that search for values meeting logical conditions; 14 is [QED](#/papers/wang2024qed "QED: A Powerful Query Equivalence Decider for SQL (2024)")), called "time-intensive" for the loop, and LLM-SQL-Solver [15] ([LLM-SQL-Solver](#/papers/zhao2023llmsqlsolver "LLM-SQL-Solver: Can LLMs Determine SQL Equivalence? (2025)"), an LLM equivalence judge), which hallucinated on complex procedural constructs in their work.

## Problem and setting

Reliable LLM-based migration within rule-based tooling (§1 C1–C3, PDF pp. 1–2). The authors present migration "from any, to any SQL dialect" (§1, PDF p. 2); the running example is Oracle to T-SQL (§2.2, PDF p. 2). Equal results on the same data "can establish the correctness of migration for that data" (§2.2, PDF p. 3). [Set](#/glossary/set-semantics) or [bag semantics](#/glossary/bag-semantics) (whether duplicate rows count), row order and NULLs in the comparison: not discussed.

## Approach

- **Pipeline (§2.1, Fig. 1, PDF p. 2):** rules migrate what they can; the LLM changes only unmigrated parts; checks feed errors back until all pass or an iteration limit; a human reviews.
- **Checks (§2.2, PDF pp. 2–3)**, each returning pass or a list of errors:
  - target parser and compile-only mode (e.g. T-SQL's `NOEXEC ON`), catching syntax and binding errors;
  - spurious edits (LLM changes to parts the rule engine translated correctly): the LLM first names editable parts; any such edit fails (threshold 0);
  - execution on data from **Algorithm 1** (PDF p. 3): two random rows per table; an LLM adds rows for each script whose result is empty or NULL, up to a set number of attempts per script;
  - LLM checks: a harmful-input classifier before migration; after migration only, a 1–5 equivalence score, found more reliable than a yes/no verdict.
- **Demo (§3, Fig. 2, PDF pp. 3–4):** users pick dialects, a dataset (D1, a procedural benchmark [6]; D2, standard benchmarks such as TPC-DS (decision-support queries); D3, anonymized production test-suite scripts unseen in pretraining) or their own scripts, the checks, models and temperature; outputs are migrated scripts, diffs and a JSON or web-page report.

## Results

- Fig. 3 (§3, PDF p. 4), GPT-4o with the T-SQL parser on D3 (74 Error, 9 Warn + Error, 30 Warn scripts), "% Semantically Equivalent Translations" for rule engine → + LLM → + parser: Error 5 → 74 → 76; Warn + Error 11 → 11 → 33; Warn 33 → 40 → 47.
- The authors claim "up to 70% improvements for the cases that SSMA is unable to translate fully", and "significantly higher % of correct translations" with a parser, "especially for warning (+ error) cases" (§3, PDF p. 4).
- C1 (§1, PDF p. 1): GPT-4o, o1 and o3-mini translate `MOD(mycol, 10)` in IBM's Informix dialect to `mycol % 10`, wrong for non-integer `mycol` per the authors; shown mismatched outputs, they fix it.
- Horizon "supports all schema object types" (abstract, PDF p. 1).

## Limits the authors state

- Procedures and triggers "are currently unsupported" by the execution check, because of side effects (§2.2, PDF p. 3).
- Algorithm 1 "may sometimes fail to generate valid test data even after multiple attempts" (§2.2, PDF p. 3).
- Customers often won't share data; random data often yields empty or NULL results (§2.2, PDF p. 3).
- The zero spurious-edit threshold blocks useful LLM optimizations (§2.2, PDF p. 3).
- LLM judges may cause regression spirals inside the loop (§2.2, PDF p. 3).

## Open problems and building blocks

- **Open:** preserving schema permissions; migrating non-SQL procedures such as Python functions; scaling fully LLM-based migration to large schemas, possibly with small language models (§4, PDF p. 4); instrumenting procedure execution (§2.2, PDF p. 3).
- **Released:** "We make our LLM prompts available, and audience will be able to view and edit them during the demonstrations"; "We will make available Python scripts to generate charts" (§3, PDF p. 4).
- **To reuse it:** target parser and compiler, an LLM, a sandbox database, optionally a rule engine.

## On this site

- **Discussed in:** [Telling bad translations from legitimate engine differences](#/challenges/bad_translation_detection) · [SQL dialect translation](#/challenges/dialect_translation)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/dialect-difftest">dialect-difftest</a><a class="tag sub" href="#/tags/dialect-translate">dialect-translate</a><a class="tag sub" href="#/tags/harness-sql">harness-sql</a><a class="tag sub" href="#/tags/llm-assist">llm-assist</a><a class="tag sub" href="#/tags/llm-gen">llm-gen</a><a class="tag sub" href="#/tags/llm-method">llm-method</a></span>
