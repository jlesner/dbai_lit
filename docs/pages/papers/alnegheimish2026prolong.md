# Probing for Long-Horizon Deductive Reasoning Capabilities in Language Models with Prolog

**Probing for Long-Horizon Deductive…** · Findings of EMNLP 2026

Read: [PDF](https://arxiv.org/pdf/2610.11592) · [arXiv](https://arxiv.org/abs/2610.11592)  
Code: [ProloNg](https://github.com/halnegheimish/ProloNg)

<p class="notice">A summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- A synthetic benchmark of Prolog query answering, "can the query be proven given the program, or not?" (§1), whose reasoning depth runs from 0 to 22 while the context grows with it, since every rule and fact is needed in the proof (abstract; §2; §3.3); 8 reasoning models across 5 families, with output budgets of 64k tokens (82k for the Qwen models) (abstract; §4.1).
- Programs are generated recursively with one rule per predicate, no recursion or negation and at most two arguments per predicate, each with a provable query and an unprovable one made by mutating one fact, and labels checked with the SWI-Prolog interpreter (§3.2–3.3, Alg. 1). The analysis adds the answer distribution by depth, LLM-assisted reading of reasoning traces, and a shared-context set that keeps the program fixed while the query's depth varies, analysed with a mixed-effects regression (§4.3–4.5, App. F).
- A checked deduction task with a depth dial that the shared-context set separates from context length, for the text arm of [Reliability that holds with size, by handing the procedure to an engine](#/challenges/engine_offloading_with_size) and for [Whole-job reliability of multi-step LLM work](#/challenges/whole_job_reliability): the authors report that even the best model, GPT-5.5, "degrades to 67% accuracy at depth-20" (§1), that with the context fixed accuracy still falls with depth (§4.5, Tab. 1), and that many models drift towards answering "unprovable" as depth grows (§4.3), while the interpreter that labels the programs answers even the largest quickly (§3.3).

## In plain words

Frontier language models can in theory take million-token inputs, but can they reason over all of it rather than just find a passage (abstract)? The authors ask this for strict deduction: given if-then rules and facts written in Prolog (a logic programming language), can a query be proven (§1)? They say such deduction matters for mathematics, coding and uses such as policy compliance (§1; App. B).

They built ProloNg, a generator and benchmark whose problems grow harder in one controlled way, depth: the length of the rule chain a proof must follow, from 0 to 22, with inputs growing alongside to a median of about 62,000 tokens (abstract; §3.3). Across 8 reasoning models, accuracy fell with depth, most models "approaching chance beyond depth 10" (abstract); the best, GPT-5.5, scored 67% at depth 20, against 50% for guessing (§1; Fig. 2). Many models drifted towards answering "unprovable" (§4.3). With input length held fixed, on four open models up to depth 10, accuracy still fell with depth (§4.5). The paper presents itself as an empirical study with a new benchmark (§1, §5).

## Background and terms

**Terms to know:** [logic programming](#/glossary/logic-programming) · [first-order logic](#/glossary/first-order-logic) · [forward chaining](#/glossary/forward-chaining) (backward chaining, which the paper uses, is the reverse) · [generalized linear mixed model (GLMM)](#/glossary/generalized-linear-mixed-model-glmm) · [backward chaining](#/glossary/backward-chaining) (Prolog's goal-directed search, which the task requires, §1, §3.1) · [unification](#/glossary/unification) (the model "must correctly unify variables", §1)

**The paper's own terms:**
- **fact, rule, query**: a fact states something true about constants, such as `r(o1).`; a rule such as `p(X,Y) :- q(Y,X), s(X).` says that `p(x,y)` holds whenever `q(y,x)` and `s(x)` both hold (names starting with a capital letter or underscore are variables); a query asks whether a statement over constants, such as `p(o1,o2)`, can be proven (§3.1).
- **reasoning depth** (also "proof depth"): the depth `N` passed to the generator; at least one path from the query down to the facts is `N` rules long, and the other paths are sampled up to that length (§3.2, Alg. 1). Depth 0 means the query is itself a fact.
- **breadth**: the number of conditions in a rule's body, drawn from a Poisson distribution (a distribution of counts) and capped, "to skew the rules to having 2 body literals" (§3.2).
- **provable / unprovable query**: each program comes with one query that holds and one that doesn't; the unprovable one is made by changing one argument of one needed fact, the "planted missing fact" (§3.2, §4.4).
- **shape**: a canonical form of a program's structure, used "to ensure context structural diversity" (§3.3, Tab. 3).
- **conservative bias**: a bias towards answering that a query is unprovable, growing as programs get more complex (§4.3).
- **false negative / true negative**: a provable query answered "unprovable" / an unprovable query answered "unprovable" (§4.4).
- **shared-context setting** (also "disentangled"): one program reused with queries at several depths, so that depth varies while input length stays fixed (§4.5).

**Builds on:**
- RuleTaker (Clark et al., 2020), ProofWriter (Tafjord et al., 2021) and ProntoQA (Saparov and He, 2023), earlier benchmarks of answering queries over rules and facts, whose depths, the authors say, "remain shallow" (§2). They chose Prolog over English to avoid ambiguity and "content effects" (models using prior knowledge instead of the context; Lampinen et al., 2024; §2).
- ZebraLogic (Lin et al., 2025), which the authors cite for a sharp accuracy decline in constraint satisfaction (puzzles solved by finding values that meet every constraint) once the search space is very large; the authors say failure here comes in a simpler setting, a linear proof chain beyond depth 10 (§2).
- The long-context benchmarks LongBench-v2, RULER and HELMET (retrieval and question answering over long inputs), which the authors say treat reasoning and retrieval as independent axes "in most tasks", whereas in ProloNg every rule and fact is needed (§2).

## Problem and setting

The question: how does deductive accuracy change as proofs get deeper and inputs longer, and which of the two drives failure (§1, §4.5)?

- **Programs:** no recursion, no loops, no negation, predicates (relation names such as p and q) with at most two arguments, and exactly one rule per predicate, "intended to make the reasoning trace as simple as following a single chain, with no need for backtracking" (§3.2; Limitations).
- **Benchmark:** 100 programs per even depth from 0 to 22, each with a provable and an unprovable query, so every depth is balanced and chance is 0.5 (§3.3; Fig. 2). Median input grows from 133 tokens at depth 0 to about 62k at depth 22, by DeepSeek-V4-Pro's tokenizer (§3.3; Tab. 3). "Correct" is the label, checked with the SWI-Prolog interpreter (§3.3).
- **Models:** Claude-Opus-4.7, GPT-5.5 and GPT-5.4-mini (closed); DeepSeek-V4-Pro, Kimi-K2.6, Qwen3.6-27B, Qwen3.5-27B and Qwen3.5-4B (open weights), with advertised context windows from 256k to 1M tokens (§4.1; App. A, Tab. 2).
- **Running them:** up to 64k output tokens (82k for the Qwen models, as their documentation recommends), reasoning effort high where available; the final 0 or 1 is read from a `\boxed{}` answer (a LaTeX answer box) (§4.1).

## Approach

- **Generator (§3.2, Alg. 1).** GenerateRule takes a target fact, a depth and a breadth. At depth 0 it returns the target as a fact. Otherwise it makes a rule whose head is the target with variables for its constants, and whose body has breadth-many new conditions; the first is expanded recursively at depth one less, the others at a depth drawn uniformly from 0 to one less. It returns the rules and the minimum set of facts that make the query provable. The unprovable twin copies those facts for other constants and mutates one fact's argument; everything is then shuffled.
- **Evaluation (§4.2–4.4).** Accuracy, answers given and output length by depth (Figs. 2–3, 6–7), and a reading of the reasoning at depth 22 for DeepSeek-V4-Pro (full trace) and GPT-5.5 (summary only); GPT-5.5 extracted each failure reason and checked it, verified by hand for 10% of the problems (§4.4).
- **Separating depth from length (§4.5; App. F).** A mixed-effects logistic regression (a GLMM, with each model's baseline as a random effect and context length (logged) and depth as standardized (rescaled to a common scale) fixed effects) on the original data; since depth and length are "tightly correlated" there, the authors build a shared-context set: 50 programs of maximum depth 10, queried at even depths 0 to 10, 600 samples, run on the open models DeepSeek-V4-Pro, Qwen3.5-4B, Qwen3.5-27B and Qwen3.6-27B, and fit the regression again.

## Results

- **Depth (§4.2, Fig. 2).** All models start "near ceiling performance at shallow depths"; "Beyond depth 10, several models approach the chance baseline of 0.5". GPT-5.5 holds high accuracy until depth 16 and declines at depths 20–22; the authors report that it "degrades to 67% accuracy at depth-20" (§1). The authors stress that the inputs are "still well within the advertised context lengths of these models".
- **Conservative bias (§4.3, Fig. 3).** Claude-Opus-4.7, DeepSeek-V4-Pro and Kimi-K2.6 increasingly answer "unprovable" beyond depth 10, overwhelmingly so by depths 16–18, which "suggests that models are effectively giving up"; GPT-5.5 shows "a milder version". Accuracy falls less on unprovable queries, in line with this bias (App. D, Fig. 6). The Qwen3.5 models' main failure is different: they run out of output tokens before answering, already at depth 10, where the median input is only 2.5k tokens, and only their reasoning traces keep growing with depth; the others plateau (App. E, Fig. 7).
- **Traces (§4.4).** In GPT-5.5's false negatives, the model "starts the reasoning chain correctly, but then 'loses its way'", claiming a needed fact is missing or unsupported when it is in the context. By the LLM analysis, of its 84 true negatives at depth 22, 34 cite the planted missing fact; 14 give only the answer, 15 a vague proof and 21 name other, provable facts as blockers, which the authors read as reasoning "not faithful to the actual derivation". In DeepSeek-V4-Pro's traces, "97 of the 100 provable queries were falsely claimed to be unsupported by arbitrary conditions that exist in the context", and it cited the planted fact in an even smaller share of its true negatives.
- **Depth against length (§4.5; Tab. 1; App. F).** On the original data, restricted to the four models of the shared-context set, the regression puts most of the effect on context length (standardized weight −1.48) and a small, not significant one on depth (−0.15, p = 0.108), a split the authors call "highly sensitive to estimation noise" because the two are correlated. In the shared-context set both are significant and comparable (length −0.54, depth −0.36). At the same depth, accuracy is lower with the longer shared context (depth 0: 0.99 against 0.855, Tab. 1), and at a fixed context it still falls with depth.
- The authors take the results to suggest that frontier models "have not learned a robust, generalizable implementation of backward-chaining inference even in simple, linear proofs" (§5).

## Limits the authors state

- The programs exclude "recursion, reasoning loops, or negation", since the framework studies deductive reasoning "at its simplest" (Limitations).
- Closed models expose only a summary of their reasoning, "which limits analysis of their reasoning traces" (Limitations; §4.4).
- Running the models is "computationally expensive, and API access also comes with substantial costs" (Limitations).
- Output was capped at 64k tokens (82k for Qwen); "It could be the case that increasing the budget could increase the accuracy, especially at longer depths" (Limitations).
- On the original data, the regression's split between length and depth is "highly sensitive to estimation noise" (§4.5).

## Open problems and building blocks

- **Open:** no future work is stated. The bottleneck the authors name: models "struggle to maintain the required chain of substitutions and fact lookups as proof depth and context size scale" (§1).
- **Released:** "We release the full dataset, generation code, and model predictions" (§3.3; also the §1 footnote).
- **To reuse it:** the generator's settings (depth, maximum breadth, Poisson-sampled breadth; §3.2); the SWI-Prolog interpreter to check labels, which "only takes half a second even for the largest programs" (§3.3; App. C, Tabs. 4–5); output budgets of 64k or 82k tokens (§4.1); for the regressions, `lme4::glmer` in R (App. F).

## On this site

- **Discussed in:** [Reliability that holds with size, by handing the procedure to an engine](#/challenges/engine_offloading_with_size)
- **Tags:** <span class="tags"><a class="tag" href="#/tags/benchmark">benchmark</a><a class="tag" href="#/tags/gym">gym</a><a class="tag" href="#/tags/labels">labels</a><a class="tag" href="#/tags/llm">llm</a><a class="tag" href="#/tags/longctx">longctx</a><a class="tag" href="#/tags/nl">nl</a></span>
