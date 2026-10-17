# Distinguishing documents for two programs in any DSL

> Given two programs in a DSL, find an input (a document, a fact set, a graph, a string) on which their results differ, small enough for a person or an LLM to read, across the family and not only in SQL.

<p class="tags"><a class="tag" href="#/tags/cex">cex</a><a class="tag" href="#/tags/general">general</a></p>

The SQL instance: [Minimal counterexamples](#/challenges/minimal_counterexamples).

## Challenge
A distinguishing input certifies that two programs differ, in any DSL, by running both. It is the [certificate](#/glossary/certificate) most of the family's checks rest on: grading a program against a reference, refuting a port ([Porting programs between DSLs and dialects without changing their meaning](#/challenges/dsl_porting)), and telling a learner what it got wrong ([Prompt-space self-play judged by an engine](#/challenges/prompt_space_self_play)).

The challenge: a search for distinguishing inputs that works across DSLs, with LLMs proposing inputs and the engine checking them, and the inputs kept small.

## What's known
How such inputs are found differs by DSL:
- **XPath:** on a navigational fragment a solver decides equivalence and can "generate an example (or counter-example) XML tree" ([XML Static Analyzer User Manual](#/papers/geneves2008analyzer "XML Static Analyzer User Manual (2008)") §4); outside it a document must be searched for.
- **[Datalog](#/glossary/datalog):** DatalogBench grades programs on held-out variants of the facts and validates that oracle by mutation ([DatalogBench](#/papers/li2026datalogbench "DatalogBench: Evaluating Large Language Models on Text-to-Datalog Synthesis (2026)") §4.3), which measures how often the variants separate a wrong program from the right one.
- **Regular expressions:** an automaton gives strings on which a guess and the target differ; fed to an LLM learner as character-class paths, they helped more than single strings ([Counterexample Guided Learning in…](#/papers/liu2026cegl "Counterexample Guided Learning in the Large using Reasoning Agents (2026)") §4, §5.5).
- **Cypher:** Graphiti translates Cypher into SQL, and a bounded SQL checker returns a counterexample holding the same data as a relational database and as a graph ([Graphiti](#/papers/he2025graphiti "Graphiti: Bridging Graph and Relational Database Queries (2025)") §6.1, App. D); in its time limit it missed some wrong GPT translations (§6.1).
- **SQL:** the most developed case ([Minimal counterexamples](#/challenges/minimal_counterexamples), [Query equivalence: prove or refute](#/challenges/query_equivalence)).

Still open (ours): one search, guided by an LLM and judged by each DSL's engine, that works across the family and keeps its inputs small; each method above rests on one DSL's solver, checker or benchmark.

## Why it matters
- **Every evidence-only check gets stronger** with inputs that separate more wrong programs ([Weak checkers get exploited](#/challenges/weak_checker_exploitation)).
- **Feedback a model can use:** a small input that shows the error is what a repair step reads ([Repairing and rewriting DSL programs with a certified result](#/challenges/certified_dsl_repair); ours).
- **One method for the family:** search guided by an LLM, judged by each DSL's engine, needs no per-DSL solver (ours).

**Size of the gain:** enabler, our estimate. The quantity it lifts is the share of known-different pairs separated, in the checks of [Checking a program written from English, in any DSL](#/challenges/dsl_intent_verification), [Porting programs between DSLs and dialects without changing their meaning](#/challenges/dsl_porting) and [Repairing and rewriting DSL programs with a certified result](#/challenges/certified_dsl_repair). The reason: each of them decides agreement outside a decision procedure's fragment by running both programs on inputs, so its check is only as strong as the search that finds separating ones.

## Why it's hard
- **Not finding one proves nothing:** a failed search is not agreement, outside the fragments a decision procedure covers.
- **Inputs must be valid:** a document, graph or fact set must satisfy the DSL's data model and any schema, or both programs fail for the same irrelevant reason (ours).
- **Small and readable compete with finding one at all:** the separating input may need size, as recursion in Datalog does (ours).

## Verifiable signal
Every input is checked by running both programs on it; a difference certifies. The measures are the share of known-different pairs separated, the input's size, and the cost per pair, against random and grammar-based generators.

