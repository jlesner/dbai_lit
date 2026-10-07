# Self-Evolving Coding Rules for AI Coding Agents

**RuleEvolve** · NeurIPS 2026

Read: [PDF](https://arxiv.org/pdf/2610.00650) · [arXiv](https://arxiv.org/abs/2610.00650)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Evolves a pool of coding-agent rules: an LLM mutates candidates and a judge keeps the best (abstract).
- Evaluated on two agent frameworks, four LLMs and three benchmarks against no rules, a manual rule set and one prompt optimizer, Prompt-Ops (abstract; §5.1).
- Context optimization for coding agents: the judge scores code length, with a penalty for losing correctness against no rules (§4.2, Eq. 5).

## In plain words

AI coding agents (such as OpenHands or Claude Code) are guided by a file of coding rules, often named AGENTS.md, added to the model's input. The authors say such rules are "almost exclusively hand-crafted by human developers", which is labor-intensive and suboptimal, and that existing prompt optimizers primarily target short, few-sentence instructions (§1). They build RuleEvolve: an LLM rewrites candidate rule files, a judge runs the agent with each candidate on sample tasks and scores the length of the code written, penalizing tasks solved without rules but failed with them, and the best few candidates are kept (§1; §4). Headline: with gpt-5.3-codex in an OpenAI-SDK agent on the BigCodeBench coding benchmark, the evolved rules cut average code length "by over 60% without sacrificing pass rate" (§1). Across two agent frameworks, four models and three benchmarks they report that it "consistently maintains or improves" the pass rate while cutting length and cost (§1). They present a framework for a problem they call "largely unexplored" (§2), not a first.

## Background and terms

**Terms to know:** [agent harness](#/glossary/agent-harness) · [pass@k](#/glossary/passk)

**The paper's own terms:**
- **coding rules**: the instruction file a coding agent gets with every task, "often instantiated as an AGENTS.md document and prepended to the backbone model's input context" (§1). In the experiments, OpenHands gets them through its AGENTS.md configuration and the OpenAI SDK agent in its system prompt (§5.1).
- **backbone LLM**: the model that powers the agent (§3.1).
- **mutator module**: an LLM that rewrites a rule set following a "mutation guidance", typically a natural-language directive, such as one to make a variant "by improving wording, reordering or combining steps, and varying the style" (§4.2).
- **judge module**: the evaluation environment: it runs the agent under the candidate rules on a task set, executes the generated code, and returns one score (§4.2).
- **score set**: the scores a candidate has collected, one per iteration's evaluation; a new candidate "inherits the score set from its parent" to avoid what the paper calls a cold-start problem: no scores yet (§4.3).
- **metrics** (§5.1): pass rate (PR), "the percentage of generated code that satisfy all provided test cases"; code lines (CLn); code characters (CC); generation time; token usage (Tok). The last four are averaged "only on code that is functionally correct".
- **Manual rule**: a fixed rule set from awesome-cursorrules, a public collection of rule files (§5.1, App. F). Tabs. 3–4 label a baseline "Public rule".

**Missing glossary terms:**
- **Optimal Computing Budget Allocation (OCBA)**: a simulation-optimization method, cited to Chen and Lee (2011), for spreading a limited budget over noisy candidates to maximize the Probability of Correct Selection (PCS), "the probability that the candidate rule set with the highest sample mean is indeed the true best performer" (App. B).

**Builds on:**
- Prompt-Ops, cited to Wu et al. (2025), "a baseline designed for prompt optimization for LLMs" (§2.3, §5.1). Not on this site.
- OCBA (Chen and Lee 2011), adapted for mutation allocation (§4.3, App. B). Not on this site.
- Automatic prompt optimizers, among them DSPy ([DSPy](#/papers/khattab2023dspy "DSPy: Compiling Declarative Language Model Calls into Self-Improving Pipelines (2024)")) and Promptbreeder ([Promptbreeder](#/papers/fernando2023promptbreeder "Promptbreeder: Self-Referential Self-Improvement Via Prompt Evolution (2023)")), which §2.3 says "primarily target short prompts consisting of only a few sentences".

## Problem and setting

- **Question:** can coding rules be evolved automatically so that the agent's code stays correct while getting shorter and cheaper to generate (§3.1)? The authors motivate length with "Code length determines the performance of the generated code, where optimized logic reduces execution latency and resource consumption" (§3.1).
- **What "correct" means:** a pass-or-fail verifier that "may be implemented" by running the task's test cases on the code (§3.2). The formal objective maximizes average conciseness and cost scores subject to the average pass rate staying at or above τ, "a predefined threshold" (§3.2, Eq. 3).
- **Data (§5.1):** 1,000 random BigCodeBench tasks for training, scored in random mini-batches of B tasks. Testing uses 100 random samples from each of BigCodeBench (BCB), BigCodeBench-Hard (BCB-H) and HumanEval (HE), benchmarks of programming tasks checked by tests (§2.1). BCB test samples "are strictly disjoint from the training sets used during evolvement". Extra test: 100 repository-level tasks of SWE-bench Lite (§5.2).
- **Agents and models (§5.1):** OpenHands ("a state-of-the-art open-source autonomous agent") and "a custom GPT-based agent implemented via the OpenAI SDK"; backbones gpt-4.1-mini, gpt-5-mini, gpt-5.3-codex and the open-weight Qwen-Coder-30b, with rules evolved "for each model respectively".
- **Baselines (§5.1):** No rule (no rules file), Manual rule, and Prompt-Ops with "their default settings"; for the ablation, even allocation and allocation proportional to each candidate's average score.
- **Defaults (§5.1):** T = 10 iterations, N = 20 mutations, pool size m = 5, batch size B = 10, penalty weight λ = 3,000.
- **Programming languages other than Python:** not discussed.

## Approach

- **The loop (§4.1–4.2, Fig. 1, Alg. 1).** The mutator turns the initial rules into m variants that fill the pool. Each iteration allocates N mutations among the m candidates, the mutator produces N new candidates, the judge scores the candidates, and pruning keeps the top m. After T iterations the rules with the highest average score are returned. The authors use search because agent pipelines with multi-turn interactions and tool calls are "non-differentiable" (§4.1).
- **The score (§4.2, Eqs. 4–5).** Code length and inference cost are both approximated by the number of characters of the generated code, because the authors observe "a high correlation between code characters and token usage" (Fig. 2a). The score is minus that character count, minus λ times a correctness penalty: the share of tasks that the agent passes without rules but fails with the candidate rules.
- **Strategic mutation allocation (§4.3, Eqs. 6–7, Alg. 2).** From each candidate's score set the method computes a mean and a standard deviation. Following OCBA, each candidate other than the current best gets the weight (standard deviation ÷ gap between its mean and the best mean)²; the best candidate's weight is computed from its own standard deviation and the others' weights and standard deviations (Eq. 7). Weights are normalized and rounded so the mutations sum to N. So more mutations go to "candidates with higher performance variance or those whose mean performance is closer to the current best". App. B justifies this with OCBA's asymptotic conditions for maximizing PCS, which assume independent, normally distributed scores and a large number of mutations N.

## Results

As the authors report:

- **Headline (§1):** OpenAI SDK, gpt-5.3-codex, BCB: average code length cut "by over 60%" without losing pass rate.
- **Main tables (Tabs. 1–2):** each method is shown with "the backbone that achieved the highest pass rate across benchmarks" (captions). The authors report that RuleEvolve "consistently achieves the highest or equal Pass Rate (PR) across all benchmarks" (§5.2) and, "When achieving comparable PRs" to No rule or Manual rule, "significant improvements in code length and inference cost".
- **Against Prompt-Ops (§5.2):** Prompt-Ops "occasionally achieves lower code length and inference cost", but on OpenHands BCB it "suffers a substantial drop in PR to 0.43, whereas RuleEvolve reaches 0.52". Over the per-backbone tables (Tabs. 5–6), the authors report "superior or comparable pass rates" for RuleEvolve across all backbones and that it beats Prompt-Ops "across nearly all backbone–benchmark combinations".
- **Ten seeds (Tab. 3; gpt-4.1-mini, BCB):** PR 0.502 ± 0.026 against 0.502 ± 0.015 for No rule, with the fewest average code lines and characters "among all evaluated methods".
- **SWE-bench Lite (Tab. 4; gpt-4.1-mini, 100 tasks):** PR 0.340 against 0.330 (No rule), 0.190 (Public rule) and 0.080 (Prompt-Ops), which the authors take to "confirm that RuleEvolve can generalize to real-world repository-level scenarios" (§5.2).
- **Ablations (§5.3, Fig. 2):** over 20 iterations pass rate stays flat while lengths and tokens fall, mostly in the first 5 (Fig. 2a). At an identical pass rate for all three allocation strategies, the strategic one gives 22.6 code lines against 23.4 (even) and 23.9 (proportional) (Fig. 2b). More mutations N shorten code at a stable pass rate (Fig. 2c); growing the pool from m = 1 to 2 gives "a substantial reduction in code length and token usage" (Fig. 2d).
- **Pass@k (Fig. 3; gpt-4.1-mini):** the pass rate "scales positively with the number of samples k".
- **The evolved rule (App. C, Tab. 7):** removing categories of its sections (40 BCB tasks, gpt-4.1-mini), output-format and self-containment directives "dominate the rule's impact", and process and budget directives are "net negative".
- **Code quality (App. D, Tab. 8):** against No rule, lower total complexity and duplication, and a maintainability index (a composite score from size and complexity measures, graded in bands with A the best) lower than No rule's but still, in the authors' words, "a Grade A maintainability index".

## Limits the authors state

- "while RuleEvolve maintains or improves functional correctness in most scenarios, the objective of reducing code length may still lead to a slight decrease in the pass rate for certain complex tasks where excessive brevity could compromise logic" (App. A).
- The LLM-powered mutator and judge module introduce "inherent stochasticity and potential biases from the backbone models used during evolving" (App. A).
- "The remaining trade-off is in code density": complexity per source line rises and docstring coverage falls from 47% to 1%, "indicating that RuleEvolve removes documentation and defensive scaffolding rather than redundant logic" (App. D).
- On SWE-bench Lite "generation time increases, likely due to the increased reasoning overhead of repository-level tasks" (§5.2).
- Generation time shows "notable fluctuations between iterations", which the authors attribute "likely" to API latency and sampling randomness (§5.3).

## Open problems and building blocks

- **Open:** "A more comprehensive exploration of other dimensions, such as code maintainability or architectural complexity, remains for future work." (App. A). No other open problem is named.
- **Released:** Nothing stated.
- **To reuse it:** an LLM to act as mutator (§4.2); a coding agent and backbone model, with rules evolved per backbone (§5.1); training tasks with test cases to execute (§3.2, §5.1); the default settings above (§5.1). Each candidate "requires full agent execution and verification, leading to substantial latency and API token consumption" (§4.1).

## On this site

- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/harness-general">harness-general</a><a class="tag sub" href="#/tags/harness-promptopt">harness-promptopt</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/promptopt-context">promptopt-context</a><a class="tag sub" href="#/tags/promptopt-evolve">promptopt-evolve</a><a class="tag sub" href="#/tags/promptopt-general">promptopt-general</a></span>
