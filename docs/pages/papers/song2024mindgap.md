# Mind the Gap: Examining the Self-Improvement Capabilities of Large Language Models

**Mind the Gap** · ICLR 2025

Read: [PDF](https://arxiv.org/pdf/2412.02674) · [arXiv](https://arxiv.org/abs/2412.02674)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- A controlled study of self-improvement where a model verifies its own outputs, filters or reweights them, and distills (abstract).
- Formalizes the generation–verification gap; it reports that a variant (the relative gap, with verifiers such as CoT-Score) scales monotonically with pre-training FLOPs (abstract, Fig. 1); its own Fig. 1 has exceptions.
- Asks when a model's own verification yields a positive gap (§2.1, §4); [PSV (Propose](#/papers/wilf2025psv "Propose, Solve, Verify: Self-Play Through Formal Verification (2025)") cites it for the intuition of a gap between what models can solve and verify (§2).

## In plain words

In many recipes a language model improves itself: it samples answers, judges them, keeps those it rates well and is fine-tuned on them. The authors say a fundamental understanding of this "is still lacking" (abstract), that earlier results may carry confounders, and that much existing research tests one model family or one way of judging (§1). They describe the process in three steps and propose one quantity to measure: the generation-verification gap, how much more often the answers are right after filtering by the model's own judgment than before (§2). On base models of seven families they report that, with certain ways of judging such as a chain-of-thought score, a relative version of the gap (the gain divided by the room left for improvement) grows monotonically with pre-training compute (§1); that without new information, repeated rounds on Qwen-1.5 models typically stop gaining after two or three (§5); and that on a trivia question set the gain stays below 1% or is negative (§4.3). They present it as a "comprehensive, modular and controlled study" (abstract), not a new algorithm (§7).

## Background and terms

**Terms to know:** [rejection sampling](#/glossary/rejection-sampling) · [Distillation into compact models](#/glossary/distillation) (in the paper's own sense, below) · [pass@k](#/glossary/passk) · [LLM-as-a-judge](#/glossary/llm-as-a-judge) · [reinforcement learning](#/glossary/reinforcement-learning) · [KL penalty](#/glossary/kl-penalty) · [model collapse](#/glossary/model-collapse) (§1, §7)

**The paper's own terms:**
- **self-improvement**: the model generates several responses, verifies them itself, and is updated on the reweighted or filtered responses (§1, §2); with a different verifier, cross-improvement (§4.2).
- **distill**: here, fine-tune the same model on its own filtered outputs (abstract, §2), not a smaller student.
- **utility and proxy utility**: the true score of a response (in the experiments 1 if the final answer is correct, else 0, §4.1), and the model's own score of it, used in its place (§2).
- **generation-verification gap (GV-Gap, "gap")**: the expected utility of the generator's responses reweighted by the verifier's scores, minus that of the responses as sampled (Def. 2.1). In the experiments, "the accuracy difference between the filtered generations and the original generations" (§3).
- **relative gap**: for each prompt, the gain divided by the distance from the current expected utility to the best possible one, averaged over prompts (Def. 2.2).
- **verification methods** (§3, App. A): Multiple Choice (MC) scores by the probability the model gives to "Correct" against "Incorrect"; CoT-Score (CoT-S): reason, then a score from 1 to 10; CoT-Binary (CoT-B): reason, then correct or incorrect; Tournament (To): pairwise single-elimination comparisons over a batch.
- **thresholds**: "top n" sets the filtering threshold at the n quantile of each prompt's scores; "τ = n" sets it at n for all prompts (Tab. 4 caption).
- **pre-training flops**: pre-training compute; Fig. 1 plots against its logarithm (§4.1).

**Builds on:**
- Self-improvement algorithms that sample, self-verify and distill, such as STaR (Zelikman et al., 2022) and self-rewarding models (Yuan et al., 2024); the authors say most previous algorithms follow this framework (§1); "previous works failed to disentangle the gap and the model update" (§5).
- Model collapse in self-training (Bertrand et al., 2023; Gerstgrasser et al., 2024), against which a "reliable" verifier "has shown promise" (Gillman et al., 2024) (§1).
- Sampled responses of varying quality, "improvable generation", citing Li et al. (2022) and [Large Language Monkeys](#/papers/brown2024monkeys "Large Language Monkeys: Scaling Inference Compute with Repeated Sampling (2024)") (§2.1).
- Test-time scaling laws with a reward model or oracle (Wu et al., 2024; [compute-optimal test-time scaling](#/papers/snell2024scaling "Scaling LLM Test-Time Compute Optimally can be More Effective than Scaling Model Parameters (2024)")), which the authors believe understanding self-improvement could extend to settings without an external verifier (§7).

## Problem and setting

- **The question:** what governs self-improvement, and how it varies with model size, over rounds and across verification methods (§1).
- **Models:** base models, "to avoid the confounding effect of the post-training" (§3), with a subset repeated on instruct models (App. B.2), from the families Qwen-1.5, Qwen-2, Qwen-2.5, Llama-2, Llama-3, Llama-3.1 and Yi-1.5.
- **Tasks:** GSM8K (grade-school math word problems; [GSM8K and trained verifiers](#/papers/cobbe2021verifiers "Training Verifiers to Solve Math Word Problems (2021)")) and MATH (competition math, 5,000 test questions) (§4.1); Natural Questions (trivia questions with accepted answers, a 3,610-question test subset, §4.3); 288 4×4 Sudoku puzzles with unique solutions (§4.4).
- **Sampling (§3):** with lm-evaluation-harness (an evaluation framework) and vLLM (an inference engine); top-p 0.9, temperature 0.7, max length 512, 4-shot prompts; 128 responses per prompt, 1 verification per response; mainly rejection sampling with a quantile or global threshold.

## Approach

- **The framework (§2).** Generation; verification "using few-shot prompting to predict the correctness of the generation"; and an update towards the model's own distribution reweighted by its scores: RL with a KL constraint (Ex. 2.1) or rejection sampling, weight 1 at or above a threshold and 0 below (Ex. 2.2).
- **Three key factors (§2.1).** Improvable generation: responses must vary in utility. Informative verification: the gap of Def. 2.1. High-fidelity model update: the updated model matches the reweighted distribution's utility within a Distillation into compact models error ε_update. Given that, one round improves expected utility by at least the gap minus that error. If, for every prompt, the weights and the true utility are positively correlated over the model's responses, the gap is guaranteed positive.
- **A confounder (§2.1):** a fine-tuned model might beat the reweighted distribution "simply by aligning outputs with the required format"; of this and a real reasoning gain, "in our experiment we only observe the former scenario".
- **Iterative runs (§5):** rejection-sampling fine-tuning (Alg. 1) or RL with Reasoning Preference Optimization, a preference-based method (App. D).

## Results

- **Scaling (§4.1, Fig. 1, Tabs. 4–5).** "with certain verification methods (such as CoT-Score), the relative gap grows monotonically with the pre-training flops". The authors "hypothesize" a linear relation with the logarithm of the flops, and see no similar trend for the absolute gap (Fig. 12). App. B.1 reports the same relative-gap trend for Qwen-1.5 on GSM8K at temperatures 0.5 and 1, except the 14B model at temperature 1 (Fig. 8).
- **Small models (§4.1).** For models such as Qwen-1.5 0.5B, Qwen-2 0.5B and Llama-2 7B the gap "is non-positive for nearly all verification methods". CoT verification "always has a positive gap for medium/large-sized models", while some MC settings do not.
- **Cross-verification (§4.2, Fig. 3; Llama-2 and Qwen-2, MC and CoT-S).** With the generator fixed, the gap increases with the verifier's compute; with the verifier fixed, it decreases with the generator's, "as the error of the generator model becomes more difficult to detect".
- **Trivia (§4.3, Tab. 1, Tab. 6).** On Natural Questions the gap "remains smaller than 1%, or is even negative, across all models".
- **Sudoku (§4.4, Tabs. 2 and 7).** Generalized Sudoku is cited as a case where generation is NP-hard (no fast algorithm known) and verification is in P (fast); models use chain of thought for both. Only the largest models, "such as Qwen-1.5/2 72B and Llama 3.1 70B", show non-trivial gaps; Qwen-2 72B has 8.82% accuracy and a gap of 16.99 points (Tab. 2).
- **Iterative (§5, Fig. 4; Qwen-1.5 7B–72B, CoT-Binary, GSM8K).** "the gap diminishes nearly to zero within two or three rounds", at a similar rate across model sizes. For 7B and 14B, accuracy after round 1 exceeds round-0 accuracy plus gap, which the authors attribute to better adherence to the answer format. With MC (quantile 0.7, 7B) the gap drops near 0 after one round. For 7B, pass@k rises with rounds for small k and falls for large k, read as lost "effective diversity"; likewise on MATH (App. C.4). With ground-truth labels diversity is not lost; with Qwen-1.5 72B as fixed verifier it still is (7B generator; App. B.3, Fig. 10).
- **Verification (§6).** Consistently across most models, the gap is concave in the threshold for MC and Tournament and rises with it for CoT-Score, and most models agree on the best thresholds (§6.1, Figs. 5–6 for Qwen-1.5). Correlations between different verifiers' scores are "generally low", and no verifier's gap correlates positively with generation accuracy (§6.2, Fig. 7). Keeping responses that pass every verifier: "combining any verifications with non-trivial gaps improves the verification performance (with the exception of CoT for 0.5B model with near 0 gap)" (§6.3); e.g. Qwen-2 1.5B, MC 5.27 and CoT-S 2.78 against 7.68 for both (Tab. 3; full results Tab. 8).

## Limits the authors state

- "an ideal verification should be sampling multiple verifications per generation. We only sample one due to computational constraints" (§3, footnote 4).
- "our scaling analysis is primarily observational" (§8); the Sudoku analysis is "primarily post-hoc" (§4.4).
- The linear relation is a conjecture (Fig. 1 caption), and "we should not expect the slope for each model family to be the same" (§4.1).
- "Instruct models do not always have the scaling property" (Fig. 9); the Llama-2-Chat fit "is only based on three models" (App. B.2).
- "in general, one should not expect the optimal threshold transfers between different tasks" (§6.1).
- With a smaller verifier, "a positive gap cannot always be assured"; the largest verifier "might be suboptimal" given its compute cost (§4.2).
- With no new information, "it is unrealistic to expect indefinite improvement" (§5).
- Changes in output length during fine-tuning "may inflate perceived improvements without reflecting true model capabilities", citing recent works (§2.1).

## Open problems and building blocks

  - "a more extensive scaling law study" (§8).
  - An inference-time scaling law for self-improvement: "Identifying compute-optimal methods for self-improvement across different tasks remains a critical challenge" (§8); the compute-optimal cross-verification configuration "might require a combinatorially large number of experiments" (§4.2).
  - The decline in effective diversity "presents a significant obstacle" (§8).
  - Combining verification mechanisms, given their non-overlap (§8).
  - A metric to predict a model's "self-improvability" on a task (§4.4).
  - Multiple verifications per response and "understanding verification compute scaling" (§3, footnote 4).
- **Released:** Nothing stated.
- **To reuse it:** base models, few-shot verification prompts (App. E), 128 samples per prompt (§3); fine-tuning settings (App. D, Tab. 9); Nvidia A100 40GiB nodes for inference and 80GiB for training (App. F).

## On this site

- **Discussed in:** [Self-improvement that compounds](#/challenges/compounding_self_improvement) · [The self-improving SQL ↔ text ↔ verify loop](#/challenges/sql_text_round_trip_loop)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/judge-general">judge-general</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/scaling-general">scaling-general</a></span>
