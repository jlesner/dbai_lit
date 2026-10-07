# What Should the Reflector See? An Empirical Study of Evidence in Reflective Prompt Optimization

**What Should the Reflector See?** · preprint 2026

Read: [PDF](https://arxiv.org/pdf/2609.32452) · [arXiv](https://arxiv.org/abs/2609.32452)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Compares nine reflection strategies (evidence composition, example visibility, candidate selection, knowledge policy; abstract) in a GEPA-inspired search.
- Single-parent Pareto search with a small open model as task model and reflector.

## In plain words

Prompt optimizers such as GEPA let an LLM, the "reflector", read a few examples of a model's answers and feedback, then write a revised prompt. Because every revision is inferred from those few examples, the authors argue, their choice is central to what the method can learn (§1). They compare nine ways of choosing what the reflector sees or may write and how its proposals are picked, in one search loop modelled on GEPA, with one small open model (Qwen3.5-9B) as both answering model and reflector, on five datasets (abstract). Showing only failures gives the largest average test gain over the starting prompt, 8.0 points, mostly from one math dataset; two other strategies share the best average rank. The strategy with the best rank at beating the prompt it revised gains only 1.4 points on average (abstract). The authors study one part of a given optimizer, not a new optimizer (§2), and find no strategy best on every task (§1).

## Background and terms

**Terms to know:** [GRPO](#/glossary/grpo) (named once, as the fine-tuning route prompt optimization avoids, §1) · [reflective prompt optimization](#/glossary/reflective-prompt-optimization) (§1) · [Pareto front](#/glossary/pareto-front) (here each calibration example is a criterion, §3.1); other terms are defined below.

**The paper's own terms:**
- **reflector**: the LLM that reads the current (parent) prompt's inputs, responses and automatic feedback on a group of examples and writes a new prompt, a "child" (§3.1, App. A.2).
- **seed prompt**: the instruction every run starts from (App. A.1).
- **training / calibration / test splits**: the parent runs on training examples, which the reflector sees; calibration examples score candidates for selection (a validation set); the test set is "not consulted" during search (§3.1, §4.2).
- **strict Pareto front**: the calibrated prompts for which no other calibrated prompt is at least as good on every calibration example and strictly better on at least one (§3.1).
- **empirical selection and the local improvement gate**: each child is scored on its own three examples; only children that strictly beat the parent there get a full calibration evaluation, and the highest-scoring one is taken (§3.1, §4.3).
- **calibration gain, test gain, calibration gap**: the final prompt's improvement over the seed on the calibration and test sets; the gap is the first minus the second (Tab. 4).
- **Acr / Bcr** (adverse and beneficial correction rates, from the prompt optimizer StraGo): the share of initially correct test examples the final prompt gets wrong, and of initially incorrect ones it gets right, on the first test pass (§4.4).
- **Rounds/Parent, Rounds/Best**: 20 rounds divided by the number of strict improvements over the sampled parent, or over the best prompt so far (20 if none); Rank/Parent and Rank/Best rank these within each dataset (§5.4, Tab. 5).

**Builds on:**
- GEPA ([GEPA](#/papers/agrawal2025gepa "GEPA: Reflective Prompt Evolution Can Outperform Reinforcement Learning (2026)")), reflective prompt evolution with Pareto selection: the backbone is inspired by it, "not an unchanged implementation of its optimizer" (§3.1).
- OPRO ([OPRO](#/papers/yang2023opro "Large Language Models as Optimizers (2024)")), which shows the LLM earlier prompts with their scores and compares numbers of exemplars, including none; OPRO's no-exemplar condition, unlike this paper's control, keeps past instructions and scores (§1).
- StraGo (not listed here), which derives strategies from successful and failed cases and ablates both; the authors build "on such targeted analyses" (§2).
- The LLM-as-a-judge paradigm (Zheng et al., not listed here), adapted for candidate selection (§3.2).

## Problem and setting

- **Questions** (§4.1): which strategies improve held-out performance; which choices drive the differences; how reliably local improvements advance the search.
- **Model** (§4.3): Qwen3.5-9B answers, reflects and judges, served with vLLM (an LLM serving engine), thinking mode disabled; responses cut off at the output token limit are scored as failures.
- **Datasets** (§4.2, Tab. 1): LiveBench-Math (competition and symbolic-computation problems, App. A.1) and OlympiadBench (English, text-only olympiad math), scored by symbolic equivalence; GPQA-main, graduate-level science multiple choice; HotpotQA, multi-hop question answering, scored by normalized exact match; IFBench, instruction following with automatically verified constraints, scored by the fraction of constraints satisfied. On HotpotQA the model sees only the top three of ten paragraphs, ranked by BM25 (a classic keyword-matching ranking function).
- **Grid** (§4.2, §4.4): 9 strategies × 5 datasets = 45 runs of 20 iterations; each final prompt and the seed are evaluated three times on the same test examples and the mean is reported.
- **Budget** (§4.3): shared iterations, parent batch and candidate count, but "an equal-iteration comparison, not an equal-token or equal-rollout comparison".

## Approach

- **Search loop** (§3.1): each iteration samples one parent from the strict Pareto front, with probability proportional to its mean calibration score, and runs it on 20 random training examples. The strategy picks five groups of three outputs (they may overlap); one reflection call per group writes one child. Only calibrated prompts can become parents or the output; after 20 iterations the best calibration mean wins.
- **The nine strategies** (§3.2; templates App. A.2) vary evidence composition, example visibility, candidate selection and knowledge policy:
  - **Failures-only**, **Natural-mix**, **Balanced-mix**: groups drawn from the parent's failures only, uniformly, or aiming at a 2:1 or 1:2 failure/success split; all gated.
  - **No-examples**: the reflector sees only the task description and current instruction; the first of five candidates goes straight to calibration, ungated.
  - **No-examples+Val**: the same blind generation, then empirical selection and the gate on naturally sampled groups.
  - **Alternating**: blind on odd calls, natural evidence on even calls, both gated.
  - **LLM-judge**: the same model picks one child from the candidate texts and evidence, without their scores; that child then faces the gate.
  - **No-knowledge / With-knowledge**: the reflection prompt forbids or requests domain facts, formulas and mechanisms; both allow procedures and output conventions.

## Results

- **Main results** (§5.1, Tab. 2): no strategy is best on every dataset. Failures-only has the largest mean test gain over the seed, 8.0 points, against 7.5 for Balanced-mix and 5.2 for Alternating (Tab. 4), "driven by LiveBench-Math", where it reaches 67.7% against the seed's 34.0%. It also leads OlympiadBench and lowers GPQA accuracy.
- **Ranks** (§5.1, Fig. 2): Balanced-mix and No-examples+Val share the best mean accuracy rank (4.0), then Natural-mix (4.1); No-examples is last (8.0).
- **Local versus final improvement** (abstract, §5.4, Tab. 5): No-examples has the best Rank/Parent yet a mean test gain of only 1.4 points. Failures-only needs the fewest rounds per improvement on both measures, LLM-judge the most; every strategy needs more rounds to beat the best prompt than its parent.
- **Reflection choices** (§5.2, Tab. 3; pairs differing in one choice, mostly against Natural-mix):
  - Balanced-mix beats Natural-mix on average but not everywhere, and averages slightly below Failures-only; balance consistently protecting solved cases "is not supported by this grid".
  - Validating blind candidates (No-examples+Val against No-examples) raises the mean on all five datasets, by 3.1 points on average (on HotpotQA only by evaluation variation, the authors say, as both runs keep the seed), but also adds the gate, so "it does not isolate selection alone". Alternating beats Natural-mix on average, mostly on HotpotQA and OlympiadBench: "generation need not itself inspect examples".
  - Natural-mix beats LLM-judge on average, not on every dataset.
  - With-knowledge beats No-knowledge slightly on average, gaining most on HotpotQA, losing on OlympiadBench, IFBench and GPQA.
- **Calibration transfer** (§5.3, Tab. 4): the abstract calls the gap axis "overfitting assessment". Averaged over strategies, calibration gains exceed test gains most on IFBench (7.7 points) and GPQA (6.5), and fall 2.7 below them on both math datasets. Failures-only and Balanced-mix share the lowest mean gap rank (abstract, Fig. 2).

## Limits the authors state

- One model family for proposing and answering, so rankings may reflect "model-specific strengths and shared failure modes" (§6).
- Equal iterations, not equal tokens or rollouts; model-call counts differ by strategy, and wall-clock time is not compared (§4.3).
- The gap is "a descriptive indicator, not a direct measure of overfitting" (abstract); it mixes split difficulty, selection effects and evaluation variability (§5.3).
- Sign agreement across three evaluations "is not a significance test", and once paired controls' searches diverge, "later parents and realized evidence need not coincide" (§5.2).
- For Failures-only's math gains, "One plausible explanation is that failure-driven instructions improve reusable reasoning procedures", but the correction rates "do not establish this mechanism" (§5.1).
- HotpotQA's retrieve-then-read setup "differs from giving the model all ten candidate paragraphs" (§4.2).
- Assigning 20 rounds to runs without improvement "is a convention, not an observed waiting time" (§5.4).

## Open problems and building blocks

- **Open:** "Further study should evaluate multiple model families and sizes, including different models for reflection and task execution" (§6). The authors also urge assessing strategies "separately on final performance, parent improvement and calibration-to-test transfer" (abstract), reporting held-out gains, and "separating descriptive results from claims that require repeated optimization runs" (§6).
- **Released:** nothing stated about code or data; App. A prints the seed prompts, the reflection and judge templates, and every run's final prompt.
- **To reuse it:** one model as task model, reflector and judge, an automatic per-task scorer giving feedback, and 20 iterations of a 20-example parent batch and five candidates (§4.2–4.3).
- **Beyond its domain:** the authors say the question arises for every module that reflective optimizers such as GEPA and TextGrad (which passes text feedback through multi-component systems) update (§2).

## On this site

- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/promptopt-evolve">promptopt-evolve</a><a class="tag sub" href="#/tags/promptopt-general">promptopt-general</a></span>
