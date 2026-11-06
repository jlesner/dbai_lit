# Porting programs between DSLs and dialects without changing their meaning

> Port a program to another dialect or DSL (Cypher to SQL/PGQ, Soufflé to clingo, PCRE to ECMAScript) and show that its meaning didn't change, when engines themselves disagree silently on what the source means.

<p class="tags"><a class="tag" href="#/tags/dialect">dialect</a><a class="tag" href="#/tags/dsl">dsl</a></p>

The SQL instances: [SQL dialect translation](#/challenges/dialect_translation), [Telling bad translations from legitimate engine differences](#/challenges/bad_translation_detection).

## Challenge
Porting is a task DSL users hand to LLMs, and its check is as strong as the agreement check between the old program and the new (§ One loop, both directions, the *port* row).

The challenge: ports between DSLs and dialects whose agreement is checked by running both sides on documents that separate them, with the engines' own disagreements told apart from the port's errors.

## What's known
Outside SQL, ports go wrong and engines often differ:
- **Graph patterns:** on path patterns whose meaning GQL and SQL/PGQ share, the authors of [Same Pattern](#/papers/mandarapu2026divergence "Same Pattern, Different Answer: A Reference Semantics and Divergence Map for GQL and SQL/PGQ Path Patterns (2026)") report that most disagreements among the engines they measured are silent: the query runs and answers differently, with no error (abstract, §5). They split divergences into documented language differences and departures from the standard (§6). For SQL → Cypher, Graphiti refutes some of GPT's ports and some experts' ([Graphiti](#/papers/he2025graphiti "Graphiti: Bridging Graph and Relational Database Queries (2025)") §6.1). GQLBench's rule-based SQL → Cypher and NebulaGraph GQL translator is checked by execution on BIRD dev only, without queries such as LIMIT without ORDER BY, and a human audit finds rare divergences in non-standard joins ([GQLBench](#/papers/su2026gqlbench "GQLBench: A Large-Scale Cross-Domain, Cross-Dialect Benchmark for NL2GQL (2026)") §4.2, App. D.2.4, PDF pp. 4–5, 13–14).
- **[Knowledge graphs](#/glossary/knowledge-graph):** a rule-based SPARQL → Cypher translator emits ports that fail or run with wrong values or row counts ([Spider4SSC & S2CLite](#/papers/vejvar2025spider4ssc "Spider4SSC \& S2CLite: A text-to-multi-query-language dataset using lightweight ontology-agnostic SPARQL to Cypher parser (2025)") Tab. 8), and the paper's result check counts two empty results as a match and 0 as null everywhere (App. H.2); a benchmark runs only the Cypher of its GQL and SQL/PGQ ports, then audits a sample ([Text2GraphQuery-Bench](#/papers/lyu2026text2graphquery "Text2GraphQuery-Bench: A Text to Graph Query Benchmark (2026)") §4.3–4.4).
- **[Datalog](#/glossary/datalog):** Soufflé's and clingo's dialects differ, so a cross-check between them needs a translation. anthem 2.0 can automatically verify that two tight programs without private recursion, in a clingo subset without aggregates, are externally equivalent for every input a user guide permits ([anthem 2.0](#/papers/fandinno2025anthem "anthem 2.0: Automated Reasoning for Answer Set Programming (2025)") §1, §4.2): a check for the clingo side of a port, not across dialects (ours).

Still open (ours): LLM ports checked this way, with engine differences told apart from port errors, for the pairs above; Graphiti checks SQL → Cypher ports, but only in a fragment and through a data mapping written for each pair (§ Why it's hard).

## Why it matters
- **Silent errors are the costly kind:** a port that runs and returns a different answer gives no sign ([Same Pattern](#/papers/mandarapu2026divergence "Same Pattern, Different Answer: A Reference Semantics and Divergence Map for GQL and SQL/PGQ Path Patterns (2026)") abstract; ours).
- **Migrations move whole query sets:** graph databases adopting the ISO standards, and rule engines changing dialect, would port many programs at once (ours).

**Size of the gain:** incremental, our estimate. It is measured as the share of silent meaning changes caught before use. The reason: a check catches meaning changes in ports that are made anyway, and certifies agreement, the larger gain, only where a decision procedure covers the fragment ([A gym of DSL tasks with answer keys made by code](#/challenges/dsl_gym) § Why it's hard).

## Why it's hard
- **The reference is unclear:** when two engines disagree on the source program, which meaning the port must keep is a choice ([Same Pattern](#/papers/mandarapu2026divergence "Same Pattern, Different Answer: A Reference Semantics and Divergence Map for GQL and SQL/PGQ Path Patterns (2026)") §6; [Telling bad translations from legitimate engine differences](#/challenges/bad_translation_detection)).
- **No exact port may exist:** a feature of the source may have no equal in the target (ours; [SQL dialect translation](#/challenges/dialect_translation)); non-backtracking regex engines "lack support for many E-regex features" ([SoK](#/papers/bhuiyan2024redossok "SoK: A Literature and Engineering Review of Regular Expression Denial of Service (ReDoS) (2025)") §4.1.6), and its authors call for automatic migration to updated engines (§5).
- **Agreement on test documents is evidence only,** outside the fragments a decision procedure covers ([Distinguishing documents for two programs in any DSL](#/challenges/dsl_counterexamples)); Graphiti proves most pairs in a SQL prover's fragment ([Graphiti](#/papers/he2025graphiti "Graphiti: Bridging Graph and Relational Database Queries (2025)") §6.2).
- **A port across data models needs a mapping of the data:** Graphiti checks Cypher against SQL through a database transformer from graph to tables, which one of its authors wrote for each pair ([Graphiti](#/papers/he2025graphiti "Graphiti: Bridging Graph and Relational Database Queries (2025)") §6), and its fragment leaves out variable-length pattern matching (§8). The Cypher → SQL/PGQ check needs such matching inputs too (ours).
- **Free engines are young for some targets:** SQL/PGQ's free engine, DuckPGQ, lags DuckDB's releases.

## Verifiable signal
Both programs run on generated documents; a document on which they differ certifies a changed meaning, and each such document is classified against the engines' documented differences. The measure is the share of LLM ports whose meaning changed silently, and the share an engine check catches.

