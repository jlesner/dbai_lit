# Self-Generated In-Context Examples Improve LLM Agents for Sequential Decision-Making Tasks

**Self-Generated In-Context Examples Improve…** · preprint 2025

Read: [PDF](https://arxiv.org/pdf/2505.00234) · [arXiv](https://arxiv.org/abs/2505.00234)

<p class="notice">A summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- A ReAct-style agent keeps every trajectory that succeeds on a training task in a database and retrieves its nearest stored trajectories as in-context examples at each plan, reasoning and action step, starting from a few human-written ones (§2.2, §5.1); no weights change (App. C fine-tunes only as a side test).
- Two curation methods on top: population-based training over five database copies that replaces the worst with a copy of the best as they grow (§5.2, Alg. 2), and a per-trajectory score, how often tasks succeed when it was retrieved, that keeps the best successful trajectory per training task (§5.3, Eq. 1); evaluated on ALFWorld, Wordcraft and InterCode-SQL with GPT-4o-mini (§6.1).
- Prompt-space self-improvement gated only by the environment's own success check (on InterCode-SQL, the submitted query's results against a reference's, App. H.2), with training tasks drawn from the task distribution rather than proposed (§3; ALFWorld's standard split, random splits of InterCode-SQL and Wordcraft, App. H); the authors report InterCode-SQL rising from 75% to 79% by plain accumulation (abstract).

## In plain words

Multi-step LLM agents (moving around a text-based house, querying an unseen database, combining game elements) are usually improved by human effort: tuned prompts, hand-written examples, custom action interfaces (abstract, §1). The authors ask whether an agent can instead improve itself from its own successes. Their agent, at every step, looks up similar earlier solved tasks and shows them to the LLM as examples; their method, Traj-Bootstrap, adds each attempt that succeeds on a training task to that store. With GPT-4o-mini, they report test success rising from 73% to 89% on ALFWorld, 55% to 64% on Wordcraft and 75% to 79% on InterCode-SQL, against the same agent that keeps only its human-written starting examples (abstract, Tab. 1). Two ways of choosing which stored attempts to keep bring ALFWorld to 93%, which the authors say surpasses "approaches that use more powerful LLMs and hand-crafted components" (abstract). They present the method as "an alternative path" to human knowledge engineering and as "a dimension for scaling test-time compute" (§1), not as a first.

## Background and terms

**Terms to know:** [ReAct](#/glossary/react) · [POMDP (partially observable Markov decision process)](#/glossary/pomdp-partially-observable-markov-decision-process) · [credit assignment problem](#/glossary/credit-assignment-problem) · [value function](#/glossary/value-function) · [pass@k](#/glossary/passk) · [test-time scaling](#/glossary/test-time-scaling) · [AUROC](#/glossary/auroc) · [calibration](#/glossary/calibration) · [population-based training](#/glossary/population-based-training) (here the copies are trajectory databases: "the bottom 20%" are replaced with "copies of the top 20%", §5.2, App. B.3; the authors cite Jaderberg et al. 2017)

**The paper's own terms:**
- **trajectory**: one task attempt: goal, plan, each step's observation, reasoning and action, and the binary success outcome (§3).
- **trajectory database** (written D): the store the agent retrieves examples from; its only task-specific knowledge (§2.2).
- **Fixed-DB**: the baseline agent, with a fixed database of the human-provided initial examples and no growth (§6.1.2).
- **quality metric Q**: a trajectory's score as an example: over the tasks for which it was retrieved, the share that succeeded, each task weighted by how often the trajectory was retrieved during it (§5.3, Eq. 1). It is computed only for trajectories retrieved for at least 3 different tasks; the others get the average success rate (App. B.4).
- **multi-key retrieval**: nearest-neighbour lookup by the average cosine similarity of text embeddings over several keys (goal, plan, then the observation or the reasoning), returning at step level a window of steps around the closest one (App. A, App. B.2).

**Builds on:**
- ReAct (Yao et al., [ReAct](#/papers/yao2022react "ReAct: Synergizing Reasoning and Acting in Language Models (2023)")): the agent loop, extended with an initial planning step (§2.2).
- RAP (Kagaya et al.) and TRAD (Zhou et al.): retrieving different examples at each decision point (§1, §2.2); retrieval by reasoning follows TRAD (App. A).
- ExpeL (an agent that extracts general rules from training trajectories), by Zhao et al. ([ExpeL](#/papers/zhao2023expel "ExpeL: LLM Agents Are Experiential Learners (2024)")): its 18 ALFWorld trajectories seed the database (App. H.1).
- AutoGuide (Fu et al.), which turns successful trajectories into rules, and AutoManual (Chen et al.), which uses hand-crafted observation and action spaces: the hierarchical baselines (methods that learn higher-level rules or manuals from trajectories) (§6.1.2, App. F.1).

## Problem and setting

- **The question:** which trajectory database maximizes the agent's expected success on new tasks from the same distribution (§3), split into "Scaling Trajectory Collection" and "Intelligent Trajectory Curation" (§3).
- **Given:** a database "initialized with a small number of human-generated trajectories", "a descriptor of the action space", and training tasks the agent can attempt (§3).
- **Tasks:** multi-step tasks that "can be modeled as" POMDPs with a deterministic transition function; the authors consider sparse reward: 1 for success at the end of an episode (one attempt at a task), 0 otherwise (§2.1). Databases are built on training tasks and tested on separate ones (App. F.2).
- **Benchmarks** (§6.1.1, App. H):
  - ALFWorld (a text-based household game of navigating and handling objects): about 3,500 training tasks and 134 [out-of-distribution](#/glossary/out-of-distribution-generalization) test tasks in 6 categories (App. H.1).
  - InterCode-SQL (an interactive environment where the agent issues MySQL commands to answer a question, built on the Spider text-to-SQL dataset, [Spider](#/papers/yu2018spider "Spider: A Large-Scale Human-Labeled Dataset for Complex and Cross-Domain Semantic Parsing and Text-to-SQL Task (2018)")): 800 training and 234 test tasks. The agent explores the schema by querying and may submit once; success means submitting within 10 steps a query whose results match "a ground-truth reference" (App. H.2). Stored solved trajectories get the solution query appended to their goal string (App. H.2). How results are compared (row order, duplicates, NULLs) is not discussed.
  - Wordcraft (a simplified version of the game Little Alchemy, in which elements combine into new ones): tasks needing up to 2 steps, solved within 4; 4,000 training and 500 test tasks with disjoint goal elements (App. H.3).
- **Defaults:** "Unless otherwise specified", GPT-4o-mini at temperature 0.1; 6 retrieved examples per step on ALFWorld and InterCode-SQL, 10 on Wordcraft; seed sets of 18, 10 and 4 human-provided trajectories; success rates averaged over five random seeds, by default with the database at the end of training (§6.1.3). One set of task-agnostic prompt templates serves all benchmarks (App. B.1); only ALFWorld uses the planning step (App. B.5). ALFWorld agents get 30 steps; AutoGuide and AutoManual allow 50 actions, reasoning included (App. H.1).

## Approach

- **The agent (§2.2, Alg. 1):** on ALFWorld it first writes a plan from retrieved examples; then at each step it reasons and acts, retrieving examples again after each reasoning step. Embeddings come from all-MiniLM-L6-v2 (a small sentence-embedding model) (App. A).
- **Traj-Bootstrap (§5.1):** the agent attempts training tasks in turn, and only successful trajectories enter the database. The authors liken it to reward-weighted regression (an RL method that learns from experience weighted by its reward). Failed trajectories are left out: the authors find them "more challenging to operationalize" because of the credit assignment problem ("credit attribution" in the paper), since one must first tell "the 'good' vs 'bad' parts of the trajectory" (§5.1).
- **+DB-Curation (§5.2, Alg. 2):** motivated by the spread between runs (Fig. 1), it grows five databases from the same seeds with separate agents; when the tasks attempted reach 10, 20, 40, 80 and so on, it ranks them by recent training success and replaces the worst with a copy of the best. The authors argue that database quality "emerges from collective properties—like coverage, diversity, and complementarity across examples" (§5.2).
- **+Exemplar-Curation (§5.3, Alg. 3, Eq. 1):** after training, it scores every trajectory in all databases by Q and, for each training task, keeps the one successful trajectory with the highest Q, forming a composite database. The authors liken Q to value-function learning (§5.3).

## Results

- **Accumulation (Tab. 1):** Traj-Bootstrap beats Fixed-DB on all three benchmarks. The authors report that it matches what Fixed-DB reaches with several attempts per task: a single attempt scores between Fixed-DB's pass@2 and pass@3 on all three (§6.3, Tab. 3).
- **Against a stronger model (Tab. 2):** on ALFWorld, moving Fixed-DB from GPT-4o-mini to GPT-4o gives 0.88, while Traj-Bootstrap on GPT-4o-mini after 3,500 training tasks gives 0.89 (baseline 0.73).
- **Database size (§6.2, Fig. 2):** success generally grows with training tasks, with diminishing returns: "most gains occur within the first 25% of added training tasks", because each new example is retrieved less often as the database grows.
- **Curation (Tab. 1, §6.2, Figs. 3–4):** +DB+Exemplar-Curation (both curations together) is best on ALFWorld (0.93) and InterCode-SQL (0.82); +Exemplar-Curation alone is best on Wordcraft (0.72). +DB-Curation raises the final success rate only on ALFWorld, but helps at smaller database sizes on all benchmarks (Fig. 3). Databases built from each task's highest-Q trajectory beat those built from its lowest-Q one at every size on ALFWorld and Wordcraft, and at smaller sizes on InterCode-SQL (Fig. 4).
- **Against hand-crafted systems:** on GPT-4o-mini, +DB+Exemplar-Curation exceeds AutoManual on GPT-4-turbo plus GPT-4o-mini, and at 100 training tasks the best variant beats AutoGuide's reported result (Tab. 2, §6.3). On InterCode-SQL, Fixed-DB is about level with GameSQL, the InterCode paper's hand-prompted agent, and the best variant approaches GameSQL given the relevant schema as a "handicap" (App. G, Tab. 5).
- **Fine-tuning (App. C, Tab. 4):** GPT-4o-mini fine-tuned on the curated trajectories (ReAct-Finetune) scores 0.96, 0.74 and 0.79 on ALFWorld, Wordcraft and InterCode-SQL, against 0.93, 0.69 and 0.82 for the in-context +DB+Exemplar-Curation agent.
- **Success prediction (§6.4, App. D, Figs. 5–6):** on InterCode-SQL and Wordcraft, a random-forest classifier (an ensemble of decision trees) predicts success from a task's goal and first observation; its AUROC rises with database size, and its predicted probabilities "closely match" observed success rates.
- **No human seeds (App. E, Fig. 7):** on Wordcraft, starting from an empty database still improves with size but stays below the seeded run after 4,000 training tasks.

## Limits the authors state

- Traj-Bootstrap "displays unpredictable performance variation across training trials, even when following identical collection procedures" (§5.2), and "certain added trajectories can degrade performance" within a run (§6.2).
- Returns diminish as the database grows (§6.2).
- +DB-Curation shows "occasional performance dips" at small database sizes from "inaccurate estimates (due to low sample count)" of database quality (§6.2), and gives no gain on Wordcraft (§6.2).
- "some trajectories marked as successful lead to failures when retrieved", having succeeded "in spite of some bad decisions" (§5.3).
- The AutoGuide comparison "employs different algorithms and LLMs" (§6.3).
- The human seed examples matter: "On at least this one task", Wordcraft, they "shaped the reasoning and action patterns of the agent" (App. E).
- ALFWorld is left out of success prediction because its difficulty depends on scene layout, which the goal and first observation do not reveal (App. D).
- WebShop (a simulated online-shopping benchmark for web agents) was not used, because of bugs in generating achievable goals and tasks with incorrect rewards; QA benchmarks were excluded because retriever quality and LLM self-evaluation "would confound" the study, and the authors plan to test on them in future work (App. H.4).

## Open problems and building blocks

  - Failed trajectories "do offer the opportunity to guide exploration"; "we leave this direction to future work" (§5.1).
  - Data collection "balancing exploration versus exploitation across diverse tasks", and "refined filtering techniques" (§7).
  - Hand-crafting the initial examples: "We leave exploration of hand-crafting these in-context examples to future work" (App. E).
  - Hierarchical learning, which the authors "view … as orthogonal and complimentary" to database construction (§2.2).
- **Released:** Nothing stated.
- **To reuse it:** training tasks, a few human seed trajectories, an action-space description (§3) and the environment's success indicator at the end of each training episode (§2.2, §5.1). Curation needs N times the training LLM calls (N databases) but no extra tasks; test-time cost is the same for all three methods (§5.4). The authors report roughly 2,000,000 GPT-4o-mini API calls for ALFWorld, 200,000 for InterCode-SQL and 500,000 for Wordcraft, about $3,000 in total, and one A5000 GPU for embeddings (App. I).
- **Beyond its domain:** the authors say the strategy "is potentially also suitable to single-step decision-making tasks" (§2.1).

## On this site

- **Discussed in:** [Bringing compact models to frontier accuracy](#/challenges/compact_model_accuracy) · [Self-improvement that compounds](#/challenges/compounding_self_improvement) · [Prompt-space self-play judged by an engine](#/challenges/prompt_space_self_play) · [Which entries of a learned skill help](#/challenges/skill_entry_attribution) · [Checking a memory across problems before it is reused](#/challenges/verified_memory)
- **Tags:** <span class="tags"><a class="tag" href="#/tags/compact">compact</a><a class="tag sub" href="#/tags/harness-general">harness-general</a><a class="tag sub" href="#/tags/harness-promptopt">harness-promptopt</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/promptopt-context">promptopt-context</a><a class="tag sub" href="#/tags/promptopt-evolve">promptopt-evolve</a><a class="tag sub" href="#/tags/promptopt-general">promptopt-general</a></span>
