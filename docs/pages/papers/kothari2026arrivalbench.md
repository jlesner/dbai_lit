# ArrivalBench: Agent-Generated Data Pipelines Are Correct Once and Wrong Under Time

**ArrivalBench** · NeurIPS 2026 workshop "Who Verifies the Agents?"

Read: [PDF](https://arxiv.org/pdf/2610.02363) · [arXiv](https://arxiv.org/abs/2610.02363)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Re-runs the SQL pipelines LLM agents write, after the agent has stopped, under replayable delivery schedules (late, duplicated, out-of-order, retried and backfilled records), on 40 tasks and eleven models (abstract, §3).
- The oracle requires the final table to equal a batch recomputation of the complete event log, so a silently wrong table (FAIL) and a crash (ERROR) are separate verdicts (§1, §3); the agent's repair loop sees only a single-snapshot test (§3 "The agent").
- A weak check measured in SQL: grading a stateful pipeline once on one snapshot, as the seven stateful benchmarks it audits do (§2), certifies pipelines that replay shows wrong; it reports 7.0–79.2% of the certified pipelines silently wrong across eleven models (abstract).

## In plain words

Benchmarks for agent-built data pipelines grade a pipeline by running it once on fixed data (abstract). The author argues that real data arrives late, twice, out of order or again after a crash, and that handling this is "baseline competence" that task descriptions leave out (§1). ArrivalBench re-runs the pipeline an agent left behind under adversarial but replayable re-deliveries of the same data, and requires its final table to equal a recomputation over all the data; a wrong table and a crash get different verdicts (abstract). On the author's 40 tasks, a reimplementation of run-once grading certifies 86–100% of the pipelines of eleven models, while re-running finds 7.0–79.2% of the certified ones silently wrong (abstract). For one mid-tier model (Sonnet 5), a warning about such delivery cuts silent failure from 48.2% to 10.5% but raises crashes from 9.0% to 37.0%, so failure of either kind falls only from 51.0% to 44.0% (abstract, §4.5). The paper calls its prompting result a domain extension of earlier work, "not a discovery", and names the re-execution oracle and the wrong-versus-crash separation as new (§2).

## Background and terms

**Terms to know:** [test oracle](#/glossary/test-oracle) · [metamorphic testing](#/glossary/metamorphic-testing) · [fault injection](#/glossary/fault-injection) · [idempotent operation](#/glossary/idempotent-operation) · [semijoin and anti-semijoin](#/glossary/semijoin-and-anti-semijoin) · [integrity constraint](#/glossary/integrity-constraint) · [bootstrap resampling](#/glossary/bootstrap-resampling) · [pre-registration](#/glossary/pre-registration) · [at-least-once delivery](#/glossary/at-least-once-delivery) (Kafka's, §1) · [watermark](#/glossary/watermark-stream-processing) (Spark's, §1; dropping late data graded as a failure, App. B) · [rule of three](#/glossary/rule-of-three) (§3)

**The paper's own terms:**
- **Pipeline**: one DuckDB SQL script (DuckDB is an embedded analytical database) run once per delivery batch against a persistent database; it must persist any history itself (§3, App. C).
- **Delivery schedule**: a split of a task's event log into batches (§3).
- **Hazards**: six kinds of delivery: late arrival, out-of-order change data (updates to one key arriving out of order), duplicate delivery, crash-and-retry, backfill (re-delivers processed events and releases withheld ones) and additive schema evolution (new columns appear midway) (§3). The first two are **ordering hazards**; the next three, **idempotency hazards** (§4.4, App. C). Schema evolution, the one hazard that fails loudly (naming a not-yet-existent column raises an error), is reported apart (§3). Two **benign controls** (one in-order batch, an in-order stream) separate ordinary incrementality bugs (wrong even when batches arrive in order) from temporal ones (§3).
- **Snapshot evaluation**: the author's reimplementation of grading by one run on the whole log as one batch (§4.2, App. C).
- **FAIL / ERROR**: a run that leaves a wrong table, against a crash (§1).
- **Gap**: the primary metric, "the silent-failure rate among artifacts an existing-style benchmark would have certified" (§3). **All-in failure** counts crashes too (§4.5; §3: "ERROR-inclusive").
- **Cell, arm**: one (task, sample) pair, five samples per task; one model under one prompt (§3). Rates are means over tasks unless stated (§3).
- **Masking**: metrics exclude crashes differently, so "a loud failure on one hazard can mask a silent failure on another in the same cell" (§3).
- **Negative control**: a wrong pipeline that passes snapshot evaluation and fails exactly its declared hazards (App. B).
- **Within-batch guard**: SQL that deduplicates inside the arriving batch, not only against stored history (§4.6, Fig. 4).

**Builds on:**
- SPARK (Xu et al., 2026), on models writing unsafe code unless asked, which "establishes the phenomenon" (§2).
- Seven stateful data-agent benchmarks that grade once, among them ELT-Bench ([ELT-Bench](#/papers/jin2025eltbench "ELT-Bench: An End-to-End Benchmark for Evaluating AI Agents on ELT Pipelines (2025)"); extract-load-transform) and ADE-Bench, "the closest" (§2, App. A Tab. 2).
- Metamorphic testing and fault injection (§3).

## Problem and setting

Does an agent's pipeline stay correct when the same data arrives differently, and does grading once notice (§1)? Correct means the final state after the last batch equals a batch recomputation of the complete log, for every schedule (§1, §3), by an independent implementation, not the gold pipeline (App. C "Three questions…").

- **Tasks:** 40, with 42 negative controls (§5); 19 drafted by an LLM and 11 from templates (App. B "Scope of the evaluation").
- **Agents:** eleven models from eight organisations (Tab. 1). The prompt names no hazard (§3, App. C).
- **Repair loop:** at most three turns; the harness runs it on the snapshot path only, returning a DuckDB error or a typed diff, so "snapshot-pass here is that metric's best case" (§3 "The agent").
- **Interventions:** a hazard hint (four arms) and an architecture prompt naming a stage-then-derive shape (stage new events into a history table, then derive the target; three arms) (§4.5, App. B, App. C).
- **Statistics:** pre-registered; bootstrap over tasks, each carrying all its samples (App. B "The bootstrap").
- NULL handling in the tasks: not discussed.

## Approach

- **Re-execute the artifact** 7–8 times per cell: snapshot, two benign controls, and the task's four or five declared hazards (App. A). The expected result doesn't depend on the schedule, so any difference is a temporal defect (§1).
- **Admissibility gate:** golds pass, negative controls behave as declared, every hazard perturbs delivery, and no hazard words leak (§3).
- **Verify the grader:** every gradeable verdict re-grades from stored artifacts with zero mismatches; four cells were re-derived by hand (§4.1).

## Results

- **Run-once grading can't separate the models on these tasks (figures above; §4.2, Tab. 1, Fig. 2):** two frontier models (Opus 5, GPT-5.6 Sol) separate from an overlapping cluster; the author claims no graded ordering across all eleven.
- **The repair loop doesn't make the gap (§4.2):** within arm and task, repaired cells fail replay about as often as first-time passes, with an interval "too wide to rule out a small effect in either direction".
- **Signature (§4.3, Fig. 3):** on group means (each group's mean pass rate), idempotency hazards fail more often than ordering ones in every unhinted arm, and none of the 18 arms reverses it. The author's caveats: a weakest-link form (weaker ordering against weakest idempotency hazard) favours a positive margin "by construction"; Codestral's (a Mistral model, Tab. 1) weakest-link margin is "effectively a tie", partly an artifact of that form and unequal declaration counts; in the two weakest arms ordering itself collapsed; at frontier tier the rule rests on one hazard. The arms "are not independent draws", so a one-sided [sign test](#/glossary/sign-test) against a null of 3/5, not 1/2, is not leaned on (§4.3, App. B).
- **Human anchor (§4.4):** four data engineers, nineteen cells on five tasks, without the repair loop, reverse the direction. "This anchor carries no claim."
- **Prompting converts or repairs (§4.5, App. B Tab. 5):** the hazard hint drives both frontier models' gap to zero, consistent with a true rate up to 7.5% (rule of three, §3); the small model (Haiku 4.5) is still often silently wrong. For Sonnet 5 the hint converts silent failure into crashes (figures above). For Haiku 4.5 the architecture prompt is a repair.
- **A partial specification can displace defences (§4.6, Fig. 4–5):** the architecture prompt brings the small and frontier models to zero gap (rule-of-three bounds; masking moves the small tier's zero), but for Sonnet 5 its difference from no prompt is inconclusive under the pre-registered rule (its interval crosses zero); what is established is "the non-uniform transfer rather than a degradation". All Sonnet 5's failures are on duplicate delivery, from deduplicating against history only, which the author blames on the prompt's wording. In that arm, pooled over cells, guarded cells never fail silently but 40.3% crash on duplicate delivery; unguarded ones never crash and fail silently 72.2% of the time: "The guard does not prevent failure; it relocates failure". Guarded pipelines fail silently less often in 12 of the 13 arms with at least ten cells in each group (Fig. 5b).
- **Replication (App. B Tab. 3):** re-running every unhinted arm moved rates by at most 5.9 points.

## Limits the authors state

- One author wrote the tasks, golds and controls, and "the gate checks conformance to those declarations rather than their correctness"; a validation pass like Zanoli et al.'s ([ELT-Bench-Verified](#/papers/zanoli2026eltverified "ELT-Bench-Verified: Benchmark Quality Issues Underestimate AI Agent Capabilities (2026)")) is future work (§5).
- One engine: "the signature could in part be a property of DuckDB SQL"; the schema-evolution loud failure (the unknown-column error) is "a name-binding artifact of this engine" (§5, App. B).
- Every gold shares one anti-join staging idiom, probed only by idempotency hazards, so "the idempotency half of the signature generalises less far" (§5).
- The hazard classes are declared by different task counts (the rule still holds on the 35 tasks declaring all five); schema evolution by 2 of 40, so the loud-failure and masking results describe "a twentieth of the suite" (§5).
- Three accounts of the signature as a design artifact remain open: task design and hazard difficulty, the staging idiom, the dialect (§5, §6). The human declarations were unenforced, "close to no control" (§4.4).
- Zero gaps "carry rule-of-three bounds, not demonstrated zeros"; interventions cover commercial models only; the open-weights arms ran through one third-party aggregator, and their set "is not the registered set" (App. B).
- The 8,000-token output cap "is not neutral, since it drops the hardest tasks for the models that reason longest"; the author reports that no conclusion depends on it (App. B).
- The prompt's test paragraph describes one run on one batch, unlike the execution contract; the comparison between arms is unaffected, but "a model could read the test description as the deployment it is writing for" (App. C).
- The guard mechanism "is exploratory, identified after the outcomes were known, and is not a controlled test"; the architecture arm was re-run under "an asymmetric stopping rule" (§4.6).
- The pre-registration doesn't set the loop budget (§3); error rates "are not comparable across models"; commercial-model identity is "corroboration, not proof"; the hand re-derivation skipped crash-and-retry semantics (App. B).

## Open problems and building blocks

- **Open:** "Whether a constraint expressing an invariant beats a query that assumes it is left open"; settling it needs "only a uniform template baseline keyed on each task's declared primary key" (§6). "A second engine is the single most valuable extension of this work" (App. B "The engine confound…").
- **Released:** nothing: code, tasks, controls, oracle and pre-registration "are not publicly available with this version of the paper" (App. B "Scope of the evaluation").
- **To reuse it:** grading needs no model calls; one arm re-grades in 230 seconds on one core (App. B "What the check costs").

## On this site

- **Discussed in:** [Benchmarks with checkable ground truth](#/challenges/checkable_benchmark_ground_truth) · [Comparing LLM methods under noise](#/challenges/method_comparison_under_noise) · [Weak checkers get exploited](#/challenges/weak_checker_exploitation)
- **Tags:** <span class="tags"><a class="tag" href="#/tags/compact">compact</a><a class="tag" href="#/tags/dbtask">dbtask</a><a class="tag" href="#/tags/labels">labels</a><a class="tag sub" href="#/tags/hacking-sql">hacking-sql</a><a class="tag sub" href="#/tags/harness-sql">harness-sql</a><a class="tag sub" href="#/tags/llm-gen">llm-gen</a><a class="tag sub" href="#/tags/llm-method">llm-method</a></span>
