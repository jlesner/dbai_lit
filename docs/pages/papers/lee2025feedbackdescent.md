# Feedback Descent: Open-Ended Text Optimization via Pairwise Comparison

**Feedback Descent** · preprint 2025

Read: [PDF](https://arxiv.org/pdf/2511.07919) · [arXiv](https://arxiv.org/abs/2511.07919)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Optimizes text artifacts (prompts, code, molecules) with pairwise comparisons that carry textual critiques.
- Keeps the critique instead of collapsing it to a preference bit.
- Text optimization with richer feedback than a scalar reward; its abstract claims beating GEPA, its §4.3 says "competitive".

## In plain words

Reinforcement learning typically learns from scalar rewards or pairwise preferences, "at most a single bit per pair", which drop why one output is better; the authors aim to "widen this information bottleneck" (§1), for text artifacts (prompts, drawing code, molecules) whose quality is "easier to judge than to construct" (§2). Feedback Descent loops at inference time, with no weight updates: an LLM revises the current best artifact using the feedback gathered so far, an evaluator compares the two, returning a preference plus a written explanation, and the preferred one is kept (§1). The same loop runs on drawings, prompts and molecules (§1, §4). Idealized theory suggests why directional feedback can beat search using only scores or preferences (§2.3). The abstract says it outperforms the prompt optimizer GEPA, reinforcement-learning methods and graph-based molecule optimizers. On the DOCKSTRING benchmark (predicted protein binding) it finds molecules surpassing the 99.9th percentile of a database of over 260,000 compounds on six protein targets (abstract). Claiming no first, they present one framework with "competitive or superior performance versus specialized methods" (§1).

## Background and terms

**Terms to know:** [textual gradient](#/glossary/textual-gradient) · [LLM-as-a-judge](#/glossary/llm-as-a-judge) · [positional bias](#/glossary/positional-bias) · [best-of-N sampling](#/glossary/best-of-n-sampling) · [reflective prompt optimization](#/glossary/reflective-prompt-optimization) · [black-box optimization](#/glossary/black-box-optimization) · [Pareto front](#/glossary/pareto-front)

**The paper's own terms:**
- **Artifact**: any text being optimized (§2.1).
- **Evaluator**: given a candidate and the current best, returns a binary preference and textual feedback "explaining why the winner is better and how to improve" (§2.1, Eq. 1).
- **Rationale history**: past candidates with feedback, seen by the proposing LLM (§2.1–2.2, Alg. 1).
- **Zeroth-order vs first-order methods**: methods "that rely only on function evaluations or binary preferences" against methods using gradients (§2.3).
- **No Feedback, Random Feedback, Binary Only** (§4.4): ablations that sample in parallel and keep the best, shuffle rationales between molecule pairs, or give only the preference bit.

**Builds on:**
- TextGrad ([TextGrad](#/papers/yuksekgonul2024textgrad "TextGrad: Automatic 'Differentiation' via Text (2024)")), "The closest prior work", which the authors say optimizes "pointwise", "based only on the latest one", while Feedback Descent keeps a buffer of past feedback (§3, §4.4).
- GEPA ([GEPA](#/papers/agrawal2025gepa "GEPA: Reflective Prompt Evolution Can Outperform Reinforcement Learning (2026)")), a reflective prompt evolution method, whose tasks, models, programs and baseline numbers are reused (§4.1, §4.3, App. C.1).
- LLM-driven evolutionary search: "Feedback Descent can be viewed as an evolutionary algorithm" (§3).
- Preference learning, and work adding rationales to weight-based training; here rationales are used at inference time (§3).

## Problem and setting

Question (§4): "Can a single optimization framework, with no domain-specific engineering, match or exceed specialized methods purely through structured feedback?".

- **SVG drawings** (§4.1–4.2, App. C.1): five judge prompts, each preferring a style, and four subjects (Tab. 1). GPT-5-mini judges each pair twice, order swapped against order bias, and declares a winner only if both agree, retrying up to three times (§4.1). §4.2 names two generators, GPT-4o-mini and GPT-5-mini. Baseline: direct prompting with the full rubric; Feedback Descent runs 5 rounds.
- **Prompt optimization** (§4.1, §4.3): GEPA's setup on HotpotQA ([multi-hop question answering](#/glossary/multi-hop-question-answering)), IFBench (instruction following), PUPA (privacy-aware delegation) and HoVer (retrieval-augmented verification), with Qwen3-8B and GPT-4.1 mini. All stages' prompts are optimized jointly, picked by validation accuracy and scored on held-out test examples. Baselines: the default prompt of the DSPy program (DSPy: a framework for programs of LLM calls, [DSPy](#/papers/khattab2023dspy "DSPy: Compiling Declarative Language Model Calls into Self-Improving Pipelines (2024)")), MIPROv2 ([Bayesian optimization](#/glossary/bayesian-optimization) of instructions and demonstrations, [MIPRO (shipped in DSPy as MIPROv2)](#/papers/opsahlong2024mipro "Optimizing Instructions and Demonstrations for Multi-Stage Language Model Programs (2024)")), [GRPO](#/glossary/grpo) (online reinforcement learning) and GEPA, numbers copied from GEPA's paper; "All baselines are run under matched rollout budgets for fair comparison" (§4.3).
- **Molecules** (§4.1, §4.4, App. C.1): DOCKSTRING (predicted binding to "medically relevant targets") on six protein targets; its 260,155-molecule database gives reference percentiles (Tab. 3). Feedback includes descriptors from RDKit (a chemistry toolkit), similarity to known compounds, docking results and UniProt protein data (§4.1). Runs start from three seed molecules with "a batch size of 8 and top-k selection of 10 examples" (App. C.1). Baselines (§4.4): SMILES GA (a [genetic algorithm](#/glossary/genetic-algorithm)), REINVENT (reinforcement learning), Graph MCTS ([Monte Carlo tree search](#/glossary/monte-carlo-tree-search-mcts)) and Graph GA (fragment-based, on molecular graphs), GP-BO (Bayesian optimization on graphs), and TextGrad; Feedback Descent and TextGrad run 1000 steps.

## Approach

- **The loop (§2.2, Alg. 1).** Start from an artifact made from the task description alone. Each iteration the LLM proposes a candidate from the current best and the accumulated feedback (Eq. 2); the evaluator compares the two; "Regardless of the preference outcome, we always add the feedback to our history", and a preferred candidate becomes the new best (§2.2).
- **Gradient analogy (§2.3).** Feedback is a "heuristic directional cue", like a gradient; "under idealized assumptions", rationale-guided updates "can achieve linear convergence rates independent of effective dimensionality" (the gap to the optimum shrinks by a fixed factor per step, whatever the search space's dimension), "while zeroth-order baselines scale exponentially worse".
  - Prop. 1: if the score is L-smooth (gradient changes at a bounded rate) and meets the PL condition (for maximization), each step direction is on average a fixed positive multiple of the true gradient with spread at most a fixed multiple of the gradient's size, and steps stay in the allowed region, then with the stated step size the expected gap to the best score shrinks by a fixed factor per iteration, so accuracy ε takes on the order of log(1/ε) iterations, times a factor set by those constants. App. A.1: the query count is dimension-independent when each query gives a full direction at unit cost, linear in dimension when it reveals one random gradient coordinate.
  - Prop. 2: on a strongly concave quadratic (a dome-shaped score with one peak) over a ball in d dimensions, a hypercubic grid guaranteeing a point within the ε-optimal ball (points scoring within ε of the best) for every position of the optimum needs a number of points exponential in d and polynomial in 1/ε with exponent d/2, "on this family".
  - Prop. 3: there, the best of N uniform random points in the ball leaves an expected gap of at least a constant times (N + 2) to the power −2/d, for all d ≥ 1.
- **Pairwise feedback for prompts (§4.3; details in App. C.1 under "IFBench Prompt Optimization").** Training examples are split into four quadrants by which prompt answered correctly; the same LLM proposes about 20 hypotheses per category and tags each example; a hypothesis is kept if Fisher's exact test (a significance test on counts) gives p < 0.1, it holds on at least 3 examples (support), and its lift (how much likelier an outcome is when it holds) passes a threshold.

## Results

- **SVG (Tab. 1, §4.2).** After five iterations Feedback Descent "matches or outperforms the baseline on all combinations tested", winning at least 50% against direct prompting (Tab. 1 caption); the text says that for both generators it improves outputs "over the initial population".
- **Prompts (Tab. 2, §4.3).** The authors call it "competitive with GEPA across both models, achieving the best performance on IFBench and Hover, while GEPA leads on HotpotQA and PUPA": e.g. HoVer with Qwen3-8B 60.00 against GEPA's 52.33, PUPA with GPT-4.1 mini 85.66 against 94.47. It is above GRPO on all four Qwen3-8B tasks.
- **Molecules (Tab. 3, §4.4).** It "outperforms all baselines and achieves the strongest scores on all targets": average 9.908 against GP-BO's 9.463, REINVENT's 8.899 and TextGrad's 7.888, and the database's 99.9th percentile of 9.235. On multiple proteins it surpasses even the database's best molecule (§4.4). On PPARG (Fig. 4) its trajectories are "competitive" with specialized methods, reaching high scores with "comparable or fewer oracle calls" (calls to the scorer), and "This pattern holds across targets" (§4.4).
- **Molecule quality (§4.4, Figs. 5–6).** For PPARG, molecules sit "on or above the DOCKSTRING frontier" of binding against drug-likeness. Correlations of score with Tversky similarity of molecular fingerprints (bit patterns of substructures) to approved drugs are "weak or negative" ([Spearman](#/glossary/spearmans-rank-correlation) ρ between −0.39 and 0.40), read as novelty.
- **Ablations (Tabs. 3–4, §4.4).** Averages fall to 8.127 (No Feedback), 7.805 (Random Feedback) and 8.168 (Binary Only) against 9.908; "Random feedback underperforms even best-of-N", and the Binary Only gap is "1.74 docking score units". With rationales shuffled at set rates (Tab. 4) "The method degrades gracefully", 50% noise staying above the 99.9th percentile for ADRB1 and PGR.
- **Feedback alignment (Tab. 5, §4.4).** An LLM judge decides whether a new molecule follows true or scrambled feedback; true feedback wins 81% of 400 comparisons (p < 10⁻¹⁰, binomial test) on four targets.

## Limits the authors state

- "The method relies on strong evaluators, which may be scarce in some domains" (§5).
- "Training models to produce reliable feedback remains a prerequisite for harder tasks" (§5).
- For creative domains, strictly following the gradient "may be limiting" (§5).
- Textual feedback "is not a literal gradient" and is "approximate and occasionally contradictory"; the theory gives "motivation rather than rigorous guarantees for the discrete text domains we study empirically" (§2.3).
- "We do not claim to present a state-of-the-art prompt optimizer" (§4.3).
- Fragment-based baselines use graph priors, so "the most direct comparison is to the text-only baselines: SMILES-GA and REINVENT" (§4.4).
- CDK2 is left out of the novelty analysis, lacking fully approved drugs in DrugBank (a drug database) that meet the inclusion criteria (§4.4).

## Open problems and building blocks

- **Open:** "balancing refinement with exploration is an important next step" (§5).
- **Released:** Nothing stated.
- **To reuse it:** an evaluator that compares and explains, and an LLM that proposes edits (§2). GPT-5-mini as SVG generator and judge (App. C.1); for IFBench, the same LLM as hypothesis writer and tagger, 10 iterations (Qwen3-8B) or 15 (GPT-4.1 mini) (App. C.1); for molecules, DOCKSTRING docking and the feedback tools of §4.1.
- **Beyond its domain:** the loop is "task-agnostic" (abstract), and "JSON configs" are among its artifacts (§1).

## On this site

- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/promptopt-feedback">promptopt-feedback</a><a class="tag sub" href="#/tags/promptopt-general">promptopt-general</a></span>
