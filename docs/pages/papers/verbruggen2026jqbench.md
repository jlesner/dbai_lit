# jqBench: A Benchmark for Reading and Editing JSON from Natural Language and/or Examples

**jqBench** · ICLR 2026

Read: [PDF](https://openreview.net/pdf?id=VStKtgGXUc)  
Code: [jqBench](https://github.com/PidgeyUsedGust/jqBench)

<p class="notice">A summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- A benchmark of writing jq expressions (jq: a command-line language that queries and transforms JSON) from English and/or input–output examples, in two parts: jqStack, distilled from Stack Overflow questions tagged jq, and jqSpider, adapted from Spider's text-to-SQL tasks with JSON databases and JSON Schemas; LLMs are scored with automatic compile, run and test feedback, with a code-running tool instead, with documentation tools, writing Python instead of jq, and from examples alone (abstract; §1, PDF pp. 1–2; §3.2–3.3, PDF pp. 6–9).
- jqStack: GPT-5 extracts an intent, candidate expressions and examples from each discussion, an agent with tools to add and run tests turns them into tests, and tasks that GPT-5 or Opus 4.1 solves with one prompt at temperature 0 are filtered out (§2.1.1, PDF p. 3); jqSpider: an LLM converts each SQL schema into a JSON Schema, each database into JSON and each SQL query into a jq expression, with the SQL query's output on the original database as the test (§2.2.1, PDF p. 5); all but one of a task's tests are shown as examples (§3.1, PDF p. 6), with at most eight iterations at temperature 0 (§3.2, PDF p. 6).
- A text-to-DSL benchmark for a JSON query language whose gold is checked by execution (jqSpider's against the source SQL query's output, §2.2.1), and a measurement of LLMs on a language the authors call "relatively uncommon" (§1, PDF p. 2), with jq against Python and documentation access as arms: the authors report that Opus 4.1's value match on jqStack falls from 76% to 31% when documentation tools are added to the feedback loop, which they attribute to "getting stuck in a loop of requesting documentation" (§3.3 "The documentation trap", PDF p. 9; Tab. 1, PDF p. 7). The documentation arm bears on [Learning a rarely seen DSL in prompts](#/challenges/unseen_dsl_in_prompts).

## In plain words

JSON has become "the de facto standard for structured data exchange" (§1, PDF p. 1), and jq is a small command-line language for querying and reshaping it. The authors write that "there is no benchmark that jointly captures natural-language prompts and executable JSON queries and transformations" (§1, PDF p. 2). They build one, jqBench, automatically: one part from Stack Overflow questions about jq, one from an existing English-to-SQL dataset whose databases they turn into JSON. A model gets an English request, input–output examples, or both, and writes a jq program that is run and checked. When errors and test results are fed back automatically, the best model, Opus 4.1, scores 76% on the Stack Overflow part and 81% on the other (abstract, PDF p. 1). They also report (abstract, PDF p. 1) that giving models the jq documentation "surprisingly does not help", and that the automatic feedback is "crucial". By their account, jq trails Python on the same tasks. They present a new benchmark, its construction pipeline and lessons from baseline experiments (§1, PDF p. 2).

## Background and terms

**Terms to know:** [domain-specific language (DSL)](#/glossary/domain-specific-language-dsl) · [low-resource programming language](#/glossary/low-resource-programming-language) (the paper's "low-resource language setting", §6, PDF p. 10) · [program synthesis](#/glossary/program-synthesis) (its programming-by-example case) · [text-to-SQL](#/glossary/text-to-sql) · [self-correction](#/glossary/self-correction) · [tool calling (function calling)](#/glossary/tool-calling-function-calling) · [retrieval-augmented generation (RAG)](#/glossary/retrieval-augmented-generation-rag) · [data contamination](#/glossary/data-contamination) · [JSON Schema](#/glossary/json-schema) (used undefined, §2.2.1, PDF p. 5)

**The paper's own terms:**
- **jq**: a language for querying and transforming JSON, "first and foremost a CLI tool" (§4.1, PDF p. 10); programs chain steps with the pipe `|`, whose count the paper uses as a complexity measure (§2.1.2, PDF p. 4).
- **jqStack**, **jqSpider**: the two collections making up jqBench (§2, PDF p. 2). A jqStack task: an instruction, two or more inputs, one or more jq expressions (§2.1, PDF p. 3); a jqSpider task: an instruction, a JSON Schema, a jq expression and the dataset (§2.2, PDF p. 5).
- **Implicit mode** (✓ in the tables): the default setting, based on SELF-DEBUG (an LLM debugging its own program from execution results); compilation feedback is always given, execution feedback when inputs are available, and test results when outputs are available (§3.2, PDF p. 6).
- **run_code, search_docs, print_docs**: tools that run an expression on a JSON input the model supplies, search a "(parsed) version of the documentation" by keyword, and print its sections (§3.2, PDF p. 6).
- **c?, e?, v?**: compile, execution and value, the tables' performance columns (Tab. 1, PDF p. 7); value match (v?) is the headline score; v1 is "the value match after iteration 1" (§3.3, PDF p. 8). As jq's Python binding wraps results in a list, a match against the expected output in a list also counts, "(or vice versa)"; on jqSpider, record keys are ignored, and order unless the SQL query has ORDER BY (§3.1, PDF p. 6).
- **Task types**: subset, superset, extract, augment, transform, complex: how the output relates to the input (§2.1.2, PDF p. 4).
- **Programming by example (PBE)**: learning "a program p such that p(i) = o for all example pairs (i, o)" (§3.3, PDF p. 9).

**Builds on:**
- SELF-DEBUG (Chen et al., 2023; [Self-Debugging](#/papers/chen2023selfdebug "Teaching Large Language Models to Self-Debug (2023)")), the basis of implicit mode (§3.2, PDF p. 6).
- The repaired Spider dataset (Yang et al., 2025; [SQLDriller](#/papers/yang2025sqldriller "Automated Validating and Fixing of Text-to-SQL Translation with Execution Consistency (2025)")), a corrected Spider text-to-SQL benchmark ([Spider](#/papers/yu2018spider "Spider: A Large-Scale Human-Labeled Dataset for Complex and Cross-Domain Semantic Parsing and Text-to-SQL Task (2018)")), jqSpider's source (§2.2.1, PDF p. 5).
- The closest benchmarks: DocSpider (Özer et al., 2025), Spider converted to MongoDB queries, and JSONSchemaBench (Geng et al., 2025), generating JSON that complies with a schema (§4.1, PDF pp. 9–10).

## Problem and setting

How well do LLMs write jq expressions from English and/or examples, and how do feedback, tools, documentation, the target language and the English instruction change that (§1, PDF p. 2)?

- **Input and checking:** one JSON input per task (§5, PDF p. 10); expressions run through the jq Python binding; all but one of a task's tests are shown as examples (§3.1, PDF p. 6). On jqSpider, when the file is too large, only the JSON Schema is given (§3.2, PDF p. 6).
- **Models:** opus-4.1, gpt-5, gpt-5-mini, gpt-4.1, gpt-4.1-mini and phi-4 (Tabs. 1–2, PDF p. 7); every setup runs for at most eight iterations at temperature 0 (§3.2, PDF p. 6).
- **Python arm:** the model returns a Python function of the JSON object (§3.2, PDF p. 6).

## Approach

- **jqStack (§2.1.1, PDF p. 3).** From all Stack Overflow posts tagged jq, GPT-5 extracts quotes, an intent, candidate jq expressions and, optionally, input–output examples. An agent ("GPT-5 into Opus 4.1") with tools to add a named test and to run an expression on all tests writes tests and a working expression (Fig. 1); all candidates are then run on the final tests. A filter drops tasks that one prompt at temperature 0 solves, with GPT-5, then Opus 4.1. A manual review of never-solved tasks often fixed ambiguity and skipped other problems "as they became too trivial with proper specification".
- **jqStack analysis (§2.1.2, PDF p. 4).** Tasks that change the structure (extract, complex) are "notably harder, as more of them are kept" (Fig. 2); "it is harder to create more complicated benchmarks, even in the presence of candidate solutions" (Fig. 3).
- **jqSpider (§2.2.1, Fig. 6, PDF p. 5).** An LLM converts each SQL schema into a nested JSON Schema, with validation feedback from the `jsonschema` package; writes a Python function turning a per-table JSON file into a database fitting the schema; and, given the question, the SQL query, the schema and the SQL output on the original database, writes a jq expression, the SQL output serving as the test; both steps get compilation and execution feedback. More tables go with deeper nesting, both are "indicators of lower conversion rate", and more JOINs "correspond to more pipe characters" (§2.2.2, PDF p. 5; Figs. 7–9, PDF p. 6).
- **Settings (§3.2, PDF p. 6; Tabs. 1–3, PDF pp. 7–8):** implicit mode; run_code instead; implicit mode plus documentation tools; Python; examples without English.

## Results

- **Headline (abstract, PDF p. 1; Tabs. 1–2, PDF p. 7):** with implicit feedback, Opus 4.1 reaches 76% value match on jqStack and 81% on jqSpider. jqStack shows "a wider spread of model performance", jqSpider "strikingly low variability"; jqStack "relies more on deep knowledge of jq", jqSpider on longer chains of `map` and `select` (jq's apply-to-each-element and filter functions) (§3.3, PDF p. 7).
- **jq against Python (§3.3, PDF p. 7; Tab. 1):** on jqStack, Python to jq drops Phi 4 from 54% to 10% and GPT-5 from 82% to 68%: "models often understand the task, but some do not know how to express a solution using jq".
- **Tools instead of feedback (§3.3 "Freedom to test is fatal", PDF p. 8):** moving to run_code gives "−53% on GPT-5 and even −22% on Opus 4.1". Named reasons: no tool calls, poor use of the examples, ignored wrong outputs, badly serialized or made-up inputs.
- **Feedback over iterations (§3.3, Fig. 11, PDF p. 8):** all models need "a significant amount of feedback", whose effect diminishes after 4 iterations (Opus 4.1) or 7–8 (others); stagnation comes from the main failure mode, "overfitting on the examples".
- **Complexity (Fig. 10, PDF p. 8; §3.3, PDF pp. 8–9):** only the number of function definitions affects Opus 4.1; "Function rarity is not a problem".
- **Contamination (§3.3, Fig. 13, PDF p. 9):** harder-to-create tasks are harder to solve; apart from completely changed queries, distance from the Stack Overflow candidate shows no relation, "indicating that contamination is not an issue".
- **Documentation (§3.3 "The documentation trap", PDF p. 9; Tab. 1):** Opus 4.1 falls from 76% to 31% with documentation tools, mainly by "getting stuck in a loop of requesting documentation", requesting it several times as often as the next most eager model, GPT-5 mini. "After a certain level of proficiency", SELF-DEBUG pays off more than retrieval-augmented generation over the documentation.
- **Examples only (§3.3 "JSON by example", PDF p. 9; Tab. 3, PDF p. 8):** without the English instruction, value match goes 76% → 71% (Opus 4.1), 68% → 63% (GPT-5) and 59% → 53% (GPT-5 mini), a decrease the authors call significant, while concluding that jqStack "poses an interesting PBE benchmark".

## Limits the authors state

- "We currently supports only a single JSON input per task, and do not handle multiple-input or multi-file jq programs, though future extensions could relax this restriction" (§5, PDF p. 10).
- The automatic construction, "which relies on an LLM to generate a solution from a rich input signal, may have limited the number of challenging tasks in the dataset" (§5, PDF p. 10).
- "Based on the English data sources, JQ B ENCH is available in English only" (§5, PDF p. 10).
- Tasks never solved were "often underspecified", and the conversion agent could brute-force them because it saw all examples and a target solution (§2.1.1 "Review", PDF p. 3).

## Open problems and building blocks

  - "We can expand any remaining failed automatic conversions with human annotations and stronger models" (§5, PDF p. 10).
  - Phi 4's struggle to generate queries that compile indicates "a promising direction for fine-tuning on the 13K filtered cases" (§3.3, PDF p. 8).
  - The benchmark "will enable future research in execution-guided decoding, exploratory data analysis, language novelty, and tool proficiency" (execution-guided decoding: running partial programs during generation to prune faulty ones) (§6, PDF p. 10).
- **Released:** the dataset, evaluation scripts and training data (§1, PDF p. 2): "13K converted but filtered cases for training purposes" (abstract, PDF p. 1) and "3641 easier tasks and their solutions" (§1, PDF p. 2); the generation pipeline and "all intermediate artifacts, including candidates without a successful conversion and cached model responses" (§2, PDF pp. 2–3); the parsed documentation (§3.2, PDF p. 6).
- **To reuse it:** the jq Python binding (§3.1, PDF p. 6); generation used GPT-4.1, GPT-5 and Claude Opus 4.6 (§2, PDF p. 2). No hardware, run time or cost is stated.
- **Beyond its domain:** jqBench "can be used to evaluate other programming languages that query and/or transform JSON" (abstract, PDF p. 1).

## On this site

- **Discussed in:** [Learning a rarely seen DSL in prompts](#/challenges/unseen_dsl_in_prompts)
- **Tags:** <span class="tags"><a class="tag" href="#/tags/benchmark">benchmark</a><a class="tag" href="#/tags/compact">compact</a><a class="tag" href="#/tags/harness">harness</a><a class="tag" href="#/tags/labels">labels</a><a class="tag" href="#/tags/nl2dsl">nl2dsl</a><a class="tag" href="#/tags/rarelang">rarelang</a><a class="tag sub" href="#/tags/dialect-translate">dialect-translate</a><a class="tag sub" href="#/tags/dsl-path">dsl-path</a><a class="tag sub" href="#/tags/llm-gen">llm-gen</a></span>
