# Checking a program written from English, in any DSL

> A program an LLM writes from an English request can be checked against a reference program, but rarely against the request itself; find checks of intent that work across the DSL family, and measure the errors they miss.

<p class="tags"><a class="tag" href="#/tags/dsl">dsl</a><a class="tag sub" href="#/tags/nl2dsl-eval">nl2dsl-eval</a></p>

The SQL instance: [Checking text-to-SQL against intent](#/challenges/text_to_sql_verification), which treats intent as uncertifiable and [text-to-SQL](#/glossary/text-to-sql) as a source of pairs, and shares this page's aim of measuring each intent check's miss rate.

## Challenge
Writing a program from English is the task DSL users most want from an LLM, and the one a program checks least (both ours). With a hidden reference program the engine compares results on test data, which is evidence, not a [certificate](#/glossary/certificate); with no reference, nothing checks the program against the request.

The challenge: checks of intent that apply across the family ([XPath](#/glossary/xpath), SPARQL, [Datalog](#/glossary/datalog), SQL/PGQ, regular expressions; the list: that note), with the share of wrong programs each check misses measured against programs known to be wrong.

## What's known
SQL has the most work on this (ours), gathered in [Checking text-to-SQL against intent](#/challenges/text_to_sql_verification). Other DSLs and formal languages have it in narrower forms:
- The pair of versions stands in for the intent (ours).
- **A decision procedure against a reference:** Regel takes examples beside the English, as "natural language alone is often highly ambiguous" ([Multi-modal Synthesis of Regular Expressions](#/papers/chen2019regel "Multi-modal Synthesis of Regular Expressions (2020)") abstract), and on its StackOverflow benchmarks uses an automaton library to check a synthesized regex for equivalence with the gold one (App. D).
- **A finer comparison with the reference:** for factory-controller programs written from English, CycleBench compares outputs with a hidden reference program's after every controller cycle ([Compilation Is Not Correctness](#/papers/chen2026cyclebench "Compilation Is Not Correctness: Scan-by-Scan Evaluation of LLM-Generated PLC Programs (2026)") §3.2); on the same traces, checking only some cycles, or only the last, misses failures the full comparison finds (§6.4).
- **Errors left once execution is exact:** where a model writes an event specification and fixed code counts the events in an agent's log, the largest category of one model's remaining errors is a plan that "does not express the referenced quantity", which the authors say "can be checked against the log" ([When Agent Memory Needs to Compute](#/papers/yang2026tallymem "When Agent Memory Needs to Compute: Evidence Access and Executable Aggregation (2026)") §8).
- **A round trip with a solver's verdict:** formalize, translate back to English, formalize again, and ask a solver whether the two formalizations agree ([Faithful Autoformalization via Roundtrip…](#/papers/amrollahi2026roundtrip "Faithful Autoformalization via Roundtrip Verification and Repair (2026)") §1, §3). The authors state that agreement doesn't guarantee correctness: "the pipeline may stabilize at a semantically different [fixed point](#/glossary/fixed-point) where both formalizations agree yet neither faithfully represents" the input (§3), and that the check "cannot detect errors that affect both stages in the same way" (§ Limitations).
- **Checks short of intent:** KGQAGen keeps an LLM-written question when its SPARQL query's results overlap the answers the same LLM wrote with it ([Diagnosing and Addressing Pitfalls…](#/papers/zhang2025kgqagen "Diagnosing and Addressing Pitfalls in KG-RAG Datasets: Toward More Reliable Benchmarking (2025)") §4.2.2, App. F.2); a Text-to-Cypher repair loop counts, "following common practice", a non-empty result as correct ([What Drives Recovery in…](#/papers/prokopiou2026lastcq "What Drives Recovery in Agentic Text-to-Cypher? LAST-CQ: An LLM Agent Self-Refinement Framework (2026)") §3.2); an LLM diagnoser flags Cypher queries that match the reference's result but diverge structurally from the intended meaning as correct-by-coincidence candidates ([CypherLens](#/papers/mohammadi2026cypherlens "CypherLens: An Interactive Demo for Evaluating and Diagnosing NL-to-Cypher Systems (2026)") §2.3, PDF p. 3).
- **A neighbour, [formal specifications](#/glossary/formal-specification):** describing the artifact blind to the requirement, then comparing English texts, beats one judge shown both, on all four proof languages tested ([claimcheck](#/papers/amster2026claimcheck "claimcheck: Measuring and Improving Specification Faithfulness (2026)") §5.1); with the artifact also shown to the judge, the gain is large for the two weaker judges of a model sweep and small for the strongest (§5.3).

Still open (ours): a check of intent that applies across the family, with its miss rate measured; each check above needs a second artifact, a reference or a solver, or stops short of intent.

## Why it matters
- **It is what DSL users ask for** (ours): writing from English heads the note's list of what LLMs do for DSL users, and an unchecked program that runs gives no sign that it is wrong ([Reliability that holds with size, by handing the procedure to an engine](#/challenges/engine_offloading_with_size) § Why it's hard).
- **Benchmarks depend on it:** gold programs are references only as far as they are right ([Benchmarks with checkable ground truth](#/challenges/checkable_benchmark_ground_truth)).
- **It is where carry-over is measured nearest:** writing from English is the near target of [Gains made against a checker, carried beyond it](#/challenges/transfer_beyond_the_checker).

**Size of the gain:** enabler, our estimate. The quantity it lifts is the known miss rate behind a passed intent check in [Benchmarks with checkable ground truth](#/challenges/checkable_benchmark_ground_truth) and [Gains made against a checker, carried beyond it](#/challenges/transfer_beyond_the_checker). The reason: a measured miss rate turns "passed the check" into a known level of evidence.

## Why it's hard
- **English is ambiguous,** so two different programs can both be right; a check that demands one answer rejects good programs (ours; [Checking text-to-SQL against intent](#/challenges/text_to_sql_verification)). In Regel's user study, posts open to several readings sometimes led users to the wrong regex ([Multi-modal Synthesis of Regular Expressions](#/papers/chen2019regel "Multi-modal Synthesis of Regular Expressions (2020)") §9.3).
- **Shared errors pass a round trip** ([Faithful Autoformalization via Roundtrip…](#/papers/amrollahi2026roundtrip "Faithful Autoformalization via Roundtrip Verification and Repair (2026)") § Limitations), and an LLM judge of intent is itself unchecked (LLM as judge).
- **Agreement needs a decision procedure,** which only some DSLs and fragments have ([A gym of DSL tasks with answer keys made by code](#/challenges/dsl_gym) § Why it's hard); elsewhere agreement on test data is evidence only.
- **Second artifacts are rare:** a vulnerable and a patched version exist for CVEs, not for most requests (ours).

## Verifiable signal
Each check is run on programs whose errors are known: wrong programs seeded by mutation or collected from models, each with a document or fact set on which it differs from a correct program. The measure is the share of wrong programs each check accepts and of right ones it rejects, per DSL.

