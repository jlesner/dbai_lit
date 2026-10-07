# ContraPrompt: Contrastive Prompt Optimization via Dyadic Reasoning Trace Analysis

**ContraPrompt** · ICLR 2026 LLM Reasoning Workshop (PDF running head)

Read: [PDF](https://arxiv.org/pdf/2604.17937) · [arXiv](https://arxiv.org/abs/2604.17937)  
Code: [contraprompt_artefacts](https://github.com/rishvv/contraprompt_artefacts)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Contrastive optimization from paired reasoning traces (a failed and a successful attempt on the same input; abstract, §1).
- Dyadic trace analysis drives the edit.
- Reports beating GEPA on all four benchmarks, including HotpotQA (abstract).

## In plain words

Prompt optimizers improve an LLM's instructions by studying its failures. The authors argue that existing ones study one execution at a time or compare prompt variants, and so miss a signal: when a model fails on an input but succeeds on a retry after feedback, its two chains of thought (which also differ in that feedback) show which reasoning step made the difference (abstract, §1). ContraPrompt runs such a retry loop, has a stronger model turn each failed-then-successful pair of traces into a written rule, and arranges the rules in a decision tree that shows each input only the rules for its kind (§4).

With one prompt per task and the same Claude model for every method, the authors report beating the [reflective prompt optimizer](#/glossary/reflective-prompt-optimization) GEPA on all four benchmarks they test, by 0.74 to 8.29 percentage points (abstract). They present the traces' difference as a signal not captured by prior methods "operating on single traces or on final-output comparisons" (abstract), and also apply it to financial tagging and to searching for a function's minimum (§7, §8).

## Background and terms

**Terms to know:** [direct preference optimization (DPO)](#/glossary/direct-preference-optimization-dpo) · [Pareto front](#/glossary/pareto-front) · [outcome and process rewards](#/glossary/outcome-and-process-rewards) · [reinforcement learning](#/glossary/reinforcement-learning) · [token F1 and macro F1](#/glossary/f1-score) · [black-box optimization](#/glossary/black-box-optimization)

**The paper's own terms:**
- **trace, τ⁻ and τ⁺**: the full chain of thought before the final answer; τ⁻ scores lower and τ⁺ higher on the same input (§3.1).
- **dyadic reasoning trace analysis**: comparing a failed and a successful trace of the same model on the same input to extract the "reasoning delta" (abstract, §1).
- **monadic**: the authors' word for prior methods that read "one trace per diagnostic step" (§2).
- **retry success rate**: the probability that a retry scores higher than a failed first attempt (Def. 1, §3.2).
- **capability-application gap**: a model has one on a task when its retry success rate at temperature 1.0 is "substantially larger than zero"; "an empirical characterization of the task-model pair rather than a formal condition" (Def. 1, §3.2). Its opposite, a **capability deficit**, is a failure where the model cannot produce the correct reasoning (§3.2).
- **contrastive pair**: an example's worst and best attempts, kept when the score gain between them is at least 0.02 (§4.2).
- **aggregated failure analysis**: examples where every attempt failed, grouped by error type and analysed together (§4.4).
- **input-aware decision tree**: the prompt's rule section: an `<always>` block for every input and `<branch>` blocks guarded by conditions on the input, at most two levels deep (§3.4, §4.5).
- **single-module**: one LLM call with one system prompt per input (§5).

**Builds on:**
- GEPA ([GEPA](#/papers/agrawal2025gepa "GEPA: Reflective Prompt Evolution Can Outperform Reinforcement Learning (2026)")), a reflective prompt optimizer keeping a Pareto frontier of candidates; the primary baseline, which the authors say reads trajectories "monadically (one trace, one diagnosis)" (§1, §2). §8 uses GEPA `optimize_anything` as a code-evolution loop.
- Retry loops: Reflexion ([Reflexion](#/papers/shinn2023reflexion "Reflexion: Language Agents with Verbal Reinforcement Learning (2023)"); verbal reflections on past failures condition the next attempt), Self-Refine (iterative self-feedback at inference time) and SCoRe (self-correction trained in by reinforcement learning) (§1, §2).
- Prompt optimizers they contrast with: ProTeGi ([ProTeGi](#/papers/pryzant2023protegi "Automatic Prompt Optimization with 'Gradient Descent' and Beam Search (2023)")) and TextGrad ([TextGrad](#/papers/yuksekgonul2024textgrad "TextGrad: Automatic 'Differentiation' via Text (2024)")), which diagnose individual failures in words, and OPRO ([OPRO](#/papers/yang2023opro "Large Language Models as Optimizers (2024)")) and APE ([APE](#/papers/zhou2022ape "Large Language Models Are Human-Level Prompt Engineers (2023)")), which search over candidate prompts (§1, §2); and DPO, which compares final outputs only (§1).
- ACE ([ACE](#/papers/zhang2025ace "Agentic Context Engineering: Evolving Contexts for Self-Improving Language Models (2026)")), a context-engineering method (organizing what goes into the model's context) that motivates the tree (§2, §3.4) and whose setup on the financial-tagging benchmark FiNER-139 §7 matches.

## Problem and setting

- **Question:** do same-input failure-to-success trace pairs give prompt-optimization signal that single traces and final-output comparisons don't (§1, §3)?
- **Models:** Claude Haiku 4.5 solves tasks at temperature 1.0; Claude Sonnet 4.5 extracts rules and builds the tree at 0.7 (§5). Temperature 1.0 is "deliberate": lower temperatures make retries tend to repeat the failed reasoning (§3.2, §4.1).
- **Benchmarks (§5):** HotPotQA (multi-hop question answering over several passages; token F1, with a "threshold 0.6" whose use isn't explained), BBH (23 BIG-Bench Hard reasoning tasks; exact match), GPQA Diamond (graduate-level science, four-option multiple choice) and GDPR-Bench-Android (multi-label classification of violations of GDPR, the EU data-protection law, in Android app code; macro F1).
- **Data and settings (App. B):** 50 training and 50 validation examples for HotPotQA, BBH and GPQA Diamond, 100 and 100 for GDPR-Bench; test sets of 200, 540, 98 and 687. Up to 3 attempts, up to 15 outer iterations, patience 3 (stop after 3 iterations without improvement), "No benchmark-specific tuning".
- **Comparison:** all methods (Tab. 1's "Naive CoT" baseline, GEPA, ContraPrompt) work "under the same single-module constraint on the same model"; GEPA's four-module HotPotQA pipeline is "not directly comparable" (§5, App. B).

## Approach

ContraPrompt loops over five phases (§4; Alg. 1, App. A):

- **Retry loop (§4.1).** Each training example gets up to 3 attempts by default. The base prompt stays fixed across attempts; feedback is appended: below a score of 0.3 a generic "Think more carefully", otherwise the error type.
- **Contrastive mining (§4.2)** keeps and ranks the pairs above.
- **Rule extraction (§4.3).** The extractor sees both traces with their feedback, is told to focus on the change in reasoning approach, and writes rules in the template "When [input pattern], [strategy] because [causal justification]." "A subset" of rules target output formatting (e.g. dropping answer prefixes) and are kept. **Aggregated failure analysis (§4.4)**, part of the same phase, adds rules on "what is structurally absent" when the model cannot succeed.
- **Tree merge (§4.5).** An LLM clusters failing inputs and assigns rules to them; a rule's "when" clause becomes a branch condition. Conditions "are restricted to features directly observable from the input, enabling deterministic routing at inference time". Branches "emerge from the contrastive data without manual specification".
- **Checkpoint.** The tree is injected into the prompt, scored, and the best version kept; the loop stops at the patience limit (Alg. 1; App. B). §1 describes the extracted deltas as "validated on held-out examples".

**Observation 1 (§3.3):** comparing pairs of reasoning traces gives step-level signal that comparing pairs of final outputs alone does not, "supported empirically" in App. C.

**Black-box optimization (§8).** Both systems iteratively write Python solvers, run them and feed diagnostics back. ContraPrompt pairs a round's worst and best evaluations and writes a "landscape summary" (notes on the shape of the function being minimized) from them; GEPA's reflection model reads "Actionable Side Information" (trial scores, tracebacks, budget status).

## Results

- **Main results (Tab. 1, §6.1).** It reports ContraPrompt above GEPA on all four benchmarks: HotPotQA 39.77 → 48.06 token F1 (+8.29 points), GPQA Diamond 67.35 → 74.49 accuracy (+7.14), GDPR-Bench 12.15 → 14.36 macro F1 (+2.21, +18.2% relative) and BBH 87.59 → 88.33 exact match (+0.74), single-module.
- **Retry success.** The authors observe that 20–37% of first-attempt failures recover on retry "with minimal feedback" (§1, §3.2), and that the gains over GEPA are ordered like the retry success rates, "a suggestive pattern rather than a statistical finding" with four benchmarks (§1, §6.1). §6.1 relates the HotPotQA gain to evidence citation: "failed traces skip source attribution; successful traces include it".
- **Ablations (App. C)**, mean relative drop over the four benchmarks: −16% without retries and contrastive mining, the same −16% when the extractor sees only final answers, −6% with flat rule injection instead of the tree, −4% without failure analysis. They read the answer-only result as showing that "the reasoning trace, not merely the paired comparison structure" carries the signal (App. C, §10).
- **FiNER-139 (§7):** tagging numbers in SEC filings (US company reports) with 139 XBRL tags (a financial-reporting vocabulary), with the LLM DeepSeek-V3.1 as task and extraction model "to match the setup" of ACE. It reports 74.94% accuracy against 73.0% for GEPA and 67.17% unoptimized. The tree's branch categories "align with standard US GAAP financial-instrument categories" (US accounting standards).
- **EvalSet (§8):** 53 synthetic test functions, 2,000 evaluations per problem. Head to head, ContraPrompt wins 11, ties 41 and loses 1 against GEPA `optimize_anything`; both are also compared with Optuna (a hyperparameter-search library).

## Limits the authors state

- The method "requires at least one successful retry per training example"; otherwise it falls back to aggregated failure analysis, "which provides weaker signal" (§9).
- Because the retry also sees the feedback, the pair "is therefore not a pure reasoning-strategy comparison"; the extractor's separation of the two is "approximate" (§3.3, §9).
- "We evaluate on four primary benchmarks with a single task-solving model family" (§9).
- No correlation statistics for the retry-rate ordering at four benchmarks (§6.1).
- Formatting rules "should not be conflated with reasoning-process changes" (§4.3).
- Single-module scope: "Results should be interpreted accordingly" (§5).
- FiNER's GAAP-like branches are "not a claim that the method discovers GAAP independently" (§7).
- On McCourt11, an EvalSet test function, they suggest that on landscapes "where surrogate-guided search is critical" (search steered by a learned model of the function), GEPA's richer side information "can outperform contrastive summaries" (App. E).

## Open problems and building blocks

  - a controlled experiment that retries without feedback at temperature 1.0 and compares the reasoning delta with the fed-back condition (§3.3, §9);
  - testing, on enough benchmarks for a statistical claim, whether higher retry success rates give more and better contrastive pairs (§6.1);
  - a hybrid with GEPA's Pareto-frontier search (§1, §9); an online variant updating the tree in deployment; deeper or graph-structured rule organizations (§9);
  - more models, benchmarks and training scales, and compound AI systems "where failure may propagate across module boundaries" (§9).
- **Released:** "artefacts such as optimized prompts for reproduction" (abstract, footnote 1); App. E says "Complete artifacts are available in our repository".
- **To reuse it:** an automatic score per answer (§3.1, §4.1); a task model whose failures sometimes recover on retry at temperature 1.0 (§3.2, §9); a single-prompt task (§5).
- **Beyond its domain:** the authors conclude that "the dyadic primitive applies whenever a higher-quality and a lower-quality execution on the same problem can be compared to extract a transferable strategy rule", on the evidence of §7 and §8 (§10).

## On this site

- **Discussed in:** [Bringing compact models to frontier accuracy](#/challenges/compact_model_accuracy)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/harness-general">harness-general</a><a class="tag sub" href="#/tags/harness-promptopt">harness-promptopt</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/promptopt-feedback">promptopt-feedback</a><a class="tag sub" href="#/tags/promptopt-general">promptopt-general</a></span>
