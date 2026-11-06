# QueryHouse: Cross-DBMS Differential Testing with LLM and Query Transpilation

**QueryHouse** · ESORICS 2026 (Springer LNCS, pp. 701–721)

Read: [PDF](https://hacking.kaist.ac.kr/pubs/2026/oh:queryhouse.pdf) · [DOI](https://doi.org/10.1007/978-3-032-38692-2_35)  
Code: [QueryHouse](https://github.com/queryhouse-2037/QueryHouse) · [QueryHouse-sqlglot](https://github.com/queryhouse-2037/QueryHouse-sqlglot)

<p class="notice">A summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Cross-DBMS differential testing for logic bugs: each generated test case is transpiled into the dialects of Oracle, MySQL, PostgreSQL, SQLite and MariaDB, run on all of them, and any difference goes to triage, as a bug if it contradicts official documentation, else as an undocumented inconsistency (§1, PDF p. 2).
- Base queries in SQLite syntax from Squirrel's IR-level mutation, with GPT-4o mutation when keyword coverage stagnates (§3.3, PDF pp. 7–8); a customized SQLGlot whose translations were checked by hand against DBMS documentation and whose rules were fixed and extended (§3.2, PDF p. 6; App. A.1, PDF pp. 16–17); outputs normalized and sorted before comparison (§3.4, PDF p. 9).
- Differential testing through a rule-based transpiler, where wrong translations are a named source of false positives (§3.2, PDF p. 6) and engine differences are split from bugs by documentation (§1, PDF p. 2); it reports valid@5 of 0.1633 with its transpiler, the share of test cases that run without error on all five engines (Tab. 3, PDF p. 13). DBMS testing with a translation core.

## In plain words

Database systems sometimes return wrong answers without an error. One common way to find such bugs rewrites a query into one whose result must match it in a known way on the same system. The authors argue that this can miss features that are broken outright, since both versions hit the same defect, and that vendors' differing versions of SQL push testers to target one system and one kind of bug (§1, §2.1, PDF pp. 2–4). QueryHouse instead runs each generated test on five systems (Oracle, MySQL, PostgreSQL, SQLite, MariaDB), translated into each one's SQL by a customized open-source translator, and flags any disagreement. Tests come from a rule-based mutator (a program that makes new tests by changing old ones), and GPT-4o is asked for new ones when the variety of SQL keywords in the tests stops growing. The authors report 11 previously unknown bugs, all confirmed by vendors, and 7 undocumented inconsistencies (abstract, PDF p. 1; §1, PDF p. 3). Three rewrite-based checkers, reimplemented by the authors and given the exact bug-triggering queries, detected none correctly (§5.2, PDF pp. 12–13). They present QueryHouse as "a novel automatic framework" (§1, PDF p. 2).

## Background and terms

**Terms to know:** [differential testing](#/glossary/differential-testing) · [metamorphic testing](#/glossary/metamorphic-testing) · [logical bug](#/glossary/logical-bug) · [test oracle](#/glossary/test-oracle) · [fuzzing](#/glossary/fuzzing) · [SQL dialect](#/glossary/sql-dialect) · [window function](#/glossary/window-function) · [transpiler](#/glossary/transpiler) (SQLGlot, "the open-source transpiler", §3.2, PDF p. 6)

**The paper's own terms:**
- **bug / inconsistency**: a difference between systems' results that contradicts official documentation is a bug; an undocumented difference is an inconsistency (§1, PDF p. 2).
- **SQL discrepancy problem**: vendors often deviate from the SQL standard, "intentionally or otherwise", so testing becomes "DBMS- and bug-specific" (§1, PDF p. 2).
- **sympathetic failure**: the rewritten query triggers the same defect as the original, so their results stay identical and a rewrite-based check sees nothing (§2.1, PDF p. 3).
- **symmetry-breaking oracle**: the authors' name for a bug check that avoids sympathetic failures; cross-system differential testing is theirs (§2.1–2.2, PDF pp. 3–4).
- **base query / adapted query**: a test case written once in SQLite syntax, and its translation for one target system (§3.2, PDF pp. 5–6).
- **IR-based mutation**: Squirrel's mutator, which edits an intermediate representation (IR, a structured internal form of the query) in two phases, structure-changing mutation and filling in valid values (§3.2, PDF pp. 6–7).
- **keyword coverage**: how many of a set of SQL keywords the generated queries contain, computed as the "number of newly introduced keywords divided by the total size of the keyword set"; taken from SemCont (§3.3, PDF pp. 7–8).
- **query validity, valid@k**: the share of test cases that run without syntax or semantic errors, and the share valid on at least k systems (§5.3, PDF p. 13).
- **QueryHouse−T, QueryHouse−L**: variants without the transpiler and without LLM mutation (§5.3, PDF p. 13).

**Builds on:**
- Squirrel (Zhong et al., CCS 2020, ref. [58]), a database fuzzer whose IR-based mutator is the baseline the Hybrid Mutator (QueryHouse's test generator) extends (§3.2, PDF pp. 6–7; §4, PDF p. 9).
- SQLGlot (Mao, ref. [34]), an open-source SQL parser and transpiler, customized here (§3.2, PDF p. 6; App. A.1, PDF pp. 16–17).
- SemCont (Liu et al., PVLDB 2024, ref. [32]), a tester of conformance to the SQL standard, whose keyword coverage metric QueryHouse adopts (§3.3, PDF p. 7).
- Cross-system differential testing, which the authors say they are "inspired by and extends": RAGS ([Massive Stochastic Testing of SQL](#/papers/slutz1998rags "Massive Stochastic Testing of SQL (1998)"), random statements run on several vendors' systems), SQLite's sqllogictest (a fixed query set checked against a reference system), SparkFuzz (Apache Spark against PostgreSQL) and DT² (transactions on three MySQL-compatible systems) (§7, PDF p. 15).

## Problem and setting

The question: can logic bugs that rewrite-based checks miss be found by comparing many systems, when their SQL differs (§1–2, PDF pp. 2–4)? The authors name three challenges: building bug oracles, dialect differences, and keeping complex queries valid on every system (§2.2, PDF p. 4).

- **Assumption behind the oracle:** "Given the maturity of DBMSs, at least one system is likely to produce correct outputs" (§2.2, PDF p. 4).
- **Systems:** for bug detection, Oracle Database 23ai, MySQL 8.4–9.1.0, PostgreSQL 17, SQLite 3.47.0–3.48.0 and MariaDB 11.6.2, the latest in late 2024 (§5, PDF p. 10).
- **What is generated:** SQLite-syntax test cases that avoid SQLite-specific features (e.g., `WITHOUT ROWID` tables, `PRAGMA` settings commands) and less widely supported ones (e.g., window frames with `GROUPS`) (§3.2, PDF p. 6); partitioning, `RETURNING` and full-text search are excluded "because of inconsistent support" (App. A.1, Tab. 5, PDF pp. 16–17).
- **What counts as equal:** outputs are normalized, data types formatted alike and rows sorted lexicographically, since the standard lets formatting and row order differ (§3.4, PDF p. 9). NULLs are not discussed beyond their sort order differing (§3.2, PDF p. 6).

## Approach

Four modules form a continuous loop (§3.1, Fig. 2, PDF pp. 4–5):

- **Hybrid Mutator** (§3.2–3.3, PDF pp. 6–9). Squirrel's IR-based mutator, extended with enhancements such as JSON support and better `FOREIGN KEY` validity, is the default mutator. It can often yield many variants with "only minor structural differences" (§3.3, PDF p. 7; Fig. 3). When keyword coverage doesn't grow for "a predefined number of consecutive mutator calls", GPT-4o (`gpt-4o-2024-08-06`) is prompted for a complex, diverse SQLite query, with few-shot examples and constraints such as banned constructs (§3.3, PDF p. 8; §4, PDF p. 9). Its output goes through the extended IR-based mutator, whose built-in parser discards invalid queries.
- **Transpiler** (§3.2, PDF pp. 5–6; App. A.1, PDF pp. 16–17). A customized SQLGlot parses each base query into a syntax tree and prints it in each target dialect. The authors found incorrect SQLGlot translations: the JSON operator `->` (syntactically correct, different behaviour), `INTEGER` (different sizes; Oracle's `NUMBER`, a type for real numbers), and a `RECURSIVE` keyword (marks a self-referencing named subquery in `WITH`) that made Oracle fail. Such mismatches can lead to false alarms. They checked translations by hand against official documentation, refined rules, excluded cases "without general solutions", and added syntax such as `FILTER` in window functions: 14 rules revised after reviewing 13 feature categories (Tab. 5).
- **Batch Executor** (§3.4, §4, PDF pp. 9–10). Each test creates its own tables, so systems are reset to a clean state; to cut reset cost (for Oracle, tied to user creation and deletion) it resets after a fixed batch (100 queries in the experiments) and numbers table and column names within a batch.
- **Result Analyzer** (§3.4, PDF p. 9). A normalizer, then a comparison; any difference goes to a further triage step that decides between bug and inconsistency (§3.1, PDF p. 5).

## Results

- **Bugs found** (§5.1, Tab. 1, PDF pp. 10–11): in a three-week campaign on three laptops, 11 confirmed logic bugs, in window functions (`FILTER`, `MAX`, and `LAG`/`LEAD`, which read rows at an offset), operator precedence (`BETWEEN`, `IN`), numeric overflow (`ROUND`, `SUBSTR`), constant parsing and `NATURAL JOIN`. Five were fixed, MariaDB changed its documentation for one, and five persisted "at the time of writing (early 2026)". The 7 inconsistencies are listed only in the repository (§5.1, PDF p. 10). The authors say "to our knowledge, prior work has identified only memory bugs in window functions [42], but no logical bugs" (§5.1, PDF p. 12).
- **Against rewrite-based checkers** (§5.2, Tab. 2, PDF pp. 12–13): NoREC (non-optimizing reference engine construction), TLP (ternary logic partitioning) and DQP (differential query plans), reimplemented from code and papers and extended to more features and dialects, were given each bug's exact triggering query, "assuming a favorable setting in which they have already discovered the problematic queries". No cell is a true positive: mostly both queries return the same wrong result; TLP's alarms fire on Bug 1's buggy and fixed versions alike, and, by a manual check, on Bug 9, which has no fixed version. The authors conclude QueryHouse "detects a fundamentally distinct class of bugs from existing methods".
- **Transpiler** (§5.3, Tab. 3, PDF p. 13; 24-hour runs, five repeats, averages): validity is higher with the transpiler on every system except SQLite (unchanged, as base queries are SQLite). valid@5 is 0.1633 against 0.0457 without it (+257.03%).
- **LLM mutation** (§5.3, Fig. 6, PDF pp. 13–14): final keyword coverage "slightly higher" than without it, 84.03% against 82.16%, and it rises faster. Most unreached keywords were excluded or system-specific (e.g., `TOP`).
- **LLM cost** (§5.3, PDF p. 14): over a 24-hour campaign, on average $1.12 of API cost and 1.68% of total runtime, which the authors read as "minimal cost and latency overhead".
- **New targets** (§6, Tab. 4, PDF pp. 14–15): adding MariaDB after the other four took under 60 lines of code, excluding client and build files, with no SQLGlot change, against Squirrel's per-system parser and rule work.

## Limits the authors state

- Results can differ under correct executions, so direct matching may give false alarms; the normalizer reduces them (§3.4, PDF p. 9).
- Documented design differences "can cause false positives", and "some are lesser-known and require care", e.g. Oracle silently discarding `TEMPORARY` table data on DDL (statements that change table definitions) because it commits implicitly before DDL (§5.1 "False Positives", PDF p. 12).
- SQLGlot transpiles "on a best-effort basis, often leaving unsupported syntax unchanged" (§3.2, PDF p. 6); unsupported cases without general solutions, and three features with inconsistent support, are excluded (§3.2, PDF p. 6; App. A.1, PDF pp. 16–17).
- The LLM may still produce excluded features "despite careful prompt engineering"; the parser filters invalid queries (§3.3, PDF pp. 8–9).
- Cross-system validity "is inherently constrained by shared features" (§5.3, PDF p. 13).
- Fixing SQLGlot precision for a new system "may require minor additional effort" (§6, PDF p. 14).
- The Oracle reset timing is "an incidental engineering observation in our specific test environment" (footnote 8, PDF p. 10).

## Open problems and building blocks

- **Open:** the authors "expect further improvements in transpiler support and LLM ability could increase coverage" (§5.3, PDF p. 14) and hope for "new directions in the DBMS testing community" (§8, PDF p. 16).
- **Released:** the artifact on GitHub (§1, PDF p. 3; Data Availability, PDF p. 16: "All source code and experimental artifacts"), with the full prompt template (§4, PDF p. 9), the inconsistencies (§5.1, PDF p. 10) and the list of confirmed bug reports (§6, PDF p. 14).
- **To reuse it:** Squirrel and SQLGlot as bases, and `gpt-4o-2024-08-06` (§4, PDF p. 9); per new system, "typically … only a small amount of code" (§6, PDF p. 14).
- **Beyond its domain:** the authors "expect" the transpiler and LLM mutation "can independently aid" memory- and performance-bug detectors by extending them to many systems (§7, PDF p. 16).

## On this site

- **Discussed in:** [Telling bad translations from legitimate engine differences](#/challenges/bad_translation_detection) · [SQL dialect translation](#/challenges/dialect_translation)
- **Tags:** <span class="tags"><a class="tag" href="#/tags/difftest">difftest</a><a class="tag" href="#/tags/method">method</a><a class="tag" href="#/tags/workload">workload</a><a class="tag sub" href="#/tags/dialect-translate">dialect-translate</a><a class="tag sub" href="#/tags/dsl-sql">dsl-sql</a><a class="tag sub" href="#/tags/llm-assist">llm-assist</a><a class="tag sub" href="#/tags/llm-gen">llm-gen</a></span>
