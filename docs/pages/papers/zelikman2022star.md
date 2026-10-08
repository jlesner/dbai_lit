# STaR: Bootstrapping Reasoning With Reasoning

**STaR (Self-Taught Reasoner)** · NeurIPS 2022

Read: [PDF](https://arxiv.org/pdf/2203.14465) · [arXiv](https://arxiv.org/abs/2203.14465) · [DOI](https://doi.org/10.52202/068431-1126)  
Code: [STaR](https://github.com/ezelikman/STaR)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- A few-shot-prompted LLM writes rationales for many questions; only those whose final answer matches the dataset's answer are kept, the model is fine-tuned on them, and the loop repeats (abstract; §3.1).
- "Rationalization": for questions it got wrong, the model writes a rationale given the correct answer, kept if it reaches that answer (§3.2; Alg. 1 line 6); GPT-J (6B) on arithmetic, CommonsenseQA and GSM8K (§4.1).
- The generate, check the answer, retrain loop the <a class="tag" href="#/tags/rlvr">rlvr</a> tag names; the authors frame the answer filter as an approximation to a policy-gradient objective with an indicator reward (§3.1), and [Tülu 3](#/papers/lambert2024tulu "Tulu 3: Pushing Frontiers in Open Language Model Post-Training (2024)") calls RLVR a simplified form of it. Only the final answer is checked: the authors report that higher-temperature sampling "increases the likelihood of a correct answer despite incorrect reasoning" (§5).

## In plain words

Making a model reason in writing (a rationale) before answering takes either a costly hand-built set of rationales or a few prompt examples, which the authors say generally do substantially worse than models fine-tuned on larger datasets to answer directly (abstract; §1). In STaR (Self-Taught Reasoner), the model, prompted with a few examples, writes a rationale and answer for each question of a dataset with answers but no rationales; those reaching the dataset's answer are kept for fine-tuning, and the loop repeats. For questions it gets wrong, it is shown the correct answer and asked to explain it; explanations reaching that answer are kept too, hint removed (§1; §3). With a 6-billion-parameter model on five-choice commonsense questions, the authors report 72.5% dev-set accuracy, against 60.0% for the same model fine-tuned to answer directly and 73.0% for GPT-3 fine-tuned the same way (Tab. 1), a model 30 times larger (§1). They call it, "to our knowledge, the first technique to allow a pre-trained large language model to iteratively use its language modeling capacity to improve itself" (§1).

## Background and terms

**Terms to know:** [expert iteration](#/glossary/expert-iteration) · [rejection sampling](#/glossary/rejection-sampling) · [policy gradient](#/glossary/policy-gradient) · [latent variable](#/glossary/latent-variable) · [greedy decoding and temperature sampling](#/glossary/greedy-decoding-and-temperature-sampling) · [out-of-distribution generalization](#/glossary/out-of-distribution-generalization) · [self-consistency (majority voting)](#/glossary/self-consistency-majority-voting)

**The paper's own terms:**
- **rationale**: reasoning written before the final answer (§1); for arithmetic a "scratchpad", one line per digit pair with the carry (§4.2, Fig. 3).
- **rationale generation**: the few-shot-prompted model writes a rationale, then an answer (§3.1).
- **rationalization**: for a wrongly answered question, the correct answer is given "as a hint" and the model writes a rationale; it enters the training set as if written without the hint (§3.2). For CommonsenseQA the hint marks the right choice "(CORRECT)" (Fig. 2).

**Missing glossary terms:**
- **off-policy estimate with a proposal distribution**: estimating an objective defined over one model's outputs from samples drawn from another distribution (the proposal). §5 uses it without defining it; general definition.

**Bridge (ours):** the answer filter is the check of the glossary's rejection sampling fine-tuning. The authors describe Expert Iteration as [self-play](#/glossary/self-play) by an "apprentice", [imitation learning](#/glossary/imitation-learning) with feedback from a slower "expert", then the improved apprentice replacing the expert; STaR's answer filter "can be seen as expert feedback", but they "have a fixed 'expert' and do not train a separate value function" (§2), that is, no model that predicts how likely a partial solution is to succeed (a [value function](#/glossary/value-function)).

**Builds on:**
- Expert Iteration (ExIt), Anthony et al. [21], a reinforcement-learning technique, "an inspiration for our approach" (§2).
- Rajani et al. [3], whose human-annotated rationales are the human comparison in §4.4; rationalization is "Inspired by" them (§3.2).
- Scratchpads, Nye et al. [5] (the arithmetic setup), and chain-of-thought prompting, Wei et al. [6] (the ten CommonsenseQA prompt questions, rationales "modified slightly") (§4; §4.1).
- GSM8K, Cobbe et al. [9] ([GSM8K and trained verifiers](#/papers/cobbe2021verifiers "Training Verifiers to Solve Math Word Problems (2021)")): the dataset and the few-shot examples (§4.2; App. I).

## Problem and setting

- **Question:** can a model bootstrap its reasoning from a few rationale examples and answered questions (abstract)?
- **What counts as correct:** only the final answer is compared with the dataset's. The authors "assume that rationales that lead to correct answers are of better quality than those that lead to incorrect answers" (§3.1); the loop runs "without needing to check new rationales' correctness" (§1).
- **Model:** GPT-J, a 6B-parameter model with public checkpoint and fine-tuning code (§4.1).
- **Tasks** (§4.2): arithmetic, sums of two numbers of 1 to 5 digits (10,000 problems sampled per iteration, §4.1); CommonsenseQA (CQA), five-choice questions built from the concept graph ConceptNet, scored on the 1,221-question dev set (test set withheld); GSM8K, grade-school word problems of two to eight calculation steps (1,319 test problems).
- **Reporting:** "We run STaR until we see performance saturate, and we report the best results" (§4.1).

## Approach

- **The loop** (§3.1, Alg. 1): generate a rationale and answer for every question, keep those with the right answer, fine-tune, and repeat "until the performance plateaus". Each round fine-tunes the original pretrained model, not the last one, "to avoid overfitting".
- **Rationalization** (§3.2, Alg. 1 blue lines): applied only to failed problems, and its rationales are kept only if they reach the right answer (Alg. 1 line 6); without it, "improvement ends when the model fails to solve new problems in the training set", since failures give no training signal. Its "crucial benefit" is exposing the model to difficult problems.
- **The reinforcement-learning view** (§3.1, Eq. 1–2): the rationale is a latent variable sampled before the answer, and the reward is 1 for a correct answer, else 0; the policy gradient of this objective drops every rationale with a wrong answer, which is STaR's filter. STaR "can be seen as an approximation" to it: it decodes greedily, which the authors say makes the gradient estimate less noisy at the cost of possibly skewed exploration of rationales, and it takes several gradient steps on one batch. §5 adds that rationalization "could be framed as an off-policy estimate" of Eq. 1.
- **Schedule** (§4.1): unless stated otherwise, 40 training steps in the first round (outer loop) and 20% more each round.

## Results

- **Arithmetic** (§4.3, Fig. 4): few-shot accuracy is below 1% on 2-digit sums; with rationalization, one iteration raises it to 32%. Without rationalization, gains are "stage-wise", generally one digit length after the one below; with it, many lengths improve at once, "though not with equal accuracy". "After running STaR for 16 iterations, the overall accuracy is 89.5%", against 76.3% for a baseline trained without rationales on 10,000 examples for 5,000 steps. In a run with rationalization and digits added during training, the model "successfully solves many" 9- and 10-digit problems never seen in training, though training appears "less stable" (Fig. 5).
- **CommonsenseQA** (§4.4, Tab. 1), dev accuracy: STaR with rationalization 72.5%, trained on 86.7% of the training set; GPT-J fine-tuned directly on all of it 60.0%; few-shot GPT-J 36.6% with rationales, 20.9% without; few-shot chain-of-thought LaMDA, a 137B-parameter language model (Wei et al.'s result), 55.6%; GPT-3 fine-tuned directly (Xu et al. [29]) 73.0%. STaR without rationalization also beats the direct GPT-J baseline (§4.4). Keeping few-shot prompts during fine-tuning "appears to have a meaningful performance benefit" (§4.4).
- **Human evaluation** (§4.4), "preliminary": 20 crowdworkers, 10 questions each, ranked rationales for 50 questions both few-shot prompting and STaR answered correctly (App. C: STaR without rationalization). They were "30% more likely" to rank STaR's above few-shot ones (p = .039) and "74% more likely" to prefer them over Rajani et al.'s human rationales (p < .001); the authors "do not believe that this indicates human-level rationale-generation performance".
- **GSM8K** (§4.5, Tab. 2), test accuracy: STaR with rationalization 10.7%; GPT-J fine-tuned directly 5.8%; few-shot 3.1% with rationales, 3.0% without. Rationalization "does not substantially improve performance" here. On training examples, where its count of calculation steps differs from the human solution's, the model "typically uses fewer" (Fig. 6); substantially fewer typically means a correct answer "despite mistakes in its reasoning" (App. J).

## Limits the authors state

- The first iteration needs few-shot performance "above chance", so the model "must be big enough to have some reasoning capabilities"; GPT-2 "was not able to bootstrap from few-shot reasoning in even the arithmetic domain" (§6).
- Settings with high chance performance (e.g. binary decisions) yield "many poor rationales, confounding the STaR approach. An open problem is how to filter bad reasoning in these settings" (§6).
- Higher-temperature sampling, "In general, … substantially increases the likelihood of a correct answer despite incorrect reasoning"; used instead of rationalization, temperatures such as 0.5 or 0.7 "consistently led to models worse than models with reasoning alone" (§5).
- The hint "does not follow immediately from the question and answer and in some contexts providing it may be nontrivial"; other hinting techniques are "an avenue for future work" (§5).
- Without few-shot prompts after the first iteration, the model "tends to perform gradually worse at rationalization as it trains for longer periods of time" (§5); shown some hints during training, it "appeared to pick up on the fact that the final answer would always correspond to the hinted answer" (App. A.6).
- CQA rationale quality can only be judged qualitatively (§4.4); "Many have pointed out" biases in CQA, and it has many typos and "fundamentally ambiguous" questions (§4.2).
- If biases are "useful" in solving the dataset, STaR amplifies them, and rationalization makes this worse; "it is difficult, if not impossible, to ensure that the rationales reflect the model's internal processing" (App. G).
- On GSM8K the number of training steps per iteration was capped at the 30th iteration's level "to prevent the training process from becoming prohibitively long"; results came after 36 iterations without rationalization and 10 more with it (§4.5).

## Open problems and building blocks

  - "future work should more closely investigate the link between STaR and the RL objective above" (§3.1), and "examine more generally when and why rationalization improves learning" (§5).
  - Majority votes of high-temperature scratchpads as ground truth "may allow one to apply STaR to a dataset of only questions, without answers" (§5, citing Wang et al. [32], [Self-Consistency](#/papers/wang2022selfconsistency "Self-Consistency Improves Chain of Thought Reasoning in Language Models (2023)")).
  - When to drop few-shot prompts, and a thorough hyperparameter search, are left to future work (§5; §4.1).
  - "We expect accuracy would be further improved if we applied STaR to a model with higher few-shot performance" (§4.4).
- **Released:** Nothing stated; the prompts are printed in App. B and App. I.
- **To reuse it:** answered questions, a few rationale examples, a way to give the hint (§3; §5), and a model with above-chance few-shot performance (§6). The runs used GPT-J's fine-tuning script (§4.1) on a single TPU-v3 node (App. H).
- **Beyond its domain:** the authors "believe using examples without reasoning to bootstrap reasoning is a very general approach, and that STaR can serve as the basis of more sophisticated techniques across many domains" (§6).

## On this site

- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/rlvr-general">rlvr-general</a></span>
