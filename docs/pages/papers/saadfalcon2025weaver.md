# Shrinking the Generation-Verification Gap with Weak Verifiers

**Weaver** · NeurIPS 2025

Read: [PDF](https://arxiv.org/pdf/2506.18203) · [arXiv](https://arxiv.org/abs/2506.18203)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Builds a strong verifier from many weak ones (LM judges, reward models) to rank sampled answers (abstract).
- Each verifier's accuracy is estimated by weak supervision, to reduce the need for labeled data (abstract).
- Combining unreliable checkers, the problem a SQL checker cascade faces.

## In plain words

When a language model answers a question many times, one answer is often right, but picking it needs a checker. The authors say good checkers are "unscalable" (people) or "limited in utility" (proof tools), while reward models (models trained to score answers) and models prompted as judges fall well short of perfect checkers (abstract, §1). Weaver combines many weak checkers, weighting each by an accuracy estimated from how the checkers agree with one another, plus a few labels for overall statistics (§4). With Llama 3.3 70B Instruct, a non-reasoning model, generating 100 answers per question and checkers of 70B or smaller, they report o3-mini-level average accuracy (o3-mini answering once) on four math and reasoning benchmarks (abstract, §5.1). A small model trained on Weaver's scores keeps most of its accuracy with as little as a tiny fraction of the checking compute (abstract, §6). They call Weaver, to their knowledge, "the first framework to successfully apply weak supervision to ensemble verifier scores for response selection" (§4); weak supervision means statistical methods that combine noisy labelers.

## Background and terms

**Terms to know:** [best-of-N sampling](#/glossary/best-of-n-sampling) · [LLM-as-a-judge](#/glossary/llm-as-a-judge) · [outcome and process rewards](#/glossary/outcome-and-process-rewards) · [pass@k](#/glossary/passk) · [self-consistency (majority voting)](#/glossary/self-consistency-majority-voting) · [Distillation into compact models](#/glossary/distillation) · [weak supervision](#/glossary/weak-supervision) (it fits a model in which the true label is hidden and the sources' votes are observed, §4.2.1) · [reward model](#/glossary/reward-model) ("a trained language model that assigns a scalar score to candidate responses based on how well they align with human preferences"; process reward models score the steps; App. C.1)

**The paper's own terms:**
- **verifier**: scores a query–response pair; here a reward model (a score in [0, 1]) or an LM judge (a 0/1 verdict) (§3).
- **weak verifier**: LM judges and reward models, which "produce noisy, inconsistent scores, often exhibit poor calibration, and suffer from high false positive rates" (§1). **Oracle verifier**: one "with perfect accuracy" (abstract).
- **First Sample (Pass@1)**: accuracy of the first sampled response; **Pass@K**: share of queries with a correct response among K, the upper bound (§3, §5).
- **success rate**: share of queries whose top-ranked response is correct; **generation-verification gap**: Pass@K minus success rate (§3), a term from Song et al. (§1).
- **naive ensemble**: picks the response with the highest average verifier score; a **weighted ensemble** gives verifiers their own weights, e.g. logistic regression fit on labels; versions fit on all test labels are "oracle" methods (§4.1).
- **dev set**: a labeled subset of the test set, "comprising 1% of the test set (e.g. 5 to 10 query-answer pairs)" (§3).
- **accuracy parameters**: a verifier's true positive and true negative rates (App. B.1).

**Missing glossary terms:**
- **conditional independence**: two verifiers' votes are independent once the response's true correctness is known (§4.2.1).
- **cross-encoder**: reads query and response concatenated and outputs one score (§6).

**Builds on:**
- Weak supervision (Ratner et al.; Snorkel), whose parameter estimation the authors say was "first introduced in" Snorkel (§2, §4.2.1); not listed here.
- Repeated sampling: [Large Language Monkeys](#/papers/brown2024monkeys "Large Language Monkeys: Scaling Inference Compute with Repeated Sampling (2024)") and [compute-optimal test-time scaling](#/papers/snell2024scaling "Scaling LLM Test-Time Compute Optimally can be More Effective than Scaling Model Parameters (2024)") (§1, §5); the gap term from [Mind the Gap](#/papers/song2024mindgap "Mind the Gap: Examining the Self-Improvement Capabilities of Large Language Models (2025)") (§1).
- [The Limits of Inference…](#/papers/stroebl2024resampling "The Limits of Inference Scaling Through Resampling (2024)"), cited for weak verifiers' high false positive rates and limits to scaling test-time compute (§1, §2).
- Baselines that scale verification: Multi-Agent Verification (prompted LLMs that each check one aspect and vote) and Self-Verification (a model checks sampled responses with structured prompts) (§2, App. C.2.2); not listed here.

## Problem and setting

- **Question:** "to what extent can we leverage weak verifiers to improve accuracy in the repeated sampling regime?" (§1).
- **Setting (§3):** each query has K responses sampled at non-zero temperature, each with an unknown 0/1 correctness label; the goal is to select a correct one. Only the dev set is labeled; it sets "global statistics" such as the share of correct responses (§3) and the binarization thresholds (App. B.3). Correctness is agreement with the benchmark's ground truth (Tab. 12).
- **Models:** Llama 3.3 70B Instruct generates K = 100 by default (§5.1); "Unless specified", all 33 reward models and judges verify: open-source reward models of 8B to 72B from RewardBench (a reward-model leaderboard) and open judges from Chatbot Arena (a public chat-model leaderboard) (§5, App. C.1). Reward models "whose rankings perform no better than random selection on benchmark train sets" were excluded (App. C.1).
- **Benchmarks:** MATH500 (competition math), GPQA Diamond (graduate-level science multiple choice), MMLU's college-level science, math, computer science and medicine questions, and 500 random MMLU Pro queries (§5, App. C.1).
- **Baselines:** First Sample, majority voting, the top RewardBench reward model, a naive ensemble of the top 10, Self-Verification, Multi-Agent Verification, frontier models answering once (GPT-4o, Claude 3.7 Sonnet, Llama 4 Maverick, o3-mini), and Pass@100 (§5, Tab. 1).

## Approach

- **Why weights (§4.1).** Verifiers differ in accuracy. With every test response labeled, weighted ensembles can beat the naive one by "up to 11.2 points" (Fig. 2); with only 0.01n labeled samples (n queries), "accuracy drops by 20.1% on average" (Tab. 17).
- **The model (§4.2.1, Eqs. 1–5; App. B.1).** Scores become 0/1 votes; true correctness is a hidden variable. If verifiers are conditionally independent given it, Bayes' rule gives each response's probability of being correct from the accuracy parameters and the share of correct responses (Eq. 1). The accuracy parameters are estimated without labels: under the same assumption they fix the joint rates of each pair of verifiers' votes (Eq. 2), and in any case each verifier's rate of "correct" votes (Eq. 3); gradient descent fits them to the observed rates (Eq. 5). The most probable response is selected.
- **Adapting it (App. B.2–B.3).** Scores are min-max normalized and binarized at a threshold set from the dev set. Verifiers whose rate of "correct" votes is extreme for the estimated share of correct responses are dropped (with a share of 20–80%, those outside that range), partly because weak supervision commonly assumes "a majority of the verifiers have better-than-random accuracy" (App. B.2.3).
- **Clustering by difficulty (App. B.4).** Explored: one model per difficulty bucket, difficulty being the ratio of correct to incorrect generations, computed in "an oracle setting".
- **Distillation (§6, App. C.6).** A ModernBERT-Large (396M) cross-encoder, a BERT-style encoder, is trained with Weaver's probability of correctness as its target, on an 80:20 split (Fig. 6).
- **Scaling law (App. C.3).** With per-problem difficulty Beta-distributed, Pass@K approximately follows a power law in K (Eq. 12); they fit a parametric success-rate curve (Eqs. 14–15).

## Results

- **Main (Tab. 1, §5.1).** With the 70B generator and K = 100, the authors report Weaver averaging 87.7% against 72.2% for majority voting, 68.4% for First Sample, 86.7% for o3-mini and 91.9% for Pass@100.
- **8B (Tab. 3, §5.2).** With Llama 3.1 8B generating and verifiers of 8B and below, Weaver averages 70.0% against 57.2% for majority vote; the authors read Tab. 3 as "a weak-to-strong verification phenomenon".
- **Generations (Fig. 3, §5.2).** From K = 1 to 2^10, Weaver "consistently narrows the generation-verification gap" while "alternative verification strategies plateau after a few generations", an effect "particularly pronounced on difficult tasks like GPQA".
- **Verifiers (Fig. 4, §5.2).** Weaver beats naive averaging; "gains diminish as more models are added". Sampling several scores per verifier "yields modest improvements"; "increasing verifier count remains the more effective strategy" (§5.2, Tab. 21).
- **Compute (Fig. 5, §5.2).** Majority voting plateaus at around 2^2 to 2^3 ExaFLOPs per query; Weaver reaches "the highest maximum success rate".
- **Ablations.** Clustering "improves accuracy for the 8B model but often degrades it for the 70B model" (App. B.4, Tab. 9).
- **Distillation (§6).** Across tasks, the cross-encoder captures "98.2% of the performance" of Weaver (abstract: 98.7% of its accuracy). Verification drops from 35.35 to 1.01 exaFLOPs per query's 100 samples, described as "saving 99.97% of the FLOPs". Other datasets: Fig. 24.
- **Judge prompts (App. C.7.1).** With DSPy, a prompt-optimization library, the best optimized judge prompt raised precision on average over a chain-of-thought prompt, "often" by lowering false positives (Figs. 25, 27).

## Limits the authors state

- "the additional compute required for Weaver can be prohibitive" (§5.2).
- For "particularly difficult datasets, such as AIMO 2024" (competition math), Weaver "has trouble selecting a correct answer since there are so few correct responses" (§7).
- Without a better-than-random majority the estimates may not be unique, so "it is critical to remove as many low-accuracy verifiers as possible" (App. B.2.3).
- Binarizing loses information: with labels, continuous logistic regression "consistently outperforms the discrete variant" (Tab. 7).
- Fig. 2's weighted ensembles are "oracle" methods (§4.1), and the clustering computes difficulty from ground truth (App. B.4).
- Extra verifiers add "redundant signal due to correlated biases on hard examples" (§5.2).
- The scaling curves use Monte Carlo estimates, as the dev set depends on K (App. C.3).
- In prompt optimization, "we don't observe clear scaling relationships across all datasets" (App. C.7.1).

## Open problems and building blocks

- **Open:** verifiers specialized for tasks such as math or code (§7); better generation, scoring and aggregation to close the gap with Pass@K on harder tasks (§7); Weaver's predictions as labels for RLHF, reinforcement learning from human feedback (§7); multimodal verification (§7); "unsupervised approximations or semi-supervised approaches" to difficulty clustering (App. B.4); "a more systematic recipe for verifier prompt optimization", and "whether we can extend prompt optimization to discriminative reward models" (App. C.7.1).
- **Released:** Nothing stated.
- **To reuse it:** a pool of verifiers (Tab. 15); a labeled dev set of about 1% of queries (§3). Full verification costs 35.35 exaFLOPs per query's 100 samples (§6); experiments used 32 H100 GPUs (App. D.1); the cross-encoder needs "a single A100 GPU with 32GB of memory" (§6).
- **Beyond its domain:** the authors say the approach is "paving the way for better data filtering, model alignment, and inference-time decision-making" (§8).

## On this site

- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/hacking-general">hacking-general</a><a class="tag sub" href="#/tags/judge-general">judge-general</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/scaling-general">scaling-general</a></span>
