# Qr-Hint: Actionable Hints Towards Correcting Wrong SQL Queries

**Qr-Hint** · SIGMOD 2024 (PACMMOD)

Read: [PDF](https://arxiv.org/pdf/2404.04352) · [arXiv](https://arxiv.org/abs/2404.04352) · [DOI](https://doi.org/10.1145/3654995)  
Code: [qr-hint](https://github.com/yihaoh/qr-hint)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Given a correct target query and a wrong working query, gives step-by-step repairs (repair sites and fixes), clause by clause from FROM to SELECT, that the authors claim provably lead to a query equivalent to the target (abstract; §1; Theorem 3.1; see ).
- FROM's check compares the two queries' table multisets (§4); later stages' checks are decided by Z3, with properties of SQL aggregates encoded for it (§3; §5–§8). The authors claim locally optimal fixes under stated assumptions (abstract; §3.1; Lemma 5.2). Evaluated on wrong student queries and on TPC-H queries with injected errors, plus a user study (§9; §10).
- Repair with an equivalence guarantee and no LLM; the authors argue an LLM could word the hints, but the guarantee would be "difficult, if not impossible, for generative AI to achieve by itself" (§1). Guaranteed only for select-project-join queries with one level of grouping, no NULLs and no general subqueries (§3.1); it reports that 35 of 341 wrong student queries used unsupported features (§9).

## In plain words

A student's SQL query is wrong, and the instructor has a correct one. Teaching staff guide students one at a time, which "is limited in scalability" (§1); Qr-Hint aims to help at scale, starting from the student's own query and not basing its hints completely on how the solution is written (abstract; §1). It goes clause by clause in a database's logical order (FROM, WHERE, GROUP BY, HAVING, SELECT), names the places to edit, and uses the solver Z3 (a program that decides whether logical formulas can be true) to check each clause. The authors prove that following the hints ends in a query returning the same rows as the correct one on every database, for queries of one unnested SELECT block with joins, filters and at most one level of grouping, without NULL values (§3.1). They call it "a novel framework" (§1) with "provably correct and locally optimal hints" (abstract). In a small user study, 100% and 87.3% of students given its hints found at least one error in two wrong queries, against 14.3% and 71.4% without hints (§10).

## Background and terms

**Terms to know:** [query equivalence](#/glossary/query-equivalence) · [bag semantics](#/glossary/bag-semantics) · [SAT and SMT solvers](#/glossary/sat-and-smt-solvers) · [select-project-join (SPJ) query](#/glossary/select-project-join-spj-query) · [decidable and undecidable](#/glossary/decidable-and-undecidable) · [NP-complete and the polynomial hierarchy](#/glossary/np-complete-and-the-polynomial-hierarchy) · [disjunctive normal form (DNF)](#/glossary/disjunctive-normal-form-dnf) · [soundness and completeness](#/glossary/soundness-and-completeness)

**The paper's own terms:**
- **SPJ, SPJA**: a query in the fragment is SPJA if it has grouping, aggregation or DISTINCT, otherwise SPJ (§3 "Queries").
- **stage, viability check**: a stage handles one clause (three for SPJ, five for SPJA); the user clears it by passing its check (§3.1).
- **repair site, fix**: a repair is a set of non-overlapping subtrees of a predicate's (a WHERE or HAVING condition's) syntax tree (the sites), each with a new formula (its fix), correct if the result is logically equivalent to the target (Def. 2).
- **cost of a repair**: a penalty w per site plus the syntax-tree nodes deleted and inserted, divided by the two predicates' combined size (Def. 3, Eq. 1).
- **repair bound**: a lower and an upper formula enclosing everything fixes at the given sites can produce (§5.1).
- **local optimality**: per-stage guarantees, under stated assumptions, that hints are necessary or minimal (§3.1 "Optimality").

**Missing glossary terms:**
- **Boolean minimization**: finding a smallest formula with a given truth table, where *don't-care* rows may take either value; on the second level of the polynomial hierarchy, per the paper (§1).

**Builds on:**
- SMT solvers for SQL "as with previous work" (§3 "SMT Solvers"): Chu et al.'s Cosette-line prover ([UDP](#/papers/chu2018udp "Axiomatic foundations and algorithms for deciding semantic equivalences of SQL queries (2018)")), the prover EQUITAS ([EQUITAS](#/papers/zhou2019equitas "Automated verification of query equivalence using satisfiability modulo theories (2019)")) and the explainer RATest ([RATest](#/papers/miao2019ratest "Explaining Wrong Queries Using Small Examples (2019)")). The authors say previous work mostly treats aggregates as [uninterpreted functions](#/glossary/uninterpreted-function) (§3).
- ESPRESSO (Brayton et al.), a Boolean minimizer (§5.2).
- Brass et al.'s list of 43 kinds of SQL semantic errors, for test data (§9; Tab. 5).
- Tools that check a query against a reference or explain the difference (§2): XData ([XData](#/papers/chandra2014xdata "Data generation for testing and grading SQL queries (2015)")), Cosette ([Cosette](#/papers/chu2017cosette "Cosette: An Automated Prover for SQL (2017)")), RATest, c-instances, Chandra et al.'s edit-based grading ([Edit Based Grading of SQL Queries](#/papers/chandra2019grading "Edit Based Grading of SQL Queries (2019)")), and SQLRepair (test-driven repair). The authors say "previous work has not been able to suggest small fixes that will make the user query equivalent to the reference query" (§2).

## Problem and setting

- **Question:** lead the user, clause by clause and with small edits to their own syntactically correct query, to a query equivalent to the target (abstract; §3.1).
- **Queries:** select-project-join queries with an optional single level of grouping and aggregation, in one block (no JOIN operators) (§3 "Queries"); WITH clauses, aggregation-free subqueries in FROM and non-outer JOINs are rewritten into one block (footnote 2). Basic SQL types and operators "to the extent supported by Z3" (§5).
- **Semantics:** bag; equivalent means the same bag of rows, ignoring row and column order, on any database, plus the same groups for grouped intermediate queries (§3 "Queries"). All columns are assumed NOT NULL; constraints such as keys are not considered (§3.1 "Limitations").
- **Output:** currently, repairs for teaching staff, who word the hints; the authors say a generative-AI chatbot could do the wording, with Qr-Hint supplying the guarantees (§1, Ex. 2).

## Approach

- **Solver (§3 "SMT Solvers").** Z3 tests equivalence and satisfiability under assertions such as WHERE conditions and aggregate rules. It may answer "unknown"; the algorithms act only on positive answers, which Z3 guarantees are not false positives.
- **Main guarantee.** A cleared clause is never reopened. At every stage: if the working query fails the check, some query passes this and all earlier checks, differs only in this and later stages' clauses, and follows the hint; and after the stage, some query equivalent to the target differs from the working query only in later stages' clauses (Thm. 3.1). This does not rely on the optimality assumptions below (§3.1).
- **FROM (§4).** Two SPJ queries with different table multisets cannot be equivalent under bag semantics, assuming no database constraints and a non-empty result for one of them on some database (Lemma 4.2).
- **WHERE (§5).** RepairWhere (Alg. 1) tries sets of up to n repair sites, smallest first, with early stopping. A site set can be fixed exactly when the target lies in its repair bound, computed by CreateBounds (Alg. 2); the authors call this test "exact" (Lemmas 5.3, 5.4). DeriveFixes (Alg. 3) pushes bounds down to each site and looks for a smallest fix within it by Boolean minimization. Assuming Z3 is complete for the two predicates' logic and the minimizer returns a minimum-size formula, the repair found with up to as many sites as the predicate has nodes has the lowest cost, if some lowest-cost repair has one site or all sites under one parent (Lemma 5.2); the authors say this covers a single mistake and purely conjunctive or disjunctive conditions (§5). DeriveFixesOPT (App. C.2) fixes several sites jointly; "It is heuristic in nature" (§5.2). Worst-case time is exponential in the WHERE predicates' size (§5.2 "Complexity and Optimality").
- **GROUP BY (§6).** When both queries group or aggregate, Z3 checks that both lists partition the WHERE-satisfying rows alike. If the satisfiability test gives no false positives, the hint yields equivalent grouping; if also no false negatives, any correct fix removes at least the expressions it names, and when it asks for additions, removal alone can't work (Lemma 6.2).
- **HAVING (§7).** Ungrouped columns and aggregate inputs become arrays, with aggregate rules in the context (App. E); the WHERE procedures repair it. Correctness needs Z3 sound and the minimizer returning an equivalent formula (Lemma 7.1). Optimality like Lemma 5.2's (one site, or all sites under one parent) could be added under that lemma's assumptions (Z3 complete, minimizer optimal) plus a context encoding every aggregate property relevant to inference (§7).
- **SELECT (§8).** Expressions are compared position by position; assuming no false positives, the result is equivalent to the target, with minimal removals and additions for SPJ queries (Lemma F.1).

## Results

- **Data (§9).** *Students*: wrong queries for 4 questions from an undergraduate course; of 341, 35 (11%) used unsupported features. *Students+* adds handcrafted queries for supported Brass et al. error kinds. *TPCH*: TPC-H (a decision-support benchmark) queries with injected errors, conjunctive (two errors each) or nested AND/OR (1–5 errors).
- **Students+ (§9.1).** Of 25 supported Brass et al. error kinds, 11 were real errors, all fixed; 3 were stylistic issues in correct queries, correctly not flagged; for 11 stylistic or efficiency issues it failed to detect equivalence and suggested fixes that still lead to correct queries. It "perfectly handles all of the 10 most common issues". Average time per query (mostly simple, conjunctive ones): 0.2 seconds with DeriveFixes.
- **TPCH, conjunctive (Fig. 2).** Both variants, exploring up to two sites, always return the optimal repair; time grows exponentially with the number of distinct atomic conditions, and DeriveFixes runs much faster; a first viable (not necessarily optimal) repair site comes in less than one second (§9.1).
- **TPCH, nested (Fig. 3).** With one error both find the optimal repair; with 2–3 errors only DeriveFixesOPT finds optimal or near-optimal ones, more slowly; with 4–5 errors ("arguably not the cases" Qr-Hint targets) both, capped at two sites, repair the whole WHERE (§9.1).
- **User study (§10).** 15 students completed questions over the DBLP schema (publications and authors). On Q1 and Q2, 100% and 87.3% given Qr-Hint's repair sites found at least one error, against 14.3% and 71.4% without hints (Fig. 5). Rating mixed hints on Q3 and Q4, the quality of the assistants' hints "varies greatly as perceived by participants", while Qr-Hint was "consistently perceived by participants as" helpful but requiring thinking (Fig. 6).

## Limits the authors state

- It "may sometimes suggest suboptimal or even unnecessary fixes (even though they still lead to correct queries)", due to undecidability and heuristics (§3.1 "Limitations"), e.g. in the FROM stage for some SPJA queries (§3.1 "Optimality").
- No NULLs, outer joins or database constraints (§3.1; future work, §11): NULLs could be added, with some extra effort, by EQUITAS's encoding; encoding constraints "can significantly hamper Z3's performance".
- No subqueries beyond aggregation-free ones in FROM; NOT EXISTS and NOT IN need set difference, "which we have not yet studied" (§3.1; future work, §11).
- With quantifiers ("for all" statements) and arrays Z3 is incomplete and may return "unknown" more often (§3); the aggregate rules encode "only a subset of their properties" (App. E).
- Worst-case time is exponential in query size, acceptable for education, the authors argue (§9.1).
- The user study is small, with low completion (§10); recorded times "may not be accurate" (footnote 8).

## Open problems and building blocks

- **Open:** scalability, since many steps evaluate all options; avoiding SMT solvers' limitations; a graphical interface (in progress); a larger user study (§11).
- **Released:** no code release stated. For the Students dataset the authors are "still exploring with the institutional review board the possibility of making this dataset publicly available" (§9).
- **To reuse it:** a correct target query in the fragment; Python 3.10, Apache Calcite ([Apache Calcite](#/papers/begoli2018calcite "Apache Calcite: A Foundational Framework for Optimized Query Processing Over Heterogeneous Data Sources (2018)")) for parsing, Z3, ESPRESSO via the Python library PyEDA (§9 "Implementation/Test Environment").

## On this site

- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/prove-smt">prove-smt</a></span>
