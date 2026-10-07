# QTRAN: Extending Metamorphic-Oracle Based Logical Bug Detection Techniques for Multiple-DBMS Dialect Support

**QTRAN** · ISSTA 2025 (PACMSE)

Read: [PDF](https://dl.acm.org/doi/pdf/10.1145/3728908) · [DOI](https://doi.org/10.1145/3728908)  
Code: [QTRAN](https://github.com/QTRANll/QTRAN)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- An LLM translates metamorphic test-statement pairs into other DBMS dialects, so logic-bug oracles carry across engines (abstract).
- Translation with retrieved dialect feature knowledge, and an LLM fine-tuned for mutation (§3; fine-tuning: §3.2.1, PDF p. 10).
- LLM dialect translation checked only for running on the target and for the metamorphic relation (§4.1.1, Tab. 7), not against the source's results; DBMS testing with a translation core.

## In plain words

Database systems can return wrong answers without crashing (logical bugs). A widely used way to find them runs a query and a rewritten version whose result must stand in a known relation to the first (the same rows, or a subset) and reports a bug when the relation fails. The authors call such tools MOLTs, and say existing ones rely heavily on a specific engine's grammar, so only a few popular engines are covered and adding one takes extensive manual effort (abstract, PDF p. 1). Their tool, QTRAN, carries query pairs from existing tools to other engines with an LLM: one step translates the original query, helped by dialect facts retrieved from each engine's documentation, and a fine-tuned LLM then rewrites it the way the source tool would. With GPT-4o-mini on eight engines, they report that over 99% of the pairs QTRAN transferred satisfy the required relation, and 24 logical bugs, 16 confirmed as unique and previously unknown (abstract, PDF p. 1). They present it as "a novel LLM-powered approach" that extends existing MOLTs automatically (abstract, PDF p. 1).

## Background and terms

**Terms to know:** [metamorphic testing](#/glossary/metamorphic-testing) · [test oracle](#/glossary/test-oracle) · [SQL dialect](#/glossary/sql-dialect) · [differential testing](#/glossary/differential-testing) · [parser error recovery](#/glossary/parser-error-recovery)

**The paper's own terms:**
- **logical bug**: a DBMS bug that results in "incorrect result sets being returned without obvious symptoms" (§1, PDF p. 2).
- **MOLT** (Metamorphic-Oracle based Logical Bug Detection Technique): their name for a metamorphic-testing tool for DBMSs (abstract, PDF p. 1).
- **SQL statement pair**: an original query and a mutated query built from it (abstract, PDF p. 1).
- **metamorphic relation**: on any test database, the two queries' results are equal or in "an approximate relation based on a predefined metamorphic relationship" (§2, PDF p. 5); in the running example, adding DISTINCT, "the results of the original query subsume the results of the mutated query" (§1, PDF p. 2).
- **mutation strategy**: one rewrite pattern of a MOLT, such as Pinolo's "FixMDistinctL", which adds DISTINCT (Fig. 2, PDF p. 7).
- **feature knowledge base**: per engine, its data types, functions and operators, each with a rule, a description and examples, crawled from its SQL documentation (§3.1.1, PDF p. 8).
- **dialect-specific feature**: an LLM writes a simple query using the feature; if an ANSI-standard parser fails on it, the feature counts as dialect-specific (Tab. 2 caption, PDF p. 9).
- **valid pair**: a transferred pair that "preserves syntactic and semantic correctness when executed on the target DBMSs, and fulfills predefined metamorphic relationships" (§4.1.1, PDF p. 12).
- **syntactic and semantic correctness** (Tab. 7 caption, PDF p. 17): the statement "can be parsed successfully by the database parser", and it "can be executed successfully by the DBMS".
- **QTRAN+X**: QTRAN extending MOLT X (§4.1.1, PDF p. 12).

**Builds on:**
- The four MOLTs it extends (§4 "Baselines", PDF p. 11): NoREC (moves the WHERE condition into the SELECT list), TLP (splits a query into three by its condition), Pinolo (changes conditions so the result should be a superset or subset) and DQE (runs SELECT, UPDATE and DELETE with the same condition, expecting them to act on the same rows). None is on this site.
- SQLess ([SQLess](#/papers/lin2024sqless "SQLess: Dialect-Agnostic SQL Query Simplification (2024)")), a dialect-agnostic query simplifier, for parser error recovery (§3.1.2, PDF p. 8).
- Compared against: the rule-based dialect translators SQLGlot (a Python library) and JOOQ (a Java library) (§4.3.1, PDF p. 16).

## Problem and setting

- **Question:** can an LLM carry a MOLT's query pairs to engines it doesn't support, keeping each pair's relation, without grammar code per engine (§1, PDF pp. 2–3)? The evaluation asks about transfer effectiveness and time, new bugs, dialect mapping and fine-tuning (§4, PDF p. 11).
- **Why it matters, per the authors:** a tool's generator, parser and mutator all depend on the engine's grammar; Tab. 1 counts the extra lines of code four existing tools needed per engine (§2, PDF p. 5). They cite "423 different DBMSs in the market today" (§1, PDF p. 2).
- **Engines:** MySQL, MariaDB, TiDB, PostgreSQL, SQLite, MonetDB, DuckDB and ClickHouse, "widely-used and large-scale open-source DBMSs" (§4, Tab. 3, PDF p. 11).
- **Sources and targets:** each MOLT generates pairs on the engine where it "found the most bugs" (NoREC on SQLite, DQE on TiDB, TLP and Pinolo on MySQL), and is extended only to engines it does not support natively (§4.1.1, PDF p. 12; Tab. 4, PDF p. 11). Each QTRAN+MOLT ran 5 hours per target engine.
- **Model:** "If not otherwise specified", OpenAI's gpt-4o-mini-2024-07-18 at temperature 0.0 (§4 "Environment", PDF p. 12).
- **What counts as correct:** a valid pair (above); queries that fail to transfer are discarded before mutation, and pairs that break the relation are checked by hand before a bug is reported (§4.1.1, PDF p. 12; §4.2.1, PDF p. 14).
- Set versus bag semantics and NULL handling are not discussed.

## Approach

QTRAN has two phases (§3, Fig. 3, PDF pp. 6–7):

- **Transfer phase (§3.1, PDF pp. 8–10).** The query's tokens go to a standard SQL parser built with ANTLR (a parser generator); the tokens it skips by error recovery are the dialect features to map (§3.1.2, PDF pp. 8–9). Dialect mapping is retrieval-augmented: knowledge-base entries are chunked and embedded in one vector database per engine, and the target features most similar to each source feature go into the prompt (§3.1.3, PDF p. 9). The prompt (Fig. 4, PDF p. 10) asks for step-by-step translation that keeps "equivalent semantics and column names" (§3.1.4, PDF p. 9). To the best of their knowledge, the authors are "the first to perform an extensive investigation of dialect-specific features" (§3.1.1, PDF p. 8; counts in Tab. 2, PDF p. 9).
- **Mutation phase (§3.2, PDF pp. 9–10).** A pretrained LLM ("Typically" GPT-4o-mini) is fine-tuned on MOLT pairs in a role-play format, with an explanation of each mutation strategy: 20 validated pairs per strategy, for all of a MOLT's strategies before testing (§3.2.1, PDF p. 10). The Model Validator holds out 20% of the pairs; the model is used once training loss is stable and validation token accuracy (share of tokens predicted correctly) is "above 95%" (§3.2.2, PDF p. 10). It then mutates the translated original query.
- **Why not translate the MOLT's mutated query too:** dialects allow several spellings (PostgreSQL's `f::text` or `CAST(f AS TEXT)`), so separate translations can break the pair's relation (§1, PDF p. 3; §4.4.2, PDF p. 18).

## Results

- **Transfer (Tab. 5, PDF p. 13).** Valid-pair rates per MOLT, over its target engines, are 99.0% (Pinolo) to 100.0% (DQE), "with most exceeding 99%" (§4.1.2, PDF p. 12). Among pairs that broke the relation, hand analysis found a true positive rate "of over 70%" for every MOLT, "as high as 91%" for TLP; false positives "mainly result from hallucinations in the mutation LLM" (§4.1.2, Fig. 5a, PDF pp. 12–13).
- **Bugs (Tab. 6, PDF p. 14).** 24 reported logical bugs: 16 confirmed (9 of them in MariaDB), 6 judged not bugs, 2 waiting. In Fig. 6 (PDF p. 15) a DuckDB bug came from translating SQLite's DATE to DuckDB's CURRENT_DATE; GPT-4o-mini's direct translation failed to run. In Fig. 7 (PDF p. 16) one report was confirmed in MariaDB and called "kind of ill-formed" by TiDB developers, over implicit casts (§4.2.3, PDF pp. 14–15). The authors attribute the 6 rejections mainly to the MOLTs' "uncommon syntax" designed to trigger edge cases, "which some DBMS developers choose not to fix" (PDF p. 15).
- **Dialect mapping (Tab. 7, PDF p. 17).** On 100 original queries per MOLT, QTRAN's semantic correctness is 0.50 (DuckDB) to 0.81 (MariaDB), against 0.22–0.65 without dialect mapping, 0.01–0.14 for SQLGlot and 0.05–0.32 for JOOQ (§4.3.2, PDF p. 16).
- **Fine-tuning (Tab. 8, PDF p. 18).** On 100 successfully transferred original queries per MOLT, valid-pair rates are 0.98–1.00 for QTRAN against 0.21–0.45 for prompt-only mutation and 0.08–0.34 for translating the MOLT's own mutated queries (§4.4.2, PDF pp. 17–18).

## Limits the authors state

- Syntactic and semantic correctness "still have room for improvement": a target may lack a feature of the source query (MariaDB's geospatial functions), "though this issue is rare according to our dialect mapping results", and LLM hallucinations can produce wrong SQL (§5 "Limitations", PDF p. 19). Queries that fail to transfer are discarded and, the authors say, "do not affect the validity of the generated SQL pairs" (§5, PDF p. 19; §4.1.1, PDF p. 12).
- Efficiency "is closely tied to the response time of the underlying LLM" and is lower than traditional MOLTs' (§5 "Limitations", PDF p. 19).
- Only GPT-4o-mini was used, which "may pose threats to external validity" (§5 "Threats to Validity", PDF p. 19).
- Mutations "may appear to fulfill metamorphic relationships but might not truly meet the criteria"; the authors observe such cases are "exceedingly rare" (§5 "Threats to Validity", PDF p. 19).

## Open problems and building blocks

- **Open:** None stated.
- **Released:** the source code (§8, PDF p. 20); the reported bugs' status list, in a public repository (§4.2.2, PDF p. 14). A contribution they list is "a feature knowledge base containing dialect information for eight different DBMSs" (§1, PDF p. 4).
- **To reuse it:** per new engine, a documentation crawler, which "typically requires around 200 lines of code" (120 to 280 for the eight); fine-tuning data from the source MOLT's pairs, tuned through OpenAI's API; and hand checks of candidate bugs, "around 5 minutes per bug by a person familiar with DBMS operations" (§5, PDF p. 18).
- **Beyond its domain:** for oracle-guided synthesis such as PQS, which builds a query guaranteed to return a chosen row and so needs no mutated query, "the transfer phase of QTRAN can easily extend this approach" (§6, PDF p. 19).

## On this site

- **Discussed in:** [Telling bad translations from legitimate engine differences](#/challenges/bad_translation_detection) · [SQL dialect translation](#/challenges/dialect_translation)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/dialect-translate">dialect-translate</a><a class="tag sub" href="#/tags/llm-gen">llm-gen</a></span>
