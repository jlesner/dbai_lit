# Solving math word problems with process- and outcome-based feedback

**process- vs outcome-based feedback** · preprint 2022

Read: [PDF](https://arxiv.org/pdf/2211.14275) · [arXiv](https://arxiv.org/abs/2211.14275)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Compares outcome-based and process-based supervision on GSM8K (abstract).
- Pure outcome supervision gives similar final-answer errors with less label supervision; correct reasoning steps needed process-based supervision or reward models that emulate it (abstract).
- Answer checks pass wrong reasoning unless wrong reasoning rarely reaches the right answer: the authors tie their outcome-RM result to math (§3) and recommend outcome feedback only with "a reliable and complete evaluation metric" (§4.1).

## In plain words

Language models solve math word problems better when they reason step by step, but how should such a model be trained: by checking only whether its final answer is right (outcome-based), or by checking each reasoning step (process-based)? The authors argue the choice matters because reasoning errors can be hard to detect and are a problem in settings such as teaching (abstract, §1). Starting from a 70-billion-parameter pretrained language model, they compare on GSM8K, a set of grade-school math word problems, combinations of prompting, fine-tuning on human-written solutions, reinforcement learning and learned answer scorers, and have human raters mark reasoning mistakes. They report that checking final answers alone gives similar final-answer error with less labelling, but that correct reasoning needed supervision of the reasoning itself or a learned scorer that imitates it (abstract). Their best model lowers the best earlier final-answer error from 16.8% to 12.7%, and the share of correctly answered problems with flawed reasoning from 14.0% to 3.4% (abstract). They call this "the first comprehensive comparison between process- and outcome-based approaches trained on a natural language task" (abstract).

## Background and terms

**Terms to know:** [outcome and process rewards](#/glossary/outcome-and-process-rewards) · [reward model](#/glossary/reward-model) · [reinforcement learning](#/glossary/reinforcement-learning) · [expert iteration](#/glossary/expert-iteration) · [self-consistency (majority voting)](#/glossary/self-consistency-majority-voting) · [best-of-N sampling](#/glossary/best-of-n-sampling) · [selective prediction](#/glossary/selective-prediction) · [tampering](#/glossary/reward-tampering)

**The paper's own terms:**
- **outcome-based vs process-based**: "outcome-based approaches, which supervise the final result, and process-based approaches, which supervise each step of the reasoning process, including the last step outputting the final result" (§1). Process supervision here comes from GSM8K's human-written solutions and human labels on model steps (§1).
- **reasoning trace**: "a newline-separated sequence of steps, where the last step is expected to provide the final answer", an integer on GSM8K (§2.2).
- **final-answer error rate**: share of test problems without the correct final answer, by exact string match (§2.1).
- **trace error rate**: "the fraction of problems with correct final answers for which the method produces at least one incorrect reasoning step", from human annotations (§2.1). Raters mark the first "major mistake" (§2.7).
- **ORM and PRM**: language models that output a correct/incorrect token after each step. The outcome-supervised RM (ORM) labels every step with whether the sample's final answer matched the reference, following Cobbe et al.; the process-supervised RM (PRM) labels each step with whether the steps so far are correct, from human annotations (§2.4).
- **RM-weighted decoding**: from 96 samples, sum the RM's correctness probabilities over those with the same final answer, take the answer with the largest total, then its highest-scoring sample (§2.5). Tab. 1 calls it "ORM reranking" or "PRM reranking"; without an RM, majority voting is used.
- **Final-Answer RL, ORM-RL, PRM-RL**: RL variants that select training samples by final-answer correctness, the ORM's score of a full solution, or the PRM's score of each step (§2.6). A name's prefix gives the start point: "Few-shot+…" a 5-shot prompted base model, "SFT+…" the fine-tuned model.
- **Distillation into compact models**: inside expert iteration, supervised learning on the samples the search step produced (§2.6), not training a smaller student.
- **spurious solutions**: cited from Goldman et al. (2017); math lacks them because there "incorrect reasoning steps are unlikely to lead to the correct final answer" (§3).

**Builds on:**
- Cobbe et al. (2021), [GSM8K and trained verifiers](#/papers/cobbe2021verifiers "Training Verifiers to Solve Math Word Problems (2021)"): GSM8K, the ORM approach, the calculator syntax (§2.1, §2.4, §2.5).
- STaR (Zelikman et al., 2022, not listed here), self-training on traces with correct final answers: the paper's Final-Answer RL (§2.6, §5).
- Li et al. (2022, not listed here): the prior state of the art, and a step-aware verifier labelled by a string-matching heuristic instead of human evaluations (§2.4, §3.2, Tab. 1).
- WebGPT (Nakano et al., 2021, not listed here), a browser-using question-answering model: "the prior work which most directly compares process- and outcome-based feedback for multistep LM reasoning" (§5).

## Problem and setting

- **Question:** "how we should supervise such models: outcome-based approaches which supervise the final result, or process-based approaches which supervise the reasoning process itself?" (abstract).
- **Data:** GSM8K only, because recruiting expert annotators "imposes a large up-front cost" (§2.1); a 256-example validation set split from training, 1319 test problems (§2.1).
- **Model:** one pretrained language model, cited to Hoffmann et al. (2022) (§1), "Our Base-70B" in Tab. 1.
- **Correctness:** final answers by exact string match; reasoning by human raters. Trace error uses 200 correctly answered problems per model, for each of the authors' 10 models in Tab. 1, with duplicate labelling (§2.7); Tab. 1's ranges run from errors both raters mark (min) to errors either marks (max).
- **Generalization test:** zero-shot on the pre-algebra split of the MATH dataset, whose problems are written with LaTeX (Hendrycks et al., 2021; App. D), keeping problems without Asymptote (drawing-code) diagrams (§3.5, App. D).

## Approach

- **SFT (§2.3):** fine-tuning on GSM8K's reference solutions, treated as process-based.
- **Reward models (§2.4):** unless otherwise noted, the ORM trains on 96 samples per problem from the policy of the approach it serves. The PRM trains on 1560 annotated SFT samples from 530 training problems where SFT's majority vote was wrong, and is initialized from the ORM's parameters because the data is small (§2.4, §2.7).
- **RL via expert iteration (§2.6, Fig. 2):** alternate sampling-and-selecting with Distillation into compact models. PRM-RL builds a solution step by step, keeping the PRM's best of 96 candidate steps. Few-shot runs use no GSM8K reasoning steps beyond the 5 prompt examples, and no human annotations. Of 5 epochs they "select the best model of the 5, based on final-answer test error".

## Results

- **Headline (§3, Tab. 1):** SFT+ORM-RL with ORM reranking has final-answer error 12.7%, against 16.8% for Li et al. (the code model Codex-175B with ORM reranking), and trace error 3.4%, against the 14.0% Tab. 1 attributes to the few-shot prompted language model PaLM-540B (Wang et al., self-consistency, [Self-Consistency](#/papers/wang2022selfconsistency "Self-Consistency Improves Chain of Thought Reasoning in Language Models (2023)"); Wei et al., chain-of-thought prompting).
- **Final-answer error (§3 "Supervising final-answer correctness…"):** Few-shot+Final-Answer RL against SFT: 23.5% vs 22.3% with majority voting, 16.6% vs 14.8% with ORM reranking. The authors say this "suggests that in cases where final-answer correctness is sufficient, outcome-based approaches can provide a label-efficient approach with competitive performance".
- **ORM imitates process labels (§3 "ORM-supervised reward models…", Fig. 4):** ORM predictions tend to agree with PRM labels more than with the ORM's own labels, 85% vs 77%, averaged over all steps of the PRM validation set; similar on the last step (App. C, Fig. 6). The authors "suspect" recognizing correct steps is easier for the ORM than computing the answer.
- **Trace error (§3 "Low trace error requires…"):** with ORM reranking, Few-shot+Final-Answer RL has 12.4%, which training against the ORM (Few-shot+ORM-RL) lowers to 5.5%, against 4.4%/3.5% for SFT with ORM/PRM reranking. Applying Final-Answer RL to SFT lowers final-answer error but raises trace error, "though we note the difference is not statistically significant" (§3.1).
- **Reranking and RL (§3.1–3.3, Tab. 3):** the 5-shot prompted model alone "leaves significant performance on the table"; RM reranking improves both metrics; in both the few-shot and SFT settings, ORM-RL and PRM-RL beat Final-Answer RL under all three decodings. From a few-shot start, "RL cuts the final answer error rate by half, regardless of the decoding method"; from SFT, RL "has very little effect on top of using an RM for decoding", but helps greedy decoding.
- **Selective prediction (§3.4, Fig. 5):** for SFT with PRM reranking, abstaining on 30% of inputs lowers final-answer error from 14.1% to 2.7%; at 30% abstention the reduction factor is larger for SFT with the ORM or PRM than for Few-shot+Final-Answer RL.
- **Out of distribution (§3.5, Tab. 7):** "noticeable OOD generalization" on MATH pre-algebra, with no "noticeable trends based on the type of supervision".
- **When to use which (§4.1):** "As a general rule, outcome-based feedback tends to be appropriate when a reliable and complete evaluation metric is available, while process-based feedback is most appropriate otherwise".

## Limits the authors state

- One dataset (§2.1); "the limited scope of the dataset prevents studying certain safety problems" (§1).
- "the fact that the ORM model approximates the PRM labels may be domain-specific" (§3); "We generally expect process-based and outcome-based feedback to align more closely for math compared to other domains" (§4.2).
- "there is significant noise in the trace error rates" (Tab. 1 caption); evaluation inter-rater agreement is "significantly lower than on the training set" (App. B).
- Majority voting and RM-weighted decoding "are slightly less general due to their reliance on exact string-matching between final answers" (§2.5).
- Verbalized traces "do not necessarily represent the model's internal reasoning process", except in strictly modular approaches (§4.3).
- Some motivations for process-based feedback "are yet to be empirically validated" (§4.1).
- App. E's observations are "much less carefully checked than the results reported in the main paper".

## Open problems and building blocks

  - The ORM imitation effect, which "may be dataset-specific": "we hope that it is investigated further in future work" (§1 "Key results").
  - Since "some of these conclusions may be specific to our setting of math word problems, we hope that future work explores the extent to which they generalize to other domains" (§6).
  - Selective prediction and trace error: "further investigation would be necessary to properly understand this effect" (§3.4).
  - Step-level reranking raised final-answer error, which "seemed to largely be due to insufficient entropy in the policy"; this "could potentially be addressed" by, e.g., conditioning the model on RM-rejected steps (App. E).
  - Process-based approaches "require us to improve human understanding" to compete in general (§4.1.2).
- **Released:** Nothing stated.
- **To reuse it:** a 70B pretrained model (Tab. 1), qualified human annotators (App. B), 96 samples per problem and final answers comparable by exact string match (§2.5).
- **Beyond its domain:** the outcome/process spectrum "applies in general to supervising any sequence of actions" (§4.1.3, footnote 2).

## On this site

- **Discussed in:** [Comparing LLM methods under noise](#/challenges/method_comparison_under_noise) · [Weak checkers get exploited](#/challenges/weak_checker_exploitation)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/hacking-general">hacking-general</a><a class="tag sub" href="#/tags/judge-general">judge-general</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/rlvr-general">rlvr-general</a><a class="tag sub" href="#/tags/scaling-general">scaling-general</a></span>
