# Building SQL Equivalence Proofs from Query Rewrite Rules

**EquiTrace** · preprint Oct 2026 (CIDR 2027 class file)

Read: [PDF](https://arxiv.org/pdf/2610.30100) · [arXiv](https://arxiv.org/abs/2610.30100)

<p class="notice">A summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Proves two SQL queries equivalent by rewriting both, with admitted rewrite rules, to a common logical expression; the two derivations are the proof, returned as a replayable certificate, else UNKNOWN.
- Calcite plans, aligned by canonicalizers, then searched in one shared Volcano memo; rules are "inputs, assumed sound" (§1); replay re-runs them and checks reproducibility, not rule validity (§3.5).
- QO-Verify's memo idea as a standalone prover with an inspectable trust base; it reports proving 97 of 240 execution-agreeing LLM rewrites, against 35 for QED and 38 for SQLSolver (Tab. 3).

## In plain words

Two SQL queries are equivalent when they return the same result on every database that obeys the schema's constraints; checking rewriters and grading text-to-SQL both need this (abstract). Rather than model all of SQL in a solver, the authors reuse optimizers' rewrite rules: if rules assumed to preserve results turn both queries into one common expression, the two rewrite chains are the proof (§1). Their prover, EquiTrace, built on the Calcite optimizer framework, returns that chain for replay, or reports that it found none. On 240 LLM-written rewrites whose results agree on test databases, it proves 97 (abstract). QED and SQLSolver (earlier solver-based provers) prove 35 and 38 (Tab. 3). They call it complementary to verifying inside an optimizer (§2.3).

## Background and terms

**Terms to know:** [query equivalence](#/glossary/query-equivalence) · [bag semantics](#/glossary/bag-semantics) · [integrity constraint](#/glossary/integrity-constraint) · [query rewriting and rewrite rules](#/glossary/query-rewriting-and-rewrite-rules) · [transformation and implementation rules](#/glossary/transformation-and-implementation-rules) · [logical plan](#/glossary/logical-plan) · [memo](#/glossary/memo) · [semijoin](#/glossary/semijoin-and-anti-semijoin)

**The paper's own terms:**
- **admitted transformation**: a rewrite "assumed to preserve semantics whenever its applicability condition" holds (§3.2); conditions may rely on keys, foreign keys or nullability (§2.1). Kinds include optimizer rules, proof-oriented inverse rewrites, schema-dependent equalities (§3.1).
- **representation alignment**: rewriting both queries toward shared canonical forms; it "does not itself establish equivalence" (§3.4).
- **common witness**: the expression both derivations reach, the "same logical plan with compatible output contracts" (§3.3).
- **certificate / replay**: the recorded derivations, side conditions and witness; replay re-executes the named transformations "with their original implementations" (§3.5).

**Builds on:**
- QO-Verify ([QO-Verify](#/papers/narasayya2026qoverify "Leveraging Query Optimizers to Verify the Soundness of LLM-based Query Rewrites for Real-World Workloads, and More! (2026)")), which searches SQL Server's optimizer for a common expression (§1, §2.3).
- Apache Calcite ([Apache Calcite](#/papers/begoli2018calcite "Apache Calcite: A Foundational Framework for Optimized Query Processing Over Heterogeneous Data Sources (2018)")), whose `HepPlanner` runs the rewriting and `VolcanoPlanner` the memo search (§3.4).
- Baselines QED ([QED](#/papers/wang2024qed "QED: A Powerful Query Equivalence Decider for SQL (2024)")) and SQLSolver ([SQLSolver](#/papers/ding2023sqlsolver "Proving Query Equivalence Using Linear Integer Arithmetic (2023)")) (§4.3); pairs collected by ParSEval (generates test databases to compare two queries) ([ParSEval](#/papers/chen2025parseval "ParSEval: Plan-aware Test Database Generation for SQL Equivalence Evaluation (2025)")) and VeriEQL (checks equivalence on all databases up to a size bound) ([VeriEQL](#/papers/he2024verieql "VeriEQL: Bounded Equivalence Verification for Complex SQL Queries with Integrity Constraints (2024)")) (§4.1).

## Problem and setting

- **Question:** "can query-rewriting knowledge form the basis of a general, standalone SQL equivalence proof system?" (§1).
- **Semantics:** the running example is argued under bag semantics (Fig. 2); set against bag semantics in general, NULL handling and the SQL fragment covered: not discussed.
- **Corpora (§4.1, Tab. 1–2):** BIRD (a large text-to-SQL benchmark) and LeetCode (SQL exercises) pairs; literature pairs and Calcite's rule-test pairs; 331 rewrites by GPT-5.4 and SPA-32B-SI ("a specialist model fine-tuned from Qwen3-32B") of queries from DSB, TPC-H, TPC-DS (synthetic decision-support benchmarks) and StackOverflow workloads.
- **Labels and metric:** curated labels come from prior work, the rest from execution agreement (rewrites on 10GB test databases); parse failures, crashes, timeouts and UNKNOWN count as misses (§4.1).

## Approach

- **Proof model (§3.3):** a derivation from each query to a common witness, each step recording the facts its applicability relied on; UNKNOWN if none is found within the search budget.
- **Example (Fig. 2):** under bag semantics, the equivalence of a [correlated](#/glossary/correlated-subquery) EXISTS query and a join query depends on `S.rid` (the column of table S that both queries match on) being declared unique. One side becomes a semijoin, then a join by a uniqueness-guarded rule that Calcite has only in reverse. Without the constraint the result is UNKNOWN and replay rejects the certificate (§3.3).
- **Pipeline (§3.4, Fig. 3):** normalize both Calcite plans (including decorrelation); run the same canonicalizers on both until stable or a pass limit; close early on identical plans, both-empty plans or a shared memo class; otherwise run staged, bounded search attempts in one shared memo, where a later attempt may add rewrites, rules or budget.
- **Configuration (§4.1):** 15 canonicalizers, six rewrite programs and 83 memo-search rules, fixed for all cases; rules failing "preliminary system-wide validation" are excluded, among others.

## Results

- **Coverage (Tab. 2, §4.2):** it reports 648 of 1,106 expected-equivalent text-to-SQL pairs (58.6%: 87.4% of BIRD's, 37.9% of LeetCode's); 229 of 266 curated pairs (86.1%), including 210 of 232 Calcite rule tests.
- **LLM rewrites:** 97 of 240 (40.4%): 50.4% for SPA-32B-SI, 29.2% for GPT-5.4 (§4.2).
- **Against provers (Tab. 3, §4.3):** QED proves 35 and SQLSolver 38 of the same 240; the three together prove 114, so the authors call their fragments "complementary".
- **Which rules matter (§5.1):** over 764 recorded proofs, disabling each of the 20 most-used transformations, the join-region-ordering canonicalizer (puts a whole region of commutable joins into one canonical order) is needed for 40 of the 67 proofs using it, no other for more than 14, and ten for none: the rest of the library "usually provides an alternative route to the same witness".
- **Gaps (Tab. 4, §5.2):** of 143 unproved agreeing rewrites, 101 stop at the rule-application cap or timeout, which "suggest a search-capacity or pruning problem"; 39 saturate without overlap (search runs out of rewrites before the two sides meet), "stronger evidence of a missing transformation or canonical representation".
- **Conclusion (§6):** the authors conclude that coverage "depends less on larger search budgets than on" aligning queries to common representatives and applying transformations under schema constraints.

## Limits the authors state

- Execution labels "establish agreement on the tested instances, not semantic equivalence over all databases satisfying the schema" (§4.1).
- "failure to find a derivation is not evidence of inequivalence" (§3.3).
- Rules are "assumed sound" (§1); replay "checks that the recorded derivation is reproducible; rule-level semantic validity is the separate obligation" (§3.5).
- The 22 missed Calcite cases also depend on Calcite's normalization, decorrelation or rule registration, "so registering the rules alone does not guarantee a proof" (§4.2).
- "the current transformation library contains no general window normalization" (§5.2).

## Open problems and building blocks

- **Open:** no future work stated. Named bottlenecks: search capacity in large join regions, and missing representations, including for reordered UNION branches, existence tests moved across [CTE](#/glossary/common-table-expression-cte) boundaries, [outer joins](#/glossary/outer-join), [window functions](#/glossary/window-function), and scalar aggregation against materialized aggregate CTEs (§1, §5.2).
- **Released:** nothing stated.
- **To reuse it:** Calcite 1.38.0 (§4.1); the schema and constraints; a rule set, which "users may supply" (§1), whose soundness, they say, "may rely on formal verification, externally verified rewrite libraries, upstream validation, or rule-specific testing" (§3.2).

## On this site

- **Discussed in:** [Can SQL equivalence checkers be trusted?](#/challenges/checker_soundness) · [Canonical forms for queries](#/challenges/query_canonical_forms) · [Query equivalence: prove or refute](#/challenges/query_equivalence) · [Equivalence under schema constraints](#/challenges/schema_constrained_equivalence) · [Checking text-to-SQL against intent](#/challenges/text_to_sql_verification) · [Verified query speedups](#/challenges/verified_query_speedup) · [SQL features that verifiers don't cover](#/challenges/verifier_coverage_gaps)
- **Tags:** <span class="tags"><a class="tag" href="#/tags/method">method</a><a class="tag" href="#/tags/qo">qo</a><a class="tag sub" href="#/tags/dsl-sql">dsl-sql</a><a class="tag sub" href="#/tags/nl2dsl-eval">nl2dsl-eval</a><a class="tag sub" href="#/tags/prove-memo">prove-memo</a><a class="tag sub" href="#/tags/rewrite-eval">rewrite-eval</a><a class="tag sub" href="#/tags/rules-lib">rules-lib</a></span>
