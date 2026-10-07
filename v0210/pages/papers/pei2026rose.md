# ROSE: An Intent-Centered Evaluation Metric for NL2SQL

**ROSE** · ACL 2026

Read: [PDF](https://arxiv.org/pdf/2604.12988) · [arXiv](https://arxiv.org/abs/2604.12988)  
Code: [ROSE](https://github.com/CedricPei/ROSE)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- An intent-centered NL2SQL metric meant to replace execution accuracy; an execution match still decides which LLM stage judges the prediction (§4).
- An LLM Prover judges the prediction against the question; an adversarial Refuter uses the gold SQL to challenge it.
- A prover–refuter design without a sound backend (borderline, kept: an LLM judge of text-to-SQL intent with no sound backend).

## In plain words

[Text-to-SQL](#/glossary/text-to-sql) systems are usually scored by [execution accuracy](#/glossary/execution-accuracy): a hit when the system's query and the benchmark's [gold query](#/glossary/gold-query) return the same result. The authors argue this misjudges correct queries written another way, valid answers to ambiguous questions, and wrong gold queries (§1). Their metric, ROSE, runs both queries, then uses one LLM in two roles. If the results differ, the first judges, without the gold query, whether the prediction answers the question, and the second uses the gold query as evidence against an acceptance; if they match, the second alone checks for a match by luck. It can also label the question ambiguous or the gold query wrong. On 585 outputs that two experts labelled alike, ROSE on OpenAI's o3 reaches 80.43% chance-corrected agreement with them, against 56.70% for the best earlier LLM judge on o3 and 25.56% for execution accuracy (§5). They present it as a new paradigm ("The paradigm pioneered by ROSE", §7).

## Background and terms

**Terms to know:** [text-to-SQL](#/glossary/text-to-sql) · [execution accuracy](#/glossary/execution-accuracy) · [gold query](#/glossary/gold-query) · [query equivalence](#/glossary/query-equivalence) · [Cohen's kappa](#/glossary/cohens-kappa) (κ; the paper's primary measure, as "robust under skewed distributions", §5.1.2; formula App. D)

**The paper's own terms:**
- **NL2SQL**: the paper's name for text-to-SQL; it calls the gold query the **ground-truth SQL** (§1).
- **EX**: execution accuracy, defined as the two results being equal as multisets, duplicates counted (App. A).
- **EM, ETM**: deterministic baselines. Exact Match, described as requiring the two queries to be identical after normalization (§3.1); Enhanced Tree Match, which compares the queries' normalized syntax trees (§3.1).
- **Intent-centered vs. reference-dependent**: judging whether the prediction answers the question, versus its closeness to one gold query (abstract).
- **Acceptance criteria**: user-specific rules on schema validity and fit to the question, e.g. tolerance for duplicates or NULL (§2.1).
- **SQL Prover, Adversarial Refuter**: the two LLM stages, run on one backbone model (§4.1–4.2, App. E.1); **ROSE w/o Refuter** is the Prover alone, an ablation (§5.1.3).
- **Coincidental correctness**: a prediction that returns the gold result on this database for the wrong reason (§4.2.1).
- **GoldX, AmbQ**: the Refuter's labels for a wrong gold query and an ambiguous question (§5.2.2).
- **ROSE-VEC**: the authors' "Validation dataset with Expert Consensus" (§1), with splits from the text-to-SQL benchmarks BIRD ([BIRD](#/papers/li2023bird "Can LLM Already Serve as A Database Interface? A BIg Bench for Large-Scale Database Grounded Text-to-SQLs (2023)")) and Spider ([Spider](#/papers/yu2018spider "Spider: A Large-Scale Human-Labeled Dataset for Complex and Cross-Domain Semantic Parsing and Text-to-SQL Task (2018)")) (App. J).
- **ROSE_o3-2504**: version tag, backbone plus release month (App. E.1).

**Missing glossary terms:**
- **Matthews correlation coefficient (MCC)**: a correlation between predicted and true yes/no labels using all four cells of the confusion matrix; reliable "when class sizes differ substantially" (§5.1.2; App. D).

**Builds on:**
- LLM-SQL-Solver ([LLM-SQL-Solver](#/papers/zhao2023llmsqlsolver "LLM-SQL-Solver: Can LLMs Determine SQL Equivalence? (2025)")), which prompts an LLM to decide whether the prediction is equivalent to the gold query (§3.2, Tab. 1).
- FLEX (Kim et al. 2025, not listed here), an LLM judge with full-context prompts, the closest competitor (§3.2, Tab. 1).
- EX, EM and ETM (ETM: Ascoli et al. 2024, not listed here), the deterministic baselines (§3.1).

## Problem and setting

- **Question:** can an LLM judge decide whether a prediction answers the question, using the gold query only as fallible evidence (§1, §3.2)?
- **Ideal judgment:** syntactic validity plus semantic correctness against the question under the acceptance criteria; the authors call a perfect semantic check "computationally infeasible" (§2.2).
- **What "correct" means:** the label two of five expert annotators, graduate students in NL2SQL research, agree on (§5.1.1, App. M). ROSE-VEC keeps only agreed items: 263 outputs of three systems on Spider Test and 322 of five on BIRD Dev (§5.1.1).
- **Models:** o3-2504, Gemini-2.5 Pro-2506, DeepSeek-R1-2505 (§5.1.4); three more open-source reasoning models in App. G.
- **Re-evaluation:** 19 methods on BIRD Mini-Dev, described as 500 pairs from 11 databases (§6.1.1): 14 prompting rows (five base LLMs used zero-shot, and multi-step pipelines such as Alpha-SQL and RSL-SQL) and 5 fine-tuned models such as OmniSQL (§6.1.2, Tab. 3; App. K describes the non-base ones).
- **SQL fragment, engine, semantics:** not discussed beyond EX's multiset comparison (App. A); NULLs and duplicates are handled by prompt rules (App. O).

## Approach

The cascade (§4.3, Fig. 1):
1. A query that does not execute scores 0. Otherwise both queries run on the database.
2. **Results differ:** the Prover sees the question, evidence hints, schema descriptions and the predicted query with its result, but not the gold query (§4.1, App. O.1). A rejection scores 0. An acceptance goes to the Refuter with both queries, both results and the Prover's rationale; it decides which query's logic fits the question better, so it may overturn, flag the gold query as wrong, or accept both readings of an ambiguous question (§4.2.2).
3. **Results match:** the Prover is skipped; the Refuter compares the two queries, without results, to catch coincidental correctness and wrong gold queries (§4.2.1).
4. The score is 1 only if the Refuter upholds (§4.3; formal definition App. B).

The Refuter's output also gives an ambiguity type and whether the gold query is correct (App. O.2); its flags are the GoldX and AmbQ labels (§5.2.2). The Prover is told to be "a lenient but principled, empathetic judge" (App. O.1), the Refuter to "Overturn only under strong facts; otherwise uphold" (App. O.2). They encode acceptance rules, e.g. DISTINCT and NULL exclusion for counts and percentages, and either tie-handling choice when unspecified (App. O.1–O.2). Each query takes one or two LLM calls (Tab. 11).

For leaderboards, one backbone per period is replaced only by a candidate better on all four validation measures (App. E.2).

## Results

- **Agreement with experts (Tab. 1)**: with o3, κ is 80.43 for ROSE, 60.74 for ROSE w/o Refuter, 56.70 for FLEX and 25.56 for EX. ROSE is best on κ, accuracy, MCC and F1 with each of the three backbones; the authors say the Prover alone "already surpasses" the earlier LLM judges (§5.2.1).
- **Diagnostics (Tab. 2):** checked by hand, o3's labels have precision 84.32% for GoldX and 91.23% for AmbQ; the authors call them "reliable enough for automated dataset analysis and cleaning" (§5.2.2).
- **Ablations (App. F, Tab. 7):** a single unified prompt and variants without the gold query are reported to fall behind the full cascade.
- **Other backbones (App. G, Tab. 6):** on ROSE-VEC-BIRD, ROSE beats FLEX on all four measures with three more open-source backbones.
- **Error analysis (App. I):** o3's 29 disagreements on ROSE-VEC-BIRD are 26 false negatives and 3 false positives; 15 penalize queries "logically fragile under plausible data variations", 11 come from strictness on units and format, 3 from interpretation or ambiguity.
  - Performance "relies largely on the capability of base models rather than engineering designs": methods group into tiers by base model, and several systems trail their base model, because the base-model runs used newer model versions than the systems' public results (§6.2.1, Fig. 2).
  - For prompting methods the ROSE − EX gap "was less than 5% with systems from mid-2023, but balloons to more than 20% with models projected for mid-2025" (§6.2.2, Fig. 3).
  - On GoldX items the metrics disagree over 80% of the time, on AmbQ around 60%, against "less than 20%" overall (§6.2.3, Tab. 4); the authors call the two "the dominant source of disagreements" (Fig. 4).
  - Prompting methods show larger gaps than fine-tuned ones at every difficulty level, which the authors attribute to fine-tuning teaching a dataset's style (§6.2.4, Fig. 5); CodeS and RESDSQL, fine-tuned StarCoder and T5 models (App. K.2), have negative gaps (App. L).

## Limits the authors state

- Reliability "may fluctuate as new models are released", with "a risk of drift across versions" (Limitations).
- Consensus filtering "may also introduce a selection bias", under-representing "borderline, disagreement-prone, or genuinely ambiguous cases", so reported agreement "may not fully reflect performance on the broader distribution of NL2SQL outputs" (Limitations).
- ROSE "remains more expensive than deterministic alternatives", and its latency "may limit the practicality" of rapid, iterative development (Limitations).
- ROSE "is generally conservative and more likely to under-credit than to over-credit" (App. I), and can be stricter on units and more literal than annotators (App. I.2–I.3).
- Diagnostic precision varies across backbones (§5.2.2); ambiguous-question detection is "challenging" on BIRD for two of the three backbones (App. J.2).
- Under Gemini-2.5 Pro on ROSE-VEC-BIRD, ROSE w/o Refuter has slightly higher F1 (App. J.1).

## Open problems and building blocks

  - "a key bottleneck": metrics "struggle to capture whether the predicted SQL is semantically correct with respect to the user's intent" (§1).
  - Future evaluations should "decouple system design from model updates" (§6.2.1).
  - Clearer, correct benchmarks (§6.2.3); intent-centered metrics and dataset quality as priorities (§7).
  - Base-model dominance "calls for a re-evaluation of what constitutes a novel algorithmic contribution" (§7).
- **Released:** ROSE and ROSE-VEC (abstract footnote, §1, §7). §5.1.1 calls ROSE-VEC and the annotation interface "valuable resources for follow-up studies".
- **To reuse it:** a reasoning-model backbone, the database, a gold query and the prompt inputs of App. O. On ROSE-VEC-BIRD with o3: 22.48 s per question on one thread, 3.35 s with eight (Tab. 9); USD 2.249 for 322 items against 3.819 for FLEX (Tab. 10).
- **Beyond its domain:** possibly "other complex tasks where success should be defined by fulfilling user intent rather than matching a single, potentially flawed ground-truth solution" (§7).

## On this site

- **Discussed in:** [Text-to-SQL can't be verified against intent](#/challenges/text_to_sql_verification)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/judge-sql">judge-sql</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/nl2sql-eval">nl2sql-eval</a></span>
