# What Fits (Into Few Tokens) Doesn't Overfit: Compression and Generalization in ML Research Agents

**What Fits (Into Few Tokens) Doesn't Overfit** · preprint 2026

Read: [PDF](https://arxiv.org/pdf/2606.11045) · [arXiv](https://arxiv.org/abs/2606.11045)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Asks why reusing a validation set adaptively causes little overfitting, and tests the hypothesis that successful strategies are compressible on LLM research agents (Claude Opus in Claude Code) that edit and train models on 8 tasks, from tabular classification to language and diffusion modeling, scored on a separate holdout (abstract; §4, Tab. 1).
- Two bottlenecks, each an instance of a description-length generalization bound (§3, Thm. 1): output compression, where a fresh reproducer reimplements the explorer's strategy from a 32- or 64-token prompt and the training data alone (§2.2; §4.1), and input compression, where the explorer sees only one bit per query, whether it beat the running best (the ladder mechanism after Blum and Hardt), which gives simultaneous confidence intervals over its improvement checkpoints (§2.2, Alg. 1; §3.2, Cor. 3; §4.2).
- Selection bias after search in an agent loop (<a class="tag" href="#/tags/stats">stats</a>, <a class="tag" href="#/tags/hacking">hacking</a>): the authors report that both bottlenecks cost little performance under neutral prompting (§4.1–4.2), and that when prompted to maximize validation accuracy "at all costs" with direct validation access, agents train on validation data, and failure to reproduce from a 128-token prompt flags every resulting overfitting checkpoint, with 91% specificity (§1; §5; App. F, Tab. 5; rule in App. J). They note that output compression certifies only the reproducer's model, not the explorer's (§6).

## In plain words

Tuning models against one validation set many times could, in principle, fit its quirks rather than the task; yet heavily reused ML benchmarks have "often remained surprisingly informative" (§1). The authors test one explanation: successful strategies are short to describe (abstract). An LLM agent, the explorer, trains models and scores them on that set. Either a fresh agent must match the explorer's performance from a short prompt and the training data alone, or the explorer only learns whether each model beat its best so far. On 8 datasets, both limits "have little effect on performance" (abstract): with neutral prompts and score feedback, 32-token prompts let fresh agents match or beat the explorer, within a 5% relative gap, at 38 of 41 of its best-so-far models (§4.1, Tab. 3). When agents told to push the validation score at all costs can read the validation data, failure to reproduce from 128-token prompts flags all 38 overfitting models and 6 of 64 others (§5). They present this as support for a "description-length explanation" (abstract) and a falsifiable test for exploitation (§1 "Related work").

## Background and terms

**Terms to know:** [minimum description length (MDL)](#/glossary/minimum-description-length-mdl) · [hyperparameter optimization](#/glossary/hyperparameter-optimization) · [empirical risk minimization (ERM)](#/glossary/empirical-risk-minimization-erm) · [data contamination](#/glossary/data-contamination) · [reward model](#/glossary/reward-model) · [KL divergence](#/glossary/kl-divergence).

**The paper's own terms:**
- **explorer**: the agent that, in a loop, edits a training script, trains on the training set, asks for validation feedback and reports its best model (§2.1).
- **compressor**: an agent that reads the explorer's transcript and writes a prompt of at most B tokens (§2.2; App. E.2).
- **reproducer**: a fresh agent given only that prompt and the training data: no validation set, explorer code or transcript (§2.2).
- **holdout**: a split disjoint from the validation set, "used only for post hoc evaluation by the experiment harness" (§4 "Datasets"), the code that also keeps validation examples out of agent workspaces except in the stress test (§4 "Access control"; App. E).
- **improvement checkpoint**: each model that sets a new best validation metric (§4 "Agent and pipeline").
- **output and input compression**: the two "information bottlenecks": only a short prompt reaches the reproducer, or the explorer sees only one bit per query (§2.2).
- **ladder mechanism**: answering each query only with whether the model beat the running best; the Ladder of Blum and Hardt (2015) that it follows releases a rounded score instead (§2.2, Alg. 1).
- **compression certificate**: the authors' name for the output-compression test (§1; App. J); a checkpoint passes when the reproducer's validation metric is within 5% relative of the explorer's (Tab. 3).

**Missing glossary terms:**
- **adaptive data analysis**: theory of reusing one dataset to test hypotheses chosen after seeing earlier results; such hypotheses generalize "when their dependence on reused data is mediated by a bounded information channel" (§1 "Related work").
- **Hoeffding's inequality and the union bound**: a model fixed independently of n examples, with losses between 0 and 1, has average loss on them unlikely to be far from its true expected loss; covering many fixed models at once costs a term logarithmic in their number (§3, App. B).
- **PAC-Bayes**: generalization bounds that weigh each hypothesis by a prior chosen in advance instead of counting hypotheses (§3.1; App. A).
- **sensitivity and specificity**: the share of overfitting checkpoints the test flags, and the share of honest ones it leaves unflagged (§5; Tab. 5).
- **bits per byte (BPB)**: a language-model loss, the average bits needed to encode each byte of text; lower is better (Tab. 1; not defined in the paper).

**Builds on:**
- Recht et al. (2019) and Roelofs et al. (2019), new-test-set and leaderboard studies finding that gains on reused benchmarks largely transfer (§1; App. A).
- Arora and Zhang (2021), which estimates overfitting by what one must tell an "informed but unbiased" referee (§1; App. A).
- Adaptive data analysis: Thm. 1 is attributed to Dwork et al. (2015c,b); also cited are Dwork et al. (2015a), [Generalization in Adaptive Data…](#/papers/dwork2015holdout "Generalization in Adaptive Data Analysis and Holdout Reuse (2015)"), and Blum and Hardt (2015) (§1 "Related work"; §2.2; §3).
- Akinwande et al. (2024), PAC-Bayes bounds for prompts with a language-model prior, the closest formal device (App. A).

## Problem and setting

- **Question:** after many adaptive queries, the best model's gap between true and validation loss "can in principle be large"; "We ask what property of natural ML research keeps this gap small, and how to test it directly" (§2.1).
- **Assumptions:** training and validation sets drawn independently from one distribution (§2.1); for the theorems, losses between 0 and 1 and conditioning on the training data and on randomness independent of the validation set (§3); budgets fixed before the run (App. B, Remark 2); no channel from the validation set to the model except the prompt or the feedback bits (§6).
- **Tasks (Tab. 1; App. D):** Folktables ACSIncome (census income), Gene-Expr (synthetic, high-dimensional, label noise), SST-2 (sentiment), CIFAR-10 and ImageNet-1K (image classification; ImageNet from scratch, pretrained weights forbidden), CIFAR-100 Diffusion (denoising error), HH-RLHF reward modeling (preference pairs, log-loss) and WikiText-103 (language modeling, BPB).
- **Agents:** each role is "a single Claude Opus model instance driven by Claude Code" (§4 "Agent and pipeline"). Reproducers are told to run no adaptive search and at most 3 attempts (App. E.3).
- **Conditions:** numeric score feedback with 64- and 32-token prompts (§4.1); the ladder with at most 7 improvements in 50 queries (§4.2); a neutral prompt, "Try a range of approaches. Let the metric decide.", unless stated otherwise (§4 "Framing").

## Approach

- **Theory (§3).** Thm. 1, attributed to Dwork et al.: take a finite set of descriptions fixed before the validation set is seen, each turned into a model by a fixed decoder that never looks at the validation set, and losses between 0 and 1; then for any δ > 0, with probability at least 1 − δ over the validation draw, every such model's validation loss is within √(log(2|M|/δ)/(2n)) of its true loss, for |M| descriptions and n validation examples. Cor. 2: with token budget B and vocabulary fixed before the validation set is seen, a prompt of at most B tokens from any possibly adaptive procedure, and a reproducer fixed under the paper's conditioning, under Thm. 1's assumptions the bound holds for the reproducer's model, not the explorer's (§3.1). Cor. 3: with both ladder budgets, and per-checkpoint confidence levels summing to at most δ, fixed before the validation set is seen, and losses between 0 and 1, with probability at least 1 − δ, intervals hold together for every realized improvement checkpoint of the explorer, tighter at early ones (§3.2; proof App. B). Cor. 4 gives intervals no wider than Cor. 3's in that setup with δ split equally over the improvement budget, for metrics averaging independent, identically distributed 0/1 outcomes, such as accuracy (App. C.3).
- **Stress test (§5; App. J).** Aggressive framing, full sample-level validation access and, for several tasks, smaller validation sets or added label noise (Tab. 7). A checkpoint overfits when its validation metric beats its holdout metric by over 10% relative; the certificate fails when the explorer's validation metric beats the reproducer's by over 5% relative (App. J "Detection rule").

## Results

- **Output compression (§4.1, Fig. 2; Tab. 3).** On all 8 datasets, "no overfitting emerges under score-based feedback alone". Under the 5% criterion, 32-token reproducers match or exceed the explorer at 38 of 41 checkpoints (92.7%), as do 64-token ones; the failures are ImageNet and CIFAR-10 checkpoints where "the short prompt misses enough detail".
- **Shorter prompts (Fig. 1).** For one language-model strategy, reproducer performance holds down to 16-token prompts and drops sharply at 8.
- **Empty prompt (App. H, Tab. 6).** On 6 datasets, blank-prompt reproducers perform "at or near the explorer's first-iteration holdout".
- **Input compression (§4.2; App. I).** The ladder explorer "matches or slightly exceeds" the score-feedback explorer on holdout on all 8 datasets; the authors read this as suggesting "much of the useful validation signal is coarse".
- **Ladder bounds (§4.2, Fig. 3; Tab. 4).** On the 5 classification tasks, 95% interval half-widths range from about 0.6 to 2.5 percentage points, and observed validation–holdout gaps (0.0–1.9 points) sit inside them in all 5, using App. C's tighter form; "non-overlapping CIs certify that genuine progress occurred".
- **Stress test (§5, Fig. 4; App. J).** Agents "universally discover that direct use of validation data during training is the dominant strategy"; 38 of 102 checkpoints exceed the 10% gap. Failure to reproduce from 128-token prompts flags all 38 and 6 of the 64 others: 100% sensitivity, 91% specificity (Tab. 5).

## Limits the authors state

- "The formal statements are narrower than the empirical story." "Output compression only certifies the reproducer's hypothesis"; agreement "does not on its own endow the explorer's results with rigorous confidence intervals" (§6).
- An LLM that memorized aspects of the validation set in pre-training would bypass both bottlenecks; "the concern is not fully resolved by empirical observation alone", and datasets collected after the model's training cutoff "would address it more directly in future work" (§6).
- The token-count bound "is loose"; B is "an operational proxy for description length" (§3.1).
- The stress test's goal "is not to model every subtle form of benchmark overuse" (§5).
- The ladder bound is invalid if the budgets are chosen after seeing the transcript (App. B, Remark 2).
- ImageNet's from-scratch, 10-minute training budget explains "the low absolute accuracy" (App. D).

## Open problems and building blocks

- **Open:** a sharper bound with a language-model prior over prompts; "how to construct such a prior for agent-written strategy prompts remains an open question" (§3.1), and extending Cor. 2 "in that direction is natural future work" (App. A).
- **Released:** Nothing stated; role prompts are printed in App. E.
- **To reuse it:** Claude Opus agents via the Claude Code CLI (App. E); a harness that keeps validation data out of workspaces (§4 "Access control"); CPU for tabular tasks and one to eight A100 or H100 GPUs for the rest, with a 5–10 minute wall-clock budget per GPU training run (App. D).

## On this site

- **Tags:** <span class="tags"><a class="tag" href="#/tags/stats">stats</a><a class="tag sub" href="#/tags/hacking-general">hacking-general</a><a class="tag sub" href="#/tags/harness-general">harness-general</a><a class="tag sub" href="#/tags/llm-method">llm-method</a></span>
