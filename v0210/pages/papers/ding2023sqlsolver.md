# Proving Query Equivalence Using Linear Integer Arithmetic

**SQLSolver** · PACMMOD 1(4) / SIGMOD 2024 · 2023

Read: [PDF](https://www.cs.yale.edu/homes/piskac/papers/2024SIGMOD.pdf) · [DOI](https://doi.org/10.1145/3626768)  
Code: [SQLSolver](https://github.com/SJTU-IPADS/SQLSolver)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Unbounded prover that handles U-expression *unbounded summations* via LIA\* (linear integer arithmetic with stars).
- Extends LIA\* for nested, parameterized and non-linear sums, plus ORDER BY via divide and conquer; one ORDER BY elimination rule changes results when the offset isn't 0.
- A prover baseline: SQLEquiQuest calls it "the best performing tool" ([Can the Rookies Cut…](#/papers/singh2024sqlequiquest "Can the Rookies Cut the Tough Cookie? Exploring the Use of LLMs for SQL Equivalence Checking (2024)")), ParSEval "a state-of-the-art verification-based prover" ([ParSEval](#/papers/chen2025parseval "ParSEval: Plan-aware Test Database Generation for SQL Equivalence Evaluation (2025)") PDF p. 9).

## In plain words

Two SQL queries are equivalent when they return the same rows, each as often, on every database. A prover for this can check optimizer rewrite rules and help discover new ones (§1, PDF p. 2). Projection and aggregates become sums over all possible rows, which, the authors say, earlier provers handle "in an ad-hoc manner based on heuristics or syntax comparison" (abstract, PDF p. 1). SQLSolver recasts these sums in a known extension of integer arithmetic whose formulas reduce to ones an off-the-shelf solver decides; the authors extend it for cases real queries create, add sorted results, and state that every pair it proves is equivalent (§5, PDF p. 20). On equivalent pairs taken from two optimizers' rewrite rules and two standard benchmarks, it reports proving 384 of 400, against 207 for three earlier provers combined (§6.2, PDF p. 21). They present it as a "principled way" (abstract, PDF p. 1) that improves on existing provers.

## Background and terms

**Terms to know:** [query equivalence](#/glossary/query-equivalence) · [bag semantics](#/glossary/bag-semantics) · [first-order logic](#/glossary/first-order-logic) · [SAT and SMT solvers](#/glossary/sat-and-smt-solvers) · [satisfiable and valid](#/glossary/satisfiable-and-valid) · [soundness and completeness](#/glossary/soundness-and-completeness) · [decidable and undecidable](#/glossary/decidable-and-undecidable) · [query rewriting and rewrite rules](#/glossary/query-rewriting-and-rewrite-rules) · [linear integer arithmetic (LIA)](#/glossary/linear-and-nonlinear-integer-arithmetic) · [equisatisfiable](#/glossary/equisatisfiable)

**The paper's own terms:**
- **U-expression**: a query as a function f(t) giving how many times tuple t is in the result (§1, PDF p. 2); terms in Tab. 2 (PDF p. 6).
- **unbounded summation**: a sum "over the infinite domain of all possible tuples" (§1, PDF p. 2).
- **syntax-based and semantics-based checkers**: the first (UDP, SPES) normalize both queries by rules and compare structure; the second (WeTune, SQLSolver) test a first-order formula's satisfiability (§1, PDF p. 2).
- **LIA\*** (linear integer arithmetic with stars): LIA plus the additive closure S\*, all sums of any number of elements of a set S of integer vectors, which can model a sum over an infinite domain (§3, PDF p. 8); a **star formula** states membership in it (§4.2, PDF p. 12).
- **nested, parameterized, non-linear summations**: a sum inside a sum (usually from subqueries); one with free variables (defined and used outside it) or non-integers such as strings (§4.2, PDF p. 11); one multiplying variables (often from joins, INTERSECT; §3, PDF p. 9; §4.2, PDF p. 15).
- **over-approximation**: Q over-approximates P when not-Q implies not-P, so Q unsatisfiable means P unsatisfiable (§4.2, PDF p. 15) ([glossary](#/glossary/over-approximation-and-under-approximation)).
- **ordered bag semantics** (Definition 1, §4.4, PDF p. 19): if Q1's result is ordered, Q2 is equivalent iff the results hold the same multiset of tuples and any two tuples are in the same order in both.

**Builds on:**
- UDP ([UDP](#/papers/chu2018udp "Axiomatic foundations and algorithms for deciding semantic equivalences of SQL queries (2018)")), which defined U-expressions; the soundness sketch uses its result (§5, PDF p. 20).
- WeTune ([WeTune](#/papers/wang2022wetune "WeTune: Automatic Discovery and Verification of Query Rewrite Rules (2022)")), a rule-discovery system whose verifier sends U-expressions to SMT (§2.1–2.2, PDF pp. 5–7).
- SPES ([SPES](#/papers/zhou2020spes "SPES: A Symbolic Approach to Proving Query Equivalence Under Bag Semantics (2022)")), a syntax-based prover; also a baseline (§6.1, PDF p. 21).
- LIA\* work, not listed here: Piskac and Kuncak [39] (reduction to LIA) and Levatich et al. [30] (the approximation-based procedure adopted) (§7, PDF p. 24).

## Problem and setting

- **Question:** under bag semantics (ordered bag for ORDER BY, §4.4, PDF p. 19), show that no tuple can have different multiplicities in the two U-expressions, an unsatisfiability check (§2.2, PDF p. 6). Equivalence is "undecidable for general SQL queries" (§1, PDF p. 2); the prover is "sound but incomplete" (§5, PDF p. 20).
- **SQL covered** (Tab. 2–4, PDF pp. 6, 17–18) includes outer joins, INTERSECT, VALUES, [scalar subqueries](#/glossary/scalar-subquery), CASE, and MAX, MIN, SUM, COUNT and AVG with GROUP BY/HAVING, "all kinds of aggregate functions specified as mandatory SQL features in the SQL standard" (§4.3, PDF p. 17); ORDER BY with LIMIT/OFFSET. Lateral subqueries and [window functions](#/glossary/window-function) are unsupported (§6.2, PDF p. 22).
- **NULLs:** the aggregate and scalar-subquery encodings test IsNull (Tab. 3–4, PDF pp. 17–18); how comparisons with NULL evaluate is not discussed. **Constraints:** one example assumes x "is unique and not NULL" (§4.2, PDF p. 12).
- **Benchmarks** (§6.1, PDF p. 21), all equivalent pairs: 232 from the test suites of Calcite (a query-optimization framework, [Apache Calcite](#/papers/begoli2018calcite "Apache Calcite: A Foundational Framework for Optimized Query Processing Over Heterogeneous Data Sources (2018)")), 127 from rewrite rules of Spark SQL (Apache Spark's SQL engine), and 19 and 22 from TPC-C and TPC-H, benchmarks "used to evaluate the performance of database systems", via Spark SQL's optimizer.

## Approach

- **Basic approach (§3, PDF pp. 7–9):** name each unbounded summation with an integer variable, restate them as a star formula over integer terms, reduce it to LIA with [30] and call an SMT solver; unsatisfiable means equivalent.
- **Theorem 4.1** (from [39]; §4.1, PDF p. 10) lets a program remove the star: a LIA\* formula is equisatisfiable, for some integer k, with a LIA formula in which the summed vector is a linear combination of k vectors that each satisfy the inner LIA formula.
- **Extensions (§4.2, PDF pp. 10–16),** for cases prior LIA\* work did not consider:
  - *Nested:* replace inner sums recursively; by Theorem 4.2 (PDF p. 12), if the inner formula is equivalent to a LIA formula, the nested one is equivalent to the plain LIA\* formula with it inside, so it is solved inside out.
  - *Parameterized:* split each star formula along its body's disjunctive normal form (an OR of ANDs, PDF p. 13), then apply Theorem 4.3 (PDF p. 14), which pulls a condition P2 out of a sum. Conditions: v and x are same-size integer vectors and y is independent of them (no component equal to one of theirs); P, P1, P2 are any first-order formulas. Then, beside P, summing vectors (x, y) with P1(x) and P2(y) into v is equisatisfiable with summing vectors x with P1(x) into v and requiring that P2 holds for some y or v is zero. y may have any type.
  - *Non-linear:* replace each product of variables by a fresh variable that is zero exactly when a factor is (Eq. 13, PDF p. 16), an over-approximation.
- **Aggregates (§4.3, Tab. 4, PDF pp. 17–19):** it computes COUNT and SUM by sums, MAX by two properties (no tuple in the group exceeds the result, one equals it), MIN likewise, AVG as result × COUNT = SUM.
- **ORDER BY (§4.4, PDF pp. 19–20)**: Step 1 drops a sub-query's ORDER BY without LIMIT or OFFSET, empties `limit 0`, moves the sort of a sorted, limited R1 combined with R2 by UNION ALL, FULL JOIN or LEFT JOIN outside under the same outer ORDER BY/LIMIT/OFFSET, and merges nested sorts. Step 2 matches ORDER BY clauses of Q1 and Q2 (same attributes, LIMIT and OFFSET), proves the sub-queries they sort equivalent, replaces both "by the same arbitrary relation", and recurses. Theorem 4.4 (PDF p. 20): two ORDER BY queries passing Step 2 after simplification are equivalent under ordered bag semantics.
- **Soundness and completeness (§5, PDF pp. 20–21):** Theorem 5.1 (PDF p. 20): pairs SQLSolver proves "must be equivalent under bag semantics or ordered bag semantics". It is complete for [conjunctive queries](#/glossary/conjunctive-query) and their [unions](#/glossary/union-of-conjunctive-queries) (PDF p. 20). By Theorem 5.2 (PDF p. 21) it proves every equivalent pair whose queries are UNION ALLs of parts that each read one relation and either select columns and aggregates with WHERE, GROUP BY on those columns and HAVING, or select [distinct] columns with WHERE; aggregates only count, max or min, and no predicate whose satisfiability SMT solvers cannot determine. The authors say "other provers cannot" guarantee this.

## Results

- **Pairs proved** (§1, PDF p. 3): all 232 Calcite, 114 of 127 Spark SQL, all 19 TPC-C and 19 of 22 TPC-H pairs, against 121, 71, 15 and 0 for UDP, SPES and WeTune combined; 384 of 400 against 207, 177 of them proved by none of the three (§6.2, PDF p. 21). SQLSolver proves every pair an existing prover proves (PDF p. 22).
- **Why the others fail** (Tab. 5, PDF p. 22), over the pairs SQLSolver proves: besides unsupported features and ordered bag semantics, UDP, SPES and WeTune fail 160, 72 and 181 bag-semantics pairs because of their checking algorithms.
- **ORDER BY** (§6.2, PDF p. 22): SQLSolver needs the §4.4 algorithm (PDF pp. 19–20) for 39 pairs; given it, the other three together prove 22 of them, which the authors read as both algorithms being "essential".
- **Latency** (Tab. 6, PDF p. 23), over pairs both prove: on Calcite, UDP 3178 ms against SQLSolver's 28; SPES and WeTune are faster.
- **Rule discovery** (§6.3, PDF p. 23): inside WeTune's discovery module, SQLSolver finds all 35 useful rules WeTune found plus "42 new rewrite rules" (§1, PDF p. 3), meant to remove unnecessary aggregates and UNIONs; on "a few manually crafted queries" they give "a latency reduction of up to 99.70%" against no rewrite.

## Limits the authors state

- It "does not model all SQL features, such as lateral sub-queries", the "major reason" some Spark SQL pairs fail (§5, PDF p. 20).
- The LIA\* translation and non-linear handling "can also introduce completeness issues": the formula over-approximates the original, so if it is satisfiable, "Two queries may still be equivalent" (§5, PDF p. 20).
- ORDER BY support "relies on syntax structures and cannot handle any queries with ORDER BY clauses"; in the evaluation the last two sources "do not incur any false positives", and unproved pairs "are due to the lack of semantics modeling" (§5, PDF p. 20).
- Calling SMT several times makes it slower than WeTune and SPES (§6.2, PDF p. 23).

## Open problems and building blocks

- **Open:** combining SQLSolver with query-optimization work, "an interesting topic in the future" (§7 "Query optimization", PDF p. 24).
- **Released:** Nothing stated.
- **To reuse it:** Java 17.0.4, the SMT solver Z3 4.8.9, an ANTLR 4.8 parser; an AWS EC2 c5a.8xlarge for proving (§6.1, PDF p. 21); the SQL of Tab. 2–4 (PDF pp. 6, 17–18) and §4.4 (PDF pp. 19–20).

## On this site

- **Discussed in:** [Can SQL equivalence checkers be trusted?](#/challenges/checker_soundness) · [Equivalence of nondeterministic queries](#/challenges/nondeterministic_equivalence) · [Query equivalence: prove or refute](#/challenges/query_equivalence) · [Discovering new rewrite rules](#/challenges/rewrite_rule_discovery)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/prove-smt">prove-smt</a><a class="tag sub" href="#/tags/rules-discover">rules-discover</a><a class="tag sub" href="#/tags/rules-verify">rules-verify</a></span>
