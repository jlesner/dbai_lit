# Human-Level Text-to-SQL via Reinforcement Learning on Verified Data, Without Pipeline Engineering

**ReViSQL** · preprint · 2026

Read: [PDF](https://arxiv.org/pdf/2603.20004) · [arXiv](https://arxiv.org/abs/2603.20004)  
Code: [ReViSQL](https://github.com/uiuc-kang-lab/ReViSQL)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- RLVR text-to-SQL trained on BIRD-Platinum, a re-verified slice of BIRD Train.
- Its ReViSQL-BIRD variant cuts the reward to 0.8 when VeriEQL refutes equivalence to the gold query (§4.2, App. E.5); plain ReViSQL is result-only (Table 6).
- The authors name annotation errors the dominant bottleneck for RLVR on text-to-SQL (abstract); puts a bounded checker (VeriEQL, run without integrity constraints, App. D and code) in an RL reward.

## In plain words

Text-to-SQL systems turn an English question into a database query. The authors note that the top systems on the BIRD text-to-SQL leaderboard, LLM pipelines, still trail human experts, and argue that annotation errors in the training data mislead reinforcement learning (abstract, §1). SQL experts corrected 2.5k BIRD training problems in independent rounds; the authors trained large open models on them, rewarding queries whose results match the reference. A second recipe adds two reward changes: a lower reward when an equivalence checker shows the query differs from the reference, and penalties when the model skips the problem's hint text (§4). Their best model scores 93.8% with greedy decoding on an expert-corrected BIRD evaluation set, against the 92.96% human score from BIRD's test set, and beats every pipeline the authors ran on it. They present it as "the first method to achieve human-level accuracy" (abstract) and suggest "a paradigm shift from system design to high-quality data curation" (§1).

## Background and terms

**Terms to know:** [text-to-SQL](#/glossary/text-to-sql) · [gold query](#/glossary/gold-query) · [execution accuracy](#/glossary/execution-accuracy) · [RLVR](#/glossary/rl-with-verifiable-rewards-rlvr) · [GRPO](#/glossary/grpo) · [bounded verification](#/glossary/bounded-verification) · [query equivalence](#/glossary/query-equivalence) · [reward hacking](#/glossary/reward-hacking) · [reward shaping](#/glossary/reward-shaping) (§4) · [outcome vs process reward](#/glossary/outcome-and-process-rewards)

**The paper's own terms:**
- **BIRD-style problem**: a question, a database, and *external knowledge* entries (BIRD's *evidence*): short hints that map words of the question to database values (§4.1).
- **BIRD-Platinum**: the 2.5k instances sampled at random from BIRD Train and corrected (§1, §3).
- **ReViSQL**: RLVR on BIRD-Platinum with the base prompt and a result-only reward (§1; Tab. 6). **ReViSQL-235B**: Qwen3-235B-A22B (an open-weight model) trained this way.
- **ReViSQL-BIRD**: a reward-shaping method (§4); as configured, also the evidence-structured prompt, which asks for the requirement and verification blocks below (App. E.2, Tab. 6). **ReViSQL-BIRD-K2.6**: Kimi-K2.6, "one of the best open-source LLMs" (§1), trained with it.
- **Three senses of "verification"**: experts re-checking a correction (§3.2 Stage 3), the sense of "verified data"; checking query equivalence with VeriEQL (§1, §4.2); and the model's "verification" block on evidence use (§4.2, App. E.2).
- **Result-based reward**: 1 if the query returns the gold result on the example database, else 0 (§4.1). **False positive reward**: it accepts the query "while VeriEQL refutes its semantic equivalence to the gold" (§4.1).
- **Verification-aware outcome reward** (Eq. 3, §4.2; App. E.5): 0 if results differ; 1 if they match and VeriEQL says equivalent, times out or can't handle the query; 0.8 if they match but VeriEQL refutes equivalence.
- **Process penalties** (Eq. 2; App. E.5): 0.1 off for a missing "requirement" block (evidence turned into query constraints) or "verification" block (each entry checked against the final query).
- **Set-, subset- and list-based grading** (§3.3.4): per-instance rules; "any-k" answers must be a right-sized subset of the full gold set, and ordered answers match cell by cell.

**Builds on:**
- BIRD ([BIRD](#/papers/li2023bird "Can LLM Already Serve as A Database Interface? A BIg Bench for Large-Scale Database Grounded Text-to-SQLs (2023)")), a text-to-SQL benchmark: problem format, training set and human score (§4.1, §5.2).
- [Pervasive Annotation Errors Break…](#/papers/jin2026annotation "Pervasive Annotation Errors Break Text-to-SQL Benchmarks and Leaderboards (2026)"), an audit of text-to-SQL benchmark errors: the LLM reviewer and the Arcwise-Plat benchmarks (§3.2, §5.1).
- VeriEQL ([VeriEQL](#/papers/he2024verieql "VeriEQL: Bounded Equivalence Verification for Complex SQL Queries with Integrity Constraints (2024)")), a bounded SQL equivalence checker (§4.2, App. D).
- SkyRL-SQL, a multi-turn RL text-to-SQL recipe whose settings it adopts (§4.3); not listed here.

## Problem and setting

- **Question:** can one LLM, fine-tuned with RLVR on clean data and without pipeline modules, reach human-level accuracy (§1)?
- **Training data:** BIRD-Platinum, all SQLite (§5.3), split 85:15 into training and validation (§4.3).
- **Benchmarks** (§5.1):
  - Arcwise-Plat-Full and -SQL: expert-corrected versions of BIRD Mini-Dev, a 498-problem BIRD evaluation set. Full fixes questions, evidence and gold SQL and "measures accuracy under clean inputs"; SQL fixes only the gold SQL, measuring "robustness to the noisy questions and external knowledge" (§2.2; App. A).
  - Spider2-SQLite: the 135 SQLite problems of Spider 2.0, whose gold queries are more complex than BIRD's; Spider2-Snow: all 547 Spider 2.0 problems in the SQL dialect of Snowflake, a cloud data warehouse.
- **Baselines** (§5.1): the five strongest open-source BIRD pipelines, Contextual-SQL, CSC-SQL, GenaSQL, OpenSearch and SHARE (LLM pipelines adding schema linking, which matches question words to tables and columns, plus retrieval, revision or selection), three re-run on GPT-5.2; four fine-tuned open text-to-SQL models of 7B–32B (e.g. OmniSQL-32B, Arctic-R1-7B); and GPT-5.2, "a frontier reasoning LLM".
- **Correct:** execution accuracy with set-based grading (§5.1); in training, each instance's annotated grading (App. E.5).
- **Human level:** BIRD's reported human accuracy on BIRD Test, a fixed reference the paper calls a "proxy" (§1, App. C).
- **VeriEQL setup:** 2 tuples per table, 30-second timeout, columns mapped to INT or VARCHAR; not used at inference; SQLite only (App. D, E.5).
- **NULLs:** a curation checklist item (§3.1); in grading and VeriEQL, not discussed.

## Approach

**Data curation (§3).** Each correction must fix a genuine error and add none (§3.1). A checklist covers the question, the evidence and the gold query (e.g. ties, duplicates, missing values). Five stages (§3.2, Fig. 2):
1. an LLM reviewer based on OpenAI's o3 flags errors and suggests a fix;
2. an expert corrects with the checklist *before* reading that report;
3. a second expert verifies independently; disagreement goes to a third;
4. three experts settle remaining conflicts; unfixable instances are dropped;
5. automatic tests: the new result is non-empty and differs from the old.

Empty-result instances are revised because a trivial query would earn full reward (§3.3.1).

**Diagnosis (§4.1).** Failure mode 1: a wrong query can match the gold result on one database, giving a false positive reward, measured with VeriEQL. Failure mode 2: outcome rewards give no signal on evidence use; in a pilot, some failures ignored it.

**Reward (§4.2).** The verification-aware outcome reward minus the process penalties (Eq. 2–3). A refuted reward is downweighted, not zeroed, because VeriEQL can time out or not support an operator. Format violations get −1 (App. E.5).

**Training (§4.3).** Multi-turn [rollouts](#/glossary/reinforcement-learning) (sampled attempts) with up to five exploratory queries; the CISPO loss (which the paper says clips gradients asymmetrically); LoRA.

## Results

- **Data:** 61.1% of instances had at least one error; corrections touched 52.1% of gold queries, 26.2% of questions and 18.2% of evidence entries (§3.4, Fig. 3c). The LLM reviewer's flags were mostly right, but it missed most errors (Fig. 3a).
- **False positives:** VeriEQL refuted on average 32.8% of positive rewards over 300 pilot steps, with no decline (§4.1, Fig. 4).
- **Human parity:** ReViSQL-BIRD-K2.6 reaches 93.8% on Arcwise-Plat-Full with greedy decoding and 93.0% on Arcwise-Plat-SQL with self-consistency over 16 candidates, against the 92.96% proxy, inside both 95% intervals (§5.2, Fig. 6a–b). A one-sided test puts every prior system significantly below it, but not this model (App. C).
- **Against pipelines:** greedy, it beats OpenSearch, the strongest, by 8.4 points on Arcwise-Plat-SQL and 5.6 on -Full, at 37% lower cost per query (§5.2). It beats the fine-tuned models and GPT-5.2 at every budget of 4–32 candidates, and with 4 beats all of them given 32 (§5.2, Fig. 6c–d).
- **Ablation:** reward shaping adds 2.8 and 3.8 points over ReViSQL; ReViSQL-BIRD trained on BIRD Train scores below the untrained base model (§5.2, Fig. 7).
- **Residual failures:** of the 64 remaining, most are attributed to question ambiguity; most model defects omit a filter the schema requires (§5.2; App. B, Tab. 5).
- **Data effect:** ReViSQL-235B beats the same model trained on BIRD Train by 11.0–16.1 points on all four benchmarks under greedy decoding (§5.3, Fig. 8). Greedy, it also scores above the five pipelines on Arcwise-Plat and Spider2-SQLite at 7–8× lower cost than GenaSQL and OpenSearch (Tab. 4, §5.3), and on Spider2-Snow, with self-consistency over 128 candidates, above the leaderboard entries of ReFoRCE, AutoLink and Spider-Agent, agents on 480B–671B models (§5.3).

## Limits the authors state

- Curation trades completeness for soundness: "We do not claim to find every error in every instance" (§3.1).
- VeriEQL "itself can fail due to timeouts or unsupported SQL operators (e.g., window functions)" (§4.2); type coarsening and the bound mean it "may return an inconclusive verdict" (App. D).
- The human score is a "proxy" measured on BIRD Test (§1). On Arcwise-Plat-SQL the model reaches it "only with self-consistency over multiple candidates" (App. A).
- Spider2-Snow needs SQLGlot (a dialect translator) for Snowflake and ReFoRCE's schema filtering because inputs exceed the context window (§5.3).

## Open problems and building blocks

- **Open:** no future work stated. The named bottleneck for remaining errors is "the interpretation of ambiguous natural language rather than [...] the model's ability to write correct SQL" (App. B.2). The taxonomy is offered "to inspire future Text-to-SQL data curation" (§3.3).
- **Released:** the verification guidelines, in §3 (§1); per-instance correctness "together with our code" (App. C). No dataset or model release is stated.
- **To reuse it:** SQL experts for 2–4 rounds per instance plus an o3 reviewer (§1, §3.2); VeriEQL, SQLite only (App. E.5); Tinker, the training infrastructure the paper names, and one H100 for open models (§5.1); Kimi-K2.6 or Qwen3-235B-A22B as base models (§5.2, §5.3).

## On this site

- **Discussed in:** [Benchmarks with checkable ground truth](#/challenges/checkable_benchmark_ground_truth) · [Equivalence of nondeterministic queries](#/challenges/nondeterministic_equivalence) · [Equivalence under schema constraints](#/challenges/schema_constrained_equivalence) · [The self-improving SQL ↔ text ↔ verify loop](#/challenges/sql_text_round_trip_loop) · [Text-to-SQL can't be verified against intent](#/challenges/text_to_sql_verification) · [Weak checkers get exploited](#/challenges/weak_checker_exploitation)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/hacking-sql">hacking-sql</a><a class="tag sub" href="#/tags/harness-sql">harness-sql</a><a class="tag sub" href="#/tags/llm-gen">llm-gen</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/nl2sql-data">nl2sql-data</a><a class="tag sub" href="#/tags/rlvr-sql">rlvr-sql</a><a class="tag sub" href="#/tags/scaling-sql">scaling-sql</a></span>
