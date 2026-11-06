# Prompt Codebooks: Discrete Compositional Optimization for Language Model Instruction Refinement

**Prompt Codebooks (PCO)** · preprint 2026

Read: [PDF](https://arxiv.org/pdf/2605.28360) · [arXiv](https://arxiv.org/abs/2605.28360)

<p class="notice">A summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- A codebook of reusable instruction units; an encoder routes each input to a few, a generator composes the prompt.
- Discrete compositional optimization instead of global string edits.
- Reports beating the strongest baseline in aggregate over six benchmarks with 8B models (abstract); its Qwen3-8B baseline cells are GEPA's own published numbers ([GEPA](#/papers/agrawal2025gepa "GEPA: Reflective Prompt Evolution Can Outperform Reinforcement Learning (2026)") Tab. 1), as the paper states (§5). Compact models, cf.

## In plain words

Automatic prompt optimization (APO) methods usually find one prompt per task, apply it to every input, and rewrite the whole text after each critique. The authors argue this ignores the individual input, and a fix for one failure can disturb behaviours that worked (§1). They propose Prompt Codebook Optimization (PCO): a small library of short reusable instructions, called instincts; an LLM picks a few for each input, a second LLM writes them into a prompt, and a critic LLM's feedback is split so each part updates only the piece it blames. One 8B model plays every role. With the open models Qwen3-8B and LLaMA-3.1-8B, they report aggregate gains across six benchmarks over zero-shot prompting and over the strongest baseline, and shorter deployed prompts than the prompt optimizers GEPA and MIPROv2 (abstract). They present PCO as "a novel compositional prompt optimization framework" (abstract), adding that "no prior APO method organizes prompts as compositions over a discrete codebook of natural-language instincts" (§1).

## Background and terms

**Terms to know:** [reflective prompt optimization](#/glossary/reflective-prompt-optimization) · [GRPO](#/glossary/grpo) · [LLM-as-a-judge](#/glossary/llm-as-a-judge) · [textual gradient](#/glossary/textual-gradient) (§3.5, Eq. 9) · [exponential moving average (EMA)](#/glossary/exponential-moving-average-ema) · [exploration and exploitation](#/glossary/exploration-and-exploitation) (by ε-greedy exploration: with probability ε, choose by exploration instead of by the current policy, so neglected options still get tried, §3.6)

**The paper's own terms:**
- **Instinct**: "atomic, reusable instruction units" (abstract), e.g. "decompose into sub-questions before answering" (§3.2). The **codebook** is the set of K instincts, all trainable text (§3.2).
- **Encoder, generator, critic, executor**: LLM roles with trainable system prompts (θ, φ, ψ), except the frozen executor M. The encoder picks S of K instincts per input ("routing"; S is the "bottleneck width"); the generator composes them into a prompt; the critic judges the answer (§3.2, §5.2).
- **Scalarizer (ρ)**: turns the critic's verdict into a non-negative penalty, zero for an empty critique (§3.4).
- **Success rate (sr)**: an entry's EMA of binary task success over prompts containing it, so it stays between 0 and 1 (§3.4, §3.6, Alg. 1).
- **Codebook collapse**: fewer than half the entries ever selected (Def. 2, §4.2).
- **Attribution operator**: a fixed prompt, not optimized, that splits the critic's verdict into feedback for generator, codebook and encoder (App. C).
- **CSR and Acc** (IFBench): CSR, the constraint satisfaction rate, is the share of an instruction's constraints a response satisfies; Acc is the share of prompts whose constraints are all satisfied under IFBench's lenient ("loose") evaluation (App. B.1).

**Missing glossary terms:**
- **Dead codes**: in vector-quantized models, which map inputs to the nearest of a set of learned codes, codes that are never chosen and so never trained (§3.6).

**Builds on:**
- GEPA ([GEPA](#/papers/agrawal2025gepa "GEPA: Reflective Prompt Evolution Can Outperform Reinforcement Learning (2026)")), a reflective prompt optimizer: "our strongest baseline" (App. A), whose Qwen3-8B baseline numbers are taken over (§5).
- TextGrad, Yuksekgonul et al. (2025) ([TextGrad](#/papers/yuksekgonul2024textgrad "TextGrad: Automatic 'Differentiation' via Text (2024)")): training is textual gradient descent (§3).
- Discrete latent codebooks (VQ-VAE, the vector-quantized variational autoencoder) and generator–critic training (GANs), the design's model (§1).
- Adversarial in-context learning, Do et al. (2024) (not listed here): its min–max game over one prompt is extended to a routed codebook (§1, contribution 3).

## Problem and setting

- **Question:** can prompt optimization learn reusable instructions chosen per input (§1)? Standard APO finds one prompt maximizing a frozen LLM's expected task reward on a per-task dataset with reference answers (Eq. 1, §3.1).
- **Models:** "A single local 8B LLM serves all roles (encoder, generator, critic, executor) via role-specific system prompts" (§5): Qwen3-8B or LLaMA-3.1-8B, on one A100 GPU, with no external API calls (App. B). Defaults: K = 16, S = 4, 50 epochs, ε from 1.0 to 0.15 (§5); Tab. 7 holds "unless stated otherwise".
- **Benchmarks (§5, App. B.1, Tab. 8):** HotpotQA (multi-hop question answering with retrieval; exact match), HoVer (multi-hop fact verification; evidence complete and label correct), IFBench (instruction following under output constraints; CSR), PUPA (privacy-preserving delegation; LLM-judged quality minus leaked personal data), AIME-2025 (30 problems, each repeated five times; final-answer accuracy) and LiveBench-Math (math; the official LiveBench grader).
- **Baselines:** zero-shot, MIPROv2 (Bayesian optimization, a model-guided search, of instructions and demonstrations), GRPO, GEPA and GEPA+Merge (GEPA plus candidate merging). For Qwen3-8B, "baseline numbers are taken from Agrawal et al. (2026)", with PCO run under "the same splits, metric definitions, and evaluation harness" (§5). LLaMA-3.1-8B entries are means over 3 seeds (Tab. 1).

## Approach

- **Forward pass (§3.3, Eqs. 3–5, Fig. 3):** route, compose, execute once; inputs of one task can get different instinct sets (Fig. 2).
- **Objective (§3.4, Eq. 6):** a "language-valued min–max objective": encoder, generator and codebook maximize task reward minus the critic's penalty, while the critic's criteria are updated toward "harder, more subtle flaws", as with GAN critics.
- **Backward pass (§3.5, Eqs. 7–9):** the critic reads the whole trace (input, chosen indices, instincts, prompt, answer, reference), returning a verdict plus feedback scoped to routing, composition, each active instinct and itself; each piece updates only its variable by an LLM rewrite, so inactive entries stay unchanged. In the implementation, a critic writes the verdict, the attribution operator splits it, and the critic's own feedback comes from "a separate step that implements the adversarial inner update" (App. C).
- **Exploration (§3.6, Alg. 1):** with probability ε (decaying from 1.0 to 0.15) indices are sampled in proportion to exp(sr/τ), with softmax temperature τ = 0.5, not taken from the encoder; else unselected entries starve, the "textual analogue of dead codes".
- **Inference (§3.7):** one forward pass, no critic.
- **Theory (§4),** restricted "to properties derivable directly from Algorithm 1"; the results "characterize the expressivity of the PCO policy class, not the optimization dynamics of Algorithm 1":
  - If the generator turns different instinct subsets into different prompts for every input (Assumption 1), PCO can express every fixed prompt and also policies no fixed prompt can; on a training set of N ≥ 2 inputs it has at least (K choose S) to the power N distinct policies (Thm. 1).
  - Some task and routing beat the best fixed prompt in expected reward; on a constructed task with m equally likely inputs, 2 ≤ m ≤ K, each needing its own single codebook entry (S = 1), the gap is at least 1 − 1/m (Thm. 2). Cor. 1 applies this to GEPA, MIPROv2 and TextGrad as instance-blind.
  - Under Alg. 1, where success rates stay in [0, 1], with ε in (0, 1], τ = 0.5, and exploratory draws treated as independent (Remark 1), the expected number of entries selected at least once is at least K·(1 − exp(−⌊εN⌋·S·e^(−1/τ)/K)) over an epoch of N inputs, ⌊εN⌋ being its exploratory steps (Thm. 3).
  - With ε = 0, only chosen entries are updated and the encoder sees each entry's success rate; by analogy with a rich-get-richer urn process, the authors argue informally that a subset of order S takes almost all selections (Prop. 4).
  - The sum of the four component penalties (instinct penalties averaged over the S active entries) equals the holistic penalty in expectation up to the mean residual; if the residual is at most some bound δmax with probability 1, the gap is at most δmax (Prop. 5).

## Results

- **Main table (§5.1, Tab. 1):** aggregate 58.73 for PCO against 54.84 for GEPA and 45.23 zero-shot on Qwen3-8B (+13.50); 49.44 against 44.51 and 35.54 on LLaMA-3.1-8B (+13.91, mean over 3 seeds). PCO has the best mean in every column for both models.
- **Prompt length (§5.1 Observation 4, Fig. 5(a); Qwen3-8B):** deployed prompts up to 14.1× shorter than MIPROv2's and up to 3.0× shorter than GEPA's.
- **Cost (§5.4, Tab. 5; HotpotQA, LLaMA):** 9.05M training tokens against GEPA's 8.8M; about 45 s against 126 s per query.
- **Ablations (§5.2, Tab. 3; IFBench, LLaMA, CSR, 3 seeds):** 34.58 for full PCO against 31.52 without the learnable encoder, 29.48 without textual gradients, 28.34 without ε-greedy, 24.38 with uniform instead of success-weighted sampling, and 30.95 zero-shot. Without ε-greedy, use collapses onto a few entries (Fig. 5(b)). Results peak at K = 16 and S = 4 (Tab. 3).
- **Hyperparameters (§5.2, Fig. 6; HotpotQA, LLaMA):** critic temperature is the most sensitive.
- **Critic (§5.3, Tab. 4; LLaMA executor):** aggregate falls 4.44 points with a fixed instead of trained critic, 9.52 with a 3B critic and 2.86 with a Qwen3-8B critic, "suggesting that an adaptive critic from a different model family remains effective, although a same-family critic performs best".
- **Specialization (§5.1 Observation 5, Tab. 2; IFBench, LLaMA):** often-chosen entries have low success rates, rarely chosen ones high, which "suggests" "broadly-applicable fallbacks versus narrow, high-precision specialists".
- **Attribution operator (App. D.1, Tab. 9):** macro F1 (precision and recall combined, averaged over failure types) of 0.84 on 150 synthetic HotpotQA traces, each with one component perturbed.

## Limits the authors state

- "Due to resource constraints, we do not evaluate on proprietary models such as GPT-4.1 Mini" (§5).
- "classical SGD convergence theory does not apply" to LLM text rewriting (§4).
- "whether training actually reaches high-performing routings is an empirical question we address in Section 5" (§4).
- Thm. 2 covers single-entry optima only; a gap for subsets of entries "would additionally require a reward-discriminability condition" (proof of Thm. 2, §4.1).
- Thm. 3 is "an expected-case bound under an independence approximation" (Remark 1).
- Prop. 4 is "informal" (§4.2); Prop. 5 "does not show that attribution is accurate" (§4.3).
- Assumption 1 "holds when codebook entries are semantically distinct" and the generator incorporates every selected instinct (§4.1).
- "effective component-level feedback requires a sufficiently capable critic" (§5.3).
- On IFBench, random initialization ends below the zero-shot baseline in CSR, while expert-seeded instincts reach the main result: "seed quality matters on constraint-heavy tasks" (App. D.2, Tab. 10).
- "We do not claim that these results transfer unchanged to substantially larger or closed executors, to interactive multi-turn settings, or to modalities beyond text"; extending PCO to these is "left to future work" (§6 "Scope of Analysis").
- An adversarially optimized codebook "could systematically propagate bias, manipulative phrasing, or safety-evading instructions across tasks if transferred without inspection"; they recommend auditing, versioning and a safety-aware critic (§6 "Limitations").

## Open problems and building blocks

- **Open:** None stated beyond the scope extensions under Limits (§6).
- **Released:** Nothing stated.
- **To reuse it:** one 8B model serving every role, on one A100 80 GB, no external API calls (App. B); a task reward, references and a binary success per instance (§3.1, App. B.1); a capable critic (§5.3); seed instincts, expert-seeded ones doing better (App. D.2); the module prompts (App. C, Fig. 7); about 9M training tokens (HotpotQA, Tab. 5).
- **Beyond its domain:** each of PCO's four advantages corresponds "to a capability useful for broader agentic workflows" (§1).

## On this site

- **Discussed in:** [Which entries of a learned skill help](#/challenges/skill_entry_attribution)
- **Tags:** <span class="tags"><a class="tag" href="#/tags/llm">llm</a><a class="tag" href="#/tags/math">math</a><a class="tag" href="#/tags/method">method</a><a class="tag" href="#/tags/nl">nl</a><a class="tag sub" href="#/tags/promptopt-feedback">promptopt-feedback</a></span>
