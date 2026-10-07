# Self-Consistency Improves Chain of Thought Reasoning in Language Models

**Self-Consistency** · ICLR 2023

Read: [PDF](https://arxiv.org/pdf/2203.11171) · [arXiv](https://arxiv.org/abs/2203.11171)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Sample several reasoning paths and take the majority answer.
- Marginalizes over chains of thought.
- Majority voting as a baseline: "known to be a strong baseline" in [Let's Verify Step by Step](#/papers/lightman2023verify "Let's Verify Step by Step (2023)") (§3), one of "two common methods" for verification in [Large Language Monkeys](#/papers/brown2024monkeys "Large Language Monkeys: Scaling Inference Compute with Repeated Sampling (2024)") (§1).

## In plain words

Chain-of-thought prompting asks a large language model to write out its reasoning before its answer, and the answer is usually read from one greedy decode, which takes the most likely next word at each step (abstract, §1). The authors start from the intuition that "complex reasoning tasks typically admit multiple reasoning paths that reach a correct answer" (§1). They propose [self-consistency](#/glossary/self-consistency-majority-voting): sample many reasoning paths from the same model and return the final answer that most of them reach, with no training, extra model or extra labels (§1, §2). They test it with four models of 20 to 540 billion parameters on arithmetic, commonsense and symbolic reasoning benchmarks (§3.1). Their headline: on GSM8K, a grade-school math benchmark, PaLM-540B's accuracy rises from 56.5% with one greedy decode to 74.4% with 40 sampled paths, averaged over 10 runs (Tab. 2, §3.2). They present it as "a novel decoding strategy" (§1) that is "far simpler" than training a verifier or re-ranker (§1), and report "new state-of-the-art results on almost all tasks" of arithmetic reasoning (§3.2).

## Background and terms

**Terms to know:** [self-consistency (majority voting)](#/glossary/self-consistency-majority-voting) · [top-k and nucleus (top-p) sampling](#/glossary/top-k-and-nucleus-top-p-sampling) · [beam search](#/glossary/beam-search) · [reranking](#/glossary/reranking) · [exact match](#/glossary/exact-match) · [F1 score](#/glossary/f1-score) · [greedy decoding and temperature sampling](#/glossary/greedy-decoding-and-temperature-sampling) (greedy decoding is used undefined, §1; temperature sampling is cited, §2)

**The paper's own terms:**
- **CoT-prompting**: the baseline, chain-of-thought prompting with greedy decoding, as in Wei et al. (2022) (§3.2).
- **reasoning path, final answer**: each output's reasoning text, and the answer parsed after "The answer is": the first number for arithmetic, the full string for commonsense tasks (§2, footnote 1).
- **marginalizing out the reasoning paths**: here, a majority vote over the final answers (§2).
- **weighted sum / weighted average**: aggregations that weight each output by its probability, raw or normalized by length (Eq. 1, §2).
- **self-ensemble**: aggregating many outputs of a *single* model, unlike an ensemble of several models (§1, §3.4).
- **sample-and-rank**: keep the sampled output with the highest log probability (§3.4).
- **consistency**: the share of sampled decodes that agree with the voted answer (§3.5).
- **out-of-distribution (OOD) setting**: symbolic tasks prompted with 2-letter or 2-flip examples and tested on 4 (§3.2).
- **standard prompting**: few-shot prompting without written reasoning (Tab. 5).

**Builds on:**
- Chain-of-thought prompting, Wei et al. (2022): the method it decodes, its prompts and its baseline (§1, §3.1).
- Trained verifiers and re-rankers, Cobbe et al. (2021) ([GSM8K and trained verifiers](#/papers/cobbe2021verifiers "Training Verifiers to Solve Math Word Problems (2021)")) and Thoppilan et al. (2022) (a re-ranker trained on human annotations): self-consistency is "far simpler", needing neither (§1, §4).
- Temperature, top-k and nucleus sampling, which it is "compatible with" (§2).
- The methods it compares against: sample-and-rank (Adiwardana et al., 2020), beam search, and prompt ensembles (Zhao et al., 2021; Lu et al., 2021; Gao et al., 2021) (§3.4).

## Problem and setting

- **Question:** does sampling many reasoning paths and voting on the answer, instead of one greedy decode, improve chain-of-thought accuracy with an off-the-shelf model (§1, §2)?
- **Answers** must come from a fixed answer set, so they can be compared and counted (§2).
- **Models** (§3.1): UL2-20B (an open-sourced encoder-decoder model), GPT-3 175B through the public Codex engines code-davinci-001 and -002, and the dense decoder-only LaMDA-137B and PaLM-540B. Few-shot prompting only, "without training or fine-tuning" (§3.1).
- **Benchmarks** (§3.1): arithmetic word problems (AddSub, MultiArith, ASDiv, AQUA-RAT, GSM8K and the challenge set SVAMP); commonsense question answering (CommonsenseQA, StrategyQA, and the AI2 Reasoning Challenge ARC, easy and challenge); and two symbolic tasks, last-letter concatenation (join the last letters of the words) and Coinflip (is a coin still heads up after some flips). §3.3 adds closed-book question answering, from the model's own knowledge (BoolQ, HotpotQA) and natural language inference, deciding whether a premise supports a hypothesis (e-SNLI, ANLI, RTE).
- **Prompts:** Wei et al.'s, "the same set of 8 manually written exemplars" for all arithmetic tasks (§3.1), and 4–7 exemplars per commonsense task (§3.1); all listed in App. A.3.
- **Sampling** (§3.1): temperature 0.5 with top-40 for UL2-20B and LaMDA-137B, 0.7 with top-40 for PaLM-540B, 0.7 without top-k for GPT-3.
- **Comparison:** 40 sampled outputs per question, averaged over 10 runs, against CoT-prompting (§3.2). Scored by accuracy; HotpotQA by exact match and F1 (Tab. 5).

## Approach

- **Three steps** (Fig. 1): prompt with chain-of-thought exemplars; sample a diverse set of reasoning paths instead of the greedy one; choose the most common final answer (§1, §2).
- **Why:** the authors "hypothesize that correct reasoning processes, even if they are diverse, tend to have greater agreement in their final answer than incorrect processes" (§2).
- **Aggregation** (Tab. 1, PaLM-540B): a plain majority vote gives "a very similar accuracy" to weighting by length-normalized probability, and the weighted average does "much worse" (§2). The authors explain that the normalized probabilities are close, so the model regards outputs as "similarly likely"; a footnote adds that the model "is not well calibrated" (§2, footnote 2).
- It uses one model and no verifier, re-ranker or extra annotation (§1, §4).

## Results

The authors report:
- **Arithmetic** (Tab. 2): self-consistency "improves the arithmetic reasoning performance over all four language models significantly" (§3.2); GSM8K goes from 56.5% to 74.4% on PaLM-540B and from 60.1% to 78.0% on code-davinci-002. the authors say "the gains become more significant when the language model's scale increases" (§3.2). Previous bests include GPT-3 fine-tuned with a trained verifier on GSM8K (Tab. 2 notes).
- **Commonsense and symbolic** (Tab. 3): "large gains across all four language models, and obtained SoTA results on 5 out of 6 tasks" (§3.2; SoTA: state of the art); in the OOD symbolic setting the gain is "still quite significant compared to CoT-prompting with sufficient model sizes" (§3.2).
- **Number of paths** (Fig. 2; Fig. 7–8): "sampling a higher number (e.g., 40) of reasoning paths leads to a consistently better performance" (§3.2).
- **When chain of thought hurts** (Tab. 5, PaLM-540B): on some tasks, e.g. ANLI-R1, e-SNLI and RTE, CoT-prompting is below standard prompting; self-consistency is highest on every listed task, HotpotQA included (§3.3).
- **Sample-and-rank** (Fig. 3, code-davinci-001, equal samples): its gain "is much smaller compared to self-consistency" (§3.4).
- **Beam search** (Tab. 6, UL2-20B, AQuA and MultiArith, equal beams and paths): "On both tasks self-consistency outperforms beam search significantly", and beam-decoded self-consistency is worse than sampled, which the authors attribute to lower diversity (§3.4).
- **Ensembles** (Tab. 7, LaMDA-137B, GSM8K): CoT 17.1%, 3 prompt sets 18.6%, 40 prompt permutations 19.2%, self-consistency 27.7% (§3.4). Multi-model ensembles "perform much worse" (§3.4, Tab. 10), and self-consistency is "completely compatible" with prompt ensembles (App. A.1.4, Tab. 11).
- **Robustness** (§3.5): to temperature, top-k and nucleus settings (Fig. 4 left, PaLM-540B; Fig. 6); across LaMDA model sizes (Fig. 4 right); across 3 prompt sets for GSM8K on PaLM-540B (App. A.1.2, Tab. 9).
- **Prompts** (Tab. 8, GSM8K): with reasoning numbers randomized except the final answer, LaMDA-137B's greedy accuracy falls from 17.1% to 14.9% and self-consistency reaches 23.4%; with zero-shot chain of thought (Kojima et al., 2022; no worked examples), PaLM-540B goes from 43.0% to 69.2% (§3.5).
- **Confidence** (Fig. 5, GSM8K): consistency is "highly correlated with accuracy", which "suggests that one can use self-consistency to provide an uncertainty estimate" (§3.5).
- **Rationales:** "useful for collecting rationales" (§5), with examples in Tab. 4, 12 and 13.

## Limits the authors state

- "One limitation of self-consistency is that it incurs more computation cost"; people "can try a small number of paths (e.g., 5 or 10) as a starting point to realize most of the gains", "as in most cases the performance saturates quickly" (§5).
- It "can be applied only to problems where the final answer is from a fixed answer set, but in principle this approach can be extended to open-text generation problems if a good metric of consistency can be defined" (§2).
- Models "can sometimes generate incorrect or nonsensical reasoning paths" (Tab. 4's StrategyQA example), and "further work is needed to better ground models' rationale generations" (§5); outputs need "extra caution" (Ethics Statement).
- The gain "is relatively lower for smaller models" (§3.5), and smaller with equation-only reasoning, "since the equations are much shorter" (§3.5).

## Open problems and building blocks

- **Open:** "one could use self-consistency to generate better supervised data to fine-tune the model", for more accurate predictions "in a single inference run" (§5).
- **Released:** "we provide the exact input prompts for all tasks" (Reproducibility Statement; App. A.3). No code release is stated.
- **To reuse it:** a pre-trained model used by prompting only; a sampling decoder; a task-dependent answer parser; a fixed answer set (§2, §3.1); 40 samples per question in the main runs (§3.2). Hardware and run times: App. A.2 (TPUs for UL2, LaMDA and PaLM, the public API for GPT-3; most jobs 1 to 4 hours per task on UL2 and LaMDA-137B, about 2 to 12 on PaLM-540B, and none over 2 days).

## On this site

- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/scaling-general">scaling-general</a></span>
