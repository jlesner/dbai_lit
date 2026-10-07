# VeriEQL: Bounded Equivalence Verification for Complex SQL Queries with Integrity Constraints

**VeriEQL** · OOPSLA 2024

Read: [PDF](https://arxiv.org/pdf/2403.03193) · [arXiv](https://arxiv.org/abs/2403.03193) · [DOI](https://doi.org/10.1145/3649849)  
Code: [VeriEQL](https://github.com/VeriEQL/VeriEQL) · [VeriEQL-artifact-evaluation](https://zenodo.org/records/10795614)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Bounded equivalence verification of complex SQL with integrity constraints.
- Symbolic tuples in SMT: UNSAT means equivalent on all databases with at most N tuples per relation (§1); SAT gives a counterexample database. The code checks only relations of exactly the bound size.
- [ParSEval](#/papers/chen2025parseval "ParSEval: Plan-aware Test Database Generation for SQL Equivalence Evaluation (2025)")).

## In plain words

Two SQL queries are equivalent if they return the same result on every database. It matters for validating query rewrites and grading submitted queries, and the authors argue that real queries use features (sorting, CASE, NULL values, keys and other table rules) that earlier checkers rarely support (§1). VeriEQL checks equivalence only on small databases: those with at most a chosen number of rows per table that obey the schema's rules. It asks an off-the-shelf [SMT solver](#/glossary/sat-and-smt-solvers) whether some such database makes the two queries differ. If the solver finds none, the queries agree on every such database; if it finds one, that database is a counterexample that obeys the rules. The authors present it, "to the best of our knowledge", as "the first SMT-based approach" for complex queries (abstract) and prove its encoding correct against their own definition of SQL (§1). On 24,455 query pairs they report settling 77% (proved for small sizes or disproved), against under 2% for the best earlier small-size checker and under 1% disproved by testing tools (§1).

## Background and terms

**Terms to know:** [query equivalence](#/glossary/query-equivalence) · [bounded verification](#/glossary/bounded-verification) · [integrity constraint](#/glossary/integrity-constraint) · [uninterpreted function](#/glossary/uninterpreted-function) · [bag semantics](#/glossary/bag-semantics) · [list semantics](#/glossary/list-semantics) · [NULL and three-valued logic](#/glossary/null-and-three-valued-logic) · [counterexample database](#/glossary/counterexample-database) · [small-scope hypothesis](#/glossary/small-scope-hypothesis) (attributed to [RATest](#/papers/miao2019ratest "Explaining Wrong Queries Using Small Examples (2019)"), §6.2)

**The paper's own terms:**
- **bounded equivalence modulo integrity constraint** (Def. 3.5): two queries return the same result on every database that conforms to the schema (right relations, attributes and types; Def. 3.3), satisfies the constraint, and has at most N tuples (rows) in each relation (table), for a positive integer bound N.
- **semantics** (§3.3, Fig. 5): a [formal semantics](#/glossary/formal-semantics) mapping databases to results, written with list operations (map, filter, fold).
- **symbolic tuple** (§2, §4.2): for bound N, each relation of the symbolic database gets N placeholder tuples whose attribute values are solver unknowns; each attribute is an uninterpreted function from tuple to value.
- **Del** (§4.2): a yes/no unknown per symbolic tuple saying it is absent. Since the solver chooses it freely for base relations, N placeholders stand for every relation with at most N tuples. Operators never drop tuples, they mark them deleted, so each intermediate result has a fixed number of symbolic tuples (Fig. 11).
- **NULL encoding** (§4.2): each value is a pair of a NULL flag and a number; all NULLs count as equal when tuples are compared.
- **checked / refuted / unsupported** (§6.2): the evaluation's outcomes. The bound is raised from 1; "checked" means no counterexample before the 10-minute timeout and bounded equivalence verified for at least bound 1; "unsupported" means a feature or constraint the tool lacks.
- **genuine counterexample** (§6.3): it meets the pair's constraint and the queries give different outputs on it; others are [spurious](#/glossary/spurious-counterexample). **-noIC** (§6.3): a run with all constraints dropped.

**Builds on:**
- Mediator ([Mediator](#/papers/wang2017mediator "Verifying Equivalence of Database-Driven Applications (2017)"); verifies database applications over different schemas, §7): the semantics is "inspired by" it (§1, §3.3).
- The bounded checkers Cosette ([Cosette](#/papers/chu2017cosette "Cosette: An Automated Prover for SQL (2017)"); goes through the solver-aided language Rosette) and Qex (a symbolic SQL query explorer using a solver theory of lists; not listed here), both with the provenance-based pruning of [Speeding up symbolic reasoning…](#/papers/wang2018symbolic "Speeding up symbolic reasoning for relational queries (2018)") (narrowing the search to input tuples that can affect the output): the main baselines (§1, §6.1).
- The full (unbounded) verifiers SPES ([SPES](#/papers/zhou2020spes "SPES: A Symbolic Approach to Proving Query Equivalence Under Bag Semantics (2022)")), HoTTSQL ([HoTTSQL](#/papers/chu2016hottsql "HoTTSQL: proving query rewrites with univalent SQL semantics (2017)")) and UDP ([UDP](#/papers/chu2018udp "Axiomatic foundations and algorithms for deciding semantic equivalences of SQL queries (2018)")), the last two built on [proof assistants](#/glossary/proof-assistant) (§6.1).
- The testing tools DataFiller (a random database generator) and XData ([XData](#/papers/chandra2014xdata "Data generation for testing and grading SQL queries (2015)"); [mutation testing](#/glossary/mutation-testing)) (§6.1).

## Problem and setting

- **Question** (§3.5, §4.1): given two queries, a schema, an integrity constraint and a bound N, decide bounded equivalence, or return a database on which the queries differ.
- **SQL fragment** (Fig. 4, §3.2): selection (filtering rows), projection (choosing columns), renaming, DISTINCT, set and bag UNION, INTERSECT and EXCEPT, product (all pairs of rows), inner and outer joins, GROUP BY with HAVING, WITH, top-level ORDER BY; arithmetic, the aggregates COUNT, MIN, MAX, SUM, AVG (not nested), IF, CASE, IS NULL, IN over a list or subquery. No [correlated subqueries](#/glossary/correlated-subquery) or window functions (App. C.1), no LIMIT (§6.2).
- **Types** (§3.1): integers and booleans; strings and dates "can be treated as Int".
- **Semantics** (§3.3): bags; three-valued logic, "Similar to standard SQL". ORDER BY is a deterministic selection sort with NULL smallest, and sorted results are compared as lists (§4.5).
- **Constraints** (Fig. 7, §3.4): primary key, foreign key, NOT NULL, CHECK (comparisons and value lists), auto-increment (starts at a given value, rises by one per tuple).
- **Benchmarks** (§6.1): 24,455 pairs. LeetCode: 23,994 accepted user queries from the programming site, each paired with a "ground-truth" query the authors wrote and call "guaranteed to be correct"; schemas and constraints written by hand. Calcite: 397 pairs from the rewrite-rule tests of Apache Calcite (a query optimizer framework). Literature: 64 pairs from earlier papers.

## Approach

- **Top level** (Alg. 1, §4.1): its procedure Verify builds the symbolic database, encodes the constraint and each query operator by operator, asserts that the outputs differ, and calls the SMT solver Z3 (§5). Unsatisfiable means bounded equivalent; otherwise the solver's model (the values it found for the unknowns) becomes a counterexample database.
- **Constraint encoding** (§4.3, Fig. 8): one rule per constraint kind; e.g. a foreign key says each referencing tuple equals some referenced tuple on the key.
- **Query encoding** (§4.4): inference rules (if-then rules applied to the query's structure) give each subquery's attributes (Fig. 10), its number of symbolic tuples (Fig. 11; a left outer join adds a NULL-padded slot per left tuple), and a formula linking input and output tuples (Fig. 12 samples; all rules in App. B). Expressions follow three-valued logic (§4.4.3).
- **Comparing outputs** (§4.5): as bags, same number of present tuples and same count of each (Eqs. 1–2); for sorted queries, the ORDER BY encoding moves deleted tuples last and outputs are compared position by position (Eqs. 3–4).
- **Theorems** (proofs in App. D; §1 promises "detailed correctness proofs"). An interpretation (Def. 4.3) gives values to a formula's unknowns and functions.
  - Lemma 4.2: if a constraint's formula over a symbolic database is satisfiable, its model is a database consistent with the symbolic database that satisfies the constraint; if unsatisfiable, no such database satisfies it.
  - Thm. 4.5 (no database missed): for a query, a concrete database over the schema, a symbolic database over that schema with the query's output and formula built by the rules, and any interpretation mapping the symbolic database to the concrete one, some extension of it (Def. 4.4: same values on the old unknowns and Del, values for new ones) makes the symbolic output equal the query's real result and satisfies the formula.
  - Thm. 4.6 (solver answers are real): with output and formula built the same way, every interpretation satisfying the formula gives a concrete database on which the query yields the interpreted output.
  - Lemma 4.7: [valid](#/glossary/satisfiable-and-valid) (true for every assignment) bag formulas (Eqs. 1–2) mean the outputs are equal as bags; valid list formulas (Eqs. 3–4), equal as lists.
  - Thm. 4.8: if Verify reports equivalence, the queries are bounded equivalent modulo the constraint at bound N; if it returns a database, it conforms to the schema and the queries' results on it differ.

## Results

- **Coverage (research question RQ1, §6.2, Fig. 13):** the authors report proving (within bounds) or disproving 77% of all pairs, against under 2% for the best earlier bounded checker and under 1% disproved by testing tools (§1). On LeetCode, Cosette and Qex support no pairs; VeriEQL refutes 14.9%, DataFiller 0.5%. On Calcite, Cosette, Qex and HoTTSQL are scored unsupported for lacking NOT NULL. On Literature VeriEQL is "comparable with bounded verification baselines".
- **Checking "checked" (§6.2):** 50 sampled LeetCode "checked" pairs were all confirmed equivalent by hand. Of 34 "checked" Literature pairs, 7 are not equivalent: for 5 the baselines give only spurious counterexamples, and 2 need over 1000 tuples, which Cosette disproves and VeriEQL cannot in time.
- **Counterexamples (RQ2, §6.3, Fig. 14):** 3,586 LeetCode refutations, 3,584 genuine (the other two expose a MySQL bug), against VeriEQL-noIC's 11,390, only 2,754 genuine.
- **Bugs (§6.3, App. C.2):** the MySQL 8.0.32 bug was confirmed as "serious"; most LeetCode problems the authors reported were confirmed and fixed, tests often missing the NULL case; Calcite confirmed bugs in rewrite rules (one new, on SUM over an empty table) and in a translation step.
- **Bounds (RQ3, §6.4, Fig. 15; App. C.3 Tab. 1):** of checked LeetCode pairs, 71% reach bound 5, 28% bound 10 and 3% bound 100 within 10 minutes; Literature reaches lower bounds.

## Limits the authors state

- Bounded verification "may not be able to disprove equivalence within a practical amount of time if the counterexample can only be large input relations" (§6.2).
- LIMIT and COUNT against a large constant "could potentially break the small scope hypothesis"; VeriEQL "simply increments the size of the input database from one" (§6.2).
- The manual inspection of "checked" verdicts is "non-exhaustive" (§6.2).
- No window functions (App. C.1) or LIMIT (§6.2); only Int and Bool (§3.1); auto-increment by exactly one, "not a fundamental limitation" (§3.4).
- On Literature, results only comparable to bounded baselines, "hypothetically because baselines were better-engineered for Literature queries" (§6.2).
- "One limitation" is no support for correlated subqueries, which "can be overcome by incorporating unnesting techniques" (rewriting them into joins) (§7).

## Open problems and building blocks

- **Open:** comparing their semantics with other formal SQL semantics is "an interesting direction for future work" (§7).
- **Released:** "The software that implements the techniques described in Section 4 and supports the evaluation results reported in Section 6 is available on Zenodo" (Data-Availability Statement).
- **To reuse it:** Z3 (§5); two queries, the schema, its integrity constraint and a bound as input (§1); the fragment of Fig. 4.

## On this site

- **Discussed in:** [Benchmarks with checkable ground truth](#/challenges/checkable_benchmark_ground_truth) · [Can SQL equivalence checkers be trusted?](#/challenges/checker_soundness) · [Refuting faulty rewrite rules](#/challenges/faulty_rewrite_rules) · [Minimal counterexamples](#/challenges/minimal_counterexamples) · [Equivalence of nondeterministic queries](#/challenges/nondeterministic_equivalence) · [Query equivalence: prove or refute](#/challenges/query_equivalence) · [Sourcing realistic, hard query pairs](#/challenges/query_pair_sourcing) · [Equivalence under schema constraints](#/challenges/schema_constrained_equivalence) · [SQL features that verifiers don't cover](#/challenges/verifier_coverage_gaps)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/bounded-smt">bounded-smt</a><a class="tag sub" href="#/tags/cex-smt">cex-smt</a><a class="tag sub" href="#/tags/pairs-check">pairs-check</a></span>
