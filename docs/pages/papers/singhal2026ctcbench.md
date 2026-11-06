# No More Free Lunch: Corpus Task Complexity Matters as Corpora Grow

**No More Free Lunch** · preprint 2026

Read: [PDF](https://arxiv.org/pdf/2609.29245) · [arXiv](https://arxiv.org/abs/2609.29245)  
Code: [corpustaskcomplexity](https://github.com/PrasannS/corpustaskcomplexity)

<p class="notice">A summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Defines corpus task complexity (CTC), how the number of calls to a small-context oracle needed to solve a task grows with corpus size; classes 12 retrieval and long-context tasks as growing linearly ("low CTC") and adds 10 that grow quadratically or faster ("high CTC", such as finding all contradicting claim pairs, matching questions to documents, rarest-topic outliers, reordering), the 22-task CTC-Bench (abstract; §2, Tab. 1).
- Fine-tunes Qwen3.5-4B on each task at 2k–32k tokens and compares full with block-sparse attention (trained with the authors' mask-mixing), OLMo-3-7B with its hybrid variant, and 64k and 128k inputs after training to 32k (§3–4); then other model families and scales, and how hard each oracle call is (§5).
- An input-size dial on in-context tasks scored by program against gold answers, split by how the work grows with the data, with no program or engine arm: the authors report average full-attention scores falling 0.910 → 0.788 on low-CTC tasks but 0.851 → 0.511 on high-CTC tasks from 2k to 32k tokens (§3), though two tasks have no 32k rung and Fig. 1's 32k averages aren't the mean of its 32k points. The pairwise tasks are the text arm's hard case for [Reliability that holds with size, by handing the procedure to an engine](#/challenges/engine_offloading_with_size), and the authors' argument that agents enumerating pairs "may require generating on the order of N² tokens per query" (§6) bears on Recursive context offloading.

## In plain words

Long-context models do well on many existing benchmarks, but the authors argue it is unclear whether that holds for harder questions over large document collections (§1). They propose that difficulty depends on how the work grows with collection size: finding a fact means checking each document once, finding all contradicting claims means checking every pair (abstract). They call this corpus task complexity, observe that prior work has largely studied only linearly growing tasks, and build 10 tasks that grow quadratically or faster, released with 12 linear ones as the 22-task CTC-Bench (abstract). With Qwen3.5-4B (an open 4-billion-parameter model) fine-tuned per task, average scores fell from 0.910 to 0.788 on linear tasks but from 0.851 to 0.511 on the others as inputs grew from 2k to 32k tokens (§3). Cheaper attention schemes (attending within each document, or mixing in recurrent layers), which "consistently match" full attention on linear tasks, "degrade much more" on the others (abstract). The authors call themselves, "To our knowledge", "the first" to connect task complexity to architectural decisions, but not the first to propose such tasks (§6).

## Background and terms

**Terms to know:** [needle in a haystack (NIAH)](#/glossary/needle-in-a-haystack-niah) · [F1 score](#/glossary/f1-score) · [Kendall's tau](#/glossary/kendalls-tau) · [BM25](#/glossary/bm25) · [multi-hop question answering](#/glossary/multi-hop-question-answering) · [continual pre-training](#/glossary/continual-pre-training) · [long-context language model (LCLM)](#/glossary/long-context-language-model-lclm) (§1) · [full and block-sparse attention](#/glossary/full-and-block-sparse-attention) (§4.1) · [hybrid architecture](#/glossary/hybrid-architecture-attention-and-recurrent-layers) (gated delta net (GDN) layers mixed with full attention, §4.2; in Qwen3.5, 75% of layers are GDN, so block-sparse attention applies only to the other 25%, §4.1 footnote 3) · [length generalization](#/glossary/length-generalization) (§1, §4.3)

**The paper's own terms:**
- **corpus reasoning tasks**: questions over a collection (corpus) of N documents, from factoid lookups to tasks needing "extensive cross-document interaction" (§1, §2.1).
- **oracle**: a helper, "e.g. an LM-judge", that answers a question about a small piece of the corpus (§2.1).
- **corpus task complexity (CTC)**: "the asymptotic growth in oracle calls needed to solve tasks as a function of corpus size N", for the algorithm with the fewest calls (§2.1). Written O_T(N) for linear growth, O_T(N²) for quadratic, O_T(NM) when each document is compared with one document from each of M categories (§2.3 (f)). Since proving the best algorithm "can be challenging", tasks are classed by "candidate" best algorithms (§2.1). CTC is not a task's online or offline running cost (§2.1, footnote 1). **Low-CTC** tasks grow linearly; **high-CTC** ones "quadratically or more" (abstract).
- **mask-mixing**: in block-sparse training, each batch uses the full-attention mask with probability p, lowered from 0.8 to 0 over training; evaluation always uses the block-sparse mask (§4.1; App. F).
- **CTC-Bench-10**: the 10-task subset used in §4.1–4.3 (§4.1).

**Builds on:**
- The block-sparse attention implementation of Xiao et al. (2025) (§4.1).
- OLMo-3-7B (Ettinger et al., 2025), an open 7-billion-parameter model, and OLMo-3-7B-Hybrid (Merrill et al., 2026), "the closest open-weight comparison between hybrid and full architectures" (§4.2).
- Existing benchmarks for the linear side, such as the retrieval collection BEIR (Thakur et al., 2021), the aggregation benchmark OOLONG (Bertsch et al., 2025; [Oolong](#/papers/bertsch2025oolong "Oolong: Evaluating Long Context Reasoning and Aggregation Capabilities (2026)")) and AbsenceBench (Fu et al., 2025), which asks what was deleted from a text (§2.2).
- Zhang et al. (2025), Recursive Language Models (a scaffold where a model calls itself on input parts) ([RLM (Recursive Language Models)](#/papers/zhang2025rlm "Recursive Language Models (2025)")), "which informally mentions a notion of task complexity related to CTC" (§6).

## Problem and setting

- **Questions:** "How challenging do high-CTC tasks become as corpus size grows?" (§3), and do cheaper architectures' "free lunches" hold there (§4, §5).
- **Tasks:** 12 low-CTC tasks, such as retrieval, reranking, aggregation and finding deletions from an aligned copy, and 10 high-CTC ones: Contradiction (find 3 planted contradicting claim pairs among PubMed sentences), X-Absence (unmatched chunks between two shuffled near-identical corpora), QDmatch on three retrieval sets (pair questions with answering documents), Outlier (scale M) (chunks of the rarest of many Wikipedia articles), Grouping (cluster abstracts), Strmatch (word strings sharing a run of words, "a synthetic control"), Reorder (restore shuffled segments) and Textgroups (triples whose word counts sum to a target) (§2.2–2.3, Tab. 1). NIAH-contra (find the one claim contradicting a given claim) (App. C.2.1) and Outlier (fixed M) (§2.3 (f)) are low-CTC controls for two of them. The authors often use synthetic or semi-synthetic tasks "for controllability", designed to "structurally resemble realistic tasks" (§2.3, footnote 2).
- **Models and training:** Qwen3.5-4B is fully fine-tuned on each task at 2k–32k tokens, with in-domain data, except OBLIQ's synthetic set, "to isolate architectural limits independent of data and generalization" (§3): 1 epoch on 20,000 examples split over five lengths, except OBLIQ and SciFact (retrieval sets with too little training data) (§3; App. C.1).
- **Correctness:** answers are scored by program against planted or existing gold labels, with metrics such as F1 over gold document IDs or pairs, Kendall-τ for Reorder, [MRR@10](#/glossary/recallk-and-mean-reciprocal-rank-mrr) for reranking and partial credit for OOLONG (App. C.2, Tab. 3).
- **Scope:** architectures that read the whole corpus at once, not agent scaffolds, which the authors argue are intractable for high-complexity tasks: enumerating contradictions "may require generating on the order of" N² "tokens per query" (§6).

## Approach

- **Classifying tasks (§2.1–2.2):** for each task the authors name an oracle call and a candidate algorithm and count calls: retrieval checks each document once, multi-hop retrieval needs "a constant number of passes", fixed-label aggregation typically one classification pass; the 12 existing tasks "all fall into" O_T(N) (§2.2). checking all pairs for contradictions "will generally require quadratic oracle calls", O_T(N²) (§2.1, Fig. 2); Textgroups triples, O_T(N³) (§2.3 (j)).
- **Building the tasks:** a fixed query set typically gets more distractors as the length budget grows (App. C.1); NQ (NaturalQuestions, factoid questions), for example, mixes gold passages with BM25 hard negatives (distractors that look relevant) and random filler (App. C.2.1); in Contradiction, Qwen3-14B-Instruct writes one sentence of each planted pair (App. C.2.3).
- **Comparisons:** full against block-sparse attention, trained with what the authors call "a new mask-mixing technique" (§4.1); OLMo-3-7B, adapted from sliding-window attention (each token sees only nearby tokens) to full attention with "a 100M-token continued-pretraining phase", against its hybrid (§4.2); length generalization (§4.3); three model families and Qwen3.5 at 0.8B, 2B and 4B on HotpotQA (multi-hop retrieval) and Contradiction (§5.1); and, for four linear tasks paired with their quadratic versions, the ratio of their scores as context grows, under block-sparse attention (§5.2).

## Results

All are the authors' reports.
- **Scaling with full attention (§3; Fig. 1, Fig. 3):** average scores fell 0.910 → 0.788 on low-CTC and 0.851 → 0.511 on high-CTC tasks from 2k to 32k; 10 of 12 low-CTC tasks lose less than 0.1, while 7 of 10 high-CTC tasks lose more. "In aggregate, even with in-distribution training", high-complexity difficulty "grows much faster on larger corpora".
- **Mask-mixing (§4.1; Fig. 5 left):** averaged over 2k–32k on CTC-Bench-10, it raises block-sparse scores over block-sparse training without mixing by +0.274 on low-CTC and +0.448 on high-CTC tasks on average; it "helps less" on retrieval settings such as FiQA (financial question answering) and NQ.
- **Block-sparse against full (§4.1; Fig. 1 right, Fig. 3):** on low-CTC tasks the gap is "negligible for all tasks"; on every high-CTC task block-sparse is worse, and the gap "monotonically grows at longer contexts" unless both scores approach zero (e.g. Textgroups, Reorder). Averaged over high-CTC tasks, block-sparse loses 26.9% at 2k, rising to 65.9% at 32k.
- **Hybrid against full (§4.2; Fig. 4):** the hybrid "often" matches full attention on low-CTC tasks ("in fact doing better at 32k") but "leads to large degradation" on high-CTC tasks; the gap varies by task.
- **Length generalization (§4.3; Fig. 5 right):** high-CTC tasks "May Generalize Worse" (CTC-Bench-10, full attention, trained to 32k, within the model's native context): at 128k, low-CTC tasks keep 28%–100% of their 32k score and high-CTC tasks 4%–14%; "all high-CTC points fall below low-CTC points".
- **Families and scales (§5.1; Fig. 6 left, App. E):** in every family and scale, block-sparse costs little on HotpotQA but much on Contradiction; smaller Qwen3.5 models degrade faster; some high-CTC tasks "have minimum model scales necessary to learn effectively" (App. E.1, Fig. 7).
- **Oracle difficulty (§5.2; Fig. 6 right):** the gap between each quadratic task and its linear partner grows with length, ordered by how hard the oracle call is; the authors suggest short-context gaps "may provide bounds on, or even predict" degradation at longer contexts and higher CTC classes.

## Limits the authors state

- Hypotheses are supported "up to 32k tokens in-domain (128k tokens in our length generalization experiments)"; "due to compute limitations" nothing beyond 128k is examined (App. A).
- "there are still likely several low-CTC and high-CTC tasks our suite misses" (App. A).
- The work "only take initial steps towards solving" high-CTC tasks (App. A).
- CTC is assigned from candidate algorithms, not proven optimal ones (§2.1); same-CTC tasks can differ "in a constant sense", and such differences "may even multiply at higher CTC" (§2.1).
- Contradiction: "subtle LLM-generated annotation artifacts likely make this version of the task much easier than more realistic versions of contradiction search, which we encourage future work to investigate" (App. C.2.3).
- X-Absence uses exact copies and "could be made more challenging with paraphrasing" (App. C.2.3); QDmatch has "no hard negatives" (App. C.2.3).
- OBLIQ's synthetic training data "is very initial" (App. C.2.1).
- Hybrid results "are affected by OLMo models being generally weaker than Qwen3.5" (§4.2).

## Open problems and building blocks

- **Open:** "Large-corpus high-CTC reasoning thus remains an open challenge as full attention is too costly to scale" (abstract); the authors "encourage more research into scalable architectures that can handle both low and high-CTC tasks" (§1). The "conundrum": full attention is too costly, but many choices that make long-context models tractable degrade high-CTC tasks; they find it "likely that this issue may become even more pronounced at larger corpus scales (e.g. 1 million+ tokens)" (§4.3). Realistic benchmarks for high-CTC applications (such as contradictions across scientific literature, or comparing corpora) and architectures for them are "valuable future directions" (App. B).
- **Released:** "our code, data, and 22-task suite (CTC-Bench)" (abstract; also §1).
- **To reuse it:** per-task full fine-tuning with olmo-core (AI2's training library) (App. F); a modified vLLM (an LLM serving engine) for block-sparse inference (App. D); "roughly 3k A100 hours and 1k H200 hours" for the study; they expect "under 500 hours" on 8×H100 to reproduce Fig. 3 (App. G). Data code "supports up to 10M tokens for several tasks" (App. C.1).

## On this site

- **Tags:** <span class="tags"><a class="tag" href="#/tags/benchmark">benchmark</a><a class="tag" href="#/tags/gym">gym</a><a class="tag" href="#/tags/llm">llm</a><a class="tag" href="#/tags/longctx">longctx</a><a class="tag" href="#/tags/nl">nl</a><a class="tag" href="#/tags/study">study</a></span>
