# Who Judges the Judge: An Empirical Study on Online Judge Tests

**Who Judges the Judge** · ISSTA 2023

Read: [PDF](https://dl.acm.org/doi/pdf/10.1145/3597926.3598060) · [DOI](https://doi.org/10.1145/3597926.3598060)  
Code: [TrickyBugs](https://zenodo.org/records/7977256)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Audits AtCoder's hidden test suites on 939 problems and 541,552 accepted Python, Java and C++ solutions (from CodeContests): their line and branch coverage and mutation scores, and whether accepted solutions are still wrong (abstract; §3.1–3.2).
- Finds wrong accepted solutions ("false positives") by running 100 random inputs per problem, sampled within the stated input constraints, on all accepted solutions of the problem and flagging outputs that differ from the majority; multi-answer problems are left out (§3.5).
- Test suites as graders that accept wrong programs (<a class="tag" href="#/tags/labels">labels</a>), with refuting inputs as evidence (<a class="tag" href="#/tags/cex">cex</a>). The authors report false positives in 387 problems (Tab. 5), most of them with full line coverage (§4.3); the oracle is the majority output, not a specification (§5.2).

## In plain words

Online judges grade a submitted program by running it on hidden tests; a program that passes them all is accepted as correct. The authors say these platforms are a "critical gatekeeper" that partly decides who becomes a software engineer, and that their problems and solutions are training data for code-writing LLMs, so accepted wrong solutions matter (§1, PDF pp. 1–2). They study 939 problems from the AtCoder platform with 541,552 accepted Python, Java and C++ solutions (§1, PDF p. 2; §3.2, PDF p. 3). They measure how much of each solution the hidden tests run and how many small planted bugs they catch, and they hunt for accepted solutions that are wrong: 100 random extra inputs per problem, flagging any solution whose output differs from the majority's (§3.5, PDF p. 4). They report 3,440 such solutions, in 43.4% of the problems (Tab. 5, PDF p. 8). Yet the tests ran every line of 88.7% of those wrong solutions (§1, PDF p. 2). They present it as an empirical study that "took the first step" (§7, PDF p. 11).

## Background and terms

**Terms to know:** [test oracle](#/glossary/test-oracle) · [differential testing](#/glossary/differential-testing) · [mutation testing](#/glossary/mutation-testing) · [branch and path coverage](#/glossary/branch-and-path-coverage) · [Spearman's rank correlation](#/glossary/spearmans-rank-correlation)

**The paper's own terms:**
- **OJ problem**: a problem statement (task, input and output formats, input constraints, often examples) plus a predefined test suite users can't see; a solution is accepted only if it is correct on all the tests (§2.1, PDF pp. 2–3).
- **False positive solution**: "If the test suite judges a buggy solution as correct, we call the solution a false positive solution" (§2.1, PDF p. 3). In RQ2, buggy means its output on a generated input differs from the majority of accepted solutions (§3.5.2, PDF p. 4).
- **Original and covered mutation score**: the share of mutants killed, over all mutants or only those on lines the tests execute (§2.2, PDF p. 3).
- **Constraint-equivalent mutant**: one that differs from the original only on inputs that break the problem's input constraints; "universally-equivalent" ones never differ (§4.1.2, PDF p. 7).
- **Majority output ratio**: the share of a problem's solutions giving the most common output on one input; per problem, the smallest over the inputs on which outputs differ (§4.2, PDF p. 9).
- **Template Code, Debugging Code, Missing Branch** (§4.1.1, PDF p. 5): unused pre-written code some users paste into all their solutions, leftover debugging code, and an untested branch that affects behaviour.

**Missing glossary terms:**
- **Online judge (OJ)**: a platform that provides coding problems and automatically judges submitted solutions with a predefined test suite (§2.1, PDF p. 2).
- **Line coverage**: "the percentage of executed lines of the source code against the total lines of code when running the test suite" (§2.2, PDF p. 3).

**Builds on:**
- Forišek et al. [20], who noted that "software testing might prove to be unreliable for code contests" such as the ICPC and IOI programming competitions (§1, PDF p. 2).
- Li et al.'s code-generation system AlphaCode [35] ([AlphaCode](#/papers/li2022alphacode "Competition-Level Code Generation with AlphaCode (2022)")): its CodeContests dataset supplies the problems and solutions (§3.2, PDF p. 3), and the authors say AlphaCode "also uses this method" to find its own false positive solutions (§3.5, PDF p. 4).
- Earlier studies of how these metrics correlate, most on Java programs by the authors' account: Inozemtseva and Holmes [28], Zhang et al. [73], Zhang and Mesbah [75] (§4.1.3, PDF pp. 7–8).

## Problem and setting

- **Questions (§3.1, PDF p. 3).** RQ1: what coverage and mutation score OJ test suites reach, why code stays uncovered and mutants survive, and how the metrics correlate with problem features. RQ2: are accepted solutions buggy? RQ3: would the metrics flag them?
- **Gap they name:** "There is no previous work that seeks to systematically understand and assess OJ test effectiveness" (§1, PDF p. 2).
- **Data (§3.2, PDF p. 3).** AtCoder, which the authors say "is the only popular OJ platform that makes its full set of predefined tests available to download"; problems and de-duplicated accepted solutions from CodeContests; problems published from 2016 to 2021 (§5.2, PDF p. 10). Difficulty comes from a third-party website.
- **Which problems each question uses.** AtCoder lacks full test suites for 88 outdated problems, so RQ1 and RQ3 use the other 851 (§3.2, PDF p. 3). RQ2 uses "the whole set of problems" (§3.2, PDF p. 3) minus 48 multi-answer problems removed by hand, i.e. 891 (§3.5.2, PDF p. 4).
- **Inputs** stay within the stated input constraints, the only inputs OJ programs must handle (§4.1.2, PDF p. 7; §4.2, PDF p. 8).

## Approach

- **Coverage (§3.3, PDF p. 4).** Line and branch coverage, with Coverage.py (Python), clang's source-based coverage (C++) and JaCoCo (Java). The first two authors classify sampled uncovered code by hand.
- **Mutation score (§3.4, PDF p. 4).** The tools mutmut (Python), Mull (C++) and PITest (Java) at common settings; 4,703,239 mutants in all (§1, PDF p. 2). Equivalence is checked by hand for Python only, since the Java and C++ tools "do not produce physical mutants": 381 sampled from 74,447 survived Python mutants.
- **Finding wrong accepted solutions (§3.5, PDF p. 4; Fig. 2)**. Numbers, and the elements of strings and arrays, are sampled uniformly within the constraints; graphs come from the Cyaron generator. Every accepted solution runs on every input, and "The solutions whose outputs are different from the majority solutions are considered false positive solutions." Checks: counts against the number of inputs (Fig. 8, PDF p. 8); a hand check that the majority is right where the majority output ratio is below 0.5 (§4.2, PDF p. 9); a hand check that the inputs are legal for all problems with false positives (§5.2, PDF p. 10).
- **RQ3 (§4.3, PDF p. 9).** Count false positives with full coverage or mutation score, to see "how many bugs would be ignored if developers choose to trust the assessment results".
- **Also:** rank correlations (§4.1.3, PDF p. 7); a hand classification of 358 Python false positives from 50 random problems (§5.1, PDF p. 10).

## Results

- **RQ1 (Tab. 2, PDF p. 5; Tab. 4, PDF p. 6; answer box, PDF p. 8)**. The authors report 91.5% of solutions with full line coverage, 85.8% with full branch coverage and 42.8% with a full mutation score; Java has the lowest coverage. Template Code is the main cause of uncovered code (Tab. 3, PDF p. 6).
- **Survived mutants (Fig. 6, PDF p. 7).** They classify 95.3% of the sampled survived Python mutants as equivalent, most of them constraint-equivalent.
- **Correlations (§4.1.3, PDF pp. 7–8; Fig. 7).** The metrics are "strongly, or very strongly, correlated with each other for Java solutions" but weakly for Python and C++; the number of tests correlates negatively with coverage and mutation score, which they call "completely opposite to previous findings".
- **RQ2 (Tab. 5, PDF p. 8)**. 3,440 false positive solutions in 387 problems, given as 43.4% of the problems, a ratio "out of our expectations". The count of problems with false positives plateaus at around 15 inputs, the count of solutions at around 95 (Fig. 8, PDF p. 8).
- **RQ3 (Tab. 6, PDF p. 9)**. Of the detected false positives, 88.7% have full line coverage, 79.0% full branch coverage and 37.8% a full mutation score. For Python and C++, the authors say line coverage "hardly provides any useful information" on whether the tests reveal bugs, and that their observations "suggest that branch coverage is more powerful than line coverage in exposing the weakness of tests".
- **Bug types (Tab. 7, PDF p. 10).** 73.18% of the 358 analysed false positives are corner-case errors (the algorithm ignores some edge input); others are wrong loop bounds, types or assignments, floating-point errors, misspellings, and three "hack" solutions written "to take advantage of the weakness of the tests".

## Limits the authors state

- "Generating correct test oracles is the main challenge in our work. Differential testing can determine that there are some wrong programs giving wrong answers but cannot determine which answer is right, and it may introduce bias into our work." (§5.2, PDF p. 10)
- External validity: one platform, AtCoder, chosen as "the only popular OJ platform that has open-sourced its full set of predefined tests available" (§5.2, PDF p. 10); construct validity: the metrics and tools chosen (§5.2, PDF p. 10).
- "considering the prevalence of equivalent mutants, it is difficult to reach a conclusion about the effectiveness of mutation score in avoiding false positive solutions" (§4.3, PDF p. 9).
- Equivalent mutants are checked for Python only (§3.4, PDF p. 4); RQ2 leaves out multi-answer problems (§3.5.2, PDF p. 4).
- "A more comprehensive analysis would require substantial further work, which includes bug localisation and bug repair on each of the 3,440 false positive solutions and also a comparison with other bugs found in non-OJ systems." (§5.1, PDF p. 10)

## Open problems and building blocks

  - New coverage criteria "that disregard template code and dead code are needed", and "future work on equivalent mutant detection, especially for constraint-equivalent mutants" (§5.3, PDF p. 11).
  - Platforms can use random generation with differential testing to "cover more corner cases" and update test suites as solutions accumulate (§5.3, PDF p. 10); AI researchers can filter false positive solutions from training data or test and repair the generated code (§5.3, PDF p. 11).
  - OJ data as datasets for testing research, e.g. bug prediction and detection (§5.3, PDF p. 11); the "hidden values and threats" of OJ platforms (§7, PDF p. 11).
- **Released:** "We have released the detected false positive solutions and the generated test inputs to facilitate future research." (abstract, PDF p. 1); "An open-source benchmark with false positive solutions named TrickyBugs" (§1, PDF p. 2). Page 1 carries two ACM artifact badges (PDF p. 1).
- **To reuse it:** the method samples inputs from a problem's stated constraints, compares many accepted solutions per problem, and is applied only to problems with a single correct answer (§3.5, PDF p. 4; §5.2, PDF p. 10).

## On this site

- **Tags:** <span class="tags"><a class="tag" href="#/tags/labels">labels</a><a class="tag sub" href="#/tags/cex-general">cex-general</a><a class="tag sub" href="#/tags/cex-search">cex-search</a></span>
