# Text2GraphQuery-Bench: A Text to Graph Query Benchmark

**Text2GraphQuery-Bench** · preprint 2026

Read: [PDF](https://arxiv.org/pdf/2602.11745) · [arXiv](https://arxiv.org/abs/2602.11745)  
Code: [Text2GraphQuery-DataGen](https://github.com/ldbc/Text2GraphQuery-DataGen)

<p class="notice">A summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- A text-to-graph-query benchmark with parallel gold queries in Cypher, GQL and SQL/PGQ, each question written at three abstraction levels and, in one test, with schema names replaced by LLM-made aliases; it scores frontier and open-weight LLMs, zero-shot, three-shot and (the open-weight ones) LoRA-fine-tuned, on parse validity, GLEU, Jaro-Winkler similarity and execution accuracy (abstract; §4.3; §6; §7.1).
- Gold comes from Text2Cypher, LDBC FinBench and BIRD (its SQL converted to Cypher by an open-source tool) and from LLM-synthesized schemas, LLM-written data generators and an execution-grounded evolutionary query generator; Cypher is parsed into a Graph-IR and printed as GQL and SQL/PGQ, and only the Cypher version is executed to filter queries (§4.2–4.4); evaluation runs on TuGraph-DB, Spanner Graph and Oracle DB, on the test examples all three can execute (§7.1).
- Parallel gold in three graph DSLs made by a translator whose output the paper does not report checking against the Cypher originals' results (the authors validate in Cypher because the newer languages' engine support is incomplete, §4.4; our reading), and a measurement of LLMs writing two new standards: the authors report zero-shot SQL/PGQ execution accuracy of at most 2.9% for six large models, recovered in part by three-shot prompting and by fine-tuning an 8B model (Tab. 5; §7.2).

## In plain words

Graph databases store data as nodes and links, queried in languages such as Cypher, GQL and SQL/PGQ. The authors say these languages are diverse and far less familiar to most users than SQL, and that existing benchmarks for turning English questions into graph queries cover few languages, build their data through rigid pipelines and score models narrowly (abstract). They build Text2GraphQuery-Bench, which they call "the first benchmark covering all mainstream declarative property graph query languages (Cypher, GQL, and SQL/PGQ)" (abstract): the same [gold queries](#/glossary/gold-query) in all three languages, each question phrased at three levels of abstraction, and a pipeline that adapts existing datasets and makes new ones with an LLM (§4). Running the queries on graph database engines, they report that without examples six large models almost never get the right answer in SQL/PGQ (at most 2.9%), while three examples in the prompt raise this to about 51% for the best two but only 16–21% for two others (Tab. 5). Fine-tuning an 8-billion-parameter model on their training set lifts its SQL/PGQ accuracy from 0 to 40.1% (Tab. 5).

## Background and terms

**Terms to know:** [execution accuracy](#/glossary/execution-accuracy) · [domain-specific language (DSL)](#/glossary/domain-specific-language-dsl) · [schema linking](#/glossary/schema-linking) (here for a graph schema's node labels, edge types and properties, App. D, Tabs. 30–31) · [abstract syntax tree (AST)](#/glossary/abstract-syntax-tree-ast) · [BLEU and ROUGE](#/glossary/bleu-and-rouge) · [LoRA (low-rank adaptation)](#/glossary/lora-low-rank-adaptation) · [low-resource programming language](#/glossary/low-resource-programming-language) (in the glossary's terms, the paper treats GQL and SQL/PGQ much like one: §7.2) · [property graph](#/glossary/property-graph) (abstract, §3; its variable-length paths match a range of edge counts, e.g. 1 to 3 hops, App. C, Tab. 29) · [Jaro-Winkler similarity](#/glossary/jaro-winkler-similarity) (§6) · [Fleiss' kappa](#/glossary/fleiss-kappa) (Tab. 3 caption)

**The paper's own terms:**
- **Text-to-Graph-Query**: given a natural-language question and a graph database (its data and schema), generate an executable graph query that retrieves the correct answer (§3). A **GDBMS** (graph database management system) "natively stores and manages data as a graph" (§3).
- **The three languages** (§3): Cypher, "the widely-adopted declarative language"; GQL, "the new international standard for property graph querying"; SQL/PGQ, "introduced in SQL:2023 to enable graph pattern matching within SQL". In SQL/PGQ the pattern sits inside a `GRAPH_TABLE` clause of a `SELECT` (App. D, Tab. 31).
- **SchemaGraph**: the pipeline's language-neutral schema description: entities, relations and property constraints (§4.3).
- **Graph-IR**: an intermediate representation of "the basic semantic structure of property graph query languages"; Cypher's AST is parsed into it, and GQL and SQL/PGQ are printed from it (§4.3).
- **Dynamic evolution mechanism**: execute seed queries, sample some with their results, and prompt an LLM to merge them into more complex queries, repeating the cycle (§4.3).
- **Abstraction levels** (§4.3): Syntactic (L1) questions name graph query primitives; Logical (L2) keeps the entity–relation logic without keywords; Business (L3) states analytical intent. **External knowledge** (E.K.) for L3 is derived by "reverse-rationalizing" aligned question–query pairs to make implicit assumptions explicit (§4.3).
- **Schema aliasing**: schema names in questions replaced by LLM-made near-synonyms, each kept only if its embedding's closest schema match is still the original element (§4.3).
- **Difficulty tiers** (§4.5; examples App. C, Tab. 29): Easy (one node or edge, no aggregation or complex filtering), Medium (one hop, simple aggregation or basic filters, no nesting), Hard (paths of at most two hops or of variable length, several conditions, or non-nested aggregation), Extra Hard (three or more hops, multi-step `MATCH` (the clause that states a graph pattern), nested aggregation, or high structural and logical depth).
- **Metrics** (§6): **EX**, same result as the gold query; **Grammar**, the query parses; **GLEU** (Google-BLEU), corpus-level token n-gram overlap with the gold; **Similarity**, Jaro-Winkler similarity, meant to capture writing style.

**Missing glossary terms:** none.

**Builds on:**
- Text-to-SQL benchmarks Spider ([Spider](#/papers/yu2018spider "Spider: A Large-Scale Human-Labeled Dataset for Complex and Cross-Domain Semantic Parsing and Text-to-SQL Task (2018)")), Spider 2.0 ([Spider 2.0](#/papers/lei2024spider2 "Spider 2.0: Evaluating Language Models on Real-World Enterprise Text-to-SQL Workflows (2025)")) and BIRD ([BIRD](#/papers/li2023bird "Can LLM Already Serve as A Database Interface? A BIg Bench for Large-Scale Database Grounded Text-to-SQLs (2023)")), which the authors say can't be directly repurposed because graph queries need paths and reachability (§1, §2, Tab. 1); BIRD is also a data source (§4.2).
- Earlier text-to-graph-query sets, compared first (Tab. 1, §2): Text2Cypher and SyntheT2C (synthetic, Cypher only), GQLBench (Cypher and GQL, template-based), and nGQL-based datasets (nGQL being another graph query language).
- Sources adapted: the Neo4j (a graph database) Text2Cypher dataset and LDBC (Linked Data Benchmark Council) FinBench, "complex Cypher and GQL queries from financial applications" (§4.2).

## Problem and setting

The question (§1): how to build one text-to-graph-query benchmark that covers several standards, is not tied to fixed templates, and can be evaluated by difficulty, question abstraction and vocabulary.

- **Data** (§5.1, Tab. 2): 22,273 examples over 34 databases in 13 domains, split into train, dev and test for cross-domain evaluation; the test set is kept to a narrower size range "for evaluation stability". Three languages × four questions (original plus three levels) give 267,276 pairs (Tab. 1 footnote).
- **Correctness:** EX compares the results of predicted and gold queries (§6); how ordering or duplicates are compared is not discussed.
- **Engines** (§7.1): Cypher on TuGraph-DB (a graph database), GQL on Spanner Graph (Google Cloud's graph database service), SQL/PGQ on Oracle DB, SQL on SQLite. The evaluation uses the 2,783 test examples all three graph engines can run.
- **Models** (§7.1): six large models (Claude Opus 4.8, Qwen3.7-Max, GPT-5.5, Gemini-3.5-Flash, DeepSeek-V4-Pro, Kimi K2.6) and two open-weight ones, Qwen3-8B and text2cypher-gemma-2-9b (already fine-tuned for Cypher on Text2Cypher), all "in non-thinking mode". Strategies: zero-shot, a fixed 3-shot prompt with the same three training examples for every instance, and LoRA fine-tuning of the open-weight models (§7.1; prompts App. B.2–B.3).

## Approach

The pipeline has four stages (§4.1, Fig. 2; §4.3):
- **Schemas:** existing schemas are parsed into SchemaGraph, with association tables (tables linking two others) turned into edge types; for new industrial domains an LLM writes schemas under structural constraints (App. B.4).
- **Data:** existing data is converted deterministically into each engine's import format; for new domains the LLM writes Python programs that generate data with controlled scale and referential integrity (every reference points to an existing record) (import configs App. B.6; data-generator prompt App. B.4, Tab. 20).
- **Queries:** Cypher goes through Graph-IR to GQL and SQL/PGQ; BIRD's SQL is first converted to Cypher with open-source tools (Fig. 3). For new domains the dynamic evolution mechanism grows complex queries such as 3+ hop traversals, which translation alone covers poorly. The authors say the Graph-IR design "enables rapid extension to new graph query languages" (abstract).
- **Questions:** L1–L3 questions, external knowledge for L3, and aliased variants (App. B.5).

**Quality assurance** (§4.4): every generated query is executed in Cypher and failures are dropped; Cypher is chosen "for its mature GDBMS support, since queries translated to newer languages (e.g., GQL, SQL/PGQ) may fail due to incomplete GDBMS support rather than query defects". Near-duplicates are removed. For the test set, 700 sampled examples are scored by an expert and a model on question–query alignment and abstraction level, a third expert resolving disagreements.

## Results

- **Benchmark quality** (§4.4, §5.2, Tab. 3): the authors report a 92.9% pass rate on the 700 audited examples; abstraction levels are recognized reliably (§5.3, Tab. 4).
- **Language gap** (§7.2, Tab. 5): zero-shot, large models score much lower Grammar and EX in GQL and SQL/PGQ than in Cypher, which the authors read as syntax "unfamiliar to models pre-trained predominantly on Cypher and SQL". Zero-shot SQL/PGQ EX is at most 0.029 for the six large models; three-shot prompting brings Claude Opus 4.8 and GPT-5.5 to 0.509 and 0.512, but Qwen3.7-Max and DeepSeek-V4-Pro only to 0.209 and 0.162.
- **Fine-tuning a compact model** (§7.2, Tab. 5): Qwen3-8B goes from zero-shot to fine-tuned GQL EX 0.160 → 0.451 and SQL/PGQ EX 0.000 → 0.401, with the highest GQL Grammar of any row; the authors conclude that "unfamiliarity with new graph query languages—rather than model capacity—is the primary barrier" (§1).
- **Difficulty** (§7.2, Fig. 5): the authors report that GQL EX consistently degrades from Easy to Extra Hard; with three-shot prompts Claude Opus 4.8 reaches only 0.438 on Extra Hard.
- **Error mix** (§7.2, Fig. 6): zero-shot SQL/PGQ errors are mostly syntax, "largely because models generate incorrect SQL dialects or omit the GRAPH_TABLE wrapper"; with three-shot prompts schema linking dominates (GQL 60.2%, SQL/PGQ 67.6%); after fine-tuning, GQL errors concentrate on aggregation, SQL/PGQ errors on schema linking and filters.
- **Metrics:** Similarity stays high even when EX is low, "a weak proxy for semantic correctness" (§7.2).
- **Abstraction** (§7.3, Fig. 7; Qwen3.7-Max three-shot and fine-tuned Qwen3-8B, GQL): EX is highest at L1 and lowest at L3 without external knowledge, and adding external knowledge consistently recovers accuracy; the authors read the dominant bottleneck at high abstraction as "intent-to-schema grounding rather than syntax alone".
- **Aliasing** (§7.3, Tab. 6; Qwen3.7-Max, zero-shot GQL, six synthesized domains): the average change in EX with aliases is −1.26% (Alias EX minus Original EX).
- **SQL against Cypher** (App. E, Fig. 8; BIRD-derived domains): EX on SQLite exceeds Cypher in every domain for both models tested.

## Limits the authors state

- Models of undisclosed size are "a point of reference rather than a direct comparison under controlled parameter size conditions" (§7.1).
- Generated queries are validated by execution in Cypher, chosen because the newer languages' engine support is incomplete (§4.4); the training set "primarily relies on automated execution validation" (§4.4).
- 1,044 test examples are left out because Spanner Graph "does not support the return of graph elements" (§7.1).
- The small aliasing drop is "partly because our alias generation procedure … constrains each alias to be semantically close to the original schema element"; real naming is "often more informal and divergent, which would likely cause larger degradation" (§7.3).
- Semantic alignment "degrades mildly as abstraction strengthens" (§5.3).
- "Domain coverage is not uniform, and the distribution of query complexity may reflect the characteristics of the source datasets"; users should "avoid over-generalizing performance claims to unseen domains" (App. F).

## Open problems and building blocks

- **Open:** "Extra Hard accuracy remains low even for the strongest models, identifying nested aggregation and multi-step structural composition as frontier challenges" (§8); the bottleneck shifts with supervision, "from syntax unfamiliarity under zero-shot, to schema linking under few-shot, to language-specific semantic challenges" (§8).
- **Released:** "The dataset, toolkit, and code are available" (§1, contributions); the benchmark is said to be under "a permissive license that permits academic use while prohibiting re-identification attempts" (App. F).
- **To reuse it:** the engines TuGraph-DB, Spanner Graph and Oracle DB (and SQLite) (§7.1); LoRA fine-tuning on one 32 GB V100 GPU (§7.1); the prompts (App. B).

## On this site

- **Discussed in:** [Benchmarks with checkable ground truth](#/challenges/checkable_benchmark_ground_truth) · [Porting programs between DSLs and dialects without changing their meaning](#/challenges/dsl_porting)
- **Tags:** <span class="tags"><a class="tag" href="#/tags/compact">compact</a><a class="tag" href="#/tags/dsl">dsl</a><a class="tag" href="#/tags/rarelang">rarelang</a><a class="tag sub" href="#/tags/dialect-translate">dialect-translate</a><a class="tag sub" href="#/tags/general-misc">general-misc</a><a class="tag sub" href="#/tags/llm-misc">llm-misc</a></span>
