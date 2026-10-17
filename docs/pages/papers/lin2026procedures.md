# Can Large Language Models Generalize Procedures Across Representations?

**Can Large Language Models…** · ICML 2026 (PMLR 306)

Read: [PDF](https://arxiv.org/pdf/2602.03542) · [arXiv](https://arxiv.org/abs/2602.03542)  
Code: [procedure_generalization_llm](https://github.com/fangru-lin/procedure_generalization_llm)

<p class="notice">A summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Trains models on one of three isomorphic forms of the same planning task (an English how-to task with step durations and order constraints, a graph's adjacency list, a Python longest-path function to trace) and tests on all three; the authors report that "naive training on a single representation fails to reliably generalize across representations" across Qwen, Llama and Olmo models and four post-training methods (§3.2, Fig. 2; App. A.2), and propose a two-stage RL curriculum, symbolic data first (graph in the planning runs, code in math and physics), then English (abstract, §4, §4.4).
- Vanilla SFT, Distillation into compact models, STaR and GRPO with a 0/1 reward for a correct answer in the required format on AsyncHow planning problems, on Qwen-2.5-Instruct 1.5B–7B (§3.1); curriculum ablations on order, interleaving, data mixture and SFT (§4.1–4.2), a dialect test set (§4.3), and math and physics with code-form data (§4.4); a correlation analysis of graph similarity between test items and learned training items, frequency against analogy (§5.1, Tab. 3).
- Weight-space evidence on near transfer between a program form and an English form of one task under an answer check: training on the graph or code form alone did not reliably carry over to English (abstract, §3.2), while graph-then-English GRPO on a 1.5B model is reported at 0.782 NL test accuracy against 0.698 for English-only GRPO at the same step budget (§4.1, Tab. 1).

## In plain words

LLMs are trained heavily on code and graphs, but user tasks are often stated in English; the authors ask whether a procedure learned in one form carries over to the same task written in another (abstract, §1). Their planning problems list steps, durations and which step must come first, and ask for the shortest finishing time with unlimited resources; each is written in English, as a graph, and as a Python function whose output the model must work out (§2). They report that training on the graph or code form alone, by fine-tuning or reinforcement learning (training by trial and reward), "does not reliably generalize" to English (abstract). They propose reinforcement learning first on a symbolic form (graph or code), then on English (abstract, §4). At equal training steps, a 1.5B Qwen model trained so scores 0.782 on English test problems against 0.698 for English-only training, equal to zero-shot GPT-4o (Tab. 1); on a dialect test set it stays below GPT-4o (§4.3, Tab. 1). They present a controlled study plus a curriculum, and suggest successful transfer can be read as a form of analogy (abstract, §5).

## Background and terms

- **Terms to know:** [GRPO](#/glossary/grpo) · [RL with verifiable rewards](#/glossary/rl-with-verifiable-rewards-rlvr) · [Distillation into compact models](#/glossary/distillation) · [expert iteration](#/glossary/expert-iteration) · [curriculum learning](#/glossary/curriculum-learning) · [McNemar's exact test](#/glossary/mcnemars-exact-test) · [Pearson correlation](#/glossary/pearson-correlation) · [Weisfeiler-Lehman graph kernel](#/glossary/weisfeiler-lehman-graph-kernel) (the subtree kernel with 3 iterations as edge-structure similarity, §5.1)

**The paper's own terms:**
- **representation**: the surface form a task is written in: `NL` (English), `Graph` or `Code` (§2). The three forms of one problem are isomorphic: same steps, durations and order constraints (§1, §2).
- **asynchronous planning**: a task given as steps with durations and "must precede" constraints, where steps without a constraint between them can run in parallel; the answer is the shortest total time "assuming infinite resources are available" (§2). The steps and constraints form a directed acyclic graph (DAG: arrows between steps, no cycles), and the answer is the length of its longest path, the **critical path** (§2, Fig. 1).
- **significant transfer**: a gain over the untuned model that is significant by McNemar's tests, following Zhang et al. (2024) (§3.1).
- **two-stage curriculum**: "symbolic induction" (RL on `Code` or `Graph`), then "natural language adaptation" (RL continued on `NL`) (§4). In the glossary's terms this is curriculum learning ordered by representation, not by difficulty (ours).
- **generative analogy** vs **proportional analogy**: mapping deep shared structure across forms, against simple surface relations ("king is to man as queen is to woman") (§1, §6).
- **analogical strength**: a similarity score between two problems' DAGs, weighting how alike their edge structures are above how alike their durations are (§5.1, Eq. 1).
- **frequency- vs analogy-based hypothesis**: success comes from many moderately similar training items, or a few highly similar ones (§5.1).
- **`NL-AAVE`**: the `NL` test set rewritten in African American Vernacular English, an English dialect, with the same task structure (§4.3, App. A.1).

**Missing glossary terms:**
- **STaR (Self-Taught Reasoner)**: the model samples reasoning, keeps the samples whose final answers match the ground truth, is fine-tuned on them, and repeats; for prompts it can't solve, the right answer is given as a hint ("rationalization") (§3.1). In the glossary's terms, a form of expert iteration (ours).

**Builds on:**
- AsyncHow (Lin et al., 2024a), the benchmark of how-to plans behind `NL`, and its framing of each instance as a DAG (§2).
- Hofmann et al. (2024), whose frequency- and analogy-based hypotheses §5.1 follows, and Gentner (1983), structure-mapping theory (analogy as mapping shared relations between domains), behind analogical strength (§5.1).
- STaR ([STaR (Self-Taught Reasoner)](#/papers/zelikman2022star "STaR: Bootstrapping Reasoning With Reasoning (2022)")) and GRPO ([DeepSeekMath](#/papers/shao2024deepseekmath "DeepSeekMath: Pushing the Limits of Mathematical Reasoning in Open Language Models (2024)")), two of its four post-training methods (§3.1).
- Lin et al. (2024b) for the train/test split and the dialect variant (§3.1, §4.3); Huang et al. (2025), Loong, for math and physics problems with code-form versions (§4.4).

## Problem and setting

- **Questions** (§3): do procedures learned from `Code` or `Graph` transfer to `NL`, and how do scale and method matter?
- **Data** (§2, §3.1): `Graph` is an adjacency list (each step mapped to the steps that must follow it, with dummy `START` and `END` nodes) with a duration per node; `Code` is a Python longest-path function with a weighted adjacency list (nodes renumbered, durations in minutes), and the model gives the function's output (App. A.1). After deduplication, 1,364 training and 225 test problems per form (§3.1).
- **Models** (§3.1): Qwen-2.5-Instruct 1.5B, 3B and 7B in the main text; Llama-3.2-1B/3B, Llama-3.1-8B and Olmo-2-1B/7B in App. A.2. Footnote 2: no larger models, "because they perform reasonably well on this task without the need for further tuning".
- **Methods** (§3.1): vanilla supervised fine-tuning (SFT; prompt and answer only, no chain of thought); Distillation into compact models from DeepSeek-R1-Distill-Qwen-32B (a distilled open reasoning model), keeping teacher answers that exactly match; STaR for 10 iterations; GRPO with a reward of 1 for answers "both correct and adhering to the required format", otherwise 0. All update full parameters.
- **What counts as correct:** a final answer matching the ground truth, as §3.1 states for the training filters and reward; evaluation at temperature 0, one response per prompt (App. A.3).

## Approach

- **Controlled transfer test** (§3.1): train on one representation, test on all three; since the structures are isomorphic, the gap is read as how well procedures generalize.
- **Curriculum** (§4.1): GRPO on Qwen2.5-1.5B-Instruct, 40 steps on `Graph`, then 40 on `NL`, against 80 steps on `NL` only. With total steps and sequence-length cut fixed, the authors say each condition "is essentially controlled with the same training token budget".
- **Other settings** (§4.3–4.4): the `NL-AAVE` test set, unseen in training; MATH levels 4–5 (competition math problems) and SciBench physics problems (college-level science problems), with Loong's Python versions as stage 1 (20 steps `Code`, 20 `NL`, against 40 `NL`).
- **Analogy analysis** (§5.1): for the GRPO-trained 1.5B model, correlate test accuracy with the count of correctly learned training items above a similarity threshold (frequency), and with the similarity of the k-th most similar one (analogy), reporting the strongest significant correlation of each sweep.

## Results

- **Single-representation training** (§3.2, Fig. 2): across all LLMs and post-training methods, "naive training on a single representation fails to reliably generalize across representations". `Graph` or `Code` training "tends to achieve high within-representation performance, but transfers poorly to NL"; where transfer is significant (e.g. STaR on `Graph`, 1.5B), it stays "markedly lower" than in the trained form. Even trained on `NL`, small models reach "around 0.5 accuracy for 1.5/3B scales".
- **Methods and scale** (§3.2): GRPO leads in the trained form, but "its relative advantage diminishes under representation shift"; Distillation into compact models "sometimes exacerbates cross-representation degradation" (Fig. 6); STaR generalizes better than vanilla SFT. Scaling "does not qualitatively change" the pattern; Llama, Olmo, math and physics agree (App. A.2, Figs. 3–4, Tab. 4).
- **Curriculum** (§4.1, Tab. 1): `Graph→NL` scores 0.782 `NL` test accuracy against 0.698 for 80 `NL`-only steps (significant by McNemar's test), with "fewer within-representation NL updates". It also beats the 3B model trained 40 steps on `NL` (same budget), the 7B model (needing "approximately ×2.3 as much budget") and zero-shot GPT-4o-mini, and matches zero-shot GPT-4o. Its stage-2 reward curve resembles `Graph` training more than `NL` training (App. A.4, Fig. 5).
- **Ablations** (§4.1–4.2): reversing the order (`NL→Graph`) "performs markedly worse" than `NL`-only (0.431 against 0.698). Distillation in stage 2, SFT curricula and [LoRA](#/glossary/lora-low-rank-adaptation) (footnote 4) do much worse or bring no meaningful gain; interleaved `Graph+NL` training underperforms the curriculum; `Code→NL` and `Graph+Code→NL` do worse; the authors conclude that a strong first stage is "crucial".
- **Dialect** (§4.3, Tab. 1): on `NL-AAVE` the curriculum beats `NL`-only, `NL→Graph`, GPT-4o-mini and the 3B model, ties the 7B model, and stays below GPT-4o (0.573 against 0.724).
- **Olmo-2-7B** (App. A.6, Tab. 5): the curriculum beats `NL`-only on both test sets, significantly on `NL-AAVE`.
- **Math and physics** (§4.4, Tab. 2): "Generally", even where in-domain results are "comparable or even slightly lower", the curriculum "generalizes better across domains", e.g. math training tested on physics.
- **Analogy vs frequency** (§5.1, Tab. 3): the analogy-based correlation is higher than the frequency-based one in every setting, with neither explaining `Graph`-trained models tested on `NL`; after the curriculum, 0.265 against 0.245. The curriculum model's `NL` test results correlate more with its `Graph` training than with its `NL` training (§5.1).
- **Qualitative** (§5.2): `Graph`-only training leads the model to sum all durations on `NL`; where only the curriculum model is right, it compares several paths and the `NL`-only model picks one (App. A.7.1–A.7.2).
- **Easy-to-hard** (App. A.9, Fig. 7): within one form, training on easy problems helps on hard ones for all methods but vanilla SFT.

## Limits the authors state

- Footnote 3: "To save compute, we follow prior work and do not vary the RL method"; footnote 2: no larger models (see Problem and setting).
- Math and physics get one model and a 40-step comparison "Due to constrained compute" (§4.4).
- Footnote 8: "the effect sizes are moderate", which they call expected since the analysis isolates "the underlying procedure as a single explanatory factor".
- `Graph→NL` still makes errors "such as wrong time unit conversion", "indicating a performance ceiling caused by the base model capability cap" (§5.2).
- The curriculum "is not effective in standard SFT" (§4.1); for Llama-1B on `Code` and for Olmo-1B, STaR "cannot sample meaningful results", so the baseline is reported in its place (App. A.2, Figs. 3–4).
- "there is still a notable gap between NL and NL-AAVE performance", so "better solutions can be proposed to mitigate technological unfairness" (Impact Statement).
- LLMs "have to do so via extended training", unlike humans, who can generalize "with only minimal exposure" (§7; also §1, Impact Statement).

## Open problems and building blocks

  - "it remains an open question whether scaling representations at training time can bring an observable advantage" (Impact Statement).
  - Whether RL "can genuinely learn generalizable procedures in its current paradigm, or simply exhibits better shallow pattern exploitation" (§3.2).
- **Released:** "The dataset and code used in this paper can be found here" (abstract; dataset also in the Data Access Statement).
- **To reuse it:** 4×80GB H100 GPUs, input length 2048, up to 6000 generated tokens, 4096 for Olmo (App. A.3); Llama Factory (a fine-tuning toolkit) for SFT, OpenRLHF (an RL training framework) for GRPO, hyperparameters from Open-Reasoner-zero (an open RL training recipe) (§3.1).
- **Beyond its domain:** the authors test whether "the same idea extends beyond our core planning domain" on math and physics and conclude "our method is helpful in learning generalizable representations" (§4.4).

## On this site

- **Discussed in:** [Bringing compact models to frontier accuracy](#/challenges/compact_model_accuracy) · [Gains made against a checker, carried beyond it](#/challenges/transfer_beyond_the_checker)
- **Tags:** <span class="tags"><a class="tag" href="#/tags/compact">compact</a><a class="tag" href="#/tags/transfer">transfer</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/rlvr-general">rlvr-general</a></span>
