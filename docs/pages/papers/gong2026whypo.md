# Why Prompt Optimization Works, and Why It Sometimes Doesn't: A Causal-Inspired Edit-Level Analysis

**Why Prompt Optimization Works,…** · preprint 2026

Read: [PDF](https://arxiv.org/pdf/2605.26655) · [arXiv](https://arxiv.org/abs/2605.26655)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Asks which kinds of edits prompt optimizers (DSPy with MIPROv2, TextGrad, GEPA) make go with gains or losses on which task groups (commonsense, math, logical, sequential, multi-hop), from the optimization logs of five LLM backbones on 11 benchmarks (abstract; §1; §3.1).
- Describes each consecutive prompt revision three ways (12 features scored by GPT-4o, deterministic surface text statistics, regex-matched inserted phrases) and estimates propensity-weighted (IPTW) gain differences per task group, with block bootstrap and Benjamini–Hochberg correction; the main analysis uses 2,095 DSPy pairs, the TextGrad and GEPA pairs only for directional corroboration (§3–§5).

## In plain words

Prompt optimizers such as DSPy, TextGrad and GEPA rewrite an LLM's instructions automatically. The authors say that in practice a prompt that wins on one benchmark "often fails to transfer to another" (abstract), and ask which edits optimizers make and why some help one type of task but hurt another (§1). From three optimizers, five LLMs and 11 benchmarks in five task groups they collected about 20 thousand pairs of consecutive prompts (§3.1). Each edit is described three ways (features scored by GPT-4o, simple text counts, inserted phrases matched by fixed patterns), and accuracy gains with and without each kind of edit are compared, mainly on the DSPy pairs, reweighting to account for the prompt's state before the edit (§1; §3–§5). Four associations survive a correction for running many tests at once (§6); for example, inserted instructions such as "make sure to" go with lower performance on the math group (§5.2). The authors present the work as an "observational edit-level analysis" (§1), not a new optimizer, and its findings as "adjusted associational contrasts rather than causal effects" (§4.1).

## Background and terms

**Terms to know:** [false discovery rate (FDR)](#/glossary/false-discovery-rate-fdr) · [multiple testing](#/glossary/multiple-testing) · [importance sampling and importance weighting](#/glossary/importance-sampling-and-importance-weighting) · [average treatment effect (ATE)](#/glossary/average-treatment-effect-ate) · [clustered standard errors and cluster bootstrap](#/glossary/clustered-standard-errors-and-cluster-bootstrap) · [Spearman's rank correlation](#/glossary/spearmans-rank-correlation) · [textual gradient](#/glossary/textual-gradient) · [reflective prompt optimization](#/glossary/reflective-prompt-optimization) · [propensity score and IPTW](#/glossary/propensity-score-and-inverse-probability-weighting-iptw) (logistic model on pre-edit covariates, stabilized weights capped at 10, §1, §4.2) · [confounder](#/glossary/confounder) (unmeasured ones named, §4.1) · [CATE](#/glossary/conditional-average-treatment-effect-cate) ("naive CATE" is the unweighted version, App. F, Tab. 6)

**The paper's own terms:**
- **revision pair and gain**: two consecutive prompts p₁ → p₂ in one optimization run; the gain is the accuracy of p₂ minus that of p₁ "on a fixed evaluation set" (§3.1).
- **treatment**: 1 when the revision increases a given feature, 0 otherwise; since optimizers change several features at once, treatments are "edit bundles rather than isolated feature changes" (§4.1).
- **ACMGD** (IPTW-adjusted conditional mean gain difference): within one task group, the weighted mean gain of revisions with the treatment minus that of revisions without it; positive means the edit goes with larger gains (§4.1–4.2).
- **consistency, positivity, conditional exchangeability**: the assumptions under which ACMGD would be causal: the observed outcome is the one under the treatment received; every revision could get either treatment; and, given the pre-edit covariates (prompt length, demo count, headroom, framework, backbone, dataset, optimization step), getting the treatment is independent of the untreated outcome (§4.1). Not the glossary's conformal "exchangeability".
- **Tier 1, 2, 3**: Tier 1 survives Benjamini–Hochberg correction (q < 0.05) (q: the p-value adjusted for the number of tests); Tier 2 is significant only uncorrected, or directionally consistent across views, and does "not independently support inference" (§4.3; App. A); Tier 3 is "hypothesis-generating" design suggestions (App. I.5).
- **cognitive-load features**: 12 prompt features such as clarity, extraneous load ("Redundant/irrelevant information") and metacognition, each scored 1–10 by GPT-4o (§3.2, Tab. 1), drawn from cognitive load theory, which separates intrinsic load (task complexity), extraneous load (irrelevant or poorly structured information) and germane load (task-relevant processing) (§2 "Cognitive load in instructional design").
- **surface features** and **edit motifs**: 14 deterministic text statistics such as word count, demo count and step-word density (§5.1); and inserted spans of at least 4 tokens, sorted by regular expressions into four pre-specified categories: chain_of_thought, meta_instruction, step_by_step and clarity_constraint (§5.2).
- **headroom**: one minus base accuracy (§4.4).
- **LOO stability**: whether an association keeps its sign when one dataset at a time is left out (§4.3).

**Missing glossary terms:** none.

**Builds on:**
- The optimizers it analyzes: DSPy with its instruction-and-demonstration optimizer MIPROv2 ([DSPy](#/papers/khattab2023dspy "DSPy: Compiling Declarative Language Model Calls into Self-Improving Pipelines (2024)"), [MIPRO (shipped in DSPy as MIPROv2)](#/papers/opsahlong2024mipro "Optimizing Instructions and Demonstrations for Multi-Stage Language Model Programs (2024)")), TextGrad ([TextGrad](#/papers/yuksekgonul2024textgrad "TextGrad: Automatic 'Differentiation' via Text (2024)")) and GEPA ([GEPA](#/papers/agrawal2025gepa "GEPA: Reflective Prompt Evolution Can Outperform Reinforcement Learning (2026)")) (§3.1).
- The Coin Flip paper (Zhang et al., 2026; [Prompt Optimization Is a Coin Flip](#/papers/zhang2026coinflip "Prompt Optimization Is a Coin Flip: Diagnosing When It Helps in Compound AI Systems (2026)")), which studies success "at the run level via ANOVA" (analysis of variance), and CPO (Chen et al., 2026a; not listed here), which "applies double machine learning to whole-prompt embeddings" (effect estimation adjusted by flexible machine-learning models) (§2 "Closest prior work").
- Propensity scores and IPTW (Rosenbaum and Rubin, 1983; Robins et al., 2000) and the Benjamini–Hochberg procedure (Benjamini and Hochberg, 1995), none on this site (§1; §2 "Causal inference for NLP"; App. A.3).

## Problem and setting

- **Question:** which prompt modifications "systematically contribute to improvement or degradation across different task settings" (§1).
- **Logs (§3.1):** DSPy (MIPROv2), TextGrad and GEPA; five backbones (GPT-5.2, GPT-4o, Qwen3-32B, Deepseek-v3, Deepseek-R1); 11 benchmarks in five groups: commonsense (CommonsenseQA, causal judgment, disambiguation QA), math (GSM8K and MultiArith, arithmetic word problems), logical (boolean expressions, coin flip), sequential (last letters, ListOps) and multi-hop (StrategyQA, date understanding). Several are cited to BIG-Bench Hard (Suzgun et al., 2023), hard reasoning tasks. The math group has "particularly high initial performance", a possible ceiling effect (§3.1; §4.4).
- **Pairs:** 2,095 DSPy pairs for the main analysis and 17,708 TextGrad and GEPA pairs "for cross-framework replication" (§3.1).
- **Annotation validity:** checked against text-derived features by Spearman correlation, "partial but sufficient for coarse-grained analysis" (§3.2 "Construct validity").
- **Assumptions:** the three above; the authors say conditional exchangeability "is unlikely to hold exactly in this setting" (§4.1).
- Not discussed: the size of each fixed evaluation set, the number of optimization runs, and the optimizers' settings.

## Approach

- **Three views of each edit** (§1, Fig. 1): GPT-4o features (§3.2), surface statistics (§5.1) and edit motifs (§5.2).
- **Estimation** (§4.2): propensity model, IPTW weights and the weighted gain difference per task group, as defined above; block-bootstrap standard errors with 500 resamples, blocks being dataset × backbone strata; Benjamini–Hochberg correction across "all 60 (feature ⊗ task-group) tests" (§4.2) and "all 15 motif × group tests" (§5.2).
- **Robustness checks:** leave-one-dataset-out (§4.3; App. E); headroom (§4.4); surface features on the TextGrad and GEPA pairs, "a partial replication of directional patterns only" (§5.1); a controlled structured chain-of-thought run (App. I.3); and exploratory analyses of sentence-embedding differences, causal graphs and a "receptivity score" (App. B–D).

## Results

- **Feature analysis (§4.3, Tab. 2):** of 60 tests, 11 are significant uncorrected and 2 survive correction: more extraneous load goes with performance degradation on the sequential group, more metacognition with performance gains there. Math and multi-hop show "predominantly negative associations with complexity-increasing features", a pattern the authors call "exploratory (uncorrected)" (Fig. 2).
- **Motifs (§5.2, Tab. 4):** meta-instruction insertion goes with lower performance on the math group (ACMGD −0.103, Tier 1), clarity-constraint insertion ("be concise/brief/simple") with lower performance on the logical group (Tier 1). The math effect is "partially concentrated in MultiArith" (naive CATE −0.277 on 64 treated pairs, against −0.019 on 14 for GSM8K; App. F, Tab. 6). Chain-of-thought insertions point negative on math and positive on sequential across representations, uncorrected (Tier 2), and "'sequential' is a single-dataset group (last_letters)" (§5.2). The conclusion counts four corrected associations in all (§6).
- **Annotation-free views:** "All four major LLM-annotated directional patterns are reproduced by text-native features" (§5.1, Tab. 3, Fig. 3); the TextGrad and GEPA pairs show a "consistent directional pattern", read as corroboration "instead of independent replication" (§5.1).
- **Leave-one-out:** 15 of 18 splits (83%) keep the sign reversal, "exceeding our 80% success criterion" (App. I.4, Tab. 8; App. E, Tab. 5).
- **Ceiling effects:** "only a minor contributor"; the headroom–gain association is "weak and not statistically significant" (§4.4).
- **Motif precision:** about 90% or more for meta_instruction, from a one-author audit of 50 spans; chain_of_thought precision is lower, its most common false positive a JSON "reasoning" key in few-shot demos (§5.2 "Motif validity").
- **Structured chain of thought (App. I.3):** on Qwen2-VL-7B-Instruct and 25 GSM8K questions, it raises accuracy from 28% to 60% (last letters: not significant), which the authors take as showing that the motif estimate "does not reflect a general CoT-hurts-math phenomenon"; it "does not validate or invalidate the observational motif estimate".
- **Stated implication:** the tables "serve as a preliminary diagnostic" before optimizing a math-like or multihop-like task; this "does not guarantee failure" (§6 "Implications"; Tier 3 in App. I.5).

## Limits the authors state

- "Our analysis is observational rather than interventional"; residual confounding may remain "due to optimizer trajectory history, backbone-specific instruction following, and bundled prompt edits" (Limitations).
- "Conditional exchangeability is not fully defensible; treatments are bundles; interventional validation at scale was not possible" (App. I.2).
- "Several findings remain benchmark-sensitive", some "partially concentrated in specific datasets (e.g., MultiArith within math)"; cross-framework corroboration "is directional rather than a fully controlled replication" (Limitations).
- Regex motif extraction "introduces unavoidable labeling noise, particularly for chain-of-thought-related edits" (Limitations); "Motif precision was not formally estimated at scale and the audit involved one labeler; results remain preliminary" (§5.2).
- The surface-feature comparison "does not fully rule out annotation bias" (§5.1).
- The sequential effects "involve last_letters only" (App. I.1); the word-count multi-hop reversal "appears driven by date_understanding and should be treated with caution" (App. I.4).
- Tier 2 results "do not independently support inferential claims" (§4.3).
- The receptivity score "does not constitute a validated predictive diagnostic" (App. C).
- The chain-of-thought check "used one model and 25 questions per task; generalization is not established" (App. I.3).

## Open problems and building blocks

  - "edit-conditioned optimizer design as a fruitful direction for interventional follow-up" (§6).
  - Three design hypotheses: task-conditioned edit priors ("a regex-based edit filter or a classifier over proposed edits"), complexity-penalized search, and validation gates on "a held-out subset classified by task group"; they "require controlled validation before implementation" (App. I.1, I.5).
  - Whether the meta-instruction effect reflects instructions models have "already internalized" or optimizers inserting them into struggling runs: "Targeted interventional validation would be required to distinguish these accounts" (App. I.3).
  - "generalization to unseen task types", listed with the design suggestions as needing controlled validation (App. I.1).
- **Released:** "All analysis code and pairwise comparison dataset will be released upon publication" (§6 "Reproducibility"); the GPT-4o feature-scoring prompt is printed (App. H).
- **To reuse it:** optimization logs with consecutive prompts and per-step accuracy on a fixed evaluation set (§3.1), and GPT-4o for the feature scores (§3.2; App. H).

## On this site

- **Discussed in:** [Gains made against a checker, carried beyond it](#/challenges/transfer_beyond_the_checker)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/promptopt-general">promptopt-general</a><a class="tag sub" href="#/tags/promptopt-misc">promptopt-misc</a></span>
