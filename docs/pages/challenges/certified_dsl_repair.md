# Repairing and rewriting DSL programs with a certified result

> Change a DSL program (fix it, make it safe, make it shorter or faster) and certify the result: unchanged meaning where that is the aim, or the reference's meaning where the program was wrong.

<p class="tags"><a class="tag" href="#/tags/dsl">dsl</a></p>

The SQL instance: [Verified query speedups](#/challenges/verified_query_speedup).

## Challenge
Three tasks share one shape: the LLM changes a program, and a check says whether the change kept or reached the meaning wanted. The tasks: repair a wrong program; give a program a property while keeping its meaning, for example a regular expression safe from catastrophic backtracking; make it shorter or faster.

The challenge: repair and rewriting by compact models across the family, with the result certified where the DSL has a decision procedure and backed by distinguishing inputs elsewhere ([Distinguishing documents for two programs in any DSL](#/challenges/dsl_counterexamples)).

## What's known
- **Repair a wrong program:** in [Datalog](#/glossary/datalog), the authors of [DatalogBench](#/papers/li2026datalogbench "DatalogBench: Evaluating Large Language Models on Text-to-Datalog Synthesis (2026)") report that [coding agents](#/glossary/coding-agent) remove most compile failures but fewer semantic errors, so "what remains is therefore mostly semantic, and it concentrates in recursive tasks" (§6.3).
- **Give a program a property while keeping its meaning:** for [safety](#/glossary/safety-datalog-rules) from catastrophic backtracking in regular expressions, LLMs shown the part a rule-based analyzer flags repair more such regexes than a rule-based tool, on average over the models tried, by the authors' checks: a detector's timeout for safety, "empirical, not a formal, provable guarantee" in their words, and sampled strings for meaning ([LRR (Localized Regex Repair)](#/papers/sung2025lrr "Repairing Regex Vulnerabilities via Localization-Guided Instructions (2026)") Tab. 1, Limitations).
- **Make it shorter or faster:** for regular expressions a tool already solves most minimization instances; for [XPath](#/glossary/xpath) on a navigational fragment, containment, and so equivalence, is decided ([Efficient Static Analysis of…](#/papers/geneves2007efficient "Efficient Static Analysis of XML Paths and Types (2007)") §8); for answer set programs, anthem 2.0 verifies with a first-order prover that a primes program is externally equivalent to one its authors call "more efficient" on every input its user guide permits, given a hand-written proof outline ([anthem 2.0](#/papers/fandinno2025anthem "anthem 2.0: Automated Reasoning for Answer Set Programming (2025)") §4.2, §5.3); for SQL, see [Verified query speedups](#/challenges/verified_query_speedup).

Still open (ours): repair and rewriting by compact models with a certified result; LRR checks safety by a detector's timeout and meaning by sampled strings, and semantic Datalog errors remain after coding agents' repairs.

## Why it matters
- **Semantic errors are what is left** once compile errors are handled, in the one DSL where this was measured ([DatalogBench](#/papers/li2026datalogbench "DatalogBench: Evaluating Large Language Models on Text-to-Datalog Synthesis (2026)") §6.3).
- **The rows give exact rewards:** a repair or rewrite either passes the agreement check or not, a training and search signal ([Prompt-space self-play judged by an engine](#/challenges/prompt_space_self_play); ours).

**Size of the gain:** incremental, our estimate. It is measured as the share of wrong or unsafe programs repaired with a certified result where a decision procedure decides meaning (regular expressions, XPath's navigational fragment: [A gym of DSL tasks with answer keys made by code](#/challenges/dsl_gym) § Why it's hard). The reason: LLMs already repair unsafe regular expressions without a [certificate](#/glossary/certificate) (§ What's known), so certifying raises an existing number; repairs of semantic Datalog errors, which now need a person, would be a step change, but a fix there passes only on evidence, since DatalogBench's oracle "is bounded by mutation analysis rather than proved complete" ([DatalogBench](#/papers/li2026datalogbench "DatalogBench: Evaluating Large Language Models on Text-to-Datalog Synthesis (2026)") §7; datalog_semantic_repair).

## Why it's hard
- **Certification needs a decision procedure or a proof:** the first covers only some DSLs and fragments ([A gym of DSL tasks with answer keys made by code](#/challenges/dsl_gym) § Why it's hard); elsewhere a repair is evidence only unless a prover finds a proof, here with a hand-written outline ([anthem 2.0](#/papers/fandinno2025anthem "anthem 2.0: Automated Reasoning for Answer Set Programming (2025)") §4.2, §5.3).
- ReDoS detectors "exhibit greater disagreement than agreement", and a rule-based repair tool's fixes are "not always semantically equivalent" to the original ([An Empirical Analysis of…](#/papers/mahassadi2026redos "An Empirical Analysis of ReDoS Vulnerabilities and ReDoS Detection Tools (2026)") §5.2, §5.4).
- **Recursion hides errors:** the separating input for a wrong recursive rule may need depth (ours; [Distinguishing documents for two programs in any DSL](#/challenges/dsl_counterexamples)).

## Verifiable signal
For a meaning-preserving change: agreement decided by the DSL's decision procedure where one exists, and no distinguishing input found by a set search elsewhere, reported as evidence. For a repair: agreement with the reference on the same terms. The property is checked by its own checker (a backtracking analyzer, measured time, length); for patterns with lookahead, LARA's authors state that its automaton keeps the pattern's matching-cost bound ([LARA (Lookahead Automata ReDoS Analyzer)](#/papers/wang2026lara "LARA: Static ReDoS Detection for Regular Expressions with Lookahead via Matching Automata (2026)") Thm. 3.3, PDF p. 5; limits: certified_regex_repair).

