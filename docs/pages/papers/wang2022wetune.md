# WeTune: Automatic Discovery and Verification of Query Rewrite Rules

**WeTune** · SIGMOD 2022

Read: [PDF](https://dl.acm.org/doi/pdf/10.1145/3514221.3526125) · [DOI](https://doi.org/10.1145/3514221.3526125)  
Code: [WeTune](https://github.com/WeTune/WeTune-code)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Discovers rewrite rules by enumerating small plan-template pairs and their enabling constraints.
- Proves candidates with its own U-expression→FOL/SMT verifier or SPES.
- "A rule generator that automatically discovers new rewrite rules" (abstract); its verifier supports integrity constraints and outer joins (§5.1.1, §9); its rules and rewritten statements are ready-made pairs, but its NULL model and its released rewriter (which skips rules' NotNull conditions) let some rules change results.

## In plain words

Databases speed up queries by rewriting them into equivalent, faster ones, using hand-written rewrite rules. The authors argue that such rules accumulate slowly and miss the odd queries that ORM frameworks (libraries that generate SQL from application code) produce, leaving developers to fix slow queries by hand (§1–2, PDF pp. 1–3). WeTune aims to "automatically discover new rewrite rules without any human effort" (§1, PDF p. 1). Borrowing compilers' exhaustive search for faster code, it pairs all small query-plan patterns (query fragments with placeholders for tables, columns and conditions), finds the weakest conditions under which a pair returns the same rows, proves each candidate with its own solver-based checker or the existing checker SPES, and keeps rules that speed up real queries. Of 1106 proved candidates, 35 sped up the evaluated queries; of 8,518 queries from 20 web applications it rewrote 674, including 247 that SQL Server 2019 fails to optimize (§1, §8, PDF pp. 2, 10–11).

## Background and terms

**Terms to know:** [query rewriting and rewrite rules](#/glossary/query-rewriting-and-rewrite-rules) · [logical plan](#/glossary/logical-plan) · [bag semantics](#/glossary/bag-semantics) · [NULL and three-valued logic](#/glossary/null-and-three-valued-logic) · [integrity constraint](#/glossary/integrity-constraint) · [SAT and SMT solvers](#/glossary/sat-and-smt-solvers) · [uninterpreted function](#/glossary/uninterpreted-function) · [satisfiable and valid](#/glossary/satisfiable-and-valid)

**The paper's own terms:**
- **rewrite rule**: a source and a destination plan template plus constraints under which they are equivalent (§4, PDF p. 4).
- **plan template**: a plan fragment whose tables, column lists and predicates are symbols (§4.1, PDF p. 4). Operators (Tab. 2, PDF p. 5) include InSub (keep left rows whose columns appear in the right input, as `IN (subquery)` does), joins and Dedup (duplicate removal).
- **constraints**: RelEq, AttrsEq, PredEq (two symbols are the same), SubAttrs (a column list belongs to a table), RefAttrs (a foreign key), Unique, NotNull (§4.2, PDF p. 5).
- **promising rule**: verified, with a most relaxed constraint set (none can be dropped), and a destination with no more operators of each type (§4.3, PDF p. 5); **useful** if its rewrites made real queries faster (§6, PDF p. 10).
- **U-expression** (from UDP, an earlier algebraic SQL equivalence prover, §5.1.1, PDF p. 6): a formula for how many times a row appears in a query's result, built from table counts, 0/1 condition tests, a test turning any positive count into 1 (duplicate removal), and sums over all possible rows (projection).

**Missing glossary terms:**
- **superoptimization**: a compiler technique that searches exhaustively for an equivalent optimal instruction sequence (§1, PDF p. 1).

**Builds on:**
- UDP ([UDP](#/papers/chu2018udp "Axiomatic foundations and algorithms for deciding semantic equivalences of SQL queries (2018)")), whose U-expressions WeTune applies to symbolic templates and extends with NULL handling (§5.1.1, PDF pp. 6–7).
- SPES ([SPES](#/papers/zhou2020spes "SPES: A Symbolic Approach to Proving Query Equivalence Under Bag Semantics (2022)")), "the state-of-the-art SQL equivalence verifier" (§8.5, PDF p. 11), the second verifier; it and EQUITAS ([EQUITAS](#/papers/zhou2019equitas "Automated verification of query equivalence using satisfiability modulo theories (2019)")) are SMT-based checkers that, the authors say, lack integrity constraints (§9, PDF p. 12).
- Baselines: the rewriters of SQL Server 2019 (Microsoft's commercial database), the open-source MySQL and PostgreSQL, and Apache Calcite ([Apache Calcite](#/papers/begoli2018calcite "Apache Calcite: A Foundational Framework for Optimized Query Processing Over Heterogeneous Data Sources (2018)"), an open-source optimizer framework) (§2.2, PDF p. 3; §8.1, PDF p. 11).

## Problem and setting

- **Question:** can enumerated, proved rules speed up real queries that existing rewriters miss (§3, PDF p. 3)?
- **SQL fragment:** Tab. 2's operators (PDF p. 5), plus UNION and aggregation with SPES (§5.2, PDF p. 9); templates of at most 4 operators besides inputs (§4.1, PDF p. 4); ORDER BY only removed where it can't matter (§7, PDF p. 10).
- **Correctness:** bag semantics; under every interpretation (concrete meaning of the symbols, Def. 1, PDF p. 7) satisfying the constraints, both templates give every row the same count (Def. 2, PDF p. 7).
- **NULLs:** modelled for Tab. 3's operators (PDF p. 6) by an added IsNull test that drops NULL rows, a tuple being NULL when all its attributes are (footnote 2, PDF p. 7); an unknown selection predicate counts as false (§5.1.1, PDF p. 7).
- **Workloads:** 8,518 queries from unit tests of the 20 most-starred open-source web applications on GitHub, and Apache Calcite's test suite of 232 equivalent pairs; rules evaluated on SQL Server 2019 over random tables respecting integrity constraints (§8.1, PDF p. 10).

## Approach

- **Enumeration (§4.1–4.2, PDF pp. 4–5; Fig. 3).** Templates: all tree shapes filled with fitting Tab. 2 operators (PDF p. 5), minus invalid SQL; constraints: the seven kinds filled with a pair's symbols.
- **Search (§4.3, Alg. 1, PDF pp. 5–6).** For pairs whose destination has no more operators of each type, start from all constraints, drop one at a time and re-prove, backtracking on failure; return every most relaxed set.
- **Translation (§5.1.1, PDF pp. 6–7).** Symbols become uninterpreted functions: a relation maps a row to its count, a column list projects a row, a predicate maps a row to true or false. Tab. 3 builds each operator's U-expression from its children's: a join keeps row pairs whose join columns are equal, and a left join adds unmatched left rows padded with a NULL row. Tab. 4 turns constraints into first-order logic (formulas with for-all and there-exists).
- **Proving (§5.1.2, PDF pp. 7–9).** Tab. 5 (PDF p. 8) turns the equation between the U-expressions into sufficient first-order conditions without sums; with no matching pattern the rule can't be proved (footnote 3, PDF p. 8). The SMT solver Z3 (§8.1, PDF p. 10) must find unsatisfiable that the constraints hold while some row's counts differ; timeouts count as incorrect.
  - Thm. 5.1 (PDF p. 8), for sums over the same row variable: for r a function denoting a relation and f, g arbitrary expressions, the sums over all rows of r(t)·f(t) and r(t)·g(t) are equal under every interpretation exactly when r(t)·f(t) = r(t)·g(t) for every row and interpretation.
  - Thm. 5.2 (PDF p. 8), for sums over different variables: the sum over t of r(t)·f(t) equals the sum over t and s of r(t)·g(t)·h(t, s), h arbitrary, under every interpretation, if for every interpretation and row t either the terms r(t)·f(t) and r(t)·g(t) differ, the first is 0 and h sums to 0 over s, or they are equal and either the first is 0 or h sums to 1 over s.
- **SPES (§5.2, PDF p. 9).** Rules are turned into concrete SQL for it, and templates gain aggregation and UNION; Tab. 6 compares the two verifiers' features.
- **Useful rules (§6–7, PDF pp. 9–10).** Outside the database, it greedily applies the most simplifying rules, takes the database's cost estimates, and times the cheapest version on random data. Rules that the other rules reproduce on their probing query, the smallest concrete query they apply to (Fig. 7, PDF p. 10), are dropped.

## Results

- **Generation (§8.1, PDF p. 10).** 3113 templates; the authors report 1106 promising, non-reducible (not reproduced by other rules) rules.
- **Useful rules (§8.2, PDF p. 11; Tab. 7, PDF p. 12).** 35, 34 of them found with the application queries; 15 proved by both verifiers, 16 only by the built-in one and 4 only by SPES.
- **Queries (§8.3, PDF p. 11).** Of the 50 issues of §2.2 (PDF p. 3), WeTune optimizes 38, SQL Server 23 and Calcite 4; the 12 it misses need predicates rewritten or added (9) or aggregation and GROUP BY (3). Of the 8,518 application queries it rewrites 674, of which SQL Server fails to optimize 247.
- **Latency (§8.3, PDF p. 11).** For queries SQL Server can't optimize, rewritten against original on SQL Server, over four synthetic workloads (10K or 1M rows, uniform or skewed): 13%–21% of queries get at least 90% lower latency in every workload.
- **Case study (§8.4, PDF p. 11; Fig. 8, PDF p. 13).** Rules 24, 27, 30 and 8 in sequence turn Table 1's second query (PDF p. 2) into its ideal form.
- **Verifiers (§8.5, PDF pp. 11–12; §5.1.2, PDF p. 9).** On the 232 Calcite pairs, SPES proves 95, the built-in verifier 73 and both 55; the authors cite features such as complex predicates. SPES verifies few of the rules enumerated with the built-in verifier, mostly for lack of integrity constraints. On 100 wrong rules made by mutating Calcite rules' constraints, the built-in verifier times out on 96 and proves 4 incorrect.

## Limits the authors state

- **Incompleteness (§10, PDF p. 13):** with sums over an unbounded domain, U-expressions exceed first-order logic; only Tab. 5's cases (PDF p. 8) are checked, and formulas outside a [decidable](#/glossary/decidable-and-undecidable) fragment of the solver can time out, missing useful rules.
- **Wrong rules (§5.1.2, PDF p. 9):** the verifier tends to time out, not refute them.
- **Unsupported SQL (§10, PDF p. 13; §5.2, PDF p. 9):** the built-in verifier supports only Tab. 2's operators (PDF p. 5): no UNION, INTERSECT or DIFFERENCE, and no aggregation or NOT/XOR/OR predicates, by implementation restriction. WeTune doesn't support recursive queries. NULL is "partially supported", only in its effect on Tab. 3's operators (PDF p. 6).
- **Soundness (§10, PDF p. 13):** the authors state that "the soundness of WeTune holds for non-recursive queries", since replacing a sub-plan free of unsupported features by an equivalent one keeps the query's meaning.
- **Scope:** physical changes such as index choice are "beyond the scope of WeTune" (§8.3, PDF p. 11); functions like RANDOM are not considered (footnote 4, PDF p. 11).

## Open problems and building blocks

- **Open:** aggregation and other operators in the NULL-aware translation (§5.1.1, PDF p. 7); refuting incorrect rules without timeouts (§5.1.2, PDF p. 9); templates with concrete aggregates, complex predicates and XOR/OR/NOT, to use SPES fully (§5.2, PDF p. 9); translating any U-expression into first-order logic (§10, PDF p. 13); finer-grained predicate reasoning (§8.3, PDF p. 11); Ruler [38], a general rule-discovery framework, to speed discovery (§9, PDF p. 13).
- **Released:** no code or data release is stated; the extended version [49] holds the application list (§8.1, PDF p. 10), the proofs (§5.1.2, PDF p. 8) and lists optimized statements (App. D, PDF pp. 15–59).
- **To reuse it:** an SMT solver (Z3), a database giving cost estimates, a data generator keeping integrity constraints (§6, PDF p. 10; §8.1–8.3, PDF pp. 10–11); 36 hours on 120 cores for templates up to 4 operators (§8.1, PDF p. 10).

## On this site

- **Discussed in:** [Can SQL equivalence checkers be trusted?](#/challenges/checker_soundness) · [Refuting faulty rewrite rules](#/challenges/faulty_rewrite_rules) · [Canonical forms for queries](#/challenges/query_canonical_forms) · [Discovering new rewrite rules](#/challenges/rewrite_rule_discovery) · [Equivalence under schema constraints](#/challenges/schema_constrained_equivalence)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/pairgen-apply">pairgen-apply</a><a class="tag sub" href="#/tags/prove-smt">prove-smt</a><a class="tag sub" href="#/tags/rewrite-classic">rewrite-classic</a><a class="tag sub" href="#/tags/rewrite-smt">rewrite-smt</a><a class="tag sub" href="#/tags/rules-discover">rules-discover</a><a class="tag sub" href="#/tags/rules-verify">rules-verify</a></span>
