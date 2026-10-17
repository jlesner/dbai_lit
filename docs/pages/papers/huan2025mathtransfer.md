# Does Math Reasoning Improve General LLM Capabilities? Understanding Transferability of LLM Reasoning

**Does Math Reasoning Improve…** · preprint 2025

Read: [PDF](https://arxiv.org/pdf/2507.00432) · [arXiv](https://arxiv.org/abs/2507.00432)  
Code: [Transferability-of-LLM-Reasoning](https://github.com/ReasoningTransfer/Transferability-of-LLM-Reasoning)

<p class="notice">A summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Asks whether math-reasoning gains carry over to other reasoning tasks (science, coding, planning, medical questions) and to non-reasoning ones (conversational QA, instruction following, hallucination detection, temporal common sense); the authors report that "most models that succeed in math fail to transfer their gains to other domains" (abstract) and name the fine-tuning paradigm, RL or SFT, as the factor that "consistently predicts transferability" (§1).
- An audit of open reasoning models with a Transferability Index (a group's gain over the base model relative to the math gain, §2.1), then a controlled study: Qwen3-14B-Base trained on the same 47K math problems by SFT on Qwen3-32B traces kept by rejection sampling, or by GRPO with an answer-correctness reward (§2.2, App. A.3); PCA of hidden states and KL and token-rank shifts against the base model (§3–§4); an ablation of on- or off-policy sampling, advantage weighting and the KL term on Qwen3-8B-Base (§5).
- Evidence, from trained weights, on whether RL on math answers that a program checks helps or harms other tasks, reasoning and non-reasoning: in its controlled study the RL model's non-reasoning average ends above the base model's while both SFT models' end below it (Tab. 1), and the authors name the sampling distribution (on- or off-policy) as the most important factor in RL's transfer (§6).

## In plain words

As math leaderboards improve week by week, the authors ask whether these gains "reflect broader problem-solving ability or just narrow overfitting" (abstract). They test over 20 open-weight reasoning models on math, on other reasoning tasks (science questions, coding, planning, medical exams) and on tasks that "do not require extensive reasoning" (§1) (e.g. conversation, following instructions, spotting hallucinations), and report that "most models that succeed in math fail to transfer their gains to other domains" (abstract). One factor stands out: models trained by reinforcement learning (RL) generalize to non-math tasks much better than models trained by supervised fine-tuning (SFT) on fixed sets of worked solutions (§1). The SFT models "often show signs of catastrophic forgetting" (losing skills they had) (§1). In a controlled study they train one base model, Qwen3-14B-Base (an open model before any instruction tuning), on the same 47K math problems both ways: on the little-reasoning tasks, the RL model's average rises from the base model's 45.7 to 53.2, while the two SFT models fall to 21.1 and 29.0 (Tab. 1). Analyses of internal activations and output probabilities show SFT drifting much further from the base model (abstract). The paper presents itself as a measurement and diagnosis study with a new transfer metric (§1).

## Background and terms

**Terms to know:** [reinforcement learning](#/glossary/reinforcement-learning) · [GRPO](#/glossary/grpo) · [rejection sampling](#/glossary/rejection-sampling) · [Distillation into compact models](#/glossary/distillation) · [catastrophic forgetting](#/glossary/catastrophic-forgetting) · [off-policy learning](#/glossary/off-policy-learning) · [KL divergence](#/glossary/kl-divergence) · [KL penalty](#/glossary/kl-penalty) · [principal component analysis (PCA)](#/glossary/principal-component-analysis-pca) (used without definition, §3.1)

In the glossary's terms, the authors' RL setup, GRPO with "answer correctness as the reward signal" (App. A.3.1), is a form of [RL with verifiable rewards](#/glossary/rl-with-verifiable-rewards-rlvr); the paper doesn't use that name.

**The paper's own terms:**
- **The three benchmark groups** (§2.1, App. A.3.4): *math reasoning*: MATH500 (500 problems from the MATH dataset), AIME24 and AIME25 (30 problems each from the American Invitational Mathematics Examination) and OlympiadBench (olympiad problems, English math only); *other reasoning*: GPQA-Diamond (graduate-level science multiple choice), LiveCodeBench version 2 (coding), ACPBench (multiple-choice questions on classical planning) and HeadQA (healthcare exam questions); *non-reasoning*: CoQA (conversational question answering over passages), IFEval (prompts with verifiable instructions), HaluEval (telling facts from hallucinations) and MC-TACO (temporal common sense). All are scored by accuracy.
- **Transferability Index (TI)** (§2.1): for each benchmark, the model's gain over its base model, divided by the spread of gains within its group, compressed by a signed square root and weighted toward benchmarks where the base model scores low, gives a group index; TI for the other-reasoning or non-reasoning group is that group's index divided by the math index, times 100. A positive TI means positive transfer (§2.1); a negative one, "performance degradation" (Fig. 2).
- **UniReason** (§2.2): the authors' name for their controlled-study models fine-tuned from Qwen3-14B-Base.
- **think / no-think** (App. A.3.3; Tab. 1): Qwen3 prompting modes with or without explicit chain of thought; the two SFT models are trained on data distilled from Qwen3-32B in thinking or in non-thinking mode.
- **PCA shift** (§3.1–§3.2): hidden states (the model's internal activations) at each layer are projected onto their first two principal components; the shift is the change in the mean projection on the first component after training, with the mean on the second reported directly. Averaging over layers gives a "representation center", and the reported distance is how far it moved from the base model's.
- **Token rank shift** (§4.1): tokens generated by the fine-tuned model are re-scored by the base model, and the shift is the difference in each token's rank between the two models.
- **The four levers** (§5): *sampling distribution* (off-policy SFT trains on a fixed dataset, on-policy RL samples from the current model); *credit assignment* (uniform weights versus advantage-weighted updates "that emphasize task-salient tokens"); *KL regularization* (a penalty for moving away from a reference model); *negative gradient* (RL also learns from wrong samples, SFT only imitates correct ones).
- **On-policy SFT and off-policy RL** (§5.2, Tab. 3): the two hybrid settings of the ablation. On-policy SFT lets the model being trained generate the responses, filtered by rejection sampling; off-policy RL scores 8 Qwen3-32B responses per query with GRPO's objective and uses the highest-reward one for the update.

**Missing glossary terms:** none.

**Builds on:**
- GRPO from Shao et al. (2024) ([DeepSeekMath](#/papers/shao2024deepseekmath "DeepSeekMath: Pushing the Limits of Mathematical Reasoning in Open Language Models (2024)")), used for the RL model (§1; App. A.3.1).
- Training problems from the math training sets of DeepScaleR (Luo et al., 2025) and SimpleRL (Zeng et al., 2025), with chain-of-thought targets from Qwen3-32B-Instruct (App. A.3.2).
- PCA-shift analysis from Xu et al. (2025a) and Zheng et al. (2025) (§3), and token-rank analysis from Li et al. (2025c) and Lin et al. (2023) (§4.1).
- General-Reasoner (Ma et al., 2025), an RL-trained model whose broader data the authors distill into an SFT counterpart for a second controlled pair (App. A.3.3).

## Problem and setting

- **Question:** "Do improved math reasoning abilities transfer to general LLM capabilities?" (§1), to other reasoning domains and to tasks "that do not require extensive reasoning".
- **Models:** an audit of off-the-shelf models from 1.5B to 32B parameters, both SFT-trained (e.g. DeepSeek-R1-Distill-Qwen-7B, OpenThinker, s1.1, LIMO) and RL-trained (e.g. SimpleRL-Zoo models, DAPO-Qwen-32B, General-Reasoner), each compared with its own base model (Tab. 5); the controlled study on Qwen3-14B-Base (§2.2); the ablation on Qwen3-8B-Base (§5.2).
- **Data:** a curated set of 47K math problems, lower-difficulty ones from DeepScaleR and level 3–5 ones from SimpleRL (App. A.3.2). SFT targets are teacher traces kept by rejection sampling; RL uses only the answers (§2.2).
- **What "correct" means:** accuracy per benchmark; AIME scores average 10 samples, GPQA-Diamond, LiveCodeBench and MATH500 average 3 at temperature 0.6 and [top-p](#/glossary/top-k-and-nucleus-top-p-sampling) 0.95, and OlympiadBench, ACPBench, HeadQA, CoQA, HaluEval and IFEval use one [greedy](#/glossary/greedy-decoding-and-temperature-sampling) sample; IFEval uses strict instruction accuracy (App. A.3.5). Evaluation runs on lm-evaluation-harness and Evalchemy, two open evaluation toolkits (App. A.3.5).

## Approach

1. **Audit** (§2.1): score each model and its base on the twelve benchmarks and compute TI per model (Fig. 2, Tab. 5).
2. **Controlled study** (§2.2; App. A.3.1): from Qwen3-14B-Base, (i) SFT with the LLaMA-Factory fine-tuning framework on the teacher traces, think or no-think, for 1.5 epochs "to align with our RL settings"; (ii) GRPO in the Verl RL framework with 16 rollouts per prompt, responses up to 16k tokens, KL and [entropy](#/glossary/policy-entropy) penalties turned off, 140 steps.
3. **Latent-space diagnosis** (§3): PCA shift between each fine-tuned model and its base, per benchmark group (Tab. 2, Fig. 3; audit models in App. A.4).
4. **Token-space diagnosis** (§4): KL divergence of output distributions from the base model, token rank shift, and a case study listing which tokens moved (Tab. 8).
5. **Ablation** (§5): a unified loss (Eq. 3) that covers SFT (Eq. 1) and RL (Eq. 2) by choosing the sampling distribution, the per-sample weight and the KL coefficient; five settings from off-policy SFT to on-policy RL with KL (Tab. 3) on Qwen3-8B-Base.

## Results

All are the authors' claims.

- **Audit** (§2.1, Fig. 2, Tab. 5): "RL–tuned models consistently achieve higher indices on both other–reasoning and non–reasoning tasks, whereas SFT–trained models often yield negative" non-reasoning TI. A second controlled pair, General-Reasoner trained by RL against an SFT copy on its distilled data, shows the same direction (App. A.3.3, Tab. 5).
- **Controlled study** (§2.2, Tab. 1): the RL model's math average is 53.8 against 49.8 (SFT, think), 32.3 (SFT, no-think) and 27.7 (base), and on non-reasoning it reaches 53.2 against 21.1, 29.0 and 45.7. On other reasoning RL beats both SFT models on GPQA, LiveCodeBench and HeadQA but not ACPBench. Only the RL model has positive TI on both groups; both SFT models have negative non-reasoning TI. The SFT models "stagnate or decline" on non-reasoning while the RL model exceeds the base "in nearly all the benchmarks".
- **Latent space** (§3.2, Tab. 2, Fig. 3): the RL model has the smallest PCA shift on all three groups, e.g. 36.9 on non-reasoning against 113.7 (SFT, no-think). Across the audit, RL models shift less than SFT models, and going from 7B to 32B reduces the shift (App. A.4, Tab. 6).
- **Token space** (§4.2, Fig. 4): the no-think SFT model's KL divergence from the base is 0.372 on MATH-500 and 0.283 on IFEval, against 0.084 and 0.019 for the RL model. Average token rank shift is 0.98 positions for the RL model against 10.6 for the no-think SFT model (Fig. 17). In the case study, RL moves a handful of task-relevant tokens while SFT moves far more, "including many that are query-irrelevant and often inject reasoning markers into non-reasoning prompts" (§4.2; Tab. 8, Fig. 5).
- **Ablation** (§5.2, Tab. 4): non-reasoning TI is −40.5 for off-policy SFT, 30.2 for on-policy SFT, 4.5 for off-policy RL and 32.4 for on-policy RL with KL. The authors conclude that "on-policy methods consistently transfer better than off-policy methods", that adding credit assignment and negative gradients "not only improves transferability but also increases response length" (Fig. 14), and that on-policy RL "remains largely unchanged with or without KL regularization". Their conclusion names the sampling distribution "the most important factor" (§6).
- **Training dynamics** (App. A.5.1, Tab. 7, Fig. 13): for the 14B models, RL shows gentler early updates and less oscillation in gradient norm than SFT, which "tends to quickly saturate".

## Limits the authors state

No limitations section. Caveats in the text:
- Why on-policy training transfers better is offered as "One possible explanation": it trains on data from the model's own evolving policy, reducing distribution mismatch (§5.2).
- The small effect of the KL term is explained with "One possible reason": on-policy RL already keeps updates close to the model's own distribution (§5.2).

## Open problems and building blocks

- **Open** (§6): "exploring hybrid recipes to further optimize the trade-off between reasoning and non-reasoning tasks", extended beyond math to "more reasoning domains"; "adaptive regularization strategies that account for backbone architecture and size"; and "more comprehensive tools to evaluate transferability in multi-modal, long-context, and interactive generation settings".
- **Released:** Nothing stated.
- **To reuse it:** the paper states Verl with GRPO (learning rate 1×10⁻⁶, batch 512, [clipping thresholds](#/glossary/importance-ratio-and-clipping) "between 0.22 and 0.28", mini-batches of 128) and LLaMA-Factory for SFT (learning rate 5×10⁻⁵, batch 512) (App. A.3.1); teacher traces from Qwen3-32B with rejection sampling (App. A.3.2); and the two evaluation toolkits (App. A.3.5). No hardware or run time stated.

## On this site

- **Discussed in:** [Gains made against a checker, carried beyond it](#/challenges/transfer_beyond_the_checker)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/rlvr-general">rlvr-general</a></span>
