# R-Bot: An LLM-based Query Rewrite System

**R-Bot** · PVLDB 18 · 2025

Read: [PDF](https://arxiv.org/pdf/2412.01661) · [arXiv](https://arxiv.org/abs/2412.01661) · [DOI](https://doi.org/10.14778/3750601.3750625)  
Code: [LLM4Rewrite](https://github.com/curtis-sun/LLM4Rewrite)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- LLM rewriting guided by retrieved rewrite evidence.
- Hybrid structure-semantics retrieval plus step-by-step reflection.
- Equivalence is taken on trust from the rules ("inherently ensured by the rules", §3), never checked; a baseline of later LLM rewriters (E3-Rewrite, QUITE).

## In plain words

A database can often run a query much faster after rewriting it into an equivalent form, but choosing which rewrite rules to apply, and in what order, is hard. The authors say heuristic methods are "often criticized for their inferior quality", trained models struggle with unseen schemas without retraining, and GPT-4 rewriting queries of a decision-support benchmark directly "yielded only a 5.3% success rate" (§1). They build R-Bot, in which the LLM never writes SQL: it picks and orders rules of Apache Calcite, an open-source query engine, guided by hints retrieved from rule documentation, rule code and Stack Overflow answers, then reflects on the result using the database's cost and an LLM check (§3). The authors say this keeps the output executable and equivalent to the original (§1). With gpt-4o, on 44 Calcite test queries over uniform data, average run time falls from 109.73 s to 12.45 s, against 55.41 s for the best other method (§7.2). They present it as a system "surpassing state-of-the-art query rewrite methods" (abstract), deployed at Huawei.

## Background and terms

**Terms to know:** [query rewriting and rewrite rules](#/glossary/query-rewriting-and-rewrite-rules) · [query equivalence](#/glossary/query-equivalence) · [optimizer cost estimate](#/glossary/optimizer-cost-estimate) · [Monte Carlo tree search (MCTS)](#/glossary/monte-carlo-tree-search-mcts) · [correlated subquery](#/glossary/correlated-subquery) · [data contamination](#/glossary/data-contamination) · [retrieval-augmented generation (RAG)](#/glossary/retrieval-augmented-generation-rag) · [reciprocal rank fusion (RRF)](#/glossary/reciprocal-rank-fusion-rrf)

**The paper's own terms:**
- **rewrite rule**: a triple of a condition, a transformation and a matching function; if the matching function says a query meets the condition, the transformation gives "an equivalent rewritten query" (Def. 2.1). Tab. 2 shows three Calcite rules, e.g. one that turns an `IN`/`EXISTS` subquery in `WHERE` into a join.
- **rule-based query rewrite**: finding the sequence of rules from a given set whose result has the lowest execution cost (Def. 2.2).
- **rewrite rule specification**: a natural-language version of a rule (condition and transformation in words) plus its matching function (Def. 2.4; Tab. 3 contrasts the two).
- **rewrite Q&A**: a question asking how to rewrite a query, with its answer, taken from web forums (Def. 2.3, §4.2).
- **rewrite recipe**: LLM-written instructions on how to use one rule specification or one Q&A to rewrite *this* query (Defs. 2.5–2.6, §5.3).
- **normalization and exploration rules**: Calcite rules the authors split, "based on expert experience", into those that "nearly always" reduce cost and those that do "not consistently" do so (§6).
- **query latency / overall latency**: execution time of the rewritten query / rewrite time plus execution time (§7.1).
- **factuality and faithfulness hallucination**: the paper's two challenges: C1, met with retrieved rewrite evidence, and C2, the LLM's trouble analyzing complex queries and fully using detailed evidence, met by splitting the rewrite into steps (§1).

**Builds on:**
- LearnedRewrite ([LearnedRewrite](#/papers/zhou2021learnedrewrite "A learned query rewrite system using Monte Carlo tree search (2021)")), which orders rules by Monte Carlo tree search guided by cost models; the main baseline (§1, §7.1, §8).
- Heuristic rule engines: PostgreSQL's fixed rule order and Volcano's ([The Volcano Optimizer Generator](#/papers/graefe1993volcano "The Volcano optimizer generator: extensibility and efficient search (1993)")) heuristic search over orders (§1, §8).
- Apache Calcite ([Apache Calcite](#/papers/begoli2018calcite "Apache Calcite: A Foundational Framework for Optimized Query Processing Over Heterogeneous Data Sources (2018)")), whose rules R-Bot selects and whose rule code it summarizes (§4.1.1, §7.1).
- LLM-R2 ([LLM-R2](#/papers/li2024llmr2 "LLM-R2: A Large Language Model Enhanced Rule-Based Rewrite System for Boosting Query Efficiency (2024)")), an LLM rewriter that puts rewrite examples into the prompt; the authors say it "still lacks robustness" because its example pool and selection model are trained (§8).

## Problem and setting

- **Question:** can an LLM, given retrieved evidence, choose a better rule sequence for a query than heuristics or trained search, without retraining for each new database (§1, §2.1)?
- **What "correct" means:** rewrites are only rule applications in a rule engine; the paper takes each rule's result as equivalent (Def. 2.1; "without compromising the SQL equivalence inherently ensured by the rules", §3). Quality is measured as latency (§7.1). Set versus bag semantics: not discussed. The paper says it focuses on "logical query rewrite" (§5.2.1).
- **Engine and setup:** Calcite's rules; queries run in PostgreSQL v14; LLMs gpt-4o (labelled GPT-4) and gpt-3.5-turbo-0125 (labelled GPT-3.5) at temperature 0.1; each query run five times, averaging the middle three (§7.1).
- **Benchmarks (§7.1):** TPC-H (a standard analytical benchmark, 44 queries) and DSB (a more complex analytical benchmark adapted from TPC-DS, [DSB](#/papers/ding2021dsb "DSB: a decision support benchmark for workload-driven and traditional database systems (2021)"), 76 queries), each at about 10 GB and 50 GB; and Calcite, 44 queries from Calcite's rule test suites on 10 GB of data, with uniform ("uni") and skewed Zipfian ("zipf") value distributions. The Calcite queries are those "with top 11% performance gains under Calcite rewrite", chosen "For efficiency" (footnote 2).
- **Baselines (§7.1):** LearnedRewrite, run with "query cost models approximated using query plan statistics" (footnote 3); plain GPT-4 and GPT-3.5 given the query and the rule list, asked for a rule sequence. Learning-based methods, including LLM-based ones that need training, are called "generally unsuitable for our tests due to the absence of a train-test dataset split" (footnote 3).

## Approach

An offline stage, then an online loop (§3, Fig. 2):

- **Evidence preparation (§4).** From rule code: a tree of the symbols the rule uses, summarized by the LLM from the leaves up, each summary inserted as a comment into its parent's code, then turned into a specification (§4.1.1, Fig. 3). From PostgreSQL and MySQL documentation: rules extracted block by block, clustered by embedding, each cluster summarized into one specification (§4.1.2). Q&As: Stack Overflow posts filtered by tags and score, then by an LLM (§4.2).
- **Retrieval (§5, Fig. 4).** Rule specifications whose matching function accepts the query are retrieved (§5.1). For Q&As, a query's embedding joins three parts: (i) embedded query templates, each keeping one table or column that appears more than once, masking other names and constants, and sorting commutative operands, so that renaming the schema or reordering `AND` leaves it unchanged (§5.2.1); (ii) a one-hot vector of matching rule specifications; (iii) an embedding of the rule recipes, compared with Q&A answers. Top-k lists are merged by RRF (§5.2.2). The LLM writes a recipe per retrieved item and merges related ones (§5.3).
- **Step-by-step rewrite (§6).** Step 1 scores rules: matched normalization rules get the top score, matched exploration rules a neutral one, and each rule the LLM judges applicable given a retrieved Q&A gains that Q&A's similarity score (judged offline per rule–Q&A pair); rules with no support are dropped, the rest ordered by score. Step 2: the LLM filters rules against the recipes in batches, carrying selected rules forward, then orders them, first within groups for one SQL operator, then overall. Calcite applies the sequence.
- **Reflection (§3, §6).** Two checks: is the cost the database gives for the rewritten query below the original's, and does the LLM judge all recipes realized. Both met: stop. Cost check failed only: reorder, preferring unused rules. Recipe check failed only: a new round from the rewritten query. Both failed: reorder until a threshold, then a new round (§3).
- **Deployment (§3).** In Huawei's GaussDB, slow queries (e.g. over one minute) go to R-Bot; when its rewrite beats GaussDB's own, the query pattern is cached and reused for matching queries.

## Results

The authors report (§7):
- **Query latency (Tab. 4).** "R-Bot outperforms the other query rewrite methods across all the datasets and metrics" (§7.2). Calcite (uni) average: 109.73 s → 12.45 s for R-Bot (GPT-4), against 79.07 s for LearnedRewrite and 55.41 s for plain GPT-3.5; R-Bot's TPC-H 10x and DSB 10x medians fall much less. Plain LLMs "tend to select only a small number of rules (e.g., 1)" (§7.2).
- **Improved queries (Tab. 5).** R-Bot (GPT-4) improves 17/44 TPC-H, 18/76 DSB and 39/44 Calcite queries, against 7/44, 4/76 and 29/44 for LearnedRewrite; R-Bot (GPT-3.5) is highest on TPC-H.
- **Skewed data (Tab. 6).** On Calcite (zipf), R-Bot (GPT-4) has the lowest average, median and p90.
- **Weaker LLM.** R-Bot (GPT-3.5) is worse than R-Bot (GPT-4) "on most metrics, … but still outperforms the other query rewrite methods" (§7.2).
- **Overall latency (Fig. 6).** On TPC-H 50x and DSB 50x, rewrite time included, R-Bot shows "improvements of 1.82x and 1.68x respectively" (§7.2).
- **Ablations, on Calcite (uni)**. Naive RAG beats plain GPT-4 on all three metrics (Tab. 7). Structure-only and semantics-only Q&A retrieval give average latencies of 31.96 s and 39.45 s, against 12.45 s (Tab. 8). One-step rule selection is worse on all three metrics (Tab. 9). Rewrite latency grows with k; the authors say query latency falls up to k = 10 and choose k = 10 (Fig. 7, §7.3.2), with "on average at least one relevant Q&A" retrieved. Reflection adds rewrite time but lowers overall latency (Fig. 8).
- **Deployment (§7.5, Fig. 10).** With the open models DeepSeek-R1-Distill-Qwen-32B (LLM) and gte-Qwen2-1.5B-instruct (embeddings), on 20 slow queries from ICBC (China's largest bank), R-Bot improves 70% of the queries and cuts overall latency from 9.23 h to 4.37 h, the authors say even though the queries are absent from the LLM's pre-training corpus.

## Limits the authors state

No limitations section; caveats in passing:
- A rule "sometimes degrades the query" (§2.1); LLMs are unstable "in complex tasks like rule arrangement", hence reflection (§6).
- Rewriting takes time ("average around 1 min", §7.2); reflection adds rewrite latency (§7.3.4); a large k "may introduce noisy contexts, which may impair performance of LLM in query rewrite" (§7.3.2).
- The Calcite queries were cut to the top 11% "For efficiency"; the authors say full-set experiments "confirmed" the results (footnote 2).

## Open problems and building blocks

- **Open:** None stated.
- **Released:** "The source code, data, and/or other artifacts have been made available" (PVLDB Artifact Availability box, title page).
- **To reuse it:** a rule engine with matching functions (Calcite here), its rules split by experts into normalization and exploration rules (§6); the database's cost estimates (§3); an LLM and a text embedding model (§7.1, §5.2.1; a 32B open model in §7.5); a Java symbol resolver (§4.1.1); offline LLM judgments for every rule–Q&A pair (§6). The evidence: 67 expert-verified rule specifications (30 from documents, 37 from code) and 2091 Q&As (§7.1, Fig. 5).
- **Beyond its domain:** not claimed.

## On this site

- **Discussed in:** [Verified query speedups](#/challenges/verified_query_speedup)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/harness-sql">harness-sql</a><a class="tag sub" href="#/tags/llm-gen">llm-gen</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/pairgen-apply">pairgen-apply</a><a class="tag sub" href="#/tags/rewrite-llm">rewrite-llm</a></span>
