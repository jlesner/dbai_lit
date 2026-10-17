# Mergeable Model-Side Aggregation States for Long-Context Language Models

**SketchOps** · preprint 2026

Read: [PDF](https://arxiv.org/pdf/2607.26448) · [arXiv](https://arxiv.org/abs/2607.26448)  
Code: [sketchops](https://github.com/songdc98/sketchops)

<p class="notice">A summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Keeps fixed-size HyperLogLog sketch states beside a frozen LLM for set-based aggregation over long inputs (distinct counts, union size, Jaccard similarity, containment, grouped distinct counts; a Count–Min state for point frequencies) and appends their readouts to the model's input as evidence for its final decision, without "an additional generate–execute–return cycle" (abstract; §4; App. D).
- Each record's canonical identity updates one register of its stream's state, and states built from separate segments merge by a registerwise maximum into the single-pass state (§4.1; App. C.2, Prop. 4); tested with Qwen3.6-35B-A3B and Gemma-4-31B-IT on aggregate-then-reason tasks built from Oolong-Synth's labelled records, against exact aggregates, full-context prompting (direct, chain of thought, guided choice) and model-written Python run in a sandbox (§5; App. E.3).
- Three ways to do one aggregation on tasks from one cohort (174 Oolong-Synth source windows), in context (174 matched tasks), by a fixed non-LLM procedure, and by model-written code that an interpreter runs (a 1,200-task subset): a data point for [Reliability that holds with size, by handing the procedure to an engine](#/challenges/engine_offloading_with_size). The authors report code execution at 100.0% on the 1,200 tasks for both models (§5.3, Tab. 3; App. E.1); the pipeline starts from released structured records with given identities, and the evaluation "does not evaluate extraction from raw prose" (App. E.1).

## In plain words

Long-context language models "tend to become increasingly unreliable" at set-based counting over many records (how many distinct users reported an error, how much two groups overlap) as inputs grow, the authors write, citing other work (abstract; §1). Model-written code can give exact answers but needs a separate generate–execute–return round trip; learned set encoders, they argue, lack predictable accuracy under a fixed memory budget (§1). They keep small fixed-size summaries beside a frozen model: each relevant record's identity updates a summary, summaries of separate input parts combine into exactly the summary of the whole, and an estimate from them is added to the model's input before it decides (abstract; §4). On 174 tasks from a public long-context benchmark, with Qwen 3.6 (35B) and Gemma 4 (31B), this beat the strongest full-context baseline by 60.9 and 56.3 percentage points, tasks over the 150K-token limit counting as wrong for the baselines (§5.2, Tab. 1). The tasks start from given structured records: the evaluation "does not evaluate extraction from raw prose" (App. E.1). The authors claim an interface, not a new algorithm: "the HLL sketch algorithm used in the paper is not new" (HLL: HyperLogLog, their summary method) (§1).

## Background and terms

**Terms to know:** [cluster bootstrap](#/glossary/clustered-standard-errors-and-cluster-bootstrap) · [paired comparison](#/glossary/paired-comparison) · [confidence interval](#/glossary/confidence-interval-and-coverage) · [KV cache](#/glossary/kv-cache) · [idempotent operation](#/glossary/idempotent-operation) · [program-of-thought](#/glossary/program-of-thought-and-tool-integrated-reasoning) · [coordinate ascent](#/glossary/coordinate-ascent) · [streaming sketch (HyperLogLog and Count-Min)](#/glossary/streaming-sketch-hyperloglog-and-count-min) (HLL: §4.1, App. C.1–C.3, relative error about 1.04/√m, §5.4; Count–Min: App. D) · [Jaccard similarity](#/glossary/jaccard-similarity) (and containment, App. B.2)

**The paper's own terms:**
- **identity-aware aggregation**: aggregation that depends on how item identities occur across records; the paper studies its **support-based** tasks, which depend only on which distinct identities occur: distinct counts, union and intersection sizes, overlap, Jaccard similarity, containment, and the same per group (§3).
- **extractor, canonical identity, stream**: the extractor picks relevant records, gives each a canonical identity (one fixed name per user or item) and an optional group key, and sorts them into one stream per operand of the request (§3).
- **model-side**: states are updated alongside the frozen model's forward pass and the readout is appended to its input, decoding continuing from the retained KV cache (§4).
- **fixed budget**: one state per stream or active group, not growing with stream length or distinct identities (§3); 2 KiB in the main runs (§4.2; App. E.3).
- **aggregate-then-reason task**: an aggregate plus a decision condition mapping it to one of two answers, e.g. by whether more than 100 users report an error (§5.1). A **source window** is one benchmark record sequence; its tasks are resampled together (§5.1).
- **arms** (App. E.1): *exact* (true aggregate and condition), *budgeted* (the sketch readout instead), *aggregate-only* and *policy-only* (condition or aggregate withheld), *counterfactual* (an altered aggregate that changes the right answer, §5.2).

**Missing glossary terms:**
- **joint maximum-likelihood estimation (JMLE)**: Ertl's estimator that reads two HLL sketches together to estimate how many identities are only in A, only in B, and in both (§4.2; App. C.4).

**Builds on:**
- HyperLogLog (Flajolet et al. 2007), JMLE (Ertl 2017) and Count–Min (Cormode and Muthukrishnan 2005), used as established tools (§2.3; App. A).
- Oolong (Bertsch et al. 2025, [Oolong](#/papers/bertsch2025oolong "Oolong: Evaluating Long Context Reasoning and Aggregation Capabilities (2026)")), a long-context aggregation benchmark whose Oolong-Synth test set supplies the records (§5.1).
- Code execution as in PAL (Gao et al. 2023, [PAL (Program-aided Language Models)](#/papers/gao2022pal "PAL: Program-aided Language Models (2022)")) and Program of Thoughts (Chen et al. 2022, [PoT (Program of Thoughts prompting)](#/papers/chen2022pot "Program of Thoughts Prompting: Disentangling Computation from Reasoning for Numerical Reasoning Tasks (2023)")) (§2.1; §5.3).
- Learned set encoders: Deep Sets, Set Transformer and UMBC (Universal Mini-Batch Consistency, Willette et al. 2023, which processes a set in partitions with partition-independent results), the last compared directly (§1; §2.2; §5.4).

## Problem and setting

- **Question:** can a fixed-size, mergeable state beside a frozen model supply the aggregate a decision needs, at what cost against an exact aggregate (§3; §5)?
- **Requirements:** readouts from the states alone; updates during extraction; a fixed budget; mergeable segments (§3).
- **Targets:** distinct count, union size, Jaccard similarity, containment, grouped distinct count, point frequency (§6; App. B.2).
- **Data:** 174 source windows of the Oolong-Synth test set, 1K to 4M tokens, records with user identities and category labels; 3,969 tasks (§5.1; App. E.2).
- **Models:** Qwen3.6-35B-A3B (3B active parameters) and Gemma-4-31B-IT (instruction-tuned) in BF16 (16-bit weights), temperature 0, a 150,000-token served limit (App. E.3, Tab. 7).
- **Correct:** the final choice matches the gold answer; overflows, failed calls and unparseable answers score zero (§5.1; App. G.1).
- **Given to the pipeline:** the structured records and a "precompiled operator specification" (which aggregation to compute, over which streams), fixed before inference; extraction from free text is not evaluated (App. E.1; App. G.2).

## Approach

- **Construction** (§4.1; App. C.1; Tab. 7): one HLL state per stream, 2,048 one-byte registers, a 64-bit hash with a fixed seed.
- **Exact merging:** states from separate segments with the same register count, hash and seed merge by registerwise maximum into exactly the register array of one pass over the whole stream; the readout is still an estimate (App. C.2, Prop. 4).
- **Readouts from the same registers** (§4.2): distinct count from one state, union from a temporary merge, Jaccard similarity and containment by JMLE on the two states kept apart. If the JMLE optimizer (coordinate ascent with convergence checks) fails, the readout is marked invalid, not replaced by inclusion–exclusion (the intersection computed from the two counts and the union) (App. C.4).
- **Frequencies:** an exact counter when the identity is known in advance, else a Count–Min table merged by addition (§4.1; App. D).
- **Cost** (§4.2 "Complexity"): constant time per update, linear in the register count to merge or estimate.
- **Why attention falls short** (App. A, the paper's "aggregation-operator mismatch"): under normalized attention (a weighted average, weights positive and summing to one), a repeated record changes the output unless its value equals the current output (Obs. 2); no function of two segments' averaged outputs alone gives the average of their concatenation for every pair of segments (Obs. 3).

## Results

- **Against full-context reasoning** (174 tasks, one per window; §5.2, Tab. 1): 92.0% (Qwen) and 99.4% (Gemma) against 31.0% and 43.1% for the best full-context prompt (direct, chain of thought, or guided choice: grammar-constrained answer selection). 80 of the 174 exceed the 150K-token limit and count as wrong for the baselines; "Part of this difference comes from context length" (§5.2).
- **The 94 tasks that fit** (§5.2): 96.8% and 100% against 57.4% and 79.8% for the strongest full-context baseline; the selected analysis (App. E.6, Tab. 8) "does not replace the all-window primary comparison" (Tab. 8 caption).
- **Cost of approximation** (3,969 tasks; §5.2, Tab. 2): 89.0% against 93.0% with the exact aggregate on Qwen (paired gap 4.0 points, 95% window-cluster interval 3.2–4.9), 99.2% against 100.0% on Gemma (gap 0.8, interval 0.5–1.3).
- **Use of the aggregate:** given a counterfactual aggregate, the models chose the answer it implies on most Qwen tasks and all Gemma tasks (§5.2, Tab. 2), "a mechanism diagnostic, not accuracy on the original task" (App. E.5). Withholding the aggregate or the condition gives much lower accuracy; in Gemma's policy-only arm many answers failed to parse and were scored zero (App. F.1, Tab. 9).
- **Against code execution** (1,200 preselected tasks covering all windows; §5.3, Tab. 3): code execution 100.0% on both models against 91.1% (Qwen) and 99.3% (Gemma), with 1,260.2 and 208.6 mean output tokens per task against 2.2. The authors call it "an exact-execution reference with access to the full records and a trusted sandbox, not an equal-state or equal-compute baseline" (App. F.4).
- **Length** (no language model; §5.4, Tab. 4): with 2 KiB carried per stream, HLL's median relative error for distinct counts goes from 1.29% at 8K records to 1.49% at 200K, while UMBC, trained on 8K-record streams, stays near 27%; UMBC's static parameters are outside that budget (Tab. 4 caption; App. F.2).
- **Budget and merging** (§5.4, Tab. 5): measured error over 256 to 8,192 registers "generally follows" 1.04/√m. Merging up to 256 segments in different orders matched one pass exactly. The abstract's one-million-record mean relative error of 1.6% comes from two streams under ten hash seeds, a different summary from Tabs. 5 and 12 (App. F.3).

## Limits the authors state

- The fixed state trades estimation error for bounded size; "Dedicated storage or external execution might still be preferred for small-scale tasks that require exact numerical outputs" (§6).
- The fixed size is per stream or active group, so total memory grows with the number of states (§6; App. G.2).
- Only the six targets studied are supported; others need their own states and readouts (§6).
- The evaluated path starts from released structured records with stable canonical identities and a precompiled operator specification, and "does not establish the accuracy of extracting those identities from unrestricted prose" (App. G.2; App. E.1).
- "no fused Transformer kernel or hidden-state modification is claimed": the readout is appended as evidence (App. G.2).
- JMLE readouts are used only when the optimizer returns a finite, feasible, converged estimate; failures stay failures (App. G.2).
- The UMBC comparison matches carried-state bytes and the size comparison uses serialized identity strings; "Neither result is a total-system memory comparison" (App. G.2; App. F.2).
- Fixed size is not always smaller: below a measured crossover in distinct identities, the exact identity payload is smaller than one 2 KiB state (App. F.3).
- Count–Min's table is fixed, "but the collision term grows with stream mass" (overcounting from shared counters grows with total occurrences) (App. D).
- Obs. 2–3 concern "the state returned by the readout, not the computational power of a Transformer, an external executor, or a model supplied with an additional aggregation state" (App. A).

## Open problems and building blocks

- **Open:** "dynamically selecting between exact sets and sketches with different budgets based on set cardinality, error requirements, and available resources", and extending the interfaces to further aggregation operators (§6).
- **Released:** "Code is available at" the authors' GitHub repository (abstract); the experiments "introduce no new raw corpus" and use public Oolong-Synth at a stated revision (App. E.2).
- **To reuse it:** an extractor giving canonical identities and group keys, and an operator specification per request (§3; App. G.2); compatible states need the same register count, hash and seed (§4.1); the main settings are in Tab. 7 (App. E.3).

## On this site

- **Tags:** <span class="tags"><a class="tag" href="#/tags/offload">offload</a><a class="tag sub" href="#/tags/general-misc">general-misc</a><a class="tag sub" href="#/tags/llm-misc">llm-misc</a></span>
