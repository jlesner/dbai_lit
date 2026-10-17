# Oolong: Evaluating Long Context Reasoning and Aggregation Capabilities

**Oolong** · COLM 2026

Read: [PDF](https://arxiv.org/pdf/2511.02817) · [arXiv](https://arxiv.org/abs/2511.02817)  
Code: [oolong](https://github.com/abertsch72/oolong)

<p class="notice">A summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- A long-context benchmark of aggregation questions with short, automatically scored answers: Oolong-synth fills inputs from 1K to 4M tokens with items from ten text-classification datasets, each given a user ID and a date, and asks for label counts, frequencies, and user and timeline relations (§2, Tab. 4); Oolong-real asks about dice rolls and spells in transcripts of one to 24 Dungeons & Dragons episodes, with fan-compiled statistics as gold answers (§3).
- Scores 20 models (App. A, Tab. 3) by exact match, with partial credit for numbers (§2.3), then studies reasoning effort, over-reasoning and refusal, gives the gold labels or domain knowledge in the input, and runs an iterative retrieval agent (§4).
- Counts and distributions over labelled items are the work a `GROUP BY` query does exactly once each item has its label: a text-only arm with its own length dial for [Reliability that holds with size, by handing the procedure to an engine](#/challenges/engine_offloading_with_size), and the benchmark [RLM (Recursive Language Models)](#/papers/zhang2025rlm "Recursive Language Models (2025)") reports on. The authors report that most models score below 50% at 128K tokens and that "identification and aggregation of information is the bottleneck, not labeling" (§1; §4.4).

## In plain words

Many long-context uses ask for a judgment over a whole collection, such as trends across thousands of customer interactions. The authors argue that current long-context benchmarks mostly test retrieval, where the answer depends on a small fraction of the input, because tasks that use the whole input tend to have long outputs that are hard to grade (abstract). They build Oolong, a benchmark whose questions need each relevant item of a long input classified and the results counted or compared, with short answers scored automatically: Oolong-synth assembles items from text-classification datasets at set input lengths, and Oolong-real asks about dice rolls and spells in transcripts of a Dungeons & Dragons show (abstract; §2–3). It is a benchmark and a failure analysis.

They report that most models score below 50% at 128K tokens (§1). On Oolong-synth, giving the models every item's correct label helps only a little, so they place the bottleneck in finding and aggregating information, not in labeling (§1; §4.4). Some reasoning models fail by reasoning until their output budget runs out, or by refusing (§1; §4.2–4.3).

## Background and terms

**Terms to know:** [exact match](#/glossary/exact-match) · [label noise](#/glossary/label-noise) · [retrieval-augmented generation (RAG)](#/glossary/retrieval-augmented-generation-rag) · [BM25](#/glossary/bm25) · [multi-hop question answering](#/glossary/multi-hop-question-answering) · [needle in a haystack (NIAH)](#/glossary/needle-in-a-haystack-niah) (§2.3, §5) · [prompt caching](#/glossary/prompt-caching) (why each context window serves 25 questions, §2.2)

**The paper's own terms:**
- **information aggregation**: finding the relevant parts of a long input, making a simple decision on each (a label, a category), and combining the decisions into one answer, such as a count or a comparison (§1; Fig. 1).
- **ICL datasets**: short text-classification datasets of the kind used for in-context learning; each example becomes one item of the input, with a user ID and a date added (§2; Tab. 4).
- **context window**: one constructed input of a target length, the "context length" (§2.2); for Oolong-real, one to 24 episode transcripts (§3).
- **counting, user and timeline questions**: Oolong-synth's question types, "in order of increasing complexity": statistics of the label distribution; the same cross-referenced with user IDs; and changes in the distribution before or after a date, or across months and years (§2.2 "Questions"; App. E.1).
- **partial credit**: a numerical answer scores 0.75 raised to the size of its error (§2.3).
- **random baseline**: the expected score of guessing among the valid answers, or, for numbers, answering the item count divided by the number of labels (§2.3).
- **reasoning effort**: broadly, how much a model reasons, measured three ways (§4.1); narrowly, the OpenAI API's setting, "low", "medium" or "high" (§4.1).
- **information-dense**: all or nearly all lines of the input are needed to answer, as in Oolong-synth (§4.2).
- **over-reasoning**: the model exceeds its reasoning-token or total token budget during a very long reasoning trace and fails to answer at all (§4.2).
- **refusal**: the model describes the task as impossible or intractable and doesn't answer (§4.3).

**Missing glossary terms:** none.

**Builds on:**
- The benchmarks it compares itself with in Tab. 1 (§1): RULER (synthetic tasks over artificial inputs), BABILong (reasoning tasks hidden in novels), MRCR (multi-round coreference resolution: finding the i-th of similar requests) and HELMET (downstream tasks such as summarization and question answering), by Hsieh et al. (2024), Kuratov et al. (2024), Vodrahalli et al. (2024) with OpenAI (2025), and Yen et al. (2024) respectively.
- ZeroSCROLLS (Shaham et al., 2023), whose task of finding the share of a product's reviews that are positive the authors call "the closest conceptual ancestor of our work" (§5).
- Database reasoning (aggregation framed as database-like operations over text) (Thorne et al., 2021), with which Oolong-synth "has conceptual similarities" (§2); §5 puts HoloBench (examples built from text-to-SQL datasets) and SciTrek (SQL-like queries over article metadata) in the same line.
- The Critical Role transcripts of CRD3 (the Critical Role Dungeons and Dragons Dataset) (Rameshkumar & Bailey, 2020) and CritRoleStats, a fan project's per-episode statistics, for Oolong-real (§3).

## Problem and setting

- **The question:** can long-context models aggregate information spread over a growing input when each piece is easy? The benchmark is framed "around problems that are simple individually", to measure long-context reasoning rather than the underlying task (§1).
- **One prompt:** the whole input goes to the model, with a one-sentence task description at its start and end and the question only at the end (§2.2 "Instructions").
- **Oolong-synth:** ten datasets with 2 to 10 labels, eight for test (§2.1; Tab. 4), minus the examples both GPT-4.1 nano and Llama 4 Maverick get wrong zero-shot (§2.1; Tab. 5). Each window samples a random label distribution, so knowing the true one doesn't help, then items, user IDs and dates: 400 test questions per length, at every power of two from 1K to 4M (§2.2).
- **Oolong-real:** two Critical Role campaigns (stories spanning dozens to hundreds of episodes); questions on rolls and spells over one episode or several concatenated, from 55K to 1.3M tokens (§3; Tabs. 19–21).
- **Correct means:** exact match for labels, dates, user IDs and comparisons, partial credit for numbers; answers are parsed from the requested format, or else from the last substring of the right answer type (§2.3). Oolong-real follows the same setup (§3).
- **Models:** 20 in the leaderboard, closed API models (GPT-5 family, o-series, Gemini, Claude) and open-weight ones (DeepSeek-R1, Qwen3, Olmo-3, Gemma, Llama), each at its maximum reasoning or output budget (§4.2, footnote 4; App. A, Tab. 3).

## Approach

- **Two splits (§2–3):** Oolong-synth controls the kinds of information and the number of steps; Oolong-real's unscripted dialogue revisits and revises events, so it isn't easily split into items (§3; App. H.2). One question over a large text matches how many users work, they argue (§2.3 "An iterative system?").
- **Analyses (§4):** reasoning effort three ways (reasoning-tuned "think" models against instruction-tuned ones, GPT-5-nano's setting, Gemini 3 Pro's reasoning-token count; §4.1); over-reasoning, with the LLM GPT-5.6-Luna labelling 2,400 random DeepSeek-R1 traces for behaviours the authors found by inspection (§4.2); refusal (§4.3); gold labels or domain knowledge put in the input (§4.4); and an iterative RAG agent built with smolagents (Roucher et al., 2025; an agent library), with BM25 utterance retrieval and code execution, up to 5 steps, on GPT-5 (§4.5).

## Results

- **Length:** scores drop significantly at longer inputs; the two splits are of similar difficulty at the same length (§4, Fig. 2). Most models score below 50% at 128K (§1). Gemini-3-Pro has the highest leaderboard average (over 8K–175K inputs) on both splits (App. A, Tab. 3).
- **Reasoning effort:** "high" helps GPT-5-nano only at short inputs (§4.1, Fig. 3a). For Gemini 3 Pro at a fixed input length, longer reasoning goes with lower correctness (Fig. 3b). Olmo's think models greatly exceed its instruct models on Oolong-synth, while Qwen3-4B's thinking model scores near zero there from over-reasoning (§4.1); on Oolong-real, reasoning models generally show little gain (App. B.1).
- **Over-reasoning:** DeepSeek-R1 beats GPT-5 nano and o4-mini on Oolong-real but is below the random baseline on Oolong-synth; 56.3% of its labelled traces give no answer at all (§4.2). At 256K, the reasoning-token limit stops Gemini 2.5 Pro answering 64.0% of Oolong-synth inputs, and Gemini 3 Pro 45%; not seen on Oolong-real (§4.2).
- **Refusal:** at 256K on Oolong-synth, GPT-5 attempts 83% of queries and answers 44.5% of these correctly; GPT-5.2 attempts only 32%, at 52.8% (§4.3). The authors judge it "likely" that GPT-5.2 would improve, "perhaps substantially", by attempting more.
- **Gold labels:** the gain ranges from 10.9 points to only 0.79 across four models, is not consistently higher at longer inputs, and is not larger for GPT-5-nano than for GPT-5 (§4.4, Fig. 4). Domain knowledge helps GPT-5 and Claude Sonnet 4 "slightly but not substantially" on single episodes (§4.4).
- **Retrieval agent:** it trails GPT-5 reading directly by 16.15 points with one transcript and 17.67 with two, so Oolong "cannot be easily solved by a simple agentic retrieval system", though retrieval "remains non-trivial" (§4.5).
- **Contamination:** asked with only the campaign and episode number and no transcript, models answer almost nothing correctly, "evidence against widespread data contamination" (App. B.2).

## Limits the authors state

- Oolong-synth's items are independent: "In theory, an iterative system could complete these tasks by calling a model to label each individual example and then deterministically aggregating the resulting labels" (§2.3); they reply that this holds for many existing tasks too.
- The label screen also removes hard examples: "the remainder generally represent challenging cases" (§2.1).
- Comparing the splits "is challenging because real data do not necessarily align with fixed context window buckets" (§4).
- The Gemini API returns nothing when the budget runs out during reasoning, scoring 0 (§4.2). For Gemini 3 Pro's rise from 256K to 512K, "It is not clear what causes this shift" (§4.2, footnote 7). Longer reasoning may go with lower correctness partly because harder problems cause both (§4.1).
- The automatic trace labels were checked by hand on "a small subset" (§4.2, footnote 5).
- Some Oolong-real questions do benefit from domain knowledge (§4.4).
- Fan statistics can't be made completely free of error (App. H.1).
- Lengths beyond a model's maximum count as 0 in the leaderboard averages (Tab. 3 caption).
- API models typically vary a little between calls and may be phased out, so "exact replication of outputs may be infeasible" (§ "Reproducibility Statement").

## Open problems and building blocks

  - "more work is necessary in developing both reasoning abilities and more general long context abilities"; better length generalization "may also improve performance" (§6).
  - Behaviour in "extremely information-dense regimes" is "a direction for future work"; "Future models that are aware of the maximum reasoning token budget may be able to more carefully allocate reasoning effort" (§6).
  - "We expect future work to study ways to improve retrieval tool use and explore dynamic chunking algorithms depending on the question"; the authors speculate that methods that condense or evict parts of the context "could be effective for this task" (§4.5).
- **Released:** "We release the data and evaluation harness" (abstract): code for dataset construction and evaluation, the final dataset and, "wherever possible", each run's model outputs (§ "Reproducibility Statement").
- **To reuse it:** each window is reused for 25 questions so prompt caching cuts local run time and the cost on most APIs (§2.2); lengths are in Llama 2 tokens (§2.2); models run at their maximum output budgets (§4.2, footnote 4). CritRoleStats allows statistical use of its data when credited (§ "Ethics Statement").

## On this site

- **Discussed in:** [Bringing compact models to frontier accuracy](#/challenges/compact_model_accuracy)
- **Tags:** <span class="tags"><a class="tag" href="#/tags/compact">compact</a><a class="tag" href="#/tags/gym">gym</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/scaling-general">scaling-general</a></span>
