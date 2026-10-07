# DeepSeekMath: Pushing the Limits of Mathematical Reasoning in Open Language Models

**DeepSeekMath** · preprint 2024

Read: [PDF](https://arxiv.org/pdf/2402.03300) · [arXiv](https://arxiv.org/abs/2402.03300)  
Code: [DeepSeek-Math](https://github.com/deepseek-ai/DeepSeek-Math)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Math pretraining on web data, then RL.
- Introduces GRPO (group-relative advantages, no value network).
- GRPO; listed SQL RLVR papers that train with it include [CSC-SQL](#/papers/sheng2025cscsql "CSC-SQL: Corrective Self-Consistency in Text-to-SQL via Reinforcement Learning (2025)"), [SQL-Zero](#/papers/pedrozo2026sqlzero "SQL-Zero: Self-Evolving Text-to-SQL (2026)") and [E3-Rewrite](#/papers/xu2025e3rewrite "E3-Rewrite: Learning to Rewrite SQL for Executability, Equivalence, and Efficiency (2025)").

## In plain words

Cutting-edge models such as GPT-4 and Gemini-Ultra are "not publicly available", and the authors say open models "considerably trail behind in performance" at math (§1). They build DeepSeekMath, a 7-billion-parameter open model, in three stages: they continue pre-training a code model on 120B tokens of math web pages that a classifier picked out of Common Crawl (a public web crawl), plus code and text; they fine-tune it on math problems with worked solutions; and they train it further with reinforcement learning using their algorithm GRPO, which scores several sampled answers to the same question against each other instead of training a second model to predict how good each answer will be (abstract; §1). They say this saves memory and training cost against PPO, the reinforcement-learning algorithm it modifies (abstract; §1). Without external tools or voting, the final model scores 51.7% on MATH, a benchmark of competition problems, up from 46.8% before reinforcement learning, "approaching the performance level of Gemini-Ultra and GPT-4" (abstract; §1). They present it as passing 50% on MATH "for the first time within the open-source community" (§1).

## Background and terms

**Terms to know:** [reinforcement learning](#/glossary/reinforcement-learning) · [PPO](#/glossary/ppo) · [GRPO](#/glossary/grpo) · [reward model](#/glossary/reward-model) · [outcome and process rewards](#/glossary/outcome-and-process-rewards) · [KL penalty](#/glossary/kl-penalty) · [pass@k](#/glossary/passk) · [self-consistency](#/glossary/self-consistency-majority-voting) · [program-of-thought and tool-integrated reasoning](#/glossary/program-of-thought-and-tool-integrated-reasoning)

**The paper's own terms:**
- **DeepSeekMath Corpus**: the 120B-token set of 35.5M math web pages that the authors collect from Common Crawl (§2.1).
- **DeepSeekMath-Base, -Instruct, -RL 7B**: the model after continued pre-training (§2.3), instruction tuning (§3.2) and reinforcement learning (RL) (§4.2).
- **Top1**: the score of one answer per question, which Tab. 5 gives for most entries, as opposed to "majority votes with 32 candidates" (Tab. 5 caption).
- **Maj@K and Pass@K** (Fig. 7): accuracy with majority voting over K samples, and pass@k (both linked above).
- **Outcome supervision (OS) and process supervision (PS)**: GRPO with a reward only at the end of each output, or at the end of each reasoning step (§4.1.2–4.1.3).
- **Rule and Model rewards**: "Rule" judges a response by its answer's correctness; "Model" is a reward model trained on the rule's judgments (§5.2.1 "Observation about Gradient Coefficient").
- **Online and offline sampling**: training data sampled from the policy being trained, or from the initial fine-tuned model (§5.2.1 "Observation about Data Source").
- **In-domain and out-of-domain**: for the RL model, GSM8K and MATH with chain of thought "can be regarded as" in-domain and all other benchmarks out-of-domain (§4.2).

**Builds on:**
- PPO (Schulman et al., 2017; not listed here), which GRPO modifies (§4.1.1, Eq. 1).
- Math-Shepherd (Wang et al., 2023; not listed here), whose 7B model applies PPO with a process-supervised reward model (§3.2), followed for process supervision and for building the reward models' training set (§4.1.3, §4.2).
- The math corpora OpenWebMath (the seed corpus), MathPile and Proof-Pile-2, compared in §2.1–2.2; none is on this site.
- DeepSeek-Coder-Base-v1.5 7B, the starting model, whose decontamination procedure it also follows (§2.1, §2.3).

## Problem and setting

- **Question:** can public web data and RL bring a 7B open model close to closed models on math (§1)?
- **Benchmarks** (§1.2): English and Chinese math benchmarks "from grade-school level to college level", among them GSM8K (grade-school word problems, [GSM8K and trained verifiers](#/papers/cobbe2021verifiers "Training Verifiers to Solve Math Word Problems (2021)")), MATH and the Chinese CMATH; models are tested without tools and also solving problems with Python. Base models are also tested on formal proofs and on general and coding benchmarks (§1.2).
- **Correctness:** scores are accuracies; with tools, the program's execution result is evaluated as the answer (§2.3).
- **[Data contamination](#/glossary/data-contamination):** any text segment containing a 10-gram that exactly matches benchmark text is removed (§2.1).
- **Models compared** (§3.2): closed general models such as GPT-4 and Gemini Ultra, and open general and math-enhanced models from 6B to 72B parameters.
- How Top1 answers are decoded (greedy or sampled) is not discussed.

## Approach

- **Data collection (§2.1, Fig. 2):** a fastText text classifier, trained with OpenWebMath pages as positives, recalls math pages from deduplicated Common Crawl. In math-related domains, math URLs are annotated by hand and their uncollected pages join the seed set. Collection stopped after four rounds.
- **Base model (§2.3):** DeepSeek-Coder-Base-v1.5 7B trained on 500B more tokens, 56% from the DeepSeekMath Corpus, the rest arXiv, code and web text.
- **Instruction tuning (§3.1–3.2):** 776K examples with chain-of-thought, program-of-thought and tool-integrated solutions.
- **GRPO (§4.1.1, Eq. 3, Fig. 4)**: for each question, sample a group of outputs and score them with a reward model; the group's average reward replaces PPO's value model as the baseline. With outcome supervision, each output's advantage (how strongly to reinforce it) is its reward minus the group mean, divided by the group's standard deviation, for every token (§4.1.2); with process supervision, each token gets the sum of the normalized rewards of the steps from there on (§4.1.3). The KL penalty goes in the loss, not the reward (§4.1.1).
- **Iterative RL (§4.1.4, Alg. 1)**: the reward model is trained further on new policy samples with a replay of 10% historical data, and the reference model is reset to the current policy.
- **RL run (§4.2)**: from DeepSeekMath-Instruct 7B, on about 144K chain-of-thought questions about GSM8K and MATH from the instruction data; the initial reward model is trained from DeepSeekMath-Base 7B; 64 samples per question; KL coefficient 0.04; the policy is updated once after each exploration (sampling) stage.
- **Unified paradigm (§5.2.1, Eq. 5, Tab. 10):** the gradient of supervised fine-tuning (SFT), [rejection sampling](#/glossary/rejection-sampling) fine-tuning (RFT), Online RFT, [DPO](#/glossary/direct-preference-optimization-dpo), PPO and GRPO is written as one formula, differing in data source, reward function and "gradient coefficient", the per-token weight of reinforcement or penalty; App. A.1 derives each method's coefficient. The authors find "all these methods are conceptualized as either direct or simplified RL techniques" (§1).

## Results

- **Corpus (Tab. 1, §2.2.2):** a 1.3B model trained on each corpus scores 13.6% on MATH with the DeepSeekMath Corpus, against 11.2% (Proof-Pile-2), 8.9% (OpenWebMath) and 3.3% (MathPile).
- **Base model (Tab. 2, §2.3):** with chain-of-thought prompting, DeepSeekMath-Base 7B scores 36.2% on MATH, against 33.6% for Minerva 540B (a closed model built on PaLM and trained further on math text) and 25.3% for Llemma 34B (an open model trained on Proof-Pile-2). It also shows "strong performance in proof autoformalization" ([autoformalization](#/glossary/autoformalization)) on miniF2F ("a benchmark for formal Olympiad-level mathematics", here in the [proof assistant](#/glossary/proof-assistant) Isabelle), writing proof sketches that the [hammer](#/glossary/hammer-automated-theorem-proving) Sledgehammer completes (§2.3, Tab. 3), and beats its starting model on the general benchmarks MMLU and BBH (Tab. 4).
- **Instruct and RL models (Tab. 5, §4.2):** with chain of thought, RL lifts DeepSeekMath-Instruct 7B on MATH from 46.8% to 51.7%, against 52.9% for GPT-4 and 53.2% for Gemini Ultra (Tab. 5); the same two models go from 82.9% to 88.2% on in-domain GSM8K and from 84.6% to 88.8% on out-of-domain CMATH (§1). The authors report that the RL model "outperforms DeepSeekMath-Instruct 7B across all evaluation metrics" (§4.2). With tool-integrated reasoning, DeepSeekMath-Instruct 7B on MATH is "surpassing all existing open-source models" (§3.2). Self-consistency over 64 samples from DeepSeekMath 7B reaches 60.9% on MATH (abstract).
- **Code and arXiv (§5.1, Tab. 6–9; 1.3B and 7B models):** code training before math training improves math with and without tools (§5.1.1). Mixing code and math in one stage mitigates [catastrophic forgetting](#/glossary/catastrophic-forgetting) of coding and helps tool use, but "compromises mathematical reasoning without tool use" (§5.1.1). Training on arXiv papers alone shows "no notable improvements or even deterioration" across the paper's math benchmarks (§5.1.2).
- **RL methods (Fig. 5–6, §5.2.1)**: on a 1.3B Instruct model, Online RFT "significantly outperforms" offline RFT, GRPO surpasses Online RFT, and process supervision beats outcome supervision; on the 7B model, two rounds of iterative RL "significantly" improve performance, "especially at the first iteration".
- **Why RL works (Fig. 7, §5.2.2)**: at temperature 0.7, RL improves Maj@K but not Pass@K on GSM8K and MATH, from which the authors conclude "it seems that the improvement is attributed to boosting the correct response from TopK rather than the enhancement of fundamental capabilities" (TopK is undefined; it reads as the K most likely responses).

## Limits the authors state

- The arXiv conclusion "has its limitations and should be taken with a grain of salt": other tasks such as informalizing theorems, arXiv mixed with other data, and larger models are untested (§5.1.2).
- The one-stage loss without tools may be because the 1.3B model "lacks the capacity to fully assimilate both code and mathematical data simultaneously" (a conjecture, §5.1.1).
- RL used only the instruction-tuning questions and "a naive nucleus sampling", which they think is "a potential reason that our RL pipeline only improves the Maj@K performance" (§5.2.3).
- All the methods, "to some extent", fully trust the reward signal, yet "it is impossible to ensure the reward signal is always reliable, especially in extremely complex tasks" (§5.2.3).
- Geometry and theorem proving are "relatively weaker than closed models"; in a "dry run" the model could not handle triangles and ellipses, which "may indicate data selection bias in pre-training and fine-tuning" (§6).
- The model is worse than GPT-4 at few-shot use, "restricted by the model scale", showing "similar performance in zero-shot and few-shot evaluation" (§6).

## Open problems and building blocks

  - RL on out-of-distribution questions, with advanced sampling such as tree search and efficient inference (§5.2.3 "Data Source").
  - RL algorithms "robust against noisy reward signals", which they connect to weak-to-strong alignment (training a stronger model from weaker supervision) (§5.2.3 "Algorithms").
  - Reward models that generalize and reflect their uncertainty, and efficient ways to build high-quality process reward models (§5.2.3 "Reward Function").
  - A better data selection pipeline (§6).
- **Released:** a GitHub repository link, its contents not described (title page).
- **To reuse it:** the RL run used a trained reward model and 64 samples per question with max length 1024 (§4.2).
- **Beyond its domain:** the data-collection pipeline "is also applicable to other domains, such as coding" (§2.1).

## On this site

- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/rlvr-general">rlvr-general</a><a class="tag sub" href="#/tags/scaling-general">scaling-general</a></span>
