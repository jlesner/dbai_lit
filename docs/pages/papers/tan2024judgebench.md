# JudgeBench: A Benchmark for Evaluating LLM-based Judges

**JudgeBench** · ICLR 2025

Read: [PDF](https://arxiv.org/pdf/2410.12784) · [arXiv](https://arxiv.org/abs/2410.12784)  
Code: [JudgeBench](https://github.com/ScalerLab/JudgeBench)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- A benchmark of LLM judges on response pairs whose correctness is objectively checkable.
- Knowledge, reasoning, math and coding pairs.
- Judges are weak on hard pairs: the authors report many strong models (e.g., GPT-4o) "just slightly better than random guessing" (abstract), the same question as for SQL equivalence judges.

## In plain words

LLMs are used as judges that pick the better of two answers: to rank models, as reward signals in training, and to choose among sampled answers (§1). The authors argue that benchmarks for judges mostly measure agreement with crowdsourced human preferences, which on hard tasks can be "a poor indicator of factual and logical correctness" (abstract). They build JudgeBench: 350 pairs of answers to hard knowledge, reasoning, math and coding questions, each pair holding one answer that the source dataset's checker marks correct and one it marks wrong, both sampled from GPT-4o on questions where its samples disagreed. They report that GPT-4o as a judge scores 50.86% with a plain prompt and 56.57% with the more advanced Arena-Hard prompt, which has it answer first (§4.2), and that many strong models are "just slightly better than random guessing" (abstract). The best judge, the reasoning model o3-mini at high effort with that prompt, reaches 80.86% (§4.2). They present a "novel evaluation framework", a "novel pipeline" and a benchmark that "poses a significantly greater challenge than previous benchmarks" (abstract).

## Background and terms

**Terms to know:** [LLM-as-a-judge](#/glossary/llm-as-a-judge) · [best-of-N sampling](#/glossary/best-of-n-sampling) · [reinforcement learning](#/glossary/reinforcement-learning) · [Distillation into compact models](#/glossary/distillation) · [pass@k](#/glossary/passk) · [reward model](#/glossary/reward-model) (on JudgeBench the higher-scoring response of a pair is the one preferred, §2, §4.1; they "can also function as verifiers", §2) · [positional bias](#/glossary/positional-bias) (§4) · [data contamination](#/glossary/data-contamination) (§3 on LiveBench, §4.3) · [self-enhancement bias](#/glossary/positional-bias) (§3) · [RLHF](#/glossary/reinforcement-learning-from-human-feedback-rlhf) (§2)

**The paper's own terms:**
- **hierarchical framework**: three principles a judge should apply in order: the response (1) "must faithfully follow human instructions", (2) "should provide factually and logically correct answers", and (3) its "style should align with human preferences"; style matters only once (1) and (2) are met (§1). JudgeBench rests on principle (2); its incorrect response "may either fail to follow instructions or contain factual errors" (§3).
- **response pair**: one correct and one incorrect response to the same question, both sampled from one model (§3, Fig. 2).
- **prompted, fine-tuned and multi-agent judges**: an LLM with a judging prompt; an LLM fine-tuned on "either crowdsourced preference datasets or on distilled GPT-4 judgments" (§4.1); several LLMs in a pipeline (§2).
- **aggregate decision**: the verdict from two trials with the order swapped, against positional bias. A pair counts as correct when both trials pick the correct response, or one does and the other declares a tie; inconsistent decisions "(e.g., A > B in one trial, A < B in the other)" and two ties count as incorrect (§4). Accuracy is the share of pairs judged correctly.

**Builds on:**
- Benchmarks of agreement between judges and human evaluations: MT-Bench, LLMEval and FairEval (§2), compared against in §4.3.
- LLMBar, which tests whether judges reward instruction following, with clear ground-truth labels; the authors say it "follows a similar intuition" (§1, §2).
- RewardBench, a benchmark of reward models on domains such as safety, chat and reasoning, compared against in §4.3 (§2).
- The source datasets (§3): MMLU-Pro (college-level multiple-choice exam questions in 14 disciplines, up to 10 options) for Knowledge; LiveBench (problems released monthly "to avoid contamination") for Reasoning and Math; LiveCodeBench (contest coding problems) for Coding.

## Problem and setting

- **Question:** how reliable are LLM-based judges at telling a factually and logically correct response from an incorrect one on hard questions (§1)?
- **Labels:** a response is correct when it passes the source dataset's own check against a ground-truth answer (e.g. regex string matching for MMLU-Pro) and, for MMLU-Pro and LiveBench, a second check by GPT-4o-mini agrees; responses where the two checks disagreed were dropped (§3 "Data Filtering and selection", App. A.5).
- **Data:** pairs generated with GPT-4o: 154 Knowledge, 98 Reasoning, 56 Math, 42 Coding (§3). MMLU-Pro and LiveBench questions were randomly subsampled to balance the categories (App. A.3).
- **Judges' settings:** each judge's official implementation, changed only "where necessary"; greedy decoding (temperature 0) for all (App. A.1).

## Approach

- **Pipeline** (§3, Fig. 2): sample k responses per question from a strong model (GPT-4o), grade each, drop questions where all k are correct or all incorrect, and pair a correct with an incorrect response. The idea: "if a model struggles to consistently generate correct, coherent responses to a challenging question, it will also struggle to differentiate between those responses" (§3). One generator keeps the style of both responses alike and, the authors say, mitigates self-enhancement bias; they say the bias it adds instead "is confined to the model used for response generation, while creating a level playing field for all other models" (§3).
- **Judges** (§4.1, App. A.1):
  - prompted: Vanilla (names the preferred response, with no explanation), the Arena-Hard Judge (writes its own answer first as a reference, then compares), and Google's VertexAI Evaluation service (Gemini-based);
  - fine-tuned: PandaLM, three Prometheus2 models, JudgeLM 7B/13B/33B, AutoJ, and Skywork's critics built on Llama-3.1-8B/70B-Instruct;
  - multi-agent: ChatEval, two GPT-4o agents that discuss and then score.

## Results

- **Prompted judges:** GPT-4o scores 50.86% with the Vanilla prompt and 56.57% with the Arena-Hard prompt (Tab. 1); the authors call the first "no better than random guessing" (§4.2).
- **Fine-tuned judges:** "All of our fine-tuned judges (except Skywork) perform significantly below the random baseline" (§4.2); Skywork's 70B critic is best at 57.43% (Tab. 1), a "clear performance boost" over its base model with the Arena-Hard prompt (§4.2). App. A.2 traces the low scores to truncated responses, ties and invalid verdicts (Tab. 5), and inconsistent verdicts across the two trials (Tab. 6).
- **Underlying models** (Tab. 2): o3-mini at high reasoning effort leads with 80.86%, against 64.29% for Claude-3.5-Sonnet, the best "general-purpose" model (§4.2). The authors read the reasoning models' results as indicating that "scaling test-time compute is a promising path" for judges (§4.2).
- **Reward models** (Tab. 3): they "generally outperform" the LLM judges (§4.2). Skywork's reward model on Llama-3.1-8B scores 62.29% against 40.86% for the base model as an Arena-Hard judge, which the authors take to indicate that "training a specialized verifier from a weak model to judge a stronger model is possible" (§4.2).
- **Against other benchmarks** (§4.3): with five models and the Arena-Hard prompt, JudgeBench is "the most challenging dataset", its strongest model's accuracy "the lowest among all five datasets" (Fig. 3), and its gap between the best and the weakest model is comparable to LLMBar's adversarial set. RewardBench's reasoning sets are "very saturated", with the strongest model "up to 97%", against "only 64%" for top reward models on JudgeBench; the authors call the saturation "likely due to data contamination" (§4.3).
- **Solver against judge** (§4.4, Tab. 4): with the same model asked to answer directly (solver) or to pick from the pair (judge), the judge's accuracy "closely mirrors that of the solver"; the solver beats the judge on Coding for all four models, and judges "significantly outperform solvers" on Math. The authors conclude that judging ability "is highly correlated" with solving ability (§4.4).
- **Generator bias** (§4.4, Fig. 4): on a second split of 270 pairs generated by Claude-3.5-Sonnet, Claude-3.5-Sonnet drops from 64.3% on GPT-4o's pairs to 44.8% on its own, and GPT-4o is lower on Claude's pairs than on its own, which the authors say "suggests" Claude-3.5-Sonnet is "a stronger reasoning model"; other models show "similar performance gaps", which they read as the pairs remaining "consistent in evaluating model capabilities" (§4.4).
- **Checks of the benchmark:** on the Knowledge set enlarged from 154 to 770 pairs, six models keep their ranking (App. A.3, Tab. 8); correct and incorrect responses have almost the same average length, which the authors say "effectively mitigates length bias" (App. A.4).

## Limits the authors state

- The generator model: "the dataset may be disproportionately challenging for that particular model compared to others, as different models may not struggle with the same questions" (§3).
- Automated checks: "some responses were marked incorrect due to minor formatting issues, even though their solutions were correct", which they handle by the second check and dropping disagreements (§3).
- The o1-mini and o1-preview results with the Arena-Hard prompt "may not have respected these token constraints nor the zero temperature" (App. A.1.1); the Vertex service "offers little to no ability to set generation parameters" (App. A.1.1).
- PandaLM and JudgeLM have 2048-token context windows, so both responses were truncated from the left (App. A.1.2, App. A.2); only PandaLM's 7B variant was public, so its 70B variant is not evaluated (App. A.1.2).
- All models "still have considerable room for improvement" (§4.2).

## Open problems and building blocks

  - "enhancing the reasoning capabilities of LLM-based judges is essential for advancing the overall performance of AI systems--an area that remains largely underexplored"; "we leave improving the LLM-based judges as future work" (§4.2).
  - The bottleneck they name: "LLM-based judges risk becoming a bottleneck to further scaling"; repeated sampling "can improve" coverage (the share of problems solved) "when an oracle-level verifier is available", but a verifier that is not strong enough "becomes the limiting factor" (§4.2, citing [Large Language Monkeys](#/papers/brown2024monkeys "Large Language Monkeys: Scaling Inference Compute with Repeated Sampling (2024)")).
  - They hope the framework and benchmark "can offer insights into future dataset design" (§ "Conclusion").
- **Released:** "Data and code are available" (abstract).
- **To reuse it:** a source dataset "with ground truth labels and verification mechanisms" that is itself difficult (§3); a strong model to sample k responses per question; GPT-4o-mini as their second checker (§3, App. A.5).
- **Beyond its domain:** the authors say JudgeBench "can also be used as a benchmark to evaluate the underlying model's capability" (§4.1) and "can also be used to assess reward models" (§4.1).

## On this site

- **Discussed in:** [Sourcing realistic, hard query pairs](#/challenges/query_pair_sourcing) · [Weak checkers get exploited](#/challenges/weak_checker_exploitation)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/judge-general">judge-general</a><a class="tag sub" href="#/tags/llm-method">llm-method</a></span>
