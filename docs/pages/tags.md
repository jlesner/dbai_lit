Topic tags, grouped by search area. A subtag narrows its tag; click any tag to see its papers and challenges.

<!-- filter -->

<p class="jump"><a href="#/tags:llm-methods-on-checkable-problems">LLM methods on checkable problems</a> · <a href="#/tags:text-to-sql">text-to-SQL</a> · <a href="#/tags:dialect-translation">dialect translation</a> · <a href="#/tags:rewrite-rules">rewrite rules</a> · <a href="#/tags:query-equivalence">query equivalence</a> · <a href="#/tags:nondeterministic-queries">nondeterministic queries</a> · <a href="#/tags:across-all-areas">Across all areas</a></p>

<a id="llm-methods-on-checkable-problems"></a>

## LLM methods on checkable problems

- <a class="tag" href="#/tags/promptopt">promptopt</a>: **Prompt-space optimizers**: methods that improve an LLM system by changing its prompts, instructions, demonstrations or prompt programs rather than its weights, and their dependencies. Subtags: <a class="tag sub" href="#/tags/promptopt-context">promptopt-context</a><a class="tag sub" href="#/tags/promptopt-evolve">promptopt-evolve</a><a class="tag sub" href="#/tags/promptopt-feedback">promptopt-feedback</a><a class="tag sub" href="#/tags/promptopt-general">promptopt-general</a><a class="tag sub" href="#/tags/promptopt-misc">promptopt-misc</a>
- <a class="tag" href="#/tags/scaling">scaling</a>: **Inference-time scaling**: spends more LLM inference compute for a better answer. Subtags: <a class="tag sub" href="#/tags/scaling-general">scaling-general</a><a class="tag sub" href="#/tags/scaling-sql">scaling-sql</a>
- <a class="tag" href="#/tags/harness">harness</a>: **The LLM runs inside an agent loop**: it calls tools (database, verifier, prover), reads feedback and tries again, or several agents cooperate, or it draws on memory or retrieval across problems. Subtags: <a class="tag sub" href="#/tags/harness-general">harness-general</a><a class="tag sub" href="#/tags/harness-promptopt">harness-promptopt</a><a class="tag sub" href="#/tags/harness-sql">harness-sql</a>
- <a class="tag" href="#/tags/rlvr">rlvr</a>: **Model weights are trained on a programmatic signal** (execution match, prover verdict, measured latency): reinforcement learning, including self-play and proposer–solver loops, and also rejection fine-tuning, expert iteration or STaR on outputs that pass a programmatic check, and preference losses whose labels come from a program. Subtags: <a class="tag sub" href="#/tags/rlvr-general">rlvr-general</a><a class="tag sub" href="#/tags/rlvr-sql">rlvr-sql</a>
- <a class="tag" href="#/tags/hacking">hacking</a>: **Weak checkers and their exploitation**: the item's own results show or measure how a check that accepts wrong answers (an LLM judge, a reward model, a single test database, unit tests, a spurious or noisy reward) is exploited or misleads search, training or memory building ([Measuring Crystallization in Text-to-SQL](#/papers/wang2026crystallization "From Test-Time Scaling to Reusable Memory: Measuring Crystallization in Text-to-SQL (2026)") §5.3), or it designs a check to resist that. Subtags: <a class="tag sub" href="#/tags/hacking-general">hacking-general</a><a class="tag sub" href="#/tags/hacking-sql">hacking-sql</a>
- <a class="tag" href="#/tags/stats">stats</a>: **Statistics for comparing LLM methods or systems** on evaluations with checked answers: the item's main result or released method is a statistical tool or finding about such comparisons, e.g. decomposing evaluation noise; paired tests, intervals and power for small item sets; selection bias after search (winner's curse, reuse of a holdout, hidden model selection).
- <a class="tag" href="#/tags/labels">labels</a>: **Benchmark ground truth**: audits that measure how often a benchmark's labels, tests or verifiers are wrong (false accepts or false rejects of the grading), and benchmarks or pipelines whose labels a check backs (proofs, certified counterexamples, executable specifications).
- <a class="tag" href="#/tags/compact">compact</a>: **Compact against frontier models**: the item's own results compare compact models (small, quantized or low-cost tiers), helped by inference or a harness or not, with larger ones on checked tasks, or measure what compression does to success on checked tasks.
- <a class="tag" href="#/tags/judge">judge</a>: **Decides equivalence or correctness directly, with no sound backend**, by an LLM or another learned model: SQL equivalence judges, and LLM judges, generative verifiers and reward models studied against checkable ground truth. Subtags: <a class="tag sub" href="#/tags/judge-general">judge-general</a><a class="tag sub" href="#/tags/judge-sql">judge-sql</a>
- <a class="tag" href="#/tags/pairs">pairs</a>: Ships a dataset or benchmark of query pairs or equivalence instances you can evaluate a checker on. Subtags: <a class="tag sub" href="#/tags/pairs-check">pairs-check</a><a class="tag sub" href="#/tags/pairs-code">pairs-code</a><a class="tag sub" href="#/tags/pairs-rewrite">pairs-rewrite</a>
- <a class="tag" href="#/tags/workload">workload</a>: Query or data generators for testing or benchmarking, with no equivalence pairs: benchmark kits and random query generators.

<a id="text-to-sql"></a>

## text-to-SQL

- <a class="tag" href="#/tags/nl2sql">nl2sql</a>: Text-to-SQL: generation, evaluation, or candidate selection. Subtags: <a class="tag sub" href="#/tags/nl2sql-data">nl2sql-data</a><a class="tag sub" href="#/tags/nl2sql-eval">nl2sql-eval</a><a class="tag sub" href="#/tags/nl2sql-misc">nl2sql-misc</a><a class="tag sub" href="#/tags/nl2sql-select">nl2sql-select</a>

<a id="dialect-translation"></a>

## dialect translation

- <a class="tag" href="#/tags/dialect">dialect</a>: **Translates SQL between dialects or DBMSs, or checks such translations or how engines differ**: translators and migration tools, dialect-agnostic parsing, cross-dialect benchmarks, cross-engine refuters, engine semantics. Subtags: <a class="tag sub" href="#/tags/dialect-difftest">dialect-difftest</a><a class="tag sub" href="#/tags/dialect-misc">dialect-misc</a><a class="tag sub" href="#/tags/dialect-pairs">dialect-pairs</a><a class="tag sub" href="#/tags/dialect-parse">dialect-parse</a><a class="tag sub" href="#/tags/dialect-translate">dialect-translate</a>
- <a class="tag" href="#/tags/difftest">difftest</a>: **Differential testing across engines**: runs the same query, or a query and its translation, on two or more DBMSs, engine versions or configurations, and treats a difference in results as evidence of a bug or a bad translation.
- <a class="tag" href="#/tags/reduce">reduce</a>: **Reduction**: shrinks a query, a test case or a counterexample database to a smaller one that keeps a property (the bug, the difference, the dialect feature).

<a id="rewrite-rules"></a>

## rewrite rules

- <a class="tag" href="#/tags/rewrite">rewrite</a>: Query rewriting, LLM or rule-based, and rewrite benchmarks. Subtags: <a class="tag sub" href="#/tags/rewrite-classic">rewrite-classic</a><a class="tag sub" href="#/tags/rewrite-eval">rewrite-eval</a><a class="tag sub" href="#/tags/rewrite-llm">rewrite-llm</a><a class="tag sub" href="#/tags/rewrite-smt">rewrite-smt</a>
- <a class="tag" href="#/tags/rules">rules</a>: **Rewrite rules are a first-class object or output** (dialect translation rules count too): a rule catalogue or library, a rule language or DSL, verification of rules, or **discovery** of new rules, whether mined, synthesized, LLM-proposed or distilled from verified rewrites. Subtags: <a class="tag sub" href="#/tags/rules-discover">rules-discover</a><a class="tag sub" href="#/tags/rules-lib">rules-lib</a><a class="tag sub" href="#/tags/rules-verify">rules-verify</a>
- <a class="tag" href="#/tags/pairgen">pairgen</a>: **Can generate new query pairs whose equivalence is known**, to grow a benchmark or training set: applying trusted rewrite rules (a DBMS's rules, verified rules, hand-written expert rules), instantiating verified equivalent skeletons, or rewriting and then proving the pair with a sound checker. Subtags: <a class="tag sub" href="#/tags/pairgen-apply">pairgen-apply</a><a class="tag sub" href="#/tags/pairgen-check">pairgen-check</a>
- <a class="tag" href="#/tags/workload">workload</a>: Query or data generators for testing or benchmarking, with no equivalence pairs: benchmark kits and random query generators.
- <a class="tag" href="#/tags/qo">qo</a>: Query optimizers, and the foundations of query optimization. Subtags: <a class="tag sub" href="#/tags/qo-learned">qo-learned</a><a class="tag sub" href="#/tags/qo-rules">qo-rules</a>

<a id="query-equivalence"></a>

## query equivalence

- <a class="tag" href="#/tags/judge">judge</a>: **Decides equivalence or correctness directly, with no sound backend**, by an LLM or another learned model: SQL equivalence judges, and LLM judges, generative verifiers and reward models studied against checkable ground truth. Subtags: <a class="tag sub" href="#/tags/judge-general">judge-general</a><a class="tag sub" href="#/tags/judge-sql">judge-sql</a>
- <a class="tag" href="#/tags/pairs">pairs</a>: Ships a dataset or benchmark of query pairs or equivalence instances you can evaluate a checker on. Subtags: <a class="tag sub" href="#/tags/pairs-check">pairs-check</a><a class="tag sub" href="#/tags/pairs-code">pairs-code</a><a class="tag sub" href="#/tags/pairs-rewrite">pairs-rewrite</a>
- <a class="tag" href="#/tags/prove">prove</a>: **Proves** equivalence for *all* databases: sound provers, optimizer-memo verification, verified-by-construction rewriting. Subtags: <a class="tag sub" href="#/tags/prove-general">prove-general</a><a class="tag sub" href="#/tags/prove-itp">prove-itp</a><a class="tag sub" href="#/tags/prove-memo">prove-memo</a><a class="tag sub" href="#/tags/prove-smt">prove-smt</a>
- <a class="tag" href="#/tags/bounded">bounded</a>: Bounded or small-model equivalence checking, plus the theory of when a bound is complete, including the canonical-database argument for conjunctive queries. Subtags: <a class="tag sub" href="#/tags/bounded-smt">bounded-smt</a><a class="tag sub" href="#/tags/bounded-theory">bounded-theory</a>
- <a class="tag" href="#/tags/cex">cex</a>: **Refutes**: the tool outputs a **concrete database** (counterexample, test, or distinguishing/separating instance) that is executed or checked, bounded or not. Subtags: <a class="tag sub" href="#/tags/cex-general">cex-general</a><a class="tag sub" href="#/tags/cex-llm">cex-llm</a><a class="tag sub" href="#/tags/cex-misc">cex-misc</a><a class="tag sub" href="#/tags/cex-search">cex-search</a><a class="tag sub" href="#/tags/cex-smt">cex-smt</a>
- <a class="tag" href="#/tags/smt">smt</a>: The method is built on an SMT solver (Z3, cvc5): it encodes into the solver itself. Subtags: <a class="tag sub" href="#/tags/smt-misc">smt-misc</a>
- <a class="tag" href="#/tags/itp">itp</a>: Built on an **interactive theorem prover** (proof assistant: Coq/Rocq, Lean, Isabelle, Agda, HOL, …). Subtags: <a class="tag sub" href="#/tags/itp-general">itp-general</a><a class="tag sub" href="#/tags/itp-sql">itp-sql</a>
- <a class="tag" href="#/tags/theory">theory</a>: Pure theory, no released tool. Subtags: <a class="tag sub" href="#/tags/theory-bag">theory-bag</a><a class="tag sub" href="#/tags/theory-null">theory-null</a><a class="tag sub" href="#/tags/theory-set">theory-set</a>
- <a class="tag" href="#/tags/reduce">reduce</a>: **Reduction**: shrinks a query, a test case or a counterexample database to a smaller one that keeps a property (the bug, the difference, the dialect feature).

<a id="nondeterministic-queries"></a>

## nondeterministic queries

- <a class="tag" href="#/tags/nondet">nondet</a>: **Nondeterministic queries or order-aware semantics**: defines equivalence for queries with more than one correct output (ties under `ORDER BY … LIMIT`, unordered aggregates, `random`), models results as lists or as sets of possible outputs, or detects or filters nondeterministic queries before comparing results. Subtags: <a class="tag sub" href="#/tags/nondet-eval">nondet-eval</a><a class="tag sub" href="#/tags/nondet-semantics">nondet-semantics</a>

<a id="across-all-areas"></a>

## Across all areas

- <a class="tag" href="#/tags/dbtask">dbtask</a>: **Evaluates LLMs on database work other than writing one query from one question**: understanding SQL or predicting its results, answering questions over relational tables it is given (the LLM as the engine), debugging and repairing SQL, procedural SQL (PL/SQL), schema design, index or knob tuning, database operations, multi-turn or agentic work with writes, data pipelines; or trains a model on such a task (a learned SQL executor).
- <a class="tag" href="#/tags/general">general</a>: **Main results are not on SQL tasks** (math, code, general reasoning, general programs). Subtags: <a class="tag sub" href="#/tags/general-misc">general-misc</a>
- <a class="tag" href="#/tags/llm">llm</a>: Uses an LLM anywhere. Subtags: <a class="tag sub" href="#/tags/llm-assist">llm-assist</a><a class="tag sub" href="#/tags/llm-gen">llm-gen</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/llm-misc">llm-misc</a>
