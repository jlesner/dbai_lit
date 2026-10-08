# Beyond Problem Solving: UOJ-Bench for Evaluating Code Generation, Hacking, and Repair in Competitive Programming

**UOJ-Bench ("Beyond Problem Solving")** · ICML 2026 (PMLR 306, per the PDF's first-page footer)

Read: [PDF](https://arxiv.org/pdf/2606.12864) · [arXiv](https://arxiv.org/abs/2606.12864)  
Code: [UOJ-Bench](https://github.com/hehezhou/UOJ-Bench)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- A benchmark of three competitive-programming tasks built from real submissions to the Universal Online Judge (UOJ): code generation, code hacking (write an input that breaks a buggy solution) and code repair, all graded by UOJ's own judge through its API (abstract; §1; §3).
- "Easy" bugs are ones the standard tests catch, "Hard" ones only community hacks found; each hack is checked by the problem's input validator and reference solution (§1; §3.1–3.2). Pass@k and a ReAct agent with judge feedback study test-time scaling (§4.3), and a Zero-Day set of full-score submissions asks for bugs nobody has found (§5).
- Refutation scored by an independent judge, the task [REFUTE ("Can Language Models Falsify?")](#/papers/sinha2025refute "Can Language Models Falsify? Evaluating Algorithmic Reasoning with Counterexample Creation (2025)") also poses, with the reference solution as the oracle: the authors report that one-shot, even the strongest models fail to find errors in more than 50% of submissions UOJ users had shown incorrect (abstract); with test-time scaling, models find bugs in submissions that pass all existing tests (§5).

## In plain words

Competitive programmers submit solutions to an online judge, which runs them on fixed tests and returns a score. The authors argue that these tests "are insufficient to detect all incorrect solutions" and that verdicts give little guidance on wrong ones, and ask what LLMs can add for learners (§1). Their benchmark, from real submissions to the Universal Online Judge (UOJ), has three tasks: write a solution, write an input that breaks a buggy solution ("hacking"), and fix the bug with a small patch, all graded by UOJ's own judge (abstract). They report that "under one-shot evaluation, even the strongest models fail to identify errors in more than 50% of a set of submissions that have been found to be incorrect by UOJ users"; many attempts raise success "to above 90%", at a cost they say limits large-scale use (abstract). With many attempts, one open-source model found bugs in over 10% of a set of submissions that had passed every known test, sampled toward often-hacked problems (§1; §5). They frame it as "a complementary perspective" to problem-solving benchmarks (§1).

## Background and terms

**Terms to know:** [pass@k](#/glossary/passk) · [test-time scaling](#/glossary/test-time-scaling) · [automated program repair](#/glossary/automated-program-repair) · [data contamination](#/glossary/data-contamination) · [test oracle](#/glossary/test-oracle)

**The paper's own terms:**
- **Online judge (OJ)**: runs submitted code on fixed tests and returns a score (§1); verdicts include Wrong Answer (WA), Time Limit Exceeded (TLE), Runtime Error (RE) and Memory Limit Exceeded (MLE) (Fig. 1).
- **Tests and Extra Tests**: a problem's standard tests, and those added from successful hacks (§3.1).
- **Hack**: "an input file that contains a targeted counter-example designed to break the code" (§3.1). UOJ checks it with the problem's input validator (which checks format and constraints) and compares the target's output with the reference solution's. The authors call each hack "fully verifiable" because every hackable problem is "equipped with a correct reference solution and an input validator" (§3.1); in the glossary's terms the reference solution is the test oracle (our bridge).
- **Overt and covert errors**: errors the standard tests can expose, and errors they cannot (§1).
- **Easy and Hard, two senses**: (1) the levels of the hacking and repair tasks, Easy for overt errors, Hard for covert errors found by community hacks (§1; §3.2); (2) problem difficulty, one of Easy, Medium, Hard and Ultrahard (§3.4; App. B.4).
- **Non-trivial grading**: support for custom checkers, programs that accept any valid output when a problem has several (§3.1).
- **Zero-Day Hacking**: hacking full-score submissions with no known failing test, by analogy with "zero-day" security vulnerabilities; its set, Zero-Day-Hacking-5K, holds 5,060 submissions (§1; §5).

**Missing glossary terms:**
- **ReAct**: an agent pattern in which an LLM alternates reasoning with actions and reads each result before its next step ([ReAct](#/papers/yao2022react "ReAct: Synergizing Reasoning and Acting in Language Models (2023)")); the paper uses "a ReAct framework" without a citation (§4.3).
- **Levenshtein edit distance**: the least number of single-character insertions, deletions and substitutions that turn one text into another (general definition; undefined in the paper, §3.2).

**Builds on:**
- **REFUTE** (Sinha et al., 2025; [REFUTE ("Can Language Models Falsify?")](#/papers/sinha2025refute "Can Language Models Falsify? Evaluating Algorithmic Reasoning with Counterexample Creation (2025)")), a benchmark of LLMs writing counterexamples to wrong competitive-programming solutions; the authors say it "focuses primarily on overt errors" (§2; Tab. 1).
- **Benchmarks mainly of code generation**: LiveCodeBench, LiveCodeBench Pro, CodeELO and ELABORATION (Tab. 1); the authors say that among existing benchmarks only CodeElo also judges through a platform's native infrastructure (Codeforces, a contest platform) (§2).
- **Program-repair benchmarks**: SWE-bench (repository issues); and RunBugRun and RealHumanEval, on human-written code, which the authors say "generally focus on elementary-level problems" (§2).

## Problem and setting

- **The question:** "to what extent can current LLMs provide additional value beyond the existing software infrastructure in competitive programming?" (§1)
- **Tasks** (§3): Task 1, write a C++20 program (App. A.1); Task 2, write a Python program that prints an input on which a buggy solution fails (App. A.2; §4.2); Task 3, produce "a minimal patch" so the code passes all tests (§1; App. A.3).
- **Success** (§4.2): generation and repair must pass all Tests and Extra Tests through UOJ's internal API, and a repair patch must "modify no more than 10% of the original code"; a hack must trigger a failure in the target, judged by UOJ. Its input must pass the validator, and the reference solution's output counts as expected (§3.1).
- **Data** (§3.2; cutoff September 15, 2025): Hard hacking uses filtered community hacks, at most ten per problem (App. B.1). Hard repair pairs a hacked submission with the same user's later full-score one, with similarity (one minus Levenshtein distance over the longer length) at least 0.95, filtered with an LLM's help (App. B.5). Easy pairs come from submissions that scored at least 60 but not full marks. An LLM translated statements from Chinese to English. Sizes: 672 problems; 479 and 1,046 hacking instances (Easy, Hard); 500 and 216 repair instances.
- **Scope:** mostly C++ submissions (§3.3); problems heavily reliant on randomized algorithms are excluded from the Hard hacking set, from which Hard repair is built (App. B.1; §3.2).
- **Models** (§4.1): Gemini-3-pro-preview, Deepseek-v3.2, Kimi-k2-thinking, GPT-5, GPT-OSS-120B, Qwen3-Coder and Claude-Opus-4.5, proprietary and open-source (§1); the tables also list GPT-5-high and, in the appendix, GPT-5.2-high (Tabs. 3, 10). Response length is "the recommended upper bound (at least 64k tokens)" (§4.1); the metric is Pass@1 (§4.2).

## Approach

- **Native grading** through UOJ's internal API keeps problems with custom checkers and strict time limits, giving results "with no gap to the real-world testing environment", the authors say (§1).
- **Lenient patching** tolerates missing line numbers, miscounted line counts in diff headers and inexact context (App. B.6).
- **Test-time scaling** (§4.3): Pass@k on random subsets of 100 Hard hacking and 50 Hard repair instances, for GPT-OSS-120B (up to 20,000 samples) and Gemini-3-pro-preview (up to 100) (Fig. 2); costs from token counts and OpenRouter prices, a service reselling many models' APIs (App. B.2).
- **Agent loop** (§4.3; App. A.4): a failed hack returns the error log or the target's actual output; a failed repair returns the patch error or the judge's verdict and failed test. Compared with sampling for GPT-OSS-120B over 10 turns (Fig. 6).
- **Zero-Day** (§5): per problem, full-score submissions sampled at 5× its hacks in the Hard set, re-judged to keep those still at full score; GPT-OSS-120B, Gemini-3-pro-preview and GPT-5 try to hack them. If the reference solution fails a new hack, administrators step in; if the hack breaks only a few submissions and the reference passes, the system validates it as exposing "a true covert bug" (App. B.7).

## Results

- **Direct evaluation** (§4.2; Tab. 3): models do "noticeably better" on overt than covert errors and fail on over half of the Hard hacking and repair instances; Gemini-3-pro-preview leads every column.
- **Generation** (§4.2; Tab. 2): success drops with difficulty; even Gemini-3-pro-preview "struggles with the most complex problems".
- **Test-time scaling** (§4.3; Fig. 2): Gemini-3-pro-preview hacked 93 of 100 samples and repaired 41 of 50. The authors call GPT-OSS-120B the most cost-effective, beating Gemini 3 Pro Preview "by a significant margin under the same cost" (§1). For UOJ's roughly 100,000 submissions a year, LLM checking would cost "on the order of $100,000" a year, against under $500 for CPU judging (§4.3).
- **Agent against sampling** (§4.3; Fig. 6): for hacking the agent "closely mirrors" sampling; for repair, iterative refinement "significantly outperforms direct sampling".
- **Zero-Day** (§5; Figs. 3, 5): GPT-OSS-120B under test-time scaling (§1) "is able to uncover errors in over 10% of all submissions", and in "over 5% of full-score submissions across around 30 problems"; rates vary widely by problem (Fig. 5).
- **Generation against debugging** (App. C.2–C.3): models hack and repair some submissions for problems they cannot solve; hacking and repair success overlap only partly; model rankings barely change across tasks (App. C.1).
- **Error and problem types** (App. C.9; Tabs. 10–11): TLE bugs are "significantly more difficult to both hack and repair" than RE or WA; in hacking, models "typically perform better on Standard problems" than custom-checker ones, while grading type has "little impact" on repair.
- **Design checks:** patches beat full rewrites by far for both models tested (App. C.6); a stricter similarity threshold gave a similar score (App. C.5); prompt language matters little (App. C.7).
- **Contamination** (§4.2; App. C.4, Fig. 7): on Hard problems by release year, generation declines on recent ones, "suggesting some reliance on memorized solutions", while hacking and repair "remain stable over time".
- **Deployment:** in "a preliminary real-world validation", some students patched code after receiving LLM-made hacks on live UOJ (App. C.10).

## Limits the authors state

- "the substantial computational costs incurred from model inference limit its practicality for large-scale deployment" (abstract); LLM judging at scale is "economically unsustainable" (§4.3).
- Failed hacks "typically involve subtle logic errors requiring highly specific edge cases, or target solutions using randomized heuristics" (§4.3); App. D.1 shows "the limitation of brute-force test-time scaling when faced with deeply buried, structure-dependent vulnerabilities".
- Generation success on older Hard problems is "partially attributable to memorization of canonical solutions" (App. C.4).
- The Zero-Day set is biased toward problems with more past hacks; under uniform sampling the rate is "slightly lower" (App. C.11).
- Hacking is enabled only for some problems, "typically excluding those with purely randomized inputs or prohibitive input validation costs" (§3.1).
- Instance counts "are not always directly comparable across benchmarks" (App. B.3).
- For weaker models such as GPT-OSS-120B, solving the problem barely helps repair: they "may lack the precise code-editing instructions required to perform a valid fix" (App. C.2).

## Open problems and building blocks

- **Open:** "a key future direction involves a small-scale deployment of our pipeline directly on online judge systems" (§6); "current LLMs have ample room for improvement in identifying and fixing errors for educational purposes" (§1); "We will include this uniform baseline in the final version" (App. C.11).
- **Released:** "UOJ-Bench is publicly available" (abstract); the authors "are willing to provide access to UOJ's internal evaluation API to researchers interested in testing their own models under the same conditions" (Impact Statement).
- **To reuse it:** UOJ's internal API for grading (§4.2), offered on request (Impact Statement); token use per task and model (App. B.2, Tab. 4); prompts (App. A); the patch pipeline (App. B.6).

## On this site

- **Tags:** <span class="tags"><a class="tag" href="#/tags/compact">compact</a><a class="tag" href="#/tags/labels">labels</a><a class="tag sub" href="#/tags/cex-general">cex-general</a><a class="tag sub" href="#/tags/cex-llm">cex-llm</a><a class="tag sub" href="#/tags/harness-general">harness-general</a><a class="tag sub" href="#/tags/llm-assist">llm-assist</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/scaling-general">scaling-general</a></span>
