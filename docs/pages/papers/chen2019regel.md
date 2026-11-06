# Multi-modal Synthesis of Regular Expressions

**Multi-modal Synthesis of Regular Expressions** · PLDI 2020

Read: [PDF](https://arxiv.org/pdf/1908.03316) · [arXiv](https://arxiv.org/abs/1908.03316) · [DOI](https://doi.org/10.1145/3385412.3385988)

<p class="notice">A summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Synthesizes a regular expression from an English description together with positive and negative example strings: a semantic parser turns the English into a ranked list of hierarchical sketches (partial regexes whose holes carry hints), and a programming-by-example engine completes each sketch into a regex consistent with the examples (abstract; §1).
- The parser is built on SEMPRE, with a log-linear model trained on pairs of English and sketches (§6); the engine runs top-down enumerative search over partial regexes, pruning with over- and under-approximations computed from the sketch's hints (§5.1, Thm. 5.4) and with Z3 constraints on string lengths that rule out repetition counts (§5.2, Thm. 5.7); evaluated on tasks adapted from the DeepRegex data set and collected from StackOverflow, against DeepRegex (English only) and an examples-only variant, with up to four rounds of added examples (§8, §9.1), plus an ablation against an adaptation of AlphaRegex (§9.2) and a user study (§9.3).
- An account of wrong or unusable gold in a text-to-regex benchmark: the authors call the DeepRegex data set "quite noisy", with many regexes that do not match their descriptions after paraphrasing (no count given), and report that about 1,400 of its 10,000 regexes denote the empty language (App. C); their adapted set drops a task when more than 3 of the examples written from the English alone disagree with the gold regex, and drops the disagreeing examples when there are two or fewer (App. C), and for its StackOverflow set the gold is written in the DSL so that a library can check its equivalence with the output (App. D).

## In plain words

Writing a regular expression (a pattern that matches a set of strings) is hard, and earlier tools take either an English description or example strings. The authors argue that "natural language alone is often highly ambiguous, whereas examples in isolation are often not sufficient for conveying user intent" (abstract), and that, judging from online forums, most users give both (§1). Their tool, Regel, uses both: a parser turns the English into ranked outlines of the pattern whose gaps carry hints, and a search fills the gaps until the pattern accepts every positive example and rejects every negative one (abstract; §1). On 322 tasks, with up to four rounds that each add two examples after a wrong answer, Regel returns the intended pattern among its top results for 80%, against 43% for DeepRegex (a neural translator from English alone) and 26% for an examples-only version of Regel (§9.1 Result 1; §11). In their small 20-person user study, people were about twice as likely to reach the intended pattern in the time limit with Regel (§9.3). The authors present "a new multi-modal synthesis algorithm" (§1), not a first.

## Background and terms

**Terms to know:** [program synthesis](#/glossary/program-synthesis) · [regular expression and regular language](#/glossary/regular-expression-and-regular-language) · [domain-specific language (DSL)](#/glossary/domain-specific-language-dsl) · [semantic parsing](#/glossary/semantic-parsing) · [abstract syntax tree (AST)](#/glossary/abstract-syntax-tree-ast) · [over-approximation and under-approximation](#/glossary/over-approximation-and-under-approximation) · [SAT and SMT solvers](#/glossary/sat-and-smt-solvers) · [program sketch](#/glossary/program-sketch-sketching) (here h-sketches, whose holes stand for regexes rather than constants, §2, §10) · [log-linear model](#/glossary/log-linear-model) (ranks the parser's derivations, §6.3)

**The paper's own terms:**
- **multi-modal synthesis**: synthesis from English and positive/negative examples together (abstract; §1); programming by example (PBE) uses examples only.
- **regex DSL**: the language of Fig. 4 (§3): **character classes** (one character, or a family such as `<num>`, any digit), `Concat`, `Or`, `And` (intersection), `Not` (complement), `Contains` and its prefix and suffix forms, `Optional`, `KleeneStar` and the `Repeat` family; the authors say every program in it can be written as a standard regex (§3). Semantics: App. B (whole-string matching).
- **h-sketch (hierarchical sketch)**: a regex with holes. A hole lists hints (sub-regexes or nested sketches); the regex filling it must contain at least one hint as a leaf and have depth at most d (§4, Figs. 5–6). The parser's sketches carry no d: it is a search-depth setting (§4 "Remark").
- **partial regex**: a syntax tree whose nodes are DSL constructs, unknown counts or h-sketches (**open** nodes) (Def. 5.1). A **symbolic regex** has no open nodes but unknown repetition counts (**symbolic integers**); a **concrete regex** has no unknowns (§5).
- **MAX**: "the maximum integer constant in the DSL", set in the implementation to the length of the longest example (§5.2, footnote 5).
- **derivation**: one parse of the English, mapped to one h-sketch; **lexical rules** map words to DSL concepts, **compositional rules** combine parts (§6.2).
- **Regel-Pbe**: Regel's search from one unconstrained hole, i.e. examples only (§9.1). **Regel-Approx**: sketch-based pruning without symbolic regexes (§9.2).
- **iteration**: an evaluation round: if the intended regex is not returned, two examples "guaranteed to rule out the returned incorrect regex" are added, up to four rounds (§9.1).

**Builds on:**
- DeepRegex (Locascio et al. 2016, ref. [30]), a sequence-to-sequence model from English to regexes: Regel's DSL follows it (§3), its data set is adapted (§8, App. C), and it is the English-only baseline (§9.1).
- AlphaRegex (Lee, So and Oh 2016, ref. [27]), regex synthesis from examples by top-down search pruned with over- and under-approximations: Regel takes that pruning idea (§5.1) and compares with an adaptation (§9.2).
- SEMPRE (Berant et al. 2013, ref. [7]), the semantic parsing framework under Regel's parser (§6, §7).
- Sketching: Sketch (Solar Lezama 2008, ref. [28]) and its variants, which solve for unknown constants (§2, §10); SQLizer (ref. [47]), which infers a sketch from English, for SQL, without examples (§10). None is on this site.

## Problem and setting

- **The question:** given an English description and a few positive and negative strings, find the regex the user means. Synthesis returns a regex in the h-sketch's space that matches every positive and no negative example, or fails (§5).
- **Correct** means the intended regex is among the top k returned (§8). For StackOverflow the ground truth is written in the DSL so that the Automaton library can check its equivalence with the output ([DFA equivalence](#/glossary/dfa-minimization-and-equivalence)); that library does not accept some standard constructs, such as lookahead (App. D).
- **Data (§8):** 200 tasks adapted from the DeepRegex data set, with examples written by people who saw only the English (App. C); 122 StackOverflow posts with a description and both kinds of examples, ground truth converted from the answers, pre-processed by hand (App. D).
- **Settings:** DeepRegex tasks get 10 seconds and one result, StackOverflow 60 seconds and the top 5, the same for all tools (§8).
- **Parser training:** for DeepRegex, sketches made by replacing the target's root operator with a hole, on 6,500 separate sentences; for StackOverflow, hand-written sketches with 5-fold cross-validation (§8, App. E).

## Approach

- **English to sketches (§6).** A [context-free grammar](#/glossary/context-free-grammar) builds derivations bottom-up and may skip words (§6.2); a log-linear model over SEMPRE's rule and span features ranks them, keeping the best partial derivations by [beam search](#/glossary/beam-search) (§6.3). The authors say their methodology and search are "agnostic to the NLP technique used for parsing English text into an h-sketch" (§6).
- **Sketch completion (§5, Figs. 7–8).** A worklist of partial regexes: expand an open node (fill it with a hint, or place an operator with shallower holes below), drop expansions shown infeasible, solve symbolic regexes, and return the first concrete regex consistent with the examples.
- **Pruning (§5.1, Figs. 9–10).** For each partial regex the engine builds one regex matching every string any completion could match and one matching only strings every completion matches; if the first misses a positive example or the second matches a negative one, the partial regex is dropped. New against AlphaRegex: to "leverage the hints inside the h-sketch to compute more precise over- and under-approximations" (§5.1). Holes deeper than one level get the trivial bounds (everything, nothing), since precise ones "would add a lot of overhead" (§5.1). **Thm. 5.4** (proof: App. A, Thm. A.2) states these two properties for any partial regex, so pruning drops no completion consistent with the examples.
- **Unknown counts by SMT (§5.2, Figs. 11–12).** Repetition counts stay symbolic. Encode turns a symbolic regex into a formula over string lengths; each positive example's length constrains it, and Z3 (an SMT solver) returns candidate counts, fixed one at a time with a feasibility check and a blocking clause (a constraint barring the value just tried). The formula over-approximates, so the solver rules counts out "rather than directly solving for them" (§10). The formulas multiply unknowns ([nonlinear integer arithmetic](#/glossary/linear-and-nonlinear-integer-arithmetic)), but Z3 "can efficiently handle the type of non-linear constraints we generate" (§5.2). **Thm. 5.7** (proof: App. A, Thm. A.3): given a partial regex and the examples, every concrete regex in its space consistent with the examples is among those InferConstants (the count-solving procedure) returns. **Thm. A.4**: if a symbolic regex with counts between 1 and MAX matches a string, those counts satisfy the length formula at that string's length.
- **Implementation (§7).** The top 25 sketches, from up to 500 derivations, are completed in parallel; the first k results within the time budget are returned.

## Results

- **Both inputs against one (§9.1, Figs. 14–15).** Across all 322 tasks and up to four iterations, Regel solves 80%, DeepRegex 43% and Regel-Pbe 26% (Result 1). On the DeepRegex tasks Regel solves 151 of 200 with the original examples (75.5%) and up to 185 (92.5%) with more, against 134 (67%) for DeepRegex and at most 66 (33%) for Regel-Pbe; on StackOverflow, up to 74 of 122 (60.7%) against 3 (2.4%) for DeepRegex and 18 (14.7%) for Regel-Pbe. On the DeepRegex tasks, using the English "also substantially speeds up the PBE engine" (§9.1, Fig. 15 (A)).
- **Pruning ablation (§9.2, Fig. 16).** On the top 25 sketches per StackOverflow task, for the first 1000 sketches all variants solve, Regel is around 10× faster than the AlphaRegex adaptation and 2.5× faster than Regel-Approx (Result 2).
- **User study (§9.3, App. F).** 20 participants, each with 6 StackOverflow tasks, half with Regel. Without Regel they solved 28.3% of tasks, with it 73.3%; a 1-tailed [t-test](#/glossary/students-t-test-and-t-interval) gives p below 0.0000001.

## Limits the authors state

- Among the StackOverflow failures they inspected, many rely on "high-level concepts such as date, range, etc. that our semantic parser has no knowledge of" (§9.1 "Failure analysis").
- The user study is "not intended to be a scientific study" of real use: most participants are computer science students from one university, and the tasks are StackOverflow posts rather than their own (§9.3 "Disclaimers"); Result 3 holds "For the particular setup evaluated in our small user study" (§9.3). Its two main causes of failure: Regel timed out on some tasks, and posts are ambiguous, so users sometimes took another interpretation (§9.3 "Failure case analysis").
- The DeepRegex data set is "quite noisy": paraphrasing left many regexes not matching their descriptions, and its random regexes are mostly unrepresentative; the filtered set "still does not guarantee that the resulting data set is completely representative of real-world tasks" (App. C).
- "the optimal h-sketch to use for training is hard to determine" (§8).
- Regel may return fewer than k results within the time budget (§7).
- "it is up to the user to inspect these results and provide more examples as needed"; the authors believe it would be beneficial to build a multi-modal active-learning tool that asks the user membership queries ([query learning](#/glossary/query-learning-membership-and-equivalence-queries)) to choose between consistent solutions (§11).

## Open problems and building blocks

- **Open:** "semantic parsing or other NLP techniques that might generate helpful feedback to users in cases where the generated sketch is too coarse" (§11); to "explore the use of the proposed synthesis methodology in application domains beyond regular expressions" (§11).
- **Released:** both data sets are included in the supplementary materials (App. C, App. D). No code release is stated.
- **To reuse it:** SEMPRE, Z3 and the Brics automaton library (§7); training pairs of English and h-sketches per data set (§8, App. E); experiments on an Intel Xeon E5-1620 v3 with 32 GB (§9).

## On this site

- **Discussed in:** [Benchmarks with checkable ground truth](#/challenges/checkable_benchmark_ground_truth) · [Checking a program written from English, in any DSL](#/challenges/dsl_intent_verification)
- **Tags:** <span class="tags"><a class="tag" href="#/tags/labels">labels</a><a class="tag" href="#/tags/method">method</a><a class="tag" href="#/tags/nl2dsl">nl2dsl</a><a class="tag" href="#/tags/smt">smt</a><a class="tag sub" href="#/tags/dsl-regex">dsl-regex</a></span>
