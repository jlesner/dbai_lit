# An Extensible and Verifiable Language for Query Rewrite Rules

**RuleScript** · preprint May 2026

Read: [PDF](https://arxiv.org/pdf/2605.05536) · [arXiv](https://arxiv.org/abs/2605.05536)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- An engine-independent DSL for query rewrite rules, with matching and transformation phases.
- Rules are automatically formally verified (QED group, Berkeley); Calcite rules reimplemented on CockroachDB and DataFusion.
- Rules are verified once by QED, so no per-query check is needed; the adapters that run them are trusted, not verified (§7.2). The contrast with LLM rewriting is ours; the paper doesn't discuss LLMs.

## In plain words

Database optimizers speed up queries with rewrite rules: a rule spots a shape in a query's plan and swaps in an equivalent, potentially more efficient shape. The authors say such rules are typically hand-written for one engine and often lack correctness proofs, so each new engine re-implements them and risks new bugs; checking every rewritten query with an equivalence prover instead can, they say, be too expensive for an optimizer's tight time limits (abstract, §1). They built RuleScript, a rule language: a rule is a before-pattern and an after-pattern with placeholders that stand for any input subplan, expression or row type. A prover, QED, checks each rule once for every way of filling the placeholders, and a per-engine adapter runs it. They rewrote 33 rules from the Calcite optimizer framework, all proved, and ran them in two other engines, CockroachDB and DataFusion, except DataFusion's set-operation rules (§7.1). The rules are reported to take about 3.7× fewer lines than Calcite's own implementations. They present the result as a "write once, deploy everywhere" paradigm (abstract).

## Background and terms

**Terms to know:** [query rewriting and rewrite rules](#/glossary/query-rewriting-and-rewrite-rules) · [logical plan](#/glossary/logical-plan) · [query optimizer](#/glossary/query-optimizer) · [query equivalence](#/glossary/query-equivalence) · [bag semantics](#/glossary/bag-semantics) · [list semantics](#/glossary/list-semantics) · [semijoin](#/glossary/semijoin-and-anti-semijoin) · [SMT solvers](#/glossary/sat-and-smt-solvers) · [semiring expression](#/glossary/k-relation-and-semiring-semantics)

**The paper's own terms:**
- **pattern**: a plan skeleton whose parts may be placeholders. A **rule** pairs a **match pattern** `q_from` with a **transform pattern** `q_to`, plus an optional logical condition on the placeholders (a "first-order constraint"), "e.g., requiring a function to be injective" (§3.1).
- **uninterpreted symbols**: the placeholders, of three kinds (§3.1). A **type symbol** stands for a whole row type, not one column; every type must support equality and contain a Null value. A **function symbol** stands for any expression of its declared type; an aggregate one maps a bag of rows to one value, like `Sum`. A **plan symbol** stands for any subplan. `Empty(σ)` matches only plans that produce no rows, with `σ` a type symbol for their row type (Fig. 2). When QED checks a rule, its SMT solver handles the placeholders (§5.2); for function symbols this is the solver's [uninterpreted function](#/glossary/uninterpreted-function).
- **instantiation**: one choice of concrete types, expressions and subplans for all placeholders (§3.2).
- **custom operator**: an engine-specific operator (e.g. a semi-join) defined by its meaning in core operators (Fig. 3); a **handler** is the backend code that recognizes such a node and extracts its parameters (§4).
- **adapter**: per-engine code that runs rules, either an **interpreter** that matches patterns at run time or a **code generator** that emits rules in the engine's own format (§6).
- **transformation categories**: Transpose (reorder adjacent operators), Merge (combine operators of one type), Pushdown (move predicates toward base tables), Join Transformations, Simplification, Expansion (§7.1).

**Builds on:**
- QED ([QED](#/papers/wang2024qed "QED: A Powerful Query Equivalence Decider for SQL (2024)")), the equivalence prover RuleScript is built on (§7), chosen as "currently the only automated query equivalence solver with this capability and sufficient coverage of SQL features" (§5).
- HoTTSQL ([HoTTSQL](#/papers/chu2016hottsql "HoTTSQL: proving query rewrites with univalent SQL semantics (2017)"), cited as Chu 2017), a SQL-based language for proving rules, with the Cosette prover ([Cosette](#/papers/chu2017cosette "Cosette: An Automated Prover for SQL (2017)")): "an important step in this direction" of checking rules rather than queries; the authors say it lacks full Null and integrity-constraint support and engine integration (§1) and needs "manual proof construction" (§8).
- CockroachDB's Optgen, a rule language that generates engine code; such languages are, the authors say, "tightly coupled to a single engine and lack formal verification guarantees" (§1).
- Apache Calcite ([Apache Calcite](#/papers/begoli2018calcite "Apache Calcite: A Foundational Framework for Optimized Query Processing Over Heterogeneous Data Sources (2018)")), a Java optimizer framework: the source of the 33 rules, and a target through its `RelRule` API (§6.3, §7.1).

## Problem and setting

- **Question:** can rewrite rules be written once, proved once for all inputs, and run in several engines (§1, §2)?
- **Correctness:** both patterns give the same result for every instantiation (§3.1–3.2).
- **Fragment:** core operators `Empty`, `Filter`, `Project`, inner `Join`, `Union`, `Distinct` and `Aggregate` (group by a key function, aggregate each group); predicates with and/or/not, =, ≠, is null and a test that a subplan is non-empty (Fig. 2). Other joins come in as custom operators (§3.2.2).
- **Semantics:** bag semantics, from QED; `Sort` and `Window` "are excluded from RuleScript's current scope" (§5.1).
- **Engines and workload:** Calcite, CockroachDB (a commercial database, §1) and DataFusion (an engine whose rules are Rust functions over its plan trees, §8); the 22 TPC-H queries, a standard decision-support benchmark (§7.4).
- **Not discussed:** how predicates behave on Null values ([three-valued logic](#/glossary/null-and-three-valued-logic)), and rules that depend on keys or other schema constraints.

## Approach

- **Running example (§2, Eq. 1–3):** a semi-join (keep each left row with a matching right row) above an aggregate can move below it when the join condition uses only the group key, so rows are filtered before aggregation. The rule encodes that condition by giving the predicate symbol `P` only the key and the right row, and rewrites it as `P(G(x), y)`, with `G` the key function (Eq. 3). The authors say this rewrite "is absent from all 3 database engines that we integrate RuleScript with" (§2).
- **Applying a rule (§3.2):** match finds an instantiation under which `q_from` equals a subplan; transform builds `q_to` under it. Verification covers every instantiation, "hence every rule only needs to be verified once"; a valid instantiation the matcher misses "simply means the rule does not fire, so that correctness is unaffected".
- **Custom operators (§4):** the user gives a name, typed parameters, an output type and a meaning in core operators; the semi-join is a filter keeping a left row when the filtered right input is non-empty (Eq. 4). Verification expands the definition; execution keeps the node whole. "As long as the semantics faithfully captures the operator's meaning, the correctness proof carries over to any rule that uses it" (§4).
- **Verification (§5):** placeholders stay uninterpreted, custom operators are expanded, and the pair goes to QED (Eq. 5; input syntax in Tab. 1). QED turns each plan into a semiring expression, normalizes it into a finite sum of terms, and tries to match terms pairwise with an SMT solver's help; "A pair of terms are provably equal if the underlying SMT solver cannot find a counter-example that distinguishes them" (§5.2).
- **Execution (§6):** matching walks the match pattern top-down, recording bindings, including which concrete columns each type symbol covers; transforming builds the output bottom-up (§6.1). DataFusion gets a Rust interpreter where each rule only supplies its two patterns (§6.2); Calcite and CockroachDB get code generators emitting Java `RelRule` classes and Optgen rules (§6.3, Listing 1).

## Results

- **Coverage (§7.1, Tab. 3):** the authors implemented 33 of Calcite's 91 core rewrite rules, chosen to cover all core operator types and "all six transformation categories that are represented in Calcite"; the other 58 use `Sort`, `Window` or `Sample`, which QED does not support, or are expression-level simplifications. All 33 were verified, "with each proof completing within 5 seconds". Coverage is highest for merge and pushdown, and the largest absolute gap is in simplification.
- **Portability (§7.1–7.2):** the rules were ported to all three engines except DataFusion's set-operation rules; DataFusion also gets rules with custom left and right semi-joins (§7.1). Adapters take 518 lines for Calcite, 836 for CockroachDB and 1,657 for DataFusion (Tab. 4), a one-time cost: a new rule needs no adapter change (§7.2).
- **Effort (§7.3, Tab. 5):** 1,051 lines in RuleScript against 3,877 in Calcite (median 21 against 94 per rule, "approximately 3.7× more compact") and 594 in Optgen (median 18). The gap is largest for transpose and smallest for expansion rules. DataFusion is left out because its native optimizer bundles rules into large passes.
- **Validation (§7.4):** for CockroachDB, test queries for each of the 33 rules confirmed it fired and the optimized expression tree "matched the expected semantics"; for DataFusion, 79 unit tests ported from Calcite, "covering all 22 implemented rules", compare outputs with expected plans, and all passed.
- **TPC-H (§7.4):** with the 33 generated Optgen rules added, 18 of 22 queries triggered at least one, and CockroachDB's extended optimizer reached "a geometric mean speedup of 1.5×" over the unmodified one, credited mainly to filter-pushdown and join-reordering rules. In DataFusion, 14 of 22 queries were optimized by at least one rule. They say rule matching and transformation "add no observable latency in either backend" in their prototype.

## Limits the authors state

- "The adapter and interpreter are not themselves formally verified: they are trusted components that translate verified rules into executable form"; they argue three properties limit this trust (§7.2).
- `Sort` and `Window` need list semantics while QED works under bag semantics, and `Sample` needs a probabilistic framework QED lacks; expression-level simplifications such as constant folding are outside RuleScript's scope (§7.1).
- DataFusion's set operators are represented differently from Calcite's, "preventing direct translation of these rules" (§7.1).
- The matcher maps each type symbol to concrete columns either positionally (one column, by position) or by dependencies (every column its matched expressions use); the two "differ only in which concrete plans the matcher can successfully match" (§6.1).
- Code-generation adapters "require the target to provide such a framework" (§7.2).
- A few simple rules are as long as or slightly longer than Calcite's, from fixed schema and symbol declarations; Optgen rules are shorter than RuleScript's (§7.3).

## Open problems and building blocks

- **Open:** the `Sort`, `Window` and `Sample` gaps "could be lifted by extending the solver in future work, as we are unaware of any solver that currently can handle such operators" (§7.1). The matcher splits conjunctions greedily; "more sophisticated strategies (e.g., backtracking or constraint-based) could recover additional matches" (§6.1).
- **Released:** Nothing stated (no artifact statement in the text or on PDF page 1).
- **To reuse it:** the QED prover (§5); one adapter per engine, a code generator where the engine has a rule framework, else an interpreter (§7.2); a handler per custom operator per engine (§4).

## On this site

- **Discussed in:** [Can SQL equivalence checkers be trusted?](#/challenges/checker_soundness) · [Refuting faulty rewrite rules](#/challenges/faulty_rewrite_rules) · [Discovering new rewrite rules](#/challenges/rewrite_rule_discovery) · [SQL features that verifiers don't cover](#/challenges/verifier_coverage_gaps)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/pairgen-apply">pairgen-apply</a><a class="tag sub" href="#/tags/rewrite-classic">rewrite-classic</a><a class="tag sub" href="#/tags/rewrite-smt">rewrite-smt</a><a class="tag sub" href="#/tags/rules-lib">rules-lib</a><a class="tag sub" href="#/tags/rules-verify">rules-verify</a></span>
