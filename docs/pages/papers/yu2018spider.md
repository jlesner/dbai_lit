# Spider: A Large-Scale Human-Labeled Dataset for Complex and Cross-Domain Semantic Parsing and Text-to-SQL Task

**Spider** · EMNLP 2018

Read: [PDF](https://arxiv.org/pdf/1809.08887) · [arXiv](https://arxiv.org/abs/1809.08887)  
Code: [spider](https://github.com/taoyds/spider)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Cross-domain text-to-SQL: complex queries over many databases, with unseen databases at test time.
- Exact-set-match evaluation (later test-suite accuracy, [Semantic Evaluation for Text-to-SQL…](#/papers/zhong2020testsuite "Semantic Evaluation for Text-to-SQL with Distilled Test Suites (2020)")).
- The other shared benchmark; its exact-match metric is the weak equivalence check test suites replaced.

## In plain words

[Text-to-SQL](#/glossary/text-to-sql) turns an English question about a database into an SQL query that answers it. The authors argue that earlier datasets were either small, with the same queries in training and test, so models could succeed by "memorizing the patterns of question and program pairs", or, like WikiSQL, large but limited to simple single-table queries (§1). They built Spider: 10,181 questions and 5,693 complex SQL queries over 200 multi-table databases, written by students (abstract). Test databases and queries are unseen in training (§1); scoring is by Exact Matching, a clause-by-clause comparison with the reference query that ignores order within a clause and leaves out values (§6). Five adapted neural models score low: the best "achieves only 12.4% exact matching accuracy on a database split setting" (abstract), against 33.0% for the best model when examples are split at random, so test databases can appear in training (Tab. 2). They present a new dataset and task, calling Spider "the only one text-to-SQL dataset that contains both databases with multiple tables in different domains and complex SQL queries" (Tab. 1 caption).

## Background and terms

**Terms to know:** [semantic parsing](#/glossary/semantic-parsing) · [gold query](#/glossary/gold-query) · [exact match](#/glossary/exact-match) · [execution accuracy](#/glossary/execution-accuracy) · [F1 score](#/glossary/f1-score) · [integrity constraint](#/glossary/integrity-constraint) (here, foreign keys: a column whose values point to rows of another table) · [nested query (subquery)](#/glossary/subquery-nested-query) (Fig. 1 shows one)

**The paper's own terms:**
- **Cross-domain task**: a model gets a question and the database schema and must predict SQL for queries and databases it did not see in training (§1, §5).
- **Example split / database split** (§8): in the example split, examples are randomly split into 8659 train, 1034 dev and 2147 test, and "Questions for the same database can appear in both train and test". In the database split, 206 databases are split into 146 train, 20 dev and 40 test, with all questions of a database in one split. Questions and queries from six older datasets "that follow our annotation protocol" were added to the training data (§8).
- **Component Matching** (§6): for each of `SELECT`, `WHERE`, `GROUP BY`, `ORDER BY` and `KEYWORDS` ("including all SQL keywords without column names and operators"), prediction and gold are broken into sub-components and checked for an exact match as sets; each component's score is reported as F1.
- **Exact Matching** (§6): a prediction is correct "only if all of the components are correct"; the per-clause set comparison means column order inside a clause doesn't matter, and value strings are not compared. In the glossary's terms, this is Spider's exact set match variant of exact match.
- **Execution Accuracy** (§6): running the query, with "a list of gold values for each question" given for the model to fill into its SQL; the authors "do not provide Execution Accuracy in the current version".
- **Hardness levels** (§6): easy, medium, hard and extra hard, defined "based on the number of SQL components, selections, and conditions"; Fig. 3 gives one example per level.

**Builds on:**
- WikiSQL (Zhong et al., 2017), a large text-to-SQL dataset whose test databases are unseen in training, but with single-table databases and SQL labels covering only one `SELECT` column with aggregation and `WHERE` conditions (§2). Not on this site.
- Finegan-Dollak et al. (2018), who split a dataset by programs so no query appears in both train and test, and found that models then "fail to generalize to unseen programs" (§1, §2). Not on this site.
- Eight older single-database datasets (ATIS, GeoQuery, Scholar, Academic, IMDB, Yelp, Advising, Restaurants), compared in Tab. 1 (§2).
- The §7 baselines: sequence-to-sequence models (Sutskever et al., 2014; Dong and Lapata, 2016; Jia and Liang, 2016), SQLNet (Xu et al., 2017) and TypeSQL (Yu et al., 2018). None is on this site.

## Problem and setting

- **Question:** can a model generalize "not only to new programs but also to new databases" (§1), when questions need multi-table SQL such as joins, `GROUP BY` and nested queries?
- **Databases** (§3.1): 200 databases over 138 domains. About 70 come from college database courses, SQL tutorial websites, online csv files and textbook examples; about 40 are schemas from DatabaseAnswers, converted to SQLite and filled with a population tool; 90 were built from WikiSQL tables, with foreign keys added. Abbreviated column names were "manually changed … back to regular words so that the system only handled semantic parsing issues".
- **Annotation** (§3.2–3.5, Fig. 2): students proficient in SQL are asked to write 20–50 questions per database, covering a listed set of SQL components; when several equivalent queries are possible, the protocol picks one query pattern (§3.2 B). Other annotators review the SQL and the English, and a final step runs "a script to execute and parse all SQL labels to make sure they are correct" (§3.5). The whole took "around 1,000 hours of human labor in total" (§3).
- **Assumptions** (§5): values are not evaluated; some queries that need outside knowledge, such as common-sense inference and math calculation, are excluded; table and column names are assumed "clear and self-contained". The authors call the task "more realistic than prior work" (§5).
- **What "correct" means:** a match with the one gold query under Exact Matching, values left out (§6). How Execution Accuracy would compare result tables (sets or [bags](#/glossary/bag-semantics), which keep duplicates; row order) is not discussed.
- **Size against older datasets:** the authors report that Spider has "about twice more nested queries and 10 times more ORDER BY (LIMIT) and GROUP BY (HAVING) components than the total of previous text-to-SQL datasets" (§4, Tab. 1).

## Approach

- **Building the corpus** (§3, Fig. 2): five steps, from collecting and creating databases through annotation, SQL review, and question review with paraphrasing, to a final review. Annotators wrote queries in a web interface (sqlite_web) that shows the schema and contents and runs SQL (§3.2 "Annotation tools"). No templates or scripts generated questions (§3.2).
- **Question rules** (§3.2): for each database, annotators are asked to write queries that cover `SELECT` with several columns and aggregations, `WHERE`, `GROUP BY`, `HAVING`, `ORDER BY`, `LIMIT`, `JOIN`, `INTERSECT`, `EXCEPT`, `UNION`, `NOT IN`, `OR`, `AND`, `EXISTS`, `LIKE` and nested queries; questions that are "vague or too ambiguous" or "require knowledge outside the database" are left out.
- **Metrics** (§6): Component Matching, Exact Matching, and accuracy by hardness level; Execution Accuracy is described but not reported. When `JOIN` and `GROUP` appear, evaluation "considers multiple acceptable keys" (e.g. either of two linked id columns in `GROUP BY`).
- **Baselines** (§7): all models get a "big" column list, the columns of all tables of the question's database concatenated.
  - Seq2Seq, a basic sequence-to-sequence neural network that writes the query token by token, and its variants Seq2Seq+Attention and Seq2Seq+Copying (copying input words into the output); a vocabulary mask limits them to SQL keywords and the current database's table and column names.
  - SQLNet, which fills slots of a fixed query sketch using column attention, extended by the authors from `SELECT` and `WHERE` to `ORDER BY` and `GROUP BY`.
  - TypeSQL, which builds on SQLNet and adds types for question words taken from the database content; "the only model that uses database content".

## Results

Test-set Exact Matching accuracy (Tab. 2) and Component Matching F1 (Tab. 3).

- **Overall** (§8, Tab. 2): on the example split the best model is TypeSQL; on the database split the best is SQLNet at 12.4%, and TypeSQL falls from 33.0% to 8.2%, which the authors read as doing "well on complex SQL prediction but fails to generalize to new databases". "For all models, the performance under database split is much lower than that under example split" (§8).
- **By hardness** (Tab. 2): the table breaks accuracy down by level; for example, on the database split SQLNet goes from 26.2% on easy to 1.3% on extra hard queries.
- **Seq2Seq models** (§8): "very low"; they can produce nested queries and get "a few hard and extra hard examples correct", but "in the vast majority of cases, they predict invalid SQL queries with grammatical errors". Attention and copying "do not help much".
- **SQLNet and TypeSQL** (§8): they "significantly outperform other Seq2Seq models", but cannot produce nested queries or queries with keywords such as `EXCEPT` and `INTERSECT`, since they restrict outputs to "fixed pre-defined SQL structures".
- **Components** (§8, Tab. 3): "all models struggle with WHERE clause prediction the most"; most errors per component come from column prediction, and all models do "much poorer on column selection under database split".
- **Schema size** (§8, Fig. 4): plotting accuracy against the number of foreign keys per database for TypeSQL and Seq2Seq with Attention, the authors report that "The performance decreases as the database has more foreign keys".

## Limits the authors state

- Ambiguous questions were left out, though "We recognize that ambiguous questions appear in real-world natural language database interfaces"; future work "needs to address this issue by having multi-turn interactions" (§3.2 C).
- Questions needing common-sense knowledge outside the database were left out, as "a future research direction" (§3.2 C); §5 adds that some queries needing math calculation are excluded.
- Values are not generated or scored; the authors call predicting condition values without user interaction "unrealistic" (§5).
- Table and column names are assumed "clear and self-contained", with abbreviations rewritten by hand (§5).
- Exact Matching "is possible to provide false negative evaluation when the semantic parser is able to generate novel syntax structures" (§6); Execution Accuracy "can create false positive evaluation" when a wrong query returns the same result, and is not provided "in the current version" (§6).

## Open problems and building blocks

- **Open:** the task "requires more effective methods to encode the relation of tables with foreign keys" (§8); "there is still a large room for improvement" (§8).
- **Released:** the dataset and task are "publicly available" (abstract); the authors "will release the official evaluation script along with our corpus" (§6), with task updates on their website (§6, footnote 4).
- **To reuse it:** models take the question and the database schema as input (§1); for execution, the gold values of each question are given (§5).

## On this site

- **Discussed in:** [Text-to-SQL can't be verified against intent](#/challenges/text_to_sql_verification)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/nl2sql-eval">nl2sql-eval</a></span>
