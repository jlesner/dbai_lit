# Learning from Prompt itself: the Hierarchical Attribution Prompt Optimization

**Learning from Prompt itself** · preprint 2026

Read: [PDF](https://arxiv.org/pdf/2601.02683) · [arXiv](https://arxiv.org/abs/2601.02683)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- A prompt optimizer that targets "prompt drift", where new prompts fix earlier failures but break earlier successes (abstract).
- Attribution over error patterns and prompt history, edits to semantic units of the prompt, and LLM–MLLM workflows (abstract).

## In plain words

Prompt optimizers let an LLM rewrite a prompt over many rounds. The authors say they often cause "prompt drift, where new prompts fix prior failures but impair performance on previously successful tasks", and that writing prompts from scratch can compromise interpretability, hiding why a prompt changed (abstract, § "Introduction"). They build a method that cuts the prompt into meaningful pieces, scores each piece's influence on the current errors (by blanking it and measuring the change, plus its record of helpful past edits), proposes edits to the top-scoring pieces, tries them on held-out examples by trial and error, and stops, among other rules, when a new prompt breaks too many items the old one solved. It also handles questions about images (abstract). With three models (Gemini 2.5 Pro, GPT-4o, Qwen3-VL-Plus) on four benchmarks, scored by a separate LLM grader, they report the best score of seven methods in 11 of 12 model–benchmark pairs and an average gain of 13.28 points over zero-shot chain-of-thought prompting (§ "Experiment Results"). They present it as "a novel, dynamic attribution mechanism for prompt optimization" (§ "Introduction").

## Background and terms

**Terms to know:** [reflective prompt optimization](#/glossary/reflective-prompt-optimization) · [meta-prompt](#/glossary/meta-prompt) · [LLM-as-a-judge](#/glossary/llm-as-a-judge) · [multi-armed bandit (UCB)](#/glossary/multi-armed-bandit-ucb).

**The paper's own terms:**
- **prompt drift**: a new prompt fixes earlier failures but breaks items the earlier prompt handled (abstract). Measured as **drift**, the share of items the previous prompt answered correctly that the new prompt gets wrong; **retention** is one minus drift (§ "Optimizer Phase", "Measuring Prompt Drift").
- **semantic unit**: a coherent piece of the prompt, found by rule-based splitting (discourse markers, headers, list items, delimiters), then a frozen instruction-parser model that merges overly short fragments and splits run-on clauses (§ "Attributor Phase", "Semantic Text Segmentation").
- **attribution score**: for each unit, how much the loss on this round's mispredicted training examples changes when the unit is masked out, kept as a running average across rounds (Eq. 4), then mixed with the unit's record of improvements from past edits, older ones counting less (Eq. 5). The top m units (m = 4) form the "actionable set" (§ "Attributor Phase", "Dynamic Attribution Mechanism").
- **opt-feedback package**: for one top unit, where to change, why, and how (Fig. 1).
- **arm (edit candidate)**: one unit paired with one edit operator: Replace, Insert, Delete, Reorder or Refine (§ "Selector Phase", "Edit Operators"). Its reward is the change in accuracy on a held-out dev split after the edit (Eq. 6).
- **linguistic gradient**: the paper's analogy with gradient descent (Eq. 2–3): the derivative "could be explained as an attribution analysis of the impact exerted by the prompt on the LLM output", and high-attribution elements (e.g. task structure) are edited before fine-grained ones (e.g. word choice) (§ "Problem Formulation"); § "Introduction" calls this "a simulation of the learning rate in machine learning".
- **meta-prompt components**: Prioritizing Weak Elements (focus on where the prompt underperforms) and Structured Reasoning (explicit analysis of in-context examples) (§ "The Impact of Meta-Prompt Design").
- **LLM-MLLM workflow**: an MLLM is a multimodal LLM, one that also reads images. In MLLM settings the task model receives the images base64-encoded with the question; the optimizer's meta-prompt only gains a note on the task's multimodal background (§ "Multimodal Pipeline").

**Missing glossary terms:**
- **occlusion attribution**: estimating how much a part of an input contributes to an output by masking that part and measuring the change; the paper calls its version "counterfactual occlusion" (§ "Dynamic Attribution Mechanism").

**Builds on:**
- APE (Automatic Prompt Engineer, [APE](#/papers/zhou2022ape "Large Language Models Are Human-Level Prompt Engineers (2023)"): LLM-sampled candidate prompts, the best kept and resampled), APO ([ProTeGi](#/papers/pryzant2023protegi "Automatic Prompt Optimization with 'Gradient Descent' and Beam Search (2023)"), text "gradients" from error analysis with bandit selection) and OPRO ([OPRO](#/papers/yang2023opro "Large Language Models as Optimizers (2024)"), an LLM optimizer guided by a meta-prompt), the optimizers the related work starts from (§ "Related work").
- TextGrad ([TextGrad](#/papers/yuksekgonul2024textgrad "TextGrad: Automatic 'Differentiation' via Text (2024)"), text feedback used like gradients) and EGO-Prompt ("graph optimization adapted for domain-knowledge", § "Related work": prompts refined with an evolving graph of domain knowledge; not listed here), baselines grouped as "Gradient-Based Methods" (§ "Baseline Methods").
- Zero-shot ("Think step by step") and two-shot chain-of-thought prompting (Kojima et al.; not listed here), the template baselines (§ "Baseline Methods").
- The UCB algorithm for multi-armed bandits (Han et al. 2024; not listed here), "to optimize the location and tendency of modification for long prompts" (§ "Introduction").

## Problem and setting

- **Question:** find the prompt minimizing the expected loss of a model's answers on a task (Eq. 1, § "Problem Formulation"), refining it "in a controlled, transparent, and stable manner" (§ "Introduction").
- **Models:** three, untrained: Gemini 2.5 Pro Preview 06-05, GPT-4o (2025-03-26) and Qwen3-VL-Plus (2025-09-23), all accepting images (§ "Models"); temperature 1.0, top-p 1.0 (§ "Task Result Generation").
- **Benchmarks** (§ "Benchmarks"): BBH (23 hard text tasks from BIG-Bench, a large crowd-sourced LLM task suite, where earlier models had not beaten average human performance); GSM8K ([GSM8K and trained verifiers](#/papers/cobbe2021verifiers "Training Verifiers to Solve Math Word Problems (2021)"), 8.5K grade-school math word problems); OCRBench V2, "OCRV2" (bilingual, text in images, 31 scenarios of locating and reasoning about text); VQA2017, "VQA" (open-ended questions about images in 13 types).
- **Data:** a fixed random 3% subset of each task branch is used during optimization, which the authors say balances "assessment cost with a reliable proxy for general capability"; the final prompts are evaluated on "the full held-out portion of each benchmark" (§ "Benchmarks"). Edit rewards are measured on "a holdout dev split" (§ "UCB-based Edit Selection"); how that split is drawn: not discussed.
- **What counts as correct:** a separate LLM grader, DeepSeek-V3, from a different company than the three models, scores each answer against the reference answer out of 100, following the benchmarks' grading rules (§ "Evaluation"). Tab. 1 is titled "Mean Performance Across Benchmarks".
- **Settings:** at most 20 rounds; stop early after 3 rounds without a reward above 0.5%, or when drift exceeds 10% (§ "Early Stopping and Check-pointing"); at most 100 bandit iterations (§ "UCB-based Edit Selection").

## Approach

- **Workflow** (Fig. 1, Alg. 1). **Initialization:** task requirements, possibly expert-refined, go into a meta-prompt; a small random training set is drawn (§ "Problem Formulation", "Initialization Phase").
- **Attributor:** run the prompt on the training set, split it into units, update the attribution scores, and write feedback packages for the top 4 units (§ "Attributor Phase").
- **Selector:** every arm is tried once, arms with non-positive reward are dropped, then UCB picks the edit (Eq. 7); the better of the old and edited prompt by dev score is kept (§ "Selector Phase", Alg. 1).
- **Optimizer:** the meta-prompt holds the last candidate, the location to change, suggestions and reasons; "the same model will be served with this meta-prompt to generate the new candidate in the next iteration" (§ "Optimizer Phase").
- **Drift control:** "protective actions" follow when drift exceeds a threshold for several consecutive rounds; high drift also stops the run; the best dev checkpoint is tested once (§ "Measuring Prompt Drift", § "Early Stopping and Check-pointing").
- No theorems: the gradient equations are introduced as "Analogous to gradient descent in optimization" (§ "Problem Formulation").

## Results

- The authors report an average gain of 13.28 points (printed "+13.28%") over Zero-Shot CoT "across all tasks and models", and a lead over OPRO on VQA (51.25 against 48.71) and OCRV2 (56.23 against 54.43), which are means over the three models, not printed in Tab. 1.
- **Case studies** (§ "Prompt Optimization Case Study"): an OCRV2 text-counting prompt grows from one line into one with an example and output rules, "moving from a failing to a passing grade".
- **Ablations** (§ "Ablation Study", GPT-4o, the subsets BBH sports understanding and OCRV2 reasoning VQA en):
  - Meta-prompt (Tab. 2): the full meta-prompt scores 76.8 and 65.7, against 68.4 and 56.8 without both components; removing Prioritizing Weak Elements costs more than removing Structured Reasoning.
  - Selection (Tab. 3, § "The Impact of Meta-Prompt Design"): "Our analytical selection strategy (utilizing the full meta-prompt)" against "a randomized baseline", 76.8 against 70.2 and 65.7 against 58.3, converging in 4 against 8 iterations with lower variance.
  - Input form (Tab. 4, § "The Impact of Input Representation"): images with a red box hinting the target answer score highest, then original images, then text-only captions written by GPT-4o.

## Limits the authors state

- Its evaluation "requires broader validation in professional technical domains", and "its generalization to other AI models needs further study" (same place).
- Most baselines, not designed for images, were modified to process them during prompt evaluation, and TextGrad's process is "inherently mismatched for multimodal tasks", so it is missing from VQA and OCRV2 (§ "Baseline Methods").

## Open problems and building blocks

- **Open:** future work on "improving efficiency with adaptive prompting and early stopping, refining causal attribution methods, generalizing on domain-specific benchmarks, and expanding cross-model testing with formal drift controls" (§ "Conclusion", "Discussion").
- **Released:** promised: a prototype with "a hierarchical attributor, UCB selector, meta-hint template library, logging, and checkpoints" (§ "Evaluation"), and "anonymized code, prompts, and logs", including meta-prompt templates, configurations, checkpoints and trajectories (§ "Reproducibility").
- **To reuse it:** an LLM, a parser model, an LLM grader with reference answers, training and dev splits; about 2,080 model calls per task branch on average (§ "Model Call Analysis").

## On this site

- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/promptopt-feedback">promptopt-feedback</a><a class="tag sub" href="#/tags/promptopt-general">promptopt-general</a></span>
