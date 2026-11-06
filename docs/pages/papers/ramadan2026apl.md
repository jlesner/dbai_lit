# Neural Code Translation of Legacy Code: APL to C\#

**Neural Code Translation of Legacy Code** · preprint 2026 (Technical University of Denmark and SimCorp)

Read: [PDF](https://arxiv.org/pdf/2605.13896) · [arXiv](https://arxiv.org/abs/2605.13896)

<p class="notice">A summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Measures LLM translation of APL, an array language written in its own glyphs, into C#, scored by compiling the C# and running it on input–output test cases, on a 49-function test split of utility functions from production code (§4; §4.2); direct translation (fine-tuned Qwen3-32B and Gemma-4-31b-it, prompted GPT-5 and Claude Opus 4) against three guided routes: a two-stage route through an English description of the program, retrieval of APL idiom documentation, and a loop of up to 5 tries fed compiler errors and failed tests (§4.1; §5.2; Tab. 2).
- Adds C# method signatures, generated from APL type headers by an F# parser, to the prompt (§4.2); also measures how four models' tokenizers cut APL glyphs (§5.1, Tab. 1), varies the size of the production training split (§6.2, Fig. 2), and classes the loop's failures as compile, runtime or functional errors per iteration (§6.3, Fig. 3).
- Evidence on LLMs reading a language rare in pretraining, with a test run as the check, and on what signatures, descriptions and execution feedback add: the authors report a best full pass rate of 79.59% (39/49), for Claude Opus 4 with signatures, descriptions and the feedback loop (§6.1, Tab. 2), and that the failures left are mostly wrong behaviour, not code that fails to compile or run (§6.3). Its tokenizer table is one measurement of how general tokenizers cut APL glyphs, but the paper does not test that cut against accuracy (ours).

## In plain words

Many organizations rely on old systems in less common languages whose experts are becoming fewer (§1). The authors ask how well LLMs translate APL, an array language with its own symbols, into C#. They build matching APL and C# programs, including production utility functions, and score a translation by compiling the C# and running it on test inputs (abstract; §4). They compare plain translation, by open-weight models (fine-tuned), GPT-5 and Claude Opus 4, with three kinds of help: an English description written first; retrieved APL documentation; and a loop that feeds compiler errors and failed tests back for up to five tries. Prompts also get C# method declarations derived from APL type comments (§4.1; §4.2; §5.2). On 49 held-out production functions, Claude Opus 4 with declarations, a description and the loop passes every test on 79.59% (39 of 49), and the open-weight Gemma-4-31b-it with the same help 77.55%, against 40.82% for plain Claude Opus 4 (§6.1, Tab. 2). Writing "To the best of our knowledge", the authors present "the first systematic investigation and specialized dataset for APL-to-C# translation" (§2).

## Background and terms

**Terms to know:** [LoRA (low-rank adaptation)](#/glossary/lora-low-rank-adaptation) · [retrieval-augmented generation (RAG)](#/glossary/retrieval-augmented-generation-rag) · [tokenization and byte-pair encoding (BPE)](#/glossary/tokenization-and-byte-pair-encoding-bpe) · [chat template](#/glossary/chat-template) · [cosine similarity](#/glossary/cosine-similarity) · [self-correction](#/glossary/self-correction) · [automated program repair](#/glossary/automated-program-repair)

**Bridge (ours):** in the glossary's terms, the authors treat APL as a [low-resource programming language](#/glossary/low-resource-programming-language): "APL glyphs are not very common in most LLM training datasets" (§5.1).

**The paper's own terms:**
- **APL**: "an array-oriented language developed by Kenneth E. Iverson" (§3.1), whose built-in operations ("primitives") are single glyphs such as ⍳ (count up from 1) and ⍴ (reshape) that act on whole arrays without loops. The paper uses Dyalog APL, an implementation the authors call "widely used" that adds object-oriented constructs (§3.1).
- **Monadic and dyadic functions**: APL functions taking one argument (on the right) or two (left and right) (§3.1).
- **APL idioms**: standard combinations of primitives with a known meaning, such as the average of an array (§3.1).
- **Function headers and method signatures**: in large APL systems, comments that document the expected argument shapes and types (§3.1). The authors' "APL header parser", written in F# (a functional language), turns them into C# method signatures (declarations with parameter and return types) that go into the prompt; "Signatures" in Tab. 2 marks runs with them (§4.2; Tab. 2 caption).
- **Datasets A, B, C and I** (§4.2): A, 800 hand-curated pairs of basic constructs; B, 143 hand-curated utility functions "derived from production environments", more complex than A; C, 320 pairs from Rosetta Code (a website of programming tasks solved in many languages); I, 45 idioms whose C# was generated from their descriptions and then checked by hand. The training splits are merged into 1066 samples; all of Tab. 2 is scored on B's test split of 49 functions.
- **Compile, partial pass and full pass rate**: the share of the 49 programs that compile, that pass "a subset" of their test cases, and that pass all of them (Tab. 2 caption).
- **PT and FT**: a stage run by a pre-trained off-the-shelf model, or by a fine-tuned one (§4.1).
- **Single-token rate and round-trip failures**: the share of APL glyphs a tokenizer encodes as one token, and inputs that don't come back unchanged after encoding and decoding (§5.1).
- **Compilation, runtime and functional errors**: code that doesn't compile; compiles but fails while running, "usually due to invalid indexing or unhandled edge cases"; or runs but gives wrong output (§6.3).

**Builds on:**
- Tai et al. [17], who report that natural-language descriptions can improve code translation; the description route is "Based on this" (§4.1).
- Lei et al. [5]: the datasets of equivalent program pairs follow "an approach similar to" their high-performance computing dataset (§1).
- Retrieval: RAG as introduced by Lewis et al. [21] (§4.1), and Bhattarai et al. [18], who retrieve example translations for Fortran to C++ (§2).
- Feedback loops: AlphaTrans [19], which reprompts with error descriptions when validation fails (§2), and Vallecillos Ruiz et al. [7] on iterative program repair (§1).

## Problem and setting

- **Questions** (§1): how LLMs perform and which guidance helps most (RQ1); how far performance is limited by training-data size (RQ2); what causes failed translations (RQ3).
- **Task:** one APL program or function at a time, treated as "a sequence-to-sequence generation problem" (§4). A translation is correct when it compiles and "produces the expected outputs on test cases" (§4); there is no proof of equivalence. Each data point carries input–output cases with the APL and C# arguments and the expected output (Listing 1.1).
- **Test set:** Dataset B's 49 test functions; B, "which comprises production-grade code, had the strongest influence on the accuracy" (§4.2).
- **Models** (§5.2): the open-weight Qwen3-32B and Gemma-4-31b-it (Google DeepMind's Gemma 4), "selected based on the tokenization analysis", and the closed-weight GPT-5 (cited as OpenAI's "GPT-5-chat-latest" documentation, [26]) and Claude Opus 4. Fine-tuning uses LoRA with 8-bit quantization (frozen weights stored in low precision to save memory) and a sequence length of 2048 (§5.3); the same prompt content is used for all models (§5.2; Listing 1.2).
- **Fine-tuned stages:** §5.2 says both stages of the open-weight description pipeline are fine-tuned.
- **Not discussed:** how many test cases each function has.

## Approach

- **Direct translation** (§4.1): the baseline; open models fine-tuned on APL–C# pairs, closed models prompted (Tab. 2).
- **Translation through a description** (§4.1): one model writes an English description of the APL code, a second writes C# from the APL plus the description. §4.1 lists four PT/FT combinations; Tab. 2 reports pairs of models, including mixed ones (Qwen3-32B describing for GPT-5 and the reverse).
- **Retrieval** (§5.2): documents from the APL2 Idioms Library (an IBM technical report) and the FinnAPL Idiom Library (Finnish APL Association) are split into chunks and embedded with OpenAI's text-embedding-3-large; the APL snippet is the query, the top 5 chunks by cosine similarity are condensed by "the lightweight GPT-5-mini model", and the summary goes to GPT-5.
- **Iterative translation** (§5.2): a wrapper compiles and runs the C#; if any test fails, the next prompt carries the history of attempts, with "compiler error messages, method arguments and signature, expected and actual outputs", for "up to 5 iterations" or until the output is correct.
- **Tokenizer analysis** (§5.1): four models' tokenizers (the two open models, Deepseek-Coder-6.7b-Instruct and CodeLlama-34b-hf) are compared on APL glyphs to choose the open models.
- **Recommended workflow** (Fig. 1): generated signatures and description, user-supplied test cases, then the feedback loop.

## Results

- **Tokenizers** (§5.1, Tab. 1): single-token rates run from 0.715 (Qwen3-32B) to 0.350 (CodeLlama-34b-hf); Deepseek-Coder's tokenizer has 61 round-trip failures because it replaces the division glyph ÷ with an unknown-token marker. The authors conclude that handling APL glyphs well "is an important performance factor as LLMs with better APL tokenization produce shorter sequences and avoid round-trip failures".
- **Signatures** (§6.1, Tab. 2): the authors report that they "significantly" improve performance; for example, full pass rises from 20.41% to 51.02% for GPT-5 and from 22.45% to 46.94% for fine-tuned Gemma-4-31b-it.
- **Descriptions** (§6.1): the authors say that adding them "consistently improves both partial- and full pass rates across all models", and that fine-tuned Gemma-4-31b-it "emerges as a strong performer, rivaling closed-weights alternatives".
- **Retrieval** (§6.1): "a modest improvement for GPT-5, performing similarly to the natural language setup".
- **Feedback loop** (§6.1, Tab. 2): the highest full pass rates, 79.59% (39/49) for Claude Opus 4 and 77.55% (38/49) for Gemma-4-31b-it, both with signatures and descriptions. The authors recommend combining signatures, descriptions and feedback (RQ1 answer; Fig. 1).
- **Training-data size** (§6.2, Fig. 2): with the configuration fixed and Dataset B's training split varied, the compile rate rises fast while the full pass rate "shows a more gradual ascent"; the authors conclude that "performance is currently limited by the dataset size".
- **Error classes** (§6.3, Fig. 3, over 5 iterations of the loop, shares "calculated across all test cases"): functional errors are "the dominant cause of failure" and are lower at iteration 5 than at iteration 1; compile and runtime errors are "the easiest for the model to fix through iterative feedback". The authors' RQ3 answer: most failures come from "misunderstanding the intent of the APL code rather than low-level code generation failures".

## Limits the authors state

- Hardware: two 80 GB H100 GPUs per job, so "we were restricted to only selecting models that can be accommodated within these compute and memory thresholds"; the largest model they could fine-tune "had approximately 30 billion parameters" (§5.3).
- 8-bit quantization's "dequantization overhead increased fine-tuning durations several times compared to standard training" (§5.3).
- Training from scratch was not considered, being "generally too costly" and needing "a significant sized dataset" of equivalent pairs (§4.1).
- "Performance is currently limited by the dataset size" (§6.2).
- Models "struggle to preserve the functionality of the original APL code" (§6.3).
- Retrieval scores for APL queries are often close, so "This lack of a dominant, high-utility source prevents the extraction of a meaningful context" (§6.1).
- Citing [9], the authors write that translation quality "depends on the choice of source and target programming languages" and that "findings from one language pair may not generalize to others" (§2).

## Open problems and building blocks

  - "expand the training corpus and evaluate additional LLMs" (§7); further scaling of the training data "is likely to yield additional improvements" (§6.2).
  - Closed models "achieve the best results", but moving to open-source models "is worth investigating" for private deployment and control over intellectual property (§7).
  - A multi-agent system for "project-level migrations" that handles cross-file dependencies (§7).
- **Released:** Nothing stated.
- **To reuse it:** two 80 GB H100 GPUs; LoRA with 8-bit quantization; fine-tuning on the full training set "typically 9–12 hours" and inference on the whole test set "roughly 15 minutes" (§5.3). The signature parser needs APL function headers that document types (§3.1; §4.2); the workflow needs test cases from the user (Fig. 1); retrieval uses OpenAI's embedding model, GPT-5-mini and GPT-5 (§5.2).
- **Beyond its domain:** the approaches "could also be applied to other legacy languages" (§7).

## On this site

- **Discussed in:** [Learning a rarely seen DSL in prompts](#/challenges/unseen_dsl_in_prompts)
- **Tags:** <span class="tags"><a class="tag" href="#/tags/code">code</a><a class="tag" href="#/tags/compact">compact</a><a class="tag" href="#/tags/harness">harness</a><a class="tag" href="#/tags/llm">llm</a><a class="tag" href="#/tags/rarelang">rarelang</a><a class="tag" href="#/tags/study">study</a></span>
