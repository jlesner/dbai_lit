# Automated Validating and Fixing of Text-to-SQL Translation with Execution Consistency

**SQLDriller** · PACMMOD / SIGMOD 2025

Read: [DOI](https://doi.org/10.1145/3725271)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Finds and fixes wrong NL→SQL mappings in training data via counterexample databases and "execution consistency".
- Hybrid checker (SQLSolver, then VeriEQL with small bounds, then test-suite execution) finds databases that separate LLM-generated candidate SQLs; an LLM "executes" the NL question on each, and mappings whose SQL disagrees are flagged and fixed (abstract; Fig. 5).
- Gold labels are unreliable: it reports that over 30% of the sampled Spider and BIRD training mappings are wrong (abstract, Tab. 1).

## In plain words

Text-to-SQL models learn from datasets of questions paired with SQL answers, and the authors find many of these pairs wrong: over 30% of the pairs they sampled from the training sets of Spider and BIRD, two "popular" benchmarks (abstract, PDF p. 1). They argue wrong pairs teach models mistakes and distort accuracy scores (§1, PDF p. 2). Their tool, SQLDriller, asks a model for several different SQL answers to a question, uses existing tools that check whether two queries always agree to build tiny databases on which the answers differ, and has GPT-4 answer the question on each tiny database. A pair whose SQL disagrees with GPT-4's answers is flagged, and the candidate that agrees most often becomes its fix if it beats the original SQL. For six models, fixed training data, plus the same selection at answer time where a model can give several answers, raised accuracy by 3.6 to 13.6 points on test sets the authors corrected by hand (§6.2, PDF p. 15). They say dataset quality "has so far been overlooked" (§1, PDF p. 2).

## Background and terms

**Terms to know:** [text-to-SQL](#/glossary/text-to-sql) · [gold query](#/glossary/gold-query) · [query equivalence](#/glossary/query-equivalence) · [counterexample database](#/glossary/counterexample-database) · [bounded verification](#/glossary/bounded-verification) · [SAT and SMT solvers](#/glossary/sat-and-smt-solvers) · [integrity constraint](#/glossary/integrity-constraint) · [test oracle](#/glossary/test-oracle)

**The paper's own terms:**
- **mapping**: one question–SQL pair, written (q_nl → q_sql) for the natural-language (NL) question and its SQL, the "original SQL" (§1, PDF p. 3).
- **execution consistency**: a mapping satisfies it on a given database if the "execution result" of the question there matches the SQL's (Def. 1, §3.1, PDF p. 7); in the authors' words, "a necessary but not sufficient correctness condition for NL to SQL mapping" (§1, PDF p. 3).
- **NL execution**: an LLM, given a small database in its prompt, returns the question's answer as a list of tuples (§4.2, PDF pp. 12–13).
- **counterexample**: a database on which two queries return different results (§2.1, PDF pp. 4–5).
- **candidates**: alternative SQL queries a base model writes; they yield counterexamples and fixes (§4.1, PDF p. 9).
- **full- and bounded-equivalence verifiers**: the first prove equivalence over all databases but, the authors say, can't return counterexamples; the second check tables up to a size bound, return counterexamples, and often time out on equivalent pairs (§4.1, PDF p. 10).
- **true and false positives**: flagging or changing a mapping the manual review judged incorrect, or correct (§6.3, PDF pp. 17–18).
- **hardness levels**: Spider's Easy, Medium, Hard and Extra classes of complexity, which the authors also apply to BIRD's training set (Tab. 1, footnote 2, PDF pp. 4–5).
- **LLM consistency (LC)**: the baseline; GPT-4 picks a candidate under 20 prompt templates, and the one with the highest average log probability wins (§6.1, PDF p. 15). "EC" is execution consistency.
- **Test Suite Accuracy**: a prediction must match the gold query on many databases (§6.1, PDF p. 15).

**Missing glossary terms:** none.

**Builds on:**
- SQLSolver [14] ([SQLSolver](#/papers/ding2023sqlsolver "Proving Query Equivalence Using Linear Integer Arithmetic (2023)")), a full-equivalence prover, and VeriEQL [22] ([VeriEQL](#/papers/he2024verieql "VeriEQL: Bounded Equivalence Verification for Complex SQL Queries with Integrity Constraints (2024)")), a bounded checker: the verifiers in its checker (§4.1, PDF p. 10).
- Test-suite execution [60] ([Semantic Evaluation for Text-to-SQL…](#/papers/zhong2020testsuite "Semantic Evaluation for Text-to-SQL with Distilled Test Suites (2020)")), which runs two queries on many generated databases: the checker's fallback and the metric (§4.1, PDF p. 11; §6.1, PDF p. 15).
- Spider [57] ([Spider](#/papers/yu2018spider "Spider: A Large-Scale Human-Labeled Dataset for Complex and Cross-Domain Semantic Parsing and Text-to-SQL Task (2018)")) and BIRD [30] ([BIRD](#/papers/li2023bird "Can LLM Already Serve as A Database Interface? A BIg Bench for Large-Scale Database Grounded Text-to-SQLs (2023)")), the text-to-SQL datasets it studies (§2.2, PDF p. 5).
- Prompt-agreement confidence estimation [41], the baseline (§6.1, PDF p. 15).

## Problem and setting

- **Question:** can wrong training mappings be found and fixed automatically, and does that raise accuracy (§3, PDF p. 7; §6, PDF p. 14)?
- **Data:** Spider's and BIRD's training sets; Spider's test set, and BIRD's dev set in place of its unpublished test set (§6.1, PDF p. 14). Detection and fixing are judged by a manual review of 500 sampled training mappings each (§6.3, PDF p. 17).
- **Corrected test sets:** four students reviewed every test mapping "after SQLDriller has provided its fix" (§2.2, PDF p. 6); accuracy on these sets is the baseline (PDF p. 7).
- **Correctness:** execution consistency on generated databases, with GPT-4's answer as reference; Def. 1 assumes "the NL query does not have ambiguity that may correspond to multiple SQL answers" (footnote 4, PDF p. 7).
- **Results compared** "on bag semantics but not set semantics used in BIRD" (footnote 3, PDF p. 6); see [bag semantics](#/glossary/bag-semantics). GPT-4 runs each question 5 times per database, majority kept (§6.1, PDF p. 15).
- **Models:** on Spider, DAIL-SQL and DIN-SQL (few-shot prompting of GPT-4, §6.2, PDF p. 15), RESDSQL and Graphix-T5 (fine-tuned T5 models); on BIRD, SFT CODES (fine-tuned) and CODES (few-shot after fine-tuning) (§6.1, PDF pp. 14–15). Candidates come from the zero-shot prompts of C3 and CHESS, two text-to-SQL systems (PDF p. 15).
- **SQL features covered, NULLs in data:** not discussed.

## Approach

1. **Candidates (§4.1, Fig. 7, PDF pp. 9–10).** A base model is prompted zero-shot, so wrong training examples can't mislead it, for 10 candidates that "differ greatly from each other in their syntax structures and used keywords", since several predictions make a correct one more likely.
2. **Hybrid checker (§4.1, Fig. 8, PDF pp. 10–11)**. Each candidate is compared with the original SQL: first on counterexamples found so far; then SQLSolver tries to prove equivalence; otherwise VeriEQL searches with a table-size bound raised from 1 to K = 10; test-suite execution is "a backup for timeouts or unreliable verification results from the verifiers".
3. **Realistic values (§4.1, Fig. 9, PDF pp. 11–12).** An age of 2147483648 or numbers as names made the LLM discard rows, so CHECK constraints limit strings to the queries' constants plus 10 GPT-proposed values, and numbers to 0–100, widened to cover the queries' constants.
4. **NL execution (§4.2, Fig. 10, PDF pp. 12–13)**. The prompt lists keys and every row and asks for a step-by-step scan; a post-processing instruction asks it to follow SQL rules it misses, such as aggregates over no rows.
5. **Scoring (§4.3, PDF p. 13; Fig. 6, PDF p. 9).** NL results are "the oracle"; each SQL scores the number of databases where it matches them. A candidate scoring above the original becomes the fix; ties at the top get new counterexamples among themselves.
6. **At answer time (§5, PDF p. 14).** A model produces several predictions; counterexamples are built among them, and the top scorer is returned.

## Results

- **Dataset errors (§2.2, Tab. 1, PDF pp. 4–5).** It reports 183 of 500 sampled Spider training mappings (36.6%) and 272 of 500 BIRD ones (54.4%) wrong, and says error rates rise with hardness. The Figure 1 error (INNER JOIN where LEFT JOIN keeps unmatched rows) recurs across Spider, and three top models repeat it (PDF p. 6).
- **Test sets (§2.2, Tab. 2, PDF p. 6)**. The review found 810 of 2147 Spider test mappings (37.7%) and 768 of 1534 BIRD dev mappings (50.1%) wrong; all six models score lower on the corrected sets.
- **Accuracy (§6.2, Tab. 4, Fig. 11, PDF pp. 15–17)**. Gains of 3.6 to 13.6 points. RESDSQL and SFT CODES gain mostly from fixed data, the GPT-4-prompted ones from selection at answer time; Graphix-T5 can't output several predictions, so gets only the data fix. The LC baseline gains less on every model and lowers some.
- **Detection (§6.3, Tab. 5, PDF pp. 17–18).** It flags 81.4% (Spider) and 76.1% (BIRD) of wrong mappings, against 11.0% and 12.3% of correct ones. The authors trace misses to missing counterexamples, mostly for lack of a correct candidate, and to wrong NL executions, which also cause every false positive.
- **Fixing (§6.3, Tab. 6, PDF pp. 18–19).** It correctly fixes 60.1% and 52.2% of wrong mappings, against 23.0% and 28.7% for LC, and changes few correct ones.
- **NL execution (§4.2, Tab. 3, PDF pp. 13–14)**. On random databases of at most 5 rows, four LLMs reach up to 91.0% accuracy on Spider and 83.2% on BIRD.
- **Error patterns (§6.4, Tab. 7, PDF pp. 19–21).** Violations grow with question and SQL length (Fig. 12). Patterns: INNER JOIN drops entities without matches; joins duplicate rows while DISTINCT merges different entities; GROUP BY or EXCEPT on a non-key column; `LIMIT 1` returns one of several tied rows, replaced by `RANK … = 1` to return all ties (a [nondeterministic query](#/glossary/nondeterministic-query) case); and domain misreadings.

## Limits the authors state

- "An incorrect SQL may also satisfy execution consistency on particular database instances" (§3.2, PDF p. 8).
- Misses occur when no candidate is correct or the LLM's answer matches a wrong SQL; false alarms when it misses a correct one (§1, PDF p. 3).
- "SQLDriller cannot fix all its detected errors" (§6.3, PDF p. 18).
- Ambiguity may go undetected if the LLM never executes another reading (§7, PDF p. 22).
- NL execution "does not scale well as the number of table records increases" (long contexts are "left as part of our future work to solve"), and is less accurate on BEAVER, an enterprise benchmark with 99 tables (§7, PDF p. 22).
- Generating training data from scratch "falls slightly short in fine-tuning models compared to fixing errors in existing datasets" (§7, PDF p. 23).

## Open problems and building blocks

  - Better candidate generation and NL execution accuracy, "subsequent optimization pathways" (§6.3, PDF p. 18).
  - "an advanced Text-to-SQL correctness condition" for ambiguous datasets, and LLMs that explore more readings (§7, PDF p. 22).
  - Consistency checking of NL execution: [self-consistency](#/glossary/self-consistency-majority-voting) is "feasible"; prompt-consistency methods suit multiple-choice questions; "left as part of future work" (§7, PDF pp. 22–23).
- **Released:** Nothing stated; the contributions name "a new test dataset derived from the Spider and BIRD benchmarks" (§1, PDF p. 4) without saying where.
- **To reuse it:** a model that outputs several candidates; SQLSolver, VeriEQL, test-suite execution; GPT-4; SQLite; 8 A100 GPUs for fine-tuning (§6.1, PDF p. 15).
- **Beyond its domain:** "automatically validating human-crafted SQLs in crowdsourcing", and SQL steps of table question-answering agents (§7, PDF p. 23).

## On this site

- **Discussed in:** [Benchmarks with checkable ground truth](#/challenges/checkable_benchmark_ground_truth) · [Minimal counterexamples](#/challenges/minimal_counterexamples) · [Equivalence of nondeterministic queries](#/challenges/nondeterministic_equivalence) · [Query equivalence: prove or refute](#/challenges/query_equivalence) · [Text-to-SQL can't be verified against intent](#/challenges/text_to_sql_verification)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/cex-llm">cex-llm</a><a class="tag sub" href="#/tags/cex-search">cex-search</a><a class="tag sub" href="#/tags/llm-assist">llm-assist</a><a class="tag sub" href="#/tags/llm-gen">llm-gen</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/nl2sql-data">nl2sql-data</a><a class="tag sub" href="#/tags/nl2sql-select">nl2sql-select</a><a class="tag sub" href="#/tags/scaling-sql">scaling-sql</a></span>
