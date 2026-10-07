# Speeding up symbolic reasoning for relational queries

**Speeding up symbolic reasoning…** · OOPSLA 2018

Read: [DOI](https://doi.org/10.1145/3276527)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Refines a bounded check's symbolic search space by backward symbolic provenance analysis before SMT solving.
- Applies to the Cosette and Qex encodings; soundness lemmas with proof sketches.
- SlabCity uses "existing bounded verifiers (i.e., those in Cosette [26, 66])", citing Cosette and this paper ([SlabCity](#/papers/dong2023slabcity "SlabCity: Whole-Query Optimization Using Program Synthesis (2023)") PDF p. 8); VeriEQL's Cosette and Qex baselines both add its pruning ([VeriEQL](#/papers/he2024verieql "VeriEQL: Bounded Equivalence Verification for Complex SQL Queries with Integrity Constraints (2024)"), `:108`).

## In plain words

SQL checking and testing tools often give a solver a bounded table of unknown rows and ask for one with some property, e.g. one where two queries disagree. The authors say many existing tools "explore an unnecessarily large number of tables"; in their grouping example, "Verification time increases exponentially as the bound increases" (§1, PDF pp. 2, 4). They trace back through the queries which input rows can affect an output row, and keep only tables of such rows: a smaller space that still holds a matching table whenever the full one does (§5.2, PDF p. 15). On real-world benchmarks it "significantly speeds up (up to 100×) the SQL solver when reasoning about a large class of challenging SQL queries, such as those with aggregations" (abstract, PDF p. 1). In bounded verification, 19 of 21 cases with aggregation sped up significantly under both tested encodings (how existing tools Cosette and Qex turn tables into solver unknowns) (§6.1, PDF p. 16). They call this use of provenance (where an output row comes from) "a new way" (§1, PDF p. 6).

## Background and terms

**Terms to know:** [bag semantics](#/glossary/bag-semantics) · [query equivalence](#/glossary/query-equivalence) · [bounded verification](#/glossary/bounded-verification) · [SAT and SMT solvers](#/glossary/sat-and-smt-solvers) · [data provenance](#/glossary/data-provenance) · [uninterpreted function](#/glossary/uninterpreted-function) · [union of conjunctive queries](#/glossary/union-of-conjunctive-queries) · [concolic testing](#/glossary/concolic-testing) (not defined in the paper, §6.3, PDF p. 18) · [symmetry breaking](#/glossary/symmetry-breaking) (Qex asserts "a canonical order of the tuples in the table", and Cosette uses similar constraints, App. A, PDF p. 22)

**The paper's own terms:**
- **multiplicity**: how many times a tuple (row) appears in a table (§2, PDF p. 6).
- **provenance predicate**: a condition on input rows, relative to an output tuple, such that for every output tuple and input table, keeping only the rows that satisfy it leaves that tuple's multiplicity unchanged (Def. 5.1, PDF p. 11). The output tuple is symbolic (its values are unknowns), so one predicate covers every output row (§3.2, PDF p. 9).
- **abstract semantics**: a simplified meaning of SQL; e.g. every aggregation function is treated as an uninterpreted function, so all rows in an output row's group count as its provenance (§1, PDF p. 5).
- **encoding**, **#SV**: Qex encodes tables of an exact size and checks each size up to the bound; Cosette stores a multiplicity per symbolic tuple, so k entries stand for all tables with at most k distinct tuples (App. A, PDF p. 22). #SV is "the number of symbolic values used in encoding the search space" (Tab. 1, PDF p. 19).

**Builds on:**
- **Cosette** (Chu et al. 2017a, [Cosette](#/papers/chu2017cosette "Cosette: An Automated Prover for SQL (2017)")), "an SMT-based verifier for bounded verification", and **Qex** (Veanes et al. 2010; not listed here), an SMT-based unit-test generator: the encodings it is added to (§6, PDF p. 16; §7, PDF p. 21).
- Test-generation work whose tasks and benchmarks §6 reuses: [mutation testing](#/glossary/mutation-testing) (Chandra et al. 2015, [XData](#/papers/chandra2014xdata "Data generation for testing and grading SQL queries (2015)")), SQL auto-grading (Gupta et al. 2010, XData, "a mutation testing tool for SQL"), unit tests (Veanes et al. 2010) and concolic testing (Tanno et al. 2015) (§6, PDF p. 16).
- Data provenance work (Buneman et al. 2006, 2001; Cui et al. 2000; Green et al. 2007, "Update Exchange with Mappings and Provenance", VLDB; none on this site), which their analysis "resembles", extended "to multiple queries simultaneously" (§7, PDF p. 21).

## Problem and setting

- **Question:** given queries, an output property and a space of input tables, find a smaller space that still holds a table with the property whenever the original does (§2, PDF p. 7).
- **Properties:** some output tuple meets a condition that reads the output only through that tuple's multiplicity (§2, PDF p. 6), e.g. a non-empty output (unit tests) or a tuple with different multiplicities in two outputs (equivalence) (§2, PDF p. 7).
- **Semantics:** bag semantics (§2, PDF p. 6).
- **SQL fragment:** projection, de-duplication, filter, join, left join, union, rename, and grouping with Max, Min, Sum, Count and Count-Distinct (Fig. 6, PDF p. 10); §5 assumes one input table "to simplify notation" (PDF p. 11).
- **Experiment 1** (§6.1, PDF p. 16): 46 of the 232 rewrite-rule tests of Apache Calcite (an open-source query optimization framework, [Apache Calcite](#/papers/begoli2018calcite "Apache Calcite: A Foundational Framework for Optimized Query Processing Over Heterogeneous Data Sources (2018)"), cited as its website), leaving out tests of non-SQL features and features Cosette and Qex don't support "(e.g., Partition, Order-By, Case and In)". The bound is the largest space the solver fully explores within 600 seconds without refinement; it then reruns at that bound with refinement.
- **Experiment 2** (§6.2, PDF p. 18): 13 query-disambiguation benchmarks (an input separating two inequivalent queries) and 2 unit-test benchmarks "from prior work", excluding cases whose distinguishing tables have only 1 tuple; timing each solver's first solution ("the first desirable model").
- **Experiment 3** (§6.3, PDF p. 18): two query pairs hand-translated to Java, run with the CATG concolic engine.
- The authors run each experiment with both encodings, to show the method is "general to different underlying solver implementations" (§6, PDF p. 16).

## Approach

- **Provenance analysis (§5.1.1, PDF pp. 11–13).** Start from the output tuple itself, push the condition down the query's operators by the rules of Fig. 8 (PDF p. 13), and merge the conditions reaching the input table with OR (Fig. 9). For example, a filter adds its condition; a join splits the condition by side and discards parts mixing both; a grouping keeps only the part over grouping columns, so whole groups stay; a left join passes `true` to its right side, because of "the non-monotonicity of Left Join" (removing a right-side row can yield rows the old result lacked).
- **Space refinement (§5.2, PDF pp. 14–15).** Merge both queries' predicates with OR, lift the result to a condition on whole tables (one output tuple's predicate holds for every row), and keep the tables that meet it, after adding all sub-tables if the space is not "closed under containment".
- **Lemmas (PDF pp. 14–15).** For each propagation rule, tables that agree on the subqueries' rows selected by the derived conditions agree on the query's rows selected by the original one (Lemma 5.2). This still holds with any weaker conditions that the derived ones imply (Lemma 5.3, Weakening). For a query with n output columns, starting from equality with the symbolic output tuple in all n columns and propagating down to the input table, the OR of the resulting conditions is a provenance predicate over that table for the output tuple (Lemma 5.4, Soundness). For two queries, a space S and the space refined from S with a table constraint, if a table in S separates the queries, one in the refined space does too, so finding none means they "are guaranteed to be equivalent in S" (Lemma 5.5).

## Results

- **Bounded verification (§6.1, PDF pp. 16–17; Tab. 1, PDF p. 19).** 19 of the 21 aggregation cases "show significant speedup", under both encodings; median speedups (printed "medium") are 48× for Cosette and 58× for Qex, mainly from fewer groups to consider. Of 25 cases without aggregation, all unions of conjunctive queries, "only 6 cases display significant speedup", from backward constant propagation (pushing query constants down to input columns, which then need no unknowns); the rest are unaffected or slightly slower. Conclusion 2: the speedup varies by encoding, but "whether a pair of queries benefits from space refinement is not affected" by the encoding, and query size has "little influence" compared with query structure.
- **Test-data generation (§6.2, PDF p. 18; Tab. 2, PDF p. 20).** Speedups in 7 of 15 cases under Qex and 6 under Cosette, "harder cases whose solutions require more tuples"; the rest unaffected or an "insignificant" slowdown.
- **Concolic testing (§6.3, PDF p. 18; Fig. 10, PDF p. 20).** Both examples "indicate" that refinement makes it run faster, and the benefit "increases as input space size increases", over 10 to 100 tuples (no value labels printed).

## Limits the authors state

- The property form excludes, e.g., an exact output size (§1, PDF p. 2; §2, PDF p. 7).
- The analysis "does not produce the strongest provenance predicate at each analysis step": the join rule ignores conditions spanning both tables and the grouping rule ignores what aggregates compute; the strongest would cost as much as solving the equivalence problem (§5.1.3, PDF p. 14).
- The two boolean queries ("Select 1 From") among the aggregation cases didn't benefit; unions of conjunctive queries "benefit less" (§6.1, PDF pp. 16–17).
- "The benefit of space refinement is limited when the target model size is small": most cases need "tables only with 2 distinct tuples", so the gain "does not compensate for the overhead of encoding the refinement predicate" (§6.2, PDF p. 18).
- It "currently can only speedup the type of assertions defined in section 2 but not general invariants" (program properties that equivalence checkers such as Mediator and SparkLite infer); generalizing is "an interesting future work" (§7, PDF p. 22).

## Open problems and building blocks

  - They "could potentially redesign different abstractions" for "better trade-offs between analysis overhead and pruning effectiveness" (§1, PDF p. 5).
  - Relating their predicates to the pruning constraints of [program synthesis](#/glossary/program-synthesis) "offers an interesting future work" (§7, PDF p. 22).
  - The authors "believe" the techniques can apply to other relational query languages (§1 footnote 1, PDF p. 2).
  - Combining it with lower-level symmetry breaking, an "opportunity" (§7, PDF p. 21).
  - Bottleneck named: reasoning about grouping and aggregation (§1, PDF p. 4).
- **Released:** Nothing stated.
- **To reuse it:** a symbolic SQL tool with an encoding of bounded tables (App. A, PDF pp. 22–23), queries in the Fig. 6 fragment (PDF p. 10) and a property of the §2 form (PDF pp. 6–7). The refinement "relies only on the semantics of the input queries" (§1, PDF p. 6).

## On this site

- **Discussed in:** [Minimal counterexamples](#/challenges/minimal_counterexamples)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/bounded-smt">bounded-smt</a><a class="tag sub" href="#/tags/cex-smt">cex-smt</a></span>
