# How Fast Do Agents Rot? An Empirical Study of Long-Horizon Degradation in LLM Agents for Production Decision-Making

**How Fast Do Agents Rot?** · preprint 2026

Read: [PDF](https://arxiv.org/pdf/2609.01660) · [arXiv](https://arxiv.org/abs/2609.01660)  
Code: [agent-horizon-degradation](https://github.com/shubmittal/agent-horizon-degradation)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Measures agent success against task horizon on four task families, one a tool-use loop, five horizons and three context regimes (abstract), with success checked exactly by a ground-truth simulator (§3.1).
- Nine models; separates step count from context length (abstract).

## In plain words

LLM agents score well on benchmarks yet stay unreliable on long production workflows. The author argues the gap comes mostly from the task's horizon, the number of dependent steps it needs: if each step succeeds independently with a fixed chance, success shrinks geometrically, and benchmarks mostly sample short horizons (abstract, §1, PDF pp. 1–2). The study runs nine models on four synthetic task families whose answers a simulator checks exactly, one of them a tool-calling loop, at horizons of 2 to 32 steps, and varies how much history the agent sees. It reports that a geometric curve governed by one per-step reliability number fits best in 28 of 36 model–task combinations; that on the tool-calling task every model tested falls from near-perfect success to near zero within sixteen steps; and that shortening the history in the other three families makes decay steeper, which the author reads as step count, not context length, driving failure (abstract, PDF p. 1). The author presents horizon-resolved measurement as a gap in evaluation work, "to our knowledge" (§2, PDF p. 3).

## Background and terms

**Terms to know:** [test oracle](#/glossary/test-oracle) · [LLM-as-a-judge](#/glossary/llm-as-a-judge) · [AIC](#/glossary/akaike-information-criterion-aic) · [Wilson score interval](#/glossary/wilson-score-interval); the other statistics term is defined below.

**The paper's own terms:**
- **horizon (H)**: "the number of dependent steps an agent must execute correctly to succeed" (§1, PDF p. 2). The streaming families use 2, 4, 8, 16 and 32 (Fig. 1, PDF p. 5).
- **per-step reliability (r) and the geometric law**: if each step succeeds independently with probability r, a task of horizon H succeeds with probability "approximately r to the power H" (§1, PDF p. 2): each added step multiplies the chance of success by the same factor.
- **threshold (cliff) shape**: "strong models hold near-perfect accuracy until a critical horizon arrives" (§4.1, PDF p. 6); the third candidate shape is linear (§3.4, PDF p. 5).
- **streaming families**: the three non-agentic families (§3.2, PDF p. 4).
- **context regimes** (streaming families only, §3.2, PDF p. 4): **natural**, one instruction per turn with the full history; **compressed**, the same turns "with a shortened context via carried state and windowed history"; **padded**, all operations in a single turn.
- **format and tool-call drift**: "a turn whose output cannot be parsed as a valid action" (§4.6, PDF p. 8).
- **absorbing states**: errors the agent never recovers from (§4.6, PDF p. 8); from Markov chains, where an absorbing state is never left once entered.
- **hazard**: the chance that a given step fails; a "pure geometric decay law assumes a constant per-step hazard rate" (§4.4, PDF p. 7).

**Missing glossary terms:**
- **logit slope per horizon doubling**: the change in the log-odds of success, log(p / (1 − p)), each time the horizon doubles; more negative means faster decay (§4.5, PDF p. 8).

**Builds on:**
- Kwa et al. [9], who track the length of tasks AI systems can complete across model generations; this study instead fixes the models and resolves success against horizon (§2, PDF p. 2). Not on this site.
- Context-degradation work, read by the author as predicting context length as the main driver: Liu et al. [3], "performance degrades when relevant information sits in the middle of a long input" (lost in the middle), Levy et al. [16], Dziri et al. [4] and Laban et al. [11] (§2, PDF p. 3). Tab. 1 marks Liu et al. "Directly contradicted by our disentangling result" (PDF p. 4). None is on this site.
- ReAct [1] ([ReAct](#/papers/yao2022react "ReAct: Synergizing Reasoning and Acting in Language Models (2023)")), an agent loop interleaving reasoning with tool calls, used unmodified in the agentic family (§2, PDF p. 3).

## Problem and setting

- **Question:** what shape success takes as the horizon grows, and whether the cause is "the number of steps an agent must take or the length of context it must process" (§1, PDF p. 2).
- **Tasks** (§3.1, PDF p. 4): four synthetic families, each a tool-using agent loop with a ground-truth simulator that checks success exactly:
  - **Ledger** (streaming): keep several account balances through operations and report one (arithmetic working memory);
  - **Refchain** (streaming): track one variable through assignments amid distractors (long-range retrieval);
  - **Cipher** (streaming): apply ordered string edits to a short string (procedural execution);
  - **ToolQA** (agentic): reach a node a fixed number of hops along a hidden chain with its own inspection tool calls; each hop is revealed only by inspecting the previous node.
- **Models** (§3.3, PDF pp. 4–5): nine instruction-tuned models, six open (1.2B to 671B parameters) and three proprietary through hosted interfaces, named in Fig. 1 and Tab. 2: Llama-3.2-1B, Qwen2.5-7B, Llama-3.1-8B, Llama-3.3-70B, Qwen2.5-72B, DeepSeek-V3, GPT-4o-mini, Gemini-2.5-Flash-Lite and Claude-3-Haiku. 10,664 analyzed trajectories. "Temperature is fixed for agentic determinism" (§3.3, PDF p. 5).
- The agentic family is reported in the natural regime only, up to horizon 16 (Tab. 2, PDF p. 6).
- **Correct** means the simulator's exact check, which "keeps LLM-judge noise out of the success signal entirely" (§3.1, PDF p. 4).

## Approach

- **Shape of decay** (§3.4, PDF p. 5): per model–task cell, fit geometric, threshold and linear shapes and choose by AIC.
- **Step count against context length** (§3.2, PDF p. 4): at each horizon the operations are the same in all three regimes, on the same task instance, so regime comparisons are computed "as paired differences" (§3.4, PDF p. 5), by logit slope per horizon doubling (§4.5, PDF p. 8).
- **Inside a trajectory** (§4.4, PDF p. 7; §4.6, PDF p. 8): per-step accuracy by third of the trajectory, the first error's position, and unparseable output.
- **Projection** (§4.7, PDF p. 9): mean measured per-step reliability put through the geometric law at benchmark-typical horizons.

## Results

Each is the author's claim.
- **Geometric law (§4.1, PDF p. 6).** The geometric form wins by AIC in 28 of 36 model–task cells; the rest follow a threshold shape. Fig. 1 (PDF p. 5) plots each model's success, streaming families pooled, natural regime; the author states that "Success declines monotonically with horizon wherever the task is non-trivial for the model in question". Refchain decays flattest "for the strongest models", Ledger moderately "across most models", and Cipher steepest "for every model tested"; the author says this ordering "holds consistently enough across the model roster". Since per-step reliability "never reaches 1 on any non-trivial task in this data", collapse at a long enough horizon "is a mathematical certainty".
- **Agentic collapse (§4.2, Tab. 2, PDF pp. 6–7).** By horizon 16 "every model in the study, without exception, has collapsed to a small fraction of its starting performance". Qwen2.5-72B, perfect at horizons 2 and 4 and mostly failing at 16, is the author's example of a model a short benchmark would sign off.
- **Scale (§4.3, PDF p. 7).** Per-step reliability rises with parameter count across the open models (a positive correlation with log parameter count), the proprietary models cluster with the strongest open ones, and none reaches perfect per-step reliability on any non-trivial task.
- **Accelerating hazard (§4.4, PDF p. 7).** Pooled over long-horizon trajectories, mean per-step accuracy falls from 0.58 in the first third to 0.44 in the last; the first error comes early and agents rarely recover.
- **Step count, not context length (§4.5, Fig. 2, PDF p. 8).** Logit slope per horizon doubling: −0.44 natural, −0.69 compressed (p = 3×10⁻⁶ against natural), −0.40 padded (p = 0.51, "statistically indistinguishable from natural"). Natural is best at every horizon. The author concludes degradation "is intrinsic to executing many dependent steps" and naive context truncation "is likely to backfire rather than help".
- **Mechanism (§4.6, PDF pp. 8–9).** Format and tool-call drift affects 21% of trajectories and rises with horizon; errors behave as absorbing states, so the author recommends step-level verification where an oracle or cheap consistency check fits.
- **Benchmark gap (§4.7, PDF p. 9).** Projected success falls from 0.42 at GAIA-length horizons (8 steps; GAIA is a general-assistant benchmark) to 0.24 at hundred-step production horizons, with WebArena (web navigation), tau-bench (tool-agent-user interaction) and SWE-bench/OSWorld (software issues, computer control) lengths between.

## Limits the authors state

- The tasks are synthetic, and "broader ecological validity against fully open-ended real-world agentic workflows remains an open question beyond what this study can settle" (§5, PDF p. 9).
- The agentic family's API budget ran out before the longest horizon, so "the reported collapse H=16 is a lower bound on how severe the true collapse becomes at longer horizons, not a ceiling" (§5, PDF p. 9).
- The nine-model sample "cannot establish that every current or future model follows the identical geometric form" (§5, PDF p. 9).
- Three additional small models were excluded for not following the structured response protocol through their hosted routes (§5, PDF p. 9).
- A pure geometric law assumes a constant per-step hazard, but the hazard rises within a trajectory, so the author advises budgeting "conservatively below the geometric estimate" (§4.4, §4.7, PDF pp. 7, 9).

## Open problems and building blocks

- **Open:** sensitivity to temperature and other decoding parameters, since the study uses "a fixed, moderate decoding temperature" (§5, PDF p. 9). The author asks practitioners to measure per-step reliability on their own tasks, and benchmark designers to report success resolved against horizon rather than one aggregate (§6, PDF pp. 9–10).
- **Released:** "All code, task generators, prompts, random seeds, the complete raw dataset (10,664 trajectories), and the analysis scripts", plus an evidence-trail document mapping each reported number to its source in the data (§3.5, PDF p. 5; abstract, PDF p. 1).
- **To reuse it:** the task generators and simulators, an unmodified ReAct loop for the agentic family (§2, PDF p. 3), and model access through standard hosted interfaces for the proprietary models (§3.3, PDF pp. 4–5).

## On this site

- **Discussed in:** [Whole-job reliability of multi-step LLM work](#/challenges/whole_job_reliability)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/harness-general">harness-general</a><a class="tag sub" href="#/tags/llm-method">llm-method</a></span>
