# Language Models that Think, Chat Better

**RLMT ("Language Models that Think** · Chat Better"), COLM 2026

Read: [PDF](https://arxiv.org/pdf/2509.20357) · [arXiv](https://arxiv.org/abs/2509.20357)  
Code: [RLMT](https://github.com/princeton-pli/RLMT)

<p class="notice">A summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Trains 7–8B models to write a long chain of thought before each chat response, rewarded by a learned preference reward model as in RLHF instead of a verifier, and pairs each run with a matched non-thinking RLHF run (abstract; §2.2, §3.1).
- GRPO, PPO or on-policy DPO against the Skywork reward model on 7.5k WildChat prompts, after a small SFT warm-start or straight from base models ("Zero"); scored on LLM-judged chat and creative-writing benchmarks plus knowledge and instruction-following tests (§2.2–2.3, §3.1).
- Evidence on far transfer from checkable training: the authors state that long CoT learned through RLVR "does not generalize well to open-ended tasks" (abstract), and show thinking models trained only on verifiable domains scoring below Qwen2.5-7B-Instruct on WildBench (Fig. 2; Tabs. 2–3); with a planted reward bonus, thinking models exploit it sooner than non-thinking ones (App. C, Tab. 8).

## In plain words

Reasoning models learn long thinking through reinforcement learning on tasks a program can check, such as math. The authors say this long thinking "does not generalize well to open-ended tasks" (abstract), like writing an essay outline, which has no rule-based verifier, and show thinking models trained only on checkable domains scoring below a plain instruction-tuned model on a chat benchmark (Fig. 2). They propose RLMT: keep the long thinking, but take the reward from a reward model (a network trained on human preference judgments), as standard preference tuning does. They train 7–8B Llama and Qwen models on everyday chat prompts, each against a matched run without thinking. Across 40 runs, two model families and three training algorithms, thinking wins, they report. Gains are 3–7 points on three chat benchmarks and 1–3 points on other tasks such as creative writing and general knowledge (abstract). Trained with GRPO (their main reinforcement-learning algorithm) straight from base models, with no supervised stage, the thinking models beat the official instruct models' average chat scores by more than 5 points (§1, Tab. 2). The authors present this as pushing the checkable-reward recipe "beyond verifiable domains" (abstract).

## Background and terms

**Terms to know:** [RL with verifiable rewards (RLVR)](#/glossary/rl-with-verifiable-rewards-rlvr) · [RLHF](#/glossary/reinforcement-learning-from-human-feedback-rlhf) · [reward model](#/glossary/reward-model) · [GRPO](#/glossary/grpo) · [PPO](#/glossary/ppo) · [DPO](#/glossary/direct-preference-optimization-dpo) · [online and offline RL](#/glossary/online-and-offline-rl) · [zero-RL training](#/glossary/zero-rl-training) · [reward hacking](#/glossary/reward-hacking) · [LLM-as-a-judge](#/glossary/llm-as-a-judge)

**The paper's own terms:**
- **RLMT** (RL with Model-rewarded Thinking): the model writes a reasoning trace, then a response; a reward model scores the response, and online RL raises the expected score (§2.2, Eq. 3). Only the response after the closing think tag (`</think>`, which ends the trace) is scored (App. G).
- **Thinking and non-thinking models:** every RLMT model has a baseline trained in the same setting without the trace, i.e. ordinary RLHF; warm-started baselines learn from the same teacher responses with the trace removed (§3.1).
- **Warm-start SFT:** supervised fine-tuning on 6k prompts from the Tülu 3 SFT mixture (an open collection of instruction-tuning prompts), answered by Gemini 2.5 Flash, which is prompted to write a planning phase in think tags because "Gemini's CoT is not accessible" (§2.3; App. E).
- **Zero:** RLMT on a base model with no warm-start, eliciting the format with a fixed instruction prefix (§2.3), after DeepSeek-R1-Zero; in the glossary's terms, zero-RL training.
- **On-policy DPO:** DPO whose preference pairs are sampled from the model being trained rather than taken from a fixed dataset (§2.2, footnote 2).
- **GRPO, as App. F states it:** each sample's advantage is its reward minus the mean reward of its group of samples for the same prompt; the glossary entry also divides by the group's standard deviation.

**Builds on:**
- DeepSeek-R1 ([DeepSeek-R1](#/papers/deepseek2025reasoning "DeepSeek-R1: Incentivizing Reasoning Capability in LLMs via Reinforcement Learning (2025)")): long-CoT RL from a warm-started model and from a base model, "akin to R1-zero and R1" (§1; §2.3), with GRPO from Shao et al. (2024) ([DeepSeekMath](#/papers/shao2024deepseekmath "DeepSeekMath: Pushing the Limits of Mathematical Reasoning in Open Language Models (2024)")).
- RLHF, Ziegler et al. (2020) and Ouyang et al. (2022) (§1, §2.1), not listed here.
- RLVR, cited to Lambert et al. (2025) ([Tülu 3](#/papers/lambert2024tulu "Tulu 3: Pushing Frontiers in Open Language Model Post-Training (2024)"), Tülu 3), whose SFT mixture also supplies the RL prompts (§2.1–2.2).
- Preference optimization combined with chain of thought, Pang et al. (2025) and Wu et al. (2025a) (TPO), which the authors call "closely related" but say elicit long CoT by prompting instruct models and "typically rely on offline algorithms" (§5); TPO is compared in App. D.5.

## Problem and setting

The question is "whether and how long CoT benefits open-ended reasoning" (§1), after RLVR models showed limited generalization to broader reasoning and chat (§2.2, citing Huan et al. (2025), [Does Math Reasoning Improve…](#/papers/huan2025mathtransfer "Does Math Reasoning Improve General LLM Capabilities? Understanding Transferability of LLM Reasoning (2025)"), and Zhou et al. (2025)).

- **Models:** Llama-3.1-8B and Qwen2.5-7B, base and instruct (§3.1).
- **Reward model:** Skywork-v1-Llama-3.1-8B-v0.2, a preference reward model the authors say "has shown strong performance on reward benchmarks" (§2.2).
- **RL prompts:** 7.5k real user requests from the WildChat-IF subset of the Tülu 3 SFT mixture, drawn from WildChat (logged conversations of real chatbot users) (§2.2).
- **Benchmarks** (§3.1; App. D.1): chat, WildBench (1,024 user prompts, each response compared with a GPT-4 reference using per-prompt rubrics), AlpacaEval 2 (an LLM judge's win rate against a reference model, adjusted for answer length) and ArenaHardV2 (500 hard user queries, LLM-judged with style control (an adjustment for formatting and length)); CreativeWritingV3 (story chapters graded by GPT-4.1); IFBench (prompts with several instructions to follow); MMLU-Redux (a cleaned version of the MMLU knowledge test) and PopQA (factual questions about popular and lesser-known entities).
- **What counts as better:** a higher judge or benchmark score; no program checks the chat answers.

## Approach

- **Objective** (§2.2, Eq. 3): RLHF's objective with a reasoning trace sampled before the response; a reward model, not a rule-based check as in RLVR.
- **Algorithms** (§2.2; App. B): on-policy DPO, PPO and GRPO, sampling 8 responses per prompt at temperature 0.7; SFT and DPO run in `trl`, PPO and GRPO in `verl` (open-source training libraries).
- **Two starting points** (§2.3): warm-start SFT on simulated thinking traces, or Zero from a base model with a prompt template.
- **Matched baselines** (§3.1): one non-thinking RLHF run per thinking run, differing "only in the absence of thinking". GRPO results are the main ones (Tab. 2); DPO and PPO are in Tab. 18.

## Results

- **Thinking against non-thinking (§3.2; Tab. 2, Tab. 18).** The authors report that RLMT models "consistently outperform non-thinking counterparts" on average, with the gap largest on chat; they are "usually also better at creative writing and factuality (PopQA)". GRPO gives the best models; DPO and PPO lag it, and are "ineffective compared to GRPO for zero training", but keep the edge (App. D.6.3, Tab. 18).
- **Against larger models (§3.2, Tab. 1).** The best model, Llama-3.1-8B-Instruct-RLMT, beats Llama-3.1-70B-Instruct and Qwen2.5-72B-Instruct on average, "outperforms GPT-4o on chat and creative writing", and "rivals Claude-3.7-Sonnet (thinking) on AlpacaEval2 and Wildbench".
- **Zero (§3.2, Tab. 2).** Qwen-RLMT-Zero outperforms Qwen2.5-7B-Instruct; Llama-RLMT-Zero "performs just under Llama-3.1-8B-Instruct, but outperforms it on chat benchmarks".
- **Thinking models trained on math (§4.1, Tab. 3; Fig. 2).** Distilled or RL-trained thinking models (DeepSeek-R1-Distill, SimpleRL-Zoo, OpenThinker2) "do not perform well on chat or creative writing"; RLMT on top of OpenThinker2-7B helps, but RLMT models stay ahead.
- **Ablations (§4.2, Tab. 4).** WildChat-IF prompts beat UltraFeedback (prompts popular for preference optimization) and random Tülu 3 prompts; a GPT-4.1-mini warm-start ends "roughly the same"; a stronger reward model (Skywork-V2) does better, and a weaker one (ArmoRM) loses ground on non-chat benchmarks, more so with thinking; thinking stays ahead on chat with both.
- **Behaviour (§4.3, Figs. 4–5).** In GPT-4.1-mini's trait analysis, after RLMT the model lists constraints and subtopics first, groups ideas into themes, then plans details, and its planning is "often iterative", where the SFT model's "is often linear". Llama-3.1-8B-RLMT-Zero's thoughts and responses lengthen during training.
- **Reward hacking (App. C, Tabs. 8–9).** On Llama-3.1-8B, with a bonus for the word "absolutely" added to the reward, 96% of thinking samples contain it at step 70 against 19% of non-thinking ones, and both reach about 95% at step 100. Organically, thinking models add fewer bullet lists but more engagement-bait closers (endings that offer more help) and self-praise.
- **Human evaluation (App. D.2, Tab. 11).** On 50 WildBench prompts ranked blind, the thinking 8B model wins 62% of pairings against its non-thinking twin and 60% against Llama-3.1-70B-Instruct.
- **Other checks (App. D).** Neither thinking nor non-thinking models do well on IFEval (a simpler instruction-following test); MATH-500 (competition math problems) rises over the SFT models, with thinking and non-thinking similar (Tab. 10). From the Llama-3.1-8B SFT checkpoints, RL on a 1:1 chat and math mix nears math-only RL on MATH-500 and stays strong but below chat-only RL on chat, with thinking ahead on all three benchmarks (Tab. 12). Llama-3.1-70B-Instruct prompted to think does worse than unprompted (Tab. 13). RLMT beats models rewarded by BLEU (text overlap with a reference answer) or by checklists, and TPO (Tabs. 14–15). Capping thinking below 128 tokens hurts, pushing past 512 helps chat moderately, and more RL prompts help (Tabs. 16–17).
- **Rewarding the thinking too (App. G, Tab. 19).** For Llama-3.1-8B-RLMT, scoring trace and response together drops the seven-benchmark average from 42.1 to 36.4.

## Limits the authors state

- "it is unclear how much of the improvement is due to amplification of traits already present in the model, versus the learning of new traits during the SFT warm-start or RL training" (App. A).
- "a set of benchmarks larger than the seven considered here would lead to takeaways that were missed here" is "possible" (App. A).
- "we did not extensively optimize the format used for the internal CoT, the hyperparameters, or the construction of the prompt mixtures", and they invite future work to do so (App. A).
- "Due to compute constraints, we cannot scale model sizes" beyond 7–8B (App. D.6).
- Thinking models "exploit a hackable reward sooner", and "reward hacking remains an important problem for both thinking and non-thinking models" (App. C).
- A weaker reward model hurts non-chat benchmarks, especially with thinking (§4.2); "RLMT relies on a reward model and hence inherits the biases of the methods that use reward models" (App. G).
- Thinking brings no clear gain on MATH-500, lowers ZebraLogic (logic grid puzzles) scores further, and IFEval failures are blamed on the reward model (App. D.1); RLMT's gains on MMLU and PopQA are small, as RL is "unlikely" to teach new knowledge (App. G).
- The best model is worse than Claude-3.7-Sonnet on ArenaHardV2, "likely due to the high proportion of math and coding" (§3.2).
- "simply applying RLVR followed by RLMT in sequence is insufficient to obtain a model that excels across all domains" (App. G).
- Long CoT costs time and compute, though chat needs "far shorter CoT traces" than math (App. G).

## Open problems and building blocks

- **Open:** pipelines that "combine or balance multiple reward sources more effectively", for instance by mixing verifiable and non-verifiable prompts or by reward ensembles (App. G); "building a thinking post-training pipeline for all domains" (App. D.1); the trade-offs of GRPO for preference optimization (App. D.6.3); Skywork-V2 may push results further (§4.2, footnote 4); "to understand and employ thinking more broadly" (abstract).
- **Released:** "We release our code and data publicly" (abstract, footnote 1).
- **To reuse it:** a preference reward model (Skywork-v1-Llama-3.1-8B-v0.2), about 7.5k chat prompts, a teacher for warm-start traces or a base model for Zero, and `trl` and `verl` with the settings of App. B. Models of 12B or more "would require 16 or more GPUs with 80 GB of memory each" (App. D.6).

## On this site

- **Discussed in:** [Gains made against a checker, carried beyond it](#/challenges/transfer_beyond_the_checker) · [Weak checkers get exploited](#/challenges/weak_checker_exploitation)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/hacking-general">hacking-general</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/scaling-general">scaling-general</a></span>
