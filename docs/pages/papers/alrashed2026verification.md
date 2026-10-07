# Developing and Benchmarking Verification Algorithms to Improve Text-to-SQL Generation

**Developing and Benchmarking Verification…** · PVLDB 19(11) 2026

Read: [PDF](https://www.vldb.org/pvldb/vol19/p3732-alrashed.pdf) · [DOI](https://doi.org/10.14778/3836663.3836721)  
Code: [nl2sql-verification](https://figshare.com/s/c88a751bc29d9751816b)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Develops and benchmarks verification algorithms that decide whether generated SQL answers the question.
- Two LLM verifiers, Round-Trip Critique (SQL → English question → compare) and Synthetic Execution (the LLM builds a small test database and expected answer), against an SQL Critique baseline (§3.1).
- Prior work for the SQL ↔ text loop's checking step: requiring all three verifiers to accept rejects 63.6% of incorrect SQL (Tab. 5); the abstract credits "64%" to the two new ones alone.

## In plain words

Model-written SQL can run yet return believable wrong data: "failures are deceptive" (§1, PDF p. 2). They treat checking a query against the question, without a reference answer, as its own task, with two model-based checkers: one turns the SQL back into a question and compares it with the original; the other has the model invent a tiny database and the answer it expects, then runs the SQL on it. They test them on a strong generator's right and wrong queries. The abstract reports "flagging 64% of errors from a state-of-the-art generator"; that in three public benchmarks "over two-thirds of “generator failures” actually stem from flawed benchmark labels"; abstaining when a checker rejects trades answered questions for accuracy (§7.3, PDF p. 11). They frame the advance as treating verification "as a standalone task" (abstract, PDF p. 1).

## Background and terms

**Terms to know:** [text-to-SQL](#/glossary/text-to-sql) · [gold query](#/glossary/gold-query) · [execution accuracy](#/glossary/execution-accuracy) · [query equivalence](#/glossary/query-equivalence) · [decidable and undecidable](#/glossary/decidable-and-undecidable) · [selective prediction](#/glossary/selective-prediction)

**The paper's own terms:**
- **verifier** `V(q, s, d) ↦ v` (maps its inputs to a verdict `v`): judges, at answer time and without gold SQL, whether candidate SQL `s` matches question `q` for schema `d`. *Binary* verifiers accept or reject; *scoring* verifiers give 1–5 and accept at or above a threshold τ (§3, PDF pp. 2–3).
- **FAR / FRR** (False Acceptance / Rejection Rate): the share of incorrect SQL accepted, and of correct SQL rejected, with correctness taken from execution accuracy against the gold SQL; rejecting a gold SQL is a false reject (§5.1.2, PDF p. 5).
- **execution accuracy** here: generated and gold SQL give the same result on the benchmark database, compared as multisets (duplicates count) with column order ignored; row order counts only when the gold SQL has `ORDER BY` (§4.2, PDF p. 5).
- **Scenario 1 / 2**: gold SQLs that the Synthetic Execution Consistency verifier (SE) rejects while accepting, or also rejecting, the generated SQL for the same question (§6.2, PDF p. 8).
- **issue types**: *data/instance incorrectness* (gold SQL wrong on its database), *semantic incorrectness* (right there by chance), *ambiguity* (several valid readings) (§6.1, PDF p. 8).
- **selective** vs. **total** generator: one that may abstain vs. one that always answers. **Coverage** φ: share of questions answered; **selective accuracy** A_sel: share of answers that are correct; **Utility@X** = (correct − X · incorrect) / all questions, abstentions scoring 0, from TrustSQL [16] (see Builds on) (§7, §7.2–7.3, PDF pp. 10–11).

**Missing glossary terms:**
- **Likert scale**: a rating on a few ordered levels, here 1 (no alignment) to 5 (perfect equivalence) (§3, PDF p. 3).

**Builds on:**
- Round-trip correctness for code [1] ([Round-Trip Correctness (RTC)](#/papers/allamanis2024roundtrip "Unsupervised Evaluation of Code LLMs with Round-Trip Correctness (2024)")), adapted by Round-Trip Critique (RT) (§1, PDF p. 1).
- Offline test-database generation [11, 31, 42], moved to answer time by SE (§1, PDF p. 1), among them SynSQL [11] ([SynSQL](#/papers/habibollah2026synsql "SynSQL: Synthesizing Relational Databases for Robust Evaluation of Text-to-SQL Systems (2026)")) and test-suite accuracy [42] ([Semantic Evaluation for Text-to-SQL…](#/papers/zhong2020testsuite "Semantic Evaluation for Text-to-SQL with Distilled Test Suites (2020)")).
- TrustSQL [16], penalty-based scoring for generators that may abstain: its error detector ERROR_P is the baseline (§3.1, PDF p. 3), its metric Utility@X (§7.2, PDF p. 11).

## Problem and setting

- **Question:** can an LLM tell whether candidate SQL satisfies a question, without gold SQL or the live database, and so make generators more reliable (§1, PDF p. 2)?
- **SQL:** whatever the generator writes; no fragment is fixed. Correctness is execution accuracy under the multiset rule above (§4.2, PDF p. 5).
- **Benchmark:** built from the development sets (§4.2, PDF p. 5) of Spider (cross-domain questions over 200 databases), BIRD (large real-world databases) and KaggleDBQA (544 analytical questions over eight Kaggle databases) (§4.1, PDF p. 4). Candidates come from Chung et al.'s long-context generator [5] (§4.2, PDF p. 5), whose mistakes serve as "near misses", plausible but subtly wrong SQL (§4.2, PDF p. 4); all are labelled by execution accuracy against the gold SQL.
- **Model:** gemini-2.5-pro behind every method (§5.1.1, PDF p. 5).
- **NULLs:** only as edge cases in SE's test data (§3.3, PDF p. 3).

## Approach

- **SQL Critique (SC), the baseline (§3.1, PDF p. 3):** TrustSQL's ERROR_P prompt judges question, SQL and schema correct or incorrect.
- **RT (§3.2, PDF p. 3):** a model writes a question from the SQL and schema, without seeing the original; a critique model scores original against new question from 1 to 5; below τ = 4 the SQL is rejected (§5.2.1, PDF p. 6). The authors tried continuous, binary and Likert scales and chose 5-point Likert.
- **SE (§3.3, PDF p. 3):** the model makes several test pairs (a small database and an expected answer), either answer-first (answers, then a database yielding them) or data-first (database, then its answer); SE accepts when the SQL's result on the synthetic database equals the expected answer. Its premise: a small database with a clear answer is "significantly easier for an LLM" than flawless SQL. Synthetic data allows injected edge cases (zeros, NULLs, duplicates, empty tables).
- **Combinations (§5.2.4, PDF p. 6):** all AND (all accept) and OR (one accepts) combinations.
- **Benchmark audit (§6.2, PDF pp. 8–9):** only gold SQLs that SE rejected are sampled, so the count of wrong gold SQLs is a lower bound; 15 hand-judged samples from each of six populations (two scenarios × three benchmarks), scaled up with the standard binomial estimator and 99% confidence intervals (CI).
- **Selective generation (§7, PDF p. 10):** abstain when the verifier rejects.

## Results

- **Verifier accuracy (Tab. 2, Tab. 5, PDF pp. 6–7)**: FAR/FRR of SC 0.775/0.062, RT 0.658/0.158, SE 0.595/0.169; all three ANDed 0.364/0.326, called the most conservative; all three ORed 0.914/0.012. The abstract credits RT and SE with "flagging 64% of errors".
- **Variations (Tab. 3–4, PDF pp. 6–7)**: few-shot prompts make verifiers more permissive, though "for most the change is minor"; across benchmarks and difficulties "no standout trend".
- **Failure modes (§5.2.5, PDF pp. 6–7):** in 40 hand-checked cases, RT AND SE rejects correct SQL written another way, and accepts SQL with wrong output columns or loosened conditions.
- **Independence (§5.2.6, PDF p. 7):** combined error rates are close to what independent errors predict, with a "complementary effect" for RT OR SE; the authors conclude the verifiers capture "orthogonal signals".
- **Benchmark errors (Tab. 7, §6.3, PDF p. 9):** of 1067 gold SQLs SE rejected, an estimated 673.6 are incorrect, 99% CI (359, 910). In the 90 samples, incorrect benchmark SQL leads, then verifier errors (e.g. missing heights coded as −1 in synthetic data), then ambiguous questions.
- **SE re-estimated (§6.4, PDF p. 10):** correcting for wrong gold SQLs, SE's FRR drops from 0.169 to ≈0.042 (99% CI [0.018, 0.086]) and FAR from 0.595 to ≈0.412 ([0.325, 0.498]).
- **Selective generation (Tab. 8, §7.3, PDF p. 11):** the generator alone answers all with selective accuracy 0.730; with all three verifiers ANDed, 0.831 at coverage 0.592; Utility@1 falls from 0.459 to 0.392, Utility@2 rises from 0.189 to 0.292.

## Limits the authors state

- Inherited label noise (wrong gold SQL, chance matches, ambiguous questions) may penalize correct flags (§4.2, PDF p. 5).
- SE's higher FRR comes largely from failures of the test itself, such as hallucinated synthetic data, and from wrong gold SQL (§5.2.1, PDF p. 6).
- The audit is a lower bound: wrong gold SQLs SE accepted can't easily be found; summed intervals are conservative (§6.2, PDF pp. 8–9).
- TrustSQL's unanswerability classifiers aren't public, so weren't included (§7.1, PDF p. 10).
- The incorrect examples may miss future generators' subtler errors (§8, PDF p. 12).
- Order counted only under `ORDER BY` is "an imperfect proxy" (§8, PDF p. 12).
- SE "does not yet guarantee exhaustive coverage of adversarial edge cases"; stress-testing all constraints is too costly at answer time (§8, PDF p. 12).
- Combinations cost 4 calls and over 90 s (§5.3, PDF p. 8).
- A single score like Utility@X needs an arbitrary penalty X, so they recommend reporting coverage and accuracy separately (§7.2, PDF p. 11).

## Open problems and building blocks

- **Open:** adversarial prompting and formal SQL equivalence methods for harder synthetic data; learned meta-classifiers or mixing weights instead of AND/OR; several databases per benchmark question (all §8, PDF p. 12); benchmarks rewarding answers to every reading of an ambiguous question, or clarification (§8, PDF p. 11); human label validation (§4.2, PDF p. 5); prompting SE to return only requested data (§6.3, PDF p. 9).
- **Released:** the verification benchmark (with an order-matters column, §8, PDF p. 12), implementations of all methods, prompts and evaluation scripts (§1, PDF p. 2; "PVLDB Artifact Availability", PDF p. 1).
- **To reuse it:** an LLM (gemini-2.5-pro, §5.1.1, PDF p. 5) and the schema as input (enriched here with column descriptions, example values and statistics, §4.2, PDF p. 5); no gold SQL or live database (§1, PDF p. 2); SE executes SQL on its synthetic databases (§3.3, PDF p. 3); per verification SC takes 1 LLM call (8.06 s), RT and SE 2 calls (41.39 s, 51.22 s) (Tab. 6, PDF p. 8).

## On this site

- **Discussed in:** [Text-to-SQL can't be verified against intent](#/challenges/text_to_sql_verification)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/cex-llm">cex-llm</a><a class="tag sub" href="#/tags/judge-sql">judge-sql</a><a class="tag sub" href="#/tags/llm-assist">llm-assist</a><a class="tag sub" href="#/tags/llm-gen">llm-gen</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/nl2sql-data">nl2sql-data</a><a class="tag sub" href="#/tags/nl2sql-select">nl2sql-select</a></span>
