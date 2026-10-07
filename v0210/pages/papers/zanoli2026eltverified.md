# ELT-Bench-Verified: Benchmark Quality Issues Underestimate AI Agent Capabilities

**ELT-Bench-Verified** · PVLDB 20(1) (reference-format block; not yet published) · 2026

Read: [PDF](https://arxiv.org/pdf/2603.29399) · [arXiv](https://arxiv.org/abs/2603.29399)  
Code: [ELT-Bench](https://github.com/uiuc-kang-lab/ELT-Bench)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Re-evaluates ELT-Bench with a newer model ("a single model upgrade", §2.1) and audits its quality (abstract).
- An Auditor-Corrector method: LLM-driven root-cause analysis with human validation (abstract).
- Benchmark errors that understate agents, the pipeline counterpart of gold-query errors in text-to-SQL ([Pervasive Annotation Errors Break…](#/papers/jin2026annotation "Pervasive Annotation Errors Break Text-to-SQL Benchmarks and Leaderboards (2026)")).

## In plain words

Data teams build pipelines that copy data from many sources into a cloud warehouse and then reshape it with SQL. ELT-Bench tests whether AI agents can build such pipelines; in its original study, one agent with an older model loaded the data in 37% of tasks and built only 1% of the target tables correctly (§1). The authors argue this underestimated agents, for two reasons (abstract). First, the same agent with a newer model reaches 96% and 22.66% (§2.2). Second, an audit of the remaining failures, with an AI agent diagnosing each wrong column and people checking every diagnosis, finds that 82.7% of the failed tasks contain at least one error that is the benchmark's fault: rigid scoring, vague task text, or wrong expected answers (§4.2). They fix the scoring, drop the columns whose expected values can't be reproduced, and release ELT-Bench-Verified; the same agent then builds 32.51% of tables correctly instead of 22.66% (Tab. 2). They present this as a re-evaluation and audit, with a methodology they call "general" and "human-validated" (§1).

## Background and terms

**Terms to know:** [text-to-SQL](#/glossary/text-to-sql) · [execution accuracy](#/glossary/execution-accuracy) · [agent harness](#/glossary/agent-harness)

**The paper's own terms:**
- **ELT pipeline** (Extract-Load-Transform): data is extracted from sources with connectors such as Airbyte, loaded raw into a cloud warehouse such as Snowflake, then transformed there by SQL models, typically in dbt, a SQL transformation framework (Fig. 2). In ELT-Bench the agent also writes Terraform configuration to set up the connections (Fig. 3).
- **Task / data model / column**: ELT-Bench has 100 tasks (databases); each asks for one or more target tables ("data models"), whose columns are compared one by one with ground-truth tables (§2, §3 "Formal setup"): 203 data models (§2.2), 2,494 columns (§3.2.2).
- **SRDEL / SRDT**: the share of tasks whose source data is all loaded correctly; the share of all target data models whose columns match the ground truth (§2).
- **Agent- vs. benchmark-attributable error**: a mismatch from the agent's SQL, versus one from "ambiguous task specifications, limitations in the evaluation methodology, or incorrect ground truth values" (§4.1.2). **Mitigability**: whether the error can be fixed without changing ground-truth data (§3.1.3).
- **Evaluation False Positive**: a correct agent output that the evaluation script marks wrong (§4.1.2), the reverse of the usual sense of "false positive". Sub-kinds include format mismatch (0.15 vs. 15%), NULL representation and row ordering.
- **Ground Truth Calculation Error**: expected values that "cannot be derived from any reasonable query over the available schema" (§4.1.2).
- **Strata A/B/C**: columns both scripts accept (A), only the patched script accepts (B), both reject (C) (§3.2.2).

**Missing glossary terms:**
- **Fleiss' kappa (κ)**: a chance-corrected agreement score like [Cohen's kappa](#/glossary/cohens-kappa), for three or more raters (§3.1.3).
- **McNemar's test with Yates' continuity correction**: a chi-square test on paired labels asking whether the cases where the two sides disagree lean one way; here, each script against human consensus (§3.2.2).

**Builds on:**
- ELT-Bench ([ELT-Bench](#/papers/jin2025eltbench "ELT-Bench: An End-to-End Benchmark for Evaluating AI Agents on ELT Pipelines (2025)")): the benchmark audited, rerun with its own protocol and metrics (§2.1, §6).
- SWE-Agent ([SWE-agent](#/papers/yang2024sweagent "SWE-agent: Agent-Computer Interfaces Enable Automated Software Engineering (2024)")), an agent framework for software tasks, held fixed because "it was one of two agent frameworks evaluated in the original ELT-Bench study" (§2.1).
- The text-to-SQL annotation-error audit [Pervasive Annotation Errors Break…](#/papers/jin2026annotation "Pervasive Annotation Errors Break Text-to-SQL Benchmarks and Leaderboards (2026)"): the motivation (§1), and the finding the authors say they extend to ELT (§7.2).
- ReAct ([ReAct](#/papers/yao2022react "ReAct: Synergizing Reasoning and Acting in Language Models (2023)")), a reason-then-act agent loop, built in LangGraph (an agent library) as the second agent (§5.2.3).

## Problem and setting

- **Question:** is the low score the ceiling of the agents or "the ceiling of the benchmark's validity" (§1)?
- **Agents and models:** SWE-Agent with Claude Sonnet 4.5 against the original study's SWE-Agent with Claude Sonnet 3.5 (§1, §2.1); a ReAct baseline with Claude Sonnet 4.5 for validation only (§5.2.3). The Auditor uses Claude Opus 4.5 (§3.1.2). All are Anthropic models.
- **Audit scope:** the failures of the SWE-Agent run only: of 100 tasks, 96 pass loading, 87 of those fail transformation, and 6 of these fail with schema errors from early agent termination (§2.2); the other 81 give 660 unmatched columns in 136 data models (§3 "Formal setup").
- **What "correct" means:** a column matches its ground truth under the evaluation script; for one example column, App. A.2 says the original script "performs an exact string comparison". The patched script adds boolean normalization, floating-point tolerance, percentage and decimal normalization, NULL equivalence, and order-insensitive comparison when no order is specified (§5.1). The SQL is Snowflake SQL in dbt models (Fig. 3).

## Approach

- **Auditor (§3.1):** Phase 1 builds, per failed task, an environment with the specification, source and ground-truth tables, and the agent's SQL and output. Phase 2 runs one Claude Opus 4.5 agent per task, guided by an orchestration prompt that queues the unmatched columns and an analysis prompt with the per-column protocol; it tests hypotheses by running alternative SQL on the source data and reports a root cause, a corrected SQL "verified by the agent to achieve a 100% row-level match with the ground truth", and evidence. For the 30 columns where nothing matches exactly, it flags the column and reports the closest approximation. Phase 3: a data engineer checks all 660 reports and assigns each column one of 14 categories; three independent annotators re-label a uniform sample of 50. The review found that "no report required correction of its core diagnostic content" (§3.1.4).
- **Corrector (§3.2.1):** patches the script for Evaluation False Positives; removes the 30 Ground Truth Calculation Error columns; leaves ambiguous descriptions unchanged, since "Handling real-world uncertainty is a capability that agents should possess"; does not touch agent-attributable errors.
- **Corrector validation (§3.2.2):** three engineers label a stratified sample of 50 columns (oversampling B), blind to the scripts' verdicts, and their majority labels are compared with each script. For the 30 removed columns, three engineers write SQL independently; their low agreement with each other is taken to show that "no unambiguous correction exists" ("the decisive criterion"), and their agreement with the Auditor's proposals is lower still, so the columns are dropped, not replaced.

## Results

- **Model upgrade (§2.2, Fig. 6):** SRDEL 37% → 96% and SRDT 1% → 22.66%, same agent framework; extraction and loading are "largely solved" for "the source types and tool configurations covered by ELT-Bench" (§2.2).
- **Audit, columns (Tab. 1):** 33.0% of the 660 mismatches are benchmark-attributable (156 Evaluation False Positives, 32 Ambiguous Data Model Descriptions, 30 Ground Truth Calculation Errors). Flawed SQL Logic and JOIN Type Errors are the largest agent categories; Domain Knowledge Gaps are small.
- **Audit, tasks (§4.2):** 82.7% of the 81 failed tasks contain a benchmark-attributable error (12 only those, 55 both kinds, 14 only agent errors).
- **Agreement (§3.1.3):** Fleiss' κ 0.851 ("almost perfect") for agent-vs-benchmark attribution on the sample; "substantial" for the exact 14 categories.
- **Script validation (§3.2.2):** on stratum B the original script disagrees with human consensus on every column, in one direction, and the patched script agrees on every one; on stratum C the paper reports that neither script agrees, which the authors attribute to "the inherent difficulty of these cases". From 7 of the 15 being equivalent to humans but rejected by both scripts, they conclude their corrections are "conservative by design".
- **ELT-Bench-Verified (Tab. 2, Tab. 4):** SWE-Agent SRDT 22.66% → 32.51% (46 → 66 of 203 data models), "attributable entirely to benchmark correction" (abstract); SRDEL stays at 96%. ReAct rises from 20.20% to the same 32.51%, with a different set of passing models (§5.2.3).
- **Ablation (Tab. 3):** script refinement gives most of the gain, column removal a smaller part (§5.2.2).
- **Error patterns (§7.3):** the authors say Flawed SQL Logic and JOIN Type Errors "are not failures of task comprehension" but of SQL construction. Recurring patterns: `LIMIT 1` for superlatives despite ties, wrong NULL assumptions, silently normalizing strings or assuming value spellings (`'USA'` vs. `'United States'`). Most data models still fail on the verified benchmark.

## Limits the authors state

- The audit covers the failed tasks of "a single agent configuration (SWE-Agent with Claude Sonnet 4.5)"; other agents "may fail on different tasks, potentially revealing additional benchmark-attributable errors", and auditing several agents is "prohibitively expensive" (§7.4).
- All 660 columns were categorized by "a single data engineer"; the agreement study covers a sample, and "edge cases in the complete dataset may exhibit lower consistency" (§7.4).
- Attribution "required judgment calls in ambiguous cases"; the line between ambiguous descriptions (kept) and Evaluation False Positives (corrected) is one "reasonable annotators might draw … differently" (§7.4).
- Only one model upgrade was evaluated, because of each run's cost (§2.1).
- In the script validation, "per-stratum results are more informative than these unweighted aggregates" (§3.2.2).

## Open problems and building blocks

  - "future benchmark development should focus on more challenging pipeline stages" (§7.1).
  - The hardest cases combine several error types; "future progress will require advances in structured reasoning over relational schemas and data-aware query generation" (§7.3 "What remains hard").
  - Suggested agent strategies: execution-based self-verification, profiling data before writing queries, running several agents and picking the best output per task, and multi-agent debate with a human resolving disagreements, "a promising direction" (§7.3 "Strategies…").
  - Quality auditing "should become standard practice, especially for benchmarks that evaluate complex, multi-step agentic tasks" (abstract).
- **Released:** "We release ELT-Bench-Verified as a community resource" (abstract); the Auditor prompts are "released as supplementary material" (§3.1.2); the PVLDB Artifact Availability box says artifacts "have been made available" (title page).
- **To reuse it:** an LLM agent (Claude Opus 4.5 here) that can read each task's artifacts and run SQL on the source data, plus a person who reviews every report (§3.1). One full SWE-Agent run over the 100 tasks took 2 days 7 hours 16 minutes and $343; a ReAct run 18 hours 17 minutes and $293 (§2.1).
- **Beyond its domain:** the authors call the Auditor-Corrector "a scalable methodology for auditing execution-based benchmarks" (§1) and say their findings suggest "benchmark quality issues are a systemic problem across data engineering evaluation" (abstract).

## On this site

- **Tags:** <span class="tags"><a class="tag" href="#/tags/dbtask">dbtask</a><a class="tag sub" href="#/tags/harness-sql">harness-sql</a><a class="tag sub" href="#/tags/llm-gen">llm-gen</a><a class="tag sub" href="#/tags/llm-method">llm-method</a></span>
