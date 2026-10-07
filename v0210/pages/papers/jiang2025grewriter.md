# GRewriter: Practical Query Rewriting with Automatic Rule Set Expansion in GaussDB

**GRewriter** · PVLDB 18(12) 2025

Read: [DOI](https://doi.org/10.14778/3750601.3750622)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Huawei GaussDB's rewriter: rules in G-DSL found by a WeTune-derived enumerator.
- Each rule verified by reducing it to representative query pairs checked with SQLSolver.
- Rule discovery at production scale; two showcase rules (Table 1, Fig. 3) are wrong under NULLs as printed, and Table 1's is the first of the new rules it reports speeding up production queries (Table 5).

## In plain words

A database speeds up queries by rewriting them into faster, equivalent forms. Huawei's GaussDB hard-codes its rewrites in C++ as a fixed pipeline, so each new one needs significant engineering and runs on every query; the authors say the rewriter therefore misses potential optimization opportunities (§1, PDF p. 1). They built GRewriter, a layer above GaussDB's existing optimizer: it applies rules written in a new rule language, has the optimizer estimate each rewritten version's cost, and runs the cheapest. An offline generator lists candidate rules, proves them correct with an existing equivalence checker, and keeps those that consistently speed up test queries. The authors present it as making a research prototype's approach practical in a commercial system, with "novel enumeration techniques and a new equivalence theorem" (abstract, PDF p. 1). In production, one query fell from 26 seconds to 17 milliseconds (§8.2, PDF p. 10); with 2,500 rules, a rule index and a cache, optimization time stayed within 0.26% of the original on queries of TPC-H, a standard benchmark (§8.4, PDF p. 12).

## Background and terms

**Terms to know:** [query rewriting and rewrite rules](#/glossary/query-rewriting-and-rewrite-rules) · [query equivalence](#/glossary/query-equivalence) · [logical plan](#/glossary/logical-plan) · [query optimizer](#/glossary/query-optimizer) · [optimizer cost estimate](#/glossary/optimizer-cost-estimate) · [integrity constraint](#/glossary/integrity-constraint) · [uninterpreted function](#/glossary/uninterpreted-function) · [scalar subquery](#/glossary/scalar-subquery) (Tab. 1, PDF p. 3)

**The paper's own terms:**
- **Two-phase optimization**: a rewriter transforms the logical plan with predefined rewrite functions, then a planner builds the physical plan (§2.1, PDF p. 2).
- **Bolt-on rewriter**: a rewrite layer above an existing optimizer that changes neither its rewriter nor its planner (§1, PDF p. 2).
- **Plan template**: a tree of operators whose parameters are symbolic, i.e. placeholders for attribute lists, expressions and relations; it matches a plan subtree of the same shape (§4.1, PDF p. 4).
- **G-DSL**: the rule language; a rule is a source template, a target template and constraints, over what §3 calls 12 SQL operators (§3–4, PDF p. 4; forms listed in Tab. 3, PDF p. 5).
- **G-Constraints**: statements that must all hold for a rule to apply: expression destructure (split a matched expression, e.g. an OR, into parts), symbol definition (name a new expression built from matched parts), constraint checks (equalities, `Notnull`, `UNIQUE`, `FOREIGN` key), and imperative `IF` and `WHILE` (§4.2, PDF p. 5).
- **Rewrite path**: start plan, end plan, rules applied, estimated cost, and whether to explore further (§5.1, PDF p. 6).
- **Rule Index**: a trie keyed by a template's **fingerprint**, its node types in preorder (§5.2, PDF p. 6).
- **Representative query pairs**: finitely many concrete query pairs built from a rule, whose equivalence implies the rule's correctness (§6.2, PDF p. 8).

**Builds on:**
- WeTune ([WeTune](#/papers/wang2022wetune "WeTune: Automatic Discovery and Verification of Query Rewrite Rules (2022)")), a research prototype that enumerates, verifies and tests rules; the generator "is derived from" it (§1, PDF p. 2; §2.2, PDF p. 3).
- SQLSolver ([SQLSolver](#/papers/ding2023sqlsolver "Proving Query Equivalence Using Linear Integer Arithmetic (2023)")), an equivalence prover for concrete SQL queries, used as verifier (§6.2, PDF p. 8).
- Cascades-style optimizers ([The Cascades Framework for Query Optimization](#/papers/graefe1995cascades "The Cascades Framework for Query Optimization (1995)"), [The Volcano Optimizer Generator](#/papers/graefe1993volcano "The Volcano optimizer generator: extensibility and efficient search (1993)")), extensible rule-based optimizers, rejected as too costly to switch to (§1, PDF pp. 1–2).
- Rule representations compared with G-DSL: QueryBooster ([QueryBooster](#/papers/bai2023querybooster "QueryBooster: Improving SQL Performance Using Middleware Services for Human-Centered Query Rewriting (2023)"), rewriting middleware with a rule language), SlabCity ([SlabCity](#/papers/dong2023slabcity "SlabCity: Whole-Query Optimization Using Program Synthesis (2023)"), whole-query synthesis), Calcite ([Apache Calcite](#/papers/begoli2018calcite "Apache Calcite: A Foundational Framework for Optimized Query Processing Over Heterogeneous Data Sources (2018)"), rules as Java classes) and CockroachDB's OptGen (rules with Go procedures) (§4.3, PDF p. 6).

## Problem and setting

- **Question:** how to grow a production rewriter's rule set cheaply, with automatically discovered, formally verified rules chosen per query at low cost (§2.3, PDF pp. 3–4).
- **SQL fragment:** Tab. 3's operators (PDF p. 5): projection (with DISTINCT), filter, left and inner join, IN and EXISTS subqueries, aggregation with GROUP BY and HAVING, UNION [ALL], LIMIT, ORDER BY.
- **Correctness:** every query pair a rule matches is equivalent (Thm. 6.1 proof sketch, PDF p. 8). Set or bag semantics: not discussed.
- **Usefulness:** a verified rule is kept only if it cuts latency by at least 10% on all six setups: uniform synthetic data with 100k and 1M rows, and the decision-support benchmarks TPC-H and TPC-DS at 1 GB and 5 GB (§6.3, PDF p. 8).
- **Production:** a large Chinese bank's transaction system and Huawei's internal enterprise resource planning (ERP) system; their queries are not disclosed (§8.1, PDF p. 9).

## Approach

- **Online rewriter (§5.1, Alg. 1, PDF pp. 6–7).** It fetches rules whose source template matches the plan's structure, checks their constraints against the catalog, applies each to make new paths, and repeats until no rule applies or 3 iterations pass. All plans, the original included, go to the existing optimizer for costing; the cheapest runs.
- **Rules and cache (§5.2–5.4, PDF pp. 6–7).** Rules are plain text in a system table, `G_RULES`, which administrators edit with ordinary SQL at runtime. The Rewrite History Cache keeps explored paths per query text with parameter values removed, with recent cost estimates, cleared when the data statistics behind cost estimates change.
- **Example rule (Fig. 3, PDF p. 6).** A filter on an OR of two predicates becomes a UNION ALL of two filtered branches, the second excluding rows the first returned.
- **Enumeration and pruning (§6.1, PDF pp. 7–8).** Templates over Tab. 3's operators (PDF p. 5) are paired and given every subset of candidate constraint statements. Pruning drops templates that parsed SQL can't produce, keeps only source templates seen in collected user queries, and uses a transitivity heuristic: if templates A and B are never equivalent under any constraints but A and C can be, B and C are taken "to be likely never equivalent under any constraints" and skipped. Supersets of a verified-correct constraint set are skipped as correct, subsets of an incorrect one as incorrect.
- **Verification (§6.2, PDF p. 8).** Each symbolic expression (an expression placeholder) becomes a random function, standing for any expression; each symbolic schema (the unknown table layout of a placeholder relation) becomes every concrete schema holding only the used attributes or one more unused attribute; SQLSolver checks the resulting SQL. **Thm. 6.1** lets a checker of concrete queries vouch for a whole rule: for a candidate rule, if every representative query pair is equivalent, the rule is correct. The paper gives a proof sketch (full proof in an external appendix, ref. [1]) with three cases: renaming, expressions replaced by "uninterpreted user-defined functions", and schemas differing only in unused attributes or attribute-list length.
- **Selection (§6.3, PDF p. 8).** A workload generator builds one matching query per rule, timed on the six setups. The authors state that verified rules "ensure semantic equivalence of SQL before and after rewriting".

## Results

- **Production (§8.2, PDF pp. 9–10).** It reports 18 recurring queries sped up (Tab. 4), most of all Q3, from 26 s to 17 ms (1543×), by turning a per-row `COUNT(*) … = 0` subquery into a left join so the planner can use its [anti-join](#/glossary/semijoin-and-anti-semijoin) operator. The speed-ups come from 7 rules new to GaussDB, 5 found by enumeration and 2 written by experts (Tab. 5). The first, COUNT=COUNT to EXISTS, which the authors say Table 1 (PDF p. 3) exemplifies, averaged 3.5× on Q13–Q16. On synthetic data, PostgreSQL lacked all 7 rewrites, MySQL and SQL Server most of them.
- **Production overhead (§8.2, PDF p. 10).** 4.5 µs on average for queries matching no rule; 221.7 µs for queries whose rewrites the planner finds not beneficial.
- **Generator (Tab. 6, PDF p. 10).** With pruning, 13,973 verified rules in 8 days, against WeTune's 1,023 in 7 days; WeTune+ (WeTune extended to 12 operators) and unpruned GRewriter are estimated at thousands of years or more.
- **Rule quality (§8.3, Fig. 4–5, PDF pp. 10–11).** 2,034 verified rules are useful on at least one dataset and 381 on all six; the 381 are integrated into GaussDB. Timing them in PostgreSQL, MySQL and SQL Server, the authors conclude "most rules may not be present in these systems".
- **Optimization time (§8.4, Fig. 6, PDF pp. 11–12).** On TPC-H queries with 2,500 rules, the Rule Index cuts it from 3.32 ms to 1.69 ms, and the cache brings it to 463.2 µs against the original optimizer's 462.0 µs (0.26% overhead).
- **Runtime rule changes (§8.4, Fig. 7, PDF p. 12).** Inserting the 381 rules while queries run speeds up optimizable queries at once.

## Limits the authors state

- For verified rules, "whether the rewrite improves SQL performance is unknown" until selection (§6.3, PDF p. 8).
- "While exponential growth of paths explored is possible due to the recursive nature of our rewrite process", "three design choices help reduce its likelihood and performance impact" (§7, PDF p. 8).
- "Our current implementation simply selects rules based on their inclusion times" (§7, PDF p. 9).
- With the Rule Index but no cache, optimization time "remains considerably higher than the original GaussDB" (§8.4, PDF p. 11).
- Production queries are not disclosed, for confidentiality (§8.1, PDF p. 9); other databases were compared on synthetic data (§8.2, PDF p. 10).
- Tab. 6's WeTune+ and unpruned figures are estimates (§8.3, PDF p. 10).
- "Other operators are defined similarly and we omit due to space limitations" (§4.1, PDF p. 5).

## Open problems and building blocks

- **Open:** rule prioritization, "we leave rule prioritization as future work"; adapting to changing workloads, e.g. by periodic regeneration or activating rules by recent gains, "left as future work" (§7, PDF pp. 8–9).
- **Released:** nothing stated, apart from an external appendix with the full proof of Thm. 6.1 (ref. [1], §6.2, PDF p. 8).
- **To reuse it:** a verifier for concrete queries such as SQLSolver; WeTune's and SQLSolver's source plus 4k and 15k lines of new Java; 8 days (Tab. 6, PDF p. 10) on a 24×2-core server with 188 GB memory (§8.1, PDF p. 9); collected user queries (§6.1, PDF p. 7); and an optimizer that costs plans (§5, PDF p. 6). The online rewriter is 26k lines of C++. The authors say the bolt-on design "should be easily adaptable to other relational database systems" (§1, PDF p. 2).

## On this site

- **Discussed in:** [Can SQL equivalence checkers be trusted?](#/challenges/checker_soundness) · [Refuting faulty rewrite rules](#/challenges/faulty_rewrite_rules) · [Discovering new rewrite rules](#/challenges/rewrite_rule_discovery)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/pairgen-apply">pairgen-apply</a><a class="tag sub" href="#/tags/qo-rules">qo-rules</a><a class="tag sub" href="#/tags/rewrite-classic">rewrite-classic</a><a class="tag sub" href="#/tags/rules-discover">rules-discover</a><a class="tag sub" href="#/tags/rules-lib">rules-lib</a><a class="tag sub" href="#/tags/rules-verify">rules-verify</a></span>
