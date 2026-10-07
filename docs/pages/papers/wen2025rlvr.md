# Reinforcement Learning with Verifiable Rewards Implicitly Incentivizes Correct Reasoning in Base LLMs

**Reinforcement Learning with Verifiable…** · preprint 2025

Read: [PDF](https://arxiv.org/pdf/2506.14245) · [arXiv](https://arxiv.org/abs/2506.14245)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Revisits pass@k for math and code, and introduces CoT-Pass@K, which also requires correct reasoning steps, judged by an LLM (DeepSeek-R1-0528-Qwen3-8B, §1, §3.1) (abstract).
- A theoretical account of why answer-only rewards can still favour correct reasoning (abstract); its monotonic-increase conclusion does not follow.
- A second independent dispute of [Does Reinforcement Learning Really…](#/papers/yue2025rlreasoning "Does Reinforcement Learning Really Incentivize Reasoning Capacity in LLMs Beyond the Base Model? (2025)") (§1, §2): it reports that RLVR extends the reasoning boundary in math (CoT-Pass@K, Qwen2.5-32B vs DAPO-Qwen-32B, Fig. 2) and in code (Pass@K, Fig. 3) (abstract, §3).

## In plain words

Rewarding only correct final answers improves some models' first-try accuracy, but an earlier study found that, given many tries, the base model catches up, and suggested that such training only makes the base model's existing answers easier to sample (§1). They argue that on math this test can mislead, because a base model can reach the right answer through wrong reasoning, "especially for hard mathematical questions where answers are simple and can be easily guessed after multiple attempts" (§1). They introduce "a novel evaluation metric" (abstract), CoT-Pass@K, which counts a try only when an LLM judge also accepts its reasoning; give a theorem on why answer-only rewards can favour correct reasoning; and study training and fine-tuning runs. They report that, judged this way, a 32B model trained with the open DAPO recipe stays ahead of its base model at every number of tries up to 1024 on two math-competition sets (§3.1), and that on code, checked by tests, a trained 7B model beats its starting model on most versions of a coding benchmark (§3.2).

## Background and terms

**Terms to know:** [RL with verifiable rewards](#/glossary/rl-with-verifiable-rewards-rlvr) · [reinforcement learning](#/glossary/reinforcement-learning) · [GRPO](#/glossary/grpo) · [pass@k](#/glossary/passk) · [LLM-as-a-judge](#/glossary/llm-as-a-judge) · [outcome and process rewards](#/glossary/outcome-and-process-rewards) · [Distillation into compact models](#/glossary/distillation) · [data contamination](#/glossary/data-contamination) · [policy gradient](#/glossary/policy-gradient)

**The paper's own terms:**
- **reasoning capability boundary**: what a model can solve given many tries, read off Pass@K or CoT-Pass@K at large K; extended when the trained model stays above the base model there (§1, §3).
- **CoT correctness**: the reasoning before the answer "expressing necessary and accurate logics that lead to the ground truth" (§4).
- **CoT-Pass@K**: Pass@K where a sample passes only when both its answer and its chain of thought (CoT) are correct (§1); estimated per prompt with the estimator of Chen et al. (2021), as Pass@K is (§5 "Key Indicators").
- **LLM-as-a-CoT-Judge**: the paper's name for judging CoT correctness with an LLM (§2, §3.1); here DeepSeek-R1-0528-Qwen3-8B, an 8B reasoning model, asked three times per CoT, with the verdicts combined as **any-correct** (at least one says correct), **all-correct** or **majority-correct** (§3.1, App. A.3).
- **p_c, α, β**: in §4, p_c is the probability of producing a correct CoT; α the chance of a correct answer after a correct CoT, β after an incorrect one.
- **Logic Prior**: the assumption α > β, "based on the belief that pre-trained LLMs have established strong knowledge and logic priors" (§4 "Assumptions", Eq. 4).
- **learnable group**: a group of sampled responses whose rewards are not all equal, so GRPO's advantage is defined (§4 "Assumptions").
- **P(CA), P(CC|CA)**: per training prompt, the fraction of its samples with a correct answer, and the fraction of those whose CoT is also correct (§5 "Key Indicators").
- **fully optimized** questions: the training questions of Fig. 4, for which §5 says P(CA) almost reaches 1 (§5 "Optimization Effects").

**Builds on:**
- [Does Reinforcement Learning Really…](#/papers/yue2025rlreasoning "Does Reinforcement Learning Really Incentivize Reasoning Capacity in LLMs Beyond the Base Model? (2025)"): the Pass@K study whose hypothesis the paper sets out to answer (§1, §2).
- GRPO ([DeepSeekMath](#/papers/shao2024deepseekmath "DeepSeekMath: Pushing the Limits of Mathematical Reasoning in Open Language Models (2024)")), which the paper says first noted Pass@1 gains without Pass@K gains (§1), and DeepSeek-R1 and R1-Zero ([DeepSeek-R1](#/papers/deepseek2025reasoning "DeepSeek-R1: Incentivizing Reasoning Capability in LLMs via Reinforcement Learning (2025)")), whose observations App. A.5 sets out to explain.
- DAPO (Yu et al. 2025, not listed here): an open GRPO-style recipe that trained the base model Qwen2.5-32B on 17k math problems into DAPO-Qwen-32B, the math model pair; §5 reproduces its training (§3.1, §5).
- AceReason-Nemotron (Chen et al. 2025b) and Skywork-OR1 (He et al. 2025), RL runs from the distilled model DeepSeek-R1-Distill-Qwen-7B; the paper extends AceReason's code experiments (§2, §3.2). §1 lists AceReason-Nemotron, [ProRL](#/papers/liu2025prorl "ProRL: Prolonged Reinforcement Learning Expands Reasoning Boundaries in Large Language Models (2025)") and Shojaee et al. as conflicting observations.

## Problem and setting

- **Question:** "should we accept the hypothesis as a fundamental limitation of RLVR or should we trust new empirical findings that challenge the hypothesis?" (§1).
- **Math:** Qwen2.5-32B against DAPO-Qwen-32B on AIME 2024 and 2025 (American Invitational Mathematics Examination problems), MATH-500 and AMC23 (competition math sets) and Minerva, which "contains numerous physics problems and free-form answers" (§3.1, App. A.2); App. A.4 adds Skywork-OR1-Math-7B against DeepSeek-R1-Distill-Qwen-7B on AIME.
- **Code:** AceReason-Nemotron-7B against DeepSeek-R1-Distill-Qwen-7B on six versions of LiveCodeBench and Skywork-OR1-7B on v6 only, a competitive-programming benchmark. Running the code "significantly" reduces "the likelihood of guessing", so the authors take Pass@K as reliable there (§3.2).
- **Correctness:** answers are "assumed to be verified programmatically" (§4); CoTs are judged by the LLM judge. K goes up to 1024 (§3.1).
- **Theory (§4):** one prompt, G sampled responses, a binary reward from the answer only, GRPO's group-normalized advantage (Eq. 2) and a policy-gradient update (Eq. 3); assumptions: the Logic Prior, a learnable group, and "a sufficiently large sampling number G".

## Approach

- **The judge (§3.1, App. A.3):** its prompt, printed in App. A.3, asks for a step-by-step check, a list of issues and a yes/no verdict. The authors say all-correct "mitigates false positives" and any-correct "reduces false negatives", their error rates decaying "exponentially" with the number of independent attempts (App. A.3). They manually inspect cases where Pass@K is small but CoT-Pass@K is zero (§3.1).
- **Theorem 1 (§4):** for any prompt that meets the assumptions (the Logic Prior, a learnable group, a large enough group), responses with a correct CoT have on average a positive GRPO advantage, and those with an incorrect CoT a negative one. The theorem then states that the update raises the probability of a correct CoT in the next round, so that it "increases monotonically". The proof (App. A.5) takes the large-group limit, where the two expected advantages are proportional to (1 − p_c) and to −p_c, each times α − β.
- **Discussion (§4, App. A.5):** the authors call the gap α − β "the driving factor" and say that as training progresses α increases and β decreases, widening it. When the Logic Prior fails, the authors suspect reinforced incorrect CoTs are "the root cause" of R1-Zero's poor readability and multi-lingual behavior. App. A.5 uses the theory to explain two DeepSeek-R1 observations.
- **Training dynamics (§5, App. A.6):** they reproduce DAPO's training, label training and test rollouts with the same judge, and track P(CA), P(CC|CA) and checkpoints' test scores.
- **CoT quality (§6):** they fine-tune Qwen2.5-32B with supervised fine-tuning (SFT) on the DAPO questions, with CoTs from the base model, from DAPO checkpoints, or from DAPO-Qwen-32B (split into CoTs the judge accepts or rejects), and use AIME scores as the proxy for the CoTs' quality.

## Results

- **Math (Fig. 2, §3.1):** the authors report that CoT-Pass@K on AIME 2024 and 2025 shows "a consistent and significant performance gap" for DAPO-Qwen-32B over Qwen2.5-32B "across all values of K (up to 1024)", most on AIME 2025, "possibly due to its complete absence of unintentional data contamination". They set this in "stark contrast" with Pass@K, where the base model "quickly catches up with and even surpasses" the trained model. On MATH-500 and AMC23 the effect seems "less pronounced"; on Minerva there is no improvement, "likely due to a train-test domain mismatch".
- **Code (Fig. 3, §3.2; Fig. 8, App. A.4):** AceReason-Nemotron-7B shows "clear Pass@K improvements" over its starting model "on most benchmark versions"; Skywork-OR1-7B shows a consistent gap on LiveCodeBench-v6, where only medium and hard problems separate the models at large K.
- **Distilled model, math (Fig. 9, App. A.4):** Skywork-OR1-Math-7B and DeepSeek-R1-Distill-Qwen-7B "do not have distinct Pass@K gaps for large K values", even by CoT-Pass@K.
- **Training (Fig. 4, §5):** on fully optimized questions P(CA) nears 1 while P(CC|CA) improves, which the authors say validates "the key perspective" of Theorem 1. After 400 steps the median P(CC|CA) is "around 0.7" (§5 "Limitations of DAPO").
- **Generalization (Fig. 5, §5; Fig. 10(c), App. A.6):** the authors report that checkpoints improve on both metrics "from the very beginning", and that CoT-Pass@K shows the boundary "enhanced since the beginning". They also offer "another interpretation": that the model has learned to produce more CoTs in which the judge "cannot identify any error" (§5). Their run reached "around 44%" Pass@1 against the "above 50%" DAPO reports (App. A.6).
- **SFT (Fig. 6, §6):** SFT on DAPO-Qwen-32B's CoTs matches its Pass@1; Pass@1 "generally improves" with the RL stage of the CoTs, whether or not they contain identifiable errors; SFT on base CoTs "begins to mitigate guessing". The authors conclude such CoTs "cannot be directly sampled from base LLMs".

## Limits the authors state

- "A key limitation of our study lies in the use of a LLM as the verifier for the correctness of reasoning CoTs" (§6 "Limitations"); the judge "is not infallible" (App. A.7).
- The theorem "only explains the optimization process of RLVR but provides no guarantee for its generalization. We merely observe the generalization empirically." (§6 "Limitations").
- The Logic Prior "may not always hold", so incorrect CoTs can be reinforced (§4 "Discussions on failure modes in GRPO").
- For MATH-500 and AMC23, simple problems and pre-training exposure are hard to tell apart "without knowing the exact training data used for Qwen2.5-32B" (§3.1).
- In math, RLVR on distilled models "seems to merely deliver sampling efficiency improvements" (App. A.4).
- Imperfect CoTs remain after DAPO that "we may not have a chance to mitigate" with answer correctness as the only reward (§5 "Limitations of DAPO"); improving P(CC|CA) "seems to be a slow and challenging process" (App. A.6).
- Their run "did not fully reproduce" DAPO's Pass@1 (App. A.6); in practice "it is often necessary to first fine-tune the base LLM" before RLVR (App. A.5).

## Open problems and building blocks

- **Open:** "the pressing need for the design of evaluation benchmarks to assess the reliability of emerging LLM verifiers" (§2); "light yet reliable CoT verifiers" and live benchmarks that evolve over time (App. A.7); "novel mechanisms to accelerate the improvement" of P(CC|CA) (App. A.6); new RLVR algorithms that "more directly incentivize correct reasoning paths" (App. A.7).
- **Released:** Nothing stated.
- **To reuse it:** the judge DeepSeek-R1-0528-Qwen3-8B with three calls per CoT (App. A.3), K up to 1024 (§3.1); the DAPO reproduction ran on 32 AMD MI300X GPUs "for over two weeks" (App. A.6).
- **Beyond its domain:** the authors argue that "the LLM-as-a-CoT-Judge paradigm could play a crucial role in more general reasoning tasks" (§2).

## On this site

- **Discussed in:** [Weak checkers get exploited](#/challenges/weak_checker_exploitation)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/rlvr-general">rlvr-general</a><a class="tag sub" href="#/tags/scaling-general">scaling-general</a></span>
