# Graphiti: Bridging Graph and Relational Database Queries

**Graphiti** · PACMPL 9(PLDI) 2025 (PLDI 2025)

Read: [PDF](https://arxiv.org/pdf/2504.03182) · [arXiv](https://arxiv.org/abs/2504.03182) · [DOI](https://doi.org/10.1145/3729319)

<p class="notice">A summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Checks whether a Cypher (graph database) query and a SQL query are equivalent modulo a user-written database transformer, rules that say which relational database holds the same data as a given graph (abstract; §4, Defs. 4.3–4.6).
- Derives an induced relational schema with a table per node and edge type, transpiles a Cypher subset ("Featherweight Cypher", Fig. 9) into SQL over it by syntax-directed rules the authors prove sound and complete (Thms. 5.7–5.8), then computes a residual transformer by substitution (Alg. 2) and hands the SQL pair to an existing SQL checker: the bounded checker VeriEQL, which can refute, or the deductive verifier Mediator, which can prove on its aggregation- and outer-join-free fragment (§5.3, §6).
- A checker for ports between a graph DSL and SQL that measured LLM ports: with the VeriEQL backend it reports counterexamples for 27 of 205 GPT-transpiled SQL→Cypher queries (§6.1, Tab. 2), and shows how a cross-language check can reuse a single-language checker through a proved translation; with the bounded backend it "does not provide theoretical soundness guarantees" (§6.1), and each pair needs a hand-written transformer (§6).

## In plain words

Developers who move an application between a graph database and a relational one often have to rewrite its queries between SQL and Cypher, which the authors call the most popular graph query language. They say such translation "can be quite challenging", and that they found queries in the literature claimed to be equivalent that are not (§1). They define when a Cypher query and a SQL query are equivalent, given rules written by the user that say which relational database holds the same data as a given graph. Graphiti checks this by translating the Cypher query into SQL with rules they prove correct, and then handing the two SQL queries to an existing SQL checker (abstract; §1). With a checker that searches small databases, which can miss errors, it finds differences in 34 of 410 query pairs, 27 of them among 205 translations made by GPT (§6.1). With a prover, it proves 152 of the 196 pairs that prover supports (§6.2). The authors present it as "the first technique for reasoning about equivalence between graph and relational queries" (§1).

## Background and terms

**Terms to know:** [query equivalence](#/glossary/query-equivalence) · [bounded verification](#/glossary/bounded-verification) · [soundness and completeness](#/glossary/soundness-and-completeness) · [syntax-directed translation](#/glossary/syntax-directed-translation) · [counterexample database](#/glossary/counterexample-database) · [bag semantics](#/glossary/bag-semantics) · [integrity constraint](#/glossary/integrity-constraint) · [outer join](#/glossary/outer-join) · [property graph](#/glossary/property-graph) (§3.1, Defs. 3.1–3.3) · [schema mapping](#/glossary/schema-mapping) (which the transformer DSL generalizes, §4.1)

**The paper's own terms:**
- **Cypher**: the query language of graph databases such as Neo4j; a query matches patterns of nodes and edges and returns a table (§3.2; App. A).
- **Featherweight Cypher** and **Featherweight SQL**: the subsets the paper formalizes (Figs. 9–10). The Cypher subset has `MATCH`, `OPTIONAL MATCH`, `WITH` (passes intermediate results to the next clause), `RETURN` with aggregates, unions, ordering and `EXISTS`; it leaves out Cypher features "such as unbounded-length path queries and graph reachability primitives (e.g., shortestPath)" (§3.2).
- **Database transformer**: rules, each saying that if some facts hold in one database a given fact holds in the other; they define when a graph and a relational database hold the same data (§4.1, Fig. 11; Def. 4.3).
- **Equivalence modulo a transformer**: the two queries return equivalent tables on every database pair the transformer relates (Def. 4.5). **Table equivalence** ignores column names and order but keeps how often each row occurs; with `ORDER BY`, row order counts too ([list semantics](#/glossary/list-semantics)) (Def. 4.4 and its footnote).
- **Induced relational schema**: one table per node type and per edge type; an edge table gets foreign keys SRC and TGT to its source and target nodes' tables (§2; §5.1, Fig. 13).
- **Standard database transformer (SDT)**: copies each node and edge into its row of the induced schema (§5.1).
- **Residual database transformer (RDT)**: from the induced schema to the user's schema, obtained from the user's transformer by substitution (§5.3, Alg. 2).

**Missing glossary terms:** none.

**Builds on:**
- Its SQL backends: VeriEQL (He et al. 2024, [VeriEQL](#/papers/he2024verieql "VeriEQL: Bounded Equivalence Verification for Complex SQL Queries with Integrity Constraints (2024)")), a bounded checker that can refute, and Mediator (Wang et al. 2018, [Mediator](#/papers/wang2017mediator "Verifying Equivalence of Database-Driven Applications (2017)")), a deductive verifier (it proves equivalence for databases of any size) for database applications over different schemas (§1; §6).
- Schema mappings (Clio: Fagin et al. 2009; Miller et al. 2000) and Dynamite (Wang et al. 2020), which migrates data between graph and relational databases but "cannot be used for transpiling queries" (§1; §4.1; §7).
- The Cypher semantics of Francis et al. (2018) (App. A).
- Its transpiler is compared with OpenCypherTranspiler (Liang 2025, cited as its GitHub repository), a Cypher-to-SQL translator (§7; App. E).

## Problem and setting

- **Question:** given a Cypher query over a graph schema, a SQL query over a relational schema and a database transformer between them, decide whether the two are equivalent modulo the transformer (Def. 4.6).
- **Data model:** each node and edge type has a unique label and a default property key with unique values, which becomes its table's primary key; property keys are unique within a schema (§3.1; §5.1).
- **Relational side:** constraints are primary keys, foreign keys and NOT NULL (§3.3). Featherweight SQL has joins (outer joins too), unions, `GROUP BY`, `WITH` (named subqueries), `ORDER BY` and `IN` subqueries; its semantics are "standard and formally defined by prior work such as" VeriEQL (§3.3, Fig. 10).
- **NULLs:** predicates use three-valued logic, "Similar to SQL" ([NULL and three-valued logic](#/glossary/null-and-three-valued-logic)); optional matches fill missing parts with NULL (App. A).
- **Benchmarks:** 410 SQL–Cypher pairs: 45 from StackOverflow posts, tutorials (including the official Neo4j guide) and papers; 60 from VeriEQL's datasets, translated by people "with at least 3 months of Cypher experience"; 100 from Mediator's evaluation set; and 205 made by having GPT translate the SQL of the other categories (§6 "Benchmarks"; Tab. 1). Which GPT model was used is not stated.
- **Transformers:** "one of the authors constructed a database transformer for each query pair"; they average 5.9 rules, each transformer taking "approximately one minute to write" (§6 "Database transformers"; Tab. 1).

## Approach

Algorithm 1 has three steps (§5):
- **Inference (§5.1, Fig. 13):** build the induced schema, its keys and the SDT from the graph schema.
- **Transpilation (§5.2, Figs. 16–18; App. B, Figs. 21–22):** rules along Cypher's grammar turn `MATCH` into inner joins, `OPTIONAL MATCH` into left outer joins, a node shared by two patterns into a join on its primary key, `RETURN` with aggregates into a `GROUP BY`, and `EXISTS` into an `IN` subquery.
  - Thm. 5.7: if the rules translate a Cypher query into a SQL query over the induced schema, the two are equivalent modulo the standard transformer.
  - Thm. 5.8: every query of the Featherweight Cypher grammar (Fig. 9) has such a translation. Proofs: App. F.
- **Reduction (§5.3, Alg. 2):** an existing SQL checker compares the transpiled query with the user's SQL query modulo the RDT.
  - Thm. 5.9: if the SQL checker is sound, a pair Graphiti reports equivalent is equivalent modulo the user's transformer.
  - Thm. 5.10: if the SQL checker is complete, every pair equivalent modulo the user's transformer is reported equivalent.
- **Why reduce:** a direct check would need [SMT](#/glossary/sat-and-smt-solvers) encodings of both graphs and relations, which the authors say makes solving harder; the reduction reuses existing SQL tools (§5 "Discussion").
- **Counterexamples:** when VeriEQL refutes, Graphiti turns its relational counterexample into one over the graph schema (§6.1; App. D, Fig. 23).

## Results

- **Bounded checking with VeriEQL (§6.1, Tab. 2):** raising the bound until a counterexample or a 10-minute limit, it refutes 34 of 410 pairs: 27 of the 205 GPT translations ("13% of the queries transpiled by GPT"), 3 of the 45 from the wild and 4 of the VeriEQL set. The authors inspected all 34 by hand and report all as true positives; one is in a Neo4j tutorial for SQL users (App. D).
- **Missed bugs (§6.1 "False negatives"):** of 50 sampled unrefuted pairs, 2 (both GPT translations) were wrong, which the authors read as "a low chance of missing incorrect translations (4% according to our manual inspection results)".
- **Proving with Mediator (§6.2, Tab. 3):** 196 of 410 pairs fall in Mediator's fragment (SQL without aggregations or outer joins), and Graphiti proves 152 of them (77.6%). Of the 44 others, 2 are refuted by the VeriEQL run, 14 time out and 28 end "Unknown"; the authors explain failures by Mediator's need for a [bisimulation](#/glossary/bisimulation) invariant (a relation between the two databases that it must find), which "can be complex" for long join chains.
- **Transpilation (§6.3, Tab. 4):** all 410 Cypher queries transpile, in milliseconds. On the 45 pairs from the wild, run on generated mock databases, the transpiled SQL is faster than the hand-written SQL on 33.3% and within a 1.2× slowdown on 51.1%.
- **Against OpenCypherTranspiler (App. E, Tab. 5):** 284 of the 410 queries fall outside its fragment; of the other 126, it turns 2 into syntactically invalid SQL and 2 into wrong SQL (by manual inspection).

## Limits the authors state

- "The current version of Graphiti is focused on a specific subset of SQL and Cypher, which does not yet cover all modern features, such as variable-length pattern matching in Cypher" (§8); the excluded path and reachability features are "not expressible in the core SQL fragment considered in this paper" (§3.2).
- With the VeriEQL backend, unrefuted pairs "may still contain bugs", and Graphiti "does not provide theoretical soundness guarantees" (§6.1).
- Mediator "supports a limited subset of SQL without aggregations or outer joins" and "cannot disprove equivalence", so Graphiti with it proves or returns "Unknown" (§6.2).
- The transpilation "does not guarantee that the transpilation result is the most efficient", and the rules "do not address the reverse direction" (§2 "Checking equivalence").
- The execution-time study covers only the categories with given ground-truth queries, and uses mock databases because the authors "do not have database instances that these queries are meant to be executed on" (§6.3).

## Open problems and building blocks

- **Open:** "Future work can further extend the transpilation rules and backend equivalence verifiers to support additional features" (§8). The authors plan "a graphical interface for specifying database transformers", to reduce the manual effort of writing them (§9).
- **Released:** Nothing stated.
- **To reuse it:** a user-written transformer per pair (§6 "Database transformers"); a SQL checker as backend, whose soundness or completeness Thms. 5.9–5.10 assume; queries inside Featherweight Cypher and SQL (Figs. 9–10). The experiments ran on a laptop (Intel Core i7-8750H, 32 GB), 10 minutes per pair (§6).
- **Beyond its domain:** "we believe our proposed methodology can be adapted fairly easily to graph database query languages other than Cypher" (§7 "Graph database query languages"). The authors also frame the approach as verifying data representation refactoring (rewriting programs or specifications from one data representation to another) through an auxiliary representation (§7 "Data representation refactoring").

## On this site

- **Discussed in:** [Distinguishing documents for two programs in any DSL](#/challenges/dsl_counterexamples) · [Porting programs between DSLs and dialects without changing their meaning](#/challenges/dsl_porting) · [Query equivalence: prove or refute](#/challenges/query_equivalence) · [SQL features that verifiers don't cover](#/challenges/verifier_coverage_gaps)
- **Tags:** <span class="tags"><a class="tag" href="#/tags/dsl">dsl</a><a class="tag sub" href="#/tags/bounded-misc">bounded-misc</a><a class="tag sub" href="#/tags/cex-general">cex-general</a><a class="tag sub" href="#/tags/cex-llm">cex-llm</a><a class="tag sub" href="#/tags/dialect-translate">dialect-translate</a><a class="tag sub" href="#/tags/prove-general">prove-general</a></span>
