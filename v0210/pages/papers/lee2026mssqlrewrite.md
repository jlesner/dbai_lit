# Verified LLM-Based Query Rewriting for Microsoft SQL Server

**Verified LLM-Based Query Rewriting…** · PVLDB 19(12) 2026 (demo)

Read: [PDF](https://www.vldb.org/pvldb/vol19/p4594-narasayya.pdf) · [DOI](https://doi.org/10.14778/3827998.3828074)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- SSMS extension: an anytime loop of LLM rewrite, QO-Verify, then timed execution.
- Hint skipping, duplicate-plan detection and timeout reduction avoid wasted executions.
- Propose-and-verify deployed for speedups: a rewrite is timed only after QO-Verify accepts it (Alg. 1); the authors call QO-Verify's median verification time (≈0.85 s) acceptable for offline tuning (§3.2).

## In plain words

Rewriting slow SQL queries into faster ones with the same answers is one way to tune them. LLMs can propose rewrites but cannot guarantee equal answers, and finding a fast one may mean running many candidates (§1, PDF p. 1). This demo paper presents a Microsoft SQL Server tool that loops: ask an LLM for a rewrite, prove it equivalent with QO-Verify, their earlier check built on the database's own [optimizer](#/glossary/query-optimizer), then time it, cutting off runs that cannot help. In its one worked example, a 20-second query gets a proved rewrite "over 98%" faster (§2.1, PDF p. 2). They write "To the best of our knowledge this is the first tool of its kind" (abstract, PDF p. 1).

## Background and terms

**Terms to know:** [query rewriting and rewrite rules](#/glossary/query-rewriting-and-rewrite-rules) · [query equivalence](#/glossary/query-equivalence) · [query optimizer](#/glossary/query-optimizer) · [memo](#/glossary/memo) · [transformation and implementation rules](#/glossary/transformation-and-implementation-rules) · [query plan and EXPLAIN](#/glossary/query-plan-and-explain) · [query hint](#/glossary/query-hint) · [common table expression (CTE)](#/glossary/common-table-expression-cte)

**The paper's own terms:**
- **QO-Verify**: the check of [15]; it answers Yes if it can prove two queries equivalent, Unknown otherwise (§3.1, PDF p. 3).
- **SSMS**: SQL Server Management Studio, "a popular GUI tool used extensively by DBAs and database developers" (§1, PDF p. 1); the tool extends it. DBA: database administrator.

**Missing glossary terms:**
- **anytime algorithm**: one that "can be stopped at any moment and still return the best solution it has found so far, with solution quality monotonically improving the longer it runs" (§3.1, PDF p. 3).

**Builds on:**
- QO-Verify [15] ([QO-Verify](#/papers/narasayya2026qoverify "Leveraging Query Optimizers to Verify the Soundness of LLM-based Query Rewrites for Real-World Workloads, and More! (2026)")), built into the tool as a library (§3.1–3.2, PDF p. 3).
- The LLM rewriters LITHE [5] ([LITHE](#/papers/dharwada2025lithe "LITHE: A Query Rewrite Advisor using LLMs (2026)")) and GenRewrite [12] ([GenRewrite](#/papers/liu2024genrewrite "GenRewrite: Query Rewriting via Large Language Models (2026)")), whose prompts the tool's are based on (§3.3, PDF p. 4).
- SQL Server's Query Hint Recommendation Tool [14], which the tool "significantly broadens" with LLM rewriting and verification (§4, PDF p. 4).
- The equivalence provers Cosette [3] ([Cosette](#/papers/chu2017cosette "Cosette: An Automated Prover for SQL (2017)")) and QED [20] ([QED](#/papers/wang2024qed "QED: A Powerful Query Equivalence Decider for SQL (2024)")), which the authors say fail to verify complex queries that QO-Verify handles (§1, PDF p. 1).

## Problem and setting

- **Question:** how to recommend LLM rewrites that are proved equivalent and fast enough within a time budget (§1, PDF p. 1).
- **Inputs:** a SQL query, a minimum improvement in execution time (e.g. 50%) and a tuning-time budget (e.g. 300 s) (§2, PDF p. 2).
- **Correct** means QO-Verify returns Yes; **fast enough** means a measured time meeting the minimum (§3.1, PDF p. 3).
- **Scope:** SQL Server only; the authors say the memo encodes "NULL handling, outer joins, aggregation, and correlated subqueries" ([NULLs](#/glossary/null-and-three-valued-logic), joins that keep unmatched rows, [correlated subqueries](#/glossary/correlated-subquery)) (§3.2, PDF p. 3).

## Approach

- **Algorithm 1 (§3.1, PDF p. 3):** run the original for a baseline time (a step that "can potentially be skipped" if a past time exists). Set the timeout to the time a rewrite must beat, (1 − M/100) × baseline for a minimum improvement of M%; a faster rewrite lowers it to its own time. Loop until time or rewrites run out: get the next LLM rewrite; skip a hint that cannot change the original's plan; skip a rewrite whose plan was already seen; skip it unless QO-Verify says Yes; run it with the timeout and keep the fastest.
- **QO-Verify (§3.2, PDF p. 3):** the optimizer builds a memo for each query; a logical expression (what to compute, not how) common to both implies equivalence, "Since each transformation rule is known to be semantics preserving". The authors call it "a sound equivalence test" ([sound](#/glossary/soundness-and-completeness): whatever it calls equivalent is).
- **Prompts (§3.3, PDF p. 4):** General, CTE, SubQ (shared or similar expressions in subqueries) and a new QHint (SQL Server query hints), each asking for an equivalent, significantly faster rewrite and a rationale, given table row counts and the original's executed plan with estimated and actual row counts. Default model GPT-5.2; users can choose others.
- **Interface (§2, PDF p. 2):** best verified rewrite, rationale, alternatives with status, and options restricting rewrite classes.

## Results

One example and design claims.
- **Example (§2.1, Fig. 2, PDF p. 2):** a StackOverflow dataset [9], budget 300 s, minimum 50%. Only the third and fifth rewrites, RW03 and RW05, run; the others were not verified. RW03 is equivalent but not fast enough; RW05 improves "over 98%" on the 20 s original (Fig. 2: 20094 ms → 302 ms), which the authors explain as "pushing down partial aggregate before the join size explodes" (counting early, before joins multiply rows). It reports 5 LLM and 5 QO-Verify calls and 2 executions, "saving 3 executions", 78 s in all, LLM calls taking the most, then executions, then verification.
- **Design claims (§3.1, PDF p. 3):** hint skipping "is effective in practice"; duplicate plan detection "fires quite often in practice"; in practice, after one much faster rewrite, timeout reduction "greatly speeds up" the rest.
- **Verification time (§3.2, PDF p. 3):** the median "is reported to be around 0.85 seconds" (the sentence follows one on [15]), "acceptable for offline query tuning scenarios".

## Limits the authors state

- LLMs "cannot guarantee semantic equivalence of a query rewrite" (abstract, PDF p. 1).
- Hint skipping "applies to use of query hints only" (§3.1, PDF p. 3).

## Open problems and building blocks

- **Open:** none stated; §1 (PDF p. 1) says the demo will "explain opportunities for future work".
- **Released:** nothing stated.
- **To reuse it:** SQL Server's optimizer and SSMS (§1, PDF p. 1); an LLM (§3.3, PDF p. 4).

## On this site

- **Discussed in:** [Verified query speedups](#/challenges/verified_query_speedup) · [SQL features that verifiers don't cover](#/challenges/verifier_coverage_gaps)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/llm-gen">llm-gen</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/pairgen-check">pairgen-check</a><a class="tag sub" href="#/tags/prove-memo">prove-memo</a><a class="tag sub" href="#/tags/rewrite-llm">rewrite-llm</a><a class="tag sub" href="#/tags/scaling-sql">scaling-sql</a></span>
