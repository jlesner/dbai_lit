# Flat Score, Amplified Failures: How the Error Budget Masks Damage in Quantized LLM Agents

**Flat Score, Amplified Failures** · preprint 2026

Read: [PDF](https://arxiv.org/pdf/2607.27275) · [arXiv](https://arxiv.org/abs/2607.27275)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Multi-turn tool-calling agents on τ²-bench at 16-, 8- and 4-bit weights (abstract).
- Looks past the score at the failures: quantization amplifies the failure the model already shows, which the benchmark's error budget hides (abstract).

## In plain words

Storing an LLM's weights in 4 bits instead of 16 (quantization) makes it cheaper to serve, and evaluations call this "nearly lossless", but almost all of them are single-turn (§ "Introduction"). The authors ask whether that holds for agents that call tools over many turns. They run Gemma-4 and Qwen open-weight models at 16, 8 and 4 bits on τ²-bench, a customer-service benchmark with a simulated user, and inspect every tool call. No score change survives correction for multiple comparisons. Underneath, in the worst-hit model and domain (Gemma-4-31B on telecom), the share of tool calls naming a tool the agent doesn't have rises from 19.5% to 38.3%, almost always repeating names the 16-bit model already used (§ "Introduction"). The score hides this because the benchmark tolerates ten failed tool calls per episode and the agent recovers in between; with a two-failure limit the gap in that cell grows from 1.3 to 16.7 points (§ "Introduction"). Earlier compression studies of agents, the authors say, "have so far stopped at this aggregate verdict" (§ "Introduction").

## Background and terms

**Terms to know:** [bootstrap resampling](#/glossary/bootstrap-resampling) · [multiple testing](#/glossary/multiple-testing) · [equivalence test (TOST)](#/glossary/equivalence-test-tost) (margin ±7.5 points, § "Experimental Setup", "Statistics") · [post-training quantization](#/glossary/post-training-quantization).

**The paper's own terms:**
- **cell**: one model on one domain; ten in all (Tab. 1). An **arm** is one precision of a cell.
- **channel rate**: the share of the agent's own tool calls (the simulated user's excluded) that hit one kind of failure, found by matching the environment's error string (§ "Experimental Setup", "Process metrics and failure channels"). **Tool-name hallucination**, a call to a tool not in the domain's tool list, is the active channel in telecom; **entity/argument error**, a well-formed call naming a record that can't be found, in retail.
- **error budget** (`max_errors`): τ²-bench ends an episode after 10 failed tool calls (§ "Experimental Setup", "Benchmark").
- **surviving success rate S(K)**: the share of episodes that succeeded using at most K failed tool calls, recounted from existing logs (§ "Experimental Setup", "Counterfactual error budget").
- **reflexive repair**: after a failed tool call, the agent is prompted to diagnose the error and reissue the call, up to three attempts (§ "Experimental Setup", "Repair arm").
- **gate** or **full-precision propensity**: whether, and how often, the 16-bit model already makes a channel's failure (§ "Introduction").
- **damaged but masked**: Tab. 1's verdict for a cell whose channel rate rises significantly while its score shows no significant change.
- **BF16, FP8, INT4**: the arms' precisions: the original 16-bit weights, an 8-bit format, and 4-bit integers made with AWQ, a method the paper cites (Lin et al. 2024); every arm is weight-only, with 16-bit activations and KV cache (§ "Experimental Setup").

**Builds on** (none on this site):
- τ²-bench (Barres et al. 2026), the dual-control successor of τ-bench (Yao et al. 2025) (§ "Related Work").
- Evaluations finding that 4-bit quantization leaves aggregate accuracy "largely intact" (Li et al. 2024b; Jin et al. 2024) (§ "Related Work").
- Work showing compression hides uneven damage, which the authors say covers only "single-turn, static generation" (§ "Related Work").
- Dong et al. (2025) and Paramanayakam et al. (2025), quantized models as agents; both, the authors say, "score isolated steps or aggregate accuracy on a fixed pipeline" (§ "Related Work").

## Problem and setting

- **Questions** (§ "Introduction"): can the final score detect 4-bit damage to tool-calling agents (RQ1); why does it stay flat (RQ2); why are some models damaged and others not (RQ3).
- **Benchmark** (§ "Experimental Setup", "Benchmark"): in τ²-bench an agent resolves a customer request over a conversation with a simulated user, calling tools on a stateful environment. Retail is single-control (only the agent acts); telecom is dual-control (the user also acts on their own device). Each domain has 114 tasks; an episode ends when the user closes it, after 10 failed tool calls, or at 300 steps. Task reward (a final database-state check plus per-task assertions) is binary in practice; the final score is its mean.
- **Models** (§ "Experimental Setup", "Models and quantization"): Gemma-4-31B and Qwen-3.6-27B (dense), Gemma-4-26B-A4B and Qwen-3.6-35B-A3B (mixture-of-experts) on both domains; Qwen-3.5-27B and -9B on telecom only. Served with vLLM, an LLM serving engine, on A100 GPUs.
- **Protocol** (§ "Experimental Setup", "Protocol"; "Statistics", "Repair arm"): the simulated user is Qwen-3.6-27B at BF16 in every arm; agent decoding is greedy; 4 trials per task give 456 episodes per arm. One repeated run gives a "coarse single-repeat estimate" of run-to-run noise. 95% intervals come from 5,000 task-level bootstrap resamples.

## Approach

- **Score and process:** per cell, BF16 against INT4 (and FP8) on score and channel rate (§ "Experimental Setup"). **Within one model** (Gemma-4-31B, telecom): how the lists of hallucinated tool names compare across precisions, the share of INT4 events naming a tool never seen at BF16, and whether a task's increase depends on its BF16 rate.
- **Counterfactual budget:** S(K) recounted for budgets below 10, conservatively (an episode exceeding K counts as failed even if it finished earlier) but identically for both precisions. Masking predicts that tightening re-exposes damage only where quantization added error volume, a falsification test (§ "Why the Score Stays Flat: the Error Budget Masks It").
- **Repair arm:** five telecom models rerun at all three precisions with reflexive repair; these arms also use user-simulator temperature 0.6 instead of 0.7 (§ "Experimental Setup", "Repair arm").
- **A logit-margin account** (§ "Why Quantization Amplifies Existing Failures"): the margin is how far the correct next token's score leads its strongest competitor. Quantization adds roughly zero-mean noise to the scores, which rarely flips confident or already-lost choices and flips most near zero margin. So a flip promotes the already-closest competitor, an existing failure, and the full-precision failure rate is the "observable shadow" of quantization sensitivity. A positional test finds the INT4-to-BF16 ratio similar across turn bins, which the authors read as against quantization eroding instruction following as context grows (Fig. 6).

## Results

- **The score is flat** (§ "Final Task Reward Is Blind to Quantization", Tab. 1): in all ten cells the 95% interval for the score change includes zero, and none survives multiple-comparison correction. Several cells, including the most damaged one, are equivalent to no change at ±7.5 points; in the remaining Gemma-4 cells flatness means "no detectable change, not equivalence".
- **The process is damaged** (§ "The Damage Is Real, in the Process, and Channel-Specific", Tab. 1): in Gemma-4-31B telecom, INT4 raises tool-name hallucination from 19.5% to 38.3% of agent tool calls; with more calls per episode, the event count grows 2.5× (649 → 1,646). Gemma-4 MoE retail entity errors rise short of significance. Qwen-3.6 is not amplified anywhere; Qwen-3.5-27B, with a small baseline, is significantly amplified, and Tab. 1 marks it and Gemma-4-31B telecom "damaged but masked". The authors report that neither size nor dense-versus-MoE sorts damaged from undamaged cells.
- **8 bits is close to free** (§ "The Cliff Is (Mostly) at Four Bits", Tab. 4, Fig. 5): no score degrades significantly and no telecom channel moves at FP8; Gemma-4 MoE retail shows its entity trend already at FP8, not significant.
- **Old failures, not new ones** (§ "Quantization Amplifies the Existing Failure Set, Not New Ones", Fig. 2): only 3 of 1,646 INT4 hallucinations (0.18%) name a tool never invented at BF16. Nearly all invented names are real user-side tools, "role-boundary confusion". A task's increase is about the same whatever its BF16 rate.
- **The budget masks it** (§ "Why the Score Stays Flat…", Tab. 2, Figs. 3–4): in Gemma-4-31B telecom, failed calls per episode more than double while recovery after a failure stays at 55% at both precisions. The BF16–INT4 gap is 1.3 points at budget 10 and 16.7 at budget 2; the Qwen-3.6-27B control shows no gap at any budget. The gap widens 15.4 points there and at most 0.2 in other cells.
- **Repair helps only where the damage is** (§ "Discussion", "A mechanism-targeted mitigation"; Tabs. 2–3): of fifteen repair arms, the only significant score gain is Gemma-4-31B at INT4, which ends above unrepaired BF16 as its hallucinations collapse. Other arms show no significant change. The precision×repair interaction is not significant on its own, so the authors rest localization on "this cross-arm pattern" (Tab. 3).

## Limits the authors state

- The propensity claim holds only as a gate, open or closed; "a curve needs more checkpoints" (App. B (i)).
- The budget result is "a projection from existing trajectories, conservative by construction"; the margin account is indirect, as token log-probabilities aren't logged (App. B (ii)).
- INT4 recipes differ between families, "partly conflating checkpoint with recipe"; "a same-recipe requantization is the missing control" (App. B (iii)).
- One benchmark, two domains, weight-only recipes on A100s, a fixed full-precision user simulator, and a telecom-only repair arm (App. B (iv)).
- The falsification test's positive arm "has a single member", and part of the damage lands in episodes lost anyway (§ "Why the Score Stays Flat…").
- The risk screen "is one-directional": an equally open gate can stay flat (Gemma-4 MoE telecom) (§ "Discussion").

## Open problems and building blocks

- **Open:** "low-bit KV caches, activation-quantized FP8, other benchmarks, and compressed user simulators are open" (App. B); "a rerun at a tightened budget is the decisive version of the test" (§ "Why the Score Stays Flat…"). The authors propose that benchmarks report per-channel error rates and success as a function of the error budget, that full-precision channel rates screen risk before quantizing, and constrained decoding of tool names beside the lighter repair they ran (§ "Discussion").
- **Released:** "the script and per-episode logs will be released upon publication" (App. C). Nothing else stated.
- **To reuse it:** τ²-bench, vLLM on A100 GPUs, a BF16 user simulator and App. C's settings; the two diagnostics need only logs benchmarks already collect (abstract). Run time and cost: not stated.
- **Beyond its domain:** "Any weight perturbation adding near-zero-mean logit noise (pruning, low-rank compression, Distillation into compact models drift) should likewise amplify existing thin-margin failures, not create new ones" (§ "Discussion", "Beyond quantization").

## On this site

- **Discussed in:** [Bringing compact models to frontier accuracy](#/challenges/compact_model_accuracy) · [Whole-job reliability of multi-step LLM work](#/challenges/whole_job_reliability)
- **Tags:** <span class="tags"><a class="tag" href="#/tags/compact">compact</a><a class="tag sub" href="#/tags/harness-general">harness-general</a><a class="tag sub" href="#/tags/llm-method">llm-method</a></span>
