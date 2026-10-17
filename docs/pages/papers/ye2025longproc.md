# LongProc: Benchmarking Long-Context Language Models on Long Procedural Generation

**LongProc ("Long Procedural Generation")** · COLM 2025

Read: [PDF](https://arxiv.org/pdf/2501.05414) · [arXiv](https://arxiv.org/abs/2501.05414)  
Code: [LongProc](https://github.com/princeton-pli/LongProc)

<p class="notice">A summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- A benchmark of six procedural generation tasks (HTML to TSV, pseudocode to C++, path traversal, theory-of-mind tracking, Countdown, travel planning): the model follows a deterministic procedure described in the prompt and writes a structured output of about 500, 2K or 8K tokens, the three difficulty levels (abstract; §3, Tab. 2).
- Scores 23 models with rule-based metrics (row-level F1, unit tests, exact match of the whole trace, solution validators; §3.3), then measures per-segment correctness with the gold prefix filled in (§5, Fig. 4) and sorts GPT-4o's 8K errors into recall and reasoning errors (App. A.4).
- Text-only execution of procedures that a program or an engine could run exactly, HTML-to-table extraction among them, with checked outputs and no program arm: a text baseline for [Reliability that holds with size, by handing the procedure to an engine](#/challenges/engine_offloading_with_size) and per-segment evidence for [Whole-job reliability of multi-step LLM work](#/challenges/whole_job_reliability). The authors report that the best model under 15B parameters reaches only 24.6 on average at the 2K level (§4, Tab. 3).

## In plain words

Benchmarks for language models with long inputs mostly test recall: find a few relevant snippets among thousands of irrelevant tokens and answer briefly (abstract). The authors argue this says little about practical tasks, such as a web agent's, that combine scattered information and write long outputs (§1). They build LongProc, six tasks in which the model follows a step-by-step procedure described in the prompt and writes a long, structured output that a program can score, with no judge model (abstract; §3.3). They test 23 models at three output lengths, about 500, 2,000 and 8,000 tokens (abstract).

They report that GPT-4o's average score falls from 94.8 on the shortest outputs to 38.1 on the longest, and that the best score there, Gemini-1.5-Pro's, is 54.0 (Tab. 3). Open models "typically falter on 2K-token tasks" (abstract), and on the two tasks where they measure it, errors grow in the later parts of an output (§5). The authors present a new benchmark; "To the best of our knowledge, no previous benchmark encompasses all of the listed qualities" (Tab. 1).

## Background and terms

**Terms to know:** [exact match](#/glossary/exact-match) · [F1 score](#/glossary/f1-score) · [greedy decoding](#/glossary/greedy-decoding-and-temperature-sampling) · [Distillation into compact models](#/glossary/distillation) · [needle in a haystack (NIAH)](#/glossary/needle-in-a-haystack-niah) (§2) · [information dispersion](#/glossary/information-dispersion) (§1, from Goldman et al., 2024)

**The paper's own terms:**
- **LCLM** (long-context language model): a language model whose context window holds long inputs; every tested model claims one of 32K tokens or more (Tab. 3).
- **Long procedural generation** (§1): the paper's evaluation paradigm, which requires models to "follow specified procedures and generate structured outputs".
- **Procedure, entry, gold output** (§3): a fixed procedure turns the input into a gold output made of entries, such as TSV rows (TSV: tab-separated values, a text table). It is deterministic: at each step exactly one entry is correct, fixed by the input and the entries before it.
- **Difficulty level** (§3.2): a subset of a task whose gold outputs need about 0.5K, 2K or 8K tokens (counted with the Llama-3 tokenizer). Pseudocode to Code has no 8K level and Travel Planning no 0.5K level.
- **Reasoning models** (Tab. 3, marked ℛ): models trained with long chain of thought; here the R1-distilled Qwen and Llama models (§4).
- **ICL and ICL with procedure** (§5): in-context learning prompts with input-output example pairs only, against prompts that also spell out the procedure.
- **Termination rate** (App. A.2, Tab. 5): whether a model finishes and emits its end-of-sequence token within the token budget.

**Missing glossary terms:** none.

**Builds on:**
- Its tasks adapt earlier datasets: web pages from Arborist (Li et al., 2024c; web pages paired with program-synthesis tasks, App. B.1), SPoC (Kulal et al., 2019; pseudocode with C++ unit tests), Countdown problems (reach a target number by arithmetic) from Gandhi et al. (2024), and travel planning from Natural Plan (Zheng et al., 2024, a planning benchmark) (§3.1).
- The long-context benchmarks it compares itself with (Tab. 1, §2): NIAH (Kamradt, 2023), RULER (Hsieh et al., 2024; a recall benchmark of the NIAH kind), HELMET (Yen et al., 2025), and long-output benchmarks such as LongGenBench and LongWriter.
- The R1-distilled models of DeepSeek-R1 (Guo et al., 2025; [DeepSeek-R1](#/papers/deepseek2025reasoning "DeepSeek-R1: Incentivizing Reasoning Capability in LLMs via Reinforcement Learning (2025)")) (§4).

## Problem and setting

- **Question:** can long-context models follow a given procedure over many steps, using information spread across the input and their own earlier output, when the output itself is long (§1, §3)?
- **Tasks** (§3.1, Tab. 2):
  - **HTML to TSV**: extract query-specified fields from a cleaned web page into a table.
  - **Pseudocode to Code**: translate pseudocode line by line into C++.
  - **Path Traversal**: write the route between two cities when each city has exactly one outgoing connection, so no search is needed.
  - **Theory-of-Mind (ToM) Tracking**: track, step by step, where a person believes an object is, given what they could see (Sally–Anne style stories, after a classic false-belief test, App. B.4).
  - **Countdown**: reach a target number from four numbers with +, −, × and ÷, by a depth-first search with backtracking written out in the output (Fig. 2; App. B.5).
  - **Travel Planning**: a depth-first search for a multi-city plan meeting fixed dates, stay lengths and direct-flight constraints (App. B.6).
- **What "correct" means** (§3.3, App. C): HTML to TSV takes row-level F1, a row counting only if every column matches after normalization (lower-casing, removing extra whitespace and punctuation); Pseudocode to Code runs the unit tests; Path Traversal and ToM Tracking need an exact match of the whole trace; Countdown and Travel Planning check only the final solution with the original rule-based validators, and "We do not evaluate the search trace generated by the models" (App. C). Answers are read between tags, and reasoning models' thinking tokens are kept (App. C).
- **Models and decoding** (§4): 23 models, open (Llama, Qwen, Mistral, Phi-3, Jamba, ProLong (a Llama-3-8B trained for long contexts), R1-distilled) and proprietary (GPT-4o, Claude 3.5, Gemini 1.5); greedy decoding; a 0.5K–1K token buffer above each level, for tokenizer differences; up to 16K tokens for reasoning models. Procedures with worked examples are in the prompts "for all tasks, except for HTML to TSV and Pseudocode to Code" (§4).

## Approach

- **A shared framing** (§3): every task is a deterministic procedure, so each output entry can be compared with its gold entry by a rule. The instructions describe the procedure step by step, with few-shot examples (§3; Fig. 2 shows Countdown's; §4 names exceptions).
- **Three demands** (§3.2, Tab. 2): the tasks differ in accessing information, deductive reasoning and executing search.
- **Difficulty by output length** (§3.2, App. B): levels are built by selecting data points by gold output length, by splitting websites (App. B.1), or by the number of cities in the path (App. B.3). HTML to TSV adds filtered versions that extract only rows meeting a condition (App. B.1).
- **Analyses** (§5, App. A): per-segment correctness, with the output cut into four equal segments and the prompt filled with the gold earlier segments (§5); error categories on 20 GPT-4o errors in each of three tasks (App. A.4); and a test of whether decline fits a constant error rate per entry, under which accuracy falls exponentially with length (App. A.5).

## Results

- **Main table** (§4, Tab. 3): every model's scores fall with output length (caption). GPT-4o averages 94.8 at 0.5K and 38.1 at 8K; Gemini-1.5-Pro leads at 8K with 54.0. Among models under 15B parameters, "the best performer, R1-Distill-Llama-3-8B, reaching only 24.6" at 2K (§4).
- **Scale and reasoning** (§4): "Model scale is critical for task performance", and reasoning models outperform their instruction-tuned counterparts, which "suggests a potential synergy between long CoT training and long-form generation capabilities".
- **By task** (§5, Fig. 3): "steeper performance degradation in tasks requiring long-range reasoning"; Gemini-1.5-Pro declines more on ToM Tracking, Countdown and Travel Planning than on HTML to TSV. Reasoning models gain most over their instruct counterparts on Path Traversal (§5).
- **Later segments** (§5, Fig. 4): on Path Traversal and ToM Tracking at 8K, correctness falls in later segments even with a correct prefix.
- **Beyond error accumulation** (App. A.5, Fig. 6): observed decline "generally deviates" from the constant-error-rate trend, except Gemini-1.5-Pro on ToM Tracking and Path Traversal; "performance deterioration extends beyond simple error accumulation".
- **Termination** (App. A.2, Tab. 5): on Countdown (8K) and Travel Planning (2K), reasoning models match or beat instruct models among finished runs but finish less often within 16K tokens.
- **Procedures in prompts** (§5, Fig. 5): on Countdown and Travel Planning at 8K, spelling out the procedure "generally improves performance for both instruct and reasoning models".
- **Against RULER** (App. A.1, Tab. 4): Llama-3.1-8B scores 89.8 on RULER at 64K but 0.0 on Path Traversal and ToM Tracking at 17K and 12K total length; the authors say no model shows "robust generation capabilities on LongProc with much shorter overall lengths".
- **Humans** (App. A.3, Tab. 6): on 35 8K problems per task, authors who had not built those tasks scored 100.0 on Countdown and 91.4 on Travel Planning, against 68.6 for GPT-4o on Countdown and 40.0 for Gemini-pro on Travel Planning, the better of the two models tested on each.
- **Error types** (App. A.4, Tab. 7): of 20 GPT-4o errors on HTML to TSV at 8K, 8 skip rows and 7 hallucinate details; nearly all of 20 ToM errors are wrong long-range inferences about location changes; Travel Planning errors include hallucinated direct flights and wrong search-state updates.
- **Filtering** (App. A.6, Tab. 8): for three models on HTML to TSV at 8K, scores drop substantially when only rows meeting a condition must be extracted.

## Limits the authors state

- Countdown and Travel Planning are scored on the final solution only: "We do not evaluate the search trace generated by the models, as these may exhibit greater variations" (App. C).
- Pseudocode to Code "omits the 8K token set due to limited program lengths in the source SPoC dataset"; Travel Planning "excludes the 0.5K token set as even the simplest data points require more output tokens" (§3.2).
- Reasoning models trail instruct models on Countdown (8K) and Travel Planning (2K) because "they cannot generate final solutions within the 16K output token budget" (§5), "mainly" so per Tab. 5's caption (App. A.2).
- The human evaluation is "small scale" (§5), 35 problems per task (App. A.3).
- Irrelevant context is outside the main scope: "our primary focus is on long-form generation and synthesis over dispersed information" (App. A.6).

## Open problems and building blocks

  - The "token-inefficiency of reasoning models for certain problems, opening an interesting research direction for future work" (App. A.2).
  - "substantial room for future research in long-context modeling" (§1).
  - The dataset "can also be used to assess the effectiveness of position extrapolation or context compression techniques" (§6) (extending a model past its trained input length; compressing the input).
- **Released:** "Data and code available at" the project page (abstract footnote).
- **To reuse it:** about 9 GPU hours on one H100 80GB for a 10B-scale model, and about 110 GPU hours on 4×H100 for a 70B-scale model (App. D); the prompt templates are in App. H.

## On this site

- **Discussed in:** [Whole-job reliability of multi-step LLM work](#/challenges/whole_job_reliability)
- **Tags:** <span class="tags"><a class="tag" href="#/tags/compact">compact</a><a class="tag sub" href="#/tags/general-misc">general-misc</a><a class="tag sub" href="#/tags/llm-misc">llm-misc</a></span>
