# FAPO: Fully Automated Prompt Optimization of Multi-Step LLM Pipelines

**FAPO** · preprint 2026

Read: [PDF](https://arxiv.org/pdf/2606.19605) · [arXiv](https://arxiv.org/abs/2606.19605)  
Code: [fapo](https://github.com/cisco-foundation-ai/fully-automated-prompt-optimization)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Claude Code optimizes a multi-step LLM pipeline inside a standard codebase.
- Prompt edits first; chain structure changes only when attribution finds a structural bottleneck.
- Reports beating GEPA in most model–benchmark comparisons, and in all of them on GEPA's own HoVer and IFBench (abstract).

## In plain words

An LLM pipeline chains several steps (search for documents, summarize, answer, format). The authors argue that such pipelines fail through interactions among steps, so tuning prompts alone "can miss bottlenecks in the chain" (abstract, §1). They built FAPO, a codebase where the coding agent Claude Code runs the pipeline, reads every intermediate step, groups the failures by cause, and proposes one change at a time: prompt edits first, and changes to the pipeline's structure only when prompt edits appear insufficient, the task's rules allow it, and the failure analysis points to a structural cause (abstract).

Against GEPA, a prompt optimizer that only edits instruction text here, across six benchmarks and three task models, the authors report that FAPO wins 15 of 18 comparisons, with a mean gain of 14.1 percentage points (abstract), averaged over three runs each, with GEPA rerun by the authors and FAPO allowed the broader search. The largest gains come on two benchmarks where FAPO changed the pipeline itself (§1). They present FAPO as "a state-of-the-art pipeline optimization technique" (abstract).

## Background and terms

**Terms to know:** [reflective prompt optimization](#/glossary/reflective-prompt-optimization) (what GEPA does) · [BM25](#/glossary/bm25) (the HotpotQA chain has two BM25 retrieval nodes, §4.1) · [exact match](#/glossary/exact-match) (EM; HotpotQA's optimization metric and CTIBench-RCM's score, §4.1); for the rest, none in the glossary yet.

**The paper's own terms:**
- **pipeline / chain**: a multi-step LLM workflow, written as a LangGraph graph (LangGraph: a library that runs a pipeline as a graph of steps sharing a state) whose nodes are LLM calls or code steps (§1, App. A.2).
- **tenant**: one task's isolated workspace (chain code, prompts, data, scorer, configs, docs, optimization history) (§2.2, App. A.4).
- **tenant playbook**: the tenant's document that describes the task and the optimization's constraints; treated as the most important policy document, it can override FAPO capabilities (§2.2).
- **scope contract**: written by the optimizer after reading the playbook; it states which of three **optimization levels** are allowed: prompt text, chain parameters (e.g. retrieval depth), or chain structure (§3.2).
- **variant**: a new version of a prompt or chain; every attempt, accepted or rejected, gets a new file (§3.3).
- **step attribution**: classifying each failure by pipeline step and as "prompt-addressable or structural" (§3.1), first with deterministic heuristics, then with LLM analysis (App. A.3).
- **escalation**: moving from prompt edits to chain parameters or structure (§3.2).
- **Best-of-*N*** (in the paper's jailbreaking sense): an attack succeeds if any one of *N* candidate prompts succeeds (§1, §5). The glossary's best-of-N sampling (pick the top-scored of N answers) is a different use.

**Missing glossary terms:**
- **CVE / CWE**: a CVE is a published description of one software vulnerability; a CWE is a category of weakness (e.g. a buffer overflow type). CTIBench-RCM asks for the CWE ID behind a CVE description (§4.1).

**Builds on:**
- GEPA ([GEPA](#/papers/agrawal2025gepa "GEPA: Reflective Prompt Evolution Can Outperform Reinforcement Learning (2026)")): "FAPO builds on GEPA's evaluation setup but changes the optimizer" (§5); both start from GEPA's pipelines, prompts and splits (§4.2).
- The prompt and pipeline optimizers it cites together: DSPy ([DSPy](#/papers/khattab2023dspy "DSPy: Compiling Declarative Language Model Calls into Self-Improving Pipelines (2024)")), MIPRO ([MIPRO (shipped in DSPy as MIPROv2)](#/papers/opsahlong2024mipro "Optimizing Instructions and Demonstrations for Multi-Stage Language Model Programs (2024)")), APE ([APE](#/papers/zhou2022ape "Large Language Models Are Human-Level Prompt Engineers (2023)")), OPRO ([OPRO](#/papers/yang2023opro "Large Language Models as Optimizers (2024)")), EvoPrompt ([EvoPrompt](#/papers/guo2023evoprompt "EvoPrompt: Connecting LLMs with Evolutionary Algorithms Yields Powerful Prompt Optimizers (2024)")), Promptbreeder ([Promptbreeder](#/papers/fernando2023promptbreeder "Promptbreeder: Self-Referential Self-Improvement Via Prompt Evolution (2023)")), TextGrad ([TextGrad](#/papers/yuksekgonul2024textgrad "TextGrad: Automatic 'Differentiation' via Text (2024)")) (§5). The authors write that DSPy and GEPA leave a gap: "Neither is designed to inspect step-level failures and then change either prompts or pipeline structure inside a standard code workspace" (§1).
- Automated jailbreak search (PAIR, TAP, Best-of-*N* jailbreaking: attacker loops that refine prompts until one breaks a model's safety): "We use this closed-loop search pattern, but change the objective" to the mean score over many cases (§1, §5).
- Agent-run experiment loops: Karpathy's autoresearch (an agent edits a training script and keeps changes that improve validation) and Claudini (Claude Code agents that discover adversarial attacks) (§5).

## Problem and setting

- **Question:** can an agent that sees every intermediate step of a pipeline optimize it better than a prompt optimizer, by escalating from prompts to pipeline changes only when the evidence calls for it (§1, §3.2)?
- **Benchmarks** (§4.1): HotpotQA (multi-hop question answering, six-node chain, EM); HoVer, described as "a many-hop fact-verification task"; IFBench (verifiable instruction following); LiveBench-Math (math problems chosen to limit training-data contamination); AIME (competition math with short exact answers); Papillon (privacy-conscious delegation: answer quality while limiting leakage of personal information); and CTIBench-RCM (map CVE descriptions to CWE IDs, "a 263-class security classification task"), kept prompt-only.
- **Task models:** GPT-4.1-mini, GPT-5.4-mini (offered "as a reasoning model") and Gemma 3-12B for the GEPA comparison; GPT-5 and two security models, Foundation-Sec-8B-Instruct and Foundation-Sec-8B-Reasoning, for CTIBench-RCM, following the Foundation-Sec evaluation protocol (§1, §4.1, §4.2).
- **Same start, different scope:** both systems start from "the same chain architecture, baseline prompts, task model, sampling parameters, metric, and splits"; then GEPA searches instruction strings in a fixed DSPy program, while FAPO may change prompts, chain parameters and chain architecture under a prompt-first policy (§4.2).
- **GEPA reproduction:** the authors' code as-is, except that the reflecting model is replaced with Claude Opus 4.6 (§4.2).
- **Budget and protocol:** FAPO stops at 50 variants or 10 optimization rounds per trial, with no early stopping; three trials per cell; each reported score is "the test score of the best validation-selected variant from that trial" (§4.2).
- **Data access:** the optimizer sees individual training cases; "Validation and test expose aggregate scores only" (§3.3).
- **What "correct" means:** each tenant's scorer returns one composite score from 0 to 100 per case (App. A.2).

## Approach

- **Loop** (§3.2, Fig. 3): evaluate the current variant on the training split with all intermediate outputs; attribute failures by step and fix type; propose a scoped variant for the dominant failure cluster; have a reviewer check it; evaluate it and compare with the prior best; then iterate, or escalate when prompt-level search plateaus and "only if failure analysis supports that escalation".
- **Escalation rule:** chain parameters or structure only when "prompt-level optimization appears insufficient, the tenant scope contract permits those levels, and the attribution report identifies a bottleneck that prompts are unlikely to fix" (§3.2).
- **Three agents** (§3.1, Tab. 1): the optimization agent (reads the playbook, writes the scope contract, drives the loop), the step-attribution subagent, and the variant-reviewer subagent, which checks "scope compliance, placeholder integrity, data leakage, and scorer compatibility".
- **Guardrails** (§3.3): split access controls, scope constraints enforced by optimizer and reviewer independently, an iteration log, and immutable variant files.
- **Runtime** (App. A.1–A.3): a shared runner runs the chain and records each node's output; a deterministic analyzer flags weak retrieval, empty steps, cascading and format failures before Claude analyzes further.

## Results

- **Against GEPA** (Tab. 2, §4.3): FAPO wins 15 of 18 model–benchmark comparisons, 11 of them with non-overlapping mean ± standard-deviation ranges over three trials, and the mean gain over GEPA is +14.1 pp (abstract). The authors write that FAPO pipelines "typically outperform GEPA-optimized chains, except for the AIME benchmark" (§4.3).
- **Where FAPO changed the pipeline** (§4.3): on HoVer attribution found insufficient retrieval coverage, and FAPO added retrieval hops, with multi-query BM25 search and "entity-aware rescue"; on IFBench it added deterministic post-processing nodes that enforce the instruction constraints. In these six comparisons FAPO wins all six, with a mean gain of +33.8 pp (abstract).
- **Prompt-only comparisons:** FAPO wins 9 of 12, six with non-overlapping ranges, which the authors call "suggesting statistically significant improvements" (§4.3). They "attribute" this advantage "to the deep, iterative reasoning of the Claude Code orchestrator" (§4.5).
- **AIME:** GEPA leads in all three models; FAPO's changes against the baseline are mixed and within noise, so the authors "treat the AIME result as inconclusive" (§4.3).
- **CTIBench-RCM** (Tab. 3, §4.4): prompt-only FAPO raises test accuracy by +4.0 pp (GPT-5), +7.1 pp (Foundation-Sec-8B-Instruct) and +2.0 pp (Foundation-Sec-8B-Reasoning) (abstract). The best prompt differs by model: GPT-5's grows longer, with mapping rules for often-confused CWE pairs, while the Instruct model's best prompt is shorter, since "added rules hurt format extraction" (App. B.2–B.3). The authors say most remaining errors come from ambiguous CWE labels (§4.4).
- **HotpotQA case study** (§4.4, Fig. 4): two prompt variants addressed verbose answers and abstentions; attribution then flagged the rest as retrieval-limited, but the selected variant stayed prompt-only.

## Limits the authors state

- FAPO gets "a broader optimization scope than GEPA's prompt optimizer" (§4.5), and the comparison "should be read as a reproduced benchmark comparison rather than an exact fairness match" (§4.5).
- Reproduced GEPA scores "differ from the published results by −3.78 to +7.97 pp" (§4.5); the replacement reflecting model "may strengthen GEPA on HoVer and IFBench relative to the reported scores", and the original GEPA paper reports single trials where this one reports three-trial means (§4.5).
- Run-to-run variation is higher when escalation is allowed: the large standard deviations "mainly reflect whether the optimization trajectory discovers a structural intervention" (§4.5).
- The AIME results "may stem from overfitting to small sample sizes relative to the problem space" (their speculation, §4.3).
- A token budget shared by hidden reasoning and visible output "helps explain its lower baseline scores": on long-derivation tasks such as AIME and LiveBench-Math, GPT-5.4-mini "frequently emits very short or malformed final answers"; the authors say this "does not affect the controlled nature of the comparison" (§4.5).
- Isolation between tenants "is a workspace boundary rather than an operating-system sandbox" (App. A.4).

## Open problems and building blocks

- **Open:** none stated.
- **Released:** the code: "The code is available at" a GitHub repository (§1).
- **To reuse it:** Claude Code as the orchestrator (§3); the pipeline written as a LangGraph chain with a fixed factory signature and a scorer returning a score from 0 to 100 (App. A.2); a tenant playbook that sets the allowed scope (§2.2); provider adapters for OpenAI, SageMaker or Baseten-compatible inference (App. A.1); a budget of up to 50 variants or 10 rounds per trial (§4.2).
- **Beyond its domain:** the authors say the mechanism "can optimize pipelines that use a variety of closed or open-source task models" (§3) and that the results show it "can serve both general-purpose and security-focused tasks" (§6).

## On this site

- **Discussed in:** [Self-improvement that compounds](#/challenges/compounding_self_improvement) · [Whole-job reliability of multi-step LLM work](#/challenges/whole_job_reliability)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/harness-general">harness-general</a><a class="tag sub" href="#/tags/harness-promptopt">harness-promptopt</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/promptopt-feedback">promptopt-feedback</a><a class="tag sub" href="#/tags/promptopt-general">promptopt-general</a></span>
