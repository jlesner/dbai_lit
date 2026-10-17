# Diagnosing and Addressing Pitfalls in KG-RAG Datasets: Toward More Reliable Benchmarking

**Diagnosing and Addressing Pitfalls…** · NeurIPS 2025 Datasets and Benchmarks Track

Read: [PDF](https://arxiv.org/pdf/2505.23495) · [arXiv](https://arxiv.org/abs/2505.23495)  
Code: [KGQAGen](https://github.com/liangliang6v6/KGQAGen)

<p class="notice">A summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- A manual audit of sampled question–answer pairs from 16 knowledge-graph question-answering (KGQA) benchmarks, WebQSP and CWQ among them, for wrong, outdated or incomplete answers and ambiguous, trivial or unanswerable questions (§3.1, Tab. 1; App. B.3); then KGQAGen, a pipeline that writes questions over Wikidata, the 10,787-question KGQAGen-10k built with it (§5), and an evaluation of LLMs and KG-RAG systems on it (§6, Tab. 2).
- GPT-4.1 grows a subgraph from a seed entity (Wikipedia's Vital Articles) one sampled hop at a time until it judges the subgraph sufficient for a question of at least two hops, then writes the question, the answer set, the supporting triples and a SPARQL query; the query is run on Wikidata and the instance kept only if the result matches the answer set, after up to three GPT-4o-mini revisions of the query (§4.1–4.3). Answers are scored by exact match and by LASM, a GPT-4o-mini judge called only when exact match fails (§6; App. G.2).
- Benchmark labels audited by hand, then replaced by labels that a query engine backs, in a DSL other than SQL (<a class="tag" href="#/tags/labels">labels</a>, <a class="tag" href="#/tags/dsl">dsl</a>): the authors report an average factual correctness of 57% across the 16 audited datasets (abstract; §1), and their own case study says the SPARQL check accepted hallucinated, incomplete and self-answering items, since it "only checks that the SPARQL query returns at least one result overlapping the proposed answer set" (App. F.2; §4.3 states an equality rule).

## In plain words

Knowledge-graph question answering (KGQA) benchmarks pair a question with the answer stored in a knowledge graph, a large database of facts. The authors say that "little attention has been paid to the quality and reliability of these benchmarks themselves" (§1). They checked by hand over 1,000 sampled question–answer pairs from 16 popular datasets and report an average correctness of only 57%, with 52% for WebQSP (WebQuestionsSP) and 49.3% for CWQ (ComplexWebQuestions), the two most used (abstract; §1). They then built KGQAGen, a pipeline in which an LLM explores Wikidata (a public knowledge graph), writes a question with its answers and a database query, and keeps the question only if running the query on Wikidata returns matching answers (§4). In a hand check of 300 of its 10,787 questions, 96.3% were correct (§5). Strong LLMs and retrieval systems score only moderately on it, and GPT-4o does far better when given the facts behind each answer (scored with an LLM-assisted match), which, the authors say, suggests that retrieval is a major bottleneck (§6). They present the work as three contributions, an audit, a framework and a dataset (§1), not as a first.

## Background and terms

**Terms to know:** [retrieval-augmented generation (RAG)](#/glossary/retrieval-augmented-generation-rag) (here the retrieved context is knowledge-graph facts, not text passages) · [exact match](#/glossary/exact-match) · [F1 score](#/glossary/f1-score) · [LLM-as-a-judge](#/glossary/llm-as-a-judge) · [label noise](#/glossary/label-noise) · [knowledge graph](#/glossary/knowledge-graph) (as triples, §4 "Notations", Fig. 1; KGQA answers questions from one, App. B.3; SPARQL, [SPARQL 1.1 Query Language](#/papers/harris2013sparql "SPARQL 1.1 Query Language (2013)"); the audited datasets use Wikidata, Freebase (unmaintained since 2016, §2; App. A.2), DBpedia and YAGO, Tab. 1, App. B.1) · [Hit@1](#/glossary/hit1) (App. G.3)

**The paper's own terms:**
- **KG-RAG**: systems that "combine symbolic retrieval with generative reasoning" (§1): they add retrieved triples, symbolic paths (chains of relations) or "topology-aware context" (context reflecting the graph's structure) from a knowledge graph to an LLM's input (§6 "Evaluated Models").
- **Hop**: one step from an entity to a neighbour along a fact; questions must "involve at least two-hop reasoning" (§4.2.2).
- **Seed entity and seed subgraph**: the starting entity, drawn from Wikipedia's Vital Articles (a curated list of important topics), and a sample of a fixed number of its direct neighbours, "e.g. 15" (§4.1).
- **Sufficiency check and Exploration Set**: at each round the LLM judges whether the subgraph can support a well-formed question of at least two hops, and if not names the entities to expand next, the Exploration Set (§4.2.1).
- **Supporting subgraph**: "the minimal set of facts needed to justify the answer", output with each question (§4.2.2).
- **Correctness (%)**: Tab. 1's per-dataset rate from the audit, which judged (1) the factual correctness of the annotated answer, (2) the clarity and appropriateness of the question, and (3) the faithfulness of the supporting SPARQL, where available (App. B.3); §3.1 names the third as exact-match shortcomings instead.
- **LASM** (LLM-Assisted Semantic Match): a scoring rule that falls back to a GPT-4o-mini judge of semantic equivalence "only when a prediction fails the exact match" (§6; App. G.2).
- **LLM-SP**: an LLM given the question's supporting subgraph as input, to "simulate perfect retrieval" (§6).

**Missing glossary terms:** none.

**Builds on:**
- WebQSP [73] and CWQ [58], Freebase benchmarks the authors call the dominant ones in recent KG-RAG research (§1), listed with the KG-RAG models that use them in App. B.2, Tab. 3.
- Automatic generators it contrasts itself with, such as Maestro [43] (rule-based) and Dynamic-KGQA [10], which "employed LLMs to adaptively generate QA instances from YAGO 4.5, but faced challenges from KG sparsity and hallucinated outputs" (§2).
- DyVal [81] (a framework for dynamically generated reasoning tests of LLMs), whose graph metrics it uses to measure the supporting subgraphs' structure (§5; App. F.1).
- The KG-RAG systems RoG [33] and GCR [34], fine-tuned to generate relation paths (GCR under constrained decoding), and ToG [57] and PoG [9], prompted agents that explore the KG: evaluated as baselines, adapted to Wikidata (§6; App. G.1, G.3).

## Problem and setting

- **Questions:** how reliable are the labels and questions of existing KGQA benchmarks, and can a pipeline produce questions that are "challenging and verifiable" (abstract)?
- **The audit:** 100 WebQSP and 300 CWQ test examples and 60 from each other dataset, sampled at random; each item reviewed independently by two annotators "with KGQA expertise", disagreements resolved by discussion (App. B.3; §3.1). Outdated answers, facts "no longer valid according to up-to-date knowledge", count as inaccurate (§3.1.1). How the three judged dimensions combine into Tab. 1's single rate is not discussed.
- **KGQAGen's setting:** Wikidata, from the latest dump, accessed April 2, 2025 (§5); 16,000 seed entities from the Level-5 Vital Articles (the list's largest, most detailed level) (§5). The 300-item audit follows the same protocol as §3 (§5).
- **The benchmark:** split into training, development and test sets (§6). Exact match compares answer sets "after basic normalization, which includes lowercasing and alphabetically sorting answers" (App. G.3). Plain LLMs answer zero-shot from the question alone (§6; App. G.1).

## Approach

**The audit (§3).** Three kinds of wrong ground truth: incorrect annotations (such as a year as the answer to a "where" question), outdated answers, and incomplete answer sets (§3.1.1). Three kinds of poor question: ambiguous, low-complexity (shallow one-hop retrieval or string matching), and unanswerable or subjective (§3.1.2). And exact-match scoring that rejects correct answers in another form (§3.2); examples per dataset in App. C.

**KGQAGen (§4, Fig. 1)**, in three stages:
1. **Seed subgraph** (§4.1): a seed entity and a sample of its neighbours.
2. **LLM-guided expansion and generation** (§4.2): GPT-4.1, with one prompt (App. D.1), checks sufficiency; if the subgraph is insufficient, each entity in the Exploration Set gets a small random sample of neighbours (e.g., 10–15) added (§4.2.1). Once the subgraph is sufficient, the LLM outputs the question, the answer set, the supporting subgraph and a SPARQL query, "generated jointly" (§4.2.2). The prompt also asks that the answer "cannot be derived from general knowledge alone" (App. D.1).
3. **Answer validation** (§4.3): the SPARQL query is run on the KG, and the instance is accepted when the query's result set equals the LLM's answer set. Otherwise GPT-4o-mini revises the query, "for up to three attempts", and the instance is discarded if no revision matches. Because each question keeps its query, "the dataset can be periodically revalidated as the KG evolves" (§4.3).

## Results

**The audit** (§3.1, Tab. 1): the 57% average (abstract; §1) and the WebQSP and CWQ rates above. FreebaseQA (trivia questions over Freebase) scores high on correctness, but GPT-4o answers most of its questions without the KG, which the authors take to show it "does not present a sufficient reasoning challenge" (§3.1.2).

**KGQAGen-10k** (§5):
- 15,451 questions generated, 10,787 kept after validation (§5).
- 289 of 300 audited items (96.3%) correct (§5). The 11 defects are self-answering questions, hallucinated or incomplete relations accepted by the check, and Wikidata's own typing and labelling errors (App. F.2, Tab. 6).

**Benchmark** (§6, Tab. 2; accuracy, Hit@1, F1, precision and recall, under exact match and LASM):
- GPT-4.1 and the KG-RAG systems GCR and PoG "achieve only moderate performance"; KG-RAG systems beat their own LLM backbones, but "the overall improvement remains moderate" (§6).
- LASM scores every model higher than exact match (§6). In 100 sampled cases where LASM was used, two reviewers found one false positive (App. G.2).
- Given the supporting subgraph, GPT-4o's LASM accuracy rises from 54.2% to 84.9%, and LLaMA-2-7B with it outscores "all other larger LLMs" (§6).
- Hit@1 on KGQAGen-10k falls sharply against the WebQSP and CWQ results the four KG-RAG systems' own papers report; those two columns are copied from the original papers, not rerun (§6; App. G.3, Tab. 8).

**Ablation** (App. E, Tab. 4; 100 seeds): random subgraphs in place of LLM-guided expansion, and GPT-4o-mini or LLaMA-3-70B in place of GPT-4.1, each yield fewer fully validated questions. Among 420 instances the SPARQL stage removed, the main error types were empty results, very large answer sets and answers missing from the results (App. E).

## Limits the authors state

- KGQAGen "relies on the availability and accuracy of the underlying KG (e.g., Wikidata). Errors or gaps in the KG can limit the quality of generated questions" (§7).
- "although we mitigate hallucination risks via symbolic verification, the quality of subgraph selection and question phrasing may still be influenced by LLM variability" (§7).
- The check "does not detect leakage of lexical answers, does not require precise predicate alignment, does not check the joint coherence of query constraints, and does not validate type or label accuracy within the knowledge graph" (predicate alignment: the query using the relation the question means) (App. F.2); "Since the verifier stops when it finds a match, it does not detect incompleteness", and the pipeline "implicitly treats Wikidata typing and labeling as authoritative" (App. F.2). They plan a lexical filter, stricter predicate and type constraints, "answer completeness audits through closure tests" (checks that no valid answer is missing), and cross-checks against other KG snapshots (App. F.2).
- Smaller generator models "frequently simplify multi-hop reasoning to single-hop relations or omit relational constraints" (App. E).
- LASM is used only after exact match fails, which "mitigates potential risks of LLM-based scoring such as hallucinations or factual drift" (App. G.2).

## Open problems and building blocks

  - The results "suggest that retrieval remains a major bottleneck limiting current KG-RAG systems", and that their retrieval components "are still suboptimal and warrant further enhancement" (§6); "the need for better retrieval and reasoning mechanisms" (§7).
  - "Future work will strengthen the validation module with tighter constraints, clarification prompts, and finer-grained error classification" (App. E).
- **Released:** the KGQAGen code and the KGQAGen-10k dataset (abstract, footnote); per-dataset audit breakdowns and annotated examples "in the supplementary materials at the shared repository" (App. C.1, footnote).
- **To reuse it:** a Wikidata copy or the public Wikidata SPARQL endpoint (§5; App. D.2); GPT-4.1 as generator (§4.2.1) and GPT-4o-mini for query revision and LASM (§4.3; §6). The authors say the framework "can be readily extended to generate substantially larger datasets across diverse knowledge domains" with "minimal human effort" (§5).

## On this site

- **Discussed in:** [Benchmarks with checkable ground truth](#/challenges/checkable_benchmark_ground_truth) · [Checking a program written from English, in any DSL](#/challenges/dsl_intent_verification)
- **Tags:** <span class="tags"><a class="tag" href="#/tags/compact">compact</a><a class="tag" href="#/tags/dsl">dsl</a><a class="tag" href="#/tags/labels">labels</a><a class="tag sub" href="#/tags/harness-general">harness-general</a><a class="tag sub" href="#/tags/llm-assist">llm-assist</a><a class="tag sub" href="#/tags/llm-method">llm-method</a></span>
