# ProcArena: A Multi-Scenario Benchmark for LLMs on Direct and Interactive PL/SQL Development from Natural Language

**ProcArena** · PVLDB 20(1) (reference-format block; not yet published) · 2026

Read: [PDF](https://arxiv.org/pdf/2609.06527) · [arXiv](https://arxiv.org/abs/2609.06527)  
Code: [ProcArena](https://github.com/ZhanGHanG9991/ProcArena)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- An execution-based benchmark of developing PL/SQL from natural language on PostgreSQL and Oracle, in direct and interactive modes (abstract).
- Development scenarios include writing from scratch, modification, debugging and optimization (abstract).
- A PL/SQL benchmark beside [PLSQLBench](#/papers/liu2026plsqlbench "PLSQLBench: Benchmarking LLM Systems for Executable Procedural Database Programming (2026)"), with interactive tasks.

## In plain words

Databases can store PL/SQL programs (procedural extensions of SQL) that wrap SQL in variables, branches and loops. The authors say writing them is difficult in practice, and that earlier work mostly tests one-step writing from a complete request (§1). ProcArena covers nine kinds of work on PostgreSQL and Oracle: writing new code (from scratch, or from a document, examples, a template or components) and changing, speeding up, fixing or completing given code. Each task has a one-shot Direct form with a complete request and, except speed-up tasks, a paired Interactive form with an incomplete one, where the model must ask a simulated user and may inspect the database. Programs are run and their outputs and final data compared with a reference program's. Over seven models, the best average is 62.2% Direct and 57.8% Interactive (Gemini-3.1 Pro, both databases pooled, speed-up tasks excluded) (abstract, §5.2). To their knowledge it is "the first benchmark to evaluate LLMs on NL-to-PL/SQL across multiple development scenarios in both Direct and Interactive modes across PostgreSQL and Oracle" (§1); NL-to-PL/SQL means writing PL/SQL from natural-language (NL) requests.

## Background and terms

**Terms to know:** [stored procedure and trigger](#/glossary/stored-procedure-and-trigger) · [SQL dialect](#/glossary/sql-dialect) · [text-to-SQL](#/glossary/text-to-sql) · [execution accuracy](#/glossary/execution-accuracy) (this paper's version below)

**The paper's own terms:**
- **PL/SQL**: "procedural extensions of SQL, including Oracle PL/SQL [1], PostgreSQL PL/pgSQL [2], and related dialects" (§1, footnote 1). ProcArena focuses on stored procedures (SPs) (§6).
- **NL-to-PL/SQL task**: produce PL/SQL code from a natural-language (NL) requirement, a database description (schema plus metadata) and an optional task attachment (§2, Eq. 1). The **Solver** is the LLM under test with its allowed actions (Eq. 2).
- **Direct mode**: one turn; a complete requirement, one submission, no questions or tools (§2.1, §3.2.2). **Interactive mode**: the requirement "may be underspecified"; the Solver may question the **User Simulator** (a held-out LLM restricted to user-facing information, §3.3.2; DeepSeek V4 Flash for every Solver, §5.1) and query the database through tools (§2.2, Tab. 2).
- **Synthesis and Editing**: A1 from scratch, A2 document-grounded, A3 example-guided, A4 template instantiation, A5 code composition (§5.2 calls it "A5 Orchestration"); B1 functional modification, B2 performance optimization, B3 code repair, B4 code completion (§3.2.1).
- **Seed task**: a validated requirement–code pair with database, initial state and **call suite** (an ordered list of calls, kept only if they change the database state), from which all variants are built; the **gold (reference) procedure** stays unchanged and hidden (§3.1.1, §3.2.2, §5.1).
- **Execution accuracy (EX), as used here**: install the candidate from the initial state, run the call suite, and count the task solved only if the outputs and the final persistent state equal the gold procedure's (§5.1, Eq. 13). The glossary entry describes the text-to-SQL query-result version.
- **Ledgers**: the facts, definitions and resolutions the User Simulator may give out (§1), each answered by its "holder", the simulator part that owns that ledger; questions with no matching entry go to a fallback channel holding an NL description of the gold behavior (§3.3.2).
- **Knowledge Injection** (called Knowledge Integration in the abstract, §1's contributions, Fig. 2 and §7): rewrites that need domain, logical or commonsense knowledge to read. **Requirement Perturbation**: Information Omission (drop a necessary but recoverable detail) and Contradiction Injection (a conflict inside the requirement, or with the database) (§3.3.1).
- **Retention**: Interactive EX divided by Direct EX (§5.4).
- **Acceleration and work** (B2): gold-over-candidate ratios of median wall-clock time and of "a deterministic work counter" (database operations, §5.3); 1.0 matches the gold procedure, larger is better, after a semantic-equivalence gate (§5.1).

**Missing glossary terms:**
- **Cyclomatic complexity**: a count of the independent paths through a program's control flow, growing with each branch and loop (Tab. 3).

**Builds on:**
- PLForge (ref. [50], not listed here), to the authors' knowledge "the first study specifically targeting NL-to-PL/SQL" (§6): its Hard and WeBridge datasets, on databases derived from Spider ([Spider](#/papers/yu2018spider "Spider: A Large-Scale Human-Labeled Dataset for Complex and Cross-Domain Semantic Parsing and Text-to-SQL Task (2018)"), a cross-domain text-to-SQL benchmark), are a seed source (§3.1), and EX adapts "PLForge's execution-match principle" (§5.1).
- LogicCat (ref. [33], a text-to-SQL benchmark of complex reasoning, not listed here): its databases and NL-to-SQL examples prompt LLMs to write the other seeds (§3.1).
- Four prior NL-to-PL/SQL test sets compared in Tab. 3: PLForge Simple and Hard, ProcBench, WeBridge (§4.1).
- BIRD-INTERACT ([BIRD-INTERACT](#/papers/huo2025birdinteract "BIRD-INTERACT: Re-imagining Text-to-SQL Evaluation for Large Language Models via Lens of Dynamic Interactions (2026)")), interactive text-to-SQL with users and database environments, which the authors say targets declarative SQL, not PL/SQL (§1, §6).

## Problem and setting

- **Question:** how well LLMs develop PL/SQL from NL across scenarios, with complete and with underspecified requirements (§1).
- **Scenarios:** from 1,535 Stack Overflow and Database Administrators Stack Exchange posts, "most could be broadly categorized into two categories", no code yet or code to change (§3.2.1).
- **Corpus:** 2,119 Direct tasks (our sum of §4.2's per-dialect counts) and 1,879 paired Interactive episodes over 157 databases; B2 is Direct-only "because it uses runtime-based evaluation" (§3.3.1, §4.2).
- **Set-up (§5.1):** PostgreSQL 12.22 and Oracle Database 21c Express Edition; GPT-5.5, GPT-5.4 Mini, GPT-5.2, Gemini-3.1 Pro, GLM-5.3, GLM-5.2, DeepSeek V4 Pro; reasoning effort high where exposed; "we run each task once". Interactive runs get at most 60 recorded steps and a visible budget (questions two units, tools 0.5–1, submit free); submit "returns no execution-accuracy feedback" (§3.3.2).
- **Correctness:** EX on one initial state and one call suite (Eq. 13); B2 scores acceleration and work by harmonic mean (§5.3).
- **Not discussed:** which LLM the construction steps use (only "held-out", §3.1.1), and how outputs are compared (row order, NULLs).

## Approach

- **Seeds (§3.1, Alg. 1):** Iterative Logic Enhancement has a held-out LLM add "one reasonable business rule in each round" to code and requirement, to keep pairs "sufficiently challenging" (§3.1.1). The result is executed, repaired from execution feedback within a budget, checked for alignment by a validation LLM, and given a call suite.
- **Direct tasks (§3.2.2, Tab. 1):** LLM-driven scenario adapters rewrite the requirement and add a task attachment when needed (none in A1, Tab. 1). Editing attachments come from deterministic transformations of the gold code: revert a business rule, add a behavior-preserving slowdown, inject a defect, remove a block. Candidates must pass three common checks (attachment validity, non-triviality, alignment by execution) and the checks of Tab. 1.
- **Interactive tasks (§3.3.1, Alg. 2, Fig. 3):** only the requirement changes. An omitted detail counts as necessary if code meeting the rest could behave differently from the reference on the same call suite and initial state; "Each injected conflict has a unique resolution that is consistent with the gold PL/SQL code".
- **Protocol (§3.3.2, Tab. 2):** ask_user, ask_selector (pick among candidate readings), six database tools (schema, table metadata, sample rows, compile, and running and resetting a scratch copy), and submit. Environment actions "expose database facts only and never infer user intent".

## Results

- **Overall (Tab. 6, §5.2):** Gemini-3.1 Pro leads both modes, pooled over dialects; GPT-5.5 follows, DeepSeek V4 Pro is last. "Even in the Direct mode, where the requirement is complete and no interaction is needed, the best model is wrong on more than a third of the tasks."
- **Synthesis against Editing (§5.2):** close in Direct (59.8% against 66.2% for Gemini-3.1 Pro), apart in Interactive (48.1% against 73.5% for the same model). A2 scores higher in Interactive for Gemini-3.1 Pro and GLM-5.3, and B3 for Gemini-3.1 Pro. The authors' explanation: the Editing attachment "already fixes most of what requirement perturbation removed", and A2 and B3 are about grounding rather than specification.
- **Optimization (§5.3, Fig. 4):** every model "matches or beats the gold procedure on most tasks in both dialects", but GPT-5.4 Mini's highest acceleration, 1.51, comes with a work mean of 0.18. From single worst answers (GLM-5.2's and GPT-5.4 Mini's) the authors conclude "An answer can therefore look correct on the clock while doing hundreds of times the database work."
- **Interaction (§5.4, Figs. 5–7):** retention runs from 98.2% (GLM-5.3) to 64.5% (DeepSeek V4 Pro). GLM-5.3, GLM-5.2 and Gemini-3.1 Pro iterate on the scratch database; GPT-5.5 reads data and compiles; "Neither the volume of interaction nor the volume of questions predicts retention."
- **Errors, Interactive mode (§5.5, Fig. 8):** "Models rarely crash." Control-flow and persistent-state errors, which the authors say have "no analogue in declarative SQL", account for between 25.5% and 46.6% of the tasks each model ran; DeepSeek V4 Pro's Schema (wrong table or column) and Contract (installation or interface mismatch) rates are "several times any other model's".
- **Validation (§5.6):** auditors blind to model identity judge 85.6% of 180 sampled ask_user replies acceptable; the authors conclude "The simulator thus provides reliable feedback with negligible answer leakage" (Fig. 9). Tab. 7 (four models): "Every construction operation lowers EX on its own, and the full pipeline lowers it most."
- **Difficulty (§4.1, Tab. 3):** more statements and higher cyclomatic complexity on average than prior test sets.

## Limits the authors state

- "both PLForge and the current version of ProcArena focus on SPs", though real workloads also contain user-defined functions and triggers (§6).
- B2 has no Interactive form, because it is scored by run time (§5.1).
- "On a scaled test table those extra operations cost little wall-clock time; on production volumes they would not", hence work is reported beside time (§5.3).
- Retention "is also unstable when the denominator is small", so GLM-5.3's retention should be read against its Direct EX (§5.4).

## Open problems and building blocks

- **Open:** no future work is stated. The authors conclude that "realistic NL-to-PL/SQL development remains challenging, particularly in interactive settings" (abstract), and call the scarcity of high-quality PL/SQL data in public repositories "a major obstacle to PL/SQL-specific model adaptation" (§6).
- **Released:** "The source code, data, and/or other artifacts have been made available" (title page, PVLDB artifact box); the abstract points to a public website; "We released the benchmark, the interaction traces, and the construction pipeline for reproducible evaluation" (§7).
- **To reuse it:** both database systems, an LLM as User Simulator, LLMs for construction, and for B2 tables scaled to a recorded row count in a rolled-back transaction, five timed runs in rotating order (§5.1, §5.3). Mean tokens per Interactive episode: 38.5k (GPT-5.5) to 123.8k (GLM-5.2) (§5.4).

## On this site

- **Tags:** <span class="tags"><a class="tag" href="#/tags/dbtask">dbtask</a><a class="tag sub" href="#/tags/harness-sql">harness-sql</a><a class="tag sub" href="#/tags/llm-gen">llm-gen</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/nl2sql-misc">nl2sql-misc</a></span>
