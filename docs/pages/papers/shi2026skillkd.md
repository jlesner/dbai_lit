# SKILL-KD: Contrastive Skill Distillation for LLM Agents

**SKILL-KD** · preprint 2026

Read: [PDF](https://arxiv.org/pdf/2607.28048) · [arXiv](https://arxiv.org/abs/2607.28048)

<p class="notice">A summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Improves a frozen weaker student agent through a textual skill library written from a stronger teacher's runs: when the student fails a training task, the teacher runs the same task and a consolidation agent turns the gap between the two trajectories into a rule for the student's prompt (abstract; §3.1).
- A rule is kept only if the student, rerun with it, then fully solves the task, with up to three versions of the rule by default; before committing, the consolidation agent (the teacher model, with tools) reads a trace-linked edit history to add, merge or skip it (§3.2–3.3; §4; App. A). Five agent benchmarks (SearchQA, SpreadsheetBench, DocVQA, LiveMath, ALFWorld) and two student–teacher pairs, against EvoSkill, Trace2Skill, SkillGen and SkillOpt (§4).
- Teacher-written skills for a compact model, admitted by the compact model's own rerun: the authors report that dropping that rerun check lowers the 4B student's macro-average from 66.8 to 59.0 (§5.2, Tab. 3). The check is a task evaluator's full score on the training instance (§3.1–3.2), not a sound check, and each reported score comes from a single evaluation run (App. A).

## In plain words

LLM agents can be improved without retraining by giving them skills: short written rules in their prompt. The authors argue that a weak agent's failed run may not reveal the missing knowledge, while a stronger model's run "may be too implicit to internalize" (abstract). SKILL-KD runs a weak student and a strong teacher on the same training task. When the student fails, the teacher model compares the two runs, writes a rule and reruns the student with it, trying by default up to three versions of the rule; a rule is kept only if the student then fully solves the task (§3.2; App. A). Before keeping it, the writer checks earlier edits and the runs behind them to add, merge or skip it (abstract; §3.3). On five agent benchmarks, with a 4-billion-parameter Qwen student and stronger Qwen teacher, the average score rises from 43.5 without skills to 66.8 (Tab. 1). The best-scoring baseline, SkillOpt, reaches 63.5 (Tab. 1). The authors present a formulation of "skill-level knowledge Distillation into compact models for frozen LLM agents" and a method for it (§1), not a first.

## Background and terms

**Terms to know:** [agent skill](#/glossary/agent-skill) · [Distillation into compact models](#/glossary/distillation) · [procedural memory](#/glossary/procedural-memory) · [exact match](#/glossary/exact-match) · [tool calling](#/glossary/tool-calling-function-calling)

**The paper's own terms:**
- **student, teacher**: the student is the weaker agent being improved, whose weights stay fixed ("frozen"); the teacher is a stronger model run on the same task (§3; §4 "Setting").
- **trajectory**: the record of one agent's attempt at a task, scored by a task evaluator between 0 and 1, where 1 means solved (§3.1).
- **knowledge Distillation into compact models**: in the paper's framing, classical Distillation into compact models puts the teacher's knowledge into the student's weights, which they call "infeasible for closed-source students" (§1); SKILL-KD keeps the student frozen and uses textual skills as the carrier (§1). In the glossary's terms, "skill Distillation into compact models" here is not training at all.
- **skill, skill patch**: a rule with four fields, a title, an instruction ("content"), a rationale ("why") and links to the trajectories it came from ("trace"); only title and content are shown to student and teacher (§3.1). The writer's prompt asks for "When <trigger>, do <action>" rules with type-level triggers (not tied to filenames, cell addresses, room names or specific objects) (App. B). A patch is a proposed change to the library (§3.2).
- **skill library**: one structured Markdown document per benchmark, shared by student and teacher; the whole file goes into the prompt, with no retrieval (§3.1; App. A).
- **consolidation agent**: the LLM that writes, revises and files patches; it is the teacher model of each setting (§4 "Setting"), run as a multi-turn agent with two tools (§3.3).
- **adaptive rounds**: student reruns, each with a new version of the patch, at most n per task, 3 by default (§3.2; App. A).
- **edit history, trace link**: a log of past library changes, each with its rationale and links to its source trajectories, fetched on demand by a "trace-link" tool (§3.3).
- **skill drift**: patches that fix the current failure but "overfit to narrow cases, add redundant rules, or overwrite knowledge encoded by earlier skills" (§1); §5.4 names three kinds (case-specific, skill-bloat, destructive-update).

**Builds on:**
- The four skill-learning baselines (§4 "Baselines"): SkillOpt (Yang et al., 2026c; [SkillOpt](#/papers/yang2026skillopt "SkillOpt: Executive Strategy for Self-Evolving Agent Skills (2026)")) and EvoSkill (Alzubi et al., 2026; [EvoSkill](#/papers/alzubi2026evoskill "EvoSkill: Automated Skill Discovery for Multi-Agent Systems (2026)")); Trace2Skill (Ni et al., 2026) and SkillGen (Ma et al., 2026), not listed here.
- AgentDistill (Qiu et al., 2025), which distills reusable modules from successful teacher trajectories without training (§2.2); not listed here.
- Classical knowledge Distillation into compact models, cited through a survey (Gou et al., 2021) (§1).

## Problem and setting

- **Question:** can a stronger teacher improve a frozen weaker agent through prompt skills built from their contrasting trajectories on the same task, keeping the skill set compact (§1; §3)?
- **Two settings** (§4 "Setting"): Group 1, student Qwen3.5-4B with teacher Qwen3.7-plus (same family); Group 2, student Qwen3.6-35B-A3B (a larger Qwen model, served locally, App. A) with teacher ChatGPT-5.5 (different family). The consolidation agent uses each group's teacher model. Teacher and student calls use medium reasoning effort by default (App. A).
- **Benchmarks** (§4; §4.1): SearchQA (search-based question answering), SpreadsheetBench (spreadsheet manipulation by writing code), DocVQA (questions about document images), LiveMath (mathematical reasoning), and ALFWorld (household tasks in a simulated environment, "embodied environment interaction"). SpreadsheetBench allows at most 12 turns and ALFWorld at most 50 steps; the other three are single-round, question answering or multiple choice (App. A).
- **What counts as correct:** each benchmark's "native hard-success or exact-match metric" (a task counts only when fully solved) on the test split (§4); during training, a rule is accepted only at an evaluator score of 1 (§3.2).
- **Data:** native splits where a benchmark has them, otherwise a deterministic 2:1:7 train/validation/test split, the same default protocol as SkillOpt (§4; split sizes in App. A, Tab. 6). SKILL-KD builds skills from the training split only; the validation split serves baselines that need it (§4; App. A).
- **Runs:** "Each reported score was computed from a single complete evaluation run on the fixed test split" (App. A).

## Approach

- **Contrast** (§3.1): for each training task the student tries first with the current library. If it fails, the teacher runs the same task. The teacher may fail too; the authors argue the two runs can still show "where their intermediate decisions diverge" (§3.1).
- **Adaptive skill Distillation into compact models** (§3.2): the consolidation agent writes a first patch from both trajectories, their scores, the library and the edit history. The student is rerun with the patched library. If it still fails, the agent sees the new run and writes a revised patch, which replaces the earlier one (each revision starts from the original library). This repeats until the student succeeds or n rounds pass. "Only patches validated by successful student behavior are committed to the skill library"; a task with no success yields no update, and failed patches are kept only in that task's own record, not in the library or the history (§3.2).
- **Drift-aware consolidation** (§3.3): the agent is a multi-turn tool-using agent. The edit history stores each past operation (add, modify, delete or skip) with its patch. A trace-link tool fetches the full trajectories behind a history entry, which are not loaded by default since they "can be arbitrarily long"; a patch tool commits the operation. The agent follows trace links over several turns to find cross-task patterns and conflicts, and to decide whether to merge a patch into an existing rule or add it (§3.3).
- **The prompt and tools** (App. B): the writer is prompted as a "skill curator", told e.g. to "Prefer update over add when a rule is partial"; the patch tool accepts at most 3 operations per call.

## Results

- **Main comparison** (§4.1, Tab. 1): SKILL-KD scores highest on every benchmark in both settings. Macro-averages (plain means over the five benchmarks): Group 1, 43.5 with no skills, 63.5 for SkillOpt, 66.8 for SKILL-KD; Group 2, 57.9, 68.6 and 74.6. The authors read gains in both settings as "confirming that contrastive skill Distillation into compact models does not depend on architectural similarity" (§4.1).
- **Unseen environments** (§4.1): on ALFWorld's test split of unseen environments, the Group 1 student rises from 30.6 to 86.6 and the Group 2 student from 59.7 to 96.3, "suggesting that the skill library captures reusable interaction strategies rather than memorizing training environments".
- **Where the signal comes from** (§5.1, Tab. 2; Group 1): skills from the teacher's trajectory alone average 58.3; skills from the student's own failed trajectory, 60.1, with 96 rules and 6,821 words; a single contrastive update without reruns (Pairwise) and a one-pass update from four trajectories (Batch) fall between. SKILL-KD reaches 66.8 with 38 rules and 3,010 words.
- **Ablation** (§5.2, Tab. 3; Group 1): against 66.8 for the full method, using the student's own failure instead of the teacher's run gives 62.1, a single contrastive update without reruns 59.0, and removing access to the edit history 58.7, which hurts SpreadsheetBench and LiveMath most.
- **Library size** (§5.3, Tab. 4; Group 1): without edit-history access the library grows to 85 rules, 50 of them on SpreadsheetBench; with it, 38 rules, 6 on SpreadsheetBench.
- **Rounds** (§5.5, Fig. 3; values in App. A, Tab. 7): measured as the cumulative training success rate during skill construction, "The first adaptive round is the dominant source of improvement"; later rounds add less, with the gains "concentrated in tasks such as SpreadsheetBench, LiveMath, and ALFWorld".
- **When the teacher fails** (§5.6, Tab. 5; Group 1, training tasks the student first failed): the teacher fails on many of these too, "so skill construction does not assume oracle teacher supervision" (a teacher that is always right). On average a patch is accepted in 45.3% of cases where the teacher succeeded and 30.2% where it failed, and teacher-failed cases still supply accepted patches (§5.6).

## Limits the authors state

- Evaluated only "on benchmarks with explicit success metrics"; "open-ended agent tasks may require human, preference-based, or domain-specific feedback to validate candidate skills" (§ "Limitations").
- It "depends on informative teacher-student behavioral contrasts": the teacher need not be perfect, "but the trajectories should reveal reusable corrections rather than identical failure modes" (§ "Limitations").
- Since the knowledge is carried as text, the approach "is most effective for procedural guidance that the frozen student can follow through prompting", and "may need to be combined with retrieval, tool learning, or model adaptation" for capabilities beyond following instructions (§ "Limitations").
- "Skills generated by SKILL-KD may inherit limitations of the underlying models"; the authors recommend "reviewing generated skills and maintaining human oversight in sensitive applications", and checking and anonymizing trajectory logs and skills before sharing when sensitive data are involved (§ "Ethical Considerations").
- Scope: the whole skill file is put in the prompt because the paper "focuses on skill acquisition, adaptive validation, and consolidation rather than learned skill retrieval or routing" (App. A).

## Open problems and building blocks

- **Open:** None stated.
- **Released:** Nothing stated. The paper prints the consolidation prompt, the edit-log schema and both tool schemas (App. B), and all final Group 1 rules, long ones truncated after 28 words (App. C).
- **To reuse it:** a teacher model, which also serves as the consolidation agent (§4; the authors used Qwen3.7-plus and ChatGPT-5.5 through their APIs, App. A); a task evaluator that scores each trajectory and marks success (§3.1); training tasks; up to 3 student reruns per failed task by default (App. A). Students ran on four NVIDIA A100 80GB GPUs (App. A).

## On this site

- **Tags:** <span class="tags"><a class="tag" href="#/tags/agent">agent</a><a class="tag" href="#/tags/code">code</a><a class="tag" href="#/tags/harness">harness</a><a class="tag" href="#/tags/llm">llm</a><a class="tag" href="#/tags/math">math</a><a class="tag" href="#/tags/method">method</a><a class="tag" href="#/tags/nl">nl</a><a class="tag sub" href="#/tags/promptopt-context">promptopt-context</a><a class="tag sub" href="#/tags/promptopt-feedback">promptopt-feedback</a></span>
