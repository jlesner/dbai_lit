# DatalogBench: Evaluating Large Language Models on Text-to-Datalog Synthesis

**DatalogBench** · preprint 2026

Read: [PDF](https://arxiv.org/pdf/2609.37233) · [arXiv](https://arxiv.org/abs/2609.37233)  
Code: [DatalogBench](https://github.com/ZJU-PL/DatalogBench)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- A benchmark of text-to-Datalog synthesis in the Soufflé dialect: each task gives a natural-language question and the input and output relation signatures, and a candidate program counts only if it compiles and reproduces the expected output on every held-out evaluation variant (abstract; §3; §5.2). Evaluates LLMs prompted directly, with and without relation descriptions and an input–output example, and coding agents that get execution feedback (abstract; §5.1).
- Tasks are curated from public Datalog-based artifacts, renamed and given regenerated facts, with auxiliary predicates left for the model to invent (§4.1); the execution oracle is validated by mutation analysis whose operators delete a rule, delete a body atom or rebind a join variable (§4.3); failures are split into compile-time and semantic ones and sliced by recursion and auxiliary predicates (§6.3).
- An LLM benchmark for a DSL whose answer key an engine computes and whose oracle strength is measured rather than assumed, with the limit stated that the mutants never alter a negation, an aggregate function or a grouping scope (§4.3); it also shows that execution feedback on a single demonstration instance lets coding agents return programs the held-out variants reject (§6.2).

## In plain words

Datalog is a rule language whose rules can refer to themselves (recursion), used for jobs such as analysing programs; the authors say its programs "are hard to write", and that existing tools that write them need the goal stated as input–output examples (abstract). They ask how well LLMs write a Datalog program from an English question and the names and argument types of its input and output tables, which "has not been systematically evaluated" (abstract; §3). They built DatalogBench, 136 tasks from existing Datalog projects, graded by running each program on held-out inputs; the check's strength is measured by how many small errors planted in the reference programs it catches (abstract). Prompted once, the best model and prompt solves 68.4% of tasks (Claude Opus 5, given table descriptions and one example; §6.1). Two coding agents that revise after running their program on one example input, for up to four tries, solve 82.4% and 83.8%, against 55.9% and 52.2% for the same models and prompt, asked once (§6.2). They claim a gap: "To our knowledge, no existing benchmark" checks such programs (§2).

## Background and terms

**Terms to know:** [Datalog](#/glossary/datalog) · [logic programming](#/glossary/logic-programming) · [program synthesis](#/glossary/program-synthesis) · [test oracle](#/glossary/test-oracle) · [mutation testing](#/glossary/mutation-testing) · [data contamination](#/glossary/data-contamination) · [text-to-SQL](#/glossary/text-to-sql)

**The paper's own terms:**
- **auxiliary predicate**: a relation the program defines that is neither input nor output; task schemas never name them (§3; §4.1).
- **recursive**: a program whose predicate dependency graph (an edge from each body predicate to its rule's head) has a cycle (§3).
- **Soufflé dialect**: the syntax of Jordan et al.'s (2016) Soufflé (a Datalog engine that compiles programs into parallel C++); it allows negation and aggregation, requires a typed declaration (`.decl`) for every relation, auxiliary ones included, and checks the whole program before running it, so one mis-bound variable, type clash or stratification violation rejects it (§3; §5.2).
- **demonstration instance** and **evaluation variants**: one instance (input facts with expected output) that may appear in a prompt as an example or give an agent feedback, and a disjoint set of held-out instances used only for scoring (§3, Eq. 1).
- **Compile Pass (CP)** and **Exact Match (EX)**: the share of tasks whose program Soufflé accepts, and whose program also reproduces the expected output on every evaluation variant (§5.2, Eq. 2). EX compares outputs, not program text.
- **repaired exact match (EX†)**: a diagnostic that also credits a program made exact by synthesizing only its omitted declarations for auxiliary predicates (§5.2).
- **Direct cells**: the 24 model–prompt combinations of direct prompting; an agent's **matched** cell is its own model with signatures and no example (§5.1).

**Missing glossary terms:**
- **least fixed point**: a Datalog program's output, reached by applying the rules until nothing new is derived (§3).
- **stratified negation**: negation allowed only when no cycle in the dependency graph passes through a negated literal, so every negated predicate is fully computed before use (§3).
- **safety**: every variable in a rule's head, in a negated atom or in a comparison must also occur in a positive body atom (App. A).
- **predicate invention**: inventing, naming and, in Soufflé, declaring with typed attributes the auxiliary predicates a decomposition needs (§3).

**Builds on:**
- Datalog synthesizers that take input–output examples (e.g. Si et al., 2018; Raghothaman et al., 2020), whose way of stating intent §1 calls "neither natural nor easy" (§2); EGS (Thakkar et al., 2021; example-guided), GenSynth (Mendelson et al., 2021; genetic search) and ProSynth (Raghothaman et al., 2020; [provenance](#/glossary/data-provenance)-guided) are run as baselines (App. M).
- EvalPlus (code benchmarks augmented with generated tests; Liu et al., 2023; [EvalPlus](#/papers/liu2023evalplus "Is Your Code Generated by ChatGPT Really Correct? Rigorous Evaluation of Large Language Models for Code Generation (2023)")), which "showed that weak tests overestimate correctness"; the authors take this "as a requirement" (§2).
- Text-to-SQL benchmarks WikiSQL, Spider ([Spider](#/papers/yu2018spider "Spider: A Large-Scale Human-Labeled Dataset for Complex and Cross-Domain Semantic Parsing and Text-to-SQL Task (2018)")), BIRD ([BIRD](#/papers/li2023bird "Can LLM Already Serve as A Database Interface? A BIg Bench for Large-Scale Database Grounded Text-to-SQLs (2023)")) and Spider 2.0 ([Spider 2.0](#/papers/lei2024spider2 "Spider 2.0: Evaluating Language Models on Real-World Enterprise Text-to-SQL Workflows (2025)")), whose target queries "rarely need recursion" (§2).

## Problem and setting

- **The question:** "Can probabilistic language models reliably synthesize programs that satisfy Datalog's strict logical semantics?" (§1).
- **A task** gives a question, input and output relation signatures (names and argument types), optional relation descriptions, a demonstration instance and evaluation variants (§3, Eq. 1).
- **Correctness** is closed-world: the output must equal the expected output on every variant, stricter than example-based synthesis, which only requires deriving the positive examples and none of the negative ones (App. A, Def. A.1). Question and schema must "together fix a single intended output"; 25 tasks are determinate only given domain vocabulary, which a knowledge note supplies for 15, while the other ten "assume a reader who already has it" (§4.1).
- **The benchmark:** 136 tasks in four domains (program analysis, graph analytics, formal reasoning, knowledge discovery), 78 recursive and 59 with an auxiliary predicate; 247 evaluation variants (§4.2, Tab. 1).
- **Systems:** GPT 5.6 Sol, Claude Opus 5, Gemini 3.7 Flash, DeepSeek V4 Pro, and DeepSeek V4 Flash in thinking and non-thinking modes, one untuned template, temperature 0, one completion; prompts give signatures or descriptions, with or without the example (§5.1). Codex CLI (with GPT 5.6 Sol) and Claude Code (with Claude Opus 5) get up to four turns with local file and shell tools, no web search; after each turn the harness returns the compile error or a bounded sample of differing tuples on the demonstration instance (§5.1).
- **Running:** Soufflé 2.5, 30 seconds per execution (§5.1). Intervals are 95% percentile [bootstrap](#/glossary/bootstrap-resampling) intervals over tasks, comparisons use a [paired](#/glossary/paired-comparison) sign-flip [permutation test](#/glossary/permutation-test) (§5.1).

## Approach

- **Construction (§4.1, Fig. 2; App. D):** programs and facts come from Soufflé, EGS, GenSynth and CodeFuse-Query (a code-analysis tool whose Gödel-language queries were rewritten in Soufflé); relations are renamed and facts regenerated, so a model "must work from the schema in the prompt"; questions are written by hand (§4.1).
- **Oracle validation (§4.3; App. G):** three mutation operators delete a rule, delete a body atom or rebind a join variable; extra variants are "selected for the reference-program mutants they distinguish" (App. D); a survivor counts as equivalent only with an explicit witness (App. G.1).
- **Analysis:** contamination is probed through the CodeFuse-Query tasks, which had no public Datalog text, and a scan for upstream predicate names (App. C.6). Symbolic baselines learn from each task's first evaluation variant (App. M).

## Results

- **Direct prompting (§6.1; zero-shot cells in Tab. 2):** the best of the 24 cells reaches 68.4% EX. On descriptions and the example, "the grid supports neither a general benefit from descriptions nor a reliable gain from the example" (§6.1).
- **Coding agents (§6.2, Tab. 3):** Codex rises from 55.9% to 82.4% EX over its matched cell and Claude Code from 52.2% to 83.8% (paired sign-flip p < .001). Claude Code tasks left with no program after the retry budget for failed sessions count as zero (§6.2).
- **Where direct prompting fails (§6.3):** of the 3,264 Direct programs, 1,036 (31.7%) fail to compile and 519 (15.9%) compile but compute the wrong relations. The largest group of compile failures is "predicate invention left incomplete", then Soufflé dialect errors, typing, and safety and stratification (§6.3; Tab. 8). Synthesizing the missing declarations "recovers only a small share of exact match" (§6.3).
- **Recursion and decomposition (§6.3; App. K):** with signatures and no example, every model is less accurate on recursive tasks and on tasks needing an auxiliary predicate, also with the other demand held fixed; across the Direct cells, auxiliary predicates mainly raise compile failures and recursion adds semantic errors. The agents "eliminate nearly all compile failures" (§7); their remaining errors are "mostly semantic" and concentrated in recursive tasks (§6.3). On the 47 tasks with both demands the agents reach 68.1% (Codex) and 74.5% (Claude Code), against 97.8% on the 46 with neither (§6.2, Fig. 4).
- **Overfitting to one instance (§6.2):** of the 128 candidates each agent returned as exact on the demonstration instance, the held-out variants reject 17 (Codex) and 14 (Claude Code).
- **Oracle strength (§4.3):** the variants kill 96.4% of 1,948 mutants, and all 71 survivors are "certified equivalent".
- **Baselines and contamination:** the symbolic synthesizers reach lower EX than the best Direct cells under "a protocol that favors them" (§6.1), but "These rows compare specifications rather than systems" (App. M, Tab. 10). The CodeFuse-Query comparison is "weak evidence either way" (App. C.6).

## Limits the authors state

- Soufflé only: "we do not measure how far the findings transfer" (§7); engines such as DDlog, Flix and Scallop differ in typing, aggregation and negation, "so a program counted as incorrect here may be well-formed elsewhere" (App. O).
- The oracle is "bounded by mutation analysis rather than proved complete" (§7); the mutations "never alter a negation, an aggregate function, or a grouping scope", and the tests "do not prove that a program passing every variant is equivalent to its reference, nor whether an independent reader finds each specification determinate" (§4.3).
- The agents get feedback and tooling together, "so their contributions are not separated" (§7).
- Outputs reproduce "only as far as the providers continue to serve the recorded builds" (App. C.3); agent results are "attributable to a provider and a requested model name, not to a verified build" (App. H.3).
- Each cell ran once (§5.1); for the agents, "a longer budget was not tested" (App. N). One demonstration instance per task cannot show how the effect scales with more examples (App. C.4).
- Gemini's output budget is shared with its hidden reasoning, and some responses "end mid-program", graded as returned (App. C.2).
- The contamination scan "cannot exclude structural recall under renamed predicates" (App. C.6). The structural splits are observational (App. K), and the difficulty axes "structural proxies rather than observed difficulty" (App. E). ProSynth's results describe its bounded hypothesis space (App. M).

## Open problems and building blocks

- **Open:** "recursive reasoning and decomposition: constructing the right fixed point and inventing the auxiliary predicates a decomposition needs" (§7). A pipeline in which "the LLM proposes candidate predicates and rules", while a Datalog engine and a symbolic component supply declarations and check safety, types, recursion and behavior on examples (App. P).
- **Released:** "The benchmark, prompt templates, evaluation harness, and scoring and analysis scripts", and the symbolic baselines as pinned submodules with build patches (Reproducibility Statement; App. H.1); the agent container's four verification checks, "released with the image definitions" (App. C.2); "the complete experiment run matrix" (App. C.3).
- **To reuse it:** Soufflé 2.5 under Python 3.10, CPU only (App. H.2); for the baselines a JDK with sbt (EGS), an [SMT solver](#/glossary/sat-and-smt-solvers) and a patched Soufflé (ProSynth), and Python with Soufflé (GenSynth) (App. H.1).

## On this site

- **Tags:** <span class="tags"><a class="tag" href="#/tags/labels">labels</a><a class="tag sub" href="#/tags/hacking-general">hacking-general</a><a class="tag sub" href="#/tags/harness-general">harness-general</a><a class="tag sub" href="#/tags/llm-method">llm-method</a></span>
