# SQL for LLMs, LLMs for SQL

**Research question:** how can we build systems whose answers we can trust from components, like LLMs, that guess and are confidently wrong?

One approach is to pair LLMs with checks that don't trust them, and only use the LLM answers that pass. SQL databases are an unusually good place to do that, and the benefit runs both ways.

## SQL for LLMs

Hard SQL problems with checkable answers serve as model problems for making LLMs more reliable in general: a testbed for inference-time scaling (sampling, search, thinking budgets), memory, harnesses (agent loops, tools, verifiers) and prompt and program optimization. Where a program checks the answers, a method's gain can be measured without trusting a judge.

## LLMs for SQL

LLMs help with SQL problems that formal tools only partly solve: deciding whether two queries mean the same thing, finding and checking rewrite rules, translating queries between database engines, and writing SQL from English. Here an unchecked LLM does real damage: the QO-Verify authors report that "a large fraction" of LLM rewrites return different results from the original query, over real-world and benchmark workloads ([QO-Verify](#/papers/narasayya2026qoverify "Leveraging Query Optimizers to Verify the Soundness of LLM-based Query Rewrites for Real-World Workloads, and More! (2026)") p. 1), and the SQLDriller authors find "a non-negligible" portion of wrong question-to-SQL pairs in the popular Spider and BIRD datasets ([SQLDriller](#/papers/yang2025sqldriller "Automated Validating and Fixing of Text-to-SQL Translation with Execution Consistency (2025)") abstract).

## One check, both directions

The same check serves both sides:

```
        proposes                  checks, without trusting the LLM
  LLM ─────────────► SQL answer ──────────────────────────► checker
   ▲                                                           │
   │                              certificate ◄────────────────┤
   │                       (proof or counterexample)           │ none
   │                                   │                       ▼
   │                                   ▼                   "unknown"
   │                           a trusted answer
   │                                   │
   └──── benchmarks and rewards ◄──────┘
         for better LLM methods
```

A **[certificate](#/glossary/certificate)** is evidence that a program can check without trusting whoever produced it; in SQL, a [counterexample database](#/glossary/counterexample-database) (run both queries and compare) or a proof. For developing LLM methods, it is a verifiable reward: a program scores every answer, so more compute (more samples, longer search, prompt optimization, [reinforcement learning](#/glossary/reinforcement-learning)) can turn into progress. For LLMs applied to SQL, it is what lets a user trust an answer: return only certified answers, and *unknown* otherwise. The bet is that each side then feeds the other: certified answers become benchmarks and rewards for better methods, and better methods certify more SQL answers.

## Why SQL

Four things make SQL a good place for this:

- **Precise semantics, formalized once:** SQL's semantics have been written down formally, including in a [proof assistant](#/glossary/proof-assistant) ([A Formal Semantics of SQL Queries](#/papers/guagliardo2017semantics "A formal semantics of SQL queries, its validation, and applications (2017)"), [A Coq mechanised formal…](#/papers/benzaken2019coq "A Coq mechanised formal semantics for realistic SQL queries: formally reconciling SQL and bag relational algebra (2019)")), so checkers can translate each new query mechanically, the way a compiler translates code ([VeriEQL](#/papers/he2024verieql "VeriEQL: Bounded Equivalence Verification for Complex SQL Queries with Integrity Constraints (2024)"), [SQLSolver](#/papers/ding2023sqlsolver "Proving Query Equivalence Using Linear Integer Arithmetic (2023)")). In mathematics, by contrast, each new statement has to be formalized by a person or a model, and someone must check that the formal statement says what the original does ([autoformalization](#/glossary/autoformalization)). Checking SQL can therefore scale without a person translating each problem. Two gaps remain: the formalized fragments don't cover all of SQL ([verifier coverage](#/challenges/verifier_coverage_gaps)), and an English question must still be turned into SQL ([text-to-SQL](#/challenges/text_to_sql_verification)).
- **A mature toolchain:** a real database engine for cheap, trusted execution; SMT solvers, provers and proof assistants; query corpora and workloads.
- **Data that matters:** relational systems, queried in SQL, take about 71% of the popularity scores in the DB-Engines ranking, and its four top-ranked systems are relational ([DB-Engines, October 2026](https://db-engines.com/en/ranking_categories)). Mistakes in SQL are costly, so reliability gains have real value.
- **A data language for LLMs:** LLM agents are typically built to act through the Linux shell or a Python interpreter ([SWE-agent](#/papers/yang2024sweagent "SWE-agent: Agent-Computer Interfaces Enable Automated Software Engineering (2024)") §1). Reliable fluency in SQL would add a mature, declarative language for storing, querying and reasoning over structured information.

## Explore

- **[Papers](#/papers)**: what each paper does, with links to the paper and its code.
- **[Tags](#/tags)**: topic tags linking papers, projects and challenges.
- **[Challenges](#/challenges)**: open research challenges, why they matter, and what signal can check an answer.
- **[Glossary](#/glossary)**: the field's terms in plain words.
