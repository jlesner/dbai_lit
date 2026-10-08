# RuleFlow: Generating Reusable Program Optimizations with LLMs

**RuleFlow** · preprint 2026

Read: [PDF](https://arxiv.org/pdf/2602.09051) · [arXiv](https://arxiv.org/abs/2602.09051)  
Code: [RuleFlow](https://github.com/ADAPT-uiuc/RuleFlow)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Optimizes pandas notebooks (not SQL) by turning LLM-found rewrites of single code cells into general rewrite rules with runtime preconditions, which a deterministic compiler then applies to unseen notebooks with no LLM calls (abstract; §3).
- Discovery: an LLM proposes faster variants of each cell, kept if they match the original on random dataframes and pass a speed threshold, and an adversarial LLM looks for counterexamples whose findings go back to the generator (§3.1). Four LLM agents then abstract variables, constants and AST types and write preconditions in a rule DSL taken from Dias (§3.2). GPT-4.1, learning on Kaggle notebooks, evaluated on PandasBench against Dias, Modin, Dask and Koalas (§4).
- The nearest analogue to rewrite rules learned from checked LLM rewrites, and its gap: the test checks concrete pairs before they are generalized, and no rule is tested after (§3.1–3.2). The authors excluded 32 of the 120 generated rules after a manual "qualitative analysis" found correctness issues (§4.2), from errors such as wrong generalization and unhandled NaNs (App. D); the exclusions are not counted by type, and some rules with a known corner-case error stayed in the evaluation (App. D).

## In plain words

pandas is a Python library for in-memory tables, used in data-science notebooks. The authors say existing speed-up tools are either heavyweight or support only a limited set of optimizations, while asking an LLM to rewrite each program is unreliable and expensive (abstract): of 4,138 LLM rewrites of notebook cells, 2,639 passed their equivalence test and only 235 also ran faster (§1). RuleFlow instead uses the LLM offline: it keeps the rewrites that pass tests on random inputs and a speed check, has LLM agents turn each into a general rewrite rule with conditions checked at run time, and a compiler applies the rules to new notebooks with no LLM calls (§1, §3). With GPT-4.1, on PandasBench (102 real notebooks, default input sizes), they report a mean speedup of 1.54× (at most 4.3×) over Dias, in their words the previous compiler-based state of the art (Tab. 1; §4). They call RuleFlow "the new state-of-the-art (SOTA)" (abstract) and claim "for the first time" an approach "to use LLMs for program optimization that focuses on discovering optimizations that generalize across programs" (§2.2).

## Background and terms

**Terms to know:** [abstract syntax tree (AST)](#/glossary/abstract-syntax-tree-ast) · [query rewriting and rewrite rules](#/glossary/query-rewriting-and-rewrite-rules) · [differential testing](#/glossary/differential-testing) · [formal semantics](#/glossary/formal-semantics)

In the glossary's terms (ours): a RuleFlow rule is a rewrite rule over Python code, not SQL; EquivCheck is differential testing of a cell against its rewrite.

**The paper's own terms:**
- **per-program optimization**: "prompting an LLM to optimize each Python code snippet that uses the pandas API" (§1).
- **systems-based and compiler-based solutions**: the two kinds of prior pandas optimizers (§1). Systems-based ones (e.g. Modin, Dask, Koalas) are alternate implementations of the pandas API (§2.1); compiler-based ones (Dias, SCIRPy) rewrite the user's code but rely on "a limited set of manually engineered patterns or rewrite rules" (§1).
- **SnippetGen, RuleGen, CodeGen**: the three stages, called discovery, bridge and deployment (§3, Fig. 3).
- **CandidateGen, EquivCheck, OptCheck, FeedbackGen**: SnippetGen's steps: propose, test equivalence, check speed, seek counterexamples (§3.1).
- **pair**: an original cell and a rewrite of it that passed EquivCheck and OptCheck (§3.1).
- **rewrite rule**: written in a subset of Dias's rule language: an LHS, "the code pattern to match"; an RHS, "the optimized code"; and preconditions, "the constraints under which the rule is applicable" (§2.3). An abstract variable such as `@{Name: v1}` matches any expression of that AST node type (§2.3). Fig. 2's rule turns `v1 = v1.drop([c1], axis=1)` into `v1.pop(c1)` when `v1` is a DataFrame that has column `c1`.
- **runtime preconditions**: Python boolean expressions (App. A.2) evaluated when the rewritten cell runs; the original code runs when they fail (§3.3, Fig. 4).
- **hit**: "when a rule applies to a piece of code, then it hits" (§4.2).
- **speedup** in Tab. 1 is RuleFlow's relative to each baseline (Tab. 1 caption); in Fig. 5 it is relative to plain pandas (§4.1).

**Missing glossary terms:**
- **dataframe**: pandas's in-memory table with named, typed columns; the test inputs are random dataframes (§3.1). The paper doesn't define it.
- **exploratory data analysis (EDA)**: interactive, step-by-step analysis of a dataset, a workload pandas is widely used for (§1); not the glossary's evolutionary-algorithm EDA.

**Builds on:**
- **Dias** (Baziotis et al., 2024), "a dynamic rewriter for Pandas code" with a fixed set of rewrite rules (§2.1); RuleFlow uses a subset of its rule language (§2.3) and compares against it as "the prior compiler-based SOTA" (§4). Not on this site.
- **PandasBench** (Broihier et al., 2025), the benchmark of Kaggle notebooks whose baselines (Dias, Modin, Dask, Koalas) RuleFlow reuses (§4). Not on this site.
- **Per-program LLM optimizers** it contrasts with, among them GenRewrite ([GenRewrite](#/papers/liu2024genrewrite "GenRewrite: Query Rewriting via Large Language Models (2026)")) and R-Bot ([R-Bot](#/papers/sun2024rbot "R-Bot: An LLM-based Query Rewrite System (2025)")), LLM rewriters of SQL queries, and AlphaEvolve ([AlphaEvolve](#/papers/novikov2025alphaevolve "AlphaEvolve: A coding agent for scientific and algorithmic discovery (2025)")), an evolutionary coding agent; the authors say these "require repeated LLM calls and don't generalize beyond the specific programs" (§2.2).

## Problem and setting

- **Question:** "Can we combine the benefits of traditional approaches and LLM-based optimizations, while avoiding their respective limitations?" (§1).
- **Code:** notebook cells that call the pandas API. The learning set is 199 notebooks from Kaggle (a data-science site) collected with KGTorrent, a dataset of Kaggle notebooks (§4; reference list); cells that can't be scaled to run at least 1 second are dropped, leaving 1,237 (§4.4).
- **What "correct" means:** "Because pandas and Python lack formal semantics", equivalence is tested: both versions run on a set of random dataframes and must give the same output on every one (§3.1). How the random dataframes are built and how outputs are compared (e.g. floating-point tolerance) is not discussed; missing values (NaN) are, in App. D.
- **What "faster" means:** OptCheck keeps a candidate only if its average improvement exceeds both an absolute threshold (150 ms) and a relative one (§3.1).
- **Rules:** checked by the compiler for syntax and by LLM checkers (§3.2), then filtered by hand (§4.2).
- **Model and benchmark:** GPT-4.1 for SnippetGen and RuleGen (§4). Evaluation on PandasBench at the default (unscaled) input sizes, against Dias, Modin, Dask and Koalas, none of which can execute every notebook (§4).

## Approach

- **Discovery, SnippetGen (§3.1).** CandidateGen prompts the LLM for rewrites of each cell (1–5 per cell after deduplication, §4.4). FeedbackGen, an LLM prompted as "an adversarial code analysis verifier" (App. A.1), looks for counterexamples. If it finds none the pair is accepted; otherwise the counterexamples go back to the generator, which may refute them with preconditions later in RuleGen, repair the rewrite, or abandon the pair (§3.1).
- **Bridge, RuleGen (§3.2).** Four LLM sub-agents turn a pair into a rule: A1 Variable and Constant Generalizer (what to abstract), A2 AST Type Resolver (node types), A3 Rule Constructor (builds LHS and RHS; the compiler checks syntax), and A4 Precondition Synthesizer, whose preconditions are "inferred to maximize rule validity across the original and synthetically perturbed program instances" (§3.2). Each agent has "combined LLM and deterministic checks" and up to 3 feedback rounds (§3.2).
- **Deployment, CodeGen (§3.3).** Each LHS is compiled into a structural matcher. Because preconditions may depend on runtime facts such as dataframe shapes or column types, a matched cell becomes a conditional: the RHS when they hold, the original otherwise (Fig. 4). When several rules match, the evaluation uses a greedy scheduler that ranks rules by the performance impact seen in OptCheck (§3.3). No LLM is called.

## Results

- **End to end (§4.1, Tab. 1).** RuleFlow ran 101 of the 102 notebooks; Dias ran 97, Modin 72, Dask 3 and Koalas 10. It reports RuleFlow's speedup over Dias as mean 1.54×, median 1.13×, maximum 4.3× and minimum 0.80×, and over Modin as mean 112.79× and maximum 1914.89×. Against plain pandas, Fig. 5 shows RuleFlow ahead of the baselines "for most notebooks" (§4.1).
- **Yield, candidates to rules (§1, §4.2, §4.4, Figs. 9–10).** Of 4,138 candidates, 2,639 passed EquivCheck and 235 also passed OptCheck (§1); after the feedback round 157 pairs were accepted (§4.4), which the authors read as showing that "the per-program optimization approach is impractical" (§4.4). RuleGen turned them into 120 rules, and excluding those with "correctness issues identified during qualitative analysis" left 88 (§4.2).
- **Hits (§4.2–4.3, Figs. 6–8).** 24 of the 88 rules hit at least one PandasBench notebook, and the scheduler used 17 of them (§4.2). 88 of the 102 notebooks had at least one rule application (§4.3). Some rules apply widely, others rarely (Fig. 8).
- **Where the speed comes from (§4.5, Tab. 2).** "A major source of speedups is the elimination of unnecessary data copying" (R1, `rename` with `inplace`); R2 (column selection with `loc`) gives more modest speedups but such rules "tend to be broadly applicable"; R3 slowed a cell whose preconditions failed at run time.
- **Single agent against four (App. C).** On 50 sampled pairs, judged by hand, 18% of a single agent's rules were correct against 68% of RuleGen's. RuleGen removed the syntax and AST-type errors, but in some cases still wrote `hasattr`-based or costly preconditions or left constants unabstracted (App. C.2–C.3).

## Limits the authors state

- "Since equivalence is established via testing rather than formal verification, candidate rewrites may still fail on unseen inputs" (§3.1). Formal correctness guarantees for the rules are "out of the scope of this work due to the absence of formal semantics for Python and pandas" (§6).
- "LLM use occasionally leads to errors" (§4.5); rules with correctness issues were excluded by hand before the evaluation (§4.2).
- Incorrect generalization is not caught by EquivCheck, because it comes from the original code; "for every other application of the rule, the RHS will either crash or give an incorrect output" (App. D).
- NaN rules: "This rule is only correct when the input data does not have any NaNs"; the authors chose not to filter such rules during discovery and excluded them from the evaluation (App. D).
- In-place rules "can lead to incorrect behavior in rare corner cases due to data-flow dependencies across notebook cells"; they were kept in the evaluation as "corner-cases" (App. D).
- Precondition cost: when a rule matches but its preconditions fail, "This still leads to a slowdown due to the overhead of computing preconditions" (§4.5); rules whose RHS equals the LHS "will always give a minor slowdown", and preconditions that evaluate both sides end up "rendering the rule impractical" (App. D).
- "it is common for rewrite rules not to hit in certain workloads" (§4.2; App. B).
- "optimization-discovery and rule generation remain challenging" (§1).

## Open problems and building blocks

- **Open:** "More sophisticated scheduling strategies can be incorporated in future work" (§3.3); "cost-aware precondition synthesis and richer semantic modeling" (§4.5).
- **Released:** code: "Our code is available at …" (abstract). All prompts are printed (App. A, App. C.4).
- **To reuse it:** an LLM (GPT-4.1 here) and a corpus of notebooks to learn from (§4); running and timing each cell on random dataframes (§3.1); Dias's rule language and CodeGen's runtime checks (§2.3, §3.3); at most 3 feedback iterations in RuleGen (§3.2).
- **Beyond its domain:** the authors "believe that separating discovery from deployment, along with a bridge component, could offer a promising framework for other optimization venues" (§1).

## On this site

- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/cex-general">cex-general</a><a class="tag sub" href="#/tags/cex-llm">cex-llm</a><a class="tag sub" href="#/tags/cex-search">cex-search</a><a class="tag sub" href="#/tags/rules-discover">rules-discover</a></span>
