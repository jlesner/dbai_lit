# Optimizing Instructions and Demonstrations for Multi-Stage Language Model Programs

**MIPRO (shipped in DSPy as MIPROv2)** · EMNLP 2024

Read: [PDF](https://arxiv.org/pdf/2406.11695) · [arXiv](https://arxiv.org/abs/2406.11695) · [DOI](https://doi.org/10.18653/v1/2024.emnlp-main.525)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Optimizes instructions and few-shot demonstrations of every module in a multi-stage LM program.
- Bayesian search over proposed instruction/demo combinations, scored on mini-batches.
- A DSPy optimizer; GEPA's main results tables compare against MIPROv2 ([GEPA](#/papers/agrawal2025gepa "GEPA: Reflective Prompt Evolution Can Outperform Reinforcement Learning (2026)") Tabs. 1–2).

## In plain words

Many LLM applications chain several model calls into a pipeline, each with its own prompt; the authors call these language model programs. They say such pipelines are commonly tuned by hand, and that most prompt optimizers don't directly apply to them because the individual calls have no labels or scores (§1). The paper asks how to choose every call's instruction and few-shot examples when only the final output can be scored, without access to model weights or gradients. The authors lay out a set of strategies, build a benchmark of seven tasks, and test several optimizers. The main one, MIPRO, has a second LLM write instructions from summaries of the data and the program, collects examples from successful runs, and searches over combinations with a Bayesian model scored on small batches. With Llama-3-8B running the programs, they report that MIPRO "outperforms baselines on five of seven diverse LM programs", "by as much as 13% accuracy" (abstract). They present it as "a novel optimizer" (abstract) that, unlike DSPy's earlier optimizers, tunes instructions in multi-stage programs (§1).

## Background and terms

**Terms to know:** [meta-prompt](#/glossary/meta-prompt) · [rejection sampling](#/glossary/rejection-sampling) · [exact match](#/glossary/exact-match) · [Bayesian optimization](#/glossary/bayesian-optimization) (surrogate model, TPE) · [Wilcoxon signed-rank test](#/glossary/wilcoxon-signed-rank-test)

**The paper's own terms:**
- **LM program**: a pipeline of modules, each an LM call whose prompt template has slots (variables) for an instruction, demonstrations (few-shot examples) and the input (§2); written in the DSPy framework (§1, §7).
- **Proposal and credit assignment challenges** (§1): proposing a few good prompts from a huge space, and inferring which module's choice caused a whole-program score.
- **Proposer LM** writes candidate instructions; **task LM** runs inside the program (§5.2).
- **Bootstrapping demonstrations** (§3.1): run training inputs through the program, keep traces whose output scores at or above a threshold, and use each module's inputs and outputs in them as candidate demonstrations; the paper calls it a "rejection-sampling strategy".
- **Grounding** (§3.1, App. C): giving the proposer summaries of the data and the program, bootstrapped demonstrations, and earlier instructions with scores.
- **Trial**: one configuration and its evaluation; budgets count full evaluations on the training set, so mini-batch optimizers get more, smaller trials (§5.2).

**Builds on:**
- DSPy ([DSPy](#/papers/khattab2023dspy "DSPy: Compiling Declarative Language Model Calls into Self-Improving Pipelines (2024)")): its demonstration optimizer, generalized as Bootstrap Random Search, the main baseline (§4.1, App. F).
- OPRO ([OPRO](#/papers/yang2023opro "Large Language Models as Optimizers (2024)")), extended as Module-Level OPRO (§4.2), and APE ([APE](#/papers/zhou2022ape "Large Language Models Are Human-Level Prompt Engineers (2023)")): single-prompt optimizers that Algorithm 1 generalizes (§2).
- TPE (Bergstra et al., 2011) and Optuna (Akiba et al., 2019), not listed here (§3.2).

## Problem and setting

- **Question:** find the instructions and demonstrations for all modules that maximize the program's average metric on a training set (§2).
- **Assumptions:** no access to LM weights, log-probabilities, gradients or embeddings, and no labels or metrics for intermediate stages; only the program, a metric and training inputs "and, depending on the metric, final outputs" (§1, §2). Designers "generally have small datasets" and small call budgets (§2). Other prompt variables are held constant (§2).
- **Tasks** (Tab. 1, §5.1, App. A): HotPotQA, questions answered by two hops of Wikipedia retrieval (exact match); HotPotQA Conditional, where the answer format depends on the answer's type, from a seed instruction stating the rules (exact match plus regex format checks); Iris, classifying flowers from petal and sepal measurements, and Iris-Typo, with a misspelled class name in the prompt; Heart Disease, a yes/no diagnosis via three chain-of-thought opinions and a final judgment (these three: accuracy); ScoNe, yes/no entailment (does a statement follow?) with nested negation (exact match); HoVer, three-hop retrieval of a claim's evidence, scored by recall of its gold documents, named Recall@21 in Tab. 1.
- **Data:** generally 500 training, 500 development and up to 2,000 test examples, smaller for some tasks (§5.1, Tab. 3).
- **Models:** Llama-3-8B is the task model in most experiments; the proposer is GPT-3.5 "in the majority of experiments" (§5.2), GPT-4 for ScoNe, HoVer and Iris (App. B.4); the bootstrapping teacher is Llama-3-8B, or GPT-4o for ScoNe and HoVer (§5.2).
- **Protocol:** 20–50 full-evaluation trials per task (§5.2, App. B.2); five runs per method; Wilcoxon tests between "the averages of all runs for each example in the test set" (§5.2). Four tasks ran only three optimizers (Tab. 2).

## Approach

- **Framework** (Algorithm 1, §2): each iteration proposes strings for the prompt variables, scores the program on a training batch, and updates the optimizer; the aim is few program runs (§3).
- **Credit assignment** (§3.2): greedy (one stage at a time; "no more effective than other approaches but it imposed considerably worse time complexity" in preliminary experiments), surrogate (a Bayesian model over existing proposals), and history-based (as in OPRO, the proposer reads past instructions and scores).
- **Bootstrap Random Search** (§4.1, Fig. 2): bootstrap several demonstration sets, try them at random, return the best.
- **Module-Level OPRO** (§4.2, Fig. 3): each module's proposer sees its own past instructions paired with the whole program's score, assuming that score is a good enough proxy.
- **MIPRO** (§4.3, Fig. 4): bootstrap demonstration sets and propose grounded instructions for each module up front; treat each module's choices as categorical variables; let TPE pick a combination, score it on a random mini-batch, update. Periodically the best-scoring combinations are evaluated on the full training set, and the best of those is returned. Mini-batches are used because Bayesian optimization "is known for its robustness to noise" (§4.3).
- **Variants** (§4.4): 0-Shot MIPRO tunes instructions only; Bayesian Bootstrap tunes demonstrations only; 0-Shot MIPRO++ tunes how instructions are proposed, "learning to propose" (§3.1) (whether to show the dataset and program summaries, the proposer's temperature, a prompt-writing tip from a list in App. C.2, which demonstrations the proposer sees). Only the instruction part of MIPRO++ is evaluated (§4.4).
- **Dropped** (§4.5): Program-Level OPRO "did not appear to provide additional performance gains"; CA-OPRO's "performance did not justify its inefficiency" in initial experiments.

## Results

From Tab. 2 (averages over five runs, test columns cited here; bold marks a best result supported by Wilcoxon tests at p < .05, several bold values no confirmed difference) and §6's five lessons, as the authors report them.

- **Headline:** MIPRO beats the baselines on "five of seven" programs (abstract, §1, §8), "by as much as 13% accuracy" (abstract).
- **Lesson 1:** demonstrations alone beat instructions alone "for the majority of tasks"; Bootstrap Random Search beats the best instruction-only optimizer "in all but one case", HotPotQA Conditional. Few-shot sets vary widely (App. G); the authors infer that good demonstrations convey reasoning more than format.
- **Lesson 2:** MIPRO "generally yields the best overall performance", against the second-best optimizer per task; the exceptions are HotPotQA, Heart Disease and Iris without the typo. On ScoNe and HoVer, MIPRO scores 79.4 and 39.0 against Bayesian Bootstrap's 77.4 and 37.6 and the un-optimized 69.1 and 25.3. The authors hypothesize that HotPotQA's final step is "likely in-distribution for many models", and that Heart Disease's seed instruction gives no classification criteria.
- **Lesson 3:** instructions matter most for conditional rules not immediately obvious to the LM nor expressible by a few examples, a hypothesis supported mainly by HotPotQA Conditional. On HotPotQA Conditional, the un-optimized program scores 6, Bootstrap Random Search 10.4, 0-Shot MIPRO 14.6 and MIPRO 23.3. On Iris-Typo the instruction optimizer "even helps correct mistakes in the seed prompt".
- **Lesson 4:** grounding "is essential for performance improvements for HotPotQA and HoVer, but seems to hurt performance for ScoNe" (Module-Level OPRO with against without: 39.0 against 36.0, 32.5 against 25.7, 73.5 against 76.1); 0-Shot MIPRO++ "recovers this performance for ScoNe". From learned importances (App. D) the authors report that "across tasks, the highest importance scores go to the choice of bootstrapped demonstrations in the meta-prompt and the tip", and that the dataset summary matters for ScoNe, little for HotPotQA and HoVer.
- **Lesson 5:** among the instruction-only optimizers "results are mixed"; Bayesian Bootstrap beats Bootstrap Random Search on ScoNe, not significantly on HotPotQA and HoVer.

## Limits the authors state

- A "fixed budget": the paper "does not examine how optimization dynamics might differ across extremely low or high budget scenarios" (Limitations).
- "a fixed proposer LM and task LM" (Limitations).
- A "restricted ability to infer the rules governing complex tasks without a handwritten seed prompt"; grounding "may be insufficient" (Limitations; §6 Lesson 3).
- More remains to learn on "increasingly complex tasks and programs" (Limitations).
- Smaller budgets on Iris, Heart Disease and HotPotQA Conditional, whose runs were "focused on understanding the value of instruction versus few-shot optimization rather than evaluating specific methods" (App. B.2); candidate counts "were not chosen with extensive sweeps" (App. B.3).
- Proposers tend "to overfit instructions to the few-shot examples provided in the meta-prompt", and such instructions sometimes end up in the best programs (App. H).

## Open problems and building blocks

- **Open:** the Limitations section pairs each of the first four limits above with future work. Beyond those: at other budgets, 0-Shot MIPRO might do best when budgets are very low and 0-Shot MIPRO++ "may shine in scenarios where budget is not an issue" (§6 Lesson 5); abstractions that catch errors like the Iris typo (§5.1, footnote); why overfit instructions sometimes end up in the best programs (App. H).
- **Released:** "We have released our new optimizers and benchmark in DSPy" (abstract); App. E says the benchmark code will be released on publication.
- **To reuse it:** the inputs under Problem and setting; a proposer LM (§5.2) and Optuna's TPE (§3.2); "only a single GPU capable of running Llama 3 8B or a cloud inference provider" to replicate the results (App. B.4); 20–50 full-evaluation trials, about 300 mini-batch trials at 50 (App. B.2).
- **Beyond its domain:** none claimed.

## On this site

- **Discussed in:** [The self-improving SQL ↔ text ↔ verify loop](#/challenges/sql_text_round_trip_loop)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/promptopt-general">promptopt-general</a><a class="tag sub" href="#/tags/promptopt-misc">promptopt-misc</a></span>
