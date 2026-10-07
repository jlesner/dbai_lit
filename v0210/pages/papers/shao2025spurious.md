# Spurious Rewards: Rethinking Training Signals in RLVR

**Spurious Rewards** · preprint 2025

Read: [PDF](https://arxiv.org/pdf/2506.10947) · [arXiv](https://arxiv.org/abs/2506.10947)  
Code: [Spurious_Rewards](https://github.com/ruixin31/Spurious_Rewards)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- RLVR improves some models even with random or wrong rewards.
- The authors attribute the random-reward gains to a clipping bias in GRPO; the appendix derivation is titled a conjecture (App. B.1), though the abstract says "we show".
- A gain under a reward need not come from the reward, so any loop that trains on its own checker needs random- and format-reward baselines on more than one model family, as the authors recommend (§7).

## In plain words

In reinforcement learning on math, rewarding a model only for answers a program checks as correct is "highly effective", but "the mechanisms underlying these gains remain poorly understood" (§1). The authors swap in weaker rewards: the model's most common answer, any boxed answer, one particular wrong answer, or a coin flip. On the math-tuned Qwen2.5-Math-7B, coin-flip rewards raise accuracy on the MATH-500 test by 21.4 points, against 29.1 with correct-answer rewards (abstract); for other families, such as Llama3 or OLMo2, these rewards "often fail to produce gains" (abstract).

A step that limits how far one update may move each token's probability can amplify behaviors the model already favors from pre-training, even without informative rewards, the authors show (abstract). In their case study on Qwen2.5-Math, answers that write Python and its output without running it rise "from 65% to over 90% with spurious rewards" (abstract). They present this as pushing a nascent hypothesis, that such training at open-source scales draws out abilities already present, "to its limit" (§2.2), and urge testing across model families and against format and random rewards (§7).

## Background and terms

**Terms to know:** [reinforcement learning](#/glossary/reinforcement-learning) · [RL with verifiable rewards (RLVR)](#/glossary/rl-with-verifiable-rewards-rlvr) · [GRPO](#/glossary/grpo) · [PPO](#/glossary/ppo) · [KL penalty](#/glossary/kl-penalty) · [self-consistency (majority voting)](#/glossary/self-consistency-majority-voting) · [data contamination](#/glossary/data-contamination) · [test-time training](#/glossary/test-time-training) · [importance ratio and clipping](#/glossary/importance-ratio-and-clipping) (ε = 0.2 here, App. B.1.3)

**The paper's own terms:**
- **Weak rewards** (majority vote, format) and **spurious rewards** (random, incorrect) (§2); the latter have "little, no, or outright negative correlation with the correct answer" (abstract).
- **The rewards (§2.2):** *ground truth*, 1 for a verifiably correct answer; *majority vote*, labels fixed before training from the most common of 64 answers of the untrained model, "(potentially wrong)"; *format*, 1 for any non-empty `\boxed{}` (a LaTeX box around the final answer); *random*, 1 with fixed probability γ (0.5 in the main runs) regardless of the response; *incorrect*, training only on questions whose majority-vote label is wrong, rewarding answers that match it.
- **Clipping bias**: GRPO's expected gradient with the clip term minus that without it (App. B.1.2).
- **No-clipping variants**: clipping disabled in code, the mini-batch raised to the rollout size, or the rollout batch shrunk to one gradient update per rollout (§4).
- **Code reasoning**: reasoning in Python "without actual code execution" (abstract): the model writes the code and its output itself (Fig. 5). **Code frequency**: the share of responses containing "python" (§5.2). **No-Code** models don't generate code; **Bad-Code** models "frequently generate code but with degraded performance" (§5.1).
- **Python reward**: 1 if and only if the response contains "python" (§5.3); **compound reward**: an original reward plus the condition of no "python" (App. F); **no-repetition reward**: 0 if any string repeats more than 10 times, else 1 (App. G).
- **pass@1, avg@8**: accuracy of one greedy answer on MATH-500; mean accuracy over 8 samples on AMC (American Mathematics Competition) and AIME (American Invitational Mathematics Examination) problems (App. A.2, A.4).

**Builds on:**
- GRPO, "as introduced by" DeepSeekMath ([DeepSeekMath](#/papers/shao2024deepseekmath "DeepSeekMath: Pushing the Limits of Mathematical Reasoning in Open Language Models (2024)"), a math-model paper), used with the KL term off (App. A.1).
- The ground-truth RLVR approach of Tülu 3 ([Tülu 3](#/papers/lambert2024tulu "Tulu 3: Pushing Frontiers in Open Language Model Post-Training (2024)"), an open post-training recipe), their baseline (§2.2).
- The hypothesis that RLVR, at open-source post-training scales, "does not teach models new reasoning capabilities, but instead triggers latent ones", citing works including [Does Reinforcement Learning Really…](#/papers/yue2025rlreasoning "Does Reinforcement Learning Really Incentivize Reasoning Capacity in LLMs Beyond the Base Model? (2025)") (§2.2); and DAPO (an open-source LLM RL system, not listed here), whose authors "show that clipping bias reduces exploration and increases exploitation in RLVR with ground-truth labels", which theirs echo (§4).
- TTRL (majority-vote pseudo-rewards on the test prompts) and one-shot RL (training on one labelled example), which they re-test on other models (§3, App. E).

## Problem and setting

- **Question:** "the limits of how little supervision is needed for effective RLVR training" (§2.1; correct means the answer verifiably matches the label), whether the effect transfers across model families (§3), and what makes information-free rewards work (§4–5).
- **Models:** Qwen2.5-Math-7B and -1.5B (math-tuned); Qwen2.5-7B and -1.5B (general-purpose); Llama3.1-8B and Llama3.2-3B with their Instruct versions; OLMo2-7B and OLMo2-7B-SFT, instruction-tuned from it (§3); App. J adds three RL-trained models.
- **Training:** GRPO on the DeepScaleR math data (§2.1). Unless otherwise specified: constant learning rate 5e-7, 64 prompts per rollout batch, 16 rollouts each, mini-batches of 128 rollouts, temperature 1, no KL or entropy loss (a term that rewards varied outputs) (App. A.3); 300 steps (Fig. 1); default chat templates (OLMo's for other base models), following the RL framework OpenRLHF (§2.1).
- **Benchmarks:** MATH-500, "a standardized subset of the MATH dataset"; AMC; and AIME 2024 and 2025 (App. A.2). AIME 2025 postdates all models studied (App. D). Curves are smoothed over ten steps; the final value is the smoothed last step (App. A.6).

## Approach

- **The clipping explanation (§4, App. B).** With random rewards independent of the responses the expected advantage is zero, so without clipping "the expected training objective is zero" (§4). The derivation sets the gradient to 0 where the loss is not differentiable and the advantage to 0 when a group's rewards are all equal (App. B.1.1–B.1.2). It finds an expected gradient, up to a positive constant, that raises a token's probability when its ratio is below 1 − ε, does nothing inside the range and lowers it above 1 + ε; the bias "discourages the model from leaving the clipping region" (App. B.1.2). From a worked example (a frequent token that can never reach the upper limit, a rare one that easily can) they conclude that "clipping bias asymmetrically suppresses low-probability tokens and reinforces high-probability ones" (§4).
- **Code reasoning (§5).** Their "central hypothesis is that differences in RLVR outcomes stem from differences in the reasoning strategies acquired during pretraining" (§5). They measure code use before and during training, then push it up or down (§5.1–5.3, App. F).

## Results

- **Qwen2.5-Math (§2.2, Fig. 1–2).** "all reward functions, even pathologically designed ones, lead to significant improvements in math performance within the first 50 steps across all benchmarks", except Qwen2.5-Math-1.5B with random rewards, which gains later and less on AMC (§2.2). For the 7B model on MATH-500, Fig. 1 labels gains of +13.8 (format), +24.1 (incorrect), +21.4 (random), +27.1 (majority vote) and +29.1 (ground truth) from 49.4. On AIME 2025, gains from spurious rewards "largely vanish" (App. D.1).
- **Other families (§3, Fig. 3).** "across Qwen2.5, all non-random rewards (even spurious incorrect) improve MATH-500, whereas OLMo stays flat under spurious rewards and gains mainly with ground-truth rewards"; each weak or spurious reward "fails to help at least one other model and can be flat or even harmful" (§3). Already RL-trained models "see minimal gains under nearly all rewards" (§3, App. J). TTRL and one-shot RL gain on Qwen models but "often fail to yield performance gains on other model families" (§3, App. E).
- **Clipping ablation (§4, Fig. 4, averaged over random seeds).** Without clipping random rewards "fail to yield consistent performance"; with it, "stable and consistent improvements". Disabling it in code gives high variance, "occasionally resulting in high-performance convergence"; the batch-size variants make "8 times fewer gradient updates" than those runs (App. B.2, Fig. 10).
- **Code reasoning (§5.1–5.2).** Before training Qwen2.5-Math-7B uses code in 65.0% of MATH-500 responses, with 60.9% accuracy on them against 28.0% on the rest (§5.1; §1); Tab. 1 prints 35.0 for the rest. Bad-Code models are less accurate with code (Tab. 1). Under weak or spurious rewards its code frequency rises within 15 steps, "closely tracking accuracy gains"; with ground truth it rises, then declines (§5.2, Fig. 6). Averaged over "rewards that successfully steered the model's reasoning strategy", the largest share of Qwen2.5-Math-7B's gain comes from problems that switched from language to code (App. H, Tab. 3).
- **Interventions (§5.3, App. F–G).** Forcing the first sentence "Let's solve this using Python." raises MATH-500 accuracy by 24.2, 15.0 and 10.0 points for Qwen2.5-Math-1.5B, Qwen2.5-Math-7B and Qwen2.5-1.5B, and lowers it for Qwen2.5-7B, Llama and OLMo2 (Tab. 2). The Python reward "improves performance only in Qwen2.5-Math" (Fig. 7). With the no-Python condition, format rewards "cease to improve" Qwen2.5-Math-7B, ground truth still gains, and Bad-Code models often do better than with the original rewards (App. F). The no-repetition reward helps Qwen2.5-Math, with "minimal or even negative improvement on other models" (App. G).
- **Prompts (App. I).** Before training, Qwen2.5-Math-7B scores 49.4 on MATH-500 with its default prompt, 68.8 with lorem-ipsum placeholder text as its prompt (Tab. 5).

## Limits the authors state

- Spurious rewards "are proposed purely for analytical purposes and should not be interpreted as a recommended approach" (§1, §2.2).
- Code reasoning is "a controlled and observable example … rather than as an exhaustive characterization of model behavior" (§5).
- Their explanations of the family and model-size trends are conjectures (§3); for unclipped training "the exact mechanism remains unclear" (App. B.2).
- AIME has 30 questions per year, so accuracy differences of less than about 2 points "may not be significant" (Fig. 13).
- "Due to compute constraints", TTRL hyperparameters were not extensively swept on the new base models; their one-shot RL omits the entropy loss, which "may cause a noticeable performance difference" for Qwen2.5-7B (App. A.7).
- The lorem-ipsum prompt's gain "does not always happen for randomly picked prompts" (App. I.2).

## Open problems and building blocks

- **Open:** a "systematic analysis" of unclipped training's variance (App. B.2); why compound rewards differ between Qwen2.5-1.5B and -7B, "which have the same pretraining data" (App. F); whether "improved RLVR algorithms or higher-quality training data" could still help saturated models (App. J); and "future RLVR research should be confirmed on other models and using spurious rewards as dummy baselines" (§1).
- **Released:** the title page links a code repository named `Spurious_Rewards` (title page).
- **To reuse it:** GRPO with clipping and no KL term (App. A.1); about 24 hours on 8 A100s per run (App. A.5).

## On this site

- **Discussed in:** [Weak checkers get exploited](#/challenges/weak_checker_exploitation)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/hacking-general">hacking-general</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/rlvr-general">rlvr-general</a></span>
