# Lost in the Middle: How Language Models Use Long Contexts

**Lost in the Middle** · TACL 2024

Read: [PDF](https://arxiv.org/pdf/2307.03172) · [arXiv](https://arxiv.org/abs/2307.03172) · [DOI](https://doi.org/10.1162/tacl_a_00638)  
Code: [lost-in-the-middle](https://github.com/nelson-liu/lost-in-the-middle)

<p class="notice">A summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Measures how six LLMs (§2.2) use long inputs by moving the one relevant item through the context at fixed lengths: the answer passage among 10, 20 or 30 retrieved Wikipedia passages (multi-document QA on NaturalQuestions-Open), and the queried key among 75, 140 or 300 JSON key-value pairs of random UUIDs (§2.1, §2.3, §3.1–3.2).
- Then compares decoder-only with encoder-decoder models, the query placed before and after the data, and base against instruction-tuned models (§4), and runs an open-domain QA case study with more and more retrieved passages (§5).
- The paper whose title names the "lost in the middle" effect: the authors report accuracy "often highest" with the relevant information at the start or end of the input and "significantly" lower in the middle of long inputs, "even for explicitly long-context models" (abstract); with the answer passage mid-context among 20, GPT-3.5-Turbo scored below its closed-book 56.1% (§1, §2.3, Tab. 6). Even exact key lookup in context fell in the middle for some models (§3.2), the kind of lookup an engine does exactly.

## In plain words

Language models now accept very long inputs, but "relatively little is known about how well they use longer context" (abstract). Inputs grow long when models read long documents or get outside information such as search results or "database query results" (§1). The authors move the one useful piece of the input from start to end, and change the input's length, on two tasks: answering a question from retrieved Wikipedia passages, exactly one of which holds the answer, and returning the value stored under a key in a long list of random key-value pairs (§1–§3).

They report accuracy "often highest" with the needed information at the beginning or end and "significantly" lower in the middle of long inputs, "even for explicitly long-context models" (abstract). With the answer passage mid-way among 20, GPT-3.5-Turbo did worse than with no passages at all (§1, §2.3, Tab. 6). Versions with a longer input limit scored nearly the same on inputs both could take (§2.3). The paper presents itself as an analysis offering "new evaluation protocols" (abstract).

## Background and terms

**Terms to know:** [lost in the middle](#/glossary/lost-in-the-middle) (the glossary's name for this paper's finding) · [retrieval-augmented generation (RAG)](#/glossary/retrieval-augmented-generation-rag) · [closed-book question answering](#/glossary/closed-book-question-answering) · [greedy decoding](#/glossary/greedy-decoding-and-temperature-sampling) · [RLHF](#/glossary/reinforcement-learning-from-human-feedback-rlhf) · [decoder-only and encoder-decoder models](#/glossary/decoder-only-and-encoder-decoder-models) (§4.1, §4.2).

**The paper's own terms:**
- **Multi-document question answering**: the model gets a question and k passages, where "exactly one of the documents contains the answer" and the other k − 1 are "distractor" documents that do not (§2.1). It "mimics the retrieval-augmented generation setup" (§1).
- **Key-value retrieval**: the model gets a JSON object of k key-value pairs, all random UUIDs (128-bit random identifiers), and one key; it must return that key's value (§3.1, Fig. 6). Random strings remove "as much natural language semantics as possible", which could confound the test (§3.1).
- **Closed-book and oracle settings**: no passages at all, so the model answers from what it learned in training; or only the one passage that holds the answer (§2.3, Tab. 1).
- **Extended-context model**: a version of a model with a longer maximum input, e.g. GPT-3.5-Turbo (4K tokens) against GPT-3.5-Turbo (16K) (§2.2).
- **U-shaped performance curve; primacy and recency bias**: accuracy plotted against the position of the relevant item is high at both ends and low in the middle; doing well on items at the start is primacy bias, at the end recency bias (§1, Fig. 1).
- **Query-aware contextualization**: placing the question or key both before and after the data, instead of only after it (§4.2).
- **Serial-position effect**: the psychology finding that people recalling a list "tend to best remember the first and last elements", which the authors connect to their curve (§6.3).
- **Index n** (App. G): answer passage at position n + 1.

**Missing glossary terms:** none.

**Builds on:**
- The needle-in-a-haystack question-answering experiments of Ivgi et al. (2023), which compare the relevant paragraph at the start against a random position; this paper studies "finer-grained changes" of position (§2.1).
- The Little Retrieval Test of Papailiopoulos et al. (2023) and the line retrieval task of Li et al. (2023), which the key-value task simplifies (§3.1).
- Earlier findings that language models not tuned on instructions favour recent tokens (Khandelwal et al., 2018, and others), which the authors say their results complement (§4.3); App. E hypothesizes that such earlier work saw no primacy bias because its models were "too small".

## Problem and setting

The question: when the input context holds the needed information, does a model's accuracy depend on where it sits and on how long the input is? The authors' criterion: if models use long inputs robustly, accuracy "should be minimally affected" by the position (§1).

- **Data.** Multi-document QA uses 2655 queries from NaturalQuestions-Open ("historical queries issued to the Google search engine", with human-annotated answers from Wikipedia), keeping those whose annotated long answer is a paragraph, not a list or table; passages are Wikipedia chunks of at most 100 tokens. Distractors are the passages most relevant to the query that hold none of the annotated answers, found by the retrieval system Contriever, and shown in order of decreasing relevance (§2.1). Contexts hold 10, 20 or 30 passages (§2.3). Key-value retrieval uses 75, 140 or 300 pairs, 500 examples each (§3.2); token counts per setting are in Tabs. 2–4 (App. F).
- **Metric.** Accuracy: whether any of the annotated answers, or the correct value, appears in the model's output (§2.1; §3.1).
- **Models.** Open: MPT-30B-Instruct (8192-token limit) and LongChat-13B (16K) (LLaMA-13B extended to 16384 tokens). Closed: GPT-3.5-Turbo and GPT-3.5-Turbo (16K) (the `0613` versions), Claude-1.3 (8K) and Claude-1.3 (100K) (§2.2). Greedy decoding and "a standard set of prompts for each model" (§2.2). Extra models: Flan-T5-XXL and Flan-UL2, encoder-decoder models (§4.1); MPT-30B, the base model before instruction tuning (§4.3); GPT-4 (8K) on 500 random examples (App. D); Llama-2 7B, 13B and 70B, each with and without the extra supervised fine-tuning and RLHF of its chat version (App. E).

## Approach

Controlled variation of the prompt:
- **Position.** Reorder the passages so the answer passage sits at a chosen position (Fig. 3), or move the queried key within the JSON object (§3.1).
- **Length.** Add or remove distractor passages or random keys (Fig. 4; §3.1).
- **Robustness checks** (Apps. A–C): unambiguous questions only, using the ambiguity annotations of Min et al. (2020); random distractors; shuffled distractors, with the prompt saying so.
- **Why the curve arises** (§4, called "preliminary investigations"): decoder-only against encoder-decoder models (§4.1), query-aware contextualization (§4.2), and a base model against its instruction-tuned version (§4.3).
- **Case study** (§5): open-domain QA (a retriever's passages, of which none or many may hold the answer) with Contriever's top k passages, comparing retriever recall with model accuracy as k grows (Fig. 11).

## Results

- **Multi-document QA (§2.3, Fig. 5; full numbers Tabs. 5–7).** A U-shaped curve: models "are often much better" with the answer at the very start or end. GPT-3.5-Turbo with 20 passages goes from 75.8% with the answer first to 53.8% with it at index 9, below its closed-book 56.1% (Tab. 6, Tab. 1); the authors note its worst case in the 20- and 30-passage settings is below closed-book (§2.3).
- **Extended-context models (§2.3).** Where the input fits both versions, accuracy is "nearly identical" (Fig. 5).
- **Key-value retrieval (§3.2, Fig. 7).** Claude-1.3 and Claude-1.3 (100K) "do nearly perfectly" at all lengths; the others struggle, "especially" at 140 and 300 pairs, and GPT-3.5-Turbo, its 16K version and MPT-30B-Instruct are lowest with the key in the middle. In the 140-pair setting LongChat-13B (16K) has a different trend: with the key at the start, the authors "qualitatively observe" that it "tends to generate code to retrieve the key" instead of giving the value.
- **Architecture (§4.1, Fig. 8).** Encoder-decoder models are "relatively robust" to position only on inputs within their training-time length; Flan-UL2's best and worst positions differ by 1.9 points within 2048 tokens, and on longer inputs a U-shape appears. The authors "hypothesize" that the bidirectional encoder helps.
- **Query-aware contextualization (§4.2, Fig. 9).** On key-value retrieval "all models achieve near-perfect performance"; GPT-3.5-Turbo (16K) reaches perfect accuracy at 300 pairs, while without it the worst case in Fig. 7 is 45.6%. On multi-document QA it "minimally affects performance trends".
- **Instruction tuning (§4.3, Fig. 10; App. E, Fig. 16).** The base MPT-30B also shows the U-shape; tuning "slightly reduces" the best-to-worst gap "from nearly 10%" to "around 4%". Among Llama-2 models, only 13B and 70B show the U-shape, while 7B is "solely recency-biased"; the 13B base model has a 20-point gap, which chat fine-tuning "seems to slightly reduce" to 10 points while the bias "remains significant", and at 70B fine-tuning "minimally changes" the bias.
- **Robustness checks (Apps. A–D).** "Similar results and conclusions" on the unambiguous subset (Fig. 12); random distractors raise accuracy but models "still struggle" (Fig. 13); shuffled distractors with a prompt saying so keep the U-shape (Fig. 14); GPT-4 is most accurate but "still shows a U-shaped performance curve" (Fig. 15).
- **Open-domain QA (§5, Fig. 11).** Accuracy of the reader (the LLM answering from the passages) "saturates long before" retriever recall: going from 20 to 50 retrieved passages "only marginally improves" accuracy, by about 1.5 points for GPT-3.5-Turbo and about 1 point for Claude-1.3 (§1, §5).

## Limits the authors state

- The §4 analyses are "preliminary investigations" (§4).
- GPT-4 was run only on a subset: the full experiments "would cost upwards of $6000" (§2.2 footnote; App. D).
- Ambiguity in NaturalQuestions-Open "means that a small number of distractor passages may contain a reasonable answer" (§2.1 footnote); App. A illustrates it with the late-2018 Wikipedia dump's temporal mismatch (out of step with the NaturalQuestions annotations).
- With random distractors, "the document containing the answer can often be identified with simple heuristics (e.g., lexical overlap with the query)" (App. B).
- Whether more context helps is "ultimately downstream task-specific" (§5).
- Llama-2 runs drop 20 of the 2655 examples that exceed its 4096-token limit (App. E).

## Open problems and building blocks

  - Decoding methods other than greedy are left "to future work" (§2.2).
  - The authors suggest that "effective reranking of retrieved documents (pushing relevant information closer to the start of the input context) or ranked list truncation (retrieving fewer documents when appropriate") "may be promising directions" for readers of retrieved context (§5).
  - An evaluation protocol for future models: to claim robust use of long inputs, "it is necessary to show that its performance is minimally affected by the position of the relevant information" (§1).
  - Precise knowledge access on long contexts "may be an added challenge" beyond perplexity, which "many prior efforts" use as a proxy (§6.1).
- **Released:** "we release our code and evaluation data" (§1, footnote to the project page).
- **To reuse it:** the QA data come from NaturalQuestions-Open, a late-2018 Wikipedia dump and Contriever retrieval (§2.1, App. A); the key-value data need only random UUIDs (§3.1). Contexts reach about 6K tokens for QA and 16K for key-value retrieval (Figs. 5, 7, panel titles; per model in Tabs. 3–4). Models: open checkpoints plus the OpenAI and Anthropic APIs (§2.2).

## On this site

- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/general-misc">general-misc</a><a class="tag sub" href="#/tags/llm-misc">llm-misc</a></span>
