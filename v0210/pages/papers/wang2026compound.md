# Do Agent Optimizers Compound? A Continual-Learning Evaluation on Terminal-Bench 2.0

**Do Agent Optimizers Compound?** · technical report 2026 (RELAI)

Read: [PDF](https://arxiv.org/pdf/2607.14004) · [arXiv](https://arxiv.org/abs/2607.14004)  
Code: [Continual-Learning-Terminal-Bench](https://github.com/relai-ai/Continual-Learning-Terminal-Bench)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- A two-phase continual-learning test on hard Terminal-Bench 2.0 tasks: optimize, then optimize again after new tasks arrive (abstract).
- Compares GEPA, Meta-Harness and the authors' own RELAI-VCL under equal budgets (abstract).
- A skeptic result, from the vendor of one compared method: it reports GEPA's optimized agent "transfers below the unoptimized baseline" once new tasks arrive (abstract).

## In plain words

Methods that automatically improve an LLM agent's prompts and code are usually tested once, on fixed tasks. The authors argue that deployed agents are optimized repeatedly as new tasks appear, and a one-shot score cannot show whether a second round keeps earlier gains (§1.1). Their two-phase test uses hard command-line tasks: optimize an agent on 12 tasks, test it on those plus 10 new ones, then optimize on all 22 and test again. Three optimizers get the same budget: GEPA, which rewrites the prompt; Meta Harness, which edits the agent's code; and RELAI-VCL, the authors' own, which rejects any change that breaks a task the agent already solved (§2.5, §4.4). With GPT-5.5 running the agent, GEPA's agent scores below the unoptimized one on the 22 tasks before its second round (54.5% against 56.8%, Tab. 1), and RELAI-VCL averages highest over the three test points, 76.4% against 66.0% for GEPA, 64.6% for Meta Harness and 58.7% unoptimized (abstract). The authors present the test as new: "to our knowledge no existing evaluation protocol for agent-harness optimizers directly measures both" properties (§1.2).

## Background and terms

**Terms to know:** [reflective prompt optimization](#/glossary/reflective-prompt-optimization) (GEPA's method) · [agent harness](#/glossary/agent-harness) · [catastrophic forgetting](#/glossary/catastrophic-forgetting). The other field terms are defined below.

**The paper's own terms:**
- **compounding question**: whether a method that optimized an agent once can optimize it again, on a task stream that now includes new tasks, "without unwinding the gains the first round of optimization produced" (§1.2). It should generalize somewhat to unseen tasks and keep improving without regressing on solved ones (§1.2).
- **T1, T2; A0, A1, A2**: the initial task set and the later, newly introduced one; the baseline agent, and the agents after the first and second optimization rounds (§3.1–3.2).
- **pass rate**: each task is run twice per agent and scores 0, ½ or 1 by the share of the two trials solved; the pass rate is the mean over the task set (§3.3).
- **Phase-1, Transfer, Final**: the pass rate of A1 on T1, of A1 on T1 and T2 together, and of A2 on T1 and T2 together (§3.3). Transfer is measured on the union, old tasks included, not on the new tasks alone.
- **lifelong average**: the unweighted mean of those three pass rates (§3.3).
- **"Post-hoc only" vs "enforced in-loop" regression handling**: regressions on prior tasks are at best checked after a candidate is accepted, or candidates that regress are rejected during search (Tab. 2).
- **no-regression constraint**: RELAI-VCL's rule that "any candidate that improves performance on newly targeted tasks by sacrificing previously working behavior is rejected during search" (§4.4).

**Missing glossary terms:**
- **rollout**: one run of the agent on a task; optimization budgets are counted in rollouts (§5.2; the paper does not define the word).
- **benchmark overfitting**: an optimizer raising the score on a fixed evaluation set without improving, or while harming, performance on tasks outside it (§2.3).

**Builds on:**
- GEPA ([GEPA](#/papers/agrawal2025gepa "GEPA: Reflective Prompt Evolution Can Outperform Reinforcement Learning (2026)")), a reflective prompt optimizer (§2.1) and one of the three compared methods (§4.2).
- Meta-Harness ([Meta-Harness](#/papers/lee2026metaharness "Meta-Harness: End-to-End Optimization of Model Harnesses (2026)"); "Meta Harness" in most of the paper), which the authors call "Closest to our setting" (§2.1); see Approach.
- Terminal-Bench 2.0 (Merrill et al., 2026; not listed here), command-line agent tasks "with automatically checkable success criteria" (§2.4), run through Harbor, "the official framework for Terminal-Bench 2.0 evaluation", and its Terminus2 base agent (§4.1).

## Problem and setting

- **Question:** the compounding question (§1.2).
- **Agent:** one fixed baseline terminal agent running GPT-5.5, built on Harbor (§4.1, App. B.1). Each optimizer works on its own copy; the parts exposed to search are the system prompt, tool definitions and control code (§4.1).
- **Tasks:** Terminal-Bench 2.0 marks 30 of its 89 tasks hard; T1 is the 12 hard tasks with a 900-second agent timeout, T2 the 10 with an 1800-second timeout, and the 8 hard tasks with longer timeouts are excluded (§5.1, App. A).
- **Budget:** 200 rollouts per method per phase, the same for all (§5.2, Tab. 2). The proposer model (the LLM that writes candidate changes) is GPT-5.5 for all three, through Codex, OpenAI's coding agent, for Meta Harness (§4.3, Tab. 2).
- **Correct** means passing Terminal-Bench's automatic per-task check (§2.4); tasks are assumed repeatable, with reliable verifiers (§7.2).
- How many times each optimizer was run, and confidence intervals or significance tests: not discussed.

## Approach

- **Protocol (§3.2):** Phase 1 optimizes A0 on T1 into A1. A1 is scored on T1, then, with no further optimization, on T1 and T2 together. Phase 2 optimizes each method's own A1 on all 22 tasks into A2, scored on all 22. The authors say this separates three properties "that a single benchmark score conflates": static optimization strength, transfer to unseen tasks, and continued improvement (§1.3). The baseline is never re-optimized, so its Transfer and Final coincide (§3.3).
- **GEPA (§4.2):** evolutionary search with reflective mutation. Its code-mutation variant ("GEPA-code") "failed to produce a valid candidate during Phase 1"; only the prompt-only variant goes on (§4.2).
- **Meta Harness (§4.3):** a proposer agent (Codex) edits the harness code; candidates are accepted or rejected on evaluation feedback on the current task set.
- **RELAI-VCL (§2.5, §4.4):** "RELAI's Verifiable Continual Learning". It searches prompt, tool, workflow, memory, skill and code edits, with the no-regression constraint inside candidate selection. Its intended effect is "to bias search toward the smallest intervention that resolves a given failure without disrupting existing behavior" (§4.4).
  - GEPA edits only the system prompt, adding named per-task lessons that pair a Terminal-Bench task ID with exact file paths, literal error strings and step-by-step fixes (App. B.2).
  - Meta Harness's two candidates are generic robustness fixes, the second compacting long, repetitive terminal output (§4.3, App. B.3).
  - RELAI-VCL adds a task-type classifier and a completion gate that runs "verifier-discovery and runtime-contract-check commands" before finishing (Phase 1; the paper does not define these checks), then fatal-error detection and a wider search for verifier files (Phase 2), among other changes (App. B.4).

## Results

All four stages are in Tab. 8 (§6.5), repeated in Tab. 1. Each is the authors' report:
- **Phase 1, on the 12 T1 tasks (§6.1, Tab. 4):** baseline 62.5%, GEPA 70.8%, Meta Harness 66.6%, RELAI-VCL 79.2%; all three improve over the baseline.
- **Transfer, on all 22 tasks after Phase 1 only (§6.2, Tab. 5):** baseline 56.8%, GEPA 54.5%, Meta Harness 68.2%, RELAI-VCL 72.7%. The authors read GEPA's fall as overfitting to Phase 1, consistent with the "sample-specific information" they found in its prompt (§6.1–6.2). RELAI-VCL's pass rate on the 10 new tasks alone is 65.0%, "about 15 points above the baseline" (§6.2).
- **Final, on all 22 tasks after Phase 2 (§6.3, Tab. 6):** GEPA 72.7%, Meta Harness 59.1%, RELAI-VCL 77.3%, against 56.8% for the baseline, not re-optimized. For Meta Harness, "Every candidate generated during the second optimization round performed worse than the existing agent" (§6.3).
- **Lifelong average (§6.4, Tab. 7):** baseline 58.7%, GEPA 66.0%, Meta Harness 64.6%, RELAI-VCL 76.4%. The authors say the average is informative only once split into its three parts (§6.4).
- **Prompt growth:** GEPA's prompt grows from 5 lines to 103 after Phase 1 and 195 after Phase 2 (§4.2, App. B.2).
- **Conclusion:** regression-aware optimization "was associated with both transfer and continued improvement when enforced inside the optimization loop" (§8). They add, "more speculatively", that the no-regression constraint "appears to act as an implicit generalization filter": an update that fixes a new task without breaking a solved one is, in this task population, "less likely to be a narrow, task-specific shortcut" (§6.6).

## Limits the authors state

- The evaluation "is a step toward more realistic continual-learning benchmarks for agents, not a complete one" (§7).
- Terminal-Bench's tasks are only loosely related, while production failures usually arise in one domain (§2.4, §7.1); there optimizers may exploit cross-task correlations, which "could make both overfitting and generalization failures more pronounced than what we observe here, in either direction, for any of the compared methods" (§7.1).
- GEPA, Meta Harness and the protocol itself assume repeatable tasks and reliable verifiers; production feedback is often one trajectory, with no way to reproduce a failure or verify a fix (§7.2).
- The generalization-filter reading is "an interpretation consistent with the evidence in this evaluation, not as a general claim about regression-aware optimization"; the protocol "cannot fully distinguish" it from other explanations (§6.6).
- The conclusion is tied "to this specific protocol and task population, not as a general law about agent optimizers" (§8).
- The proposer models are this evaluation's configuration, "not an inherent property of the method itself" (§4.5).

## Open problems and building blocks

- **Open:** benchmarks with realistic cross-task correlation, limited observability (one trajectory instead of a repeatable environment), incomplete feedback on failure causes, imperfect or partial verifiers, and many rounds of optimization; the authors say these "remain significantly understudied" (§7.3). How GEPA's Phase-2 gains "would hold up under a further distribution shift" is left as a question (§6.3).
- **Released:** "Baseline, Phase 1, and Phase 2 agent artifacts for all three optimizers" (title-page footnote). App. C says the full prompts and code for every phase of every method are in that repository, without the rejected Meta Harness Phase 2 candidates and with no artifact for GEPA-code (App. C).
- **To reuse it:** tasks that can be rerun with an automatic pass/fail check (§2.4, §7.2); 200 rollouts per method per phase; GPT-5.5 as agent and proposer model (§4, §5.2); Harbor (§4.1).

## On this site

- **Discussed in:** [Self-improvement that compounds](#/challenges/compounding_self_improvement) · [Can a memory across problems be checked before it is reused?](#/challenges/verified_memory)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/harness-general">harness-general</a><a class="tag sub" href="#/tags/harness-promptopt">harness-promptopt</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/promptopt-context">promptopt-context</a><a class="tag sub" href="#/tags/promptopt-evolve">promptopt-evolve</a><a class="tag sub" href="#/tags/promptopt-general">promptopt-general</a></span>
