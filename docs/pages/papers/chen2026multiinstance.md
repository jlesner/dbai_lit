# Understanding LLM Performance Degradation in Multi-Instance Processing: The Roles of Instance Count and Context Length

**Understanding LLM Performance Degradation…** · ACL 2026

Read: [PDF](https://arxiv.org/pdf/2603.22608) · [arXiv](https://arxiv.org/abs/2603.22608) · [DOI](https://doi.org/10.18653/v1/2026.acl-long.1470)  
Code: [mip-understanding](https://github.com/jingxuanchen916/mip-understanding)

<p class="notice">A summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Measures 16 LLMs on prompts that hold from 2 to 2,000 items, each easy alone, and ask for one aggregated answer (a count of labels or a sum): eight tasks such as sentiment, language identification, named entities and parity, using only items that every comparison model solves when given them one at a time (abstract; §3.2, §4, Tab. 1).
- Sorts failures into wrong per-item labels, wrong aggregation and invalid outputs with a variant that asks for per-item answers first (§5.2, Fig. 5), then separates item count from context length by padding every item with irrelevant text and by correlating success with each factor, also at a fixed item count (§6.1–6.2, Tab. 4).
- A text-only arm with an item-count dial for [Reliability that holds with size, by handing the procedure to an engine](#/challenges/engine_offloading_with_size): per-item labelling, then counting or summing, the work a `GROUP BY` does once items carry labels, with each item's difficulty held down; it has no engine or program arm (the authors evaluate no mitigation, § "Limitations"). The authors report success correlating with instance count at Spearman −0.61, against −0.37 for context length (§6.2).

## In plain words

Users often give an LLM many items at once, such as movie reviews, and ask for one combined answer, such as how many are positive (abstract). The authors note that models are mostly tested one item at a time, and that most long-input benchmarks make inputs longer and tasks harder together, hiding which of the two causes failures (§1). They test 16 LLMs on eight tasks that are easy one item at a time, such as counting positive reviews or summing arithmetic answers, keeping only items that reference models all solve alone, with 2 to 2,000 items per prompt (§3.2, §4). They report that all models degrade slightly for small counts, then collapse on larger ones (abstract): averaged over the tasks, every model's rate of exactly right answers falls below 20% at 2,000 items (§5.1). Padding every item with irrelevant text to more than double its length leaves average success "broadly similar" at a fixed count, and success correlates more strongly with item count than with total length (§6.1–6.2). They present a "comprehensive evaluation" (abstract), not a method.

## Background and terms

**Terms to know:** [Spearman's rank correlation](#/glossary/spearmans-rank-correlation) · [mixture of experts (MoE)](#/glossary/mixture-of-experts-moe) · [retrieval-augmented generation (RAG)](#/glossary/retrieval-augmented-generation-rag) · [named-entity recognition (NER)](#/glossary/named-entity-recognition-ner) · [greedy decoding and temperature sampling](#/glossary/greedy-decoding-and-temperature-sampling) · [exact match](#/glossary/exact-match) · [p-value](#/glossary/p-value) (used undefined, §6.2, Tab. 4)

**The paper's own terms:**
- **multi-instance processing (MIP)**: "the model generates individual predictions for multiple instances and subsequently aggregates them into a single, cohesive final prediction" (§1); unlike RAG, every instance must be processed (§3).
- **single-instance processing (SIP)**: one instance per prompt, MIP with one instance (§1, §3).
- **instance**: one data entry, such as a movie review, a sentence or a number (§3).
- **experiment**: one model, one task prompt and one sampled set of instances (§3.3).
- **success rate (SR)**: the share of experiments whose aggregated answer equals the ground truth exactly (§3.3).
- **invalid rate (IR)**: the share of experiments with an invalid output (§3.3): a parsing error (the output can't be parsed into the expected format) or an overlong input error (the input exceeds the model's context length) (§5.2). Wrong answers and invalid outputs are the failures (§3.1).
- **instance-level variant**: the model labels each instance, keyed 1 to the count, before the aggregate (§5.2). Its wrong answers are key mistakes (keys don't run from 1 to the count), individual mistakes (a label wrong), aggregation mistakes (labels right, aggregate wrong) and combined mistakes (both) (§5.2).
- **comparison models** and **agreement**: the models the filter is built on, not all 16 (App. C); agreement is the share of a task's instances they all answer correctly alone (§3.2, Tab. 7).
- **frontier and lightweight closed-source**: Fig. 2's model categories; in Tab. 2, "A" before a size means a mixture-of-experts model's active parameters.
- **WSD**: word sense disambiguation; here, whether "apple" means the company or the fruit (App. A.8).
- **artificially augmented setting**: every instance followed by a fixed irrelevant filler (§6.1); **long and short sets**: each dataset's longest or shortest instances (§6.2).

**Builds on:**
- Oolong (Bertsch et al., 2025; [Oolong](#/papers/bertsch2025oolong "Oolong: Evaluating Long Context Reasoning and Aggregation Capabilities (2026)")), which evaluates "long-context aggregation via many in-context instances": "Closest to our work", but they "primarily vary context length rather than isolating instance count" (§2).
- Batch prompting (Cheng et al., 2023; Lin et al., 2024a): several questions in one prompt to cut inference cost, "typically with a limited number of instances" (§1, §2). Not on this site.
- Hsieh et al. (2024), a long-context benchmark (RULER, by its reference entry) whose filler the padding reuses (§6.1). Not on this site.
- Fu et al. (2024), cited for LLMs that "struggle when required to perform many repeated operations" (§6.3). Not on this site.

## Problem and setting

- **Research questions (§1):** how performance and failures change as instances grow (RQ1); whether instance count and context length have similar effects (RQ2).
- **Tasks (§4.1, Tab. 1, App. A):** label every instance, then aggregate. Arithmetic sums the answers of easy additions and subtractions; the others count news articles in the "tech" category (Category), English paragraphs among four languages (Language), person names (NER), odd numbers (Parity, synthetic), positive movie reviews (Sentiment), "women" in tweets (Word) and "apple" meaning the company (WSD). Three more tasks were dropped for unsatisfactory single-instance performance (App. A.9, Tab. 5).
- **Models (§4.2):** 16 LLMs through OpenRouter (a service routing API calls to many providers): nine open-weight (DeepSeek, gpt-oss, Llama, MiniMax and Qwen3 models) and seven closed-source (Claude Sonnet 4.6 and Gemini, GPT-5 and Grok models; Gemini 3.1 Pro in preview). Two more open models failed the filter (footnote 5). After §5.1 the frontier models are dropped for cost (footnote 7), leaving twelve (Tab. 3).
- **Prompting (§4.2, App. B):** temperature 0, at most 20K output tokens, up to three retries on an invalid output; one fixed template per task asking for JSON with brief reasoning and the answer.
- **Filtering (§3.2, §4.3):** single-instance runs on 2,500 instances per task (250 for Category, footnote 6); models are kept if their average single-instance success exceeds 95% and every task's exceeds 90%, tasks if agreement exceeds 85%. Prompts use only instances all comparison models solve alone, which the authors say makes failures "not attributable to intrinsic instance difficulty or ambiguity" (§3.2).
- **Sampling (§4.4):** five random seeds; ten instance counts from 2 to 2,000 (Category's largest ten times smaller, footnote 6).
- **Correct:** the aggregated answer matches exactly (§3.3).

## Approach

- **RQ1 (§5.1):** success and invalid rates against instance count, per model (Fig. 2, Tab. 2) and per task (Fig. 3); the seed-1 instance sets are reshuffled twice and rerun (Fig. 4).
- **Failures (§5.2):** the instance-level variant, with which the models' relative performance "remains similar to the aggregated-only setting", sorts wrong answers into the four mistake types (Fig. 5); Tab. 3 gives per model how often an experiment has a wrong label and how many a failed one holds. For self-awareness, they count outputs that skip the later instances and check by hand which suggest batch-wise processing.
- **Context length (§6.1):** after each instance, a start marker, seven repetitions of a fixed five-sentence filler, and an end marker, following Hsieh et al. (2024); average instance length grows from about 136 to 326 prompt tokens. Parity is excluded and counts stop at 1,000, 100 for Category (footnote 8). A second check moves the filler to the head, the middle or random positions (Fig. 7).
- **Correlations (§6.2):** long and short sets widen the range of lengths; Spearman correlations of success with instance count and with total context length, then with length at each fixed count (Tab. 4).

## Results

- **Degradation (§5.1, Figs. 2–3):** "all models show noticeable drops above 200 instances and near-collapse beyond 1,000 instances, with success rates falling below 20% at 2,000 instances"; per task the trend is similar, Arithmetic the exception to high success under 50 instances.
- **Models (§5.1, Tab. 2):** "closed-source LLMs do not consistently exhibit superior performance"; the frontier GPT-5, Gemini 3.1 Pro and Grok 4 score highest, but "this advantage comes at substantially higher cost". "instance order has little effect on overall performance" (Fig. 4).
- **Failure types (§5.2, Fig. 5):** wrong answers "can occur even with as few as two instances"; above 200 instances, parsing errors "reach nearly 30% at 2,000 instances"; overlong inputs appear mainly beyond 200, mostly in Language, as non-English inputs "typically require more prompt tokens". Above 100 instances combined mistakes account "for approximately 25% to 45% of failures", and "aggregation remains challenging for LLMs regardless of instance-level correctness or instance count".
- **How mistakes spread (§5.2, Tab. 3):** failed Grok 4 Fast experiments typically hold many wrong labels, Gemini 2.5 Flash's more often few.
- **Self-awareness (§5.2):** 171 of 4,620 experiments omit instances, "almost exclusively at instance counts of 500 or more"; only 27 of them suggest batch-wise processing, GPT-5 Nano most often, "the only model that consistently identifies when a task exceeds its capacity" (§5.3).
- **Length padding (§6.1, Figs. 6–7):** at a fixed count, success with and without padding stays "broadly similar", and the filler's position makes no "substantial performance differences", suggesting that context length alone is "unlikely to fully explain" the degradation.
- **Correlations (§6.2, Tab. 4):** Spearman correlation with success is −0.61 for instance count against −0.37 for context length, both "highly unlikely to arise by chance" by their p-values. At a fixed count, correlations with length lie "between −0.15 and 0.15", p-values "consistently above 0.1". The authors word it as association: degradation is "more strongly associated with" instance count "than total input length".

## Limits the authors state

- No mitigation is evaluated, "such as task decomposition, external tool use, verification, or agentic designs"; the paper "should be interpreted primarily as an empirical characterisation of model behaviour rather than as a prescription for improving MIP reliability" (§ "Limitations").
- Exact aggregation tasks "may overemphasise brittleness in settings where approximate or semantic aggregation would suffice"; whether the findings carry to "softer aggregation objectives (e.g., majority voting, summarisation, or trend identification)" "remains an open question" (§ "Limitations").
- One fixed prompt template, which "may not fully capture the variability of prompt formulations encountered in real-world applications" (§ "Limitations").
- Instance count and context length "are not entirely independent in practice"; finer causal analyses "(e.g., controlled computational complexity or attention-level diagnostics) are left for future work" (§ "Limitations").
- "we did not stress-test LLMs with extremely large context inputs, which might have given different results and perhaps a stronger context length effect" (§ "Limitations").
- No analysis of model internals (such as attention patterns or hidden-state dynamics) and no training-time interventions; English-centric and limited to selected LLMs "due to time and budget constraints"; future work "could explore cross-lingual MIP behaviour and architectural or training modifications explicitly designed for multi-instance reasoning" (§ "Limitations").
- Frontier models are left out after §5.1 for cost (footnote 7); the filter used "a fixed subset of comparison models", the others expected to be "likely to perform similarly" alone (App. C).

## Open problems and building blocks

- **Open:** reliability in MIP "may also require training strategies that explicitly target multi-instance reasoning and aggregation" (§6.3); batching decisions, "for example when developing data science agents", should weigh the number of instances, not only context length (§7). Further items are under Limits.
- **Released:** "Data and code are available" (abstract, footnote 1).
- **To reuse it:** API access to the models (the authors use OpenRouter, §4.2); Tab. 2 gives each closed model's average cost per task.

## On this site

- **Discussed in:** [Reliability that holds with size, by handing the procedure to an engine](#/challenges/engine_offloading_with_size) · [Whole-job reliability of multi-step LLM work](#/challenges/whole_job_reliability)
- **Tags:** <span class="tags"><a class="tag" href="#/tags/compact">compact</a><a class="tag" href="#/tags/llm">llm</a><a class="tag" href="#/tags/longctx">longctx</a><a class="tag" href="#/tags/nl">nl</a><a class="tag" href="#/tags/study">study</a></span>
