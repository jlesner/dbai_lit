# Frontier Coding Agents Use Metaprogramming to Adapt to Unfamiliar Programming Languages

**Frontier Coding Agents Use…** · preprint 2026

Read: [PDF](https://arxiv.org/pdf/2606.10933) · [arXiv](https://arxiv.org/abs/2606.10933)

<p class="notice">A summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Evaluates six deployed coding agents (Claude Opus 4.6, Sonnet 4.6 and Haiku 4.5 in Claude Code, GPT-5.4 xhigh and GPT-5.4 mini in Codex, Kimi K2.5 in OpenCode) on the EsoLang-Bench problems in four esoteric languages, each agent working through a language's problems in one session with file editing, local interpreter runs and hidden-test grading (abstract; §2); the authors report that the strongest agents often avoid writing the target language and instead write Python programs that generate it (abstract; §3.2).
- Interventions: forbidding host-language generators for Opus 4.6 and GPT-5.4 xhigh on all four languages (§3.3, Fig. 3), swapping the generator's host language on Brainfuck (§3.3), giving three weaker agents a strategy preamble distilled from Opus 4.6's traces, alone or with a small helper library taken from the strong agents' sessions, on Brainfuck and Befunge-98 (§3.4, Tab. 3; App. G), and capping local interpreter calls on the same two languages (§3.5, Fig. 4).
- Evidence on what a frontier model's experience can hand down to weaker models in a language rare in pretraining, and in which form: the authors report that the written strategy "produces little improvement" while the helper library lifts GPT-5.4 mini on Brainfuck from 5 to 53 of 80 problems and leaves Haiku 4.5 "near the floor" (§3.4, Tab. 3); the strongest agents' detour through a familiar host language (§3.3) is a route that a test of learning an unseen language from its documentation and engine ([Learning a rarely seen DSL in prompts](#/challenges/unseen_dsl_in_prompts)) has to allow for or block.

## In plain words

Coding agents are mostly tested on familiar languages. The authors ask how they behave when the language itself is unfamiliar, since real systems involve "internal domain-specific languages, proprietary configuration files, generated APIs, and local tool conventions that are absent from public corpora or differ from standard programming environments" (§1). Six deployed coding agents (each an LLM inside its own coding tool) work through 80 short problems in each of four esoteric languages, running programs locally and graded by hidden tests; the authors then change one thing at a time (abstract; §2).

On Brainfuck and Befunge-98 the strongest agents (Claude Opus 4.6, and GPT-5.4 at "xhigh", extra-high, reasoning effort) often write Python programs that generate the target code; forbidding this lowers Opus 4.6 from 64 to 27 of 80 Brainfuck problems (§3.3). Written advice distilled from Opus 4.6's sessions "does not materially improve weaker agents" (abstract); adding the strong agents' helper code, with no solved problems in it, lifts GPT-5.4 mini from 5 to 53 on Brainfuck but leaves Claude Haiku 4.5 low (§3.4, Tab. 3). It presents itself as an evaluation with interventions, not a method.

## Background and terms

**Terms to know:** [agent harness](#/glossary/agent-harness) · [low-resource programming language](#/glossary/low-resource-programming-language) · [domain-specific language (DSL)](#/glossary/domain-specific-language-dsl) · [Wilson score interval](#/glossary/wilson-score-interval) · [data contamination](#/glossary/data-contamination) · [out-of-distribution generalization](#/glossary/out-of-distribution-generalization) · [esoteric programming language (esolang)](#/glossary/esoteric-programming-language-esolang) (here "controlled proxies for unfamiliar executable interfaces", not "realistic production targets", §1)

**The paper's own terms:**
- **metaprogramming**: the agent "writes a program in a familiar host language, such as Python, JavaScript, or Rust, whose output is source code in the target esolang" (§2 "Logging and behavioral measurements"); the opposite is **direct authoring**, editing the target source itself.
- **low-ecosystem**: the paper's word for languages with little public code (§3.1, §4)
- **primary protocol**: the setup of all headline results: one session per agent and language over 80 problems in fixed order, unlimited local runs, up to three hidden submissions per problem, finalized problems never revisited (§2; Tab. 4).
- **session**: one fresh run of the agent's tool on a fresh workspace; three per headline cell (one agent on one language), the first reported, and two per ablation cell, averaged (§2; App. A.7).
- **text and library conditions** (strategy transfer): the text condition adds a system-prompt preamble summarizing the strong agents' strategy; the library condition adds that preamble plus "a small strategy-only host-language helper library" with no per-problem generators, solved programs or hidden-test data (§3.4; App. G). "Distilled" here means summarizing traces into text or code, not training a model.
- **harness**, two senses: the coding tool ("coding harness", Fig. 1) and the benchmark program `harness.py` (App. A.3), meant under "Released".
- **controlled-access protocol**: a stricter variant with at most three local runs and one hidden submission per problem (App. A.8).
- **the four esolangs**: **Brainfuck** (eight symbols moving a pointer over a tape of byte cells), **Befunge-98** (one-character commands on a 2D grid, with a stack), **Whitespace** (programs made only of spaces, tabs and linefeeds) and **Shakespeare** (programs written as theatrical scripts) (App. A.2).

**Missing glossary terms:** none.

**Bridges to the glossary** (ours): the text preamble is close to an [agent skill](#/glossary/agent-skill) in its text form, the helper library to one with scripts; agents reusing helpers across problems resemble [library learning](#/glossary/library-learning) within one session.

**Builds on:**
- EsoLang-Bench (Sharma and Chopra, 2026), [EsoLang-Bench](#/papers/sharma2026esolang "EsoLang-Bench: Evaluating Genuine Reasoning in Large Language Models via Esoteric Programming Languages (2026)"): the source of the problems, hidden tests and interpreters; its fifth language, Unlambda, is dropped (§2).
- The mainstream coding benchmarks it compares against: SWE-Bench Verified (fixing real GitHub issues in Python projects), Terminal-Bench 2.0 (hard tasks in terminal environments) and LiveCodeBench v6 (competitive-programming problems collected over time) (Tab. 2; App. B.8).
- Work showing that tools, feedback and intermediate computation help LLMs, among them ReAct ([ReAct](#/papers/yao2022react "ReAct: Synergizing Reasoning and Acting in Language Models (2023)")), Reflexion ([Reflexion](#/papers/shinn2023reflexion "Reflexion: Language Agents with Verbal Reinforcement Learning (2023)")) and self-debugging ([Self-Debugging](#/papers/chen2023selfdebug "Teaching Large Language Models to Self-Debug (2023)")) (§5).

## Problem and setting

The question: which agents can learn an unfamiliar language well enough within a session to "write, run, debug, and improve working programs", and how they do it (§1).

- **Agents:** Claude Opus 4.6, Sonnet 4.6 and Haiku 4.5 in Claude Code; GPT-5.4 at "xhigh" and GPT-5.4 mini at "medium" reasoning effort in Codex; Kimi K2.5 (Moonshot AI's model) in OpenCode (§1, §2). Claude Code, Codex and OpenCode are coding-agent command-line tools; the model–tool pairing "is part of what we evaluate" (§2).
- **Tasks:** the same 80 problems in every language, 20 per tier (easy, medium, hard, extra-hard); EsoLang-Bench reports "near-ceiling performance" on them in Python or JavaScript (§2; App. A.2).
- **Feedback:** local runs show stdout, stderr and runtime errors; hidden submissions return only the number of tests passed (§2). Output is capped at 32,000 tokens per assistant turn (Tab. 4).
- **Correct** means all six hidden tests pass on one submission, with no partial credit (§2).

## Approach

- **Main grid:** six agents × four languages under the primary protocol, with 95% Wilson intervals over the first session's 80 outcomes (§2, Tab. 1).
- **Interventions,** each changing one thing (§2 "Diagnostic protocol variants"):
  - **No metaprogramming** for Opus 4.6 and GPT-5.4 xhigh: bash access removed and a preamble requiring direct authoring (§3.3; App. A.12).
  - **Host-language swap:** the generator limited to Python, JavaScript or Rust (§3.3).
  - **Strategy transfer** to Haiku 4.5, Sonnet 4.6 and GPT-5.4 mini on Brainfuck and Befunge-98: the authors wrote the text preamble from Opus 4.6's transcript (App. G.1); the library holds a Brainfuck code-generation module, a builder written by GPT-5.4 xhigh, Opus's notes and a Befunge-98 simulator (App. G.2).
  - **Interpreter-call budget** of 3, 5, 15, 30 or unlimited per problem, and **output tokens** counted on the first 20 problems for the Claude agents (§3.5).
- **Checks:** OpenCode re-runs of the two strongest agents (App. B.4); public-code frequency and n-gram overlap (App. D).

## Results

- **Spread:** across the six agents, the EsoLang-Bench mean ranges over 88.4 points, against 6.6 on SWE-Bench Verified, 33.3 on Terminal-Bench 2.0 and 43.5 on LiveCodeBench v6 (Tab. 2). The mainstream scores are vendor-reported or from the third-party leaderboard Vals.ai, not re-run for the table (App. B.2).
- **Main grid:** mean solved rates run from 99.7% (GPT-5.4 xhigh) and 86.9% (Opus 4.6) down to 11.3% (Kimi K2.5) (Tab. 1). Whitespace is "near-ceiling for several agents", while Brainfuck and Befunge-98 "expose large separations" (§3.1).
- **Session stability:** across the three sessions, no cell's solved count varies by more than 2 problems (App. B.7).
- **Metaprogramming observed:** on the low-level languages the strongest agents "often avoid direct target-language authoring" and debug generators locally; the prompts don't ask for it (§3.2). In one trace Opus 4.6's hand-written Brainfuck fails while its generator's output passes (§3.2; App. C.5).
- **Forbidding it:** on Brainfuck, Opus 4.6 falls from 64 to 27 and GPT-5.4 xhigh from 79 to 29 solved problems; Befunge-98 drops are large too, while Whitespace and Shakespeare are "less diagnostic" (§3.3, Fig. 3).
- **Host language:** with Python, JavaScript or Rust, Opus 4.6 solves 64, 63 and 55 Brainfuck problems and GPT-5.4 xhigh 79, 77 and 79 (§3.3).
- **Strategy transfer** (Brainfuck Base / +Text / +Lib, of 80): Haiku 4.5 4/3/7, Sonnet 4.6 12/12/64, GPT-5.4 mini 5/8/53; on Befunge-98 GPT-5.4 mini goes 11/15/64 and Haiku 4.5 4/5/4 (Tab. 3). The authors' reading: the mid-tier agents "do not mainly lack the high-level idea. They struggle to build the reusable code needed to carry it out" (§3.4). Weaker agents may "create a generator but still emit incorrect target code" (App. C.3).
- **Budgets:** more interpreter calls help Opus 4.6 on both languages and Sonnet 4.6 on Befunge-98, while agents "near the floor at the smallest budget remain near the floor" (§3.5, Fig. 4). On the first 20 problems Opus 4.6 needs fewer output tokens than Sonnet 4.6 on both languages, which the authors read as finding "a reusable strategy earlier" (§3.5, Fig. 5).
- **Other checks:** the OpenCode re-runs land within the Wilson interval of the native count and keep the ordering (App. B.4, Tab. 8); the controlled-access protocol keeps the ordering with lower scores (App. A.8).

## Limits the authors state

- The strongest agents are closed-source, so training exposure can't be inspected: "We therefore do not claim formal distributional novelty"; hidden tests, isolated workspaces and fixed sessions "reduce shallow memorization but do not prove zero exposure" (§4).
- The esolangs are artificial; success is "evidence about adaptation to low-ecosystem executable interfaces, not as evidence that esolangs themselves are important production targets" (§4).
- Claude Code, Codex and OpenCode "are not identical internally" (§4).
- "The metaprogramming claim is specific to Brainfuck and Befunge-98 where direct authoring is fragile, not Whitespace or Shakespeare" (§4).
- The Wilson interval assumes independent problems, which is "not literally satisfied" because helpers carry over between problems (App. B.6).
- Unlambda is excluded because its slow interpreter would make run time depend on "interpreter latency rather than adaptation behavior" (§2).
- The transcript excerpts come from a relaxed run that allowed skipping and revisiting, used "only as a qualitative trace source" (App. C.8); the n-gram check is "a weak positive control" (App. D).

## Open problems and building blocks

  - "Making this capability reliable in smaller or open-source agents should become a target for training, Distillation into compact models, and model analysis" (§6).
  - App. I: a newly constructed language "designed to be genuinely out-of-distribution"; the method in non-code settings (scientific workflows, data analysis, theorem proving, interactive web tasks); benchmark families that vary unfamiliarity, semantic complexity, tool access and program length independently; diagnostics of how local feedback turns into solves; and whether agents can "persist accumulated structure as local notes or textbooks and build on that knowledge across runs".
- **Released:** the checklist says the harness, the four interpreters, the prompts, 48 ready-to-run experiment cells and tests needing no provider API key are "released under the MIT license in the anonymous supplementary archive accompanying this submission" (checklist item 5, PDF p. 41); the problems are EsoLang-Bench's, a "previously released third-party artifact" (checklist item 5).
- **To reuse it:** the agents' command-line tools (App. A.5); running an agent on a cell needs a provider API key, and the archive uses "only the Python standard library plus the third-party shakespearelang package" for the Shakespeare interpreter (checklist item 5); local runs stop after 10⁷ interpreter steps (App. A.3).
- **Beyond its domain:** the authors connect the setting to long-tail production coding, "where agents face internal DSLs, generated APIs, proprietary configuration formats, and platform-specific frameworks that are sparse in public training data", and say their esolang setting "makes an analogous pressure public, runnable, inspectable, and automatically graded" (§5).

## On this site

- **Discussed in:** [Prompt-space self-play judged by an engine](#/challenges/prompt_space_self_play) · [Learning a rarely seen DSL in prompts](#/challenges/unseen_dsl_in_prompts)
- **Tags:** <span class="tags"><a class="tag" href="#/tags/compact">compact</a><a class="tag" href="#/tags/rarelang">rarelang</a><a class="tag sub" href="#/tags/harness-general">harness-general</a><a class="tag sub" href="#/tags/llm-method">llm-method</a></span>
