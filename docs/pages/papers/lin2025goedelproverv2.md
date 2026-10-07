# Goedel-Prover-V2: Scaling Formal Theorem Proving with Scaffolded Data Synthesis and Self-Correction

**Goedel-Prover-V2** · preprint 2025

Read: [PDF](https://arxiv.org/pdf/2508.03613) · [arXiv](https://arxiv.org/abs/2508.03613)  
Code: [Goedel-Prover-V2](https://github.com/Goedel-LM/Goedel-Prover-V2)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Open Lean 4 prover models trained by expert iteration and RL (abstract).
- Synthetic tasks of rising difficulty, self-correction from Lean compiler feedback, and averaging of checkpoints (abstract).
- Compact models: the authors report their 8B model outperforming DeepSeek-Prover-V2-671B on MiniF2F at pass@32 (abstract).

## In plain words

LLMs can write proofs in Lean, a language in which a machine checks every proof, but the authors say recent successes "typically depend on massive models" or "computationally intensive inference" (§1). They train open prover models of 8 and 32 billion parameters that reason at length, write a whole proof and, in a self-correction mode, revise a failed proof using the checker's error messages. Training adds generated problems of rising difficulty, and merges model weights to counter a loss of output variety in later stages of training (abstract).

On MiniF2F, high-school competition problems, with 32 attempts per problem (solved if any attempt is accepted), they report 84.6% solved by the 8B model and 88.1% by the 32B model, or 90.4% with self-correction, against 82.4% for the 671-billion-parameter DeepSeek-Prover-V2 (abstract, §3.3). On PutnamBench, college competition problems, the 32B model with self-correction solves 86 problems at 184 attempts each, against DeepSeek-Prover-V2's 47 at 1,024 (abstract, §3.3). They claim a new state of the art, "securing the first place among open-source models on the leaderboard" (abstract).

## Background and terms

**Terms to know:** [proof assistant](#/glossary/proof-assistant) · [tactic](#/glossary/tactic) · [pass@k](#/glossary/passk) · [autoformalization](#/glossary/autoformalization) · [expert iteration](#/glossary/expert-iteration) · [reinforcement learning](#/glossary/reinforcement-learning) · [GRPO](#/glossary/grpo) · [KL penalty](#/glossary/kl-penalty) · [weight averaging](#/glossary/weight-averaging)

**The paper's own terms:**
- **whole-proof generation**: the model writes the complete Lean proof in one pass (§2.1), as opposed to **proof search**, which builds a proof step by step with checker feedback at each step, for example by tree search (§4).
- **verifier-guided self-correction**: after a failed attempt, "verification failures are parsed and communicated back into the model as corrective guidance" and the model writes a repair (§2.1); the earlier attempts' chain of thought stays in the input (§3.5).
- **standard mode** and **self-correction mode** (abstract, Tab. 3): standard mode is one whole-proof attempt of at most 30,000 tokens; self-correction mode adds 2 rounds of revision in sequence, with 40,000 tokens in total (§3.2).
- **pass@N**: pass@k with N attempts per problem, the "Budget" of Tab. 2 (§3.2).
- **scaffolded data synthesis**: generating training statements "at an appropriate difficulty level" (§1, §2.2).
- **extract_goal**: a Lean tactic the authors use "to capture the unsolved states of a proof" as standalone statements (§2.2).
- **negation**: the authors attempt to disprove unsolved statements by proving their logical negation, built by parsing the Lean statement (App. B).
- **model averaging** and **α**: the averaged model's weights are (1 − α) × base model + α × fine-tuned model, with α between 0 and 1 (§2.3).
- **MathOlympiadBench**: the authors' own benchmark of 360 human-verified Lean formalizations of olympiad problems (§3.1, App. A).

**Builds on:**
- DeepSeek-Prover-V2 ([DeepSeek-Prover-V2](#/papers/ren2025deepseekproverv2 "DeepSeek-Prover-V2: Advancing Formal Mathematical Reasoning via Reinforcement Learning for Subgoal Decomposition (2025)")): the "vanilla whole-proof generation" method self-correction is contrasted with (§2), source of the first fine-tuning proofs (§2.4), with Kimina-Prover (open Lean provers) the main baseline (Tab. 2).
- Repair from verifier feedback: Baldur ([Baldur](#/papers/first2023baldur "Baldur: Whole-Proof Generation and Repair with Large Language Models (2023)"), a whole-proof generator with a repair model fed the checker's error message) and repair work in coding, brought here to long chain-of-thought models (§1, §4).
- The "standard expert iteration and reinforcement learning pipeline" (abstract), with GRPO from DeepSeekMath ([DeepSeekMath](#/papers/shao2024deepseekmath "DeepSeekMath: Pushing the Limits of Mathematical Reasoning in Open Language Models (2024)")) changed after Dr.GRPO and DAPO, two later GRPO variants (§2.3).
- Model averaging after Wortsman et al. (2022, not listed here) (§1, §2.3).

## Problem and setting

- **Question:** can moderate-size open models prove competition theorems in Lean as well as far larger ones, with few attempts per problem (§1, §3.3)?
- **Language and checker:** Lean 4; evaluation runs "under Lean 4.9.0-rc1" (§3.2).
- **Benchmarks (§3.1):** the MiniF2F test split (244 problems from high-school competitions including the AMC and AIME, two US contests, and the IMO, the International Mathematical Olympiad), in Kimina's version with "some incorrect statements fixed"; PutnamBench, Putnam competition problems from 1962–2023, which §3.1 says has 644 problems; and MathOlympiadBench.
- **Statement quality:** the authors report that in existing Lean datasets such as Goedel-Pset-v1, human evaluation of a sampled subset shows many unsolved problems are incorrectly formalized (§2.2 "Formalizer Training"). An LLM judges whether a formal statement is faithful to the problem (prompt in App. C).

## Approach

- **Formalizer (§2.2 "Formalizer Training", Tab. 1).** Goedel-Formalizer-V2 turns natural-language problems into Lean statements; it is trained by expert iteration, keeping only outputs that pass a Lean syntax check and the LLM faithfulness check, starting from 50K statements with reasoning traces written by Claude Sonnet 4.
- **Formal-based scaffolded synthesis (§2.2).** When the prover fails, extract_goal turns the unsolved goals of the failed attempt, with their preconditions, into new statements; the intuition is that a failed attempt "may introduce valid subgoals that represent easier subproblems". Because such a statement "is not guaranteed to be provable", its negation is added too.
- **Informal-based scaffolded synthesis (§2.2, Fig. 2, App. D).** Qwen3-32B, a general LLM, first attempts a natural-language solution, then writes simpler sub-problems of unsolved problems or harder variants of solved ones. The formalizer translates them, LLM votes check faithfulness, correctness and difficulty, trivial or incorrect statements are dropped, and the negations of incorrect ones are added (App. D).
- **Pipeline (§2.4, Fig. 3).** Base models Qwen3-8B and Qwen3-32B. (1) Fine-tune on proofs from DeepSeek-Prover-V2 7B and 671B. (2) Add self-correction examples from the fine-tuned model and DeepSeek-Prover-V2-671B, fine-tune, average with the base model. (3) Scaffolded synthesis, fine-tune, average. (4) RL, average.
- **RL (§2.3 "Reinforcement learning", App. E).** The Lean compiler is called as the reward function (App. E.1). Half the inputs ask for a whole proof and half for a first-round correction of a failed proof (§2.3, Fig. 9). The algorithm is GRPO without group normalization (after Dr.GRPO, "to avoid inherent bias on length"), with clip-higher (a looser upper limit on how far one update may raise an output's probability), overlong penalties (less reward for responses that run past a length limit) and dynamic sampling from DAPO, and without the KL term "to encourage exploration" (§2.3). Dynamic sampling here keeps only problems whose pass rate is in (0, 0.75] (solved by at least one rollout, by at most three quarters), since "question difficulty significantly impacts RL training" (§2.3).
- **Model averaging (§2.3 "Model averaging for enhanced diversity").** The authors observed diversity falling late in fine-tuning and RL: pass@1 rises while pass@N falls for larger N, such as 32. Averaging with the base model, they report, "effectively enhances pass@N".

## Results

- **MiniF2F (Tab. 2, §3.3).** At pass@32: 8B 84.6%, 32B 88.1%, 32B with self-correction 90.4%, against DeepSeek-Prover-V2-671B at 82.4%. The authors say the 8B model nearly matches or outperforms Kimina-Prover-70B at the same budget (§3.3).
- **Scaling (§3.4, Tab. 4, Fig. 6).** Tab. 4 runs budgets of 32 to 8,192 attempts, self-correction mode up to 1,024. The authors report "consistent gains from verifier-guided self-correction across all inference budgets", and the 8B model ahead of DeepSeek-Prover-V2-671B "at all budgets" (§3.4).
- **PutnamBench (Tab. 3, §3.3).** The 32B model solves 43 problems at pass@32 in standard mode, 57 at pass@32 and 86 at pass@184 in self-correction mode, against DeepSeek-Prover-V2's 22 at pass@32 and 47 at pass@1024. A note says the concurrent Seed-Prover solved more but is closed and its test-time budget unclear, "which is expected to be much larger than ours" (Tab. 3).
- **MathOlympiadBench (Fig. 1).** At pass@32, of 360 problems: DeepSeek-Prover-V2-671B 50, Goedel-Prover-V2-32B 60, and 73 with self-correction.
- **MiniF2F statements (App. A).** On IMO problems in both benchmarks, the authors find MiniF2F cases with issues such as a formal statement strictly weaker than, or not matching, the informal one, and say similar issues are not observed for these problems in MathOlympiadBench.
- **Formalizer (Tab. 1).** On 300 Omni-MATH problems (a competition-math problem set), Tab. 1 lists 228 "Pass" for Goedel-Formalizer-V2 against 161 for Kimina-Autoformalizer.
- **Self-correction ablation (§3.5, Fig. 7).** With YaRN (a method to extend a model's context window) at 128k tokens and up to 5 revisions, at pass@32: removing the compiler's error messages "significantly lowers performance"; removing earlier chains of thought "slightly degrades performance"; the full method reaches 92.7% on average, above standard mode's 92.2% at pass@8192.
- **RL and averaging (§3.6, Fig. 8).** For RL checkpoints at steps 60, 80 and 90, averaged at α = 0.6–0.9: pass@1 rises with RL steps; pass@N levels off without correction but "continues to improve" with it; a lower α lowers pass@1, while pass@N first rises then falls as α grows, with the gain larger for correction. They read this as averaging that "amplifies the benefits of RL-driven self-correction" (§3.6).

## Limits the authors state

- The LLM filter in informal-based synthesis speeds things up "with a minor trade-off in potentially discarding some valid statements due to LLM judgment errors" (§2.2).
- Self-correction gains more from RL, "likely due to the shortage of high-quality self-correction data in the SFT stages" (supervised fine-tuning) (§3.6).
- Tool-use RL for self-correction needs strong tool-calling ability in Lean, "particularly challenging for our relatively small model"; multi-turn RL brings engineering challenges such as asynchronous generation; "We have explored some preliminary approaches, but they remain immature" (App. E.2).

## Open problems and building blocks

- **Open:** a test-time proof-repair strategy that re-proves only the unsolved subgoal, "highlighting inference-time scaling strategies as a key direction for future work" (§5). For training, "the effectiveness and efficiency of multi-turn RL still require further validation" (App. E.2).
- **Released:** "Our models, code, and data are released" (abstract); "open-sourcing all trained models" (§5). The authors offer the models as "a very good candidate for the community to develop new algorithms and test on different benchmarks" (§3.3).
- **To reuse it:** base models Qwen3-8B and Qwen3-32B (§2.4); Lean 4.9.0-rc1 (§3.2); 30,000 tokens per attempt, 40,000 with self-correction (§3.2). Self-correction data from DeepSeek-Prover-V2-671B was made on 144 H100 GPUs (§2.4); data building also used Claude Sonnet 4 (§2.2), and Qwen3-32B and Qwen3-8B (App. D). RL uses the VeRL framework (an RL training library), with responses up to 24K tokens (App. E.1).

## On this site

- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/harness-general">harness-general</a><a class="tag sub" href="#/tags/itp-general">itp-general</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/rlvr-general">rlvr-general</a><a class="tag sub" href="#/tags/scaling-general">scaling-general</a></span>
