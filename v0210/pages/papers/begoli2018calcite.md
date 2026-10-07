# Apache Calcite: A Foundational Framework for Optimized Query Processing Over Heterogeneous Data Sources

**Apache Calcite** · SIGMOD 2018

Read: [PDF](https://arxiv.org/pdf/1802.10233) · [arXiv](https://arxiv.org/abs/1802.10233) · [DOI](https://doi.org/10.1145/3183713.3190662)  
Code: [calcite](https://github.com/apache/calcite)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- A framework with parsing, relational algebra, many optimization rules and a Volcano-style planner.
- Adapter architecture for heterogeneous data sources.
- Source of the Calcite rewrite-test benchmark and of LearnedRewrite's and LLM-R2's rules; the Calcite team confirmed two rule bugs behind pairs VeriEQL refuted ([VeriEQL](#/papers/he2024verieql "VeriEQL: Bounded Equivalence Verification for Complex SQL Queries with Integrity Constraints (2024)") §6.3).

## In plain words

Organizations now run many specialized data systems, such as stream processors and text search engines. The authors name two problems: without a shared framework, each system's developers rebuild similar optimization and query-language support, and programmers often have to combine several systems and need queries optimized across them (§1). Apache Calcite is their answer: an open-source Java framework that parses SQL, turns a query into a tree of standard table operations, and rewrites that tree with hundreds of rules guided by cost estimates, while leaving the storage of data to other engines (abstract, §1, §3, §6). Plug-in adapters connect it to outside data sources, so that one query can be planned across several of them (§5). The paper describes this design, its extensions for streaming, semi-structured and geospatial data, and its users (§1). The authors say Calcite "is currently the most widely adopted optimizer for big-data analytics in the Hadoop ecosystem" (Hadoop: an open-source platform for large-scale data processing) (§2), and write that "many of the ideas that lie behind it are not novel" (§2).

## Background and terms

**Terms to know:** [relational algebra](#/glossary/relational-algebra) · [query optimizer](#/glossary/query-optimizer) · [cost-based optimization](#/glossary/cost-based-optimization) · [query rewriting and rewrite rules](#/glossary/query-rewriting-and-rewrite-rules) · [logical plan](#/glossary/logical-plan) · [cardinality estimation](#/glossary/cardinality-estimation) · [SQL dialect](#/glossary/sql-dialect) · [window function](#/glossary/window-function) · [materialized view](#/glossary/materialized-view) · [federated query processing](#/glossary/federated-query-processing)

**The paper's own terms:**
- **trait**: a physical property of an operator, such as ordering or partitioning. Calcite has no separate logical and physical operators; "Changing a trait value does not change the logical expression being evaluated" (§4).
- **calling convention**: the trait naming the system where an expression will run (*jdbc-mysql*, *splunk*, *spark*); the *logical* convention means no implementation is chosen yet (§4, Fig. 2). The *enumerable* convention is Calcite's own operators, which work through an iterator and implement operators that may not be available in a backend (§5).
- **converter**, two senses: (1) an interface operators can implement that says how to convert an expression's traits from one value to another (§4); (2) the adapter component that translates algebra pushed to a backend into that backend's query language (§8.2).
- **adapter**: how Calcite reads an outside data source: a *model* (the source's physical properties), a *schema* (its data's definition) and a *schema factory* that builds the schema, plus optional planner rules (§5, Fig. 3).
- **metadata providers**: pluggable functions that supply the optimizer with information; the default ones return a subexpression's cost, row count, data size and maximum parallelism (§6).
- **planner engine**: the part that fires rules until it reaches an objective; Calcite has a *cost-based* and an *exhaustive* one (§6). **Multi-stage optimization** applies different rule sets in consecutive phases (§6).

**Builds on:**
- Volcano ([The Volcano Optimizer Generator](#/papers/graefe1993volcano "The Volcano optimizer generator: extensibility and efficient search (1993)")) and Cascades ([The Cascades Framework for Query Optimization](#/papers/graefe1995cascades "The Cascades Framework for Query Optimization (1995)")): the optimizer "builds on ideas from" them (§2); the cost-based planner uses "a dynamic programming algorithm, similar to Volcano" (§6).
- Materialized-view rewriting by view substitution, which replaces part of a query's tree with an equivalent expression over a view (Chaudhuri et al. 1995; Goldstein and Larson 2001), and by lattices (Harinarayan et al. 1996, on data cubes: summaries precomputed for many combinations of grouping columns) (§2, §6); not listed here.
- Orca, a modular optimizer used in data products such as Greenplum and HAWQ: "extensions for multi-stage optimizations as in Orca" (§2); not listed here.
- The Continuous Query Language for streams (Arasu et al.), which inspired the streaming extensions (§7.2), and Microsoft's LINQ, which writes queries in the host programming language and which LINQ4J follows for Java (§7.4).

## Problem and setting

- **The question:** how to give specialized data systems shared optimization and query-language support, and optimize queries "across heterogeneous data sources" (§1).
- **Languages:** "ANSI standard SQL, as well as various SQL dialects and extensions", with a JDBC driver (the standard Java database interface) (§1); systems with their own languages can hand Calcite operator trees (§3).
- **Data models:** relational at the core (§4); semi-structured data is handled "by representing them in the relational data model during query planning" (§2).
- **What counts as correct:** a rule "executes a transformation that preserves semantics of that expression", and the planner seeks "an alternative expression that has the same semantics as the original but a lower cost" (§6).
- **What it leaves out:** for example storage, algorithms to process data, and a metadata repository; "These omissions are deliberate" (§3).
- **Set or bag semantics, and NULL handling in rules:** not discussed.

## Approach

- **Ways in (§3, Fig. 1).** A parser and validator turn SQL into an operator tree. For systems with SQL but without or with limited optimization, Calcite can translate the optimized tree back to SQL. Systems with their own parser can build trees with the *relational expressions builder*, shown on a script in Apache Pig, a dataflow language.
- **Cross-engine planning (§4, Fig. 2).** A Products table in MySQL is joined to Orders in Splunk (a log search platform). The join starts in the logical convention and a rule pushes the filter into Splunk. The join could run in Spark (a cluster data processing engine); the paper names as more efficient a rule pushing the join into Splunk, which can look up MySQL rows via ODBC (a standard database-connection interface).
- **Adapters (§5, Fig. 3).** A table scan is "the minimal interface that an adapter must implement"; with it, Calcite can run arbitrary SQL on the tables with client-side operators such as sorting, filtering and joins. Across backends Calcite pushes "all possible logic to each backend" and then joins and aggregates the results.
- **Rules (§6).** "Calcite includes several hundred optimization rules", and systems often add their own. Cassandra (a wide column store) sorts rows only within a partition, so a rule pushing a sort into it must check that the table was filtered to one partition and that the partition's sort order shares a prefix with the required sort. `FilterIntoJoinRule` moves a filter on one table below the join (Fig. 4).
- **Metadata (§6).** Providers are pluggable, compiled at run time with Janino (a small Java compiler), and cache results.
- **Planner engines (§6).** The cost-based engine gives each expression a digest (a key built from its attributes and inputs); a rule's output joins its input's set of equivalent expressions, and two sets merge when a "similar digest" is found. It runs to a configurable fix point: until all rules have been applied on all expressions, or, heuristically, until the plan cost has not improved by more than a threshold in the last iterations. The default cost combines CPU, IO and memory estimates. The exhaustive planner fires rules until nothing changes, ignoring cost.
- **Materialized views (§6).** View substitution can produce partial rewrites with extra operators such as residual filters; lattices are "especially efficient in matching expressions over data sources organized in a star schema" (a fact table joined to dimension tables).
- **Extensions (§7).** Nestable `ARRAY`, `MAP` and `MULTISET` (a bag that allows duplicates) columns; collections in MongoDB (a document store) appear as tables with one map column `_MAP` (§7.1). Streaming: a `STREAM` keyword for incoming records, tumbling (fixed, non-overlapping), hopping (fixed, overlapping), sliding (ending at each row) and session (bounded by gaps in activity) windows, and stream joins on a time window whose expression the planner checks is monotonic, that is, steadily increasing or decreasing along the stream (§7.2). A `GEOMETRY` type being implemented (§7.3) and LINQ4J (§7.4).

## Results

- **Stated advantages (§1):** open source, multiple data models, a pluggable optimizer, cross-system support, SQL with extensions, and reliability: "Calcite is reliable, as its wide adoption over many years has led to exhaustive testing of the platform", with "an extensive test suite".
- **Adoption (§8):** Tab. 1 lists 12 systems that embed Calcite and which parts each uses, among them the Hive data warehouse and the stream processors Flink and Storm; Tab. 2 lists 8 adapters and the language generated for each, such as the Cassandra Query Language for Cassandra and SQL dialects for JDBC sources.
- **Against related systems (§2):** unlike Orca, Calcite "can be used as a standalone query execution engine that federates multiple storage and processing backends"; Spark SQL's Catalyst optimizer "lacks the dynamic programming approach used by Calcite and risks falling into local minima", and Garlic, a heterogeneous data management system, leaves each system to optimize its own queries.
- **Planners and caching (§6):** two planners let users "reduce the overall optimization time by guiding the search for different query plans"; the metadata cache "yields significant performance improvements".
- **Conclusion (§10):** the authors name Calcite's design as a factor in its "becoming the most widely adopted query optimizer, used in a large number of open-source frameworks".

## Limits the authors state

- The performance testing module "does not evaluate query execution"; "it might be difficult to craft fair comparisons", and a timed comparison with Algebricks (a query compiler framework) "does not seem feasible, as one would need to ensure that each uses the same execution engine" (§9.1).
- Evaluating Calcite as a common layer "is limited by the availability of existing heterogeneous benchmarks" (§9.1).
- "Geospatial support is preliminary in Calcite" (§7.3).
- Lattices are "more restrictive than view substitution, as it imposes restrictions on the underlying schema" (§6).

## Open problems and building blocks

- **Open (§9):** further support for standalone use, which "would require a support for data definition languages (DDL), materialized views, indexes and constraints"; a more modular planner taking user planner programs; new parametric approaches in the optimizer; more SQL commands and functions, with full OpenGIS compliance (a geospatial SQL standard); adapters for non-relational sources such as array databases; better profiling; assessing the performance of systems built with Calcite, where the authors believe integrated multiple systems "should be superior to the sum of their parts" (§9.1); adapters for array and textual sources and "efficient joining of heterogeneous data sources" (§8.3).
- **Released:** Calcite, "an open-source framework, backed by the Apache Software Foundation (ASF)" (§1).
- **To reuse it:** Java (§1); an adapter needs at least a table scan (§5); a system can often supply only statistics (§6); streaming window aggregates need monotonic or quasi-monotonic (nearly ordered) grouping or ordering expressions (§7.2).

## On this site

- **Discussed in:** [Refuting faulty rewrite rules](#/challenges/faulty_rewrite_rules)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/pairgen-apply">pairgen-apply</a><a class="tag sub" href="#/tags/qo-rules">qo-rules</a><a class="tag sub" href="#/tags/rewrite-classic">rewrite-classic</a><a class="tag sub" href="#/tags/rules-lib">rules-lib</a></span>
