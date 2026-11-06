# CypherLens: An Interactive Demo for Evaluating and Diagnosing NL-to-Cypher Systems

**CypherLens** · PVLDB 19(12) 2026, demo paper

Read: [PDF](https://www.vldb.org/pvldb/vol19/p4558-mohammadi.pdf) · [DOI](https://doi.org/10.14778/3827998.3828065)  
Code: [CypherLens](https://github.com/YasmeanMohammadi/cypherLenz)

<p class="notice">A summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- A platform for evaluating NL-to-Cypher systems (English questions to Cypher, a graph-database query language) beyond execution accuracy: it runs generated and gold queries on Neo4j, aligns their result columns, scores Exact Match, Soft Match and Dice, and has LLM agents label query types and diagnose errors against a Cypher-specific error taxonomy (abstract; §2, PDF pp. 2–3).
- A Similarity Table built by staged column matching with an embedding fallback (§2.1, PDF p. 3); a Query Classifier Agent and a Diagnoser Agent (Gemini-2.5-Pro in the demo) that runs when Exact Match is 0 and can also inspect matching results, flagging structurally divergent ones as "correct-by-coincidence" candidates (§2.2–2.3, PDF p. 3; §3, PDF p. 4); shown on one prompting-based system over the Twitter subset of the Text2Cypher benchmark (§3, PDF pp. 3–4).
- A measurement of false accepts of execution-based grading in a non-SQL DSL, made by an LLM judge rather than a distinguishing database (our reading): the authors report that "7.75% of queries were flagged as correct-by-coincidence candidates" (§1, PDF p. 2), and leave "full benchmarking of diagnostic accuracy" to ongoing work (§1, PDF p. 2).

## In plain words

Systems that turn English questions into Cypher queries (a query language for graph databases) are usually scored by checking that the generated query returns the same result as a reference query. The authors argue that this check penalizes correct queries that differ in superficial ways such as column names or order, rewards wrong queries that match by chance, and never says why a query failed (abstract, PDF p. 1; §1, PDF pp. 1–2). Their demonstration platform, CypherLens, aligns results first, gives partial scores, and has LLM agents label query types and diagnose errors (abstract, PDF p. 1). In one demo run (one prompting-based system, a Twitter graph), its LLM diagnoser flagged 7.75% of queries as possibly correct by coincidence, with no comparison stated (§1, PDF p. 2; §3, PDF pp. 3–4).

## Background and terms

**Terms to know:** [execution accuracy](#/glossary/execution-accuracy) (here for Cypher; EA) · [gold query](#/glossary/gold-query) (here a reference Cypher query) · [property graph](#/glossary/property-graph) · [knowledge graph](#/glossary/knowledge-graph) · [Dice coefficient](#/glossary/dice-coefficient) (one of its result metrics, §2.1, PDF p. 3)

**The paper's own terms:**
- **NL-to-Cypher (T2C)**: translating natural-language questions into Cypher (§1, PDF p. 1), whose results, unlike SQL's, may hold nested objects, maps or nodes as JSON (§1, PDF pp. 1–2).
- **Similarity Table**: the alignment of the two queries' result columns by staged matching (exact names, aliases, types, schema), with embedding-based alignment (matching by text-embedding similarity) only as a fallback for semantically related expressions (§2.1, PDF p. 3).
- **Exact Match (EM), Soft Match, Dice coefficient**: scores computed from that table, "capturing exact agreement, partial cell-level correctness, and unordered value overlap" (§2.1, PDF p. 3). EM compares results, not query text as in the glossary's [exact match](#/glossary/exact-match).
- **Correct-by-coincidence (CBC) candidate**: a query whose result matches but that the Diagnoser Agent judges to diverge "structurally from the intended semantics" (§2.3, PDF p. 3).
- **Error taxonomy**: hierarchical Cypher-specific error labels from "our broader study of NL-to-Cypher semantic errors", covering projection and value semantics (which columns and values are returned), pattern topology (which nodes and relationships are matched), binding and scope (how query variables are bound and where they are visible), and clause-level errors (§2.3, PDF p. 3).

**Builds on:**
- The Text2Cypher benchmark (Ozsoy et al. 2025): its Twitter knowledge-graph subset and its prompting-based method are the demo's data and target system (§3, PDF pp. 3–4).
- SQL error-detection and evaluation systems SQLENS (Gong et al. 2025) and NL2SQL360 (Li et al. 2024), which the authors say "do not directly extend to graph-native query languages such as Cypher" (§1, PDF p. 2).

## Problem and setting

How to evaluate NL-to-Cypher systems beyond a binary result match, along the five challenges of §1 (PDF pp. 1–2): formatting differences, nested results, unexplained failures and query types, no partial credit, chance matches.

- **Inputs:** questions with gold Cypher queries, a database connection and API access to the target system; it "does not require access to the model architecture or implementation" (§2, PDF p. 2).
- **Demo setting:** a Neo4j (graph database) instance of the Twitter subset; the target system reached through a webhook (an HTTP endpoint); both agents on Gemini-2.5-Pro (Google's LLM) (§3, PDF pp. 3–4).
- **"Correct" in Fig. 2 (PDF p. 3):** EM = 1 with a Diagnoser verdict of correct or no verdict; CBC is EM = 1 with a verdict of incorrect.
- How NULLs are compared is not discussed, though Challenge 2 names them (§1, PDF p. 2).

## Approach

- **Execution and scoring (§2.1, PDF p. 3; Fig. 1, PDF p. 2):** generate a query per question, run both queries, build the Similarity Table, compute the scores.
- **Query Classifier Agent (§2.2, PDF p. 3):** assigns each question a class "(e.g., simple retrieval, aggregation, multi-hop traversal, path query)" from the question, schema and gold query; dataset labels are reused when present.
- **Diagnoser Agent (§2.3, PDF p. 3):** runs when EM is 0; reads the question, schema, both queries and sampled results, and returns taxonomy labels with a confidence score and a rationale. It can also inspect EM = 1 cases and flag CBC candidates. Both agents use a "provider-agnostic routing layer" for LLM backends.
- **Interface (§2.4, PDF p. 3):** dataset-level views (Fig. 2), a per-query panel.

## Results

From one demo run (§3, PDF pp. 3–4), the authors report:
- EM 0.352, Soft Match 0.464 and Dice 0.501 (Fig. 2, PDF p. 3); the EM–Soft Match gap "reveals that many failed queries are near-misses rather than fundamentally incorrect outputs" (§3 "Scenario 1", PDF p. 4).
- "7.75% of queries were flagged as correct-by-coincidence candidates" (§1, PDF p. 2); Fig. 2 prints "7.7% (11)".
- Diagnosed errors: Projection & Value Semantics 51, Pattern Topology Semantics 43, Binding & Scope Semantics 2 (Fig. 2, PDF p. 3).
- Scenarios 2–3 (§3, PDF p. 4) illustrate a hop-count error the system "may flag", and a CBC flag on a query that skips an intermediate node.

## Limits the authors state

- "This demo focuses on the design and interactive workflow of CypherLens; full benchmarking of diagnostic accuracy, human-annotated error labels, and alternative partial-credit metrics is left to ongoing work" (§1, PDF p. 2).
- The column alignments "support inspection and partial scoring, not definitive proof of semantic equivalence" (§2.1, PDF p. 3).
- Coincidental-correctness flags are "candidates" (§1, PDF p. 2; §2.3, PDF p. 3).

## Open problems and building blocks

- **Open:** "Future work will connect these diagnostic signals to automatic refinement loops and broader benchmark-level validation" (§4, PDF p. 4); fine-grained diagnostic tools for NL-to-Cypher "remain underexplored" (§1, PDF p. 2).
- **Released:** "The source code, data, and/or other artifacts have been made available" (PVLDB Artifact Availability box, PDF p. 1).
- **To reuse it:** a Neo4j database, questions with gold Cypher queries, API access to the target system (§2, PDF p. 2), and an LLM backend for the optional agents, enabled "depending on desired evaluation depth and computational cost" (§3 "Scenario 1", PDF p. 4).

## On this site

- **Discussed in:** [Checking a program written from English, in any DSL](#/challenges/dsl_intent_verification)
- **Tags:** <span class="tags"><a class="tag" href="#/tags/judge">judge</a><a class="tag" href="#/tags/labels">labels</a><a class="tag" href="#/tags/method">method</a><a class="tag sub" href="#/tags/dsl-graph">dsl-graph</a><a class="tag sub" href="#/tags/llm-gen">llm-gen</a><a class="tag sub" href="#/tags/nl2dsl-eval">nl2dsl-eval</a></span>
