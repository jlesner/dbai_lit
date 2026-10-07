# ExSPIN: Explicit Feedback-Based Self-Play Fine-Tuning for Text-to-SQL Parsing

**ExSPIN** · *Entropy* 2025

Read: [PDF](https://www.mdpi.com/1099-4300/27/3/235/pdf) · [DOI](https://doi.org/10.3390/e27030235)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Self-play fine-tuning (SPIN) for text-to-SQL, with the execution results of predicted SQL fed into the parameter update (abstract).
- Explicit schema hints by in-context learning during self-play (abstract).
- Earlier SQL self-play by five of SPFT-SQL's authors, which [SPFT-SQL](#/papers/zhang2025spftsql "SPFT-SQL: Enhancing Large Language Model for Text-to-SQL Parsing by Self-Play Fine-Tuning (2025)") does not cite (our check of its source); a main model against an opponent, not proposer–solver (borderline, kept as Adjacent: text-to-SQL self-play judged by execution).

## In plain words

Text-to-SQL models turn a question into an SQL query. Small open-source models fine-tuned on human-labelled pairs do well, but labels are costly, so the authors want a model that improves from its own outputs without extra labels (§1, PDF pp. 1–2). SPIN, an existing self-play method, trains each new model to prefer the human answer over what the previous model wrote. The authors report that applied directly to text-to-SQL it lowered accuracy (§1, PDF p. 2), and blame it mainly for ignoring whether a query runs correctly and how the question maps to the database. Their ExSPIN runs the previous model's queries on the database and trains only against those whose result is wrong, and puts schema hints in the prompt: the relevant tables and columns, matching cell values, keys and column types. With a 6.7B code model on the Spider benchmark they report 83.2% of queries returning the right result, against 76.3% for plain fine-tuning (§1, PDF p. 2). They present it as new: SPIN's "application to text-to-SQL tasks remains unexplored" (§1, PDF p. 2).

## Background and terms

**Terms to know:** [text-to-SQL](#/glossary/text-to-sql) · [gold query](#/glossary/gold-query) · [execution accuracy](#/glossary/execution-accuracy) · [self-play](#/glossary/self-play) · [reinforcement learning](#/glossary/reinforcement-learning) · [schema linking](#/glossary/schema-linking) · [DPO](#/glossary/direct-preference-optimization-dpo)

**The paper's own terms:**
- **self-play**, as this paper uses it: the SPIN loop, where a model is trained against its own earlier version on the training set's questions; only the answers are self-generated (§3, PDF p. 5; Alg. 2, PDF p. 12). Not proposer–solver self-play: no new questions are written.
- **SPIN** (self-play fine-tuning, ref [14]): each round, the previous model writes an answer to each training prompt, and the new model is trained so that, relative to the previous model, it makes the human answer more likely and the self-written answer less likely (§3, Eqs. 1–5, PDF pp. 5–6).
- **main player** (also "primary player") and **opponent** (also "adversary"): the model being trained, and the model from the previous round that writes the answers (§3, PDF p. 5).
- **λ** ("regularization parameter"): a weight on the log-probability ratios in the loss (Eqs. 2–4, PDF p. 6; §5.3, PDF p. 16).

**Missing glossary terms:** none.

**Builds on:**
- **SPIN** (Chen et al., ref [14]): the method ExSPIN changes (§1, PDF p. 2; §3, PDF pp. 5–7). Not on this site.
- **Schema linking and in-context learning** (§1, PDF p. 2; §2.2, PDF pp. 4–5): CHESS [15], an LLM text-to-SQL pipeline, cited for the question–schema link; DIN-SQL [2], a prompting method, whose execution-accuracy metric it follows (§5.1.4, PDF p. 13). Neither is on this site.
- **Baselines** (§5.1.3, PDF p. 13; §5.2, PDF p. 16): SFT, cited to LlamaFactory [36], a fine-tuning toolkit; SPIN; DPO; and GPT-4o, OpenAI's closed model.

## Problem and setting

- **The question:** can SPIN-style self-play improve a fine-tuned text-to-SQL model without more labelled data, if the opponent's queries are judged by running them and the prompt carries schema hints (§1, PDF pp. 2–3)?
- **What "correct" means:** a query is right when its result on the database equals the gold query's result (§5.1.4, PDF p. 13); the authors want this rather than a match with the gold text, since "two semantically similar SQL queries may yield different execution results" (§1, PDF p. 2) and a correct query can differ from the annotated one (§3, PDF p. 6).
- **Benchmarks** (§5.1.1, PDF p. 12): Spider ([Spider](#/papers/yu2018spider "Spider: A Large-Scale Human-Labeled Dataset for Complex and Cross-Domain Semantic Parsing and Text-to-SQL Task (2018)")), cross-domain, 200 databases spanning 138 domains, evaluated on its test set; BIRD ([BIRD](#/papers/li2023bird "Can LLM Already Serve as A Database Interface? A BIg Bench for Large-Scale Database Grounded Text-to-SQLs (2023)")), 12,751 question–SQL pairs across 37 domains, with realistic databases and noisy questions.
- **Models** (§5.1.2, PDF p. 13): the open-source code models DeepSeek-Coder-Instruct 6.7B and Qwen2.5-Coder-Instruct 1.5B, 7B and 14B. Tab. 3, the λ study and the ablation use DeepSeek-Coder 6.7B only (§5.2–5.5, PDF pp. 16–19).
- NULLs, the SQL fragment and the database engine: not discussed.

## Approach

Three stages (§4 and Fig. 2, PDF p. 7):
- **SFT** on the training pairs (§4.1, PDF p. 8).
- **Explicit schema integration** (§4.2, PDF pp. 8–10; Fig. 3, PDF p. 9; Alg. 1, PDF p. 10) builds a database prompt placed with each question:
  - *schema filtering*: a "schema item classifier model" scores each table and column for relevance; the top k1 tables and k2 columns are kept, padded with random tables when fewer are relevant;
  - *value retrieval*: a BM25 index (a standard keyword-search ranking) finds candidate cell values, and the longest common substring with the question picks the matching ones;
  - *metadata*: primary and foreign keys, representative column values, column types and database comments.
- **Execution feedback fine-tuning** (§4.3, PDF pp. 10–12; Alg. 2, PDF p. 12):
  - each round, the opponent writes a query for each training question, and an executor runs it on the database; queries that are right are discarded and only wrong ones kept (Eq. 11, PDF p. 11);
  - the main player is trained with SPIN's loss on (gold query, wrong query) pairs: for each, it compares how much likelier the new model makes it than the opponent did, and the loss favours a wider gap in the gold query's favour, scaled by λ (Eq. 14, PDF p. 11). The authors also read it as a penalty on the wrong query and a reward on the gold one (Eqs. 15–16, PDF p. 11);
  - the opponent is then replaced by the newly trained model (§4.3, PDF p. 12).
- **Why filter:** the authors argue SPIN "uses the semantic similarity between SQL queries to distinguish between positive and negative samples" (§1, PDF p. 2), so on all samples it also penalizes the opponent's correct queries that differ in form from the gold one, which "harms the model's robustness" (§3, Eq. 6, PDF p. 7).

## Results

All numbers are execution accuracy; for SPIN and ExSPIN, "the best results across four iterations" (§5.2, PDF p. 13).
- **Main comparison** (Tab. 3, PDF p. 16; DeepSeek-Coder 6.7B), Spider / BIRD: ExSPIN 83.2 / 52.1; SFT 76.3 / 26.7; SPIN 64.2 / 27.1; GPT-4o 76.1 / 46.1; DPO 67.3 / 27.8.
- **Other models** (Figs. 4–5, PDF pp. 14–15): ExSPIN is best "In nearly all cases" (§5.2, PDF p. 14); with Qwen2.5-Coder 14B it reports SFT 83.1 → ExSPIN 86 on Spider and 35.9 → 61 on BIRD (Figs. 4d, 5d).
- **Query types** (Tabs. 1–2, PDF pp. 15–16; Qwen2.5-Coder 14B): the authors find SFT and SPIN struggle with joins without aggregates, aggregates with join and group by, and nested subqueries; ExSPIN leads in every column but one on Spider. Nested subqueries stay its lowest: 78.7 on Spider and 41.9 on BIRD, against SFT's 73.4 and 28.0.
- **Ablation** (§5.5, PDF p. 19; Tabs. 6–7, PDF p. 20): the authors report that schema integration "contributes an 8% improvement", and that execution feedback raised accuracy "from 81.6% to 83.2% on SPIDER and 39.6% to 52.1% on BIRD". Without feedback, accuracy falls from iter0 on (Tabs. 6–7).
- **Iterations** (Tabs. 6–7, PDF p. 20; Figs. 8–9, PDF p. 22): ExSPIN peaks at iter1 (83.2 Spider, 52.1 BIRD) and falls to 78.8 and 44.7 by iter3.
- **λ** (§5.3, PDF p. 16; Figs. 6–7, PDF p. 17), swept from 0.1 to 1.2: a low λ gives "only marginal improvements", and a high one "leads to the over-penalization" of both queries' log probabilities.
- **Case studies** (§5.4, Tabs. 4–5, PDF pp. 17–19): in one example, self-play without feedback turns a correct query wrong; with feedback it stays correct.
- **Cost** (§5.6, Tabs. 8–9, PDF p. 20): on Spider with DeepSeek-Coder 6.7B on four A800 GPUs, an epoch takes 51.25 min for ExSPIN, 203.5 for SPIN and 17.5 for SFT; the authors attribute the gap to training only on the wrong examples, and conclude the method "is more scalable to larger and more complex datasets compared to SPIN".

## Limits the authors state

- Complex nested subqueries and UNION between subqueries stay hard: ExSPIN often oversimplifies or omits subqueries, and its "capability in handling complex nested subqueries requires further improvement" (§5.7 and Tab. 10, PDF p. 21).
- Accuracy falls as iterations go on, which they attribute to training repeatedly on the same dataset, raising "the likelihood of overfitting to the training set after several iterations" (§5.8, PDF p. 21).
- "our method assumes that the distributions of the training and test sets are the same"; biases in the dataset "will inherently limit the potential of the current self-play approach", though they read the Spider test results as "potential resistance to dataset bias" (§5.8, PDF p. 22).
- "compared to SFT, the ExSPIN method consumes more memory and requires longer training times, which is indeed a limitation of our approach" (§5.8, PDF p. 22).

## Open problems and building blocks

- **Open:** methods "such as dataset partitioning" against overfitting in iterative training (§5.8, PDF p. 21); ways "to reduce the computational overhead" (§5.8, PDF p. 22).
- **Released:** the Data Availability Statement says "The original contributions presented in this study are included in the article" (PDF p. 23); no code or data release is stated.
- **To reuse it:** an SFT-trained model; databases to run every opponent and gold query on; the schema item classifier, a BM25 value index, and keys, types and comments (Alg. 1, PDF p. 10); four A800 GPUs for the 6.7B model and eight for ExSPIN on the 14B model (Tabs. 8–9, PDF p. 20).

## On this site

- **Discussed in:** [Self-improvement that compounds](#/challenges/compounding_self_improvement)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/llm-gen">llm-gen</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/nl2sql-data">nl2sql-data</a><a class="tag sub" href="#/tags/rlvr-sql">rlvr-sql</a></span>
