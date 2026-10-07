# Optimize Cheap, Deploy Strong: Cost-Aware Cross-Tier Transfer for Evolutionary Optimization

**Optimize Cheap** · Deploy Strong, preprint 2026

Read: [PDF](https://arxiv.org/pdf/2608.10694) · [arXiv](https://arxiv.org/abs/2608.10694)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Runs evolutionary prompt search with a cheap answering model, a strong reflector, and deploys on a stronger model.
- Characterizes when cheap-tier search transfers upward.
- Cost of GEPA-style search, on GEPA's benchmarks.

## In plain words

Prompt optimizers such as GEPA try many prompt variants and score each by running a model over a validation set. The authors say this scoring dominates the cost, and since it normally runs on the model the prompt is for, optimizing for an expensive model means paying its price throughout the search (abstract, §1). They split the jobs: the cheapest model in a family answers the validation questions, a strong model reads the results and rewrites the prompt, and the finished prompt is used unchanged on a stronger model. Across four tasks and eleven models in four families, they report that the prompt "matches or exceeds same-tier optimization" at 5.6–14× lower search cost, rising to 25–54× where the expensive models write long reasoning on every scoring call (abstract). Earlier work had observed such transfer for single model pairs (§1); the authors say they "are not aware of prior work combining cheap evaluation, strong mutation and upward deployment as a cost strategy and characterizing when it holds" (§7).

## Background and terms

**Terms to know:** [reflective prompt optimization](#/glossary/reflective-prompt-optimization) · [Wilson score interval](#/glossary/wilson-score-interval) · [evolutionary search](#/glossary/evolutionary-search)

**The paper's own terms:**
- **tier**: a model's price rank in its family, not its measured capability (§4, Tab. 3).
- **answerer**, **reflector**, **deployment model** (§2): the answerer runs the program on validation examples to score candidates (fitness evaluation); the reflector (variation operator) reads its traces and proposes edits; the deployment model serves the final prompt.
- **Full-X** (own-tier optimization) and **Cheap+reflect→X**: every role on model X (the baseline), against the family's cheapest answerer plus its strong reflector, deployed on X (§4).
- **target regret**: the target's score with the prompt it optimized for itself minus its score with the cheaply searched prompt; negative means the cheap prompt won (§2).
- **transfer residual**, two senses the paper says "must not be confused" (§2): one fixed prompt's score on the deployment model minus its score on the answerer (Eq. 2), and δ%, the negated regret as a percent of the target's own optimized score (Eq. 3).
- **zero-shot (positive) transfer**: the weak claim, regret near zero, and the strong claim, regret below zero, measured against the target's own optimized prompt, not the untrained seed (§2).
- **seed-prompt control**: the untrained starting prompt (§4).
- **families** (§4): *Mixed Claude* (answerer gpt-4.1-nano, deploy tiers Claude Haiku 4.5 and Sonnet-5, reflector Sonnet-5), *GPT* (gpt-4.1-nano → gpt-4.1-mini → gpt-5.6-luna, reflector gpt-5.5), *Gemini* (2.5-flash-lite → 3.5-flash → 2.5-pro, reflector 3.1-pro), *Mixed Qwen* (self-hosted Qwen3-8B answerer, Sonnet-5 or gpt-5.5 reflector, deployed on mini, Haiku, luna). "Mixed" means more than one vendor.
- **λ\***: the cheap answerer's price, as a fraction of the deployment tier's, at which the cheap search stops being cheaper (Eq. 5, App. A). **N\***: the deployed-query count at which a longer cheap prompt's per-query cost uses up the search saving (Eq. 6, App. D).
- **structural explicitness**: the hypothesis that a cheap answerer pushes the reflector toward spelled-out prompts a stronger model exploits (§6).

**Missing glossary terms:**
- **multi-fidelity optimization**: approximating an expensive objective with a cheaper one during search; here the model tier is the fidelity (§1, §7).

**Builds on:**
- GEPA ([GEPA](#/papers/agrawal2025gepa "GEPA: Reflective Prompt Evolution Can Outperform Reinforcement Learning (2026)")): its objective is Eq. 1, the method runs on it, and the tasks port its setups (§2–4).
- MIPROv2 ([MIPRO (shipped in DSPy as MIPROv2)](#/papers/opsahlong2024mipro "Optimizing Instructions and Demonstrations for Multi-Stage Language Model Programs (2024)")), a DSPy ([DSPy](#/papers/khattab2023dspy "DSPy: Compiling Declarative Language Model Calls into Self-Improving Pipelines (2024)")) optimizer doing Bayesian search over instructions and demonstrations (App. B).
- Earlier weak→strong evidence (GEPA-Qwen-Opt, GEPA prompts optimized with Qwen3-8B and evaluated on GPT-4.1-Mini, [GEPA](#/papers/agrawal2025gepa "GEPA: Reflective Prompt Evolution Can Outperform Reinforcement Learning (2026)") Observation 6; Gao et al., not listed here), which the authors call "an incidental generalization observation on a single model pair rather than a cost strategy" (§7).
- Cost-saving search methods (PMPO, CAPO, EPiC, LEVI), which per the authors save within the serving tier, and PromptBridge's report that prompts moved between comparable models degrade (§1, §7).

## Problem and setting

- **Question:** "must the search run on the model we intend to deploy on?" (§1).
- **Objective:** GEPA's, maximizing expected task score under a budget of rollouts (one program run plus its scoring) with frozen weights (Eq. 1); search optimizes the answerer's score, deployment the target's, and the per-prompt gap is the transfer residual (Eq. 2).
- **Tasks** (§4): HotpotQA (multi-hop question answering, exact match, with BM25 keyword retrieval), IFBench (instruction following, graded constraint satisfaction), LiveBench-Math (competition math) and HoVer (3-hop claim verification, scored by "binary recall of the gold supporting-document titles", retrieval only).
- **Protocol:** same data, program, metric and metric-call budget per task, only models differ, n = 3 seeds; the validation-selected candidate is scored unchanged on the target's held-out test set (§4, App. A), with "caching disabled".
- **Cost:** logged tokens times Tab. 3 prices (§9, App. A); Qwen figures are "API spend only" (§1).

## Approach

- **A drop-in change to a reflective or evolutionary optimizer** (§3): (A) every candidate is scored by the cheapest answerer, "not a mathematical surrogate to be calibrated against the target" but the actual execution environment; (B) a strong reflector writes the edits, few in calls but "a bounded premium, not a free component" in spend; (C) the final prompt goes zero-shot to a target "equal to or stronger than" the answerer.
- **Cost model (Eq. 4, §2):** each attempted mutation is first screened on a small minibatch, and survivors are scored on the full validation set; cost is these answerer calls times answerer price, plus attempts times reflector price. The authors argue the full-validation term dominates, so the answerer's tier sets the budget; answering takes over 96% of search tokens (§1).
- **Rationale (§1):** the evaluator need only rank prompts well enough to steer selection, "which a cheap and noisy evaluator does on the vast majority of comparisons".
- **Mechanism probes:** a 2×2 ablation of evaluator and reflector on IFBench (§6, App. C), and counts, against fixed word lists (lexicons), of directive, prohibition and all-caps words in evolved prompts (App. E).

## Results

- **Headline (§5, Fig. 1, Tabs. 8–11):** the cheap search is at or above parity in 36 of 48 (task, search arm, deploy tier) deployments, for "5.6–14× less search cost on the Mixed Claude and GPT ladders and 25–54× less on Gemini"; below parity "the shortfall is a few points at most". The gap "widens with the strength of the deployment target", which they say the cost model predicts.
- **Pooled residual (§6, Fig. 3, App. G):** mean +2.8% of the full-cost score for the cheap search, 95% interval above zero; every family mean is positive, and only Mixed Qwen's interval excludes zero. Fig. 4 shows coverage with a Wilson band.
- **Not only a discount (§5, App. A):** in most cells with a full-cost own-tier search the cheap search stays cheaper even at equal prices, emitting fewer output tokens.
- **Transfer (§5, Fig. 2):** one prompt gains on all twelve task-and-family pairs moved up, mostly from "the deployment model's own capability".
- **Role ablation (§6, Tab. 2):** upgrading the reflector is worth +15.1 points at Haiku with a cheap evaluator and +9.0 with a full one; restoring the full evaluator on top of a strong reflector "buys little for a large bill". On its own search tier the strong reflector's prompt is no better (App. C). Deployed on Haiku, a weak-reflector prompt is no better than Full-nano's (Finding 1, App. F.1, HotpotQA only).
- **Explicitness (Tab. 1, App. E):** by median over pairs (each cheap prompt against the Full-X prompt of its deploy tier), cheap-search prompts are longer and denser in all three markers; "both arms append validation answers in comparable amounts" (§6).
- **Gemini (App. F.7):** on 2.5-pro the cheap prompt matches or beats Full-2.5-pro on all four tasks; on IFBench at 3.5-flash the $0 seed prompt beats every optimized method, "the clearest negative instance in the paper".
- **Qwen (App. F.8, Tab. 11):** for the reflector's bill alone, under $2 per run, the prompt "matches or beats every paid tier's own full-cost optimization"; LiveBench-Math margins read "as not collapsing rather than as a gain".
- **Neutral target (Finding 5, App. F.9):** on gpt-4.1-mini, which no reflector saw, the Sonnet-reflected prompt matches or beats the gpt-5.5-reflected one and Full-mini.
- **MIPROv2 (App. B, Tab. 4):** the cheap rows are cheapest and lead or tie every deploy column.
- **Break-even (App. D, Tab. 6):** on Haiku, luna and 3.5-flash, the authors call per-query serving cost a volume caveat "material only for high-volume deployments of a task whose full-cost search was already inexpensive".

## Limits the authors state

- If the cheap model scores about zero, "search stagnates"; "The cheap evaluator must achieve at least marginal success given a good prompt" (§9).
- Near a prompt-insensitive ceiling there is no headroom (LiveBench-Math), a limit of "evolutionary prompt optimization in general" (§9). Finding 4 "scopes the claim": "On these four tasks we did not observe it fall below full same-tier optimization" (App. F.6).
- The conclusion is "contingent on providers offering a tiered lineup at all, not on any specific rate" (§9); λ\* "speaks only to cost" (App. A).
- Qwen serving cost is "not quantified here" (§1).
- Explicitness is "a correlation, not an ablation" that "cannot separate the weak evaluator forcing the explicitness from the strong reflector writing it" (§6); the lexicons are "a crude proxy" (App. E); both searches memorize validation content (App. J).
- MIPROv2 cost is "not budget-matched" to GEPA, and its HotpotQA leads "sit within noise" (App. B).
- A variance-weighted mean "sits slightly below zero" (App. G).
- Sonnet, also Mixed Claude's reflector, "is not a fully unseen-model test" (App. F.9).

## Open problems and building blocks

- **Open:** §6 offers explicitness only as a hypothesis for why positive transfer occurs; whether the evaluator forces or the reflector writes it stays open, "though the factorial favours the reflector" (§6), meaning the 2×2 ablation. A MIPROv2-versus-GEPA head-to-head is "outside its scope" (App. B). Bottleneck: fitness evaluation (abstract, §1).
- **Released:** Nothing stated.
- **To reuse it:** a reflective or evolutionary optimizer (§3), a cheap answerer with at least marginal task success (§9), a strong reflector.

## On this site

- **Discussed in:** [Bringing compact models to frontier accuracy](#/challenges/compact_model_accuracy)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/promptopt-evolve">promptopt-evolve</a><a class="tag sub" href="#/tags/promptopt-general">promptopt-general</a></span>
