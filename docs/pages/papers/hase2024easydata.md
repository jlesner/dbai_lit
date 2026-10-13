# The Unreasonable Effectiveness of Easy Training Data for Hard Tasks

**The Unreasonable Effectiveness of…** · ACL 2024

Read: [PDF](https://arxiv.org/pdf/2401.06751) · [arXiv](https://arxiv.org/abs/2401.06751) · [DOI](https://doi.org/10.18653/v1/2024.acl-long.378)  
Code: [easy-to-hard-generalization](https://github.com/allenai/easy-to-hard-generalization)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Fits language models to easy questions only and tests them on hard ones, against a zero-shot lower bound and a hard-data upper bound; easy and hard are set by six human measures (grade level, expert rating, Bloom skill, question and answer length, reasoning steps) and a model-based MDL score, on ARC, MMLU-STEM-5, StrategyQA and GSM8k (§1, §3, Tab. 1).
- In-context learning, linear probes on frozen hidden states, and QLoRA, mainly on Llama-2-70b, with five other models in App. B (§4); the metric is the Supervision Gap Recovered (§1), and §5.3 asks when easy data beats hard data under a labelling budget or label noise.
- Evidence, for prompts as well as weights, that supervision on items whose answers are easy to label carries to hard items: the authors report that easy data recovers 70–100% of the gap between zero-shot and hard-data supervision (Llama-2-70b with in-context learning; §5.2, Fig. 4). The hard items keep human labels for testing, so each transfer claim is measured against a check (Limitations).

## In plain words

Hard questions, such as college science or long multi-step math, are costly to label, so the authors ask whether a language model taught only with easy labelled questions can do well on hard ones; they tie this to scalable oversight, giving a model a good training signal when its answers are hard to check (§1). They fit open models of up to 70 billion parameters to easy questions, by examples in the prompt, a small classifier on the model's internal states, or light fine-tuning, and test on hard questions against the same model given no examples or hard examples, under seven ways of ranking hardness (abstract, §1). With Llama-2-70b (an open model from Meta) and examples in the prompt, easy examples recovered "between 70% and 100%" of the gap between no examples and hard examples "across all six hardness measures" of the main figure (§5.2, Fig. 4). With the classifier and hard labels twice as costly, easy data gave better hard-question accuracy "more often than not" (§5.3, Fig. 5). The authors present a "surprising conclusion" (abstract) of a measurement study, not a new method.

## Background and terms

**Terms to know:** [curriculum learning](#/glossary/curriculum-learning) · [LoRA](#/glossary/lora-low-rank-adaptation) · [label noise](#/glossary/label-noise) · [weak-to-strong supervision](#/glossary/weak-to-strong-supervision) · [bootstrap resampling](#/glossary/bootstrap-resampling) · [Spearman's rank correlation](#/glossary/spearmans-rank-correlation) · [data contamination](#/glossary/data-contamination) · [scalable oversight](#/glossary/scalable-oversight) (§1, citing Amodei et al., 2016) · [linear probe](#/glossary/linear-probe) (one score per answer choice, highest wins, §4, App. D)

**The paper's own terms:**
- **Easy-to-hard generalization**: performance on hard test data of a model fitted only to easy training data, easy and hard being set by a hardness measure such as grade level (§1).
- **Finetuning, fitting**: used for in-context learning, QLoRA (light fine-tuning of a low-precision model), or a linear classifier head alike (§1, footnote).
- **Unsupervised, Easy, Hard**: accuracy on hard test data of the model prompted zero-shot, fitted to easy data, or fitted to hard data. Hard ("hard-to-hard") is the "oracle upper bound", Unsupervised the lower bound (§1).
- **Supervision Gap Recovered (SGR)**: (Easy − Unsupervised) / (Hard − Unsupervised); 100% when easy data is as effective as hard data, 0% when it is no better than zero-shot prompting (§1).
- **Hardness measures** (§3, Tab. 1): grade level; expert difficulty rating ("Difficulty Score"); required cognitive skill on Bloom's taxonomy (remembering, understanding, applying, analyzing, evaluating); question length in words; answer length in characters; number of reasoning steps in the human-written solution; and MDL. Easy and hard cutoffs are the 30th and 70th percentiles for the two length measures and MDL, and set by hand for the others; the rest is "medium", none for MMLU's grade level (§4).
- **MDL** ([minimum description length](#/glossary/minimum-description-length-mdl)) hardness, model-based: a test item's average label probability across models of one architecture fitted to growing amounts of training data (§3), averaged over four 7b-scale models; for in-context learning, with no training data: the 7b models' zero-shot confidence, "MDL (ZS Prompt)" (App. A).
- **Block bootstrap**: resampling both test items and training seeds (rows and columns of a matrix of predictions) to get intervals for accuracy and SGR (App. E).

**Missing glossary terms:** none.

**Builds on:**
- Swayamdipta et al. (2020) and Fu et al. (2023), earlier easy-to-hard studies with a model-based measure and with reasoning-step counts, which found hard training data did better; this paper adds more human measures, datasets and model sizes (§2).
- Burns et al. (2023), concurrent weak-to-strong work; this paper measures against an unsupervised model rather than a weaker one, and uses human hardness, public datasets and open models (§2).

## Problem and setting

- **Research questions (RQ)** (§1): how to measure hardness (RQ1); whether easy training data does well on hard data (RQ2); the cost-benefit of easy against hard data (RQ3); and whether this holds across model scale and growing train–test hardness gaps (RQ4).
- **Datasets** (§3, Tab. 1, App. C), each with only some of the measures: ARC (US grade-school science, multiple choice, grades 3–8); MMLU-STEM-5 (high-school and college questions in five STEM subjects from MMLU, a multiple-choice exam benchmark); StrategyQA (yes/no trivia that combines several facts); GSM8k (grade-school math word problems with a free-form answer, from Cobbe et al., [GSM8K and trained verifiers](#/papers/cobbe2021verifiers "Training Verifiers to Solve Math Word Problems (2021)")).
- **Models** (§4): the Llama-2-70b base model (70b: 70 billion parameters) in the main paper; Mixtral-8x7B (a [mixture-of-experts](#/glossary/mixture-of-experts-moe) model) in Fig. 1; Llama-2 7b and 13b, Llama-2-chat (an [RLHF](#/glossary/reinforcement-learning-from-human-feedback-rlhf) version of the 70b model), Qwen-72b (another open model) and Mixtral-8x7b in App. B.
- **Methods** (§4): in-context learning with 10 examples (ARC, MMLU) or 8 (StrategyQA, GSM8k); chain of thought, primarily, for StrategyQA and GSM8k, with the datasets' reasoning chains as supervision; linear probes; and QLoRA (LoRA adapters trained on a model held in low precision; rank 16). The zero-shot baseline scores answer choices, except GSM8k, which gets a "Let's think step by step" style prompt (§4).
- **Correctness:** "exact match between predicted answer and label" (§4); every test item has a human label (Limitations).
- **Controls** (§4): 5 random seeds pick the training data, and the rest is test data.
- **RQ3 assumptions** (§5.3): hard data costs twice as much as easy data, and hard labels are wrong twice as often; the authors note the cost ratio is almost the one in MMLU-STEM-5 and call the error ratio plausible.

## Approach

For each hardness measure, the data is split into easy, medium and hard; the model is fitted to easy data, to hard data, or to nothing, and tested on hard data only, giving the SGR (§5.2). RQ1 correlates the measures by Spearman's rank correlation (§5.1). RQ3 fits probes on 10 to 320 points, plotting hard-test accuracy against labelling cost, and separately adds label noise (§5.3). RQ4 compares three Llama-2 sizes on MMLU, and trains on 3rd- and 8th-grade ARC questions, testing on college MMLU (§5.4). A control prompts with trivially simple questions in the task's format, to test whether only the format is learned (§6, Fig. 19).

## Results

The authors report, with Llama-2-70b unless noted:
- **RQ1** (§5.1): accuracy falls on harder test data for every measure (Fig. 3; QLoRA, Fig. 10; more measures, Fig. 9, "with the exception of MMLU Answer Chars", the answer-length measure). Correlations between measures are "fairly low" (Fig. 8).
- **RQ2** (§5.2, Fig. 4): with in-context learning, generalization to hard data is "comparable" whether the model is fitted to easy or hard data; the SGR is "between 70% and 100%" across the six measures shown, with "no difference" for ARC and MMLU. SGR "varies somewhat by training method" but stays high for in-context learning and QLoRA (Fig. 13), and stays high on further measures (Fig. 18). GSM8k "appears to exhibit worse easy-to-hard generalization", while accuracy on all of its test data is equally good after fitting to easy or to hard data (Fig. 11).
- **RQ3** (§5.3): with linear probes and a 1:2 cost ratio, easy data is "more often than not" better for hard-test accuracy (Fig. 5). On MMLU-STEM-5 with probes, easy data is preferable when its labelling error rate is 10% or higher, meaning 20% or higher for hard data (Fig. 6).
- **RQ4** (§5.4): SGR is "near 100%" for Llama-2 sizes from 7b to 70b on MMLU (Fig. 15). Across methods there is "some decline in generalization once the gap between train and test hardness becomes sufficiently large": with in-context learning, SGR on college questions falls from 74% to 57% when the examples are 3rd-grade instead of 8th-grade questions (Fig. 7). On the other measures, easy data is "only marginally worse" than medium data (Fig. 16).
- **Task format** (§6, Fig. 19): hard-test accuracy varies with the hardness of the prompt data, not only its format.

## Limits the authors state

- Ground-truth labels are needed to evaluate, which "limits our evaluations to datasets where humans have reliably labeled the data"; results "may not generalize to settings with difficulty levels besides those we test", "especially test settings where almost no amount of human effort can reliably produce accurate data labels (like unsolved scientific questions)" (Limitations).
- They cannot verify that the test questions are not in the open models' training data, so "we cannot be certain that models are generalizing from easy to hard data, rather than reporting memorized hard question answers"; they suggest private or post-cutoff test sets for future work (Limitations). Qwen "appears to have been trained on StrategyQA data in a CoT format" (CoT: chain of thought; Fig. 14).
- Probes and QLoRA are limited to 160 training points so that enough hard test data is left; "we would prefer to use more finetuning data" (§4).
- The largest gap tested is 3rd grade to college STEM (§6); easy-to-hard performance "may begin to decline" when the train–test gap is large enough (§5.4).
- No extra GSM8k hardness measures, because sampling chains of thought there is "extremely computationally expensive" (Fig. 18); no MDL for GSM8k in the measure correlations, because the 7b models get "extremely high loss" on it (Fig. 8).
- "we do not conclude that we are teaching LMs entirely new skills" (§6).

## Open problems and building blocks

  - The authors see their results "as relevant for future work that may operationalize 'easy' and 'hard' differently" (§6).
  - Whether it will become "more and more difficult to supervise models" as AI performance "may exceed human expert performance" in various settings, which motivates RQ4 (§5.4).
  - Why it works is a hypothesis: easy data "elicits latent knowledge and skills from pretrained models in a hardness-invariant way" (§1), perhaps through "'truthfulness' representations" (§6).
- **Released:** the code (abstract, footnote); ARC hardness metadata, in the codebase (App. C).
- **To reuse it:** per-item hardness annotations (Tab. 1) and labelled hard test data (Limitations). A typical Llama-2-70b run (2,000 items, 8-bit, in-context learning with 8 examples, 5 seeds) takes 4 NVIDIA A6000 GPUs about 10 hours; chain of thought on GSM8k takes about an hour per 200 test items; probes reuse saved hidden states (App. D).
- **Beyond its domain:** the authors hope easy-to-hard results let models do well "in niche domain like biology, chemistry, medicine, law, engineering, etc." without much expert annotation (Ethics Statement), and suggest "the scalable oversight problem may be easier than previously thought" (§7).

## On this site

- **Discussed in:** [Gains made against a checker, carried beyond it](#/challenges/transfer_beyond_the_checker)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/general-misc">general-misc</a><a class="tag sub" href="#/tags/llm-misc">llm-misc</a></span>
