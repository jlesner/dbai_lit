# Repairing and rewriting DSL programs with a certified result

> Change a DSL program (fix it, make it safe, make it shorter or faster) and certify the result: unchanged meaning where that is the aim, or the reference's meaning where the program was wrong.

<p class="tags"><a class="tag" href="#/tags/general">general</a></p>

The SQL instance: [Verified query speedups](#/challenges/verified_query_speedup).

## Challenge
Three tasks share one shape: the LLM changes a program, and a check says whether the change kept or reached the meaning wanted. The tasks: repair a wrong program; give a program a property while keeping its meaning, for example a regular expression safe from catastrophic backtracking; make it shorter or faster.

The challenge: repair and rewriting by compact models across the family, with the result certified where the DSL has a decision procedure and backed by distinguishing inputs elsewhere ([Distinguishing documents for two programs in any DSL](#/challenges/dsl_counterexamples)).

## What's known
- **Repair a wrong program:** in [Datalog](#/glossary/datalog), the authors of [DatalogBench](#/papers/li2026datalogbench "DatalogBench: Evaluating Large Language Models on Text-to-Datalog Synthesis (2026)") report that coding agents remove most compile failures but fewer semantic errors, so "what remains is therefore mostly semantic, and it concentrates in recursive tasks" (§6.3).
- **Give a program a property while keeping its meaning:** for safety from catastrophic backtracking in regular expressions, LLMs shown the part a rule-based analyzer flags repair more such regexes than a rule-based tool, on average over the models tried, by the authors' checks: a detector's timeout for safety, "empirical, not a formal, provable guarantee" in their words, and sampled strings for meaning ([LRR (Localized Regex Repair)](#/papers/sung2025lrr "Repairing Regex Vulnerabilities via Localization-Guided Instructions (2026)") Tab. 1, Limitations).
- **Make it shorter or faster:** for regular expressions a tool already solves most minimization instances; for XPath on a navigational fragment, containment, and so equivalence, is decided ([Efficient Static Analysis of…](#/papers/geneves2007efficient "Efficient Static Analysis of XML Paths and Types (2007)") §8); for SQL, see [Verified query speedups](#/challenges/verified_query_speedup).

Still open (ours): repair and rewriting by compact models with a certified result; LRR checks safety by a detector's timeout and meaning by sampled strings, and semantic Datalog errors remain after coding agents' repairs.

## Why it matters
- **Semantic errors are what is left** once compile errors are handled, in the one DSL where this was measured ([DatalogBench](#/papers/li2026datalogbench "DatalogBench: Evaluating Large Language Models on Text-to-Datalog Synthesis (2026)") §6.3).
- **The rows give exact rewards:** a repair or rewrite either passes the agreement check or not, a training and search signal ([Prompt-space self-play judged by an engine](#/challenges/prompt_space_self_play); ours).

**Size of the gain:** incremental, our estimate. It is measured as the share of wrong or unsafe programs repaired with a certified result where a decision procedure decides meaning (regular expressions, XPath's navigational fragment: [A gym of DSL tasks with answer keys made by code](#/challenges/dsl_gym) § Why it's hard). The reason: LLMs already repair unsafe regular expressions without a [certificate](#/glossary/certificate) (§ What's known), so certifying raises an existing number; repairs of semantic Datalog errors, which now need a person, would be a step change, but a fix there passes only on evidence, since DatalogBench's oracle "is bounded by mutation analysis rather than proved complete" ([DatalogBench](#/papers/li2026datalogbench "DatalogBench: Evaluating Large Language Models on Text-to-Datalog Synthesis (2026)") §7; datalog_semantic_repair).

## Why it's hard
- **Certification needs a decision procedure,** which covers only some DSLs and fragments ([A gym of DSL tasks with answer keys made by code](#/challenges/dsl_gym) § Why it's hard); elsewhere a repair is evidence only.
- **Recursion hides errors:** the separating input for a wrong recursive rule may need depth (ours; [Distinguishing documents for two programs in any DSL](#/challenges/dsl_counterexamples)).

## Verifiable signal
For a meaning-preserving change: agreement decided by the DSL's decision procedure where one exists, and no distinguishing input found by a set search elsewhere, reported as evidence. For a repair: agreement with the reference on the same terms. The property is checked by its own checker (a backtracking analyzer, measured time, length).

