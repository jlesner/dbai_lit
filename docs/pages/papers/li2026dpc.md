# DPC: Training-Free Text-to-SQL Candidate Selection via Dual-Paradigm Consistency

**DPC (Dual-Paradigm Consistency)** · ACL 2026 per the arXiv comment

Read: [PDF](https://arxiv.org/pdf/2604.15163) · [arXiv](https://arxiv.org/abs/2604.15163)  
Code: [DPC](https://github.com/HKUSTDial/DPC)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Picks among text-to-SQL candidates without a gold query: LLM agents build a "Minimal Distinguishing Database" on which the two leading candidates return different results (abstract, §3.3).
- A Slicer agent cuts the schema (dry-run checked), a Tester agent regenerates data until the two outputs differ or a retry limit T_max is reached, and a Solver agent's Python/Pandas solution on that database is the reference the SQL outputs are compared with (§3.3–3.5).
- LLM-built distinguishing databases, but the referee is another LLM output, not a gold query, and the release's own reliability run doesn't show it right more often than the candidates it judges; cited by SISelection ([data-aware NL2SQL candidate selection](#/papers/kikot2026separating "Data-aware candidate selection in NL2SQL translation via small separating instances (2026)") §1).

## In plain words

A text-to-SQL system often samples several candidate queries for one question. One is often right, but picking it without knowing the answer is hard: the authors call the distance between how often some candidate is right and how often the picked one is right the "Generation-Selection Gap" (abstract, §1). They argue that majority voting fails when the model is consistently wrong in the same way, and that an LLM judge cannot reliably run queries in its head (§1). Their training-free method, DPC, takes the two most popular disagreeing candidates, has LLM agents write a tiny database on which the two are meant to give different results, and has another agent answer the question in Python on that database; the candidate whose output matches the Python output is chosen.

With five candidates per question, the authors report that DPC beats every selection baseline they test, on two benchmarks with three models, e.g. DeepSeek-V3.2 on BIRD from 51.2% (majority voting) to 53.4% (§4.2). They present it as an improvement over existing selection methods ("state-of-the-art performance", §4.2), not as a first.

## Background and terms

**Terms to know:** [text-to-SQL](#/glossary/text-to-sql) · [execution accuracy](#/glossary/execution-accuracy) · [pass@k](#/glossary/passk) · [self-consistency](#/glossary/self-consistency-majority-voting) · [LLM-as-a-judge](#/glossary/llm-as-a-judge) · [gold query](#/glossary/gold-query) · [counterexample database](#/glossary/counterexample-database) · [schema linking](#/glossary/schema-linking)

**The paper's own terms:**
- **Generation-Selection Gap**: high Pass@K (some candidate is right) that "fails to translate into execution accuracy (Pass@1)" (abstract). In the tables, "Upper Bound (Pass@N)" is "the theoretical maximum accuracy within the candidate pool" (Tab. 2 caption).
- **Training-free**: a selection function that works without the gold query or gradient updates (§2.1, Eq. 2).
- **Systematic bias**: "consensus on hallucinations" (abstract), where models "consistently converge on errors" so majority voting picks a wrong answer (§1).
- **Symbolic blindness** (C2): LLMs "lack an internal interpreter to reliably simulate the state changes of complex SQL operations" by inspection (§1).
- **Partial observability** (C1): the real database is "typically too massive to fit within the context window", so a model sees only a few sample rows (§1, §2.2).
- **Intrinsic Confirmation Bias** (C3): as a selector, a model "inherently favors candidates that align with its internal priors" (§1).
- **Champion and Challenger**: a candidate from the largest and from the second-largest group of candidates that return identical results on the real database; the Champion stands for the majority-vote choice (§3.2).
- **Minimal Distinguishing Database (MDD)**: a small synthetic database built for one question. It must fit in the LLM's context window ("Contextual Feasibility") and make semantically different candidates return different results ("Discriminative Validity", Eq. 4) (§2.3).
- **Slicer, Tester, Solver**: the three LLM agents; the Slicer picks the needed tables and columns, the Tester writes the MDD's rows, the Solver writes the Python/Pandas answer (§3.3–3.4).
- **Bipartite Soft-F1 (BS-F1)**: the score in [0, 1] that compares a SQL result with the Python result (§3.5, Alg. 1).
- **Majority-Incorrect / Majority-Correct sets**: subsets of BIRD in Tab. 4; the paper describes the first as where "model-internal biases lead to consistent but erroneous outputs" (§4.3).

**Missing glossary terms:**
- **Hungarian algorithm**: a classic algorithm that finds the best one-to-one pairing between two sets given a cost for each pair; here it pairs rows of the SQL result with rows of the Python result so that column overlap is as large as possible (§3.5, Alg. 1).

**Builds on:**
- The two-candidate duel: "we select the two most dominant SQLs for a pairwise duel", citing the text-to-SQL systems DeepEye-SQL and CSC-SQL ([CSC-SQL](#/papers/sheng2025cscsql "CSC-SQL: Corrective Self-Consistency in Text-to-SQL via Reinforcement Learning (2025)")) (§3.2).
- Self-Consistency for SQL, "which selects the SQL yielding the most frequent execution result", cited to the zero-shot text-to-SQL system Alpha-SQL ([Alpha-SQL](#/papers/li2025alphasql "Alpha-SQL: Zero-Shot Text-to-SQL using Monte Carlo Tree Search (2025)")) (§4.1) and the text-to-SQL system OpenSearch-SQL (§1): the main baseline.
- Multiple-Choice Selection from the text-to-SQL system MCS-SQL, "where an LLM is prompted to select the best candidate from the pool" (§4.1): the LLM-as-a-judge baseline.
- A group of works the authors cite for LLMs reasoning better in Python than in SQL, and for Python forcing explicit step-by-step plans (§1, §3.4).

## Problem and setting

- **Question:** given a question, a schema and K candidate queries from an LLM, pick the one whose result on the database equals the gold query's (Eq. 1), without the gold query or training (§2.1, Eq. 2).
- **What "correct" means:** equal execution results on the database instance (Eq. 1); scored as execution accuracy (EX) (§4.1).
- **Assumptions:** typically, the full data is far larger than the context window (§2.2); the candidates can be run on "the original database instance available for execution" (§3.2). SQL results without `ORDER BY` are treated as unordered (§3.5). NULLs: only as a value-normalization rule (`None`, `NaN`, "null" all become one null value, Tab. 1). The SQL fragment covered and the database engine are not discussed.
- **Benchmarks:** BIRD Mini-Dev, 500 questions ("a large-scale dataset focusing on real-world database complexity and external knowledge"), and the Spider test split, 2,147 questions (described as "the standard for evaluating SQL structural generalization") (§4.1).
- **Models:** GPT-5, DeepSeek-V3.2 and Qwen2.5-Coder-7B-Instruct (§4.1). In the integration experiments Qwen2.5-Coder-7B-Instruct both generates candidates for the prompting-based systems and runs DPC's agents (§4.2). In DPC's process, sampling temperature 0.7 and self-correction limit 3 (§4.1).

## Approach

Four stages (§3.1, Fig. 2); agent prompts in App. A:

1. **Clustering and pairing (§3.2):** run every candidate on the real database, group candidates with identical results (Eq. 5), and take a Champion from the largest group and a Challenger from the second-largest.
   - The Slicer outputs a slice of the schema "that contains only the tables and columns necessary for the candidate SQLs". A dry run executes (or `EXPLAIN`s, i.e. asks the database to plan without running) both candidates on an empty database with that slice; an error message goes back to the Slicer for a new slice (Eq. 6), until success or the retry limit.
   - The Tester writes rows meant to expose the difference between the two candidates. Both candidates run on them; if their outputs are identical, the Tester is told and regenerates (Eq. 7), until the outputs differ (Eq. 8) or the retry limit is reached. The authors describe the MDD as "guaranteeing divergent execution results for conflicting logic" (§3.1).
3. **Python answer (§3.4):** the Solver writes a Pandas script that answers the question on the MDD; on an exception the traceback is fed back (Eq. 9), until it runs or the retry limit is reached. The authors treat Python as "a higher-confidence reasoning path than declarative SQL" and its result as a "proxy ground truth" (§3.4).
4. **Consistency check (§3.5):** BS-F1 first normalizes values (decimals rounded to 4 places, dates to `YYYY-MM-DD`, nulls unified, strings stripped; Tab. 1), then pairs rows with the Hungarian algorithm by column overlap, and computes F1 from matched and unmatched rows (Alg. 1). The candidate with the higher BS-F1 against the Python result is chosen (Eq. 10).

## Results

Each result is the authors' claim; Tab. 2 and Tab. 3 use N = 5 candidates.

- **Selection methods compared (Tab. 2, §4.2):** baselines are Random, Execution-Guided Selection (the first candidate that runs without error), Self-Consistency (SC) and Multiple-Choice Selection (MCS). DPC has the best EX in all six model/benchmark columns.
  - DPC against SC, BIRD: Qwen 46.4 → 47.6, DeepSeek-V3.2 51.2 → 53.4, GPT-5 49.4 → 51.2; Spider: Qwen 76.5 → 77.5, DeepSeek-V3.2 71.6 → 73.2, GPT-5 72.2 → 73.3.
  - The Pass@5 upper bounds on BIRD are 57.6, 58.8 and 56.4 for the same three models.
- **Plugged into other systems (Tab. 3, §4.2):** on BIRD, replacing SC with DPC in the prompting-based systems DAIL-SQL and CHESS and the fine-tuned 7B models OmniSQL-7B and XiYanCoder-7B raises overall EX by 1.0 (CHESS) to 2.4 points (XiYanCoder-7B, 53.0 → 55.4).
- **Systematic bias (Tab. 4, §4.3, Qwen on BIRD):** on the Majority-Incorrect set SC scores 0.0% and DPC 21.4%; on the Majority-Correct set SC scores 100.0% and DPC 97.0%. The authors say this "proves that DPC serves as a critical safety net when the majority consensus is flawed".
- **Pool size (Fig. 3, §4.3):** the authors report that DPC's lead over SC widens as N grows from 3 to 11.
- **Cost (Tab. 5, §4.4, Qwen on BIRD, per question):** DPC uses about 3.8K tokens and 4.2 s, against about 4.2K tokens and 5.1 s for MCS and about 0.8 s for SC (no token count given). The authors attribute the saving over MCS to the Slicer.
- **Ablation (Tab. 6, §4.5, Qwen on BIRD):** removing any one component lowers EX by 0.4–1.4 points; the Tester matters most, then the Slicer, and the rest, the Python agent included, "collectively contribute to the robustness".
- **Error analysis (App. C, BIRD Mini-Dev):** among questions DPC gets right and SC gets wrong, result-representation errors (wrong columns, types or rounding) are the largest group, then schema-linking errors, then wrong filter predicates (App. C.1, Tab. 8).

## Limits the authors state

- DPC "incurs higher inference latency than direct generation due to its multi-agent synthesis and execution pipeline" (Limitations).
- "under complex implicit constraints, synthesized environments may structurally diverge from real distributions" (Limitations).
- On questions the majority already gets right, "a minor regression (-3.0%) occurs in the Majority-Correct set" (§4.3).

## Open problems and building blocks

  - "adaptive verification—triggering DPC only under high uncertainty—to optimize efficiency" (Limitations).
  - "improving the semantic fidelity of adversarial synthesis remains a critical direction for future exploration" (Limitations).
- **Released:** code, linked in the front matter (PDF p. 1); the full prompts of the three agents, given "To facilitate reproducibility" (App. A).
- **To reuse it:** an LLM for the three agents (tested: a local 7B model served with vLLM on one A800 80GB GPU, and GPT-5 and DeepSeek-V3.2 through their APIs, §4.1); the ability to execute candidates on the real database and on an empty one with the sliced schema (§3.2–3.3); a sandboxed Python/Pandas runtime (§3.4); about 3.8K tokens and 4.2 s per question with Qwen on BIRD (Tab. 5).

## On this site

- **Discussed in:** [Minimal counterexamples](#/challenges/minimal_counterexamples) · [Text-to-SQL can't be verified against intent](#/challenges/text_to_sql_verification)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/cex-llm">cex-llm</a><a class="tag sub" href="#/tags/harness-sql">harness-sql</a><a class="tag sub" href="#/tags/llm-assist">llm-assist</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/nl2sql-select">nl2sql-select</a><a class="tag sub" href="#/tags/scaling-sql">scaling-sql</a></span>
