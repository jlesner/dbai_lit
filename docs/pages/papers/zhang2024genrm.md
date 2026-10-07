# Generative Verifiers: Reward Modeling as Next-Token Prediction

**Generative Verifiers (GenRM)** · ICLR 2025

Read: [PDF](https://arxiv.org/pdf/2408.15240) · [arXiv](https://arxiv.org/abs/2408.15240)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Reward modeling as next-token prediction: the verifier answers "Yes"/"No" (§3.1), in its CoT variant after writing a rationale (§3.3).
- Can use chain-of-thought and majority voting at verification time.
- Verification itself can be scaled.

## In plain words

When an LLM samples several solutions to a reasoning problem, a trained verifier can score them and keep the top one ([best-of-N](#/glossary/best-of-n-sampling)). This "hinges on how accurate the verifier is" (§1), and LLM-based verifiers "are typically trained as discriminative classifiers to score solutions", without using the LLM's ability to write text (abstract). The authors instead fine-tune an LLM by ordinary next-token training, mixed with writing correct solutions, to answer "Is the answer correct (Yes/No)?", and score by the chance of "Yes". A second variant, given training rationales, first writes a step-by-step check; at test time it samples many checks and averages their scores (§1). Training open Gemma models on word puzzles and school math, they report beating a classifier verifier, a prompted LLM judge and preference-trained verifiers (abstract). Headline: problems solved go from 73% to 93.4% on grade-school math, with a 9-billion-parameter verifier choosing among 16 solutions from Google's Gemini 1.0 Pro, the gain being "the improvement in number of problems solved with Best-of-N" using the step-by-step verifier (§1). They present it as better verifier training, not a first.

## Background and terms

**Terms to know:** [best-of-N sampling](#/glossary/best-of-n-sampling) · [reward model](#/glossary/reward-model) · [LLM-as-a-judge](#/glossary/llm-as-a-judge) · [self-consistency](#/glossary/self-consistency-majority-voting) · [direct preference optimization (DPO)](#/glossary/direct-preference-optimization-dpo) · [outcome and process rewards](#/glossary/outcome-and-process-rewards) · [pass@k](#/glossary/passk)

**The paper's own terms:**
- **Discriminative RM** (RM: reward model; also **ORM**, outcome reward model): an LLM fine-tuned as a classifier with binary cross-entropy on correct and incorrect solutions; its score is the sigmoid of a special token's logit (§2, Eq. 3). It "serves as our main baseline" (§4 "Baselines").
- **GenRM** (the direct verifier): an LLM fine-tuned by next-token prediction to answer 'Is the answer correct (Yes/No)?' after a problem and solution; its score is the probability of the 'Yes' token (§3.1, Eq. 4).
- **unified training** and **λ**: GenRM's loss is the fine-tuning loss on verification data plus λ times the fine-tuning loss on correct solutions (§3.2, Eq. 5). "By default" GenRM verifiers are trained this way (§3.2), with λ = 1/3 on the algorithmic tasks and 1/4 on GSM8K (App. D).
- **GenRM-CoT** (CoT: chain of thought): GenRM trained to write a verification rationale after the prompt 'Let's verify step by step.' and then answer Yes or No; the score is the probability of 'Yes' after its own rationale (§3.3, Eq. 6).
- **majority voting** (for GenRM-CoT): sample K rationales and "average the CoT-verifier score for these rationales" (§3.3, Eq. 7); K = 32 "Unless otherwise specified" (§3.3).
- **reference-guided grading**: to write GSM8K training rationales, Gemini 1.0 Pro is also shown a solution that reaches the correct answer; the verifier is fine-tuned without it, "so that there is no train/test mismatch" (§3.3, Tab. A.2).
- **oracle rationales**: rationales for the algorithmic tasks written by a program, the "ideal scenario where there is no noise in the verification CoT training data" (Tab. A.1).
- **RM accuracy**: whether the verifier classifies each solution correctly as right or wrong; Best-of-N instead tests its ranking (§4 "Evaluation protocol").
- **oracle verifier**: a verifier that is always right; Best-of-N with it is written Pass@N (§4.2).
- **easy-to-hard** and **length generalization**: testing on harder problems (MATH, MMLU) than the GSM8K training set, and on longer word lists than in training (§4 "Tasks").

**Missing glossary terms:**
- **weighted self-consistency**: group sampled solutions by final answer, weight each by its verifier score, and return the answer with the largest weight (§4.1); the paper sums only each answer's 6 (GSM8K) or 4 (MATH) highest scores (App. C).

**Builds on:**
- Cobbe et al. ([GSM8K and trained verifiers](#/papers/cobbe2021verifiers "Training Verifiers to Solve Math Word Problems (2021)")): the GSM8K dataset and the discriminative RM that is the main baseline (§4 "Tasks", "Baselines").
- Lightman et al. ([Let's Verify Step by Step](#/papers/lightman2023verify "Let's Verify Step by Step (2023)")): the Best-of-N evaluation protocol and "the same held-out set of 500 MATH problems" (§4 "Tasks", "Evaluation protocol").
- Wang et al. ([Self-Consistency](#/papers/wang2022selfconsistency "Self-Consistency Improves Chain of Thought Reasoning in Language Models (2023)")): self-consistency, a baseline, cited also for voting over several sampled rationales (§1, §3.3, §4 "Baselines").
- The other baselines: DPO-trained verifiers as in Hosseini et al.'s V-STaR, and LLM-as-a-Judge (Zheng et al.) (§4 "Baselines"); neither is on this site.

## Problem and setting

- **Question:** how GenRM compares with other verifiers, whether unified training helps generation and verification, whether it can use CoT reasoning, and how it scales with model size and inference-time compute (§4).
- **Tasks** (§4 "Tasks", App. A):
  - two string-manipulation tasks: Last Letter Concatenation (join the last letters of a list of words) and Word Sorting from Big-Bench (a suite of LLM test tasks; sort words alphabetically), trained on 2–4 words and tested on 5–6;
  - GSM8K (grade-school math word problems);
  - easy-to-hard tests: MATH500 (500 held-out problems of MATH, a high-school competition benchmark) and four math subsets of MMLU (a multiple-choice exam benchmark) (Tab. 1).
- **Models** (§4 "Models & Training"): verifiers are Gemma-2B on the algorithmic tasks and Gemma 2B, 7B and Gemma-2 9B on GSM8K (Google's open models). Solutions and the LLM-as-a-Judge come from Gemma 2B on the algorithmic tasks and Gemini 1.0 Pro on GSM8K.
- **What counts as correct:** solutions are labelled by an answer checker "either based on string matching or Sympy library" (App. C; Sympy is a Python math library). Training data is always balanced between correct and incorrect solutions (§2, App. B).
- **Metrics:** Best-of-N, "the percentage of problems solved using a fixed generator", and RM accuracy (§4 "Evaluation protocol"). GSM8K test uses 16 solutions per problem (App. A).

## Approach

- **Verifiers (§3.1–3.3):** GenRM and GenRM-CoT as defined above, which "integrate seamlessly with instruction tuning" (abstract), trained by default with unified training, which "can improve verifier and generation performance via positive transfer" (§3.2). Averaging over sampled rationales means GenRM-CoT "can leverage additional inference-time compute to improve its accuracy, which discriminative verifiers cannot do" (§3.3).
- **Synthetic rationales (§3.3, App. C):** naive rationales filtered by their final yes/no "are still often of poor quality, due to 50% accuracy from random guessing", so the authors add reference guidance and then filter (§3.3), keeping only rationales from solutions where "more than 50% of verification rationales agree with the correctness returned by the answer checker" (App. C).
- **Baselines (§4 "Baselines", App. B):** LLM-as-a-Judge prompts the generator model, unchanged, for 32 rationales and picks "the majority-vote correctness answer". The DPO verifier scores a solution by its log-probability under the DPO-trained generator (the "policy"), without subtracting that under the reference policy (the generator before DPO), which "results in better performance" (App. B, Fig. D.5).

## Results

- **Headline (abstract, Fig. 1)**: with GenRM-CoT, problems solved go 5% → 45.3% on the algorithmic tasks (Gemma-2B verifiers, average of the two tasks, Best-of-32), 73% → 93.4% on GSM8K (Gemma2-9B, Best-of-16) and 28% → 44.6% on MATH500 for verifiers trained on GSM8K (Best-of-32).
- **Against baselines (§4.1)**: GenRM "outperforms LLM-as-a-Judge and DPO verifiers (Figure 1), while performing comparably or slightly better than discriminative verifiers (Figure D.1)". GenRM-CoT "nearly matches" the oracle verifier on the algorithmic tasks with oracle rationales, and on GSM8K "consistently outperforms other methods" (Fig. 5, middle).
- **Easy-to-hard (§4.1)**: on MATH, GenRM-CoT matches the discriminative verifier's Best-of-32 "using 6.4× fewer solutions" and "surpasses the strong self-consistency baseline" (Fig. 5, right; by subject and difficulty, Fig. 6). On the four MMLU subsets, it beats the discriminative RM by +0.5 to +3.5 points, "more significant on harder tasks" (Tab. 1). Weighted self-consistency with GenRM-CoT needs fewer solutions than with the discriminative RM to reach the same MATH performance (Fig. 8).
- **Worked examples**: GenRM-CoT flags errors that the discriminative RM scores as likely correct (Figs. 2, 4, 15; App. E).
- **Unified training (§4.2):** it "consistently improves verification performance across all tasks" for both verifiers (Fig. 9); too much generation data can lower it (Fig. D.3). Adding CoT verification data also improves the model's own solutions under an oracle verifier, compared with fine-tuning on correct solutions alone (Fig. 10).
- **Scaling (§4.3):** On GSM8K, GenRM-CoT's Best-of-N rises with more votes at all three Gemma sizes, beats its own greedy-decoding score "within 2 votes", and beats LLM-as-a-Judge using the same CoT approach and votes (Fig. 11). On MATH, generative verifiers "outperform discriminative counterparts in all model regimes", in Best-of-N and RM accuracy (Fig. 12).
- **Rationales (§4.4):** reference guidance gives 91.7% against 87.8% without it, for Gemma-7B GenRM-CoT on GSM8K (Fig. 13). With Gemma-7B and greedy decoding, more rationales per solution (Fig. 14) and more solutions per problem (Fig. D.2) raise RM accuracy and Best-of-N.

## Limits the authors state

- The synthetic rationales "may contain errors" (§4.1); the authors "suspect" that training on several rationales per solution helps through an "ensembling" effect that "prevents overfitting to such errors" (§4.4).
- "individual verification rationales from CoT verifiers can have reasoning errors", which averaging over rationales "can mitigate" (§3.3).
- The answer checker "is not perfect", giving false negatives, and "it is possible for a solution to arrive at the right answer with an incorrect reasoning path", giving false positives (App. C).
- "adding too much solution generation data can decrease verification performance of GenRM" (§4.2).
- The generation gain is smaller on GSM8K, "that relies on synthetic rationales, which may be inaccurate" (Fig. 10).
- Weighted self-consistency adds little on GSM8K, "likely because improvement potential has saturated" (Fig. D.4).

## Open problems and building blocks

- **Open** (§6):
  - extending the framework "to broader tasks such as coding, alignment, text-to-image generation", and open-ended generation;
  - process-level supervision and training CoT verifiers with reinforcement learning "can result in more accurate generative verifiers";
  - combining GenRM with retrieval-augmented generation, many-shot learning, multi-staged prompting and tool use;
  - "incorporating generative verifiers into RL pipelines for LLMs warrants further investigation".
- **Released:** "Data will be released at" a project web page (Fig. 1 caption).
- **To reuse it:** an LLM to fine-tune (Gemma 2B to 9B here); correct and incorrect solutions from a fixed generator, labelled by an answer checker; for GenRM-CoT, rationales from a program or from an LLM given a reference solution, which "does not require a more capable model" (Tab. A.2); 300K fine-tuning steps at batch size 64 (App. B); at test time, 32 rationales per solution by default (§3.3).

## On this site

- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/judge-general">judge-general</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/scaling-general">scaling-general</a></span>
