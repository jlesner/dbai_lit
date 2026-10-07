# SlabCity: Whole-Query Optimization Using Program Synthesis

**SlabCity** · PVLDB 16(11) 2023

Read: [DOI](https://doi.org/10.14778/3611479.3611515)  
Code: [SlabCity](https://github.com/eidos06/SlabCity)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Rule-free whole-query rewriting by program synthesis, with a new LeetCode benchmark with constraints.
- CEGIS with a tester, a 2-row bounded verifier and full verifiers (Cosette, SPES); ranked by EXPLAIN cost.
- A measured error rate for small-bound checking: 3% of rewrites that passed the tester and bounded check were wrong (§5.5).

## In plain words

Poorly written queries, from software or less experienced users, limit what a database's optimizer can do (§1, PDF p. 1). Existing rewriters turn a query into an equivalent, faster one by pattern-matching rules, which the authors say are "inherently limited in their ability to handle new query patterns" (abstract, PDF p. 1). SlabCity uses no rules: it searches SQL queries directly for one with the same answers, tries first candidates whose computations appear in the input query, rejects wrong candidates with a tester and with formal checkers, and keeps the candidate the database estimates to be fastest. Full proof applies to about 17% of rewrites; the rest rely on a check over small databases and inspection by hand (§1, PDF p. 2). With 5 seconds of search per query, the authors report that it can "rewrite 7–68% more queries than state-of-the-art query rewriters" (§1, PDF p. 3), two rule-based systems. They present it, "To our knowledge", as "the first synthesis-based query rewriting technique" able to optimize whole queries "without relying on any rewrite rules" (abstract, PDF p. 1).

## Background and terms

**Terms to know:** [query rewriting and rewrite rules](#/glossary/query-rewriting-and-rewrite-rules) · [query equivalence](#/glossary/query-equivalence) · [integrity constraint](#/glossary/integrity-constraint) · [counterexample database](#/glossary/counterexample-database) · [bounded verification](#/glossary/bounded-verification) · [SAT and SMT solvers](#/glossary/sat-and-smt-solvers) · [query plan and EXPLAIN](#/glossary/query-plan-and-explain) · [optimizer cost estimate](#/glossary/optimizer-cost-estimate) · [program synthesis](#/glossary/program-synthesis) (§1, PDF p. 2) · [CEGIS](#/glossary/counterexample-guided-inductive-synthesis-cegis) (§1, PDF p. 2; §4.1, PDF p. 5) · [window function](#/glossary/window-function) (e.g. `SUM(score) OVER (PARTITION BY gender ORDER BY day)`, Tab. 1, PDF p. 3)

**The paper's own terms:**
- **optimize vs. rewrite**: produce a faster query vs. some query, faster or not (§2 "Discussion", PDF p. 4).
- **dataflow**: a sequence of SQL operations the query performs on input tables or their columns, e.g. SUM of a column, or a comparison of two columns (Def. 4.2, Fig. 3, Ex. 4.3, PDF p. 6).
- **score**: minus the number of a candidate's dataflows that don't occur in the input query; 0 is the best (Eq. 1, §4.2, PDF p. 7). Repeated dataflows count each time (§4.3, PDF p. 7).
- **"fully verified" vs. "bounded verification"**: an output the full verifier proved vs. one that passed only the tester and bounded verifier (§1, PDF p. 2).
- **coverage**: how many input queries a technique optimizes; **latency reduction**: input latency over output latency (§5.2–5.3, PDF pp. 9–10).

**Builds on:**
- The bounded verifiers "in Cosette [26, 66]" and the full verifiers of Cosette and SPES (§4.4, PDF p. 8): [Cosette](#/papers/chu2017cosette "Cosette: An Automated Prover for SQL (2017)"), [Speeding up symbolic reasoning…](#/papers/wang2018symbolic "Speeding up symbolic reasoning for relational queries (2018)"), [SPES](#/papers/zhou2020spes "SPES: A Symbolic Approach to Proving Query Equivalence Under Bag Semantics (2022)"). Per §6 (PDF p. 12), Cosette builds [proof assistant](#/glossary/proof-assistant) proofs or counterexamples; EQUITAS ([EQUITAS](#/papers/zhou2019equitas "Automated verification of query equivalence using satisfiability modulo theories (2019)")) and SPES (refs. [73, 74]) translate each query into a logical formula an SMT solver checks.
- Its baselines (§5.1, PDF p. 9; §6, PDF p. 11): LearnedRewrite ([LearnedRewrite](#/papers/zhou2021learnedrewrite "A learned query rewrite system using Monte Carlo tree search (2021)")), which orders the rewrite rules of Apache Calcite (an open-source query-processing framework) by [Monte Carlo tree search](#/glossary/monte-carlo-tree-search-mcts), and WeTune ([WeTune](#/papers/wang2022wetune "WeTune: Automatic Discovery and Verification of Query Rewrite Rules (2022)")), an automatic rewrite-rule generator.
- Prior synthesis-based rewriters it goes beyond (§1, PDF p. 2): FGH-rule [67], where a rule fixes a template for a query in Datalog (a rule-based query language with recursion) that synthesis completes, and Sia [72], which only adds WHERE predicates.

## Problem and setting

- **Question:** given a query and an integrity constraint, find a query that (1) gives "the same output on any database 𝐷 that meets the integrity constraint" and (2) runs faster, by EXPLAIN or execution (Def. 3.1, PDF p. 4).
- **SQL fragment** (Fig. 2, PDF p. 5): selection, GROUP BY with HAVING, ORDER BY, inner and left joins, nesting in FROM, DISTINCT, MAX/MIN/AVG/SUM/COUNT (also as window functions), DENSE_RANK and RANK.
- **Constraints** (§3, PDF p. 4): primary and foreign keys, comparisons and implications within a row, whether a column can be NULL, numeric ranges, enums. NULL semantics: not otherwise discussed.
- **Workloads** (§5.1, PDF p. 9): 1,131 user solutions accepted by the LeetCode practice site, filtered by hand, with formalized schemas and constraints; all 794 queries of Calcite's rewrite-rule test suite; and the TPC-H and TPC-DS decision-support benchmarks. PostgreSQL 12.13. Data: 100K–10M rows (LeetCode), 250K–4M (Calcite), uniform or skewed (Zipfian); TPC at scale factor 1 (1 GB).
- **Use case:** queries run many times (dashboards, web apps), or once but for much longer than several seconds (§1, PDF p. 2).

## Approach

- **CEGIS loop** (Alg. 1, §4.1, PDF pp. 4–5): candidates come in score order; one failing a stored counterexample is skipped cheaply; the rest go to the checker, which accepts them or returns a new counterexample. Accepted ones are ranked at the end.
- **Dataflow score** (§4.2, PDF pp. 5–7): an optimizing query "typically exhibits dataflows that are also manifested in" the input, so candidates with foreign dataflows (AVG where the input uses SUM) score lower; using only some of the input's dataflows is free, so redundant parts can go. Rules: Fig. 4 (PDF p. 7).
- **Stratified search** (§4.3, Alg. 2, Fig. 5, PDF p. 7): a part never scores lower than the whole, so all score-0 queries are built first, then score −1, and so on, bottom-up from parts scoring at least as much; smaller queries first within a score. Counting dataflows as a multiset makes each layer terminate. Fig. 5 shows a key subset of the rules; the rest are in a technical report, ref. [11] (PDF p. 8).
- **Tester** (§4.4, PDF p. 8): builds test databases from syntactic hints: rows satisfying the input's filter and join conditions, duplicated non-key values for keywords such as DISTINCT, duplicated values in GROUP BY columns that differ from the input's. A constraint solver "such as Microsoft Z3" solves these with the integrity constraint, giving a distinguishing database or "unknown".
- **Bounded verifier** (§4.4, PDF p. 8): Cosette's; a pass guarantees equal outputs on all databases of up to 2 rows (user-adjustable), with cell values unbounded.
- **Full verifier** (§4.4, PDF p. 8): Cosette's and SPES's, run only when the cheaper checks can't disprove a candidate.
- **Performance ranker** (§4.5, PDF p. 8): EXPLAIN cost estimates; measured latency on a sample, or all data when justified, also works.

## Results

- **Coverage** (Fig. 6–7, PDF p. 9; §5.2, PDF p. 10): on uniform data, SlabCity optimizes more queries than LearnedRewrite and WeTune at every size on both workloads ("7–68% more queries", §1, PDF p. 3); outputs that passed only the tester and bounded verifier were inspected by hand and "confirmed the optimizations included in our results are indeed correct" (§5.2, PDF p. 10). Zipfian data gives "similar results" (Tab. 6, PDF p. 10). The gap is larger on LeetCode (§5.2, PDF p. 10).
- **Latency** (Fig. 6–7, PDF p. 9): on uniform data, the geometric-mean latency reduction is 2.1× for SlabCity against 1× (LearnedRewrite) and 1.2× (WeTune) on LeetCode 10M, and 10.1× against 1.3× and 1.1× on Calcite 4M.
- **TPC** (§5.2–5.3, PDF p. 10): on TPC-H, SlabCity and LearnedRewrite optimize the same queries, with similar speedups; on TPC-DS, SlabCity optimizes one more, with faster outputs; WeTune optimizes none.
- **Run time** (Tab. 7–8, PDF pp. 10–11): "In general", equivalence checking takes most of the time; on queries it rewrites, median time to the output query is 0.84 s (LeetCode) and 0.74 s (Calcite); rule-based approaches are "generally faster".
- **Ablations** (§5.4, PDF p. 11): on LeetCode, not reusing counterexamples cuts the queries searched in 5 s; enumerating by size "was not able to optimize any of our input queries within 5 seconds"; ranking by actual latency instead of EXPLAIN "in general" gives "slightly higher coverage and latency reduction ratios" (Tab. 9).
- **Verification** (§5.4–5.5, PDF p. 11): for LeetCode 100K, "17% of the queries can be fully verified by Cosette and SPES". Of rewrites passing the tester and bounded verifier, "97% of them are confirmed to be correct (either via full verification or manual inspection) and only 3% are found to be incorrect". Also, "about 5%" of LearnedRewrite's rewrites with Calcite rules "were proved incorrect by SlabCity's checker".

## Limits the authors state

- Full verification "is applicable to a subset of all rewrites (about 17%)"; users can inspect outputs flagged "bounded verification" by hand (§1, PDF p. 2).
- The tester "cannot prove equivalence" (§4.4, PDF p. 8); the full verifiers are "most suitable for common queries (such as select-project-join)", i.e. filters, column choices and joins, and more expensive (§4.4, PDF p. 8).
- Some queries the baselines optimize are missed, because they use operators "not yet supported by our prototype" (e.g. COALESCE) or hit the 5-second timeout (§5.2, PDF p. 10).
- Of the LeetCode solutions, the authors "manually filtered out as many incorrect queries as we could" (§5.1, PDF p. 9).
- EXPLAIN "is known to give inaccurate cost estimates" (§5.4, PDF p. 11).

## Open problems and building blocks

  - Supporting more operators and speeding up search, e.g. "by parallelizing the search" (§5.2, PDF p. 10).
  - The authors believe the dataflow framework can discover rewrite rules "akin to WeTune": generalize a found pair into query templates under a more general constraint and check them with WeTune's verifier (§7, PDF p. 12).
  - Quantifying how better rewriting affects traditional query tuning (§7, PDF p. 12).
- **Released:** the PVLDB artifact box says "The source code, data, and/or other artifacts have been made available" (PDF p. 1); the authors "contribute a new benchmark" of LeetCode queries (§1, PDF p. 2).
- **To reuse it:** a constraint solver such as Z3, Cosette and SPES (§4.4, PDF p. 8), EXPLAIN (§4.5, PDF p. 8), the integrity constraints written out, the fragment of Fig. 2 (PDF p. 5), 5 seconds per query (§1, PDF p. 2). It can also run alongside rule-based rewriting, invoked where rules don't apply (§5.5, PDF p. 11).

## On this site

- **Discussed in:** [Refuting faulty rewrite rules](#/challenges/faulty_rewrite_rules) · [Minimal counterexamples](#/challenges/minimal_counterexamples) · [Equivalence under schema constraints](#/challenges/schema_constrained_equivalence) · [Verified query speedups](#/challenges/verified_query_speedup)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/cex-smt">cex-smt</a><a class="tag sub" href="#/tags/hacking-sql">hacking-sql</a><a class="tag sub" href="#/tags/rewrite-classic">rewrite-classic</a><a class="tag sub" href="#/tags/rewrite-eval">rewrite-eval</a><a class="tag sub" href="#/tags/rewrite-smt">rewrite-smt</a></span>
