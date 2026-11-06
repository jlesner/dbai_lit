# Adaptive Text2GQL: Integrating Structural Twig Linking and Evolutionary In-Context Learning

**Adaptive Text2GQL** · ACL 2026 (Volume 1: Long Papers; first-page footer, PDF p. 1)

Read: [PDF](https://aclanthology.org/2026.acl-long.804.pdf,) · [DOI](https://doi.org/10.18653/v1/2026.acl-long.804)

<p class="notice">A summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- A training-free pipeline that writes graph-database queries in Cypher, Gremlin and SPARQL from English questions: schema-filled query templates ("twigs") retrieved as hints, a few-shot example store that starts empty and grows during inference, and a correction agent that checks a query against regex rules and then runs it on the database, retrying with the error (abstract; §3–4, PDF pp. 1, 3–6).
- Twigs are ranked by embedding-matched schema elements and IDF-weighted keywords (§4.1.2, Eq. 7, PDF p. 5); a query that executes becomes a new stored example, and each example's utility rises or falls with whether the queries it helped write execute (§2.3, PDF p. 3; §4.2.4, Eq. 10, PDF pp. 5–6); repairs after a failed execution stop at a fixed retry budget (§5.1.4, PDF p. 7; Alg. 3, PDF p. 13); scored by exact match, AST match and execution accuracy against baselines the authors adapted to all three languages, on their own movie benchmark aligned by hand across the languages and, without execution, on Neo4j's Text2Cypher benchmark (§5.1, PDF pp. 6–7; §5.2, PDF p. 7).
- A memory of demonstrations across problems, for three graph-query DSLs, whose admission check is that the database executes the query (§2.3, PDF p. 3; §4.2.4, PDF pp. 5–6; Alg. 3, PDF p. 13), with no comparison to a gold query, grown on the stream of questions being answered (our reading); its ablation has static few-shot examples scoring below zero-shot in Gremlin (and in SPARQL on exact and AST match) while the evolving store scores above both (§5.4, Tab. 3, PDF p. 8; GPT-4o only).

## In plain words

Graph databases are queried in often incompatible languages, such as Cypher, Gremlin and SPARQL. The authors say that translating natural-language questions into them "remains underexplored" and that existing approaches "often struggle with structural hallucinations" (abstract, PDF p. 1): LLMs often get the intent right but write queries that are "topologically or syntactically invalid" (§1, PDF p. 2). Their pipeline needs no training and has three parts: it retrieves small query fragments filled with the database's own names as hints; it keeps a store of earlier questions and queries that starts empty and admits queries the database could execute; and it repairs a query after rule checks or database errors (§3–4, PDF pp. 3–6). With GPT-4o writing Cypher on their own 240-question movie benchmark, they report 66.25% [execution accuracy](#/glossary/execution-accuracy) (the query returns the reference query's result) (§5.2, Tab. 1, PDF p. 7). The best of three baselines reaches 52.56% in the same table. They present it as improving on existing baselines (§1, PDF p. 2), not as a first.

## Background and terms

**Terms to know:** [property graph](#/glossary/property-graph) · [knowledge graph](#/glossary/knowledge-graph) · [schema linking](#/glossary/schema-linking) · [exact match](#/glossary/exact-match) · [abstract syntax tree (AST)](#/glossary/abstract-syntax-tree-ast) · [self-correction](#/glossary/self-correction) · [lost in the middle](#/glossary/lost-in-the-middle)

In the glossary's terms, the paper's Semantic Grounding step is schema linking for a graph schema (our wording).

**The paper's own terms:**
- **GQL**: any graph query language (abstract, PDF p. 1); the ISO standard ISO/IEC 39075:2024 is cited (§1, PDF p. 1), not evaluated.
- **The three languages**: Cypher and SPARQL are declarative, Gremlin procedural (§1, PDF pp. 1–2); engines Neo4j 5.24, TinkerPop 3.7 and Jena Fuseki 5.6 (§5.1.2, PDF p. 6).
- **Structural Twig**: "a minimal, semantically complete subgraph unit derived from the schema" (§2.2, PDF p. 2), e.g. a node type, edge type and node type, or a node type and one attribute (§2.2, PDF p. 3). In the method, a twig is a query template filled with schema names (§4.1.2, PDF p. 4).
- **Atomic Mapping Table**: each content word of the question linked to the closest schema element in embedding space, or to nothing below a threshold (§4.1.1, Eqs. 3–4, PDF p. 4).
- **Schema tags, lexical tags**: a twig's schema elements, and English keywords "statistically associated with the pattern" (§4.1.2, PDF pp. 4–5; Tabs. 5–7, PDF p. 14).
- **Evolutionary Shot Repository**: the example store. It starts empty, the "Tabula Rasa (cold-start)" setting (§2.3, PDF p. 3; this cold start means no examples, not the glossary's LLM-training sense), and keeps "verified Q-A pairs—instances where the generated query has been confirmed executable by the database engine" (§2.3, PDF p. 3). Each entry holds the question, its query and mapping table, a **syntactic utility** between 0 and 1, and an **evolutionary age** (§4.2.1, PDF p. 5).
- **AEGC (Adversarial Execution-Guided Correction)**: a **Static Critic** checks the query against an **error base** of regular expressions and anti-patterns (parsable but semantically invalid query shapes); a **Dynamic Verifier** runs it and feeds errors back (§4.3, PDF p. 6).
- **EM (exact match), GAM (GQL-AST Match), EX (execution accuracy)** (§5.1.3, PDF p. 7): EM "Measures strict string-level equality between the generated and reference queries after normalization"; GAM compares the two queries' syntax trees, "ignoring formatting differences"; EX compares the two queries' result sets.
- **Twig Hit Rate**: "the proportion of retrieved structural priors explicitly present in the ground truth query" (§5.3, PDF p. 8).

**Missing glossary terms:** none.

**Builds on:**
- Three baselines, "manually adapted" to all three languages (§5.1.3, PDF p. 7): Neo4j-Text2Cypher (Ozsoy et al., 2025; text-to-Cypher, per its reference title), R³-NL2GQL (Zhou et al., 2024; called "skeleton-based", §5.2, PDF p. 7) (a skeleton is a query outline before names are filled in) and AutoKGQA (cited as Avila et al., 2024, text-to-SPARQL with ChatGPT, per its reference title); none is listed here.
- [Text-to-SQL](#/glossary/text-to-sql) work on schema retrieval, and on execution-guided verification, which the authors say "has become standard practice" (§6, PDF p. 9).

## Problem and setting

- **The question:** given a question and a graph schema (node types, relationship types, properties, constraints), write the query in each target language (§2.1, PDF p. 2), with an example store built "without relying on pre-annotated datasets" (§1, PDF p. 2).
- **Data** (§5.1.1, PDF p. 6): the authors' Multi-Language Movie Benchmark, a "real-world knowledge graph (approx. 170 entities, 230 relationships)" with 240 questions whose queries are aligned by hand across the three languages; and the Neo4j Text2Cypher 2024v1 benchmark (a Hugging Face dataset; references, PDF p. 11), Cypher only, without execution because its schemas lack "the corresponding backend database instances" (App. F.1, PDF p. 17).
- **Models and settings:** GPT-4o, DeepSeek V3.2 and Qwen3-Coder (§5.1.2, PDF pp. 6–7); the embedding model BAAI/bge-small-en-v1.5, and a repair budget of two rounds (§5.1.4, PDF p. 7).
- **Not stated:** the model behind Tabs. 2, 4 and 9–14 (Tab. 3 says GPT-4o) and the language behind Tabs. 9–12; the noise injected for Tab. 4 (§5.5, PDF p. 8); the linking threshold and retrieval sizes.

## Approach

- **Structural Twig Linking (§4.1, PDF pp. 4–5; Alg. 1, PDF p. 12).** Determiners, prepositions, punctuation and stopwords are dropped from the question (Eq. 2); each remaining word is linked to its most similar schema element by [cosine similarity](#/glossary/cosine-similarity) (Eqs. 3–4). Templates such as Cypher's `(:□)-[:□]->(:□)` are filled with every schema combination the schema's constraints allow (Eqs. 5–6). A twig's score weighs the share of its schema elements in the mapping table against the summed inverse document frequency (see [TF-IDF](#/glossary/tf-idf)) of its keywords found in the question (Eq. 7).
- **Evolutionary In-Context Learning (§4.2, PDF pp. 5–6; Alg. 2, PDF p. 12).** Stored examples are ranked by schema overlap with the new question ([Jaccard similarity](#/glossary/jaccard-similarity)) plus their utility discounted by age (Eq. 8), and the best join the prompt (Eq. 9). The utility of each example used rises if the new query "is valid" and falls if it fails; all examples age a step (Eq. 10). A valid query becomes a new example; at capacity, the lowest age-discounted utility is evicted (§4.2.4, PDF p. 6).
- **AEGC (§4.3, PDF p. 6; Alg. 3, PDF p. 13).** The error base (App. C, Tab. 8, PDF p. 15) holds rules such as a missing colon in a Cypher node pattern or SQL keywords in Gremlin; a match makes the LLM rewrite the query before execution. Execution failures are "Syntactic Errors (parser violations), Semantic Errors (valid syntax yielding empty or incorrect results), and Runtime Errors (resource constraints)" (§4.3.2, PDF p. 6); a repair prompt with the question, query and error follows, "until a valid result is obtained or the retry budget is exhausted" (§4.3.2, PDF p. 6).

## Results

- **Main comparison (§5.2, Tab. 1, PDF p. 7).** The authors write that the framework "establishes a new state-of-the-art across all GQLs (Table 1)". They attribute R³-NL2GQL's "slightly higher EM in SPARQL" to boilerplate prefixes (the namespace declarations that open a SPARQL query) "identical to the ground truth" (§5.2, PDF p. 7). The authors say AEGC "universally enhances robustness" (§5.2, PDF p. 7).
- **Neo4j benchmark, without execution (§5.2, PDF p. 7):** 81.34% GAM and 75.34% EM.
- **Twig linking (§5.3, Tab. 2, PDF p. 8):** hit rate from 63.98% (Gremlin) to 80.33% (SPARQL).
- **Example store (§5.4, Tab. 3, PDF p. 8; GPT-4o):** above static few-shot and zero-shot in all three languages; in Gremlin, 62.50% EX against 38.66% (few-shot) and 42.22% (zero-shot). Static few-shot scores below zero-shot in Gremlin, and in SPARQL on EM and GAM, which the authors attribute to "structural noise from irrelevant static examples" ([negative transfer](#/glossary/negative-transfer)).
- **Correction under injected noise (§5.5, Tab. 4, PDF p. 8):** noisy queries keep "high textual overlap (EM >91%)" with about 31–45% EX; after AEGC, EX exceeds 83% in all three languages.
- **Query and schema size (§5.7, PDF pp. 8–9; App. F, Tabs. 12–14, PDF p. 17):** on the movie benchmark, EX falls steeply for longer target queries while GAM falls less, and "all baseline models completely fail (achieving 0% EX)" on the same splits (App. F.1, PDF p. 17). Across schema-size bins of the Neo4j benchmark, GAM is near-constant and EM rises slightly; the authors say the framework "entirely prevents the 'lost-in-the-middle' degradation" (§5.7, PDF p. 9).
- **Cost (§5.8, PDF p. 9; Tab. 15, PDF p. 17):** average latency per query rises from about 3.80 s for direct generation to about 8.58 s; AEGC runs only when an error is detected (§5.8, PDF p. 9).

## Limits the authors state

- AEGC "relies on database feedback; in static 'pure generation' settings without connectivity, the system cannot verify dynamic constraints, leading to a performance discount compared to execution-enabled scenarios" (§8, PDF p. 10).
- Twig linking "introduces pre-processing latency", and self-correction "increases token consumption and operational costs" (§8, PDF p. 10); the latency rise is "a 2.3× increase", which they call manageable "for analytical applications" (§5.8, PDF p. 9).
- EX "naturally declines" on Hard queries (§5.7, PDF pp. 8–9).
- No EX on the Neo4j benchmark, so "evaluation strictly focuses on structural metrics" (App. F.1, PDF p. 17).
- Difficulty is binned by target query length "as a proxy for topological complexity", since graph datasets "lack official difficulty splits" (App. F.1, PDF p. 16).

## Open problems and building blocks

- **Open:** "exploring quasi-offline verification mechanisms to reduce strict database dependencies" and "more lightweight, cost-effective architectures" (§8, PDF p. 10). They call the baselines' failure on hard queries "a universal challenge in Text2GQL" (App. F.1, PDF p. 17), and name the scarcity of "high-quality, parallel cross-language benchmarks" (§1, C3, PDF p. 2).
- **Released:** code ("The code is available at", abstract, PDF p. 1). No release of the movie benchmark is stated.
- **To reuse it:** a live connection to each language's engine for the dynamic check (§8, PDF p. 10); a per-language template library and a "curated error base" (§4.3.1, PDF p. 6; App. B–C, PDF pp. 13–15); the embedding model and one RTX 3090 GPU (§5.1.4, PDF p. 7); prompts average 325.6 tokens (§5.8, PDF p. 9; Fig. 3, PDF p. 18).

## On this site

- **Tags:** <span class="tags"><a class="tag" href="#/tags/harness">harness</a><a class="tag" href="#/tags/method">method</a><a class="tag" href="#/tags/nl2dsl">nl2dsl</a><a class="tag sub" href="#/tags/dsl-graph">dsl-graph</a><a class="tag sub" href="#/tags/dsl-sparql">dsl-sparql</a><a class="tag sub" href="#/tags/llm-gen">llm-gen</a><a class="tag sub" href="#/tags/promptopt-context">promptopt-context</a></span>
