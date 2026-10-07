# SPES: A Symbolic Approach to Proving Query Equivalence Under Bag Semantics

**SPES** · ICDE 2022

Read: [PDF](https://arxiv.org/pdf/2004.00481) · [arXiv](https://arxiv.org/abs/2004.00481) · [DOI](https://doi.org/10.1109/icde53745.2022.00250)  
Code: [spes](https://github.com/georgia-tech-db/spes)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Proves equivalence under **bag** semantics symbolically.
- Normalizes both queries to a Union Normal Form (§4.2), then pairs their sub-queries one-to-one and proves the paired output tuples equal with SMT (§5); the completeness claim for table-only SPJ pairs fails for the printed Algorithm 3, and the released code "proves" some non-equivalent pairs.
- WeTune bundles it and SlabCity uses it as a full verifier; a baseline in SQLSolver (§6.1, PDF p. 21) and QED (Tab. 1, PDF p. 11).

## In plain words

Under the semantics this paper targets, two SQL queries are equivalent if, on every valid input, they return the same rows, each the same number of times. Such proofs help cloud database services avoid recomputing overlapping sub-queries (abstract, §1). An earlier prover from the same group, EQUITAS, compares results as sets, ignoring how often a row repeats (§1). SPES keeps the counts: it shows the queries always return equally many rows by pairing their outputs one to one, part by part, then asks a constraint solver to confirm that paired rows are always identical (§3.1). The authors state that when SPES answers "equivalent", the queries are equivalent (§6). On 232 equivalent query pairs from the tests of the Apache Calcite query optimizer, they report SPES proves 95. The algebraic-rewriting prover UDP proves 34, and EQUITAS proves 67, but only with duplicates ignored. They also report SPES is 3× faster than EQUITAS, averaged over the pairs each tool proves (§1, §7.2). They present SPES as a "novel symbolic approach" (abstract), reasoning about an arbitrary output row written as variables.

## Background and terms

**Terms to know:** [bag semantics](#/glossary/bag-semantics) · [set semantics](#/glossary/set-semantics) · [query equivalence](#/glossary/query-equivalence) · [query containment](#/glossary/query-containment) · [SAT and SMT solvers](#/glossary/sat-and-smt-solvers) · [satisfiable and valid](#/glossary/satisfiable-and-valid) · [uninterpreted function](#/glossary/uninterpreted-function) · [soundness and completeness](#/glossary/soundness-and-completeness) · [bijective map](#/glossary/bijection)

**The paper's own terms:**
- **Cardinal equivalence**: two queries return the same number of tuples (rows) on all valid input tables (Def. 1, §5.1); paired rows may then differ (Fig. 2a).
- **Full equivalence**: the output tables are identical as bags on all valid inputs (Def. 2, §5.1). "Equivalent" without a qualifier means this (§5.1).
- **Symbolic tuple (COLS)**: a vector of pairs of logic terms standing for an arbitrary output row; each pair gives a column's value and whether it is NULL (§2, §5.2).
- **Model**: "a set of concrete values for the symbolic variables" (§3.1).
- **QPSR (query pair symbolic representation)**: a record for two cardinally equivalent queries: two symbolic tuples standing for a row and its partner under the map, COND (the conditions for a row to be returned) and ASSIGN (relations between variables, e.g. for `CASE`) (§5.2). Def. 3 states when the two tuples represent the map.
- **The four query categories**: table, SPJ (select-project-join: filter and project the cross product of the inputs), aggregate (group, then aggregate each group), and union, which keeps duplicates like `UNION ALL` (§4.1).
- **UNF (Union Normal Form)**: a union of normalized SPJ queries whose inputs are tables or normalized aggregates over UNF queries (§4.2).
- **Sound / complete sub-procedure**: sound if a returned QPSR implies cardinal equivalence and a represented map; complete if a returned NULL implies they are not cardinally equivalent (footnote in §5.3).

**Builds on:**
- EQUITAS ([EQUITAS](#/papers/zhou2019equitas "Automated verification of query equivalence using satisfiability modulo theories (2019)")), the group's set-semantics prover. SPES reuses its encodings of projections and predicates (ConstExpr, ConstPred; §5.5, App. B). It is one of the two baselines (§7.2).
- UDP ([UDP](#/papers/chu2018udp "Axiomatic foundations and algorithms for deciding semantic equivalences of SQL queries (2018)")), an algebraic prover that normalizes queries and matches them by substitution (§1). It is the other baseline, with numbers taken from its paper (§7.2).
- Apache Calcite, a query optimizer framework ([Apache Calcite](#/papers/begoli2018calcite "Apache Calcite: A Foundational Framework for Optimized Query Processing Over Heterogeneous Data Sources (2018)")). It compiles SQL to [logical plans](#/glossary/logical-plan) (§7.1), and its test suite, taken from the SQL prover Cosette's repository ([Cosette](#/papers/chu2017cosette "Cosette: An Automated Prover for SQL (2017)")), is the benchmark (§7.2).
- The SMT solver Z3 (§7.1).

## Problem and setting

- **Question:** can a tool automatically prove that two SQL queries are equivalent under bag semantics (§1)? The authors call this "a strictly harder problem" than the set-semantics one (§1). EQUITAS's containment method, they argue, "cannot track and compare the frequencies of occurrence" of rows (§2).
- **SQL fragment:** the four categories, plus constructs reduced to them (§4.1). `LEFT OUTER JOIN` becomes a union of two SPJ queries, one using `EXISTS`, and `DISTINCT` becomes an aggregate grouping on all columns, so set semantics is covered too. Predicates may use arithmetic, logical operators and NULL tests. Projections may use constants, arithmetic, user-defined functions and `CASE` (§4.1, App. B).
- **NULLs:** each column carries an is-NULL flag (§5.2), and the benchmark's queries include three-valued logic for NULL (§1; [NULL and three-valued logic](#/glossary/null-and-three-valued-logic)).
- **Constraints:** [integrity constraints](#/glossary/integrity-constraint) are handled only through two normalization rules (§4.2). Which inputs count as "valid": not discussed. `ORDER BY` and `LIMIT`: not discussed.

## Approach

- **Normalize (§4.2).** Each query becomes a tree of the four categories, normalized to UNF: nested SPJ queries merge, an unsatisfiable predicate gives an empty table, predicates are pushed down where possible, and nested aggregates merge for `MAX`, `MIN`, `SUM` and `COUNT` when the outer grouping columns are a subset of the inner ones. Two primary-key rules: a self-join on the primary key becomes a projection, and a group-by on a single table's primary key, with no aggregate functions, may be dropped.
- **Cardinal equivalence and QPSR, bottom-up (§5.3–5.7, Alg. 1–5).** VeriCard dispatches on the category, returning NULL when the two differ.
  - Tables (Alg. 2): cardinally equivalent iff the same table (Lemma 2). The QPSR is the identity map.
  - SPJ (Alg. 3): VeriVec pairs the input sub-queries one to one with cardinally equivalent partners. The paper says it "exhaustively examines all possible maps" (§5.5). For each pairing in turn, the solver checks that the predicates agree on paired rows; at the first that passes, projections are applied. Lemma 3: this suffices for cardinal equivalence.
  - Aggregates (Alg. 4): the inputs must be cardinally equivalent. Two paired input rows must fall in the same group on one side iff they do on the other, checked with a second, fresh copy of the tuples (Lemma 5). Aggregate outputs get fresh variables, reused on the second side when function and operand columns are the same (§5.6).
  - Unions (Alg. 5): the inputs are paired one to one (Lemma 6), and fresh tuples with boolean selector variables tie each output row to one pair.
- **Full equivalence (§5.2).** At the top QPSR only, SPES asks whether COND ∧ ASSIGN ∧ ¬(COLS1 = COLS2) is satisfiable. Lemma 1: given a QPSR of the two queries, if no values satisfy COND and ASSIGN while making its two symbolic tuples differ, the queries are fully equivalent. The check is only at the top because "two queries may be fully equivalent even if their sub-queries are not fully equivalent" (§3.2).
- **Uninterpreted functions:** user-defined functions, string operations and higher-order predicates such as `EXISTS` become uninterpreted functions (§5.5).
  - Soundness: Lemmas 7–8: a QPSR returned by VeriCard means cardinal equivalence plus a represented map, and the top-level check then gives full equivalence. Theorem 1 (App. C.3) states that if SPES returns true, the two queries are equivalent.
  - Completeness for SPJ: Lemma 4 is for cardinally equivalent SPJ queries whose inputs are all table queries. If the solver can decide the predicates and projection expressions, VeriSPJ returns a QPSR. §6 then claims SPES is complete for SPJ pairs whose inputs are only table queries and whose predicates and projections the solver can decide.

## Results

- **Calcite benchmark (§7.2, Tab. 1).** All 232 pairs are "semantically equivalent" (§7.2). SPES supports 120 pairs and proves 95. The baselines support and prove fewer: UDP 39 and 34 (bag semantics), EQUITAS 91 and 67 (set semantics only). SPES "outperforms the other tools on queries containing aggregate and outer" joins (§7.2).
- **Normalization ablation (§7.2, Tab. 1):** SPES without its normalization rules proves 56.
- **Speed (§7.2, Tab. 1):** 0.05 s against EQUITAS's 0.15 s on average, "3× faster", averaged only over the pairs each tool proves; the authors report SPES faster than EQUITAS in every category.
- **Production queries (§7.3, Tab. 2).** Three sets of fraud-detection queries from Ant Financial, 9,486 in all; SPES checks every pair over the same input tables except scan-only ones and those differing only in predicate parameters, plus sub-queries of unproved pairs. It finds overlapping computation in 2,591 queries (27%), against 1,126 (12%) for EQUITAS. Of 12,090 equivalent pairs found, 5,831 (48%) contain joins and aggregates.

## Limits the authors state

- Normalization is "incomplete": SPES "may conclude that two queries are not cardinally equivalent since they cannot be normalized to the same type, even if they are actually cardinally equivalent" (§5.3).
- The solver is "only complete for linear operators", and with non-linear predicates it may return UNKNOWN (§5.5).
- Of the uninterpreted-function encodings: "These encodings do not preserve the semantics of these operations" (§5.5).
- VeriAgg uses only one of the possible maps between input rows, though another might pass (§5.6); VeriUnion misses unions that are cardinally equivalent without a one-to-one pairing of their inputs (§5.7). Neither is complete, nor is SPES "in general" (§6).
- Unsupported pairs use features not yet supported (e.g. `CAST`) or don't compile in Calcite (syntax errors) (§7.2).
- Of the 120 supported pairs, 25 go unproved. Missing normalization rules account for 21 (15 with union and aggregate, 6 with join and aggregate) and integrity constraints for 4 (§7.4). Support for integrity constraints is only "partial" (§7.4).
- The UDP row comes from the UDP paper, since UDP is "currently not open-sourced" (§7.2 footnote).

## Open problems and building blocks

  - Rules for union with aggregate and join with aggregate will let SPES prove those 21 pairs, the authors say, but "will also increase the average QE verification time", and "are not required for supporting production queries" (§7.4).
  - "We plan to add additional rules to handle join on primary and foreign keys in the future", for example rewriting an outer join on a foreign key to an inner join (§7.4).
- **Released:** the source code, on GitHub (§7.1).
- **To reuse it:** Calcite to compile SQL into logical plans, and the Z3 solver. The verifier itself is 2,065 lines of Java (§7.1). SPES is given each pair with the schemas of its input tables (§7.2).

## On this site

- **Discussed in:** [Can SQL equivalence checkers be trusted?](#/challenges/checker_soundness) · [Canonical forms for queries](#/challenges/query_canonical_forms) · [Equivalence under schema constraints](#/challenges/schema_constrained_equivalence)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/prove-smt">prove-smt</a></span>
