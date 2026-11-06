# SkillSandbox: Skill Verification via Dynamic Scenario Synthesis

**SkillSandbox** · preprint 2026 (PDF p. 1 "Preprint")

Read: [PDF](https://arxiv.org/pdf/2610.10088) · [arXiv](https://arxiv.org/abs/2610.10088)  
Code: [skillsandbox](https://anonymous.4open.science/r/skillsandbox-647C/)

<p class="notice">A summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Decides whether a skill an agent distilled from one task (a "condition" for when it applies and a "principle" to follow) enters the agent's library, by synthesizing new tasks and environments in which that condition arises and comparing runs with and without the skill (abstract; §3.2).
- A Proposer writes a programmatic specification that keeps the condition and varies the source task's details, a Builder turns it into an executable ALFWorld or WebShop scenario (an LLM validation loop discards failures until five valid ones exist), and a Verifier keeps the skill only if its step-discounted success difference, over aligned steps where the skill's advice was carried out, averages above zero (§3.3, Eq. 1; App. B). One model executes, writes the skills and verifies them (§4.1).
- A skill-library gate that builds a test for each entry instead of picking existing tasks, scored by environment success, not a sound check (our reading); judged against each skill's measured help and harm on held-out tasks, the authors report that only 23.9% of ALFWorld skills are helpful there, which lowers precision, and that verification "can add only what that library contains" (§5.2; §4.2).

## In plain words

An LLM agent that learns from its own work can write short lessons, called skills, and reuse them later. The authors note that such skills "can encode incorrect procedures or non-transferable knowledge" (abstract), so each should be tested on a new task where its situation actually comes up, which existing tasks may not provide (abstract; §2). SkillSandbox builds such tasks: an LLM plans a task and environment that recreate the skill's situation with different details, a builder makes it runnable, and the agent runs it with and without the skill; the skill is kept only if, on average, it raises success, counting the steps taken (abstract; §3). On household tasks in a text simulator and on a shopping website, with three models, the authors report that the filtered library has the highest success rate of all libraries compared in every setting, up to 21.4 points above the strongest baseline that also uses execution feedback (§4.2, Tab. 2). Their stated insight: verification "should shift from selecting existing tasks to constructing the task and environment around the target skill on demand" (§1).

## Background and terms

**Terms to know:** [agent skill](#/glossary/agent-skill) · [procedural memory](#/glossary/procedural-memory) · [ReAct](#/glossary/react) · [paired comparison](#/glossary/paired-comparison) · [F1 score](#/glossary/f1-score) · [true and false positive rates](#/glossary/true-and-false-positive-rates) · [Spearman's rank correlation](#/glossary/spearmans-rank-correlation) · [cosine similarity](#/glossary/cosine-similarity)

**The paper's own terms:**
- **self-evolving agent**: an agent that improves "by learning from their own experiences", distilling task-solving experience into skills kept in a library for reuse (§1).
- **skill**: a pair of a `condition`, which "describes when the skill applies", and a `principle`, which "provides knowledge or guidance for that situation", distilled from one source task and its trajectory (§3.2), the principle in one or two sentences (App. F.2). A short two-part instance of the glossary's agent skill, not its folder format.
- **reusability**: a skill's "ability to guide executable behavior that improves task success or execution efficiency in new situations satisfying the condition" (§3.2), checked on three criteria: **executability** (the principle can be carried out through admissible actions (the moves the environment allows at that step) when the condition holds), **utility** (task success above the run without the skill) and **efficiency** (fewer actions than without it) (§3.2).
- **skill-relevant, novel**: a scenario is skill-relevant when finishing the task requires handling the situation the condition describes, and novel when the agent meets a task context ("the environment and information encountered during execution", §3.1) different from the source experience (§3.2).
- **verification scenario**: a synthesized task, its configured environment and its success criterion (§3.1).
- **synthesis specification, construction interface**: the Proposer's plan, written as operations the environment allows on its task and configuration fields, e.g. `add_distractor`, `remove`, `alter` on fields such as `list_order` or `product_option` (§3.3).
- **reusability score, Keep/Reject**: for each aligned step, Δu is the with-skill run's success reward (1 or 0) minus the without-skill run's, each shrunk by a factor γ per remaining action, so a success that needs fewer actions scores higher (App. B, Eq. 2); e is 1 when the with-skill action carries out the skill's instruction and 0 otherwise. The score averages e·Δu over steps, then over scenarios; Keep if it is above zero, Reject otherwise (§3.3, Eq. 1).
- **Recovery, Regression**: the share of held-out tasks that fail without skills but succeed with the library, and the reverse (§4.1).
- **No Skill, Vanilla Skill**: the agent without a library, and the library of every skill distilled from the source tasks, the pool SkillSandbox filters (§4.1).

**Builds on:**
- The skill-library baselines (§4.1; App. A): ExpeL (Zhao et al., 2024; [ExpeL](#/papers/zhao2023expel "ExpeL: LLM Agents Are Experiential Learners (2024)")), which replays the source task; ACE (Zhang et al., 2026; [ACE](#/papers/zhang2025ace "Agentic Context Engineering: Evolving Contexts for Self-Improving Language Models (2026)")) and SkillOS (Ouyang et al., 2026a), which update the library from later tasks; ReasoningBank (Ouyang et al., 2026b) and MemP (Fang et al., 2026b), which keep skills without verification.
- SkillRL (an agent-training method built on skill libraries) (Xia et al., 2026), whose Distillation into compact models prompt produces the Vanilla Skill pool (§4.1).
- The ReAct framework (Yao et al., 2022b; [ReAct](#/papers/yao2022react "ReAct: Synergizing Reasoning and Acting in Language Models (2023)")) for the executor, and the benchmarks ALFWorld (Shridhar et al., 2020), household tasks of six types played through text commands, and WebShop (Yao et al., 2022a), where the agent finds and buys products matching a user's instruction (§4.1).

## Problem and setting

- **Question:** can each skill be verified on scenarios built for it? §2 first asks whether tasks with similar instructions expose a skill's situation (Question I, §2.1), and how often skills get used in a stream of later tasks (Question II, §2.2).
- **Environment model:** states, actions, observations, a transition rule and a configuration (objects, arrangements, task data, presentation); the agent sees only partial observations (§3.1). The environment must expose a construction interface and its task and configuration data, e.g. WebShop's product database and ALFWorld's object list (§3.3).
- **Models:** Qwen3.5-9B, Gemini 3.1 Flash-Lite and Qwen3.5-27B as executors; the same model executes, writes the skills, synthesizes scenarios and verifies (§4.1).
- **Protocol:** every method builds its library from the same 100 source tasks and freezes it; evaluation on 140 ALFWorld and 500 WebShop official test tasks, with the top 3 skills retrieved per task by cosine similarity of `text-embedding-3-small` embeddings (§4.1; App. B). Episodes end after 30 steps on ALFWorld and 15 on WebShop (App. B, Tab. 4).
- **What "correct" means:** a scenario's success criterion gives a reward of 1 or 0 (App. B). For RQ1–RQ3, a skill's ground truth is its effect on held-out tasks in runs with and without it: helpful if it turns more tasks from failure to success than the reverse, harmful if fewer (App. B "Evaluation protocol").
- The value of γ is not stated in the paper.

## Approach

- **Proposer (§3.3).** From the condition, the source task and its trajectory, it plans "reproduction" (what the task and configuration must satisfy for the condition to arise during execution) and "reconstruction" (changes that make the context differ), and encodes the plan as a specification with variables for objects and values.
- **Builder (§3.3).** It binds the variables to concrete objects and values from the environment's data, translates the operations into a construction program and runs it, producing the task instruction, the environment and its ground truth. A validation loop, using the executor's model, checks each scenario against the specification and against earlier scenarios for the same skill, discarding failures until five valid scenarios exist.
- **Verifier (§3.3; App. B).** It runs the same executor with and without the skill on each scenario, aligns the two runs at steps with identical observations, keeps for each distinct observation the earliest aligned pair where the with-skill step is marked as using the skill, and scores e·Δu as defined above. "Only points with observed evidence of executability contribute to" the score (App. B).

## Results

- **Existing tasks fall short (§2).** Question I: among the 10 held-out tasks whose instructions are most similar to a skill, an LLM judge (GPT-5.6 Luna, App. B) finds the skill's situation in at most 6.66 on average, across the settings (§2.1, Tab. 1). Question II: streaming 500 WebShop tasks with Gemini 3.1 Flash-Lite, 17–32% of a 50-skill library is still never used after 500 tasks, depending on how many skills the agent can see (§2.2, Fig. 1).
- **Main results (§4.2, Tab. 2).** Libraries admitted without SkillSandbox's verification score below No Skill "in most settings", often with more steps. SkillSandbox's library has the highest success rate in all six model–benchmark settings, improving on the strongest execution-based curator (ExpeL, ACE, SkillOS) by up to 21.4 points, and the lowest Regression in all settings. On ALFWorld, where Gemini and Qwen3.5-27B already solve most tasks without skills, it is "the only library" that raises success over No Skill.
- **RQ1, where the evidence comes from (§5.1, Fig. 3).** With Gemini 3.1 Flash-Lite and the same Verifier and rollout budget (number of agent runs), five synthesized scenarios per skill give higher verdict F1 and a better library than five runs of the source task or five random tasks on both benchmarks, with held-out success up to 15.7 points above the alternatives. On ALFWorld the source and random verdicts "barely separate helpful from harmful skills", and their libraries fall below No Skill.
- **RQ2, do verdicts predict held-out effects (§5.2, Tab. 3).** Verification keeps 82.8% of the helpful skills on WebShop and 81.8% on ALFWorld; on WebShop, "High precision and specificity". On ALFWorld only 23.9% of skills are helpful on held-out tasks, which lowers precision, though helpful skills make up more of the verified library than of the unverified one. On WebShop the score's Spearman correlation with the held-out effect is positive for both Proposers (App. E, Tab. 6).
- **RQ3, is a stronger model needed (§5.3, Tab. 3).** Replacing only the Proposer by a stronger model, GPT-5.6 Luna, the executor's own model "matches or exceeds GPT-5.6 Luna in every metric" on both benchmarks; the stronger Proposer "rejects more helpful skills but no more harmful ones".
- **RQ4, what the scenarios show (§5.4, Fig. 4).** On WebShop, agents take more actions on average with skills, even when both runs succeed; on ALFWorld both Qwen models gain success and save actions, while for Gemini skills lower success and add actions despite high executability. App. E, Fig. 6 sorts rejected skills by primary failure cause; App. D, Tab. 5 walks through two.

## Limits the authors state

No limitations section; scattered caveats:
- "Verification selects from the original library rather than improving the skills themselves, so it can add only what that library contains" (§4.2).
- "Overall agreement is lower on ALFWorld", where the scarcity of helpful skills "lowers precision"; on WebShop, recall shows that "some are incorrectly rejected" (§5.2).
- Pearson's r (the ordinary linear correlation) "does not establish that the score is calibrated to the magnitude of the improvement" (App. E).
- The Proposer prompts are given as summaries, and "retry and format-repair messages are omitted" (App. F).

## Open problems and building blocks

- **Open:** None stated.
- **Released:** a "[CODE]" link to an anonymized repository at the end of the abstract (abstract); the executor and skill-distillation prompt templates, and summaries of the Proposer prompts (App. F).
- **To reuse it:** one model for execution, skill writing, synthesis and verification (§4.1), which the authors say lets an agent select skills "without an external model stronger than itself" (§5.3); an environment whose task and configuration fields can be edited through a construction interface, with data to draw objects from (§3.3); five valid scenarios per skill, each run with and without the skill (§3.3; §5.1).

## On this site

- **Discussed in:** [Checking a memory across problems before it is reused](#/challenges/verified_memory)
- **Tags:** <span class="tags"><a class="tag" href="#/tags/agent">agent</a><a class="tag" href="#/tags/compact">compact</a><a class="tag" href="#/tags/hacking">hacking</a><a class="tag" href="#/tags/harness">harness</a><a class="tag" href="#/tags/method">method</a><a class="tag sub" href="#/tags/llm-assist">llm-assist</a><a class="tag sub" href="#/tags/promptopt-context">promptopt-context</a></span>
