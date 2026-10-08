# Rate or Fate? RLV$^\varepsilon$R: Reinforcement Learning with Verifiable Noisy Rewards

**RLVεR ("Rate or Fate?")** · preprint 2026

Read: [PDF](https://arxiv.org/pdf/2601.04411) · [arXiv](https://arxiv.org/abs/2601.04411)  
Code: [Noisy-RL](https://github.com/cognichip/Noisy-RL)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Models GRPO under a verifier with false positives and false negatives as a multi-armed bandit over recurring "reasoning modes", which gives a replicator-style flow on the probability simplex (abstract; §2.1; §4; §5).
- The flow splits into competition among correct modes and a one-dimensional equation for the mass on incorrect modes, whose drift the authors derive to depend only on Youden's index J = TPR − FPR, with a phase transition at J = 0 that KL regularization turns into an interior equilibrium (abstract; §3; §6; §6.1). Tested with GRPO on Qwen2.5-3B, Python problems from OpenR1 and unit-test rewards flipped at set rates (§7.2).
- A threshold for how weak a checker may be before RLVR learns the wrong thing, beside the measurements of [An Imperfect Verifier is Good Enough](#/papers/plesner2026imperfect "An Imperfect Verifier is Good Enough: Learning with Noisy Rewards (2026)") and [When the Reward Suite Is Leaky](#/papers/zhang2026leaky "When the Reward Suite Is Leaky: A Preregistered Causal Contrast of Natural Verifier False Positives in RLVR (2026)"): the authors report that for J > 0 noise mainly rescales convergence time ("rate, not fate") and that their runs reproduce the predicted J = 0 boundary (abstract; §7.3, Tab. 1), on one model over two epochs (§7.3; §7.4). [Finding Blind Spots in…](#/papers/abrich2026blindspots "Finding Blind Spots in AppWorld and WorkArena Task Verifiers (2026)") cites it for checker errors entering training (§2; §6).

## In plain words

When LLMs are trained by reinforcement learning against an automatic checker, "the verifier is almost never clean" (abstract): e.g. unit tests probe few cases, LLM judges are noisy. They ask whether such errors only slow learning ("rate") or can change where training ends up ("fate") (abstract). They model training on one prompt as a choice among recurring kinds of answer, right or wrong, and analyze GRPO, which scores each answer relative to others for the same prompt (§2), in that model. There the direction depends only on the checker's acceptance rate on right answers minus that on wrong ones: above zero, wrong answers die out; at zero, no systematic change; below zero, they take over (abstract; §3). Above zero, noise "primarily rescales convergence time" (abstract). Training a 3-billion-parameter model on Python problems with test outcomes flipped at set rates, accuracy after two epochs rose for every setting above zero, barely moved at zero (+0.6%) and fell (−12.6%) at the one setting below zero (§7.3, Tab. 1). They present a "minimal and predictive framework" (§8), with no priority claim.

## Background and terms

**Terms to know:** [reinforcement learning](#/glossary/reinforcement-learning) · [RL with verifiable rewards (RLVR)](#/glossary/rl-with-verifiable-rewards-rlvr) · [GRPO](#/glossary/grpo) · [policy gradient](#/glossary/policy-gradient) · [multi-armed bandit](#/glossary/multi-armed-bandit-ucb) · [importance ratio and clipping](#/glossary/importance-ratio-and-clipping) · [KL penalty](#/glossary/kl-penalty) · [pass@k](#/glossary/passk)

**The paper's own terms:**
- **verifier, checker, oracle, grader**: interchangeable names for the source of a completion's 0/1 reward: a program, a "learned reward model" or an LLM judge (abstract; §2).
- **false-negative and false-positive rates (FNR, FPR)**: the chance a correct completion gets reward 0, and the chance an incorrect one gets reward 1 (Eq. 1, §1); TPR (true-positive rate) is one minus the FNR (§1, footnote 1).
- **reasoning mode (arm)**: a cluster of completions to one prompt, such as "canonical solution paths, recurring chains of thought, or standard solver templates"; K modes are correct, M incorrect (§4). (In the glossary's terms, no UCB-style exploration.)
- **bad mass**: the total probability on incorrect modes for a prompt; accuracy is one minus it (§4).
- **learning, neutral, anti-learning**: the regimes where J (below) is positive, zero or negative (§3); Fig. 1's caption says "unlearning" for the third.

**Missing glossary terms:**
- **Youden's index (J)**: TPR minus FPR, from −1 to 1; 1 is a perfect checker, 0 chance-level, below 0 "anti-informative" (Eq. 2, §1, citing Youden (1950)).
- **replicator dynamics**: from evolutionary game theory: a type's share grows or shrinks as its fitness is above or below the population average (§2.1, citing Cressman (2003)).
- **mean-field ODE**: a deterministic differential equation for the expected change of the probabilities in the small-step limit (§6; App. C.3).
- **phase transition**: a sudden qualitative change as one parameter crosses a critical value (§1).

**Builds on:**
- GRPO, from Shao et al. (2024) ([DeepSeekMath](#/papers/shao2024deepseekmath "DeepSeekMath: Pushing the Limits of Mathematical Reasoning in Open Language Models (2024)")), which the authors say makes the sequence-level bandit view of Kreutzer et al. (2017) and others explicit (§4).
- Chen et al. (2025), whose experiments, the authors say, show false-positive/false-negative imbalances can induce "severe mode collapse" (collapse onto a narrow subset of outputs), and Cai et al. (2025), complementary theory on noisy verifiers (§1).
- Bae et al. (2025) and Foster et al. (2025) on learnability at intermediate difficulty (§3.3); Mroueh (2025) on noise-free GRPO with KL anchoring (§6.1).

## Problem and setting

- **Question:** "does the verification noise merely slow down the learning (rate), or can it flip the outcome (fate)?" (abstract; sub-questions in §1).
- **Noise model:** one binary reward per completion, flipped at one rate for all correct and another for all incorrect completions (Eq. 1, §1); the rates "in general can be time dependent" (§1). Correctness is an oracle's verdict, in the experiments the dataset's "public and hidden test cases" (§7.2).
- **Policy model:** one fixed prompt; completions, finite through a length cap, are grouped into modes; mode-level statements, the authors state, "remain invariant to the specific choice of a reasonable" grouping (§4; App. A).
- **Assumptions:** advantages z-scored with the reward's mean and standard deviation at the current bad mass (§2.2; App. B); for Theorem 6.1 (§6) a step size much smaller than the clip thresholds and "fresh on-policy groups", each newly sampled from the current model (§2); for Theorem E.1 a "block-symmetric structure", one advantage for all correct modes and one for all incorrect modes (App. E).
- **Experiments (§7.2; App. L):** Qwen2.5-3B (a 3-billion-parameter open base LLM); 10,239 training and 594 validation Python problems, a filtered subset of OpenR1 (Hugging Face's open DeepSeek-R1 reproduction); GRPO in the VeRL training library, 8 rollouts per prompt, KL coefficient 0; two epochs (1,410 steps); five seeds; J from −0.1 to 1, with several (TPR, FPR) splits; greedy evaluation.

## Approach

- **Two-outcome law (§2.1–2.2).** With one right and one wrong outcome, GRPO's expected update shrinks the bad mass whenever right answers get a higher expected normalized advantage (Eq. 4), a replicator form: "GRPO is like a natural selection". With noise, that gap is J over the reward's standard deviation (Eq. 5): J is "a signed coefficient of friction for learning".
- **Phase transition (§3–3.1).** In the two-outcome model, for J > 0 every mixed start ends at all-correct; for J < 0, at all-wrong; at J = 0 every point is fixed (Eq. 6; §3.1). Late in training the error falls like 1/t when the reward still varies at the end state, like 1/t² when no correct answer is rejected and J > 0 (§3.1). A prompt with zero initial chance of a correct answer stays unsolved, so RLVR "cannot reliably expand capability beyond its initial support", consistent, they say, with Yue et al. (2025) ([Does Reinforcement Learning Really…](#/papers/yue2025rlreasoning "Does Reinforcement Learning Really Incentivize Reasoning Capacity in LLMs Beyond the Base Model? (2025)")) (§3.1).
- **Rate, not fate (§3.2).** For J > 0, noisy and clean training reach the same end state (a "single basin of attraction"), so noise only rescales time (Eq. 9): at J = 0.5 the noisy system needs "roughly twice compute steps".
- **Learnability (§3.3; App. D).** With a clean checker the per-step drop in bad mass peaks at bad mass one half, and under asymmetric noise at another intermediate value.
- **Simplex flow (§5).** On the simplex (all probability distributions over the modes), the flow splits into bad mass and the shares within each block, correct or incorrect (§5.1). For J > 0 the initially most likely correct mode wins ("winner-take-all", Fig. 2; Thm. I.11, for starts without ties), while incorrect modes spread toward uniform (§5.1). Finite groups add fluctuations ("genetic drift", §5.3).
- **Theorem 6.1 (§6).** For GRPO with a step size much smaller than the clip thresholds and fresh on-policy groups, the expected change in bad mass is the §3 equation times a geometry factor measuring how concentrated probability is within each block (between 1/K + 1/M and 2; App. E), plus a remainder of order step size squared; so bad mass decreases monotonically toward 0 for J > 0, increases toward 1 for J < 0, and has no drift at this order at J = 0. There, with fixed thresholds, importance sampling and clipping "do not alter the leading-order mean-field drift" (§6; App. F).
- **Theorem E.1 (App. E).** For the GRPO mean-field flow under block symmetry, from any start with mass on both correct and incorrect modes and J ≠ 0, the correct modes' total moves with the sign of J.
- **KL (§6.1; App. G).** With a two-class KL penalty toward a reference bad mass, for any positive strength and fixed within-block shares there is exactly one equilibrium strictly between 0 and 1, reached from every start in that range (Thm. G.6): below the reference for J > 0, at it for J = 0, above it for J < 0 (§6.1). For J < 0 long-run accuracy stays strictly positive (Cor. G.7), though as the penalty vanishes the equilibrium "may drift arbitrarily close to the bad vertex" (all wrong).

## Results

- **Phase transition (§7.3, Tab. 1).** Validation E[pass@1] after two epochs at J = 1, 0.7, 0, −0.1: 20.8%, 18.6%, 13.4%, 0.16%; "Improvement from the Base model": +8.0%, +5.8%, +0.6%, −12.6%. The authors read "a sharp qualitative boundary" at J = 0, stronger signal giving "faster convergence and higher final accuracy" (§7.3).
- **Rate, not fate (§7.3; Fig. 1).** All J > 0 curves rise, which the authors call consistent with one shared basin (§7.3). Fig. 1's caption says the sign-of-J transition "is mirrored on held-out validation prompts in this setup".
- **False positives vs. negatives (§7.3).** At J = 0.3, FPR 0 with FNR 0.7 reaches 15.98% against 14.64% for FPR 0.7 with FNR 0, "suggesting FNs are more tolerable than FPs in this regime"; §8: "empirically, high FPR is often more damaging than high FNR".

## Limits the authors state

- "Our experiments are limited to 1410 steps (two epochs), so we remain agnostic about the exact asymptotic behavior" (§7.3).
- The oracle is a finite test suite: "incomplete tests introduce systematic bias in estimated (TPR, FPR), particularly for edge cases" (§7.4).
- VeRL gives truncated rollouts reward zero, which "introduces systematic false negatives that can shift the effective J downward" and may explain some predicted-vs-observed asymmetry for J < 0 (§7.4).
- Only Python with Qwen2.5-3B; decay rates and noise tolerance "may vary with task complexity, model capacity, and verifier characteristics", and extensions to mathematical reasoning, LLM-judged creative writing and larger models are "important future directions" (§7.4).
- Fixed noise rates in the experiments; "a full investigation of these co-evolutionary dynamics is reserved for future work" (§7.4).

## Open problems and building blocks

- **Open:** the future directions are given with the limits above (§7.4).
- **Released:** a code repository, linked without description (title page).
- **To reuse it:** a wrapper that flips an oracle checker's verdict at set rates (App. M, Alg. 1); GRPO in VeRL with Tab. 4's configuration (App. L). No hardware or run time stated.
- **Beyond its domain:** the J = 0 transition "should generalize across domains and architectures" (§7.4); the framework offers "a general lens for analyzing RLVR stability, convergence, and algorithmic interventions" (abstract).

## On this site

- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/hacking-general">hacking-general</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/rlvr-general">rlvr-general</a></span>
