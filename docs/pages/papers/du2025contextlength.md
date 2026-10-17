# Context Length Alone Hurts LLM Performance Despite Perfect Retrieval

**Context Length Alone Hurts…** · Findings of EMNLP 2025

Read: [PDF](https://arxiv.org/pdf/2510.05381) · [arXiv](https://arxiv.org/abs/2510.05381)

<p class="notice">A summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Measures whether an LLM that can still recite all the evidence of a problem word for word solves it as well over a long input as over a short one: GSM8K, MMLU, HumanEval and a synthetic variable-summation task, each split into evidence and question with filler tokens inserted between them (§3.1, Tab. 1), on Llama-3.1-8B-Instruct and Mistral-v0.3-7B-Instruct, and on three closed models in one setting (§3.2, §4.1).
- Removes distraction step by step: Paul Graham essays as filler, then whitespace, then the filler masked out of attention, and a control with the evidence moved next to the question (§3.2, §4.1–4.2); then a two-step prompt in which the model recites the evidence and solves from a new short prompt (§5).
- Evidence that data held in context costs accuracy through its length alone, not only through failing to find the relevant part, which bears on the text arm of [Reliability that holds with size, by handing the procedure to an engine](#/challenges/engine_offloading_with_size): the authors report that Llama-3.1-8B recited the evidence exactly for 970 of 1000 MMLU problems padded to 30K tokens, as often as at short length, yet "its accuracy drops by 24.2%" (§1).

## In plain words

LLMs often do worse on long inputs than the context lengths they support suggest, and this gap "is commonly attributed to retrieval failures", the model not finding the relevant part (abstract). The authors ask whether a model that can find, and recite word for word, everything it needs still solves the problem as well as its short version (§1). They pad math, multiple-choice and coding problems with irrelevant text, whitespace, or tokens hidden from the model's attention, and measure separately whether the model can recite the evidence exactly (§3–§4). Their example: Llama-3.1-8B recited the evidence exactly for 970 of 1000 MMLU problems padded to 30K tokens, as often as at short length, yet "its accuracy drops by 24.2%" against the short case (§1). They call their work, to the best of their knowledge, "among the first attempts" to measure long-context performance with retrieval controlled this way (§3.1). A two-step fix, reciting the evidence and then answering from a new short prompt, improved GPT-4o "up to 4%" on two question-answering tasks of RULER (a long-context benchmark) over a strong baseline (abstract; §5).

## Background and terms

**Terms to know:** [exact match](#/glossary/exact-match) (here applied to the model's recitation of the evidence, §3.1) · [lost in the middle](#/glossary/lost-in-the-middle) · [retrieval-augmented generation (RAG)](#/glossary/retrieval-augmented-generation-rag) (whose search step the paper's "retrieval" is not, §1) · [needle in a haystack (NIAH)](#/glossary/needle-in-a-haystack-niah) (cited, Kamradt 2023, as retrieval-based evaluation, §2).

**The paper's own terms:**
- **retrieval**: "a model's ability to attend to and recite specific texts from the context", which "should not be confused with retrieval in retrieval-augmented generation (RAG)" (§1, footnote 1).
- **evidence** and **question**: the two parts each problem is split into. The evidence "contains all the information that the model needs to solve the task"; the question holds the query and format requirements (§3.1, Tab. 1). For GSM8K the evidence is the problem description with its chain-of-thought steps (Tab. 1).
- **distraction tokens**: filler inserted between evidence and question to reach a target length, giving inputs of the form `[Evidence] [Distraction Tokens] [Question]` (§3.1). Three kinds, "ordered by decreasing strength": Paul Graham essays (ordinary essays, used as irrelevant text), whitespace, and masked tokens (Fig. 2).
- **context length**: "the total number of input tokens" of a problem (Fig. 3); the tables label columns by inserted tokens (e.g. Tab. 6).
- **masking**: excluding all distraction tokens when the model computes attention, so it attends "only to the evidence and the question", which match the short setting "except for the increased distance between them" (§4.2).
- **VarSum** (Variable Summation): a synthetic task whose evidence is the values of 50 integer variables and whose question asks for the sum of 3 random ones (§3.1, Tab. 1).
- **Retrieve then Solve**: the §5 mitigation, also "retrieve-then-reason" (§1) and "Retrieval before Reasoning Strategy" (Figs. 12–13).

**Missing glossary terms:** none.

**Builds on:**
- Retrieval-based long-context tests: needle-in-a-haystack tests (Kamradt, 2023), whose Paul Graham essays the authors reuse as filler (§2, §3.1), and RULER (Hsieh et al., 2024), "an established long-context benchmark" whose Variable Tracking task (following chains of variable assignments) inspired VarSum (§3.1, §5).
- Liu et al. (2024b), the lost-in-the-middle effect ([Lost in the Middle](#/papers/liu2023lostmiddle "Lost in the Middle: How Language Models Use Long Contexts (2024)")), which the authors cite for placing the evidence at the beginning as "the easiest location to retrieve" (§3.1).
- Li et al. (2024a), which trains a model on retrieval and reasoning objectives, the work the mitigation is "related to" (§5); it and An et al. (2024) attribute drops to "a distribution bias with position introduced during training" (training data skewed in where relevant text sits), which the authors say also applies to length alone (§6).

## Problem and setting

- **The question:** "When a model can perfectly retrieve all the information it needs, can it solve long-context tasks as effectively as short-context ones?" (§3).
- **Tasks:** the test sets of GSM8K (grade-school math word problems), MMLU (multiple-choice questions across subjects) and HumanEval (Python functions from docstrings), chosen as tasks "on which most models perform consistently well, at least under short-context settings", plus VarSum to test "very simple problems" (§3.1, Tab. 1).
- **Making retrieval easy:** the evidence stays one consecutive chunk at the beginning of the input and the question comes last (§3.1); §4.1 moves the evidence.
- **Measuring retrieval:** in a separate run the model is prompted to recite the evidence and the question; any difference from the original scores zero. In the problem-solving runs the model is not asked to recite first (§3.1; prompts in App. A.1).
- **Models:** Llama-v3.1-8B-Instruct and Mistral-v0.3-7B-Instruct, with claimed context lengths of 128K and 32K (§3.2), and, with whitespace filler, GPT-4o, Gemini-2.0 and a Claude model named Claude-3.7-Sonnet in §4.1 and Claude-3.5 in Tab. 2; GPT-4o also runs the §5 tests on RULER. In §3–§4 fillers reach 30,000 tokens (Tabs. 2–3, 6–9).
- **Runs:** "All the experiments are run once" (App. A.4).
- Decoding settings and how HumanEval answers are scored: not discussed.

## Approach

- **A padded benchmark (§3.1, Fig. 2):** each short problem becomes a long one by inserting filler between its evidence and its question, with retrieval scored on the very problems the model must solve. Earlier studies, the authors argue, could not exclude retrieval failures (§3.1).
- **Removing distraction step by step:** essays (§3.2); whitespace, which "generally carries minimum information" (§4.1); and masking all filler out of attention, for the two open models (§4.2).
- **Controlling distance (§4.1, Fig. 4b):** whitespace goes before the evidence and the question follows the evidence directly, so the evidence–question distance stays fixed as the input grows.
- **Retrieve then Solve (§5, Fig. 5):** the model is first prompted to "retrieve and recite all relevant information" from the long input; the recited evidence and the problem statement form a new, shorter prompt, which the model solves "without having the long context as part of its input". On RULER, step one copies the relevant documents "WORD BY WORD" (Fig. 12). Unlike Li et al. (2024a), the method "does not address the retrieval problem itself" and "assumes accurate retrieval as a prerequisite" (§5).

## Results

Accuracy drops are differences in percentage points from the unpadded score (e.g. Tab. 6 caption).

- **Essay filler (§3.2, Fig. 3; Tab. 6):** retrieval drops are "relatively marginal until the length reaches 30K tokens", while accuracy drops "by a larger margin as opposed to the retrieval score across almost all tasks and context lengths", much of it within 7K tokens.
- **Whitespace filler (§4.1, Fig. 4a; Tab. 7):** results "generally reflect an improvement" over essays, but the authors report "at least 7% at 30K space tokens" for both open models on every task.
- **Closed models (§4.1, Tab. 2):** they "experience a smaller drop"; GPT-4o and Gemini-2.0 stay perfect on VarSum. Still, "substantial and mostly consistent degradation is still observed in most models and tasks", with the notable exception of Gemini on GSM8K, which improves with length, and HumanEval, where the score "improves after a certain length in some cases".
- **Evidence next to the question (§4.1, Fig. 4b; Tab. 8):** "a substantial drop is observed despite occasional fluctuations: up to 17% for Mistral and 20% for Llama under 30K space tokens". The authors write that their results "prove that the performance degradation is directly related to the input length alone, regardless of the relative position between evidence and question" (§4.1).
- **Masking (§4.2, Tab. 3; Tab. 9):** "a consistent performance drop, which reaches at least 7.9% for both models at 30K masked distraction tokens", some drops larger than with whitespace.
- **Retrieve then Solve:** on GSM8K with essay filler, Mistral-v0.3-7B's accuracy at 26,250 inserted tokens is 66.7 with the method against 35.5 for the baseline that answers directly (Tab. 4). On RULER's QA1 and QA2 (questions over many documents, some relevant) from 4K to 128K tokens, the authors call GPT-4o's QA1 baseline already strong and report "consistent improvements", and a larger gain on QA2, at most 4 points at 32K (§5, Tab. 5).

## Limits the authors state

- The conclusions "are only based on two open-source models, three closed-source models and 4 tasks, despite consciously selecting those that are more representative" (Limitations).
- Some settings were not run, "such as retrieval on closed-source models (due to these models occasionally refusing to recite evidence under a long input)" (Limitations).
- The §5 method "has limited use case. It requires perfect retrieval, which is already hard in many real-world tasks that feature retrieval settings harder than in our synthetic data" (Limitations). §5 itself targets cases where "accurate retrieval—though not necessarily perfect—can be achieved".
- No RULER results for the open models, since there "the failure of retrieval directly causes a performance drop (compared to baseline)", a failure "not our focus in this paper to address" (Limitations).
- Retrieval is scored by exact match, so "a failure does not necessarily mean the model cannot extract the evidence" (§3.2). Aggregating several pieces of evidence is "not discussed here" (§3.2).
- The strategy is a "proof-of-concept solution" (§4.2), "mainly for demonstration purposes, and its reliability is not guaranteed" (App. A.5).

## Open problems and building blocks

  - The decomposition of long-context problem solving into retrieval and problem solving "is inconclusive, urging researchers to further explore the underlying mechanisms" (§6).
  - Improving long-context retrieval and short-context ability separately in training "may not fully translate to an overall improvement in long-context ability" (§6).
  - The authors call for "a more comprehensive evaluation beyond focusing on retrieval, with a more fine-grained analysis to precisely separate each failure mode" (§6), since benchmarks that isolate retrieval "might overestimate progress" (§1).
- **Released:** Nothing stated. The datasets are used "for research purposes" and not redistributed (App. A.3).
- **To reuse it:** the mitigation needs an additional prompt and, in the authors' words, accurate (§5) or perfect (Limitations) retrieval; prompts in App. A.1. The paper masks attention only in the open models (§4.2). The work used GH200 GPUs, "Around 20000 GPU hours" (App. A.4).
- **Beyond its domain:** the authors say their findings "offer a potential explanation" for RAG performance that "often saturates or even degrades as more documents are added", and for findings that "long CoTs can sometimes hurt the performance" (§1; §6).

## On this site

- **Discussed in:** [Whole-job reliability of multi-step LLM work](#/challenges/whole_job_reliability)
- **Tags:** <span class="tags"><a class="tag" href="#/tags/compact">compact</a><a class="tag sub" href="#/tags/general-misc">general-misc</a><a class="tag sub" href="#/tags/llm-misc">llm-misc</a></span>
