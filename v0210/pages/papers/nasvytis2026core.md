# CORE: Contrastive Reflection Enables Rapid Improvements in Reasoning

**CORE (Contrastive Reflection)** · preprint 2026

Read: [PDF](https://arxiv.org/pdf/2605.28742) · [arXiv](https://arxiv.org/abs/2605.28742)  
Code: [core-reasoning](https://github.com/LinasNas/core-reasoning)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Compares successful and unsuccessful reasoning traces and distills the differences into short natural-language insights (abstract).
- Non-parametric (no weight updates); the learned knowledge is kept as compact natural-language insights (abstract).
- Reports faster improvement than GRPO, GEPA, episodic RAG and MemRL with fewer rollouts, and the strongest performance in most task–data regimes under fixed rollout budgets with as few as five training samples (abstract): a cost rival for .

## In plain words

A language model can improve when a checker says whether each answer is right, but training its weights or optimizing its prompt this way typically needs hundreds of training problems and thousands of attempts, "expensive in the best case and intractable in the worst" (abstract). CORE leaves the model unchanged. When the model fails a training problem, CORE shows it the failed attempt beside a similar successful one and asks for short tips (insights) on what made the difference. A tip is kept only if it helps solve that problem, and then gets a running score of how much it helps. On a new problem, the best-scoring tips from similar past problems go into the prompt.

On each of four reasoning tasks, with the open model gpt-oss-120b and 10 training problems, the authors report that after 350 attempts CORE beats the best accuracy any of four baselines reaches in up to 4,000 attempts (§4.2). They write that their results suggest this can be a more efficient, interpretable route to self-improvement than weight updates, prompt optimization or reusing stored attempts (abstract).

## Background and terms

**Terms to know:** [RL with verifiable rewards (RLVR)](#/glossary/rl-with-verifiable-rewards-rlvr) · [reinforcement learning](#/glossary/reinforcement-learning) (its entry defines a rollout) · [GRPO](#/glossary/grpo) · [reflective prompt optimization](#/glossary/reflective-prompt-optimization) · [Distillation into compact models](#/glossary/distillation) · [LoRA](#/glossary/lora-low-rank-adaptation) (the GRPO baseline uses it, §4.1)

**The paper's own terms:**
- **insight**: a short natural-language description of a general reasoning strategy or constraint; the authors view insights not as summaries of past attempts but as "credit-assignment hypotheses about what distinguishes successful rollouts from unsuccessful ones" (§3).
- **rollout**: one attempt at a problem, stored with its retrieved insights, output and reward (§3 "External memory store").
- **rollout memory / insight memory**: the two external stores; rollout memory keeps correctly solved past attempts, indexed by an embedding of the problem; insight memory keeps the insights with per-problem counts of use and average utility (§3).
- **baseline-relative utility**: the reward of an attempt (1 if the checker accepts it, 0 if not) minus that problem's success rate measured without any insights; it counts as positive evidence only when an attempt does better than usual on that problem (§3 "Problem setting").
- **contrastive reflection**: the step, run after a failed training attempt, that prompts the same model with the failed attempt and the most similar stored correct attempt (possibly on the same problem) to propose candidate insights (§3).
- **admission test**: each new candidate insight, alone in the prompt, is tried on the problem it came from; in the experiments it is kept only if the model then solves that problem in one try (§3).
- **sample efficiency / rollout efficiency / context efficiency**: the number of distinct training problems needed, the number of attempts needed (§2 "Learning Efficiency"), and the number of tokens a method adds to the prompt at evaluation (§4.4).

**Missing glossary terms:**
- **parametric vs non-parametric learning**: parametric methods update model weights; non-parametric methods keep the model frozen and improve its context, e.g. its prompt or retrieved memories (§2 "Learning from Verifiable Rewards").

**Builds on:**
- GRPO and the DeepSeek-R1 line of RLVR ([DeepSeek-R1](#/papers/deepseek2025reasoning "DeepSeek-R1: Incentivizing Reasoning Capability in LLMs via Reinforcement Learning (2025)"), [DeepSeekMath](#/papers/shao2024deepseekmath "DeepSeekMath: Pushing the Limits of Mathematical Reasoning in Open Language Models (2024)")), the parametric baseline and the authors' example of needing many rollouts (§1, §2, §4.1).
- GEPA ([GEPA](#/papers/agrawal2025gepa "GEPA: Reflective Prompt Evolution Can Outperform Reinforcement Learning (2026)")), the prompt optimizer the authors call "state-of-the-art" and compare against (§1, §4.1).
- MemRL, an episodic memory that summarizes past attempts and learns a value score for each to guide retrieval (not listed here), the memory baseline that also scores memories by utility (§2, §4.1).
- Verbal-reflection and memory work such as Reflexion ([Reflexion](#/papers/shinn2023reflexion "Reflexion: Language Agents with Verbal Reinforcement Learning (2023)")), ReasoningBank and Metacognitive Reuse (not listed here), plus cognitive-psychology work on contrasting successes and failures (§1, §2).

## Problem and setting

The authors ask how a frozen language model can learn from verifiable rewards with "more human-like efficiency": from a handful of training problems and few attempts (§1).

- **Rewards:** every problem has an existing checker giving a 0/1 reward (§3 "Problem setting").
- **Model:** gpt-oss-120b (OpenAI's open-weight reasoning model), frozen in all experiments and for all methods; unless otherwise noted, temperature 0.6, up to 32,768 output tokens, reasoning effort "high", while MemRL's memory-building and adjustment calls use temperatures 0.0 and 0.3 (§4.1 "Model").
- **Tasks** (§4.1 "Tasks"): Tower of Hanoi (produce a valid move sequence for the classic disk puzzle), MathGAP (arithmetic word problems with controllable proof structure), ZebraLogic (logic-grid puzzles, a kind of constraint satisfaction), and Matchstick arithmetic (fix a false equation in Roman numerals drawn as matchsticks by moving one stick; the authors wrote its generator and checker). They were chosen as unsaturated for gpt-oss-120b.
- **Data:** training sets of 5, 10 and 100 problems, a separate evaluation set of 100 problems, three independent runs per setting, mean held-out accuracy reported (§4.1 "Training").
- **Baselines** (§4.1 "Baselines"): GRPO with LoRA through the Tinker fine-tuning API, to represent RLVR; GEPA through the DSPy framework ([DSPy](#/papers/khattab2023dspy "DSPy: Compiling Declarative Language Model Calls into Self-Improving Pipelines (2024)")), which refines a single task prompt using textual feedback; Episodic RAG, the authors' own, which puts the most similar past successful and failed attempts with their checker feedback into the prompt; and MemRL, adapted from its official code.
- **Counting rollouts:** CORE's baseline runs and admission tests count (§4.2).

## Approach

CORE trains by repeating one step (§3, Fig. 1, App. A Alg. 1):

1. **Measure baselines.** Before training, each training problem's no-insight success rate is estimated from several samples (§3, §4.3 footnote: ten per training problem).
2. **Pick a problem, favoring failures.** Problems the model currently solves less often are sampled more, mixed with uniform sampling so every problem keeps some chance (§3 "Failure-biased problem sampling").
3. **Retrieve insights.** CORE finds the stored training problems most similar to the current one (by embedding similarity), and scores each insight by its average utility on those neighbors, weighting problems where it was used more. During training a bonus favors rarely retrieved insights. The top 25 go into the prompt (§3 "Insight retrieval", §4.1).
4. **Solve and update.** The checker's reward, minus the problem's baseline, is credited to every retrieved insight equally, a "group-level credit assignment rule" (§3). The new attempt is stored in rollout memory (§3, App. A).
5. **Reflect on failure.** If the attempt failed and a correct stored attempt exists, contrastive reflection proposes candidate insights; duplicates are removed and the rest go through the admission test (§3 "Contrastive reflection").

**At inference** (§3 "Evaluation"): both memories are frozen. For each test problem CORE adds to the prompt the 25 insights with the best utility on similar training problems, with no exploration bonus, reflection or memory updates.

## Results

- **Rollout efficiency** (10 training problems; §4.2, Fig. 2): the authors report that at its first evaluation, 350 rollouts, CORE "already exceeds the best evaluation performance achieved by any baseline method at any training point", on all four tasks, although the baselines ran for 4,000 rollouts and CORE for 2,100. Averaged over tasks, CORE's accuracy goes from 0.445 at rollout 0 to 0.712 at rollout 350 (a 59.9% gain) and holds there to rollout 2,100.
- **Sample efficiency** (§4.3, Tab. 1): at fixed budgets of 2,050, 2,100 and 3,000 rollouts for 5, 10 and 100 training problems (CORE's 2,000 training rollouts plus its baseline estimation, which the baselines also get), CORE has the highest mean accuracy in 9 of 12 task-by-size conditions. The exceptions are Tower of Hanoi with 5 and 100 problems (MemRL best) and ZebraLogic with 100 (GEPA best). Averaged over tasks, CORE improves on the no-learning model by 54.8%, 56.2% and 52.3% with 5, 10 and 100 training problems.
- **GRPO:** Tab. 1 prints it below the no-learning model on Matchstick arithmetic, MathGAP and Tower of Hanoi, in a comparison the authors call rollout-limited (§4.1).
- **Context efficiency** (§4.4, Fig. 3): averaged over tasks and training sizes, CORE adds 0.92k tokens per evaluation problem, against 33.6k for Episodic RAG, 32.7k for MemRL and 1.29k for GEPA.
- **Ablations** (10 training problems, aggregated over tasks; §5, Fig. 4): final mean improvement over rollout 0 is 0.268 for full CORE, 0.234 when reflecting only on the latest failed attempt, 0.203 when reflecting only on a correct attempt, and 0.227 when retrieving by similarity alone without utility scores. All variants still beat GEPA, the strongest baseline, in final accuracy (§5).
- **What is learned** (§4.5): insight memory grows most on Matchstick arithmetic and least on MathGAP (App. B, Fig. 5). Most admitted insights have non-negative utility; the authors read the distributions (App. C, Fig. 6) as many mildly useful insights plus a few high-utility ones driving the largest gains. Inspected high-utility insights have three roles: structuring the search space, tracking intermediate state, and verification (Tab. 2).

## Limits the authors state

- CORE "assumes access to verifiable rewards", which limits it to verifiable domains (§6).
- Its utility update gives the same outcome to all retrieved insights, leaving "finer-grained credit assignment among multiple insights unresolved" (§6; also §3).
- "Reflection and admission testing also introduce additional inference cost" (§6).
- The experiments cover only reasoning, planning and problem-solving tasks, which "leaves open the question of how CORE performs in more open-ended environments" (§6).
- GRPO results "should be interpreted as a rollout-limited RLVR comparison rather than a fully scaled RL training run" (§4.1).

## Open problems and building blocks

- **Open** (§6):
  - combining CORE with RLVR-style training, so reflection supplies validated intermediate supervision for Distillation into compact models;
  - continual learning: accumulating, merging and selectively retrieving insights across tasks;
  - multi-step and agentic settings, where failures occur at the level of plans, tool calls, subgoals or environment interactions;
  - multimodal domains, with insights over paired visual and textual traces.
- **Released:** the code (title-page footnote), including the Matchstick arithmetic problem generator, checker and datasets (§4.1 "Tasks").
- **To reuse it:** a per-problem 0/1 checker; a frozen model, gpt-oss-120b in all experiments (the authors chose it partly because "initial experiments had suggested that CORE generates more useful insights with larger model sizes", §4.1); a text-embedding model (jina-embeddings-v2-base-en, a 137M-parameter BERT-based model); the experiments ran inference through the NVIDIA NIM and Cerebras APIs (§4.1). Settings used: 25 insights per prompt, one admission sample with zero margin (§3, §4.1). The method is stated for single-turn problems with a final answer (§6).

## On this site

- **Discussed in:** [Self-improvement that compounds](#/challenges/compounding_self_improvement)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/harness-general">harness-general</a><a class="tag sub" href="#/tags/harness-promptopt">harness-promptopt</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/promptopt-context">promptopt-context</a><a class="tag sub" href="#/tags/promptopt-feedback">promptopt-feedback</a><a class="tag sub" href="#/tags/promptopt-general">promptopt-general</a></span>
