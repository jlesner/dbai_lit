# Massive Stochastic Testing of SQL

**Massive Stochastic Testing of SQL** · VLDB 1998

Read: [PDF](https://www.vldb.org/conf/1998/p618.pdf)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Generates random SQL statements and runs each one on several vendors' DBMSs, comparing row counts and a checksum of the results (§2).
- A configurable stochastic generator; a system that alone returns a different result is counted as a likely bug (§4.2), and a failing statement is simplified automatically while it still raises the same error (§4.3).
- Differential testing across engines, and automatic statement simplification; [ARG](#/papers/li2025arg "ARG: Testing Query Rewriters via Abstract Rule Guided Fuzzing (2025)") cites it as differential testing (related work).

## In plain words

Database vendors test SQL with hand-written test libraries, which the author says cover "an important, but tiny, fraction of the SQL input domain" (§1, PDF p. 1). RAGS, built at Microsoft Research, generates random but valid SQL statements, runs them, and records errors and crashes; it can also run each query on several vendors' systems and compare the answers. It shrinks an error-raising statement automatically. The abstract says RAGS generates statements "1 million times faster than a human". On the same 2000 random queries over a very small database, four anonymized systems all agreed on 84% (§4.2, PDF p. 4). The author presents RAGS as "an experiment in massive stochastic testing of SQL systems" (§6, PDF p. 5).

## Background and terms

**Terms to know:** [differential testing](#/glossary/differential-testing) · [test oracle](#/glossary/test-oracle) · [fuzzing](#/glossary/fuzzing) · [NULL and three-valued logic](#/glossary/null-and-three-valued-logic) · [regression testing](#/glossary/regression-testing)

**The paper's own terms:**
- **input domain**: all SQL statements, from any number of users, with all database states (§1, PDF p. 1).
- **expected errors**: errors random statements should raise, such as overflow, divide by zero, or deadlock victim (a transaction aborted to break a deadlock) (§4.1, Fig. 6, PDF p. 4).
- **entry level ANSI 92 SQL**: the basic level of the 1992 SQL standard, an example of SQL several vendors run (§2, PDF p. 2).

**Builds on:** no work it says it extends; it cites statistical software testing (Thevenod-Fosse and Waeselynck, ISSTA '93; not listed here) for test quality improving with test size, "If the distribution is adequate" (§1, PDF p. 1).

## Problem and setting

- **Question:** RAGS is "an experiment to see how effective" a vastly larger SQL test library "can be" (§2, PDF p. 1).
- **One system:** observable errors such as "lost connections, compiler errors, execution errors, and system crashes" (§2, PDF p. 1).
- **Several systems:** a Select runs on each; row counts are compared, then a checksum over all values, "to avoid sorts" (§2, PDF p. 2).
- **Experiments:** "a very small database (less that 4KB)" (§4, PDF p. 3) and four anonymized systems, SYSA–SYSD (§4.2, PDF p. 4).

## Approach

- **Generation (§3, PDF p. 3).** RAGS builds a statement's parse tree (Fig. 5) at random while walking it, printing the SQL. To follow "the semantic rules of SQL", it carries state down the tree (e.g. an expression's datatype) and results of random choices up. Each decision, made "at the last possible moment", picks at random from choices assembled from the current state and directives.
- **Configuration (§2, Fig. 2, PDF p. 2).** A file sets the frequencies of statement types and features, and limits such as tables per join; a fixed seed repeats a run (§3, PDF p. 3).
- **Automatic simplification (§4.3, PDF p. 4).** For a statement that raised an error, RAGS walks its parse tree and tries to remove terms in expressions and Where and Having clauses, keeping the original error; it does not try the Select, Group by or Order by lists (Fig. 8, PDF p. 5).

## Results

- **Speed (§3, PDF p. 3):** 833 "moderate size" statements per second on a 200 MHz Pentium.
- **Rows returned (§2, PDF p. 2):** in the author's "experience", "about 50% of the Select statements return rows", by "the symmetry of predicates P and Not P occurring equally likely".
- **Multi-user test (§4.1, Fig. 6, PDF p. 4):** 10 clients × 2500 statements on one system: 86.1% executed without error, 13.8% had expected errors and 0.07% "indicated possible bugs (18 occurrences of 2 different error codes)".
- **Four-system comparison (§4.2, Fig. 7, PDF p. 4):** on 2000 Selects, all four agreed on 84%. Counts where one system alone got a unique answer "are likely bugs": 1, 12, 5 and 116 for SYSA–SYSD.
- **Execution times (§4.4, Fig. 9, PDF p. 5):** on 990 Selects, "With a few exceptions", version 2 of SYSC "is a little faster for the smaller queries and about the same for the larger ones".
- **Overall (§6, PDF p. 5):** the outcome "was encouraging since RAGS could steadily generate errors in released SQL products".

## Limits the authors state

- Comparison "only works for SQL statements that will execute on more than one vendor's database" (§2, PDF p. 2).
- "The problem of validating outputs remains a tough issue": comparisons helped "only for the small set of common SQL"; NULL, string and numeric-coercion differences were "particularly problematic" (§6, PDF p. 5).
- The challenge is to place random statements "in useful regions of the input domain" (§1, PDF p. 1); "we don't know the actual region boundaries" (Fig. 1, PDF p. 1).
- A simplified statement "is not necessarily equivalent to the original statement" (§4.3, PDF p. 4).

## Open problems and building blocks

- **Open (§5, PDF p. 5), as possible extensions:** more data types, DDL (statements that define tables), stored procedures and utilities; negative testing ("injecting random errors"); families of equivalent statements (permuted lists, always-true terms) as "a method to help validate the outputs"; comparing optimizer estimates with measured execution metrics.
- **Released:** Nothing stated. RAGS "is currently used by the Microsoft SQL Server [MSS98] testing group" (§1, PDF p. 1).
- **To reuse it:** identical schemas and data (not indexes) on every compared system, and SQL they all run (§2, PDF p. 2).

## On this site

- **Discussed in:** [Telling bad translations from legitimate engine differences](#/challenges/bad_translation_detection) · [SQL dialect translation](#/challenges/dialect_translation)
- **Tags:** <span class="tags"><a class="tag" href="#/tags/reduce">reduce</a><a class="tag" href="#/tags/workload">workload</a><a class="tag sub" href="#/tags/dialect-difftest">dialect-difftest</a></span>
