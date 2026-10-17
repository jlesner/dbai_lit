Research challenges, grouped by search area under the same groups as the papers:

<!-- filter -->

<div class="jump topics"><a class="d0" href="#/challenges:llm-methods">LLM methods</a><a class="d1" href="#/challenges:llm-methods-on-checkable-problems">LLM methods on checkable problems</a><a class="d0" href="#/challenges:dsls-for-llms">DSLs for LLMs</a><a class="d0" href="#/challenges:llms-for-dsls">LLMs for DSLs</a><a class="d1" href="#/challenges:llms-for-dsls-beyond-sql">LLMs for DSLs beyond SQL</a><a class="d1" href="#/challenges:text-to-sql">Text-to-SQL</a><a class="d1" href="#/challenges:dialect-translation">Dialect translation</a><a class="d1" href="#/challenges:rewrite-rules">Rewrite rules</a><a class="d0" href="#/challenges:dsl-foundations">DSL foundations</a><a class="d1" href="#/challenges:query-equivalence">Query equivalence</a><a class="d1" href="#/challenges:nondeterministic-queries">Nondeterministic queries</a></div>

<a id="llm-methods"></a>

## LLM methods


<a id="llm-methods-on-checkable-problems"></a>

### LLM methods on checkable problems

- **[Benchmarks with checkable ground truth](#/challenges/checkable_benchmark_ground_truth)**: Equivalence benchmarks whose labels can't be checked cap progress. A refutation benchmark's ground truth grows as models improve. <span class="tags"><a class="tag" href="#/tags/judge">judge</a><a class="tag" href="#/tags/pairs">pairs</a></span>
- **[Bringing compact models to frontier accuracy](#/challenges/compact_model_accuracy)**: Make a small, cheap model as reliable as a frontier model on checkable SQL tasks, without retraining it (or with only a little training). <span class="tags"><a class="tag" href="#/tags/llm">llm</a><a class="tag" href="#/tags/promptopt">promptopt</a></span>
- **[Weak checkers get exploited](#/challenges/weak_checker_exploitation)**: When a loop selects or trains on a checker's verdict, the checker's false accepts become targets. The harder the loop optimizes, the more answers it finds that the checker accepts but that are wrong. <span class="tags"><a class="tag" href="#/tags/hacking">hacking</a><a class="tag" href="#/tags/judge">judge</a><a class="tag" href="#/tags/rlvr">rlvr</a><a class="tag" href="#/tags/scaling">scaling</a></span>
- **[Comparing LLM methods under noise](#/challenges/method_comparison_under_noise)**: Reported gains among prompts, optimizers, verifiers and training recipes often sit inside run-to-run and small-sample noise, or are scored on the set that picked the winner. Certified, renewable test items, SQL pairs or the DSL gym's code-made tasks, make the comparison cheap to redo. <span class="tags"><a class="tag" href="#/tags/promptopt">promptopt</a><a class="tag" href="#/tags/scaling">scaling</a></span>
- **[Checking a memory across problems before it is reused](#/challenges/verified_memory)**: Check each lesson, skill or harness edit carried from one problem to the next with a sound check before it is reused, and name what an edit breaks before it is kept. <span class="tags"><a class="tag" href="#/tags/harness">harness</a><a class="tag" href="#/tags/promptopt">promptopt</a></span>
- **[Whole-job reliability of multi-step LLM work](#/challenges/whole_job_reliability)**: Per-step errors compound over long jobs, so a model that is good at each step still fails most long jobs. Which checks restore whole-job success, and can a small local model, checked at every step, finish long jobs as reliably as a frontier model? <span class="tags"><a class="tag" href="#/tags/harness">harness</a><a class="tag" href="#/tags/scaling">scaling</a></span>
- **[Self-improvement that compounds](#/challenges/compounding_self_improvement)**: Self-improving LLM loops gain in the first round, then stall or regress. Make the gains compound: each round adds certified information, and each change is kept only if a certified, statistically controlled check shows it doesn't regress. <span class="tags"><a class="tag" href="#/tags/harness">harness</a><a class="tag" href="#/tags/promptopt">promptopt</a><a class="tag" href="#/tags/rlvr">rlvr</a></span>
- **[Prompt-space self-play judged by an engine](#/challenges/prompt_space_self_play)**: Can a proposer–solver loop with no labels, judged only by a DSL's engine, teach a compact model through what it writes into prompts (a skill document and a library of verified examples), and does it matter whether the compact model or a frontier model writes them? <span class="tags"><a class="tag" href="#/tags/compact">compact</a><a class="tag" href="#/tags/promptopt">promptopt</a><a class="tag" href="#/tags/rlvr">rlvr</a></span>
- **[Which entries of a learned skill help](#/challenges/skill_entry_attribution)**: The engine judges whole answers, but a skill holds many entries; measure each entry's effect on the engine's verdicts, per task family and size. <span class="tags"><a class="tag" href="#/tags/promptopt">promptopt</a></span>

<a id="dsls-for-llms"></a>

## DSLs for LLMs

- **[Reliability that holds with size, by handing the procedure to an engine](#/challenges/engine_offloading_with_size)**: When a compact model writes a DSL program and an engine runs it, does its success rate hold as tasks grow, in data and in composition, and does the model know when the engine is the right tool? <span class="tags"><a class="tag" href="#/tags/compact">compact</a><a class="tag" href="#/tags/general">general</a></span>
- **[Learning a rarely seen DSL in prompts](#/challenges/unseen_dsl_in_prompts)**: Can a compact model learn a DSL that is rare in its training data, K through the open-source ngn/k engine, from the language's documentation and its engine alone, with what it learns kept in prompts? <span class="tags"><a class="tag" href="#/tags/compact">compact</a><a class="tag" href="#/tags/general">general</a></span>
- **[A gym of DSL tasks with answer keys made by code](#/challenges/dsl_gym)**: Task families in several DSLs (predict a program's output, write a program from examples or from English, decide whether two programs agree and show where they don't) whose answer keys come from the engine, with a size setting on two axes, and checks whose false accepts are measured. <span class="tags"><a class="tag" href="#/tags/general">general</a><a class="tag" href="#/tags/labels">labels</a></span>
- **[Gains made against a checker, carried beyond it](#/challenges/transfer_beyond_the_checker)**: Do gains a model makes against a program checker, in its weights or with its weights fixed (prompts, skills, memory), carry over to tasks the checker can't check: near, the same DSL on a task only examples check, such as writing a program from English; far, open-ended work in other domains? <span class="tags"><a class="tag" href="#/tags/compact">compact</a><a class="tag" href="#/tags/general">general</a><a class="tag" href="#/tags/harness">harness</a><a class="tag" href="#/tags/promptopt">promptopt</a><a class="tag" href="#/tags/rlvr">rlvr</a></span>

<a id="llms-for-dsls"></a>

## LLMs for DSLs


<a id="llms-for-dsls-beyond-sql"></a>

### LLMs for DSLs beyond SQL

- **[Checking a program written from English, in any DSL](#/challenges/dsl_intent_verification)**: A program an LLM writes from an English request can be checked against a reference program, but rarely against the request itself; find checks of intent that work across the DSL family, and measure the errors they miss. <span class="tags"><a class="tag" href="#/tags/general">general</a><a class="tag" href="#/tags/nl2sql">nl2sql</a></span>
- **[Porting programs between DSLs and dialects without changing their meaning](#/challenges/dsl_porting)**: Port a program to another dialect or DSL (Cypher to SQL/PGQ, Soufflé to clingo, PCRE to ECMAScript) and show that its meaning didn't change, when engines themselves disagree silently on what the source means. <span class="tags"><a class="tag" href="#/tags/dialect">dialect</a><a class="tag" href="#/tags/general">general</a></span>
- **[Distinguishing documents for two programs in any DSL](#/challenges/dsl_counterexamples)**: Given two programs in a DSL, find an input (a document, a fact set, a graph, a string) on which their results differ, small enough for a person or an LLM to read, across the family and not only in SQL. <span class="tags"><a class="tag" href="#/tags/cex">cex</a><a class="tag" href="#/tags/general">general</a></span>
- **[Repairing and rewriting DSL programs with a certified result](#/challenges/certified_dsl_repair)**: Change a DSL program (fix it, make it safe, make it shorter or faster) and certify the result: unchanged meaning where that is the aim, or the reference's meaning where the program was wrong. <span class="tags"><a class="tag" href="#/tags/general">general</a></span>

<a id="text-to-sql"></a>

### Text-to-SQL

- **[Checking text-to-SQL against intent](#/challenges/text_to_sql_verification)**: Check a generated SQL query against the intent of its English question. English is ambiguous and gold queries are often wrong, so only the comparison with another query can be certified, and text-to-SQL is used here as a *source of pairs*, not as a goal. <span class="tags"><a class="tag sub" href="#/tags/nl2sql-eval">nl2sql-eval</a></span>
- **[The self-improving SQL ↔ text ↔ verify loop](#/challenges/sql_text_round_trip_loop)**: Improve a describer (SQL→English), a writer (English→SQL) and an equivalence checker together, using certified checker verdicts as the reward. <span class="tags"><a class="tag" href="#/tags/nl2sql">nl2sql</a><a class="tag" href="#/tags/promptopt">promptopt</a></span>

<a id="dialect-translation"></a>

### Dialect translation

- **[SQL dialect translation](#/challenges/dialect_translation)**: Translate queries between engines (PostgreSQL, MySQL, SQLite, DuckDB, SQL Server, …) without changing their meaning. <span class="tags"><a class="tag sub" href="#/tags/dialect-pairs">dialect-pairs</a><a class="tag sub" href="#/tags/dialect-translate">dialect-translate</a></span>
- **[Telling bad translations from legitimate engine differences](#/challenges/bad_translation_detection)**: When a translated query returns different results, is the translation wrong, or does no exact translation exist? <span class="tags"><a class="tag sub" href="#/tags/dialect-difftest">dialect-difftest</a></span>

<a id="rewrite-rules"></a>

### Rewrite rules

- **[Refuting faulty rewrite rules](#/challenges/faulty_rewrite_rules)**: Rewriters have edge-case bugs that change query results ([ARG](#/papers/li2025arg "ARG: Testing Query Rewriters via Abstract Rule Guided Fuzzing (2025)") Tab. II), and so do published rules (§ What's known). Find them with counterexamples. <span class="tags"><a class="tag" href="#/tags/qo">qo</a><a class="tag" href="#/tags/rewrite">rewrite</a><a class="tag sub" href="#/tags/rules-verify">rules-verify</a></span>
- **[Discovering new rewrite rules](#/challenges/rewrite_rule_discovery)**: Where do new optimizer rules come from? Have an LLM propose them and a prover verify them. <span class="tags"><a class="tag" href="#/tags/pairgen">pairgen</a><a class="tag sub" href="#/tags/rules-discover">rules-discover</a></span>
- **[Verified query speedups](#/challenges/verified_query_speedup)**: "Q2 is faster than Q1" is worth nothing unless Q2 ≡ Q1 has also been established. <span class="tags"><a class="tag" href="#/tags/qo">qo</a><a class="tag sub" href="#/tags/rewrite-llm">rewrite-llm</a></span>

<a id="dsl-foundations"></a>

## DSL foundations


<a id="query-equivalence"></a>

### Query equivalence

- **[Query equivalence: prove or refute](#/challenges/query_equivalence)**: Decide whether two SQL queries return the same result on every database, and back the answer with a certificate. <span class="tags"><a class="tag" href="#/tags/bounded">bounded</a><a class="tag" href="#/tags/cex">cex</a><a class="tag" href="#/tags/itp">itp</a><a class="tag" href="#/tags/judge">judge</a><a class="tag" href="#/tags/prove">prove</a><a class="tag" href="#/tags/smt">smt</a><a class="tag" href="#/tags/theory">theory</a></span>
- **[Equivalence under schema constraints](#/challenges/schema_constrained_equivalence)**: Queries that look different can be equivalent because of keys, foreign keys, NOT NULL or CHECK constraints, and a checker has to know about them. <span class="tags"><a class="tag" href="#/tags/cex">cex</a><a class="tag" href="#/tags/prove">prove</a><a class="tag" href="#/tags/smt">smt</a></span>
- **[SQL features that verifiers don't cover](#/challenges/verifier_coverage_gaps)**: Formal checkers support only a fragment of SQL. The pairs that matter most often fall outside it. <span class="tags"><a class="tag" href="#/tags/bounded">bounded</a><a class="tag" href="#/tags/cex">cex</a><a class="tag" href="#/tags/prove">prove</a><a class="tag" href="#/tags/smt">smt</a></span>
- **[Canonical forms for queries](#/challenges/query_canonical_forms)**: Normal forms for useful SQL fragments, so that comparing two queries' forms decides (or nearly decides) equivalence. Sound when the forms match; silent when they don't. <span class="tags"><a class="tag" href="#/tags/prove">prove</a><a class="tag" href="#/tags/rules">rules</a><a class="tag" href="#/tags/theory">theory</a></span>
- **[Can SQL equivalence checkers be trusted?](#/challenges/checker_soundness)**: Provers, bounded checkers and the harnesses around them certify wrong *equivalent* verdicts, and the benchmarks they are tested on can't show it. <span class="tags"><a class="tag" href="#/tags/itp">itp</a><a class="tag" href="#/tags/prove">prove</a><a class="tag" href="#/tags/smt">smt</a></span>
- **[Minimal counterexamples](#/challenges/minimal_counterexamples)**: Find the smallest database on which two queries differ, so that a person or an LLM can read why they differ. <span class="tags"><a class="tag" href="#/tags/bounded">bounded</a><a class="tag" href="#/tags/cex">cex</a><a class="tag" href="#/tags/reduce">reduce</a></span>
- **[Sourcing realistic, hard query pairs](#/challenges/query_pair_sourcing)**: Checkers and benchmarks need many query pairs that are *nearly* equivalent. Where do they come from, and how are they labelled? <span class="tags"><a class="tag" href="#/tags/pairgen">pairgen</a><a class="tag sub" href="#/tags/dialect-pairs">dialect-pairs</a></span>

<a id="nondeterministic-queries"></a>

### Nondeterministic queries

- **[Equivalence of nondeterministic queries](#/challenges/nondeterministic_equivalence)**: What does "equivalent" mean when a query can legitimately return different results on the same database, run to run, and how do we check it without false counterexamples or false agreement? <span class="tags"><a class="tag" href="#/tags/bounded">bounded</a><a class="tag" href="#/tags/cex">cex</a><a class="tag" href="#/tags/nondet">nondet</a><a class="tag" href="#/tags/theory">theory</a></span>
