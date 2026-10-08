# How Sensitive Are LLM Leaderboard Claims to Hidden Model Selection?

**How Sensitive Are LLM…** · preprint 2026 (v2)

Read: [PDF](https://arxiv.org/pdf/2609.28177) · [arXiv](https://arxiv.org/abs/2609.28177)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Asks how many privately scored sibling variants a published leaderboard margin over a fixed comparator can survive: under a Gaussian margin model it derives the least-favorable null of the selected margin and inverts it into a per-claim sensitivity curve, the largest hidden count k̄ as a function of a lower bound on the siblings' correlation (abstract; §1; §3).
- Shows that the correlation that matters is the one on the score the board ranks by, under its sampling model, not a pooled item correlation (§4, Prop. 2), measured on observational families and on controlled strata of QLoRA, DPO and full fine-tunes of Qwen2.5, Llama-3.1 and Mistral evaluated on MMLU and GSM8K (§4; App. G); then audits adjacent cross-provider claims on the Open LLM Leaderboard v1, with a v2 snapshot and an Arena illustration (§1; §5).
- Selection bias from hidden model selection on checked benchmarks (<a class="tag" href="#/tags/stats">stats</a>), cited with [Position](#/papers/bowyer2025clt "Position: Don't Use the CLT in LLM Evals With Fewer Than a Few Hundred Datapoints (2025)") for marginal error bars being too short for a selected claim (§1). The authors report that 391 of 394 adjacent-rank claims lack statistical support even before accounting for selection (abstract; §5); the verdicts are conditional on an assumed number of hidden variants and correlation floor, which no auditor observes (§5; §6).

## In plain words

A developer may privately score several model variants and submit only the best to a leaderboard; the authors argue its lead is then inflated and ordinary error bars "too short for the selected claim" (§1). Neither their number nor how alike they are is public (abstract). For a fixed set of candidates and a bell-curve (Gaussian) model of score differences, they derive a curve: how many hidden variants a published lead over a fixed rival can survive with statistical evidence of an advantage intact, for each assumed lower bound on the variants' score correlation (abstract). The correlation must match the ranked score and how test items are sampled: in one controlled family it is 0.90 pooled over items, but 0.46 for the ranked score under item resampling and 0.92 when subjects of MMLU (a knowledge benchmark) are resampled (abstract). An item-based audit finds that 391 of 394 adjacent-rank claims on the Open LLM Leaderboard "lack statistical support even before accounting for selection" (abstract). They present the curve as a sensitivity analysis (§3), not an estimate of the search size (abstract).

## Background and terms

**Terms to know:** [multiple testing](#/glossary/multiple-testing) · [bootstrap resampling](#/glossary/bootstrap-resampling) · [LoRA](#/glossary/lora-low-rank-adaptation) · [direct preference optimization (DPO)](#/glossary/direct-preference-optimization-dpo) · [data contamination](#/glossary/data-contamination)

**The paper's own terms:**
- **siblings, k, comparator q, z**: a provider privately scores k variants ("siblings") and submits the best; the claim is against a fixed public comparator q; z is the score margin over its standard error (§2; §3).
- **provider-level null** (Eq. 2): "no variant of provider p truly beats q"; a rejection "certifies that some hidden variant truly beats q; it need not be the submitted one" (§2).
- **ρw, ρw⁻, ρb**: the correlation between two siblings' scores, an assumed lower bound ("floor") on it, and a sibling's correlation with the comparator (§2; §3).
- **certified**: a level-α significance verdict after accounting for k hidden tries (§3); not the glossary's [certificate](#/glossary/certificate) (our note).
- **sensitivity curve k̄(ρw⁻)**: the largest hidden count still certified if every sibling pair correlates at least ρw⁻ (§3, Eq. 4).
- **naive, Šidák, Dunnett, Bonferroni**: the naive test ignores selection; Šidák's law (the tail of the best of k independent margins) and Dunnett's limit (siblings correlate with each other only as much as with their shared comparator) are the curve's reference points at ρw⁻ = 2ρb − 1 and ρw⁻ = ρb (§3; App. B.3; App. C); Bonferroni needs no correlation assumption (§3) but is "conservative by an unmeasured amount" (§1).
- **pooled-item vs score-matched correlation**: of per-item correctness over all items, versus of the ranked score under the stated sampling model (§4).
- **verdicts** (§2): *provider-certified*; *not margin-certified* (which does not show that no variant beats the comparator); *model-insufficient* (M-I: the floor is outside the model's domain, only Bonferroni applies); *metadata-insufficient* (no fixed candidate family established).
- **plug-in, selected-β, joint**: successive treatments of the estimated inputs ("nuisances": comparator correlation, standard error), which selection can also affect: plug-in fixes them; selected-β (Berger–Boos, Eq. 5) uses an upper confidence bound on the winner's comparator correlation, adding the bound's failure chance to the p-value; joint also bounds the standard error from the raw margin (§3; App. B.5).

**Missing glossary terms:**
- **Slepian's inequality**: for Gaussian vectors with equal means and variances, raising the correlations can only raise the chance that the maximum stays below a threshold (App. B.2).

**Builds on:**
- Singh et al. (2025), "The Leaderboard Illusion": Meta tested 27 Llama-4 variants on a battle-style platform and released the best; the paper adopts 27 "as a stated reference multiplicity" (§1).
- Miller (2024) and Bowyer et al. (2025) ([Position](#/papers/bowyer2025clt "Position: Don't Use the CLT in LLM Evals With Fewer Than a Few Hundred Datapoints (2025)")): marginal error bars (§1).
- Kim et al. (2025) ([Correlated Errors in Large Language Models](#/papers/kim2025correlated "Correlated Errors in Large Language Models (2025)")): "sibling fine-tunes err on largely the same items" (§1).
- Dunnett (1955): the one-factor representation behind the exact tail (§3).

## Problem and setting

- **Question:** "under how much hidden selection a given claim remains certifiable": a provider's advantage over a fixed comparator, "not the correctness of the complete ranking" (§1).
- **Model (§2, Eq. 1):** treating test items as a sample from a larger pool (a "super-population"), scores are asymptotically Gaussian: shared item difficulty (cancels in a margin) plus a family component plus noise. Arbitrary selection within a fixed candidate family is allowed, but "candidates generated adaptively from benchmark feedback are outside the guarantee" (§2; §6).
- **Data (§4; App. G):** per-item results of 395 Open LLM Leaderboard models (a public board of open models; v1 ranks by the equal-weight mean of six benchmark accuracies); 12 hand-curated sibling families (k = 3–8); a 45-family census on MMLU-Pro (a harder MMLU variant). Six controlled strata, scored per item on MMLU and GSM8K (grade-school math with generated answers): 20 QLoRA (LoRA on a quantized base) variants each of Qwen2.5-7B, Llama-3.1-8B and Mistral-7B-v0.3, 10 DPO variants of the Qwen base, and 5 each of full-fine-tune and LoRA Qwen2.5-1.5B.
- **Audit (§5):** v1 adjacent cross-provider claims, a v2 snapshot and an Arena illustration (a platform where users compare two models); α = 0.05, k = 27, floors 0.42 and 0.56, both "illustrative sensitivity anchors" (§4).

## Approach

- **Lemma 1 (§3):** under the provider-level null and the Gaussian margin model, the chance that the selected margin exceeds any value is largest when every sibling's true mean equals the comparator's (the least-favorable null).
- **Eq. 3–4:** there the tail is a one-dimensional integral; inverting it in k gives the curve (§3).
- **Lemma 2:** a higher sibling-correlation floor makes a claim easier to certify: the tail is nonincreasing in ρw on [2ρb − 1, 1]. With unequal pairwise correlations whose minimum is at least 2ρb − 1, and one comparator correlation for all siblings, the equal-correlation tail at that minimum is an upper bound (Slepian); a family mean gives none (§3).
- **Lemma 3:** if within-family correlations are at least the floor, comparator correlations at most β⁺, and score SD ratios within [1/R, R], the tail at a worst-case floor bounds the selected margin under the null "for any selection rule W"; a negative floor gives M-I (§3).
- **Prop. 1:** at fixed ρw, a higher comparator correlation makes it harder: on ρw ≥ 2ρb − 1, ρb < 1, the least-favorable standardized tail is nondecreasing in ρb (§3).
- **Prop. 3 (App. B.4):** under Lemma 3's assumptions, any selection rule and true means, with the margin standardized by its true standard deviation, the same critical value bounds the unconditional chance of certifying a submitted model not truly better; the audit's estimated standard error makes it a plug-in, checked empirically (remark).
- **Estimated inputs (§1; §3; App. B.5, Prop. 4):** adjustments are computed at a candidate count K (unlike the assumed k) and are "fixed-K asymptotic" (approximate as items grow, K fixed); budgets are the largest certified K ≤ 100.
- **Prop. 2 (§4):** for an equal-weight mean of per-benchmark accuracies under within-benchmark item resampling, a benchmark weighs in the score correlation as one over its item count, but in a pooled-item covariance by its item share, plus a between-benchmark term; the two "need not agree in magnitude or in ordering across families; the certificate requires the former".

## Results

- **Correlation penalty:** at α = .05 and ρb = .5, 27 correlated variants need the same critical value as 5–19 independent tries across illustrative scenarios (§1; Fig. 1; Tab. 4).
- **Pooled vs score-matched:** the SFT strata's pooled medians are 0.73–0.90 but score-matched medians on the composite 0.42–0.58; DPO stays at 0.81 (pooled 0.96) (§4; App. G, table on PDF p. 28). In the worked family, item resampling lets GSM8K, a small item share, dominate the composite's variance (Fig. 2a); MMLU subject resampling reverses the contrast, which "is conditional on the sampling model" (§4; App. E).
- **Before selection:** only three of 394 v1 claims pass the uncorrected test; at k = 27 the Gaussian plug-in column (0.56 floor, item resampling) certifies none, Bonferroni one (§5; App. I; Fig. 12).
- **Top claims (Tab. 1):** v1 rank 1 is "the only k-sensitive verdict", refused from k = 20 at the 0.56 floor; rank 2 is Bonferroni-certified but M-I; rank 3 is refused by every correction at k ≥ 3; v2 rank 4 certifies throughout (§5).
- **Rank 1 at k = 27:** the required floor rises from 0.689 (plug-in) to 0.849 (joint), above the largest curated and controlled minima measured under item resampling, "but those measurements do not bound a private family" (§1; §5; Fig. 3a).
- **Validation:** the model tail is conservative in 12/12 masked curated families (§5). The controlled replays' only resolved failure is the equal-variance full-fine-tune cell against an external comparator, which the joint (β⁺, R) column restores (§4; App. G).

## Limits the authors state

- Lemma 3 covers "bounded variance ratios and comparator heterogeneity, not non-Gaussian tails or unbounded variance asymmetry" (§6).
- Of the item and subject analyses, neither "accounts for all benchmark construction or contamination uncertainty" (§6).
- "Hidden-family floors and heterogeneity caps remain assumptions, not estimates for frontier labs" (§6); the measurements illustrate scenarios, "not to calibrate a likely hidden-family floor" (§4), and Fig. 11's ten Qwen2.5-1.5B variants are "from one controlled setup, not a representative sample of hidden frontier-model searches" (Fig. 11).
- "The audit is pair-conditional and fixed-k; overlapping board counts are descriptive"; "all public-board verdicts remain conditional" (§6).
- The k = 3–8 replays do not validate coverage at K = 100; the finite-sample construction is "vacuous here", though this "does not rule out sharper finite-sample routes" (App. B.5).

## Open problems and building blocks

- **Open:** a board can request a candidate count and a record that candidates were fixed before benchmark feedback, then publish a finite-range curve; with all candidates disclosed, joint max-t inference (one bootstrap band over all candidates; App. B.5) "can reduce the nuisance penalty" (the cost of bounding estimated inputs), and "independent confirmation data can instead separate selection from evaluation" (§6).
- **Released:** `selective-evals`, "public release on acceptance" (§1); the supplement provides it with scripts and machine-readable results (App. A).
- **To reuse it:** the package works "from aligned per-item evaluation matrices" (§1); the CLI takes z, the comparator correlation, k and floors, or two per-item correctness columns (App. H).

## On this site

- **Tags:** <span class="tags"><a class="tag" href="#/tags/stats">stats</a><a class="tag sub" href="#/tags/general-misc">general-misc</a><a class="tag sub" href="#/tags/llm-misc">llm-misc</a></span>
