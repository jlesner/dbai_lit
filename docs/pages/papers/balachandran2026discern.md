# Pay Only for Disagreement: Certified No-Regression Verdicts for Model Updates with Matching Label-Complexity Bounds

**DISCERN ("Pay Only for Disagreement")** · preprint 2026

Read: [PDF](https://arxiv.org/pdf/2609.17560) · [arXiv](https://arxiv.org/abs/2609.17560)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Certifies whether a model update (retrain, fine-tune, quantization, vendor swap) is a regression: a sequential audit of the paired risk difference between old and new model, with anytime-valid confidence sequences, valid under any predictable label-routing rule (abstract; §4; §5.1).
- A support identity: for a loss determined by the prediction, the risk difference lives only on inputs where the two models disagree (§3, Assumption "Prediction-determined loss" and Lemma "Support identity"); a zero-label tier certifies when disagreement is rare, an audited tier labels only sampled disagreements, and the authors prove matching label-complexity bounds and a Θ(1/ρ) saving over any pairing-blind auditor when ρ ≥ 2ε (abstract; §5.2–5.3; Cor. 10). Tested on 715 classifier-head update pairs and 70 LoRA fine-tunes of Pythia models up to 1.4B (§6.1).
- Comparing two versions of a model with labels spent only where they disagree (our reading: two versions of an LLM method on checked tasks); the main guarantees need a loss determined by the prediction, a soft extension covers losses Lipschitz in the model's output (a score or logit; no matching lower bound there), and open-ended judged generation is excluded (§1 scope note; §5.6, Prop. 14; §8).

## In plain words

A retrained, fine-tuned or quantized model may be worse than the one it replaces. The author argues that this promotion decision is "statistically informal in most organizations", and that uniform labelling of sampled traffic wastes labels on inputs where both models predict the same thing, since these add nothing to the gap in their average loss (§1). The paper builds DISCERN, a two-stage audit for losses that depend only on the prediction (§1): when unlabelled traffic shows the models rarely disagree, it approves the update with no labels; otherwise it labels only sampled disagreements, and its verdict stays valid however often the operator checks it, on traffic that does not drift (§3). The author proves its label cost matches a lower bound up to logarithmic factors (§5.2–5.3). Over the main 4,290 replayed audits, the audit's interval missed the true difference at some point on 0.0002 of them, against an allowed 5% (§6.2, Tab. 2); at a 1% tolerance, 56% of benign audits were approved with zero labels (§6.3). The author presents the label-cost characterization as new "to our knowledge" (§1).

## Background and terms

**Terms to know:** [McNemar's exact test](#/glossary/mcnemars-exact-test) · [active learning](#/glossary/active-learning) · [statistical power](#/glossary/statistical-power) · [LoRA (low-rank adaptation)](#/glossary/lora-low-rank-adaptation)

**The paper's own terms:**
- **paired risk difference (Δ)**: the candidate (new) model's expected loss minus the incumbent (deployed) one's; positive means a regression (§3).
- **disagreement rate (ρ)**: the share of inputs on which the two predictions differ, observable without labels (§3).
- **prediction-determined loss**: the loss depends on the input only through the prediction and label, so equal predictions give equal losses; it fails for losses that read model scores, e.g. calibration (§3, Assumption 1).
- **support identity**: the risk difference then comes only from disagreements and is at most the loss range times the disagreement rate (§3, Lemma 2).
- **Safe(ε), Regression**: verdicts that the difference is below a tolerance ε ("in the spirit of noninferiority testing": not worse by more than a margin), or above zero; a procedure is **(ε, δ)-sound** if with probability at least 1 − δ it never issues a false one (§3 "Verdicts").
- **routing rule, judge**: the probability, above a minimum, of labelling a disagreement, set from past data and the current input (including scores from "a learned judge model"), never its label; "The judge is used for efficiency, the guarantee never depends on its quality" (§4.2).
- **pairing-blind**: an auditor that never runs the model pair on unlabelled points (no **shadow-scoring**) and decides from its own past labels alone (Thm. 9; §4.2).
- **miscoverage, power**: the fraction of streams on which the 95% confidence sequence ever excluded the true difference; the fraction of injected regressions with a difference of at least 0.02 alarmed within 5,000 points (Tab. 2 caption).

**Missing glossary terms:**
- **confidence sequence (CS), anytime-valid**: intervals that contain the target at all times at once with probability at least 1 − δ, so the operator may watch continuously and stop at any time (§1, §3, §4).
- **Horvitz–Thompson estimator**: each labelled value is divided by the probability it was chosen with, keeping the estimate unbiased when that choice ignores the label (§4.2, Eq. 4; Lemma 3).
- **prediction-powered inference (PPI), active testing**: methods that use model outputs as a stand-in for labels (a **surrogate**), or adaptively chosen labels, to estimate one model's metric with fewer labels (§2 "Label-efficient evaluation"); **PPI++** adds a power-tuning weight (App. E).

**Builds on:**
- McNemar (1947) on discordant pairs; disagreement-based active learning (§2 "Paired comparison…", "Disagreement-based…").
- The empirical-Bernstein CS (its width adapts to the observed variance) of Waudby-Smith and Ramdas (2024) (§4; App. A).
- Sawade et al. (2012), comparing two models' risks with importance-weighted labelling; Feng et al. (2021), approving model modifications by online hypothesis testing (§2 "Model comparison and update approval").

## Problem and setting

- **Question:** Safe(ε) or Regression, from live traffic with few labels, sound at every stopping time (§1, §3).
- **Assumptions:** an i.i.d. stream, drift treated separately (§3; §5.7); bounded, prediction-determined losses (Assumption 1); free predictions, labels at unit cost (§3); routing never consults the incoming label (§4.2).
- **Data:** 715 update pairs of classifier heads on fixed features of pretrained models, in four modalities, with seven benign update types (true difference essentially zero) and four regressing ones (§6.1, Tab. 1); and 70 LoRA fine-tune pairs of Pythia language models, 160M–1.4B parameters, on SST-2 sentiment and AG News classification (§6.1). Held-out labelled data give each pair's true difference (§6.1).

## Approach

- **Tier 0** tracks a CS on the disagreement rate from unlabelled traffic and issues Safe(ε) once the loss range times its upper end is below ε (§4.1, Eq. 3).
- **Tier 1** labels disagreements with the routing probability and runs an empirical-Bernstein CS on Horvitz–Thompson increments: Safe(ε) when its upper end is below ε, Regression when its lower end is above zero (§4.2).
  - In the i.i.d. setting with Assumption 1, for any routing rule using only pre-label information, with a positive minimum, tiers with error budgets δ₀ and δ₁ both cover at all times with probability at least 1 − (δ₀ + δ₁): no false verdict at any stopping time (Thm. 4), even with an adversarial judge (Thm. 5).
  - If the loss range times the disagreement rate is at most ε/2, Tier 0 approves with zero labels after order range/ε unlabelled points, up to log factors (Prop. 6).
  - With constant routing and a difference at most ε/2, with probability at least 1 − 2δ₁ Tier 1 approves within order (range × disagreement rate / ε)² labels, up to log factors, plus a term that dominates when disagreement is small; Regression fires likewise for a difference of at least 2ε, with ε replaced by the difference (Thm. 7).
  - For loss range 1, ε at most one eighth and a disagreement rate between 2ε and one half, two distributions with that disagreement rate, identical unlabelled streams and differences zero and ε force any (ε, δ)-sound procedure that approves the first with probability at least 1 − δ to use, in expectation, at least order (disagreement rate / ε)² × log(1/δ) labels, however it routes or stops (Thm. 8).
  - There, a sound pairing-blind procedure needs at least order disagreement rate / ε² × log(1/δ), which uniform labelling attains up to log factors (Thm. 9); for disagreement rates of at least 2ε pairing saves a factor of order one over the disagreement rate (Cor. 10).
  - Per-slice verdicts are simultaneously sound (Prop. 12); over an adaptive sequence of updates audited on fresh traffic, with budgets summing to at most a total, no audit errs with probability at least one minus that total (Prop. 13).
  - For losses Lipschitz in the model's output for every label (change bounded by a constant times the output's change), the distance between outputs replaces disagreement in both tiers (Prop. 14).

## Results

- **Validity (§6.2, Tab. 2):** on the main battery's 4,290 i.i.d. and adversarially routed streams, miscoverage 0.0002 against nominal 5%, and power 0.986 within 5,000 points, with no false alarm; other campaigns also stay below nominal (Fig. 2). The author cautions that "our optimality claims are at the rate level" (§6.2).
- **Language-model pairs (Tab. 2):** miscoverage 0.0250 and 0.0167, power 0.923 and 0.917, for the 160M–410M and 1B–1.4B pairs, no false alarms (§6.2).
- **Ablations (§6.6):** routing "changed label spend only marginally relative to constant" routing, and the author treats its robustness "as a safety property", not a measured speedup.
- **Labels (§6.3):** at ε = 1%, 56% of the 1,672 benign certifiable audits finished with zero labels; the 163 benign audits above the Tier-0 regime took a median of 327 labels against 2,906 for uniform labelling with the same CS.
- **Baselines (§6.4, Tab. 3):** median labels to a sound verdict on benign pairs at ε = 1%, against the author's sequential adaptations: 0 for DISCERN against 1,476 (uniform), 2,232 (PPI-style, given a pairing-aware surrogate: zero on agreements, a judge score on disagreements) and 1,474 (active testing) for disagreement rates up to 1%, and 70 against 2,098, 2,845 and 1,948.5 above 1% up to 20% (DISCERN: verdicts on 28 of 29). No swept PPI or PPI++ setting, even with an oracle surrogate (exactly the true difference), beats uniform (App. E, Tab. 4–5).
- **Drift (§6.5, Fig. 6):** the unrestarted CS miscovers above nominal under two synthetic drift schedules, outside its guarantee (Tab. 2); restarting it on windows brings it near nominal, with residual excess under bursts.

## Limits the authors state

- Losses that consult scores are excluded from the hard identity; matching the lower bound for Lipschitz losses, and handling open-ended judged generation, "remain open" (§5.6; §8 "Losses through internals").
- Under drift the guarantee is a weighted-average statement, "the unrestarted CS can miscover a moving target by design", and choosing windows adaptively is "future work" (§8 "Drift").
- Language-model pairs stop at 1.4B parameters; "our zoo contains no DPO or RLHF update pairs" (preference-tuning methods: [DPO](#/glossary/direct-preference-optimization-dpo), [RLHF](#/glossary/reinforcement-learning-from-human-feedback-rlhf)) (§8 "Scale of the LLM zoo").
- The baselines are "constructed generously (both receive the pairing-aware surrogate for free) but still adaptations" (§8 "Baseline adaptations").
- Slices use a uniform budget split, optimal allocation "left open"; for promotion sequences, combining Feng et al.'s alpha-investing (growing the budget after good outcomes, §5.5) with per-audit label optimality "is open" (§8 "Allocation", "Sequences of promotions").
- The difference certifies average regression and slices cover known strata; unknown subpopulations are "a natural extension" (§8 "Estimand").
- The EU AI Act link is "motivation rather than a compliance claim" (§7).

## Open problems and building blocks

- **Open:** each is named with its limit above (§5.6; §8).
- **Released:** nothing yet: code, per-stream records and reproduction scripts "will be released publicly upon publication and are available to reviewers on request during review" (§6; App. F), plus the evidence-record emitter (§7); the internal financial-documents corpus is excluded (§6.1).
- **To reuse it:** "Nothing in the engine consumes anything beyond paired predictions and labels" (§8); both models run on audited traffic (§4.2), with a known loss range (§4.1). All but the LoRA fine-tunes (about three GPU-hours, one commodity GPU) replay on CPU (App. F).

## On this site

- **Tags:** <span class="tags"><a class="tag" href="#/tags/stats">stats</a><a class="tag sub" href="#/tags/general-misc">general-misc</a><a class="tag sub" href="#/tags/llm-misc">llm-misc</a></span>
