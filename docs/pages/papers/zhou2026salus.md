# SALUS: Automated Auditing of NL-to-SQL Benchmarks through Weak Supervision of Multi-Agent Output

**SALUS** · SIGMOD 2027 (PACMMOD 4(6)) · 2026

Read: [PDF](https://arxiv.org/pdf/2610.05540) · [arXiv](https://arxiv.org/abs/2610.05540) · [DOI](https://doi.org/10.1145/3856369)  
Code: [SALUS](https://github.com/ucisharadlab/SALUS)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Flags wrong gold SQL in a text-to-SQL benchmark without human labels: four LLM agents (in the primary configuration GPT-5, GPT-4o, Claude Opus 4.6 and Gemini 2.5 Pro; §5.1) each write one query per task; 44 labeling functions over execution results, ASTs and question cues vote on the gold query; a Snorkel label model turns the votes into weak labels, and per-agent reliability models over 12 features of the gold SQL weight each agent's verdict (abstract; §3; §5.1, Tab. 3).
- Evaluated on BIRD-Clean-xs, 298 BIRD development tasks labelled by hand (the union of a 200-task random sample and 109 errors found from BIRD's November 2025 revision; §4.1), against single agents, majority vote, SQLDriller ([SQLDriller](#/papers/yang2025sqldriller "Automated Validating and Fixing of Text-to-SQL Translation with Execution Consistency (2025)")) and SAR-Agent ([Pervasive Annotation Errors Break…](#/papers/jin2026annotation "Pervasive Annotation Errors Break Text-to-SQL Benchmarks and Leaderboards (2026)")) (§5.1.1; §5.3, Tab. 8); the calibration of its benchmark-wide rates uses the hand-labelled samples (§5.4).
- An automated audit of text-to-SQL ground truth, with LLM agreement and execution comparison and no equivalence checker (our reading; §3.2). The authors estimate annotation error rates of approximately 37% on BIRD's November 2025 development set (abstract; §5.4, Tab. 12) and argue that, under a worst-case bound on this noise, accuracy gaps between top leaderboard systems are not statistically distinguishable (§5.5).

## In plain words

Text-to-SQL benchmarks such as BIRD and Spider score a system by comparing its query's result with a hand-written reference query. The authors argue that many references are wrong, so small leaderboard gaps may mislead (§1). SALUS flags wrong references without human labels: four LLMs each write a query per question, 44 rules turn these into noisy votes on the reference, a statistical model combines the votes into training labels, and small learned models estimate which LLM to trust for which kind of query (abstract; §3; §5.1). With four frontier LLMs, on 298 hand-checked BIRD questions, they report an F1 score (a balance of missed and false flags) of 0.9194, against 0.8895 for a majority vote of the four LLMs, 0.8389 for the automatic stage of an earlier audit tool and 0.6456 for another, SQLDriller (§1). Corrected for SALUS's own mistakes, they estimate that about 37% of references in BIRD's November 2025 development set and 27% in Spider's are wrong (§5.4, Tab. 12). They present it as a fully automatic auditor that improves on earlier tools (§1; §2.2).

## Background and terms

**Terms to know:** [text-to-SQL](#/glossary/text-to-sql) · [gold query](#/glossary/gold-query) · [execution accuracy](#/glossary/execution-accuracy) · [weak supervision](#/glossary/weak-supervision) · [abstract syntax tree (AST)](#/glossary/abstract-syntax-tree-ast) · [F1 score](#/glossary/f1-score) · [bootstrap resampling](#/glossary/bootstrap-resampling) · [Pearson correlation](#/glossary/pearson-correlation)

**The paper's own terms:**
- **Annotation error**: a task whose gold SQL "does not correctly capture the intent" of its question (§3.1); the hand labels use five error types (§4.5, Tab. 2).
- **Agent and verdict**: an agent is one LLM given schema, question and evidence (hints); its verdict says whether its query's result matches the gold result. Agents whose query fails to execute are masked out (§3.1).
- **Labeling function (LF)**: a rule voting Correct, Incorrect or Abstain on each gold query, from three signal sources: execution (result sets), structural (ASTs, e.g. missing joins) and intent (question cues, e.g. "how many" maps to COUNT), plus a meta LF voting with the others' majority (§3.2; App. A).
- **Generative label model**: Snorkel's model, which estimates each LF's accuracy from the votes alone and gives each gold query a probability of being correct; equal numbers of top-ranked tasks per predicted class become **high-confidence samples** with **weak labels** (§3.2).
- **Decision plane**: per-agent **reliability models** predicting, from 12 features of the gold SQL and its result (e.g. join count, result size), whether the agent's verdict matches the weak label (§3.3; §5.1).
- **Frontier and Legacy**: the agent sets GPT-5, GPT-4o, Claude Opus 4.6, Gemini 2.5 Pro (primary) and GPT-4o-mini, GPT-4o, Claude 3 Haiku, Haiku 4.5, the latter closer to the earlier tools' model generation (§5.1).
- **Transductive and Zero-Overlap**: by default SALUS trains on weak labels of the benchmark it then labels; "Zero-Overlap" runs first exclude every evaluation task (§5.1).
- **Agent stacking**: SALUS with the decision plane replaced by one global rule over the four verdicts (§5.1.1).
- **BIRD-Clean-xs**: the authors' hand-labelled set of 298 BIRD development tasks (§4).

**Missing glossary terms:**
- **CART and XGBoost**: a Classification and Regression Tree and a boosted ensemble of trees, the reliability-model candidates (§5.1).
- **Rogan–Gladen correction**: estimating a true rate from a flagged rate, given the flagger's measured true- and false-positive rates (§5.4).
- **Kendall's τ**: pairs ordered the same way in two rankings minus pairs ordered differently, divided by the number of pairs (App. B.3).

**Builds on:**
- SQLDriller (Yang et al.; [SQLDriller](#/papers/yang2025sqldriller "Automated Validating and Fixing of Text-to-SQL Translation with Execution Consistency (2025)")), "the most comparable fully automated method" (§1): it generates 10 SQL candidates, uses "a formal SQL equivalence checker" to build [counterexample databases](#/glossary/counterexample-database), and has an LLM answer the question on them (§2.2).
- SAPAR (Jin et al.; [Pervasive Annotation Errors Break…](#/papers/jin2026annotation "Pervasive Annotation Errors Break Text-to-SQL Benchmarks and Leaderboards (2026)")): an LLM agent writes verification queries and a report for human expert review; SALUS compares with the automatic part, SAR-Agent (o3 backbone), only (§2.2; §5.1.1).
- The Snorkel label model (Ratner et al. 2017, not listed here) (§2.3).
- The audited benchmarks BIRD ([BIRD](#/papers/li2023bird "Can LLM Already Serve as A Database Interface? A BIg Bench for Large-Scale Database Grounded Text-to-SQLs (2023)"); large real-world databases, with external evidence) and Spider ([Spider](#/papers/yu2018spider "Spider: A Large-Scale Human-Labeled Dataset for Complex and Cross-Domain Semantic Parsing and Text-to-SQL Task (2018)"); cross-domain, multi-table) (§2.1).

## Problem and setting

- **Question:** predict whether each task's gold SQL is correct "without access to oracle labels" (§3.1).
- **Benchmarks:** two versions of BIRD's development set (the one in SQLDriller's repository and BIRD's November 2025 release; 1,534 tasks) and Spider's development set (§4.1; §5.4, Tab. 12).
- **Evaluation data:** BIRD-Clean-xs joins a 200-task random sample and 109 tasks whose gold SQL changed between the two BIRD versions (question and evidence unchanged, results different), all confirmed erroneous in the earlier version (§4.1–4.3).
- **What "correct" means:** a person's judgment that the gold SQL answers the question (§4.4). Agent verdicts compare results on the one benchmark database (§3.1); result-set LFs normalize differences "such as whitespace, case, NULL representation, column order, and small floating-point variation" (App. A.1). Whether row order and duplicates count is not discussed.
- **Agents:** one SQL attempt each, provider-default reasoning settings (§5.1).

## Approach

- **Signal (§3.1):** agents agreeing with each other but not with the gold result give "evidence of a possible annotation error"; agents come from distinct model families "to maximize independence of failure modes" (§3.2).
- **Pipeline (§3.2–3.4; §5.1):** the 44 LFs (Tab. 3) vote; Snorkel turns the votes into probabilities; the top 250 tasks per class form 500 training samples, "the only supervision used in the downstream components" (§3.2). Each agent's reliability model learns where in feature space to trust it, so a query is "routed to the agent most trustworthy in that part of the feature space" (§3.3; Fig. 3). An ensemble chosen by cross-validation on the high-confidence samples gives the final label (§3.4); depth-2 CART with score fusion (a logistic regression) was selected (§5.6.4). Fig. 4 follows one task through.
- **Benchmark-wide rate (§5.4):** the flagged share is corrected with SALUS's true- and false-positive rates on a hand-labelled 200-task sample of the same benchmark version (Rogan–Gladen).
- **Leaderboard (§5.5; App. B):** under a "worst-case assumption" that each estimated flawed query independently swings a pair's gap maximally, they derive the smallest development-set gap significant at one-sided 95%. An expected Kendall's τ, discounting pairs inside the noise margin, is compared with the observed development–test rank agreement.
- **Correction (§6.1):** where at least three valid agents agree on a flagged task, SALUS proposes the most reliable one's SQL.

## Results

- **Detection (§5.2, Tab. 4; §5.3, Tab. 8):** Frontier's F1 0.9194 on BIRD-Clean-xs is above agent stacking, weak labels alone, majority vote, the best single agent (Opus 4.6), SAR-Agent and SQLDriller (values in §1); on the random sample, scores are lower with the same ranking (Tab. 4B). Under Zero-Overlap SALUS "remains the strongest non-oracle method" (§5.2).
- **Significance (Tab. 5):** a paired bootstrap finds the gain significant against each agent, majority vote and weak labels; against agent stacking the interval's lower end reaches zero (§5.2).
- **Error types (Tabs. 6–7):** recall is lowest on Data Inconsistency and Misinterpreting Domain Semantics, where agents "execute against the same flawed data or lack the implicit domain knowledge" (§5.2).
- **Existing tools (§5.3, Tabs. 8–11):** Legacy is comparable to SAR-Agent and above SQLDriller "at substantially lower cost and latency" (Finding 2). On 71 errors whose fix changes LIMIT or DISTINCT, the class "most favorable to SQL-difference-based methods", Frontier detects the most and SQLDriller the fewest (Tab. 9).
- **Error rates (§5.4, Tab. 12):** about 37% (95% interval 30–43%) for BIRD's November 2025 release, slightly higher for the earlier version, about 27% for Spider. Their hand-labelled 200-task BIRD sample had 68 errors (34%), 47 unchanged in the November 2025 release (§4.2).
- **Leaderboard (§5.5, Fig. 1):** under the 37% estimate, development gaps below 5.09% are not significant at 95%, and among the top 30 BIRD systems the rank-1 system "cannot be reliably distinguished from the next 20". Observed development–test rank agreement is well above the expected τ, which they call "consistent with the hypothesis that development and test sets share similar annotation artifacts" (§5.5).
- **Analysis (§5.6):** LFs correlate far less across signal sources than within one; every single-source removal lowers F1, removing both execution and structural signals far more (Tab. 14); each agent's trees split on different features (Tab. 15).
- **Correction (§6.1, Tab. 16):** on the 134 Incorrect SQL errors SALUS makes more correct fixes than SQLDriller, but most stay unfixed.

## Limits the authors state

- Execution-based signals are "instance-dependent: an erroneous annotation is hidden when it returns the expected result on that database" (§5.3).
- Data Inconsistency and Domain Semantics errors leave "little disagreement signal for the pipeline to exploit" (§5.2).
- In the default transductive setting, "weak labels assigned to evaluation tasks can be selected among the high-confidence samples used for downstream training" (§5.1).
- The leaderboard analysis "assumes that corrections to flawed queries affect each system independently", which they call conservative (§5.5); they also list other explanations for the τ result (§5.5).
- "Reliable detection is necessary but not sufficient for correction"; for errors beyond Incorrect SQL "SQL substitution alone may be insufficient" (§6.1).
- Harder benchmarks such as Spider 2.0 (enterprise-scale schemas) would need multi-agent pipelines as agents, and "most top-performing systems are proprietary, limiting access to diverse agent signals" (§6.2).

## Open problems and building blocks

- **Open:** they "leave robust correction to future work", suggesting "learning supervised agent selection from a ground-truth correction set", stronger agentic NL-to-SQL pipelines, and localizing error types as feedback to annotators (§6.1). For maintainers: audits as a release gate, adjudicating flagged tasks, a verified-clean subset, reported ranking uncertainty (§7).
- **Released:** "The source code is available" (abstract footnote).
- **To reuse it:** four agent calls per task plus execution on the benchmark database; for Frontier about $0.0332 and 15.3 s per task, plus a one-time CPU pass of about 50 s (§5.3, Tab. 11). No human labels for training (§3.2), but the calibrated rate needs a hand-labelled 200-task random sample per benchmark version (§5.1.2). SALUS is "source agnostic": open-weight models can serve as agents (§6.2).
- **Beyond its domain:** the approach "applies to any domain where reference annotations may be unreliable" (§1); they sketch LFs for the code benchmarks LiveCodeBench and SWE-bench and the math benchmark RealMath, where "only the domain-specific labeling functions and reliability criteria require adaptation" (§6.2).

## On this site

- **Tags:** <span class="tags"><a class="tag" href="#/tags/compact">compact</a><a class="tag" href="#/tags/labels">labels</a><a class="tag" href="#/tags/stats">stats</a><a class="tag sub" href="#/tags/judge-sql">judge-sql</a><a class="tag sub" href="#/tags/llm-assist">llm-assist</a><a class="tag sub" href="#/tags/llm-gen">llm-gen</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/nl2sql-data">nl2sql-data</a></span>
