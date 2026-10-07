# S3Eval: A Synthetic, Scalable, Systematic Evaluation Suite for Large Language Models

**S3Eval** · NAACL 2024

Read: [PDF](https://arxiv.org/pdf/2310.15147) · [arXiv](https://arxiv.org/abs/2310.15147)  
Code: [S3Eval](https://github.com/lfy79001/S3Eval)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Evaluates LLMs by SQL execution: given a randomly generated table and a random SQL query, the model must return the execution result (PDF §1).
- Synthetic, so table length and task difficulty can be scaled (abstract).

## In plain words

The authors want to test how well LLMs reason and use long inputs. They say such inputs (e.g. 200K tokens) are far longer than humans can reliably check in reasonable time, so hand-labelled benchmarks often lack scale, and data from well-studied tasks may have leaked into training (abstract; §1). Their answer is a synthetic task: the model is shown a randomly generated table and a random SQL query and must give the query's result. A generator lets the user choose table size, query difficulty and where the answer sits, so inputs can be made as long as wanted (§2). Across the models they test, they report that scores correlate strongly with a reasoning benchmark, a code benchmark (for code models) and, when the queries are a table question-answering benchmark's own SQL, with that benchmark (§3.3). In their simplest setting, almost all models lose accuracy as the table grows longer (§4.2). They present the work as an evaluation suite, and say its "most significant contribution" lies in "its effectiveness as a method for long-context evaluation" (§1).

## Background and terms

**Terms to know:** [exact match](#/glossary/exact-match) · [data contamination](#/glossary/data-contamination) (the paper says "data leakage") · [pass@k](#/glossary/passk) (HumanEval is scored by pass@1, §3.3) · [Pearson r](#/glossary/pearson-correlation) · [lost in the middle](#/glossary/lost-in-the-middle).

**The paper's own terms:**
- **SQL execution task**: given a table and an SQL query, the model must output the query's execution result; scored by exact match of the answer (§2.1).
- **Table / Instruction / Output control**: the generator's settings for the table (shape, column types, duplicates), the query (keywords, length, number of calculations and filters, operators) and the answer (location, number of cells, length) (Tab. 1; all settings in App. D.1).
- **Easy** and **General**: two difficulty settings. Easy has one template, a single-condition lookup `SELECT <col1> WHERE <col2> <op> <value>`; General uses "extensive SQL syntax" (§3.1; settings in App. D.2).
- **S3Eval-Standard**: a fixed dataset generated from all templates and operations, with inputs from 2K to 40K tokens, which the authors use as "the official benchmarking data" (§2.2).
- **SQL multi-step task** (multi-step instruction): the query rewritten as English step-by-step table operations, offered "to remove this potential bias" against models that read symbolic language poorly; it also yields chain-of-thought prompts (§3.1; App. C.6, C.7).
- **Seen Table / Unseen Table / Unseen Templates**: test sets for a fine-tuned model: its training tables, new tables, and new query templates (§4.1).
- **Dense** and **Sparse**: the four answer cells are in adjacent rows, or spread apart (§5.2, Fig. 9).
- **Reasoning types**: six template families taken from TaPEx: Filter, Aggregate, Arithmetic, Superlative, Comparative and Group (§5.3; templates in App. C.2).
- **Markdown** and **flatten** table formats: a grid, or one line per row of "Column is value" pairs (App. B.3; example in App. C.3).

**Missing glossary terms:**
- **Kendall τ**: a rank correlation; it measures "whether the relative ranking of models is consistent across the benchmarks" (§3.3). The paper prints it and Pearson r as percentages (e.g. 99.1).
- **Needle-in-a-haystack**: a long-context test in which "a vital piece of information is concealed within a lengthy document" and the model must find it (§1, Fig. 1).
- **Context-free grammar**: rules that generate syntactically valid queries (§2.1).

**Builds on:**
- TaPEx ([TAPEX](#/papers/liu2021tapex "TAPEX: Table Pre-training via Learning a Neural SQL Executor (2022)")), which pretrains a model as a SQL executor: the task and the six reasoning types follow it (§1, §2.1, §5.3).
- Needle-in-a-haystack and the long-context benchmarks LongBench, L-Eval and ZeroSCROLLS, which the authors say are built from existing public datasets and have fixed evaluation types (§1, §6).
- The SQL queries for WikiTableQuestions (a table question-answering dataset) from Shi et al. (2020), used in the correlation study (§3.3).

## Problem and setting

- **The question:** can a generated SQL execution task stand in for real benchmarks, especially at lengths too long to annotate by hand (abstract; §1)?
- **Tables:** single random tables with English-noun headers and TEXT (random strings), INT or DATE columns, with an adjustable chance of repeated values (§2.1).
- **Queries:** one table, with SELECT, WHERE, GROUP BY, HAVING and ORDER BY; aggregates COUNT, MAX, MIN, SUM and AVG; filters >, <, =, IN and LIKE (Tab. 1); nesting depth 1 to 3 (App. D.1, D.2). Users may also write their own templates (§2.1).
- **Prompting:** zero-shot and few-shot, examples sharing one table (§2.1).
- **Scoring:** exact match of the model's answer against the execution result (§2.1). How the reference results are computed, NULLs, duplicate rows and the order of multi-cell answers are not discussed.
- **Correlation runs:** each experiment run 3 times on 1000 generated queries per trial, tables of 15 rows and 8 columns, about 1200 tokens per input (§3.1).
- **Models:** open models from Hugging Face (App. D.3, Tab. 7) plus GPT-4, ChatGPT and Claude (Tab. 4).

## Approach

- **Generator:** random tables plus queries from a context-free grammar, set by Tab. 1 (§2.1). The authors say scalable tables, random cell strings and "the provided large library of SQL query templates" allow "a near-infinite set of unique evaluation examples" (§4.1).
- **Validation as a proxy:** (1) checkpoints of Pythia-12B (an open model released at several training steps) should improve smoothly with training compute (§3.2); (2) scores across models should correlate with WikiTableQuestions, BBH (a reasoning benchmark; scores from the OpenCompass evaluation platform with few-shot chain of thought) and HumanEval (a code-writing benchmark, for code models) (§3.3).
- **Leakage check:** fine-tune StarCoder-1B, a small code model, on one million generated examples, then test it as above (§4.1).

## Results

- **Correlation with real benchmarks:** the authors report r 99.1 and τ 93.6 against WikiTableQuestions (Fig. 4; the evaluation set here is WikiTableQuestions' own SQL queries, §3.3), and r 95.3, τ 90.0 against BBH (Fig. 5a). They conclude that S3Eval "serves as a robust proxy task for assessing the reasoning capabilities of LLMs on realistic benchmarks" (§3.3). A simpler synthetic task, key-value retrieval, has "low correlation" with BBH (App. A.1, Fig. 10). On synthetic against real tables, they report "the synthetic SQL is more complex than the real SQL" and model performance on the two "is very relevant" (App. A.3, Fig. 11c).
- **Scaling:** Pythia-12B improves smoothly with training steps on Easy and General (§3.2, Fig. 3).
- **S3Eval-Standard:** the best model, GPT-4-32K, scores 68.4% on contexts under 4K tokens against 43.0% on 4K to 40K (Tab. 2). The abstract says the dataset "poses significant challenges for all existing LLMs".
- **Length:** in the Easy setting, almost all models decline significantly as context grows (§4.2, Fig. 7); from 2K to 16K tokens ChatGPT falls from 96.8 to 68.7 while Claude-1.3-100K falls from 97.2 to 85.2, "the only one that maintains a relatively strong performance trend" (Tab. 5; §4.2).
- **Fine-tuned model on new tables and templates:** after training, StarCoder-1B shows "a substantial decline" against seen tables on unseen tables of every shape, and "a significant drop" on unseen templates (§4.1, Fig. 6). The authors conclude that out-of-distribution performance "can still be accurately evaluated by using novel SQL templates" (§4.1).
- **Answer position:** with contexts under 4K tokens, ChatGPT and CodeLlama do better when the answer is at the start or end of the input, with a "periodic fluctuation" that "appears to correlate with the position embedding approach used by LLMs" (§5.1, Fig. 8).
- **Answer spread:** ChatGPT and Yarn-Llama2-13B (LLaMA-2 with an extended context window, App. A.5) do "significantly better in dense mode", and both drop steeply from 4K to 8K tokens even there (§5.2, Fig. 9, in F1).
- **Reasoning types:** on Arithmetic, ChatGPT scores 67.2 against Mistral-7B's 5.4 (Tab. 3).
- **Chain of thought:** ChatGPT's score, with markdown tables, improves from 38.0 to 48.5 with chain-of-thought prompts (App. A.4).
- **Counter-intuitive findings:** in Template2 (one SELECT with N equality conditions), more WHERE conditions do not lower ChatGPT's score, which the authors "speculate" comes from "looking up string co-occurrences rather than logically considering all conditions" (App. B.2, Fig. 15); COUNT answers are good only at the smallest or largest values and "almost zero" in the middle (App. B.2, Fig. 16); flatten beats markdown in every setting tried (App. B.3, Fig. 13).

## Limits the authors state

- Multi-turn and multilingual features exist, but "this paper has not yet conducted a systematic analysis of these complex new features" (§ "Limitations").
- The syntax S3Eval can generate is "still relatively limited" (§ "Limitations").
- "the absence of data leakage does not necessarily mean" that S3Eval scores represent out-of-distribution generalization, since a model "may perform well" through domain-specific training on the task (§4.1).
- Some models "may have a poor understanding of symbolic language", a "potential bias" the multi-step task is offered to remove (§3.1).
- The answer-position study covers only answers within a context of less than 4K tokens, "To mitigate the influence of long contexts" (§5.1); ChatGPT could be tested only up to 16K-token tables (App. A.5).

## Open problems and building blocks

  - Extending the generated syntax "is also what we need to do in our future work" (§ "Limitations").
  - "Exploring the treasure contained in synthetic data is our goal for the future" (§ "Limitations").
  - Studying more complex queries, multi-step instruction and chain-of-thought prompting with the suite (App. B.2).
  - The authors name a long-context bottleneck: LLMs "struggle to retrieve information over long sequences", which "may be caused by" too few long-distance dependencies in training data, and current length-extension techniques "may not be as effective as hoped" (§5.2).
- **Released:** the code (abstract).
- **To reuse it:** generator settings in App. D.1; prompts, templates and table formats in App. C.
- **Beyond its domain:** the authors say SQL's expressive power lets S3Eval evaluate "numerical reasoning, multi-hop reasoning, complex code understanding, and multi-turn interaction with intermediate execution results" (§5.3), and that it supports multilingual testing, "especially for reasoning data generation of low-resource languages" (§ "Limitations").

## On this site

- **Discussed in:** [Benchmarks with checkable ground truth](#/challenges/checkable_benchmark_ground_truth)
- **Tags:** <span class="tags"><a class="tag" href="#/tags/dbtask">dbtask</a><a class="tag" href="#/tags/workload">workload</a><a class="tag sub" href="#/tags/llm-misc">llm-misc</a></span>
