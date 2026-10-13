# DSLs for LLMs, LLMs for DSLs

**The domain:** a DSL here is a small language that an engine runs over data: XPath over documents, SQL over tables, SPARQL over knowledge graphs, iCalendar recurrence rules over time, regular expressions over text. Each has a reference engine, so a program's result is computed, not judged. Formats that no engine runs, such as the tag structure of a PDF, are outside this sense.

## DSLs for LLMs

In two senses.

**As the LLM's tool.** An LLM samples each token, so any token can go wrong, and over a long job the chances multiply: on controlled agent tasks, the authors find that success "follows a geometric law in 28 of 36 model-task cells tested, governed by a single measurable quantity: per-step reliability" ([How Fast Do Agents Rot?](#/papers/mittal2026rot "How Fast Do Agents Rot? An Empirical Study of Long-Horizon Degradation in LLM Agents for Production Decision-Making (2026)") p. 2). Context is scarce too: attention compares every pair of tokens, so its cost grows with the square of the context's length (ours). A DSL program moves the procedure out of the model: the model writes a few tokens, and the engine runs them exactly over data of any size. The program is precise where English is ambiguous, and the language's vocabulary (path steps, joins, recurrence parts) carries ways of solving that the model needn't reinvent. The evidence is mixed:
- **For:** as more objects were added to a reasoning task, the PAL authors report that "CoT's accuracy is unstable and drops, while PAL remains consistently close to 100%" ([PAL (Program-aided Language Models)](#/papers/gao2022pal "PAL: Program-aided Language Models (2022)") §5.2); Logic-LM, which hands logic problems to a solver, "becomes increasingly effective as the required reasoning depth increases" ([Logic-LM](#/papers/pan2023logiclm "Logic-LM: Empowering Large Language Models with Symbolic Solvers for Faithful Logical Reasoning (2023)") §4.3), though its own accuracy also falls with depth, less steeply than chain of thought's (Fig. 3).
- **Against:** over 14 tasks and 6 LLMs, "results from LLM written code are not always better than using textual reasoning, even if the task could be solved through code", and models choosing between code and text showed "an astonishingly inverse scaling behavior" ([Steering Large Language Models…](#/papers/chen2024steering "Steering Large Language Models between Code Execution and Textual Reasoning (2025)") abstract).
- **Not yet measured:** a short search on 2026-10-13 found no study of compact open models writing DSLs over data as the data or the task grows, and no measurement of how many tokens a DSL program saves against English for the same task (ours: `//book[price>30]/title` is 23 characters).

**As model problems.** DSL tasks with answers a program checks serve LLM methods as SQL's do; the task families, and how strongly each is checked, are in the table under § One loop, both directions. The engine makes every answer key, so instances come in any number and at any size.

## LLMs for DSLs

The same fluency serves the people who use DSLs: writing them from English, porting them between dialects, checking that two of them agree, explaining one. Formal tools only partly solve these, and unchecked LLMs err, shown domain by domain: SQL, calendars, regular expressions, on weaker evidence. For XPath, the AutoScraper authors report that "models with small parameter sizes have significant difficulties in understanding and writing executable paths" ([AutoScraper](#/papers/huang2024autoscraper "AutoScraper: A Progressive Understanding Web Agent for Web Scraper Generation (2024)") §5.2): on the SWDE web-extraction benchmark, with their own method, 24.06% of Phi-3-medium's generated extraction paths are fully correct (precision and recall both 1, §3.3), against 71.56% of GPT-4-Turbo's (Tab. 2), though such models "can understand webpage content well" and "still struggle to comprehend webpage structures" (§6.1).

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

## Why DSLs

The four reasons given for SQL, for the family:

- **Precise semantics, mostly fixed once:** SQL's semantics are formalized; W3C publishes a [formal semantics](#/glossary/formal-semantics) for XPath 2.0 ("XQuery 1.0 and XPath 2.0 Formal Semantics", W3C Recommendation, 2010, revised 2015), though lxml, the common engine, implements XPath 1.0; the SPARQL 1.1 Recommendation "defines the syntax and semantics" of the language (abstract). iCalendar's are prose, and regular expressions differ by dialect. Where the semantics is prose, two engines checking each other stand in for it.
- **A mature toolchain:** each DSL has free, offline engines (lxml; SQLite and PostgreSQL; rdflib and Jena; python-dateutil; Python `re` and RE2), and checking is running them, so no solver is needed for most tasks (ours).
- **Data that matters:** each DSL reaches one kind of data (documents, tables, knowledge graphs, calendars, text); the domain notes give sourced signs of scale for SQL and calendars, and none is recorded yet for the others.
- **A data language for LLMs, many times over:** LLM agents are typically built to act through the Linux shell or a Python interpreter ([SWE-agent](#/papers/yang2024sweagent "SWE-agent: Agent-Computer Interfaces Enable Automated Software Engineering (2024)") §1). Each DSL a model uses reliably adds a precise way to query and change one kind of data, and a skill that works across DSLs would add them all (ours; no source yet shows agents failing for want of them).

## Explore

- **[Papers](#/papers)**: what each paper does, with links to the paper and its code.
- **[Tags](#/tags)**: topic tags linking papers, projects and challenges.
- **[Challenges](#/challenges)**: open research challenges, why they matter, and what signal can check an answer.
- **[Glossary](#/glossary)**: the field's terms in plain words.
