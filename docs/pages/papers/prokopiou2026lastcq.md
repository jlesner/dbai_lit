# What Drives Recovery in Agentic Text-to-Cypher? LAST-CQ: An LLM Agent Self-Refinement Framework

**What Drives Recovery in…** · accepted at REALM, the 2nd Workshop for Research on Agent Language Models at EMNLP 2026

Read: [PDF](https://arxiv.org/pdf/2609.12746) · [arXiv](https://arxiv.org/abs/2609.12746)

<p class="notice">A summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Ablates a training-free five-agent loop that writes Cypher (a query language for graph databases) from English questions: removing correction, replacing its LLM-written, schema-grounded hints with the raw database error string ("naive retry"), and spending the same call budget on three parallel samples, over the 2,471-question executable subset of the Neo4j Text2Cypher benchmark with six API models (abstract; §4; §6).
- Validation by `EXPLAIN` and a `LIMIT 1` probe calls no model when the query passes; a failure gets synthesized hints, or a fixed set of relaxation hints for an empty result, and is rewritten under a two-cycle budget (§3.1–3.2, Alg. 1). Results are scored by n-gram overlap on serialized results, order-invariant set metrics and an LLM judge checked against one author's blind labels (§4; §7; App. B).
- Evidence on how much the feedback's content matters in a DSL repair loop: the authors report that schema-grounded hints beat the raw error string by 20.9% against 19.9% exact match on the 1,917 corrected model–query pairs (Tab. 4) and conclude that detecting failure and routing it to a retry is what works (abstract), while stating that they ran no retry arm with routing but no feedback content (Limitations); it also measures how n-gram overlap and an LLM judge misjudge query results (§7).

## In plain words

LLMs that write queries for a graph database from English questions (Text-to-Cypher) are often wrapped in a loop: check the query, run it, feed the failure back, retry. The authors argue that such loops are credited as a whole: "If the gain in fact comes from the cheapest component, the field is over-investing in the expensive ones" (§1). They build LAST-CQ, a five-agent loop whose parts can be removed one at a time, and test it with six API models on one benchmark (abstract; §4). They report that it recovers 91.7% of the queries that fail (an error or an empty result) under single-pass generation, averaged over the models, counting a query that runs and returns something as correct (Tab. 2; §3.2). On the queries it corrected, replacing its model-written, schema-aware hints with the raw database error costs about one point of exact match (19.9% against 20.9%, Tab. 4); in the two models tested, spending the same budget on three parallel samples does worse than one try (§6.3). They present the paper as "An ablation of the agentic-refinement family, not another member" (§1).

## Background and terms

**Terms to know:** [self-correction](#/glossary/self-correction) · [text-to-SQL](#/glossary/text-to-sql) · [BLEU and ROUGE](#/glossary/bleu-and-rouge) · [F1 score](#/glossary/f1-score) · [LLM-as-a-judge](#/glossary/llm-as-a-judge) · [Cohen's kappa](#/glossary/cohens-kappa) · [equivalence test (TOST)](#/glossary/equivalence-test-tost) · [property graph](#/glossary/property-graph) (queried here in Cypher; Text-to-Cypher writes a Cypher query from an English question, §1) · [Jaccard similarity](#/glossary/jaccard-similarity) (the rows two results share over the distinct rows in either, App. C "Set-metric definitions")

**Missing glossary terms:** none.

**The paper's own terms:**
- **LAST-CQ and LAST-CQ+DB**: LAST-CQ is the pipeline "with schema access only", which "cannot execute queries"; LAST-CQ+DB adds the live Neo4j database (the graph database the benchmark ships) (§4). The headline results are LAST-CQ+DB's.
- **Baseline (single-pass)**: one generation with Ozsoy et al.'s (2025) prompting; for four backbones their reported figures, for two the authors' runs (§4).
- **No-refinement**: "not a separate run": the LAST-CQ+DB run re-scored with every query that entered correction set to zero, a "counterfactual upper bound" on correction's value (§4).
- **Naive retry**: keeps all detection and routing, but the Correction Agent gets "the raw Neo4j error string" instead of synthesized hints (§6.2).
- **Best-of-3**: three candidates sampled in parallel at temperature 0.7, the first non-empty result kept (§6.3).
- **Execution Google-BLEU (GLEU)**: a BLEU variant (averaging, over short n-grams, the smaller of precision and recall) between the serialized results of the generated and reference queries; order-sensitive, "a comparability metric, not as evidence of correctness" (§4). The benchmark scores any non-empty output against an empty reference as 1.0 (§4).
- **Exact match (EM), two senses**: in §4, result sets compared after sorting rows and keys, "order-invariant by construction"; in Tab. 4, "the published BLEU ≥ 0.999 proxy", which row order can lower (§7).
- **Set metrics**: precision, recall, F1, Jaccard and set equality over results as sets of canonicalized rows (each row reduced to a sorted key–value tuple) (App. C).
- **Judge semantic accuracy**: GPT-4o-mini rates each executed result CORRECT, PARTIAL or INCORRECT; Tab. 2 reports CORRECT plus PARTIAL (§4; App. B).

**Builds on:**
- Ozsoy et al. (2025), Text2Cypher: the benchmark and the prompting method of the Generation agent and the Baseline (§3.1, §4).
- Gusarov et al. (2025): "The closest published system", a multi-agent Text-to-Cypher pipeline on Memgraph (another graph database), judged by an LLM on CypherBench (another Text-to-Cypher benchmark) (§2.2).
- Self-Refine (Madaan et al., 2023) and Reflexion (Shinn et al., 2023; [Reflexion](#/papers/shinn2023reflexion "Reflexion: Language Agents with Verbal Reinforcement Learning (2023)")): improving outputs from feedback; "The shared premise is that richer feedback yields better correction", which §6 tests (§2.1).
- Tomczak (2026), CYGNET, another Cypher pipeline, whose feedback-format ablation the paper cites as "Independent evidence" (§6.2).

## Problem and setting

- **The question:** "which part of the loop produces the gain" (abstract).
- **Data:** the executable subset of the Neo4j Text2Cypher benchmark, 2,471 question–query pairs in 16 domains (§4), which the authors call "the only publicly available Text-to-Cypher benchmark with live databases for execution-based evaluation" (Limitations).
- **Models:** GPT-4o-mini, GPT-4o, Gemini 1.5 Flash and Pro, Claude Sonnet 4 and DeepSeek-Chat, at temperature 0 ([greedy decoding](#/glossary/greedy-decoding-and-temperature-sampling)), prompted only (§4); "aggregate" means their unweighted mean unless pooling is stated (§4). In naive retry, Gemini 2.5 Flash replaces the retired Gemini 1.5 models in both arms (Tab. 4).
- **Correctness:** "following common practice we adopt the criterion" that a query is correct when it returns a non-empty result, "while acknowledging that a non-empty result does not imply semantic correctness" (§3.2).
- **Budgets:** two validation cycles, chosen from the observed cycle distribution, and one relaxation pass fixed by the implementation, so larger relaxation budgets were never measured (§4).
- **Not compared:** fine-tuned models, whose gains are "more than any inference-time result here, and we do not claim to match it" (§4).

## Approach

- **Five agents** (§3.1, Fig. 1), with their LLM calls:
  - Schema Parsing (0): deterministic parsers, with an LLM fallback that never fires here; Generation (1);
  - Validation (0–2): runs `EXPLAIN` (a [query plan](#/glossary/query-plan-and-explain) request that does not run the query), then executes with `LIMIT 1` to catch empty results; if both pass it "invokes no model at all"; otherwise it parses the query (1 call), checks it against the schema deterministically, and writes hints only on violations (1 call);
  - Correction (1): rewrites from the hints, the schema and past attempts;
  - Execution (0): on an empty result, injects six fixed relaxation hints (e.g. case-insensitive regex, substring matching) and routes back to Correction.
- **Control flow** (§3.2, Alg. 1): Validation and Correction alternate until the query is valid or the cycles run out; the query runs, and an empty result triggers the relaxation pass, after which the result is returned "whether or not it is empty". A first-time success costs one LLM call; each failed cycle adds up to three (§3.2).
- **Three counterfactuals** (§6), each removing one mechanism: correction, bounded by no-refinement and the Baseline (§6.1); the hints' schema grounding, as naive retry on the 1,917 corrected pairs (model–query pairs that entered correction, pooled over the six models) (§6.2); sequential correction, as Best-of-3 (§6.3). Both alternatives get the same budget, a [compute-matched comparison](#/glossary/compute-matched-comparison).
- **Evaluation:** a paired [bootstrap](#/glossary/bootstrap-resampling) (Tab. 3); two one-sided tests (§6.2); a second judge, GPT-4o, on 500 stratified rows (sampled evenly across BLEU ranges), and one author's blind labels on 122 corrected queries (App. B).

## Results

- **Recovery** (Tab. 2; §5.2): LAST-CQ+DB recovers 91.7% of single-pass failures (per-model mean over 1,917). By error type, "pure syntax errors are never recovered" (App. C).
- **Removing correction** (Tab. 3; §6.1): aggregate GLEU is 12.3% above no-refinement (80.7% for Gemini 1.5 Flash; all p < 0.001) and 3.1% above single-pass; "The true value lies between these bounds".
- **Removing schema grounding** (Tab. 4; §6.2): naive retry reaches 19.9% exact match against LAST-CQ's 20.9% on the corrected pairs, and wins on DeepSeek. On the 214 paired queries the set-F1 difference is equivalent to zero within ±0.075 but not within ±0.05. Without the corrected queries whose reference is empty, naive retry leads on GLEU and, on the paired subset, on set-F1; the authors conclude that "once the forgiving cases go, schema-grounded feedback does not merely fail to assist; it provides no actionable guidance".
- **Sampling** (§6.3): Best-of-3 "underperforms even single-pass generation" for GPT-4o-mini and GPT-4o; the authors narrow this to "equal-budget sampling with a weak selector is a worse use of the budget than grounded sequential correction".
- **Metrics** (§7): over the 1,917 retained pairs, Google-BLEU exceeds set-F1 on 65.9%, and row order alone can lower set-identical results, so the BLEU ≥ 0.999 proxy understates order-invariant accuracy for every model; against the judge, BLEU is too harsh.
- **Judge calibration** (§7; Tab. 6): on the 122 blind-labelled queries the judge calls 74.6% at least partly correct against the human's 65.6%, a 9-point optimism "concentrated in over-use of PARTIAL"; corpus-level judged accuracy "should be read as an upper bound by roughly ten points".

## Limits the authors state

- A non-empty result "does not imply semantic correctness" (§3.2).
- One benchmark and engine: generalization to Memgraph, other engines or other schemas is untested, and no numerical comparison with Gusarov et al. is possible (Limitations); transfer to "a Memgraph pipeline with fuzzy entity re-grounding is an empirical question we do not settle here" (§2.2).
- Set metrics cover only the retained subsets, and the paired comparison "covers two of six backbones" (Limitations).
- Naive retry runs only on queries LAST-CQ chose to correct, so it "measures relative correction quality, not relative end-to-end system quality" (Limitations).
- The substituted Gemini rows are not comparable in absolute terms to Tab. 2 (Limitations).
- No-refinement re-scores a run and upper-bounds refinement's contribution (Limitations).
- Equivalence holds within the tested margin, on 214 queries from two backbones: "A real advantage smaller than that cannot be excluded" (Limitations).
- Best-of-3 varies temperature and selection together, with no intermediate-temperature sweep and the cheapest selector: "The claim is about equal-budget sampling as usually configured, not about sampling in principle" (Limitations; §6.3).
- One author labelled the calibration set, corrected queries on two backbones; it gives the direction and rough size of the judge's optimism, "not a corrected corpus-level number", and the judge never scored baseline outputs (Limitations).
- "The relaxation pass can therefore convert a correct empty answer into a scored-as-perfect wrong one", and "a benchmark with fewer empty references would test the loop more sharply" (Limitations).
- DeepSeek-Chat loses GLEU under the full pipeline (App. C traces it to schema normalization); size groupings rest on positioning and pricing; no budget sweep; no ablation of single relaxation hints, no "blind-retry arm with routing but no feedback content", no per-call token counts: "all three would sharpen the attribution and are the natural next experiments" (Limitations).
- On the parser's LLM fallback: "Non-standard deployment schemas could still require it." (App. C).

## Open problems and building blocks

- **Open:** "expand the evaluation metrics using AST canonicalization and tree-matching, SMT-based checks, and validate semantics beyond surface results" (§9) (glossary: [AST](#/glossary/abstract-syntax-tree-ast), [SMT solvers](#/glossary/sat-and-smt-solvers)), leaving "AST or graph-pattern equivalence to future work" (§7); compare fine-tuned models on the benchmark, and study "latency and cost impact at large scale across multiple graph database engines" (§9).
- **Released:** Nothing stated.
- **To reuse it:** the counterfactual design "needs only a validator, an executor and a correction step" (Limitations); LAST-CQ+DB needs the schema and a live database (§4); derived LLM calls per query run from about 1.1 (Claude) to 2.5 (Gemini Flash) (§3.2).
- **Beyond its domain:** "Three claims follow for any agent acting on a verifiable execution environment": "Invest in the detector and the router, not the feedback generator"; "Sampling is not a substitute for grounded verification in low-entropy output spaces"; "Evaluation must state its invariances" (§8).

## On this site

- **Discussed in:** [Checking a program written from English, in any DSL](#/challenges/dsl_intent_verification) · [Weak checkers get exploited](#/challenges/weak_checker_exploitation)
- **Tags:** <span class="tags"><a class="tag" href="#/tags/compact">compact</a><a class="tag" href="#/tags/dsl">dsl</a><a class="tag" href="#/tags/labels">labels</a><a class="tag sub" href="#/tags/harness-general">harness-general</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/scaling-general">scaling-general</a></span>
