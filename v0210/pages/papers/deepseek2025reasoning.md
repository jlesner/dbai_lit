# DeepSeek-R1: Incentivizing Reasoning Capability in LLMs via Reinforcement Learning

**DeepSeek-R1** · Nature 645 (2025)

Read: [PDF](https://arxiv.org/pdf/2501.12948) · [arXiv](https://arxiv.org/abs/2501.12948) · [DOI](https://doi.org/10.1038/s41586-025-09422-z)  
Code: [DeepSeek-R1](https://github.com/deepseek-ai/DeepSeek-R1)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Reasoning learned by RL with rule-based rewards (accuracy and format), starting without SFT (R1-Zero).
- GRPO at scale, then Distillation into compact models into small models.
- Rule-based (verifiable) rewards as the route to reasoning models; the authors name "hard reasoning questions, a reliable verifier, and sufficient computational resources" as the key (§6).

## In plain words

Language models solve hard problems better when they write out intermediate reasoning, but teaching them to do so has relied on human-written reasoning examples, which the authors say limit scale, add human biases and cap the model at human-style reasoning (§1). They train DeepSeek's large pre-trained model with [reinforcement learning](#/glossary/reinforcement-learning) alone: it answers math, coding and logic questions, and the reward checks only the final answer and the output format (§2). The resulting model, DeepSeek-R1-Zero, learns to write longer answers that check and revise their own steps (§2). On the AIME 2024 math competition its average accuracy per attempt rose from 15.6% to 77.9% over training (§2). Because its text was hard to read and mixed languages, the authors add supervised fine-tuning and more RL to train DeepSeek-R1, which they report on par with OpenAI's o1-1217 reasoning model on math (App. D). They also fine-tune smaller open models on generated reasoning (App. F). They present the work as showing that reasoning can be "incentivized through pure reinforcement learning" (abstract).

## Background and terms

**Terms to know:** [GRPO](#/glossary/grpo) · [RL with verifiable rewards](#/glossary/rl-with-verifiable-rewards-rlvr) · [outcome and process rewards](#/glossary/outcome-and-process-rewards) · [reward hacking](#/glossary/reward-hacking) · [KL penalty](#/glossary/kl-penalty) · [Distillation into compact models](#/glossary/distillation) · [pass@k](#/glossary/passk) · [self-consistency](#/glossary/self-consistency-majority-voting) · [Mixture-of-Experts (MoE)](#/glossary/mixture-of-experts-moe) · [rejection sampling](#/glossary/rejection-sampling) (App. B.3.3) · [MCTS](#/glossary/monte-carlo-tree-search-mcts) (here guided by a value model that rates each partial answer, App. G.2)

**The paper's own terms:**
- **Rule-based reward**: an accuracy reward (1 if the final answer matches the reference or the code passes the test cases, else 0) plus a format reward for reasoning inside `<think>` tags, with equal weight (§2.2, Eq. 4; App. B.3.1); the glossary's verifiable reward.
- **Reward model (RM)**, two senses: a trained scorer, used only on general prompts, one for helpfulness (trained on preference pairs judged by DeepSeek-V3) and one for safety (§3.1); and the rule-based checker, which §6 calls a "rule-based reward model".
- **Cold-start data**: thousands of long, first-person chains of thought made from R1-Zero outputs with correct answers, rewritten by DeepSeek-V3 and checked by people; the first fine-tuning data of R1 (§3; App. B.3.2).
- **Language consistency reward**: the share of chain-of-thought words in the target language (§3.2.1, Eq. 7).
- **Dev1, Dev2, Dev3**: intermediate checkpoints of R1 (Fig. 2).
- **pass@1, cons@k**: mean correctness over k samples per question at temperature 0.6; accuracy of the majority answer over k samples (App. D.1).
- **Risk control system**: DeepSeek's service filter, in which DeepSeek-V3 reviews keyword-flagged conversations and can retract answers (App. D.3.1).

**Builds on:**
- GRPO from DeepSeekMath ([DeepSeekMath](#/papers/shao2024deepseekmath "DeepSeekMath: Pushing the Limits of Mathematical Reasoning in Open Language Models (2024)")), "originally proposed to simplify the training process and reduce the resource consumption" of [PPO](#/glossary/ppo) (§2.1).
- DeepSeek-V3-Base, the pre-trained starting point, and DeepSeek-V3, its instruction-tuned version, whose fine-tuning data and reward-model pipeline R1 reuses (§1, §3.1; App. A.1).
- The usual post-training, supervised fine-tuning then RL from human preferences (InstructGPT), whose fine-tuning stage R1-Zero skips (App. A.2, H.3).
- Inference-time scaling: self-consistency ([Self-Consistency](#/papers/wang2022selfconsistency "Self-Consistency Improves Chain of Thought Reasoning in Language Models (2023)")), process reward models ([Let's Verify Step by Step](#/papers/lightman2023verify "Let's Verify Step by Step (2023)")), tree search; the authors instead use RL "to incentivize enhanced in-context search abilities" (App. H.2).

## Problem and setting

- **Question:** can a model learn to reason through RL that checks only final answers, without human-labelled reasoning traces, and can the result be made readable and passed to smaller models (§1)?
- **Base model:** DeepSeek-V3-Base, pre-trained on web pages and e-books, mostly Chinese and English; the authors note some pages "contain a significant number of OpenAI-model-generated answers" (App. A.1).
- **What counts as correct:** RL prompts are math (answers matched to a reference; proofs excluded "because it is difficult to determine their correctness"), code (test cases; bug fixes with unit tests), STEM multiple choice and logic puzzles (App. B.3.1, Tab. 4).
- **Evaluation:** outputs up to 32,768 tokens; math (AIME 2024, MATH-500, the Chinese olympiad CNMO 2024), code (LiveCodeBench competition problems, Codeforces ratings against humans, SWE-bench Verified GitHub issues, Aider-Polyglot), knowledge (MMLU, GPQA Diamond, PhD-level science questions) and chat benchmarks judged by GPT-4-Turbo (AlpacaEval 2.0, ArenaHard); baselines Claude-3.5-Sonnet, GPT-4o, DeepSeek-V3, OpenAI o1-mini and o1-1217 (App. D.1).
- **Contamination:** training data filtered by 10-word overlap with test questions (App. D.1).

## Approach

- **R1-Zero (§2):** GRPO on DeepSeek-V3-Base with no fine-tuning first. A template asks for reasoning in `<think>` tags, then the answer (Tab. 1). Per question GRPO samples 16 outputs and reinforces each by how far its reward lies above the group mean, in group standard deviations; it needs no value model and adds a KL penalty toward a reference model reset every 400 steps (§2.1, Eq. 1–3; App. A.3). Output length is capped at 32,768 tokens, then 65,536 from step 8.2k, over 10,400 steps (§2.1).
- **No learned reward for reasoning:** trained reward models are "susceptible to reward hacking during large-scale reinforcement learning" (§2.2).
  1. fine-tune V3-Base on cold-start data (Dev1);
  2. RL with rule-based and language-consistency rewards, a GRPO clip ratio, the bound on how far one update may move an output's probability, of 10 (Dev2; §3.2.1);
  3. rejection sampling from Dev2 gives about 600k reasoning samples, some judged by DeepSeek-V3 against the reference ([LLM-as-a-judge](#/glossary/llm-as-a-judge)), plus about 200k non-reasoning samples partly reused from DeepSeek-V3; V3-Base is fine-tuned on them (Dev3; App. B.3.3);
  4. RL on mixed prompts with rule-based and reward-model rewards for 1,700 steps, preference rewards only in the last 400, since more "may lead to reward hacking" (§3.2.2).
- **Distillation (App. F, B.4.3):** Qwen2.5 (1.5B–32B) and Llama (8B, 70B) models fine-tuned on the same 800k samples, no RL.
- **Baseline RL (App. F.1):** large-scale RL on Qwen2.5-32B-Base with math, code and STEM data for over 10K steps gives Qwen2.5-32B-Zero (settings in App. B.4.1).

## Results

- **R1-Zero (§2.3, Fig. 1):** AIME 2024 pass@1 rises from 15.6% to 77.9%, and to 86.7% with majority voting over 16 samples, which "significantly surpasses the average performance across all human competitors". Responses lengthen, and reflective words such as "wait" grow more frequent, "wait" spiking after step 8,000: the authors' "aha moment" (Tab. 2; App. C.2).
- **Stages (§4, Tab. 3):** Dev1 loses reasoning accuracy, which the authors put down to the small cold-start set; Dev2 gains on code, math and STEM; the last RL stage gains mainly on AlpacaEval 2.0 and ArenaHard.
- **Against other models (App. D.2, Tab. 8):** AIME 2024 pass@1 79.8% against 79.2% for o1-1217 and 9.3% for GPT-4o-0513; math "on par with OpenAI-o1-1217", o1-1217 ahead on Aider-Polyglot.
- **After training (App. E.2, Tab. 13):** on AIME 2025, R1 solves 75% against o1-1217's 80%.
- **Thinking length (App. E.4):** R1 spends more thinking tokens on harder problems; majority voting over 64 samples leaves GPT-4o far below R1 on AIME 2024.
- **Distillation against RL (App. F.1, Tab. 16):** DeepSeek-R1-Distill-Qwen-32B scores 72.6% AIME 2024 pass@1, against 47.0% for Qwen2.5-32B-Zero and 50.0% for the open reasoning model QwQ-32B-Preview; small models trained with their RL "may not even achieve the performance of Distillation into compact models".
- **A pre-o1 base (App. F.1, Tab. 17):** RL on Qwen2-Math-7B, released before OpenAI's first reasoning model, "significantly outperformed" Qwen2-Math-7B-Instruct and GPT-4o.
- **GRPO against PPO (App. A.3, Fig. 4):** on DeepSeek-Coder-V2-Lite, with the default λ of its advantage estimate PPO does considerably worse than GRPO on MATH, and nears it only with λ tuned to 1.0.
- **Reward hacking (App. B.5, Fig. 6):** under the helpful reward model, reward rises while Codeforces performance falls.
- **Safety (§5; App. D.3):** R1's own safety is "at a moderate level", higher with the risk control system.

## Limits the authors state

- **Capabilities (§6):** structured output is "suboptimal compared to existing models"; R1 "cannot leverage tools"; it can mix languages for queries outside Chinese and English; "Few-shot prompting consistently degrades its performance"; software-engineering gains over DeepSeek-V3 are small, since with long evaluation times large-scale RL "has not been applied extensively" there; it still overthinks simple questions.
- **Unreliable rewards (§6):** such tasks get human-annotated data and "only conduct RL for hundreds of steps".
- **Long chains (App. E.4):** they can be "trapped in incorrect logic paths"; AIME 2024 pass@64 is 90.0% against pass@1 79.8%.
- **Contamination (App. D.1):** n-gram filtering "cannot prevent the paraphrase of testset".
- **Cold start (App. B.3.2):** the reasoning patterns "primarily reflect DeepSeek-engineered heuristics".
- **Language consistency reward (§3.2.1):** slightly lowers performance.
- **Base size (App. G.1):** RL from 7B dense and 16B MoE bases "consistently failed to yield meaningful improvements" on AIME.
- **LLM-judged correctness (App. G.1):** "limited generalizability" to open-ended and long-form writing.
- **Safety (§5):** a public model "is also vulnerable to further fine-tuning".
- **Failed attempts (App. G.2):** process reward models and MCTS; the authors add that this "does not imply that these approaches are incapable".

## Open problems and building blocks

  - Without a reliable reward model, "scaling up pure RL methods remains an open challenge" (§6), the bottleneck they name.
  - Tool-augmented reasoning "holds significant promise" (§6).
  - Modelling token budgets in training could widen the token gap between easy and hard questions (App. E.4, a hypothesis).
  - RL on the distilled models, left "to the broader research community" (App. F).
  - Improving through self-search "remains a significant challenge" (App. G.2).
  - Multi-turn fine-tuning data (App. B.3.3).
- **Released:** weights of R1, R1-Zero and six distilled models, plus inference code (§1; App. I); the paper also says it releases its supervised fine-tuning (SFT) and RL data (App. I).
- **To reuse it:** a large base model (App. G.1); 147K H800 GPU hours in all, about $294K (App. B.4.4, Tab. 7); a reward module with code executor and answer matcher (App. B.1); questions with checkable answers; 16 H800 GPUs to serve R1 (App. I).
- **Beyond its domain:** "any task that can be effectively evaluated by a verifier" (§6); "AI-driven search and data analysis tasks" (App. D.2).

## On this site

- **Discussed in:** [Bringing compact models to frontier accuracy](#/challenges/compact_model_accuracy) · [Weak checkers get exploited](#/challenges/weak_checker_exploitation)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/hacking-general">hacking-general</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/rlvr-general">rlvr-general</a><a class="tag sub" href="#/tags/scaling-general">scaling-general</a></span>
