# SWE-agent: Agent-Computer Interfaces Enable Automated Software Engineering

**SWE-agent** · NeurIPS 2024

Read: [PDF](https://arxiv.org/pdf/2405.15793) · [arXiv](https://arxiv.org/abs/2405.15793) · [DOI](https://doi.org/10.52202/079017-1601)  
Code: [SWE-agent](https://github.com/SWE-agent/SWE-agent)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- An agent-computer interface (commands, file viewer, linting) designed for LLM agents.
- Evaluated on SWE-bench, checked by tests.
- With the model fixed, interface design alone changes results (§5.1).

## In plain words

Language-model agents for programming tasks are typically designed to use tools built for people, such as the Linux shell (§1). The authors argue that such agents are "a new category of end users" who would benefit from interfaces built for them (abstract). They build SWE-agent: a language model plus an agent-computer interface, which offers a few commands for searching, viewing and editing files, rejects edits that introduce syntax errors, and gives short feedback after every step (§1, §3). On SWE-bench, real GitHub issues checked by each repository's own tests, SWE-agent with GPT-4 Turbo resolves 12.47% of 2,294 issues, against 3.8% for what the authors call the previous best, a non-interactive, retrieval-based system (§1). On a 300-issue subset, with GPT-4 Turbo, it resolves more than an agent given only the shell, and removing interface parts lowers its score (§5).

The authors present the interface as a new concept and SWE-agent as, "to the best of our knowledge", the "first work to explore language agents for end-to-end software engineering" (§1, §6.2).

## Background and terms

**Terms to know:** [agent harness](#/glossary/agent-harness) · [pass@k](#/glossary/passk) · [BM25](#/glossary/bm25) · [F1 score](#/glossary/f1-score) · [data contamination](#/glossary/data-contamination)

**The paper's own terms:**
- **agent-computer interface (ACI)**, with LM for language model: "an abstraction layer between the LM agent and computer" (§1): the commands the model may use, their documentation, the feedback format, and how past steps are combined into the next prompt (§2). It covers much of what the glossary calls an agent harness; the paper keeps the model fixed and changes only the ACI (§2).
- **turn, trajectory**: a turn is one thought and one command from the model plus the environment's reply; a trajectory records one episode on one task instance (§3; App. A, Fig. 9).
- **% Resolved (pass@1)**: the proportion of instances for which "all tests pass successfully after the model generated patch is applied to the repository" (§4), the metric reported unless stated otherwise (App. B.5).
- **$ Avg. Cost**: API cost "averaged over all successfully resolved instances" (§4).
- **Shell-only**: the baseline agent that works through a plain Linux shell, adapted from InterCode (§4).
- **RAG (retrieval-augmented generation) baseline**: from the SWE-bench paper: BM25 retrieves files using the issue as the query, and the model writes a patch directly, without interaction (§4).
- **failed edit, recovery**: a failed edit is an `edit` the linter (an automatic code checker) rejects; recovery is "a sequence of consecutive failed edits followed immediately by a successful edit" (§5.2).
- **localization, reproduction**: finding the lines that cause the issue; writing a script that shows the bug (App. A).

**Missing glossary terms:** none.

**Builds on:**
- SWE-bench (Jimenez et al.): the benchmark and its RAG baselines (§4); not listed here.
- InterCode (Yang et al., 2023), an interactive coding framework: the Shell-only baseline follows it (§4), and SWE-agent "directly adopts InterCode's interactive coding task formulation" (App. A.2); not listed here.
- ReAct ([ReAct](#/papers/yao2022react "ReAct: Synergizing Reasoning and Acting in Language Models (2023)")): each step is a thought and a command, then the command's result (§3).
- Human-computer interaction studies (Cooper et al.), as inspiration (§1, §2).

## Problem and setting

- **Question:** whether LM agents, like engineers with IDEs, "could similarly benefit from better-designed interfaces for performing software engineering tasks" (§1).
- **Task:** given a GitHub issue and its repository, the agent edits code; the edits form a patch, judged by the repository's tests (§4).
- **Benchmarks:** the SWE-bench test set, 2,294 task instances from 12 Python repositories; SWE-bench Lite, 300 of them that "focus on evaluating self-contained functional bug fixes"; HumanEvalFix, "a short-form code debugging benchmark" (§4) that needs no localization (App. B.7). Main results use the full set, ablations and analyses Lite, "unless otherwise specified" (§4).
- **Models:** GPT-4 Turbo and Claude 3 Opus; Llama 3 and DeepSeek Coder were tried and found "subpar" in the agent setting (§4).
- **Budget:** $4 per instance; past it, edits are submitted automatically (§4).
- **Design choice:** the final ACI came from "qualitative analysis of system behavior on a small set of hand-picked examples from the development split of SWE-bench" (§4), and window size, history handling and temperature from a sweep on 37 development instances (App. B.1, Tab. 5).

## Approach

- **Four design principles** (§2): "Actions should be simple and easy to understand for agents"; actions "should be compact and efficient"; "Environment feedback should be informative but concise"; "Guardrails mitigate error propagation and hasten recovery". They came from manual inspection and grid search (§2).
- **Search** (§3): `find_file`, `search_file` and `search_dir` print a summary of matches; above 50 results they print none and suggest a more specific query.
- **File viewer** (§3, Fig. 3): `open` shows at most 100 lines with line numbers and how many lines lie above and below; `goto` and two scroll commands move the window.
- **File editor** (§3; App. A.1): `edit` replaces a line range of the open file in one step, then shows the updated lines. A linter (flake8, limited to undefined names, duplicate arguments, indentation and syntax errors, and unreadable files) runs after each edit; an edit that triggers it is reverted, and the agent sees the error, the would-be result and the original code (Fig. 11).
- **Context** (§3; App. C): a system prompt with command docs, an optional demonstration (one solved development-set trajectory), and the issue with hand-written tips. A malformed reply gets an error message and a retry. Observations older than the last 5 are collapsed to one line each.

## Results

- **Full SWE-bench** (Tab. 1): 12.47% resolved with GPT-4 Turbo and 10.46% with Claude 3 Opus, against 1.31% and 3.79% for RAG with the same models. The authors say the ACI "was developed for GPT-4 Turbo" and is "portable to a different LM" (§1).
- **Interface against shell** (Tab. 1, Lite, GPT-4 Turbo): 18.00% against 11.00% for Shell-only and 7.33% for Shell-only without a demonstration; §5 calls this a "64% relative increase", §1 "10.7 percentage points" more.
- **Ablations** (Tab. 3, Lite, GPT-4 Turbo, against the default's 18.0%): no `edit` command 10.3%; `edit` without linting 15.0%; iterative search (one match at a time) 12.0%, no search commands 15.7%; 30-line window 14.3%, whole file 12.7%; full history 15.0%; no demonstration 16.3%. Given many matches, agents with iterative search tend to inspect every one, which "can exhaust an agent's cost budget or context window" (§5.1).
- **HumanEvalFix** (Tab. 2): 87.7 / 89.7 / 87.9 pass@1 on Python / JS / Java with GPT-4 Turbo, against 57.9 / 52.4 / 57.3 for the best other entry, WaveCoder-DS-6.7B, scores taken from another paper (Tab. 2 caption).
- **Variance** (App. B.5, Tab. 10): over six Lite runs with GPT-4 Turbo, mean pass@1 17.94%, pass@6 32.67%; the authors say "average performance variance is relatively low, but per-instance resolution can change considerably" (§5).
- **Behavior** (§5.2): SWE-agent usually begins with reproduction or localization; later turns are mostly "edit, then execute" loops. "A non-trivial minority of edit actions raise a linting error"; for GPT-4 Turbo, the chance that an editing attempt eventually succeeds falls from 90.5% to 57.2% after one failed edit (§5.2; Fig. 20). Runs submitted relatively early are "much more likely to be successful", and the authors "suspect that increasing the maximum budget or token limit are unlikely to substantially increase performance" (§5.2).
- **Failure modes** (§5.2, Fig. 8; App. B.4): GPT-4o sorted the 248 unresolved Lite trajectories of SWE-agent with GPT-4 Turbo into 9 hand-made categories, checked against the authors' labels on 15. "About half" are Incorrect or Overly Specific Implementation; failing to recover from failed edits comes next.
- **Other** (App. B): no clear link between an issue's year and its resolution rate (App. B.2, Tab. 7), presented as "controlling for possible test pollution" (§5); SWE-agent with GPT-4 Turbo picks the files to edit better than BM25 does, by F1 (App. B.9).

## Limits the authors state

- "the ACI development process and case studies are done manually" (App. E.3); their "manual approach to writing tips certainly does not scale", though they find it "surprisingly effective" (App. C).
- "the scope of SWE-agent is exclusively focused on programmatic tasks like software engineering and code generation" (App. E.3).
- "To a certain degree", the edit guardrail "forces some edits to be done in a particular order"; the search cap forces another query, which "can be an expensive operation" (App. A.1).
- If the initial approach, "typically reflected in the first 10 to 20 turns", fails, an agent "struggles to make use of later turns that build upon past mistakes" (App. B.3.1).
- Issues "that require multiple edits across a codebase remains challenging for agents" (App. B.6).
- "We are unsure if demonstrations actually help agents understand the nuances of domain specific problem solving" (App. C).
- Results are reported as pass@1 because running SWE-agent on SWE-bench "can be rather expensive" (App. B.5).

## Open problems and building blocks

  - more tools, "such as web browsing or static analysis"; fault localization or test generation via fuzzing "could prove useful" (App. E.3);
  - automating ACI design, which raises how such systems "can scrutinize and iterate upon their own designs" (App. E.3); better methods for finding failure modes and writing instructions against them (App. C);
  - stronger error recovery, by improving "the model, the ACI, or both" (App. B.3.1);
  - whether ACI principles transfer to other domains, such as web shopping or a company knowledge base (App. E.3); the authors hope studying ACIs can "contribute to our understanding of language models and agents" (§7).
- **Released:** "Data, code, and leaderboard" (title-page footnote); App. E.2 adds "all inference and evaluation artifacts (e.g., trajectories, code generations, evaluation execution traces, analysis notebooks)".
- **To reuse it:** a long context window: GPT-4 Turbo's 128k and Claude 3 Opus's 200k tokens sufficed, Llama 3's 8k did not (§4); Docker (App. A.2); the $4 budget (§4). The linter checks Python files (Tab. 4). The Dockerfile can be swapped for "other codebases and programming languages" (App. A.2).

## On this site

- **Discussed in:** [Can a memory across problems be checked before it is reused?](#/challenges/verified_memory) · [Whole-job reliability of multi-step LLM work](#/challenges/whole_job_reliability)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/harness-general">harness-general</a><a class="tag sub" href="#/tags/llm-method">llm-method</a></span>
