# Prompt Codebooks: Discrete Compositional Optimization for Language Model Instruction Refinement

**Prompt Codebooks (PCO)** · preprint 2026

Read: [PDF](https://arxiv.org/pdf/2605.28360) · [arXiv](https://arxiv.org/abs/2605.28360)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- A codebook of reusable instruction units; an encoder routes each input to a few, a generator composes the prompt.
- Discrete compositional optimization instead of global string edits.
- Reports beating GEPA on HotpotQA with 8B models (abstract); its Qwen3-8B baseline cells are GEPA's own published numbers ([GEPA](#/papers/agrawal2025gepa "GEPA: Reflective Prompt Evolution Can Outperform Reinforcement Learning (2026)") Tab. 1). Compact models, cf.

## In plain words

Automatic prompt optimization (APO) methods usually find one prompt per task, apply it to every input, and rewrite the whole text after each critique. The authors argue this ignores the individual input, and a fix for one failure can disturb behaviours that worked (§1). They propose Prompt Codebook Optimization (PCO): a small library of short reusable instructions, called instincts; an LLM picks a few for each input, a second LLM writes them into a prompt, and a critic LLM's feedback is split so each part updates only the piece it blames. One 8B model plays every role. With the open models Qwen3-8B and LLaMA-3.1-8B, they report aggregate gains over zero-shot prompting across six benchmarks, an aggregate gain on Qwen3-8B over the prompt optimizer GEPA, a gain over GEPA on HotpotQA multi-hop question answering, and shorter deployed prompts than GEPA and the optimizer MIPROv2 (abstract, §1). They present PCO as "a novel compositional prompt optimization framework" (abstract), adding that "no prior APO method organizes prompts as compositions over a discrete codebook of natural-language instincts" (§1).

## Background and terms

**Terms to know:** [reflective prompt optimization](#/glossary/reflective-prompt-optimization) · [GRPO](#/glossary/grpo) · [LLM-as-a-judge](#/glossary/llm-as-a-judge) · [post-training quantization](#/glossary/post-training-quantization) · [textual gradient](#/glossary/textual-gradient) (§3.5, Eq. 9) · [exploration and exploitation](#/glossary/exploration-and-exploitation) (by ε-greedy exploration: with probability ε, choose by exploration instead of by the current policy, so neglected options still get tried, §3.6)

**The paper's own terms:**
- **Instinct**: "atomic, reusable instruction units" (abstract), e.g. "decompose into sub-questions before answering" (§3.2). The **codebook** is the set of K instincts, all trainable text (§3.2).
- **Encoder, generator, critic, executor**: LLM roles with trainable system prompts (θ, φ, ψ), except the frozen executor M. The encoder picks S of K instincts per input ("routing"; S is the "bottleneck width"); the generator composes them into a prompt; the critic judges the answer (§3.2, §4.2).
- **Scalarizer (ρ)**: turns the critic's verdict into a non-negative penalty, zero for an empty critique (§3.4).
- **Success rate (sr)**: an entry's running average of reward minus penalty over prompts containing it (§3.6, Alg. 1).
- **Codebook collapse**: fewer than half the entries ever selected (Def. 2, App. B.2).
- **Attribution Operator**: a fixed prompt, not optimized, that splits the critic's verdict into feedback for generator, codebook and encoder (App. C.2).

**Missing glossary terms:**
- **Dead codes**: in vector-quantized models, which map inputs to the nearest of a set of learned codes, codes that are never chosen and so never trained (§3.6).

**Builds on:**
- GEPA ([GEPA](#/papers/agrawal2025gepa "GEPA: Reflective Prompt Evolution Can Outperform Reinforcement Learning (2026)")), a reflective prompt optimizer: its evaluation protocols are followed (§4), and §1 calls it "the strongest baseline" on Qwen3-8B.
- TextGrad ([TextGrad](#/papers/yuksekgonul2024textgrad "TextGrad: Automatic 'Differentiation' via Text (2024)")): training is textual gradient descent (§3).
- Discrete latent codebooks (VQ-VAE, the vector-quantized variational autoencoder) and generator–critic training (GANs), the design's model (§1).
- Adversarial in-context prompt optimization (Do et al., ACL 2024; not listed here): its min–max game over one prompt is extended to a codebook (§1).

## Problem and setting

- **Question:** can prompt optimization learn reusable instructions chosen per input (§1)? Standard APO finds one prompt maximizing a frozen LLM's expected task reward on a per-task dataset with reference answers (Eq. 1, §3.1); PCO replaces it with the pipeline (Eq. 2).
- **Models:** "A single local 8B LLM serves all roles (encoder, generator, critic, executor) via role-specific system prompts" (§4): Qwen3-8B or LLaMA-3.1-8B, 4-bit, on one A100 GPU (App. C, Tab. 6). Defaults: K = 16, S = 4, 50 epochs, batch size 15, ε from 1.0 to 0.15 (§4); Tab. 6 holds "unless stated otherwise".
- **Benchmarks (§4, App. C.1, Tab. 7):** HotpotQA (multi-hop question answering with retrieval; exact match), HoVer (multi-hop fact verification), IFBench (instruction following under output constraints; Tab. 7 names constraint satisfaction rate as metric), PUPA (privacy-preserving delegation; LLM-judged quality minus leaked personal data), AIME-2025 and LiveBench-Math (math, final-answer accuracy).
- **Baselines:** zero-shot, MIPROv2 (an instruction-and-demonstration optimizer), GRPO, GEPA and GEPA+Merge (GEPA plus candidate merging); "Following GEPA, we adopt identical evaluation protocols with strictly held-out test sets" (§4).

## Approach

- **Forward pass (§3.3, Eqs. 3–5, Fig. 2):** route, compose, execute once; inputs of one task can get different instinct sets (Fig. 1).
- **Objective (§3.4, Eq. 6):** a "language-valued min–max objective": encoder, generator and codebook maximize task reward minus the critic's penalty, while the critic's criteria are updated toward "harder, more subtle flaws", as with GAN critics.
- **Backward pass (§3.5, Eqs. 7–9):** the critic reads the whole trace (input, chosen indices, instincts, prompt, answer, reference), returning a verdict plus feedback scoped to routing, composition, each active instinct and itself; each piece updates only its variable by an LLM rewrite, so inactive entries stay unchanged. In the implementation, "to prevent LLM hallucination during structured extraction", the critic writes the verdict, the Attribution Operator splits it, and the critic's own feedback comes from "a separate adversarial inner update" (App. C.2).
- **Exploration (§3.6, Alg. 1):** with probability ε (decaying from 1.0 to 0.15) indices are sampled in proportion to exp(sr/τ), with softmax temperature τ = 0.5, not taken from the encoder; else unselected entries starve, the "textual analogue of dead codes".
- **Inference (§3.7):** one forward pass, no critic.
- **Theory (App. B),** restricted by the authors "to properties directly derivable from Algorithm 1":
  - If the generator turns different instinct subsets into different prompts for every input (Assumption 1), PCO can express every fixed prompt and also policies no fixed prompt can; over N training inputs it has at least (K choose S) to the power N distinct policies (Thm. 1).
  - Some task and routing beat the best fixed prompt in expected reward; on a constructed task with M inputs, 2 ≤ M ≤ K, each needing its own single codebook entry (S = 1), the gap is at least 1 − 1/M (Thm. 2). Cor. 1 applies this to GEPA, MIPROv2 and TextGrad as instance-blind.
  - If every success rate stays in [0, 1], under Alg. 1 with ε in (0, 1] and τ = 0.5, the expected number of entries selected at least once is at least K·(1 − exp(−εNS·e^(−1/τ)/K)) (Thm. 3), treating those steps as conditionally independent (Remark 1).
  - With ε = 0, where the encoder routes deterministically, only chosen entries are updated, and the encoder sees each entry's past success rate, the authors argue by analogy with a rich-get-richer urn process that the used entries shrink in the long run, with probability 1 ("almost surely"), to order S rather than K (Prop. 4).
  - If the holistic penalty differs from the sum of per-component penalties (instinct penalties averaged over the S active entries) by at most δmax with probability 1, their expectations differ by at most δmax (Thm. 5).

## Results

- **Main table (§4.1, Tab. 1):** aggregate 58.74 for PCO against 54.85 for GEPA and 45.24 zero-shot on Qwen3-8B (+13.50); 47.31 against 44.46 and 35.51 on LLaMA-3.1-8B (+11.80). HotpotQA: 68.67 against GEPA's 62.33 (Qwen3-8B), 51.66 against 47.39 (LLaMA). PCO tops every column of Tab. 1 for both models, IFBench included.
- **Prompt length (§4.1 Observation 4, Fig. 4(a)):** maximum deployed prompt up to 14.1× shorter than MIPROv2's and up to 3.0× shorter than GEPA's.
- **Cost (§4.4, Tab. 5; HotpotQA, LLaMA):** 9.05M training tokens against GEPA's 8.8M; about 45 s against 126 s per query.
- **Ablations (§4.2, Tab. 3; IFBench, LLaMA):** accuracy 34.18 for full PCO against 31.51 without the learnable encoder, 29.51 without textual gradients, 28.18 without ε-greedy, 24.18 with uniform instead of success-weighted sampling, and 30.95 zero-shot. Without ε-greedy, use collapses onto a few entries (Fig. 4(b)). Results peak at K = 16 and S = 4 (Fig. 5).
- **Critic (§4.3, Tab. 4; LLaMA executor):** aggregate falls 2.29 points with a fixed instead of trained critic, 7.30 with a 3B critic, 0.80 with a Qwen3-8B critic, read as robustness to a critic from another model family.
- **Specialization (§4.1 Observation 5, Tab. 2):** often-chosen entries have low success rates, rarely chosen ones high (usage at inference, success rate from training), which "suggests" "broadly-applicable fallbacks versus narrow, high-precision specialists".
- **Attribution operator (App. E.1, Tabs. 9–10):** precision and recall per failure type on 150 synthetic HotpotQA traces, each with one forced failure.

## Limits the authors state

- "Due to resource constraints, we do not evaluate on proprietary models such as GPT-4.1 Mini" (§4).
- "classical SGD convergence theory does not apply" to LLM text rewriting (App. B).
- Thm. 2 covers only single-entry optima; a gap for subsets of entries needs a further condition, and they "do not claim it" (App. B.1).
- Thm. 3 is "an expected-case guarantee conditioned on a slowly evolving reward landscape" (Remark 1).
- Prop. 4 is "a reinforcement-process analogy rather than a fully self-contained proof", the encoder's selection kernel being "not analytically tractable" (App. B.2).
- Assumption 1 "holds when codebook entries are semantically distinct" and the generator is told to use every chosen instinct (App. B.1).
- A critic temperature above 0.3 "induces hallucinated attribution and breaks JSON parsing stability" (App. F.2); at temperature 0.8 or more the generator "begins to hallucinate and omit hard constraints" (App. F.4).
- "effective component-level feedback requires a sufficiently capable critic" (§4.3).
- Random initialization ends lower than expert seeds on IFBench (App. F.5, Tab. 11), which need hand-written instincts.
- An adversarially optimized codebook "could systematically propagate bias, manipulative phrasing, or safety-evading instructions across tasks if transferred without inspection"; they recommend auditing, versioning and a safety-aware critic (App. G).

## Open problems and building blocks

- **Open:** the subset-level reward gap is left "to future work" (App. B.1); "a rigorous convergence proof under the precise PCO update rule is left to future work" (Prop. 4).
- **Released:** Nothing stated.
- **To reuse it:** one 8B model, 4-bit, on one A100 80 GB, no external API calls (App. C, Tab. 6); a task reward and references (§3.1); a capable critic (§4.3); the role prompts (App. C.2); about 9M training tokens (HotpotQA, Tab. 5).
- **Beyond its domain:** each of PCO's four advantages corresponds "to a capability useful for broader agentic workflows" (§1).

## On this site

- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/promptopt-feedback">promptopt-feedback</a><a class="tag sub" href="#/tags/promptopt-general">promptopt-general</a></span>
