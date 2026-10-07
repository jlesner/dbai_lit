# Can Language Models Falsify? Evaluating Algorithmic Reasoning with Counterexample Creation

**REFUTE ("Can Language Models Falsify?")** · preprint 2025

Read: [PDF](https://arxiv.org/pdf/2502.19414) · [arXiv](https://arxiv.org/abs/2502.19414)  
Code: [REFUTE](https://github.com/falsifiers/REFUTE)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- A benchmark of LLMs creating counterexamples for subtly incorrect algorithmic solutions, checked by running code (abstract).
- Falsification rather than solution generation (abstract).
- Our refutation framing beyond SQL (`reports/2026-10-01T2250_litsearch.md`).

## In plain words

Benchmarks usually ask a model to write a correct program; this paper asks the reverse: given a contest problem and a submitted program that looks right but is wrong, can the model produce an input on which it fails? The authors argue that such counterexamples are how claims get falsified in science, and that benchmarks rarely test this (abstract, §1). The benchmark, REFUTE, holds 324 wrong submissions from recent Codeforces contests. The model writes a program that prints an input; the input must obey the problem's rules, and the wrong submission and a known-correct solution are both run on it: differing outputs mean success (§3, §4). The best model, OpenAI's o3-mini (high), succeeds on under 9% of samples without the correct solution, even when it can run code, though its rating suggests it could solve about half of these problems (abstract). The authors call this "the first steps toward benchmarking" the ability (§6).

## Background and terms

**Terms to know:** [SAT and SMT solvers](#/glossary/sat-and-smt-solvers) (§2, §6) · [Elo rating](#/glossary/elo-rating) (here a rating gap becomes a chance of solving by the Codeforces formula, averaged over problems, §5.1). The other field terms are defined under Missing glossary terms, below.

**The paper's own terms:**
- **claim** and **counterexample**: a claim is a set of conditions on an input plus a proposition, true if every input meeting the conditions makes the proposition true; a counterexample meets the conditions but makes the proposition false (§3.1). For algorithms, the conditions are the problem's input format and constraints, and the proposition is that the given code solves the problem (§3.2).
- **inverse benchmark**: one that asks the model to falsify a wrong solution rather than produce a correct one (§3, Fig. 1).
- **sample**: a problem statement with one incorrect submission; the correct solution and an input-validation script are kept for evaluation (§4.1 "Final Dataset").
- **Solved%** (Tab. 1): the share of the benchmark's problems the authors estimate a model would solve, estimated from ratings (§5.1).
- **w/ Correct**: zero-shot prompting that also shows the correct solution, which the paper calls the oracle (§5.1).
- **validation failure**: the printed input breaks the problem's format or constraints (§5.1).
- **bait submission**: code with an inserted branch that gives a wrong output only when a specific unlikely constant appears in the input (§4.1).

**Missing glossary terms:**
- **Codeforces**: a programming-contest website; submissions are judged on test cases designed by the problem authors, and problems and contestants carry ratings (§4.1, §4.2).
- **hack**: a counterexample a person found for a submission after it had passed all of the problem authors' tests; hackers earn extra score (§4.1).
- **ReAct agent**: a loop in which the model interleaves reasoning with actions (here, running code) and reads their results ([ReAct](#/papers/yao2022react "ReAct: Synergizing Reasoning and Acting in Language Models (2023)") abstract; §5.1 here).
- **brute-force solution**: a slow program that tries all possibilities; correct on small inputs, too slow on large ones (App. A.1).

**Builds on:**
- LiveCodeBench (Jain et al., 2024; not listed here), a code-generation benchmark: its leaderboard picks the models (§5.1, Fig. 5), and REFUTE's updating follows its example (§4.2).
- ReAct ([ReAct](#/papers/yao2022react "ReAct: Synergizing Reasoning and Acting in Language Models (2023)")), the agent scaffold (§1).
- Gu et al. 2024 ("The Counterfeit Conundrum") and Olausson et al. ([Is Self-Repair a Silver…](#/papers/olausson2023selfrepair "Is Self-Repair a Silver Bullet for Code Generation? (2024)")): the authors say their results demonstrate these works' hypothesis that code self-repair is bottlenecked by failing to find one's own mistakes (§1).

## Problem and setting

- **Question:** "Can LMs create counterexamples for incorrect solutions to algorithmic problems?" (§1).
- **Problems:** Codeforces Division 1 and 2 contests (the site's harder and easier contest tiers), January 2024 to January 2025, minus problems with an interactive grader or several correct outputs per input, and problems rated below 1200. The correct solution is the official one the problem authors publish in an editorial, their write-up of the solutions (§4.1).
- **Submissions:** judged wrong answer (not over time or memory limits), ranked with hacked ones first, then by tests passed, plus a bonus for authors rated 2000 or more (§4.1).
- **Filters:** a sample is dropped if a random-input generator, written by Gemini 2.0 Flash Thinking from the statement alone and run for up to one minute, breaks the submission; an expert human removed bait submissions (§4.1).
- **Dataset:** 647 problems filtered to 324 samples (Fig. 2 left); 317 in C++ and 7 in Python (§4.1); 34 topic tags (§4.2). The authors call the samples "search and contamination free" because Codeforces does not reveal non-trivial failing tests (§1, §4.2).
- **Success:** the input passes the validation script and the incorrect submission's output differs from the correct solution's (§3.2, §4.2); the model's script must finish within 1 minute (§4.2); programs run on Windows with Codeforces-like C++ flags and 30 seconds per run (App. B.1).
- **Models:** reasoning models o3-mini (high), DeepSeek-R1 and Gemini 2.0 Flash Thinking, and chat models Claude 3.5 Sonnet and DeepSeek-V3, chosen from the LiveCodeBench leaderboard of February 2025 (§5.1, Fig. 5).

## Approach

- **Task:** given the statement, constraints, example input-output pairs and the incorrect code, the model returns brief reasoning and a program that prints a failing input (§5.1, App. C.1).
- **Prompting** (Tab. 1): zero-shot; few-shot, with three sample problems and expert rationales; w/ Correct (§5.1).
- **ReAct agent**, without and with a demonstration trajectory (App. C.3, C.4): up to ten code runs on inputs of its choice, outputs cut to 2000 characters, 30 seconds per run; an invalid submission gets feedback and up to five retries (§5.1).
- **Solved%:** each problem's solve chance comes from its rating and the model's rating, credited to the DeepSeek-R1 paper (§5.1).
- **RandSearch** (§5.2, App. A.1): the model writes a random-input generator and a brute-force solution; the harness generates inputs until the brute-force solution and the incorrect submission disagree, within a time limit, and evaluates that input. Only chat models get few-shot examples (§5.2).
- **RandSearch Oracle** (§5.2, App. A.2): the model gets the correct solution and writes only the generator, so inputs can be full size.

## Results

- **Falsifying lags solving:** o3-mini (high)'s best counterexample rate without the correct solution is 8.9% (few-shot), against an estimated Solved% of 48.7 (Tab. 1).
- **Correct solution shown:** o3-mini reaches 9.3% against 8.6% zero-shot (Tab. 1); knowing the correct solution "alone is insufficient even for the best current reasoning model" (§5.1).
- **Execution feedback:** models struggle to use it, "with only DeepSeek R1 exhibiting modest improvements" (§5.1), but it "greatly reduces" validation failures: R1 and V3 go from 45 and 36 zero-shot to none (§5.1). Few-shot prompting improves Gemini, while other models gain little or degrade (§5.1).
- **Search:** the authors report that reasoning models get worse with RandSearch and chat models gain marginally (§5.2). With the correct solution, DeepSeek-V3 reaches 15.1% against 4.0% with RandSearch (Tab. 2). o3-mini's RandSearch breaks 6% of submissions that its prompting and agent runs did not, against 3% new with the correct solution (§5.2). Of RandSearch's wrong counterexamples, 86% come from wrong brute-force code (§5.2).
- **Predictability:** averaged over strategies for R1 and o3-mini, success shows no clear trend with problem difficulty, tests passed or author expertise (Fig. 4), nor with lengths (App. B.2, Fig. 6): it "can be non-trivial to predict" (§5.3).
- **Broader claim:** verification "can sometimes be harder for models than solving the problem correctly", which the authors say limits self-improvement through the generator-verifier gap, the idea that a model can improve by checking its own outputs because checking is easier than generating (§1).

## Limits the authors state

- Only claims checkable by running code are covered: "many scientific hypotheses are not easily formalized in this way" (§6).
- w/ Correct and RandSearch Oracle simulate a hypothetical in which the model has the correct solution (§5.1, §5.2).
- In RandSearch, a wrong brute force or a generator of invalid inputs makes the found input fail evaluation, and inputs must be small enough for the brute force to finish (App. A.1).

## Open problems and building blocks

  - What makes counterexample creation hard is "an important direction for further investigation" (§5.3).
  - More counterexample benchmarks, e.g. research-level mathematics; methods that "integrate formal tools such as SMT solvers"; counterexamples to claims stated only in natural language (§6).
  - Inverse benchmarks beyond algorithms (Fig. 7, a mathematics example); code as a medium for hypothesis testing, data analysis and simulation (App. B.3).
  - Plans: automate bait detection with a language model given expert examples and a rubric (§4.1); "dynamically update" the benchmark with new contests (§4.2).
- **Released:** the title page links the REFUTE Bench dataset, a website and code; the Impact Statement says of REFUTE "we will release publically"; full prompts are "available in our code repository" (App. C). Samples carry metadata such as problem and author ratings (§4.2).
- **To reuse it:** problems with one correct output per input, an input validator and a correct reference solution (§3.2, §4.1), and a Codeforces-like build and run environment (App. B.1).
- **Beyond its domain:** code execution as a way to falsify "has broad applicability across diverse domains" (App. B.3).

## On this site

- **Discussed in:** [Benchmarks with checkable ground truth](#/challenges/checkable_benchmark_ground_truth)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/cex-general">cex-general</a><a class="tag sub" href="#/tags/cex-llm">cex-llm</a><a class="tag sub" href="#/tags/harness-general">harness-general</a><a class="tag sub" href="#/tags/llm-assist">llm-assist</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/pairs-code">pairs-code</a></span>
