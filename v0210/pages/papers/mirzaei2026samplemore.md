# Sample More, Reflect Less: Self-Refine and Reflexion Lose to Repeated Sampling at Equal Token Cost, from 1.5B to 7B

**Sample More, Reflect Less** · preprint 2026

Read: [PDF](https://arxiv.org/pdf/2607.28576) · [arXiv](https://arxiv.org/abs/2607.28576)

<p class="notice">An AI-written summary for orientation, not a source: check the original paper before relying on anything here.</p>

## In brief

- Compares seven reasoning methods (single-sample, self-inspection, best-of-N self-verification, debate) with repeated sampling at equal measured token cost, on 1.5B–7B open models (four of the seven at 7B) and two math benchmarks (abstract; methods in §4.3 Tab. 1; 7B rows in Tab. 2).
- Paired by question, with bootstrap intervals and multiplicity correction (abstract; §4.5).
- It reports no method reliably better than repeated sampling at equal cost, and all 18 self-inspection comparisons negative (abstract): which lever pays for compact models.

## In plain words

Many prompting methods aim to make a language model reason better without retraining: planning first, self-critique and rewriting, reflecting and retrying, picking the best of several attempts, or debating copies of itself. The author points out that nearly all of them also make the model write far more text, which raises accuracy by itself, and that an earlier study making this point gave no significance tests (abstract, §1). This paper reruns the comparison as a designed experiment: seven methods on open models of 1.5B and 3B parameters, four also at 7B, on two math benchmarks, each against sampling several answers and keeping the most common one, at the method's own measured token cost (abstract; §5). It reports that no method is reliably better than that in any setting, and ten comparisons are reliably worse, all for methods where the model inspects its own output (abstract). The model picking among its own samples loses to counting them at 1.5B, but not distinguishably at 7B (abstract). The author calls it "a replication with extensions, not a new phenomenon" (§1).

## Background and terms

**Terms to know:** [self-consistency](#/glossary/self-consistency-majority-voting) · [best-of-N sampling](#/glossary/best-of-n-sampling) · [LLM-as-a-judge](#/glossary/llm-as-a-judge) · [bootstrap resampling](#/glossary/bootstrap-resampling) · [multiple testing](#/glossary/multiple-testing) · [post-training quantization](#/glossary/post-training-quantization)

**The paper's own terms:**
- **Cost**: tokens the model generates, summed over every call a method makes for one question, critiques, reflections and debate messages included; input tokens are not counted (§2.3, App. A.7).
- **Sampling baseline**: self-consistency as a curve of accuracy against cost, one point per number of samples N; SC@N is self-consistency with N samples (§2.2, §4.7).
- **Setting**: one model on one benchmark; the results have six (§5).
- **Cost-matched difference (Δ)**: a method's accuracy minus the baseline's at the method's mean cost, in percentage points ("pp"), paired on questions (§4.5, Tab. 2).
- **The methods** (Tab. 1, App. A.2): **Chain-of-Thought** and **Plan-and-Solve** (asked to devise a plan first), one greedy pass each; **Self-Refine**, which writes, critiques and rewrites for three rounds; **Multi-Agent Debate**, three copies revising against each other for two rounds, ending in a majority vote (§4.7).
- **Best-of-N (self-verify)**: eight samples, then the same untrained model is asked in one prompt "Which solution is most likely correct?" (Tab. 1, App. A.2, §3); unlike the glossary's general form, the generator itself chooses. **Counting**: the majority vote over the same eight samples (§5.3).
- **Reflexion**: after each attempt the model is asked whether its own answer is correct, and reflects and retries only if it says no; the paper presents this as "Reflexion as specified" (§4.3). **Reflexion (forced)**, "ours, not theirs", always runs its three reflect-and-retry rounds (§4.3).
- **Self-inspection**: methods in which the model assesses or rewrites its own output: Self-Refine, Reflexion (forced), Best-of-N (§5.1).
- **Override accuracy**: where the verifier's pick and the majority disagree and exactly one is right, the share where the verifier is right (§6.3).

**Builds on:**
- Wang et al., "Reasoning in token economies" (2024), "the source of the claim we test": self-consistency often beats other strategies once budgets are comparable (§3).
- Self-consistency as the baseline (§2.2; [Self-Consistency](#/papers/wang2022selfconsistency "Self-Consistency Improves Chain of Thought Reasoning in Language Models (2023)")).
- The methods tested, each implemented "from the description in its original paper" (§4.3), among them Self-Refine and Reflexion ([Reflexion](#/papers/shinn2023reflexion "Reflexion: Language Agents with Verbal Reinforcement Learning (2023)")).
- Huang et al., on self-correction without being told whether the answer was right; the paper adopts their rule that no method sees the correct answer (§3, §4.3).

## Problem and setting

- **Question:** whether the predecessor's conclusion "survives being tested rather than asserted, and what explains it" (§7), and whether it holds below 7B (§1).
- **Models:** §4.1 names Qwen2.5-1.5B-Instruct and Qwen2.5-3B-Instruct (instruction-tuned open-weight models), run with the llama.cpp inference engine at 8 bits per weight on one CPU machine without GPU. Tab. 2 adds Qwen2.5-7B for Chain-of-Thought, Self-Refine, Reflexion (forced) and Best-of-N.
- **Benchmarks:** GSM8K (grade-school word problems with an integer answer; [GSM8K and trained verifiers](#/papers/cobbe2021verifiers "Training Verifiers to Solve Math Word Problems (2021)")) and MATH-500 (a 500-problem subset of competition mathematics), 150 questions each, the same for every method and model (§4.2).
- **Correct** means the parsed final answer matches the gold one, numerically for GSM8K, as normalised strings or numerically for MATH-500; an unparseable answer is wrong (§4.4, §5.5).
- **Fixed choices:** no method is shown the correct answer (§4.3); configurations fixed in advance, not tuned (§4.7); temperature 0 for deterministic methods, 0.7 for sampling ones; a 1,024-token cap per call (§4.3).
- **Scope:** "we do not test frontier models" (§1).

## Approach

- **Measure cost, then match it** (§2): compare each method with the baseline curve at its own measured cost, instead of a shared query or token cap as in the predecessor (§1 contribution 3, §3).
- **The whole curve from one pool** (§2.4): sample 16 chains per question once; for each of eight values of N up to 16, draw N chains without replacement 200 times, scoring each draw's majority vote and summed length together. Between those N the curve is linearly interpolated, which the author says makes the baseline slightly weaker, favouring the methods tested (§4.5, §4.7).
- **Statistics** (§4.5): paired bootstrap over questions, 10,000 resamples, 95% intervals, two-sided p-values, Holm–Bonferroni correction across the seven methods within each setting.
- **Judging versus counting** (§5.3): on Best-of-N's eight samples, compare the model's pick with the majority answer; samples, tokens and model are identical, only the final step differs.

## Results

- **Main comparison** (§5.1, Tab. 2, Fig. 1): of the 36 method–setting comparisons, after the within-setting correction, none is significantly better than self-consistency at matched cost, 10 are significantly worse and 26 indistinguishable; all ten are self-inspecting methods (abstract).
- **Grouping** (§5.1): Self-Refine, Reflexion (forced) and Best-of-N are below the baseline in all 18 of their comparisons, a grouping formed after a scoring fix (see Limits). The grouping fixed in advance (Self-Refine, Reflexion (forced), Debate) is below in every comparison; methods without self-assessment are "at chance".
- **Across all 36 at once** (§5.5): a Holm correction over all comparisons leaves 2 significant.
- **Judging versus counting** (§5.3, Fig. 3; abstract): counting beats the model's pick by 8.0 and 11.3 points at 1.5B but only 2.0 and 1.3 at 7B; significant in all four settings below 7B, in neither at 7B, where the author does "not claim that counting still beats judging" (§5.3).
- **Why the gap closes** (§6.3): the verifier departs from the majority less often as models grow, but when it does it is right in under half of the disagreements where exactly one of the two is correct, in every setting: "convergence from below rather than an approach to a crossing".
- **Rewriting at 7B** (abstract, §5.1): Self-Refine and Reflexion (forced) stay significantly below the equal-cost baseline, by 3.6 to 10.1 points.
- **Reflexion's stop signal** (§5.5, §6.2): on Qwen2.5-1.5B the model judged its first answer correct on every question in both benchmarks, so Reflexion ran as one chain of thought; on Qwen2.5-3B it fired more often. Forced, the loop lands below the baseline (§6.2).
- **Input tokens** (§4.7): on total tokens the verdict moves further against Best-of-N in every setting; at 7B it stays indistinguishable from zero.
- **Robustness** (§5.5): the 1,024-token cap cut off some MATH-500 answers, more for single-shot than voting methods; in the three MATH-500 settings, restricting to questions every method answered changes some verdicts, in both directions.
- **Power** (§4.6): the design can identify differences of "roughly five to six percentage points or larger in the typical case".

## Limits the authors state

- Intervals cover question variance only: the three randomised methods were each "executed once", so their intervals are "lower bounds on total uncertainty" (§4.7).
- "What we cannot rule out is that a longer or more structured rubric, or a verifier prompted to score each candidate separately rather than choose among them, would do better" (§4.7).
- Reflexion's non-firing "is a property of the model's response to our judging prompt, not a theorem about Reflexion" (§4.7).
- Fixed configurations risk "under-representing each method's best case" (§4.7); "A different implementation could perform differently" (§6.5).
- Temperature is confounded with method; §5.4 checks greedy against SC@1 (§4.7). Debate "sits between our two groups" (§4.7). Input tokens were not reconstructed for Self-Refine, Reflexion or debate (§4.7).
- The self-inspection grouping is "a description of the pattern rather than as a hypothesis test"; a sign test (counting negative results as coin flips) treats the comparisons as independent, "which they are not", and the clustered test, which counts settings where all such methods come out negative, is "the honest one" (§5.1).
- Of the full analysis and the rerun on questions every method answered, "Neither analysis is therefore automatically the correct one" (§5.5).
- Beyond 7B, the closing-gap reading is "a falsifiable prediction rather than a result" (§6.3); "We cannot go beyond 7B on the hardware available" (§6.5); they cannot rule out that 8-bit quantisation interacts with the methods differently (§6.5).
- Mathematics only: "It is entirely possible that self-criticism helps on the tasks it was designed for and hurts here" (§6.5); "we do not claim the true effects are zero" (§6.1).
- The headline Best-of-N result changed after a scoring bug was fixed (App. A.5).

## Open problems and building blocks

- **Open:** "None of this settles what happens above 7B, on open-ended tasks, or under a cost measure that charges for input tokens" (§7). For judging to overtake counting, override accuracy "would have to climb past one half" (§6.3). A better verifier rubric can be tested on the stored candidates (§4.7). Open-ended tasks need "a different measure of quality than exact-match accuracy" (§6.5).
- **Advice:** "Any evaluation of adaptive methods should report how often the adaptive part actually engages" (§6.2); method papers should report the self-consistency accuracy-versus-generated-tokens curve on the same questions and model (§6.6).
- **Released:** "We release the code, the prompts, every generation, and the scripts we used to check our own numbers" (abstract; also §1, App. A.6).
- **To reuse it:** one pool of samples per benchmark gives the whole baseline curve (§6.6); majority voting needs answers comparable for equality, so on prose the baseline does not exist (§6.5); the runs used llama.cpp on one 32-core CPU machine (§4.1, App. A.1).

## On this site

- **Discussed in:** [Bringing compact models to frontier accuracy](#/challenges/compact_model_accuracy) · [Comparing LLM methods under noise](#/challenges/method_comparison_under_noise) · [Whole-job reliability of multi-step LLM work](#/challenges/whole_job_reliability)
- **Tags:** <span class="tags"><a class="tag sub" href="#/tags/harness-general">harness-general</a><a class="tag sub" href="#/tags/judge-general">judge-general</a><a class="tag sub" href="#/tags/llm-method">llm-method</a><a class="tag sub" href="#/tags/scaling-general">scaling-general</a></span>
