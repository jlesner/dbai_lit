# Learning to Self-Evolve

**Learning to Self-Evolve (LSE)** · preprint 2026

Read: [PDF](https://arxiv.org/pdf/2603.18620) · [arXiv](https://arxiv.org/abs/2603.18620)  
Code: [learning-to-self-evolve](https://github.com/chenyn66/learning-to-self-evolve)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- RL-trains a 4B model to edit its own context; each edit is rewarded by the downstream improvement.
- Tree-guided evolution loop at test time.
- Reports beating GEPA and TextGrad, both driven by the same 4B model as proposer, on BIRD text-to-SQL (Tab. 1, §4.1): context optimization trained with a checkable reward. Scores are each method's best round on the holdout that also selects (App. A).

## In plain words

Systems that rewrite an LLM's prompt from feedback use a model never trained for that job; the authors argue prompt improvement is a trainable reasoning skill (§1). They train a 4B model by reinforcement learning (trial and reward) to rewrite another model's instruction after seeing its answers to a batch of problems. Each rewrite is rewarded by the accuracy gain it causes on fixed held-out problems. At test time a tree of prompt versions allows backtracking.

On BIRD (SQL questions over real databases), with a 4B model answering and each method's best held-out score over 25 rounds reported, the trained editor averages 67.3%, against 65.2% with GPT-5 as editor and 62.8% for the optimizer GEPA run with the 4B model. On multiple-choice questions they call it a match for GPT-5 and GEPA. They frame it as "treating self-evolution as a learnable skill" (abstract).

## Background and terms

**Terms to know:** [reinforcement learning](#/glossary/reinforcement-learning) · [PPO](#/glossary/ppo) · [GRPO](#/glossary/grpo) · [KL penalty](#/glossary/kl-penalty) · [text-to-SQL](#/glossary/text-to-sql) · [execution accuracy](#/glossary/execution-accuracy) · [policy gradient](#/glossary/policy-gradient) · [UCB (upper confidence bound)](#/glossary/multi-armed-bandit-ucb)

**The paper's own terms:**
- **Test-time, inter-episode, prompt-based self-evolution**: after deployment, the model updates between problems and applies the update to new ones (inter-episode), not refining one problem's answer (intra-episode) (§1); only its context (prompt text) changes, weights stay frozen (§3.1).
- **"Policy", two senses**: the **action policy** (π_θ) is the frozen model plus context that answers the problems (§3.1–3.2); the **self-evolving policy** (f_ψ) rewrites that context and is the one trained (§3.2–3.3). Both are Qwen3-4B-Instruct unless stated (§4.1).
- **Instruction field**: the only part of the context the self-evolving policy edits; task description and output format stay fixed (§3.2). The **seed prompt** is the starting instruction (App. B).
- **Structured performance summary** (S_t): the batch's problems, outputs, ground-truth answers and per-problem correctness (§3.2, Eq. 3).
- **Holdout reward** R̄(c): context c's average reward over a fixed holdout set D, used because one small batch is a noisy estimate (§3.2, Eq. 4).
- **"Task domain", two senses**: one BIRD database or one subject (§4.1), or a task family, text-to-SQL or QA (§4, App. A, §5).
- **Evolution tree**: all contexts so far; each node stores context, summary, holdout reward and visit count (§3.2).
- **r_LSE / A_LSE**: the reward and advantage of one edit, holdout reward after it minus before it (§3.3, Eq. 7, 9).

**Missing glossary terms:**
- **Baseline, advantage, control variate**: the baseline estimates the reward expected before acting; the advantage is reward minus baseline. A baseline that doesn't depend on the action leaves the expected gradient unchanged; the paper calls such a term "a control variate that cancels prompt-specific offsets" (§3.3).
- **Contextual bandit**: an RL problem with one action per episode, rewarded at once, so no credit to assign over later steps (§3.3).

**Builds on:**
- GEPA ([GEPA](#/papers/agrawal2025gepa "GEPA: Reflective Prompt Evolution Can Outperform Reinforcement Learning (2026)")), "a reflective prompt optimizer that merges textual reflection with multi-objective evolutionary search", and TextGrad ([TextGrad](#/papers/yuksekgonul2024textgrad "TextGrad: Automatic 'Differentiation' via Text (2024)")), which critiques an instruction and then rewrites it: the prompt-optimization baselines (§4.1).
- UCB (Auer, 2002) for choosing which node to extend (§3.2).
- PPO or GRPO policy-gradient training, whose learned baseline LSE replaces (§3.3).

## Problem and setting

- **Question:** can an LLM be trained to be a better self-evolving policy, instead of relying on its untrained ability to read feedback (§1)? The goal is the summed reward of the contexts produced over T rounds (§3.1, Eq. 2).
- **Domains:** each BIRD database and each subject is a separate domain; rounds and holdout set draw from it (§4.1).
  - Text-to-SQL: BIRD (question–SQL pairs over databases, [BIRD](#/papers/li2023bird "Can LLM Already Serve as A Database Interface? A BIg Bench for Large-Scale Database Grounded Text-to-SQLs (2023)")); train on its training split, evaluate on "five randomly selected databases from the BIRD-SQL Mini-Dev split" (§4.1; Mini-Dev: a smaller BIRD development set). SQLite is the engine (App. B.1); the score is execution accuracy (Tab. 1).
  - QA: train on SuperGPQA, a large multiple-choice question benchmark (converted to four options), evaluate on ten MMLU-Redux subjects, "multiple-choice questions across diverse academic subjects" (§4.1). Sizes: Tab. 4 (App. A).
- **Protocol (App. A):** holdout set of 50 problems per database or subject, averaged over eight generations; 25 rounds; batches of 10 problems in one fixed order for all methods. The paper reports "the best performance achieved over T rounds of evolution" (§4.1).
- **Baselines (§4.1):** GPT-5 and Claude Sonnet 4.5 ("two frontier closed-source models") as self-evolving policy; GEPA and TextGrad with "Qwen3-4B-Instruct as the prompt proposer and optimizer". The action model is Qwen3-4B-Instruct for all.
- SQL semantics and NULLs: not discussed.

## Approach

- **Tree-guided evolution (§3.2, Algorithm 1).** Each round picks a tree node by UCB: its holdout reward plus a bonus depending on the number of completed rounds and its visit count (Eq. 5). The action model answers a new batch with that context; the self-evolving policy reads the summary and writes a new instruction, scored on the holdout set and added as a child. The algorithm returns the best-scoring node. This avoids a linear chain, which "risks committing irreversibly to a suboptimal evolution path" (§3.2). Editing only the prompt "requires no gradient computation at test time" (§3.1).
- **Single-step training (§3.3).** Training on whole T-round trajectories is costly and has a long-horizon credit-assignment problem (working out which edit earned a later reward), so training uses one edit at a time, a contextual bandit.
- **The reward (§3.3).** The editor's score for an edit is the holdout accuracy with the new instruction minus that with the old one (Eq. 7). The authors argue that the post-edit score alone is "biased toward contexts that are already effective", and show that with a learned baseline both rewards give the same gradient estimates (Eq. 8). So they skip learning a baseline: the old instruction's score is known before the editor acts, equals the reward of an edit that changes nothing, and serves as the baseline (Eq. 9–10), which they argue gives "a cleaner learning signal" when evaluation noise and differences in prompt difficulty dominate.
- **Training data (§3.3, App. A).** Starting contexts are sampled from evolution trees grown in advance (200 runs × 20 rounds per task family, about 4,000 nodes), so training sees contexts like those of multi-step evolution. A curriculum prefers nodes furthest below the best score in their tree.
- **Settings (App. A).** The verl RL library; 32 nodes per batch, 4 rollouts per node; on-policy (trained on the current model's own samples); no KL regularization; 4 epochs; checkpoint chosen on a separate development set.

## Results

Qwen3-4B-Instruct answers except in the transfer test; each score is a method's best holdout score.

- **BIRD (Tab. 1; §4.2).** It reports 67.3% average execution accuracy for LSE, against 65.2% (GPT-5 as editor), 64.5% (Claude Sonnet 4.5), 63.1% (TextGrad), 62.8% (GEPA), 62.2% (untrained 4B editor) and 57.2% (seed prompt).
- **MMLU-Redux (Tab. 2; §4.2).** It reports 73.3% for LSE, against 73.0% (GEPA), 72.5% (GPT-5), 72.0% (Claude Sonnet 4.5), 69.1% (TextGrad) and 67.6% (seed). The authors write "LSE matches GPT-5" and "LSE matches GEPA" (§4.2); the abstract says it "outperforms" all four baselines on both benchmarks.
- **Reward ablation (Fig. 2a; §4.3).** Training on the post-edit score with GRPO's group advantage gives 63.0% on BIRD, against 67.3%, which the authors read as "empirical evidence that the improvement-based objective is more effective".
- **Search ablation (Fig. 2b, Fig. 4; §4.3).** With the untrained editor, tree search against a linear chain: 62.2% vs. 59.8% on BIRD, 71.2% vs. 69.0% on MMLU-Redux. On the BIRD Card Games database (Fig. 3) the chain "collapses from 56% to below 30%".
- **Transfer (Tab. 3; §4.3).** Without retraining, the LSE editor guides Arctic-Text2SQL-R1-7B ("a text-to-SQL model fine-tuned with RL on the BIRD training set") from 57.7% to 64.4%; the authors read prompt and weight training as "complementary".

## Limits the authors state

- Single-step training, "delegating exploration entirely to the tree search algorithm at test time"; multi-step optimization "could yield stronger policies but would introduce additional challenges in credit assignment and computational cost" (§5 "Limitations").
- "We train a separate self-evolving policy for each task domain", meaning task family; one policy across tasks "likely requires large-scale training across many domains" (§5).
- Only the instruction field evolves; "tools, skill libraries, and external memory are not explored" (§5).
- "Our training and evaluation environments are relatively small in scale" (§5).
- Gains are smaller on MMLU-Redux; possibly because BIRD problems in one domain share a database while MMLU-Redux subjects are deduplicated and broad (§4.2).

## Open problems and building blocks

- **Open:** "Developing more principled and scalable approaches to environment curation and evaluation remains an important open problem" (§5). LSE "could be paired with updates in the latent space or parameter space" (the model's internal representations or its weights) (§5).
- **Released:** code (abstract footnote); prompts and found instructions in App. B.
- **To reuse it:** a per-problem checkable reward with ground-truth answers (§3.2), a holdout set per database or subject and a training split per task family (§4.1, App. A), and RL training of a 4B editor with verl (App. A).

## On this site

- **Discussed in:** [Comparing LLM methods under noise](#/challenges/method_comparison_under_noise)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/llm-gen">llm-gen</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/nl2sql-data">nl2sql-data</a><a class="tag sub" href="#/tags/promptopt-evolve">promptopt-evolve</a><a class="tag sub" href="#/tags/rlvr-sql">rlvr-sql</a></span>
