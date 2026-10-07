# Evaluating SQL Understanding in Large Language Models

**Evaluating SQL Understanding in…** · EDBT 2025

Read: [PDF](https://arxiv.org/pdf/2410.10680) · [arXiv](https://arxiv.org/abs/2410.10680) · [DOI](https://doi.org/10.48786/EDBT.2025.74)  
Code: [LLMs_SQL_Understading](https://github.com/AnanyaRahaman/LLMs_SQL_Understading)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Tests LLMs on syntax error detection, missing-token identification, query performance prediction, query equivalence and query explanation, with labelled datasets built from known workloads (abstract).
- Relates performance to query complexity and syntactic features (abstract).
- Its query-equivalence task benchmarks LLMs as SQL equivalence judges on hand-made labelled pairs (§3.2, Tab. 7), like [Can the Rookies Cut…](#/papers/singh2024sqlequiquest "Can the Rookies Cut the Tough Cookie? Exploring the Use of LLMs for SQL Equivalence Checking (2024)"); the authors report that all models struggle with equivalence and performance estimation (abstract).

## In plain words

The paper asks how well large language models "understand" SQL, beyond writing it. The authors argue that a deeper insight into this understanding is crucial for reliable performance in real-world applications where accuracy is essential (§1). They turn real query logs and benchmarks into labelled test sets for five jobs: spotting a syntax error, spotting a missing word, guessing whether a query runs slowly, deciding whether two queries return the same results, and explaining a query in English. They prompt five LLMs without worked examples and study which queries the models get wrong (§1, §3).

They report that GPT4 does best on most tasks and that the models do well at spotting errors and missing words. They conclude that "all models struggle with deeper semantic understanding and coherence, especially in query equivalence and performance estimation" (abstract), and that the models generally struggle with longer and more complex queries (§1). The paper presents itself as "an experimental study evaluating the performance of the major LLMs over core SQL tasks" (§1), not as a new method.

## Background and terms

**Terms to know:** [query equivalence](#/glossary/query-equivalence) · [F1 score](#/glossary/f1-score) · [text-to-SQL](#/glossary/text-to-sql) · [common table expression (CTE)](#/glossary/common-table-expression-cte) · [query optimizer](#/glossary/query-optimizer)

**The paper's own terms:**
- **understanding**: for LLMs, "the model’s ability to perform fundamental tasks at least as proficiently as humans, and potentially even better, across different contexts" (§1).
- **the four skills**: recognition (identifying the object of interest), semantics (how meaning is built and read), context (the scope in which meaning is read) and coherence (the logical links between parts) (§1). Tab. 1 maps each task to two skills, e.g. query equivalence to semantics and coherence.
- **query workload**: "a collection of SQL queries executed against a database, used to simulate real-world usage patterns for performance evaluation and optimization" (§2).
- **syntactic properties**: per-query measures used to explain failures, e.g. `word_count` (length), `table_count`, `column_count` (columns in the SELECT clause), `predicate_count` (conditions in the WHERE clause) and `nestedness` (subquery depth) (§2.1).
- **the tasks**: binary tasks `syntax_error`, `miss_token`, `query_equiv` and `performance_pred` (§3.1.1); multi-class tasks `syntax_error_type`, `miss_token_type`, `query_equiv_type` and the location task `miss_token_loc` (§3.1.2); and `query_exp`, query explanation (§3.1.3).
- **TP, TN, FP, FN**: true and false positives and negatives, the four groups whose queries the failure analysis compares (§4.1). The positive class is the query with an error, the equivalent pair (§1) or the costly query (§3.1.1).
- **MAE and HR**: for `miss_token_loc`, Mean Absolute Error of the predicted word position and Hit Rate, the share of exact hits (§4.2, Tab. 5).
- **weighted accuracy**: for the multi-class tasks, metrics averaged over the types with weights based on the number of queries of each type (§4.1, §4.2).

**Builds on:**
- The workloads it samples (§2, Tab. 2): SDSS, the query log of the Sloan Digital Sky Survey astronomy database; SQLShare, user queries from an open data-sharing platform over many schemas; the Join Order Benchmark, a synthetic workload for testing join-order optimization; and Spider ([Spider](#/papers/yu2018spider "Spider: A Large-Scale Human-Labeled Dataset for Complex and Cross-Domain Semantic Parsing and Text-to-SQL Task (2018)")), a cross-domain text-to-SQL benchmark, used only for query explanation.
- Query-recommendation work (Lai et al. 2023, Zolaktaf et al. 2020), where missing-token imputation and auto-completion are key functions; it motivates the missing-token task (§1).
- Prior reports that LLMs struggle with logical reasoning and numerical computation, which the authors say their results are "consistent with" (§1) and "confirm" (§4.4).

## Problem and setting

- **Question:** how well LLMs "understand" SQL (§1), split into tasks of rising difficulty that each probe some of the four skills (§1, Tab. 1).
- **Queries:** sampled queries: 285 from SDSS (2023 logs), 250 from SQLShare, all 157 of Join-Order and 200 from Spider (Tab. 2). Spider is used only for explanation, the other three for the other tasks (§2).
- **Labels:** syntax errors (six types) and missing tokens (six types: keyword, table, column, value, alias, predicate) are injected or removed at random in randomly chosen queries; the syntax-error set also holds error-free queries (§3.1.1, §3.2). Equivalent and non-equivalent pairs are made by hand-modifying selected queries, keeping non-equivalent pairs similar so that surface differences don't give the answer away (§1, §3.2). Performance labels come from SDSS runtime logs: a query running longer than 200 ms is costly, a threshold chosen from Fig. 5 (§3.2).
- **What "equivalent" means:** two queries "return the same result for all database instances" (§1), or have "the same schema and produce the same results" (§3.1.1). The authors name query optimization and query recommendation as the uses that make equivalence important (§1). Set versus bag semantics, NULLs, and how labels were checked (e.g. by running the queries): not discussed.
- **Models:** GPT3.5 and GPT4 (OpenAI), Gemini (Google), Llama3 (Meta) and MistralAI (§3.3). The authors "focused exclusively on zero-shot learning" and used neither few-shot examples nor fine-tuning (§3.4 "Zero-Shot, Few-Shot, and Fine-Tuning"). Exact model versions, decoding settings and repeated runs: not discussed.

## Approach

- **Tasks and examples (§3.1).** The six syntax-error types cover misused aggregates and HAVING, an inner query returning several rows that the outer query doesn't handle, incompatible types in a condition, and undefined or ambiguous aliases (Listing 1). §3.1.1 says it studies ten equivalence and eight non-equivalence types, then "We study four types of non-equivalent transformations"; it lists four of each (e.g. join turned into a subquery, rewriting with a CTE, reordering WHERE conditions; changing an aggregate, the join type, AND to OR, or a constant), with examples in Listing 2, and points to its repository for the full list.
- **Prompts (§3.4 "Prompt Tuning").** LLMs generated candidate prompts, the authors refined them by hand, and mock experiments on a subset of the data picked the best one per task, e.g. "Are the following two queries equivalent (do they produce the same results on the same database schema)? If yes, why are they equivalent?"
- **Reading the answers (§3.4 "Handling LLM Output").** Scripts extract labels from answers that follow predictable patterns; for more complex or less structured outputs, "manual intervention is still necessary to ensure accuracy".
- **Failure analysis (§4.1).** Two hypotheses per task: failures depend on syntactic properties (the property's distribution across TP, TN, FP and FN, e.g. Fig. 6), or on the error, token or equivalence type (the share of FN per type, e.g. Fig. 7).
- **Query explanation (§3.1.3, §4.5).** "Our analysis is qualitative rather than quantitative": the authors read the models' one-sentence explanations against Spider's descriptions and discuss four failures (Listing 3).

## Results

- **Overall (§4).** GPT4 "consistently outperforms other models, with no clear runner-up in most cases", which "may be because of the larger model size".
- **Syntax errors (§4.1, Tab. 3).** Detection F1 is 0.93–0.97 for GPT4 against 0.68–0.80 for Gemini across the three workloads; GPT4, GPT3.5 and MistralAI do well, Llama3 and Gemini struggle. Across all models, recall tends to be lower than precision. The authors read Fig. 6 (Llama3 and Gemini on SDSS) as suggesting that longer queries are more prone to misclassification; they observed no similar pattern for any other property. Which error types the models struggle with "largely depend on the specific dataset": type mismatches in SDSS, ambiguous aliases in SQLShare, nested-query mismatches in Join-Order (Fig. 7). Overall, naming the error type scores lower than detecting it.
- **Missing tokens (§4.2, Tab. 4–5).** Detection scores higher than syntax-error detection, and Llama3 improves here; naming the token type is harder for all models, with MistralAI consistently second. For the location, GPT4's hit rate is 0.56–0.63 against at most 0.42 for any other model (Tab. 5). On SQLShare, for the model and property pairs shown, missed queries have higher average word, predicate, nesting and table counts than correctly flagged ones (Fig. 8).
- **Performance prediction (§4.3, Tab. 6).** On SDSS, F1 ranges from 0.90 for GPT4 to 0.62 for MistralAI. Recall is generally above precision: the models tend to predict that queries will take longer to run, and, as shown for MistralAI, longer queries and queries with more columns lead to more false alarms (Fig. 10).
- **Equivalence (§4.4, Tab. 7).** Binary F1 lies between 0.88 and 0.99 for every model and workload, and most models show very few or no FN; GPT4 makes 5, 4 and 9 FP on SDSS, SQLShare and Join-Order and no FN. A common feature of the FP pairs is a modified condition, such as a changed constant or AND turned into OR, which the authors take to show that "LLMs struggle with logical reasoning and numerical manipulation". These problems become more pronounced in more complex queries: in Join-Order, all FP across models are on queries with over 19 predicates (Fig. 12). Overall, naming the equivalence type is harder, except for GPT4.
- **Explanation (§4.5).** The models may capture parts of a query but often miss or misread key details, e.g. GPT4 omitting the selected columns, or Llama3 reading `ORDER BY … ASC LIMIT 1` as "fastest" instead of slowest acceleration.

## Limits the authors state

- Only SDSS has ground-truth runtimes, so performance prediction is tested on SDSS alone (§3.1.1, §4.3).
- The performance queries "are selected from more complex, lengthy queries" in SDSS, which raises the chance of a costly label (§4.3).
- Where a confusion group (e.g. FP) holds too few queries, no conclusion is drawn for it (§4.1, §4.2).
- Zero-shot only, by design: the goal was to study the models "in their raw form" (§3.4).
- Query explanation is assessed qualitatively, by manual review (§3.1.3).

## Open problems and building blocks

  - "As next steps, we will explore fine-tuning to handle query complexity and dynamic prompt tuning (to improve accuracy), and barriers to using LLMs for query recommendation and query optimization." (§6) They anticipate these "could significantly mitigate current limitations in handling complex queries" (§6).
  - Training with more diverse query types "could reduce this bias" towards overestimating runtimes (§4.3 takeaway); equivalence errors point to "the need for better SQL logic comprehension in LLMs" (§4.4 takeaway).
- **Released:** "Our SQL task-driven data benchmark is publicly available." (§1, footnote 1). The full list of equivalence and non-equivalence types is in the authors' repository (§3.1.1).
- **To reuse it:** the five models, the prompts and some manual reading of answers (§3.4), and runtime logs for performance labels (§3.1.1).

## On this site

- **Discussed in:** [Sourcing realistic, hard query pairs](#/challenges/query_pair_sourcing) · [The self-improving SQL ↔ text ↔ verify loop](#/challenges/sql_text_round_trip_loop)
- **Tags:** <span class="tags"><a class="tag" href="#/tags/dbtask">dbtask</a><a class="tag sub" href="#/tags/judge-sql">judge-sql</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/pairs-check">pairs-check</a></span>
