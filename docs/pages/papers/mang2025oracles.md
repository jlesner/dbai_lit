# Automated Discovery of Test Oracles for Database Management Systems Using LLMs

**Argus** · SIGMOD (PACMMOD) · 2025

Read: [PDF](https://arxiv.org/pdf/2510.06663) · [arXiv](https://arxiv.org/abs/2510.06663) · [DOI](https://doi.org/10.1145/3802017)  
Code: [Argus](https://github.com/joyemang33/Argus)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- LLMs discover DBMS test oracles as Constrained Abstract Queries (equivalent-query skeletons).
- Equivalence is verified with SQL provers; the oracles find real logic bugs.
- The repo bundles provers and many generated equivalent pairs, and accepts a pair only when SQLSolver proves it and Polygon finds no counterexample (`provers/multi_provers.py`). With an LLM judge in place of the prover, all 20 bug reports it checked were false positives (§7.4); it reported prover bugs to SQLSolver and QED (§8).

## In plain words

Database engines sometimes return wrong answers without any error. Testers catch them with a test oracle: a recipe that rewrites a query into another that must return the same rows, so differing answers expose a bug. The authors argue that "the manual creation of oracles is a bottleneck" (§1). Their tool, Argus, has an LLM write pairs of equivalent query skeletons with blanks, keeps the pairs a SQL equivalence prover proves, and fills the blanks thousands of times with reusable snippets, many written by an LLM. Over three months on five well-tested engines they report 41 previously unknown bugs, 36 of them wrong-answer bugs (abstract). In a 6-hour run on Dolt, 5,000 discovered oracles found 10 unique bugs against 3 for hand-designed oracles from four earlier works, in Argus's pipeline (§7.3). They write: "To our knowledge, we are the first tool that utilizes LLMs to generate DBMS test oracles" (§1; DBMS: database management system).

## Background and terms

**Terms to know:** [query equivalence](#/glossary/query-equivalence) · [soundness and completeness](#/glossary/soundness-and-completeness) · [NULL and three-valued logic](#/glossary/null-and-three-valued-logic) · [uninterpreted function](#/glossary/uninterpreted-function) · [SAT and SMT solvers](#/glossary/sat-and-smt-solvers)

**The paper's own terms:**
- **test oracle**, two senses: in general, a mechanism that judges an output correct without knowing the right answer, for databases usually an equivalent rewrite whose results are compared (§1, §2); in Argus, a proven equivalent CAQ pair with its schema (§5.3).
- **logic bug**: the engine returns a wrong result without raising an error (§1); other bugs found are crashes and performance problems (§7.1).
- **CAQ (Constrained Abstract Query)**: a SQL template with placeholders (□1, □2, …), each with a constraint (§4, Fig. 2): `Expr(t1:BOOLEAN)` takes an expression over table `t1` returning that type; `Table(...)` takes a table or subquery with given columns and types.
- **equivalent CAQ pair**: two CAQs over one schema and the same placeholders such that every filling (the same snippet in both, meeting its constraint and the general constraints) gives queries that "return the same result set when executed on any database instance conforming to schema" (Def. 4.1–4.2; same snippet in both: §1).
- **virtual column / table**: an extra schema column or table standing in for a placeholder, so tools see an ordinary query (§5.1, Listing 3).
- **general constraints 𝒞** (§6.2): *determinism* (no `RANDOM` and the like); *null-preserving*, an expression returns NULL on a row of NULLs (`c1 + c2` is, `IFNULL(c1, 0)` is not); *empty-results-preserving*, empty output on an empty table (`sum(c1)` is not). The authors explain that outer joins, which pad unmatched rows with NULLs, can make a filled-in expression behave unlike the virtual column the prover saw.
- **soundness**, two senses: of an oracle, no false-positive bug reports (§1); of a prover, confirming only true equivalences (§2), the glossary's sense.
- **metamorphic coverage** (Ba et al., not listed here): the code that the two queries of an equivalent pair exercise differently (§7.2).

**Builds on:**
- The hand-designed oracles TLP (a query equals the union of its rows where a predicate is true, false, or NULL), NoREC, EET and DQP: written as CAQ pairs in App. C and the §7.3 baseline; none is on this site.
- SQLSolver ([SQLSolver](#/papers/ding2023sqlsolver "Proving Query Equivalence Using Linear Integer Arithmetic (2023)")), the prover (§1, §3).
- SQLancer and SQLancer++, random-query testing frameworks: SQLancer++'s generator makes the seeds (§3); both are coverage baselines (§7.2).
- WeTune ([WeTune](#/papers/wang2022wetune "WeTune: Automatic Discovery and Verification of Query Rewrite Rules (2022)")), which checks enumerated rewrite rules with a prover: "the most relevant to our work" (§9).

## Problem and setting

- **Question:** can an LLM discover oracles without hallucinations causing false positives, and with few LLM calls (abstract)? Asking an LLM for a variant of every query is too costly when testing "often requires executing thousands of queries per minute" (§1); checking pairs by running them on many databases is unreliable, they say (§1).
- **Scope:** relational engines, `SELECT` queries (§8 "Limitations"). Correctness is Def. 4.2's equivalence; whether duplicates and row order count is not discussed.
- **Targets:** Dolt (a SQL database with Git-style versioning), DuckDB (an embedded analytical database), MySQL, PostgreSQL and TiDB (a distributed SQL database) (Tab. 1). LLM: o4-mini (§7 "Testbed").

## Approach

Two stages (Fig. 1; worked example in §3):

- **Seeding (§5.1).** SQLancer++'s generator makes a schema with virtual entities, and a seed query.
- **CAQ generation (§5.2, Algorithm 1).** The LLM gets the seed plus samples of earlier candidates that passed and failed, and is asked for an equivalent CAQ whose query plan (the engine's chosen execution steps) differs most from those found (Problem 5.1). Passed candidates are clustered with k-means on the tree edit distance between their plans, and one per cluster goes into the next prompt (App. A).
- **Equivalence check (§5.3).** With placeholders as virtual entities, the prover sees two concrete queries; only proven pairs that also run on the engine are kept (§5.2, Algorithm 1). Tests can thus use features the prover can't handle, the authors argue.
- **Corpus (§6.1).** An LLM writes expressions over a table with every data type, prompted with sampled pieces of the engine's documentation; a grammar-based generator adds edge cases. Snippets are run to record their real types, and *cross-combination* nests type-matching expressions.
- **Instantiation (§6.2, Algorithm 2).** Sampled expressions get the target table's column names; table placeholders become a table name, a `WITH` subquery or a view. The general constraints are checked by a regular expression (nondeterminism) and by running snippets on NULL and empty inputs.
- **Filling virtual columns keeps a pair equivalent** when the two queries are equivalent on a schema containing the virtual columns, every occurrence of each virtual column is replaced by its expression, and each expression references "a unique row's column combination in all cases other than outer joins"; the queries are then equivalent on the schema without the virtual columns (Thm. B.1, App. B). For table placeholders, App. B states that equivalence is also preserved if the instantiated tables have no nondeterministic rows.
- **Testing (§6.3).** Random rows and indexes; differing results are reported as logic bugs.

## Results

- **New bugs (§7.1, Tab. 2, three months):** 41 previously unknown bugs, 36 of them logic bugs; 36 confirmed and 27 fixed. Listings 6–10 show examples, among them a Dolt `EXISTS` bug (Example 2).
- **Code coverage (§7.2, Fig. 3, 24 h):** above SQLancer and SQLancer++ on DuckDB; on PostgreSQL Argus "slightly underperforms SQLancer overall" but beats SQLancer++ and EET, and beats SQLancer on optimizer coverage and features in ten sampled queries.
- **Metamorphic coverage (Tab. 3, DuckDB, 10 suites of 100 tests):** 5.473×, 6.431× and 5.571× SQLancer's line, function and branch coverage.
- **Oracle count (§7.3, Fig. 4, Dolt v1.0.0, 6 h):** 5,000 Argus oracles found 10 unique logic bugs; 11 earlier oracles, re-expressed as CAQ pairs and filled from Argus's corpus, found 3; 50 Argus oracles found 2.
- **Prover against LLM judge (§7.4):** with GPT-5 judging equivalence instead (following [LLM-SQL-Solver](#/papers/zhao2023llmsqlsolver "LLM-SQL-Solver: Can LLMs Determine SQL Equivalence? (2025)")), none of 20 DuckDB bug reports was real, though only 1 of 20 judge-accepted pairs was inequivalent; the authors cite the rarity of bugs. All 20 sampled prover-accepted pairs, and the concrete pairs filled in from them, were equivalent. Of 10 rejections each, 8 were wrong for the prover against 5 for the judge, which they call "comparable".
- **Cost (§7.5, Fig. 5, Dolt, 1 h):** far higher throughput than prompting for whole pairs, and one bug against none; about \$3 for CAQs, \$12 for a 100,000-snippet corpus, roughly \$1 per 1,000 tests.
- **Ablations (§7.6):** clustering yields more valid CAQs and lower plan similarity than beam search or plain prompting (Tab. 4); LLM snippets beat grammar-only ones on coverage (Fig. 6).
- **Prover bugs (§8):** the authors reported bugs in SQLSolver and in QED ([QED](#/papers/wang2024qed "QED: A Powerful Query Equivalence Decider for SQL (2024)"), another equivalence prover), all fixed, among them a false proof (Listing 12). The authors state that "the soundness of our approach is independent of the correctness of specific prover implementations".

## Limits the authors state

- Only relational engines and `SELECT` queries (§8 "Limitations").
- Argus "does not provide a mechanism to prioritize or rank the generated oracles" (§8 "Limitations").
- Provers cover the core syntax implemented in Calcite (a query-optimization framework): outer joins, nested queries, simple `SUM` and `COUNT`; but they treat most engine-specific or user-defined functions as uninterpreted, possibly missing oracles; solver cost grows with query size, which may limit oracle size (§8 "Query classes supported by SQL equivalence provers").
- The App. B proofs "do not cover all SQL features, especially for those new features in future SQL standards"; no counterexample was seen in the experiments (App. B).
- Prover false negatives "are expected in general, as it is intentionally conservative to ensure soundness" (§7.4).
- Code coverage does not strongly correlate with finding logic bugs (§7.2); performance bugs are not targeted at scale (§6.3).

## Open problems and building blocks

- **Open:** a shift to "prioritizing and selecting the most effective oracles from a large pool of LLM-generated candidates" (§8); graph and spatial databases and other query languages (§8).
- **Released:** "The artifacts for Argus are available" (abstract).
- **To reuse it:** an LLM, a SQL equivalence prover, a grammar-based generator, the engine's documentation and the engine (§5, §6.1); a 64-core, 128 GB machine (§7 "Testbed").
- **Beyond its domain:** the framework "can also be applied to other DBMS tasks in the future, such as query optimization" (§9); it "opens new opportunities for testing other complex software with LLMs" (§10).

## On this site

- **Discussed in:** [Can SQL equivalence checkers be trusted?](#/challenges/checker_soundness) · [Refuting faulty rewrite rules](#/challenges/faulty_rewrite_rules) · [Equivalence of nondeterministic queries](#/challenges/nondeterministic_equivalence) · [Query equivalence: prove or refute](#/challenges/query_equivalence) · [Sourcing realistic, hard query pairs](#/challenges/query_pair_sourcing) · [Discovering new rewrite rules](#/challenges/rewrite_rule_discovery) · [SQL features that verifiers don't cover](#/challenges/verifier_coverage_gaps) · [Weak checkers get exploited](#/challenges/weak_checker_exploitation)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/hacking-sql">hacking-sql</a><a class="tag sub" href="#/tags/harness-sql">harness-sql</a><a class="tag sub" href="#/tags/llm-assist">llm-assist</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/nondet-eval">nondet-eval</a><a class="tag sub" href="#/tags/pairgen-check">pairgen-check</a><a class="tag sub" href="#/tags/rules-discover">rules-discover</a><a class="tag sub" href="#/tags/rules-verify">rules-verify</a></span>
