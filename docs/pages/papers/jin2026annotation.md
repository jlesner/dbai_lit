# Pervasive Annotation Errors Break Text-to-SQL Benchmarks and Leaderboards

**Pervasive Annotation Errors Break…** · PVLDB 19(5), 2026

Read: [PDF](https://arxiv.org/pdf/2601.08778) · [arXiv](https://arxiv.org/abs/2601.08778) · [DOI](https://doi.org/10.14778/3796195.3796206)  
Code: [text_to_sql_benchmarks](https://github.com/uiuc-kang-lab/text_to_sql_benchmarks)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Measures annotation error rates in BIRD Mini-Dev and Spider 2.0-Snow, with an LLM reviewer (SAR-Agent) whose flags SQL experts adjudicate, and re-ranks 16 open-source BIRD-leaderboard agents on a corrected BIRD Dev subset (abstract; §1, §4.2).
- Releases two corrected BIRD Mini-Dev versions, Arcwise-Plat (questions and gold SQL fixed) and Arcwise-Plat-SQL (gold SQL only) (§6).
- It reports errors in 52.8% of BIRD Mini-Dev examples (abstract). A primary source for text-to-SQL ground-truth noise (it cites earlier rates in §1), and of the Arcwise-Plat sets [ReViSQL](#/papers/zhu2026revisql "Human-Level Text-to-SQL via Reinforcement Learning on Verified Data, Without Pipeline Engineering (2026)") evaluates on (§5.1).

## In plain words

Text-to-SQL benchmarks pair each question with a human-written correct SQL query, and leaderboards rank systems by how often their query returns the same result. The authors argue that wrong annotations "can distort reported performance and rankings of agents and mislead researchers and practitioners" (§1). They present an empirical study (abstract) with a toolkit: an LLM agent, SAR-Agent, that checks each annotation by running probe queries on the database and reports problems; SQL experts verify every case it flags. They report that 52.8% of the examples in BIRD Mini-Dev (a 500-example subset of a widely used benchmark) and 62.8% of the examples in Spider 2.0-Snow (a benchmark with long, complex queries) whose correct query is public contain errors (abstract; §1, §4.1). After hand-correcting 100 random BIRD development examples and re-running 16 open-source leaderboard agents, accuracy changed by −7% to 31% in relative terms and ranks moved by up to 9 places (abstract). They call their agent "the first AI agent that assists SQL experts in detecting annotation errors in text-to-SQL benchmarks" (§1).

## Background and terms

**Terms to know:** [text-to-SQL](#/glossary/text-to-sql), [gold query](#/glossary/gold-query), [execution accuracy](#/glossary/execution-accuracy), [LLM-as-a-judge](#/glossary/llm-as-a-judge), [Spearman's rank correlation](#/glossary/spearmans-rank-correlation) (r_s; the paper says it "measures monotonic relationships between rank variables", §5.2).

**The paper's own terms:**
- **annotation**: one example as humans wrote it, over a database: the natural-language input (the user question plus, optionally, "external knowledge", BIRD's hints such as "State Special Schools refers to DOC = 31") and the gold SQL query (§1, Fig. 1b).
- **E1–E4**: the four error patterns (§1; classification criteria in §4.4). E1: the query doesn't match the question's logic (e.g. an inclusive `BETWEEN` where the question asks for strict inequality). E2: it mismatches the database's schema or data (e.g. a missing aggregation). E3: it mismatches the domain knowledge, or the external knowledge is wrong (e.g. reading "K-12" as grades 1–12, Fig. 1b). E4: the question "admits multiple reasonable interpretations that map to different, non-equivalent SQL queries producing different results", or "the desired output specification is underspecified" (§4.4).
- **error rate**: the percentage of examples that show any of E1–E4 (§4.1 "Metrics").
- **diagnostic report**: SAR-Agent's output: judgments on ambiguity and on the query's correctness, explanations, and a proposed corrected query when it finds an error (§3.1).
- **precision** (of SAR-Agent): the share of flagged examples for which manual review confirms at least one of the reported error reasons (§6.1 "Evaluation methods"). **Hit rate**: "the percentage of Arcwise detections that SAR-Agent also detects" (§6.1), Arcwise being a team of SQL experts whose earlier audit listed BIRD Mini-Dev's annotation errors.
- **original and corrected Dev subset**: 100 examples drawn at random from BIRD's 1,534 development (Dev) examples, before and after the authors' corrections (§1, §5.1). App. A.3 defines four corrected variants (full, without database changes, and two that fix only the gold SQL).
- **Arcwise-Plat-SQL and Arcwise-Plat**: the authors' two corrected versions of BIRD Mini-Dev. The first corrects only the gold SQL, "preserving original ambiguities in the questions and evidence"; the second also resolves the ambiguities (§6).

**Builds on:**
- BIRD ([BIRD](#/papers/li2023bird "Can LLM Already Serve as A Database Interface? A BIg Bench for Large-Scale Database Grounded Text-to-SQLs (2023)")), a cross-domain text-to-SQL benchmark with a public leaderboard. The authors' correction pipeline, SAPAR, builds SAR-Agent into BIRD's "standard text-to-SQL annotation pipeline" (§3.2).
- Arcwise's 2024 list of BIRD Mini-Dev annotation issues: the authors merge its errors into theirs (§4.2) and compare SAR-Agent with it (§6).
- Spider 2.0 [Lei et al.], an enterprise text-to-SQL benchmark and successor to Spider 1.0 ([Spider](#/papers/yu2018spider "Spider: A Large-Scale Human-Labeled Dataset for Complex and Cross-Domain Semantic Parsing and Text-to-SQL Task (2018)")) (§1).
- Earlier audits of Spider and BIRD (§8), among them Wretblad et al. (§1) and [Evaluating Cross-Domain Text-to-SQL Models…](#/papers/pourreza2023evaluating "Evaluating Cross-Domain Text-to-SQL Models and Benchmarks (2023)").

## Problem and setting

- **Questions** (§2): Q1, error rates in widely used benchmarks; Q2, their effect on agents' performance and ranks; Q3, how well SAR-Agent detects errors.
- **Benchmarks** (§2.1, §4.1): chosen for usage and query complexity (Fig. 2). BIRD Mini-Dev (first version): 500 `SELECT`-only examples the BIRD team chose from the Dev set, 498 after two duplicates, run on the larger BIRD Dev databases (§4.1). Spider 2.0-Snow, a variant of Spider 2.0 whose queries run on Snowflake (a cloud data warehouse; §1): only the 121 of its 547 examples with public gold queries, as annotated on Aug. 20, 2025, before an Oct. 29 update (§4.1, §2.1 footnote).
- **Who decides correctness**: an example is incorrect if the experts confirm any of E1–E4. Two authors assess each flagged example independently, and all four resolve disagreements (§4.2).
- **Re-evaluation** (§5.2): the 16 agents on the BIRD leaderboard (as of Aug. 20, 2025) with public code that "can be reproduced in local environments", some run with substitute models (App. A.2, Tab. 8). Metrics: execution accuracy (EX) following BIRD, rank among the 16, and Spearman's r_s between rankings.

## Approach

- **SAR-Agent** (SQL Annotation Reviewer agent; §3.1, Fig. 3). Inputs: the annotation and the schema (table and column names and descriptions); for Spider 2.0-Snow, only the tables the gold query uses. In each iteration it writes a verification query that probes one aspect of the gold SQL, runs it through an `execute_query` function and keeps all earlier queries and results in memory; a `terminate` function writes the diagnostic report. It runs on OpenAI's o3 model with at most 30 iterations (§4.1).
- **Three-step examination** (§4.2): (1) SAR-Agent writes a report for every example; (2) the authors verify every example it labels incorrect or ambiguous, checking domain claims against authoritative sources and running their own verification queries; (3) they look for the recurring patterns in other examples of the same database, and for Mini-Dev "we also combined the errors identified in prior work".
- **SAPAR** (SQL Annotation Pipeline with an AI Agent Reviewer; §3.2, Fig. 4): SAR-Agent reviews each annotation; one judged correct is accepted. Otherwise annotators revise it from the report (a SQL expert decides when they disagree with it), possibly adopting the agent's proposed SQL after checking it, and the loop returns to the agent. The authors say it "augments expert review with SAR-Agent, improving both the efficiency and accuracy of annotation" (§3.2).
- **Correcting the Dev subset** (§5.1): fix questions, external knowledge and gold SQL; fix a column description marked "unuseful"; and insert distinguishing rows where wrong queries returned the same result as the corrected one, with up to three rounds of review "to reach consensus with SAR-Agent for each text-to-SQL pair". Fig. 5 shows example 985 before and after; Tab. 4 counts the corrections by kind.

## Results

- **Error rates** (§4.3): 263 of 498 BIRD Mini-Dev examples (52.8%), including all those Arcwise reported, and 76 of 121 Spider 2.0-Snow examples (62.8%). E2, a limited understanding of the data or schema, is the most common pattern in both (Tab. 1).
- **Leaderboard** (§5.3): relative EX changes range from −7% to 31% (Fig. 6) and rank changes from −9 to +9 (Fig. 8). Most agents improve; CHESS (a GPT-4o agent with retrieval, candidate generation and unit-test selection, Tab. 8) rises from the middle to tie for first, and the original top two fall. The authors conclude that "rankings of methods are highly sensitive to the annotation errors in the benchmark" (§5.3).
- **Why** (§5.4, Tabs. 5–6): CHESS gains where only the gold query was fixed (a common pattern: `DISTINCT` missing inside `COUNT`) and where question and gold query were both revised. SFT CodeS-15B, a fine-tuned 15B-parameter model, loses mostly where both were revised.
- **Rank correlations** (§5.5, Fig. 9): the original subset's ranking correlates with the "BIRD leaderboard (Dev)" at r_s = 0.85 (p = 3.26e-5, abstract) but with the corrected subset's ranking at r_s = 0.32 (p = 0.23). The authors read the first as showing that the sample preserves the full Dev set's relative performance, and the second as a "weak correlation" (§5.5).
- **SAR-Agent** (§6.2, Tab. 7): of the 274 Mini-Dev examples it flags, 228 are confirmed, an 83% precision. Tab. 7 gives its Spider 2.0-Snow precision; Fig. 10 its hit rate on Arcwise's examples and how many more errors it finds than Arcwise.
- **Ablation** (§7, Fig. 11): "database modification has minimal impact on the rankings of agents"; SQL-only fixes by SAR-Agent give rankings closer to the full correction's than SQL-only fixes by humans, which the authors attribute to "residual issues in the natural language input".
- **Spider 2.0 update** (App. A.4, Fig. 14): the Spider 2.0 team's July 2025 question rewrite "has limited effectiveness" and adds new errors to some examples; "only updating user questions is insufficient to fix the annotation errors in Spider 2.0-Snow".

## Limits the authors state

- Some agents ran on GPT-4o instead of GPT-4 "Due to budget constraints", and GenaSQL (an agent that generates and selects among candidate queries) and CHESS on substitutes for lack of access to AWS Bedrock or Google Cloud (Tab. 8 notes).
- SAR-Agent's proposed corrected queries are not evaluated for accuracy, "as some examples require revisions to both the natural language question and the SQL query" (§3.1 footnote).

## Open problems and building blocks

- **Open:** "We advocate that future work use SAR-Agent and SAPAR to develop high-quality text-to-SQL benchmarks" (§9), and that future work "refine the entire Spider 2.0-Snow benchmark based on our proposed SAPAR" (App. A.4). New benchmarks can apply SAPAR after the initial annotation (§3.2).
- **Released:** "Our code and data are available at" the project repository (abstract); SAR-Agent's "prompt and scaffolding" (§4.1 footnote); Arcwise-Plat and Arcwise-Plat-SQL: "Both versions are available in our GitHub repository" (§6).
- **To reuse it:** an LLM with function calling (o3 here, at most 30 iterations), query access to the benchmark's database, the schema with column descriptions, and SQL experts to adjudicate the flags (§3.1, §4.1–4.2). Cost: $0.44 and 5.1 steps per example on Mini-Dev, $1.11 and 7.6 on Spider 2.0-Snow (Tab. 7).

## On this site

- **Discussed in:** [Benchmarks with checkable ground truth](#/challenges/checkable_benchmark_ground_truth) · [Text-to-SQL can't be verified against intent](#/challenges/text_to_sql_verification)
- **Tags:** <span class="tags"><a class="tag" href="#/tags/labels">labels</a><a class="tag sub" href="#/tags/harness-sql">harness-sql</a><a class="tag sub" href="#/tags/judge-sql">judge-sql</a><a class="tag sub" href="#/tags/llm-gen">llm-gen</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/nl2sql-data">nl2sql-data</a><a class="tag sub" href="#/tags/nl2sql-eval">nl2sql-eval</a></span>
