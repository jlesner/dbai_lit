# SQLess: Dialect-Agnostic SQL Query Simplification

**SQLess** · ISSTA 2024

Read: [PDF](https://dl.acm.org/doi/pdf/10.1145/3650212.3680317) · [DOI](https://doi.org/10.1145/3650212.3680317)  
Code: [AdaptSQLess](https://github.com/SQLess/AdaptSQLess)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Shrinks SQL queries that trigger DBMS bugs while keeping the bug, across dialects (abstract).
- An adaptive parser extends a base ANTLR grammar with rules for the dialect's unparsed syntax (§3.2); trimming uses alias analysis and a def-use graph so the reduced query stays valid (§3.3).
- Dialect-agnostic test-case reduction: the baseline of SQLFlex's reduction use case ([SQLFlex](#/papers/an2026parsing "Dialect-Agnostic SQL Parsing via LLM-Based Segmentation (2026)") §6.2), and its adaptive parser inspired the one in RISE's query reducer ([RISE](#/papers/xie2026rise "RISE: Rule-Driven SQL Dialect Translation via Query Reduction (2026)") §3.2.1).

## In plain words

To trigger deep bugs, most database testing techniques focus on generating long, complex SQL queries, which make debugging hard (abstract, PDF p. 1); the authors cite a TiDB database bug left unfixed for months until a simplified query was provided (§1, PDF pp. 1–2). SQLess shrinks such a query, keeping the bug. Each database system accepts its own SQL variant, its dialect; SQLess starts from a standard grammar and adds a rule wherever dialect syntax makes parsing fail. It tracks which query parts use which names, to help ensure a deleted part is not referenced elsewhere (§1, PDF p. 2). On over 32,000 bug-triggering queries from two testing tools, SQLess "achieves an average simplification rate of 72.45% in the PINOLO Dataset, which significantly outperforms the state-of-the-art approaches by 84.91%" (abstract, PDF p. 1). The rate is the share of tokens removed, on one tool's queries; the comparison in §5.3 is with the authors' reimplementations of two earlier simplifiers (PDF p. 9). They call it "the first systematic exploration of the dialect-aware SQL query simplification problem" (§7, PDF p. 11).

## Background and terms

**Terms to know:** [delta debugging](#/glossary/delta-debugging) · [fuzzing](#/glossary/fuzzing) · [test oracle](#/glossary/test-oracle) · [metamorphic testing](#/glossary/metamorphic-testing) · [SQL dialect](#/glossary/sql-dialect) · [abstract syntax tree (AST)](#/glossary/abstract-syntax-tree-ast) · [parser error recovery](#/glossary/parser-error-recovery) · [query hint](#/glossary/query-hint) · [logical bug](#/glossary/logical-bug) (the paper sorts bugs into "logical and crash bugs" without defining them, §2.1, PDF p. 2) · [Mann-Whitney U test](#/glossary/mann-whitney-u-test) (§5.3, PDF p. 9)

**The paper's own terms:**
- **SQL query simplification**: reducing lengthy queries "without compromising their ability to detect bugs" (abstract, PDF p. 1).
- **Simplification ratio (SimRatio)**, also "simplification rate": the percentage of tokens removed (Eq. 1, §5.1.2, PDF p. 8).
- **ANTLR**: a parser generator that builds a parser from a grammar file of production rules; a rule (production) expands a non-terminal symbol, a named construct such as `selectStatement`, into terminal symbols (tokens such as keywords and punctuation) and other non-terminals (§3.2.1, PDF p. 4). **Adaptive parser**: SQLess's component that extends that grammar for a dialect and regenerates the parser (§3.2, PDF pp. 4–5); it shares its name with ANTLR's own parsing strategy, ALL(*), but differs in implementation and application (§4, PDF p. 7).
- **AST**: here the parse tree ANTLR builds, with tokens as leaves and non-terminals as inner nodes (§3.2.1, PDF p. 4).
- **Def-use graph**: nodes for alias definitions and alias uses; a *definition dependency* links an alias defined through another, a *usage dependency* an expression using an alias (§3.3.1, PDF pp. 5–6).
- **Oracle checker**: "mutates SQL queries and checks if the execution results meet the expected outcomes" (§3.3.2, PDF p. 6).
- **SQLess-NoAP, SQLess-NoSA**: SQLess without adaptive parsing, and without semantic analysis (§5.4, PDF pp. 9–10).

**Builds on:**
- Delta debugging [50] (Zeller and Hildebrandt): earlier bug-detection tools "integrate SQL query simplification into their workflows in a simplistic manner", applying its principles to structured inputs such as the query's syntax tree (§1, PDF p. 1).
- The simplifiers inside the bug-finding tools SQLancer [29] (equivalent-query oracle), PINOLO [7], RAGS [31] ([Massive Stochastic Testing of SQL](#/papers/slutz1998rags "Massive Stochastic Testing of SQL (1998)"); random SQL compared across vendors) and APOLLO [11] (performance regressions), compared in Tab. 1 (PDF p. 2) and stood in for by the baselines ClauseDelete (clause deletion, as in the first three) and APOLLO (§5.1.3, PDF p. 8).
- ANTLR [36], its default error recovery [37] and the grammar of the MySQL database from the ANTLR grammars repository [42] (§4, PDF p. 7).
- PINOLO (builds queries with "the approximation relation" as its test oracle, which §7 calls "a specific type of metamorphic relation", PDF p. 11) and SQLRight [13] (coverage-guided query mutation for logical and crash bugs) as query sources (§5.1.1, PDF p. 7).

## Problem and setting

- **Question:** given a query known to trigger a database bug, remove as much as possible while it still triggers the bug and stays syntactically and semantically correct, across dialects (§2.2, PDF p. 3; §3.3, PDF p. 5).
- **Challenges** (§2.2, PDF p. 3): earlier simplifiers depend on one system's grammar, so a dialect breaks their parser; deleting an element another element uses (an alias) causes a semantic error.
- **Inputs** (§3.3.2, PDF p. 6): a running database system, the query, an oracle checker and the generated parser. A crash counts as "a special kind of test oracle" (§2.1, PDF p. 3).
- **Data** (§5.1.1, PDF p. 7; §5.2, PDF p. 8): 24-hour runs of PINOLO on MySQL, MariaDB, OceanBase and TiDB gave 32,741 queries (the PINOLO Dataset), of SQLRight on MySQL, PostgreSQL and SQLite 180 (the SQLRight Dataset); all six are relational database systems. The SQLRight queries "are very simple and do not contain any dependencies between the elements" (§5.4, PDF p. 10).

## Approach

- **Adaptive parsing (§3.2, PDF pp. 4–5)**. The starting parser is "fundamentally based on ANSI SQL standards", the official SQL standard [2] (§3.2.2, PDF p. 5); in the implementation the base grammar is MySQL's, chosen "because its grammar encompassing the full spectrum of standard SQL syntax" (§4, PDF p. 7). When a dialect makes parsing fail, ANTLR's error recovery lets the parser skip the problem section and continue; the dialect builder "identifies the top of the stack at the point of parsing failure and introduces a new production directly under the failed stack's top rule", that is, it adds an alternative to the grammar rule the parser was inside when it failed, adding terminals and non-terminals as needed, and ANTLR regenerates the parser. In Fig. 4, PostgreSQL's `::INT` cast and `SKIP LOCKED` clause (it "allows transactions to skip locks held by others", §2.2, PDF p. 3) become new alternatives under `fullColumn` and `root`. The authors say a rule is "not a mere placeholder but an integral part of the grammar" (§2.3, PDF p. 4).
- **Semantic analysis (§3.3.1, PDF pp. 5–6).** Alias analysis maps table, column, result-set, function and expression aliases to what they stand for, recursively; dependency analysis records each alias's uses, with a use counter. Deleting an alias also deletes the elements that use it, and a counter at zero means the alias is no longer used, "signifying potential for safe elimination"; Fig. 5 shows this. Rules in grammar extensions can reuse the core grammar's non-terminals, and analysis can run as long as those relevant to aliases and dependencies parse.
- **Trimming loop (§3.3.2, Alg. 1, PDF pp. 6–7)**. For each strategy: parse, build the def-use graph, delete nodes, print back to SQL, run the query and its oracle mutation, and keep the result if the bug remains. The text says this "iterates until no further reductions are possible, resulting in the shortest query version that still can trigger the target bug".
- **Strategies (§3.3.3, PDF pp. 6–7):** clause, column, subquery and expression simplification, and removing or adjusting optimizer hints and other modifiers.
- **Implementation (§4, PDF p. 7):** 6,783 lines, Java, ANTLR 4.12.0.

## Results

- **Effectiveness and time (§5.2, Tab. 3, PDF pp. 8–9).** The authors report an average ratio of 72.45% on the PINOLO Dataset and a lower one on SQLRight, which they ascribe to the queries' length and complexity: "Longer SQL queries, which typically encompass a greater number of clauses, offer more opportunities for simplification". Average time on PINOLO is 799.5 ms (maximum 4,920 ms); they conclude SQLess "can be integrated into any existing DBMS testing frameworks without introducing significant extra overhead".
- **Against earlier simplifiers (§5.3, Tab. 4, PDF p. 9)**. On the PINOLO Dataset only, SQLess's average ratio is 50.90–76.27% across the four systems, against 17.51–27.74% for ClauseDelete and 35.46–48.62% for APOLLO. A Mann-Whitney U test is reported significant. SQLess "takes more time to simplify the queries than the two baselines, especially upon MySQL and MariaDB", but "no more than twice" their time.
- **Ablations (§5.4, PDF pp. 9–10)**. On SQLRight, the parsing success ratio rises from 67.35% (PostgreSQL) and 55.29% (SQLite) without adaptive parsing to 100% with it (Tab. 5). On PINOLO, semantic analysis raises the simplification ratio on all four systems (Tab. 6).
- **Real bug reports (§5.5, Tab. 7, PDF pp. 10–11).** Of 22 unconfirmed or unresolved reports, "Due to our reports, 17 of them have been confirmed or resolved by developers".
- **Dialects:** SQLess "has been demonstrated to support six different SQL dialects adaptively" (§8, PDF p. 11) and "does not demand any manual work to extend the parser for a new dialect" (§7, PDF p. 11).

## Limits the authors state

- On "the theoretical guarantee of the simplification ratio": "While we lack theoretical proof, our empirical evaluation on many complex queries demonstrates its effectiveness" (§6, PDF p. 11).
- The implementation is a threat, addressed by running it on complex queries from diverse systems (§6, PDF p. 11).
- The baselines were reimplemented because their simplification strategies "are not implemented as an isolated component, and we have no way to run the original tools" (§5.1.3, PDF p. 8).
- Semantic analysis costs extra time (§5.3, PDF p. 9).
- Because PostgreSQL and SQLite developers resolve reports quickly, SQLess "can only simplify three bug reports for these DBMSs" (§5.5, PDF p. 10).

## Open problems and building blocks

- **Open:** "the usefulness of SQLess should be evaluated by real developers in actual debugging practice"; more user studies are "an important future work" (§6, PDF p. 11).
- **Released:** the source code (§1, PDF p. 2); more simplification cases (§5.3, PDF p. 9); the list of reported bugs (§5.5, PDF p. 10).
- **To reuse it:** a running database system, a bug-triggering query and an oracle checker (§3.3.2, PDF p. 6); users adopt it "by building their own oracle checker or integrating it with their fuzzing tools" (§5.5, PDF p. 11). Built on ANTLR 4.12.0 and the MySQL grammar (§4, PDF p. 7).

## On this site

- **Tags:** <span class="tags"><a class="tag" href="#/tags/reduce">reduce</a><a class="tag sub" href="#/tags/dialect-parse">dialect-parse</a></span>
