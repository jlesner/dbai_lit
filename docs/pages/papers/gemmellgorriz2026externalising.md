# Externalising Reasoning by Teaching Language Models to Use Programs as Tools

**Externalising Reasoning by Teaching…** · (ToolWriter, GRILLBot), PhD thesis, University of Glasgow, 2026

Read: [PDF](https://theses.gla.ac.uk/86006/3/2026GemmellG%C3%B3rrizPhD.pdf) · [DOI](https://doi.org/10.5525/gla.thesis.86006)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- ToolWriter: an existing table-QA model answers; a linear classifier over the answer's length-normalised log-probability and the table's row count decides whether to use the tool; if so, zero-shot GPT-3 (or a fine-tuned FlanT5) writes a Python lambda that keeps the relevant rows, it is run, and the model answers again on the smaller table, falling back to the full table when the program fails or returns nothing (§6.4, Eq. 6.1, PDF pp. 91–95); on WikiTableQuestions and WikiSQL against the same models without tools (Tabs. 6.3–6.5).
- An early measurement of the engine-offloading premise along data size: it reports that table-QA accuracy falls with table size before context truncation, with "accuracy drops 40% compared to smaller tables" for tables over 50 rows (§6.3.1, PDF p. 90), that the filters' gain becomes "more pronounced" as tables grow (§6.5.4, Tab. 6.6, PDF p. 99), and that "deciding when to apply a row filter tool is just as important as how to apply it", with an oracle detector above the learned one in every column (§6.5.2, Tab. 6.3, PDF p. 97). The author asks that the results be read as "principled early evidence", "not as a precise characterisation of current limitations" (§1.4, PDF p. 23).

## In plain words

It argues that a model can write a program for an interpreter to run, "to externalise reasoning at scale" (§1.5, PDF p. 23). Its chapters train models to write Python from English, then build two systems: ToolWriter, where a model writes a row filter that shrinks a table before a question-answering model reads it, and GRILLBot, a voice assistant whose parser emits one Python call per turn. With zero-shot GPT-3 writing filters and a detector choosing when to use them, [exact match](#/glossary/exact-match) on the test sets rises from 63.0 to 64.9 on WikiTableQuestions with OmniTab and from 89.0 to 90.5 on WikiSQL with TapEx (Wikipedia-table question benchmarks; existing table models) (Tab. 6.3, PDF p. 97), "new state-of-the-art results" in the author's words (§6.5.3, PDF p. 98).

## Background and terms

**Terms to know:** [semantic parsing](#/glossary/semantic-parsing) · [BLEU and ROUGE](#/glossary/bleu-and-rouge) (BLEU only) · [BM25](#/glossary/bm25) · [lost in the middle](#/glossary/lost-in-the-middle) · [tool calling (function calling)](#/glossary/tool-calling-function-calling) · [tabular question answering (TQA)](#/glossary/tabular-question-answering-tqa) (scored by exact match; §6.1–6.2, Fig. 6.2, PDF pp. 86–88) · [pseudo-relevance feedback](#/glossary/pseudo-relevance-feedback) (here adjusting the decoder's token probabilities; §4.2.4, PDF pp. 54–55).

**The paper's own terms:**
- **tool use**: deciding whether to use a tool, writing a program, running it on the data and answering from the result, not translation alone (§1.3, PDF p. 22).
- **tool use framework**: a task processor that answers, a "tool required" decision system, a program generator, and execution that turns data T_i into T_{i+1} (the data before and after the program runs) (§2.1–2.2, Fig. 2.1, PDF pp. 30–33).
- **semi-structured data**: "data that combines rigid and free-form dimensions", such as tables and key–value stores (§2.1, PDF p. 31).
- **weak supervision**: here, signal from pre-trained models and unlabelled data, such as code with docstrings and GPT-3-written descriptions of code (Hyp. 2, §1.6, PDF p. 25); not the glossary's sense. In Ch. 6: training from answers, not annotated programs (WikiSQL, §6.2.1–6.2.2, PDF p. 89).
- **reiteration**: BART (a pre-trained encoder-decoder) learns to rebuild a text with masked spans; reiteration fine-tunes it the same way, with the description as a code comment followed by a mask (§5.3.2, Fig. 5.5, PDF pp. 70–71). (The **translation** objective maps it straight to code.)
- **PreCode**: BART further pre-trained with masked spans on Python functions from CodeSearchNet (§5.4.1, PDF p. 73). **AugGPT3**: CoNaLa's mined Stack Overflow snippets (top 50k) with descriptions written by few-shot GPT-3 (§5.5.1, PDF p. 76).
- **oracle detector**: one built from the gold answers (§6.4.1, PDF p. 92). **SeqLogProb**: the answering model's length-normalised log-probability of its answer (Eq. 6.8, PDF p. 93).
- **TaskGraph** and **Neural Decision Parser (NDP)**: GRILLBot's graph of a task's steps, and the model that writes its policy as code (§7.2.1, §7.5, PDF pp. 106–110).

**Missing glossary terms:** none.

**Builds on:**
- Lavrenko and Croft's relevance-based language models [76] (word distributions estimated from top retrieved documents) and See et al.'s pointer-generator networks [121] (decoders that can also copy input words) (§4.2.4, PDF pp. 54–56); BART [81], with TranX [150] (an RNN that decodes syntax trees) as baseline (§5.3.3, §5.5.1, PDF pp. 71, 77).
- The table models OmniTab [64], UnifiedSKG [145] and TapEx ([TAPEX](#/papers/liu2021tapex "TAPEX: Table Pre-training via Learning a Neural SQL Executor (2022)")) as answering models (§6.4.2, PDF p. 93).
- Toolformer [119] (a model that teaches itself to call APIs), PAL [42] ([PAL (Program-aided Language Models)](#/papers/gao2022pal "PAL: Program-aided Language Models (2022)"); the model writes Python that an interpreter runs) and TALM [104] (tool-augmented language models), set apart from its task-specific filter programs (§3.5, PDF p. 43).

## Problem and setting

- **Ch. 4:** one Python line from one English sentence, on Django (line-by-line descriptions of a web framework), Hearthstone (card texts paired with Python classes) and CoNaLa (curated Stack Overflow pairs); scored by BLEU; programs are not run (Fig. 4.1, §4.3, PDF pp. 50, 56–57).
- **Ch. 5:** conversational query rewriting (turning a follow-up question into a self-contained one) on TREC CAsT (multi-turn search conversations) (§5.2, PDF p. 64), then CoNaLa, scored by BLEU and by whether the output parses as Python (§5.3.3, PDF p. 71). Its English-to-code studies "are not, as of yet, reviewed" (§1.7, PDF p. 27).
- **Ch. 6:** exact match; train and test tables don't overlap; questions are answerable from the table alone (§6.2, PDF p. 88). Data: WikiTableQuestions (2,108 tables), WikiTableQuestions-Filter (dev questions whose SQL-like SQUALL annotation filters rows) and WikiSQL, used with answer spans as ground truth (§6.2.1, PDF pp. 88–89).
- **Ch. 7:** exact match of function and arguments on human-curated sets with tasks unseen in training, and Alexa users' ratings from 0 to 5 (§7.7, PDF p. 111).
- Results are as originally published, with no later baselines (§1.8, PDF p. 28).

## Approach

- **Relevance Transformer (§4.2.4, PDF pp. 54–56).** A small Transformer that can copy input tokens (Eq. 4.4); at each step, token frequencies in the code of BM25-retrieved training pairs, weighted by retrieval score, with decoded tokens penalised, are mixed into the next-token distribution (Eqs. 4.1–4.4). "Naïve Retrieval" instead concatenates the top snippet to the input.
- **ToolWriter (§6.4, PDF pp. 91–95).** If the detector says so, a generator writes a Python lambda placed in `new_table = table[table.apply(lambda ... , axis=1)]`, and the answering model's answer on the filtered table replaces its first one (Eq. 6.1). Generators: FlanT5-XL fine-tuned on SQUALL questions with one SELECT and WHERE, or zero-shot GPT-3 ("text-davinci-003", temperature 0.2) shown the question and two table rows (Fig. 6.5). An exception or empty result falls back to the full table.
- **GRILLBot (Ch. 7, PDF pp. 102–111).** Recipes and DIY tasks become TaskGraphs (directed acyclic graphs of nodes such as steps, conditions and actions), with navigation, question-answering and search tools (§7.2–7.3, PDF pp. 104–107). The NDP, T5-large fine-tuned on "approximately 1,200 annotated turns" built by human annotation and GPT-3 augmentation, writes one Python call per turn (e.g. `step_select(2)`), and a state dictionary, updated after each call, holds state (§7.5–7.6, PDF pp. 108–111).

## Results

- **Table size (§6.3, PDF pp. 89–91).** For tables over 50 rows, "accuracy drops 40% compared to smaller tables", and it falls before context limits apply, an effect the author reads as "beyond just context window constraints" (§6.3.1, Fig. 6.3, PDF p. 90). On 51 dev questions, keeping hand-picked relevant rows raised exact match for all four models; removing half the rows at random lowered it (Tab. 6.1).
- **Generators (Tab. 6.2, PDF p. 95):** they "almost universally increase model performance" on the filtering subset.
- **Detectors (Tab. 6.3, PDF p. 97):** always or never applying the filter is lowest "in all cases"; SeqLogProb helps every model, and "Performance increases further as we include table length". The oracle reaches 68.3 on the WikiTableQuestions test set with OmniTab, against 64.9 for the combined detector.
- **Long tables (Tab. 6.6, PDF p. 99):** the gain becomes "more pronounced" as tables grow.
- **Ch. 4 (Tabs. 4.1–4.2, PDF pp. 59–60):** CoNaLa BLEU 22.3 for the Relevance Transformer, against 17.5 for the Transformer and 10.6 for the best earlier method without syntax trees. Naïve Retrieval lowered BLEU on all three datasets.
- **Ch. 5 (Tabs. 5.2–5.9, PDF pp. 71–82):** reiteration raised BLEU but barely the parse rate. Under translation fine-tuning, PreCode raised the parse rate from 44.8% to 87.0% and BLEU from 14.53 to 31.32 (Tab. 5.3); code alone has "the largest relative effect on syntactic correctness", adding docstrings "the biggest relative impact in semantic similarity" (Tab. 5.4, PDF p. 74). With AugGPT3, aligning the objectives "is less important" (§5.5.2, PDF p. 78); used before CoNaLa fine-tuning, synthetic data from Hearthstone or Django code gave "no discernible benefit" (§5.5.3, Tab. 5.9, PDF p. 82).
- **Ch. 7 (Tab. 7.1, PDF p. 112):** the T5-large NDP gets 86.3% of test calls fully right, against 82.8% for T5-base and 62.2% for T5-small; ratings showed "a consistent upward trend", and GRILLBot was "the winning system for the 2021/22 Amazon Alexa Prize TaskBot competition" (§1.7, PDF p. 27).
- **App. B (Tab. B.1, PDF pp. 119–120):** the table models do worse on large-number arithmetic (except GPT-3) and counting rows (except OmniTab).

## Limits the authors state

- Results are to be read "not as a precise characterisation of current limitations"; some limitations "have been addressed by scale and improved training data" (§1.4, PDF p. 23).
- The parse-rate gain from reiteration "is likely to be noise" (§5.3.4, PDF p. 71); parsing "does not result in functional code, as run-time errors are not checked" (§5.5.1, PDF p. 77).
- "Language models have no formal guarantees for executable code" (§6.4.2, PDF p. 95).
- ToolWriter only filters rows and "relies exclusively on the underlying TQA model to perform all aggregations, arithmetic mappings, and groupings"; relevant rows "may still overwhelm" the model; string matching "can break down in more semantic contexts", with no neural filtering; it "is sensitive to cascading errors", since the generator isn't told why the model failed. Possible fix: a rationale naming the failure, to guide tool generation (§6.6, PDF pp. 99–100).
- The NDP "struggles with more complex timer-based interactions"; ratings "are influenced by many factors, such as improved TaskGraph corpora and other system improvements" (§7.8, PDF p. 112), are subjective, and users "very rarely" return (§7.7, PDF p. 111).

## Open problems and building blocks

  - "significant headroom in both detecting when to use tools and how to generate them under oracle settings" (§6.7, PDF p. 100).
  - Calibrated uncertainty in tool use: "when to act, when to ask for clarification, and when to defer" (§8.1, PDF p. 116).
  - Longer loops, where "errors compound", with supervision moving from labels "to ground-truth-verifiable rewards on tasks with definite answers" and beyond (§8.1, PDF p. 116).
- **Released:** Nothing stated.
- **To reuse it:** a table model's answer log-probability, the GPT-3 API or a fine-tuned FlanT5-XL (two RTX 3090 GPUs, 8 hours), and Python to run the filter (§6.4.2, PDF pp. 93–94); T5-large for the NDP (§7.5, PDF pp. 108–109).

## On this site

- **Discussed in:** [Reliability that holds with size, by handing the procedure to an engine](#/challenges/engine_offloading_with_size)
- **Tags:** <span class="tags"><a class="tag" href="#/tags/dbtask">dbtask</a><a class="tag sub" href="#/tags/harness-general">harness-general</a><a class="tag sub" href="#/tags/llm-method">llm-method</a></span>
