# Failure-Guided Co-Evolution of Prompts and Training Data

**FORGE** · preprint 2026

Read: [PDF](https://arxiv.org/pdf/2609.15209) · [arXiv](https://arxiv.org/abs/2609.15209)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Co-evolves the prompts and the training data of an LM program whose model weights are frozen (§ "Problem Formulation"; the paper numbers no main-text sections).
- Abstracts failures into failure modes, synthesizes new instances with four mutation strategies, and admits them through a verifier agent (abstract; § "Introduction", § "Failure-Guided Data Synthesis").
- Prompt-space prior work for Proposer–solver self-play; its verifier is an LLM agent, not a program.

## In plain words

Prompt optimizers improve a pipeline of LLM calls by rewriting its prompts from feedback, typically on a fixed set of training examples. The authors argue that this exposes only weaknesses already in those examples, so when progress stalls it is unclear whether the prompts or the data have run out (abstract; § "Introduction"). Their system, FORGE, uses each failed run twice: to revise the prompt, and to describe a reusable failure pattern from which an LLM writes new training examples in four directions; a second LLM agent checks each example before it is added (abstract). With Qwen3.5-35B-A3B as the prompted model and GPT-5.5 as optimizer, they report that the average score over eight benchmarks rises 16.52 percentage points over the unoptimized pipeline, above three other prompt optimizers (abstract). On three benchmarks, adding FORGE's examples improves all nine runs of those optimizers and all three runs that train the model's weights with [reinforcement learning](#/glossary/reinforcement-learning), each at the same budget as with the original data (abstract). They present this as making training data a changing part of prompt optimization (§ "Introduction").

## Background and terms

**Terms to know:** [reflective prompt optimization](#/glossary/reflective-prompt-optimization) · [Pareto front](#/glossary/pareto-front) · [LLM-as-a-judge](#/glossary/llm-as-a-judge) · [reinforcement learning](#/glossary/reinforcement-learning) · [GRPO](#/glossary/grpo)

**The paper's own terms:**
- **APO**: automatic prompt optimization. **Fixed-data APO** keeps one training set; **adaptive-data APO** may add accepted synthetic examples to it, never removing or changing originals (§ "Problem Formulation", Eqs. 1–2).
- **Imperfect execution**: a run on one example scoring below 1, the maximum (§ "Problem Formulation").
- **Task model / optimizer model**: the frozen model that runs the program, and the model that edits prompts, assigns failures, and generates and verifies examples (App. B.3).
- **Failure mode**: a short name and a mechanism description with specific entities removed, plus the failed runs supporting it (§ "Failure Memory"; App. A.1). An LLM **assigner** files each imperfect execution under an existing mode, a new one, or a refined one (App. A.4). Only modes collected since the last synthesis event are **active** (App. A.1).
- **Synthesis event**: a round of example generation, triggered after a set number of prompt-search steps (the **patience**) without a gain in the best average validation score (Alg. 1; App. A.6).
- **Validity / faithfulness**: the verifier's two yes/no verdicts: the example is well formed, coherent and correctly labelled; and it matches the targeted failure mode and mutation direction (App. A.6).

**Missing glossary terms:**
- **LM program**: a program combining prompted LLM calls with retrieval, tools and intermediate computation, whose behaviour is set largely by its module prompts (§ "Introduction").

**Builds on:**
- GEPA ([GEPA](#/papers/agrawal2025gepa "GEPA: Reflective Prompt Evolution Can Outperform Reinforcement Learning (2026)")), which "combines trace reflection with Pareto selection" (§ "Related Work"); FORGE's prompt branch is a reflective-search backbone the authors say it inspired (§ "Optimization Loop").
- The baselines MIPROv2 ([MIPRO (shipped in DSPy as MIPROv2)](#/papers/opsahlong2024mipro "Optimizing Instructions and Demonstrations for Multi-Stage Language Model Programs (2024)"); searches instructions and demonstrations), ACE ([ACE](#/papers/zhang2025ace "Agentic Context Engineering: Evolving Contexts for Self-Improving Language Models (2026)"); curates a structured playbook) and GEPA (§ "Experimental Setup"; § "Related Work").
- Prompt optimizers that also synthesize data: PromptWizard, Promptomatix, Data-Prompt Co-Evolution, SIPDO ([SIPDO](#/papers/yu2025sipdo "SIPDO: Closed-Loop Prompt Optimization via Synthetic Data Feedback (2025)"); synthesis at a controlled difficulty tier) and CASPER (§ "Related Work").
- Training-data synthesis from a learner's errors (LLM2LLM, DISCERN, DataEnvGym, STAT, ReverseGen) and [self-play](#/glossary/self-play) with weight updates (Absolute Zero, [Absolute Zero](#/papers/zhao2025absolutezero "Absolute Zero: Reinforced Self-play Reasoning with Zero Data (2025)"); CoEvolve) (§ "Related Work").

## Problem and setting

- **Question:** "can automated reflective search over discrete prompts for heterogeneous LM programs treat training data as a mutable optimization state?", and do the data stay useful for later weight training (§ "Introduction").
- **Fixed parts:** frozen model weights; a score from 0 to 1 plus textual feedback per run; the validation set selects prompts and schedules synthesis but never supplies examples; the test set is only reported (§ "Problem Formulation").
- **Benchmarks** (§ "Experimental Setup"; splits Tab. 5): HotPotQA and HoVer (multi-hop retrieval over Wikipedia: answering questions, finding a claim's supporting documents), IFBench (verifiable instructions), FiNER-139 (financial entity classification), LawBench (here, criminal-charge prediction), AIME-2025 (competition math), MMLU-Pro (multiple-choice knowledge) and AppWorld (an agent acting in simulated apps with persistent state).
- **Models:** task models Qwen3.5-35B-A3B (mixture-of-experts: only part of the network runs per token) and the dense Qwen3-8B, thinking disabled; optimizer GPT-5.5 at medium reasoning effort (App. B.3).
- **Budget matching:** FORGE runs first; its count of per-example program runs is the ceiling passed to GEPA and ACE "when their APIs permit"; MIPROv2 is kept under it by estimate (App. B.4). One seed (App. B.4); run-to-run variance: not discussed.
- **What "correct" means for a synthetic example:** the verifier's two verdicts (App. A.6). A two-stage AI-and-human audit checks generated examples only for overlap with validation and test data, and finds none (App. D.2).

## Approach

- **The loop (§ "Optimization Loop", Alg. 1).** Each step picks a parent prompt, runs a minibatch and sends every imperfect execution down two branches. The prompt branch has the optimizer read one module's failed traces and feedback and write a replacement prompt, kept only if it beats the parent on the same minibatch (App. A.5). Parents are drawn by "frontier-based parent selection": in proportion to the number of validation examples where a candidate has the top score, excluding any candidate another is at least as good as everywhere and better than somewhere (App. A.2). The memory branch updates the failure memory. When validation progress stalls, a synthesis event adds verified examples.
- **Failure modes (§ "Failure Memory").** Generating from a single failure "can easily collapse into near-duplicate generation", the authors say, so FORGE abstracts the mechanism. Example: AppWorld tasks on Spotify and on Venmo both failed because the agent took the first page of results for the whole list; both are listed as "incomplete paginated search".
- **Four mutation strategies (§ "Failure-Guided Data Synthesis").** Each attempt gets one mode and one of its failed runs. Positive keeps the required behaviour under new details; negative builds a contrast case where the fix should not apply; boundary changes the one condition that decides the right behaviour; stress adds distractors or interacting constraints. In their HotPotQA example, the mode "noncanonical answer text" (right person, wrong name form) yields: another actor's full biographical name (positive); a question whose answer must be a stage name (negative); the original reworded to ask for the professional name (boundary); and a question padded with articles about namesakes (stress). Attempts are split across modes by how many failures support each (App. A.6, Alg. 3).
- **Verifier agent (§ "Failure-Guided Data Synthesis"; App. A.6).** Generator and verifier are separate multi-step LLM agents with benchmark tools (on HotPotQA, the program's own Wikipedia search index). The verifier sees the example, mode, intent, source failure and the generator's tool activity, not the source program trace. Only examples with both verdicts true are admitted, a check added "Because tool grounding alone does not guarantee quality".
- **Transfer study (§ "Transferability of Synthesized Data"; App. B.5).** On HotPotQA, FiNER-139 and LawBench, MIPROv2, ACE and GEPA each run with and without FORGE's admitted examples at a fixed budget; two GRPO runs from the same Qwen3.5-35B-A3B checkpoint differ only in training data, each for 100 steps with identical settings (Tab. 6).

## Results

- **Main comparison (§ "Main Results", Tab. 1; Qwen3.5-35B-A3B task model, GPT-5.5 optimizer).** The authors report an average test score of 72.18 against 55.66 unoptimized and 63.36–67.26 for the three baselines; FORGE is not best on IFBench or MMLU-Pro.
- **Ablation (§ "Component Ablation", Tab. 2).** Prompt search alone 64.17; plus synthesis from random training examples 62.38; plus failure memory 68.24; plus mutation guidance 72.18. The authors conclude that more data alone does not provide "the targeted evidence needed for optimization".
- **Synthesis accounting (§ "Synthesis Accounting and Failure Dynamics", Fig. 3).** FORGE admits 22 of 30 attempts on AIME-2025, 39 of 40 on AppWorld, 80 of 100 on HotPotQA and 93 of 100 on FiNER-139; 11 more are malformed outputs, and of 25 verifier rejections, 9 fail validity only, 7 faithfulness only and 9 both. Between the first and final synthesis events the failure modes change and their counts become more balanced.
- **Second task model (§ "Generalization Across Task Models", Tab. 3).** With Qwen3-8B: 50.97 against 36.88 unoptimized and 45.59 for GEPA, the strongest baseline.
- **Transfer (§ "Transferability of Synthesized Data", Tab. 4, Fig. 4).** With FORGE's examples added at matched budgets, all nine prompt-optimizer runs improve, and GRPO gains 8, 4 and 8 points at step 100 on HotPotQA, FiNER-139 and LawBench; the authors say these gains "emerge at different stages and need not increase monotonically".
- **Supplementary (App. D.1).** With DeepSeek-V4-Pro as optimizer on six benchmarks, the authors call FORGE "largely insensitive to optimizer-model choice" (Tab. 7).

## Limits the authors state

- The ablation is cumulative, so "these deltas represent conditional contributions rather than isolated main effects" (§ "Component Ablation").
- "This protocol aligns a common task-program evaluation ceiling rather than exact realized compute: GEPA may overshoot at iteration boundaries, MIPROv2's estimate excludes proposal-stage calls, and ACE may stop early under its native rule" (App. B.4); the unoptimized baseline is "a control rather than a cost-matched optimizer" (App. B.4).
- On AppWorld, generator and verifier share one task-authoring interface; "the present runs do not implement verification as an independently read-only path" (App. B.2).
- The displayed synthetic examples "do not constitute an independent human correctness audit" (App. C.3).

## Open problems and building blocks

- **Open:** "Future work should broaden this transfer evaluation across additional tasks and model families and disentangle the effects of dataset size, example selection, and sampling distribution" (§ "Conclusion").
- **Released:** Nothing stated.
- **To reuse it:** a frozen task model and an optimizer model (GPT-5.5, or DeepSeek-V4-Pro in App. D.1) (App. B.3); an evaluator returning a score and textual feedback, and benchmark tools for generator and verifier (App. B.2). GRPO used eight 48-GB NVIDIA RTX A6000 GPUs (App. B.5).

## On this site

- **Discussed in:** [Self-improvement that compounds](#/challenges/compounding_self_improvement)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/promptopt-evolve">promptopt-evolve</a><a class="tag sub" href="#/tags/promptopt-general">promptopt-general</a></span>
