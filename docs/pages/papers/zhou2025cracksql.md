# Cracking SQL Barriers: An LLM-based Dialect Translation System

**CrackSQL** · PACMMOD / SIGMOD 2025

Read: [PDF](https://arxiv.org/pdf/2504.00882) · [arXiv](https://arxiv.org/abs/2504.00882) · [DOI](https://doi.org/10.1145/3725278)  
Code: [CrackSQL](https://github.com/OpenDataBox/CrackSQL)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Hybrid dialect translation: rules where they apply, LLMs for the rest, with segmentation of long queries.
- A cross-dialect embedding model matches source operations to target-dialect syntax elements via their specifications (§3, §5).
- Correctness is "functional equivalence" (Def. 2.1), checked at translation time only by a target-dialect BNF parse plus an LLM's judgment, without execution (§6, PDF p. 15).

## In plain words

Moving an application to another database system means rewriting its SQL, since syntax and functions differ. The authors say rule-based translators "often" miss operations, translate some wrongly, or suit only some database versions, and that using an LLM directly "remains impractical": LLMs "often struggle" with subtle syntax differences, and long queries raise the risk of hallucination (abstract, PDF p. 1; §1, PDF pp. 2–3).

Their system, CrackSQL, cuts a query into pieces along its parse tree, finds those the target grammar rejects, retrieves matching target syntax with a purpose-trained embedding model, and has an LLM translate only those pieces, widening a piece when it fails. A grammar check and an LLM's judgment of equivalence, without running the query, decide acceptance. On query pairs collected for PostgreSQL, MySQL and Oracle, CrackSQL with its default LLM, GPT-4o (§7.1, PDF p. 16), beats every baseline in all six directions (§7.3, PDF p. 17), with result-accuracy gains over the rule tool SQLGlot of "3.22%-21.95%" and over GPT-4o of "7.69%-34.93%". They present a "new dialect translation paradigm" (§1, PDF p. 3), not a first.

## Background and terms

**Terms to know:** [SQL dialect](#/glossary/sql-dialect) · [abstract syntax tree (AST)](#/glossary/abstract-syntax-tree-ast) · [text-to-SQL](#/glossary/text-to-sql) · [query rewriting and rewrite rules](#/glossary/query-rewriting-and-rewrite-rules) · [LLM-as-a-judge](#/glossary/llm-as-a-judge) · [BM25](#/glossary/bm25) · [LoRA (low-rank adaptation)](#/glossary/lora-low-rank-adaptation) · [BNF (Backus–Naur Form)](#/glossary/bnf-backus-naur-form) · [contrastive learning with hard negatives](#/glossary/contrastive-learning) · [mixture of experts (MoE)](#/glossary/mixture-of-experts-moe)

**The paper's own terms:**
- **functional equivalence** (Def. 2.1, PDF p. 5): a target operation is equivalent to a source one if it "produces the same execution results or has the same effect"; Def. 2.2 asks the translated query to "strictly follow the target dialect syntax" and keep this equivalence.
- **syntax element** (§2.1, PDF p. 4): a keyword, function or operator; an **operation** is the piece of a query one element's tree matches, e.g. a CAST call (§4.2, PDF pp. 8–9).
- **specification**: an element's documentation text: function, usage constraints, arguments and defaults, examples (§4.1, PDF p. 8).
- **local failure** (§3, PDF p. 7): an *incompatibility* (the target grammar parser rejects the operation) or an *insufficiency* (translation from local syntax fails, e.g. the LLM exceeds its maximum trials).
- **Acc_EX, executable ratio** (§7.1, PDF p. 16): the share of translated queries that run on the target without an incompatibility error. **Acc_RES, result accuracy**: the share returning "strictly identical results" to the source query, "including the returned data format, precision, and displayed order".
- **retrieval precision** (§7.1, PDF p. 16): the success rate of retrieving the right specification among the top k.

**Builds on:**
- The rule-based translators SQLGlot and jOOQ (open-source rule engines) and SQLines (closed-source) (§1, PDF p. 2; §7.1, PDF p. 16). SQLGlot also supplies function mappings (§4.3, PDF p. 9), a rule tool beside the LLM (§3, PDF p. 7) and training pairs (§5.2.1, PDF p. 13).
- Direct LLMs: GPT-4o, CodeLlama-7B, Llama3.1-8B-Instruct (§7.1, PDF p. 16).
- Pretrained encoders: the code model StarEncoder for structure, and three text-embedding models from the MTEB (Massive Text Embedding Benchmark) leaderboard for specifications (§5.1, PDF p. 10; §7.1, PDF p. 16).
- Mallet [36], a vision paper generating translation rules as text with LLMs, which the authors say lacks technical details and experiments (§8, PDF p. 24).

## Problem and setting

- **Question:** translate a query into a target dialect, following its syntax and keeping functional equivalence (Def. 2.2, PDF p. 5).
- **Scope:** the translation types "mainly" considered are syntax rules, keywords, built-in functions and operators, and data types (§2.2, PDF p. 5).
- **Systems:** MySQL 8.0, PostgreSQL 14, Oracle 11g (§7.1, PDF p. 16).
- **No execution:** validation does not run queries in a database, which the authors say "is generally not allowed in real scenarios" (§6, PDF p. 15).
- **Data:** the authors spent "around 6 human months" collecting 248, 142 and 111 query pairs for PostgreSQL↔MySQL, PostgreSQL↔Oracle and MySQL↔Oracle, from text-to-SQL benchmarks (e.g. BIRD, extended to Oracle), GitHub repositories (e.g. SQLGlot, jOOQ: issues and tests) and Q&A sites like StackExchange (§7.2, PDF p. 17).
- **Scoring:** Acc_EX and Acc_RES, running the translation on the target and the original on the source (§7.1, PDF p. 16).

## Approach

- **Offline preparation (§3, PDF p. 7; §4.1, PDF p. 8).** Syntax elements are extracted from each system's parser files, turned into BNF trees, and annotated automatically with specifications from official documentation.
- **Functionality-based Query Processing (§4.2–4.3, PDF pp. 8–9).** Each subtree of the query's syntax tree that exactly matches a known syntax element becomes one operation. Rules then normalize customized functions into common ones (ILIKE, PostgreSQL's case-insensitive pattern match, into LOWER … LIKE LOWER …) and replace translation-irrelevant parts with placeholders.
- **Cross-Dialect Embedding Model (§5, PDF pp. 9–13).** A code encoder over an element's tokens and a mixture of text encoders over its specification, merged by cross-attention (Eqs. 1–5, PDF pp. 10–11). Training (Retrieval-Enhanced Contrastive Learning, §5.2, PDF p. 12) uses samples generated "fully automated without human intervention" (§3, PDF p. 7): positives from rephrased specifications, same-keyword elements of other systems and SQLGlot translations, plus selected hard negatives (Fig. 5, PDF p. 12). It is trained once for all dialect pairs.
- **Local-To-Global translation (Alg. 1, PDF p. 14; §6, PDF pp. 14–15).** Each operation that raises a warning under the target BNF is translated alone by an LLM (GPT-4o by default), given the source and retrieved target specifications (k = 3, §7.1, PDF p. 16), optionally with rule tools. If the LLM fails within its maximum trials, the operation is widened to neighbouring ones (a CAST to the whole SELECT). The aim is to support many-to-one cases such as PostgreSQL's EXTRACT (take a date field) of AGE (the difference between two dates; §1, PDF p. 2) becoming MySQL's TIMESTAMPDIFF (a date difference in a given unit) (§6, PDF p. 14).
- **Hybrid validation (§6, PDF p. 15).** Step 1 re-parses the translation with the target grammar; once no warning remains, step 2 gives an LLM both queries and the specifications to reason about their equivalence ("typically easier than conduct translation"). The steps alternate until no error is found; the authors say this lets them "effectively evaluate the functionality equivalence of the translated query".

## Results

- **Main comparison (Tab. 1, PDF p. 17; §7.3, PDF pp. 17–18)**. Baselines: SQLGlot, jOOQ, SQLines, Ora2Pg (a migration tool into PostgreSQL, two directions) and GPT-4o. CrackSQL is best in all six directions on both metrics. The paper reports result-accuracy gains of "3.22%-21.95%" over SQLGlot and "7.69%-34.93%" over GPT-4o (differences of Table 1 values); the abstract's "up to 77.42%" names no metric. CrackSQL's weakest direction is MySQL→Oracle: 42.68% result accuracy against 35.37% for jOOQ, the best baseline there.
- **Errors (§7.4, PDF pp. 18–20; Fig. 7a–b, PDF p. 18).** On MySQL→Oracle most of GPT-4o's errors break syntax rules and jOOQ's are mostly built-in functions; data types are "a large proportion" of SQLGlot's, as "a no-dependency SQL parser" cannot capture column types. Table 3 (PDF p. 20) lists translations CrackSQL handles and some tools don't. The authors attribute most Acc_EX–Acc_RES gaps to engine differences: numeric precision, and row order when there is no ORDER BY.
- **Ablations (Tab. 2, PDF p. 19; §7.5.1–7.5.3, PDF pp. 20–22)**, on Oracle→PostgreSQL and Oracle→MySQL: the authors report that "all the designs in these components contribute", with query segmentation improving accuracy "by 48.91% on average".
- **Retrieval (Tab. 4, PDF p. 21).** Against BM25, StarEncoder, three text-embedding models and their concatenation, the authors' model has the highest precision for k from 1 to 5; in a t-SNE 2-D projection (Fig. 8, PDF p. 21) its embeddings "cluster the specifications by their functionalities better than other methods" (§7.5.2, PDF p. 22).
- **Other LLMs (Tab. 5–6, PDF p. 22; §7.5.4, PDF p. 23)**. CrackSQL improves each of CodeLlama-7B, Llama3.1-8B-Instruct and GPT-4o; with Llama3.1-8B-Instruct it is "only 6.67% worse" in Oracle→MySQL result accuracy than with GPT-4o; the authors conclude it does not "heavily depend" on reasoning skills. LoRA fine-tuning on SQLGlot-translated pairs is "less stable", and lowered Llama3.1-8B's MySQL→PostgreSQL accuracy.
- **Execution feedback (Tab. 7, PDF p. 23).** LLMs given execution errors still score below CrackSQL and "cannot make all the queries executable".
- **Trials (Fig. 9, PDF p. 23)**: accuracy "converges when the maximal trial arrives 3".

## Limits the authors state

- The translation types are "constrained by the available BNF grammar" (§9, PDF p. 24).
- Accuracy "could be further enhanced", e.g. for "precision loss issues like DOUBLE v.s. DOUBLE PRECISION" (§9, PDF p. 24).
- New dialects with "incomplete or poorly structured documents" need human intervention: some documents only list function names or merge several specifications in one paragraph, "necessitating manual annotation and clarification" (§9, PDF p. 24).
- Noisy training samples can lead to retrieving the wrong target syntax; the authors say such errors "can still be detected" by validation (§5.2.1, PDF p. 13).

## Open problems and building blocks

- **Open:** "automatic grammar integration methods [35]" to cover more translations, e.g. "for UDFs and stored procedures" (user-defined functions; [stored procedures](#/glossary/stored-procedure-and-trigger)) (§9, PDF p. 24).
- **Released:** the code (abstract, PDF p. 1); real-world queries translated by CrackSQL (footnote 1, PDF p. 2); the specification-annotation scripts (footnote 5, PDF p. 7); the LLM prompts (footnote 8, PDF p. 16); "The evaluation set and the translation result" (footnote 9, PDF p. 17).
- **To reuse it:** per-dialect BNF definitions and annotated documentation (§4.1, PDF p. 8); the embedding model, the vector database ChromaDB and an LLM; the authors used four RTX 3080 Ti GPUs (§7.1, PDF p. 16). No run time or cost is reported.

## On this site

- **Discussed in:** [Telling bad translations from legitimate engine differences](#/challenges/bad_translation_detection) · [SQL dialect translation](#/challenges/dialect_translation) · [Equivalence of nondeterministic queries](#/challenges/nondeterministic_equivalence)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/dialect-translate">dialect-translate</a><a class="tag sub" href="#/tags/harness-sql">harness-sql</a><a class="tag sub" href="#/tags/judge-sql">judge-sql</a><a class="tag sub" href="#/tags/llm-gen">llm-gen</a><a class="tag sub" href="#/tags/llm-method">llm-method</a></span>
