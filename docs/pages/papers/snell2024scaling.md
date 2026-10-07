# Scaling LLM Test-Time Compute Optimally can be More Effective than Scaling Model Parameters

**compute-optimal test-time scaling** · preprint 2024

Read: [PDF](https://arxiv.org/pdf/2408.03314) · [arXiv](https://arxiv.org/abs/2408.03314)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Compares search against verifiers with sequential revisions, by problem difficulty.
- A compute-optimal allocation per prompt.
- Compute-matched test-time compute can beat a larger model, on problems where the small model already has some success (abstract); shown for revisions, mostly not for PRM search (Fig. 9); not on the hardest ones (§7).

## In plain words

A language model can be given extra computation when it answers: it can sample many answers and let a trained checker pick one, or revise its own answer several times. The authors ask how best to spend a fixed amount of this answer-time computation on each question, and whether it can stand in for a bigger model; they see it as a step towards self-improving agents (abstract, §1). On a competition-math benchmark with one Google model, they find the best method depends on how hard the question is for the model. Choosing the method by difficulty level beats sampling many answers and taking the checker's favourite while using up to four times less computation with revisions, and nearly does so with search (§5.3, §6.2). At equal total computation, extra answer-time computation can beat a model about 14 times larger on questions the small model already sometimes solves, but not on the hardest ones (abstract, §7). They say they show this "for the first time" (§8).

## Background and terms

**Terms to know:** [outcome and process rewards](#/glossary/outcome-and-process-rewards) · [pass@k](#/glossary/passk) · [self-consistency (majority voting)](#/glossary/self-consistency-majority-voting) · [reinforcement learning](#/glossary/reinforcement-learning) · [Distillation into compact models](#/glossary/distillation) · [best-of-N sampling](#/glossary/best-of-n-sampling) (§1) · [beam search](#/glossary/beam-search) (§5.2) · [MCTS](#/glossary/monte-carlo-tree-search-mcts) (the paper calls lookahead search MCTS without the randomness, §5.2) · [value function](#/glossary/value-function) (the paper reads its PRM's per-step predictions as values, §5.1)

**The paper's own terms:**
- **proposal distribution and verifier**: the two ways to use test-time compute: change what the model samples (e.g. condition on earlier attempts), or select among or search over samples with a scorer (§2).
- **PRM (process reward model)**: here a PaLM 2-S* model fine-tuned to predict, after each step, the chance that continuing from it ends in a correct answer. Its targets come from 16 sampled continuations per step, not human labels, following Math-Shepherd (§5.1, App. D); a solution is scored by the prediction at its last step (§5.1, App. E). An **ORM** (outcome reward model) scores only the final answer (App. F).
- **best-of-N weighted**: sum the verifier scores of all sampled answers that reach the same final answer, and return the final answer with the largest sum; from Li et al. (§5.1).
- **revision model**: a model fine-tuned to produce a new attempt given up to four earlier wrong attempts in context (§6.1). **Sequential** sampling chains revisions, **parallel** sampling draws independent attempts, and the **sequential-to-parallel ratio** splits a budget between them (Fig. 5).
- **generation budget**: the number of sampled answers; lookahead search with k extra steps is charged N×(k+1) for N beams (§5.3).
- **difficulty bins**: questions split into five equal-size groups by the base model's pass@1 rate, estimated from 2048 samples per question; bin 1 is easiest, bin 5 hardest. **Oracle** bins use ground truth; **predicted** bins use the verifier's average score and show similar trends (§3.2, App. C).
- **compute-optimal scaling strategy**: for a prompt and budget, the settings of a test-time method (search type, beam width, sequential-to-parallel ratio) that maximize the chance of a correct answer (§3.1, Eq. 1); approximated by the best setting per difficulty bin (§3.2).

**Builds on:**
- [Let's Verify Step by Step](#/papers/lightman2023verify "Let's Verify Step by Step (2023)"): process-based verifiers, the data split, difficulty definition, prompt and grader (§3.2, §4, App. G).
- Math-Shepherd (Wang et al.), for training PRMs without human labels (§5.1); not listed here.
- Recursive Introspection (Qu et al.), whose recipe for revision models the paper modifies (§2, §6.1); not listed here.
- BFS-V (breadth-first search over partial solutions, pruned by a value score) from [Tree of Thoughts](#/papers/yao2023tot "Tree of Thoughts: Deliberate Problem Solving with Large Language Models (2023)") and Feng et al., which its beam search resembles (§5.2); best-of-N with a verifier as in [GSM8K and trained verifiers](#/papers/cobbe2021verifiers "Training Verifiers to Solve Math Word Problems (2021)") (§2).

## Problem and setting

- **Question:** which use of a test-time budget is best for a given prompt, and how does it compare with a much bigger model (§3 "Problem setup" box)? Should extra FLOPs (floating-point operations) go to pretraining or test time (§7)?
- **Data and model:** MATH, high-school competition math, with the 12k train / 500 test split of [Let's Verify Step by Step](#/papers/lightman2023verify "Let's Verify Step by Step (2023)"); base model PaLM 2-S* (Codey), a Google PaLM 2 model, fine-tuned into the PRM, ORMs and the revision model (§4, §1 footnote). Correct means the final answer matches ground truth, graded with Lightman et al.'s grader (App. G). The authors "believe" the model is representative and findings "likely transfer" (§4).
- **Strategy selection:** per bin and budget, the best setting is chosen by two-fold cross-validation within each test-set bin (§3.2). The compute for estimating difficulty is not counted (§3.2).
- **FLOPs exchange (§7):** pretraining costs 6 × parameters × pretraining tokens, inference 2 × parameters × generated tokens; the larger model has about 14 times more parameters on the same data and is decoded greedily. Matching its FLOPs buys the small model more inference compute, more so with fewer inference tokens per pretraining token (R); R = 0.16, 0.79 and 22 are compared.

## Approach

- **Search against the PRM (§5.2, Fig. 2).** Beam search samples N first steps, keeps the top N/M by PRM score, samples M continuations of each, and repeats (at most 40 rounds), then applies best-of-N weighted. Lookahead search scores each step by rolling out up to k further steps at temperature 0 and taking the PRM's score at the end; beam search is k = 0. Swept: beam width √N or 4, lookahead k = 3 or 1, budgets up to 256 (§5.3).
- **Revisions (§6.1, App. H).** From 64 samples per training question, each correct answer is paired with 0–4 incorrect ones as context (one picked by character edit distance), and the model is fine-tuned to output the correct one. Long chains keep the last four attempts. Answers are chosen by an ORM trained on revision outputs with the history in context, or by majority vote (App. I, J).

## Results

- **Search methods (§5.3, Fig. 3 left):** the authors report that beam search beats best-of-N at small budgets but falls below it at large ones; lookahead search generally does worse. They attribute this to exploitation of the PRM, e.g. repetitive steps or one- or two-step solutions (Fig. 29).
- **By difficulty (Fig. 3 right):** on bins 1–2 beam search degrades as the budget grows; on bins 3–4 it beats best-of-N; on bin 5 no method makes much progress (§5.3).
- **Compute-optimal search (§5.3, Fig. 4):** at low budgets it "can nearly outperform" PRM best-of-N "using up to 4x less test-time compute (e.g. 16 verses 64 generations)"; at high budgets the gains shrink with predicted bins but continue with oracle bins.
- **Revisions (§6.1–6.2):** pass@1 rises with each revision step, beyond the four trained on (Fig. 6 left); sequential narrowly beats parallel (Fig. 6 right). Without a selection step, around 38% of correct answers are revised back to incorrect (§6.1). At a budget of 128, easier bins do best fully sequential, harder ones at an intermediate ratio (Fig. 7 right).
- **Compute-optimal revisions (§6.2, Fig. 8):** it "can outperform best-of-N using up to 4x less test-time compute (e.g. 64 samples verses 256)", with oracle or predicted bins, as parallel sampling plateaus.
- **Elsewhere:** the abstract states "more than 4×"; §1 says both methods surpass best-of-N with about 4× less.
- **Against a ~14× larger model (§7, Fig. 9)****:** the authors report that test-time compute is better for easy or intermediate questions ("bins 1/2/3 and sometimes 4") or low inference load, and pretraining for bins 4/5 or large R. For revisions, Fig. 1 (right) shows relative gains of +21.6%, +27.8% and +11.8% on bars labelled Easy, Medium and Hard at R << 1, against +5.4%, −24.3% and −37.2% at R >> 1, with a "similar trend with PRM search".
- **Verifiers:** last-step scoring beats minimum and product (App. E); the PRM beats an ORM (App. F).
- **ReST^EM (App. K, Fig. 16):** after further training with this simplified RL method, extra sequential revisions "substantially" hurt.

## Limits the authors state

- Estimating difficulty needs "a non-trivial amount of test-time compute itself" (§8); the experiments "do not account for this cost largely for simplicity" (§3.2); App. C calls it "extremely costly".
- The methods gave "small gains on hard problems" (§8); test-time and pretraining compute are not one-to-one exchangeable (§7 takeaway).
- Revision and verification had to be fine-tuned in, as these capabilities "are absent even in strong proprietary LLMs" (§1 footnote).
- PRM800K, the PRM training data Lightman et al. released, was "largely ineffective" for them, likely from distribution shift between its GPT-4 samples and PaLM 2 (§5.1).
- Search configurations were not swept exhaustively (§5.3).
- Revision data came from independent samples, not on-policy multi-turn rollouts, for cost, and held only wrong answers in context (§6.1); the revision verifier is an ORM, for labelling cost (App. J).
- Pretraining is scaled in parameters with data fixed (§7).

## Open problems and building blocks

  - Combine PRM tree search with revisions, and try methods such as critique and revise (§8).
  - Estimate difficulty cheaply, e.g. with a model that predicts it, or switch between assessing difficulty and solving (§8, App. C).
  - Distill test-time outputs back into the base model for iterative self-improvement (§8).
  - Apply difficulty-based allocation to other test-time methods, such as tools or learned thought tokens (App. A).
  - Compute-optimal pretraining, scaling data and parameters together (§7); PRM training as representation learning (App. E); offline data collection for ReST^EM (App. K).
- **Released:** Nothing stated.
- **To reuse it:** a base model that can be fine-tuned as a PRM (App. D) and a revision model (App. H); 2048 samples per question to bin difficulty (§3.2); a 4-shot prompt from PRM800K (App. G).
- **Beyond its domain:** the authors say their findings can help build MCTS-like self-play algorithms "that can operate on open-ended natural language" (App. A).

## On this site

- **Discussed in:** [Bringing compact models to frontier accuracy](#/challenges/compact_model_accuracy) · [Weak checkers get exploited](#/challenges/weak_checker_exploitation) · [Whole-job reliability of multi-step LLM work](#/challenges/whole_job_reliability)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/hacking-general">hacking-general</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/scaling-general">scaling-general</a></span>
