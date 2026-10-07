# Let's Verify Step by Step

**Let's Verify Step by Step** · preprint 2023

Read: [PDF](https://arxiv.org/pdf/2305.20050) · [arXiv](https://arxiv.org/abs/2305.20050)  
Code: [prm800k](https://github.com/openai/prm800k)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Process supervision (each step labeled) beats outcome supervision for reward models, on MATH (abstract).
- Releases PRM800K, the step-level labels.
- Step-level verifiers.

## In plain words

Even strong language models still make logical mistakes, and one wrong step can spoil a long solution (§1). A trained scorer can pick the best of many solutions, but the authors note the result "is only as reliable as the reward model itself" (§1). They compare two ways to train that scorer on hard math problems: label only whether the final answer is right, or have people label every step (abstract). The scorer only picks among samples; it never trains the solver (§2.1).

They report that the step-labelled scorer, picking among 1,860 solutions per problem from a solver fine-tuned from GPT-4, solves 78.2% of a 500-problem test subset, against 72.4% for the answer-labelled scorer and 69.6% for a majority vote (§1, §3). They also report that choosing which solutions get labelled makes step labels about 2.6 times as data-efficient, in a smaller setup labelled by the large scorer (§4.2). They present it as their own detailed comparison, with a more capable model, more human feedback and harder problems than earlier work (§1), and release the step labels (abstract).

## Background and terms

**Terms to know:** [outcome and process rewards](#/glossary/outcome-and-process-rewards) · [reward model](#/glossary/reward-model) · [best-of-N sampling](#/glossary/best-of-n-sampling) · [self-consistency (majority voting)](#/glossary/self-consistency-majority-voting) · [credit assignment problem](#/glossary/credit-assignment-problem) · [data contamination](#/glossary/data-contamination) · [reinforcement learning](#/glossary/reinforcement-learning) · [active learning](#/glossary/active-learning) · [out-of-distribution (OOD) generalization](#/glossary/out-of-distribution-generalization)

**The paper's own terms:**
- **ORM / PRM**: outcome-supervised reward model, trained "using only the final result of the model's chain-of-thought"; process-supervised reward model, which receives "feedback for each step" (§1).
- **generator**: the one fixed model that produces all solutions at a model scale (§2.1).
- **best-of-N evaluation**: for each test problem the reward model picks its top-ranked solution among N, which is graded by its final answer; the score is the fraction correct (§2.1).
- **step labels**: people mark each step positive ("correct and reasonable"), negative ("incorrect or unreasonable") or neutral (§2.4; more detail in App. D).
- **PRM score of a solution**: "the probability that every step is correct under the PRM", computed as the product of the per-step probabilities (§2.6), with neutral steps counted as positive (App. F.2).
- **false positives**: "solutions that reach the correct answer with incorrect reasoning", which automatic final-answer grading misgrades (§2.5).
- **convincing wrong-answer solutions**: solutions the current best PRM rates highly but whose final answer is wrong; these are the ones shown to labellers (§2.4).
- **PRM_large / PRM_selector**: the large-scale PRM, used in §4 as a stand-in for human labellers of smaller models (§4); and a small PRM trained on one sample per problem, used to pick which samples get labelled (§4.2).
- **alignment tax**: the cost when "safer methods for AI systems can lead to reduced performance" (§6.2).

**Other names:** MATH, a dataset of math problems whose answers can all be checked automatically (§2), "significantly more challenging than GSM8K", grade-school word problems (§7.1); GPT-4, OpenAI's model, used as a base pretrained "solely to predict the next token" (§2.2); MathMix, the authors' math-text mix used as an extra pretraining step (§2.2; App. A).

**Builds on:**
- [process- vs outcome-based feedback](#/papers/uesato2022process "Solving math word problems with process- and outcome-based feedback (2022)"), which describes outcome and process supervision and "found that outcome supervision and process supervision led to similar final performance in the domain of grade school math" (§1).
- [GSM8K and trained verifiers](#/papers/cobbe2021verifiers "Training Verifiers to Solve Math Word Problems (2021)"): ORMs are trained "following a similar methodology" (§2.5; App. E).
- Majority voting, "known to be a strong baseline" (§3), from [Self-Consistency](#/papers/wang2022selfconsistency "Self-Consistency Improves Chain of Thought Reasoning in Language Models (2023)") and Minerva (Lewkowycz et al., fine-tuned on technical text; not listed here), whose math data MathMix resembles (App. A).
- Gao et al. 2022 (not listed here), who also "use a large reward model to supervise the training of smaller models" (§7.2).

## Problem and setting

- **Question:** which supervision, outcome or process, trains more reliable reward models, given costly human feedback (abstract)?
- **Scope:** "outcome and process supervision" here means the supervision given to the reward model; the generator is never trained with RL, which is "intentionally not the focus of this work" (§2.1).
- **Two regimes** (§2): large-scale, fine-tuned from GPT-4; small-scale, models "pretrained with roughly 200 times less compute" (§2.2), supervised by PRM_large instead of people.
- **Test set:** 500 MATH test problems picked uniformly at random; the other 4.5K test problems went into PRM800K's training set "to minimize overfitting" (§2.4; App. C).

## Approach

- **Generator:** few-shot solutions to MATH training problems, filtered to correct final answers, fine-tune the base model for one epoch so it writes one step per line; this is "intended only to teach the generator to produce solutions in the desired format" (§2.3).
- **Data collection (PRM800K):** labellers rate the steps of solutions from the large-scale generator (§2.4). Phase 1 labelled alternative completions at each step; phase 2, most of the data, ran in 10 generations, each surfacing the current PRM's highest-scoring wrong-answer solutions, with the PRM retrained between generations (App. B). The release holds 1,085,590 step labels over 101,599 solutions; training used a filtered set of "about 800,000" labels over 75,000 solutions (App. B).
- **PRM:** a language model trained to predict one label token after each step, so one forward pass scores every step. Supervision stops at the first wrong step, so for incorrect solutions it adds only the location of the first mistake (§2.6).
- **ORM:** at large scale, trained on 100 uniform samples per problem graded by final answer; its score is the prediction at the final token (§2.5; §3).
- **Large-scale comparison:** the two training sets differ, since PRM800K is chosen by active learning, biased toward wrong answers and "an order of magnitude smaller" (§3; §4).
- **Small-scale comparison (§4.1):** on identical sampled datasets of 1–200 solutions per problem, three supervision forms: process labels from PRM_large, outcome labels from PRM_large (a solution is correct only if PRM_large gives no step over 20% probability of being negative), and final-answer checking (§4.1; App. H).
- **Active learning ablation (§4.2):** PRM_selector scores 1,000 samples per problem; of those picked, 80% are its most convincing wrong-answer samples and 20% the most convincing of the rest; PRM_large labels them.

## Results

- **Large-scale, MATH (§3, Fig. 3):** best-of-1860, the authors report 78.2% for the PRM, 72.4% for the ORM and 69.6% for majority voting; they say the PRM is higher "for all values of N" and the gap "widens as N increases".
- **Small-scale (§4.1, Fig. 4):** they report that process supervision "significantly outperforms both forms of outcome supervision at all data collection scales" (Fig. 4a, best-of-500), and that outcome labels from PRM_large are "noticeably more effective than final-answer checking" (Fig. 4b), which they explain by better supervision of correct answers reached by incorrect reasoning.
- **Large PRM as labeller (§1):** the authors claim "a large reward model can reliably approximate human supervision for smaller reward models".
- **Active learning (§4.2):** "approximately 2.6x more data efficient than uniform data labelling", estimated from the slopes of the lines of best fit in Fig. 4a.
- **OOD (§5, Tab. 1):** best-of-100 on the most recent AP exams (US high-school Advanced Placement) in calculus, chemistry and physics, and AMC10/12 (US math competitions), 234 problems in Tab. 1; aggregate 72.9% for the PRM against 63.8% for the ORM and 61.3% for majority vote; they conclude the PRM "can tolerate a modest amount of distribution shift".
- **Scoring choices (App. F.2, Tab. 4):** product or minimum over steps, neutral as positive or negative; "the difference in performance between all strategies is minor".
- **Alignment (§6.2):** "Our results show that process supervision in fact incurs a negative alignment tax".

## Limits the authors state

- The large-scale training sets "are not directly comparable", so these models "are therefore not ideal for making an apples-to-apples comparison" (§2; §3).
- Final-answer grading "occasionally leads to misgraded solutions" (§2.4) and gives positive labels to spurious solutions, which "could damage ORM performance, an effect we may or may not want to attribute to outcome supervision more generally" (§4).
- Which outcome baseline is more appropriate "is not clear"; they prefer PRM_large's outcome labels "but we encourage the reader to draw their own conclusions" (§4.1).
- At-scale ablations of the data-collection choices were not feasible (§2.4).
- The 200-sample active-learning model "appears to slightly underperform the expected trend line" (§4.2).
- Contamination: some MATH test problems likely appear in pretraining data; "it is still possible that some degree of contamination has slightly inflated our performance", though they "would expect any contamination to manifest similarly across all methods" (§6.3; App. A).
- Most MATH problems have easy-to-check final answers; the authors "expect this to not remain true in more complex domains" (§2.6).
- The product score "does create a slight bias against solutions with a larger number of steps" (App. F.2).

## Open problems and building blocks

  - Fine-tuning the generator with RL, "a natural next step" (§2.1).
  - Iterative retraining of PRM_selector, which showed "instability in this process which we were unable to diagnose", is "a compelling direction for future research" (§4.2).
  - Generalizing beyond math, which is "unknown" (§6.2), and "the extent to which these methods generalize" (§8).
  - "how many distinct training problems are actually necessary, and how quickly our methods overfit to the training set" (App. C).
- **Released:** PRM800K, the step-level labels (abstract; §1; §8; App. B); the 500-problem test set (App. C); the full labelling instructions (App. D).
- **To reuse it:** human step labels, since "there is no simple way to automate process supervision" (§2); solutions in a "newline delimited step-by-step format" (§2.3); the PRM "can therefore be trained in a standard language model pipeline without any special accommodations" (§2.6). The authors say their small-scale results "suggest that large-scale models are not necessary to observe benefits from process supervision" (§7.1).

## On this site

- **Discussed in:** [Weak checkers get exploited](#/challenges/weak_checker_exploitation)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/hacking-general">hacking-general</a><a class="tag sub" href="#/tags/judge-general">judge-general</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/scaling-general">scaling-general</a></span>
