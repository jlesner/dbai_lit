# FLARE: Few-shot Learning-based Adaptive Reflective Engine

**FLARE** · preprint 2026

Read: [PDF](https://arxiv.org/pdf/2608.02919) · [arXiv](https://arxiv.org/abs/2608.02919)  
Code: [FLARE](https://github.com/microsoft/FLARE---Few-shot-Learning-based-Adaptive-Reflective-Engine)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Reflective instruction optimization combined with few-shot reference examples.
- Rewrites the instructions only; the few-shot reference examples are given to the optimizer (abstract).
- Reports beating GEPA on every task × model pair (abstract; 10 pairs, §5.1), including HotpotQA (Tab. 4); on classification it reports each method's best configuration across a sweep (Tab. 1 caption), picked on test scores by our reading.

## In plain words

Automatic prompt optimizers use an LLM to rewrite the instructions of an LLM task until they score better on labeled examples. The authors note that GEPA, a recent optimizer, argues that as models improve, evolving instructions alone can beat optimizing few-shot examples; they argue that instruction-only reflection "often lacks the grounding" needed for tasks where success or failure lies in "subtle execution patterns that abstract rules cannot fully capture" (§1). They build FLARE: in each round an optimizer LLM sees every validation example with the task model's answer, the correct answer and a right/wrong mark, plus a small set of labeled reference examples, diagnoses the failures and rewrites the instructions; the prompt that scores best on the validation set is kept (§3). With two GPT-5-series models on question answering over retrieved documents, tool calling and emotion classification, they report the best optimized score in all 10 task–model pairs (§5.1), such as 52.2 against GEPA's 42.2 on HotPotQA questions with GPT-5-Chat (abstract). They present this as showing that the recently argued shift "away from few-shot grounded optimization is premature" (§1).

## Background and terms

**Terms to know:** [reflective prompt optimization](#/glossary/reflective-prompt-optimization) · [Pareto front](#/glossary/pareto-front) · [reinforcement learning](#/glossary/reinforcement-learning) · [micro-F1](#/glossary/f1-score) · [multi-hop question answering](#/glossary/multi-hop-question-answering)

**The paper's own terms:**
- **meta-optimizer**: the LLM that reads the feedback and writes the next prompt; GPT-5.1 and GPT-5-Chat play this role (§3, §4.3).
- **error signal**: for each validation example, `CORRECT` if the metric gives the prediction full marks, otherwise `WRONG` together with the correct answer and the model's prediction (§3).
- **reference exemplars**: "the labeled examples shown to the optimizer as in-context references", as opposed to the validation set, which "drives the error-based optimization signal" (§4.1). §3 says the optimizer gets the complete training set each round "for context".
- **history window**: the validation scores and prompts of the last 3 rounds, shown to the optimizer so it can tell steady gains from oscillation around a local optimum (§3).
- **system instruction**: task-specific objectives for the optimizer, such as "maximize F1-score for multi-label classification" (§3).
- **light and heavy budget**: two optimization budgets under which GEPA is run in the GoEmotions sweep (§5.2, Tab. 2).

**Builds on:**
- GEPA ([GEPA](#/papers/agrawal2025gepa "GEPA: Reflective Prompt Evolution Can Outperform Reinforcement Learning (2026)")), a reflective optimizer that evolves instructions and searches a candidate pool by genetic–Pareto selection: the main baseline and the claim the paper challenges (§1, §2).
- DSPy ([DSPy](#/papers/khattab2023dspy "DSPy: Compiling Declarative Language Model Calls into Self-Improving Pipelines (2024)")), a framework that compiles LLM calls into "self-improving pipelines" (§2): FLARE is built on it (§3, §4.3).
- The baselines Promptomatix, which automatically searches the prompt space with a "synthetic-data-driven pipeline", and OpenAI's Prompt Optimizer, a dashboard tool that rewrites a prompt "according to current best practices" (§2, §3).
- Earlier optimizers cited together (§2): OPRO ([OPRO](#/papers/yang2023opro "Large Language Models as Optimizers (2024)")), APE ([APE](#/papers/zhou2022ape "Large Language Models Are Human-Level Prompt Engineers (2023)")), ProTeGi ([ProTeGi](#/papers/pryzant2023protegi "Automatic Prompt Optimization with 'Gradient Descent' and Beam Search (2023)")), and MIPROv2 ([MIPRO (shipped in DSPy as MIPROv2)](#/papers/opsahlong2024mipro "Optimizing Instructions and Demonstrations for Multi-Stage Language Model Programs (2024)")), which GEPA "reports surpassing", the reason GEPA is the primary baseline.

## Problem and setting

- **Question:** does grounding reflection in concrete, per-example failures plus few-shot references beat instruction-only evolution such as GEPA's (§1)?
  - GoEmotions: multi-label emotion classification with 28 labels, scored on the full held-out test split of 5,408 examples; the reference set is fixed at 50 examples while the validation set is swept from 10 to 1,000.
  - Tool calling: examples from τ²-bench (airline and retail customer-service conversations), recast as a single-turn task of picking the right tool and its arguments.
  - Retrieval-augmented generation (RAG): HotPotQA and 2WikiMultiHopQA (multi-hop questions) and MedQA (medical exam questions), answered over retrieved documents.
- **Metrics (§4.2), "aligned with the Azure AI Evaluation framework"**: F1 for classification; for tool calling, the average of three sub-metrics, Tool Call Accuracy (correct tool selection), Intent Resolution (capturing user intent) and Task Adherence (following specifications); for RAG, a "retrieval-aware composite" computed as 0.3 × retrieval + 0.7 × generation quality.
- **Models and settings (§3, §4.3):** GPT-5.1 and GPT-5-Chat through Azure OpenAI; temperature 1.0 and at most 16,000 output tokens for both the optimizer and the evaluated model, "rather than employing deterministic inference for evaluation"; 40 rounds. "Unless otherwise noted", scores are mean ± SD (standard deviation) over three seeds.
- **Baselines:** GEPA everywhere; Promptomatix on classification and tool calling; OpenAI's optimizer on classification only. Tab. 3's caption says OpenAI's optimizer, and Tab. 4's says both, rewrite prompts from examples alone, so they cannot act on the tool-execution loop (Tab. 3) or the retrieval-weighted part of the score (Tab. 4).
- **What counts as correct:** the task metric; the test set "is used solely for reporting and never informs prompt selection" (§3).

## Approach

- **Loop (§3, Alg. 1):** start from the instruction in the task's DSPy signature (its declared inputs and outputs) and score it. In each of the rounds, run the current best prompt on every validation example, build the error signals, and give the optimizer the best prompt, the error-labeled validation set, the complete training set, the system instruction, the current validation score and the history window. Score the new prompt on the validation and test sets, and keep it if its validation score beats the best so far. The output is the "validation-maximizing prompt, not the final iteration" (Alg. 1).
- **Diagnose and repair:** the optimizer runs a "thinking" phase over each validation example, alongside the task model's prediction and an explicit correctness label, diagnoses the root cause of each failure and rewrites the prompt "with targeted corrections" (§1). App. A shows the GPT-5.1 GoEmotions run: the feedback and prompts of rounds 1, 10 and 20, where round 20 gave the validation-best prompt.
- **Tool calling:** a ground truth with several tool calls is split into one example per call, so the optimizer can see whether errors stem from tool choice, argument values or JSON format (§3).
- **Contrast with GEPA:** no population or Pareto frontier; a single prompt is refined in a direct feedback loop (§3).

## Results

All are the authors' reports; unless the paper notes otherwise, mean ± SD over three seeds (§4.3).
- **Overall:** FLARE has the best optimized score in all 10 task–model pairs (§5.1), with gains over the unoptimized prompt from +1.6 points (2WikiMultiHopQA, GPT-5.1) to +15.3 (GoEmotions, GPT-5.1) (§5.1).
- **GoEmotions (Tab. 1):** with each method's "best configuration across the validation-set-size sweep" (caption), FLARE lifts GPT-5.1 from 37.46 to 52.72 (+15.3), against GEPA's 43.64 (+5.7), OpenAI's optimizer at 47.8 and Promptomatix at 38.0; on GPT-5-Chat, 48.69 against GEPA's 44.87.
- **Tool calling (Tab. 3):** FLARE reaches 87.0 on both models, against GEPA's 81.0 (GPT-5-Chat) and 76.0 (GPT-5.1).
- **RAG (Tab. 4):** HotPotQA with GPT-5-Chat: FLARE 52.2 (+14.2 over its unoptimized 38.0) against GEPA's 42.2. 2WikiMultiHopQA shows "more modest improvements", "possibly due to the inherent complexity of the retrieval and inference chain" (§5.1).
- **Data efficiency (§5.2, Tab. 2, Fig. 1):** with GPT-5.1, FLARE scores 42.78 with 10 validation examples, peaks at 52.72 with 100, and settles into a 50–51% plateau up to 1,000, where more data "does not help"; the authors say the same qualitative shape holds for GPT-5-Chat.
- **Budget (§5.2):** the authors conclude that, within the range of budgets they tested, "spending more compute on GEPA's evolutionary search does not improve its accuracy", and that FLARE's advantage comes "from a more sample-efficient search rather than a larger one".
- **Stability (§5.2):** FLARE's SDs stay between roughly 0.3 and 2.1 points across the GoEmotions sweep, while GEPA's reach ±7.59 (heavy budget, GPT-5-Chat, 10 examples).

## Limits the authors state

- "The variability in performance across task types suggests that no single optimizer is universally optimal" (§6).
- The 2WikiMultiHopQA results "may indicate limitations in addressing multi-step retrieval errors through prompting alone" (§5.3).
- FLARE re-scores every candidate on the full validation set, spending roughly 2.3 times the model-evaluation calls of GEPA with the heavy budget at FLARE's best GoEmotions configuration (100 validation examples, GPT-5.1); the authors call this "a favorable trade-off" for a "one-time offline cost" (§5.2).

## Open problems and building blocks

  - "adaptive or ensemble optimization strategies that select or combine methods based on task characteristics" (§6);
  - "hybrid approaches combining prompt optimization with improved retrieval mechanisms" (§5.3);
  - "further work on error-driven optimization and the strategic use of few-shot supervision" (§6); the abstract calls the strategic optimization of few-shot learning "a critical frontier".
- **Released:** an "Official implementation" (§1, footnote 1); App. A says the full optimized prompts are "reproducible through our released code".
- **To reuse it:** a strong optimizer LLM (GPT-5.1 or GPT-5-Chat via Azure OpenAI), DSPy, a task metric whose full score marks an example correct, a labeled validation set (the authors report a GoEmotions gain with GPT-5.1 from 10 examples), and a validation pass per candidate per round over 40 rounds (§3, §4.3, §5.2).

## On this site

- **Discussed in:** [Comparing LLM methods under noise](#/challenges/method_comparison_under_noise)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/promptopt-feedback">promptopt-feedback</a><a class="tag sub" href="#/tags/promptopt-general">promptopt-general</a></span>
