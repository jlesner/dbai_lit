# DBA-Bench: A Production-Fidelity Benchmark for LLM-Based Database Operations Agents

**DBA-Bench** · preprint 2026

Read: [PDF](https://arxiv.org/pdf/2607.22165) · [arXiv](https://arxiv.org/abs/2607.22165)

<p class="notice">A summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- A benchmark of LLM database-operations agents on live PostgreSQL and distributed TiDB deployments with active workloads, in single-task and persistent multi-event scenarios (abstract).
- Success is meeting scenario-specific operational objectives without violating safety constraints, judged on the resulting database state; single-task runs start from a restored, rechecked snapshot (abstract, §1).
- Operations work scored by outcomes rather than judged answers.

## In plain words

Running a production database means fixing slow queries, outages and risky changes while it keeps serving traffic. LLM agents for this job were each tested with their own task scope, testbed and success criteria, so their results are "difficult to compare directly" (§1). The authors built a shared benchmark on live PostgreSQL and TiDB (a distributed SQL database) deployments with active workloads: 231 single-task scenarios, each restored from a saved broken state before every run, and 10 longer scenarios in which events arrive over one to two hours (§1). Success is judged on the state the agent leaves; a safe pass also requires breaking none of the scenario's safety constraints (abstract, §1). With one run per system and scenario, the best automated Safe Pass is 27.1% on PostgreSQL and 21.0% on TiDB, against 92.5% and 91.9% for a human database administrator (§6.2). The authors present a benchmark, an evaluation protocol and an empirical study, not a new agent (§1).

## Background and terms

**Terms to know:** [OLAP and OLTP](#/glossary/olap-and-oltp) · [fault injection](#/glossary/fault-injection) · [query plan and EXPLAIN](#/glossary/query-plan-and-explain) · [cardinality estimation](#/glossary/cardinality-estimation) · [ReAct](#/glossary/react) · [LLM-as-a-judge](#/glossary/llm-as-a-judge) · [Pass@k](#/glossary/passk) · [Pareto front](#/glossary/pareto-front) · [table statistics and ANALYZE](#/glossary/table-statistics-and-analyze) (§4.3)

**The paper's own terms:**
- **DBA**: database administrator; "Human DBA" is the human reference (§6.1).
- **bounded scenario**: one operational task, run from a restored broken state; the main evaluation (§1, §3.1).
- **persistent scenario**: one agent session keeps a running database stable while a fixed schedule injects faults, alerts and inspection tasks; earlier actions and unresolved faults carry forward (§3.1, §3.2).
- **mailbox**: in persistent runs, a shared document where the system appends alerts and tasks and the agent records status and actions; the agent can suspend until the next append (§3.3.3).
- **dirty snapshot** and **manifestation predicates**: the saved broken state, admitted only once checks confirm the intended cause and visible symptoms; the checks rerun after each restore (§3.2).
- **reference-path diagnostic depth**: the number of evidence-supported hops in a DBA-validated path from the first symptom to the root cause (§4.2).
- **environmental complexity**: for each kind of observation the reference path needs (log lines, table rows, time-series points), the share of units that don't support the causal path, averaged over the kinds (§4.2).
- **Easy / Hard**: Hard when depth is above 2 and complexity is at least 0.5; Easy otherwise. The persistent scenarios are all labelled Hard at the corpus level (§4.2).
- **Outcome Pass**: every executable predicate of the scenario's outcome contract holds; for bounded runs they "primarily inspect the terminal state" and required task artifacts (§5.1).
- **Service Compliance, Terminal Acceptance, State Integrity**: the persistent outcome conditions: service objectives met throughout the run, required operations and targets met at the end, and data and business invariants kept (§5.1).
- **Diagnosis Pass**: a fixed small language model judges, condition by condition, whether the agent's reports establish every required causal condition and none of the listed contradictory ones (§5.1); runs with unresolved judgments are left out of the rate (§6.1.1).
- **Safe Pass**: Outcome Pass with zero violations of the scenario's programmatic safety rules; the primary endpoint (§5.2, §6.1.1).
- **S1–S3**: action-level annotations of safety issues in reviewed runs: protected-object, intervention-scope and operational-safeguard violations (§6.4).

**Builds on:**
- AIOpsLab, a framework for evaluating cloud-operations agents and "the closest operational precedent", whose evaluation pattern the authors adopt "for database operations" (§2).
- The LLM database agents D-Bot (multi-expert diagnosis based on tree search), DBAIOps (diagnostic paths guided by a [knowledge graph](#/glossary/knowledge-graph)) and DBAgent (reinforcement learning for diagnostic reasoning), whose separate evaluations motivate the benchmark (§1).
- Agent benchmarks from other domains, among them AgentBench, GAIA and SWE-bench, which "judges edits to a real repository with execution tests" (§2).
- ReAct ([ReAct](#/papers/yao2022react "ReAct: Synergizing Reasoning and Acting in Language Models (2023)")), the shared loop of the model baselines (§6.1).

## Problem and setting

- **Question:** can LLM agents diagnose and repair faults in a live database, judged by the state their actions leave and by operational safety, and where do current systems fail (§1)?
- **Databases:** containerized PostgreSQL 16 and mainly TiDB 8.1.0, with earlier TiDB releases for version-specific tasks; OLTP, OLAP or mixed workloads stay active throughout (§3.2, §6.1).
- **Scenarios:** 107 PostgreSQL and 124 TiDB bounded scenarios in five domains (query tuning, system failure, health check, business change, resource governance), 57/50 and 44/80 Easy/Hard; 5 persistent scenarios per database (Tab. 1, §4.2). Sources are public reports, official troubleshooting material, prior diagnosis studies and expert stress cases; DBAs review each (§4.1).
- **Baselines (§6.1):** the frontier models GPT-5.5, Claude Opus 4.8, GLM-5.1 and DeepSeek V4 Pro and the open-weight Qwen3-Coder-Next and GLM-4.7-Flash, all in one ReAct loop; D-Bot and DBAIOps on GPT-5.5; a Human DBA with the same symptom, tools, constraints and scorers. The persistent study runs the four frontier models (§6.6).
- **Protocol:** one run per baseline and scenario, "single-run pass@1"; 50 turns for ReAct and DBAIOps, 150 for D-Bot; a context window of about 262K tokens, with the middle rounds summarized (§6.1).
- **Not discussed:** data sizes, except one example's (§4.3).

## Approach

- **Scenarios (§3.1):** a deployment, a workload, a program (a preparation phase, then timed fault injections and task dispatches; a single dispatch for a bounded scenario), the tools and the evaluator.
- **Construction (§3.2, Fig. 1, Fig. 2):** a generator deploys the database, warms up the workload, runs the preparation, admits the state only when the manifestation predicates hold, and snapshots it. Each bounded run restores the snapshot and rechecks the predicates; a persistent run replays its event schedule without resets.
- **Tools (§3.3.2):** `query_metrics`, `execute_sql` (inspection, `EXPLAIN` and SQL remediation), `manage_instance` (instance or cluster control), `read_log` and `query_knowledge_base`, mapped per database; only SQL and instance management change state.
- **Knowledge (§3.3.4, §6.1):** official PostgreSQL and TiDB documentation and operational procedures, retrieved by the agent, with no scenario labels, verifier predicates or gold answers.
- **Worked example (§4.3, Fig. 3):** stale statistics after a large insert make a long scan hold a lock, so lock waits and write timeouts show. Killing the blocker leaves the fault; the four-hop path leads to `ANALYZE`.
- **Scoring (§5):** outcome predicates over the run, a semantic judge for diagnosis, programmatic safety rules over the action trace and resulting state (weights set the reported risk, not the pass), and token cost at list prices, all reported separately.

## Results

The authors report (one run per pair):
- **Overall (§6.2, Fig. 4):** the highest automated Safe Pass is DBAIOps on PostgreSQL at 27.1% and Claude Opus 4.8 on TiDB at 21.0%, against 92.5% and 91.9% for the Human DBA. Rankings change across task families.
- **Diagnosis to repair (§1, §6.2):** 72.2% (PostgreSQL) and 71.6% (TiDB) of diagnosis-passing runs fail Outcome Pass.
- **Repair to safety (§6.4, Fig. 7):** 17.3% and 16.1% of outcome-passing runs fail Safe Pass. Most runs with safety annotations also fail Outcome Pass; protected-object violations are the most common type among them on PostgreSQL.
- **Difficulty (§6.2, Tab. 2):** pooled automated Safe Pass falls from 20.6% on Easy to 10.0% on Hard in PostgreSQL and from 18.5% to 8.6% in TiDB, and every system is lower on Hard in both.
- **Failure modes (§6.3.1, Fig. 5):** in reviewed outcome failures, incomplete required actions and omitted decisive evidence are the two most frequent labels on both databases.
- **Simplification (§6.3.2, Tab. 3):** of 17 high-complexity scenarios GPT-5.5 had failed, a few pass with a shorter observation history and a few more after further simplification; agents can still act on the wrong object when the evidence is present.
- **Knowledge (§6.3.3, Tab. 4):** with relevant documents placed in context, 8 of 13 database-knowledge cases pass, against 3 in normal runs; with application rules supplied, 9 of 13 pass, against none.
- **Fixed backbone (§6.5):** on GPT-5.5, DBAIOps has a higher Safe Pass than ReAct on both databases, while D-Bot has a lower Outcome Pass at several times ReAct's mean token cost; DBAIOps lies on the PostgreSQL cost–Safe Pass Pareto front and D-Bot on neither (Fig. 8).
- **Persistent operation (§6.6.1, Fig. 9):** across four models and ten scenarios, Service Compliance passes in 15 of 40 runs, the full outcome contract in 3 and Safe Pass in 2. In the traces, agents leave business obligations unfinished, competing workloads uncoordinated and completion overstated, and a later event undoes a verified repair (§6.6.2, §7).

## Limits the authors state

- Differences between the two databases "cannot be attributed to the DBMS alone because their task sets differ" (§6.2).
- Diagnosis comparisons "are limited by unequal coverage of resolved, applicable semantic judgments" (§1).
- The depth–complexity associations "are descriptive, as task composition varies across the plane" (§6.3.2).
- The failure-profile comparisons describe the classified cohorts: "the two databases do not contain paired scenarios, and classification coverage differs between them" (§6.3.1).
- The safety-annotation proportions "describe the annotated cohorts, rather than the incidence of safety violations among all unsuccessful runs" (§6.4), and "do not establish a DBMS-level difference in safety behavior" (§6.4).
- DBAIOps had "no public implementation", so the authors reimplemented it; the agent comparisons "reflect the evaluated agent implementations rather than the isolated effects of their individual mechanisms" (§6.1, §6.5).
- Costs are "normalized list-price estimates, not billing records" (§5.3); D-Bot's cache costs are estimated with a tokenizer proxy (Fig. 8).
- The persistent cohorts "characterize performance on the tested event sequences" (§1); they "do not estimate production failure frequencies or isolate the effects of individual events", and some TiDB failures can't be attributed to the model alone (§6.6.2). The paths "do not isolate memory loss or any other single agent mechanism as the cause of failure" (§7).
- The evaluation "does not measure" the effort of human review of agent actions (§7).

## Open problems and building blocks

- **Open:** "Future work could assess whether inspectable action plans reduce human verification effort while maintaining safe task completion"; "Future work should examine how agents maintain this operational state, coordinate concurrent workloads, and verify business outcomes throughout a continuing session" (§7). The authors call for agents that "map diagnoses to intervention targets, and verify all required postconditions", for "checks on action authorization, affected objects, and execution prerequisites before interventions are applied", and for "revalidation of completed repairs after relevant environmental changes" (§7).
- **Released:** the benchmark's "repository is at" a project URL (§1).
- **To reuse it:** live PostgreSQL or TiDB deployments with active workloads and snapshot restore (§3.2); the five-tool interface and shared report schema, which tree-search and knowledge-graph agents also plug into (§3.3.1, §6.1); Qwen3-4B-Instruct-2507, quantized, as the diagnosis judge (§6.1).

## On this site

- **Discussed in:** [Whole-job reliability of multi-step LLM work](#/challenges/whole_job_reliability)
- **Tags:** <span class="tags"><a class="tag" href="#/tags/benchmark">benchmark</a><a class="tag" href="#/tags/dbtask">dbtask</a><a class="tag" href="#/tags/harness">harness</a><a class="tag" href="#/tags/llm">llm</a><a class="tag sub" href="#/tags/dsl-sql">dsl-sql</a></span>
