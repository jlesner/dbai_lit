# Examining False Positives under Inference Scaling for Mathematical Reasoning

**False Positives under Inference Scaling** · preprint 2025

Read: [PDF](https://arxiv.org/pdf/2502.06217) · [arXiv](https://arxiv.org/abs/2502.06217)  
Code: [False-Positives-in-Math](https://github.com/Wloner0809/False-Positives-in-Math)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Measures correct final answers reached through flawed reasoning in math, across models and datasets (abstract).
- Answer-only automatic checks accept these false positives (abstract).
- A weak check misleading inference scaling (<a class="tag" href="#/tags/hacking">hacking</a>): sampling-based scaling doesn't remove false positives, and pass@N is the most susceptible metric (abstract).

## In plain words

Most math benchmarks for language models grade a solution only by comparing its final answer with the reference (abstract). A solution with wrong reasoning can then count as correct, a "false positive", which raises "concerns about the reliability of the evaluation metrics" (§1). The authors generate many solutions per problem with open-source general and math-specialized models on three benchmarks of rising difficulty, select or build answers with several ways of spending more computation at answer time, and have people check the reasoning of accepted solutions. They report that false positives persist across models, benchmarks and decoding methods, that sampling-based scaling methods "do not alleviate the problem", and that pass@N (solved if any of N samples is right) is more affected, "suggesting a significantly lower scaling ceiling than what automatic evaluations indicate" (abstract), as measured with the largest math model on AIME competition problems (§5.3.2). Models asked to spot these solutions struggled, GPT-4o included (§5.2). The authors present a systematic examination of the problem's prevalence, and argue for "more rigorous evaluation practices that go beyond mere answer correctness" (§1).

## Background and terms

**Terms to know:** [best-of-N sampling](#/glossary/best-of-n-sampling) · [self-consistency](#/glossary/self-consistency-majority-voting) · [pass@k](#/glossary/passk) (the paper writes Pass@N) · [outcome and process rewards](#/glossary/outcome-and-process-rewards) · [beam search](#/glossary/beam-search) · [Monte Carlo tree search](#/glossary/monte-carlo-tree-search-mcts) · [GRPO](#/glossary/grpo) · [LLM-as-a-judge](#/glossary/llm-as-a-judge) · [inference-time scaling](#/glossary/test-time-scaling)

**The paper's own terms:**
- **false positive**: a solution whose final answer is correct "but the solution process contains errors or lacks logical validity" (§1). Annotators label one when a correct-answer solution shows any of four error types (§3.2): **jump in reasoning** (essential steps omitted), **logical error** (misapplied theorems or rules, unjustified assumptions, contradictions, conditions not in the problem), **calculation error**, **conceptual error** (misreading a theorem, concept or the problem). They "may disregard minor errors in the reasoning path that do not affect the final answer", and a solution that corrects its own mistake is not a false positive (§3.2).
- **automatic accuracy**: the share of responses a rule-based grader (Qwen2.5-Math's implementation) accepts by final answer (§5.1).
- **false positive rate**: the share of false positives among the responses the automatic evaluation deems correct (§5.1).
- **manual accuracy**: by human review, the share of responses that match the reference answer and are free of false positives (§5.1).
- **solution-level and step-level inference scaling**: solution-level methods generate whole solutions and pick one with a reward model or a heuristic; step-level methods build one step at a time, "typically guided by a reward model or heuristic values" (§4).
- **Weighted Self-Consistency**: a majority vote with each sample's vote weighted by its reward-model score; for evaluation the authors take the highest-reward solution among those giving the chosen answer (§4.1).
- **DVTS (Diverse Verifier Tree Search)**, from Beeching et al.: step-level beam search split into independent subtrees, guided by a process reward model, with lookahead steps (§4.2.1, Alg. 1).
- **Vanilla MCTS**: the MCTS implementation of OpenR (Wang et al., 2024), with a process reward model computing state values (§4.2.2, Alg. 2).
- **Short-CoT and Long-CoT models**: §5.3 "primarily" examines Short-CoT models and also discusses Long-CoT models, whose outputs have a `<think>` part and an `<answer>` part; only the `<answer>` part is reviewed (§3.2, §5.3.4).

**Builds on:**
- Snell et al. ([compute-optimal test-time scaling](#/papers/snell2024scaling "Scaling LLM Test-Time Compute Optimally can be More Effective than Scaling Model Parameters (2024)")) on inference-time scaling for math, which the authors say did not consider false positives (§2); they follow it in preferring Weighted Self-Consistency (§4.1).
- Stroebl et al. ([The Limits of Inference…](#/papers/stroebl2024resampling "The Limits of Inference Scaling Through Resampling (2024)")), which they say showed in coding that "flawed verifiers lead to a decrease in true accuracy as more computational resources are allocated" (§2).
- Earlier reports of false positives (Hao et al.; Zheng et al.) and process supervision such as Lightman et al. ([Let's Verify Step by Step](#/papers/lightman2023verify "Let's Verify Step by Step (2023)")), whose MATH500 split they use (§2, §5.1).

## Problem and setting

- **Question:** how often false positives occur and how they affect inference-time scaling, across models, datasets of varying difficulty and decoding strategies (§1).
- **Benchmarks (§5.1):** MATH500 (high school competition problems), AIME 2022–2024 (90 problems from a US invitational competition) and Omni-MATH-Rule, "a subset suitable for rule-based evaluation" of the Olympiad-level Omni-MATH. For manual review, 100 problems are drawn at random from MATH500 and from Omni-MATH-Rule (MATH100, Omni-MATH100).
- **Policy models** (the models that write solutions, §5.1): general-purpose Llama-3.2-3B-Instruct and Llama-3.1-8B/70B-Instruct; math-specialized Qwen2.5-Math-1.5B/7B/72B-Instruct.
- **Reward models (§5.1):** the outcome reward model Qwen2.5-Math-RM-72B for solution-level methods; the process reward model Skywork-o1-Open-PRM-Qwen-2.5-7B for DVTS and MCTS.
- **Correct** means a matching final answer and none of the four error types in human review (§3.2, §5.1).

## Approach

- **Scaling curves (§5.3.1, Fig. 2):** compare automatic with manual accuracy as the number of samples N grows. Solution-level: Best-of-N and Weighted Self-Consistency with Llama-3.1-70B and Qwen2.5-Math-72B on AIME. Step-level: DVTS and MCTS with Llama-3.1-8B and Qwen2.5-Math-7B on MATH100.
- **Model detection (§3.1, §5.2):** a model outputs True or False for a problem and its step-by-step solution (prompt in App. A.1), scored by F1 (the balance of precision and recall) against the human labels on a 453-item detection benchmark built from the Fig. 2 settings at N = 256 (App. B).
- **Pass@N against Best-of-N (§5.3.2, Fig. 6):** both measured automatically and manually, for Qwen2.5-Math-72B on AIME.
- **Rule-based GRPO (§5.3.3, Tab. 2):** Qwen2.5-Math-1.5B-Oat-Zero, trained with Dr.GRPO (reinforcement learning with a rule-based reward that checks only the final answer), against Qwen2.5-Math-1.5B-Instruct, by Best-of-256 on AIME.
- **Error analysis (§5.3.4):** error types counted over the settings of Figs. 4, 5 and 2(b) at N = 256 (Fig. 7); a probe of the Long-CoT model DeepSeek-R1-Distill-Llama-70B, Weighted Self-Consistency at N = 64 on AIME.
- **Hidden states (§5.3.5):** the policy models' internal activations from the last 6 layers, pooled per response, plotted in two dimensions with t-SNE (a projection method) for the layer that separates the labels best (Figs. 12–13).

## Results

- **Scaling (§5.3.1, Fig. 2):** both accuracies generally rise with N across all methods, but the gap between them persists across values of N; the authors conclude that "inference scaling does not effectively mitigate" false positives.
- **Detection (§5.2, Fig. 3):** F1 of 0.275 for LLaMA-70B, 0.405 for Qwen-72B and 0.539 for GPT-4o; even GPT-4o "fails to achieve satisfactory performance".
- **Model type (§5.3.1, Fig. 4; Best-of-256 on AIME):** false positive rates of 0.500 (Llama-3.2-3B) and 0.464 (Llama-3.1-70B) against 0.160 (Qwen2.5-Math-1.5B) and 0.188 (Qwen2.5-Math-72B), significantly higher for general models "regardless of whether their automatic accuracy is higher or lower". The authors attribute Llama-3.1-70B's higher rate than the 1.5B math model's "primarily" to more reasoning jumps and logical errors.
- **Difficulty (§5.3.1, Fig. 5; Qwen2.5-Math-72B, Best-of-256):** false positive rates of 0.044 on MATH100, 0.188 on AIME and 0.294 on Omni-MATH100. False-positive solutions are longer on average than final-answer-correct ones on all three (Tab. 1), but Omni-MATH100's are shorter than AIME's while its rate is higher, so "output length alone does not fully explain the trend".
- **Pass@N (§5.3.2, Fig. 6):** the gap between automatic Pass@N and automatic Best-of-N is "substantial", that between their manual versions "comparatively smaller". The authors conclude that even with an oracle reward model that detects false positives in all responses, in solution-level methods the policy model's "inherent limitations" hinder the reward model in selecting as many truly correct responses as expected.
- **GRPO (§5.3.3, Tab. 2):** Oat-Zero's false positive rate is 0.259 against 0.160 for the Instruct model, alongside higher Best-of-256 accuracy. The authors "attribute" this to a rule-based reward that supervises no intermediate steps, "potentially contributing" to the higher rate, and say Oat-Zero "demonstrates limited reflection and self-verification".
- **Error types (§5.3.4, Fig. 7):** logical errors are the majority, 50.6% of the false positives counted. On relatively challenging datasets, the authors report, general models show more reasoning jumps and logical errors than math models.
- **Long-CoT (§5.3.4):** "a large proportion" of `<answer>` parts omit critical details; among 69 solutions with correct final answers, 2 have reasoning errors in the `<answer>` part while the `<think>` part is correct, suggesting, the authors say, a potential misalignment between the two.
- **Hidden states (§5.3.5):** correct and incorrect responses "tend to exhibit relatively distinct clustering patterns"; false positives form no cluster of their own and spread over both, "with only a slight tendency" to lie nearer incorrect ones, so detecting them "may be inherently challenging".

## Limits the authors state

- "we do not conduct extensive experiments on the latest Long-CoT models" (§ "Limitations").
- The inference-scaling tests "are restricted to parallel sampling-based methods, without examining sequential revision-based approaches" (§ "Limitations").
- "due to resource constraints, we do not perform human detection on large-scale datasets" (§ "Limitations"); human review is "more resource-intensive" (§3.2).
- Model-based detection is relatively cheap, but "its effectiveness remains limited" (§3.1).
- Long-CoT `<answer>` parts often omit details, "making it difficult to verify the correctness of the reasoning steps" (§5.3.4).

## Open problems and building blocks

  - "Future research could expand the scope of datasets, explore additional inference scaling methods, and incorporate more Long-CoT models" (§ "Limitations").
  - Filtering synthetic math data by final answer can admit false positives; "future research should prioritize the development of simple yet effective methods to accurately assess the correctness of intermediate reasoning steps" (§6).
  - Self-improvement that trains on rule-filtered answers often takes in false positives, so "the effectiveness of self-improvement may fall short of expectations" (§6).
  - "it remains uncertain how reliably LLMs can detect reasoning flaws produced by strong LLMs themselves" (§2).
  - "in scenarios where GRPO effectively enhances self-reflection and verification, we hypothesize that the false positive rate may be reduced" (§5.3.3).
  - The bottleneck they name: the policy model's limitations, which "pose challenges to the broader application of inference scaling" (§5.3.2).
- **Released:** "Our data and code are publicly available" (abstract).
- **To reuse it:** human annotators for step-by-step review (§3.2); the open policy and reward models above, run with the vLLM inference framework under the settings of App. A.2–A.3; the detection prompt of App. A.1.

## On this site

- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/hacking-general">hacking-general</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/scaling-general">scaling-general</a></span>
