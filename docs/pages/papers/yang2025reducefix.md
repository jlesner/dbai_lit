# Input Reduction Enhanced LLM-based Program Repair

**Input Reduction Enhanced LLM-based…** · ICSE 2026 (per the PDF's running header) · 2025

Read: [PDF](https://arxiv.org/pdf/2507.15251) · [arXiv](https://arxiv.org/abs/2507.15251)

<p class="notice">A summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- LLM program repair when the failing test input is long: an LLM writes, once per task, a delta-debugging (ddmin) script that shrinks the failure-inducing input while the buggy program and a correct reference still print different outputs, and the repair prompt carries the reduced input instead of the full one (abstract; §3.1–3.4).
- Evaluated on the authors' LFTBench (wrong C++ AtCoder submissions with long failing inputs, plus a Python mirror) with four LLMs against prompts with no test and with the original test, as a plug-in to ChatRepair and CREF, and on OSS-Fuzz crashes (§4.2; §5.1).
- An LLM-written reducer driving a classic search, checked by running both programs, against the LLM shrinking the input in text and against plain ddmin (<a class="tag" href="#/tags/reduce">reduce</a>, <a class="tag" href="#/tags/cex">cex</a>, <a class="tag" href="#/tags/offload">offload</a>): the authors report reduction success of 95.0% against 40.0% for the pure-LLM reducer and 35.5% for ddmin-only (Tab. 3); and a prompt-length ablation on whether a shorter failing input helps repair (<a class="tag" href="#/tags/longctx">longctx</a>, §5.4, Tab. 9).

## In plain words

An LLM fixing a buggy program is usually shown the test input on which the program fails. On programming-contest tasks that input can be megabytes long, and the authors argue that the key part then gets buried in the prompt, where it "receives little attention" (§1). Their system, ReduceFix, first has an LLM write, once per task, a script that shrinks the failing input, deleting pieces while the buggy program and a correct reference still print different outputs; the repair prompt then carries the shrunken input (abstract; §3). On their new benchmark of wrong contest submissions, across four LLMs, they report that this raises the share of bugs fixed by at least one of ten sampled patches by up to 53.8% relative to a prompt with the original test (abstract; Tab. 6). Adding the step to the repair system ChatRepair raises that share by 21.3% relative, they report (§5.5). They call ReduceFix, "To our knowledge", "the first approach that leverages test input reduction techniques into LLM-based APR" (APR: automated program repair) (§7.1).

## Background and terms

**Terms to know:** [automated program repair](#/glossary/automated-program-repair) · [delta debugging](#/glossary/delta-debugging) · [lost in the middle](#/glossary/lost-in-the-middle) · [pass@k](#/glossary/passk) · [online judge](#/glossary/online-judge) · [fuzzing](#/glossary/fuzzing) · [data contamination](#/glossary/data-contamination) · [greedy decoding and temperature sampling](#/glossary/greedy-decoding-and-temperature-sampling) · [Mann-Whitney U test](#/glossary/mann-whitney-u-test)

**The paper's own terms:**
- **failure-inducing input**: a test input on which the buggy submission's output differs from the reference solution's (§3.1, §3.3).
- **ddmin**: the classic delta-debugging algorithm: split the input into chunks, try removing them, split finer when no removal keeps the failure (§3.3).
- **reducer**: the Python script (`reducer.py`) the LLM writes for one task, a "customized reducer derived from the ddmin algorithm" (§3.2), reused for every buggy submission of that task (§5.2).
- **compression rate**: the share of the input's bytes removed, one minus reduced size over original size (Eq. 2; §5.2).
- **successful reduction**: finishes within the time limit without errors, keeps the failure, and returns a strictly smaller input (§5.2).
- **Baseline, Origin Test, Reduced Test**: repair prompts with no failing input, with "the full failure-inducing input", and with the reduced one (§5.1, RQ-2).
- **Diff Lines, Reduced + Origin**: ablation prompts: the Baseline plus up to ten mismatched output lines, and the reduced and full tests concatenated (§5.4).
- **ddmin-only, pure-LLM**: reduction baselines: ddmin run directly on the input with spaces and newlines as delimiters, and the LLM asked to write a shorter input directly (§5.2).
- **LFTBench, LFTBench-Py**: the authors' benchmark of wrong C++ submissions with long failing inputs, and its Python mirror (§4.2).

**Builds on:**
- The ddmin algorithm of Zeller and Hildebrandt (2002), which the one-shot prompt teaches the LLM to adapt to each input format (§3.2; §7.2); hand-made reducers (the ddmin-based HDD and Perses; the domain-specific ddSMT and J-Reduce) are, the authors say, not reusable across formats (§1).
- The "lost-in-the-middle" finding of Liu et al. (2023) ([Lost in the Middle](#/papers/liu2023lostmiddle "Lost in the Middle: How Language Models Use Long Contexts (2024)")), and CREF's report (CREF: a conversational LLM repair framework) that on Bard (Google's LLM chatbot) the failing test can lower repair accuracy below a no-test prompt "in some cases" (§1).
- ChatRepair (Xia and Zhang, 2024) and CREF (Yang et al., 2024, sharing authors with this paper), conversational LLM repair frameworks the reducer is plugged into (§5.5).
- ARVO (Mei et al., 2024), an atlas of reproducible OSS-Fuzz vulnerabilities (OSS-Fuzz: Google's continuous fuzzing of open-source projects) whose data, scripts and Docker images supply the repository-level cases (§5.6).

## Problem and setting

- **Questions:** can an LLM write a working reducer for a new task unaided, and does repair from the reduced input beat repair from no input or the full one (§1; §5.1)?
- **Inputs:** the task description, a correct reference solution, the buggy submission, the hidden test suite and one failure-inducing input (§3.1). A patch is correct when its output equals the reference's on every test of the full hidden suite (Eq. 3; §3.4).
- **LFTBench:** tasks from AtCoder (a programming-contest site) Beginner Contests 361–377, chosen because AtCoder published full test archives and because the contests fall after the four models' training cut-offs, for a low risk of training leakage; tasks at problem letters C to F (E and F the hardest, §5.4) whose largest official test is at least 4 KB; 10 C++ submissions per task that failed on a large test, plus one Python submission per task for LFTBench-Py (§4.2). The median failing input is "over 1 MB" (§4.2). Inputs fall into six format families (Tab. 1). In existing benchmarks such as Defects4J and HumanEval-Java (Java bug benchmarks), test inputs "rarely exceed a few hundred characters" (§1). The line budget L for prompt truncation (§3.4) is not given a value.
- **OSS-Fuzz:** 12 crash cases from five projects (FFmpeg, ImageMagick, Poppler, php-src, MuPDF) (media, image, PHP and PDF software), taken from ARVO, each fixed by a one-file ground-truth patch with a crash input over 1 KB, choosing the smallest patches; patches are checked in ARVO's Docker images (§5.6). OSS-Fuzz is Google's continuous fuzzing of open-source projects (§4.2).
- **Models:** two open models that fit one 24 GB consumer GPU, GLM-4-9B-chat and Qwen2.5-Coder-7B-instruct, and two low-cost hosted ones, Qwen2.5-Plus (closed weights) and DeepSeek-V3 (§4.1). The reducer is written by Qwen2.5-Plus with greedy decoding; repair samples at temperature 0.8 (Tab. 2).

## Approach

- **Three stages** (Fig. 2; Alg. 1):
  - **Reducer generation:** one prompt holds the full task statement, a worked example (task ABC330D with its working reducer) and a few input-output pairs of the current task (§3.2; Listing 1). A reducer that fails a static check ends the run as a failure (Alg. 1).
  - **Input reduction:** the reducer runs for at most 60 seconds. Formally it seeks the smallest input obtainable by deleting elements of the original, keeping their order, on which reference and buggy outputs still differ (Eq. 1). On a time-out, a crash, a lost difference or no shrinkage, the original input goes forward instead (§3.3; Alg. 1).
  - **Patch generation:** the prompt joins the task, the buggy code and the reduced input with its outputs (§3.4; §5.4). An input over a budget of L lines is cut, in the prompt only, to about L/2 lines from its start and L/2 from its end, never splitting a line; up to ten candidate patches are each run on the full hidden suite (§3.4).
- The generated reducers do more than delete: on FFmpeg the LLM-written reducer "applies structure-preserving transformations with adaptive chunking" before ddmin (§5.6).
- **Plug-ins:** in ChatRepair (one feedback round) and a two-turn CREF, only the failing test is swapped for the reduced one (§5.5).

## Results

- **Reduction (RQ-1, §5.2):** (RQ: the paper's research question) the LLM wrote a syntactically valid reducer for every bug. The paper reports reduction success of 95.0% against 40.0% for pure-LLM and 35.5% for ddmin-only (Tab. 3), in every ReduceFix failure ddmin "did not yield a shorter candidate before the time limit", and a mean compression of 89.1% (median 100.0%) over successful reductions (Tab. 3). The pure-LLM reducer, reading the whole input, cost far more (Tab. 5).
- **Repair (RQ-2, §5.3):** Reduced Test raises overall pass@10 over Baseline for all four LLMs (Tab. 6). The abstract's "up to 53.8%" over Origin Test is GLM-4-9B-chat's gain (our arithmetic from Tab. 6); adding the full input lowered GLM-4-9B-chat's and DeepSeek-V3's overall pass@10 below no input at all (§5.3). The authors report the gain over Origin Test as significant under a two-sided Mann-Whitney test (the paper's "MWW") over the four LLMs, and that ddmin-only's reduced inputs give Qwen2.5-Coder-7B-instruct lower pass@k than ReduceFix's, significantly so at pass@10 (§5.3). On LFTBench-Py with Qwen2.5-Plus, Reduced Test beats both other prompts at overall pass@10 (Tab. 7).
- **Prompt composition (RQ-3, §5.4):** with Qwen2.5-Coder-7B-instruct, Reduced Test reaches 25.5% pass@10 against 20.0% for Diff Lines and 19.0% for Reduced + Origin (Tab. 9); the unreduced prompts are several times longer (Tab. 8). The authors conclude that "either ingredient alone is insufficient": compact length and the complete counterexample are both needed (§5.4).
- **Plug-ins (RQ-4, §5.5):** ChatRepair's overall pass@10 rises by 21.3% relative, with gains at every difficulty level (Tab. 10); CREF's rises less (Tab. 11).
- **OSS-Fuzz (RQ-5, §5.6):** the authors report that ReduceFix keeps the crash more often than ddmin-only "while achieving equal or better compression", and that the pure-LLM reducer shrinks no input (Tab. 12). With Qwen2.5-Plus, pass@10 over the 12 cases is 41.7% with the reduced input against 25.0% with no input and 16.7% with the original (Tab. 13); ImageMagick "remained unsolved" and Poppler showed no gain (§5.6).

## Limits the authors state

- "The inherent stochasticity of LLMs may pose threats to internal validity"; they answer with greedy decoding for reducers and pass@k over sampled patches (§6).
- A compression rate that often hits its maximum "hides variation among difficulties", so they report median and mean (§6).
- "pass@k may overstate success when a patch is tuned to a partial test set"; every candidate is checked against the full official archive (§6).
- "some OSS-Fuzz repositories may overlap with LLM pretraining corpora"; they argue that relative differences between prompts stay valid (§4.2).
- A reducer can mask the bug: on ABC372E it renumbered vertices, the defect depends on their size, and ddmin stopped without shrinking; they say "We can resolve the issue by adding one simple guard" that reruns the check and rolls back (§5.2).
- Tasks are limited to difficulties C to F, "ensuring that the tasks remain solvable for LLMs" (§4.2).

## Open problems and building blocks

- **Open:** "future work can extend ReduceFix into other APR frameworks and even broadly long-context LLM tasks that profit from concise but information-rich prompts" (§8).
- **Released:** "the full artifact is published" on GitHub (§4.4); the contributions list says "We release the first APR benchmark, LFTBench" and a Python mirror (§1); the repository's README "lists all 20 synthesized reducers" (§5.2); they "publish the entire distribution" of compression rates (§6).
- **To reuse it:** a correct reference solution, the hidden test suite and one failing input per bug (§3.1); a one-shot example with a working reducer (§3.2); Qwen2.5-Plus at greedy decoding for the reducer, 60 s per reduction (600 s with Docker on OSS-Fuzz), ten repair samples at temperature 0.8 (Tab. 2; §5.6). The reducer is written once per task (§5.2).
- **Beyond its domain:** the "LLM + classic search" pattern "suggests that similar hybrids could improve other code-analysis tasks" (§5.2); controlled input compression "may benefit other long-context tasks" (§5.3); also uses in programming courses and continuous integration (§8).

## On this site

- **Discussed in:** [Distinguishing documents for two programs in any DSL](#/challenges/dsl_counterexamples) · [Minimal counterexamples](#/challenges/minimal_counterexamples)
- **Tags:** <span class="tags"><a class="tag" href="#/tags/benchmark">benchmark</a><a class="tag" href="#/tags/cex">cex</a><a class="tag" href="#/tags/code">code</a><a class="tag" href="#/tags/harness">harness</a><a class="tag" href="#/tags/longctx">longctx</a><a class="tag" href="#/tags/method">method</a><a class="tag" href="#/tags/offload">offload</a><a class="tag" href="#/tags/reduce">reduce</a><a class="tag sub" href="#/tags/llm-assist">llm-assist</a></span>
