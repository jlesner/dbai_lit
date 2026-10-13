# Easy-to-Hard Generalization: Scalable Alignment Beyond Human Supervision

**Easy-to-Hard Generalization** · NeurIPS 2024

Read: [PDF](https://arxiv.org/pdf/2403.09472) · [arXiv](https://arxiv.org/abs/2403.09472)  
Code: [easy-to-hard](https://github.com/Edward-Sun/easy-to-hard)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Reward models trained only on MATH levels 1–3 (on final-answer labels, step labels from PRM800K or Math-Shepherd, or both) score solutions to levels 4–5; the authors report that these evaluators generalize from easy to hard better than the generators trained on the same easy data (§4.2.1), and that an easy-trained outcome reward model also helps on hard APPS coding problems (§4.3).
- The easy-trained evaluator re-ranks Llemma 7B and 34B samples (weighted voting, best-of-n) or adds its reward to RL (iterative DPO, PPO; ReST-EM runs use final-answer rewards only), with final-answer rewards on easy questions only (§3.4, §4.2.2, Tab. 2); adds OPRM, a reward model trained on both step and outcome labels (§3.3).
- Established evidence that a scorer learned where answers are known keeps some value where they are withheld; the hard problems keep answer keys used for testing, so each transfer claim is measured against a check (§3.1, §3.3).

## In plain words

Current alignment methods learn from human demonstrations or judgments, so, the authors argue, what models learn "would be upper-bounded by human capabilities" (abstract). They ask whether people can supervise only easy tasks and still get a model that does well on hard ones, and test it on competition math: problems of difficulty levels 1–3 come with solutions and answers, levels 4–5 with questions only (§3). Guided by the observation that "evaluation is easier than generation" (§1), they train a scorer of solutions on the easy problems and use it on hard ones, to pick among many sampled solutions or as the reward for [reinforcement learning](#/glossary/reinforcement-learning). They report that the scorers carry over to hard problems better than the solution writers do (§4.2.1). Their best 7-billion-parameter model, trained by reinforcement learning with step-level scores and easy-level supervision only, scores 34.0% on a 500-problem test set, against 33.0% for the best earlier one, trained on all levels (§4.2.2); a 34-billion model choosing among 1,024 samples reaches 52.5% (abstract; no comparison stated). They call it "a novel approach to scalable alignment" (abstract).

## Background and terms

**Terms to know:** [reward model](#/glossary/reward-model), [outcome and process rewards](#/glossary/outcome-and-process-rewards), [self-consistency (majority voting)](#/glossary/self-consistency-majority-voting) (with its weighted voting, §3.4), [best-of-N sampling](#/glossary/best-of-n-sampling), [reranking](#/glossary/reranking), [PPO](#/glossary/ppo), [direct preference optimization (DPO)](#/glossary/direct-preference-optimization-dpo), [weak-to-strong supervision](#/glossary/weak-to-strong-supervision), [scalable oversight](#/glossary/scalable-oversight) (§1, citing Bowman et al.; the paper calls its proposal "scalable alignment", abstract).

**The paper's own terms:**
- **easy-to-hard generalization**: limiting human supervision to easier tasks while the model is to excel on harder ones (§1); the abstract's example is learning from level 1–3 MATH (competition math in five difficulty levels) annotations to solve level 4–5 problems.
- **easy and hard tasks**: MATH levels 1–3, with problems, solution demonstrations and correct answers; levels 4–5, "represented solely by their questions" (§3).
- **generator** and **evaluator**: the policy model that writes solutions, and the reward model (RM) that scores them (§3.4).
- **Final-Answer Reward**: "a symbolic reward that provides a binary reward based on the accuracy of the model's final answer", matched after normalization (§3.3). Unlike it, reward models trained on easy tasks "can be applied to evaluate solutions to hard problems" (§3.3).
- **ORM, PRM, OPRM** (§3.3): the outcome reward model is trained on final-answer rewards to predict at every token whether the solution is correct, and its prediction at the final token is the score; the process reward model predicts whether each step (a line of the solution) is correct, labels "usually labeled by humans … or estimated with rollouts"; the Outcome & Process Reward Model, the authors' addition, is trained on the mixed data of both and judges each step and the final answer.
- **aggregation function**: how step scores become one solution score (App. L); the main experiments use the minimum for best-of-n and the product for weighted voting (§4.2.1).
- **ICL (in-context learning) and SFT (supervised fine-tuning) baselines** (§3.2): Full, Hard and Easy-to-Hard ICL prompt with examples from all levels, level 5, or easy levels; Full and Easy-to-Hard SFT fine-tune on all or easy data.
- **ReST-EM**: an [offline RL](#/glossary/online-and-offline-rl) (reinforcement learning) method that alternates sampling from the model and "RM-weighted SFT" on the samples; its variants include [expert iteration](#/glossary/expert-iteration) and [rejection sampling](#/glossary/rejection-sampling) fine-tuning (App. B).
- **RL training conditions** (§4.2.2): "Easy Questions & Easy Final Answers" samples only easy questions; "All Questions & Easy Final Answers" adds hard questions, "with rewards for hard tasks solely provided by the easy-to-hard evaluator".

**Missing glossary terms:** none.

**Builds on:**
- Lightman et al. (2023), [Let's Verify Step by Step](#/papers/lightman2023verify "Let's Verify Step by Step (2023)"): the PRM800K step labels, the MATH500 test set and process reward models (§3.1, §3.3).
- Uesato et al. (2022), [process- vs outcome-based feedback](#/papers/uesato2022process "Solving math word problems with process- and outcome-based feedback (2022)"): outcome- and process-supervised reward models and reward-weighted voting (§1, §3.3, §3.4).
- Wang et al. (2023), Math-Shepherd: automatically estimated step labels for MetaMath (ChatGPT-written math solutions), and the earlier RL result compared against (§3.1, Tab. 2).
- Burns et al. (2023) on weak-to-strong generalization and the concurrent Hase et al. (2024) ([The Unreasonable Effectiveness of…](#/papers/hase2024easydata "The Unreasonable Effectiveness of Easy Training Data for Hard Tasks (2024)")) on easy-to-hard generators: the settings it contrasts itself with (§1, §2.3, §3.5).

## Problem and setting

- **Question** (§1): "Can we limit human supervision to easier tasks, yet enable the model to excel in harder tasks?" Its research questions: how generators and evaluators generalize from easy to hard, and, if evaluators generalize better, how to use that for generators (§3).
- **Data** (§3, §3.1): MATH, 12,500 competition problems in five levels (roughly a 1:2:2:3:3 ratio). Test set: MATH500; validation: another 500 problems sampled "across all five difficulty levels"; training: the remaining 4,000 test-split problems plus the 7,500 training problems.
- **Simulated human demonstrations** (§3.1): MATH's solutions "typically skip many chain-of-thought steps", so SFT data is PRM800K (written by a base GPT-4 model, with human step labels) or MetaMath (written by ChatGPT, with Math-Shepherd's step labels), keeping MetaMath's GSM8K grade-school problems, "typically easier" than MATH's.
- The authors "assume that human supervision is of high quality on the easy tasks in general" (§1, footnote).
- **Correctness**: final answers matched after normalization by PRM800K's grader (§3.3, footnote).
- **Models** (§3.6): Llemma 7b and 34b, math models continued from Code Llama and Llama 2, fully fine-tuned; reward models start from the base model with a scalar output head; in PPO the [value model](#/glossary/value-function) starts from the reward model.
- **Checkpoints**: all RL methods select their best checkpoint by validation accuracy (§4.2.2).
- **Metric** (§3.5): mainly absolute and relative accuracy on MATH500, not a gap-recovery ratio (how much of full supervision's gain the weaker supervision recovers) as in Burns et al. or Hase et al., because models trained only on easier tasks "sometimes", "particularly when employing RL training", beat those trained on all levels.
- **Code** (§4.3): 500 sampled test questions of APPS (programming problems graded Introductory, Interview or Competition); easy means Introductory; Code Llama (code models) 7b and 34b, with an ORM of the same size.

## Approach

- **Train on easy data only** (§3.2–3.3, Fig. 3): the SFT generator and reward models.
- **Re-rank** (§3.4, §4.2.1): sample many solutions per problem, then pick the highest-scored one (best-of-n) or vote with each solution weighted by its score (weighted voting).
- **RL** (§3.4, App. B, App. C.3): ReST-EM; iterative DPO (repeated rounds of fresh sampling and DPO training), with preference pairs scored by a PRM plus a 0/1 final-answer reward; and PPO, 500 steps. Only "vanilla PRMs" are used in RL, for a fair comparison of the two datasets (§4.2.2).
- No theorems.

## Results

- **Generators** (§4.1, Tab. 1): SFT beats ICL, and ICL varies more with data order. Easy-to-hard gaps are very small for PRM800K-trained models, or "even inverted in the ICL setting", and larger with MetaMath; the best is full SFT on MetaMath, 35.4 against 32.2 for its easy-to-hard counterpart (Llemma-34b, greedy decoding).
- **Evaluators by re-ranking** (§4.2.1, Fig. 4–5; App. G):
  - OPRMs outperform ORMs and PRMs on PRM800K; follow-ups on MetaMath/Math-Shepherd "do not demonstrate significant improvements from incorporating additional ORM training examples".
  - Weighted voting beats best-of-n, unlike in earlier work. Weighted voting "consistently surpasses majority voting", more so on harder tasks, from which the authors conclude that "evaluators demonstrate better easy-to-hard generalization capabilities in comparison to generators".
  - A 34b evaluator "can significantly improve" a 7b generator, and a 7b evaluator "can still improve" a 34b generator (Fig. 5).
- **RL** (§4.2.2, Tab. 2):
  - On PRM800K, PPO on all questions with PRM rewards raises the easy-trained SFT model from 12.2 to 14.9 on hard problems and from 19.8 to 29.4 overall; PPO is the most effective method there.
  - On MetaMath, PPO and DPO lead and ReST improves the SFT baseline only marginally; the authors read DPO as on par with PPO given a high-quality SFT model, and PPO as less dependent on SFT quality.
  - "PRM rewards are more beneficial than Final-Answer rewards for hard tasks": PRM-rewarded models with easy-only supervision (34.0) outperform the previous state of the art trained on all levels (33.0).
  - The full table (Tab. 5) adds runs on hard questions only, which do worse (App. J), and runs also given hard final answers (marked †, "not strictly a easy-to-hard generalization setup").
- **Code** (§4.3, Tab. 3): for Code Llama-34b, best-of-16 with the easy-trained ORM reaches 26.6 average accuracy (the mean share of test cases passed; general definition) over all levels, against 20.1 for greedy decoding after easy-only SFT and 21.7 after full SFT.
- **Analyses** (appendix): SFT on easy only or hard only both fall short of full SFT overall, though full SFT is weaker on hard questions alone; the authors read this as "language models face difficulties in generalizing in both directions" (App. J, Tab. 9). The ORM "has higher agreement with the PRM, despite being trained to predict the Final-Answer rewards" (App. K, Fig. 15).

## Limits the authors state

- "These include the focus on specific model sizes and datasets, the domain specificity of reasoning tasks, and the need for further research on the long-term implications and robustness of the method." (§5)
- OPRMs bring no significant gain on MetaMath/Math-Shepherd, which "may be attributed to the fact that Math-Shepherd is already generated from final-answer rewards" (§4.2.1).
- Best-of-n trails weighted voting; their hypothesis is that a less powerful base model on harder tasks "might diminish the effectiveness of the reward model, potentially leading to an over-optimization of rewards" ([reward model overoptimization](#/glossary/reward-model-overoptimization); §4.2.1).
- "a stronger ability to distinguish steps does not necessarily indicate that the evaluator is more helpful for generation" (App. Q).
- Pass@N stays below 100% "even with a larger N", and the larger model's Pass@1 advantage "diminishes on metrics like Pass@1024" (App. O; [pass@k](#/glossary/passk)).
- ICL "has larger variance than SFT with respect to data ordering (or random seeds)" (§4.1).
- The qualitative examples are "cherry-picked for better illustration" (Tab. 7).
- Operating beyond human supervision raises "concerns about the transparency, accountability, and potential misuse of such systems" (App. M).

## Open problems and building blocks

- **Open:** none stated, beyond the further research under Limits (§5).
- **Released:** the code, linked under the title (title page). Nothing else stated.
- **To reuse it:** Llemma 7b or 34b with full fine-tuning (§3.6); easy problems with step labels, from people (PRM800K) or estimated (Math-Shepherd) (§3.1); up to 1,024 samples per problem for re-ranking (Fig. 4); training settings in App. C. No hardware or run time stated.
- **Beyond its domain:** the APPS results "extend the premise of easy-to-hard generalization beyond the confines of mathematical reasoning, suggesting its applicability across diverse domains" (§4.3).

## On this site

- **Discussed in:** [Gains made against a checker, carried beyond it](#/challenges/transfer_beyond_the_checker)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/judge-general">judge-general</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/rlvr-general">rlvr-general</a><a class="tag sub" href="#/tags/scaling-general">scaling-general</a></span>
