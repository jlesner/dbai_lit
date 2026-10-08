# SQLRepair: Identifying and Repairing Mistakes in Student-Authored SQL Queries

**SQLRepair** · ICSE-SEET 2021

Read: [PDF](https://arxiv.org/pdf/2102.05729) · [arXiv](https://arxiv.org/abs/2102.05729) · [DOI](https://doi.org/10.1109/ICSE-SEET52601.2021.00030)  
Code: [SQLRepair](https://github.com/kpresler/SQLRepair)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Collects the SQL queries that undergraduates wrote for programming-by-example problems, each given as (source, destination) table pairs that a query must turn one into the other, and classifies their syntax and semantic errors (abstract; §II; §IV-A).
- SQLRepair fixes a wrong query by rules first (C/Java-style operators, the column list, string quoting), then by turning constants, operators, columns or WHERE subclauses into holes that Z3 fills so that every example pair holds; single-table queries with compound WHERE, ORDER BY and DISTINCT only, no GROUP BY or joins (§III; §IV-B).
- Real wrong queries from novices, with the problems' tables, a possible source of items for SQL refutation benchmarks (our reading). "Correct" means producing the destination tables on the two or three examples, a test-based check, not equivalence to a reference query (§II-A; §III-B). Its evaluation set has 2,531 incorrect queries (Tab. II; §IV-B).

## In plain words

Knowing beginners' mistakes helps teachers plan lessons, and the authors say mistakes in C and Java are "relatively well studied" while less is known about SQL (§I). Undergraduates in two courses got a short SQL lecture and ten problems, each shown as example pairs of a starting table and the table a query should produce; a query was correct only if it produced the expected table for every pair (§II-A1). They classified the errors in wrong queries and built SQLRepair, which fixes a query first with fixed rewrite rules, then by blanking out parts of it (a constant, comparison, column or condition) for a constraint solver, a program that finds values meeting logical conditions, to fill in until every pair passes (§III). They report that it repairs 29.1% of 2,531 incorrect queries, with no comparison stated (§IV-B). Students, they report, rated its repairs about as easy to understand as queries written by themselves or by others (abstract; §IV-C). They call it, "To the best of our knowledge", "the first application of automated program repair to SQL" (§VI).

## Background and terms

**Terms to know:** [automated program repair](#/glossary/automated-program-repair) · [program synthesis](#/glossary/program-synthesis) · [SAT and SMT solvers](#/glossary/sat-and-smt-solvers) · [Mann-Whitney U test](#/glossary/mann-whitney-u-test)

**The paper's own terms:**
- **mistake and error**: "students make a mistake while solving a problem, introducing one or more errors into the query" (§I, footnote 1).
- **(source, destination) table pair**: an example input table and the table the query must output. Each problem has two or three, which act as "test cases that must be passed simultaneously for the query to be considered correct" (§II-A1). The authors call the setup "similar to programming by example (PBE) techniques" (§I).
- **syntax error and semantic error**: a query for which MySQL 5.7 returns an error message has syntax errors; a query that runs but whose output differs from the expected table has semantic errors (§II-D). A query counts toward one kind only, but may fall into several categories of it (§II-D).
- **non-synthesis repair and synthesis repair**: rule-based rewrites of the query text, and repairs whose missing parts the solver fills in (§III).
- **holes**: placeholders such as `CONST_i`, `OP_j` and `COL_1` that replace a constant, a comparison operator or a column in the query, for the solver to fill (§III-B).
- **subclause**: one condition of the `WHERE` clause, joined to the others by `AND` or `OR` (§III-B4–5).
- **MCQ, MRQ, OCQ, ORQ**: the query kinds shown for rating: the student's own correct query, SQLRepair's repair of one of the student's wrong queries, and the same two from a Phase 1 participant (MyCorrectQuery, MyRepairedQuery, OtherCorrectQuery, OtherRepairedQuery) (§II-B2; §IV-C).
- **understandability**: a rating from 1 (very difficult to understand) to 7 (very easy to understand) (§IV-C), used "as a proxy for ease of maintenance" (§II-B2).
- **paired Mann–Whitney U tests**: the paper's name for its six within-participant comparisons of the query kinds (§III-C; §IV-C).

**Missing glossary terms:**
- **correct-by-construction repair**: SQLRepair "follows the correct-by-construction approach to automated program repair" (§III),, citing a survey. In general use: building a patch by solving constraints so it passes the tests by construction, rather than proposing patches and then testing them.
- **test of two proportions**: a significance test of whether two groups' success rates differ; used to compare the courses (§IV-A).

**Builds on:**
- Z3, an SMT solver by De Moura and Bjørner, which fills the holes (§I; §III-B).
- Scythe (Wang, Cheung and Bodik), which synthesizes SQL queries from input-output examples; clause synthesis "functions most similarly to Scythe" (§III-B5; §VI).
- Solar-Lezama's program synthesis by sketching (a tool completes a partial program), "the approach that we use for synthesis repairs" (§VI).
- The SQL error classifications of Taipalus and Perälä and of Ahadi et al., which the authors compare their categories with (§IV-A; §VI).

## Problem and setting

- **Questions** (§I): what mistakes beginners make in SQL (RQ1); how well SQLRepair fixes them (RQ2); whether students find its repairs more understandable than other students' queries (RQ3).
- **Participants:** Phase 1 (Summer 2019): 12 active students of a second-year Java course, CS2 (§II-A2). Phase 2 (Fall 2020, over Zoom): 33 CS2 students and 19 of a third-year software engineering course, SE, after a discarded pilot (§II-B1; §II-B3). The CS2 groups were combined after a Mann–Whitney test found no significant difference; SE stayed separate (§II-C).
- **Problems:** the same ten in both phases, one concept each, from a single-condition select to joins and grouping (Tab. I). The data come from UMLS, "a health and biomedical vocabulary dataset" (§II-A1).
- **Data:** 2,782 queries over both phases (Tab. II).
- **What "correct" means:** producing the destination table for every pair, judged by running the query on MySQL 5.7 (§II-A1; §II-D). SQLRepair checks the same with Z3: for every example, the query applied to the source implies the destination (§III-B).
- **SQL covered by SQLRepair:** "compound WHERE clauses, integer and string datatypes, ORDER BY, and DISTINCT" (§III); not `GROUP BY` or joins, nor the `BETWEEN` and `LIMIT` some students used (§IV-B2 "Unsupported functionality"). Synthesized strings "must be exact matches without wildcards" (§III-B1).
- Set or bag semantics, NULLs, and how tables are encoded for Z3: not discussed.

## Approach

SQLRepair runs two steps, shown on a running example (Fig. 3; §III).

- **Non-synthesis repair (§III-A):** operator mismatch replaces C/Java-style operators (`==`, `&&`) with SQL ones (§III-A1); column mismatch fixes the column list before `WHERE` to match the destination table, and can rename columns with `AS` (§III-A2); string repair removes double quotes and puts single quotes around "what appear to be unquoted string literals" (§III-A3). These resolve syntax errors, "but often synthesis is needed to fully correct the semantic errors" (§III-A3).
- **Synthesis repair (§III-B):** if Z3 finds the query incorrect, SQLRepair inserts holes and asks Z3 for values; a satisfiable answer gives the fill, and Z3 answers unsatisfiable when the query with holes is not repairable. Five stages run in order, stopping at the first success:
  - constant synthesis replaces constants compared to columns in `WHERE` (§III-B1);
  - operator synthesis replaces each `WHERE` operator, with `=` and `!=` for strings and `=`, `!=`, `>`, `>=`, `<`, `<=` for integers (§III-B2);
  - column synthesis replaces columns, repeated for each subclause in order if it fails (§III-B3);
  - clause removal drops subclauses "that impede correctness", and adds them back if this fails (§III-B4);
  - clause synthesis adds a new subclause of holes joined by `AND` or `OR`, again and again, until a solution is found or the query reaches "the maximum of five subclauses" (§III-B5).
- **In the Phase 2 study app,** SQLRepair tried a student's wrong queries, most recent first, until one was repaired or ten had failed (§II-B2, footnote 3). After solving or giving up on a problem, students rated up to four queries in random order (§II-B2; Fig. 2).

## Results

- **RQ1, errors (§IV-A):** SE students wrote correct queries more often than CS2 students, 12.4% against 7.8% (§IV-A; Tab. V), a significant difference. The most common syntax error overall is a broken operator such as `==` (Tab. III). The most common semantic error, "Wrong subclauses in WHERE", is in 72% of the queries with semantic errors (Tab. IV). The join problem was solved by 1 of the 42 students who tried it, and the compound-`WHERE` problems also "proved difficult" (Tab. V; §IV-A).
- **RQ2, repair (§IV-B):** SQLRepair repaired 737 of 2,531 incorrect queries, 29.1% (§IV-B). The most common repair is column synthesis, then clause removal and clause synthesis, which correspond to the "Wrong subclauses" errors (Tab. VI; §IV-B1). Most of the repair operations performed are synthesis repairs, and "More often than not, repaired queries requires a combination of repair operations" (§IV-B1). Unrepaired queries use unsupported features or have syntax errors it can't fix, such as misspelled keywords (§IV-B2).
- **RQ3, understandability (§IV-C):** students rated their own correct queries 5.58 and repairs of their own wrong queries 5.35 on average, a difference not significant (p = 0.662); all six pairwise tests had p-values above 0.1, and the authors conclude "there is no statistical difference in understandability between human-written and machine-repaired SQL queries" (Tab. VII; §IV-C).

## Limits the authors state

- "Our conclusions may not generalize to different student body populations"; Phase 2 students signed up for extra credit, so "there may be a selection bias" (§V-C).
- "The specific errors that students faced may not generalize to different problems", and the UMLS data may have added difficulty (§V-C).
- Understandability is a proxy for quality: students only read and rated queries, without integrating or modifying them, and "in a different context may have different priorities" (§V-C).
- The repair rate "is lower than many general-purpose repair tools" (§V-A).
- Some functionality the problems need, "such as GROUP BY or joins", is not supported (§IV-B2 "Unsupported functionality").
- Counting MySQL errors as syntax errors "understates the number of SQL syntax errors", since MySQL 5.7 accepts, e.g., double-quoted strings and `&&` (§II-D, footnote 4).

## Open problems and building blocks

  - "the availability of our dataset should allow future SQL repair tools to improve on our efforts" (§V-A).
  - "Providing hints or iterative refinement rather than just a new solution may further improve the process" (§V-A).
  - Whether performing repairs in a different order changes the quality of the query produced (§V-B).
  - Tools that show how a query's tables relate or highlight patterns between rows, and repair tools in notebooks such as Jupyter (§V-B).
- **Released:** "a benchmark of SQL queries written by the students in our study" (abstract); "Our tool and instructions on how to set it up are available" (§II, footnote 2); "All queries collected, SQLRepair, and supporting tools for analysis are available on Zenodo" (§ "Data Availability").
- **To reuse it:** Z3 (§III-B), the SQL subset above (§III), and example table pairs (§II-A1). Successful repairs took a median of 231 ms and unsuccessful ones 196 ms on an Intel i7-6700HQ running Linux Mint 18 (§IV-B3).
- **Beyond its domain:** "By demonstrating that APR techniques are applicable to SQL, we pave the way for additional automated repair of special-purpose programming languages" (§VII; APR is automated program repair).

## On this site

- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/smt-misc">smt-misc</a></span>
