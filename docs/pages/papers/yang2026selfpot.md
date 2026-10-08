# How Much Can Language Models Gain from Test-Time Computation?

**How Much Can Language…** · preprint 2026

Read: [PDF](https://arxiv.org/pdf/2610.01110) · [arXiv](https://arxiv.org/abs/2610.01110)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- A benchmark and evaluation framework for test-time scaling across competition mathematics, AtCoder programming, AppWorld workflows and Terminal-Bench tasks, on a test set sealed before any test-time call (abstract; §2.4, Tab. 1). Each task is graded by a rule-based answer grader, hidden tests or the benchmark's own final-state evaluator (§2.5).
- Compares answering once (Direct) with parallel sampling plus a selection rule (vote, public examples, or a same-model judge) and with self-revision, at fixed multiples of the Direct budget, charging every call, selection and critique included, in dollars. Replays of the saved candidate pools then separate generating a correct candidate from submitting it (abstract; §2.2; §3.3).
- Low-cost models with extra inference against a frontier model answering once, on checked tasks (<a class="tag" href="#/tags/compact">compact</a>). The authors report that outside programming Opus answering once remains the most accurate tested configuration (§1; §3.4), and that the selection rule and failure handling can reverse the measured gain of the same candidates (abstract; §3.3).

## In plain words

Test-time scaling spends more computation per answer: drawing several answers and keeping one, or having the model critique and revise its answer. The authors say it is "widely proposed as a substitute for larger models", but that comparisons mostly test one domain at a time and rarely charge the selection step to the budget (abstract). They built SELF-POT, a benchmark and evaluation framework of 350 tasks in competition mathematics, competitive programming and agent tasks, sealed before any run. Five low-cost reasoning models answer once or spend up to two or four times one answer's budget, every call charged in dollars, against Claude Opus 5.5 answering once (abstract; §1). Replaying saved programming candidates, picking by the examples printed in the task raises correct submissions from 376 (the model judging its own candidates) to 453 of 500, at 12–49% lower API cost across models (abstract). Outside programming, Opus answering once stays the most accurate tested configuration (§1). The authors propose no new method (§1), and say no earlier study combines these domains with charged selection and a stronger-model comparison (§5).

## Background and terms

**Terms to know:** [test-time scaling](#/glossary/test-time-scaling) · [self-consistency (majority voting)](#/glossary/self-consistency-majority-voting) · [LLM-as-a-judge](#/glossary/llm-as-a-judge) · [self-correction](#/glossary/self-correction) · [Pareto front](#/glossary/pareto-front) · [sign test](#/glossary/sign-test) · [multiple testing](#/glossary/multiple-testing) · [bootstrap resampling](#/glossary/bootstrap-resampling)

**The paper's own terms:**
- **Direct**: answering once within one answer's allowance. On programming it may run its program on the public examples first; on agent tasks it is a whole multi-call episode (§2.2).
- **Parallel@2, Parallel@4, Revise@4**: "The suffix denotes a budget cap, not a sample count" (§2.2). Parallel@2 keeps one of two answers by a rule using no model tokens: majority answer (mathematics) or most public examples passed (programming). Parallel@4 draws three answers, then the same model reads them and names one (**joint selection**). Revise@4 runs one critique-and-revise round after Self-Refine (Madaan et al. [36]); a PASS verdict keeps the first answer (§2.2).
- **On agent tasks**, the parallel protocols draft plans and execute only the chosen one, once; Revise@4 adds a same-model review every two executor turns. No episode is reset (§2.2).
- **Public examples / hidden tests**: the sample cases in a programming task, visible to the model, against the tests used only for grading (Tab. 1; App. D).
- **Cell**: one protocol run on one task by one model (§2.1). **Panel**: the fixed set of evaluated low-cost models; a panel mean averages over them (Tab. 4).
- **Coverage and conversion**: coverage is the chance that at least one recorded candidate passes the hidden grader; conversion is the chance the submission is correct given that; accuracy is their product (Eq. 2, §2.3). A covered task is lost by **no choice** (no valid index) or **wrong choice** (an incorrect or empty candidate) (§2.3). In the glossary's terms, coverage of a pool of three is [pass@k](#/glossary/passk) with k = 3.
- **Replay rules** (§2.3; App. J.2): **J** the frozen judge; **J+F** (fallback) keeps the first nonempty candidate when judging gives no usable answer; **P3** picks by public examples; **vote@3** a majority vote over three mathematics answers; **G**, the **public-first gate**, consults the judge only on tied public scores.
- **Logical API cost**: each configuration is charged for its own calls at configured rates, even for reused stored responses; "not invoices"; DeepSeek at its peak rate, with a half-price scenario (§2.5). pp means percentage points.

**Builds on:**
- Snell et al. [47] ([compute-optimal test-time scaling](#/papers/snell2024scaling "Scaling LLM Test-Time Compute Optimally can be More Effective than Scaling Model Parameters (2024)")) and Wu et al. [53]: smaller against larger models of one family at matched FLOPs, mainly on mathematics (§1).
- Stroebl et al. [49] ([The Limits of Inference…](#/papers/stroebl2024resampling "The Limits of Inference Scaling Through Resampling (2024)")): weaker against stronger models on programming (§1).
- Brown et al. [5] ([Large Language Monkeys](#/papers/brown2024monkeys "Large Language Monkeys: Scaling Inference Compute with Repeated Sampling (2024)")): coverage keeps rising with more samples while voting and reward-model selection level off (§5).

## Problem and setting

Three questions (§1): under stated budget allowances, which tested configurations turn extra computation into accuracy, and where (RQ1); on static tasks, where opportunity is lost (generating, selecting or keeping a correct answer), and whether agent protocols complete (RQ2); whether a low-cost model with extra inference can match a stronger model answering once at no greater cost (RQ3).

- **Tasks** (Tab. 1, §2.4): 60 competition mathematics problems (APEX, Omni-MATH); 100 AtCoder programming problems (LiveCodeBench v6); 160 AppWorld workflows through app APIs; 30 Terminal-Bench 4.0 shell tasks. Agent actions persist.
- **Test set**: eligibility-checked, development tasks excluded, sealed before any test-time call (§2.4; App. B).
- **Models** (Tab. 2, §3.1): DeepSeek V4.1 Flash, Qwen3-Next-80B-A3B, GLM-5, GPT-OSS-120B and MiniMax M2.5; "Lower-priced" refers to "token rates, not to cost per solved task". Only Flash and Qwen3-Next run revision; the others' context windows are too small for a full-budget critique on top of an answer. One frozen model plays every role (§2).
- **Correctness** (§2.5; App. E): a rule-based grader (mathematics), hidden tests (programming), the benchmarks' final-state evaluators (agents). A missing submission is incorrect. CompassVerifier-3B, a small model grader, is only a second opinion.
- **Statistics**: each cell runs once; per-model sign tests are Holm-corrected across 44 comparisons; panel means get task-bootstrap intervals (§3.1).

## Approach

SELF-POT caps the output tokens of all calls in a cell at one, two or four times the Direct allowance (Eq. 1, §2.1) and charges every call, selection and critique included (§2.5). Two identities, "elementary accounting" (§2.3), split accuracy into coverage times conversion (Eq. 2) and the revision gain into wrong answers fixed minus right answers lost (Eq. 3).

## Results

- **RQ1** (§3.2; Tab. 3, Fig. 3, Tab. 4): "A larger allowance does not order the protocols by accuracy." In programming, Parallel@2 raises the panel mean by 6.2 pp with 31 paired wins and no losses, while Parallel@4 lowers it. In mathematics Parallel@4 raises most models, with a panel-mean 95% interval above zero, not adjusted for multiple comparisons, but no single model's gain survives Holm correction. No agent protocol raises the panel mean; periodic self-review lowers Flash on workflows, significant after correction (Tab. 9, App. J).
- **RQ2** (§3.3; Fig. 4): coverage does not guarantee a correct submission. Qwen3-Next loses covered mathematics tasks only to wrong choices; GLM-5 in programming loses most to no choice.
- **Programming replay** (§3.3; Fig. 5; Tab. 13, App. J.2): on 500 scheduled cells the frozen judge gets 376 correct, fallback 437, public-example selection 453; fallback alone turns the change against Direct from −8.6 pp to +3.6 pp, judge cost still charged. Public selection saves 12–49% of logical API cost across models and beats fallback with no losses on pools holding both correct and incorrect programs (Tab. 15); in these pools the public-first gate adds cost without gain over it (App. J.2).
- **Mathematics replay** (§3.3; Tab. 16): on 292 identical pools, judging with fallback gets 186 against 182 for vote@3, with "a paired interval spanning zero", while voting saves 12–21% of API cost.
- **Revision** (§3.3; Tab. 10): Flash's coding loss follows a truncated critique and an empty submission, so lower revision accuracy alone "does not establish that a correct answer was rewritten incorrectly".
- **Agents** (§1; App. J.1): stage failures (a plan or plan choice missing its required format) reach 117 of 160 workflows for GPT-OSS and 159 of 160 for MiniMax, so "these configurations primarily measure interface reliability".
- **RQ3** (§3.4; Fig. 6; App. H): Opus leads in mathematics, workflows and terminal tasks. In programming, Flash Direct "remains the coding frontier" (§1); GPT-OSS Parallel@2 beats Opus in the official grading image, which lacks a library most Opus failures import, so "GPT-OSS's advantage is runtime-dependent". In mathematics, Flash judging and vote@3 are dominated by Opus at peak rate but reach the frontier at half price.

## Limits the authors state

- Budgets "are maximum allowances, not matched realized costs"; "the configurations do not constitute a full accuracy–budget response curve" (§2.1). For Parallel@4 and Revise@4, "their accuracy difference does not isolate a mechanism at identical realized cost" (App. A).
- The Parallel@2 against Parallel@4 contrast "is also not a clean selector ablation, because that protocol uses two candidates rather than three" (App. J.1).
- "a contrast between domains does not isolate any one of these factors" (task type, difficulty, feedback, protocol) (§2.4).
- Coverage is "an offline ceiling for the recorded candidates rather than a deployable oracle"; replays "are not new equal-cost trials" (§2.3); the output-aware fallback "was specified after that inspection and is reported as post-hoc" (App. J.2).
- The mathematics replay "does not establish a broadly superior selector" (App. J.1); "neither grader establishes equivalence between the selectors" (§4).
- "The absence of repeated seeds prevents estimating within-task stochastic variability" (App. J); intervals "describe this panel, not unseen model families" (Tab. 4).
- Two-way voting keeps the first parsed answer, so its small mathematics change "does not measure the value of self-consistency at larger sample counts" (§3.2).
- "Neither scenario reconstructs the actual invoice, although most calls ran off-peak" (App. H); frontiers "are point estimates, not certified dominance relations" (Fig. 6), and the replay comparisons "omit local execution expense" (App. J.2).
- Agent outcomes "measure the model–protocol–interface combination and leave the quality of unexecuted plans unresolved" (§3.3); interfaces changed after sealing (App. H).
- The revision exclusion "does not imply that shorter or differently structured revision is impossible for the other models" (App. I). "A separately instructed longer-reasoning protocol was not run" (App. D).
- The gate result "is evidence about the tested selector, not about all possible judges or learned verifiers" (§4).
- Terminal "scores are not comparable to the public leaderboard" (App. F).

## Open problems and building blocks

  - The coding results motivate "making stage completion an explicit design objective" (§4).
  - "additional controlled executions would be required to separate plan quality from execution reliability" (§4); "agent interface validation and repeated episodes remain necessary" (Finding 3, §3.3).
  - Domain-specific methods such as moderated debate for mathematics or test-driven repair for code "were planned as a separate audit" (App. D); "other revision allocations remain possible" (App. D).
  - What test-time scaling evaluations should report, from the Direct operating point and coverage to each selection stage's outcome and termination status (§4).
- **Released:** Nothing stated.
- **To reuse it:** DeepSeek's API and Amazon Bedrock, a cloud model service (Tab. 2); 131,072 output tokens per static answer and 393,216 per agent episode, times the multiplier (Tab. 7, App. A); a pinned grading container, Harbor (the Terminal-Bench container runner) and an AppWorld server (App. E–F).

## On this site

- **Tags:** <span class="tags"><a class="tag" href="#/tags/compact">compact</a><a class="tag sub" href="#/tags/harness-general">harness-general</a><a class="tag sub" href="#/tags/judge-general">judge-general</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/scaling-general">scaling-general</a></span>
