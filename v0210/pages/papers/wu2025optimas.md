# Optimas: Optimizing Compound AI Systems with Globally Aligned Local Rewards

**Optimas** · ICLR 2026

Read: [PDF](https://arxiv.org/pdf/2507.03041) · [arXiv](https://arxiv.org/abs/2507.03041)  
Code: [optimas](https://github.com/snap-stanford/optimas)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Optimizes compound AI systems whose components have different configuration types: prompts, hyperparameters, model weights (abstract).
- One local reward function per component, kept aligned with the global metric by retraining on a small batch of preference pairs; the abstract says each iteration, Alg. 1 only after an accepted update (abstract; App. A, Alg. 1).
- Learns each component's reward from preference pairs labeled by Monte Carlo rollouts of the downstream components (§4.1); baselines include TextGrad and DSPy (MIPRO on user instructions only, App. E), scored against ground truth (accuracy, MRR, F1, pass rate; Tab. 2).

## In plain words

Many AI applications chain LLM calls, retrievers, tools and small trained models. Each part has its own kind of setting (a prompt, model weights, which LLM to call, how many passages to retrieve), and the system is scored only on its final output. The authors say tuning such systems as a whole is hard because they can't be differentiated, their settings are of mixed types, and running the whole system to score every change is costly (§1). Optimas trains one scorer per part that estimates how much that part's output contributes to the final score, keeps each scorer up to date as the system changes, and tunes each part against its own scorer with a method suited to its setting type (abstract, §4). On five tasks, with systems the authors built, they report an average gain of 11.92% over the best baseline (abstract, §5.1). They compare under similar numbers of whole-system runs (§5.1). They present it as "a unified framework" that, "under mild conditions", "converges reliably" (§1).

## Background and terms

**Terms to know:** [reward model](#/glossary/reward-model) · [reinforcement learning](#/glossary/reinforcement-learning) · [PPO](#/glossary/ppo) · [LLM-as-a-judge](#/glossary/llm-as-a-judge) · [textual gradient](#/glossary/textual-gradient) · [F1 score](#/glossary/f1-score) · [pass@k](#/glossary/passk) · [coordinate maximization](#/glossary/coordinate-ascent) · [mean reciprocal rank (MRR)](#/glossary/recallk-and-mean-reciprocal-rank-mrr)

**The paper's own terms:**
- **compound AI system**: components (e.g. LLMs, ML models, model selectors) wired as a directed acyclic graph, so data flows one way; the wiring may change per input, and upstream components are numbered first (§3).
- **configuration**: what can be tuned in a component: nothing, something discrete (a prompt, a model choice) or something continuous (weights, hyperparameters) (§3).
- **global reward**: a user-defined score of the final output, e.g. accuracy against ground truth; the goal is to maximize its expected value over a dataset (§3, Eq. 1).
- **Local Reward Function (LRF)**: a reward model for one component, rating its output given its input (§4.1).
- **local–global alignment**: for every input and any two candidate outputs of a component, the LRF scoring one at least as high implies that its expected global reward, after running the downstream components (those that "directly or indirectly receive information originating from" it), is at least as high (§4.1, Eq. 3).
- **alignment quality**: pairwise ranking accuracy, how often an LRF scores higher the output with higher expected global reward (§5.2 Takeaway 3).

**Builds on:**
- Prompt optimizers for multi-step LLM programs: DSPy with its MIPRO optimizer ([DSPy](#/papers/khattab2023dspy "DSPy: Compiling Declarative Language Model Calls into Self-Improving Pipelines (2024)"), [MIPRO (shipped in DSPy as MIPROv2)](#/papers/opsahlong2024mipro "Optimizing Instructions and Demonstrations for Multi-Stage Language Model Programs (2024)")) and TextGrad ([TextGrad](#/papers/yuksekgonul2024textgrad "TextGrad: Automatic 'Differentiation' via Text (2024)")); Tab. 1 marks neither as optimizing heterogeneous configurations.
- Single-type optimizers as baselines (§5, App. E): LLMSelector, which picks an LLM per component; Hierarchical Behavior Cloning (HBC), which trains components to copy outputs from successful runs; REINFORCE, which updates LLM weights directly from the task reward.
- The per-type optimizers it plugs in: OPRO for prompts ([OPRO](#/papers/yang2023opro "Large Language Models as Optimizers (2024)")) and PPO for weights (§4.3).
- Reward modeling that splits a final reward into step-level ([process](#/glossary/outcome-and-process-rewards)) signals (§2); the authors say Optimas differs "by dynamically aligning local rewards with global rewards through preference-based adaptation" (§2).

## Problem and setting

- **Question:** how to tune every component, whatever its configuration type, so the expected global reward rises, without a whole-system run per candidate change (§1, §3).
- **Benchmarks** (§5, App. C): Amazon, next-item recommendation from a user's behaviour (accuracy); PubMedQA, yes/no/maybe questions on PubMed abstracts (accuracy); STaRK-Prime, retrieval over a semi-structured biomedical knowledge base (MRR, §5); HotpotQA, multi-hop question answering, needing facts from several passages (F1); BigCodeBench's instruction split, self-verifying code generation (pass rate). Test sets have 70 to 500 items (App. C).
- **Systems** (App. D, Tab. 5): only Amazon has trainable weights (two Qwen 2.5 1.5B models); the others tune prompts, LLM choice (PubMedQA), two aggregation weights (STaRK-Prime) or the retriever's passage count (HotpotQA), mostly with GPT-4o-mini or Claude 3 Haiku modules.
- **Baselines** (§5, App. E): Unoptimized, REINFORCE ("only applicable on" Amazon), LLMSelector (only on PubMedQA), HBC, TextGrad, and DSPy's MIPRO with few-shot example and system-prompt optimization disabled "for fair comparison"; plus a single-LLM reference.
- **Budget:** TextGrad, DSPy and Optimas are run "to use comparable system runs" (Tab. 3 caption) and select on the same 20 validation inputs (App. E).

## Approach

- **Scorers (§4.1):** all LRFs share one LLM backbone, with a linear head per component scoring the encoded (input, output) text (Eq. 2); the default is Llama 3 8B Instruct with [LoRA](#/glossary/lora-low-rank-adaptation) (Tab. 6).
- **Training data (§4.1):** run the system up to the component, sample two candidate outputs, and estimate each one's expected global reward by Monte Carlo sampling: run the downstream components with the candidate and the non-downstream components' outputs fixed, and average the global rewards. The higher one is labelled preferred; LRFs are trained on such pairs with a pairwise log-sigmoid ranking loss (Eq. 4).
- **Adaptation (§4.2):** LRFs are first trained offline; then, "when any configuration changes", fresh pairs from a few new inputs, plus a buffer of earlier pairs, help keep them aligned.
- **Local optimization (§4.3, App. F):** prompts are ranked by average local reward, OPRO-style; trainable models get PPO "using the LRF as the critic"; model choices and hyperparameters are sampled with probability proportional to the exponential of their local reward.
- **Loop (§4.3, Alg. 1):** each iteration picks a component at random, optimizes it locally, and keeps the change only if it "improves the global reward on a small validation set", "to prevent potential cascading errors"; LRFs are adapted after an accepted change.
- **Theorem 4.1** (§4.4; formal Thm. B.1, App. B): the LRF that minimizes the ranking loss satisfies local–global alignment, and maximizing a component's local reward gives the same configuration as maximizing the global reward with the other components fixed. Conditions: "under regularity conditions" (§4.4); formally, each pair's label is random, the chance of an output being labelled preferred being a sigmoid, with a parameter α > 0, of the difference in the two outputs' expected downstream global reward; α = +∞ is deterministic labelling (App. B).
- **Theorem 4.2** (§4.4, proof App. B): the algorithm converges to a component-wise maximum. Conditions (Assumption 4.1): for any fixed setting of the discrete configurations, the "initial level set" (configurations on one side of the starting objective value) is compact (closed and bounded); and for every component and every fixed setting of the others, the objective has a unique best configuration for it. The proof treats each local step as coordinate maximization via Theorem 4.1, shows the discrete configurations stop changing after finitely many iterations, then applies Tseng's (2001) convergence result for block coordinate descent to the continuous ones.

## Results

All are the authors' claims.

- **Main comparison (Tab. 2, §5.1):** at comparable run budgets, Optimas scores best in every column, with an average relative improvement of 11.92% over the best baseline. §1 calls it "the only method that improves performance across all five tasks". DSPy falls on Amazon from the Unoptimized 21.21 to 18.18 accuracy (Tab. 2).
- **Cost (Tab. 3, App. G.4):** Optimas averages 0.71k system runs against 0.80k (TextGrad) and 0.79k (DSPy).
- **During optimization (Takeaway 2, Fig. 4):** "within a small number of iterations" the validation global reward rises 41.7% on average over the initial system, and the updates mix prompts, weights and hyperparameters.
- **Alignment quality (Takeaway 3, Tab. 4):** on validation sets, LRFs average 77.96% pairwise ranking accuracy against 49.52% for an LLM judge (gpt-4o with 20 in-context examples), which "performs closer to random guessing".
- **Alignment and outcome (Takeaway 4, Fig. 5):** on one Amazon and one HotpotQA component, higher alignment quality "usually leads to higher global reward".
- **Interpretability (Takeaway 5, Fig. 6):** on HotpotQA the LRF prefers short answers, and the optimized prompt limits output length.
- **Data and model size (Takeaway 6, Fig. 7, HotpotQA):** 12.5% of the training data gives 65.46% ranking accuracy, 92.7% of the full-data value; 1B, 3B and 8B backbones give similar alignment.
- **HotpotQA extras (App. G.1–G.3):** local and global rewards over the retriever's passage count share their three best settings; adaptation improves up to about 20 new inputs, "after which gains plateau and even slightly decline".

## Limits the authors state

- The block-coordinate updates "do not guarantee global optimality in non-convex problems" (where the objective can have several local peaks), and "global convergence guarantees only hold under additional structural assumptions, such as Polyak–Łojasiewicz or Kurdyka–Łojasiewicz conditions" (§4.4), conditions on the objective's shape.
- LRFs "may become inaccurate" as the configuration changes, and retraining them all from scratch "is expensive" (§4.2).
- An explicit trust region (a cap on each update's size) "can be difficult" to set for mixed configuration types, so a "conservative number of update steps" limits each change (App. F).
- The cost accounting assumes "all components contribute equally to the per-run cost"; PPO adds GPU time, "only required for systems with trainable local components" (App. G.4).
- BigCodeBench is cut to a subset "due to efficiency issue" (App. C).
- In high-stakes settings, optimization "could inadvertently amplify biases or propagate unsafe behaviors from individual components" (Ethics Statement).

## Open problems and building blocks

- **Open:** applying it "on even larger systems, with the goal of understanding complex reward modeling and scalability" (§6).
- **Released:** "we release all code, models, and benchmarks described in this paper" (Ethics Statement); the Reproducibility Statement adds the datasets and system implementations.
- **To reuse it:** a global reward computed on final outputs and called on Monte Carlo rollouts of the downstream components (§3, §4.1), at 2 full system runs per preference pair in the Amazon cost breakdown (App. G.4); an LRF backbone, 8B by default (Tab. 6); defaults of 3 prompt candidates, 3 local steps, 20 fresh and 20 validation inputs (Tab. 7); an 8×A100 node, where runs "typically finished in 2–8 hours", depending on the system and hyperparameters (App. D).

## On this site

- **Discussed in:** [The self-improving SQL ↔ text ↔ verify loop](#/challenges/sql_text_round_trip_loop)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/promptopt-general">promptopt-general</a><a class="tag sub" href="#/tags/promptopt-misc">promptopt-misc</a></span>
