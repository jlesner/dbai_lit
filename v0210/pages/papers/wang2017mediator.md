# Verifying Equivalence of Database-Driven Applications

**Mediator** · PACMPL 2(POPL) 2018 (POPL 2018) · 2017

Read: [PDF](https://arxiv.org/pdf/1710.07660) · [arXiv](https://arxiv.org/abs/1710.07660) · [DOI](https://doi.org/10.1145/3158144)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Verifies equivalence (and refinement) of two database-driven programs over different schemas, as in schema refactoring (abstract; refinement, §1).
- Bisimulation invariants over relational algebra with updates, synthesized automatically; evaluated on 21 benchmarks from textbooks and web applications (abstract).
- VeriEQL's list-based SQL semantics is "inspired by" it ([VeriEQL](#/papers/he2024verieql "VeriEQL: Bounded Equivalence Verification for Complex SQL Queries with Integrity Constraints (2024)") §3.3).

## In plain words

When developers change how a web application's database is laid out (its schema, for example splitting one table into two), they must rewrite the code that reads and writes it without changing what users see. The authors say this database refactoring "arises very frequently" and is "known to be quite hard and error-prone" (§1). They define when two such programs, over different schemas, are equivalent, and give a proof method: find a condition linking the two databases that holds at the start, that every pair of matching updates keeps true, and that, given equal arguments, forces matching queries to return the same results. Their tool, Mediator, searches for such a condition and checks each step with an automatic logic solver (§1). On 21 benchmarks from textbooks and real web applications, hand-translated into the authors' small program language and with tables treated as ordered lists of rows, Mediator verifies 20; no comparison is stated (abstract; §3.2; §8.2). The authors call it "a first step" on a problem for which "there are no existing tools" (abstract).

## Background and terms

**Terms to know:** [relational algebra](#/glossary/relational-algebra) · [list semantics](#/glossary/list-semantics) · [bag semantics](#/glossary/bag-semantics) · [SAT and SMT solvers](#/glossary/sat-and-smt-solvers) · [satisfiable and valid](#/glossary/satisfiable-and-valid) · [soundness and completeness](#/glossary/soundness-and-completeness) · [loop invariant](#/glossary/loop-invariant) · [decidable and undecidable](#/glossary/decidable-and-undecidable) · [Hoare triple](#/glossary/hoare-triple) (used in Def. 4.1; §9 describes the relational form for two programs) · [strongest postcondition](#/glossary/strongest-postcondition) (given for updates in Fig. 10) · [bisimulation](#/glossary/bisimulation) (§4.1) · [monomial predicate abstraction](#/glossary/monomial-predicate-abstraction) (§1, §6.2)

**The paper's own terms:**
- **database-driven application**: a schema, a list of update transactions and a list of queries, in the paper's intermediate representation (IR) (§3.1, Fig. 3). Updates insert a row, or delete or modify the rows meeting a condition; queries use projection, selection, join, union and difference, and conditions may test membership in a subquery's result.
- **invocation sequence**: a program's input, update calls with argument values ending in one query call (§3.2).
- **list semantics, as used here**: tables are lists of rows (Fig. 5); results are compared as lists of value lists, without attribute names (§3.2).
- **equivalence** (Def. 3.2): every invocation sequence gives both programs the same result; transactions are matched by position (§3.3).
- **refinement** (Def. 3.5): for matching invocation sequences (the new program's calls may take extra arguments), the old program's result equals some projection of the new one's; transactions only the new program has are ignored.
- **bisimulation invariant**: a formula relating a pair of database instances, one per program (§4.1). **Inductive** (Def. 4.1): true on two empty databases and kept true by every pair of matching updates run on equal arguments. **Sufficient** (Def. 4.2): with equal arguments, it implies each pair of matching queries returns equal results. Refinement uses an inductive **simulation invariant** (Def. 4.5), a one-to-many relation preserved by matching updates with equal shared arguments, that is **projectively sufficient** (Def. 4.6): it implies each old query's result is some projection of the new one's (§4.2).
- **T_RA (theory of relational algebra with updates)**: a logic whose terms are tables built with projection, selection, Cartesian product, union, difference and an operator that sets one attribute of every row (§5, Fig. 7).
- **false positive**: here, a warning on a pair that is in fact equivalent (§8.2, §10).

**Builds on:**
- Bisimulation for proving equivalence (§4.1, citing Cleaveland and Hennessy 1993).
- Monomial predicate abstraction (Das et al. 1999; Lahiri and Qadeer 2009; Ball et al. 2005) for invariant synthesis (§1, §6.2).
- The result that two [conjunctive queries](#/glossary/conjunctive-query) "are equivalent under bag semantics if (and only if) they are syntactically isomorphic", that is, the same query up to renaming variables (Cohen et al. 1999; Green 2009), which inspires a solver shortcut (§7).
- The SQL query-equivalence provers HoTTSQL ([HoTTSQL](#/papers/chu2016hottsql "HoTTSQL: proving query rewrites with univalent SQL semantics (2017)")) and Cosette ([Cosette](#/papers/chu2017cosette "Cosette: An Automated Prover for SQL (2017)")), both using the Coq [proof assistant](#/glossary/proof-assistant); the authors say "existing tools do not support reasoning about updates to the database" (§9 "Query Equivalence").

## Problem and setting

- **Question:** given two programs over different schemas with corresponding transactions, do corresponding queries return the same results after the same updates (§1, Def. 3.2)? And when the new version adds information, does it refine the old one (§3.3)?
- **Programs:** in the IR of Fig. 3, into which real applications are translated by hand (§8.2). Transactions are assumed atomic (§3.1). Aggregation, sorting and NULLs are not discussed.
- **Start state:** empty databases, "realistic in situations where database migration is performed by calling the new update methods"; otherwise the invariant must be shown for the initial databases (§4.1 footnote).
- **Matching:** for equivalence, both programs have the same number of transactions, matched by index (§3.3).
- **Solver:** Z3, an SMT solver, with 2 seconds per query; a timeout counts as "invalid" (§7).

## Approach

- **Proof method (§4).** Thm. 4.3: if two programs have a sufficient, inductive bisimulation invariant, they are equivalent. Thm. 4.4: assuming an oracle (an idealized prover) that proves any valid Hoare triple and logical entailment (one formula implying another), if two programs are equivalent, such an invariant always exists. Thms. 4.7–4.8 state the same pair for refinement, with inductive, projectively sufficient simulation invariants.
- **Encoding (§5).** T_RA is axiomatized in the theory of lists, which many SMT solvers support: a row is a list of values, a table a list of rows, an attribute a position (Fig. 8). Since relational algebra equivalence is undecidable, so is T_RA; the authors say optimizations let them decide most formulas they meet in practice (§5 "Remark").
- **Checking a candidate (§6.1).** Sufficiency is one validity query per query pair. Inductiveness uses a strongest postcondition per update (Fig. 10). Thm. 6.2: if a database and argument values satisfy a formula, the updated database satisfies its computed postcondition. A candidate is inductive if, for each update pair run on equal arguments, its postcondition implies the candidate.
- **Search (§6.2, Alg. 1).** Instantiate four templates, each an equality between projections of a table or of a join of two tables, at most one join per side. Start from the conjunction of all; while it stays sufficient, drop any predicate some update pair doesn't preserve; return it once inductive, else fail. §2 shows such an invariant for `cdx`, a medical-test notification application whose `Subscriber` table is split into `Subscriber` and `Filter`.
- **Implementation (§7).** About 10,500 lines of Java.
  - *Redundant axioms* (Fig. 11): some proofs need induction over lists, where "Z3 times out in most of these cases", so implied lemmas are added; none had to be added "while evaluating" on real-world examples.
  - *Conjunctive queries* (only projection, selection and equality joins, with conjunctions of equalities as conditions): one query is rewritten through the schema mapping the invariant induces (which old attributes correspond to which new ones) and accepted if identical "modulo reordering of equalities"; otherwise the solver decides.
  - *Invariant synthesis*: predicates are pruned using the insert transactions, which the authors say does "not lead to a loss of completeness in practice".
  - *Refinement*: candidate projections are tried in order of attribute-name similarity.

## Results

- **Study (§8.1).** Of 100 Ruby-on-Rails web applications with at least 400 GitHub commits, all changed their schema at least once, and 44% had a structural change (e.g. splitting or merging tables, moving attributes) at least once (Fig. 12); the authors conclude such changes "are quite common".
- **Benchmarks (§8.2, Tab. 2).** 10 refactorings from a textbook (Ambler and Sadalage 2006) and an Oracle tutorial, and version pairs from the "first 10 real-world applications" of the study's dataset with consecutive versions, a structural schema change that requires rewriting code, and an intended equivalence or refinement.
- **Main result (Tab. 3).** Mediator verifies 20 of 21 benchmarks; 9, 14 and 15 are refinement checks. No other tool is compared.
- **Time.** It verifies "10 out of 11 real-world benchmarks in under 50 seconds on average" (§1); real-world benchmarks average 46.8 s against 11.3 s for textbook ones (§8.2). Running time is "roughly linear" in the number of solver queries, and in transactions × iterations (Fig. 13).
- **Failure (§8.2 "Cause of false positives").** Benchmark 20 moves the attributes two tables share into one new table (a "polymorphic relation"). It needs an invariant comparing a table with a filtered part of another, which the templates lack; adding such templates "would significantly increase the search space".

## Limits the authors state

From §10 unless noted:
- Programs must be translated into the IR, and "programs that use dynamically generated transactions or control-flow constructs cannot be translated"; translation took "approximately three days of manual effort" (§8.2 footnote), and the authors plan to automate it for languages such as Ruby or PHP (§11). Modelling conditional updates "would require performing reasoning over a richer logical theory" (§11).
- Invariants are conjunctions over a fixed class of predicates, so Mediator "may not be able to prove equivalence if the bisimulation requires additional predicates (or boolean connectives) beyond the ones we consider", as benchmark 20 shows.
- The theory of lists is undecidable too, so "the SMT solver may time-out when checking validity queries".
- It proves equivalence, not disequivalence: it "cannot provide witnesses to prove that two applications are indeed not equivalent"; counterexample generation is planned (§11).
- It proves equivalence under list semantics, so for an application using set or bag semantics for query results it "may end up reporting false positives".

## Open problems and building blocks

- **Open:** none beyond the limits above, which the authors "plan to address" (§11).
- **Released:** Nothing stated.
- **To reuse it:** Z3 with 2 seconds per query (§7); programs hand-translated into the IR (§8.2); runs took 0.2 s to about 150 s per benchmark (§8.2).
- **Beyond its domain:** "we believe our technique can be easily extended for proving other relational correctness properties" (§9 "Relational Program Logics").

## On this site

- **Discussed in:** [Query equivalence: prove or refute](#/challenges/query_equivalence) · [SQL features that verifiers don't cover](#/challenges/verifier_coverage_gaps)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/prove-smt">prove-smt</a></span>
