# Promptbreeder: Self-Referential Self-Improvement Via Prompt Evolution

**Promptbreeder** · preprint · 2023

Read: [PDF](https://arxiv.org/pdf/2309.16797) · [arXiv](https://arxiv.org/abs/2309.16797)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Evolves task prompts and the mutation prompts that change them.
- Self-referential evolutionary search.
- Population search that also evolves its own mutation prompts (§3.2.3), the precedent for Hyper-reflection; GEPA cites it among LLM prompt optimizers ([GEPA](#/papers/agrawal2025gepa "GEPA: Reflective Prompt Evolution Can Outperform Reinforcement Learning (2026)") §6); tag <a class="tag sub" href="#/tags/promptopt-evolve">promptopt-evolve</a>.

## In plain words

Hand-written prompting recipes such as "think step by step" can help LLMs reason, but the authors argue that "such hand-crafted prompt-strategies are often sub-optimal" (abstract), and that the authors of an earlier automatic method, Automatic Prompt Engineer (APE), found its quality seemed to stabilize after three rounds of selection (§1). Promptbreeder keeps a population of prompts and lets an LLM breed it: the LLM rewrites prompts, each is scored by accuracy on a random batch of training questions, and better prompts replace worse ones. The instructions that tell the LLM how to rewrite a prompt are themselves rewritten and selected, so the method also improves the way it improves prompts. The authors present it as a "general-purpose self-referential self-improvement mechanism" (abstract) improving on the best hand-written recipes, not as a first.

On one LLM (PaLM 2-L), they report that Promptbreeder's zero-shot prompts score higher than the strongest Plan-and-Solve prompt on all but one of their arithmetic and commonsense benchmarks, AddSub (§5). On grade-school math its zero-shot prompt reaches 83.9% against 80.2% for a concurrent optimizer, Optimization by PROmpting (OPRO) (§2).

## Background and terms

**Terms to know:** [evolutionary search](#/glossary/evolutionary-search), [genetic algorithm](#/glossary/genetic-algorithm) (binary tournament, fitness proportionate selection), [estimation of distribution algorithm](#/glossary/estimation-of-distribution-algorithm-eda), [self-play](#/glossary/self-play) (§6).

**The paper's own terms:**
- **task-prompt**: a string put before a question to get a better answer (§3). PB applies two in turn: the first produces a working out, the second the answer (§3 footnote).
- **mutation-prompt**: an instruction to the LLM to change a task-prompt (§3); a **hyper-mutation prompt** changes a mutation-prompt (§3).
- **thinking-style**: a text describing a general problem-solving heuristic, such as "Let's think step by step" (§1, §3.1).
- **problem description**: the initial text description of the task, PB's starting point (App. A).
- **unit of evolution** (an individual): typically two task-prompts, one mutation-prompt and, in the few-shot case, a set of 2–3 workings out that led to correct answers (App. A, §3).
- **working out** (also phenotype, context): the LLM's output on one question under a task-prompt (App. A).
- **fitness**: accuracy on a random batch of 100 training question–answer pairs (§3, App. J.2).

**Builds on:**
- APE ([APE](#/papers/zhou2022ape "Large Language Models Are Human-Level Prompt Engineers (2023)")), which generates and mutates prompt candidates; PB targets its "diminishing returns to further selection rounds" (§1, §2).
- Tab. 1's baselines: the hand-designed Plan-and-Solve (PS, PS+: plan, then solve step by step), zero-shot and few-shot chain of thought (Manual-CoT) and Program of Thoughts (PoT: the LLM writes a program), and Auto-CoT (automatically built reasoning examples) (§2, Tab. 1). PB uses two task-prompts because Plan-and-Solve does (§3.1).
- The concurrent optimizers OPRO ([OPRO](#/papers/yang2023opro "Large Language Models as Optimizers (2024)")) and EvoPrompt ([EvoPrompt](#/papers/guo2023evoprompt "EvoPrompt: Connecting LLMs with Evolutionary Algorithms Yields Powerful Prompt Optimizers (2024)")), which, per the authors, vary prompts with a single mutation prompt or with fixed mutation and crossover prompts, while PB also evolves its mutation-prompts (§2).
- LLMs as mutation operators (Lehman et al. 2022; Meyerson et al. 2023), and neural networks that modify their own weights (Schmidhuber 1993; Irie et al. 2022) (§1, §2).

## Problem and setting

- **Question:** can an LLM-driven evolutionary loop, starting from a problem description and generic seed lists, find task-prompts that beat hand-written recipes while evolving its mutation-prompts (§1, §3)?
- **Data:** fitness uses a labelled training set, accuracy a separate test set; MultiArith, AddSub, SingleEq and SVAMP were halved at random into the two (Tab. 1 caption, App. J.2).
- **Benchmarks (§4, App. I):** math word problems GSM8K (grade-school), SVAMP, MultiArith, AddSub, SingleEq and AQuA-RAT (multiple-choice algebra); commonsense questions CommonsenseQA (CSQA, multiple choice) and StrategyQA (SQA, yes/no, several steps); the 24 Instruction Induction tasks used by APE (spelling, translation, sentiment…); and ETHOS hate-speech classification.
- **Model:** PaLM 2-L for PB and the PS, PS+, APE and OPRO rows. Bracketed rows of Tab. 1 are "directly taken from the Plan-and-Solve paper which uses text-davinci-003" (an OpenAI LLM) (Tab. 1 caption). One LLM is sampled in three roles: writing prompts, working out, answering (App. J.2).
- **Run size:** population 50, "typically 20-30 generations" (§4); "Experiments generally ran for 1-2k fitness evaluations" (App. J.2).

## Approach

- **Initialization (§3.1).** For each task-prompt, a random mutation-prompt and thinking-style are put before the problem description; the LLM's continuation is the initial task-prompt. Seed lists: App. C–D.
- **Search loop (§3).** A binary tournament genetic algorithm over units. Per replication, one operator is sampled uniformly (§3.2).
  - *Direct* (§3.2.1): zero-order generation appends "A list of 100 hints:" to the problem description and takes the first hint; first-order generation feeds the unit's mutation-prompt plus the parent task-prompt to the LLM.
  - *Estimation of distribution* (§3.2.2): the LLM continues a diversity-filtered list of current task-prompts, without fitness values, because "the LLM did not understand these fitness values". A rank-and-index variant lists prompts by ascending fitness but calls the order descending, which "appears to improve the diversity of sampling"; a lineage variant lists the unit's ancestors that were "the best in the population".
  - *Hypermutation* (§3.2.3): zero-order makes a new mutation-prompt from the problem description plus a thinking-style; first-order applies "Please summarize and improve the following instruction:" to the current mutation-prompt. The new mutation-prompt is applied at once, so its effect is scored.
  - *Lamarckian* (§3.2.4): the LLM is shown a working out "that led to a correct answer" and asked what instruction produced it.
  - *Crossover and context shuffling* (§3.2.5): with 10% chance a task-prompt is swapped for one from a unit chosen by fitness proportionate selection; a few-shot context of workings out that led to correct answers is kept and updated.
- **Diversity upkeep (App. J.2)**, "in cases where the system gets trapped on a local optimum": random character strings put before the prompt, fitness sharing (penalizing similar prompts), and an evolving sampling temperature.
- **Final pick (App. J.2):** runs went on "until the training fitness appeared to plateau", then "the fittest individual from the whole of the evolutionary run" was scored on the test set.

## Results

- **Arithmetic and commonsense (Tab. 1, §5).** The authors report that on AddSub zero-shot PB scores 87.8 against PS+ on text-davinci-003's 92.2, and "On all other datasets, zero-shot PB accuracy is higher than PS+". Few-shot PB (evolved contexts) is compared with Manual-CoT and Auto-CoT.
- **GSM8K against OPRO (§2, Tab. 1).** 83.9% zero-shot, with "the unintuitively simple prompt" SOLUTION followed by a quotation mark (§2, Tab. 6), against OPRO's 80.2%.
- **Instruction Induction (App. K, Tab. 9).** Few-shot PB (Tab. 9's "Few-shot PE", for Prompt Evolution) was able to "match or surpass the APE results on 21 out of 24 tasks", against APE's published results on text-davinci-002, another OpenAI LLM; "Unlike text-davinci-002 our LLM is not instruction tuned". A third control runs PB with APE's initialization and mutation prompt.
- **ETHOS (§5, App. J.1).** Two evolved long prompts scored 89% against 80% for the hand-written "Determine whether a text contains hate speech".
- **Fitness over a run (App. B, Fig. 3).** On the Word in Context task (does a word have the same meaning in two sentences?), training fitness rises over 2000 evaluations; §5 says that "unlike iterative APE, fitness continues to increase throughout the run".
- **Operators (App. J.3–J.4).** Tab. 7 lists the best GSM8K mutation-prompts. Tab. 8 gives each operator type's rate of producing a fitter child on GSM8K, highest for zero-order hyper-mutation (42%) and lowest for Lamarckian mutation; the authors say this "demonstrates that all mutation operators are important for Promptbreeder to work" (§5).
- **Ablations (App. L, Fig. 4).** Four self-referential components removed one at a time in small runs (population 10, 200 evaluations), compared on fitness with the full method. §5: "Removing any self-referential operator is harmful under nearly all circumstances", "the greatest benefit being the initial re-description of task-prompts upon initialization", and "We only found one mutation operator to be harmful for one specific task", random initial mutation-prompts on GSM8K. On ETHOS with the vague description "Solve the Problem", the full method scores 81.6% and removing Lamarckian mutation drops it to 64.6% (App. L).

## Limits the authors state

- "PB remains limited compared to the open-endedness of human thought processes": "the topology of prompting remains fixed", and "we only adapt the prompt content not the prompting algorithm itself"; human thought is also multimodal (§6).
- PB "does not invent new (auxiliary) ways of evaluating them": "only the externally specified fitness function is used throughout" (App. F).
- If recursive self-prompting is "unconstrained and uncontrolled then it can diverge (derailment) or get stuck in an attractor" (App. F), a pattern it keeps returning to.
- In few-shot evolution, "the contexts dominate, and often the task-prompts drift into nonsense" (App. J.5).

## Open problems and building blocks

- **Open:** use the LLM to assess and promote prompt diversity, or to judge the fitness of a whole "thought process" in which prompts are applied conditionally; run PB in self-play to evolve pre-prompts for LLM agents ("policies") that compete, as in a Socratic dialog (§6). "We leave it for future work to revisit whether LLMs can interpret fitness values for improved prompt evolution" (§3.2.2 footnote).
- **Released:** Nothing stated; seed lists and evolved prompts are printed in App. C–K.
- **To reuse it:** one LLM (PaLM 2-L) in three roles, a labelled training set, BERT embeddings, and 1–2k fitness evaluations of 100 questions each (App. J.2). The Lamarckian operator "is critical when the problem description is absent, insufficient, or misleading" (§3.2.4). They expect the approach to "continue to scale with ever larger and more capable LLMs" (§6).
- **Beyond its domain:** "Promptbreeder is general purpose in that the same system is able to adapt to many different domains" (§3).

## On this site

- **Discussed in:** [Self-improvement that compounds](#/challenges/compounding_self_improvement)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/promptopt-evolve">promptopt-evolve</a><a class="tag sub" href="#/tags/promptopt-general">promptopt-general</a></span>
