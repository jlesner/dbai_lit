# LeanDojo: Theorem Proving with Retrieval-Augmented Language Models

**LeanDojo** · NeurIPS 2023 (Datasets and Benchmarks)

Read: [PDF](https://arxiv.org/pdf/2306.15626) · [arXiv](https://arxiv.org/abs/2306.15626)  
Code: [LeanDojo](https://github.com/lean-dojo/LeanDojo) · [ReProver](https://github.com/lean-dojo/ReProver)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- An open toolkit that extracts proof data from Lean and lets programs interact with it, plus ReProver, a retrieval-augmented prover (abstract).
- Premise retrieval restricted to accessible premises and trained with hard negatives; a benchmark whose split needs premises never used in training (abstract).
- Open infrastructure for LLM provers in Lean; cited by [Logos](#/papers/ke2026logos "Logos: Certified Order-Sensitive SQL Rewrites with Mechanized Semantics and LLM Guidance (2026)") (§6).

## In plain words

A [proof assistant](#/glossary/proof-assistant) such as Lean checks every step of a formal proof, and LLMs can learn to write them. The authors say existing LLM provers "are difficult to reproduce or build on, due to private code, data, and large compute requirements" (abstract). They build LeanDojo, an open tool that pulls training data out of Lean, including which existing lemmas and definitions (premises) each proof step uses, and lets a program run proof steps and read Lean's answer (§1). With it they build a benchmark from Lean's math library, and ReProver, an inexpensive model that first looks up likely premises, then writes the next step (abstract).

With one attempt of at most ten minutes per theorem, ReProver proves 51.2% of the benchmark's randomly drawn test theorems, against 47.6% without the lookup and 29.0% for GPT-4 asked without examples (Tab. 2). On test theorems whose proofs use a premise never used in training, 26.3% against 23.2% and 7.4% (Tab. 2). The authors call their release "the first set of open-source LLM-based theorem provers without any proprietary datasets" (abstract).

## Background and terms

**Terms to know:** [proof assistant](#/glossary/proof-assistant) · [tactic](#/glossary/tactic) · [retrieval-augmented generation (RAG)](#/glossary/retrieval-augmented-generation-rag) · [contrastive learning](#/glossary/contrastive-learning) · [Recall@k and MRR](#/glossary/recallk-and-mean-reciprocal-rank-mrr) · [BM25](#/glossary/bm25) · [pass@k](#/glossary/passk) · [data contamination](#/glossary/data-contamination) · [premise selection](#/glossary/premise-selection) (the authors call it "a key bottleneck in theorem proving", §3) · [best-first search](#/glossary/best-first-search) (states are ranked "by the sum of log-likelihoods of tactics leading to that state", App. C.1) · [dense retrieval](#/glossary/dense-retrieval) (here the dense passage retriever, DPR, with cosine similarity as closeness, §5)

**The paper's own terms:**
- **Lean**: Lean 3 by default; Lean 4 "is not backward-compatible but is also supported by LeanDojo" (§1 footnote). **mathlib** is Lean's "centralized math library" (§4).
- **premise**: "existing lemmas or definitions useful for proving a theorem", "used as arguments in tactics" (§3).
- **accessible premises**: those "defined in the same file before the theorem, as well as those imported from other files" (§5); a proof cannot use others (§3).
- **proof state**: "a string representing current proof goals and local contexts" (§4); a proof tree has states as nodes and tactics as edges (Fig. 1).
- **name resolution**: Lean's step that turns short, possibly ambiguous premise names into full names before the kernel checks the proof (App. A.1).
- **in-file negatives**: wrong premises for training the retriever, sampled from those "defined in the same Lean source file as the ground truth premise" (§1).
- **`random` and `novel_premises` splits**: `novel_premises` "requires testing proofs to use at least one premise that has never been used in training" (§4).
- **Pass@1**: "The prover is given only one attempt and must find the proof within a wall time limit of 10 minutes" (§6); an attempt is a whole proof search, not one sample as in pass@k.
- **`tidy`**: a mathlib tactic "that tries to complete the proof using heuristics (without machine learning)" (§6).

**Builds on** (none is on this site):
- Dense Passage Retriever, Karpukhin et al. [26]: the retriever "builds upon" it (§1, §5).
- ByT5, Xue et al. [44]: an encoder-decoder Transformer that reads raw UTF-8 bytes; its `google/byt5-small` checkpoint starts both retriever and generator (App. C.1).
- `lean-gym`, Polu et al. [19], the earlier tool for running proof steps in Lean: "LeanDojo partially builds upon lean-gym's code" (App. A.3).
- The earlier Lean LLM provers of Han et al. [16], Polu et al. [19] and Lample et al. [17], which the paper discusses but does not run as baselines (§6, App. C.3).

## Problem and setting

- **Question:** can open, cheap tools and an explicit premise lookup give reproducible LLM provers in Lean that cope with premises unseen in training? Provers that memorize premise names do "not generalize to truly novel scenarios, e.g., theorems requiring lemmas unseen in training" (§1).
- **Data:** LeanDojo Benchmark, from a mathlib commit of October 11, 2023: 98,734 theorems, 130,262 premises, and per split 94,734 training, 2,000 validation and 2,000 test theorems (§4). LeanDojo Benchmark 4 does the same for Lean 4 (App. D).
- **Proofs:** tactic-style only, "sufficiently general since any proof can be converted to a tactic-style proof" (§4). A proof counts when Lean, run through LeanDojo, accepts it within the Pass@1 limit (§6). The modified Lean is used "only for data extraction but not for evaluation" (§4).
- **Premise selection** is scored only on tactics with at least one premise (§6).
- **Baselines:** `tidy`; GPT-4 asked zero-shot for 35 tactics per state, fed to best-first search (§6, App. C.2); ReProver without retrieval (Tab. 2).
- **Outside test sets:** MiniF2F (math olympiad problems) and ProofNet (undergraduate textbook exercises), with no training theorems (§6): an [out-of-distribution](#/glossary/out-of-distribution-generalization) test (App. C.4).

## Approach

- **Data extraction (§4, App. A.1).** LeanDojo builds the file-import graph and each file's [abstract syntax tree](#/glossary/abstract-syntax-tree-ast), records each tactic with its states before and after, and each premise's full name, definition site and uses. Lean cannot export the last, so the authors patch Lean to log name resolution.
- **Interaction (§4, App. A.2).** A "gym-like environment" (§4), the observe-act-feedback loop of [reinforcement learning](#/glossary/reinforcement-learning) tools: `initialize(theorem)` returns the first state; `run_tac(state, tactic)` returns the next state or an error. Where `lean-gym` "fails to handle namespaces correctly", LeanDojo "wraps the interaction code as a Lean tactic, which is inserted into the proof" (App. A.2).
- **Retriever (§5).** A ByT5 encoder (App. C.1), average-pooled, embeds states and premises; premises are ranked by cosine similarity, their vectors can be computed in advance. Training minimizes a mean squared loss between labels and similarities over premises shared across the batch (Eq. 1). Two changes to DPR: retrieve only accessible premises, and train with in-file negatives (3 negatives per example, 1 in-file; App. C.1).
- **Generator and search (§5, App. C.1).** The 100 retrieved premises are joined to the state and cut to 2,300 tokens; a ByT5 encoder-decoder learns human-written tactics. Per step, [beam search](#/glossary/beam-search) proposes 64 tactics, and best-first search assembles the proof. No reinforcement learning, auxiliary data or domain-specific pretraining (§2, §5).
- **ChatGPT plugin (App. E):** a demo exposing LeanDojo's two calls to ChatGPT.

## Results

- **Premise selection (Tab. 1).** The retriever beats BM25 "across the board" (§6), e.g. Recall@10 of 38.4 against 17.2 on `random`; both ablations (all premises; no in-file negatives) score lower. It shows "a large performance degradation" on `novel_premises` (§6).
- **Theorem proving (Tab. 2).** Pass@1 on `random`: ReProver 51.2, without retrieval 47.6, GPT-4 29.0, `tidy` 23.8; on `novel_premises`: 26.3, 23.2, 7.4, 5.3. GPT-4 does worse "even though it may have seen the ground truth proofs due to data contamination" (§6).
- **MiniF2F and ProofNet (§6, App. C.4).** MiniF2F test: 26.5% Pass@1, "competitive with state-of-the-art methods without RL", against 25.9% for Polu et al. [19] without RL and 29.6% with it; some had no Lean proof (Fig. B). ProofNet: 48 of 349 theorems (13.8%), "the first reported theorem proving result on ProofNet"; 39 of the 48 had no Lean proof, 3 of those "can only be proved with the help of premise retrieval" (Fig. D).
- **Interaction errors (App. A.2, Tab. A).** On Lean v3.42.1 with a mathlib version both tools support, `lean-gym` rejected 21.1% of correct human-written proofs and LeanDojo 1.4%, its failures "a subset of lean-gym's".
- **Lean 4 (Tab. C).** ReProver again beats its no-retrieval version on both splits.
- **ChatGPT (App. E).** It "failed to find a proof for most theorems we tried"; "Hallucination was common", once claiming a finished proof that LeanDojo reported unfinished (Fig. L).

## Limits the authors state

- "we err on the side of simplicity and efficiency, instead of pushing performance to the limit" (App. F).
- ByT5 "has 299M parameters, which is not very large by today's standard", and raw bytes make sequences "much longer than necessary" (App. F).
- "With a length limit of 2,300 tokens, we can fit only 10–15 premises into the input of the tactic generator" (App. F).
- Human-written proofs are "relatively scarce for today's data-hungry LLMs" and show only "the final successful trajectory"; "models trained on proofs in one project often struggle to generalize to theorems in new domains" (App. F).
- Earlier Lean LLM provers can't be compared: none "are open-source or can be reproduced with reasonable effort" (§6), and their numbers differ in data, tools and training (App. C.3); the MiniF2F comparison has "caveats" (App. C.4).
- GPT-4: "Data contamination is possible" (§6); the prompting "is quite naive" (App. F).
- LeanDojo still fails on some correct proofs (App. A.2). Extracted ASTs "contain a small number of errors", without "a tangible impact on our work" (App. B.2).
- The ChatGPT study "is exploratory", and "data contamination is likely" (App. E).

## Open problems and building blocks

  - Stronger open code LLMs (e.g., StarCoder), and a custom tokenizer or tokenizer-free models "such as MegaByte" (App. F).
  - Fusing retrieved premises "in the hidden space, e.g., Fusion-in-Decoder", or generative retrieval of premise names (App. F).
  - Better prompting such as Tree of Thoughts; theorem proving as "a promising task for studying LLMs' capabilities in planning and search" (App. F).
  - Learning from auxiliary data or from proofs the prover finds itself, which "may lead to substantial improvements" (App. F).
  - Results on challenging splits "should be emphasized in the future development of theorem proving" (§6).
  - A "more detailed and quantitative study" of ChatGPT as a prover (App. E).
- **Released:** LeanDojo's code and documentation, LeanDojo Benchmark and Benchmark 4, ReProver's code and models, the ChatGPT plugin (§7); provers under the MIT license (abstract), data under CC BY 2.0 (App. B.3).
- **To reuse it:** training takes five days on one A100 GPU with 80GB, evaluation two days on eight V100s (§6); `google/byt5-small` backbone (§5). The Lean patch applies to "any version of Lean 3 after March 24, 2022" (App. A.1); LeanDojo extracts data from any Lean 4 repo (App. D). Tactic-style proofs only (§4).

## On this site

- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/harness-general">harness-general</a><a class="tag sub" href="#/tags/itp-general">itp-general</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/scaling-general">scaling-general</a></span>
