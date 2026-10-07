# Can LLM Already Serve as A Database Interface? A BIg Bench for Large-Scale Database Grounded Text-to-SQLs

**BIRD** · NeurIPS 2023 (Datasets and Benchmarks)

Read: [PDF](https://arxiv.org/pdf/2305.03111) · [arXiv](https://arxiv.org/abs/2305.03111)  
Code: [DAMO-ConvAI](https://github.com/AlibabaResearch/DAMO-ConvAI)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- A large text-to-SQL benchmark over big, dirty real-world databases, with external-knowledge evidence.
- Execution accuracy and a valid-efficiency score.
- Shared benchmark of SpotIt, ParSEval, ROSE, ReViSQL and SISelection; its gold queries contain errors (SQLDriller, BIRD-Platinum).

## In plain words

Text-to-SQL systems turn a question in English into a database query. The authors argue that most common benchmarks, Spider and WikiSQL among them, "focus on database schema with few rows of database values", which leaves a gap with real use: real databases are large with noisy values, mapping a question onto them can need outside knowledge, and query speed matters (abstract, §1). They built BIRD: 12,751 questions with expert-checked reference queries over 95 databases built from real data (33.4 GB, 37 domains), with annotated hints that link question words to stored values, plus two scores: whether a query returns the reference query's result, and a speed score for the correct ones (§3, §5). GPT-4 given the hints, which they call the most effective model, returns the reference result on 54.89% of the hidden test questions, against 92.96% for humans, the benchmark's SQL annotators (abstract, App. B.9). The paper presents itself as a new benchmark that is, "To the best of our knowledge", "the first text-to-SQL benchmark to incorporate efficiency" (§1), and adds analyses of speed, hints and errors.

## Background and terms

**Terms to know:** [text-to-SQL](#/glossary/text-to-sql) · [gold query](#/glossary/gold-query) · [execution accuracy](#/glossary/execution-accuracy) · [set semantics](#/glossary/set-semantics) · [schema linking](#/glossary/schema-linking) · [data contamination](#/glossary/data-contamination) · [query rewriting and rewrite rules](#/glossary/query-rewriting-and-rewrite-rules) · [query plan and EXPLAIN](#/glossary/query-plan-and-explain) · [semantic parsing](#/glossary/semantic-parsing) · [index (database)](#/glossary/index-database)

**The paper's own terms:**
- **External knowledge evidence** ("knowledge", "KG" in tables): an annotated sentence per question that maps its words to database values or computations, in four kinds: numeric reasoning, domain knowledge, synonyms, and value illustration (§3.3). "w/ knowledge" means the model is given the evidence, "w/o knowledge" that it is not (§6.5).
- **Database description file:** per database, full table and column names and value descriptions (§3.3).
- **EX (execution accuracy):** the share of examples whose predicted query, run on the database, returns the same result set as the gold query (§5, Eq. 2–3); results are compared as a HashSet, which "disregards row order and automatically filters repetitive rows" (App. B.7).
- **VES (Valid Efficiency Score):** a correct query earns the square root of the gold query's running time divided by its own, a wrong one earns 0, averaged over all examples (§5, Eq. 4); a correct query as fast as the gold one earns 1, a faster one more. The square root is meant "to minimize random instances that are abnormally faster or slower than the ground-truth SQLs"; BIRD measures "the running time mainly at this time" (§5). Each query runs 100 times on the same CPU, runs beyond three standard deviations are dropped and the rest averaged, with times kept under 30 s (§5 footnote, App. B.8).
- **FT and ICL:** fine-tuning all parameters of a model on the training set (the T5 models), against in-context learning, prompting an LLM with no further training (§6.1).
- **Difficulty levels:** simple, moderate and challenging, set by experts from SQL annotators' ratings of question understanding, knowledge reasoning, data complexity and SQL complexity (App. B.1).

**Builds on:**
- The cross-domain benchmarks Spider ([Spider](#/papers/yu2018spider "Spider: A Large-Scale Human-Labeled Dataset for Complex and Cross-Domain Semantic Parsing and Text-to-SQL Task (2018)"); the paper calls it "the most prevalent and complex cross-domain text-to-SQL benchmark", §6.3), WikiSQL (one table per database) and KaggleDBQA (272 questions over eight Kaggle databases), compared in Tab. 1 and §7.
- DIN-SQL (Pourreza and Rafiei), a prompting method, used here with GPT-4, with "value sampling, few-shot demonstrations, and self-correction"; its lead on Spider prompts the paper's question (§1, §6.2).
- The double-blind annotation of CommonsenseQA 2.0, a question-answering benchmark (§3.4).
- Query optimization: LearnedRewrite ([LearnedRewrite](#/papers/zhou2021learnedrewrite "A learned query rewrite system using Monte Carlo tree search (2021)")) for rewriting queries to run faster with the same results, and rule-based optimization rules, Starburst's extensible rewrite-rule engine ([Starburst query rewrite](#/papers/pirahesh1992starburst "Extensible/Rule Based Query Rewrite Optimization in Starburst (1992)")) among them (§6.4, App. B.13).

## Problem and setting

- **Question:** "Can LLM already serve as a database interface ?" (§1).
- **Task:** from a question, a database and the evidence, produce an SQL query (§2, Eq. 1).
- **Databases:** 32% from Kaggle, 48% from the CTU Prague Relational Learning Repository, 20% built from open tables (§3.2); 69 / 11 / 15 databases for training / development / test (§3.2), holding 9,428 / 1,534 / 1,789 examples (App. A.2). The test databases were curated by the authors' team and are hidden, "thereby ensuring that LLMs do not preview the databases" (App. A.2). The engine is SQLite (§8).
- **Gold queries:** annotators pass entrance tests (App. B.2); two SQL annotators write a query for each question independently; queries "yielding identical results are gathered", otherwise experts resolve them, and the experts pick "The more semantic-equivalent and efficient SQL" as the gold query (§3.4). Experts also check that each gold query returns a non-NULL result (§3.4).
- **Models:** the pre-trained language models T5-Base, T5-Large and T5-3B fine-tuned; the LLMs Codex, ChatGPT, GPT-4, Claude-2 and Palm-2 prompted, reported as "zero-shot results" (§6.1); ChatGPT + COT (chain of thought) adds "Let's think step by step." and, as ChatGPT's output was "too uncertain", "a 1-shot pseudo example" (App. B.4); and GPT-4 + DIN-SQL (§6.1). The evidence is "naively" concatenated with the question and schema (App. B.4).
- **Human performance:** the SQL annotators' first scores on the two test batches; the authors treat their annotation of the first eight batches as "a learning process", since experts could fix their erroneous SQLs, and gave no help during this examination (App. B.9).

## Approach

- **Construction** (§3, Fig. 2): specialists prepare databases and description files; question annotators write questions; separate SQL annotators write the queries, double-blind; experts check each pair (§3.4).
- **Efficiency analyses** (§6.4, Fig. 10 in App. B.5): "two-stage optimization", where, "Intuitively", a query is first made correct and then rewritten "to be more efficient while maintaining the same results", tried by specialists on 10 random dev examples that ChatGPT got right, using "established query optimization rules"; and "Chat With Database", which "enables models to be aware of data types and distributions by generating global SQL queries that interact with databases", shown with added indexes.
- **Error analysis:** 500 randomly sampled ChatGPT errors, sorted into categories (§6.6, Fig. 11 in App. B.6).

## Results

- **EX** (Tab. 2): on test with evidence, GPT-4 reaches 54.89, GPT-4 + DIN-SQL 55.90, humans 92.96; the authors write that "GPT-4 surpasses all baseline language models" and Claude-2 "closely follows" (§6.2).
- **Evidence:** the authors report that all models have "a clear improvement" with it "across the different difficulty levels" (§6.5, Tab. 2, Tab. 4); GPT-4 on test goes from 34.88 without to 54.89 with (Tab. 2). The authors say ICL models have better knowledge grounding and SQL knowledge than fine-tuned models "with less than 5B parameters" and that "Equipped with COT, ChatGPT can perform better" (§6.5). With evidence, COT brings "a decline or limited improvements", which they hypothesize is because LLMs' internal multi-step reasoning "is not compatible with the way of external knowledge (evidence) in this situation" (§6.5).
- **Against Spider** (Fig. 6): with evidence and the same prompt for the LLMs, each of the six models shown scores lower on BIRD's dev set than on Spider's; the authors call BIRD "the most challenging text-to-SQL benchmark" (§6.3).
- **VES** (Tab. 3): on test with evidence, GPT-4 reaches 60.77 against humans' 90.27; "models with higher EX can more possibly achieve higher VES" (§6.4).
- **Efficiency** (§6.4): the two-stage rewrites give "an average time-saving of 77.75% while keeping the same results" over the 10 examples; adding indexes "can also improve SQL efficiency without rewriting them" (Fig. 10).
- **Question types** (§4 defines them; Fig. 7, §6.6): GPT-4 beats ChatGPT and Claude-2 "in all areas"; all models do worse at ranking and numeric computing, which "may suggest the inadequacy of contemporary LLMs for deep data science tasks".
- **ChatGPT's errors** (§6.6): wrong schema linking 41.6%, misunderstanding database content 40.8%, misunderstanding the evidence 17.6%; also occasional wrong keywords, such as MySQL's `Year` in place of SQLite's `STRFTIME`, and decoding errors; Fig. 11 adds a syntax-error panel.

## Limits the authors state

- Double-blind annotation keeps quality high, but "the procedure is resource-intensive" (§8).
- SQLite "presents difficulties in fetching Query Execution Plans (QEP) for precise efficiency computation and adapting to different SQL syntaxes" (§8), i.e. other [SQL dialects](#/glossary/sql-dialect).
- Comparing results as sets "may result in false positives" when a question needs a specific row order; such questions are "uncommon, accounting for less than 1%" of BIRD (App. B.7).
- "it is virtually impossible for any dataset, especially complex ones, to be entirely free of errors" (App. A.2).
- One timing run is unstable because of machine state, hence the 100 runs and outlier filtering (App. B.8).

## Open problems and building blocks

**Open:**
- Future research "could explore" annotation based on "human-computer interaction (HCI)", "incorporating advanced AI systems such as GPT-4 for taking parts of annotation duties" (§8).
- "Future work will include PostgreSQL and MySQL versions" of BIRD (§8).
- Methods that "effectively combine the strong multi-step self-reasoning capabilities of LLMs with external knowledge reasoning coherently", "a promising future direction" (§6.5); "A more complicated and effective strategy of knowledge grounding for ChatGPT and T5 would be an important future topic" (App. B.4).
- Bottlenecks named: schema linking "continues to be a significant obstacle for models", and making ChatGPT "really understand database structure and values" "is still a pain point topic in LLMs" (§6.6).

**Released:** "The leaderboard and source code are available" (abstract); code and datasets on the leaderboard website, with download links and a code repository; the dataset is under CC BY-NC 4.0 (App. A.6). Training and development sets are public; the test set is hidden "for the fair evaluation of all text-to-SQL challengers" (App. A.2). The data will be polished "periodically" (App. A.7).

**To reuse it:** SQLite databases of 33.4 GB in all (abstract); the T5 baselines ran on one NVIDIA A100 80GB (App. B.4); VES needs repeated timed runs on one CPU (§5).

**Beyond its domain:** the authors say the databases and questions "could be beneficial to DB-based code generation, data science analysis, etc." (App. A.5).

## On this site

- **Discussed in:** [Benchmarks with checkable ground truth](#/challenges/checkable_benchmark_ground_truth) · [Equivalence of nondeterministic queries](#/challenges/nondeterministic_equivalence) · [Text-to-SQL can't be verified against intent](#/challenges/text_to_sql_verification)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/llm-gen">llm-gen</a><a class="tag sub" href="#/tags/nl2sql-eval">nl2sql-eval</a></span>
