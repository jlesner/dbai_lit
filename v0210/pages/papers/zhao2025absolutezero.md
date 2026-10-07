# Absolute Zero: Reinforced Self-play Reasoning with Zero Data

**Absolute Zero** · preprint 2025

Read: [PDF](https://arxiv.org/pdf/2505.03335) · [arXiv](https://arxiv.org/abs/2505.03335)  
Code: [Absolute-Zero-Reasoner](https://github.com/LeapLabTHU/Absolute-Zero-Reasoner)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- One model proposes code-reasoning tasks and solves them; a code executor checks both.
- Self-play with zero external data.

## In plain words

Reasoning models are often trained by reinforcement learning on questions with known answers, rewarded when a checker confirms an answer. Even the "zero" variant, which skips supervised fine-tuning, needs human-collected questions. The authors argue that the scarcity of such data raises scaling concerns, and that in a hypothetical future where AI surpasses humans, human tasks may offer it limited learning potential (abstract). They propose Absolute Zero, in which one model invents its own training tasks and solves them, without any external data. In their system, the Absolute Zero Reasoner (AZR), the model writes small Python programs with inputs, a Python executor validates each task and computes its answer, and the model is rewarded for tasks it solves only sometimes and for correct solutions (§3). With greedy decoding on code and math benchmarks it never trained on, code-specialized AZR-Coder-7B has the best overall and code averages of the 7B models compared, including zero-style models trained on curated data, 1.8 points above the best overall baseline (§4.2). They present AZR as "the first attempt to embrace the Absolute Zero Paradigm" (§3).

## Background and terms

**Terms to know:** [RL with verifiable rewards (RLVR)](#/glossary/rl-with-verifiable-rewards-rlvr) · [reinforcement learning](#/glossary/reinforcement-learning) · [self-play](#/glossary/self-play) · [cold start](#/glossary/cold-start) · [GRPO](#/glossary/grpo) · [PPO](#/glossary/ppo) · [pass@k](#/glossary/passk) · [program synthesis](#/glossary/program-synthesis) · [zero setting](#/glossary/zero-rl-training) · [baseline (policy gradient)](#/glossary/policy-gradient)

**The paper's own terms:**
- **Absolute Zero (AZ)**: the setting in which one model proposes tasks, solves them and learns from both, with an environment giving verifiable feedback and no external data (§2.2, Eq. 3).
- **Proposer and solver**: the model's two roles; the environment turns a proposed task into a question with a gold answer, which the solver answers (§2.2, Fig. 3).
- **Triplet (program, input, output)**: an AZR task; the output is the program's result on the input (§3.2).
- **Deduction, abduction, induction**: the three task types (§3.2). Deduction: predict the output from program and input. Abduction: find an input giving a stated output. Induction: write a program from input–output examples plus a natural-language message, judged on held-out examples.
- **Learnability reward**: the proposer's reward, from the current solver's success rate on the task (§3.1, Eq. 4).
- **Buffers and references**: stores of earlier valid tasks per type; the abduction and deduction proposers see K of them (6, Tab. 3) and are asked for a different one (§3.3.2).
- **In-distribution (ID) and out-of-distribution (OOD)**: ID benchmarks ask for a program's input or output, like AZR's tasks; OOD ones are code-generation and math problems (§4.1).
- **CAvg, MAvg, AVG**: the code average, the math average, and their mean (Tab. 1 caption).
- **"uh-oh moment"**: the authors' name for concerning chains of thought from the Llama-based model (§4.2 RQ5, Fig. 34).

**Missing glossary terms:**
- **REINFORCE++**: a policy-gradient algorithm (one that raises the probability of high-reward outputs) that, as used here, normalizes rewards by the batch-wide mean and standard deviation (one global baseline), with PPO's clipped objective (§3.3.5; App. A).

**Builds on:**
- The zero setting introduced with DeepSeek-R1 ([DeepSeek-R1](#/papers/deepseek2025reasoning "DeepSeek-R1: Incentivizing Reasoning Capability in LLMs via Reinforcement Learning (2025)")): "We extend the zero setting to a new absolute zero setting" (§5 "Reasoning with RL"); RLVR is cited to Tülu 3 ([Tülu 3](#/papers/lambert2024tulu "Tulu 3: Pushing Frontiers in Open Language Model Post-Training (2024)"), §1).
- Self-play: Schmidhuber's setup in which a proposal agent invents questions for a prediction agent, and AlphaGo/AlphaZero (§5 "Self-play"); learnability from autotelic agents and unsupervised environment design, RL work in which agents invent their own goals or environments (§3.1).
- REINFORCE++ and GRPO ([DeepSeekMath](#/papers/shao2024deepseekmath "DeepSeekMath: Pushing the Limits of Mathematical Reasoning in Open Language Models (2024)")): TRR++ (Task-Relative REINFORCE++, the authors' update rule) "can be viewed as an interpolation between" GRPO's per-question baselines and REINFORCE++'s global baseline (§3.3.5).
- The baselines (§4.1 "Baselines", Tab. 4): zero-style models trained on curated data from Qwen2.5-7B variants. Math: SimpleRL-Zoo and Oat-Zero (8.5k math pairs each), Open-Reasoner-Zero (ORZ; 57k samples), PRIME-Zero (math plus code). Code: four AceCoder variants (22k code data) and two CodeR1 models (2k or 12k pairs).

## Problem and setting

- **The question:** can a model improve its reasoning through RLVR by proposing and solving its own tasks, with no human-curated data (§1, §2.2)?
- **Environment:** a Python executor. Only deterministic programs count as valid, "to keep the verifier simple" (§3.3.3). Correctness is Python value equality (§3.1, Eq. 5).
- **Start:** a pretrained base model; the seed is one identity-function triplet (Fig. 5), whose caption says "the base LLM is fully capable of initiating the AZR loop without any seed program".
- **Models:** Qwen2.5-7B and -7B-Coder; also Coder-3B and -14B, Qwen2.5-14B, Llama-3.1-8B (§4.1).
- **Benchmarks (§4.1):** OOD code: HumanEval+ and MBPP+ (function-writing problems with extra tests, via [EvalPlus](#/papers/liu2023evalplus "Is Your Code Generated by ChatGPT Really Correct? Rigorous Evaluation of Large Language Models for Code Generation (2023)")), LiveCodeBench Generation (contest problems). OOD math: AIME'24, AIME'25, AMC'23 (US competitions), OlympiadBench (olympiad-level problems), Minerva (university-level science and math problems), MATH500 (500 MATH competition problems). ID: CruxEval-I, CruxEval-O, LiveCodeBench-Execution. Greedy decoding for all models' main results.

## Approach

- **Objective (§2.2, Eq. 3):** a weighted learnability reward plus the expected solve reward.
- **Rewards (§3.1):** the solver is sampled 8 times per proposed task (Tab. 3). The proposer gets 0 if no sample succeeds, else 1 minus the success rate (Eq. 4); the authors write that "tasks of moderate difficulty, where the solver occasionally succeeds are rewarded the most". The solver gets 1 for a correct answer, 0 otherwise (Eq. 5). Wrong but well-formatted responses get −0.5, badly formatted ones −1; a proposal is "correctly formatted" only if it also passes validation (Eq. 6).
- **Task construction (§3.3.3):** a proposed program must run on its input without error and return something; must avoid listed modules (Fig. 10); and must give equal outputs on two runs, a number fixed "For computational budget reasons". For induction, the solver sees half of the input–output pairs and the message (§3.3.3).
- **Answer checking (§3.3.4):** abduction accepts any input giving the gold output; induction must match the held-out pairs (§3.2; code in Figs. 12–14).
- **Loop (Alg. 1, §3.3.1–3.3.2):** seed buffers from the base model, then alternate propose and solve phases, filling short batches from the buffer.
- **TRR++ (§3.3.5, Eq. 8):** each reward is normalized by the mean and standard deviation of its own task-type–role pair, giving six baselines. No [KL penalty](#/glossary/kl-penalty) (App. A).
- **Alternatives that "did not prove to be particularly helpful" (App. D):** an error-prediction task, composite-function curricula (the model "often defaulted to simply returning “g(x)”"), LeetCode seeds, extra rewards, stripping comments or global variables.

## Results

- **Main comparison (Tab. 1, §4.2 RQ1):** With greedy decoding, AZR-Coder-7B's AVG is 50.4 against ORZ's 48.6, the 1.8 points, and its CAvg 61.6 against CodeR1-12k's 61.3. In math the authors call AZR "competitive" with zero reasoners trained on domain data (§1).
- **Cross-domain gains (§4.2):** AZR-Base-7B and AZR-Coder-7B raise MAvg by 10.9 and 15.2 points over their bases, against "only 0.65 points" on average for the code-trained baselines. Math-trained models gain less in coding on average.
- **Base variant (RQ2):** the Coder base starts lower in math than Qwen2.5-7B, but AZR-Coder ends above AZR-Base; strong coding "may potentially amplify" reasoning gains (§1).
- **Scale (RQ3, Fig. 6):** out-of-distribution gains of +5.7, +10.2 and +13.2 for the 3B, 7B and 14B Coder models, each against its own base.
- **Llama-3.1-8B (RQ4, Fig. 6(b)):** a "moderate" improvement, smaller than SimpleRL-Zoo's in the same table.
- **Behaviour (RQ5):** trial-and-error in abduction; comments as plans (Fig. 21). Token length grows most for abduction, which the authors call "one of the first observation of clear distinctions" of this kind (§4.2). The policy "appears to implicitly optimize" unrewarded complexity and diversity metrics of its proposed tasks (App. C.4, Fig. 29).
- **Ablations (Tab. 2, RQ6–7, AZR-Base-7B only):** AVG 46.8 for full AZR against 43.3–45.4 for deduction only, no induction, no reference examples, and an untrained proposer; math drops most.
- **Pass@k (Fig. 8, RQ8):** sampling settings follow [Does Reinforcement Learning Really…](#/papers/yue2025rlreasoning "Does Reinforcement Learning Really Incentivize Reasoning Capacity in LLMs Beyond the Base Model? (2025)"); at high k (256 and 512), AZR-Base-7B "outperforms the base model in 4 of 5 cases" (exception: AIME24, k = 512).
- **MMLU-Pro (Fig. 9, RQ9):** AZR-Base-7B "attains higher subject-average and higher overall average" than ORZ-7B, Qwen2.5-7B and SimpleRL-Zoo-7B on MMLU-Pro, a multiple-choice benchmark spanning 14 subjects.

## Limits the authors state

- "One limitation of our work is that we did not address how to safely manage a system composed of such self-improving components"; the Llama "uh-oh moment" findings "suggest" the paradigm "still necessitates oversight" (§6).
- Only deterministic programs are handled (§3.3.3).
- "Due to resource constraints", ablations use only AZR-Base-7B (§4.2 RQ6).
- In-distribution, the 3B model "appears to plateau" (§4.2 RQ3); Llama's gains "appear more limited" (RQ4).
- The ID benchmark curves "do not perfectly correlate" with broader code or math ability (App. C.2).
- "For safer code execution, we recommend using API-based services such as E2B" (App. B).

## Open problems and building blocks

  - The authors believe stochastic programs are "important and promising to include in future versions of AZR" (§3.3.3).
  - Scaling laws (§4.2 RQ3); a better proposer, e.g. by mitigating task interference (training on one task hurting another) or rewarding broader coverage (§4.2 RQ7).
  - Other ways to seed proposals (p(z): what proposals are conditioned on, in AZR past tasks; §2.2), letting the model learn how tasks become problems, exploration and diversity rewards, better estimates of learning progress (§6 "Discussion"; App. D.3–D.4).
  - Safety-aware training (§1); a stricter reward against trivial composite functions (App. D.2); the error-prediction task (App. D.1).
- **Released:** "the code, models, and logs as open-source" (§6).
- **To reuse it:** a base model and a Python executor; built on veRL (an open-source RL training library for LLMs) and parts of the QwQ model's Python executor; about 3–5 days per experiment on A800 GPU clusters (App. B). Hyperparameters, unchanged across runs: Tab. 3 (e.g. batch 64 × 6, 500 total steps).
- **Beyond its domain:** the authors suggest other feedback environments (the web, formal math languages, world simulators, the real world), and that the paradigm "could possibly be extend to domains such as embodied AI" (§6).

## On this site

- **Discussed in:** [Equivalence of nondeterministic queries](#/challenges/nondeterministic_equivalence) · [The self-improving SQL ↔ text ↔ verify loop](#/challenges/sql_text_round_trip_loop)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/rlvr-general">rlvr-general</a><a class="tag sub" href="#/tags/scaling-general">scaling-general</a></span>
