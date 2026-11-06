# Can LLMs Normalize Databases? A Benchmark and Multi-Agent Framework for Schema Normalization

**Can LLMs Normalize Databases?…** · preprint 2026

Read: [PDF](https://arxiv.org/pdf/2609.11141) · [arXiv](https://arxiv.org/abs/2609.11141)

<p class="notice">A summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- A benchmark of LLM database normalization from 1NF to BCNF; it reports recurring failures in dependency inference, schema decomposition and inter-table constraint reconstruction (abstract).
- Scored on semantic equivalence, structural accuracy and logical validity; also proposes a multi-agent method, MARS (abstract).
- Schema design, whose properties (dependencies, lossless joins) are checkable by our reading.

## In plain words

Normalizing a database means splitting a badly designed table into smaller linked tables so that each fact is stored once, up through four standard levels of design called normal forms. It requires finding which columns determine which others, splitting without creating spurious rows, and linking the new tables by keys. The authors say that "existing studies provide limited evidence for whether LLMs can handle database normalization" (§1). They build DNBench: 3,275 tables derived from two public database benchmarks, mostly badly designed, some already normalized as controls, each with its expected answer, and a score that checks that the split loses no information, matches the expected tables and keys, and diagnoses and explains the problem correctly (abstract, §3). Four open-weight models score lowest when the column rules are withheld and must be inferred (§4.2). The authors' four-agent pipeline, MARS, raises the score on average by 0.227, an 84.0% relative gain, over a single prompt (abstract, §1), with Qwen3-30B in that withheld-rules setting (§5.2). They present the benchmark as filling a gap: DNBench "bridges this gap" (§2).

## Background and terms

**Terms to know:** [functional dependency](#/glossary/functional-dependency) · [normalized schema](#/glossary/normalized-schema) · [integrity constraint](#/glossary/integrity-constraint) · [F1 score](#/glossary/f1-score) · [LLM-as-a-judge](#/glossary/llm-as-a-judge) · [Cohen's kappa](#/glossary/cohens-kappa) · [bootstrap resampling](#/glossary/bootstrap-resampling) · [DDL (data definition language)](#/glossary/sql-statement-categories-ddl-dml-dql-dcl-tcl) (here SQL `CREATE TABLE` statements, §3) · [normal forms (1NF, 2NF, 3NF, BCNF)](#/glossary/normal-forms-1nf-2nf-3nf-bcnf) (as the paper's prompts state them, App. J.1, Prompt 1; §3.1 "Stage 2") · [superkey / candidate key](#/glossary/superkey-and-candidate-key) (§3.1 "Stage 2", App. J.1) · [lossless-join decomposition](#/glossary/lossless-join-decomposition) (§3.2 "Criterion 1")

**The paper's own terms:**
- **Chain-rule labeling**: violations are composed in reverse order (BCNF first) so all stay visible; each sample has a *single* target fixing only the earliest violation, a *combined* target fixing the whole chain, and expected foreign keys (§3.1 "Stage 2", "Stage 3").
- **Sample categories**: all four forms violated (1NF–2NF–3NF–BCNF), 2NF–3NF–BCNF, 3NF–BCNF, BCNF only, or NONE (already normalized) (§3.1; App. A.5).
- **Single / Complex / FD-withheld**: fix the earliest violation, FDs (functional dependencies) given; fix all, FDs given; fix all, FDs not given (§4.1, Tab. 3).
- **Semantic score**: 1 if the generated tables join back losslessly to the input table, else 0, checked with "the chase algorithm over the functional dependencies" (a symbolic test that needs no data); a dropped column fails (§3.2 "Criterion 1").
- **Structural score**: the mean of Column F1, Primary Key F1 and FK Score against the gold decomposition; FK Score is FK F1 times a binary FK Connected Score (whether every generated foreign key references tables and columns that exist) (§3.2 "Criterion 2").
- **Logical score**: the mean of Violation F1 (predicted against gold violation types) and an LLM judge's average over three 0–5 ratings: Logical Coherence, Explanation of Schema Alignment, Explanation Quality (§3.2 "Criterion 3").
- **DNB-Score**: semantic score × the square root of (structural × logical) (§3.2 "DNB-Score").

**Builds on:**
- Miffie (Jo et al., 2026), "the Dual-LLM self-refinement framework" for 1NF-to-3NF normalization (one LLM generates, another verifies); their closest work and main comparison (§2.2, §5.2).
- Spider ([Spider](#/papers/yu2018spider "Spider: A Large-Scale Human-Labeled Dataset for Complex and Cross-Domain Semantic Parsing and Text-to-SQL Task (2018)")) and BIRD ([BIRD](#/papers/li2023bird "Can LLM Already Serve as A Database Interface? A BIg Bench for Large-Scale Database Grounded Text-to-SQLs (2023)")), [text-to-SQL](#/glossary/text-to-sql) benchmarks whose key-annotated schemas are the source of every sample (§3.1, App. A.1).
- AutoGen, MetaGPT and ChatDev, multi-agent LLM frameworks whose role specialization and verifier feedback MARS adapts (§5).

## Problem and setting

- **Question:** can LLMs normalize schemas from 1NF to BCNF, and where do they fail (§1, §4)?
- **Data** (Fig. 1): Spider and BIRD databases are downsampled into small SQLite instances that keep keys and foreign-key links (§3.1 "Stage 1"; App. A.3, Alg. 1); violations are found in the real schemas and injected by deterministic synthesizers (§3.1 "Stage 2"); three database experts audited the samples (§3.1; App. A.4). Experiments use the 1,285-sample test split (Tab. 2).
- **Input and output:** a denormalized table, sample rows and, except in FD-withheld, the dependencies; the model returns DDL, violation labels and an explanation (§4.1; App. J.1). In FD-withheld, the paper says the input "includes a table, row samples, and natural-language business rules" (§4.1 "Experiment 3: FD-withheld Reasoning").
- **What counts as correct:** the gold decomposition and labels, through the DNB-Score (§3.2). The gold answers, scored as outputs, get near the maximum (§3.2 "Dataset Verification"; App. D, Tab. 7). NULLs and duplicate rows: not discussed.
- **Models:** Gemma-3-27B-it and Llama-3.3-70B-Instruct (dense), Qwen3-30B-A3B-Instruct-2507 and Mixtral-8x7B-Instruct-v0.1 (mixture-of-experts: only some sub-networks run per token), zero-shot and few-shot, no fine-tuning; Gemma-3 4B and 12B only in a scale comparison (§4.1; App. B). The judge, `gpt-oss-20b`, was chosen because the Judge's Verdict benchmark identifies it as a human-like judge (§3.2), and is from another model family than those evaluated (App. B). Results come from a single run (App. C); one setting is repeated three times (App. G.2).

## Approach

- **Judge check:** the authors compare the judge with three database experts on 50 instances (App. E).
- **MARS** (§5.1, Fig. 2): three LLM stages and a rule-based one. An Evidence Agent adopts the given dependencies or infers candidates, sorting them into reliable, hypothetical and rejected, and flags multivalued columns; a Diagnosis Agent names the violated normal forms and plans a stepwise decomposition; a Schema Generator Agent writes the DDL with keys, labels and explanation; a Verifier Agent checks the output "against the model's own extracted FDs rather than gold dependencies" (dependencies against the rows, per-table normal forms, lossless join and key validity, among others) and reports failures without prescribing fixes.
- **Repair** (§5.1 "Repair Loop"): up to two rounds, restarting from the agent whose output failed first, with all later agents re-run; at most three generation attempts, matching Miffie's three iterations (§5.2).
- **Comparison setup:** MARS, Miffie and the single-prompt Baseline all use Qwen3-30B, the best base model in FD-withheld, on FD-withheld only (§5.2). Miffie, designed for 1NF–3NF, is run with BCNF cases included (§5.2; App. F).

## Results

All are the authors' claims.

- **Dependency inference:** averaged over the four models and over zero- and few-shot, the DNB-Score goes from 0.341 (Single) to 0.338 (Complex) to 0.205 (FD-withheld): "FD extraction is the main bottleneck in LLM-based database normalization" (§4.2 "Finding 1", Tab. 4).
- **Diagnosis versus construction:** in FD-withheld, Violation F1 reaches up to 0.684 while FK Score ranges from 0.10 to 0.25 across models: "LLMs excel at local violation diagnosis but struggle to reconstruct global schemas with valid PK and FK structures" (§4.2 "Finding 2", Tab. 5).
- **Per-path failures:** BCNF is the hardest path, and already-normalized inputs also score low, which the authors read as "a strong tendency among models to decompose schemas unconditionally, rather than only when necessary" (§4.2 "Finding 3", Tab. 13).
- **MARS:** FD-withheld, Qwen3-30B, DNB-Score: Baseline 0.248 / Miffie 0.288 / MARS 0.499 zero-shot, and 0.293 / 0.381 / 0.496 few-shot (§5.3, Tab. 6). MARS gains in lossless join and structure, with the highest FK Score of the three (§5.3); its Violation F1 is below the Baseline's (Tab. 6). Miffie's structural scores stay close to the Baseline's, and its verifier "struggles to identify high-quality schemas" (§5.3; App. H.1, Tab. 9).
- **Where MARS fails:** without the Evidence Agent it falls below both the Baseline and Miffie (§5.3, Fig. 3). The Evidence stage's exact-match dependency recall is 0.654, against 0.968 plan-to-DDL exact match for the Schema Generator; the Evidence stage "is precise but incomplete" (App. H.2, Tab. 11). Most samples needing two repair rounds still fail verification (App. H.2, Tab. 10).
- **Stability, scale and tokens:** over three runs MARS varies less than the Baseline, which "confirms that the observed gains are statistically significant" (§5.3; App. G.2, Fig. 6). Within Gemma 3, MARS's score rises with model size while the Baseline's peaks at 12B (App. G.1, Fig. 5). Zero-shot MARS uses fewer tokens than few-shot Miffie and scores higher (§5.3; App. G.4, Fig. 7).
- **Judge validation:** on the overall judge score, LLM–human quadratic weighted Cohen's kappa (QWK, kappa for ordered scores) is 0.857 against 0.896 between humans, which the authors call "statistically indistinguishable" because the 95% bootstrap interval on the difference contains zero (App. E, Fig. 4). The judge's ranking also tracks the human mean ([Spearman's rank correlation](#/glossary/spearmans-rank-correlation), App. E).

## Limits the authors state

- **Foreign keys:** "Across every evaluated configuration, foreign-key reconstruction remains a severe bottleneck"; MARS has the highest FK Score, but "this absolute value remains critically low", and upstream dependency or diagnosis errors "easily cascade through this process" (§ "Limitations", "FK reconstruction remains a bottleneck.").
- **Over- versus under-normalization:** "MARS trades over-normalization for under-detection." Averaged over zero- and few-shot, the Baseline decomposes 57.0% of already-normalized inputs and MARS 4.7%, but MARS leaves 37.1% of violating inputs unchanged: "Deciding whether a decomposition is needed, rather than carrying one out, is thus the dominant remaining error mode." (§ "Limitations"; Qwen3-30B, FD-withheld: App. G.3, Tab. 8).
- **Cost:** "MARS requires more calls, tokens, and latency than both single-prompt Baseline and Miffie, and we regard this as genuine cost of the approach rather than negligible overhead." (App. G.4).
- **Deployment:** "LLM-generated schemas can silently lose information when lossless join fails, so we recommend that automated normalization be paired with deterministic verification and human review before deployment." (§ "Ethical Considerations").

## Open problems and building blocks

  - The bottleneck they name, foreign keys (first limit above): "Recovering valid inter-table constraints after decomposition therefore remains a major open problem." (§ "Limitations").
  - For MARS, "recognizing violations whose supporting dependencies are only weakly evidenced in sample rows remains the main open problem" (App. G.3).
  - The authors believe DNBench and MARS "lay the groundwork for future research on LLM-driven database schema design" (§6).
- **Released:** nothing yet; "All artifacts will be released upon acceptance." (abstract); "DNBench inherits these licenses and will be released under compatible terms" (§ "Ethical Considerations").
- **To reuse it:** open-weight models served with vLLM on NVIDIA A100 40 GB GPUs, one per model and two for Llama-3.3-70B (App. C); `gpt-oss-20b` as judge (§3.2); about five LLM calls per sample for MARS (App. G.4, Fig. 7). Prompts: App. J.

## On this site

- **Tags:** <span class="tags"><a class="tag" href="#/tags/benchmark">benchmark</a><a class="tag" href="#/tags/dbtask">dbtask</a><a class="tag" href="#/tags/harness">harness</a><a class="tag" href="#/tags/llm">llm</a><a class="tag" href="#/tags/method">method</a><a class="tag sub" href="#/tags/dsl-sql">dsl-sql</a></span>
