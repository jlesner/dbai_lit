# GEqO: ML-Accelerated Semantic Equivalence Detection

**GEqO** · PACMMOD 1(4) (SIGMOD 2024) · 2023

Read: [PDF](https://arxiv.org/pdf/2401.01280) · [arXiv](https://arxiv.org/abs/2401.01280) · [DOI](https://doi.org/10.1145/3626710)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Detects semantically equivalent SPJ subexpressions, aiming at cloud-scale workloads, for computation reuse; evaluated only on synthetic TPC-H/TPC-DS workloads (§7).
- Cheap filters first (schema, embedding vector match, a learned equivalence classifier), then SPES verifies the survivors; the classifier is pre-trained on synthetic AMOEBA/WeTune pairs with unverified negatives (§5) and fine-tuned on SPES-labelled samples (§6, Alg. 1).
- The ML-judge pattern done soundly in design: the learned model only prunes, the prover decides "equivalent" (cf.

## In plain words

Analytics clusters run millions of jobs that often repeat computations; finding query parts that always return the same rows lets a system compute once and reuse them. The authors argue (§1) that this search must be automatic, scalable, and catch parts that look different but mean the same, and that formal provers, checking all pairs from one day of cloud jobs, "would require over a trillion expensive formal verifications". They build GEqO: cheap filters (grouping by tables read, a search for close learned embeddings, a trained neural classifier) discard most non-matching pairs before the prover SPES checks the rest. A name-free encoding lets the classifier move to new databases, and a feedback loop fine-tunes it on prover-checked samples when its confidence drops. On "TPC-DS-like queries" (TPC-DS: a synthetic decision-support benchmark), the abstract reports GEqO "up to 200× faster than automated verifiers" and finding "up to 2× more equivalences" than optimizer-based or syntax-signature detection. They call it, "as far as we are aware", "the first work to present a machine-learning-accelerated framework for detecting semantic equivalence at scale" (§1).

## Background and terms

**Terms to know:** [query equivalence](#/glossary/query-equivalence) · [logical plan](#/glossary/logical-plan) · [SAT and SMT solvers](#/glossary/sat-and-smt-solvers) · [soundness and completeness](#/glossary/soundness-and-completeness) · [set semantics](#/glossary/set-semantics) · [bag semantics](#/glossary/bag-semantics) · [query rewriting and rewrite rules](#/glossary/query-rewriting-and-rewrite-rules) · [F1 score](#/glossary/f1-score) · [query containment](#/glossary/query-containment) · [approximate nearest-neighbour search (ANNS)](#/glossary/approximate-nearest-neighbour-search-anns) · [materialized view](#/glossary/materialized-view)

**The paper's own terms:**
- **subexpression**: any subtree of a query's logical plan, the whole plan included (§2.1).
- **semantically equivalent**: same result on every database instance; the definition "holds under both set and bag semantics" (§2.1).
- **automated verifier (AV)**: a prover that decides equivalence. The paper assumes it is "correct but not complete" (an equivalence verdict is right, but some equivalent pairs go unproved) and that verifiers "in general run in exponential time" (§2.1).
- **equivalence filter**: a model or heuristic that decides equivalence only approximately (§2.1).
- **TPR, TNR**: the share of equivalent pairs a filter lets through, and of non-equivalent pairs it rejects (§1).
- **SF (schema filter)**: groups subexpressions by the tables they read and the number of columns they return; only pairs inside one group go on (§2.2.1).
- **VMF (vector matching filter)**: embeds each subexpression with the classifier's learned layers and keeps pairs closer than a threshold, found by approximate nearest-neighbour search (§2.2.1, Def. 2.1).
- **EMF (equivalence model filter)**: a neural classifier over a pair of encoded logical plans (§2.3, §5).
- **SSFL (semi-supervised feedback loop)**: when the EMF's confidence level (the share of pairs whose more likely answer reaches a probability threshold, Def. 6.1) falls too low, fine-tunes it on a new labelled sample (§2.3, §6).
- **SPJ subexpression**: one built only from selections (row filters), projections (column choice) and joins; GEqO covers these "with conjunctive predicates" (conditions joined by AND) (§1).
- **tree convolution**: neural layers that turn a plan tree of any shape into a fixed-size summary vector (§3.2).
- **instance-based encoding**: each plan node becomes one-hot segments over the workload's actual tables, columns, operators and join types, plus constants (§4.1, Fig. 3).
- **db-agnostic encoding**: a pair's tables and columns are first renamed to generic symbols (t1, c1, …), so the model learns patterns, not names (§4.2, Fig. 4, Table 2).

**Builds on:**
- SPES ([SPES](#/papers/zhou2020spes "SPES: A Symbolic Approach to Proving Query Equivalence Under Bag Semantics (2022)")), the SMT-based prover GEqO uses as its verifier and baseline (§2.2.1, §7.5).
- AMOEBA (Liu et al., ICSE 2022: fuzzed base queries plus semantics-preserving rewrites) and WeTune ([WeTune](#/papers/wang2022wetune "WeTune: Automatic Discovery and Verification of Query Rewrite Rules (2022)"), a rewrite-rule generator) to build training pairs (§5).
- Tree convolution (Mou et al.), in a transformation inspired by the learned optimizer Neo (§3.2); an encoding inspired by a learned containment-rate estimator (§4.1).
- Baselines: signature-based detection after Jindal et al. (matching syntax-tree hashes) and the Calcite optimizer ([Apache Calcite](#/papers/begoli2018calcite "Apache Calcite: A Foundational Framework for Optimized Query Processing Over Heterogeneous Data Sources (2018)")) as an equivalence check (§1, §7.5).

## Problem and setting

- **The question:** given a workload of subexpressions, approximate the set of all equivalent pairs in it (Problem "Workload equivalence", §2.1).
- **Fragment:** SPJ subexpressions with conjunctive predicates (§1); each multi-clause predicate in selections and joins is split into single-clause predicates (§3.1). The paper "does not consider database constraints or other instance-specific metadata" (§2.3), such as keys ([integrity constraint](#/glossary/integrity-constraint)). How NULLs affect equivalence is not discussed.
- **What counts as correct:** an output pair is one that every filter passes and the AV proves (§2.2). §1 says GEqO yields pairs that are equivalent "with perfect precision and near-perfect recall". In §7.5, "the equivalences admitted by the AV constitute ground truth".
- **Data:** subexpressions generated by AMOEBA with WeTune rules on the TPC-H and TPC-DS schemas (synthetic benchmarks): about 34k for TPC-DS and 19k for TPC-H (§7 "Workloads"). Initial training positives are rewrite pairs, equivalent by construction; negatives are random pairs inside one SF group (§5).

## Approach

- **The pipeline** (Eq. 1–2, §2.2, Fig. 2): filters run in "decreasing order of speed and increasing order of precision"; a pair any filter rejects stops there, and survivors go to SPES.
- **VMF** encodes each SF group with one shared db-agnostic encoding before the search (§4.2.2); the search uses an HNSW index (§2.2.1), a graph for fast approximate search.
- **Features** (§3.1): only logical plans; actual cardinalities (row counts of a subexpression's result) are "not generally available" and executing subexpressions for them is "infeasible at scale", while estimated ones "yield only marginal benefit".
- **Encodings** (§4): since a pair's symbols depend on both members, a converter turns per-subexpression instance encodings into pairwise db-agnostic ones instead of re-encoding each pair (§4.2.1).
- **EMF** (§5, Fig. 6): two tree-convolution layers per subexpression, summaries concatenated, three fully connected layers. It is chosen over logistic regression (LR) and random forests (RF) because those "do not allow incremental training and fine-tuning" (§5). The authors report that more than two layers did not improve accuracy (§5, Fig. 7).
- **SSFL** (§6, Alg. 1): score every pair with the EMF; if confidence is at or below the threshold, run SF and VMF to find likely-equivalent pairs, label them with the AV, add as many random pairs, and fine-tune, until confidence is high enough (§6).

## Results

- **Filters on one workload** (Table 1, §1; about 50k TPC-DS pairs with 50 equivalences): GEqO takes 3.1 s at TPR 0.93, against 898.5 s at TPR 1.00 for the AV row (the table assumes "a verifier with perfect recall"), and 1.0 s for a hypothetical oracle that passes only the equivalent pairs to the AV.
- **Classifier type** (§7.1.1, Table 3, Fig. 8; trained on TPC-H, tested on TPC-DS): the MLP (multi-layer perceptron, the type §5 picks for the EMF) reaches accuracy 0.970 against 0.592 for RF and 0.588 for LR.
- **Transfer** (§7.1.3, Table 4): on five random-schema datasets, the TPC-H-trained model shows what the authors call "high performance".
- **VMF** (§7.2, Table 5): it "is able to substantially reduce the search space".
- **SSFL** (§7.3, Fig. 9): starting from a model trained on TPC-H without joins and tested on TPC-DS, filter-based sampling "takes only ∼4k samples to improve model accuracy and F1 score to 90%", while with random sampling "the accuracy and F1 score remain extremely low". Within the loop, training time "quickly dominates" the runtime, while featurization, sampling and verification stay "modest" (Fig. 11).
- **End to end** (§7.5, Fig. 13; forty datasets of about 50k TPC-DS pairs with about 8–128 equivalent pairs, SSFL confidence assumed above threshold): GEqO "identifies nearly all the semantic equivalences", while Calcite and signatures "average far fewer"; SPES finds all, but its runtime is "more than 200×" the others'. GEqO's time per found equivalence is about the same as Calcite's and signatures' (Fig. 13(d)).
- **Ablation** (§7.6, Fig. 14; the 32-equivalence datasets): only all three filters together give the lowest runtime.
- **Result caching** (§7.7, Fig. 15; 100 GB TPC-DS, about 23k unique expressions, no updates): with a simulated policy that caches the most expensive queries, chosen from past runtime statistics, the authors report "a reduction of up to 61.5% in the total workload execution time" on "a modern commercial database system", with 10% of the storage budget.

## Limits the authors state

- "This work does not propose a novel view selection or rewriting algorithm" (§1, footnote 1).
- Verifiers are "correct but not complete" and "in general run in exponential time" (§2.1).
- Random negative pairs "might (with low probability) yield a false negative"; the authors call training "resilient to small amounts of noise" (§5).
- Filter-based sampling "is more expensive than random sampling" (§7.3).
- Encoding OR through DNF (disjunctive normal form: an OR of AND-clauses, each a union branch) "encounters scalability issues due to the exponential growth in the number of clauses" (§9.1).
- Containment under bag semantics is "far less understood" than under set semantics (§9.2).

## Open problems and building blocks

  - Extend GEqO beyond SPJ, to "unions, aggregation, and complex predicates", with sketched encodings, IN/OR scalability issues "we intend to investigate", and a check whether the EMF architecture needs changes (§9.1).
  - Containment: the authors "think the GEqO framework should be applicable"; a preliminary containment model lost accuracy as workloads grew more complex (e.g. more joins), and adapting the VMF's distance metric is left "as future work" (§9.2).
  - Database-specific constraints are "an interesting direction for future work" (§2.3).
  - Equality saturation (Peggy: rules enumerate equivalent forms into a compact graph) "could be leveraged" as an alternative verifier, though saturating every subexpression of a workload "is not scalable" (§8).
- **Released:** Nothing stated.
- **To reuse it:** Calcite 1.27.0 for parsing and featurization, PyTorch, the vector-search library FAISS, and SPES with Z3 as the verifier (§7 "Implementation", §2.4); a Tesla T4 GPU for GPU runs (§7 "Experimental Setup"); about 40 minutes to train (20 epochs, about 47k pairs), a 2.3 MB model, 3.19 ms per predicted pair (§7.1.2); the authors say it "can plug in any" equivalence verifier (§8).

## On this site

- **Discussed in:** [Canonical forms for queries](#/challenges/query_canonical_forms) · [Sourcing realistic, hard query pairs](#/challenges/query_pair_sourcing)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/judge-sql">judge-sql</a></span>
