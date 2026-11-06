# What Does a Harness Repair? A Preregistered Study of Visibility, Baseline Adequacy and Evaluation Defects

**What Does a Harness…** · preprint 2026

Read: [PDF](https://arxiv.org/pdf/2610.05533) · [arXiv](https://arxiv.org/abs/2610.05533)

<p class="notice">A summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Two preregistered studies of where the gains of harness search come from, a search that keeps a change to the prompts, reasoning switches, token budgets or parsers around a frozen model if it raises a score: three models of 1.7B to 8B parameters (a longevity-tuned Qwen3-1.7B, SmolLM3-3B, Intern-S1-mini), then Qwen3-14B, on LongevityBench, MMLU-Pro and GSM8K pools with replication and test partitions, a GEPA arm in each study that searches prompt text only, and a descriptive comparison of the tuned and base Qwen3-1.7B (abstract; §1; §3.1; §3.6; Tab. 1).
- Four hypotheses with family-adjusted paired bootstrap intervals (§3.3, Tab. 2; §3.5): an exact split of a gain into rows only the new setting parses, rows both parse and rows only the old one parses (H1); non-inferiority of the benchmark authors' thinking-off protocol against a rescue configuration and four GEPA harnesses per study (H2); a serving-engine thinking budget (H3); and six evaluation defects from an earlier case study, such as the reference answer leaked into the prompt or unparsed answers scored as "A", injected one at a time to ask whether replication through the same pipeline reveals them (H4; §3.4).
- Harness-search gains that come from parsing, weak comparisons or broken evaluation rather than better answers (<a class="tag" href="#/tags/hacking">hacking</a>, <a class="tag" href="#/tags/stats">stats</a>): the authors report that turning thinking off beat capped thinking mostly on rows the capped setting left unreadable (§4.2), that no GEPA-selected harness was more accurate than thinking off for the tuned 1.7B model, while at 14B two were, by a wide margin, without being detectably above the strongest constant-label baseline (abstract; §4.3; narrowed in v2, which adds a 14B arm; v1 reported no harness more accurate), and that in 9 of 20 evaluable defect–model pairs, 7 of them fixed by an identity of the design, replication through the same pipeline reproduced the defect's distortion instead of revealing it (abstract; §4.5; Tab. 6). The results cover four models in the confirmatory design, three pools and six defects (§1; §6).

## In plain words

Harness search changes what surrounds a frozen model (prompts, token limits, the answer parser) and keeps a change if the score rises (abstract). The authors say a gain can come from answers the parser could not read before, a weak comparison, or an evaluation defect (abstract); in their earlier search, replication could not reveal a leaked reference answer, since every call carried it (§1 "Background"). Two studies with rules fixed in advance test three models of 1.7B to 8B parameters, then Qwen3-14B, with six defects injected one at a time (abstract; §1). Turning thinking off beat capped thinking in 7 of 12 model-benchmark cells, mostly on questions the capped setting left unreadable; at 14B, two searched prompts beat thinking off widely but were not detectably above always giving each task's best fixed answer (abstract). Replication through the same pipeline reproduced a defect's distortion in 9 of 20 evaluable cases, 7 of them fixed by the design's arithmetic (abstract). They "do not claim that harness gains can be illusory", but found no earlier study fixing such questions in advance (§1).

## Background and terms

**Terms to know:** [agent harness](#/glossary/agent-harness) · [reflective prompt optimization](#/glossary/reflective-prompt-optimization) · [bootstrap resampling](#/glossary/bootstrap-resampling) · [multiple testing](#/glossary/multiple-testing) · [statistical power](#/glossary/statistical-power) · [equivalence test (TOST)](#/glossary/equivalence-test-tost) · [greedy decoding and temperature sampling](#/glossary/greedy-decoding-and-temperature-sampling) · [pre-registration](#/glossary/pre-registration) · [noninferiority test](#/glossary/noninferiority-test)

**The paper's own terms:**
- **harness**: "everything around a frozen model that changes what it is scored on: the prompts, reasoning switches, token budgets, retry rules and parsers" (§1).
- **configurations** (Tab. 1): THINK-64/512/1536 (thinking on, that many tokens in all); AUTHORS-1500 (thinking off, "the benchmark authors' serving protocol"); BUDGET-512-1500 (the engine ends thinking after 512 tokens, then up to 1,500 answer tokens); RESCUE-1500 (THINK-512, or the AUTHORS-1500 call where THINK-512 hit the limit).
- **unparsed / truncated / non-committed** (§3.2): no readable answer / ended at the token limit / ended by itself and unparsed.
- **V/B/L split, statistic T, gain gate** (§3.2; Tab. 2): a gain of R over P splits exactly into rows only R parses (V), both parse (B) and only P parses (L). T is positive "when visibility supplies more than 0.8 of what the rows R parses contribute"; the gate tests T only if the gain's lower bound is above zero.
- **H1–H4, primary endpoints**: the four preregistered hypotheses and their confirmatory results, 47 in the first study and 18 in the second (§3.3).
- **star** (⋆; §4): an endpoint "whose quantity is fixed by an identity of the design or by the observed parse pattern".
- **constant label** (App. O): the strongest oracle constant, the best single answer per task chosen on the scored partition (an age band, Participant A, "Yes").
- **H4 terms** (§3.4): a defect's **distortion** of the reported quantity (start accuracy, or the gain over the start for D) on a selection sample S (replication partition) and a check sample R (test partition), and their difference Γ; a pair is **evaluable** if the defect could move S by more than 0.05. The defects: reference answer sent as an assistant turn (A); fallback gold labels (B1); unparsed scored as A (B2); a skewed split (C); a broken start (D); a tied output layer (E; tuned 1.7B model only).

**Builds on:**
- Chen et al. (2026), whose split is "our split under other names but without a predefined dominance threshold" (§2).
- GEPA ([GEPA](#/papers/agrawal2025gepa "GEPA: Reflective Prompt Evolution Can Outperform Reinforcement Learning (2026)")) as the search arm; budget forcing ([s1](#/papers/muennighoff2025simple "s1: Simple test-time scaling (2025)")) in H3: "the technique is not ours" (§2).
- After-the-fact studies where harness gains vanish against simple baselines: [Rethinking the Evaluation of…](#/papers/wang2026harnesseval "Rethinking the Evaluation of Harness Evolution for Agents (2026)"), Gideoni et al. (2026) and others (§1).

## Problem and setting

- **Questions** (§1; Tab. 2): better or merely readable answers (H1); is thinking off non-inferior to a rescue and to GEPA harnesses (H2); does the engine's thinking budget lower truncation (H3); does same-pipeline replication confirm a defect's distortion (H4). A fourth: "What a harness can repair depends on what the model already does without it" (§1).
- **Two studies** (§1; §3.6): the first tests Qwen3-1.7B-Longevity (Qwen3 tuned on aging-biology data), SmolLM3-3B and Intern-S1-mini; the second reuses its rules for Qwen3-14B and descriptively reruns the base and tuned Qwen3-1.7B on a second GPU.
- **Serving** (§3.1): vLLM 0.30.0 at zero temperature in batch-invariant mode (batching cannot change outputs), the first study on an RTX 5090, the second on an RTX PRO 6000, "with three exceptions".
- **Benchmarks** (§3.1): a LongevityBench letter pool of "LB-0030 (age band, five options), LB-0034 (which of two participants is older) and LB-0042 (ten-year survival)", LB-0038 (age regression) apart; MMLU-Pro ("a stratified subset of 2,000 items"); GSM8K (math word problems); split 40/20/40 into search, replication and test partitions.
- **Correctness** (§3.2; App. S): unparsed scores as wrong and "may hide a correct answer, a wrong one or none".
- **Statistics** (§3.5): paired percentile-bootstrap intervals, Bonferroni-adjusted within each hypothesis; margins 0.05.

## Approach

- **GEPA arms** (Tab. 1; App. J; App. L): four runs per study (clean start AUTHORS-1500 or broken start THINK-64), around the tuned 1.7B model and then Qwen3-14B, Intern-S1-mini proposing edits to the prompt text only.
- **H4** (§3.4; App. I): inject each defect into a pipeline starting from THINK-1536; the claim holds when the distortion lies beyond 0.05 on S and R with the same sign, and Γ within 0.05; "fails" is a descriptive label (§3.5).

## Results

On the test partition, they report:
- **Replication** (§4.1): no H1–H3 endpoint is labelled not replicated.
- **H1** (§4.2; Tab. 3): visibility dominates in 7 of 12 cells. Elsewhere the gain gate fails: the tuned 1.7B model already parses most rows, and on GSM8K thinking off loses accuracy for Intern-S1-mini and Qwen3-14B.
- **H2** (§4.3; Tab. 3): thinking off is non-inferior to the rescue in most cells, failing on GSM8K for SmolLM3-3B, Intern-S1-mini and Qwen3-14B. Around the tuned 1.7B model, GEPA repaired broken starts; no harness differed detectably from thinking off. At 14B both clean-start harnesses beat thinking off (θ = −0.337 and −0.342), while from the broken start "no proposal scored above zero".
- **Constant label** (§4.3; Tabs. 4–5; post hoc): the 14B's clean-start harnesses "are not detectably above the constant"; on the mortality task they answer "Yes" in 94.6% and 98.2% of parsed answers. In the first study only the tuned 1.7B model beat it on the letters (App. O).
- **H3** (§4.4): the engine's budget lowers truncation and raises parsing wherever THINK-512 truncates a large share; "H3 therefore supports the combined change and not forced termination alone".
- **H4** (§4.5; Tab. 6): the claim holds in 9 of 20 evaluable pairs, 7 starred (broken start, unparsed-as-A); the reference-answer pairs are inconclusive in all four models.
- **Checks** (§4.5; App. P): rules on a pipeline's records; detections are "largely true by construction"; on clean pipelines prompt-token reconciliation never fired, the input-reading rule IR4 always (§6).
- **Fine-tuning** (§4.6; Tab. 7; descriptive): tuned minus base Qwen3-1.7B is +0.414 on the letters, −0.164 on MMLU-Pro and −0.634 on GSM8K; it "does not show general domain knowledge".
- **Two GPUs** (§4.7; descriptive): the tuned 1.7B model's token IDs differ in 57.6% of test-grid calls, yet no rerun grid verdict changes.
- **Also** (§4.8; App. R): the 14B often ends calls unparsed; sensitivity analyses change few verdicts.

## Limits the authors state

- Defects "chosen from one line of work" (§6 "Limitations"); results cover these models, pools and defects "and nothing beyond them", and "We studied one round of selection and no recursive loop" (§1).
- Qwen3-14B is "a single larger model from the family of the tuned 1.7B model"; "the study cannot separate tuning from size" (§6).
- Most LongevityBench rows were called before; "the rows the case study had held out are excluded" (§6).
- Starred verdicts "say little beyond the mechanism"; for the skewed split "the intervals may be too wide or too narrow" (§6).
- "Power is mixed": H4 has no planned power, and an H2 endpoint expected to be inconclusive is not (§6).
- The GEPA arms searched prompt text only, with one proposer and four runs in each study, "so their results are about that space" (§6); "it says nothing about searching the thinking switch, the token limits or retry rules" (App. J).
- The 1.7B arms are descriptive: the models "differ in every weight and in training data" (§6); that the difference is not instance-level leakage rests on the model authors' data split, "which we take from their audit and do not verify" (§4.6).
- The extended scorer and the role-break rule were fixed after the pilot's parse audit (§6); H1's primary set changed twice before the freeze after pilot rates were seen (§3.5).
- "The study measures differences between configurations as served and not what the models know" (§6).
- "The batch-invariant server differs from the standard one call for call"; each study used one GPU type, and the second study's test runs used two physical GPUs (§6).
- Intervals "cover item sampling and not prompt or judge variance"; the family-wise error rate "is controlled approximately and is not guaranteed" (§6; §3.5).
- "The freeze guards the rules and not model-specific tuning", and the second plan postdates the first study's results (§6); freeze times are not independently timestamped (§ "Code and data availability").
- Zero temperature may turn thinking into repetition; truncation under sampling is untested for SmolLM3-3B and the 14B (§6).
- Deviations: a waived stopping rule, a label settled after seeing outputs, a GPU change, a rerun harness evaluation (§5).
- The outputs were not read, so why the 14B harnesses answer "Yes" "is not examined" (App. S).
- "We found no study that" means "none was found, not that none exists" (App. H); why a search repairs one defect and not another "is not tested here" (§2).
- The accuracies "do not support any use of these models for medical advice or clinical decisions" (§6 "Broader impact").

## Open problems and building blocks

- **Open:** "Whether early visibility gains turn into quality later in a loop, and whether a loop can leave a start like the one that GEPA could not repair at 14B, this study does not answer" (§6 "Self-improving loops").
- **Released:** as arXiv ancillary files, "the frozen preregistration of each study, the addenda file of each, and the aggregate analysis reports of both"; the repository "is not public at present" and a filtered export "is planned" (§ "Code and data availability").
- **To reuse it:** the cheap checks "can be run after every round" of a self-improving loop (§6); reporting truncated and non-committed answers apart and the two baselines "cost little" (§7). The first study ran within a 77 GPU-hour bound (App. G "Cost").

## On this site

- **Tags:** <span class="tags"><a class="tag" href="#/tags/hacking">hacking</a><a class="tag" href="#/tags/llm">llm</a><a class="tag" href="#/tags/math">math</a><a class="tag" href="#/tags/nl">nl</a><a class="tag" href="#/tags/scaling">scaling</a><a class="tag" href="#/tags/stats">stats</a><a class="tag" href="#/tags/study">study</a><a class="tag sub" href="#/tags/promptopt-evolve">promptopt-evolve</a></span>
