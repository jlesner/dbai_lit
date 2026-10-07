# Can LLMs Normalize Databases? A Benchmark and Multi-Agent Framework for Schema Normalization

**Can LLMs Normalize Databases?…** · preprint 2026

Read: [PDF](https://arxiv.org/pdf/2609.11141) · [arXiv](https://arxiv.org/abs/2609.11141)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- A benchmark of LLM database normalization from 1NF to BCNF: functional dependencies, lossless-join decompositions and inter-table constraints (abstract).
- Scored on semantic equivalence, structural accuracy and logical validity; also proposes a multi-agent method, MARS (abstract).
- Schema design, whose properties (dependencies, lossless joins) are checkable by our reading.

## In plain words

Normalizing a database means splitting a badly designed table into smaller linked tables so that each fact is stored once, up through four standard levels of design called normal forms. It requires finding which columns determine which others, splitting without creating spurious rows, and linking the new tables by keys. The authors say that "existing studies provide limited evidence for whether LLMs can handle database normalization" (§1). They build DNBench: 3,275 badly designed tables derived from two public database benchmarks, each with its expected answer, and a score that checks that the split loses no information, matches the expected tables and keys, and diagnoses and explains the problem correctly (abstract, §3). Four open-weight models score lowest when the column rules must be inferred rather than given (§4.2). The authors' four-agent pipeline, MARS, raises the score by 82.0% on average over a single prompt, in that inferred-rules setting with Qwen3-30B (abstract, §5.3). They present the benchmark as filling a gap left by earlier tools and LLM methods: DNBench "fills this gap" (§2).

## Background and terms

**Terms to know:** [functional dependency](#/glossary/functional-dependency) · [integrity constraint](#/glossary/integrity-constraint) · [F1 score](#/glossary/f1-score) · [LLM-as-a-judge](#/glossary/llm-as-a-judge) · [text-to-SQL](#/glossary/text-to-sql) · [Cohen's kappa](#/glossary/cohens-kappa) · [Spearman's rank correlation](#/glossary/spearmans-rank-correlation) · [bootstrap resampling](#/glossary/bootstrap-resampling) · [DDL (data definition language)](#/glossary/sql-statement-categories-ddl-dml-dql-dcl-tcl) (here SQL `CREATE TABLE` statements declaring tables, columns and keys, §3)

**The paper's own terms:**
- **Chain-rule labeling**: violations are composed in reverse order (BCNF first) so all stay visible; each sample has a *single* target fixing only the earliest violation and a *combined* target fixing the whole chain, plus expected foreign keys (§3.1 "Stage 2", "Stage 3").
- **Violation path**: which normal forms a sample violates: none, BCNF only, 3NF+BCNF, 2NF+3NF+BCNF, or all four (Tab. 10 caption).
- **Single / Complex / Real World**: fix the earliest violation, dependencies given; fix all, dependencies given; fix all, dependencies withheld (§4.1, Tab. 3).
- **Structural score**: the mean of Column F1, Primary Key F1 and FK Score against the gold decomposition; FK Score is FK F1 times a binary FK Connected Score (whether every generated foreign key references tables and columns that exist) (§3.2 "Criterion 2").
- **Logical score**: the mean of an LLM judge's average over three 0–5 ratings (Logical Coherence, Explanation of Schema Alignment, Explanation Quality) and Violation F1, the F1 of the predicted violation types against the gold ones (§3.2 "Criterion 3").
- **DNB-Score**: the semantic score (1 if the generated tables join losslessly back to the input table, else 0; §3.2 "Criterion 1") × the square root of (structural × logical) (§3.2 "DNB-Score").

**Missing glossary terms:**
- **Normal forms (1NF, 2NF, 3NF, BCNF)**: levels of table design, as the paper's prompts state them (App. H, Prompt 1; §3.1 "Stage 2"): 1NF is violated by multivalued cells (several values in one cell); 2NF by a partial dependency (a column determined by only part of a composite key); 3NF by a transitive dependency (a key determines a non-key column B, and B determines another column C); BCNF (Boyce–Codd normal form) by any dependency whose determining columns are not a superkey.
- **Superkey / candidate key**: a superkey is a set of columns whose values determine all other columns of the table; a candidate key is a minimal one (§3.1 "Stage 2", App. H).
- **Lossless-join decomposition**: a split whose natural join (matching rows on shared columns) rebuilds the original table without spurious tuples (§3.2 "Criterion 1").

**Builds on:**
- Miffie (Jo et al., 2025), a "Dual-LLM self-refinement framework" for 1NF–3NF normalization (one LLM decomposes, another gives feedback); their closest work and main comparison (§2.2, §5.2).
- Spider ([Spider](#/papers/yu2018spider "Spider: A Large-Scale Human-Labeled Dataset for Complex and Cross-Domain Semantic Parsing and Text-to-SQL Task (2018)")) and BIRD ([BIRD](#/papers/li2023bird "Can LLM Already Serve as A Database Interface? A BIg Bench for Large-Scale Database Grounded Text-to-SQLs (2023)")), text-to-SQL benchmarks whose key-annotated schemas are the source of every sample (§3.1, App. A).
- AutoGen, MetaGPT and ChatDev, multi-agent LLM frameworks whose role specialization and verifier feedback MARS adapts (§5).
- BLEU, the machine-translation score that inspired the DNB-Score's use of a geometric mean (§3.2).

## Problem and setting

- **Question:** can LLMs normalize schemas from 1NF to BCNF, and where do they fail (§1, §4)?
- **Data** (Fig. 1): each Spider and BIRD database is downsampled into a small SQLite instance that keeps key uniqueness and foreign-key links (§3.1 "Stage 1"; App. A.3, Alg. 1); violations are both found in the real schemas and injected by deterministic synthesizers for 2NF, 3NF and BCNF (§3.1 "Stage 2"); three database experts audited the samples (§3.1; App. A.4). Experiments use the 1,285-sample test split (Tab. 2, §4.1).
- **Input and output:** a denormalized table, sample rows and, except in Real World, the dependencies; the model returns DDL, violation labels, explanation (§4.1; App. H). In Real World, the paper says the input "includes a table, row samples, and natural-language business rules" (§4.1 "Experiment 3: Real World Reasoning").
- **What counts as correct:** the gold decomposition and labels, through the DNB-Score above (§3.2). NULLs and duplicate rows: not discussed.
- **Models:** Llama 3.3 70B and Gemma3 27B (dense), Qwen3-30B and Mixtral 8x7B Instruct (mixture-of-experts: only some sub-networks run per token), zero-shot and few-shot, with no fine-tuning; quantized variants use Q4_K_S (4-bit) GGUF builds (§4.1; App. B). The judge is `gpt-oss-20b`, chosen because the Judge's Verdict benchmark identifies it as a human-like judge (§3.2). All results come from a single run (App. C).

## Approach

- **Judge check:** the authors compare the judge with three database experts on 50 instances (App. E).
- **MARS** (§5.1, Fig. 2): an Evidence Agent sorts given or inferred dependencies into reliable, hypothetical and rejected; a Diagnosis Agent names violated normal forms and plans the decomposition, preferring reliable dependencies; a Schema Generator Agent writes the DDL; a Verifier agent parses the DDL and checks column preservation, key validity, per-table normal forms, lossless join and the handling of multivalued 1NF columns (the authors call this stage "deterministic verification"). On failure, up to two repair rounds route the error back: DDL errors to the generator, decomposition errors to the Diagnosis Agent, foreign-key errors to the Evidence Agent (§5.1 "Repair"). At most three generation attempts, matching Miffie's three iterations (§5.2).
- **Comparison setup:** MARS, Miffie and the single-prompt baseline all use Qwen3-30B, chosen as the best base model in Real World, on the Real World setting only (§5.2). Miffie, designed for 1NF–3NF, is run with BCNF cases included (§5.2; App. F).

## Results

All are the authors' claims.

- **Dependency inference:** averaged over the four models and over zero- and few-shot, the DNB-Score goes from 0.328 (Single) to 0.285 (Complex) to 0.188 (Real World); the authors read this as "FD extraction is the main bottleneck in LLM-based database normalization", since "once FDs are given, models can apply normalization rules to some extent" (§4.2 "Findings 1", Tab. 4).
- **Diagnosis versus construction:** averaged over all six configurations, Violation F1 reaches up to 0.678 while FK Score ranges from 0.10 to 0.17 across models: "models can often identify which normal forms are violated", but building valid primary- and foreign-key structure is harder (§4.2 "Findings 2", Tab. 5).
- **Per-path failures:** the authors report that most models struggle with multiple violations, BCNF reasoning and already-normalized inputs, "even though performance varies across violation paths"; on the latter "models sometimes introduce unnecessary decompositions even when no normalization is required" (§4.2; Tab. 7, Tab. 11).
- **MARS:** Real World, Qwen3-30B, DNB-Score: Baseline 0.253 / Miffie 0.308 / MARS 0.423 zero-shot, and 0.209 / 0.339 / 0.418 few-shot (§5.3, Tab. 6). Gains are concentrated in the lossless-join and structural components; MARS has the highest FK Score of the three, yet FK Score stays far below Column and PK F1; Violation F1 stays close to the baseline: "MARS does not substantially improve violation classification itself" (§5.3).
- **Miffie:** better lossless join than the Baseline and high Column and PK F1, but a sharp drop in Violation F1 and a low FK Score (§5.3). Among outputs reaching a third iteration, verifier-passed ones score only slightly higher than failed ones: "the LLM-based verifier does not reliably distinguish schema-level normalization quality" (App. G.1, Tab. 13).
- **Where MARS fails:** the Evidence stage's exact-match dependency recall is 0.5119, against 0.7805 plan-to-DDL exact match for the Schema Generator; "Upstream FD inference and violation diagnosis remain the main bottlenecks" (§5.3; App. G.2, Tab. 15). Samples that need two repair rounds score much lower, and "most remain unresolved" (App. G.2, Tab. 14).
- **Judge validation:** mean LLM–human quadratic weighted Cohen's kappa (QWK, kappa for ordered scores) 0.818 against 0.852 between humans, which the authors call "statistically indistinguishable" because the 95% bootstrap interval on the difference contains zero (App. E, Tab. 12). Human agreement among all three, "not particularly high", suggests to them that "the task is difficult enough to elicit disagreement among human experts" (App. E).

## Limits the authors state

- **Foreign keys:** MARS's FK Score "still falls well short of Column F1 and PK F1"; upstream dependency or diagnosis errors can further complicate it (§ "Limitations", "FK reconstruction remains a bottleneck.").
- **BCNF and already-normalized inputs:** MARS still struggles with BCNF-only inputs, and inputs needing no change, though easier, still show unnecessary decompositions; both "require stronger semantic reasoning about key structure" (§ "Limitations").
- **Cost and upstream errors:** "The performance gains should therefore be interpreted together with this additional inference cost." Repair works best for local errors, but "it cannot always recover from incorrect FD evidence or an incorrect decomposition plan" (§ "Limitations").

## Open problems and building blocks

  - The bottleneck they name, foreign keys (first limit above): "Recovering valid inter-table constraints after decomposition, therefore, remains an open problem." (§ "Limitations").
  - "Future work should explore adaptive agent routing and stronger evidence extraction to reduce unnecessary calls while improving robustness." (§ "Limitations").
  - The authors expect DNBench and MARS to provide a basis for LLM-driven normalization, "facilitating future research on multi-agent approaches to database schema design" (§6).
- **Released:** nothing yet; "All artifacts will be released upon acceptance." (abstract).
- **To reuse it:** open-weight models served with vLLM on NVIDIA A100 40 GB GPUs, one GPU for Qwen3-30B and for MARS, two for Llama 3.3 70B (App. C); `gpt-oss-20b` as judge (§3.2); several LLM calls per sample for MARS (§ "Limitations"). Prompts: App. H.

## On this site

- **Tags:** <span class="tags"><a class="tag" href="#/tags/dbtask">dbtask</a><a class="tag sub" href="#/tags/harness-sql">harness-sql</a><a class="tag sub" href="#/tags/llm-method">llm-method</a></span>
