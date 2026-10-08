# The Regression Tax: Decomposing Why Skills Help -- and Hurt -- LLM Agents

**The Regression Tax** · preprint 2026

Read: [PDF](https://arxiv.org/pdf/2607.22520) · [arXiv](https://arxiv.org/abs/2607.22520)  
Code: [meta-skill-creator](https://github.com/sentient-agi/meta-skill-creator)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Splits the pass-rate change from adding a skill library into gains (tasks newly solved) and regressions (tasks a no-skill agent solved and now fails), with exact McNemar tests (abstract; §3.5–3.6; §4).
- Three skill libraries per stack, written from the same failure signals by Anthropic's, OpenAI's and the authors' skill creators, on OfficeQA-Pro and SpreadsheetBench with three harness–model stacks (OpenCode, Codex, Claude Code), each condition run once (§3.1–3.4; §3.6); regressions are hand-coded from paired trajectories into description-only influence ("osmosis"), grounding and verification displacement (§5).
- Edits to an agent's context break tasks it had already solved: the authors report that regressions offset 59% of gross gains across the eighteen library conditions (§4.1), and that a third of the formula failures they re-graded were correct outputs the spreadsheet grader could not evaluate (§5.3, Tab. 5). Single runs, so some flips may be run-to-run noise (§3.6).

## In plain words

Agent skills are short instruction files given to an LLM agent: a short description that always sits in its context, and a body it opens when it decides to use the skill. The authors say adding skills "is typically evaluated by average improvement in task success", which hides that skills "can also make agents worse" (abstract). They run three agent setups (an agent program with its usual model) on two office tasks, answering questions over U.S. Treasury reports and editing Excel workbooks, without skills and with each of three skill libraries, each condition once per task. They split every pass-rate change into gains (tasks newly solved) and regressions (solved tasks that now fail) (§1, §3). Over all eighteen library conditions, they report that regressions offset 59% of the gains (§4.1). From paired agent traces they name three candidate causes: the description alone shifting behavior, a skill's procedure misdirecting what the agent reads, and a procedure pushing aside a check on the answer (§1, §5). They present the advance as "not a new aggregate metric but its paired decomposition" (§1).

## Background and terms

**Terms to know:** [agent skill](#/glossary/agent-skill) · [agent harness](#/glossary/agent-harness) · [progressive disclosure](#/glossary/progressive-disclosure) · [McNemar's exact test](#/glossary/mcnemars-exact-test) · [multiple testing](#/glossary/multiple-testing) · [lost in the middle](#/glossary/lost-in-the-middle)

Our bridge: the description–body split is the glossary's progressive disclosure, a term the paper does not use.

**The paper's own terms:**
- **skill**: "a reusable piece of procedural guidance: a short description, a body of natural-language instructions, and sometimes bundled code" (§1). The description "stays in the system prompt on every step; the body loads only when the skill is invoked" (§3.3).
- **meta-skill creator**: a skill that helps create new skills from failure signals (§2). The three used, which also name the conditions (§3.3–3.4): **anthropic** (drafts, measures with and without the skill, rewrites until it helps), **openai** (one pass with a structure validator, following the Codex guide) and **Ours**, a "harness-agnostic pipeline we wrote for this study" that updates a similar existing skill instead of duplicating it and self-critiques its draft. **none** is the no-skill condition.
- **failure signals**: "recurring, fixable causes of error" an analyst extracts from the no-skill trajectories, once per stack (harness and model), so all creators start from the same signals (§3.3).
- **gain / regression / residual failure / retained**: against the no-skill run of the same task, failed then passes / passed then fails / fails both / passes both (§3.5).
- **net effect**: gains minus regressions; the pass-rate difference equals it divided by the number of tasks (§3.5, §4).
- **regression tax**: "That gap between gross gains and retained net improvement" (§4.1).
- **grounding, method, verification**: the stages of a task: reading the right inputs, the procedure, checking the output (Fig. 1).
- **skill-description osmosis**: no skill body is invoked yet the outcome changes, with influence evidence: the same task flips the same way across libraries, or the change matches a concept named in a description; flips without that evidence go to **Other** (§5).
- **grounding / verification displacement**: a skill is invoked or read, and the error is at the input stage on a task the baseline read correctly / at the output stage, where the procedure "replaced or suppressed a check the baseline would have run on its own answer" (§5).
- **grader artifact**: SpreadsheetBench's grader cannot recompute structured or table references or "several modern functions", so such a correct formula counts as a failure (§3.1); a regression caused this way is a **validation regression** (App. B.3).
- **transitions**: gains and regressions are counted per library condition, not per unique task (§4.1).

**Missing glossary terms:**
- **Newcombe confidence interval**: the interval on each paired pass-rate difference (Tab. 2 caption); a method for a confidence interval on the difference between two success rates measured on the same items (general definition).

**Builds on:**
- Skill generators from agent traces: Trace2Skill, EvoSkill, SkillOpt ([SkillOpt](#/papers/yang2026skillopt "SkillOpt: Executive Strategy for Self-Evolving Agent Skills (2026)")), SkillOS, and Anthropic's and OpenAI's skill-creator tools, which the authors say "evaluate them by average gains" (§1, §2).
- Harm detectors that drop or mask skills: ASSAY ([Not All Skills Help](#/papers/wang2026assay "Not All Skills Help: Measuring and Repairing Agent Knowledge (2026)"), masking), GRASP ([GRASP](#/papers/moll2026grasp "GRASP: Gated Regression-Aware Skill Proposer for Self-Improving LLM Agents (2026)"), a regression budget on a held-out probe) and RSEA (held-out selection); the authors say these act only when a skill is retrieved or invoked (§1, §2).
- Huang (2026) on LLM-generated skills for data science, which per the authors "treats these cases as diagnostic evidence rather than a mechanism account" (§2).
- Work on added context hurting: Shi et al. (irrelevant sentences in grade-school math, GSM-IC), Yang et al. (controlled distractors), Liu et al. (lost in the middle) (§2).

## Problem and setting

Which tasks does a skill library fix, which solved tasks does it break, and why (§1).

- **Benchmarks (§3.1):** OfficeQA-Pro, questions over long U.S. Treasury PDFs, a "challenging subset" the authors "curated and validated", correct "within about one percent"; SpreadsheetBench (Ma et al.), real Excel-forum problems where the agent edits a workbook, graded by exact cell values, pure-formatting and a few other tasks dropped. 94 and 392 tasks per stack (§3.6).
- **Stacks (Tab. 1, App. A), the unit of analysis (§3.2):** the harnesses OpenCode with MiniMax-M2.7, Codex with GPT-5.4-mini, Claude Code with Claude Sonnet 4.6, models via OpenRouter (a multi-vendor model service).
- **Conditions (§3.4):** only the library changes within a stack and benchmark. Libraries are not length-matched, so library-versus-library contrasts are used only for single traceable tasks.
- **Statistics (§3.6):** 5,832 runs, "paired comparisons on the same tasks, not 5,832 independent tasks"; two-sided exact McNemar tests with 95% intervals.

## Approach

- **Libraries (§3.3):** per stack, each creator writes skills from the failure signals, "with at most a few skills per signal", and the benchmark is re-run with the library. Creators "are only a way to get several libraries from one signal set. We do not rank them" (§3.3).
- **Decomposition (§3.5, §4):** each library is paired task by task with the no-skill run.
- **Mechanism coding (§5):** compare paired trajectories, record whether a body was read, find the first input- or output-stage divergence, and check other libraries on the same task. The full scheme covers OfficeQA-Pro; SpreadsheetBench gets a coarser split. The labels are "an observational classification rather than a controlled causal test" (§5).
- **Re-grading (§5.3, App. B.3):** failing SpreadsheetBench treatment runs with a formula in the graded region are recalculated in a full spreadsheet engine and compared cell by cell with the golden file; the original verifier uses gnumeric, an open-source spreadsheet program.

## Results

- **The tax (§4.1, Tab. 2):** every library breaks some solved tasks; 324 regression transitions offset 59% of 553 gain transitions, similarly on both benchmarks.
- **Rankings flip (§4.2):** on Claude Code with OfficeQA-Pro the libraries gain 10, 11 and 12 tasks but regress 2, 4 and 7, so ranking by net effect reverses ranking by gains (anthropic +8). The abstract says "the best-performing skills outperform others primarily by regressing less, not by gaining more"; §4.2 adds "This pattern is not universal: on SpreadsheetBench, the leading libraries often gain more as well as regress less."
- **Significance (§4.3):** five of eighteen conditions reach nominal significance; three survive a Bonferroni correction (the 5% level divided by eighteen), all Claude Code with Sonnet 4.6 on SpreadsheetBench; "most apparent improvements are indistinguishable from noise once the correction is applied".
- **OfficeQA-Pro mechanisms (Tab. 3):** of 81 regressions, 59 grounding displacement, 14 osmosis, 3 mixed grounding and verification, 5 Other; none is verification alone (§5.3). "Grounding dominates when a body is engaged; osmosis is concentrated when it is not" (§5).
- **SpreadsheetBench mechanisms (Tab. 4):** of 243 regressions, 70 osmosis and 95 Other, the rest body engaged or grader artifact. On the two stacks that rarely open a skill there, most gains come with no body read, and the description channel, "in our data", "helps more often than it harms" (§5.1). Body use "depends on the harness and the benchmark, not on the skill content".
- **Re-grading (§5.3, Tab. 5):** of 663 failing treatment runs with a formula, 226 (34%) are correct formulas the value-only grader could not evaluate, 396 are wrong, 41 unevaluable; recovery is largest on Codex.
- **Residual failures (§5.4):** the authors place them at grounding on OfficeQA-Pro and at verification on SpreadsheetBench, not at the method stage existing skills "mostly target" (Fig. 1): libraries "over-serve the procedure in the middle and under-serve the two ends" (§5.4). They call these stage labels "objective" and finer categories "illustrative".

## Limits the authors state

- Office tasks only; "the results may not transfer to domains where the method itself is the main bottleneck" (§6.2).
- Harness and model are coupled, "so model and harness effects are not separated" (§6.2).
- Only three of five nominally significant cells survive correction; "our claims rest on these, not on the two that do not survive" (§6.2).
- One run per condition: "run-to-run variance is not estimated" (§3.6).
- Mechanism labels are "coded by one author" and observational (§5, §6.2).
- Library-versus-library contrasts are "not a controlled token dose" (§3.4).
- Verification displacement "is the hardest mechanism to isolate as a regression" (§7).
- The grader artifact stays in the main results (§3.1).

## Open problems and building blocks

  - "inter-coder agreement and controlled content interventions would further validate" the labels (§6.2); "a fully second-coded taxonomy is left to future work" (§5.4).
  - Evaluations "should report the paired gain and regression counts, not only the net pass rate" (§7) and "should compare at least three conditions: no library, descriptions only, and descriptions plus available bodies" (§6.1); grounding and output checks "should be probed through controlled interventions rather than read off observational traces" (§7).
  - Skill design: the traces "point toward supplying specific grounding information rather than generic procedural routines, with executable output checks as a complementary way to strengthen verification" (§6.1).
- **Released:** the title note links a "Sentient skill-creator skill" (title page), not said to be Ours. No release of runs, libraries or re-grading code is stated.
- **To reuse it:** the stacks' OpenRouter model IDs (App. A); a full spreadsheet engine, not named (§5.3); Ours "uses only standard-library helpers and no external runs, subagents, or CLI tools" (§3.3).

## On this site

- **Tags:** <span class="tags"><a class="tag" href="#/tags/labels">labels</a><a class="tag" href="#/tags/stats">stats</a><a class="tag sub" href="#/tags/harness-general">harness-general</a><a class="tag sub" href="#/tags/harness-promptopt">harness-promptopt</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/promptopt-context">promptopt-context</a><a class="tag sub" href="#/tags/promptopt-feedback">promptopt-feedback</a><a class="tag sub" href="#/tags/promptopt-general">promptopt-general</a></span>
