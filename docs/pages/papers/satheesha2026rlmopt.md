# RLMOpt: Adaptive Prompt Optimization via Recursive Language Models

**RLMOpt** · preprint 2026

Read: [PDF](https://arxiv.org/pdf/2608.10471) · [arXiv](https://arxiv.org/abs/2608.10471)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- A recursive language model runs the search policy itself: inspects failures, allocates budget, decides when to stop.
- Tool-based environment with a deterministic harness enforcing scores.
- Reports never ending below its seed prompt in its 11 runs, where GEPA did twice (§5.2, Tab. 4).

## In plain words

Prompt optimizers search automatically for a prompt that makes a language model score better on a task. In existing optimizers, the authors note, a predefined algorithm steers the search while the model only writes or refines proposals (abstract, §1). RLMOpt hands that search policy to an LLM agent, which inspects the task and failed examples, writes candidate prompts, spends its evaluation budget and decides when to stop; a fixed program beside it does all scoring and decides which candidates are accepted (§1). On four benchmarks (clinical-trial text extraction, multi-hop question answering, instruction following, multi-turn tool calling), the authors report that at a single random seed, which fixes the data split, RLMOpt gets the best test score on all four, with a four-task mean of 0.610 against 0.589 for the optimizer GEPA (abstract). Across seeds it wins 9 of 11 comparisons and never ends below its starting prompt, where GEPA does twice (abstract). They report that gains depend "primarily" on the room the starting prompt leaves, not on search budget (abstract). They present it as "a different design point" (§1).

## Background and terms

**Terms to know:** [reflective prompt optimization](#/glossary/reflective-prompt-optimization) · [Pareto front](#/glossary/pareto-front) · [LLM-as-a-judge](#/glossary/llm-as-a-judge) · [meta-prompt](#/glossary/meta-prompt)

**The paper's own terms:**
- **recursive language model (RLM)**: a framework in which a language model "operates over a programmatic environment and can recursively invoke sub-models" (§1); here the agent writes short programs in a REPL (an interactive code shell) that call tools (§3.2).
- **task LM / optimizer LM**: the model whose prompt is optimized, and the model that analyzes failures and proposes prompts (§4 "Models").
- **harness**: a deterministic program, not an agent, that owns the data, runs the task LM, computes all scores and enforces the selection rules, but never chooses what to propose (§3.1).
- **seed**: the starting prompt (§3.1); also the random seed that sets the data split and any resampling (App. F.3).
- **rollout / budget B**: one candidate evaluation by the task LM; B caps how many the agent may spend (§3.1, §4).
- **field / composite**: output parts (e.g. six entity types on Chia, App. F.3), each with its own metric; the composite is their weighted sum (§3.4, Eq. 2).
- **commit / regression floor / significance gate**: the agent asks the harness to accept a candidate as the new best; it is accepted only if no field drops more than 0.05 below the current best's score on that field (Eq. 4) and its paired improvement exceeds 1.65 standard errors, "a one-sided 95% threshold under the normal approximation" (§3.4).
- **paired SE**: the standard error of per-example score differences between two methods on the same test examples (Tab. 2 caption).
- **headroom / prompting ceiling**: how much a better prompt can still raise the task LM's score, against the score beyond which prompting no longer helps (§6.2).
- **skill prompt**: the agent's fixed instructions, "the analogue of a reflective optimizer's meta-prompt" (App. A). A cross-run skill library is disabled in all head-to-heads (§4).

**Builds on:**
- Recursive language models (Zhang, Kraska, Khattab, arXiv:2512.24601; not listed here), whose formulation the agent follows (§1, §3.2).
- GEPA ([GEPA](#/papers/agrawal2025gepa "GEPA: Reflective Prompt Evolution Can Outperform Reinforcement Learning (2026)")), which "evolves prompts through reflective mutation and Pareto-based selection" (§1); every comparison runs against it, at its `auto="light"` budget (§4).
- MIPROv2 ([MIPRO (shipped in DSPy as MIPROv2)](#/papers/opsahlong2024mipro "Optimizing Instructions and Demonstrations for Multi-Stage Language Model Programs (2024)"); Bayesian optimization, a model-guided search, over instructions and demonstrations) and OPRO ([OPRO](#/papers/yang2023opro "Large Language Models as Optimizers (2024)"); a model reads earlier prompts with their scores), cited as optimizers with a predefined search policy (§1).
- LM agents (ReAct [ReAct](#/papers/yao2022react "ReAct: Synergizing Reasoning and Acting in Language Models (2023)"), Reflexion [Reflexion](#/papers/shinn2023reflexion "Reflexion: Language Agents with Verbal Reinforcement Learning (2023)"), Voyager) and ADAS ([ADAS](#/papers/hu2024adas "Automated Design of Agentic Systems (2024)")), whose meta-agent programs better agents in code (§2).

## Problem and setting

- **Question:** "we ask whether the language model can control the optimization process itself" (§1).
- **Objective:** maximize the task LM's mean metric from a seed prompt within budget B; the seed's own evaluation is not charged (§3.1, Eq. 1).
- **Benchmarks** (§4): Chia (extracting conditions, drugs and other entities from clinical-trial eligibility criteria), HotpotQA (multi-hop question answering; word-level F1, §6.1), IFBench-2025 (instruction following scored by a verifier registry of 58 constraint types) and BFCL multi-turn (Berkeley Function-Calling Leaderboard v3; tool calls scored by sequence match against a gold trajectory).
- **Splits:** the optimizer sees only train and validation; results are on held-out test sets (§4) of 100 examples (Chia, HotpotQA) and 50 (IFBench-2025, BFCL) (App. F.3).
- **Models:** task LM `gpt-4o-mini`, except `gpt-4.1` on Chia; optimizer `gpt-5.1` for both methods (§4).
- **Protocol:** headline at seed 7; repeats at three seeds, two for Chia, 11 matched runs per method (Tab. 3 caption). Per-run standard error is "approximately 0.03–0.05", and "differences within this range are treated as ties" (§4).
- **Budgets:** RLMOpt B = 500; GEPA's light budget "approximately 780–840 rollouts" (§4). On BFCL, GEPA runs through a wrapper that exposes the agentic system prompt as its instruction to optimize (§4).

## Approach

- **Agent-controlled search (§3.2–3.3, Tab. 1, App. D).** Tools cover introspection, failure analysis, synthesis (a sub-LM condenses failures into a failure mode and a candidate rule), evaluation and a scratchpad. `run_candidate` is "the only tool that consumes evaluation budget" (App. D) and returns the composite, per-field scores, mismatches and any judge rationale. The agent writes every candidate itself, except where `merge_candidates` has a sub-LM combine two (§3.2).
- **Commits (§3.4, App. E).** Floor and gate as above; "Both constraints are active on every run we report" (§3.4).
- **Final selection (§3.5, Alg. 1, App. E).** After the search the harness scores on validation the seed, committed candidates, the agent's claimed best and up to five polish variants (one re-attaching the seed's opening task statement, three appending 3, 8 and 15 gold worked examples from the training split, a sub-LM rewrite), takes the Pareto frontier over per-field scores and returns its highest-composite member. Polish is not charged to B.
- **Stopping (§3.6, App. E).** The skill prompt's three stop conditions (all fields at 0.85, 80% of the budget spent in the head-to-head setting, two consecutive candidates each without a 0.02 gain) "are not enforced by the harness". The harness enforces B and a diagnose gate: after three consecutive candidates within a 1.5-standard-error band around the running best, with no diagnosis between, the next evaluation is refused, unbilled, and the agent is told to run `synthesize_failures` on its weakest field; after two consecutive refusals one evaluation passes.
- **Multi-component candidates (§3.7).** A candidate maps component names (system prompt, tool descriptions, demonstrations) to text; tool-using agents are scored on their trajectory.
- **Skill prompt (App.

## Results

- **Seed 7 (§5.1, Tab. 2).** RLMOpt is reported best on all four and leads the mean, 0.610 against 0.589, its margin exceeding one paired SE only on BFCL and HotpotQA; the authors say the comparison "rests on consistency rather than on any one column". On Chia GEPA is higher on validation but lower on test, which the authors read as a prompt fitted to the split the optimizer sees (§5.1).
- **Across seeds (§5.2, Tabs. 3–4).** RLMOpt wins 9 of 11, losing HotpotQA and Chia at seed 13, and leads three of four benchmark means; on Chia GEPA is ahead by 0.008. RLMOpt never ends below its seed, GEPA twice; on one IFBench split RLMOpt "holds the seed exactly".
- **Compute (§5.3, Tab. 5).** Reported: fewer downstream rollouts on every benchmark and, "on three of the four", fewer tokens and less wall-clock time, widest on BFCL (1,854 s against 5,344 s). On Chia at seed 7 about 67% of RLMOpt's task-LM calls are harness-side scoring (§5.3).
- **Prompt size (§5.4, Tab. 6).** At seed 7, RLMOpt's prompts are 27–79% the size of GEPA's; "Sizes are the instruction portion" (Tab. 6 caption).
- **Trajectories (§6.1, Fig. 1).** On HotpotQA the agent sees gold answers are short spans and adds an output-format section.
- **When it helps (§6.2, App. C).** A headroom regime, with the largest gains "on the tasks with the most headroom" (Chia, BFCL), and a ceiling regime, where on "a mid-size model" neither optimizer improved two saturated tasks and RLMOpt's floor returned the seed. In a synthetic task whose label codes appear only in training data, the optimizer writes the code table into the prompt and it transfers to held-out phrasings; a larger-budget run scored lower on test while overfitting validation (App. C).

## Limits the authors state

- On BFCL, RLMOpt also optimizes demonstrations the GEPA wrapper does not expose, so the margin is "evidence for the combined system rather than for the adaptive search policy alone" (§7 "System-level attribution").
- The stop conditions "are not well calibrated" (0.85 unattainable here; 0.02 below the per-run standard error), so the budget cap is "the principal effective constraint", and sample-efficiency results reflect "the current stopping behavior" (§7 "Stopping policy"); the conditions specify "the stopping behavior requested of the agent rather than a system-level guarantee" (§3.6). The stopping decision is "an important source of run-to-run variation"; a policy using remaining per-field headroom and the commit statistic has not been evaluated (§6.2 "Self-stopping", §7).
- Four benchmarks, two task LMs, all "selected to leave exploitable headroom", so results do not establish behaviour near the ceiling "or on smaller open models"; margins "generally comparable to the per-run standard error" (§7 "Evaluation scope and cost").
- The compute comparison is of downstream evaluations, not total cost; the optimizer is "a separate, stronger model" (§7).
- The multi-component extension "remains sensitive to small validation sets": an early probe improved validation on every seed but not held-out performance, which motivates larger validation sets (§7).
- The synthetic diagnostic is "intended to demonstrate a mechanism, not to certify an effect size" (App. C).

## Open problems and building blocks

- **Open:** an ablation holding harness, budget and models fixed while swapping the adaptive policy for a fixed search, as the experiments "do not isolate the contribution of each component"; "We leave this ablation to future work" (§7).
- **Released:** Nothing stated.
- **To reuse it:** `gpt-5.1` as optimizer, Python 3.11+, DSPy 3.2+, Deno 1.40+ for the sandboxed REPL (App. F.1); a sub-LM, else the diagnose gate is off (App. E).
- **Beyond its domain:** "Retrieval pipelines are expressible the same way" and supported, but not benchmarked (§3.7).

## On this site

- **Discussed in:** [Bringing compact models to frontier accuracy](#/challenges/compact_model_accuracy) · [Comparing LLM methods under noise](#/challenges/method_comparison_under_noise)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/harness-general">harness-general</a><a class="tag sub" href="#/tags/harness-promptopt">harness-promptopt</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/promptopt-feedback">promptopt-feedback</a><a class="tag sub" href="#/tags/promptopt-general">promptopt-general</a></span>
