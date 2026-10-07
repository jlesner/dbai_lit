# The Stochastic Shift: A New Evaluation Paradigm for Text-to-SQL with AI Operators

**The Stochastic Shift** · preprint 2026

Read: [PDF](https://arxiv.org/pdf/2609.21133) · [arXiv](https://arxiv.org/abs/2609.21133)  
Code: [text-to-sql-ai-eval](https://figshare.com/s/c75141469fb6dc74b890)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Evaluates text-to-SQL whose queries call AI operators, on BigQuery and ThalamusDB (abstract).
- A layered evaluation separates deterministic database logic from nondeterministic AI semantics (abstract).
- LLM operators inside SQL make results depend on prompt wording (§3, worked example) and, the authors say, on sampling, which they don't measure; a new volatile-function case for [Equivalence of nondeterministic queries](#/challenges/nondeterministic_equivalence).

## In plain words

Some databases let SQL ask a language model about each row (is this review positive?). The authors call evaluating generated queries of this kind "a critical open challenge" (abstract): comparing results with a reference query can reject correct queries whose prompts are worded differently, and an LLM judge struggles to check the plain SQL and the prompts at once (§1). Their framework splits each query into plain-SQL and AI parts, runs both, and has an LLM judge grade them. Against the authors' manual labels, it judges 97.2% of one benchmark's queries correctly on Google's BigQuery and 93.3% on the academic ThalamusDB, against at most 83.3% and 86.7% for baselines (§5.2). They call it "a novel benchmarking architecture" (§1).

## Background and terms

**Terms to know:** [text-to-SQL](#/glossary/text-to-sql) · [gold query](#/glossary/gold-query) · [execution accuracy](#/glossary/execution-accuracy) · [LLM-as-a-judge](#/glossary/llm-as-a-judge) · [counterexample database](#/glossary/counterexample-database) · [query equivalence](#/glossary/query-equivalence)

**The paper's own terms:**
- **relaxed semantic correctness**: a query "should be accepted as correct" if it "accurately targets the semantic goal", even if "the data varies slightly due to LLM sampling" (§3).
- **autorater**: an LLM judge (§1, §4).
- **SQL Splitter**: cuts a query into a structural part (in §4's example, the AI call becomes `TRUE`) and an AI part (the AI call over its input column) (§4 "SQL Splitter").
- **TPR / TNR** (true positive / true negative rate): the share of valid queries a method accepts / of flawed queries it rejects (Tab. 1 caption); **accuracy**: the share of all queries judged correctly.
- **Miniature & Mull, Explain & Compare**: the two prompts of LLM-SQL-Solver, a method that prompts an LLM to decide whether two SQL queries are equivalent. The first (semantic equivalence) has the LLM imagine a small database and mentally run both queries to find a counterexample; the second (relaxed equivalence) explains each query, then compares their "pragmatic intention" (what each is meant to do) (§5.1).

**Missing glossary terms:**
- **AI operator**: a SQL function that sends a prompt and a value (text, image, audio) to an LLM inside the query, e.g. BigQuery's `AI.IF` or ThalamusDB's `NLfilter` (§1, §2).

**Builds on:**
- LLM-SQL-Solver ([LLM-SQL-Solver](#/papers/zhao2023llmsqlsolver "LLM-SQL-Solver: Can LLMs Determine SQL Equivalence? (2025)")): source of "relaxed semantic correctness" (§3) and a baseline, "a state-of-the-art LLM metric" (§5.1).
- Execution Accuracy (EX; [BIRD](#/papers/li2023bird "Can LLM Already Serve as A Database Interface? A BIg Bench for Large-Scale Database Grounded Text-to-SQLs (2023)") and Gan et al. 2021, not listed here) and Test Suite Accuracy ([Semantic Evaluation for Text-to-SQL…](#/papers/zhong2020testsuite "Semantic Evaluation for Text-to-SQL with Distilled Test Suites (2020)"); runs both queries on several test databases), which the authors say replaced Exact Match ([Evaluating Cross-Domain Text-to-SQL Models…](#/papers/pourreza2023evaluating "Evaluating Cross-Domain Text-to-SQL Models and Benchmarks (2023)"); compares query text) "to reduce false negatives" (§1).

## Problem and setting

- **Question:** how to judge whether a generated query with AI operators matches the user's intent (§1, §3).
- **Queries:** SemBench (Lao et al. 2026, not listed here), 55 queries over text, image and audio data in five scenarios; only its BigQuery and ThalamusDB queries (§5.1 "Dataset").
- **Generated queries:** the authors' few-shot generator, given the question, schema and "a small random sample of rows" (§5.1).
- **Model:** gemini-3.1-pro-preview (a Google LLM) at default sampling (temperature 1.0, no random seed) (§5.1 "Model").
- **"Correct":** the authors "manually verified the generated outputs" (§5.1).
- **Baselines:** EX and both LLM-SQL-Solver prompts with few-shot examples for AI operators, plus versions given both queries' execution results for a fair comparison (§5.1 "Evaluation Baselines").

## Approach

Phases (§4, Fig. 1):
- **Splitting:** the splitter "can be implemented in various ways" (a syntax-tree parser or an LLM); they use a few-shot LLM. "Given the relative simplicity of SemBench queries, it proved highly effective" (§4 "SQL Splitter").
- **Execution:** full and split queries run.
- **Autorating:** the judge sees question, schema, all queries and their results; it scores overall, relational and AI similarity from 1 to 5, and "We consider any score over 3 to be correct" (§4 "Independent Autorating"), a scale chosen because "this 5-point grading has been shown to match human judgment best".

The authors say the split prevents false rejections "due to language variations, non-deterministic execution, or the use of alternative AI operators" (§4).

## Results

- **EX** accepted as few as 25.0% of valid queries (ThalamusDB), and accepted a query missing `DISTINCT` because the database "currently had no duplicate values" (§5.2).
- **Miniature & Mull** rejected every flawed query on both systems but falsely rejected around 32% of correct ones across both databases (§5.2), which the authors attribute to judging relational and AI parts at once (abstract). With execution results its overall accuracy dropped further, they say because real data conflicted with the prompt (§5.2).
- **Explain & Compare** had 91.7% TPR but 66.7% TNR on ThalamusDB (§5.2); with execution results it accepted `UNION DISTINCT` for the required `UNION ALL`, as both returned the same results on that database.
- **The framework:** 97.2% (BigQuery) and 93.3% (ThalamusDB) accuracy against 83.3% and 86.7% for the best baseline on each (Tab. 1), "a state-of-the-art overall accuracy for both platforms" (§5.2).
- **The generator** was correct on 70% of BigQuery and 80% of ThalamusDB questions, by manual check (§5.1).

## Limits the authors state

- The splitter proved effective "Given the relative simplicity of SemBench queries" (§4).
- §6 rests on "our preliminary analysis" (§6).

## Open problems and building blocks

- **Open:** §6, the authors' categorization of generation failures (§1): choosing a structured column or an AI call ("Structured vs. Semantic Misalignment"); choosing the data source or modality; splitting a request between columns and the LLM's outside knowledge ("The Open-World vs. Closed-World Divide"); refusing unanswerable requests ("Forced Answering of Ambiguous Queries").
- **Future work:** "a large-scale, challenging benchmark for Text-to-SQL with AI operators" (§8).
- **Released:** "our complete evaluation framework, including all baseline evaluation scripts and prompting templates" (§1).
- **To reuse it:** the setup used an LLM in structured-output mode and both engines (§5.1).

## On this site

- **Discussed in:** [Equivalence of nondeterministic queries](#/challenges/nondeterministic_equivalence)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/judge-sql">judge-sql</a><a class="tag sub" href="#/tags/llm-gen">llm-gen</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/nl2sql-eval">nl2sql-eval</a><a class="tag sub" href="#/tags/nondet-eval">nondet-eval</a></span>
