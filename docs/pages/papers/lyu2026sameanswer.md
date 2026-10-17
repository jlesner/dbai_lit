# Same Answer, New Box: How Much of RLVR's Out-of-Domain Gain Is Answer Format?

**Same Answer, New Box** · preprint 2026

Read: [PDF](https://arxiv.org/pdf/2610.20639) · [arXiv](https://arxiv.org/abs/2610.20639)

<p class="notice">A summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Measures how much of the out-of-domain gain that answer extractors copied from public code report for released RLVR checkpoints over their base models is a change in where the answer is written rather than in the answers; the author reports that on four released 7B SimpleRL base–RL pairs, "82% of the out-of-domain multiple-choice gain that these extractors report disappears" under a fixed extractor of the author's own (abstract; §4.1, Fig. 2).
- Greedy outputs of seven base–RL pairs on eight benchmarks under two prompts, scored by nine harness extractors from six repositories and by one fixed extractor that reads a stated answer inside `\boxed{}` or in the text, the same for both models; the reported gain minus the fixed extractor's gain is the format gain (§2–3, Tab. 1). Checks: LLM readers in the fixed extractor's place (§4.3, App. C), a 32B DAPO pair and a Llama-3.1-8B pilot (§6, App. G), and a survey of how 18 releases produce their out-of-domain multiple-choice numbers (§4.4, App. I).
- A measured transfer gain can partly belong to the grader: any out-of-domain gain scored by answer extraction can hold a format gain, and re-scoring stored outputs with a second extractor that reads both models' stated answers measures it without re-running RL (abstract; §4.4, §7). The author scopes it: the gains split are not the numbers a release publishes (§1, §6), and the result does not hold on the one 32B pair (§6).

## In plain words

Models trained with [RL with verifiable rewards](#/glossary/rl-with-verifiable-rewards-rlvr) on mathematics are also compared with their base models on benchmarks outside it, such as MMLU (a multiple-choice knowledge test), and a gain there is read as transfer (§1). Such scores are usually read by an answer extractor, a program that finds the answer in the text, so a model that learns to write its answer where the extractor looks can score higher without answering better (abstract). The single author scores outputs of base models and their RL successors twice: with extractors copied from public code, and with one of the author's own that reads a stated answer, in a LaTeX answer box or in the text, alike for both. On four released 7B SimpleRL base–RL pairs (from one group's releases), on three out-of-domain multiple-choice benchmarks and outputs generated under the author's two prompts, 82% of the gain the copied extractors report disappears (abstract; §4.1). On one 32B pair trained with another recipe, almost none does (abstract). The author presents this measurement on released checkpoints as new: "To our knowledge, this paper is the first to do so" (§1).

## Background and terms

**Terms to know:** [RLVR](#/glossary/rl-with-verifiable-rewards-rlvr) · [zero-RL training](#/glossary/zero-rl-training) · [out-of-distribution generalization](#/glossary/out-of-distribution-generalization) · [greedy decoding](#/glossary/greedy-decoding-and-temperature-sampling) · [bootstrap resampling](#/glossary/bootstrap-resampling) · [confidence interval](#/glossary/confidence-interval-and-coverage) · [DAPO](#/glossary/dapo) · [chat template](#/glossary/chat-template) (both prompts keep its default system message, which for Qwen2.5-Math-7B asks for the answer "within \boxed{}", §3)

In the glossary's terms (ours): "out of domain" (outside the domain the rewards check, §3) is out-of-distribution, and RL with "no supervised fine-tuning or Distillation into compact models in between" (§3) is zero-RL training.

**The paper's own terms:**
- **`\boxed{}`**: the LaTeX "answer box" (abstract).
- **harness extractor**: an answer extractor copied from public evaluation or training code; nine, from six repositories (App. E, Tab. 16). Its **reported gain**: the RL model's gain over its base model as it reads them (§1).
- **fixed extractor** (ω): the author's, the same for both models; it reads an answer only where one is explicitly stated (inside `\boxed{}`, after "the answer is" or "Answer:", on a line of its own, after "option" or "choice"), else abstains and the item counts as wrong (§2.2; App. B).
- **format gain** and **format share**: reported gain minus the fixed extractor's gain, and its fraction of the reported gain; pooling sums gains before dividing (§2.1).
- **comparison**: one pair, benchmark and prompt, scored by one harness extractor (§2.1).
- **extraction rate**: the share of a model's outputs in which an extractor finds an answer. A comparison is pooled when the reported gain's lower 95% bound is at least 2 points and the fixed extractor reads at least half of each model's outputs, at rates within 20 points (**readable**) (§2.3, Tab. 1).
- **letter step**: Qwen2.5-Math's evaluation loop reads a letter from the text when its extraction function returns none; the paper runs that extractor with it (§3).
- **boxed-instruction** and **plain prompt**: with and without a request of their own for the answer inside `\boxed{}` (§3).

**Missing glossary terms:** none.

**Builds on:**
- SimpleRL-Zoo (Zeng et al., 2025), the RL checkpoints behind most pairs, whose paper "reads the gains as generalization" (§6).
- Format in RL training: Shao et al. (2025) ([Spurious Rewards](#/papers/shao2025spurious "Spurious Rewards: Rethinking Training Signals in RLVR (2025)")), Wang et al. (2025), Du et al. (2026) (§1, §5).
- Chandak et al. (2025a): part of reported gains comes from evaluations that under-read the base model (§1).
- Contrasted with: Yue et al. (2025) ([Does Reinforcement Learning Really…](#/papers/yue2025rlreasoning "Does Reinforcement Learning Really Incentivize Reasoning Capacity in LLMs Beyond the Base Model? (2025)")), Hu et al. (2026), Huan et al. (2025) ([Does Math Reasoning Improve…](#/papers/huan2025mathtransfer "Does Math Reasoning Improve General LLM Capabilities? Understanding Transferability of LLM Reasoning (2025)")), Hochlehnert et al. (2025) ([A Sober Look at…](#/papers/hochlehnert2025sober "A Sober Look at Progress in Language Model Reasoning: Pitfalls and Paths to Reproducibility (2025)")) (§5).

## Problem and setting

- **Question:** how much of the out-of-domain multiple-choice gain that harness extractors report for released RLVR checkpoints is format gain (§1).
- **Pairs:** seven, from the releases SimpleRL-Zoo, SimpleRL-Zero and Open-Reasoner-Zero, on Qwen2.5-Math-7B, Qwen2.5-7B, Qwen2.5-1.5B, Mistral-7B-v0.1 and DeepSeek-Math-7B (§3, Tab. 1); twelve candidates failed the admission rule, RL directly from a named public base model (App. A). Four enter the main result: DeepSeek-Math-7B shows no gain to split, the Qwen2.5-1.5B base model almost always hits the token limit, and Open-Reasoner-Zero's models ship different chat templates (§3, App. A).
- **Benchmarks:** out of domain, MMLU, MMLU-Pro, ARC-Challenge (multiple choice) and BBH (free-form) (knowledge, science and reasoning tests); in domain, the math tests MATH-500, GSM8K (free-form), AQuA-RAT, SAT-Math (multiple choice); up to 500 items each, frozen before generation (§3).
- **Generation:** greedy, at most 2,048 new tokens, in each checkpoint's chat template where it ships one (§3; App. J).
- **Extractors:** for multiple choice, the MATH benchmark's evaluation code and Open-Reasoner-Zero's (the last `\boxed{}`), Qwen2.5-Math's (`\boxed{}` first, then letters; on MMLU the letter first) and OpenAI's simple-evals harness (a line "Answer: X") (Tab. 1; App. E, Tab. 16); five more read free-form answers only (App. E).
- **Correct:** an unread answer is wrong; multiple choice is scored on the extracted answer's first character (App. E).

## Approach

- **Robustness** (§4.3, Fig. 4; App. D): stricter and looser fixed extractors, other pooling rules, leaving one pair, benchmark or extractor out, and an external extractor in ω's place.
- **Independent readers** (§4.3, App. C): Claude Sonnet 5 and Claude Haiku 4.5 each read 2,720 sampled responses, blind to model, key and extractors' readings; Claude Opus 5.5 settled disagreements; outcomes and their readings declared before sampling.
- **Beyond the grid** (App. G): Mistral-Small-24B and Qwen2.5-32B pairs, set apart, their reading declared before generation, and a Llama-3.1-8B pilot.

## Results

- **Main result** (§4.1, Fig. 2): on MMLU, MMLU-Pro and ARC-Challenge the harness extractors report an average gain of 22.5 points per comparison, the fixed extractor 4.0 on the same outputs; pooled over 46 comparisons the format share is 82.2% (95% confidence interval, CI, 77.4–87.2%).
- **Mechanism** (§4.2, Fig. 3): over six pairs, of the out-of-domain multiple-choice outputs the fixed extractor reads, 26.6% of the base models' contain a `\boxed{}`, against 58.3% of the RL models'; nearly all the base models' other answers are stated in the text. On MATH-500 and GSM8K both box almost every answer, and box-only extractors' format gain is near zero.
- **Robustness** (§4.3): in every row of Fig. 4 most of the reported gain remains format gain; the share is 79% under the boxed-instruction prompt and 86% under the plain one, and 77% scored by the readers. Under the declared rule the outcome is "inconclusive" (App. C).
- **Extractor dependence** (§4.4, Fig. 5): gains on identical outputs change with the extractor, "sometimes even in sign". On its own comparisons, Qwen2.5-Math's extractor leaves 56% as format gain, against 85% and 83% for the two box-only extractors (App. D, Tab. 13). Across the main result's seven combinations of base model and extractor, the share is lower where the extractor reads more of the base model's outputs, a relation that "rests mostly on Qwen2.5-Math's extractor" (§4.4); "Seven points do not support a prediction beyond these combinations" (App. H).
- **The 32B pair** (§6; App. G, Tab. 22): with Qwen2.5-32B and DAPO the share is 2.1% over 9 comparisons (95% CI −18.5% to 19.9%); asked for the box, its base model already boxes nearly every answer, and unasked, the DAPO model rarely does (§6). Mistral-Small-24B has too few comparisons for a share (§6).
- **Published numbers:** where the surveyed releases say how, their out-of-domain multiple-choice results "were almost always read out of generated text", "so a format gain can arise in them too" (§1; App. I).

## Limits the authors state

- "No published gain is decomposed": the prompts and box-first pairing are the author's, and SimpleRL-Zoo's evaluation was not reproduced, "so the 82% is not an estimate for its numbers" (§6).
- "Nearly all of the gain behind the 82% is reported by extractors that read \boxed{} first"; one that also reads letters reports less, and the share depends on running Qwen2.5-Math's extractor with its letter step (§6).
- "One release family at 7B": the Qwen base models carry nearly all the gain; "Whether the share holds in other model families is open" (§6).
- Prompts: a pilot prompt replacing the default system message gave a much lower share on one pair and benchmark: "The share is thus a property of the pair, the prompt and the extractors together" (§6).
- Scale: "The 82% does not hold on the one larger pair with gains to split", and "One pair cannot say whether this comes from scale, the DAPO recipe or the base model" (§6).
- "The fixed extractor can fail": on the Llama pilot RL moved answers away from where it reads, and it reports a loss; the extraction-rate criterion keeps that pilot out of the 82% (§6).
- The readers' check "used language models; no person has read the responses" (§6); its sample "is too small to say whether 77% and 82% differ" (§4.3).
- Intervals "do not cover variation between pairs or between benchmarks" (§2.3).
- The fixed-extractor variants show "that the share is insensitive within one family of rules, not that the family is right" (App. B).
- The external extractor's pooled agreement with ω "is a cancellation" and does not hold comparison by comparison (App. D, Tab. 15).
- On the outputs of Fig. 1 the fixed extractor misses base-model answers, so there its gain "overstates the gain in answers" (§4.4).
- Applying Open-Reasoner-Zero's extractor to whole responses lowers the share "by an amount not computed" (App. E, Tab. 17).
- On the other benchmark groups the share "is not stable enough to quote" (§4.1): whether format gain reaches free-form answers out of domain is "untested", and the domain contrast is unresolved (App. F).
- The survey "says nothing about how large the format gain is in these releases, and the 18 are not a systematic sample" (App. I).

## Open problems and building blocks

- **Open:** "Splitting the published gains would take outputs generated under the release's own prompt and decoding" (App. I). Three proposed practices, none needing an RL re-run: name the extractor behind every number, report its extraction rate on the base model, and re-score with a second extractor that reads both models' stated answers (§7).
- **Released:** the arXiv ancillary files: analysis code, frozen items with hashes, result files, records behind the appendices' counts, the readers' material, the written declarations, the Llama pilot's 8 generation files, and the hash of all 264; the other 256 "are available from the author" (§ "Reproducibility" after §7; App. J "Release").
- **To reuse it:** it "needs only the two models' outputs, re-read by one extractor on a CPU, and no RL run" (§1); the grid's generation took 29.7 GPU-hours (App. J).

## On this site

- **Discussed in:** [Benchmarks with checkable ground truth](#/challenges/checkable_benchmark_ground_truth) · [Comparing LLM methods under noise](#/challenges/method_comparison_under_noise) · [Gains made against a checker, carried beyond it](#/challenges/transfer_beyond_the_checker)
- **Tags:** <span class="tags"><a class="tag" href="#/tags/labels">labels</a><a class="tag" href="#/tags/transfer">transfer</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/rlvr-general">rlvr-general</a></span>
