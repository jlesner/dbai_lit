# Automated verification of query equivalence using satisfiability modulo theories

**EQUITAS** · PVLDB 12(11) 2019

Read: [DOI](https://doi.org/10.14778/3342263.3342267)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- SMT-based prover: a query becomes a symbolic representation (SR) ⟨COND, COLS, ASSIGN⟩ over symbolic tuples, and containment is checked with Z3.
- Set semantics; aggregates and outer joins via fresh variables plus inference rules.

## In plain words

Cloud database pipelines often recompute the same sub-queries. The authors argue that this overlap is hard to spot by hand across teams, so tools must decide automatically when two queries return the same rows (abstract, PDF p. 1). Earlier provers turn queries into algebra; the authors say these can't model complex conditions or SQL's rules for missing values, and are slow (abstract, PDF p. 1). EQUITAS writes each query as logic formulas for one arbitrary output row and asks a logic solver, Z3, whether the queries can disagree, with extra rules for aggregates and outer joins. Duplicate rows are ignored. On 232 query pairs from the tests of Apache Calcite, an open-source query optimizer, it proves 67 equivalent against 34 for the prover UDP, 27 times faster on average, timing only proved pairs and UDP's times from its paper (§6, PDF pp. 10–11). In 17,461 production queries it finds redundant execution across 11% (abstract, PDF p. 1). The authors present an alternative to algebraic provers (abstract, PDF p. 1).

## Background and terms

**Terms to know:** [query equivalence](#/glossary/query-equivalence) · [query containment](#/glossary/query-containment) · [set semantics](#/glossary/set-semantics) · [bag semantics](#/glossary/bag-semantics) · [SAT and SMT solvers](#/glossary/sat-and-smt-solvers) · [first-order logic](#/glossary/first-order-logic) · [NULL and three-valued logic](#/glossary/null-and-three-valued-logic) · [soundness and completeness](#/glossary/soundness-and-completeness) · [materialization](#/glossary/materialized-view)

**The paper's own terms:**
- **contains**: Q1 contains Q2 when, on every valid input, every row of Q2's output is in Q1's output, however often it repeats (Def. 1, §3.1, PDF p. 5); in the glossary's wording, Q2 is contained in Q1. **Equivalent**: each contains the other (Def. 2, PDF p. 5).
- **symbolic representation (SR)**: a query's triple ⟨COND, COLS, ASSIGN⟩ (§3.2, PDF p. 5). COLS is an arbitrary output row made of unknowns, one (value, is-NULL) pair per column; COND is the condition it must meet to be output; ASSIGN holds further formulas, used for CASE, outer joins and aggregates.
- **SPJ queries**: SELECT-PROJECT-JOIN queries: filters, projections, inner joins (§3.3, PDF pp. 5–6).
- **independent variables** and **relational constraints**: fresh unknowns, not tied to input rows, for an aggregate's value or an outer join's no-match case (§4.1, PDF pp. 8–9), and the facts about them that inference rules derive from the sub-queries (§4.2, PDF p. 9).
- **algebraic approaches**: COSETTE and UDP, which turn a query into an expression over K-relations or U-semirings, algebraic structures in which a query is a function counting how often each row is output, and compare expressions with rewrite rules (§2.1, PDF pp. 2–3).

**Builds on:**
- COSETTE ([Cosette](#/papers/chu2017cosette "Cosette: An Automated Prover for SQL (2017)")) and UDP ([UDP](#/papers/chu2018udp "Axiomatic foundations and algorithms for deciding semantic equivalences of SQL queries (2018)")), the algebraic provers the paper argues against (§1, PDF p. 1; §2.1, PDF p. 2); §6.2 compares with UDP (PDF p. 10).
- [Decidable](#/glossary/decidable-and-undecidable) fragments under set and bag semantics [22, 52, 29, 39], which the authors say targeted only [conjunctive queries](#/glossary/conjunctive-query); among them [Optimal Implementation of Conjunctive…](#/papers/chandra1977conjunctive "Optimal Implementation of Conjunctive Queries in Relational Data Bases (1977)") and [The containment problem for…](#/papers/jayram2006inequalities "The containment problem for &lt;bi&gt;Real&lt;/bi&gt; conjunctive queries with inequalities (2006)") (§1, PDF p. 1).
- Negri et al.'s SQL semantics [44] ([Formal semantics of SQL queries](#/papers/negri1991semantics "Formal semantics of SQL queries (1991)")) for set semantics (§1, PDF p. 2; footnote 3, PDF p. 3).
- The Z3 SMT solver [12] (§6.1, PDF p. 10).

## Problem and setting

- **Question:** decide whether two SQL queries are equivalent, or one contains the other, fast enough for cloud-scale database-as-a-service (DBaaS) platforms (§1, PDF pp. 1–2; §6.2, PDF p. 11).
- **Hardness:** SQL equivalence "is undecidable" (§1, PDF p. 1). The authors argue that a reduction to first-order satisfiability lets them use SMT solvers, which "in practice" solve such formulas efficiently with heuristics (§1, PDF p. 2).
- **Semantics:** set semantics (§3.1, PDF p. 5); §6.4 adds bag semantics for SPJ queries (PDF p. 12). NULLs follow three-valued logic (§3.4.2, PDF pp. 7–8).
- **SQL covered:** arithmetic (+, −, ×, ÷, mod), comparisons, AND/OR/NOT, IS NULL, CASE, deterministic user-defined functions (UDFs), inner and outer joins, aggregates with GROUP BY (§3.3–4.2, PDF pp. 5–9). Not EXISTS, CAST (§6.2, PDF p. 10) or [integrity constraints](#/glossary/integrity-constraint) (§6.4, PDF p. 12). DISTINCT comes up once, in a UDP case needing bag semantics, deferred to §6.4 (§6.2, PDF pp. 11–12). UNION, ORDER BY, LIMIT: not discussed.
- **Input:** [logical plans](#/glossary/logical-plan) from an Alibaba-internal SQL compiler (§6.1, Fig. 1, PDF p. 10).

## Approach

- **Building the SR (§3.3, Alg. 1, Tab. 1, PDF pp. 5–6).** A scan creates a fresh row of unknowns; a filter adds its predicate to COND; a projection rewrites COLS; an inner join concatenates rows and conjoins both conditions with the join predicate.
- **Expressions and predicates (§3.4, PDF pp. 6–8).** Multiplication, division and modulo of two variables become [uninterpreted functions](#/glossary/uninterpreted-function), since satisfiability of quantifier-free non-linear integer arithmetic (formulas multiplying integer unknowns together, with no quantifiers) is undecidable; so "(a × b) = (c × d) only when a = c and b = d" (PDF p. 7). A UDF becomes a pair of uninterpreted functions chosen by its name. A predicate is a (truth, unknown) pair: a comparison is unknown when either side is NULL, AND and OR follow three-valued logic, and a predicate holds when true and not unknown (Alg. 3, PDF p. 7). CASE gets a fresh pair tied by ASSIGN to the first branch that holds (§3.4.3, PDF p. 8).
- **The containment check (§3.2.1, PDF p. 5).** To show Q1 contains Q2, both SRs share input variables, since EQUITAS considers only output rows "derived from the same set of input tuples", a bounded set, though footnote 4 says it "can be arbitrarily large" for aggregates and outer joins (PDF p. 5). Z3 is asked, together with both ASSIGNs: can Q2's condition hold while Q1's fails, and can both hold while the rows differ? If neither can be satisfied, Q1 contains Q2; equivalence checks both directions.
- **Outer joins and aggregates (§4.1, Alg. 4, PDF pp. 8–9).** A left outer join gets an independent true/false variable for a left row with no match: then the output is that row padded with NULLs, under the left condition only; otherwise the inner-join row. Aggregate columns get fresh unconstrained variables.
- **Inference rules (§4.2, PDF p. 9).** For left outer joins Q1 of Q3, Q4 and Q2 of Q5, Q6: if Q5 contains Q3 and Q4 contains Q6, Q1's no-match variable implies Q2's. A count-dependent aggregate (COUNT) gives equal outputs if the sub-queries are equivalent under bag semantics, checkable "only if both sub-queries are SELECT-PROJECT-JOIN queries"; for MIN and MAX, set equivalence suffices, for all sub-query types. Example 4 also requires equivalent GROUP BY expressions and the same function (§2.2, PDF p. 4).
- **Theorem 1 (§5, PDF p. 10).** A "contains" verdict can be trusted: for two queries, if the solver finds both formulas of the check unsatisfiable, Q1 contains Q2; §5 calls the procedure sound "under the set definition" (PDF p. 10).
- **Theorem 2 (§5, PDF p. 10).** No proof is missed within a class: for two SPJ queries that do not (1) scan the same table repeatedly or (2) have predicates whose satisfiability the solver cannot determine, if Q1 contains Q2, EQUITAS can prove it.

## Results

- **Calcite (§6.2, Tab. 2, PDF pp. 10–11).** 232 test cases, each a query and its Calcite-optimized variant (footnote 5, PDF p. 10). EQUITAS supports 91; the rest use unsupported features (EXISTS, CAST) or fail to compile in Alibaba's compiler. It reports proving 67 (73% of the 91) against 34 for UDP, using the numbers UDP's paper reports.
- **Speed (§6.2, Tab. 2, PDF p. 11).** Average time over each tool's proved pairs is 0.15 s against 4.16 s, "Thus, EQUITAS is 27× faster than UDP on these benchmarks"; "For SPJ and Aggregate queries, EQUITAS is consistently faster".
- **Production queries (§6.3, Tab. 3, PDF p. 11).** Five sets, 17,461 queries, from Ant Financial's risk-control department. Pairs over the same tables were checked within each set, sub-queries included, minus queries differing only in predicate parameters or only scanning. It reports that 2,001 queries (11%) have "at least one equivalence or containment relationship with another query in the same set" (they or their sub-queries), and that 43% of the related pairs contain aggregates or joins.
- **Materialization (§6.3.1, Fig. 2, PDF pp. 11–12).** For ten representative pairs from set 1 sharing aggregate or join sub-queries, rewritten by hand to share the stored sub-query, it "reduces the compute and memory resources consumed by 36% and 35%, respectively, among the examined query pairs" on an internal Alibaba DBaaS.
- **Deployment:** "currently deployed on Alibaba's MaxCompute database-as-a-service platform" (abstract, PDF p. 1).

## Limits the authors state

- No support yet for SQL features "such as EXIST and CAST", nor for integrity constraints such as keys and NOT NULL (§6.4, PDF p. 12).
- Since aggregates and outer joins rely on inference rules, it "is unable to detect containment and equivalence relationships in some query pairs with high-level structural differences" with aggregates or outer joins, e.g. a SUM over a grouped SUM (§6.4, PDF p. 12).
- It "cannot prove QE under bag semantics for complex queries containing aggregate functions and different types of OUTER JOIN" (QE: query equivalence; §6.4, PDF p. 12).
- "EQUITAS does not support non-deterministic UDFs" (§3.4.1, PDF p. 7).
- The UDP comparison could not be run "under the same environment" (footnote 6, PDF p. 10).

## Open problems and building blocks

  - "structural transformation rules" for structurally different pairs: "We plan to address this limitation in future work" (§6.4, PDF p. 12).
  - Many unsupported features "can be supported using the existing framework", e.g. EXISTS as a COUNT greater than zero; integrity constraints "with additional engineering effort" (§6.4, PDF p. 12).
  - Bag semantics with aggregates and outer joins needs tables modelled as unbounded data structures, "an active area of research" (§6.4, PDF p. 12).
  - Letting users "define properties of UDFs" (§3.4.1, PDF p. 7).
- **Released:** Nothing stated.
- **To reuse it:** a compiler producing logical plans (theirs is Alibaba-internal), the Z3 solver, and EQUITAS, 3,660 lines of Java (§6.1, PDF p. 10).

## On this site

- **Discussed in:** [Equivalence of nondeterministic queries](#/challenges/nondeterministic_equivalence) · [Canonical forms for queries](#/challenges/query_canonical_forms) · [Query equivalence: prove or refute](#/challenges/query_equivalence) · [Equivalence under schema constraints](#/challenges/schema_constrained_equivalence)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/prove-smt">prove-smt</a></span>
