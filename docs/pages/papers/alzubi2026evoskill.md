# EvoSkill: Automated Skill Discovery for Multi-Agent Systems

**EvoSkill** · preprint 2026

Read: [PDF](https://arxiv.org/pdf/2603.02766) · [arXiv](https://arxiv.org/abs/2603.02766)  
Code: [EvoSkill](https://github.com/sentient-agi/EvoSkill)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Grows a coding agent's library of skill folders (instructions, trigger metadata, helper scripts) from the agent's failures on labeled training questions, with the model frozen (abstract; §2).
- A Proposer reads failed traces with the ground-truth answers and a history of earlier proposals, a Skill-Builder writes the new or edited skill, and the candidate joins a fixed-capacity frontier of the best programs if the frontier is not yet full or its validation score beats the weakest member (§2.1–2.2, Alg. 1); Claude Code with Opus 4.5 on OfficeQA and SealQA (§3.1–3.2).
- Near transfer of a gated skill with weights fixed: the authors report that one skill evolved on SealQA, applied unchanged to a stratified BrowseComp sample, raised accuracy by an absolute 5.3% (§3.3), and say "broader investigation across more diverse task pairs is needed" (§4.3). Its gate is a score on labeled validation questions, not a sound check ([Can a memory across problems be checked before it is reused?](#/challenges/verified_memory)).

## In plain words

Coding agents such as Claude Code (Anthropic's command-line coding agent) are general, but the authors say this flexibility "does not by itself confer the domain expertise needed for specialized tasks" (abstract). Skills (folders of instructions and helper code an agent loads) supply it, but most are hand-written, and the authors argue that evolutionary optimizers tune low-level artifacts such as prompts and code, "tightly coupled to specific models and tasks" (abstract). EvoSkill writes skills automatically: with the model frozen, one agent studies failures on labeled training questions and proposes a new skill or an edit, another writes it, and it is kept only if it scores well enough on separate validation questions (§2).

With Claude Code running Opus 4.5 (an Anthropic model), the authors report exact-match accuracy on OfficeQA (questions over U.S. Treasury reports) rising from 60.6% to 67.9% when skills from several runs are merged, and SealQA (web-search questions with misleading results) accuracy from 26.6% to 38.7% (abstract; §3.1.3; §3.2). One SealQA skill, applied unchanged to BrowseComp (a benchmark of hard web-browsing questions), raised accuracy from 43.5% to 48.8% (§3.3). They present this as optimizing at "a higher level of abstraction" than prompts or code, and the transfer as "direct evidence" of generalization (§1).

## Background and terms

**Terms to know:** [agent skill](#/glossary/agent-skill) · [agent harness](#/glossary/agent-harness) · [progressive disclosure](#/glossary/progressive-disclosure) · [evolutionary search](#/glossary/evolutionary-search) · [reflective prompt optimization](#/glossary/reflective-prompt-optimization) · [LLM-as-a-judge](#/glossary/llm-as-a-judge)

**The paper's own terms:**
- **skill**: a folder holding trigger metadata, procedural instructions and optional helper scripts (Python or TypeScript) or reference material (§2.1); this is the Agent Skills format the authors describe in §4.1, where skills load by progressive disclosure: metadata at startup, instructions on demand.
- **program**: the agent's system prompt plus its accumulated skills (§2.2). Each program is a git branch that differs from its parent only in skill folders and metadata (§2.3.2; App. D).
- **Executor, Proposer, Skill-Builder**: the three agents (§2.1). The Executor runs tasks under the current program; the Proposer reads the Executor's traces, its answers and the ground-truth answers and proposes a new skill or an edit; the Skill-Builder turns the proposal into a skill folder, guided by a "meta-skill that codifies best practices for skill authoring" (§2.1).
- **feedback history**: the Proposer's running log of all earlier proposals, their outcomes and score changes, kept to avoid repeats and to build on what partly worked (§2.1).
- **frontier**: the fixed-capacity set of the k highest-scoring programs on the validation set (§2.2, Alg. 1); App. D gives a default size of 3. The abstract and §1 call it "a Pareto frontier" (see [Pareto front](#/glossary/pareto-front)).
- **failure**: a training example whose score falls below a fixed threshold (§2.2); in the training loop, a weighted score over five numeric tolerances below 0.8 (App. C).
- **tolerance**: the "allowable relative error" for a numeric answer (Tab. 1). **Exact match** is 0% tolerance (§3.1.3): numbers must agree exactly after the scorer extracts them and normalizes units, and text answers match by case-insensitive substring after normalization (App. C).
- **skill-merge** (merge-unique in Tab. 1): one library combining the unique skills of independent runs; where skills overlap by name or description, the version from the highest-performing run is kept (§3.1.2).
- **zero-shot transfer**: applying a skill evolved on one benchmark to another "with no edits" (§3.3).

**Builds on:**
- Feedback Descent ([Feedback Descent](#/papers/lee2025feedbackdescent "Feedback Descent: Open-Ended Text Optimization via Pairwise Comparison (2025)")): an optimizer that improves text artifacts from rich textual feedback, keeping a frontier of top candidates and a feedback history (§4.2). The core idea of EvoSkill is "applying textual feedback descent" to failed examples (§2), and the authors say it "builds directly on this paradigm" (§4.2).
- AlphaEvolve ([AlphaEvolve](#/papers/novikov2025alphaevolve "AlphaEvolve: A coding agent for scientific and algorithmic discovery (2025)")), an evolutionary coding agent that evolves codebases, and GEPA ([GEPA](#/papers/agrawal2025gepa "GEPA: Reflective Prompt Evolution Can Outperform Reinforcement Learning (2026)")), an evolutionary prompt optimizer with reflective mutation (§1; §4.2): the approaches the authors set EvoSkill against, which "optimize low-level artifacts (code or prompts)" (§4.2).

## Problem and setting

The question: can an agent's skills be discovered and refined automatically from its failures, without changing the model, and do the skills carry over to other tasks (§3)?

- **Assumptions:** a coding-agent harness that supports skill folders, "and a model capable of utilizing such skills" (§2); a dataset of questions with ground-truth answers and a task-specific scoring function (§2.2; §2.3.1).
- **Data split:** an LLM classifier first sorts the examples into categories; a stratified split (by category; defaults put every category in training and validation) then gives a training set (for finding failures), a validation set (for choosing programs) and a held-out test set that is "never exposed during evolution" (§2.3.1). All reported accuracies are on the test set "unless otherwise noted" (§3.1.2, in the OfficeQA setup).
- **OfficeQA** (§3.1): 246 questions, easy and hard, over U.S. Treasury Bulletins, needing facts from an average of two bulletins and "basic quantitative reasoning" (§3.1.1). Validation is 17 examples; three training sizes are run, 5%, 10% and 15% (12, 24 and 36 examples), each for 1.5 epochs (passes over the training set) (§3.1.2). The baseline is the same agent with no skills, "independently run & cross-referenced" with the benchmark authors' result (§3.1.3 footnote). Scoring: OfficeQA's fuzzy scorer (§3.1.2; details in App. C).
- **SealQA** (§3.2): fact-seeking questions where web search returns "conflicting, noisy, or unhelpful results" (§3.2.1); the seal-0 split (a subset of SealQA's questions) of 111 questions, a 10% training split, 1.5 epochs (§3.2.2). Answers are graded with SealQA's default [LLM-as-a-judge](#/glossary/llm-as-a-judge) template (App. B.3). The SealQA validation size is not discussed.
- **BrowseComp** (§3.3): a benchmark for browsing agents with hard fact-seeking questions that have "short, uniquely correct answers"; a stratified sample of 128 examples.
- **Agent and model:** Opus 4.5, an Anthropic model, inside Claude Code: "All experiments use Claude Code with Opus 4.5 as the underlying model" (§3.1.2, under OfficeQA); §3.2.2 repeats it for SealQA.

## Approach

The loop (§2.2, Alg. 1; Fig. 1 walks through two OfficeQA iterations):
1. Pick a parent program from the frontier in round-robin order, so every member is explored before any is revisited.
2. Run it on a training batch, sampled without replacement and cycling through all examples; collect the examples scoring below the threshold. With no failures, skip the iteration.
3. The Proposer receives the failures and the feedback history, reviews the traces, finds capability gaps, audits existing skills, and writes a text proposal: a new skill or an edit to one. The ground-truth answers are given for diagnosis, "analogous to examining labeled misclassifications during error analysis", and the authors say they are not passed on into the generated skills (§2.1).
4. The Skill-Builder adds the new or revised skill to the parent, giving a candidate program.
5. Score the candidate on the validation set. It enters the frontier if the frontier is not yet full or it beats the weakest member, which it then displaces; otherwise it is discarded. Either way the proposal, its score and the verdict go into the feedback history.
6. After a set number of iterations, return the best program in the frontier.

The implementation keeps each program on a git branch with a YAML file of its system prompt, tools, lineage and scores, deletes rejected branches, and stops early after a set number of consecutive iterations without frontier improvement (App. D). App. D also names a prompt-only mode that rewrites the system prompt instead of skills.

## Results

Each result is compared with the base program, the same agent with no skills (§2.1).
- **OfficeQA** (§3.1.3, Tab. 1, Fig. 2): exact match from the 60.6% baseline to 63.4% (5% training data), 65.8% (10%) and 64.5% (15%); the authors read the dip at 15% as "suggesting diminishing returns or mild overfitting as training data grows". The skill-merge library reaches 67.9% (§3.1.3; Fig. 2 caption), "outperforming every individual run", which the authors take to mean skills from independent runs "are complementary". They report that "The improvement pattern is consistent across tolerance levels" (§3.1.3).
- **Discovered skills** (§3.1.4): a data-extraction-verification skill against misread neighbouring cells, wrong metrics and wrong time granularity, and a quantitative-analysis skill with "mandatory validation checkpoints before computation". App. A.1 prints a different OfficeQA skill, economic-timeseries-analysis, with its Python script.
- **SealQA** (§3.2.3): accuracy from 26.6% to 38.7%. Among the skills found is a search-persistence-protocol that requires expanding the readings of ambiguous terms, checking several sources and checking completeness before answering (App. A.2 prints it).
- **Transfer** (§3.3): that SealQA skill, applied with no edits to BrowseComp, raised accuracy from 43.5% to 48.8%. The authors say the skill captures "a general capability", and that "This result supports the hypothesis that" skill-level optimization "yields more transferable improvements" than prompt or code optimization.

## Limits the authors state

- "each configuration was evaluated in a single run due to the computational cost of running Opus 4.5 in the evolution loop. Variance analysis across multiple seeds is left to future work." (§3.1.3 footnote, on the OfficeQA runs).
- On transfer: skill-level optimization "may offer a more natural unit of transfer than prompt-level or code-level optimization, though broader investigation across more diverse task pairs is needed" (§4.3).
- The paper is marked "Preprint. Work in progress." (title-page footnote).

## Open problems and building blocks

- **Open** (all §5):
  - evaluate on more domains, to see which skills emerge as "domain-general (e.g., search persistence, verification protocols)" and which as "domain-specific (e.g., treasury table extraction)";
  - extend to multi-modal tasks, where skills coordinate vision, code and language;
  - shared skill libraries that other agents and users can browse, compose and reuse;
  - transfer of skills across models and agent harnesses as well as tasks.
- **Released:** the title page links a code repository (title page); the paper makes no other release statement. App. A prints two evolved skills in full (one with its Python script), and App. B.1–B.2 print the Proposer and Skill-Builder prompts.
- **To reuse it:** a harness that supports skill folders ("e.g., Claude Code, Codex, OpenCode", all coding-agent harnesses) and a model able to use them (§2); labeled examples and a scoring function (§2.3.1); a git repository holding a fixed codebase (§2.3.2). The only stated cost is the "computational cost of running Opus 4.5 in the evolution loop" (§3.1.3 footnote).

## On this site

- **Discussed in:** [Gains made against a checker, carried beyond it](#/challenges/transfer_beyond_the_checker)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/harness-general">harness-general</a><a class="tag sub" href="#/tags/harness-promptopt">harness-promptopt</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/promptopt-context">promptopt-context</a><a class="tag sub" href="#/tags/promptopt-evolve">promptopt-evolve</a><a class="tag sub" href="#/tags/promptopt-general">promptopt-general</a></span>
