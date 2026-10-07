# TAPEX: Table Pre-training via Learning a Neural SQL Executor

**TAPEX** · ICLR 2022

Read: [PDF](https://arxiv.org/pdf/2107.07653) · [arXiv](https://arxiv.org/abs/2107.07653)  
Code: [Table-Pretraining](https://github.com/microsoft/Table-Pretraining)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Table pretraining by learning a neural SQL executor (abstract).
- The corpus is synthesized: executable SQL queries and their execution results (abstract).
- A precedent for training a model on execution-generated labels.

## In plain words

The authors say pre-training on tables is hard "due to the absence of large-scale high-quality tabular data" (abstract): Web-mined text is noisy, and hand-written templates are usually costly and often lack diversity (§1). TAPEX generates its own training data instead. It fills SQL query templates with column names and cell values from nearly 1,500 real tables, runs each query on an ordinary database engine, and trains a pre-trained text model (BART) to output the result, given the query and the table as text. The model is then fine-tuned to answer questions about tables and to check statements against them.

The authors report new best results on all four table benchmarks they use (abstract). On WikiTableQuestions, which needs more complex reasoning than their simplest benchmark (§4), it answers 57.5% of test questions correctly (median of five runs), against 52.7% for the best earlier system and 38.0% for BART without the extra pre-training (§4.1). They claim a first: "To our knowledge, this is the first work to exploit table pre-training via synthetic executable programs" (abstract).

## Background and terms

**Terms to know:** [text-to-SQL](#/glossary/text-to-sql) · [semantic parsing](#/glossary/semantic-parsing) · [masked language modeling (MLM)](#/glossary/masked-language-model) (the authors say earlier table pre-training often used variants of it, §1).

**The paper's own terms:**
- **table pre-training**: further pre-training a language model so that it understands tables before it is fine-tuned on table tasks (§1).
- **TAPEX** (Table Pre-training via Execution): the method and model (§1).
- **neural SQL executor**: a language model trained to produce the result a SQL engine would return for a query on a table (§3.1).
- **executability of tables**: tables support discrete operations (e.g. summing a column) through a language like SQL; free text does not (§1, §3.1).
- **TableQA**: table-based question answering; the output is a list of cell values or numbers computed from them, which for semi-structured tables may be normalized forms (e.g. 2k to 2,000) (§2.1).
- **TableFV**: table-based fact verification; the output is a binary decision, "entailed or refused" (§2.1).
- **flattened table**: the table written as one token sequence: a `[HEAD]` marker and the column headers, then `[ROW]` with a row number before each row, cells separated by a vertical bar (§2.2).
- **generative fine-tuning**: both tasks as text generation: the encoder reads the sentence followed by the flattened table; the decoder writes the answers, comma-separated, which the authors say lets the model "support (almost) all operators and their compositions in TableQA"; for TableFV a binary classifier on the decoder's last token decides (§2.2, Fig. 2).
- **vanilla and multi-task fine-tuning**: fine-tuning on the target task alone, or first on a related task and then on the target (§2.2).
- **SQL template**: a query with placeholders for column names and values, e.g. `SELECT num1 WHERE text1 = val1` with a numeric column, a text column and one of its cell values (§3.2).
- **SQL difficulty levels**: Easy, Medium, Hard and Extra Hard by the number of SQL elements (keywords, headers, cell values) in a query, cut at 6, 14 and 20 elements (App. C.1).

**Missing glossary terms:**
- **denotation accuracy**: the share of questions whose predicted answer(s) equal the gold answer(s); it compares answers, not queries (§4 "Dataset and Evaluation").

**Builds on:**
- BART, a pre-trained encoder-decoder language model, as backbone (Large configuration) (§1, §2.2).
- Earlier table pre-training on Web-mined or template-synthesized text, often with MLM variants: TaPaS, TaBERT and GraPPa, the efficiency comparison's baselines (§1, §5 "The Efficiency of Pre-training").
- Squall, SQL annotations for WikiTableQuestions questions, the source of the templates, filled in the manner of Zhong et al. (2020) (§3.2; App. C.1).

## Problem and setting

**Question:** can a model learn to understand tables by learning to execute SQL on synthetic data, and does that help downstream table tasks (§1)?

**Assumptions:**
- Examples generally pair one sentence (in pre-training, one SQL query) with one table; flattening fails for a table "too large to fit in memory" (§2.1, §5 "Limitations").
- Each query fills a Squall template from one sampled table (§3.2). The typical operators App. D lists (Fig. 9) are select, filter, aggregate, superlative, arithmetic, comparative, group, sort, and union or intersection.
- Labels come from "an off-the-shelf SQL executor (e.g., MySQL)" (§3.1). Queries with empty results are discarded "because empty results do not reflect much information about the executability of tables" (§3.2).
- Pre-training tables: nearly 1,500 tables chosen at random from the WikiTableQuestions training set. The authors state that none of them appear in the dev or test sets of any downstream task (§3.2 "Table Source").
- Benchmarks (§4 "Dataset and Evaluation"; App. A Tab. 6): WikiSQL-Weak (the weakly supervised version of WikiSQL; its questions need only filtering and optional aggregation of cell values), WikiTableQuestions (questions needing more complex reasoning), SQA (conversational question sequences) and TabFact (fact verification). WikiSQL-Weak uses TaPaS's answer annotations because, the authors say, some answers from the official evaluation script are incorrect.
- Correctness: denotation accuracy for TableQA, accuracy for TabFact; medians of five random runs (§4.1).
- Answer order, duplicates and NULLs in query results: not discussed.

## Approach

- **Pre-training task** (§3.1, Fig. 3): the encoder reads a SQL query followed by a flattened table; the decoder is trained to output the query's execution result. SQL execution is the **only** pre-training task. The authors' reasoning, stated as a belief: if a model can be trained to execute queries faithfully and produce correct results, "then it should have a deep understanding of tables" (§3.1).
- **Corpus** (§3.2 "Query Sampling"): each template is filled by sampling headers and cell values uniformly from a sampled table; up to 5 million query–result pairs are generated (§4 "Implementation Details").
- **Training** (§4 "Implementation Details"): pre-training up to 50,000 steps at batch size 256, about 36 hours on 8 Tesla V100 GPUs; fine-tuning up to 20,000 steps.

## Results

All results are the authors', on the 5-million-pair setting unless they say otherwise (§4 "Implementation Details").

- **Main results** (§4.1, test sets):
  - WikiSQL-Weak: 89.5% against 85.8% for BART and 87.2% for the best earlier system, which the authors note already used execution-guided decoding (running candidate SQL during inference) (Tab. 1).
  - WikiTableQuestions: 57.5% against 52.7% (GraPPa) and 38.0% for BART; they conjecture BART's low score could come from the small amount of training data, and say the gain over BART indicates that "in the low data regime" the gains are "often more significant" (Tab. 2).
  - SQA: 74.5% over all questions against 71.0% for the best earlier system; the authors call it "a surprise to us", as the pre-training has no conversational context (Tab. 3). On each conversation's first question, earlier systems score higher.
  - TabFact: 84.2% against 81.0%, with gains on all its subsets (Tab. 4).
- **Multi-task fine-tuning** (§4.2; App. B Tab. 8): from BART, a related task first helps "significantly"; from TAPEX, the gain "tends to be marginal".
- **Learned execution** (§5; App. D Fig. 9): on nearly 20,000 held-out queries over unseen tables, TAPEX gives the right result for 89.6% of them; per operator it is lowest on group and sort (Fig. 9).
- **Reasoning by operator** (§5; Tab. 5): on 500 hand-analyzed WikiTableQuestions dev questions it improves over BART on all seven operator types listed.
- **Corpus size** (§5; Fig. 5): more synthetic data "generally brings positive effects"; gains become marginal on WikiSQL-Weak and stay "non-trivial" on TabFact. Their summary: "the scale matters when the downstream task is difficult, or the downstream dataset is relatively small".
- **Efficiency** (§5; Fig. 6): on the WikiTableQuestions dev set, the authors report TAPEX "surpasses existing table pre-training approaches with a much smaller corpus" (Fig. 6 caption). They note part of GraPPa's corpus is human-annotated. The ethics statement contrasts TaBERT's 26 million crawled tables with these 1,500 (§ "Ethics Statement").
- **Query difficulty** (App. C.1; Figs. 7–8): at a fixed 0.5 million examples, adding harder templates helps "in most cases"; the effect is smaller beyond Medium, and Extra Hard queries slightly hurt TabFact.
- **SQL against natural language** (App. C.2; Tab. 11): at 0.5 million examples, pre-training on the same queries translated into English by a SQL-to-text model is "comparable or even worse" than pre-training on SQL; they attribute this to noise in the translations.

## Limits the authors state

- Large tables: the method "cannot ideally handle large tables"; flattening "becomes infeasible when the table is too large to fit in memory", and removing unrelated rows or columns "would decrease downstream performance" (§5 "Limitations").
- Text-to-SQL: "the task of text-to-SQL cannot benefit from our proposed table pre-training"; when tried, TAPEX "does not show a significant advantage over BART". They attribute this to two factors: the synthetic corpus "does not contribute to grounding" (linking words in the question to the table), and table reasoning skills that "may not be necessary for SQL generation" (§5 "Limitations").

## Open problems and building blocks

- **Open:** none stated. App. C is an exploratory analysis "to provide more insights for future work" (§5), on query difficulty and on natural language in pre-training.
- **Released:** "Our code can be found at" the project's repository (abstract); "We will make our code, model, and data publicly available to facilitate future research" (§1).
- **To reuse it:** a sequence-generating language model (BART-Large here; the authors say the method "theoretically applies for any LM as long as it can generate sequence", §2.2), a SQL engine to label queries, SQL templates and a few thousand tables (§3.2), and the training compute in § Approach.
- **Beyond its domain:** the authors say pre-training on synthetic executable programs "has great potential to be extended to other research areas (e.g., knowledge base)" (§7).

## On this site

- **Tags:** <span class="tags"><a class="tag" href="#/tags/dbtask">dbtask</a><a class="tag sub" href="#/tags/general-misc">general-misc</a><a class="tag sub" href="#/tags/llm-misc">llm-misc</a></span>
