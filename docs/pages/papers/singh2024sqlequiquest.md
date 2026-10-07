# Can the Rookies Cut the Tough Cookie? Exploring the Use of LLMs for SQL Equivalence Checking

**Can the Rookies Cut…** · preprint · 2024

Read: [PDF](https://arxiv.org/pdf/2412.05561) · [arXiv](https://arxiv.org/abs/2412.05561)  
Code: [SQLEquiQuest](https://github.com/rajatb115/LLMs-for-SQL-Equivalence-Checking)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- A harder, realistic equivalence benchmark; most LLMs are biased towards "equivalent", GPT-4 excepted (§5).
- Compares formal checkers' coverage with GPT-4 verdicts; dataset gated behind a Google Form (`SQLEquiQuest` `README.md:10`).
- Verifier coverage gap: of 499 take-home-assignment pairs (§3.1), VeriEQL supports 14 and SQLSolver 151 (Tab. 4).

## In plain words

Deciding whether two SQL queries always return the same result is needed for grading student SQL, checking text-to-SQL output and testing optimizer rewrite rules, but the authors say existing checking tools handle only simple queries from a small part of SQL (abstract, §1). They build SQLEquiQuest, a benchmark of student answers to five hard assignment questions, each paired with the instructors' answer, and test how well five LLMs judge "equivalent" or "non-equivalent" under several prompting styles, with and without a step-by-step operator plan of each query, plus one fine-tuned model (abstract, §1).

The authors report that LLMs go from the tools' "mere 30% supported query pairs to full coverage", reaching "up to 82% accuracy" on a dataset of LLM-written Spider queries (abstract). Their main warning is that most models, GPT-4 excepted, lean strongly towards answering "equivalent" (abstract). They present the benchmark as "novel" and their numbers as "strong baselines" (abstract).

## Background and terms

**Terms to know:** [query equivalence](#/glossary/query-equivalence) · [text-to-SQL](#/glossary/text-to-sql) · [execution accuracy](#/glossary/execution-accuracy) · [bag semantics](#/glossary/bag-semantics) · [decidable and undecidable](#/glossary/decidable-and-undecidable)

**The paper's own terms:**
- **Equivalent / Non-Equivalent**: two queries are equivalent if, on every valid database of the given schema, they produce identical results; non-equivalent if at least one database tells them apart (§2 "SQL Query Equivalence").
- **EQ, NEQ, GM**: results are reported separately for equivalent pairs (EQ) and non-equivalent pairs (NEQ), as the share of each the model labels correctly, plus their geometric mean (GM) (§5.1, Tab. 2).
- **Logical plan (LP)**: "a detailed representation of a database query, outlining the high-level operations and transformations required to access data" (§4.2). The paper uses the unoptimized plan produced by Apache Calcite, an open-source query optimization framework, pasted into the prompt beside each query; queries with syntax errors get the placeholder "ERROR WHILE GENERATING PLAN" (§4.2).
- **Supported / Unsupported**: for the formal tools, "'Supported' queries are those the models can verify, while 'Unsupported' queries fall outside their scope" (§5.2).
- **Classifying prompt**: a second call to a GPT-family model that reads the first model's free-text answer and labels it "Equivalent", "Non-Equivalent" or "Unknown" (§4.2, App. B.5).
- **Calcite (dataset)**: 232 query pairs from the Calcite optimizer team, each a query before and after a rewrite, so all are equivalent (§3).
- **Spider+DIN**: pairs of a Spider reference query and a second query written for the same question by DIN-SQL, an LLM-based text-to-SQL method; Spider is a text-to-SQL benchmark of questions, SQL and small databases. Pairs were labelled with test-suit-sql-eval (the paper's spelling), which judges equivalence by execution accuracy (App. C.1). Of 1,034 pairs, 460 exact text matches were dropped, leaving 385 equivalent and 189 non-equivalent (§3, App. C.1).
- **SQLEquiQuest**: student submissions to five questions of a database-course take-home assignment, each paired with the instructors' query: 307 equivalent and 192 non-equivalent pairs (§3.1, Tab. 1, Tab. 2).

**Builds on:**
- LLM-SQL-Solver ([LLM-SQL-Solver](#/papers/zhao2023llmsqlsolver "LLM-SQL-Solver: Can LLMs Determine SQL Equivalence? (2025)")), an earlier study of LLMs judging SQL equivalence; the authors call it "Closely related", take its Spider+DIN design and say they correct its "potentially misleading" metric (§2).
- Cosette's "Exams" dataset ([Cosette](#/papers/chu2017cosette "Cosette: An Automated Prover for SQL (2017)")), "a handful of simple SQL query pairs" from university exams, which SQLEquiQuest builds on (§3.1).
- VeriEQL ([VeriEQL](#/papers/he2024verieql "VeriEQL: Bounded Equivalence Verification for Complex SQL Queries with Integrity Constraints (2024)")) and SQLSolver ([SQLSolver](#/papers/ding2023sqlsolver "Proving Query Equivalence Using Linear Integer Arithmetic (2023)")), two recent formal equivalence checkers, the main comparison (§1, §5.2).

## Problem and setting

- **Question:** can LLMs judge SQL equivalence on realistic queries that formal tools don't support, and how do prompting, logical plans and fine-tuning change that (§1, §1.1)?
- **SQL covered:** whatever the datasets contain; SQLEquiQuest queries use subqueries, joins, aggregation, ordering and, in Question 5, graph-path queries (§3.1, App. C.2).
- **Semantics:** the definition asks for "identical results" (§2) without saying whether row order or duplicates count; NULLs are not discussed.
- **Ground truth:** SQLEquiQuest labels come from teaching assistants running each submission on "a large database instance designed to account for all potential corner cases" (§3.1). The instructors designed a new schema and questions to keep them out of LLM training corpora (§3.1).
- **Models:** Code Llama-7B and -13B Instruct (Meta's open code models), GPT-3.5 and GPT-4 (OpenAI's API models `gpt-3.5-turbo-0125`, `gpt-4-0125-preview`) and Gemini-Pro (Google's API model) (App. A).

## Approach

- **Four prompting strategies** (§4, prompts in App. B):
  - P1 basic: task, schema, the two queries, answer slot.
  - P2 chain of thought: adds fixed steps (explain each query, decide, justify).
  - P3 few-shot: four fixed examples, two equivalent and two non-equivalent, with explanations written by GPT-4; App. B.3 says they "were randomly sampled from the dataset and then fixed".
  - P4 multi-stage chain of thought: one call explains each query, a second call judges equivalence from the explanations.
- **Logical plans** can be added to any prompt (§4.2).
- **Scoring:** the classifying prompt turns each answer into a label; "Unknown" is treated "as a negative result" (App. B.5).
- **Fine-tuning:** Code Llama-13B, 8-bit, with LoRA (low-rank adapter training), on 1,000 equivalent and 1,000 non-equivalent LeetCode pairs from VeriEQL's dataset, using the basic prompt (App. D.2).
- **Comparison with formal tools:** coverage of SQLSolver and VeriEQL run on all three datasets; Calcite counts for the earlier provers SPES, EQUITAS and UDP are copied from their papers (§5.2, Tab. 4).

## Results

- **Bias towards "equivalent":** "nearly all LLMs perform well on equivalent query pairs, but struggle significantly with non-equivalent sets"; GPT-4 is the exception (§5.1). With basic prompting on Spider+DIN, GPT-4's NEQ is 0.667 against 0.005–0.153 for the other four models (Tab. 2).
- **Headline accuracy:** "nearly 82% accuracy on Spider+DIN dataset and 61% accuracy on SQLEquiQuest" (§1.1). The performance of all approaches declines on SQLEquiQuest (§5.1).
- **Calcite:** GPT-4 does "much worse than significantly smaller models such as Code Llama-7B" (§5.1).
- **Per question:** on Question 5 (the graph query), GPT-3.5 with chain of thought beats GPT-4 on non-equivalent pairs; the authors suggest GPT-4 "emphasizes semantic similarity, whereas GPT-3.5 prioritizes syntactic structure" (§5.1, Tab. 3).
- **Logical plans:** on Spider+DIN, adding them "consistently enhances performance across various prompting methods, with the exception of the few-shot setting", with substantial gains for the smallest model, Code Llama-7B (§5.1, Fig. 4).
- **Fine-tuning:** Code Llama-13B on Spider+DIN goes from NEQ 0.005 to 0.238 and EQ 0.997 to 0.896 with the basic prompt, and from NEQ 0.011 to 0.370 and EQ 0.995 to 0.662 with logical plans (Tab. D.2); §5.1 calls the loss on equivalent pairs "a slight decrease".
- **Formal tools' coverage:** on SQLEquiQuest's 499 pairs, SQLSolver supports 151 and VeriEQL 14; on Calcite, 232 and 119 (Tab. 4). The authors set SQLSolver's 71% (Spider+DIN) and 30% (SQLEquiQuest) against GPT-4's correct predictions, 80% and 60% (§5.2).
- **Where tools stop:** GPT-4 classifies "more than 80%" of the 151 SQLSolver-supported SQLEquiQuest pairs correctly, and 52% of the 348 unsupported ones (§5.2, Tab. 4). The authors say VeriEQL "is case-sensitive and prone to misclassification", SQLSolver struggles "with column permutation and subset relationships", and the LLM approach "overcomes these issues" (§5.2).
- **Query difficulty** (Spider's Easy to Extra-Hard levels): Code Llama models stay good on equivalent and poor on non-equivalent pairs at every level; in-context examples raise NEQ for all models except GPT-4; the authors say GPT-4 "maintains consistent performance across various prompting strategies and complexity levels" (§5.3). With chain of thought, NEQ falls as difficulty rises while EQ holds, a trend they say "persists across different prompting techniques" (§5.3, Fig. 5).
- **Explanations:** GPT models' explanations "tend to provide good guidance" for revising queries, e.g. for students (§5.1).

## Limits the authors state

- LLMs lack "theoretical guarantees"; since "formal proof of LLM reasoning remains elusive", they suit "non-critical applications, such as grading and feedback on SQL assignments" (§6).
- The bias towards "equivalent" is "a critical limitation" (abstract).
- Answers are sensitive to small prompt changes such as "adding a semicolon" or "changing capitalization"; outputs repeat lines, contradict themselves and add stray ASCII characters, mostly in the Code Llama models (§5.4).
- Logical plans were tested only on Spider+DIN "Due to budget constraints" (§5.1 "Note").
- Few-shot's small gain "may be attributed to suboptimal example selection" (§5.1).
- Models were chosen "based on budget and computational constraints" (App. A); fine-tuning used 8-bit quantization "Due to resource limitations" (App. D.2).
- Calcite and Spider are public, so LLMs have likely seen them; Calcite and Spider+DIN are "relatively simple" (§3, Fig. 2).

## Open problems and building blocks

  - The equivalence bias opens "a new direction for potential future research" (abstract).
  - "further work is required on fine-tuning, managing query complexity, and refining equivalence definitions" (§6).
  - Retrieval-augmented generation to supply similar query examples in context, and "integrating LLMs with symbolic proof systems" (§6).
- **Released:** "The code and instructions for running it" (§1.1 "Code"); the prompts are given in App. B and called "presented and shared" (§5.4).
- **To reuse it:** the five models above (App. A); Apache Calcite for logical plans (§4.2); a GPT-family model as the answer classifier (App. B.5). Experiments ran on a DGX station with four 32 GB V100 GPUs; fine-tuning took about 20 hours on two A100 GPUs (App. D.1–D.2).

## On this site

- **Discussed in:** [Benchmarks with checkable ground truth](#/challenges/checkable_benchmark_ground_truth) · [Query equivalence: prove or refute](#/challenges/query_equivalence) · [Sourcing realistic, hard query pairs](#/challenges/query_pair_sourcing) · [SQL features that verifiers don't cover](#/challenges/verifier_coverage_gaps)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/judge-sql">judge-sql</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/pairs-check">pairs-check</a></span>
