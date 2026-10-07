# Efficient Prompting Methods for Large Language Models: A Survey

**Efficient Prompting Methods for…** · preprint 2024

Read: [PDF](https://arxiv.org/pdf/2404.01077) · [arXiv](https://arxiv.org/abs/2404.01077)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Surveys prompt compression and automatic prompt optimization.
- Taxonomy of methods.
- Background reading.

## In plain words

Prompts for large language models keep growing. Hand-written instructions take people time to tune, and long prompts full of examples or retrieved documents cost computation when the model runs. The authors say such "prohibitive overheads have become a major barrier to the practical deployment of LLMs" (§1). This survey sorts the methods that cut these costs into two families. In automatic prompt engineering, an LLM writes, scores and improves prompts in place of a human, to save human effort. Prompt compression shortens a prompt into fewer words, into a few learned vectors, or into the model's own weights, to save computation. The authors write the goal of each family as a formula (§2.3), then describe representative methods with diagrams and comparison tables, list open-source projects and propose future directions (§1). The authors present it, "To the best of our knowledge", as "the first survey to summarize LLM prompting methods from the point of 'Efficient'" (§1).

## Background and terms

**Terms to know:** [meta-prompt](#/glossary/meta-prompt) · [textual gradient](#/glossary/textual-gradient) · [evolutionary search](#/glossary/evolutionary-search) · [black-box optimization](#/glossary/black-box-optimization) · [self-consistency (majority voting)](#/glossary/self-consistency-majority-voting) · [perplexity](#/glossary/perplexity) · [retrieval-augmented generation (RAG)](#/glossary/retrieval-augmented-generation-rag) · [KL divergence](#/glossary/kl-divergence) (the survey's example distance between output distributions, §2.3) · [self-information](#/glossary/self-information) (Selective Context computes it "by predicting the next token probability", §4.2.1)

**The paper's own terms:**
- **Efficient prompting methods**: "prompting language models to achieve comparable or even better performance with fewer human or computational resources" (§1).
- **Hard prompt and soft prompt**: a hard prompt is "discrete natural language descriptions", a soft prompt "continuous vector representations" (§1). Early soft prompts (such as prompt tuning and prefix tuning) are a few trainable vectors added to a frozen model; the survey also counts "the vector representations of hard prompts inside language models" (§2.2.2).
- **Meta-prompt**, as used here: a prompt that guides an LLM to generate, evaluate or select prompts in place of a human engineer (§3), wider than the glossary's prompt-writing role.
- **Automatic prompt engineering**: LLM-driven prompt search that "essentially mimics search algorithms in discrete space": expand the candidate prompts, evaluate them on the target model, select the best, and repeat (§3, Fig. 3).
- **Prompt compression**: "distilling long text prompts into the shortest possible text or vectors without sacrificing LLM performance" (§4). Text-to-Vector (T2V) compression turns text into vectors; Text-to-Text (T2T) compression turns it into shorter text (§1).
- **Internalization and encoding** (§4.1): T2V into the model's own parameters, or into added soft prompts.
- **Pruning and summarization** (§4.2): T2T by deleting less informative units ("extractive") or by rewording ("abstractive"). Pruning is coarse-grained (demonstrations, sentences, documents), coarse-to-fine, or fine-grained (e.g. tokens, phrases) (§4.2.1).
- **Informativeness**: how much information a piece of the prompt carries, measured by a small language model (SLM) or an LLM, e.g. by self-information or perplexity (§2.3).
- **Knowledge Distillation into compact models (KD)**, as used in §4.1.1: for prompts, fine-tuning a model so its output distribution with the compressed prompt (or none) matches that with the original prompt, by KL divergence. Differs from the glossary's [Distillation into compact models](#/glossary/distillation) (fine-tuning on teacher-written outputs).
- **Catastrophic forgetting**, as used in §4: "When there is no sufficient cache space, the LLM may forget previously learned knowledge when modeling long sequences". Not the glossary's sense.

**Builds on:**
- Foundations: GPT-3's in-context learning, presented as the shift to prompting (§2.1); prompt tuning and prefix tuning (§2.2.2); chain of thought (§3.2); knowledge Distillation into compact models (§4.1.1).
- Instruction-design methods on this site: APE ([APE](#/papers/zhou2022ape "Large Language Models Are Human-Level Prompt Engineers (2023)")), OPRO ([OPRO](#/papers/yang2023opro "Large Language Models as Optimizers (2024)")), EvoPrompt ([EvoPrompt](#/papers/guo2023evoprompt "EvoPrompt: Connecting LLMs with Evolutionary Algorithms Yields Powerful Prompt Optimizers (2024)")), Promptbreeder ([Promptbreeder](#/papers/fernando2023promptbreeder "Promptbreeder: Self-Referential Self-Improvement Via Prompt Evolution (2023)")), ProTeGi ([ProTeGi](#/papers/pryzant2023protegi "Automatic Prompt Optimization with 'Gradient Descent' and Beam Search (2023)")) and BPO ([BPO](#/papers/cheng2023bpo "Black-Box Prompt Optimization: Aligning Large Language Models without Model Training (2024)")) (§3.1).
- CoT methods on this site: self-consistency ([Self-Consistency](#/papers/wang2022selfconsistency "Self-Consistency Improves Chain of Thought Reasoning in Language Models (2023)")), Reflexion ([Reflexion](#/papers/shinn2023reflexion "Reflexion: Language Agents with Verbal Reinforcement Learning (2023)")) and ReAct ([ReAct](#/papers/yao2022react "ReAct: Synergizing Reasoning and Acting in Language Models (2023)")) (§3.2).

## Problem and setting

- **The question:** how prompting can keep or improve LLM performance with less human effort and less computation (§1).
- **Why hand-written prompts are costly** (§3): "Sensitivity" (small wording changes can change performance a lot, especially zero-shot), "Suboptimality" (humans rely on trial and error) and "Discrepancy" (LLMs may read language differently; gibberish prompts may sometimes be more effective).
- **Why long prompts are costly** (§4): a "Limited Context Window" (text past the model's input length is truncated), "Catastrophic Forgetting" (paper's sense above) and "Slow Inference Speed".
- **Scope:** the LLM era, mainly hard prompts (§1); text only (§2.2).
- **What counts as success:** comparable or better performance at lower cost (§1), formalized in Eq. 1–3 (see Approach).
- **How the surveyed works were chosen:** not discussed.

## Approach

- **A shared formulation** (§2.3). The authors say "there is a lack of connections" between the two families' objectives. Eq. 1 picks the natural-language prompt (instruction plus demonstrations) that maximizes the target model's score on a metric such as accuracy. Eq. 2 picks a soft prompt, trained together with model parameters, whose outputs differ least from those of the original prompt. Eq. 3 does the same for a shorter text prompt whose informativeness stays above a threshold.
- **A taxonomy** (Fig. 1) grouping methods by optimization strategy (§1); overview in Fig. 2.
- **Instruction design** (§3.1):
  - *Sampling-based* (§3.1.1): APE (Automatic Prompt Engineer) infers instructions from input-output examples, scores them, keeps the best and optionally resamples around them. OPRO's optimizer LLM sees past instructions with their scores. Evolutionary methods (EvoPrompt, Promptbreeder) use an LLM to mutate and cross over a population of prompts.
  - *Feedback-based* (§3.1.2): a clearer feedback signal narrows the search (Fig. 4): [reinforcement learning](#/glossary/reinforcement-learning) (RLPrompt, which trains a small network on a frozen model to write prompt tokens); textual gradients (ProTeGi: one LLM lists a prompt's flaws on a mini-batch, another edits the prompt against them); human preferences (BPO, a 7B prompt optimizer trained on pairs of original and improved prompts).
  - *Editing-based* (§3.1.3): edit an existing prompt with operations such as deleting, swapping, paraphrasing or adding words, phrases or sentences, as in GrIPS (a gradient-free edit search).
- **CoT optimization** (§3.2):
  - *Sampling* (§3.2.1): Zero-Shot-CoT ("Let's think step by step"), self-consistency, and automatic demonstration choice (Auto-CoT, COSP).
  - *Feedback* (§3.2.2): iterative feedback, usually the LLM's reflection on its own behavior (Self-refine, Reflexion).
  - *Interaction* (§3.2.3): reasoning that calls external tools or search (ReAct with a Wikipedia API, self-ask, ToolLLM).
- **T2V compression** (§4.1):
  - *Internalization* (§4.1.1): distill a system prompt or context into the weights, e.g. Context Distillation for a helpful, honest and harmless prompt.
  - *Encoding* (§4.1.2): usually a trained compressor turns a prompt into soft prompts. Gisting turns instructions into learned "gist tokens" (Fig. 6). AutoCompressor, ICAE and SelfCP compress long contexts in segments, all at once, or only the over-limit part (Fig. 7). Tab. 3 compares encoding methods.
- **T2T compression** (§4.2):
  - *Pruning* (§4.2.1): drop low-information units, scored by a small model or a trained classifier. E.g. CPC drops sentences unrelated to the question; LLMLingua and LongLLMLingua drop demonstrations or documents, then less informative tokens; Selective Context uses self-information; LLMLingua-2's bidirectional encoder labels each token keep or discard.
  - *Summarization* (§4.2.2): a trained summarizer (RECOMP), or summarizing while checking that enough information remains (MEMWALKER, CompAct).

## Results

No experiments (§1: a survey). The authors' observations, and numbers they restate:

- **Tab. 3 observation** (§4.1.2): the authors "find that soft prompts are usually prepended to the input sequence in the compressor with Decoder-only architecture while appended to that of Encoder architecture".
- **Tab. 4 observation** (§4.2.1): Tab. 4 gathers scores and compression ratios of ten pruning methods on five benchmarks, which its caption calls "commonly used reasoning tasks and long-context tasks". The authors "observe that coarse-to-fine compression seems to be more beneficial for complex reasoning tasks while fine-grained compression is more suitable for long context tasks".
- **APE** (§3.1.1): the survey says it does better than or as well as human-written instructions "on 24/24 Instruction Induction tasks and 17/21 curated Big-Bench" tasks (Instruction Induction: inferring a task's instruction from examples, [APE](#/papers/zhou2022ape "Large Language Models Are Human-Level Prompt Engineers (2023)") §4.1; Big-Bench: a broad collection of language tasks).
- **Gisting** (§4.1.2): "up to 26x compression of prompts", "all with minimal loss in output quality".
- **Selective Context** (§4.2.1): with phrases as the filtering unit it can "reduce inference memory usage by 36% and inference time by 32%, with negligible performance drop".
- **LLMLingua-2** (§4.2.1): "a 1.6x-2.9x acceleration in end-to-end latency".
- **CompAct** (§4.2.2): "exceptionally high compression rates (47x)" on question answering over long retrieved documents.

## Limits the authors state

- Scope: "This paper only discusses the prompt in text form in the field of NLP" (§2.2).
- Tab. 4: "due to variations in the experimental setups of different methods, their performances may be not directly comparable" (Tab. 4 caption).
- T2V compression: "the compressed soft prompts usually lack human readability and interpretability" (§4.2).
- Soft prompts: "many LLMs are closed-source with inaccessible parameters, leading to a relative stagnation in follow-up research on soft prompts" (§2.2.2).

## Open problems and building blocks

  - Future research could combine the two strategies, especially for CoT, which they call "the intersection of the interests of both areas": self-improve then compress, or both in one iteration, "possibly using reinforcement learning where LLM performance serves as a reward signal to supervise compression"; joining Eq. 1 and Eq. 3 with balancing factors could help study the trade-offs (§5).
  - Readability: compression "often struggles to ensure the readability and interpretability of the compressed prompts", which raises the question "Is the information defined from the perspective of human comprehension a reasonable standard for measuring the effective information provided for LLMs?" (§5).
  - Robustness: optimized instructions "typically cater to specific downstream tasks", and T2V-compressed prompts are "typically tailored to a specific language model"; mixing labeled and unlabeled data "might" help, and a plug-and-play adapter for soft prompts is "One potential solution" (§5).
  - Automatic prompt engineering "heavily relies on LLMs" and "still cannot completely avoid human intervention": instruction optimization starts from user examples or good initial prompts, and optimizing demonstrations (especially CoT) needs careful meta-prompt design (§5).
  - "whether LLM is a good prompt optimizer is a question worth exploring" (§3.1.2).
- **Released:** no code or data of their own stated. App. A.1 (Tab. 5–6) lists links to open-source projects of the surveyed methods, "as a quick access for NLP practitioners" (§1).
- **To reuse it:** nothing stated.

## On this site

- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/promptopt-general">promptopt-general</a><a class="tag sub" href="#/tags/promptopt-misc">promptopt-misc</a></span>
