# MAGE: Understanding Stability-Performance Trade-offs in Multi-component Prompt Optimization

**MAGE** · preprint 2026

Read: [PDF](https://arxiv.org/pdf/2607.11944) · [arXiv](https://arxiv.org/abs/2607.11944)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- A controlled platform for how memory, Pareto selection and adaptive evaluation interact in reflective optimization.
- Ablations across seeds.
- Its own skeptic result: fixed prompts beat all reflective optimizers ("scaffold choice dominates optimizer choice", abstract), and on GSM8K-Hard GEPA and every MAGE variant score below it, while MIPROv2 with its CoT scaffold scores above it (Tab. 1), against the abstract's "failure-grounded reflection is essential". Its variance evidence (POCE) rests on 3–5 seeds (§5.2, Limitations).

## In plain words

Reflective prompt optimizers let an LLM rewrite a prompt after reading concrete failure cases. Real-world pipelines combine memory, selection and evaluation in such loops, and the author asks how these parts interact when combined (§1). The motivation: "Most prior work reports single-seed peak performance", hiding the cost in run-to-run instability (§1). The author builds MAGE, which adds three parts to the optimizer GEPA: a memory of earlier runs, selection over several goals (accuracy, brevity, safety), and a judge that recalibrates itself. Switching these on one at a time on small math and logic benchmarks, the full MAGE reaches 46.4% against 34.0% for the author's re-implementation of GEPA on the math set, with similar spread, over 5 random seeds on gpt-4o-mini (abstract). Yet with 30 training examples, well-designed fixed prompts beat all the reflective optimizers (abstract). MAGE "is not proposed as a superior optimizer in absolute terms" but as "a controlled analysis framework", and its main finding is called "a previously unreported phenomenon" (abstract): combining parts raises both scores and spread in ways the parts alone do not predict.

## Background and terms

**Terms to know:** [reflective prompt optimization](#/glossary/reflective-prompt-optimization) · [Pareto front](#/glossary/pareto-front) · [LLM-as-a-judge](#/glossary/llm-as-a-judge) · [bootstrap resampling](#/glossary/bootstrap-resampling)

**The paper's own terms:**
- **POCE (Prompt Optimization Coupling Effect)**: "the observation that combining multiple stochastic optimization signals produces non-additive behavior, where both performance and variance emerge in ways not predictable from individual components" (§1); §6: the full system's variance is not roughly the sum of the components' (Eq. 3).
- **Seed prompt**: the plain starting instruction the optimizers begin from (Alg. 1; §5.1); distinct from a random **seed** (42, 123, …), which labels one repeated run (§5.1).
- **Scaffold**: the fixed prompt format optimized inside, e.g. a plain instruction or a chain-of-thought template (§5.1–5.2).
- **Fixed prompt upper bounds**: three unoptimized prompts: the seed prompt, CoT-zero (zero-shot chain of thought) and CoT-math ("a structured task-specific prompt") (§5.1).
- **Candidate pool size n**: how many new prompts are proposed per iteration (Alg. 1).
- **MAGE-M, MAGE-P, MAGE-E, MAGE (full)**: ablation variants named for the memory, Pareto and evaluator components, and all three together (Tab. 2).
- **P(method > GEPA)**: the share of 10,000 bootstrap resamples in which the method's mean beats GEPA's; above 0.95 counts as "strong evidence" (§5.2, footnote).
- **Headroom**: room for optimization to improve on the seed prompt's accuracy (§6).

**Builds on:**
- GEPA ([GEPA](#/papers/agrawal2025gepa "GEPA: Reflective Prompt Evolution Can Outperform Reinforcement Learning (2026)")), which rewrites prompts from concrete failure cases; MAGE adds its three components to GEPA's loop (§4), which it re-implements (§5.1).
- The baselines (§5.1): OPRO ([OPRO](#/papers/yang2023opro "Large Language Models as Optimizers (2024)")), "score-only proposal, no reflection"; Self-Refine (not listed here), "abstract self-critique without failure cases"; MIPROv2 ([MIPRO (shipped in DSPy as MIPROv2)](#/papers/opsahlong2024mipro "Optimizing Instructions and Demonstrations for Multi-Stage Language Model Programs (2024)")), the Bayesian optimizer of the DSPy framework ([DSPy](#/papers/khattab2023dspy "DSPy: Compiling Declarative Language Model Calls into Self-Improving Pipelines (2024)")), on a chain-of-thought scaffold.

## Problem and setting

- **Question:** "how do different optimization components interact when combined within a single system?" (§1).
- **Objective:** the prompt with the highest accuracy, the share of answers equal to the label (Eq. 1); MAGE adds brevity and a safety score (§4.2). How the safety score is computed is not discussed.
- **Benchmarks (§5.1):** GSM8K-Hard, 82 multi-step arithmetic problems; BBH-Logic-Hard, 81 "adversarial logical deduction problems from Big-Bench Hard" (a suite of hard reasoning tasks). Each uses 30 training and 50 test questions, so "Each test question equals 2% accuracy".
- **Main model (§5.1):** gpt-4o-mini (a small OpenAI model) at temperature 0; 3 iterations; n = 3 (n = 5 for the diversity experiment); 5 seeds. Memory is "initialized empty at the start of each seed and reset between benchmarks".
- **Second model:** Llama 3.1 8B (an open 8-billion-parameter model, run locally via Ollama), 12 training and 30 test questions, 3 seeds (§5.1).
- **On-device study (§7, App. C):** a 1.5B model (`deepseek-r1:1.5b`) as a phone assistant that must call `cab_book` for any transport request; 20 author-built tasks in four tiers, the hardest adversarial; binary scoring; Llama 3.1 8B as optimizer; 5 seeds.

## Approach

MAGE runs a GEPA-style loop with three switchable additions (§4; Alg. 1):

- **Episodic memory (§4.1):** stores past runs (task embedding, best prompt, reflection trace, scores); the closest entries are shown to the proposer before the loop, and the best result is written back at run end. The experiments retrieve by Jaccard word overlap (§5.1; App. B).
- **Multi-objective Pareto selection (§4.2):** candidates are scored on accuracy, negative token length and safety, and the loop keeps those no other candidate dominates (at least as good on every objective, better on one). The author states that pool size "critically mediates Pareto effectiveness": at n = 3 candidates differ too little in accuracy, at n = 5 "the front becomes informative". The author claims, "To our knowledge", to be "the first to apply Pareto-front reasoning over user-defined quality objectives within iterative prompt optimization" (§2).
- **Ensemble-anchored adaptive evaluator (§4.3):** candidates are scored by a weighted mix of a fixed evaluator and an adaptive one that a meta-reflection step ("MetaReflect", Alg. 1) revises each iteration; the fixed one's weight starts at 0.8 and is multiplied by 0.7 per iteration (Eq. 2; §5.1). Motivation: a fixed evaluator accumulates bias bounded by a term proportional to the number of iterations (§4.3). App. D's critiques on one seed move from crediting longer prompts to shorter ones, read as "self-correction".
- **Stability bound (App. A):** "a formal bound under idealized assumptions" (§4.3): the evaluator's total drift from the fixed one, summed over all iterations, stays below a limit set by the largest adaptive–fixed gap and the decay rate, which does not grow with the number of iterations.

## Results

GSM8K-Hard, gpt-4o-mini, mean ± standard deviation over 5 seeds, unless noted (Tab. 1).

- **Fixed prompts against optimizers:** GEPA's optimized prompts score 34.0% while the unoptimized seed prompt scores 62.4%, "a −28.4% regression" the author attributes to overfitting 30 training examples, "not implementation error" (§5.1–5.2). CoT-math is "outperforming all reflective optimizers" (§5.2): "scaffold choice dominates optimizer choice in low-data regimes" (§5.2).
- **Ungrounded baselines:** OPRO and Self-Refine "returned the seed prompt unchanged on every seed" (§5.1); Self-Refine first lowered training accuracy, then reverted (Tab. 1). The author concludes "failure-grounded reflection is the load-bearing ingredient" (§5.2). The MIPROv2 optimizer slightly lowered its scaffold's score, so the author credits the scaffold (§5.2).
- **Headline:** MAGE (full) 46.4 ± 7.3% against GEPA 34.0 ± 7.0%, P(MAGE > GEPA) = 0.998 (Tab. 1). MAGE-M also passes 0.95 and MAGE-E does not, read as gains emerging "from component interaction rather than individual mechanisms" (§5.2). The author says Pareto selection and memory ("which introduces cross-task regularization") partially mitigate overfitting, explaining MAGE's lead (§5.2).
- **Diversity experiment:** MAGE-P goes from 39.3 ± 4.7% at n = 3 (5 seeds) to 55.6 ± 17.5% at n = 5 (3 seeds) (Tab. 1), reported in the abstract as a +21.6% gain with variance up 3.7×, "the clearest causal POCE evidence" (§1).
- **Non-additivity (§6):** the author reads MAGE (full)'s spread as below the additive prediction from GEPA's and MAGE-E's, and n = 5 as the amplifying regime: the direction is "mediated by candidate diversity, not fixed in sign".
- **BBH-Logic-Hard:** MAGE-P 82.8 ± 2.7% against GEPA 79.2 ± 2.4%, all MAGE variants above GEPA (§5.2); MAGE-E is called "the most stable variant" (§5.3).
- **Llama 3.1 8B (3 seeds):** GEPA 71.1 ± 3.1%, MAGE 76.6 ± 4.7%, with the identical prompt and accuracy on seed 232 (§6). The author concludes that with high seed accuracy "both optimizers converge identically" and POCE is "headroom-conditional" (§1), unlike on gpt-4o-mini, described as having "substantial optimization headroom" (§6).
- **On-device:** the unoptimized model calls the transport tool in 5% of requests (score 0.00); MAGE converges in 2.0 ± 0.0 iterations on all 5 seeds with tool accuracy 0.95 ± 0.03, resolving all 5 adversarial prompts (§7; Tabs. 4–5).
- **Deployment guide (Tab. 3):** MAGE-E for reliability, MAGE (full) for maximum mean. Practitioners "should run a minimum of 5 seeds" (§6).

## Limits the authors state

- With 30 training examples, "reflective optimization can overfit small training sets severely" (Limitations; also §5.2).
- The gap to CoT-math "is an honest limitation we do not minimize" (§5.2).
- Each test question is 2% accuracy, mitigated by 5 seeds and bootstrap testing (Limitations).
- The n = 5 run uses 3 seeds "due to API budget constraints"; its spread is "preliminary", and n = 3 → 5 is "an existence proof of the POCE regime, not a characterization of its functional form" (Limitations).
- Llama 3.1 8B, 3 seeds, "finds convergence rather than POCE" (Limitations).
- Jaccard retrieval "causes cross-task interference: BBH optimization may retrieve GSM8K arithmetic traces" (Limitations).
- All optimization runs use the plain-instruction scaffold (Limitations).
- "real-world LLM evaluators may not satisfy all assumptions" of the bound; the anchor "reduces—but does not eliminate—the evaluator's deviation" (§4.3).
- On-device: "a single task family (transport tool-selection) with binary scoring", and multi-tool, partial-credit tests are "required before claiming general on-device effectiveness" (Limitations).
- Tab. 6's caption says some of its values "require verification" (App. E).

## Open problems and building blocks

- **Open** (all Limitations):
  - The training-set size "above which reflective optimization reliably outperforms strong fixed prompts".
  - Whether pool size acts as a threshold or a rising curve, "an important open question"; 5-seed validation of n = 5 is "the highest-priority pending work".
  - Multi-model validation (GPT-4o, Mistral-7B), "the most important direction for future work".
  - Whether MAGE adds gains on top of strong scaffolds (CoT-zero, CoT-math).
  - Dense retrieval (a sentence encoder with the FAISS index) or task-type filtering "would improve memory effectiveness" (also App. B).
- **Released:** "task IDs are included in the released code" (§5.1); nothing else stated.
- **To reuse it:** an LLM as proposer, reflector and evaluator (gpt-4o-mini); total API cost under $2 (§5.1). The on-device study ran "locally on a MacBook Pro with no external API" (App. C).
- **Beyond its domain:** optimizing only the prompt, MAGE is called "directly applicable to locked inference runtimes" (Google LiteRT, Apple CoreML) "where weights cannot be modified post-deployment" (§2).

## On this site

- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/promptopt-evolve">promptopt-evolve</a><a class="tag sub" href="#/tags/promptopt-general">promptopt-general</a></span>
