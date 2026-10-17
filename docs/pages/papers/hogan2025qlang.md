# Technical Report: Full-Stack Fine-Tuning for the Q Programming Language

**Technical Report** · preprint 2025 (Morgan Stanley and Prime Intellect)

Read: [PDF](https://arxiv.org/pdf/2508.06813) · [arXiv](https://arxiv.org/abs/2508.06813)  
Code: [MSML](https://github.com/morganstanley/MSML)

<p class="notice">A summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- A LeetCode-style benchmark for Q, the language of the kdb+ time-series database, which the authors call "much less present on the Internet" than mainstream languages (abstract; §2); frontier and base Qwen-2.5 models benchmarked on it (§4); Qwen-2.5 models from 1.5B to 32B adapted to Q by pretraining, supervised fine-tuning and RL (§5–7); models, code and data released (§1, §11).
- The benchmark is bootstrapped by having an LLM translate LeetCode Python solutions and, separately, their tests into Q, keeping solutions that pass in a Q interpreter (with GPT-4.1 (mini) judging output equivalence where formats differ) and fine-tuning the generator as verified data grows, then a manual review (§3.1.1); next-token training on a permissively licensed Q corpus (§5), SFT on four task types (§6.1) and GRPO with a test-pass reward (§7.2), scored by pass@k over 40 completions (§3.2).
- Evidence of how far frontier models are from a rare language whose programs a test run checks: the authors report that Claude Opus-4, the best of the four frontier models in Tab. 2, solves 27.2% of description-to-Q problems at pass@1 (Tab. 2). Q is built on K (§2), the language of [Learning a rarely seen DSL in prompts](#/challenges/unseen_dsl_in_prompts); the bootstrapping loop shows reward hacking when solutions and their tests are generated together (§3.1.2, Fig. 2); and the benchmark is algorithmic, "pythonic" Q, not queries over data (§10).

## In plain words

LLM coding assistants often struggle with Q, the language of the kdb+ time-series database (§1), which the authors call "a popular tool in quantitative finance" that is "much less present on the Internet" than Python or Java (abstract). They want a reusable recipe for teaching an open model a rare language (§1). They build a Q benchmark of LeetCode-style programming problems, checked by running each answer on test cases in a Q interpreter; measure frontier models on it; and train open Qwen-2.5 models of five sizes in three stages: further training on raw Q text, supervised fine-tuning, and reinforcement learning with the test results as reward (abstract; §3–7). They report that their best model, the largest one trained to reason before answering, solves 59% of test problems on the first try, "surpassing the best-performing frontier model, Claude Opus-4 by 29.5 percent", and that "all models, even our 1.5B model, outperform GPT-4.1 on this task" (abstract; Fig. 10 against Fig. 6). They present the work as an open "blueprint", releasing models, code and data (abstract; §1).

## Background and terms

**Terms to know:** [low-resource programming language](#/glossary/low-resource-programming-language) · [continual pre-training](#/glossary/continual-pre-training) · [Pass@k](#/glossary/passk) · [rejection sampling](#/glossary/rejection-sampling) · [reward hacking](#/glossary/reward-hacking) · [GRPO](#/glossary/grpo) · [RL with verifiable rewards](#/glossary/rl-with-verifiable-rewards-rlvr) · [LoRA](#/glossary/lora-low-rank-adaptation) · [LLM-as-a-judge](#/glossary/llm-as-a-judge) · [curriculum learning](#/glossary/curriculum-learning)

**The paper's own terms:**
- **Q and kdb+**: kdb+ is a high-performance time-series database from Kx Systems; Q is its language, a more approachable layer over the terser K (§2). Typical Q is database queries and analytics; the benchmark's Q is algorithmic and written in a Python-like style (§2 listing, §10, Fig. 16).
- **Pretraining**: here, next-token training of the already instruction-tuned Qwen-2.5 models on raw Q text, before the task-specific fine-tuning (§5); in the glossary's terms, continual pre-training.
- **Q-LeetCode**: the paper's benchmark, LeetCode problems with a Python solution and tests, carried over to Q (§3.1.1, Tab. 1).
- **Test harness**: Q code that calls the candidate `solve` function on a test input and prints the result, compared with the Python reference output (§3.1.1, Tab. 1, App. C.1).
- **Description-to-Q, Python-to-Q, Q-to-Python**: the three evaluated tasks: write Q from the problem text, translate a Python solution to Q, translate Q to Python (§3.2).
- **Pass@k with retries / with context**: retries feed back information on earlier failed attempts; context adds a short Q reference and example programs from the training set (§3.2).
- **Overall**: pass@40 computed from the 40 completions per problem (§3.2).
- **Reasoning and non-reasoning models**: Qwen variants trained and evaluated with a prompt either to write their reasoning before the code (inside `<reasoning>` tags) or to output code only (§7.2, App. C.1).
- **Test case reward, perfect bonus**: the RL rewards: the fraction of tests passed, and +2 for passing all (§7.2).

**Builds on:**
- Qwen-2.5 (Qwen team, [15]), the open models adapted (§1).
- LeetCodeDataset (Xia et al., [22]), the source of problems, Python solutions and tests (§3.1.1).
- GRPO from DeepSeekMath (Shao et al., [17]; [DeepSeekMath](#/papers/shao2024deepseekmath "DeepSeekMath: Pushing the Limits of Mathematical Reasoning in Open Language Models (2024)")), with changes for token efficiency from [DAPO](#/glossary/dapo) (Yu et al., [24]) and Liu et al. [13] (§7).
- Domain-adaptive pretraining (Gururangan et al., [7], §5).

## Problem and setting

- **Question:** how to measure and raise LLM skill in a language with "no canonical dataset, no widely accepted evaluation suite" (§3), using open models at 1.5B, 3B, 7B, 14B and 32B parameters (abstract).
- **Correctness:** a solution is correct when its outputs match the Python reference on the test harness, run in a Q interpreter (§3.2); during dataset building, GPT-4.1 (mini), given a few examples, judges Q against Python outputs "to resolve semantic or formatting ambiguities" (§3.1.1).
- **Data:** 678 problems, 542 for training and 136 for testing, across LeetCode difficulty levels and topics (§3.1.1, Fig. 5); a full evaluation runs 40 completions per test problem against 5 test cases each (§3.2).
- **Compared models:** Claude Opus-4, Sonnet-4 and Sonnet-3.5, GPT-4.1 and base Qwen-2.5 (Tab. 2); the reasoning models Grok-4, Gemini 2.5 Pro and o3 only in App. A.

## Approach

- **Bootstrapping the dataset (§3.1.1).** In batches of 20 problems, Qwen-2.5-32B-Instruct is asked up to 8 times per problem for a Q solution (from the problem and its Python solution) and, separately, for a Q test harness (from the problem and its Python tests): "This separation was critical to prevent the model from generating trivial or overfitted test cases (reward hacking)." The most similar solved problem (by OpenAI text embeddings) is added to the prompt ([retrieval](#/glossary/retrieval-augmented-generation-rag)). Solutions that pass the interpreter tests and the LLM check join the dataset; after every 20 new ones the generator is fine-tuned for 100 steps and tries the next batch. After about 50 iterations the loop plateaued, and the authors froze and hand-reviewed the dataset. (In the glossary's terms, the loop is iterated rejection sampling fine-tuning.)
- **What happened in practice (§3.1.2).** A first version generated tests and solutions together, checked on one test, and suffered "severe reward hacking" (Fig. 2); separating them and requiring multiple tests cut the pass rate. When the loop stagnated, pretraining (§5) was inserted and it resumed (Fig. 4).
- **Evaluation harness (§3.2).** Model calls go through one API and run on many parallel workers; open models are served by vLLM (a fast LLM inference server).
- **Pretraining (§5).** A corpus from permissively licensed (MIT or Apache 2.0) GitHub repositories (Tab. 4) and the KX documentation, filtered by Qwen-2.5-32B usefulness scores and by hand, more than 1.6M tokens (§5.1–5.2). Full-parameter training for all sizes, with early stopping (keeping the checkpoint with the lowest held-out loss); LoRA was not chosen because adapters "are not always compatible with subsequent training phases" (§5.3).
- **SFT (§6).** Each problem becomes eight samples: four task types (the three tasks plus test-harness translation), "each paired with both the code solution and relevant test harnesses" (§6.1).
- **RL (§7).** GRPO via TRL (Hugging Face's training library), from the best SFT checkpoint, ablating reasoning vs non-reasoning prompts, sampling [temperature](#/glossary/greedy-decoding-and-temperature-sampling) and reward schemes on 14B and 32B (§7.1–7.2).

## Results

- **Frontier baseline (Tab. 2).** On Description-to-Q at pass@1, Opus-4 scores 27.2%, GPT-4.1 2.9% and base Qwen-2.5 at most 6.6%; Q-to-Python is far easier (Opus-4 90.4%).
- **Feedback and context (Tab. 3).** For Opus-4, pass@4 rises from 39.7% to 54.4% with retries and 66.9% with context and retries; GPT-4.1 stays at or below 3.7%.
- **Reward hacking in data building.** The authors call the early per-round gains "largely illusory" (Fig. 2 caption), from trivial or overfitted self-written tests (§3.1.2).
- **Pretraining.** Gains for all sizes "clear, if incremental", larger models benefiting more (§5.5); 14B and 32B overfit held-out loss after several hundred steps (§5.5, Fig. 8); in the 7B ablation, LoRA solved more problems than full training and longer training stopped helping (Tab. 5).
- **SFT (Tab. 6, 7B).** Starting from the base model gave 46.3% of problems solved against 37.5% from the pretrained one; the curriculum orders and LoRA scored below full-model SFT. The authors still keep the pretrained variant "for future transfer and adaptation" (Tab. 6 caption).
- **RL (§7.3–7.4).** Gains for all sizes except 1.5B, whose "pass rates typically declined after RL"; at 14B, non-reasoning models scored slightly higher overall though reasoning ones "occasionally solved problems" the others missed; at 32B the reasoning model was better at every k (§7.4).
- **End to end (Tab. 7, Fig. 15).** Against Opus-4 at pass@1, the fully adapted models differ by +29.5 points (32B), +9.0 (14B), +1.7 (7B), −13.2 (3B) and −29.2 (1.5B) (Tab. 7); Fig. 15 shows the best reasoning models for 14B and 32B.
- **Reasoning models (App. A, Fig. 17).** Grok-4, Gemini 2.5 Pro and o3 were run only under a 2,000-token budget, scored on the completions produced within it.

## Limits the authors state

- The benchmark is "intentionally 'pythonic'" and does not reflect Q's use for "high-performance querying, analytics, and time-series operations" (§10; also §1).
- "we do not claim that our models are strong Q practitioners in the true sense, nor do we suggest that high pass rates on LeetCode-Q directly translate to real-world impact for Q developers" (§10).
- Anecdotally, models after pretraining "often provide better general-purpose Q answers" than after SFT or RL (§1).
- Automated checking "was imperfect: some false positives persisted, and we suspect some false negatives were also silently discarded" (§3.1.2).
- At this stage the model is "acquiring a mapping from Python to Q" rather than learning Q "from first principles" (§3.1.2).
- Early bootstrapping training "was not fully optimized" (Fig. 3 caption); the authors "did not formally quantify" the effect of data quality (§5.5).
- After pretraining alone, "a substantial gap" to the best proprietary systems remains (§5.5).
- Small models: 1.5B declined under RL, "suggesting that limited capacity models may struggle to benefit from policy optimization in this setting" (RL training of the model) (§7.4).
- Reasoning models were not run unconstrained, since the dataset "primarily evaluates Q syntax awareness" (App. A, Fig. 17).

## Open problems and building blocks

  - "Developing benchmarks and models that more faithfully reflect the SQL-like, database-focused style of practical Q code is a priority for future research." (§10)
  - Controlling reasoning length: "this is something we did not penalize for and leave for future work" (§7.2).
  - Error breakdowns by problem category and difficulty "can inform targeted future improvements" (App. B, Figs. 18–19).
- **Released:** all models on Hugging Face, with the 32B reasoning model or the pretrained checkpoint recommended for general Q use (§11); the complete code for dataset preparation, training, evaluation and RL, with configuration files and instructions (§11, §9); "all code, training scripts, evaluation tools, and datasets" (§1); pretraining-data metadata, scripts and splits (§5.2); the prompts (App. C).
- **To reuse it:** a Q interpreter (the paper points to the kdb+ personal edition, §3.1.1 footnote); GPT-4.1 (mini) as output-equivalence judge and OpenAI embeddings for retrieval in the data loop (§3.1.1); Hugging Face transformers and TRL, DeepSpeed ZeRO (memory sharding across GPUs) and vLLM (§9); H100 GPUs, 4 for models up to 7B and 8 for 14B and 32B (§5.4, §6.2), with all phases at 32B runnable on one 8-GPU node (§12). The authors found "genuine progress in Q domain adaptation only emerged with models of at least 14B parameters" (§12).
- **Beyond its domain:** the approach "is designed to generalize to any task where outcomes can be rigorously evaluated", and "With the right evaluation framework" even to "softer-reward domains" (§1; abstract). They add that reward hacking "is equally relevant in rejection sampling and supervised fine-tuning (SFT) pipelines" (§12).

## On this site

- **Discussed in:** [Bringing compact models to frontier accuracy](#/challenges/compact_model_accuracy) · [Self-improvement that compounds](#/challenges/compounding_self_improvement) · [Weak checkers get exploited](#/challenges/weak_checker_exploitation)
- **Tags:** <span class="tags"><a class="tag" href="#/tags/compact">compact</a><a class="tag" href="#/tags/rarelang">rarelang</a><a class="tag sub" href="#/tags/hacking-general">hacking-general</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/rlvr-general">rlvr-general</a></span>
