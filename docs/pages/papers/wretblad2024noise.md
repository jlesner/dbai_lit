# Understanding the Effects of Noise in Text-to-SQL: An Examination of the BIRD-Bench Benchmark

**Understanding the Effects of…** · ACL 2024 (short papers)

Read: [PDF](https://arxiv.org/pdf/2402.12243) · [arXiv](https://arxiv.org/abs/2402.12243) · [DOI](https://doi.org/10.18653/v1/2024.acl-short.34)  
Code: [text-to-SQL-noise](https://github.com/niklaswretblad/the-effects-of-noise-in-text-to-SQL)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Two authors annotate every question and gold query of BIRD's financial-domain dev set (106 pairs) and 20 sampled pairs from each of four other domains for six kinds of noise, among them spelling or syntax errors, vague questions and incorrect gold SQL (§3.1–3.2; Tab. 1–2).
- Re-runs zero-shot GPT-3.5 and GPT-4, and DIN-SQL and MAC-SQL on GPT-3.5, on the original financial pairs, on a copy with the gold SQL corrected, and on one with the questions corrected too, in a single evaluation each (§3.3; §5, Fig. 2).
- An early measurement of wrong gold queries in BIRD, a precursor of [Pervasive Annotation Errors Break…](#/papers/jin2026annotation "Pervasive Annotation Errors Break Text-to-SQL Benchmarks and Leaderboards (2026)"): the authors report erroneous gold queries in 22 of the 106 financial pairs (Tab. 1), and that with corrected gold SQL the zero-shot baselines outperform DIN-SQL and MAC-SQL (§5; the released corrected-SQL set differs from the paper's description), a result on those 106 pairs only.

## In plain words

Text-to-SQL benchmarks score a model's query against the answer of a human-written reference query. The authors ask how often BIRD-Bench, a widely used benchmark, has flawed questions (typos, vague wording) or wrong reference queries, and what that does to model rankings. Their motivation: for a benchmark to judge properties such as noise handling, "the data must be valid and inform us in what areas a model can be improved" (§1).

Two authors hand-checked all 106 question-query pairs of one domain (banking) and 20 sampled pairs from each of four other domains, sorted the flaws into six kinds, and corrected the data (§3). They report flaws in 52 of the 106 banking pairs, with a wrong reference query in 22 of them (20.7%) (Tab. 1). On the banking pairs with reference queries corrected, zero-shot GPT-3.5 scored 41.51% against 38.68% for each of two multi-step prompting methods on the same model, one of which led on the original data (Fig. 2, §5; one evaluation each). The paper presents itself as "an in-depth analysis" of a benchmark (abstract), not as a new method.

## Background and terms

**Terms to know:** [text-to-SQL](#/glossary/text-to-sql) · [gold query](#/glossary/gold-query) · [execution accuracy](#/glossary/execution-accuracy) · [schema linking](#/glossary/schema-linking) · [many-to-many relationship](#/glossary/many-to-many-relationship)

**The paper's own terms:**
- **noise**: two senses. BIRD-Bench's intended noise is "dirty and noisy database values" in the stored data (abstract, §1). This paper's noise is in the questions and the gold queries, "such as ambiguous questions and syntactical errors" (abstract); its noise types include "Incorrect SQL" (Tab. 2).
- **the six noise types** (Tab. 2; examples and descriptions in App. A.4): **Spelling/Syntactical Errors**, grammar that makes a question hard to interpret (Example 1, Fig. 5); **Vague/Ambiguous Questions**, e.g. a question that leaves open which columns to return (Example 2, Fig. 6); **Incorrect SQL**, a wrong gold query (Example 3, Fig. 7, the same case as Fig. 1); **Synonyms**, a word such as "sum" that is both an SQL keyword and a plain descriptor, which led DIN-SQL to sum transactions when the intent was the transaction's balance or amount (Example 4, Fig. 8); **String Capitalization**, a question that capitalizes a value differently from how the database stores it, which matters because, the authors write, SQL compares string values case-sensitively (Example 5, Fig. 9); **Question does not map to DB**, a question the database cannot answer, such as one about client salaries the database doesn't hold (Example 6, Tab. 4).
- **the three datasets** (§3.2, §5, Fig. 2): the original financial pairs ("Original Data"), a copy with the gold queries corrected ("Corrected SQL"), and a copy with both the gold queries and the noisy questions corrected ("Corrected Data").
- **hint**: BIRD-Bench's per-question extra information (the prompt's `evidence` field), standing in for the documentation that would explain a schema; every model in the paper receives it (App. A.1, App. A.3).
- **noise labels**: per-item labels saying which noise type an item has; the authors note BIRD-Bench lacks them (§4) and propose adding them (§6).

**Builds on:**
- BIRD-Bench ([BIRD](#/papers/li2023bird "Can LLM Already Serve as A Database Interface? A BIg Bench for Large-Scale Database Grounded Text-to-SQLs (2023)")), a text-to-SQL benchmark with large and dirty database values, questions that need external knowledge, and a query-efficiency score, the dataset examined here (§2, §3.1).
- The contemporaneous MAC-SQL paper of Wang et al. (2023), which "shows that ambiguous questions and incorrect SQL queries exist in BIRD-Bench"; the authors say it does not study how noise varies across domains or how it affects model performance (§2).
- The prompting methods DIN-SQL (Pourreza and Rafiei, 2023) and MAC-SQL (Wang et al., 2023), which chain prompts over sub-problems such as schema linking, query decomposition and refinement of the model's output (§2, §3.3).
- Earlier benchmarks: WikiSQL (single-table queries with simple SELECT and WHERE, no joins or nesting), Spider ([Spider](#/papers/yu2018spider "Spider: A Large-Scale Human-Labeled Dataset for Complex and Cross-Domain Semantic Parsing and Text-to-SQL Task (2018)"); complex queries that require understanding the schema), and Spider variants with noisy questions (Gan et al., 2021a) and domain-specific questions (Gan et al., 2021b) (§1, §2).

## Problem and setting

- **The question:** how much noise is in BIRD-Bench's questions and gold queries, how it varies across domains and noise types, and how it changes model accuracy and ranking (§1).
- **Data:** the financial domain of BIRD-Bench's development set, 106 question-query pairs over eight tables, chosen because annotation is time-consuming and BIRD-Bench is large; also motivated by a collaboration with the Swedish bank SEB (§3.1, footnote 2; schema in App. A.1, Fig. 3). Four more domains (California Schools, Superhero, Toxicology, Thrombosis Prediction), 20 randomly sampled questions each, were picked by question difficulty and DIN-SQL accuracy to validate the financial analysis (§3.1, App. A.2, Fig. 4).
- **Annotation:** all questions and SQL queries in these domains, annotated independently by two authors "fluent in English and experts in SQL" (§3.2). How disagreements between the two were resolved, and any agreement rate, are not discussed.
- **Models:** zero-shot prompting with GPT-3.5 and GPT-4; DIN-SQL and MAC-SQL with GPT-3.5 only, "since chaining prompts with GPT-4 was outside of the available resources for this project" (§3.3). They were chosen as "the highest-performing publicly available models on BIRD-Bench at the time of writing" (§3.3). The zero-shot prompt gives the schema as SQL table-creation statements, the question and the hint, and asks for valid SQL, mentioning SQLite (§3.3, App. A.3, Listing 1).
- **What counts as correct:** Fig. 2 reports "Accuracy"; the gold queries generate the "gold reference answers" (§4). The paper does not spell out the comparison further for its own runs (App. A.2 calls DIN-SQL's per-domain score execution accuracy).

## Approach

- **Annotate and group** (§3.2): the annotators checked every question and gold query for errors, then grouped the errors by similarity into the six types and named them after their shared properties (Tab. 2).
- **Correct** (§3.2): from the annotations they built the two corrected datasets, one with corrected SQL and one with corrected SQL and corrected questions.
- **Re-evaluate** (§5): the four configurations (zero-shot GPT-3.5, zero-shot GPT-4, DIN-SQL and MAC-SQL on GPT-3.5) run on the three financial datasets, "a single evaluation for all models on all datasets".
- **Example of a wrong gold query** (Fig. 1, App. A.4 Example 3): for "What is the average loan amount by male borrowers?", the gold query joins clients to accounts by their district, so accounts get matched to clients who merely share a district; the corrected query links them through the `disp` table, which holds the many-to-many link between clients and accounts (App. A.1).

## Results

- **Noise appears in every studied domain** (§4, Tab. 1): the authors report noise in 52 of 106 financial pairs (49%), 44 with a noisy question and 22 (20.7%) with an erroneous gold query; a pair can have both (Tab. 1 caption).
- **It varies by domain** (§4, Tab. 1): the financial domain is highest, closely followed by California Schools (45% of its sampled pairs), and Superhero is lowest (15%). The authors note Superhero "had the highest accuracy while having a similar distribution of question difficulties" (DIN-SQL's accuracy, §3.1, Fig. 4), which "could indicate that model accuracy across tasks correlates with noise" (§4).
- **It is uneven across types** (§4, Tab. 2): in the financial domain they count 72 errors, led by spelling/syntactical errors (23), incorrect SQL (22) and vague questions (17). While this "could be the real-world distribution", they say it "might unfairly bias the benchmark towards models better at handling syntactical errors", and that without noise labels "the benchmark does not inform which noise types are challenging for current models and how models should improve" (§4).
- **Rankings change when gold queries are fixed** (§5, Fig. 2, financial domain, one run each): on the original data MAC-SQL is slightly ahead (39.62%, against 34.91–38.09% for the others); with corrected SQL, zero-shot GPT-3.5 (41.51%) and zero-shot GPT-4 (48.11%) both beat DIN-SQL and MAC-SQL (38.68% each). The authors conclude "it is relevant to question if BIRD-Bench is a reliable assessor of models" (§5).
- **Fixing the questions too** (§5, Fig. 2): "the accuracy of all models increases significantly"; zero-shot GPT-4 is best (55.66%) and the others are close, with DIN-SQL slightly ahead. Some models gain more than others, which the authors say "might suggests that the types of noise also affects models differently" (§5).

## Limits the authors state

- The analysis covers mainly the financial domain, so generalizability "may be limited"; the small samples from other domains "may represent only some of the noise distribution across domains" (Limitations).
- "annotators may have introduced subjective bias during noise annotation, even though we attempt to minimize this by having two independent annotators" (Limitations).
- "our decision to categorize noise into six specific classes might have oversimplified the complexity and diversity of noise types in these benchmarks" (Limitations).
- Only two models and three prompting methods were used; a wider set "might have given a more comprehensive understanding" (Limitations). Chained prompting with GPT-4 was outside their resources (§3.3).
- "the substantial effort required to correct SQL queries and noisy questions in the dataset may have introduced errors despite the review process", which might influence the accuracies reported on the corrected datasets (Limitations).

## Open problems and building blocks

  - "a significant improvement would be to label noise types across the dataset" (§6).
  - Future work: "we plan to study how large language models can be applied to noise classification, a new task that could also be critical in systems where Text-to-SQL is employed" (§6).
  - Whether noise types affect models differently "needs to be studied further" (§5).
  - The authors call for benchmarks "that can guide researchers in designing models that are more resistant to noise" (§6).
- **Released:** "All datasets, annotations, and code are available at this URL." (abstract); "We have published all annotations and cleaned datasets." (§3.2, footnote 4); the code for running the experiments is "publicly accessible" (§3.3, footnote 4).
- **To reuse it:** two annotators "fluent in English and experts in SQL", and human annotation the authors call time-consuming (§3.1, §3.2); GPT-3.5 and GPT-4 access (§3.3). The per-domain DIN-SQL results used to pick domains were provided by DIN-SQL's creators (§3.1, footnote 3).

## On this site

- **Tags:** <span class="tags"><a class="tag" href="#/tags/labels">labels</a><a class="tag sub" href="#/tags/llm-gen">llm-gen</a><a class="tag sub" href="#/tags/nl2sql-data">nl2sql-data</a></span>
