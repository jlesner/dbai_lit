# SPEAR: Code-Augmented Agentic Prompt Optimization

**SPEAR** · preprint (EMNLP 2026 submission)

Read: [PDF](https://arxiv.org/pdf/2605.26275) · [arXiv](https://arxiv.org/abs/2605.26275)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- A free-form agentic optimizer with tools: evaluate, a Python sandbox, set_prompt, finish.
- Auto-rollback returns the best validation prompt seen (abstract, §3.2), so no run ends below its seed on validation (§4.4, §6).
- The optimizer writes its own error-analysis code; it reports BBH-7 0.938 vs GEPA 0.628 (abstract) but attributes "a large share" of that gap to output-format rewriting (§4.3; "driven primarily", §6).

## In plain words

Automatic prompt engineering (APE) lets an LLM rewrite a prompt so that a fixed model scores higher on a labelled dataset. The authors argue that existing optimizers are fixed pipelines: the error signal they show the optimizer is chosen in advance, so structure in the errors, such as two often-confused classes, stays hidden (§1). SPEAR, from LinkedIn, is instead a free-form agent: it scores the prompt, writes and runs its own Python analysis over the table of per-row predictions, rewrites the prompt, and decides when to stop, returning the best validation prompt seen (abstract). The authors present it as "the first APE system in which the optimizer actively authors analysis code over the evaluation DataFrame" (§1). On a company judge task (an LLM grading another system's output, checked against human labels), over seven runs per method, its mean chance-corrected agreement with the labels on the hardest dimension is 0.483, against 0.260 for the [reflective](#/glossary/reflective-prompt-optimization) optimizer GEPA (§4.2). On the public Banking77 intent task only SPEAR substantially improves on the seed prompt (abstract).

## Background and terms

**Terms to know:** [Cohen's kappa](#/glossary/cohens-kappa) · [LLM-as-a-judge](#/glossary/llm-as-a-judge) · [reflective prompt optimization](#/glossary/reflective-prompt-optimization) · [agent harness](#/glossary/agent-harness) · [macro-F1](#/glossary/f1-score)

**The paper's own terms:**
- **evaluation DataFrame**: the pandas table `evaluate` returns, one row per example with expected label, parsed prediction and correctness (§3.1, App. M).
- **active vs. passive**: the optimizer writes the code producing its analysis signal, or reads existing execution traces (Tab. 9 caption).
- **full-split vs. sampled evaluation**: scoring a whole split costs one budget unit and can update the best-seen score; scoring chosen rows does neither (§3.1–3.2).
- **auto-rollback**: when a full-split evaluation drops the primary metric below its best-seen value, the prompt reverts to the best one (§3.2; on valid, Alg. 1).
- **guard-metric floor**: an opt-in second metric that rewrites must not push below a floor; used only on Facet (§3.2).
- **judge task**: a judge prompt scoring one aspect of an application's output; the optimizer rewrites it "to agree with the human label" (App. P).
- **format-diverging tasks**: BBH tasks "where the seed format does not match the target" (Tab. 7 caption).
- **seed**: either the seed prompt a run starts from (§1), or one independent run, as in "single-seed" (§4.4).
- **dev/test re-split**: the 130-row valid batch split 65/65 into dev, standing in for the valid split, and held-out test (App. H).
- **retention**: a prompt's score on a new task model divided by its score on the model it was optimized for (App. J).

**Missing glossary terms:**
- **automatic prompt engineering (APE)**: rewriting a seed prompt "to maximise a metric on a labeled dataset" (§1).
- **code-as-action**: CodeAct's agent design, in which the agent acts by writing code that is executed (abstract, §1).
- **confusion matrix**: counts, for each true class, how often each class was predicted (§1, App. F).

**Builds on:**
- CodeAct (not listed here), whose code-as-action paradigm SPEAR ports to APE (abstract, §2).
- The baselines TextGrad ([TextGrad](#/papers/yuksekgonul2024textgrad "TextGrad: Automatic 'Differentiation' via Text (2024)"); "textual backprop", Tab. 9) and GEPA ([GEPA](#/papers/agrawal2025gepa "GEPA: Reflective Prompt Evolution Can Outperform Reinforcement Learning (2026)"); "reflective evol.", Tab. 9), "run unchanged" (§2).
- MIPRO ([MIPRO (shipped in DSPy as MIPROv2)](#/papers/opsahlong2024mipro "Optimizing Instructions and Demonstrations for Multi-Stage Language Model Programs (2024)")), which "jointly searches instructions" and few-shot demonstrations, reduced to instruction-only and benchmarked on Banking77 (§2).
- OPTO/Trace ([Trace / OptoPrime](#/papers/cheng2024trace "Trace is the Next AutoDiff: Generative Optimization with Rich Feedback, Execution Traces, and LLMs (2024)")), the closest prior work, which "treats execution traces as passive feedback" (§1). BIG-Bench Hard (BBH) tasks and split follow OPRO ([OPRO](#/papers/yang2023opro "Large Language Models as Optimizers (2024)")), an "LLM-in-loop" optimizer (Tab. 9; §4.1, App. P).

## Problem and setting

- **Question:** does a free-form optimizer that writes its own error analysis beat fixed pipelines, and which parts matter (§1, §4.4)?
- **Objective:** the prompt maximizing the mean per-row metric (e.g. Cohen's κ, macro-F1) of a fixed task model's parsed outputs, within a budget of full-dataset evaluations and, when configured, above a guard-metric floor (§3.1, App. A). Splits: train (analysis), valid (selection), test (held out).
- **Industrial tasks** (§4.1, App. P): Hiring Assistant, 10 judge dimensions on a recruiter-intake assistant's extraction (train 94, valid 130 rows); CMA, 2 five-class tool-selection judges on a conversational memory agent (125 rows); Facet Suggestion, 1 judge of job-search filter suggestions (943 rows). Labels are human-adjudicated.
- **Public tasks** (§4.1, §4.3, App. P): BBH-7, seven BBH reasoning tasks, where "the same split is both the optimizer's valid surface and the reported test set" (App. P); GSM8K math word problems; Banking77, 77-way banking-intent classification scored with κ on held-out examples.
- **Models and budgets** (§4.1, App. K): task model GPT-4o at temperature 0. Optimizer for SPEAR and GEPA: GPT-5.4, "an internal deployment of a GPT-5-family reasoning model"; TextGrad's backward engine is GPT-4o in the matched comparison. Budgets (SPEAR 15–20 full evaluations, GEPA 400–500 metric calls, TextGrad 5 steps) give, the authors say, "comparable total task-LM calls across methods".
- **MIPRO** is instruction-only because "no row can serve as an in-context demo without label leakage" (§2).

## Approach

- **Four tools, no pipeline** (§3.1, Fig. 1, Alg. 1): each step the agent picks `evaluate` (score on train or valid), `python` (run code in a sandbox holding pandas/numpy, the evaluation DataFrame, the read-only prompt and an <a class="tag" href="#/tags/llm">llm</a> helper), `set_prompt` or `finish`. The first evaluation is forced. The sandbox sees aggregate label distributions on valid but never row content (§3.1).
- **Guardrails** (§3.2, App. B): auto-rollback and the guard floor. Sampled evaluations "do not update best-seen state, so the agent cannot inflate the headline by selectively evaluating easy rows".
- **Sandbox** (§3.3, App. C): module whitelist, no network or shell, under "a cooperative threat model (trusted optimizer LLM, internal data)".
- **Brain prompt** (App. M): prescribes error analysis after each evaluation and rewrites drafted with <a class="tag" href="#/tags/llm">llm</a>.
- **Case studies** (§5): on job location, `python` blocks find a "label-rule contradiction" that the rewrite turns into a rule, "the paper's core qualitative claim"; on CMA, the first four rewrites each target the most-confused class pair, and the last two close edge cases (App. F).

## Results

As the authors report them.
- **Industrial, matched n = 7** (§4.2, Tab. 1): SPEAR is highest on all three dimensions; on job location mean κ is 0.483 against GEPA 0.260 and TextGrad 0.159.
- **Unified optimizer, one run each** (App. G, Tab. 2): all on GPT-5.4, SPEAR is highest on all three tasks; the location gap is "a single noisy seed".
- **BBH-7** (§4.3, Tab. 7): SPEAR averages 0.938 accuracy against GEPA 0.628 and TextGrad 0.484. "A large share of the BBH-7 gap is driven by output-format rewriting": on the four non-format tasks the mean gap over GEPA shrinks to +0.033. On GSM8K, with matched format, "no method moves the metric".
- **Banking77** (§4.3): from a shared seed prompt (κ 0.791), over three runs, SPEAR reaches κ 0.927 against GEPA 0.816 and instruction-only MIPRO 0.753, with disjoint per-seed ranges.
- **Ablations, single-seed on five tasks** (§4.4, Tab. 8): removing the Python tool (A1), "the single largest lever", costs 0.79 κ on CMA tool-missing, and less on job location. The full train DataFrame in context instead (A6) recovers the gap on a format task but almost none on CMA, read as the tool's value being class-pair confusion aggregation. A rigid same-tools loop (A4) loses on job location and BBH logical deduction; a GPT-4o agent (A5) "causes near-total failure". Auto-rollback and the forced first evaluation are not claimed as "significant mean-improvers".
- **Bare agent** (§4.4): a generic agent with the same tools, model and budget but no SPEAR scaffolding trails on the confusion-structured dimensions; two canned analysis tools instead of the sandbox recover neither tested dimension.
- **Held-out re-split** (App. H, Tab. 3): SPEAR is reported highest on test κ on every dimension but employment type, where it shows a large dev-to-test drop.
- **Transfer** (App. J, Tab. 6): SPEAR's prompts keep positive retention on every task × target-model pair, the baselines on fewer.
- **Cost** (§4.4, App. E): "SPEAR converges in 2–3 full evals (vs. GEPA's ∼500)"; in single runs on two Hiring Assistant dimensions it uses more input tokens, fewer output tokens and less wall-clock time than GEPA.
- **Failure modes** (§6): no archived SPEAR run "ended strictly below seed".

## Limits the authors state

- GPT-5.4's point release can't be disclosed; it is "the only un-reproducible component" (§4.1; § "Limitations", "Reproducibility…").
- Industrial tasks rest on internal annotation, and their optimized prompts can't be released (§ "Limitations", "Proprietary data"): "a real reproducibility limitation on the industrial half of the paper" (App. N).
- GPT-4o at temperature 0 is not bit-reproducible on borderline rows; in single-seed ablations "deltas ≤ 0.05 should be read as directional"; CMA tool-missing valid is small (§ "Limitations", "Statistical reach").
- SPEAR's view of validation label aggregates is "asymmetric vs. GEPA/TextGrad", and the authors "cannot fully distinguish read-side exposure from a small-n dev-set artifact" (§ "Limitations", "Read-side valid exposure"); no larger held-out batch has been collected (App. H).
- Optimized prompts grow in length, "comparable to GEPA/TextGrad rewrites"; judges inherit annotation biases (§ "Limitations", "Prompt length…").
- "AST-level whitelisting is known-leaky"; seeing no escape attempts across 200+ logged runs is "operational experience, not a security evaluation" (§ "Limitations", "Sandbox is not adversarial").
- Generalization in the job-location prompt is "partially programmed rather than emergent" (App. O); A1 also swaps in a brain-prompt variant (App. M).

## Open problems and building blocks

- **Open:** for the read-side asymmetry with the baselines, "a correctness-only parity variant is planned" (§ "Limitations", "Read-side valid exposure"); production "may pair with a post-hoc prompt compressor" (§ "Limitations", "Prompt length…").
- **Released**: §4.1 says "We release" the agent harness, prompts and sanitized data; § "Limitations" says "we will release" them and "We release a synthetic judge-task stub"; App. N says the harness, brain prompt and BBH-7/GSM8K prompts "will be included in the supplementary release on de-anonymization", industrial prompts not.
- **To reuse it:** a labelled dataset with train and valid splits; a strong optimizer, since "Model quality is a necessary condition" (§7), though a public GPT-4.1 optimizer still beats both baselines on BBH-7 (§4.4); about 16M input tokens and 30 minutes per job-location run (§4.4, one run).

## On this site

- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/harness-general">harness-general</a><a class="tag sub" href="#/tags/harness-promptopt">harness-promptopt</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/promptopt-feedback">promptopt-feedback</a><a class="tag sub" href="#/tags/promptopt-general">promptopt-general</a></span>
