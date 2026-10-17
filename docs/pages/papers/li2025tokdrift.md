# TokDrift: When LLM Speaks in Subwords but Code Speaks in Grammar

**TokDrift** · preprint 2025

Read: [PDF](https://arxiv.org/pdf/2510.14972) · [arXiv](https://arxiv.org/abs/2510.14972)  
Code: [tokdrift](https://github.com/uw-swag/tokdrift)

<p class="notice">A summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Measures whether code LLMs give the same test-checked result when the input program is rewritten in ways that keep its meaning but change how the tokenizer cuts it: six naming rules that change identifier casing and eighteen spacing rules that add one space next to an operator, applied one at a time to eight Java and Python benchmarks for bug fixing, code summarization and code translation, with nine open models of three series and sizes (§3; Tab. 1–3).
- Scores each run by sensitivity, the share of rewritten inputs whose correctness flips (§3.4), splits inputs by whether an identifier's subword pieces change (§4.3), and looks for causes in GitHub frequencies of the two sides of a subset of the spacing rules (§5.1, footnote 1; Tab. 7) and in the per-layer hidden states of Qwen2.5-Coder-32B (§5.2).
- Evidence that how a tokenizer cuts code, not only what the code means, changes checked correctness, for DSL code in prompts and as a source of noise when comparing methods: the authors report that their most accurate model "changes its prediction 6.09% of the times when the input tokenization changes" (§1), and that layer-wise analysis "indicates that the effect originates in early layers" (§1; §5.2).

## In plain words

Code LLMs read programs as pieces that a tokenizer learned from character frequencies, not from the language's grammar, so programs differing only in surface details, such as a space or a name's casing, can be cut into quite different pieces (abstract; §1). The authors ask whether this mismatch limits how well LLMs understand and write code (§1). They build TokDrift, which rewrites the input program in ways that keep its meaning (adding a space next to an operator, or changing a name's casing style), one rule at a time, on eight Java and Python benchmarks for bug fixing, code summarization and code translation. Tests then show whether nine open models, from about 1B to 70B parameters, flip between right and wrong (§3). For their most accurate model, Qwen2.5-Coder-32B-Instruct, they report that it "changes its prediction 6.09% of the times when the input tokenization changes (and up to 60% under a single rewrite rule)" (§1). A layer-by-layer comparison of the model's internal vectors "indicates that the effect originates in early layers" (§1). They present the work as "measurement and diagnosis" (Limitations).

## Background and terms

**Terms to know:** [abstract syntax tree (AST)](#/glossary/abstract-syntax-tree-ast) · [greedy decoding](#/glossary/greedy-decoding-and-temperature-sampling) · [Wilcoxon signed-rank test](#/glossary/wilcoxon-signed-rank-test) · [t-SNE](#/glossary/t-sne) · [tokenization and byte-pair encoding (BPE)](#/glossary/tokenization-and-byte-pair-encoding-bpe) (with pre-tokenization, §2.1; App. B compares model families' schemes) · [lexing](#/glossary/lexing) (§2.2) · [hidden state](#/glossary/hidden-state) (the last token's, which "summarizes the information of the entire sequence", §5.2). In the glossary's terms, TokDrift applies [metamorphic testing](#/glossary/metamorphic-testing) to a model: a meaning-preserving input change should not change whether the output passes (our bridge; not the paper's term).

**The paper's own terms:**
- **LLM tokens and PL (programming language) tokens**: the units a learned subword tokenizer produces, against the grammar's units (e.g. identifiers, operators, keywords) that a language's lexer produces (§2.2).
- **Rewrite rule**: converts "all occurrences of the left-hand side substring to the right-hand side substring" (§3.3). **Naming rules N1–N6** change an identifier's casing (camelCase, PascalCase, snake_case, SCREAMING_CASE); **spacing rules S1–S18** insert one space between two adjacent PL tokens, one of them an operator (**OP**: any operator; **ID**: an identifier) (§3.3, Tab. 3). S17 and S18 are the two **"wildcard" rules**: any operator followed by an identifier, or by an identifier or operator (§3.3).
- **Baseline and variant**: outputs on the original and on the rewritten input (§3.4).
- **Accuracy and Δaccuracy**: the share of outputs that pass all their tests, and the variant's accuracy minus the baseline's (§3.4; App. C.3).
- **Sensitivity**: among the inputs a rule actually changes, the share whose correctness flips, either way (§3.4; App. C.3). The authors call it "an unbiased metric" (§3.4).
- **Identifier fragment change**: the list of an identifier's pieces ("tokens but ignoring spaces and underscores") changes after the rewrite, e.g. Llama-3 cuts `␣sortedLst` into `␣sorted`, `L`, `st`, and after N1 into `␣sorted`, `_lst` (§4.3; ␣ marks a space). App. C.2 splits changes into **merged**, **split** and **mixed** by whether token boundaries were lost, gained or both (Alg. 3).
- **Hidden state diff**: after minus before, at a middle layer (§5.2).

**Missing glossary terms:** none.

**Builds on:**
- Tokenizer studies, Liu et al. (2025) (merges across spaces) and Chirkova and Troshin (2023) (a tokenizer aligned with code syntax): "our work builds on this line of inquiry" (§6).
- Robustness to tokenization and representation changes, Zheng et al. (2025), Wang et al. (2025) and Yan et al. (2025); "Our work contributes to this line by focusing specifically on PLs" (§6).
- Grammar-aware decoding and tokenizers (Synchromesh, PICARD, SynCode, Boundless BPE): a disconnect "our work quantifies" (§6).
- Benchmarks: HumanEvalPack (Muennighoff et al., 2023; HumanEval translated from Python to other languages, App. C.1) and Avatar and CodeNet (code-translation benchmarks) as prepared by Pan et al. (2024) (§3.1; App. C.1), run with the bigcode-evaluation-harness (an evaluation framework for code models) (App. C.4).

## Problem and setting

- **The question:** "Does the misalignment between subword tokenization and PL grammar limit LLMs' ability to understand and generate code?" (§1).
- **Languages and tasks:** Java and Python (§3.1). Eight benchmarks: bug fixing and code summarization from HumanEvalPack, where the summary is fed back to the model to generate code that is tested; and code translation from Avatar and CodeNet in both directions (§3.1, Tab. 1).
- **Correct:** passes all its tests (App. C.3).
- **Models:** Llama-3 (3B, 8B, 70B), Qwen2.5-Coder (1.5B, 7B, 32B) and DeepSeek-Coder (1.3B, 6.7B, 33B), all instruction-tuned, coding variants where available (§3.2, Tab. 2); greedy decoding (§3.2); unless otherwise stated fp32, the three large models fp16 (32- and 16-bit floating point) (App. C.4).
- **Meaning preservation** rests on the two languages' grammars: the rules are "semantically-preserving by design" (§3.3). The benchmarks are first normalized (HumanEvalPack's Java identifiers converted to camelCase, some translation samples fixed or pruned, 6 plus 4 unfixable Avatar tasks dropped); "All edits are specified once, applied uniformly to baseline and variant inputs, and never conditioned on model outputs" (App. C.1).
- **Rule choice:** spacing rules are each language's ten most frequent combinations in the benchmarks, plus the wildcards (§3.3).

## Approach

- **Workflow (Fig. 1a, §3):** apply one rule, run the model on both inputs, compare test results.
- **Rewriting (App. C.2, Alg. 1–2):** the code is parsed into tokens. Naming rewrites skip identifiers that must not change (e.g. imported names, method calls, Java methods marked `@Override`) and, for HumanEval tasks, propagate renamings to tests; spacing rewrites insert exactly one space between two adjacent tokens whose kinds match the rule.
- **Fragment classification (App. C.2, Alg. 3):** compares where LLM tokens start before and after the rewrite, ignoring boundaries created at or right next to an edit site.
- **Root causes (§5):** (1) word frequency: GitHub search counts of each rule's left- and right-hand sides, only for a subset of the spacing rules because of the search's limits (§5.1, Tab. 7, footnote 1); (2) hidden states of Qwen-32B: cosine similarity (1 when two vectors point the same way) of the last token's hidden state before and after the rewrite at each layer (Fig. 4), and t-SNE maps of the middle-layer diffs (Fig. 5) (§5.2).

## Results

- **Accuracy (§4.1, Tab. 4):** most rules cause measurable changes, from -2.90 to +0.32 points when averaged across models. The largest Δaccuracy is -8.27 points, Llama-8B on Java with S18 (43.15% to 34.88%). They write: "Considering advances in LLM performance are sometimes claimed with around 1 percentage point margin, these accuracy deltas caused by simple rewrite rules are non-negligible" (§4.1).
- **Sensitivity (§4.1, Fig. 3):** on average 9.26% for naming rewrites and 8.29% for spacing rewrites. Models are relatively less sensitive to camelCase–snake_case changes (N1, N4). The wildcard rules give high average sensitivity; of the other spacing rules the authors name S15 (period and identifier), S14 (a pair of parentheses) and S12 (operator and semicolon) as the most impactful. Llama-3 models are more sensitive than the other series; every model keeps a sensitivity they call non-negligible, lowest for Qwen-32B on spacing rules (Fig. 3c, Tab. 5).
- **Model size (§4.2, Tab. 5):** small and medium models are about equally sensitive; large ones are "usually less sensitive", with one exception, Qwen-32B on naming rules. By Wilcoxon signed-rank tests size differences are not significant for naming rules, but significant for spacing rules except between small and medium Qwen2.5-Coder and DeepSeek-Coder models.
- **Fragment changes (§4.3, Tab. 6; large models only):** inputs with an identifier fragment change are consistently more sensitive than those without; among naming rules, the largest gap is DS-33B's (DeepSeek-Coder 33B), 10.82% against 6.61% (Tab. 6). Tab. 9 splits it by merged, split, mixed (App. D).
- **Word frequency (§5.1, Tab. 7):** for every rule measured, the right-hand side is rarer on GitHub than the left-hand side, "which explains why LLMs exhibit non-negligible sensitivity to all rewrite rules"; some rules with a low ratio, such as S14, are also highly sensitive.
- **Hidden states (§5.2):** for both rule kinds, similarity starts very low at the first (input) layer, rises and mostly stabilizes in the middle layers, and drops at the last layer, which the authors call consistent with the information bottleneck theory (middle layers hold compressed semantic information). For S14 and S3 the middle-layer similarity is also low, "implying that the model sees the before and after versions as semantically different" (Fig. 4b). In t-SNE maps, naming and spacing diffs are "clearly distinguishable", and so are the diffs of individual rules (Fig. 5; S17 and S18 left out as supersets of other rules).

## Limits the authors state

- The rewrites are "a targeted set of semantic-preserving rewrites based on common formatting and naming conventions; these do not encompass all potential sources of tokenization drift" (Limitations).
- The findings "may not generalize to models with fundamentally different architectures (e.g., state space models" (a non-Transformer sequence architecture) "or tokenization strategies (e.g., character-level or grammar-driven tokenizers" (Limitations).
- "we do not explore mitigation strategies" (Limitations).
- Δaccuracy lets gains and losses on single samples cancel, and it includes inputs a rule may leave untouched (§3.4).
- The word-frequency analysis covers only a subset of the spacing rules, because of limits on GitHub search strings (§5.1, footnote 1).

## Open problems and building blocks

  - "Future work could investigate tokenizer retraining, ensemble decoding over multiple tokenizations, or architectural modifications to improve the alignment between token boundaries and programming language syntax" (Limitations).
  - "the need for grammar-aware tokenization for future code LLMs" (abstract); "grammar-aware or domain-adaptive tokenizers that more faithfully reflect PL structure" (§7).
  - Middle-layer hidden states "may be utilized to mitigate the tokenization changes" (§5.2).
- **Released:** "We open-source our framework and data to facilitate future research on grammar-aware and domain-adaptive tokenization" (§1, contributions; code and data link in §1).
- **To reuse it:** an NVIDIA H100 cluster, "approximately 1840 GPU-hours in total across runs"; Hugging Face Transformers v4.53.2, the bigcode-evaluation-harness, Java 21.0.1 and Python 3.8 (App. C.4). The rewrites need a parser for each language and a list of identifier kinds that must not be renamed (App. C.2).

## On this site

- **Discussed in:** [Comparing LLM methods under noise](#/challenges/method_comparison_under_noise) · [Learning a rarely seen DSL in prompts](#/challenges/unseen_dsl_in_prompts)
- **Tags:** <span class="tags"><a class="tag" href="#/tags/compact">compact</a><a class="tag sub" href="#/tags/general-misc">general-misc</a><a class="tag sub" href="#/tags/llm-misc">llm-misc</a></span>
