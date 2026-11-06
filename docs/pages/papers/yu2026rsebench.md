# When Non-Adversarial Noise Hurts Learning: Benchmarking Skill Self-Evolution in Agents

**When Non-Adversarial Noise Hurts Learning** · preprint 2026 (JD Future Academy template)

Read: [PDF](https://arxiv.org/pdf/2610.19910) · [arXiv](https://arxiv.org/abs/2610.19910)

<p class="notice">A summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- A benchmark of agents that distill experience into reusable skills, under ordinary noise injected at one of four points of the learning loop: the task instruction, the evidence the agent searches, the execution record the learner reads, and the pairing of each outcome with its record; tasks, answers and native scoring stay unchanged (abstract; §3.2, §3.4). Six benchmarks in four domains: spreadsheets, document question answering, ALFWorld and ordered task streams (§3.3).
- A harness (RSEClaw) runs ACE, SkillOpt and RethinkSkill behind one interface with GPT-5.2 and DeepSeek-V4.1-Flash: three passes over 50 training tasks, a version chosen on 30 selection tasks, the frozen store tested on held-out tasks, with noisy learning tested clean and clean learning tested noisy, and logs of whether the noise reached the optimizer and which version was kept (§4; §5.1; App. D.1).
- Evidence that a skill loop guarded only by a validation score admits what noisy experience teaches it, on tasks scored by deterministic native checkers with no LLM judge (§3.3; App. C): across three methods and two backbones the authors report that noisy learning "retains only 25.5%–42.1%" of clean evolution's aggregate gain (abstract; §5.2), and case studies trace reassigned outcomes into invented rules that can pass the validation gate into the deployed store (App. G.5, G.7). The reassignment keeps genuine outcomes and moves them to other attempts, so it works as a test of whether learning depends on the feedback's content (our reading), though it misbinds only a minority of inputs in the subset measured (§5.3, Tab. 9).

## In plain words

LLM agents increasingly improve without retraining by writing what they learn from finished tasks into reusable skills, text read before later tasks. The authors note that errors in that experience can persist in learned rules and affect later tasks, while existing evaluations "largely examine clean learning or perturbations encountered after skills are frozen" (abstract). They build RSE-Bench: six existing benchmarks, each clean and with noise added to the task request, to the files or pages the agent searches, to the log the learner reads, or to which outcome is attached to which attempt, with tasks, answers and scoring unchanged (§1, §3.2). Across three skill-learning methods and two models, they report that "noisy learning retains only 25.5%–42.1% of the aggregate gain achieved by clean self-evolution, depending on the noise type", and that damaging only the log or the outcome pairing costs about as much on average as input noise (abstract). They call RSE-Bench "to our knowledge the first benchmark for evaluating skill self-evolution under ordinary, non-adversarial noise" (abstract).

## Background and terms

**Terms to know:** [agent skill](#/glossary/agent-skill) · [agent harness](#/glossary/agent-harness) · [procedural memory](#/glossary/procedural-memory) · [tool calling](#/glossary/tool-calling-function-calling) · [cosine similarity](#/glossary/cosine-similarity)

**The paper's own terms:**
- **skill self-evolution**: an agent distills experience, without weight updates, into "persistent, reusable artifacts such as skill libraries" or evolving playbooks (§1); this **skill store** is **frozen** before held-out testing (§3.1).
- **The four noise types** (§3.2): **N-Inst**, text added to the request (off-domain filler, an answer-irrelevant detail, a non-binding pointer elsewhere); **N-Evid**, irrelevant, non-decisive, near-miss or repeated material added to what the agent searches; **N-Rec**, spans of the assistant's text and tool output deleted, without a marker, from the record the learner reads; **N-Bind**, a task's genuine outcome paired with another attempt's record from the same batch. N-Inst and N-Evid are "materialized as data"; N-Rec and N-Bind act at run time at **noise seams** between execution and learning (§3.2; §4).
- **task-preserving**: an injection keeps "task goals, correct-evidence reachability, ground-truth answers, and native scoring rules unchanged" (§1).
- **C→C, N→C, C→N**: learning condition → evaluation condition, C for clean, N for a noise type (Tab. 2). **Immunity** compares N→C with C→C; **adaptation** compares N→N with C→N, for N-Inst and N-Evid only (§3.1; App. A).
- **Partitions**: evolution-train (learned from), selection (accepting updates, choosing the version to freeze), final-test (never learned from) (§3.4); the **initial agent** has no skill store (App. D.1).
- **Relative change**: 100(s−b)/b against the C→C score b, taken on the equal-weight average of the six benchmarks (Tab. 2; App. C).
- **Process diagnostics** (§5.3; Tab. 9): **IER** (input exposure rate), the share of optimizer inputs that actually contain the noise; **v\***, the version chosen on the selection set (v0: the initial store); **CCS** (candidate-to-clean similarity), mean term-frequency (word-count) cosine similarity between a noisy run's and a clean run's candidate skills, against a reference over pairs of clean runs.
- **noise-carrying** and **piggyback** rules: rules a keyword detector flags as carrying the noise, and rules fusing a noise-induced clause with a useful one (App. G.4).

**Builds on:**
- The methods evaluated (§5.1; App. D.3): ACE (Zhang et al. [26], [ACE](#/papers/zhang2025ace "Agentic Context Engineering: Evolving Contexts for Self-Improving Language Models (2026)")), a playbook (a growing list of strategy bullets) grown by Reflector and Curator LLM calls; SkillOpt (Yang et al. [24], [SkillOpt](#/papers/yang2026skillopt "SkillOpt: Executive Strategy for Self-Evolving Agent Skills (2026)")), which edits a skill from failed and successful trajectories, keeping a patch only if the selection score strictly rises; RethinkSkill (Liu et al. [7]), which rewrites the whole skill from per-task evaluation results behind a four-way gate, and whose own probes perturb skills only after evolution (§2).
- Noise benchmarks for agents that don't learn from noisy episodes: AgentNoiseBench [18] (user and tool noise), GSM-IC [12] (irrelevant context), StressWeb [1] (web agents) (§1; §2; Tab. 1).
- Attacks on agent memory and self-evolution, e.g. SkillMisevo-Bench [10], MemEvoBench [22], AgentPoison [2], scored by attack success (§2; Tab. 1).

## Problem and setting

- **Question:** whether ordinary noise entering the learning loop makes the agent "learn the wrong thing and carry it forward" (§1).
- **Benchmarks** (§3.3; App. B): SpreadsheetBench (editing real workbooks, checked cell by cell); SP-DocVQA and MP-DocVQA (questions over single- and multi-page document images); ALFWorld (household tasks in a text simulator); SkillFlow (task families sharing a workflow); ContinualSkillBench (ordered subtask streams in four domains). 50 training, 30 selection and 80 test tasks each (50 for SkillFlow) (Tab. 12); "no LLM judge participates in any number reported in this paper" (App. C).
- **Models:** GPT-5.2 and DeepSeek-V4.1-Flash, each as both actor (does the tasks) and optimizer (writes the skills); analyses use DeepSeek-V4.1-Flash "unless otherwise noted"; GPT-5.5 in one ablation; Kimi-K2.8 builds and reviews the N-Inst and N-Evid variants offline (§5.1; App. D.2).
- **Protocol** (App. D.1): three passes over the training tasks; the method's gate keeps or drops each proposed store; the promoted (gate-accepted) checkpoint with the best selection score is frozen and tested once; three runs per cell. N-Inst and N-Evid replace training and selection tasks with noisy versions; N-Rec and N-Bind touch training episodes only and have no noisy-evaluation counterpart (§3.4; Tab. 11). 40 tool steps and 600 s per episode (App. D.2).
- **Noise validity** (App. F): automated checks (e.g. replaying each edit over the untouched original), two model reviews, and a sampled human audit of N-Inst and N-Evid by three annotators "from the author team" (App. F.3).

## Approach

- **RSEClaw**, the harness: a method sits behind a fixed interface (retrieve skills, consume an episode, decide whether to update, expose the store); the harness owns execution, scoring and noise, and a method "cannot re-score an episode, cannot reach the final-test partition, and cannot observe which condition it is running under" (§4).
- **Ported methods:** "reimplemented against their published source, keeping each method's update schedule, evidence, prompts and acceptance rule"; ACE accepts every proposed playbook, so its only selection is the frozen version (App. D.3; Tab. 6).
- **Building the noise** (App. E; Tab. 7): a generator adds a record about another year or entity, or a page, to DocVQA documents, seeing the gold answer, and a sheet, column, key or section to workspace files, without it; ALFWorld gets genuine observation lines repeated as a labelled log.
- **Run-time noise** (App. D.4): N-Rec deletes spans, about 25% of the characters (§3.2); N-Bind binds outcomes by arrival order within small windows with random delays, so some outcomes don't move.
- **Exposure checks:** logged optimizer requests; offline paired replays of clean and noisy requests (App. D.5).

## Results

- **Clean learning helps:** it raises the six-benchmark average over the initial agent for every method–backbone pair by 2.6–6.5 points (§5.2; Tab. 2).
- **Noisy learning erodes the gain:** 23 of the 24 noisy-learning cells of the average fall below their C→C baseline; mean relative losses are 4.9% (N-Evid), 4.5% (N-Rec), 4.4% (N-Bind) and 3.9% (N-Inst), N-Rec and N-Bind costing more than N-Inst "despite perturbing only the experience passed to the learner"; evidence noise is the most damaging in both learning and evaluation (§5.2).
- **Backbone matters:** SkillOpt scores highest clean on both backbones and loses least on DeepSeek-V4.1-Flash; on GPT-5.2, ACE loses least (§5.2).
- **By benchmark:** mean losses are largest on SkillFlow and SpreadsheetBench, smallest on SP-DocVQA; the largest rises under noise are on ContinualSkillBench; ACE's clean evolution with GPT-5.2 ends below the initial agent on SpreadsheetBench (§5.2; Tab. 10).
- **Diagnostics** (ACE and RethinkSkill, SpreadsheetBench, DeepSeek-V4.1-Flash; §5.3, Tab. 9): N-Bind actually misbinds 21% of inputs for ACE and 15% for RethinkSkill, and has the smallest mean loss in this subset; the selected version differs by condition; all eight noisy CCS values fall below the clean reference, once with a barely changed mean test score.
- **Crossed conditions** (ACE, SpreadsheetBench, DeepSeek-V4.1-Flash; §5.4, Tab. 3): clean evolution lifts the clean score from 79.58 to 90.00, but under N-Inst testing the evolved agent scores 77.50 against the initial agent's 83.75 (likewise under N-Evid), "reversing its advantage under clean evaluation". Learning under the matching noise does worse than clean learning under it.
- **Rounds and backbone, ACE on SpreadsheetBench:** the clean–noisy gap widens over rounds (§5.4, Tab. 15); GPT-5.5 shrinks the losses, but all four noisy-learning conditions stay below its clean-learning score (§5.4; Tab. 16).
- **Case studies** (App. G), among eight mechanisms: defensive rules learned under noise recalled on clean tasks (G.3); a misbound failure explained by an invented cause written into rules, which the gate may then deploy (G.5); reflections under N-Rec blaming garbled logs (G.6); runs rolled back to the initial store, whose scores look healthy although no learning survived (G.7).

## Limits the authors state

- Noise that never reaches a method: "Such cases are explicitly recorded by the process diagnostics and are not treated as evidence of robustness" (§4).
- "an average over a block does not describe every cell within it" (§5.2).
- CCS shows textual variation "without directly establishing the functional quality of the selected skills" (§5.3).
- "For the method we test in this setting, exposure to the deployment noise during learning does not improve performance under that noise"; GPT-5.5 "reduces its absolute magnitude in this setting but does not eliminate it" (§5.4).
- "Validation assesses each candidate update as a whole, providing limited evidence about the contribution of individual clauses", so "final-test scores alone cannot establish" whether unsupported clauses persist (§5.4 "Case Studies").
- Case counts come from one run; "Single-task differences remain inside run-to-run variation", and the cases expose mechanisms "rather than to establish significance on their own" (App. G).
- Rule-level evidence is "association; a leave-one-rule-out re-evaluation would be required to make it causal", and the defensive-rule class doesn't reproduce on ACE's SkillFlow runs (App. G.3).
- "Noise-carrying and piggyback labels come from the keyword detectors in the diagnostics and carry false positives" (App. G.4; also G.8); budget exhaustion "remains a minority phenomenon" (App. G.2).
- Training rounds: "Results are from one run per learning condition." (Tab. 15).
- RethinkSkill's published protocol doesn't cover SkillFlow and ContinualSkillBench, so its acceptance thresholds are set to zero there (App. D.3).

## Open problems and building blocks

- **Open:** none stated as future work; two needs named: removing contamination from a rule "would require a granularity down to the clause, with provenance retained per clause" (App. G.4); and rollbacks make "reporting the frozen version alongside any per-position robustness table a requirement rather than a suggestion" (App. G.7).
- **Released:** "We release the framework, benchmark data, and noise generators" (§1); "the five matched task releases per source benchmark, the noise-generation and review pipeline for N-Inst and N-Evid, and the runtime injection modules for N-Rec and N-Bind" (Reproducibility Statement); the verbatim review prompts "are released with the code" (App. F.2). The title page links code and data.
- **To reuse it:** each benchmark's native environment and evaluator (LibreOffice recalculation for SpreadsheetBench, the TextWorld game engine for ALFWorld, pytest) (App. C); one backbone as actor and optimizer, plus a model to build the noisy variants (App. D.2, Tab. 5); N-Rec and N-Bind "make no model calls" (Reproducibility Statement).

## On this site

- **Discussed in:** [Which entries of a learned skill help](#/challenges/skill_entry_attribution)
- **Tags:** <span class="tags"><a class="tag" href="#/tags/agent">agent</a><a class="tag" href="#/tags/benchmark">benchmark</a><a class="tag" href="#/tags/code">code</a><a class="tag" href="#/tags/compact">compact</a><a class="tag" href="#/tags/hacking">hacking</a><a class="tag" href="#/tags/harness">harness</a><a class="tag" href="#/tags/llm">llm</a><a class="tag" href="#/tags/placebo">placebo</a><a class="tag sub" href="#/tags/promptopt-context">promptopt-context</a><a class="tag sub" href="#/tags/promptopt-feedback">promptopt-feedback</a></span>
