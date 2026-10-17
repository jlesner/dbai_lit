# Spider4SSC \& S2CLite: A text-to-multi-query-language dataset using lightweight ontology-agnostic SPARQL to Cypher parser

**Spider4SSC & S2CLite** · preprint 2025

Read: [PDF](https://arxiv.org/pdf/2511.09354) · [arXiv](https://arxiv.org/abs/2511.09354)  
Code: [S2CLite](https://github.com/vejvarm/S2CLite)

<p class="notice">A summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- S2CLite, a purely rule-based SPARQL-to-Cypher translator that needs neither the RDF graph nor external tools, compared with S2CTrans on BSBM42 and Spider4SPARQL; and Spider4SSC, a dataset pairing natural-language questions with SQL, SPARQL and Cypher queries over Spider's databases (abstract; §2).
- The SPARQL query's parse tree (from sparkle-g, a SPARQL 1.1 grammar compiled with ANTLR 4, App. B) is walked by a Visitor that sorts triple patterns into Cypher node labels, properties and relationships in two passes, and an Interpreter prints the Cypher clauses (§4, Tab. 2, Algs. 1–2); dataset entries are kept only when all three queries return the same results on their databases (App. A).
- A non-LLM baseline for porting between two graph-query DSLs, and a three-language parallel corpus: it reports 4525 unique (question, sql, sparql, cypher) entries (§2.2), whose equivalence rests on execution agreement, not a proof (App. A); the authors warn that S2CLite's output is not guaranteed equivalent and that dataset creation with it needs further checks "such as execution accuracy" (§8).

## In plain words

Knowledge graphs are often stored as RDF, where every fact is a (subject, predicate, object) triple queried with SPARQL, or as property graphs, where nodes and edges carry named properties, queried with Cypher in the Neo4j database (§1). The authors say existing SPARQL-to-Cypher translators rely on external tools and give "insufficient support for common SPARQL query types" (§1); the translator S2CTrans also needs the RDF data itself and lacks, e.g., grouping (§3.1.2). They build S2CLite, a translator made of hand-written rules, "inspired by traditional programming language compilers", that needs only the query text (abstract). Against S2CTrans, which they call "the state-of-the-art" (abstract), they report on the Spider4SPARQL benchmark (Spider's text-to-SQL databases and queries converted to RDF and SPARQL) a total parsing accuracy of 77.8% against 44.2%, counting a query only when its translation returns the original's results. They report 96.6% execution accuracy (share of translations returning the original's results) on the queries both tools translate, "outperforming S2CTrans by 7.3%" (abstract). With S2CLite they build Spider4SSC, a dataset pairing questions with SQL, SPARQL and Cypher queries that return the same results (§2.2; App. A). They present S2CLite as "a lightweight alternative to existing S2C parsers" (S2C: SPARQL to Cypher) (§6).

## Background and terms

**Terms to know:** [abstract syntax tree (AST)](#/glossary/abstract-syntax-tree-ast) (the paper's sense below) · [context-free grammar](#/glossary/context-free-grammar) · [execution accuracy](#/glossary/execution-accuracy) (the paper's sense below) · [text-to-SQL](#/glossary/text-to-sql) · [subquery (nested query)](#/glossary/subquery-nested-query) · [knowledge graph](#/glossary/knowledge-graph) (and its RDF model, §1; SPARQL, standard [SPARQL 1.1 Query Language](#/papers/harris2013sparql "SPARQL 1.1 Query Language (2013)"), cited as its website in App. B) · [property graph](#/glossary/property-graph) (zero or more labels and named properties per object, §1, §4.1)

**The paper's own terms:**
- **Ontology-agnostic**: not needing the graph's "ontology of node properties and relationships", which S2CTrans loads from the RDF data (§3.1.2).
- **Parse tree (Tₛ)**: the query's tree under the SPARQL 1.1 grammar: inner nodes are constructs (clause, pattern, function), leaves are symbols such as keywords, literals and variables (App. B). Built by **sparkle-g**, a SPARQL 1.1 grammar compiled into a Python parser with ANTLR 4 (a parser generator) (App. B).
- **Visitor**: walks the parse tree, maps SPARQL patterns to Cypher ones (e.g. SELECT to RETURN, WHERE to MATCH) and fills the AST (§4, §4.2).
- **AST (𝒢)**: here a Python dictionary of Cypher building blocks, such as nodes and their labels, properties, relationships, aggregates and the contents of each clause (§4.2, App. D.1, Listing 6).
- **Interpreter**: builder classes that each print one part of the Cypher query from 𝒢 (one clause, or ORDER BY, LIMIT and SKIP together), joined in a fixed order (§4.3, Tab. 3, Listing 2).
- **Triple pattern types** (§4.2.1, Tab. 2): 1) class label (a triple with rdf:type or a, naming the entity's class), mapped to a node label; 2) value constraint (a literal object), a property value; 3) variable property, a node property; 4) variable relationship, an edge.
- **Explicit relationship types (Rₑ)**: an optional list of predicates always treated as relationships (Fig. 1; App. C).
- **Parsing error rate**: the share of queries for which no Cypher query is produced (§5).
- **Execution accuracy (α)**: here the share of translated queries whose Cypher results on Neo4j match the SPARQL query's results on RDFlib (a Python RDF library) (§5): α∀ over all queries a tool translated, α∩ over those both tools translated (§5.2.2).
- **Total parsing accuracy (τ)**: matching queries over all queries (Tab. 8 caption; §5.2.2 "Discussion").

**Missing glossary terms:** none.

**Builds on:**
- **S2CTrans** (Zhao et al., 2023), the baseline: a pipeline built on tools including Apache Jena ARQ (which the S2C transpiler uses to build a syntax tree, §3.1.1) and Neosemantics (Barrasa and Cowley, 2021), which converts RDF graphs into property graphs (§1); it needs the RDF data file and lacks support for, e.g., GROUP BY and SELECT * (§3.1.2). Not on this site.
- **S2C transpiler** (A Agrawal et al., 2022): supports only basic graph patterns (plain sets of triple patterns), so it is left out of the experiments (§3.1.1). Not on this site.
- **Spider4SPARQL** (Kosten et al., 2023): a large portion of Spider's databases converted into RDF graphs, with SPARQL queries derived from the SQL (§3.2.2). Not on this site.
- **Spider** (Yu et al., 2018), [Spider](#/papers/yu2018spider "Spider: A Large-Scale Human-Labeled Dataset for Complex and Cross-Domain Semantic Parsing and Text-to-SQL Task (2018)"): a text-to-SQL dataset over SQLite databases, the source of Spider4SSC's SQL (§2.2, §3.2.2).

## Problem and setting

- **Question:** can a translator reading only the SPARQL text produce Cypher queries with the same results, for more query types than S2CTrans (§1, §3.1.2)?
- **Benchmarks:** BSBM42, 42 queries written by Zhao et al. (2023) to test S2CTrans, over the graph of the Berlin SPARQL Benchmark, made to evaluate RDF storage systems (§3.2.1); Spider4SPARQL's dev and train splits, 1032 and 6899 queries (Tab. 5).
- **What "correct" means:** the Cypher query's results on Neo4j match the SPARQL query's on RDFlib (§5), on graphs loaded into Neo4j with Neosemantics and assumed "correctly mapped to each other" (App. H.1). Row counts must agree, then values row by row (App. H.1), with floats equal within 1e-6, 0 and null treated as equal, rows sorted first, nodes compared by URI and variable names ignored (App. H.2, H.4). SPARQL queries with syntax errors on their RDF database are left out (App. H.4).
- **Spider4SSC's equivalence:** the dataset combines S2CLite's translations of Spider4SPARQL, Spider's SQL and 159 SQLite/RDF database pairs (some graphs repaired, some dropped); an entry is kept only if its SQL (sqlite3, Python's SQLite module), SPARQL (rdflib) and Cypher (Neo4j with Neosemantics) "return matching results when executed over their respective database" (App. A).

## Approach

- **Pipeline** (§4, Fig. 1; worked example Fig. 2): parse tree, Visitor, 𝒢, Interpreter, after "traditional programming language compilers" (§4).
- **Clause mapping** (§4.1, Tab. 1): e.g. FILTER to WHERE, HAVING to WITH (Cypher's clause for projecting and grouping mid-query) plus WHERE, OFFSET to SKIP; Cypher groups implicitly by the keys in RETURN or WITH (§4.2.4).
- **Two passes over WHERE** (§4.2.1, Algs. 1–2): the first marks each variable with a class label as a node; the second makes a triple a relationship when both ends are nodes, a property constraint when the object is not a variable, and a variable property otherwise. So a triple linking to a variable with no class label becomes a property, unless its predicate is in Rₑ (App. C).
- **Constraints** (§4.2.2, Alg. 3, Eqs. 1–2): a FILTER becomes a WHERE before any WITH; a HAVING expression is aliased in WITH and constrained by a WHERE after it.
- **Interpreter** (§4.3, Listing 2; App. F): MATCH comes first, then WHERE, WITH and the rest; the WHERE builder reports nested SELECT statements as "not supported yet" (App. F.3, Listing 9).

## Results

- **BSBM42** (§5.1; Tabs. 5, 8): both tools translate every query; S2CTrans has no execution errors, S2CLite returns wrong values on the OptionalRelationship query, placing OPTIONAL MATCH (which keeps rows when the optional pattern has no match) before WHERE where S2CTrans places it after (App. G.1.1).
- **Parsing errors on Spider4SPARQL** (§5.2.1, Tab. 5): error rate 11.6% (dev) and 12.7% (train) for S2CLite against 51.6% and 43.9% for S2CTrans. S2CTrans "is largely limited by not supporting the COUNT(*) projection aggregation"; both show many errors on nested SELECT clauses, and "comparable error counts" on constraint expressions such as NOT EXISTS and IN, "indicating the lack of their support" (§5.2.1).
- **Execution accuracy, all translated queries** (§5.2.2, Tab. 8, Fig. 4): 96.1% (dev) and 93.9% (train) for S2CLite against 90.0% and 86.7% for S2CTrans. S2CLite has more N4j_EXEC errors (Neo4j fails to run the query, Tab. 6), which the authors take to suggest that it "generates false positives (syntactically invalid Cypher queries) in the parsing stage" (§5.2.2).
- **Execution accuracy, queries both translate** (§5.2.2, Tab. 9, Fig. 5): 94.1% (dev) and 94.5% (train) for S2CLite against 90.3% and 86.8% for S2CTrans; the authors conclude that on this subset S2CLite produces more semantically accurate queries (§5.2.2).
- **Total parsing accuracy** (§5.2.2 "Discussion"): 77.8% against 44.2%, from "4779 out of the total of 6144 given SPARQL queries" for S2CLite.

## Limits the authors state

- **Explicit relationships** (§7): S2CLite "is limited in the ability of differentiating between property and relationship patterns between variable nodes"; Rₑ alleviates this, but "an alternative approach may be desirable, if a file or ontology of the knowledge graph is available at hand".
- **Nested queries** (§7): "ca. 8% of the Spider4SPARQL dataset queries are not supported due to the existence of nested queries"; the authors aim to support simple nested queries.
- **False positives** (§7): comparing Tabs. 8 and 9, the authors suggest that many queries that are translated but don't execute lie outside the subset both tools translate; this "calls for better definition of explicit constraints and boundaries on the queries that S2CLite supports".
- **MATCH after WHERE** (§7): S2CLite "always positions all MATCH patterns at the beginning of the query"; the OptionalRelationship failure "may stem from a known limitation of S2CLite and needs to be addressed further".
- **Limited dataset testing** (§7): S2CLite needs "further tests on different Text-to-SPARQL datasets".
- **Unique queries** (§7): the counts include duplicate queries, since Spider4SPARQL, like Spider, may pair one query with several paraphrased questions.
- **Reduced dataset size** (§7, Tab. 10): Spider4SSC "is currently limited to 4525 unique entries" because only entries returning exactly the same results are kept; the rejected ones have "diverse causes", e.g. no result from one language, different values or row counts, extra output fields.
- **Potential risks** (§8): S2CLite "was generally aimed to accommodate the available query types in BSBM, Spider and Spider4SPARQL"; "It is not guaranteed that any arbitrary SPARQL query will be parsed into semantically equivalent Cypher query", so dataset creation with it calls for "further evaluation of the query equivalence such as execution accuracy".

## Open problems and building blocks

  - "concrete error messages, when unsupported queries are encountered" in future versions (§7 "False positives").
  - Using "general LLMs to attempt at fixing mistakes in the queries" to grow Spider4SSC (§7 "Reduced Spider4SSC dataset size").
  - "A full technical report detailing the process of creating Spider4SSC will be published at a later time on arXiv" (App. A).
- **Released:** S2CLite, open-sourced on GitHub, and "the clean Spider4SSC dataset for download" (abstract; App. A).
- **To reuse it:** S2CLite needs "neither a specific database file nor a connection to any data store system" (§1); it is Python on an ANTLR 4 parser (§4.2, App. B) and takes SPARQL 1.1 and an optional Rₑ list (Fig. 1).

## On this site

- **Discussed in:** [Porting programs between DSLs and dialects without changing their meaning](#/challenges/dsl_porting)
- **Tags:** <span class="tags"><a class="tag" href="#/tags/dsl">dsl</a><a class="tag sub" href="#/tags/dialect-difftest">dialect-difftest</a><a class="tag sub" href="#/tags/dialect-pairs">dialect-pairs</a><a class="tag sub" href="#/tags/dialect-translate">dialect-translate</a><a class="tag sub" href="#/tags/general-misc">general-misc</a></span>
