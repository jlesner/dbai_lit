# Large Language Models Cannot Self-Correct Reasoning Yet

**Large Language Models Cannot…** · ICLR 2024

Read: [PDF](https://arxiv.org/pdf/2310.01798) · [arXiv](https://arxiv.org/abs/2310.01798)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Tests intrinsic self-correction, where a model reviews its own answer and answers again with no external feedback, on GSM8K, CommonSenseQA and HotpotQA with GPT-3.5, GPT-4, GPT-4-Turbo and Llama-2 (§2; §3.1).
- Reruns earlier self-correction setups and names three evaluation flaws (Tab. 1): gains that come from oracle labels deciding when to stop (RCI, Reflexion; §3.2), multi-agent debate compared with self-consistency on fewer responses (§4, Tab. 7), and initial prompts that withhold what the feedback prompt adds (Self-Refine; §5, Tab. 8).
- Self-review without a check: the authors report that without oracle labels accuracy drops after self-correction for every model on every benchmark (§3.2, Tabs. 3–4), as models "cannot properly judge the correctness of their reasoning" (§3.3), and recommend external feedback such as code execution with unit tests (§6). The self-critique side of the contrast [On the Self-Verification Limitations…](#/papers/stechly2024selfverification "On the Self-Verification Limitations of Large Language Models on Reasoning and Planning Tasks (2024)") tests against a sound verifier; [Correction and Corruption](#/papers/reitich2026correction "Correction and Corruption: A Two-Rate View of Error Flow in LLM Protocols (2026)") re-reads its GSM8K totals (§2.3).

## In plain words

Self-correction asks an LLM to review its own answer and then answer again. The authors ask whether this helps reasoning when nothing outside the model says whether the answer is right, a setting they call intrinsic self-correction. They argue the setting matters because "high-quality external feedback is often unavailable in many real-world applications" (§1). They rerun earlier self-correction setups on grade-school math, commonsense and multi-hop questions with GPT-3.5, GPT-4, GPT-4-Turbo and Llama-2 (§3.1). They report that the gains of two earlier studies came from using the correct answer to guide the process (§1), and that without it, "after self-correction, the accuracies of all models drop across all benchmarks" (§3.2): GPT-3.5 on commonsense questions falls from 75.8 to 41.8 after two rounds (Tab. 3). They also report that several model copies critiquing each other do no better than a plain majority vote over an equal number of answers on the math questions (§1, §4). The paper presents itself as a critical examination of self-correction (abstract), not a new method, and ends with guidelines for fair evaluation (§6).

## Background and terms

**Terms to know:** [self-correction](#/glossary/self-correction) · [self-consistency (majority voting)](#/glossary/self-consistency-majority-voting) · [compute-matched comparison](#/glossary/compute-matched-comparison) · [greedy decoding and temperature sampling](#/glossary/greedy-decoding-and-temperature-sampling) · [multi-hop question answering](#/glossary/multi-hop-question-answering) · [exact match](#/glossary/exact-match)

**The paper's own terms:**
- **self-correction**: the authors say its definition "varies across the literature", and split feedback into internal (from the model's own knowledge) and external (humans, other models, tools or knowledge sources), following Pan et al. (2023) (§2). In the rest of the paper the word means intrinsic self-correction "unless explicitly stated otherwise" (§2).
- **intrinsic self-correction**: self-correction "without any external or human feedback" (§2); the model itself decides when to stop, "i.e., whether to retain their previous answers" (§3.2).
- **oracle labels**: the ground-truth answer, used to check each step's answer; once it is correct, no further self-correction is run (§3.2). Rows "Self-Correct (Oracle)" in Tab. 2.
- **Standard Prompting**: the first, initial answer, which is also the no-self-correction baseline (§3.1).
- **Self-Correct (round 1 / round 2)**: the answer after one or two cycles of review and re-answer; "# calls" counts model calls, 3 and 5 (Tabs. 3–6).
- **feedback prompt**: the instruction that asks the model to review its previous answer; Tabs. 5–6 vary it.
- **multi-agent debate**: "multiple LLM instances (can be multiple copies of the same LLM) critique each other's responses" (§1).
- **Constrained Generation (CommonGen-Hard)**: the task of Self-Refine (Madaan et al., 2023; iterative refinement with the model's own feedback) where the model must "generate coherent sentences using all 20-30 input concepts", scored by concept coverage, the metric of Madaan et al. (2023), which this paper does not define further (§5, Tab. 8).

**Missing glossary terms:**
- **closed-book question answering**: answering from the model's own knowledge, with no documents retrieved or supplied; the paper tests HotpotQA "in a closed-book setting" without defining it (§3.1).

**Builds on:**
- The methods it re-examines (Tab. 1): RCI (Kim et al., 2023), a prompting method in which the model critiques and improves its own output, and Reflexion (Shinn et al., 2023; [Reflexion](#/papers/shinn2023reflexion "Reflexion: Language Agents with Verbal Reinforcement Learning (2023)")), an agent that writes a reflection after a failed attempt and retries, whose oracle-label setups and prompts §3 follows; multi-agent debate (Du et al., 2023, cited with Liang et al., 2023), replicated in §4; and Self-Refine (Madaan et al., 2023), whose Constrained Generation task §5 reruns.
- Self-consistency (Wang et al., 2022; [Self-Consistency](#/papers/wang2022selfconsistency "Self-Consistency Improves Chain of Thought Reasoning in Language Models (2023)")), sampling several answers and taking a majority vote, the baseline in §4.
- Pan et al. (2023), for the split between internal and external feedback (§2).

## Problem and setting

- **Question:** can LLMs improve their reasoning answers by reviewing them with no external feedback (§1, §2)? And do earlier self-correction evaluations measure that fairly (§2, Tab. 1)?
- **Benchmarks (§3.1):** GSM8K, 1,319 grade-school math word problems (test set); CommonSenseQA, multiple-choice commonsense questions (dev set, 1,221 questions); HotpotQA, open-domain multi-hop questions, closed-book, on the 100-question set of Shinn et al. (2023), scored by exact match. The authors chose datasets "where existing self-correction methods with oracle labels have demonstrated significant performance improvement" (§3.1). §5 adds CommonGen-Hard.
- **Models (§3.1):** GPT-3.5-Turbo (`gpt-3.5-turbo-0613`) and GPT-4 (accessed 2023/08/29), with and without oracle labels; GPT-4-Turbo (`gpt-4-1106-preview`) and Llama-2 (`Llama-2-70b-chat`) for intrinsic self-correction only. GPT-3.5 runs on the full sets; the other models on 200 random questions per dataset (100 for HotpotQA), "to reduce the cost". Temperature 1 for GPT-3.5 and GPT-4, 0 for GPT-4-Turbo and Llama-2.
- **Scores:** accuracy on GSM8K and CommonSenseQA, exact match on HotpotQA (§3.1–3.2).
- §4 uses `gpt-3.5-turbo-0301` on the full GSM8K test set (§4).

## Approach

An evaluation study, with no new method.

- **Three-step loop (§3.1):** answer; review the previous answer and write feedback; answer the question again with that feedback. At most two rounds. Prompts mostly come from the source papers; for GSM8K and CommonSenseQA the authors add format instructions to Kim et al.'s prompts for automatic scoring (§3.1; App. A, Figs. 3–6).
- **With and without oracle labels (§3.2):** first the earlier papers' setting, where the label stops the loop once the answer is right; then the intrinsic setting, where the model decides. Three feedback prompts are compared on GPT-4-Turbo and Llama-2 (Tabs. 5–6).
- **Empirical Analysis (§3.3, Fig. 1):** after two rounds, each answer is classed as unchanged, correct → incorrect, incorrect → correct, or incorrect → incorrect. HotpotQA is left out "because the sample size used in the source paper is quite small" (§3.3, footnote).
- **Debate against equal-cost voting (§4):** Du et al.'s exact prompt, 3 agents and 2 rounds, compared with self-consistency at 3, 6 and 9 responses (Tab. 7).
- **Prompt fairness (§5):** the authors add "Write a reasonable paragraph that includes *ALL* of the above concepts" to the initial Constrained Generation prompt, then apply Self-Refine's self-correction on top (Tab. 8, App. A, Figs. 7–8).
- **Intuitive Explanation (§3.3):** "If the model is well-aligned and paired with a thoughtfully designed initial prompt", the first answer "should already be optimal relative to the prompt and the specific decoding algorithm"; in the intrinsic setting on reasoning tasks, the feedback prompt "may not offer any extra advantage" and "might even bias the model away" from the best answer.

## Results

- **With oracle labels (Tab. 2):** the authors report gains "consistent with" the earlier papers (§3.2), e.g. GPT-3.5 on GSM8K from 75.9 to 84.3. They add that such results "can only be regarded as indicative of an oracle's performance" (§3.2).
- **Intrinsic (Tabs. 3–4):** the authors report that accuracy drops after self-correction for all models and benchmarks (§3.2), e.g. GPT-4 on GSM8K from 95.5 to 89.0 after two rounds, and Llama-2 drops on both GSM8K and CommonSenseQA. With other feedback prompts, "self-correction consistently results in a decrease in performance" (§3.2, Tabs. 5–6), though performance "varies with different feedback prompts" (§5).
- **Why (§3.3, Fig. 1):** on GSM8K, GPT-3.5 keeps its first answer 74.7% of the time, and among the rest it more often turns a correct answer wrong than a wrong one right. The authors' diagnosis: "The fundamental issue is that LLMs cannot properly judge the correctness of their reasoning." On CommonSenseQA, GPT-3.5 changes answers more often, which the authors attribute to wrong options that "often appear somewhat relevant"; Llama-2 also often turns correct answers wrong; GPT-4 and GPT-4-Turbo keep their first answers more often than GPT-3.5 and Llama-2, which the authors say "may be because" they "have higher confidence in their initial answers, or because they are more robust".
- **Debate (§4, Tab. 7):** debate beats standard prompting and is "only slightly better" than self-consistency with 3 responses, but at 9 responses it scores 83.0 against 88.2 for self-consistency. The authors call debate a means to achieve "consistency" across generations and attribute its gain to "self-consistency", not "self-correction" (§4).
- **Prompt design (§5, Tab. 8):** with `gpt-3.5-turbo-0613`, the authors' fuller initial prompt scores 81.8 concept coverage with no self-correction, above Self-Refine's reported 67.0 after self-correction; applying Self-Refine's self-correction on top of it lowers it to 75.1.

## Limits the authors state

- The work "focuses on evaluating reasoning of LLMs"; "it is plausible that there exist self-correction strategies that could enhance LLM performance in other domains", e.g. aligning responses with preferences such as style or safety (§7).
- LLMs "can properly evaluate whether a response is inappropriate", "but they may struggle to identify errors in their reasoning" (§7).
- No answer-change analysis on HotpotQA, whose sample size "may not produce meaningful statistics" (§3.3, footnote).

## Open problems and building blocks

  - The bottleneck they name: "determining how to prevent such mischanges is, in fact, the key to ensuring the success of self-correction" (§3.3), i.e. stopping the model from turning a correct answer wrong.
  - Use "valid external feedback" when available: code execution results, where, "when the problem description clearly specifies the intended code execution behavior, e.g., with unit tests, the code executor serves as the perfect verifier" (Chen et al., 2023b; [Self-Debugging](#/papers/chen2023selfdebug "Teaching Large Language Models to Self-Debug (2023)")), external tools such as search engines and calculators (Gou et al., 2023), and trained verifiers or critique models (Cobbe et al., 2021, [GSM8K and trained verifiers](#/papers/cobbe2021verifiers "Training Verifiers to Solve Math Word Problems (2021)"); Lightman et al., 2023, [Let's Verify Step by Step](#/papers/lightman2023verify "Let's Verify Step by Step (2023)"); Wang et al., 2023b) (§6). Techniques that let LLMs "interact with the external environment and learn from different kinds of available feedback" are "a promising direction for future work" (§6).
  - Evaluation guidelines (§6): report "an in-depth inference cost analysis", compare against strong multi-response baselines "like self-consistency", and invest "equal effort" in the initial and feedback prompts.
  - Models "with a higher probability of decoding the optimal solution in their answer distributions, possibly through some alignment techniques" (§6); and approaches "that can genuinely enhance reasoning" (§7).
- **Released:** no code or data stated. The Reproducibility Statement says the exact prompts the authors designed are in App. A, and that they give the model versions or access times used.
- **To reuse it:** the prompts (App. A) and the model versions, temperatures and sample sizes of §3.1 and §4; GPT-3.5 and GPT-4 are accessible "via the public API" and Llama-2 is "an open-source model" (Reproducibility Statement).

## On this site

- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/harness-general">harness-general</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/scaling-general">scaling-general</a></span>
