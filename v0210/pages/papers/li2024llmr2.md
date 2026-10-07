# LLM-R2: A Large Language Model Enhanced Rule-Based Rewrite System for Boosting Query Efficiency

**LLM-R2** · PVLDB 18(1) · 2024

Read: [PDF](https://arxiv.org/pdf/2404.12872) · [arXiv](https://arxiv.org/abs/2404.12872) · [DOI](https://doi.org/10.14778/3696435.3696440)  
Code: [LLM-R2](https://github.com/DAMO-NLP-SG/LLM-R2)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- The LLM selects which trusted Calcite rules to apply.
- The authors say equivalence is "guaranteed" because every rule comes from Calcite (§1); their own Fig. 2(a) rewrite is not equivalent.
- The trusted-rule-selection pattern.

## In plain words

Query rewriting turns a slow SQL query into a faster one with the same answer. Databases do it with fixed rewrite rules, and the authors say choosing which rules to apply is hard: an earlier learned rule selector faces challenges in the cost of its search and the precision of its cost predictions, while an LLM writing the query itself can produce queries that fail or give different answers (abstract, §1). LLM-R² has an LLM (GPT-3.5-turbo) pick rules from those of Apache Calcite, an open-source query framework, and has Calcite apply them, so the authors say running and same answers "are guaranteed" (§1). Each prompt includes one past successful rewrite, picked by a trained model. On three benchmarks, rewritten queries took on average 52.5%, 56.0% and 39.8% of the original queries' time and 94.5%, 63.1% and 40.7% of the earlier selector's, counting execution only, each query capped at 300 seconds (§1). The authors claim to be "the first to propose an LLM-enhanced query rewrite system that can automatically select effective rules from a given set of rewrite rules" (§1).

## Background and terms

**Terms to know:** [query rewriting and rewrite rules](#/glossary/query-rewriting-and-rewrite-rules) · [query equivalence](#/glossary/query-equivalence) · [optimizer cost estimate](#/glossary/optimizer-cost-estimate) · [cardinality estimation](#/glossary/cardinality-estimation) · [Monte Carlo tree search (MCTS)](#/glossary/monte-carlo-tree-search-mcts) · [curriculum learning](#/glossary/curriculum-learning) · [contrastive learning](#/glossary/contrastive-learning)

**The paper's own terms:**
- **Executability, Equivalence, Efficiency**: the three criteria a rewrite should "Ideally" meet: it runs without errors, it "must yield identical results as the original query", and it runs faster, with a rewriting overhead the time saved can justify (§1).
- **query tree**: a query as a tree of operators (Sort, Join, Scan, …); the authors state any query can be turned into one and back (§2.1, Fig. 1).
- **demonstration**: a pair of an example query and the list of rules that were applied to rewrite it (§3.1); the **demonstration pool** is the set of successful ones.
- **Demonstration Manager**: builds the pool (**Benefit Estimator**, **Pool Generator**) and picks the demonstration (**Demonstration Selector**) (§3.2, Fig. 2(b)).
- **rewrite tuple** and **improved margin α**: a record of (training query, demonstration used, rules chosen, α), where α is the original query's cost divided by the rewritten query's (§4.1).
- **training triplet**: a training query with an **improve query** (a demonstration query that gave α > 1, the one with the largest α) and a **degrade query** (α < 1, the smallest) (§4.1).
- **confidence score**: a query's similarity to its improve query, minus that to its degrade query, plus 1, under the current selector (Eq. 4); high confidence counts as "easy" in the curriculum (§5.2).
- **EMPTY**: a rule the authors add for queries that need no rewrite (§6.1.2).

**Builds on:**
- LearnedRewrite (LR, [LearnedRewrite](#/papers/zhou2021learnedrewrite "A learned query rewrite system using Monte Carlo tree search (2021)")), which selects Calcite rules by Monte Carlo tree search guided by a learned cost model; the main baseline, called "the state-of-the-art query rewrite method" (§1, §2.3.1, §6.1.4).
- Apache Calcite ([Apache Calcite](#/papers/begoli2018calcite "Apache Calcite: A Foundational Framework for Optimized Query Processing Over Heterogeneous Data Sources (2018)")), the rewrite platform and its full rule set, "by following" LR (§6.1.2).
- QueryFormer (a tree Transformer for query plans; not listed here), which the query encoder follows (§5.1).
- SimCSE (contrastive sentence embeddings; not listed here), which inspires the contrastive training (§5.1).

## Problem and setting

- **Question:** given a query and candidate rules, find the rule sequence whose equivalent rewrite has the lowest execution latency (Def. 2.1, Eq. 1).
- **Rules and executor:** Calcite's rules plus EMPTY (§6.1.2); the LLM only proposes rules, and a "database-based rule executor" produces the query (§3.1).
- **LLM:** the ChatGPT API, GPT-3.5-turbo (§6.1.3); GPT-4 only in one ablation (§6.5.2).
- **Workloads** (§6.1.1): IMDB with the Join Order Benchmark (JOB, movie data with "complex join queries"), 5,000 queries; TPC-H (a benchmark for evaluating database systems, 22 query templates per §6.2), about 10 GB, 5,000 queries; DSB ("modified from the TPC-DS", a decision-support benchmark, to include "complex data distributions and challenging query templates"), 2,000 queries.
- **Metrics** (§6.1.6): execution time, the mean of five runs without the highest and lowest, with queries over 300 seconds assigned 300; and rewrite latency.
- **Baselines** (§6.1.4): LR, and **LLM only**, where the LLM writes the rewritten query itself from instructions, the schema and a fixed demonstration; rewrites that are "not executable or equivalent" are replaced by the original query.
- **Not discussed:** NULLs, set or bag semantics, row order, and which SQL features the rules cover.

## Approach

- **Pipeline (§3.1, Fig. 2(a), Fig. 3, Def. 3.1).** The prompt joins a system instruction, a list of every candidate rule with a short explanation, one demonstration, and the input query. The LLM's output is parsed into a rule list, which the rule executor applies; the authors say this ensures executability and equivalence (§3.1). The demonstration is there because rule selection by an LLM "may also easily suffer from the hallucination problem, like outputting non-existing rules" (§3.1).
  - Benefit Estimator, Stage 1: rewrite the training queries with the baseline method and zero-shot LLM-R² (no demonstration), execute them, and keep "the improvable queries, together with their rules adopted" as candidate demonstrations (§4.1).
  - Stage 2: rewrite them again with one demonstration chosen by three heuristics: Random; Tree, the smallest tree edit distance (node edits turning one tree into another) between query trees; and SentTrans, the closest Sentence Transformers embedding (a pretrained sentence encoder) of the query text (§4.1). The runs yield rewrite tuples, and these the training triplets.
  - The Pool Generator adds each training query to the pool with the rules of its tuple with the largest improved margin (§4.2, Eq. 2).
  - The encoder takes the query tree from the database's query analyzer and encodes each node's operator type, its conditions as text (Sentence Transformers), and its row count and estimated cumulative cost; a tree Transformer with tree-biased attention turns the nodes into one query vector (§5.1, Fig. 6).
  - Contrastive training pulls each training query toward its improve query and away from its degrade query and the other queries in the batch (Eq. 3). Online, the most similar pool demonstration is selected (§5).
  - Curriculum: each of four iterations (§6.1.5) adds the unused triplets the current model is most confident on and retrains, "until the entire training dataset has been incorporated" (§5.2, Alg. 1, Fig. 7).

## Results

All are the authors' reports, mean execution time unless noted.
- **Main comparison (Tab. 2, §6.2)**: LLM-R² has the lowest mean on all three workloads; LR keeps the lower 95th-percentile time on TPC-H. LLM only "has the worst performance" and "fails in most of its rewrite attempts" (§6.2).
- **Rewrite counts (Tab. 3):** improving rewrites on TPC-H, IMDB and DSB: LLM-R² 305, 292 and 222; LR 192, 197 and 193. The authors read the table as LLM-R² having more rewrites and a higher improvement rate on every dataset (§6.2).
- **Cost of rewriting (Tab. 4, §6.3):** LLM-R² takes 1.51–1.86 seconds more than LR to rewrite a query, for the selector and the LLM call; with latency added, the authors say its total is lower than the baselines', "especially for the most complicated DSB queries".
- **Transfer (Tab. 5, §6.4.1):** a selector trained on TPC-H, used on IMDB, gives 4.41 seconds against 6.99 for the original queries (3.91 when trained on IMDB, Tab. 2); LLM only gives no gain, and LR has no result because its cost model "lacks cross-dataset transfer capability".
- **Data scale (Tab. 6, §6.4.2):** on TPC-H at about 1, 5 and 10 GB, the authors say the efficiency of LLM-R²'s rewrites "increases consistently and surpasses the baseline methods".
- **Selection ablation (Tab. 7, §6.5.1):** zero-shot LLM-R² "outperforms the original queries significantly"; demonstrations beat zero-shot on all datasets except Random on DSB; the learned selector has the lowest mean on all three.
- **Selector settings (Tab. 8, §6.5.2), TPC-H:** against 37.23 seconds for the full method, 38.73 without the curriculum and 54.08 with three demonstrations, which the authors trace mainly to a "significantly reduced number of rewrite suggestions". GPT-4 at inference only (demonstrations and selector from GPT-3.5-turbo) "adversely impacts the efficacy of our method" (§6.5.2 (3)).
- **Rule variety (Tab. 9, §6.6):** LLM-R² uses more distinct rules and rule applications than LR on each workload; Fig. 8 shows LR missing a rewrite or slowing a query.

## Limits the authors state

- "The main limitation for our LLM-R2 lies in the higher rewrite latency compared to DB only methods" (§7).
- Training triplets are limited "Due to the necessity of executing queries" (§5.1).
- On TPC-H, "Most of the effective rewrite rules … can already be applied by LR, leaving LLM-R2 with limited scope for further enhancements" (§6.2 (2)).
- The LLM's recommendations "may not always be optimal—owing to constraints such as incomplete information and occasional inaccuracies" (§6.5.1 (1)).
- With 3-shot prompting, "the increased cost of rewrites and the challenges posed by longer in-context texts for LLM analysis emerge as critical yet unresolved issues" (§6.5.2 (2)).
- After the GPT-4 test, "consistency in model usage throughout the process may be pivotal for achieving optimal selection" (§6.5.2 (3)); cost limited GPT-4 to the test set (§6.5.2).

## Open problems and building blocks

- **Open:** faster demonstration selection, e.g. with Faiss (a similarity-search library), or to "specially fine-tune a LLM on query rewrite with more dataset" (§7); "the potential to develop a robust model by combining multiple datasets" (§6.4.1).
- **Released:** "The source code, data, and/or other artifacts have been made available" (PVLDB Artifact Availability box, PDF p. 1).
- **To reuse it:** Calcite and its rules (§6.1.2); an LLM API (§6.1.3); executing training queries to label demonstrations (§4.1); query trees with row counts and estimated costs from the database (§5.1); selector training of three epochs per curriculum iteration on a Tesla V100 16 GB GPU (§6.1.5).
- **Beyond its domain:** the authors "believe that the strong generalisation and reasoning ability of the LLMs can also be applied to other important database problems as well" (§7).

## On this site

- **Discussed in:** [Refuting faulty rewrite rules](#/challenges/faulty_rewrite_rules) · [Verified query speedups](#/challenges/verified_query_speedup)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/llm-gen">llm-gen</a><a class="tag sub" href="#/tags/pairgen-apply">pairgen-apply</a><a class="tag sub" href="#/tags/rewrite-llm">rewrite-llm</a></span>
