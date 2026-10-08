# MIRA: Evidence-Verified Repair Memory for Text-to-SQL Correction

**MIRA (Memory-Item Reuse and Adaptation)** · preprint 2026

Read: [PDF](https://arxiv.org/pdf/2608.06950) · [arXiv](https://arxiv.org/abs/2608.06950)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- A corrector for SQL from a text-to-SQL agent treated as a black box (§2.1) that reuses past confirmed corrections on the same database without weight updates: it splits each past correction into separate repair memory items, retrieves items for a new query, activates only those the question, the SQL and database observations support, and adapts them to the current SQL (abstract; §3.1).
- Offline, an LLM proposes repairs of the old query until one matches the confirmed correction's result on the database (§3.2.1); each group of edits becomes an item only if a "semantic judge" (a model call by our reading; Tab. 2b counts offline chat calls), given database facts and an optional read-only probe, accepts it (§3.2.2). Online, the solver may run one read-only probe and a rewrite is returned only if it parses, executes and changes the result (§3.3.2–3.3.3). GPT-5 in every LLM stage; first-attempt SQL from CHESS, DeepEye-SQL and OmniSQL-32B on the corrected BIRD Mini-Dev set of [Pervasive Annotation Errors Break…](#/papers/jin2026annotation "Pervasive Annotation Errors Break Text-to-SQL Benchmarks and Leaderboards (2026)") and on ScienceBenchmark, against MAGIC, TK-Boost, SQLFixAgent and SHARE (§4.1).
- Repair memory on SQL with no sound check on what is stored: the authors note that the result match "does not prove equivalence over all database instances" (§3.2.1), and admission rests on that judge (§3.2.2). They report that it turned 18 of 1,130 initially correct test queries into incorrect ones (§4.2; Tab. 1), the regressions that coarse experience reuse causes being their motivation (§1).

## In plain words

Text-to-SQL systems still produce SQL that runs but answers wrongly. MIRA (Memory-Item Reuse and Adaptation), a pluggable corrector, reuses past confirmed corrections on the same database without weight updates. The authors' motivation: earlier methods can fold several fixes into one lesson, which may add noise, "yielding limited gains or even causing regression on queries that were already correct" (§1). MIRA splits corrections into separate fixes, checks each retrieved fix against the question, query and database, and adapts it. With GPT-5, they report accuracy gains over three systems' first-attempt SQL of 16.53 and 8.78 percentage points on the text-to-SQL benchmarks BIRD and ScienceBenchmark (scientific databases), breaking 18 of 1,130 correct queries (§1; §4.1–4.2). They present it as improving on existing correctors.

## Background and terms

**Terms to know:** [text-to-SQL](#/glossary/text-to-sql) · [execution accuracy](#/glossary/execution-accuracy) · [gold query](#/glossary/gold-query) · [abstract syntax tree (AST)](#/glossary/abstract-syntax-tree-ast) · [query equivalence](#/glossary/query-equivalence) · [automated program repair](#/glossary/automated-program-repair) · [self-correction](#/glossary/self-correction)

**The paper's own terms:**
- **historical correction**: a past question with its incorrect SQL and "confirmed corrected SQL", on the same database (§2.2).
- **repair unit**: a group of dependent edits that a "semantic judge" accepts as fixing one required behavior (§3.2.2).
- **memory item**: a stored repair unit: a semantic contract (e.g. when it applies, required behavior, what to preserve), a structural signature (the edits, the wrong SQL form), a target local check (the database observation showing the error) and source support (§3.2.3).
- **current SQL**: the upstream system's query; a **successful repair** makes an incorrect one correct, a **regression** a correct one incorrect (§2.1–2.2).

**Builds on:**
- Three corrector groups: self-correction, training-based, and experience-based, e.g. MAGIC, which distills past error traces into self-correction guidelines (§1; §4.1).
- Generate-and-validate program repair (Le Goues et al.), which repair recovery parallels (§3.2.1).
- Jin et al.'s corrected BIRD Mini-Dev, an official subset of BIRD's ([BIRD](#/papers/li2023bird "Can LLM Already Serve as A Database Interface? A BIg Bench for Large-Scale Database Grounded Text-to-SQLs (2023)")) development set ([Pervasive Annotation Errors Break…](#/papers/jin2026annotation "Pervasive Annotation Errors Break Text-to-SQL Benchmarks and Leaderboards (2026)") §1), with fixed annotations (§4.1).

## Problem and setting

- **Question:** can past corrections on a database fix new queries without corrupting correct ones (§1; §2.2)? The corrector sees the question with its "benchmark-provided task evidence" (in BIRD, an annotated hint per question, [BIRD](#/papers/li2023bird "Can LLM Already Serve as A Database Interface? A BIg Bench for Large-Scale Database Grounded Text-to-SQLs (2023)") §3.3), the database, the current SQL and the permitted history; the upstream system is a black box; gold SQL is used only for scoring (§2.1; §4.1).
- **Correct** means matching the gold query's result under each benchmark's official evaluator; "a query whose correctness cannot be established by execution is counted as incorrect" (§4.1). NULLs, set or bag semantics: not discussed.
- **Data:** the corrected BIRD Mini-Dev (498 queries, 11 databases) and the ScienceBenchmark development set (299 queries, three databases), with first-attempt SQL from the text-to-SQL systems CHESS, DeepEye-SQL and OmniSQL-32B: six settings. Per database, about 25% of queries go to training at random, the rest to test (1,785 queries) (§4.1).
- **Models:** `gpt-5-2025-08-07` in every stage using a general-purpose LLM; the baselines SQLFixAgent (retrieved repair examples with multi-agent correction) and SHARE (a trained refinement model) keep their own models (§4.1).

## Approach

- **Offline, Repair Memory Construction (§3.2, Fig. 3).** The repair model (an LLM, like the semantic judge and solver; chat calls, Tab. 2b) rewrites the old incorrect query in rounds, with execution feedback, within a budget, until its result matches the confirmed correction's (§3.2.1). Comparing the two ASTs yields add, remove and replace edits, grouped by dependency; each group is reverted alone and accepted by the semantic judge, given database facts, the result contrast and optionally a read-only probe, only when the question and facts support it (§3.2.2).
- **Online, Repair Memory Reuse and Adaptation (§3.3).** Items are retrieved by question-embedding similarity and by matching the current SQL's AST against each item's structural keys, built from its incorrect SQL form, schema elements and minimum context (§3.2.3; §3.3.1). The solver, which makes the final keep-or-rewrite decision, activates an item only when the question requires its behavior and the current SQL shows its recorded error, judged with database observations and possibly one probe (§3.3.2). It binds activated items to the current SQL and merges them into one rewrite, returned only if it passes mechanical checks (e.g. it parses as one read-only query, executes, changes the result); otherwise the current SQL is kept (§3.3.3).

## Results

Against MAGIC, TK-Boost (iterative feedback on each [common table expression (CTE)](#/glossary/common-table-expression-cte), run as "TK-Boost (adapted)"), SQLFixAgent and SHARE (§4.1), the authors report:
- **Accuracy:** overall accuracy rises from 63.31% to 76.92%, MAGIC next at 72.66% (Tab. 1). MIRA improves all six settings, highest in five; in ScienceBenchmark–CHESS MAGIC is higher (§4.2).
- **Repairs against regressions:** 261 of 655 incorrect queries repaired and 18 of 1,130 correct ones broken, against 247 and 80 for MAGIC (Tab. 1; Fig. 4). On ScienceBenchmark, SQLFixAgent and SHARE fall below the first-attempt SQL (§4.2).
- **Cost:** 4,779 model calls, against 31,654 for TK-Boost and 2,365 for MAGIC (Tab. 2a).
- **Ablation** (371 BIRD–DeepEye test queries only): the full method repairs 42 and breaks 3; storing whole correction pairs: 29 and 10; without evidence-verified activation: 40 and 14; without local adaptation: 34 and 12 (§4.4; Tab. 3).
- Most successful repairs use one memory item; some combine several (§4.5; Fig. 5).

## Limits the authors state

- The result match behind memory "does not prove equivalence over all database instances" (§3.2.1).
- "Avoiding task-specific parameter updates does not eliminate the cost of memory construction and inference" (§4.3).

## Open problems and building blocks

- **Open:** None stated.
- **Released:** Nothing stated.
- **To reuse it:** confirmed corrections on the same database, in advance (§2.2); database access for execution and probes (§3.2–3.3); an SQL parser and an embedding for retrieval (§3.2.2; §3.3.1); GPT-5 in the paper's runs (§4.1).

## On this site

- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/harness-promptopt">harness-promptopt</a><a class="tag sub" href="#/tags/harness-sql">harness-sql</a><a class="tag sub" href="#/tags/judge-sql">judge-sql</a><a class="tag sub" href="#/tags/llm-gen">llm-gen</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/nl2sql-misc">nl2sql-misc</a><a class="tag sub" href="#/tags/promptopt-context">promptopt-context</a></span>
