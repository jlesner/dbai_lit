# SIPDO: Closed-Loop Prompt Optimization via Synthetic Data Feedback

**SIPDO** · preprint 2025

Read: [PDF](https://arxiv.org/pdf/2505.19514) · [arXiv](https://arxiv.org/abs/2505.19514)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- A closed loop in which a synthetic data generator writes examples that expose the current prompt's weaknesses and a prompt optimizer revises the prompt (abstract).
- The generator draws the label first, then the input, at a set difficulty tier (§3.1); its analysis assumes the generator preserves labels (A1, §3.3).
- Prompt-space prior work for Proposer–solver self-play: a proposer–solver loop with no weight updates; its labels are generated, checked by a rule-based decoder only on Geometric Shapes and by three "expert agents" on MMLU, which the paper doesn't describe further (§3.3, §4.2).

## In plain words

Most prompt optimizers tune a prompt on one fixed set of examples, so the prompt can fail when the inputs change; the authors say stable behaviour matters in fields such as healthcare and finance (abstract, §1). They build SIPDO, a loop of two LLM-driven parts. A data generator writes new question–answer examples, step by step harder, designed to challenge the current prompt; it picks the answer first, then writes a question to fit it. A prompt optimizer studies the mistakes, rewrites the prompt, and accepts the rewrite only once it answers the new example and all earlier ones correctly. They also prove a high-probability bound on a fixed prompt's error on the hardest generated data, under five assumptions (§3). On six reasoning tasks from the BIG-Bench suite, SIPDO has the highest average accuracy with three of four models and is 0.1 points below the PromptAgent optimizer with GPT-4o (§4.3); averaged over three logic benchmarks it beats every baseline with both models tried. The authors call it "a novel pathway for improving prompt robustness" (§1).

## Background and terms

**Terms to know:** [curriculum learning](#/glossary/curriculum-learning) · [reflective prompt optimization](#/glossary/reflective-prompt-optimization) · [first-order logic](#/glossary/first-order-logic).

**The paper's own terms:**
- **Data Generator**: writes synthetic input–label pairs at a set difficulty (§3.1); in §4.2's Causal Judgment template, an LLM prompted with the task, two real examples and past generated samples.
- **Auto Prompt Optimizer**: repairs the prompt by error analysis, recommendation and targeted refinement, then local and global confirmation (§3.2).
- **difficulty level `c`**: a number from 1 to `n` (not the theorem's `n`) given to the generator, whose prompt states the maximum and current level (§3.1, §4.2); the **difficulty gradient** is this rising schedule (§4.4).
- **label prior**: an estimate of how often each label occurs in the true data distribution (§3).
- **KL penalty `R(ψ)`**: here the KL divergence (how different two probability distributions are) between the generator's label distribution and the label prior, penalizing drift from realistic label frequencies (§3.1); not the RL sense of the glossary entry. `ψ` is the generator's parameters, `λ` a weight.
- **three-voter check**: "three expert agents independently verify each generated item for label–input consistency and basic factual correctness" (§3.3, A1).

**Missing glossary terms:**
- **surrogate loss and 0–1 loss**: the 0–1 loss is 1 for a wrong answer, 0 for a right one; a surrogate loss is a smoother training loss, here bounded between 0 and 1 (§3, A5).
- **uniform convergence**: with high probability, the loss measured on a sample is close to the true expected loss for every prompt at once; A3 words it per prompt (§3.3).

**Builds on:**
- LLM rewriting from natural-language feedback ([ProTeGi](#/papers/pryzant2023protegi "Automatic Prompt Optimization with 'Gradient Descent' and Beam Search (2023)")), self-reflection ([Reflexion](#/papers/shinn2023reflexion "Reflexion: Language Agents with Verbal Reinforcement Learning (2023)")) and planning (PromptAgent), which their "hybrid framework" integrates (§2.1).
- Baselines (§4.1): PromptAgent ("uses Monte Carlo Tree Search to iteratively improve prompts": a tree search over prompt edits, guided by sampled trials), Automatic Prompt Engineer ([APE](#/papers/zhou2022ape "Large Language Models Are Human-Level Prompt Engineers (2023)"); "refines prompts via Monte Carlo search and model feedback") and chain of thought on BIG-Bench; TextGrad (textual feedback as a gradient, [TextGrad](#/papers/yuksekgonul2024textgrad "TextGrad: Automatic 'Differentiation' via Text (2024)")), its momentum variant, REVOLVE (uses the trajectory of responses) and ANN (Agentic Neural Networks: agents as a layered network) on MMLU; Neuro-Symbolic (cited as Logic-LM; "converts LLM outputs into structured forms for rule-based inference") on logic.
- Data-augmentation theory (Wang et al. 2022, Chen et al. 2020, Dao et al. 2019), whose kind of guarantee they aim to give; A3 is from Wang et al. (§3.3).

## Problem and setting

- **Question:** can a closed loop that generates harder labelled examples aimed at a prompt's weaknesses improve it "without assuming access to external supervision or new tasks" (abstract)?
- **Correctness:** a prompt's score is the share of examples where the model's output equals the target label (§3.2, Eq. 2).
- **Models:** GPT-4o, GPT-4o-mini, Gemini-1.5-flash, Gemini-1.5-pro; one model drives generation and refinement in each run, tested at temperature 0.0 (§4.3). For MMLU: "we set up the SIPDO pipeline using the GPT-4o model, except for the GPT-4o-mini during the testing phase" (§4.3). Difficulty budget 10, or 25 for Penguins and Geometric Shapes, with as many iterations (§4.2).
- **Benchmarks (§4.1):** six BIG-Bench tasks, 4689 instances: Penguins In a Table (questions on a small table), Geometric Shapes (name the shape an SVG path draws), Epistemic Reasoning (does a premise about beliefs entail a hypothesis), Object Counting, Temporal Sequences (find a free time slot) and Causal Judgment (did someone in a story cause an outcome), as App. E's examples show; 600 depth-5 ProofWriter items (deduction from stated rules and facts); 204 FOLIO items "that require first-order inference over short passages"; 500 5-hop PrOntoQA items (multi-step deduction over made-up facts); and MMLU (multiple-choice exam questions) in college Biology, Computer Science and Machine Learning.
- **Not discussed:** whether the generator's parameters are trained with Eq. 1 in the experiments, where §4.2 describes a prompted model.

## Approach

- **Generating an example (§3.1):** draw a target label from the label prior; sample a hidden cue capturing the structure of the few real examples; write an input for that label at level `c`. Across rising levels, a summarizer turns each input into the next level's cue. In practice they fix the target label and prompt the model to write a matching question (§4.2). The objective (Eq. 1) trades the KL penalty against the prompt's loss on generated data.
- **Checking labels (§4.2):** for MMLU, three expert agents review each item and only unanimous approvals pass. For Geometric Shapes, coordinates are rounded, a matching SVG template has only its vertices perturbed, and a rule-based decoder counts line and arc commands and rejects samples whose inferred label disagrees.
- **Repairing the prompt (§3.2, Fig. 1):** if the prompt makes no errors on the synthetic set, stop. Otherwise a reflection module writes a textual patch (why it failed, how to change it) and an editor applies it. Local confirmation retests on the current errors, repeating the patch until they are fixed; global confirmation retests on every synthetic example so far and sends new errors back. Then the next, harder example is drawn. Templates: App. D.
- **Stopping (§3.2 "Convergence guarantee"):** as the score never falls and is at most 1, the authors state the process stops after at most `M` (the number of generated examples) successful corrections or a user cap, and the returned prompt is right on every synthetic example "whenever it is attainable within the budget".
  - **A1 (label preservation):** for every generator setting and every real example, an input derived from it keeps its label with probability 1.
  - **A2 (approximate maximizer):** the trained generator is within `ε` of the best value, over all settings, of the prompt's expected surrogate loss on generated data minus the KL penalty divided by `λ`; `ψ*` is that best setting.
  - **A3 (uniform convergence):** for every prompt, with probability `1 − δ`, sample and true loss differ by at most `q`, which in its standard form grows with the logarithms of the number of prompts and of `1/δ` and shrinks with sample size.
  - **A4 (alignment of risks):** for any prompt and generator, expected surrogate loss on generated data is at most that on real data plus the KL penalty divided by `λ`; the authors derive it from the Donsker–Varadhan formula (an identity for KL divergence).
  - **A5 (surrogate link):** the 0–1 loss is at most the surrogate loss at every point.
- **Theorem 3.1 (§3.3; proof App. F):** bounds how often a prompt can be wrong on the hardest data any generator in the family produces. Under A1–A5, for any fixed prompt in the prompt set, with probability at least `1 − δ` over the draw of the training set, that worst-case error rate is at most the prompt's average surrogate loss on the `n` training examples, plus the KL penalty of `ψ*` divided by `λ`, plus `ε`, plus `q`. A larger `λ` lowers the worst-case error "but potentially harming accuracy" (§3.3).

## Results

- **BIG-Bench (Tab. 2):** it reports average accuracy of 89.1 for SIPDO against 89.2 for PromptAgent with GPT-4o, and 87.3 against 85.2 with GPT-4o-mini; SIPDO's average is also highest with both Gemini models. PromptAgent leads on Geometric Shapes and Epistemic with GPT-4o.
- **Logic (Tab. 3):** averaged over the three benchmarks, 86.4 against Neuro-Symbolic's 82.0 with GPT-4o, and 83.9 against 77.4 with GPT-4o-mini. Neuro-Symbolic stays best on ProofWriter.
- **MMLU (Tab. 1, GPT-4o):** 93, 93.8 and 96.5 in Computer Science, Machine Learning and Biology, against the best baseline's 90 (REVOLVE), 90.1 (ANN) and 96.5 (TextGrad and REVOLVE).
- **Difficulty gradient (Tab. 4, §4.4):** without it every BIG-Bench task drops: "On average, GPT-4o loses 17.3% accuracy, while the weaker GPT-4o-mini drops 24.3%", most on Object Counting and Geometric Shapes. On the authors' synthetic suites, a one-shot sampler of the most unusual examples "delivered no measurable gain".
- **Voters (Tab. 7):** on Machine Learning, 76.79 without the three voters against 93.8 with them; smaller gaps on the other subjects.
- **Cost (App. A):** SIPDO runs faster than PromptAgent on every BIG-Bench task with both GPT models (Tab. 6; e.g. 156 s against 18,232 s, Causal Judgment, GPT-4o). Tab. 5: cost per difficulty level; Tab. 8: component ablation.

## Limits the authors state

- LLMs "sometimes assign unexpected labels" (§3.3, A1); "Constructing complex or irregular shapes exceeds the limits of few-shot methods" (§4.2).
- A perfect generator maximizer "would be ideal but is infeasible"; the shortfall `ε` "directly appears in the bound" (§3.3, A2).
- Extreme samples "were either solved instantly or only slight perturbations of original cases"; real-world corpora may hold edge cases "that our synthetic tasks do not capture" (§4.4).

## Open problems and building blocks

- **Open:** "Further investigation on domain specific corpora such as financial filings and clinical notes and exploration of fully automated variants that refine prompts through continuous model feedback" (§5); the extremes sampler on real-world corpora (§4.4).
- **Released:** Nothing stated. The paper prints its prompts and generated examples (App. B–E).
- **To reuse it:** one LLM; a few real labelled examples and a label-frequency estimate; exact-match answers; for hard domains, three reviewing agents or task checks like the geometry decoder (§4.2).
- **Beyond its domain:** the authors call the framework "highly generalizable across tasks and domains" (§3.2).

## On this site

- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/promptopt-feedback">promptopt-feedback</a><a class="tag sub" href="#/tags/promptopt-general">promptopt-general</a></span>
