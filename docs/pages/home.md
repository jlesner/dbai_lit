# DSLs for LLMs, LLMs for DSLs

**Talk:** <a href="talk2/" target="_blank" rel="noopener">DSLs for LLMs, LLMs for DSLs</a>, slides on this case (press F for full screen, arrow keys to move).

**The domain:** a DSL here is a small language that an engine runs over data: XPath and XQuery over XML documents, JSONPath over JSON, SQL over tables, SQL/PGQ over [property graphs](#/glossary/property-graph), SPARQL over [knowledge graphs](#/glossary/knowledge-graph), [Datalog](#/glossary/datalog) over facts, iCalendar recurrence rules over time, regular expressions over text. Each has a standard or a published [formal semantics](#/glossary/formal-semantics), and two or more solid free engines (§ Why DSLs), so a program's result is computed, not judged, and one engine can check another.

## DSLs for LLMs

In two senses.

**As the LLM's tool.** An LLM samples each token, so any token can go wrong, and over a long job the chances multiply (ours). On controlled agent tasks, one preprint reports that success "follows a geometric law in 28 of 36 model-task cells tested, governed by a single measurable quantity: per-step reliability" ([How Fast Do Agents Rot?](#/papers/mittal2026rot "How Fast Do Agents Rot? An Empirical Study of Long-Horizon Degradation in LLM Agents for Production Decision-Making (2026)") p. 2), but its released analysis gives 27 of 36, 17 of them labelled geometric by default where the geometric fit failed. Context is scarce too: attention compares every pair of tokens, so its cost grows with the square of the context's length (ours). A DSL program moves the procedure out of the model: the model writes a few tokens, and the engine runs them exactly over data of any size. The program is precise where English is ambiguous, and the language's vocabulary (path steps, joins, recursive rules, recurrence parts) carries ways of solving that the model needn't reinvent: a Datalog engine, for one, applies the rules "until nothing new is derived" ([DatalogBench](#/papers/li2026datalogbench "DatalogBench: Evaluating Large Language Models on Text-to-Datalog Synthesis (2026)") §3), a search the model would otherwise run step by step (ours). The evidence is mixed:
- **For:** as more objects were added to a reasoning task, the PAL authors report that "CoT's accuracy is unstable and drops, while PAL remains consistently close to 100%" ([PAL (Program-aided Language Models)](#/papers/gao2022pal "PAL: Program-aided Language Models (2022)") §5.2); Logic-LM, which hands logic problems to a solver, "becomes increasingly effective as the required reasoning depth increases" ([Logic-LM](#/papers/pan2023logiclm "Logic-LM: Empowering Large Language Models with Symbolic Solvers for Faithful Logical Reasoning (2023)") §4.3), though its own accuracy also falls with depth, less steeply than chain of thought's (Fig. 3).
- **Against:** over 14 tasks and 6 LLMs, "results from LLM written code are not always better than using textual reasoning, even if the task could be solved through code", and models choosing between code and text showed "an astonishingly inverse scaling behavior" ([Steering Large Language Models…](#/papers/chen2024steering "Steering Large Language Models between Code Execution and Textual Reasoning (2025)") abstract).
- **Not yet measured:** a short search on 2026-10-13 found no study of compact open models writing DSLs over data as the data or the task grows, and no measurement of how many tokens a DSL program saves against English for the same task (ours: `//book[price>30]/title` is 22 characters).

**As model problems.** DSL tasks with answers a program checks serve LLM methods as SQL's do; the task families, and how strongly each is checked, are in the table under § One loop, both directions. The engine makes every answer key, so instances come in any number and at any size.

## LLMs for DSLs

The same fluency serves the people who use DSLs: writing them from English, porting them between dialects, checking that two of them agree, explaining one. For Datalog, DatalogBench reports that of 3,264 programs written by direct prompting, 31.7% fail to compile and 15.9% "compile but compute the wrong relations", and that coding agents remove most compile failures while the errors left are "mostly semantic" and concentrate in recursive tasks ([DatalogBench](#/papers/li2026datalogbench "DatalogBench: Evaluating Large Language Models on Text-to-Datalog Synthesis (2026)") §6.3). For XPath, the AutoScraper authors report that "models with small parameter sizes have significant difficulties in understanding and writing executable paths" ([AutoScraper](#/papers/huang2024autoscraper "AutoScraper: A Progressive Understanding Web Agent for Web Scraper Generation (2024)") §5.2): on the SWDE web-extraction benchmark, with their own method, 24.06% of Phi-3-medium's generated extraction paths are fully correct (precision and recall both 1, §3.3), against 71.56% of GPT-4-Turbo's (Tab. 2), though such models "can understand webpage content well" and "still struggle to comprehend webpage structures" (§6.1).

## One loop, both directions

```
        proposes an answer              runs or checks it; no trust in the LLM
  LLM ──────────────────► program or document ──────────────────────► checker
   ▲                                                                   │
   │                                  verdict ◄────────────────────────┤
   │                       (certified, evidence only                   │ can't be
   │                        or failed; the table below)                ▼ checked
   │                                    │                          "unknown"
   │                                    ▼
   │                    a trusted answer (certified rows only)
   │                                    │
   └── skills and examples ◄────────────┘
       learned from what passed
```

The checker is the engine for most tasks, and a decision procedure or a proof checker where two programs must be shown to agree.

A **[certificate](#/glossary/certificate)** here is evidence that a program checks without trusting the LLM. In a DSL most checks are runs of the engine, but how much a pass proves depends on the task:

| Task family | What checks an answer | What a pass proves |
|---|---|---|
| Predict a program's output on a document | Run the program in the engine and compare | Certified, as far as the engine is right; where the semantics is prose, a second engine cross-checks (§ Why DSLs) |
| Write a program from examples | Run it on the examples, and on held-out documents from the same hidden source | Evidence only: a program that hard-codes the examples passes them, and held-out documents catch some such programs, not all (ours) |
| Write a program from English | Compare its results with those of a hidden reference program made by code | Evidence only: agreement on the test documents. With no reference program, nothing checks it, as for [text-to-SQL](#/glossary/text-to-sql) |
| Show that two programs differ | Run both on the document offered | Certified: the document is a counterexample |
| Show that two programs agree | A decision procedure, in the DSLs and fragments that have one, or a proof in a fragment a prover covers, as for SQL. | Certified only by a decision procedure or a proof; agreement on test documents is evidence |
| Build an input: given a program and a wanted result, a document on which the program returns it | Run the program on the document | Certified: one run checks it, in any DSL (ours; it generalizes the counterexample) |
| Port a program to another dialect or DSL | The *differ* and *agree* rows, between the old program and the new | As strong as the agreement check |
| Minimize: an equivalent program no longer than a given length | The agreement check, and the length | As strong as the agreement check; for regular expressions a tool solves most instances |
| Repair: keep a program's meaning and give it a property, such as a regular expression safe from catastrophic backtracking, or make it pass failing tests | The agreement check and a checker for the property; or the tests | As strong as both checks; passing tests is evidence only |
| Rewrite for speed: a faster equivalent program | The agreement check, and measured time or plan cost | As strong as the agreement check; the speedup is measured and noisy, and worthless without agreement |

For developing LLM methods, the certified rows are exact rewards, all but *agree* in every DSL at once, and the evidence rows are rewards that some wrong answers pass ([Weak checkers get exploited](#/challenges/weak_checker_exploitation)). For LLMs applied to DSLs, an answer can be trusted only on a certified row. The bet is the one made for SQL, made general: what a model learns from the verdicts (a skill, a library of verified examples) makes its next programs more reliable, and more reliable programs earn more verdicts.

**A candidate question beyond the bet:** do gains made on checkable tasks carry over to tasks that are harder to check? Near: the same DSL, on a task only examples check, such as writing a query from English. Far: open-ended work in other domains, which no program checks. A soldier drills where every move is scored, for a fight where none can be (our analogy). A quick sweep (2026-10-13) found the weight-training form reported, mostly onto targets that are still checkable: after RL on 5K logic puzzles a 7B model generalizes to AIME and AMC ([Logic-RL](https://arxiv.org/abs/2502.14768), abstract); trained only on code tasks it proposes itself, a model reports top coding and math results, ahead of zero-setting models trained on curated examples ([Absolute Zero](#/papers/zhao2025absolutezero "Absolute Zero: Reinforced Self-play Reasoning with Zero Data (2025)"), abstract); on math-only data, "RL-tuned models generalize well across domains, while SFT-tuned models often forget general capabilities" ([Huan et al. 2025](https://arxiv.org/abs/2507.00432), abstract); while long chain of thought learned with verifiable rewards "does not generalize well to open-ended tasks" ([RLMT](https://arxiv.org/abs/2509.20357), abstract). With frozen weights, SynTra prefix-tunes a system message on a synthetic task whose hallucinations are easy to measure and reports less hallucination on three real summarization tasks ([SynTra](https://arxiv.org/abs/2310.06827), abstract); optimized text prompts mostly fail to transfer ([Do Agent Optimizers Compound?](#/papers/wang2026compound "Do Agent Optimizers Compound? A Continual-Learning Evaluation on Terminal-Bench 2.0 (2026)"), abstract; [Gong et al. 2026](https://arxiv.org/abs/2605.26655), abstract). So the question is when such gains carry over, not whether they always do.

## Why DSLs

The four reasons given for SQL, for the family:

- **Precise semantics, mostly fixed once:** SQL's semantics are formalized; W3C publishes a formal semantics for XPath 2.0 ("XQuery 1.0 and XPath 2.0 Formal Semantics", W3C Recommendation, 2010, revised 2015; [XQuery 1.0 and XPath…](#/papers/draper2010semantics "XQuery 1.0 and XPath 2.0 Formal Semantics (Second Edition) (2010)"); its static semantics is normative, its dynamic rules "not normative", §1.1), though lxml, the common engine, implements XPath 1.0 ([XML Path Language (XPath) Version 1.0](#/papers/clark1999xpath "XML Path Language (XPath) Version 1.0 (1999)"); lxml's `doc/xpathxslt.txt`); the same formal semantics covers XQuery 1.0, and XQuery 3.1 is a W3C Recommendation (2017); the SPARQL 1.1 Recommendation "defines the syntax and semantics" of the language ([SPARQL 1.1 Query Language](#/papers/harris2013sparql "SPARQL 1.1 Query Language (2013)") abstract). SQL/PGQ is part 16 of the [SQL standard](#/glossary/sql-standard) (ISO/IEC 9075-16:2023), and JSONPath is IETF RFC 9535 (2024). Datalog "has no standardized surface syntax" ([DatalogBench](#/papers/li2026datalogbench "DatalogBench: Evaluating Large Language Models on Text-to-Datalog Synthesis (2026)") App. O), but its semantics is fixed: a program's result is "the least fixed point reached by applying the rules until nothing new is derived" (§3). iCalendar's are prose. Regular expressions here mean their standard dialects, POSIX extended (IEEE Std 1003.1, Base Definitions § 9.4) and ECMAScript (ECMA-262 § 22.2); other engines' dialects differ. Where the semantics is prose, two engines checking each other stand in for it.
- **A mature toolchain:** each DSL has two or more solid free, offline engines: lxml and elementpath for XPath; Saxon-HE and BaseX for XQuery; `jsonpath-rfc9535` (Python) and `@swaggerexpert/jsonpath` (JavaScript) for JSONPath, both passing the RFC 9535 compliance suite (ours, ran); SQLite, DuckDB and PostgreSQL for SQL; DuckDB's DuckPGQ extension, which lags DuckDB's releases, and Oracle Database Free, free of charge but not open source, for SQL/PGQ; rdflib, Oxigraph and Jena for SPARQL; Soufflé and clingo for Datalog, whose dialects differ, so a cross-check translates between them; python-dateutil and rrule.js for recurrence rules; GNU grep and BusyBox grep for POSIX regular expressions, Node.js and the `regress` library for ECMAScript's. Checking is running them, so no solver is needed for most tasks (ours).
- **Data that matters:** each DSL reaches one kind of data (documents, JSON, tables, property graphs, knowledge graphs, facts, calendars, text); Datalog "underpins reasoning tasks such as program analysis" ([DatalogBench](#/papers/li2026datalogbench "DatalogBench: Evaluating Large Language Models on Text-to-Datalog Synthesis (2026)") abstract). As homes for 10× goals they differ (its § 1): SQL H; Datalog, SPARQL and SQL/PGQ M; regular expressions and XQuery L.
- **A data language for LLMs, many times over:** LLM agents are typically built to act through the Linux shell or a Python interpreter ([SWE-agent](#/papers/yang2024sweagent "SWE-agent: Agent-Computer Interfaces Enable Automated Software Engineering (2024)") §1). Each DSL a model uses reliably adds a precise way to query and change one kind of data, and a skill that works across DSLs would add them all (ours; no source yet shows agents failing for want of them).

## Explore

- **[Papers](#/papers)**: what each paper does, with links to the paper and its code.
- **[Tags](#/tags)**: topic tags linking papers, projects and challenges.
- **[Challenges](#/challenges)**: open research challenges, why they matter, why they are hard, and what signal can check an answer.
- **[Glossary](#/glossary)**: the field's terms in plain words.
