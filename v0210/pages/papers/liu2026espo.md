# ESPO: Error-Structured Prompt Optimization via Diagnose, Diversify, and Stabilize

**ESPO** · EMNLP 2026

Read: [PDF](https://arxiv.org/pdf/2609.04197) · [arXiv](https://arxiv.org/abs/2609.04197)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Error-structured prompt optimization: diagnose all errors at once, propose with four strategies, select by bootstrap stability.
- Targets GEPA's prompt bloat.
- Reports beating GEPA on HoVer, Tweet, MMLU and ScoNe, with GSM8K, HotpotQA and PUPA "within-1σ ties" (§4.2), and shorter prompts (abstract); its Theorem 1 is false as printed.

## In plain words

Reflective prompt optimizers such as GEPA have a strong LLM read a prompt's mistakes on training examples and rewrite it. The authors call GEPA "the state-of-the-art" but say it suffers from "prompt bloat": prompts grow longer, not more accurate (abstract). They blame its design: it sees a few random errors per round, rewrites one way only, and picks among about ten candidates on 30 validation examples, where luck can decide (§1). ESPO sorts all training errors into a few patterns at once, writes candidates with four different rewriting strategies, and keeps the one that wins most often over 20 random redraws of the validation set (§3). Starting every method from a deliberately weak prompt, with Claude Sonnet 4.5 as both the prompted and the rewriting model, they report 74.67% average accuracy on seven benchmarks against GEPA's 70.91%, with prompts 47% shorter (abstract). They claim "no existing method" combines structured error diagnosis with selection-stability guarantees for small validation sets (§2).

## Background and terms

**Terms to know:** [bootstrap resampling](#/glossary/bootstrap-resampling) (§2, §3.4) · [multiple testing](#/glossary/multiple-testing) (here, scoring many candidates on one small set, so the top scorer may just be lucky, §1, §3.4)

**The paper's own terms:**
- **student** and **reflection LLM**: the model whose prompt is optimized; the model that reads errors and writes prompts (§4.1).
- **seed**, three senses: the starting prompt, in the main runs a weak one shared by all methods, the lowest scorer of a small pool on a 30-example probe (e.g. "Refuse to answer" for PUPA, §4.1), in App. D.4 a task-tuned one; an independent optimization run (Tab. 1 caption, App. D.3); and the seed phase, the strategies' first candidates (§3.3). "Default" names the weak prompt and the no-optimization baseline (§4.1).
- **bias**, two senses: a strategy's systematic shortfall in the paper's bound (§3.5), and social bias in data, clustering or metrics (App. E.2).
- **Diagnose, Propose, Select**: the three phases (§3.1); the title says "Diversify" and "Stabilize" for the last two.
- **error pattern**: one of 3–7 groups of failed training examples, with a description, examples and a count; the clustering is "implicit (LLM-based)" (§3.2).
- **m, K, B, N**: errors examined per round (ESPO: all), strategies (4), bootstrap redraws (20), pool cap (10) (§3.1, Tab. 7).
- **Bootstrap**, two senses: the baseline BootstrapFewShot from DSPy (a framework for programming LLM pipelines), which adds few-shot demonstrations (§4.1, §4.2); and ESPO's resampling-based selection (§3.4), meant by Tab. 4's "Bootstrap" (§4.5).

**Builds on:**
- **GEPA** ([GEPA](#/papers/agrawal2025gepa "GEPA: Reflective Prompt Evolution Can Outperform Reinforcement Learning (2026)")), the method it aims to improve: an evolutionary loop that "reflects on errors using a strong LLM, proposes mutations, and selects survivors via a Pareto front" (candidates none of which another beats everywhere) (§1). The authors call it a "degenerate case" of ESPO (§1).
- Baselines **MIPROv2** ([MIPRO (shipped in DSPy as MIPROv2)](#/papers/opsahlong2024mipro "Optimizing Instructions and Demonstrations for Multi-Stage Language Model Programs (2024)")) and **COPRO**, DSPy optimizers that the paper says work "through Bayesian surrogate models" (a model predicting which prompt will score well) (§2), and **BootstrapFewShot** ([DSPy](#/papers/khattab2023dspy "DSPy: Compiling Declarative Language Model Calls into Self-Improving Pipelines (2024)")) (§4.1).

## Problem and setting

- **Question:** can an optimizer recover an accurate, compact prompt from a bad one (§4, Q1)?
- **Benchmarks:** Tweet (sentiment), MMLU (multiple-choice questions), GSM8K (grade-school math), HotpotQA (multi-hop questions), ScoNe (natural-language inference), HoVer (multi-hop fact checking), PUPA (privacy-preserving response generation); 70 training, 30 validation and 500 test examples each (§4.1).
- **Metrics:** accuracy, exact match or semantic F1; prompt length; latency (§4.1).
- **Models:** student Claude Sonnet 4.5 at temperature 0; four more students "of different capacity" (Gemma 3 12B, Mistral 14B, Qwen3 32B, Claude Haiku 4.5; §4 Q2); reflection LLM always Sonnet 4.5, temperature 0.7 (§4.1).
- **Weak start:** all methods share a weak seed, because tuned seeds leave "little headroom" (§4.1).

## Approach

- **Diagnose (§3.2):** collect every training error under the current prompt; the reflection LLM groups them into 3–7 patterns, each with a root cause and a fix (App. C.1).
- **Propose (§3.3):** four strategies rewrite the prompt from the diagnosis. **Diagnostic Revision** fixes each pattern's root cause; **Consolidation** merges redundant rules without growing longer; **Ablation** softens or drops over-triggered rules that cause false positives; **Factual Injection** adds domain knowledge drawn from the error examples. Two rounds of "cross-pollination" (merging candidates' strengths) and "targeted refinement" (fixing remaining errors) follow, pruning to 10 by validation score, then length (§3.3, Alg. 1).
- **Select (§3.4):** draw 20 bootstrap redraws of the validation set, find the top candidate on each, and return the candidate with most wins; ties go to the shorter prompt.
- **GEPA as special case (§3.1):** one strategy, one redraw and 3 errors per round "exactly recovers GEPA".
- **Thm. 1 (§3.5, "informal"; restated App. A):** suppose K independent strategies each give a candidate whose test accuracy is the best possible accuracy, minus a strategy bias (zero or more), plus zero-mean Gaussian noise of spread σ, and selection uses B redraws. Then the selected prompt's expected accuracy is at least the best possible, minus the smallest bias, plus σ times the standard-normal value exceeded with probability 1/K, minus a term of order √(ln K / (n·B)), n the validation size.
  - Lemma 2 gives the best-of-K bonus; Lemma 3: if the true best wins each redraw with probability above one half, a wrong pick becomes exponentially unlikely in B (App. A).
  - The authors call ESPO's selection term tighter than GEPA's (§3.5, Tab. 6) and match the terms to ablation results (§3.5 "Empirical alignment").
- **Prop. 2 (App. B):** if n errors fall into patterns of at least one error each and m errors are sampled uniformly per round, then n·ln(number of patterns / δ) / (m × smallest pattern size) rounds, rounded up, suffice to see every pattern with probability at least 1 − δ. The authors use it to argue GEPA needs many rounds where full diagnosis needs one (§1, §3.2).

## Results

- **Main (Tab. 1, §4.2):** student Sonnet 4.5, weak seed: ESPO averages 74.67% against GEPA's 70.91%, significant in a paired t-test over the seven datasets, they report.
  - They count wins beyond one standard deviation on HoVer, Tweet, MMLU and ScoNe, and ties on GSM8K, HotpotQA and PUPA (§4.2).
  - Average length 1,004 against 1,878 characters (Tab. 1); latency equal or lower than GEPA's on every task (Tab. 9).
  - Non-reflective baselines (BootstrapFewShot, COPRO, MIPROv2) fail to recover a usable prompt, they report (§4.2).
- **Length alone? (Tab. 2, §4.2):** Constrained GEPA (GEPA with a compact proposer instruction and a length cap) reaches 1,171 characters but averages 71.00% against 70.91%; the authors conclude "length control alone" isn't enough.
- **Other students (Tab. 3, §4.3):** ESPO has the best average on each. Qwen3 32B on GSM8K goes from Default 15.00% and GEPA 35.40% to ESPO 91.40%, credited to diagnosis finding an "output-format mismatch silently throttling Qwen3" (§4.3).
- **Strategies (Tab. 8, §4.4):** no strategy wins everywhere, which the authors read as confirming the independent-bias assumption.
- **Ablation, Tweet (Tab. 4, §4.5):** strategies alone score 1.20 points below GEPA; all three components score 6.18 above it.
- **Strong seed (Tab. 12, App. D.4):** ESPO averages 75.90% against GEPA's 71.11%.
- **Further:** ESPO still leads with the open-source Qwen2.5-32B-Instruct as reflection LLM (Tab. 14); only all three components together cut length (App. D.5); an LLM-judged XSum summarization pilot favours ESPO (App. D.7).
- **Cost (Tab. 10):** $9.99–$25.66 per dataset; reflection tokens about 39% of GEPA's (§4.6).

## Limits the authors state

- Selection needs B × N evaluations; a run "costs roughly the same as one GEPA run at default settings" (§6).
- One reflection LLM serves all strategies, so independence is "a simplification" (§6, App. D.9).
- With "more numerous or subtle" patterns, "diagnosis may be incomplete" (§6).
- Tool use, long context, code and multi-turn dialogue are out of scope; cross-model gains are largest where the default prompt is far from the student's prior (§6).
- Thm. 1 is stated "as an explanatory framework motivating the three-phase decomposition rather than as a tight probabilistic guarantee", assuming independent strategies, sub-Gaussian validation noise (tails no heavier than a Gaussian's) and the best candidate winning each redraw with probability above one half, "not certified per dataset" (§6).
- Diagnose "assumes ground-truth error labels"; XSum is "a preliminary sanity check" (App. D.7).
- Diagnosis "does not guarantee that bias-related failure modes will be identified or corrected" (App. E.2); absolute accuracies carry each benchmark's "contamination caveats" (App. E.3).

## Open problems and building blocks

- **Open:** "mixing reflection models per strategy is not explored" (§6); "a full open-ended benchmark suite (long-form QA, code generation, dialogue) is future work", and "extending diagnosis to judge-based signals is a natural next step" (App. D.7).
- **Released:** "We release code and prompts for the public NLP benchmarks studied in this paper" (App. E.4).
- **To reuse it:** labelled training data and a metric (§3.2); a reflection LLM, with lower absolute accuracy from a weaker one (App. D.6); 10 minutes to 2 h 13 min per dataset after parallelizing (Tab. 10); "practitioners with tighter budgets can lower" B or N (§6).

## On this site

- **Discussed in:** [Comparing LLM methods under noise](#/challenges/method_comparison_under_noise)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/promptopt-evolve">promptopt-evolve</a><a class="tag sub" href="#/tags/promptopt-general">promptopt-general</a></span>
