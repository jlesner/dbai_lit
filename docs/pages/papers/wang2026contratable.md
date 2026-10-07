# The Table Says Otherwise: Testing LLMs with Counterfactual Relational Data

**ContraTable ("The Table Says Otherwise")** · VLDB 2026 Workshop (NOVAS)

Read: [PDF](https://arxiv.org/pdf/2606.23667) · [arXiv](https://arxiv.org/abs/2606.23667)  
Code: [LLM_understand_table](https://github.com/AuroraWXZ/LLM_understand_table)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Tests whether LLMs answer from the relational tables they are given or from facts learned in pretraining (abstract).
- Paired original and counterfactual databases with the same schemas, identifiers and relationships, and matched questions at three levels (abstract).
- Whether an LLM can act as an engine over the data in front of it.

## In plain words

When an LLM answers questions over tables of familiar real-world facts, it is unclear whether it reads the tables or recalls pretraining knowledge; for database applications the tables should be the source of truth (abstract, §1). The authors' benchmark, ContraTable, has 214 questions over a football database, each asked on real data and on a copy with selected facts changed. They report that strong instruction-tuned models can often handle direct lookup, but reliability drops as questions need joins, comparison and reasoning over dates. For the commercial GPT-5.4-Mini, the drop on changed data (graded by GPT-4o) grows from 0 to about 10 and 19 points across three levels (§4.3). ContraTable adapts a test from research on editing models' stored facts (§1).

## Background and terms

**Terms to know:** [LLM-as-a-judge](#/glossary/llm-as-a-judge) · [relational algebra](#/glossary/relational-algebra) · [text-to-SQL](#/glossary/text-to-sql)

**The paper's own terms:**
- **original / counterfactual database**: two aligned versions with the same schemas, identifiers and relationships; the counterfactual one replaces selected facts with "valid conflicting values" (§3.2).
- **counterfactual gap**: the accuracy drop from the original to the counterfactual database (§4.3).
- **Level 1 / 2 / 3**: single-table lookup (one row, like a selection then projection); multi-table lookup (joins to a directly named entity, no aggregation); multi-table temporal reasoning (joins plus filtering, ordering, aggregation, comparison or date-interval reasoning) (§3.1, Tab. 1).

**Missing glossary terms:**
- **table question answering (table-QA)**: answering natural-language questions from given tables; prior work evaluates capabilities such as cell lookup, fact verification and numerical operations (§2).
- **knowledge conflict**: input evidence contradicts what a model stores in its parameters; models "may prefer memorized answers" then (§2).
- **knowledge editing**: research that changes facts stored in a model, tested with counterfactual facts (§1, §2).

**Builds on** (none on this site):
- Knowledge-editing benchmarks, "the closest methodological precedent": ROME's CounterFact, CounterFact+, MQuAKE, RippleEdits (§2); the idea moves "from isolated facts to relational databases" (§1).
- Knowledge-conflict QA over text: Longpre et al., DisentQA (§2).
- Tenet, which uses modified tables to make training examples; here they serve evaluation (§2).
- The Transfermarkt football data: joinable CSV files of players, clubs, games and transfers (§3).

## Problem and setting

- **Question:** does an LLM follow the provided database or its prior knowledge, and how does that change with reasoning difficulty (§1)?
- **Data:** 2023–2025 transfers and related entities; 214 templates (61 Level 1, 79 Level 2, 74 Level 3), each instantiated once per database, 428 questions (§3, Tab. 1).
- **Correct:** the reference answer "always follows the provided tables", computed by a program; the model isn't told which database it gets (§3.2, §3.3).
- **Input:** zero-shot, no chain-of-thought instructions; CSV excerpts; the model returns an answer and a brief table-grounded explanation (§3.3, Fig. 1). Rows are limited: evidence rows always included, others sampled as distractors (§4.1).
- **Models:** commercial Gemini-3.1-Flash-Lite and GPT-5.4-Mini; open-source Gemma-4 (E2B-it, E4B-it), Qwen3.5 (2B, 9B), Llama-3.2 (1B, 3B Instruct) and Llama-3.1-8B, base and Instruct (§4.1).
- Row counts and decoding settings: not discussed.

## Approach

- **Counterfactual edits (§3.2):** schema, types, identifiers, keys and the questions' join paths are kept. Categorical values move "through one-to-one chain swaps over valid values, with no self-mapping or repeated replacement"; coupled fields change together; numbers and dates get "small valid perturbations"; transfers and game events are unchanged. Edited attributes include capitals, club countries, stadiums, citizenship, height and date of birth.
- **Questions (§3.3):** GPT-5.5 drafts templates for authors' chosen attributes, join paths and levels; the authors review them. Answers and evidence come only from the program.
- **Scoring (§4.2):** GPT-4o judges the whole response, since a correct yes/no "may be supported by reasoning that is inconsistent with the supplied tables"; its prompt was revised after manual checks, then fixed.

## Results

GPT-4o-judged accuracy (Tab. 2):
- **Gap grows with level:** Level 1 "usually has the smallest counterfactual gap"; GPT-5.4-Mini's gap is 0, 10.13 and 18.92 points at Levels 1–3; Qwen3.5-9B and Gemma-4-E2B-it have Level 2 gaps of 20.25 and 31.65 points (§4.3).
- **Explanations:** in changed predictions, "in many cases" the model justifies its answer with real-world knowledge rather than the table, "especially clear in Level 3" (manual inspection, §4.3).
- **Stronger models help, gap remains:** best on Level 3 is Gemini-3.1-Flash-Lite, 94.59% original against 89.19% counterfactual; within the Qwen and Gemma families the larger model is better on both Level 3 versions (§4.3).
- **Instruction tuning:** Llama-3.1-8B-Instruct reaches 68.22% overall original accuracy against 5.14% for the base model, but counterfactual accuracy is "still much lower" (43.46%) (§4.3, Tab. 2).

## Limits the authors state

- "The trend is not perfectly monotonic for all models"; the gap "is most meaningful when the model first performs reasonably well on the original database" (§4.3).
- Gemini-3.1-Flash-Lite's counterfactual Level 1 score is slightly higher than its original; the only original error comes "from wording ambiguity rather than counterfactual reasoning" (§4.3).

## Open problems and building blocks

- **Open** (§5):
  - Compare a text-to-SQL pipeline with direct LLM answering on accuracy, latency and inference cost: "whether end-to-end LLM methods can replace database pipelines".
  - Rebuild the levels as a taxonomy of operations; Level 3 to hold queries "natural for SQL but challenging for LLMs" and tasks "difficult to express in standard SQL" such as semantic joins.
  - Add "a table-free, closed-book baseline" and check whether errors match the original database, "to distinguish knowledge intrusion from general reasoning failures".
- **Released:** "The source code, data, and/or other artifacts have been made available" (title page, "VLDB Workshop Artifact Availability").
- **To reuse it:** the two databases, the templates and an LLM judge with its prompt (§3, §4.2). Run time and cost: not stated.

## On this site

- **Tags:** <span class="tags"><a class="tag" href="#/tags/dbtask">dbtask</a><a class="tag sub" href="#/tags/general-misc">general-misc</a><a class="tag sub" href="#/tags/llm-misc">llm-misc</a></span>
