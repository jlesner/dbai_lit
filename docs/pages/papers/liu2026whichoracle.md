# Certified Against Which Oracle? Execution Labels Set the Reported Risk of Conformal Abstention for Text-to-SQL

**Certified Against Which Oracle?** · preprint 2026

Read: [PDF](https://arxiv.org/pdf/2609.25938) · [arXiv](https://arxiv.org/abs/2609.25938)  
Code: [text-to-sql-oracle-certificates](https://github.com/yahiko-l/text-to-sql-oracle-certificates)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- A preregistered intervention on a conformal abstention certificate for text-to-SQL (self-consistency over execution-equivalence classes, split-half conformal risk control): the clusters and the calibration labels come either from the benchmark's shipped database or from the distilled test suite of [Semantic Evaluation for Text-to-SQL…](#/papers/zhong2020testsuite "Semantic Evaluation for Text-to-SQL with Distilled Test Suites (2020)") (§1; §3.1–3.3), on Spider-Realistic with SQL-specialist checkpoints (§3.4).
- Audits both oracles from outside: a two-pass AI census (Codex running gpt-5.6-sol) of every answer the suite rejects, and preregistered blinded audits by SQL experts (§3.6; §5; §7; App. G–H).
- Execution labels as an imperfect checker in both directions: it reports that, judged by the suite, the current-practice certificate (calibrated on the shipped database) carries 2.73 to 10.23 points more held-out risk than its own labels report (abstract; §3.3; §4.1, Tab. 2), while the experts find the suite both rejecting answers they do not judge wrong and accepting answers they do (§7.1); it cites [SpotIt](#/papers/klopfenstein2025spotit "SpotIt: Evaluating Text-to-SQL Evaluation with Formal Verification (2026)") and [SynSQL](#/papers/habibollah2026synsql "SynSQL: Synthesizing Relational Databases for Robust Evaluation of Text-to-SQL Systems (2026)") on single-database leniency (§1).

## In plain words

A text-to-SQL system can decline uncertain questions, and a statistical method, conformal risk control, picks that cut-off so the share of all questions answered wrongly is promised to stay below a set level. The promise is only as good as the labels saying which answers are wrong; the uncertainty pipelines that read confidence off execution consistency take them from the one database a benchmark ships, a check "known to be lenient" (abstract; §1). In a preregistered experiment on the Spider-Realistic benchmark, the authors swap that database for the benchmark's stricter multi-database test suite: across four SQL-specialist models and two ways of splitting the data, judged by the suite, a guarantee set at 0.10 carries 2.73 to 10.23 points more held-out risk than its own labels report (abstract; §4.1). An AI audit and blinded SQL experts judge the answers: the stricter check errs in both directions, and under the experts' labels the guarantee carries 20.0 and 17.2 points of risk on two models, which neither check reports (abstract; §7.1). They present a measurement study ending in reporting rules (§9).

## Background and terms

**Terms to know:** [text-to-SQL](#/glossary/text-to-sql) · [gold query](#/glossary/gold-query) · [execution accuracy](#/glossary/execution-accuracy) · [test-suite accuracy](#/glossary/test-suite-accuracy) · [test oracle](#/glossary/test-oracle) · [self-consistency (majority voting)](#/glossary/self-consistency-majority-voting) · [AUROC](#/glossary/auroc) · [Cohen's kappa](#/glossary/cohens-kappa)

**The paper's own terms:**
- **oracle**: "the databases a query is executed on" (Fig. 2 caption), which labels answers and builds the classes. The **weak oracle** is the one database the benchmark ships per schema; the **suite oracle** is the distilled test suite of Zhong et al. [55] (§3.2). "Reference query" means the gold query.
- **conformal abstention certificate**: the threshold rule and its promise that the chance of returning a wrong answer, abstentions counting as zero loss, is at most a nominal level α on questions drawn like the calibration ones (§1).
- **execution-equivalence classes**: groups of sampled candidates whose results the official comparator judges equal on every instance of an oracle; **top-class mass**, the share of usable candidates in the largest class, is the confidence score, "the self-consistency score of Wang et al. [49] on execution classes" (§3.1).
- **held-out empirical marginal risk**: the share of all held-out questions answered wrongly; **selective risk**, the share wrong among answered ones, is not what the certificate controls (§3.1).
- **cells A–D**: the class partition and the calibration labels each come from the weak or the suite oracle; cell A (weak for both) "is current practice", cell D is fully multi-instance. **GAP** is cell A's suite-oracle risk minus the risk its own labels report; **D minus A** is cell D's suite-oracle risk minus cell A's (§3.3).
- **question / database splits**: calibrating on half the questions, where the guarantee applies, or on 9 of 19 schemas, a stress test (§3.1).
- **disagreement census / full census**: AI labels for every cell-A answer the shipped database accepts and the suite rejects, and for every cell-A or cell-D answer the suite rejects (§5.1). Labels: semantic error, underspecified question, suspected reference-query defect, synthetic-instance defect (the queries differ only on values a real database would not contain), comparator artefact ("same information, judged unequal") (§3.6).

**Missing glossary terms:**
- **conformal risk control**: picks a threshold on a calibration set "so that the expected value of a bounded, monotone loss is at most a nominal level α on exchangeable test data" (§1); here the loss is 1 for a wrong answer and 0 otherwise, and exchangeable means drawn like the calibration data.
- **preregistration**: freezing data, models, endpoint and decision rule before the data is generated (§3.5; Tab. A1).

**Builds on:**
- Zhong et al. [55] ([Semantic Evaluation for Text-to-SQL…](#/papers/zhong2020testsuite "Semantic Evaluation for Text-to-SQL with Distilled Test Suites (2020)")): the suite oracle (§3.2) and the official comparator (§3.1).
- Conformal risk control of Angelopoulos et al. [5] (not listed here) over the self-consistency score of Wang et al. [49] ([Self-Consistency](#/papers/wang2022selfconsistency "Self-Consistency Improves Chain of Thought Reasoning in Language Models (2023)")), "deliberately the simplest member of this family" (§2; §3.1).
- The text-to-SQL uncertainty pipelines it calls current practice, which judge on one database per schema [10, 34, 42] (§1; §2).
- Klopfenstein et al. [22] (SpotIt, a verifier; [SpotIt](#/papers/klopfenstein2025spotit "SpotIt: Evaluating Text-to-SQL Evaluation with Formal Verification (2026)")) and Habibollah and Rafiei [18] ([SynSQL](#/papers/habibollah2026synsql "SynSQL: Synthesizing Relational Databases for Robust Evaluation of Text-to-SQL Systems (2026)")) on lenient execution (§1); SpotIt and Pourreza and Rafiei [39] ([Evaluating Cross-Domain Text-to-SQL Models…](#/papers/pourreza2023evaluating "Evaluating Cross-Domain Text-to-SQL Models and Benchmarks (2023)")) on wrong reference queries, carried "to the layer that certifies a system's uncertainty" (§8).

## Problem and setting

- **Questions** (§1): what the lenient oracle costs at the certificate layer; whether the stricter oracle's rejections are semantic errors, that is, whether execution labels measure whether the question was answered; and whether, judged by the oracle that built its classes, a score that predicts correctness better can be told from one that merely agrees with that oracle.
- **Setting:** all 508 questions of Spider-Realistic, "the paraphrased subset of Spider dev" (Spider: cross-domain text-to-SQL, [Spider](#/papers/yu2018spider "Spider: A Large-Scale Human-Labeled Dataset for Complex and Cross-Domain Semantic Parsing and Text-to-SQL Task (2018)")), 19 schemas, 651 distilled suite instances (§3.2; §3.4); four checkpoints from two Qwen lineages (Kwai-AutoSQL-32B and -14B, XiYanSQL-QwenCoder-32B-2504, OmniSQL-32B), three seeds, 50 samples per question (§3.4, Tab. 1); α = 0.10.
- **Correctness:** a class's representative agrees with the reference query on every instance of the oracle, compared on SQLite by the official test-suite comparator (§3.1; App. F). NULLs are not discussed.
- **Estimand:** "descriptive"; the shares of 200 overlapping splits showing a sign "are not confidence levels" (§3.3).

## Approach

- **System** (§3.1, Fig. 2): partition the candidates into classes, answer with the largest class, score by its mass, and pick the threshold by split-half conformal risk control.
- **Intervention** (§3.3, §3.5): the four cells; the third preregistration froze the panel, rules and an outcome table. Other analyses, except the expert audits' preregistered ones, are post hoc.
- **Five more scores** (post hoc, §4.4): discrete semantic entropy, the degree measure (sum of squared class shares) and the set count (minus the number of classes), and two length-normalised log-probability scores that read no oracle.
- **AI census** (§3.6): an AI reviewer, "Codex running gpt-5.6-sol", labels each re-executed rejection in two independent passes; a third thread adjudicates.
- **Relabelling ladder** (§6): four nested conventions (wide, narrow, agreed, unanimous) decide which rejected answers count as wrong; accepted answers stay accepted.
- **Expert audits:** of reference queries (App. G), and of every distinct answer of two checkpoints at one seed, blind to the oracles (§7; App. H), each under a rule fixed in advance.

## Results

- **Preregistered** (§4.1, Tab. 2): GAP is positive for every checkpoint, seed and split scheme, its three-seed means 2.73 to 10.23 points; D minus A is negative everywhere but misses the preregistered three-point bar (§3.5) on XiYan-32B. Outcome O2: "the measurement claim holds across the two lineages; the contrast claim does not constitute a cross-lineage result."
- **Post-hoc checks:** the understatement "is not a property of one nominal level" (§4.2); at a common risk ceiling, "rebuilding the equivalence classes with the suite is what moves the frontier" of answer rates, within this setting (§4.3); all six scores understate, including the two that read no oracle (§4.4, Fig. 3); robustness checks "bound the ways the measurement could be an artefact" (§4.5).
- **AI census** (§5): a semantic error in "a quarter to a third" of rejected answers, depending on the population (abstract); most of the rest is labelled underspecified questions, synthetic-instance defects or suspected reference-query defects, whose recurring families include case-sensitive literals, numeric ordering on text columns and joins without a join condition (§5.4).
- **Expert test of the defect flag** (§5.4; App. G, Tab. A9): 54.8% of flagged questions judged defective against 20.0% of an examined control; the preregistered rule returns supported.
- **Relabelling** (post hoc, AI labels, §6): relabelling rejected answers with the full census reverses GAP's sign for every checkpoint, but a relabelling that only clears rejected answers "can only lower the audited risk" (§6.1); D minus A shrinks but stays negative (§6.2), and cell D lowers risk "by answering different questions rather than by returning different SQL" (§6.3).
- **Expert-judged risk** (post hoc, §7.1, Tab. A11): the 20.0 and 17.2 points on XiYan-32B and Kwai-32B (question splits, seed 101); the shipped database understates both, the suite understates the first and overstates the second; GAP stays positive under every convention.
- **Oracle alignment** (post hoc, §7.2, Fig. 4): each consistency score looks better under its own oracle's labels in 16 of 16 score-by-checkpoint combinations; likelihood scores never reverse.
- **Independent yardstick** (preregistered, §7.3, Tab. A10): on questions where both cells return the same SQL and both experts agree, the suite-built score leads by 6.96 AUROC points on Kwai-32B (p = 0.004) and 1.53 on XiYan-32B (p = 0.275), whose interval, −1.2 to 4.3, excludes the 8.3 the suite labels report; the rule returns mixed.
- **Recommendations** (§8.1; §9): report a certificate with the oracle that calibrated it and the one that evaluated it; read an oracle-relative difference as semantic risk only after auditing the benchmark; where an independent oracle exists, evaluate a consistency score under an oracle that did not build its clusters.

## Limits the authors state

- The flagged questions are those four checkpoints exposed, "rather than a sample"; the sign is identified on two checkpoints at one seed only (§8.2 "What the evidence is relative to").
- Experts tested only the reference-defect label, at the question level; the others "remain AI-only". The reference-audit experts share a laboratory with the authors and knew the hypothesis; the taxonomy came after inspecting the census (§8.2 "Labels").
- One benchmark family on SQLite, one suite, two Qwen lineages; "other vendors and benchmark families are untested" (§8.2 "Generality").
- Endpoint and benchmark were chosen during exploratory development with XiYan-32B (§8.2 "Registration"; App. A).
- Database splits give no guarantee for unseen schemas (§3.1); neither audited outcome "identifies a mechanism" (§7.3).

## Open problems and building blocks

- **Open:** auditing the accepted side on the rest of the panel; comparing cells A and D at equal answer rate under expert labels; replication across vendors, and across benchmark families "once another benchmark ships a multi-instance oracle of comparable quality" (§8.3). Why scores align: "a substantive explanation remains open" (§7.2).
- **Released:** the study's code; its data is "not public" (App. F).
- **To reuse it:** vLLM on H100 GPUs for sampling, then CPU only with SQLite 3.45, the official comparator and NumPy (App. F).

## On this site

- **Tags:** <span class="tags"><a class="tag" href="#/tags/labels">labels</a><a class="tag sub" href="#/tags/llm-gen">llm-gen</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/nl2sql-data">nl2sql-data</a><a class="tag sub" href="#/tags/nl2sql-eval">nl2sql-eval</a><a class="tag sub" href="#/tags/nl2sql-select">nl2sql-select</a><a class="tag sub" href="#/tags/scaling-sql">scaling-sql</a></span>
