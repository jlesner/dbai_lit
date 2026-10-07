# Rango: Adaptive Retrieval-Augmented Proving for Automated Software Verification

**Rango** · ICSE 2025

Read: [PDF](https://arxiv.org/pdf/2412.14063) · [arXiv](https://arxiv.org/abs/2412.14063) · [DOI](https://doi.org/10.1109/ICSE55347.2025.00161)  
Code: [coq-modeling](https://github.com/rkthomps/coq-modeling)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Coq proof synthesis for software verification with a fine-tuned LLM that retrieves relevant premises and similar proofs from the current project at every step (abstract).
- Introduces CoqStoq, theorems mined from open-source Coq projects with a curated evaluation benchmark (abstract).
- Retrieval of proofs from the same project; the authors report that adding relevant proofs raises the theorems proven by 47% over its variant without a proof retriever (abstract, §V-C), though putting just the lines preceding the theorem in context gives almost as much ("the margin is small", §V-E).

## In plain words

Proof assistants such as Coq let developers machine-check that software meets its specification, but writing the proofs "requires significant expertise and manual effort" (abstract). The authors build Rango, which writes Coq proofs step by step with a fine-tuned 1.3-billion-parameter code LLM (§V-A). Before every step it looks up, in the current project, the finished proofs most similar to the current goal and the lemmas (proved helper statements) that look relevant, and puts both in the prompt (§III). They also build CoqStoq, a dataset mined from GitHub Coq projects, with a held-out benchmark of 12 projects (§IV, Tab. I).

With 10 minutes per theorem, Rango proves 32.0% of the benchmark's theorems, which the authors report as 29% more than Tactician, a tool that reapplies steps from similar points of earlier proofs and which they call "the prior state-of-the-art tool" (abstract, Tab. II, §V-A). On a random 500-theorem subset, Rango proves 47% more theorems than a version without retrieved proofs (§V-C). They present the advance as improving on earlier retrieval, which supplied lemmas only, by "retrieving proofs in addition to lemmas" (§VII).

## Background and terms

**Terms to know:** [proof assistant](#/glossary/proof-assistant) · [tactic](#/glossary/tactic) · [retrieval-augmented generation (RAG)](#/glossary/retrieval-augmented-generation-rag) · [BM25](#/glossary/bm25) · [data contamination](#/glossary/data-contamination) · [LoRA (low-rank adaptation)](#/glossary/lora-low-rank-adaptation) · [TF-IDF](#/glossary/tf-idf) (the paper calls it a "sparse retrieval algorithm" without defining it, §III-B)

**The paper's own terms:**
- **proof state**: what Coq shows after each tactic, "the goals left to prove and the local context of assumptions"; the theorem is proven when no goals remain (§II). The **proof script** is the tactics written so far (§I).
- **premises**: what a proof can use, "such as lemmas and definitions" (abstract).
- **retrieval-augmented proving (RAP)**: RAG for proof synthesis, where "a separate search step retrieves relevant information for proving a given theorem" (§I).
- **proof bank / lemma bank**: the proofs, or lemma statements, from earlier in the current file or from the file's dependencies, only from the current project (§III-A, §III-B).
- **Rango-PRE, Rango-Hybrid**: Rango-PRE's only retrieval is **prefix retrieval**, the lines directly preceding the theorem; Rango-Hybrid alternates rollouts between Rango and Rango-PRE (§V-E).
- **ablation set**: a random subset of 500 benchmark theorems (§V-C).
- **inter-file split**: random files of all CoqStoq projects go to training, validation and test, unlike CoqStoq's own split, which holds out whole projects (§V-C).

**Builds on:**
- **Premise retrieval** (§I, §VI): LeanDojo ([LeanDojo](#/papers/yang2023leandojo "LeanDojo: Theorem Proving with Retrieval-Augmented Language Models (2023)")), which trains a model to choose the premises given to its tactic generator, and Magnushammer (for the Isabelle proof assistant), which adds a reranker.
- **Tactician and Graph2Tac**, "Most similar to our work" (§VI), compared in §V-B: Tactician finds similar proof states in a database by comparing identifier sets with k-nearest neighbours and applies their tactics; Graph2Tac uses graph neural networks to predict the next tactic and which definitions or lemmas to pass to it.
- **Baldur** ([Baldur](#/papers/first2023baldur "Baldur: Whole-Proof Generation and Repair with Large Language Models (2023)")), a whole-proof-generation LLM: Rango follows it in computing the training loss only over the target (§III-C), and Rango-PRE uses its context, the lines preceding a theorem (§VI).
- **Proverbot9001** (a Coq prover built from gated recurrent units and feed-forward networks, §V-B) as a baseline, and **CoqGym**, a benchmark used to evaluate previous tools (§IV).

## Problem and setting

- **Question:** does adding similar in-project proofs, chosen again at every step, to a fine-tuned LLM's context help it synthesize Coq proofs, and which of its parts matter (RQ1–RQ6, §V)?
- **Success:** "A proof attempt is correct if Coq determines that it has no errors and there are no more goals left to solve" (Fig. 1). Each attempt has a 10-minute timeout that excludes loading and compiling the file; sampling uses temperature 1.0 (§V-A).
- **Data** (§IV, Tab. I): all open-source GitHub repositories listing Coq as their primary language as of November 5th, 2023, keeping files that compile in Coq 8.18: 2,226 repositories, 196,929 theorems. The benchmark holds 12 projects with 10,396 theorems: the CoqGym projects that compile in Coq 8.18, CompCert (a formally verified C compiler, §I) and Coq-Community projects "committed to long-term maintenance". Training files whose theorem statement exactly matches a validation or benchmark one are dropped.
- **Contamination:** the benchmark projects predate the pretraining cutoff of the base LLM, DeepSeek-Coder 1.3B, so the authors add two projects created after it, Coq-BB5 and PnVRocqLib (§V-B, §V-H).
- **Baselines** (§V-B): Rango gets one RTX 2080 GPU for inference (§V-A); Tactician and Proverbot, not built for GPUs, run on one CPU, and Proverbot uses depth limits instead of the timeout. Graph2Tac runs only in Coq 8.11, so it is compared on different versions of the 3 benchmark projects it was not directly trained on, for theorems whose statements match exactly.

## Approach

Rango has a **tactic generator** and a **searcher** (§III, Fig. 1).

- **Proof retriever (§III-A).** At every step it scores each proof in the proof bank by the highest BM-25 similarity between the current proof state and any proof state inside that proof, with identifiers as the "words", and keeps the k best.
- **Lemma retriever (§III-B).** It scores lemma statements (not their proofs) by TF-IDF against the current proof state and keeps the j best.
- **Language model (§III-C).** A fine-tuned decoder-only LLM reads the retrieved proofs and lemmas, the theorem and proof script so far, and the proof state, and generates the next tactic. Training examples are built "exactly as we would during inference", running both retrievers at every step. Each input has a token budget: whole proofs and lemmas are kept while they fit, and the longest suffix of the script and of the state.
- **Rollout search (§III-D).** A rollout samples a tactic, appends it and has Coq check the attempt: with no goals left the search succeeds; on an error a new rollout begins; otherwise the rollout samples another tactic. Rollouts repeat until a proof is found or time runs out.

## Results

- **Against other tools** (§V-B, Tab. II): on the 10,396 benchmark theorems, Rango proves 3,325 (32.0%), Tactician 2,575 (24.8%) and Proverbot 2,007 (19.3%), i.e. 29% and 66% more. On Graph2Tac's 496-theorem subset, Rango proves 276 against 265, 4% more, "Keeping differences between project versions in mind".
- **Combined** (§V-B, Tab. II): "each tool finds proofs for a significant subset of theorems where Rango could not find a proof".
- **After the cutoff** (§V-B, Tab. III): on 1,171 theorems of the two newer projects, Rango proves 352, Tactician 331, Proverbot 217 (6% and 62% more); on PnVRocqLib alone Tactician proves more.
- **Retriever ablation** (§V-C, Tab. IV, Fig. 4): on the ablation set, Rango proves 150, without lemma retrieval 145, without proof retrieval 102, without either 93; "retrieval-augmentation is essential to Rango's success", and proof retrieval contributes more than lemma retrieval.
- **In-project training** (§V-C, Tab. V): all variants prove more when trained on the inter-file split, those without proof retrieval most, which the authors read as the proof retriever capturing "a significant amount of the information that would be gained by training directly on files from the current project".
- **Retrieval algorithms** (§V-D, Tab. VI): on the full benchmark, BM-25 proves 46% more than dense retrieval (neural embeddings) with CodeBert, a 125M-parameter code model, and 1% more than TF-IDF; CodeBert embeddings "do not capture similarities between proof states that are relevant for proof retrieval".
- **Prefix retrieval** (§V-E, Tab. VII): Rango-PRE proves 31.3% against Rango's 32.0%: "while Rango proves more theorems than Rango-PRE, the margin is small". Rango-Hybrid proves 33.5%, reported as 4% more than Rango and 7% more than Rango-PRE, built on the hypothesis that when the needed context is close to the theorem, Rango-PRE "is preferable since it presents this context to the LLM as it was originally written".
- **Search** (§V-F, Tab. VIII): on the ablation set, rollout search proves more than best-first search (expanding the partial proof the model scores highest) with [beam search](#/glossary/beam-search) decoding or with temperature sampling: "Rollout search is a simple, yet effective technique for synthesizing proofs".
- **Proofs** (§V-G): for all three tools, success falls sharply with the length of the human-written proof (Fig. 5) and drops for files with many dependencies, where Rango still proves more (Fig. 6). On theorems all three prove, Rango's proofs have, on average, "similar or shorter lengths and smaller edit distances to human-written proofs" (string edit distance) than the others' (Tab. IX).

## Limits the authors state

- The benchmark predates the LLM's pretraining cutoff: "there is a risk that Rango's underlying LLM saw them during pre-training", mitigated by the two newer projects (§V-B, §V-H).
- "there are some differences in the Coq versions and machines used (CPU vs GPU)" (§V-H); with depth limits, "for most of the reported proofs, Proverbot fails before 10 minutes" (§V-B).
- Graph2Tac: only 3 projects, in versions for Coq 8.11; matching statements "does not guarantee that a proof in one project version will translate to a proof in the other project version"; no comparison on the newer projects, which don't compile with Coq 8.11 (§V-B).
- "One weakness of the rollout search is that it does not use previous proof attempts to inform subsequent proof attempts" (§V-F).
- The approach "could be implemented for other proof assistants, such as Isabelle and Lean", but "it is not known whether our results generalize across proof assistants", a direction for future work (§V-H).

## Open problems and building blocks

- **Open:** "It is likely that automatically generated proofs that are in a similar style to the proof engineer's hand-written proofs would be easier for them to repair and maintain, though future work should explore this" (§V-G.2). For a learned proof retriever, "at training time, there is no way to know which proofs satisfy this objective", so "standard supervised learning techniques are not applicable" (§V-D).
- **Released:** "We release Rango, CoqStoq, all trained models appearing in this paper, and all of the code required to reproduce the experiments in this paper" (§I).
- **To reuse it:** Coq 8.18 (§IV); DeepSeek-Coder 1.3B fine-tuned with LoRA for 60,000 steps on 4 NVIDIA A100 GPUs; at proof time one RTX 2080 GPU and one CPU with 16GB of RAM (§V-A).

## On this site

- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/harness-general">harness-general</a><a class="tag sub" href="#/tags/itp-general">itp-general</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/prove-general">prove-general</a><a class="tag sub" href="#/tags/prove-itp">prove-itp</a><a class="tag sub" href="#/tags/scaling-general">scaling-general</a></span>
