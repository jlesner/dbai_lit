Topic tags, grouped by search area under the same groups as the papers. A subtag narrows its tag; click any tag to see its papers and challenges. Combine tags in the second box above: `harness+!dsl-sql` is the `harness` items without `dsl-sql`, and `cex+smt,itp` the `cex` items with `smt` or `itp`.

<!-- filter -->

<div class="jump topics"><a class="d0" href="#/tags:llm-methods">LLM methods</a><a class="d1" href="#/tags:llm-methods-on-checkable-problems">LLM methods on checkable problems</a><a class="d0" href="#/tags:llms-for-dsls">LLMs for DSLs</a><a class="d1" href="#/tags:llms-for-dsls-beyond-sql">LLMs for DSLs beyond SQL</a><a class="d1" href="#/tags:text-to-sql">text-to-SQL</a><a class="d1" href="#/tags:dialect-translation">dialect translation</a><a class="d1" href="#/tags:rewrite-rules">rewrite rules</a><a class="d0" href="#/tags:dsl-foundations">DSL foundations</a><a class="d1" href="#/tags:query-equivalence">query equivalence</a><a class="d1" href="#/tags:nondeterministic-queries">nondeterministic queries</a><a class="d0" href="#/tags:across-all-areas">Across all areas</a></div>

<a id="llm-methods"></a>

## LLM methods


<a id="llm-methods-on-checkable-problems"></a>

### LLM methods on checkable problems

- <a class="tag" href="#/tags/promptopt">promptopt</a>: **Prompt-space optimizers**: methods that improve an LLM system by changing its prompts, instructions, demonstrations or prompt programs rather than its weights, and their dependencies. Subtags: <a class="tag sub" href="#/tags/promptopt-context">promptopt-context</a><a class="tag sub" href="#/tags/promptopt-evolve">promptopt-evolve</a><a class="tag sub" href="#/tags/promptopt-feedback">promptopt-feedback</a>
- <a class="tag" href="#/tags/scaling">scaling</a>: **Inference-time scaling**: spends more LLM inference compute for a better answer, by sampling and voting (best-of-n, self-consistency), search over generations (tree search or MCTS over LLM outputs), or thinking-budget control.
- <a class="tag" href="#/tags/harness">harness</a>: **The LLM runs inside an agent loop**: it calls tools (database, verifier, prover), reads feedback and tries again, or several agents cooperate, or it draws on memory or retrieval across problems; a fixed loop that feeds a tool's or checker's result back to the LLM for another try counts, but a single prompt with a fixed post-check or a pipeline with no feedback doesn't.
- <a class="tag" href="#/tags/rlvr">rlvr</a>: **Model weights are trained on a programmatic signal** (execution match, prover verdict, measured latency): reinforcement learning, including self-play and proposer–solver loops, and also rejection fine-tuning, expert iteration or STaR on outputs that pass a programmatic check, and preference losses whose labels come from a program.
- <a class="tag" href="#/tags/hacking">hacking</a>: **Weak checkers and their exploitation**: the item's own results show or measure how a check that accepts wrong answers (an LLM judge, a reward model, a single test database, unit tests, a spurious or noisy reward) is exploited or misleads search, training or memory building, or it designs a check to resist that; an adversarial edit measured to make a judge accept wrong answers counts.
- <a class="tag" href="#/tags/stats">stats</a>: **Statistics for comparing LLM methods or systems** on evaluations with checked answers: the item's main result or released method is a statistical tool or finding about such comparisons, e.g. decomposing evaluation noise; paired tests, intervals and power for small item sets; selection bias after search (winner's curse, reuse of a holdout, hidden model selection); classical statistics that a listed item builds on counts too.
- <a class="tag" href="#/tags/labels">labels</a>: **Benchmark ground truth**: audits that measure how often a benchmark's labels, tests or verifiers are wrong (false accepts or false rejects of the grading), and benchmarks or pipelines whose labels a check backs (proofs, certified counterexamples, executable specifications), in any domain (text-to-DSL items keep their <a class="tag" href="#/tags/nl2dsl">nl2dsl</a> subtags as well).
- <a class="tag" href="#/tags/compact">compact</a>: **Compact against frontier models**: the item's own results compare compact models (small, quantized or low-cost tiers), helped by inference or a harness or not, with larger ones on checked tasks, or measure what compression does to success on checked tasks.
- <a class="tag" href="#/tags/offload">offload</a>: **Engine against text on the same task**: the item's own results compare an LLM that hands a procedure to an engine or interpreter (a program, query or formalization that is executed) with the LLM doing the same work in text or with the data in its context, or study when, or to which engine, to hand it.
- <a class="tag" href="#/tags/rarelang">rarelang</a>: **Languages rare in pretraining**: the item's own results measure LLMs writing programs in a language or library that is rare or absent in pretraining (low-resource, esoteric, new or private), scored by running them (tests, compiler, interpreter), or test a way to teach one (prompts, documentation, memory, weights).
- <a class="tag" href="#/tags/gym">gym</a>: **Generators of checkable tasks**: procedural generators of tasks whose answers a program computes and checks (environments, puzzle or program suites), released as a resource, or audits of such generators' checks.
- <a class="tag" href="#/tags/transfer">transfer</a>: **Gains checked outside the check**: the item's own results measure whether a gain made against a check, in weights or in prompts, holds on targets chosen before the run outside that check's training distribution (other representations, domains or open-ended tasks).
- <a class="tag" href="#/tags/placebo">placebo</a>: **Does the gain depend on the feedback's content?** The item's own results test whether a system's gain or decision depends on its feedback's content, by an intervention that keeps the feedback's form and breaks its link to inputs (shuffled, reassigned or constant verdicts).
- <a class="tag" href="#/tags/judge">judge</a>: **Decides equivalence or correctness directly, with no sound backend**, by an LLM or another learned model: query equivalence judges (SQL or another DSL), and LLM judges, generative verifiers and reward models studied against checkable ground truth, including benchmarks of judges, and LLM monitors of cheating or reward hacking on the same terms.
- <a class="tag" href="#/tags/pairs">pairs</a>: Ships a dataset or benchmark of query pairs or equivalence instances you can evaluate a checker on (a tool that can *make* new pairs is <a class="tag" href="#/tags/pairgen">pairgen</a>). Subtags: <a class="tag sub" href="#/tags/pairs-check">pairs-check</a><a class="tag sub" href="#/tags/pairs-prog">pairs-prog</a>
- <a class="tag" href="#/tags/workload">workload</a>: Query or data generators for testing or benchmarking, with no equivalence pairs: benchmark kits and random query generators.
- <a class="tag" href="#/tags/longctx">longctx</a>: **Accuracy against context size on checked tasks**: the item's own results measure how success on a fixed checked task changes as input length, distractors, position or accumulated turns grow, or compare mitigations (harness, compaction, programs over the context).

<a id="llms-for-dsls"></a>

## LLMs for DSLs


<a id="llms-for-dsls-beyond-sql"></a>

### LLMs for DSLs beyond SQL

- <a class="tag" href="#/tags/dsl">dsl</a>:  Subtags: <a class="tag sub" href="#/tags/dsl-datalog">dsl-datalog</a><a class="tag sub" href="#/tags/dsl-graph">dsl-graph</a><a class="tag sub" href="#/tags/dsl-path">dsl-path</a><a class="tag sub" href="#/tags/dsl-regex">dsl-regex</a><a class="tag sub" href="#/tags/dsl-sparql">dsl-sparql</a><a class="tag sub" href="#/tags/dsl-sql">dsl-sql</a>

<a id="text-to-sql"></a>

### text-to-SQL

- <a class="tag" href="#/tags/nl2dsl">nl2dsl</a>: Text-to-DSL: writing SQL or another DSL's queries from natural language: generation, evaluation, or candidate selection. Subtags: <a class="tag sub" href="#/tags/nl2dsl-data">nl2dsl-data</a><a class="tag sub" href="#/tags/nl2dsl-eval">nl2dsl-eval</a><a class="tag sub" href="#/tags/nl2dsl-select">nl2dsl-select</a>

<a id="dialect-translation"></a>

### dialect translation

- <a class="tag" href="#/tags/dialect">dialect</a>: **Translates queries between dialects, engines or languages of the <a class="tag" href="#/tags/dsl">dsl</a> family, or checks such translations or how engines differ**: translators and migration tools, dialect-agnostic parsing, cross-dialect benchmarks, cross-engine refuters, engine semantics; this covers SQL between dialects or DBMSs, translations between two languages of the family, and between two engines or dialects of one (Cypher and SQL, SPARQL and Cypher, regular-expression flavours). Subtags: <a class="tag sub" href="#/tags/dialect-parse">dialect-parse</a><a class="tag sub" href="#/tags/dialect-translate">dialect-translate</a>
- <a class="tag" href="#/tags/difftest">difftest</a>: **Differential testing across engines**: runs the same query, or a query and its translation, on two or more DBMSs or other engines, engine versions or configurations, and treats a difference in results as evidence of a bug or a bad translation.
- <a class="tag" href="#/tags/reduce">reduce</a>: **Reduction**: shrinks a query, a test case or a counterexample database to a smaller one that keeps a property (the bug, the difference, the dialect feature).

<a id="rewrite-rules"></a>

### rewrite rules

- <a class="tag" href="#/tags/rewrite">rewrite</a>: Query rewriting, LLM or rule-based, and rewrite benchmarks. Subtags: <a class="tag sub" href="#/tags/rewrite-classic">rewrite-classic</a><a class="tag sub" href="#/tags/rewrite-eval">rewrite-eval</a>
- <a class="tag" href="#/tags/rules">rules</a>: **Rewrite rules are a first-class object or output** (dialect translation rules count too): a rule catalogue or library, a rule language or DSL, verification of rules, or **discovery** of new rules, whether mined, synthesized, LLM-proposed or distilled from verified rewrites, as a goal in itself here, not only a means to faster queries. Subtags: <a class="tag sub" href="#/tags/rules-discover">rules-discover</a><a class="tag sub" href="#/tags/rules-lib">rules-lib</a><a class="tag sub" href="#/tags/rules-verify">rules-verify</a>
- <a class="tag" href="#/tags/pairgen">pairgen</a>: **Can generate new query pairs whose equivalence is known**, to grow a benchmark or training set: applying trusted rewrite rules (a DBMS's or another engine's rules, verified rules, hand-written expert rules), instantiating verified equivalent skeletons, or rewriting and then proving the pair with a sound checker. Subtags: <a class="tag sub" href="#/tags/pairgen-apply">pairgen-apply</a><a class="tag sub" href="#/tags/pairgen-check">pairgen-check</a>
- <a class="tag" href="#/tags/workload">workload</a>: Query or data generators for testing or benchmarking, with no equivalence pairs: benchmark kits and random query generators.
- <a class="tag" href="#/tags/qo">qo</a>: Query optimizers, and the foundations of query optimization. Subtags: <a class="tag sub" href="#/tags/qo-learned">qo-learned</a>

<a id="dsl-foundations"></a>

## DSL foundations


<a id="query-equivalence"></a>

### query equivalence

- <a class="tag" href="#/tags/judge">judge</a>: **Decides equivalence or correctness directly, with no sound backend**, by an LLM or another learned model: query equivalence judges (SQL or another DSL), and LLM judges, generative verifiers and reward models studied against checkable ground truth, including benchmarks of judges, and LLM monitors of cheating or reward hacking on the same terms.
- <a class="tag" href="#/tags/pairs">pairs</a>: Ships a dataset or benchmark of query pairs or equivalence instances you can evaluate a checker on (a tool that can *make* new pairs is <a class="tag" href="#/tags/pairgen">pairgen</a>). Subtags: <a class="tag sub" href="#/tags/pairs-check">pairs-check</a><a class="tag sub" href="#/tags/pairs-prog">pairs-prog</a>
- <a class="tag" href="#/tags/prove">prove</a>: **Proves** equivalence for *all* databases (all inputs, for a DSL over other data): sound provers, optimizer-memo verification, verified-by-construction rewriting. Subtags: <a class="tag sub" href="#/tags/prove-memo">prove-memo</a>
- <a class="tag" href="#/tags/bounded">bounded</a>: Bounded or small-model equivalence checking of queries (SQL or another DSL), plus the theory of when a bound is complete, including the canonical-database argument for conjunctive queries.
- <a class="tag" href="#/tags/cex">cex</a>: **Refutes**: the tool outputs a **concrete database or input** (counterexample, test, or distinguishing/separating instance) that is executed or checked, bounded or not. Subtags: <a class="tag sub" href="#/tags/cex-search">cex-search</a>
- <a class="tag" href="#/tags/smt">smt</a>: The method is built on an SMT solver (Z3, cvc5): it encodes into the solver itself.
- <a class="tag" href="#/tags/itp">itp</a>: Built on an **interactive theorem prover** (proof assistant: Coq/Rocq, Lean, Isabelle, Agda, HOL, …): the method or artifact includes a machine-checked development (semantics, proofs, or a proof agent).
- <a class="tag" href="#/tags/theory">theory</a>: Pure theory, no released tool. Subtags: <a class="tag sub" href="#/tags/theory-bag">theory-bag</a><a class="tag sub" href="#/tags/theory-null">theory-null</a><a class="tag sub" href="#/tags/theory-set">theory-set</a>
- <a class="tag" href="#/tags/reduce">reduce</a>: **Reduction**: shrinks a query, a test case or a counterexample database to a smaller one that keeps a property (the bug, the difference, the dialect feature).

<a id="nondeterministic-queries"></a>

### nondeterministic queries

- <a class="tag" href="#/tags/nondet">nondet</a>: **Nondeterministic queries or order-aware semantics**: defines equivalence for queries with more than one correct output (ties under `ORDER BY … LIMIT`, unordered aggregates, `random`), models results as lists or as sets of possible outputs, or detects or filters nondeterministic queries before comparing results. Subtags: <a class="tag sub" href="#/tags/nondet-eval">nondet-eval</a><a class="tag sub" href="#/tags/nondet-semantics">nondet-semantics</a>

<a id="across-all-areas"></a>

## Across all areas

- <a class="tag" href="#/tags/agent">agent</a>: Main results on **agents acting in an environment**: tool-using, web, app, operating-system and game environments, where the outcome is the environment's final state or a sequence of actions.
- <a class="tag" href="#/tags/benchmark">benchmark</a>: **A resource for others to evaluate on**, named as a contribution: a benchmark, dataset, task suite, pair set or task generator.
- <a class="tag" href="#/tags/code">code</a>: Main results on **programs in general-purpose languages**: writing, repairing, testing, translating or verifying code (competitive programming, repository-level software engineering, program equivalence, verified code).
- <a class="tag" href="#/tags/dbtask">dbtask</a>: **Evaluates LLMs on database work other than writing one query from one question**: understanding SQL or predicting its results, answering questions over relational tables it is given (the LLM as the engine), debugging and repairing SQL, procedural SQL (PL/SQL), schema design, index or knob tuning, database operations, multi-turn or agentic work with writes, data pipelines; or trains a model on such a task (a learned SQL executor).
- <a class="tag" href="#/tags/llm">llm</a>: Uses an LLM anywhere. Subtags: <a class="tag sub" href="#/tags/llm-assist">llm-assist</a><a class="tag sub" href="#/tags/llm-gen">llm-gen</a>
- <a class="tag" href="#/tags/math">math</a>: Main results on **mathematics**: math word and competition problems, formal or informal theorem proving.
- <a class="tag" href="#/tags/method">method</a>: **A new way to do a task**: a method, system, algorithm, tool, prompt or training recipe that the item presents, whether or not it evaluates it (a design paper, a demo or a tool's manual counts).
- <a class="tag" href="#/tags/nl">nl</a>: Main results on **reasoning and language tasks posed in text**, with no environment to act in: question answering, logic puzzles, text classification and extraction, instruction following.
- <a class="tag" href="#/tags/study">study</a>: **Its main results measure existing things**: methods, models, systems, benchmarks or checks, as in empirical studies, audits, replications and re-evaluations.
- <a class="tag" href="#/tags/survey">survey</a>: **An organized view of other work, or an argument**: surveys, tutorials, textbooks, systematizations of knowledge, position papers.
