# ACME: Automated Clause Mapping Engine for Testing Emerging Database Systems

**ACME** · FSE 2026 (PACMSE)

Read: [PDF](https://dl.acm.org/doi/pdf/10.1145/3797134) · [DOI](https://doi.org/10.1145/3797134)  
Code: [ACME](https://github.com/YuanchengJiang/ACME)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- An LLM maps emerging-DBMS clauses to equivalent relational SQL so the two engines can be tested differentially (abstract, §3).
- Mappings are tested by execution, not proven (footnote 6).
- Cross-engine differential testing through clause translation (<a class="tag" href="#/tags/difftest">difftest</a>, <a class="tag" href="#/tags/dialect">dialect</a>); arXiv 2501.01236 is its earlier version without LLMs.

## In plain words

Newer, specialized database systems, such as time-series and streaming ones, are often less mature than relational databases, which the authors say makes them "more prone to logic bugs and internal errors" (abstract, PDF p. 1): wrong answers, and crashes or exceptions. Comparing answers with a mature relational database is a natural check, but the newer systems add their own clauses and give some shared ones a different meaning, so many queries fail on one side or legitimately differ. ACME asks an LLM to write translation rules, called clause mappings, into standard SQL, keeps rules that pass trial queries on both systems, and generates query pairs whose results should agree. With PostgreSQL as the reference, testing four such systems found 59 previously unknown bugs, 17 of them wrong-answer bugs; 52 fixed and 5 confirmed by vendors (abstract, PDF p. 1). The authors present ACME as "a novel and practical approach that extends the scope of differential testing" (§1, PDF p. 2), with differential testing effective "even when using local models or a limited online token budget" (abstract, PDF p. 1).

## Background and terms

**Terms to know:** [differential testing](#/glossary/differential-testing) · [test oracle](#/glossary/test-oracle) · [metamorphic testing](#/glossary/metamorphic-testing) · [SQL dialect](#/glossary/sql-dialect) · [NULL and three-valued logic](#/glossary/null-and-three-valued-logic) · [query plan](#/glossary/query-plan-and-explain) · [fuzzing](#/glossary/fuzzing) · [delta debugging](#/glossary/delta-debugging) (reduces test cases before reporting, §5.1, PDF p. 12)

**The paper's own terms:**
- **emerging database systems**: "database engines introduced within the past decade that target specialized workloads and exhibit sustained adoption growth" (§2, PDF p. 5), e.g. time-series systems for time-indexed data (QuestDB, TDEngine) and streaming systems for real-time updates (RisingWave) (§2, PDF pp. 5–6).
- **internal errors** and **logic bugs**: a query causing "unexpected aborts, exceptions, or crashes", and bugs "found through discrepancies flagged by the differential testing" (§5.1, PDF p. 12).
- **shared** and **non-shared clauses**: clauses whose syntax and meaning agree in both systems, and those that differ (§3 "Intuition", PDF p. 6); "common clauses" "share existing syntax but yield different semantic results" (§1, PDF p. 2).
- **clause mapping**: a rule that transforms a differing clause "into SQL-equivalent forms" (§3, PDF p. 6), written for common clauses as a syntax-tree rewrite in the format of SQLGlot, a Python SQL parser (§3, PDF p. 8), and for new clauses as a Python function (Fig. 3, PDF p. 7).
- **test queries**: "minimal SQL queries that check the semantics of clauses with the corresponding expected results" (§1, PDF p. 2).
- **PG success rate**: "the percentage of mapped queries accepted by PostgreSQL" (§5.4, PDF p. 17).

**Builds on:**
- Differential testing, including RAGS [45] ([Massive Stochastic Testing of SQL](#/papers/slutz1998rags "Massive Stochastic Testing of SQL (1998)")), a 1998 tool that "compared query results across different systems": "Our work extends this line of research" (§7, PDF pp. 19–20).
- Ternary Logic Partition (TLP) [42], a metamorphic oracle splitting a query by whether a condition is true, false or null, in the testing tool SQLancer [43]: "the state-of-the-art test oracle", compared against (§1, PDF p. 3; §5.3, PDF p. 16).
- Unicorn [50], a crash-oracle fuzzer for time-series databases, the "only one (non-public) existing work on testing emerging database systems" in the authors' view; discussed, not run (§5.3, PDF p. 16).

## Problem and setting

- **Question:** "whether an automated and effective testing strategy can be devised for diverse emerging database systems, each with distinct syntax and semantics" (§1, PDF p. 2).
- **Assumption:** emerging systems "can be viewed as extensions of relational database systems"; a discrepancy "indicates a logic bug in the emerging system, assuming correctness in the mature reference system" (§1, PDF p. 2).
- **Systems:** QuestDB, TDEngine, RisingWave and CrateDB (a distributed SQL database; the paper doesn't describe it), chosen for "increasing popularity and similarity to standard SQL syntax"; the evaluation "focuses primarily on QuestDB" (§5, PDF p. 11). Reference: PostgreSQL 14.0 (§5.1, PDF p. 11).
- **Data and queries** (§4, PDF pp. 10–11): three random tables per round, including special values such as null; queries mix shared and mapped clauses with sub-queries, set operations and window functions. Data-modifying statements are "out of the scope of this paper" (footnote 17, PDF p. 16).
- **What counts as a bug:** "semantically equivalent query pairs produce identical results across the emerging and relational database systems. Any discrepancy flags a potential logic bug" (§4, PDF p. 11); internal errors come from heuristics that separate unexpected exceptions from valid ones such as feature-not-supported errors. How result rows are compared (order, duplicates) is not discussed.
- **NULLs:** a difference to map: QuestDB treats null "as a distinct value" (§3 (ii), PDF p. 9).

## Approach

- **Two phases** (§3, PDF pp. 6–7): an LLM (e.g. GPT-4o) builds candidate mappings through structured prompts; the mappings then generate "semantically equivalent, but syntactically varied query pairs" for differential testing.
- **Workflow** (Fig. 3, PDF p. 7): an LLM proposes mappings and test queries from the SQL standard and the systems' documentation; requests are made "on the fly whenever differential testing encounters unsuccessful queries" (§8, PDF p. 20).
- **Prompt** (§3, PDF pp. 7–8): given the failing query, its error and the last failed translation, the LLM returns a Python `transform(query)` function and a validation query.
- **Validation** (§3, PDF p. 8): mapped queries run on both systems; failures go back to the LLM with the error messages, and ACME "retries until the correct validation or the maximum attempt limit is reached".
- **Example mappings** (Tab. 1 and §3 (i)–(v), PDF pp. 9–10): null in an IN list becomes a CASE WHEN returning null for a null subject; `sample by 1h`, which aggregates per time period, becomes a GROUP BY on the extracted hour; `latest on` (most recent row per key) becomes a join with a window-function maximum; type aliases, such as QuestDB's string type `symbol` to `varchar` (§5.2, PDF p. 15). RisingWave's tumble and hop windows become sub-queries (§3, PDF p. 10).
- **Authors' observations:** "completeness of clause mappings is not needed; we found partial mappings provide substantial benefits" (§3, PDF p. 6); the patterns recur across time-series and streaming systems, "suggesting the approach generalizes beyond any single database system category" (§3, PDF p. 10).

## Results

- **Bugs** (§5.1, Tab. 2, PDF p. 12): over three months of intermittent testing, 59 previously unknown bugs (17 logic, 42 internal errors), 52 fixed and 5 confirmed; 6 in TDEngine, 4 in RisingWave and 3 in CrateDB, with "comparatively less testing effort than for QuestDB" (§5, PDF p. 11).
- **Mappings and bugs** (§5.2, PDF p. 15): by the authors' manual analysis, "7 of them are detected with the assistance of clause mappings", and "Without type mappings, ACME will miss most identified bugs".
- **Mappings and query plans** (§5.2, Fig. 4, PDF p. 15): against differential testing without mappings, ACME "covers 14,707 additional unique query plans, representing an improvement of approximately 20% after 24 hours of testing".
- **Mappings and query success** (§5.2, PDF pp. 15–16): success rates "exhibit significant variations under different configurations", with instances of 0% when type mappings were off, because table initialization failed.
- **Against TLP** (§5.3, PDF p. 16): in "a manual and best-effort analysis" with hand-built partitions, for 17 bug-inducing test cases "to which test oracles could be applied, TLP failed to reveal any of these bugs"; the authors trace this to root causes in clauses such as `over(partition by)` (window functions, which compute over groups of related rows), join and union, which partitioning conditions don't affect (Listing 10). §1 words it as "17 logic bugs that SQLancer was unable to find" (PDF p. 3).
- **Coverage** (§5.3, Tab. 3, PDF p. 17): over 24 hours on QuestDB, ACME covers more program instructions than SQLancer at every checkpoint.
- **LLM mappings** (§5.4, Tab. 4, PDF pp. 17–18): over 1,000 queries, the PG success rate is 0% without mappings and 35.5% with hand-written type and null mappings, against, at 10 / 50 attempts, 64.8% / 69.9% for GPT-5.2, 56.0% / 60.0% for GPT-4o, 40.6% / 62.9% for the open-weight Qwen3-Coder-30B and 36.6% / 51.5% for the open-weight Qwen2.5-Coder-7B.
- **Ablation** (§5.4, PDF p. 18): with Qwen2.5-Coder-7B, turning off validation and re-prompting drops the PG success rate "from 42.9% to 34.8%, falling below even the heuristic baseline", "primarily due to invalid SQL syntax in unvalidated mappings".
- **False alarms** (§6, PDF p. 19): "only 3 false alarms out of 55 confirmed bugs while developing and running ACME".

## Limits the authors state

- "we only test for equivalence in the context of certain query transformations and executions" (footnote 6, PDF p. 8).
- "some incorrect mappings may initially pass the validation phase and later surface as false alarms in corner cases" (§3, PDF p. 8).
- Human effort remains "in query generation, result analysis, and validation of complex clause mappings" (§6, PDF p. 18).
- "some fragile mappings may persist, especially when interacting with untested clauses", and "certain mappings may remain infeasible even after multiple attempts" (§6, PDF p. 19).
- "manual inspection is still necessary to maintain a minimal false-alarm rate, particularly when using small-to-medium-scale models" (§6, PDF p. 19).
- The prompts "are empirically effective but not optimized"; performance "may vary across different database system versions, LLM updates, and query contexts" (§6, PDF p. 19).
- Covering all emerging systems is "challenging" (§5, PDF p. 11).

## Open problems and building blocks

- **Open:** "More principled prompt engineering techniques, such as few-shot examples, chain-of-thought reasoning, or retrieval-augmented generation, could be integrated into ACME" (§6, PDF p. 19). Testing emerging systems "remains a largely unexplored area, where the primary challenge lies in developing a scalable testing approach" (§8, PDF p. 20).
- **Released:** the ACME tool (footnote 4, PDF p. 4).
- **To reuse it:** a SQL-like emerging system, a relational reference (PostgreSQL 14.0, §5.1, PDF p. 11), an LLM, frontier or local (§5.4, PDF pp. 17–18), and one personal computer (i7-14700, 32 GB RAM, RTX 2060), on which "ACME can detect all confirmed or fixed bugs within six hours" (§5, PDF p. 11).

## On this site

- **Discussed in:** [Telling bad translations from legitimate engine differences](#/challenges/bad_translation_detection) · [SQL dialect translation](#/challenges/dialect_translation)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/dialect-difftest">dialect-difftest</a><a class="tag sub" href="#/tags/dialect-translate">dialect-translate</a><a class="tag sub" href="#/tags/harness-sql">harness-sql</a><a class="tag sub" href="#/tags/llm-assist">llm-assist</a><a class="tag sub" href="#/tags/llm-gen">llm-gen</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/rules-discover">rules-discover</a></span>
