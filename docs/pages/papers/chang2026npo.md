# Naive Prompt Optimization: Rethinking the Need for Complex Prompt Search

**Naive Prompt Optimization (NPO)** · preprint 2026

Read: [PDF](https://arxiv.org/pdf/2608.27266) · [arXiv](https://arxiv.org/abs/2608.27266)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- A single lineage of prompts revised by a teacher model from rollout feedback.
- No population, no Pareto front.
- Offered by its authors as "a simple iterative baseline for testing whether sophisticated prompt search is necessary" (§4).

## In plain words

Automatic prompt optimization improves a fixed LLM by rewriting its instructions instead of retraining it. The authors argue that "recent developments increasingly favor unnecessarily complex prompt optimizers" (abstract), such as GEPA, which keeps a pool of competing prompts. They test a simple alternative, Naive Prompt Optimization (NPO): one prompt, rewritten again and again by a "teacher" LLM that reads the full transcripts and scores of the latest attempts. They compare it with GEPA on instruction-following and multi-hop question-answering benchmarks, and with GEPA and reinforcement-learning fine-tuning on 22 text games (§1).

They report that NPO matches or beats GEPA with fewer attempts, its edge growing with the teacher's strength: with GPT-5.5 as teacher and the small model Qwen3-8B as the one being prompted, NPO reaches the higher validation score on both benchmarks (§3.1). In the games, NPO is "broadly competitive" with GEPA, while reinforcement learning does better on some games where prompt optimization helps less (abstract). They conclude that "our preliminary results show that simple, linear prompt optimization can rival substantially more sophisticated and complex search procedures" (abstract).

## Background and terms

**Terms to know:** [reflective prompt optimization](#/glossary/reflective-prompt-optimization) · [Pareto front](#/glossary/pareto-front) · [reinforcement learning](#/glossary/reinforcement-learning) · [GRPO](#/glossary/grpo) · [constrained decoding](#/glossary/constrained-decoding) · [LoRA](#/glossary/lora-low-rank-adaptation) (the GRPO baseline trains only an adapter, §2.3)

**The paper's own terms:**
- **student** (also target model): the fixed LLM that runs the prompt (§1, §2.1).
- **teacher** (also reviser or reflection model): the LLM that reads the student's results and writes the next prompt (§1).
- **single lineage**: one chain of prompt versions, without "maintaining multiple prompt lineages or using explicit search algorithms" (§1, Fig. 2).
- **minibatch N, sliding window W**: NPO runs N rollouts per iteration; the teacher sees a sliding window of the last W iterations (§2.1, Alg. 1).
- **Valset Score**: Fig. 4's y-axis, the score on a separate 300-example validation set (§2.6).
- **shared pseudorandomness**: all methods reuse one sequence of random seeds, so paired game episodes start from the same configuration (§2.4, Fig. 3).
- **legitimate actions**: the moves a game environment allows in its current state, for environments that expose a finite list (§2.4).

**Builds on:**
- GEPA ([GEPA](#/papers/agrawal2025gepa "GEPA: Reflective Prompt Evolution Can Outperform Reinforcement Learning (2026)")), the main comparison: a pool of prompts grown by reflection; a revision is kept only if it improves on its minibatch, and parents are picked by Pareto-based selection over validation instances. Run without its merge variant (§2.2).
- OPRO ([OPRO](#/papers/yang2023opro "Large Language Models as Optimizers (2024)")), an LLM proposing new instructions from earlier ones and their scores (§1). The authors credit it with first proposing an LLM as iterative prompt optimizer (§2.1), and say NPO differs by using complete rollout traces and per-rollout rewards, while OPRO conditions "only on previously evaluated prompts and their scalar scores" (§2.1).
- GRPO ([DeepSeekMath](#/papers/shao2024deepseekmath "DeepSeekMath: Pushing the Limits of Mathematical Reasoning in Open Language Models (2024)")), the weight-training baseline that prompt optimization is compared against in the games (§2.3).

## Problem and setting

- **The question:** whether sophisticated prompt search is needed (§4), how prompt optimization compares with GRPO in games, and whether optimized prompts carry over to other students (§1).
- **Benchmarks:** IFBench, "which evaluates instruction following under verifiable constraints", and HotpotQA, "a multi-hop question-answering benchmark" (§1); for both, the prompts of each pipeline step ("hop") are optimized jointly (App. F). Plus 22 single- and two-player games from TextArena, a collection of text-game environments, each with its own metric (score, tile, sets found or win rate) (Fig. 6).
- **Models:** student Qwen3-8B, an open-weight model; teachers Qwen3-8B itself (as in GEPA's self-revision setting), then "progressively stronger" DeepSeek-V4-Flash-preview-0424 and GPT-5.5 (§2.5). Prompts are transferred to Qwen3-14B and Qwen3-32B (same family) and two Llama 70B models (another family); prompts optimized with Llama-3.1-8B as student go to the Llama 70B models, Qwen3-32B and StepFun-3.7-Flash (§2.5).
- **Correctness:** each revised prompt's score on a separate 300-example validation set (§2.6).
- **Budgets:** NPO's minibatch/iteration settings of 50/10 (IFBench) and 40/20 (HotpotQA) give 3,500 and 6,800 rollouts, against GEPA's 3,593 and 6,871 from the GEPA paper (§2.6). In games, NPO and GEPA each use 408 episodes (§2.6). The window size W used is not stated.
- **Generation:** a fixed 2,000-token context window; students "typically use only 300--500 reasoning tokens", and forcing longer reasoning "does not improve performance" (§2.6).

## Approach

- **NPO (§2.1, Alg. 1, Fig. 1).** Each iteration: run the student with the current prompt on a minibatch, collect traces and rewards, and give the teacher the W most recent iterations, "including the prompts, corresponding rollout traces, and rewards" (§2.1); the teacher writes the next prompt. All versions are returned with the best candidate; there is no acceptance test and no pool. For IFBench and HotpotQA, minibatches are larger than GEPA's size of 3, tuned "to provide rich feedback while remaining within the teacher model's context window" (§2.6).
- **GRPO baseline (§2.3, §2.6).** A task-specific LoRA adapter on Qwen3-8B, prompt fixed; in two-player games the opponent is the unmodified base model, and the trained player moves first in half of each group's episodes. 8–12 episodes per iteration for about 100 iterations; although GRPO training runs beyond the NPO and GEPA budgets, "all three methods are compared over the same 0--408-rollout range" (§2.6).
- **Fair-comparison harness (§2.4).** Shared seeds give paired episodes. Replies take the form "<think> reasoning </think> [action]": the opening tag is prefilled, reasoning is free, and after the closing tag decoding is constrained to the legitimate actions, for environments that expose a finite list. A response that hits the reasoning budget is not counted as a failure: the decoder inserts the closing tag and forces a legal action from a small reserved budget. Motivation: in preliminary experiments "formatting errors accounted for a nontrivial fraction of observed failures" (§2.4).

## Results

- **NPO against GEPA by teacher (§3.1, Fig. 4).** Peak validation scores printed for NPO against GEPA, teachers Qwen3-8B / DeepSeek-V4-Flash / GPT-5.5: IFBench 0.73 / 0.87 / 0.88 against 0.78 / 0.81 / 0.78; HotpotQA 0.60 / 0.61 / 0.68 against 0.58 / 0.59 / 0.60. The authors report that "NPO benefits more consistently from stronger teachers" while GEPA+GPT-5.5 performs "broadly on par with GEPA+Qwen3-8B in several settings", and (§2.6) that NPO "consistently reaches comparable or higher peak performance with fewer total rollouts".
- **Transfer to other students (§3.2, Fig. 5; App. A, Fig. 8).** Fig. 5 transfers both GEPA and NPO prompts. The authors report that "transfer is strongest within model families but remains effective across families", with cross-family gains "generally slightly weaker and more variable across tasks and optimization methods", and that "most settings exhibit positive performance gains, with only a few exceptions".
- **Games against GRPO (§3.3, Fig. 6).** Student Qwen3-8B, teacher GPT-5.5, "controlled for the same rollout budget". The authors report "no universal winner", that "Contrary to earlier reports, GEPA does not consistently outperform GRPO across all tasks", and that NPO achieves gains similar to GRPO on several games, "with GEPA showing no consistent advantage over the much simpler NPO method". In App. B (Fig. 9), GRPO "achieves strong gains on several tasks with larger budgets and carefully designed rewards", and game prompts transferred within the Qwen family "largely" keep their gains, while transfer to Llama-3.3-70B-Instruct "is less consistent".
- **Answer leakage (§3.4, Fig. 7).** NPO, especially with stronger teachers, "often produces substantially longer prompts than GEPA". Checking every prompt version against HotpotQA's gold answers, the authors find training-answer overlap grows while validation overlap stays "negligible": at most 15 of 300 validation answers against up to 2,287 of 18,090 training answers (NPO, GPT-5.5 teacher; Fig. 7); manual inspection traces the nonzero part to distinct questions sharing an answer. They take this to suggest the gains are "unlikely to be explained by evaluation-answer leakage".
- **GRPO group size (App. C, Fig. 10).** On Minesweeper ("with others leading to similar results"), with Qwen3-8B first fine-tuned on GPT-4o-mini responses and then trained with GRPO, the authors report that "larger group sizes doe not lead to significantly better training" under the same rollout budget.
- **Prompts (App. F, Tab. 1).** "NPO appears to produce prompts similar in detail and depth to those produced by GEPA" (GPT-5.5 teacher).

## Limits the authors state

- "Our preliminary study used only a limited set of tasks, leaving open whether NPO's advantage extends to more complex, long-horizon agent environments" (§4 "Limitations").
- No frontier closed models such as GPT-5.5 as students, "primarily due to temporal performance inconsistencies and the lack of token-level logits and sufficient fine-grained decoding control exposed via APIs" (§4 "Limitations").
- "RL training remains unstable on some tasks", and tasks may favor different RL algorithms or rewards; long horizons add instability and teacher context, so "our results do not yet establish the relative effectiveness of prompt optimization and RL in longer-horizon settings" (§4 "Limitations").
- Transfer "can still vary across specific model, task, and optimization-method combinations" (§3.2).
- A strong teacher "might be able to improve student performance for arbitrary tasks with very few rollouts", which could be misused for malicious agents; and NPO shares rollout traces with a possibly third-party teacher, so "masking and sanitization are required for tasks involving sensitive data" (§4 "Responsible-Use Statement").

## Open problems and building blocks

- **Open:** whether prompts optimized for several tasks "can be consolidated into a compact multi-task prompt while preserving their task-specific gains", then refined by a few NPO rounds; and searching, with small teachers and students, for a few representative "eigen-tasks" whose prompts could be distilled into one general-purpose prompt that transfers to larger students (§4 "Future Directions").
- **Released:** Nothing stated.
- **To reuse it:** a teacher whose context holds the window's traces (minibatch and window are sized to fit it; GPT-5.5 and DeepSeek-V4-Flash have 1 million tokens, §2.6); for the decoding harness, token-level logits and decoding control over the student (§2.4, §4). GRPO ran through DSPy's `dspy.GRPO` interface (DSPy: a framework for LLM programs) and the Arbor RL backend on two NVIDIA H100 GPUs (§2.6).

## On this site

- **Discussed in:** [Comparing LLM methods under noise](#/challenges/method_comparison_under_noise)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/promptopt-feedback">promptopt-feedback</a><a class="tag sub" href="#/tags/promptopt-general">promptopt-general</a></span>
