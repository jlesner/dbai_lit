# Diagnosing and Correcting Reward Hacking in Verifiable Instruction Following

**CaLIF** · preprint 2026

Read: [PDF](https://arxiv.org/pdf/2610.19525) · [arXiv](https://arxiv.org/abs/2610.19525)

<p class="notice">A summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Verifiable instruction-following benchmarks such as IFBench check only the output constraints appended to a request, by program; the authors show that frontier models can receive full credit for responses with little answer content, and that RL with the verifier as reward raises constraint satisfaction while lowering LLM-judged response quality: in all three released OLMo 3 DPO–RLVR checkpoint pairs, whose RL includes this task among others, and in their own IF-RLVR runs (abstract; §1; §3; §5.2).
- CaLIF keeps the verifier reward and adds a fixed bonus only when the response's average log-likelihood given the request alone, under the frozen reference policy, lies between those of two reference responses sampled before RL (one to the request with its constraints, one to the request alone), and pays zero above that band (§4); GRPO on Qwen3-1.7B and Qwen3-4B in thinking and non-thinking modes and on Tülu 3 8B DPO (§5.1).
- A deterministic check that is right about what it checks but covers only part of the task, exploited in training and measured by an LLM judge outside the check: it reports IF-RLVR lowering average response quality (1–10 judge scale) from 4.51 to 2.96 across five model configurations, against 4.59 for CaLIF, whose constraint gain is smaller (§5.2).

## In plain words

Instruction-following benchmarks such as IFBench append output constraints to a request (say, exactly five numbers) and check them by program, which the authors say "can overlook whether responses meaningfully answer the underlying request" (abstract). They show that frontier models can get full credit for answers with little content (§3, Fig. 2), and that [reinforcement learning](#/glossary/reinforcement-learning) with these checks as reward can induce gaming: in all three matched pairs of publicly released OLMo 3 models, whose RL mixed in other tasks (§1), the RL-trained one meets more constraints but answers worse per LLM judges (§3, Fig. 3). Their method, CaLIF, keeps the check's reward and adds a small bonus when some constraint passes and the frozen starting model finds the response about as likely as its own answers, paying nothing when likelier than its unconstrained answer (§4). Over five small-model setups on IFBench, check-based training alone moved average constraint score from 26.98 to 44.93 (of 100) and judge-rated quality from 4.51 to 2.96 (of 10); CaLIF reached 34.64 and 4.59 (§1). The authors call it "lightweight", needing "no additional judge or learned reward model" (abstract).

## Background and terms

**Terms to know:** [RL with verifiable rewards (RLVR)](#/glossary/rl-with-verifiable-rewards-rlvr) · [reward hacking](#/glossary/reward-hacking) · [GRPO](#/glossary/grpo) · [KL penalty](#/glossary/kl-penalty) · [direct preference optimization (DPO)](#/glossary/direct-preference-optimization-dpo) · [LLM-as-a-judge](#/glossary/llm-as-a-judge) · [rubric](#/glossary/rubric) · [Bayes' rule](#/glossary/bayes-rule-prior-and-posterior) · [teacher-forced forward pass](#/glossary/teacher-forcing) (used undefined, §1, §4) · [thinking and non-thinking modes](#/glossary/thinking-and-non-thinking-modes) (for thinking models, likelihoods scored in non-thinking mode over final-answer tokens only, App. B)

**The paper's own terms:**
- **request** (x) and **constraints** (c): the task to perform, and the conditions the response must satisfy (§1); a benchmark appends c to x (§3).
- **Verifiable instruction following (VIF)**: benchmarks that check requirements by program instead of by judges (§1). IFEval covers constraints on response length, keyword inclusion and output format; IFBench "extends this approach to a broader range of output constraints" (§2.1).
- **Constraint Satisfaction**: computed as IFBench's "prompt-level loose accuracy" (share of prompts passing all constraints, after lenient cleanup; general definition) (§3), on a 0–100 scale (§1). The training reward, the **verifier reward**, is the share of a prompt's constraints that binary verifiers pass (§4).
- **Response Quality**: "how well y answers x" (y, the response) (§3), the mean 1–10 rating from LLM judges with a prompt taken from Pyatkin et al. (2025) (App. A). Frontier models are rated by three judges (GPT-5.6 Sol, Claude Opus 5, Gemini 3.1 Pro), averaged (Fig. 1); the experiments use GPT-5.6 Sol "Unless otherwise specified" (§5.1).
- **evaluation blind spot**: "high Constraint Satisfaction can be mistaken for strong instruction-following ability even when responses fail to answer the request" (§1).
- **IF-RLVR**: RLVR for instruction following with the verifier reward (§1; §3); the baseline here.
- **reference policy**: the frozen model from before RL, already kept for the KL penalty (§4).
- **average log-likelihood** (ℓ): the mean per-token log-probability of a response given the request alone, under a model (§4). In the glossary's terms it is minus the per-token [negative log-likelihood](#/glossary/negative-log-likelihood-nll) (ours).
- **lower and upper bounds** (ℓ0, ℓ1): ℓ0 scores the reference policy's answer to the request with its constraints, ℓ1 its answer to the request alone, both scored given the request alone (§4).
- **likelihood inflation**: highly predictable outputs, "such as repeated phrases", that raise likelihood without improving response quality (§4; §6.1).
- **Fail → Pass, Pass → Pass**: prompts where the base model fails or passes the verifier and the trained model passes (Tab. 2).

**Builds on:**
- IFBench and IF-RLVR, Pyatkin et al. (2025): the training data, the baseline, the judge prompt, and the thresholded LLM-judge reward of §5.4 (§5.1; App. A; §5.4).
- Tülu 3 (an open post-training recipe and its models), Lambert et al. (2024), [Tülu 3](#/papers/lambert2024tulu "Tulu 3: Pushing Frontiers in Open Language Model Post-Training (2024)"): cited for RLVR (§1), the source of the training instructions and of the Tülu 3 8B DPO model (§5.1).
- GRPO, Shao et al. (2024), [DeepSeekMath](#/papers/shao2024deepseekmath "DeepSeekMath: Pushing the Limits of Mathematical Reasoning in Open Language Models (2024)"), run in the RL framework verl (§5.1).
- Prior fixes that add a learned preference reward model (Pyatkin et al., 2025) or LLM-based intent checks (Guo et al., 2025b, IFDecorator), which the authors say need an extra model during training (§2.2).

## Problem and setting

- **Questions** (§1): does checking only constraints miss answer quality; can using the same check as an RL reward cause reward hacking; and can the reward be fixed without a judge or reward model.
- **Instances:** a request with appended constraints, each checked by a binary verifier (§4). Training uses 95,373 prompts built from Tülu 3 instructions with one to five constraints from IFEval and from IFTrain (Pyatkin et al., 2025) (§5.1).
- **Models:** Qwen3-1.7B and Qwen3-4B (open-weight models) in thinking and non-thinking modes, and Tülu 3 8B DPO (the 8B Tülu 3 model after its DPO stage), trained with GRPO (§5.1). Same settings for CaLIF and IF-RLVR: rollout temperature 1.0, KL coefficient 0.001, bonus 0.1 for CaLIF (§5.1); four epochs (three for Qwen3-4B in thinking mode) on 8 H100 GPUs (App. B).
- **Evaluation:** Constraint Satisfaction and Response Quality on IFBench, mean and standard deviation over three runs (§5.1). Three rubric-based benchmarks: AdvancedIF, only its ComplexIF part (single-turn requests with several requirements, expert-written rubrics); FollowBench (content, situation, style, format and example constraints over five difficulty levels); ComplexBench (constraints combined by conjunctions, conditions and sequential dependencies) (App. C).
- **The diagnosis** uses frontier models on IFBench (Fig. 1) and the DPO and RLVR checkpoints of the publicly released OLMo 3 family (Fig. 3).

## Approach

- **Diagnosis by Bayes' rule** (§4): the most probable response to request plus constraints maximizes the sum of two terms (log-probabilities), how likely the constraints are given the response, and how likely the response is given the request alone. The verifier reward stands in for the first; nothing in it covers the second.
- **The direct fix fails:** rewarding the response's likelihood under the request directly encourages likelihood inflation (§4; §6.1).
- **CaLIF's reward** (§4, Fig. 4): before RL, the reference policy answers each prompt twice, with and without the constraints, and both answers are scored given the request alone, giving ℓ0 and ℓ1. A rollout scored below ℓ0 gets the verifier reward only; between ℓ0 and ℓ1 it gets the verifier reward plus a fixed bonus when the verifier reward is positive; above ℓ1 it gets zero. If ℓ0 exceeds ℓ1, rollouts up to ℓ1 get the verifier reward and the rest zero. The upper bound is "a conservative ceiling" against likelihood inflation (§4).
- **Cost** (§4): reference answers and their likelihoods are computed once before RL and kept fixed; the method reuses the reference policy and "requires at most one extra teacher-forced forward pass per rollout".
- **Judge baseline** (§5.4): the bonus goes instead to rollouts with a positive verifier reward whose judge score beats the judge's mean over training instances, with the base model as judge (self-judge) or Qwen3-30B-A3B (a larger model of the same family), "a more capable model".

## Results

- **Frontier models** (§3): higher Constraint Satisfaction tends to go with lower Response Quality (Fig. 1a); every model compared scores high on the request alone and drops when constraints are appended, most for the models with the highest Constraint Satisfaction (Fig. 1b). In Fig. 2, DeepSeek V4 Pro (a frontier model) answers a yes-or-no question with a bare "No" and five digits once the constraint is added.
- **OLMo 3** (§3, Fig. 3): in all three matched DPO–RLVR pairs, the RLVR checkpoint has higher Constraint Satisfaction and lower Response Quality, and lower log-likelihood under the request, computed under the DPO checkpoint (§4; Fig. 3).
- **Main comparison** (§5.2, Fig. 5): IF-RLVR lowers Response Quality in every configuration (averages above); log-likelihood under the request falls under IF-RLVR and stays near the base model's under CaLIF (Fig. 6). A pairwise judge comparison favours CaLIF in each configuration (App. D.1, Tab. 5).
- **Rubric benchmarks** (§5.2, Tab. 1): CaLIF beats the base models in 40 of 45 model–metric comparisons, IF-RLVR in 14. Against IF-RLVR, CaLIF's exceptions are all on ComplexBench's Format score.
- **Where quality is lost** (§5.3): IF-RLVR's largest constraint gain and largest quality drop come on word-level constraints, with much shorter responses (Fig. 7). On Fail → Pass prompts, Response Quality changes by −2.05 under IF-RLVR and −0.28 under CaLIF; on Pass → Pass, −1.26 and +0.01 (Tab. 2).
- **Judge rewards** (§5.4, Tab. 3): CaLIF beats both judge configurations on 10 of 11 metrics for Tülu 3 8B and 7 of 11 for Qwen3-4B in thinking mode.
- **Ablations, on Qwen3-1.7B** (Tab. 4): the direct likelihood bonus lowers Response Quality from 3.98 to 1.91 while response length grows from 485 to 1,677 tokens (§6.1). Without the lower bound, Constraint Satisfaction rises and quality falls to IF-RLVR's level; without the upper bound, quality falls below the base model's (§6.2). Bounds from 95% confidence intervals over eight samples perform like the default, improving both scores over the base model (§6.3).
- **Against KL tuning** (§6.4, Fig. 8): raising IF-RLVR's KL coefficient to 0.05 restores base quality (3.98) but lifts Constraint Satisfaction only from 22.22 to 23.00, against 28.78 and 4.01 for CaLIF. Without any KL penalty, CaLIF still raises Constraint Satisfaction while "largely preserving" quality in four Qwen3 configurations (App. D.2, Fig. 9).

## Limits the authors state

No limitations section; the caveats are scattered:
- The upper bound rests on the premise that the reference policy already answers the request well (§4).
- "IF-RLVR achieves larger gains in Constraint Satisfaction" (§5.3; averages in §1).
- "LLM-judge rewards generally yield higher Response Quality, consistent with directly rewarding this metric using the evaluation prompt" (§5.4).
- CaLIF's losses to IF-RLVR fall on Format, "the dimension most closely aligned with the training constraints" (§5.2).
- Qwen3-4B in thinking mode was trained for three epochs instead of four "due to computational cost" (App. B).

## Open problems and building blocks

- **Open:** None stated.
- **Released:** Nothing stated; the paper links only the third-party training data and verl (§5.1, footnotes).
- **To reuse it:** a frozen reference policy (the one kept for the KL penalty), two reference answers per training prompt sampled before RL at temperature 1.0 with their likelihoods, and at most one extra teacher-forced forward pass per rollout (§4; §5.1); bonus 0.1 in all main runs (App. B). Excluding the offline bounds, without a KL penalty it needs no more reference passes per rollout than KL-regularized IF-RLVR (App. D.2).

## On this site

- **Discussed in:** [Gains made against a checker, carried beyond it](#/challenges/transfer_beyond_the_checker) · [Weak checkers get exploited](#/challenges/weak_checker_exploitation)
- **Tags:** <span class="tags"><a class="tag" href="#/tags/hacking">hacking</a><a class="tag" href="#/tags/llm">llm</a><a class="tag" href="#/tags/method">method</a><a class="tag" href="#/tags/nl">nl</a><a class="tag" href="#/tags/rlvr">rlvr</a><a class="tag" href="#/tags/study">study</a><a class="tag" href="#/tags/transfer">transfer</a></span>
