# A gym of DSL tasks with answer keys made by code

> Task families in several DSLs (predict a program's output, write a program from examples or from English, decide whether two programs agree and show where they don't) whose answer keys come from the engine, with a size setting on two axes, and checks whose false accepts are measured.

<p class="tags"><a class="tag" href="#/tags/general">general</a><a class="tag" href="#/tags/labels">labels</a></p>

## Challenge
Every claim about DSL use rests on tasks whose answers a program checks.
- **Families that differ in what they produce:** an output for a given program and input; a program from examples; a program from an English question; a verdict on whether two programs agree, with a distinguishing input when they don't.
- **A size setting on two axes:** the data (rows, nodes, events) and the composition (steps, predicates, joins, rule exceptions), so that success can be plotted against size ([Reliability that holds with size, by handing the procedure to an engine](#/challenges/engine_offloading_with_size)).
- **Checks with measured false accepts:** each check rejects planted wrong answers and degenerate ones (§ 8, T8).

Some DSLs already have families that pass those gates: regular expressions and recurrence rules; SQL is the yardstick there. AutoScraper's web-extraction evaluation counts a generated XPath as correct when its precision and recall both equal 1 ([AutoScraper](#/papers/huang2024autoscraper "AutoScraper: A Progressive Understanding Web Agent for Web Scraper Generation (2024)") §3.3), a check by results rather than by matching a reference path (ours). For OCL and Alloy, whose constraints can't always be run, one study scores correctness with an LLM judge it validated against one author's labels ([A framework for assessing…](#/papers/delgado2026constraintdsl "A framework for assessing the capabilities of code generation of constraint domain-specific languages with large language models (2026)") §1, §5.1, Tab. 2; LLM as judge), the kind of check that keys made by code replace (ours).

## Why it matters
- **Everything else is scored here:** the loop, the size curves and the control all depend on it (ours).
- **It is the prompt-only testbed the user's purposes list**, serving a methods paper on compact models across several testbeds and a public benchmark suite.
- **Fresh instances in any number:** generated tasks keep appearing after any training cutoff (ours).

**Size of the gain:** enabler, for [Reliability that holds with size, by handing the procedure to an engine](#/challenges/engine_offloading_with_size), [Prompt-space self-play judged by an engine](#/challenges/prompt_space_self_play) and [Learning a rarely seen DSL in prompts](#/challenges/unseen_dsl_in_prompts). Our estimate.

## Verifiable signal
The gym is itself checked: for each family, the share of planted wrong and degenerate answers its check accepts, and for each generated instance, that the engine's key is unique under the family's rule ([Benchmarks with checkable ground truth](#/challenges/checkable_benchmark_ground_truth)).

