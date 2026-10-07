# Tulu 3: Pushing Frontiers in Open Language Model Post-Training

**Tülu 3** · preprint 2024

Read: [PDF](https://arxiv.org/pdf/2411.15124) · [arXiv](https://arxiv.org/abs/2411.15124)  
Code: [open-instruct](https://github.com/allenai/open-instruct)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- An open post-training recipe: SFT, preference tuning, then RL with verifiable rewards.
- Calls RLVR a simplified form of earlier bootstrapping and execution-feedback RL.
- Names the method: "a novel method we call Reinforcement Learning with Verifiable Rewards (RLVR)".

## In plain words

Post-training is the fine-tuning that turns a pretrained language model into a usable assistant. The authors say open recipes for it "lag behind proprietary ones", and that its data and recipes are "the portion with the least transparency" (abstract). They release Tülu 3, models post-trained from Llama 3.1 base models at 8B, 70B and 405B parameters, with all data, training code and evaluation tools (§1). The recipe has three training stages: supervised fine-tuning on curated and synthetic prompt–response pairs; preference tuning with a variant of [direct preference optimization](#/glossary/direct-preference-optimization-dpo) on response pairs rated by GPT-4o; and a [reinforcement learning](#/glossary/reinforcement-learning) stage they name [RL with verifiable rewards (RLVR)](#/glossary/rl-with-verifiable-rewards-rlvr), which rewards the model only when a program confirms its answer is correct (§2.3). On the average of their development benchmarks, the 70B model scores 76.2 against 75.3 for the closed Claude 3.5 Haiku and 74.1 for Llama 3.1 70B Instruct (§1). They present the work as a recipe that "closes the gap between open and closed finetuning recipes" (§2), and call RLVR "a novel method" (abstract).

## Background and terms

**Terms to know:** [reinforcement learning](#/glossary/reinforcement-learning) · [PPO](#/glossary/ppo) · [reward model](#/glossary/reward-model) · [KL penalty](#/glossary/kl-penalty) · [direct preference optimization (DPO)](#/glossary/direct-preference-optimization-dpo) · [RLVR](#/glossary/rl-with-verifiable-rewards-rlvr) · [LLM-as-a-judge](#/glossary/llm-as-a-judge) · [data contamination](#/glossary/data-contamination) · [pass@k](#/glossary/passk) · [RLHF](#/glossary/reinforcement-learning-from-human-feedback-rlhf) (here a reward model trained on preferred-versus-rejected pairs, Eq. 3, then RL against it minus a KL penalty to a reference model, Eq. 4; §5.1)

**The paper's own terms:**
- **post-training**: "the collection of techniques including instruction tuning, reinforcement learning from human feedback, and other types of finetuning" (§1).
- **on-policy preference data**: pairs in which one response comes from the Tülu 3 SFT model about to be tuned; off-policy pairs come only from other models (§5.3).
- **length-normalized DPO**: DPO with each response's log-probability divided by its length (§5.1.2, Eq. 6).
- **verifiable reward**: α "if correct" and 0 otherwise (Eq. 8), with α = 10 "based on pilot experiments"; it replaces the reward model in the KL-penalized RLHF objective (Eq. 7 against Eq. 4) (§6).
- **development and unseen suites**: development benchmarks guide every choice; "we did not examine scores on our unseen set when developing our models" (§2.2, Tab. 3).
- **'flex' MATH scoring**: extracting the answer in three ways, because models often ignored the few-shot format (§7.2).
- **overoptimization**: drifting far from the starting model, which "typically results in lower average scores" (one exception, Fig. 22) (§6.2.1), or satisfying constraints without "meaningful content" (App. B.4).

**Builds on:**
- UltraFeedback (Cui et al.), a synthetic preference-data pipeline: "Our approach extends and improves" its method (§2.3, §5.2.1).
- Tülu 2 and Zephyr-β, earlier open recipes "outdated on many metrics" (§1).
- STaR, Quiet-STaR, TRICE (training on rationales that reach known answers), RLEF (RL from code-execution feedback) and VinePPO: RLVR "can be seen as a simplified form" of the first three or "a simpler form of RL with execution feedback"; VinePPO (a PPO variant tested on binary GSM8K and MATH rewards) did it "for improving math skills alone" (§6, §9.2).
- PPO, with implementation details from Huang et al. (2024) (§6.2). None is on this site.

## Problem and setting

- **Question:** which data, stages, algorithms and hyperparameters let an open recipe reach closed ones on the core skills of Tab. 3 (§2.1), and which tried methods "did not reliably improve performance" (abstract).
- **Development suite** (Tab. 3, §7.2): MMLU (multiple-choice knowledge), PopQA (long-tail entity questions), TruthfulQA (questions misconceptions lead people to get wrong), BigBench-Hard (hard reasoning), DROP (reading comprehension requiring discrete reasoning), MATH (competition problems), GSM8K (grade-school word problems), HumanEval and HumanEval+ (Python from docstrings; + adds tests; pass@10), IFEval (instructions with programmatically checkable constraints), AlpacaEval 2 (length-controlled win rate against GPT-4 Turbo), and a six-benchmark safety average (§7.2.1).
- **Unseen suite** (§7.3): MMLU-Pro (10-way multiple-choice MMLU), GPQA (expert science questions), AGIEval English (exam questions), DeepMind Mathematics (56 categories of math questions), BigCodeBench-Hard (coding), and two new ones: IFEval-OOD, 52 constraints beyond IFEval's 25 (§7.3.1), and HREF, win rates against Llama 3.1 405B Instruct on 11 instruction tasks, mostly judged by an LLM given human-written references (§7.3.2).
- **Scoring:** a plain average "treating each evaluation equally" (§2.4).
- **Decontamination:** 8-gram overlap on prompts; a training set overlapping more than 2% of an evaluation is dropped if the evaluation is unseen; for development evaluations it is dropped if that did not significantly hurt performance, otherwise only matching instances are (§3.2).
- **Correct in RLVR:** the final number (GSM8K), 'flex' matching (MATH), a verifier per constraint template (IFEval-style prompts) (§6.1, Tab. 22).

## Approach

- **Data (§3).** Public datasets (WildChat: real user conversations with models, among others) chosen for diversity, skills and licenses; GPT-4o, steered by ~250K personas from Persona Hub (a collection of synthetic personas), writes new prompts for instruction following, math and code (§3.1.2); 939,344 SFT prompts in all (Tab. 7).
- **SFT (§4).** Per-skill mixes are combined and iterated with decontamination (§4.1.2); a summed token loss, used generally, fixes loss weighting under gradient accumulation (§4.3.2).
- **Preference tuning (§5, Fig. 7).** For used and unused SFT prompts and other sources, four pooled models answer, sometimes with the SFT model (on-policy); GPT-4o rates each 1–5 on four aspects; the top mean rating is chosen and a random lower one rejected (§5.2.1). Tested on an early SFT checkpoint with UltraFeedback data, of DPO, SimPO (another DPO variant) and length-normalized DPO "only length-normalized DPO outperformed our base checkpoint overall" (§5.4.1).
- **RLVR (§6, Fig. 18).** Completions to 29,946 prompts (Tab. 22) are checked by "a deterministic function" and PPO trains on reward α or 0. The value model starts from a reward model (§6.2). Inference runs on separate GPUs with vLLM (an inference engine), concurrently with training (§6.3). The final 8B checkpoint has the "best overall performance on MATH and IFEval" among those evaluated every 100 steps (§6.4).
- **405B (§8.1).** RLVR on the MATH train set only, 75 steps.

## Results

- **Overall:** at 8B, 65.1 against 66.5 for Qwen 2.5 7B Instruct and 62.9 for Llama 3.1 8B Instruct (Tab. 2). The authors claim Tülu 3 outperforms "all other open-weight models in its size category on our development evaluation suite" (§2.4) and surpasses GPT-4o-mini and Claude 3.5 Haiku (abstract). The Tab. 2 footnote marks some closed-model scores as taken from Claude model cards and some as "interpolated" by statistical imputation.
- **405B:** average without safety 80.0, against 80.5 for GPT-4o, 79.0 for DeepSeek V3 and 78.1 for Llama 3.1 405B Instruct (Tab. 4); claimed "competitive or superior" to DeepSeek V3 and GPT-4o (§8.1).
- **RLVR:** 8B DPO to final, GSM8K 84.3 → 87.6, MATH 42.0 → 43.7, IFEval 81.1 → 82.4 (Tab. 6); at 70B, "more modest improvements in IFEval and MATH, and no improvement in GSM8k" (§6.4). In ablations RLVR "can also lead to higher scores" on the targeted test, but a higher overall average "is not guaranteed" (Fig. 19); on GSM8K, adding reward-model scores "seems to introduce more noise" (§6.2.1).
- **Preference data (§5.3):** more unique prompts help, while duplicating prompts "does not necessarily" yield significant gains (Figs. 8–9); on-policy data helps (Fig. 11). PPO "could reach a comparable level of performance to DPO (albeit slightly lower)" in an untuned setup, at ~28 hours on two nodes against ~4 on one (§5.4.1).
- **SFT ablations (§4.2):** removing WildChat gives "a small but noticeable degradation on most skills"; removing the Persona data makes targeted scores "drop".
- **Generalization (§7.4):** the final checkpoints have the best average on both suites (Tab. 31). "Models generally overfit to IFEval": Tülu 3 8B scores 82.4 on IFEval, 24.3 on IFEval-OOD (Tab. 31). SFT data choices overfit the development suite in instruction following "and to some extent in Knowledge Recall and Reasoning", and the process "overfit to MATH to some extent" (§7.4.1).
- **Contamination:** 70.7% of HumanEval's instances overlap the public Evol CodeAlpaca dataset; a decontaminated version is used (Tab. 37, Tab. 8).
- **Negative results (§8.2):** online DPO gave "no or little improvement" on GSM8K and lower MATH; rejection sampling gains were, "for our setup", "minimal for the amount of compute required".

## Limits the authors state

- "we cannot rule out that any closed model has not trained on our evaluation suite" (§7); likewise for other models on the unseen benchmarks (§7.4.2).
- "we have no unseen safety evaluation" (§2.2).
- The PPO-vs-DPO reward model "was trained only once", untuned; better PPO is "entirely possible" with more tuning or compute (§5.4.1).
- RLVR training data resembles the evaluations, so "over-fitting can occur" (App. E.1); some 8B runs scoring higher on GSM8K and IFEval "tended to perform worse in other metrics" (§6.4).
- Asynchronous RL "can introduce stale data" when inference outpaces training; they train on "the second latest inference data" to help reproducibility (§6.3).
- "SFT performance noticeably varies based on the seed" (§4.3.1).
- At 405B "hyperparameter tuning was limited", and RLVR ended early "due to compute constraints" (§8.1).
- The data is "relatively short", with few turns, and English-focused (§8.3).

## Open problems and building blocks

- **Open:** more complex verifiers, such as code execution feedback (§6.1); RLVR's "exact best configuration is still to be found" (App. E.1), and "We hope to further develop and expand this technique" (§9.2); "larger value models or alternate value model-free RL algorithms", such as [GRPO](#/glossary/grpo), and longer 405B training, which "may further improve performance" (§8.1); other training strategies for online DPO and a "deeper exploration" of rejection sampling (§8.2); measuring more behaviors of instruction following (§7.4.2); long context, multi-turn, multilinguality, tool use and agents (§8.3).
- **Released:** SFT, DPO and final checkpoints at all three sizes, the 8B reward model, SFT, preference and RLVR datasets, training code, OLMES (Open Language Model Evaluation System, their evaluation code), decontamination and preference-data inference code, and a demo (Tab. 1).
- **To reuse it:** RLVR needs prompts with a ground-truth answer or constraint checker (§6.1); GPT-4o does most data synthesis and the judging, Claude 3.5 Sonnet the code solutions (§3.1.2, §5.2.1); final RL runs took ~65 hours on 8 GPUs (8B) to 46 on 256 (405B) (§6.3).
- **Beyond its domain:** a report for "further adapting the Tülu 3 approach to more domains" (abstract).

## On this site

- **Discussed in:** [Weak checkers get exploited](#/challenges/weak_checker_exploitation)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/hacking-general">hacking-general</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/rlvr-general">rlvr-general</a></span>
