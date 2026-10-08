# Voyager: An Open-Ended Embodied Agent with Large Language Models

**Voyager** · TMLR 2024

Read: [PDF](https://arxiv.org/pdf/2305.16291) · [arXiv](https://arxiv.org/abs/2305.16291)  
Code: [Voyager](https://github.com/MineDojo/Voyager)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- A GPT-4 agent in Minecraft that writes its actions as code and keeps the programs that work in an ever-growing skill library, indexed by the embedding of their description and retrieved for new tasks; an automatic curriculum proposes the next task (abstract; §2.1–2.2).
- Iterative prompting: each program is run, and environment feedback and execution errors go back into the prompt; a second GPT-4 instance acting as a critic decides whether the task succeeded, and only then is the program added to the library (§2.3).
- The executable skill library that later memory and skill papers build on ([LEGO-Prover](#/papers/wang2023legoprover "LEGO-Prover: Neural Theorem Proving with Growing Libraries (2024)") §2 cites its "dynamic growing skill library"). Its gate is an LLM's verdict, not a sound check: the authors use the critic "instead of manually coding success checkers for each new task" (§2.3) and note it occasionally fails (§4). Bears on [Can a memory across problems be checked before it is reused?](#/challenges/verified_memory).

## In plain words

The authors want an AI agent that keeps learning in an open-ended game world, Minecraft, which has no fixed end goal. They argue that earlier LLM agents "are not lifelong learners that can progressively acquire, update, accumulate, and transfer knowledge over extended time spans" (§1). Voyager uses GPT-4 through prompting only, with no fine-tuning. GPT-4 proposes its next task, writes a JavaScript program to do it, and sees the game's messages and error messages. A second GPT-4 call judges whether the task succeeded, and programs judged successful are kept as reusable skills (abstract; §1; §2.3; §3.1).

Against their own Minecraft versions of three earlier agent methods (ReAct, Reflexion, AutoGPT), the authors report that Voyager collects 3.3× as many distinct items within 160 rounds of prompting (§3.3, Fig. 1). They also report that it unlocks key levels of Minecraft's tool progression up to 15.3× faster, counted in prompting rounds (abstract; §3.3, Tab. 1). They present it as "the first LLM-powered embodied lifelong learning agent in Minecraft" (abstract), embodied meaning it acts through a game character.

## Background and terms

**Terms to know:** [agent harness](#/glossary/agent-harness) · [agent skill](#/glossary/agent-skill) · [catastrophic forgetting](#/glossary/catastrophic-forgetting) · [curriculum learning](#/glossary/curriculum-learning) · [dense retrieval](#/glossary/dense-retrieval) · [self-correction](#/glossary/self-correction) · [LLM-as-a-judge](#/glossary/llm-as-a-judge) · [reinforcement learning](#/glossary/reinforcement-learning)

**The paper's own terms:**
- **lifelong learning agent**: one that can "progressively acquire, update, accumulate, and transfer knowledge over extended time spans" (§1); Voyager's version is **in-context lifelong learning** (§1), with no model weights updated.
- **automatic curriculum**: GPT-4 prompted to propose the agent's next task (§2.1). Unlike the glossary's curriculum learning, no weights are trained. The authors liken it to "an in-context form of novelty search" (§1), i.e. seeking new things, not a fixed goal (cited, undefined).
- **skill library**: a vector database of skills, each an executable JavaScript program; the key is the embedding of the program's description, the value is the program (§2.2, Fig. 4). Unlike the glossary's agent skill (a text file), these are code.
- **control primitive APIs**: functions shown in the code-generation prompt and callable by GPT-4: some written by the authors on top of Mineflayer, a JavaScript API for Minecraft bots (e.g. `mineBlock`, `craftItem`), some Mineflayer's own (e.g. `bot.pathfinder.goto`) (App. A.4.1; §3.1).
- **environment feedback**, **execution errors**, **self-verification**: the loop's three kinds of feedback (§2.3): the game's chat messages (e.g. "I cannot make an iron chestplate because I need: 7 more iron ingots"), the interpreter's errors, and a separate GPT-4 call that says whether the task succeeded and, if not, gives a **critique** suggesting how to complete it.
- **prompting iterations**: the budget unit, rounds of code generation (x-axis of Figs. 1 and 9).
- **tech tree**: Minecraft's tool hierarchy, wooden → stone → iron → diamond (§3.3).

**Missing glossary terms:**
- **embodied agent**: an agent that acts through a body in a physical or simulated 3D world, here a Minecraft character; the paper uses it undefined (title, §1).

**Bridges to the glossary:** in the glossary's terms, the loop is an agent harness with memory across tasks, the retry loop is self-correction, and self-verification is LLM-as-a-judge.

**Builds on:**
- ReAct ([ReAct](#/papers/yao2022react "ReAct: Synergizing Reasoning and Acting in Language Models (2023)")), Reflexion ([Reflexion](#/papers/shinn2023reflexion "Reflexion: Language Agents with Verbal Reinforcement Learning (2023)")) and AutoGPT (a tool that splits a goal into subgoals run in a ReAct-style loop): the baselines, which the authors "have to re-interpret" for Minecraft, as they were designed for text tasks (§3.2).
- Code as Policies and ProgPrompt (LLMs writing executable robot policies), cited for code as actions (§1, §5).
- Ellis et al. [45] (DreamCoder, a program-learning system), which inspires skills as code (§2.2).
- Volum et al. [70], whom Voyager follows in using Mineflayer as the low-level controller (§5).

## Problem and setting

- **The question:** can an LLM agent, without updating weights, keep exploring an open-ended world, collect reusable skills, and use them on new tasks (§1)?
- **Environment:** MineDojo ("an open-source Minecraft AI framework", §1), controlled through Mineflayer (§3.1). The agent sees its state as text (including inventory, equipment, nearby blocks and entities, biome (e.g. plains, forest, ocean), time, health and hunger, position; §2.1, App. A.3.1), not pixels.
- **Models:** `gpt-4-0314`, `gpt-3.5-turbo-0301` and `text-embedding-ada-002`; temperature 0 except the curriculum's 0.1 (§3.1). GPT-3.5 answers the curriculum's self-asked questions "due to budgetary considerations" (§2.1) and writes skill descriptions (Fig. 4).
- **Baselines:** ReAct, Reflexion and AutoGPT as re-implemented by the authors, given some or all of Voyager's feedback types but not its skill library or automatic curriculum (§3.2, Tab. A.3); their task is "explore the world and get as many items as possible" (App. B.2). Agents that read pixels are not compared: "It would not be an apple-to-apple comparison" (§3.2).
- **What counts as success:** a task succeeds when GPT-4 self-verification says so (§2.3). The measures are distinct items, prompting iterations per tech-tree level, distance travelled, and new tasks solved in a new world; each method runs three times (§3.3, App. B.4.1).

## Approach

- **Automatic curriculum (§2.1, Fig. 3).** GPT-4's prompt holds directives (the goal is "to discover as many diverse things as possible"; the next task "should not be too hard"), the agent's state, completed and failed tasks, and context from GPT-3.5 asking and answering questions, optionally with a Minecraft wiki (App. A.3.2).
- **Skill library (§2.2, Fig. 4).** The code-generation prompt holds guidelines (make functions "generic and reusable"), the control primitive APIs, retrieved skills, the last round's code, feedback and critique, the agent's state, and chain-of-thought prompting (§2.2). For retrieval, GPT-3.5 writes a general suggestion for the task, combined with environment feedback as the query, and the top-5 skills are returned (Fig. 4). "Complex skills can be synthesized by composing simpler programs" (§1; examples in App. A.4.3).
- **Iterative prompting (§2.3, Figs. 5–6).** Each program's feedback and errors go into the next prompt. Self-verification takes the agent's state, task and task context, reasons, outputs true or false, and critiques failures; its prompt has few-shot examples (App. A.5.1). On success the program joins the library and the curriculum proposes a new task; "If the agent gets stuck after 4 rounds of code generation", the curriculum is asked for another task (§2.3).

## Results

The authors' claims, for Voyager on GPT-4; Tab. 1 and Tab. 2 average three runs.

- **Exploration (§3.3, Fig. 1).** The authors report Voyager "discovering 63 unique items within 160 prompting iterations", 3.3× as many as the baselines, of which AutoGPT does best.
- **Tech tree (§3.3, Tab. 1).** Counted in prompting iterations, Voyager unlocks the wooden level 15.3×, stone 8.5× and iron 6.4× faster than the baselines, and only Voyager reaches diamond tools, in 1 of 3 runs. ReAct and Reflexion unlock no level; AutoGPT and Voyager without its skill library reach iron but not diamond.
- **Map traversal (§3.3, Fig. 7).** Voyager travels 2.3× longer distances than the baselines.
- **New tasks in a new world (§3.3, Tab. 2, Fig. 8).** With the inventory cleared, Voyager solves all four unseen tasks (diamond pickaxe, golden sword, lava bucket, compass) in every run; the three baselines solve none within 50 prompting iterations. AutoGPT given Voyager's skill library solves some tasks in some runs, which the authors read as the library being "a versatile tool that can be readily employed by other methods". Voyager without its library needs more iterations and misses the diamond pickaxe in one run.
- **Ablations (§3.4, Fig. 9; variants in App. B.3).** A random curriculum cuts the discovered item count by 93%, and a hand-written one "falls short"; without the skill library Voyager "exhibits a tendency to plateau in the later stages"; removing self-verification cuts item count by 73%, "the most important among all the feedback types"; with GPT-3.5 writing the code (GPT-4 kept for curriculum and self-verification), GPT-4 obtains 5.7× more unique items. Removing environment feedback or execution errors also hurts (Fig. 9, right).
- **Retrieval.** Top-5 accuracy "suggests our retrieval process is reliable" (App. B.4.4, Tab. A.4).
- **Human feedback (§3.5, Fig. 10).** With a human as critic or curriculum, Voyager builds a Nether Portal and a house.

## Limits the authors state

- **Cost:** GPT-4 is 15× more expensive than GPT-3.5, but Voyager needs its code quality, "which GPT-3.5 and open-source LLMs cannot provide" (§4).
- **Inaccuracies:** "there are still cases where the agent gets stuck and fails to generate the correct skill", though the curriculum can retry later; "Occasionally, self-verification module may also fail, such as not recognizing spider string as a success signal of beating a spider." (§4)
- **Hallucinations:** "The automatic curriculum occasionally proposes unachievable tasks" (a copper sword, which does not exist in the game); GPT-4 "tends to use cobblestone as a fuel input", an invalid fuel, and may call functions absent from the control primitive APIs (§4).
- **No vision:** Voyager "does not currently support visual perception" because the GPT-4 API was text-only at the time; human critique is "essential for correcting certain errors in the spatial details of a 3D structure" (§3.5).
- **Scope:** the focus is "pushing the limits of GPT-4 for lifelong embodied agent learning, rather than solving the 3D perception or sensorimotor control problems" (§3.2).
- **Physical robots** would need "additional attention and the implementation of safety constraints by humans" (§7).

## Open problems and building blocks

- **Open:** the authors are "confident that improvements in the GPT API models as well as novel techniques for finetuning open-source LLMs will overcome these limitations in the future" (§4). Voyager "has the potential to be augmented by multimodal perception models" (§3.5) and can be combined with gradient-based controllers such as VPT (a Minecraft agent pre-trained on YouTube videos, §5) if they provide a code API (§3.2); it is "a starting point to develop powerful generalist agents without tuning the model parameters" (§6).
- **Released:** no release statement as such; the title page gives the project website; App. B.1: "For detailed implementations, please refer to our codebase." The full prompts are in App. A (§2).
- **To reuse it:** GPT-4, GPT-3.5 and an embedding model (§3.1); MineDojo, Mineflayer and the authors' control primitive APIs (App. A.4.1).
- **Beyond its domain:** Voyager "is designed to be generally applicable to other domains, such as robotics" (§7).

## On this site

- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/harness-general">harness-general</a><a class="tag sub" href="#/tags/harness-promptopt">harness-promptopt</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/promptopt-context">promptopt-context</a><a class="tag sub" href="#/tags/promptopt-general">promptopt-general</a></span>
