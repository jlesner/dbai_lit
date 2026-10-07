# Verify Smarter, Evolve Further: Efficient Harness Evolution through Behavior-Aware Verification

**HarnessLens ("Verify Smarter** · Evolve Further"), preprint 2026

Read: [PDF](https://arxiv.org/pdf/2608.27311) · [arXiv](https://arxiv.org/abs/2608.27311)  
Code: [HarnessLens](https://github.com/jhxu5214/HarnessLens)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Budget-aware evolution of agent harnesses (instructions, tools, runtime components) (abstract).
- Derives candidate edits from trajectories and verifies each only on behavior-relevant tasks, behind an attributable-evidence gate (abstract).
- A gate on harness changes, relevant to [Can a memory across problems be checked before it is reused?](#/challenges/verified_memory).

## In plain words

An agent harness is the software around a language model that makes it an agent: its instructions, skills, tool descriptions and similar settings. The authors ask whether a harness can improve itself from the records of its own runs. They say existing methods typically test every proposed edit on one fixed task set, wasting runs on unrelated tasks and letting an overall score hide what an edit broke (abstract). HarnessLens has LLM roles read past runs and propose one edit at a time, tested on tasks chosen for the behavior it targets plus tasks it might break. An edit is kept only if an LLM reviewer traces at least one improved task to it and finds no task it broke, and the pass rate also rises on a second, mostly fresh batch (§4). With one DeepSeek model, three coding-agent harnesses and four benchmarks, the authors report that average held-out performance rises by 7.6–13.6% over the unedited harness, on a smaller budget than three earlier harness-evolution methods (abstract, §5.2). They present it as better verification than these methods (§1).

## Background and terms

**Terms to know:** [agent harness](#/glossary/agent-harness) · [pass@k](#/glossary/passk) · [text-to-SQL](#/glossary/text-to-sql) · [reflective prompt optimization](#/glossary/reflective-prompt-optimization) · [LLM-as-a-judge](#/glossary/llm-as-a-judge).

**The paper's own terms**
- **harness framework, user-configurable components, harness**: the framework (e.g. OpenCode) is fixed and exposes components a user may configure (instructions, skills, prompt templates, tools, agent roles, runtime extensions); a harness is the framework plus a setting for each component (Def. 1, §3.1).
- **modification, candidate**: an edit to one or more components' settings, framework unchanged; applying it gives a candidate harness (Def. 3, §3.1).
- **trajectory**: the observations and actions of one run on a task; each run gets reward 1 (task completed) or 0 (§3.2).
- **behavior**: "a recurring, model-visible pattern within such trajectories: which actions the agent takes, in what order, and under which conditions"; read from trajectories, not rewards (§3.2).
- **interaction budget**: LLM sessions plus task trials spent over the whole evolution; an LLM session is "one complete multi-turn execution of a model-based role" (§3.2). Each costs one unit (App. A.1).
- **confirmed harness**: the harness accepted so far; candidates are made from it, so accepted edits accumulate (§4.3).
- **selection labels**: each verification task is marked conversion (an initial failure that directly exercises the targeted behavior), positive control, preservation or diagnostic (Tab. 5, App. A.4.1).
- **comparison labels**: per task, current against candidate harness: recovered (the current harness never succeeds, the candidate at least once), stable success, regressed, still failing, mixed (Tab. 6, App. A.4.2).
- **attributable-evidence gate**: a verification stage advances only with "attributable positive evidence and no attributable regression": a recovered task, or a stable success with a higher pass count, that the LLM diagnosis ties to the edited component; "preservation alone is insufficient" (App. A.4.2).
- **TRAIN, TEST, pass@1**: TRAIN is the 30 tasks per benchmark used during evolution; TEST is held out. pass@1 here is one fresh trial per TEST task under the final harness; the TRAIN pass rate averages two trials per task (App. B.3).

**Missing glossary terms**
- **rollout**: one run of the agent on one task, giving a trajectory and a reward (§3.2, §4).
- **coreset**: a small task subset picked once, before evolution, to stand in for the whole set (§1, §2).

**Builds on**
- Propose-and-verify prompt and program optimizers: OPRO ([OPRO](#/papers/yang2023opro "Large Language Models as Optimizers (2024)")), MIPRO ([MIPRO (shipped in DSPy as MIPROv2)](#/papers/opsahlong2024mipro "Optimizing Instructions and Demonstrations for Multi-Stage Language Model Programs (2024)")), TextGrad ([TextGrad](#/papers/yuksekgonul2024textgrad "TextGrad: Automatic 'Differentiation' via Text (2024)")) (§1).
- The baselines, "trajectory-based harness-evolution methods": Self-Harness, Meta-Harness ([Meta-Harness](#/papers/lee2026metaharness "Meta-Harness: End-to-End Optimization of Model Harnesses (2026)")) and HarnessFix (§5.1); Self-Harness and HarnessFix are not listed here.
- Cheaper verification it contrasts with: GEPA's random minibatches ([GEPA](#/papers/agrawal2025gepa "GEPA: Reflective Prompt Evolution Can Outperform Reinforcement Learning (2026)")), a preselected coreset (Pan et al., not listed here) and staged screening (Luo et al., not listed here) (§1, §2).
- Trajectory diagnosis for harness repair: AHE (Agentic Harness Engineering, [Agentic Harness Engineering (AHE)](#/papers/lin2026ahe "Agentic Harness Engineering: Observability-Driven Automatic Evolution of Coding-Agent Harnesses (2026)")) and HarnessFix (§1).

## Problem and setting

- **Question:** "can an agent harness autonomously and continually evolve from the interaction evidence generated during task execution?" (§1). Formally: the harness with the highest expected task success reachable within the budget, base model and framework fixed (§3.1–3.2).
- **Benchmarks** (§5.1; descriptions from the cited works' titles and App. B.2): τ²-bench Retail (a conversational agent with a simulated user), τ³-bench Banking Knowledge (a conversational agent over unstructured knowledge), Terminal-Bench 2.0 (hard command-line tasks), and BIRD Mini-Dev's Challenging subset (text-to-SQL; [BIRD](#/papers/li2023bird "Can LLM Already Serve as A Database Interface? A BIg Bench for Large-Scale Database Grounded Text-to-SQLs (2023)")).
- **Splits:** 30 random TRAIN tasks per benchmark; TEST is the official split or the rest, never visible during evolution (§5.1, Tab. 7).
- **Harnesses** (§5.1): OpenCode (an open-source coding agent), Codex CLI (OpenAI's coding agent) and Pi Coding Agent (Zechner's agent harness), at fixed versions.
- **Model:** `deepseek-v4-flash-preview` for every agent and evolution role; web search disabled, permissions fixed (§5.1, App. B.2). Each benchmark's verifier gives the reward.
- Variation across repeated evolution runs: not discussed.

## Approach

A deterministic controller runs three stages, tracks the budget and enforces the update rules (§4, Fig. 2, Alg. 1).

- **Context Exploration (§4.1).** Task-Space Exploration groups TRAIN tasks by user goal from queries, policies and tool descriptions, running no task. Harness-Space Exploration reads the framework's configuration, documentation and runtime behavior and keeps components "that can be reliably identified and updated" (§4.1; list in Tab. 4).
- **Trajectory Diagnosis (§4.2).** Experience Extraction turns trajectories into reusable experiences and recurring deficiencies, each linked to supporting trajectories; Experience Analysis turns these into edit proposals (targeted behavior, trajectories, components) and drops unsupported ones.
- **Harness Evolution (§4.3).** An evolution agent picks one proposal per iteration; an editor applies it to a copy of the confirmed harness. A load check rejects edits with no applicable checker or whose content never reaches the agent's runtime context, which "prevents edits to inert files from being credited as behavioral changes" (App. A.3).
- **Behavior-aware verification (§4.3, App. A.4).** At least five distinct TRAIN tasks: one or more conversion tasks, one linked to the supporting trajectories, others covering related goals, affected tools and regression risks. Both harnesses run each task twice under matched conditions. A comparison role labels tasks without seeing the edit; the diagnosis role then sees it and judges attribution (App. A.2), an LLM-as-a-judge step.
- **Confirmation (§4.3, App. A.4.1).** A candidate passing the gate is rerun on a same-size batch keeping at most two earlier tasks (fewer than the batch size), the rest unused TRAIN tasks that succeeded under the initial harness (App. A.4.1); acceptance needs the evidence to hold and the pass rate to rise, since "improvement in the primary metric alone is insufficient" (§4.3).
- **Budget (App. A.1).** The initial run (30 tasks, two trials) costs 60 units and is reused when verifying against the unedited harness. An iteration starts only if both rounds plus a three-unit buffer are affordable; evolution stops when no supported proposal remains or the budget runs out (§4.3).

## Results

The baselines' configured maxima are 4,800, 660 and 300 TRAIN rollouts, against 200 units for HarnessLens that also count LLM sessions; the authors say this understates the budget gap (§5.1, §5.2, Tab. 9).

- **Main results (Tab. 1, TEST pass@1, budget 200 units).** The four-benchmark average rises from 41.83 to 47.53 on OpenCode, 40.94 to 44.06 on Codex and 45.49 to 49.67 on Pi; the authors summarize this as "average performance improvements of 7.6–13.6%" (§7). The authors report best or tied-best results in eight of the twelve harness–benchmark pairs, gains smallest on Retail and largest on Banking and BIRD (§5.2).
- **Stability (§5.2).** It reports that HarnessLens never falls below the unedited harness (worst case a tie: no edit accepted), while Self-Harness and Meta-Harness often fall below it. The authors say behavior-aware verification "acts as a filter rather than a search accelerator", and report that more verification rollouts did not give better harnesses.
- **Ablation (Tab. 2, §6.1, OpenCode).** With the gate kept but fixed or random 10-task batches, results equal the unedited harness on Retail, Banking and BIRD (75.00, 20.90, 37.50); "RHO-based" selection (from Pan et al.) reaches 38.89 on BIRD only; a metric-only gate reaches 80.00 on Retail only; the full method 85.00, 25.37 and 45.83.
- **Gate against metric (App. C.2.2, Fig. 5).** Re-scoring the stored evidence of 19 paired iterations in four OpenCode runs, a rule accepting any pass-rate gain would accept 10 edits where the gate accepted 5; the gate rejected large batch gains without an attributable recovery.
- **Task diversity (§6.2, Fig. 3).** In BIRD, related tasks share one SQL decision (extreme-value queries), giving an attributable recovery; in Terminal-Bench 2.0 a broad rule recovered nothing and caused a regression.
- **OpenCode runs (App. C.2.3–C.2.4).** General instructions were attempted most but seldom accepted; most units go to rollouts, behavior comparison and diagnosis (Fig. 6).

## Limits the authors state

- One model family, three harnesses, four public benchmarks; effectiveness beyond these "has not yet been fully validated" (§ Limitations).
- The budget "does not normalize token usage, latency, or monetary cost across roles and benchmarks" (§ Limitations); it compares "auditable interaction budgets, not matched total compute costs" (Tab. 9).
- Baselines are given at configured maxima; actual consumption can be lower (App. B.4).
- The re-scoring "does not show how the counterfactual metric-only harnesses would perform" (App. C.2.2); "one run per benchmark does not support a rate estimate" (App. C.2.3).
- Pairing "does not assume provider-side determinism" (App. A.4.2).

## Open problems and building blocks

- **Open:** no future work stated. The bottleneck they name: "high task diversity makes broadly effective modifications harder to identify" (§6.2).
- **Released:** code (abstract); a supplement with "our implementation, configurations, prompts, split identifiers, and derived run metadata", without third-party agent code, benchmark data, model weights or full trajectories (App. B.5).
- **To reuse it:** a harness whose components can be discovered and updated (§4.1; tool-description edits cannot add tools, App. A.3); a 0/1 task reward (§3.2) and 30 TRAIN tasks (§5.1); one model for all roles, here with a 65,536-token context and up to 30–60 agent steps per role (App. A.2); a budget of 200 units (§5.1).

## On this site

- **Discussed in:** [Self-improvement that compounds](#/challenges/compounding_self_improvement)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/harness-general">harness-general</a><a class="tag sub" href="#/tags/harness-promptopt">harness-promptopt</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/promptopt-context">promptopt-context</a><a class="tag sub" href="#/tags/promptopt-feedback">promptopt-feedback</a><a class="tag sub" href="#/tags/promptopt-general">promptopt-general</a></span>
