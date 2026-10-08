# Which Decisions Low-Bit Quantization Breaks, and How to Predict Them

**Which Decisions Low-Bit Quantization…** · preprint 2026 (v5)

Read: [PDF](https://arxiv.org/pdf/2608.06564) · [arXiv](https://arxiv.org/abs/2608.06564)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Reads decisions of 16 open models at the first token, as the logit margin between two options (call a tool or reply in text, which tool, which answer, refuse or comply), before and after post-training quantization to 4, 3 and 2 bits under round-to-nearest, activation-aware scaling, GPTQ and GGUF, on BFCL, MetaTool, XSTest, MMLU, BoolQ, BBQ and authored items (abstract; §2).
- Fits the quantized margin as a shrunk and shifted copy of the original, $m' \approx c\,m + b$, prefers it to three additive-noise models by BIC (§3), and turns the fit into a forecast of the flip rate, scored on held-out halves (§5); a 400-task BFCL generation test checks the tool-call finding on full outputs (§4.1, App. A.19).
- What compression does to decisions with a known right answer (<a class="tag" href="#/tags/compact">compact</a>): the authors report that "whether to call a tool is often more sensitive than which tool to call" (abstract; Tab. 1), that the multiplicative account wins all 642 damaged conditions (§3), and that their forecast predicts a change of the margin's sign, "not of the model's output" (§5).

## In plain words

Fewer-bit weights save memory but "can also change model decisions, such as whether to call a tool or which option to choose from a finite set" (abstract); quantizers are designed around weight and layer-output error, but "Neither error says which decisions will change" (§1). The authors test 16 public models at 4, 3 and 2 bits under four quantizers, reading each decision as the score gap between two first tokens. Within one kind of decision, the new gap is approximately a shrunk and shifted copy of the old (§1), so quantization "does not simply add random noise" (abstract). On 400 tasks of the tool-calling benchmark BFCL, three of five models lose more completed calls than correct tool choices under 3-bit plain rounding (abstract). Over 1,082 settings, fitting on half the decisions predicts the share flipping on the other half to a median error of 1.0 percentage point, against 1.3 for reusing the first half's share (abstract). They claim the fitted shrinkage, the split between kinds of decision and the held-out forecast, not the effect's discovery (App. A.11).

## Background and terms

**Terms to know:** [post-training quantization](#/glossary/post-training-quantization) · [perplexity](#/glossary/perplexity) · [greedy decoding](#/glossary/greedy-decoding-and-temperature-sampling) · [bootstrap resampling](#/glossary/bootstrap-resampling) · [multiple testing](#/glossary/multiple-testing)

**The paper's own terms:**
- **margin**: the gap between the model's scores (logits) for two candidate first tokens on one prompt (an **item**); for whether-to-call (call or reply in text) and refusals (decline or comply), the correct option is the item's **side** (§2.1).
- **flip**, **flip rate**: quantization reverses which token scores higher; the share of items that flip, among those with a nonzero full-precision margin (§1).
- **the law**: Eq. 2, quantized margin = c × original + b + Gaussian noise of spread σ, fitted per condition (§3). **Surviving fraction** c is 1 "when nothing is lost" and 0 when the new margin no longer depends on the old; **offset** b moves every margin the same way (§3).
- **condition**: "one model configuration, bit-width and kind of decision in one run" (§2.2); **damaged** when fitted c is below 0.70 (§3); **estimable** when the slope's estimated uncertainty (standard error) is at most 0.10 (App. A.6); differences in c below 0.04 "are not interpretable" (App. A.4).
- **the rotation**: a fixed orthogonal mixing (block-diagonal Hadamard) applied before rounding, which spreads the few very large activation values (outliers) that make activations hard to quantize (§4.2).

**Missing glossary terms:**
- **BIC (Bayesian information criterion)**: a model-choice score that "rewards a better fit and charges for every extra parameter" (§3); a sibling of the [Akaike information criterion (AIC)](#/glossary/akaike-information-criterion-aic).
- **KV cache**: "the attention keys and values stored and reused during generation" (App. A.14).

**Builds on:**
- Quantizers built around layer-output error (Nagel et al., 2020; Li et al., 2021) or salient weight channels (Lin et al., 2024) (§1).
- Proskurina et al. (2024): quantization hits hardest the samples a model was least confident about; "no phrasing in this paper should suggest we found it" (App. A.11).
- Rababah et al. (2026), an agreement metric for quantized predictions: "the decision-level move is theirs as much as ours" (App. A.11).
- Jang et al. (2026) ([Flat Score, Amplified Failures](#/papers/jang2026flatscore "Flat Score, Amplified Failures: How the Error Budget Masks Damage in Quantized LLM Agents (2026)")), a concurrent agent study ("we agree on where and correct how"), and Xu et al. (2026), "Closest", refusals lost under KV-cache quantization (App. A.11).

## Problem and setting

- **Question:** how quantization changes preferences, and whether the changes are predictable (§1); decisions are read at the first token (§2.1). Models: 16, from 0.6B to 32B, plus four base-model controls (§2.2).
- **Test sets** (§2.2, App. A.6): 1,092 items, eleven kinds of decision. Tool use: BFCL whether-to-call requests and author-written which-tool, argument and tool-result items; separately, public which-tool tasks from BFCL and MetaTool (tool selection among listed tools) and BFCL argument tasks. Safety: XSTest requests (safety prompts), read as a forced choice and as the reply's natural opener. Also MMLU and BoolQ (knowledge and yes/no questions), synthetic arithmetic and code, and BBQ (social bias).
- **Quantization** (§2.2, App. A.6): linear layers in decoder blocks; embeddings and output heads stay at full precision. Round-to-nearest (each weight replaced by the nearest representable value, App. A.1); activation-aware scaling (rescaling salient weight channels; the authors' own implementation, App. A.14); GPTQ, calibrated on tool dialogues (Tab. 5) and exported with the AutoRound library; and GGUF, the quantized file format of llama.cpp (a local inference engine); mostly at 4, 3 and 2 bits; extra runs quantize activations and the KV cache.
- Analyses are "in sample unless stated otherwise" (App. A.6).

## Approach

- **Fit (§3).** Fit the law to each condition's before-and-after margins; four accounts (constant noise, noise plus drift, noise growing with the margin, the law) are compared by BIC (§3, App. A.5).
- **Break order (§4.1, App. A.18).** Compare kinds at 3 bits per quantizer (Tab. 1); five checks test the whether-to-call/which-tool gap for item or token effects.
- **Forecast (§5).** If the quantized margin is Gaussian around c × m + b with a spread that does not depend on m, a flip's chance can be read off the bell curve from c, b and σ (Eq. 3); fitted on half the items, scored on the rest (App. A.6).
- **Exclusion by algebra (§4.3, App. A.14).** Multiplying every logit by one positive factor and adding one shared constant moves no margin's sign, so temperature scaling and a global bias cannot undo a flip.

## Results

- **Shrinkage (§3).** In the main matrix, mostly round-to-nearest and activation-aware runs, the median surviving fraction is 0.86 at 4 bits, 0.29 at 3 and 0.00 at 2.
- **Not additive (§3).** "The multiplicative account wins all 642 damaged conditions" and stays the winner at every damage cutoff from 0.50 to 0.90 (App. A.5) and, among whether-to-call and refusal conditions, in every band of damage (App. A.22).
- **Break order (§4.1, Tab. 1).** At 3-bit round-to-nearest the median whether-to-call flip rate is 47% against 11% for which-tool on BFCL and 16% on MetaTool, less on every model except Gemma-4-E4B. Under GPTQ and GGUF "far fewer whether-to-call decisions flip than under plain rounding" (abstract). Author-written which-tool items never flip in the 64 three-bit runs, a zero that "rests on eight measurements and not forty".
- **Direction (§4.1, App. A.15, App. A.18).** Damaged-but-not-destroyed whether-to-call mostly leans toward not calling, though "not statistically established at the model unit"; at 3 bits the call token's logit falls further than nearly every other token's on three models.
- **Generation test (§4.1, App. A.19, Tab. 11).** On 320 held-out BFCL tasks, with pass criteria fixed in advance, three of the five models that pass full-precision checks lose the completed call before the tool name at 3-bit round-to-nearest; the five-model average gap is 20.2 percentage points (resampled lower bound 17.1).
- **Refusals (§4.2).** Under round-to-nearest most models keep most refusals at 3 bits; Qwen3-0.6B, Qwen3-1.7B, Qwen3.5-2B and Gemma-3-4B lose most forced-choice refusals.
- **Activations and cache (§4.2–4.3).** Four-bit activations into the linear layers, under the plain per-token quantizer (each token's values scaled by their own range), destroy the margin "whatever the weights are doing"; the rotation moves the collapse lower rather than removing it. "No cache width below 8 bits is safe for every model."
- **Repairs (§4.3).** No repair tested that needs no correct answers wins on a majority of the models tried, and none comes near the fall in flip rate one more bit brings to a severely damaged condition.
- **Forecast (§5, Fig. 3).** The 1.0-point median is over 1,082 conditions; errors are largest where the observed rate is mid-range. Constants copied from another model miss by a median of 26.8 points at 3 bits against 2.6 at 4 bits, "on the two models tried".
- **Scores hide it (App. A.9).** Whether-to-call damage "cannot be read off a benchmark score" (Tab. 3); on Qwen3-VL-4B, quantizing one slice of layers at a time, perplexity gave "no guidance on which layers to protect" (Tab. 4).

## Limits the authors state

- Post-training quantization only; rollouts not covered; one vision-language family (§7); each GPTQ table number comes from one run (App. A.6).
- The embedding table stays at full precision, "so a model we call 4-bit is above 4 bits in effective terms" (§7).
- The 4-bit refusal statement "holds for standard current-generation instruction-tuned models of 4B and above" (§7).
- "The break order and the missed-call forecast were tested on one external task set and five models" (§7); the two calibrated runs meet neither pre-set criterion (Tab. 11), and "a claim about deployment needs the calibrated runs to repeat the result" (App. A.19).
- "The forecast predicts a change of the margin's sign, not of the model's output"; predicting missed calls "is validated only on Qwen3-4B at 4 bits" (§5).
- The margin's match with generated output "weakens under severe quantization" (§2.1); "every 2-bit number in this paper is reported under that caveat" (App. A.1).
- Model comparison "does not prove a generative mechanism, and the competitor set, though built adversarially, is finite" (App. A.5).
- Correction for multiple comparisons does not cover "the tallies quoted downstream" (App. A.7).
- Model-assisted analysis "produced at least one error that reached a draft before a check caught it" (§ "AI use statement").

## Open problems and building blocks

- **Open:** the cause of the call-token penalty, and "why large models keep more margin is open" (§7); "Whether the call collapse holds outside text is open" (§6, App. A.16); whether undoing instruction tuning contributes in some models "stays open" (App. A.18); per-class or per-token corrections, low-rank output corrections, layerwise reconstruction and hidden-state methods are untested (App. A.14).
- **Released:** "Code, test sets, and the full result matrix will be released" (§ "Reproducibility statement").
- **To reuse it:** the scores of two chosen first tokens before and after quantization (§2.1); one paired pass on the shipped model and width to fit c, b and σ, reporting the observed rate where c cannot be estimated (§6).

## On this site

- **Tags:** <span class="tags"><a class="tag" href="#/tags/compact">compact</a><a class="tag sub" href="#/tags/general-misc">general-misc</a><a class="tag sub" href="#/tags/llm-misc">llm-misc</a></span>
