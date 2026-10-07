# Does Reinforcement Learning Really Incentivize Reasoning Capacity in LLMs Beyond the Base Model?

**Does Reinforcement Learning Really…** · NeurIPS 2025 (oral)

Read: [PDF](https://arxiv.org/pdf/2504.13837) · [arXiv](https://arxiv.org/abs/2504.13837)  
Code: [limit-of-RLVR](https://github.com/LeapLabTHU/limit-of-RLVR)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- At large k, base models' pass@k matches or beats their RLVR-trained versions in most runs (abstract; exceptions in its own Table 3).
- pass@k across model families, algorithms and tasks.
- RLVR may sharpen rather than extend: a limit on what the loop can gain.

## In plain words

Reinforcement learning trains an LLM by rewarding its sampled outputs; in RL with verifiable rewards (RLVR), a program checks each answer (a math result, unit tests). RLVR has shown "notable success" in raising LLMs' reasoning performance, and the authors say it is "widely believed" to give models new reasoning abilities beyond the model training started from (abstract). They let each model try every problem up to about a thousand times, counting a problem as within reach if any try is right (§1). Across model families, six training algorithms, and math, coding and visual-reasoning benchmarks, they report that trained models do better with one or a few tries, while the starting models score higher when tries are many (abstract). They also report that the trained models' answers are already likely under the starting model (§4.1), that the six algorithms perform similarly, and that Distillation into compact models from a stronger teacher, unlike RLVR, can expand what a model solves (abstract). The authors present the work as "a critical look at the current state of RLVR" (abstract): a measurement study, not a new method.

## Background and terms

**Terms to know:** [reinforcement learning](#/glossary/reinforcement-learning) · [RL with verifiable rewards (RLVR)](#/glossary/rl-with-verifiable-rewards-rlvr) · [pass@k](#/glossary/passk) · [PPO](#/glossary/ppo) · [GRPO](#/glossary/grpo) · [KL penalty](#/glossary/kl-penalty) · [policy entropy](#/glossary/policy-entropy) · [Distillation into compact models](#/glossary/distillation) · [zero-RL training](#/glossary/zero-rl-training) · [perplexity](#/glossary/perplexity)

**The paper's own terms:**
- **base model**: the model RLVR training starts from: a pretrained model for math, an instruction-tuned one for code and visual reasoning (§2.1).
- **reasoning capacity boundary** (also "coverage"): the share of a benchmark's problems a model can solve within k tries, measured as pass@k at large k (§1, §2.2), used "not to assess practical utility" (§2.2).
- **sampling efficiency**: how likely a model is to sample a correct answer on problems it can solve, which the authors say RLVR improves (§1, §4.1).
- **sampling efficiency gap (ΔSE)**: the base model's pass@256 minus the RL-trained model's pass@1, the former treated as an upper bound; lower is better (§1, §4.3).
- **policy gradient**: PPO's class of methods: they learn only from the current model's samples and "generally" raise the likelihood of correct ones, lowering that of incorrect ones (§2.1).
- **random guessing issue**: a wrong chain of thought reaching the right math answer, which "can become pronounced as k increases" (§2.2); for code, passing all unit tests "is nearly impossible to achieve by guesswork" (§3.2).

**Builds on:**
- The pass@k metric, cited to Brown et al. (§1; [Large Language Monkeys](#/papers/brown2024monkeys "Large Language Monkeys: Scaling Inference Compute with Repeated Sampling (2024)")), whose manual check of chains of thought §3.1 follows, and to Chen et al. 2021, from code generation (§2.2, App. A.2; not listed here).
- Earlier reports of similar trends: DeepSeekMath, whose study "was limited to a single instruction-tuned model and two math benchmarks" (§6; [DeepSeekMath](#/papers/shao2024deepseekmath "DeepSeekMath: Pushing the Limits of Mathematical Reasoning in Open Language Models (2024)")), and Dang et al., "seen only in a limited experimental setup with Qwen-2.5-0.5B on GSM8K" (App. B; not listed here).
- DeepSeek-R1's zero-RL setting (§2.1; [DeepSeek-R1](#/papers/deepseek2025reasoning "DeepSeek-R1: Incentivizing Reasoning Capability in LLMs via Reinforcement Learning (2025)")).

## Problem and setting

- **The question:** does current RLVR let LLMs "acquire novel reasoning abilities", or does it "simply utilize reasoning patterns already in the base model" (§1)?
- **Solved:** a problem is solved at k if at least one of k samples passes the verifier, estimated from n ≥ k samples, n "typically 128, 256, or 1024" (§2.2, App. A.2). The verifier is binary: an exactly correct final answer in math, unit tests in code (§2.1–2.2). [Best-of-N](#/glossary/best-of-n-sampling) and [majority voting](#/glossary/self-consistency-majority-voting) are set aside as they "may overlook a model's full reasoning potential" (§2.2).
- **Sampling:** temperature 0.6, top-p 0.95, at most 16,384 tokens (32k for DeepCoder, §3.2); base and RL models get the same zero-shot prompt (the RLVR training prompt or the benchmark's), with no few-shot examples, "to ensure a fair and unbiased comparison" (§3).
- **Models and benchmarks** (Tab. 1):
  - Math (§3.1): Qwen2.5-7B/14B/32B and LLaMA-3.1-8B against RLVR models released by SimpleRLZoo, trained by zero-RL with GRPO on GSM8K and the MATH training set "with correctness reward only", plus Oat-Zero-7B and DAPO-32B, two released RLVR models with strong AIME24 scores. Benchmarks: GSM8K (grade-school word problems), MATH500 (competition problems from the MATH dataset), Minerva (quantitative reasoning problems), OlympiadBench (olympiad-level problems), AIME24 and AMC23 (math competitions).
  - Code (§3.2): CodeR1-Zero-Qwen2.5-7B (RL on 12K LeetCode and TACO samples) and DeepCoder-14B; on LiveCodeBench v5, a benchmark of recent coding problems, here 279 from August 2024 to January 2025, and HumanEval+ and MBPP+ (Python tasks with extended tests; [EvalPlus](#/papers/liu2023evalplus "Is Your Code Generated by ChatGPT Really Correct? Rigorous Evaluation of Large Language Models for Code Generation (2023)")).
  - Visual (§3.3): Qwen2.5-VL-7B trained with the EasyR1 framework on Geometry3K (geometry problems), tested on MathVista and MathVision (math in visual contexts) without multiple-choice questions.
  - Controlled runs (§4.3): Qwen2.5-7B trained in the VeRL framework with six RL algorithms (PPO, GRPO, Reinforce++, RLOO, ReMax, DAPO), no KL term, on 2,000 problems of Omni-MATH-Rule (the verifiable part of the Olympiad-level set Omni-MATH), tested on 821 others and on MATH500.

## Approach

- **Pass@k curves** of each base model and its RLVR version (§3, Fig. 2).
- **Chain-of-thought checks:** the authors manually inspect chains of thought that reached correct answers on the hardest problems, those with average accuracy below 5% (§3.1, §3.3). On AIME24 they first drop "guessable" problems, which Qwen2.5-7B-Base answers right with low but non-zero probability without reasoning, leaving 18 of 30 (App. C.2).
- **Deeper analyses (§4):** accuracy histograms, solvable sets, and the base model's perplexity on 16 base and 16 RL responses for two random AIME24 problems (§4.1); then Distillation into compact models, algorithms, training settings, entropy, and Magistral-Medium, trained with pure RL and "positioned near the frontier" (§4.2–4.6).
- **The authors' possible explanation (§5):** the action space (the outputs a model can produce, token by token) is far larger than in Go or Atari, so RLVR starts from a pretrained model whose learned preferences (its prior) guide sampling; outputs that stray from them are "highly likely" to be invalid and get a negative outcome reward ([a reward for the final answer only](#/glossary/outcome-and-process-rewards)), so the trained model tends to produce responses its prior already favours.

## Results

- **Math (§3.1, Fig. 2, Figs. 10–11):** RL-trained models score higher at small k; as k grows "to the tens or hundreds", base models "consistently catch up and surpass RL-trained models" (Fig. 2 caption).
- **Chain-of-thought checks:** on GSM8K the base model answered 25 such questions, 24 with at least one correct chain of thought; the RL model 25, with 23 (§3.1). AIME24 and visual checks are similar (App. C.2, §3.3).
- **Code and visual (§3.2–3.3, Figs. 3–4):** trends "highly consistent" with math.
- **Solvable sets (§4.1, Tab. 2):** on AIME24 at k = 1024, 13.3% of problems are solved by the base model only and 0.0% by the RL model only; on MATH500 at k = 128, 3.6% against 1.0%. The authors find "very few where RLVR succeeds while the base model does not" (§4.1); the base model solves the RL-only MATH500 problems at 1024 samples (App. C.7). They report "a similar trend" in coding (Tab. 6).
- **Accuracy histograms (§4.1, Fig. 5, Qwen2.5-7B on Minerva):** RLVR makes accuracies near 1.0 more frequent but also raises the frequency of accuracy 0; the authors attribute the average gain to "improving sampling efficiency on problems already solvable by the base model".
- **Perplexity (§4.1, Fig. 6; App. C.4):** the base model's perplexity on RL responses "closely matches the lower portion" of that on its own responses, and falls during RL training.
- **Distillation (§4.2, Fig. 7):** DeepSeek-R1-Distill-Qwen-7B (DeepSeek-R1 distilled into Qwen2.5-Math-7B) has a pass@k curve "consistently and significantly above" its base model's.
- **Algorithms (§4.3, Fig. 8, Tab. 3):** differences "are not fundamental", and ΔSE "remains consistently above 40 points" across algorithms on the in-domain test set.
- **Training (§4.4, Tab. 4, Fig. 16):** from GRPO step 150 to 450, training-set pass@1 rises from 26.1 to 42.5 while pass@256 falls from 66.3 to 64.3. With 32 rollouts per prompt instead of 8, pass@k "improves slightly" but the base model still eventually wins; with the KL penalty, pass@1 is similar and pass@128 "much lower".
- **Entropy (§4.5, Fig. 18):** at matched entropy the RL model "still underperforms the base model across pass@k"; lower entropy contributes but "alone does not fully account for the reduction".
- **Near-frontier model (§4.6, Fig. 9):** at k = 1 Magistral-Medium solves "approximately 7 more problems on AIME24 and 8 more on AIME25" than its base, and the gap "steadily narrows" as k grows; the authors say their conclusion "continues to hold even for current, highly capable, near-frontier reasoning models".

## Limits the authors state

- "many of the most capable models and training pipelines remain proprietary", and "emerging techniques may mitigate some of the limitations identified here" (§7).
- For many large models, isolating RLVR's effect "is not feasible"; the Magistral runs are "a preliminary set of experiments" (§4.6).
- With an astronomically large k even uniform sampling would hit a correct path, though "this is infeasible within today's time and compute budgets" (§2.2).
- DeepCoder is tested on LiveCodeBench only, "Due to their high computational cost" (§3.2); the 32-rollout run stopped at 220 steps "Due to resource constraints", unconverged (Fig. 16).

## Open problems and building blocks

  - Whether scaling RLVR training "can eventually surpass the base model" (§4.4), and whether the trend persists with more RL compute, "such as pre-training scale budgets" (§4.6).
  - The bottleneck: "inefficient exploration mechanisms in a vast action space and the reliance on binary outcome rewards may be the root causes" (§5). Directions: exploration in a high-level abstraction space, such as AlphaEvolve's self-evolution over programs ([AlphaEvolve](#/papers/novikov2025alphaevolve "AlphaEvolve: A coding agent for scientific and algorithmic discovery (2025)")); "Data scale via curriculum" ([curriculum learning](#/glossary/curriculum-learning)); process rewards (for intermediate steps) and fine-grained credit assignment ([credit assignment problem](#/glossary/credit-assignment-problem)); multi-turn agentic RL (§5, §7). §4.3: "novel RL algorithms or entirely new paradigms may be necessary to approach the upper bound".
- **Released:** nothing stated in the text, beyond a project-page link under the abstract (abstract).
- **To reuse it:** typically 128 to 1024 samples per problem (App. A.2); RL runs with 256 prompts per batch, 8 responses each, rollouts up to 8,192 tokens (§4.3); prompts in App. D.

## On this site

- **Discussed in:** [The self-improving SQL ↔ text ↔ verify loop](#/challenges/sql_text_round_trip_loop)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/rlvr-general">rlvr-general</a><a class="tag sub" href="#/tags/scaling-general">scaling-general</a></span>
