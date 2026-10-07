# Program Semantic Inequivalence Game with Large Language Models

**Program Semantic Inequivalence Game…** · NeSy 2026 (PMLR vol. 284, per the v3 PDF's first-page header) · 2025

Read: [PDF](https://arxiv.org/pdf/2505.03818) · [arXiv](https://arxiv.org/abs/2505.03818)  
Code: [semantic_neq_game](https://github.com/Avmb/semantic_neq_game)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- A generator makes semantically different variants of real programs and an evaluator must find inputs on which they differ; the two train each other (abstract).
- Rejection-sampled supervised fine-tuning with difficulty targeting, since RL was not available through the API they used (§2.2).
- A self-play refuter for programs: a proposer of inequivalent pairs and a solver that must produce a distinguishing input (our reading).

## In plain words

Large language models can do well on everyday code but "can fail on complex tasks that require non-trivial reasoning about program semantics", and training examples for such tasks "can be challenging" to find (abstract). The authors build a two-player game. A generator takes a short real Python program and writes a changed version that behaves differently, with an input that shows the difference; an evaluator must find an input on which the two differ. Running both programs decides who wins, and both players are fine-tuned on their own outputs that pass this check, on two OpenAI models (§2, §3.1).

Without chain of thought, the trained evaluator of gpt-4o-mini rose from 1.65% to 5.35% on a benchmark of trick snippets that swap two built-in Python names; for gpt-4.1-nano it did not help (§3.3.1). The authors also report small gains in spotting security flaws when answering directly or by majority vote, including in C and C++ code after training only on Python (abstract; §3.3.2). They present a game with "no theoretical performance cap" (§1).

## Background and terms

**Terms to know:** [self-play](#/glossary/self-play) · [rejection sampling](#/glossary/rejection-sampling) · [decidable and undecidable](#/glossary/decidable-and-undecidable) · [certificate](#/glossary/certificate) · [data contamination](#/glossary/data-contamination) · [pass@k](#/glossary/passk) · [LoRA](#/glossary/lora-low-rank-adaptation) · [reinforcement learning](#/glossary/reinforcement-learning) · [halting problem and Rice's theorem](#/glossary/halting-problem-and-rices-theorem)

**The paper's own terms:**
- **semantically equivalent programs**: on every input they "either both halt with the same output or both fail to halt"; otherwise an input on which their results differ is a **diverging input** (§2.1). Bob's prompt also counts different exceptions as different results (App. K).
- **Alice, the generator; Bob, the evaluator** (§2): Alice turns a program P into a variant Q plus a diverging input; Bob, given P and Q, must find one himself (§2.1).
- **SInQ**: "semantic inequivalence game", the method's name (abstract); the tables' label for the trained Bobs (Tabs. 1–3).
- **grounded**: P is sampled from a dataset of real-world programs, not written by Alice (§2.1).
- **difficulty**: 10 × (1 − the fraction of Bob's N sampled answers that are correct) (§2.2). **Hard** means difficulty ≥ 5; the **target difficulty** is what Alice is asked for, "usually the maximum value of 10" (§2.2).
- **zero-sum / positive-sum**: one player's gain is the other's loss / both can gain. Target 10 makes the game zero-sum "if Alice never produces invalid instances"; a lower one makes Alice act "as a teacher" (App. J).
- **intrinsic / extrinsic evaluation**: Bob's play in the game (§3.2) versus other code benchmarks, each trained Bob compared primarily against its own base model (§3.3).

**Builds on:**
- Self-play in Go, chess (AlphaZero) and other games, which "typically needs external engines to enforce rules and score play" (§1).
- Absolute Zero ([Absolute Zero](#/papers/zhao2025absolutezero "Absolute Zero: Reinforced Self-play Reasoning with Zero Data (2025)")), the "only one concurrent work" the authors know of that uses self-play for arbitrary code generation (§1); its proposer "invents tasks from scratch", unlike their grounded generator (§4).
- STP ([STP](#/papers/dong2025stp "STP: Self-play LLM Theorem Provers with Iterative Conjecturing and Proving (2025)")), conjecture-and-prove self-play for formal theorem proving, verified by a [proof assistant](#/glossary/proof-assistant) (§1, §4).

## Problem and setting

- **Question:** can such a game produce training data that improves LLMs' code reasoning, transferring to other code tasks (§1, §3.3)?
- **Programs:** Python 3.10 (App. K). Against data contamination, seeds are the `code` field of the training split of MBPP, a dataset of short, self-contained exercises (§2.1), "never its problem statements or unit tests", with the test split held out for evaluation (§3.1).
- **What counts as correct:** a diverging input is checked by running both programs in a sandbox; non-termination is approximated by a randomized time limit, which "prevents Alice from exploiting a fixed limit" (§2.1), sampled in [2.5, 5.5] s (App. H).
- **Models:** `gpt-4o-mini-2024-07-18` (main runs) and `gpt-4.1-nano-2025-04-14`, fine-tuned on the OpenAI platform with default hyperparameters; N = 10 samples per query (§3.1).
- **Theory (App. I "Definitions"):** programs map natural numbers to natural numbers, with non-termination counted as an output value.

## Approach

- **The game (§2.1, Fig. 1):** Alice loses if her input gives both programs the same result; Bob wins if his input is diverging.
- **Training (§2.2, Alg. 1 in App. A):** "RL was not available on the OpenAI API at the time of our experiments", so the authors use rejection-sampling fine-tuning with difficulty targeting. Each valid Alice output is scored by sampling Bob N times and trained on with the measured difficulty as its target. The set favours hard examples; Alice also learns to predict difficulty (App. D).
- **Rounds (§3.1):** each Alice round retrains from the base model on the instances accumulated across rounds; Bob is then trained once on his own correct plays. gpt-4o-mini got 7 Alice rounds, "fewer than ideal, due to our budget limits", gpt-4.1-nano 6, "which suffice for convergence".
- **No perfect evaluator (Thm. 1, App. I):** no program can, for every pair of inequivalent programs, compute an input on which they differ, with non-termination counting as a result; the proof shows such a program would decide the halting problem, with no time limit and both programs built for the purpose. App. I argues the game's restrictions keep this: under a time limit, halting detection stays undecidable "if the halting detector program has to halt itself within the same time limit" (footnote 7: "provable with an argument about program length"); with P fixed, by a Q that "invokes Bob itself", for any P that halts on two inputs with distinct outputs. Hence "the game has no strict performance cap" (§2.1).
- **Neurosymbolic reading (§4):** SInQ sits in "the neurosymbolic tradition of supervising a neural learner with a symbolic verifier": a diverging input is a "certificate of inequivalence, checkable in bounded time"; "inequivalence is semi-decidable and its witnesses are cheap to check" (semi-decidable: a program confirms every yes-case, but may run forever otherwise).
- **Lower targets (App. J):** recommended "if at some point Bob starts to fall behind"; the experiments always used 10.

## Results

- **Intrinsic (§3.2):** with gpt-4o-mini, on instances from the final Alice, Bob's solved share rises from 75.99% to 86.98% on MBPP-train sources and from 88.37% to 91.67% on held-out MBPP-test sources. "The untrained Bob is already strong (we did not train Alice to convergence)".
- **Identifier swap (§3.3.1, Tab. 1):** pick the more likely correct of two variants of a function, where a prepended statement such as `print, len = len, print` makes the one with the names swapped correct. Without chain of thought the trained gpt-4o-mini Bob rises from 1.65% to 5.35%, and gains slightly with it; for gpt-4.1-nano the method "does not help" and lowers accuracy with chain of thought. A superseded gpt-4.1-nano evaluator, whose harness "compared program outputs by Python object identity rather than by value", is also listed; footnote 5 confines the bug to it.
- **Vulnerability detection (§3.3.2, Tab. 2):** PySecDB (Python commits labelled by whether they contain a security fix) and CodeXGLUE Defect Detection (C/C++ snippets labelled by known vulnerabilities), with greedy answers, majority vote over 9 samples, or chain of thought. Greedy on CodeXGLUE: 55.23% → 55.60% (gpt-4o-mini), 54.76% → 55.27% (gpt-4.1-nano). The authors call these "small but consistent improvements across both datasets, tasks and languages"; chain of thought lowers accuracy for base and trained Bobs alike, and "SInQ degrades slightly under CoT on some model/dataset combinations".
- **Code generation (§3.3.3, Tab. 3 in App. L):** Pass@1 from the EvalPlus test harness on MBPP and HumanEval (code-writing problems checked by unit tests) and their extra-test versions MBPP+ and HumanEval+. gpt-4o-mini gains on MBPP and MBPP+, ties on HumanEval, loses slightly on HumanEval+; gpt-4.1-nano drops slightly on MBPP and MBPP+ and "improves substantially" on HumanEval+. The Bobs "still improve or maintain generation performance".
- **Reasoning models (App. M, Fig. 6):** o1, o3-mini, DeepSeek-r1 and a distilled r1 are "much stronger" on identifier swap, DeepSeek-r1 reaching 94.0% (all but o3-mini on 10% of the test set).
- **Qwen3 (App. C, Fig. 3):** the share of maximum-difficulty instances grows while mean difficulty falls, read by the authors as a plateau or overfitting of the small model and adapter.

## Limits the authors state

- Limits "primarily due to our limited budget" (§ Limitations): two OpenAI models plus an unstable run of the smallest Qwen3 reasoning model with "a small set of fine-tuning hyperparameters" (App. C); fine-tuning "likely with LoRA-style adapters", without RL or full-parameter tuning; one Bob round; no non-adversarial synthetic-data baseline, "which would isolate the benefit of self-play".
- The identifier-swap transfer "is not reliable across base models, and we do not claim it as a general property of the method" (§3.3.1).
- The authors could not train Alice "to the point that it could seriously challenge Bob" (App. J).
- With a maximal target, Alice has "an incentive to generate cryptographic puzzles" that stall learning, since "in reality computing resources are finite", and could also outpace Bob (App. J).

## Open problems and building blocks

  - Several Bob rounds with Alice trained to convergence between them, "as in AlphaZero-style self-play" (§ Limitations).
  - Confirming that a fixed perturbation scheme would plateau "whereas our game has no intrinsic performance cap" (§ Limitations).
  - Larger open models (App. C); a large reasoning model as base model (App. M).
  - For generation, "it may help to train a separate model combining the final Alice and Bob datasets" (§3.3.3).
  - Citing later work that adds equivalence proofs in Liquid Haskell, a Haskell verifier (Poon and Miceli Barone, 2026; not listed here), the authors say the verifier's strength "looks like the most promising axis for improvement, at the price of restricting the method to languages with mature verification tooling" (§4).
- **Released:** code to replicate the experiments and the generated synthetic data (abstract; §5); "The evaluation prompts will be included in the code released upon publication" (App. K).
- **To reuse it:** the OpenAI platform and the two dated models; replication "should be possible with a modest budget (approximately $600)" while they remain available (§5).

## On this site

- **Discussed in:** [Benchmarks with checkable ground truth](#/challenges/checkable_benchmark_ground_truth)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/cex-general">cex-general</a><a class="tag sub" href="#/tags/cex-llm">cex-llm</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/rlvr-general">rlvr-general</a></span>
