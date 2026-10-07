# DBA-Bench: A Production-Fidelity Benchmark for LLM-Based Database Operations Agents

**DBA-Bench** · preprint 2026

Read: [PDF](https://arxiv.org/pdf/2607.22165) · [arXiv](https://arxiv.org/abs/2607.22165)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- A benchmark of LLM database-operations agents on instrumented, live PostgreSQL environments with active workloads (abstract).
- Success is measurable recovery or fault elimination under safety constraints, from snapshots restored before each run (abstract).
- Operations work scored by outcomes rather than judged answers.

## In plain words

Running a production database means fixing slow queries, outages and risky changes while it serves traffic. LLM agents for this job were each tested on their own setup, so results are hard to compare; the authors write that "To our knowledge, there is no shared, reproducible evaluation environment" for this (§1). They built 106 broken PostgreSQL databases with live traffic, each restored from a saved copy before every run. An agent must find the cause, repair it and check the repair. Success means measurable recovery or removal of the fault, checked on the database itself; a safe pass also requires breaking no safety rule (abstract).

Over 848 automated runs (six LLMs in a common agent loop and two published database agents, one run per scenario), the cause was found in 32.7% of runs, the database recovered in 19.6% and recovered safely in 12.4%; the best automated system reached 17.9% safe passes against 93.4% for a human database administrator (abstract). The authors present a benchmark, an evaluation protocol and an empirical study, not a new agent (§1).

## Background and terms

**Terms to know:** [query plan and EXPLAIN](#/glossary/query-plan-and-explain) · [cardinality estimation](#/glossary/cardinality-estimation) · [F1 score](#/glossary/f1-score) · [Pass@k](#/glossary/passk) · [LLM-as-a-judge](#/glossary/llm-as-a-judge) · [Pareto front](#/glossary/pareto-front) · [OLTP and OLAP workloads](#/glossary/olap-and-oltp)

**The paper's own terms:**
- **DBA**: database administrator; "Human DBA" is the human baseline (§1, Tab. 2).
- **dirty environment**: the running database once the injected fault shows its symptoms, snapshotted with its workload and deployment state (§3.2).
- **manifestation predicates**: scenario-specific checks that the intended causal state and visible symptoms are present; rerun after each restore, and a run starts only if they hold (§3.2).
- **success contract**: a scenario's executable pass condition, one kind per task domain, e.g. for misleading alerts "The true causal fault must be resolved without acting on the decoy, and the target operation must be rechecked" (§5.1).
- **reference-path diagnostic depth**: the number of evidence-supported logical hops in a DBA-validated path from the initial symptom to the root cause (§4.2).
- **environmental complexity**: the share of units (log lines, rows, time-series points) returned by the reference path's key tools that don't support the causal path (§4.2).
- **Easy / Hard**: Hard when depth is above 2 and complexity is at least 0.5; Easy otherwise (§4.2).
- **Diagnosis Pass**: the submitted root-cause conditions match the required ones with set-based F1 of at least 0.8, all critical conditions are present, and no listed contradictory diagnosis is submitted (§5.1).
- **Outcome Pass**: the scenario verifier gives full credit; it "primarily checks the post-run database state and structured task artifacts", plus action records when the contract requires (§5.1). A run that exhausts its budget, submits an invalid report or none gets neither pass (§5.4).
- **Safe Pass**: Outcome Pass with zero recorded safety-rule violations; the primary endpoint (§5.4).

**Missing glossary terms:**
- **table statistics and ANALYZE**: stored summaries of a table's data that the optimizer uses to estimate row counts; PostgreSQL's `ANALYZE` refreshes them (§4.3).
- **root-cause analysis**: finding the fault behind visible symptoms rather than treating the symptom (§1 "Gap 4").

**Builds on:**
- AIOpsLab, which evaluates agents on "detection, localization, root-cause analysis, and mitigation in interactive microservice environments"; "the closest operational precedent", whose pattern the authors adapt to database internals (§1, §2).
- Agent benchmarks from other domains as design precedents, among them AgentBench, GAIA and SWE-bench (repository edits judged by the repository's tests) (§2).
- ReAct ([ReAct](#/papers/yao2022react "ReAct: Synergizing Reasoning and Acting in Language Models (2023)")), the common Think–Act–Observe loop for the model baselines (§6.1).

## Problem and setting

- **Question:** can LLM agents diagnose and safely repair faults in a live database, judged by the state their actions leave, and how do current systems compare (§1)?
- **Database:** instrumented PostgreSQL with an OLTP, OLAP or mixed workload active during diagnosis and verification (§3.2).
- **Scenarios:** 106 in seven task domains (query tuning, system failure, periodic health check, business change, resource governance, composite faults, misleading alerts); 42 Easy, 64 Hard (Tab. 1, §4.2). Sources include public issue reports, postmortems and troubleshooting material; DBAs review each (§4.1).
- **Baselines (Tab. 2, §6.1):** frontier LLMs GPT-5.5, Claude Opus 4.8, GLM-5.1, Qwen3.7-Max, DeepSeek V4 Pro and the open-weight Qwen3-Coder-Next in one minimal ReAct loop; D-Bot and DBAIOps on GPT-5.5; a Human DBA with the same tools, snapshot and submission schema.
- **Protocol:** one run per baseline–scenario pair ("single-run pass@1"); temperature and top-p fixed where the API allows (§6.1).
- **Not discussed:** the run budgets used, the PostgreSQL version, data sizes, how many human DBAs took part, and which model the failure-label judge uses.

## Approach

- **Scenario construction (§3.2, Fig. 1):** a generator starts the workload, executes the fault program, waits until the manifestation predicates hold, and snapshots the dirty state; each run restores it and rechecks them.
- **Tools (§3.3.2):** `query_metrics`, `execute_sql` (any SQL, including plan inspection, DDL and session control), `manage_instance` (process control and configuration), `read_log` and `query_knowledge_base`; only `execute_sql` and `manage_instance` can change state.
- **Knowledge (§3.3.3, §6.1):** a corpus without scenario labels or gold answers, which can be exposed as flat documents, a hierarchy or a knowledge graph; in the experiments, official PostgreSQL documentation and operational SOPs, retrieved by the agent.
- **Worked example (§4.3, Fig. 2):** statistics are collected on 300K rows, then 1.2M rows for one key are inserted with autovacuum (PostgreSQL's background maintenance) off. The planner underestimates rows, a long scan holds a lock, and only lock waits and write timeouts show. Terminating the blocker leaves the stale statistics and the fault recurs; the four-hop diagnosis leads to `ANALYZE`.
- **Scoring (§5):** verifiers "query database state, rerun target operations, and inspect the task artifacts" (§5.1); diagnosis by set F1; safety as a weighted sum of violated scenario rules over SQL and instance-management traces, "risk-aware rather than write-averse": inherently destructive operations are flagged unless explicitly required by the scenario, unconstrained `DELETE`/`UPDATE` is penalized, and session termination, restarts or configuration changes are judged by whether the trace shows evidence, constraints and post-action verification (§5.2). Correctness, safety and cost are reported separately (§5).

## Results

The authors report (106 scenarios, one run per pair):
- **Overall (§6.2, Fig. 3):** across 848 automated runs, Diagnosis, Outcome and Safe Pass are 32.7%, 19.6% and 12.4%; GPT-5.5 and Claude Opus 4.8 lead at 17.9% Safe Pass, against 93.4% for the Human DBA. No automated baseline leads Safe Pass in every category.
- **Diagnosis to repair (§6.2):** 172 of the 277 diagnosis-passing runs (62.1%) fail Outcome Pass; "Agents therefore often localize the root cause without completing the repair."
- **Repair to safety (§6.4):** of 166 outcome-passing runs, 61 (36.7%) fail Safe Pass. Among the failure analysis's unsafe-recovery labels, most are unscoped interventions or missing safeguards rather than destructive or protected-object violations; they occur in all seven categories.
- **Difficulty (abstract, §6.3, Fig. 5):** automated Safe Pass falls from 19.6% on Easy to 7.6% on Hard (abstract). Across automated runs, Outcome Pass also falls from direct to deep diagnosis and from low to high complexity; the depth gap varies by system (GPT-5.5 about level, D-Bot dropping steeply) (§6.3).
- **Failure modes (§6.3, Fig. 6):** an LLM-as-a-judge classifier gives each of 700 evaluator-readable non-clean runs one dominant label. Noise/decoy anchoring dominates misleading-alert failures, causal-chain truncation dominates composite faults, a wrong remediation target or action leads in system failures and business changes, and decisive evidence omission in periodic health checks and resource governance.
- **Fixed backbone (§6.5):** on GPT-5.5, Safe Pass is 17.9% for ReAct, 14.2% for DBAIOps and 5.7% for D-Bot, at mean model costs of $1.0210, $0.3150 and $7.1564 per run; same order on Hard scenarios. The authors conclude that tree search or knowledge-graph guidance "can change the operating point without removing the underlying failure modes" (§7.1).
- **Cost (§6.2, Fig. 4):** the Pareto front of Safe Pass against mean cost holds DeepSeek V4 Pro, DBAIOps, GLM-5.1 and Claude Opus 4.8, which matches GPT-5.5's Safe Pass at lower cost.

## Limits the authors state

- The reference path "is not claimed to be unique or shortest", so depth is "a reproducible scenario annotation rather than an intrinsic minimum" (§4.2).
- Path-level noise "serves as a proxy for broader non-causal activity in the environment" (§4.2).
- Restoration does not require "identical runtime schedules, observations, or agent trajectories" (§3.2); the environments preserve "selected operational properties" (§8).
- Costs "are normalized list-price estimates rather than provider billing records" (§5.3).
- Without decoding controls, "the provider's documented nondeterminism is retained" (§6.1).
- With no public DBAIOps implementation, the authors "independently reimplemented" it; D-Bot is adapted from the public DB-GPT code (§6.1).
- The scenario annotations "support descriptive, non-causal comparisons of these factors" (§6.3).
- The failure-label statistic "does not estimate the prevalence or severity of all safety defects that may co-occur within a run" (§6.4).
- "the overall ordering does not imply uniform superiority across operational domains" (§6.2).

## Open problems and building blocks

- **Open:** none stated as open problems or future work. The authors name a "diagnosis-to-remediation bottleneck" (§6.2) and draw design lessons (§7.1): agents should "maintain competing explanations, seek disconfirming observations, and record which causal links remain unverified"; "a final safety filter is too late", so an agent "should carry a repair contract through the whole control loop"; and "larger context windows or more retrieval alone are unlikely to solve the problem".
- **Released:** "Benchmark artifacts are available at" the project repository (§1); "The complete scenarios and evaluation artifacts will be released publicly upon publication" (§8).
- **To reuse it:** PostgreSQL environments with active workloads and full-state snapshots (§3.2); the five-tool interface and shared report schema, which tree-search and knowledge-graph agents also use (§3.3.1). Mean cost per automated run spans $0.0803 (DeepSeek V4 Pro) to $7.1564 (D-Bot) (§6.2).

## On this site

- **Discussed in:** [Whole-job reliability of multi-step LLM work](#/challenges/whole_job_reliability)
- **Tags:** <span class="tags"><a class="tag" href="#/tags/dbtask">dbtask</a><a class="tag sub" href="#/tags/harness-sql">harness-sql</a><a class="tag sub" href="#/tags/llm-method">llm-method</a></span>
