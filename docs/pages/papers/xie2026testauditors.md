# Coding Agents as Test-Suite Auditors: Finding What Official Suites Miss While Approaching What They Catch

**Coding Agents as Test-Suite Auditors** · preprint 2026

Read: [PDF](https://arxiv.org/pdf/2608.01715) · [arXiv](https://arxiv.org/abs/2608.01715)  
Code: [test-suite-auditors](https://github.com/xieTwim/test-suite-auditors)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Off-the-shelf coding agents (Codex CLI, Claude Code, Antigravity, OpenCode, mini-SWE-agent) build adversarial test suites from a problem's statement and one reference solution, without seeing the official tests or the submissions audited (abstract; §3).
- A certification chain decides each finding without the official judge: expected outputs from a consensus of independent accepted solutions, brute-force solutions for disputes, and a per-problem input-legality validator, LLM-written for AtCoder and testlib from the CodeContests+ toolchain for Codeforces (abstract; §3; App. B). Applied to AtCoder's official suites (§4) and to post-cutoff Codeforces problems with no official suite, against five reproduced baselines (§5).
- Online-judge test suites as graders that accept wrong programs (<a class="tag" href="#/tags/labels">labels</a>), refuted by certified, legal inputs (<a class="tag" href="#/tags/cex">cex</a>); it extends [Who Judges the Judge](#/papers/liu2023onlinejudge "Who Judges the Judge: An Empirical Study on Online Judge Tests (2023)"), whose majority-vote findings it says were not certified, and compares itself with [TrickCatcher](#/papers/liu2024trickcatcher "LLM-Powered Test Case Generation for Detecting Bugs in Plausible Programs (2025)") and [UOJ-Bench ("Beyond Problem Solving")](#/papers/xu2026uojbench "Beyond Problem Solving: UOJ-Bench for Evaluating Code Generation, Hacking, and Repair in Competitive Programming (2026)") (§2). It reports one agent finding 589 verified accepted-but-buggy submissions among 20,375 audited AtCoder accepted submissions (abstract; §4).

## In plain words

Contest sites grade programs with hidden test suites, whose verdicts, the authors say, are treated as ground truth for evaluating and training code LLMs; earlier audits found them accepting buggy programs but "offer no practical remedy" (abstract). Off-the-shelf coding agents see only a problem's statement and one correct human solution and build adversarial tests. A failure counts only after checks independent of the official judge: independently written accepted solutions agree on the expected output, brute-force solutions settle disputes, and a per-problem validator confirms the input obeys the statement (abstract; §3). On the contest site AtCoder, one agent (Codex CLI on GPT-5.4) finds 589 verified accepted-but-buggy programs among 20,375 audited accepted ones; with at most 50 inputs per problem, each of five agents, scored separately, stays within 1.7 percentage points of the official suites on wrong-output and crash bugs those suites catch, though the official rate remains higher (abstract; §4). On recent Codeforces problems lacking official suites, the agent's tests lead five reproduced baselines at every tested input budget (abstract; §5). They present this as the remedy prior audits lacked (§1).

## Background and terms

**Terms to know:** [test oracle](#/glossary/test-oracle) · [differential testing](#/glossary/differential-testing) · [fuzzing](#/glossary/fuzzing) · [agent harness](#/glossary/agent-harness) · [agent skill](#/glossary/agent-skill) · [data contamination](#/glossary/data-contamination) · [bootstrap resampling](#/glossary/bootstrap-resampling)

**The paper's own terms:**
- **online judge, official suite**: a contest platform runs each submission on its hidden tests (the official suite) and marks one that passes accepted (§1).
- **accepted-but-buggy submission**: one the official suite accepted that gives a wrong output, or crashes, on a legal input under an audited expected output (§4; App. C). The **ledger** is the list of these certified findings.
- **kill, kill matrix**: a test input kills a submission when its output disagrees with the expected output (§3); on AtCoder a runtime error also kills (App. A). A kill matrix records which inputs of each method kill which submissions (§5).
- **logic bug, excl-TLE basis**: kills by wrong answer or runtime error; time-limit verdicts are kept out of every bug claim (App. A "Judging environment").
- **arm, engine**: an arm is any compared input-generation method (§5; App. B, Tab. B.2). The agent arms are engines, each a coding-agent CLI with a base model: codex (OpenAI Codex CLI, GPT-5.4), claude (Claude Code, Claude Opus 4.8), agy (Antigravity CLI, Gemini 3.1 Pro), opencode (OpenCode CLI, DeepSeek V4 Pro) and mini (mini-SWE-agent, DeepSeek V4 Pro) (§3).
- **consensus oracle, gold**: the expected output (the gold) is the value independent accepted human solutions agree on (§3, §6); with brute-force adjudication and a legality validator it forms the **certification chain** (§3, Fig. 1).
- **legality**: under the validator gate, "legality means validator-passing under the encoded statement constraints" (§3).
- **known-bug panel (REJ)**: officially rejected submissions, on which a suite's recovery of known bugs is measured (§4; App. A).
- **cov@k**: the expected share of the buggy pool killed by a random set of k of an arm's legal inputs, order ignored; an arm with fewer than k legal inputs contributes all of them (§5).

**Missing glossary terms:**
- **noninferiority test**: a one-sided test that a method is worse than a reference by no more than a chosen margin; here an engine passes when the lower end of its 95% interval on the per-problem recall difference stays above −0.02 (App. A "Per-engine known-bug coverage detail").
- **special judge (multi-answer problem)**: problems where more than one output can be correct, graded by a custom output checker; both are excluded (§4; App. A "Problem selection").

**Builds on:**
- Prior online-judge audits: Who-Judges-the-Judge [16] ([Who Judges the Judge](#/papers/liu2023onlinejudge "Who Judges the Judge: An Empirical Study on Online Judge Tests (2023)")), which uses random, differential and majority-vote testing "but does not certify its findings", and the TrickyBugs dataset [17] (§1, §2).
- Contrasted verdict-auditing work: TrickyBugs' LLM-powered follow-up [18] ([TrickCatcher](#/papers/liu2024trickcatcher "LLM-Powered Test Case Generation for Detecting Bugs in Plausible Programs (2025)")) and UOJ-Bench [27] ([UOJ-Bench ("Beyond Problem Solving")](#/papers/xu2026uojbench "Beyond Problem Solving: UOJ-Bench for Evaluating Code Generation, Hacking, and Repair in Competitive Programming (2026)"), attacks targeting one submission each), among others (§2).
- Reproduced baselines: the CodeContests dataset's mutation-based generator [14] ([AlphaCode](#/papers/li2022alphacode "Competition-Level Code Generation with AlphaCode (2022)")), CodeContests+ [26] (a generator–validator pipeline), and an EvalPlus-style generator [15] ([EvalPlus](#/papers/liu2023evalplus "Is Your Code Generated by ChatGPT Really Correct? Rigorous Evaluation of Large Language Models for Code Generation (2023)"); type-aware input mutation, App. B "Baseline configurations") (§5).
- The known-bug setting of TestCase-Eval (TCE) [29], which evaluates LLM-written tests (§2), for its saturation analysis (§6).

## Problem and setting

The question: can coding agents given only a statement and one reference solution expose bugs official suites miss, and supply suites where none exist, with each finding certified without the official judge (§1)?

- **AtCoder audit (§4; App. A):** 106 mid-difficulty AtCoder problems with human C++ submissions from CodeNet (a dataset of contest submissions); per problem, the first 200 accepted and 300 rejected compilable ones. The oracle is agreement of 8 accepted references, the first of them the one shown to the agent (§3). Validators are LLM-written from the statement alone and must accept every official input and reject the empty input. Agent and random suites are capped at 50 inputs (§4).
- **CF-fresh (§5; App. B):** 41 Codeforces problems from March–June 2026, "intended to postdate" the claude engine's declared training cutoff. Six arms: one agent (claude) and five baselines (sample tests, budget-matched random, the three in Builds on). The buggy pool is 63 LLM-written solutions that pass the public samples but fail on some arm's legal input, certified by a consensus of three accepted human solutions (at least two must run). Arms are scored on legal inputs only, under testlib (a C++ library for contest validators) gates from the CodeContests+ toolchain.
- **What "correct" means:** agreement with the consensus oracle on validator-legal inputs, scored first by exact comparison (§4 Setup), with floating-point false positives later removed by a tolerance filter (§4, Tab. 1); bugs are wrong answers or crashes, judged on one Linux host (App. A "Judging environment").

## Approach

- **Construction (§3; App. D):** engines get one task brief and each picks its strategy; the agent's auditing skill offers optional tools (candidate checks against the reference, generator sweeps, drafted wrong solutions).
- **Certification (§3, Fig. 1):** kills are re-verified deterministically; disputes go to brute-force solutions; an input counts only if the validator accepts it, and an AtCoder problem whose validator fails its sanity gate is scored unmeasured, not illegal. The known-bug panel applies no legality gate at scoring time (App. A "Input legality on the known-bug panel").
- **AtCoder funnel (§4, Tab. 1):** the codex arm's exclusive kills pass timeout, determinism, oracle-reversal (a larger accepted pool votes) and floating-point filters; independently written solvers then re-adjudicated every entry (App. A "Census re-adjudication").

## Results

- **AtCoder ledger (§4, Tab. 1):** it reports 589 verified accepted-but-buggy submissions (545 wrong answers, 44 crashes, across 74 of 106 problems); re-adjudication contradicted no oracle output.
- **Five engines (§4):** with the same gates, the deduplicated union is a floor (dropped candidates are not regenerated) of 906, including 317 not certified by codex; a human-adjudicated stratified sample of 203 findings had no overturns.
- **Known bugs (§4, Fig. 2; App. A, Tab. A.1):** agent coverage is 0.919–0.932 against 0.936 for the re-judged official suites; budget-matched random generation trails further. Only the two engines a pre-execution plan designated confirmatory (codex, claude), without formal preregistration, clear the noninferiority test; "the five-engine result is descriptive, not formal."
- **CF-fresh (§5, Fig. 3; App. B, Tab. B.3):** the agent leads every baseline at every budget from 1 to 60 inputs; at the 50-input design budget, coverage is 0.952 against 0.809 for CodeContests+, the strongest baseline. On this pool, cov@k "gives a relative ordering of the compared arms, not an absolute rate" (§5). The bootstrap interval of that difference excludes zero at 50 inputs but crosses zero at 20 (§5 "Budget-dependent separation").
- **Agent loop versus one call (§5; App. B, Tab. B.4):** on 19 problems at 50 inputs, mini reaches 0.903 against 0.665 for a single call of its model; a mixture of four single calls narrows the gap; its interval against mini crosses zero.
- **Artifact audits (§6):** every contested gold among the agent arm's CF-fresh inputs (baseline-arm inputs excluded) is resolved in the oracle's favour, "confined to that oracle and those problems"; on AtCoder, one reference keeps fewer certified kills, three keep all, and every certified killing input passes its validator.
- **Saturation (§6; App. B "TCE saturation sweep", Fig. B.1, Tab. B.6):** on 24 TCE problems, input-by-input coverage shows budget-matched random generation front-loads coverage and flattens, while the agent keeps adding coverage through the tail, also without the feedback loop; the authors read the volume as "consistent with diversity across the input sets, not one unusually strong probe."

## Limits the authors state

- "The 589 count remains an in-sample lower bound, not a platform rate"; the sample is 8.9% of these problems' accepted C++ submissions (§7).
- The chain assumes competitive-programming structure and "has yet to be extended to specification-only tasks or tasks without accepted solutions to seed the oracle" (§7).
- "Validator-passing does not establish semantic ground truth" (§7).
- "Budget matching equalized retained-input counts, not spend" (§7); the one-call control "also does not match inference spend" (§5).
- AtCoder problems predate the engines' cutoffs, so "statement memorization remains possible in Experiment 1"; agent inputs overlap official ones at a highest non-trivial rate of 5.5% (§7).
- The small-budget CF-fresh lead "is directional and under-powered"; at 50 inputs and for its four replicates, the mixture "weakens but does not exclude a sampling-diversity explanation" (§5).
- "The diversity evidence is associative, not causal; the TCE mechanism estimate does not transfer mechanically beyond the studied population"; the authors offer no mechanism-level account of the crossover difference (§6).
- The reproduced baselines "do not exactly match the original baseline descriptions" (App. B, Tab. B.2); the bug-class taxonomy "is indicative, not adjudicated" (App. C).

## Open problems and building blocks

- **Open:** "arm-independent pool construction remains open" for the CF-fresh buggy pool (§7).
- **Released:** the five-engine ledger, the CF-fresh kill matrix, per-problem validators and the judging harness (§1); App. B "Artifact availability" adds analysis code and an entry point that recomputes every cited number; raw submissions stay out. A companion skill is linked (title page).
- **To reuse it:** a statement, one reference solution and several accepted solutions for the oracle (§3); for regenerating AtCoder kill matrices, a Linux host with an unlimited stack (App. B "Artifact availability"); per-problem medians of minutes (§7; App. A "Cost").

## On this site

- **Tags:** <span class="tags"><a class="tag" href="#/tags/labels">labels</a><a class="tag sub" href="#/tags/cex-general">cex-general</a><a class="tag sub" href="#/tags/cex-llm">cex-llm</a><a class="tag sub" href="#/tags/harness-general">harness-general</a><a class="tag sub" href="#/tags/llm-assist">llm-assist</a><a class="tag sub" href="#/tags/llm-method">llm-method</a></span>
