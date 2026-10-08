# Self-Improvement in Language Models: The Sharpening Mechanism

**Self-Improvement in Language Models** · ICLR 2025

Read: [PDF](https://arxiv.org/pdf/2412.01951) · [arXiv](https://arxiv.org/abs/2412.01951)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Formalizes self-improvement as "sharpening": the model acts as its own verifier (a self-reward such as its own likelihood) to shift probability onto high-quality responses, amortizing inference-time search into post-training (abstract; §1.1, §3.1).
- A statistical framework with fundamental limits (§3.3) and two algorithm families: SFT-Sharpening (fine-tune on best-of-N picks by self-reward) is minimax optimal when the base model has enough coverage, while RLHF-Sharpening can bypass coverage through online exploration (abstract; §2, §4). Experiments use best-of-N with the likelihood as self-reward on open models (Phi-3, Llama-3.2-3B, Mistral-7B) and `gpt-3.5-turbo-instruct`, on math, ProntoQA, MMLU and Game of 24 questions with checkable answers (§5.1–5.2), then train on those picks (§5.4).
- The theory of a model checking itself with no external check: "It is impossible for this self-improvement to create information that is not already in the model" (abstract); the authors report that best-of-N by likelihood can degrade as N grows when the base model is weak or short answers win (§5.2).

## In plain words

The authors note that a model improving itself without outside feedback cannot create information not already in it, and ask why it helps (abstract, §1). Their answer is "sharpening": models are "often better at verifying response quality than they are at generating correct responses" (abstract), so training a model toward its most certain answers can replace costly answer-time search (§1.1). Rating answers by the model's probability, they build a framework counting samples needed, prove limits, and analyze two methods: fine-tuning on the best of many samples, and reinforcement learning (§1.2). The first is, in a worst-case sense, up to some factors and at fixed confidence, the best possible when the model gives its most likely answer enough probability; the second can avoid that need by exploring, under extra assumptions (abstract; §4). On four model-task pairs chosen for promising best-of-N results, fine-tuning on the likeliest of 50 samples beat the base model's greedy decoding (Tab. 1). They claim, "To the best of our knowledge", to be "the first to study self-training in a general framework that subsumes language modeling" (§1.3).

## Background and terms

**Terms to know:** [best-of-N sampling](#/glossary/best-of-n-sampling) · [greedy decoding and temperature sampling](#/glossary/greedy-decoding-and-temperature-sampling) · [reinforcement learning from human feedback (RLHF)](#/glossary/reinforcement-learning-from-human-feedback-rlhf) · [direct preference optimization (DPO)](#/glossary/direct-preference-optimization-dpo) · [KL penalty](#/glossary/kl-penalty) · [exploration and exploitation](#/glossary/exploration-and-exploitation) · [self-consistency (majority voting)](#/glossary/self-consistency-majority-voting) · [pass@k](#/glossary/passk)

**The paper's own terms:**
- **base model** (πbase): the trained model to improve, mapping a prompt to a distribution over responses (§1.1).
- **self-reward**: a score for a response "derived purely from the base model", "measuring model certainty", e.g. models-as-judges (§1.1).
- **sharpening**: "any process that tilts πbase toward responses that are more certain" (§1.1, Eq. 1), at answer time (inference-time sharpening) or by training ("amortization via self-training", what unqualified "sharpening" means here) (§1.1).
- **maximum-likelihood sharpening**: the self-reward is the log-probability of the whole response, so the target is the most likely full sequence (Eq. 2, §3.1).
- **(ε, δ)-sharpened model**: puts at least 1 − δ of its probability on the most likely response(s) on all but an ε fraction of prompts (Def. 3.1).
- **sample-and-evaluate framework**: the learner sees the base model only by drawing n prompts and N responses per prompt and reading each response's likelihood; the sample complexity is m = n·N (Def. 3.2).
- **coverage**, two senses: (1) the **coverage coefficient**, the average over prompts of one over the probability the base model gives its most likely response (§3.3, Eq. 6); (2) the **coverage criterion** of Brown et al. (2024), whether any of N samples is correct, a "skyline" that uses the true answer (§5.3; Fig. 3c, "Pass@50"), i.e. pass@k.
- **realizability**: the model class can represent the training target (Assumptions 4.1, 4.3).
- **margin condition**: the most likely response is at least (1 + margin) times as likely as any response outside the most likely set, on every prompt that can occur (Assumption 4.2).

**Missing glossary terms:**
- **minimax optimal**: worst-case cost matching, up to stated factors, a lower bound no algorithm can beat (general definition; used undefined in §1.2, §4.1).

**Builds on:**
- The self-improvement work it seeks to explain: Huang et al. (2022) and four others (§1, §1.3), none on this site.
- Alignment algorithms, "with a specific choice of reward function": best-of-N fine-tuning (Amini et al., 2024, and three others), RLHF (Christiano et al., 2017) and DPO (Rafailov et al., 2023) (§1.3).
- XPO, the exploratory preference optimization of Xie et al. (2024), adapted to reward feedback (§4.2.2, App. J.2).

## Problem and setting

- **Questions** (§1.2): when and how self-training achieves sharpening, and its fundamental limits.
- **Success** in the theory is probability placed on the base model's most likely response (Def. 3.1), under "the tacit assumption" that "the maximum-likelihood response constitutes a useful form of hidden knowledge" (§3.1).
- **Theory:** general model classes (§4), with exact optimization (§2).
- **Experiments** (§5.1–5.2): Phi-3 and Phi-3.5 models, Llama-3.2-3B, Mistral-7B, gpt-3.5-turbo-instruct, and a Llama-2 fine-tuned on Game of 24 (Wan et al., 2024). Tasks: GSM8k and MATH (math problems), ProntoQA (true/false reasoning), three MMLU college subsets (multiple choice), Game of 24 (reach 24 from four numbers). Mostly 256 examples per task, temperature 1, N up to 50, 10 seeds, against greedy decoding.

## Approach

- **SFT-Sharpening** (§2.1): for each prompt, sample N responses, keep the one with the highest self-reward, and fine-tune on the kept responses.
- **RLHF-Sharpening** (§2.2): maximize expected self-reward minus a KL penalty toward the base model; the exact optimum approaches sharpening as the penalty weight goes to zero. The theory uses an [offline](#/glossary/online-and-offline-rl) reward-based DPO variant on pairs of base-model responses (Eq. 8), and a modified XPO (Alg. 1) that samples from the current model with an exploration bonus.

## Results

**Theory** (maximum-likelihood sharpening; upper bounds hold with probability at least 1 − ρ, ρ the failure probability):
- **Prop. 3.1:** if a prompt's most likely response is unique and gets more than half the model's probability, greedy decoding returns it; at half or less it can fail.
- **Thm. 3.1 (lower bound):** for any ε and coverage level C there is a model class of a stated size, each model with coverage coefficient at most about C and a unique most likely response per prompt, on which any sample-and-evaluate algorithm that, for every base model in the class, puts more than half the probability on the most likely response on at least a 1 − ε fraction of prompts in expectation needs samples of order at least C times log(class size) over ε², up to a log factor.
- **Thm. 4.1 (SFT-Sharpening):** if the class contains the distribution of best-of-N responses, then with suitable n and N it is (ε, δ)-sharpened using samples of order the coverage coefficient times log(class size / ρ) times log(1/δ), over δ·ε². The authors call it "minimax optimal in the sample-and-evaluate framework when δ is constant", matching Thm. 3.1 "up to polynomial dependence on δ and logarithmic factors" (§4.1).
- **Thm. D.1, D.2 (adaptive):** given realizability, expected samples scale with 1/ε instead of 1/ε², with a coverage coefficient "larger in general"; a lower bound shows this ε-dependence is tight in the adaptive framework.
- **Thm. 4.2 (DPO):** under the margin condition, realizability and bounded concentrability (no model puts much more probability on its own responses than the base model, on average; Eq. 9), with a small enough penalty weight, the same ε-dependence as SFT-Sharpening, a worse δ-dependence, and a cost that grows as the margin shrinks.
- **Thm. 4.3 (XPO, informal version of Thm. J.2):** under the margin condition, bounded log-probabilities and realizability at a set penalty weight, XPO "when configured appropriately" sharpens with no dependence on the coverage coefficient, scaling instead with the SEC (sequential extrapolation coefficient: how hard exploration is in the model class; Def. J.1), in "a slight generalization" of the framework (footnote 6).
- **Thm. 4.4, Example J.1:** for a linear softmax base model (probabilities proportional to the exponential of features times weights) with weight norm at most the margin times the class's weight bound B over a log term, and the margin condition, XPO needs samples polynomial in 1/ε, 1/δ, 1/margin, the dimension, B and log(|responses|/ρ); where the coverage coefficient is exponential in the dimension yet the margin is constant, SFT-Sharpening needs exponentially many (§4.2.2).
- **App. E:** for multi-layer linear softmax models of a particular form, finding the most likely response is NP-hard in the worst case (Prop. E.1), and with two-token responses the class may hold no model giving a base model's unique most likely response over half the probability, at any weight bound (Prop. E.2).

**Experiments:**
- **Inference-time** (§5.2): best-of-N by likelihood beats temperature-1 sampling on every pair, and greedy decoding for at least one model per dataset and one dataset per model (Fig. 1a, Fig. 2). Correct responses' log-probabilities stochastically dominate incorrect ones' "in each (model, task) pair evaluated" (§5.2; Fig. 6's caption: "In all cases except perhaps (c)").
- **Other self-rewards** (§5.3): length-normalized likelihood and majority voting give improvements "generally larger than those obtained with log-likelihood"; with N = 50, "all of the models almost always produce a correct answer on all tasks" by the coverage criterion (Fig. 3).
- **Training-time** (§5.4, Tab. 1): on pairs with "particularly promising inference-time BoN performance", SFT-Sharpening with [LoRA](#/glossary/lora-low-rank-adaptation) on 50 samples per prompt (best checkpoint, three seeds, sampling the fine-tuned model at temperature 1) improved accuracy and likelihood over the base model's greedy decoding on all four pairs, accuracy lifts from 1.82% (Phi-3.5-Mini, GSM8k) to 19.24% (Phi-3.5-Mini, MATH).

## Limits the authors state

- Maximum-likelihood self-reward is "simple and stylized" (§3.1); realizability is "certainly non-trivial" (Remark 4.1).
- The coverage notion "is somewhat stringent" (Remark 3.1); the DPO guarantee "may be somewhat pessimistic" (§4.2.1); Thm. 4.4 "is quite stylized" (Remark 4.2).
- "In some cases, performance can degrade as N increases": when the reference model performs poorly (e.g. Llama-3.2-3B-Instruct) or short responses are selected (e.g. gpt-3.5-turbo-instruct on GSM8k) (§5.2).
- Training covered a subset of pairs "Due to limited computational resources"; the GSM8k curve "is quite noisy"; Mistral-7B on MATH spent most of its gradient steps recovering from an initial drop, which the authors "speculate" reflects insufficient tuning (§5.4). The fine-tuned Phi-3.5-Mini "does not fully reach the performance of inference-time BoN sharpening" (Fig. 7 caption).

## Open problems and building blocks

  - Self-improvement "for specific models/architectures" and its representations; "when and how" richer self-rewards help (§6).
  - Whether Thm. 4.1's 1/δ factor can be removed (§4.1); whether Thm. 4.2's margin dependence is needed: "it is not clear if the precise dependence we pay is necessary"; removing the concentrability bound, which they "expect" can be done "by incorporating pessimism" (favouring what the data supports well) (§4.2.1).
  - Extensions they "expect": a logarithmic term replacing the log-probability bound (§4.2.2), the lower bound for XPO's wider framework (footnote 6), guarantees "for other active exploration algorithms and complexity measures" (§4.2.2).
  - "other self-reward functions that further improve performance" (§5.3); whether entropy minimization's statistical benefits in computer vision "translate to the language modeling setting" (App. B).
- **Released:** Nothing stated.
- **To reuse it:** N samples per prompt with the base model's likelihood of each, then fine-tuning (§2.1, Def. 3.2); the DPO variant uses two responses per prompt (§4.2.1); XPO queries likelihoods of arbitrary prompt-response pairs (footnote 6).

## On this site

- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/judge-general">judge-general</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/scaling-general">scaling-general</a></span>
