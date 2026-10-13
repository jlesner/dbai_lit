# Learning a rarely seen DSL in prompts

> Can a compact model learn a DSL that is rare in its training data, K through the open-source ngn/k engine, from the language's documentation and its engine alone, with what it learns kept in prompts?

<p class="tags"><a class="tag" href="#/tags/compact">compact</a><a class="tag" href="#/tags/general">general</a></p>

## Challenge
Mainstream DSLs (SQL, regular expressions, XPath) are common in training data, so a gain from a learning loop on them can't be told apart from a model recalling what it already half knew. A language the model has barely seen separates the two: if the loop of [Prompt-space self-play judged by an engine](#/challenges/prompt_space_self_play) lifts a compact model on K about as much as on XPath, it is teaching; if it lifts only XPath, it is reminding (ours). K has open-source engines (ngn/k is one) and many incompatible dialects, so the model must learn this one from its documentation and from what the engine accepts (ours).

What is known points two ways. In weights, low-resource programming languages (Julia, Lua, OCaml, R, Racket) have been taught by fine-tuning on code that a code LLM translated from Python, kept only when tests compiled from the source language passed: "a training corpus in the target low-resource language where all items have been validated with test cases" ([MultiPL-T](#/papers/cassano2023multiplt "Knowledge Transfer from High-Resource to Low-Resource Programming Languages for Code LLMs (2024)") abstract). In prompts, a method that hands the model a DSL's grammar "did not yield any improvements for DSLs that were likely to have been frequently encountered during pretraining (e.g., regular expressions, SQL)" ([Grammar Prompting](#/papers/wang2023grammar "Grammar Prompting for Domain-Specific Language Generation with Large Language Models (2023)") §5), which is why gains on mainstream DSLs say little about learning (ours). A short search on 2026-10-13 found no work that teaches a compact model a rare DSL through prompts alone with an engine, not a person, checking the examples it learns from.

## Why it matters
- **It is the control of the research path**: without it, a gain on XPath or SQL could be recall.
- **It tests the general claim:** any language with an engine could become a tool for a compact model, without labelled data and without training (ours).
- **The language has users:** K's descendant q is the query language of kdb+, used for time-series data; whether skills learned on ngn/k carry over to q is open (ours).

**Size of the gain:** enabler: it decides whether the gains measured in [Reliability that holds with size, by handing the procedure to an engine](#/challenges/engine_offloading_with_size) mean learning. Our estimate.

## Verifiable signal
ngn/k runs every program; the task families and size settings are the same as for the mainstream DSL ([A gym of DSL tasks with answer keys made by code](#/challenges/dsl_gym)), so the two learning curves are compared directly: held-out success with and without the loop's skill document and example library, by model size.

