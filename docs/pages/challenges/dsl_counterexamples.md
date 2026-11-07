# Distinguishing documents for two programs in any DSL

> Given two programs in a DSL, find an input (a document, a fact set, a graph, a string) on which their results differ, small enough for a person or an LLM to read, across the family and not only in SQL.

<p class="tags"><a class="tag" href="#/tags/cex">cex</a><a class="tag" href="#/tags/dsl">dsl</a></p>

SQL's instance of keeping it small: [Minimal counterexamples](#/challenges/minimal_counterexamples); of finding one: [Query equivalence: prove or refute](#/challenges/query_equivalence).

## Challenge
A distinguishing input certifies that two programs differ, in any DSL, by running both. Most of the family's checks rest on it (ours): grading a program against a reference, refuting a port ([Porting programs between DSLs and dialects without changing their meaning](#/challenges/dsl_porting)), and showing a learner its error ([Prompt-space self-play judged by an engine](#/challenges/prompt_space_self_play)).

The challenge: one search across DSLs, with LLMs proposing inputs, the engine checking them, and inputs kept small.

## What's known
By DSL:
- **[Datalog](#/glossary/datalog):** DatalogBench grades programs on held-out variants of the facts ([DatalogBench](#/papers/li2026datalogbench "DatalogBench: Evaluating Large Language Models on Text-to-Datalog Synthesis (2026)") §3) and bounds that oracle by how many mutants of the reference programs (three operators) the variants separate (§4.3); extra variants were chosen to separate mutants (App.
- **Regular expressions:** an automaton gives strings on which a guess and the target differ; grouped into character-class paths, they beat single strings as feedback for an LLM learner in the authors' agentic workflow ([Counterexample Guided Learning in…](#/papers/liu2026cegl "Counterexample Guided Learning in the Large using Reasoning Agents (2026)") §4, §5.5).
- **Cypher:** Graphiti checks a Cypher query against a SQL one by translating it into SQL, and turns a bounded SQL checker's relational counterexample into a matching graph ([Graphiti](#/papers/he2025graphiti "Graphiti: Bridging Graph and Relational Database Queries (2025)") §2; §6.1, App. D); in a hand-checked sample it missed some wrong GPT translations within its time limit (§6.1).
- **SQL:** [Minimal counterexamples](#/challenges/minimal_counterexamples), [Query equivalence: prove or refute](#/challenges/query_equivalence).
- **Beyond DSLs, an LLM proposer:** ExPairT asks an LLM for an input on which two candidate programs differ, kept only if running both confirms it ([ExPairT-LLM](#/papers/yuviler2025expairt "ExPairT-LLM: Exact Learning for LLM Code Selection by Pairwise Queries (2026)") § "Pseudocode"). Its authors measure how often the LLM returns one for a correct and an incorrect program (§ "Guarantees"), but not against random or grammar-based generators (ours).
- **Beyond DSLs, keeping it small:** ReduceFix has an LLM write a delta-debugging script that shrinks a failing input while a buggy and a reference program still differ ([Input Reduction Enhanced LLM-based…](#/papers/yang2025reducefix "Input Reduction Enhanced LLM-based Program Repair (2025)") §3.3); on their contest benchmark its authors report more successful reductions than [delta debugging](#/glossary/delta-debugging) or the LLM alone (§5.2).

Still open (ours): each DSL method above rests on one DSL's solver, checker or benchmark; a search judged by each DSL's engine would need no per-DSL solver.

## Why it matters
- **Every evidence-only check gets stronger** with inputs separating more wrong programs (ours; [Weak checkers get exploited](#/challenges/weak_checker_exploitation)).
- **Feedback a model can use:** a small input showing the error is what a repair step reads ([Repairing and rewriting DSL programs with a certified result](#/challenges/certified_dsl_repair); ours).

**Size of the gain:** enabler, our estimate. It lifts the share of known-different pairs separated, in the checks of [Checking a program written from English, in any DSL](#/challenges/dsl_intent_verification), [Porting programs between DSLs and dialects without changing their meaning](#/challenges/dsl_porting) and [Repairing and rewriting DSL programs with a certified result](#/challenges/certified_dsl_repair). The reason: outside a decision procedure's fragment each checks agreement by running both programs, so it is only as strong as the search for separating inputs.

## Why it's hard
- **Not finding one proves nothing:** outside a decision procedure's or prover's fragment, a failed search is not agreement.
- **Inputs must be valid:** a document, graph or fact set must fit the DSL's data model and any schema, or both programs fail for the same irrelevant reason (ours); plain delta debugging often makes "invalid format attempts" on contest inputs ([Input Reduction Enhanced LLM-based…](#/papers/yang2025reducefix "Input Reduction Enhanced LLM-based Program Repair (2025)") §5.2).
- **Small and readable compete with finding one at all:** the separating input may need size, as recursion in Datalog does (ours).

## Verifiable signal
Running both programs checks an input; a difference certifies. Measures: the share of known-different pairs separated, input size and cost per pair, against random and grammar-based generators.

