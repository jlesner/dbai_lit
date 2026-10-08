# Quantization Effects on Tool-Failure Recovery Vary Across Prompts and Evaluation Designs

**Quantization Effects on Tool-Failure…** · NeurIPS 2026 SLM-Agents workshop

Read: [PDF](https://arxiv.org/pdf/2610.07781) · [arXiv](https://arxiv.org/abs/2610.07781)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Compares 8-bit and 4-bit GGUF variants of Llama-3.1-8B-Instruct and Qwen2.5-7B-Instruct as tool-calling agents recovering from one injected transient tool failure, on twenty deterministic order-management tasks with verified answers and five prompts (abstract; §4).
- Scores the same runs three ways: each variant on its own clean-passing tasks, on the tasks both pass under the same prompt, and over the full pipeline with clean failures counted as failures (§3); then rescores the logs with strict output parsing instead of the executor's tolerant one (§5.3).
- Compression measured on checked agent tasks (<a class="tag" href="#/tags/compact">compact</a>), and a warning about how such comparisons are made: the authors report that the comparison "changes direction across prompts and evaluation targets" (abstract), that separate screening compares different tasks (§5.2), and that under one prompt strict scoring turns the Llama full-pipeline lead for 8-bit (+28.3 points) into a 4-bit lead (−15.0), leaving 4-bit ahead on all three targets (§5.3, Tab. 2); they recommend matched tasks, full-pipeline success for deployment decisions, and tasks as the unit of uncertainty (§6; abstract).

## In plain words

Compressing an LLM agent cuts its memory and compute, but does it change how well the agent copes when a tool fails once and then works again? The author notes that evaluations of compressed agents "primarily report task completion" (§1), and that the effect on recovery "can depend on how recovery is evaluated" (abstract). The paper compares 8-bit and 4-bit versions of two models of similar size on twenty generated order-management tasks under five prompts, and scores the same runs three ways. It reports that the comparison "changes direction across prompts and evaluation targets" (abstract). For one model under one prompt, scoring each version only on the tasks it solves without faults favors 4-bit by 17.5 percentage points, scoring the tasks both solve gives no difference, and scoring all tasks, with fault-free failures counted as failures, favors 8-bit by 28.3 points; rescoring the same logs with strict output parsing turns that into a 15.0-point 4-bit lead, leaving the other model essentially unchanged (abstract). The author calls the contribution "empirical and methodological" (§1).

## Background and terms

**Terms to know:** [post-training quantization](#/glossary/post-training-quantization) · [agent harness](#/glossary/agent-harness) · [bootstrap resampling](#/glossary/bootstrap-resampling) · [sign test](#/glossary/sign-test) · [Wilson score interval](#/glossary/wilson-score-interval) · [greedy decoding and temperature sampling](#/glossary/greedy-decoding-and-temperature-sampling) · [statistical power](#/glossary/statistical-power)

**The paper's own terms:**
- **8-bit, 4-bit, 3-bit**: shorthand for the GGUF presets `Q8_0`, `Q4_K_M` and `Q3_K_M`, which "differ in quantizer construction as well as nominal bit budget" (§7).
- **Harness, executor**: the code that runs each tool call the model emits, returns the observation, and parses and scores the output (§4). In the glossary's terms, harness plus prompts make up an agent harness.
- **Episode**: "one attempt at one task" (§4).
- **Clean screen, clean-passing tasks**: each prompt–precision cell gets one fault-free pass over all twenty tasks, and faults are injected only into the tasks that pass (§4 "Screening and execution order").
- **Transient fault**: the main condition, which "makes one target call fail while a later identical call succeeds", injected at every valid site (call) on the reference tool path (§4). Displaced and permanent faults run only under P0 (App. A; Fig. 2).
- **Evaluation targets** (§3): the *separately screened rate* averages recovery over each configuration's own clean-passing tasks, so two rates "may use different tasks"; the *matched-task recovery rate* averages over tasks both compared precisions pass under the same prompt; the *full-pipeline success rate* averages over all tasks, scoring a task that fails the clean screen as zero, "a lower bound on ungated success" used "only to rank configurations under the gated protocol".
- **Tolerant and strict scoring** (§4 "Output parsing and scoring"): the tolerant executor extracts the first JSON object from a non-JSON turn and evaluates an arithmetic expression submitted where a literal amount was asked for; strict scoring requires strict JSON and a literal amount, and also changes which tasks pass the clean screen.
- **Prompts P0–P4** (§4 "Prompts"): P0 is the original, with a worked example and an instruction that tools may fail and may be retried; P1–P4 are rewrites that keep the tool interface and output format (prose, numbered rules, terse imperatives). Only P0 explicitly requires repeated attempts before declaring a tool permanently unavailable.
- **Task bootstrap**: a bootstrap over tasks, two-sample when the compared task sets differ and paired when they match (§4 "Uncertainty").

**Missing glossary terms:**
- **GGUF**: the model-file format of llama.cpp, an open-source LLM inference engine, with named quantization presets (general definition; undefined in the paper, §7).
- **Fault injection**: making a component, here a tool call, fail on purpose during a test; the paper's "fault-injection evaluations that only perturb tasks a system already solves" (§3).

**Builds on:**
- ToolMaze (Zhu et al., 2026), a benchmark of agents under tool failures, which "provides the fault taxonomy and recovery framing used here, but evaluates full-precision agents under fixed prompts" (§2).
- ACBench (Dong et al., 2025), an evaluation of agentic capabilities under compression, and Jang et al. (2026), [Flat Score, Amplified Failures](#/papers/jang2026flatscore "Flat Score, Amplified Failures: How the Error Budget Masks Damage in Quantized LLM Agents (2026)"), cited as showing that aggregate scores can hide quantization-induced failures in τ²-bench, a benchmark of tool-using conversational agents (cited as Barres et al., 2025, and Yao et al., 2024, [τ-bench](#/papers/yao2024taubench "$\tau$-bench: A Benchmark for Tool-Agent-User Interaction in Real-World Domains (2025)")); the author says these studies do not isolate recovery from injected temporary tool failures (§2).

## Problem and setting

The question: how do 8-bit and 4-bit quantization affect recovery from a temporarily unavailable tool, where the agent "should retry when recovery is possible, avoid inventing a result, and complete the task after service returns" (§1)?

Setting (§4):
- **Tasks:** twenty deterministic tasks in a synthetic order-management environment, from lookups of an order, customer, discount and (for half) shipping fee; the generator verifies each gold answer and minimal trajectory. A forty-task suite appears only in the appendix P0 ladder.
- **Models:** Llama-3.1-8B-Instruct at `Q8_0`, `Q4_K_M` and `Q3_K_M`, and Qwen2.5-7B-Instruct at `Q8_0` and `Q4_K_M`, served with llama.cpp at temperature 0, top-k 1 and a fixed seed.
- **Protocol:** one JSON tool call per turn; an episode ends at `submit_answer`, `report_failure` or the step budget; 13–50 fault episodes per prompt–precision cell.
- **Order:** prompts, code and analysis plan were frozen after an exploratory Llama sweep; the Qwen runs are "a cross-model extension rather than a preregistered replication".
- **Uncertainty:** tasks, not fault sites or deterministic reruns, are the unit; task bootstraps, and for fixed-task comparisons two-sided sign tests that exclude ties.

## Approach

A measurement study. Each run is scored under the three evaluation targets (§3, Fig. 1), with prompt-wise matched tasks as the primary conditional comparison and the tasks passing at both precisions under all five prompts as a "stricter sensitivity analysis" (§3). Since each episode log records strict-JSON use and expression answers, the author rescores the logs under strict scoring, clean screen included, without rerunning any model (§4; §5.3).

## Results

- **Matched tasks (§5.1, Fig. 1B).** Llama's 8-bit minus 4-bit difference ranges from 0 to +20.2 points across prompts, only the P0 interval excluding zero; Qwen's from −50.0 (P3) to +35.0 (P4), both intervals excluding zero. The author says this "rules out a single 8-bit or 4-bit recovery advantage that generalizes across the two tested models and five prompts".
- **Full pipeline (§5.1, Fig. 1C).** The Llama 8-bit point estimate is higher under all five prompts (intervals exclude zero under P0 and P4); Qwen changes direction. The all-prompt intersection gives "the same qualitative warning with less power", its tasks often near the recovery ceiling.
- **Separate screening (§5.2, Tab. 1).** For Llama under P4, separate screening favors 4-bit by 17.5 points, the nine matched tasks give zero, and the full pipeline favors 8-bit by 28.3 points; the first is "driven by which tasks enter each denominator rather than by a 4-bit recovery advantage on shared work". Under P0, matching reveals a Llama difference the noisier separate estimate does not resolve, and Qwen's P3 and P4 differences survive matching: screening "can thus create, hide, or exaggerate a comparison, but it does not explain every precision difference in these data".
- **Scoring policy (§5.3, Tab. 2).** Qwen almost never submits an expression, so its estimates are essentially unchanged. Under P4, 30 of 38 successful 8-bit Llama fault episodes submit an expression, against 3 of 20 for 4-bit, and strict scoring reverses the comparison on every target: −17.5 to −42.9 points (separate), 0 to −33.3 (matched, six tasks), +28.3 to −15.0 (full pipeline). Strict scoring also asks "whether it obeys the output contract, which matters when a downstream parser does no repair".
- **Appendices (Llama only).** Under P0, Llama's pooled transient recovery on each preset's own clean-passing set is higher for `Q8_0`–`Q5_K_M` than for `Q4_K_M`–`Q3_K_M`, but "the site-level evidence is stronger than the task-level evidence" (App. A). In an exploratory analysis of Llama, P1 has a higher point estimate than P0 at 8 and 4 bits, the direction reverses at 3 bits, and almost all failed 3-bit P1 episodes end in `report_failure` after a transient error (App. C, Fig. 4).
- **Recommendations (§6).** Compare variants on the same tasks and add full-pipeline success for deployment decisions; use tasks as the unit of evidence; test recovery with the deployment prompt at each precision; document, log and match the scoring policy to the deployed executor, since "Output repair in the harness is part of the evaluated system".

## Limits the authors state

- Twenty tasks from two closely related templates in one synthetic environment, and two models of similar size, "are insufficient to estimate how often these patterns occur in other domains, model families, or scales" (§7).
- The all-prompt intersections (nine Llama, three Qwen tasks) show substantial ceiling effects and "cannot establish equivalence or characterize the full clean-passing population" (§7).
- The fault model is narrow: one transient failure that an identical retry resolves, without repeated failures, backoff, rate limits, or changing tool state (§7).
- The prompts are "not controlled paraphrases"; P3 and P4 were written after early results were known, the per-level P0–P1 analysis was specified after the pre-specified outcomes, and because P0 and P1 differ in more than the retry criterion, the interaction "does not establish a causal mechanism" (§7).
- Conclusions apply to these GGUF presets "rather than to bit width in isolation or to other quantization families"; the exploratory 3-bit prompt failure is untested in a second model (§7).
- Strict rescoring reused logs: "a model told that its expression was rejected might behave differently" (§7).

## Open problems and building blocks

- **Open:** "Larger task suites, independently designed prompts, additional model families and quantization methods, and the single-factor retry-policy ablation are needed to determine how broadly the observed variation generalizes" (§7); that ablation "has not been conducted" (App. C).
- **Released:** the task generator, harness, prompts, analysis code and per-episode logs for all twenty-five sweep cells, in the supplementary ZIP (NeurIPS Paper Checklist, "Open access to data and code").
- **To reuse it:** one NVIDIA L4 (24 GB), roughly 12 GPU-hours in total (NeurIPS Paper Checklist, "Compute").
- **Beyond its domain:** recovery harnesses such as DARC (Wang et al., 2026), a diagnose-then-self-correct method, "would need the same matched-task analysis when used to compare model variants" (§2).

## On this site

- **Tags:** <span class="tags"><a class="tag" href="#/tags/compact">compact</a><a class="tag" href="#/tags/stats">stats</a><a class="tag sub" href="#/tags/harness-general">harness-general</a><a class="tag sub" href="#/tags/llm-method">llm-method</a></span>
