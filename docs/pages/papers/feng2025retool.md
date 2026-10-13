# ReTool: Reinforcement Learning for Strategic Tool Use in LLMs

**ReTool** · ICLR 2026

Read: [PDF](https://arxiv.org/pdf/2504.11536) · [arXiv](https://arxiv.org/abs/2504.11536)  
Code: [ReTool](https://github.com/ReTool-RL/ReTool)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Trains an LLM with reinforcement learning to interleave Python code, run in a sandbox, with its text reasoning on competition math, rewarded only on whether the final answer matches (abstract; §2.3.1, Eq. 2).
- Cold-start fine-tuning on reasoning traces whose hand calculations were rewritten as code plus interpreter output (§2.2, Fig. 8), then PPO with rollouts that pause at each code block, run it and feed back its output or error message (§2.3.1, Fig. 2); Qwen2.5-32B-Instruct, against text-only RL on that backbone, and DeepSeek-R1-Distill-Qwen-32B, against published models with scores copied from their sources, on AIME 2024 and 2025 (§3.1, Tab. 1).
- The weight-space counterpart of prompting a model to hand computation to an interpreter: when to call the tool is learned from outcome reward alone, with no reward for executable code (§2.3.1). The authors report that by the end of RL training responses contain code on nearly 98% of the questions (§3.3, Fig. 3 (b)), so the learned policy calls the interpreter almost always on AIME.

## In plain words

Reasoning models trained with reinforcement learning reason well in text, but the authors say they "struggle in scenarios requiring structured problem-solving, such as geometric reasoning, concise computation, or complex equation solving", where a code interpreter helps (abstract). ReTool trains a model to write Python mid-reasoning, have a sandbox run it, read the output or error, and go on. Training first fine-tunes the model on reasoning traces whose hand calculations were rewritten as code, then runs reinforcement learning whose only reward is whether the final answer is right, which, the authors say, teaches it when and how to call the interpreter (abstract, §2). On AIME 2024 (a US high-school math competition), a 32-billion-parameter Qwen model trained this way scores 67% after 400 training steps, against 40% after 1080 steps for the same model trained with text-only reinforcement learning, accuracy averaged over 32 samples per problem (abstract, §3.1). The authors call ReTool "a novel reinforcement learning framework" (§1) that scales up a concurrent line of work (§4.2), and report that the model learned to fix its own failing code (§3.3).

## Background and terms

**Terms to know:** [reinforcement learning](#/glossary/reinforcement-learning) · [PPO](#/glossary/ppo) · [cold start](#/glossary/cold-start) · [program-of-thought and tool-integrated reasoning](#/glossary/program-of-thought-and-tool-integrated-reasoning) · [outcome and process rewards](#/glossary/outcome-and-process-rewards) · [RL with verifiable rewards](#/glossary/rl-with-verifiable-rewards-rlvr) · [pass@k](#/glossary/passk) · [self-correction](#/glossary/self-correction)

**The paper's own terms:**
- **CI**: code interpreter; here a sandbox that runs the model's Python and returns its output or error (abstract; §2.3.1).
- **Cold-start data**: the code-augmented reasoning traces used for supervised fine-tuning before RL, called D_CI; built from a text-only set, D_init (§2.2).
- **CI-powered RL / text-based RL**: ReTool's RL, whose rollouts include interpreter runs, against the usual RL, whose rollouts are text only (Fig. 2; Tab. 1).
- **Reference model**: the paper's name for the model before the current PPO update, which generated the rollouts (§2.3.1, under Eq. 1).
- **Interpreter feedback mask**: the interpreter's output tokens are left out of the training loss, which the authors say keeps training stable (§2.3.2).
- **KV-cache reuse**: to cut memory during rollouts, when a code block ends, the [KV cache](#/glossary/kv-cache) built so far is kept, and only the interpreter output's part is computed and appended (§2.3.2).
- **Code ratio, code lines, code pass rate, code invocation timing**: the share of responses that contain code; the average number of code lines; the share of responses whose last code runs; and where code appears, as the start position of code divided by the response's length (§3.3).
- **"Aha moment"**: the authors' name for the model correcting code that failed to run (§3.3, Fig. 4).

**Builds on:**
- PPO (Schulman et al. [16]), which the authors modify so rollouts include code runs (§2.3.1).
- Program-of-thought reasoning, Chen et al. [1] and Gao et al. [5] ([PAL (Program-aided Language Models)](#/papers/gao2022pal "PAL: Program-aided Language Models (2022)")), in which the model writes code an interpreter runs (§4.1).
- Prompting and supervised fine-tuning for tool use, Chen et al. [2] and Logic-LM [14] ([Logic-LM](#/papers/pan2023logiclm "Logic-LM: Empowering Large Language Models with Symbolic Solvers for Faithful Logical Reasoning (2023)")), which the authors say are "limited to imitating the specifically-curated data distribution" (§1; §4.2).
- ToRL [8], "a concurrent work" applying RL to tool use with Qwen2.5-Math models at 1.5B and 7B, whose results the authors call "suboptimal" and which they "further scale up" (§4.2).

## Problem and setting

The question: can RL with a reward on the final answer alone teach an LLM when and how to call a code interpreter during long reasoning, and does that beat RL on text alone (§1)?

- **Task:** competition math with a single checkable final answer, which the model must give in a specified format (e.g. inside `\boxed{}`); the reward is +1 when the answer is equivalent to the ground truth and −1 otherwise, checked by rules (§2.3.1, Eq. 2). How equivalence is decided is not described beyond "rule-based verification".
- **Tool:** Python, run in a sandbox, with complete scripts including imports (App. A, Fig. 7).
- **Models:** Qwen2.5-32B-Instruct (an open instruction-tuned model) as the main backbone, and DeepSeek-R1-Distill-Qwen-32B, a 32B Qwen model fine-tuned on outputs of DeepSeek-R1 ([DeepSeek-R1](#/papers/deepseek2025reasoning "DeepSeek-R1: Incentivizing Reasoning Capability in LLMs via Reinforcement Learning (2025)")) (§2.3.2; §1). DeepSeek-R1 itself helps filter the cold-start data (§2.2).
- **Evaluation:** AIME 2024 and AIME 2025 only; each set is run 32 times at temperature 1.0 and top-p 0.7, and the average estimates pass@1 (§3.1).
- **Baselines:** text-based RL on the same backbone, which "includes a text-based cold-start SFT initialization to ensure a fair comparison" (Tab. 1 note; SFT is supervised fine-tuning); and seven published math and reasoning models, among them OpenAI o1-preview (OpenAI's reasoning model) and s1-32B (a 32B model tuned for test-time scaling), whose scores are copied from their sources (§3.1, Tab. 1).
- **Not discussed:** which problems the RL stage trains on, how the reported checkpoint was chosen, and the size of the cold-start dataset.

## Approach

- **Cold start (§2.2).** Math reasoning data from several sources, e.g. Open-Thoughts (an open set of reasoning traces), are filtered by human experts and DeepSeek-R1 into a text-only set. A prompt (Fig. 8) then rewrites "manual calculation steps that can benefit from code execution" as code snippets with their execution results. Samples are kept only if they pass a format check and give the right final answer, and the model is fine-tuned on the result.
- **RL (§2.3.1).** PPO (Eq. 1) with rollouts that interleave code runs: the model writes text, and when it closes a `</code>` tag, generation pauses, the sandbox runs the code, its output or error message goes back inside `<interpreter>` tags, and the model continues, writing more code or its final answer (Fig. 2 (b); prompt in Fig. 7). The reward looks only at the final answer, "without considering code executability reward", which the authors say aims "to alleviate reward hacking and promote more diverse problem-solving behaviors" (§2.3.1; [reward hacking](#/glossary/reward-hacking)).
- **Training details (§2.3.2).** The interpreter-feedback mask, KV-cache reuse, and an asynchronous pool of sandbox workers that pull tasks as they have capacity.

## Results

- **Against text-only RL (Tab. 1; Fig. 1).** On Qwen2.5-32B-Instruct, ReTool reaches 67.0 on AIME 2024 and 49.3 on AIME 2025 after 400 steps, against 40.0 and 36.7 for text-based RL "despite using over 1000 training steps" (§3.2); the abstract gives 1080.
- **Stronger backbone (Tab. 1).** On DeepSeek-R1-Distill-Qwen-32B, ReTool scores 72.5 and 54.3; the abstract calls the 72.5 an accuracy "in extended settings, surpassing OpenAI's o1-preview by 27.9%", against o1-preview's 44.6, copied from its source (§3.1).
- **Ablation (Tab. 1; §3.2).** The cold-start model alone, with the interpreter at inference, scores 40.9 on AIME 2024, close to text-based RL's 40.0 and above the untrained base model's 26.7.
  - response length first drops sharply, then rises gently, ending "40% shorter than that before RL training (i.e., from 10k to 6k)";
  - code appears in responses to nearly 98% of the questions by the end;
  - average code lines grow to "nearly fivefold higher than that before RL training", and the total number of correct code runs on the test sets shows "an overall upward trend";
  - the last code in correct responses almost always runs, while in incorrect responses its pass rate declines;
  - code is called earlier in the response as training goes on.
- **Self-correction (§3.3, Fig. 4).** The authors report "an emergent ability to self-correct non-executable code, despite the absence of explicit training data for code self-correction", e.g. redefining a function the interpreter reported undefined.
- **Code purposes (§3.3, Fig. 5).** Classified by Doubao-1.5-pro (a ByteDance LLM), calculation and verification dominate; after RL the purposes become more diverse.
- **Case study (§3.3, Fig. 6).** On one question, text-based reasoning before RL training relies on a "laborious" text-only calculation, which the authors say is "prone to numerical errors", where the model after RL uses concise code.

## Limits the authors state

None stated.

## Open problems and building blocks

- **Open:** None stated.
- **Released:** Nothing stated; the title page links a project page (title page).
- **To reuse it:** the VeRL training framework; PPO with AdamW at learning rate 1e-6, expected maximum sequence length 16384 tokens, mini-batch size 512, KL coefficient 0.0; two epochs of cold-start fine-tuning; Qwen2.5-32B-Instruct as the main backbone (§2.3.2); a sandbox pool for the code runs (§2.3.2); DeepSeek-R1 and human experts to filter the cold-start data (§2.2). No hardware or run time is given.
- **Beyond its domain:** the authors say the more diverse code purposes after RL enhance "the generalizability of ReTool to a broader range of problems" (§3.3), and that the findings "offer new insights into hybrid neuro-symbolic systems" (abstract), i.e. systems that join a neural model with symbolic tools ([neuro-symbolic AI](#/glossary/neuro-symbolic-ai)).

## On this site

- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/harness-general">harness-general</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/rlvr-general">rlvr-general</a></span>
