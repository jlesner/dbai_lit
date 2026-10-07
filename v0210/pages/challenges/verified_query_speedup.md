# Verified query speedups

> "Q2 is faster than Q1" is worth nothing unless Q2 ≡ Q1 has also been established.

<p class="tags"><a class="tag" href="#/tags/qo">qo</a><a class="tag sub" href="#/tags/rewrite-llm">rewrite-llm</a></p>

## Challenge
Rewrite a slow query into a faster one, and certify both the speedup and the equivalence.

## Why it matters
- **For DBAs and tuning tools.** LLM rewrites speed up real enterprise queries, not only benchmark ones ([QO-Verify](#/papers/narasayya2026qoverify "Leveraging Query Optimizers to Verify the Soundness of LLM-based Query Rewrites for Real-World Workloads, and More! (2026)") §4.2, Fig. 7), and SQL Server's demo builds a tuning tool around verified rewrites ([Verified LLM-Based Query Rewriting…](#/papers/lee2026mssqlrewrite "Verified LLM-Based Query Rewriting for Microsoft SQL Server (2026)") abstract). But a rewrite that changes the result is worse than none, and the QO-Verify authors name checking equivalence as what "limits the practical adoption of LLM-based rewriting today" (abstract).
- **Verification decides how much of the speedup survives.** For the median query, the best *verified* rewrite gains much less than the best candidate that merely matched results on the given database (§4.3, Fig. 11 against §4.2, Fig. 7); at the 90th percentile the gap is smaller. The candidates are not proven equivalent, so part of that gap may be rewrites that are wrong.
- **A source of new rules.** Fast rewrites the optimizer can't verify point to rules it lacks; that case is made in [Discovering new rewrite rules](#/challenges/rewrite_rule_discovery).

**Size of the gain:** incremental, measured as the latency of queries whose rewrite is certified, against the original. Per query the gain is a constant factor, usually modest at the median, with a tail of large speedups ([QO-Verify](#/papers/narasayya2026qoverify "Leveraging Query Optimizers to Verify the Soundness of LLM-based Query Rewrites for Real-World Workloads, and More! (2026)") §4.3, Fig. 11). The step change is in what can be deployed, and that comes from [SQL features that verifiers don't cover](#/challenges/verifier_coverage_gaps), not from better rewriting. This is our estimate.

## Verifiable signal
Two parts: an equivalence [certificate](#/glossary/certificate) (a proof, or verification through the optimizer memo, which can answer only *yes* or *unknown*) plus a measured speedup over repeated runs. A counterexample immediately disqualifies the rewrite. For a rewriter, *unknown* costs nothing: the original query is always a correct answer, so a rewrite the checker can't certify need not be shipped. ReSequel keeps the original query as a fallback, as does GenRewrite's performance gate ([GenRewrite](#/papers/liu2024genrewrite "GenRewrite: Query Rewriting via Large Language Models (2026)") §4.4), and the RL rewriters describe none at inference ([ReSequel](#/papers/fathollahzadeh2026resequel "ReSequel: Robust LLM-assisted Query Rewriting and Optimization using Templatization and Sampling (2026)"); our reading, Propose and verify).

