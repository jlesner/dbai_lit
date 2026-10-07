Research challenges, grouped by search area: the SQL areas first, then LLMs.

<!-- filter -->

<p class="jump"><a href="#/challenges:query-equivalence">Query equivalence</a> · <a href="#/challenges:nondeterministic-queries">Nondeterministic queries</a> · <a href="#/challenges:text-to-sql">Text-to-SQL</a> · <a href="#/challenges:rewrite-rules">Rewrite rules</a> · <a href="#/challenges:dialect-translation">Dialect translation</a> · <a href="#/challenges:llm-methods-on-checkable-problems">LLM methods on checkable problems</a></p>

<a id="query-equivalence"></a>

## Query equivalence

- **[Query equivalence: prove or refute](#/challenges/query_equivalence)**: Decide whether two SQL queries return the same result on every database, and back the answer with a certificate. <span class="tags"><a class="tag" href="#/tags/bounded">bounded</a><a class="tag" href="#/tags/cex">cex</a><a class="tag" href="#/tags/itp">itp</a><a class="tag" href="#/tags/judge">judge</a><a class="tag" href="#/tags/prove">prove</a><a class="tag" href="#/tags/smt">smt</a><a class="tag" href="#/tags/theory">theory</a></span>
- **[Equivalence under schema constraints](#/challenges/schema_constrained_equivalence)**: Queries that look different can be equivalent because of keys, foreign keys, NOT NULL or CHECK constraints, and a checker has to know about them. <span class="tags"><a class="tag" href="#/tags/cex">cex</a><a class="tag" href="#/tags/prove">prove</a><a class="tag" href="#/tags/smt">smt</a></span>
- **[SQL features that verifiers don't cover](#/challenges/verifier_coverage_gaps)**: Formal checkers support only a fragment of SQL. The pairs that matter most often fall outside it. <span class="tags"><a class="tag" href="#/tags/bounded">bounded</a><a class="tag" href="#/tags/cex">cex</a><a class="tag" href="#/tags/prove">prove</a><a class="tag" href="#/tags/smt">smt</a></span>
- **[Canonical forms for queries](#/challenges/query_canonical_forms)**: An open problem: normal forms for useful SQL fragments, so that comparing two queries' forms decides (or nearly decides) equivalence. Sound when the forms match; silent when they don't. <span class="tags"><a class="tag" href="#/tags/prove">prove</a><a class="tag" href="#/tags/rules">rules</a><a class="tag" href="#/tags/theory">theory</a></span>
- **[Can SQL equivalence checkers be trusted?](#/challenges/checker_soundness)**: Provers, bounded checkers and the harnesses around them certify wrong *equivalent* verdicts, and the benchmarks they are tested on can't show it. <span class="tags"><a class="tag" href="#/tags/itp">itp</a><a class="tag" href="#/tags/prove">prove</a><a class="tag" href="#/tags/smt">smt</a></span>
- **[Minimal counterexamples](#/challenges/minimal_counterexamples)**: Find the smallest database on which two queries differ, so that a person or an LLM can read why they differ. <span class="tags"><a class="tag" href="#/tags/bounded">bounded</a><a class="tag" href="#/tags/cex">cex</a><a class="tag" href="#/tags/reduce">reduce</a></span>
- **[Sourcing realistic, hard query pairs](#/challenges/query_pair_sourcing)**: Checkers and benchmarks need many query pairs that are *nearly* equivalent. Where do they come from, and how are they labelled? <span class="tags"><a class="tag" href="#/tags/pairgen">pairgen</a><a class="tag sub" href="#/tags/dialect-pairs">dialect-pairs</a></span>

<a id="nondeterministic-queries"></a>

## Nondeterministic queries

- **[Equivalence of nondeterministic queries](#/challenges/nondeterministic_equivalence)**: What does "equivalent" mean when a query can legitimately return different results on the same database, run to run, and how do we check it without false counterexamples or false agreement? <span class="tags"><a class="tag" href="#/tags/bounded">bounded</a><a class="tag" href="#/tags/cex">cex</a><a class="tag" href="#/tags/nondet">nondet</a><a class="tag" href="#/tags/theory">theory</a></span>

<a id="text-to-sql"></a>

## Text-to-SQL

- **[Text-to-SQL can't be verified against intent](#/challenges/text_to_sql_verification)**: English is ambiguous and gold queries are often wrong, so text-to-SQL is used here as a *source of pairs*, not as a goal. <span class="tags"><a class="tag sub" href="#/tags/nl2sql-eval">nl2sql-eval</a></span>
- **[The self-improving SQL ↔ text ↔ verify loop](#/challenges/sql_text_round_trip_loop)**: Improve a describer (SQL→English), a writer (English→SQL) and an equivalence checker together, using certified checker verdicts as the reward. <span class="tags"><a class="tag" href="#/tags/nl2sql">nl2sql</a><a class="tag" href="#/tags/promptopt">promptopt</a></span>

<a id="rewrite-rules"></a>

## Rewrite rules

- **[Refuting faulty rewrite rules](#/challenges/faulty_rewrite_rules)**: Rewriters have edge-case bugs that change query results ([ARG](#/papers/li2025arg "ARG: Testing Query Rewriters via Abstract Rule Guided Fuzzing (2025)") Tab. II), and so do published rules. Find them with counterexamples. <span class="tags"><a class="tag" href="#/tags/qo">qo</a><a class="tag" href="#/tags/rewrite">rewrite</a><a class="tag sub" href="#/tags/rules-verify">rules-verify</a></span>
- **[Discovering new rewrite rules](#/challenges/rewrite_rule_discovery)**: Where do new optimizer rules come from? Have an LLM propose them and a prover verify them. <span class="tags"><a class="tag" href="#/tags/pairgen">pairgen</a><a class="tag sub" href="#/tags/rules-discover">rules-discover</a></span>
- **[Verified query speedups](#/challenges/verified_query_speedup)**: "Q2 is faster than Q1" is worth nothing unless Q2 ≡ Q1 has also been established. <span class="tags"><a class="tag" href="#/tags/qo">qo</a><a class="tag sub" href="#/tags/rewrite-llm">rewrite-llm</a></span>

<a id="dialect-translation"></a>

## Dialect translation

- **[SQL dialect translation](#/challenges/dialect_translation)**: Translate queries between engines (PostgreSQL, MySQL, SQLite, DuckDB, SQL Server, …) without changing their meaning. <span class="tags"><a class="tag sub" href="#/tags/dialect-pairs">dialect-pairs</a><a class="tag sub" href="#/tags/dialect-translate">dialect-translate</a></span>
- **[Telling bad translations from legitimate engine differences](#/challenges/bad_translation_detection)**: When a translated query returns different results, is the translation wrong, or does no exact translation exist? <span class="tags"><a class="tag sub" href="#/tags/dialect-difftest">dialect-difftest</a></span>

<a id="llm-methods-on-checkable-problems"></a>

## LLM methods on checkable problems

- **[Benchmarks with checkable ground truth](#/challenges/checkable_benchmark_ground_truth)**: Equivalence benchmarks whose labels can't be checked cap progress. A refutation benchmark's ground truth grows as models improve. <span class="tags"><a class="tag" href="#/tags/judge">judge</a><a class="tag" href="#/tags/pairs">pairs</a></span>
- **[Bringing compact models to frontier accuracy](#/challenges/compact_model_accuracy)**: Make a small, cheap model as reliable as a frontier model on checkable SQL tasks, without retraining it (or with only a little training). <span class="tags"><a class="tag" href="#/tags/llm">llm</a><a class="tag" href="#/tags/promptopt">promptopt</a></span>
- **[Weak checkers get exploited](#/challenges/weak_checker_exploitation)**: When a loop selects or trains on a checker's verdict, the checker's false accepts become targets. The harder the loop optimizes, the more answers it finds that the checker accepts but that are wrong. <span class="tags"><a class="tag" href="#/tags/hacking">hacking</a><a class="tag" href="#/tags/judge">judge</a><a class="tag" href="#/tags/rlvr">rlvr</a><a class="tag" href="#/tags/scaling">scaling</a></span>
- **[Comparing LLM methods under noise](#/challenges/method_comparison_under_noise)**: Reported gains among prompts, optimizers, verifiers and training recipes often sit inside run-to-run and small-sample noise, or are scored on the set that picked the winner. Certified, renewable SQL test items make the comparison cheap to redo. <span class="tags"><a class="tag" href="#/tags/promptopt">promptopt</a><a class="tag" href="#/tags/scaling">scaling</a></span>
- **[Can a memory across problems be checked before it is reused?](#/challenges/verified_memory)**: In the listed systems, lessons, playbooks, skills and harness edits carried from one problem to the next are never checked by a sound check before reuse, and the agents that edit them can't name what an edit will break. <span class="tags"><a class="tag" href="#/tags/harness">harness</a><a class="tag" href="#/tags/promptopt">promptopt</a></span>
- **[Whole-job reliability of multi-step LLM work](#/challenges/whole_job_reliability)**: Per-step errors compound over long jobs, so a model that is good at each step still fails most long jobs. Which checks restore whole-job success, and can a small local model, checked at every step, finish long jobs as reliably as a frontier model? <span class="tags"><a class="tag" href="#/tags/harness">harness</a><a class="tag" href="#/tags/scaling">scaling</a></span>
- **[Self-improvement that compounds](#/challenges/compounding_self_improvement)**: Self-improving LLM loops gain in the first round, then stall or regress. Make the gains compound: each round adds certified information, and each change is kept only if a certified, statistically controlled check shows it doesn't regress. <span class="tags"><a class="tag" href="#/tags/harness">harness</a><a class="tag" href="#/tags/promptopt">promptopt</a><a class="tag" href="#/tags/rlvr">rlvr</a></span>
