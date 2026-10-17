# The Communication Bottleneck: A Round-Trip Study of Tree-Structured Expression Serialization in Language Models

**The Communication Bottleneck** · (round-trip protocol, communication matrix), preprint 2026

Read: [PDF](https://arxiv.org/pdf/2609.21509) · [arXiv](https://arxiv.org/abs/2609.21509)

<p class="notice">A summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Measures how much of a tree-shaped expression survives English between two models: a generator model writes an arithmetic expression as a word problem with no math symbols, a separate extractor model (another model or the same one) recovers the expression from the text alone, and SymPy symbolic equivalence decides success; all pairings of 16 models (12 open-weight from 0.6B to 32B, 4 frontier) give a generator × extractor accuracy matrix (abstract; §2.2–2.3; §3.1).
- Column and row averages separate writing from reading quality (§2.3); a vote over all 16 extractors blames a failure on the generator when no extractor recovers the expression (§2.4); deterministic JSON and S-expression encodings give a lossless reference (§3.2); a propositional-logic replication (App. R) and QLoRA fine-tuning of the 10 open-weight autoregressive models on in-domain arithmetic and on a disjoint "assembly" domain (§4).
- An expression → English → expression round trip with an exact check and the writer and reader roles separated, the design Round-trip consistency describes for SQL: the authors report that "at least 73.6% of round-trip failures originate at generation" (abstract), so the English-writing step is the weak link, and that the best pair mixes two different models (§3.2). The protocol needs a domain with a canonical form to check against (§6 "Limitations").

## In plain words

When language models reason step by step or pass text along a pipeline, they turn structure into prose; if that step is lossy, what the writer fails to express unambiguously is lost whatever the reader (§1). The authors measure how much tree structure survives. One model turns an arithmetic expression into a word problem with no math symbols; another model recovers the expression from the word problem alone; a computer algebra library decides whether the two are equal (abstract; §2.2). Pairing 16 models in both roles scores every pair. With greedy decoding and three worked examples in the reader's prompt (§3.1), the best pair, two different frontier models, reaches 92.9%, above any model reading itself (§3.2). With all 16 readers as the panel, at least 73.6% of failures start in the word problem, since no reader recovers the expression (abstract; §2.4). Fine-tuning on about 3600 examples sharing the test's operators and tree shapes lifts all 10 fine-tuned open-weight writers above an untrained frontier model, which the authors call an upper bound, not generalization (§4.1). They present a measurement protocol (§1).

## Background and terms

**Terms to know:** [abstract syntax tree (AST)](#/glossary/abstract-syntax-tree-ast) · [test oracle](#/glossary/test-oracle) · [back-translation](#/glossary/back-translation) · [greedy decoding and temperature sampling](#/glossary/greedy-decoding-and-temperature-sampling) · [LoRA (low-rank adaptation)](#/glossary/lora-low-rank-adaptation) (the paper uses QLoRA) · [item response theory (IRT)](#/glossary/item-response-theory-irt) · [Spearman's rank correlation](#/glossary/spearmans-rank-correlation) · [symbolic equivalence](#/glossary/symbolic-equivalence) (checked with SymPy, a Python computer-algebra library, as `simplify(ê − e) = 0`, which "accepts valid rearrangements" but "catches all semantic errors", §2.2) · [SHAP](#/glossary/shap) (used in §3.3, App. G) · [diffusion language model](#/glossary/diffusion-language-model) (two are tested, §3.1)

**The paper's own terms:**
- **generator, extractor**: the model that writes the word problem, and the model that recovers the expression from it alone (§2.2).
- **leakage guard**: a regular-expression filter that rejects word problems where math syntax leaks in; two more checks count dropped variable placeholders and repetition loops as generator faults (§2.2, App. C).
- **communication matrix**: the 16 × 16 table of round-trip accuracy (share of the 2450 expressions recovered, guard rejections counted as failures), rows extractors, columns generators (§2.3, Eq. 1, Tab. 1).
- **generation quality, extraction quality, self-communication**: a column's average, a row's average, and the diagonal cell (§2.3); extraction quality "is panel-relative" (it depends on which generators are in the panel) (§2.3).
- **generator fault, extractor fault**: a failure is the generator's when no extractor in the panel recovers the expression, and the extractor's when at least one does (§2.4).
- **NL tax**: extraction quality on the best lossless encoding (S-expression, a prefix notation, or a JSON tree) minus extraction quality on English (§3.2).
- **linearization complexity ℓ(T)**: the number of operator nodes whose right child is also an operator, a count of right-branching (§3.3).
- **R_math**: the share of a word problem's words found in a 109-term lexicon of arithmetic words such as "sum" (§3.3, App. D).

**Builds on:**
- Allamanis et al. [2024] ([Round-Trip Correctness (RTC)](#/papers/allamanis2024roundtrip "Unsupervised Evaluation of Code LLMs with Round-Trip Correctness (2024)")), "the closest prior art": a code round trip through English that keeps one model on both ends to avoid the "communication chasm" between models, which this paper makes "the object of study" (§1).
- Back-translation (Sennrich et al., 2016), the origin of round-trip quality proxies (§5).
- Herbst et al. (2025) on lossy serialization of structure into prose, and He et al. [2026] and Tran and Kiela [2026] on information lost between agents, for which the authors claim "direct empirical support" (§5).

## Problem and setting

- **Question:** "How much compositional structure actually survives the natural-language bottleneck?", for tree-structured expressions with an exact oracle (§1).
- **Expressions:** binary-tree skeletons (unlabelled tree shapes) for 2–8 operators and depths 2–6, up to 50 per operator-count and depth pair, filled with +, −, ×, ÷ and variables A–H or integers 1–10, degenerate parts such as X − X rejected; 2450 expressions (§2.1, §3.1, App. B).
- **Models:** Qwen3 at six sizes (0.6B–32B), Gemma-3 (4B, 12B, 27B), Phi-4, the diffusion models Dream-v0-7B and LLaDA-8B, and four frontier models by API: Claude Haiku 4.5, GPT-5, Gemini-3-Flash, Gemini-3.1-Pro (§3.1).
- **Decoding and prompts:** greedy, thinking disabled; one fixed prompt pair (App. A); no generator exemplars and three extractor exemplars, from a shot ablation, with frontier generators run only without exemplars "for tractability" (§3.1). Prompts are "parameters rather than fixed choices" (§2.2).
- **Correct:** symbolic equivalence (§2.2); logical equivalence in the logic replication (App. R).

## Approach

- **Round trip and matrix (§2.2–2.3).** Every model writes for all expressions and reads every model's output. Guard false negatives "bias round-trip accuracy upward" (§2.2); App. C argues the NL tax and generator-fault rate are lower bounds, and claims no bound for the role-swap gap (the accuracy change when two models swap generator and extractor).
- **Fault attribution (§2.4, App. M).** A larger panel "can only shift failures from the generator-fault bucket to the extractor-fault bucket" (§2.4); App. M.1 bounds wrong blame assuming conditional independence across extractors (that extractors fail independently on a faithful word problem).
- **Lossless reference (§3.2, App. Q).** Deterministic S-expression and JSON encoders replace the English writer.
- **Failure predictors (§3.3, App. G–I).** A gradient-boosted tree classifier (an ensemble of decision trees) with SHAP over the 12 open-weight models' outcomes, and an error taxonomy (parse, operator count, structure, content).
- **Checks of the measure:** a Rasch model, the simplest IRT model (App. N); correlations with nine published benchmarks of math, code, general knowledge and reasoning (§3.4, App. J); a 14 × 14 propositional-logic replication without the Gemini models (App. R); a temperature sweep (App. E).
- **Fine-tuning (§4, App. O).** QLoRA on about 3600 training messages for the 10 open-weight autoregressive models: arithmetic with the evaluation's operators and tree shapes but disjoint letters and constants, or an "assembly" domain of mixed-arity operators over coloured objects.

## Results

- **Best pair (§3.2, Tab. 1):** Gemini-3.1-Pro reading GPT-5 reaches 92.9%, against 91.3% for the best self-communication (GPT-5). Accuracy still falls with complexity at every tier; the diffusion models "sit within the autoregressive envelope" (the range of the left-to-right models).
- **Distinct skills (§3.2, Fig. 3 left):** GPT-5 is the top extractor and second generator, Gemini-3.1-Pro the reverse; swapping roles shifts accuracy by up to 60.4 points (Gemma-3-27B with Gemini-3.1-Pro).
- **NL tax (§3.2, Fig. 3 right):** for Qwen3 at 14B–32B, lossless extraction reaches 85–88% while extraction from frontier-written prose "plateaus at 51–70%, an 18–20 pp tax that grows with complexity"; below 4B, models "lack fluency in structured notation and extract similarly from prose".
- **Where failures start (§3.3, App. M):** at least 73.6% are generator faults, and every smaller panel tested gives a higher share (Tab. 20). Wrong operator count is 71.8% of all errors (§3.3; breakdown in App. I). The extractor's share of failures rises steeply with generator capability (Fig. 4 right).
- **Predictors (§3.3, Fig. 4):** on the 12 open-weight models, generator size leads, R_math is second, ahead of extractor size, and depth, operator count and ℓ(T) follow among structural features; right-branching trees are harder at matched depth; family match (generator and extractor from the same model family) gives "no evidence of architecture-specific dialects".
- **External validity (§3.4, App. J, App. R):** extraction correlates strongly with published benchmarks, generation only moderately. In logic, accuracy drops but rankings mostly carry over; Phi-4 falls from near the top to last as an extractor.
- **Fine-tuning (§4.1, Tab. 2):** arithmetic fine-tuning raises generation quality from 0.1–26.9% to 51.9–59.5%, above the 45.1% the authors give for untrained Gemini-3.1-Pro, with no leakage left ("eliminating leakage entirely"). Assembly fine-tuning "raises generation quality for every open-weight model", the authors report, but the best, Phi-4, stays below untrained Gemini-3.1-Pro.

## Limits the authors state

- Arithmetic and logic both admit a canonical form ("any two correct answers are provably equivalent"); the protocol "does not directly transfer to domains where correctness admits many answers with no canonical form to check against, only validators specific to each instance, like planning, spatial reasoning, and program synthesis" (§6 "Limitations").
- "Evaluation is monolingual (English) with one prompt pair and no tuning, so scores are a reproducible lower bound"; thinking is disabled "to isolate serialization from test-time reasoning" (§6).
- Arithmetic fine-tuning is "best read as an upper bound on what the channel admits under matched semantics, not a generalization claim" (§4.1); after cross-domain fine-tuning "a gap to the frontier remains" (abstract).
- The NL tax "would narrow with a stronger" generator (§3.2); generation and extraction quality "are not directly comparable in absolute terms" (§3.2).
- The guard lets leaks with a minus sign or number-only parentheses pass (App. C "Known regex gaps").
- The misattribution bound's independence assumption "is optimistic" (App. M.1).
- The failure classifier's gain over always predicting failure is "modest in absolute terms" (App. G); frontier models are left out of it because their unknown sizes "would confound the model-size features" (§3.3).
- Benchmark correlations "should be read as rough indicators rather than precise estimates" (App. J).
- One fine-tuning hyperparameter setting for all models (§4, footnote); no "mechanistic account for the Gemma-specific drop" in guard pass rate after assembly fine-tuning (App. O.3).

## Open problems and building blocks

- **Open:** "What stays hard is flattening a hierarchical expression into words another model can re-parse" (§6); fidelity "will require advances primarily on the encoding side, particularly for deep expressions" (App. M "Takeaway"); the NL tax is "the floor" that proposed replacements for natural language (dense vectors, a layered protocol) "would have to beat" (§5). Advice: match models to roles by per-role rank, and prefer structured intermediates when the consumer can parse them or a standard such as MCP or A2A (protocols for agents' tool calls and agent-to-agent messages) gives the schema (§6 "Practical recommendations").
- **Released:** "Code will be released upon acceptance." (§1). Prompts (App. A), lexicon (App. D) and guard patterns (App. C) are printed.
- **To reuse it:** a domain with an exact oracle and canonical form (§6); a panel of models in both roles; a "deliberately simple" guard to tighten or replace (App. C). The runs took 441.9 A100 GPU hours and 158,358 API calls (App. S, Tab. 26).
- **Beyond its domain:** "the failure pattern is not unique to arithmetic" (§7), and the guard's checks suit "round-trip evaluations on new domains" (App. C).

## On this site

- **Discussed in:** [The self-improving SQL ↔ text ↔ verify loop](#/challenges/sql_text_round_trip_loop)
- **Tags:** <span class="tags"><a class="tag" href="#/tags/compact">compact</a><a class="tag sub" href="#/tags/general-misc">general-misc</a><a class="tag sub" href="#/tags/llm-misc">llm-misc</a></span>
