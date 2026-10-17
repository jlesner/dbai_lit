# Positional Failures in Long-Context LLMs: A Blind Spot in Reasoning Benchmarks

**Positional Failures in Long-Context LLMs** · (CRE), preprint 2026

Read: [PDF](https://arxiv.org/pdf/2605.23170) · [arXiv](https://arxiv.org/abs/2605.23170)

<p class="notice">A summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Audits 11 long-context benchmarks for whether they control where the task sits in a long input (App. F, Tab. 22), and the official sources of four recent flagship releases for whether position-controlled benchmarks appear in their main result tables (App. G, Tab. 23); then moves a GSM8K question from the end to the middle of an 8K, 32K or 64K-token context of filler of three kinds, for nine API models, with ARC-Challenge questions at 8K only (§3, §4.4, Tab. 3).
- 50 items per condition with Fisher exact tests under Bonferroni correction (Tab. 1, Tab. 3), probes that repeat the question in the middle or add a copy at the end (§4.2), and a count of wrong answers that equal a filler question's answer (§3.6, App. C).
- A.9, Tab. 16); they call the filler-matching errors only "consistent with" interference (§4.3).

## In plain words

Long-context LLMs claim long input windows, but the authors argue that mainstream long-context reasoning benchmarks rarely control where the task sits in the input, so failures that occur only at some positions go uncharacterized (§1). They audit 11 long-context benchmarks, finding none that jointly controls task position, filler content and input length for reasoning, and four recent flagship model releases, whose main result tables include none of the long-context benchmarks the audit tracks (abstract; §1). They then build CRE (Context Rot Evaluation), which places a math word problem or a science multiple-choice question (the science questions at the shortest length only) at the end or in the middle of 8K to 64K tokens of padding text, for nine models (§3). Models "can drop sharply" in the middle: Xiaomi's MiMo-v2-Flash answers 96% correctly with the question at the end but 8% in the middle, at 64K with worked math solutions as padding (abstract; Tab. 1). Four newer releases drop less with that padding, but with unanswered questions as padding their middle drops persist (abstract). The authors present the work as "a missing evaluation layer" (§2).

## Background and terms

**Terms to know:** [lost in the middle](#/glossary/lost-in-the-middle) · [Fisher's exact test](#/glossary/fishers-exact-test) · [Bonferroni correction](#/glossary/bonferroni-correction) · [confidence interval and coverage](#/glossary/confidence-interval-and-coverage) · [statistical power](#/glossary/statistical-power)

**The paper's own terms:**
- **CRE (Context Rot Evaluation)**: the framework, which varies task position, filler content and context length (8K, 32K or 64K tokens) as independent variables in a full factorial design (every combination of the three is run) (§3.1, §3.3, Fig. 1). The phrase "context rot" "has also appeared in industry write-ups (e.g., Chroma Research)" about retrieval; CRE addresses "a distinct, reasoning-side question" (§2). (Chroma's report is [Context Rot](#/papers/hong2025contextrot "Context Rot: How Increasing Input Tokens Impacts LLM Performance (2025)") on this site.)
- **target task** and **filler**: the GSM8K or ARC-Challenge question, and the text placed around it to reach a token budget (§3.1). Fillers (§3.2): **with_solutions (ws)**, GSM8K training problems with worked solutions (high overlap with the task); **questions_only_v2 (qo_v2)**, the same pool, questions only (intermediate overlap); **neutral_text**, unrelated Wikipedia and news prose (low overlap).
- **positions** (§3.1): **end** (the task immediately before the model's response), **middle** (filler on both sides), and two probes, **middle_twice** (the task twice in the middle, no copy at the end) and **middle_dup** (in the middle plus a copy at the end), also called the **duplicate-at-end probe** (§3.6).
- **drop**: middle-position accuracy minus end-position accuracy at the same length and filler, in percentage points (pp); more negative means more sensitive to position (§3.1).
- **initial set** and **four newer vendor releases** ("Round 2", Tab. 16): Qwen 2.5-7B-Instruct, MiMo-v2-Flash, GLM-4.7-FlashX, DeepSeek-V3.2 in reasoning mode ("DeepSeek-R" in tables) and Kimi k2.5; then DeepSeek-V4-Pro, MiMo-V2.5-Pro, Kimi-K2.6 and GLM-5.1, from the same providers (§3.5).
- **audit tiers** (App. F): Tier 1, position is a primary variable; Tier 2, configurable or partly analysed but secondary; Tier 3, uncontrolled.

**Builds on:**
- Liu et al. (2023) ([Lost in the Middle](#/papers/liu2023lostmiddle "Lost in the Middle: How Language Models Use Long Contexts (2024)")), multi-document question answering: "Position effects in long-context LLMs have been documented since" this work (§2).
- Needle-in-a-Haystack (Kamradt, 2023), which sweeps one fact's position through a long context, and RULER (Hsieh et al., 2024), a configurable synthetic suite of retrieval, variable-tracking and aggregation tasks: position-controlled retrieval benchmarks (§1, §2).
- Reasoning-side precedents: BABILong (Kuratov et al., 2024), reasoning over facts in long distractor text, "the closest earlier synthetic reasoning precedent", and LongReason (Ling et al., 2025), with the final question placed before or after the context; Buchmann et al. (2024), on six long-document attribution datasets, is "The closest precedent to our audit" (§2).
- GSM8K (Cobbe et al., 2021; [GSM8K and trained verifiers](#/papers/cobbe2021verifiers "Training Verifiers to Solve Math Word Problems (2021)")), grade-school math word problems, and ARC-Challenge (Clark et al., 2018), science multiple choice (§3.4).

## Problem and setting

- **Question:** whether reasoning failures depend on task position, filler and length together, which benchmarks that don't control position cannot show (§1).
- **Tasks:** GSM8K (free-form math) and ARC-Challenge (A/B/C/D), 50 instances per condition, seed 42 (§3.4, Fig. 1); ARC is "supplementary directional evidence rather than a strong generality claim" (§3.4).
- **Design:** three fillers by three tiers, each cell comparing end with middle; the probes are "evaluated at 8K only" (Fig. 1), plus a 64K middle_dup check on four initial models (§4.2, Tab. 7).
- **Models:** nine, through official APIs; the newer releases with vendor default reasoning settings, thinking on except for GLM-5.1 (§3.5). DeepSeek-V3.2 gets 60K of filler at the 64K tier, since its endpoint reserves up to 64K of its window for chain-of-thought output (§3.3). A pilot model, GLM-4-9B, was excluded on baseline quality (App. D).
- **Tests:** Fisher exact tests (two-sided, Tab. 1), Bonferroni-corrected at level 0.01 over 27 comparisons for GSM8K with ws filler (Tab. 1) and over 9 for ARC (Tab. 3).
- **What counts as correct:** how answers are extracted and scored, and the sampling temperature, are not discussed.

## Approach

- **Prompts:** each target question is embedded among filler at a set position within a set token budget (§3.1).
- **Diagnostics,** used "without claiming mechanism isolation": the filler answer matching scorer, which checks whether a wrong answer numerically matches any filler question's gold answer, and the duplicate-at-end probe, treated "strictly as a diagnostic consistency check" (§3.6). Robustness checks: a larger generation limit, and chain-of-thought restatements (how often the reasoning restates the task) (App. E).
- **Audits:** each of 11 benchmarks is placed in a tier by whether it treats task position as a first-class variable, a secondary factor or an uncontrolled property of the source (App. F, Tab. 22); 19 benchmarks in three groups (long-context positional, agent and coding, general capability) are checked in the four newer releases' official sources on 2026-05-10 (App. G.1, Tab. 23).

## Results

- **Benchmark audit (App. F, Tab. 22).** Tier 1: Needle-in-a-Haystack, RULER. Tier 2: BABILong, LongReason. Mixed: InfiniteBench (position-controlled retrieval subtasks beside uncontrolled natural-document ones). Tier 3: LongBench, SCROLLS, ZeroSCROLLS, L-Eval, LooGLE, 100-LongBench, suites of tasks over long natural documents. None jointly controls position, filler content and context length for reasoning (abstract).
- **Vendor audit (App. G.3, Tab. 23).** Seven long-context benchmarks appear in none of the four main result tables, a few only in base-model or proxy ablations (architecture tests on a smaller stand-in model), while agent and coding benchmarks (e.g. SWE-Bench, BrowseComp, Terminal-Bench: bug fixing, browsing, terminal tasks) appear in main tables across all four (abstract; §1).
- **Length makes it worse (§4.1, Tab. 1, ws filler).** MiMo-v2-Flash: 96% at the end against 8% in the middle at 64K, with smaller drops at 8K and 32K; GLM-4.7-FlashX follows the same pattern with smaller drops; Qwen is "already severely affected at 8K". DeepSeek-V3.2 shows no drop at any tier, Kimi k2.5 only small ones. End-position accuracy stays high, which the authors read as showing that middle drops "reflect positional effects rather than baseline capability loss or filler penalty" (§4.1).
- **Probes (§4.2, Tab. 2, Tab. 7).** At 8K, repeating the task in the middle gives "partial or no improvement"; a copy at the end brings all nine models to end-position accuracy "within sampling noise". At 64K only some of the four initial models tested reach it: the pattern "is context-length-dependent". The authors call the results "consistent with a positional explanation" (§4.2).
- **Filler (§4.3; App. A.6–A.8).** Question-only filler produces drops in all five initial models at 32K and 64K, including DeepSeek-V3.2, unaffected by ws filler. Neutral filler has near-zero effect at 8K, but Qwen drops under it at 32K and 64K too. Of the initial set's wrong middle-position answers under ws and qo_v2 filler, 76% match a filler question's gold answer, against 22% at the end, "consistent with filler-answer interference as a dominant error mode"; the end rate "largely reflects coincidental overlap among small integer answers" (§4.3; App. C).
- **ARC-Challenge (§4.4, Tab. 3).** At 8K with ws filler all nine models drop, by 6 to 40 points; only Qwen's drop is significant. With qo_v2 filler, the three initial models tested also lose ARC accuracy against no filler with the question at the end, which the authors interpret "as consistent with format confusion" with the filler's unanswered questions (App. A.5, Tab. 11).
- **Newer releases (§5.4, Tab. 1, Tab. 16).** With ws filler at 64K, three of the four stay within 6 points of end-position accuracy, and MiMo-V2.5-Pro drops 32 points against MiMo-v2-Flash's 88. With qo_v2 filler, middle drops persist in all four, from 16 to 56 points across the tiers, "comparable in magnitude" to the initial set's, with "no evident clustering" by reasoning configuration.
- **Considerations (§5.1):** the authors suggest reporting per-position accuracy and null findings, testing an interior position, disclosing the inference stack, and including probes.

## Limits the authors state

From § "Limitations", numbered as there:
- (1) 50 items per condition give a 95% interval of about ±14 points at 50% accuracy, "limiting power for small drops"; most 64K cells use one seed. (2) DeepSeek's qo_v2 result at 60K differs between two seeds, "leaving the precise 64K severity uncertain".
- (3) Five distinct API stacks confound cross-model magnitudes (e.g. tokenization, prompt preprocessing, sampling defaults); "directional conclusions are more reliable than precise rankings". (4) The 8K probe table is "not apples-to-apples", since each model gets its own worst-case filler (ws for Qwen, qo_v2 for the others). (5) DeepSeek-V3.2's 60K filler makes the 64K tier inconsistent across models.
- (6) On ARC only Qwen's drop is significant, "so ARC does not support a strong cross-domain generality claim". (7) The duplicate-at-end probe "is a diagnostic consistency check, not a mitigation": it changes recency, redundancy and salience at once and "should not be packaged as a practical fix". (8) Position sensitivity "may be describable in narrower terms as QA-like distractor interference" (QA: question answering; distractors: the filler's unanswered questions) when the filler is unanswered questions; the evidence "does not fully distinguish" the two.
- (9) Probe behaviour depends on length, and 64K probe data for the newer releases "was not collected". (10) Neutral filler "is not universally benign" (Qwen). (11) The growth of drops with length "does not extend universally": DeepSeek-V4-Pro under qo_v2 is not monotonic. (12) Newer releases do not narrow drops uniformly across tasks: MiMo-V2.5-Pro narrows the GSM8K 8K drop but worsens the ARC one. (13) Three newer releases use sparse attention (attention over only part of the earlier tokens), which may interact with the different behaviour under ws and qo_v2 filler "in ways our setup does not isolate".
- Elsewhere: "our setup does not distinguish whether persistence reflects filler-answer interference, reasoning-trace structure, or broader architectural factors" (§5.4); no-filler baselines were not measured for the newer releases (Tab. 3, Tab. 4); the vendor audit "reflects vendor disclosures as of this date" (App. G.1).

## Open problems and building blocks

- **Open:** None stated as future work; the unresolved mechanism is under Limits (7), (8) and (13).
- **Released:** nothing yet: "Upon acceptance we will release CRE, diagnostic conditions, and 11-benchmark audit" (§6).
- **To reuse it:** API access to the models (§3.5); the GSM8K training split as the ws and qo_v2 filler pool, and Wikipedia and news prose for neutral filler (§3.2); 50 instances per condition (§3.4).

## On this site

- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/general-misc">general-misc</a><a class="tag sub" href="#/tags/llm-misc">llm-misc</a></span>
