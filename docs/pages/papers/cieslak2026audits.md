# Better Policies, Worse Verifier Audits

**Better Policies, Worse Verifier Audits** · preprint 2026

Read: [PDF](https://arxiv.org/pdf/2610.29029) · [arXiv](https://arxiv.org/abs/2610.29029)

<p class="notice">A summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Shows that scoring a component verifier on fresh policy outputs against the full success label can stop measuring that component as the policy masters it ("on-policy audit collapse"), can prefer a worse verifier, and, when used to trigger a refresh, can make the verifier worse (abstract; §1).
- Splits AUC exactly over failure types to derive a sharp identified set, a complete-erasure threshold, an inversion threshold and upper and lower label budgets that the authors say match up to constants (§4, §6; Props. 1–3; only for δ bounded away from ¼), then tests them on an engine-design task with an exact oracle, GSM8K, GoEmotions and a prediction-registered ECG refresh study (§3–§5).
- A checker audited on the outputs of the policy it shapes can look worse only because the policy improved: it reports that an exact component oracle's on-policy AUC falls from 0.833 to 0.515 on the engine task (§4); its repair audits the component on its own failures and keeps those failures in the refresh data (§6).

## In plain words

Training and test-time search increasingly use verifiers built from parts, one per requirement (§1). A natural loop scores one part on fresh outputs of the current policy (the model being trained) against the full success label, and refreshes (retrains) it when that score drops. The authors show that this loop "can become systematically wrong because the policy improved" (§1): as the policy masters the part's requirement, the remaining failures can be mostly failures of other requirements, so the score measures less of the part's job. They prove when the score alone can hold no information about the part, when it can prefer a worse verifier, and how many labels a direct audit needs (§4, §6). On an engine-design task, a perfect checker's score falls from 0.833 to 0.515 as the policy is trained (§4). In a prediction-registered study on generated heart-signal (ECG) pipelines, refreshing with full success labels made the verifier worse on base-policy outputs in all 40 paired evaluations, which the authors call sign robustness, not independent replications, and raised constraint violations downstream (§5). They present the combination as new, not its statistical ingredients (§8).

## Background and terms

**Terms to know:** [AUROC](#/glossary/auroc) (the paper writes "AUC"), [identifiability](#/glossary/identifiability), [direct preference optimization (DPO)](#/glossary/direct-preference-optimization-dpo), [best-of-N sampling](#/glossary/best-of-n-sampling) (the paper's best-of-K), [pre-registration](#/glossary/pre-registration) (the ECG training study's plan was hashed in the authors' repository, "not deposited with an external registry", App. Z). · [sharp identified set](#/glossary/partial-identification-sharp-identified-set) (for a checker's own-failure quality, Prop. 1, App. P)

**The paper's own terms:**
- **Conjunctive target**: success y needs two conditions, F and M (§1). A verifier "head" scores F: feasibility on the engine task, the boxed answer format on GSM8K (Tab. 1), a hard deployment constraint on ECG (§5).
- **On-policy audit, monitor**: the head's AUC against y on fresh outputs of the current policy, per candidate pool (the samples drawn for one prompt) (§1, §4).
- **Failure mixture q**: among failed outputs, the share that already satisfy F and fail only M (Eq. 1).
- **A_own, A_cross**: how well the head ranks successes above outputs that fail F (own-failure separability), and above outputs that satisfy F but fail M. In each pool the audit equals (1 − q)·A_own + q·A_cross (Eq. 3).
- **Canonical F-AUC**: the head's AUC for F itself, which "need not agree" with A_own (§2, Eq. 2); **off-policy F-AUC** measures it on the base policy's outputs (§5, Tab. 3).
- **Complete erasure, audit inversion**: the audit value fits every possible A_own (Eq. 5); the audit prefers a head with worse A_own (Prop. 2).
- **Refresh R_y, R_F, R_mix**: further training of the deployed head on post-training outputs with outcome labels, with F labels, or with F labels plus an equal number of re-injected base-policy outputs (§5, App. AD.2).
- **Answer@K**: how often the output a selector picks from K samples succeeds (§2; App. AC).

**Bridges to the glossary:** in the glossary's terms, what the paper calls "off-policy forgetting" (§5) is a form of [catastrophic forgetting](#/glossary/catastrophic-forgetting) (ours).

**Builds on:**
- Classical statistics it does "not claim … as new": ROC case mix (how the mix of cases shifts ROC curves) (Sadatsafavi et al., 2022), partial identification (Manski, 2003), finite-mixture identification (Henry et al., 2014) (§8).
- Rubric RL (RL whose reward aggregates per-criterion rubric scores) (Gunjal et al., 2026; Tyagi et al., 2026), used "only to establish interface relevance" (§7); reward models refined on policy data (Sun et al., 2025) and adjacent loop failures (Wei et al., 2026; Lin, 2026) (§8).

## Problem and setting

- **Question:** once a policy learns F, does the on-policy audit still measure F's verifier, and what does a refresh acting on it do (§1)?
- **Scope:** the claim needs a head meant for F, an on-policy audit against the full outcome, and use of that audit to compare, early-stop or trigger refreshes; a direct audit with trusted F labels avoids the collapse (§1).
- **Theory assumptions:** results are per pool; the designed audit needs bin-conditional score distributions (score distributions within each failure cause) held fixed (§6; App. S).
- **Domains (§2):** the engine task, where DPO-trained Qwen2.5-1.5B and 7B policies (App. G) propose printable engine-body designs that a solver checks for feasibility and mass, scored by a learned critic (App. A); GSM8K (grade-school math); GoEmotions (Reddit comments with human emotion labels) and a constructed AG News (news-topic) control (App. AD.6–AD.7); and ECG, where Llama-3.2-3B, Gemma-3-4B and Phi-4-mini write signal-processing pipelines checked on MIT-BIH recordings (a public heart-recording database), with subject-held-out splits, MLP and gradient-boosted-tree heads, and a best-of-16 gate (picks the top-utility output the head calls feasible) (§5; App. Z).

## Approach

- **The identity (Eq. 3):** every failure fails F or fails only M, so the audit splits exactly into the two terms. An exact F-oracle's audit is therefore 1 − q/2 (§4).
- **Prop. 1 (§4):** given only the aggregate AUC and the failure-bin weights (shares of failures by cause), any per-bin AUCs whose weighted mean equals the aggregate are compatible (a sharp set). For two bins, unless every failure satisfies F, A_own lies in an explicit interval (Eq. 4) that covers every possible value exactly when q is at least the larger of the AUC and one minus it (Eq. 5). With bin-conditional score distributions held fixed and AUC measured under known mixtures, the bin values are pinned down iff the mixture matrix has full rank.
- **Prop. 2 (§4.1):** in one pool, if head f ranks own failures better and head g ranks F-satisfying failures better, the audit prefers g iff q exceeds a threshold q* set by the two gaps (at every positive q when the own gap is zero). Among all scores of an output, the audit is maximized by any strictly increasing transform of the probability of full success; when F is computable from the output, that predictor weakly beats the exact F-oracle at every q, strictly unless it is constant on F-satisfying outputs (App. AD.1).
- **Refresh hazards (§5):** outcome labels pull the head toward that predictor; a saturated policy may leave almost no own failures to learn F from, even with correct labels.
- **Repair (§6):** condition on failure bins, bound A_cross from outside knowledge (Eq. 6), or build controlled failure mixtures; an "audit card" lists five steps, including never using the aggregate audit alone to select, early-stop or refresh a head.
- **Prop. 3 (§6):** labelling random failures, the labels needed grow in inverse proportion to the own-failure share, with matching upper and lower bounds up to constants (the lower bound for tolerance ε ≤ ¼ and failure probability δ < ¼); a designed audit at two known, distinct mixture weights has an error bound that does not depend on the deployed policy's q (proofs: App. AA.1).

## Results

- **The paradox (§3, Tab. 1):** after DPO, success per draw rises 3.6× (engine) and 2.1× (GSM8K) while the component head's audit falls from 0.80 to 0.51 and from 0.92 to 0.51.
- **Exact oracle (§4):** its audit falls from 0.833 to 0.515 (engine) and from 0.922 to 0.519 (GSM8K), so the collapse "cannot, by itself, identify component degradation" (§3).
- **Inversion (§4.1):** on matched 1.5B sum-DPO engine pools, the audit ranks the exact oracle below an imperfect learned head; on GSM8K no crossing exists.
- **GoEmotions (§5, post hoc):** for the annoyance/gratitude pair at its natural q, the component specialist (a head trained for F alone) has canonical F-AUC .679 but audit .442, while a deliberately entangled score has F-AUC .570 yet audit .681. With correct labels and few own failures left, adding targeted own failures recovers more F-AUC than adding as many random examples.
- **ECG refresh (§5, Tab. 3):** the pure F head gets the lowest audit among label-mixture heads (trained on blends of F and outcome labels) in all four settings (P1). R_y lowers off-policy F-AUC in all 40 paired evaluations, also on an unseen generator, raises gate violations by +0.011 to +0.055 above the unavoidable floor (pools with no feasible output) and lowers Answer@16 by 0.02–0.06. Registered prediction P2, that refresh would repair Phi's monitor, failed; the others held (App. AD.4). R_F still loses F-AUC in the Llama gradient-boosted-tree setting; R_mix keeps the deployed head's F-AUC and gate metrics.
- **Closed loop (§5; App. AD.5, post hoc):** refreshing with R_y when the audit falls by at least .05 moves mean F-AUC/violation/Answer@16 from 1.000/.148/.530 to .719/.179/.491; a reference-distribution F trigger (watching F-AUC on base-policy outputs) fires in none.
- **Negative results:** the preregistered ECG training test is "negative for our criterion" for choosing DPO pair weights (the score weight that ranks samples into preference pairs) (App. AF, Tab. 40); three label-free statistics do not transfer from engine to GSM8K (App. T).

## Limits the authors state

- "The AUC symptom does not identify its cause"; this is "not a claim that in-bounds exploitation is absent" (critic exploitation by designs inside the allowed box) (§7).
- Prop. 2's engine and GSM8K checks "reuse published quantities and are post-hoc" (§7).
- GoEmotions is post hoc "with a small bag-of-words verifier" and AG News "a more constructed control"; together they do not show "that our refresh effect has been measured with an LLM-scale semantic verifier" (§7).
- The ECG refresh study "is CPU-only and uses one benchmark whose component is a deterministic resource constraint, two head classes and ten subject splits"; no LLM-scale verifier was refreshed and online RL with a refreshed verifier was not studied (§7). The subject splits are "robustness resamples" (§5).
- Engine and GSM8K policies are Qwen2.5, "the strongest training result is offline DPO with three seeds", and "ECG training is informative in one family" (§7).
- "The audit requires trusted component labels (proxy bins change the estimand)" (failure causes inferred by a proxy measure something else); the engine oracle is simplified; ECG is "not a clinical validation" (§7).
- The claim is "about this specific but natural interface, not about every verifier evaluation protocol" (§1).
- On stored arms the transfer forecast does "not show incremental predictive value from source-bin terms beyond q alone" (App. S).
- The supplement supports reruns of the public-data controls "but not an end-to-end regeneration of every large system experiment" (Reproducibility statement).

## Open problems and building blocks

- **Open:** for a label-free diagnostic, "a learned combination, per-requirement rather than per-arm targets, or a calibrated head might do better" (App. T); whether "gate-referenced contrast matching would succeed outside the near-identical-pair regime" (a weight picked to mimic the gate's pairs; shown only for near-copies) is not established (App. Z).
- **Released:** a supplement with "the exact anonymous source snapshot", the GoEmotions and AG News scripts with frozen JSON summaries, and the controller threshold analysis; the large engine, ECG and GSM8K pools and checkpoints "are not bundled" (Reproducibility statement). App. E says the engine benchmark "is released with the paper".
- **To reuse it:** trusted component labels (§7). Original runs used single A100-80GB nodes (added 7B jobs also H100), about 2.5 h per DPO seed at 1.5B; the analyses ran on CPU (App. K).

## On this site

- **Tags:** <span class="tags"><a class="tag" href="#/tags/code">code</a><a class="tag" href="#/tags/hacking">hacking</a><a class="tag" href="#/tags/judge">judge</a><a class="tag" href="#/tags/llm">llm</a><a class="tag" href="#/tags/math">math</a><a class="tag" href="#/tags/method">method</a><a class="tag" href="#/tags/scaling">scaling</a><a class="tag" href="#/tags/stats">stats</a><a class="tag" href="#/tags/study">study</a></span>
