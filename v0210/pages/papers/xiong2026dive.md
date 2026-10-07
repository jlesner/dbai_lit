# DIVE: Unlocking Self-Improvement in Frozen Language Models Through Diversity-Driven Skill Evolution

**DIVE** · preprint 2026

Read: [PDF](https://arxiv.org/pdf/2608.12486) · [arXiv](https://arxiv.org/abs/2608.12486)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Evolves several populations of natural-language skills from experience and verifier feedback.
- Diversity-driven transformations, then a complementary skill set is selected.
- Reports larger gains with fewer rollouts than GEPA, SFT and GRPO on math and logic (abstract); its best rows answer with ten skill-conditioned samples where the prompt optimizers answer once (Tab. 1, M = 10), and Fig. 1's rollout counts don't fit the stated configuration.

## In plain words

A deployed language model does not keep what it learns from new problems or feedback without fine-tuning, which needs weight access and substantial compute, a growing obstacle as many models are reachable only through APIs (§ "Introduction"). DIVE leaves the model unchanged: the same model writes, tries and revises plain-text skills (reusable instructions holding procedures, checks, common mistakes and output rules), guided by a checker's right-or-wrong marks and, for some tasks, error signals such as timeouts. DIVE grows ten groups of skills from different random training samples, favours the kinds of rewrite that have paid off so far, then keeps up to ten skills that solve different problems. At test time each kept skill answers and the model picks one. On six math and logic-puzzle tasks with three models, the authors report the highest average of all the methods they compare, and a small model with its skills beating the larger GPT-5 prompted with examples, on average, at lower cost per question. They contrast it with prompt optimization that "primarily searches for a single improved prompt" (§ "Introduction").

## Background and terms

**Terms to know:** [reflective prompt optimization](#/glossary/reflective-prompt-optimization) · [multi-armed bandit (UCB)](#/glossary/multi-armed-bandit-ucb) · [self-consistency (majority voting)](#/glossary/self-consistency-majority-voting) · [beam search](#/glossary/beam-search) · [reinforcement learning](#/glossary/reinforcement-learning) · [GRPO](#/glossary/grpo) · [rejection sampling](#/glossary/rejection-sampling) · [LoRA](#/glossary/lora-low-rank-adaptation) (the SFT baseline uses it, Supp. "Parameter-based Adaptation", PDF p. 21)

**The paper's own terms:**
- **frozen model**: its weights never change; it solves the task and revises its own skills, with no stronger teacher (§ "Introduction").
- **verifier**: a checker "with access to the gold answer" that scores a response 1 or 0, plus, depending on the task, signals such as timeouts; it "does NOT provide natural-language critiques" (§ "Preliminaries", "Problem Definition").
- **skill**: "a compact textual artifact that guides subsequent inference by encoding reusable reasoning procedures, verification strategies, common failure modes, and output constraints" (§ "Preliminaries").
- **population**: a group of skills evolved on its own; K = 10 populations in the experiments (Supp. "Implementation Details", PDF p. 18).
- **experience and reflection subsets**: each population's own samples of the training (evolution) set, drawn with replacement; the first seeds skills, the second scores them and shows their failures (§ "Methodology").
- **evolution operator**: a rewrite instruction plus a rule for choosing which skills (parents) it rewrites (§ "Methodology").
- **parent-relative reward**: a new skill's accuracy on the reflection subset minus its best parent's (§ "Methodology").

**Missing glossary terms:**
- **magma**: a set with one binary operation and no further rules; Equational Theories asks whether one identity implies another "over all possible magmas" (Supp. "Dataset Statistics").

**Builds on:**
- Reflexion ([Reflexion](#/papers/shinn2023reflexion "Reflexion: Language Agents with Verbal Reinforcement Learning (2023)")), MIPROv2 ([MIPRO (shipped in DSPy as MIPROv2)](#/papers/opsahlong2024mipro "Optimizing Instructions and Demonstrations for Multi-Stage Language Model Programs (2024)")) and GEPA ([GEPA](#/papers/agrawal2025gepa "GEPA: Reflective Prompt Evolution Can Outperform Reinforcement Learning (2026)")), cited together as prior textual reflection and prompt optimization (§ "Introduction").
- The authors' earlier "candidate generation and ranking pipeline" (not listed here), which joint selection follows (§ "Methodology").
- Evolutionary search, contrasted in § "Related Work": EvoPrompt ([EvoPrompt](#/papers/guo2023evoprompt "EvoPrompt: Connecting LLMs with Evolutionary Algorithms Yields Powerful Prompt Optimizers (2024)")), AlphaEvolve ([AlphaEvolve](#/papers/novikov2025alphaevolve "AlphaEvolve: A coding agent for scientific and algorithmic discovery (2025)")), GEPA.
- Baselines ExpeL (distils past successes and failures into natural-language rules; not listed here) and SkillOpt ([SkillOpt](#/papers/yang2026skillopt "SkillOpt: Executive Strategy for Self-Evolving Agent Skills (2026)")) (§ "Evaluation").

## Problem and setting

- **Question:** "can a frozen language model achieve self-improvement by converting experience into persistent natural-language skills?" (§ "Introduction"). Correct means a verifier score of 1 (§ "Preliminaries").
- **Tasks** (Supp. "Dataset Statistics", PDF p. 18):
  - HMMT, "a prestigious high-school mathematics competition": tested on MathArena's (a math evaluation platform) February and November 2025 sets; trained on 1,200 NuminaMath-1.5 competition problems, excluding any with "normalized overlap with the HMMT evaluation set".
  - Equational Theories: 400 test problems, 200 normal and 200 hard.
  - Four generated SynLogic puzzles: Sudoku; Cryptarithm (letters stand for distinct digits in an arithmetic equation); Calcudoku (rows and columns hold 1 to N once, regions have arithmetic targets); Futoshiki (that grid rule with inequality signs). Each has 1,200 training and 200 test instances per difficulty setting. Qwen3-8B is tested on normal subsets, other models on hard.
- **Verifiers** (Supp. "Dataset Statistics", "Verifiers"): HMMT by symbolic equivalence to the reference answer; Equational Theories by comparing the verdict with the label; puzzles against their constraints.
- **Splits:** 1,000 training examples for evolution, the rest for validation (Supp. "Implementation Details"). Validation instances "are never included in skill-generation or revision prompts"; the test split "is used only for final evaluation" (§ "Evaluation").
- **Models:** GPT-5-nano, DeepSeek-v4-flash, Qwen3.5-27B (Tab. 1); Qwen3.5-9B; Qwen3-8B (§ "Evaluation").

## Approach

- **Seeds.** Three per population: a minimal one, one from successful procedures, one from recurring failures and checks (Supp. "Seed Skill Initialization", PDF p. 11).
- **Operators** (Supp. "Evolution Operator Portfolio", "Parent Selection", PDF pp. 11–12; length limit: "Implementation Details", PDF p. 18): Reflective Repair fixes systematic failures, applied preferentially to strong skills; Exploratory Revision tries "a substantially different solution strategy" on weak ones; Compression shortens strong skills over 4,096 tokens; Recombination merges a strong skill with a complementary one.
- **Evolution.** For 10 steps per population, the UCB rule (Eq. 11) picks, after trying each operator once, the one with the highest mean parent-relative reward plus an exploration bonus. The model writes a child from its parents' labelled trajectories on the reflection subset. At step 8 the model writes one new operator from a summary of the history, aimed at recurring failures or transformations the existing operators address poorly (§ "Methodology"; Supp. "Implementation Details").
- **Joint selection.** The top 3 per population on validation are shortlisted; skills are added greedily, at most one per population, each time the one that most raises validation accuracy of the whole answer-and-pick pipeline, until M skills (M = 10 here; Tab. 1 also reports M = 1) or none helps (Supp. "Joint Skill Set Selection", PDF p. 15; "Implementation Details", PDF p. 18).
- **Inference.** Each selected skill gives one answer; the frozen model ranks them and returns the top one (Eq. 18, PDF p. 5). The supplement specifies majority vote for HMMT, and for the other tasks one ranking call showing all candidates "(no lengthy reasoning content)" (Supp. "Inference-Time Candidate Ranking", PDF p. 15).
- **Theory**, given as "theoretical motivation" (Supp. "Theoretical Analysis", PDF pp. 16–18):
  - the chance that some proposal beats its best parent by at least a set margin is one minus the product of each step's chance of failing, given all earlier steps failed (Eq. 51);
  - "under the idealized assumptions" that populations succeed independently with equal probability, the chance that one holds a skill with error rate at most a given level grows with their number, with diminishing returns (Eq. 56);
  - the pick-one step's accuracy equals that of an oracle picking a correct answer whenever one exists, minus the chance a correct one was available but a wrong one picked (Eq. 62); a new skill helps only if its added coverage exceeds its added picking error.

## Results

Baselines (Supp. "Baselines", PDF pp. 19–21): zero-shot; few-shot; SC (ten samples); ToT (Tree of Thoughts, [Tree of Thoughts](#/papers/yao2023tot "Tree of Thoughts: Deliberate Problem Solving with Large Language Models (2023)"): search over partial solutions, matched to DIVE's call count); Experience RAG (retrieved similar trajectories); ExpeL; Direct Skill (one skill written once); SkillOpt with the same model proposing edits; MIPROv2 and GEPA with "a rollout budget comparable to that of DIVE".

- **Main comparison** (Tab. 1, PDF p. 5; puzzles on hard subsets): DIVE with M = 10 has the highest six-task average on each model, 81.5 (GPT-5-nano), 96.4 (DeepSeek-v4-flash) and 86.1 (Qwen3.5-27B), against the best baseline's 74.3 (ToT), 86.8 (SC) and 79.4 (ToT). The authors say DIVE "substantially outperforms experience- and memory-based methods and prompt optimization" (§ "Evaluation", "Main Results").
- **Small vs large model** (Tab. 2, PDF p. 6): GPT-5-nano with DIVE (M = 10) averages 81.5 against 79.8 for GPT-5 few-shot, at $0.088 per example against $0.153, a 42.5% cut, using 10.9 calls per example against one.
- **Rollouts** (Fig. 1, PDF p. 1; § "Evaluation", "Optimization Efficiency"): on HMMT and normal Sudoku with Qwen3-8B, DIVE "improves rapidly with additional experience, while SFT and GEPA plateau at substantially lower performance and GRPO improves more gradually despite requiring considerably more rollouts". SFT uses LoRA on rejection-sampled correct trajectories (Supp. "Parameter-based Adaptation").
- **Transfer** (Tab. 3, PDF p. 6): Qwen3.5-9B's skills lift the average of Qwen3.5-27B from 59.6 to 81.2 and of DeepSeek-v4-flash from 73.9 to 90.5, below the 86.1 and 96.4 of each model's own skills; on Qwen3.5-9B itself, 27.2 to 56.6.
- **Selection ablation** (Tab. 4, PDF p. 7; Qwen3.5-9B): averages rise from 27.2 (zero-shot) to 37.2 (best single skill), 49.3 (one random skill per population), 54.1 (top 10 by individual score) and 56.6 (joint selection).
- **Other ablations** (Figs. 3–4, PDF p. 7; Qwen3-8B): accuracy "generally improves as more skills are included and gradually saturates"; "heterogeneous operators outperform a single operator, UCB improves over uniform allocation, and adaptive operator generation yields further gains" (§ "Evaluation", "Ablation Analysis").
- **Learned skills** (Supp. "Examples", PDF pp. 22–56): GPT-5-nano's final HMMT and Sudoku skills, which the authors say "exhibit both convergence and specialization".

## Limits the authors state

No limitations section; caveats:
- The population argument uses "idealized assumptions"; "The populations are not perfectly independent in practice", though separate samples and histories "encourage lower dependence across runs" (Supp. "Candidate-Pool Search Coverage", PDF p. 17).
- As operator rewards change during evolution, they "do not invoke the standard regret guarantees for stationary stochastic bandits" (Supp. "Parent-Relative Credit Assignment", PDF p. 17).
- Adding a skill "may increase coverage while also making selection more difficult", so "test accuracy need not improve monotonically with skill-set size" (Supp. "Candidate Coverage and Selection Regret", PDF p. 18).

## Open problems and building blocks

- **Open:** "Future work may explore cross-task skill transfer and integration with long-term memory mechanisms to support more scalable and continual self-improvement" (§ "Conclusion").
- **Released:** nothing stated; the supplement prints the prompt templates (PDF pp. 12–16).
- **To reuse it:** no weight access; the setting "remains applicable when model weights or training infrastructure are unavailable" (§ "Preliminaries"). It needs a 0/1 verifier and labelled training data; settings in Supp. "Implementation Details" (PDF p. 18).

## On this site

- **Discussed in:** [Can a memory across problems be checked before it is reused?](#/challenges/verified_memory)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/promptopt-context">promptopt-context</a><a class="tag sub" href="#/tags/promptopt-evolve">promptopt-evolve</a><a class="tag sub" href="#/tags/promptopt-general">promptopt-general</a><a class="tag sub" href="#/tags/scaling-general">scaling-general</a></span>
