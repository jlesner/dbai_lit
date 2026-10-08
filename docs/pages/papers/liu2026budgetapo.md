# How Should a Prompt Optimizer Spend a Tight Budget? BudgetAPO with Noise-Adaptive Evaluation

**BudgetAPO** · preprint 2026

Read: [PDF](https://arxiv.org/pdf/2610.05671) · [arXiv](https://arxiv.org/abs/2610.05671)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- A single-stage prompt optimizer for a tight budget of subject-model calls: a 16-call probe measures the task's per-row score spread, a closed-form rule sizes a fixed evaluation slice to a target standard error, every candidate is scored on that same slice so each accept/reject is a paired comparison, and an optimizer LLM rewrites the prompt's reasoning strategy and output format from up to three failing rows (abstract; §3.1–3.3). The authors call it the first APO method to size its evaluation to each task's measured noise before search (§1).
- Five subject models (8B–120B) on seven benchmarks (HotpotQA, CollIE, IFBench, SuperGPQA, an instruction-stacking task, MBPP+, LiveBenchIF) at a 250-call cap, against GEPA, MIPROv2, OPRO, GrIPS and aPSF, with Wilcoxon tests Holm-corrected over the (subject, benchmark) cells (§4.1); the authors report it ranks first on every subject model's mean, though not in every cell (§4.2), and that GEPA often returns the seed prompt unchanged at this budget (§4.3).
- Evaluation noise inside prompt search, and a published gain an audit could re-score: the authors report that a 10-row SuperGPQA minibatch has a standard error near 15 points (§1; §3.1). App. Q re-scores the shipped prompts on enlarged test sets.

## In plain words

In automatic prompt optimization, one LLM (the optimizer) rewrites the prompt of another (the subject model) until the subject scores better. The authors argue that existing optimizers such as GEPA and OPRO assume hundreds to thousands of subject-model calls, "far more than is practical behind paid, rate-limited APIs" (abstract). Under tight budgets, they say, multi-stage optimizers can use up the budget and return the starting prompt unchanged, while single-stage ones compare prompts on batches of fixed size whatever the task's noise; on SuperGPQA a 10-example batch has a sampling error of about 15 points (§1). Their optimizer, BudgetAPO, measures the noise on 16 examples, sizes one fixed evaluation set from it, scores every candidate on that set, and rewrites strategy and output format from a few failures (§1). At 250 calls, they report it ranks first on each of five subject models and returns the starting prompt in 13% of runs, against 86% for GEPA (abstract). They call it "the first APO method that automatically determines its evaluation size according to each task's measured noise before search" (§1).

## Background and terms

**Terms to know:** [reflective prompt optimization](#/glossary/reflective-prompt-optimization) · [Wilcoxon signed-rank test](#/glossary/wilcoxon-signed-rank-test) · [multiple testing](#/glossary/multiple-testing) · [best arm identification](#/glossary/best-arm-identification) · [multi-hop question answering](#/glossary/multi-hop-question-answering) · [F1 score](#/glossary/f1-score) · [greedy decoding and temperature sampling](#/glossary/greedy-decoding-and-temperature-sampling)

**The paper's own terms:**
- **APO**: automatic prompt optimization (§1).
- **Seed prompt**: the starting prompt, "You are a helpful assistant." for every method (§4.1). **Seed return**: a returned prompt "identical to the seed up to surrounding whitespace" (§4.3).
- **Budget**: subject-model calls; one call scores one prompt on one validation row. Optimizer calls and the final test scoring are free for all methods (§3; §3.3).
- **Probe** and **slice**: the 16 validation rows the seed is scored on first, and the fixed rows every candidate is scored on (§3.1). **Single-stage**: "one slice supplies both refinement feedback and selection, with no separate screening and reranking stage" (§3).
- **Primary subject**: Gemma-4-31B, on which the ablations, sweeps and optimizer swap run (§4.1).
- **StackEval**: the tables' label for "a generated instruction-stacking task" (§4.1).

**Missing glossary terms:**
- **Standard error**: the typical error of an average taken over a sample; over s rows whose scores have standard deviation σ, it is σ divided by the square root of s (§3.1, Eq. 2).
- **Bernstein bound**: an upper bound on the chance that an average of bounded independent variables strays far from its mean, tighter when their variance is small (general definition; used in App. A.2).

**Builds on:**
- GEPA (Agrawal et al., 2026; [GEPA](#/papers/agrawal2025gepa "GEPA: Reflective Prompt Evolution Can Outperform Reinforcement Learning (2026)")), which "screens a broad candidate pool on small batches and reranks survivors on larger ones" (§2): the main rival (§1).
- OPRO (Yang et al., 2024; [OPRO](#/papers/yang2023opro "Large Language Models as Optimizers (2024)")), which shows the optimizer past prompts with their scores, and ProTeGi (Pryzant et al., 2023; [ProTeGi](#/papers/pryzant2023protegi "Automatic Prompt Optimization with 'Gradient Descent' and Beam Search (2023)")), which derives textual "gradients" from errors: the feedback forms the operator departs from (§3.2).
- MIPROv2 (Opsahl-Ong et al., 2024; [MIPRO (shipped in DSPy as MIPROv2)](#/papers/opsahlong2024mipro "Optimizing Instructions and Demonstrations for Multi-Stage Language Model Programs (2024)")), GrIPS (Prasad et al., 2023), which edits the prompt string, and aPSF (Liu et al., 2026), which updates one prompt component at a time: the other baselines (§2; §4.1).
- CAPO (Zehle et al., 2025) and TRIPLE (Shi et al., 2024, best-arm identification) allocate evaluations per candidate during search; BudgetAPO sets one size before search (§2).

## Problem and setting

- **Question:** "Can a tight-budget optimizer avoid seed return and size its evaluation to the task's noise?" (§1). An optimizer is judged by the expected test score of the prompt it returns under a cap on subject-model calls (§3, Eq. 1).
- **Subject models:** Gemma-4-31B, Qwen-3.5-27B, GPT-OSS-20B, Nemotron-3-Super-120B and Ministral-8B, five families from 8B to 120B, sampled at temperature 0.6 and top-p 0.95 (§4.1). Default optimizer LLM: GLM-5-FP8 (§4.1).
- **Benchmarks** (§4.1; scoring in App. C): HotpotQA (multi-hop questions, token-overlap answer F1), CollIE (text that must pass all requested constraints), IFBench, StackEval and LiveBenchIF (instruction following, share of binary checks passed), SuperGPQA (graduate-level multiple choice) and MBPP+ (code that must pass its tests). Test pools hold 150–200 rows (Tab. 4).
- **Protocol:** 250 calls per run, seeds 0–2, 630 runs (§1; §4.1); paired Wilcoxon tests, Holm-corrected, over the 35 (subject, benchmark) cells (§4.1).

## Approach

(§3; Fig. 2; Alg. 1 in App. B)

- **Noise-adaptive slice sizing (§3.1).** The slice size is the standard deviation of the seed's per-row probe scores (Eq. 3) divided by a target standard error (0.10 by default, on a 0–1 score scale), squared, rounded and clamped to 10–30 rows (Eq. 4). Rationale: on a noisy task small batches compare imprecisely, while "on a stable task extra rows buy no precision but cost search depth" (§3.1): at 250 calls and two candidates per step, a 10-row slice allows 11 steps, a 25-row slice 4 (Eq. 5). The seed's spread "stands in for that of candidates not yet written" (Remark 3.1).
- **Fixed evaluation slice (§3.1).** Drawn once (probe rows first), it scores every candidate, so each accept/reject decision compares two prompts on the same rows.
- **Reflective refinement operator (§3.2, Eq. 6).** The optimizer LLM sees the task description, the current prompt with its slice score, and the first three failing slice rows (request, constraints missed, start of the reply), and returns two candidates, rewriting both "strategy, how the subject model should reason about the task, and format" (§3.2). "The expected answer is never shown" (App. X).
- **Greedy accept (§3.3, Eq. 7).** A candidate replaces the current prompt only if its slice average is strictly higher; the run ends when the remaining budget can't pay for a full step.
- **Theory (App. A).** Take a candidate, an incumbent and a row count s fixed in advance, scored on the same s rows drawn independently from one distribution, with scores between 0 and 1. Scoring both on the same rows lowers the variance of their difference when same-row scores are positively correlated, and can raise it when negatively correlated (App. A.1). If the candidate's true mean is higher, the chance the comparison rejects it is at most a bound that falls exponentially as s grows, faster for a larger gap and less variable per-row differences (Prop. 1, Eq. 11, "a Bernstein bound"). Cor. 1 gives the smallest slice meeting a chosen error level; if it fits the clamp and the budget allows one complete step, no permitted size meeting that sufficient condition allows more steps; this is "an oracle comparison", since BudgetAPO does not observe the gap or variance (App. A.3).

## Results

250-call cap unless stated.

- **Main comparison (Tab. 1a; §4.2).** BudgetAPO is first on all five subject models' seven-benchmark means; on the five-subject mean it scores 63.52% against 61.54% for the best baseline, OPRO. Over the 35 cells it ranks first in 14, "including two shared first places", and in the top two in 23, against 12 for the next best method. It clears the Holm-corrected threshold against each baseline (§4.2; Tab. 7).
- **Seed return (§4.3; Tab. 9).** Over 105 runs per method, GEPA returns the seed in 86%, BudgetAPO in 13%; MIPROv2 and aPSF always rewrite. On the primary subject, GEPA's rate drops at 1,000 calls, "once its initial validation pass fits" (§4.3).
- **Budget curve (§4.3; Fig. 1a; Tab. 8).** On GPT-OSS-20B, BudgetAPO is first at every sampled budget from 150 to 400, and GEPA needs 450 calls, 4.5 times as many, to match its 100-call score. On the primary subject GEPA matches BudgetAPO's 250-call score only at 1,000 calls (§4.3).
- **Ablations (Tab. 2; §4.4), primary subject.** Removing adaptive sizing costs 1.8 points, the reflective operator 1.6 and the fixed slice 1.4, from a 71.6% mean; removing only the failing rows costs 0.9.
- **Hyper-parameters (Fig. 6; App. L–M).** Test score peaks at the default target. No probe size (4–48 rows) or lower clamp (5–20) scores below the default in its batch, "so neither needs per-task tuning" (§4.4).
- **Optimizer swap (Tab. 3; §4.5), seed 0.** BudgetAPO stays first under both optimizers; when the subject optimizes its own prompt, OPRO leads.
- **Held-out checks.** The prompt picked on the slice beats its candidate pool's mean on held-out rows in most cells (App. P; Fig. 8). For the primary subject (Gemma-4-31B) only, on four test sets enlarged to 731–1,000 rows, BudgetAPO keeps its position on all four (App. Q; Tab. 14).
- **Prompts (§4.2).** Its prompts draw the shortest replies of any method; "on average, the gain stays with the task a prompt was written for" (Fig. 5).

## Limits the authors state

- It "depends on the capability of the optimizer LLM"; "a less capable optimizer may yield smaller gains" (§ Limitations).
- "our experiments currently cover text benchmarks only"; multimodal benchmarks are "left for future work" (§ Limitations).
- The bound "applies to each fixed candidate pair"; extending it over the adaptive search "would call for tools such as adaptive data analysis", so the search is assessed on held-out test pools (App. A.4).
- Ablations, sweeps and the optimizer swap use the primary subject only; the swap uses seed 0 "as a ranking check" (§4.1; App. I).
- The primary-subject budget sweep "was run before the budget guard was in place"; three cells whose runs stopped early are kept in its means (App. G).
- StackEval pools have no "content-level deduplication across pools" (App. C).
- It "could be used to optimize prompts for harmful or policy-violating objectives" (§ Ethical Considerations).

## Open problems and building blocks

- **Open:** None stated beyond the multimodal extension under Limits (§ Limitations).
- **Released:** Nothing stated; the appendices print the returned prompts and the template (App. R–X).
- **To reuse it:** an optimizer LLM (§ Limitations); a scorer giving each row a score between 0 and 1 (§3); a validation pool at least as large as the probe and the upper clamp, and a budget at least their sum (App. B). One set of defaults served all tasks and subject models (§4.4).

## On this site

- **Tags:** <span class="tags"><a class="tag" href="#/tags/stats">stats</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/promptopt-feedback">promptopt-feedback</a><a class="tag sub" href="#/tags/promptopt-general">promptopt-general</a></span>
