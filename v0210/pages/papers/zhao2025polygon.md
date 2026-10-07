# Polygon: Symbolic Reasoning for SQL using Conflict-Driven Under-Approximation Search

**Polygon** · PLDI 2025

Read: [PDF](https://arxiv.org/pdf/2504.06542) · [arXiv](https://arxiv.org/abs/2504.06542) · [DOI](https://doi.org/10.1145/3729303)  
Code: [polygon-artifact-evaluation](https://zenodo.org/records/15059866) · [polygon-sql](https://github.com/polygon-sql/polygon)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Generates an input database on which several queries' outputs satisfy a property, e.g. two queries differ.
- Conflict-driven *under-approximation* search instead of encoding the full semantics at once.

## In plain words

Given several SQL queries and a property their outputs should have, such as two queries returning different results, the paper looks for a database on which the property holds. Such a database disproves that two queries are equivalent, or tells apart candidate queries from a tool that writes queries from examples (§1). Their motivation (§1): testing tools ignore what queries mean and miss subtle differences, while formal tools turn each query's complete meaning into one large logic formula that is slow to solve. Polygon instead encodes only a restricted slice of each query's possible inputs and searches a family of such slices, which the abstract says makes the approach "complete". With a one-minute timeout, it disproves 5,497 of 24,455 query pairs, against 3,177 for VeriEQL, an earlier checker built on a logic solver (§4). The authors write: "To the best of our knowledge, no existing work can efficiently generate such inputs for an expressive subset of SQL" (§1).

## Background and terms

**Terms to know:** [symbolic execution](#/glossary/symbolic-execution) · [SAT and SMT solvers](#/glossary/sat-and-smt-solvers) · [satisfiable and valid](#/glossary/satisfiable-and-valid) · [over-approximation and under-approximation](#/glossary/over-approximation-and-under-approximation) · [bounded verification](#/glossary/bounded-verification) · [query equivalence](#/glossary/query-equivalence) · [counterexample database](#/glossary/counterexample-database) · [soundness and completeness](#/glossary/soundness-and-completeness) · [unsat core](#/glossary/unsat-core) (Polygon reads the conflicting nodes from it, §3.6)

**The paper's own terms:**
- **application condition** (C): a solver formula over the queries' outputs that the database must make true, e.g. that two outputs differ, for **equivalence refutation (ER)** (§1, §4).
- **query disambiguation**: find a database that divides n queries into disjoint groups, with equal outputs inside a group and different outputs across groups, as needed when synthesizing queries from input-output examples (§1); the evaluation asks for an even split into two groups (§4; App. D).
- **reachable output**: one the query really returns on some input (§1, §3.2).
- **UA (under-approximation) choice**: an array with one value per input row (or row pair, for joins) of an operator, picking out a subset of its inputs (§3.2). For Filter, T means the row is present and passes, F that it is absent or fails, and the "top" value ★ allows either.
- **top UA / minimal UA**: all ★ / no ★ (§3.2). A UA **refines** another that agrees with it wherever the other is not ★; this order is the **lattice of UAs**.
- **UA map** (M): a UA for each node of the queries' abstract syntax trees (ASTs). A **satisfying UA map** gives every node a minimal UA and makes the encoding plus C satisfiable (Def. 3.4).
- **conflict**: the part of a UA map on a node set V whose encoding plus C is already unsatisfiable (§3.6).
- **sound / complete**, the paper's sense: every returned database satisfies C (Thm. 3.11); when nothing is returned, no satisfying database exists under the semantics of Fig. 8 (Thm. 3.12).

**Missing glossary terms:**
- **incorrectness logic**: O'Hearn's program logic about outputs a program can really reach. The authors say it inspired the work (§5) and that their UA notion is "consistent with" its idea of under-approximation (§3.2); not listed here.

**Builds on:**
- VeriEQL ([VeriEQL](#/papers/he2024verieql "VeriEQL: Bounded Equivalence Verification for Complex SQL Queries with Integrity Constraints (2024)")): semantics, table encoding (§3.1, §3.3) and ER pairs (§4).
- Cubes, "a state-of-the-art SQL synthesizer" (§4), whose tasks seed the disambiguation benchmarks; not listed here.

## Problem and setting

- **Question** (§1): given n queries and a condition C over their outputs, generate a database on which C holds.
- **SQL fragment** (§3.1, Fig. 7): projection, filter, rename, [bag](#/glossary/bag-semantics) union (keeps duplicates), product, inner and outer joins, Distinct, GroupBy with HAVING, ascending OrderBy, With; if-then-else, CASE, IN-subqueries, EXISTS, NULL, IsNull, and Count, Min, Max, Sum, Avg.
- **Semantics:** from VeriEQL (§3.1, §3.3). How comparisons with NULL evaluate is not discussed; [integrity constraints](#/glossary/integrity-constraint) are not discussed.
- **Bounds:** tables of at most n rows (§3.3); UA sizes 2 to 16 per dimension, set heuristically (§3.4 footnote 7).
- **Benchmarks** (§4): 24,455 ER pairs from VeriEQL; more than 20,000 pair a LeetCode (coding-practice site, §2) ground-truth query with a user query LeetCode accepted. Disambiguation: queries synthesized for a Cubes task are grouped into classes VeriEQL finds equivalent up to a bound b (VeriEQL bounds rows per table, §2); a benchmark takes 25 or 50 queries from each of two classes, giving 4,245 D-50 and 2,475 D-100 benchmarks, "solvable by construction" (Fig. 9 caption).

## Approach

- **Encoding** (§3.3, Fig. 8; all operators in App. B): each table is n unknown rows, each possibly marked deleted; each operator's semantics becomes a solver formula with a UA variable per row or row pair recording which case applies; for Filter, case T copies a present, passing row to the output, case F deletes the output row. Aggregates are "always precisely encoded (i.e., no UAs)" (§3.3).
- **UA encoding** (§3.4): that formula plus constraints fixing the UA variables to the UA's values (★ allows any); per-node parts are joined and labelled.
- **Search** (Alg. 2, §3.6): start empty. If the encoding plus C is satisfiable, replace each UA by the values in the solver's model (its satisfying assignment) and add the next batch of nodes (all nodes of k queries, k a tuned setting, §4.1) with top UAs; stop when every node is in. If unsatisfiable, the unsat core's nodes form the conflict.
- **ResolveConflict** (Alg. 3, §3.7): record the conflict; try each combination from the conflict nodes' covering sets (UA sets such that every minimal UA refines one of them), encoding only those nodes plus C; record failures as new conflicts. On success, add the UA choices (not the semantics) of all other nodes, forbid every recorded conflict, and read the new map from a model; return nothing if all fail. Polygon's covering sets fix 8 positions to ★ in the experiments and enumerate the rest (§4.1).
- **Theorems** (§3.8; proofs in App. C):
  - For any operator of Fig. 7 and any UA in its family, every solution of the UA encoding gives inputs and an output that agree with the operator's exact semantics: Thm. 3.9.
  - For an operator and two UAs of its family where the second refines the first, the first's encoding implies the second's: Thm. 3.10.
  - For any queries and C, a returned database makes C true on the queries' real outputs: Thm. 3.11.
  - For any queries and C, if nothing is returned, no database satisfies C with respect to the semantics of Fig. 8: Thm. 3.12.
  - The search terminates, and returns nothing only when every map of minimal UAs is unsatisfiable with C: Lemma C.7.

## Results

- **Setup** (§4.1–4.2): research questions RQ1–RQ3 (benchmarks solved, prior tools, ablations); 1-minute timeout for Polygon and all baselines. ER baselines: VeriEQL; Cosette (built on the Rosette solver-aided language) and Qex (solver-based), both with provenance pruning, which shrinks the search space before solving ([Speeding up symbolic reasoning…](#/papers/wang2018symbolic "Speeding up symbolic reasoning for relational queries (2018)")); DataFiller (random-data fuzzer); XData (mutation-based tester for common SQL mistakes, §5); EvoSQL (random and genetic search). Disambiguation: Cubes' fuzzing-based component, a modified VeriEQL that encodes many queries and the split condition, and DataFiller.
- **RQ1** (§4.1, Tab. 1): 5,497 of 24,455 ER pairs refuted, median 0.1 s. Conflicts are small: median 4, average 5.1 nodes on ER.
- **RQ2** (§4.2, Fig. 9): ER 5,497 against VeriEQL 3,177 and at most 1,824 for the others; medians 0.1 s and 0.4 s for Polygon and VeriEQL, each over its own solved pairs. Disambiguation: 94.3% of D-50 and 96.6% of D-100, against 76.2% and 67.9% for the modified VeriEQL and at most 55.5% for the others. The finding box: "1.7x more benchmarks solved for equivalence refutation and 1.4x for disambiguation".
- **RQ3** (§4.3, Figs. 11–12): brute-force enumeration ablations are "significantly worse"; ablations of lower-level choices are "on par" on ER and D-50, except MinUAsCover (covering sets of all minimal UAs), but solve 14–48% of D-100 against 97%. All design choices "play an important role".

## Limits the authors state

- Their "full semantics" "is still bounded, in that it considers tables up to a finite size bound" (§3.3).
- For the ER pairs VeriEQL did not refute, "the solvability for the rest is unknown (and manually checking these benchmarks is a non-starter)" (§4).
- For an unsolved disambiguation task, it is unclear whether "it is not solvable at all, or is it due to Polygon's inability?" (§4).
- "Polygon slows down when disambiguating more queries, which is expected" (§4.1).
- The nodes added per iteration have "a significant impact on the overall performance" (§4.1 "Discussion").

## Open problems and building blocks

- **Open:** "one interesting future direction is to build the idea on top of the Rosette solver-aided programming language": an interpreter that runs programs on unknowns, parameterized by a UA (§6).
- **Released:** an artifact "that implements the techniques and supports the evaluation results reported in this paper" (§ "Artifact Availability Statement").
- **To reuse it:** an SMT solver (z3 in the overview, §2); queries in the Fig. 7 language with their schema (§3.4); tuned heuristics (§4.1).
- **Beyond its domain:** the authors "believe the underlying principles have the potential to generalize to other languages and domains", e.g. "programs representable using a loop-free composition of blocks (like an AST)", assuming "analyzing an under-approximation (UA) of a program is cheap" and a lattice of UAs (§6).

## On this site

- **Discussed in:** [Benchmarks with checkable ground truth](#/challenges/checkable_benchmark_ground_truth) · [Query equivalence: prove or refute](#/challenges/query_equivalence) · [SQL features that verifiers don't cover](#/challenges/verifier_coverage_gaps)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/bounded-smt">bounded-smt</a><a class="tag sub" href="#/tags/cex-smt">cex-smt</a></span>
