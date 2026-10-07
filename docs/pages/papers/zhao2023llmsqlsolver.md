# LLM-SQL-Solver: Can LLMs Determine SQL Equivalence?

**LLM-SQL-Solver** · IEEE BigData 2025

Read: [PDF](https://arxiv.org/pdf/2312.10321) · [arXiv](https://arxiv.org/abs/2312.10321) · [DOI](https://doi.org/10.1109/BigData66926.2025.11401595)  
Code: [LLM-SQL-Solver](https://github.com/ZhaoFuheng/LLM-SQL-Solver)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Asks whether LLMs can judge semantic and relaxed SQL equivalence.
- Prompting techniques "Miniature & Mull" and "Explain & Compare".

## In plain words

Whether two SQL queries always return the same result matters to [query optimizers](#/glossary/query-optimizer) and to grading [text-to-SQL](#/glossary/text-to-sql) systems; the authors note it is [undecidable](#/glossary/decidable-and-undecidable) in general and provers (tools that prove equivalence) support only limited SQL (§1). They ask whether GPT models can judge two kinds of equivalence: the same output on every possible database, and a looser "pragmatic" kind, giving the user the same practical information (§2). For the first, their prompt has the model run both queries on a tiny database it invents, then, if outputs match, alters it seeking differing ones; for the second, a prompt to explain both queries, then compare them (§3). They report the first prompt beat plain step-by-step prompting in every setting, by more than 30 points for GPT-3.5-Turbo on equivalent pairs (§4). On 70 pairs randomly chosen where an LLM verdict and the usual result comparison disagreed, the second prompt's verdicts matched the experts' majority on 68.6–78.6%, against 40.0% for the result comparison (§4). They claim, "To the best of our knowledge", the "first work" on LLMs judging SQL equivalence (§6).

## Background and terms

**Terms to know:** [query equivalence](#/glossary/query-equivalence) · [counterexample database](#/glossary/counterexample-database) · [text-to-SQL](#/glossary/text-to-sql) · [gold query](#/glossary/gold-query) · [execution accuracy](#/glossary/execution-accuracy) · [LLM-as-a-judge](#/glossary/llm-as-a-judge) · [decidable and undecidable](#/glossary/decidable-and-undecidable) · [query rewriting and rewrite rules](#/glossary/query-rewriting-and-rewrite-rules) · [exact match](#/glossary/exact-match) ("exact SQL string match", which the authors say "may overlook many equivalent SQL queries", §1)

**The paper's own terms:**
- **semantic equivalence**: two queries are semantically equivalent "if and only if there does not exist a database instance such that Q1 and Q2 return different outputs" (Def. 2.1), i.e. the glossary's query equivalence.
- **pragmatic equivalence** (the abstract calls it "relaxed equivalence"): two queries "produce outputs that convey the same practical or meaningful information for the intended user, even if the outputs differ in format, structure, or additional details" (Def. 2.2). Borrowed from translation studies (§2.1.1). The authors argue that the two COUNT-bug queries are pragmatically equivalent (§2.1.1).
- **execution match (EX)**: run both queries on the benchmark's database and compare the outputs (§1); the paper's name for execution accuracy, computed with the ChatGPT-sql project's evaluation code (§4.1).
- **COUNT bug**: the paper's motivating example (§2.1), which it calls "a query rewriting error that happened in the real-world system". Q1 compares each part's `qoh` with a COUNT of its Supply rows with `shipdate < 10`, in a [correlated subquery](#/glossary/correlated-subquery); Q2 precomputes these counts per part in a grouped temporary table and joins it. A part whose `qoh` is zero and that has no Supply rows is returned by Q1 but not by Q2.
- **CoT, M&M, E&C**: the chain-of-thought baseline prompt, Miniature & Mull, and Explain & Compare (§3).
- **Human Prefer** (Tab. 4): the share of the 70 expert-labelled pairs on which a judge's verdict matches the experts' majority label (§4.3.2).
- **LLM-SQL-Solver**: the authors' name for their LLM judge, under either notion (§5.1).

**Builds on:**
- Chain-of-thought prompting (Wei et al. 2022), with Tree of Thoughts and Rephrase-and-Respond, motivates the prompts; CoT is the baseline, and E&C "follows the main ideas from the chain-of-thoughts" (§3).
- Test-suite evaluation (Zhong et al. 2020, [Semantic Evaluation for Text-to-SQL…](#/papers/zhong2020testsuite "Semantic Evaluation for Text-to-SQL with Distilled Test Suites (2020)")), which generates many databases to compare queries; the authors cite its cost, "at least 75 minutes and consumes about 3 GB of storage" for a thousand pairs (§1).
- The SQL provers Cosette ([Cosette](#/papers/chu2017cosette "Cosette: An Automated Prover for SQL (2017)"), an [SMT](#/glossary/sat-and-smt-solvers)-based counterexample search plus a [Coq](#/glossary/proof-assistant) prover) and WeTune ([WeTune](#/papers/wang2022wetune "WeTune: Automatic Discovery and Verification of Query Rewrite Rules (2022)"), a rewrite-rule generator with a built-in verifier), which the authors call unsuitable "for direct use" on text-to-SQL benchmarks, whose queries often include EXISTS, UNION and UNION ALL and whose schemas don't exclude NULLs (§1).

## Problem and setting

- **Questions** (§1): "Can LLMs help data engineers in identifying SQL semantic equivalence?" and "Should LLMs be used to evaluate text-to-SQL generation?"
- **Models** (§4): GPT-3.5-Turbo and GPT-4o through the OpenAI API, temperature 0 (greedy decoding), max tokens 4096. The five static examples are three equivalent and two inequivalent pairs, for each notion; a pragmatic example counts `SELECT birth_country FROM player` and `SELECT birth_city FROM player` as equivalent (§4).
- **Data for semantic equivalence** (§4.1): 232 equivalent pairs from the Calcite test suites (Apache Calcite is a query-processing framework; the set is cited to Begoli et al. and to [SQLSolver](#/papers/ding2023sqlsolver "Proving Query Equivalence Using Linear Integer Arithmetic (2023)")), and 180 inequivalent pairs, each a Spider gold query against a prediction of DAIL-SQL (a GPT-4-based text-to-SQL system, §4.3), inequivalent "Because they have different execution outputs" on Spider's databases. Spider ([Spider](#/papers/yu2018spider "Spider: A Large-Scale Human-Labeled Dataset for Complex and Cross-Domain Semantic Parsing and Text-to-SQL Task (2018)")) is a cross-domain text-to-SQL benchmark run on SQLite (§3).
- **Data for text-to-SQL judging:** gold queries against the outputs of three systems on the Spider questions of Tab. 2 (248 easy, 446 medium, 174 hard, 166 extra) (§4.3); and 70 pairs, gold against LLM-generated, each labelled by at least three SQL experts with a majority vote (§4.1), "randomly selected from cases where an LLM's judgment disagreed with the execution match metric" (§4.3.2).
- **Prompt context** (§3): the schema with its primary and foreign keys. CoT and M&M state that string comparison is case-sensitive, since Spider's SQLite is case-sensitive by default; E&C states "Database contains no NULL values".
- Whether Def. 2.1 compares outputs as [sets](#/glossary/set-semantics), [bags](#/glossary/bag-semantics) or ordered [lists](#/glossary/list-semantics): not discussed.

## Approach

- **CoT baseline** (§3): asks the model to decide equivalence step by step. The authors call it "generally effective" but observe that it "often yields suboptimal results", particularly when models focus "on obvious similarities" rather than nuanced differences (§3, Fig. 1).
- **Miniature & Mull** (§3): the model first executes both queries on a simple database; if the outputs match, it adjusts the database (e.g. updating rows) and watches how the outputs change; differing outputs indicate a counterexample. The model itself does the executing, on "self-generated database instances" (§4.2).
- **Explain & Compare** (§3): motivated by LLMs' tendency to call queries equivalent on structural and semantic similarity, the model first explains both queries' high-level objectives, then decides whether they "contain aligned logic or significant differences".
- **Fig. 1** (PDF p. 5) runs all three on a `MIN` subquery against `ORDER BY … LIMIT 1`: CoT wrongly says equivalent, M&M finds a database with tied minimum rows, E&C says pragmatically equivalent.

## Results

- **Semantic equivalence** (Tab. 1, §4.2): the authors report that M&M "always provides a higher accuracy" than CoT. For GPT-3.5-Turbo on the Calcite equivalent pairs, CoT 53% → M&M 85% (0-shot). For GPT-4o, its four CoT cells are 81–85% against 84–89% for M&M.
- **Few-shot** (§4.2): "in general, adding few-shot demonstrations improves accuracy", but on inequivalent pairs five examples cause "a significant drop" for GPT-3.5-Turbo with both prompts and "only a slight accuracy decline" for GPT-4o.
- **GPT-4o** "reliably identifies" the difference between `ORDER BY ASC/DESC LIMIT 1` and `WHERE col = (SELECT MIN/MAX(col))`, which GPT-3.5-Turbo often misses (§4.2).
- **GPT-3.5-Turbo's failures** on inequivalent pairs (§4.2): it "often failed" to tell distinct from duplicated rows; "often fails" to follow the case-sensitivity instruction; "may also fail" to see differences in column names (`AVG(capacity)` vs `avg_capacity`); and in M&M "often returns incorrect results" on its own databases or calls identical outputs different, a hallucination with a "snowballing effect" (one wrong step leading to more).
- **Ranking text-to-SQL systems** (Tab. 2, §4.3): DAIL-SQL (GPT-4, few-shot, [self-consistency](#/glossary/self-consistency-majority-voting); first on the Spider leaderboard), DIN-SQL (GPT-4, few-shot, subtasks such as [schema linking](#/glossary/schema-linking); fourth), Chat-SQL (GPT-3.5-Turbo, zero-shot) (§4.3). EX and both LLM judges (E&C, five examples) rank them in the same order. LLM judgments "are less strict than the execution match metric" (e.g. Chat-SQL 70.1% under EX against 86.8% under GPT-3.5-Turbo); the authors place the main differences in hard and extra questions (§4.3).
- **Agreement with EX** (Tab. 3, §4.3.1): "76% to 90%"; the authors suggest LLMs, "when guided by pragmatic equivalence", "can provide a scalable and reliable alternative", reducing "the dependence on expensive database creation".
- **Human preference** (Tab. 4, §4.3.2): EX 40.0%; GPT-3.5-Turbo 72.9% (0-shot) and 74.3% (5-shot); GPT-4o 68.6% and 78.6%. The authors conclude that with E&C, LLMs "are consistently better aligned with human preference than execution match" and that LLM-judgment accuracy "is a better optimization target than EX".

## Limits the authors state

- "challenges still persist" (abstract); LLMs "can assists engineers in determining semantic equivalent queries, but may yield incorrect responses" (§6).
- "LLMs may hallucinate in executing the queries over simple databases" (§5.2).
- Semantic equivalence is, they "believe", "an inherently challenging task for LLMs"; few-shot examples "may not always suffice", particularly where differences are "subtle or deeply tied to specific database schema (e.g., Primary Key and Foreign Key relationships)" (§4.2).
- The pragmatic evaluation uses 70 pairs, a set the authors call "relatively small"; labelling is "time-consuming", taking even experienced experts "approximately 10 minutes" per pair (§5.2).
- "pragmatic equivalence is often highly subjective" (§5.2); the pairs where LLMs disagree with the experts "often lack unanimous agreement among experts", e.g. the Alton example split two experts against one (§4.3.2).

## Open problems and building blocks

  - Equip LLMs "with tools such as Python pandas library" to observe execution results; the authors "believe" M&M's accuracy would then increase (§5.2).
  - Customizable text-to-SQL evaluation metrics tailored to individual users, e.g. through in-context learning (§4.3.2, §5.2).
  - Expanding the labelled dataset "would allow for a more robust analysis" (§5.2).
  - Proposed uses (§5.1), some as beliefs: the semantic judge to find system bugs such as the COUNT bug, validate rewriting code and "explore more SQL rewrite possibilities"; the pragmatic judge as a text-to-SQL metric that needs neither constructed databases nor access to stored data (§5.1, §6).
- **Released:** Nothing stated.
- **To reuse it:** an OpenAI GPT model (GPT-3.5-Turbo or GPT-4o), temperature 0, 4096 max tokens (§4); a prompt with both queries and the schema with primary and foreign keys (§3). No database access is needed for judging (§5.1, §6). No SQL fragment is stated.
- **Beyond its domain:** the authors "believe" M&M "has wide applications in comparing the equivalence of two codes, plans, and logic" (§3).

## On this site

- **Discussed in:** [Benchmarks with checkable ground truth](#/challenges/checkable_benchmark_ground_truth) · [Equivalence of nondeterministic queries](#/challenges/nondeterministic_equivalence) · [Text-to-SQL can't be verified against intent](#/challenges/text_to_sql_verification)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/judge-sql">judge-sql</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/nl2sql-eval">nl2sql-eval</a></span>
