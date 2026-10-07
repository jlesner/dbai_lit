# Verifying SQL Queries using Theories of Tables and Relations

**Verifying SQL Queries using…** · LPAR 2024

Read: [PDF](https://arxiv.org/pdf/2405.03057) · [arXiv](https://arxiv.org/abs/2405.03057) · [DOI](https://doi.org/10.29007/rlt7)  
Code: [cvc5](https://github.com/cvc5/cvc5)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Extends cvc5's SMT theories of bags (as a theory of tables) and of relations, and adds a theory of nullable sorts, for SQL queries with join, projection and selection (abstract).
- Supports both bag and set semantics.
- An SMT-native alternative to the provers it compares with, SQLSolver and SPES (§1.1, §5), whose developers acknowledged false "equivalent" verdicts that it exposed (§5); its printed calculus is unsound without a premise the first author later added to cvc5.

## In plain words

Deciding whether two SQL queries always return the same table is useful for query optimization and for sharing subqueries in cloud databases, where the authors note a financial incentive because cloud databases charge for storage, network and computation (§1). The authors encode SQL queries as formulas for an [SMT solver](#/glossary/sat-and-smt-solvers), a general-purpose logic solver, and extend three existing theories (sets of symbols with fixed meanings) in the solver cvc5: tables as multisets of rows, for SQL's duplicate-keeping semantics; tables as sets of rows; and values that may be NULL (abstract, §1). They prove when the reasoning procedure is sound and when it stops (§2–§3). On 88 equivalence problems derived from optimization rewrites of Apache Calcite (a database framework), under multiset semantics with a 10-second limit for cvc5, it proves 42 pairs equivalent, against 54 for SPES and 87 for SQLSolver, two specialized checkers (§5). It exposed wrong equivalence verdicts in both, which their developers acknowledged (§5). The authors present it as an "alternative solution" (§1), not limited to equivalence and built into a general solver.

## Background and terms

**Terms to know:** [query equivalence](#/glossary/query-equivalence) · [bag semantics](#/glossary/bag-semantics) · [set semantics](#/glossary/set-semantics) · [SAT and SMT solvers](#/glossary/sat-and-smt-solvers) · [satisfiable and valid](#/glossary/satisfiable-and-valid) · [decidable and undecidable](#/glossary/decidable-and-undecidable) · [soundness and completeness](#/glossary/soundness-and-completeness) · [NULL and three-valued logic](#/glossary/null-and-three-valued-logic) · [nonlinear integer arithmetic](#/glossary/linear-and-nonlinear-integer-arithmetic) · [algebraic datatype](#/glossary/algebraic-datatype)

**The paper's own terms:**
- **theory of tables (T_Tab)**: tables are finite bags of tuples, with columns indexed by number from 0 (§2, Fig. 1). Its operators work on **multiplicities**, how often an element occurs in a bag (§2).
- **filter and map**: filter keeps the elements that satisfy a predicate, with their counts; map applies a function to every element, adding up the counts of elements sent to the same value (§2). They take a function as argument, so they need a solver that "supports higher-order logic", as cvc5 does (§2). A function is **injective** if no two inputs share an output.
- **calculus, configuration, closed, saturated**: the calculus is a set of derivation rules; each takes the solver's state (a configuration: three sets of constraints, arithmetic, table and element, or unsat) and extends it or splits it into branches. A derivation tree is closed if it is finite and every leaf is unsat; a configuration is saturated when no rule adds anything new (§2.1).
- **refutation soundness / solution soundness**: a closed tree proves the constraints unsatisfiable; a saturated leaf shows them satisfiable (§2.2).
- **nullable sort and lift**: a type holding null or a value; lift applies a function, giving null if any argument is null (§4).

**Builds on:**
- A theory of finite bags [16], cited as "Logozzo et al.", extended here with map and filter, and Zarba's bag procedure [22], which the work is "closest to" (§1, §1.1).
- The theory of finite relations of Meng et al. [17] and the finite-sets solver of Bansal et al. [2], both in cvc5 (§1.1, §3).
- Compared against: SQLSolver [9] ([SQLSolver](#/papers/ding2023sqlsolver "Proving Query Equivalence Using Linear Integer Arithmetic (2023)")), which reduces queries to linear (Presburger) integer arithmetic and which the authors call, "to our knowledge", the current state of the art; and SPES [24] ([SPES](#/papers/zhou2020spes "SPES: A Symbolic Approach to Proving Query Equivalence Under Bag Semantics (2022)")), a symbolic checker that "can only answer equivalent or unknown" (§1.1, Fig. 10).

## Problem and setting

- **Question:** can SQL queries be encoded in SMT theories so that a general solver checks equivalence and other quantifier-free statements about them, under bag or set semantics, with NULLs (abstract, §1)?
- **Correct:** queries are equivalent "if and only if they return the same table for every database instance of the same schema" (§1); "Each SMT problem is unsatisfiable iff the SQL queries in the corresponding benchmark are equivalent under the corresponding semantics" (§5).
- **Fragment:** join, projection and selection (abstract), plus difference, intersection, concrete tables (VALUES), arithmetic, strings and nulls (§1.1); no aggregation (§1), ORDER BY (§5, fn. 9) or cardinality (§1.1). Bags use the theory of tables, sets the theory of relations (§1).
- **Benchmarks:** the Calcite benchmarks distributed with SPES [12]: query pairs from rewrites of Apache Calcite (an open-source database management framework), "intended to be equivalent under bag semantics"; 88 of 232 usable after fixing syntax errors and excluding unsupported constructs such as ORDER BY clauses and aggregate functions (§5).

## Approach

- **Theory of tables (§2).** SQL select becomes a map and where a filter (§1); table projection is reduced to a map (§2). The exposition assumes no nesting, which the implementation does not require (§2 "Simplifying Assumptions").
- **Calculus (§2.1, Figs. 3–5).** Bag rules turn each operator into equations on multiplicities for an integer arithmetic solver (Fig. 3); product and join rules multiply multiplicities, making the arithmetic nonlinear (Fig. 4). Before solving, a subsolver tests each map function for injectivity. If injective, rule Inj Map Down gives each multiplicity term of the map's result a fresh preimage with the same count. If the test says "sat or unknown", cvc5 adds constraints with for-all quantifiers over three [uninterpreted](#/glossary/uninterpreted-function) symbols that encode Eq. 2 (an element's count in a map result is the sum of the counts of its preimages); the authors call this non-injective case "more complex, and expensive" (§2.1).
  - Each rule keeps satisfiability: the configuration it applies to is satisfiable in the theory of tables if and only if one configuration it produces is (Lemma 2.2).
  - A closed derivation tree proves its root unsatisfiable in the theory of tables (Prop. 2.3).
  - A derivation tree with a saturated leaf shows its root satisfiable (Prop. 2.4; App. A.4 builds the satisfying assignment).
  - From a configuration with no product, join or map terms, every derivation tree is finite (Prop. 2.5); for inputs that also have no nonlinear arithmetic constraints, "any derivation strategy for the calculus yields a decision procedure" (§2.2).
  - Adding filter with computable predicates keeps the cardinality-free bag theory decidable (§2.2, via Prop. 2.5); adding product and projection makes it undecidable, which "is provable with a reduction" from a problem cited to [14].
- **Relations (§3, Fig. 6, App. B).** Meng et al.'s calculus gains filter, map and inner join rules. With equality, union, intersection, difference, product and filter it terminates (Lemma B.1). With maps it terminates for a starting configuration whose graph (relation terms as vertices, linked when equal or when a rule connects them) has no cycle with a red edge (one joining a map term to its argument) and whose cycles all lie in a subgraph without map terms (Prop. 3.1); "typical SQL queries" give no such cycles, the authors say (§3).
- **Nullable sorts (§4, Fig. 9).** Built into cvc5's datatypes solver, with lift operators "analogous to the semantics of eager evaluation" (§4).
- **Translation (§5, App. C).** A "prototype translator" (§5); cvc5 is asked whether the two query terms can differ; unsat means equivalent (Example C.1). Fig. 15 lists example translations, outer joins included.

## Results

- **Original benchmarks (Fig. 10a)**. cvc5 has a 10-second timeout; SPES's unknown means "not proven" (§5). Under bag semantics cvc5 proves 42 equivalent, 2 inequivalent, 44 timeouts; SPES 54 equivalent; SQLSolver 87 equivalent, 1 inequivalent: "cvc5 proved fewer benchmarks than both" (§5). Under set semantics cvc5 finds 83 equivalent, 1 inequivalent, 4 timeouts (§5).
- **Wrong verdicts found (§5)**. SQLSolver called testPullNull equivalent though its queries' columns come in a different order; its developers acknowledged and fixed the error. SPES misclassified testPullNull too, and testAddRedundantSemiJoinRule, "equivalent only under set semantics"; its authors acknowledged an error. cvc5 answered both correctly, each with a small [counterexample database](#/glossary/counterexample-database) that the authors checked on the PostgreSQL database server.
- **Mutated benchmarks (Fig. 10b).** Because the set "is heavily skewed towards equivalent queries", the authors made each pair inequivalent "manually but blindly", dropping the two SPES misclassified (86 pairs). cvc5 finds 81 inequivalent under bag semantics (5 timeouts) and 67 under set semantics (9 equivalent, 10 timeouts); SQLSolver "was able to solve all of them correctly"; SPES answered unknown throughout (§5).
- **The authors' explanation (§5):** many mutated pairs "use non-injective map functions", and for such pairs counterexamples are easier to find than proofs of equivalence.

## Limits the authors state

- "not refutation complete in general in the presence of maps", since derivations may not terminate (§2.2, Example 2.2); product makes it undecidable what the arithmetic constraints imply (§2.2; fn. 5). For relations, "Termination is lost with the addition of map rules" (§3); queries with recursive [common table expressions](#/glossary/common-table-expression-cte) give red-edge cycles (fn. 8).
- Lift "covers most SQL operations, except for OR and AND" (three-valued), which the authors "can support" through an if-then-else encoding (§4).
- Building the satisfying assignment, the paper assumes the types of row values (element sorts) are infinite, "with loss of generality"; the implementation allows finite ones "under mild restrictions on the theories involved" (§2.2).
- "not yet fully competitive performance-wise with that of specialized SQL analyzers, particularly on equivalent queries with non-injective mapping functions", to be addressed later (§6); "How to improve performance under bag semantics requires further investigation" (§5).

## Open problems and building blocks

  - Aggregation through "fold functionals" (§6), and cardinality through aggregation (fn. 1).
  - ORDER BY through filter and map over a theory of sequences [19] (§6).
  - The solver "could be further extended" to queries combining set and [bag-set semantics](#/glossary/bag-set-semantics) [8] ([Equivalence of Queries Combining…](#/papers/cohen2006setbag "Equivalence of Queries Combining Set and Bag-Set Semantics (2006)")) (§1).
  - Tuples inside rows, which they "could easily support" with two kinds of tuple sorts (fn. 3).
- **Released:** nothing stated beyond "We implemented solvers for these theories in the SMT solver cvc5" (abstract); Figs. 1 and 9 give the operators' names in SMT-LIB, the solvers' standard input language.
- **To reuse it:** cvc5 with higher-order support (§2); a nonlinear arithmetic solver for joins (fn. 5); computable filter and map functions (§2.1); a SQL-to-SMT translator (§5).
- **Beyond its domain:** the solver "supports in general any quantifier-free statements over SQL queries", so it "can also be used" for query containment or emptiness (§1.1).

## On this site

- **Discussed in:** [Can SQL equivalence checkers be trusted?](#/challenges/checker_soundness) · [Query equivalence: prove or refute](#/challenges/query_equivalence) · [SQL features that verifiers don't cover](#/challenges/verifier_coverage_gaps)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/cex-smt">cex-smt</a><a class="tag sub" href="#/tags/prove-smt">prove-smt</a></span>
