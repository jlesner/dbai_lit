# Is Self-Repair a Silver Bullet for Code Generation?

**Is Self-Repair a Silver…** · ICLR 2024

Read: [PDF](https://arxiv.org/pdf/2306.09896) · [arXiv](https://arxiv.org/abs/2306.09896)  
Code: [self-repair](https://github.com/theoxo/self-repair)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Studies self-repair (the model debugs and repairs its own code from test feedback) with Code Llama, GPT-3.5 and GPT-4 on HumanEval and APPS (abstract; §3.1).
- Accounts for repair's sampling cost, and swaps in a stronger model's or humans' feedback (abstract).
- It reports gains that are often modest, and sometimes absent, once cost is counted, and hypothesizes that the model's feedback on its own code is the bottleneck (abstract): the hypothesis [REFUTE ("Can Language Models Falsify?")](#/papers/sinha2025refute "Can Language Models Falsify? Evaluating Algorithmic Reasoning with Counterexample Creation (2025)") cites (§1).

## In plain words

When a language model writes a program that fails its unit tests, it can be shown the error, asked to explain what went wrong, and asked to fix the code. This is self-repair. The authors say earlier studies of it were "limited in scope", and that the fair test is whether the same budget spent on fresh, independent samples would have done better (abstract; §1). They measure this for Code Llama, GPT-3.5 and GPT-4 on two sets of Python programming tasks, HumanEval and APPS. They also swap in feedback from a stronger model or from people.

They report that once cost is counted, gains are "often modest, vary a lot between subsets of the data, and are sometimes not present at all" (abstract). With a stronger model's feedback, gains are "substantially larger" (abstract). Human feedback raised the share of passing GPT-4 repairs from 33.3% to 52.6% on a small set of APPS programs (§1). The paper presents itself as an evaluation study, and hypothesizes that the model's ability to give feedback on its own code is the bottleneck (abstract).

## Background and terms

**Terms to know:** [pass@k](#/glossary/passk), [bootstrap resampling](#/glossary/bootstrap-resampling) (used differently here, see below), [self-repair](#/glossary/self-correction).

**The paper's own terms:**
- **programming and feedback model**: the model that writes and repairs code, and the one that explains why a program failed, from the task, the program and its error message; in true self-repair they are the same model (§3.1, §4.1).
- **n_p, n_f, n_r, n_fr**: the numbers of initial programs, of feedback strings per failing program, of repairs per feedback string, and, when one model writes feedback and repair in a single completion ("jointly sampling"), of feedback-repair pairs per failing program (§3.1).
- **repair tree**: the task, branching into initial programs, then feedback, then repairs (§3.1, Fig. 2).
- **pass@k for self-repair**: in the main body, a whole repair tree counts as one sample, compared with a baseline that draws as many programs independently, without repair (§3.2), which §4 calls "i.i.d. sampling" (independent, identically distributed). The heatmaps show the **normalized mean pass rate**, self-repair's pass rate divided by the baseline's at the same budget; above 1, self-repair wins (§4.1).
- **bootstrapped estimates** (this paper's use, unlike the glossary's): one large repair tree per task, from which the sub-trees for each setting are drawn with replacement and averaged (§3.2).
- **pass@t**: pass rate against the mean number of program and feedback tokens sampled; batched (all initial programs, then all repairs at once) or sequential (a depth-first search that stops at the first passing program) (App. A).

**Builds on:**
- Earlier self-repair work: Gupta et al. 2020, Le et al. 2022 (CodeRL), Chen et al. 2023 ([Self-Debugging](#/papers/chen2023selfdebug "Teaching Large Language Models to Self-Debug (2023)")) and Zhang et al. 2023 (Self-Edit) (§1). §2 says Chen et al. "assess Codex's ability to self-repair across a variety of tasks" in a framework that "closely resembles" this one, and differ in models and research goal.
- Self-Edit, which repairs without natural-language feedback and "does not consider the cost associated with feedback and repair" (§2).
- pass@k, from Kulal et al. 2019 and Chen et al. 2021 (Codex) (§3.2); the benchmarks HumanEval (Chen et al. 2021) and APPS (Hendrycks et al. 2021) (§4).

## Problem and setting

- **Questions** (§4): is self-repair better than i.i.d. sampling, and under which settings; does a stronger feedback model help; does human feedback "unlock better repair performance even for the strongest model".
- **Tasks:** self-contained Python tasks with executable unit tests (§5): HumanEval, and 300 randomly chosen APPS test tasks in proportion to APPS's difficulty levels, 60 introductory, 180 interview, 60 competition (§4, App. H). A program is correct when it passes all tests; the authors assume access to the full test set, with no split into public filtering tests and private grading tests (§2, §3.1).
- **Models:** CodeLlama-13b-instruct, with public weights, runnable "locally on consumer-level hardware", and the frozen endpoints gpt-3.5-turbo-0301 and gpt-4-0314 (§4). Main body: GPT-3.5 and Code Llama on HumanEval, GPT-4 and GPT-3.5 on APPS; the other two pairs are in App. B (§4.1).
- **Sampling:** one-shot prompts (§4), zero-shot initial programs on HumanEval (App. G.2), temperature 0.8 for all models "based on preliminary experiments" (§4).
- **Estimation:** per task, one frozen tree with 50 initial programs and 25 feedback strings per failing program (10 in §4.2), from which 1,000 sub-trees are drawn per setting; at most 25 initial programs for self-repair and 50 samples for the baseline (§3.2).

## Approach

- **Four stages** (§3.1, Fig. 1): sample programs; run them on the tests, stopping if any passes; ask the feedback model to explain each failure; sample repairs from each explanation. One model writes and repairs code, "since these are fundamentally similar tasks"; a separate feedback step lets the authors "ablate this component" (§3.1).
- **Cost accounting:** each tree gets a no-repair baseline with as many programs, which the authors believe makes the findings "most relevant to practitioners" using batched sampling (§3.2). App. A repeats the experiments with pass@t.
- **Self-repair alone** (§4.1): 1, 2, 5, 10 or 25 initial programs against 1, 3, 5 or 10 feedback-repair pairs each; then one pair each, with 1 to 25 initial programs (Fig. 5).
- **Boosted feedback** (§4.2): a stronger model writes the feedback. Code Llama with GPT-3.5 or GPT-4 feedback on HumanEval; Code Llama with GPT-3.5 and GPT-3.5 with GPT-4 on APPS.
- **Human feedback** (§4.3, App. D): 16 participants (15 graduate students, 1 professional engineer) explain 40 failing GPT-4 programs from 20 APPS tasks skewed towards easier ones (14 introductory, 3 interview, 3 competition); each program goes to two participants, shown with its error message and two GPT-4 feedback strings "To reduce the cognitive load" (App. D). GPT-4 samples 25 repairs per program and feedback, human or its own (§4.3). All feedback is also hand-labelled: obviously inaccurate or not, size of suggested change, code blocks, uncertainty (§4.3).

## Results

The authors' reports, under the pass@k accounting unless noted.
- **Self-repair alone (§4.1, Figs. 3–4).** On APPS, GPT-3.5 shows "marginal gains" only at the most initial programs; GPT-4 beats the baseline "by up to 8%". Gains are larger on harder problems: up to 34% over the baseline for GPT-3.5 on competition level (App. C figures). On HumanEval, Code Llama gains up to 10%; GPT-3.5's gains are "limited as it approaches the ceiling". Self-repair "is not always the best strategy" at the same budget, "especially for smaller budgets", and "it is hard to predict" when it helps.
- **Settings (§4.1).** At fixed feedback-repairs, more initial programs "consistently leads to relative performance gains for all models"; more feedback-repairs gives "marginal gains at higher budgets and oftentimes even decreasing performance at lower budgets". For GPT-4 on APPS, 10 programs with one repair each reach 1.05× the baseline at equal budget, 2 with 10 each 0.97× (§1). The authors take this to suggest the diversity of initial programs matters most.
- **One repair each (Fig. 5).** On APPS only GPT-4 "significantly benefits"; everywhere, gains at small budgets are "very marginal or non-existant" (§4.1).
- **Boosted feedback (§4.2, Fig. 5).** On APPS both weaker models beat their baselines and their own self-repair; on HumanEval Code Llama's gain grows with the feedback model's strength; §1 says the boosted setups win "at all budgets".
- **Human feedback (§4.3, Tab. 1, App. E)**: the participants' feedback raises the share of passing repairs from GPT-4's 33.3% to 52.6%, 1.58×, more so on harder tasks. GPT-4's feedback is labelled inaccurate more often (32/80 against 7/80) and never expresses uncertainty; almost no human feedback contains code, which the authors take to suggest the gain is not the model copying code.
- **pass@t (App. A).** Batched: "broadly" the same trends; sequential: self-repair "appears to be somewhat less beneficial; especially when the baseline pass rate is already high" (App. A.2).
- **Difficulty (App. C).** GPT-3.5 and GPT-4 "appear to benefit more from self-repair the harder the problem is", Code Llama less. From GPT-3.5 on APPS-introductory against HumanEval, the authors say the link to baseline performance "appears to not be so clear cut".

## Limits the authors state

- Sub-sampling one large tree per task "risks introducing statistical artefacts"; they kept settings "far below" the tree's sizes and note a "very small" standard deviation (§5).
- Self-contained tasks with unit tests are "quite different from real-world software development tasks", where specifications are often incomplete and tests unlikely to exist for each snippet (§5).
- The human study "did not track how much time the participants took", so only feedback quality is evaluated (§5); it doesn't compare a human in the loop with self-repair, since a human-in-the-loop approach "imposes more cognitive burden, which we do not study" (§4.3). The abstract calls it "small-scale".
- pass@k ignores feedback tokens "and so risks overemphasizing the benefits of self-repair" (App. A).
- On Tab. 2: "it is important not to place too much weight on the specific numbers" (App. C).

## Open problems and building blocks

  - Why gains "do not appear to trend perfectly with baseline performance" is left to future work; the conjecture: feedback and repair success against generation success, ambiguous specifications, and how informative the tests are (App. C).
  - The named bottleneck: the model's ability to give feedback on its own code (abstract, a hypothesis); improving it, "e.g. through finetuning on code explanation data", "can boost the performance of self-repair" (App. C).
  - Self-repair in real software development, e.g. resolving ambiguous specifications or synthesizing unit tests; and when and how humans should intervene (§5).
- **Released:** "Code and data available" (title-page footnote, PDF p. 1); prompts in App. G; the APPS task list in App. H, "to aid reproducibility".
- **To reuse it:** executable unit tests for the whole task (§3.1); a code model and optionally a stronger feedback model (§4); the prompts of App. G; one large tree per task for the estimates (§3.2).

## On this site

- **Discussed in:** [Bringing compact models to frontier accuracy](#/challenges/compact_model_accuracy) · [Whole-job reliability of multi-step LLM work](#/challenges/whole_job_reliability)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/harness-general">harness-general</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/scaling-general">scaling-general</a></span>
