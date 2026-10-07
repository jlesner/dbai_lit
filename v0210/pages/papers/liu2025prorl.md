# ProRL: Prolonged Reinforcement Learning Expands Reasoning Boundaries in Large Language Models

**ProRL** · NeurIPS 2025

Read: [PDF](https://arxiv.org/pdf/2505.24864) · [arXiv](https://arxiv.org/abs/2505.24864) · [DOI](https://doi.org/10.52202/085713-0608)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Prolonged RL training with KL control, reference-policy resets and a diverse task suite (abstract).
- pass@k of base and RL-trained models across tasks, including tasks where the base model fails at any number of samples (abstract).
- An independent counter-claim to [Does Reinforcement Learning Really…](#/papers/yue2025rlreasoning "Does Reinforcement Learning Really Incentivize Reasoning Capacity in LLMs Beyond the Base Model? (2025)"), which §1 cites as the view it challenges: it reports RL-trained models ahead of the base across pass@k (abstract), though pass@128 often declines on some math benchmarks (§4.2); its base is the distilled DeepSeek-R1-Distill-Qwen-1.5B (§2.3.1), not a pretrained model, while [Does Reinforcement Learning Really…](#/papers/yue2025rlreasoning "Does Reinforcement Learning Really Incentivize Reasoning Capacity in LLMs Beyond the Base Model? (2025)") reports that Distillation into compact models itself expands the reasoning boundary (abstract).

## In plain words

It is debated whether reinforcement learning with automatically checked answers lets a model solve problems it could not solve before, or only makes it produce more often answers it could already reach with enough samples (abstract, §1). The authors suggest that earlier negative findings may stem from training mostly on math and from stopping training early, "typically no more than hundreds of steps" (§1). They train a 1.5-billion-parameter model for more than 2,000 steps on 136K problems from five domains, with a penalty keeping it near a reference copy of itself that they reset from time to time. They compare it with its starting model, a small model from the DeepSeek-R1 release, on how often it succeeds within 1 to 256 tries.

They report single-try gains over the starting model of 15.7 points on math up to 54.8 on logic puzzles (§3). With many tries, they report the largest gains where the starting model was weakest, and no gain or a drop on some benchmarks, particularly in math (§4.1–4.2). They present this as challenging "prevailing assumptions" (abstract).

## Background and terms

**Terms to know:** [reinforcement learning](#/glossary/reinforcement-learning) · [RL with verifiable rewards](#/glossary/rl-with-verifiable-rewards-rlvr) · [pass@k](#/glossary/passk) · [PPO](#/glossary/ppo) · [GRPO](#/glossary/grpo) · [KL penalty](#/glossary/kl-penalty) · [policy entropy](#/glossary/policy-entropy) · [Distillation into compact models](#/glossary/distillation)

**The paper's own terms:**
- **reasoning boundary**: the paper's term for the range of problems a model can solve, which it measures by pass@128, the chance that one of 128 samples is right (§4.1); §4.2 calls pass@128 "broader reasoning ability".
- **entropy collapse**: the model's output distribution "becomes overly peaked early in training", so it stops exploring different outputs (§2.2.1).
- **reference policy reset**: replacing the reference model of the KL penalty with a recent snapshot of the model being trained, and reinitializing the optimizer state (§2.3.1).
- **clip-higher** and **dynamic sampling**: two parts of DAPO, an earlier GRPO variant (§2.3). The first sets a higher upper than lower limit on how far one update may move a response's probability; the second drops prompts that all samples solve or all fail, as they give no learning signal.
- **creativity index**: a measure of how much of a model's output overlaps with a pretraining corpus (here DOLMA, which the paper calls "the largest open-source pretraining corpus"); lower means more overlap (§1, §4.1, Fig. 3).
- **Diminish / Plateau / Sustained**: three patterns of pass@k across the starting model, an intermediate and the final checkpoint: reduced diversity, early saturation, continued improvement (§4.2, Fig. 4).
- **OOD tasks**: the Reasoning Gym tasks the paper treats as out-of-distribution, acre, boxnet and game_of_life_halting (§3.4, Tab. 3); boxnet "was not seen during training" (§4.3). **Reasoning Gym** is an open-source suite of about 100 generated puzzle tasks with verifiers; the paper uses 96 (App. D.4).
- **Starting model**: DeepSeek-R1-Distill-Qwen-1.5B, called DeepSeek-R1-1.5B in §1 and DeepSeek-R1-Distilled-1.5B in §4.

**Builds on:**
- GRPO from DeepSeekMath ([DeepSeekMath](#/papers/shao2024deepseekmath "DeepSeekMath: Pushing the Limits of Mathematical Reasoning in Open Language Models (2024)")), the core RL algorithm (§2.1).
- DAPO (Yu et al., not listed here), whose clip-higher and dynamic sampling it adopts (§2.3, §3.2).
- The view it challenges: Yue et al. ([Does Reinforcement Learning Really…](#/papers/yue2025rlreasoning "Does Reinforcement Learning Really Incentivize Reasoning Capacity in LLMs Beyond the Base Model? (2025)")), Dang et al. and Zhao et al., which in the paper's words claim "RL-trained models do not acquire new reasoning capabilities beyond what exists in their base models based on pass@k metrics" (§1, §5).

## Problem and setting

- **Question:** "Does reinforcement learning truly unlock new reasoning capabilities from a base model, or does it merely optimize the sampling efficiency of solutions already embedded in the base model?" (§1).
- **Starting model:** DeepSeek-R1-Distill-Qwen-1.5B, which the paper calls "a well-initialized checkpoint" already producing coherent chain-of-thought (§2.3.1).
- **Training data:** 136K problems with verifiable rewards (§3.1, App. D, Tab. 4): math (40k, binary reward, DeepScaleR dataset), code (24k, reward is the fraction of test cases passed), STEM (25k, binary, filtered from SCP-116K with a GPT-4o judge), logic puzzles (37k, continuous reward from Reasoning Gym's verifiers) and instruction following (10k, continuous, Llama-Nemotron data).
- **Benchmarks (§3.4):** math: AIME 2024 and 2025, AMC, MATH, Minerva Math and Olympiad Bench (competition and textbook math); code: APPS, CodeContests, Codeforces and TACO (competitive programming, from the PRIME validation set), plus HumanEvalPlus and LiveCodeBench; STEM: a subset of GPQA Diamond (hard science questions); instruction following: IFEval; logic: 100 held-out samples per Reasoning Gym task.
- **What "correct" means:** for math, code and STEM, pass@1 is estimated from 16 samples per prompt with "strictly binary rewards"; for logic puzzles and instruction following it is the average continuous reward of the rule-based verifiers (§3.4). Open-source models are evaluated "using our own evaluation settings" (temperature 0.6, up to 32k tokens; §3.4).
- **Baselines:** the starting model; DeepScaleR-1.5B ("tailored for mathematical reasoning") and DeepCoder-1.5B ("focused on competitive programming") (§3.4); the larger DeepSeek-R1-Distill-Qwen-7B as a reference (Tab. 1).

## Approach

- **GRPO (§2.1, Eqs. 1–2):** for each prompt, sample a group of responses; each response's reward minus the group mean, divided by the group's standard deviation, is its advantage, in place of PPO's value model. The paper writes GRPO's objective as a clipped probability-ratio objective (Eq. 1).
- **Against entropy collapse (§2.2.1, §2.3):** a higher sampling temperature only "delays the onset of entropy collapse rather than preventing it", though they still use 1.2 (§3.2). They adopt DAPO's clip-higher (Eq. 3) and dynamic sampling.
- **KL penalty (§2.3.1, Eq. 4):** against recent works that drop it, the authors argue that this view "often applies to base models prior to any supervised fine-tuning", while from a checkpoint that already writes coherent chain-of-thought "retaining a KL penalty is still beneficial for both stability and sustained entropy" (§2.3.1).
- **Reference policy reset (§2.3.1, §3.3):** because "the KL term may increasingly dominate the loss", they "introduce a simple yet effective technique": periodically hard-reset the reference policy to a recent snapshot and reinitialize the optimizer (§2.3.1). They reset when validation performance "stagnates or degrades" (§3.3).
- **Training recipe (App. E, Fig. 8):** eight sequential runs that add instruction-following data, add [reward shaping](#/glossary/reward-shaping) against responses that fail to terminate, raise rollouts per prompt from 16 to 32 (16 again at the end), and end with about 200 steps at 16k instead of 8k tokens (§3.3). The resets also gave "an opportunity to adjust training hyperparameters and introduce enhancements" (App. E).
- **Analysis (§4):** 256 samples per prompt for the starting, intermediate and final models.

## Results

- **Single try, against the starting model (§3, Tabs. 1–3):** gains of +15.7 points on math, +14.4 on code, +25.9 on GPQA, +22.0 on IFEval and +54.8 on Reasoning Gym (averages; logic and IFEval are average rewards).
- **Against the 7B model and specialized models (§3.4):** "comparable or even better performance across multiple domains" than DeepSeek-R1-Distill-Qwen-7B, and pass@1 above DeepScaleR-1.5B on math (+4.6) and DeepCoder-1.5B on code (+6.5). The authors call the model "the world's best 1.5B reasoning model" (§1).
- **OOD tasks (Tab. 3):** average reward on acre 5.99 → 58.57, boxnet 0.00 → 7.91 and game_of_life_halting 3.49 → 52.29, starting model → final. On boxnet the starting model "exhibits no capability of solving the task", and the final model beats the intermediate one at every k (§4.3, Fig. 5).
- **Weaker start, larger gain (§4.1, Fig. 3 left):** a "significant negative correlation" between the starting model's pass@128 and its gain; tasks it already does well "tend to exhibit minimal or even negative gains". "Tasks with minimal gains post-RL highlighted in the circle tend to have a lower creativity index, indicating higher overlap with pretraining data" (Fig. 3 right).
- **Three patterns (§4.2, Fig. 4):** Diminish: "In some benchmarks (particularly in the math domain)" the final model shows decreased or unchanged reasoning capacity; "Although pass@1 improves, the pass@128 score, which reflects broader reasoning ability, often declines." Plateau: gains are "largely achieved early in training", and the final checkpoint offers "negligible additional benefit". Sustained: on "some benchmarks, particularly more complex ones such as coding", reasoning capacity keeps improving with prolonged training. The abstract states that RL-trained models "consistently outperform base models across a wide range of pass@k evaluations". §1 reports tasks where the starting model fails at any number of samples while the RL model "achieves 100% pass rates" (Fig. 4).
- **Harder instances (§4.3, Fig. 6):** on graph_color, trained on 10-node graphs and tested on larger ones, the final model "maintains significantly higher accuracy across all graph sizes".
- **Over training (§3.3, §4.4, Figs. 1–2, 7):** validation pass@1 and pass@16 "consistently improved and scaled with increased training computation" (§3.3), unlike the pass@k decline Dang et al. observed (§4.4); §1 calls the 2k steps "unprecedented". Pass@1 distributions shift right (Fig. 7). The abstract links boundary gains to "training duration".

## Limits the authors state

- Compute: extended RL "requires substantial computational resources, which may be prohibitive for smaller organizations" (App. A).
- Scale: "it remains unclear how well our approach scales to larger models" (App. A).
- Resets: they add complexity "and may lead to inconsistent results compared to more stable training methods" (App. A).
- Task scope: the training data is "only a subset of possible reasoning tasks", and "we cannot guarantee similar improvements across all potential reasoning domains not explicitly included in our training or evaluation" (App. A).
- On harder Reasoning Gym categories (arc, code, cognition, games) "the model often fails to make meaningful progress" (App. F.1, Tab. 5).
- Pass@k uses a random 18 of 96 Reasoning Gym tasks because of compute (§4, App. F.2).

## Open problems and building blocks

- **Open:** the weak Reasoning Gym categories "may require additional finetuning data to better support model from a cold start", left to future work (App. F.1). Combining ProRL "with explicit value alignment approaches" and building "dynamic evaluation benchmarks that evolve alongside model capabilities" (App. B).
- **Released:** model weights (abstract). No code is stated.
- **To reuse it:** per-domain verifiers (App. D); the verl RL library; four 8-GPU H100 nodes, about 16k GPU hours (§3.2); hyperparameters in §3.2, the recipe in App. E.
- **Beyond its domain:** the authors write that sustained gains on low-starting tasks create "opportunities to address reasoning challenges in critical domains like healthcare, climate science, and accessibility technologies" (App. B).

## On this site

- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/rlvr-general">rlvr-general</a><a class="tag sub" href="#/tags/scaling-general">scaling-general</a></span>
