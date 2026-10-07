# Meta-Harness: End-to-End Optimization of Model Harnesses

**Meta-Harness** · COLM 2026 style

Read: [PDF](https://arxiv.org/pdf/2603.28052) · [arXiv](https://arxiv.org/abs/2603.28052)  
Code: [meta-harness-tbench2-artifact](https://github.com/stanford-iris-lab/meta-harness-tbench2-artifact)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Searches over harness code (what to store, retrieve and show the model).
- An agentic proposer reads all prior candidates' code, scores and traces through a filesystem.
- Harness optimization rather than prompt optimization.

## In plain words

An LLM application's results depend not only on the model but on its harness: the code that decides what to store, retrieve and show the model. The authors say harnesses are still designed largely by hand, and that existing text optimizers (methods in which an LLM improves a prompt or program from feedback on earlier attempts) "compress feedback too aggressively" for this job (abstract). Their Meta-Harness is an outer loop in which a coding agent can read the code, scores and execution logs of every earlier candidate harness from a folder of files, and writes new harnesses to be scored (§1).

They report (abstract): on online text classification with one fixed model, the best found harness beats a hand-designed context-management system, ACE, by 7.7 accuracy points with 4 times fewer context tokens; on olympiad-level math with retrieved solved examples, one found harness beats no retrieval on 200 problems by 4.7 points on average across five models; on TerminalBench-2, a benchmark of terminal tasks for coding agents, found harnesses "surpass the best hand-engineered baselines". They present it as automating harness engineering.

## Background and terms

**Terms to know:** [agent harness](#/glossary/agent-harness) · [Pareto front](#/glossary/pareto-front) · [best-of-N sampling](#/glossary/best-of-n-sampling) · [pass@k](#/glossary/passk) · [BM25](#/glossary/bm25) (the math harness uses "the same BM25-based lexical retrieval stack as the sparse baseline", §4.2) · [dense retrieval](#/glossary/dense-retrieval) (here with vector embeddings from a separate model, text-embedding-3-small, §4.2)

**The paper's own terms:**
- **harness**: "the code that determines what to store, retrieve, and show to the model" (§1); formally, a stateful program that wraps a fixed model and decides what context it sees at each step (§3 "Objective").
- **Meta-Harness, two senses**: the search procedure, and, in the tables, the best harness it found (§4.1, footnote 2).
- **proposer**: the model that writes new harnesses; here a coding agent, "a language-model-based system that can invoke developer tools and modify code" (§3).
- **search set**: the task instances that score candidates during search; the proposer never sees test-set results (§3).
- **execution traces**: run logs, "such as prompts, tool calls, model outputs, and state updates" (§3).
- **skill**: short natural-language instructions telling the proposer where to write harnesses, how to inspect earlier ones and which files it may change (§3).
- **online text classification**: "an LLM receives labeled examples one at a time, updates its memory, and is evaluated on a held-out test set" (§4.1).

**Builds on:**
- Text optimizers, compared first: OPRO ([OPRO](#/papers/yang2023opro "Large Language Models as Optimizers (2024)")), TextGrad ([TextGrad](#/papers/yuksekgonul2024textgrad "TextGrad: Automatic 'Differentiation' via Text (2024)")), AlphaEvolve ([AlphaEvolve](#/papers/novikov2025alphaevolve "AlphaEvolve: A coding agent for scientific and algorithmic discovery (2025)")), GEPA ([GEPA](#/papers/agrawal2025gepa "GEPA: Reflective Prompt Evolution Can Outperform Reinforcement Learning (2026)")), Feedback Descent ([Feedback Descent](#/papers/lee2025feedbackdescent "Feedback Descent: Open-Ended Text Optimization via Pairwise Comparison (2025)")) and TTT-Discover (§1, Tab. 1). The experiments also use OpenEvolve, "evolutionary search over programs with LLM mutation", and only TTT-Discover's rule for picking which earlier proposal to reuse (§4.1).
- Hand-designed classification harnesses: ACE ([ACE](#/papers/zhang2025ace "Agentic Context Engineering: Evolving Contexts for Self-Improving Language Models (2026)")), "which uses reflective memory curation to build context over time", and Meta Context Engineering (MCE), which evolves "a library of natural-language skills for context construction" (§4.1).
- Terminus 2 and Terminus-KIRA, open TerminalBench-2 agent harnesses that search starts from (§4.3).

## Problem and setting

- **Question:** whether harness engineering "itself can be automated" (§1): find the harness that maximizes the expected final reward for a fixed model; with several objectives, such as accuracy and context cost, candidates are compared by Pareto dominance (§3 "Objective").
- **Fixed parts:** the base model "is always frozen"; the proposer is Claude Code with Opus-4.6; each harness is "a single-file Python program" (§3).
- **Text classification (§4.1):** classifier GPT-OSS-120B; search datasets LawBench (criminal charges from case descriptions), Symptom2Disease (diseases from symptoms) and USPTO-50k (precursor reactants from product molecules); 40 harnesses over 20 iterations, starting from zero-shot, few-shot, ACE and MCE. ACE and MCE use an implementation from the MCE paper (Tab. 2). Nine more datasets, unseen in search, test transfer (App. C.1). Compared optimizers share the proposer configuration and the number of harness evaluations, and select on the search set only.
- **Math (§4.2):** a corpus of at least 500,000 solved problems, which the authors say they decontaminated against the evaluation benchmarks and the search set (App. C.2); 40 iterations on a 250-problem search set of olympiad problems, 109 candidates. One harness, chosen by search-set performance with GPT-OSS-20B, is tested on 200 unseen problems from IMO-AnswerBench, IMO-ProofBench and ArXivMath (answer, proof and research-style problems, App. C.3) with GPT-OSS-20B and "four models not seen during search"; metric pass@1 averaged over three samples per problem (Tab. 6).
- **TerminalBench-2 (§4.3):** 89 tasks needing "long-horizon, fully autonomous execution"; search and final evaluation use the same 89 tasks, which the authors call standard practice here, and they check for overfitting by manual inspection and regex audits. Base models Claude Opus 4.6 and Claude Haiku 4.5; other agents' scores are from the official leaderboard (Tab. 7).

## Approach

- **Search loop (§3, Fig. 2, Alg. 1).** Each evaluated harness gets a directory with its source code, scores and execution traces. Each iteration, the proposer explores this filesystem with tools such as grep and cat, since it "is typically far larger than the proposer's context window", then writes new harnesses; those passing an interface check are scored on the search set and logged. At the end, the Pareto frontier is evaluated on the test set.
- **A minimal outer loop.** No parent-selection rule, fixed scaffold or archive of prior discoveries (§3; §2): the proposer chooses what to read and "whether to make a local edit or a more substantial rewrite" (§3). The authors argue it can thus "improve automatically as coding agents become more capable" (§3).
- **Why traces.** By inspecting traces, the authors say, the proposer can often infer why a harness failed and which earlier design choices likely contributed (§3).
- **Proposer behaviour (App. A).** In the 10-iteration TerminalBench-2 run, the proposer's file reads split roughly evenly between earlier harness code and execution traces (Tab. 8). Its logged reasoning traces two early regressions to a shared prompt change and later turns to a purely additive change that became the run's best candidate (App. A.2).
- **Found harnesses (App. B).** Classification: harnesses that "maintain a growing memory of past labeled examples"; the main-text one, Label-Primed Query, shows all valid labels, one relevant example per label, and pairs of similar examples with different labels; it is "the highest-accuracy frontier point used in the main text" (App. B.1). Math: "a compact four-route BM25 program" that routes each problem by subject (App. B.2). TerminalBench-2: Terminus-KIRA plus environment bootstrapping: a snapshot of the sandbox (files, languages, package managers, memory) added to the first prompt (App. B.3).

## Results

- **Against hand-designed harnesses (Tab. 2).** On the three datasets' test sets, the selected harness reaches 48.6% average accuracy against 40.9% for ACE and 40.0% for MCE, with 11.4K context tokens against 50.8K for ACE. It "achieves a stronger accuracy-context Pareto frontier than all comparison methods" (Fig. 3).
- **Unseen datasets (Tab. 5).** On nine classification datasets not used in search, it has the best average accuracy, ahead of ACE and all few-shot baselines; the authors suggest it "captures generally effective strategies for text classification" (§4.1).
- **Against other optimizers (Tab. 4, Fig. 1 left).** On the search set with equal evaluation budgets, the best Meta-Harness candidate reaches 56.7% against 45.6% for TTT-Discover, 44.2% for Best-of-N (independent samples, no search), 43.3% for OpenEvolve and 40.2% for GEPA. The authors report that in this setting it matches OpenEvolve and TTT-Discover with 10 times fewer full evaluations (§4.1).
- **What the proposer sees (Tab. 3).** The full interface's median candidate beats the best candidate found when the proposer gets only scores, or scores plus LLM-written summaries; the authors read this "as evidence that full access to execution traces is the most important component of the interface" (§4.1).
- **Math (Tab. 6).** Averaged over five models, the found harness scores 38.8% against 34.1% with no retrieval, 37.5% for BM25 and 38.1% for dense retrieval with five examples. The authors say it beats no retrieval "across all five held-out models" and avoids "the regressions observed with dense retrieval and random few-shot prompting across several models" (§4.2).
- **TerminalBench-2 (Tab. 7).** With Opus 4.6 the found harness passes 76.4% of tasks against 74.7% for Terminus-KIRA; the found harness ranks second among Opus 4.6 agents on the leaderboard, behind ForgeCode (81.8%), which the authors "were unable to reproduce" from its public code alone. With Haiku 4.5 it passes 37.6% against 35.5% for the next-best agent, Goose.

## Limits the authors state

- "our experiments demonstrate that harness search can work with one particularly strong coding-agent proposer (Claude Code); a broader study of how the effect varies across proposer agents remains for future work" (§5).
- "Based on earlier exploration, we think this workflow only became practical recently, following major improvements in coding-agent capabilities around early 2026" (§3, footnote 1).
- On TerminalBench-2, search and evaluation share tasks, and "the resulting harness is specialized to the TerminalBench-2 regime" (§4.3).
- As history grows, "raw filesystem access alone becomes cumbersome" (App. D).

## Open problems and building blocks

- **Open:** "A natural next step for future work is to co-evolve the harness and the model weights" (§5). The bottleneck they name: "evaluation is the main computational bottleneck" (§4.1).
- **Released:** the optimized TerminalBench-2 harness and a project page with an interactive demo (title page, PDF p. 1).
- **To reuse it:** a strong coding-agent proposer (§3); a skill, whose quality is "the strongest lever on whether the loop works"; a search set hard for a simple baseline and small enough for "roughly 50 full evaluations per run" (App. D), tips the authors say "are not themselves scientific claims about the method" (App. D). "A search run completes in a few hours of wall-clock time" (§5).
- **Beyond its domain:** "Meta-Harness is largely domain-agnostic: we expect it to apply in any setting where a language model is wrapped by a task-specific harness" (App. D).

## On this site

- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/harness-general">harness-general</a><a class="tag sub" href="#/tags/harness-promptopt">harness-promptopt</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/promptopt-context">promptopt-context</a><a class="tag sub" href="#/tags/promptopt-evolve">promptopt-evolve</a><a class="tag sub" href="#/tags/promptopt-general">promptopt-general</a></span>
