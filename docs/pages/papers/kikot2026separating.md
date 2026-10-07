# Data-aware candidate selection in NL2SQL translation via small separating instances

**data-aware NL2SQL candidate selection** · preprint 2026

Read: [PDF](https://arxiv.org/pdf/2605.12319) · [arXiv](https://arxiv.org/abs/2605.12319)  
Code: [SISelection](https://github.com/staskikotx/SISelection)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Picks among text-to-SQL candidates using small separating database instances.
- Extracts the instances from an existing database by provenance; the LLM runs the NL question on them.
- Separating instances used to choose among candidates without a gold query; its tournament reports also flag wrong BIRD gold answers (§4).

## In plain words

Text-to-SQL systems often generate several candidate queries, then pick one. The authors argue that picking, not generating, often limits accuracy, and that existing pickers have limited access to the database's values (§I, §V). For two candidates that disagree, they extract a few rows of the real database on which the two still disagree, using provenance (which rows produced each answer row) and a simple random search. An LLM answers the question on those rows; the matching candidate wins. On filtered parts of the BIRD benchmark, with candidates from two search rollouts, it reports 77.9% accuracy against at most 64.3% for three baselines; with more rollouts one baseline leads (§III, Fig. 3). They call it "a novel method" (§I).

## Background and terms

**Terms to know:** [text-to-SQL](#/glossary/text-to-sql) (the paper's "NL2SQL") · [execution accuracy](#/glossary/execution-accuracy) · [gold query](#/glossary/gold-query) · [self-consistency (majority voting)](#/glossary/self-consistency-majority-voting) · [counterexample database](#/glossary/counterexample-database) · [query equivalence](#/glossary/query-equivalence) · [provenance](#/glossary/data-provenance) ("derivation metadata that track the origin and query-level transformation of relational tables", §I-d; here, which rows of D each answer row came from)

**The paper's own terms:**
- **Model database D**: the benchmark's database for a task; **Q_nl**: the question (§I).
- **Separating instance D′**: a subset of D on which candidates Q1 and Q2 give different answers (§I-c, §II-b).
- **Provenance token, simple term**: a token labels one row of D; a simple term is a product (⊗) of tokens, naming one combination of rows; general terms also use ⊕ and ⊖ (§II-b, deferring to ProvSQL).
- **Technical coverage, actual coverage, success rate** (§III-d): the share of stage-1 tasks (candidates disagree, one is correct) passing later filters; that share minus tasks with two or more tournament winners; the share of candidate pairs the constructor separates.

**Builds on:**
- RATEST ([RATest](#/papers/miao2019ratest "Explaining Wrong Queries Using Small Examples (2019)")), a teaching tool finding a small database subset that separates a student's query from the model answer, the problem posed here (§I-c).
- ProvSQL, a provenance extension of PostgreSQL (§I-d).
- AlphaSQL ([Alpha-SQL](#/papers/li2025alphasql "Alpha-SQL: Zero-Shot Text-to-SQL using Monte Carlo Tree Search (2025)"), zero-shot text-to-SQL by tree search) and DeepEye-SQL (consistency score plus pairwise LLM selection), the baselines (§I-f, §III-b).
- Separating instances from solvers (VeriEQL [VeriEQL](#/papers/he2024verieql "VeriEQL: Bounded Equivalence Verification for Complex SQL Queries with Integrity Constraints (2024)"), SpotIt+ [SpotIt+](#/papers/tremante2026spotitplus "SpotIt+: Verification-based Text-to-SQL Evaluation with Database Constraints (2026)")) or LLMs (CHESS unit tests, DPC [DPC (Dual-Paradigm Consistency)](#/papers/li2026dpc "DPC: Training-Free Text-to-SQL Candidate Selection via Dual-Paradigm Consistency (2026)")), contrasted with D′ (§I-c, §I-e, §I-f).

## Problem and setting

- **Question:** which of two candidates that disagree on D answers the question (§I-g, §I-h).
- **Data:** BIRD-DEV (a cross-database benchmark, §I-a): 1,534 tasks, about 50 gold answers hand-corrected (§III-a).
- **Candidates:** AlphaSQL with K ∈ {2, 5, 11, 24} rollouts, grouped by result on D, one representative per group. Dropped: tasks where all candidates agree or none is correct, or a representative fails PostgreSQL translation, ProvSQL execution or provenance parsing; 164–488 tasks remain (§III-a, Fig. 2).
- **Correctness:** all-NULL rows and duplicates removed, rows compared "as sets", since BIRD questions leave DISTINCT, NOT NULL and column order unclear (§III-e).
- **SQL fragment:** ProvSQL's; WHERE-clause subqueries are avoided or rewritten into joins (§III-f).
- **LLM:** Qwen3-Coder-30B-A3B-Instruct, an open model (§III-c).

## Approach

- **Tournament (§II-a):** round-robin; win 1, draw 0.5; ties fall back on the consistency score.
- **Binary selection unit (Fig. 1):** the LLM sees D′, Q_nl, schema, hint and metadata and answers the question on D′; a database runs Q1 and Q2 on D′. The candidate alone in matching the LLM wins; otherwise a draw.
- **Constructor (§II-b), "a naive heuristic":** it runs both queries with provenance and parses each answer's terms. If both use the same terms it draws two; otherwise a few used only by Q1 and a few only by Q2 (more for some query keywords). D′ is the rows they name; it tries 42 times for a D′ that separates, else fails, scored as a draw.
- **LLM step (§II-c, App. A):** a row-by-row workout, run three times with majority voting, as for baselines; D′ is given as JSON, which beat markdown and SQL (§III-g).

## Results

- **Accuracy (Fig. 3, values from source data; 16 runs, baselines 4, §III-c):** at K = 2, 77.9% against DeepEye 64.3%, Naive (an unofficial AlphaSQL prompt, App. C) 63.9% and Consistency 54.3%; at K = 24, 78.5% against DeepEye 79.0%. For K > 2 the authors say it is "on a par with the consistency baseline and is second to DeepEye" (§V).
- **Coverage (§III-d):** technical coverage (of stage-1 tasks) 74% (K = 2) to 67% (K = 24); actual coverage around 50% and constructor success 95% at K = 24.
- **LLM errors (§II-c):** on one example instance, wrong answers in 35% of cases with JSON and 23% with markdown.
- **Gold answers (§IV, App. D):** tournament reports become "evidence-based criticism of gold answers" (four given).

## Limits the authors state

- The constructor "lacks theoretical guarantees, currently serving as a placeholder for more rigorous symbolic procedures" (§V).
- "These hallucinations are the bottleneck of our selection method" (§II-c); beyond K = 2 it trails DeepEye, "probably, because our method is more prone to hallucinations" (§V).
- ProvSQL "has many limitations", chiefly no WHERE-clause subqueries (§III-f).
- The Fig. 1 design "is somewhat arbitrary" (§V).

## Open problems and building blocks

- **Open:** reducing hallucinations by prompting, architecture or fine-tuning (§V); extracting "a minimal separating instance", "a logical problem of utmost practical importance" (§V).
- **Released:** the prototype's code (abstract) and "a collection of SQL candidates for original BIRD questions for benchmarking candidate selection" (§V).
- **To reuse it:** PostgreSQL with ProvSQL, access to D, and an LLM called three times per pair (§II-c, §III-a); no run time or cost given.
- **Beyond its domain:** "an original framework for combining symbolical reasoning with LLM-based inference" (§V).

## On this site

- **Discussed in:** [Benchmarks with checkable ground truth](#/challenges/checkable_benchmark_ground_truth) · [Minimal counterexamples](#/challenges/minimal_counterexamples) · [Text-to-SQL can't be verified against intent](#/challenges/text_to_sql_verification)
- **Tags:** <span class="tags"><a class="tag" href="#/tags/reduce">reduce</a><a class="tag sub" href="#/tags/cex-llm">cex-llm</a><a class="tag sub" href="#/tags/cex-search">cex-search</a><a class="tag sub" href="#/tags/llm-assist">llm-assist</a><a class="tag sub" href="#/tags/nl2sql-data">nl2sql-data</a><a class="tag sub" href="#/tags/nl2sql-select">nl2sql-select</a></span>
