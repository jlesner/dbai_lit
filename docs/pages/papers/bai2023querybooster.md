# QueryBooster: Improving SQL Performance Using Middleware Services for Human-Centered Query Rewriting

**QueryBooster** · PVLDB 16(11) 2023

Read: [PDF](https://arxiv.org/pdf/2305.08272) · [arXiv](https://arxiv.org/abs/2305.08272) · [DOI](https://doi.org/10.14778/3611479.3611497)  
Code: [QueryBooster](https://github.com/ISG-ICS/QueryBooster)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Human-centered rewriting middleware: users write rules (VarSQL) or give example pairs it generalizes.
- Treats application and database as black boxes.
- A rule DSL and rule-synthesis-from-examples source; its rules are user-written or generalized from user examples, and it doesn't verify them (§3 only suggests external verifiers), so not <a class="tag" href="#/tags/pairgen">pairgen</a>.

## In plain words

Applications such as the dashboard tool Tableau generate their own SQL, sometimes in a slow form. The authors' example: a Tableau substring filter took 34 seconds on Postgres with a full scan, while an equivalent rewrite took 0.32 seconds with a text index that Postgres can't use for the original (§1). Often developers can change neither the application nor the database, but know their data well enough to write faster queries (§1).

QueryBooster sits between them and rewrites each query on its way, using rules that people write in a rule language, VarSQL (SQL with placeholders), or that the system proposes from example pairs of a slow query and its fast rewrite (abstract, §3). In a user study, more than 80% of 22 SQL users picked the VarSQL rule as the easiest of three to understand, for each of three rewrites (§7.2). On 20 Tableau-generated queries for the TPC-H benchmark on PostgreSQL, the authors' hand-written rules sped up 10, against 2 for rules the tool WeTune found automatically (§7.5). They present the system as "a novel middleware-based service architecture" (abstract).

## Background and terms

**Terms to know:** [query rewriting and rewrite rules](#/glossary/query-rewriting-and-rewrite-rules) · [query equivalence](#/glossary/query-equivalence) · [query optimizer](#/glossary/query-optimizer) · [query plan and EXPLAIN](#/glossary/query-plan-and-explain) · [logical plan](#/glossary/logical-plan) · [query hint](#/glossary/query-hint) · [abstract syntax tree (AST)](#/glossary/abstract-syntax-tree-ast) · [SQL dialect](#/glossary/sql-dialect) · [minimum description length (MDL)](#/glossary/minimum-description-length-mdl) · [hill climbing](#/glossary/hill-climbing) · [trigram index](#/glossary/index-database)

**The paper's own terms:**
- **Human-centered query rewriting**: letting developers be "in the driver's seat", using their data and domain knowledge to rewrite application queries before they reach the database (§1).
- **VarSQL** ("Variablized SQL"): the rule language; a rule is `Pattern / Constraints --> Replacement / Actions` (§4.2).
- **Element-variable** `<x>` and **set-variable** `<<x>>`: placeholders matching one table, column, value, expression, predicate or subquery, or a set of them (Tab. 2). Keywords, delimiters and whole clauses can't be variables (§4.2).
- **Covering**: a rule set covers a set of pairs if each original query is rewritten into its desired rewrite by at least one rule, and by no rule into anything else (Def. 5.1).
- **Description length**: a rule's score under the rule-quality metric; the suggestor minimizes the rule set's total (§5.1; function in §7.1).
- **Rule graph** (Fig. 11): rules linked by one-step generalizing transformations (§5.2).

**Builds on:**
- Rule languages it surveys (Tab. 1), among them the Starburst rewrite engine ([Starburst query rewrite](#/papers/pirahesh1992starburst "Extensible/Rule Based Query Rewrite Optimization in Starburst (1992)")), the optimizer framework Calcite (rules as Java classes), EDS (built for one extensible system, EDBMS) and the code-rewriting tool Comby; VarSQL takes its four-part rule shape and pre-implemented procedures from EDS and Comby (§4.1–4.2).
- WeTune ([WeTune](#/papers/wang2022wetune "WeTune: Automatic Discovery and Verification of Query Rewrite Rules (2022)")), which "generates new rewriting rules automatically by searching the logical-plan space" (§2); it is a workload, a user-study language and the end-to-end baseline (§7).
- Potter's Wheel, an interactive data-cleaning system (Raman and Hellerstein 2001), whose design principles the length function follows (§7.1).

## Problem and setting

- **Question:** "Given an application and a database as black boxes, develop a middleware solution for users to easily express their rules to rewrite application queries for a better performance" (§1, Problem Statement).
- **Black boxes:** neither the application's query generation (proprietary, or too old or complex) nor the database (no privileges, or side effects on other clients) can be changed (§1).
- **What counts as correct:** a rewrite computes the same answers (§1); users may write rules "that are valid for their particular database with certain properties", even if they "may not be valid for all databases" (§1). For user mistakes, the authors say "we can leverage existing query equivalence verifiers" to validate rules (§3).
- **SQL fragment, set or bag semantics:** not discussed; VarSQL "is independent of any specific database or SQL dialect" (§4.2).
- **Workloads (Tab. 3):** Calcite (232 pairs from Calcite's test suite), WeTune (245 pairs from 20 open-source applications), and three the authors built with the business-intelligence tools Tableau and Apache Superset: Tableau + TPC-H (20 pairs, 10 GB of the decision-support benchmark TPC-H, indexed by the Postgres auto-indexer Dexter), Tableau + Twitter and Superset + Twitter (30 million tweets, PostgreSQL and MySQL) (§7.1). For the built workloads the authors "came up with a rewritten query with a better performance" (§7.1).

## Approach

- **Architecture (§3, Fig. 4).** Offline, users write VarSQL rules or give example pairs to the Rule Suggestor; confirmed rules go to the Rule Base. Online, a customized connector (a slightly modified JDBC/ODBC client driver, or a RESTful web proxy) sends each query to the Query Rewriter and forwards the rewrite.
- **Why a new language (§2, §4.1, Tab. 1).** The Postgres and MySQL rewrite plugins can't express the authors' predicate-level examples: Postgres rules only replace a table with a table or subquery; MySQL patterns are whole statements (§2). SQL-specific rule languages can be tied to one system and need optimizer knowledge; imperative ones need code against engine internals (§4.1).
- **VarSQL (§4.2).** Pattern and replacement are full or partial SQL with variables. Matching compares the query's syntax tree with the pattern's node by node, then fills the replacement with the matched elements (Fig. 7). Constraints and actions call pre-implemented procedures, e.g. in a self-join removal rule `UNIQUE(t1, a1)` checks the schema for a unique column (Fig. 8).
- **Rule quality (§5.1).** Find a rule set that covers all pairs with minimal total description length (Def. 5.2). Listing the pairs overfits; Fig. 9's over-general rule r3, lacking the outer query's `COUNT` context, "can be erroneous in many cases".
- **Transformations (§5.2, Fig. 10).** Variablize-a-Leaf turns a table, column or value into a variable; Variablize-a-Subtree, an expression, predicate or subquery; Merge-Variables merges element-variables into one set-variable; Drop-a-Branch removes a branch common to pattern and replacement. The last three need the replaced variables to appear nowhere else in the rule. An example suggested rule turns `STRPOS(LOWER(<x>),'<y>')>0` (lowercased `<x>` contains `<y>`) into `<x> ILIKE '%<y>%'` (Fig. 9).
- **Search (§6.1, Alg. 1).** Greedy hill climbing: start with one rule per pair; repeatedly let the candidate that cuts total length most replace the rules it covers, until none cuts it. Candidates: all transformed rules (brute force), rules up to k transformations away (k-hop-neighbor exploration, KHN), or m-promising-neighbor exploration (MPN, Alg. 2: replace the most promising candidate by its one-step transformations until m are held). A rule is more promising when it is shorter and needs fewer transformations to cover longer base rules (§6.2).
- **Query cost (§6.3).** If query costs on the target database are known, a candidate's benefit becomes β times its normalized length reduction plus (1 − β) times its normalized cost reduction on a historical workload; β = 1 counts length only.
- **The length function used (§7.1):** a constant base length plus weighted variable counts divided by the count of non-variable elements.

## Results

- **User study (§7.2, Tab. 4–5).** 22 users familiar with SQL saw three pairs, each with three unnamed rules in regex, WeTune's rule language and VarSQL, and picked the one "easiest to understand". For every pair more than 80% picked VarSQL; the authors say it "outperformed the other two languages significantly". The Remarks say users preferred VarSQL "to formulate rewriting rules" (§7.7 "Remarks").
- **Search strategies (§7.3, Fig. 12).** On Tableau + Twitter, with KHN and MPN tuned to output the same rules as brute force, brute-force time "increased sub-exponentially" with more examples, KHN's "went up to 50 seconds for 5 input examples", while MPN's grew linearly.
- **Effect of m (§7.4, Fig. 13).** For the two most frequent patterns in 30 WeTune test pairs, each given one matching pair plus 4 manually generated examples: as m grew, output converged to the minimum-length rule set, taking "about 5 to 6 seconds"; precision on unseen pairs "was always 100%" and recall reached 100% once m was 50 or more.
- **End-to-end (§7.5, Fig. 14–15).** Original queries vs. rewrites by WeTune's or human rules, on Tableau + TPC-H and Tableau + Twitter (PostgreSQL) and Superset + Twitter (MySQL). TPC-H: human rules cut the time of 10 of 20 queries, WeTune's only Q2 and Q18; of the 10, 7 used rules reshaping the whole statement (e.g. join-to-exists) and 3 used hints (e.g. force-join-order). MySQL Tableau queries: the human rules mainly removed an unneeded `ADDDATE` computation. Superset: a `LIKE` substring filter rewritten into MySQL full-text search sped all 5 queries up "100+ times (e.g., 83s to 0.8s)".
- **Generality (§7.6, Fig. 16).** On 178 parseable Calcite pairs, more transformation categories let rules from one example rewrite more of the others while still matching their own, but precision fell through over-generalization, which the authors say motivated MDL.
- **β (§7.7, Fig. 17).** On Tableau + Twitter, lowering β from 1.0 to 0.75 made the suggested rules cut much more query cost, at the price of longer rules and suggestion time, which grew as β fell further.

## Limits the authors state

- "we do not seek to replace query optimizers inside databases" (§1).
- QueryBooster "assumes no access to the backend database to create indexes" (§3); the MDL metric assumes "no access to the target database" (§5.1).
- Some rewrites are "valid only for a particular dataset, and may not be correct in general" (§1); the Superset rewrite "was equivalent only for this particular dataset" (§7.5).
- Searching all rule sets for the optimum "can be computationally expensive", so the search is heuristic, and the choice of candidates "can affect how easily the algorithm is stuck at a local optimum" (§6, §6.1).

## Open problems and building blocks

- **Open:** None stated.
- **Released:** "The source code, data, and/or other artifacts have been made available" (PVLDB Artifact Availability box, title page).
- **To reuse it:** Python 3.9 with mo-sql-parsing (§7.1); a modified connector per database, or a proxy if the application's RESTful endpoint is configurable (§3); a description length function (§5.1 assumes "a rule-quality metric is given"); m set from the running time allowed and hardware (§6.2); query costs on the target database for the cost-aware score (§6.3).

## On this site

- **Discussed in:** [Refuting faulty rewrite rules](#/challenges/faulty_rewrite_rules) · [Discovering new rewrite rules](#/challenges/rewrite_rule_discovery) · [Equivalence under schema constraints](#/challenges/schema_constrained_equivalence)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/rewrite-classic">rewrite-classic</a><a class="tag sub" href="#/tags/rules-discover">rules-discover</a><a class="tag sub" href="#/tags/rules-lib">rules-lib</a></span>
