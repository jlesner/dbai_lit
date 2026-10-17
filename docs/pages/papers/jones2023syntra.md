# Teaching Language Models to Hallucinate Less with Synthetic Tasks

**SynTra (Synthetic Transfer)** · preprint 2023

Read: [PDF](https://arxiv.org/pdf/2310.06827) · [arXiv](https://arxiv.org/abs/2310.06827)

<p class="notice">A summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Lowers hallucination on tasks that answer or summarize from a given context by optimizing on a synthetic task where a program checks every answer (names retrieval: list the first five names, from a list of 100 random names, whose first name starts with a given letter; a name not on the list is a hallucination), then reusing the result on realistic tasks (abstract; §2.2, §3.1.2).
- Prefix-tuning of a 10-token continuous postfix to the system message, weights frozen, compared with full fine-tuning; a KL loss keeps the model's outputs on SQuAD reference prompts unchanged; Vicuna 1.1 and Orca (13B) on MS MARCO, QMSum and ACI-Bench, scored by a GPT-4 judge (§2.3, §3.1–3.2; App. B.1).
- A frozen-weights precedent for the question of whether gains made against a program check carry over to tasks no program checks: it reports that the postfix cuts Orca's average hallucination rate by 7.5 points when trained with the reference data (§3.2), while fine-tuning the whole model on the same task "can counterintuitively increase hallucination" (abstract; Tab. 1). But the prompt is continuous embeddings tuned by gradient, not text, and the downstream score is an LLM judge (§3.2).

## In plain words

LLMs often make things up (hallucinate) when answering from or summarizing a given document, though it holds all needed information (abstract). The authors say this is hard to train away because checking long outputs by humans or LLMs is slow, expensive and error-prone, so it is hard to optimize against directly (§1). SynTra, their method, uses a made-up task a program can check: list the first five names on a random list starting with a given letter; any name not on the list is a hallucination (§1, §3.1.2). It tunes a learned addition to the system message on that task, weights unchanged, then reuses it on web-query answering, meeting summaries and clinical notes (abstract; §1). Judged by GPT-4, and trained with extra prompts keeping outputs stable, it lowers the average hallucination rate by 7.5 points on Orca and 2.5 on Vicuna, two 13-billion-parameter models, the authors report (§3.2). Fine-tuning the whole model on that task "can counterintuitively increase hallucination" (abstract). They present this as evidence that "reducing hallucination on a synthetic task can also reduce hallucination on real-world downstream tasks" (abstract).

## Background and terms

**Terms to know:** [LLM-as-a-judge](#/glossary/llm-as-a-judge), [KL divergence](#/glossary/kl-divergence), [BLEU and ROUGE](#/glossary/bleu-and-rouge), [out-of-distribution generalization](#/glossary/out-of-distribution-generalization) (the paper says "out-of-domain", §3.2), [prefix-tuning](#/glossary/prefix-tuning) (SynTra appends the vectors after the system message, so the paper calls them a postfix, App. A), [named-entity recognition (NER)](#/glossary/named-entity-recognition-ner) (here a service extracting medical and other entity types, App. B.5).

**The paper's own terms:**
- **Hallucination**: a grounding error, output content that the context in the prompt doesn't support (§2.1). The hallucination rate is the share of outputs with one, over prompts and sampling (Eq. 1).
- **Abstractive summarization task**: the paper's name for any task where the model answers a query from a context assumed to hold all the information needed; it covers answering from retrieved passages as well as summaries (§2.1).
- **System message**: the high-level instruction placed before the user's prompt, e.g. "You are a helpful AI assistant" (§1, §2.1).
- **Synthetic task**: a made-up task meeting two desiderata: the LLM hallucinates frequently on it, and hallucination can be tested efficiently (§2.2).
- **Names retrieval task**: the synthetic task above; each prompt lists 100 random names (App. B.3).
- **Reference data and reference loss**: prompts (from SQuAD, a reading-comprehension dataset of passages and questions) on which the tuned model is pushed to keep the original model's outputs, measured by KL divergence (Eq. 2, §2.3; §3.1.2).
- **Spurious attribute**: a feature that appears only in hallucinated outputs on the synthetic task but can appear in correct outputs elsewhere; the example is newlines (§2.3, §3.4).
- **Grounded and ungrounded entities**: entities in the output that do, or don't, appear in the context (§3.3).

**Missing glossary terms:** none.

**Builds on:**
- Li & Liang (2021): prefix-tuning, adapted here to optimize the postfix directly in the full embedding dimension (§2.3; App. A).
- Yue et al. (2023); Gao et al. (2023a): GPT-4 as a judge of grounding; the authors replace Yue et al.'s prompt after finding the rates it reported "far lower than the true hallucination rate" (§3.2; App. B.5).
- Bai et al. (2022): the reference loss "resembles the PPO-ptx method" (reinforcement-learning training that mixes in pretraining gradients) (§2.3).
- Zhang et al. (2023): "The closest work to ours", which aims to characterize hallucination by evaluating it on synthetic tasks (§4).

## Problem and setting

- **Question:** does lowering hallucination on a synthetic task whose answers a program checks lower it on realistic tasks where checking is expensive (§1, §2.2)?
- **Assumption:** the context always has all the information needed to answer the query (§2.1).
- **Models:** Vicuna 1.1 and Orca, two 13B chat models, both fine-tuned from Llama 13B (Meta's open base model) (§3.1); 13B was the largest that fit in memory when optimizing the postfix (App. B.1).
- **Realistic tasks** (§3.1.1; App. B.2):
  - MS MARCO: answering real Bing queries from 10 retrieved passages; 1,000 random validation queries that need a long answer.
  - QMSum: questions about meeting transcripts; 852 training-set examples that fit the context window.
  - ACI-Bench: clinical notes with four headings, written from doctor–patient dialogues; all 207 examples.
- **What counts as a hallucination:** on realistic tasks, GPT-4 sees context, query and output, lists ungrounded spans and scores groundedness from 0 to 10; any score below 10 counts (§3.2; App. B.5). On the names task, the paper measures whether the output is exactly the unique correct answer and whether it names only people on the list (§3.2).
- **Baseline prompt:** every run, the original models included, uses a system message asking for honest, conservative answers from the provided context only, so that optimization does not "rediscover easy prompting gains" (App. B.1).

## Approach

- **Pipeline (§2.3, Fig. 1):** define a synthetic task, optimize the system message or the weights on it, transfer.
- **Optimizing the system message:** a 10-token continuous postfix (51,200 parameters), trained with Adam (a standard gradient optimizer); learning rate and postfix length were chosen on Orca with separate MS MARCO validation data and reused everywhere else (App. A; App. B.1).
- **Optimizing the weights,** for comparison: standard full fine-tuning with Vicuna's published hyperparameters (§2.3; App. B.1).
- **Training signal:** to use first-order (gradient-based) methods, the authors maximize the log-likelihood of the unique correct output on the names task, and show this also reduces hallucinated names among outputs that aren't exact matches (§3.1.2; §2.2 footnote).
- **Loss (Eq. 3):** a weight α times the synthetic-task loss plus 1 − α times the reference loss; α = 0.5 for the runs with reference data (§3.1). Each run is one epoch of 100,000 examples, half names and half SQuAD when mixed (App. B.1).

## Results

- **In-domain (on the names task; §3.2, Fig. 2):** both original models "are exactly correct less than 1% time, and only generate names on the list less than 17% of the time"; optimizing either the system message or the whole model reduces hallucination on all measures, and fine-tuning is "strictly better in-domain".
- **Transfer (Tab. 1; §3.2):** with the postfix and reference data, the average hallucination rate goes from 25.8% to 18.3% on Orca (a 29% reduction) and from 35.9% to 33.4% on Vicuna (a 7% reduction).
- **Full fine-tuning (Tab. 1; §3.2):** on Orca it "actually increases the hallucination rate across most tasks"; the average rises to 31.3% (synthetic only) and 31.5% (with reference data). On Vicuna, fine-tuning reduces hallucination on two of three tasks but is "slightly worse than optimizing the system message on average". The authors hypothesize the gap exists "in part because fine-tuning latches onto more spurious attributes of the synthetic task".
- **Reference data (§3.2):** with the postfix, adding it lowers the rate in most task–model pairs; when fine-tuning Vicuna it lowers the rate "by over 24 points on average". They conjecture that the reference data helps by breaking task-specific spurious attributes.
- **Output quality (Tab. 2; §3.3):** in BLEU and ROUGE overlap with human-written references, the postfix with reference data scores comparably on QMSum and higher on all metrics on MS MARCO; Vicuna fine-tuned on synthetic data only scores lowest.
- **Details kept (Tab. 3; §3.3)**: on ACI-Bench, entities found by Azure Text Analytics for Health (a Microsoft named-entity service for medical text) show ungrounded entities falling 19.2% (Orca) and 32.3% (Vicuna) with the postfix and reference data, against 1.4% and 14.8% fewer grounded ones. Fine-tuning and training without reference data remove more of both.
- **Newlines (§3.4; App. B.6, Tab. 4):** training on the names task alone "routinely reduces the newline rate", and adding reference data "recovers much of the drop".
- **Orca against Vicuna (§3.2):** gains are larger on Orca, partly, the authors say, because hyperparameters were tuned only on Orca; it could also be due to the underlying models' quality, as the original Orca "hallucinates much less than Vicuna".

## Limits the authors state

- "it requires designing a synthetic task, and reduces hallucination on some models more than others" (§1).
- Hyperparameters were tuned only on Orca; "hyperparameter tuning separately on Vicuna was intractable due to computational constraints" (§3.2; App. B.1).
- Two other synthetic tasks (reversing words, splicing sentences) gave outputs that "did not match our intuitive definition of hallucination", and "We did not try other synthetic tasks; there are likely others that lead to greater gains" (§3.1.2).
- LLMs may hallucinate on the reference data, though "we find empirically that this is not an issue" (§2.3).
- Only newlines were measured, as an easy-to-measure spurious attribute; the reference data "likely similarly combats unknown spurious attributes" (§3.4).
- Counting outputs with no ungrounded entities "produces false-positives due noise in the entity model" (§3.3, footnote).
- "we do not know what properties causally reduce hallucination" (§5).
- "it can be hard to identify good synthetic tasks, and methods like SynTra require a loss-inducing transfer step after optimization" (§5).

## Open problems and building blocks

  - Better optimization: searching hyperparameters, LoRA (low-rank fine-tuning), and optimizing the system prompt and weights jointly (§5).
  - Models accessible only via APIs, and larger open-source models (§5).
  - Searching for a synthetic task that reduces hallucination more over all tasks, a separate synthetic task for each realistic task, or several synthetic tasks trained jointly (§5).
  - Pinning down which properties of a synthetic task matter, to define such tasks systematically and find "which other LLM behaviors (such as generating unsafe of unhelpful outputs) can be tamed with synthetic data" (§5).
  - "When is defining a synthetic task better than collecting human feedback on realistic tasks directly?" (§5).
  - Discrete prompt optimizers such as Shin et al. (2020) ([AutoPrompt](#/papers/shin2020autoprompt "AutoPrompt: Eliciting Knowledge from Language Models with Automatically Generated Prompts (2020)")) and Wen et al. (2023) "could in principle be plugged into SynTra directly" (§4).
- **Released:** Nothing stated. The GPT-4 judge's full prompt "is proprietary" (App. B.5).
- **To reuse it:** gradient access to the model's input embeddings (§2.1 footnote, App. A); one A100 80GB GPU for the postfix, four for fine-tuning (App. B.1); a synthetic task meeting the two desiderata (§2.2); reference prompts (§2.3).
- **Beyond its domain:** the authors say the work "provides encouraging evidence that we can use synthetic data to isolate and optimize against undesired LLM behaviors" (§1), and further evidence that prefixes transfer, "for generative tasks" (§4).

## On this site

- **Discussed in:** [Prompt-space self-play judged by an engine](#/challenges/prompt_space_self_play) · [Gains made against a checker, carried beyond it](#/challenges/transfer_beyond_the_checker)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/promptopt-general">promptopt-general</a><a class="tag sub" href="#/tags/promptopt-misc">promptopt-misc</a></span>
