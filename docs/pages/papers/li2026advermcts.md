# AdverMCTS: Combating Pseudo-Correctness in Code Generation via Adversarial Monte Carlo Tree Search

**AdverMCTS** · preprint 2026

Read: [PDF](https://arxiv.org/pdf/2604.10449) · [arXiv](https://arxiv.org/abs/2604.10449)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Code generation as a game between two MCTS agents on one LLM: a Solver searches over reasoning steps and writes programs, and an Attacker searches for test inputs on which the programs that pass the public tests disagree; an LLM arbiter labels each such input's expected output, and the labelled tests then screen new programs, penalize failing branches and re-rank the final candidates (abstract; §3.3–3.6).
- Qwen3-4B-Instruct and Qwen3-8B on 100 problems per split of APPS and TACO with at most 5 public tests, scored by pass rate and pass@1 on the hidden tests (§4.1), against best-of-16, PG-TD, ToT, LATS and MCTS variants (Tab. 1); DeepSeek-V3.2 in a scaling test (§4.3).
- A search that grows its own refuting tests against a weak check ("pseudo-correctness": programs that pass the public tests and fail hidden ones, §1). Disagreement among candidates finds the input but cannot label it; the authors report that labels from a majority vote of the candidates were valid for 37.88% of TACO tests, measured against gold code (Tab. 3), the trap a differential tester without an oracle faces.

## In plain words

LLM code-search methods usually judge programs by a few public example tests, so a program can pass them yet fail the hidden tests that grade it. The authors call this pseudo-correctness and argue that "the bottleneck is not the Solver's capacity to generate correct solutions, but the environment's capacity to discriminate them at inference time" (§1). AdverMCTS runs two tree searches on one LLM: a Solver writes programs, and an Attacker seeks inputs on which programs that pass the public tests disagree. The LLM then decides each such input's correct output, and these new tests screen, penalize and re-rank programs (abstract; §3). With Qwen3-4B-Instruct and 16 search rounds, the authors report the best average pass@1 (a score of problems solved, on the hidden tests) on two competitive-programming benchmarks: 49.67% against 43.67% for the best baseline on APPS, and 38.00% against 35.00% on TACO (Tab. 1). They present it, "To the best of our knowledge", as "the first to unify code search with an active adversarial test search at test time to tackle competition-level programming problems" (§1).

## Background and terms

**Terms to know:** [Monte Carlo tree search (MCTS)](#/glossary/monte-carlo-tree-search-mcts) · [multi-armed bandit (UCB)](#/glossary/multi-armed-bandit-ucb) · [pass@k](#/glossary/passk) · [test-time scaling](#/glossary/test-time-scaling) · [best-of-N sampling](#/glossary/best-of-n-sampling) · [differential testing](#/glossary/differential-testing) · [test oracle](#/glossary/test-oracle) · [LLM-as-a-judge](#/glossary/llm-as-a-judge)

**The paper's own terms:**
- **pseudo-correctness**: "generating solutions that overfit the public tests while failing on the underlying logic required by the hidden test suite" (§1). The authors tie it to a survivorship bias: many programs that survive the public tests are only overfitted to them (§1).
- **public and hidden tests**: each problem's tests split into a small visible public set and a larger hidden set; the method sees only the problem and the public tests (§3.1).
- **corner case**: a test input at an unusual edge of the problem, which public tests tend to miss (§1).
- **Solver and Attacker**: the two agents of the "minimax-style game" (abstract), a game in which one side tries to make the other fail: the Solver searches for programs, the Attacker for inputs that expose them (§3.2).
- **Code Pool**: accepted programs, each passing all public tests and the tests found before it entered; later failures are penalized (§3.3–3.5).
- **Global Test Filter** (GF-Hub in the ablation): the growing store of labelled adversarial tests, used as a gate for new programs and for the final ranking (§3.5, §4.4).
- **DMTS (Divergence-driven Multi-sample Test Synthesis)**: the Attacker samples several candidate inputs and keeps the one that splits the pool's outputs most (§3.4).
- **LLM-based Output Arbiter**: the LLM, prompted with the problem, the public tests, the input and the differing outputs, names the correct output or discards the input (§3.5; prompt in App. D.5).
- **rollout**: one round of the Solver's search, which ends in a full program; the main runs allow 16 (§4.1, Tab. 1).
- **MCTS-Thought**: the authors' baseline that runs MCTS over reasoning steps and writes code from them, adding execution feedback to the context (App. B).
- **pass rate and pass@1**: the two metrics, computed on the hidden tests and called "standard" without a definition (§4.1); in the usual sense, pass rate is the average share of hidden tests passed and pass@1 the share of problems solved.

In the glossary's terms (our reading), the Attacker's divergence check is [differential testing](#/glossary/differential-testing) among candidate programs, and the arbiter is an LLM acting as a [test oracle](#/glossary/test-oracle).

**Builds on:**
- RethinkMCTS (Li et al., 2025e), which searches over reasoning steps and repairs wrong ones; the authors follow its evaluation protocol and compare against it (§2, §4.1, App. B). Not on this site.
- The search baselines PG-TD (Zhang et al., 2023; token-level lookahead with test execution), Tree of Thoughts (Yao et al., 2023; [Tree of Thoughts](#/papers/yao2023tot "Tree of Thoughts: Deliberate Problem Solving with Large Language Models (2023)")) and LATS (Zhou et al., 2023; MCTS over code with self-reflection), which the authors call single-agent search (§2, §4.1, App. B).
- CodeT (Chen et al., 2022; [CodeT](#/papers/chen2022codet "CodeT: Code Generation with Generated Tests (2023)")), which "generates additional tests to select solutions" (§2).
- Set apart from fixed-signal self-improvement such as Reflexion (Shinn et al., 2023; [Reflexion](#/papers/shinn2023reflexion "Reflexion: Language Agents with Verbal Reinforcement Learning (2023)")) and from adversarial training such as ATGen (Li et al., 2025d) (§2).

## Problem and setting

- **Question:** from the problem text and public tests alone, return a program that does well on the hidden tests (§3.1).
- **Tasks:** competitive-programming problems in Python (App. D.2) from APPS (Hendrycks et al., 2021; splits Introductory, Interview, Competition) and TACO (Li et al., 2023b; splits Easy, Medium, Hard), 100 problems per split following prior work, with at most 5 public tests per problem (§4.1).
- **Correctness:** pass rate and pass@1 on the hidden test suite (§4.1). During search no hidden test is used; the arbiter supplies expected outputs (§3.5).
- **Models:** Qwen3-4B-Instruct-2507 and Qwen3-8B (non-instruct) for both agents; DeepSeek-V3.2 (671B) in the scaling test (§4.1, §4.3).
- **Baselines (§4.1, App. B):** Base (one zero-shot program), Best-of-N with 16 samples chosen by public tests (Tab. 1's "Base (16)"), PG-TD, ToT, LATS, MCTS-Thought and RethinkMCTS.
- **Not discussed:** repeated runs or variance; the backbone behind Figs. 4–7 and Tabs. 2–4 (App. C.1 states Qwen3-4B-Instruct for its own test).

## Approach

- **Solver MCTS (§3.3).** A node is the problem plus a sequence of reasoning steps. Selection uses a UCB-style score with the LLM's prior; expansion samples several next steps; simulation is a "semantic simulation": the LLM writes a full program from the new step, so programs appear throughout the search. A program enters the Code Pool only if it passes all public tests and all tests in the Global Test Filter. The reward is the public-test pass rate, minus a penalty when the program later fails an adversarial test.
- **Attacker MCTS (§3.4).** A persistent tree, kept across iterations, whose nodes are testing strategies (e.g., "Test with large prime inputs"). It runs once the pool holds at least two programs (Alg. 1). For a new strategy, the LLM writes several candidate inputs while seeing the pool's programs; each input is run on all of them, and its reward is positive when at least two outputs differ, scaled by a weight meant "to normalize this reward by the number of unique outputs". The most divergent input is kept and its reward backpropagated.
- **Arbiter and filter (§3.5).** For a divergent input, the arbiter gives the expected output or discards the input as ambiguous or invalid. Each labelled test joins the Global Test Filter; programs that fail it get the penalty on their reasoning nodes, and later programs must pass it to enter the pool.
- **Final choice (§3.6).** Programs are sorted by public-test pass rate, and ties are broken by their pass rate on the adversarial tests. App. C.2 reports that this re-ranking beats subtracting penalties alone, and the authors conclude that adversarial tests work best "as hard constraints rather than soft regularizers".
- Pseudocode: Alg. 1 (App. E); all prompts: App. D.

## Results

- **Main table (Tab. 1).** With both Qwen3 backbones, AdverMCTS has the highest value, or a tie for it, in every column of pass rate and pass@1 on APPS and TACO. With Qwen3-4B-Instruct, average pass@1 is 49.67% against 43.67% for RethinkMCTS on APPS, and 38.00% against 35.00% for PG-TD on TACO.
- **Scaling (§4.3, Fig. 3).** Across Qwen3-8B, Qwen3-4B-Instruct and DeepSeek-V3.2, the authors report "a strictly monotonic upward trend" and that AdverMCTS "consistently outperforms both the strong sampling baseline (Base-16) and the search baseline (MCTS-Thought) across all settings".
- **Ablations (§4.4, Fig. 4; §4.5, Tab. 2).** Removing the Attacker tree, DMTS or the filter's gate each lowers average pass@1, the Attacker tree most (in the authors' words, "all modules contribute positively"). Hiding the pool from the Attacker, or replacing its MCTS with Best-of-N or random selection, also lowers average pass@1 on both benchmarks.
- **Cost (§4.5, Fig. 5).** On a [Pareto front](#/glossary/pareto-front) of pass@1 against average tokens per problem, the authors report that on both benchmarks AdverMCTS at 16 rollouts beats MCTS-Thought at 32 while using fewer tokens.
- **Test quality (§4.5, Fig. 7).** Against the hidden tests, the Attacker's tests reject 56.7% (165 of 291) of programs that pass the public tests but fail hidden ones, wrongly reject 16.1% of fully correct programs, and have precision 78.95%.
- **Dynamics (§4.5, Fig. 6).** On 100 problems from APPS-Competition and TACO-Hard, the number of found corner cases and the pool's hidden pass rate rise together over 16 rollouts; the authors report "a strong positive correlation".
- **Labelling (§4.5, Tab. 3).** Labelling inputs by a [majority vote](#/glossary/self-consistency-majority-voting) of the pool gives valid labels for 37.88% of TACO tests against 79.88% for the arbiter, measured against gold code; the authors read this as "the majority of solutions frequently converged on incorrect outputs".
- **Motivating test (App. C.1, Fig. 8).** MCTS-Thought with Qwen3-4B-Instruct, given the full hidden suite as its check instead of 5 public tests, rises from 43.44% to 55.33% pass@1 on APPS and from 31.00% to 43.67% on TACO; the authors take this as evidence that "pseudo-correctness is the primary bottleneck".
- **Attacker budget (App. C.3, Fig. 9).** Over 1 to 4 Attacker rollouts per iteration, pass@1 follows an inverted U on APPS and TACO; 2 is the default.

## Limits the authors state

- Output divergence "cannot detect the case where all candidates agree on the same wrong output" (§3.4).
- More Attacker search "brings diminishing returns and can even hurt performance": "a more aggressive search may over-optimize the divergence objective and produce tests that are less reliable as supervision signals" (App. C.3).
- "there is a potential risk of misuse for generating malicious software" (Impact Statement).

## Open problems and building blocks

- **Open:** the authors believe the work "opens new avenues for enhancing LLM reasoning robustness through autonomous, adversarial self-improvement" (§5). No other open problems stated.
- **Released:** "The resources of this work are available at" an anonymized link (abstract).
- **To reuse it:** one backbone LLM serves as Solver, Attacker and arbiter (§4.1, §4.5); the generated programs and inputs must be executed (App. D.4). Settings: Solver exploration constant 4, 2 Attacker rollouts per iteration, at most 16 rollouts, penalty 0.1, inference with vLLM (§4.1).

## On this site

- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/cex-general">cex-general</a><a class="tag sub" href="#/tags/cex-llm">cex-llm</a><a class="tag sub" href="#/tags/hacking-general">hacking-general</a><a class="tag sub" href="#/tags/harness-general">harness-general</a><a class="tag sub" href="#/tags/llm-assist">llm-assist</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/scaling-general">scaling-general</a></span>
