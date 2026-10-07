# Benchmarking Prompt Optimization of Large Language Models With Chess

**Benchmarking Prompt Optimization of…** · preprint 2026

Read: [PDF](https://arxiv.org/pdf/2610.00416) · [arXiv](https://arxiv.org/abs/2610.00416)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- A benchmark of 1,118 Lichess puzzles for prompt optimization of frozen LLMs (abstract).
- Cheap exact-match and engine-based scoring, with a renewable supply of problems (abstract).
- A checkable, renewable testbed for prompt optimizers; the SQL counterpart, a certified benchmark, is still a proposal here ([Benchmarks with checkable ground truth](#/challenges/checkable_benchmark_ground_truth); our reading).

## In plain words

Prompt optimizers score candidate prompts again and again, and benchmarks can saturate, leak into training data or need expensive grading. The authors argue this calls for a benchmark that is cheap and deterministic to score, hard, and renewable (abstract, §1). They build one from 1,118 puzzles of the Lichess chess site: the model gets a board position with its legal moves and must name the solution move, checked by exact match. They run six prompt optimizers on eight frozen LLMs and test whether optimized prompts help other models and short games against a chess engine.

They report that Gemini 3.5 Flash, the strongest model evaluated, solves only about 55% of puzzles, and that the largest gain in mean accuracy is 7.57 percentage points over the starting prompt, for Gemini 3.5 Flash Lite with the SIMBA optimizer (§5.1). Four of the eight models gain significantly under the authors' test; puzzle gains bring no statistically significant drop in mean engine-measured move loss in the evaluated games (§5.5). They present a new benchmark and comparison study (§1).

## Background and terms

**Terms to know:** [reflective prompt optimization](#/glossary/reflective-prompt-optimization) · [Pareto front](#/glossary/pareto-front) · [Elo rating](#/glossary/elo-rating).

**The paper's own terms:**
- **puzzle**: position–move pairs along a reference solution (one to five solver moves). Each position is queried separately; the puzzle counts as solved only if every predicted move matches (§3). **Position accuracy** counts single moves instead (App. B.2).
- **FEN, UCI, SAN**: FEN is a one-line text encoding of a board state; UCI writes a move as source and destination squares (`e2e4`) (App. A.1). SAN, not spelled out in the paper, is the usual short move notation (`Nf3`).
- **puzzle rating** (also "Elo" in the paper): Lichess's human-calibrated difficulty score from the Glicko-2 system, an Elo-like rating that also tracks uncertainty, treating a puzzle like an opponent that wins when the user fails (App. B.5).
- **meta-model**: the separate LLM, Gemini 3.5 Flash, that proposes and reflects on prompts; target models are the frozen LLMs optimized (§4).
- **textual and numerical feedback**: a written diagnosis of a failure, versus the scalar puzzle accuracy; "Non-reflective algorithms only rely on the scalar score" (§4.1).
- **decision endpoint**: Jev 1.13 "acts as a zero-shot classifier that chooses among the legal moves" instead of generating text, so it cannot play an illegal move (§4.2).
- **Stockfish, regret**: Stockfish is a chess engine, run at search depth 20. Regret is the gap between its evaluation of its own best move and of the model's move, in centipawns, hundredths of a pawn (§5.5, App. B.2).
- **rollout**: a short game from a starting position against Stockfish, at most ten model moves (§5.5).

**Missing glossary terms:**
- **one-sided Welch test**: a t-test of whether one group's mean exceeds another's, without assuming equal variances. The paper compares three optimizer runs with three baseline runs, "unadjusted", at p < 0.05 (Tab. 3 caption).

**Builds on:**
- DSPy ([DSPy](#/papers/khattab2023dspy "DSPy: Compiling Declarative Language Model Calls into Self-Improving Pipelines (2024)")), a framework that compiles LLM pipelines with optimizers; the paper runs its COPRO, BootstrapFewShot, BootstrapRandomSearch and SIMBA and cites DSPy for them (§4.1).
- GEPA ([GEPA](#/papers/agrawal2025gepa "GEPA: Reflective Prompt Evolution Can Outperform Reinforcement Learning (2026)")), a reflective, evolutionary prompt optimizer (§4.1).
- MIPROv2 ([MIPRO (shipped in DSPy as MIPROv2)](#/papers/opsahlong2024mipro "Optimizing Instructions and Demonstrations for Multi-Stage Language Model Programs (2024)")), a joint instruction-and-demonstration optimizer (§4.1).
- LLM chess studies (ChessGPT, LLM CHESS, Hwang et al.) for the input format (§3); not listed here.

## Problem and setting

- **Question:** whether chess gives automatic prompt optimization (APO) a cheap, deterministic, hard, renewable benchmark; then which models improve, where, with what prompts, and whether prompts transfer to other models and play (abstract, §5).
- **Setting:** frozen weights, black-box access; the goal is the prompt minimizing the summed loss over position–move pairs (§1, §3).
- **Data:** 1,118 Lichess puzzles split equally into 559 training and 559 test, stratified by solver moves and puzzle rating (400 to 2,800) (§3, Tab. 6). Since one- and two-move puzzles lie below rating 2000 and longer ones above, "Rating and length are therefore descriptive axes, not independent difficulty factors" (§3).
- **Correct:** exact match with the reference move; unparseable responses score as incorrect (§3). Input: FEN, side to move and legal moves in UCI; output: one move as JSON through DSPy's JSONAdapter, except Jev (§3, App. B.4).
- **Models:** Gemini 3.5 Flash Lite, Claude Haiku 4.5, GPT-4o Mini, Qwen3.8 27B, GPT-5.6 Luna, DeepSeek V4 Pro 0813, Muse Spark 1.2 Contributor and Jev 1.13, chosen for cost, provider diversity and rank in the Kaggle Game Arena, a chess leaderboard (§4.2). Targets run at temperature 0 (Jev has no temperature control), the meta-model at 1 (App. B.6); "Whenever possible, reasoning was set to low" (§4.2).
- **Runs:** three per condition on the test set, all from "Solve the chess puzzle by finding the single best move." (§4, Tab. 3). Each optimizer runs with "its standard recommended configuration" (§4.1), DSPy defaults unless noted (Tab. 11).

## Approach

- **Optimizers (§4.1):** **GEPA** mutates prompts, keeps those best on subsets of the evaluation set (Pareto-inspired), and uses execution traces with textual and numerical feedback. **COPRO** has the meta-model propose instruction variants and refines the best by score. **BootstrapFewShot (BFS)** adds traces the model solved as demonstrations; **BootstrapRandomSearch (BRS)** randomly searches over such demonstration sets. **MIPROv2** proposes instructions, bootstraps demonstrations and picks combinations by Bayesian optimization (search guided by a model of what scores well). **SIMBA** queries the model at several temperatures, compares successful and failed traces, and adds rules or demonstrations. Tab. 1 classifies them.
- **Analyses:** gains by rating, theme (Lichess tactic tags) and move index for three models (§5.2); prompt content, with instruction sentences labelled by Gemini 3.1 Flash Lite as formatting, chess instructions, examples or persona framing, unclassified output as Other (§5.3); transfer of each of seven source models' prompts, chosen as "the prompt with the highest single-run test-set puzzle accuracy", unchanged to the other models (§5.4); rollouts against Stockfish from ten starting conditions, an illegal or unparseable attempt ending the rollout (§5.5).

## Results

- **Baselines (Tab. 2):** Gemini 3.5 Flash leads at about 55% and becomes the meta-model (§4.2).
- **Optimization (Tab. 3, §5.1):** "most models improve with at least one optimizer, but the best optimizer varies from one model to another". The best gain is Flash Lite with SIMBA (7.57 percentage points). Jev 1.13, Qwen3.8 27B, DeepSeek V4 Pro and Flash Lite have significant gains; the other four none. Flash Lite overtakes Luna and Muse, which start above it, so the authors treat responsiveness to optimization as a property beside baseline strength (§5.1, §6).
- **Optimizers (Fig. 2b, §5.1),** "on this benchmark under the evaluated configurations": GEPA has the highest median gain and improves the mean for 6 of 8 models; SIMBA has the largest mean gain, "mainly driven by large improvements on Gemini 3.5 Flash Lite"; MIPROv2 and BFS fall below baseline more often than not.
- **Cost:** optimization raises evaluation cost for every model except Muse Spark (§5.1). The abstract says the complete study runs for around $800.
- **Where (§5.2, Figs. 3–4),** for the three highest-performing models with significant gains: across a large rating range but mostly not the highest-rated puzzles; per-move accuracy improves at most move indexes, even on long puzzles, with local losses.
- **Content (§5.3, Fig. 5):** one algorithm's prompts look alike across models; SIMBA stresses chess guidance and examples, GEPA longer chess instructions with formatting and persona. Flash Lite's prompts hold only examples and chess guidance, "showing that the largest gain does not require the longest prompt".
- **Transfer (§5.4, Fig. 6):** of 49 cross-model pairs, 31 have positive mean changes, 16 negative and two are unchanged, so "Transfer therefore depends on the source–target pairing". Jev's prompt improves all seven other models, while Flash Lite's, with the largest native gain, degrades five of the seven. Qwen, Jev, Haiku and DeepSeek receive significant gains from other models' prompts.
- **Play (§5.5, Tab. 4):** "Mean regret decreases slightly for all three optimized models", without "a statistically significant reduction in mean regret in the evaluated rollouts"; illegal-attempt rates rise for Flash Lite and Qwen and fall for DeepSeek.
- **Puzzle regret (App. B.2, Tab. 7):** median regret, position accuracy and puzzle accuracy give "similar, but not identical, model rankings".

## Limits the authors state

- "we cannot exclude pretraining exposure"; the advantage is "not guaranteed absence of contamination, but renewability" (§3).
- The comparison "reflects out-of-the-box behavior rather than performance under equalized compute budgets or optimizer-specific hyperparameter tuning" (§4.1).
- The minimal baseline is not about "whether APO outperforms the strongest model-specific manual prompts" (§4.2).
- Claude Haiku 4.5 "returned identical outputs in all seeds", so nonzero differences are marked significant (§5.4 footnote).
- Rollout regret is measured "on each prompt's own visited states, conditional on producing accepted moves, rather than on a shared position set" (§5.5).
- "Better tactical puzzle solving does not, by itself, establish better play from standard opening positions" (§5.5).
- Regret "can be very harsh if the model misses a checkmate or gets checkmated"; rank agreement "does not validate it as a general measure of playing strength" (App. B.2).

## Open problems and building blocks

- **Open:** no future-work section. "the hardest puzzles remain largely out of reach" (§6); long puzzles' low solve rates "leave room for methods that improve consistency across the entire reference line" (§5.2); "Tuning the formatting instructions can be a lever on its own to improve performance for some models" (§4.2); puzzles "can additionally be generated using RL approaches" (reinforcement learning), at greater cost (§1).
- **Released:** "the puzzles, optimization and evaluation code, and dataset-renewal scripts" (abstract; also §1).
- **To reuse it:** DSPy, models through the OpenRouter API service except Jev, which uses its own endpoint (Tab. 9, App. B.6), a separate meta-model, Stockfish for regret. GEPA's "heavy" setting is about 3,436 metric calls (Tab. 11); the eight-model panel had around $800 in recorded costs (§5).
- **Beyond its domain:** the authors call chess "an affordable testbed for APO before evaluation in more costly application domains" (§6), and say that in most domains (coding, mathematics, question answering) this "benchmark-to-deployment gap is far harder to estimate" (§5.5).

## On this site

- **Discussed in:** [Benchmarks with checkable ground truth](#/challenges/checkable_benchmark_ground_truth) · [Bringing compact models to frontier accuracy](#/challenges/compact_model_accuracy)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/promptopt-general">promptopt-general</a><a class="tag sub" href="#/tags/promptopt-misc">promptopt-misc</a></span>
