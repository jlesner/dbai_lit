# Are Online Skill and Memory Modules Always Worth Their Tokens? A Budget-Constrained Study of Web Agents

**Are Online Skill and…** · EMNLP 2026

Read: [PDF](https://arxiv.org/pdf/2606.15017) · [arXiv](https://arxiv.org/abs/2606.15017)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Re-evaluates three online memory, workflow and skill modules for web agents (AWM, ASI, ReasoningBank) against a vanilla actor that spends a comparable token budget on more interaction steps instead (Vanilla-IB), counting the tokens of every module (abstract; §1; §3.2–3.3).
- Four WebArena domains under Gemini 3 Flash, GPT-5.4-mini and Qwen 3.6-27B, three runs each, plus WorkArena-L1 under Qwen (§3.1; §3.3); the authors report that the budget-matched actor matches or surpasses all three modules in aggregate success rate (abstract; Tab. 1), and that single runs hide enough task-level variance to flip a comparison (§5.1).
- A case for checking memory against verified outcomes: the three modules gate or label memory by an LLM judge's verdict (App. F.4), and the authors report that more than half of ReasoningBank's success-labelled entries on Shopping come from trajectories the benchmark's own evaluator failed (App. F.3, Tab. 10), with the same contamination in AWM and a related "verification confound" in ASI (App. F.1–F.2, F.4).

## In plain words

LLM agents that browse websites to finish tasks are often given extra modules that store reusable workflows, memories or small programs from earlier tasks and feed them into later ones. The authors note that these modules spend tokens too, a cost "rarely reported next to the actor's, which makes it hard to tell whether observed gains are justified within a fixed budget" (§1). They rerun three such methods, Agent Workflow Memory (AWM), Agent Skill Induction (ASI) and ReasoningBank, on a web-task benchmark with three LLMs, count the tokens of every component, and compare them with a plain agent that spends a similar budget on more browsing steps instead. They report that the plain agent "matches or surpasses all three augmentation methods in aggregate success rate while often using fewer total tokens", with "a similar trend" on an enterprise benchmark under one model (abstract), and that single runs hide high task-level variance (§1). They present it as an evaluation study: the plain agent is "a simple budget-aware control", not a new agent (§1).

## Background and terms

**Terms to know:** [agent harness](#/glossary/agent-harness) · [agent skill](#/glossary/agent-skill) · [compute-matched comparison](#/glossary/compute-matched-comparison) · [LLM-as-a-judge](#/glossary/llm-as-a-judge) · [pass@k](#/glossary/passk) · [pass^k](#/glossary/passk-reliability-over-k-trials)

**The paper's own terms:**
- **actor**: the LLM that, at each step, reads the current page and picks the next browser action (§1, Fig. 1).
- **skill**: here "executable code, typically a Python function, that wraps a reusable sequence of low-level actions" (§1), not the glossary's text-file sense.
- **online setting**: tasks run in a fixed order, and modules extract knowledge from earlier trajectories during the evaluation and apply it to later tasks (§1, §3.1); offline methods build it before deployment (§2).
- **agent scaffold**: the paper's word for an agent design around the LLM (§1); roughly an agent harness in the glossary's terms (our bridge).
- **Vanilla-IB** (Vanilla-Increased-Budget): a plain actor without modules, with its interaction horizon (most steps per task) raised from the augmented methods' 10 to 15, plus rule-based accessibility-tree pruning (§1, §3.2).
- **total token usage**: tokens of all LLM calls, actor and modules, per task in thousands (K) (§3.3); **SR** is the task success rate.
- **Any-of-3 / All-of-3**: share of tasks solved in at least one / in all of three runs (§5.1); close to pass@3 and pass^3 over whole runs (our bridge).
- **judge vs ground-truth evaluator**: each method's LLM judge decides which trajectories count as successes for its memory; App. F checks those verdicts against the benchmark's "ground-truth evaluator" (Tab. 9, Tab. 10 captions).
- **BIDs**: the element IDs in the accessibility tree of BrowserGym (the framework the agents act through), "assigned dynamically" (§5.2).

**Missing glossary terms:**
- **accessibility tree**: a text tree of a web page's elements, exposed by browsers for assistive tools; in the BrowserGym form used here, each node has a role (e.g. button, heading) and an accessible name, one indented line per node (App. B).

**Builds on:**
- AWM (Wang et al., 2025b), ASI (Wang et al., 2025a) and ReasoningBank (Ouyang et al., 2026), the three methods re-evaluated: they induce natural-language workflows, Python skill functions and reasoning-strategy memories (§2, §3.2). None is on this site.
- ASI's codebase and prompts, which run Vanilla-IB, AWM and ASI alike (App. A, App. E).
- WebArena (Zhou et al., 2024; realistic multi-step web tasks across isolated website environments) and WorkArena (Drouin et al., 2024; tasks on the ServiceNow enterprise platform) (§3.1). Neither is on this site.

## Problem and setting

- **Question:** "under a fixed inference budget, is it better to allocate tokens to online memory and skill modules, or can a vanilla actor achieve comparable performance by spending the same budget on additional interaction steps?" (§1).
- **Benchmarks:** WebArena's Shopping, Reddit, Admin and GitLab domains (187, 106, 182 and 180 tasks; Map left out "due to website reliability issues") and WorkArena-L1 (WorkArena's Level-1 tasks): 33 task types with three seeds each (§3.1).
- **Models:** Gemini 3 Flash, GPT-5.4-mini and Qwen 3.6-27B, three runs each on WebArena; WorkArena-L1 under Qwen 3.6-27B only (§3.3).
- **Scoring:** every method is scored by the unmodified BrowserGym evaluation harness, not ReasoningBank's own pipeline (App. A).
- **Budget matching** is by step count, since token use varies per task and the methods' budgets differ: "Setting this horizon to 15 is an approximation rather than an exact budget match" (§3.2).
- **Settings:** actor temperature 0, except ReasoningBank's default 0.7 (App. A); under GPT-5.4-mini a short instruction is added to every method's action prompt (App. E).

## Approach

- **Pruning:** a text child node is removed when its text is already in its parent's name, except under prose-like parents (paragraph, heading and others); empty text nodes go too, and icon characters are ignored in the comparison; IDs, roles and structure are kept. It makes no LLM call, so it adds no token cost (App. B). The authors "do not present these modifications as a contribution" (§3.2).
- **Accounting:** tokens split into actor and module, prompt and completion (§3.3, Tab. 3).
- **Audits** beyond success rate: variance, skill fragility, two ablations, and how each method admits memory (§5, App. C, D, F).

## Results

- **WebArena (Tab. 1, §4):** the authors report Vanilla-IB has the best average SR for all three models and, for Gemini 3 Flash and Qwen 3.6-27B, is "the most token-efficient configuration". Gemini 3 Flash: 44.78% at 73.6K tokens per task against the best augmented method, ASI, at 41.02% and 107.3K; GPT-5.4-mini: 32.67% against ASI's 29.00%, at 90.2K tokens against AWM's 88.5K. The effect is strongest for GPT-5.4-mini, "suggesting that scaffold quality is itself model-dependent" (§4).
- **Reddit sweep (Fig. 2, §4):** in the closest case (Reddit, Gemini 3 Flash: a tie with AWM), Vanilla-IB matches AWM from 15 steps, surpasses it beyond, using fewer tokens up to 25 steps.
- **WorkArena-L1 (Tab. 2, §4):** under Qwen 3.6-27B, Vanilla-IB is "effectively tied with ReasoningBank" (55.56% each), beats AWM and ASI, and uses fewer tokens than ASI and ReasoningBank but more than AWM (109.4K against 102.8K).
- **Token breakdown (Tab. 3, §4, Gemini 3 Flash):** besides module calls, retrieved content inflates the actor's prompt each step: "Augmentation therefore imposes a double cost".
- **Higher step budget (Tab. 7, App. D):** at 15 steps for the augmented methods and 20 for Vanilla-IB (Qwen 3.6-27B, three domains), "The ordering is largely preserved"; ASI's nominal Admin lead is, the authors say, far smaller than the run-level standard deviations.
- **Variance (Tab. 4, §5.1):** on Shopping the Any-of-3 to All-of-3 gaps are "relatively large for all the methods", e.g. Vanilla-IB, GPT-5.4-mini: 46.52% against 27.81% (mean 38.50%). At a matched step budget, they state, a vanilla actor can win one run and lose another, so "a single-run comparison can support opposite headlines" (§5.1).
- **Skill fragility (§5.2):** skills that refer to elements by BIDs can break when the page updates mid-skill, failing silently, raising errors or acting on the wrong element.
- **Horizon against pruning (Tab. 5, §5.3, Gemini 3 Flash):** the authors report the horizon drives the SR gain and pruning mainly cuts tokens; unpruned, the 15-step actor already outperforms all three augmented methods. Pruning the baselines on Shopping lowers their tokens with mixed SR effects, and "Even where pruning helps, the pruned baseline still trails" Vanilla-IB (Tab. 6, App. C).
- **Judge-gated memory (App. F; Shopping, Reddit, Admin under Gemini 3 Flash and GPT-5.4-mini):** ASI stores an induced function after a verification episode that calls it first; they report it fails before the second action in 72.2% of Shopping verifications under GPT-5.4-mini, and over half of those are still judged successes and stored (Tab. 8, App. F.1). On Shopping, 49.5% (Gemini) and 52.3% (GPT) of AWM's workflow inductions come from trajectories the ground-truth evaluator failed (Tab. 9, App. F.2), as do 52.9% and 59.5% of ReasoningBank's entries labelled successes (it stores lessons from every task, each labelled by its judge) (Tab. 10, App. F.3). The authors trace all three to a judge that sees the agent's text output and, in some configurations, the final page, but not the pages visited before: "This is not necessarily a matter of judge capability" (App. F.4).
- **Practical properties (§6, no experiments):** Vanilla-IB keeps no cross-task state, so tasks can run in parallel and one hit by an environment failure can be re-run alone; for the sequential augmented methods such a repair "is not possible in general".

## Limits the authors state

- Conclusions "are restricted to the benchmarks we tested and should not be generalized to all web environments"; WorkArena-L1 covers only Qwen 3.6-27B and three seeds per task type (§8).
- The benchmarks place little demand on long-term memory; memory-intensive environments "could shift the balance toward memory modules", and testing there is "an important direction for future work" (§8).
- More homogeneous task distributions, longer deployment horizons, or stable high-level APIs "may yield a more favorable tradeoff for augmentation methods" (§8).
- The argument covers online augmentation only; offline methods such as SkillWeaver (Python API skills built before deployment) and WALT (tool abstractions learned from website structure) (§2) need different accounting (§8).
- In a few tasks Vanilla-IB spends slightly more tokens than an augmented method: "a limitation of step-count-based budget control", uncommon in their experiments (§3.2).
- Skills and workflow memory "can provide gains in domains where task structure supports reuse" (§7).

## Open problems and building blocks

- **Open:** beyond the future-work item under Limits, none named. The bottleneck they name: judge-based quality control, whose input is "fundamentally incomplete"; a stronger judge "faces the same gap", and passing the full trace would, for a ten-step task on a content-heavy page, cost more than the trajectory judged (App. F.4). They propose three evaluation principles: report total tokens of all modules, compare within the same budget, report multi-run variance (§1).
- **Released:** nothing stated; the title page links a project page only.
- **To reuse it:** the pruning needs no model and is given in full (App. B); the runs use ASI's codebase with BrowserGym, Qwen 3.6-27B served with vLLM (an LLM serving library) on four H100 GPUs (App. A), and the GPT-5.4-mini prompt addition (App. E).

## On this site

- **Tags:** <span class="tags"><a class="tag" href="#/tags/stats">stats</a><a class="tag sub" href="#/tags/hacking-general">hacking-general</a><a class="tag sub" href="#/tags/harness-general">harness-general</a><a class="tag sub" href="#/tags/harness-promptopt">harness-promptopt</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/promptopt-context">promptopt-context</a><a class="tag sub" href="#/tags/promptopt-general">promptopt-general</a></span>
