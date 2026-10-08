# GRASP: Gated Regression-Aware Skill Proposer for Self-Improving LLM Agents

**GRASP** · EMNLP 2026

Read: [PDF](https://arxiv.org/pdf/2605.29668) · [arXiv](https://arxiv.org/abs/2605.29668)  
Code: [GRASP](https://github.com/jomoll/GRASP)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Improves an LLM agent through edits to a bounded library of skills (Markdown instructions injected into its context), with no weight updates: an LLM labels each failed trace with a failure mode, and a skill writer proposes add, modify or remove edits for the most frequent modes (abstract; §2.1–2.2).
- Each candidate is re-run on a balanced probe of previously failing and previously passing dev episodes and accepted only if it fixes more than it breaks and adds no new regression (§2.3); five models on MedAgentBench and MedAgentBench-v2, scored by exact match against ground-truth answers and FHIR server state, with FHIR-AgentBench and four AgentBench environments as support (§3.1–3.2).
- A validation gate tested against ungated self-improvement: the authors report that the same gate lifts each of five baselines in-domain and none out of distribution (abstract; §4.6, Tab. 5), and that skill writing without validation is no better than no skills (abstract); their ablation shows that this holds with one proposal per batch, while applying all four proposals without a gate scores well above no skills (§4.5, Tab. 4). Scores are against FHIR state, not clinical correctness (Limitations).

## In plain words

LLM agents in structured software, such as health records, fail in repeatable procedural ways. The authors say earlier self-improvement methods keep adding written advice without checking that each new item keeps previously correct behavior, so "a note that fixes one trajectory can silently regress another" (abstract). GRASP keeps a small library of written instructions (skills) in the agent's prompt and changes it one edit at a time. An LLM proposes several edits from grouped failures; an edit is kept only if, re-run on earlier failing and passing training tasks, it fixes more than it breaks compared with the current library, and breaks no more passing ones than that library does (§1, §2). No weights change. On MedAgentBench, a clinical records benchmark, they report gpt-oss-120b rising from 40.6% to 88.8% test accuracy, 21.0 points above the strongest of five baselines (abstract; §4.1). There, the same check given to the baselines (one proposal per batch, gpt-oss-120b) lifts each in-domain and none on held-out task types (abstract; §4.6). They present it as a fix for that failure mode (§5), not as a first.

## Background and terms

**Terms to know:** [agent skill](#/glossary/agent-skill) · [agent harness](#/glossary/agent-harness) · [catastrophic forgetting](#/glossary/catastrophic-forgetting) · [exact match](#/glossary/exact-match) · [out-of-distribution generalization](#/glossary/out-of-distribution-generalization) · [compute-matched comparison](#/glossary/compute-matched-comparison) · [lost in the middle](#/glossary/lost-in-the-middle)

**The paper's own terms:**
- **skill**: an instruction injected into the agent's context, with a trigger condition, a behavioral rule, an optional verification step and a contrastive example, stored as Markdown with YAML frontmatter (§2.1), "mirroring the Agent Skills SKILL.md convention" (App. B.4). The library starts empty (§2.1) and holds at most 10 skills (Tab. 7). In the glossary's terms, it is the part of the agent harness GRASP changes.
- **skill writer**: the LLM that proposes edits; within a run, the same model as the agent (§3.2).
- **failure label**: an open-vocabulary, mechanism-specific label an LLM classifier gives each failing trace from its actions, its answer and the expected answer, such that "two labels imply two different corrective actions" (§2.2).
- **probe**: up to half previously failing and half previously passing development-split episodes from earlier in the epoch (the previous epoch's for its first batch), stratified by task type, never validation or test examples (§2.3). A **regression** is a probe episode that passed earlier and fails under the library being scored.
- **acceptance gate** (§2.3, Eq. 1): fixes minus regressions, each counted against a fresh re-run of the current library on the probe, must be above zero, and regressions may not exceed the current library's (the **hard regression budget**).
- **comparative proposal generation**: several candidates per batch (4 by default) for the gate to choose among; with one, the gate only accepts or rejects (App. E.2).
- **OOD**: accuracy on task types held out from training (Tab. 1 caption; App. D), a narrower sense than the glossary's.
- **matched compute**: ablations that score every candidate on the full probe but pick the edit without the scores, by the writer's preference or at random (§3.5).

**Missing glossary terms:**
- **FHIR**: not spelled out in the paper; Fast Healthcare Interoperability Resources, a standard for exchanging health-record data as typed resources over a web API (general definition).

**Builds on:**
- The verbal-feedback paradigm of Reflexion ([Reflexion](#/papers/shinn2023reflexion "Reflexion: Language Agents with Verbal Reinforcement Learning (2023)")) and ExpeL ([ExpeL](#/papers/zhao2023expel "ExpeL: LLM Agents Are Experiential Learners (2024)")), but "on a structured library rather than a flat memory" (§2.2; App. A).
- Skill libraries in an agent's context, after Voyager ([Voyager](#/papers/wang2023voyager "Voyager: An Open-Ended Embodied Agent with Large Language Models (2024)")) (§2.1; App. A).
- Held-out validation as in DSPy ([DSPy](#/papers/khattab2023dspy "DSPy: Compiling Declarative Language Model Calls into Self-Improving Pipelines (2024)")) and the prompt optimizers of Zhou et al. (2022) ([APE](#/papers/zhou2022ape "Large Language Models Are Human-Level Prompt Engineers (2023)")) and Yang et al. (2024) ([OPRO](#/papers/yang2023opro "Large Language Models as Optimizers (2024)")), applied here to an editable library with explicitly bounded regressions (§2.3; App. A).
- Five baselines (§3.3): sequential and batch memory (correction notes appended per failing episode or per batch, from Chen et al. (2025)), ExpeL (rules capped at 20), Evo-MedAgent (Shen et al., 2026; episodic and semantic memory with retrieval) and SkillX (Wang et al., 2026; skills from successful trajectories).

## Problem and setting

- **Question:** can an agent improve without weight updates through gated edits to a bounded skill library, and which part produces the gain (§1)?
- **Benchmarks** (§1; §3.1 calls all three primary; App. D): MedAgentBench (query a live FHIR server, reconcile medication orders, write resources) and MedAgentBench-v2 (multi-step decisions, coordinated writes, safety protocols) are primary; FHIR-AgentBench (read-only clinical question answering on a separate FHIR environment) supports. Four AgentBench environments test generality: ALFWorld (a text game of household tasks), WebShop (a simulated shopping site), OS Interaction (operating-system tasks) and DBBench (database queries).
- **Correct means:** exact-match accuracy against ground-truth answers and FHIR-server state (§3.1); writes are scored by comparing the proposed payload with the expected resource; FHIR-AgentBench uses an LLM judge, AgentBench its native success criteria (App. D).
- **Models** (§3.2; App. C): gpt-oss-120b and DeepSeek V4 Flash, self-hosted open models; Gemini 3.1 Flash Lite, GPT-5.4 (low reasoning effort) and GPT-4.1, "three frontier models", via APIs.
- **Protocol** (§3.4): 5 epochs, batches of 48 episodes, a 36-episode probe, 4 candidates per batch; the best-validation checkpoint is tested once. Five seeds for open models, three for proprietary; three for ablations and model transfer. All methods inject into the same prompt field (§3.3; App. B.5).

## Approach

- **Per batch** (§2.2; App. B.1, Alg. 1): run the agent; label failures; cycle over failure groups from largest to smallest, asking the writer for one ADD, MODIFY or REMOVE edit per call. ADD is blocked at capacity unless paired with a REMOVE.
- **Selection** (§2.3): score each candidate on the probe; apply the highest-scoring one that passes the gate. If the winner causes any regression, the writer may narrow it, kept only if it scores higher and meets the budget (App. B.2). Invalid-action regressions count double in the score, not in the budget (App. B.3).
- The classifier and writer see expected answers; the gate sees only pass or fail (App. F).

## Results

All are the authors' reports.
- **Main** (§4.1, Tab. 1): on MedAgentBench GRASP is strongest for every model, in-domain and OOD; for gpt-oss-120b, 40.6% → 88.8% against 67.8% for Evo-MedAgent; on the other four models, gains of 17.2 to 40.3 points over no skills. On MedAgentBench-v2 "the picture is more mixed": it leads in-domain on three of five models, is "within noise" of the strongest baseline on GPT-4.1 and GPT-5.4, where the dominant failure is exhausting the 8-action budget on two paginated-search task types and no method beats no skills (App. E.6), and "We make no superiority claim on v2 OOD."
- **Transfer** (§4.3–4.4, Tabs. 2–3): on MedAgentBench, GPT-5.4 (low) libraries raise the OOD accuracy of gpt-oss-120b and Gemini 3.1 Flash Lite above their own libraries; weaker-to-stronger transfer is consistently worse than self-training, and no baseline shows the asymmetry in the two pairs tested (App. E.5). On gpt-oss-120b, libraries transfer both ways between the MedAgentBench pair, but every library moved into FHIR-AgentBench lowers its baseline, which §5 attributes to malformed calls under its different tool interface.
- **Ablation** (§4.5, Tab. 4, gpt-oss-120b, MedAgentBench): with the gate kept, removing any one component stays above 80%; without the gate, 63.5% at four proposals and 40.1% at one, "matching the no-skills baseline (40.6%) within seed noise"; matched compute reaches 70.8% and 67.2%, within the variance of the 63.5% variant.
- **Gate given to the baselines** (§4.6, Tab. 5): at one proposal per batch every baseline gains in-domain, by +1.6 to +15.0 points, and none OOD; at four, none reaches GRASP's test or OOD score. The authors place the gain in "the gate applied to a bounded, editable library".
- **Non-clinical** (§4.7, Tab. 6, gpt-oss-120b): +28.4 on ALFWorld, +20.6 on WebShop, +5.0 on DBBench, and +0.9 on OS Interaction, "no gain beyond seed noise".
- **Cost** (§3.4; §5): about 3.7× more training-time LLM calls per batch than the simplest memory baselines, almost all from the probe; at inference, 6× to 9× fewer injected tokens than the unbounded memories.
- **Statistics and leakage** (App. E.4; App. F): three-seed rows are "effect-size evidence rather than as significance claims", without multiple-comparisons correction; no held-out ground-truth value appears in the trigger, rule or verification sections of any learned library; the only matches with hidden splits are a few low-entropy domain constants.

## Limits the authors state

- Benchmarks score "procedural reliability against ground-truth FHIR state rather than clinical correctness or patient outcomes"; "Real clinical environments might differ in ways the benchmarks do not capture" (§ Limitations).
- English FHIR data only; "generalization to non-English content and to proprietary EHR systems that do not expose FHIR is open" (§ Limitations).
- Skills are "policies tuned to a benchmark rather than medical expertise"; clinician review, prospective comparison and live monitoring would be needed, "none of which are reported here" (§ Limitations).
- The probe is the dominant training cost and "may need to be reduced" where episodes are expensive (§ Limitations).
- "we have not repeated the gated-baseline experiment on the other benchmarks or base models" (§ Limitations).
- A frozen library "is therefore not fully model-agnostic in practice"; "We do not study how to detect such mismatches automatically" (§ Limitations).
- Proprietary APIs "may change without notice" (§ Limitations).

## Open problems and building blocks

- **Open:** none stated beyond the Limitations. A named bottleneck: on MedAgentBench-v2 the proprietary models exhaust the action budget on paginated search, "which no method learned to avoid" (§5; App. E.6).
- **Released:** code for GRASP and the five baselines with adapters for all seven benchmarks, `Task` and `Method` interfaces, the learned libraries, all prompts, and per-seed accuracies for Tabs. 1–6 (§6 "Code and Data Availability").
- **To reuse it:** development tasks with expected answers (App. F), and "recurring failure modes paired with a verifiable signal the probe can use to admit or reject an edit" (§5); the probe re-runs the agent for the current library and each candidate (§ Limitations).
- **Beyond its domain:** "The mechanism generalizes beyond the clinical domain, helping in non-clinical environments where tasks recur with verifiable structure and remaining flat only where the action space is open-ended" (§1).

## On this site

- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/harness-general">harness-general</a><a class="tag sub" href="#/tags/harness-promptopt">harness-promptopt</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/promptopt-context">promptopt-context</a><a class="tag sub" href="#/tags/promptopt-feedback">promptopt-feedback</a><a class="tag sub" href="#/tags/promptopt-general">promptopt-general</a></span>
