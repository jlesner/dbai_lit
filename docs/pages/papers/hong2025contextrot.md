# Context Rot: How Increasing Input Tokens Impacts LLM Performance

**Context Rot** · Chroma technical report 2025

Read: [Paper](https://www.trychroma.com/research/context-rot)  
Code: [context-rot](https://github.com/chroma-core/context-rot)

<p class="notice">A summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Measures 18 LLMs as input length grows on tasks whose difficulty is held fixed: needle-in-a-haystack variants (needle–question similarity, distractors, needle–haystack similarity, shuffled against coherent haystacks), LongMemEval chat-history questions with only the relevant parts or the full history, and copying a run of repeated words (PDF pp. 3–5, 9–10, 24).
- The needle and LongMemEval answers are graded by a GPT-4.1 judge whose prompt was revised until it agreed with more than 99% of about 500 and 600 hand labels (Appendix, PDF pp. 44–45); the copying task is scored by normalized Levenshtein distance (PDF p. 31).
- The source listed [RLM (Recursive Language Models)](#/papers/zhang2025rlm "Recursive Language Models (2025)") cites for "context rot" (§1); [Attention Tax, Handoff Tax](#/papers/anchan2026handofftax "Attention Tax, Handoff Tax: A Stylised Model of When Multi-Agent LLM Systems Help (2026)") (§2) and [StaminaBench](#/papers/sobal2026staminabench "StaminaBench: Stress-Testing Coding Agents over 100 Interaction Turns (2026)") (§5) cite it too. The authors report that "model performance consistently degrades with increasing input length" on their needle tests (PDF p. 10; not for the strongest models in one of the four needle–haystack combinations), and on copying text (PDF p. 32), a task they contrast with "a basic program that repeats a string n times" (PDF p. 29); evidence that reading data in context fails as the data grows, which handing the work to an engine avoids.

## In plain words

Long-context LLMs are often assumed to use a long input uniformly, because they score near-perfectly on benchmarks such as Needle in a Haystack, which hides one sentence in a long unrelated document and asks for it back (PDF p. 3). The authors argue this test typically checks word-for-word matching, and that tasks often get harder as inputs grow, hiding the effect of length alone (PDF pp. 3, 5). They test 18 models, including GPT-4.1, Claude 4, Gemini 2.5 and Qwen3, on simple tasks held fixed in difficulty while only the input grows: needle-test variants, questions about a chat history, and copying repeated words (PDF pp. 1, 3–4). They report that performance "consistently degrades with increasing input length" (PDF p. 10), "often in surprising and non-uniform ways" (PDF p. 4). For example, every model answered chat-history questions better from the relevant parts alone than from the full history; Claude Opus 4 without thinking scored 0.92 against 0.38, as graded by a GPT-4.1 judge (PDF p. 26). It presents itself as extending the needle test to "previously underexplored settings" (PDF p. 3).

## Background and terms

**Terms to know:** [LLM-as-a-judge](#/glossary/llm-as-a-judge) · [Levenshtein distance](#/glossary/levenshtein-distance) · [dense retrieval](#/glossary/dense-retrieval) · [vector store](#/glossary/vector-store) · [greedy decoding and temperature sampling](#/glossary/greedy-decoding-and-temperature-sampling) · [data contamination](#/glossary/data-contamination) · [needle in a haystack (NIAH)](#/glossary/needle-in-a-haystack-niah) (the test the report extends, PDF p. 3) · [cosine similarity](#/glossary/cosine-similarity) (between embeddings, PDF pp. 9, 11–12) · [context engineering](#/glossary/context-engineering) (PDF p. 42)

**The paper's own terms:**
- **needle, haystack**: the sentence that answers the question, and the long unrelated text hiding it (opening, PDF p. 3): Paul Graham essays or arXiv papers (PDF p. 9).
- **distractor** and **irrelevant content**: "Distractors are topically related to the needle, but do not quite answer the question"; "Irrelevant content is unrelated to the needle and question" (PDF p. 8).
- **needle-question similarity**: the cosine similarity of the needle's and the question's embeddings, averaged over five embedding models; **needle-haystack similarity**: the same for a needle and its five most similar haystack chunks (§ "Needle in a Haystack Extension", PDF p. 9).
- **Original** and **Shuffled** haystacks: Original "preserves the natural flow of ideas within each excerpt"; in Shuffled, "sentences are randomly reordered throughout the haystack" (PDF p. 10).
- **focused** and **full** input (LongMemEval): only the parts of the chat history relevant to the question, about 300 tokens on average, against the whole history, about 113k tokens (§ "LongMemEval", PDF pp. 24–26).
- **hallucination** and **abstention**: a failed answer that gives one of the distractors, or one that says no answer can be found (§ "Impact of Distractors", PDF pp. 17–18).
- **position accuracy** and **word count difference**: whether the unique word appears at its correct index, and input words minus output words, negative when the model over-generated (PDF p. 32, p. 35).

**Missing glossary terms:** none.

**Builds on:**
- Needle in a Haystack, Kamradt (2023): the test the report extends (PDF pp. 3, 6).
- NoLiMa, Modarressi et al. (2025), a needle benchmark whose pairs need non-lexical matches (matching by meaning, not shared words) (§ "Related Work", PDF p. 5; PDF p. 7).
- LongMemEval, Wu et al. (2025), a chat-memory benchmark, the realistic setting (§ "LongMemEval", PDF pp. 24–25).

## Problem and setting

- **Question:** how input length alone affects performance, with task complexity held constant (§ "Introduction", PDF p. 5).
- **Models:** 18 from Anthropic, OpenAI, Google and Alibaba (§ "Appendix", "Models Tested", PDF pp. 45–46), with and without thinking mode where available (PDF p. 11).
- **Needle tests** (§ "Needle in a Haystack Extension", "Details", PDF pp. 10–11): per combination of needle type, haystack topic and structure, 8 input lengths and 11 needle positions across each model's maximum context window, at temperature 0 unless incompatible (o3) or discouraged (Qwen's thinking mode); Qwen is extended to 131,072 tokens with YaRN (a context-window extension method).
- **What counts as correct:** the authors check by vector-database search and by hand that the haystack holds no other answer, so "any incorrect answers are due to model hallucinations" (PDF p. 12). A GPT-4.1 judge grades the needle and LongMemEval answers; its prompt was revised on disagreements until it agreed with about 500 (needle) and 600 (LongMemEval) hand labels at "an alignment score > 0.99" (§ "Appendix", "LLM judge alignment", PDF pp. 44–45).
- **LongMemEval:** LongMemEval_s, filtered to knowledge-update, temporal-reasoning and multi-session questions and cleaned by hand to 306 prompts (PDF p. 25).
- **Repeated Words** (§ "Repeated Words", PDF pp. 29–32): copy a run of one word with a single different word at a set position; 7 word pairs, 12 lengths from 25 to 10,000 words; an output budget of twice the input tokens, up to each model's output limit, temperature 0, a thinking budget of 0 or the minimum; o3 left out. Scores are "calculated by normalized Levenshtein distance" (PDF p. 31).

## Approach

- **Needles** (§ "Needle-Question Similarity", PDF pp. 11–12): the authors cluster the haystack's chunks by their embeddings, reduced with UMAP and clustered with HDBSCAN (both unsupervised methods), pick one theme per topic (writing advice; re-ranking of search results), and write one question and 8 needles per topic that "topically blend into the haystack", by hand "to avoid data contamination", of varied similarity to the question.
- **Distractors** (§ "Impact of Distractors", PDF pp. 14–15): one high-similarity needle per topic ("second highest out of eight"), four hand-written distractors, and three conditions: none, one randomly positioned, all four.

## Results

All are the authors' claims.
- **Needle-question similarity**: performance "degrades more quickly in input length with lower similarity needle-question pairs" (PDF p. 13). As models do well even on low-similarity pairs at short inputs, most clearly the high- and medium-performance models (the charts' top and middle groups), the authors conclude the drop is "not due to the intrinsic difficulty of the needle-question pairing"; needle position shows "no notable variation in performance for this specific NIAH task" (PDF p. 14).
- **Distractors**: "Even a single distractor reduces performance relative to the baseline", and four compound it (PDF p. 15); distractors differ in impact (PDF pp. 16–17). The authors report that Claude models have the lowest hallucination rates, with Claude Sonnet 4 and Opus 4 tending to abstain when uncertain, and GPT models the highest (PDF p. 18): with four distractors, in the arXiv haystack with essay needles, abstentions are 0.737 of Claude's failed answers against 0.049 of GPT's (chart, PDF p. 18).
- **Needle-haystack similarity** (PDF p. 20): in the essay haystack, arXiv needles score 94.6% against 84.1% for essay needles; in the arXiv haystack, 82.4% against 82.9%, "only minimal performance differences".
- **Haystack structure**: "structural coherence consistently hurts model performance" (PDF p. 21); averaged over 18 models, shuffled haystacks score higher in all four needle–haystack combinations, e.g. 86.6% against 78.1% for arXiv needles in the arXiv haystack (PDF p. 23).
- **LongMemEval** (PDF pp. 26–29): focused prompts beat full ones for every model, e.g. Claude Opus 4 without thinking 0.92 against 0.38, Gemini 2.5 Pro with thinking 0.96 against 0.90 (PDF pp. 26, 28). Claude's gap, the largest, is "largely driven by abstentions" (PDF p. 26). Thinking brings "notable gains on both focused and full prompts", but a gap remains "even with full reasoning capabilities on the latest models" (PDF p. 27).
- **Repeated Words** (PDF pp. 32–42): "performance consistently degrades across all models" as context length grows (PDF p. 32). Claude Opus 4 degrades most slowly of the Claude models but is the only one to refuse, on 2.89% of attempts (PDF p. 33); the unique word is placed correctly most often near the start, "especially as input length increases" (PDF p. 34); at long lengths models often repeat the word up to the output limit (PDF p. 35), some emitting words not in the input (PDF pp. 39–41). GPT-3.5 Turbo is excluded for refusing 60.29% of tasks (PDF p. 32).

## Limits the authors state

- "this evaluation is not exhaustive of real-world use cases"; in applications needing synthesis or multi-step reasoning the authors "would expect performance degradation to be even more severe" (§ "Limitations & Future Work", PDF p. 42).
- "We also do not explain the mechanisms behind this performance degradation", which is "beyond the scope of this report" (PDF p. 42).
- "Testing across only two topics is insufficient to draw a generalizable conclusion that higher needle-haystack similarity degrades model performance on this task" (PDF p. 20).
- Not all 18 models are in each experiment, because of context-window or thinking-budget constraints (PDF p. 45).
- Where models do exceptionally well (essay haystack, arXiv needles), the high-performance models' apparent uniformity "does not hold across the rest of the experiments" (§ "Appendix", PDF p. 49).
- In Repeated Words, attempts that open with a remark are scored the same way, to "slightly penalize the model for not following exact instructions" (PDF p. 32).

## Open problems and building blocks

  - "to disentangle how much of a model's performance degradation stems from the intrinsic difficulty of the task itself versus its ability to effectively handle long contexts" (PDF p. 42).
  - Context engineering, "a meaningful direction of future work for optimizing model performance" (PDF p. 42), and "the need for more rigorous long-context evaluation beyond current benchmarks" (§ "Conclusion", PDF p. 43).
  - Needle-haystack similarity, "an underexplored area in long-context benchmarks" (PDF p. 21).
  - How attention is influenced by input structure, "a potential direction for interpretability research" (PDF p. 24).
  - Correlations between the unique word's position and where random words start, which "may be a direction for future investigation" (PDF p. 39).
- **Released:** "The complete codebase to replicate our results" (§ "Contributions", PDF p. 5); the cleaned LongMemEval datasets and the needles and distractors (§ "Appendix", PDF p. 44).
- **To reuse it:** access to the tested models, five embedding models (PDF p. 46) and GPT-4.1 as judge (PDF pp. 44–45); the needle experiments took 194,480 LLM calls (PDF p. 11).

## On this site

- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/general-misc">general-misc</a><a class="tag sub" href="#/tags/llm-misc">llm-misc</a></span>
