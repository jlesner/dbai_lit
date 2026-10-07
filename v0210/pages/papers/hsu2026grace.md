# Scoped Verification for Reliable Long-Horizon Agentic Context Evolution under Distribution Shift

**GRACE** · preprint 2026

Read: [PDF](https://arxiv.org/pdf/2607.09175) · [arXiv](https://arxiv.org/abs/2607.09175)  
Code: [GRACE](https://github.com/RedMind-Research/GRACE)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Keeps an agent's persistent system instruction as a typed semantic graph, updated from operational experience while the model, tools and harness stay fixed (abstract).
- Validates each proposed update within the local neighborhood of the nodes it changes (abstract).
- A test case for [Can a memory across problems be checked before it is reused?](#/challenges/verified_memory): each update passes an LLM's contradiction and redundancy check on the edited neighborhood (§1, §4), not a check on task results and not a sound one; the held-out set is never used for evolution (Tab. 5 caption, §5.1). It reports pass^3 rising from 0.091 zero-shot to 0.661±0.158 on a τ²-bench-derived telecom harness (abstract).

## In plain words

A deployed LLM agent is steered by a long system instruction, which an LLM here keeps revising from the agent's failures while model, tools and [harness](#/glossary/agent-harness) (the code that assembles prompts and runs the agent) stay fixed. The authors argue that as the instruction grows, checking it as flat text gets harder, so later edits can undo earlier gains (§1). Their method, GRACE, stores the instruction as a graph of small typed rules and facts; after each revision an LLM checks only the rules near the changed ones for contradictions and redundancies, repairs them, and patches the deployed text.

On telecom customer-service tasks, with Gemini 2.5 Flash as the agent and five runs of ten revisions, they report that the share of tasks solved in all three tries rises from 0.091 to 0.661 at the final revision, against 0.191 for a one-call flat-text reviser that uses fewer LLM calls, and 0.242 for unrevised Gemini 3.1 Pro (abstract). Within one domain, model and harness, and with LLM-call budgets unmatched, they conclude that reliable evolution needs local verification and consolidation (abstract).

## Background and terms

**Terms to know:** [pass@k](#/glossary/passk) · [pass^k](#/glossary/passk-reliability-over-k-trials) · [catastrophic forgetting](#/glossary/catastrophic-forgetting) · [LLM-as-a-judge](#/glossary/llm-as-a-judge) · [bootstrap resampling](#/glossary/bootstrap-resampling)

**The paper's own terms:**
- **context evolution**: revising the agent's persistent system-level instruction (role, rules, procedures, domain assumptions) once per batch of experience, with model, tools and harness frozen; checkpoint ℓ_t is the instruction after update t (§1, §3).
- **substrate**: the form the instruction is kept and edited in offline: the text itself for flat-text methods, a graph for GRACE, from which the deployed text is rebuilt (§3).
- **typed semantic graph**: nodes are atomic instruction units of three types, `identity` (the agent's role), `norm` (a rule of conduct, including procedure steps) and `knowledge` (a domain fact); edges are `supports` (grounds), `refines` (a narrower case of) and `sequence` (procedural order), each allowed only between listed type pairs (§4.1, Tabs. 2–3). The setup follows heterogeneous information networks, graphs with several kinds of nodes and edges (§4.1).
- **structural analysis (SA)**: the LLM check for contradictions (two units that apply in overlapping situations and cannot both be followed, Eq. 13) and redundancies (same type, overlapping scope, one implies the other, and no graph relation giving a reason to keep both, Eqs. 14–15), followed by repair (§4.2).
- **k-hop typed neighborhood**: all nodes within k edges of the touched nodes, ignoring edges to the `identity` node, which links to every rule (§4.2, Eq. 12).
- **HCE (Holistic Context Evolution)**: the flat-text baseline: one LLM call applies the diagnosis as incremental edits and checks its draft for conflicts and duplicates (§5.1, App. H.9).
- **diagnosis**: a fixed two-stage LLM procedure shared by all conditions: reflect on each failed episode, then group the findings into themes (§5.1, App. G).

**Missing glossary terms:**
- **backward transfer (BWT)**: the change in an intent's pass^3 between the ends of consecutive same-phase rounds, after the experience mix has shifted away from it; positive means retained, negative means forgetting (§5.1, §5.3). A **cycle** is one shift and return (§5.3).
- **subpopulation shift**: the same kinds of tasks in both phases, in different proportions (§5.1, App. A).

**Builds on:**
- ACE (Agentic Context Engineering, [ACE](#/papers/zhang2025ace "Agentic Context Engineering: Evolving Contexts for Self-Improving Language Models (2026)")), the "closest prior system", an itemized playbook with incremental updates; HCE adopts its incremental-update contract but "should therefore be read as an ACE-style incremental flat-text updater under our shared diagnosis, not as a reimplementation of ACE" (§2 "Relation to ACE").
- τ²-bench, a benchmark of conversational agents working with a simulated user; its telecom domain, the testbed, is its "dual-control domain", where both act on shared state (§5.1, §6, App. F). Its predecessor τ-bench, a benchmark of tool-using agents with simulated users, supplies the metrics (§5.1).
- PathSim, similarity search over typed paths in such graphs: GRACE borrows its idea that an object's comparison context is the typed paths around it (§4.2).
- The prompt optimizers and evolving-context methods it contrasts with: DSPy ([DSPy](#/papers/khattab2023dspy "DSPy: Compiling Declarative Language Model Calls into Self-Improving Pipelines (2024)")), GEPA ([GEPA](#/papers/agrawal2025gepa "GEPA: Reflective Prompt Evolution Can Outperform Reinforcement Learning (2026)")), Reflexion ([Reflexion](#/papers/shinn2023reflexion "Reflexion: Language Agents with Verbal Reinforcement Learning (2023)")), Dynamic Cheatsheet ([Dynamic Cheatsheet](#/papers/suzgun2025cheatsheet "Dynamic Cheatsheet: Test-Time Learning with Adaptive Memory (2025)")), and agent-memory stores such as Mem0 and Zep (§2, Tab. 1).

## Problem and setting

- **Question:** can a different representation of the evolving instruction keep verification effective as it grows over many updates (§1, §2)?
- **Fixed:** agent model, tools, harness, diagnosis, initial instruction, experience batches and held-out set; only how the evolution step stores, checks and rebuilds the instruction varies (§3, §5.1).
- **Benchmark:** τ²-bench telecom; 66 held-out tasks and 10 experience batches of 42, with no task shared. Batches alternate between two phases that reweight two of the three user intents (the customer's problem type: MMS, i.e. multimedia messaging, and mobile data) in opposite directions (§5.1, Tab. 5, App. A).
- **Scoring:** τ²-bench's deterministic evaluator, no judge; each checkpoint gets 66 tasks × 3 trials (§5.1, App. G).
- **Models:** Gemini 2.5 Flash for the agent and for every method-internal call (those at temperature 0); GPT-4.1 simulates the customer (§5.1, App. G).
- **Conditions:** GRACE, GRACE without SA, and HCE, matched in diagnosis and update schedule "but not internal LLM-call budgets" (§5.1).

## Approach

- **Build the graph once.** An LLM decomposes the initial instruction into typed units and relations; the same LLM checks for missing or distorted units (§4.1, App. H.1–H.3).
- **Operation planning.** From the diagnosis, an LLM proposes node edits from six schema-preserving operators; a second pass fixes relations around the changed nodes (§4.2, Tab. 4).
- **Structural validation.** Schema checks, then up to three SA rounds over the subgraph within 3, 6, then 9 hops of the touched nodes, each an LLM detection prompt and a repair prompt, stopping when nothing is found (§4.2, App. G, App. H.6–H.7). The ablation skips the SA rounds only (App. G).
- **Delta reconstruction.** Validated node changes become replace, insert and delete patches, each anchored on a verbatim, unique span of the current text; a deterministic applier copies every untouched character, so the text is never regenerated (§4.2, App. G).

## Results

Five runs per condition, evaluated at ℓ6, ℓ8 and ℓ10 only (§5.1, Fig. 3).
- **Main result.** Mean pass^3 rises from 0.091 to 0.661±0.158 at ℓ10 for GRACE, against 0.191±0.051 for HCE (mean ± standard deviation over runs; Tab. 8). The gap is significant at every checkpoint by Welch's t-test (a two-sample test allowing unequal variances), an exact permutation test (comparing the observed gap with every reassignment of the ten runs to two groups) and a bootstrap interval over per-run means (§5.2, Tab. 10).
- **Frontier references.** Unrevised Gemini 3.1 Pro scores 0.242, and every GRACE run ends above it (§5.2, Tabs. 9, 14).
- **Ablation.** GRACE without SA reaches 0.458 at ℓ6, then falls to 0.248 at ℓ10 (Tab. 8). Its gap to GRACE is not distinguishable at ℓ6 (permutation p = 0.54) but separates at ℓ8 and ℓ10 (p = 0.016), which the authors read as SA mattering "through consolidation over time rather than through an immediate boost" (§5.2, Tab. 10).
- **Contradictions.** A post-hoc LLM-judge audit counts 3.35 contradictions on average for HCE against 1.75 to 1.90 for the graph conditions, on one trajectory per condition, not the five replications; the ablation also has more redundancy and nodes than GRACE (§5.3).
- **Size and cost.** At ℓ10 HCE's instruction is 1.6× longer than GRACE's, a gap that widens every batch (§5.3, Tab. 12). GRACE makes about six internal calls per step against HCE's one, but its whole-run offline cost is about 5% higher, and at Gemini 2.5 Flash list input pricing the shorter instruction recovers the extra cost "within the first one or two experience batches of deployment" (abstract, §5.1, §5.3, Tabs. 6–7).
- **Retention.** Backward transfer from the single-trajectory study is positive or zero for GRACE except Mobile Data in Cycle 1, a drop later recovered, and persistently negative for HCE, reported "as illustrative rather than replicated" (§5.3).

## Limits the authors state

- One domain, model and harness: "The results do not license claims about other domains, models, or harnesses" (§6). Telecom is rule-heavy, "plausibly favorable to a typed-graph substrate"; instructions dominated by examples, output templates or tool schemas may need a custom schema (App. F).
- Compute is unmatched; the comparison "does not isolate the contribution of extra inference compute alone" (§5.1). The ablation's half budget "argues against a pure compute explanation, but it does not settle the question" (§6).
- The audits are LLM-judged and correlational: "part of the measured redundancy reduction could reflect alignment with the judge rather than a change a human would recognize" (App. F).
- Five runs give limited power (§5.2): "the tests establish the ordering of the conditions at the later checkpoints, not precise effect sizes" (§6); GRACE's own rise from ℓ6 to ℓ10 is "only marginally significant" (§5.2).
- The graph-building check uses the same LLM, so it "guards against omission rather than certifying semantic completeness"; untyped content is verified only as finely as its typing allows (§4.1).
- The schema is "not a claim that three types suffice for every instruction" (§4.1).

## Open problems and building blocks

- **Open:** "the most informative next experiments are a budget-matched flat-text control, a second benchmark domain, and an audit with an independent judge" (§7), with human agreement (App. F); "A budget-matched comparison against the full ACE pipeline remains future work" (§2).
- **Released:** the implementation, reproduction runner, frozen task split, prompts, configuration and per-run results (App. G "Reproducibility"; abstract). §4.1 says the release's example schema uses other type names. All prompts are printed (App. H), per-run values listed (App. E).
- **To reuse it:** an LLM for every stage with JSON outputs, a type schema in YAML or code, and τ²-bench at a pinned commit (§4.1, App. G). Gemini 2.5 Flash is to be retired on October 16, 2026, and graph granularity is model dependent (App. G).

## On this site

- **Discussed in:** [Can a memory across problems be checked before it is reused?](#/challenges/verified_memory) · [Whole-job reliability of multi-step LLM work](#/challenges/whole_job_reliability)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/harness-general">harness-general</a><a class="tag sub" href="#/tags/harness-promptopt">harness-promptopt</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/promptopt-context">promptopt-context</a><a class="tag sub" href="#/tags/promptopt-feedback">promptopt-feedback</a><a class="tag sub" href="#/tags/promptopt-general">promptopt-general</a></span>
