# When Agent Memory Needs to Compute: Evidence Access and Executable Aggregation

**When Agent Memory Needs to Compute** · preprint 2026

Read: [PDF](https://arxiv.org/pdf/2610.19474) · [arXiv](https://arxiv.org/abs/2610.19474)

<p class="notice">A summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Answers questions about an agent's logged history that combine many events (e.g. how often an action was taken): Trajectory Memory (TM) keeps the trajectory verbatim and shows a budgeted, order-preserving view chosen at question time, and TallyMem adds an event ledger of every step, over which a model-written event specification (scope, event predicate, operation) is run by a deterministic executor whose result and supporting step IDs join TM's view (abstract; §4; §6).
- Specifications are plans of at most four sub-queries in a small typed query language with literal filters (case-insensitive substring matches, equality for the outcome; §6, Eq. 6) and count, list, first/last, group-count and timeline operations, checked against the ledger before they run (§6, Eq. 7; no arithmetic over values, joins or free-form code, App. C); evaluated on AMA-Bench (LLM-judged), on held-out repositories of MINTEval's GitHub commit-history subset (exact match), and on a probe of template questions whose event sets are parsed from the raw logs, with up to five reader models (five on the 630 diagnostic questions; §7.1, §7.4).
- Engine against text on one task family with a load dial: the authors report that long-context reading of fully visible histories answers the same count correctly for 100% of trajectories at 14 events but 80% at 53 (§1; §7.4), while execution is exact over the rows a plan selects (§3) and event specification is the largest residual system-error category (§8, Tab. 3). The gains are task-dependent by the authors' account: modest on the full AMA-Bench, larger on MINTEval after "a benchmark-specific adaptation of the interface" (§9; App. M).

## In plain words

Questions about an agent's logged actions and results (in a repository, website or simulated home) can ask what happened at a step or how often an action was taken (§1). The authors see two separate demands: the deciding steps must reach the answering model unchanged ("access"), and, when an answer combines many events, they must be selected and combined correctly ("aggregation") (§1). They build Trajectory Memory (TM), which keeps the log verbatim and chooses what to show once the question is known, and TallyMem, in which a model writes down which events to count and how, and a fixed program counts them over a table of every logged step (abstract; §6). After adapting that table to code commits, TallyMem raises the open model Qwen3-32B from 35.2% of answers matching the reference with TM to 49.0%, on 776 questions from 99 held-out repositories (abstract). On a full benchmark of agent-log questions, attaching computed results only where many events combine lifts Qwen3-32B 1.3 points over TM (abstract; §7.2), a gain the authors call modest and reader-dependent (§9). They present a diagnosis and two mechanisms (§1), and claim no first.

## Background and terms

**Terms to know:** [exact match](#/glossary/exact-match) · [LLM-as-a-judge](#/glossary/llm-as-a-judge) · [sign test](#/glossary/sign-test) · [cluster bootstrap](#/glossary/clustered-standard-errors-and-cluster-bootstrap) · [retrieval-augmented generation (RAG)](#/glossary/retrieval-augmented-generation-rag) · [self-consistency](#/glossary/self-consistency-majority-voting) · [pre-registration](#/glossary/pre-registration)

**The paper's own terms:**
- **trajectory**: an agent's ordered steps, each an action and its observation, with a step ID (§3); the **reader** is the fixed answer model given the memory's context (§3).
- **access** and **aggregation**: the deciding steps reach the reader unchanged and in order; the requested operation (count, group, order, list) is computed correctly over the in-range steps that are events of the requested kind (§3, Eq. 1).
- **aggregation load**: the number of events an answer combines (§1); on AMA-Bench it is estimated from the compiled queries' (queries the model writes; see Approach) matched steps, "a compiler-derived proxy, not an independent difficulty annotation" (§5).
- **event ledger**: a table with one row per logged step (tool, normalized and raw action, targets, outcome, state changes, parameter difference) (the last compares actions of the same tool and path), built once per trajectory and shared by its questions (§6).
- **event specification** (or **plan**): a step scope, an event predicate and an operation, written by a model (§6).
- **router**: a rule that attaches computed evidence by load and, on MINTEval (a benchmark of memory in long-horizon agent systems), by whether TM's view already shows every matched step untruncated (App. J).

**Builds on:**
- AMA-Bench (Zhao et al., 2026), a benchmark of memory over agent trajectories, whose error attribution motivates keeping the log verbatim (§1); its code-executing AMA-Agent is contrasted in Tab. 1 (§2).
- Memory systems that "retrieve evidence from summaries, extracted facts or linked records": MemGPT, Mem0, A-Mem and HippoRAG (§1; §2).
- Executable memory: Binder (programs with model calls) and ChatDB (SQL databases as symbolic memory) (§2, Tab. 1).
- Liu et al. (2024) ([Lost in the Middle](#/papers/liu2023lostmiddle "Lost in the Middle: How Language Models Use Long Contexts (2024)")), on how models use long contexts, and the aggregation benchmarks RULER and Oolong ([Oolong](#/papers/bertsch2025oolong "Oolong: Evaluating Long Context Reasoning and Aggregation Capabilities (2026)")) (§2).

## Problem and setting

- **Question:** do access and aggregation fail separately in memory for an agent's history, and can execution fix aggregation (§1; §5)?
- **Setting:** memory is built before questions arrive (§3); TM's view gets 26k tokens, computed evidence 6,000 characters (§4; §6).
- **Benchmarks:** AMA-Bench, 2,496 questions about 208 real trajectories from six domains (§5), scored by its official judge prompt run by Qwen3-32B (App. A); MINTEval's GitHub commit-history subset, 776 questions from 99 held-out repositories, exact match (§7.1; App. M); a probe of 645 template questions over 66 embodied (simulated-household) and software AMA-Bench trajectories, with answers and event sets parsed from the raw logs (§7.4), judged against the parsed answer (App. H). The 630 diagnostic questions are the commonly answered part of 670 matching four text patterns (App. A–B).
- **Readers:** five open-weight models, Qwen3-32B, Qwen3-235B-A22B, gpt-oss-120b, Qwen3.6-27B and Qwen3-8B; annotation and compilation use Qwen3-32B (App. A).
- **Development:** on half the AMA trajectories, with results pooling both halves (App. A); the MINTEval adaptation on 25 repositories, "evaluated once" on 99 held-out ones (§7.3).

## Approach

- **TM (§4).** Every non-empty step is stored verbatim with its ID, so shown spans trace to the original (Eq. 2). At question time it picks anchor steps by shared terms and named steps, admits others by distance to an anchor until the budget is spent, and renders them in order, marking omissions (Eq. 3–4). The view "does not guarantee complete visibility" (§4).
- **The ledger (§6).** A program fills mechanical fields; a model annotates targets, outcomes and changes without seeing questions; outcomes need a quote found in the observation (App. C). On MINTEval a program builds it from diffs (§7.3).
- **A small typed query language (§6, Eq. 6–7).** A plan is "not applicable" or up to four sub-queries, each with a step range, a predicate (an AND over fields of ORs of literal terms, matched as case-insensitive substrings, outcomes by equality) and an operation: count, list, first, last, group-count or timeline. It "does not support arithmetic over values, joins or free-form code" (App. C). One model call per question compiles it (§6).
- **Grounded execution (§6).** A sub-query runs only if every filter term occurs in its field somewhere in the log and its match set is non-empty; otherwise it contributes nothing (list and timeline queries get one relaxed retry), as "a specification the log cannot support, not a verified zero". Results, with their filters and supporting step IDs, join TM's view.
- **Guarantee (§6).** The executor covers every selected row, including rows missing from TM's view; if the ledger and specification represent the intended events, it computes the quantity exactly, and otherwise the returned conditions and step IDs show which is wrong.

## Results

- **Load (§5, Fig. 2–3).** With Qwen3-32B on AMA-Bench, by the compiler-derived load, TM falls from 77.1% at one to five matched steps to 10.0% above a hundred (Fig. 2). On 438 diagnostic questions, TM also falls with load when the raw history fits within 24k tokens ("not full visibility of every TM field"), and executed evidence helps at high load in both strata (fitting and not fitting), not at low load (Fig. 3). For all five readers, TM's gain over long-context reading is larger on histories that don't fit (§5).
- **Prompting (App. E.1).** Asking the reader to list the relevant steps first leaves high-load accuracy low for all three readers tried.
- **Probe (§7.4; App. H).** With Qwen3-32B and without routing, TallyMem reaches 93.8% against 82.8% for TM; much of the gap comes from TM's keyword-triggered counter (§4) firing on "how many times" but not "how often". On 20 embodied trajectories with every counted step visible, long-context reading gets the same count right for 100% at a mean of 14 events but 80% at 53. With Qwen3-8B, TallyMem still beats TM but only matches a fixed group-by-tool counter; in its errors at the highest bound of the fully visible trajectories, "the reader recounts the logged steps instead of using the computed count" (App. H "Second reader").
- **MINTEval (§7.3; App. M, Tab. 21).** After the commit-specific adaptation, Qwen3-32B's exact match rises from 35.2% (TM) to 49.0% (TallyMem), with long context at 39.2%; gains span 12.8–13.9 points across three readers (abstract). Gains are largest for file order and value history, multi-hop (MINTEval question types) is unchanged, and TM alone trails long context with every reader.
- **Full AMA-Bench (§7.2; Tab. 2; App. D).** With Qwen3-32B, TM reaches 69.8% and routed TallyMem 71.1%; without routing the gain "is not significant under the paired sign test", and Qwen3.6-27B's held-out-half gain is near zero (§7.2). TM exceeds five external memory baselines (Tab. 2) in the same deployment, and the authors write that "TM achieves state-of-the-art performance relative to the previously reported AMA-Bench methods compared here" (§7.2), whose scores come from other settings (App. D, Tab. 5).
- **Errors (§8, Tab. 3; App. N).** Of Qwen3-32B's 214 errors on the diagnostic set with evidence always attached, 66 got no computed evidence; none of the rest arises in execution or truncation. Specification is the largest category: 51 errors, 49% of the 104 left after excluding reference, judging and unclear cases, against 20% each for ledger and answering. Other readers given the same evidence answer a smaller share of the specification errors than of the answering errors correctly, "so the latter are systematic" (§8).
- **Freer specifications (§8).** Five sampled plans repeat the same choice (App. K); free-form Python over the same ledger and log scores below TallyMem on the diagnostic set and the probe (App. L; App. H).

## Limits the authors state

- The evidence covers AMA-Bench, a probe built from its embodied and software trajectories, and MINTEval's GitHub subset, "not all agent or dialogue memory tasks"; gains vary across question types, domains and trajectory splits (Limitations); full AMA-Bench gains "are modest and depend on routing and the reader" (§9).
- "The ledger and the query language cannot express every event predicate, and on MINTEval TM alone trails long context" (Limitations); e.g. non-zero exit codes (App. H "Correct plans").
- The subset explaining the routed gain "is selected by the method, rather than independently defining aggregation difficulty" (§7.2); AMA-Bench load is a compiler-derived proxy with small extreme bins (§5; App. I.2).
- AMA results include development trajectories, and a later compiler refinement followed inspection of errors (§7.1; App. I.2); judging and reference ambiguities add uncertainty, and the probe's judge accepted some wrong answers (App. I.2).
- MINTEval uses "a benchmark-specific adaptation of the interface, not zero-adaptation transfer" (App. M); its long-context row and other readers ran after the pre-registered test (Tab. 2).
- Quote checks test "textual occurrence, not semantic entailment or the completeness of the annotation" (App. C); the executor can use changes lacking a matching-value flag (App. I.2).
- Baselines ran with one reader, the code control with one model and prompt design, and the error analysis with one reader and a single annotator (App. I.2).
- Diagnostic and full runs use different deployments, "so their absolute accuracies are not interchangeable" (App. A).
- The correct-plan arm "is diagnostic rather than confirmatory" (App. H); "Computed evidence helps a weaker reader only when the reader adopts it" (App. H).

## Open problems and building blocks

- **Open:** event specification, "the main residual challenge" (§9); its errors "can be checked against the log" through each result's filters and step IDs (§8).
- **Released:** Nothing stated.
- **To reuse it:** TM needs no model calls (§4); the annotated ledger averages 5.5 model calls and 42k tokens per trajectory, compilation about 1.3k tokens per question, and a variant with program-derived fields only (TallyMem-lite) needs no construction calls (App. K).

## On this site

- **Discussed in:** [Checking a program written from English, in any DSL](#/challenges/dsl_intent_verification) · [Reliability that holds with size, by handing the procedure to an engine](#/challenges/engine_offloading_with_size)
- **Tags:** <span class="tags"><a class="tag" href="#/tags/llm">llm</a><a class="tag" href="#/tags/longctx">longctx</a><a class="tag" href="#/tags/method">method</a><a class="tag" href="#/tags/nl">nl</a><a class="tag" href="#/tags/offload">offload</a></span>
