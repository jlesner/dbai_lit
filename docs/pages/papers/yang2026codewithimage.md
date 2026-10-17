# Self-Evolving Code-with-Image Reasoning

**Self-Evolving Code-with-Image Reasoning** · preprint 2026

Read: [PDF](https://arxiv.org/pdf/2608.11292) · [arXiv](https://arxiv.org/abs/2608.11292)

<p class="notice">A summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Visual questions whose exact answers need a multi-step computation over the pixels, solved by a frozen multimodal model given only a Python interpreter ("Code-with-Image"), on the authors' CwI-Bench of generated task families with labels correct by construction and disjoint train, validation and test splits (abstract; §3.3).
- A training-free loop evolves a small per-task library of plain-text skills (When / Procedure / Verify): observational reflection reads failed trajectories, and once the probe score stalls, executable reflection re-runs the failures in a sandbox and tests repairs against the gold answers; a library is delivered only if it beats the bare solver by a set margin on a held-out validation split (§4.1–4.3).
- Who writes the skill, measured on open models: the authors report that skills written by Qwen3.5-27B lift Qwen3.5-9B above the skills the 9B evolves for itself (34.5% against 30.6%), while skills written by GPT-5.6-luna help each recipient least, which they explain as co-adaptation (§5.4, Tab. 3). The same benchmark compares language-only reasoning with the interpreter (Tab. 2).

## In plain words

Some questions about an image have an exact answer that looking cannot give, such as by how many pixels a photo was shifted. The authors argue a strong model "can usually name the right procedure; it cannot run it, because a chain of thought moves words while the procedure moves data" (§1). They give a multimodal model only a Python interpreter, so its program computes the answer, and build a benchmark of generated tasks with labels correct by construction (§3). A training-free loop turns failed programs into short text skills, re-running failures to find silent bugs once reading them stops helping, and delivers them only if they beat the bare solver by a margin on held-out items (§4). On that benchmark they report GPT-5.6-luna (a closed frontier model) stays below 30% reasoning in language, reaches 43% with a bare interpreter and 67% with its self-evolved skills, and that skills written by an open 27B model lift a 9B model of its family more than the 9B's own (abstract; §5.4). They claim that "No existing suite makes the authored program the required, measured object" (§2).

## Background and terms

**Terms to know:** [agent skill](#/glossary/agent-skill) · [agent harness](#/glossary/agent-harness) · [program-of-thought and tool-integrated reasoning](#/glossary/program-of-thought-and-tool-integrated-reasoning) · [reflective prompt optimization](#/glossary/reflective-prompt-optimization) · [black-box optimization](#/glossary/black-box-optimization) · [tool calling (function calling)](#/glossary/tool-calling-function-calling) · [mixture of experts (MoE)](#/glossary/mixture-of-experts-moe)

**The paper's own terms:**
- **thinking with images**: the existing line of work in which a model calls tools with fixed meanings (e.g. crop, zoom, rotate, search) that hand evidence back, and reasons over it in language to the answer (§1; §3.1).
- **Code-with-Image (CwI)**: the environment "supplies execution only": the model writes programs that a sandboxed Python interpreter runs on the image, intermediates stay in the interpreter as data, and "the final program output is the answer" (§3.1, Eq. 1). A task family is in the **CwI regime** when, at the scored precision, only such episodes succeed (§3.1).
- **bare CwI**: the solver with the interpreter and no skill library (§4.1).
- **beyond inspection**: "at the scored precision no amount of looking, zooming, or searching determines the answer" (§1); generators discard any instance an eyeball guess would get within tolerance (§3.3).
- **constructive ground truth**: the generator samples the answer first and renders the image from it, so "the label is correct by construction" (§3.3).
- **skill, library**: a skill is "a short model-written text" with three fields: *When* (when it applies), *Procedure* (numbered steps) and *Verify* (which intermediate to render as an image, and what correct versus silently broken looks like). A library holds at most 6 skills of at most 250 words; each task evolves its own (§4.1).
- **probe, incumbent, attendance record**: the probe is a fixed, difficulty-balanced part of the training split that scores every round; the incumbent is the best library so far by probe score; the attendance record logs each recent round's probe score with the skills then present (§4.2–4.3).
- **delivery gate, delivered skill**: a library is delivered only if its validation accuracy is at least the bare solver's plus a margin (3 percentage points, §5.1); otherwise the task keeps bare CwI (§4.3, Eq. 6).
- **zeroth-order (ZO) skill optimization**: the authors' framing of a reflection round as the text analogue of one optimization step from function evaluations alone, with the edit set in the role of the estimated direction (§4.2, Eq. 4). In the glossary's terms, ZO optimization is a form of black-box optimization.
- **Instruct, Thinking**: tool-free chain of thought with the model's thinking mode off or on (§5.1).
- **uplift**: accuracy gain over bare CwI on the validation split, in percentage points (pp), with runs that deliver nothing counted as 0 (Tab. 4 caption).

**Builds on:**
- PoT (Program of Thoughts) and PAL (Program-aided Language models) ([PoT (Program of Thoughts prompting)](#/papers/chen2022pot "Program of Thoughts Prompting: Disentangling Computation from Reasoning for Numerical Reasoning Tasks (2023)"), [PAL (Program-aided Language Models)](#/papers/gao2022pal "PAL: Program-aided Language Models (2022)")): CwI "is the program-carried reasoning of PoT and PAL" applied "where language cannot even state the operands" (§3.1).
- Self-Debug ([Self-Debugging](#/papers/chen2023selfdebug "Teaching Large Language Models to Self-Debug (2023)")), which repairs one program within an episode; executable reflection "lifts executable debugging to the skill level" (§2).
- Skill and experience evolution: Reflexion ([Reflexion](#/papers/shinn2023reflexion "Reflexion: Language Agents with Verbal Reinforcement Learning (2023)")), ExpeL ([ExpeL](#/papers/zhao2023expel "ExpeL: LLM Agents Are Experiential Learners (2024)")), Voyager ([Voyager](#/papers/wang2023voyager "Voyager: An Open-Ended Embodied Agent with Large Language Models (2024)")), GEPA ([GEPA](#/papers/agrawal2025gepa "GEPA: Reflective Prompt Evolution Can Outperform Reinforcement Learning (2026)")), EvoSkill ([EvoSkill](#/papers/alzubi2026evoskill "EvoSkill: Automated Skill Discovery for Multi-Agent Systems (2026)")) and SkillOpt ([SkillOpt](#/papers/yang2026skillopt "SkillOpt: Executive Strategy for Self-Evolving Agent Skills (2026)")), which the authors say "primarily target text-dominant QA, search, coding, document, or embodied-agent tasks" (§2).

## Problem and setting

- **The question:** "can the model find the causes of its own failures, repair them, and carry the repair to similar problems without weight updates or human-written procedures?" (§1).
- **CwI-Bench** (§3.3; App. C): 30 task families in four groups. *Transformation and rearrangement* asks for the exact parameters of a hidden geometric transform (e.g. shifts, rotations, tile permutations); *Perception and counting* hides weak structure "whose extraction requires signal processing"; *Localization* asks for coordinates at a precision only whole-image statistics reach; *Color* asks for exact values and mixing relations. Four difficulty tiers; photos from COCO (a public dataset of everyday photographs), with an audit enforcing "zero source-image intersection" between training and test. Per task: 60 training items, 50 validation, 100 test.
- **Scoring:** 0/1 per item, exact for discrete answers, within a task tolerance for continuous ones, "typically two pixels on a 512-pixel canvas, or a few percent of a continuous value" (§3.3; §4.1).
- **Models** (§5.1; App. A): Qwen3.5-9B, -27B and -35B-A3B, gemma-4-12B and -26B-A4B (open weights, served with vLLM, an open-source LLM serving engine), and GPT-5.6-luna through its provider's API; 35B-A3B and gemma-4-12B are evaluated as baselines only. The A3B and A4B suffixes mark mixture-of-experts models with about 3B and 4B active parameters (general reading of the names; the paper doesn't say). Inside the CwI loop luna's reasoning mode is off "so that authored code, not hidden reasoning, carries the solution" (App. A.4).

## Approach

- **Solving** (§3.1, Eq. 1; App. A.1): a bounded loop of at most 5 steps in a persistent Jupyter kernel that returns printed output "plus every rendered image", with a forced final answer on the last step and a 40,960-token budget. A delivered library is appended to the system prompt (App. A.1), for the Qwen family with "two anchor images harvested from the model's own successful runs" (App. A.2).
- **The skill loop** (§4 "Self-Reflection over Executable Reasoning"; §4.2, Alg. 1): round 0 solves the training split with an empty library. Each round reads a stratified batch (failures from every still-failing difficulty tier, plus successes on the same task) and the attendance record.
  - *Observational reflection*, the default: one read-only call over the batch (prompts, code, outputs, every rendered image) that emits at most three add, replace or delete edits (§4.2; App. D).
  - *Executable reflection*, used once the probe score has not improved for 5 consecutive rounds (§4.2; §5.1): a sandbox is preloaded with each failed case's images, gold answer, wrong answer and the code the solver ran. The model writes investigation code step by step (re-run old code, print values, render intermediates, test a repair) until it emits edits or hits a 10-step budget, after which one call forces the edits out (§4.2, Eq. 5; App. F, Alg. 3). "Edits are admitted only after confirmation on multiple independent failing cases" (§4.2); the prompt asks the model to show that its fix recovers the gold on "at least 2 of the failing cases" (App. D).
  - Edits never delete an entry of the incumbent (§4.2).
- **Delivery** (§4.3, Eq. 6): the test split is never scored by the loop. The incumbent, then the runner-up, must clear the gate on validation; among restarts, the best validation score is kept. Budgets: Qwen and gemma use 3 restarts (independent runs of the loop, also called seeds) of at most 12 rounds; luna a single restart of 8 rounds (App. A.2–A.4).

## Results

- **Language against interpreter** (§5.2, Tab. 2): tool-free chain of thought "stays between 7% and 13% for all six frozen models" in Instruct mode, "and thinking mode lifts it to at most 25%"; bare CwI raises Qwen3.5-27B from 8.6% to 32.6% and luna from 12.9% to 43.0%, from their Instruct scores. The authors conclude "with a bare interpreter, a mid-size open model sits at the frontier model's thinking-mode level" (§5.2).
- **Thinking-with-images agents** DeepEyes, DeepEyesV2 and Thyme, run under their own protocols (Tab. 2; App. B), score about 2% overall, their points concentrated "on the few tasks where inspection suffices".
- **Self-evolved skills** (§5.3, Fig. 3): they raise bare CwI for all four executors, 11.1% → 30.6% on 9B, 27.7% → 46.5% on gemma-26B, 32.6% → 55.9% on 27B and 43.0% → 66.6% on luna. The authors report the gains are largest "where the answer hinges on getting an implementation exactly right", where each winning skill came from an executable-reflection session, and that "no delivered luna skill regresses on test" (§5.3).
- **Transfer** (§5.4, Tab. 3): 27B's per-task delivered skills (tasks without one fall back to bare CwI, Tab. 3 caption) raise the 9B "from 11.1% to 34.5%: above the 9B's own self-evolved skills on every family (30.6% overall)", the gain concentrated on Transformation. Injected into gemma-4-26B-A4B, the same library lifts it from 27.7% to 45.0%, "within 1.5pp of gemma's own evolution (46.5%)". Luna-written skills lift every recipient over bare CwI "yet land below both the recipient's own evolution and the 27B-written library", which the authors explain as co-adaptation: "frontier-written procedures assume a coding robustness that smaller executors lack" (§5.4).
- **Ablation** (§5.5, Tab. 4; validation-split uplift, 3 seeds × 30 tasks): replacing executable reflection with more observational rounds "costs 6.0pp of the 19.7pp mean uplift (7.1pp at the per-task best seed used for deployment)" on 27B, and 3.0 of 12.2pp on 9B. On 27B the loss concentrates on Transformation; on Perception observational reflection alone is slightly better (§5.5).

## Limits the authors state

- "The gate is a validation-side safeguard, not a guarantee against test regression." (§4.3)
- Round and restart budgets "differ by family" (§5.1); luna's loop uses a single restart and 8 rounds, which the authors explain chiefly by its stronger reflection, adding that "the reduced budget also bounds the closed-model API cost" (App. A.4).
- The thinking-with-images baselines run under "their single supported regime", and "DeepEyes-7B's zoom-only toolset cannot express these computations" (App. B).

## Open problems and building blocks

- **Open:** None stated.
- **Released:** CwI-Bench on Hugging Face and a project website, linked from the title page (title page); Tab. 1's count is "the released evaluation set (resamplable without bound)" (Tab. 1 caption); App. E.2 refers to "the artifact release" for a full session transcript. The reflection prompts are printed verbatim (App. D), and one delivered skill (App. E.1).
- **To reuse it:** a Python sandbox that returns printed output and rendered images (App. A.1); a multimodal model reached through its native tool or function-calling interface (App. A.2–A.4); per task, labeled training items, a probe and a validation split (§5.1); no weight updates (§4.2).

## On this site

- **Discussed in:** [Bringing compact models to frontier accuracy](#/challenges/compact_model_accuracy) · [Self-improvement that compounds](#/challenges/compounding_self_improvement) · [Prompt-space self-play judged by an engine](#/challenges/prompt_space_self_play) · [Checking a memory across problems before it is reused](#/challenges/verified_memory)
- **Tags:** <span class="tags"><a class="tag" href="#/tags/compact">compact</a><a class="tag" href="#/tags/offload">offload</a><a class="tag sub" href="#/tags/harness-general">harness-general</a><a class="tag sub" href="#/tags/harness-promptopt">harness-promptopt</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/promptopt-context">promptopt-context</a><a class="tag sub" href="#/tags/promptopt-feedback">promptopt-feedback</a><a class="tag sub" href="#/tags/promptopt-general">promptopt-general</a></span>
