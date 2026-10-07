# SpotIt+: Verification-based Text-to-SQL Evaluation with Database Constraints

**SpotIt+** · preprint · 2026

Read: [PDF](https://arxiv.org/pdf/2603.04334) · [arXiv](https://arxiv.org/abs/2603.04334)  
Code: [Spotit-plus](https://github.com/ai-ar-research/SpotIt-plus)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- SpotIt plus a best-effort constraint-mining pipeline, so counterexample databases are more realistic (abstract; §1).
- Rule-based specification mining over example databases, with LLM validation of the mined constraints.
- LLM as a judge inside a checker: the bounded check holds only relative to the constraints the LLM accepts, which the paper leaves to the user and does not re-check (§IV-B; §1); constraints rule out some counterexamples (Tab. III); the authors hypothesize that most only make counterexamples more realistic (§V-A).

## In plain words

[Text-to-SQL](#/glossary/text-to-sql) systems turn a question into an SQL query. Benchmarks compare its result with a human-written reference query's on one test database, where two different queries can agree by chance (§I). The authors' earlier tool, SpotIt, uses a logic solver to search for a small database on which the two disagree, which may be impossible or unlikely in practice (§I). SpotIt+ reads the benchmark's example databases, collects rules the data seems to follow (value ranges, allowed values, columns never missing a value, links between columns), asks an LLM which rules hold generally and which ranges to widen, and makes the search obey them (abstract). On the BIRD benchmark's development questions, checking databases of up to five rows per table, the method ranked first by the official test scores 71.32% there, 60.10% under SpotIt and 63.43% under SpotIt+ (§V). The authors report more realistic disagreeing databases (abstract) and call the mining "best-effort" (abstract).

## Background and terms

**Terms to know:** [gold query](#/glossary/gold-query) · [execution accuracy](#/glossary/execution-accuracy) · [query equivalence](#/glossary/query-equivalence) · [bounded verification](#/glossary/bounded-verification) · [counterexample database](#/glossary/counterexample-database) · [SAT and SMT solvers](#/glossary/sat-and-smt-solvers) · [integrity constraint](#/glossary/integrity-constraint)

**The paper's own terms:**
- **bounded equivalence**: two queries are "boundedly equivalent" when they return the same result on every database of the schema in which each table has at most K rows (§II); the "Equivalent" outcome of Fig. 2 means this.
- **K, two senses**: the row bound per table in the check (§II; set to 5 in §V), and, separately, the cutoff for categorical constraints: columns with at most K distinct values, "by default set to 30" (§IV-B; App. A-A says 2–30 values).
- **SpotIt+, two senses**: the tool (§I), and the name of its third configuration in §V, the one with LLM-validated constraints.
- **database constraints / domain constraints**: implicit rules that the schema doesn't state but data should obey (§I); SpotIt+ mines them from the example database and adds them to the formula's constraint part (see Approach) next to the schema's keys (§II-A).
- **example database / test database**: the benchmark's own database, used both by the official metric and for mining (§IV-B, §III).
- **the five constraint types** (§IV-A): **Range** (a numeric column stays within an interval), **Categorical** (a column takes values from a fixed finite set), **NotNull** (a column is never NULL), **Functional Dependencies** ([functional dependency](#/glossary/functional-dependency): one column's value determines another's), **Ordering Dependencies** (in every row one numeric column is ≤, or ≥, another).
- **EX-TEST, EX-SpotIt, EX-SpotIt+-noV, EX-SpotIt+**: accuracy under BIRD's official test-based metric (running both queries on the test database), and accuracy when each of the three configurations (see Approach) is then run on the predictions EX-TEST accepts (§V, Tab. III).
- **strict, loose and semantic bounds** (App. A-A): three candidate ranges for a numeric column: observed minimum and maximum; Tukey's fence (an outlier rule: the middle 50% of values widened by three times its width on each side, floored at 0 when no value is negative); and a range an LLM proposes from column metadata and samples (e.g. ages 0–120).

**Missing glossary terms:** none.

**Builds on:**
- SpotIt ([SpotIt](#/papers/klopfenstein2025spotit "SpotIt: Evaluating Text-to-SQL Evaluation with Formal Verification (2026)")): SpotIt+ "goes beyond an open-source implementation" of its verification pipeline (§I); prior work used only the schema's constraints (§IV).
- VeriEQL ([VeriEQL](#/papers/he2024verieql "VeriEQL: Bounded Equivalence Verification for Complex SQL Queries with Integrity Constraints (2024)")): the bounded equivalence checker SpotIt+ runs on, which encodes SQL for the Z3 SMT solver (§II-A).
- BIRD ([BIRD](#/papers/li2023bird "Can LLM Already Serve as A Database Interface? A BIg Bench for Large-Scale Database Grounded Text-to-SQLs (2023)")): a large text-to-SQL benchmark, cited through its leaderboard site (§V).

## Problem and setting

- **Question:** solver-found counterexamples may be "impossible or unlikely to arise in practice" (§I); can the search keep to plausible databases and still find what test-based scoring misses (§I, §V)?
- **SQL fragment:** VeriEQL's: joins, aggregations, subqueries and set operations, with keys and uniqueness constraints (§II-A). The authors state "to the best of our knowledge" that it is the most expressive fragment among bounded checkers (§II-A).
- **Semantics:** results are compared as sets ([set semantics](#/glossary/set-semantics)), following text-to-SQL evaluation convention; this "can be adjusted" (§II-A).
- **NULLs:** the checker builds counterexamples with NULL values, and NotNull constraints rule them out for columns that have none in the data (§IV-A; App. B).
- **Bound and resources:** at most 5 rows per table, because SpotIt found the extra counterexamples "marginal" from a bound of 3 on (§V); one core, 8 GB and a 600-second CPU timeout per pair (§V).
- **Data:** BIRD's dev set, 1,534 questions over 11 databases (§V, Tab. I), and the predictions of 10 text-to-SQL methods taken from the BIRD leaderboard (§V, Tab. II), e.g. CSC-SQL (a method that has a model revise its most frequent sampled queries) run with a XiYanSQL code model, labelled CSC-32B.
- **Correct:** a prediction counts as correct if it is boundedly equivalent to the gold query under the chosen constraints (§IV).

## Approach

- **Bounded check (§II-A):** both queries are run by [symbolic execution](#/glossary/symbolic-execution) on a database of K unknown rows per table. One SMT formula joins the constraints, both queries' meanings and the assertion that the outputs differ: unsatisfiable means boundedly equivalent; a solution decodes into a counterexample database. SpotIt+ adds the mined constraints to the constraint part (§II-A).
- **Workflow (Fig. 2):** inputs are the question, gold query and example database; mining and validation run offline once per database (§V); the check returns "Equivalent" or "Neq" with a counterexample.
- **Specification mining (§IV-B; App. A-A):** SpotIt+ mines five types of constraints (§IV-A). Ranges come from each numeric column's minimum and maximum. Categorical constraints cover columns with at most 30 distinct values (the default). NotNull covers columns with no NULLs. Functional and ordering dependencies are mined over "non-primary" column pairs, i.e. columns outside the primary key (§IV-B); a functional dependency is accepted when grouping by one column gives a single value of the other (App. A-A).
- **LLM validation and repair (§IV-B):** for each constraint, a prompt asks whether it "holds beyond the test database"; for numeric columns, the LLM also judges whether the range is too tight and picks strict, loose or semantic bounds (App. A-A). "In our experiments, the LLM validator chose between strict and semantic bounds" (App. A-A). The model is OpenAI's gpt-5.1 in JSON mode (App. A-B); Listing 1 (App. A-C) shows the prompt for categorical constraints.
- **Three configurations (§V):** SpotIt (no mined constraints, called "the configuration used in prior work"), SpotIt+-noV (all mined constraints, no LLM validation) and SpotIt+ (LLM-validated constraints).
- **Motivating example (§III, Fig. 1):** a generated query uses "> 8000" where the gold query includes 8000. SpotIt's counterexample uses placeholder strings; SpotIt+'s uses real values such as 'Prague', which the authors call "qualitatively more realistic" (§III). With unvalidated constraints, the mined range of the income column excludes 8000 and no counterexample exists; the authors write that "the LLM validation pass relaxes it" (§III).
- No theorems.

## Results

- **Mining cost and yield (§V):** mining took about 5 minutes for the 11 databases; validating the 6,264 mined constraints through the OpenAI API took about 2.5 hours and kept 1,916.
- **Accuracy (Tab. III):** the authors report that all three verification configurations find "substantially more discrepancies" than EX-TEST (§V-A). For CSC-32B: 71.32% (rank 1) under EX-TEST, 60.10% under SpotIt, 63.56% under SpotIt+-noV, 63.43% (rank 2) under SpotIt+.
- **Effect of the constraints (§V-A):** both constrained configurations deem more pairs equivalent than SpotIt; LLM validation does "not lead to a substantial change" against SpotIt+-noV. The authors "hypothesize" that most constraints only make counterexamples more realistic.
- **Realism:** the authors point to §III and four examples in App. B. In Example D.1 (Fig. 3), mined NotNull constraints rule out SpotIt's counterexample; in D.2 (Fig. 4) too. In D.3, SpotIt+-noV finds no counterexample while SpotIt and SpotIt+ find "valid counterexamples". In D.4 (Fig. 5) all three find one, and the authors credit both constrained configurations with realistic values.
- **Runtime (Tab. IV):** mean time per counterexample of 1.7 s for SpotIt, 1.4 s for SpotIt+-noV and 0.9 s for SpotIt+, with medians below 0.6 s; the authors attribute the reductions to "the restricted search space" (§V-A).

## Limits the authors state

- "constraint extraction is inherently a best-effort procedure, and SpotIt+ does not claim to fully solve the challenge of realistic Text-to-SQL evaluation" (§I).
- "the ultimate assessment of realism rests with human judgment" (§I); the user decides which constraints to include (§IV-B).
- Purely rule-based mining "risks overfitting to idiosyncrasies of the example databases" (§I).
- VeriEQL encodes 93–97% of the examined pairs across the ten methods; "closing the remaining gap is an important next step" (§V-A).

## Open problems and building blocks

  - richer extraction of cross-table constraints, possibly with data-profiling tools (which discover dependencies in data) such as Metanome, and their SMT encodings;
  - extending the checker to larger SQL fragments;
  - combining user-specified domain knowledge with automatic extraction;
  - constraint-enhanced verification for SQL tasks beyond text-to-SQL evaluation.
- **Released:** SpotIt+ as "an open-source verification-based tool" (§I, contributions and footnote 1), and "An artifact that contains scripts to reproduce our experiments" (§V).
- **To reuse it:** VeriEQL with Z3 (§II-A); an OpenAI model (gpt-5.1) for validation (App. A-B); an example database per schema to mine from (§IV-B); about 2.5 hours of API calls for the 11 BIRD databases (§V).

## On this site

- **Discussed in:** [Minimal counterexamples](#/challenges/minimal_counterexamples) · [Equivalence under schema constraints](#/challenges/schema_constrained_equivalence) · [Text-to-SQL can't be verified against intent](#/challenges/text_to_sql_verification)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/bounded-smt">bounded-smt</a><a class="tag sub" href="#/tags/cex-llm">cex-llm</a><a class="tag sub" href="#/tags/cex-smt">cex-smt</a><a class="tag sub" href="#/tags/llm-assist">llm-assist</a><a class="tag sub" href="#/tags/nl2sql-eval">nl2sql-eval</a></span>
