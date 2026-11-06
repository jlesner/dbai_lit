# GQLBench: A Large-Scale Cross-Domain, Cross-Dialect Benchmark for NL2GQL

**GQLBench** · ACL 2026 (Volume 1: Long Papers)

Read: [PDF](https://aclanthology.org/2026.acl-long.1476.pdf,)  
Code: [GQLBench](https://github.com/qxssadf/GQLBench)

<p class="notice">A summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- A benchmark of writing graph-database queries from English questions (NL2GQL) in two dialects, Cypher and NebulaGraph's GQL, which the authors use "as the implementation of ISO GQL", scored by execution over hundreds of graph databases; it evaluates eight LLMs zero-shot and four open models after LoRA fine-tuning, with breakdowns by graph pattern, return form and advanced function (abstract, PDF p. 1; footnote 2, PDF p. 2; §6.5–6.7, PDF pp. 7–9).
- Spider and BIRD databases are migrated to property graphs by rules plus LLM prompts (join-table detection, edge naming and direction, merging redundant edge types), and their SQL gold is translated through a unified GQL syntax tree into both dialects (§4, PDF pp. 3–5); graph-native items (long paths, cycles) come from LLM-populated hand-made schemas, template queries kept only when they return rows, and LLM-written questions (§5, PDF pp. 5–6); training data is the converted Spider and BIRD training splits only, and synthetic items, absent from training, make up most of the test set (§6.5, PDF p. 7; App. D.3.5, PDF p. 15).
- Gold in two graph DSLs made by a SQL-to-GQL translator, whose automated check against the original SQL's results the authors report only on the BIRD dev set, with queries "such as those including a LIMIT clause without an ORDER BY" excluded, plus a human audit of 500 sampled pairs (App. D.2.4, PDF pp. 13–14); and a measurement on an ISO GQL dialect rare in pretraining: the authors report syntax errors as "more than 70% of the failures" on Nebula for gemini-3-flash and Qwen3-Max (§6.6, PDF p. 8); in the two open models analysed after LoRA fine-tuning (Qwen3-32B, Llama-3.1-8B-Instruct) they are largely removed, after which filtering and schema errors dominate (§6.6.1, PDF p. 8; Tab. 12, PDF p. 21).

## In plain words

Writing a graph-database query (in a language such as Cypher) from an English question, NL2GQL, is the graph cousin of [text-to-SQL](#/glossary/text-to-sql). The authors argue that existing NL2GQL benchmarks are not at once large, spread over many domains and covering several query languages, and that building them typically requires expensive manual annotation (§1, PDF p. 1). They build GQLBench automatically: the databases of the text-to-SQL benchmarks Spider and BIRD become graph databases, their reference SQL is translated into Cypher and into NebulaGraph's version of the new ISO standard GQL, and graph-only questions (long paths, cycles) come from synthetic graphs (abstract, PDF p. 1; footnote 2, PDF p. 2; §6.5, PDF p. 7). They present a benchmark and its construction framework as filling that gap (§1 and §2.1, PDF p. 2), and say it "surpasses all others in terms of the number of entities" among the benchmarks of Tab. 1 (§1, PDF p. 2). Zero-shot, the best of eight LLMs, gemini-3-flash, reaches 35.40% average [execution accuracy](#/glossary/execution-accuracy) over the two languages: 53.23% on Cypher, 17.56% on NebulaGraph's GQL (abstract, PDF p. 1; Tab. 3, PDF p. 7).

## Background and terms

**Terms to know:** [text-to-SQL](#/glossary/text-to-sql) · [property graph](#/glossary/property-graph) · [execution accuracy](#/glossary/execution-accuracy) · [abstract syntax tree (AST)](#/glossary/abstract-syntax-tree-ast) · [many-to-many relationship](#/glossary/many-to-many-relationship) · [LoRA](#/glossary/lora-low-rank-adaptation) · [low-resource programming language](#/glossary/low-resource-programming-language) · [Likert scale](#/glossary/likert-scale) (1 "completely irrelevant" to 5 "perfectly aligned", §6.2, PDF p. 6)

**The paper's own terms:**
- **GQL, two senses**: any graph query language in "NL2GQL" (§1, PDF p. 1); the recently released ISO standard language in "ISO GQL" (§1 and footnote 1, PDF p. 1).
- **Cypher, Nebula**: the two dialects, run on the graph databases Neo4j and NebulaGraph (App. D.1.1, PDF p. 12); "Nebula" is NebulaGraph GQL, used "as the implementation of ISO GQL" (footnote 2, PDF p. 2).
- **Join table, entity table** (§4.1.1, PDF p. 4): a join table "semantically represents many-to-many relationships between entities" and becomes edge types; other (entity) tables become node types.
- **Unified GQL AST** (§4.2.1, PDF pp. 4–5): the authors' intermediate tree, printed as a query in each dialect; table links become explicit *Relation* nodes, and a *Graph Pattern* is a sequence of nodes and relations.
- **Ground truth**: an item's reference query (§6.3, PDF p. 6): the translated SQL, or the template query for synthetic items (§5.2, PDF p. 6).
- **EX** (§6.3, PDF p. 6, Eq. 2): 1 if the predicted query's execution result equals the ground truth's, else 0, averaged; nodes and edges compare by internal identifiers. **Edit Sim**: a similarity based on edit distance (Tab. 3, PDF p. 7).

**Builds on:**
- Spider ([Spider](#/papers/yu2018spider "Spider: A Large-Scale Human-Labeled Dataset for Complex and Cross-Domain Semantic Parsing and Text-to-SQL Task (2018)")) and BIRD ([BIRD](#/papers/li2023bird "Can LLM Already Serve as A Database Interface? A BIg Bench for Large-Scale Database Grounded Text-to-SQLs (2023)")), text-to-SQL benchmarks whose databases and SQL are converted (§6.5, PDF p. 7).
- Rel2Graph (Zhao et al., 2023; relational databases mapped to graphs) and SQL2CYPHER (Li et al., 2021; SQL migrated to Cypher), the line they build on (§2.2, PDF pp. 2–3).
- CypherBench (Feng et al., 2025), a text-to-Cypher benchmark, source of the error classes (App. C, PDF p. 12); the LDBC Social Network Benchmark (Erling et al., 2015; a graph database benchmark), source of the edge generation idea (§5.1, PDF p. 5).

## Problem and setting

- **Question:** can a large, cross-domain, cross-dialect, execution-checked NL2GQL benchmark be built without manual annotation, and how do LLMs do on it (§1, PDF pp. 1–2)?
- **Data:** training data is the converted training splits of Spider and BIRD; the test set is "the remaining development and test splits, augmented with our synthesized data" (§6.5, PDF p. 7). Synthetic queries are "about 70% of the test set" and kept disjoint from training (App. D.3.5, PDF p. 15). Each dialect has more than 10,000 queries for training and for testing (§6.4, PDF p. 6; Tab. 2, PDF p. 7).
- **Models:** gemini-3-flash, Qwen3-Max, GPT-4o-mini and DeepSeek-V3.2-chat through APIs; Qwen3-32B, Qwen3-8B, GPT-OSS-20B and Llama-3.1-8B-Instruct locally, also after LoRA fine-tuning on the training set (§6.5, PDF p. 7; App. D.4.1, PDF p. 15).
- **What counts as correct:** EX, with BLEU and edit distance ([BLEU and ROUGE](#/glossary/bleu-and-rouge), [Levenshtein distance](#/glossary/levenshtein-distance)) as complementary metrics (§6.3, PDF p. 6). Whether row order or duplicate rows count in the comparison: not discussed.

## Approach

- **Relational-to-graph migration (§4.1, PDF pp. 3–4).** A table with fewer than two [foreign keys](#/glossary/integrity-constraint) is an entity table; one whose primary key (the columns identifying a row) consists only of foreign keys, at least two, is a join table; an LLM judges the rest. An LLM names each edge type and picks its direction and linking columns (Fig. 3, PDF p. 4), then merges semantically equivalent edge types between the same pair of tables (edge canonicalization, §4.1.3, PDF p. 4).
- **SQL-to-GQL translation (§4.2, PDF pp. 4–5; App. D.2, PDF p. 13).** SELECT and WHERE map to RETURN and WHERE; FROM and JOIN become graph patterns in MATCH (the clause stating the pattern to find). *Join Predicate Analysis* splits AND-joined conditions into single equalities and maps each to an edge type from a join table or foreign key; with no edge found, the pattern falls back to a "Cartesian Product" (all pairings of the two sides) (Alg. 1, PDF p. 13). *Path Coalescing* merges the edges into one multi-hop path (Fig. 4, PDF p. 5). Inner joins go into MATCH; OPTIONAL MATCH is used "to simulate LEFT JOIN or RIGHT JOIN" ([outer joins](#/glossary/outer-join)). Each dialect has its own printer class over the same tree (the Visitor design pattern, §4.2.3, PDF p. 5).
- **Synthetic graphs and questions (§5, PDF pp. 5–6; App. D.3, PDF pp. 14–15).** 30 hand-curated schemas in 10 domains, filled with LLM-generated nodes. Edges follow a homophily principle (similar nodes link more often): an edge's probability decays geometrically with the target's embedding-similarity rank (Eq. 1, PDF p. 6), giving about one edge per node in their setting (Eq. 3, App. D.3.3, PDF pp. 14–15). Cycles are predefined and generated by an LLM. Templates (App. D.3.1, PDF p. 14) are filled by sampling values and run, instances with empty results are pruned, and an LLM writes a question for each query (§5.2, PDF p. 6).

## Results

**Checks on the construction:**
- The authors say the translated queries "are semantically equivalent to the original SQL queries" and run faster than the SQLite baseline (an embedded SQL database engine) (§6.1, PDF p. 6; App. D.2.3, PDF p. 13).
- An automated check on the BIRD dev set runs both queries: "for all queries, the execution outputs are 100% identical", some queries (e.g. LIMIT without ORDER BY) being excluded. A human audit of 500 sampled (SQL, GQL) pairs averages 4.99 of 5, 99% scored perfect (App. D.2.4, PDF pp. 13–14).
- A spot check of 400 (question, GQL) pairs from the generation pipeline averages 4.78 of 5 on the Likert scale (§6.2, PDF p. 6).
- Rated for naturalness, their migrated schemas beat those of Rel2Graph and of both ablations (Tab. 10, PDF p. 13).

**Models (Tab. 3, PDF p. 7):**
- Zero-shot, gemini-3-flash leads (above), and every model scores lower on Nebula than on Cypher, which the authors call "likely due to the scarcity of Nebula and ISO GQL in their pre-training corpora" (§6.5, PDF p. 7).
- With LoRA, Qwen3-32B's average EX rises from 23.71% to 30.69%, above zero-shot GPT-4o-mini's 24.83% (§6.5, PDF p. 7). "Some models (e.g., Qwen3-32B)" lose EX on Cypher after fine-tuning (§6.5, PDF p. 7).
- **Errors (§6.6, Fig. 5, PDF p. 8):** on Cypher, gemini-3-flash and Qwen3-Max struggle with Incorrect Filtering, Pattern Not Aligned with Question and Results Not Aligned with Question, and Qwen3-Max makes more syntax errors; on Nebula, syntax errors "constitute more than 70% of the failures". After LoRA (Qwen3-32B, Llama-3.1-8B-Instruct), Nebula syntax errors shrink to a small share and the bottleneck shifts to Incorrect Filtering and Schema Violation (patterns that break the graph schema) (§6.6.1, PDF p. 8; Tab. 12, PDF p. 21). The authors read this as supervised fine-tuning (SFT) that "struggles to instill the underlying graph-native reasoning required for complex queries", and write that SFT's failing to fix these errors "proves that GQLBench is a high-quality, non-trivial dataset" (§6.6.1, PDF p. 8).
- **Breakdowns (§6.7, PDF pp. 8–9; Tabs. 4–6, PDF p. 9; 4000 sampled questions, before LoRA):** models do "relatively well" on simple patterns such as a single node or edge and drop "significantly" as structural complexity increases; cycles and long paths are among Tab. 4's lowest categories. EX is highest with no advanced functions and at or near zero for every model on subqueries (Tab. 6).

## Limits the authors state

- "due to the high cost of inference, the evaluation is confined to a representative subset of LLMs" (Limitations, PDF p. 9).
- GQLBench "does not yet encompass other widely used graph query language dialects" (Limitations, PDF p. 9).
- EX alone can be inflated: "two semantically different queries may coincidentally produce identical results (e.g., empty result sets)" (§6.3, PDF p. 6).
- For queries excluded from the automated equivalence check, e.g. LIMIT without ORDER BY, differing results "do not necessarily imply semantic non-equivalence"; the human audit found "very rare cases of semantic divergence" in "complex SQL queries involving non-standard join conditions" (App. D.2.4, PDF p. 14).
- The two engines' speed-ups use "different subsets of successfully translated SQL queries" (App. D.2.3, PDF p. 13).
- LoRA "may bias the model toward training-specific patterns and schemas, thereby constraining its ability to generalize across domains and query dialects" (§6.5, PDF pp. 7–8).

## Open problems and building blocks

- **Open:** the authors hope for "robust, generalizable, and dialect-aware NL2GQL systems" (§7, PDF p. 9); the bottleneck they name is reasoning: the benchmark "requires more advanced reasoning capabilities rather than mere pattern imitation" (§6.6.1, PDF p. 8).
- **Released:** "Our data and code are available at" the authors' repository (abstract, PDF p. 1).
- **To reuse it:** Neo4j Desktop 2.0.5 and NebulaGraph 5.2.0; DeepSeek-V3.2-chat at temperature 0 and Qwen-text-embedding-v3 for construction; migration on a server with 503 GB memory (App. D.1.1, PDF p. 12); sqlglot (an open-source SQL parser; App. D.2.2, PDF p. 13); LLaMA-Factory for LoRA and vLLM for inference, on one node with four NVIDIA A800 GPUs (App. D.4.1, PDF p. 15). The authors say emerging ISO GQL dialects "can be seamlessly integrated by simply implementing new visitors" (§4.2.3, PDF p. 5).

## On this site

- **Discussed in:** [Porting programs between DSLs and dialects without changing their meaning](#/challenges/dsl_porting) · [Learning a rarely seen DSL in prompts](#/challenges/unseen_dsl_in_prompts)
- **Tags:** <span class="tags"><a class="tag" href="#/tags/benchmark">benchmark</a><a class="tag" href="#/tags/compact">compact</a><a class="tag" href="#/tags/difftest">difftest</a><a class="tag" href="#/tags/labels">labels</a><a class="tag" href="#/tags/rarelang">rarelang</a><a class="tag sub" href="#/tags/dialect-translate">dialect-translate</a><a class="tag sub" href="#/tags/dsl-graph">dsl-graph</a><a class="tag sub" href="#/tags/llm-gen">llm-gen</a><a class="tag sub" href="#/tags/nl2dsl-data">nl2dsl-data</a></span>
