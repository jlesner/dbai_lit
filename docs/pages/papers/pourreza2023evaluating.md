# Evaluating Cross-Domain Text-to-SQL Models and Benchmarks

**Evaluating Cross-Domain Text-to-SQL Models…** · EMNLP 2023

Read: [PDF](https://arxiv.org/pdf/2310.18538) · [arXiv](https://arxiv.org/abs/2310.18538) · [DOI](https://doi.org/10.18653/v1/2023.emnlp-main.99)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Re-judges two top Spider models by hand on the dev questions both failed (§6.2) and rewrites Spider, Spider-DK and BIRD reference queries to return all tied rows (§6.1; not all rewrites keep the answer).
- Names the "non-deterministic nature of SQL output" among the reasons gold matching fails (abstract).
- Evidence that execution-match labels are unreliable; a <a class="tag" href="#/tags/nondet">nondet</a> source. It reports that 18% of train and 20–23% of dev queries in Spider, Spider-DK and BIRD are "subject to ties" (§1, Tab. 1): queries that *can* tie, not ties observed (§5.1); the train share recomputes to about 19%.

## In plain words

Text-to-SQL systems turn an English question into a database query, and benchmarks score them against one human-written reference query per question. The authors argue that this matching fails for various reasons, such as underspecified questions, assumptions built into both the system's and the reference query, and query output that is not deterministic under certain conditions (abstract), e.g. which of several tied rows comes back (§5.1). They study three public benchmarks, rewrite reference queries so that they return all tied rows, and judge by hand the 102 Spider development questions that two top systems both failed under [execution accuracy](#/glossary/execution-accuracy), matching the reference's output (abstract, §6.2). They report that 20%–23% of their development queries are "subject to ties" (§1). On the 102 questions, their hand judgment rated the GPT-4-based system correct more often than the reference queries (§6.2). They present the paper as "a comprehensive evaluation of existing Text-to-SQL benchmarks" (§1) and state that "Our work is the first to systematically study the limitations of these metrics and benchmarks through both human evaluation and query rewriting" (§8).

## Background and terms

**Terms to know:** [text-to-SQL](#/glossary/text-to-sql) · [gold query](#/glossary/gold-query) · [execution accuracy](#/glossary/execution-accuracy) · [nondeterministic query](#/glossary/nondeterministic-query) · [schema linking](#/glossary/schema-linking) · [SQL dialect](#/glossary/sql-dialect) · [query equivalence](#/glossary/query-equivalence) · [undecidable](#/glossary/decidable-and-undecidable) · [exact set match](#/glossary/exact-match) (Spider uses the variant without values, §4)

**The paper's own terms:**
- **execution accuracy**: in this paper, test-suite accuracy: both queries are run on "a carefully selected collection of database instances, known as a test suite", which Spider and the paper call execution accuracy (§4).
- **ties**: several rows qualify equally (Fig. 2: several countries share the smallest population) and only a subset may be returned; which subset "can vary between queries" (§5.1).
- **schema matching**: the paper's name for linking a question's words to tables, columns and cell values (§5.2), i.e. schema linking.
- **LIMIT 1 / LIMIT N**: keep only the first one or N rows of a result (§5.1.1, §5.1.2).

**Builds on:**
- The benchmarks it re-examines (§1, §3): Spider ([Spider](#/papers/yu2018spider "Spider: A Large-Scale Human-Labeled Dataset for Complex and Cross-Domain Semantic Parsing and Text-to-SQL Task (2018)")), a large-scale cross-domain benchmark (databases from many domains) whose queries were written by Computer Science students without templates; Spider-DK, which adds rarely observed domain knowledge to Spider's development set; Spider-SYN, which replaces schema words with synonyms; and BIRD ([BIRD](#/papers/li2023bird "Can LLM Already Serve as A Database Interface? A BIg Bench for Large-Scale Database Grounded Text-to-SQLs (2023)")), a more recent cross-domain benchmark.
- Test-suite accuracy ([Semantic Evaluation for Text-to-SQL…](#/papers/zhong2020testsuite "Semantic Evaluation for Text-to-SQL with Distilled Test Suites (2020)")), the execution metric it examines (§4).
- Earlier work it sets itself apart from (§2): the authors of the text-to-SQL model SQL-PaLM and Lei et al. (2020) note queries that automatic evaluation marked wrong but human annotators judged correct; Zhong et al. (2022) identify limitations of Spider, such as ties and certain syntactic problems, focusing primarily on a subset and without quantifying their extent or impact.
- The two systems it re-judges (§6.2): DIN-SQL, a GPT-4-based prompting method with few-shot demonstrations taken from the train set (§6.2, §7), and T5-large + PICARD, a fine-tuned T5-large model (§1, §7) whose decoding PICARD constrains by parsing incrementally (reference list).

## Problem and setting

- **Question:** where execution accuracy fails a correct query (§5), and how far these problems "affect the benchmarks, our evaluation and the ranking of the models" (§6).
- **Benchmarks and splits:** Spider, Spider-DK and BIRD; the findings "apply to the Spider-SYN dataset as well", which shares Spider's SQL queries (§6). The authors have access only to the train and development sets (§1).
- **What "correct" means:** in the human evaluation, the judgment of two annotators with the schemas, who could create databases to validate queries (§6.2). The authors note that, even with the interpretation fixed, deciding whether a generated query is equivalent to the reference is challenging, citing "the halting problem which is undecidable" (§4).
- **SQL:** the three benchmarks' databases and queries are in SQLite (§6.4); PostgreSQL is used to check them against "SQL standards" (§6.4). Without an ordering, a query's result "is expected to be a set" (§5.1.2). NULLs are not discussed.

## Approach

  - *Ties in output* (§5.1), from four sources: top-1 queries using LIMIT 1 when several rows tie for the top and the question doesn't say how ties should be handled (§5.1.1, Fig. 2); LIMIT N, whose first N rows depend on an ordering that may be absent or tied (§5.1.2); GROUP BY with a selected column that is neither aggregated nor grouped, or a mix of aggregated and plain columns without GROUP BY, which SQLite and MySQL allow and Oracle and DB2 reject (§5.1.3, Fig. 3); and DISTINCT with ORDER BY on a column not selected (§5.1.4).
  - *Ambiguity in schema matching* (§5.2): several columns can answer the question, e.g. a maker's full name or short name (Fig. 1).
  - *Wrong assumptions on database content* (§5.3): a condition omitted on the wrong assumption that it holds for all rows (Fig. 4), or a reference query assuming a column's values are unique when the schema doesn't say so (Fig. 5).
- **Query rewriting (§6.1):** only tie problems are rewritten, since they "adhere to a specific syntax structure". LIMIT 1 queries are rewritten with nested min and max subqueries so that all tied rows come back (Fig. 2); LIMIT n with n > 1 is left unchanged. For GROUP BY, every non-aggregated SELECT column is added to the GROUP BY clause. The rewritten references are scored as predictions against the originals (§6.1).
- **Human evaluation (§6.2):** DIN-SQL and T5-large + PICARD run on Spider's 1,034 development questions; the questions both fail by execution accuracy go, with both systems' queries and the reference, to two annotators, the paper's authors (footnote), blind to each query's source. Inconsistent labels get a second round with the other annotator's explanation.
- **Error analysis (§6.3):** the queries judged wrong fall into five groups: schema, condition, nested, GROUP BY, LIMIT (Fig. 7).
- **Standard SQL validation (§6.4):** the three benchmarks' development databases and queries are migrated from SQLite to PostgreSQL; the queries that fail there include the GROUP BY and ORDER BY tie cases of §5.1.3–5.1.4.

## Results

- **Queries that can tie (Tab. 1, §1):** Table 1 counts queries that "can potentially yield tied rows" (§5.1); §1 reports that "18% of the queries in the train sets and 20%-23% of the queries in the dev sets of these benchmarks are subject to ties".
- **Rewritten references (Tab. 2, §6.1):** scored with the unchanged queries against the original references over the whole development set, the rewritten ones reach execution accuracy 92.3 on Spider, 95 on Spider-DK and 96.87 on BIRD, and exact set match 81.6 on Spider. Execution accuracy is "not as adversely affected as the exact set match accuracy"; the authors "hypothesize that this could be attributed to the absence of ties in the test data" (§6.1). §7 says that "even with a perfect model, achieving a perfect accuracy on these benchmarks is not possible", reading Table 2 as "a lose upper bound for the achievable accuracy by models", expected to be lower considering other issues such as wrong assumptions and schema ambiguity (§7).
- **Human evaluation (Tab. 3, §6.2):** on the 102 questions both systems failed, the annotators judged 81.6% of DIN-SQL's queries correct, 25.5% of T5+PICARD's and 67.3% of the reference queries. The authors say DIN-SQL produced "the highest number of correct answers, surpassing even the ground truth SQL queries" (§6.2). The abstract states that the models' true performance "is underestimated and their relative performance changes after a re-evaluation".
- **Error groups (§6.3, Fig. 7):** schema errors are "the primary issue responsible for the majority of errors", with the reference set showing the fewest, "closely followed by DIN-SQL"; condition errors come second, mostly from T5-PICARD. The reference set has the most GROUP BY errors and DIN-SQL the fewest; on LIMIT, T5-PICARD matches the reference set. §7 concludes that prompting methods "are less affected by the inherent limitations of the training set" but not immune, while fine-tuned approaches such as T5+PICARD "perfectly mirror the distribution of errors seen in the ground truth queries" for nested, LIMIT and GROUP BY.
- **PostgreSQL migration (Tab. 4, §6.4):** the syntax-error, undefined-function and undefined-column failures come from "the different SQL formats supported by Sqlite and PostgreSQL". The authors add that the benchmarks' issues are "not solely confined to syntax".

## Limits the authors state

- The focus was "primarily on cross-domain text-to-SQL benchmarks and models" (§ "Limitations").
- The work "has a limitation regarding the analysis of failure cases that lack a specific structure and require manual effort for detection"; its purpose "was to highlight these failure cases" (§ "Limitations").
- No new dataset: fixing the benchmarks needs "considerable human effort", and changing only the accessible development and training sets would not fix the hidden test sets on which final performance is measured (§1).
- Automating query rewriting faces "inherent challenges" for schema ambiguity, wrong assumptions and ambiguous questions; tie-breaking for LIMIT n with n > 1 "was not straightforward" (§6.1).
- The Table 2 bound is loose "because our rewritings were unable to address cases that required manual intervention" (§7).
- Even after the second round, a few question-query pairs keep inconsistent labels; the main challenge is the "inherent ambiguity in the questions or the subjectivity of interpretations" (§6.2, Fig. 6).

## Open problems and building blocks

- **Open:** "a potential solution is to incorporate multiple SQL queries as the ground truth, each representing a different interpretation that may be valid" (§1; again in §8 as "a promising solution"). The failure cases "are likely to be present" in domain-specific benchmarks too, calling for further analysis there (§ "Limitations"), and "a more in-depth analysis" of the prevalence of the unstructured failure cases (§ "Limitations"). They also stress "additional independent evaluations" when using these benchmarks (§1).
- **Released:** Nothing stated.
- **To reuse it:** the rewriting covers only LIMIT 1 and GROUP BY ties (§6.1); GROUP BY and ORDER BY ties were found by running the queries on PostgreSQL (§5.1.3, §6.4); the human evaluation used SQL experts who could create databases to test queries (§6.2).

## On this site

- **Discussed in:** [Benchmarks with checkable ground truth](#/challenges/checkable_benchmark_ground_truth) · [Equivalence of nondeterministic queries](#/challenges/nondeterministic_equivalence)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/llm-gen">llm-gen</a><a class="tag sub" href="#/tags/nl2sql-data">nl2sql-data</a><a class="tag sub" href="#/tags/nl2sql-eval">nl2sql-eval</a><a class="tag sub" href="#/tags/nondet-eval">nondet-eval</a></span>
